import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Pressable, Text } from 'react-native';

import ImportScreen from '../screens/ImportScreen';
import LibraryScreen from '../screens/LibraryScreen';
import HomeScreen from '../screens/HomeScreen';
import WorkoutsScreen from '../screens/WorkoutsScreen';
import WorkoutDetailScreen from '../screens/WorkoutDetailScreen';
import WorkoutRunScreen from '../screens/WorkoutRunScreen';
import CustomWorkoutsScreen from '../screens/CustomWorkoutsScreen';

export type RootStackParamList = {
  Import: undefined;
  Library: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

function Tabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Workouts" component={WorkoutsScreen} />
      <Tab.Screen name="Add" component={ImportScreen} />
      <Tab.Screen name="Custom" component={CustomWorkoutsScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Tabs">
        <Stack.Screen name="Tabs" component={Tabs} options={{ headerShown: false }} />
        <Stack.Screen name="Library" component={LibraryScreen} options={{ title: 'Saved Workouts' }} />
        <Stack.Screen name="WorkoutDetail" component={WorkoutDetailScreen} options={{ title: 'Workout' }} />
        <Stack.Screen name="WorkoutRun" component={WorkoutRunScreen} options={{ title: 'Run' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
