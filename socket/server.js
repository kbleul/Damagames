import { createServer } from "http";
import { Server } from "socket.io";
import { instrument } from "@socket.io/admin-ui";
const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: [
      "https://dama-game-socketio.vercel.app",
      "http://172.17.104.242:3000",
      "http://192.168.0.118:3000",
      "http://192.168.0.113:3000",
      "http://192.168.0.106:3000",
      "http://172.17.104.248:3000",
      "http://172.17.104.253:3000",
      "https://dama-blue.vercel.app",
      "https://admin.socket.io",
    ],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  // console.log(socket.id)
  //user connection
  console.log("a user connected.");

  socket.on("join-room", async (room) => {
    const clients = await io.of("/").in(room).fetchSockets();
    if (clients.length == 2) {
      // io.to(room).emit("started","you can play now")
      io.to(socket.id).emit("roomTwo", "room is filled");
    } else {
      socket.join(room);
      io.to(room).emit("private-room", "you are now in private room");
    }
    //send and get message

    socket.on("sendMessage", (data) => {
      io.to(room).emit("getMessage", data);
    });
    socket.on("sendGameMessage", (data) => {
      io.to(room).emit("getGameMessage", data);
    });
    socket.on("sendResetGameRequest", (data) => {
      // io.to(room).broadcast.emit("getResetGameRequest", data);
      socket.broadcast.to(room).emit("getResetGameRequest", data);
    });
    socket.on("sendResetGameMessage", (data) => {
      io.to(room).emit("getResetGameMessage", data);
    });

    socket.on("sendRejectGameMessage", (data) => {
      // io.to(room).emit("getRejectGameMessage", data);
      socket.broadcast.to(room).emit("getRejectGameMessage", data);
    });
    //send draw game message
    socket.on("sendDrawGameRequest", (data) => {
      // io.to(room).broadcast.emit("getResetGameRequest", data);
      socket.broadcast.to(room).emit("getDrawGameRequest", data);
    });
    //send message if the user exit the game
    socket.on("sendExitGameRequest", (data) => {
      // io.to(room).broadcast.emit("getResetGameRequest", data);
      socket.broadcast.to(room).emit("getExitGameRequest", data);
    });
    //send message if user left the room
    socket.on("disconnect", () => {
      io.to(room).emit("userLeaveMessage", "Someone has left the room");
    });
  });

  //when disconnect
  socket.on("disconnect", () => {
    // io.to(room).emit("userLeaveMessage", "Someone has left the room");
    console.log("a user disconnected!");
  });
});
instrument(io, {
  auth: false,
});
const PORT = process.env.PORT || 7744;
httpServer.listen(PORT);
