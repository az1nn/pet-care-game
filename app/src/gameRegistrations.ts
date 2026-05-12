import { gameRegistry } from './registry/GameRegistry';
import { PetProvider } from './context/PetContext';
import { PetGameNavigator } from './screens/PetGameNavigator';
import { MuitoProvider } from './context/MuitoContext';
import { MuitoNavigator } from './screens/MuitoNavigator';
import { ColorTapProvider } from './context/ColorTapContext';
import { ColorTapNavigator } from './screens/ColorTapNavigator';
import { MemoryMatchProvider } from './context/MemoryMatchContext';
import { MemoryMatchNavigator } from './screens/MemoryMatchNavigator';
import { PetRunnerProvider } from './context/PetRunnerContext';
import { PetRunnerNavigator } from './screens/PetRunnerNavigator';
import { SimonSaysProvider } from './context/SimonSaysContext';
import { SimonSaysNavigator } from './screens/SimonSaysNavigator';
import { DressUpRelayProvider } from './context/DressUpRelayContext';
import { DressUpRelayNavigator } from './screens/DressUpRelayNavigator';
import { ColorMixerProvider } from './context/ColorMixerContext';
import { ColorMixerNavigator } from './screens/ColorMixerNavigator';
import { FeedThePetProvider } from './context/FeedThePetContext';
import { FeedThePetNavigator } from './screens/FeedThePetNavigator';
import { WhackAMoleProvider } from './context/WhackAMoleContext';
import { WhackAMoleNavigator } from './screens/WhackAMoleNavigator';
import { CatchTheBallProvider } from './context/CatchTheBallContext';
import { CatchTheBallNavigator } from './screens/CatchTheBallNavigator';
import { SlidingPuzzleProvider } from './context/SlidingPuzzleContext';
import { SlidingPuzzleNavigator } from './screens/SlidingPuzzleNavigator';
import { BubblePopProvider } from './context/BubblePopContext';
import { BubblePopNavigator } from './screens/BubblePopNavigator';
import { PetDancePartyProvider } from './context/PetDancePartyContext';
import { PetDancePartyNavigator } from './screens/PetDancePartyNavigator';
import { TreasureDigProvider } from './context/TreasureDigContext';
import { TreasureDigNavigator } from './screens/TreasureDigNavigator';
import { BalloonFloatProvider } from './context/BalloonFloatContext';
import { BalloonFloatNavigator } from './screens/BalloonFloatNavigator';
import { PaintSplashProvider } from './context/PaintSplashContext';
import { PaintSplashNavigator } from './screens/PaintSplashNavigator';
import { SnackStackProvider } from './context/SnackStackContext';
import { SnackStackNavigator } from './screens/SnackStackNavigator';
import { LightningTapProvider } from './context/LightningTapContext';
import { LightningTapNavigator } from './screens/LightningTapNavigator';
import { PathFinderProvider } from './context/PathFinderContext';
import { PathFinderNavigator } from './screens/PathFinderNavigator';
import { ShapeSorterProvider } from './context/ShapeSorterContext';
import { ShapeSorterNavigator } from './screens/ShapeSorterNavigator';
import { MirrorMatchGameProvider } from './context/MirrorMatchContext';
import { MirrorMatchNavigator } from './screens/MirrorMatchNavigator';
import { WordBubblesProvider } from './context/WordBubblesContext';
import { WordBubblesNavigator } from './screens/WordBubblesNavigator';
import { JigsawPetsProvider } from './context/JigsawPetsContext';
import { JigsawPetsNavigator } from './screens/JigsawPetsNavigator';
import { ConnectDotsProvider } from './context/ConnectDotsContext';
import { ConnectDotsNavigator } from './screens/ConnectDotsNavigator';
import { PetExplorerProvider } from './context/PetExplorerContext';
import { PetExplorerNavigator } from './screens/PetExplorerNavigator';
import { WeatherWizardProvider } from './context/WeatherWizardContext';
import { WeatherWizardNavigator } from './screens/WeatherWizardNavigator';
import { PetTaxiProvider } from './context/PetTaxiContext';
import { PetTaxiNavigator } from './screens/PetTaxiNavigator';
import { PetChefProvider } from './context/PetChefContext';
import { PetChefNavigator } from './screens/PetChefNavigator';
import { MusicMakerProvider } from './context/MusicMakerContext';
import { MusicMakerNavigator } from './screens/MusicMakerNavigator';
import { GardenGrowProvider } from './context/GardenGrowContext';
import { GardenGrowNavigator } from './screens/GardenGrowNavigator';
import { PhotoStudioProvider } from './context/PhotoStudioContext';
import { PhotoStudioNavigator } from './screens/PhotoStudioNavigator';
import { HideAndSeekProvider } from './context/HideAndSeekContext';
import { HideAndSeekNavigator } from './screens/HideAndSeekNavigator';
import { StarCatcherProvider } from './context/StarCatcherContext';
import { StarCatcherNavigator } from './screens/StarCatcherNavigator';
import { OrixasOfferingProvider } from './context/OrixasOfferingContext';
import { OrixasOfferingNavigator } from './screens/OrixasOfferingNavigator';
import { GbaEmulatorProvider } from './context/GbaEmulatorContext';
import { GbaEmulatorNavigator } from './screens/GbaEmulatorNavigator';
import { KidsChessProvider } from './context/KidsChessContext';
import { KidsChessNavigator } from './screens/KidsChessNavigator';

