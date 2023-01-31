import React, { useEffect, useState,useRef } from "react";
import Board from "./components/Board.js";
import { returnPlayerName } from "./components/utils.js";
import "./game.css";
import { getMoves, movePiece } from "./components/ReactCheckers";
import WinnerModal from "./components/WinnerModal";
import Pusher from "pusher-js";
import { io } from "socket.io-client";
const Game = () => {
  const [isWinnerModalOpen, setIsWinnerModalOpen] = useState(false);
  const [winnerPlayer, setWinnerPlayer] = useState(null);
 const [channalName, setChannalName] = useState(null)
  const [columns, setColumns] = useState({
    a: 0,
    b: 1,
    c: 2,
    d: 3,
    e: 4,
    f: 5,
    g: 6,
    h: 7,
  });
  function createPiece(location, player) {
    let piece = {};

    piece.player = player;
    piece.location = location;
    piece.isKing = false;

    return piece;
  }
  function initPlayers(board) {
    const player1 = [
      "a8",
      "c8",
      "e8",
      "g8",
      "b7",
      "d7",
      "f7",
      "h7",
      "a6",
      "c6",
      "e6",
      "g6",
    ];
    const player2 = [
      "b3",
      "d3",
      "f3",
      "h3",
      "a2",
      "c2",
      "e2",
      "g2",
      "b1",
      "d1",
      "f1",
      "h1",
    ];

    player1.forEach(function (i) {
      board[i] = createPiece(i, "player1");
    });

    player2.forEach(function (i) {
      board[i] = createPiece(i, "player2");
    });

    return board;
  }
  function createBoard() {
    let board = {};

    for (let key in columns) {
      if (columns.hasOwnProperty(key)) {
        for (let n = 1; n <= 8; ++n) {
          let row = key + n;
          board[row] = null;
        }
      }
    }

    board = initPlayers(board);

    return board;
  }
  const [gameState, setGameState] = useState({
    players: 2,
    history: [
      {
        boardState: createBoard(),
        currentPlayer: true,
      },
    ],
    activePiece: null,
    moves: [],
    jumpKills: null,
    hasJumped: null,
    stepNumber: 0,
    winner: null,
  });

  function getCurrentState() {
    const history = gameState?.history?.slice(0, gameState.stepNumber + 1);
    return history[history.length - 1];
  }

  function handleClick(coordinates) {
    if (gameState.winner !== null) {
      return;
    }

    const currentState = getCurrentState();
    const boardState = currentState.boardState;
    const clickedSquare = boardState[coordinates];

    // Clicked on a piece
    if (clickedSquare !== null) {
      // Can't select opponents pieces
      if (
        clickedSquare.player !== returnPlayerName(currentState.currentPlayer)
      ) {
        return;
      }

      // Unset active piece if it's clicked
      if (
        gameState.activePiece === coordinates &&
        gameState.hasJumped === null
      ) {
        setGameState({
          ...gameState,
          activePiece: null,
          moves: [],
          jumpKills: null,
        });
        return;
      }

      // Can't choose a new piece if player has already jumped.
      if (gameState.hasJumped !== null && boardState[coordinates] !== null) {
        return;
      }

      // Set active piece
      let movesData = getMoves(
        columns,
        boardState,
        coordinates,
        clickedSquare.isKing,
        false
      );

      setGameState({
        ...gameState,
        activePiece: coordinates,
        moves: movesData[0],
        jumpKills: movesData[1],
      });

      return;
    }

    // Clicked on an empty square
    if (gameState.activePiece === null) {
      return;
    }

    // Moving a piece
    if (gameState.moves.length > 0) {
      const postMoveState = movePiece(columns, coordinates, gameState);

      if (postMoveState === null) {
        return;
      }

      updateStatePostMove(postMoveState);

      // Start computer move is the player is finished
      if (
        postMoveState.currentPlayer === false &&
        postMoveState.winner === null
      ) {
        // computerTurn();
      }
    }
  }

  function updateStatePostMove(postMoveState) {
    setGameState({
      history: gameState.history.concat([
        {
          boardState: postMoveState.boardState,
          currentPlayer: postMoveState.currentPlayer,
        },
      ]),
      activePiece: postMoveState.activePiece,
      moves: postMoveState.moves,
      jumpKills: postMoveState.jumpKills,
      hasJumped: postMoveState.hasJumped,
      stepNumber: gameState.history.length,
      winner: postMoveState.winner,
    });
     socket.current.emit("sendMessage", {
      winnerPlayer,
      boardState:postMoveState.boardState,
      currentPlayer: postMoveState.currentPlayer,
    });
  }

  const stateHistory = gameState.history;
  const currentState = stateHistory[gameState?.stepNumber];
  const boardState = currentState?.boardState;
  const currentPlayer = currentState?.currentPlayer;


  const firstPlayer = JSON.parse(localStorage.getItem("playerOne"));
  const secondPlayer = JSON.parse(localStorage.getItem("playerTwo"));
  const gameId = localStorage.getItem("gameId");
  const playerOneIp = localStorage.getItem("playerOneIp");
  const playerTwoIp = localStorage.getItem("playerTwoIp");
  let gameStatus;
  switch (gameState.winner) {
    case "player1pieces":
      gameStatus = "Player One Wins!";
      break;
    case "player2pieces":
      gameStatus = "Player Two Wins!";

      break;
    case "player1moves":
      gameStatus = "No moves left - Player One Wins!";
      break;
    case "player2moves":
      gameStatus = "No moves left - Player Two Wins!";
      break;
    default:
      gameStatus =
        currentState?.currentPlayer === true
          ? firstPlayer?.name
          : secondPlayer?.name;
      break;
  }
  useEffect(() => {
    if (gameState.winner || winnerPlayer) {
      setIsWinnerModalOpen(true);
    }
    if (gameStatus === "Player One Wins!") {
      setWinnerPlayer(firstPlayer);
    } else if (gameStatus === "Player Two Wins!") {
      setWinnerPlayer(secondPlayer);
    }
  }, [gameState, gameStatus]);
  // useEffect(() => {
  //   if (gameId) {
  //     const pusher = new Pusher(process.env.REACT_APP_PUSHER_KEY, {
  //       cluster: "ap2",
  //       encrypted: false,
  //       authEndpoint: `${process.env.REACT_APP_BACKEND_URL}sockets/authenticate`,
  //     });
  //     const channel1 = pusher.subscribe(`private-dama.${gameId}`);
  //     // console.log({channel1})
  //     if (channel1.subscribed) {
  //       console.log('Subscribed to channel');
  //     } else {
  //       console.log('Not subscribed to channel')
  //     }
  //     channel1.bind("pusher:subscription_succeeded", ( ) => {
        
  //       channel1.trigger("client-game-board", {
  //         winnerPlayer,
  //         boardState,
  //         currentPlayer,
  //       });
  //     });
  //     channel1.bind(
  //       "client-game-board",
  //       function ({ winnerPlayer, boardState, currentPlayer }) {
  //         setWinnerPlayer(winnerPlayer);
  //         setGameState((prevGameState) => {
  //           return {
  //             ...prevGameState,
  //             history: prevGameState.history?.map((item) => {
  //               return {
  //                 ...item,
  //                 boardState: boardState,
  //                 currentPlayer: currentPlayer,
  //               };
  //             }),
  //           };
  //         });
  //         console.log("triggered", boardState);
  //       }
  //     );
  //     return () => {
  //       channel1.unbind("client-game-board");
  //       channel1.unbind("pusher:subscription_succeeded");
  //     };
  //     // channel1.unbind("client-game-board")
  //   }
  // }, [boardState]);
const socket = useRef();
  useEffect(() => {
    socket.current = io("https://dama.up.railway.app",{port:7744});
    console.log("first", socket.current)
    socket.current.on("wel",(data)=>console.log(data))
    socket.current.on("getMessage", ({winnerPlayer,boardState,currentPlayer}) => {
      // setUpdatedState({winnerPlayer,boardState,currentPlayer})
      console.log("board",currentPlayer);
      setWinnerPlayer(winnerPlayer);
      setGameState((prevGameState) => {
        return {
          ...prevGameState,
          history: prevGameState.history?.map((item) => {
            return {
              ...item,
              boardState: boardState,
              currentPlayer: currentPlayer,
            };
          }),
        };
      });
    });
  }, []);

 
  return (
    <div
      className={`
     ${
       currentPlayer === true
         ? currentPlayer === true && !playerOneIp
           ? "pointer-events-none"
           : ""
         : currentPlayer === false
         ? currentPlayer === false && !playerTwoIp
           ? "pointer-events-none"
           : ""
         : ""
     }
    relative  flex flex-col min-h-screen items-center justify-center`}
    >
      <div className={`absolute top-4`}>
        <div
          onClick={() => this.openModal(true)}
          className="flex flex-col items-center space-y-2"
        >
          <img
            src="https://t3.ftcdn.net/jpg/03/46/83/96/240_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg"
            className="h-12 rounded-full"
            alt=""
          />
          <h4 className="text-white capitalize text-lg font-semibold">
            {firstPlayer?.name}
          </h4>
        </div>
      </div>
      {/* second player */}
      <div className="bg-green-500">{gameStatus}</div>
      <div className={`absolute bottom-4`}>
        <div className="flex flex-col items-center space-y-2">
          <img
            src="https://t3.ftcdn.net/jpg/03/46/83/96/240_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg"
            className="h-12 rounded-full"
            alt=""
          />
          <h4 className="text-white capitalize text-lg font-semibold">
            {secondPlayer?.name}
          </h4>
        </div>
      </div>
      <div className="game-board">
        <Board
          boardState={boardState}
          currentPlayer={currentPlayer}
          activePiece={gameState.activePiece}
          moves={gameState.moves}
          columns={columns}
          onClick={(coordinates) => handleClick(coordinates)}
        />
      </div>
      <WinnerModal
        isWinnerModalOpen={isWinnerModalOpen}
        setIsWinnerModalOpen={setIsWinnerModalOpen}
        winnerPlayer={winnerPlayer}
      />
    </div>
  );
};

export default Game;
