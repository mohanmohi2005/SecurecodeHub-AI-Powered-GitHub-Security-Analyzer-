import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

const GitHubCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [status, setStatus] = useState('processing'); // processing, success, error
  const [errorMsg, setErrorMsg] = useState('');
  const hasRequested = React.useRef(false);

  useEffect(() => {
    if (!user) return; // Wait for user to be loaded from AuthContext
    if (hasRequested.current) return; // Prevent double execution in StrictMode

    const code = searchParams.get('code');
    
    if (!code) {
      setStatus('error');
      setErrorMsg('No authorization code found in URL.');
      return;
    }

    hasRequested.current = true;

    const connectGitHub = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        await axios.post(`${API_URL}/api/github/callback`, {
          code,
          userId: user?._id || user?.id
        });
        
        setStatus('success');
        // Redirect back to scan page after a brief delay
        setTimeout(() => {
          navigate('/scan');
        }, 2000);
      } catch (error) {
        console.error('Failed to connect GitHub:', error);
        setStatus('error');
        setErrorMsg(error.response?.data?.error || 'Failed to authenticate with GitHub.');
      }
    };

    connectGitHub();
  }, [searchParams, navigate, user]);

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-dark-card border border-dark-border rounded-xl p-8 text-center shadow-2xl">
        {status === 'processing' && (
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-12 w-12 text-indigo-500 animate-spin" />
            <h2 className="text-xl font-semibold text-white">Connecting to GitHub...</h2>
            <p className="text-zinc-400 text-sm">Please wait while we secure your connection.</p>
          </div>
        )}
        
        {status === 'success' && (
          <div className="flex flex-col items-center space-y-4">
            <div className="h-16 w-16 bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/20">
              <CheckCircle className="h-8 w-8 text-emerald-500" />
            </div>
            <h2 className="text-xl font-semibold text-white">Successfully Connected!</h2>
            <p className="text-zinc-400 text-sm">Redirecting you back to the scanner...</p>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center space-y-4">
            <div className="h-16 w-16 bg-red-500/10 rounded-full flex items-center justify-center border border-red-500/20">
              <XCircle className="h-8 w-8 text-red-500" />
            </div>
            <h2 className="text-xl font-semibold text-white">Connection Failed</h2>
            <p className="text-red-400 text-sm">{errorMsg}</p>
            <button 
              onClick={() => navigate('/scan')}
              className="mt-4 px-6 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors"
            >
              Return to App
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GitHubCallback;
