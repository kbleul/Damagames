// socket.io.js
import io from "socket.io-client";

const socket = io('https://dama.up.railway.app', {
  port: process.env.REACT_APP_SOCKET_PORT,
});

export default socket;
