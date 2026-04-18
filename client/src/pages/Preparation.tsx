import { useGameStore } from "../store/useGameStore";

function Preparation() {
    
    let store = useGameStore();
    
    return (
        <div className="pr-root">
            Bienvenu {store.player?.pseudo}
        </div>
    )
}

export default Preparation;