import { useGameStore } from "../../store/useGameStore";
import {socket} from '../../socket/socket';

function PlayerList() {
    let store = useGameStore();

    return(
        <main className="pl-root">
            {store.room && (
                <div>
                    <p className="pl-number">
                        Nombre de joueurs : <span>{store.room.players.length}</span>
                    </p>
            
                    <ul className="pl-list">
                        {store.room.players.map((player) => (
                            <li key={player.socketId} className={`pl-pitem ${store.room!.hostId === player.socketId && 'pl-pitem-host'} ${player.socketId === socket.id && 'pl-pitem-mine'}`}>
                                <p className="pl-pseudo">
                                    {player.pseudo}
                                </p> 
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </main>
    )
}

export default PlayerList