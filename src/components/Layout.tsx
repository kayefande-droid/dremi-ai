import { motion } from "motion/react";
import { Mic, Terminal, LayoutDashboard, MessageSquare, Zap, Settings } from "lucide-react";
import React, { useState, useEffect } from "react";

export default function Layout({ children, activeTab, onTabChange }: { 
  children: React.ReactNode, 
  activeTab: string, 
  onTabChange: (tab: string) => void 
}) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col h-screen bg-bg text-white p-4 font-sans select-none">
      {/* Top Status Bar with Branding */}
      <div className="flex justify-between items-start mb-6 px-2">
        <div className="branding">
          Dremi<span>.ai</span>
        </div>
        <div className="flex flex-col items-end pt-2">
          <span className="stat-label">System Time</span>
          <span className="stat-value">{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden relative">
        {children}
      </main>

      {/* Futuristic Bottom Navigation */}
      <nav className="mt-6 panel !p-2 flex justify-around items-center !flex-row border-border/50">
        <NavButton 
          active={activeTab === 'core'} 
          onClick={() => onTabChange('core')} 
          icon={<Zap size={20} />} 
          label="Core" 
        />
        <NavButton 
          active={activeTab === 'chat'} 
          onClick={() => onTabChange('chat')} 
          icon={<MessageSquare size={20} />} 
          label="Chat" 
        />
         <NavButton 
          active={activeTab === 'vibe'} 
          onClick={() => onTabChange('vibe')} 
          icon={<Terminal size={20} />} 
          label="Vibe" 
        />
        <NavButton 
          active={activeTab === 'sys'} 
          onClick={() => onTabChange('sys')} 
          icon={<LayoutDashboard size={20} />} 
          label="System" 
        />
      </nav>
    </div>
  );
}

function NavButton({ active, icon, label, onClick }: { 
  active: boolean, 
  icon: React.ReactNode, 
  label: string, 
  onClick: () => void 
}) {
  return (
    <button 
      onClick={onClick}
      className={`relative flex flex-col items-center gap-1 p-2 transition-all duration-300 ${active ? 'text-accent' : 'text-text-muted'}`}
    >
      {active && (
        <motion.div 
          layoutId="nav-active"
          className="absolute inset-0 bg-accent/10 rounded-[14px]"
        />
      )}
      {icon}
      <span className="text-[9px] uppercase tracking-widest font-medium">{label}</span>
    </button>
  );
}
