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
        screenName: "Games",
        screenIcon: "nintendo-game-boy",
        screenIconType : "material-community"
    },
    {
        screenName: "Settings",
        screenIcon: "settings"
    },
    
    {
        screenName: "ChatRoom",
        screenIcon: "chat"
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
                                <CardNavigationScreen routeSettings={route}  ></CardNavigationScreen>
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