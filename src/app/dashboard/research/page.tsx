"use client";

import { useState, useEffect } from "react";
import { 
  Search, 
  Sparkles, 
  ArrowRight, 
  Briefcase, 
  FileSearch, 
  Database,
  ExternalLink,
  ChevronDown,
  MapPin,
  Building2,
  Calendar,
  Save,
  CheckCircle2,
  Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";

const PROGRESS_STEPS = [
  "INITIALIZING NEURAL SEARCH...",
  "SCANNING RECRUITMENT GRIDS...",
  "PROBING NAUKRI & LINKEDIN...",
  "EXTRACTING ROLE INTELLIGENCE...",
  "GENERATING INTEL REPORT..."
];

export default function JobSearchPage() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState("");
  const [sources, setSources] = useState<any[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [savedNoteId, setSavedNoteId] = useState<string | null>(null);

  useEffect(() => {
    let interval: any;
    if (loading) {
      interval = setInterval(() => {
        setCurrentStep((prev) => (prev < PROGRESS_STEPS.length - 1 ? prev + 1 : prev));
      }, 1500);
    } else {
      setCurrentStep(0);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleSearch = async () => {
    if (!query) return;
    setLoading(true);
    setAnswer("");
    setSources([]);
    setIsStreaming(false);
    setError(null);

    try {
      const response = await fetch("/api/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Recruitment sync failed.");
      }

      // Extract Sources from Headers (Base64 Decoded to handle non-ASCII)
      const sourcesHeader = response.headers.get("X-Sources-JSON");
      if (sourcesHeader) {
        try {
          const decodedSources = JSON.parse(atob(sourcesHeader));
          setSources(decodedSources);
        } catch (e) {
          console.error("Source Decoding Error:", e);
        }
      }

      const reader = response.body?.getReader();
      const textDecoder = new TextDecoder();
      
      setLoading(false);
      setIsStreaming(true);

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = textDecoder.decode(value, { stream: true });
          setAnswer((prev) => prev + chunk);
        }
      }
      
      setIsStreaming(false);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
      setIsStreaming(false);
    }
  };

  const handleSaveToNotes = async (job: any) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;

      const newNote = {
        user_id: session.user.id,
        title: `JOB INTEL: ${job.title.toUpperCase()}`,
        content: { 
          type: "doc", 
          content: [
            { type: "paragraph", content: [{ type: "text", text: `Role: ${job.title}` }] },
            { type: "paragraph", content: [{ type: "text", text: `Apply: ${job.url}` }] }
          ] 
        },
      };

      await supabase.from("notes").insert([newNote]);
      setSavedNoteId(job.url);
      setTimeout(() => setSavedNoteId(null), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      <header className="flex flex-col items-center">
        <div className="w-12 h-1 bg-accent rounded-full mb-8 shadow-[0_0_15px_rgba(204,255,0,0.5)]" />
        <h1 className="text-5xl font-black tracking-tighter holographic-text italic text-center leading-tight uppercase">
          STRATEGIC CAREER INTEL
        </h1>
        <p className="text-foreground/40 mt-4 font-bold tracking-[0.5em] uppercase text-[10px] mono-data text-center">
          // DUAL-INTELLIGENCE: ROADMAPS + GLOBAL JOB VECTORS
        </p>
      </header>

      {/* Input Section */}
      <div className="max-w-3xl mx-auto w-full relative">
        <div className="absolute inset-0 bg-accent/5 blur-[60px] rounded-full pointer-events-none" />
        <div className="relative glass-card p-2 border-white/5 bg-[#0A0F1C]/40">
           <div className="flex items-center px-4 space-x-4">
              <Search className="w-5 h-5 text-foreground/20" />
              <input 
                type="text" 
                placeholder="PROBE ROLES (E.G. 'REACT DEVELOPER')..."
                className="flex-1 bg-transparent border-none py-6 text-sm font-bold tracking-widest focus:outline-none placeholder:text-foreground/10 mono-data uppercase"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <button 
                onClick={handleSearch}
                disabled={loading || isStreaming || !query}
                className="bg-accent text-background px-8 py-4 rounded-xl font-black text-xs uppercase tracking-[0.2em] hover:bg-opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center space-x-2">
                   {loading ? "INITIALIZING..." : "SCAN"}
                   {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                </span>
                <motion.div 
                  className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-0 transition-transform duration-500" 
                />
              </button>
           </div>
        </div>
      </div>

      {/* Results Section */}
      <AnimatePresence mode="wait">
        {loading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            key="loading"
            className="flex flex-col items-center justify-center py-20 space-y-12"
          >
             <div className="relative w-32 h-32">
                <motion.div 
                  animate={{ rotate: 360, borderRadius: ["40%", "50%", "40%"] }}
                  transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                  className="absolute inset-0 border-2 border-accent/20 border-t-accent shadow-[0_0_20px_rgba(204,255,0,0.2)]"
                />
                <div className="absolute inset-6 flex items-center justify-center">
                   <Briefcase className="w-10 h-10 text-accent animate-pulse" />
                </div>
             </div>
             
             <div className="flex flex-col items-center space-y-4">
                <div className="flex space-x-2 items-center text-accent">
                  <div className="w-1.5 h-1.5 bg-accent rounded-full animate-ping" />
                  <span className="text-xs font-bold uppercase tracking-[0.6em]">
                    {PROGRESS_STEPS[currentStep]}
                  </span>
                </div>
                <div className="w-64 h-1 bg-white/5 rounded-full overflow-hidden">
                   <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(currentStep + 1) * 20}%` }}
                    className="h-full bg-accent shadow-[0_0_10px_rgba(204,255,0,0.5)]"
                   />
                </div>
             </div>
          </motion.div>
        )}

        {(answer || isStreaming || sources.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            key="results"
            className="grid grid-cols-1 lg:grid-cols-12 gap-8"
          >
            {/* Intel Report Column */}
            <div className="lg:col-span-8 space-y-6">
               <div className="glass-card p-1">
                  <div className="bg-[#0A0F1C]/90 backdrop-blur-3xl rounded-2xl p-6 lg:p-10 border border-white/5">
                     <div className="flex items-center space-x-3 mb-10 text-accent">
                        {isStreaming ? (
                           <div className="flex space-x-1">
                              {[...Array(3)].map((_, i) => (
                                <div key={i} className="w-1 h-1 bg-accent rounded-full animate-bounce" style={{ animationDelay: `${i * 0.1}s` }} />
                              ))}
                           </div>
                        ) : (
                           <FileSearch className="w-6 h-6" />
                        )}
                        <h2 className="text-xs font-bold uppercase tracking-[0.4em] text-foreground/40 italic">
                           {isStreaming ? "Decoding Intel" : "Strategic Roadmap & Opportunities"}
                        </h2>
                     </div>
                     <div className="prose prose-invert max-w-none text-foreground/70 leading-[1.8] tracking-wide text-sm font-medium">
                        {answer.split('\n').map((line: string, i: number) => {
                           // Regex to find and wrap URLs
                           const urlRegex = /(https?:\/\/[^\s]+)/g;
                           const parts = line.split(urlRegex);
                           const renderedLine = parts.map((part, index) => {
                             if (part.match(urlRegex)) {
                               return (
                                 <a key={index} href={part} target="_blank" rel="noopener noreferrer" className="text-accent underline decoration-accent/20 underline-offset-4 hover:decoration-accent transition-all font-black uppercase tracking-tighter mx-1">
                                    [Deep Link]
                                 </a>
                               );
                             }
                             return part;
                           });

                           if (line.includes('[INDIA]') || line.includes('[GLOBAL]')) {
                             return (
                               <p key={i} className="mb-4 p-4 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between group hover:border-accent/40 transition-all">
                                 <span className="flex-1 lg:text-sm text-xs">{renderedLine}</span>
                                 <ArrowRight className="w-4 h-4 text-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                               </p>
                             );
                           }
                           if (line.startsWith('#') || line.toUpperCase().includes('ROADMAP') || line.toUpperCase().includes('SECTION') || line.toUpperCase().includes('STRATEGIC')) {
                             return <h3 key={i} className="text-accent text-lg font-black tracking-tighter mt-12 mb-6 uppercase italic underline decoration-accent/20 underline-offset-8">{line.replace(/#/g, '')}</h3>;
                           }
                           return <p key={i} className="mb-6">{renderedLine}</p>;
                        })}
                     </div>
                  </div>
               </div>
            </div>

            {/* Direct Job Listings Column */}
            <div className="lg:col-span-4 space-y-6">
               <div className="flex items-center space-x-3 px-2">
                  <Database className="w-4 h-4 text-foreground/30" />
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-foreground/30">Verified Vectors</h3>
               </div>
               
               <div className="space-y-3 pr-2 custom-scrollbar overflow-y-auto max-h-[800px]">
                  {sources.map((source: any, i: number) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="block glass-card p-5 border-white/5 hover:border-accent/40 transition-all group"
                    >
                       <div className="flex justify-between items-start mb-3">
                          <a href={source.url} target="_blank" className="text-xs font-bold tracking-wide text-foreground/80 group-hover:text-accent transition-colors line-clamp-1">
                            {source.title}
                          </a>
                          <ExternalLink className="w-3.5 h-3.5 text-foreground/20 group-hover:text-accent transition-colors" />
                       </div>
                       
                       <div className="flex flex-wrap gap-2 mb-4">
                          <div className="flex items-center space-x-1 px-2 py-1 bg-white/5 rounded-md text-[9px] font-bold text-foreground/40 uppercase tracking-tighter">
                             <Building2 className="w-3 h-3" />
                             <span>{source.url.includes('naukri') ? 'INDIA' : 'GLOBAL'}</span>
                          </div>
                          <button onClick={() => handleSaveToNotes(source)} className="flex items-center space-x-1 px-2 py-1 bg-accent/10 rounded-md text-[9px] font-bold text-accent uppercase">
                             {savedNoteId === source.url ? <CheckCircle2 className="w-2 h-2" /> : <Save className="w-2 h-2" />}
                             <span>{savedNoteId === source.url ? "Saved" : "Save"}</span>
                          </button>
                       </div>

                       <div className="flex items-center justify-between border-t border-white/5 pt-4">
                          <span className="text-[9px] font-bold text-foreground/20 tracking-tighter truncate max-w-[120px]">{new URL(source.url).hostname}</span>
                          <a href={source.url} target="_blank" className="text-[10px] font-black tracking-widest text-accent hover:underline">GO TO APPLY</a>
                       </div>
                    </motion.div>
                  ))}
               </div>
            </div>
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            key="error"
            className="p-6 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 flex items-center space-x-4 max-w-md mx-auto"
          >
            <Loader2 className="w-6 h-6 flex-shrink-0 animate-spin" />
            <div className="flex-1">
               <p className="text-xs font-bold uppercase tracking-widest mb-1">Neural Handshake Failed</p>
               <p className="text-xs opacity-80 mono-data">{error}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
