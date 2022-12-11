import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

type IntervalAction = {
    interval: number | NodeJS.Timeout,
    sampa: string,
    index: number
}

export interface IntervalsState {
    intervals: {
        interval: number | NodeJS.Timeout,
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
        setNewInterval: (state, action: PayloadAction<IntervalAction>) => {
            state.intervals[action.payload.index] = {
                interval: action.payload.interval,
                sampa: action.payload.sampa
            };
        },
        resetInterval: (state, action: PayloadAction<{index: number}>) => {
            state.intervals[action.payload.index] = {interval: 0, sampa: ""};
        },
        resetAllIntervals: (state) => {
            state.intervals = initialState.intervals;
        }
    },
});

// Action creators are generated for each case reducer function
export const { setNewInterval, resetInterval, resetAllIntervals } = intervalsSlice.actions;

export default intervalsSlice.reducer;