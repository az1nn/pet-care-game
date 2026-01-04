import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Pet, PetType, PetColor, Gender, ClothingSlot } from '../types';
import { savePet, loadPet, deletePet } from '../utils/storage';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

type PetContextType = {
  pet: Pet | null;
  isLoading: boolean;
  createPet: (name: string, type: PetType, gender: Gender, color: PetColor) => Promise<void>;
  feed: (amount?: number) => void;
  play: () => void;
  bathe: (amount?: number) => void;
  setClothing: (slot: ClothingSlot, itemId: string | null) => void;
  removePet: () => Promise<void>;
  earnMoney: (amount: number) => void;
};

const PetContext = createContext<PetContextType | undefined>(undefined);

export const PetProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [pet, setPet] = useState<Pet | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPet().then((loadedPet) => {
      setPet(loadedPet);
      setIsLoading(false);
    });
  }, []);

  // Decaimento gradual de fome e higiene
  useEffect(() => {
    const interval = setInterval(() => {
      setPet((currentPet) => {
        if (!currentPet) return currentPet;
        
        const updatedPet: Pet = {
          ...currentPet,
          hunger: Math.max(0, currentPet.hunger - 1),
          hygiene: Math.max(0, currentPet.hygiene - 1),
        };
        // Save asynchronously without blocking state update
        savePet(updatedPet).catch(console.error);
        return updatedPet;
      });
    }, 60000); // a cada minuto

    return () => clearInterval(interval);
  }, []);

  const createPet = async (name: string, type: PetType, gender: Gender, color: PetColor) => {
    const newPet: Pet = {
      id: uuidv4(),
      name,
      type,
      color,
      gender,
      hunger: 100,
      hygiene: 100,
      money: 0,
      clothes: {
        head: null,
        eyes: null,
        torso: null,
        paws: null,
      },
      createdAt: Date.now(),
    };
    setPet(newPet);
    await savePet(newPet);
  };

  const feed = (amount = 25) => {
    setPet((currentPet) => {
      if (!currentPet) return currentPet;
      
      const updatedPet: Pet = {
        ...currentPet,
        hunger: Math.min(100, currentPet.hunger + amount),
      };
      savePet(updatedPet).catch(console.error);
      return updatedPet;
    });
  };

  const play = () => {
    setPet((currentPet) => {
      if (!currentPet) return currentPet;
      
      const updatedPet: Pet = {
        ...currentPet,
        hunger: Math.max(0, currentPet.hunger - 20),
      };
      savePet(updatedPet).catch(console.error);
      return updatedPet;
    });
  };

  const bathe = (amount = 30) => {
    setPet((currentPet) => {
      if (!currentPet) return currentPet;
      
      const updatedPet: Pet = {
        ...currentPet,
        hygiene: Math.min(100, currentPet.hygiene + amount),
        hunger: Math.max(0, currentPet.hunger - 10),
      };
      savePet(updatedPet).catch(console.error);
      return updatedPet;
    });
  };

  const setClothing = (slot: ClothingSlot, itemId: string | null) => {
    setPet((currentPet) => {
      if (!currentPet) return currentPet;
      
      const updatedPet: Pet = {
        ...currentPet,
        clothes: {
          ...currentPet.clothes,
          [slot]: itemId,
        },
      };
      savePet(updatedPet).catch(console.error);
      return updatedPet;
    });
  };

  const removePet = async () => {
    await deletePet();
    setPet(null);
  };

  const earnMoney = (amount: number) => {
    setPet((currentPet) => {
      if (!currentPet) return currentPet;
      
      const updatedPet: Pet = {
        ...currentPet,
        money: (currentPet.money ?? 0) + amount, // Defensive fallback for robustness
      };
      savePet(updatedPet).catch(console.error);
      return updatedPet;
    });
  };

  return (
    <PetContext.Provider
      value={{
        pet,
        isLoading,
        createPet,
        feed,
        play,
        bathe,
        setClothing,
        removePet,
        earnMoney,
      }}
    >
      {children}
    </PetContext.Provider>
  );
};

export const usePet = (): PetContextType => {
  const context = useContext(PetContext);
  if (!context) {
    throw new Error('usePet deve ser usado dentro de PetProvider');
  }
  return context;
};