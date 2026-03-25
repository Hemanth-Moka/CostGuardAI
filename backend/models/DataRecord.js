const { getPool } = require('../config/database');

class DataRecord {
  static async create(data) {
    const pool = getPool();
    const [result] = await pool.query(
      `INSERT INTO data_records (type, name, vendor, cost, frequency, licenses, active_users, 
       department, start_date, end_date, status, metadata, uploaded_by) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.type || 'saas',
        data.name || null,
        data.vendor || null,
        data.cost || 0,
        data.frequency || 'monthly',
        data.licenses || 0,
        data.activeUsers || 0,
        data.department || null,
        data.startDate || null,
        data.endDate || null,
        data.status || 'active',
        JSON.stringify(data.metadata || {}),
        data.uploadedBy || null
      ]
    );
    
    return { id: result.insertId, ...data };
  }

  static async insertMany(records) {
    const pool = getPool();
    const results = [];
    
    for (const record of records) {
      const result = await this.create(record);
      results.push(result);
    }
    
    return results;
  }

  static async find(filter = {}) {
    const pool = getPool();
    let query = 'SELECT * FROM data_records WHERE 1=1';
    const params = [];

    if (filter.type) {
      query += ' AND type = ?';
      params.push(filter.type);
    }
    if (filter.status) {
      query += ' AND status = ?';
      params.push(filter.status);
    }

    query += ' ORDER BY created_at DESC';

    const [rows] = await pool.query(query, params);
    return rows.map(row => ({
      ...row,
      metadata: typeof row.metadata === 'string' ? JSON.parse(row.metadata) : (row.metadata || {})
    }));
  }

  static async findById(id) {
    const pool = getPool();
    const [rows] = await pool.query('SELECT * FROM data_records WHERE id = ?', [id]);
    if (rows[0]) {
      rows[0].metadata = typeof rows[0].metadata === 'string' ? JSON.parse(rows[0].metadata) : (rows[0].metadata || {});
    }
    return rows[0] || null;
  }

  static async findByIds(ids) {
    if (!ids || ids.length === 0) return [];
    const pool = getPool();
    const placeholders = ids.map(() => '?').join(',');
    const [rows] = await pool.query(
      `SELECT * FROM data_records WHERE id IN (${placeholders})`,
      ids
    );
    return rows.map(row => ({
      ...row,
      metadata: typeof row.metadata === 'string' ? JSON.parse(row.metadata) : (row.metadata || {})
    }));
  }

  static async update(id, data) {
    const pool = getPool();
    const updates = [];
    const params = [];

    Object.keys(data).forEach(key => {
      if (key === 'metadata') {
        updates.push('metadata = ?');
        params.push(JSON.stringify(data[key]));
      } else {
        const dbKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
        updates.push(`${dbKey} = ?`);
        params.push(data[key]);
      }
    });

    params.push(id);
    await pool.query(
      `UPDATE data_records SET ${updates.join(', ')} WHERE id = ?`,
      params
    );

    return this.findById(id);
  }
}

module.exports = DataRecord;
