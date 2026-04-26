import { useGameStore } from "../../store/useGameStore";
import {socket} from '../../socket/socket';
import "../../style/correction/GuessReview.css";

interface GuessReviewProps {
    validAnswer : (isMain : boolean, isValid : boolean) => void
}

function GuessReview({validAnswer} : GuessReviewProps) {

    const store = useGameStore();
    const round = store.room!.rounds[store.currentCorrectionRoundIndex];
    const guess = round.guesses[store.currentCorrectionGuessIndex];
    const author = store.room!.players.filter(p => p.socketId === (round.submitterId))[0].pseudo;
    const guesser = store.room!.players.filter(p => p.socketId === (guess.playerId))[0].pseudo;

    return (
        <main className="gr-root">
            <div className="gr-infos">
                Si <span>{author}</span> n'a pas apporté une réponse correcte à son propre extrait, des points lui seront retirés (que ce soit pour la réponse principale ou le bonus) !
            </div>
            <div className="gr-author-answers">
                Réponses définies par <span>{author}</span>
                <div className="gr-mainAnswer">
                    <p>Réponse :</p>
                    <div className="gr-answerSlot">
                        {round.mainAnswer}
                    </div>
                </div>
                {round.bonusAnswer && (
                    <div className="gr-bonusAnswer">
                        <p>Bonus :</p>
                        <div className="gr-answerSlot">
                            {round.bonusAnswer}
                        </div>
                    </div>
                )}
            </div>
            <div className="gr-guesser-answers">
                Réponse définies par <span>{guesser}</span>
                <div className="gr-mainAnswer">
                    <p>Réponse :</p>
                    <div className="gr-answerSlot">
                        {guess.mainAnswer}
                    </div>
                    <div className={`gr-btn ${(store.room!.hostId == socket.id) && "gr-clickable"} ${guess.mainValid ? "gr-valid" : "gr-invalid"}`}
                        onClick={() => validAnswer(true,!guess.mainValid)}>
                            {guess.mainValid ? "Correct" : "Incorrect"}
                    </div>
                </div>
                {round.bonusAnswer && (
                    <div className="gr-bonusAnswer">
                        <p>Bonus :</p>
                        <div className="gr-answerSlot">
                            {guess.bonusAnswer}
                        </div>
                        <div className={`gr-btn ${(store.room!.hostId == socket.id) && "gr-clickable"} ${guess.bonusValid ? "gr-valid" : "gr-invalid"}`}
                            onClick={() => validAnswer(false,!guess.bonusValid)}>
                                {guess.bonusValid ? "Correct" : "Incorrect"}
                        </div>
                    </div>
                )}
            </div>
        </main>
    )
}

export default GuessReview;