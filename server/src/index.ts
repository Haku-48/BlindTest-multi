import correctionHandlers = require("./socket/correctionHandlers");
import gameHandlers = require("./socket/gameHandlers");
import preparationHandlers = require("./socket/preparationHandlers");
import roomHandlers = require("./socket/roomHandlers");
import type {Socket, Server as IOServer} from 'socket.io';

var FRONTEND_ADDRESS = 'http://localhost:5173';

var express = require('express');
var debug = require('debug')('Blindtest-multi:server');
var http = require('http');
const { Server } = require('socket.io');

const app = express();

const PORT = 3000;

var server = http.createServer(app);

const io : IOServer = new Server(server, {
  cors : {
    origin: FRONTEND_ADDRESS,
  }
});

io.on('connection', (socket : Socket) => {
    roomHandlers.handleRoomCreation(socket);
    roomHandlers.handleJoinRoom(socket);
    roomHandlers.handleDisconnection(socket,io);
    roomHandlers.handleUpdateSettings(socket);
    roomHandlers.handleStartGame(socket, io);
    preparationHandlers.handleSubmitExtract(socket);
    preparationHandlers.handlePlayerReady(socket, io);
    gameHandlers.handleSubmitGuess(socket,io);
    correctionHandlers.handleValidateAnswer(socket,io);
    correctionHandlers.handleGuessCorrectionEnd(socket,io);
    correctionHandlers.handleRoundReport(socket, io);
    correctionHandlers.handleRoundCorrectionEnd(socket, io);
})

server.listen(PORT);
server.on('error', onError);
server.on('listening', onListening);



/**
 * Event listener for HTTP server "error" event.
 */

function onError(error : any) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof PORT === 'string'
    ? 'Pipe ' + PORT
    : 'Port ' + PORT;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}


