// Login.js
import React, { Component } from 'react'
import { View, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native'
import { Icon } from 'react-native-elements'
import auth from '@react-native-firebase/auth'
import { USER_LOGGED } from '../redux/actions'

export default class LobbyScreen extends Component<any> {

    // firebase login function later
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Welcome to 🔥 Shmeet App</Text>
                <TouchableOpacity
                    style={styles.button}
                    onPress={this.login}>
                    <Text style={styles.buttonText}>Enter Anonymously</Text>
                    <Icon name='lock' size={30} color='#cfdce0' />
                </TouchableOpacity>
            </View>
        )
    }

    login = async () => {
        try {
            let result = await auth().signInAnonymously();
            
        } catch (e) {
            switch (e.code) {
                case 'auth/operation-not-allowed':
                    console.log('Enable anonymous in your firebase console.')
                    break
                default:
                    console.error(e)
                    break
            }
        }
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#dee2eb'
    },
    title: {
        marginTop: 20,
        marginBottom: 30,
        fontSize: 28,
        fontWeight: '500'
    },
    button: {
        flexDirection: 'row',
        borderRadius: 30,
        marginTop: 10,
        marginBottom: 10,
        width: 300,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#cf6152'
    },
    buttonText: {
        color: '#dee2eb',
        fontSize: 24,
        marginRight: 5
    }
})