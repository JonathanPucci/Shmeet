import React, { useState } from 'react'
import {
    View,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
} from 'react-native'
import firestore from '@react-native-firebase/firestore'
import { logDebugInfo } from '../../Helpers'
import { connect } from 'react-redux'

export class CreateChatRoom extends React.Component<any> {

    state = {
        roomName: '',
    }

    handleButtonPress = async () => {
        if (this.state.roomName.length > 0) {
            // create new thread using firebase & firestore
            firestore()
                .collection('MESSAGE_THREADS')
                .add({
                    name: this.state.roomName,
                    latestMessage: {
                        text: `${this.state.roomName} created. Welcome!`,
                        createdAt: new Date().getTime()
                    }
                })
                .then(docRef => {
                    docRef.collection('MESSAGES').add({
                        text: `${this.state.roomName} created. Welcome!`,
                        createdAt: new Date().getTime(),
                        system: true
                    })
                    this.props.navigation.navigate("Popup", { screen: 'ChatRoom' })
                })
                .catch((e) => {
                    console.log(e);
                })
        }
    }

    render() {

        return (
            <View style={styles.container}>
                <TextInput
                    style={styles.textInput}
                    placeholder='Thread Name'
                    onChangeText={roomName => this.setState({ roomName: roomName })}
                />
                <TouchableOpacity style={styles.button} onPress={this.handleButtonPress}>
                    <Text style={styles.buttonText}>Create chat room</Text>
                </TouchableOpacity>
            </View>
        )
    }
}


const mapDispatchToProps = (dispatch: any) => {
    return {
        dispatch: (action: any) => {
            dispatch(action);
        }
    };
};

function mapStateToProps(state: any) {
    return state;
}

export default (connect(mapStateToProps, mapDispatchToProps)(CreateChatRoom));


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
        backgroundColor: '#2196F3',
        textAlign: 'center',
        alignSelf: 'center',
        paddingHorizontal: 40,
        paddingVertical: 10,
        borderRadius: 5,
        marginTop: 10
    },
    buttonText: {
        color: '#fff',
        fontSize: 18
    },
    textInput: {
        backgroundColor: '#fff',
        marginHorizontal: 20,
        fontSize: 18,
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderColor: '#aaa',
        borderRadius: 10,
        borderWidth: 1,
        marginBottom: 5,
        width: 225
    }
})