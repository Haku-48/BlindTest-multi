import { useState } from "react"

function Home() {

    const [pseudo, setPseudo] = useState<string>('');

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
        </main>
    )
}

export default Home