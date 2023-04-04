import { createServer } from "http";
import { Server } from "socket.io";
import { differenceInMinutes, formatDistance } from "date-fns";
import { instrument } from "@socket.io/admin-ui";
import { Console } from "console";
import { Socket } from "dgram";
const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    credentials: true,
  },
});

let publicGames = [];
let rooms = [];
let roomSocketObj = {};

const createReadableDate = (date) => {
  const newdate = formatDistance(date, new Date(), { includeSeconds: true });
  return newdate;
};

//type === "code" || "socketId"
// SO WE CAN DELETE USING CODE OR SOCKETID
const removePublicGame = (code, type) => {
  let temparr = [];
  // publicGames.filter(game => game.code !== code)
  if (type === "code") {
    publicGames.forEach((game) => {
      game.code !== code && temparr.push(game);
    });
    publicGames = [...temparr];
    temparr = [];
  } else if (type === "socketId") {
    publicGames.forEach((game) => {
      game.socketID !== code && temparr.push(game);
    });
    publicGames = [...temparr];
    temparr = [];
  }
};

//returns the difference in time(minutes) b/n two date objects
//for v2 release
// const checkDuration = (time) => {
//   const result = differenceInMinutes(time, new Date())
// }

console.log(`⚡: Server is live! PORT = ` + 7744);

io.on("connection", (socket) => {
  //user connection
  console.log("a user connected.");

  socket.on("postPublicGame", (data) => {
    publicGames.push({
      ...data,
      socketID: socket.id,
      time: new Date(),
    });
  });

  socket.on("publicGames", () => {
    let temparr = [];
    let removedArr = [];
    publicGames.forEach((game) => {
      if (game.socketID !== socket.id) {
        temparr.push({ ...game, time: createReadableDate(game.time) });
      }
      //if public game has been up for 3 minutes remove from public game
      //   else { removedArr.push(game.code) }
    });

    socket.emit("getPublicGames", temparr);

    if (removedArr.length > 0) {
      removedArr.forEach((code) => {
        removePublicGame(code, "code");
      });
    }

    temparr = [];
    removedArr = [];
  });

  socket.on("joinPublicGame", (codeId) => {
    removePublicGame(codeId, "code");
  });

  socket.on("join-room", async (room) => {
    const clients = await io.of("/").in(room).fetchSockets();
    console.log("joined")
    // , { clients, room, id: socket.id }
    let tempSocketObj = roomSocketObj[room];
    if (tempSocketObj && tempSocketObj.includes(socket.id)) {
      io.to(room).emit("samePerson", "You can't join a game you created");
    } else {
      roomSocketObj = {
        ...roomSocketObj,
        [room]: tempSocketObj ? [...tempSocketObj, socket.id] : [socket.id],
      };
    }

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

    socket.on("sendCrownType", (data) => {
      io.to(room).emit("getCrownType", data);
    });

    socket.on("sendGameMessage", (data) => {
      io.to(room).emit("getGameMessage", data);
      // socket.broadcast.to(room).emit("getGameMessage", data);
    });
    socket.on("sendResetGameRequest", (data) => {
      // io.to(room).broadcast.emit("getResetGameRequest", data);
      socket.broadcast.to(room).emit("getResetGameRequest", data);
    });
    //send king icons
      socket.on("sendGameKingIcon", (data) => {
      socket.broadcast.to(room).emit("getGameKingIcon", data);
    });
    socket.on("sendResetGameMessage", (data) => {
      io.to(room).emit("getResetGameMessage", data);
    });

    socket.on("sendRejectGameMessage", (data) => {
      // io.to(room).emit("getRejectGameMessage", data);
      socket
        .to(room)
        .emit("getRejectGameMessage", { data, type: "draw-rejected" });
    });
    //new added for reject game requests
    socket.on("sendRejectDrawGameMessage", (data) => {
      // io.to(room).emit("getRejectGameMessage", data);
      socket
        .to(room)
        .emit("getRejectDrawGameMessage", { data, type: "New-Game-rejected" });
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
  // socket.on("leave", (room) => {
  //   socket.leave(room);
  //   console.log(`user leave a room ${room}`)
  //   if (rooms[room]) {
  //     rooms[room].delete(socket.id);
  //   }
  // });
  socket.on("leave", (room) => {
    socket.leave(room);
    console.log(`user leave a room ${room}`);
    if (rooms[room]) {
      rooms[room].delete(socket.id);
      if (rooms[room].size === 0) {
        delete rooms[room];
        console.log(`Room ${room} has been deleted`);
      }
    }
  });

  //when disconnect
  socket.on("disconnect", () => {
    console.log("user disconnected");
    Object.keys(rooms).forEach((room) => {
      rooms[room].delete(socket.id);
      if (rooms[room].size === 0) delete rooms[room];
    });

    removePublicGame(socket.id, "socketId");
  });
});

instrument(io, {
  auth: false,
  mode: "development",
});

const PORT = process.env.PORT || 7744;
httpServer.listen(PORT);
