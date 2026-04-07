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
  Cpu,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import { supabase } from '../lib/supabase';

const Auth = () => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
      if (error) throw error;
    } catch (error) {
      console.error('Error logging in with Google:', error.message);
    }
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
    } catch (error) {
      console.error('Login failure:', error.message);
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
          
          <div className="mt-8 space-y-8">
            <form onSubmit={handleEmailLogin} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[9px] font-bold text-[#12B886] uppercase tracking-[2px] ml-1">Terminal_Identifier</label>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ENTER_EMAIL_UPLINK"
                    className="w-full bg-black/40 border border-[#12B886]/20 rounded-xl px-5 py-4 text-xs font-mono text-[#00FFCC] placeholder:text-[#12B886]/30 focus:border-[#00FFCC]/50 focus:outline-none transition-all"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-bold text-[#12B886] uppercase tracking-[2px] ml-1">Access_Certificate</label>
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-black/40 border border-[#12B886]/20 rounded-xl px-5 py-4 text-xs font-mono text-[#00FFCC] placeholder:text-[#12B886]/30 focus:border-[#00FFCC]/50 focus:outline-none transition-all"
                    required
                  />
                </div>
              </div>

              <button 
                type="submit"
                className="btn-modern btn-primary w-full py-5 rounded-2xl flex items-center justify-center gap-4 group transition-all shadow-[0_0_30px_rgba(0,255,204,0.2)] border-none"
              >
                <ShieldCheck size={20} className="group-hover:scale-110 transition-transform" />
                <span className="text-sm font-extrabold uppercase tracking-[4px]">Sign In to Terminal</span>
              </button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[#12B886]/10"></div></div>
              <div className="relative flex justify-center text-[8px] uppercase tracking-[3px] font-bold text-[#12B886]/40 bg-[#1A1D1E] px-4">Secondary_Uplink</div>
            </div>

            <button 
              onClick={handleGoogleLogin}
              className="w-full py-4 rounded-xl border border-[#12B886]/20 bg-[#12B886]/5 text-[#12B886] hover:text-[#00FFCC] hover:border-[#00FFCC]/30 transition-all flex items-center justify-center gap-3 group"
            >
              <img src="https://www.gstatic.com/lamda/images/google_logo_color_24dp.v6.png" className="w-4 h-4 brightness-0 invert opacity-40 group-hover:opacity-100" alt="G" />
              <span className="text-[10px] font-black uppercase tracking-[3px]">Authorize via Google</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
