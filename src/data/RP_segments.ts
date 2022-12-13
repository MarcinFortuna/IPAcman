import { ConsonantPhonemeRP, VowelPhonemeRP } from "../types/types";

export const consonants: ConsonantPhonemeRP[] = [

    {
        sampa: "m",
        ipa: "m",
        place: "bilabial",
        manner: "nasal",
        category: "sonorant",
        voice: "voiced"
    },

    {
        sampa: "b",
        ipa: "b",
        place: "bilabial",
        manner: "plosive",
        category: "obstruent",
        voice: "voiced"
    },

    {
        sampa: "p",
        ipa: "p",
        place: "bilabial",
        manner: "plosive",
        category: "obstruent",
        voice: "voiceless"
    },

    {
        sampa: "v",
        ipa: "v",
        place: "labiodental",
        manner: "fricative",
        category: "obstruent",
        voice: "voiced"
    },

    {
        sampa: "f",
        ipa: "f",
        place: "labiodental",
        manner: "fricative",
        category: "obstruent",
        voice: "voiceless"
    },

    {
        sampa: "T",
        ipa: "θ",
        place: "dental",
        manner: "fricative",
        category: "obstruent",
        voice: "voiceless"
    },

    {
        sampa: "D",
        ipa: "ð",
        place: "dental",
        manner: "fricative",
        category: "obstruent",
        voice: "voiced"
    },

    {
        sampa: "n",
        ipa: "n",
        place: "alveolar",
        manner: "nasal",
        category: "sonorant",
        voice: "voiced"
    },

    {
        sampa: "d",
        ipa: "d",
        place: "alveolar",
        manner: "plosive",
        category: "obstruent",
        voice: "voiced"
    },

    {
        sampa: "t",
        ipa: "t",
        place: "alveolar",
        manner: "plosive",
        category: "obstruent",
        voice: "voiceless"
    },

    {
        sampa: "z",
        ipa: "z",
        place: "alveolar",
        manner: "fricative",
        category: "obstruent",
        voice: "voiced"
    },

    {
        sampa: "s",
        ipa: "s",
        place: "alveolar",
        manner: "fricative",
        category: "obstruent",
        voice: "voiceless"
    },

    {
        sampa: "l",
        ipa: "l",
        place: "alveolar",
        manner: "approximant",
        category: "sonorant",
        voice: "voiced"
    },

    {
        sampa: "r",
        ipa: "r",
        place: "postalveolar",
        manner: "approximant",
        category: "sonorant",
        voice: "voiced"
    },

    {
        sampa: "dZ",
        ipa: "dʒ",
        place: "palato-alveolar",
        manner: "affricate",
        category: "obstruent",
        voice: "voiced"
    },

    {
        sampa: "tS",
        ipa: "tʃ",
        place: "palato-alveolar",
        manner: "affricate",
        category: "obstruent",
        voice: "voiceless"
    },

    {
        sampa: "Z",
        ipa: "ʒ",
        place: "palato-alveolar",
        manner: "fricative",
        category: "obstruent",
        voice: "voiced"
    },

    {
        sampa: "S",
        ipa: "ʃ",
        place: "palato-alveolar",
        manner: "fricative",
        category: "obstruent",
        voice: "voiceless"
    },

    {
        sampa: "j",
        ipa: "j",
        place: "palatal",
        manner: "approximant",
        category: "sonorant",
        voice: "voiced"
    },

    {
        sampa: "N",
        ipa: "ŋ",
        place: "velar",
        manner: "nasal",
        category: "sonorant",
        voice: "voiced"
    },

    {
        sampa: "g",
        ipa: "g",
        place: "velar",
        manner: "plosive",
        category: "obstruent",
        voice: "voiced"
    },

    {
        sampa: "k",
        ipa: "k",
        place: "velar",
        manner: "plosive",
        category: "obstruent",
        voice: "voiceless"
    },

    {
        sampa: "w",
        ipa: "w",
        place: "labiovelar",
        manner: "approximant",
        category: "sonorant",
        voice: "voiced"
    },

    {
        sampa: "h",
        ipa: "h",
        place: "glottal",
        manner: "fricative",
        category: "obstruent",
        voice: "voiceless"
    }
];

export const vowels: VowelPhonemeRP[] = [

    {
        sampa: "I",
        ipa: "ɪ",
        height: "close",
        backness: "front",
        length: "short",
        tenseness: "lax",
        roundedness: "unrounded"
    },

    {
        sampa: "e",
        ipa: "e",
        height: "mid",
        backness: "front",
        length: "short",
        tenseness: "lax",
        roundedness: "unrounded"
    },

    {
        sampa: "{",
        ipa: "æ",
        height: "open",
        backness: "front",
        length: "short",
        tenseness: "lax",
        roundedness: "unrounded"
    },

    {
        sampa: "V",
        ipa: "ʌ",
        height: "open",
        backness: "central",
        length: "short",
        tenseness: "lax",
        roundedness: "unrounded"
    },

    {
        sampa: "@",
        ipa: "ə",
        height: "mid",
        backness: "central",
        length: "short",
        tenseness: "lax",
        roundedness: "unrounded"
    },

    {
        sampa: "U",
        ipa: "ʊ",
        height: "close",
        backness: "back",
        length: "short",
        tenseness: "lax",
        roundedness: "rounded"
    },

    {
        sampa: "Q",
        ipa: "ɒ",
        height: "open",
        backness: "back",
        length: "short",
        tenseness: "lax",
        roundedness: "rounded"
    },

    {
        sampa: "i:",
        ipa: "iː",
        height: "close",
        backness: "front",
        length: "long",
        tenseness: "tense",
        roundedness: "unrounded"
    },

    {
        sampa: "3:",
        ipa: "ɜː",
        height: "mid",
        backness: "central",
        length: "long",
        tenseness: "tense",
        roundedness: "unrounded"
    },

    {
        sampa: "u:",
        ipa: "uː",
        height: "close",
        backness: "back",
        length: "long",
        tenseness: "tense",
        roundedness: "rounded"
    },

    {
        sampa: "O:",
        ipa: "ɔː",
        height: "mid",
        backness: "back",
        length: "long",
        tenseness: "tense",
        roundedness: "rounded"
    },

    {
        sampa: "A:",
        ipa: "ɑː",
        height: "open",
        backness: "back",
        length: "long",
        tenseness: "tense",
        roundedness: "unrounded"
    },

    {
        sampa: "eI",
        ipa: "eɪ",
        type: "closing",
        length: "long"
    },

    {
        sampa: "OI",
        ipa: "ɔɪ",
        type: "closing",
        length: "long"
    },

    {
        sampa: "aI",
        ipa: "aɪ",
        type: "closing",
        length: "long"
    },

    {
        sampa: "@U",
        ipa: "əʊ",
        type: "closing",
        length: "long"
    },

    {
        sampa: "aU",
        ipa: "aʊ",
        type: "closing",
        length: "long"
    },

    {
        sampa: "e@",
        ipa: "eə",
        type: "centring",
        length: "long"
    },

    {
        sampa: "I@",
        ipa: "ɪə",
        type: "centring",
        length: "long"
    },

    {
        sampa: "U@",
        ipa: "ʊə",
        type: "centring",
        length: "long"
    }
];