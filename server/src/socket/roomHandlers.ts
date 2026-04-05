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