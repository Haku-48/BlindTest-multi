import { useEffect, useRef, useState } from "react";
import '../../style/preparation/IntervalSlider.css';
import type YouTube from "react-youtube";

interface IntervalSliderProps {
    start : number,
    duration : number,
    videoInterval : number,
    playerRef : YT.Player | null,
    onChange : (start : number) => void
}

function IntervalSlider({start, duration, videoInterval, playerRef, onChange} : IntervalSliderProps) {

    const [playing, setPlaying] = useState<boolean>(false);
    const loopInterval = useRef<ReturnType<typeof setInterval>|null>(null);

    function playClip() {
        if (!playerRef) return;

        playerRef.seekTo(start);
        playerRef.playVideo();
        setPlaying(true);

        if (loopInterval.current) clearInterval(loopInterval.current);

        loopInterval.current = setInterval(() => {
            const currentTime = playerRef.getCurrentTime();
            if (currentTime >= (start + videoInterval)) {
                playerRef.seekTo(start);
            }
        }, 200);
    }

    function stopClip() {
        if (!playing || !playerRef) return;
        playerRef.pauseVideo();
        if (loopInterval.current) clearInterval(loopInterval.current);
        setPlaying(false);
    }

    useEffect(() => {
        return () => {
            if (loopInterval.current) {
                clearInterval(loopInterval.current);
            }
        }
    }, [])

    return (
        <div className="is-root">
            <div className="is-timeline">
                <div className="is-timeline-fill"
                    style={{
                        width: `${(videoInterval / duration) * 100}%`,
                        left : `${(start/duration) * 100}%`
                    }}/>
                <input 
                    type="range" 
                    className="is-timeline-input" 
                    min={0}
                    max={duration-videoInterval}
                    value={start}
                    onChange={(e) => {
                        onChange(Number(e.target.value));
                        if (loopInterval.current) clearInterval(loopInterval.current)}}/>
            </div>
            <div className="is-btns">
                <button 
                    className="is-btn is-start-btn"
                    onClick={playClip}>
                        Jouer l'extrait
                </button>
                <button 
                    className="is-btn is-stop-btn"
                    onClick={stopClip}>
                        Stopper l'extrait
                </button>
            </div>
        </div>
    )
}

export default IntervalSlider;