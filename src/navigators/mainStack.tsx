import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';
import LoginScreen from '../pages/LoginScreen';
import BleWindow2 from '../pages/BleScreen2';
import { BluetoothProvider } from '../context/Bluetoothcontext';
import LogoTitle from '../pages/LogoTitle'; // Certifique-se que o caminho está correto

const Stack = createNativeStackNavigator();

type StackNavigation = {
  Login: undefined;
  ble: undefined;
};

export type StackTypes = NativeStackNavigationProp<StackNavigation>;

const StackComponent = () => {
  return (
    <NavigationContainer>
      <BluetoothProvider>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="ble" component={BleWindow2} options={{ headerTitle: LogoTitle, headerBackVisible: false }} />
        </Stack.Navigator>
      </BluetoothProvider>
    </NavigationContainer>
  );
};

export default StackComponent;
