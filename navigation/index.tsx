// navigation/index.tsx

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ImportScreen from '../screens/ImportScreen';

export type RootStackParamList = {
  Import: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Import">
        <Stack.Screen name="Import" component={ImportScreen} options={{ title: 'Import Workout' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
