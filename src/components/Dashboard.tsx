import { motion } from "motion/react";
import { Battery, Wifi, Database, Search, HardDrive, Thermometer, Cpu, Sparkles, Smartphone, Download } from "lucide-react";
import { useState, useEffect } from "react";
import { useVibe } from "../context/VibeContext";

export default function Dashboard() {
  const { currentVibe } = useVibe();
  const [stats, setStats] = useState({
    kernel: 'Optimal',
    vibeValue: currentVibe.name,
    neural: 99.4,
    battery: 100,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        neural: parseFloat((99 + Math.random()).toFixed(1))
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col gap-4 h-full overflow-y-auto scrollbar-hide pb-20">
      {/* Dynamic Vibe Visualization */}
      <div className="panel flex-none p-0 overflow-hidden relative h-40 group">
        <motion.div 
            animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, 0]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 opacity-30"
            style={{ 
                background: `conic-gradient(from 180deg at 50% 50%, ${currentVibe.color} 0deg, transparent 180deg, ${currentVibe.color} 360deg)` 
            }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/40 to-transparent" />
        <div className="relative h-full flex flex-col justify-end p-6">
            <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-accent animate-ping" />
                <span className="stat-label !mb-0 font-bold uppercase tracking-widest text-[9px]">Neural Pulse Active</span>
            </div>
            <h2 className="text-3xl font-serif italic text-white">{currentVibe.name}</h2>
            <div className="text-[10px] text-text-muted font-mono mt-1 opacity-70">
                Wavelength: 642nm | Affinity: {stats.neural}%
            </div>
        </div>
      </div>

      <div className="panel flex-none relative">
        <div className="stat-label mb-4 flex items-center gap-2">
            <Cpu size={12} className="text-accent" />
            System Metries
        </div>
        
        <SystemStat label="Kernel Status" value={stats.kernel} progress={88} />
        <SystemStat label="Neural Sync" value={`${stats.neural}%`} progress={stats.neural} />
        <SystemStat label="Vibe Intensity" value="Adaptive" progress={currentVibe.intensity * 100} />
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <div className="panel !p-4 flex flex-col gap-1 hover:border-accent/40 transition-colors cursor-pointer">
          <span className="stat-label">Device Link</span>
          <span className="stat-value text-accent flex items-center gap-2">
            <Smartphone size={14} /> Mobile.v3
          </span>
        </div>
        <div className="panel !p-4 flex flex-col gap-1 hover:border-accent/40 transition-colors cursor-pointer">
          <span className="stat-label">Encryption</span>
          <span className="stat-value text-white/90">AES-256 GCM</span>
        </div>
      </div>

      <div className="panel mt-4 !bg-accent/10 border-accent/20">
        <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] uppercase tracking-widest text-accent font-black">PWA Infrastructure</span>
            <Download size={16} className="text-accent ring-4 ring-accent/10 rounded-full" />
        </div>
        <div className="flex flex-col gap-3">
           <button 
             onClick={() => window.alert("To install Dremi:\n1. Open browser menu\n2. Tap 'Add to Home Screen'\n3. Launch from your apps list for full-screen JARVIS experience.")}
             className="bg-accent text-white text-center py-4 rounded-xl font-bold text-xs shadow-xl shadow-accent/20 active:scale-95 transition-all"
           >
             INSTALL DREMI CORE
           </button>
           <p className="text-[9px] text-text-muted text-center leading-relaxed px-4">
             Unlock full-screen mode, biometrics, and background protocols. 
             Optimized for low-latency neural processing.
           </p>
        </div>
      </div>
    </div>
  );
}

function SystemStat({ label, value, progress }: { label: string, value: string, progress: number }) {
  return (
    <div className="mb-5 last:mb-0">
      <div className="flex justify-between items-end mb-1">
        <span className="stat-label !mb-0">{label}</span>
        <span className="stat-value">{value}</span>
      </div>
      <div className="progress-bg">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          className="progress-fill shadow-[0_0_10px_rgba(99,102,241,0.3)]"
        />
      </div>
    </div>
  );
}
