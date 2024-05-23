import React, { useEffect, useInsertionEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, StatusBar, FlatList, View, Alert, StyleSheet, TouchableOpacity, Image } from 'react-native'
import * as Location from 'expo-location'


import base64 from 'react-native-base64'
import useBLE from "../../useBLE";

const SERVICE_UUID = "0000fff0-0000-1000-8000-00805f9b34fb"; //"0xFFF0" 0000fff0-0000-1000-8000-00805f9b34fb
const CHARACTERISTIC_WRITE_UUID = "0000fff2-0000-1000-8000-00805f9b34fb"; // 0xFFF2 0000fff2-0000-1000-8000-00805f9b34fb

const BleWindow2 = () => {

    const [location, setLocation] = useState<Location.LocationObject | null>(null);




    useEffect(() => {
        const getPermissions = async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.log('Please grant location permissions');
                Alert.alert('Permission to access location was denied');
                return;
            }
            let location = await Location.getCurrentPositionAsync({});
            setLocation(location);
        };
        getPermissions();
    }, []);

    useEffect(() => {
        Location.watchPositionAsync({
            accuracy: Location.LocationAccuracy.Highest,
            timeInterval: 500,
            distanceInterval: 1
        }, (response) => {
            setLocation(response);
            sendDataToBLEDeviceSPEED('TESTE');
            console.log('New Location', response);
        })
    }, []);


    const {
        requestPermissions,
        scanForPeripherals,
        allDevices,
        connectToDevice,
        connectedDevice,
        heartRate,
        disconnectFromDevice,
        sendDataToBLEDeviceUP,
        sendDataToBLEDeviceDOWN,
        sendDataToBLEDeviceRESET,
        sendDataToBLEDeviceSPEED,
    } = useBLE();


    // const scanForDevices = async () => {
    //     const isPermissionsEnabled = await requestPermissions();
    //     if (isPermissionsEnabled) {
    //         console.log('BOTAO')
    //         scanForPeripherals();

    //     }
    // }

    return (
        <View style={{ backgroundColor: '#D3D3D3', marginTop: 0 }}>
            <SafeAreaView>
                <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
                <View style={{ alignItems: 'center', marginTop: 30 }}>
                    <Text style={{ fontSize: 20 }}>
                        VELOCIDADE
                    </Text>
                    <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                        <Text style={{ fontSize: 68 }}>
                            {location?.coords.speed ? parseFloat(((+location.coords.speed * 3.6) + 2).toFixed(2)) : 0}
                        </Text>
                        <Text>
                            km/h
                        </Text>
                    </View>
                </View>

                <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 150, marginHorizontal: 50, alignItems: 'center' }}>
                    <TouchableOpacity style={[styles.cmdButton, { backgroundColor: "#94bc1c" }]} onPress={() => sendDataToBLEDeviceUP('54 46 57 44 01 01 C9')}>
                        <Text style={{ fontSize: 20 }}>
                            UP
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.cmdButton, { backgroundColor: "#94bc1c" }]} onPress={() => sendDataToBLEDeviceDOWN('teste')}>
                        <Text style={{ fontSize: 20 }}>
                            DOWN
                        </Text>
                    </TouchableOpacity>
                </View>

                <View style={{ padding: 10, marginTop: 20, marginHorizontal: 50 }}>
                    <TouchableOpacity style={[styles.cmdButton, { backgroundColor: "#cd5c5c" }]} onPress={() => sendDataToBLEDeviceRESET('teste')}>
                        <Text style={{ fontSize: 20, alignSelf: 'center' }}>
                            RESET ⚠️
                        </Text>
                    </TouchableOpacity>
                </View>

                <View style={{ padding: 10, backgroundColor: connectedDevice ? '#B2EDAB' : 'gray', borderRadius: 5, marginHorizontal: 50, marginTop: 130 }}>
                    <Text style={{ fontWeight: 'bold', fontStyle: 'italic', fontSize: 18, alignSelf: 'center' }}>
                        {connectedDevice ? `Conectado em ${connectedDevice.id}` : 'No device connected'}
                    </Text>
                </View>
            </SafeAreaView>
        </View>
    )
}


export default BleWindow2;

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
        width: '30%',
        backgroundColor: 'blue',
        alignSelf: 'center'
    },
    textConnect: {
        fontWeight: 'bold',
        alignSelf: 'center',
        fontSize: 18,
        color: 'white'
    },
    sendButton: {
        marginTop: 20,
        width: '75%',
        padding: 10,
        alignSelf: 'center',
        height: 50,
        backgroundColor: 'green'
    },
    disconnectButton:
    {
        width: '75%',
        padding: 10,
        alignSelf: 'center',
        height: 50,
        backgroundColor: 'red'
    },
    cmdButton: {
        marginHorizontal: 5,
        padding: 10,
        borderRadius: 10
    },

})