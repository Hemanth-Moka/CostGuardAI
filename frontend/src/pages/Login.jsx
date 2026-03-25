import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Hexagon, Shield, Moon, Sun, ArrowRight } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

const Login = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        await register(formData);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-background flex flex-col items-center justify-center p-4 transition-colors font-sans selection:bg-primary selection:text-white relative overflow-hidden">
      
      {/* Background ambient light */}
      <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none"></div>
      
      {/* Navigation */}
      <nav className="absolute w-full z-50 top-0 border-b border-gray-200 dark:border-white/5 bg-white/80 dark:bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2 relative group cursor-pointer focus:outline-none rounded-lg p-1">
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full group-hover:bg-primary/40 transition-all duration-500"></div>
              <Shield className="h-7 w-7 text-primary relative z-10 animate-pulse-slow" />
              <span className="font-bold text-xl tracking-tight relative z-10 text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                CostGuard <span className="text-primary tracking-normal">AI</span>
              </span>
            </Link>
            <div className="flex items-center space-x-6">
              <button 
                onClick={toggleTheme}
                type="button"
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors focus:ring-2 focus:ring-primary/50 outline-none"
              >
                {isDarkMode ? <Sun className="h-5 w-5 text-gray-300" /> : <Moon className="h-5 w-5 text-gray-600" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-md w-full bg-white/90 dark:bg-surface/80 backdrop-blur-xl rounded-3xl shadow-2xl dark:shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-gray-100 dark:border-white/10 p-8 sm:p-10 relative overflow-hidden transition-colors mt-16 animate-fade-in-up">
        {/* Glow effect for dark mode */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-primary/20 blur-[80px] rounded-full pointer-events-none hidden dark:block"></div>

        <div className="relative z-10 text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4 shadow-lg shadow-primary/20">
            <Hexagon className="w-8 h-8 text-primary animate-pulse-slow" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">CostGuard AI</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Enterprise Cost Intelligence Platform</p>
        </div>

        <div className="flex mb-8 bg-gray-100/50 dark:bg-black/20 p-1.5 rounded-xl border border-gray-200 dark:border-white/5">
          <button
            onClick={() => setIsLogin(true)}
            type="button"
            className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-300 ${
              isLogin ? 'bg-white dark:bg-surface text-primary shadow-sm ring-1 ring-gray-900/5 dark:ring-white/10' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setIsLogin(false)}
            type="button"
            className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-300 ${
              !isLogin ? 'bg-white dark:bg-surface text-primary shadow-sm ring-1 ring-gray-900/5 dark:ring-white/10' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            Create Account
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          {!isLogin && (
            <div className="group">
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wide">
                Full Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50/50 dark:bg-black/20 border border-gray-300 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 dark:focus:ring-primary/40 dark:text-white transition-all text-sm group-hover:border-gray-400 dark:group-hover:border-white/20"
                placeholder="John Analytics"
              />
            </div>
          )}

          <div className="group">
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wide">
              Enterprise Email
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 bg-gray-50/50 dark:bg-black/20 border border-gray-300 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 dark:focus:ring-primary/40 dark:text-white transition-all text-sm group-hover:border-gray-400 dark:group-hover:border-white/20"
              placeholder="you@company.com"
            />
          </div>

          <div className="group">
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wide">
              Password
            </label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-3 bg-gray-50/50 dark:bg-black/20 border border-gray-300 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 dark:focus:ring-primary/40 dark:text-white transition-all text-sm group-hover:border-gray-400 dark:group-hover:border-white/20"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-3.5 mt-2 rounded-xl font-bold tracking-wide hover:bg-blue-600 shadow-[0_0_20px_rgba(59,130,246,0.2)] hover:shadow-[0_0_30px_rgba(59,130,246,0.4)] disabled:opacity-50 transition-all hover:-translate-y-0.5 max-w-full flex justify-center items-center gap-2 group"
          >
            {loading ? 'Processing...' : isLogin ? 'Access FinOps Dashboard' : 'Deploy Organization'}
            {!loading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />}
          </button>
        </form>
        
        {isLogin && (
          <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
            Secure Enterprise SSO <span className="underline cursor-pointer hover:text-primary transition-colors">via SAML/OIDC</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
