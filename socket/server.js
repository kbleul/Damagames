import { createServer } from "http";
import { Server } from "socket.io";
import { format, formatDistance, formatRelative, subDays } from 'date-fns'
import { instrument } from "@socket.io/admin-ui";
import { Console } from "console";
import { Socket } from "dgram";
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
      "http://172.17.104.251:3000",
      "https://dama-blue.vercel.app",
      "https://admin.socket.io",
      "http://localhost:3000",
      "http://172.17.104.251:3000",
    ],
    credentials: true,
  },
});

console.log("⚡: Server started at port : ",process.env.PORT ? process.env.PORT :7744)

let publicGames = []

const createReadableDate = (date) => {
  const newdate = formatDistance( date, new Date(),
  { includeSeconds: true });
  console.log("date" , newdate)
  return newdate
}

//type === "code" || "socketId"  
// SO WE CAN DELETE USING CODE OR SOCKETID
const removePublicGame = (code,type) => {
  console.log({code})
  console.log(publicGames)

  let temparr = []
 // publicGames.filter(game => game.code !== code)
 if(type === "code") {
  publicGames.forEach(game => {
    game.code !== code && temparr.push(game)
    console.log("------",game , code, game.code === code)
  })
  publicGames = [...temparr]
  temparr = []
 }
 else if(type === "socketId") {
  publicGames.forEach(game => {
    game.socketID !== code && temparr.push(game)
    console.log("------",game , code, game.socketID === code)
  })
  publicGames = [...temparr]
  temparr = []
 }
 

  console.log("********",publicGames ,"=======", temparr)

}

io.on("connection", (socket) => {
  console.log(socket.id)
  //user connection
  console.log("a user connected.");

  socket.on("postPublicGame", data => {
//    console.log({"date" : createReadableDate(new Date(data.time)) })
    publicGames.push({
      ...data, 
      socketID : socket.id,
      time : new Date()
    })
    
    console.log("======================================",publicGames)
  })

  socket.on("publicGames", ()  => {
console.log("public")
let temparr = []
publicGames.forEach(game => { 
  temparr.push({...game, time : createReadableDate(game.time) })
})
    io.to(socket.id).emit("getPublicGames", temparr)
  })

  socket.on("joinPublicGame", codeId => {
  console.log({codeId})

    removePublicGame(codeId , "code")
  })

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
    removePublicGame(socket.id, "socketId")
    console.log("new", publicGames)
  });
});
instrument(io, {
  auth: false,
});
const PORT = process.env.PORT || 7744;
httpServer.listen(PORT);
