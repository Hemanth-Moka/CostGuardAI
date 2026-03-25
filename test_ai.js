const fs = require('fs');
const path = require('path');
const aiService = require('./backend/services/aiService');

async function runTest() {
  console.log("Loading sample data...");
  const dataPath = path.join(__dirname, 'sample-data.json');
  const rawData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  
  // Assign dummy IDs to data
  const dataRecords = rawData.map((d, i) => ({ ...d, id: i + 1 }));

  console.log("Running AI Analysis (Rules Mode)...");
  const insights = aiService.analyzeWithRules(dataRecords);
  
  console.log(`\\nFound ${insights.length} insights:`);
  insights.forEach(i => console.log(`- [${i.severity.toUpperCase()}] ${i.type}: ${i.title}`));

  console.log("\\nGenerating Playbook Recommendations...");
  for (const insight of insights) {
    const affected = dataRecords.filter(r => insight.affectedRecordIds.includes(r.id));
    const recs = await aiService.generateRecommendations(insight, affected);
    recs.forEach(r => {
      console.log(`\\nAction: ${r.actionType}`);
      console.log(`Title: ${r.title}`);
      console.log(`Playbook: ${r.description}`);
      console.log(`Est Savings: ${r.estimatedSavings}`);
    });
  }
}

runTest().catch(console.error);
