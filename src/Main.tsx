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
import {RootState} from "./ReduxStore/store";
import {useSelector, useDispatch} from "react-redux";
import {toggleGameOn} from './ReduxStore/reducers/IpacmanReducer';

interface MainProps {
    user: User | null
}

export const Main = (props: MainProps) => {

    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [pace, setPace] = useState<number>(0);
    const [userState, setUserState] = useState<any>("");
    const [gameReset, setGameReset] = useState<boolean>(false);

    const dispatch = useDispatch();

    useEffect(() => {
        if (props.user) addUserInfoToState(props.user.uid);
    }, [props.user]);

    const mistakes = useSelector((state: RootState) => state.ipacmanData.mistakes);
    const score = useSelector((state: RootState) => state.ipacmanData.score);
    const gameOn = useSelector((state: RootState) => state.ipacmanData.gameOn);

    useEffect(() => {
        if (gameOn) setGameReset(false);
    }, [gameOn])

    const addUserInfoToState = (uid: string | undefined) => {
        const userQuery = query(databaseUsers, orderByChild('uid'), equalTo(uid as string));
        get(userQuery)
            .then((snapshot) => {
                let userData = snapshot.val();
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
        if (gameOn) dispatch(toggleGameOn());
        await sendGameStatsToFirebase();
        await new Promise(r => setTimeout(r, 1000));
        setModalOpen(true);
    }

    const closeModal = () =>  {
        setModalOpen(false);
        setGameReset(true);
    }

    const selectPace = (e) => {
        setPace(Number(e.target.value));
    }


    return (<div id="main">
        <StatusBar user={props.user} userOtherData={userState} />
        <BoardFunctional pace={pace} stopGame={stopGame} gameReset={gameReset}/>
        <Panel selectPace={selectPace} stopGame={stopGame}/>
        <Modal open={modalOpen} closeModal={closeModal} />
    </div>)

}

