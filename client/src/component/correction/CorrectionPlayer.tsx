import type { YouTubeEvent } from "react-youtube";
import { useGameStore } from "../../store/useGameStore";
import YouTube from "react-youtube";
import utilFunction from "../../util/utilFunction";
import "../../style/correction/CorrectionPlayer.css";

interface CorrectionPlayerProps {
    playerRef : React.MutableRefObject<YT.Player | null>,
    setReady : (ready : boolean) => void
}

function CorrectionPlayer({playerRef, setReady} : CorrectionPlayerProps) {

    const store = useGameStore();
    const round = store.room!.rounds[store.currentCorrectionRoundIndex];
    const author = store.room!.players.filter(p => p.socketId === (round.submitterId))[0].pseudo;

    function onReady(event : YouTubeEvent) {
        if (!store.room) return;
        playerRef.current = event.target;
        event.target.setVolume(50);
        setTimeout(() => {
            const currentRound = store.room?.rounds[store.currentCorrectionRoundIndex];
            if (currentRound) {
                event.target.seekTo(currentRound.startSec);
                event.target.playVideo();
                setReady(true);
            }
        }, 500)
    }

    function getToExtractStart() {
        if (!playerRef.current) return;
        playerRef.current.seekTo(store.room!.rounds[store.currentCorrectionRoundIndex].startSec);
    }

    return (
        <div className="cp-root">
            {round && (
                <YouTube 
                    className="cp-video-player"
                    videoId={round.videoId}
                    key={round.videoId + store.currentCorrectionRoundIndex}
                    onReady={onReady}
                    opts={{
                    height : "300",
                    width : "700",
                    playerVars : {
                        control : 0,
                        disablekb : 1,
                        playsinline : 1,
                        modestbranding : 1,
                        enablejsapi : 1,
                        autoplay : 0,
                    }
                  }}
                />
            )}
            <div className="cp-extract-times">
                Extrait : {utilFunction.formatSecond(round.startSec)}~{utilFunction.formatSecond(round.endSec)}
            </div>
            <button 
                className="cp-btn"
                onClick={getToExtractStart}>
                    Jouer l'extrait choisi par {author}
            </button>
        </div>
    )
}

export default CorrectionPlayer;

