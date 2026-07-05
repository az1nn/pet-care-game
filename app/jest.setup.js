// Minimal mocks for testing utilities

// expo@55 + jest-expo@55 installs lazy property getters for several globals via
// expo/src/winter/runtime.native (installGlobal). Those getters capture the
// setup-file require(), which jest@30 refuses to call after leaveTestCode().
// Re-define each affected global with a static value here (after jest-expo's
// setup file has run) so the deferred require never fires during tests.
const _winterGlobals = {
  __ExpoImportMetaRegistry: { url: '' },
  // The rest are already available in Node.js; restore the built-in values so
  // tests see real implementations rather than broken lazy getters.
  structuredClone: typeof structuredClone !== 'undefined' ? structuredClone : undefined,
  TextDecoder: typeof TextDecoder !== 'undefined' ? TextDecoder : undefined,
  TextDecoderStream: typeof TextDecoderStream !== 'undefined' ? TextDecoderStream : undefined,
  URL: typeof URL !== 'undefined' ? URL : undefined,
  URLSearchParams: typeof URLSearchParams !== 'undefined' ? URLSearchParams : undefined,
};
for (const [key, value] of Object.entries(_winterGlobals)) {
  if (value !== undefined) {
    Object.defineProperty(global, key, {
      value,
      configurable: true,
      writable: true,
      enumerable: false,
    });
  }
}

// Mock @react-native/js-polyfills to avoid Flow syntax errors
jest.mock('@react-native/js-polyfills/error-guard', () => ({}));

// Mock React Native completely to avoid Flow syntax errors  
// We don't use jest.requireActual because react-native contains Flow syntax
jest.mock('react-native', () => {
  const React = require('react');
  
  // Create mock components that work with react-test-renderer
  const mockComponent = (name) => {
    const Component = React.forwardRef((props, ref) => {
      return React.createElement(name, { ...props, ref }, props.children);
    });
    Component.displayName = name;
    return Component;
  };

  return {
    Platform: {
      OS: 'ios',
      select: jest.fn((obj) => obj.ios || obj.default),
      Version: 14,
    },
    StyleSheet: {
      create: jest.fn((styles) => styles),
      flatten: jest.fn((style) => style),
      compose: jest.fn((style1, style2) => [style1, style2]),
      hairlineWidth: 1,
    },
    View: mockComponent('View'),
    Text: mockComponent('Text'),
    Pressable: mockComponent('Pressable'),
    TouchableOpacity: mockComponent('TouchableOpacity'),
    Image: mockComponent('Image'),
    ScrollView: mockComponent('ScrollView'),
    FlatList: ({ data, renderItem, ListEmptyComponent, ListHeaderComponent, ListFooterComponent, keyExtractor, ...rest }) => {
      const items = data || [];
      const header = ListHeaderComponent
        ? (typeof ListHeaderComponent === 'function'
          ? React.createElement(ListHeaderComponent)
          : ListHeaderComponent)
        : null;
      const footer = ListFooterComponent
        ? (typeof ListFooterComponent === 'function'
          ? React.createElement(ListFooterComponent)
          : ListFooterComponent)
        : null;
      const content = items.length === 0
        ? (ListEmptyComponent
          ? (typeof ListEmptyComponent === 'function'
            ? React.createElement(ListEmptyComponent)
            : ListEmptyComponent)
          : null)
        : items.map((item, index) => {
            const key = keyExtractor ? keyExtractor(item, index) : String(index);
            return React.createElement(React.Fragment, { key },
              renderItem({ item, index, separators: {} })
            );
          });
      return React.createElement('FlatList', rest, header, content, footer);
    },
    TextInput: mockComponent('TextInput'),
    SafeAreaView: mockComponent('SafeAreaView'),
    KeyboardAvoidingView: mockComponent('KeyboardAvoidingView'),
    Modal: mockComponent('Modal'),
    ActivityIndicator: mockComponent('ActivityIndicator'),
    Switch: mockComponent('Switch'),
    useWindowDimensions: jest.fn(() => ({ width: 375, height: 812, scale: 2, fontScale: 2 })),
    Dimensions: {
      get: jest.fn(() => ({ width: 375, height: 812, scale: 2, fontScale: 1 })),
      addEventListener: jest.fn(() => ({ remove: jest.fn() })),
    },
    BackHandler: {
      addEventListener: jest.fn(() => ({ remove: jest.fn() })),
      removeEventListener: jest.fn(),
      exitApp: jest.fn(),
    },
    Alert: {
      alert: jest.fn(),
    },
    PixelRatio: {
      get: jest.fn(() => 2),
      getFontScale: jest.fn(() => 2),
      getPixelSizeForLayoutSize: jest.fn((val) => val * 2),
      roundToNearestPixel: jest.fn((val) => Math.round(val)),
    },
    Animated: {
      Value: jest.fn(() => ({
        setValue: jest.fn(),
        interpolate: jest.fn(() => ({ setValue: jest.fn(), addListener: jest.fn(() => ''), removeListener: jest.fn() })),
        addListener: jest.fn(() => ''),
        removeListener: jest.fn(),
        removeAllListeners: jest.fn(),
      })),
      View: mockComponent('Animated.View'),
      Text: mockComponent('Animated.Text'),
      timing: jest.fn(() => ({ start: jest.fn() })),
      spring: jest.fn(() => ({ start: jest.fn() })),
      sequence: jest.fn(() => ({ start: jest.fn() })),
      parallel: jest.fn(() => ({ start: jest.fn() })),
      loop: jest.fn(() => ({ start: jest.fn(), stop: jest.fn() })),
      event: jest.fn(() => jest.fn()),
    },
    PanResponder: {
      create: jest.fn(() => ({ panHandlers: {} })),
    },
    findNodeHandle: jest.fn(),
  };
});

