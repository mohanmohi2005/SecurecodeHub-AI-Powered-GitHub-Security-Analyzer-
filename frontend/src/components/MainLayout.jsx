import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  ShieldAlert,
  History,
  User,
  LogOut,
  Terminal,
  Menu,
  X,
  ShieldCheck,
  Settings,
  GraduationCap,
  Code,
  Shield
} from 'lucide-react';

const MainLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    ...(user?.role === 'admin' ? [{ name: 'Admin Panel', path: '/admin', icon: Shield }] : []),
    ...(user?.role === 'developer' || user?.role === 'admin' ? [{ name: 'Developer Portal', path: '/developer', icon: Code }] : []),
    { name: 'Scan Repository', path: '/scan', icon: ShieldAlert },
    { name: 'Scan History', path: '/history', icon: History },
    { name: 'Training Hub', path: '/training', icon: GraduationCap },
    { name: 'Profile', path: '/profile', icon: User },
    { name: 'Settings', path: '/settings', icon: Settings }
  ];

  return (
    <div className="flex h-screen bg-dark-bg text-dark-text overflow-hidden">
      {/* Sidebar for Desktop */}
      <aside className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-dark-border bg-dark-card transition-transform duration-300 md:static md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between border-b border-dark-border px-6">
          <Link to="/" className="flex items-center space-x-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600">
              <ShieldCheck className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">Secure CodeHub</span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white md:hidden">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-1.5 px-4 py-6 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center space-x-3 rounded-lg px-4 py-3 text-sm font-medium transition-all ${isActive
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                    : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100'
                  }`}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Info footer */}
        <div className="border-t border-dark-border p-4 bg-zinc-900/50">
          <div className="flex items-center space-x-3 mb-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-700 text-white font-semibold">
              {user?.name ? user.name[0].toUpperCase() : 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.name || 'Developer'}</p>
              <p className="text-xs text-zinc-500 truncate">{user?.email || 'user@example.com'}</p>
              <p className="text-[10px] text-indigo-400 font-bold uppercase mt-0.5">{user?.role || 'user'}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex w-full items-center justify-center space-x-2 rounded-lg border border-dark-border py-2 text-sm font-medium text-zinc-400 hover:bg-zinc-800 hover:text-white transition-all"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Navbar */}
        <header className="flex h-16 items-center justify-between border-b border-dark-border bg-dark-card px-6">
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white md:hidden"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="ml-4 md:ml-0 flex items-center space-x-2">
              <Terminal className="h-5 w-5 text-indigo-500" />
              <span className="hidden sm:inline-block text-xs font-mono text-zinc-500">SYSTEM // DEPLOYED</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <span className="inline-flex items-center rounded-full bg-indigo-500/10 px-2.5 py-0.5 text-xs font-medium text-indigo-400 ring-1 ring-inset ring-indigo-500/20">
              v1.0.0
            </span>
          </div>
        </header>

        {/* Content Wrapper */}
        <main className="flex-1 overflow-y-auto bg-dark-bg p-6 md:p-8">
          {children}
        </main>
      </div>

      {/* Sidebar mobile overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
        />
      )}
    </div>
  );
};

export default MainLayout;
