import React, { createContext, useContext, useState, useEffect } from 'react';

type Vibe = {
  name: string;
  color: string;
  intensity: number;
};

interface VibeContextType {
  currentVibe: Vibe;
  updateVibe: (name: string, color: string) => void;
}

const VibeContext = createContext<VibeContextType | undefined>(undefined);

export function VibeProvider({ children }: { children: React.ReactNode }) {
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
    setCurrentVibe({ name, color, intensity: 0.8 });
    // Update CSS Variable for global theme usage
    document.documentElement.style.setProperty('--color-accent', color);
  };

  return (
    <VibeContext.Provider value={{ currentVibe, updateVibe }}>
      {children}
    </VibeContext.Provider>
  );
}

export const useVibe = () => {
  const context = useContext(VibeContext);
  if (!context) throw new Error('useVibe must be used within a VibeProvider');
  return context;
};
