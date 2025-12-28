import { ClothingItem, ClothingSlot } from '../types';

type ClothingItemWithAsset = ClothingItem & {
  asset: any;
};

// Substitua `asset: null` por require real quando adicionar os PNGs.
export const CLOTHING_ITEMS: ClothingItemWithAsset[] = [
  // Head
  { id: 'hat_red', slot: 'head', assetKey: 'hat_red', name: 'Chapéu Vermelho', asset: null },
  { id: 'hat_blue', slot: 'head', assetKey: 'hat_blue', name: 'Chapéu Azul', asset: null },
  { id: 'crown', slot: 'head', assetKey: 'crown', name: 'Coroa', asset: null },

  // Eyes
  { id: 'eyes_big', slot: 'eyes', assetKey: 'eyes_big', name: 'Olhos Grandes', asset: null },
  { id: 'eyes_star', slot: 'eyes', assetKey: 'eyes_star', name: 'Olhos Estrela', asset: null },
  { id: 'glasses', slot: 'eyes', assetKey: 'glasses', name: 'Óculos', asset: null },

  // Torso
  { id: 'shirt_blue', slot: 'torso', assetKey: 'shirt_blue', name: 'Camiseta Azul', asset: null },
  { id: 'shirt_red', slot: 'torso', assetKey: 'shirt_red', name: 'Camiseta Vermelha', asset: null },
  { id: 'dress_pink', slot: 'torso', assetKey: 'dress_pink', name: 'Vestido Rosa', asset: null },

  // Paws
  { id: 'paws_boots', slot: 'paws', assetKey: 'paws_boots', name: 'Botas', asset: null },
  { id: 'paws_socks', slot: 'paws', assetKey: 'paws_socks', name: 'Meias', asset: null },
];

export const getItemsBySlot = (slot: ClothingSlot): ClothingItemWithAsset[] => {
  return CLOTHING_ITEMS.filter((item) => item.slot === slot);
};