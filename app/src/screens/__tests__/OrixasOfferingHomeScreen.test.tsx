import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { OrixasOfferingHomeScreen } from '../OrixasOfferingHomeScreen';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

const mockUpdateBestScore = jest.fn();
const mockUseHook = jest.fn(() => ({
  bestScore: 0,
  updateBestScore: mockUpdateBestScore,
}));

jest.mock('../../context/OrixasOfferingContext', () => ({
  useOrixasOffering: () => mockUseHook(),
}));

const mockNavigate = jest.fn();
const mockGoBack = jest.fn();
const mockCanGoBack = jest.fn(() => true);
const mockGetParent = jest.fn(() => ({ goBack: jest.fn() }));

const navigation = {
  navigate: mockNavigate,
  goBack: mockGoBack,
  canGoBack: mockCanGoBack,
  getParent: mockGetParent,
};

describe('OrixasOfferingHomeScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseHook.mockReturnValue({ bestScore: 0, updateBestScore: mockUpdateBestScore });
  });

  it('renders title and play button', () => {
    const { getByText } = render(<OrixasOfferingHomeScreen navigation={navigation as any} />);
    expect(getByText('orixasOffering.home.title')).toBeTruthy();
    expect(getByText('orixasOffering.home.play')).toBeTruthy();
  });

  it('shows best score when greater than 0', () => {
    mockUseHook.mockReturnValue({ bestScore: 350, updateBestScore: mockUpdateBestScore });
    const { getByText } = render(<OrixasOfferingHomeScreen navigation={navigation as any} />);
    expect(getByText('350')).toBeTruthy();
    expect(getByText('orixasOffering.home.bestScore')).toBeTruthy();
  });

  it('does not show best score when 0', () => {
    const { queryByText } = render(<OrixasOfferingHomeScreen navigation={navigation as any} />);
    expect(queryByText('orixasOffering.home.bestScore')).toBeNull();
  });

  it('navigates to game on play press', () => {
    const { getByText } = render(<OrixasOfferingHomeScreen navigation={navigation as any} />);
    fireEvent.press(getByText('orixasOffering.home.play'));
    expect(mockNavigate).toHaveBeenCalledWith('OrixasOfferingGame');
  });

  it('navigates back on back press', () => {
    const { getByText } = render(<OrixasOfferingHomeScreen navigation={navigation as any} />);
    fireEvent.press(getByText('← common.back'));
    expect(mockGoBack).toHaveBeenCalledTimes(1);
  });
});
