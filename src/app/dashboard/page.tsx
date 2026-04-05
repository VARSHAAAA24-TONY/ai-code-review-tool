"use client";

import { motion } from "framer-motion";
import { 
  FileText, 
  Youtube, 
  Search, 
  Plus, 
  ArrowRight,
  TrendingUp,
  Clock,
  Zap
} from "lucide-react";
import Link from "next/link";

const quickActions = [
  { name: "New Note", icon: FileText, href: "/dashboard/notes", color: "text-blue-400" },
  { name: "Summarize YT", icon: Youtube, href: "/dashboard/youtube", color: "text-red-400" },
  { name: "Start Research", icon: Search, href: "/dashboard/research", color: "text-accent" },
];

const recentActivity = [
  { id: 1, type: "note", title: "Project Phoenix Roadmap", time: "2 hours ago" },
  { id: 2, type: "youtube", title: "Understanding Quantum Computing", time: "5 hours ago" },
  { id: 3, type: "research", title: "AI Trends for 2026", time: "Yesterday" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-12">
      {/* Header */}
      <header className="flex items-end justify-between">
        <div>
          <h2 className="text-[10px] text-accent font-bold uppercase tracking-[0.4em] mb-2 mono-data animate-pulse">
            // System Status: Operational
          </h2>
          <h1 className="text-4xl font-bold tracking-tighter">Welcome back, Agent.</h1>
          <p className="text-foreground/40 mt-1 font-medium tracking-wide">Your holographic workspace is ready.</p>
        </div>
        <div className="flex space-x-2">
          {/* Status Indicators */}
          <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          <div className="w-1.5 h-1.5 rounded-full bg-accent/40" />
          <div className="w-1.5 h-1.5 rounded-full bg-accent/20" />
        </div>
      </header>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {quickActions.map((action, i) => (
            <Link key={action.name} href={action.href}>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="glass-card group p-6 cursor-pointer hover:border-accent/30 transition-all duration-300 h-full flex flex-col justify-between"
              >
                <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mb-6`}>
                  <action.icon className={`w-5 h-5 ${action.color}`} />
                </div>
                <div>
                  <h3 className="font-bold text-sm tracking-wide mb-1 opacity-80 group-hover:opacity-100">{action.name}</h3>
                  <div className="flex items-center text-[10px] font-bold text-foreground/30 uppercase tracking-widest group-hover:text-accent transition-colors">
                    Initialize <ArrowRight className="w-3 h-3 ml-1" />
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>

        {/* System Stats Widget */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-border-gradient rounded-3xl p-[1px] bg-gradient-to-br from-accent/20 to-transparent"
        >
          <div className="bg-[#0A0F1C]/80 backdrop-blur-2xl rounded-3xl p-6 h-full border border-white/5">
             <div className="flex items-center justify-between mb-8">
               <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/40">Core Performance</span>
               <TrendingUp className="w-4 h-4 text-accent" />
             </div>
             <div className="space-y-6">
               <div className="space-y-2">
                 <div className="flex justify-between text-xs font-bold text-foreground/60 uppercase tracking-tighter">
                   <span>Notes Capacity</span>
                   <span className="text-accent">72%</span>
                 </div>
                 <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                   <div className="w-[72%] h-full bg-accent shadow-[0_0_8px_rgba(204,255,0,0.5)]" />
                 </div>
               </div>
               <div className="space-y-2">
                 <div className="flex justify-between text-xs font-bold text-foreground/60 uppercase tracking-tighter">
                   <span>AI Load</span>
                   <span className="text-white">Active</span>
                 </div>
                 <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                   <div className="w-[45%] h-full bg-white opacity-40" />
                 </div>
               </div>
             </div>
             <div className="mt-8 p-4 rounded-xl bg-accent/5 border border-accent/10 flex items-center space-x-3">
                <Zap className="w-4 h-4 text-accent" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-accent">Hyper-drive enabled</span>
             </div>
          </div>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <section>
        <div className="flex items-center justify-between mb-6 px-1">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-foreground/40" />
            <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-foreground/40">Temporal Activity</h3>
          </div>
          <button className="text-[10px] font-bold uppercase tracking-widest text-accent hover:opacity-80 transition-opacity">View Full Terminal</button>
        </div>
        <div className="space-y-3">
          {recentActivity.map((activity, i) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + (i * 0.1) }}
              whileHover={{ x: 5, backgroundColor: "rgba(255, 255, 255, 0.05)" }}
              className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-white/[0.02] backdrop-blur-sm cursor-pointer transition-all duration-200"
            >
              <div className="flex items-center space-x-4">
                 <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                    {activity.type === 'note' && <FileText className="w-4 h-4 text-blue-400" />}
                    {activity.type === 'youtube' && <Youtube className="w-4 h-4 text-red-400" />}
                    {activity.type === 'research' && <Search className="w-4 h-4 text-accent" />}
                 </div>
                 <div>
                   <h4 className="text-sm font-bold tracking-wide">{activity.title}</h4>
                   <p className="text-[10px] text-foreground/30 uppercase mono-data tracking-tighter mt-0.5">{activity.time}</p>
                 </div>
              </div>
              <ArrowRight className="w-4 h-4 text-foreground/20" />
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
