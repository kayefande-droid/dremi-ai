import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { Play, Code, Sparkles, Copy, Terminal, Zap, Download } from "lucide-react";
import { askDremi, getVibeAnalysis, speak } from "../services/geminiService";
import { useVibe } from "../context/VibeContext";

export default function CodingWorkshop() {
  const { currentVibe, updateVibe } = useVibe();
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isBuildingProject, setIsBuildingProject] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [logs, setLogs] = useState<string[]>(["Neural link stable.", "Waiting for vibe parameters..."]);
  const [generatedCode, setGeneratedCode] = useState(`// Vibe: ${currentVibe.name}\n// CSS Variables injected into root\n:root {\n  --accent: ${currentVibe.color};\n}`);

  const projectSteps = [
    { label: "Scaffolding Architecture", log: "Initializing React with Vibe Protocol..." },
    { label: "Neural Schema Design", log: "Synthesizing relational entities..." },
    { label: "Interface Transmutation", log: "Polishing UI surfaces..." },
    { label: "Final Logic Injection", log: "Compiling business logic..." }
  ];

  const [activeView, setActiveView] = useState<'code' | 'preview'>('code');

  const addLog = (msg: string) => {
    setLogs(prev => [...prev.slice(-4), msg]);
    // Speak logs during build for immersion
    if (isBuildingProject) speak(msg);
  };

  const [previewData, setPreviewData] = useState<{ title: string; sections: string[] } | null>(null);

    const [showPortal, setShowPortal] = useState(false);

  const handleDeploy = async () => {
    if (!prompt.trim() || isGenerating) return;
    
    setIsGenerating(true);
    const isProject = prompt.toLowerCase().includes('website') || prompt.toLowerCase().includes('app') || prompt.toLowerCase().includes('site') || prompt.toLowerCase().includes('hotel');
    
    if (isProject) {
        setIsBuildingProject(true);
        setActiveStep(0);
        setActiveView('preview');
        addLog(`Project Protocol DETECTED: "${prompt}"`);
        
        for (let i = 0; i < projectSteps.length; i++) {
            setActiveStep(i);
            addLog(projectSteps[i].log);
            await new Promise(r => setTimeout(r, 1200));
            
            if (i === 1) {
                 const result = await getVibeAnalysis(prompt);
                 const clean = result.replace(/[`"']/g, '').trim();
                 const parts = clean.split(",");
                 if (parts.length >= 2 && parts[1].startsWith('#')) {
                     updateVibe(parts[0].trim(), parts[1].trim());
                 }
            }
        }
        
        // Synthesize dynamic preview data
        setPreviewData({
            title: prompt.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
            sections: ["System Architecture", "Neural Interface", "Data Management", "Security Gateway"]
        });

        const finalSnippet = await askDremi(`Generate a high-quality React skeleton for: ${prompt}. Use current vibe color ${currentVibe.color}. Return ONLY code.`, []);
        setGeneratedCode(finalSnippet.replace(/```[a-z]*/g, '').replace(/```/g, '').trim());
        addLog("Neural sync complete. PWA build finalized.");
        setIsBuildingProject(false);
        speak("Your interface has been synthesized and is now live in the preview portal.");
    } else {
        addLog(`Analyzing intent: "${prompt.slice(0, 20)}..."`);
        const result = await getVibeAnalysis(prompt);
        const clean = result.replace(/[`"']/g, '').trim();
        const parts = clean.split(",");
        
        if (parts.length >= 2) {
            const name = parts[0].trim();
            const color = parts[1].trim();
            
            if (color.startsWith('#')) {
                addLog(`Synthesizing Visual Identity: ${name}`);
                await new Promise(r => setTimeout(r, 800));
                updateVibe(name, color);
                
                addLog(`Generating component architecture...`);
                const snippet = await askDremi(`Create a simple React styled component definition that embodies the "${name}" vibe with color ${color}. Return ONLY code.`, []);
                setGeneratedCode(snippet.replace(/```[a-z]*/g, '').replace(/```/g, '').trim());
                addLog(`Neural sync complete.`);
            }
        }
    }
    
    setIsGenerating(false);
    setPrompt("");
  };

  return (
    <div className="flex flex-col h-full gap-4 overflow-y-auto scrollbar-hide">
      {/* Vibe Persona Card (Preview) */}
      <div className="panel flex-none relative overflow-hidden h-32 group">
        <div 
          className="absolute inset-0 transition-all duration-1000 opacity-20 group-hover:opacity-30" 
          style={{ background: `radial-gradient(circle at center, ${currentVibe.color} 0%, transparent 100%)` }}
        />
        <div className="relative h-full flex flex-col justify-center px-6">
          <div className="stat-label uppercase tracking-widest text-[10px]">Visual Persona</div>
          <div className="text-2xl font-serif italic text-white tracking-wide">{currentVibe.name}</div>
          <div className="flex gap-1 mt-2">
             <div className="w-8 h-1 rounded-full bg-accent" />
             <div className="w-4 h-1 rounded-full bg-accent opacity-50" />
             <div className="w-2 h-1 rounded-full bg-accent opacity-20" />
          </div>
        </div>
        <div className="absolute right-6 top-1/2 -translate-y-1/2">
           <div 
             className={`w-12 h-12 rounded-full border-2 transition-all duration-1000 ${isGenerating ? 'animate-ping' : 'animate-pulse'}`} 
             style={{ borderColor: currentVibe.color, boxShadow: `0 0 20px ${currentVibe.color}44` }} 
           />
        </div>
      </div>

      <div className="panel flex-none gap-4">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-accent" />
          <span className="stat-label !mb-0 font-bold uppercase tracking-wider">Vibe Workshop</span>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
            <VibeStatus label="Refactor UI State" active={isGenerating} />
            <VibeStatus label="Neural Sync" info="+42ms" />
            <VibeStatus label="Env Mimicry" info="ACTIVE" />
            <VibeStatus label="Optimization" info="MAX" />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {['Cyberpunk', 'Minimalist', 'Retro', 'Brutalist', 'Ethereal', 'Hotel Site', 'SaaS App'].map((v) => (
            <button
              key={v}
              onClick={() => setPrompt(v.includes('Site') || v.includes('App') ? `Build a fully functional ${v.toLowerCase()} with a clean PWA architecture.` : `A ${v.toLowerCase()} vibe with distinct characteristics.`)}
              className="px-3 py-1.5 rounded-full bg-white/5 border border-border text-[9px] uppercase tracking-widest text-text-muted hover:text-accent hover:border-accent transition-all whitespace-nowrap"
            >
              {v}
            </button>
          ))}
        </div>

        {isBuildingProject && (
            <div className="space-y-2 mt-2">
                <div className="flex justify-between text-[8px] uppercase tracking-widest text-accent font-bold">
                    <span>{projectSteps[activeStep].label}</span>
                    <span>{Math.round(((activeStep + 1) / projectSteps.length) * 100)}%</span>
                </div>
                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${((activeStep + 1) / projectSteps.length) * 100}%` }}
                        className="h-full bg-accent shadow-[0_0_10px_var(--color-accent)]"
                    />
                </div>
            </div>
        )}

        <textarea 
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe your vision (e.g., 'Build a luxury hotel booking site')..."
          className="bg-[#141417] border border-border rounded-xl p-3 text-sm h-24 focus:outline-none focus:border-accent transition-colors resize-none text-white placeholder:text-text-muted/50"
        />
        
        <button 
          onClick={handleDeploy}
          disabled={isGenerating}
          className="bg-accent py-4 rounded-xl font-bold text-[10px] uppercase tracking-widest shadow-lg shadow-accent/20 flex items-center justify-center gap-2 disabled:opacity-50 active:scale-[0.98] transition-all"
        >
          {isGenerating ? (
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                <Zap size={14} />
            </motion.div>
          ) : <Terminal size={14} />}
          {isGenerating ? "Synthesizing..." : "Inject Vibe Protocol"}
        </button>
      </div>

      <div className="flex-1 panel !p-4 overflow-hidden flex flex-col min-h-[250px]">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-4">
            <button 
                onClick={() => setActiveView('code')}
                className={`text-[9px] uppercase tracking-widest font-bold transition-colors ${activeView === 'code' ? 'text-accent' : 'text-text-muted hover:text-white'}`}
            >
                View Logic
            </button>
            <button 
                onClick={() => setActiveView('preview')}
                className={`text-[9px] uppercase tracking-widest font-bold transition-colors ${activeView === 'preview' ? 'text-accent' : 'text-text-muted hover:text-white'}`}
            >
                Instant Preview
            </button>
          </div>
          <button 
            className="text-text-muted hover:text-white transition-colors"
            onClick={() => navigator.clipboard.writeText(generatedCode)}
          >
            <Copy size={12} />
          </button>
        </div>
        
        <AnimatePresence mode="wait">
            {activeView === 'code' ? (
                <motion.div 
                    key="code"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex-1 flex flex-col gap-3 font-mono text-[10px] overflow-hidden"
                >
                    <div className="space-y-1 text-text-muted shrink-0 border-b border-white/5 pb-2">
                        {logs.map((log, i) => (
                            <div key={i}>
                                <span className="text-accent/50 mr-2">[{i}]</span> {log}
                            </div>
                        ))}
                    </div>
                    <div className="flex-1 overflow-auto bg-black/40 rounded-lg p-3 leading-relaxed scroll-hide text-accent/80 whitespace-pre">
                        {generatedCode}
                    </div>
                </motion.div>
            ) : (
                <motion.div 
                    key="preview"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    className="flex-1 bg-[#141417] rounded-xl border border-white/10 overflow-hidden flex flex-col gap-0 relative"
                >
                    {/* Header */}
                    <div className="p-3 border-b border-white/5 flex justify-between items-center bg-black/20">
                        <div className="flex gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-red-500/50" />
                            <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
                            <div className="w-2 h-2 rounded-full bg-green-500/50" />
                        </div>
                        <div className="text-[8px] uppercase tracking-widest text-text-muted font-mono">
                            {previewData ? previewData.title.toLowerCase().replace(/ /g, '-') : 'neural-nexus'}.pwa
                        </div>
                        <div className="w-4" />
                    </div>

                    <div className="flex-1 overflow-auto p-4 flex flex-col gap-4 scrollbar-hide">
                        {previewData ? (
                            <div className="flex-1 flex flex-col gap-6">
                                {/* Synthetic Hero */}
                                <div className="p-6 rounded-2xl bg-accent/10 border border-accent/20 flex flex-col gap-3 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-2 opacity-50"><Sparkles size={14} /></div>
                                    <div className="w-12 h-1 bg-accent rounded-full mb-1" />
                                    <h3 className="text-xl font-serif italic text-white leading-tight">{previewData.title}</h3>
                                    <p className="text-[10px] text-text-muted leading-relaxed max-w-[200px]">
                                        Professional architecture synthesized via Dremi Neural Core.
                                    </p>
                                    <button 
                                        onClick={() => setShowPortal(true)}
                                        className="w-fit bg-accent px-4 py-2 rounded-lg text-[9px] font-bold uppercase tracking-widest mt-2 active:scale-95 transition-all shadow-lg shadow-accent/20"
                                    >
                                        Launch Portal
                                    </button>
                                </div>

                                {/* Dynamic Sections */}
                                <div className="grid grid-cols-1 gap-3">
                                    <div className="text-[10px] uppercase tracking-widest text-text-muted font-bold px-1">System Modules</div>
                                    {previewData.sections.map((s, i) => (
                                        <div key={i} className="p-4 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-between group cursor-pointer">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-all">
                                                    <Zap size={14} className="text-accent" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <div className="text-[11px] font-bold text-white/90">{s}</div>
                                                    <div className="text-[9px] text-text-muted">Protocol Active</div>
                                                </div>
                                            </div>
                                            <div className="w-1.5 h-1.5 rounded-full bg-accent shadow-[0_0_8px_var(--color-accent)]" />
                                        </div>
                                    ))}
                                </div>

                                {/* Data Feed Simulation */}
                                <div className="p-4 rounded-xl border border-white/5 bg-black/40 flex flex-col gap-2">
                                     <div className="flex justify-between items-center mb-1">
                                         <span className="text-[9px] uppercase tracking-widest text-text-muted">Live Stream</span>
                                         <span className="text-[9px] text-accent font-mono animate-pulse">CONNECTED</span>
                                     </div>
                                     <div className="h-24 overflow-hidden mask-fade-bottom">
                                         {[1,2,3,4].map(n => (
                                             <div key={n} className="flex gap-2 py-1 border-b border-white/5 font-mono text-[8px] text-text-muted/50">
                                                 <span className="text-accent/30">{new Date().toLocaleTimeString()}</span>
                                                 <span>SYNC_PACKET_{n} RECEIVED</span>
                                             </div>
                                         ))}
                                     </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex-1 flex flex-col justify-center items-center text-center gap-4 py-10">
                                <div className="w-16 h-16 rounded-full border-2 border-dashed border-white/10 animate-spin flex items-center justify-center">
                                    <Sparkles size={16} className="text-white/20" />
                                </div>
                                <div className="text-[10px] text-text-muted uppercase tracking-widest">Awaiting Synthesis</div>
                            </div>
                        )}
                    </div>

                    {/* Final Deployment Metadata */}
                    {previewData && !isBuildingProject && (
                        <div className="border-t border-white/5 p-4 bg-black/20 flex flex-col gap-3">
                            <div className="flex justify-between items-center">
                                <div className="flex flex-col">
                                    <span className="text-[8px] uppercase tracking-widest text-text-muted font-bold">PWA Infrastructure</span>
                                    <span className="text-[10px] text-white font-mono">deployment-ready.v1</span>
                                </div>
                                <button 
                                    onClick={() => window.open(window.location.href, '_blank')}
                                    className="bg-accent/10 text-accent p-2 rounded-lg hover:bg-accent/20 transition-all"
                                >
                                    <Download size={16} />
                                </button>
                            </div>
                            <button 
                                onClick={() => setPreviewData(null)}
                                className="w-full py-2 text-[9px] font-bold text-text-muted uppercase tracking-[0.2em] hover:text-white transition-colors"
                            >
                                Clear Architecture
                            </button>
                        </div>
                    )}
                </motion.div>
            )}
        </AnimatePresence>

        {/* Full-screen Portal Overlay */}
        <AnimatePresence>
            {showPortal && previewData && (
                <motion.div 
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.1 }}
                    className="fixed inset-0 z-[100] bg-bg flex flex-col items-center justify-center p-6 overflow-hidden md:max-w-[480px] md:mx-auto md:border-x md:border-border"
                >
                    <div className="absolute inset-0 opacity-10" style={{ background: `radial-gradient(circle at center, ${currentVibe.color} 0%, transparent 100%)` }} />
                    
                    <button 
                        onClick={() => setShowPortal(false)}
                        className="absolute top-8 right-8 p-3 rounded-full bg-white/5 border border-white/10 text-white/50 hover:text-white transition-all active:scale-90"
                    >
                        <Zap size={20} />
                    </button>

                    <div className="relative text-center flex flex-col items-center gap-8 max-w-sm">
                        <motion.div 
                            animate={{ rotate: 360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            className="w-24 h-24 rounded-full border-2 border-dashed border-accent flex items-center justify-center"
                        >
                            <Sparkles size={32} className="text-accent" />
                        </motion.div>

                        <div className="space-y-4">
                            <div className="text-[10px] uppercase tracking-[0.4em] text-accent font-black">Live Production Portal</div>
                            <h1 className="text-4xl font-serif italic text-white">{previewData.title}</h1>
                            <p className="text-sm text-text-muted leading-relaxed px-4">
                                You are currently viewing the live synthesized state of our {previewData.title.toLowerCase()}. 
                                All neural links are active and functional.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 w-full">
                            {previewData.sections.map((s, i) => (
                                <button key={i} className="panel !bg-white/5 border border-white/10 p-6 flex flex-col items-center gap-2 hover:border-accent transition-all">
                                    <Code size={18} className="text-accent" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/80">{s}</span>
                                </button>
                            ))}
                        </div>

                        <div className="flex flex-col gap-4 w-full mt-4">
                             <button className="bg-accent py-5 rounded-2xl font-black uppercase text-xs tracking-widest shadow-2xl shadow-accent/40 active:scale-[0.98] transition-all">
                                Enter Console Interface
                             </button>
                             <button 
                                onClick={() => setShowPortal(false)}
                                className="text-[10px] font-bold text-text-muted hover:text-accent tracking-widest uppercase transition-colors"
                             >
                                Exit Neural Link
                             </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function VibeStatus({ label, info, active }: { label: string, info?: string, active?: boolean }) {
    return (
        <div className={`bg-white/5 border border-border p-2 rounded-lg flex items-center justify-between transition-all ${active ? 'border-accent bg-accent/10' : ''}`}>
            <span className="text-[10px] text-white opacity-80 font-medium">{label}</span>
            <span className={`text-[8px] font-mono ${active ? 'text-accent animate-pulse' : 'text-text-muted'}`}>
                {active ? 'SYNCING' : (info || '')}
            </span>
        </div>
    );
}
