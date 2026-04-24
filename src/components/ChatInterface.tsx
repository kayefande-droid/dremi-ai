import { motion, AnimatePresence } from "motion/react";
import { useState, useRef, useEffect } from "react";
import { Send, User, Cpu, Mic } from "lucide-react";
import { askDremi, getVibeAnalysis, speak } from "../services/geminiService";
import { useVibe } from "../context/VibeContext";

export default function ChatInterface() {
  const { updateVibe } = useVibe();
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

  const handleSend = async (overrideInput?: string) => {
    const userMsg = (overrideInput || input).trim();
    if (!userMsg || isLoading) return;

    setInput("");
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    const response = await askDremi(userMsg, history);
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
    <div className="flex flex-col h-full panel !p-0 overflow-hidden border-border/50">
      <div ref={scrollRef} className="flex-1 p-6 overflow-y-auto space-y-6 scrollbar-hide">
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: msg.role === 'user' ? 10 : -10 }}
              animate={{ opacity: 1, x: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[85%] text-sm leading-relaxed ${
                msg.role === 'user' 
                ? 'text-accent border-r-2 border-accent pr-4 py-1' 
                : 'text-text-muted border-l-2 border-border pl-4 py-1'
              }`}>
                <div className="stat-label mb-1">
                  {msg.role === 'user' ? 'User' : 'Dremi.ai'}
                </div>
                <p className={`${msg.role === 'dremi' ? '' : 'text-white'}`}>{msg.text}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {isLoading && (
          <div className="flex justify-start">
             <div className="text-accent text-[10px] uppercase tracking-widest animate-pulse font-mono pl-4 border-l-2 border-accent">
               Analyzing intent...
             </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-black/20 border-t border-border flex gap-3">
        <div className="flex-1 relative flex items-center">
            <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Awaiting command..."
            className="w-full bg-[#141417] border border-border rounded-full px-6 py-3 text-sm focus:outline-none focus:border-accent transition-colors text-white placeholder:text-text-muted"
            />
            <div className="absolute right-4 flex items-center gap-2">
                <button 
                  onClick={toggleVoiceInput}
                  className={`p-1 transition-colors ${isListening ? 'text-accent animate-pulse' : 'text-text-muted hover:text-accent'}`}
                >
                  <Mic size={18} />
                </button>
            </div>
        </div>
        <button 
          onClick={handleSend}
          className="bg-accent p-3 rounded-full text-white hover:bg-accent/80 transition-colors shadow-lg shadow-accent/20"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}
