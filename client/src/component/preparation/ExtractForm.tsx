import { useRef, useState } from "react";
import { useGameStore } from "../../store/useGameStore"
import type { Round } from "../../types"
import Youtube, { type YouTubeEvent} from 'react-youtube';
import IntervalSlider from "./IntervalSlider";
import utilFunction from "../../util/utilFunction";
import {socket} from '../../socket/socket';
import '../../style/preparation/ExtractForm.css';

interface ExtractFormProps {
    slotIndex : number,
    onSubmit : (round : Round) => void
}

function ExtractForm({slotIndex ,onSubmit} : ExtractFormProps) {
    
    let store = useGameStore();
    const [url, setUrl] = useState<string>("");
    const [videoId, setVideoId] = useState<string>();
    const [start, setStart] = useState<number>(0);
    const [duration, setDuration] = useState<number>(0);
    const [answer, setAnswer] = useState<string>("");
    const [bonus, setBonus] = useState<string>("");
    const [error, setError] = useState<string>("");

    const playerRef = useRef<YT.Player | null>(null);
    const end = start + (store.room?.settings?.videoInterval ?? 0);

    function extractVideoId(url : string) : string {
        const match = url.match(
            /(?:youtube\.com\/.*v=|youtu\.be\/)([^&?]+)/
        );
        return match ? match[1] : "";
    }

    function handleLoad() {
        const id = extractVideoId(url);
        if (id) {
            console.log(id);
            setVideoId(id);
        } else {
            setError("Erreur : Lien invalide !");
        }
    }

    function callback(body : any) {
        if (body.success) {
            onSubmit(body.round);
        } else {
            setError(body.error);
        }
    }

    function submit() {
        socket.emit('submitExtract', store.room!.id, videoId, start, end, answer, bonus, callback);
    }

    function onReady(event : YouTubeEvent) {
        playerRef.current = event.target;
        setDuration(event.target.getDuration());
        setStart(0);
    }
    
    return (
        <div className="ef-root">
            <span className="ef-title">
                Extrait n°{slotIndex+1}
            </span>
            <div className="ef-url-input">
                <input 
                    type="text"
                    placeholder="Colle un lien YouTube"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="ef-input"/>
                <button 
                    className="ef-btn"
                    onClick={handleLoad}
                    disabled={!url}>
                        Charger la vidéo
                </button>
            </div>
            {videoId && (
                <Youtube 
                  className="ef-video-player"
                  videoId={videoId}
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
            {videoId && (
                <div className="ef-interval">
                    <IntervalSlider start={start} duration={duration} videoInterval={store.room?.settings.videoInterval ?? 0} playerRef={playerRef.current} onChange={setStart} />
                    <div className="ef-interval-indications">
                        <span className="ef-interval start">
                            Début : {utilFunction.formatSecond(start)}
                        </span>
                        <span className="ef-interval-end">
                            Fin : {utilFunction.formatSecond(end)}
                        </span>
                    </div>
                </div>
            )}
            {videoId && (
                <div className="ef-inputs">
                    <p className="ef-answer-text">Réponse principale :</p>
                    <input 
                        type="text" 
                        className="ef-answer-input" 
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        maxLength={30}/>
                    <p className="ef-bonus-text">Réponse bonus (facultative) :</p>
                    <input 
                        type="text" 
                        className="ef-bonus-input" 
                        value={bonus}
                        onChange={(e) => setBonus(e.target.value)}
                        maxLength={30}/>
                </div>
            )}
            <button 
                className="ef-submit"
                disabled={!videoId || !answer}
                onClick={submit}>
                Soumettre l'extrait
            </button>
            <p className="ef-submit-warning">
                Attention, aprés avoir soumis votre extrait, vous ne pourrez plus le modifier.
            </p>
            {error && (
                <div className="ef-error">
                    {error}
                </div>
            )}
        </div>
    )
}

export default ExtractForm;