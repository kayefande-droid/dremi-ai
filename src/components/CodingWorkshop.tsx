import { motion } from "motion/react";
import { useState } from "react";
import { Play, Code, Sparkles, Copy } from "lucide-react";
import { askDremi } from "../services/geminiService";
import { useVibe } from "../context/VibeContext";

export default function CodingWorkshop() {
  const { currentVibe } = useVibe();
  const [prompt, setPrompt] = useState("");
  const [code, setCode] = useState(`$ dremi --vibe "${currentVibe.name.toLowerCase().replace(' ', '-')}"\n[SYS] Initializing compiler...`);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleVibeCode = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    const system = `You are a 'Vibe Coder' working in the ${currentVibe.name} aesthetic. Your job is to take a high-level intent or 'vibe' and turn it into a clean, modern TypeScript/React code snippet. Only return the code, no explanation.`;
    const result = await askDremi(`Vibe prompt: ${prompt}`, []); // History not needed for snippets
    if (result) setCode(result.replace(/```[a-z]*/g, '').replace(/```/g, '').trim());
    setIsGenerating(false);
  };

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="panel flex-none gap-4">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-accent" />
          <span className="stat-label !mb-0 font-bold">Vibe Workshop</span>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
            <VibeTag label="Refactor UI State" active={isGenerating} />
            <VibeTag label="Semantic Sync" info="+24ms" />
            <VibeTag label="Env Mimicry" info="OFF" />
            <VibeTag label="Optimization" info="AUTO" />
        </div>

        <textarea 
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe your vision (e.g., 'midnight focus mode')..."
          className="bg-[#141417] border border-border rounded-xl p-3 text-sm h-24 focus:outline-none focus:border-accent transition-colors resize-none text-white placeholder:text-text-muted"
        />
        
        <button 
          onClick={handleVibeCode}
          disabled={isGenerating}
          className="bg-accent/10 text-accent border border-accent/30 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-accent/20 transition-all disabled:opacity-50"
        >
          {isGenerating ? "Transmuting Vibes..." : (
            <><Play size={14} fill="currentColor" /> Initialize Vibe Code</>
          )}
        </button>
      </div>

      <div className="flex-1 panel !p-4 overflow-hidden flex flex-col">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <Code size={12} className="text-text-muted" />
            <span className="stat-label !mb-0">Vibe Compiler Output</span>
          </div>
          <button 
            className="text-text-muted hover:text-white transition-colors"
            onClick={() => navigator.clipboard.writeText(code)}
          >
            <Copy size={12} />
          </button>
        </div>
        <div className="flex-1 overflow-auto bg-black rounded-xl p-4 font-mono text-[11px] leading-relaxed relative scrollbar-hide">
          <pre className="text-accent opacity-80 whitespace-pre-wrap">{code}</pre>
        </div>
      </div>
    </div>
  );
}

function VibeTag({ label, info, active }: { label: string, info?: string, active?: boolean }) {
    return (
        <div className={`bg-[#18181b] border border-border p-2 rounded-lg flex items-center justify-between transition-all ${active ? 'border-accent bg-accent/10' : ''}`}>
            <span className="text-[10px] text-white opacity-80 font-medium">{label}</span>
            <span className={`text-[8px] font-mono ${active ? 'text-accent animate-pulse' : 'text-text-muted'}`}>
                {active ? 'RUNNING' : (info || '')}
            </span>
        </div>
    );
}
