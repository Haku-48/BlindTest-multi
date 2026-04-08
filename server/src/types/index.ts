/* This file will contains all the types useful for the server and the client */

/* Room type */
export interface Room {
    id : string,
    hostId : string,
    settings : string[],
    players : Player[],
    status : GameStatus,
    rounds : Round[] | null
}

/* Player type */
export interface Player {
    pseudo : string,
    score : number,
    socketId : string
}

/* Round type */
export interface Round {
    submitterId : string,
    videoId : string,
    startSec : number,
    endSec : number,
    guesses : Guess[],
    status : RoundStatus
}

/* Guess type */
export type Guess = [Player, string];

/* GameStatus type */
export type GameStatus = 'WAITING' | 'CHOOSING' | 'PLAYING' | 'CORRECTION' | 'END';

/* RoundStatus type */
export type RoundStatus = 'GUESSING' | 'END'

/* The request responses */
export interface RequestResponse {
    room : Room,
    player : Player
}