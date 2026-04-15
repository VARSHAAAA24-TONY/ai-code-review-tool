import React, { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { auth } from './lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import Auth from './pages/Auth';
import DashboardLayout from './components/layout/DashboardLayout';
import './index.css';

import { Toaster } from 'react-hot-toast';

// Lazy load only sub-pages, keep layout/auth immediate for debugging
const Dashboard = lazy(() => import('./pages/Dashboard'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const Review = lazy(() => import('./pages/Review'));
const History = lazy(() => import('./pages/History'));

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const guestSession = localStorage.getItem('sb-guest-session');

    if (guestSession) {
      setSession({ uid: 'guest-node-01', email: 'guest@forensic.core' });
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!localStorage.getItem('sb-guest-session')) {
        setSession(user || null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-[#121212] text-white flex flex-col items-center justify-center p-12 text-center">
        <div className="w-24 h-24 bg-[#FFD700]/10 flex items-center justify-center border-2 border-[#FFD700]/30 mb-10 shadow-[0_0_30px_rgba(255,215,0,0.1)] group" style={{ clipPath: 'polygon(20% 0%, 80% 0%, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0% 80%, 0% 20%)' }}>
           <div className="w-12 h-12 bg-[#FFD700] animate-pulse" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}></div>
        </div>
        <h1 className="text-5xl font-black text-white mb-4 tracking-tighter uppercase tracking-[6px] italic">System_Interrupt</h1>
        <div className="modern-card p-10 bg-[#FFD700]/5 border-2 border-[#FFD700]/10 text-[10px] font-black text-[#FFD700] max-w-xl mb-12 uppercase tracking-[4px] leading-loose italic">
          CRITICAL_HANDSHAKE_EXCEPTION: {error}
        </div>
        <button 
          onClick={() => window.location.reload()} 
          className="btn-modern px-12 py-5 bg-[#FFD700] text-black text-[10px] uppercase font-black tracking-[4px] shadow-2xl hover:scale-105 transition-all border-none"
        >
          RE_INITIALIZE_SEQUENCE
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#121212] text-white font-mono">
        <div className="w-48 h-1.5 bg-[#71797E]/20 relative overflow-hidden mb-12 border border-[#71797E]/10">
          <div className="absolute inset-0 bg-[#DFFF00] w-1/4 animate-[loading_1s_infinite_linear] shadow-[0_0_20px_#DFFF00]"></div>
        </div>
        <div className="flex flex-col items-center gap-3">
          <p className="text-[10px] text-[#DFFF00] font-black uppercase tracking-[8px] animate-pulse italic">Handshaking_Protocol...</p>
          <p className="text-[8px] text-[#71797E] font-black uppercase tracking-[4px] italic opacity-40">Synchronizing_Forensic_Nodes</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Toaster position="top-center" toastOptions={{
        style: {
          background: '#121212',
          color: '#DFFF00',
          border: '2px solid rgba(113, 121, 126, 0.3)',
          borderRadius: '0px',
          fontSize: '10px',
          fontWeight: '900',
          textTransform: 'uppercase',
          letterSpacing: '0.2em',
          padding: '16px 24px',
          fontFamily: 'IBM Plex Mono, monospace',
          boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
        }
      }} />
      <Suspense fallback={
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#121212] text-white">
           <div className="w-48 h-1 bg-[#71797E]/30 relative overflow-hidden mb-10">
            <div className="absolute inset-0 bg-[#DFFF00] w-1/2 animate-[loading_1.5s_infinite_linear] shadow-[0_0_15px_#DFFF00]"></div>
          </div>
          <p className="text-[10px] text-[#DFFF00] font-black uppercase tracking-[8px] animate-pulse italic">Decrypting_Module...</p>
        </div>
      }>
        <Routes>
          <Route path="/auth" element={!session ? <Auth /> : <Navigate to="/" />} />
          
          <Route element={session ? <DashboardLayout /> : <Navigate to="/auth" />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/review" element={<Review />} />
            <Route path="/review/:id" element={<Review />} />
            <Route path="/history" element={<History />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Route>
          
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;

