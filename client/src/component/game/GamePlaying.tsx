import utilFunction from "../../util/utilFunction"
import VolumeBar from "../preparation/VolumeBar"
import "../../style/game/GamePlaying.css";
import { useGameStore } from "../../store/useGameStore";

interface GamePlayingProps {
    timer : number,
    totalTime : number,
    mainAnswer : string,
    setMainAnswer : (mainAnswer : string) => void,
    bonusAnswer : string,
    setBonusAnswer : (bonusAnswer : string) => void,
    autoRestart : boolean,
    setAutoRestart : (autoRestart : boolean) => void,
    playerRef : YT.Player | null,
    playClip : () => void
}

function GamePlaying({
    timer, totalTime, 
    mainAnswer, setMainAnswer,
    bonusAnswer, setBonusAnswer,
    autoRestart, setAutoRestart, playerRef,
    playClip
} : GamePlayingProps) {

    const store = useGameStore();

    return (
        <main className="gp-root">
            <div className="gp-timer">
                <div className="gp-timer-bar">
                    <div 
                        className="gp-timer-fill"
                        style={{width : `${(timer / totalTime) * 100}%`}}/>
                </div>
                <span className="gp-timer-value">{utilFunction.formatSecond(timer)}</span>    
            </div>

            <div className="gp-elem">
                <div className="gp-center">
                    <div className="gp-controller">
                        <button 
                            className="gp-btn-restart"
                            onClick={playClip}>
                            Rejouer l'extrait    
                        </button>
                        <input 
                            type="checkbox"
                            className="gp-input-autoRestart"
                            checked={autoRestart}
                            onChange={(e) => setAutoRestart(e.target.checked)}
                        />
                        <span className="gp-text-autoRestart">
                            Restart Automatique : {autoRestart ? "Activé" : "Désactivé"}
                        </span>
                    </div>

                    <div className="gp-input">
                        <span className="gp-answer-text">
                            Votre réponse :
                        </span>
                        <input 
                            type="text"
                            className="gp-answer-input"
                            value={mainAnswer}
                            onChange={(e) => {setMainAnswer(e.target.value)}}
                        />
                        <span className="gp-bonus-text">
                            {store.room?.rounds[store.room.currentRoundIndex].bonusAnswer ? (
                                <p>Réponse bonus (+1 point) :</p>
                            ) : (
                                <p>Pas de réponse bonus dans ce round</p>
                            )}
                        </span>
                        {store.room?.rounds[store.room.currentRoundIndex].bonusAnswer && (
                            <input 
                                type="text"
                                className="gp-bonus-input"
                                value={bonusAnswer}
                                onChange={(e) => {setBonusAnswer(e.target.value)}}
                            />
                        )}
                    </div>
                </div>
                
                <div className="gp-right">
                    <VolumeBar playerRef={playerRef} horizontal={false} />
                </div>

                <span className="gp-infos">
                    Vos réponses seront automatiquement soumises à la fin du round.
                </span>
            </div>
        </main>
    )
}

export default GamePlaying;