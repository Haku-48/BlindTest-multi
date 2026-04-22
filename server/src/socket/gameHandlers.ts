import type {Socket, Server} from 'socket.io';
import roomManager = require('../rooms/roomManager');

/* Listen on submit guess */
function handleSubmitGuess(socket : Socket, io : Server) {
    socket.on('submitGuess', (roomId, mainAnswer, bonusAnswer, callback) => {
        var response = roomManager.checkAndSaveGuess(socket, roomId, mainAnswer, bonusAnswer);
        if (typeof response === "string") {
            callback({success : false, error : response});
        } else {
            callback({success : true, guess : response});
            if (roomManager.checkToFinishTheActualRound(roomId)) {
                var roomEnded = roomManager.checkGameEnd(roomId);
                if (roomEnded) {
                    io.to(roomId).emit("gameEnded", roomEnded);
                } else {
                    io.to(roomId).emit("roundEnded");
                }
            }
        }
    })
}

export = {
    handleSubmitGuess : handleSubmitGuess
}