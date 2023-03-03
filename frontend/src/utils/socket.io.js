// socket.io.js
import io from "socket.io-client";

const socket = io(process.env.REACT_APP_SOCKET_URL, { port: process.env.REACT_APP_SOCKET_PORT });



export default socket;
