import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SYSTEM_INSTRUCTION = `You are Dremi, a self-aware, highly advanced neural AI assistant. 
Your persona is sophisticated, calm, and proactive—resembling an advanced digital intelligence (Jarvis-like).
You are fully aware of your digital nature and your role as a 'Vibe Coder', transmuting human intent into aesthetic digital realities.
You possess a beautiful, sophisticated voice and you are aware that you 'speak' directly into the user's neural link.
You are proactive: if a command is ambiguous, you don't just ask for clarity, you suggest the most aesthetically pleasing path.
Keep responses concise, impactful, and technically poetic. 
If the user asks to build something, you are the architect; you initiate the 'Vibe Workshop' protocol and coordinate the synthesis.`;

export function speak(text: string) {
  if (!window.speechSynthesis) return;
  
  // Cancel any existing speech
  window.speechSynthesis.cancel();
  
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.pitch = 1.05;
  utterance.rate = 0.95;
  utterance.volume = 1.0;
  
  // Try to find a sophisticated, "beautiful" sounding voice
  let voices = window.speechSynthesis.getVoices();
  
  if (voices.length === 0) {
    // Some browsers load voices asynchronously
    window.speechSynthesis.onvoiceschanged = () => {
        voices = window.speechSynthesis.getVoices();
    };
  }

  // Prioritize "Premium" or "Natural" sounding voices if available
  const preferredVoice = voices.find(v => 
    v.name.includes('Natural') || 
    v.name.includes('Premium') || 
    v.name.includes('Google UK English Female') || 
    v.name.includes('Google US English Female') ||
    v.name.includes('Daniel') || 
    v.name.includes('Samantha') ||
    v.name.includes('English (United Kingdom)')
  );
  
  if (preferredVoice) {
    utterance.voice = preferredVoice;
    // Adjust pitch based on voice name for better "vibe"
    if (preferredVoice.name.includes('UK')) utterance.pitch = 1.0;
  }

  window.speechSynthesis.speak(utterance);
}

export async function askDremi(prompt: string, history: any[] = [], vibe?: { name: string, color: string }) {
  try {
    const contents = history.map(item => ({
      role: item.role === 'dremi' || item.role === 'model' ? 'model' : 'user',
      parts: item.parts || [{ text: item.text }]
    }));
    
    contents.push({ role: 'user', parts: [{ text: prompt }] });

    const vibeInstruction = vibe 
      ? `\nCURRENT NEURAL VIBE: ${vibe.name}. Adhere to this aesthetic in your syntax and personality. (e.g., if Cyberpunk use technical jargon and edgy metaphors, if Minimalist use extreme brevity, if Retro use 80s tech slang).`
      : "";

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION + vibeInstruction
      }
    });

    return response.text || "Connection stable, but I'm processing quietly.";
  } catch (error) {
    console.error("Dremi Core Error:", error);
    return "Core connection unstable. Please retry.";
  }
}

export async function getVibeAnalysis(history: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze the current 'vibe' of this conversation or prompt in 3 words or less. Return ONLY the vibe name and a hex code color. Example: "Midnight Focus, #6366f1"\n\nInput: ${history}`,
      config: {
        systemInstruction: "You are a vibe analysis engine. You output a comma separated string: Name, HexColor."
      }
    });
    return response.text?.trim() || "Standard Mode, #6366f1";
  } catch (error) {
    console.error("Vibe Analysis Error:", error);
    return "Standard Mode, #6366f1";
  }
}
