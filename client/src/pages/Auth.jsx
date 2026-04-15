import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, ShieldCheck } from 'lucide-react';
import { auth } from '../lib/firebase';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import toast from 'react-hot-toast';

const Auth = () => {
  const [loading, setLoading] = React.useState(false);

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Google Auth Error:', error.message);
      toast.error('Google Auth Failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = () => {
    localStorage.setItem('sb-guest-session', 'true');
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-[#1A1D1E] flex items-center justify-center relative overflow-hidden font-sans text-[#B0B8B9]">
      
      {/* Grid background */}
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.05] pointer-events-none bg-[radial-gradient(#12B886_1px,transparent_1px)] bg-[size:40px_40px]" />

      {/* Glow blobs */}
      <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-[#00FFCC]/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] bg-[#12B886]/10 blur-[120px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="z-10 w-full max-w-md px-6"
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-12">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-8 p-6 bg-[#00FFCC]/10 border border-[#00FFCC]/30 rounded-3xl shadow-[0_0_30px_rgba(0,255,204,0.1)] relative group"
          >
            <div className="w-20 h-20 bg-black/40 flex items-center justify-center rounded-2xl border border-[#00FFCC]/20 group-hover:border-[#00FFCC]/50 transition-all duration-500">
              <Cpu className="w-12 h-12 text-[#00FFCC]" strokeWidth={1} />
            </div>
            <div className="absolute inset-0 border border-[#00FFCC]/20 rounded-3xl animate-ping opacity-20" />
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

        {/* Card */}
        <div className="bg-[#1A1D1E]/40 backdrop-blur-2xl border border-[#00FFCC]/20 rounded-[32px] p-10 shadow-2xl relative">
          
          {/* Status dots */}
          <div className="absolute top-6 left-8 flex gap-1.5">
            <div className="w-2 h-2 rounded-full bg-[#00FFCC] animate-pulse" />
            <div className="w-2 h-2 rounded-full bg-[#12B886]/30" />
            <div className="w-2 h-2 rounded-full bg-[#12B886]/30" />
          </div>

          <div className="mt-4 space-y-4">
            <p className="text-center text-[10px] font-bold uppercase tracking-[3px] text-[#12B886]/60 mb-6">
              Select Authentication Protocol
            </p>

            {/* Google Sign In */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full py-5 rounded-2xl flex items-center justify-center gap-4 group transition-all
                bg-gradient-to-r from-[#00FFCC]/20 to-[#12B886]/20 
                border border-[#00FFCC]/40 hover:border-[#00FFCC]/80
                shadow-[0_0_20px_rgba(0,255,204,0.15)] hover:shadow-[0_0_30px_rgba(0,255,204,0.3)]
                disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-[#00FFCC]/30 border-t-[#00FFCC] rounded-full animate-spin" />
              ) : (
                <img
                  src="https://www.gstatic.com/lamda/images/google_logo_color_24dp.v6.png"
                  className="w-5 h-5 group-hover:scale-110 transition-transform"
                  alt="Google"
                />
              )}
              <span className="text-sm font-extrabold uppercase tracking-[3px] text-white">
                {loading ? 'Connecting...' : 'Continue with Google'}
              </span>
            </motion.button>

            {/* Divider */}
            <div className="relative my-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#12B886]/10" />
              </div>
              <div className="relative flex justify-center">
                <span className="text-[8px] uppercase tracking-[3px] font-bold text-[#12B886]/30 bg-[#1A1D1E]/80 px-4 py-1 rounded-full">
                  or
                </span>
              </div>
            </div>

            {/* Guest Mode */}
            <button
              type="button"
              onClick={handleGuestLogin}
              className="w-full py-3 rounded-xl border border-[#B0B8B9]/10 text-[#B0B8B9]/50 
                hover:text-white hover:border-[#B0B8B9]/30 transition-all flex items-center 
                justify-center gap-2 text-[9px] font-black uppercase tracking-[2px]"
            >
              Continue as Guest (Limited Access)
            </button>
          </div>

          {/* Footer note */}
          <p className="text-center text-[8px] text-[#12B886]/30 uppercase tracking-[2px] mt-6">
            Secured by Firebase · Data encrypted in transit
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
