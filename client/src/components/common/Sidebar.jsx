import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Search, 
  History, 
  ShieldCheck, 
  LogOut,
  Activity,
  Cpu,
  Database
} from 'lucide-react';
import { auth } from '../../lib/firebase';
import { signOut } from 'firebase/auth';
import { motion } from 'framer-motion';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    localStorage.removeItem('sb-guest-session');
    await signOut(auth);
    navigate('/auth');
  };

  const navItems = [
    { icon: LayoutDashboard, label: 'OVERVIEW', path: '/' },
    { icon: Search, label: 'INIT_AUDIT', path: '/review' },
    { icon: History, label: 'FORENSIC_LEDGER', path: '/history' },
    { icon: ShieldCheck, label: 'ADMIN_CONTROL', path: '/admin' },
  ];

  return (
    <aside className="w-80 bg-[#1A1D1E] border-r border-[#12B886]/10 flex flex-col h-screen sticky top-0 z-50 shadow-2xl relative overflow-hidden">
      {/* Brand Section */}
      <div className="p-10 pb-12">
        <div className="flex items-center gap-5 group cursor-default">
          <div className="relative">
            <div className="w-14 h-14 bg-[#00FFCC]/10 border border-[#00FFCC]/30 flex items-center justify-center rounded-2xl shadow-[0_0_20px_rgba(0,255,204,0.1)] group-hover:scale-105 transition-all duration-500">
               <Cpu className="text-[#00FFCC] animate-pulse" size={28} strokeWidth={1.5} />
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#12B886] border-2 border-[#1A1D1E] rounded-full"></div>
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tight text-white leading-none uppercase">CodeAudit<span className="text-[#00FFCC]">.ai</span> </h1>
            <p className="text-[9px] text-[#12B886] font-bold uppercase tracking-[3px] mt-1.5 opacity-80">MINT_PROTOCOL</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-2">
        <div className="px-6 mb-6 text-[9px] font-bold text-[#B0B8B9] uppercase tracking-[4px] opacity-40 italic">
          // COMMAND_MODULES
        </div>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`
                flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 group relative overflow-hidden
                ${isActive 
                  ? 'bg-[#00FFCC]/10 text-[#00FFCC] border border-[#00FFCC]/20 shadow-[0_0_20px_rgba(0,255,204,0.05)]' 
                  : 'text-[#B0B8B9] hover:text-[#00FFCC] hover:bg-white/[0.03] border border-transparent'}
              `}
            >
              {isActive && (
                <motion.div 
                  layoutId="active-pill"
                  className="absolute left-0 top-0 w-1 h-full bg-[#00FFCC]"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              <item.icon size={20} strokeWidth={isActive ? 2.5 : 1.5} className={isActive ? 'text-[#00FFCC]' : 'group-hover:text-[#00FFCC] transition-colors'} />
              <span className={`text-[11px] font-bold uppercase tracking-widest ${isActive ? 'text-[#00FFCC]' : ''}`}>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Footer / System Status */}
      <div className="p-8 mt-auto">
        <div className="bg-[#1A1D1E] border border-[#12B886]/10 rounded-3xl p-8 mb-6 shadow-xl relative group overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#00FFCC]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          
          <div className="flex items-center justify-between mb-6 relative z-10">
            <div className="flex items-center gap-3">
              <Activity size={16} className="text-[#00FFCC] animate-pulse" />
              <span className="text-[10px] font-bold text-white uppercase tracking-[2px]">UPLINK_LIVE</span>
            </div>
            <span className="text-[8px] font-black text-[#00FFCC] uppercase px-2 py-0.5 bg-[#00FFCC]/10 border border-[#00FFCC]/20 rounded-md">SYNC</span>
          </div>
          
          <div className="space-y-4 relative z-10">
            <div className="flex items-center justify-between text-[9px] font-bold text-[#B0B8B9] uppercase tracking-[2px]">
               <span>AUDIT_LOAD</span>
               <span className="text-[#00FFCC]">84%</span>
            </div>
            <div className="w-full bg-[#12B886]/10 h-1 rounded-full overflow-hidden">
               <div className="w-[84%] h-full bg-[#00FFCC] shadow-[0_0_10px_#00FFCC]"></div>
            </div>
            <div className="grid grid-cols-1 gap-2 mt-4">
               <div className="p-3 bg-white/[0.02] rounded-xl border border-[#12B886]/10 flex items-center gap-3">
                  <Database size={14} className="text-[#00FFCC]/50" />
                  <span className="text-[8px] font-bold uppercase text-[#B0B8B9] tracking-[1px]">NODE_US_EAST_01</span>
               </div>
            </div>
          </div>
        </div>

        <button 
          onClick={handleLogout}
          className="flex items-center gap-4 px-6 py-4 w-full text-[11px] font-bold uppercase tracking-[2px] text-[#B0B8B9] hover:text-[#00FFCC] hover:bg-[#00FFCC]/5 rounded-2xl transition-all group border border-transparent hover:border-[#00FFCC]/10"
        >
          <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span>Exit Module</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
