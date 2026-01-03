import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PetRenderer from './PetRenderer';

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pet Care Game</Text>
      <PetRenderer size={350} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default HomeScreen;