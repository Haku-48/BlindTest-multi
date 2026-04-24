import "../../style/game/GameRoundIntro.css";

interface GameRoundIntroProps {
    currentRoundIndex : number,
    nbRounds : number,
    randomMessage : string
}

function GameRoundIntro({currentRoundIndex, nbRounds, randomMessage} : GameRoundIntroProps) {
    return (
        <main className="gri-root">
            <div className="gri-text">
                Round {currentRoundIndex+1}/{nbRounds}
            </div>
            <div className="gri-randomsentence">
                {randomMessage}
            </div>
        </main>
    )
}
export default GameRoundIntro;