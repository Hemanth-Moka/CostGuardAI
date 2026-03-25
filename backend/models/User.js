const { getPool } = require('../config/database');

class User {
  static async create({ email, password, name, role = 'user' }) {
    const pool = getPool();
    
    const [result] = await pool.query(
      'INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)',
      [email, password, name, role]
    );
    
    return {
      id: result.insertId,
      email,
      name,
      role
    };
  }

  static async findByEmail(email) {
    const pool = getPool();
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0] || null;
  }

  static async findById(id) {
    const pool = getPool();
    const [rows] = await pool.query('SELECT id, email, name, role, created_at FROM users WHERE id = ?', [id]);
    return rows[0] || null;
  }

  static async comparePassword(candidatePassword, hashedPassword) {
    return candidatePassword === hashedPassword;
  }
}

module.exports = User;
