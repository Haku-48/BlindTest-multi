import { useEffect, useRef, useState } from "react";
import { useGameStore } from "../store/useGameStore";
import type { Player, Round } from "../types";
import {socket} from '../socket/socket';
import { useNavigate, useParams } from "react-router-dom";
import ExtractForm from "../component/preparation/ExtractForm";
import {BadgeCheck, Loader, Lock} from 'lucide-react';
import utilFunction from "../util/utilFunction";
import '../style/preparation/Preparation.css';
import ReadyPlayersList from "../component/preparation/ReadyPlayersList";

function Preparation() {
    
    const store = useGameStore();
    const navigate = useNavigate();
    const params = useParams();

    const totalTime = (store.room?.settings?.nbRound ?? 0) * 60 * 3;

    const [ready, setReady] = useState<boolean>(false);
    const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
    const [submission, setSubmission] = useState<Round[]>([]);
    const [timer, setTimer] = useState<number>(
        () => totalTime 
    );
    const [warning, setWarning] = useState<string>('');
    const [countDown, setCountDown] = useState<number>(1);
    const [error, setError] = useState<string>("");

    var interval : ReturnType<typeof setInterval>;

    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    function onSubmit(round : Round) {
        setSubmission((prev) => ([...prev, round]));
        setSelectedSlot(null);
    }

    function callback(body : any) {
        if (!body.success) {
            setError(body.error);
        } else {
            setReady(true);
        }
    }

    function declareReady() {
        setError('');
        socket.emit('readyPlayer', store.room?.id, callback);
    }

    function handlePreparationEnded() {
        socket.on('preparationEnded', (room) => {
            store.setRoom((prev) => ({...prev, rounds : room.rounds, status : room.status }));
            navigate(`/room/${room.id}/game`);
        })
    }

    function handlePlayerLeft() {
        socket.on('playerLeft', (player : Player) => {
            console.log('Left');
            store.setRoom((prev) => ({...prev, players : prev.players.filter((p) => p.socketId !== player.socketId)}));
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

    function handlePlayerReady() {
        socket.on('aPlayerIsReady', (id) => {
            store.setReadyPlayer((prev) => ([...prev,id]));
        })
    }


    useEffect(() => {
        intervalRef.current = setInterval(() =>{
            setTimer((prev) => prev - 1);
        }, 1000);

        return () => {
            if (intervalRef.current) {clearInterval(intervalRef.current);};
        }
    }, [])

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
        if (timer <= 0 && intervalRef.current) {
            clearInterval(intervalRef.current);
        }
        const fill = document.querySelector('.pr-timer-fill') as HTMLElement;
        if (!fill) {return};
        const percentage = timer / totalTime;
        const hue = Math.round(percentage * 120);
        fill.style.backgroundColor = `hsl(${hue},80%, 60%)`;
    }, [timer])

    useEffect(() => {
        if (!store.player) {
            if (params.roomId) {
                store.setRoomId(params.roomId);
            }
            navigate('/');
        }
        handlePreparationEnded();
        handleHostLeft();
        handlePlayerLeft();
        handlePlayerReady();

        return () => {
            socket.off('preparationEnded');
            socket.off('hostLeft');
            socket.off('playerLeft');
            socket.off('aPlayerIsReady');
        }
    }, [])
    
    return (
        <div className="pr-root">
            <div className="pr-timer">
                <div className="pr-timer-bar">
                <div 
                    className="pr-timer-fill"
                    style={{width: `${(timer / totalTime) * 100}%`}}/>
                </div>
                <span className="pr-timer-value">{utilFunction.formatSecond(timer)}</span>
            </div>
            {!ready ? (
                <div className="pr-not-ready">
                    <div className="pr-props">
                        {Array.from({length: store.room?.settings.nbRound ?? 0}, (_, index) => {
                            const isSubmitted = index < submission.length;
                            const isActive = index == submission.length;
                            const isLocked = index > submission.length;
                            return (
                                <div 
                                    className={`pr-prop ${isSubmitted && 'pr-prop-submitted'} ${isActive && 'pr-prop-active'} ${isLocked && 'pr-prop-locked'}`}
                                    key={index}
                                    onClick={() => isActive && setSelectedSlot(index)}>
                                        {isSubmitted && (<BadgeCheck className="pr-icon-submitted"/>)}
                                        {isActive && (<Loader className="pr-icon-active"/>)}
                                        {isLocked && (<Lock className="pr-icon-locked"/>)}
                                </div>
                            )
                        })}
                    </div>
                    {(selectedSlot !== null) && (
                        <div className="pr-extract-form">
                            <ExtractForm slotIndex={selectedSlot} onSubmit={onSubmit}/>
                        </div>
                    )}
                    <button
                        className="pr-ready-btn"
                        onClick={declareReady}
                        disabled={submission.length !== store.room?.settings.nbRound}
                    >
                        Prêt !
                    </button>
                </div>
            ) : (
                <div className="pr-ready">
                    <ReadyPlayersList />
                </div>
            )}

            {warning && (
                <div className="pr-warning">
                    {warning} Redirection dans <span className="pr-warning-countdown">{countDown}</span>
                </div>
            )}
            {error && (
                <div className="pr-error">
                    {error}
                </div>
            )}

        </div>
    )
}

export default Preparation;