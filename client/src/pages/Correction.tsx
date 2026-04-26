import { useEffect, useRef, useState } from "react";
import { useGameStore } from "../store/useGameStore";
import { socket } from '../socket/socket';
import { useNavigate, useParams } from "react-router-dom";
import VolumeBar from "../component/preparation/VolumeBar";
import CorrectionPlayer from "../component/correction/CorrectionPlayer";
import GuessReview from "../component/correction/GuessReview";
import CorrectionPlayersList from "../component/correction/CorrectionPlayersList";
import "../style/correction/Correction.css";

function Correction() {
    
    const store = useGameStore();
    const navigate = useNavigate();
    const params = useParams();

    const [reported, setReported] = useState<boolean>(false);
    const [warning, setWarning] = useState<string>('');
    const [countDown, setCountDown] = useState<number>(1);

    const playerRef = useRef<YT.Player|null>(null);
    var interval : ReturnType<typeof setInterval>;

    function handleAnswerValidated() {
        socket.on('answerValidated', (roundIndex, guessIndex, isMain, isValid) => {
            const guess = store.room?.rounds[roundIndex].guesses[guessIndex];
            if (!guess) {console.log("C'est quoi ce bordel")}
            store.setRoom((prev) => ({
                ...prev,
                rounds : prev.rounds.map((round, index) => 
                    index === roundIndex
                        ? {
                            ...round,
                            guesses : round.guesses.map((guess, index) =>
                                index === guessIndex
                                    ? (isMain ? 
                                        {...guess, mainValid : isValid} 
                                        : {...guess, bonusValid : isValid}
                                    ) 
                                    : guess   
                            )
                        } : round        
                )
            }))
        })
    }

    function handleNextGuess() {
        socket.on('nextGuess', () => {
            store.setCurrentCorrectionGuessIndex((prev) => prev + 1);
        })
    }

    function handleNextRound() {
        socket.on('nextRound', () => {
            store.setCurrentCorrectionRoundIndex((prev) => prev + 1);
            store.setCurrentCorrectionGuessIndex(0);
            setReported(false);
        })
    }

    function handleCorrectionEnd() {
        socket.on('correctionEnd', (endedRoom) => {
            store.setRoom(endedRoom);
            navigate(`/room/${store.room!.id}/results`);
        })
    }

    function handleNewReport() {
        socket.on('newReport', (roundIndex, reports) => {
            store.setRoom((prev) => ({
                ...prev, 
                rounds : prev.rounds.map((round, index) => 
                    index === roundIndex 
                        ? {...round, reports}
                        : round
                ) 
            }))
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

    function validAnswer(isMain : boolean, isValid : boolean) {
        if (socket.id === store.room!.hostId) {
            socket.emit('answerValidation', 
                store.room!.id,
                store.currentCorrectionRoundIndex,
                store.currentCorrectionGuessIndex,
                isMain, isValid
            )
        }
    }

    function finishGuess() {
        if (socket.id === store.room!.hostId) {
            socket.emit('guessCorrectionEnd', store.room!.id);
        }
    }

    function finishRound() {
        if (socket.id === store.room!.hostId) {
            socket.emit('roundCorrectionEnd', store.room!.id, store.currentCorrectionRoundIndex);
        }
    }

    function reportRound() {
        if (!reported) {
            socket.emit('reportRound', store.room!.id, store.currentCorrectionRoundIndex);
            setReported(true);
        }
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
                store.setRoomId(params.roomId)
            }
            navigate('/');
        }

        handleAnswerValidated();
        handleNextGuess();
        handleNextRound();
        handleNewReport();
        handleCorrectionEnd();
        handleHostLeft();

        return () => {
            socket.off('answerValidated');
            socket.off('nextGuess');
            socket.off('nextRound');
            socket.off('newReport');
            socket.off('correctionEnd');
            socket.off('hostLeft');
        }
    }, [])

    return (
        <main className="ct-root">
            <h1 className="ct-title">
                Phase de correction
            </h1>
            <div className="ct-subtitles">
                <h2 className="ct-subtitle">
                    Round {store.currentCorrectionRoundIndex + 1}/{store.room?.rounds.length}
                </h2>
                <h2 className="ct-subtitle ct-extract-author">
                    Extrait de <span>{store.room!.players.filter(p => p.socketId === (store.room!.rounds[store.currentCorrectionRoundIndex].submitterId))[0].pseudo}</span>    
                </h2>    
            </div>
            <div className="ct-elem">
                <div className="ct-center">
                    <CorrectionPlayer playerRef={playerRef} />
                    <VolumeBar playerRef={playerRef.current} horizontal={true} />
                    <GuessReview validAnswer={validAnswer} />
                    <div className="ct-report-zone">
                        <div className="ct-report-info">
                            Vous pouvez signaler l'extrait s'il ne respecte pas le thème ou si vous trouvez que le joueur ayant soumis l'extrait n'a pas été fairplay.
                            Si le nombre de signalement atteint une majorité absolue, aucun point ne sera accordé pour ce round.
                        </div>
                        <div className="ct-report-btnzone">
                            <button 
                                className="ct-report-btn"
                                onClick={reportRound}
                                disabled={reported || (store.room!.rounds[store.currentCorrectionRoundIndex].reports.length >= Math.ceil(store.room!.players.length / 2))}>
                                    Signaler
                            </button>
                            <div className="ct-report-number">
                                {store.room!.rounds[store.currentCorrectionRoundIndex].reports.length}/{Math.ceil(store.room!.players.length / 2)} signalements.
                            </div>
                        </div>
                    </div>
                    {store.room!.hostId === socket.id && (
                        <div className="ct-next-btn-zone">
                            {store.currentCorrectionGuessIndex !== (store.room!.rounds[store.currentCorrectionRoundIndex].guesses.length - 1) ? (
                                <button 
                                    className="ct-next-guess-btn"
                                    onClick={finishGuess}
                                    >
                                        Suivant
                                </button>
                            ) : (
                                <button
                                    className="ct-next-round-btn"
                                    onClick={finishRound}
                                    >
                                        {store.currentCorrectionRoundIndex === (store.room!.rounds.length - 1) ? "Terminer la correction" : "Suivant"}
                                </button>
                            )}
                        </div>
                    )}
                </div>
                <div className="ct-right">
                    <CorrectionPlayersList />
                </div>
                {warning && (
                    <div className="ct-warning">
                        {warning}. Redirection dans {countDown}.
                    </div>
                )}
            </div>
        </main>
    )

}

export default Correction;