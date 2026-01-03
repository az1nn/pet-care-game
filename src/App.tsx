import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ActivityIndicator, View, StyleSheet } from 'react-native';

import { PetProvider, usePet } from './context/PetContext';
import { ToastProvider } from './context/ToastContext';
import { MenuScreen } from './screens/MenuScreen';
import { CreatePetScreen } from './screens/CreatePetScreen';
import { HomeScreen } from './screens/HomeScreen';
import { FeedScene } from './screens/FeedScene';
import { BathScene } from './screens/BathScene';
import { WardrobeScene } from './screens/WardrobeScene';
import { PlayScene } from './screens/PlayScene';

const Stack = createNativeStackNavigator();

const AppNavigator: React.FC = () => {
  const { isLoading } = usePet();

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#9b59b6" />
      </View>
    );
  }

  return (
    <Stack.Navigator
      initialRouteName="Menu"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="Menu" component={MenuScreen} />
      <Stack.Screen name="CreatePet" component={CreatePetScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Feed" component={FeedScene} />
      <Stack.Screen name="Bath" component={BathScene} />
      <Stack.Screen name="Wardrobe" component={WardrobeScene} />
      <Stack.Screen name="Play" component={PlayScene} />
    </Stack.Navigator>
  );
};

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ToastProvider>
        <PetProvider>
          <NavigationContainer>
            <AppNavigator />
          </NavigationContainer>
        </PetProvider>
      </ToastProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f0ff',
  },
});