import YouTube, { type YouTubeEvent } from "react-youtube"
import { useGameStore } from "../../store/useGameStore"
import { useRef, useState } from "react";

interface HiddenPlayerProps {
    playerRef : YT.Player | null,
    autoRestart : boolean,
    setAutoRestart : (autoRestart : boolean) => void
}

function HiddenPlayer({playerRef, autoRestart, setAutoRestart} : HiddenPlayerProps) {

    const store = useGameStore();
    const round = store.room?.rounds[store.room?.currentRoundIndex];

    function onReady(event : YouTubeEvent) {
        if (!store.room) return;
        playerRef.current = event.target;
        event.target.setVolume(50);
        playClip();
    }

    const loopInterval = useRef<ReturnType<typeof setInterval>|null>(null);

    function playClip() {
        if (!playerRef.current || !round) return;
    
        playerRef.current.seekTo(round.startSec);
        playerRef.current.playVideo();
    
        if (loopInterval.current) clearInterval(loopInterval.current);
    
        loopInterval.current = setInterval(() => {
            const currentTime = playerRef.current.getCurrentTime();
            if (currentTime >= (round.endSec)) {
                playerRef.current.pauseVideo()
                restartClip();
            }
        }, 200);
    }
    
    function restartClip() {
        if (autoRestart) {
            playClip();
        }
    }

    return (
        <div className="hp-root">

            {round && (
                <YouTube 
                  className="hp-video-player"
                  videoId={round.videoId}
                  key={round.videoId}
                  onReady={onReady}
                  opts={{
                    height : "300",
                    width : "700",
                    playerVars : {
                        control : 0,
                        disablekb : 1,
                        playsinline : 1,
                        modestbranding : 1,
                        enablejsapi : 1
                    }
                  }}
                />
            )}

            <div className="hp-controller">
                <button 
                    className="hp-btn-restart"
                    onClick={playClip}
                >
                    Rejouer
                </button>

                <input 
                    type="checkbox"
                    className="hp-input-autoRestart"
                    onChange={(e) => setAutoRestart(e.target.checked)}>
                </input>
                <span className="hp-text-autoRestart">
                    Restart Automatique : {autoRestart ? "Activé" : "Désactivé"}
                </span>
            </div>
        </div>
    )
}

export default HiddenPlayer;