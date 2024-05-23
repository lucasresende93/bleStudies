import { useState } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import { Device } from 'react-native-ble-plx';
import base64 from 'react-native-base64';
import { useBluetooth } from './src/context/Bluetoothcontext';
import * as ExpoDevice from "expo-device";

const SERVICE_UUID = '0000fff0-0000-1000-8000-00805f9b34fb';
const CHARACTERISTIC_WRITE_UUID = '0000fff2-0000-1000-8000-00805f9b34fb';

interface BluetoothLowEnergyApi {
  requestPermissions(): Promise<boolean>;
  scanForPeripherals(): void;
  connectToDevice: (deviceId: Device) => Promise<void>;
  disconnectFromDevice: () => void;
  sendDataToBLEDeviceUP: (data: string) => void;
  sendDataToBLEDeviceDOWN: (data: string) => void;
  sendDataToBLEDeviceRESET: (data: string) => void;
  sendDataToBLEDeviceSPEED: (data: string) => void;
  connectedDevice: Device | null;
  allDevices: Device[];
  heartRate: number;
}

function useBLE(): BluetoothLowEnergyApi {
  const { bleManager, connectedDevice, setConnectedDevice } = useBluetooth();
  const [allDevices, setAllDevices] = useState<Device[]>([]);
  const [heartRate, setHeartRate] = useState<number>(0);

  const requestAndroid31Permissions = async () => {
    const bluetoothScanPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
      {
        title: 'Location Permission',
        message: 'Bluetooth Low Energy requires Location',
        buttonPositive: 'OK',
      }
    );
    const bluetoothConnectPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      {
        title: 'Location Permission',
        message: 'Bluetooth Low Energy requires Location',
        buttonPositive: 'OK',
      }
    );
    const fineLocationPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Location Permission',
        message: 'Bluetooth Low Energy requires Location',
        buttonPositive: 'OK',
      }
    );

    return (
      bluetoothScanPermission === 'granted' &&
      bluetoothConnectPermission === 'granted' &&
      fineLocationPermission === 'granted'
    );
  };

  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      if ((ExpoDevice.platformApiLevel ?? -1) < 31) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'Bluetooth Low Energy requires Location',
            buttonPositive: 'OK',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } else {
        const isAndroid31PermissionsGranted = await requestAndroid31Permissions();
        return isAndroid31PermissionsGranted;
      }
    } else {
      return true;
    }
  };

  const isDuplicteDevice = (devices: Device[], nextDevice: Device) =>
    devices.findIndex((device) => nextDevice.id === device.id) > -1;

  const scanForPeripherals = () => 
    bleManager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.log(error);
      }
      if (device && (device.name?.includes('HMSoft') || device.name?.includes('EBYTEBLE') || device.name?.includes('ShiftPower') || device.name?.includes('SPEEDBIKE'))) {
        console.log(device.name, device.id);
        setAllDevices((prevState: Device[]) => {
          if (!isDuplicteDevice(prevState, device)) {
            return [...prevState, device];
          }
          return prevState;
        });
      }
    });

  const connectToDevice = async (device: Device) => {
    console.log('item:', device.id);
    try {
      const deviceConnection = await bleManager.connectToDevice(device.id);
      setConnectedDevice(deviceConnection);
      await deviceConnection.discoverAllServicesAndCharacteristics();
      bleManager.stopDeviceScan();
      console.log('conectou modal');
      alert(`Conectou ${device.name}`);
    } catch (e) {
      console.log('FAILED TO CONNECT', e);
    }
  };

  const disconnectFromDevice = () => {
    if (connectedDevice) {
      bleManager.cancelDeviceConnection(connectedDevice.id);
      setConnectedDevice(null);
      console.log(connectedDevice);
    } else {
      bleManager.stopDeviceScan();
      console.log(connectedDevice);
    }
  };

  const sendDataToBLEDeviceUP = async (data: string) => {
    try {
      const dataAsBytes = base64.encode('TFWU¸');
      if (connectedDevice) {
        await bleManager.writeCharacteristicWithoutResponseForDevice(connectedDevice.id, SERVICE_UUID, CHARACTERISTIC_WRITE_UUID, dataAsBytes);
        console.log('Success', 'Data sent successfully');
      }
    } catch (error: any) {
      console.log('Error', `Failed to send data: ${error.message}`);
    }
    console.log(connectedDevice);
  };

  const sendDataToBLEDeviceDOWN = async (data: string) => {
    try {
      const dataAsBytes = base64.encode('TFWDÉ');
      if (connectedDevice) {
        await bleManager.writeCharacteristicWithoutResponseForDevice(connectedDevice.id, SERVICE_UUID, CHARACTERISTIC_WRITE_UUID, dataAsBytes);
        console.log('Success', 'Data sent successfully');
      }
    } catch (error: any) {
      console.log('Error', `Failed to send data: ${error.message}`);
    }
  };
  const sendDataToBLEDeviceRESET = async (data: string) => {
    try {
      const dataAsBytes = base64.encode('TFWR»');
      if (connectedDevice) {
        await bleManager.writeCharacteristicWithoutResponseForDevice(connectedDevice.id, SERVICE_UUID, CHARACTERISTIC_WRITE_UUID, dataAsBytes);
        console.log('Success', 'Data sent successfully');
      }
    } catch (error: any) {
      console.log('Error', `Failed to send data: ${error.message}`);
    }
  };
  const sendDataToBLEDeviceSPEED = async (data: string) => {
    try {
      const dataAsBytes = base64.encode('TFWR»');
      if (connectedDevice) {
        await bleManager.writeCharacteristicWithoutResponseForDevice(connectedDevice.id, SERVICE_UUID, CHARACTERISTIC_WRITE_UUID, dataAsBytes);
        console.log('Success', 'Data sent successfully');
      }
    } catch (error: any) {
      console.log('Error', `Failed to send data: ${error.message}`);
    }
  };

  return {
    requestPermissions,
    scanForPeripherals,
    connectToDevice,
    disconnectFromDevice,
    sendDataToBLEDeviceUP,
    sendDataToBLEDeviceDOWN,
    sendDataToBLEDeviceRESET,
    sendDataToBLEDeviceSPEED,
    connectedDevice,
    allDevices,
    heartRate,
  };
}

export default useBLE;
