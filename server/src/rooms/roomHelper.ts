import type types = require("../types");

/* Options type */
interface Options {
    includeUpperCase : boolean | null,
    includeNumbers : boolean | null,
    length : number | null
}

/* Function to create a random string with the given options */
function strRandom(options : Options | null) : string {
    var length : number = 10,
        letters : string = 'abcdefghijklmnopqrstuvwxyz',
        allowedChar : string = '' + letters,
        result : string = '';

    if (options) {
        if (options.includeUpperCase) {
            allowedChar += letters.toUpperCase();
        }
        if (options.includeNumbers) {
            allowedChar += '1234567890';
        }
        if (options.length && options.length > 3) {
            length = options.length;
        }
    }

    for (var index = 0; index < length; index++) {
        result += allowedChar[Math.floor(Math.random() * allowedChar.length)];
    }
    
    return result; 
}

/* Function to create a Room code */
function roomCodeGenerator() : string {
    const options : Options = {
        includeUpperCase : true,
        includeNumbers: true,
        length : 6,
    }
    const code : string = strRandom(options); 
    return code;
}

/* Get the player with the given socketId in the given room */
function getPlayerBySocketId(id : string, room : types.Room) : types.Player | undefined {
    let liste = room.players.filter((p) => p.socketId == id);
    if (liste.length == 1) {
        return liste[0];
    }
    return ;
} 

/* Randomize the order in a room rounds */
function randomizeRounds(room : types.Room) {
    if (!room.rounds) {return;}
    const grouped = Object.groupBy(room.rounds, round => round.submitterId);
    const groupedList = Object.values(grouped).filter(
        (group): group is NonNullable<typeof group> => group !== undefined
    );
    groupedList.sort((a, b) => b.length - a.length);
    let result : types.Round[] = [];
    while (groupedList.length > 0) {
        const lastSubmitterId = result.at(-1)?.submitterId;
        const index = groupedList.findIndex(group => group[0]?.submitterId !== lastSubmitterId);
        
        if (index === -1) { return; }
        
        const group = groupedList[index];
        if (!group){ return ;}
        const round = group.shift()!;
        result.push(round);
        
        if (group.length === 0) {
            groupedList.splice(index, 1);
        }
        
        groupedList.sort((a, b) => b.length - a.length);
    }
    room.rounds = result;
}

/* Exports */
export = {
    roomCodeGenerator : roomCodeGenerator,
    getPlayerBySocketId : getPlayerBySocketId
}