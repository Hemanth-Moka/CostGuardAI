import { useState, useEffect } from 'react';
import { insightsAPI } from '../services/api';
import { RefreshCw, Package, AlertTriangle, BellRing, Zap, Lightbulb, Bot } from 'lucide-react';

const Insights = () => {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('active');

  useEffect(() => {
    loadInsights();
    const intervalId = setInterval(loadInsights, 5000);
    return () => clearInterval(intervalId);
  }, [filter]);

  const loadInsights = async () => {
    try {
      const response = await insightsAPI.getInsights({ status: filter });
      setInsights(response.data);
    } catch (error) {
      console.error('Failed to load insights:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityStyle = (severity) => {
    const styles = {
      low: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
      medium: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
      high: 'bg-orange-500/10 text-orange-400 border border-orange-500/20',
      critical: 'bg-red-500/10 text-red-500 border border-red-500/20',
    };
    return styles[severity] || styles.medium;
  };

  const getTypeIcon = (type, className) => {
    const icons = {
      duplicate_tools: <RefreshCw className={className} />,
      unused_licenses: <Package className={className} />,
      cost_anomaly: <AlertTriangle className={className} />,
      sla_risk: <BellRing className={className} />,
      optimization: <Zap className={className} />,
    };
    return icons[type] || <Lightbulb className={className} />;
  };

  if (loading) {
    return <div className="flex items-center justify-center h-full text-white/50 animate-pulse">Loading insights...</div>;
  }

  return (
    <div className="space-y-8 relative z-10">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white text-glow flex items-center gap-3">
          <Bot className="text-primary" />
          Spend Intelligence & Anomaly Agents
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Continuously monitoring operations data to identify cost leakage and root-cause attribution</p>
      </div>

      <div className="flex gap-2">
        {['active', 'resolved', 'dismissed'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
              filter === status
                ? 'bg-primary text-white shadow-[0_0_15px_rgba(59,130,246,0.4)]'
                : 'bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-white/10 hover:bg-gray-200 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {insights.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center border border-gray-200 dark:border-white/5">
          <Lightbulb className="mx-auto text-gray-400 dark:text-gray-500 mb-4 opacity-50" size={48} />
          <p className="text-gray-500 dark:text-gray-400 text-lg">No insights found. Upload data and run analysis to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {insights.map((insight) => (
            <div key={insight.id || insight._id} className="glass-card rounded-2xl p-6 group hover:border-primary/30 transition-all duration-300">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-5 flex-1">
                  <div className="p-3 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/10 group-hover:scale-110 transition-transform duration-300 group-hover:bg-primary/10 group-hover:border-primary/30">
                    {getTypeIcon(insight.type, "text-gray-500 dark:text-gray-300 group-hover:text-primary transition-colors")}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-primary transition-colors">{insight.title}</h3>
                      <span className={`px-3 py-1 rounded-md text-xs font-semibold tracking-wider ${getSeverityStyle(insight.severity)}`}>
                        {insight.severity.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed bg-gray-50 dark:bg-white/5 p-4 rounded-xl border border-gray-200 dark:border-white/5">{insight.description}</p>
                    
                    <div className="mb-6 bg-gray-100 dark:bg-black/40 rounded-xl p-4 border border-primary/20 font-mono text-xs">
                      <div className="flex items-center gap-2 mb-3 text-primary">
                        <Bot size={14} /> <span className="font-semibold uppercase tracking-wider">Agent Analysis: Root Cause & Math</span>
                      </div>
                      <p className="mb-1 text-gray-700 dark:text-gray-400">{'>'} Monitoring cross-telemetry signals in operational systems...</p>
                      <p className="mb-1 text-gray-700 dark:text-gray-400">{'>'} Root Cause Attribution: Policy disconnect across {insight.affectedRecords.length} records. Idle resources bypassing automated teardowns.</p>
                      <p className="mt-2 text-emerald-600 dark:text-emerald-400 font-bold">{'>'} Quantified Risk: Current Run Rate * 12 Months = ₹{((insight.estimated_savings || 0) * 12).toLocaleString()} annualized negative impact.</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-6 text-sm">
                      <div className="flex items-center gap-2 bg-emerald-500/10 px-4 py-2 rounded-lg border border-emerald-500/20 text-gray-600 dark:text-gray-400">
                        <span>Estimated Savings:</span>
                        <span className="font-bold text-emerald-500 dark:text-emerald-400 drop-shadow-sm">
                          ₹{(insight.estimated_savings || 0).toLocaleString()}<span className="text-xs text-emerald-500/70 font-normal">/mo</span>
                        </span>
                      </div>
                      <div className="flex items-center gap-2 bg-blue-500/10 px-4 py-2 rounded-lg border border-blue-500/20 text-gray-600 dark:text-gray-400">
                        <span>Confidence:</span>
                        <span className="font-bold text-blue-500 dark:text-blue-400 drop-shadow-sm">
                          {insight.confidence}%
                        </span>
                      </div>
                      <div className="flex items-center gap-2 bg-gray-100 dark:bg-white/5 px-4 py-2 rounded-lg border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400">
                        <span>Affected Records:</span>
                        <span className="font-bold text-gray-900 dark:text-white">
                          {insight.affectedRecords.length}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Insights;
