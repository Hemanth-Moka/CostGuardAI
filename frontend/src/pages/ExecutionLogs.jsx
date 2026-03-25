import { useState, useEffect } from 'react';
import { impactAPI } from '../services/api';

const ExecutionLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLogs();
    const intervalId = setInterval(loadLogs, 5000);
    return () => clearInterval(intervalId);
  }, []);

  const loadLogs = async () => {
    try {
      const response = await impactAPI.getLogs();
      setLogs(response.data);
    } catch (error) {
      console.error('Failed to load logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      success: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      partial: 'bg-yellow-100 text-yellow-800',
    };
    return colors[status] || colors.success;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return <div className="text-center py-12">Loading execution logs...</div>;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white text-glow">Execution Logs</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Audit trail of all executed actions</p>
      </div>

      {logs.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center border border-gray-200 dark:border-white/5">
          <p className="text-gray-500 dark:text-gray-400 text-lg">No execution logs yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {logs.map((log) => (
            <div key={log.id || log._id} className="glass-card rounded-xl p-6 border border-gray-200 dark:border-white/10 hover:border-primary/20 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{log.description}</h3>
                    <span className={`px-2 py-1 rounded text-xs font-medium border ${
                      log.status === 'success' ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/30' :
                      log.status === 'partial' ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-500/30' :
                      'bg-red-100 dark:bg-red-500/20 text-red-800 dark:text-red-300 border-red-200 dark:border-red-500/30'
                    }`}>
                      {log.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Executed by {log.executedBy?.name || 'System'} on {formatDate(log.executedAt)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Savings Realized</p>
                  <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 drop-shadow-sm">
                    ₹{(log.savings_realized || log.savingsRealized || 0).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-white/10">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Action Type</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-200">
                    {(log.action_type || log.actionType).replace(/_/g, ' ').toUpperCase()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Affected Records</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-200">
                    {(log.affected_records || log.affectedRecords).length} records
                  </p>
                </div>
              </div>

              {log.result && (
                <div className="mt-4 p-3 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/5">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 font-semibold uppercase tracking-wider">Result Details</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{log.result.details?.message || 'Completed successfully'}</p>
                </div>
              )}

              {log.errorMessage && (
                <div className="mt-4 p-3 bg-red-50 dark:bg-red-500/10 rounded-xl border border-red-100 dark:border-red-500/20">
                  <p className="text-xs text-red-500 dark:text-red-400 mb-1 font-semibold uppercase tracking-wider">Error</p>
                  <p className="text-sm text-red-700 dark:text-red-300">{log.errorMessage}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExecutionLogs;
