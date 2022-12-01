import {MistakeType} from "./types/types";
import {phonemes} from "./data/RP_segments";

export const movement = (direction: string, oldCoords: number[]) => {

    let newCoords: number[] = oldCoords.slice();

    if (direction === "left" && newCoords[1] !== 0) newCoords[1] -= 1;
    else if (direction === "right" && newCoords[1] !== 25) newCoords[1] += 1;
    else if (direction === "up" && newCoords[0] !== 0) newCoords[0] -= 1;
    else if (direction === "down" && newCoords[0] !== 17) newCoords[0] += 1;

    // The directions below are only for phonemes

    else if (direction === "up-left" && newCoords[1] !== 0 && newCoords[0] !== 0) {
        newCoords[1] -= 1;
        newCoords[0] -= 1;
    }
    else if (direction === "down-left" && newCoords[1] !== 0 && newCoords[0] !== 17) {
        newCoords[1] -= 1;
        newCoords[0] += 1;
    }
    else if (direction === "up-right" && newCoords[1] !== 25 && newCoords[0] !== 0) {
        newCoords[1] += 1;
        newCoords[0] -= 1;
    }
    else if (direction === "down-right" && newCoords[1] !== 25 && newCoords[0] !== 17) {
        newCoords[1] += 1;
        newCoords[0] += 1;
    }

    return newCoords;
}

const directions: string[] = ["up", "down", "left", "right", "up-left", "down-left", "up-right", "down-right"];

export const chooseADirectionAtRandom = () => directions[Math.floor(Math.random() * 8)];

export const generateRandomPosition = () => [Math.floor(Math.random() * 18), Math.floor(Math.random() * 26)];

export const checkDistance = (phonemeCoords: number[], pacmanCoords: number[]) => (Math.abs(phonemeCoords[0] - pacmanCoords[0]) < 3 || Math.abs(phonemeCoords[1] - pacmanCoords[1]) < 3);

export const getCorrectAnswers = (mistakes_arr: MistakeType[]) => {
  let mistakes: string[][] = [];
  for (let i = 0; i < mistakes_arr.length; i++) {
    let mistake: string[] = [];
    mistake.push(mistakes_arr[i]["guessedQuestion"]["question"]);
    mistake.push(mistakes_arr[i]["guessedPhoneme"]["ipa"]);
    let correct_answers: string[] = []
    for (let j = 0; j < phonemes.length; j++) {
      for (let prop in phonemes[j]) {
        // @ts-ignore
        if (mistakes_arr[i]["guessedQuestion"]["classes"].includes(phonemes[j][prop])) {
          correct_answers.push(phonemes[j]["ipa"]);
        }
      }
    }
    let correct_answers_str: string = [...new Set(correct_answers)].sort().join(", ");
    mistake.push(correct_answers_str);
    mistakes.push(mistake);
  }
  return mistakes;
}

export const paceMapping = {
    'still': 0,
    'slow': 800,
    'medium': 400,
    'fast': 200
}
