import React, { useState, useEffect } from 'react';
import {
    Button,
    ScrollView,
    View,
    Text,
    TextInput,
    Image,
    TouchableOpacity,
    ImageBackground,
    SafeAreaView,
    Appearance,
    StatusBar,
    StyleSheet

} from 'react-native';

import { StackActionType, useNavigation } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { styles } from '../../styles';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
// Assuming you have a stack navigator defined somewhere in your app
import { StackTypes } from '../navigators/mainStack';

const LoginScreen = () => {
    const navigation = useNavigation<StackTypes>();

    const [emailField, setEmailField] = useState<string>(' ')
    const [passwordField, setPasswordField] = useState<string>(' ')



    return (
        <SafeAreaView>
            <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
            <ScrollView style={styles.scrollView}>

                <ImageBackground source={require('../../assets/background.png')} resizeMode="cover" style={{
                    height: null,
                    overflow: 'hidden',
                    flex: 1
                }}>

                    <View style={styles.container}>
                        <Image
                            source={require('../../assets/truespeed_logo.png')}
                            style={styles.logo}
                        />
                        <Text style={styles.h1}>Login</Text>
                        <Text style={styles.h2}>Digite seus dados abaixo:</Text>

                        <View style={styles.inputArea}>
                            <Text style={styles.inputLabel}>Email</Text>
                            <TextInput
                                style={styles.inputField}
                                placeholderTextColor='gray'
                                placeholder='Digite seu email'
                                autoCapitalize='none'
                                keyboardType='email-address'
                                value={emailField}
                                onChangeText={(t) => setEmailField(t)}
                            />
                        </View>
                        <View style={styles.inputArea}>
                            <Text style={styles.inputLabel}>Senha</Text>
                            <TextInput
                                style={styles.inputField}
                                placeholderTextColor='gray'
                                placeholder="*******"
                                secureTextEntry
                                value={passwordField}
                                onChangeText={t => setPasswordField(t)}
                            />
                        </View>
                        <View style={styles.aditionals}>
                            <TouchableOpacity style={styles.forgotBtnArea}>
                                <Text style={styles.forgotBtnText}>Esqueci minha senha</Text>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('ble')}>
                            <View style={styles2.container}>
                                <View style={{  marginRight: 0, }}>
                                    <Image source={require('../../assets/google_20px.png')} />
                                </View>
                                <View style={ {  paddingLeft: 10}}>
                                    <Text style={{ fontSize: 18, color:'white',  fontWeight: 'bold' }}>
                                        Entrar com Google
                                    </Text>
                                </View>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('ble')}>
                            <Text style={styles.buttonText}>
                                Entrar
                            </Text>
                        </TouchableOpacity>

                        <View style={styles.signUpArea}>
                            <Text style={styles.signUpText}>Não tem uma conta?</Text>
                            <TouchableOpacity>
                                <Text style={styles.singUpBtnText}> Cadastre-se </Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.footerArea}>
                            <Text style={styles.footerText}>Triunfo Engenharia  🚀</Text>
                        </View>

                    </View>
                    
                </ImageBackground>
            </ScrollView >
        </SafeAreaView >
    )
}

const styles2 = StyleSheet.create({
    container: {
        flexDirection: 'row', // Define a orientação da linha
        justifyContent: 'space-around', // Alinha os componentes no início
        alignItems: 'center', // Alinha os componentes verticalmente
        alignSelf: 'center' 
    },
    image: {
        width: '50%',
        height: '50%'
    }
})

export default LoginScreen;