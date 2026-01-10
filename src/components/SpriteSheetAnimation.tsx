import React, { useEffect } from 'react';
import { View, Image, StyleSheet, ImageRequireSource } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  cancelAnimation,
  Easing,
  runOnJS,
} from 'react-native-reanimated';

type SpriteSheetAnimationProps = {
  spriteSheet: ImageRequireSource;
  frameCount: number;
  frameWidth: number;
  frameHeight: number;
  fps?: number;
  loop?: boolean;
  playing?: boolean;
  onAnimationComplete?: () => void;
};

export const SpriteSheetAnimation: React.FC<SpriteSheetAnimationProps> = ({
  spriteSheet,
  frameCount,
  frameWidth,
  frameHeight,
  fps = 12,
  loop = true,
  playing = true,
  onAnimationComplete,
}) => {
  const translateX = useSharedValue(0);

  useEffect(() => {
    if (!playing) {
      cancelAnimation(translateX);
      return;
    }

    const frameDuration = 1000 / fps;
    const totalDuration = frameDuration * frameCount;
    const endPosition = -frameWidth * (frameCount - 1);

    if (loop) {
      // Infinite loop animation
      translateX.value = withRepeat(
        withTiming(endPosition, {
          duration: totalDuration,
          easing: Easing.linear,
        }),
        -1,
        false
      );
    } else {
      // One-shot animation
      translateX.value = withTiming(
        endPosition,
        {
          duration: totalDuration,
          easing: Easing.linear,
        },
        (finished) => {
          if (finished && onAnimationComplete) {
            runOnJS(onAnimationComplete)();
          }
        }
      );
    }

    return () => {
      cancelAnimation(translateX);
    };
  }, [playing, fps, frameCount, frameWidth, loop, onAnimationComplete, translateX]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View
      style={[
        styles.container,
        {
          width: frameWidth,
          height: frameHeight,
        },
      ]}
    >
      <Animated.View style={animatedStyle}>
        <Image
          source={spriteSheet}
          style={{
            width: frameWidth * frameCount,
            height: frameHeight,
          }}
          resizeMode="stretch"
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
});
