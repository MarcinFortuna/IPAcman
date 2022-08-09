// @ts-nocheck
import * as React from 'react';
import { Square } from './Square';

export class Board extends React.Component {

    constructor(props) {
        super(props);
        let grid = Array(20).fill().map(x => Array(30).fill().map(y => Array(2).fill("")))
        grid[0][0] = ["pacman right", ""];
        this.state = {
            'grid': grid
        };
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.movePacman = this.movePacman.bind(this);
        this.put_a_phoneme_on_the_board = this.put_a_phoneme_on_the_board.bind(this);
        this.generate_random_position = this.generate_random_position.bind(this);
        this.movePhoneme = this.movePhoneme.bind(this);
        this.directions = ["up", "down", "left", "right", "up-left", "down-left", "up-right", "down-right"];
    }

    // add event listeners

    componentDidMount() {
        window.addEventListener("keydown", this.handleKeyDown);
    }

    componentWillUnmount() {
        window.removeEventListener("keydown", this.handleKeyDown);
    }

    chooseADirectionAtRandom() {
        let randomNumber = Math.floor(Math.random() * 8);
        return this.directions[randomNumber];
    }

    async componentDidUpdate(prevProps, prevState) {

        if (!prevProps.gameOn && this.props.gameOn) {
            for (let i = 0; i < 6; i++) {
                await this.put_a_phoneme_on_the_board(this.props.generate_random_phoneme("any"));
            }
            if (this.props.pace > 0) {
                let phonemes = this.props.phonemesOnTheBoard.slice();
                for (let j = 0; j < 6; j++) {
                    let random_direction = this.chooseADirectionAtRandom();
                    await this.props.setAPhonemeInMotion(phonemes[j][1]["sampa"], random_direction, this.props.pace, this.movePhoneme);
                }
            }
        }
        if (prevProps.gameOn && !this.props.gameOn) {
            if (this.props.pace) this.props.clearAllIntervals();
            let grid = Array(20).fill().map(x => Array(30).fill().map(y => Array(2).fill("")))
            grid[0][0] = ["pacman right", ""];
            this.setState({
                'grid': grid
            });
        }
        if (prevProps.gameOn && this.props.pace && prevProps.phonemesOnTheBoard.some(x => x === null) && this.props.phonemesOnTheBoard.some(x => x && x.length === 2)) {
            let newPhoneme = this.props.phonemesOnTheBoard.filter(x => x.length === 2);
            let random_direction = this.chooseADirectionAtRandom();
            this.props.setAPhonemeInMotion(newPhoneme[0][1]["sampa"], random_direction, this.props.pace, this.movePhoneme);
        }
    }

    handleKeyDown(e) {
        if (this.props.gameOn) {
            e.preventDefault();
            if (e.key === "h" || e.key === "ArrowLeft") this.movePacman("left");
            if (e.key === "l" || e.key === "ArrowRight") this.movePacman("right");
            if (e.key === "j" || e.key === "ArrowDown") this.movePacman("down");
            if (e.key === "k" || e.key === "ArrowUp") this.movePacman("up");
        }
    }

    findPacman() {
        for (let i = 0; i < this.state.grid.length; i++) {
            for (let j = 0; j < this.state.grid[i].length; j++) {
                if (this.state.grid[i][j][0].includes("pacman")) return [i, j];
            }
        }
    }

    findAPhoneme(sampa) {
        for (let i = 0; i < this.state.grid.length; i++) {
            for (let j = 0; j < this.state.grid[i].length; j++) {
                if (this.state.grid[i][j][1]["sampa"] === sampa) return [i, j]; // It seems much safer to compare Sampa than IPA
            }
        }
    }

    movement(direction, oldCoords) {

        let newCoords = oldCoords.slice();

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

    movePacman(direction) {
        let newGrid = this.state.grid.slice();
        let oldCoords = this.findPacman();
        let newCoords = this.movement(direction, oldCoords);
        let p_string = "pacman " + direction;
        if (newGrid[newCoords[0]][newCoords[1]][0] === "coin") {
            if (this.eatAPhoneme(newGrid[newCoords[0]][newCoords[1]])) {
                p_string += " success";
            } else {
                p_string += " failure";
            }
            this.put_a_phoneme_on_the_board(this.props.generate_random_phoneme("any"));
        }
        newGrid[oldCoords[0]][oldCoords[1]] = ["", ""];
        newGrid[newCoords[0]][newCoords[1]] = [p_string, ""];
        this.setState({ "grid": newGrid });
    }

    movePhoneme(direction, phoneme) {
        let newGrid = this.state.grid.slice();
        let oldCoords = this.findAPhoneme(phoneme);
        let newCoords = this.movement(direction, oldCoords);
        if (this.state.grid[newCoords[0]][newCoords[1]][0].includes("pacman")) {
            return false;
        }
        if ((oldCoords[0] === newCoords[0] && oldCoords[1] === newCoords[1]) || this.state.grid[newCoords[0]][newCoords[1]][0] === "coin") {
            let random_direction = this.chooseADirectionAtRandom();
            this.props.setAPhonemeInMotion(phoneme, random_direction, this.props.pace, this.movePhoneme);
            return false;
        };
        let phonemeInfo = newGrid[oldCoords[0]][oldCoords[1]];
        newGrid[newCoords[0]][newCoords[1]] = phonemeInfo;
        newGrid[oldCoords[0]][oldCoords[1]] = ["", ""];
        this.setState({ "grid": newGrid });
    }

    eatAPhoneme(phoneme) {
        let sampa = phoneme[1]["sampa"];
        let index = this.props.phonemesOnTheBoard.findIndex(x => x[1]["sampa"] === sampa);
        this.props.wipeAPhonemeOut(index);
        if (this.props.checkIfPhonemeCurrent(phoneme[1])) {
            this.props.increaseScore();
            return true;
        } else {
            this.props.loseLife();
            return false;
        }
    }

    // Phoneme functions

    generate_random_position() {
        return [Math.floor(Math.random() * 20), Math.floor(Math.random() * 30)];
    }

    put_a_phoneme_on_the_board(phoneme) {
        let pos = this.generate_random_position();
        let pickedSquare = this.state.grid[pos[0]][pos[1]].slice();
        while (pickedSquare[0].includes("pacman") || pickedSquare[0].includes("coin")) {
            pos = this.generate_random_position();
            pickedSquare = this.state.grid[pos[0]][pos[1]].slice();
        }
        pickedSquare[0] = "coin";
        pickedSquare[1] = phoneme;
        let newGrid = this.state.grid.slice()
        newGrid[pos[0]][pos[1]] = pickedSquare;
        this.setState({ "grid": newGrid });
        this.props.addPhonemeToList(pickedSquare);
    }

    render() {
        const g = this.state.grid;
        const board = g.map((row, i) => {
            return (
                <tr key={"row_" + i}>
                    {row.map((col, j) => {
                        return (
                            <Square classname={g[i][j][0]} ipa={(this.props.useIpa ? g[i][j][1]["ipa"] : g[i][j][1]["sampa"]) || g[i][j][1]} key={i + "_" + j} />
                        )
                    }
                    )
                    }
                </tr>)
        });

        return (
            <div id="boardDiv">
                <table cellSpacing="0">
                    <tbody>
                        {board}
                    </tbody>
                </table>
            </div>
        )
    }
}