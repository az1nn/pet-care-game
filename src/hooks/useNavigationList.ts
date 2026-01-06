import { useState, useCallback } from 'react';

export interface UseNavigationListResult<T> {
  currentItem: T;
  currentIndex: number;
  goToNext: () => void;
  goToPrevious: () => void;
  hasNext: boolean;
  hasPrevious: boolean;
  totalItems: number;
}

/**
 * Custom hook for navigating through a list of items with next/previous functionality
 * @param items Array of items to navigate through
 * @param initialIndex Optional starting index (default: 0)
 * @returns Navigation state and controls
 */
export function useNavigationList<T>(
  items: T[],
  initialIndex: number = 0
): UseNavigationListResult<T> {
  const [currentIndex, setCurrentIndex] = useState(
    Math.max(0, Math.min(initialIndex, items.length - 1))
  );

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  }, [items.length]);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  }, [items.length]);

  const hasNext = currentIndex < items.length - 1;
  const hasPrevious = currentIndex > 0;

  return {
    currentItem: items[currentIndex],
    currentIndex,
    goToNext,
    goToPrevious,
    hasNext,
    hasPrevious,
    totalItems: items.length,
  };
}
