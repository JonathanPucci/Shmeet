import React from "react";

import { View, Text, TouchableOpacity } from 'react-native'

import { Card, Icon } from 'react-native-elements'

import { styles } from "./styles";
import { useNavigation } from '@react-navigation/native';

/**
 * The CardNavigation screen
 */
class CardNavigationScreenClass extends React.Component<any> {

    render() {
        return (
            <TouchableOpacity
                onPress={() => { this.props.navigation.navigate("Popup", { screen: this.props.routeSettings.screenName }) }}
            >
                <Card>
                    <Icon
                        name={this.props.routeSettings.screenIcon}
                        size={25}
                        color="brown"
                        type={this.props.routeSettings.screenIconType}
                    />
                    <Text>{"To " + this.props.routeSettings.screenName}</Text>
                </Card>
            </TouchableOpacity >

        );
    };
}

// Wrap and export
export const CardNavigationScreen = function (props: any) {
    const navigation = useNavigation();

    return <CardNavigationScreenClass {...props} navigation={navigation} />;
}