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
import { PetRenderer } from '../components/PetRenderer';
import { useNavigationList } from '../hooks/useNavigationList';
import { useBackButton } from '../hooks/useBackButton';

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

// Placeholder backgrounds - user will add actual images to assets/backgrounds/
const BACKGROUNDS = [
  { id: 'none', name: 'Nenhum', emoji: '❌' },
  { id: 'park', name: 'Parque', emoji: '🌳' },
  { id: 'beach', name: 'Praia', emoji: '🏖️' },
  { id: 'home', name: 'Casa', emoji: '🏠' },
];

export const BackgroundScene: React.FC<Props> = ({ navigation }) => {
  const { pet, setBackground } = usePet();
  const [message, setMessage] = useState('');
  const BackButtonIcon = useBackButton();
  
  const {
    currentItem: currentBackground,
    currentIndex,
    goToNext,
    goToPrevious,
    totalItems,
  } = useNavigationList(BACKGROUNDS);

  if (!pet) return null;

  const handleSelectBackground = (background: typeof BACKGROUNDS[0]) => {
    const backgroundId = background.id === 'none' ? null : background.id;
    setBackground(backgroundId);
    setMessage(`Fundo "${background.name}" selecionado! 🎨`);

    setTimeout(() => {
      setMessage('');
    }, 2000);
  };

  const isCurrentBackgroundSelected = 
    (currentBackground.id === 'none' && pet.background === null) ||
    (pet.background === currentBackground.id);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButtonContainer}>
          <BackButtonIcon />
          <Text style={styles.backButton}>Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.title}>🖼️ Cenário</Text>
        <View style={{ width: 80 }} />
      </View>

      <View style={styles.petContainer}>
        <PetRenderer pet={pet} size={300} />
        {message ? <Text style={styles.message}>{message}</Text> : null}
      </View>

      <View style={styles.backgroundsContainer}>
        <Text style={styles.backgroundsTitle}>Escolha o cenário:</Text>
        
        {/* Navigation arrows and current background display */}
        <View style={styles.navigationContainer}>
          <TouchableOpacity
            style={styles.arrowButton}
            onPress={goToPrevious}
          >
            <Text style={styles.arrowText}>←</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.currentBackgroundButton,
              isCurrentBackgroundSelected && styles.currentBackgroundButtonSelected,
            ]}
            onPress={() => handleSelectBackground(currentBackground)}
          >
            <Text style={styles.currentBackgroundEmoji}>{currentBackground.emoji}</Text>
            <Text style={styles.currentBackgroundName}>{currentBackground.name}</Text>
            {isCurrentBackgroundSelected && (
              <Text style={styles.selectedIndicator}>✓ Selecionado</Text>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.arrowButton}
            onPress={goToNext}
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
    backgroundColor: '#f3e5f5',
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
  },
  backButton: {
    fontSize: 16,
    color: '#9b59b6',
    fontWeight: '600',
    marginLeft: 4,
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
  backgroundsContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
  },
  backgroundsTitle: {
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
    backgroundColor: '#e1bee7',
    borderRadius: 30,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  arrowText: {
    fontSize: 28,
    color: '#7b1fa2',
    fontWeight: 'bold',
  },
  currentBackgroundButton: {
    backgroundColor: '#ce93d8',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    minWidth: 140,
    borderWidth: 3,
    borderColor: '#9b59b6',
  },
  currentBackgroundButtonSelected: {
    backgroundColor: '#ba68c8',
    borderColor: '#6a1b9a',
  },
  currentBackgroundEmoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  currentBackgroundName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  selectedIndicator: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '600',
    marginTop: 4,
  },
  pageIndicator: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: '600',
  },
});
