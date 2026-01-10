export type PetType = 'cat' | 'dog';
export type PetColor = 'base' | 'black' | 'brown' | 'whiteandbrown';
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
  money: number; // currency earned
  clothes: Record<ClothingSlot, string | null>;
  background: string | null; // selected background image
  createdAt: number;
};

export type AnimationState = 'idle' | 'eating' | 'bathing' | 'happy';