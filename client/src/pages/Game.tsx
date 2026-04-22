import { useEffect, useRef, useState } from "react";
import { useGameStore } from "../store/useGameStore";
import { socket } from "../socket/socket";
import { useNavigate, useParams } from "react-router-dom";
import HiddenPlayer from "../component/game/HiddenPlayer";

function Game() {

    const store = useGameStore();
    const navigate = useNavigate();
    const params = useParams();

    // Les différents états : 'countdown' | 'roundIntro' | 'playing' | 'ended'
    const [phase, setPhase] = useState<string>('countdown');
    const [firstPhaseText, setFirstPhaseText] = useState<string>('');
    const [mainAnswer, setMainAnswer] = useState<string>('');
    const [bonusAnswer, setBonusAnswer] = useState<string>('');
    const [autoRestart, setAutoRestart] = useState<boolean>(false);
    const [randomMessageRound, setRandomMessageRound] = useState<string>('');
    const [randomMessageEnd, setRandomMessageEnd] = useState<string>('');
    const [warning, setWarning] = useState<string>('');
    const [countDown, setCountDown] = useState<number>(1);
    const [error, setError] = useState<string>('');

    const playerRef = useRef<YT.Player | null>(null);
    var interval : ReturnType<typeof setInterval>;

    function startNextRound() {
        setPhase('roundIntro');
        // Suite
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

        return () => {
            socket.off('hostLeft');
            socket.off('roundEnded');
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
                setPhase('playing');
            }, 3000);
        }
    }, [phase])

    useEffect(() => {
        if (phase === 'ended') {
            setTimeout(() => {
                navigate(`/room/${store.room!.id}/correction`)
            }, 5000)
        }
    }, [phase])

    return (
        <div className="gm-root">
            {phase === 'countdown' && (
                <div className="gm-countdown-root">
                    <div className="gm-countdown-text">
                        {firstPhaseText}
                    </div>
                </div>
            )}
            {phase === 'roundIntro' && (
                <div className="gm-roundintro-root">

                </div>
            )}
            {phase === 'playing' && (
                <div className="gm-playing-root">
                    <div className="gm-playing-timer">

                    </div>
                    <HiddenPlayer playerRef={playerRef} autoRestart={autoRestart} setAutoRestart={setAutoRestart} />
                </div>
            )}
        </div>
    )
}

export default Game;