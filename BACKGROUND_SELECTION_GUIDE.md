# Background Selection Feature Guide

## Overview
A new screen has been added to allow users to select different backgrounds for their pet.

## How to Access
1. From the Home Screen, tap the "Cenário" button (🖼️)
2. This opens the Background Selection screen

## Features

### Arrow Navigation
- Use **left arrow (←)** to go to previous background
- Use **right arrow (→)** to go to next background
- Navigation is circular (wraps around)

### Background Options
Currently includes 4 placeholder backgrounds:
1. **Nenhum (❌)** - No background
2. **Parque (🌳)** - Park theme
3. **Praia (🏖️)** - Beach theme
4. **Casa (🏠)** - Home theme

### Selection
- Tap the center button to select the currently displayed background
- Selected background is highlighted with darker colors
- A "✓ Selecionado" indicator appears on selected backgrounds
- Success message appears: "Fundo '[name]' selecionado! 🎨"

### Persistence
- Selected background is automatically saved
- Background preference persists across app restarts
- Stored in AsyncStorage via PetContext

## Adding Custom Backgrounds

### For Developers
1. Add background images to `assets/backgrounds/` directory
2. Update the `BACKGROUNDS` array in `src/screens/BackgroundScene.tsx`
3. Add image references and metadata

Example:
```typescript
const BACKGROUNDS = [
  { id: 'none', name: 'Nenhum', emoji: '❌' },
  { id: 'park', name: 'Parque', emoji: '🌳', image: require('../../assets/backgrounds/park.png') },
  // Add more backgrounds here
];
```

## Technical Details

### Files Modified
- `src/types.ts` - Added background field to Pet type
- `src/context/PetContext.tsx` - Added setBackground method
- `src/screens/BackgroundScene.tsx` - New screen (220 lines)
- `src/App.tsx` - Added route
- `src/screens/HomeScreen.tsx` - Added navigation button
- `assets/backgrounds/README.md` - Created directory

### Dependencies Used
- `useNavigationList` - For arrow navigation
- `useBackButton` - For back button icon
- `usePet` - For pet context and background state
- React Navigation - For screen navigation
- AsyncStorage (via PetContext) - For persistence

## UI/UX Design
- **Color Scheme**: Purple/lavender (#f3e5f5, #e1bee7, #ce93d8, #9b59b6, #7b1fa2)
- **Layout**: Pet preview at top, navigation controls at bottom
- **Feedback**: Visual highlight + success message
- **Navigation**: Circular with page indicator
- **Accessibility**: Touch-friendly buttons with clear labels

## Future Enhancements
- Add actual background image rendering in PetRenderer
- Support custom background uploads
- Add background categories (indoor, outdoor, seasonal)
- Add background preview thumbnails
- Implement background unlock system with pet money
