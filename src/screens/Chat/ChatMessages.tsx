import React, { Component } from 'react'
import { View } from 'react-native-animatable';
import { Button } from 'react-native-elements';
import { GiftedChat } from 'react-native-gifted-chat'
import firestore from '@react-native-firebase/firestore'
import auth from '@react-native-firebase/auth'
import { logDebugInfo } from '../../Helpers';

export default class ChatMessages extends Component<any> {
    state: any = {
        user: null,
        thread: null,
        messages: [
            {
                _id: 0,
                text: 'thread created',
                createdAt: new Date().getTime(),
                system: true
            },
            {
                _id: 1,
                text: 'hello!',
                createdAt: new Date().getTime(),
                user: {
                    _id: 2,
                    name: 'Demo'
                }
            }
        ]
    }
    unsubscribeListener: (() => void) | undefined;

    componentDidMount() {
        let thread = this.props.route.params.thread;
        let userC = null;
        if (auth() != null && auth().currentUser != null)
            userC = auth().currentUser;
        if (userC != null)
            this.setState({ thread: thread, user: userC })

        this.unsubscribeListener = firestore()
            .collection('MESSAGE_THREADS')
            .doc(thread._id)
            .collection('MESSAGES')
            .orderBy('createdAt', 'desc')
            .onSnapshot(querySnapshot => {

                const messages = querySnapshot.docs.map(doc => {
                    const firebaseData = doc.data()

                    const data = {
                        _id: doc.id,
                        text: '',
                        createdAt: new Date().getTime(),
                        user : firebaseData.user,
                        ...firebaseData
                    }

                    if (!firebaseData.system) {
                        data.user = {
                            ...firebaseData.user,
                            name: firebaseData.user.displayName
                        }
                    }

                    return data
                })
                this.setState({ messages: messages })
            })

    }


    componentWillUnmount() {
        if (this.unsubscribeListener)
            this.unsubscribeListener();
    }

    handleSend = async (messages: any[] = []) => {
        const text = messages[0].text
        firestore()
            .collection('MESSAGE_THREADS')
            .doc(this.state.thread._id)
            .collection('MESSAGES')
            .add({
                text,
                createdAt: new Date().getTime(),
                user: {
                    _id: this.state.user.uid,
                    displayName: this.state.user.displayName
                }
            })
        await firestore()
            .collection('MESSAGE_THREADS')
            .doc(this.state.thread._id)
            .set(
                {
                    latestMessage: {
                        text,
                        createdAt: new Date().getTime()
                    }
                },
                { merge: true }
            )
    }

    render() {
        if (this.state.user == null)
            return <View />


        return (
            <View style={{ flex: 1 }}>
                <Button
                    onPress={() => {
                        this.props.navigation.goBack()
                    }} title='Back' >
                </Button>
                <GiftedChat
                    messages={this.state.messages}
                    onSend={this.handleSend}
                    user={{
                        _id: this.state.user.uid
                    }}
                />
            </View>
        )
    }
}