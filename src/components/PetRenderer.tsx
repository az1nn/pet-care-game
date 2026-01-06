import React from 'react';
import { Image, StyleSheet, ImageRequireSource } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { Pet, PetType, PetColor, AnimationState } from '../types';
import { CLOTHING_ITEMS } from '../data/clothingItems';

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

type PetRendererProps = {
  pet: Pet;
  animationState?: AnimationState;
  size?: number;
};

export const PetRenderer: React.FC<PetRendererProps> = ({
  pet,
  animationState = 'idle',
  size = 450,
}) => {
  const bounceValue = useSharedValue(0);

  React.useEffect(() => {
    if (animationState === 'happy' || animationState === 'eating') {
      bounceValue.value = withRepeat(
        withSequence(withSpring(-10), withSpring(0)),
        3,
        true
      );
    } else {
      bounceValue.value = withTiming(0);
    }
  }, [animationState, bounceValue]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: bounceValue.value }],
  }));

  const getClothingAsset = (slot: keyof typeof pet.clothes) => {
    const itemId = pet.clothes[slot];
    if (!itemId) return null;
    const item = CLOTHING_ITEMS.find((i) => i.id === itemId);
    return item?.asset || null; // troque por require real quando tiver o asset
  };

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