import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

type CreatePetScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'CreatePet'
>;

type Props = {
  navigation: CreatePetScreenNavigationProp;
};

const CreatePetScreen: React.FC<Props> = ({ navigation }) => {
  const [petName, setPetName] = useState('');
  const [selectedColor, setSelectedColor] = useState('light');

  const colors = [
    { id: 'light', label: 'Claro', color: '#FFD700' },
    { id: 'medium', label: 'Médio', color: '#FFA500' },
    { id: 'dark', label: 'Escuro', color: '#FF8C00' },
  ];

  const handleCreatePet = () => {
    if (petName.trim() === '') {
      Alert.alert('Erro', 'Por favor, insira um nome para o seu pet!');
      return;
    }

    // Navigate to Home with the new pet data
    navigation.navigate('Home', {
      petName,
      petColor: selectedColor,
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Criar Seu Pet</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Nome do Pet:</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite o nome do seu pet"
          value={petName}
          onChangeText={setPetName}
          maxLength={20}
        />
      </View>

      <View style={styles.colorContainer}>
        <Text style={styles.label}>Escolha a Cor:</Text>
        <View style={styles.colorOptions}>
          {colors.map((colorOption) => (
            <TouchableOpacity
              key={colorOption.id}
              style={[
                styles.colorOption,
                selectedColor === colorOption.id && styles.selectedColorOption,
              ]}
              onPress={() => setSelectedColor(colorOption.id)}
            >
              <View
                style={[
                  styles.colorCircle,
                  { backgroundColor: colorOption.color },
                ]}
              />
              <Text style={styles.colorText}>{colorOption.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <TouchableOpacity style={styles.createButton} onPress={handleCreatePet}>
        <Text style={styles.createButtonText}>Criar Pet</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>Voltar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#F0F8FF',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FF6347',
    marginBottom: 30,
    marginTop: 20,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 30,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#FFF',
    borderWidth: 2,
    borderColor: '#FFB6C1',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
  },
  colorContainer: {
    width: '100%',
    marginBottom: 30,
  },
  colorOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  colorOption: {
    alignItems: 'center',
    padding: 10,
    borderWidth: 2,
    borderColor: 'transparent',
    borderRadius: 10,
  },
  selectedColorOption: {
    borderColor: '#FF6347',
    backgroundColor: '#FFE4E1',
  },
  colorCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 5,
  },
  colorText: {
    fontSize: 14,
    color: '#333',
  },
  createButton: {
    backgroundColor: '#FF6347',
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 25,
    marginBottom: 15,
  },
  createButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  backButton: {
    paddingVertical: 10,
  },
  backButtonText: {
    color: '#FF6347',
    fontSize: 16,
  },
});

export default CreatePetScreen;