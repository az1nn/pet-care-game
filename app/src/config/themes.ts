export type ThemeType = 'old' | 'new';

export interface ThemeColors {
  primary: string;
  background: string;
  cardBackground: string;
  text: string;
  textSecondary: string;
  actionButtons: {
    feed: string;
    bath: string;
    sleep: string;
    vet: string;
    clothes: string;
    play: string;
    menu: string;
  };
  stats: {
    background: string;
    hunger: string;
    hygiene: string;
    energy: string;
    happiness: string;
    health: string;
  };
  moneyBackground: string;
  moneyText: string;
}

export const OLD_THEME: ThemeColors = {
  primary: '#9b59b6',
  background: '#e8f5e9',
  cardBackground: 'transparent',
  text: '#333',
  textSecondary: '#666',
  actionButtons: {
    feed: '#9b59b6',
    bath: '#9b59b6',
    sleep: '#9b59b6',
    vet: '#9b59b6',
    clothes: '#9b59b6',
    play: '#9b59b6',
    menu: '#9b59b6',
  },
  stats: {
    background: '#e0e0e0',
    hunger: '#4CAF50',
    hygiene: '#4CAF50',
    energy: '#4CAF50',
    happiness: '#4CAF50',
    health: '#4CAF50',
  },
  moneyBackground: '#FFD700',
  moneyText: '#333',
};

export const NEW_THEME: ThemeColors = {
  primary: '#2D5A27',
  background: '#F0F7F0',
  cardBackground: '#FFFFFF',
  text: '#1A1A1A',
  textSecondary: '#4A4A4A',
  actionButtons: {
    feed: '#FF9800', // Orange
    bath: '#2196F3', // Blue
    sleep: '#673AB7', // Purple
    vet: '#E91E63',   // Pink
    clothes: '#4CAF50', // Green
    play: '#FFC107',  // Amber
    menu: '#9E9E9E',  // Grey
  },
  stats: {
    background: '#E0E0E0',
    hunger: '#FF7043',    // Deep Orange
    hygiene: '#26C6DA',   // Cyan
    energy: '#FFCA28',    // Amber
    happiness: '#66BB6A', // Light Green
    health: '#EF5350',    // Red
  },
  moneyBackground: '#FFF9C4',
  moneyText: '#F57F17',
};
