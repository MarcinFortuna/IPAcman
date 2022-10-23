import create from 'zustand';
import {State} from "zustand/ts3.4";

export const useStore = (create<State>((set: (partial: unknown, replace?: (boolean | undefined)) => void) => ({
    useIpa: true,
    toggleUseIpa: () => set((state) => ({useIpa: !state.useIpa}))
})));

