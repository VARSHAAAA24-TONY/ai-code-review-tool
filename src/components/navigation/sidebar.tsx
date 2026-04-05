"use client";

import { motion } from "framer-motion";
import { 
  FileText, 
  Youtube, 
  Search, 
  LayoutDashboard, 
  Settings, 
  ShieldCheck,
  ChevronRight,
  LogIn,
  Briefcase
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { useState, useEffect, memo } from "react";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Notes", href: "/dashboard/notes", icon: FileText },
  { name: "YT Summarizer", href: "/dashboard/youtube", icon: Youtube },
  { name: "AI Job Search", href: "/dashboard/research", icon: Briefcase },
];

const adminItems = [
  { name: "Admin Portal", href: "/admin", icon: ShieldCheck },
];

export const Sidebar = memo(function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <aside className="w-64 h-screen border-r border-white/5 bg-[#0A0F1C]/80 backdrop-blur-3xl sticky top-0 flex flex-col p-6">
      <div className="flex items-center space-x-3 mb-12">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-white/50 accent-glow flex items-center justify-center">
          <div className="w-4 h-4 bg-background rounded-sm rotate-45" />
        </div>
        <span className="holographic-text font-bold tracking-tighter text-xl italic">VOID OS</span>
      </div>

      <nav className="flex-1 space-y-2">
        <div className="text-[10px] text-foreground/30 uppercase tracking-[0.2em] font-bold mb-4 px-2">
          Systems
        </div>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.name} href={item.href}>
              <motion.div
                whileHover={{ x: 4 }}
                className={cn(
                  "group flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 relative overflow-hidden",
                  isActive ? "bg-accent/10 border border-accent/20" : "hover:bg-white/5"
                )}
              >
                <div className="flex items-center space-x-3 z-10">
                  <item.icon className={cn(
                    "w-5 h-5 transition-colors",
                    isActive ? "text-accent" : "text-foreground/40 group-hover:text-foreground"
                  )} />
                  <span className={cn(
                    "text-sm font-medium tracking-wide transition-colors",
                    isActive ? "text-accent" : "text-foreground/60 group-hover:text-foreground"
                  )}>
                    {item.name}
                  </span>
                </div>
                {isActive && (
                  <motion.div 
                    layoutId="active-nav"
                    className="absolute inset-0 bg-accent/5 -z-0"
                  />
                )}
                {isActive && <ChevronRight className="w-4 h-4 text-accent z-10" />}
              </motion.div>
            </Link>
          );
        })}

        <div className="pt-8 mb-4">
          <div className="text-[10px] text-foreground/30 uppercase tracking-[0.2em] font-bold mb-4 px-2">
            Control
          </div>
          {adminItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.name} href={item.href}>
                <motion.div
                  whileHover={{ x: 4 }}
                  className={cn(
                    "group flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300",
                    isActive ? "bg-white/10 border border-white/20" : "hover:bg-white/5"
                  )}
                >
                  <div className="flex items-center space-x-3">
                    <item.icon className={cn(
                      "w-5 h-5 transition-colors",
                      isActive ? "text-white" : "text-foreground/40 group-hover:text-foreground"
                    )} />
                    <span className={cn(
                      "text-sm font-medium tracking-wide transition-colors",
                      isActive ? "text-white" : "text-foreground/60 group-hover:text-foreground"
                    )}>
                      {item.name}
                    </span>
                  </div>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="mt-auto border-t border-white/5 pt-6 space-y-4">
        <div className="flex items-center space-x-3 px-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-accent/20 to-white/10 border border-white/10 p-[2px]">
             <div className="w-full h-full rounded-full bg-background flex items-center justify-center overflow-hidden">
                {user?.user_metadata?.avatar_url ? (
                  <img src={user.user_metadata.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-[10px] font-bold holographic-text">RX</span>
                )}
             </div>
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-xs font-bold text-foreground truncate uppercase">{user?.user_metadata?.full_name || "AGENT"}</p>
            <p className="text-[10px] text-foreground/40 font-medium truncate mono-data uppercase tracking-tighter">{user?.email?.split('@')[0] || "root"}@void_os</p>
          </div>
          <button className="p-2 hover:bg-white/5 rounded-lg transition-colors">
            <Settings className="w-4 h-4 text-foreground/40" />
          </button>
        </div>

        <button 
          onClick={handleLogout}
          className="w-full group flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all duration-300"
        >
          <LogIn className="w-5 h-5 text-foreground/40 group-hover:text-red-500 rotate-180" />
          <span className="text-sm font-medium tracking-wide text-foreground/60 group-hover:text-red-500">
            De-authorize
          </span>
        </button>
      </div>
    </aside>
  );
});
