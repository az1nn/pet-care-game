import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { usePet } from '../context/PetContext';
import { PetType, PetColor, Gender } from '../types';
import { useBackButton } from '../hooks/useBackButton';

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

export const CreatePetScreen: React.FC<Props> = ({ navigation }) => {
  const { createPet } = usePet();
  const [name, setName] = useState('');
  const [petType, setPetType] = useState<PetType>('cat');
  const [gender, setGender] = useState<Gender>('female');
  const [color, setColor] = useState<PetColor>('base');
  const BackButtonIcon = useBackButton();

  // Reset color when switching pet type if the color is not available for the new type
  const handlePetTypeChange = (newType: PetType) => {
    setPetType(newType);
    // If switching to cat and color is brown or whiteandbrown, reset to base
    if (newType === 'cat' && (color === 'brown' || color === 'whiteandbrown')) {
      setColor('base');
    }
  };

  const handleCreate = async () => {
    if (!name.trim()) return;
    await createPet(name.trim(), petType, gender, color);
    navigation.replace('Home');
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate('Menu')}
      >
        <BackButtonIcon />
        <Text style={styles.backButtonText}>Voltar</Text>
      </TouchableOpacity>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        <Text style={styles.title}>🐾 Criar Novo Pet</Text>

        <Text style={styles.label}>Escolha seu pet:</Text>
        <View style={styles.optionRow}>
          <TouchableOpacity
            style={[styles.optionButton, petType === 'cat' && styles.optionSelected]}
            onPress={() => handlePetTypeChange('cat')}
          >
            <Text style={styles.optionEmoji}>🐱</Text>
            <Text style={styles.optionText}>Gato</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.optionButton, petType === 'dog' && styles.optionSelected]}
            onPress={() => handlePetTypeChange('dog')}
          >
            <Text style={styles.optionEmoji}>🐶</Text>
            <Text style={styles.optionText}>Cachorro</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Nome do pet:</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Digite o nome..."
          placeholderTextColor="#999"
          maxLength={20}
        />

        <Text style={styles.label}>Gênero:</Text>
        <View style={styles.optionRow}>
          <TouchableOpacity
            style={[styles.genderButton, gender === 'male' && styles.optionSelected]}
            onPress={() => setGender('male')}
          >
            <Text style={styles.genderEmoji}>♂️</Text>
            <Text style={styles.genderText}>Macho</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.genderButton, gender === 'female' && styles.optionSelected]}
            onPress={() => setGender('female')}
          >
            <Text style={styles.genderEmoji}>♀️</Text>
            <Text style={styles.genderText}>Fêmea</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Cor do pelo:</Text>
        <View style={styles.colorContainer}>
          <TouchableOpacity
            style={[styles.colorButton, color === 'base' && styles.optionSelected]}
            onPress={() => setColor('base')}
          >
            <Text style={styles.colorEmoji}>⚪</Text>
            <Text style={styles.colorText}>Branco</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.colorButton, color === 'black' && styles.optionSelected]}
            onPress={() => setColor('black')}
          >
            <Text style={styles.colorEmoji}>⚫</Text>
            <Text style={styles.colorText}>Preto</Text>
          </TouchableOpacity>
          {petType === 'dog' && (
            <>
              <TouchableOpacity
                style={[styles.colorButton, color === 'brown' && styles.optionSelected]}
                onPress={() => setColor('brown')}
              >
                <Text style={styles.colorEmoji}>🟤</Text>
                <Text style={styles.colorText}>Marrom</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.colorButton, color === 'whiteandbrown' && styles.optionSelected]}
                onPress={() => setColor('whiteandbrown')}
              >
                <Text style={styles.colorEmoji}>🤍🟤</Text>
                <Text style={styles.colorText}>Branco/Marrom</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        <TouchableOpacity
          style={[styles.createButton, !name.trim() && styles.createButtonDisabled]}
          onPress={handleCreate}
          disabled={!name.trim()}
        >
          <Text style={styles.createButtonText}>Criar Pet! 🎉</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f0ff',
  },
  backButton: {
    padding: 16,
    paddingTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 16,
    color: '#9b59b6',
    fontWeight: '600',
    marginLeft: 4,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 32,
    color: '#333',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
    marginBottom: 8,
    marginTop: 16,
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  colorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  optionButton: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    minWidth: 120,
    borderWidth: 3,
    borderColor: 'transparent',
    marginHorizontal: 8,
  },
  optionSelected: {
    borderColor: '#9b59b6',
    backgroundColor: '#f3e5f5',
  },
  optionEmoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  genderButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  genderEmoji: {
    fontSize: 24,
  },
  genderText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    marginTop: 4,
  },
  colorButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
    marginVertical: 6,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  colorEmoji: {
    fontSize: 24,
  },
  colorText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    marginTop: 4,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    fontSize: 18,
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  createButton: {
    backgroundColor: '#9b59b6',
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    marginTop: 32,
  },
  createButtonDisabled: {
    backgroundColor: '#ccc',
  },
  createButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});