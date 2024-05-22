import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  ImageBackground,
  SafeAreaView,
  Appearance,
  StatusBar
} from 'react-native';

import loginWindow from './src/pages/LoginScreen'
import bleWindow from './src/pages/BleScreen'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import StackComponent from './src/navigators/mainStack';

const Stack = createNativeStackNavigator();


const App = () => {

  return (
    <StackComponent/>
  );
};

export default App;
