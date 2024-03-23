import * as React from 'react';
import {Board} from './Board/Board';
import {Panel} from './Panel/Panel';
import StatusBar from './StatusBar/StatusBar';
import {databaseLeaderboard, databaseUsers, database} from '../api/Firebase';
import {ObjectToPushToFirebase, UserData} from "../types/types";
import {User} from "firebase/auth";
import {useEffect, useState} from "react";
import {get, orderByChild, query, equalTo, ref, push, set, ThenableReference, DatabaseReference} from "firebase/database";
import {RootState} from "../ReduxStore/store";
import {useSelector, useDispatch} from "react-redux";
import {toggleGameOn} from '../ReduxStore/reducers/IpacmanReducer';
import {Container, Box, useDisclosure} from "@chakra-ui/react";
import GameOverModal from "./GameOverModal";
import useStateRef from "react-usestateref";
import {
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
    Link
  } from '@chakra-ui/react';

interface MainProps {
    user: User | null
}

export const Main = (props: MainProps) => {

    const {isOpen, onOpen, onClose} = useDisclosure();
    const [userState, setUserState] = useState<UserData>({username: "", displayName: ""});
    const [gameReset, setGameReset] = useState<boolean>(false);

    const dispatch = useDispatch();

    useEffect(() => {
        if (props.user) addUserInfoToState(props.user.uid);
    }, [props.user]);

    const mistakes = useSelector((state: RootState) => state.ipacmanData.mistakes);
    const score = useSelector((state: RootState) => state.ipacmanData.score);
    const gameOn = useSelector((state: RootState) => state.ipacmanData.gameOn);
    const pace = useSelector((state: RootState) => state.ipacmanData.pace);
    const symbolScope = useSelector((state: RootState) => state.ipacmanData.symbolScope);

    const [currentMode, setCurrentMode, currentModeRef] = useStateRef<string>("");

    useEffect(() => {
        setCurrentMode(symbolScope.selected);
    }, [symbolScope]);


    useEffect(() => {
        if (gameOn) setGameReset(false);
    }, [gameOn])

    const addUserInfoToState = (uid: string | undefined) => {
        const userQuery = query(databaseUsers, orderByChild('uid'), equalTo(uid as string));
        get(userQuery)
            .then((snapshot) => {
                const userData = snapshot.val();
                const userDbKey = Object.keys(userData)[0];
                const username = userData[userDbKey]["name"];
                const displayName = userData[userDbKey]["displayName"];
                const affiliation = userData[userDbKey]["affiliation"];
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
        }
        const objectToPush: ObjectToPushToFirebase = {
            score: score,
            uid: props.user.uid,
            pace: pace,
            mistakes: mistakes,
            timestamp: Date.now().toString(),
            username: userState.username,
            displayName: userState.displayName,
            affiliation: userState.affiliation || "",
            mode: currentModeRef.current ? currentModeRef.current : ""
        };
        const dbUserUrl: DatabaseReference = ref(database, 'Users/' + userState.userDbKey + '/attempts/');
        const newDbEntry: ThenableReference = push(dbUserUrl);
        // console.log(objectToPush);
        await set(newDbEntry, objectToPush);
        const newLeaderboardEntry: ThenableReference = push(databaseLeaderboard);
        await set(newLeaderboardEntry, objectToPush);
        sessionStorage.removeItem("results");
        sessionStorage.removeItem("attempts");
    }

    const stopGame = async () => {
        if (gameOn) dispatch(toggleGameOn());
        await sendGameStatsToFirebase();
        await new Promise(r => setTimeout(r, 1000));
        onOpen();
    }

    const closeModal = () => {
        onClose();
        setGameReset(true);
    }

    function sleep(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }      

    const [index, setIndex] = useState<number[]>([1]);

    function toggleAccordion() {
        if (index[0] === 1) {
            setIndex([0]);
        } else {
            setIndex([1]);
        }
    }

    useEffect(() => {
        const firstLoad = sessionStorage.getItem("loaded");
        if (!firstLoad) {
            sleep(1000).then(() => {
                setIndex([0]);
                sessionStorage.setItem("loaded", "true");    
            })
        }
    }, []);

    return (
        <Container width="fit-content" maxWidth="fit-content" height="100%" sx={{margin: "5px auto"}}>
        <Accordion allowMultiple index={index}>
            <AccordionItem>
                <h2>
                    <AccordionButton onClick={toggleAccordion}>
                        <Box as="span" flex='1' textAlign='center' fontSize="20px">
                        Welcome to IPAcman!
                        </Box>
                        <AccordionIcon />
                    </AccordionButton>
                </h2>
                <AccordionPanel pb={4} maxWidth="1000px">
                <p>IPAcman is an educational game for students of linguistics and phonetics. It helps you acquire knowledge of the <Link href="https://en.wikipedia.org/wiki/International_Phonetic_Alphabet" isExternal>International Phonetic Alphabet (IPA)</Link> by matching individual phonetic symbols with their descriptions in a fun game modeled on an 80s classic: <Link href="https://en.wikipedia.org/wiki/Pac-Man" isExternal>Pac-Man</Link>. You may choose to learn only British English (i.e. conservative <Link href="https://en.wikipedia.org/wiki/Received_Pronunciation" isExternal>RP</Link>) sounds, or the whole of IPA. You also have a chance of practicing <Link href="https://en.wikipedia.org/wiki/X-SAMPA" isExternal>X-SAMPA</Link>, which is a viable ASCII-only alternative for IPA!</p>
                <p>Have fun!</p>
                </AccordionPanel>
            </AccordionItem>
            </Accordion>
            <StatusBar user={props.user} userOtherData={userState}/>
            <Box display="flex">
                <Board stopGame={stopGame} gameReset={gameReset} pace={pace}/>
                <Panel stopGame={stopGame}/>
            </Box>
            <GameOverModal isOpen={isOpen} onClose={closeModal}/>
        </Container>
    )

}

