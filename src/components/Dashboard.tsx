import { motion } from "motion/react";
import { Battery, Wifi, Database, Search, HardDrive, Thermometer, Cpu, Sparkles, Smartphone, Download } from "lucide-react";
import { useState, useEffect } from "react";
import { useVibe } from "../context/VibeContext";
import { speak } from "../services/geminiService";

export default function Dashboard() {
  const { currentVibe } = useVibe();
  const [stats, setStats] = useState({
    kernel: 'MASTER_SYN',
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
    <div className="flex flex-col gap-6 h-full overflow-y-auto scrollbar-hide pb-20 px-2">
      {/* Editorial Header */}
      <div className="pt-8 pb-4">
        <span className="text-[10px] uppercase tracking-[0.5em] text-accent font-black mb-2 block">Central Neural Link</span>
        <h2 className="text-5xl font-serif leading-none text-white tracking-tighter">
          {currentVibe.name} <br/> 
          <span className="italic text-accent font-light opacity-80">Protocol</span>
        </h2>
      </div>

      {/* Hero Visualizer */}
      <div className="panel flex-none p-0 overflow-hidden relative h-52 group rounded-3xl border-accent/20">
        <motion.div 
            animate={{ 
                scale: [1, 1.05, 1],
                opacity: [0.15, 0.25, 0.15]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0"
            style={{ 
                background: `radial-gradient(circle at 50% 50%, ${currentVibe.color} 0%, transparent 70%)` 
            }}
        />
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
        
        {/* Decorative Grid */}
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(rgba(212, 175, 55, 0.1) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

        <div className="relative h-full flex flex-col justify-between p-6">
            <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse shadow-[0_0_8px_var(--color-accent)]" />
                    <span className="text-[8px] uppercase tracking-[0.3em] font-black text-white/50">Core.v42_synapse</span>
                </div>
                <div className="text-[8px] font-mono text-accent/60">NODE_ID: DARK_STAR_9</div>
            </div>
            
            <div className="flex items-end justify-between">
                <div>
                    <div className="text-[10px] text-text-muted font-mono mb-1">SYNAPTIC_WAVEFORM</div>
                    <div className="flex gap-1 h-8 items-end">
                        {Array.from({ length: 24 }).map((_, i) => (
                            <motion.div 
                                key={i}
                                animate={{ height: [4, 12 + Math.random() * 20, 4] }}
                                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.05 }}
                                className="w-1 bg-accent/40 rounded-full"
                            />
                        ))}
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-[2rem] font-serif italic text-white leading-none">{stats.neural}%</div>
                    <div className="text-[8px] uppercase tracking-widest text-text-muted">Stability Factor</div>
                </div>
            </div>
        </div>
      </div>

      {/* Main Grid Components */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="panel flex flex-col gap-6 border-white/5">
            <div className="flex items-center justify-between">
                <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-text-muted">Telemetry</span>
                <Cpu size={14} className="text-accent/40" />
            </div>
            
            <div className="space-y-4">
                <SystemStat label="Heuristic Alignment" value="OPTIMAL" progress={92} />
                <SystemStat label="Energy Consumption" value="0.4mW" progress={12} />
                <SystemStat label="Neural Density" value="HIGH" progress={84} />
            </div>
        </div>

        <div className="flex flex-col gap-4">
            <div className="panel flex-1 bg-accent/5 border-accent/20 flex flex-col justify-between p-5 min-h-[140px]">
                <div className="flex justify-between items-start">
                    <Sparkles size={16} className="text-accent" />
                    <div className="bg-accent/20 text-accent text-[8px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest">Premium</div>
                </div>
                <div>
                    <h3 className="text-lg font-serif italic text-white">Vibe Architecture</h3>
                    <p className="text-[9px] text-text-muted leading-relaxed mt-1">
                        Synthesizing high-fidelity aesthetic protocols for your interface.
                    </p>
                </div>
            </div>

            <button 
                onClick={() => speak("Initializing PWA link. Please check your browser menu for full integration options.")}
                className="panel !p-4 bg-white/5 hover:bg-white/10 transition-all border-white/10 flex items-center justify-between group"
            >
                <div className="flex flex-col items-start gap-1">
                    <span className="text-[8px] uppercase tracking-widest text-accent font-black">Mobile Integration</span>
                    <span className="text-xs text-white">Initialize Link</span>
                </div>
                <Download size={18} className="text-text-muted group-hover:text-accent transition-colors" />
            </button>
        </div>
      </div>

      {/* Bottom Info Bar */}
      <div className="mt-auto px-2 flex justify-between items-center text-[7px] uppercase tracking-[0.3em] font-black text-white/20">
          <span>Dremi Ecosystem © 2026</span>
          <span className="text-accent/40">Secure Connection: TLS 1.3</span>
      </div>
    </div>
  );
}

function SystemStat({ label, value, progress }: { label: string, value: string, progress: number }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-end">
        <span className="text-[8px] uppercase tracking-widest text-white/40">{label}</span>
        <span className="text-[10px] font-mono text-white/80">{value}</span>
      </div>
      <div className="h-[2px] bg-white/5 w-full rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          className="h-full bg-accent shadow-[0_0_8px_var(--color-accent)]"
        />
      </div>
    </div>
  );
}
