import { io } from 'socket.io-client';

const SOCKET = io("http://44.209.181.33:3155", {
  autoConnect: false,
  reconnectionDelay: 1000,
  reconnection: true,
  transports: ["websocket"],
  jsonp: false,
  rejectUnauthorized: false,
  timeout: 20000,
});

export default SOCKET;
