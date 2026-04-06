import { create } from "zustand";
import type { Room } from "../types";

/* The GameState to store */
type GameState = {
    room : Room | null
    pseudo : string | null,

    setRoom: (room : Room | ((prev : Room) => Room)) => void,
    setPseudo: (pseudo: string) => void,
}

/* Game informations storage */
export const useGameStore = create<GameState>((set) => ({
    room: null,
    pseudo: null,

    setRoom: (room) => 
        set((state) => ({
            room : 
                typeof room === "function"
                    ? room(state.room as Room)
                    : room
        })),
    setPseudo: (pseudo) => set({pseudo}),
}))