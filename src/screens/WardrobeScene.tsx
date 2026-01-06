import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { usePet } from '../context/PetContext';
import { PetRenderer } from '../components/PetRenderer';
import { ClothingSlot } from '../types';
import { CLOTHING_ITEMS, getItemsBySlot } from '../data/clothingItems';
import { useNavigationList } from '../hooks/useNavigationList';

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

const SLOTS: { key: ClothingSlot; label: string; emoji: string }[] = [
  { key: 'head', label: 'Cabeça', emoji: '🎩' },
  { key: 'eyes', label: 'Olhos', emoji: '👀' },
  { key: 'torso', label: 'Torso', emoji: '👕' },
  { key: 'paws', label: 'Patas', emoji: '🧦' },
];

export const WardrobeScene: React.FC<Props> = ({ navigation }) => {
  const { pet, setClothing } = usePet();
  
  const {
    currentItem: currentSlot,
    currentIndex,
    goToNext,
    goToPrevious,
    setIndex,
    totalItems,
  } = useNavigationList(SLOTS);

  if (!pet) return null;

  const selectedSlot = currentSlot.key;
  const itemsForSlot = getItemsBySlot(selectedSlot);

  const handleSelectItem = (itemId: string | null) => {
    setClothing(selectedSlot, itemId);
  };
  
  const handleSlotClick = (slotKey: ClothingSlot) => {
    const slotIndex = SLOTS.findIndex(s => s.key === slotKey);
    if (slotIndex !== -1) {
      setIndex(slotIndex);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.title}>👕 Armário</Text>
        <View style={{ width: 60 }} />
      </View>

      <View style={styles.petContainer}>
        <PetRenderer pet={pet} size={300} />
      </View>

      {/* Navigation arrows for slots */}
      <View style={styles.navigationContainer}>
        <TouchableOpacity
          style={styles.arrowButton}
          onPress={goToPrevious}
        >
          <Text style={styles.arrowText}>←</Text>
        </TouchableOpacity>
        
        <View style={styles.currentSlotContainer}>
          <Text style={styles.currentSlotEmoji}>{currentSlot.emoji}</Text>
          <Text style={styles.currentSlotLabel}>{currentSlot.label}</Text>
        </View>
        
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

      <View style={styles.slotSelector}>
        {SLOTS.map((slot) => (
          <TouchableOpacity
            key={slot.key}
            style={[
              styles.slotButton,
              selectedSlot === slot.key && styles.slotButtonSelected,
            ]}
            onPress={() => handleSlotClick(slot.key)}
          >
            <Text style={styles.slotEmoji}>{slot.emoji}</Text>
            <Text style={styles.slotLabel}>{slot.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.itemsContainer}>
        <View style={styles.itemsGrid}>
          <TouchableOpacity
            style={[
              styles.itemButton,
              pet.clothes[selectedSlot] === null && styles.itemButtonSelected,
            ]}
            onPress={() => handleSelectItem(null)}
          >
            <Text style={styles.itemEmoji}>❌</Text>
            <Text style={styles.itemName}>Nenhum</Text>
          </TouchableOpacity>

          {itemsForSlot.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.itemButton,
                pet.clothes[selectedSlot] === item.id && styles.itemButtonSelected,
              ]}
              onPress={() => handleSelectItem(item.id)}
            >
              <View style={styles.itemPreview}>
                <Text style={styles.itemPlaceholder}>👔</Text>
              </View>
              <Text style={styles.itemName}>{item.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fce4ec',
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
    alignItems: 'center',
    paddingVertical: 16,
  },
  navigationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginHorizontal: 16,
  },
  arrowButton: {
    backgroundColor: '#f8bbd9',
    borderRadius: 30,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  arrowText: {
    fontSize: 28,
    color: '#c2185b',
    fontWeight: 'bold',
  },
  currentSlotContainer: {
    backgroundColor: '#f48fb1',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    minWidth: 120,
    borderWidth: 3,
    borderColor: '#c2185b',
  },
  currentSlotEmoji: {
    fontSize: 40,
    marginBottom: 4,
  },
  currentSlotLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  pageIndicator: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
    fontWeight: '600',
  },
  slotSelector: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    backgroundColor: '#fff',
    marginHorizontal: 16,
    borderRadius: 16,
  },
  slotButton: {
    alignItems: 'center',
    padding: 8,
    borderRadius: 12,
  },
  slotButtonSelected: {
    backgroundColor: '#f8bbd9',
  },
  slotEmoji: {
    fontSize: 24,
  },
  slotLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#333',
    marginTop: 2,
  },
  itemsContainer: {
    flex: 1,
    marginTop: 16,
  },
  itemsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    paddingHorizontal: 16,
  },
  itemButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    width: '30%',
    marginRight: '3%',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  itemButtonSelected: {
    borderColor: '#e91e63',
    backgroundColor: '#fce4ec',
  },
  itemPreview: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemPlaceholder: {
    fontSize: 32,
  },
  itemEmoji: {
    fontSize: 32,
    marginBottom: 4,
  },
  itemName: {
    fontSize: 10,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
});