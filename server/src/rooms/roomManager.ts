import type Room = require("../types");
import type Settings = require("../types");
import type types = require("../types");
import roomHelper = require("./roomHelper");
import type {Socket, Server} from 'socket.io';

/* The rooms map */
var rooms : Map<string, types.Room> = new Map();
/* The participant map (playerId,roomId) */
var participant : Map<string, string> = new Map();
/* The timers (roomId, timer)*/
var timers : Map<string, ReturnType<typeof setTimeout>> = new Map(); 

/** SETTINGS DEFAULT */
/* The theme default value */
const DEFAULT_THEME : string = "Aucun";
/* The maxPlayer default value */
const DEFAULT_MAXPLAYER : number = 2;
/* The videoInterval default value */
const DEFAULT_VIDEOINTERVAL : number = 15;
/* The nbRound default value */
const DEFAULT_NBROUND : number = 5;
/* The guessTime default value */
const DEFAULT_GUESSTIME : number = 30;

/* Choosing time per round allowed (2 minutes) */
const CHOOSING_TIME_PER_ROUND : number = 120000;

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
    while (rooms.has(roomId)) {
        roomId = roomHelper.roomCodeGenerator();
    }
    var settings : types.Settings = {
        theme : DEFAULT_THEME,
        maxPlayer : DEFAULT_MAXPLAYER,
        videoInterval : DEFAULT_VIDEOINTERVAL,
        nbRound : DEFAULT_NBROUND,
        guessTime : DEFAULT_GUESSTIME
    };
    var newRoom : types.Room = {
        id : roomId,
        hostId : host.socketId,
        settings : settings,
        players : [host],
        status : 'WAITING',
        rounds : null,
    }
    return newRoom; 
}

/* Build a room with the given socket and pseudo as host and get the room's code*/
function buildRoom(socket : Socket, pseudo : string) : types.RequestResponse {
    var host : types.Player = createPlayer(socket.id, pseudo);
    var room : types.Room = createRoom(host);
    rooms.set(room.id, room);
    participant.set(host.socketId, room.id);
    return {room, player : host};
}

/* Join a room with the given socket, pseudo and roomId */
/* Add a verification to see if the player is already in the room */
function joinRoom(socket : Socket, pseudo : string, roomId : string) : types.RequestResponse | string{
    var room : types.Room | undefined = rooms.get(roomId);
    if (!room) { return "Cette room n'existe pas !"; }
    if (room.players.length === room.settings.maxPlayer) {return "Cette room est déja pleine !"}
    if (room.status !== 'WAITING') { return "Cette room est déja en jeu !";}
    var player = createPlayer(socket.id, pseudo);
    room.players.push(player);
    participant.set(socket.id, room.id);
    return {room, player};
}


/* Leave a room, the action is different based on the fact the given socket is a host or not */
function leaveRoom(socket : Socket) : types.RequestResponse | undefined {
    const roomId = participant.get(socket.id);
    if (!roomId) {return;}
    const room = rooms.get(roomId);
    if (!room) {return;}
    const player = room.players.find((player) => player.socketId == socket.id);
    if (!player) {return;}
    room.players = room.players.filter((p) => p.socketId !== socket.id);
    participant.delete(socket.id);
    return {room, player};
}

/* Delete a room */
function deleteRoom(roomId: string) : undefined {
    rooms.delete(roomId);
    for (const [key, value] of participant) {
        if (value === roomId) {
            participant.delete(key);
        }
    }
}

/* Update the Room Settings */
function updateSettings(socket : Socket, settings : types.Settings) : types.Settings | string {
    const roomId = participant.get(socket.id);
    if (!roomId) { return "Erreur : Participant inconnue !";}
    const room = rooms.get(roomId);
    if (!room) { return "Erreur : Room inconnue !";}
    if (room.status !== "WAITING") { return "Erreur : Impossible de changer les paramètres dans la phase actuelle du jeu !";}
    if (room.hostId !== socket.id) { return "Erreur : Action réservée à l'hôte !"}
    const check = checkSettings(settings, room);
    if (check) { return check;}
    room.settings = settings;
    return room.settings;
}

/* Check the new settings */
function checkSettings(settings : types.Settings, room : types.Room) : string {
    if (settings.maxPlayer < room.players.length) {
        return `Erreur ! Il y a déja ${room.players.length} joueurs, vous ne pouvez pas limiter ce nombre à ${settings.maxPlayer}`
    }
    return '';
}


/* Check the conditions to start a game and start it if ok */
function checkAndStartGame(socket : Socket, io : Server,  roomId : string) : types.Room | string {
    const room = rooms.get(roomId);
    if (!room) {return "Erreur : Room inconnue !";}
    if (room.hostId !== socket.id) {return "Erreur : Vous n'êtes pas reconnu comme hôte de la partie !";}
    room.status = "CHOOSING";
    var timer = setTimeout(() => {
        if (room.status === "CHOOSING") {
            room.status = "PLAYING";
            io.to(roomId).emit("preparationEnded");
        }
    }, (CHOOSING_TIME_PER_ROUND * room.settings.nbRound));
    timers.set(room.id, timer);
    return room;
} 

export = {
    buildRoom : buildRoom,
    joinRoom : joinRoom,
    leaveRoom : leaveRoom,
    deleteRoom : deleteRoom,
    updateSettings : updateSettings,
    checkAndStartGame : checkAndStartGame
};