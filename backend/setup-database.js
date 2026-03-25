require('dotenv').config();
const mysql = require('mysql2/promise');

const setupDatabase = async () => {
  let connection;
  
  try {
    // Connect without database first
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || ''
    });

    console.log('Connected to MySQL server');

    // Create database if not exists
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'costguard_ai'}`);
    console.log('Database created/verified');

    // Use the database
    await connection.query(`USE ${process.env.DB_NAME || 'costguard_ai'}`);

    // Create Users table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        role ENUM('admin', 'user') DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Users table created');

    // Create DataRecords table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS data_records (
        id INT PRIMARY KEY AUTO_INCREMENT,
        type ENUM('saas', 'vendor', 'cloud') NOT NULL,
        name VARCHAR(255) NOT NULL,
        vendor VARCHAR(255),
        cost DECIMAL(15, 2) NOT NULL,
        frequency ENUM('monthly', 'yearly', 'one-time') DEFAULT 'monthly',
        licenses INT DEFAULT 0,
        active_users INT DEFAULT 0,
        department VARCHAR(255),
        start_date DATE,
        end_date DATE,
        status ENUM('active', 'inactive', 'cancelled') DEFAULT 'active',
        metadata JSON,
        uploaded_by INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE SET NULL
      )
    `);
    console.log('✅ DataRecords table created');

    // Create Insights table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS insights (
        id INT PRIMARY KEY AUTO_INCREMENT,
        type ENUM('duplicate_tools', 'unused_licenses', 'cost_anomaly', 'sla_risk', 'optimization') NOT NULL,
        title VARCHAR(500) NOT NULL,
        description TEXT NOT NULL,
        severity ENUM('low', 'medium', 'high', 'critical') DEFAULT 'medium',
        estimated_savings DECIMAL(15, 2) DEFAULT 0,
        confidence INT DEFAULT 80,
        status ENUM('active', 'resolved', 'dismissed') DEFAULT 'active',
        metadata JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Insights table created');

    // Create InsightRecords junction table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS insight_records (
        insight_id INT,
        record_id INT,
        PRIMARY KEY (insight_id, record_id),
        FOREIGN KEY (insight_id) REFERENCES insights(id) ON DELETE CASCADE,
        FOREIGN KEY (record_id) REFERENCES data_records(id) ON DELETE CASCADE
      )
    `);
    console.log('✅ InsightRecords junction table created');

    // Create Recommendations table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS recommendations (
        id INT PRIMARY KEY AUTO_INCREMENT,
        insight_id INT NOT NULL,
        title VARCHAR(500) NOT NULL,
        description TEXT NOT NULL,
        action_type ENUM('cancel_subscription', 'reduce_licenses', 'downgrade_plan', 'consolidate_tools', 'renegotiate') NOT NULL,
        estimated_savings DECIMAL(15, 2) NOT NULL,
        monthly_savings DECIMAL(15, 2) NOT NULL,
        yearly_savings DECIMAL(15, 2) NOT NULL,
        risk_level ENUM('low', 'medium', 'high') DEFAULT 'low',
        status ENUM('pending', 'approved', 'rejected', 'executed') DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (insight_id) REFERENCES insights(id) ON DELETE CASCADE
      )
    `);
    console.log('✅ Recommendations table created');

    // Create RecommendationRecords junction table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS recommendation_records (
        recommendation_id INT,
        record_id INT,
        PRIMARY KEY (recommendation_id, record_id),
        FOREIGN KEY (recommendation_id) REFERENCES recommendations(id) ON DELETE CASCADE,
        FOREIGN KEY (record_id) REFERENCES data_records(id) ON DELETE CASCADE
      )
    `);
    console.log('✅ RecommendationRecords junction table created');

    // Create Actions table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS actions (
        id INT PRIMARY KEY AUTO_INCREMENT,
        recommendation_id INT NOT NULL,
        action_type VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        estimated_savings DECIMAL(15, 2) NOT NULL,
        status ENUM('pending', 'approved', 'rejected', 'executing', 'executed', 'failed') DEFAULT 'pending',
        requested_by INT,
        approved_by INT,
        approved_at TIMESTAMP NULL,
        executed_at TIMESTAMP NULL,
        result JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (recommendation_id) REFERENCES recommendations(id) ON DELETE CASCADE,
        FOREIGN KEY (requested_by) REFERENCES users(id) ON DELETE SET NULL,
        FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL
      )
    `);
    console.log('✅ Actions table created');

    // Create ExecutionLogs table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS execution_logs (
        id INT PRIMARY KEY AUTO_INCREMENT,
        action_id INT NOT NULL,
        action_type VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        status ENUM('success', 'failed', 'partial') NOT NULL,
        savings_realized DECIMAL(15, 2) DEFAULT 0,
        executed_by INT,
        result JSON,
        error_message TEXT,
        executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (action_id) REFERENCES actions(id) ON DELETE CASCADE,
        FOREIGN KEY (executed_by) REFERENCES users(id) ON DELETE SET NULL
      )
    `);
    console.log('✅ ExecutionLogs table created');

    // Create LogRecords junction table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS log_records (
        log_id INT,
        record_id INT,
        PRIMARY KEY (log_id, record_id),
        FOREIGN KEY (log_id) REFERENCES execution_logs(id) ON DELETE CASCADE,
        FOREIGN KEY (record_id) REFERENCES data_records(id) ON DELETE CASCADE
      )
    `);
    console.log('✅ LogRecords junction table created');

    // Create ImpactMetrics table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS impact_metrics (
        id INT PRIMARY KEY AUTO_INCREMENT,
        period VARCHAR(50) UNIQUE NOT NULL,
        total_spend DECIMAL(15, 2) DEFAULT 0,
        savings_identified DECIMAL(15, 2) DEFAULT 0,
        savings_realized DECIMAL(15, 2) DEFAULT 0,
        monthly_savings DECIMAL(15, 2) DEFAULT 0,
        yearly_savings DECIMAL(15, 2) DEFAULT 0,
        roi DECIMAL(10, 2) DEFAULT 0,
        actions_executed INT DEFAULT 0,
        breakdown_duplicate_tools DECIMAL(15, 2) DEFAULT 0,
        breakdown_unused_licenses DECIMAL(15, 2) DEFAULT 0,
        breakdown_cost_anomalies DECIMAL(15, 2) DEFAULT 0,
        breakdown_optimizations DECIMAL(15, 2) DEFAULT 0,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ ImpactMetrics table created');

    console.log('\n🎉 Database setup completed successfully!');
    console.log('You can now start the application.');

  } catch (error) {
    console.error('Error setting up database:', error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
};

setupDatabase();
