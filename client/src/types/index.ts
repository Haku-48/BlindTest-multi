/* This file will contains all the types useful for the server and the client */

/* Room type */
interface Room {
    id : string,
    hostId : string,
    settings : [string],
    players : [Player],
    status : GameStatus,
    rounds : [Round]
}

/* Player type */
interface Player {
    id : string,
    pseudo : string,
    score : number,
    socketId : string
}

/* Round type */
interface Round {
    submitterId : string,
    videoId : string,
    startSec : number,
    endSec : number,
    guesses : [Guess],
    status : RoundStatus
}

/* Guess type */
type Guess = [Player, string];

/* GameStatus type */
type GameStatus = 'WAITING' | 'CHOOSING' | 'PLAYING' | 'CORRECTION' | 'END';

/* RoundStatus type */
type RoundStatus = 'GUESSING' | 'END'