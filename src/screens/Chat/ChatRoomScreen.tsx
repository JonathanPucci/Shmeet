import React from "react";
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Icon } from "react-native-elements";
import Separator from "../../components/Separator";
import firestore from '@react-native-firebase/firestore'

import { styles } from "./styles";

/**
 * The Chat screen
 */
export class ChatRoomScreen extends React.Component<any> {

    state = {
        loading: true,
        threads: undefined
    }

    unsubscribeFromChat: (() => void) | undefined

    componentDidMount() {
        this.unsubscribeFromChat = firestore()
            .collection('MESSAGE_THREADS')
            .orderBy('latestMessage.createdAt', 'desc')
            .onSnapshot((querySnapshot: any) => {
                const threads = querySnapshot.docs.map((documentSnapshot: any) => {
                    return {
                        _id: documentSnapshot.id,
                        name: '',
                        latestMessage: { text: '' },
                        ...documentSnapshot.data()
                    }
                })

                this.setState({ threads: threads })
                console.log(threads)
                if (this.state.loading) {
                    this.setState({ loading: false })
                }
            })

    }

    componentWillUnmount() {
        if (this.unsubscribeFromChat)
            this.unsubscribeFromChat();
    }
    render() {
        if (this.state.loading) {
            return <ActivityIndicator size='large' color='#555' />
        }
        return (
            <View style={styles.container}>
                <TouchableOpacity
                    style={{ marginLeft: 10 }}
                    onPress={() => { this.props.navigation.navigate("Popup", { screen: 'CreateChatRoom' }) }}
                >
                    <Icon name='add' size={30} color='#444' />
                </TouchableOpacity>
                <View style={stylesChat.container}>
                    {this.state.threads ? (
                        <FlatList
                            data={this.state.threads}
                            keyExtractor={item => item._id}
                            renderItem={({ item }) => (
                                <TouchableOpacity onPress={() => { this.props.navigation.navigate("Popup", { screen: 'ChatMessages', params: { thread: item } }) }}>
                                    <View style={stylesChat.row}>
                                        <View style={stylesChat.content}>
                                            <View style={stylesChat.header}>
                                                <Text style={stylesChat.nameText}>{item.name}</Text>
                                            </View>
                                            <Text style={stylesChat.contentText}>
                                                {item.latestMessage.text.slice(0, 90)}
                                            </Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            )}
                            ItemSeparatorComponent={() => <Separator />}
                        />
                    ) : (
                            <Text style={styles.title}>
                                You haven't joined any chat rooms yet :'(
                            </Text>
                        )
                    }
                </View>
                <View style={styles.textBottom}>
                    <Text style={styles.center}>Brought to you by</Text>
                    <Text style={styles.italic}>La Villa Bourguignon </Text>
                </View>
            </View>
        );
    };
}

const stylesChat = StyleSheet.create({
    container: {
        flex: 1,
        width: "85%",
        backgroundColor: '#dee2eb'
    },
    title: {
        marginTop: 20,
        marginBottom: 30,
        fontSize: 28,
        fontWeight: '500'
    },
    row: {
        paddingRight: 10,
        paddingLeft: 5,
        paddingVertical: 5,
        flexDirection: 'row',
        alignItems: 'center'
    },
    content: {
        flexShrink: 1
    },
    header: {
        flexDirection: 'row'
    },
    nameText: {
        fontWeight: '600',
        fontSize: 18,
        color: '#000'
    },
    dateText: {},
    contentText: {
        color: '#949494',
        fontSize: 16,
        marginTop: 2
    }
})