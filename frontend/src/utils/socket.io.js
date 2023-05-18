// socket.io.js
import io from "socket.io-client";

const socket = io(
  `${process.env.REACT_APP_SOCKET_URL}:${process.env.REACT_APP_SOCKET_PORT}`,
  {
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    timeout: 20000,
  });

// const socket = io(
//   `http://localhost:7744`,
//   {
//     reconnection: true,
//     reconnectionAttempts: Infinity,
//     reconnectionDelay: 1000,
//     reconnectionDelayMax: 5000,
//     timeout: 20000,
//   });

export default socket;
