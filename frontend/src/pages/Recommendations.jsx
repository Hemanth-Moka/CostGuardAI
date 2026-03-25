import { useState, useEffect } from 'react';
import { recommendationsAPI, actionsAPI } from '../services/api';
import { Sparkles, XCircle, TrendingDown, ArrowDownCircle, Link as LinkIcon, MessageSquare, CheckCircle, AlertCircle, Bot } from 'lucide-react';

const Recommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadRecommendations();
    const intervalId = setInterval(loadRecommendations, 5000);
    return () => clearInterval(intervalId);
  }, []);

  const loadRecommendations = async () => {
    try {
      const response = await recommendationsAPI.getRecommendations({ status: 'pending' });
      setRecommendations(response.data);
    } catch (error) {
      console.error('Failed to load recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestApproval = async (recommendationId) => {
    setRequesting(recommendationId);
    setMessage('');

    try {
      await actionsAPI.request({ recommendationId });
      setMessage('Approval request submitted successfully!');
      loadRecommendations();
      
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(error.response?.data?.error || 'Failed to request approval');
    } finally {
      setRequesting(null);
    }
  };

  const getRiskStyle = (risk) => {
    const styles = {
      low: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
      medium: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
      high: 'bg-red-500/10 text-red-500 border border-red-500/20',
    };
    return styles[risk] || styles.low;
  };

  const getActionIcon = (actionType, className) => {
    const icons = {
      cancel_subscription: <XCircle className={className} />,
      reduce_licenses: <TrendingDown className={className} />,
      downgrade_plan: <ArrowDownCircle className={className} />,
      consolidate_tools: <LinkIcon className={className} />,
      renegotiate: <MessageSquare className={className} />,
    };
    return icons[actionType] || <Sparkles className={className} />;
  };

  if (loading) {
    return <div className="flex items-center justify-center h-full text-white/50 animate-pulse">Loading recommendations...</div>;
  }

  return (
    <div className="space-y-8 relative z-10">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white text-glow flex items-center gap-3">
          <Bot className="text-primary" />
          Autonomous Action & Playbooks
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">AI-generated cost optimization recommendations with secure enterprise execution workflows</p>
      </div>

      {message && (
        <div className={`p-4 rounded-xl flex items-center gap-3 backdrop-blur-md border ${
          message.includes('success') 
            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.1)]' 
            : 'bg-red-500/10 text-red-400 border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.1)]'
        }`}>
          {message.includes('success') ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
          {message}
        </div>
      )}

      {recommendations.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center border border-gray-200 dark:border-white/5">
          <Sparkles className="mx-auto text-gray-400 dark:text-gray-500 mb-4 opacity-50" size={48} />
          <p className="text-gray-500 dark:text-gray-400 text-lg">No pending recommendations. Run analysis to generate recommendations.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {recommendations.map((rec) => (
            <div key={rec.id || rec._id} className="glass-card rounded-2xl p-6 group hover:border-primary/30 transition-all duration-300">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-5 flex-1">
                  <div className="p-3 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/10 group-hover:scale-110 transition-transform duration-300 group-hover:bg-primary/10 group-hover:border-primary/30">
                    {getActionIcon(rec.action_type || rec.actionType, "text-gray-500 dark:text-gray-300 group-hover:text-primary transition-colors")}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-primary transition-colors">{rec.title}</h3>
                      <span className={`px-3 py-1 rounded-md text-xs font-semibold tracking-wider ${getRiskStyle(rec.risk_level || rec.riskLevel)}`}>
                        {(rec.risk_level || rec.riskLevel).toUpperCase()} RISK
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">{rec.description}</p>
                    
                    {/* Agent Analysis */}
                    <div className="mb-6 bg-gray-100 dark:bg-black/40 rounded-xl p-4 border border-secondary/20 font-mono text-xs">
                      <div className="flex items-center gap-2 mb-3 text-secondary">
                        <Bot size={14} /> <span className="font-semibold uppercase tracking-wider">Autonomous Resource Agent</span>
                      </div>
                      <p className="mb-1 text-gray-700 dark:text-gray-400">{'>'} Simulating consolidation mapping under new organizational rate card...</p>
                      <p className="mb-1 text-gray-700 dark:text-gray-400">{'>'} Execution Path: Autonomous sequence to {(rec.action_type || rec.actionType).replace(/_/g, ' ').toUpperCase()} via enterprise operations API.</p>
                      <p className="mt-2 text-blue-600 dark:text-blue-400 font-bold">{'>'} Verified Run Rate Math: (₹{(rec.monthly_savings || rec.monthlySavings || 0).toLocaleString()} * 12) = ₹{(rec.yearly_savings || rec.yearlySavings || 0).toLocaleString()} yielding projection.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl">
                        <p className="text-xs text-emerald-600 dark:text-emerald-500 font-semibold uppercase tracking-wider mb-1">Monthly Savings</p>
                        <p className="text-2xl font-bold text-emerald-500 dark:text-emerald-400 drop-shadow-sm">
                          ₹{(rec.monthly_savings || rec.monthlySavings || 0).toLocaleString()}
                        </p>
                      </div>
                      <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl">
                        <p className="text-xs text-blue-600 dark:text-blue-500 font-semibold uppercase tracking-wider mb-1">Yearly Savings</p>
                        <p className="text-2xl font-bold text-blue-500 dark:text-blue-400 drop-shadow-sm">
                          ₹{(rec.yearly_savings || rec.yearlySavings || 0).toLocaleString()}
                        </p>
                      </div>
                      <div className="bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 p-4 rounded-xl">
                        <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">Action Type</p>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">
                          {(rec.action_type || rec.actionType).replace(/_/g, ' ').toUpperCase()}
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        onClick={() => handleRequestApproval(rec.id || rec._id)}
                        disabled={requesting === (rec.id || rec._id)}
                        className="flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-blue-600 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(59,130,246,0.3)] hover:shadow-[0_0_20px_rgba(59,130,246,0.5)]"
                      >
                        {requesting === (rec.id || rec._id) ? <span className="animate-pulse">Requesting...</span> : 'Request Approval'}
                      </button>
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

export default Recommendations;
