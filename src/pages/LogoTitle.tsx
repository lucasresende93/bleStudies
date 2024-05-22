import * as React from 'react';
import { useState, useContext } from 'react';
import { Image, TouchableOpacity, View, Text, StyleSheet, Modal, FlatList } from 'react-native';
import useBLE from '../../useBLE';
import { BluetoothContext } from '../context/Bluetoothcontext'; // Importar o contexto
import { Device } from 'react-native-ble-plx';

const LogoTitle = () => {
  const {
    requestPermissions,
    scanForPeripherals,
    allDevices,
    connectToDevice,
    disconnectFromDevice,
    sendDataToBLEDeviceUP,
    sendDataToBLEDeviceDOWN,
  } = useBLE();

  const bluetoothContext = useContext(BluetoothContext); // Obter o contexto

  if (!bluetoothContext) {
    throw new Error('LogoTitle must be used within a BluetoothProvider');
  }

  const { connectedDevice, setConnectedDevice } = bluetoothContext; // Usar o contexto

  const scanForDevices = async () => {
    const isPermissionsEnabled = await requestPermissions();
    if (isPermissionsEnabled) {
      console.log('Entrou Modal.');
      scanForPeripherals();
    }
  };

  const handleDeviceSelect = (device: Device) => {
    connectToDevice(device).then(() => setConnectedDevice(device));
  };

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
            <Text>Dispositivos Encontrados</Text>
            <View style={{ marginTop: 5, width: '50%' }}>
              {allDevices.length > 0 && (
                <FlatList
                  data={allDevices}
                  keyExtractor={(item) => item.id} // Use the device ID as the key
                  renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => handleDeviceSelect(item)}>
                      <View>
                        <Text style={{ fontWeight: 'bold', fontStyle: 'italic' }}>{item.name}</Text>
                        <Text>{item.id}</Text>
                      </View>
                    </TouchableOpacity>
                  )}
                />
              )}
              {/*#f44235 cor do botao de fechar  */}
              <TouchableOpacity
                style={[styles.button, { backgroundColor: connectedDevice ? '#f44235' : 'gray', marginBottom: 2, marginTop: 50 }]}
                onPress={() => setModalVisible(!modalVisible)}>
                <Text style={{ alignSelf: 'center' }}>Fechar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Text>Dispositivo {connectedDevice ? `Conectado` : 'Desconectado'}</Text>
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <Image
          style={{ width: 30, height: 30, marginLeft: 120 }}
          source={require('../../assets/ble_48px.png')}
        />
      </TouchableOpacity>
    </View>
  );
};

export default LogoTitle;

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