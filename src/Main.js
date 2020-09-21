import React from 'react';
import { Board } from './Board';
import { Modal } from './Modal';
import { Panel } from './Panel';
import { questions } from './RP_questions_API';
import { phonemes, consonants, vowels } from './RP_segments_API';

export class Main extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            gameOn: false,
            currentlySearched: [],
            phonemesOnTheBoard: [],
            score: 0,
            life: 3,
            mistakes: [],
            modalOpen: false
        }
    }

    async componentDidUpdate(prevProps, prevState) {
        if (prevState.life > 0 && this.state.life === 0) {
            await new Promise(r => setTimeout(r, 50));
            this.stopGame();
        }
        if (this.state.score > prevState.score || this.state.life < prevState.life) {
            await new Promise(r => setTimeout(r, 100));
            this.generate_random_question();
        }
    }

    generate_random_question() {
        let classes_of_phonemes_on_the_board = [];
        this.state.phonemesOnTheBoard.forEach(x => {
            if (x) {
                for (let prop in x[1]) {
                    classes_of_phonemes_on_the_board.push(x[1][prop]);
                }
            }
        });
        let index = Math.floor(Math.random() * questions.length);
        while (!classes_of_phonemes_on_the_board.some(
            x => questions[index]["classes"].indexOf(x) > -1
        )) {
            index = Math.floor(Math.random() * questions.length);
        }
        let currently_searched = questions[index];
        this.setState({ currentlySearched: currently_searched })
    }

    generate_random_phoneme(category) {
        let random_number;
        let random_phoneme;
        let get_random_phoneme = (category) => {
            if (category === "C") {
                random_number = Math.floor(Math.random() * consonants.length);
                random_phoneme = consonants[random_number];
            }
            if (category === "V") {
                random_number = Math.floor(Math.random() * vowels.length);
                random_phoneme = vowels[random_number];
            } else {
                random_number = Math.floor(Math.random() * phonemes.length);
                random_phoneme = phonemes[random_number];
            }
        }
        get_random_phoneme(category);
        // Due to few questions which eliminate diphthongs and many diphthongs in the inventory,
        // there sometimes arises huge surplus of diphthongs on the board.
        // This is why there is an artificial restriction limiting the number of diphthongs to 2 at the same time.
        let diphthong_count = 0;
        for (let i = 0; i < this.state.phonemesOnTheBoard.length; i++) {
            if (this.state.phonemesOnTheBoard[i] && this.state.phonemesOnTheBoard[i][1].hasOwnProperty("type")) diphthong_count++;
        }

        while (this.state.phonemesOnTheBoard.some(x => x && x[1]["ipa"] === random_phoneme["ipa"]) || (diphthong_count >= 2 && random_phoneme.hasOwnProperty("type"))) {
            get_random_phoneme(category);
        }
        return random_phoneme;
    }

    addPhonemeToList(phonemeInfo) {
        let oldList = this.state.phonemesOnTheBoard.slice();
        if (oldList.length > 5) {
            let null_index = oldList.findIndex(x => x === null);
            oldList[null_index] = phonemeInfo;
            this.setState({phonemesOnTheBoard: oldList})
        } else {
            this.setState({
                phonemesOnTheBoard: oldList.concat([phonemeInfo])
            })
        }
    }

    wipeAPhonemeOut(index) {
        let oldList = this.state.phonemesOnTheBoard.slice();
        oldList[index] = null;
        this.setState({ phonemesOnTheBoard: oldList })
    }

    checkIfPhonemeCurrent(phoneme) {
        let phoneme_classes = [];
        for (let prop in phoneme) {
            phoneme_classes.push(phoneme[prop]);
        }
        let result = this.state.currentlySearched.classes.some(x => phoneme_classes.includes(x));
        if (!result) {
            let mistake = [[phoneme, this.state.currentlySearched]];
            this.setState({ mistakes: this.state.mistakes.concat(mistake) })
        }
        return result;
    }

    increaseScore() {
        this.setState({
            score: this.state.score + 1
        })
    }

    loseLife() {
        this.setState({
            life: this.state.life - 1
        })
    }

    async startGame() {
        await this.setState({
            gameOn: true,
        });
        this.generate_random_question();
    }

    resetGame() {
        this.setState({
            currentlySearched: [],
            phonemesOnTheBoard: [],
            score: 0,
            life: 3,
            mistakes: []
        });
    }

    async stopGame() {
        console.log("stopping game");
        this.setState({
            gameOn: false
        })
        await new Promise(r => setTimeout(r, 1000));
        this.setState({
            modalOpen: true
        })
    }

    closeModal() {
        this.setState({
            modalOpen: false
        })
        this.resetGame();
    }

    render() {
        return (<div id="main">
            <Board gameOn={this.state.gameOn} generate_random_question={this.generate_random_question.bind(this)} addPhonemeToList={this.addPhonemeToList.bind(this)} wipeAPhonemeOut={this.wipeAPhonemeOut.bind(this)} phonemesOnTheBoard={this.state.phonemesOnTheBoard} checkIfPhonemeCurrent={this.checkIfPhonemeCurrent.bind(this)} increaseScore={this.increaseScore.bind(this)} loseLife={this.loseLife.bind(this)} generate_random_phoneme={this.generate_random_phoneme.bind(this)} />
            <Panel startGame={this.startGame.bind(this)} stopGame={this.stopGame.bind(this)} gameOn={this.state.gameOn} currentlySearched={this.state.currentlySearched} score={this.state.score} life={this.state.life} mistakes={this.state.mistakes} />
            <Modal open={this.state.modalOpen} mistakes={this.state.mistakes} closeModal={this.closeModal.bind(this)} score={this.state.score} />
        </div>)
    }

}

