// socket.io.js
import io from "socket.io-client";

const socket = io(process.env.REACT_APP_SOCKET_URL,{
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    timeout: 20000,
    port: process.env.REACT_APP_SOCKET_PORT
  }
);
// { port: process.env.REACT_APP_SOCKET_PORT },
export default socket;
