// socket.io.js
import io from "socket.io-client";

const socket = io("https://dama.up.railway.app", { port: 7744 });

export default socket;
