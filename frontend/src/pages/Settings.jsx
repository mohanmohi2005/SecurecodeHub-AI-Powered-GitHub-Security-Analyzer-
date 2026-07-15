import React, { useState } from 'react';
import MainLayout from '../components/MainLayout';
import { Settings as SettingsIcon, Bell, Shield, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('notifications');
  const [notifications, setNotifications] = useState({
    scanCompletions: true,
    criticalAlerts: true
  });
  const [saved, setSaved] = useState(false);
  const { user, deleteAccount } = useAuth();
  const navigate = useNavigate();

  const handleToggle = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    if (window.confirm('Are you absolutely sure you want to permanently delete your account? This action cannot be undone.')) {
      const res = await deleteAccount(user._id);
      if (res.success) {
        navigate('/login');
      } else {
        alert(res.error);
      }
    }
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="border-b border-dark-border pb-5">
          <h1 className="text-2xl font-bold text-white flex items-center space-x-2">
            <SettingsIcon className="h-6 w-6 text-indigo-500" />
            <span>Settings</span>
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1 space-y-1">
            <button 
              onClick={() => setActiveTab('notifications')}
              className={`w-full text-left px-4 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === 'notifications' ? 'bg-indigo-500/10 text-indigo-400' : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'}`}
            >
              Notifications
            </button>
            <button 
              onClick={() => setActiveTab('general')}
              className={`w-full text-left px-4 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === 'general' ? 'bg-indigo-500/10 text-indigo-400' : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'}`}
            >
              General
            </button>
          </div>
          
          <div className="md:col-span-3 space-y-6">
            
            {activeTab === 'notifications' && (
            <div className="bg-dark-card border border-dark-border rounded-xl p-6 relative">
              {saved && (
                <div className="absolute top-4 right-4 flex items-center space-x-1 text-emerald-400 text-sm font-medium bg-emerald-500/10 px-2 py-1 rounded">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Saved</span>
                </div>
              )}
              <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                <Bell className="h-5 w-5 text-zinc-400" />
                <span>Email Notifications</span>
              </h3>
              <div className="mt-4 space-y-4">
                <label className="flex items-center justify-between p-3 border border-dark-border rounded-lg cursor-pointer hover:bg-zinc-800/50">
                  <div>
                    <p className="text-sm font-medium text-white">Scan Completions</p>
                    <p className="text-xs text-zinc-500">Receive an email when a repository scan finishes.</p>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={notifications.scanCompletions}
                    onChange={() => handleToggle('scanCompletions')}
                    className="w-5 h-5 accent-indigo-500 cursor-pointer" 
                  />
                </label>
                <label className="flex items-center justify-between p-3 border border-dark-border rounded-lg cursor-pointer hover:bg-zinc-800/50">
                  <div>
                    <p className="text-sm font-medium text-white">Critical Vulnerability Alerts</p>
                    <p className="text-xs text-zinc-500">Get notified immediately if a critical issue is found.</p>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={notifications.criticalAlerts}
                    onChange={() => handleToggle('criticalAlerts')}
                    className="w-5 h-5 accent-indigo-500 cursor-pointer" 
                  />
                </label>
              </div>
            </div>
            )}

            {activeTab === 'general' && (
            <div className="border border-red-900/50 bg-red-950/10 rounded-xl p-6 mt-10">
              <h3 className="text-lg font-semibold text-red-500 flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Danger Zone</span>
              </h3>
              <p className="text-sm text-zinc-400 mt-1 mb-4">Permanently delete your account and all scan history.</p>
              <button 
                onClick={handleDeleteAccount}
                className="px-4 py-2 bg-red-600/20 text-red-500 hover:bg-red-600 hover:text-white text-sm font-semibold rounded-lg transition-colors border border-red-900/50"
              >
                Delete Account
              </button>
            </div>
            )}

          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Settings;
