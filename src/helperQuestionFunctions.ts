import {consonants, vowels} from "./data/RP_segments";
import {
    full_consonants_pulmonic,
    full_consonants_non_pulmonic,
    full_other_symbols,
    full_vowels,
    full_diacritics,
    full_suprasegmentals,
    full_tones_and_word_accents
} from "./data/full_IPA_segments";
import {MistakeType, ParsedMistakeType, PhoneticSymbol, SymbolScope} from "./types/types";
import {useSelector} from "react-redux";
import {RootState} from "./ReduxStore/store";
import {useEffect} from "react";
import useStateRef from "react-usestateref";

export const useGetRandomPhonemeAndAnswers = () => {

    const symbolScope = useSelector((state: RootState) => state.ipacmanData.symbolScope);

    const [phonemeInv, setPhonemeInv, phonemeInvRef] = useStateRef<PhoneticSymbol[]>([]);
    const [currentMode, setCurrentMode, currentModeRef] = useStateRef<string>("");

    useEffect(() => {
        setPhonemeInv(calculateCurrentPhonemeInv(symbolScope));
        setCurrentMode(symbolScope.selected);
    }, [symbolScope]);

    const calculateCurrentPhonemeInv = (symbolScope: SymbolScope) => {
        let phonemeInventory: PhoneticSymbol[] = [];
        if (symbolScope.selected === "rp") {
            if (symbolScope.rp.consonants) phonemeInventory = phonemeInventory.concat(consonants);
            if (symbolScope.rp.vowels) phonemeInventory = phonemeInventory.concat(vowels);
        } else if (symbolScope.selected === 'fullIpa') {
            if (symbolScope.fullIpa.full_consonants_pulmonic) phonemeInventory = phonemeInventory.concat(full_consonants_pulmonic);
            if (symbolScope.fullIpa.full_consonants_non_pulmonic) phonemeInventory = phonemeInventory.concat(full_consonants_non_pulmonic);
            if (symbolScope.fullIpa.full_other_symbols) phonemeInventory = phonemeInventory.concat(full_other_symbols);
            if (symbolScope.fullIpa.full_vowels) phonemeInventory = phonemeInventory.concat(full_vowels);
            if (symbolScope.fullIpa.full_diacritics) phonemeInventory = phonemeInventory.concat(full_diacritics);
            if (symbolScope.fullIpa.full_suprasegmentals) phonemeInventory = phonemeInventory.concat(full_suprasegmentals);
            if (symbolScope.fullIpa.full_tones_and_word_accents) phonemeInventory = phonemeInventory.concat(full_tones_and_word_accents);
        }
        return phonemeInventory;
    }

    const getRandomPhoneme = (currentPhonemeArr?: PhoneticSymbol[]) => {
        let inventoryToChooseFrom = phonemeInvRef.current;
        // Avoid duplicates
        if (currentPhonemeArr) inventoryToChooseFrom = inventoryToChooseFrom.filter(ph => !currentPhonemeArr.includes(ph));
        // Due to few questions which eliminate diphthongs and many diphthongs in the inventory,
        // there sometimes arises huge surplus of diphthongs on the board in the RP mode.
        // This is why there is an artificial restriction limiting the number of diphthongs to 2 at the same time.
        if (currentPhonemeArr && currentPhonemeArr.filter(ph => Object.prototype.hasOwnProperty.call(ph, "type")).length >= 2) {
            inventoryToChooseFrom = inventoryToChooseFrom.filter(ph => !Object.prototype.hasOwnProperty.call(ph, "type"));
        }
        return inventoryToChooseFrom[Math.floor(Math.random() * inventoryToChooseFrom.length)];
    }

    const getCorrectAnswers = (mistake: MistakeType, historicalMode?: string) => {

        let inventoryToCheck;

        if (!historicalMode) {
            inventoryToCheck = phonemeInvRef.current;
        } else if (historicalMode === 'rp') {
            inventoryToCheck = [...consonants, ...vowels];
        } else if (historicalMode === 'fullIpa') {
            inventoryToCheck = [...full_consonants_pulmonic, ...full_consonants_non_pulmonic, ...full_vowels, ...full_diacritics, ...full_suprasegmentals, ...full_other_symbols, ...full_tones_and_word_accents];
        } else {
            console.error("Unable to determine the inventory to check!");
        }

        const correct_answers: PhoneticSymbol[] = [];
        for (let j = 0; j < inventoryToCheck.length; j++) {
            for (const prop in inventoryToCheck[j]) {
                if (mistake["guessedQuestion"]["classes"].includes(inventoryToCheck[j][prop])) {
                    correct_answers.push(inventoryToCheck[j]);
                }
            }
        }
        const parsedMistake: ParsedMistakeType = {
            guessedQuestion: mistake["guessedQuestion"]["question"],
            guessedPhoneme: mistake["guessedPhoneme"],
            correctAnswers: correct_answers.filter((el: PhoneticSymbol, i: number) => correct_answers.indexOf(el) === i),
            mode: currentModeRef.current
        }
        return parsedMistake;
    }

    return {getRandomPhoneme, getCorrectAnswers};
}