import { UserRoundCheck, UserSearch } from "lucide-react";
import { useGameStore } from "../../store/useGameStore";
import '../../style/preparation/ReadyPlayersList.css';

function ReadyPlayersList() {
    let store = useGameStore();

    return(
        <div className="rpl-root">
            <div className="rpl-list">
                {store.room?.players.map((player,index) => {
                    const isReady = store.readyPlayers.filter(id => id === player.socketId).length === 1;
                    return(
                        <div className="rpl-card" key={index}>
                            {isReady ? (
                                <UserRoundCheck className="rpl-icon-ready"/>
                            ) : (
                                <UserSearch className="rpl-icon-not-ready"/>
                            )}
                            <span className="rpl-card-name">{player.pseudo}</span>
                        </div>
                    )
                })}
            </div>
            <div className="rpl-waiting-message">
                Veuillez attendre que tout le monde soit prêt où que le temps soit écoulé. 
            </div>
        </div>
    )
}

export default ReadyPlayersList;