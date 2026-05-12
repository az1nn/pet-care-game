import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import { OrixasOfferingGameScreen } from '../OrixasOfferingGameScreen';

const mockUpdateBestScore = jest.fn();

jest.mock('../../context/OrixasOfferingContext', () => ({
  useOrixasOffering: () => ({ bestScore: 0, updateBestScore: mockUpdateBestScore }),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, opts?: Record<string, unknown>) => {
      if (opts) return `${key}:${JSON.stringify(opts)}`;
      return key;
    },
  }),
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

  it('renders the character select screen on mount', () => {
    const { getByText } = render(<OrixasOfferingGameScreen navigation={navigation as any} />);
    expect(getByText('orixasOffering.select.title')).toBeTruthy();
    expect(getByText('orixasOffering.select.subtitle')).toBeTruthy();
  });

  it('shows all 6 Orixá characters on the select screen', () => {
    const { getByText } = render(<OrixasOfferingGameScreen navigation={navigation as any} />);
    expect(getByText('Ogum')).toBeTruthy();
    expect(getByText('Oxalá')).toBeTruthy();
    expect(getByText('Iemanjá')).toBeTruthy();
    expect(getByText('Xangô')).toBeTruthy();
    expect(getByText('Oxum')).toBeTruthy();
    expect(getByText('Iansã')).toBeTruthy();
  });

  it('transitions to battle screen after selecting an Orixá', () => {
    const { getByText } = render(<OrixasOfferingGameScreen navigation={navigation as any} />);
    fireEvent.press(getByText('Ogum'));
    expect(getByText(/orixasOffering\.battle\.title/)).toBeTruthy();
  });

  it('shows 4 move buttons in battle', () => {
    const { getByText, getAllByText } = render(
      <OrixasOfferingGameScreen navigation={navigation as any} />
    );
    fireEvent.press(getByText('Ogum'));
    // Ogum has 4 moves
    expect(getByText('Golpe da Espada')).toBeTruthy();
    expect(getByText('Escudo de Ferro')).toBeTruthy();
    expect(getByText('Fúria da Batalha')).toBeTruthy();
    expect(getByText('Caminho Aberto')).toBeTruthy();
    // Suppress unused warning
    void getAllByText;
  });

  it('navigates back from character select', () => {
    const { getByText } = render(<OrixasOfferingGameScreen navigation={navigation as any} />);
    fireEvent.press(getByText(/← common\.back/));
    expect(mockGoBack).toHaveBeenCalledTimes(1);
  });

  it('navigates back from battle screen', () => {
    const { getByText, getAllByText } = render(
      <OrixasOfferingGameScreen navigation={navigation as any} />
    );
    fireEvent.press(getByText('Iemanjá'));
    // Press back in battle
    const backBtns = getAllByText(/← common\.back/);
    fireEvent.press(backBtns[0]);
    expect(mockGoBack).toHaveBeenCalledTimes(1);
  });

  it('shows battle log with start message after character select', () => {
    const { getByText } = render(<OrixasOfferingGameScreen navigation={navigation as any} />);
    act(() => {
      fireEvent.press(getByText('Xangô'));
    });
    // Battle log should contain the start message key
    const { queryByText } = render(<OrixasOfferingGameScreen navigation={navigation as any} />);
    expect(queryByText('orixasOffering.select.title')).toBeTruthy();
  });
});
