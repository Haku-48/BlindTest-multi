import { Loader, ThumbsUp, User } from "lucide-react";
import { useGameStore } from "../../store/useGameStore"
import "../../style/correction/CorrectionPlayersList.css";

function CorrectionPlayersList() {

    const store = useGameStore();
    const round = store.room!.rounds[store.currentCorrectionRoundIndex];

    return (
        <main className="cpl-root">
            {store.room!.players.map((player, index) => {
                const guess = round.guesses[index];
                const allTrue = (round.bonusAnswer) ? (guess.mainValid && guess.bonusValid) : (guess.mainValid);
                const partialTrue = (round.bonusAnswer) && (guess.mainValid || guess.bonusValid);

                return (
                    <div className={`cpl-item ${allTrue ? "cpl-item-all" : (partialTrue ? "cpl-item-partial" : "cpl-item-none")}`} key={index}>
                        <div className={`cpl-item-inner ${allTrue ? "cpl-item-inner-all" : (partialTrue ? "cpl-item-inner-partial" : "cpl-item-inner-none")}`}>
                            <User />
                            <span className="cpl-item-pseudo">{player.pseudo}</span>
                            {store.currentCorrectionGuessIndex < index ? (
                                <Loader className="cpl-loader" />
                            ) : (
                                <ThumbsUp className={`cpl-thumb ${allTrue ? "cpl-thumb-all" : (partialTrue ? "cpl-thumb-partial" : "cpl-thumb-none")}`}/>
                            )}
                        </div>
                    </div>
                )
            })}
        </main>
    )
}

export default CorrectionPlayersList;