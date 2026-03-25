const express = require('express');
const router = express.Router();
const impactController = require('../controllers/impactController');
const auth = require('../middleware/auth');

router.get('/metrics', auth, impactController.getImpactMetrics);
router.get('/logs', auth, impactController.getExecutionLogs);
router.get('/logs/:id', auth, impactController.getLogById);

module.exports = router;
