const { getPool } = require('../config/database');

class Recommendation {
  static async create(data) {
    const pool = getPool();
    const [result] = await pool.query(
      `INSERT INTO recommendations (insight_id, title, description, action_type, estimated_savings, 
       monthly_savings, yearly_savings, risk_level, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.insightId, data.title, data.description, data.actionType,
        data.estimatedSavings, data.monthlySavings, data.yearlySavings,
        data.riskLevel, data.status || 'pending'
      ]
    );

    const recommendationId = result.insertId;

    // Insert affected records
    if (data.affectedRecords && data.affectedRecords.length > 0) {
      const values = data.affectedRecords.map(recordId => [recommendationId, recordId]);
      await pool.query(
        'INSERT INTO recommendation_records (recommendation_id, record_id) VALUES ?',
        [values]
      );
    }

    return { id: recommendationId, ...data };
  }

  static async find(filter = {}) {
    const pool = getPool();
    let query = 'SELECT * FROM recommendations WHERE 1=1';
    const params = [];

    if (filter.status) {
      query += ' AND status = ?';
      params.push(filter.status);
    }

    query += ' ORDER BY created_at DESC';

    const [rows] = await pool.query(query, params);
    
    // Get affected records for each recommendation
    for (const row of rows) {
      const [records] = await pool.query(
        'SELECT record_id FROM recommendation_records WHERE recommendation_id = ?',
        [row.id]
      );
      row.affectedRecords = records.map(r => r.record_id);
    }

    return rows;
  }

  static async findById(id) {
    const pool = getPool();
    const [rows] = await pool.query('SELECT * FROM recommendations WHERE id = ?', [id]);
    
    if (rows[0]) {
      const [records] = await pool.query(
        'SELECT record_id FROM recommendation_records WHERE recommendation_id = ?',
        [id]
      );
      rows[0].affectedRecords = records.map(r => r.record_id);
    }

    return rows[0] || null;
  }

  static async update(id, data) {
    const pool = getPool();
    const updates = [];
    const params = [];

    Object.keys(data).forEach(key => {
      const dbKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
      updates.push(`${dbKey} = ?`);
      params.push(data[key]);
    });

    params.push(id);
    await pool.query(
      `UPDATE recommendations SET ${updates.join(', ')} WHERE id = ?`,
      params
    );

    return this.findById(id);
  }
}

module.exports = Recommendation;
