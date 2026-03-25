import { useState, useEffect } from 'react';
import { impactAPI } from '../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Impact = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMetrics();
    const intervalId = setInterval(loadMetrics, 5000);
    return () => clearInterval(intervalId);
  }, []);

  const loadMetrics = async () => {
    try {
      const response = await impactAPI.getMetrics();
      setMetrics(response.data);
    } catch (error) {
      console.error('Failed to load metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading impact metrics...</div>;
  }

  const breakdownData = [
    { name: 'Duplicate Tools', value: metrics?.breakdown?.duplicateTools || 0 },
    { name: 'Unused Licenses', value: metrics?.breakdown?.unusedLicenses || 0 },
    { name: 'Cost Anomalies', value: metrics?.breakdown?.costAnomalies || 0 },
    { name: 'Optimizations', value: metrics?.breakdown?.optimizations || 0 },
  ];

  const beforeAfter = [
    { name: 'Before', spend: metrics?.totalSpend || 0 },
    { name: 'After', spend: (metrics?.totalSpend || 0) - (metrics?.savingsRealized || 0) },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white text-glow">Impact Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Financial impact and ROI tracking</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg shadow-emerald-500/20">
          <p className="text-sm opacity-90 mb-2 font-medium tracking-wide">Monthly Savings</p>
          <p className="text-4xl font-bold drop-shadow-md">₹{metrics?.monthlySavings?.toLocaleString() || 0}</p>
          <p className="text-sm opacity-75 mt-2">Realized this month</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg shadow-blue-500/20">
          <p className="text-sm opacity-90 mb-2 font-medium tracking-wide">Yearly Projection</p>
          <p className="text-4xl font-bold drop-shadow-md">₹{metrics?.yearlySavings?.toLocaleString() || 0}</p>
          <p className="text-sm opacity-75 mt-2">Annual savings estimate</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg shadow-purple-500/20">
          <p className="text-sm opacity-90 mb-2 font-medium tracking-wide">Actions Executed</p>
          <p className="text-4xl font-bold drop-shadow-md">{metrics?.actionsExecuted || 0}</p>
          <p className="text-sm opacity-75 mt-2">Optimization actions</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="glass-card rounded-2xl p-6 border border-gray-200 dark:border-white/10">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Savings by Category</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={breakdownData}>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
              <XAxis dataKey="name" stroke="#888888" />
              <YAxis stroke="#888888" />
              <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} contentStyle={{ backgroundColor: 'rgba(18, 18, 20, 0.8)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }} />
              <Bar dataKey="value" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card rounded-2xl p-6 border border-gray-200 dark:border-white/10">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Before vs After</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={beforeAfter}>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
              <XAxis dataKey="name" stroke="#888888" />
              <YAxis stroke="#888888" />
              <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} contentStyle={{ backgroundColor: 'rgba(18, 18, 20, 0.8)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }} />
              <Bar dataKey="spend" fill="#10B981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="glass-card rounded-2xl p-6 border border-gray-200 dark:border-white/10">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-xl">
              <span className="text-gray-700 dark:text-gray-400">Total Monthly Spend</span>
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                ₹{metrics?.totalSpend?.toLocaleString() || 0}
              </span>
            </div>
            <div className="flex justify-between items-center p-4 bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20 rounded-xl">
              <span className="text-amber-700 dark:text-amber-400">Savings Identified</span>
              <span className="text-xl font-bold text-amber-700 dark:text-amber-400 drop-shadow-sm">
                ₹{metrics?.savingsIdentified?.toLocaleString() || 0}
              </span>
            </div>
            <div className="flex justify-between items-center p-4 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 rounded-xl">
              <span className="text-emerald-700 dark:text-emerald-400">Savings Realized</span>
              <span className="text-xl font-bold text-emerald-700 dark:text-emerald-400 drop-shadow-sm">
                ₹{metrics?.savingsRealized?.toLocaleString() || 0}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 border-2 border-blue-200 dark:border-blue-500/20 bg-blue-50/50 dark:bg-blue-500/5 rounded-xl">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Optimization Rate</p>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 drop-shadow-sm">
                {metrics?.totalSpend > 0 
                  ? ((metrics.savingsRealized / metrics.totalSpend) * 100).toFixed(1)
                  : 0}%
              </p>
            </div>
            <div className="p-4 border-2 border-emerald-200 dark:border-emerald-500/20 bg-emerald-50/50 dark:bg-emerald-500/5 rounded-xl">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Potential Additional Savings</p>
              <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 drop-shadow-sm">
                ₹{((metrics?.savingsIdentified || 0) - (metrics?.savingsRealized || 0)).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Impact;
