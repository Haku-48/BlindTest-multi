import { useEffect, useRef, useState } from "react";
import { useGameStore } from "../store/useGameStore";
import type { Round } from "../types";
import {socket} from '../socket/socket';
import { useNavigate, useParams } from "react-router-dom";
import ExtractForm from "../component/preparation/ExtractForm";
import {BadgeCheck, Loader, Lock} from 'lucide-react';
import utilFunction from "../util/utilFunction";
import '../style/preparation/Preparation.css';

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


    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    function onSubmit(round : Round) {
        setSubmission((prev) => ([...prev, round]));
        setSelectedSlot(null);
    }

    function declareReady() {
        console.log('Ready');
    }

    function handlePreparationEnded() {
        socket.on('preparationEnded', (room) => {
            store.setRoom((prev) => ({...prev, rounds : room.rounds, status : room.status }));
            navigate(`/room/${room.id}/game`);
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

        return () => {
            socket.off('preparationEnded');
        }
    }, [])
    
    return (
        <div className="pr-root">
            
            {!ready ? (
                <div className="pr-not-ready">
                    <div className="pr-timer">
                        <div className="pr-timer-bar">
                            <div 
                            className="pr-timer-fill"
                            style={{width: `${(timer / totalTime) * 100}%`}}/>
                        </div>
                        <span className="pr-timer-value">{utilFunction.formatSecond(timer)}</span>
                    </div>
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
                    YES
                </div>
            )}

        </div>
    )
}

export default Preparation;