import { useEffect } from "react";
import { useGameStore } from "../store/useGameStore"
import type { Player } from "../types";
import {socket} from '../socket/socket';
import PlayerList from "../component/lobby/PlayerList";

function Lobby() {
    
    let store = useGameStore();

    function handlePlayerJoined() {
        socket.on('playerJoined', (player : Player) => {
            store.setRoom((prev) => ({...prev, players : [...prev.players, player]}));
        })
    }

    function handlePlayerQuit() {
        socket.on('playerQuit', (player : Player) => {
            store.setRoom((prev) => ({...prev, players : prev.players.filter((p) => p.socketId !== player.socketId)}));
        })
    }

    useEffect(() => {
        handlePlayerJoined();
        handlePlayerQuit();

        return () => {
            socket.off('playerJoined');
            socket.off('playerQuit');
        }
    }, [])
    
    return (
        <main className="lb-root">
            <div className="lb-panels">

                {store.room &&(
                    <div className="lb-code">
                        <span>{store!.room.id}</span>
                        {/*<ShareLink />*/}
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
        </main>
    )
}

export default Lobby