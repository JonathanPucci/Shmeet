import React, { Props } from "react";
import { StyleSheet, Text, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import { styles } from "./styles";

/**
 * The Settings screen
 */
export class SettingsScreen extends React.Component {


    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.text}>Hello there from Settings !</Text>

                <View style={styles.textBottom}>
                    <Text style={styles.center}>Brought to you by</Text>
                    <Text style={styles.italic}>La Villa Bourguignon </Text>
                </View>
            </View>
        );
    };
}