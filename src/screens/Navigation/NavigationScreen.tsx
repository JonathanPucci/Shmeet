import React from "react";

import { View, Text } from 'react-native'

import { Card, Button } from 'react-native-elements'

import { styles } from "./styles";
import { useNavigation } from '@react-navigation/native';

/**
 * The Navigation screen
 */
class NavigationScreenClass extends React.Component<any> {

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.text}>Hello there from Navigation !</Text>
                <Card>
                    <Button
                        icon={{
                            name: "home",
                            size: 15,
                            color: "white"
                        }}
                        raised
                        title="To Home"
                        onPress={() => { this.props.navigation.navigate("Popup", { screen: "Home" }) }}
                    />
                </Card>
                <Card>
                    <Button
                        icon={{
                            name: "settings",
                            size: 15,
                            color: "white"
                        }}
                        raised
                        title="To Settings"
                        onPress={() => { this.props.navigation.navigate("Popup", { screen: "Settings" }); console.log("ok") }}
                    />
                </Card>
                <View style={styles.textBottom}>
                    <Text style={styles.center}>Brought to you by</Text>
                    <Text style={styles.italic}>La Villa Bourguignon </Text>
                </View>
            </View>
        );
    };
}

// Wrap and export
export const NavigationScreen = function (props: any) {
    const navigation = useNavigation();

    return <NavigationScreenClass {...props} navigation={navigation} />;
}