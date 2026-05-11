import React, { createContext, useContext } from 'react';
import { useGameBestScore } from '../hooks/useGameBestScore';

interface OrixasOfferingContextType {
  bestScore: number;
  updateBestScore: (score: number) => void;
}

const OrixasOfferingContext = createContext<OrixasOfferingContextType | undefined>(undefined);

export const OrixasOfferingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { bestScore, updateBestScore } = useGameBestScore('@orixas_offering:bestScore');
  return (
    <OrixasOfferingContext.Provider value={{ bestScore, updateBestScore }}>
      {children}
    </OrixasOfferingContext.Provider>
  );
};

export const useOrixasOffering = () => {
  const ctx = useContext(OrixasOfferingContext);
  if (!ctx) throw new Error('useOrixasOffering must be used within OrixasOfferingProvider');
  return ctx;
};
