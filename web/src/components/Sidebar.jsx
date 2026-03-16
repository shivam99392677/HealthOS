import { Link, useLocation } from 'react-router-dom';
import { Home, FileText, Settings, LogOut, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ reports = [], onReportSelect, selectedReportId }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const menuItems = [
    { icon: Home, label: 'Home', path: '/', testId: 'sidebar-home' },
    { icon: FileText, label: 'Reports', path: '/dashboard', testId: 'sidebar-reports' },
    { icon: Settings, label: 'Settings', path: '/settings', testId: 'sidebar-settings' },
  ];

  return (
    <motion.div
      initial={{ x: -300 }}
      animate={{ x: 0, width: collapsed ? '80px' : '280px' }}
      className="h-screen fixed left-0 top-0 border-r border-white/5 bg-slate-950/90 backdrop-blur-md flex flex-col z-40"
      data-testid="sidebar"
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-white/5">
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center space-x-2"
            >
              <Link to="/" className="flex items-center space-x-2">
                <img
                  src="/favicon.svg"
                  alt="HealthOS Logo"
                  className="w-8 h-8"
                />
              </Link>
              <span className="text-lg font-heading font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
                HealthOS
              </span>
            </motion.div>
          )}
        </AnimatePresence>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
          data-testid="sidebar-toggle"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Menu Items */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1">
        <div className="space-y-1 mb-4">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive(item.path)
                ? 'text-cyan-400 bg-cyan-500/10 border-r-2 border-cyan-500'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              data-testid={item.testId}
            >
              <item.icon size={20} />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="font-medium"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          ))}
        </div>

        {/* Reports List */}
        {!collapsed && location.pathname === '/dashboard' && (
          <div className="border-t border-white/5 pt-3">
            <h3 className="text-xs uppercase text-slate-500 font-semibold mb-2 px-4">Recent Reports</h3>
            <div className="space-y-1 max-h-96 overflow-y-auto">
              {reports.length === 0 ? (
                <p className="text-sm text-slate-500 px-4 py-2">No reports yet</p>
              ) : (
                reports.map((report) => (
                  <button
                    key={report.id}
                    onClick={() => onReportSelect(report.id)}
                    className={`w-full text-left px-4 py-2 rounded-lg transition-all ${selectedReportId === report.id
                      ? 'bg-purple-500/10 text-purple-400'
                      : 'text-slate-400 hover:bg-white/5 hover:text-white'
                      }`}
                    data-testid={`report-item-${report.id}`}
                  >
                    <p className="text-sm font-medium truncate">{report.title}</p>
                    <p className="text-xs text-slate-600 truncate">
                      {new Date(report.created_at).toLocaleDateString()}
                    </p>
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Logout Button */}
      <div className="p-3 border-t border-white/5">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all w-full"
          data-testid="sidebar-logout"
        >
          <LogOut size={20} />
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="font-medium"
              >
                Logout
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.div>
  );
};

export default Sidebar;