import React from 'react';
import {View} from 'react-native';
import WelcomeScreen from './app/Screens/WelcomeScreen';
import ViewImageScreen from './app/Screens/ViewImageScreen';
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

export default function App() {

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown:false}} initialRouteName='welcome'>
        <Stack.Screen name='welcome' component={WelcomeScreen}  />
        <Stack.Screen name='View' component={ViewImageScreen}  />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
