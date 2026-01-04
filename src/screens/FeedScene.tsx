import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { usePet } from '../context/PetContext';
import { useToast } from '../context/ToastContext';
import { PetRenderer } from '../components/PetRenderer';
import { AnimationState } from '../types';

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

const FOODS = [
  { id: 'kibble', emoji: '🍖', name: 'Ração', value: 20 },
  { id: 'fish', emoji: '🐟', name: 'Peixe', value: 25 },
  { id: 'treat', emoji: '🦴', name: 'Petisco', value: 15 },
  { id: 'milk', emoji: '🥛', name: 'Leite', value: 10 },
];

export const FeedScene: React.FC<Props> = ({ navigation }) => {
  const { pet, feed, earnMoney } = usePet();
  const { showToast } = useToast();
  const [animationState, setAnimationState] = useState<AnimationState>('idle');
  const [message, setMessage] = useState('');

  if (!pet) return null;

  const handleFeed = async (food: typeof FOODS[0]) => {
    setAnimationState('eating');
    setMessage(`${pet.name} está comendo ${food.name}! 😋`);

    await feed(food.value);
    
    // Earn money for feeding
    const moneyEarned = 5;
    await earnMoney(moneyEarned);
    showToast(`💰 +${moneyEarned} moedas ganhas!`, 'success');

    setTimeout(() => {
      setAnimationState('happy');
      setMessage(`${pet.name} adorou! 💕`);

      setTimeout(() => {
        setAnimationState('idle');
        setMessage('');
      }, 1500);
    }, 1500);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.title}>🍖 Alimentar</Text>
        <View style={{ width: 60 }} />
      </View>

      <View style={styles.petContainer}>
        <PetRenderer pet={pet} animationState={animationState} size={375} />
        {message ? <Text style={styles.message}>{message}</Text> : null}
      </View>

      <View style={styles.hungerInfo}>
        <Text style={styles.hungerText}>
          Fome: {Math.round(pet.hunger)}%
        </Text>
      </View>

      <View style={styles.foodContainer}>
        <Text style={styles.foodTitle}>Escolha a comida:</Text>
        <View style={styles.foodGrid}>
          {FOODS.map((food) => (
            <TouchableOpacity
              key={food.id}
              style={styles.foodButton}
              onPress={() => handleFeed(food)}
              disabled={animationState !== 'idle' || pet.hunger >= 100}
            >
              <Text style={styles.foodEmoji}>{food.emoji}</Text>
              <Text style={styles.foodName}>{food.name}</Text>
              <Text style={styles.foodValue}>+{food.value}%</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff8e1',
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
  petContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  hungerInfo: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  hungerText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ff9800',
  },
  foodContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
  },
  foodTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  foodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  foodButton: {
    backgroundColor: '#fff3e0',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    width: '45%',
    marginBottom: 12,
  },
  foodEmoji: {
    fontSize: 36,
    marginBottom: 4,
  },
  foodName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  foodValue: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '600',
  },
});