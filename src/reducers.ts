import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface IntervalsState {
    intervals: {
        interval: any,
        sampa: string
    }[]
}

const initialState: IntervalsState = {
    intervals: [
        {
            interval: 0,
            sampa: ""
        },
        {
            interval: 0,
            sampa: ""
        },
        {
            interval: 0,
            sampa: ""
        },
        {
            interval: 0,
            sampa: ""
        },
        {
            interval: 0,
            sampa: ""
        },
        {
            interval: 0,
            sampa: ""
        }
    ]
}

export const intervalsSlice = createSlice({
    name: 'intervals',
    initialState,
    reducers: {
        setNewInterval: (state, action: PayloadAction<any>) => {
            state.intervals[action.payload.index] = {
                interval: action.payload.interval,
                sampa: action.payload.sampa
            }
        },
        resetInterval: (state, action: PayloadAction<any>) => {
            state.intervals[action.payload.index] = {interval: 0, sampa: ""}
        }
    },
})

// Action creators are generated for each case reducer function
export const { setNewInterval, resetInterval } = intervalsSlice.actions

export default intervalsSlice.reducer