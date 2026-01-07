import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { usePet } from '../context/PetContext';
import { useToast } from '../context/ToastContext';
import { PetRenderer } from '../components/PetRenderer';
import { AnimationState } from '../types';
import { useNavigationList } from '../hooks/useNavigationList';

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

const PLAY_ACTIVITIES = [
  { id: 'yarn_ball', emoji: '🧶', name: 'Bola de lã' },
  { id: 'small_ball', emoji: '⚽', name: 'Bolinha' },
];

export const PlayScene: React.FC<Props> = ({ navigation }) => {
  const { pet, play, earnMoney } = usePet();
  const { showToast } = useToast();
  const [animationState, setAnimationState] = useState<AnimationState>('idle');
  const [message, setMessage] = useState('');
  
  const {
    currentItem: currentActivity,
    currentIndex,
    goToNext,
    goToPrevious,
    totalItems,
  } = useNavigationList(PLAY_ACTIVITIES);

  if (!pet) return null;

  const handlePlay = (activity: typeof PLAY_ACTIVITIES[0]) => {
    setAnimationState('happy');
    setMessage(`${pet.name} está brincando com ${activity.name}! 🎉`);

    play();
    
    // Earn money for playing
    const moneyEarned = 10;
    earnMoney(moneyEarned);
    showToast(`💰 +${moneyEarned} moedas ganhas!`, 'success');

    setTimeout(() => {
      setMessage(`${pet.name} adorou brincar! 💕`);

      setTimeout(() => {
        setAnimationState('idle');
        setMessage('');
      }, 1500);
    }, 1500);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButtonContainer}>
          <Ionicons name="arrow-back" size={24} color="#9b59b6" />
          <Text style={styles.backButton}>Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.title}>🎮 Brincar</Text>
        <View style={{ width: 80 }} />
      </View>

      <View style={styles.petContainer}>
        <PetRenderer pet={pet} animationState={animationState} size={375} />
        {message ? <Text style={styles.message}>{message}</Text> : null}
      </View>

      <View style={styles.activitiesContainer}>
        <Text style={styles.activitiesTitle}>Escolha a atividade:</Text>
        
        {/* Navigation arrows and current activity display */}
        <View style={styles.navigationContainer}>
          <TouchableOpacity
            style={styles.arrowButton}
            onPress={goToPrevious}
            disabled={animationState !== 'idle'}
          >
            <Text style={styles.arrowText}>←</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.currentActivityButton}
            onPress={() => handlePlay(currentActivity)}
            disabled={animationState !== 'idle'}
          >
            <Text style={styles.currentActivityEmoji}>{currentActivity.emoji}</Text>
            <Text style={styles.currentActivityName}>{currentActivity.name}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.arrowButton}
            onPress={goToNext}
            disabled={animationState !== 'idle'}
          >
            <Text style={styles.arrowText}>→</Text>
          </TouchableOpacity>
        </View>
        
        <Text style={styles.pageIndicator}>
          {currentIndex + 1} / {totalItems}
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e1f5fe',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  backButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
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
  activitiesContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
  },
  activitiesTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  navigationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  arrowButton: {
    backgroundColor: '#b3e5fc',
    borderRadius: 30,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  arrowText: {
    fontSize: 28,
    color: '#0288d1',
    fontWeight: 'bold',
  },
  currentActivityButton: {
    backgroundColor: '#81d4fa',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    minWidth: 140,
    borderWidth: 3,
    borderColor: '#0288d1',
  },
  currentActivityEmoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  currentActivityName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  pageIndicator: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: '600',
  },
});
