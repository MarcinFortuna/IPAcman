import {
    ConsonantPhonemeRP,
    LeaderboardItem,
    MistakeType,
    ParsedMistakeType,
    PhoneticSymbol,
    ResultsDBResponse,
    SingleDBResponse
} from "./types/types";

export const movement = (direction: string, oldCoords: number[]) => {

    const newCoords: number[] = oldCoords.slice();

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

const timestampToHumanDate = (timestamp: string) => {
    const datetime: Date = new Date(Math.floor(Number(timestamp) / 1000) * 1000);
    const datetime_human: string = datetime.toLocaleString("en-GB");
    return datetime_human.substring(0, datetime_human.length - 3);
}

const modeMapping = {
    'rp': "Cons. RP",
    'fullIpa': "Full IPA"
}

// INFO: getCorrectAnswers cannot be extracted and referred to in a helper function since it's provided by
// a hook which can be referenced only in a functional React component (hence the solution a with callback)
export const parseDBResultsResponse = (data: ResultsDBResponse, output: "L" | "P", callback?: (mistake: MistakeType, historicalMode?: string) => ParsedMistakeType) => {

    const all_results: SingleDBResponse[] = Object.values(data);

    if (output === "L") {
        return all_results
            .map((result: SingleDBResponse) => {
                return {
                    name: result.username,
                    displayName: result.displayName,
                    affiliation: result.affiliation,
                    score: result.score,
                    datetime: timestampToHumanDate(result.timestamp),
                    mode: result.mode ? modeMapping[result.mode] : "Cons. RP",
                    pace: result.pace === 0 ? 'Still' : result.pace === 800 ? 'Slow' : result.pace === 400 ? 'Medium' : 'Fast'
                }
            })
            .sort((a: LeaderboardItem, b: LeaderboardItem) => a.score > b.score ? -1 : 1);
    } else if (output === "P") {
        return all_results.map((result: SingleDBResponse) => {
            const mode: string = result.mode ? modeMapping[result.mode] : "Cons. RP";
            const results: ParsedMistakeType[]|MistakeType[] = result.mistakes && 'correctAnswers' in result.mistakes[0]
                ? result.mistakes
                : (result.mistakes && callback)
                    ? result.mistakes.map(el => callback(el, result.mode ? result.mode : "rp"))
                    : []
            return {
                datetime: timestampToHumanDate(result.timestamp),
                results: results,
                score: result.score,
                mode: mode
            }
        });
    } else {
        console.error("Output type invalid!");
    }
}

export const calculateLabel = (symbol: PhoneticSymbol) => {
    if ('value' in symbol) {
        return symbol.value;
    } else if ('type' in symbol) {
        return `${symbol.type} diphthong`;
    } else if ('place' in symbol && 'manner' in symbol && ('voicing' in symbol || 'voice' in symbol)) {
        return `${symbol.voicing ? symbol.voicing : (symbol as ConsonantPhonemeRP).voice} ${symbol.place} ${symbol.manner}`;
    } else if ('backness' in symbol && 'height' in symbol && 'roundedness' in symbol) {
        return `${symbol.height} ${symbol.backness} ${symbol.roundedness} vowel`
    } else {
        console.error("Impossible to calculate label!", symbol);
    }
}

export const paceMapping = {
    'still': 0,
    'slow': 800,
    'medium': 400,
    'fast': 200
}
