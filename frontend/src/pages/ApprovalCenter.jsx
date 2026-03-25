import { useState, useEffect } from 'react';
import { actionsAPI } from '../services/api';

const ApprovalCenter = () => {
  const [actions, setActions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadActions();
    const intervalId = setInterval(loadActions, 5000);
    return () => clearInterval(intervalId);
  }, []);

  const loadActions = async () => {
    try {
      const response = await actionsAPI.getActions({ status: 'pending' });
      setActions(response.data);
    } catch (error) {
      console.error('Failed to load actions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (actionId, approved) => {
    setProcessing(actionId);
    setMessage('');

    try {
      await actionsAPI.approve(actionId, approved);
      setMessage(`Action ${approved ? 'approved' : 'rejected'} successfully!`);
      loadActions();
      
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(error.response?.data?.error || 'Failed to process action');
    } finally {
      setProcessing(null);
    }
  };

  const handleExecute = async (actionId) => {
    if (!confirm('Are you sure you want to execute this action? This cannot be undone.')) {
      return;
    }

    setProcessing(actionId);
    setMessage('');

    try {
      await actionsAPI.execute(actionId);
      setMessage('Action executed successfully!');
      loadActions();
      
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(error.response?.data?.error || 'Failed to execute action');
    } finally {
      setProcessing(null);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading actions...</div>;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white text-glow">Enterprise Approval Workflows</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Safely review and approve autonomous AI operations before execution</p>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-lg ${
          message.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
        }`}>
          {message}
        </div>
      )}

      {actions.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center border border-gray-200 dark:border-white/5">
          <p className="text-gray-500 dark:text-gray-400 text-lg">No pending actions for approval.</p>
        </div>
      ) : (
        <div className="glass-card rounded-2xl overflow-hidden border border-gray-200 dark:border-white/5">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-white/10">
              <thead className="bg-gray-50 dark:bg-white/5 backdrop-blur-sm">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Action
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Savings
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Requested By
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-transparent divide-y divide-gray-200 dark:divide-white/10">
              {actions.map((action) => (
                <tr key={action.id || action._id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-200">{action.description}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-500/20 text-blue-800 dark:text-blue-300 rounded border border-blue-200 dark:border-blue-500/30">
                      {(action.action_type || action.actionType).replace(/_/g, ' ').toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                      ₹{(action.estimated_savings || action.estimatedSavings || 0).toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded border ${
                      action.status === 'pending' ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-500/30' :
                      action.status === 'approved' ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/30' :
                      action.status === 'rejected' ? 'bg-red-100 dark:bg-red-500/20 text-red-800 dark:text-red-300 border-red-200 dark:border-red-500/30' :
                      'bg-gray-100 dark:bg-white/10 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-white/20'
                    }`}>
                      {action.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 dark:text-gray-300">{action.requestedBy?.name || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    {action.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleApprove(action.id || action._id, true)}
                          disabled={processing === (action.id || action._id)}
                          className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 disabled:opacity-50"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleApprove(action.id || action._id, false)}
                          disabled={processing === (action.id || action._id)}
                          className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 disabled:opacity-50"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {action.status === 'approved' && (
                      <button
                        onClick={() => handleExecute(action.id || action._id)}
                        disabled={processing === (action.id || action._id)}
                        className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50"
                      >
                        Execute
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApprovalCenter;
