const OpenAI = require('openai');

class AIService {
  constructor() {
    this.openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;
  }

  async analyzeData(dataRecords) {
    if (this.openai) {
      return await this.analyzeWithOpenAI(dataRecords);
    }
    return this.analyzeWithRules(dataRecords);
  }

  async analyzeWithOpenAI(dataRecords) {
    try {
      const prompt = `Analyze this enterprise cost data and identify inefficiencies:
${JSON.stringify(dataRecords, null, 2)}

Return JSON array with format:
[{
  "type": "duplicate_tools|unused_licenses|cost_anomaly|sla_breach_risk|underutilized_infrastructure|invoice_discrepancy",
  "title": "Brief title",
  "description": "Detailed description with explainable AI reasoning",
  "severity": "low|medium|high|critical",
  "estimatedSavings": number,
  "confidence": number (0-100),
  "affectedRecordIds": [ids]
}]`;

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3
      });

      return JSON.parse(response.choices[0].message.content);
    } catch (error) {
      console.error('OpenAI analysis failed, falling back to rules:', error.message);
      return this.analyzeWithRules(dataRecords);
    }
  }

  analyzeWithRules(dataRecords) {
    const insights = [];
    const toolMap = {};
    
    dataRecords.forEach(record => {
      const key = record.name.toLowerCase();
      if (!toolMap[key]) toolMap[key] = [];
      toolMap[key].push(record);
    });

    Object.entries(toolMap).forEach(([name, records]) => {
      if (records.length > 1) {
        const totalCost = records.reduce((sum, r) => sum + (parseFloat(r.cost) || 0), 0);
        insights.push({
          type: 'duplicate_tools',
          title: `Duplicate Tool: ${records[0].name}`,
          description: `Found ${records.length} instances of ${records[0].name} across departments. Consolidation recommended.`,
          severity: 'high',
          estimatedSavings: totalCost * 0.7,
          confidence: 85,
          affectedRecordIds: records.map(r => r.id)
        });
      }

      records.forEach(record => {
        if (record.licenses > 0 && record.activeUsers > 0) {
          const utilization = record.activeUsers / record.licenses;
          if (utilization < 0.5) {
            const unusedLicenses = record.licenses - record.activeUsers;
            const costPerLicense = (parseFloat(record.cost) || 0) / record.licenses;
            insights.push({
              type: 'unused_licenses',
              title: `Unused Licenses: ${record.name}`,
              description: `${unusedLicenses} unused licenses detected. Utilization: ${(utilization * 100).toFixed(1)}%`,
              severity: utilization < 0.3 ? 'high' : 'medium',
              estimatedSavings: unusedLicenses * costPerLicense,
              confidence: 90,
              affectedRecordIds: [record.id]
            });
          }
        }
      });
    });

    const avgCost = dataRecords.reduce((sum, r) => sum + (parseFloat(r.cost) || 0), 0) / (dataRecords.length || 1);
    dataRecords.forEach(record => {
      // 1. Cost Anomaly
      if (record.type === 'saas' || !record.type) {
        if (record.cost > avgCost * 2) {
          insights.push({
            type: 'cost_anomaly',
            title: `Cost Anomaly: ${record.name}`,
            description: `Cost is ${(((parseFloat(record.cost) || 0) / avgCost) * 100).toFixed(0)}% above average. Review recommended.`,
            severity: 'medium',
            estimatedSavings: ((parseFloat(record.cost) || 0) - avgCost) * 0.3,
            confidence: 70,
            affectedRecordIds: [record.id]
          });
        }
      }

      const meta = record.metadata || {};

      // 2. SLA & Penalty Prevention Agent
      if (record.type === 'sla_contract') {
        const breachProb = parseFloat(meta.sla_breach_probability) || 0;
        const currentM = parseFloat(meta.metrics_current) || 0;
        const targetM = parseFloat(meta.metrics_target) || 0;
        
        if (breachProb > 0.5 || (targetM > 0 && currentM < targetM)) {
          const penalty = parseFloat(meta.penalty_amount) || (record.cost * 0.5);
          insights.push({
            type: 'sla_breach_risk',
            title: `SLA Breach Risk: ${record.name}`,
            description: `AI Reasoning: Metrics currently at ${currentM}% vs target ${targetM}%. Probability of breach is ${(breachProb * 100).toFixed(0)}%. Rerouting resources can prevent penalty.`,
            severity: breachProb > 0.8 ? 'critical' : 'high',
            estimatedSavings: penalty,
            confidence: breachProb > 0 ? Math.min(Math.round(breachProb * 100) + 10, 95) : 85,
            affectedRecordIds: [record.id]
          });
        }
      }

      // 3. Resource Optimization Agent
      if (record.type === 'infrastructure') {
        const cpuUtil = parseFloat(meta.cpu_utilization) || 100;
        const memUtil = parseFloat(meta.memory_utilization) || 100;
        
        if (cpuUtil < 40 && memUtil < 40) {
          insights.push({
            type: 'underutilized_infrastructure',
            title: `Underutilized Resource: ${record.name}`,
            description: `AI Reasoning: Persistent low utilization (CPU: ${cpuUtil}%, Mem: ${memUtil}%). Scaling down or consolidating instances recommended.`,
            severity: cpuUtil < 20 ? 'high' : 'medium',
            estimatedSavings: record.cost * 0.4,
            confidence: 90,
            affectedRecordIds: [record.id]
          });
        }
      }

      // 4. Financial Operations Agent
      if (record.type === 'invoice' || record.type === 'transaction') {
        const variance = parseFloat(meta.variance_amount) || 0;
        
        if (variance > 0) {
          insights.push({
            type: 'invoice_discrepancy',
            title: `Invoice Discrepancy: ${record.name}`,
            description: `AI Reasoning: Detected a variance of ₹${variance} between PO and final invoice. Manual review and reconciliation required.`,
            severity: variance > (record.cost * 0.1) ? 'high' : 'medium',
            estimatedSavings: variance,
            confidence: 95,
            affectedRecordIds: [record.id]
          });
        }
      }
    });

    return insights;
  }

  async generateRecommendations(insight, affectedRecords) {
    const recommendations = [];

    switch (insight.type) {
      case 'duplicate_tools':
        recommendations.push({
          title: `Consolidate ${affectedRecords[0].name}`,
          description: `Merge all instances into a single enterprise license. Estimated savings: ₹${insight.estimatedSavings.toFixed(0)}/month`,
          actionType: 'consolidate_tools',
          estimatedSavings: insight.estimatedSavings,
          monthlySavings: insight.estimatedSavings,
          yearlySavings: insight.estimatedSavings * 12,
          riskLevel: 'low'
        });
        break;

      case 'unused_licenses':
        const record = affectedRecords[0];
        const unusedCount = record.licenses - record.activeUsers;
        recommendations.push({
          title: `Reduce ${record.name} licenses`,
          description: `Remove ${unusedCount} unused licenses. Keep ${record.activeUsers} active licenses.`,
          actionType: 'reduce_licenses',
          estimatedSavings: insight.estimatedSavings,
          monthlySavings: insight.estimatedSavings,
          yearlySavings: insight.estimatedSavings * 12,
          riskLevel: 'low'
        });
        break;

      case 'cost_anomaly':
        recommendations.push({
          title: `Review ${affectedRecords[0].name} pricing`,
          description: `Negotiate better rates or consider alternatives. Current cost is significantly above average.`,
          actionType: 'renegotiate',
          estimatedSavings: insight.estimatedSavings,
          monthlySavings: insight.estimatedSavings,
          yearlySavings: insight.estimatedSavings * 12,
          riskLevel: 'medium'
        });
        break;

      case 'sla_breach_risk':
        recommendations.push({
          title: `Mitigate SLA Risk for ${affectedRecords[0].name}`,
          description: `Playbook: 1. Acknowledge alert 2. Reroute overflow traffic to fallback 3. Approve resource shift to stabilize metrics. Prevents penalty of ₹${insight.estimatedSavings}.`,
          actionType: 'reroute_traffic',
          estimatedSavings: insight.estimatedSavings,
          monthlySavings: 0,
          yearlySavings: insight.estimatedSavings,
          riskLevel: 'low'
        });
        break;

      case 'underutilized_infrastructure':
        recommendations.push({
          title: `Scale Down ${affectedRecords[0].name}`,
          description: `Playbook: 1. Snapshot current state 2. Scale down instance sizing to match 30% baseline. Saves ₹${insight.estimatedSavings}/month.`,
          actionType: 'scale_down_servers',
          estimatedSavings: insight.estimatedSavings,
          monthlySavings: insight.estimatedSavings,
          yearlySavings: insight.estimatedSavings * 12,
          riskLevel: 'medium'
        });
        break;

      case 'invoice_discrepancy':
        recommendations.push({
          title: `Reconcile ${affectedRecords[0].name}`,
          description: `Playbook: 1. Flag variance to vendor 2. Withhold overpayment amount (₹${insight.estimatedSavings}) 3. Sync approved amount to ERP.`,
          actionType: 'reconcile_invoice',
          estimatedSavings: insight.estimatedSavings,
          monthlySavings: insight.estimatedSavings,
          yearlySavings: insight.estimatedSavings * 12,
          riskLevel: 'low'
        });
        break;
    }

    return recommendations;
  }
}

module.exports = new AIService();
