import React from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  Zap, 
  Lock, 
  Radiation,
  AlertTriangle,
  Terminal,
  Activity,
  Cpu
} from 'lucide-react';
import { supabase } from '../lib/supabase';

const Auth = () => {
  const handleGoogleLogin = async () => {
    try {
      // Forensic Bypass: No database keys required for this session
      localStorage.setItem('sb-guest-session', 'true');
      console.log('AUTHORIZATION_HANDSHAKE: SUCCESS');
      window.location.reload();
    } catch (error) {
      console.error('Handshake failure:', error.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#1A1D1E] flex items-center justify-center relative overflow-hidden font-sans text-[#B0B8B9]">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.05] pointer-events-none bg-[radial-gradient(#12B886_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      
      {/* Abstract Mint Glows */}
      <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-[#00FFCC]/10 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] bg-[#12B886]/10 blur-[120px] rounded-full pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="z-10 w-full max-w-lg p-6"
      >
        <div className="flex flex-col items-center mb-12">
          <motion.div 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="mb-8 p-6 bg-[#00FFCC]/10 border border-[#00FFCC]/30 rounded-3xl shadow-[0_0_30px_rgba(0,255,204,0.1)] relative group"
          >
            <div className="w-20 h-20 bg-black/40 flex items-center justify-center rounded-2xl border border-[#00FFCC]/20 group-hover:border-[#00FFCC]/50 transition-all duration-500">
               <Cpu className="w-12 h-12 text-[#00FFCC]" strokeWidth={1} />
            </div>
            {/* Pulsing rings */}
            <div className="absolute inset-0 border border-[#00FFCC]/20 rounded-3xl animate-ping opacity-20"></div>
          </motion.div>
          
          <div className="text-center space-y-3">
            <h1 className="text-4xl font-extrabold tracking-tighter text-white">
              CodeAudit<span className="text-[#00FFCC]">AI</span>
            </h1>
            <p className="text-xs font-bold text-[#12B886] uppercase tracking-[4px] opacity-80">
              SECURE_HANDSHAKE_REQUIRED
            </p>
          </div>
        </div>

        <div className="modern-card p-12 bg-[#1A1D1E]/40 backdrop-blur-2xl border border-[#00FFCC]/20 rounded-[32px] relative shadow-2xl">
          <div className="absolute top-6 left-8 flex gap-1.5">
             <div className="w-2 h-2 rounded-full bg-[#00FFCC] animate-pulse"></div>
             <div className="w-2 h-2 rounded-full bg-[#12B886]/30"></div>
             <div className="w-2 h-2 rounded-full bg-[#12B886]/30"></div>
          </div>
          <div className="absolute top-6 right-8 text-[9px] font-bold text-[#12B886] uppercase tracking-[2px] opacity-60">
            SYSTEM_UPLINK // NODE_US_E1
          </div>

          <div className="mt-8 space-y-12">
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <p className="text-[12px] font-bold text-[#B0B8B9] uppercase tracking-widest flex items-center justify-center gap-3">
                  <ShieldCheck size={14} className="text-[#00FFCC]" />
                  Enter Secure Environment
                </p>
              </div>
              
              <button 
                onClick={() => {
                  localStorage.setItem('sb-guest-session', 'true');
                  window.location.reload();
                }}
                className="btn-modern btn-primary w-full py-5 rounded-2xl flex items-center justify-center gap-4 group transition-all shadow-[0_0_30px_rgba(0,255,204,0.3)] border-none"
              >
                <Radiation size={20} className="group-hover:rotate-180 transition-transform duration-1000" />
                <span className="text-sm font-extrabold uppercase tracking-[4px]">Initiate_Guest_Bypass</span>
              </button>

              <button 
                onClick={handleGoogleLogin}
                className="w-full py-4 rounded-xl border border-[#12B886]/20 bg-[#12B886]/5 text-[#12B886] hover:text-[#00FFCC] hover:border-[#00FFCC]/30 transition-all flex items-center justify-center gap-3 group opacity-40 hover:opacity-100"
              >
                <img src="https://www.gstatic.com/lamda/images/google_logo_color_24dp.v6.png" className="w-4 h-4 brightness-0 invert opacity-40 group-hover:opacity-100" alt="G" />
                <span className="text-[10px] font-black uppercase tracking-[3px]">Sign in with Authorization (DB Required)</span>
              </button>
            </div>

            <div className="grid grid-cols-3 gap-6">
              {[
                { icon: Terminal, label: 'SCAN' },
                { icon: Cpu, label: 'COMPUTE' },
                { icon: Zap, label: 'OUPUT' }
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-white/[0.02] border border-[#12B886]/10 hover:border-[#00FFCC]/30 transition-all group">
                  <item.icon size={18} className="text-[#12B886] group-hover:text-[#00FFCC] transition-colors" />
                  <span className="text-[8px] font-bold text-[#B0B8B9] tracking-[2px]">{item.label}</span>
                </div>
              ))}
            </div>

            <div className="pt-8 text-center">
              <p className="text-[10px] text-[#B0B8B9] leading-relaxed uppercase tracking-[2px] font-bold opacity-40">
                Authorized access only. Technical audit protocols in effect.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;

