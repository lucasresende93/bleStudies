import * as React from 'react';
import { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';
import LoginScreen from '../pages/LoginScreen';
import BleWindow from '../pages/BleScreen';
import BleWindow2 from '../pages/BleScreen2';
import { Image, TouchableOpacity, View, Text, StyleSheet, Modal, FlatList } from 'react-native'


import useBLE from "../../useBLE";


const Stack = createNativeStackNavigator();

type StackNavigation = {
    Login: undefined;
    ble: undefined;
}

export type StackTypes = NativeStackNavigationProp<StackNavigation>;

const LogoTitle = () => {

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

    const scanForDevices = async () => {
        const isPermissionsEnabled = await requestPermissions();
        if (isPermissionsEnabled) {
            console.log('entrouHeader')
            scanForPeripherals();

        }
    }

    const [modalVisible, setModalVisible] = useState(false);
    return (
        <View style={styles.headerStack}>

            <Modal
                animationType='slide'
                transparent={true}
                onShow={scanForDevices}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text >Dispositivos Encontrados</Text>
                        <View style={{ marginTop: 5, width: '50%' }}>
                            {
                                allDevices.length > 0 &&
                                (
                                    <FlatList
                                        data={allDevices}
                                        keyExtractor={(item) => item.id} // Use the device ID as the key
                                        renderItem={({ item }) => (

                                            <TouchableOpacity onPress={() => { connectToDevice(item) }}>
                                                <View >
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
                            {/*#f44235 cor do botao de fechar  */}
                            <TouchableOpacity
                                style={[styles.button, { backgroundColor: connectedDevice? '#f44235' : 'gray', marginBottom: 2,marginTop: 50 }]}
                                onPress={() => setModalVisible(!modalVisible)}>
                                <Text style={{alignSelf: 'center'}}>Fechar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <Text>
                Dispositivo Desconectado
            </Text>
            <TouchableOpacity onPress={() => setModalVisible(true)}>
                <Image
                    style={{ width: 30, height: 30, marginLeft: 120 }}
                    source={require('../../assets/ble_48px.png')}
                />
            </TouchableOpacity>
        </View>
    );
}




export default function StackComponent() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName='Login'>
                <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
                <Stack.Screen name="ble" component={BleWindow2} options={{ headerTitle: LogoTitle, headerBackVisible: false }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}


const styles = StyleSheet.create({
    headerStack:
    {
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center'
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
    },

})