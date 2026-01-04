import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { usePet } from '../context/PetContext';
import { useToast } from '../context/ToastContext';
import { PetRenderer } from '../components/PetRenderer';
import { AnimationState } from '../types';

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

export const BathScene: React.FC<Props> = ({ navigation }) => {
  const { pet, bathe, earnMoney } = usePet();
  const { showToast } = useToast();
  const [animationState, setAnimationState] = useState<AnimationState>('idle');
  const [message, setMessage] = useState('Esfregue o pet para dar banho! 🧽');
  const [scrubCount, setScrubCount] = useState(0);

  const translateX = useSharedValue(0);

  if (!pet) return null;

  const SCRUBS_NEEDED = 5;

  const handleScrub = () => {
    const newCount = scrubCount + 1;
    setScrubCount(newCount);

    if (newCount >= SCRUBS_NEEDED) {
      setAnimationState('bathing');
      setMessage(`${pet.name} está tomando banho! 🛁💦`);

      bathe(30);
      
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
          setMessage('Esfregue o pet para dar banho! 🧽');
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

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
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

          {/* Bolhas decorativas */}
          <View style={styles.bubbles}>
            <Text style={styles.bubble}>🫧</Text>
            <Text style={[styles.bubble, { left: 50, top: 20 }]}>🫧</Text>
            <Text style={[styles.bubble, { right: 30, top: 40 }]}>🫧</Text>
          </View>
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
  bubbles: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  bubble: {
    position: 'absolute',
    fontSize: 32,
    opacity: 0.7,
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