import React from 'react';
import MainLayout from '../components/MainLayout';
import { useAuth } from '../context/AuthContext';
import { User, Calendar, ShieldCheck, Mail } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();

  return (
    <MainLayout>
      <div className="max-w-3xl space-y-8 mx-auto">
        
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Developer Profile</h1>
          <p className="mt-2 text-sm text-zinc-400">
            Manage your account preferences and view scanning access keys.
          </p>
        </div>

        {/* Profile Details Card */}
        <div className="rounded-xl border border-dark-border bg-dark-card p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 pb-6 border-b border-dark-border">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-indigo-600 text-white text-3xl font-extrabold shadow-lg shadow-indigo-600/30">
              {user?.name ? user.name[0].toUpperCase() : 'D'}
            </div>
            <div className="text-center sm:text-left">
              <h2 className="text-xl font-bold text-white">{user?.name || 'Developer'}</h2>
              <span className="inline-flex items-center space-x-1.5 text-indigo-400 font-medium text-sm mt-1">
                <ShieldCheck className="h-4 w-4" />
                <span>Authorized Security Analyst</span>
              </span>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            
            {/* Email Field */}
            <div className="flex items-center space-x-3 text-sm">
              <Mail className="h-5 w-5 text-zinc-500" />
              <div>
                <p className="text-xs text-zinc-500 font-medium">Email Address</p>
                <p className="text-zinc-300 font-medium mt-0.5">{user?.email || 'developer@example.com'}</p>
              </div>
            </div>

            {/* Created At Field */}
            <div className="flex items-center space-x-3 text-sm">
              <Calendar className="h-5 w-5 text-zinc-500" />
              <div>
                <p className="text-xs text-zinc-500 font-medium">Member Since</p>
                <p className="text-zinc-300 font-medium mt-0.5">July 8, 2026</p>
              </div>
            </div>

          </div>
        </div>

        {/* API Settings / Extra placeholder info */}
        <div className="rounded-xl border border-dark-border bg-dark-card p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-white mb-4">Security Rules & Scope</h3>
          <p className="text-sm text-zinc-400 leading-relaxed">
            By scanning repositories, you consent to let the engine perform text matching and regex search heuristics. Secure CodeHub does not execute, compile, or run package installers. All scanned files are processed inside isolated scratch spaces and removed immediately post-scan.
          </p>
        </div>

      </div>
    </MainLayout>
  );
};

export default Profile;
