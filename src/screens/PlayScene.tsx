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

const PLAY_ACTIVITIES = [
  { id: 'yarn_ball', emoji: '🧶', name: 'Bola de lã' },
  { id: 'small_ball', emoji: '⚽', name: 'Bolinha' },
];

export const PlayScene: React.FC<Props> = ({ navigation }) => {
  const { pet, play, earnMoney } = usePet();
  const { showToast } = useToast();
  const [animationState, setAnimationState] = useState<AnimationState>('idle');
  const [message, setMessage] = useState('');

  if (!pet) return null;

  const handlePlay = async (activity: typeof PLAY_ACTIVITIES[0]) => {
    setAnimationState('happy');
    setMessage(`${pet.name} está brincando com ${activity.name}! 🎉`);

    try {
      await play();
      
      // Earn money for playing
      const moneyEarned = 10;
      await earnMoney(moneyEarned);
      showToast(`💰 +${moneyEarned} moedas ganhas!`, 'success');
    } catch (error) {
      console.error('Error during play:', error);
      setMessage('Erro ao brincar! 😢');
      setAnimationState('idle');
      return;
    }

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
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.title}>🎮 Brincar</Text>
        <View style={{ width: 60 }} />
      </View>

      <View style={styles.petContainer}>
        <PetRenderer pet={pet} animationState={animationState} size={375} />
        {message ? <Text style={styles.message}>{message}</Text> : null}
      </View>

      <View style={styles.activitiesContainer}>
        <Text style={styles.activitiesTitle}>Escolha a atividade:</Text>
        <View style={styles.activitiesGrid}>
          {PLAY_ACTIVITIES.map((activity) => (
            <TouchableOpacity
              key={activity.id}
              style={styles.activityButton}
              onPress={() => handlePlay(activity)}
              disabled={animationState !== 'idle'}
            >
              <Text style={styles.activityEmoji}>{activity.emoji}</Text>
              <Text style={styles.activityName}>{activity.name}</Text>
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
    backgroundColor: '#e1f5fe',
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
  activitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  activityButton: {
    backgroundColor: '#b3e5fc',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    width: '45%',
    marginBottom: 12,
  },
  activityEmoji: {
    fontSize: 36,
    marginBottom: 4,
  },
  activityName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
});
