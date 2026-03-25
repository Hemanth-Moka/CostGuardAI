const DataRecord = require('../models/DataRecord');
const csv = require('csv-parser');
const fs = require('fs');
const ImpactMetrics = require('../models/ImpactMetrics');

exports.uploadData = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const records = [];
    const fileType = req.file.mimetype;

    // Helper to safely map row and explicitly ignore record_id
    const mapRecord = (row) => ({
      name: row.name || 'Unknown',
      type: row.type || 'saas',
      vendor: row.vendor || 'Unknown Vendor',
      cost: parseFloat(row.cost) || 0,
      frequency: row.frequency || 'monthly',
      licenses: parseInt(row.licenses) || 0,
      activeUsers: parseInt(row.activeUsers || row.active_users) || 0,
      department: row.department || 'Unassigned',
      status: row.status || 'active',
      uploadedBy: req.userId
      // record_id is intentionally omitted
    });

    if (fileType === 'text/csv' || req.file.originalname.endsWith('.csv')) {
      await new Promise((resolve, reject) => {
        fs.createReadStream(req.file.path)
          .pipe(csv())
          .on('data', (row) => {
            records.push(mapRecord(row));
          })
          .on('end', resolve)
          .on('error', reject);
      });
    } else if (fileType === 'application/json') {
      const data = JSON.parse(fs.readFileSync(req.file.path, 'utf8'));
      
      const dataArray = Array.isArray(data) ? data : [data];
      records.push(...dataArray.map(mapRecord));
    }

    const savedRecords = await DataRecord.insertMany(records);

    await exports.updateTotalSpend();

    if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);

    res.json({ 
      message: 'Data uploaded successfully', 
      count: savedRecords.length,
      records: savedRecords 
    });
  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ error: error.message });
  }
};

exports.getData = async (req, res) => {
  try {
    const { type, status } = req.query;
    const filter = {};
    
    if (type) filter.type = type;
    if (status) filter.status = status;

    const records = await DataRecord.find(filter);
    res.json(records);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateTotalSpend = async () => {
  const period = new Date().toISOString().slice(0, 7);
  let metrics = await ImpactMetrics.findOne({ period });

  if (!metrics) {
    metrics = { period, totalSpend: 0 };
  }

  const activeRecords = await DataRecord.find({ status: 'active' });
  metrics.totalSpend = activeRecords.reduce((sum, r) => {
    const cost = parseFloat(r.cost) || 0;
    const monthlyCost = r.frequency === 'yearly' ? cost / 12 : cost;
    return sum + monthlyCost;
  }, 0);

  await ImpactMetrics.save(metrics);
};
