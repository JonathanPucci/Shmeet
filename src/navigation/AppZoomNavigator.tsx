import React from 'react';
import {
    NavigationContainer,
    DefaultTheme,
    getFocusedRouteNameFromRoute,
} from '@react-navigation/native';
import { createStackNavigator, HeaderStyleInterpolators, CardStyleInterpolators } from '@react-navigation/stack';

import { HomeScreen } from '../screens/Home/HomeScreen';
import { SettingsScreen } from '../screens/Settings/SettingsScreen';
import { NavigationScreen } from '../screens/Navigation/NavigationScreen';
import { Icon } from 'react-native-elements'
import { cardStyleInterpolatorHelper, headerStyleInterpolatorHelper } from './Helpers';

// THIS REMOVES THE HEADER BOTTOM BORDER FOR IOS AND ANDROID
const styles = {
    header: {
        borderBottomWidth: 0,
        shadowColor: 'transparent',
        elevation: 0,
    },
};

const MainNavigationStack = createStackNavigator();
const PopupNavigationStack = createStackNavigator();
const RootNavigationStack = createStackNavigator();

const PopupStackScreen = () => {
    return (
        <PopupNavigationStack.Navigator
            screenOptions={{
                headerStyleInterpolator: HeaderStyleInterpolators.forFade,
                cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
                headerShown: false
            }}
        >
            <PopupNavigationStack.Screen name="Home" component={HomeScreen} />
            <PopupNavigationStack.Screen name="Settings" component={SettingsScreen} />
        </PopupNavigationStack.Navigator>
    );
};

const MainStackScreen = () => {
    return (
        <MainNavigationStack.Navigator screenOptions={{
            headerShown: false
        }}>
            <MainNavigationStack.Screen name="Navigation" component={NavigationScreen} />
        </MainNavigationStack.Navigator>
    );
};

const RootStackScreen = () => {
    // BECAUSE WE DON'T WANT TO DISPLAY THE NAVIGATION STACK TITLE
    // WE MUST GET THE ROUTE NAME FROM THE HELPER FUNCTION PROVIDED
    // BY REACT NAVIGATION
    const getHeaderTitle = (route: any) => {
        const routeName = getFocusedRouteNameFromRoute(route) || 'Explore';
        return routeName;
    };

    const getHeaderLeftHelper = (route: any, navigation: { navigate: (arg0: string, arg1: { screen: string; }) => any; goBack: () => any; }) => {
        // WHEN NAVIGATING BETWEEN NESTED NAVIGATION STACKS
        // WE MUST INDICATE BOTH WHICH STACK WE NAVIGATE TO 
        // AND WHICH SCREEN TO NAVIGATE TO INSIDE THE NAVIGATE
        // METHOD'S OPTIONS OBJECT
        if (route.name === 'Popup') {
            return (
                <Icon
                    name="home"
                    size={22}
                    style={{marginLeft : 30}}
                    onPress={() =>
                        navigation.navigate('Main', {
                            screen: 'Navigation',
                        })
                    }
                />
            );
        }
    };

    return (
        <RootNavigationStack.Navigator>
            <RootNavigationStack.Screen
                name="Main"
                component={MainStackScreen}
                options={({ route, navigation }) => ({
                    headerStyle: styles.header,
                    headerLeft: () => getHeaderLeftHelper(route, navigation),
                    headerTitle: getHeaderTitle(route),
                    transitionSpec: {
                        open: {
                            animation: 'timing',
                            config: {
                                duration: 1000,
                            },
                        },
                        close: {
                            animation: 'timing',
                            config: {
                                duration: 1000,
                            },
                        },
                    },
                })}
            />
            <RootNavigationStack.Screen
                name="Popup"
                component={PopupStackScreen}
                options={({ route, navigation }) => ({
                    headerStyle: styles.header,
                    headerLeft: () => getHeaderLeftHelper(route, navigation),
                    headerTitle: getHeaderTitle(route),
                    headerStyleInterpolator: headerStyleInterpolatorHelper,
                    cardStyleInterpolator: cardStyleInterpolatorHelper,

                })}
            />
        </RootNavigationStack.Navigator>
    );
};

const theme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        background: 'white',
    },
};
export class AppNavigator extends React.Component {

    render() {
        return (
            <NavigationContainer theme={theme}>
                <RootStackScreen />
            </NavigationContainer>
        );
    }
};

export default AppNavigator;