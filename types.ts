export type Gender = 'male' | 'female';

export interface Pet {
  id: string;
  name: string;
  type: string;
  gender: Gender;
  age: number;
  hunger: number;
  happiness: number;
  health: number;
}

export interface GameState {
  pets: Pet[];
  currentPetId: string | null;
}
