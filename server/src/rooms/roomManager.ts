import type Room = require("../types");
import type Settings = require("../types");
import type Round = require("../types");
import type types = require("../types");
import roomHelper = require("./roomHelper");
import type {Socket, Server} from 'socket.io';

/* The rooms map */
var rooms : Map<string, types.Room> = new Map();
/* The participant map (playerId,roomId) */
var participant : Map<string, string> = new Map();
/* The timers (roomId, timer)*/
var timers : Map<string, ReturnType<typeof setTimeout>> = new Map(); 
/* Ready players (roomId,Set(playerId)) */
var readyPlayers : Map<string,Set<string>> = new Map();

/** SETTINGS DEFAULT */
/* The theme default value */
const DEFAULT_THEME : string = "Aucun";
/* The maxPlayer default value */
const DEFAULT_MAXPLAYER : number = 2;
/* The videoInterval default value */
const DEFAULT_VIDEOINTERVAL : number = 15;
/* The nbRound default value */
const DEFAULT_NBROUND : number = 3;
/* The guessTime default value */
const DEFAULT_GUESSTIME : number = 30;

/* Choosing time per round allowed (3 minutes) */
const CHOOSING_TIME_PER_ROUND : number = 180000;

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
        rounds : [],
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
    timers.delete(roomId);
    readyPlayers.delete(roomId);
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
    if (settings.guessTime <= settings.videoInterval) {
        return `Erreur ! Vous ne pouvez pas définir un "Temps pour soumettre un choix" inférieur à la durée des extraits !`;
    }
    return '';
}


/* Check the conditions to start a game and start it if ok */
function checkAndStartGame(socket : Socket, io : Server,  roomId : string) : types.Room | string {
    const room = rooms.get(roomId);
    if (!room) {return "Erreur : Room inconnue !";}
    if (room.hostId !== socket.id) {return "Erreur : Vous n'êtes pas reconnu comme hôte de la partie !";}
    if (room.players.length < 2) { return "Erreur : Pas assez de joueurs !"}
    room.status = "CHOOSING";
    var timer = setTimeout(() => {
        if (room.status === "CHOOSING") {
            room.status = "PLAYING";
            io.to(roomId).emit("preparationEnded", room);
        }
    }, (CHOOSING_TIME_PER_ROUND * room.settings.nbRound));
    timers.set(room.id, timer);
    return room;
} 

/* Chek the condition to create a Round and create it */
function checkAndCreateRound(socket : Socket, roomId : string, videoLink : string, start : number, end : number, answer : string, bonus : string) : string | types.Round {
    const room = rooms.get(roomId);
    if (!room) {return "Erreur : Vous n'appartenez à aucune Room !";}
    const duration = end - start;
    if (duration !== room.settings.videoInterval) { return `Erreur : La durée de votre extrait ne respecte pas les règles ! Durée demandée : ${room.settings.videoInterval} secondes`;}
    if (answer === bonus) {return 'Erreur : La réponse bonus ne peut pas être identique à la réponse principale';}
    const round : types.Round = {
        submitterId : socket.id,
        videoId : videoLink,
        startSec : start,
        endSec : end,
        mainAnswer : answer,
        bonusAnswer : bonus,
        guesses : []
    }
    room.rounds.push(round);
    return round;
}

/* Put a player ready, return the ready player number if it succeed, else an error message */
function putAReadyPlayer(socket : Socket, roomId : string) : number | string {
    const room = rooms.get(roomId);
    if (!room ) { return "Erreur : Vous n'appartenez à aucune Room !";}
    const roundsSubmit = room.rounds.filter((round) => round.submitterId === socket.id).length;
    if (roundsSubmit !== room.settings.nbRound) {return "Erreur : Vous n'avez pas proposé tous vos extraits !"}
    let readys = readyPlayers.get(roomId);
    if (!readys) {
        readyPlayers.set(roomId, new Set());
        readys = readyPlayers.get(roomId);
    }
    if (!readys) { return "Erreur : Impossible de vous identifier comme prêt !"}
    if (readys.has(socket.id)) { return "Erreur : Vous apparaissez déja comme prêt !";}
    readys.add(socket.id);
    return readys.size;
}

/* Check the Ready players number to end the preparation time */
function checkReadyPlayers(nb : number, roomId : string) : types.Room | undefined {
    const room = rooms.get(roomId);
    if (!room) { return;}
    if (nb === room.players.length) {
        room.status = 'PLAYING';
        roomHelper.randomizeRounds(room);
        clearTimeout(timers.get(roomId));
        readyPlayers.delete(roomId);
        return room;
    }
    return;
}

export = {
    buildRoom : buildRoom,
    joinRoom : joinRoom,
    leaveRoom : leaveRoom,
    deleteRoom : deleteRoom,
    updateSettings : updateSettings,
    checkAndStartGame : checkAndStartGame,
    checkAndCreateRound : checkAndCreateRound,
    putAReadyPlayer : putAReadyPlayer,
    checkReadyPlayers : checkReadyPlayers
};