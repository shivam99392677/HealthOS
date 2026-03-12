import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Home, LayoutDashboard, Settings, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5"
      data-testid="navbar"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2" data-testid="nav-logo">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 flex items-center justify-center glow-cyan">
              <span className="text-slate-950 font-heading font-bold text-xl">H</span>
            </div>
            <span className="text-2xl font-heading font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
              HealthOS
            </span>
          </Link>

          <div className="flex items-center space-x-6">
            {isAuthenticated ? (
              <>
                <Link
                  to="/"
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all ${
                    isActive('/') 
                      ? 'bg-cyan-500/20 text-cyan-400' 
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                  data-testid="nav-home"
                >
                  <Home size={18} />
                  <span className="hidden sm:inline">Home</span>
                </Link>
                <Link
                  to="/dashboard"
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all ${
                    isActive('/dashboard') 
                      ? 'bg-cyan-500/20 text-cyan-400' 
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                  data-testid="nav-dashboard"
                >
                  <LayoutDashboard size={18} />
                  <span className="hidden sm:inline">Dashboard</span>
                </Link>
                <Link
                  to="/settings"
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all ${
                    isActive('/settings') 
                      ? 'bg-cyan-500/20 text-cyan-400' 
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                  data-testid="nav-settings"
                >
                  <Settings size={18} />
                  <span className="hidden sm:inline">Settings</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 rounded-full text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
                  data-testid="nav-logout"
                >
                  <LogOut size={18} />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="px-6 py-2 rounded-full bg-cyan-500 text-slate-950 font-bold hover:bg-cyan-400 glow-cyan glow-cyan-hover transition-all"
                data-testid="nav-login"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;