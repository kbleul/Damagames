// socket.io.js
import io from "socket.io-client";

const socket = io(process.env.REACT_APP_SOCKET_URL, { port: process.env.REACT_APP_SOCKET_PORT });


// , {
//     // Set the following options to prevent disconnection on external events
//     reconnection: true,
//     reconnectionAttempts: Infinity,
//     reconnectionDelay: 1000,
//     timeout: 20000,
//     keepAlive: true
//   }
export default socket;

