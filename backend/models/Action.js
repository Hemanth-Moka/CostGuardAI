const { getPool } = require('../config/database');

class Action {
  static async create(data) {
    const pool = getPool();
    const [result] = await pool.query(
      `INSERT INTO actions (recommendation_id, action_type, description, estimated_savings, 
       status, requested_by) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        data.recommendationId, data.actionType, data.description,
        data.estimatedSavings, data.status || 'pending', data.requestedBy
      ]
    );

    return { id: result.insertId, ...data };
  }

  static async find(filter = {}) {
    const pool = getPool();
    let query = `
      SELECT a.*, 
             u1.name as requested_by_name, u1.email as requested_by_email,
             u2.name as approved_by_name, u2.email as approved_by_email
      FROM actions a
      LEFT JOIN users u1 ON a.requested_by = u1.id
      LEFT JOIN users u2 ON a.approved_by = u2.id
      WHERE 1=1
    `;
    const params = [];

    if (filter.status) {
      query += ' AND a.status = ?';
      params.push(filter.status);
    }

    query += ' ORDER BY a.created_at DESC';

    const [rows] = await pool.query(query, params);
    
    return rows.map(row => ({
      ...row,
      result: typeof row.result === 'string' ? JSON.parse(row.result) : (row.result || null),
      requestedBy: row.requested_by ? {
        id: row.requested_by,
        name: row.requested_by_name,
        email: row.requested_by_email
      } : null,
      approvedBy: row.approved_by ? {
        id: row.approved_by,
        name: row.approved_by_name,
        email: row.approved_by_email
      } : null
    }));
  }

  static async findById(id) {
    const pool = getPool();
    const [rows] = await pool.query('SELECT * FROM actions WHERE id = ?', [id]);
    
    if (rows[0]) {
      rows[0].result = typeof rows[0].result === 'string' ? JSON.parse(rows[0].result) : (rows[0].result || null);
    }

    return rows[0] || null;
  }

  static async update(id, data) {
    const pool = getPool();
    const updates = [];
    const params = [];

    Object.keys(data).forEach(key => {
      if (key === 'result') {
        updates.push('result = ?');
        params.push(JSON.stringify(data[key]));
      } else {
        const dbKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
        updates.push(`${dbKey} = ?`);
        params.push(data[key]);
      }
    });

    params.push(id);
    await pool.query(
      `UPDATE actions SET ${updates.join(', ')} WHERE id = ?`,
      params
    );

    return this.findById(id);
  }
}

module.exports = Action;
