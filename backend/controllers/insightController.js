const Insight = require('../models/Insight');
const DataRecord = require('../models/DataRecord');
const Recommendation = require('../models/Recommendation');
const ImpactMetrics = require('../models/ImpactMetrics');
const aiService = require('../services/aiService');

exports.analyzeData = async (req, res) => {
  try {
    const dataRecords = await DataRecord.find({ status: 'active' });

    if (dataRecords.length === 0) {
      return res.status(400).json({ error: 'No data available for analysis' });
    }

    const analysisResults = await aiService.analyzeData(dataRecords);

    const insights = [];
    for (const result of analysisResults) {
      const insight = await Insight.create({
        type: result.type,
        title: result.title,
        description: result.description,
        severity: result.severity,
        estimatedSavings: result.estimatedSavings,
        confidence: result.confidence,
        affectedRecords: result.affectedRecordIds
      });

      const affectedRecords = await DataRecord.findByIds(result.affectedRecordIds);
      const recommendations = await aiService.generateRecommendations(insight, affectedRecords);

      for (const rec of recommendations) {
        await Recommendation.create({
          insightId: insight.id,
          title: rec.title,
          description: rec.description,
          actionType: rec.actionType,
          estimatedSavings: rec.estimatedSavings,
          monthlySavings: rec.monthlySavings,
          yearlySavings: rec.yearlySavings,
          riskLevel: rec.riskLevel,
          affectedRecords: result.affectedRecordIds
        });
      }

      insights.push(insight);
    }

    await this.updateSavingsIdentified();

    res.json({ 
      message: 'Analysis completed', 
      insightsCount: insights.length,
      insights 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getInsights = async (req, res) => {
  try {
    const { status, type } = req.query;
    const filter = {};
    
    if (status) filter.status = status;
    if (type) filter.type = type;

    const insights = await Insight.find(filter);
    
    res.json(insights);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateSavingsIdentified = async () => {
  const period = new Date().toISOString().slice(0, 7);
  let metrics = await ImpactMetrics.findOne({ period });

  if (!metrics) {
    metrics = { period, savingsIdentified: 0 };
  }

  const activeInsights = await Insight.find({ status: 'active' });
  metrics.savingsIdentified = activeInsights.reduce((sum, i) => sum + (parseFloat(i.estimated_savings) || 0), 0);

  await ImpactMetrics.save(metrics);
};
