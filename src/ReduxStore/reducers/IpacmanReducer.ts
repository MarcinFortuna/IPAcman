import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

import {MistakeType, Question} from "../../types/types";

export interface IpacmanStore {
    gameOn: boolean
    useIpa: boolean
    currentlySearched: Question
    score: number
    life: number
    mistakes: MistakeType[]
}

const initialState: IpacmanStore = {
    gameOn: false,
    useIpa: true,
    currentlySearched: {question: "", classes: []},
    score: 0,
    life: 3,
    mistakes: []
}

export const ipacmanSlice = createSlice({
    name: 'ipacman',
    initialState,
    reducers: {
        toggleGameOn: (state) => {state.gameOn = !state.gameOn},
        toggleUseIpa: (state) => {state.useIpa = !state.useIpa},
        setCurrentlySearched: (state, action: PayloadAction<any>) => {state.currentlySearched = action.payload},
        increaseScore: (state) => {state.score++},
        loseLife: (state) => {state.life--},
        addMistake: (state, action: PayloadAction<any>) => {state.mistakes.push(action.payload)}
    }
});

export const { toggleGameOn, toggleUseIpa, setCurrentlySearched, increaseScore, loseLife, addMistake } = ipacmanSlice.actions;

export default ipacmanSlice.reducer;