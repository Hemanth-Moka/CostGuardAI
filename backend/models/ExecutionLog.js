const { getPool } = require('../config/database');

class ExecutionLog {
  static async create(data) {
    const pool = getPool();
    const [result] = await pool.query(
      `INSERT INTO execution_logs (action_id, action_type, description, status, 
       savings_realized, executed_by, result, error_message) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.actionId, data.actionType, data.description, data.status,
        data.savingsRealized, data.executedBy,
        JSON.stringify(data.result || {}), data.errorMessage
      ]
    );

    const logId = result.insertId;

    // Insert affected records
    if (data.affectedRecords && data.affectedRecords.length > 0) {
      const values = data.affectedRecords.map(recordId => [logId, recordId]);
      await pool.query(
        'INSERT INTO log_records (log_id, record_id) VALUES ?',
        [values]
      );
    }

    return { id: logId, ...data };
  }

  static async find(limit = 100) {
    const pool = getPool();
    const [rows] = await pool.query(`
      SELECT l.*, u.name as executed_by_name, u.email as executed_by_email
      FROM execution_logs l
      LEFT JOIN users u ON l.executed_by = u.id
      ORDER BY l.executed_at DESC
      LIMIT ?
    `, [limit]);

    // Get affected records for each log
    for (const row of rows) {
      const [records] = await pool.query(
        'SELECT record_id FROM log_records WHERE log_id = ?',
        [row.id]
      );
      row.affectedRecords = records.map(r => r.record_id);
      row.result = typeof row.result === 'string' ? JSON.parse(row.result) : (row.result || null);
      row.executedBy = row.executed_by ? {
        id: row.executed_by,
        name: row.executed_by_name,
        email: row.executed_by_email
      } : null;
    }

    return rows;
  }

  static async findById(id) {
    const pool = getPool();
    const [rows] = await pool.query('SELECT * FROM execution_logs WHERE id = ?', [id]);
    
    if (rows[0]) {
      const [records] = await pool.query(
        'SELECT record_id FROM log_records WHERE log_id = ?',
        [id]
      );
      rows[0].affectedRecords = records.map(r => r.record_id);
      rows[0].result = typeof rows[0].result === 'string' ? JSON.parse(rows[0].result) : (rows[0].result || null);
    }

    return rows[0] || null;
  }
}

module.exports = ExecutionLog;