// Mock expo-router
jest.mock('expo-router', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    canGoBack: jest.fn(() => false),
  })),
  useLocalSearchParams: jest.fn(() => ({})),
  useSegments: jest.fn(() => []),
  usePathname: jest.fn(() => '/'),
  useNavigationContainerRef: jest.fn(() => ({ current: null })),
  Stack: {
    Screen: jest.fn(() => null),
  },
  Link: jest.fn(({ children }) => children),
}));

// Mock Expo's injected virtual env module used by babel-preset-expo
jest.mock('expo/virtual/env', () => ({ env: process.env ?? {} }), { virtual: true });
if (!global.process || !global.process.env) {
  global.process = { ...(global.process || {}), env: {} };
}

// Mock @sentry/react-native
jest.mock('@sentry/react-native', () => ({
  init: jest.fn(),
  wrap: jest.fn((component) => component),
  captureException: jest.fn(),
  captureMessage: jest.fn(),
  reactNavigationIntegration: {
    registerNavigationContainer: jest.fn(),
  },
}));

// Mock expo-av
jest.mock('expo-av', () => ({
  Audio: {
    Sound: {
      createAsync: jest.fn(() => Promise.resolve({ sound: { playAsync: jest.fn(), unloadAsync: jest.fn(), setVolumeAsync: jest.fn(), setIsLoopingAsync: jest.fn(), pauseAsync: jest.fn(), getStatusAsync: jest.fn(() => Promise.resolve({ isLoaded: true })) } })),
    },
    setAudioModeAsync: jest.fn(() => Promise.resolve()),
  },
}));

// Mock expo-haptics
jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  notificationAsync: jest.fn(),
  selectionAsync: jest.fn(),
  ImpactFeedbackStyle: {
    Light: 'light',
    Medium: 'medium',
    Heavy: 'heavy',
  },
}));

// Mock react-native-get-random-values
jest.mock('react-native-get-random-values', () => ({}));

// Mock uuid
jest.mock('uuid', () => ({
  v4: jest.fn(() => 'test-uuid-123'),
}));

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(() => Promise.resolve()),
  getItem: jest.fn(() => Promise.resolve(null)),
  removeItem: jest.fn(() => Promise.resolve()),
}));

