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

/* an array of active players in a season
leagueActivePlayers = [
  { seasonId : [userObject, userObject, ...]}
] */
let leagueActivePlayers = [];

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


/*
  Remove player from leagueActivePlayers using socket.id
  check if user exists and remove if exists
  */
const removeLeagueActivePlayer = (socketId) => {
  if (leagueActivePlayers.length === 0) return

  leagueActivePlayers.forEach((season, index) => {
    const updatedSeason = season[Object.keys(season)[0]].filter(player => player.socketId !== socketId)

    if (updatedSeason) {

      if (updatedSeason.length === 0) leagueActivePlayers.splice(index, 1);
      else
        season[Object.keys(season)[0]] = updatedSeason
    }

  })

  console.log("league", leagueActivePlayers)
}

const joinRoom = async (socket, room) => {
  const clients = await io.of("/").in(room).fetchSockets();
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
}
//returns the difference in time(minutes) b/n two date objects
//for v2 release
// const checkDuration = (time) => {
//   const result = differenceInMinutes(time, new Date())
// }

console.log(`⚡: Server is live! PORT = ` + 7744);

io.on("connection", (socket) => {
  //user connection
  console.log("user connected")
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

  socket.on("join-room", room => {
    joinRoom(socket, room)
  });


  socket.on("checkInLeague", (data) => {
    const seasonId = data.seasonId;
    const userData = data.userData;

    const season = leagueActivePlayers.find((season) => season.hasOwnProperty(seasonId));

    if (!season) {
      leagueActivePlayers.push({ [seasonId]: [{ ...userData, socketId: socket.id }] });
      console.log(leagueActivePlayers)

      return;
    }

    const userExists = season[seasonId].some((user) => user.id === userData.id);

    if (!userExists) {
      season[seasonId].push({ ...userData, socketId: socket.id });
    }

  });


  socket.on("clearSeason", (data) => {
    const seasonExits = leagueActivePlayers.find(season => season.hasOwnProperty(data.seasonId))

    if (seasonExits) {
      const newPlayers = leagueActivePlayers.filter(season => !season.hasOwnProperty(data.seasonId))
      leagueActivePlayers = [...newPlayers]
    }
  })

  socket.on("getActiveSeasonPlayers", (data) => {
    const seasonExits = leagueActivePlayers.find(season => season.hasOwnProperty(data.seasonId))

    seasonExits ?
      io.emit("activeSeasonPlayers", { activePlayers: seasonExits[data.seasonId] })
      : io.emit("activeSeasonPlayers", { error: "Season not found" })

  })


  socket.on("join-room-league", data => {
    const { gameId, seasonId, sender, receiverId } = data

    const season = leagueActivePlayers.find((season) => season.hasOwnProperty(seasonId))

    if (season) {
      const playerTwo = season[seasonId].find((user) => user.id === receiverId)
      console.log("playerTwo", playerTwo)
      if (playerTwo) {
        joinRoom(socket, gameId)
        console.log("playerTwo", playerTwo.socketId)
        io.to(playerTwo.socketId).emit("play-league-invite", {
          sender,
          gameId,
          seasonId
        })

      } else {
        //player two has disconnected error
        io.to(socket.id).emit("play-league-invite-error", "Play two has left the game")
      }

    } else {
      checkInLeague({ seasonId, userData: sender })
      //send player two had disconnected message
      io.to(socket.id).emit("play-league-invite-error", "Play two has left the game")

    }
  })



  socket.on("leave", (room) => {
    socket.leave(room);
    if (rooms[room]) {
      rooms[room].delete(socket.id);
      if (rooms[room].size === 0) {
        delete rooms[room];
      }
    }
  });

  //when disconnect
  socket.on("disconnect", () => {
    Object.keys(rooms).forEach((room) => {
      rooms[room].delete(socket.id);
      if (rooms[room].size === 0) delete rooms[room];
    });

    removePublicGame(socket.id, "socketId");
    removeLeagueActivePlayer(socket.id)
  });

});

instrument(io, {
  auth: false,
  mode: "development",
});

const PORT = process.env.PORT || 7744;
httpServer.listen(PORT);