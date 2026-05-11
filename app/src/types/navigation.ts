/**
 * Navigation type definitions
 *
 * Defines the navigation structure for the entire application.
 * This provides type safety for navigation params and prevents
 * runtime errors from incorrect navigation calls.
 */

import { NativeStackNavigationProp } from '@react-navigation/native-stack';

/**
 * Root stack navigation parameter list
 *
 * Defines all routes in the application and their parameters.
 * - `undefined` means the route doesn't accept any parameters
 * - Use object types for routes that accept parameters
 */
export type RootStackParamList = {
  /** Main menu screen */
  Menu: undefined;
  /** Pet creation screen */
  CreatePet: undefined;
  /** Home screen with pet display */
  Home: undefined;
  /** Feeding scene */
  Feed: undefined;
  /** Bathing scene */
  Bath: undefined;
  /** Playing scene */
  Play: undefined;
  /** Sleeping scene */
  Sleep: undefined;
  /** Veterinary scene */
  Vet: undefined;
  /** Wardrobe customization scene */
  Wardrobe: undefined;
  /** Help and FAQ screen */
  Help: undefined;
  /** Game selection screen */
  GameSelection: undefined;
  /** Mini-game screens */
  BalloonFloatHome: undefined;
  BalloonFloatGame: undefined;
  BubblePopHome: undefined;
  BubblePopGame: undefined;
  CatchTheBallHome: undefined;
  CatchTheBallGame: undefined;
  ColorMixerHome: undefined;
  ColorMixerGame: { level: number };
  ColorMixerLevels: undefined;
  ColorTapHome: undefined;
  ColorTapGame: undefined;
  ConnectDotsHome: undefined;
  ConnectDotsGame: undefined;
  DressUpRelayHome: undefined;
  DressUpRelayGame: undefined;
  FeedThePetHome: undefined;
  FeedThePetGame: undefined;
  GardenGrowHome: undefined;
  GardenGrowGame: undefined;
  GbaEmulatorHome: undefined;
  GbaEmulatorGame: undefined;
  HideAndSeekHome: undefined;
  HideAndSeekGame: undefined;
  KidsChessHome: undefined;
  KidsChessGame: { difficulty: 'puppy' | 'kitten' | 'bunny' | 'fox' | 'owl' };
  JigsawPetsHome: undefined;
  JigsawPetsGame: undefined;
  LightningTapHome: undefined;
  LightningTapGame: undefined;
  MemoryMatchHome: undefined;
  MemoryMatchGame: {
    difficulty: 'easy' | 'medium' | 'hard' | 'expert';
    mode: 'classic' | 'timeAttack';
  };
  MirrorMatchHome: undefined;
  MirrorMatchGame: undefined;
  MusicMakerHome: undefined;
  MusicMakerGame: undefined;
  PaintSplashHome: undefined;
  PaintSplashGame: undefined;
  PathFinderHome: undefined;
  PathFinderGame: undefined;
  PetChefHome: undefined;
  PetChefGame: undefined;
  PetDancePartyHome: undefined;
  PetDancePartyGame: undefined;
  PetExplorerHome: undefined;
  PetExplorerGame: undefined;
  PetRunnerHome: undefined;
  PetRunnerGame: undefined;
  PetTaxiHome: undefined;
  PetTaxiGame: undefined;
  PhotoStudioHome: undefined;
  PhotoStudioGame: undefined;
  ShapeSorterHome: undefined;
  ShapeSorterGame: undefined;
  SimonSaysHome: undefined;
  SimonSaysGame: undefined;
  SlidingPuzzleHome: undefined;
  SlidingPuzzleGame: { difficulty: 'easy' | 'hard' };
  SnackStackHome: undefined;
  SnackStackGame: undefined;
  OrixasOfferingHome: undefined;
  OrixasOfferingGame: undefined;
  StarCatcherHome: undefined;
  StarCatcherGame: undefined;
  TreasureDigHome: undefined;
  TreasureDigGame: undefined;
  WeatherWizardHome: undefined;
  WeatherWizardGame: undefined;
  WhackAMoleHome: undefined;
  WhackAMoleGame: undefined;
  WordBubblesHome: undefined;
  WordBubblesGame: undefined;
  CountingKennelHome: undefined;
  CountingKennelGame: undefined;
  PatternPawsHome: undefined;
  PatternPawsGame: undefined;
  MazePupsHome: undefined;
  MazePupsGame: undefined;
  SpotDifferenceHome: undefined;
  SpotDifferenceGame: undefined;
  PetTangramHome: undefined;
  PetTangramGame: undefined;
  PetDoctorHome: undefined;
  PetDoctorGame: undefined;
  PetDiaryHome: undefined;
  PetDiaryGame: undefined;
  PetGroomingHome: undefined;
  PetGroomingGame: undefined;
  PetLullabyHome: undefined;
  PetLullabyGame: undefined;
  PetPlaygroundHome: undefined;
  PetPlaygroundGame: undefined;
  /** Board game screens */
  TicTacToeHome: undefined;
  TicTacToeGame: { difficulty: 'puppy' | 'kitten' | 'owl' };
  KidsCheckersHome: undefined;
  KidsCheckersGame: { difficulty: 'puppy' | 'kitten' | 'bunny' | 'fox' | 'owl' };
  SnakesLaddersHome: undefined;
  SnakesLaddersGame: undefined;
  MemoryBoardHome: undefined;
  MemoryBoardGame: { difficulty: 'easy' | 'medium' | 'hard' };
  KidsLudoHome: undefined;
  KidsLudoGame: { players: 2 | 4 };
  PillowFightHome: undefined;
  PillowFightGame: undefined;
  SoapBubbleShapesHome: undefined;
  SoapBubbleShapesGame: undefined;
  PetParadeHome: undefined;
  PetParadeGame: undefined;
  TreatTossHome: undefined;
  TreatTossGame: undefined;
  SplashyBathHome: undefined;
  SplashyBathGame: undefined;
  /** Multiplayer screens */
  MuitoHome: undefined;
  MuitoLobby: undefined;
  MuitoGame: undefined;
  MuitoMultiGame: undefined;
  MuitoResults: undefined;
};

/**
 * Type-safe navigation prop for any screen
 *
 * Usage:
 * ```typescript
 * const navigation = useNavigation<RootNavigationProp>();
 * navigation.navigate('Home'); // ✓ Type-safe
 * navigation.navigate('InvalidRoute'); // ✗ TypeScript error
 * ```
 */
export type RootNavigationProp = NativeStackNavigationProp<RootStackParamList>;

/**
 * Type-safe navigation prop for a specific screen
 *
 * Usage:
 * ```typescript
 * type Props = {
 *   navigation: ScreenNavigationProp<'Home'>;
 * };
 * ```
 */
export type ScreenNavigationProp<T extends keyof RootStackParamList> = NativeStackNavigationProp<
  RootStackParamList,
  T
>;
