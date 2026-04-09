import { useEffect, useState } from "react";
import { useGameStore } from "../store/useGameStore"
import type { Player } from "../types";
import {socket} from '../socket/socket';
import PlayerList from "../component/lobby/PlayerList";
import ShareLink from "../component/lobby/ShareLink";
import '../style/Lobby.css';
import { useNavigate, useParams } from "react-router-dom";

function Lobby() {

    let navigate = useNavigate();
    let params = useParams();
    let store = useGameStore();
    const [warning, setWarning] = useState<string>('');
    const [countDown, setCountDown] = useState<number>(1);

    function handlePlayerJoined() {
        socket.on('playerJoined', (player : Player) => {
            store.setRoom((prev) => ({...prev, players : [...prev.players, player]}));
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
            setInterval(() => {
                setCountDown((prev) => prev - 1);
            }, 1000);
        })
    }

    useEffect(() => {
        if (!store.player) {
            if (params.roomId) {
                store.setRoomId(params.roomId);
            }
            navigate(`/`);
        }
        handlePlayerJoined();
        handlePlayerLeft();
        handleHostLeft();

        return () => {
            socket.off('playerJoined');
            socket.off('playerLeft');
            socket.off('hostLeft');
        }
    }, [])

    useEffect(() => {
        if (countDown === 0 && warning) {
            setWarning("");
            setCountDown(1);
            store.reset();
            navigate('/');
        }
    }, [countDown])
    
    return (
        <main className="lb-root">
            <div className="lb-panels">

                {store.room &&(
                    <div className="lb-code">
                        <ShareLink />
                    </div>
                )}

                {(store.room && store.room.hostId === socket.id) ? (
                    <div className="lb-settings">
                        {/*<SettingsPanel />*/}
                    </div>
                ) : (
                    <p className="lb-waiting-host">
                        En attente de l'hôte...
                    </p>
                )}
                <div className="lb-rules">
                    {/* Ajouter les règles du jeu ici */}
                </div>
            </div>
            <div className="lb-player-list">
                <PlayerList />
            </div>

            {warning && (
                <div className="lb-warning">
                    {warning} Redirection dans <span className="lb-warning-countdown">{countDown}</span>
                </div>
            )}
        </main>
    )
}

export default Lobby