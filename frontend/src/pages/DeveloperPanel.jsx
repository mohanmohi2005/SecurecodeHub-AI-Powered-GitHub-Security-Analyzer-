import React from 'react';
import MainLayout from '../components/MainLayout';
import { Terminal, GitBranch, Shield, Activity, GitCommit, Play, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const DeveloperPanel = () => {
  const { user } = useAuth();

  // Basic RBAC check
  if (user?.role !== 'developer' && user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return (
    <MainLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center space-x-3">
            <Terminal className="h-8 w-8 text-indigo-500" />
            <span>Developer Portal</span>
          </h1>
          <p className="mt-2 text-sm text-zinc-400">
            Your assigned repositories, recent commits, and CI/CD status.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-dark-card border border-dark-border p-6 rounded-xl shadow-sm hover:border-indigo-500/50 transition-colors cursor-pointer">
            <div className="flex items-center space-x-4 mb-4">
              <div className="bg-indigo-500/10 p-3 rounded-lg text-indigo-400">
                <GitBranch className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-500">My Repositories</p>
                <p className="text-2xl font-bold text-white">4 Active</p>
              </div>
            </div>
            <div className="text-xs text-zinc-400 flex items-center justify-between">
              <span>View details</span>
              <span className="text-indigo-400">&rarr;</span>
            </div>
          </div>
          
          <div className="bg-dark-card border border-dark-border p-6 rounded-xl shadow-sm">
            <div className="flex items-center space-x-4 mb-4">
              <div className="bg-rose-500/10 p-3 rounded-lg text-rose-400">
                <Shield className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-500">My Assigned Issues</p>
                <p className="text-2xl font-bold text-white">12 Pending</p>
              </div>
            </div>
            <div className="text-xs text-rose-400 flex items-center">
              3 Critical vulnerabilities
            </div>
          </div>

          <div className="bg-dark-card border border-dark-border p-6 rounded-xl shadow-sm">
            <div className="flex items-center space-x-4 mb-4">
              <div className="bg-emerald-500/10 p-3 rounded-lg text-emerald-400">
                <Activity className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-500">SAST Scan Pass Rate</p>
                <p className="text-2xl font-bold text-white">88%</p>
              </div>
            </div>
            <div className="text-xs text-emerald-400 flex items-center">
              Great job this week!
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-dark-card border border-dark-border p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
              <GitCommit className="h-5 w-5 text-indigo-400" />
              <span>Recent Analyzed Commits</span>
            </h3>
            <div className="space-y-4">
              {[
                { hash: 'a1b2c3d', msg: 'fix: SQL injection in login handler', time: '1 hr ago', status: 'clean' },
                { hash: 'e4f5g6h', msg: 'feat: add user profile picture upload', time: '3 hrs ago', status: 'vuln' },
                { hash: 'i7j8k9l', msg: 'chore: update dependencies', time: '1 day ago', status: 'clean' },
              ].map((commit, idx) => (
                <div key={idx} className="flex justify-between items-center p-3 bg-zinc-900/50 rounded border border-zinc-800">
                  <div className="flex flex-col">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs text-indigo-400">{commit.hash}</span>
                      <span className="text-sm text-zinc-300 truncate w-48">{commit.msg}</span>
                    </div>
                    <span className="text-[10px] text-zinc-500 mt-1">{commit.time}</span>
                  </div>
                  {commit.status === 'clean' ? (
                     <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded flex items-center">
                       <CheckCircle className="h-3 w-3 mr-1" /> Clean
                     </span>
                  ) : (
                     <span className="text-xs bg-rose-500/20 text-rose-400 px-2 py-1 rounded flex items-center">
                       <Shield className="h-3 w-3 mr-1" /> Vulnerable
                     </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-dark-card border border-dark-border p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
              <Play className="h-5 w-5 text-indigo-400" />
              <span>CI/CD Pipelines (SAST Checks)</span>
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-dark-border pb-3">
                <div>
                  <p className="text-sm text-zinc-300">backend-api / main</p>
                  <p className="text-xs text-zinc-500">Triggered by commit a1b2c3d</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-xs text-emerald-400">Passed</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center border-b border-dark-border pb-3">
                <div>
                  <p className="text-sm text-zinc-300">frontend-app / main</p>
                  <p className="text-xs text-zinc-500">Triggered by commit e4f5g6h</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="h-2 w-2 rounded-full bg-rose-500"></span>
                  <span className="text-xs text-rose-400">Failed (SAST)</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-zinc-300">auth-service / main</p>
                  <p className="text-xs text-zinc-500">Scheduled Daily Scan</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
                  <span className="text-xs text-blue-400">Running...</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </MainLayout>
  );
};

export default DeveloperPanel;
