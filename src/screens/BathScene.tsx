import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence,
} from 'react-native-reanimated';
import { usePet } from '../context/PetContext';
import { useToast } from '../context/ToastContext';
import { PetRenderer } from '../components/PetRenderer';
import { AnimationState } from '../types';

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

type Bubble = {
  id: number;
  x: number;
  y: number;
  scale: number;
};

const BubbleComponent: React.FC<{ bubble: Bubble }> = ({ bubble }) => {
  const opacity = useSharedValue(1);
  const scale = useSharedValue(bubble.scale);
  
  React.useEffect(() => {
    opacity.value = withSequence(
      withTiming(1, { duration: 200 }),
      withTiming(0, { duration: 1300 })
    );
    scale.value = withSequence(
      withTiming(bubble.scale * 1.5, { duration: 500 }),
      withTiming(0, { duration: 1000 })
    );
  }, [bubble.scale, opacity, scale]);

  const bubbleStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      style={[
        styles.dynamicBubble,
        { left: bubble.x, top: bubble.y },
        bubbleStyle,
      ]}
    >
      <Text style={styles.bubbleEmoji}>🫧</Text>
    </Animated.View>
  );
};

export const BathScene: React.FC<Props> = ({ navigation }) => {
  const { pet, bathe, earnMoney } = usePet();
  const { showToast } = useToast();
  const [animationState, setAnimationState] = useState<AnimationState>('idle');
  const [message, setMessage] = useState('Arraste a esponja para dar banho! 🧽');
  const [scrubCount, setScrubCount] = useState(0);
  const [bubbles, setBubbles] = useState<Bubble[]>([]);

  const translateX = useSharedValue(0);
  const spongeX = useSharedValue(0);
  const spongeY = useSharedValue(0);
  const isMoving = useSharedValue(false);
  const bubbleIdCounter = React.useRef(0);
  const timeoutRefs = React.useRef<Set<NodeJS.Timeout>>(new Set());
  const lastBubbleTime = React.useRef(0);

  if (!pet) return null;

  const SCRUBS_NEEDED = 5;
  const BUBBLE_VELOCITY_THRESHOLD = 100;
  const BUBBLE_POSITION_VARIANCE = 40;
  const BUBBLE_POSITION_OFFSET = 20;
  const BUBBLE_THROTTLE_MS = 100; // Minimum time between bubble creation

  const addBubble = (x: number, y: number) => {
    const now = Date.now();
    
    // Throttle bubble creation to prevent performance issues
    if (now - lastBubbleTime.current < BUBBLE_THROTTLE_MS) {
      return;
    }
    
    lastBubbleTime.current = now;
    
    const newBubble: Bubble = {
      id: now + (bubbleIdCounter.current++),
      x: x + Math.random() * BUBBLE_POSITION_VARIANCE - BUBBLE_POSITION_OFFSET,
      y: y + Math.random() * BUBBLE_POSITION_VARIANCE - BUBBLE_POSITION_OFFSET,
      scale: 0.5 + Math.random() * 0.5,
    };
    
    setBubbles(prev => [...prev, newBubble]);
    
    // Remove bubble after animation
    const timeoutId = setTimeout(() => {
      setBubbles(prev => prev.filter(b => b.id !== newBubble.id));
      timeoutRefs.current.delete(timeoutId);
    }, 1500);
    timeoutRefs.current.add(timeoutId);
  };

  // Cleanup timeouts on unmount
  React.useEffect(() => {
    return () => {
      timeoutRefs.current.forEach(timeout => clearTimeout(timeout));
      timeoutRefs.current.clear();
    };
  }, []);

  const handleScrub = () => {
    const newCount = scrubCount + 1;
    setScrubCount(newCount);

    // Give 5% hygiene per scrub
    bathe(5);

    if (newCount >= SCRUBS_NEEDED) {
      setAnimationState('bathing');
      setMessage(`${pet.name} está tomando banho! 🛁💦`);

      // Give bonus 10% hygiene at the end (5 scrubs x 5% + 10% bonus = 35% total)
      bathe(10);
      
      // Earn money for bathing
      const moneyEarned = 8;
      earnMoney(moneyEarned);
      showToast(`💰 +${moneyEarned} moedas ganhas!`, 'success');

      setTimeout(() => {
        setAnimationState('happy');
        setMessage(`${pet.name} está limpinho! ✨`);
        setScrubCount(0);

        setTimeout(() => {
          setAnimationState('idle');
          setMessage('Arraste a esponja para dar banho! 🧽');
        }, 2000);
      }, 1500);
    }
  };

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      translateX.value = e.translationX * 0.3;
    })
    .onEnd(() => {
      translateX.value = withSpring(0);
      handleScrub();
    });

  const spongeDragGesture = Gesture.Pan()
    .onStart(() => {
      isMoving.value = true;
    })
    .onUpdate((e) => {
      spongeX.value = e.translationX;
      spongeY.value = e.translationY;
      
      // Generate bubbles while moving
      if (Math.abs(e.velocityX) > BUBBLE_VELOCITY_THRESHOLD || Math.abs(e.velocityY) > BUBBLE_VELOCITY_THRESHOLD) {
        addBubble(e.absoluteX, e.absoluteY);
      }
    })
    .onEnd(() => {
      isMoving.value = false;
      spongeX.value = withSpring(0);
      spongeY.value = withSpring(0);
      handleScrub();
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const spongeAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: spongeX.value },
      { translateY: spongeY.value },
      { scale: isMoving.value ? withSpring(1.1) : withSpring(1) },
    ],
  }));

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.title}>🛁 Banho</Text>
        <View style={{ width: 60 }} />
      </View>

      <View style={styles.hygieneInfo}>
        <Text style={styles.hygieneText}>
          Higiene: {Math.round(pet.hygiene)}%
        </Text>
      </View>

      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.petContainer, animatedStyle]}>
          <PetRenderer pet={pet} animationState={animationState} size={420} />

          {/* Dynamic Bubbles */}
          {bubbles.map(bubble => (
            <BubbleComponent key={bubble.id} bubble={bubble} />
          ))}
        </Animated.View>
      </GestureDetector>

      {/* Draggable Sponge */}
      <GestureDetector gesture={spongeDragGesture}>
        <Animated.View style={[styles.spongeContainer, spongeAnimatedStyle]}>
          <Image
            source={require('../../assets/sprites/sponge.png')}
            style={styles.spongeImage}
          />
        </Animated.View>
      </GestureDetector>

      <View style={styles.messageContainer}>
        <Text style={styles.message}>{message}</Text>
        {scrubCount > 0 && scrubCount < SCRUBS_NEEDED && (
          <Text style={styles.progress}>
            Esfregando: {scrubCount}/{SCRUBS_NEEDED} 🧽
          </Text>
        )}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.bathButton,
            (animationState !== 'idle' || pet.hygiene >= 100) &&
              styles.bathButtonDisabled,
          ]}
          onPress={() => {
            for (let i = 0; i < SCRUBS_NEEDED; i++) {
              setTimeout(() => handleScrub(), i * 200);
            }
          }}
          disabled={animationState !== 'idle' || pet.hygiene >= 100}
        >
          <Text style={styles.bathButtonText}>🛁 Dar Banho Completo</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e3f2fd',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  backButton: {
    fontSize: 16,
    color: '#9b59b6',
    fontWeight: '600',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  hygieneInfo: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  hygieneText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2196F3',
  },
  petContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  dynamicBubble: {
    position: 'absolute',
    zIndex: 10,
  },
  bubbleEmoji: {
    fontSize: 32,
  },
  spongeContainer: {
    position: 'absolute',
    bottom: 200,
    left: 40,
    zIndex: 20,
  },
  spongeImage: {
    width: 150,
    height: 112,
    resizeMode: 'contain',
  },
  messageContainer: {
    alignItems: 'center',
    padding: 16,
  },
  message: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  progress: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
  buttonContainer: {
    padding: 24,
  },
  bathButton: {
    backgroundColor: '#2196F3',
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
  },
  bathButtonDisabled: {
    backgroundColor: '#ccc',
  },
  bathButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});