import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { OrixasOfferingHomeScreen } from './OrixasOfferingHomeScreen';
import { OrixasOfferingGameScreen } from './OrixasOfferingGameScreen';
import { RootStackParamList } from '../types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const OrixasOfferingNavigator: React.FC = () => (
  <Stack.Navigator
    initialRouteName="OrixasOfferingHome"
    screenOptions={{ headerShown: false, animation: 'slide_from_right' }}
  >
    <Stack.Screen name="OrixasOfferingHome" component={OrixasOfferingHomeScreen} />
    <Stack.Screen name="OrixasOfferingGame" component={OrixasOfferingGameScreen} />
  </Stack.Navigator>
);
