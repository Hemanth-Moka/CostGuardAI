const ImpactMetrics = require('../models/ImpactMetrics');
const ExecutionLog = require('../models/ExecutionLog');

exports.getImpactMetrics = async (req, res) => {
  try {
    const period = req.query.period || new Date().toISOString().slice(0, 7);
    
    let metrics = await ImpactMetrics.findOne({ period });
    
    if (!metrics) {
      metrics = await ImpactMetrics.create({ period });
    }

    res.json(metrics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getExecutionLogs = async (req, res) => {
  try {
    const logs = await ExecutionLog.find(100);

    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getLogById = async (req, res) => {
  try {
    const log = await ExecutionLog.findById(req.params.id);

    if (!log) {
      return res.status(404).json({ error: 'Log not found' });
    }

    res.json(log);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
