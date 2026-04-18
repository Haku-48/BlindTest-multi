

function Rules() {

    return (
        <div className="r-root">
            <h1 className="r-title">Règles du jeu</h1>
            <div className="r-rule-group">
                <h2 className="r-subtitle">
                    1 - Création de la partie
                </h2>
                <ul className="r-rule-list">
                    <li className="r-rule-item">Une partie est créée par un <span>hôte</span></li>
                    <li className="r-rule-item">L'hôte définit :
                        <ul className="r-rule-sublist">
                            <li className="r-rule-subitem">le nombre maximum de joueurs</li>
                            <li className="r-rule-subitem">le thème</li>
                            <li className="r-rule-subitem">la durée des extraits</li>
                            <li className="r-rule-subitem">le nombre de tours</li>
                            <li className="r-rule-subitem">le temps accordé pour répondre</li>
                        </ul>
                    </li>
                </ul>
            </div>

            <div className="r-rule-group">
                <h2 className="r-subtitle">
                    2 - Phase de préparation
                </h2>
                <p className="r-rule-text">Chaque joueur doit proposer plusieurs extraits :</p>
                <ul className="r-rule-list">
                    <li className="r-rule-item">Fournir un lien YouTube</li>
                    <li className="r-rule-item">Choisir un intervalle précis dans la vidéo</li>
                    <li className="r-rule-item">Définir :
                        <ul className="r-rule-sublist">
                            <li className="r-rule-subitem">une <span>réponse principale</span> (ex : nom de la musique, de l'anime, etc)</li>
                            <li className="r-rule-subitem">une <span>réponse bonus</span> (ex : artiste, saison, etc)</li>
                        </ul>
                    </li>
                    <li className="r-rule-item">Tous les extraits seront utilisés pendant la partie</li>
                </ul>
            </div>

            <div className="r-rule-group">
                <h2 className="r-subtitle">
                    3 - Phase de jeu
                </h2>
                <ul className="r-rule-list">
                    <li className="r-rule-item">Les extraits sont joués un par un, dans un ordre aléatoire</li>
                    <li className="r-rule-item">Tous les joueurs écoutent en même temps</li>
                    <li className="r-rule-item">Chaque joueur propose une réponse</li>
                    <li className="r-rule-item">La réponse est envoyée à la fin du temps <span>imparti</span></li>
                </ul>
            </div>

            <div className="r-rule-group">
                <h2 className="r-subtitle">
                    4 - Objectif
                </h2>
                <p className="r-rule-text">Pour chaque extrait</p>
                <ul className="r-rule-list">
                    <li className="r-rule-item">Trouver la réponse principale</li>
                    <li className="r-rule-item">Trouver le bonus</li>
                </ul>
            </div>

            <div className="r-rule-group">
                <h2 className="r-subtitle">
                    5 - Système de points
                </h2>
                <ul className="r-rule-list">
                    <li className="r-rule-item">Bonne réponse principale → +1 point</li>
                    <li className="r-rule-item">Bonus correct → +1 point supplémentaire</li>
                    <li className="r-rule-item">Les points sont attribués à la fin de la partie par l'hôte</li>
                </ul>
            </div>

            <div className="r-rule-group">
                <h2 className="r-subtitle">
                    6 - Fair-play
                </h2>
                <ul className="r-rule-list">
                    <li className="r-rule-item">Les joueurs peuvent signaler un extrait comme non équitable</li>
                    <li className="r-rule-item">(ex : trop difficile, hors thème, mauvaise réponse)</li>
                    <li className="r-rule-item">L'hôte décide de la validité et peut adapter le scoring</li>
                </ul>
            </div>

            <div className="r-rule-group">
                <h2 className="r-subtitle">
                    7 - Fin de partie
                </h2>
                <ul className="r-rule-list">
                    <li className="r-rule-item">Tous les extraits sont joués</li>
                    <li className="r-rule-item">Un classement final est affiché</li>
                    <li className="r-rule-item">Le joueur avec le plus de point gagne !</li>
                </ul>
            </div>

            <div className="r-rule-group">
                <h2 className="r-subtitle">
                    8 - Esprit du jeu
                </h2>
                <ul className="r-rule-list">
                    <li className="r-rule-item">Jeu fun et chill entre amis</li>
                    <li className="r-rule-item">L'objectif est de :
                        <ul className="r-rule-sublist">
                            <li className="r-rule-subitem">surprendre les autres</li>
                            <li className="r-rule-subitem">s'amuser !</li>
                        </ul>
                    </li>
                </ul>
            </div>

        </div>
    )
}

export default Rules