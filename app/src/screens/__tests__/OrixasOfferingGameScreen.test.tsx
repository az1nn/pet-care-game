import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import { OrixasOfferingGameScreen } from '../OrixasOfferingGameScreen';

const mockUpdateBestScore = jest.fn();

jest.mock('../../context/OrixasOfferingContext', () => ({
  useOrixasOffering: () => ({ bestScore: 0, updateBestScore: mockUpdateBestScore }),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

const mockGoBack = jest.fn();
const mockCanGoBack = jest.fn(() => true);
const mockGetParent = jest.fn(() => ({ goBack: jest.fn() }));

const navigation = {
  goBack: mockGoBack,
  canGoBack: mockCanGoBack,
  getParent: mockGetParent,
};

describe('OrixasOfferingGameScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('renders the back button and score', () => {
    const { getByText } = render(<OrixasOfferingGameScreen navigation={navigation as any} />);
    expect(getByText(/← common\.back/)).toBeTruthy();
    expect(getByText('0')).toBeTruthy();
  });

  it('navigates back when the back button is pressed', () => {
    const { getByText } = render(<OrixasOfferingGameScreen navigation={navigation as any} />);
    fireEvent.press(getByText(/← common\.back/));
    expect(mockGoBack).toHaveBeenCalledTimes(1);
  });

  it('uses parent navigation when the current navigator cannot go back', () => {
    const parentGoBack = jest.fn();
    mockCanGoBack.mockReturnValue(false);
    mockGetParent.mockReturnValue({
      goBack: parentGoBack,
      canGoBack: () => true,
      getParent: () => undefined,
    });

    const { getByText } = render(<OrixasOfferingGameScreen navigation={navigation as any} />);
    fireEvent.press(getByText(/← common\.back/));
    expect(parentGoBack).toHaveBeenCalledTimes(1);
  });

  it('shows game over modal when time runs out', () => {
    const { getByText } = render(<OrixasOfferingGameScreen navigation={navigation as any} />);

    act(() => {
      jest.advanceTimersByTime(60000);
    });

    expect(getByText('orixasOffering.game.gameOver')).toBeTruthy();
  });
});
