import React, { createContext, useContext, useState, useEffect } from 'react';

interface Vibe {
  name: string;
  color: string;
  intensity: number;
}

interface VibeContextType {
  currentVibe: Vibe;
  updateVibe: (name: string, color: string) => void;
  isSyncing: boolean;
}

const VibeContext = createContext<VibeContextType | undefined>(undefined);

export function VibeProvider({ children }: { children: React.ReactNode }) {
  const [isSyncing, setIsSyncing] = useState(false);
  const [currentVibe, setCurrentVibe] = useState<Vibe>({
    name: 'Neutral Optimal',
    color: '#6366f1',
    intensity: 0.5,
  });

  // Automatically adjust based on time of day if no recent interaction
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 22 || hour < 5) {
      setCurrentVibe(prev => ({ ...prev, name: 'Midnight Focus', color: '#818cf8' }));
    } else if (hour >= 5 && hour < 12) {
      setCurrentVibe(prev => ({ ...prev, name: 'Morning Glow', color: '#fbbf24' }));
    }
  }, []);

  const updateVibe = (name: string, color: string) => {
    setIsSyncing(true);
    setCurrentVibe({ name, color, intensity: 0.8 });
    document.documentElement.style.setProperty('--color-accent', color);
    
    // Simulate neural sync delay
    setTimeout(() => setIsSyncing(false), 2000);
  };

  return (
    <VibeContext.Provider value={{ currentVibe, updateVibe, isSyncing }}>
      {children}
    </VibeContext.Provider>
  );
}

export const useVibe = () => {
  const context = useContext(VibeContext);
  if (!context) throw new Error('useVibe must be used within a VibeProvider');
  return context;
};
