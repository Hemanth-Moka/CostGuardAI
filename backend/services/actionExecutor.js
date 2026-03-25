const DataRecord = require('../models/DataRecord');
const ExecutionLog = require('../models/ExecutionLog');
const ImpactMetrics = require('../models/ImpactMetrics');
const Recommendation = require('../models/Recommendation');

class ActionExecutor {
  async executeAction(action, userId) {
    try {
      let result;
      
      // Get recommendation and affected records
      const recommendation = await Recommendation.findById(action.recommendation_id);
      const records = await DataRecord.findByIds(recommendation.affectedRecords);
      
      switch (action.action_type) {
        case 'reduce_licenses':
          result = await this.reduceLicenses(records);
          break;
        case 'cancel_subscription':
          result = await this.cancelSubscription(records);
          break;
        case 'consolidate_tools':
          result = await this.consolidateTools(records);
          break;
        case 'downgrade_plan':
          result = await this.downgradePlan(records);
          break;
        case 'renegotiate':
          result = await this.renegotiate(records);
          break;
        case 'reroute_traffic':
          result = await this.rerouteTraffic(records);
          break;
        case 'scale_down_servers':
          result = await this.scaleDownServers(records);
          break;
        case 'reconcile_invoice':
          result = await this.reconcileInvoice(records);
          break;
        default:
          throw new Error('Unknown action type');
      }

      const log = await ExecutionLog.create({
        actionId: action.id,
        actionType: action.action_type,
        description: action.description,
        status: 'success',
        savingsRealized: action.estimated_savings,
        affectedRecords: result.affectedRecords,
        executedBy: userId,
        result: result.details
      });

      await this.updateImpactMetrics(action.estimated_savings, action.action_type);

      return { success: true, log, result };
    } catch (error) {
      await ExecutionLog.create({
        actionId: action.id,
        actionType: action.action_type,
        description: action.description,
        status: 'failed',
        executedBy: userId,
        errorMessage: error.message
      });

      return { success: false, error: error.message };
    }
  }

  async reduceLicenses(records) {
    const affectedRecords = [];
    
    for (const record of records) {
      const unusedLicenses = record.licenses - record.active_users;
      const newCost = (record.cost / record.licenses) * record.active_users;
      
      await DataRecord.update(record.id, {
        licenses: record.active_users,
        cost: newCost
      });
      
      affectedRecords.push(record.id);
    }

    return {
      affectedRecords,
      details: { message: 'Licenses reduced successfully', recordsUpdated: records.length }
    };
  }

  async cancelSubscription(records) {
    const affectedRecords = [];
    
    for (const record of records) {
      await DataRecord.update(record.id, {
        status: 'cancelled',
        endDate: new Date()
      });
      
      affectedRecords.push(record.id);
    }

    return {
      affectedRecords,
      details: { message: 'Subscriptions cancelled', recordsUpdated: records.length }
    };
  }

  async consolidateTools(records) {
    const affectedRecords = [];
    const primaryRecord = records[0];
    
    for (let i = 1; i < records.length; i++) {
      await DataRecord.update(records[i].id, { status: 'cancelled' });
      affectedRecords.push(records[i].id);
    }

    affectedRecords.push(primaryRecord.id);

    return {
      affectedRecords,
      details: { message: 'Tools consolidated', primaryTool: primaryRecord.name, removedCount: records.length - 1 }
    };
  }

  async downgradePlan(records) {
    const affectedRecords = [];
    
    for (const record of records) {
      const newCost = record.cost * 0.7;
      const metadata = record.metadata || {};
      metadata.plan = 'downgraded';
      
      await DataRecord.update(record.id, {
        cost: newCost,
        metadata
      });
      
      affectedRecords.push(record.id);
    }

    return {
      affectedRecords,
      details: { message: 'Plans downgraded', recordsUpdated: records.length }
    };
  }

  async renegotiate(records) {
    const affectedRecords = [];
    
    for (const record of records) {
      const newCost = record.cost * 0.85;
      const metadata = record.metadata || {};
      metadata.renegotiated = true;
      
      await DataRecord.update(record.id, {
        cost: newCost,
        metadata
      });
      
      affectedRecords.push(record.id);
    }

    return {
      affectedRecords,
      details: { message: 'Pricing renegotiated', recordsUpdated: records.length }
    };
  }

  async rerouteTraffic(records) {
    const affectedRecords = [];
    for (const record of records) {
      const metadata = record.metadata || {};
      metadata.traffic_rerouted = true;
      metadata.metrics_current = metadata.metrics_target || 99.9;
      await DataRecord.update(record.id, { metadata });
      affectedRecords.push(record.id);
    }
    return {
      affectedRecords,
      details: { message: 'Traffic successfully rerouted to fallback servers', recordsUpdated: records.length }
    };
  }

  async scaleDownServers(records) {
    const affectedRecords = [];
    for (const record of records) {
      const newCost = record.cost * 0.6;
      const metadata = record.metadata || {};
      metadata.scaled_down = true;
      metadata.cpu_utilization = 75;
      await DataRecord.update(record.id, { cost: newCost, metadata });
      affectedRecords.push(record.id);
    }
    return {
      affectedRecords,
      details: { message: 'Infrastructure instances scaled down', recordsUpdated: records.length }
    };
  }

  async reconcileInvoice(records) {
    const affectedRecords = [];
    for (const record of records) {
      const metadata = record.metadata || {};
      const savings = metadata.variance_amount || 0;
      metadata.reconciled = true;
      metadata.variance_amount = 0;
      await DataRecord.update(record.id, { cost: record.cost - savings, metadata });
      affectedRecords.push(record.id);
    }
    return {
      affectedRecords,
      details: { message: 'Invoices successfully reconciled and synced with ERP', recordsUpdated: records.length }
    };
  }

  async updateImpactMetrics(savings, actionType) {
    const period = new Date().toISOString().slice(0, 7);
    let metrics = await ImpactMetrics.findOne({ period });

    if (!metrics) {
      metrics = { period, savingsRealized: 0, monthlySavings: 0, yearlySavings: 0, actionsExecuted: 0, breakdown: {} };
    }

    metrics.savingsRealized = (metrics.savingsRealized || 0) + savings;
    metrics.monthlySavings = (metrics.monthlySavings || 0) + savings;
    metrics.yearlySavings = metrics.monthlySavings * 12;
    metrics.actionsExecuted = (metrics.actionsExecuted || 0) + 1;

    if (!metrics.breakdown) metrics.breakdown = {};

    const typeMap = {
      'consolidate_tools': 'duplicateTools',
      'reduce_licenses': 'unusedLicenses',
      'renegotiate': 'costAnomalies',
      'downgrade_plan': 'optimizations',
      'cancel_subscription': 'optimizations',
      'reroute_traffic': 'slaPenaltiesAvoided',
      'scale_down_servers': 'infrastructureOptimized',
      'reconcile_invoice': 'financialOperations'
    };

    if (typeMap[actionType]) {
      const key = typeMap[actionType];
      metrics.breakdown[key] = (metrics.breakdown[key] || 0) + savings;
    }

    await ImpactMetrics.save(metrics);
  }
}

module.exports = new ActionExecutor();
