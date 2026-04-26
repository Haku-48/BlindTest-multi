import dotenv from 'dotenv';
dotenv.config();

import correctionHandlers from "./socket/correctionHandlers.ts";
import gameHandlers from "./socket/gameHandlers.ts";
import preparationHandlers from "./socket/preparationHandlers.ts";
import roomHandlers from "./socket/roomHandlers.ts";
import type {Socket, Server as IOServer} from 'socket.io';

var FRONTEND_ADDRESS = process.env.FRONTEND_ADDRESS;

import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

import feedbackRouter from './routes/feedback.route.ts';

const app = express();
import cors from 'cors';
app.use(express.json());
app.use(cors({
  origin : FRONTEND_ADDRESS
}))
app.use('/feedback', feedbackRouter);

const PORT = process.env.PORT || 3000;

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




