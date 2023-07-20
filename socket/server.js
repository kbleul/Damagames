import { createServer } from "http";
import { Server } from "socket.io";
import { formatDistance } from "date-fns";
import { instrument } from "@socket.io/admin-ui";
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
let leagueActivePlayers = new Map();

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
  Remove player from leagueActivePlayers using by == "socketId" || "userId" by default
  check if user exists and remove if exists
  */
const removeLeagueActivePlayer = (id, by = "userId") => {

  leagueActivePlayers.forEach((value, key, map) => {

    const updatedSeason = by === "socketId"
      ? leagueActivePlayers.get(key).filter(player => {
        return player.socketId !== id
      })
      : leagueActivePlayers.get(key).filter(player => {
        return player.id !== id
      })
    if (updatedSeason) {
      if (updatedSeason.length === 0) map.delete(key)
      else map.set(key, updatedSeason);
    }
  })
}

const getLeagueActivePlayer = (seasonId, userId) => {
  if (leagueActivePlayers.size === 0) return

  const returnedUser = leagueActivePlayers.get(seasonId).find(player => player.id === userId)

  return returnedUser
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
    console.log("checkInLeague1")

    const seasonId = data.seasonId;
    const userData = data.userData;

    const season = leagueActivePlayers.get(seasonId);

    if (!season) {
      leagueActivePlayers.set(seasonId, [{ ...userData, socketId: socket.id }]);
      console.log("checkInLeague", seasonId, userData.id, leagueActivePlayers)

      return;
    }

    const userIndex = season.findIndex((user) => user.id === userData.id);

    if (userIndex === -1) {
      // User doesn't exist, add a new object to the array
      season.push({ ...userData, socketId: socket.id });
    } else {
      // User already exists, update the existing object
      season[userIndex] = { ...season[userIndex], socketId: socket.id };
    }

    console.log("checkInLeague", seasonId, userData.id, leagueActivePlayers)

  });



  socket.on("clearSeason", (data) => {
    const seasonExits = leagueActivePlayers.get(data.seasonId)

    seasonExits && leagueActivePlayers.delete(data.seasonId)
  })

  socket.on("getActiveSeasonPlayers", (data) => {
    const season = leagueActivePlayers.get(data.seasonId)

    season ?
      io.emit("activeSeasonPlayers", { activePlayers: season })
      : io.emit("activeSeasonPlayers", { error: "Season not found" })

  })


  socket.on("join-room-league", async (data) => {

    const { gameId, gameCode, seasonId, sender, receiverId } = data
    const isPlayerTwo = data.isPlayerTwo || null

    const season = leagueActivePlayers.get(seasonId)

    if (season) {
      const playerTwo = season.find((user) => user.id === receiverId)

      if (playerTwo) {
        const room = gameId

        joinRoom(socket, room)

        if (!isPlayerTwo) {
          io.to(playerTwo.socketId).emit("play-league-invite", {
            sender,
            gameId,
            gameCode,
            seasonId
          })
        } else {
          const playerOne = getLeagueActivePlayer(seasonId, receiverId)
          const playerTwo = getLeagueActivePlayer(seasonId, sender.id)
          if (playerOne && playerTwo) {
            removeLeagueActivePlayer(receiverId)
            removeLeagueActivePlayer(sender.id)

            io.to(playerOne.socketId).emit("leauge-game-started", {
              message: "League game started !",
              seasonId,
              gameId: room,
              gameCode,
              playerOne,
              playerTwo
            })

            io.to(playerTwo.socketId).emit("leauge-game-started", {
              message: "League game started !",
              seasonId,
              gameId: room,
              gameCode,
              playerOne,
              playerTwo
            })

          }
        }

      } else {
        //player two has disconnected error
        io.to(socket.id).emit("play-league-invite-error", {
          AMH: "ጓደኛዎ ጨዋታውን ለቆ ወቷል። ከሌላ ሰው ጋር ለመጫወት ይሞክሩ።",
          ENG: "Player has left the game. Try playing with someone else."
        })
      }

    } else {
      // checkInLeague({ seasonId, userData: sender })
      //send player two had disconnected message
      io.to(socket.id).emit("play-league-invite-error", {
        AMH: "ከዚህ የሊግ ጨዋታ ጋር መገናኘት አልተቻለም። ከትንሽ ደቂቃ በኋላ እንደገና ይሞክሩ።",
        ENG: "Couldn't connect to this season. Try again in a minute"
      })

    }
  })


  socket.on("reject-league-invite", data => {
    const { sender, receiverId, seasonId } = data

    let season = leagueActivePlayers.get(seasonId)
    let receiver

    if (season) {
      receiver = season.filter(user => { return user.id === receiverId })

      if (receiver) {
        io.to(receiver[0].socketId).emit("get-reject-league-invite", {
          messageHeading: {
            "ENG": "Request rejected by " + sender.username,
            "AMH": `የእንጫዎት ጥያቄዎ  በ${sender.username} ተቀባይነት አላገኘም።`
          },
          messagePara: {
            "ENG": "Try playing with someone else",
            "AMH": "ከሌላ ሰው ጋር ለመጫወት ይሞክሩ"
          }
        })
      }

    }

  })


  socket.on("remove-from-active-league", () => {
    removeLeagueActivePlayer(socket.id, "socketId")

    console.log("after remove", leagueActivePlayers)
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
    console.log("Disconnected")
    Object.keys(rooms).forEach((room) => {
      rooms[room].delete(socket.id);
      if (rooms[room].size === 0) delete rooms[room];
    });

    removePublicGame(socket.id, "socketId");
    removeLeagueActivePlayer(socket.id, "socketId")
    console.log(leagueActivePlayers)
  });

});

instrument(io, {
  auth: false,
  mode: "development",
});

const PORT = process.env.PORT || 7744;
httpServer.listen(PORT);