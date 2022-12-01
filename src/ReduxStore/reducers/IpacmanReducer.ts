import {createSlice} from '@reduxjs/toolkit'
import type {PayloadAction} from '@reduxjs/toolkit'

import {MistakeType, Question} from "../../types/types";

export interface IpacmanStore {
    gameOn: boolean
    useIpa: boolean
    currentlySearched: Question
    score: number
    life: number
    mistakes: MistakeType[]
    pace: number
}

const initialState: IpacmanStore = {
    gameOn: false,
    useIpa: true,
    currentlySearched: {question: "", classes: []},
    score: 0,
    life: 3,
    mistakes: [],
    pace: 0
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
        setCurrentlySearched: (state, action: PayloadAction<any>) => {
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
        addMistake: (state, action: PayloadAction<any>) => {
            state.mistakes.push(action.payload)
        },
        resetMistakes: (state) => {
            state.mistakes = []
        },
        setPace: (state, action: PayloadAction<any>) => {
            state.pace = action.payload
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
    setPace
} = ipacmanSlice.actions;

export default ipacmanSlice.reducer;