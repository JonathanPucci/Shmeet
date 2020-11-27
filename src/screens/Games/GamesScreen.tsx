import React from "react";
import { Dimensions, Text, View } from "react-native";

import { styles } from "./styles";
import { Button, Icon } from "react-native-elements";
import BackButton from "./BackButton";
import Flappy from "./Flappy/Flappy";
import RigidBodies from "./RigidBodies/RigidBodies";
import TicTacToe from "./TicTacToe/TicTacToe";
import { connect } from "react-redux";
import { GAME_STOPPED } from "../../redux";
import { ScrollView } from "react-native-gesture-handler";

/**
 * The Games screen
 */
class GamesScreen extends React.Component<any, { playing: string, height: number, width: number, layout: { x: number, y: number } }> {

    constructor(props: any) {
        super(props);
        this.state = {
            playing: "TicTacToe",
            height: Dimensions.get("window").height * 0.7,
            width: Dimensions.get("window").width,
            layout: { x: -1.42, y: -1.42 }
        }
    }

    stopGame = () => {
        this.setState({ playing: "" })
        const action = {
            type: GAME_STOPPED,
            value: null
        };
        this.props.dispatch(action);
    };

    startGame = (game: string) => {
        this.setState({ playing: game })
    };

    componentDidUpdate() {
        if (this.props.game.wantsToStop)
            this.stopGame();
    }

    renderGame = () => {

        const { playing } = this.state;
        let game = null;
        switch (playing) {
            case 'Physics':
                game = <RigidBodies layout={this.state.layout} width={this.state.width} height={this.state.height} />
                break;
            case 'Flappy':
                game = <Flappy layout={this.state.layout} width={this.state.width} height={this.state.height} />
                break;
            case 'TicTacToe':
                game = <TicTacToe />
                break;
        }
        if (this.state.layout.x == this.state.layout.y && this.state.layout.x == -1.42)
            return <View />
        else return (
            <View style={{
                width: this.state.width,
                height: this.state.height
            }} >
                { game}
            </View>
        )



    }

    getLocation = (view: any) => {
        // Print component dimensions to console
        if (view != null)
            setTimeout(() => {
                view.measureInWindow((fx: string, fy: string) => {
                    this.setState({ layout: { x: parseInt(fx), y: parseInt(fy) } })
                })
            }, 500)
    }


    render() {

        return (
            <View style={styles.container}>
                {this.state.playing != '' ?
                    (
                        <View style={{ flex: 1, marginTop: 10 }}>
                            <Text style={styles.text}>{this.state.playing}</Text>
                            <View
                                style={{
                                    position: 'relative',
                                    bottom: 0,
                                }}
                                onLayout={(event: any) => {
                                    this.getLocation(event.target);
                                }}
                            >
                                {this.renderGame()}
                            </View>
                        </View>
                    ) :
                    (
                        <View style={styles.center}>
                            <Button style={styles.spaced} icon={<Icon name='play-circle-outline' color='white' size={25} />} onPress={() => this.startGame('Physics')} title='Start Physics' />
                            <Button style={styles.spaced} icon={<Icon name='play-circle-outline' color='white' size={25} />} onPress={() => this.startGame('Flappy')} title='Start Flappy' />
                            <Button style={styles.spaced} icon={<Icon name='play-circle-outline' color='white' size={25} />} onPress={() => this.startGame('TicTacToe')} title='Start TicTacToe' />
                        </View>

                    )
                }
            </View>
        );
    };
}


const mapStateToProps = (state: any) => {
    return state
}

export default connect(mapStateToProps)(GamesScreen)

