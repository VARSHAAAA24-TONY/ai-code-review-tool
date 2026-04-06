"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");

  const handleGoogleLogin = async () => {
    // Dynamically calculate the redirect URL to work across Local, Mobile, and Vercel
    const getURL = () => {
      let url =
        process?.env?.NEXT_PUBLIC_SITE_URL ?? // Set this for your production ID
        process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set on Vercel
        window.location.origin;
      
      // Add trailing slash and protocol if missing
      url = url.includes("http") ? url : `https://${url}`;
      return `${url}/auth/callback`;
    };

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: getURL(),
      },
    });

    if (error) {
      console.error("Authentication error:", error.message);
    }
  };

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background">
      {/* 3D Wireframe Globe Backdrop */}
      <div className="absolute inset-0 z-0 flex items-center justify-center opacity-30 select-none pointer-events-none">
        <motion.div
          animate={{
            rotateY: 360,
            rotateX: [0, 5, -5, 0],
          }}
          transition={{
            duration: 25, // Slower but smoother
            repeat: Infinity,
            ease: "linear",
          }}
          className="relative w-[400px] h-[400px] md:w-[600px] md:h-[600px] will-change-transform"
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Wireframe Circles - Reduced to 6 for performance */}
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute inset-0 border border-white/10 rounded-full"
              style={{
                transform: `rotateX(${i * 30}deg) rotateY(${i * 30}deg) translateZ(0)`,
              }}
            />
          ))}
          {/* Glowing Center */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 bg-accent/10 blur-[90px] rounded-full animate-pulse" />
          </div>
        </motion.div>
      </div>

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="z-10 w-full max-w-md px-8 py-12 text-center"
      >
        <h1 className="holographic-text text-5xl font-extrabold tracking-tighter mb-2 italic">
          THE VOID
        </h1>
        <p className="text-foreground/40 font-medium tracking-widest uppercase text-xs mb-12 mono-data">
          // AI PERSONAL OPERATING SYSTEM
        </p>

        <div className="space-y-8 mt-12">
          {/* Transparent Input with Glowing Bottom Border */}
          <div className="relative group">
             <input 
              type="text" 
              placeholder="ENTER SYSTEM ACCESS" 
              className="w-full bg-transparent border-0 border-b-2 border-white/10 py-4 px-2 text-foreground focus:outline-none focus:border-accent transition-colors mono-data text-sm tracking-widest placeholder:text-foreground/20"
              value={email}
              onChange={(e) => setEmail(e.target.value.toUpperCase())}
            />
            <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-accent transition-all duration-500 group-focus-within:w-full opacity-50 blur-[2px]" />
          </div>

          <button
            onClick={handleGoogleLogin}
            className="w-full relative group transition-all duration-300"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-accent/50 to-white/30 rounded-xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative flex items-center justify-center space-x-3 bg-white text-background font-bold py-4 rounded-xl transition hover:bg-opacity-90">
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <span className="uppercase tracking-[0.2em] text-xs">Login with Intelligence</span>
            </div>
          </button>
        </div>

        <div className="mt-16 text-[10px] text-foreground/20 uppercase tracking-[0.3em] font-medium animate-pulse">
          Awaiting Authentication...
        </div>
      </motion.div>
    </main>
  );
}
