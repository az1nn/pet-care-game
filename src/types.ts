export type PetType = 'cat' | 'dog';
export type PetColor = 'base' | 'black';
export type Gender = 'male' | 'female' | 'other';
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
  color: PetColor;
  gender: Gender;
  hunger: number; // 0-100
  hygiene: number; // 0-100
  clothes: Record<ClothingSlot, string | null>;
  createdAt: number;
  money: number; // pet coins
};

export type AnimationState = 'idle' | 'eating' | 'bathing' | 'happy';