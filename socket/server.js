import { createServer } from "http";
import { Server } from "socket.io";
import { format, formatDistance, formatRelative, subDays } from "date-fns";
import { instrument } from "@socket.io/admin-ui";

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: [
      "https://dama-game-socketio.vercel.app",
      "http://172.17.104.252:3000",
      "http://172.17.104.251:3000",
      "http://192.168.43.253:3000",
      "http://172.17.104.250:3000",
      "http://172.17.104.248:3000",
      "http://172.17.104.250:3000",
      "http://172.17.104.251:3000",
      "https://dama-blue.vercel.app",
      "https://admin.socket.io",
      "https://damagames.com",
      "https://sockets.damagames.com",
      "http://localhost:3000",
      "http://172.17.104.251:3000",
    ],
    credentials: true,
  },
});

const rooms = {};
// io.on("connection", (socket) => {
//send list of rooms
// socket.on("getRooms", () => {
//   socket.emit("rooms", Object.keys(rooms));
// });

let publicGames = [];

const createReadableDate = (date) => {
  const newdate = formatDistance(date, new Date(), { includeSeconds: true });
  console.log("date", newdate);
  return newdate;
};

//type === "code" || "socketId"
// SO WE CAN DELETE USING CODE OR SOCKETID
const removePublicGame = (code, type) => {
  console.log({ code });
  console.log(publicGames);

  let temparr = [];
  // publicGames.filter(game => game.code !== code)
  if (type === "code") {
    publicGames.forEach((game) => {
      game.code !== code && temparr.push(game);
      console.log("------", game, code, game.code === code);
    });
    publicGames = [...temparr];
    temparr = [];
  } else if (type === "socketId") {
    publicGames.forEach((game) => {
      game.socketID !== code && temparr.push(game);
      console.log("------", game, code, game.socketID === code);
    });
    publicGames = [...temparr];
    temparr = [];
  }

  console.log("********", publicGames, "=======", temparr);
};

io.on("connection", (socket) => {
  console.log(socket.id);
  //user connection
  console.log("a user connected.");

  socket.on("getRooms", () => {
    const singleUserRooms = Object.keys(rooms).filter(
      (room) => rooms[room].size === 1
    );
    socket.emit("rooms", singleUserRooms);
  });
  socket.on("postPublicGame", (data) => {
    //    console.log({"date" : createReadableDate(new Date(data.time)) })
    publicGames.push({
      ...data,
      socketID: socket.id,
      time: new Date(),
    });

    console.log("===", publicGames);
  });

  socket.on("publicGames", () => {
    console.log("public");
    let temparr = [];
    publicGames.forEach((game) => {
      temparr.push({ ...game, time: createReadableDate(game.time) });
    });
    io.to(socket.id).emit("getPublicGames", temparr);
  });

  socket.on("joinPublicGame", (codeId) => {
    console.log({ codeId });

    removePublicGame(codeId, "code");
  });

  socket.on("join-room", async (room) => {
    if (!rooms[room]) {
      rooms[room] = new Set();
    }
    rooms[room].add(socket.id);
    const clients = await io.of("/").in(room).fetchSockets();
    if (clients.length == 2) {
      // io.to(room).emit("started","you can play now")
      io.to(socket.id).emit("roomTwo", "room is filled");
    } else {
      socket.join(room);
      io.to(room).emit("private-room", "you are now in private room");
    }
    //send and get messages

    socket.on("sendMessage", (data) => {
      io.to(room).emit("getMessage", data);
    });
    socket.on("sendGameMessage", (data) => {
      io.to(room).emit("getGameMessage", data);
      // socket.broadcast.to(room).emit("getGameMessage", data);
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
    //chat within game
    socket.on("sendChatMessage", (data) => {
      io.to(room).emit("getChatMessage", data);
    });
    //send message if user left the room
    socket.on("disconnect", () => {
      io.to(room).emit("userLeaveMessage", "Someone has left the room");
    });
  });

  //leave room
  socket.on("leave", (room) => {
    if (rooms[room]) {
      rooms[room].delete(socket.id);
    }
  });
  //when disconnect
  socket.on("disconnect", () => {
    Object.keys(rooms).forEach((room) => {
      rooms[room].delete(socket.id);
      if (rooms[room].size === 0) delete rooms[room];
    });
    // io.to(room).emit("userLeaveMessage", "Someone has left the room");
    console.log("a user disconnected!");
    removePublicGame(socket.id, "socketId");
    console.log("new", publicGames);
  });
});
instrument(io, {
  auth: false,
  mode: "production",
});
const PORT = process.env.PORT || 7744;
httpServer.listen(PORT);
