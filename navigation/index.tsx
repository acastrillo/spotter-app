import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Pressable, Text } from 'react-native';

import ImportScreen from '../screens/ImportScreen';
import LibraryScreen from '../screens/LibraryScreen';

export type RootStackParamList = {
  Import: undefined;
  Library: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Import">
        <Stack.Screen
          name="Import"
          component={ImportScreen}
          options={({ navigation }) => ({
            title: 'Import Workout',
            headerRight: () => (
              <Pressable onPress={() => navigation.navigate('Library')}>
                <Text style={{ color: '#2563EB', fontWeight: '600' }}>Library</Text>
              </Pressable>
            ),
          })}
        />
        <Stack.Screen name="Library" component={LibraryScreen} options={{ title: 'Saved Workouts' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
