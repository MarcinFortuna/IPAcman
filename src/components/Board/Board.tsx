import * as React from 'react';
import {Square} from './Square';
import {BoardGrid, GridElement, MistakeType, ParsedMistakeType, PhoneticSymbol, Question} from "../../types/types";
import {useEffect, useRef} from "react";
import useState from 'react-usestateref';
import {rp_questions} from '../../data/RP_questions';
import {full_ipa_questions} from '../../data/full_IPA_questions';
import {
    movement,
    chooseADirectionAtRandom,
    generateRandomPosition,
    checkDistance
} from "../../helperFunctions";
import {useGetRandomPhonemeAndAnswers} from "../../helperQuestionFunctions";
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
import { initialGrid } from '../../data/initialGrid';

interface BoardProps {
    stopGame: () => void
    gameReset: boolean
    pace: number
}

export const Board = (props: BoardProps) => {

    const {stopGame, gameReset, pace} = props;

    const {getRandomPhoneme, getCorrectAnswers} = useGetRandomPhonemeAndAnswers();

    const intervalsStateArray = useSelector((state: RootState) => state.intervals.intervals);
    const dispatch = useDispatch();

    const life = useSelector((state: RootState) => state.ipacmanData.life);

    const gameOn = useSelector((state: RootState) => state.ipacmanData.gameOn);
    const gameOnRef = useRef(gameOn);

    const [phonemesOnTheBoard, setPhonemesOnTheBoard, phonemesOnTheBoardRef] = useState<PhoneticSymbol[]>([]);
    const [directions, setDirection, directionRef] = useState<string[]>(["", "", "", "", "", ""]);

    const currentlySearched = useSelector((state: RootState) => state.ipacmanData.currentlySearched);
    const currentlySearchedRef = useRef(currentlySearched);

    const symbolScope = useSelector((state: RootState) => state.ipacmanData.symbolScope);
    const symbolScopeRef = useRef(symbolScope);

    const loginModalOpen = useSelector((state: RootState) => state.ipacmanData.loginModalOpen);
    const loginModalOpenRef = useRef(loginModalOpen);

    useEffect(() => {
        symbolScopeRef.current = symbolScope;
    }, [symbolScope]);

    useEffect(() => {
        currentlySearchedRef.current = currentlySearched;
    }, [currentlySearched]);

    useEffect(() => {
        if (life <= 0) stopGame();
    }, [life]);

    useEffect(() => {
        loginModalOpenRef.current = loginModalOpen;
    }, [loginModalOpen]);

    const [board, setBoard, boardRef] = useState<BoardGrid>(JSON.parse(JSON.stringify(initialGrid)));

    const useIpa = useSelector((state: RootState) => state.ipacmanData.useIpa);

    const resetGame = () => {
        setPhonemesOnTheBoard([]);
        setBoard(JSON.parse(JSON.stringify(initialGrid)));
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
        let newGrid: BoardGrid = boardRef.current.slice();
        const oldCoords: number[] = findPacman() as number[];
        const newCoords: number[] = movement(direction, oldCoords);
        let p_string = "pacman " + direction;
        let newPhoneme: null | PhoneticSymbol[] = null;
        if (newGrid[newCoords[0]][newCoords[1]][0] === "coin") {
            if (eatAPhoneme(newGrid[newCoords[0]][newCoords[1]][1] as PhoneticSymbol)) {
                p_string += " success";
            } else {
                p_string += " failure";
            }
            const eatenPhonemeData: PhoneticSymbol = newGrid[newCoords[0]][newCoords[1]][1] as PhoneticSymbol;
            const index: number = phonemesOnTheBoardRef.current.findIndex(x => x["sampa"] === eatenPhonemeData.sampa);
            dispatch(resetInterval({index: index}));

            newPhoneme = generateXRandomPhonemes(1);
            newGrid = putPhonemesOnTheBoard(newPhoneme);

            const newPhonemesOnTheBoard: PhoneticSymbol[] = phonemesOnTheBoardRef.current.slice();
            newPhonemesOnTheBoard[index] = newPhoneme[0];

            const newQuestion: Question = generateRandomQuestion(newPhonemesOnTheBoard);

            setPhonemesOnTheBoard(newPhonemesOnTheBoard);
            dispatch(setCurrentlySearched(newQuestion));

        }
        newGrid[oldCoords[0]][oldCoords[1]] = ["", ""];
        newGrid[newCoords[0]][newCoords[1]] = [p_string, ""];
        setBoard(newGrid);
    }

    const handleKeyDown = (e) => {
        if (gameOnRef.current && !loginModalOpenRef.current) {
            e.preventDefault();
            if (e.key === "a" || e.key === "h" || e.key === "ArrowLeft") movePacman("left");
            if (e.key === "d" || e.key === "l" || e.key === "ArrowRight") movePacman("right");
            if (e.key === "s" || e.key === "j" || e.key === "ArrowDown") movePacman("down");
            if (e.key === "w" || e.key === "k" || e.key === "ArrowUp") movePacman("up");
        }
    }

    const eatAPhoneme = (phoneme: PhoneticSymbol) => {
        if (checkIfPhonemeCurrent(phoneme)) {
            dispatch(increaseScore());
            return true;
        } else {
            dispatch(loseLife());
            return false;
        }
    }

    const checkIfPhonemeCurrent = (phoneme: PhoneticSymbol) => {
        const phonemeClasses: string[] = [];
        for (const prop in phoneme) {
            phonemeClasses.push(phoneme[prop]);
        }
        const result: boolean = currentlySearchedRef.current.classes.some(x => phonemeClasses.includes(x));
        if (!result) {
            const mistake: MistakeType = {guessedPhoneme: phoneme, guessedQuestion: currentlySearchedRef.current};
            const parsedMistake: ParsedMistakeType = getCorrectAnswers(mistake);
            dispatch(addMistake(parsedMistake));
        }
        return result;
    }

    const setupGame = () => {
        const phonemes: PhoneticSymbol[] = generateXRandomPhonemes(5) as PhoneticSymbol[];
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

    const generateXRandomPhonemes = (num: number) => {
        const currentPhonemeArr: PhoneticSymbol[] = phonemesOnTheBoardRef.current.slice();
        const newPhonemeArr: PhoneticSymbol[] = [];
        for (let i = 0; i < num; i++) {
            const randomPhoneme: PhoneticSymbol = getRandomPhoneme([...currentPhonemeArr, ...newPhonemeArr]);
            newPhonemeArr.push(randomPhoneme);
        }
        return newPhonemeArr;
    }

    const putPhonemesOnTheBoard = (phonemeArr: PhoneticSymbol[], oldGrid?: BoardGrid) => {
        const newGrid: BoardGrid = oldGrid ? oldGrid : boardRef.current.slice();

        for (let i = 0; i < phonemeArr.length; i++) {
            let pos: number[] = generateRandomPosition();
            let pickedSquare: GridElement = newGrid[pos[0]][pos[1]].slice() as GridElement;
            const pacmanPos: number[] = findPacman() as number[];
            while (checkDistance(pos, pacmanPos) || pickedSquare[0].includes("coin")) {
                pos = generateRandomPosition();
                pickedSquare = newGrid[pos[0]][pos[1]].slice() as GridElement;
            }
            pickedSquare[0] = "coin";
            pickedSquare[1] = phonemeArr[i];
            newGrid[pos[0]][pos[1]] = pickedSquare;
        }
        return newGrid;
    }

    const generateRandomQuestion = (phonemeArr?: PhoneticSymbol[]) => {
        const phonemesToAnalyze: PhoneticSymbol[] = phonemeArr ? phonemeArr : phonemesOnTheBoard;
        const classesOfPhonemesOnTheBoard: string[] = [];
        phonemesToAnalyze.forEach(x => {
            if (x) {
                for (const prop in x) {
                    classesOfPhonemesOnTheBoard.push(x[prop]);
                }
            }
        });
        const questions: Question[] = symbolScopeRef.current.selected === "rp" ? rp_questions : full_ipa_questions;
        const filteredQuestions: Question[] = questions.filter((question: Question) => {
            return classesOfPhonemesOnTheBoard.some((cl: string) => question.classes.includes(cl));
        });
        const index: number = Math.floor(Math.random() * filteredQuestions.length);
        return filteredQuestions[index];
    }

    const setAPhonemeInMotion = (phoneme: PhoneticSymbol, pace: number, callback_function: (phoneme: PhoneticSymbol, intervalId?: number | NodeJS.Timeout) => void, index?: number) => {
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

    const movePhoneme = (phoneme: PhoneticSymbol, intervalId?: number | NodeJS.Timeout) => {
        const index: number = phonemesOnTheBoardRef.current.findIndex(x => x.sampa === phoneme.sampa);
        if (index === -1) {
            clearInterval(intervalId);
            return;
        }
        const direction: string = directionRef.current[index];

        const newGrid: BoardGrid = boardRef.current.slice();
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

    const boardElements = board.map((row: GridElement[], i: number) => {
        return (
            <tr key={"row_" + i}>
                {row.map((col: GridElement, j: number) =>
                    <Square classname={board[i][j][0]}
                            ipa={(useIpa ? (board[i][j][1]["ipa"] || board[i][j][1]["ipa_diacritic"] || board[i][j][1]["ipa_letter"]) : board[i][j][1]["sampa"]) || board[i][j][1]}
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