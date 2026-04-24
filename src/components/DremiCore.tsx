import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Mic, MicOff } from "lucide-react";
import { useVibe } from "../context/VibeContext";
import { askDremi, speak } from "../services/geminiService";

export default function DremiCore() {
  const { currentVibe } = useVibe();
  const [isListening, setIsListening] = useState(false);
  const [status, setStatus] = useState("Core Latent");
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = async (event: any) => {
        const transcript = event.results[0][0].transcript;
        setIsListening(false);
        setStatus("Analyzing intent...");
        
        try {
            const response = await askDremi(transcript, [], currentVibe);
            setStatus("Transmitting console binary...");
            speak(response);
            setTimeout(() => setStatus("Core Latent"), 2000);
        } catch (err) {
            setStatus("Link Failure");
            speak("I'm sorry, I've encountered a neural sync error.");
        }
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
        setStatus("Interface Error");
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const toggleListen = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      if (!recognitionRef.current) {
        alert("Neural link not supported in this vessel.");
        return;
      }
      setIsListening(true);
      setStatus("Listening for intent...");
      recognitionRef.current?.start();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full gap-8 overflow-y-auto scrollbar-hide py-8">
      {/* Central Hub Orb */}
      <div className="relative group shrink-0">
        <div className="w-[min(70vw,300px)] h-[min(70vw,300px)] rounded-full border border-border flex items-center justify-center relative bg-gradient-to-b from-accent-glow to-transparent transition-all duration-1000">
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
            className="w-[min(45vw,200px)] h-[min(45vw,200px)] rounded-full relative overflow-hidden transition-all duration-1000"
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
            {status}
          </div>
        </div>
      </div>

      {/* Voice Activation Button */}
      <div className="flex flex-col items-center gap-6 mt-8">
        <button 
          onClick={toggleListen}
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
