import { useGameStore } from "../../store/useGameStore";
import {socket} from '../../socket/socket';
import '../../style/PlayerList.css';

function PlayerList() {
    let store = useGameStore();

    return(
        <main className="pl-root">
            {store.room && (
                <div>
                    <p className="pl-number">
                        Nombre de joueurs : <span>{store.room.players.length}/{store.room.settings.maxPlayer}</span>
                    </p>
            
                    <ul className="pl-list">
                        {store.room.players.map((player) => (
                            <li key={player.socketId} className={`pl-pitem ${player.socketId === socket.id ? 'pl-pitem-mine' : (store.room!.hostId === player.socketId && 'pl-pitem-host')}`}>
                                <p className="pl-pseudo">
                                    {player.pseudo}
                                </p> 
                                { player.socketId === socket.id ? (
                                    <div className="pl-sticker pl-sticker-mine">
                                        Moi
                                    </div>
                                ) : store.room!.hostId === player.socketId ? (
                                    <div className="pl-sticker pl-sticker-host">
                                        Hôte
                                    </div>
                                ) : null }
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </main>
    )
}

export default PlayerList