/* eslint-disable no-bitwise */
import { useMemo, useState } from "react";
import { PermissionsAndroid, Platform } from "react-native";
import {
  BleError,
  BleManager,
  Characteristic,
  Device,
} from "react-native-ble-plx";
import { Buffer } from 'buffer';

import * as ExpoDevice from "expo-device";

import base64 from "react-native-base64";



const SERVICE_UUID = "0000fff0-0000-1000-8000-00805f9b34fb";
const CHARACTERISTIC_WRITE_UUID = "0000fff2-0000-1000-8000-00805f9b34fb";

interface BluetoothLowEnergyApi {
  requestPermissions(): Promise<boolean>;
  scanForPeripherals(): void;
  connectToDevice: (deviceId: Device) => Promise<void>;
  disconnectFromDevice: () => void;
  sendDataToBLEDeviceUP: (data: string) => void;
  sendDataToBLEDeviceDOWN: (data: string) => void;
  connectedDevice: Device | null;
  allDevices: Device[];
  heartRate: number;
}

function useBLE(): BluetoothLowEnergyApi {
  const bleManager = useMemo(() => new BleManager(), []);
  const [allDevices, setAllDevices] = useState<Device[]>([]);
  const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);
  const [heartRate, setHeartRate] = useState<number>(0);

  const [isScanning, setIsScanning] = useState(false);

  const requestAndroid31Permissions = async () => {
    const bluetoothScanPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
      {
        title: "Location Permission",
        message: "Bluetooth Low Energy requires Location",
        buttonPositive: "OK",
      }
    );
    const bluetoothConnectPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      {
        title: "Location Permission",
        message: "Bluetooth Low Energy requires Location",
        buttonPositive: "OK",
      }
    );
    const fineLocationPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: "Location Permission",
        message: "Bluetooth Low Energy requires Location",
        buttonPositive: "OK",
      }
    );

    return (
      bluetoothScanPermission === "granted" &&
      bluetoothConnectPermission === "granted" &&
      fineLocationPermission === "granted"
    );
  };

  const requestPermissions = async () => {
    if (Platform.OS === "android") {
      if ((ExpoDevice.platformApiLevel ?? -1) < 31) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: "Location Permission",
            message: "Bluetooth Low Energy requires Location",
            buttonPositive: "OK",
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } else {
        const isAndroid31PermissionsGranted =
          await requestAndroid31Permissions();

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
        // setTimeout(() => {
        //    bleManager.stopDeviceScan();
        //     setIsScanning(false); // Reseta o estado de escaneamento
        // }, 2000);

      }

    });

  const connectToDevice = async (device: Device) => {
    console.log('item:', device.id)
    try {
      const deviceConnection = await bleManager.connectToDevice(device.id);
      setConnectedDevice(deviceConnection);
      await deviceConnection.discoverAllServicesAndCharacteristics();
      bleManager.stopDeviceScan();
      console.log('conectou modal')

      alert(`Conectou ${device.name}`)
      //startStreamingData(deviceConnection);
    } catch (e) {
      console.log("FAILED TO CONNECT", e);
    }
  };

  const disconnectFromDevice = () => {
    if (connectedDevice) {
      bleManager.cancelDeviceConnection(connectedDevice.id);
      setConnectedDevice(null);
      console.log(connectedDevice);
    }
    else {
      bleManager.stopDeviceScan();
      console.log(connectedDevice)
    }
  };

  const onHeartRateUpdate = (
    error: BleError | null,
    characteristic: Characteristic | null
  ) => {
    if (error) {
      console.log(error);
      return -1;
    } else if (!characteristic?.value) {
      console.log("No Data was recieved");
      return -1;
    }

    //const rawData = base64.decode(characteristic.value);
    // let innerHeartRate: number = -1;

    //   const firstBitValue: number = Number(rawData) & 0x01;

    // if (firstBitValue === 0) {
    //   innerHeartRate = rawData[1].charCodeAt(0);
    // } else {
    //   innerHeartRate =
    //     Number(rawData[1].charCodeAt(0) << 8) +
    //     Number(rawData[2].charCodeAt(2));
    // }

    // setHeartRate(innerHeartRate);
  };

  const startStreamingData = async (device: Device) => {
    if (device) {
      device.monitorCharacteristicForService(
        SERVICE_UUID,
        CHARACTERISTIC_WRITE_UUID,
        onHeartRateUpdate
      );
    } else {
      console.log("No Device Connected");
    }
  };

  const sendDataToBLEDeviceUP = async (data: string) => {
    try {

      // const dataAsBytes = base64.encode(data);

      // const dataBuffer = Buffer.from(data.split(' ').map(byte => parseInt(byte, 16)));
      // const dataStringBase64 = dataBuffer.toString('base64');
      // const dataAsBytes = base64.encode(dataStringBase64)
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
      // Converte a string de dados para um ArrayBuffer
      const data = 'TFW';
      const dataAsBytes = base64.encode('TFWDÉ');

      if (connectedDevice) {
        await bleManager.writeCharacteristicWithoutResponseForDevice(connectedDevice.id, SERVICE_UUID, CHARACTERISTIC_WRITE_UUID, dataAsBytes);
        console.log('Success', 'Data sent successfully');
      }
      
        
     

    } catch (error: any) {

      console.log('Error', `Failed to send data: ${error.message}`);
    }
  };

  return {
    scanForPeripherals,
    requestPermissions,
    connectToDevice,
    sendDataToBLEDeviceUP,
    sendDataToBLEDeviceDOWN,
    allDevices,
    connectedDevice,
    disconnectFromDevice,
    heartRate,
  };
}

export default useBLE;
