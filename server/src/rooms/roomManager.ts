import type types = require("../types");
import roomHelper = require("./roomHelper");
import type {Socket} from 'socket.io';

/* The rooms map */
var rooms : Map<string, types.Room> = new Map();

/* Create a player with the given infos */
function createPlayer(socketId : string, pseudo : string) : types.Player {
    var player : types.Player = {
        pseudo : pseudo,
        score : 0,
        socketId : socketId
    } 
    return player;
}

/* Create a room */
function createRoom(host : types.Player) : types.Room {
    var roomId : string = roomHelper.roomCodeGenerator();
    while (rooms.get(roomId)) {
        roomId = roomHelper.roomCodeGenerator();
    }
    var newRoom : types.Room = {
        id : roomId,
        hostId : host.socketId,
        settings : [''],
        players : [host],
        status : 'WAITING',
        rounds : null
    }
    return newRoom; 
}

/* Build a room with the given socket and pseudo as host and get the room's code*/
function buildRoom(socket : Socket, pseudo : string) : string {
    var host : types.Player = createPlayer(socket.id, pseudo);
    var room : types.Room = createRoom(host);
    rooms.set(room.id, room);
    return room.id;
}

/* Join a room with the given socket, pseudo and roomId */
function joinRoom(socket : Socket, pseudo : string, roomId : string) : string {
    var room : types.Room | undefined = rooms.get(roomId);
    if (room) {
        if (room.status === 'WAITING') {
            
        }

    }
}

export = {buildRoom : buildRoom};