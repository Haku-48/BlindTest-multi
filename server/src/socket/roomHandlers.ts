import type {Socket, Server} from 'socket.io';
import roomManager = require('../rooms/roomManager');
import roomHelper = require('../rooms/roomHelper');

/* Listen the creation request from a socket on the server */
function handleRoomCreation(socket : Socket) {
    socket.on('createRoom', (hostPseudo, callback) => {
        if (hostPseudo && hostPseudo.length > 2) {
            var room = roomManager.buildRoom(socket, hostPseudo);
            socket.join(room.id);
            callback({success: true, room});
        } else {
            callback({success: false, error: 'Invalid Pseudo'});
        }
    })
}

/* Listen the join request from a socket on the server */
function handleJoinRoom(socket : Socket) {
    socket.on('joinRoom', (playerPseudo, roomId, callback) => {
        if (playerPseudo && playerPseudo.length > 2) {
            var room = roomManager.joinRoom(socket, playerPseudo, roomId);
            if (room) {
                const player = roomHelper.getPlayerBySocketId(socket.id, room);
                socket.join(roomId);
                socket.to(room.id).emit("playerJoined", player);
                callback({success: true, room});
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