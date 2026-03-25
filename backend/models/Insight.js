const { getPool } = require('../config/database');

class Insight {
  static async create(data) {
    const pool = getPool();
    const [result] = await pool.query(
      `INSERT INTO insights (type, title, description, severity, estimated_savings, confidence, status, metadata) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.type, data.title, data.description, data.severity,
        data.estimatedSavings, data.confidence, data.status || 'active',
        JSON.stringify(data.metadata || {})
      ]
    );

    const insightId = result.insertId;

    // Insert affected records
    if (data.affectedRecords && data.affectedRecords.length > 0) {
      const values = data.affectedRecords.map(recordId => [insightId, recordId]);
      await pool.query(
        'INSERT INTO insight_records (insight_id, record_id) VALUES ?',
        [values]
      );
    }

    return { id: insightId, ...data };
  }

  static async find(filter = {}) {
    const pool = getPool();
    let query = 'SELECT * FROM insights WHERE 1=1';
    const params = [];

    if (filter.status) {
      query += ' AND status = ?';
      params.push(filter.status);
    }
    if (filter.type) {
      query += ' AND type = ?';
      params.push(filter.type);
    }

    query += ' ORDER BY created_at DESC';

    const [rows] = await pool.query(query, params);
    
    // Get affected records for each insight
    for (const row of rows) {
      const [records] = await pool.query(
        'SELECT record_id FROM insight_records WHERE insight_id = ?',
        [row.id]
      );
      row.affectedRecords = records.map(r => r.record_id);
      row.metadata = typeof row.metadata === 'string' ? JSON.parse(row.metadata) : (row.metadata || {});
    }

    return rows;
  }

  static async findById(id) {
    const pool = getPool();
    const [rows] = await pool.query('SELECT * FROM insights WHERE id = ?', [id]);
    
    if (rows[0]) {
      const [records] = await pool.query(
        'SELECT record_id FROM insight_records WHERE insight_id = ?',
        [id]
      );
      rows[0].affectedRecords = records.map(r => r.record_id);
      rows[0].metadata = typeof rows[0].metadata === 'string' ? JSON.parse(rows[0].metadata) : (rows[0].metadata || {});
    }

    return rows[0] || null;
  }
}

module.exports = Insight;
