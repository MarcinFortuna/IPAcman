import * as React from 'react';
import {Square} from './Square';
import {BoardGrid, GridElement, MistakeType, Phoneme, Question} from "./types/types";
import {useEffect, useRef} from "react";
import useState from 'react-usestateref';
import {questions} from './data/RP_questions';
import {consonants, phonemes, vowels} from "./data/RP_segments";
import {movement, chooseADirectionAtRandom, generateRandomPosition} from "./helperFunctions";

import type { RootState } from './ReduxStore/store';
import { useSelector, useDispatch } from 'react-redux';
import { setNewInterval, resetInterval } from './ReduxStore/reducers/IntervalsReducer';
import { loseLife, setCurrentlySearched, addMistake, increaseScore } from './ReduxStore/reducers/IpacmanReducer';


export const BoardFunctional = (props: any) => {

    const intervalsStateArray = useSelector((state: RootState) => state.intervals.intervals);
    const dispatch = useDispatch();

    const life = useSelector((state: RootState) => state.ipacmanData.life);

    const gameOn = useSelector((state: RootState) => state.ipacmanData.gameOn);
    const gameOnRef = useRef(gameOn);

    const [phonemesOnTheBoard, setPhonemesOnTheBoard, phonemesOnTheBoardRef] = useState<Phoneme[]>([]);
    const [directions, setDirection, directionRef] = useState<string[]>(["", "", "", "", "", ""]);

    const currentlySearched = useSelector((state: RootState) => state.ipacmanData.currentlySearched);
    const currentlySearchedRef = useRef(currentlySearched);
    useEffect(() => {
        currentlySearchedRef.current = currentlySearched;
    }, [currentlySearched]);

    // const mistakes = useSelector((state: RootState) => state.ipacmanData.mistakes);

    useEffect(() => {
        if (life <= 0) props.stopGame();
    }, [life])

    const grid = new Array(20).fill(null).map(x => Array(30).fill(null).map(y => Array(2).fill("")));
    grid[0][0] = ["pacman right", ""];

    const [board, setBoard, boardRef] = useState(grid);

    const useIpa = useSelector((state: RootState) => state.ipacmanData.useIpa);

    // const resetGame = () => {
    //     if (props.pace) props.clearAllIntervals();
    //     setBoard(grid);
    // }

    const findPacman = () => {
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                if (board[i][j][0].includes("pacman")) return [i, j];
            }
        }
        return false;
    }

    const findAPhoneme = (sampa: string) => {
        for (let i = 0; i < boardRef.current.length; i++) {
            for (let j = 0; j < boardRef.current[i].length; j++) {
                if (boardRef.current[i][j][1]["sampa"] === sampa) return [i, j]; // It seems much safer to compare Sampa than IPA
            }
        }
        return false;
    }

    const movePacman = (direction: string) => {
        let newGrid: any = board.slice();
        // @ts-ignore
        let oldCoords: number[] = findPacman();
        let newCoords: number[] = movement(direction, oldCoords);
        let p_string = "pacman " + direction;
        let newPhoneme: null | Phoneme[] = null;
        if (newGrid[newCoords[0]][newCoords[1]][0] === "coin") {
            if (eatAPhoneme(newGrid[newCoords[0]][newCoords[1]][1])) {
                p_string += " success";
            } else {
                p_string += " failure";
            }
            let eatenPhonemeData = newGrid[newCoords[0]][newCoords[1]][1];
            let index: number = phonemesOnTheBoardRef.current.findIndex(x => x["sampa"] === eatenPhonemeData.sampa);
            dispatch(resetInterval({index: index}));

            newPhoneme = generateXRandomPhonemes("any", 1);
            newGrid = putPhonemesOnTheBoard(newPhoneme);

            let newPhonemesOnTheBoard: Phoneme[] = phonemesOnTheBoardRef.current.slice();
            newPhonemesOnTheBoard[index] = newPhoneme[0];

            let newQuestion: Question = generateRandomQuestion(newPhonemesOnTheBoard);

            setPhonemesOnTheBoard(newPhonemesOnTheBoard);
            dispatch(setCurrentlySearched(newQuestion));

        }
        // @ts-ignore
        newGrid[oldCoords[0]][oldCoords[1]] = ["", ""];
        newGrid[newCoords[0]][newCoords[1]] = [p_string, ""];
        setBoard(newGrid);
    }

    const handleKeyDown = (e: any) => {
        if (gameOnRef.current) {
            e.preventDefault();
            if (e.key === "a" || e.key === "h" || e.key === "ArrowLeft") movePacman("left");
            if (e.key === "d" || e.key === "l" || e.key === "ArrowRight") movePacman("right");
            if (e.key === "s" || e.key === "j" || e.key === "ArrowDown") movePacman("down");
            if (e.key === "w" || e.key === "k" || e.key === "ArrowUp") movePacman("up");
        }
    }

    const eatAPhoneme = (phoneme: any) => {
        if (checkIfPhonemeCurrent(phoneme)) {
            dispatch(increaseScore());
            return true;
        } else {
            dispatch(loseLife());
            return false;
        }
    }

    const checkIfPhonemeCurrent = (phoneme: Phoneme) => {
        let phonemeClasses: string[] = [];
        for (let prop in phoneme) {
            phonemeClasses.push(phoneme[prop]);
        }
        let result: boolean = currentlySearchedRef.current.classes.some(x => phonemeClasses.includes(x));
        if (!result) {
            let mistake: MistakeType = {guessedPhoneme: phoneme, guessedQuestion: currentlySearched};
            dispatch(addMistake(mistake));
        }
        return result;
    }

    const setupGame = () => {
        let phonemes: Phoneme[] = generateXRandomPhonemes("any", 6) as Phoneme[];
        const newBoard: BoardGrid = putPhonemesOnTheBoard(phonemes);
        const randomQuestion: Question = generateRandomQuestion(phonemes);
        setBoard(newBoard);
        setPhonemesOnTheBoard(phonemes);
        dispatch(setCurrentlySearched(randomQuestion));
        console.log("setup complete");
    };

    useEffect(() => {
        if (!props.pace) return;
        if (phonemesOnTheBoard.length === 6 && props.pace) {
            for (let i = 0; i < 6; i++) {
                if (intervalsStateArray[i].interval === 0) {
                    let action = setAPhonemeInMotion(phonemesOnTheBoard[i], props.pace, movePhoneme, i);
                    dispatch(setNewInterval(action));
                }
            }
        }
    }, [phonemesOnTheBoard]);

    // Phoneme functions

    const generateXRandomPhonemes = (category: string, num: number) => {
        let currentPhonemeArr: Phoneme[] = phonemesOnTheBoardRef.current.slice();
        let newPhonemeArr: Phoneme[] = [];
        for (let i = 0; i < num; i++) {
            let randomNumber: number;
            let randomPhoneme: Phoneme;
            const getRandomPhoneme = (category) => {
                if (category === "C") {
                    randomNumber = Math.floor(Math.random() * consonants.length);
                    randomPhoneme = consonants[randomNumber];
                }
                if (category === "V") {
                    randomNumber = Math.floor(Math.random() * vowels.length);
                    randomPhoneme = vowels[randomNumber];
                } else {
                    randomNumber = Math.floor(Math.random() * phonemes.length);
                    randomPhoneme = phonemes[randomNumber];
                }
            }
            getRandomPhoneme(category);
            // Due to few questions which eliminate diphthongs and many diphthongs in the inventory,
            // there sometimes arises huge surplus of diphthongs on the board.
            // This is why there is an artificial restriction limiting the number of diphthongs to 2 at the same time.
            let diphthong_count: number = 0;
            let combinedPhonemeArr = [...currentPhonemeArr, ...newPhonemeArr];
            for (let i = 0; i < combinedPhonemeArr.length; i++) {
                if (combinedPhonemeArr[i] && combinedPhonemeArr[i].hasOwnProperty("type")) diphthong_count++;
            }

            // @ts-ignore
            while (combinedPhonemeArr.some(x => x && x["sampa"] === randomPhoneme["sampa"]) || (diphthong_count >= 2 && randomPhoneme.hasOwnProperty("type"))) {
                getRandomPhoneme(category);
            }
            // @ts-ignore
            newPhonemeArr.push(randomPhoneme);
        }
        return newPhonemeArr;
    }

    const putPhonemesOnTheBoard = (phonemeArr: Phoneme[], oldGrid?: BoardGrid) => {

        let newGrid: any = oldGrid ? oldGrid : board.slice();

        for (let i = 0; i < phonemeArr.length; i++) {
            let pos: number[] = generateRandomPosition();
            let pickedSquare: GridElement = newGrid[pos[0]][pos[1]].slice();
            while (pickedSquare[0].includes("pacman") || pickedSquare[0].includes("coin")) {
                pos = generateRandomPosition();
                // @ts-ignore
                pickedSquare = newGrid[pos[0]][pos[1]].slice();
            }
            pickedSquare[0] = "coin";
            pickedSquare[1] = phonemeArr[i];
            newGrid[pos[0]][pos[1]] = pickedSquare;
        }
        return newGrid;
    }

    const generateRandomQuestion = (phonemeArr?: Phoneme[]) => {
        let phonemesToAnalyze: Phoneme[] = phonemeArr ? phonemeArr : phonemesOnTheBoard;
        let classesOfPhonemesOnTheBoard: string[] = [];
        phonemesToAnalyze.forEach(x => {
            if (x) {
                // @ts-ignore
                for (let prop in x) {
                    classesOfPhonemesOnTheBoard.push(x[prop]);
                }
            }
        });
        let index: number = Math.floor(Math.random() * questions.length);
        while (!classesOfPhonemesOnTheBoard.some(
            x => questions[index]["classes"].indexOf(x) > -1
        )) {
            index = Math.floor(Math.random() * questions.length);
        }
        let currentlySearched: Question = questions[index];
        return currentlySearched;
    }

    const setAPhonemeInMotion = (phoneme: Phoneme, pace: number, callback_function: (phoneme: Phoneme, intervalId?: any) => void, index?: number) => {
        let interval = setInterval(function(){
            callback_function(phoneme, interval);
        }, pace);
        let randomDirection = chooseADirectionAtRandom();
        setDirection((directions) => directions.map((x: string, i: number) => i === index ? randomDirection : x));
        return {
            interval: interval,
            index: index || 0,
            sampa: phoneme.sampa
        }
    }

    const movePhoneme = (phoneme: Phoneme, intervalId?: any) => {
        let index: number = phonemesOnTheBoardRef.current.findIndex(x => x.sampa === phoneme.sampa);
        if (index === -1) {
            // console.log("Clearing interval " + intervalId);
            clearInterval(intervalId);
            return;
        }
        let direction: string = directionRef.current[index];

        let newGrid: any = board.slice();
        // @ts-ignore
        let oldCoords: number[] | boolean = findAPhoneme(phoneme.sampa);
        let newCoords: number[] = movement(direction, oldCoords);
        if (newGrid[newCoords[0]][newCoords[1]][0].includes("pacman")) {
            return false;
        }
        // @ts-ignore
        if ((oldCoords[0] === newCoords[0] && oldCoords[1] === newCoords[1]) || newGrid[newCoords[0]][newCoords[1]][0] === "coin") {
            let newRandomDirection = chooseADirectionAtRandom();
            while (newRandomDirection === direction) newRandomDirection = chooseADirectionAtRandom();
            setDirection((directions) => directions.map((x: string, i: number) => i === index ? newRandomDirection : x));
            return;
        };
        // @ts-ignore
        let phonemeInfo = newGrid[oldCoords[0]][oldCoords[1]];
        newGrid[newCoords[0]][newCoords[1]] = phonemeInfo;
        // @ts-ignore
        newGrid[oldCoords[0]][oldCoords[1]] = ["", ""];
        setBoard(newGrid);
    }


    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        }
    }, []);

    useEffect(() => {
        gameOnRef.current = gameOn;
        if (gameOn) {
            setupGame();
        }
        // else resetGame();
    }, [gameOn]);

    const boardElements = board.map((row: any, i: number) => {
        return (
            <tr key={"row_" + i}>
                {row.map((col: GridElement, j: number) =>
                    <Square classname={board[i][j][0]}
                            ipa={(useIpa ? board[i][j][1]["ipa"] : board[i][j][1]["sampa"]) || board[i][j][1]}
                            key={i + "_" + j}/>
                )}
            </tr>)
    });

    return (
        <>
            <div id="boardDiv">
                <table cellSpacing="0">
                    <tbody>
                    {boardElements}
                    </tbody>
                </table>
            </div>
        </>
    )
}