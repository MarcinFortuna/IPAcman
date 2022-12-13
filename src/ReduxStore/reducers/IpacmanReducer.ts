import {createSlice} from '@reduxjs/toolkit'
import type {PayloadAction} from '@reduxjs/toolkit'

import {MistakeType, Question, SymbolScope} from "../../types/types";

export interface IpacmanStore {
    gameOn: boolean
    useIpa: boolean
    currentlySearched: Question
    score: number
    life: number
    mistakes: MistakeType[]
    pace: number
    symbolScope: SymbolScope
}

const initialState: IpacmanStore = {
    gameOn: false,
    useIpa: true,
    currentlySearched: {question: "", classes: []},
    score: 0,
    life: 3,
    mistakes: [],
    pace: 0,
    symbolScope: {
        selected: 'rp',
        rp: {
            consonants: true,
            vowels: true
        },
        fullIpa: {
            full_consonants_pulmonic: true,
            full_consonants_non_pulmonic: true,
            full_other_symbols: true,
            full_vowels: true,
            full_diacritics: false,
            full_suprasegmentals: false,
            full_tones_and_word_accents: false
        }
    }
}

export const ipacmanSlice = createSlice({
    name: 'ipacman',
    initialState,
    reducers: {
        toggleGameOn: (state) => {
            state.gameOn = !state.gameOn
        },
        toggleUseIpa: (state) => {
            state.useIpa = !state.useIpa
        },
        setCurrentlySearched: (state, action: PayloadAction<Question>) => {
            state.currentlySearched = action.payload
        },
        resetCurrentlySearched: (state) => {
            state.currentlySearched = {question: "", classes: []}
        },
        increaseScore: (state) => {
            state.score++
        },
        resetScore: (state) => {
            state.score = 0
        },
        loseLife: (state) => {
            state.life--
        },
        resetLife: (state) => {
            state.life = 3
        },
        addMistake: (state, action: PayloadAction<MistakeType>) => {
            state.mistakes.push(action.payload)
        },
        resetMistakes: (state) => {
            state.mistakes = []
        },
        setPace: (state, action: PayloadAction<number>) => {
            state.pace = action.payload
        },
        setSymbolScope: (state, action: PayloadAction<SymbolScope>) => {
            state.symbolScope = action.payload
        }
    }
});

export const {
    toggleGameOn,
    toggleUseIpa,
    setCurrentlySearched,
    resetCurrentlySearched,
    increaseScore,
    resetScore,
    loseLife,
    resetLife,
    addMistake,
    resetMistakes,
    setPace,
    setSymbolScope
} = ipacmanSlice.actions;

export default ipacmanSlice.reducer;