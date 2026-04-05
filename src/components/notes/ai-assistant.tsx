"use client";

import { useState } from "react";
import { Sparkles, List, FileEdit, ArrowDownLeft, Loader2, Wand2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AIAssistantProps {
  content: any;
  onApply: (newContent: string) => void;
}

export default function AIAssistant({ content, onApply }: AIAssistantProps) {
  const [loading, setLoading] = useState(false);
  const [suggestion, setSuggestion] = useState("");
  const [activeAction, setActiveAction] = useState<string | null>(null);

  const handleAction = async (action: string) => {
    // Extract plain text from Tiptap JSON (simplified for this context)
    const plainText = content?.content?.map((c: any) => c.content?.map((t: any) => t.text).join("")).join("\n") || "";
    
    if (!plainText || plainText.length < 5) return;

    setLoading(true);
    setSuggestion("");
    setActiveAction(action);

    try {
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: plainText, action }),
      });

      if (!response.ok) throw new Error("AI Handshake Failed.");

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          setSuggestion((prev) => prev + chunk);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-80 flex flex-col gap-6">
      <div className="glass-card p-6 border-accent/20 bg-accent/[0.02]">
        <div className="flex items-center space-x-3 mb-6">
          <Sparkles className="w-5 h-5 text-accent animate-pulse" />
          <h3 className="text-xs font-black uppercase tracking-[0.4em] text-accent/80">Neural Assistant</h3>
        </div>

        <div className="grid grid-cols-1 gap-2">
          <button 
            onClick={() => handleAction("refine")}
            disabled={loading}
            className="flex items-center justify-between p-4 bg-white/5 hover:bg-accent/10 border border-white/5 rounded-xl transition-all group"
          >
            <div className="flex items-center space-x-3">
              <Wand2 className="w-4 h-4 text-foreground/40 group-hover:text-accent" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-foreground/60">Refine Logic</span>
            </div>
            <ArrowDownLeft className="w-3 h-3 text-foreground/10 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>

          <button 
            onClick={() => handleAction("bulletize")}
            disabled={loading}
            className="flex items-center justify-between p-4 bg-white/5 hover:bg-accent/10 border border-white/5 rounded-xl transition-all group"
          >
            <div className="flex items-center space-x-3">
              <List className="w-4 h-4 text-foreground/40 group-hover:text-accent" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-foreground/60">Bulletize</span>
            </div>
            <ArrowDownLeft className="w-3 h-3 text-foreground/10" />
          </button>

          <button 
             onClick={() => handleAction("expand")}
             disabled={loading}
             className="flex items-center justify-between p-4 bg-white/5 hover:bg-accent/10 border border-white/5 rounded-xl transition-all group"
          >
            <div className="flex items-center space-x-3">
              <FileEdit className="w-4 h-4 text-foreground/40 group-hover:text-accent" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-foreground/60">Expand Thought</span>
            </div>
          </button>
        </div>

        <AnimatePresence>
          {(suggestion || loading) && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-6 pt-6 border-t border-white/10"
            >
              <div className="flex items-center justify-between mb-4">
                 <span className="text-[9px] font-black uppercase tracking-widest text-accent/40 italic">Proposed Sync</span>
                 {loading && <Loader2 className="w-3 h-3 animate-spin text-accent" />}
              </div>
              <div className="text-[11px] leading-relaxed text-foreground/60 italic p-4 bg-white/[0.02] rounded-lg border border-white/5 max-h-48 overflow-y-auto custom-scrollbar">
                {suggestion}
              </div>
              {!loading && suggestion && (
                <button 
                  onClick={() => onApply(suggestion)}
                  className="w-full mt-4 py-2 bg-accent text-background text-[10px] font-black uppercase tracking-widest rounded-lg hover:shadow-[0_0_15px_rgba(204,255,0,0.4)] transition-all"
                >
                   Inject Into Archive
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
          <p className="text-[10px] font-bold uppercase tracking-wider text-foreground/20 mb-3 italic">Assistant Metrics</p>
          <div className="flex flex-col space-y-2 text-[10px] mono-data uppercase">
             <div className="flex justify-between">
                <span className="text-foreground/40">Latency</span>
                <span className="text-accent font-bold">142ms</span>
             </div>
             <div className="flex justify-between">
                <span className="text-foreground/40">Model</span>
                <span className="text-white">Gemini 1.5</span>
             </div>
          </div>
       </div>
    </div>
  );
}
