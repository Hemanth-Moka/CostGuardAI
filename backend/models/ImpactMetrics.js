const { getPool } = require('../config/database');

class ImpactMetrics {
  static async findOne(filter) {
    const pool = getPool();
    const [rows] = await pool.query(
      'SELECT * FROM impact_metrics WHERE period = ?',
      [filter.period]
    );

    if (rows[0]) {
      return {
        ...rows[0],
        breakdown: {
          duplicateTools: parseFloat(rows[0].breakdown_duplicate_tools) || 0,
          unusedLicenses: parseFloat(rows[0].breakdown_unused_licenses) || 0,
          costAnomalies: parseFloat(rows[0].breakdown_cost_anomalies) || 0,
          optimizations: parseFloat(rows[0].breakdown_optimizations) || 0
        }
      };
    }

    return null;
  }

  static async create(data) {
    const pool = getPool();
    const [result] = await pool.query(
      `INSERT INTO impact_metrics (period, total_spend, savings_identified, savings_realized, 
       monthly_savings, yearly_savings, roi, actions_executed, breakdown_duplicate_tools, 
       breakdown_unused_licenses, breakdown_cost_anomalies, breakdown_optimizations) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.period, data.totalSpend || 0, data.savingsIdentified || 0,
        data.savingsRealized || 0, data.monthlySavings || 0, data.yearlySavings || 0,
        data.roi || 0, data.actionsExecuted || 0,
        data.breakdown?.duplicateTools || 0, data.breakdown?.unusedLicenses || 0,
        data.breakdown?.costAnomalies || 0, data.breakdown?.optimizations || 0
      ]
    );

    return { id: result.insertId, ...data };
  }

  static async update(period, data) {
    const pool = getPool();
    const updates = [];
    const params = [];

    if (data.totalSpend !== undefined) {
      updates.push('total_spend = ?');
      params.push(data.totalSpend);
    }
    if (data.savingsIdentified !== undefined) {
      updates.push('savings_identified = ?');
      params.push(data.savingsIdentified);
    }
    if (data.savingsRealized !== undefined) {
      updates.push('savings_realized = ?');
      params.push(data.savingsRealized);
    }
    if (data.monthlySavings !== undefined) {
      updates.push('monthly_savings = ?');
      params.push(data.monthlySavings);
    }
    if (data.yearlySavings !== undefined) {
      updates.push('yearly_savings = ?');
      params.push(data.yearlySavings);
    }
    if (data.roi !== undefined) {
      updates.push('roi = ?');
      params.push(data.roi);
    }
    if (data.actionsExecuted !== undefined) {
      updates.push('actions_executed = ?');
      params.push(data.actionsExecuted);
    }
    if (data.breakdown) {
      if (data.breakdown.duplicateTools !== undefined) {
        updates.push('breakdown_duplicate_tools = ?');
        params.push(data.breakdown.duplicateTools);
      }
      if (data.breakdown.unusedLicenses !== undefined) {
        updates.push('breakdown_unused_licenses = ?');
        params.push(data.breakdown.unusedLicenses);
      }
      if (data.breakdown.costAnomalies !== undefined) {
        updates.push('breakdown_cost_anomalies = ?');
        params.push(data.breakdown.costAnomalies);
      }
      if (data.breakdown.optimizations !== undefined) {
        updates.push('breakdown_optimizations = ?');
        params.push(data.breakdown.optimizations);
      }
    }

    params.push(period);
    await pool.query(
      `UPDATE impact_metrics SET ${updates.join(', ')} WHERE period = ?`,
      params
    );

    return this.findOne({ period });
  }

  static async save(metrics) {
    const existing = await this.findOne({ period: metrics.period });
    
    if (existing) {
      return this.update(metrics.period, metrics);
    } else {
      return this.create(metrics);
    }
  }
}

module.exports = ImpactMetrics;
