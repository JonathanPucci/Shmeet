import React, { Props } from "react";
import { StyleSheet, Text, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import { styles } from "./styles";

/**
 * The Home screen
 */
export class HomeScreen extends React.Component {


    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.text}>Hello there !</Text>

                <View style={styles.textBottom}>
                    <Text style={styles.center}>Brought to you by</Text>
                    <Text style={styles.italic}>La Villa Bourguignon </Text>
                </View>
            </View>
        );
    };
}