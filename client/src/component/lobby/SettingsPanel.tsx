import { useState } from "react";
import { useGameStore } from "../../store/useGameStore"
import { socket } from "../../socket/socket";
import '../../style/lobby/SettingsPanel.css';
import utilFunction from "../../util/utilFunction";

function SettingsPanel() {

    const [changed, setChanged] = useState<boolean>();
    const [error, setError] = useState<string>('');

    let store = useGameStore();

    function callback(body : any) {
        if (!body.success) {
            setError(body.error);
        }
    }

    function updateSettings() {
        socket.emit('updateSettings', store.room?.id, store.room?.settings, callback);
        setChanged(false);
    }

    return(

        <div className="sp-root">
            <p className="sp-title">
                Choisissez vos propres règles !
            </p>

            <div className="sp-setters">
                <div className="sp-theme">
                    <p className="sp-theme-text">
                        Thème :
                    </p>
                    <input 
                        type="text" 
                        className="sp-theme-input"
                        maxLength={20}
                        value={store.room?.settings.theme} 
                        onChange={(e) => {
                            store.setRoom((prev) => ({...prev, settings : {...prev.settings, theme : e.target.value}}));
                            setChanged(true);
                            setError('');
                        }}/>
                </div>

                <div className="sp-maxPlayer">
                    <p className="sp-maxPlayer-text">
                        Nombre maximum de joueurs :
                    </p>
                    <input 
                        type="range" 
                        className="sp-maxPlayer-input" 
                        min={2}
                        max={10}
                        value={store.room?.settings.maxPlayer}
                        onChange={(e) => {
                            store.setRoom((prev) => ({...prev, settings : {...prev.settings, maxPlayer : Number(e.target.value)}}));
                            setChanged(true);
                            setError('');
                        }}/>
                    <span className="sp-maxPlayer-value">
                        {store.room?.settings.maxPlayer}
                    </span>
                </div>

                <div className="sp-nbRound">
                    <p className="sp-nbRound-text">
                        Nombre de tour :
                    </p>
                    <input 
                        type="range" 
                        className="sp-nbRound-input" 
                        min={3}
                        max={10}
                        value={store.room?.settings.nbRound}
                        onChange={(e) => {
                            store.setRoom((prev) => ({...prev, settings : {...prev.settings, nbRound : Number(e.target.value)}}));
                            setChanged(true);
                            setError('');
                        }}/>
                    <span className="sp-nbRound-value">
                        {store.room?.settings.nbRound}
                    </span>
                </div>

                <div className="sp-videoInterval">
                    <p className="sp-videoInterval-text">
                        Durée des extraits (en secondes) :
                    </p>
                    <input 
                        type="range" 
                        className="sp-videoInterval-input" 
                        min={2}
                        max={30}
                        value={store.room?.settings.videoInterval}
                        onChange={(e) => {
                            store.setRoom((prev) => ({...prev, settings : {...prev.settings, videoInterval : Number(e.target.value)}}));
                            setChanged(true);
                            setError('');
                        }}/>
                    <span className="sp-videoInterval-value">
                        {store.room?.settings.videoInterval}
                    </span>
                </div>

                <div className="sp-guessTime">
                    <p className="sp-guessTime-text">
                        Temps pour soumettre un choix :
                    </p>
                    <input 
                        type="range" 
                        className="sp-guessTime-input" 
                        min={10}
                        max={180}
                        step={5}
                        value={store.room?.settings.guessTime}
                        onChange={(e) => {
                            store.setRoom((prev) => ({...prev, settings : {...prev.settings, guessTime : Number(e.target.value)}}));
                            setChanged(true);
                            setError('');
                        }}/>
                    <span className="sp-guessTime-value">
                        {utilFunction.formatSecond(store.room!.settings.guessTime)}
                    </span>
                </div>
            </div>

            <button 
                className="sp-btn"
                disabled={!changed}
                onClick={updateSettings}>
                    Enregistrer
            </button>
            
            { error && (
                <p className="sp-error">
                    {error}
                </p>
            )}
        </div>
    )
}

export default SettingsPanel;