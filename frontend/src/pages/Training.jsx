import React, { useState } from 'react';
import MainLayout from '../components/MainLayout';
import { 
  GraduationCap, 
  BookOpen, 
  ShieldAlert, 
  Terminal, 
  CheckCircle2, 
  PlayCircle,
  Award
} from 'lucide-react';

const Training = () => {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);

  const learningPaths = [
    {
      title: "Injection Flaws",
      description: "Learn how to defend against SQLi, NoSQLi, and OS Command injections.",
      progress: 75,
      modules: 4,
      icon: ShieldAlert,
      color: "text-red-400",
      bg: "bg-red-400/10",
      border: "border-red-500/20"
    },
    {
      title: "Broken Authentication",
      description: "Best practices for JWTs, session management, and password hashing.",
      progress: 30,
      modules: 5,
      icon: BookOpen,
      color: "text-orange-400",
      bg: "bg-orange-400/10",
      border: "border-orange-500/20"
    },
    {
      title: "Cryptographic Failures",
      description: "Secure data in transit and at rest using modern cryptography.",
      progress: 0,
      modules: 3,
      icon: Award,
      color: "text-indigo-400",
      bg: "bg-indigo-400/10",
      border: "border-indigo-500/20"
    }
  ];

  const handleQuizSubmit = (idx) => {
    setSelectedAnswer(idx);
    setShowResult(true);
  };

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto space-y-8 pb-12">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-dark-border pb-6 gap-4">
          <div>
            <div className="flex items-center space-x-2 text-indigo-400 mb-2">
              <GraduationCap className="h-5 w-5" />
              <span className="font-semibold text-sm tracking-wider uppercase">Security Academy</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Developer Training Center</h1>
            <p className="mt-2 text-sm text-zinc-400 max-w-2xl">
              Level up your secure coding skills. Learn how to identify, exploit, and patch the most critical vulnerabilities found in modern web applications.
            </p>
          </div>
          <div className="flex items-center bg-zinc-900/50 rounded-lg p-3 border border-dark-border">
            <Award className="h-8 w-8 text-yellow-500 mr-3" />
            <div>
              <p className="text-xs text-zinc-400 uppercase font-semibold">Your Rank</p>
              <p className="text-sm font-bold text-white">Security Novice (Lvl 2)</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Vulnerability of the Day */}
            <div className="rounded-xl border border-indigo-500/30 bg-gradient-to-br from-indigo-900/20 to-zinc-950 overflow-hidden relative">
              <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
              <div className="p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <span className="bg-indigo-500/20 text-indigo-400 text-xs font-bold px-2 py-1 rounded">FEATURED</span>
                  <span className="text-zinc-400 text-sm font-medium">Vulnerability of the Day</span>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Cross-Site Scripting (XSS) in React</h2>
                <p className="text-sm text-zinc-300 leading-relaxed mb-6">
                  React generally protects you from XSS by escaping values embedded in JSX. However, using specific APIs incorrectly can bypass these protections entirely.
                </p>

                <div className="space-y-4">
                  <div className="bg-zinc-950 rounded-lg p-4 border border-red-900/30">
                    <div className="flex items-center space-x-2 text-red-400 mb-2 border-b border-red-900/30 pb-2">
                      <ShieldAlert className="h-4 w-4" />
                      <span className="text-xs font-semibold uppercase">The Mistake</span>
                    </div>
                    <code className="text-xs font-mono text-zinc-300 block">
                      {`// Never trust user input injected directly into the DOM\n<div dangerouslySetInnerHTML={{ __html: userBio }} />`}
                    </code>
                  </div>

                  <div className="bg-zinc-950 rounded-lg p-4 border border-emerald-900/30">
                    <div className="flex items-center space-x-2 text-emerald-400 mb-2 border-b border-emerald-900/30 pb-2">
                      <CheckCircle2 className="h-4 w-4" />
                      <span className="text-xs font-semibold uppercase">The Secure Patch</span>
                    </div>
                    <code className="text-xs font-mono text-zinc-300 block">
                      {`// Use DOMPurify to sanitize HTML before rendering\nimport DOMPurify from 'dompurify';\n\nconst cleanHTML = DOMPurify.sanitize(userBio);\n<div dangerouslySetInnerHTML={{ __html: cleanHTML }} />`}
                    </code>
                  </div>
                </div>
                
                <button className="mt-6 flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium">
                  <PlayCircle className="h-4 w-4" />
                  <span>Start 5-min Interactive Lesson</span>
                </button>
              </div>
            </div>

            {/* Learning Paths */}
            <div>
              <h3 className="text-xl font-bold text-white mb-4">Your Learning Paths</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {learningPaths.map((path, idx) => (
                  <div key={idx} className="bg-dark-card border border-dark-border rounded-xl p-5 hover:border-zinc-700 transition-colors cursor-pointer group">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-2.5 rounded-lg ${path.bg} border ${path.border}`}>
                        <path.icon className={`h-5 w-5 ${path.color}`} />
                      </div>
                      <span className="text-xs text-zinc-500 font-medium">{path.modules} Modules</span>
                    </div>
                    <h4 className="font-bold text-white mb-1 group-hover:text-indigo-400 transition-colors">{path.title}</h4>
                    <p className="text-xs text-zinc-400 mb-4 line-clamp-2">{path.description}</p>
                    
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-zinc-300">Progress</span>
                        <span className="text-zinc-500">{path.progress}%</span>
                      </div>
                      <div className="w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className="bg-indigo-500 h-1.5 rounded-full" 
                          style={{ width: `${path.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Sidebar Area */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Interactive Quiz */}
            <div className="bg-dark-card border border-dark-border rounded-xl p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Terminal className="h-5 w-5 text-indigo-400" />
                <h3 className="font-bold text-white">Daily Knowledge Check</h3>
              </div>
              
              <p className="text-sm text-zinc-300 mb-4">
                Which of the following is the most secure way to store a user's password in your database?
              </p>
              
              <div className="space-y-3">
                {[
                  "Plain text (no encryption needed)",
                  "MD5 Hashing",
                  "Base64 Encoding",
                  "Argon2id or bcrypt with a salt"
                ].map((option, idx) => {
                  const isCorrect = idx === 3;
                  const isSelected = selectedAnswer === idx;
                  
                  let btnClass = "w-full text-left p-3 rounded-lg border text-sm transition-all ";
                  
                  if (!showResult) {
                    btnClass += "border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 text-zinc-300";
                  } else {
                    if (isCorrect) {
                      btnClass += "border-emerald-500/50 bg-emerald-500/10 text-emerald-300";
                    } else if (isSelected && !isCorrect) {
                      btnClass += "border-red-500/50 bg-red-500/10 text-red-300";
                    } else {
                      btnClass += "border-zinc-800 bg-zinc-900/20 text-zinc-500 opacity-50";
                    }
                  }

                  return (
                    <button 
                      key={idx}
                      disabled={showResult}
                      onClick={() => handleQuizSubmit(idx)}
                      className={btnClass}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>

              {showResult && (
                <div className={`mt-4 p-3 rounded-lg text-xs border ${
                  selectedAnswer === 3 
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300' 
                    : 'bg-red-500/10 border-red-500/20 text-red-300'
                }`}>
                  {selectedAnswer === 3 
                    ? "Correct! Argon2id and bcrypt are currently recommended for strong password hashing." 
                    : "Incorrect. MD5 and Base64 are cryptographically insecure and easily reversed."}
                </div>
              )}
            </div>

          </div>

        </div>

      </div>
    </MainLayout>
  );
};

export default Training;
