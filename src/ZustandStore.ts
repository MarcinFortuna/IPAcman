import create from 'zustand';
import {Phoneme} from "./types/types";

export const useStore = (create<unknown>((set: (partial: unknown, replace?: (boolean | undefined)) => void) => ({
    gameOn: false,
    toggleGameOn: () => set((state) => ({gameOn: !state.gameOn})),
    useIpa: true,
    toggleUseIpa: () => set((state) => ({useIpa: !state.useIpa})),
    phonemesOnTheBoard: [],
    setNewPhonemeList: (phonemeArr: Phoneme[]) => set((state) => ({phonemesOnTheBoard: phonemeArr})),
    addPhonemeToTheList: (phoneme: any) => set((state) => ({phonemesOnTheBoard: state.phonemesOnTheBoard.concat(phoneme)})),
    removePhonemeFromTheList: (index: number) => set((state) => ({phonemesOnTheBoard: state.phonemesOnTheBoard.filter((el, i) => index !== i)})),
    currentlySearched: {question: "", classes: [""]},
    setCurrentlySearched: (searched: any) => set((state) => ({currentlySearched: searched}))
})));

