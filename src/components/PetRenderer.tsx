import React from 'react';
import { Image, StyleSheet, ImageRequireSource } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  useSharedValue,
  withSpring,
  Easing,
} from 'react-native-reanimated';
import { Pet, PetType, PetColor, AnimationState } from '../types';
import { CLOTHING_ITEMS } from '../data/clothingItems';
import { SpriteSheetAnimation } from './SpriteSheetAnimation';

// Mapeamento de assets base
const BASE_ASSETS: Record<PetType, Record<PetColor, ImageRequireSource>> = {
  cat: {
    base: require('../../assets/sprites/cats/cat_base.png'),
    black: require('../../assets/sprites/cats/cat_black.png'),
    brown: require('../../assets/sprites/cats/cat_base.png'), // cats don't have brown variant
    whiteandbrown: require('../../assets/sprites/cats/cat_base.png'), // cats don't have this variant
  },
  dog: {
    base: require('../../assets/sprites/dogs/dog_base.png'),
    black: require('../../assets/sprites/dogs/dog_black.jpg'),
    brown: require('../../assets/sprites/dogs/dog_brown.jpg'),
    whiteandbrown: require('../../assets/sprites/dogs/dog_whiteandbrowm.jpg'),
  },
};

// Future-ready sprite sheet assets structure
// When sprite sheet assets are created, replace placeholder with actual sprite sheets
const SPRITE_SHEET_ASSETS: Record<
  PetType,
  Record<PetColor, Record<AnimationState, {
    spriteSheet: ImageRequireSource;
    frameCount: number;
    frameWidth: number;
    frameHeight: number;
    fps: number;
  } | null>>
> = {
  cat: {
    base: {
      idle: null,
      happy: null,
      eating: null,
      bathing: null,
    },
    black: {
      idle: null,
      happy: null,
      eating: null,
      bathing: null,
    },
    brown: {
      idle: null,
      happy: null,
      eating: null,
      bathing: null,
    },
    whiteandbrown: {
      idle: null,
      happy: null,
      eating: null,
      bathing: null,
    },
  },
  dog: {
    base: {
      idle: null,
      happy: null,
      eating: null,
      bathing: null,
    },
    black: {
      idle: null,
      happy: null,
      eating: null,
      bathing: null,
    },
    brown: {
      idle: null,
      happy: null,
      eating: null,
      bathing: null,
    },
    whiteandbrown: {
      idle: null,
      happy: null,
      eating: null,
      bathing: null,
    },
  },
};

type PetRendererProps = {
  pet: Pet;
  animationState?: AnimationState;
  size?: number;
  useSpriteSheets?: boolean;
};

