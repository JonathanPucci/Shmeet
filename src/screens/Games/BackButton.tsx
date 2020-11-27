import React, { Component } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import * as Animatable from "react-native-animatable";


export default class BackButton extends Component<any> {


    onPress = () => {

        if (this.props.onPress)
            this.props.onPress();
    };

    render() {
        return (
            <TouchableOpacity
                style={css.button}
                hitSlop={{ top: 10, left: 10, bottom: 10, right: 10 }}
                activeOpacity={1}
                onPress={this.onPress}
            >
                <View >
                    <Animatable.Image
                        ref={"close"}
                        style={{ height: 60, width: 60, marginTop: 30 }}
                        delay={500}
                        resizeMode="contain"
                        animation={"bounceIn"}
                        source={require('../../../assets/back.png')}
                    />
                </View>
            </TouchableOpacity>
        );
    }
}

const css = StyleSheet.create({
    button: {
        top: 0,
        left: 20,
        position: "absolute"
    }
});