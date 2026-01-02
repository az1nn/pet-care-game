import AsyncStorage from '@react-native-async-storage/async-storage';
import { Pet } from '../types';

const PET_STORAGE_KEY = '@pet_care_game:pet';

export const savePet = async (pet: Pet): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(pet);
    await AsyncStorage.setItem(PET_STORAGE_KEY, jsonValue);
  } catch (error) {
    console.error('Erro ao salvar pet:', error);
    throw error;
  }
};

export const loadPet = async (): Promise<Pet | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem(PET_STORAGE_KEY);
    if (jsonValue == null) return null;
    
    const pet = JSON.parse(jsonValue);
    // Backward compatibility: add color field if it doesn't exist
    if (!pet.color) {
      pet.color = 'base';
    }
    return pet;
  } catch (error) {
    console.error('Erro ao carregar pet:', error);
    return null;
  }
};

export const deletePet = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(PET_STORAGE_KEY);
  } catch (error) {
    console.error('Erro ao deletar pet:', error);
    throw error;
  }
};