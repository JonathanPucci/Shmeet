import React, { Component } from "react";
import { View, StyleSheet, Text, Alert } from "react-native";
import { connect } from "react-redux";
import { logDebugInfo } from "../../../Helpers";
import database from '@react-native-firebase/database';
import { Button } from "react-native-elements";
import Tile from "./Tile";
import { COLUMN_, EMPTY, FIRST_DIAG, ROW_, SECOND_DIAG } from "./Constants";


const INIT_GRID = [
    ['-', '-', '-'],
    ['-', '-', '-'],
    ['-', '-', '-']
];

type ScoreType = {
    [key: string]: number
}

class TicTacToe extends Component<any> {

    state = {
        game: {
            //P1 will be crosses, begins
            p1_token: '',
            //P2 will be circles
            p2_token: '',
            grid: INIT_GRID,
            turn: 0,
            gameResult: { done: false, winner: "" },
            score: ({ 'player1': 0, 'player2': 0 } as (ScoreType))
        },
        gameID: '',
        waitingInLobby: false,
    }
    partyDB: any;

    componentDidMount() {
        // logDebugInfo(JSON.stringify(this.props.auth.user.metadata), 'COUCOU');
    }

    setStateAsync = (state: any) => {
        return new Promise((resolve) => {
            this.setState(state, resolve)
        });
    }

    gotSomethingFromDB = (snapshot: any) => {
        console.log('GOT data: ', snapshot.val());
        if (snapshot.val() != null)
            this.setState({ game: snapshot.val() })
    }

    componentWillUnmount() {
        this.removeListener();
    };

    removeListener = () => {
        if (this.partyDB != undefined)
            this.partyDB.off('value', this.gotSomethingFromDB);
    }

    onPressGoToLobby = async () => {
        if (this.props.auth.user === null) {
            Alert.alert('Error', 'No user here');
        } else {
            const lobbyDB = database().ref("lobbys").child('TicTacToe');
            lobbyDB.child(this.props.auth.user.uid).set({ status: "WAITING" });
            this.setState({ waitingInLobby: true }, () => {
                // console.log(("GOING TO LOBBY"))
                lobbyDB.child(this.props.auth.user.uid).on('value', async (snapshot: any) => {
                    if (snapshot.val() == null) {
                        // console.log(("OUT OFF LOBBY" + JSON.stringify(snapshot.val())))
                        let myRoom = await this.findMyRoom();
                        logDebugInfo(Object.keys(myRoom.val())[0], 'ROOM FOUND for ' + this.props.auth.user.uid)
                        if (myRoom != undefined && myRoom != null) {
                            this.partyDB = database().ref("games").child(Object.keys(myRoom.val())[0])
                            this.initGameFromDB();
                        }
                    }
                });
            })
        }
    }

    initGameFromDB = () => {
        this.partyDB.once('value').then((snapshot: any) => {
            logDebugInfo(snapshot.val(), 'GAMEFROMDB')
            this.setState({ game: snapshot.val(), waitingInLobby: false });
            this.partyDB.on('value', (snapshot: any) => {
                this.gotSomethingFromDB(snapshot)
            });
        }, (err: any) => {
            throw err;
        });
    }

    findMyRoom = async () => {
        const gameDB = database().ref("games");
        return gameDB.once('value', (snapshot: any) => {
            if (snapshot.val() != null) {
                return Object.keys(snapshot.val()).find((partyID) => partyID.includes(this.props.auth.user.uid))
            }
            return undefined
        });
    }

    reinitGame = () => {
        this.updateDBGame(INIT_GRID, true);
    }

    pressedCase = (i: number, j: number) => {
        if ((this.state.game.turn == 0 && this.state.game.p1_token === this.props.auth.user.uid) ||
            (this.state.game.turn == 1 && this.state.game.p2_token === this.props.auth.user.uid)) {
            var updateGrid = this.state.game.grid.slice().map(function (line) {
                return line.slice();
            });
            updateGrid[i][j] = this.state.game.turn == 0 ? "X" : "O";
            this.updateDBGame(updateGrid);
        }
    }

    computeTurn = (state: { game: { grid: any[]; }; }) => {
        var count = 0;
        state.game.grid.map((l) => { l.map((v: string) => { if (v != EMPTY) count++ }) });
        return count % 2;
    }

    updateDBGame = (grid: any, init: boolean = false) => {
        var newState = { ...this.state };
        newState.game = { ...newState.game, grid: grid };

        if (init) {
            newState.game.gameResult = { done: false, winner: "" };
            newState.game.turn = 0;
        }
        else {
            let turn = this.computeTurn(newState);
            newState.game = { ...newState.game, turn: turn };
            let result = this.checkIfWeGotAWinnerAndReturnScore(newState);
            if (result)
                newState = result
        }

        this.setState(newState, () => {
            this.partyDB.set(newState.game).then(() => { }).catch((err: any) => { throw err; });
        })

    }

