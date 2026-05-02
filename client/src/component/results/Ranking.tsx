import type { Player } from "../../types";
import "../../style/results/Ranking.css";

interface RankingProps {
    liste : Player[],
    revealedCount : number
}

function Ranking({liste, revealedCount} : RankingProps) {

    let currentRank = liste.length;

    return (
        <div className="rank-root">
            {liste.map((player, index) => {
                if (index === 0) {
                    currentRank = liste.length
                } else if (liste[index-1].score !== player.score) {
                    currentRank = liste.length - index;
                }
                return (
                    <div key={index} className={`rank-item ${index < revealedCount && "rank-visible"} ${currentRank === 1 ? "rank-gold" : (currentRank === 2 ? "rank-silver" : (currentRank === 3 ? "rank-bronze" : "rank-normal" ))}`}>
                        <span className="rank-pseudo">{player.pseudo}</span>
                        <span className="rank-score">{player.score}</span>
                    </div>
                )
            })}
        </div>
    )
}

export default Ranking;