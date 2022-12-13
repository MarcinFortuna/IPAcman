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
import {MistakeType, PhoneticSymbol, SymbolScope} from "./types/types";
import {useSelector} from "react-redux";
import {RootState} from "./ReduxStore/store";
import {useEffect} from "react";
import useStateRef from "react-usestateref";

export const useGetRandomPhonemeAndAnswers = () => {

    const symbolScope = useSelector((state: RootState) => state.ipacmanData.symbolScope);

    useEffect(() => {
        setPhonemeInv(calculateCurrentPhonemeInv(symbolScope));
    }, [symbolScope]);

    const [phonemeInv, setPhonemeInv, phonemeInvRef] = useStateRef<PhoneticSymbol[]>([]);

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
        if (currentPhonemeArr && currentPhonemeArr.filter(ph => Object.prototype.hasOwnProperty.call(ph,"type")).length >= 2) {
            inventoryToChooseFrom = inventoryToChooseFrom.filter(ph => !Object.prototype.hasOwnProperty.call(ph,"type"));
        }
        return inventoryToChooseFrom[Math.floor(Math.random() * inventoryToChooseFrom.length)];
    }

    const getCorrectAnswers = (mistakes_arr: MistakeType[]) => {
        const mistakes: string[][] = [];
        for (let i = 0; i < mistakes_arr.length; i++) {
            const mistake: string[] = [];
            mistake.push(mistakes_arr[i]["guessedQuestion"]["question"]);
            mistake.push(mistakes_arr[i]["guessedPhoneme"]["ipa"]);
            const correct_answers: string[] = []
            for (let j = 0; j < phonemeInv.length; j++) {
                for (const prop in phonemeInv[j]) {
                    if (mistakes_arr[i]["guessedQuestion"]["classes"].includes(phonemeInv[j][prop])) {
                        correct_answers.push(phonemeInv[j]["ipa"]);
                    }
                }
            }
            const correct_answers_str: string = [...new Set(correct_answers)].sort().join(", ");
            mistake.push(correct_answers_str);
            mistakes.push(mistake);
        }
        return mistakes;
    }

    return {getRandomPhoneme, getCorrectAnswers};
}