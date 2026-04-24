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
    <div className="flex flex-col gap-4 h-full">
      <div className="panel flex-none relative overflow-hidden">
        <div className="absolute inset-0 bg-accent/5 pointer-events-none" />
        <div className="stat-label mb-4 flex items-center gap-2">
            <Sparkles size={12} className="text-accent" />
            Current Neural Vibe
        </div>
        <div className="text-2xl font-serif italic mb-4">{currentVibe.name}</div>
        
        <SystemStat label="Kernel Status" value={stats.kernel} progress={88} />
        <SystemStat label="Neural Sync" value={`${stats.neural}%`} progress={stats.neural} />
        <SystemStat label="Vibe Intensity" value="Adaptive" progress={currentVibe.intensity * 100} />
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <div className="panel !p-4 flex flex-col gap-1">
          <span className="stat-label">Device Link</span>
          <span className="stat-value text-accent flex items-center gap-2">
            <Smartphone size={14} /> Mobile.v3
          </span>
        </div>
        <div className="panel !p-4 flex flex-col gap-1">
          <span className="stat-label">Encryption</span>
          <span className="stat-value">E2EE Active</span>
        </div>
      </div>

      <div className="panel mt-auto !bg-accent">
        <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] uppercase tracking-widest text-white/70 font-bold">Deploy to Mobile</span>
            <Download size={16} className="text-white" />
        </div>
        <div className="flex flex-col gap-3">
           <button 
             onClick={() => alert("Dremi PWA is ready. Use 'Add to Home Screen' in your browser settings to install as an app.")}
             className="bg-white text-black text-center py-3 rounded-lg font-bold text-xs shadow-xl active:scale-95 transition-all"
           >
             INSTALL DREMI (PWA)
           </button>
           <p className="text-[9px] text-white/50 text-center leading-relaxed">
             Cross-platform compatible via web-standard PWA. 
             Supports offline cache and push notifications.
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
