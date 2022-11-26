export const movement = (direction, oldCoords) => {

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

const directions = ["up", "down", "left", "right", "up-left", "down-left", "up-right", "down-right"];

export const chooseADirectionAtRandom = () => directions[Math.floor(Math.random() * 8)];

export const generateRandomPosition = () => [Math.floor(Math.random() * 18), Math.floor(Math.random() * 26)];

export const checkDistance = (phonemeCoords: number[], pacmanCoords: number[]) => (Math.abs(phonemeCoords[0] - pacmanCoords[0]) < 3 || Math.abs(phonemeCoords[1] - pacmanCoords[1]) < 3)