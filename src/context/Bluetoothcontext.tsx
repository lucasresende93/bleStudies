import React, { createContext, useState, useContext, ReactNode, useMemo } from 'react';
import { BleManager, Device } from 'react-native-ble-plx';

interface BluetoothContextProps {
  bleManager: BleManager;
  connectedDevice: Device | null;
  setConnectedDevice: (device: Device | null) => void;
}

const BluetoothContext = createContext<BluetoothContextProps | undefined>(undefined);

export const BluetoothProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const bleManager = useMemo(() => new BleManager(), []);
  const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);

  return (
    <BluetoothContext.Provider value={{ bleManager, connectedDevice, setConnectedDevice }}>
      {children}
    </BluetoothContext.Provider>
  );
};

export const useBluetooth = (): BluetoothContextProps => {
  const context = useContext(BluetoothContext);
  if (!context) {
    throw new Error('useBluetooth must be used within a BluetoothProvider');
  }
  return context;
};
export { BluetoothContext };
