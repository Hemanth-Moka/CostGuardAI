const Recommendation = require('../models/Recommendation');

exports.getRecommendations = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};

    const recommendations = await Recommendation.find(filter);

    res.json(recommendations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getRecommendationById = async (req, res) => {
  try {
    const recommendation = await Recommendation.findById(req.params.id);

    if (!recommendation) {
      return res.status(404).json({ error: 'Recommendation not found' });
    }

    res.json(recommendation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
