import React, { Component } from "react";
import { SvgCss } from 'react-native-svg';
import {poopsvg} from '../../../../assets/poopSmile'


const Poop = (props: any) => <SvgCss xml={poopsvg} width={props.style.width} height={props.style.width} style={props.style} />;

export class PoopRenderer extends Component<any> {


    render() {
      const width = this.props.size[0];
      const height = this.props.size[1];
      const x = this.props.body.position.x - width / 2;
      const y = this.props.body.position.y - height / 2;
      const angle = this.props.body.angle;
      return (
        <Poop style={{
          position: "absolute",
          left: x,
          top: y,
          width: width,
          height: height,
          transform: [{ rotate: angle + "rad" }],
        }} />
      );
    }
  }