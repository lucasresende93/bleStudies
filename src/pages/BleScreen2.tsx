import React, { useEffect, useInsertionEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, StatusBar, FlatList, View, Alert, StyleSheet, TouchableOpacity, Image } from 'react-native'

import base64 from 'react-native-base64'
import useBLE from "../../useBLE";

const SERVICE_UUID = "0000fff0-0000-1000-8000-00805f9b34fb"; //"0xFFF0" 0000fff0-0000-1000-8000-00805f9b34fb
const CHARACTERISTIC_WRITE_UUID = "0000fff2-0000-1000-8000-00805f9b34fb"; // 0xFFF2 0000fff2-0000-1000-8000-00805f9b34fb

const BleWindow2 = () => {
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
    } = useBLE();


    // const scanForDevices = async () => {
    //     const isPermissionsEnabled = await requestPermissions();
    //     if (isPermissionsEnabled) {
    //         console.log('BOTAO')
    //         scanForPeripherals();

    //     }
    // }

    return (
        <SafeAreaView>
            <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
            {/* <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
                <Text>
                    Dispositivo !
                </Text>
                <TouchableOpacity onPress={() => { console.log('teste') }}>
                    <Image style={{ width: 30, height: 30 }} source={require('../../assets/ble_48px.png')} />
                </TouchableOpacity>
            </View> */}
            {
                allDevices.length > 0 &&
                (
                    <FlatList
                        data={allDevices}
                        keyExtractor={(item) => item.id} // Use the device ID as the key
                        renderItem={({ item }) => (

                            <TouchableOpacity onPress={() => { connectToDevice(item) }}>
                                <View style={{ marginRight: 10, marginLeft: 10, padding: 10, backgroundColor: '#D6E3ED', borderRadius: 5, marginTop: 10 }}>
                                    <Text style={{ fontWeight: 'bold', fontStyle: 'italic' }}>
                                        {item.name}
                                    </Text>
                                    <Text>
                                        {item.id}
                                    </Text>
                                </View>
                            </TouchableOpacity>

                        )}
                    />
                )
            }

            <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                <TouchableOpacity style={styles.buttonConect} onPress={scanForPeripherals}>
                    <Text style={styles.textConnect}>
                        Scan
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonConect} onPress={disconnectFromDevice}>
                    <Text style={styles.textConnect}>
                        StopScan
                    </Text>
                </TouchableOpacity>
            </View>

            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <TouchableOpacity style={{ marginLeft: 20, marginTop: 18 }} onPress={() => sendDataToBLEDeviceUP('54 46 57 44 01 01 C9')}>
                    <Text style={{ fontSize: 20 }}>
                        UP
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ marginRight: 20, marginTop: 18 }} onPress={() => sendDataToBLEDeviceDOWN('teste')}>
                    <Text style={{ fontSize: 20 }}>
                        DOWN
                    </Text>
                </TouchableOpacity>
            </View>

            <View style={{ padding: 10, backgroundColor: connectedDevice ? '#B2EDAB' : 'gray', borderRadius: 5, marginTop: 200 }}>
                <Text style={{ fontWeight: 'bold', fontStyle: 'italic', fontSize: 18, alignSelf: 'center' }}>
                    {connectedDevice ? `Conectado em ${connectedDevice.id}` : 'No device connected'}
                </Text>
            </View>

            {/* <TouchableOpacity style={styles.disconnectButton} onPress={disconnectFromDevice}>
                <Text style={{ fontSize: 20, alignSelf: 'center' }}>
                    Disconnect
                </Text>
            </TouchableOpacity> */}

        </SafeAreaView>
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
    }

})