import { useEffect, useRef, useState } from "react";
import { useGameStore } from "../store/useGameStore";
import { socket } from "../socket/socket";
import { useNavigate, useParams } from "react-router-dom";
import HiddenPlayer from "../component/game/HiddenPlayer";
import GameCountdown from "../component/game/GameCountdown";
import GameRoundIntro from "../component/game/GameRoundIntro";
import GamePlaying from "../component/game/GamePlaying";
import GameEnded from "../component/game/GameEnded";
import "../style/game/Game.css";

function Game() {

    const store = useGameStore();
    const navigate = useNavigate();
    const params = useParams();

    const totalTime = (store.room?.settings?.guessTime ?? 0);

    // Les différents états : 'countdown' | 'roundIntro' | 'playing' | 'ended'
    const [phase, setPhase] = useState<string>('countdown');
    const [firstPhaseText, setFirstPhaseText] = useState<string>('');
    const [mainAnswer, setMainAnswer] = useState<string>('');
    const [bonusAnswer, setBonusAnswer] = useState<string>('');
    const [autoRestart, setAutoRestart] = useState<boolean>(true);
    const [randomMessageRound, setRandomMessageRound] = useState<string>('');
    const [randomMessageEnd, setRandomMessageEnd] = useState<string>('');
    const [timer, setTimer] = useState<number>(
        () => totalTime 
    );
    const [warning, setWarning] = useState<string>('');
    const [countDown, setCountDown] = useState<number>(1);
    const [error, setError] = useState<string>('');

    const playerRef = useRef<YT.Player | null>(null);
    const loopInterval = useRef<ReturnType<typeof setInterval>|null>(null);
    var interval : ReturnType<typeof setInterval>;
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);


    function startNextRound() {
        setPhase('roundIntro');
        // Changer le message random
        setMainAnswer('');
        setBonusAnswer('');
    }

    function callback(body : any) {
        if (!body.success) {
            setError(body.error);
        }
    }

    function submitAnswers() {
        socket.emit("submitGuess", store.room?.id, mainAnswer, bonusAnswer, callback);
    }

    function playClip() {
        const currentRound = store.room?.rounds[store.room?.currentRoundIndex];
        if (!playerRef.current || !currentRound) return;
        playerRef.current.seekTo(currentRound.startSec);
        playerRef.current.playVideo();
    
        if (loopInterval.current) clearInterval(loopInterval.current);
    
        loopInterval.current = setInterval(() => {
            const currentRound = store.room?.rounds[store.room?.currentRoundIndex];
            if (!currentRound || !playerRef.current) return;
            const currentTime = playerRef.current.getCurrentTime();
            if (currentTime >= (currentRound.endSec)) {
                playerRef.current.pauseVideo()
                if (autoRestart) {
                    playClip();
                }
            }
        }, 200);
    }

    function handleRoundEnded() {
        socket.on('roundEnded', () => {
            store.setRoom((prev) => ({...prev, currentRoundIndex : prev.currentRoundIndex+1}));
            startNextRound();
        })
    }

    function handleHostLeft() {
        socket.on('hostLeft', () => {
            setWarning("L'hôte est parti...");
            setCountDown(5);
            interval = setInterval(() => {
                setCountDown((prev) => prev - 1);
            }, 1000);
        })
    }

    function handleGameEnded() {
        socket.on('gameEnded', (room) => {
            store.setRoom((_) => ({...room}));
            setPhase('ended');
        })
    }

    useEffect(() => {
        if (countDown === 0 && warning) {
            setWarning("");
            setCountDown(1);
            store.reset();
            clearInterval(interval);
            navigate('/');
        }
    }, [countDown])

    useEffect(() => {
        if (!store.player) {
            if (params.roomId) {
                store.setRoomId(params.roomId);
            }
            navigate('/');
        }
        handleHostLeft();
        handleRoundEnded();
        handleGameEnded();

        return () => {
            socket.off('hostLeft');
            socket.off('roundEnded');
            socket.off('gameEnded');

            if (intervalRef.current) {clearInterval(intervalRef.current);};
        }
    }, [])

    useEffect(() => {
        if (phase === 'countdown') {
            setFirstPhaseText('3');
            setTimeout(() => {
                setFirstPhaseText('2');
            }, 1000);
            setTimeout(() => {
                setFirstPhaseText('1');
            }, 2000);
            setTimeout(() => {
                setFirstPhaseText('Partez');
            }, 3000);
            setTimeout(() => {
                setPhase('roundIntro');
            }, 4000);
        }
    }, [phase])

    useEffect(() => {
        if (phase === 'roundIntro') {
            setTimeout(() => {
                playerRef.current.pauseVideo();
                setPhase('playing');
                setTimer(totalTime);
                intervalRef.current = setInterval(() =>{
                    setTimer((prev) => prev - 1);
                }, 1000);
                playClip()
            }, 5000);
        }
    }, [phase])

    useEffect(() => {
        if (phase === 'ended') {
            setTimeout(() => {
                navigate(`/room/${store.room!.id}/correction`)
            }, 5000)
        }
    }, [phase])

    useEffect(() => {
        if (timer <= 0 && intervalRef.current) {
            submitAnswers();
            clearInterval(intervalRef.current);
        }
        const fill = document.querySelector('.gp-timer-fill') as HTMLElement;
        if (!fill) {return};
        const percentage = timer / totalTime;
        const hue = Math.round(percentage * 120);
        fill.style.backgroundColor = `hsl(${hue},80%, 60%)`;
    }, [timer])

    return (
        <div className="gm-root">
            <HiddenPlayer playerRef={playerRef}/>
            {phase === 'countdown' && (
                <GameCountdown firstPhaseText={firstPhaseText} />
            )}
            {phase === 'roundIntro' && (
                <GameRoundIntro currentRoundIndex={store.room!.currentRoundIndex} nbRounds={store.room!.rounds.length} randomMessage={randomMessageRound} />
            )}
            {phase === 'playing' && (
                <GamePlaying timer={timer} totalTime={totalTime}
                    mainAnswer={mainAnswer} setMainAnswer={setMainAnswer}
                    bonusAnswer={bonusAnswer} setBonusAnswer={setBonusAnswer}
                    autoRestart={autoRestart} setAutoRestart={setAutoRestart} 
                    playerRef={playerRef.current} playClip={playClip}
                />
            )}
            {phase === "ended" && (
                <GameEnded randomMessage={randomMessageEnd} />
            )}

            {error && (
                <div className="gm-error">
                    {error}
                </div>
            )}

            {warning && (
                <div className="gm-warning">
                    {warning}. Redirection dans {countDown}
                </div>
            )}
        </div>
    )
}

export default Game;