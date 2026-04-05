"use client";

import { useState } from "react";
import { 
  Youtube, 
  Send, 
  Sparkles, 
  Copy, 
  Save, 
  CheckCircle2, 
  AlertCircle,
  Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function YouTubeSummarizer() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [syncMode, setSyncMode] = useState<"Transcript" | "Audio" | null>(null);

  const handleSummarize = async () => {
    if (!url) return;
    setLoading(true);
    setIsStreaming(false);
    setError(null);
    setSummary("");
    setSyncMode(null);

    try {
      const response = await fetch("/api/youtube/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to start streaming");
      }

      // Detect Sync Mode (Transcript vs Audio)
      const mode = response.headers.get("X-Sync-Mode") as "Transcript" | "Audio";
      setSyncMode(mode);

      // Handle Streaming Response
      const reader = response.body?.getReader();
      const textDecoder = new TextDecoder();
      
      setIsStreaming(true);
      setLoading(false);

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = textDecoder.decode(value, { stream: true });
          setSummary((prev) => prev + chunk);
        }
      }
      
      setIsStreaming(false);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
      setIsStreaming(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(summary);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <header className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 mb-6 accent-glow">
          <Youtube className="w-8 h-8 text-red-500" />
        </div>
        <h1 className="text-4xl font-extrabold tracking-tighter holographic-text italic lowercase">
          // Video Intelligence
        </h1>
        <p className="text-foreground/40 mt-2 font-medium tracking-widest uppercase text-[10px]">
          Extract wisdom from the temporal stream
        </p>
      </header>

      {/* Input Section */}
      <div className="relative group max-w-2xl mx-auto">
        <div className="absolute -inset-1 bg-gradient-to-r from-red-500/20 to-accent/20 rounded-2xl blur opacity-25 group-focus-within:opacity-100 transition duration-1000 group-focus-within:duration-200"></div>
        <div className="relative flex items-center bg-[#0A0F1C] border border-white/10 rounded-2xl p-2 focus-within:border-white/20 transition-all">
          <div className="flex-1 px-4">
             <input 
              type="text" 
              placeholder="PASTE YOUTUBE URL (v=xxxx...)"
              className="w-full bg-transparent border-none text-sm py-3 text-foreground focus:outline-none placeholder:text-foreground/20 font-bold tracking-widest mono-data uppercase"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSummarize()}
            />
          </div>
          <button 
            onClick={handleSummarize}
            disabled={loading || isStreaming || !url}
            className="flex items-center space-x-2 bg-white text-background px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed group/btn overflow-hidden"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Initialize</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Progress / Streaming Display */}
      <AnimatePresence mode="wait">
        {loading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            key="loading"
            className="space-y-8 py-12"
          >
             <div className="flex flex-col items-center space-y-4">
                <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden">
                   <motion.div 
                    initial={{ x: "-100%" }}
                    animate={{ x: "100%" }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                    className="w-1/2 h-full bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]" 
                   />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-foreground/40 animate-pulse mono-data">
                   {syncMode === "Audio" ? "Neural Audio Extraction... (Slow Sync)" : "Accessing Transcript Layer..."}
                </span>
             </div>
          </motion.div>
        )}

        {(summary || isStreaming) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            key="summary"
            className="space-y-6"
          >
            <div className="glass-card p-1">
              <div className="bg-[#0A0F1C]/80 backdrop-blur-2xl rounded-2xl p-8 border border-white/5">
                <div className="flex items-center justify-between mb-8">
                   <div className="flex items-center space-x-3">
                      {isStreaming ? (
                        <div className="flex space-x-1">
                           {[...Array(3)].map((_, i) => (
                             <div key={i} className="w-1 h-1 bg-accent rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                           ))}
                        </div>
                      ) : (
                        <CheckCircle2 className="w-5 h-5 text-accent" />
                      )}
                      <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-foreground/60">
                        {isStreaming ? "Streaming Synthesis" : "Synthesis Complete"}
                      </h2>
                   </div>
                   <div className="flex items-center space-x-2">
                     <button 
                      onClick={copyToClipboard}
                      className="p-2 hover:bg-white/5 rounded-lg transition-colors border border-white/5"
                     >
                       <Copy className="w-4 h-4 text-foreground/40" />
                     </button>
                     <button className="flex items-center space-x-2 px-4 py-2 bg-accent/10 border border-accent/20 rounded-lg text-accent text-[10px] font-bold uppercase tracking-widest hover:bg-accent/20 transition-all group/save">
                       <Save className="w-3.5 h-3.5" />
                       <span className="group-hover:translate-x-0.5 transition-transform">Store Archive</span>
                     </button>
                   </div>
                </div>
                
                <div className="prose prose-invert max-w-none prose-p:text-foreground/80 prose-headings:text-foreground">
                   {summary.split('\n').map((line: string, i: number) => (
                     <p key={i} className="mb-4 leading-relaxed tracking-wide text-sm">{line}</p>
                   ))}
                </div>

                {isStreaming && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-center pt-8"
                  >
                     <span className="text-[9px] font-bold uppercase tracking-[0.8em] text-accent/20 animate-pulse">Processing temporal stream tokens...</span>
                  </motion.div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="glass-card p-4 flex items-center justify-between border-white/5">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-foreground/30">Intelligence Mode</span>
                  <span className="text-xs font-bold italic mono-data text-accent">
                    {syncMode === "Audio" ? "Neural Audio Fallback" : "Direct Transcript Sync"}
                  </span>
               </div>
               <div className="glass-card p-4 flex items-center justify-between border-white/5">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-foreground/30">Latency</span>
                  <span className="text-xs font-bold italic mono-data text-white">
                    {syncMode === "Audio" ? "Nominal (Audio Load)" : "Instant"}
                  </span>
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
            <AlertCircle className="w-6 h-6 flex-shrink-0" />
            <div className="flex-1">
               <p className="text-xs font-bold uppercase tracking-widest mb-1">System Error</p>
               <p className="text-xs opacity-80 mono-data">{error}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
