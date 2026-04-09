import {io} from 'socket.io-client';


export var socket = io(import.meta.env.VITE_SOCKET_URL);

