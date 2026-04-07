import { useEffect, useState } from "react"
import { useGameStore } from "../../store/useGameStore";

function ShareLink() {

    const [copied, setCopied] = useState<boolean>(false);

    const store = useGameStore();

    function handleShareLinkClick() {
        navigator.clipboard.writeText(store.room!.id);
        setCopied(true);
    }

    useEffect(() => {
        if (copied) {
            setTimeout(() => {
                setCopied(false);
            }, 3000);
        }
    }, [copied])

    return (
        <div className="sl-root">
            <p className="sl-test">Partagez le code de la room à vos amis !</p>
            <button 
                type="button"
                className="sl-btn"
                onClick={handleShareLinkClick}
                >
                    {copied ? (
                        <span className="sl-btn-copied">
                            Copié :)
                        </span>
                    ) : (
                        <span className="sl-btn-code">
                            {store.room!.id}
                        </span>
                    )}
            </button>
        </div>
    )
}

export default ShareLink