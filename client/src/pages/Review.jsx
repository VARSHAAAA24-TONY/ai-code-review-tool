import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Layout as GithubIcon, 
  Zap, 
  AlertCircle, 
  Copy, 
  Download,
  Bug, 
  Sparkles, 
  Terminal, 
  Activity, 
  Database, 
  FileText, 
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Upload
} from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { githubService } from '../services/githubService';
import DiffView from '../components/common/DiffView';
import { auth, db } from '../lib/firebase';
import { collection, addDoc, doc, getDoc } from 'firebase/firestore';
import { toast } from 'react-hot-toast';

const Review = () => {
  const [inputMode, setInputMode] = useState('paste');
  const [content, setContent] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [logs, setLogs] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();

  React.useEffect(() => {
    if (id) {
      const fetchArchivedAudit = async () => {
        const fetchingToast = toast.loading('Reconstructing archived audit logic...');
        setAnalyzing(true);
        try {
          const docRef = doc(db, 'audit_history', id);
          const docSnap = await getDoc(docRef);
          if (!docSnap.exists()) throw new Error('Audit not found in archive.');
          const data = docSnap.data();
          setContent(data.code_input);
          setGithubUrl(data.repo_url !== 'Direct Input' ? data.repo_url : '');
          setInputMode(data.repo_url !== 'Direct Input' ? 'github' : 'paste');
          setResult({ ...data.analysis_result, raw_code: data.code_input });
          toast.success('Archived telemetry restored successfully.', { id: fetchingToast });
        } catch (err) {
          toast.error(`Archive Recovery Failed: ${err.message}`, { id: fetchingToast });
          navigate('/review', { replace: true });
        } finally {
          setAnalyzing(false);
        }
      };

      fetchArchivedAudit();
    } else {
      // Reset if navigating from /review/:id back to /review
      setResult(null);
      setContent('');
      setGithubUrl('');
    }
  }, [id, navigate]);

  const addLog = (msg) => {
    setLogs(prev => [...prev.slice(-4), msg]);
  };

  const handleAnalyze = async () => {
    if (inputMode === 'paste' && !content) return toast.error('Please provide source code to analyze.');
    if (inputMode === 'github' && !githubUrl) return toast.error('Please provide a GitHub repository URL.');
    if (inputMode === 'upload' && !content) return toast.error('Please upload a valid code file first.');

    setAnalyzing(true);
    setError('');
    const fetchingToast = toast.loading('Initializing audit sequence...');
    setLogs(['Initializing audit sequence...']);
    
    try {
      let codeToAnalyze = content;

      if (inputMode === 'github') {
        addLog('Connecting to GitHub API...');
        const fullCode = await githubService.fetchFullRepoCode(githubUrl);
        codeToAnalyze = fullCode;
        addLog('Source ingestion complete.');
      }

      toast.loading('Dispatching to Analysis Core...', { id: fetchingToast });
      addLog('Dispatching to Analysis Core...');
      const response = await axios.post('/api/analyze', { 
        code: codeToAnalyze,
        language: 'javascript'
      });
      
      const analysisData = response.data;
      toast.success('Analysis stream stabilized.', { id: fetchingToast });
      addLog('Analysis stream stabilized.');

      // Audit data is saved via saveAudit() which fires on manual save button click.
      
      setResult({ ...analysisData, raw_code: codeToAnalyze }); // Cache code for database injection
      setAnalyzing(false);
    } catch (err) {
      console.error('Analysis failed:', err);
      
      let errorMsg = 'The analysis engine encountered a critical error.';
      const serverMsg = err.response?.data?.error || err.message;

      if (serverMsg.includes('ERR_QUOTA_EXCEEDED')) {
        errorMsg = 'Daily AI quota limits reached (429). Please change your GROQ_API_KEY in the server/.env file.';
      } else if (serverMsg.includes('ERR_MODEL_RETIRED')) {
        errorMsg = 'The current AI model has been retired by the provider. Swapping to secondary core...';
      } else if (err.code === 'ERR_NETWORK') {
        errorMsg = 'Server uplink lost. please ensure the backend is running on port 5000.';
      }
      
      toast.error(errorMsg, { id: fetchingToast });
      setError(errorMsg);
      setAnalyzing(false);
    }
  };

  const saveAudit = async (analysisResult, codeInput, currentUser) => {
    try {
      const savingToast = toast.loading('Synchronizing with Database...');
      await addDoc(collection(db, 'audit_history'), {
        user_id: currentUser.uid,
        code_input: codeInput,
        repo_url: inputMode === 'github' ? githubUrl : 'Direct Input',
        analysis_result: analysisResult,
        score: analysisResult.score,
        created_at: new Date().toISOString()
      });
      toast.success('Audit successfully persisted to ledger!', { id: savingToast });
      return true;
    } catch (err) {
      console.error('Database Sync Error:', err);
      toast.error(`Sync Failure: ${err.message || 'Unknown database exception'}`);
      return false;
    }
  };

  const handleManualSave = async () => {
    if (!result) return;
    const currentUser = auth.currentUser;
    if (!currentUser) {
      toast.error('Authentication required to save audits.');
      return;
    }
    await saveAudit(result, result.raw_code || content, currentUser);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileReader = new FileReader();
    fileReader.onload = (event) => {
      setContent(event.target.result);
      toast.success(`${file.name} securely ingested.`);
    };
    fileReader.readAsText(file);
  };

  const handleExport = () => {
    if (!result) return;
    const markdown = `# Architecture Audit Report - ${new Date().toLocaleDateString()}
## Quality Score: ${result.score}/10

### Executive Summary
${result.documentation}

### Bug Report (Identified Issues)
${result.bugs.map(bug => `- [${bug.severity.toUpperCase()}] Line ${bug.line}: ${bug.message}`).join('\n')}

### Optimization Suggestions
${result.improvements.map(imp => `#### ${imp.title}\n\n**Proposed Refactor:**\nLine comparison details included in dashboard.`).join('\n\n')}

---
Generated by CodeAudit AI
`;
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-report-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getSeverityColor = (sev) => {
    switch (sev.toLowerCase()) {
      case 'high': return 'text-[#00FFCC] bg-[#00FFCC]/10 border-[#00FFCC]/20 shadow-[0_0_15px_rgba(0,255,204,0.1)]';
      case 'medium': return 'text-[#12B886] bg-[#12B886]/10 border-[#12B886]/20';
      default: return 'text-[#B0B8B9] bg-[#B0B8B9]/5 border-[#B0B8B9]/10';
    }
  };

  return (
    <div className="space-y-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-8 border-b border-[#12B886]/10">
        <div className="space-y-3">
          <div className="flex items-center gap-2.5 px-3 py-1 rounded-full bg-[#00FFCC]/10 border border-[#00FFCC]/20 w-fit">
            <div className="w-2 h-2 rounded-full bg-[#00FFCC] animate-pulse shadow-[0_0_10px_#00FFCC]"></div>
            <span className="text-[10px] font-bold text-[#00FFCC] uppercase tracking-[3px]">Protocol_Active</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white mb-1">Forensic_Workspace</h1>
          <p className="text-[#B0B8B9] font-medium tracking-wide opacity-60">High-fidelity architectural auditing and logic containment.</p>
        </div>

        <div className="flex p-1.5 bg-[#1A1D1E]/60 backdrop-blur-xl border border-[#12B886]/20 rounded-2xl">
          <button 
            onClick={() => { setInputMode('paste'); setResult(null); }}
            className={`px-8 py-3 text-[11px] font-bold transition-all uppercase tracking-[2px] rounded-xl ${inputMode === 'paste' ? 'bg-[#00FFCC] text-[#1A1D1E] shadow-[0_0_20px_rgba(0,255,204,0.2)]' : 'text-[#B0B8B9] hover:text-[#00FFCC]'}`}
          >
            Direct_Input
          </button>
          <button 
            onClick={() => { setInputMode('github'); setResult(null); }}
            className={`px-8 py-3 text-[11px] font-bold transition-all uppercase tracking-[2px] rounded-xl ${inputMode === 'github' ? 'bg-[#00FFCC] text-[#1A1D1E] shadow-[0_0_20px_rgba(0,255,204,0.2)]' : 'text-[#B0B8B9] hover:text-[#00FFCC]'}`}
          >
            GitHub_Uplink
          </button>
          <button 
            onClick={() => { setInputMode('upload'); setResult(null); }}
            className={`px-8 py-3 text-[11px] font-bold transition-all uppercase tracking-[2px] rounded-xl ${inputMode === 'upload' ? 'bg-[#00FFCC] text-[#1A1D1E] shadow-[0_0_20px_rgba(0,255,204,0.2)]' : 'text-[#B0B8B9] hover:text-[#00FFCC]'}`}
          >
            File_Ingest
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-12">
        {/* Input Card */}
        <div className="modern-card p-0 bg-[#1A1D1E]/40 backdrop-blur-3xl border border-[#12B886]/20 rounded-[32px] overflow-hidden shadow-2xl relative group">
          <div className="p-6 bg-[#1A1D1E]/60 border-b border-[#12B886]/10 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2.5 bg-[#00FFCC]/10 rounded-xl text-[#00FFCC] border border-[#00FFCC]/20 shadow-lg">
                {inputMode === 'paste' ? <FileText size={18} /> : inputMode === 'upload' ? <Upload size={18} /> : <GithubIcon size={18} />}
              </div>
              <span className="text-[11px] font-bold text-white uppercase tracking-[4px]">
                {inputMode === 'paste' ? 'TELEMETRY_BUFFER' : inputMode === 'upload' ? 'DROPZONE_UPLINK' : 'REMOTE_INGESTION'}
              </span>
            </div>
            <div className="flex gap-2 opacity-30">
              <div className="w-1.5 h-1.5 rounded-full bg-[#12B886]"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-[#12B886]"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-[#00FFCC] shadow-[0_0_8px_#00FFCC]"></div>
            </div>
          </div>
          
          <div className="min-h-[400px] relative">
            {analyzing && <div className="absolute inset-0 z-20 pointer-events-none bg-gradient-to-b from-[#00FFCC]/5 to-transparent animate-pulse opacity-40"></div>}
            {inputMode === 'paste' ? (
              <textarea 
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="> INJECT SOURCE CODE FOR ARCHITECTURAL FORENSICS..."
                className="w-full h-full min-h-[400px] bg-transparent border-none outline-none p-10 text-[#00FFCC] font-mono text-sm resize-none placeholder:text-[#12B886]/30 focus:ring-0 leading-relaxed"
                spellCheck="false"
              />
            ) : inputMode === 'upload' ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-12 space-y-10">
                <div className="relative w-full max-w-2xl">
                   <input
                     type="file"
                     accept=".js,.py,.java,.cpp,.txt,.ts,.tsx,.jsx"
                     onChange={handleFileUpload}
                     className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                   />
                   <div className="w-full bg-[#1A1D1E]/40 border-2 border-dashed border-[#12B886]/20 rounded-[32px] p-20 flex flex-col items-center justify-center text-center group-hover:border-[#00FFCC]/50 transition-all duration-700 shadow-2xl">
                     <div className="w-24 h-24 bg-[#00FFCC]/5 border border-[#00FFCC]/10 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-[#00FFCC]/10 transition-all duration-700 shadow-xl">
                       <Upload size={40} className="text-[#00FFCC]" />
                     </div>
                     <h3 className="text-xl font-bold text-white mb-3 uppercase tracking-tight">System_File_Drop</h3>
                     <p className="text-[11px] text-[#B0B8B9] font-bold uppercase tracking-[4px] opacity-40">Directly ingest archive packets</p>
                   </div>
                </div>
                {content && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[11px] text-[#00FFCC] font-bold uppercase tracking-[4px] flex items-center gap-3 bg-[#00FFCC]/5 px-6 py-2 rounded-full border border-[#00FFCC]/20">
                    <CheckCircle2 size={16} /> Buffer_Staged_Ready
                  </motion.div>
                )}
              </div>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-12 space-y-10">
                <div className="w-24 h-24 bg-[#1A1D1E] border border-[#00FFCC]/20 rounded-3xl flex items-center justify-center text-[#00FFCC] shadow-[0_0_30px_rgba(0,255,204,0.1)] group transition-all duration-700">
                  <GithubIcon size={48} strokeWidth={1} />
                </div>
                <div className="w-full max-w-2xl relative">
                  <div className="absolute left-6 top-1/2 -translate-y-1/2 text-[#12B886] font-bold text-[11px] uppercase tracking-[3px] border-r border-[#12B886]/20 pr-6">GITHUB.COM /</div>
                  <input 
                    type="text" 
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    placeholder="USERNAME / REPOSITORY"
                    className="w-full bg-[#1A1D1E]/60 border border-[#12B886]/20 rounded-2xl pl-44 pr-6 py-5 text-sm font-bold text-[#00FFCC] focus:ring-2 focus:ring-[#00FFCC]/20 focus:border-[#00FFCC]/50 transition-all placeholder:text-[#12B886]/20 uppercase tracking-[2px]"
                  />
                </div>
                <p className="text-[11px] text-[#B0B8B9] font-bold uppercase tracking-[5px] opacity-40">Establishing secure uplink...</p>
              </div>
            )}
          </div>

          <div className="p-8 bg-[#1A1D1E]/80 backdrop-blur-2xl border-t border-[#12B886]/10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex gap-10 order-2 md:order-1">
              <div className="flex items-center gap-3">
                <ShieldCheck size={16} className="text-[#00FFCC]" />
                <span className="text-[11px] font-bold text-[#B0B8B9] uppercase tracking-[3px] opacity-60">Integrity_Verification</span>
              </div>
              {analyzing && (
                <div className="flex items-center gap-4">
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-[#00FFCC] animate-pulse"></div>
                    <div className="w-2 h-2 rounded-full bg-[#00FFCC]/50 animate-pulse delay-75"></div>
                    <div className="w-2 h-2 rounded-full bg-[#00FFCC]/20 animate-pulse delay-150"></div>
                  </div>
                  <span className="text-[11px] font-bold text-[#00FFCC] uppercase tracking-[4px] opacity-80">Scanning_Logic...</span>
                </div>
              )}
            </div>

            <button 
              onClick={handleAnalyze}
              disabled={analyzing}
              className={`btn-modern btn-primary px-16 py-5 rounded-2xl order-1 md:order-2 w-full md:w-auto shadow-[0_0_30px_rgba(0,255,204,0.2)] ${analyzing ? 'opacity-50 pointer-events-none' : ''}`}
            >
              <Zap size={20} className={analyzing ? 'animate-pulse' : ''} />
              <span className="uppercase tracking-[4px] font-bold text-xs">{analyzing ? 'COMPUTING...' : 'INITIATE_AUDIT'}</span>
            </button>
          </div>
        </div>
        
        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-6 rounded-[24px] bg-red-500/10 border border-red-500/20 flex items-center gap-5 text-red-400 shadow-2xl"
            >
              <AlertCircle size={24} />
              <p className="text-sm font-bold tracking-tight">{error}</p>
            </motion.div>
          )}

          {analyzing && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-8 rounded-[32px] bg-[#1A1D1E]/40 backdrop-blur-2xl border border-[#00FFCC]/20 space-y-6"
            >
              <div className="flex items-center justify-between border-b border-[#00FFCC]/10 pb-4">
                 <span className="text-[11px] font-bold text-[#00FFCC] uppercase tracking-[4px] flex items-center gap-3">
                   <Terminal size={14} /> LIVE_TELEMETRY_LOG
                 </span>
                 <span className="text-[10px] font-bold text-[#12B886] opacity-60">CORE_v4.2_STABLE</span>
              </div>
              <div className="space-y-3 font-mono">
                {logs.map((log, i) => (
                  <div key={i} className={`text-[11px] font-bold uppercase tracking-wider flex items-center gap-4 ${i === logs.length - 1 ? 'text-[#00FFCC]' : 'text-[#12B886] opacity-40'}`}>
                    <span className="opacity-30">[{i}]</span> {log}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Dashboard */}
        {result && (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-16"
          >
            {/* Summary Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="modern-card flex flex-col items-center justify-center p-12 bg-[#1A1D1E]/40 backdrop-blur-3xl border border-[#00FFCC]/20 rounded-[40px] text-center shadow-2xl relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-[#00FFCC]/5 blur-3xl rounded-full"></div>
                 <div className="relative w-48 h-48 mb-8">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="10" fill="transparent" className="text-[#12B886]/10" />
                    <motion.circle 
                      initial={{ strokeDashoffset: 553 }}
                      animate={{ strokeDashoffset: 553 - (553 * result.score) / 10 }}
                      transition={{ duration: 2, ease: "easeOut" }}
                      cx="96" 
                      cy="96" 
                      r="88" 
                      stroke="currentColor" 
                      strokeWidth="10" 
                      fill="transparent" 
                      strokeDasharray="553" 
                      strokeLinecap="round"
                      className="text-[#00FFCC] drop-shadow-[0_0_12px_rgba(0,255,204,0.5)]"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-7xl font-extrabold text-white tracking-tighter tabular-nums font-mono">{result.score}</span>
                    <span className="text-[11px] font-bold text-[#12B886] uppercase tracking-[4px] mt-2 opacity-60">Score_Index</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xs font-bold text-white uppercase tracking-[4px]">Stability_Check</h3>
                  <p className="text-[10px] text-[#B0B8B9] uppercase font-bold tracking-[2px] opacity-40">Forensic data cross-verified.</p>
                </div>
              </div>

              <div className="lg:col-span-2 modern-card p-12 flex flex-col justify-between bg-[#1A1D1E]/40 backdrop-blur-3xl border border-[#12B886]/10 rounded-[40px] shadow-2xl overflow-hidden relative">
                 <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#12B886]/5 blur-3xl rounded-full"></div>
                <div className="space-y-8 relative z-10">
                  <div className="flex items-center gap-4 text-[#00FFCC]">
                    <Sparkles size={24} />
                    <h3 className="text-xs font-bold uppercase tracking-[5px]">Executive_Summary</h3>
                  </div>
                  <div className="relative p-10 border border-[#12B886]/10 bg-white/[0.02] rounded-3xl">
                    <div className="absolute -top-3 left-8 px-4 py-1 bg-[#1A1D1E] border border-[#12B886]/20 rounded-full text-[9px] font-bold text-[#00FFCC] uppercase tracking-[3px]">UPLINK_REPORT_v4.2</div>
                    <p className="text-[15px] text-[#B0B8B9] leading-relaxed font-medium">
                      {result.documentation}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-6 mt-12 relative z-10">
                  <button onClick={handleExport} className="flex-1 btn-modern bg-[#00FFCC]/5 border-[#00FFCC]/20 border rounded-2xl text-[#00FFCC] hover:bg-[#00FFCC]/10 py-4 gap-3 font-bold transition-all">
                    <Download size={18} />
                    <span className="tracking-widest uppercase text-[11px]">Download Report</span>
                  </button>
                  <button onClick={() => navigator.clipboard.writeText(JSON.stringify(result))} className="flex-1 btn-modern bg-[#12B886]/5 border-[#12B886]/20 border rounded-2xl text-[#12B886] hover:bg-[#12B886]/10 py-4 gap-3 font-bold transition-all">
                    <Copy size={18} />
                    <span className="tracking-widest uppercase text-[11px]">Copy Telemetry</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Identified Issues */}
            <div className="space-y-10">
              <div className="flex items-center justify-between border-b border-[#12B886]/10 pb-8">
                <div className="flex items-center gap-4">
                  <AlertTriangle className="text-[#00FFCC]" size={28} />
                  <h2 className="text-3xl font-extrabold tracking-tight text-white uppercase">Critical_Detections</h2>
                </div>
                <div className="flex items-center gap-3 px-5 py-2 bg-[#00FFCC]/5 border border-[#00FFCC]/20 rounded-full shadow-xl">
                   <Activity className="text-[#00FFCC] animate-pulse" size={14} />
                   <span className="text-[11px] font-bold text-[#00FFCC] uppercase tracking-widest">
                    {result.bugs.length} Failures Detected
                   </span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {result.bugs.map((bug, i) => (
                  <div key={i} className="modern-card flex items-start gap-6 bg-[#1A1D1E]/40 backdrop-blur-xl border border-[#12B886]/20 hover:border-[#00FFCC]/50 rounded-3xl transition-all duration-500 p-8 group shadow-xl">
                    <div className={`mt-1 p-4 rounded-2xl ${getSeverityColor(bug.severity)}`}>
                      <Bug size={24} strokeWidth={1.5} />
                    </div>
                    <div className="flex-1 space-y-4">
                      <div className="flex items-center justify-between border-b border-[#12B886]/10 pb-3">
                        <span className="text-[10px] font-bold text-[#12B886] uppercase flex items-center gap-2 tracking-[2px] opacity-60">
                          <Terminal size={12} /> SCAN_ADR_LN_{bug.line}
                        </span>
                        <span className={`text-[9px] font-bold uppercase tracking-[2px] px-3 py-1 rounded-md ${getSeverityColor(bug.severity)}`}>
                          {bug.severity}_RISK
                        </span>
                      </div>
                      <p className="text-[14px] text-white font-bold leading-relaxed group-hover:text-[#00FFCC] transition-colors tracking-tight">
                        {bug.message}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Optimization Schematics */}
            <div className="space-y-10">
               <div className="flex items-center gap-4 border-b border-[#12B886]/10 pb-8">
                <Zap className="text-[#00FFCC]" size={28} />
                <h2 className="text-3xl font-extrabold tracking-tight text-white uppercase">Refactoring_Schematics</h2>
              </div>
              
              <div className="space-y-16">
                {result.improvements.map((imp, i) => (
                  <div key={i} className="space-y-6">
                    <div className="flex items-center gap-5">
                      <div className="text-sm font-extrabold bg-[#00FFCC] text-[#1A1D1E] w-12 h-12 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(0,255,204,0.3)] font-mono">{i+1}</div>
                      <h4 className="text-xl font-bold text-white tracking-wide uppercase">{imp.title.replace(/ /g, '_')}</h4>
                    </div>
                    <div className="modern-card p-0 bg-[#1A1D1E]/60 backdrop-blur-3xl border border-[#12B886]/20 rounded-[40px] overflow-hidden shadow-2xl relative transition-all duration-700 hover:border-[#00FFCC]/30">
                      <DiffView before={imp.before} after={imp.after} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Final Call to Action */}
            <div className="p-16 bg-gradient-to-br from-[#12B886]/5 to-[#00FFCC]/10 backdrop-blur-3xl border border-[#00FFCC]/20 rounded-[48px] flex flex-col items-center text-center space-y-10 shadow-[0_0_50px_rgba(0,255,204,0.1)] relative overflow-hidden group">
               <div className="absolute -top-24 -left-24 w-64 h-64 bg-[#00FFCC]/5 blur-[100px] rounded-full pointer-events-none"></div>
               <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-[#12B886]/5 blur-[100px] rounded-full pointer-events-none"></div>
               
               <div className="w-24 h-24 bg-[#1A1D1E] border border-[#00FFCC]/30 rounded-[32px] text-[#00FFCC] flex items-center justify-center relative z-10 shadow-2xl group-hover:scale-110 transition-transform duration-700">
                 <CheckCircle2 size={48} strokeWidth={1} />
               </div>
               <div className="space-y-5 relative z-10">
                 <h2 className="text-4xl font-extrabold tracking-tight text-white uppercase italic">Audit_Finalized</h2>
                 <p className="text-[#B0B8B9] font-bold max-w-lg mx-auto text-sm uppercase leading-relaxed tracking-[4px] opacity-60">
                   Containment Successful. High-fidelity logic stabilization achieved. System ready for deployment.
                 </p>
               </div>
               <div className="flex flex-col sm:flex-row gap-8 mt-12 relative z-10 w-full max-w-xl">
                 {!id && (
                   <button onClick={handleManualSave} className="flex-1 btn-modern px-10 py-5 bg-[#00FFCC] text-[#1A1D1E] rounded-2xl text-[11px] font-extrabold hover:scale-105 transition-all flex items-center justify-center gap-4 shadow-[0_0_30px_rgba(0,255,204,0.3)] border-none uppercase tracking-widest">
                     <Database size={20} /> Archive Forensics
                   </button>
                 )}
                 <Link to="/history" className="flex-1 btn-modern px-10 py-5 bg-[#1A1D1E]/80 text-[#00FFCC] border-2 border-[#00FFCC]/20 rounded-2xl text-[11px] font-extrabold hover:bg-[#00FFCC]/5 transition-all flex items-center justify-center gap-4 uppercase tracking-widest">
                   History Vault <ArrowRight size={20} />
                 </Link>
               </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Review;