export const PetRenderer: React.FC<PetRendererProps> = ({
  pet,
  animationState = 'idle',
  size = 450,
  useSpriteSheets = false,
}) => {
  const translateY = useSharedValue(0);
  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);

  React.useEffect(() => {
    // Reset all animations
    translateY.value = 0;
    rotation.value = 0;
    scale.value = 1;

    if (animationState === 'happy') {
      // Bounce: 3 repetitions, -15px height using withSpring
      translateY.value = withRepeat(
        withSequence(
          withSpring(-15, { damping: 8, stiffness: 100 }),
          withSpring(0, { damping: 8, stiffness: 100 })
        ),
        3,
        false
      );

      // Wiggle: Rotate -5° to +5° to 0°, timing-based, 2 repetitions
      rotation.value = withRepeat(
        withSequence(
          withTiming(-5, { duration: 100, easing: Easing.inOut(Easing.ease) }),
          withTiming(5, { duration: 200, easing: Easing.inOut(Easing.ease) }),
          withTiming(0, { duration: 100, easing: Easing.inOut(Easing.ease) })
        ),
        2,
        false
      );
    } else if (animationState === 'eating') {
      // Gentle head bob: -5px up and down, 400ms duration each
      translateY.value = withRepeat(
        withSequence(
          withTiming(-5, { duration: 400, easing: Easing.inOut(Easing.ease) }),
          withTiming(0, { duration: 400, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        false
      );
    } else if (animationState === 'bathing') {
      // Shake: Rotate -3° to +3° to 0°, fast (50-100ms timing), 5 repetitions
      rotation.value = withRepeat(
        withSequence(
          withTiming(-3, { duration: 50, easing: Easing.linear }),
          withTiming(3, { duration: 100, easing: Easing.linear }),
          withTiming(0, { duration: 50, easing: Easing.linear })
        ),
        5,
        false
      );
    } else if (animationState === 'idle') {
      // Subtle breathing: Scale 1.0 to 1.02 and back, 2000ms duration each way
      scale.value = withRepeat(
        withSequence(
          withTiming(1.02, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
          withTiming(1.0, { duration: 2000, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        false
      );
    }
  }, [animationState, translateY, rotation, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { rotate: `${rotation.value}deg` },
      { scale: scale.value },
    ],
  }));

  const getClothingAsset = (slot: keyof typeof pet.clothes) => {
    const itemId = pet.clothes[slot];
    if (!itemId) return null;
    const item = CLOTHING_ITEMS.find((i) => i.id === itemId);
    return item?.asset || null; // troque por require real quando tiver o asset
  };

  // Render sprite sheet animation if enabled and sprite sheet exists
  if (useSpriteSheets) {
    const spriteSheetData = SPRITE_SHEET_ASSETS[pet.type][pet.color][animationState];
    
    if (spriteSheetData) {
      return (
        <Animated.View style={[styles.container, { width: size, height: size }, animatedStyle]}>
          <SpriteSheetAnimation
            spriteSheet={spriteSheetData.spriteSheet}
            frameCount={spriteSheetData.frameCount}
            frameWidth={spriteSheetData.frameWidth}
            frameHeight={spriteSheetData.frameHeight}
            fps={spriteSheetData.fps}
            loop={animationState === 'idle' || animationState === 'eating'}
            playing={true}
          />
          
          {/* Camadas de roupas - ordem: paws → torso → eyes → head */}
          {pet.clothes.paws && getClothingAsset('paws') && (
            <Image
              source={getClothingAsset('paws')!}
              style={[styles.layer, { width: size, height: size }]}
              resizeMode="contain"
            />
          )}

          {pet.clothes.torso && getClothingAsset('torso') && (
            <Image
              source={getClothingAsset('torso')!}
              style={[styles.layer, { width: size, height: size }]}
              resizeMode="contain"
            />
          )}

          {pet.clothes.eyes && getClothingAsset('eyes') && (
            <Image
              source={getClothingAsset('eyes')!}
              style={[styles.layer, { width: size, height: size }]}
              resizeMode="contain"
            />
          )}

          {pet.clothes.head && getClothingAsset('head') && (
            <Image
              source={getClothingAsset('head')!}
              style={[styles.layer, { width: size, height: size }]}
              resizeMode="contain"
            />
          )}
        </Animated.View>
      );
    }
  }

  // Fallback to static sprite with enhanced animations
  return (
    <Animated.View style={[styles.container, { width: size, height: size }, animatedStyle]}>
      {/* Base do pet */}
      <Image
        source={BASE_ASSETS[pet.type][pet.color]}
        style={[styles.layer, { width: size, height: size }]}
        resizeMode="contain"
      />

      {/* Camadas de roupas - ordem: paws → torso → eyes → head */}
      {pet.clothes.paws && getClothingAsset('paws') && (
        <Image
          source={getClothingAsset('paws')!}
          style={[styles.layer, { width: size, height: size }]}
          resizeMode="contain"
        />
      )}

      {pet.clothes.torso && getClothingAsset('torso') && (
        <Image
          source={getClothingAsset('torso')!}
          style={[styles.layer, { width: size, height: size }]}
          resizeMode="contain"
        />
      )}

      {pet.clothes.eyes && getClothingAsset('eyes') && (
        <Image
          source={getClothingAsset('eyes')!}
          style={[styles.layer, { width: size, height: size }]}
          resizeMode="contain"
        />
      )}

      {pet.clothes.head && getClothingAsset('head') && (
        <Image
          source={getClothingAsset('head')!}
          style={[styles.layer, { width: size, height: size }]}
          resizeMode="contain"
        />
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  layer: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
});