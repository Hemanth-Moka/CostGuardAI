import { useState, useEffect } from 'react';
import { impactAPI, dataAPI, insightsAPI } from '../services/api';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, Search, CheckCircle, Zap } from 'lucide-react';

const Dashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [dataStats, setDataStats] = useState({ total: 0, active: 0, cancelled: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
    const intervalId = setInterval(loadDashboardData, 5000);
    return () => clearInterval(intervalId);
  }, []);

  const loadDashboardData = async () => {
    try {
      const [metricsRes, dataRes] = await Promise.all([
        impactAPI.getMetrics(),
        dataAPI.getData()
      ]);

      setMetrics(metricsRes.data);
      
      const data = dataRes.data;
      setDataStats({
        total: data.length,
        active: data.filter(d => d.status === 'active').length,
        cancelled: data.filter(d => d.status === 'cancelled').length,
      });
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-full text-white/50 animate-pulse">Initializing Dashboard Data...</div>;
  }

  const kpis = [
    {
      label: 'Total Monthly Spend',
      value: `₹${(metrics?.total_spend || metrics?.totalSpend || 0).toLocaleString()}`,
      color: 'blue',
      icon: DollarSign,
    },
    {
      label: 'Savings Identified',
      value: `₹${(metrics?.savings_identified || metrics?.savingsIdentified || 0).toLocaleString()}`,
      color: 'purple',
      icon: Search,
    },
    {
      label: 'Savings Realized',
      value: `₹${(metrics?.savings_realized || metrics?.savingsRealized || 0).toLocaleString()}`,
      color: 'emerald',
      icon: CheckCircle,
    },
    {
      label: 'Actions Executed',
      value: metrics?.actions_executed || metrics?.actionsExecuted || 0,
      color: 'amber',
      icon: Zap,
    },
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: { bg: 'bg-blue-500/10', text: 'text-blue-500 dark:text-blue-400', border: 'border-blue-500/20' },
      purple: { bg: 'bg-purple-500/10', text: 'text-purple-500 dark:text-purple-400', border: 'border-purple-500/20' },
      emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-500 dark:text-emerald-400', border: 'border-emerald-500/20' },
      amber: { bg: 'bg-amber-500/10', text: 'text-amber-500 dark:text-amber-400', border: 'border-amber-500/20' }
    };
    return colors[color] || colors.blue;
  };

  const breakdownData = [
    { name: 'Duplicate Tools', value: metrics?.breakdown?.duplicateTools || 0 },
    { name: 'Unused Licenses', value: metrics?.breakdown?.unusedLicenses || 0 },
    { name: 'Cost Anomalies', value: metrics?.breakdown?.costAnomalies || 0 },
    { name: 'Optimizations', value: metrics?.breakdown?.optimizations || 0 },
    { name: 'SLA Penalties', value: metrics?.breakdown?.slaPenaltiesAvoided || 0 },
    { name: 'Infrastructure', value: metrics?.breakdown?.infrastructureOptimized || 0 },
    { name: 'FinOps Reconciled', value: metrics?.breakdown?.financialOperations || 0 },
  ].filter(item => item.value > 0);

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444', '#EC4899', '#06B6D4'];

  return (
    <div className="space-y-8 relative z-10">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white text-glow">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Overview of your cost intelligence metrics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, index) => {
          const Icon = kpi.icon;
          const styles = getColorClasses(kpi.color);
          return (
            <div key={index} className="glass-card border border-gray-200 dark:border-white/10 p-6 rounded-2xl relative overflow-hidden group hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5">
              <div className={`absolute top-0 right-0 p-4 opacity-5 dark:opacity-10 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform duration-500 ${styles.text}`}>
                <Icon size={80} />
              </div>
              <div className="flex items-center justify-between mb-4 relative z-10">
                <div className={`p-3 rounded-xl border border-gray-100 dark:border-white/5 backdrop-blur-md ${styles.bg}`}>
                   <Icon size={24} className={styles.text} />
                </div>
              </div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 relative z-10">{kpi.label}</p>
              <p className="text-3xl font-bold mt-1 text-gray-900 dark:text-white relative z-10">{kpi.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6 rounded-2xl">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Savings Breakdown</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={breakdownData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {breakdownData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(18, 18, 20, 0.8)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  itemStyle={{ color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Data Overview</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/5 rounded-xl transition-all hover:bg-gray-100 dark:hover:bg-white/10">
                <span className="text-gray-600 dark:text-gray-300">Total Records</span>
                <span className="text-2xl font-bold text-gray-900 dark:text-white">{dataStats.total}</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl transition-all hover:bg-emerald-500/20">
                <span className="text-emerald-400">Active Subscriptions</span>
                <span className="text-2xl font-bold text-emerald-400">{dataStats.active}</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-red-500/10 border border-red-500/20 rounded-xl transition-all hover:bg-red-500/20">
                <span className="text-red-400">Cancelled</span>
                <span className="text-2xl font-bold text-red-500">{dataStats.cancelled}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="glass-card p-6 rounded-2xl border border-primary/20 shadow-[0_0_30px_rgba(59,130,246,0.1)]">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <Zap className="text-primary" size={20} />
          Savings Impact
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-6 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/5 rounded-xl transition-colors">
            <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wider">Monthly Projection</p>
            <p className="text-4xl font-bold text-emerald-500 dark:text-emerald-400 mt-2 filter drop-shadow-[0_0_10px_rgba(16,185,129,0.3)]">
              ₹{(metrics?.monthly_savings || metrics?.monthlySavings || 0).toLocaleString()}
            </p>
          </div>
          <div className="p-6 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/5 rounded-xl transition-colors">
            <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wider">Yearly Projection</p>
            <p className="text-4xl font-bold text-blue-400 mt-2 filter drop-shadow-[0_0_10px_rgba(59,130,246,0.3)]">
              ₹{(metrics?.yearly_savings || metrics?.yearlySavings || 0).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
