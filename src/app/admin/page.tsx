"use client";

import { motion } from "framer-motion";
import { 
  Users, 
  Activity, 
  ShieldAlert, 
  MoreVertical, 
  UserPlus,
  ArrowUpRight,
  Database
} from "lucide-react";

const stats = [
  { name: "Total Intelligence Units", value: "1,284", change: "+12%", icon: Users },
  { name: "Active Probes", value: "482", change: "+5%", icon: Activity },
  { name: "System Integrity", value: "99.9%", change: "Stable", icon: ShieldAlert },
];

const users = [
  { id: "001", name: "ROOT_RAKESH", role: "Superuser", status: "Active", throughput: "12GB" },
  { id: "002", name: "AGENT_SMITH", role: "Researcher", status: "Active", throughput: "4GB" },
  { id: "003", name: "GHOST_USER", role: "Guest", status: "Offline", throughput: "0B" },
];

export default function AdminPage() {
  return (
    <div className="space-y-12">
      <header className="flex items-end justify-between">
        <div>
           <div className="flex items-center space-x-2 text-[10px] text-accent font-bold uppercase tracking-[0.4em] mb-2 mono-data">
              <ShieldAlert className="w-3 h-3" />
              <span>// High Command Access Only</span>
           </div>
           <h1 className="text-4xl font-black tracking-tighter holographic-text italic lowercase">
              Void Controller
           </h1>
           <p className="text-foreground/40 mt-1 font-medium tracking-wide">Command & Control oversight for system-wide intelligence.</p>
        </div>
        <button className="flex items-center space-x-2 px-6 py-4 bg-white text-background rounded-xl font-black text-xs uppercase tracking-[0.2em] hover:bg-opacity-90 transition-all">
           <UserPlus className="w-4 h-4" />
           <span>Authorize New Agent</span>
        </button>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-6 border-white/5 bg-[#0A0F1C]/40 flex flex-col justify-between h-32 hover:border-accent/20 transition-all"
          >
            <div className="flex justify-between items-start">
               <stat.icon className="w-5 h-5 text-foreground/40" />
               <span className={`text-[10px] font-bold uppercase tracking-widest ${stat.change === 'Stable' ? 'text-accent/60' : 'text-accent'}`}>{stat.change}</span>
            </div>
            <div>
               <p className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 mb-1">{stat.name}</p>
               <h3 className="text-2xl font-black italic tracking-tighter mono-data">{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      {/* User Management */}
      <section className="glass-card border-white/5 overflow-hidden">
         <div className="bg-[#0A0F1C]/60 backdrop-blur-3xl border-b border-white/5 p-6 flex justify-between items-center">
            <h3 className="text-xs font-bold uppercase tracking-[0.4em] text-foreground/40">Active Protocols</h3>
            <div className="flex items-center space-x-2">
               <Database className="w-3.5 h-3.5 text-accent" />
               <span className="text-[10px] font-bold uppercase tracking-widest text-accent">Mainframe Online</span>
            </div>
         </div>
         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead>
                  <tr className="border-b border-white/5 text-[10px] font-bold uppercase tracking-widest text-foreground/30">
                     <th className="px-6 py-4">Agent Identifier</th>
                     <th className="px-6 py-4">Clearance</th>
                     <th className="px-6 py-4">Connectivity</th>
                     <th className="px-6 py-4">Data Throughput</th>
                     <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
               </thead>
               <tbody className="text-xs font-bold tracking-wide">
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                       <td className="px-6 py-6">
                          <div className="flex items-center space-x-3">
                             <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent/20 to-transparent flex items-center justify-center border border-white/5">
                                <span className="text-[10px] text-accent">{user.id}</span>
                             </div>
                             <span className="group-hover:text-accent transition-colors italic">{user.name}</span>
                          </div>
                       </td>
                       <td className="px-6 py-6 text-foreground/60 uppercase tracking-tighter mono-data">{user.role}</td>
                       <td className="px-6 py-6">
                          <div className="flex items-center space-x-2">
                             <div className={`w-1.5 h-1.5 rounded-full ${user.status === 'Active' ? 'bg-accent animate-pulse shadow-[0_0_8px_rgba(204,255,0,0.5)]' : 'bg-foreground/20'}`} />
                             <span className={user.status === 'Active' ? 'text-accent' : 'text-foreground/20'}>{user.status}</span>
                          </div>
                       </td>
                       <td className="px-6 py-6 text-foreground/40 mono-data">{user.throughput}</td>
                       <td className="px-6 py-6 text-right">
                          <button className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                             <MoreVertical className="w-4 h-4 text-foreground/20" />
                          </button>
                       </td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </section>

      {/* Analytics Visualization Placeholder */}
      <div className="glass-card p-1 border-accent/20">
         <div className="bg-[#0A0F1C]/80 rounded-2xl p-8 border border-white/5 flex items-center justify-between">
            <div className="space-y-2">
               <h3 className="text-xl font-bold tracking-tighter italic">Intelligence Growth Matrix</h3>
               <p className="text-xs text-foreground/40 font-medium max-w-xs">Viewing system output and note synthesis efficiency over the last 24 cycles.</p>
            </div>
            <div className="h-24 flex items-end space-x-1">
               {[...Array(12)].map((_, i) => (
                 <motion.div 
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${Math.random() * 100}%` }}
                  transition={{ duration: 1, delay: i * 0.05 }}
                  className="w-4 bg-accent/40 rounded-t-sm hover:bg-accent transition-colors cursor-help"
                 />
               ))}
            </div>
         </div>
      </div>
    </div>
  );
}
