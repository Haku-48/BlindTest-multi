import type { Guess, Round } from "../types";
import messages from '../assets/data/messages.json';

/* Format a second number in mm:ss */
function formatSecond(seconds : number) : string {
    const minutes = Math.floor(seconds/60);
    const sec = seconds%60;

    return `${minutes}:${String(sec).padStart(2,"0")}`
}

/* Answer point logic */
function answerLogic(isSubmitter : boolean, validAnswer : boolean, isReported : boolean) : number {
    if (isReported) {return 0}
    if (isSubmitter) {
        return validAnswer ? 0 : -1;
    } else {
        return validAnswer ? 1 : 0;
    }
}

/* Global logic */
function globalLogic(guess : Guess, round : Round, isReported : boolean) : number {
    const isSubmitter = guess.playerId === round.submitterId;
    return answerLogic(isSubmitter, guess.mainValid, isReported) + (round.bonusAnswer ? answerLogic(isSubmitter, guess.bonusValid, isReported) : 0);
}

/* Message extraction */
function randomMessage(category : keyof typeof messages) : string {
    const list = messages[category];
    return list[Math.floor(Math.random() * list.length)];
}

export default {
    formatSecond : formatSecond,
    answerLogic : answerLogic,
    globalLogic : globalLogic,
    randomMessage : randomMessage
}