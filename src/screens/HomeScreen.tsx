import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { usePet } from '../context/PetContext';
import { PetRenderer } from '../components/PetRenderer';
import { StatusBar } from '../components/StatusBar';
import { IconButton } from '../components/IconButton';
import { ConfirmModal } from '../components/ConfirmModal';
import { calculatePetAge } from '../utils/age';

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

export const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const { pet } = usePet();
  const [showMenuConfirm, setShowMenuConfirm] = useState(false);

  if (!pet) {
    return null;
  }

  const petAge = calculatePetAge(pet.createdAt);

  const getHungerColor = () => {
    if (pet.hunger > 60) return '#4CAF50';
    if (pet.hunger > 30) return '#FFC107';
    return '#F44336';
  };

  const getHygieneColor = () => {
    if (pet.hygiene > 60) return '#2196F3';
    if (pet.hygiene > 30) return '#FF9800';
    return '#795548';
  };

  const handleMenuPress = () => {
    setShowMenuConfirm(true);
  };

  const handleConfirmMenu = () => {
    setShowMenuConfirm(false);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.petName}>
          {pet.type === 'cat' ? '🐱' : '🐶'} {pet.name}
        </Text>
        <Text style={styles.petAge}>
          {petAge} {petAge === 1 ? 'ano' : 'anos'}
        </Text>
      </View>

      <View style={styles.statusContainer}>
        <StatusBar
          label="Fome"
          value={pet.hunger}
          color={getHungerColor()}
          emoji="🍖"
        />
        <StatusBar
          label="Higiene"
          value={pet.hygiene}
          color={getHygieneColor()}
          emoji="🛁"
        />
      </View>

      <View style={styles.petContainer}>
        <PetRenderer pet={pet} size={280} />
      </View>

      <View style={styles.actionsContainer}>
        <IconButton
          emoji="🍖"
          label="Alimentar"
          onPress={() => navigation.navigate('Feed')}
        />
        <IconButton
          emoji="🛁"
          label="Banho"
          onPress={() => navigation.navigate('Bath')}
        />
        <IconButton
          emoji="👕"
          label="Roupas"
          onPress={() => navigation.navigate('Wardrobe')}
        />
        <IconButton
          emoji="🏠"
          label="Menu"
          onPress={handleMenuPress}
        />
      </View>

      <ConfirmModal
        visible={showMenuConfirm}
        title="Voltar ao Menu"
        message="Tem certeza que quer sair? O status atual do seu pet será salvo."
        confirmText="Confirmar"
        cancelText="Cancelar"
        onConfirm={handleConfirmMenu}
        onCancel={() => setShowMenuConfirm(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e8f5e9',
  },
  header: {
    padding: 16,
    alignItems: 'center',
  },
  petName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  petAge: {
    fontSize: 18,
    color: '#666',
    marginTop: 4,
  },
  statusContainer: {
    paddingVertical: 8,
  },
  petContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    gap: 12,
    padding: 16,
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
});