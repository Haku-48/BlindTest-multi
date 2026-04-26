import type {Socket, Server} from 'socket.io';
const roomManager = require('../rooms/roomManager');


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
            if (typeof response !== "string") {
                socket.join(roomId);
                socket.to(response.room.id).emit("playerJoined", response.player);
                callback({success: true, room : response.room, player : response.player});
            } else {
                callback({success: false, error: response})
            }
        } else {
            callback({success: false, error: 'Pseudo invalid !'})
        }
    })
}

/* Listen the disconnection of a player or the host */
function handleDisconnection(socket : Socket, io : Server) {
    socket.on('disconnect', () => {
        const response = roomManager.leaveRoom(socket);
        if (!response) { return; }
        io.to(response.room.id).emit("playerLeft", response.player); 
        if (response.room.hostId === socket.id) {
            roomManager.deleteRoom(response.room.id);
            io.to(response.room.id).emit("hostLeft");
        }
    })
}

/* Listen the Update setting */
function handleUpdateSettings(socket : Socket) {
    socket.on('updateSettings', (roomId, settings, callback) => {
        var response = roomManager.updateSettings(socket, settings)
        if (typeof response !== "string") {
            callback({success : true});
            socket.to(roomId).emit('settingsChanged', response);
        } else {
            callback({success : false, error : response})
        }
    })
}

/* Listen the Start of the Game */
function handleStartGame(socket : Socket, io : Server) {
    socket.on('startGame', (roomId, callback) => {
        var response = roomManager.checkAndStartGame(socket, io, roomId);
        if (typeof response !== "string") {
            callback({success : true});
            io.to(roomId).emit('gameStarted', response);
        } else {
            callback({success : false, error : response});
        }
    })
}



export default {
    handleRoomCreation : handleRoomCreation,
    handleJoinRoom : handleJoinRoom,
    handleDisconnection : handleDisconnection, 
    handleUpdateSettings : handleUpdateSettings,
    handleStartGame : handleStartGame,
}