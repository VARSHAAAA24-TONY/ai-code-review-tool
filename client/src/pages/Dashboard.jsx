import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  History, 
  Bug, 
  Zap, 
  Code, 
  ShieldCheck, 
  Cpu, 
  Activity, 
  Database, 
  ArrowUpRight,
  CheckCircle2,
  Sparkles,
  ChevronRight,
  ArrowRight,
  Calendar
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { auth, db } from '../lib/firebase';
import { collection, query, where, limit, getDocs } from 'firebase/firestore';

const StatCard = ({ icon: Icon, label, value, trend, trendValue, i }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: i * 0.1 }}
    className="modern-card group p-8 bg-[#1A1D1E]/40 backdrop-blur-2xl border border-[#12B886]/10 hover:border-[#00FFCC]/40 rounded-[24px] relative overflow-hidden transition-all duration-500"
  >
    <div className="flex items-center justify-between mb-8">
      <div className="p-4 bg-[#00FFCC]/10 border border-[#00FFCC]/20 text-[#00FFCC] rounded-2xl group-hover:scale-110 transition-transform duration-500 shadow-[0_0_15px_rgba(0,255,204,0.1)]">
        <Icon size={24} strokeWidth={1.5} />
      </div>
      {trendValue && (
        <div className={`flex items-center gap-2 text-[10px] font-bold px-3 py-1.5 rounded-full border ${trend === 'up' ? 'bg-[#00FFCC]/10 border-[#00FFCC]/20 text-[#00FFCC]' : trend === 'down' ? 'bg-red-500/10 border-red-500/20 text-red-500' : 'bg-[#12B886]/10 border-[#12B886]/20 text-[#12B886]'}`}>
          {trend === 'up' ? <ArrowUpRight size={14} /> : trend === 'down' ? <ArrowUpRight size={14} className="rotate-90" /> : <Activity size={14} />}
          <span className="tracking-widest">{trendValue}</span>
        </div>
      )}
    </div>
    <div className="space-y-2 relative z-10">
      <h3 className="text-4xl font-extrabold text-[#fff] tracking-tighter tabular-nums leading-none font-mono">{value}</h3>
      <p className="text-[11px] font-bold text-[#B0B8B9] uppercase tracking-[2px] opacity-60">{label}</p>
    </div>
    <div className="mt-8 h-1 w-full bg-[#12B886]/10 rounded-full relative overflow-hidden">
       <motion.div 
         initial={{ width: 0 }}
         animate={{ width: '75%' }}
         transition={{ duration: 2, delay: 0.5 + (i * 0.1) }}
         className="h-full bg-gradient-to-r from-[#12B886] to-[#00FFCC] shadow-[0_0_10px_#00FFCC]"
       />
    </div>
  </motion.div>
);

