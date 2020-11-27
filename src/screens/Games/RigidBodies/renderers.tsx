import React, { Component, PureComponent } from "react";
import { StyleSheet, View, ART, Dimensions } from "react-native";
import * as Animatable from "react-native-animatable";

export class Box extends Component<any> {


  render() {
    const width = this.props.size[0];
    const height = this.props.size[1];
    const x = this.props.body.position.x - width / 2;
    const y = this.props.body.position.y - height / 2;
    const angle = this.props.body.angle;

    return (
      <View
        style={
          {
            position: "absolute",
            left: x,
            top: y,
            width: width,
            height: height,
            transform: [{ rotate: angle + "rad" }],
            backgroundColor: this.props.color || "pink",
          }
        }
      >
        {/* <Animatable.Image
          ref={"close"}
          style={{ height: height, width: width }}
          resizeMode="contain"
          animation={"bounceIn"}
          source={require('../../../../assets/ShmeetGlass.png')}
        /> */}
      </View>
    );
  }
}



