import type {Socket, Server} from 'socket.io';
import roomManager = require('../rooms/roomManager');

/* Listen the creation request from a socket on the server */
function handleRoomCreation(socket : Socket) {
    socket.on('createRoom', (hostPseudo, callback) => {
        if (hostPseudo && hostPseudo.length > 2) {
            var roomId = roomManager.buildRoom(socket, hostPseudo);
            socket.join(roomId);
            callback({success: true, roomId});
        } else {
            callback({success: false, error: 'Invalid Pseudo'});
        }
    })
}

/* Listen the join request from a socket on the server */
function handleJoinRoom(socket : Socket, io : Server) {
    socket.on('joinRoom', (playerPseudo, roomId, callback) => {
        if (playerPseudo && playerPseudo.length > 2) {
            var roomIdResult = roomManager.joinRoom(socket, playerPseudo, roomId);
            if (roomIdResult) {
                io.to(roomIdResult).emit("playerJoined", playerPseudo);
                socket.join(roomId);
                callback({success: true, roomIdResult});
            } else {
                callback({success: false, error: 'Inexistant or already playing room'})
            }
        } else {
            callback({success: false, error: 'Invalid pseudo'})
        }
    })
}

export = {
    handleRoomCreation : handleRoomCreation,
    handleJoinRoom : handleJoinRoom
}