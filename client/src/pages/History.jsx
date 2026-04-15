import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Download, 
  Calendar, 
  Terminal, 
  Database, 
  Bug, 
  ChevronRight,
  ArrowUpRight,
  Plus,
  Trash2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { auth, db } from '../lib/firebase';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import toast from 'react-hot-toast';

const History = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLang, setFilterLang] = useState('ALL');
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (e, reviewId) => {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm('Permanently delete this audit from the ledger?')) return;
    setDeletingId(reviewId);
    try {
      await deleteDoc(doc(db, 'audit_history', reviewId));
      setReviews(prev => prev.filter(r => r.id !== reviewId));
      toast.success('Audit removed from ledger.');
    } catch (err) {
      toast.error('Failed to delete: ' + err.message);
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    const fetchHistory = async () => {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        setLoading(false);
        return;
      }

      try {
        const q = query(
          collection(db, 'audit_history'),
          where('user_id', '==', currentUser.uid)
        );
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs
          .map(d => ({ id: d.id, ...d.data() }))
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        setReviews(data);
      } catch (err) {
        console.error('Failed to fetch history:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const filteredReviews = reviews.filter(r => {
    const lang = r.analysis_result?.language || 'JavaScript';
    const matchesSearch = r.repo_url?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         lang.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLang = filterLang === 'ALL' || lang.toUpperCase() === filterLang;
    return matchesSearch && matchesLang;
  });

  const handleExportAll = () => {
    const data = JSON.stringify(reviews, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-history-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-8 border-b border-[#12B886]/10">
        <div className="space-y-3">
           <div className="flex items-center gap-3 text-[#00FFCC] mb-1">
             <div className="w-2 h-2 rounded-full bg-[#00FFCC] animate-pulse"></div>
             <span className="text-[11px] font-bold uppercase tracking-[4px] leading-none opacity-60">Forensic_Archive_Vault</span>
           </div>
           <h1 className="text-4xl font-extrabold tracking-tight text-white mb-1">Audit_Ledger</h1>
           <p className="text-[#B0B8B9] font-medium tracking-wide opacity-60">Systematic repository of architectural forensics and logic containment.</p>
        </div>
        <button 
          onClick={handleExportAll} 
          className="btn-modern bg-[#1A1D1E] text-[#00FFCC] border border-[#12B886]/20 hover:border-[#00FFCC]/50 rounded-2xl py-4 px-10 gap-3 shadow-xl transition-all"
        >
          <Download size={18} />
          <span className="uppercase tracking-[3px] font-bold text-[11px]">Download_Archive</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="p-1.5 flex flex-col md:flex-row items-center gap-2 bg-[#1A1D1E]/40 backdrop-blur-xl border border-[#12B886]/20 rounded-3xl">
        <div className="flex-1 flex items-center gap-4 px-6 w-full group">
          <Search size={20} className="text-[#00FFCC] opacity-40 group-focus-within:opacity-100 transition-opacity" />
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="SCAN_VAULT // REPOSITORY_ID // LOGIC_CORE..." 
            className="bg-transparent border-none outline-none text-sm w-full py-5 text-[#00FFCC] placeholder:text-[#12B886]/30 focus:ring-0 font-bold uppercase tracking-[2px]" 
          />
        </div>
        <div className="w-full md:w-auto px-8 flex items-center gap-4 bg-[#00FFCC]/5 border-t md:border-t-0 md:border-l border-[#12B886]/10 rounded-2xl md:rounded-l-none">
          <Filter size={18} className="text-[#12B886]" />
          <select 
            value={filterLang}
            onChange={(e) => setFilterLang(e.target.value)}
            className="bg-transparent border-none outline-none text-[11px] font-bold text-[#12B886] flex-1 md:flex-none uppercase tracking-[3px] cursor-pointer py-5 focus:ring-0 pr-12 appearance-none hover:text-[#00FFCC] transition-colors"
          >
            <option value="ALL">ALL_MODELS</option>
            <option value="JAVASCRIPT">JS_CORE_V8</option>
            <option value="TYPESCRIPT">TS_SAFE_NET</option>
            <option value="PYTHON">PY_SCRIPT_OS</option>
          </select>
        </div>
      </div>

      {/* Reports List */}
      <div className="space-y-6">
        {loading ? (
          [1, 2, 3, 4].map(i => (
            <div key={i} className="h-28 bg-[#1A1D1E]/40 border border-[#12B886]/10 rounded-3xl animate-pulse"></div>
          ))
        ) : filteredReviews.length > 0 ? (
          <AnimatePresence>
            {filteredReviews.map((review, i) => (
              <motion.div 
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <div className="relative group/card">
                  <Link to={`/review/${review.id}`} className="modern-card p-10 flex flex-col md:flex-row items-center justify-between gap-12 group bg-[#1A1D1E]/40 backdrop-blur-2xl border border-[#12B886]/10 hover:border-[#00FFCC]/40 rounded-[32px] transition-all duration-500 relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#00FFCC]/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                    
                    <div className="flex items-center gap-8 w-full md:w-auto relative z-10">
                      <div className="w-16 h-16 bg-[#1A1D1E] border border-[#12B886]/20 rounded-2xl flex items-center justify-center text-[#12B886] group-hover:bg-[#00FFCC] group-hover:text-black group-hover:border-[#00FFCC] transition-all duration-500 shadow-xl">
                        <Database size={28} strokeWidth={1} />
                      </div>
                      <div className="space-y-3">
                         <h3 className="text-2xl font-bold text-white group-hover:text-[#00FFCC] transition-colors tracking-tight uppercase flex items-center gap-5">
                           {review.repo_url?.replace('https://github.com/', '') || 'LOCAL_UPLINK_SOURCE'}
                           <ArrowUpRight size={20} className="text-[#00FFCC] opacity-0 group-hover:opacity-100 transition-all duration-500" />
                         </h3>
                        <div className="flex items-center gap-10 text-[10px] font-bold text-[#B0B8B9] uppercase tracking-[3px] opacity-60">
                          <span className="flex items-center gap-2 transition-colors group-hover:text-[#12B886]"><Calendar size={14} /> {new Date(review.created_at).toLocaleDateString()}</span>
                          <span className="flex items-center gap-2 px-3 py-1 bg-[#00FFCC]/5 border border-[#00FFCC]/10 text-[#00FFCC] rounded-full"><Terminal size={14} /> CORE_{review.analysis_result?.language?.toUpperCase() || 'SYS'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between md:justify-end gap-16 w-full md:w-auto mt-6 md:mt-0 pt-6 md:pt-0 border-t md:border-t-0 border-[#12B886]/10 relative z-10">
                      <div className="text-center md:text-right space-y-2">
                        <div className="flex items-center gap-3 justify-center md:justify-end text-[#00FFCC]">
                           <Bug size={18} className="opacity-40" />
                           <span className="text-3xl font-extrabold tracking-tighter leading-none tabular-nums font-mono">{review.analysis_result?.bugs?.length || 0}</span>
                        </div>
                        <p className="text-[9px] text-[#B0B8B9] font-bold uppercase tracking-[4px] opacity-40">FAILURES</p>
                      </div>
                      
                      <div className="flex items-center gap-12 pl-12 border-l border-[#12B886]/10">
                        <div className="text-right space-y-2">
                          <p className="text-5xl font-extrabold text-[#00FFCC] font-mono tracking-tighter leading-none tabular-nums shadow-[0_0_15px_rgba(0,255,204,0.1)]">
                            {review.score?.toFixed(1) || '0.0'}
                          </p>
                          <p className="text-[10px] text-[#B0B8B9] uppercase font-bold tracking-[6px] opacity-40">INTEGRITY</p>
                        </div>
                        <div className="p-4 bg-[#12B886]/10 border border-[#12B886]/20 text-[#12B886] rounded-2xl group-hover:text-[#00FFCC] group-hover:border-[#00FFCC]/50 group-hover:scale-110 transition-all duration-500 shadow-xl">
                          <ChevronRight size={24} />
                        </div>
                      </div>
                    </div>
                  </Link>

                  {/* Delete Button - appears on hover */}
                  <button
                    onClick={(e) => handleDelete(e, review.id)}
                    disabled={deletingId === review.id}
                    title="Delete audit"
                    className="absolute top-4 right-4 z-20 p-2.5 rounded-xl bg-[#1A1D1E] border border-[#FF3366]/20 text-[#FF3366]/40 hover:text-[#FF3366] hover:border-[#FF3366]/60 hover:bg-[#FF3366]/10 opacity-0 group-hover/card:opacity-100 transition-all duration-300 shadow-xl"
                  >
                    {deletingId === review.id
                      ? <span className="text-[9px] font-bold uppercase tracking-widest px-1">...</span>
                      : <Trash2 size={16} />
                    }
                  </button>
                </div>
              </motion.div>

            ))}
          </AnimatePresence>
        ) : (
          <div className="modern-card p-32 text-center bg-transparent border-dashed border-2 border-[#12B886]/20 rounded-[48px] flex flex-col items-center relative overflow-hidden transition-all hover:border-[#00FFCC]/30 duration-700 shadow-2xl">
             <div className="absolute inset-0 bg-[#00FFCC]/5 blur-[120px] rounded-full pointer-events-none"></div>
             <p className="text-xl text-white font-bold uppercase tracking-[8px] mb-10 opacity-40">Zero recorded forensics detected.</p>
             <Link to="/review" className="btn-modern btn-primary px-16 py-6 rounded-2xl gap-4 shadow-[0_0_40px_rgba(0,255,204,0.2)]" style={{ border: 'none' }}>
               <Plus size={20} />
               <span className="uppercase tracking-[4px] font-extrabold text-[12px]">Initiate_Primary_Audit</span>
             </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default History;




