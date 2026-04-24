import YouTube, { type YouTubeEvent } from "react-youtube"
import { useGameStore } from "../../store/useGameStore"

interface HiddenPlayerProps {
    playerRef : React.MutableRefObject<YT.Player | null>,
}

function HiddenPlayer({playerRef} : HiddenPlayerProps) {

    const store = useGameStore();
    const round = store.room?.rounds[store.room?.currentRoundIndex];

    function onReady(event : YouTubeEvent) {
        if (!store.room) return;
        playerRef.current = event.target;
        event.target.setVolume(50);
        setTimeout(() => {
            const currentRound = store.room?.rounds[store.room?.currentRoundIndex];
            if (currentRound) {
                event.target.seekTo(currentRound.startSec);
                event.target.pauseVideo();
            }
        }, 2000)
    }

    return (
        <div className="hp-root">

            {round && (
                <YouTube 
                  className="hp-video-player"
                  videoId={round.videoId}
                  key={round.videoId + store.room?.currentRoundIndex}
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
                        autoplay : 0
                    }
                  }}
                />
            )}
        </div>
    )
}

export default HiddenPlayer;