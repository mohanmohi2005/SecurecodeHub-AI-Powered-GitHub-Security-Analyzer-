import React, { useEffect, useState } from 'react';
import MainLayout from '../components/MainLayout';
import { useParams } from 'react-router-dom';
import { ShieldCheck, Code, AlertTriangle, Cpu, Terminal, Loader2, Activity, Shield, TrendingUp, CheckCircle, Lightbulb, GitMerge, BookOpen, Wrench } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Chart as ChartJS, ArcElement, Tooltip as ChartTooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

ChartJS.register(ArcElement, ChartTooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const ScanResults = () => {
  const { id } = useParams();
  const [repoDetails, setRepoDetails] = useState(null);
  const [vulnerabilities, setVulnerabilities] = useState([]);
  const { user } = useAuth();
  const [selectedVulnerability, setSelectedVulnerability] = useState(null);
  const [showSecureCode, setShowSecureCode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [diffMode, setDiffMode] = useState('split'); // 'split' or 'unified'
  const [fileContent, setFileContent] = useState('');
  const [viewMode, setViewMode] = useState('snippet'); // 'snippet' or 'full'
  const [exportingPDF, setExportingPDF] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        
        // Fetch repository details
        const repoResponse = await axios.get(`${API_URL}/api/repository/${id}`);
        setRepoDetails(repoResponse.data);

        // Fetch vulnerabilities/scan results
        const scanResponse = await axios.get(`${API_URL}/api/scan/results/${id}`);
        setVulnerabilities(scanResponse.data);
        if (scanResponse.data.length > 0) {
          setSelectedVulnerability(scanResponse.data[0]);
        }
      } catch (error) {
        console.error('Error fetching repository scan results:', error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchData();
  }, [id]);

  // Fetch full file content when vulnerability is selected
  useEffect(() => {
    if (selectedVulnerability && id && user) {
      const fetchFile = async () => {
        setFileContent(''); // Clear previous content
        try {
          const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
          const res = await axios.get(`${API_URL}/api/repository/${id}/file?filePath=${selectedVulnerability.fileName}&userId=${user._id || user.id}`);
          setFileContent(res.data.content);
        } catch(e) {
          console.error(e);
          setFileContent('// Failed to load full file content. The file might have been deleted or the repository is inaccessible.');
        }
      };
      fetchFile();
    }
  }, [selectedVulnerability, id, user]);

  const exportPDF = async () => {
    const element = document.getElementById('report-content');
    if (!element) return;
    
    setExportingPDF(true);
    try {
      const canvas = await html2canvas(element, { scale: 3, useCORS: true });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgScaledHeight = (canvas.height * pdfWidth) / canvas.width;
      
      let heightLeft = imgScaledHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgScaledHeight);
      heightLeft -= pdfHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgScaledHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgScaledHeight);
        heightLeft -= pdfHeight;
      }
      
      const safeName = (repoDetails?.repositoryName || 'security').replace(/[^a-zA-Z0-9-]/g, '_');
      pdf.save(`${safeName}_report.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setExportingPDF(false);
    }
  };

  const getSeverityStyles = (severity) => {
    switch (severity) {
      case 'Critical':
        return 'bg-red-500/10 text-red-400 border border-red-500/20';
      case 'High':
        return 'bg-orange-500/10 text-orange-400 border border-orange-500/20';
      case 'Medium':
        return 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20';
      default:
        return 'bg-zinc-500/10 text-zinc-400 border border-zinc-500/20';
    }
  };

  return (
    <MainLayout>
      <div className="space-y-8" id="report-content">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-dark-border pb-6 gap-4">
          <div>
            <div className="flex items-center space-x-3">
              <span className="text-zinc-500 font-mono text-sm">SCAN ID // {id}</span>
              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                vulnerabilities.length > 0 
                  ? 'bg-red-500/10 text-red-400 ring-1 ring-inset ring-red-500/20' 
                  : 'bg-emerald-500/10 text-emerald-400 ring-1 ring-inset ring-emerald-500/20'
              }`}>
                {vulnerabilities.length} {vulnerabilities.length === 1 ? 'Vulnerability' : 'Vulnerabilities'}
              </span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white mt-1 flex items-center space-x-3">
              {loading ? <Loader2 className="h-6 w-6 animate-spin text-indigo-500 mr-2" /> : ''}
              <span>{repoDetails?.repositoryName || 'Analyzing Repository...'}</span>
              {!loading && (
                <span className="inline-flex items-center text-[10px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded shadow-sm">
                  <Cpu className="h-3 w-3 mr-1" />
                  AI-Powered Security Insights
                </span>
              )}
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            {!loading && repoDetails?.securityScore !== undefined && (
              <div className="flex flex-col items-end">
                <span className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider mb-0.5">Security Score</span>
                <div className={`flex items-center justify-center px-3 py-1 rounded-md border ${
                  repoDetails.securityScore >= 80 ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                  repoDetails.securityScore >= 50 ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400' :
                  'bg-red-500/10 border-red-500/20 text-red-400'
                }`}>
                  <span className="text-lg font-bold">{repoDetails.securityScore}</span>
                  <span className="text-xs opacity-60 ml-1">/100</span>
                </div>
              </div>
            )}
            <button 
              onClick={exportPDF}
              disabled={exportingPDF}
              className="inline-flex items-center justify-center space-x-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 transition-all h-10 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {exportingPDF ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Terminal className="h-4 w-4" />
              )}
              <span>{exportingPDF ? 'Generating...' : 'Export PDF Report'}</span>
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
            <Loader2 className="h-10 w-10 animate-spin text-indigo-500" />
            <p className="text-zinc-400 text-sm">Loading security analysis results...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* List of vulnerabilities */}
            <div className="lg:col-span-1 space-y-4">
              <h3 className="text-lg font-semibold text-white mb-2 flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                <span>Detections</span>
              </h3>
              
              {vulnerabilities.length === 0 ? (
                <div className="rounded-xl border border-dark-border bg-dark-card p-8 text-center space-y-4">
                  <div className="inline-flex items-center justify-center p-3 rounded-full bg-emerald-500/15 text-emerald-400">
                    <ShieldCheck className="h-8 w-8" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-semibold text-white">Repository is Clean!</h4>
                    <p className="text-xs text-zinc-400">No static code vulnerabilities were found in this scan.</p>
                  </div>
                </div>
              ) : (
                <div className={`space-y-3 pr-1 ${exportingPDF ? '' : 'max-h-[600px] overflow-y-auto'}`}>
                  {vulnerabilities.map((v) => (
                    <div 
                      key={v._id || v.id} 
                      onClick={() => { 
                        setSelectedVulnerability(v); 
                        setShowSecureCode(false);
                        setViewMode('snippet');
                      }}
                      className={`p-4 rounded-xl border transition-all cursor-pointer space-y-3 ${
                        selectedVulnerability?._id === v._id
                          ? 'border-indigo-500 bg-indigo-600/5'
                          : 'border-dark-border bg-dark-card hover:border-zinc-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${getSeverityStyles(v.severity)}`}>
                          {v.severity}
                        </span>
                        <span className="text-xs text-zinc-500 font-mono">{v.cwe || 'CWE'}</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-white text-sm line-clamp-1">{v.issue}</h4>
                        <p className="text-xs text-zinc-500 font-mono mt-1 truncate">{v.fileName}:L{v.lineNumber}</p>
                      </div>
                      <div className="flex items-center justify-between text-xs pt-1 border-t border-dark-border text-zinc-500">
                        <span>Confidence: <strong className="text-zinc-300">{v.confidence}</strong></span>
                        {v.aiVerified && (
                          <span className="flex items-center text-indigo-400 space-x-1">
                            <Cpu className="h-3.5 w-3.5" />
                            <span>AI Verified</span>
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* How to Approach & Quick Tips */}
              <div className="mt-6 pt-6 border-t border-dark-border space-y-4">
                <div className="bg-indigo-900/20 border border-indigo-500/30 p-4 rounded-xl">
                  <h4 className="text-sm font-semibold text-indigo-300 flex items-center space-x-2 mb-2">
                    <Shield className="h-4 w-4" />
                    <span>How to Approach</span>
                  </h4>
                  <ul className="text-xs text-zinc-400 space-y-2 list-disc list-inside">
                    <li>Review <strong className="text-zinc-300">Critical</strong> issues first.</li>
                    <li>Check the <strong className="text-zinc-300">Mitigation Advice</strong> for suggested patches.</li>
                    <li>Verify the context in the <strong className="text-zinc-300">File Inspector</strong>.</li>
                    <li>Apply fixes and re-run the security scan.</li>
                  </ul>
                </div>
                
                <div className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-xl">
                  <h4 className="text-sm font-semibold text-white flex items-center space-x-2 mb-2">
                    <Lightbulb className="h-4 w-4 text-yellow-500" />
                    <span>Quick Security Tips</span>
                  </h4>
                  <p className="text-xs text-zinc-400 leading-relaxed mb-3">
                    Incorporate security early in your SDLC. Regular automated scans prevent vulnerabilities from reaching production.
                  </p>
                  <div className="text-[10px] uppercase font-bold tracking-wider text-zinc-500">
                    Did you know?
                  </div>
                  <p className="text-xs text-zinc-400 mt-1 italic">
                    "Shift-left" security can reduce patching costs by up to 80%.
                  </p>
                </div>
              </div>
            </div>

            {/* Detailed viewer block */}
            <div className="lg:col-span-2 space-y-6">
              {selectedVulnerability ? (
                <div className="rounded-xl border border-dark-border bg-dark-card p-6 min-h-[400px] flex flex-col justify-between">
                  
                  {/* Code editor title bar */}
                  <div className="flex justify-between items-center border-b border-dark-border pb-4 mb-4">
                    <div>
                      <h3 className="text-md font-semibold text-white flex items-center space-x-2">
                        <Code className="h-5 w-5 text-indigo-500" />
                        <span>File Inspector</span>
                      </h3>
                      <p className="text-xs text-zinc-500 font-mono mt-0.5">{selectedVulnerability.fileName}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="flex bg-zinc-900 rounded-lg p-1 border border-zinc-800">
                        <button 
                          onClick={() => setViewMode('snippet')}
                          className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${viewMode === 'snippet' ? 'bg-indigo-600 text-white shadow-sm' : 'text-zinc-400 hover:text-white'}`}
                        >
                          Snippet
                        </button>
                        <button 
                          onClick={() => setViewMode('full')}
                          className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${viewMode === 'full' ? 'bg-indigo-600 text-white shadow-sm' : 'text-zinc-400 hover:text-white'}`}
                        >
                          Full File
                        </button>
                      </div>
                      <span className="text-xs font-mono bg-zinc-800 px-2 py-1 rounded text-zinc-400 border border-zinc-700">
                        Line {selectedVulnerability.lineNumber}
                      </span>
                    </div>
                  </div>

                  {/* Editor screen */}
                  {viewMode === 'snippet' ? (
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                      {/* Left: Vulnerable */}
                      <div className={`flex-1 rounded bg-zinc-950 p-4 font-mono text-xs text-zinc-400 border border-zinc-900 min-h-[200px] ${exportingPDF ? 'whitespace-pre-wrap' : 'overflow-x-auto whitespace-pre'}`}>
                        <div className="flex items-center space-x-2 text-zinc-600 mb-3 border-b border-zinc-900 pb-2">
                          <div className="h-2 w-2 rounded-full bg-red-500"></div>
                          <span>Vulnerable Code Snippet</span>
                        </div>
                        <code className="block bg-red-500/10 text-red-300 border-l-2 border-l-red-500 pl-3 py-1">
                          {selectedVulnerability.vulnerableCode}
                        </code>
                      </div>

                      {/* Right: Secure */}
                      <div className={`flex-1 rounded bg-emerald-950/20 p-4 font-mono text-xs text-emerald-300 border border-emerald-900/50 min-h-[200px] ${exportingPDF ? 'whitespace-pre-wrap' : 'overflow-x-auto whitespace-pre'}`}>
                        <div className="flex items-center space-x-2 text-emerald-500/80 mb-3 border-b border-emerald-900/50 pb-2">
                          <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                          <span>Suggested Secure Patch</span>
                        </div>
                        <code className="block bg-emerald-500/10 text-emerald-300 border-l-2 border-l-emerald-500 pl-3 py-1">
                          {selectedVulnerability.secureCode}
                        </code>
                      </div>
                    </div>
                  ) : (
                    <div className={`mb-6 rounded bg-zinc-950 p-4 font-mono text-[11px] border border-zinc-900 w-full relative ${exportingPDF ? '' : 'max-h-[400px] overflow-y-auto'}`}>
                      {fileContent ? (
                        <div className="w-full">
                          {fileContent.split('\n').map((line, idx) => (
                            <div 
                              key={idx} 
                              className={`flex group ${idx + 1 === selectedVulnerability.lineNumber ? 'bg-red-500/20 border-l-2 border-red-500 text-red-100' : 'text-zinc-400 hover:bg-zinc-900/50 border-l-2 border-transparent'}`}
                              ref={idx + 1 === selectedVulnerability.lineNumber ? (el) => {
                                if (el && viewMode === 'full') {
                                  // Small delay to ensure the DOM is painted before scrolling
                                  setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
                                }
                              } : null}
                            >
                              <span className={`w-10 text-right pr-4 select-none border-r border-zinc-800 mr-4 shrink-0 ${idx + 1 === selectedVulnerability.lineNumber ? 'text-red-400 font-bold' : 'text-zinc-600 group-hover:text-zinc-400'}`}>
                                {idx + 1}
                              </span>
                              <span className="whitespace-pre text-wrap">{line || ' '}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-zinc-500 flex items-center justify-center p-12">
                           <Loader2 className="h-6 w-6 animate-spin mr-2 text-indigo-500"/> Fetching source code from GitHub...
                        </div>
                      )}
                    </div>
                  )}

                  {/* AI Details mitigation card */}
                  <div className="space-y-4 rounded-lg bg-zinc-900/40 p-4 border border-zinc-800">
                    <h4 className="text-sm font-semibold text-white flex items-center space-x-2">
                      <Cpu className="h-4 w-4 text-indigo-400" />
                      <span>Mitigation Advice</span>
                    </h4>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      {selectedVulnerability.description}
                    </p>
                    <p className="text-xs text-zinc-400 leading-relaxed mt-2 border-l border-zinc-700 pl-3 italic">
                      <strong>Remediation:</strong> {selectedVulnerability.recommendation}
                    </p>
                    <div className="flex justify-between items-center pt-3 border-t border-dark-border">
                      <span className="text-xs text-zinc-500 font-mono">
                        {selectedVulnerability.owasp} // {selectedVulnerability.cwe}
                      </span>
                    </div>
                  </div>

                  {/* Attack Simulation */}
                  {selectedVulnerability.exploitDemo?.input && (
                    <div className="mt-6 space-y-4 rounded-lg bg-red-950/20 p-4 border border-red-900/30 shadow-[0_0_15px_rgba(239,68,68,0.1)]">
                      <h4 className="text-sm font-semibold text-red-400 flex items-center space-x-2">
                        <Terminal className="h-4 w-4" />
                        <span>Attack Simulation</span>
                      </h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                        <div className="bg-zinc-950 rounded p-3 border border-red-900/50 relative overflow-hidden">
                          <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
                          <p className="text-[10px] text-zinc-500 uppercase font-semibold mb-1 ml-2">Possible Payload</p>
                          <code className="text-xs text-red-400 font-mono ml-2 block break-all">{selectedVulnerability.exploitDemo.input}</code>
                        </div>
                        <div className="bg-zinc-950 rounded p-3 border border-zinc-800">
                          <p className="text-[10px] text-zinc-500 uppercase font-semibold mb-1">Expected Result</p>
                          <code className="text-xs text-zinc-300 font-mono">{selectedVulnerability.exploitDemo.result}</code>
                        </div>
                      </div>
                      
                      <div className="bg-zinc-950 rounded p-3 border border-zinc-800 mt-2">
                        <p className="text-[10px] text-zinc-500 uppercase font-semibold mb-1">Why this works</p>
                        <p className="text-xs text-zinc-400">{selectedVulnerability.exploitDemo.reason}</p>
                      </div>
                    </div>
                  )}

                  {/* --- NEW CHARTS & CARDS SECTION --- */}
                  <div className="mt-6 pt-6 border-t border-dark-border grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Severity Chart */}
                    <div className="bg-dark-card rounded-lg p-4 border border-dark-border shadow-sm">
                      <h4 className="text-sm font-semibold text-white mb-4">Severity Breakdown</h4>
                      <div className="h-48 flex justify-center">
                        <Doughnut 
                          data={{
                            labels: ['Critical', 'High', 'Medium', 'Low'],
                            datasets: [{
                              data: [
                                vulnerabilities.filter(v => v.severity === 'Critical').length,
                                vulnerabilities.filter(v => v.severity === 'High').length,
                                vulnerabilities.filter(v => v.severity === 'Medium').length,
                                vulnerabilities.filter(v => v.severity === 'Low' || !v.severity).length,
                              ],
                              backgroundColor: [
                                'rgba(239, 68, 68, 0.8)',
                                'rgba(249, 115, 22, 0.8)',
                                'rgba(234, 179, 8, 0.8)',
                                'rgba(113, 113, 122, 0.8)'
                              ],
                              borderColor: [
                                'rgba(239, 68, 68, 1)',
                                'rgba(249, 115, 22, 1)',
                                'rgba(234, 179, 8, 1)',
                                'rgba(113, 113, 122, 1)'
                              ],
                              borderWidth: 1,
                            }]
                          }}
                          options={{ maintainAspectRatio: false, plugins: { legend: { position: 'right', labels: { color: '#a1a1aa', font: { size: 10 } } } } }}
                        />
                      </div>
                    </div>

                    {/* Risk Chart */}
                    <div className="bg-dark-card rounded-lg p-4 border border-dark-border shadow-sm">
                      <h4 className="text-sm font-semibold text-white mb-4">Risk Factors (Current Issue)</h4>
                      <div className="h-48 flex justify-center">
                        <Bar 
                          data={{
                            labels: ['Impact', 'Likelihood', 'Exploitability'],
                            datasets: [{
                              label: 'Score',
                              data: [
                                selectedVulnerability.severity === 'Critical' ? 95 : selectedVulnerability.severity === 'High' ? 80 : 50,
                                selectedVulnerability.confidence === 'High' ? 85 : 60,
                                selectedVulnerability.exploitDemo?.input ? 90 : 40
                              ],
                              backgroundColor: 'rgba(99, 102, 241, 0.7)',
                              borderColor: 'rgba(99, 102, 241, 1)',
                              borderWidth: 1,
                              borderRadius: 4,
                            }]
                          }}
                          options={{
                            maintainAspectRatio: false,
                            scales: {
                              y: { beginAtZero: true, max: 100, ticks: { color: '#71717a' }, grid: { color: '#27272a' } },
                              x: { ticks: { color: '#71717a' }, grid: { display: false } }
                            },
                            plugins: { legend: { display: false } }
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* More Info Cards */}
                  <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-zinc-900/50 p-4 rounded-lg border border-zinc-800 flex flex-col justify-between hover:border-indigo-500/50 transition-colors">
                      <div className="flex items-center space-x-2 text-zinc-400 mb-2">
                        <Activity className="h-4 w-4 text-emerald-400" />
                        <span className="text-xs font-medium">Auto-Remediation</span>
                      </div>
                      <span className="text-lg font-bold text-white">Available</span>
                    </div>
                    <div className="bg-zinc-900/50 p-4 rounded-lg border border-zinc-800 flex flex-col justify-between hover:border-indigo-500/50 transition-colors">
                      <div className="flex items-center space-x-2 text-zinc-400 mb-2">
                        <Shield className="h-4 w-4 text-indigo-400" />
                        <span className="text-xs font-medium">Compliance Check</span>
                      </div>
                      <span className="text-lg font-bold text-white">Passed</span>
                    </div>
                    <div className="bg-zinc-900/50 p-4 rounded-lg border border-zinc-800 flex flex-col justify-between hover:border-indigo-500/50 transition-colors">
                      <div className="flex items-center space-x-2 text-zinc-400 mb-2">
                        <TrendingUp className="h-4 w-4 text-rose-400" />
                        <span className="text-xs font-medium">Risk Trend</span>
                      </div>
                      <span className="text-lg font-bold text-white">+12%</span>
                    </div>
                    <div className="bg-zinc-900/50 p-4 rounded-lg border border-zinc-800 flex flex-col justify-between hover:border-indigo-500/50 transition-colors">
                      <div className="flex items-center space-x-2 text-zinc-400 mb-2">
                        <CheckCircle className="h-4 w-4 text-blue-400" />
                        <span className="text-xs font-medium">Review Status</span>
                      </div>
                      <span className="text-lg font-bold text-white">Pending</span>
                    </div>
                  </div>

                  {/* Actionable Ideas Cards */}
                  <div className="mt-8 border-t border-dark-border pt-6">
                    <h4 className="text-sm font-semibold text-white flex items-center space-x-2 mb-4">
                      <Lightbulb className="h-4 w-4 text-yellow-500" />
                      <span>Actionable Ideas & Next Steps</span>
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-zinc-900/30 p-4 rounded-lg border border-zinc-800 hover:border-zinc-700 transition-colors flex space-x-4">
                        <div className="bg-indigo-500/10 p-2 rounded text-indigo-400 h-fit">
                          <Wrench className="h-5 w-5" />
                        </div>
                        <div>
                          <h5 className="text-sm font-semibold text-white">Automate Dependency Updates</h5>
                          <p className="text-xs text-zinc-400 mt-1">Configure Dependabot or Renovate to automatically create PRs for vulnerable dependencies.</p>
                        </div>
                      </div>
                      
                      <div className="bg-zinc-900/30 p-4 rounded-lg border border-zinc-800 hover:border-zinc-700 transition-colors flex space-x-4">
                        <div className="bg-emerald-500/10 p-2 rounded text-emerald-400 h-fit">
                          <GitMerge className="h-5 w-5" />
                        </div>
                        <div>
                          <h5 className="text-sm font-semibold text-white">Enforce Strict Code Reviews</h5>
                          <p className="text-xs text-zinc-400 mt-1">Require at least two approvals and a passing security scan before merging to main.</p>
                        </div>
                      </div>
                      
                      <div className="bg-zinc-900/30 p-4 rounded-lg border border-zinc-800 hover:border-zinc-700 transition-colors flex space-x-4">
                        <div className="bg-rose-500/10 p-2 rounded text-rose-400 h-fit">
                          <Terminal className="h-5 w-5" />
                        </div>
                        <div>
                          <h5 className="text-sm font-semibold text-white">Integrate SAST in CI/CD</h5>
                          <p className="text-xs text-zinc-400 mt-1">Add a GitHub Action or GitLab CI job to run static code analysis on every push.</p>
                        </div>
                      </div>

                      <div className="bg-zinc-900/30 p-4 rounded-lg border border-zinc-800 hover:border-zinc-700 transition-colors flex space-x-4">
                        <div className="bg-amber-500/10 p-2 rounded text-amber-400 h-fit">
                          <BookOpen className="h-5 w-5" />
                        </div>
                        <div>
                          <h5 className="text-sm font-semibold text-white">Developer Security Training</h5>
                          <p className="text-xs text-zinc-400 mt-1">Assign relevant OWASP training modules based on the most frequent vulnerabilities found.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              ) : (
                <div className="rounded-xl border border-dark-border bg-dark-card p-6 min-h-[400px] flex items-center justify-center text-center">
                  {vulnerabilities.length === 0 ? (
                    <div className="space-y-4">
                      <ShieldCheck className="h-12 w-12 text-emerald-500 mx-auto opacity-50" />
                      <p className="text-zinc-400 text-sm">No vulnerabilities to inspect. Great job!</p>
                    </div>
                  ) : (
                    <p className="text-zinc-500 text-sm">Select a detection card on the left to inspect vulnerability details.</p>
                  )}
                </div>
              )}
            </div>

          </div>
        )}

      </div>
    </MainLayout>
  );
};

export default ScanResults;
