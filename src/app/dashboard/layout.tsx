"use client";

import { Sidebar } from "@/components/navigation/sidebar";
import { motion, AnimatePresence } from "framer-motion";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex bg-[#0A0F1C] min-h-screen text-foreground overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto px-10 py-12 relative">
        {/* Universal Glow Effects */}
        <div className="fixed top-[-10%] right-[-10%] w-[500px] h-[500px] bg-accent/5 blur-[120px] rounded-full pointer-events-none -z-0" />
        <div className="fixed bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-white/5 blur-[120px] rounded-full pointer-events-none -z-0" />

        <AnimatePresence>
          <motion.div
            key="dashboard-content"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="z-10 relative"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
