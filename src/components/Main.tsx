import * as React from 'react';
import {BoardFunctional} from './Board/Board';
import {Modal} from './Panel/Modal';
import {Panel} from './Panel/Panel';
import StatusBar from './StatusBar/StatusBar';
import {databaseLeaderboard, databaseUsers, database} from '../api/Firebase';
import {MainComponentState, GridElement, ObjectToPushToFirebase} from "../types/types";
import {User} from "firebase/auth";
import {useEffect, useState} from "react";
import {get, orderByChild, query, equalTo, ref, push, set, ThenableReference} from "firebase/database";
import {RootState} from "../ReduxStore/store";
import {useSelector, useDispatch} from "react-redux";
import {toggleGameOn} from '../ReduxStore/reducers/IpacmanReducer';
import {Container, Grid, GridItem} from "@chakra-ui/react";

interface MainProps {
    user: User | null
}

export const Main = (props: MainProps) => {

    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [userState, setUserState] = useState<any>("");
    const [gameReset, setGameReset] = useState<boolean>(false);

    const dispatch = useDispatch();

    useEffect(() => {
        if (props.user) addUserInfoToState(props.user.uid);
    }, [props.user]);

    const mistakes = useSelector((state: RootState) => state.ipacmanData.mistakes);
    const score = useSelector((state: RootState) => state.ipacmanData.score);
    const gameOn = useSelector((state: RootState) => state.ipacmanData.gameOn);
    const pace = useSelector((state: RootState) => state.ipacmanData.pace);

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
        let dbUserUrl: any = ref(database, 'Users/' + userState.userDbKey + '/attempts/');
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

    const closeModal = () => {
        setModalOpen(false);
        setGameReset(true);
    }


    return (
        <Container maxW="100%" height="100%">
        <Grid id="main"
                  templateAreas={`"header header"
                  "main panel"`}
                  // gridTemplateRows={'20px 1fr'}
                  // gridTemplateColumns={'1034px 1fr'}
                  // gap='10'
                  color='blackAlpha.700'
        >
        <GridItem area={'header'}>
            <StatusBar user={props.user} userOtherData={userState}/>
        </GridItem>
        <GridItem area={'main'}>
            <BoardFunctional stopGame={stopGame} gameReset={gameReset} pace={pace}/>
        </GridItem>
        <GridItem area={'panel'}>
            <Panel stopGame={stopGame}/>
        </GridItem>
        <Modal open={modalOpen} closeModal={closeModal}/>
    </Grid>
            </Container>
    )

}

