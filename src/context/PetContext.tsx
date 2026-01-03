import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Pet, PetType, PetColor, Gender, ClothingSlot } from '../types';
import { savePet, loadPet, deletePet } from '../utils/storage';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

type PetContextType = {
  pet: Pet | null;
  isLoading: boolean;
  createPet: (name: string, type: PetType, gender: Gender, color: PetColor) => Promise<void>;
  feed: (amount?: number) => Promise<void>;
  play: () => Promise<void>;
  bathe: (amount?: number) => Promise<void>;
  setClothing: (slot: ClothingSlot, itemId: string | null) => Promise<void>;
  removePet: () => Promise<void>;
  earnMoney: (amount: number) => Promise<void>;
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
    if (!pet) return;

    const interval = setInterval(async () => {
      const updatedPet: Pet = {
        ...pet,
        hunger: Math.max(0, pet.hunger - 1),
        hygiene: Math.max(0, pet.hygiene - 1),
      };
      setPet(updatedPet);
      await savePet(updatedPet);
    }, 60000); // a cada minuto

    return () => clearInterval(interval);
  }, [pet]);

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

  const feed = async (amount = 25) => {
    if (!pet) return;
    const updatedPet: Pet = {
      ...pet,
      hunger: Math.min(100, pet.hunger + amount),
    };
    setPet(updatedPet);
    await savePet(updatedPet);
  };

  const play = async () => {
    if (!pet) return;
    const updatedPet: Pet = {
      ...pet,
      hunger: Math.max(0, pet.hunger - 20),
    };
    setPet(updatedPet);
    await savePet(updatedPet);
  };

  const bathe = async (amount = 30) => {
    if (!pet) return;
    const updatedPet: Pet = {
      ...pet,
      hygiene: Math.min(100, pet.hygiene + amount),
      hunger: Math.max(0, pet.hunger - 10),
    };
    setPet(updatedPet);
    await savePet(updatedPet);
  };

  const setClothing = async (slot: ClothingSlot, itemId: string | null) => {
    if (!pet) return;
    const updatedPet: Pet = {
      ...pet,
      clothes: {
        ...pet.clothes,
        [slot]: itemId,
      },
    };
    setPet(updatedPet);
    await savePet(updatedPet);
  };

  const removePet = async () => {
    await deletePet();
    setPet(null);
  };

  const earnMoney = async (amount: number) => {
    if (!pet) return;
    const updatedPet: Pet = {
      ...pet,
      money: pet.money + amount,
    };
    setPet(updatedPet);
    await savePet(updatedPet);
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