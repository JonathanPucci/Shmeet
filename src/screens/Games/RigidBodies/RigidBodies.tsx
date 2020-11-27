import React, { Component } from "react";
import { GameEngine } from "react-native-game-engine";
import { Physics, CreateBox, MoveBox, CleanBoxes } from "./systems";
import { Box } from "./renderers";
import Matter from "matter-js";
import { getBodyWidth, getBodyHeight } from "../Helpers";

Matter.Common.isElement = () => false; //-- Overriding this function because the original references HTMLElement

export default class RigidBodies extends Component<any> {

    render() {
        var width = this.props.width;
        var height = this.props.height;
        const boxSize = Math.trunc(Math.max(width, height) * 0.075);

        let world = Matter.World.create({ bounds: { max: { x: width, y: height }, min: { x: 0, y: 0 } } })
        const engine = Matter.Engine.create({ enableSleeping: false, world: world });
        const body = Matter.Bodies.rectangle(width / 2, -100, boxSize, boxSize, { frictionAir: 0.021 });
        const floor = Matter.Bodies.rectangle(width / 2, height, width, boxSize, { isStatic: true });
        const leftWall = Matter.Bodies.rectangle(0, height / 2 + boxSize / 2, boxSize, height, { isStatic: true });
        const rightWall = Matter.Bodies.rectangle(width, height / 2 + boxSize / 2, boxSize, height, { isStatic: true });
        const constraint = Matter.Constraint.create({
            label: "Drag Constraint",
            pointA: { x: 0, y: 0 },
            pointB: { x: 0, y: 0 },
            length: 0.01,
            stiffness: 0.1,
            // angularStiffness: 1
        });
        Matter.World.add(world, [floor, leftWall, rightWall, body]);
        Matter.World.addConstraint(world, constraint);

        return (
            <GameEngine
                systems={[Physics, CreateBox, MoveBox, CleanBoxes]}
                entities={{
                    parentOffset: { x: this.props.layout.x, y: this.props.layout.y },
                    physics: { engine: engine, world: world, constraint: constraint },
                    box: { body: body, size: [getBodyWidth(body), getBodyHeight(body)], color: "pink", renderer: Box },
                    floor: { body: floor, size: [getBodyWidth(floor), getBodyHeight(floor)], color: "#86E9BE", renderer: Box },
                    leftWall: { body: leftWall, size: [getBodyWidth(leftWall), getBodyHeight(leftWall)], color: "#86E9BE", renderer: Box },
                    rightWall: { body: rightWall, size: [getBodyWidth(rightWall), getBodyHeight(rightWall)], color: "#86E9BE", renderer: Box }
                }}
            >
            </GameEngine>
        );
    }
}