import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { 
  LayoutDashboard, 
  UploadCloud, 
  Lightbulb, 
  Sparkles, 
  CheckSquare, 
  Terminal, 
  TrendingUp,
  LogOut,
  Hexagon,
  Moon,
  Sun
} from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

const MainLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();

  const navigation = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Data Upload', path: '/upload', icon: UploadCloud },
    { name: 'Insights', path: '/insights', icon: Lightbulb },
    { name: 'Recommendations', path: '/recommendations', icon: Sparkles },
    { name: 'Approval Center', path: '/approvals', icon: CheckSquare },
    { name: 'Execution Logs', path: '/logs', icon: Terminal },
    { name: 'Impact', path: '/impact', icon: TrendingUp },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-background relative overflow-hidden">
      {/* Decorative background gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/20 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-secondary/20 blur-[120px] rounded-full pointer-events-none"></div>
      
      <aside className="w-64 glass-card border-r border-gray-200 dark:border-white/10 flex flex-col z-10">
        <div className="p-6 border-b border-gray-200 dark:border-white/10 flex items-center gap-3">
          <Hexagon className="text-primary animate-pulse-slow" size={28} />
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white text-glow">CostGuard AI</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 uppercase tracking-wider">Intelligence</p>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 ${
                  isActive
                    ? 'bg-primary/10 dark:bg-primary/20 border border-primary/20 dark:border-primary/30 text-primary dark:text-white shadow-[0_0_15px_rgba(59,130,246,0.1)] dark:shadow-[0_0_15px_rgba(59,130,246,0.3)]'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-gray-200 border border-transparent'
                }`}
              >
                <Icon className={`mr-3 ${isActive ? 'text-primary' : 'text-gray-400'}`} size={20} />
                {item.name}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-900 dark:text-gray-200">{user?.name || 'Admin User'}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">{user?.email || 'admin@costguard.ai'}</span>
            </div>
            <div className="flex items-center space-x-1">
              <button
                onClick={toggleTheme}
                className="p-2 text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-amber-400 hover:bg-gray-200 dark:hover:bg-white/10 rounded-lg transition-colors"
                title="Toggle Theme"
              >
                {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-400/10 rounded-lg transition-colors"
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-auto z-10">
        <div className="p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
