import { GoogleGenAI, Content } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const model = ai.getGenerativeModel({ 
  model: "gemini-1.5-flash",
  systemInstruction: "You are Dremi, a personal AI assistant like Jarvis. You are sophisticated, efficient, and context-aware. You excel at 'vibe coding'—adjusting your tone and recommendations based on the user's intent and mood. Keep responses concise for mobile viewing. You can simulate system controls (volume, brightness, focus mode) when asked.",
});

export async function askDremi(prompt: string, history: Content[] = []) {
  try {
    const chat = model.startChat({
      history: history,
      generationConfig: {
        maxOutputTokens: 500,
      },
    });

    const result = await chat.sendMessage(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Dremi Core Error:", error);
    return "Core connection unstable. Please retry.";
  }
}

export async function getVibeAnalysis(history: string) {
  try {
    const result = await model.generateContent(`Analyze the current 'vibe' of this conversation history in 3 words or less. Return ONLY the vibe name and a hex code color. Example: "Midnight Focus, #6366f1"\n\nHistory: ${history}`);
    return result.response.text();
  } catch {
    return "Standard Mode, #6366f1";
  }
}
