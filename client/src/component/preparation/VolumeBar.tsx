import { useState } from "react";
import '../../style/preparation/VolumeBar.css';
import { Volume1, Volume2, VolumeX } from "lucide-react";

interface VolumeBarProps {
    playerRef : YT.Player | null,
    horizontal : boolean
}

function VolumeBar({playerRef, horizontal} : VolumeBarProps) {

    const [volume, setVolume] = useState<number>(playerRef?.getVolume() ?? 50);

    function onChange(volume : number) {
        if (!playerRef) {
            console.log("NO PLAYERREF !");
            return;
        }
        setVolume(volume);
        playerRef.setVolume(volume);
    }

    return (
        <div className="vb-root">
            <div className={horizontal ? 'vb-bar-horizontal' : 'vb-bar-vertical'}>
                <div className="vb-bar-fill"
                    style={horizontal ? ({
                        width: `${volume}%`
                    }) : ({
                        height: `${volume}%`
                    })}
                />
                <input 
                    type="range"
                    className={horizontal ? 'vb-bar-input-horizontal' : 'vb-bar-input-vertical'}
                    min={0}
                    max={100}
                    value={volume}
                    onChange={(e) => {onChange(Number(e.target.value))}}
                    />
            </div>
            {(volume === 0) && (
                <VolumeX className="vb-icon-muted" />
            )}
            {(volume > 0 && volume < 50) && (
                <Volume1 className="vb-icon-low" />
            )}
            {(volume >= 50) && (
                <Volume2 className="vb-icon-high" />
            )}
        </div>
    )

}

export default VolumeBar;