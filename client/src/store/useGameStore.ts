import { create } from "zustand";
import type { GameStatus } from "../types";

/* The GameState to store */
type GameState = {
    roomId : string | null,
    pseudo : string | null,
    status : GameStatus,

    setRoomCode: (roomId : string) => void,
    setPseudo: (pseudo: string) => void,
    setStatus: (status: GameStatus) => void
}

/* Game informations storage */
export const useGameStore = create<GameState>((set) => ({
    roomId: null,
    pseudo: null,
    status: "WAITING",

    setRoomCode: (roomId) => set({roomId}),
    setPseudo: (pseudo) => set({pseudo}),
    setStatus: (status) => set({status})
}))