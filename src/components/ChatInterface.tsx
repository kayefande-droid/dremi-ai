import { motion, AnimatePresence } from "motion/react";
import { useState, useRef, useEffect } from "react";
import { Send, User, Cpu, Mic } from "lucide-react";
import { askDremi, getVibeAnalysis, speak } from "../services/geminiService";
import { useVibe } from "../context/VibeContext";

export default function ChatInterface() {
  const { currentVibe, updateVibe } = useVibe();
  const [messages, setMessages] = useState<{ role: 'user' | 'dremi', text: string }[]>([
    { role: 'dremi', text: "Initialize protocol delta... Awaiting system instruction." }
  ]);
  const [history, setHistory] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
        // Instant trigger for Jarvis experience
        setTimeout(() => {
          handleSend(transcript);
        }, 300);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const toggleVoiceInput = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      if (!recognitionRef.current) {
        alert("Speech recognition is not supported in this browser.");
        return;
      }
      setIsListening(true);
      recognitionRef.current?.start();
    }
  };

  const handleSend = async (overrideInput?: any) => {
    const textToUse = typeof overrideInput === 'string' ? overrideInput : input;
    const userMsg = textToUse.trim();
    if (!userMsg || isLoading) return;

    setInput("");
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    const response = await askDremi(userMsg, history, currentVibe);
    setMessages(prev => [...prev, { role: 'dremi', text: response || "Core communication failure." }]);
    
    // Voice feedback
    if (response) speak(response);
    
    setHistory(prev => [
      ...prev,
      { role: 'user', parts: [{ text: userMsg }] },
      { role: 'model', parts: [{ text: response || "" }] }
    ]);
    
    setIsLoading(false);

    // Analysis
    if (messages.length > 0 && (messages.length + 1) % 4 === 0) {
      getVibeAnalysis(userMsg).then(data => {
        // Clean markdown and split
        const clean = data.replace(/[`"']/g, '').trim();
        const parts = clean.split(",");
        if (parts.length >= 2) {
          const name = parts[0].trim();
          const color = parts[1].trim();
          if (color.startsWith('#')) {
            updateVibe(name, color);
          }
        }
      });
    }
  };

  return (
    <div className="flex flex-col h-full panel !p-0 overflow-hidden border-border/50 bg-black/40 backdrop-blur-md">
      {/* Thread Content */}
      <div ref={scrollRef} className="flex-1 p-8 overflow-y-auto space-y-10 scrollbar-hide">
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`group relative max-w-[85%] ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                {/* Meta Tag */}
                <div className={`text-[8px] uppercase tracking-[0.4em] font-black mb-3 ${msg.role === 'user' ? 'text-accent' : 'text-white/40'}`}>
                  {msg.role === 'user' ? 'PROMPT_PROTOCOL' : 'CORE_SYNTHESIS'}
                </div>
                
                {/* Message Body */}
                <div className={`relative px-6 py-4 rounded-2xl border ${
                  msg.role === 'user' 
                  ? 'bg-accent/5 border-accent/20 text-white shadow-[0_0_20px_rgba(212,175,55,0.05)]' 
                  : 'bg-white/5 border-white/5 text-white/80'
                }`}>
                  <p className="text-sm font-light leading-relaxed tracking-wide">
                    {msg.text}
                  </p>
                  
                  {/* Decorative corner for Dremi */}
                  {msg.role === 'dremi' && (
                    <div className="absolute -left-[1px] top-4 w-[2px] h-4 bg-accent shadow-[0_0_8px_var(--color-accent)]" />
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {isLoading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col gap-2 pl-6"
          >
            <div className="text-[8px] uppercase tracking-[0.4em] font-black text-accent animate-pulse">Processing Protocol</div>
            <div className="flex gap-1">
                {[0, 1, 2].map(i => (
                    <motion.div 
                        key={i}
                        animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                        className="w-1 h-1 rounded-full bg-accent"
                    />
                ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Input Section */}
      <div className="p-6 bg-black border-t-2 border-accent/10 relative overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />
        
        <div className="flex gap-4 items-center">
            <div className="flex-1 relative flex items-center group">
                <input 
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Enter system instruction..."
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-light tracking-wide focus:outline-none focus:border-accent/50 transition-all text-white placeholder:text-white/20"
                />
                <button 
                  onClick={toggleVoiceInput}
                  className={`absolute right-4 p-2 rounded-lg transition-all ${isListening ? 'bg-red-500/10 text-red-500' : 'text-white/20 hover:text-accent'}`}
                >
                  <Mic size={18} className={isListening ? 'animate-pulse' : ''} />
                </button>
            </div>
            
            <button 
                onClick={() => handleSend()}
                className="w-12 h-12 bg-accent rounded-2xl text-black flex items-center justify-center hover:scale-[1.05] active:scale-95 transition-all shadow-xl shadow-accent/20"
            >
                <Send size={20} fill="currentColor" />
            </button>
        </div>
        
        <div className="mt-3 flex justify-center">
            <span className="text-[7px] uppercase tracking-[0.4em] text-white/20 font-black">Secure Multi-Modal Interface v4.0</span>
        </div>
      </div>
    </div>
  );
}
