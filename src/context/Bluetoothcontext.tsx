import React, { createContext, useState, ReactNode } from 'react';
import { Device } from 'react-native-ble-plx';

interface BluetoothContextProps {
  connectedDevice: Device | null;
  setConnectedDevice: (device: Device | null) => void;
}

export const BluetoothContext = React.createContext<BluetoothContextProps | undefined>(undefined);

export const BluetoothProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);

  return (
    <BluetoothContext.Provider value={{ connectedDevice, setConnectedDevice }}>
      {children}
    </BluetoothContext.Provider>
  );
};

export const useBluetooth = () => {
  const context = React.useContext(BluetoothContext);
  if (!context) {
    throw new Error('useBluetooth must be used within a BluetoothProvider');
  }
  return context;
};
