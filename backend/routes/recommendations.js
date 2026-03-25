const express = require('express');
const router = express.Router();
const recommendationController = require('../controllers/recommendationController');
const auth = require('../middleware/auth');

router.get('/', auth, recommendationController.getRecommendations);
router.get('/:id', auth, recommendationController.getRecommendationById);

module.exports = router;
