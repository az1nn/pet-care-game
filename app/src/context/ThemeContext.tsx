import React, { createContext, useContext, useEffect, useState, ReactNode, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeType, ThemeColors, OLD_THEME, NEW_THEME } from '../config/themes';
import { logger } from '../utils/logger';

interface ThemeContextType {
  themeType: ThemeType;
  colors: ThemeColors;
  setTheme: (type: ThemeType) => Promise<void>;
  isLoading: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = '@lillys_box_theme';

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [themeType, setThemeType] = useState<ThemeType>('old');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (savedTheme === 'old' || savedTheme === 'new') {
        setThemeType(savedTheme as ThemeType);
      }
    } catch (error) {
      logger.error('Failed to load theme preference:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const setTheme = async (type: ThemeType) => {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, type);
      setThemeType(type);
    } catch (error) {
      logger.error('Failed to save theme preference:', error);
    }
  };

  const colors = useMemo(() => {
    return themeType === 'new' ? NEW_THEME : OLD_THEME;
  }, [themeType]);

  const value = useMemo(() => ({
    themeType,
    colors,
    setTheme,
    isLoading
  }), [themeType, colors, isLoading]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
