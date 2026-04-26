import { useGameStore } from "../../store/useGameStore";
import SummaryItem from "./SummaryItem";
import "../../style/results/Summary.css"

function Summary() {

    const store = useGameStore();

    return (
        <div className="sum-root">
            {store.room!.rounds.map((round, index) => {
                const guess = round.guesses.find((guess) => guess.playerId === store.player?.socketId);
                return (
                    guess && <SummaryItem guess={guess} round={round} index={index} key={index}/>
                )
            })}
        </div>
    )

}

export default Summary;