import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import { Play, Code, Sparkles, Copy, Terminal, Zap, Download, Mic, MicOff } from "lucide-react";
import { askDremi, getVibeAnalysis, speak } from "../services/geminiService";
import { useVibe } from "../context/VibeContext";
import { useRef } from "react";

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

  const [activeView, setActiveView] = useState<'code' | 'preview' | 'debug' | 'synthesis'>('code');
  const [activeFile, setActiveFile] = useState<string>('nucleus.logic');
  const [neuralMetrics, setNeuralMetrics] = useState({ consistency: 98.4, entropy: 12.1, tokens: 0, uptime: "99.99%" });
  const [modelParams, setModelParams] = useState({ creativity: 0.8, vibeWeight: 0.9, precision: 0.7, neuralDensity: 0.5 });
  const [showConfig, setShowConfig] = useState(false);
  const [buildHistory, setBuildHistory] = useState<{id: string, prompt: string, vibe: string, timestamp: string}[]>([]);
  const [projectFiles, setProjectFiles] = useState<Record<string, string>>({
    'vibe.config': `// Vibe: ${currentVibe.name}\nexport const theme = {\n  accent: "${currentVibe.color}",\n  typography: "Inter",\n  radius: "12px",\n  animation: "nexus-smooth",\n  density: "technical"\n};`,
    'nucleus.logic': `// Neural Logic Engine\n// Protocol: Awaiting injection\n\nasync function init() {\n  console.log("Dremi Core Online");\n  // Synthesis architecture will appear here\n}`,
    'interface.react': `// Component Architecture\nimport React from 'react';\n\nexport default function App() {\n  return (\n    <div className="neural-nexus">\n      <h1>Interface Active</h1>\n    </div>\n  );\n}`
  });
  const [isCodeCopied, setIsCodeCopied] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(projectFiles[activeFile]).then(() => {
        setIsCodeCopied(true);
        setTimeout(() => setIsCodeCopied(false), 2000);
    });
  };

  const addLog = (msg: string) => {
    setLogs(prev => [...prev.slice(-4), msg]);
    // Speak logs during build for immersion
    if (isBuildingProject) speak(msg);
  };

  const [previewData, setPreviewData] = useState<{ title: string; sections: string[] } | null>(null);
  const [showPortal, setShowPortal] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [savedVibes, setSavedVibes] = useState<{name: string, color: string}[]>([]);
  const recognitionRef = useRef<any>(null);

  // Load saved vibes
  useEffect(() => {
    const saved = localStorage.getItem('dremi_saved_vibes');
    if (saved) {
        try {
            setSavedVibes(JSON.parse(saved));
        } catch (e) {
            console.error("Failed to load vibes", e);
        }
    }
  }, []);

  const handleSaveVibe = () => {
    if (savedVibes.some(v => v.name === currentVibe.name)) {
        speak("Aesthetic already archived in neural core.");
        return;
    }
    const updated = [...savedVibes, { name: currentVibe.name, color: currentVibe.color }];
    setSavedVibes(updated);
    localStorage.setItem('dremi_saved_vibes', JSON.stringify(updated));
    speak("Visual identity archived successfully.");
    addLog(`Archived Vibe: ${currentVibe.name}`);
  };

  const handleRemoveVibe = (name: string) => {
    const updated = savedVibes.filter(v => v.name !== name);
    setSavedVibes(updated);
    localStorage.setItem('dremi_saved_vibes', JSON.stringify(updated));
    addLog(`Purged Vibe: ${name}`);
  };

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = async (event: any) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        setIsListening(false);
        addLog(`Voice Intent Captured: "${transcript}"`);
        
        if (transcript.includes('build') || transcript.includes('generate') || transcript.includes('create')) {
            const newPrompt = transcript.replace(/build|generate|create/g, '').trim();
            if (newPrompt) {
                setPrompt(newPrompt);
                speak(`Acknowledged. Initiating synthesis for: ${newPrompt}`);
                // Use a slight delay to allow UI to update before handleDeploy check
                setTimeout(() => {
                    const btn = document.getElementById('inject-protocol-btn');
                    if (btn) btn.click();
                }, 500);
            }
        } else if (transcript.includes('vibe') || transcript.includes('theme') || transcript.includes('style')) {
            const vibePrompt = transcript.replace(/vibe|theme|style|change to|set to/g, '').trim();
            if (vibePrompt) {
                setPrompt(vibePrompt);
                speak(`Aesthetic realignment initiated: ${vibePrompt}`);
                setTimeout(() => {
                    const btn = document.getElementById('inject-protocol-btn');
                    if (btn) btn.click();
                }, 500);
            }
        } else {
            speak(`Neural command "${transcript}" not recognized. Specify build or vibe parameters.`);
        }
      };

      recognitionRef.current.onerror = () => setIsListening(false);
      recognitionRef.current.onend = () => setIsListening(false);
    }
  }, []);

  const toggleVoice = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      if (!recognitionRef.current) {
        speak("Neural link not supported in this vessel.");
        return;
      }
      setIsListening(true);
      recognitionRef.current?.start();
      addLog("Listening for neural commands...");
      speak("Command interface active. Describe your build or vibe parameters.");
    }
  };

  // Handle shared projects on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sharedData = params.get('proto');
    if (sharedData) {
        try {
            const decoded = JSON.parse(atob(sharedData));
            setPreviewData(decoded.data);
            if (decoded.vibe) {
                updateVibe(decoded.vibe.name, decoded.vibe.color);
            }
            setActiveView('preview');
            addLog("Shared Neural Protocol detected and synchronized.");
        } catch (e) {
            console.error("Failed to decode protocol", e);
        }
    }
  }, []);

  const handleShare = () => {
    if (!previewData) return;
    setIsSharing(true);
    
    const protocol = {
        data: previewData,
        vibe: currentVibe,
        ts: Date.now()
    };
    
    const encoded = btoa(JSON.stringify(protocol));
    const shareUrl = `${window.location.origin}${window.location.pathname}?proto=${encoded}`;
    
    navigator.clipboard.writeText(shareUrl).then(() => {
        addLog("Protocol link copied to neural buffer.");
        speak("Share protocol generated and copied to your clipboard.");
        setTimeout(() => setIsSharing(false), 2000);
    });
  };

  const handleDeploy = async () => {
    if (!prompt.trim() || isGenerating) return;
    
    setIsGenerating(true);
    const isProject = prompt.toLowerCase().includes('website') || prompt.toLowerCase().includes('app') || prompt.toLowerCase().includes('site') || prompt.toLowerCase().includes('hotel');
    
    if (isProject) {
        setIsBuildingProject(true);
        setActiveStep(0);
        setActiveView('synthesis');
        addLog(`Project Protocol INITIATED: "${prompt}"`);
        setNeuralMetrics(prev => ({ ...prev, tokens: Math.floor(Math.random() * 800) + 2400 }));
        
        for (let i = 0; i < projectSteps.length; i++) {
            setActiveStep(i);
            addLog(`SYNSYS [${i}]: ${projectSteps[i].log}`);
            await new Promise(r => setTimeout(r, 900 + Math.random() * 600));
            
            if (i === 1) {
                 const result = await getVibeAnalysis(prompt);
                 const clean = result.replace(/[`"']/g, '').trim();
                 const parts = clean.split(",");
                 if (parts.length >= 2 && parts[1].trim().startsWith('#')) {
                     updateVibe(parts[0].trim(), parts[1].trim());
                     speak(`Neural alignment to ${parts[0].trim()} aesthetic protocol.`);
                 }
            }
        }

        const historyId = Math.random().toString(36).substring(7).toUpperCase();
        setBuildHistory(prev => [{ id: historyId, prompt, vibe: currentVibe.name, timestamp: new Date().toLocaleTimeString() }, ...prev].slice(0, 5));
        
        // Synthesize high-fidelity architecture
        const finalSnippet = await askDremi(`Generate a professional-grade React application skeleton for: "${prompt}". Use ${currentVibe.name} vibe with color ${currentVibe.color}. Return ONLY code.`, [], { prompt, vibe: currentVibe.name });
        
        setProjectFiles({
            'vibe.config': `// Vibe: ${currentVibe.name}\nexport const theme = {\n  name: "${currentVibe.name}",\n  accent: "${currentVibe.color}",\n  version: "SYNAPSE_4.2"\n};`,
            'nucleus.logic': `// Neural Logic for: ${prompt}\n\nexport const Core = {\n  architecture: "neural_distributed",\n  vibe: "${currentVibe.name}",\n  integrity: 0.985\n};`,
            'interface.react': finalSnippet.replace(/```[a-z]*/g, '').replace(/```/g, '').trim()
        });

        setPreviewData({
            title: prompt.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
            sections: ["Neural Operations", "Synthesis Telemetry", "Project Management", "Protocol Security"]
        });

        addLog(`Synthesis protocol COMPLETE for ${historyId}. Deploying architecture.`);
        setIsBuildingProject(false);
        setActiveFile('interface.react');
        setActiveView('preview');
        speak("Architecture synthesized successfully. Your neural interface is now live.");
    } else {
        // Simple vibe and component change
        addLog(`Analyzing intent: "${prompt.slice(0, 30)}..."`);
        const result = await getVibeAnalysis(prompt);
        const clean = result.replace(/[`"']/g, '').trim();
        const parts = clean.split(",");
        
        if (parts.length >= 2) {
            const name = parts[0].trim();
            const color = parts[1].trim();
            
            if (color.startsWith('#')) {
                updateVibe(name, color);
                speak(`Switching aesthetic protocol to ${name}.`);
                
                addLog(`Re-generating interface components...`);
                const snippet = await askDremi(`Create a simple React component embodying "${name}" vibe with color ${color}. Return ONLY code.`, [], { name, color });
                
                setProjectFiles(prev => ({
                    ...prev,
                    'vibe.config': `// Vibe: ${name}\nexport const theme = { accent: "${color}" };`,
                    'interface.react': snippet.replace(/```[a-z]*/g, '').replace(/```/g, '').trim()
                }));
                setActiveFile('interface.react');
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
          <div className="flex gap-2 mt-2">
             <div className="w-8 h-1 rounded-full bg-accent" />
             <div className="w-4 h-1 rounded-full bg-accent opacity-50" />
             <button 
                onClick={handleSaveVibe}
                className="text-[8px] uppercase tracking-widest text-accent font-bold hover:text-white transition-colors ml-2"
                title="Archive Current Aesthetic"
             >
                Archive Vibe +
             </button>
          </div>
        </div>
        <div className="absolute right-6 top-1/2 -translate-y-1/2">
           <div 
             className={`w-12 h-12 rounded-full border-2 transition-all duration-1000 ${isGenerating ? 'animate-ping' : 'animate-pulse'}`} 
             style={{ borderColor: currentVibe.color, boxShadow: `0 0 20px ${currentVibe.color}44` }} 
           />
        </div>
      </div>

      <div className="panel flex-none p-4 !bg-black/80 border-t-2 border-accent/20">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="flex flex-col">
                        <span className="text-[7px] uppercase tracking-[0.3em] text-accent font-black">Neural Injection Port</span>
                        <span className="text-[9px] text-text-muted">Direct protocol stream via SYNAPSE-6.4</span>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button 
                        onClick={toggleVoice}
                        className={`p-2 rounded-lg border transition-all ${isListening ? 'bg-red-500/20 border-red-500 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)]' : 'bg-white/5 border-white/10 text-text-muted hover:text-white'}`}
                        title="Voice Injection"
                    >
                        {isListening ? <Mic size={14} className="animate-pulse" /> : <MicOff size={14} />}
                    </button>
                    <div className="flex gap-1 overflow-x-auto max-w-[200px] scrollbar-hide">
                         {['Cyberpunk', 'Minimalist', 'Brutalist', 'Hotel App', 'SaaS Platform'].map((v) => (
                             <button 
                                key={v}
                                onClick={() => setPrompt(`Build a high-fidelity ${v.toLowerCase()} with professional neural architecture.`)}
                                className="bg-white/5 border border-white/10 text-white/40 hover:text-white px-2 py-1 rounded text-[7px] uppercase tracking-widest font-bold transition-all whitespace-nowrap"
                             >
                                {v}
                             </button>
                         ))}
                    </div>
                </div>
            </div>

            <div className="relative group">
                <input 
                    type="text" 
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleDeploy()}
                    placeholder="Describe your architectural requirements..."
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-accent/50 transition-all font-mono"
                    disabled={isGenerating}
                />
                <button 
                    onClick={handleDeploy}
                    disabled={isGenerating}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-accent hover:bg-accent-light disabled:opacity-50 text-white px-6 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-accent/20 flex items-center gap-2 group-hover:scale-[1.02]"
                >
                    {isGenerating ? (
                        <>
                            <Zap size={12} className="animate-spin" />
                            Synthesizing
                        </>
                    ) : (
                        <>
                            <Play size={12} fill="currentColor" />
                            Inject Logic
                        </>
                    )}
                </button>
            </div>
            
            <div className="flex items-center gap-6 px-1">
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[8px] uppercase tracking-widest text-text-muted">Link: STABLE</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                    <span className="text-[8px] uppercase tracking-widest text-text-muted">Buffer: CLEAR</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    <span className="text-[8px] uppercase tracking-widest text-text-muted">Latency: 12ms</span>
                </div>
                <div className="ml-auto text-[8px] font-mono text-white/20">
                    Dremi Core v2.4.SYN
                </div>
            </div>
          </div>
        </div>

      <div className="flex-1 panel !p-0 overflow-hidden flex flex-col min-h-[350px]">
        {/* Header/Controls */}
        <div className="flex justify-between items-center p-4 border-b border-white/5 bg-black/20">
          <div className="flex items-center gap-4">
            <span className="text-[10px] uppercase tracking-[0.2em] text-accent font-black">Synthesis Output</span>
            <div className="hidden md:flex items-center gap-2 px-2 py-0.5 rounded bg-accent/10 border border-accent/20 text-accent text-[8px] font-bold">
              <Zap size={8} /> SPLIT_VIEW_ACTIVE
            </div>
            {/* Mobile Toggles */}
            <div className="flex md:hidden items-center gap-3">
                {['code', 'preview', 'debug'].map((view) => (
                    <button 
                        key={view}
                        onClick={() => setActiveView(view as any)}
                        className={`text-[9px] uppercase tracking-widest font-bold transition-colors ${activeView === view ? 'text-accent' : 'text-text-muted'}`}
                    >
                        {view}
                    </button>
                ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
                onClick={() => setActiveView('debug')}
                className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all text-[9px] font-bold uppercase tracking-widest ${activeView === 'debug' ? 'bg-accent/20 border-accent text-accent' : 'bg-white/5 border-white/10 text-text-muted hover:text-white'}`}
            >
                Neural Debug
            </button>
            <button 
                onClick={handleCopyCode}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all text-[9px] font-bold uppercase tracking-widest ${isCodeCopied ? 'bg-accent/20 border-accent text-accent' : 'bg-white/5 border-white/10 text-text-muted hover:text-white hover:border-white/20'}`}
            >
                {isCodeCopied ? <Zap size={10} /> : <Copy size={10} />}
                {isCodeCopied ? 'Copied' : 'Copy'}
            </button>
          </div>
        </div>
        
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden h-full">
            {/* Project Explorer (Sidebar) */}
            <div className="hidden lg:flex lg:col-span-1 border-r border-white/5 bg-black/40 flex-col items-center py-4 gap-6">
                <div className="flex flex-col items-center gap-3 w-full px-2">
                    <div className="text-[7px] uppercase tracking-widest text-text-muted font-bold mb-1">Files</div>
                    <button 
                    onClick={() => setActiveFile('vibe.config')}
                    className={`p-2 rounded-lg transition-all w-full flex justify-center ${activeFile === 'vibe.config' ? 'text-accent bg-accent/10 border border-accent/20' : 'text-text-muted hover:text-white'}`}
                    title="vibe.config"
                    >
                    <Sparkles size={18} />
                    </button>
                    <button 
                    onClick={() => setActiveFile('nucleus.logic')}
                    className={`p-2 rounded-lg transition-all w-full flex justify-center ${activeFile === 'nucleus.logic' ? 'text-accent bg-accent/10 border border-accent/20' : 'text-text-muted hover:text-white'}`}
                    title="nucleus.logic"
                    >
                    <Terminal size={18} />
                    </button>
                    <button 
                    onClick={() => setActiveFile('interface.react')}
                    className={`p-2 rounded-lg transition-all w-full flex justify-center ${activeFile === 'interface.react' ? 'text-accent bg-accent/10 border border-accent/20' : 'text-text-muted hover:text-white'}`}
                    title="interface.react"
                    >
                    <Code size={18} />
                    </button>
                </div>

                <div className="flex flex-col items-center gap-3 w-full px-2 mt-auto">
                    <div className="text-[7px] uppercase tracking-widest text-text-muted font-bold mb-1">Iter</div>
                    {buildHistory.map((h) => (
                        <button 
                            key={h.id}
                            onClick={() => addLog(`Restoring iteration ${h.id.toUpperCase()}...`)}
                            className="w-6 h-6 rounded-md bg-white/5 border border-white/10 flex items-center justify-center text-[8px] text-text-muted hover:text-accent hover:border-accent transition-all uppercase"
                            title={h.prompt}
                        >
                            {h.id.charAt(0)}
                        </button>
                    ))}
                    <div className="w-5 h-[1px] bg-white/10 my-1" />
                    <button className="text-text-muted hover:text-white transition-colors">
                        <Download size={14} />
                    </button>
                </div>
            </div>

            {/* Logic Panel (Editor) */}
            <motion.div 
                className={`${activeView === 'code' ? 'flex' : 'hidden'} md:flex md:col-span-5 lg:col-span-5 flex-col border-r border-white/5 bg-black/10 overflow-hidden h-full`}
            >
                <div className="p-3 border-b border-white/5 bg-black/20 flex justify-between items-center shrink-0">
                    <div className="flex items-center gap-2">
                        <span className="text-[8px] uppercase tracking-widest text-text-muted font-bold">Logic Engine</span>
                        <div className="h-4 w-px bg-white/10 mx-1" />
                        <span className="text-[10px] text-accent font-mono lowercase">{activeFile}</span>
                    </div>
                </div>
                <div className="flex-1 overflow-hidden flex flex-col p-3 gap-3">
                    <div className="flex-1 overflow-auto bg-black/40 rounded-lg p-3 leading-relaxed scroll-hide text-accent/80 font-mono text-[10px] whitespace-pre relative group/code border border-white/5">
                        <div className="absolute top-0 left-0 w-8 h-full bg-black/20 border-r border-white/5 flex flex-col items-center py-3 text-[8px] text-white/10 select-none">
                            {Array.from({ length: 40 }).map((_, i) => <div key={i}>{i + 1}</div>)}
                        </div>
                        <div className="pl-8">
                            <button 
                                onClick={handleCopyCode}
                                className="absolute top-2 right-2 p-2 rounded-md bg-white/5 border border-white/10 opacity-0 group-hover/code:opacity-100 transition-all hover:bg-white/10 text-white/50"
                                title="Copy Protocol"
                            >
                                <Copy size={12} />
                            </button>
                            {projectFiles[activeFile]}
                        </div>
                    </div>
                    {/* Synthesis Terminal */}
                    <div className="h-32 bg-black/60 rounded border border-white/5 overflow-hidden flex flex-col">
                        <div className="px-2 py-1 border-b border-white/5 bg-black/40 flex justify-between items-center">
                            <span className="text-[7px] uppercase tracking-widest text-text-muted font-black">Synthesis Terminal</span>
                            <div className="flex gap-1">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500/50" />
                                <div className="w-1.5 h-1.5 rounded-full bg-yellow-500/50" />
                            </div>
                        </div>
                        <div className="flex-1 overflow-auto p-2 font-mono text-[9px] text-text-muted/60 space-y-1">
                            {logs.map((log, i) => (
                                <div key={i} className="flex gap-2">
                                    <span className="text-accent/30 lowercase">root@nexus:~$</span> 
                                    <span className={i === logs.length - 1 ? "text-accent" : ""}>{log}</span>
                                </div>
                            ))}
                            {isGenerating && (
                                <div className="animate-pulse flex items-center gap-2">
                                    <span className="text-accent">▋</span>
                                    <span className="italic">Neural compilation in progress...</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Preview Panel */}
            <motion.div 
                className={`${activeView === 'preview' ? 'flex' : 'hidden'} md:flex md:col-span-7 lg:col-span-6 flex-col bg-[#0c0c0e] overflow-hidden h-full`}
            >
                <div className="p-3 border-b border-white/5 bg-black/20 flex justify-between items-center">
                    <span className="text-[8px] uppercase tracking-widest text-text-muted font-bold">Preview Portal</span>
                    <div className="flex items-center gap-3">
                        <div className="flex gap-1">
                            <div className="w-1 h-1 rounded-full bg-accent animate-pulse" />
                            <div className="w-1 h-1 rounded-full bg-accent animate-pulse delay-75" />
                            <div className="w-1 h-1 rounded-full bg-accent animate-pulse delay-150" />
                        </div>
                        <Sparkles size={12} className="text-accent/50" />
                    </div>
                </div>
                
                <div className="flex-1 overflow-auto p-4 flex flex-col gap-4 scrollbar-hide relative">
                    <AnimatePresence mode="wait">
                        {activeView === 'synthesis' ? (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex-1 flex flex-col items-center justify-center gap-8 relative"
                    >
                        <div className="absolute inset-0 pointer-events-none overflow-hidden">
                             {Array.from({ length: 20 }).map((_, i) => (
                                 <motion.div 
                                    key={i}
                                    initial={{ y: "100%", opacity: 0 }}
                                    animate={{ y: "-100%", opacity: [0, 0.5, 0] }}
                                    transition={{ duration: 2 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 5 }}
                                    className="absolute w-px bg-accent/20"
                                    style={{ left: `${Math.random() * 100}%`, height: `${20 + Math.random() * 30}%` }}
                                 />
                             ))}
                        </div>

                        <div className="relative w-48 h-48">
                             <motion.div 
                                animate={{ rotate: 360 }}
                                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-0 border-2 border-dashed border-accent/20 rounded-full"
                             />
                             <motion.div 
                                animate={{ rotate: -360 }}
                                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-4 border border-dashed border-accent/40 rounded-full"
                             />
                             <div className="absolute inset-0 flex items-center justify-center">
                                 <div className="flex flex-col items-center gap-1">
                                     <Sparkles size={32} className="text-accent animate-pulse" />
                                     <div className="text-[10px] font-black uppercase tracking-[0.4em] text-accent mt-2">Synthesizing</div>
                                     <div className="text-[8px] text-white/40 font-mono">Iteration {activeStep + 1}/4</div>
                                 </div>
                             </div>
                        </div>

                        <div className="w-64 space-y-4">
                            {projectSteps.map((step, i) => (
                                <div key={i} className="flex items-center gap-4">
                                    <div className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${i <= activeStep ? 'bg-accent shadow-[0_0_8px_var(--color-accent)]' : 'bg-white/10'}`} />
                                    <div className={`text-[10px] uppercase tracking-widest transition-all duration-500 ${i <= activeStep ? 'text-white' : 'text-text-muted'}`}>
                                        {step.label}
                                    </div>
                                    {i === activeStep && (
                                        <motion.div 
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="ml-auto text-[8px] font-mono text-accent"
                                        >
                                            ACTIVE
                                        </motion.div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </motion.div>
                ) : activeView === 'debug' ? (
                            <motion.div 
                                key="debug"
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.02 }}
                                className="flex-1 flex flex-col gap-4 bg-black/40 rounded-xl p-4 border border-accent/20 backdrop-blur-md"
                            >
                                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                                    <span className="text-[10px] uppercase tracking-[0.2em] text-accent font-black">Neural Telemetry</span>
                                    <Zap size={14} className="text-accent" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <div className="text-[8px] uppercase text-text-muted">Synthesis Integrity</div>
                                        <div className="text-xl font-mono text-white">{neuralMetrics.consistency}%</div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-[8px] uppercase text-text-muted">Vibe Entropy</div>
                                        <div className="text-xl font-mono text-white">{neuralMetrics.entropy}ψ</div>
                                    </div>
                                </div>
                                <div className="flex-1 mt-4 space-y-4">
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-1 gap-2">
                                            <div className="text-[10px] uppercase tracking-widest text-accent font-bold mb-2">Protocol Interpretation Engine</div>
                                            <div className="flex items-center justify-between p-2 rounded bg-white/5 border border-white/5 text-[9px]">
                                                <span className="text-text-muted">Aesthetic Directive</span>
                                                <span className="text-white font-mono">{currentVibe.name} CORE</span>
                                            </div>
                                            <div className="flex items-center justify-between p-2 rounded bg-white/5 border border-white/5 text-[9px]">
                                                <span className="text-text-muted">Logical Complexity</span>
                                                <span className="text-white font-mono">LEVEL_4_SYS</span>
                                            </div>
                                            <div className="flex items-center justify-between p-2 rounded bg-white/5 border border-white/5 text-[9px]">
                                                <span className="text-text-muted">Neural Latency</span>
                                                <span className="text-white font-mono">1.2ms SYNAPSE</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-[8px] uppercase text-text-muted">
                                            <span>Token Saturation</span>
                                            <span>{neuralMetrics.tokens} / 4096</span>
                                        </div>
                                        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                            <div className="h-full bg-accent" style={{ width: `${(neuralMetrics.tokens / 4096) * 100}%` }} />
                                        </div>
                                    </div>
                                    <div className="p-3 bg-black/40 rounded-lg border border-white/5 space-y-2">
                                        <div className="text-[9px] uppercase tracking-widest text-accent font-bold">Heuristic Validation</div>
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 text-[9px] text-green-400">
                                                <Zap size={8} /> Vibe Violations: 0
                                            </div>
                                            <div className="flex items-center gap-2 text-[9px] text-white/50">
                                                <Zap size={8} /> Layout Rhythms: STABLE
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="flex-1 flex flex-col gap-4">
                                <div className="absolute inset-0 pointer-events-none opacity-5 transition-all duration-1000" style={{ background: `radial-gradient(circle at 100% 0%, ${currentVibe.color} 0%, transparent 100%)` }} />
                                
                                {previewData ? (
                                    <div className="flex-1 flex flex-col gap-6 relative z-10">
                                        {/* Synthetic Hero */}
                                        <div className="p-6 rounded-2xl bg-accent/5 border border-accent/10 flex flex-col gap-3 relative overflow-hidden group">
                                            {activeView === 'debug' && (
                                                <div className="absolute inset-0 bg-accent/5 border border-dashed border-accent/40 pointer-events-none flex items-center justify-center z-20">
                                                    <span className="text-[6px] uppercase tracking-widest text-accent font-black">COMPONENT_HERO_BOUND</span>
                                                </div>
                                            )}
                                            <div className="absolute top-0 right-0 p-2 flex gap-2 z-10">
                                                <button 
                                                    onClick={() => window.open(window.location.href, '_blank')}
                                                    className="p-1.5 rounded-md bg-white/5 hover:bg-white/10 text-white/50 hover:text-accent transition-colors"
                                                    title="Open in Local Browser"
                                                >
                                                    <Zap size={12} />
                                                </button>
                                                <Sparkles size={14} className="opacity-50" />
                                            </div>
                                            <h3 className="text-xl font-serif italic text-white leading-tight">{previewData.title}</h3>
                                            <p className="text-[10px] text-text-muted leading-relaxed max-w-[200px]">
                                                Synthesized via Dremi Neural Core. Professional architecture active.
                                            </p>
                                            <div className="flex gap-2 mt-2">
                                                <button 
                                                    onClick={() => setShowPortal(true)}
                                                    className="bg-accent px-4 py-2 rounded-lg text-[9px] font-bold uppercase tracking-widest active:scale-95 transition-all shadow-lg shadow-accent/20"
                                                >
                                                    Launch Portal
                                                </button>
                                                <button 
                                                    onClick={handleShare}
                                                    className="bg-white/5 border border-white/10 px-4 py-2 rounded-lg text-[9px] font-bold uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-2"
                                                >
                                                    <Copy size={10} className={isSharing ? 'text-accent' : ''} />
                                                    {isSharing ? 'Copied' : 'Share'}
                                                </button>
                                            </div>
                                        </div>

                                        {/* Dynamic Modules */}
                                        <div className="grid grid-cols-1 gap-2">
                                            {previewData.sections.map((s, i) => (
                                                <div key={i} className="p-3 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-between group cursor-pointer relative">
                                                    {activeView === 'debug' && (
                                                        <div className="absolute inset-0 border border-dashed border-white/20 pointer-events-none flex items-center justify-end pr-10">
                                                            <span className="text-[5px] uppercase tracking-widest text-white/20">MODULE_ROW_{i}</span>
                                                        </div>
                                                    )}
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-7 h-7 rounded-lg bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-all">
                                                            <Zap size={12} className="text-accent" />
                                                        </div>
                                                        <div className="text-[10px] font-bold text-white/90">{s}</div>
                                                    </div>
                                                    <div className="w-1 h-1 rounded-full bg-accent shadow-[0_0_8px_var(--color-accent)]" />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex-1 flex flex-col justify-center items-center text-center gap-4 py-10 opacity-50 grayscale">
                                        <div className="w-12 h-12 rounded-full border border-dashed border-white/10 animate-spin flex items-center justify-center">
                                            <Code size={14} className="text-white/20" />
                                        </div>
                                        <div className="text-[8px] text-text-muted uppercase tracking-[0.2em]">Awaiting Protocol</div>
                                    </div>
                                )}
                            </div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Footer Meta */}
                {previewData && (
                    <div className="p-3 bg-black/20 border-t border-white/5 shrink-0 flex justify-between items-center">
                        <div className="flex flex-col">
                            <span className="text-[7px] uppercase tracking-widest text-text-muted">Status</span>
                            <span className="text-[9px] text-accent font-mono animate-pulse uppercase">Deployment Ready</span>
                        </div>
                        <button 
                            onClick={() => window.open(window.location.href, '_blank')}
                            className="bg-white/5 text-text-muted p-2 rounded-md hover:text-white transition-colors"
                        >
                            <Download size={12} />
                        </button>
                    </div>
                )}
            </motion.div>
        </div>

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
