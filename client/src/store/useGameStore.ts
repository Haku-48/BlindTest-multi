import { create } from "zustand";
import type { Room, Player } from "../types";

/* The GameState to store */
type GameState = {
    room : Room | null,
    player : Player | null
    roomId : string,
    readyPlayers : string[],

    setRoom: (room : Room | ((prev : Room) => Room)) => void,
    setPlayer: (player : Player | ((prev : Player) => Player)) => void,
    setRoomId: (roomId : string) => void,
    setReadyPlayer: (readyPlayers : string[] | ((prev : string[]) => string[])) => void,

    reset : () => void
}

/* Game informations storage */
export const useGameStore = create<GameState>((set) => ({
    room: null,
    player : null,
    roomId: "",
    readyPlayers: [],

    setRoom: (room) => 
        set((state) => ({
            room : 
                typeof room === "function"
                    ? room(state.room as Room)
                    : room
        })),
    setPlayer: (player) =>
        set((state) => ({
            player : 
                typeof player === "function"
                    ? player(state.player as Player)
                    : player
        })),
    setRoomId: (roomId) => set({roomId}),
    setReadyPlayer : (readyPlayers) =>
        set((state) => ({
            readyPlayers :
                typeof readyPlayers === "function"
                    ? readyPlayers(state.readyPlayers as string[])
                    : readyPlayers
        })),
    
    reset: () => set({
        room: null,
        player: null,
        roomId: ""
    })
}))