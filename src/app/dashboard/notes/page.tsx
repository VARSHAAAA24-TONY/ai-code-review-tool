"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Search, Trash2, Save, FileText, ChevronRight, Loader2, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

const Editor = dynamic(() => import("@/components/notes/editor"), { 
  ssr: false,
  loading: () => <div className="h-[400px] w-full glass-card animate-pulse bg-white/5" />
});

export default function NotesPage() {
  const [notes, setNotes] = useState<any[]>([]);
  const [activeNote, setActiveNote] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchNotes = useCallback(async () => {
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .order("updated_at", { ascending: false });

    if (error) {
      toast.error("Handshake Error: Failed to fetch archives.");
    } else {
      setNotes(data || []);
      if (data && data.length > 0 && !activeNote) {
        setActiveNote(data[0]);
      }
    }
    setLoading(false);
  }, [activeNote]);

  useEffect(() => {
    fetchNotes();
  }, []); // Only fetch on mount or if explicitly requested

  const handleCreateNote = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const newNote = {
      user_id: session.user.id,
      title: "UNTITLED ENTRY",
      content: { 
        type: "doc", 
        content: [{ type: "paragraph" }] 
      },
    };

    const { data, error } = await supabase
      .from("notes")
      .insert([newNote])
      .select();

    if (error) {
       toast.error("Write Error: Entry failed to initialize.");
    } else if (data) {
      setNotes([data[0], ...notes]);
      setActiveNote(data[0]);
      toast.success("New Entry Initialized");
    }
  };

  const handleSave = async () => {
    if (!activeNote) return;
    setSaving(true);

    const { error } = await supabase
      .from("notes")
      .update({ 
        title: activeNote.title, 
        content: activeNote.content,
        updated_at: new Date().toISOString()
      })
      .eq("id", activeNote.id);

    if (error) {
      toast.error("Sync Failure: Neural handoff failed.");
    } else {
      setNotes(notes.map(n => n.id === activeNote.id ? activeNote : n));
      toast.success("Archive Synchronized");
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from("notes")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("Purge Error: System refused to delete.");
    } else {
      const remainingNotes = notes.filter(n => n.id !== id);
      setNotes(remainingNotes);
      if (activeNote?.id === id) {
        setActiveNote(remainingNotes[0] || null);
      }
      toast.success("Entry Purged Safely");
    }
  };

  const handleApplyAI = (newText: string) => {
    // Hidden method to keep handleApplyAI reference if needed, but not used by UI
  };

  const filteredNotes = notes.filter(n => n.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="h-[calc(100vh-8rem)] flex gap-8">
      {/* Sidebar List */}
      <div className="w-80 flex flex-col gap-6">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40 group-focus-within:text-accent transition-colors" />
          <input 
            type="text" 
            placeholder="FILTER ARCHIVES..." 
            className="w-full bg-white/5 border border-white/5 rounded-xl py-3 pl-12 pr-4 text-xs font-bold tracking-widest focus:outline-none focus:border-accent/40 transition-all mono-data uppercase placeholder:text-foreground/20"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
          {filteredNotes.map((note) => (
            <motion.div
              key={note.id}
              onClick={() => setActiveNote(note)}
              className={`p-4 rounded-xl border cursor-pointer transition-all duration-300 group ${
                activeNote?.id === note.id 
                ? "bg-accent/10 border-accent/20" 
                : "bg-white/[0.02] border-white/5 hover:border-white/10"
              }`}
            >
              <div className="flex items-center space-x-3">
                <FileText className={`w-4 h-4 ${activeNote?.id === note.id ? "text-accent" : "text-foreground/30"}`} />
                <h4 className={`text-sm font-bold tracking-wide truncate ${activeNote?.id === note.id ? "text-accent" : "text-foreground/60"}`}>
                  {note.title}
                </h4>
              </div>
            </motion.div>
          ))}
        </div>

        <button 
          onClick={handleCreateNote}
          className="w-full bg-accent text-background font-black py-4 rounded-xl uppercase tracking-widest text-[10px] hover:shadow-[0_0_15px_rgba(204,255,0,0.4)] transition-all"
        >
          Initialize New Entry
        </button>
      </div>

      {/* Editor Area */}
      <div className="flex-1 flex flex-col gap-6">
        {activeNote ? (
          <>
            <header className="flex items-center justify-between p-1">
              <input 
                type="text" 
                className="bg-transparent border-none text-3xl font-extrabold tracking-tighter focus:outline-none placeholder:text-foreground/10 uppercase mr-8"
                value={activeNote.title}
                onChange={(e) => setActiveNote({...activeNote, title: e.target.value})}
                placeholder="ENTRY TITLE..."
              />
              <div className="flex items-center space-x-3">
                <button 
                  onClick={() => handleDelete(activeNote.id)}
                  className="p-3 bg-white/5 hover:bg-red-500/10 text-foreground/40 hover:text-red-500 rounded-xl transition-all border border-white/5"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button 
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center space-x-2 px-6 py-3 bg-white/5 hover:bg-accent/10 text-foreground font-bold rounded-xl transition-all border border-white/10 group disabled:opacity-50"
                >
                  {saving ? (
                    <Loader2 className="w-4 h-4 animate-spin text-accent" />
                  ) : (
                    <Save className="w-4 h-4 text-foreground/40 group-hover:text-accent transition-colors" />
                  )}
                  <span className="uppercase tracking-widest text-[10px]">Sync Data</span>
                </button>
              </div>
            </header>

            <Editor 
              key={activeNote.id}
              content={activeNote.content} 
              onChange={(newContent) => setActiveNote({...activeNote, content: newContent})} 
            />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center glass-card">
             <span className="text-xs font-bold uppercase tracking-[0.4em] text-foreground/20">Awaiting Signal...</span>
          </div>
        )}
      </div>
    </div>
  );
}
