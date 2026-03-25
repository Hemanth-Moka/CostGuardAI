const express = require('express');
const router = express.Router();
const actionController = require('../controllers/actionController');
const auth = require('../middleware/auth');

router.post('/request', auth, actionController.requestAction);
router.post('/:actionId/approve', auth, actionController.approveAction);
router.post('/:actionId/execute', auth, actionController.executeAction);
router.get('/', auth, actionController.getActions);

module.exports = router;
