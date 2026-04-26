import type {Socket, Server} from 'socket.io';
const roomManager = require('../rooms/roomManager');

/* Listen the extract submission */
function handleSubmitExtract(socket : Socket) {
    socket.on('submitExtract', (roomId, videoLink, start, end, answer, bonus, callback) => {
        var response = roomManager.checkAndCreateRound(socket, roomId, videoLink, start, end, answer, bonus);
        if (typeof response === 'string') {
            callback({success : false, error : response});
        } else {
            callback({success : true, round : response});
        }
    })
}

/* Listen the ready players */
function handlePlayerReady(socket : Socket, io : Server) {
    socket.on('readyPlayer', (roomId, callback) => {
        var response = roomManager.putAReadyPlayer(socket, roomId);
        if (typeof response === 'string') {
            callback({success : false, error : response})
        } else {
            callback({success : true});
            io.to(roomId).emit('aPlayerIsReady', socket.id)
            const room = roomManager.checkReadyPlayers(response, roomId);
            if (room) {
                io.to(roomId).emit('preparationEnded', room);
            }
        }
    })
}

export default {
    handleSubmitExtract : handleSubmitExtract,
    handlePlayerReady : handlePlayerReady
}