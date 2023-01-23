import React, { useEffect, useState, useContext, useRef } from "react";
import Board from "./components/Board.js";
import { returnPlayerName } from "./components/utils.js";
import "./game.css";
import { motion, useAnimation } from "framer-motion";
import { getMoves, movePiece } from "./components/ReactCheckers";
import WinnerModal from "./components/WinnerModal";
import ExitWarningModal from "./components/ExitWarningModal";
import socket from "../utils/socket.io";
import { TurnContext } from "../context/TurnContext";
import { useNavigate, useParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import RematchModal from "./components/RematchModal";
import useSound from "use-sound";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import DrawGameModal from "./components/DrawGameModal.js";
import { BsFillChatFill } from "react-icons/bs";
import { FaTimes, FaTelegramPlane } from "react-icons/fa";
import { getSmartMove } from "./components/Opponent.js";
import { useHome } from "../context/HomeContext";
import winSound from '../assets/sounds/win.mp3';
import moveSound from '../assets/sounds/move.mp3';
import strikeSound from '../assets/sounds/strike.mp3';
import { ThreeDots } from "react-loader-spinner";

const Game = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [playMove] = useSound(moveSound);
  const [playStrike] = useSound(strikeSound);
  const [playWin] = useSound(winSound);
 const { soundOn , setSoundOn  } = useHome();
  const [MyTurn, setMyTurn] = useContext(TurnContext);
  const [isWinnerModalOpen, setIsWinnerModalOpen] = useState(false);
  const [isExitModalOpen, setIsExitModalOpen] = useState(false);

  const [isRematchModalOpen, setIsRematchModalOpen] = useState(false);
  const [isDrawModalOpen, setIsDrawModalOpen] = useState(false);
  const [winnerPlayer, setWinnerPlayer] = useState(null);

  const [pawns, setPawns] = useState([0, 0]);
  const [moves, setMoves] = useState([0, 0]);
  // const [playMove] = useSound(require("../assets/sounds/move.mp3"), { volume : 0.25 });
  const messageInputRef = useRef();
  const [messageInputOpen, setMessageInputOpen] = useState(false);
  const [latestMessage, setLatestMessage] = useState(null);
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  const savedData = [
    "gameId",
    "playerOne",
    "playerTwo",
    "playerOneIp",
    "playerTwoIp",
    "playerOneToken",
    "p1",
    "p2",
    "players",
    "bt_coin_amount"
  ];
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

  useEffect(() => {
    if (id == 1) {
      setGameState((prevGameState) => {
        return { ...prevGameState, players: 1 };
      });
    }
  }, [id]);

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
      soundOn && playMove()

console.log("gameState",gameState)
console.log("postMoveState",postMoveState)
console.log("current", getCurrentState())
      // Start computer move is the player is finished
      if (
        postMoveState.currentPlayer === false &&
        postMoveState.winner === null
      ) {
      computerTurn(postMoveState);
      }
    }
  }

  //computer turn
  function computerTurn(newMoveState , piece = null) { //console.log("gameState",gameState)
    // if (gameState.players > 1 || id == 1) {
    //   return;
    // }
console.log({newMoveState})
    setTimeout(() => {
     // const currentState = getCurrentState();
      const boardState = newMoveState.boardState;
      let computerMove;
      let moveTo;
      let coordinates;
      let mergerObj;

        computerMove = getSmartMove(columns, gameState, boardState, "player2");
        console.log({ computerMove });
        
        coordinates = computerMove.piece;
        moveTo = computerMove.moveTo;

        let tempHistory = gameState.history
        tempHistory.push(newMoveState)
        console.log("SDfds", tempHistory)
        mergerObj = {...gameState , activePiece : computerMove.piece , 
          moves : [computerMove.moveTo], players : 1 , stepNumber : ++gameState.stepNumber , 
          history : tempHistory }

          console.log("newobj", mergerObj )
  

      const clickedSquare = boardState[coordinates];
      let movesData 
      if(!piece) {
        movesData = getMoves(
          columns,
          newMoveState.boardState,
          coordinates,
          clickedSquare.isKing,
          false
        );
      } else {
        movesData = getMoves(
            columns,
            newMoveState.boardState,
            piece,
            newMoveState.boardState.isKing,
            true
          );
          coordinates = piece;
          moveTo =
            movesData[0][Math.floor(Math.random() * movesData[0].length)];
            
      }
     
      // console.log("gg",coordinates,movesData[0],movesData[1])

      setGameState((prevState) => {
        return {
          ...prevState,
          activePiece: coordinates,
          moves: movesData[0],
          jumpKills: movesData[1],
        };
      });
     

      setTimeout(() => {
        //console.log({ moveTo: mergerObj });
        
        const postMoveState = movesData[1] ? movePiece(columns, mergerObj.moves[0], {...mergerObj , jumpKills : movesData[1]}) : 
        movePiece(columns, mergerObj.moves[0], mergerObj);
        console.log({ postMoveState });
        if (postMoveState === null) {
          return;
        }

        updateStatePostMove(postMoveState);

        if(movesData[1] && soundOn) { playStrike(); }
        else if(!movesData[1] && soundOn) { playMove(); }

        // If the computer player has jumped and is still moving, continue jump with active piece
        if (postMoveState.currentPlayer === false) {
          computerTurn(postMoveState,postMoveState.activePiece);
        }
      }, 600);
    }, 1000);
  }

  //update the game state after move
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

    socket.emit("sendGameMessage", {
      winnerPlayer: postMoveState.winner,
      boardState: postMoveState.boardState,
      currentPlayer: postMoveState.currentPlayer,
      turnPlayer: postMoveState.currentPlayer ? "player1" : "player2",
    });

    // playOff();
    // playActive();
    // console.log("first",postMoveState.currentPlayer)
  }

  const stateHistory = gameState.history;
  const currentState = stateHistory[gameState?.stepNumber];
  const boardState = currentState?.boardState;
  const currentPlayer = currentState?.currentPlayer;

  const firstPlayer = JSON.parse(localStorage.getItem("playerOne"));
  const secondPlayer = JSON.parse(localStorage.getItem("playerTwo"));
  const playerOneIp = localStorage.getItem("playerOneIp");
  const playerTwoIp = localStorage.getItem("playerTwoIp");
  const btCoin = localStorage.getItem("bt_coin_amount");
  
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
      soundOn && playWin();
    }
    // if (gameStatus === "Player One Wins!") {
    //   setWinnerPlayer(firstPlayer);
    // } else if (gameStatus === "Player Two Wins!") {
    //   setWinnerPlayer(secondPlayer);
    // }
  }, [gameState, gameStatus, winnerPlayer]);

  const resetGame = () => {
    socket.emit("sendResetGameRequest", { status: "Pending" });
  };
  const rejectGameRequest = () => {
    socket.emit("sendRejectGameMessage", { status: "Reject" });
  };
  const acceptGameRequest = () => {
    socket.emit("sendResetGameMessage", {
      winnerPlayer: null,
      gameState: {
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
      },
      isWinnerModalOpen: false,
    });
  };

  const drawGame = () => {
    socket.emit("sendDrawGameRequest", { status: "Draw" });
  };

  //send chat message
  const sendChatMessage = () => {
    if (!messageInputRef.current.value) {
      toast("please write your message");
      messageInputRef.current.focus();
      return;
    }
  
    socket.emit("sendChatMessage", {
      message: messageInputRef.current.value,
    });
    setMessageInputOpen(false);
  };
  const handleSubmit = (e) => {
    if (e.key === "Enter") {
      sendChatMessage();
    }
  };
  const openChatFilled = () => {
    setMessageInputOpen(true);
  };

  const calcPawns = (boardState) => {
    let [prevP1 , prevP2] = pawns
    let player1Counter = 0;
    let player2Counter = 0;

    Object.keys(boardState).forEach((key) => {
      if (boardState[key]?.player === "player1") {
        ++player1Counter;
      }
      if (boardState[key]?.player === "player2") {
        ++player2Counter;
      }
    });

    setPawns([12 - player2Counter, 12 - player1Counter]);
    if(12 - player1Counter !== prevP1 || 12 - player2Counter !== prevP2) { 
      soundOn && playStrike() 
    }  
    console.log([player1Counter, player2Counter]);
  };

  useEffect(() => {
    // let cPlayer = currentPlayer
    socket.on(
      "getGameMessage",
      ({ winnerPlayer, boardState, currentPlayer, turnPlayer }) => {
        // setUpdatedState({winnerPlayer,boardState,currentPlayer})
        const tempMoves = moves;
        console.log("called");
        turnPlayer === "player2" ? ++tempMoves[0] : ++tempMoves[1];
        setMoves(tempMoves);

        console.log("turnPlayer", turnPlayer);
        setMyTurn(turnPlayer);
        console.log("board", boardState);
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
        calcPawns(boardState);
      }
    );

    socket.on(
      "getResetGameMessage",
      ({ winnerPlayer, gameState, isWinnerModalOpen }) => {
        setGameState(gameState);
        setWinnerPlayer(winnerPlayer);
        setIsWinnerModalOpen(isWinnerModalOpen);
        setIsDrawModalOpen(false);
        setIsRematchModalOpen(false);
        setMyTurn("player1");
        setPawns([0, 0]);
        setMoves([0, 0]);
      }
    );
    socket.on("getResetGameRequest", ({ status }) => {
      setIsRematchModalOpen(true);
    });
    socket.on("getDrawGameRequest", ({ status }) => {
      setIsDrawModalOpen(true);
    });
    socket.on("getRejectGameMessage", ({ status }) => {
      toast("You friend did not accept the request");
      savedData.forEach((data) => {
        localStorage.getItem(data) && localStorage.removeItem(data);
      });
      navigate("/create-game");
    });

    //listen for if user left room
    socket.on("userLeaveMessage", (data) => {
      alert(data);
      setTimeout(() => {
        savedData.forEach((data) => {
          localStorage.getItem(data) && localStorage.removeItem(data);
        });
        navigate("/create-game");
      }, 1000);
    });

    //listen for if the user exit the game
    socket.on("getExitGameRequest", (data) => {
      alert("you friend has left the game😢");
      setTimeout(() => {
        savedData.forEach((data) => {
          localStorage.getItem(data) && localStorage.removeItem(data);
        });
        navigate("/create-game");
      }, 10);
    });
    //listen for chat message
    socket.on("getChatMessage", ({ message }) => {
      setLatestMessage(message);
    });
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setLatestMessage(null);
    }, 4000);
  }, [latestMessage]);

  //reverse board
  function dict_reverse(obj) {
    let new_obj = {};
    let rev_obj = Object.keys(obj).reverse();
    rev_obj.forEach(function (i) {
      new_obj[i] = obj[i];
    });
    return new_obj;
  }
  useEffect(() => {
    if (winnerPlayer) {
      if (winnerPlayer === "player1pieces" || winnerPlayer === "player1moves") {
        if (playerOneIp) {
          nameMutationSubmitHandler(firstPlayer);
        }
        return;
      }
      if (winnerPlayer === "player2pieces" || winnerPlayer === "player2moves") {
        if (playerTwoIp) {
          nameMutationSubmitHandler(secondPlayer);
        }
        return;
      }
    }
  }, [winnerPlayer]);
  //send winner
  const gameId = localStorage.getItem("gameId");
  const winnerMutation = useMutation(
    async (newData) =>
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}scores`, newData, {
        headers,
      }),
    {
      retry: false,
    }
  );
  const nameMutationSubmitHandler = async (values) => {
    try {
      winnerMutation.mutate(
        {
          winner: values.id,
          game_id: gameId,
        },
        {
          onSuccess: (responseData) => {
            console.log(responseData?.data);
          },
          onError: (err) => {},
        }
      );
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div
      className={`
  
    relative  flex flex-col min-h-screen items-center justify-evenly `}
    >
      <section className="w-full flex items-end justify-between">
      <button className="text-white" onClick={() => setSoundOn(prev => !prev)}> Sound</button>
        <button
          className="mr-8 border"
          onClick={() => setIsExitModalOpen((prev) => !prev)}
        >
          <svg
            width="24"
            height="26"
            viewBox="0 0 24 26"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M9.7656 1.0273C10.3031 0.866059 10.8708 0.832704 11.4235 0.929896C11.9762 1.02709 12.4985 1.25214 12.9487 1.58707C13.399 1.92201 13.7647 2.35757 14.0167 2.85897C14.2686 3.36037 14.3999 3.91374 14.4 4.4749V22.0237C14.3999 22.5849 14.2686 23.1382 14.0167 23.6396C13.7647 24.141 13.399 24.5766 12.9487 24.9115C12.4985 25.2465 11.9762 25.4715 11.4235 25.5687C10.8708 25.6659 10.3031 25.6325 9.7656 25.4713L2.5656 23.3113C1.82412 23.0889 1.17409 22.6333 0.711938 22.0123C0.249785 21.3913 0.000126947 20.6378 0 19.8637V6.6349C0.000126947 5.86077 0.249785 5.10731 0.711938 4.48628C1.17409 3.86525 1.82412 3.40973 2.5656 3.1873L9.7656 1.0273ZM15.6 3.6493C15.6 3.33104 15.7264 3.02581 15.9515 2.80077C16.1765 2.57573 16.4817 2.4493 16.8 2.4493H20.4C21.3548 2.4493 22.2705 2.82858 22.9456 3.50371C23.6207 4.17884 24 5.09452 24 6.0493V7.2493C24 7.56756 23.8736 7.87278 23.6485 8.09783C23.4235 8.32287 23.1183 8.4493 22.8 8.4493C22.4817 8.4493 22.1765 8.32287 21.9515 8.09783C21.7264 7.87278 21.6 7.56756 21.6 7.2493V6.0493C21.6 5.73104 21.4736 5.42581 21.2485 5.20077C21.0235 4.97573 20.7183 4.8493 20.4 4.8493H16.8C16.4817 4.8493 16.1765 4.72287 15.9515 4.49783C15.7264 4.27278 15.6 3.96756 15.6 3.6493ZM22.8 18.0493C23.1183 18.0493 23.4235 18.1757 23.6485 18.4008C23.8736 18.6258 24 18.931 24 19.2493V20.4493C24 21.4041 23.6207 22.3198 22.9456 22.9949C22.2705 23.67 21.3548 24.0493 20.4 24.0493H16.8C16.4817 24.0493 16.1765 23.9229 15.9515 23.6978C15.7264 23.4728 15.6 23.1676 15.6 22.8493C15.6 22.531 15.7264 22.2258 15.9515 22.0008C16.1765 21.7757 16.4817 21.6493 16.8 21.6493H20.4C20.7183 21.6493 21.0235 21.5229 21.2485 21.2978C21.4736 21.0728 21.6 20.7676 21.6 20.4493V19.2493C21.6 18.931 21.7264 18.6258 21.9515 18.4008C22.1765 18.1757 22.4817 18.0493 22.8 18.0493ZM8.4 12.0493C8.08174 12.0493 7.77652 12.1757 7.55147 12.4008C7.32643 12.6258 7.2 12.931 7.2 13.2493C7.2 13.5676 7.32643 13.8728 7.55147 14.0978C7.77652 14.3229 8.08174 14.4493 8.4 14.4493H8.4012C8.71946 14.4493 9.02468 14.3229 9.24973 14.0978C9.47477 13.8728 9.6012 13.5676 9.6012 13.2493C9.6012 12.931 9.47477 12.6258 9.24973 12.4008C9.02468 12.1757 8.71946 12.0493 8.4012 12.0493H8.4Z"
              fill="#FF4C01"
            />
            <path
              d="M16.8 13.2494H22.8M22.8 13.2494L20.4 10.8494M22.8 13.2494L20.4 15.6494"
              stroke="#FF4C01"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <p className="text-white text-xs">Exit</p>
        </button>
      </section>
      <section className="flex justify-evenly items-center w-full ">
        <div className="">
          <div
            onClick={() => this.openModal(true)}
            className={
              currentPlayer
                ? "flex flex-col items-center space-y-2 p-1 rounded-full border-4 border-orange-color w-16 h-16"
                : "flex flex-col items-center space-y-2 p-1 rounded-full border-2 border-orange-color w-16"
            }
          >
            <img
              src="https://t3.ftcdn.net/jpg/03/46/83/96/240_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg"
              className="h-12 rounded-full"
              alt=""
            />
          </div>
          <h4 className="text-white capitalize  font-semibold text-xs">
            {/* {firstPlayer?.name} */}
          </h4>
        </div>

        <div className="p-1 border border-gray-400 rounded-md">
          <div className="vs w-12 h-12"></div>
          <p className="text-white text-sm text-center">vs</p>
        </div>

        <div className="">
          <div
            className={
              currentPlayer
                ? "flex flex-col items-center space-y-2 p-1 rounded-full border-2 border-yellow-400 w-16"
                : "flex flex-col items-center space-y-2 p-1 rounded-full border-4 border-yellow-400 w-16"
            }
          >
            <img
              src="https://t3.ftcdn.net/jpg/03/46/83/96/240_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg"
              className="h-12 rounded-full"
              alt=""
            />
          </div>
          <h4 className="text-white capitalize  font-semibold text-xs">
            {/* {secondPlayer?.name} */}
            {id == 1 && "Computer"}
          </h4>
        </div>
      </section>

      <section className="flex justify-evenly items-center text-sm w-full">
        <div className="border-r-[3px] border-gray-400 text-white w-1/2 pb-[5vh]">
          <div className="flex justify-center items-center text-[.7rem] gap-x-2 font-bold mb-2">
            <p className="bg-gray-300 text-black pr-[.2rem] w-12 rounded">
              Moves
            </p>
            <p>{moves[0]}</p>
          </div>
          <div className="flex justify-center items-center text-[.7rem] gap-x-2 font-bold mb-2">
            <p className="bg-gray-300 text-black pr-[.2rem] w-12 rounded">
              Pawns
            </p>
            <p>{pawns[0]}</p>
          </div>
        </div>

        <div className="text-white w-1/2 pb-[5vh]">
          <div className="flex justify-center items-center text-[.7rem] gap-x-2 font-bold mb-2">
            <p>{moves[1]}</p>
            <p className="bg-gray-300 text-black pr-[.2rem] w-12 rounded">
              Moves
            </p>
          </div>
          <div className="flex justify-center items-center text-[.7rem] gap-x-2 font-bold mb-2">
            <p>{pawns[1]}</p>
            <p className="bg-gray-300 text-black pr-[.2rem] w-12 rounded">
              Pawns
            </p>
          </div>
        </div>
      </section>
        { !currentPlayer && <ThreeDots
            height="20"
            width="40"
            radius="9"
            color="#f75105"
            ariaLabel="three-dots-loading"
            wrapperStyle={{}}
            wrapperClassName=""
            visible={true}  />}
      <div className="game-board  ">
        <div
          className={` shadow-2xl    ${
            !id
              ? currentPlayer === true
                ? currentPlayer === true && !firstPlayer
                  ? "pointer-events-none"
                  : ""
                : currentPlayer === false
                ? currentPlayer === false && !secondPlayer
                  ? "pointer-events-none"
                  : ""
                : ""
              : ""
          }`}
        >
          <Board
            boardState={
              !id
                ? localStorage.getItem("playerOne")
                  ? dict_reverse(boardState)
                  : boardState
                : boardState
            }
            currentPlayer={currentPlayer}
            activePiece={gameState.activePiece}
            moves={gameState.moves}
            columns={columns}
            onClick={(coordinates) => handleClick(coordinates)}
          />
        </div>
      </div>

      <div onClick={drawGame} className="flex flex-col">
        <div className="p-2 bg-orange-color rounded-full flex flex-col items-center justify-center">
          <svg
            width="22"
            height="22"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M14 13V11H4V13H14ZM16 0C16.5304 0 17.0391 0.210714 17.4142 0.585786C17.7893 0.960859 18 1.46957 18 2V16C18 16.5304 17.7893 17.0391 17.4142 17.4142C17.0391 17.7893 16.5304 18 16 18H2C1.46957 18 0.960859 17.7893 0.585786 17.4142C0.210714 17.0391 0 16.5304 0 16V2C0 0.89 0.89 0 2 0H16ZM14 7V5H4V7H14Z"
              fill="#181920"
            />
          </svg>
        </div>
        <p className="text-xs font-bold text-white">Draw</p>
      </div>
      <div className="absolute right-3 bottom-5 flex items-end justify-end">
        <BsFillChatFill
          onClick={openChatFilled}
          size={30}
          className="text-orange-color"
        />
      </div>
  
      {/* message */}
      {latestMessage && <motion.div
       initial={{ opacity:0 }}
       animate={{ opacity:1}}
       transition={{type: "tween",duration:1,ease:'easeInOut'}}
      className={`absolute top-36  bg-white max-w-sm  p-1 w-44 ${playerOneIp ? "left-3" : "right-3"}
       border border-orange-color rounded-lg m-3`}>
        <div className="text-gray-800">
          <p className="text-start text-sm pl-2 font-medium">
            {latestMessage}
          </p>

          {playerOneIp && (
            <div className="absolute top-0 left-[39px] transform -translate-x-1/2 -translate-y-1/2 rotate-45 w-4 h-4 bg-white border-l border-t border-orange-color"></div>
          )}

          {playerTwoIp && (
            <div className="absolute right-[39px] top-0 transform -translate-x-1/2 -translate-y-1/2 rotate-45 w-4 h-4 bg-white border-l border-t border-orange-color"></div>
          )}
        </div>
      </motion.div>}
      {messageInputOpen && (
        <div className="bg-dark-bg absolute bottom-0 left-0 right-0 p-3 flex flex-col space-y-2 transition duration-1000 ease-out">
          <FaTimes
            onClick={() => {
              setMessageInputOpen(false);
            }}
            size={22}
            className="text-white flex items-end justify-end self-end"
          />
          <div
            className="relative flex items-center w-full border  border-orange-color max-w-md mx-auto
             rounded-md "
          >
            <input
              ref={messageInputRef}
              autoFocus
              onKeyDown={handleSubmit}
              placeholder="write your message..."
              type="text"
              className="bg-transparent  p-2 flex-grow w-full
               text-white focus:outline-none focus:ring-0  font-medium "
            />
            <FaTelegramPlane
              onClick={sendChatMessage}
              className="text-orange-color absolute right-1 cursor-pointer"
              size={28}
            />
          </div>
        </div>
      )}
       <div>
       {btCoin && <p className="text-xs font-bold text-white">Bet : {btCoin} coins</p>}
      </div>
      <ExitWarningModal
        isExitModalOpen={isExitModalOpen}
        set_isExitModalOpen={setIsExitModalOpen}
      />

      <WinnerModal
        isWinnerModalOpen={isWinnerModalOpen}
        setIsWinnerModalOpen={setIsWinnerModalOpen}
        winnerPlayer={winnerPlayer}
        resetGame={resetGame}
        rejectGameRequest={rejectGameRequest}
      />
      <RematchModal
        isRematchModalOpen={isRematchModalOpen}
        setIsRematchModalOpen={setIsRematchModalOpen}
        acceptGameRequest={acceptGameRequest}
        rejectGameRequest={rejectGameRequest}
      />
      <DrawGameModal
        isDrawModalOpen={isDrawModalOpen}
        setIsDrawModalOpen={setIsDrawModalOpen}
        acceptGameRequest={acceptGameRequest}
        rejectGameRequest={rejectGameRequest}
      />
      <Toaster />
    </div>
  );
};

export default Game;

/*


{!winnerPlayer && currentPlayer === true
          ? currentPlayer === true && !firstPlayer
            ? "flex flex-col items-center space-y-2 p-1 rounded-full border border-yellow-400"
            : "flex flex-col items-center space-y-2 p-1 rounded-full border-4 border-yellow-400"
          : currentPlayer === false
          ? currentPlayer === false && !secondPlayer
            ? "flex flex-col items-center space-y-2 p-1 rounded-full border-4 border-yellow-color"
            : "flex flex-col items-center space-y-2 p-1 rounded-full border-4 border-yellow-400"
          : "flex flex-col items-center space-y-2 p-1 rounded-full border border-orange-color"}

            // <div className="p-3">
      //   {/* {gameStatus} }
      //   <div className={`py-1 px-3 rounded-lg ${currentPlayer === true ? "bg-red-500" : "bg-amber-500"}`}>
      //     <h1 className={`font-medium text-white `}>
      //       {!winnerPlayer && currentPlayer === true
      //         ? currentPlayer === true && !firstPlayer
      //           ? "Your Friend"
      //           : "You"
      //         : currentPlayer === false
      //         ? currentPlayer === false && !secondPlayer
      //           ? "Your Friend"
      //           : "You"
      //         : ""}
      //     </h1>
      //   </div>
      // </div>
  */
