import React, { useState, useEffect } from 'react';
import MainLayout from '../components/MainLayout';
import { ShieldAlert, Users, Server, Activity, Database, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

const AdminPanel = () => {
  const { user } = useAuth();
  const [activities, setActivities] = useState([]);
  const [loadingActivities, setLoadingActivities] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        // Note: in a real app you might need withCredentials: true or passing the token
        const res = await axios.get(`${API_URL}/api/admin/recent-activity`);
        setActivities(res.data);
      } catch (err) {
        console.error('Failed to fetch recent activity:', err);
      } finally {
        setLoadingActivities(false);
      }
    };
    if (user?.role === 'admin') fetchActivities();
  }, [user]);

  // Basic RBAC check
  if (user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return (
    <MainLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center space-x-3">
            <ShieldAlert className="h-8 w-8 text-indigo-500" />
            <span>Admin Control Panel</span>
          </h1>
          <p className="mt-2 text-sm text-zinc-400">
            System-wide security metrics, user management, and health monitoring.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-dark-card border border-dark-border p-6 rounded-xl shadow-sm">
            <div className="flex items-center space-x-4 mb-4">
              <div className="bg-blue-500/10 p-3 rounded-lg text-blue-400">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-500">Total Users</p>
                <p className="text-2xl font-bold text-white">1,248</p>
              </div>
            </div>
            <div className="text-xs text-emerald-400 flex items-center">
              <TrendingUpIcon className="h-3 w-3 mr-1" /> +12% from last month
            </div>
          </div>
          
          <div className="bg-dark-card border border-dark-border p-6 rounded-xl shadow-sm">
            <div className="flex items-center space-x-4 mb-4">
              <div className="bg-emerald-500/10 p-3 rounded-lg text-emerald-400">
                <Database className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-500">Repositories Scanned</p>
                <p className="text-2xl font-bold text-white">4,802</p>
              </div>
            </div>
            <div className="text-xs text-emerald-400 flex items-center">
              <TrendingUpIcon className="h-3 w-3 mr-1" /> +8% from last month
            </div>
          </div>

          <div className="bg-dark-card border border-dark-border p-6 rounded-xl shadow-sm">
            <div className="flex items-center space-x-4 mb-4">
              <div className="bg-rose-500/10 p-3 rounded-lg text-rose-400">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-500">Critical Threats Detected</p>
                <p className="text-2xl font-bold text-white">34</p>
              </div>
            </div>
            <div className="text-xs text-rose-400 flex items-center">
              Needs immediate attention
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-dark-card border border-dark-border p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
              <Server className="h-5 w-5 text-indigo-400" />
              <span>System Health</span>
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-zinc-900/50 rounded border border-zinc-800">
                <div className="flex items-center space-x-3">
                  <Activity className="h-4 w-4 text-emerald-400" />
                  <span className="text-sm text-zinc-300">API Gateway</span>
                </div>
                <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded">Operational</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-zinc-900/50 rounded border border-zinc-800">
                <div className="flex items-center space-x-3">
                  <Activity className="h-4 w-4 text-emerald-400" />
                  <span className="text-sm text-zinc-300">AI Analysis Engine</span>
                </div>
                <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded">Operational</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-zinc-900/50 rounded border border-zinc-800">
                <div className="flex items-center space-x-3">
                  <Activity className="h-4 w-4 text-emerald-400" />
                  <span className="text-sm text-zinc-300">Database Cluster</span>
                </div>
                <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded">Operational</span>
              </div>
            </div>
          </div>

          <div className="bg-dark-card border border-dark-border p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
              <Users className="h-5 w-5 text-indigo-400" />
              <span>Recent User Activity</span>
            </h3>
            <div className="space-y-4">
              {loadingActivities ? (
                <div className="flex justify-center p-4">
                  <Loader2 className="h-6 w-6 animate-spin text-indigo-500" />
                </div>
              ) : activities.length > 0 ? (
                activities.map((activity, idx) => {
                  const minsAgo = Math.max(1, Math.floor((new Date() - new Date(activity.timestamp)) / 60000));
                  let timeDisplay = `${minsAgo} mins ago`;
                  if (minsAgo > 1440) timeDisplay = `${Math.floor(minsAgo / 1440)} days ago`;
                  else if (minsAgo > 60) timeDisplay = `${Math.floor(minsAgo / 60)} hrs ago`;
                  
                  return (
                    <div key={activity._id || idx} className="flex justify-between items-center border-b border-dark-border pb-3 last:border-0 last:pb-0">
                      <div className="flex items-center space-x-3">
                        <div className="h-8 w-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 text-xs font-bold uppercase">
                          {activity.name ? activity.name[0] : 'U'}
                        </div>
                        <div>
                          <p className="text-sm text-zinc-300">{activity.email}</p>
                          <p className="text-xs text-zinc-500">{activity.action}</p>
                        </div>
                      </div>
                      <span className="text-xs text-zinc-500">{timeDisplay}</span>
                    </div>
                  );
                })
              ) : (
                <p className="text-xs text-zinc-500 text-center py-4">No recent activity.</p>
              )}
            </div>
          </div>
        </div>

      </div>
    </MainLayout>
  );
};

// Helper component for icon
const TrendingUpIcon = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
    <polyline points="16 7 22 7 22 13" />
  </svg>
);

export default AdminPanel;
