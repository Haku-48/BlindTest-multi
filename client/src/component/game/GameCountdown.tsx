interface GameCountdownProps {
    firstPhaseText : string
}

function GameCountdown({firstPhaseText} : GameCountdownProps) {
    return (
        <main className="gc-root">
            <div className="gc-text">
                {firstPhaseText}
            </div>
        </main>
    )
}

export default GameCountdown;