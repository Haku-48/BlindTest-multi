import "../../style/game/GameEnded.css";

interface GameEndedProps {
    randomMessage : string
}

function GameEnded({randomMessage} : GameEndedProps) {
    return (
        <main className="ge-root">
            <div className="ge-text">
                C'est terminé !
            </div>
            <div className="ge-randomsentence">
                {randomMessage}
            </div>
        </main>
    )
}

export default GameEnded;