const Dashboard = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentReviews = async () => {
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
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .slice(0, 5);
        setReviews(data);
      } catch (err) {
        console.error('Failed to fetch recent reviews:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentReviews();
  }, []);

  const stats = [
    { icon: Code, label: 'Audit Volume', value: '1,248', trend: 'up', trendValue: '+12.5%' },
    { icon: Bug, label: 'Identified Bugs', value: '42', trend: 'down', trendValue: '-8.2%' },
    { icon: Zap, label: 'Avg Latency', value: '0.8s', trend: 'up', trendValue: '-15%' },
    { icon: Activity, label: 'Stability Index', value: '98.4%', trend: 'neutral', trendValue: 'STABLE' },
  ];

  return (
    <div className="space-y-12">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 pb-8 border-b border-[#12B886]/10">
        <div className="space-y-3">
          <h1 className="text-4xl font-extrabold tracking-tight text-white">System_Dashboard</h1>
          <p className="text-[#12B886] text-[11px] font-bold tracking-[3px] uppercase opacity-80 flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-[#00FFCC] animate-pulse shadow-[0_0_8px_#00FFCC]"></span>
            DIAGNOSTIC_NODE_ACTIVE // CORE_S1
          </p>
        </div>
        <Link to="/review" className="btn-modern btn-primary py-4 px-10 gap-3 shadow-[0_0_30px_rgba(0,255,204,0.2)] rounded-2xl border-none">
          <Plus size={20} />
          <span className="tracking-widest">INITIATE_AUDIT</span>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, i) => (
          <StatCard key={i} {...stat} i={i} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Content: Activity & Guide */}
        <div className="lg:col-span-2 space-y-12">
          {/* Quick Start Guide */}
          <div className="modern-card p-10 bg-gradient-to-br from-[#1A1D1E]/80 to-[#12B886]/5 border border-[#00FFCC]/20 rounded-[32px] overflow-hidden relative group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#00FFCC]/5 blur-[80px] rounded-full pointer-events-none"></div>
            
            <div className="relative z-10 space-y-12">
              <div className="flex items-center gap-6">
                <div className="p-4 bg-[#00FFCC]/10 border border-[#00FFCC]/20 text-[#00FFCC] rounded-2xl shadow-xl">
                  <Sparkles size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white tracking-tight">Audit_Protocols</h2>
                  <p className="text-[10px] text-[#12B886] uppercase font-bold tracking-[4px] mt-1 opacity-60 italic">Workflow Execution // v4.2.0</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {[
                  { step: "01", title: "Source_Ingestion", desc: "Connect GitHub repositories or direct-inject code buffers.", icon: Database },
                  { step: "02", title: "Forensic_Analysis", desc: "Execute deep-layer AI forensics to identify architectural flaws.", icon: Activity },
                  { step: "03", title: "Risk_Assessment", desc: "Evaluate stability metrics and containment requirements.", icon: ShieldCheck },
                  { step: "04", title: "Deploy_Optimizations", desc: "Apply suggested refactors to neutralize detected threats.", icon: Zap },
                ].map((item, i) => (
                  <div key={i} className="flex gap-6 group cursor-default">
                    <div className="flex flex-col items-center gap-4 mt-1">
                      <span className="text-[11px] font-black font-mono text-[#00FFCC]/40 group-hover:text-[#00FFCC] transition-colors leading-none">{item.step}</span>
                      <div className="w-[1px] h-full bg-[#12B886]/20 relative">
                        <div className="absolute top-0 left-0 w-full bg-[#00FFCC] shadow-[0_0_10px_#00FFCC] transition-all h-0 group-hover:h-full duration-700"></div>
                      </div>
                    </div>
                    <div className="space-y-3 pb-4">
                      <div className="flex items-center gap-3">
                        <item.icon size={18} className="text-[#12B886] group-hover:text-[#00FFCC] transition-colors" />
                        <h4 className="text-[14px] font-bold text-white tracking-wide uppercase">
                          {item.title} 
                        </h4>
                      </div>
                      <p className="text-[11px] text-[#B0B8B9] leading-relaxed opacity-60 transition-opacity group-hover:opacity-100">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="space-y-8">
            <div className="flex items-center justify-between border-b border-[#12B886]/10 pb-6">
              <div className="flex items-center gap-4">
                <History className="text-[#00FFCC]" size={24} />
                <h2 className="text-2xl font-bold tracking-tight text-white uppercase">Forensic_Ledger</h2>
              </div>
              <Link to="/history" className="text-[10px] font-bold text-[#00FFCC] hover:text-white uppercase tracking-[4px] flex items-center gap-3 group transition-all">
                ARCHIVE_VAULT
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="space-y-6">
              {loading ? (
                [1, 2, 3].map((i) => (
                  <div key={i} className="h-24 bg-[#1A1D1E]/40 border border-[#12B886]/10 rounded-2xl animate-pulse" />
                ))
              ) : reviews.length > 0 ? (
                reviews.map((review, i) => (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    key={review.id}
                  >
                    <Link to={`/review/${review.id}`} className="flex flex-col md:flex-row md:items-center justify-between p-8 bg-[#1A1D1E]/40 backdrop-blur-xl border border-[#12B886]/10 hover:border-[#00FFCC]/40 rounded-3xl transition-all group relative overflow-hidden">
                      <div className="flex items-center gap-6 relative z-10">
                        <div className="w-14 h-14 bg-[#1A1D1E] border border-[#12B886]/20 rounded-2xl flex items-center justify-center text-[#12B886] group-hover:bg-[#00FFCC] group-hover:text-black group-hover:border-[#00FFCC] transition-all duration-500 shadow-lg">
                          <Database size={24} strokeWidth={1.5} />
                        </div>
                        <div>
                          <h4 className="text-[15px] font-bold text-white group-hover:text-[#00FFCC] transition-colors tracking-tight">
                            {review.repo_url?.replace('https://github.com/', '') || 'LOCAL_UPLINK_SOURCE'}
                          </h4>
                          <div className="flex items-center gap-6 mt-2">
                            <span className="flex items-center gap-2 text-[10px] font-medium text-[#B0B8B9] opacity-60">
                              <Calendar size={12} />
                              {new Date(review.created_at).toLocaleDateString()}
                            </span>
                            <span className="text-[9px] font-bold text-[#00FFCC] uppercase tracking-[2px] px-3 py-0.5 bg-[#00FFCC]/5 border border-[#00FFCC]/10 rounded-md">
                              CORE_{review.analysis_result?.language?.toUpperCase() || 'SYS'}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between md:justify-end gap-12 mt-6 md:mt-0 pt-6 md:pt-0 border-t md:border-t-0 border-[#12B886]/10">
                        <div className="text-right">
                          <p className="text-4xl font-extrabold text-[#00FFCC] font-mono tracking-tighter leading-none tabular-nums">
                            {review.score?.toFixed(1) || '0.0'}
                          </p>
                          <p className="text-[9px] text-[#B0B8B9] font-bold uppercase tracking-[3px] mt-1 opacity-40">INTEGRITY</p>
                        </div>
                        <div className="p-3 bg-[#12B886]/10 border border-[#12B886]/20 text-[#12B886] rounded-xl group-hover:text-[#00FFCC] group-hover:border-[#00FFCC]/40 transition-all">
                          <ChevronRight size={20} />
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))
              ) : (
                <div className="modern-card p-16 text-center border-dashed bg-transparent border-2 border-[#12B886]/20 rounded-[32px]">
                   <p className="text-[11px] text-[#B0B8B9] font-bold uppercase tracking-[4px] opacity-40">Zero recorded telemetry found.</p>
                   <Link to="/review" className="text-[#00FFCC] text-[11px] font-bold mt-8 inline-flex items-center gap-3 hover:scale-105 transition-all uppercase tracking-[2px] p-4 bg-[#00FFCC]/5 border border-[#00FFCC]/20 rounded-2xl shadow-xl">
                     <Plus size={14} /> INITIATE_CORE_PROTOCOL
                   </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Diagnostics */}
        <div className="space-y-12">
          <div className="modern-card p-10 bg-[#1A1D1E]/60 backdrop-blur-2xl border border-[#00FFCC]/20 rounded-[32px] shadow-2xl relative">
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-[11px] font-bold text-white flex items-center gap-4 uppercase tracking-[4px]">
                <Activity className="text-[#00FFCC]" size={20} />
                Live_Metrics
              </h2>
              <div className="px-3 py-1 bg-[#00FFCC]/10 border border-[#00FFCC]/30 rounded-full">
                <span className="text-[9px] font-bold text-[#00FFCC] uppercase tracking-widest animate-pulse">UPLINK_STABLE</span>
              </div>
            </div>
            
            <div className="space-y-10">
              {[
                { label: 'Logic_Coherence', val: 82, icon: CheckCircle2, sub: 'Stability_Index' },
                { label: 'Resource_Safety', val: 94, icon: ShieldCheck, sub: 'Containment_Level' },
                { label: 'Processing_Rate', val: 15, icon: Zap, sub: 'Cycle_Efficiency' },
              ].map((item, i) => (
                <div key={i} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold uppercase tracking-widest text-white flex items-center gap-3">
                         <item.icon size={14} className="text-[#12B886]" />
                         {item.label}
                      </span>
                      <p className="text-[9px] text-[#B0B8B9] uppercase font-bold tracking-[1px] ml-7 opacity-40">{item.sub}</p>
                    </div>
                    <span className="text-lg font-extrabold text-[#00FFCC] font-mono">{item.val}%</span>
                  </div>
                  <div className="w-full bg-[#12B886]/10 h-1.5 rounded-full relative overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${item.val}%` }}
                      transition={{ duration: 1.5, delay: i * 0.2 }}
                      className="bg-gradient-to-r from-[#12B886] to-[#00FFCC] h-full shadow-[0_0_15px_rgba(0,255,204,0.3)]"
                    ></motion.div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-10 mt-6 border-t border-[#12B886]/10">
              <div className="flex items-center gap-5 p-5 bg-[#00FFCC]/5 border border-[#00FFCC]/20 rounded-2xl">
                <div className="w-10 h-10 bg-[#1A1D1E] border border-[#00FFCC]/30 rounded-xl flex items-center justify-center">
                  <Cpu className="text-[#00FFCC]" size={20} />
                </div>
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-white uppercase tracking-[1px] leading-none">Security_Core_Active</span>
                  <p className="text-[9px] text-[#12B886] uppercase font-bold tracking-[2px] opacity-60">UPLINK_v4.2_STABLE</p>
                </div>
              </div>
            </div>
          </div>

          <div className="modern-card p-0 overflow-hidden group border border-[#12B886]/10 hover:border-[#00FFCC]/30 transition-all bg-[#1A1D1E] rounded-[32px]">
            <div className="p-10 bg-[#00FFCC]/5 border-b border-[#12B886]/10">
               <div className="flex items-center gap-3 mb-4">
                 <Database size={16} className="text-[#00FFCC]" />
                 <p className="text-[11px] font-bold text-[#12B886] uppercase tracking-[3px]">Audit_Throughput</p>
               </div>
               <h3 className="text-5xl font-extrabold text-white tracking-tighter tabular-nums font-mono">45.8<span className="text-xl opacity-30 ml-2 font-sans tracking-widest italic font-medium">MB</span></h3>
            </div>
            <div className="p-10 bg-transparent">
              <p className="text-[11px] text-[#B0B8B9] leading-relaxed font-bold uppercase tracking-[1px] text-justify opacity-60">
                Aggregate architectural forensics payload successfully processed across all secure decentralized nodes within the current active cycle.
              </p>
              <div className="mt-8 flex items-center gap-3 text-[#00FFCC] font-bold text-[10px] uppercase tracking-[3px] animate-pulse">
                <Activity size={14} /> CORE_SYNC_READY
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;




