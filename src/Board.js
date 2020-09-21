import React from 'react';
import { Square } from './Square';

export class Board extends React.Component {

    constructor(props) {
        super(props);
        let grid = Array(20).fill().map(x => Array(30).fill().map(y => Array(3).fill("")))
        grid[0][0] = ["pacman right", "", ""];
        this.state = {
            'grid': grid
        };
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.movePacman = this.movePacman.bind(this);
        this.put_a_phoneme_on_the_board = this.put_a_phoneme_on_the_board.bind(this);
        this.generate_random_position = this.generate_random_position.bind(this);
    }

    // add event listeners

    componentDidMount() {
        window.addEventListener("keydown", this.handleKeyDown);
    }

    componentWillUnmount() {
        window.removeEventListener("keydown", this.handleKeyDown);
    }

    async componentDidUpdate(prevProps, prevState) {
        
        if (!prevProps.gameOn && this.props.gameOn) {
            for (let i = 0; i < 6; i++) {
                this.put_a_phoneme_on_the_board(this.props.generate_random_phoneme("any"));
                await new Promise(r => setTimeout(r, 100));
            }
        }
        if (prevProps.gameOn && !this.props.gameOn) {
            let grid = Array(20).fill().map(x => Array(30).fill().map(y => Array(3).fill("")))
            grid[0][0] = ["pacman right", "", ""];
            this.setState({
                'grid': grid
            });    

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

    movePacman(direction) {
        let newGrid = this.state.grid.slice();
        let oldCoords = this.findPacman();
        let newCoords = oldCoords.slice();
        let p_string;
        if (direction === "left") {
            if (newCoords[1] !== 0) newCoords[1] -= 1;
            p_string = "pacman left";
        }
        if (direction === "right") {
            if (newCoords[1] !== 29) newCoords[1] += 1;
            p_string = "pacman right";
        }
        if (direction === "up") {
            if (newCoords[0] !== 0) newCoords[0] -= 1;
            p_string = "pacman up";
        }
        if (direction === "down") {
            if (newCoords[0] !== 19) newCoords[0] += 1;
            p_string = "pacman down";
        }
        if (newGrid[newCoords[0]][newCoords[1]][0] === "coin") {
            if (this.eatAPhoneme(newGrid[newCoords[0]][newCoords[1]])) {
                p_string += " success";
            } else {
                p_string += " failure";
            }
            this.put_a_phoneme_on_the_board(this.props.generate_random_phoneme("any"));
        }
        newGrid[oldCoords[0]][oldCoords[1]] = ["", "", ""];
        newGrid[newCoords[0]][newCoords[1]] = [p_string, "", ""];
        this.setState({ "grid": newGrid });
    }

    eatAPhoneme(phoneme) {
        this.props.wipeAPhonemeOut(phoneme[2]);
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
        let index = Number(this.props.numberOfPhonemes);
        pickedSquare[0] = "coin";
        pickedSquare[1] = phoneme;
        pickedSquare[2] = index;
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
                            <Square classname={g[i][j][0]} ipa={g[i][j][1]["ipa"] || g[i][j][1]} key={i + "_" + j} />
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