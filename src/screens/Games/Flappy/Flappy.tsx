import { Dimensions, Modal, Text, TouchableOpacity } from 'react-native';

import React, { Component } from 'react';
import { StyleSheet, View, } from 'react-native';
import Matter from "matter-js";
import { GameEngine } from "react-native-game-engine";
import Bird from './Bird';
import Physics from './Physics';
import Wall from './Wall';
import { PoopRenderer } from '../SharedRenderers/PoopRenderer';



export default class Flappy extends Component<any> {

    entities: { physics: { engine: Matter.Engine; world: Matter.World; }; bird: { body: Matter.Body; size: number[]; color: string; renderer: any; }; };
    gameEngine: GameEngine | null | any;

    state = {
        running: true
    };

    constructor(props: any) {
        super(props);

        this.gameEngine = null;
        this.entities = this.setupWorld();
    }

    setupWorld = () => {
        var width = this.props.width;
        var height = this.props.height;
        let PIPE_WIDTH = width * 0.1;
        let birdSize = height * 0.07;

        let world = Matter.World.create({ bounds: { max: { x: width, y: height }, min: { x: 0, y: 0 } } })
        let engine = Matter.Engine.create({ enableSleeping: false, world: world });

        let bird = Matter.Bodies.rectangle(width / 4, height / 2, birdSize, birdSize);
        let floor = Matter.Bodies.rectangle(width / 2, height - 25, width, birdSize, { isStatic: true });
        let ceiling = Matter.Bodies.rectangle(width / 2, 25, width, birdSize, { isStatic: true });

        let [pipe1Height, pipe2Height] = this.generatePipes();

        let pipe1 = Matter.Bodies.rectangle(width - (PIPE_WIDTH / 2), pipe1Height / 2+3, PIPE_WIDTH, pipe1Height, { isStatic: true });
        let pipe2 = Matter.Bodies.rectangle(width - (PIPE_WIDTH / 2), height - (pipe2Height / 2)-3, PIPE_WIDTH, pipe2Height, { isStatic: true });

        let [pipe3Height, pipe4Height] = this.generatePipes();

        let pipe3 = Matter.Bodies.rectangle(width * 2 - (PIPE_WIDTH / 2), pipe3Height / 2+3, PIPE_WIDTH, pipe3Height, { isStatic: true });
        let pipe4 = Matter.Bodies.rectangle(width * 2 - (PIPE_WIDTH / 2), height - (pipe4Height / 2)-3, PIPE_WIDTH, pipe4Height, { isStatic: true });

        Matter.Events.on(engine, 'collisionStart', (event) => {
            var pairs = event.pairs;
            if (this.gameEngine != null)
                this.gameEngine.dispatch({ type: "game-over" });
        });

        Matter.World.add(world, [bird, floor, ceiling, pipe1, pipe2, pipe3, pipe4]);

        return {
            physics: { engine: engine, world: world, width: width, height: height, PIPE_WIDTH: PIPE_WIDTH },
            bird: { body: bird, size: [birdSize, birdSize], color: 'red', renderer: PoopRenderer },
            floor: { body: floor, size: [width, birdSize], color: "green", renderer: Wall },
            ceiling: { body: ceiling, size: [width, birdSize], color: "green", renderer: Wall },
            pipe1: { body: pipe1, size: [PIPE_WIDTH, pipe1Height], color: "green", renderer: Wall },
            pipe2: { body: pipe2, size: [PIPE_WIDTH, pipe2Height], color: "green", renderer: Wall },
            pipe3: { body: pipe3, size: [PIPE_WIDTH, pipe3Height], color: "green", renderer: Wall },
            pipe4: { body: pipe4, size: [PIPE_WIDTH, pipe4Height], color: "green", renderer: Wall }
        }
    }

    randomBetween = (min: number, max: number) => {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    generatePipes = () => {
        let GAP_SIZE = this.props.height * 0.25;
        let topPipeHeight = this.randomBetween(100, (this.props.height / 2) - 100);
        let bottomPipeHeight = this.props.height - topPipeHeight - GAP_SIZE;

        let sizes = [topPipeHeight, bottomPipeHeight]

        if (Math.random() < 0.5) {
            sizes = sizes.reverse();
        }
        return sizes;
    }

    onEvent = (e: any) => {
        if (e.type === "game-over") {
            //Alert.alert("Game Over");
            this.setState({
                running: false
            });
        }
    }

    reset = () => {
        if (this.gameEngine != null)
            this.gameEngine.swap(this.setupWorld());
        this.setState({
            running: true
        });
    }

    render = () => {
        return (
            <View style={styles.container}>
                <GameEngine
                    ref={(ref) => { this.gameEngine = ref; }}
                    style={styles.gameContainer}
                    running={this.state.running}
                    entities={this.entities}
                    onEvent={this.onEvent}
                    systems={[Physics]}
                >
                </GameEngine>
                {!this.state.running && <TouchableOpacity style={styles.fullScreenButton} onPress={this.reset}>
                    <View style={styles.fullScreen}>
                        <Text style={styles.gameOverText}>Game Over</Text>
                    </View>
                </TouchableOpacity>}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    gameContainer: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
    },
    gameOverText: {
        color: 'white',
        fontSize: 48
    },
    fullScreen: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'black',
        opacity: 0.8,
        justifyContent: 'center',
        alignItems: 'center'
    },
    fullScreenButton: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        flex: 1
    }
});