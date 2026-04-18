import { useState } from "react"
import { useNavigate } from "react-router-dom";
import {socket} from '../socket/socket';
import { useGameStore } from "../store/useGameStore";
import '../style/home/Home.css';

function Home() {

    let navigate = useNavigate();

    let store = useGameStore();

    const [pseudo, setPseudo] = useState<string>('');
    const [creating, setCreating] = useState<boolean>(false);
    const [joining, setJoining] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    function callback(body : any) {
        if (body.success) {
            console.log(body.player);
            store.setPlayer(body.player);
            store.setRoom(body.room);
            navigate(`/room/${body.room.id}`);
        } else {
            setError(body.error);
        }
        setCreating(false);
        setJoining(false);
    }

    function handleCreation() {
        setCreating(true);
        socket.emit('createRoom', pseudo, callback);
    }

    function handleJoining() {
        setJoining(true);
        socket.emit('joinRoom', pseudo, store.roomId, callback);
    }

    return (
        <main className="hm-root">
            <div className="hm-pseudo">
                <div className="hm-pseudo-text">
                    Choisissez votre <span className="hm-pseudo-span">pseudo</span> !
                </div>
                <input 
                    id="pseudo"
                    className="hm-pseudo-input" 
                    type="text"
                    value={pseudo}
                    onChange={(e) => setPseudo(e.target.value)}
                    autoFocus
                    maxLength={10}
                />
            </div>
            <div className="hm-actions">
                <div className="hm-create">
                    <div className="hm-create-text">
                        Créez une partie
                    </div>
                    <button 
                        className="hm-btn-primary"
                        type="button"
                        onClick={handleCreation}
                        disabled={creating || !pseudo.trim()}
                    >
                        {creating ? (
                            <span className="hm-btn-loading">
                                <span className="hm-spinner" /> Création...
                            </span>
                        ) : (
                            "Créer une partie"
                        )}
                    </button>
                </div>

                <div className="hm-join">
                    <div className="hm-join-text">
                        Rejoindre une partie
                    </div>
                    <input 
                        id="code"
                        type="text" 
                        className="hm-code-input"
                        value={store.roomId}
                        onChange={(e) => store.setRoomId(e.target.value)}
                        autoFocus
                        maxLength={6} 
                    />
                    <button 
                        className="hm-btn-primary"
                        type="button"
                        onClick={handleJoining}
                        disabled={joining || !(pseudo.trim() && store.roomId.trim())}
                    >
                        {joining ? (
                            <span className="hm-btn-loading">
                                <span className="hm-spinner" /> Connexion...
                            </span>
                        ) : (
                            "Rejoindre une partie"
                        )}
                    </button>
                </div>
            </div>

            {error && (
                <p className="hm-error">{error}</p>
            )}
        </main>
    )
}

export default Home