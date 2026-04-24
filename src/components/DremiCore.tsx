import { motion } from "motion/react";
import { Mic, MicOff } from "lucide-react";
import { useVibe } from "../context/VibeContext";

export default function DremiCore({ isListening, onToggleListen }: { isListening: boolean, onToggleListen: () => void }) {
  const { currentVibe } = useVibe();

  return (
    <div className="flex flex-col items-center justify-center h-full gap-12">
      {/* Central Hub Orb */}
      <div className="relative group">
        <div className="w-[300px] h-[300px] rounded-full border border-border flex items-center justify-center relative bg-gradient-to-b from-accent-glow to-transparent transition-all duration-1000">
          <motion.div 
            animate={{ 
              scale: isListening ? [1, 1.05, 1] : 1,
              boxShadow: isListening 
                ? [
                    `0 0 40px ${currentVibe.color}33`, 
                    `0 0 100px ${currentVibe.color}80`, 
                    `0 0 40px ${currentVibe.color}33`
                  ] 
                : `0 0 80px ${currentVibe.color}33`
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            style={{ backgroundImage: `radial-gradient(circle at 30% 30%, ${currentVibe.color} 0%, #000 100%)` }}
            className="w-[200px] h-[200px] rounded-full relative overflow-hidden transition-all duration-1000"
          >
             {/* Dynamic Light Reflection */}
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.1)_0%,transparent_70%)]" />
             
             {/* Pulse effect if listening */}
             {isListening && (
               <motion.div 
                 animate={{ opacity: [0, 0.2, 0] }}
                 transition={{ repeat: Infinity, duration: 2 }}
                 className="absolute inset-0 bg-white"
               />
             )}
          </motion.div>

          {/* Vibe Label */}
          <div className="absolute -bottom-12 font-serif italic text-xl text-white/80 tracking-wide text-center w-full">
            {isListening ? "Listening for intent..." : "Core Latent"}
          </div>
        </div>
      </div>

      {/* Voice Activation Button */}
      <div className="flex flex-col items-center gap-6 mt-8">
        <button 
          onClick={onToggleListen}
          className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-500 ${
            isListening 
            ? 'bg-accent/20 border border-accent shadow-[0_0_30px_rgba(99,102,241,0.3)]' 
            : 'bg-white/5 border border-white/10 hover:bg-white/10'
          }`}
        >
          {isListening ? (
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 1 }}
              className="text-accent"
            >
              <Mic size={32} strokeWidth={1.5} />
            </motion.div>
          ) : (
            <MicOff size={32} strokeWidth={1.5} className="text-text-muted" />
          )}
        </button>
        <div className="flex flex-col items-center gap-1">
           <span className="stat-label">Neural Interface</span>
           <p className="text-[10px] uppercase tracking-[0.3em] text-accent/70 font-mono animate-pulse">
            {isListening ? "SYNC ACTIVE" : "STANDBY"}
          </p>
        </div>
      </div>
    </div>
  );
}
