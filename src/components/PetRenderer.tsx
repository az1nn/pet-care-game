import React from 'react';
import { Image, StyleSheet, ImageRequireSource, View, Text } from 'react-native';
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
  },
  dog: {
    base: require('../../assets/sprites/dogs/dog_base.png'),
    black: require('../../assets/sprites/dogs/dog_base.png'), // use base until black asset is available
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

  // Calculate number of dirt marks based on hygiene (one mark per 20% decrease)
  const getDirtMarksCount = () => {
    if (pet.hygiene > 80) return 0;
    if (pet.hygiene > 60) return 1;
    if (pet.hygiene > 40) return 2;
    if (pet.hygiene > 20) return 3;
    if (pet.hygiene > 0) return 4;
    return 5;
  };

  const dirtMarksCount = getDirtMarksCount();

  // Dirt mark positions (relative to pet size)
  const dirtMarkPositions = [
    { left: '25%', top: '40%' }, // Position 1
    { left: '65%', top: '35%' }, // Position 2
    { left: '45%', top: '60%' }, // Position 3
    { left: '20%', top: '70%' }, // Position 4
    { left: '70%', top: '65%' }, // Position 5
  ];

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

      {/* Dirt marks - show based on hygiene level */}
      {Array.from({ length: dirtMarksCount }, (_, index) => (
        <View
          key={`dirt-${index}`}
          style={[
            styles.dirtMark,
            {
              left: dirtMarkPositions[index].left,
              top: dirtMarkPositions[index].top,
            },
          ]}
        >
          <Text style={styles.dirtEmoji}>💩</Text>
        </View>
      ))}
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
  dirtMark: {
    position: 'absolute',
    zIndex: 100,
  },
  dirtEmoji: {
    fontSize: 32,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});