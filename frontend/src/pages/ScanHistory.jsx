import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../components/MainLayout';
import { History, Play, Trash2, CheckCircle, Clock, AlertTriangle, ArrowRight, Loader2 } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const ScanHistory = () => {
  const { user } = useAuth();
  const [historyList, setHistoryList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    try {
      const userId = user?._id || user?.id;
      if (!userId) return;

      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await axios.get(`${API_URL}/api/scan/history/${userId}`);
      setHistoryList(response.data);
    } catch (error) {
      console.error('Error fetching scan history:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchHistory();
    }
  }, [user]);

  const handleDeleteHistory = async (id) => {
    if (!window.confirm('Are you sure you want to delete this scan history? This will also remove all findings and repository records.')) {
      return;
    }

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      await axios.delete(`${API_URL}/api/scan/history/${id}`);
      
      // Update local state
      setHistoryList(historyList.filter(item => item._id !== id));
    } catch (error) {
      console.error('Error deleting scan history:', error);
      alert('Failed to delete history record.');
    }
  };

  const formatDate = (dateString) => {
    try {
      const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
      return new Date(dateString).toLocaleDateString('en-US', options);
    } catch (e) {
      return dateString;
    }
  };

  return (
    <MainLayout>
      <div className="space-y-8">
        
        {/* Title */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center space-x-3">
            <History className="h-8 w-8 text-indigo-500" />
            <span>Scan History</span>
          </h1>
          <p className="mt-2 text-sm text-zinc-400">
            View status and reports of past scans, delete history, or initiate rescans.
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[300px] space-y-4">
            <Loader2 className="h-10 w-10 animate-spin text-indigo-500" />
            <p className="text-zinc-400 text-sm">Loading scan history...</p>
          </div>
        ) : (
          /* Table/List of scan logs */
          <div className="rounded-xl border border-dark-border bg-dark-card overflow-hidden">
            <div className="overflow-x-auto">
              {historyList.length === 0 ? (
                <div className="p-12 text-center space-y-4">
                  <div className="inline-flex items-center justify-center p-3 rounded-full bg-zinc-800 text-zinc-500">
                    <History className="h-8 w-8" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-semibold text-white">No Scan History</h4>
                    <p className="text-xs text-zinc-400">You haven't scanned any repositories yet.</p>
                  </div>
                  <Link 
                    to="/scan" 
                    className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500 transition-all"
                  >
                    Scan Your First Repository
                  </Link>
                </div>
              ) : (
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-dark-border bg-zinc-900/50 text-zinc-400 font-semibold">
                      <th className="p-4">Repository</th>
                      <th className="p-4">Date</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-center">Files</th>
                      <th className="p-4 text-center">Vulnerabilities</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-dark-border">
                    {historyList.map((log) => (
                      <tr key={log._id} className="hover:bg-zinc-800/30 transition-colors">
                        <td className="p-4">
                          <div>
                            <div className="font-semibold text-white">
                              {log.repositoryId?.repositoryName || 'Deleted Repository'}
                            </div>
                            <div className="text-xs text-zinc-500 font-mono mt-0.5 max-w-xs truncate">
                              {log.repositoryId?.repositoryUrl || ''}
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-zinc-400">
                          {formatDate(log.scanDate)}
                        </td>
                        <td className="p-4">
                          {log.status === 'complete' && (
                            <span className="inline-flex items-center space-x-1 text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded text-xs border border-emerald-500/20">
                              <CheckCircle className="h-3 w-3" />
                              <span>Success</span>
                            </span>
                          )}
                          {log.status === 'failed' && (
                            <span className="inline-flex items-center space-x-1 text-red-400 bg-red-500/10 px-2 py-0.5 rounded text-xs border border-red-500/20">
                              <AlertTriangle className="h-3 w-3" />
                              <span>Failed</span>
                            </span>
                          )}
                          {log.status === 'running' && (
                            <span className="inline-flex items-center space-x-1 text-yellow-400 bg-yellow-500/10 px-2 py-0.5 rounded text-xs border border-yellow-500/20">
                              <Clock className="h-3 w-3 animate-spin" />
                              <span>Running</span>
                            </span>
                          )}
                        </td>
                        <td className="p-4 text-center text-zinc-300 font-mono">
                          {log.filesScanned}
                        </td>
                        <td className="p-4 text-center">
                          {log.vulnerabilitiesFound > 0 ? (
                            <span className="font-semibold font-mono text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
                              {log.vulnerabilitiesFound} found
                            </span>
                          ) : log.status === 'complete' ? (
                            <span className="text-emerald-400 font-medium">Clean</span>
                          ) : (
                            <span className="text-zinc-500 font-mono">-</span>
                          )}
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex justify-end items-center space-x-3">
                            {log.status === 'complete' && log.repositoryId && (
                              <Link 
                                to={`/results/${log.repositoryId._id}`} 
                                className="inline-flex items-center space-x-1 text-indigo-400 hover:text-indigo-300 text-xs font-semibold"
                              >
                                <span>Report</span>
                                <ArrowRight className="h-3 w-3" />
                              </Link>
                            )}
                            <button 
                              onClick={() => handleDeleteHistory(log._id)}
                              className="text-zinc-500 hover:text-red-400 p-1 rounded hover:bg-zinc-800 transition-all"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

      </div>
    </MainLayout>
  );
};

export default ScanHistory;
