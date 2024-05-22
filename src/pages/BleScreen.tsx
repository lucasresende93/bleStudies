import React, { useEffect, useInsertionEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, StatusBar, Button, PermissionsAndroid, Platform, FlatList, View, Alert, StyleSheet, Touchable, TouchableOpacity } from 'react-native'
import { BleManager, Device, BleError, Characteristic } from 'react-native-ble-plx'
import { isSearchBarAvailableForCurrentPlatform } from "react-native-screens";
import base64 from 'react-native-base64'

let controle = false;

const SERVICE_UUID = "0000fff0-0000-1000-8000-00805f9b34fb"; //"0xFFF0" 0000fff0-0000-1000-8000-00805f9b34fb
const CHARACTERISTIC_READ_UUID = '0xFFF1';
const CHARACTERISTIC_WRITE_UUID = "0000fff2-0000-1000-8000-00805f9b34fb"; // 0xFFF2 0000fff2-0000-1000-8000-00805f9b34fb

const BleWindow = () => {
    const manager = new BleManager()
    const [devices, setDevices] = useState<Device[]>([]);
    const [isScanning, setIsScanning] = useState(false);
    const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);

    useEffect(() => {
        const subscription = manager.onStateChange((state) => {
            if (state === 'PoweredOn') {
                //scanAndConnect();
                //subscription.remove();
            }
        }, true);
        return () => manager.destroy();
    }, []);

    const isDuplicteDevice = (devices: Device[], nextDevice: Device) =>
        devices.findIndex((device) => nextDevice.id === device.id) > -1;

    const requestPermissions = async () => {
        if (Platform.OS === 'android') {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    title: 'Permissão de Localização',
                    message: 'Este aplicativo precisa de acesso à localização para usar o Bluetooth.',
                    buttonNeutral: 'Perguntar Depois',
                    buttonNegative: 'Cancelar',
                    buttonPositive: 'OK',
                }
            );
            if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
                Alert.alert('Permissão de localização negada');
                return false;
            }
        }
        return true;
    };

    const scanAndConnect = async () => {
        const permission = await requestPermissions();

        if (!permission) return;
        setIsScanning(true);
        manager.startDeviceScan(null, null, (error, device) => {
            console.log("Sacanning...");
            if (error) {
                setIsScanning(false);
                console.error(error);
                return;
            }
            if (device && device.name?.includes("EBYTEBLE"  || 'SPEEDBIKE')) {
                setDevices((prevState: Device[]) => {
                    if (!isDuplicteDevice(prevState, device)) {
                        return [...prevState, device];
                    }
                    return prevState;
                });
            }
        });

        setTimeout(() => {
            manager.stopDeviceScan();
            setIsScanning(false); // Reseta o estado de escaneamento
        }, 1000);
    }

    const handleScanButtonPress = () => {
        console.log("clicou")
        setIsScanning(false);
    };

    // const connectToDevice = async (device: Device) => {
    //     console.log(JSON.stringify(device));
    //     try {
    //         const deviceConnection = await manager.connectToDevice(device.id);
    //         setConnectedDevice(deviceConnection);
    //         await deviceConnection.discoverAllServicesAndCharacteristics();
    //         manager.stopDeviceScan();
    //         console.log('dispositivo conectado', connectedDevice);
    //     }
    //     catch (e) {
    //         console.log("Failed to Connect error:", e);
    //     }
    // };

    const connectDevice = async (device: Device) => {
        console.log(`Tentando conectar em ${device.id}`)
        try {
            const deviceConnection = await manager.connectToDevice(device.id);
            setConnectedDevice(deviceConnection);
            await deviceConnection.discoverAllServicesAndCharacteristics();
            manager.stopDeviceScan();
        } catch (e) {
            console.log("Falha na conexao", e);
        }




        // manager.stopDeviceScan();
        // manager.connectToDevice(device.id).then(async device => {
        //     await device.discoverAllServicesAndCharacteristics();
        //     manager.stopDeviceScan();
        //     console.log(`Device connected with ${device.name}`);
        //     setConnectedDevice(device);
        //     setDevices([]);
        // });
    };



    const disconnectFromDevice = () => {
        if (connectedDevice) {
            manager.cancelDeviceConnection(connectedDevice.id);
            console.log('desconectou', connectedDevice.id);
            setConnectedDevice(null);
        }
    };


    const writeWithoutResponse = async (device: Device, serviceUuid: string, characteristicUuid: string, data: string) => {

        if (connectedDevice) {
            // console.log(device.id)
            // console.log(serviceUuid)
            // console.log(characteristicUuid)
            // console.log(data)
        }

        const dataAsBytes = base64.encode(data);
        console.log('dataAsBytes', dataAsBytes);

        try {
            console.log('Attempting to write w/o response...');
            const testeEnvio = await manager.writeCharacteristicWithoutResponseForDevice(
                device.id,
                serviceUuid,
                characteristicUuid,
                dataAsBytes
            );
            console.log('Write succesful', testeEnvio);

        } catch (e) {
            console.log(e);
        }
    }




    return (
        <SafeAreaView>
            <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

            <View style={{ width: '100%', padding: 10, alignItems: 'center', flexDirection: 'row', justifyContent: 'space-around' }}>

                <Button color="#007AFF" title={isScanning ? "Escaneando..." : "Escanear BLE"} onPress={scanAndConnect} disabled={isScanning} />
                <Button color="#94BC1C" title='Send' onPress={() => {
                    if (connectedDevice) { writeWithoutResponse(connectedDevice, SERVICE_UUID, CHARACTERISTIC_WRITE_UUID, 'FF') }
                    else {
                        console.log("nao conectou")
                    }
                }} />
                <Button color="#EB7474" title="Desconectar" onPress={disconnectFromDevice} />

            </View>

            <View style={{ paddingTop: 60 }}>
                {
                    controle &&
                    <Text style={{ textAlign: 'center', fontSize: 18, marginBottom: 5 }}>
                        Dispositivos Encontrados:
                    </Text>
                }
            </View>

            {
                devices.length > 0 &&
                (
                    <FlatList
                        data={devices}
                        keyExtractor={(item) => item.id} // Use the device ID as the key
                        renderItem={({ item }) => (
                            <View style={[styles.deviceList, styles.boxShadow]}>
                                <Text style={{ flex: 1, fontWeight: 'bold', alignSelf: 'center', fontStyle: 'italic' }}>{item.name}</Text>
                                <Text>{item.id}</Text>
                            </View>
                        )}
                    />
                )
            }


            <View>
                <Text style={{ fontSize: 16, fontWeight: 'bold', textAlign: 'center', marginTop: 20 }}>
                    {connectedDevice ? `Conectado: ${connectedDevice.name} ${connectedDevice.id}` : 'Desconectado'}
                </Text>
            </View>

            <TouchableOpacity style={styles.buttonConect} onPress={() => connectDevice(devices[0])}>
                <Text style={styles.textConnect}>
                    Conectar
                </Text>
            </TouchableOpacity>
            <View style={{ paddingTop: 60, width: '100%', alignItems: 'center' }}>
                <Button title='Dispositivo Conectado' onPress={() => console.log(connectedDevice?.id)} />

            </View>



        </SafeAreaView>



    )
}


export default BleWindow;

const styles = StyleSheet.create({
    deviceList: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        backgroundColor: 'gray',
        borderRadius: 5,
        width: '95%',
        height: 50,
        alignSelf: 'center',
        marginBottom: 10

    },
    boxShadow: {
        shadowColor: "#255",
        shadowOffset: {
            width: 0,
            height: 7,
        },
        shadowOpacity: 0.43,
        shadowRadius: 9.51,

        elevation: 15,
    },
    buttonConect: {
        marginTop: 24,
        padding: 10,
        borderRadius: 5,
        width: '75%',
        backgroundColor: 'blue',
        alignSelf: 'center'
    },
    textConnect: {
        fontWeight: 'bold',
        alignSelf: 'center',
        fontSize: 18,
        color: 'white'
    }

})