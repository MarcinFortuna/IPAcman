import * as React from 'react';
import { BoardFunctional } from './Board';
import { Modal } from './Modal';
import { Panel } from './Panel';
import StatusBar from './StatusBar';
import { databaseLeaderboard, databaseUsers, database } from './Firebase';
import {MainComponentState, GridElement, ObjectToPushToFirebase} from "./types/types";
import {User} from "firebase/auth";
import {useEffect, useState} from "react";
import {get, orderByChild, query, equalTo, ref, push, set, ThenableReference} from "firebase/database";
import {useSelector} from "react-redux";
import {RootState} from "./ReduxStore/store";

interface MainProps {
    user: User | null
}

export const Main = (props: MainProps) => {

    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [pace, setPace] = useState<number>(0);
    const [userState, setUserState] = useState<any>("");

    useEffect(() => {
        if (props.user) addUserInfoToState(props.user.uid);
    }, [props.user]);

    const mistakes = useSelector((state: RootState) => state.ipacmanData.mistakes);
    const score = useSelector((state: RootState) => state.ipacmanData.score);

    // async componentDidUpdate(prevProps, prevState) {
    //     if (prevState.life > 0 && this.state.life === 0) {
    //         await new Promise(r => setTimeout(r, 50));
    //         this.stopGame();
    //     }
    //     if (this.state.score > prevState.score || this.state.life < prevState.life) {
    //         await new Promise(r => setTimeout(r, 100));
    //         // this.generate_random_question();
    //     }
    //     if (this.props.user.uid && prevProps.user.uid !== this.props.user.uid) {
    //         this.addUserInfoToState(this.props.user.uid);
    //     }
    //     if (prevProps.user.uid && !this.props.user.uid) {
    //         this.setState({user: {}});
    //     }
    // }

    const addUserInfoToState = (uid: string | undefined) => {
        const userQuery = query(databaseUsers, orderByChild('uid'), equalTo(uid as string));
        get(userQuery)
            .then((snapshot) => {
                let userData = snapshot.val();
                console.log(userData);
                let userDbKey = Object.keys(userData)[0];
                let username = userData[userDbKey]["name"];
                let displayName = userData[userDbKey]["displayName"];
                let affiliation = userData[userDbKey]["affiliation"];
                setUserState({
                    username: username,
                    displayName: displayName,
                    affiliation: affiliation,
                    userDbKey: userDbKey
                });
        });
    }

    const sendGameStatsToFirebase = async () => {
        if (!(props.user && props.user.email)) {
            console.log("not logged in");
            return
        };
        let objectToPush: ObjectToPushToFirebase = {
            score: score,
            uid: props.user.uid,
            pace: pace,
            mistakes: mistakes,
            timestamp: Date.now().toString(),
            username: userState.username,
            displayName: userState.displayName,
            affiliation: userState.affiliation
        };
        let dbUserUrl: any = ref(database,'Users/' + userState.userDbKey + '/attempts/');
        let newDbEntry: ThenableReference = push(dbUserUrl);
        console.log(objectToPush);
        await set(newDbEntry, objectToPush);
        let newLeaderboardEntry: ThenableReference = push(databaseLeaderboard);
        await set(newLeaderboardEntry, objectToPush);
        sessionStorage.removeItem("results");
        sessionStorage.removeItem("attempts");
    }

    const stopGame = async () => {
        await sendGameStatsToFirebase();
        await new Promise(r => setTimeout(r, 1000));
        setModalOpen(true);
    }

    const closeModal = () =>  {
        setModalOpen(false);
        // this.resetGame();
    }

    // setAlphabet(e) {
    //     e.persist();
    //     this.setState({
    //         useIpa: !e.target.checked
    //     })
    // }

    const selectPace = (e) => {
        // if (!this.state.gameOn) {
            setPace(Number(e.target.value));
        // }
    }

    const clearAllIntervals = () => {
        // for (let i = 0; i < this.state.phonemesOnTheBoard.length; i++) {
        //     // @ts-ignore
        //     clearInterval(this.state.phonemesOnTheBoard[i][2][1]);
        // }
    }


    return (<div id="main">
        <StatusBar user={props.user} userOtherData={userState} />
        <BoardFunctional pace={pace} clearAllIntervals={clearAllIntervals} stopGame={stopGame}/>
        <Panel selectPace={selectPace} />
        <Modal open={modalOpen} closeModal={closeModal} />
    </div>)

}

