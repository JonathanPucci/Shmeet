import React from "react";

import { View, Text } from 'react-native'

import { styles } from "./styles";
import { useNavigation } from '@react-navigation/native';
import { CardNavigationScreen } from "../../components/CardNavigation/CardNavigation";


/**
 * ROUTES
 */
const ROUTES = [
    {
        screenName: "Home",
        screenIcon: "home"
    },
    {
        screenName: "Settings",
        screenIcon: "settings"
    }
]

/**
 * The Navigation screen
 */
class NavigationScreenClass extends React.Component<any> {


    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.text}>Hello there from Navigation !</Text>
                {
                    ROUTES.map((route, i, a) => {
                        return (
                            <View key={'nav'+i}>
                                <CardNavigationScreen screenName={route.screenName} screenIcon={route.screenIcon} ></CardNavigationScreen>
                            </View>
                        )
                    })
                }

                <View style={styles.textBottom}>
                    <Text style={styles.center}>Brought to you by</Text>
                    <Text style={styles.italic}>La Villa Bourguignon </Text>
                </View>
            </View >
        );
    };
}

// Wrap and export
export const NavigationScreen = function (props: any) {
    const navigation = useNavigation();

    return <NavigationScreenClass {...props} navigation={navigation} />;
}