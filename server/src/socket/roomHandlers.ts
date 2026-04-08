import type {Socket, Server} from 'socket.io';
import roomManager = require('../rooms/roomManager');
import roomHelper = require('../rooms/roomHelper');

/* Listen the creation request from a socket on the server */
function handleRoomCreation(socket : Socket) {
    socket.on('createRoom', (hostPseudo, callback) => {
        if (hostPseudo && hostPseudo.length > 2) {
            var response = roomManager.buildRoom(socket, hostPseudo);
            socket.join(response.room.id);
            callback({success: true, room : response.room, player : response.player});
        } else {
            callback({success: false, error: 'Invalid Pseudo'});
        }
    })
}

/* Listen the join request from a socket on the server */
function handleJoinRoom(socket : Socket) {
    socket.on('joinRoom', (playerPseudo, roomId, callback) => {
        if (playerPseudo && playerPseudo.length > 2) {
            var response = roomManager.joinRoom(socket, playerPseudo, roomId);
            if (response) {
                socket.join(roomId);
                socket.to(response.room.id).emit("playerJoined", response.player);
                callback({success: true, room : response.room, player : response.player});
            } else {
                callback({success: false, error: 'Inexistant or already playing room'})
            }
        } else {
            callback({success: false, error: 'Invalid pseudo'})
        }
    })
}

/* Listen the disconnection of a player or the host */
function handleDisconnection(socket : Socket, io : Server) {
    socket.on('disconnect', () => {
        console.log(`${socket.id} disconnected`);
        const response = roomManager.leaveRoom(socket);
        if (!response) { return; }
        io.to(response.room.id).emit("playerLeft", response.player); 
        if (response.room.hostId === socket.id) {
            roomManager.deleteRoom(response.room.id);
            io.to(response.room.id).emit("hostLeft");
        }
    })
}

export = {
    handleRoomCreation : handleRoomCreation,
    handleJoinRoom : handleJoinRoom,
    handleDisconnection : handleDisconnection
}