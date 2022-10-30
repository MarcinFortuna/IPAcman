import * as React from 'react';
import { BoardFunctional } from './Board';
import { Modal } from './Modal';
import { Panel } from './Panel';
import { questions } from './data/RP_questions';
import { phonemes, consonants, vowels } from './data/RP_segments';
import StatusBar from './StatusBar';
import { databaseLeaderboard, databaseUsers, database } from './Firebase';
import {MistakeType, MainComponentState, Question, Phoneme, GridElement, ObjectToPushToFirebase} from "./types/types";
import {User} from "firebase";

interface MainProps {
    user: User | {email: string}
}

export class Main extends React.Component<any, any> {

    state: MainComponentState

    constructor(props: MainProps) {
        super(props);
        this.state = {
            gameOn: false,
            currentlySearched: {question: "", classes: [""]},
            phonemesOnTheBoard: [],
            score: 0,
            life: 3,
            mistakes: [],
            modalOpen: false,
            pace: 0,
            user: {}
        }
    }

    componentDidMount() {
        if (this.props.uid) this.addUserInfoToState(this.props.uid);
    }

    async componentDidUpdate(prevProps, prevState) {
        if (prevState.life > 0 && this.state.life === 0) {
            await new Promise(r => setTimeout(r, 50));
            this.stopGame();
        }
        if (this.state.score > prevState.score || this.state.life < prevState.life) {
            await new Promise(r => setTimeout(r, 100));
            // this.generate_random_question();
        }
        if (this.props.user.uid && prevProps.user.uid !== this.props.user.uid) {
            this.addUserInfoToState(this.props.user.uid);
        }
        if (prevProps.user.uid && !this.props.user.uid) {
            this.setState({user: {}});
        }
    }

    addUserInfoToState(uid: string) {
        databaseUsers.orderByChild("uid").equalTo(uid).once('value', async (snapshot) => {
            let userData = snapshot.val();
            let userDbKey = Object.keys(userData)[0];
            let username = userData[userDbKey]["name"];
            let displayName = userData[userDbKey]["displayName"];
            let affiliation = userData[userDbKey]["affiliation"];
            this.setState({
                user: {
                    username: username,
                    displayName: displayName,
                    affiliation: affiliation,
                    userDbKey: userDbKey
                }
            });
        });
    }

    setAPhonemeInMotion(sampa: string, direction: string, pace: number, callback_function: (direction:string, sampa: string) => void) {
        // @ts-ignore
        let phonemeIndex = this.state.phonemesOnTheBoard.findIndex(x => x[1]["sampa"] === sampa);
        // @ts-ignore
        if (this.state.phonemesOnTheBoard[phonemeIndex] && this.state.phonemesOnTheBoard[phonemeIndex][2]) clearInterval(this.state.phonemesOnTheBoard[phonemeIndex][2][1]);
        let newState: (GridElement | null)[] = this.state.phonemesOnTheBoard.slice();
        let movementInterval = setInterval(() => {
            callback_function(direction, sampa);
        }, pace);
        // @ts-ignore
        newState[phonemeIndex][2] = [direction, movementInterval];
        this.setState({ phonemesOnTheBoard: newState })
    }

    increaseScore() {
        this.setState({
            score: this.state.score + 1
        })
    }

    loseLife() {
        this.setState({
            life: this.state.life - 1
        })
    }

    async startGame() {
        console.log("Starting game");
        await this.setState({
            gameOn: true,
        });
        console.log("game started");
    }

    resetGame() {
        this.setState({
            currentlySearched: [],
            phonemesOnTheBoard: [],
            score: 0,
            life: 3,
            mistakes: []
        });
    }

    async sendGameStatsToFirebase() {
        if (!(this.props.user && this.props.user.email)) {
            console.log("not logged in");
            return
        };
        let objectToPush: ObjectToPushToFirebase = {
            score: this.state.score,
            uid: this.props.user.uid,
            pace: this.state.pace,
            mistakes: this.state.mistakes,
            timestamp: Date.now().toString(),
            username: this.state.user.username,
            displayName: this.state.user.displayName,
            affiliation: this.state.user.affiliation
        };
        let dbUserUrl: any = database.ref('Users/' + this.state.user.userDbKey + '/attempts/');
        let newDbEntry = dbUserUrl.push();
        (await newDbEntry).set(objectToPush);
        console.log(objectToPush);
        console.log(newDbEntry);
        let newLeaderboardEntry = databaseLeaderboard.push();
        (await newLeaderboardEntry).set(objectToPush);
        sessionStorage.removeItem("results");
        sessionStorage.removeItem("attempts");
    }

    async stopGame() {
        await this.sendGameStatsToFirebase();
        this.setState({
            gameOn: false
        })
        await new Promise(r => setTimeout(r, 1000));
        this.setState({
            modalOpen: true
        })
    }

    closeModal() {
        this.setState({
            modalOpen: false
        })
        this.resetGame();
    }

    // setAlphabet(e) {
    //     e.persist();
    //     this.setState({
    //         useIpa: !e.target.checked
    //     })
    // }

    selectPace(e) {
        if (!this.state.gameOn) {
            this.setState({
                pace: Number(e.target.value)
            })
        }
    }

    clearAllIntervals() {
        for (let i = 0; i < this.state.phonemesOnTheBoard.length; i++) {
            // @ts-ignore
            clearInterval(this.state.phonemesOnTheBoard[i][2][1]);
        }
    }

    render() {
        return (<div id="main">
            <StatusBar user={this.props.user} userOtherData={this.state.user} />
            <BoardFunctional gameOn={this.state.gameOn} phonemesOnTheBoard={this.state.phonemesOnTheBoard} increaseScore={this.increaseScore.bind(this)} loseLife={this.loseLife.bind(this)} pace={this.state.pace} setAPhonemeInMotion={this.setAPhonemeInMotion.bind(this)} clearAllIntervals={this.clearAllIntervals.bind(this)} />
            <Panel startGame={this.startGame.bind(this)} stopGame={this.stopGame.bind(this)} gameOn={this.state.gameOn} currentlySearched={this.state.currentlySearched} score={this.state.score} life={this.state.life} mistakes={this.state.mistakes} selectPace={this.selectPace.bind(this)} />
            <Modal open={this.state.modalOpen} mistakes={this.state.mistakes} closeModal={this.closeModal.bind(this)} score={this.state.score} />
        </div>)
    }

}

