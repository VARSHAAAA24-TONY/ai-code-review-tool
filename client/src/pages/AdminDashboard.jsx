import React from 'react';
import { 
  Users, 
  ShieldCheck, 
  Mail, 
  Loader2, 
  Search, 
  Activity, 
  Globe, 
  Zap, 
  MoreVertical,
  ShieldAlert,
  Settings,
  Download,
  Lock,
  UserPlus
} from 'lucide-react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const AdminDashboard = () => {
  const [stats, setStats] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  
  React.useEffect(() => {
    axios.get('/api/admin/stats')
      .then(res => {
        setStats(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const users = [
    { name: 'Rakesh N', email: 'rakesh@codeaudit.ai', role: 'System_Admin', reviews: 145, joined: 'MAR_2024', status: 'ACTIVE' },
    { name: 'DeepMind Core', email: 'core@codeaudit.ai', role: 'Audit_Lead', reviews: 82, joined: 'FEB_2024', status: 'ACTIVE' },
    { name: 'Arch Root', email: 'root@codeaudit.ai', role: 'Lead_Architect', reviews: 290, joined: 'JAN_2024', status: 'OFFLINE' },
    { name: 'Ghost Sec', email: 'sec@codeaudit.ai', role: 'Security_Force', reviews: 12, joined: 'APR_2024', status: 'ACTIVE' },
  ];

  return (
    <div className="space-y-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 pb-8 border-b border-[#12B886]/10">
        <div className="space-y-3">
           <div className="flex items-center gap-3 text-[#00FFCC] mb-1">
             <ShieldCheck size={18} className="drop-shadow-[0_0_8px_#00FFCC]" />
             <span className="text-[11px] font-bold uppercase tracking-[4px] leading-none opacity-60">Security_Authority_Node</span>
           </div>
           <h1 className="text-4xl font-extrabold tracking-tight text-white mb-1">Central_Command</h1>
           <p className="text-[#B0B8B9] font-medium tracking-wide opacity-60">Global infrastructure oversight and secure decentralized node management.</p>
        </div>
        <div className="flex gap-4">
          <button className="btn-modern bg-[#1A1D1E] border border-[#12B886]/20 text-[#B0B8B9] hover:text-[#00FFCC] rounded-2xl py-4 px-10 gap-3 shadow-xl transition-all">
            <Download size={18} />
            <span className="uppercase tracking-[3px] font-bold text-[11px]">Audit_Logs</span>
          </button>
          <button className="btn-modern btn-primary py-4 px-10 rounded-2xl gap-3 shadow-[0_0_30px_rgba(0,255,204,0.2)]">
            <Zap size={18} />
            <span className="uppercase tracking-[3px] font-bold text-[11px]">Push_Patch</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {[
          { icon: Users, label: 'Platform_Entities', value: stats?.totalUsers || '1,248', trend: '+12.5%', color: 'text-[#00FFCC]', bg: 'bg-[#00FFCC]/5' },
          { icon: Globe, label: 'Architectural_Audits', value: stats?.totalReviews || '42.8K', trend: 'STABLE', color: 'text-[#12B886]', bg: 'bg-[#12B886]/5' },
          { icon: ShieldAlert, label: 'Security_Anomalies', value: stats?.criticalBugs || '12', trend: '-18%', color: 'text-[#00FFCC]', bg: 'bg-[#00FFCC]/10' },
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="modern-card p-8 group bg-[#1A1D1E]/40 backdrop-blur-3xl border border-[#12B886]/20 rounded-[40px] hover:border-[#00FFCC]/50 transition-all duration-500 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-6 opacity-[0.03] text-[#00FFCC] group-hover:opacity-[0.08] transition-opacity duration-700 pointer-events-none">
              <stat.icon size={120} strokeWidth={1} />
            </div>
            <div className="flex items-center justify-between mb-8 relative z-10">
              <div className={`p-4 rounded-3xl ${stat.bg} ${stat.color} border border-current opacity-60 group-hover:scale-110 group-hover:opacity-100 transition-all duration-700 shadow-xl`}>
                <stat.icon size={28} strokeWidth={1.5} />
              </div>
              <div className="flex flex-col items-end">
                <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-[3px] border ${stat.trend.startsWith('+') || stat.trend === 'STABLE' ? 'bg-[#00FFCC]/5 text-[#00FFCC] border-[#00FFCC]/20' : 'bg-red-500/5 text-red-400 border-red-500/20'}`}>
                  {stat.trend}
                </span>
              </div>
            </div>
            <div className="space-y-2 relative z-10">
              <h3 className="text-5xl font-extrabold text-white tracking-tighter tabular-nums font-mono">
                {loading ? <Loader2 className="animate-spin text-[#12B886]" size={36} /> : stat.value}
              </h3>
              <p className="text-[11px] font-bold text-[#12B886] uppercase tracking-[4px] opacity-40">{stat.label}</p>
            </div>
            <div className="mt-10 h-1.5 w-full bg-[#12B886]/10 rounded-full overflow-hidden relative z-10">
               <motion.div 
                 initial={{ width: 0 }}
                 animate={{ width: '75%' }}
                 transition={{ duration: 2, delay: 0.5 + (i * 0.2) }}
                 className={`h-full ${stat.color.replace('text-', 'bg-')} shadow-[0_0_15px_rgba(0,255,204,0.5)]`}
               />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Users Directory */}
      <div className="modern-card p-0 rounded-[48px] bg-[#1A1D1E]/40 backdrop-blur-3xl border border-[#12B886]/20 overflow-hidden shadow-2xl relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#00FFCC]/5 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="p-12 border-b border-[#12B886]/10 flex flex-col lg:flex-row items-center justify-between gap-10 relative z-10">
          <div className="flex items-center gap-6">
            <div className="p-4 bg-[#00FFCC]/5 rounded-3xl text-[#00FFCC] border border-[#00FFCC]/20 shadow-xl group-hover:scale-110 transition-transform">
              <Activity size={32} strokeWidth={1} />
            </div>
            <div>
              <h3 className="text-2xl font-extrabold text-white tracking-tight italic">Authority_Registry</h3>
              <p className="text-[11px] text-[#12B886] font-bold uppercase tracking-[4px] mt-2 opacity-60">High-clearance personnel clearance matrix</p>
            </div>
          </div>
          <div className="flex items-center gap-4 w-full lg:w-auto">
            <div className="flex items-center gap-5 bg-[#1A1D1E]/60 border border-[#12B886]/20 px-8 py-5 rounded-[24px] w-full lg:w-[480px] focus-within:border-[#00FFCC]/50 transition-all duration-500 shadow-inner">
              <Search size={22} className="text-[#12B886]" />
              <input type="text" placeholder="QUERY ENTITY ID // CLEARANCE_LVL..." className="bg-transparent border-none p-0 text-[11px] font-bold text-[#00FFCC] focus:ring-0 placeholder:text-[#12B886]/20 w-full tracking-[3px] uppercase" />
            </div>
            <button className="p-5 bg-[#00FFCC]/5 text-[#00FFCC] border border-[#00FFCC]/20 rounded-[24px] hover:bg-[#00FFCC]/10 transition-all shadow-xl">
              <UserPlus size={24} strokeWidth={1.5} />
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto relative z-10">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#1A1D1E]/40 text-[#12B886] uppercase text-[10px] tracking-[4px] font-bold border-b border-[#12B886]/10">
                <th className="px-12 py-8">SYSTEM_ENTITY</th>
                <th className="px-12 py-8">CLEARANCE_MOD</th>
                <th className="px-12 py-8 text-center">AUDIT_LOAD</th>
                <th className="px-12 py-8">ENTRY_DATE</th>
                <th className="px-12 py-8 text-right">PROTOCOL</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#12B886]/10 font-medium">
              {users.map((user, i) => (
                <tr key={i} className="hover:bg-[#00FFCC]/[0.03] transition-colors group duration-500">
                  <td className="px-12 py-8">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 rounded-2xl bg-[#1A1D1E] border border-[#12B886]/20 flex items-center justify-center text-[#B0B8B9] font-mono text-xl group-hover:bg-[#00FFCC] group-hover:text-[#1A1D1E] group-hover:border-[#00FFCC] transition-all duration-500 shadow-xl">
                        {user.name.charAt(0)}
                      </div>
                      <div className="space-y-2">
                        <p className="font-bold text-white text-[17px] tracking-tight group-hover:text-[#00FFCC] transition-colors">{user.name}</p>
                        <p className="text-[10px] text-[#B0B8B9] font-bold uppercase tracking-[2px] flex items-center gap-3 opacity-40 group-hover:opacity-60 transition-opacity">
                          <Mail size={13} className="text-[#12B886]" /> {user.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-12 py-8">
                    <span className="inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-[#1A1D1E]/40 border border-[#12B886]/20 text-[10px] font-bold uppercase tracking-[3px] text-[#12B886] group-hover:text-[#00FFCC] group-hover:border-[#00FFCC]/30 transition-all shadow-sm">
                       <Lock size={13} strokeWidth={1} /> {user.role}
                    </span>
                  </td>
                  <td className="px-12 py-8 text-center">
                    <p className="text-4xl font-extrabold text-white tracking-tighter tabular-nums font-mono drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]">{user.reviews}</p>
                    <p className="text-[9px] text-[#12B886] font-bold uppercase tracking-[5px] mt-1.5 opacity-40">Records</p>
                  </td>
                  <td className="px-12 py-8 text-[11px] font-bold text-[#B0B8B9] uppercase tracking-[3px] tabular-nums opacity-40">
                    {user.joined}
                  </td>
                  <td className="px-12 py-8 text-right">
                    <div className="flex items-center justify-end gap-4">
                      <button className="p-4 text-[#B0B8B9] hover:text-[#00FFCC] hover:bg-[#00FFCC]/10 rounded-2xl transition-all border border-transparent hover:border-[#00FFCC]/20 shadow-xl group/btn">
                        <Settings size={22} className="group-hover/btn:rotate-90 transition-transform duration-700" />
                      </button>
                      <button className="p-4 text-[#B0B8B9] hover:text-[#00FFCC] hover:bg-[#00FFCC]/10 rounded-2xl transition-all border border-transparent hover:border-[#00FFCC]/20 shadow-xl">
                        <MoreVertical size={22} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-10 bg-[#1A1D1E]/60 border-t border-[#12B886]/10 flex justify-center relative z-10">
           <div className="flex items-center gap-6 px-10 py-4 rounded-full bg-[#00FFCC]/5 border border-[#00FFCC]/20 shadow-[0_0_50px_rgba(0,255,204,0.1)]">
            <div className="w-3 h-3 rounded-full bg-[#00FFCC] animate-pulse shadow-[0_0_15px_#00FFCC]"></div>
            <div className="flex items-center gap-4">
              <span className="text-[11px] text-[#00FFCC] font-bold tracking-[6px] uppercase opacity-80">ENCRYPTION_STREAM_STABLE</span>
              <div className="w-px h-4 bg-[#12B886]/30"></div>
              <span className="text-[10px] text-[#12B886] font-bold tracking-[4px] uppercase opacity-40">256-BIT_AES_VAULT_MOD</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;


