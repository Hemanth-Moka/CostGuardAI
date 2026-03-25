require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/database');
const fs = require('fs');
const path = require('path');

const app = express();

// Middleware and routes
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

app.use('/api/auth', require('./routes/auth'));
app.use('/api/data', require('./routes/data'));
app.use('/api/insights', require('./routes/insights'));
app.use('/api/recommendations', require('./routes/recommendations'));
app.use('/api/actions', require('./routes/actions'));
app.use('/api/impact', require('./routes/impact'));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

const PORT = process.env.PORT || 5000;

// Start server after everything is ready
(async () => {
  try {
    await connectDB();
    console.log('✅ Database connected successfully');
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 CostGuard AI Backend running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
})();

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});
