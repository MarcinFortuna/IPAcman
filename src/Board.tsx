import * as React from 'react';
import {Square} from './Square';
import {BoardGrid, GridElement, MistakeType, Phoneme, Question} from "./types/types";
import {useEffect, useRef, useState} from "react";
import {useStore} from "./ZustandStore";
import { questions } from './data/RP_questions';
import {consonants, phonemes, vowels} from "./data/RP_segments";

export const BoardFunctional = (props: any) => {

    const gameOn = useStore((state: any) => state.gameOn);
    const phonemesOnTheBoard = useStore((state: any) => state.phonemesOnTheBoard);
    const addPhonemeToList = useStore((state: any) => state.addPhonemeToTheList);
    const setNewPhonemeList = useStore((state:any) => state.setNewPhonemeList);
    const wipeAPhonemeOut = useStore((state: any) => state.removePhonemeFromTheList);
    const currentlySearched = useStore((state: any) => state.currentlySearched);
    const setCurrentlySearched = useStore((state: any) => state.setCurrentlySearched);

    // @ts-ignore
    const phonemesOnTheBoardRef = useRef(useStore.getState().phonemesOnTheBoard)
    useEffect(() => useStore.subscribe(
      // @ts-ignore
 state => (phonemesOnTheBoardRef.current = state.phonemesOnTheBoard)
    ), []);

    // @ts-ignore
    const currentlySearchedRef = useRef(useStore.getState().currentlySearched);
    useEffect(() => useStore.subscribe(
        // @ts-ignore
        state => (currentlySearchedRef.current = state.currentlySearched)
    ), []);


    const grid = new Array(20).fill(null).map(x => Array(30).fill(null).map(y => Array(2).fill("")));
    grid[0][0] = ["pacman right", ""];

    const [board, setBoard] = useState(grid);
    const useIpa = true;

    const directions = ["up", "down", "left", "right", "up-left", "down-left", "up-right", "down-right"];

    const chooseADirectionAtRandom = () => directions[Math.floor(Math.random() * 8)];

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
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                if (board[i][j][1]["sampa"] === sampa) return [i, j]; // It seems much safer to compare Sampa than IPA
            }
        }
        return false;
    }

    const movement = (direction, oldCoords) => {

        let newCoords: number[] = oldCoords.slice();

        if (direction === "left" && newCoords[1] !== 0) newCoords[1] -= 1;
        if (direction === "right" && newCoords[1] !== 29) newCoords[1] += 1;
        if (direction === "up" && newCoords[0] !== 0) newCoords[0] -= 1;
        if (direction === "down" && newCoords[0] !== 19) newCoords[0] += 1;

        // The directions below are only for phonemes

        if (direction === "up-left" && newCoords[1] !== 0 && newCoords[0] !== 0) { newCoords[1] -= 1; newCoords[0] -= 1; }
        if (direction === "down-left" && newCoords[1] !== 0 && newCoords[0] !== 19) { newCoords[1] -= 1; newCoords[0] += 1; }
        if (direction === "up-right" && newCoords[1] !== 29 && newCoords[0] !== 0) { newCoords[1] += 1; newCoords[0] -= 1; }
        if (direction === "down-right" && newCoords[1] !== 29 && newCoords[0] !== 19) { newCoords[1] += 1; newCoords[0] += 1; }

        return newCoords;
    }

    const movePacman = async (direction: string) => {
        console.log("In move pacman", direction);
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
            newPhoneme = generateXRandomPhonemes("any", 1);
            newGrid = putPhonemesOnTheBoard(newPhoneme);

            let eatenPhonemeData = newGrid[newCoords[0]][newCoords[1]][1]
            let index: number = phonemesOnTheBoardRef.current.findIndex(x => x["sampa"] === eatenPhonemeData.sampa);

            let newPhonemesOnTheBoard: Phoneme[] = phonemesOnTheBoardRef.current.slice();
            newPhonemesOnTheBoard = newPhonemesOnTheBoard.filter((x: Phoneme, i: number) => i !== index);
            newPhonemesOnTheBoard.push(newPhoneme[0]);

            let newQuestion: Question = generateRandomQuestion(newPhonemesOnTheBoard);
            setNewPhonemeList(newPhonemesOnTheBoard);
            setCurrentlySearched(newQuestion);

        }
        // @ts-ignore
        newGrid[oldCoords[0]][oldCoords[1]] = ["", ""];
        newGrid[newCoords[0]][newCoords[1]] = [p_string, ""];
        setBoard(newGrid);
    }

    const handleKeyDown = (e: any) => {
        // if (currentGameOn.current) {
            e.preventDefault();
            if (e.key === "a" || e.key === "h" || e.key === "ArrowLeft") movePacman("left");
            if (e.key === "d" || e.key === "l" || e.key === "ArrowRight") movePacman("right");
            if (e.key === "s" || e.key === "j" || e.key === "ArrowDown") movePacman("down");
            if (e.key === "w" || e.key === "k" || e.key === "ArrowUp") movePacman("up");
        // }
    }

    const eatAPhoneme = (phoneme: any) => {
        if (checkIfPhonemeCurrent(phoneme)) {
            props.increaseScore();
            return true;
        } else {
            props.loseLife();
            return false;
        }
    }

    const checkIfPhonemeCurrent = (phoneme: Phoneme) => {
        let phoneme_classes: string[] = [];
        for (let prop in phoneme) {
            phoneme_classes.push(phoneme[prop]);
        }
        let result: boolean = currentlySearchedRef.current.classes.some(x => phoneme_classes.includes(x));
        if (!result) {
            let mistake: MistakeType[] = [{guessedPhoneme: phoneme, guessedQuestion: currentlySearched}];
            console.log(mistake);
            // this.setState({ mistakes: this.state.mistakes.concat(mistake) })
        }
        return result;
    }

    const setupGame = () => {
        const phonemes: Phoneme[] = generateXRandomPhonemes("any", 6) as Phoneme[];
        const newBoard: BoardGrid = putPhonemesOnTheBoard(phonemes);
        const randomQuestion: Question = generateRandomQuestion(phonemes);
        setBoard(newBoard);
        setNewPhonemeList(phonemes);
        setCurrentlySearched(randomQuestion);
    };

    // Phoneme functions

    const generateRandomPosition = () => [Math.floor(Math.random() * 20), Math.floor(Math.random() * 30)];

    const generateXRandomPhonemes = (category: string, num: number) => {
        let phonemeArr: Phoneme[] = phonemesOnTheBoard.slice() || [];
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
            for (let i = 0; i < phonemeArr.length; i++) {
                // @ts-ignore
                if (phonemeArr[i] && phonemeArr[i].hasOwnProperty("type")) diphthong_count++;
            }

            // @ts-ignore
            while (phonemeArr.some(x => x && x["sampa"] === randomPhoneme["sampa"]) || (diphthong_count >= 2 && randomPhoneme.hasOwnProperty("type"))) {
                getRandomPhoneme(category);
            }
            // @ts-ignore
            phonemeArr.push(randomPhoneme);
        }
        return phonemeArr;
    }

    const putPhonemesOnTheBoard = (phonemeArr: Phoneme[], oldGrid?: BoardGrid) => {

        let newGrid: any = oldGrid ? oldGrid : board.slice();

        for (let i = 0; i < phonemeArr.length; i++) {
            let pos: number[] = generateRandomPosition();
            // @ts-ignore
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


    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        }
    }, []);

    useEffect(() => {
        if (gameOn) setupGame()
        // else resetGame();
    }, [gameOn]);

    // useEffect(() => {
    //     if (phonemesOnTheBoard.length === 6) {
    //         generateRandomQuestion();
    //     }
    // }, [phonemesOnTheBoard])

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

