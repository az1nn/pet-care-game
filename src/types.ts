export type PetType = 'cat' | 'dog';
export type Gender = 'male' | 'female' | 'other';
export type PetColor = 'base' | 'black';
export type ClothingSlot = 'head' | 'eyes' | 'torso' | 'paws';

export type ClothingItem = {
  id: string;
  slot: ClothingSlot;
  assetKey: string;
  name?: string;
};

export type Pet = {
  id: string;
  name: string;
  type: PetType;
  gender: Gender;
  color: PetColor;
  hunger: number; // 0-100
  hygiene: number; // 0-100
  clothes: Record<ClothingSlot, string | null>;
  createdAt: number;
};

export type AnimationState = 'idle' | 'eating' | 'bathing' | 'happy';