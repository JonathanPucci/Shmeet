import React, { createContext, useEffect, useState } from 'react';
import {
    NavigationContainer,
    DefaultTheme,
    getFocusedRouteNameFromRoute,
} from '@react-navigation/native';
import { createStackNavigator, HeaderStyleInterpolators, CardStyleInterpolators } from '@react-navigation/stack';

import { HomeScreen } from '../screens/Home/HomeScreen';
import { SettingsScreen } from '../screens/Settings/SettingsScreen';
import { NavigationScreen } from './Navigation/NavigationScreen';
import { Icon } from 'react-native-elements'
import { cardStyleInterpolatorHelper, headerStyleInterpolatorHelper } from './Helpers';
import GamesScreen from '../screens/Games/GamesScreen';
import { ChatRoomScreen } from '../screens/Chat/ChatRoomScreen';
import { TouchableOpacity } from 'react-native-gesture-handler';
import auth from '@react-native-firebase/auth'
import LobbyScreen from './LobbyScreen';
import CreateChatRoom from '../screens/Chat/CreateChatRoom';
import ChatMessages from '../screens/Chat/ChatMessages';
import { USER_LOGGED, STOP_CURRENT_GAME } from '../redux';
import { connect } from 'react-redux';

export const AuthContext = createContext(null)


async function logOut() {
    try {
        await auth().signOut()
    } catch (e) {
        console.error(e)
    }
}

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
const LoggedOutStack = createStackNavigator()


export const PopupStackScreen = () => {
    return (
        <PopupNavigationStack.Navigator
            screenOptions={{
                headerStyleInterpolator: HeaderStyleInterpolators.forFade,
                cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
                headerShown: false
            }}
        >
            <PopupNavigationStack.Screen name="Home" component={HomeScreen} />
            <PopupNavigationStack.Screen name="Games" component={GamesScreen} />
            <PopupNavigationStack.Screen name='ChatRoom' component={ChatRoomScreen} />
            <PopupNavigationStack.Screen name='CreateChatRoom' component={CreateChatRoom} />
            <PopupNavigationStack.Screen name='ChatMessages' component={ChatMessages} />
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

class RootStackScreen extends React.Component<any> {
    // BECAUSE WE DON'T WANT TO DISPLAY THE NAVIGATION STACK TITLE
    // WE MUST GET THE ROUTE NAME FROM THE HELPER FUNCTION PROVIDED
    // BY REACT NAVIGATION
    getHeaderTitle = (route: any) => {
        const routeName = getFocusedRouteNameFromRoute(route) || 'Explore';
        return routeName;
    };

    getHeaderLeftHelper = (route: any, navigation: { navigate: (arg0: string, arg1: { screen: string; }) => any; goBack: () => any; }) => {
        // WHEN NAVIGATING BETWEEN NESTED NAVIGATION STACKS
        // WE MUST INDICATE BOTH WHICH STACK WE NAVIGATE TO 
        // AND WHICH SCREEN TO NAVIGATE TO INSIDE THE NAVIGATE
        // METHOD'S OPTIONS OBJECT
        if (route.name === 'Popup') {
            return (
                <Icon
                    name="home"
                    size={22}
                    style={{ marginLeft: 30 }}
                    onPress={() =>
                        navigation.navigate('Main', {
                            screen: 'Navigation',
                        })
                    }
                />
            );
        }
    };

    getHeaderRightHelper = (route: any, navigation: { navigate: (arg0: string, arg1: { screen: string; }) => any; goBack: () => any; }) => {
        // WHEN NAVIGATING BETWEEN NESTED NAVIGATION STACKS
        // WE MUST INDICATE BOTH WHICH STACK WE NAVIGATE TO 
        // AND WHICH SCREEN TO NAVIGATE TO INSIDE THE NAVIGATE
        // METHOD'S OPTIONS OBJECT
        if (route.name === 'Popup' && route.params.screen === 'Games') {
            return (
                <Icon
                    name="grid-view"
                    size={22}
                    style={{ marginRight: 30 }}
                    onPress={() => {
                        const action = {
                            type: STOP_CURRENT_GAME,
                            value: null
                        };
                        this.props.dispatch(action);
                    }
                    }
                />
            );
        }
    };

    authSubscriber: any;
    state = {
        user: null
    }


    componentDidMount() {
        this.authSubscriber = auth().onAuthStateChanged((result: any) => {
            this.setState({ user: result }, () => {
                const action = {
                    type: USER_LOGGED,
                    value: result
                };
                this.props.dispatch(action);

            })
        })
    }

    componentWillUnmount() {
        this.authSubscriber();
    }

    render() {
        return this.state.user ? (
            <RootNavigationStack.Navigator>
                <RootNavigationStack.Screen
                    name="Main"
                    component={MainStackScreen}
                    options={({ route, navigation }) => ({
                        headerStyle: styles.header,
                        headerLeft: () => this.getHeaderLeftHelper(route, navigation),
                        headerRight: () => this.getHeaderRightHelper(route, navigation),
                        headerTitle: this.getHeaderTitle(route),
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
                        headerLeft: () => this.getHeaderLeftHelper(route, navigation),
                        headerRight: () => this.getHeaderRightHelper(route, navigation),
                        headerTitle: this.getHeaderTitle(route),
                        headerStyleInterpolator: headerStyleInterpolatorHelper,
                        cardStyleInterpolator: cardStyleInterpolatorHelper,

                    })}
                />
            </RootNavigationStack.Navigator>
        ) : (
                <LoggedOutStack.Navigator >
                    <LoggedOutStack.Screen name='Login' component={LobbyScreen} />
                </LoggedOutStack.Navigator>
            )
    }
};



const mapStateToProps = (state: any) => {
    return state
}

export const RootStackScreenR = connect(mapStateToProps)(RootStackScreen)



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
                <RootStackScreenR />
            </NavigationContainer>
        );
    }
};

export default AppNavigator;