    checkIfWeGotAWinnerAndReturnScore = (newState: any) => {
        let result = this.checkIfWeGotAWinner(newState);
        logDebugInfo(JSON.stringify(result), "RESULT")

        if (result) {
            let newScore = { ...newState.game.score };
            if (result.player === "X")
                newScore[newState.game.p1_token]++;
            else
                newScore[newState.game.p2_token]++;
            return {
                ...newState,
                game: {
                    ...newState.game,
                    gameResult: { done: true, winner: result.player },
                    score: newScore
                }
            }
        } else
            return false
    }


    checkIfWeGotAWinner = (newState: { game: { grid: string[][]; }; }) => {
        let table = newState.game.grid;
        var result = true;
        for (var j = 1; j < 3; j++) {     //first diagonal
            result = result && (table[j][j] == table[0][0]);
        }
        if (result && table[0][0] != EMPTY) {
            return {
                result: result,
                player: table[0][0],
                winLayout: FIRST_DIAG
            };
        }
        result = true;
        for (var j = 0; j < 2; j++) {  //second diagonal
            result = result && (table[2 - j][j] == table[0][2]);
        }
        if (result && table[0][2] != EMPTY) {
            return {
                result: result,
                player: table[0][2],
                winLayout: SECOND_DIAG
            };
        }
        for (var k = 0; k < 3; k++) {
            result = true;
            for (var j = 1; j < 3; j++) {      //lines 
                result = result && (table[k][j] == table[k][0]);
            }
            if (result && table[k][0] != EMPTY) {
                return {
                    result: result,
                    player: table[k][0],
                    winLayout: ROW_ + k
                };
            }
            result = true;
            for (var j = 1; j < 3; j++) {      //colums
                result = result && (table[j][k] == table[0][k]);
            }
            if (result && table[0][k] != EMPTY) {
                return {
                    result: result,
                    player: table[0][k],
                    winLayout: COLUMN_ + k
                };
            }
        }
        return false;
    }

    _renderRows() {
        const rows = [];

        for (let i = 0; i < 3; ++i) {
            rows.push(
                <View key={i} style={styles.row}>
                    {this._renderRow(i)}
                </View>,
            );
        }

        return rows;
    }

    _renderRow(j: number) {
        const tiles = [];

        for (let i = 0; i < 3; ++i) {
            const index = j * 3 + i;

            tiles.push(
                <Tile key={i} value={this.state.game.grid[i][j]} onPress={() => this.pressedCase(i, j)} />,
            );
        }

        return tiles;
    }

    render() {
        let iAmP1 = this.state.game.p1_token === this.props.auth.user.uid
        return (
            <View >
                <Button title="Go To Lobby" onPress={this.onPressGoToLobby}></Button>

                <View style={{ flexDirection: "column", marginTop: 20, justifyContent: 'center', alignItems: 'center' }}>
                    {this.partyDB != undefined && !this.state.waitingInLobby &&
                        (<View style={{ flexDirection: "column", justifyContent: 'center', alignItems: 'center' }}>
                            {!this.state.game.gameResult.done && (
                                <View>
                                    <Text>YOU ARE : {this.props.auth.user.uid == this.state.game.p1_token ? "X" : "O"}</Text>
                                    <View style={styles.container}>{this._renderRows()}</View>
                                    <Text>CURRENTLY TURN TO : {this.state.game.turn == 0 ? "X" : "O"}</Text>
                                </View>
                            )
                            }
                            <View>
                                {this.state.game.gameResult.done &&
                                    <Text>{this.state.game.gameResult.winner} Wins !</Text>
                                }
                                <Text>SCORES</Text>
                                <Text> YOU : {this.state.game.score[iAmP1 ? this.state.game.p1_token : this.state.game.p2_token]}</Text>
                                <Text> THE OTHER GUY : {this.state.game.score[iAmP1 ? this.state.game.p2_token : this.state.game.p1_token]}</Text>
                                <Button title="Play Again In Same Room" onPress={this.reinitGame}></Button>
                            </View>
                        </View>
                        )
                    }
                </View>
                {this.state.waitingInLobby && (
                    <View><Text>Waiting IN Lobby</Text></View>
                )}
                {/* <Lobby></Lobby> */}
            </View >
        );
    }

}



const mapStateToProps = (state: any) => {
    return state
}

export default connect(mapStateToProps)(TicTacToe)




const styles = StyleSheet.create({
    container: {
        backgroundColor: 'darkgrey',
        borderColor: '#fff',
        borderWidth: 1,
        flexDirection: 'column',
    },
    row: {
        flexDirection: 'row',
    },
});