import type {Socket, Server} from 'socket.io';
import roomManager from '../rooms/roomManager.ts';

/* Listen on the answer validation */
function handleValidateAnswer(socket : Socket, io : Server) {
    socket.on('answerValidation', (roomId, roundIndex, guessIndex, isMain, isValid) => {
        const response = roomManager.checkValidation(socket,roomId,roundIndex,guessIndex,isMain,isValid);
        if (response) {
            io.to(roomId).emit('answerValidated', roundIndex, guessIndex, isMain, isValid);
        }
    })
}

/* Listen on the guess correction end */
function handleGuessCorrectionEnd(socket : Socket, io : Server){
    socket.on('guessCorrectionEnd', (roomId) => {
        const response = roomManager.checkRoundOrGuessCorrectionEnd(socket, roomId);
        if (response) {
            io.to(roomId).emit('nextGuess');
        }
    })
}

/* Listen on the report */
function handleRoundReport(socket : Socket, io : Server) {
    socket.on('reportRound', (roomId, roundIndex) => {
        const response = roomManager.checkReport(socket, roomId, roundIndex);
        if (response) {
            io.to(roomId).emit('newReport', roundIndex, response);
        }
    })
}

/* Listen on the round correction end */
function handleRoundCorrectionEnd(socket : Socket, io : Server) {
    socket.on('roundCorrectionEnd', (roomId, roundIndex) => {
        const response = roomManager.checkRoundOrGuessCorrectionEnd(socket, roomId);
        if (response) {
            const endedRoom = roomManager.checkCorrectionEnd(roomId, roundIndex);
            if (endedRoom) {
                io.to(roomId).emit('correctionEnd', endedRoom);
            } else {
                io.to(roomId).emit('nextRound');
            }
        }
    })
}

export default {
    handleValidateAnswer : handleValidateAnswer,
    handleGuessCorrectionEnd : handleGuessCorrectionEnd,
    handleRoundReport : handleRoundReport,
    handleRoundCorrectionEnd : handleRoundCorrectionEnd
}