import React, { useState, useEffect } from 'react';
import MainLayout from '../components/MainLayout';
import { ShieldAlert, GitBranch, Github, Loader2, LinkIcon, BookMarked, Lock, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const ScanRepository = () => {
  const [repoUrl, setRepoUrl] = useState('');
  const [branch, setBranch] = useState('main');
  const [scanning, setScanning] = useState(false);
  
  // GitHub Integration States
  const [isGithubConnected, setIsGithubConnected] = useState(false);
  const [githubUsername, setGithubUsername] = useState('');
  const [githubRepos, setGithubRepos] = useState([]);
  const [loadingRepos, setLoadingRepos] = useState(false);
  const [activeTab, setActiveTab] = useState('manual'); // 'manual' or 'github'

  const navigate = useNavigate();
  const { user } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    // Check GitHub status on mount
    const checkGithubStatus = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/github/status?userId=${user?._id || user?.id}`);
        setIsGithubConnected(response.data.isConnected);
        if (response.data.isConnected) {
          setGithubUsername(response.data.githubUsername);
          setActiveTab('github'); // Default to github tab if connected
          fetchRepos();
        }
      } catch (error) {
        console.error("Failed to check github status:", error);
      }
    };
    
    if (user) {
      checkGithubStatus();
    }
  }, [user, API_URL]);

  const fetchRepos = async () => {
    setLoadingRepos(true);
    try {
      const response = await axios.get(`${API_URL}/api/github/repos?userId=${user?._id || user?.id}`);
      setGithubRepos(response.data.repos);
    } catch (error) {
      console.error("Failed to fetch repos:", error);
    } finally {
      setLoadingRepos(false);
    }
  };

  const handleConnectGithub = async (e) => {
    if (e) e.preventDefault();
    try {
      console.log("Attempting to fetch auth URL from:", `${API_URL}/api/github/auth`);
      const response = await axios.get(`${API_URL}/api/github/auth`);
      if (!response.data || !response.data.url) {
        throw new Error("Backend did not return a valid URL. Response: " + JSON.stringify(response.data));
      }
      console.log("Redirecting to:", response.data.url);
      window.location.href = response.data.url;
    } catch (error) {
      console.error("Failed to get auth url:", error);
      alert(`Failed to initiate GitHub login. Error: ${error.message || "Unknown error"}`);
    }
  };

  const executeScan = async (urlToScan, branchToScan) => {
    setScanning(true);
    try {
      // 1. Add repository to database
      const response = await axios.post(`${API_URL}/api/repository/add`, {
        repositoryUrl: urlToScan,
        branch: branchToScan,
        userId: user?._id || user?.id
      });
      
      const repositoryId = response.data._id;

      // 2. Trigger the actual security scan
      await axios.post(`${API_URL}/api/scan/start`, {
        repositoryId,
        userId: user?._id || user?.id
      });

      // 3. Navigate to results page
      navigate(`/results/${repositoryId}`);
    } catch (error) {
      console.error('Failed to analyze repository:', error);
      const data = error.response?.data;
      const errorMsg = data?.error || data?.message || error.message || 'Failed to analyze repository. Please check the URL and try again.';
      alert(`Analysis Failed: ${errorMsg}`);
      setScanning(false);
    }
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!repoUrl) return;
    executeScan(repoUrl, branch);
  };

  const handleRepoSelect = (repo) => {
    // For now, we'll scan the default branch of the selected repo
    executeScan(repo.clone_url, repo.default_branch || 'main');
  };

  return (
    <MainLayout>
      <div className="max-w-4xl space-y-8 mx-auto">
        
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Scan a Repository</h1>
          <p className="mt-2 text-sm text-zinc-400">
            Select a repository from your GitHub account or manually enter a public URL to begin the AI security analysis.
          </p>
        </div>

        {/* Scan Card */}
        <div className="rounded-xl border border-dark-border bg-dark-card overflow-hidden shadow-sm">
          
          {/* Tabs */}
          <div className="flex border-b border-dark-border bg-zinc-900/30">
            <button 
              onClick={() => setActiveTab('github')}
              className={`flex-1 py-4 text-sm font-semibold flex items-center justify-center space-x-2 transition-colors ${
                activeTab === 'github' ? 'border-b-2 border-indigo-500 text-indigo-400' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Github className="h-4 w-4" />
              <span>GitHub Integration</span>
            </button>
            <button 
              onClick={() => setActiveTab('manual')}
              className={`flex-1 py-4 text-sm font-semibold flex items-center justify-center space-x-2 transition-colors ${
                activeTab === 'manual' ? 'border-b-2 border-indigo-500 text-indigo-400' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <LinkIcon className="h-4 w-4" />
              <span>Manual URL</span>
            </button>
          </div>

          <div className="p-8">
            {activeTab === 'manual' && (
              <form onSubmit={handleManualSubmit} className="space-y-6">
                <div>
                  <label htmlFor="repo-url" className="block text-sm font-semibold text-zinc-300 mb-2">
                    Public Git Repository URL
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <LinkIcon className="h-5 w-5 text-zinc-500" />
                    </div>
                    <input
                      id="repo-url"
                      type="text"
                      required
                      placeholder="https://github.com/username/repository"
                      value={repoUrl}
                      onChange={(e) => setRepoUrl(e.target.value)}
                      className="block w-full rounded-lg border border-zinc-700 bg-zinc-900/50 py-3 pl-10 pr-3 text-white placeholder-zinc-500 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="branch" className="block text-sm font-semibold text-zinc-300 mb-2">
                    Branch (Optional)
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <GitBranch className="h-5 w-5 text-zinc-500" />
                    </div>
                    <input
                      id="branch"
                      type="text"
                      placeholder="main"
                      value={branch}
                      onChange={(e) => setBranch(e.target.value)}
                      className="block w-full rounded-lg border border-zinc-700 bg-zinc-900/50 py-3 pl-10 pr-3 text-white placeholder-zinc-500 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm transition-all"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={scanning}
                    className="flex w-full justify-center items-center space-x-2 rounded-lg bg-indigo-600 py-3 px-4 text-sm font-semibold text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-zinc-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {scanning ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span>Analyzing Repository...</span>
                      </>
                    ) : (
                      <>
                        <ShieldAlert className="h-5 w-5" />
                        <span>Start Security Analysis</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {activeTab === 'github' && (
              <div>
                {!isGithubConnected ? (
                  <div className="text-center py-12 border-2 border-dashed border-dark-border rounded-xl">
                    <Github className="h-12 w-12 text-zinc-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-white mb-2">Connect your GitHub Account</h3>
                    <p className="text-zinc-400 text-sm mb-6 max-w-md mx-auto">
                      Connect SecureCodeHub to your GitHub account to easily select and scan your repositories without copying URLs.
                    </p>
                    <button 
                      type="button"
                      onClick={handleConnectGithub}
                      className="inline-flex items-center space-x-2 bg-white text-black font-semibold py-2 px-6 rounded-lg hover:bg-zinc-200 transition-colors"
                    >
                      <Github className="h-4 w-4" />
                      <span>Authorize GitHub</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-sm text-zinc-400">
                        Connected as <span className="font-semibold text-indigo-400">@{githubUsername}</span>
                      </p>
                      <button onClick={fetchRepos} className="text-xs text-indigo-400 hover:text-indigo-300">
                        Refresh List
                      </button>
                    </div>

                    {loadingRepos ? (
                      <div className="flex flex-col justify-center items-center py-12 space-y-3">
                        <Loader2 className="h-8 w-8 text-indigo-500 animate-spin" />
                        <span className="text-sm text-zinc-400">Fetching your repositories...</span>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                        {githubRepos.map(repo => (
                          <div 
                            key={repo.id}
                            onClick={() => !scanning && handleRepoSelect(repo)}
                            className={`border border-dark-border rounded-lg p-4 bg-zinc-900/30 hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-colors group ${scanning ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex items-center space-x-2">
                                <BookMarked className="h-4 w-4 text-zinc-500 group-hover:text-indigo-400" />
                                <h4 className="font-semibold text-white truncate max-w-[200px]" title={repo.full_name}>
                                  {repo.name}
                                </h4>
                              </div>
                              {repo.private ? (
                                <Lock className="h-3 w-3 text-amber-500" title="Private" />
                              ) : (
                                <Globe className="h-3 w-3 text-emerald-500" title="Public" />
                              )}
                            </div>
                            <div className="mt-3 flex items-center space-x-4 text-xs text-zinc-500">
                              {repo.language && (
                                <span className="flex items-center space-x-1">
                                  <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                                  <span>{repo.language}</span>
                                </span>
                              )}
                              <span>Updated {new Date(repo.updated_at).toLocaleDateString()}</span>
                            </div>
                          </div>
                        ))}
                        
                        {githubRepos.length === 0 && !loadingRepos && (
                          <div className="col-span-2 text-center py-8 text-zinc-500">
                            No repositories found on this account.
                          </div>
                        )}
                      </div>
                    )}
                    
                    {scanning && (
                      <div className="absolute inset-0 bg-dark-bg/80 backdrop-blur-sm flex flex-col items-center justify-center z-10 rounded-xl">
                        <Loader2 className="h-10 w-10 text-indigo-500 animate-spin mb-4" />
                        <h3 className="text-xl font-bold text-white">Analyzing Repository...</h3>
                        <p className="text-sm text-zinc-400 mt-2">This may take a few moments</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ScanRepository;

