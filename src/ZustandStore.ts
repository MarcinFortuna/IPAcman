import create from 'zustand';
import {MistakeType, Phoneme, Question} from "./types/types";

type ipacmanStore = {
    gameOn: boolean
    toggleGameOn: () => void
    useIpa: boolean
    toggleUseIpa: () => void
    // phonemesOnTheBoard: Phoneme[]
    // setNewPhonemeList: (phonemeArr: Phoneme[]) => void
    currentlySearched: Question
    setCurrentlySearched: (searched: Question) => void
    score: number
    increaseScore: () => void
    life: number
    loseLife: () => void
    mistakes: MistakeType[]
    setMistakes: (mistakeArr: MistakeType[]) => void
}

export const useStore = (create<ipacmanStore>((set: (partial: (Partial<ipacmanStore> | ((state: ipacmanStore) => (Partial<ipacmanStore> | ipacmanStore)) | ipacmanStore), replace?: (boolean | undefined)) => void) => ({
    gameOn: false,
    toggleGameOn: () => set((state) => ({gameOn: !state.gameOn})),
    useIpa: true,
    toggleUseIpa: () => set((state) => ({useIpa: !state.useIpa})),
    currentlySearched: {question: "", classes: [""]},
    setCurrentlySearched: (searched: any) => set((state) => ({currentlySearched: searched})),
    score: 0,
    increaseScore: () => set((state) => ({score: state.score + 1})),
    life: 3,
    loseLife: () => set((state) => ({life: state.life - 1})),
    mistakes: [],
    setMistakes: (mistakeArr: MistakeType[]) => (set(() => ({mistakes: mistakeArr})))
})));

