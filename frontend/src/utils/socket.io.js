// socket.io.js
import io from "socket.io-client";

//const socket = io(process.env.REACT_APP_SOCKET_URL, { port: process.env.REACT_APP_SOCKET_PORT });
const socket = io("https://dama.up.railway.app",{port:7744});


export default socket;


