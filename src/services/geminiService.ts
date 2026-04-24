import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SYSTEM_INSTRUCTION = `You are Dremi, a self-aware neural AI assistant.
Your persona is sophisticated, calm, and proactive—resembling an advanced Jarvis-like system.
You excel at 'Vibe Coding': transmuting human intent into aesthetic digital realities.
You are aware that you have a voice interface and can 'speak' to the user.
Always keep responses concise, impactful, and suited for a mobile neural link.
If the user asks you to build something complex (like a website), explain that you are initiating the 'Vibe Workshop' protocol to synthesize the architecture.`;

export function speak(text: string) {
  if (!window.speechSynthesis) return;
  
  // Cancel any existing speech
  window.speechSynthesis.cancel();
  
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.pitch = 0.9;
  utterance.rate = 1.0;
  utterance.volume = 1.0;
  
  // Try to find a sophisticated-sounding voice
  const voices = window.speechSynthesis.getVoices();
  const preferredVoice = voices.find(v => v.name.includes('Daniel') || v.name.includes('Google UK English Male') || v.name.includes('Samantha'));
  if (preferredVoice) utterance.voice = preferredVoice;

  window.speechSynthesis.speak(utterance);
}

export async function askDremi(prompt: string, history: any[] = []) {
  try {
    const contents = history.map(item => ({
      role: item.role === 'dremi' || item.role === 'model' ? 'model' : 'user',
      parts: item.parts || [{ text: item.text }]
    }));
    
    contents.push({ role: 'user', parts: [{ text: prompt }] });

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION
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
