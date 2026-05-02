import { useEffect, useRef, useState } from "react";
import { useGameStore } from "../store/useGameStore";
import { useNavigate } from "react-router-dom";
import Ranking from "../component/results/Ranking";
import Summary from "../component/results/Summary";
import "../style/results/Results.css";

function Results() {

    const store = useGameStore();
    const navigate = useNavigate();

    const [revealedCount, setRevealedCount] = useState<number>(0);
    /* Différentes valeures de phases : "ranking" | "summary" */
    const [phase, setPhase] = useState<string>("ranking");

    const descPlayerList = [...store.room?.players ?? []].sort((p1,p2) => 
        p1.score !== p2.score 
            ? p2.score - p1.score 
            : p1.pseudo.localeCompare(p2.pseudo)   
    ).reverse();

    var interval = useRef<ReturnType<typeof setInterval> | null>(null);

    function returnHome() {
        store.reset();
        navigate('/');
    }

    useEffect(() => {
        if (store.room && revealedCount === store.room!.players.length) {
            if (interval.current) {
                clearInterval(interval.current);
            }
            setTimeout(() => {
                setPhase("summary");
            }, 1500);
            
        }
    }, [revealedCount])

    useEffect(() => {
        if (!store.player || !store.room) {
            navigate('/');
            return;
        }
        interval.current = setInterval(() => {
            setRevealedCount((prev) => prev + 1);
        }, 1500);

        return () => {
            if (interval.current) {
                clearInterval(interval.current);
            }
        }
    }, [])

    return (
        <main className="res-root">
            <h1 className="res-title">
                Félicitation !
            </h1>
            <h2 className="res-subtitle">
                Si vous êtes arrivé là, c'est que mon jeu n'a pas crash et ça c'est super
            </h2>
            <Ranking liste={descPlayerList} revealedCount={revealedCount} />
            {phase === "summary" && (
                <Summary />
            )}
            <p className="res-sentence">Au plaisir de vous revoir !</p>
            <button 
                className="res-btn"
                onClick={returnHome}
                disabled={phase!=="summary"}>
                    Revenir à l'acceuil
            </button>
        </main>
    )
}

export default Results;