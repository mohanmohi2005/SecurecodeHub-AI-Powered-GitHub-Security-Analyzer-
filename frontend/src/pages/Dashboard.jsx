import React, { useEffect, useState } from 'react';
import MainLayout from '../components/MainLayout';
import { Shield, Wrench, Activity, CreditCard, FileCode, AlertTriangle, Loader2 } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [statsData, setStatsData] = useState({
    totalRepos: 0,
    totalFiles: 0,
    avgScore: 100,
    totalVulnerabilities: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const userId = user?._id || user?.id;
        if (!userId) return;

        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const response = await axios.get(`${API_URL}/api/scan/stats/${userId}`);
        setStatsData(response.data);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchStats();
    }
  }, [user]);

  const stats = [
    { name: 'Auto Remediation', value: 'Active', icon: Wrench, color: 'text-emerald-500 bg-emerald-500/10' },
    { name: 'Risk Analytics', value: 'Enabled', icon: Activity, color: 'text-indigo-500 bg-indigo-500/10' },
    { name: 'Card Details', value: 'Protected', icon: CreditCard, color: 'text-blue-500 bg-blue-500/10' },
    { name: 'Files Scanned', value: statsData.totalFiles.toLocaleString(), icon: FileCode, color: 'text-emerald-500 bg-emerald-500/10' },
    { name: 'Security Score', value: `${statsData.avgScore}/100`, icon: Shield, color: 'text-cyan-500 bg-cyan-500/10' },
    { name: 'Vulnerabilities', value: statsData.totalVulnerabilities.toString(), icon: AlertTriangle, color: 'text-red-500 bg-red-500/10' }
  ];

  return (
    <MainLayout>
      <div className="space-y-8">
        
        {/* Title Section */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Security Dashboard</h1>
          <p className="mt-2 text-sm text-zinc-400">
            Real-time static code analysis and security posture overview.
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[200px] space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
            <p className="text-zinc-400 text-sm">Loading security stats...</p>
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.name} className="overflow-hidden rounded-xl border border-dark-border bg-dark-card p-5 shadow-sm hover:border-zinc-700 transition-all">
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-lg ${stat.color}`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-zinc-500 truncate">{stat.name}</p>
                        <p className="text-2xl font-semibold text-white mt-1">{stat.value}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Visual Charts section */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2 rounded-xl border border-dark-border bg-dark-card p-6 min-h-[300px] flex flex-col justify-between">
                <div className="border-b border-dark-border pb-3 mb-4">
                  <h3 className="text-sm font-semibold text-white">Security Posture Summary</h3>
                  <p className="text-xs text-zinc-500 mt-1">Average repository safety assessment</p>
                </div>
                <div className="flex-1 flex flex-col items-center justify-center space-y-4">
                  <div className="relative flex items-center justify-center">
                    {/* Circle score indicator */}
                    <div className="w-36 h-36 rounded-full border-8 border-zinc-800 flex items-center justify-center">
                      <div className="text-center">
                        <span className="text-4xl font-bold text-white">{statsData.avgScore}</span>
                        <span className="text-zinc-500 text-xs block">Score</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-zinc-400 max-w-sm text-center">
                    Your average security score is calculated based on scan detections. A higher score indicates less risk of external exploitation.
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-dark-border bg-dark-card p-6 min-h-[300px] flex flex-col justify-between">
                <div className="border-b border-dark-border pb-3 mb-4">
                  <h3 className="text-sm font-semibold text-white">Risk Distribution</h3>
                  <p className="text-xs text-zinc-500 mt-1">Identified issues count</p>
                </div>
                <div className="flex-1 flex flex-col items-center justify-center space-y-6">
                  <div className="w-full space-y-4">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-red-400 font-medium">Vulnerabilities Detected</span>
                      <span className="font-mono text-white font-bold bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
                        {statsData.totalVulnerabilities} Total
                      </span>
                    </div>
                    {/* Linear risk visual progress bar */}
                    <div className="w-full bg-zinc-800 h-3 rounded-full overflow-hidden">
                      <div 
                        className="bg-red-500 h-full rounded-full transition-all duration-500" 
                        style={{ width: `${Math.min(100, statsData.totalVulnerabilities * 10)}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-[10px] text-zinc-500">
                      <span>Low Risk (0)</span>
                      <span>High Risk (10+)</span>
                    </div>
                  </div>
                  <p className="text-xs text-zinc-500 text-center">
                    Resolve findings to raise your Security Score to 100%.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

      </div>
    </MainLayout>
  );
};

export default Dashboard;
