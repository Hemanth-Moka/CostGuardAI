const Action = require('../models/Action');
const Recommendation = require('../models/Recommendation');
const actionExecutor = require('../services/actionExecutor');

exports.requestAction = async (req, res) => {
  try {
    const { recommendationId } = req.body;

    const recommendation = await Recommendation.findById(recommendationId);
    if (!recommendation) {
      return res.status(404).json({ error: 'Recommendation not found' });
    }

    const action = await Action.create({
      recommendationId,
      actionType: recommendation.action_type,
      description: recommendation.description,
      estimatedSavings: recommendation.estimated_savings,
      requestedBy: req.userId,
      status: 'pending'
    });

    res.status(201).json(action);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.approveAction = async (req, res) => {
  try {
    const { actionId } = req.params;
    const { approved } = req.body;

    const action = await Action.findById(actionId);
    if (!action) {
      return res.status(404).json({ error: 'Action not found' });
    }

    if (action.status !== 'pending') {
      return res.status(400).json({ error: 'Action already processed' });
    }

    const updatedAction = await Action.update(actionId, {
      status: approved ? 'approved' : 'rejected',
      approvedBy: req.userId,
      approvedAt: new Date()
    });

    if (approved) {
      await Recommendation.update(action.recommendation_id, { status: 'approved' });
    }

    res.json(updatedAction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.executeAction = async (req, res) => {
  try {
    const { actionId } = req.params;

    const action = await Action.findById(actionId);
    if (!action) {
      return res.status(404).json({ error: 'Action not found' });
    }

    if (action.status !== 'approved') {
      return res.status(400).json({ error: 'Action must be approved first' });
    }

    await Action.update(actionId, { status: 'executing' });

    const result = await actionExecutor.executeAction(action, req.userId);

    if (result.success) {
      await Action.update(actionId, {
        status: 'executed',
        executedAt: new Date(),
        result: result.result
      });

      await Recommendation.update(action.recommendation_id, { status: 'executed' });

      res.json({ message: 'Action executed successfully', action, log: result.log });
    } else {
      await Action.update(actionId, {
        status: 'failed',
        result: { error: result.error }
      });

      res.status(500).json({ error: result.error });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getActions = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};

    const actions = await Action.find(filter);

    res.json(actions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
