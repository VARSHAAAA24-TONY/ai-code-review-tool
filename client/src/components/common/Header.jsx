import React, { useEffect, useState } from 'react';
import { Search, Bell, User, Sparkles, ShieldCheck, LogOut } from 'lucide-react';
import { auth } from '../../lib/firebase';
import { signOut, onAuthStateChanged } from 'firebase/auth';

const Header = () => {
  const [user, setUser] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  const handleLogout = async () => {
    localStorage.removeItem('sb-guest-session');
    await signOut(auth);
    window.location.href = '/auth';
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });

    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => {
      unsubscribe();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header className={`h-24 sticky top-0 z-40 px-10 flex items-center justify-between transition-all duration-500 bg-[#1A1D1E]/80 backdrop-blur-xl border-b border-[#12B886]/10 ${scrolled ? 'h-20 shadow-2xl' : ''}`}>
      <div className="flex items-center gap-12 flex-1">
        <div className="relative max-w-xl w-full group relative z-10">
          <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
            <Search className="text-[#00FFCC] opacity-40 group-focus-within:opacity-100 group-focus-within:scale-110 transition-all duration-300" size={18} />
          </div>
          <input 
            type="text" 
            placeholder="SCAN_REPOSITORY // SEARCH_AUDITS..." 
            className="w-full bg-[#1A1D1E]/40 border border-[#12B886]/20 rounded-2xl pl-16 pr-12 py-4 text-[11px] font-bold text-[#00FFCC] focus:outline-none focus:border-[#00FFCC]/50 transition-all placeholder:text-[#12B886]/40 uppercase tracking-widest"
          />
          <div className="absolute inset-y-0 right-5 flex items-center gap-2">
            <div className="hidden sm:flex h-6 items-center gap-2 border border-[#12B886]/20 bg-[#00FFCC]/5 px-3 rounded-lg text-[9px] font-bold text-[#12B886] uppercase">
              <span className="text-[10px] text-[#00FFCC]">⌘</span>K
            </div>
          </div>
        </div>
        
        <div className="hidden lg:flex items-center gap-4 px-6 py-2.5 bg-[#00FFCC]/5 border border-[#00FFCC]/10 rounded-full">
          <Sparkles className="text-[#00FFCC] animate-pulse" size={14} />
          <span className="text-[10px] font-bold text-[#00FFCC] uppercase tracking-widest">CYBER_CORE_ACTIVE</span>
        </div>
      </div>

      <div className="flex items-center gap-8">
        <div className="flex items-center gap-4 relative z-10">
          <button className="relative p-4 text-[#B0B8B9] hover:text-[#00FFCC] hover:bg-[#00FFCC]/5 transition-all border border-transparent hover:border-[#00FFCC]/10 rounded-2xl">
            <Bell size={20} />
            <span className="absolute top-4 right-4 w-2 h-2 bg-[#00FFCC] rounded-full shadow-[0_0_10px_#00FFCC]"></span>
          </button>
          
          <button className="p-4 text-[#B0B8B9] hover:text-[#12B886] hover:bg-[#12B886]/5 transition-all border border-transparent hover:border-[#12B886]/10 rounded-2xl hidden sm:flex">
            <ShieldCheck size={20} />
          </button>
        </div>

        <div className="h-10 w-px bg-[#12B886]/10 mx-2"></div>

        <div className="flex items-center gap-6 pl-4 group cursor-pointer relative z-10">
          <div className="text-right hidden md:block space-y-1">
            <p className="text-[12px] font-bold text-white leading-none tracking-tight group-hover:text-[#00FFCC] transition-colors">
              {user?.displayName || user?.email?.split('@')[0] || 'GUEST_USER'}
            </p>
            <div className="flex items-center justify-end gap-2">
               <span className="w-1.5 h-1.5 rounded-full bg-[#12B886]"></span>
               <p className="text-[9px] text-[#B0B8B9] font-bold uppercase tracking-wider opacity-60">AUTHORIZED_AGENT</p>
            </div>
          </div>
          <div className="relative">
            <div className="w-14 h-14 bg-[#1A1D1E] border border-[#12B886]/20 rounded-2xl flex items-center justify-center group-hover:border-[#00FFCC] transition-all duration-500 overflow-hidden shadow-xl">
               {user?.photoURL ? (
                 <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
               ) : (
                 <User className="text-[#B0B8B9] group-hover:text-[#00FFCC] transition-colors" size={24} />
               )}
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#00FFCC] border-2 border-[#1A1D1E] rounded-full"></div>
          </div>
        </div>

        <button 
          onClick={handleLogout}
          title="Sign Out/Switch User"
          className="p-4 text-[#B0B8B9] hover:text-[#FF3366] hover:bg-[#FF3366]/5 transition-all border border-transparent hover:border-[#FF3366]/10 rounded-2xl flex"
        >
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
};

export default Header;