export function registerAllGames() {
  if (gameRegistry.getAllGames().length > 0) return;

  gameRegistry.register({
    id: 'pet-care',
    nameKey: 'selectGame.petCare.name',
    descriptionKey: 'selectGame.petCare.description',
    emoji: '\uD83D\uDC3E',
    category: 'pet',
    navigator: PetGameNavigator,
    providers: [PetProvider],
    isEnabled: true,
  });

  gameRegistry.register({
    id: 'muito',
    nameKey: 'selectGame.muito.name',
    descriptionKey: 'selectGame.muito.description',
    emoji: '\uD83D\uDD22',
    category: 'casual',
    navigator: MuitoNavigator,
    providers: [MuitoProvider],
    isEnabled: true,
  });

  gameRegistry.register({
    id: 'color-tap',
    nameKey: 'selectGame.colorTap.name',
    descriptionKey: 'selectGame.colorTap.description',
    emoji: '\uD83C\uDFA8',
    category: 'casual',
    navigator: ColorTapNavigator,
    providers: [ColorTapProvider],
    isEnabled: true,
  });

  gameRegistry.register({
    id: 'memory-match',
    nameKey: 'selectGame.memoryMatch.name',
    descriptionKey: 'selectGame.memoryMatch.description',
    emoji: '\uD83E\uDDE0',
    category: 'puzzle',
    navigator: MemoryMatchNavigator,
    providers: [MemoryMatchProvider],
    isEnabled: true,
  });

  gameRegistry.register({
    id: 'pet-runner',
    nameKey: 'selectGame.petRunner.name',
    descriptionKey: 'selectGame.petRunner.description',
    emoji: '\uD83C\uDFC3',
    category: 'adventure',
    navigator: PetRunnerNavigator,
    providers: [PetRunnerProvider],
    isEnabled: true,
  });

  gameRegistry.register({
    id: 'simon-says',
    nameKey: 'selectGame.simonSays.name',
    descriptionKey: 'selectGame.simonSays.description',
    emoji: '\uD83C\uDFAE',
    category: 'puzzle',
    navigator: SimonSaysNavigator,
    providers: [SimonSaysProvider],
    isEnabled: true,
  });

  gameRegistry.register({
    id: 'dress-up-relay',
    nameKey: 'selectGame.dressUpRelay.name',
    descriptionKey: 'selectGame.dressUpRelay.description',
    emoji: '\uD83D\uDC57',
    category: 'casual',
    navigator: DressUpRelayNavigator,
    providers: [DressUpRelayProvider],
    isEnabled: true,
  });

  gameRegistry.register({
    id: 'color-mixer',
    nameKey: 'selectGame.colorMixer.name',
    descriptionKey: 'selectGame.colorMixer.description',
    emoji: '\uD83C\uDFA8',
    category: 'puzzle',
    navigator: ColorMixerNavigator,
    providers: [ColorMixerProvider],
    isEnabled: true,
  });

  gameRegistry.register({
    id: 'feed-the-pet',
    nameKey: 'selectGame.feedThePet.name',
    descriptionKey: 'selectGame.feedThePet.description',
    emoji: '\uD83C\uDF7D\uFE0F',
    category: 'casual',
    navigator: FeedThePetNavigator,
    providers: [FeedThePetProvider],
    isEnabled: true,
  });

  gameRegistry.register({
    id: 'whack-a-mole',
    nameKey: 'selectGame.whackAMole.name',
    descriptionKey: 'selectGame.whackAMole.description',
    emoji: '\uD83D\uDD28',
    category: 'casual',
    navigator: WhackAMoleNavigator,
    providers: [WhackAMoleProvider],
    isEnabled: true,
  });

  gameRegistry.register({
    id: 'catch-the-ball',
    nameKey: 'selectGame.catchTheBall.name',
    descriptionKey: 'selectGame.catchTheBall.description',
    emoji: '\uD83C\uDFBE',
    category: 'casual',
    navigator: CatchTheBallNavigator,
    providers: [CatchTheBallProvider],
    isEnabled: true,
  });

  gameRegistry.register({
    id: 'sliding-puzzle',
    nameKey: 'selectGame.slidingPuzzle.name',
    descriptionKey: 'selectGame.slidingPuzzle.description',
    emoji: '\uD83E\uDDE9',
    category: 'puzzle',
    navigator: SlidingPuzzleNavigator,
    providers: [SlidingPuzzleProvider],
    isEnabled: true,
  });

  gameRegistry.register({
    id: 'bubble-pop',
    nameKey: 'selectGame.bubblePop.name',
    descriptionKey: 'selectGame.bubblePop.description',
    emoji: '\uD83E\uDEE7',
    category: 'casual',
    navigator: BubblePopNavigator,
    providers: [BubblePopProvider],
    isEnabled: true,
  });

  gameRegistry.register({
    id: 'pet-dance-party',
    nameKey: 'selectGame.petDanceParty.name',
    descriptionKey: 'selectGame.petDanceParty.description',
    emoji: '\uD83E\uDEA9',
    category: 'casual',
    navigator: PetDancePartyNavigator,
    providers: [PetDancePartyProvider],
    isEnabled: true,
  });

  gameRegistry.register({
    id: 'treasure-dig',
    nameKey: 'selectGame.treasureDig.name',
    descriptionKey: 'selectGame.treasureDig.description',
    emoji: '\uD83D\uDC8E',
    category: 'casual',
    navigator: TreasureDigNavigator,
    providers: [TreasureDigProvider],
    isEnabled: true,
  });

  gameRegistry.register({
    id: 'balloon-float',
    nameKey: 'selectGame.balloonFloat.name',
    descriptionKey: 'selectGame.balloonFloat.description',
    emoji: '\uD83C\uDF88',
    category: 'casual',
    navigator: BalloonFloatNavigator,
    providers: [BalloonFloatProvider],
    isEnabled: true,
  });

  gameRegistry.register({
    id: 'paint-splash',
    nameKey: 'selectGame.paintSplash.name',
    descriptionKey: 'selectGame.paintSplash.description',
    emoji: '\uD83C\uDFA8',
    category: 'casual',
    navigator: PaintSplashNavigator,
    providers: [PaintSplashProvider],
    isEnabled: true,
  });

  gameRegistry.register({
    id: 'snack-stack',
    nameKey: 'selectGame.snackStack.name',
    descriptionKey: 'selectGame.snackStack.description',
    emoji: '\uD83E\uDD5E',
    category: 'casual',
    navigator: SnackStackNavigator,
    providers: [SnackStackProvider],
    isEnabled: true,
  });

  gameRegistry.register({
    id: 'lightning-tap',
    nameKey: 'selectGame.lightningTap.name',
    descriptionKey: 'selectGame.lightningTap.description',
    emoji: '\u26A1',
    category: 'casual',
    navigator: LightningTapNavigator,
    providers: [LightningTapProvider],
    isEnabled: true,
  });

  gameRegistry.register({
    id: 'path-finder',
    nameKey: 'selectGame.pathFinder.name',
    descriptionKey: 'selectGame.pathFinder.description',
    emoji: '\uD83D\uDC3E',
    category: 'puzzle',
    navigator: PathFinderNavigator,
    providers: [PathFinderProvider],
    isEnabled: true,
  });

  gameRegistry.register({
    id: 'shape-sorter',
    nameKey: 'selectGame.shapeSorter.name',
    descriptionKey: 'selectGame.shapeSorter.description',
    emoji: '\uD83E\uDDE9',
    category: 'puzzle',
    navigator: ShapeSorterNavigator,
    providers: [ShapeSorterProvider],
    isEnabled: true,
  });

  gameRegistry.register({
    id: 'mirror-match-new',
    nameKey: 'selectGame.mirrorMatch.name',
    descriptionKey: 'selectGame.mirrorMatch.description',
    emoji: '\uD83E\uDE9E',
    category: 'puzzle',
    navigator: MirrorMatchNavigator,
    providers: [MirrorMatchGameProvider],
    isEnabled: true,
  });

  gameRegistry.register({
    id: 'word-bubbles',
    nameKey: 'selectGame.wordBubbles.name',
    descriptionKey: 'selectGame.wordBubbles.description',
    emoji: '\uD83D\uDD24',
    category: 'puzzle',
    navigator: WordBubblesNavigator,
    providers: [WordBubblesProvider],
    isEnabled: true,
  });

  gameRegistry.register({
    id: 'jigsaw-pets',
    nameKey: 'selectGame.jigsawPets.name',
    descriptionKey: 'selectGame.jigsawPets.description',
    emoji: '\uD83D\uDDBC\uFE0F',
    category: 'puzzle',
    navigator: JigsawPetsNavigator,
    providers: [JigsawPetsProvider],
    isEnabled: true,
  });

  gameRegistry.register({
    id: 'connect-dots',
    nameKey: 'selectGame.connectDots.name',
    descriptionKey: 'selectGame.connectDots.description',
    emoji: '\u2728',
    category: 'puzzle',
    navigator: ConnectDotsNavigator,
    providers: [ConnectDotsProvider],
    isEnabled: true,
  });

  gameRegistry.register({
    id: 'pet-explorer',
    nameKey: 'selectGame.petExplorer.name',
    descriptionKey: 'selectGame.petExplorer.description',
    emoji: '\uD83E\uDDED',
    category: 'adventure',
    navigator: PetExplorerNavigator,
    providers: [PetExplorerProvider],
    isEnabled: true,
  });

  gameRegistry.register({
    id: 'weather-wizard',
    nameKey: 'selectGame.weatherWizard.name',
    descriptionKey: 'selectGame.weatherWizard.description',
    emoji: '\uD83C\uDF08',
    category: 'adventure',
    navigator: WeatherWizardNavigator,
    providers: [WeatherWizardProvider],
    isEnabled: true,
  });

  gameRegistry.register({
    id: 'pet-taxi',
    nameKey: 'selectGame.petTaxi.name',
    descriptionKey: 'selectGame.petTaxi.description',
    emoji: '\uD83D\uDE95',
    category: 'adventure',
    navigator: PetTaxiNavigator,
    providers: [PetTaxiProvider],
    isEnabled: true,
  });

  gameRegistry.register({
    id: 'pet-chef',
    nameKey: 'selectGame.petChef.name',
    descriptionKey: 'selectGame.petChef.description',
    emoji: '\uD83D\uDC68\u200D\uD83C\uDF73',
    category: 'casual',
    navigator: PetChefNavigator,
    providers: [PetChefProvider],
    isEnabled: true,
  });

  gameRegistry.register({
    id: 'music-maker',
    nameKey: 'selectGame.musicMaker.name',
    descriptionKey: 'selectGame.musicMaker.description',
    emoji: '\uD83C\uDFB5',
    category: 'casual',
    navigator: MusicMakerNavigator,
    providers: [MusicMakerProvider],
    isEnabled: true,
  });

  gameRegistry.register({
    id: 'garden-grow',
    nameKey: 'selectGame.gardenGrow.name',
    descriptionKey: 'selectGame.gardenGrow.description',
    emoji: '\uD83C\uDF3B',
    category: 'casual',
    navigator: GardenGrowNavigator,
    providers: [GardenGrowProvider],
    isEnabled: true,
  });

  gameRegistry.register({
    id: 'photo-studio',
    nameKey: 'selectGame.photoStudio.name',
    descriptionKey: 'selectGame.photoStudio.description',
    emoji: '\uD83D\uDCF8',
    category: 'casual',
    navigator: PhotoStudioNavigator,
    providers: [PhotoStudioProvider],
    isEnabled: true,
  });

  gameRegistry.register({
    id: 'hide-and-seek',
    nameKey: 'selectGame.hideAndSeek.name',
    descriptionKey: 'selectGame.hideAndSeek.description',
    emoji: '\uD83E\uDEE3',
    category: 'casual',
    navigator: HideAndSeekNavigator,
    providers: [HideAndSeekProvider],
    isEnabled: true,
  });

  gameRegistry.register({
    id: 'star-catcher',
    nameKey: 'selectGame.starCatcher.name',
    descriptionKey: 'selectGame.starCatcher.description',
    emoji: '\u2B50',
    category: 'casual',
    navigator: StarCatcherNavigator,
    providers: [StarCatcherProvider],
    isEnabled: true,
  });

  gameRegistry.register({
    id: 'orixas-offering',
    nameKey: 'selectGame.orixasOffering.name',
    descriptionKey: 'selectGame.orixasOffering.description',
    emoji: '🕯️',
    category: 'casual',
    navigator: OrixasOfferingNavigator,
    providers: [OrixasOfferingProvider],
    isEnabled: true,
  });

  gameRegistry.register({
    id: 'gba-emulator',
    nameKey: 'selectGame.gbaEmulator.name',
    descriptionKey: 'selectGame.gbaEmulator.description',
    emoji: '\uD83D\uDD79\uFE0F',
    category: 'emulator',
    navigator: GbaEmulatorNavigator,
    providers: [GbaEmulatorProvider],
    isEnabled: true,
  });

  gameRegistry.register({
    id: 'kids-chess',
    nameKey: 'selectGame.kidsChess.name',
    descriptionKey: 'selectGame.kidsChess.description',
    emoji: '♟️',
    category: 'board',
    navigator: KidsChessNavigator,
    providers: [KidsChessProvider],
    isEnabled: true,
  });
}
