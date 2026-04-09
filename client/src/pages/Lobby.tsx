import { useEffect, useState } from "react";
import { useGameStore } from "../store/useGameStore"
import type { Player } from "../types";
import {socket} from '../socket/socket';
import PlayerList from "../component/lobby/PlayerList";
import ShareLink from "../component/lobby/ShareLink";
import '../style/Lobby.css';
import { useNavigate, useParams } from "react-router-dom";
import SettingsPanel from "../component/lobby/SettingsPanel";

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

    function handleSettingsChanged() {
        socket.on('settingsChanged', (settings) => {
            console.log('settingsChanged');
            store.setRoom((prev) => ({...prev, settings : settings}));
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
        handleSettingsChanged();

        return () => {
            socket.off('playerJoined');
            socket.off('playerLeft');
            socket.off('hostLeft');
            socket.off('settingsChanged');
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
                        <SettingsPanel />
                    </div>
                ) : (
                    <p className="lb-waiting-host">
                        En attente de l'hôte...
                    </p>
                )}
                <div className="lb-rules">
                    <h1 className="lb-rules-title">Proposez vos extraits, puis devinez ceux des autres !</h1>
                    <ul className="lb-rules-list">
                        <li className="lb-rules-point">
                            Chaque joueur propose des extraits (via lien Youtube)
                        </li>
                        <li className="lb-rules-point">
                            Devinez ce que c'est + un bonus 
                        </li>
                        <li className="lb-rules-point">
                            1 point par bonne réponse (+1 si bonus trouvé)
                        </li>
                        <li className="lb-rules-point">
                            Pas de seconde chance, réponse définitive !
                        </li>
                        <li className="lb-rules-point">
                            Nous verrons à la fin qui est le meilleur !
                        </li>
                    </ul>
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