// Mock Google Signin
jest.mock('@react-native-google-signin/google-signin', () => ({
  GoogleSignin: {
    configure: jest.fn(),
    hasPlayServices: jest.fn(() => Promise.resolve(true)),
    signIn: jest.fn(() => Promise.resolve({ user: { id: 'test', name: 'Test User' } })),
    signOut: jest.fn(() => Promise.resolve()),
    isSignedIn: jest.fn(() => Promise.resolve(false)),
    getTokens: jest.fn(() => Promise.resolve({ accessToken: 'test' })),
  },
  statusCodes: {
    SIGN_IN_CANCELLED: 'SIGN_IN_CANCELLED',
    IN_PROGRESS: 'IN_PROGRESS',
    PLAY_SERVICES_NOT_AVAILABLE: 'PLAY_SERVICES_NOT_AVAILABLE',
  },
}));

// Silence console in tests
global.console = {
  ...console,
  warn: jest.fn(),
  error: jest.fn(),
};

// Define React Native __DEV__ global
global.__DEV__ = true;

// Mock AdContext so game screens using useGameAdTrigger don't throw
jest.mock('./src/context/AdContext', () => ({
  AdProvider: ({ children }) => children,
  useAd: () => ({
    isRewardedAdReady: false,
    isInterstitialAdReady: false,
    loadRewardedAd: jest.fn(),
    showRewardedAd: jest.fn(() => Promise.resolve(false)),
    shouldShowInterstitial: jest.fn(() => false),
    incrementScreenCount: jest.fn(),
    showInterstitialAd: jest.fn(() => Promise.resolve()),
    preloadAdsForGameSession: jest.fn(),
    resetAdsAfterGameSession: jest.fn(),
  }),
}));

jest.mock('./src/context/ThemeContext', () => ({
  ThemeProvider: ({ children }) => children,
  useTheme: () => ({
    themeType: 'old',
    colors: {
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
    },
    setTheme: jest.fn(),
    isLoading: false,
  }),
}));

// Mock @expo/vector-icons
jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  const iconFactory = (name) => {
    const Icon = (props) => React.createElement('Text', props, props.name || name);
    Icon.displayName = name;
    return Icon;
  };
  return {
    Ionicons: iconFactory('Ionicons'),
    Feather: iconFactory('Feather'),
    MaterialIcons: iconFactory('MaterialIcons'),
    FontAwesome: iconFactory('FontAwesome'),
    AntDesign: iconFactory('AntDesign'),
    Entypo: iconFactory('Entypo'),
  };
});

// Mock react-native-gesture-handler
jest.mock('react-native-gesture-handler', () => {
  const React = require('react');
  const mockComponent = (name) => {
    const Comp = ({ children, ...props }) => React.createElement(name, props, children);
    Comp.displayName = name;
    return Comp;
  };
  return {
    GestureHandlerRootView: mockComponent('GestureHandlerRootView'),
    GestureDetector: mockComponent('GestureDetector'),
    PanGestureHandler: mockComponent('PanGestureHandler'),
    TapGestureHandler: mockComponent('TapGestureHandler'),
    LongPressGestureHandler: mockComponent('LongPressGestureHandler'),
    PinchGestureHandler: mockComponent('PinchGestureHandler'),
    Gesture: {
      Pan: jest.fn(() => ({
        onStart: jest.fn().mockReturnThis(),
        onUpdate: jest.fn().mockReturnThis(),
        onEnd: jest.fn().mockReturnThis(),
        minDistance: jest.fn().mockReturnThis(),
      })),
      Tap: jest.fn(() => ({
        onStart: jest.fn().mockReturnThis(),
        onEnd: jest.fn().mockReturnThis(),
      })),
      Simultaneous: jest.fn(() => ({})),
      Race: jest.fn(() => ({})),
      Exclusive: jest.fn(() => ({})),
    },
    State: { ENDED: 5, BEGAN: 2, ACTIVE: 4, CANCELLED: 3, FAILED: 1, UNDETERMINED: 0 },
    Directions: { RIGHT: 1, LEFT: 2, UP: 4, DOWN: 8 },
  };
});

// Provide browser globals needed by some modules (e.g. ArtifactGameAdapter)
if (typeof global.window === 'undefined') {
  global.window = global;
}
if (typeof global.window.addEventListener !== 'function') {
  global.window.addEventListener = jest.fn();
  global.window.removeEventListener = jest.fn();
}
if (typeof global.window.postMessage !== 'function') {
  global.window.postMessage = jest.fn();
}
