import * as React from 'react';
import {Square} from './Square';
import {BoardGrid, GridElement, MistakeType, Phoneme, Question} from "../../types/types";
import {useEffect, useRef} from "react";
import useState from 'react-usestateref';
import {questions} from '../../data/RP_questions';
import {consonants, phonemes, vowels} from "../../data/RP_segments";
import {movement, chooseADirectionAtRandom, generateRandomPosition, checkDistance} from "../../helperFunctions";
import type { RootState } from '../../ReduxStore/store';
import { useSelector, useDispatch } from 'react-redux';
import { setNewInterval, resetInterval, resetAllIntervals } from '../../ReduxStore/reducers/IntervalsReducer';
import {
    loseLife,
    setCurrentlySearched,
    addMistake,
    increaseScore,
    resetCurrentlySearched,
    resetLife,
    resetMistakes,
    resetScore
} from '../../ReduxStore/reducers/IpacmanReducer';
import {Box, useMediaQuery} from '@chakra-ui/react';
import coin from '../../assets/coin.png';
import pacman from '../../assets/pacman-r.png';

interface BoardProps {
    stopGame: () => void
    gameReset: boolean
    pace: number
}

export const Board = (props: BoardProps) => {

    const {stopGame, gameReset, pace} = props;

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

    useEffect(() => {
        if (life <= 0) stopGame();
    }, [life]);

    const grid = new Array(18).fill(null).map(() => Array(26).fill(null).map(() => Array(2).fill("")));
    grid[0][0] = ["pacman right", ""];

    const [board, setBoard, boardRef] = useState(grid);

    const useIpa = useSelector((state: RootState) => state.ipacmanData.useIpa);

    const resetGame = () => {
        setPhonemesOnTheBoard([]);
        setBoard(grid);
        setDirection(["", "", "", "", "", ""]);
        dispatch(resetAllIntervals());
        dispatch(resetLife());
        dispatch(resetMistakes());
        dispatch(resetScore());
        dispatch(resetCurrentlySearched());
    }

    useEffect(() => {
        if (gameReset) resetGame();
    }, [gameReset]);

    const findPacman = () => {
        for (let i = 0; i < boardRef.current.length; i++) {
            for (let j = 0; j < boardRef.current[i].length; j++) {
                if (boardRef.current[i][j][0].includes("pacman")) return [i, j];
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
        let newGrid = boardRef.current.slice();
        const oldCoords: number[] = findPacman() as number[];
        const newCoords: number[] = movement(direction, oldCoords);
        let p_string = "pacman " + direction;
        let newPhoneme: null | Phoneme[] = null;
        if (newGrid[newCoords[0]][newCoords[1]][0] === "coin") {
            if (eatAPhoneme(newGrid[newCoords[0]][newCoords[1]][1])) {
                p_string += " success";
            } else {
                p_string += " failure";
            }
            const eatenPhonemeData: Phoneme = newGrid[newCoords[0]][newCoords[1]][1];
            const index: number = phonemesOnTheBoardRef.current.findIndex(x => x["sampa"] === eatenPhonemeData.sampa);
            dispatch(resetInterval({index: index}));

            newPhoneme = generateXRandomPhonemes("any", 1);
            newGrid = putPhonemesOnTheBoard(newPhoneme);

            const newPhonemesOnTheBoard: Phoneme[] = phonemesOnTheBoardRef.current.slice();
            newPhonemesOnTheBoard[index] = newPhoneme[0];

            const newQuestion: Question = generateRandomQuestion(newPhonemesOnTheBoard);

            setPhonemesOnTheBoard(newPhonemesOnTheBoard);
            dispatch(setCurrentlySearched(newQuestion));

        }
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
        const phonemeClasses: string[] = [];
        for (const prop in phoneme) {
            phonemeClasses.push(phoneme[prop]);
        }
        const result: boolean = currentlySearchedRef.current.classes.some(x => phonemeClasses.includes(x));
        if (!result) {
            const mistake: MistakeType = {guessedPhoneme: phoneme, guessedQuestion: currentlySearchedRef.current};
            dispatch(addMistake(mistake));
        }
        return result;
    }

    const setupGame = () => {
        const phonemes: Phoneme[] = generateXRandomPhonemes("any", 5) as Phoneme[];
        const newBoard: BoardGrid = putPhonemesOnTheBoard(phonemes);
        const randomQuestion: Question = generateRandomQuestion(phonemes);
        setBoard(newBoard);
        setPhonemesOnTheBoard(phonemes);
        dispatch(setCurrentlySearched(randomQuestion));
        console.log("setup complete");
    };

    useEffect(() => {
        if (!pace) return;
        if (phonemesOnTheBoard.length === 5 && pace) {
            for (let i = 0; i < 5; i++) {
                if (intervalsStateArray[i].interval === 0) {
                    const action = setAPhonemeInMotion(phonemesOnTheBoard[i], pace, movePhoneme, i);
                    dispatch(setNewInterval(action));
                }
            }
        }
    }, [phonemesOnTheBoard]);

    // Phoneme functions

    const generateXRandomPhonemes = (category: string, num: number) => {
        const currentPhonemeArr: Phoneme[] = phonemesOnTheBoardRef.current.slice();
        const newPhonemeArr: Phoneme[] = [];
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
            let diphthong_count = 0;
            const combinedPhonemeArr = [...currentPhonemeArr, ...newPhonemeArr];
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
        const newGrid: any[][] = oldGrid ? oldGrid : boardRef.current.slice();

        for (let i = 0; i < phonemeArr.length; i++) {
            let pos: number[] = generateRandomPosition();
            let pickedSquare: GridElement = newGrid[pos[0]][pos[1]].slice();
            const pacmanPos: number[] = findPacman() as number[];
            while (checkDistance(pos, pacmanPos) || pickedSquare[0].includes("coin")) {
                pos = generateRandomPosition();
                pickedSquare = newGrid[pos[0]][pos[1]].slice();
            }
            pickedSquare[0] = "coin";
            pickedSquare[1] = phonemeArr[i];
            newGrid[pos[0]][pos[1]] = pickedSquare;
        }
        return newGrid;
    }

    const generateRandomQuestion = (phonemeArr?: Phoneme[]) => {
        const phonemesToAnalyze: Phoneme[] = phonemeArr ? phonemeArr : phonemesOnTheBoard;
        const classesOfPhonemesOnTheBoard: string[] = [];
        phonemesToAnalyze.forEach(x => {
            if (x) {
                for (const prop in x) {
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
        const currentlySearched: Question = questions[index];
        return currentlySearched;
    }

    const setAPhonemeInMotion = (phoneme: Phoneme, pace: number, callback_function: (phoneme: Phoneme, intervalId?: any) => void, index?: number) => {
        const interval = setInterval(function(){
            callback_function(phoneme, interval);
        }, pace);
        const randomDirection = chooseADirectionAtRandom();
        setDirection((directions: string[]) => directions.map((x: string, i: number) => i === index ? randomDirection : x));
        return {
            interval: interval,
            index: index || 0,
            sampa: phoneme.sampa
        }
    }

    const movePhoneme = (phoneme: Phoneme, intervalId?: any) => {
        const index: number = phonemesOnTheBoardRef.current.findIndex(x => x.sampa === phoneme.sampa);
        if (index === -1) {
            clearInterval(intervalId);
            return;
        }
        const direction: string = directionRef.current[index];

        const newGrid: any = boardRef.current.slice();
        const oldCoords: number[] | boolean = findAPhoneme(phoneme.sampa);
        if (oldCoords === false) {
            console.error(`Phoneme ${phoneme.sampa} not found!`);
            return;
        }
        const newCoords: number[] = movement(direction, oldCoords);
        if (newGrid[newCoords[0]][newCoords[1]][0].includes("pacman")) {
            return false;
        }
        if ((oldCoords[0] === newCoords[0] && oldCoords[1] === newCoords[1]) || newGrid[newCoords[0]][newCoords[1]][0] === "coin") {
            let newRandomDirection = chooseADirectionAtRandom();
            while (newRandomDirection === direction) newRandomDirection = chooseADirectionAtRandom();
            setDirection((directions) => directions.map((x: string, i: number) => i === index ? newRandomDirection : x));
            return;
        }
        const phonemeInfo = newGrid[oldCoords[0]][oldCoords[1]];
        newGrid[newCoords[0]][newCoords[1]] = phonemeInfo;
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

    const [isLargerThan1040] = useMediaQuery('(min-width: 1040px)');

    return (
        <Box sx={{
            minWidth: isLargerThan1040 ? '780px' : '676px',
            maxWidth: isLargerThan1040 ? '780px' : '676px',
            display: "block",
            td: {
                overflow: "hidden",
                width: isLargerThan1040 ? "30px" : "26px",
                height: isLargerThan1040 ? "30px" : "26px",
                padding: "1px",
                backgroundColor: "#181819",
                textAlign: "center"
            },
            ".pacman, .coin": {
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                backgroundSize: "92%",
                fontWeight: "bold",
                fontSize: isLargerThan1040 ? 'md' : 'sm'
            },
            '.left': {
                transform: 'rotate(180deg)'
            },
            '.up': {
                transform: 'rotate(-90deg)'
            },
            '.down': {
                transform: 'rotate(90deg)'
            },
            '.pacman.success': {
                backgroundColor: 'green !important'
            },
            '.pacman.failure': {
                backgroundColor: 'red !important'
            },
            '.coin': {
                backgroundImage: coin
            },
            '.pacman': {
                backgroundImage: pacman
            }
        }}>
                <table cellSpacing="0">
                    <tbody>
                    {boardElements}
                    </tbody>
                </table>
            </Box>
    )
}