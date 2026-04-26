import { useState } from "react";
import { useGameStore } from "../../store/useGameStore";
import { ChevronUp } from "lucide-react";
import '../../style/feedback/FeedbackPanel.css';

function FeedbackPanel() {

    const store = useGameStore();
    const backendUrl = import.meta.env.VITE_SOCKET_URL;

    const [developped, setDevelopped] = useState<boolean>(false);
    // valeurs de type : "report" | "upgrade"
    const [type, setType] = useState<string>("report");
    const [content, setContent] = useState<string>("");
    const [pseudo, setPseudo] = useState<string>(store.player ? store.player.pseudo : "");
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');
    const [sending, setSending] = useState<boolean>(false);


    function resetAll() {
        setType("report");
        setContent("");
        setPseudo(store.player ? store.player.pseudo : "");
        setError('');
        setSuccess('');
    }

    async function sendRequest() {
        if (!content.trim() || content.length < 25) return;
        setSending(true);
        setError('');
        setSuccess('');

        const body = {
            "type" : type,  
            "content" : content,
            "pseudo" : pseudo
        }
        const requestOption = {
            method : 'POST',
            headers : {
                "Content-type" : "application/json" 
            },
            body : JSON.stringify(body)
        }
        const response = await fetch(`${backendUrl}/feedback`, requestOption);
        if (response.ok) {
            setSuccess(type === "report" 
                ? "Merci pour votre signalement ! Nos équipe travaillerons à la résolution de ce problème."
                : "Merci pour votre proposition ! Nos équipe l'analyserons et sauront en tirer parti."
            )
        } else {
            const error = await response.json();
            setError(`Erreur : ${error.message}`);
        }
        setContent('');
        setSending(false);
    }

    return (
        <div className="fp-root">
            <div className="fp-header">
                <div className="fp-header-text">
                    Signaler un bug / Proposer une amélioration
                </div>
                <ChevronUp className={`fp-header-icon ${developped && "fp-header-icon-down"}`}
                    onClick={() => {
                        if (developped) {
                            resetAll();
                            setDevelopped(false);
                        } else {
                            setDevelopped(true);
                        }
                    }}/>
            </div>
            {developped && (
                <div className={`fp-body ${type === "report" ? "fp-red-body" : "fp-green-body"}`}>
                    <div className="fp-toggle-zone">
                        <div className="fp-toggle-text">
                            Signaler un bug
                        </div>
                        <button 
                            className={`fp-toggle-btn ${type === "report" ? "fp-toggle-red" : "fp-toggle-green"}`}
                            onClick={() => {setType((prev) => prev === "report" ? "upgrade" : "report")}}>
                        </button>
                        <div className="fp-toggle-text">
                            Proposer une amélioration
                        </div>
                    </div>
                    <div className="fp-content-zone">
                        <div className="fp-content-text">
                            Veuillez décrire votre {type === "report" ? "Bug" : "Amélioration"} avec le plus de précision possibles :
                        </div>
                        <div className="fp-content-indication">
                            Votre contenu doit être compris entre 25 et 200 caractères : <span className={`fp-content-indication-number ${content.length < 25 ? "fp-content-indication-red" : "fp-content-indication-green"}`}>{content.length}</span>/200
                        </div>
                        <textarea 
                            className="fp-content-input" 
                            value={content}
                            maxLength={200}
                            onChange={(e) => {setContent(e.target.value)}}/>
                    </div>
                    <div className="fp-pseudo-zone">
                        <div className="fp-pseudo-text">
                            Saisissez votre pseudo (optionnel) :
                        </div>
                        <input type="text" 
                            className="fp-pseudo-input" 
                            value={pseudo}
                            onChange={(e) => {setPseudo(e.target.value)}}/>
                    </div>
                    <button 
                        className="fp-send-btn"
                        onClick={sendRequest}
                        disabled={!content.trim() || content.length < 25 || sending}>
                            Envoyer
                    </button>
                    {error && (
                        <div className="fp-error">
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="fp-success">
                            {success}
                        </div>
                    )}
                </div>
            )}
        </div>
    )

}
export default FeedbackPanel;