import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    lightTheme: {
        flex: 1,
        backgroundColor: 'white',
    },
    darkTheme: {
        flex: 1,
        
        backgroundColor: 'black',
    },
    scrollView: {
        backgroundColor: '#111111',
        paddingHorizontal: 15,
        paddingTop: 0,
    },
    container: {
        alignItems: 'center',
    },
    logo: {
        marginTop: 40,
        width: '75%',
        height: 100,
        resizeMode: 'stretch',
    },
    h1: {
        color: '#94BC1C',
        fontSize: 30,
        fontWeight: 'bold',
        marginVertical: 10,
        paddingTop: 40
    },
    h2: {
        color: '#C0C6AD',
        fontSize: 15
    },
    inputArea: {
        width: '100%',
        paddingTop: 20,
    },
    inputLabel: {
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 7
    },
    inputField: {
        borderWidth: 2,
        borderRadius: 5,
        borderColor: '#94BC1C',
        fontSize: 15,
        padding: 10,
        color: '#e3e6e8'
    },
    aditionals: {
        width: '100%'
    },
    forgotBtnArea: {
        paddingVertical: 10,
        alignSelf: 'flex-end'
    },
    forgotBtnText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#AFA2A5'
    },
    button: {
        marginTop: 24,
        backgroundColor: '#94BC1C',
        padding: 10,
        borderRadius: 5,
        width: '100%',
    },
    buttonText: {
        fontWeight: 'bold',
        alignSelf: 'center',
        fontSize: 18,
        color: 'white'
    },
    signUpArea: {
        flexDirection: 'row',
        marginTop: 20
    },
    signUpText: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#999'
    },
    singUpBtnText: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#779420',
        marginLeft: 6

    },
    footerArea: {
        marginVertical: 16
    },
    footerText: {
        fontSize: 13,
        color: '#999'
    },
});