// export class Board extends React.Component<any, any> {
//
//     directions: string[]
//     state: {
//         grid: BoardGrid
//     }
//
//     constructor(props: any) {
//         super(props);
//         // @ts-ignore
//         let grid: BoardGrid = Array(20).fill().map(x => Array(30).fill().map(y => Array(2).fill("")))
//         grid[0][0] = ["pacman right", ""];
//         this.state = {
//             'grid': grid
//         };
//         this.handleKeyDown = this.handleKeyDown.bind(this);
//         this.movePacman = this.movePacman.bind(this);
//         this.put_a_phoneme_on_the_board = this.put_a_phoneme_on_the_board.bind(this);
//         this.generate_random_position = this.generate_random_position.bind(this);
//         this.movePhoneme = this.movePhoneme.bind(this);
//         this.directions = ["up", "down", "left", "right", "up-left", "down-left", "up-right", "down-right"];
//     }
//
//     // add event listeners
//
//     componentDidMount() {
//         window.addEventListener("keydown", this.handleKeyDown);
//     }
//
//     componentWillUnmount() {
//         window.removeEventListener("keydown", this.handleKeyDown);
//     }
//
//     chooseADirectionAtRandom() {
//         let randomNumber: number = Math.floor(Math.random() * 8);
//         return this.directions[randomNumber];
//     }
//
//     async componentDidUpdate(prevProps, prevState) {
//
//         if (!prevProps.gameOn && this.props.gameOn) {
//             for (let i = 0; i < 6; i++) {
//                 await this.put_a_phoneme_on_the_board(this.props.generate_random_phoneme("any"));
//             }
//             if (this.props.pace > 0) {
//                 let phonemes = this.props.phonemesOnTheBoard.slice();
//                 for (let j = 0; j < 6; j++) {
//                     let random_direction = this.chooseADirectionAtRandom();
//                     await this.props.setAPhonemeInMotion(phonemes[j][1]["sampa"], random_direction, this.props.pace, this.movePhoneme);
//                 }
//             }
//         }
//         if (prevProps.gameOn && !this.props.gameOn) {
//             if (this.props.pace) this.props.clearAllIntervals();
//             // @ts-ignore
//             let grid: BoardGrid = Array(20).fill().map(x => Array(30).fill().map(y => Array(2).fill("")))
//             grid[0][0] = ["pacman right", ""];
//             this.setState({
//                 'grid': grid
//             });
//         }
//         if (prevProps.gameOn && this.props.pace && prevProps.phonemesOnTheBoard.some(x => x === null) && this.props.phonemesOnTheBoard.some(x => x && x.length === 2)) {
//             let newPhoneme: GridElement = this.props.phonemesOnTheBoard.filter(x => x.length === 2);
//             let random_direction: string = this.chooseADirectionAtRandom();
//             this.props.setAPhonemeInMotion(newPhoneme[0][1]["sampa"], random_direction, this.props.pace, this.movePhoneme);
//         }
//     }
//
//     handleKeyDown(e) {
//         if (this.props.gameOn) {
//             e.preventDefault();
//             if (e.key === "a" || e.key === "h" || e.key === "ArrowLeft") this.movePacman("left");
//             if (e.key === "d" || e.key === "l" || e.key === "ArrowRight") this.movePacman("right");
//             if (e.key === "s" || e.key === "j" || e.key === "ArrowDown") this.movePacman("down");
//             if (e.key === "w" || e.key === "k" || e.key === "ArrowUp") this.movePacman("up");
//         }
//     }
//
//     findPacman() {
//         for (let i = 0; i < this.state.grid.length; i++) {
//             for (let j = 0; j < this.state.grid[i].length; j++) {
//                 if (this.state.grid[i][j][0].includes("pacman")) return [i, j];
//             }
//         }
//     }
//
//     findAPhoneme(sampa: string) {
//         for (let i = 0; i < this.state.grid.length; i++) {
//             for (let j = 0; j < this.state.grid[i].length; j++) {
//                 if (this.state.grid[i][j][1]["sampa"] === sampa) return [i, j]; // It seems much safer to compare Sampa than IPA
//             }
//         }
//     }
//
//     movement(direction, oldCoords) {
//
//         let newCoords: number[] = oldCoords.slice();
//
//         if (direction === "left" && newCoords[1] !== 0) newCoords[1] -= 1;
//         if (direction === "right" && newCoords[1] !== 29) newCoords[1] += 1;
//         if (direction === "up" && newCoords[0] !== 0) newCoords[0] -= 1;
//         if (direction === "down" && newCoords[0] !== 19) newCoords[0] += 1;
//
//         // The directions below are only for phonemes
//
//         if (direction === "up-left" && newCoords[1] !== 0 && newCoords[0] !== 0) { newCoords[1] -= 1; newCoords[0] -= 1; }
//         if (direction === "down-left" && newCoords[1] !== 0 && newCoords[0] !== 19) { newCoords[1] -= 1; newCoords[0] += 1; }
//         if (direction === "up-right" && newCoords[1] !== 29 && newCoords[0] !== 0) { newCoords[1] += 1; newCoords[0] -= 1; }
//         if (direction === "down-right" && newCoords[1] !== 29 && newCoords[0] !== 19) { newCoords[1] += 1; newCoords[0] += 1; }
//
//         return newCoords;
//     }
//
//     movePacman(direction) {
//         let newGrid: BoardGrid = this.state.grid.slice();
//         // @ts-ignore
//         let oldCoords: number[] = this.findPacman();
//         let newCoords: number[] = this.movement(direction, oldCoords);
//         let p_string = "pacman " + direction;
//         if (newGrid[newCoords[0]][newCoords[1]][0] === "coin") {
//             if (this.eatAPhoneme(newGrid[newCoords[0]][newCoords[1]])) {
//                 p_string += " success";
//             } else {
//                 p_string += " failure";
//             }
//             this.put_a_phoneme_on_the_board(this.props.generate_random_phoneme("any"));
//         }
//         // @ts-ignore
//         newGrid[oldCoords[0]][oldCoords[1]] = ["", ""];
//         newGrid[newCoords[0]][newCoords[1]] = [p_string, ""];
//         this.setState({ "grid": newGrid });
//     }
//
//     movePhoneme(direction, phoneme) {
//         let newGrid: BoardGrid = this.state.grid.slice();
//         // @ts-ignore
//         let oldCoords: number[] = this.findAPhoneme(phoneme);
//         let newCoords: number[] = this.movement(direction, oldCoords);
//         if (this.state.grid[newCoords[0]][newCoords[1]][0].includes("pacman")) {
//             return false;
//         }
//         // @ts-ignore
//         if ((oldCoords[0] === newCoords[0] && oldCoords[1] === newCoords[1]) || this.state.grid[newCoords[0]][newCoords[1]][0] === "coin") {
//             let random_direction = this.chooseADirectionAtRandom();
//             this.props.setAPhonemeInMotion(phoneme, random_direction, this.props.pace, this.movePhoneme);
//             return false;
//         };
//         // @ts-ignore
//         let phonemeInfo = newGrid[oldCoords[0]][oldCoords[1]];
//         newGrid[newCoords[0]][newCoords[1]] = phonemeInfo;
//         // @ts-ignore
//         newGrid[oldCoords[0]][oldCoords[1]] = ["", ""];
//         this.setState({ "grid": newGrid });
//     }
//
//     eatAPhoneme(phoneme) {
//         let sampa: string = phoneme[1]["sampa"];
//         let index: number = this.props.phonemesOnTheBoard.findIndex(x => x[1]["sampa"] === sampa);
//         this.props.wipeAPhonemeOut(index);
//         if (this.props.checkIfPhonemeCurrent(phoneme[1])) {
//             this.props.increaseScore();
//             return true;
//         } else {
//             this.props.loseLife();
//             return false;
//         }
//     }
//
//     // Phoneme functions
//
//     generate_random_position() {
//         return [Math.floor(Math.random() * 20), Math.floor(Math.random() * 30)];
//     }
//
//     put_a_phoneme_on_the_board(phoneme) {
//         let pos: number[] = this.generate_random_position();
//         // @ts-ignore
//         let pickedSquare: GridElement = this.state.grid[pos[0]][pos[1]].slice();
//         while (pickedSquare[0].includes("pacman") || pickedSquare[0].includes("coin")) {
//             pos = this.generate_random_position();
//             // @ts-ignore
//             pickedSquare = this.state.grid[pos[0]][pos[1]].slice();
//         }
//         pickedSquare[0] = "coin";
//         pickedSquare[1] = phoneme;
//         let newGrid: BoardGrid = this.state.grid.slice()
//         newGrid[pos[0]][pos[1]] = pickedSquare;
//         this.setState({ "grid": newGrid });
//         this.props.addPhonemeToList(pickedSquare);
//     }
//
//     render() {
//         const g: BoardGrid = this.state.grid;
//         const board = g.map((row: GridElement[], i: number) => {
//             return (
//                 <tr key={"row_" + i}>
//                     {row.map((col: GridElement, j: number) => {
//                         return (
//                             <Square classname={g[i][j][0]} ipa={(this.props.useIpa ? g[i][j][1]["ipa"] : g[i][j][1]["sampa"]) || g[i][j][1]} key={i + "_" + j} />
//                         )
//                     }
//                     )
//                     }
//                 </tr>)
//         });
//
//         return (
//             <div id="boardDiv">
//                 <table cellSpacing="0">
//                     <tbody>
//                         {board}
//                     </tbody>
//                 </table>
//             </div>
//         )
//     }
// }