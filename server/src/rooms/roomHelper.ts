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

/* Exports */
export = {roomCodeGenerator : roomCodeGenerator}