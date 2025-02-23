
import React, { useEffect, useState, useContext, useRef } from "react";

import Avatar from "../..//assets/Avatar.png";

import Board from "../../Game/components/Board";
import { returnPlayerName } from "../../Game/components/utils";
import "../../Game/game.css";
import { motion } from "framer-motion";
import { getMoves, movePiece } from "../../Game/components/ReactCheckers";
import WinnerModal from "../../Game/components/WinnerModal";
import ExitWarningModal from "../../Game/components/ExitWarningModal";
import socket from "../../utils/socket.io";
import { TurnContext } from "../../context/TurnContext"
import { useNavigate, useParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import useSound from "use-sound";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import DrawGameModal from "../../Game/components/DrawGameModal.js";
import winSound from "../../assets/sounds/win.mp3";
import loseSound from "../../assets/sounds/lose.mp3";
import moveSound from "../../assets/sounds/move.mp3";
import strikeSound from "../../assets/sounds/strike.mp3";

import { BsFillChatFill } from "react-icons/bs";
import { FaTimes, FaTelegramPlane } from "react-icons/fa";
import { ThreeDots } from "react-loader-spinner";
import UserLeavesModal from "../../Game/components/UserLeavesModal.js";
import { clearCookie } from "../../utils/data";
import { useAuth } from "../../context/auth.js";
import NewGameRequestModal from "../../Game/components/NewGameRequestModal.js";

import { Localization } from "../../utils/language";

const LeagueGame = () => {
    const { id } = useParams();
    const seasonId = localStorage.getItem("seasonId")
    const { user, token, lang, logout } = useAuth();

    const navigate = useNavigate();
    const [playMove] = useSound(moveSound);
    const [playStrike] = useSound(strikeSound);
    const [playWin] = useSound(winSound);
    const [playLose] = useSound(loseSound);

    const [soundOn, setSoundOn] = useState(
        localStorage.getItem("dama-sound")
            ? localStorage.getItem("dama-sound") : true
    );

    const [MyTurn, setMyTurn] = useContext(TurnContext);
    const [isWinnerModalOpen, setIsWinnerModalOpen] = useState(false);
    const [isExitModalOpen, setIsExitModalOpen] = useState(false);
    const [isNewGameModalOpen, setIsNewGameModalOpen] = useState(false);
    const [timerP1, setTimerP1] = useState(15);
    const [timerP2, setTimerP2] = useState(15);

    const [passedCounter, setPassedCounter] = useState(0);
    const intervalRef = useRef(null);

    const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);

    const [isDrawModalOpen, setIsDrawModalOpen] = useState(false);
    const [winnerPlayer, setWinnerPlayer] = useState(null);

    const [pawns, setPawns] = useState([0, 0]);

    const moveRef = useRef([0, 0]);

    const messageInputRef = useRef();
    const [messageInputOpen, setMessageInputOpen] = useState(false);
    const [latestMessage, setLatestMessage] = useState(null);
    const [showResetWaiting, setShowResetWaiting] = useState(false);
    const [msgSender, setMsgSender] = useState(null);

    //send king icon
    const [firstMove, setFirstMove] = useState(true);

    //trach previous game states for undo
    const [showAllMoves, setShowAllMoves] = useState(true)



    const playerOneData = localStorage.getItem("gamePlayers") ? JSON.parse(localStorage.getItem("gamePlayers")).p1 : null
    const playerTwoData = localStorage.getItem("gamePlayers") ? JSON.parse(localStorage.getItem("gamePlayers")).p2 : null

    if (!playerOneData) { navigate(`create-game`) }

    const header = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
    }

    const startGameMutation = useMutation(
        async (newData) =>
            await axios.post(
                `${process.env.REACT_APP_BACKEND_URL}auth-start-game/${id}`,
                newData,
                {
                    headers: header,
                }
            ),
        {
            retry: false,
        }
    );

    const startGameMutationSubmitHandler = async (values) => {
        try {
            startGameMutation.mutate(
                {},
                {
                    onSuccess: (responseData) => { },
                    onError: (err) => {
                        if (err?.response?.status === 401) { logout(); }
                    },
                }
            );
        } catch (err) { }
    };



    useEffect(() => {
        if (!id) navigate("/create-game");
        localStorage.setItem("dama-sound", true);

        playerTwoIp && startGameMutationSubmitHandler()

        return () => {
            localStorage.getItem("seasonId") && localStorage.removeItem("seasonId")
            localStorage.getItem("gameId") && localStorage.removeItem("gameId")
            localStorage.getItem("gamePlayers") && localStorage.removeItem("gamePlayers")

            localStorage.getItem("playerOne") && localStorage.removeItem("playerOne")
            localStorage.getItem("playerTwo") && localStorage.removeItem("playerTwo")

            localStorage.getItem("playerOneIp") && localStorage.removeItem("playerOneIp")
            localStorage.getItem("playerTwoIp") && localStorage.removeItem("playerTwoIp")
        }
    }, []);


    const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",

    };

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

            if (playerOneIp && clickedSquare.player !== "player1") return
            if (playerTwoIp && clickedSquare.player !== "player2") return

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
            soundOn && playMove();
        }
    }


    //update the game state after move
    function updateStatePostMove(postMoveState, gametrackes) {
        let track;

        if (!gametrackes == 1) {
            if (gameState.moves.length === 1) {
                track = { moved: gameState.activePiece, to: gameState.moves[0] };
            } else {
                if (postMoveState.boardState[gameState.moves[0]]) {
                    track = { moved: gameState.activePiece, to: gameState.moves[0] };
                } else {
                    track = { moved: gameState.activePiece, to: gameState.moves[1] };
                }
            }
        } else if (id == 1 && gametrackes) {
            track = gametrackes.tracker;
        }


        setGameState((prevGameState) => {
            return {
                ...prevGameState,

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
            };
        });

        socket.emit("sendGameMessage", {
            winnerPlayer: postMoveState.winner,
            boardState: postMoveState.boardState,
            currentPlayer: postMoveState.currentPlayer,
            turnPlayer: postMoveState.currentPlayer ? "player1" : "player2",
            tracker: track,
        });

        calcPawns(postMoveState.boardState);

        const tempObj = localStorage.getItem("playerOne")
            ? {
                p1: user
                    ? user.default_crown
                        ? {
                            normal: user?.default_crown?.board_pawn_king1,
                            active: user?.default_crown?.board_pawn_king1_turn,
                        }
                        : user?.default_board
                            ? {
                                normal: user?.default_crown?.board_pawn_king1,
                                active: user?.default_board?.board_pawn_king1_turn,
                            }
                            : null
                    : null,
            }
            : {
                p2: user
                    ? user.default_crown
                        ? {
                            normal: user?.default_crown?.board_pawn_king2,
                            active: user?.default_crown?.board_pawn_king2_turn,
                        }
                        : user?.default_board
                            ? {
                                normal: user?.default_crown?.board_pawn_king2,
                                active: user?.default_board?.board_pawn_king2_turn,
                            }
                            : null
                    : null,
            };
        socket.emit("sendCrownType", tempObj);
    }

    const stateHistory = gameState.history;
    const currentState = stateHistory[gameState?.stepNumber];
    const boardState = currentState?.boardState;
    const currentPlayer = currentState?.currentPlayer;

    const firstPlayer = JSON.parse(localStorage.getItem("playerOne"));
    const secondPlayer = JSON.parse(localStorage.getItem("playerTwo"));
    const playerOneIp = localStorage.getItem("playerOneIp");
    const playerTwoIp = localStorage.getItem("p1");
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
        if (gameState.players > 1 && (gameState.winner || winnerPlayer)) {
            setIsWinnerModalOpen(true);

            if (
                winnerPlayer === "player1pieces" &&
                localStorage.getItem("playerOne") &&
                soundOn
            ) {
                playWin();

                user &&
                    localStorage.setItem(
                        "dama_user_data",
                        JSON.stringify({
                            token,
                            user: { ...user, coin: user.coin + 50 },
                        })
                    );
            } else if (
                winnerPlayer === "player2pieces" &&
                localStorage.getItem("playerOne") &&
                soundOn
            ) {
                playLose();
            } else if (
                winnerPlayer === "player2pieces" &&
                localStorage.getItem("playerTwo") &&
                soundOn
            ) {
                playWin();

                user &&
                    localStorage.setItem(
                        "dama_user_data",
                        JSON.stringify({
                            token,
                            user: { ...user, coin: user.coin + 50 },
                        })
                    );
            } else if (
                winnerPlayer === "player1pieces" &&
                localStorage.getItem("playerTwo") &&
                soundOn
            ) {
                playLose();
            }

            setIsWinnerModalOpen(true);
        } else {
            if (gameState.winner || winnerPlayer) {
                setIsWinnerModalOpen(true);
                if (
                    gameState.winner === "player1pieces" ||
                    gameState.winner === "player1moves"
                ) {
                    soundOn && playWin();
                } else if (
                    gameState.winner === "player2pieces" ||
                    gameState.winner === "player2moves"
                ) {
                    soundOn && playLose();
                }
            }
        }
    }, [gameState, gameStatus, winnerPlayer]);

    const showAllHint = () => {
        let myCoordinates = []
        for (let i = 0; i < document.getElementsByClassName("player1").length; i++) {
            let coordinates = document.getElementsByClassName("player1")[i].classList[1]

            let movesData = getMoves(
                columns,
                gameState.history[gameState.history.length - 1].boardState,
                coordinates,
                document.getElementsByClassName("player1")[i].classList.contains("king"),
                false
            );
            if (movesData[0].length > 0) {
                myCoordinates.push(coordinates)
            }
        }

        myCoordinates.forEach(item => {
            document.getElementsByClassName(item)[0].classList.add("movable")
            document.getElementsByClassName(item)[0].classList.add("player1-all")
        })

    }

    const resetGame = () => {
        moveRef.current = [0, 0];

        socket.emit("sendResetGameRequest", { status: "Pending" });
    };

    const rejectGameRequest = () => {
        socket.emit("sendRejectGameMessage", { status: "Reject" });
        socket.emit("leave", gameId);
        setShowResetWaiting(false);
        setIsDrawModalOpen(false);
    };

    const rejectDrawGameRequest = () => {
        socket.emit("sendRejectDrawGameMessage", { status: "Reject" });
        // socket.emit('leave',gameId)
        setShowResetWaiting(false);
        setIsDrawModalOpen(false);
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
            pawns: [0, 0],
            moves: [0, 0],
        });
        moveRef.current = [0, 0];


    };


    const drawGame = () => {
        setShowResetWaiting(true);
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
            sender: localStorage.getItem("playerOne") ? "playerOne" : "playerTwo",
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
        let [prevP1, prevP2] = pawns;
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
        if (
            pawns[0] !== 12 - player2Counter ||
            pawns[1] !== player2Counter - prevP2
        ) {
            setPawns([12 - player2Counter, 12 - player1Counter]);
        }
    };


    function compareObjects(obj1, obj2) {
        let obj1NullCount = 0;
        let obj2NullCount = 0;

        for (let prop in obj1) {
            if (obj1[prop] === null) {
                obj1NullCount++;
            }
        }

        for (let prop in obj2) {
            if (obj2[prop] === null) {
                obj2NullCount++;
            }
        }
        if (obj1NullCount === obj2NullCount) {
            soundOn && playMove();
        } else if (obj1NullCount !== obj2NullCount) {
            soundOn && playStrike();
        }
    }

    let array = gameState.history;
    let lastElement = array[array.length - 1];
    const checkTurn = useRef(true) //check if player get getMessage 



    const fetchSeasonsMutation = useMutation(
        async (newData) =>
            await axios.post(`${process.env.REACT_APP_BACKEND_URL}player-season/${user.id}`, newData, {
                headers,
            }),
        {
            retry: true,
        }
    );


    const fetchSeasons = async (values) => {
        fetchSeasonsMutation.mutate(
            {},
            {
                onSuccess: (responseData) => {
                    const seasons = responseData?.data?.data
                    localStorage.setItem("dama-user-seasons", JSON.stringify(seasons));
                },
                onError: (err) => {
                    if (err?.response?.status === 401) { logout(); }
                },
                enabled: user ? true : false,
            },
        );

    };


    useEffect(() => {

        socket.on(
            "getGameMessage",
            ({ winnerPlayer, boardState, currentPlayer, turnPlayer, tracker }) => {
                stopInterval();
                firstMove && setFirstMove(false)
                setMyTurn(turnPlayer);
                setWinnerPlayer(winnerPlayer);

                checkTurn.current = turnPlayer === "player2" ? !checkTurn.current : checkTurn.current

                turnPlayer === "player2"
                    ? function () {
                        if (localStorage.getItem("isNotPublic")) {
                            checkTurn.current && (moveRef.current = [1 + moveRef.current[0], moveRef.current[1]])
                        }
                        else {
                            moveRef.current = [1 + moveRef.current[0], moveRef.current[1]]
                        }
                    }()
                    : (moveRef.current = [moveRef.current[0], 1 + moveRef.current[1]]);

                calcPawns(boardState);
                compareObjects(lastElement?.boardState, boardState);

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
                        tracker,
                    };
                });
            }
        );


        socket.on("getResetGameMessage",
            ({ winnerPlayer, gameState, isWinnerModalOpen, pawns, moves }) => {
                setGameState(gameState);
                setWinnerPlayer(winnerPlayer);
                setIsWinnerModalOpen(isWinnerModalOpen);
                setIsDrawModalOpen(false);
                setMyTurn("player1");
                setPawns([0, 0]);
                setTimerP1(15);
                setTimerP2(15);
                setPassedCounter(0);
                setShowResetWaiting(false);
                moveRef.current = [0, 0];
                setFirstMove(true)
            }
        );
        socket.on("getDrawGameRequest", ({ status }) => {
            setIsDrawModalOpen(true);
        });
        socket.on("getRejectGameMessage", (status) => {
            socket.emit("leave", gameId);
            setShowResetWaiting(false);
            // toast("You friend did not accept the request");
            if (!status.type) {
            }
            setIsNewGameModalOpen(true);
            setTimeout(() => {
                clearCookie.forEach((data) => {
                    localStorage.getItem(data) && localStorage.removeItem(data);
                });
                navigate("/create-game");
            }, 3500);
        });

        //get reject draw game message
        socket.on("getRejectDrawGameMessage", (status) => {
            setShowResetWaiting(false);
            setIsNewGameModalOpen(true);
            // toast("You friend did not accept the request");
            if (!status.type) {
            }
        });
        //listen for if user left room
        socket.on("userLeaveMessage", (data) => {
            setIsLeaveModalOpen(true);
            setTimeout(() => {
                clearCookie.forEach((data) => {
                    localStorage.getItem(data) && localStorage.removeItem(data);
                });

                navigate("/create-game");
            }, 5000);
        });

        //listen for if the user exit the game
        socket.on("getExitGameRequest", (data) => {
            socket.emit("leave", gameId);
            setIsLeaveModalOpen(true);
            setTimeout(() => {
                clearCookie.forEach((data) => {
                    localStorage.getItem(data) && localStorage.removeItem(data);
                });
                navigate("/create-game");
            }, 5000);
        });
        //listen for chat message
        socket.on("getChatMessage", (data) => {
            setMsgSender(data.sender);
            setLatestMessage(data.message);
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

    const stopInterval = () => {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        setTimerP1(15);
        setTimerP2(15);
    };

    const timeChecker = () => {
        let myCounter = 0;
        if (currentPlayer && localStorage.getItem("playerOneIp")) {
            intervalRef.current = setInterval(() => {
                if (myCounter === 0) {
                    setTimerP1(15);
                } else {
                    setTimerP1((prev) => --prev);
                }
                ++myCounter;

                if (myCounter >= 15) {
                    stopInterval();
                    setTimerP1(15);
                    myCounter = 0;
                    setMyTurn("player2");
                    setPassedCounter((prev) => ++prev);
                    setGameState({
                        ...gameState,
                        history: [
                            ...gameState.history,
                            {
                                boardState:
                                    gameState.history[gameState.history.length - 1].boardState,
                                currentPlayer:
                                    !gameState.history[gameState.history.length - 1]
                                        .currentPlayer,
                            },
                        ],
                        activePiece: null,
                        moves: [],
                        jumpKills: null,
                        hasJumped: null,
                        stepNumber: 0,
                        winner: null,
                    });

                    passedCounter >= 3 && setWinnerPlayer("player2pieces");
                    passedCounter >= 3 && stopInterval();
                    socket.emit("sendGameMessage", {
                        winnerPlayer:
                            passedCounter >= 3 ? "player2pieces" : gameState.winner,
                        boardState:
                            gameState.history[gameState.history.length - 1].boardState,
                        currentPlayer:
                            !gameState.history[gameState.history.length - 1].currentPlayer,
                        turnPlayer: !gameState.history[gameState.history.length - 1]
                            .currentPlayer
                            ? "player1"
                            : "player2",
                    });
                }
            }, 1000);

        } else if (!currentPlayer && playerTwoIp) {

            intervalRef.current = setInterval(() => {
                if (myCounter === 0) {
                    setTimerP2(15);
                } else {
                    setTimerP2((prev) => --prev);
                }
                ++myCounter;

                if (myCounter >= 15) {
                    stopInterval();
                    setTimerP2(15);
                    myCounter = 0;
                    setMyTurn("player1");
                    setPassedCounter((prev) => ++prev);

                    setGameState({
                        ...gameState,
                        history: [
                            {
                                boardState:
                                    gameState.history[gameState.history.length - 1].boardState,
                                currentPlayer:
                                    !gameState.history[gameState.history.length - 1]
                                        .currentPlayer,
                            },
                        ],
                        activePiece: null,
                        moves: [],
                        jumpKills: null,
                        hasJumped: null,
                        stepNumber: 0,
                        winner: null,
                    });

                    passedCounter >= 3 && setWinnerPlayer("player1pieces");
                    passedCounter >= 3 && stopInterval();
                    socket.emit("sendGameMessage", {
                        winnerPlayer:
                            passedCounter >= 3 ? "player1pieces" : gameState.winner,
                        boardState:
                            gameState.history[gameState.history.length - 1].boardState,
                        currentPlayer:
                            !gameState.history[gameState.history.length - 1].currentPlayer,
                        turnPlayer: !gameState.history[gameState.history.length - 1]
                            .currentPlayer
                            ? "player1"
                            : "player2",
                    });
                }
            }, 1000);
        }
    };

    useEffect(() => {
        timeChecker();
        //showAllMoves && currentPlayer && showAllHint()

        id == 1 && playerOneIp && currentPlayer && showAllHint()
    }, [currentPlayer]);


    const reCheckInPlayer = () => {
        const { id: userId, username, profile_image, game_point, default_board, default_crown } = user

        socket.emit("checkInLeague", {
            seasonId,
            userData: { id: userId, username, profile_image, game_point, default_board, default_crown }
        });

        localStorage.removeItem("seasonId")
    }






    useEffect(() => {
        if (winnerPlayer && playerOneIp) {

            if (winnerPlayer === "player1pieces" || winnerPlayer === "player1moves") {
                winnerMutationSubmitHandler(playerOneData);
                return;
            }
            else if (winnerPlayer === "player2pieces" || winnerPlayer === "player2moves") {
                winnerMutationSubmitHandler(playerTwoData);
                return;
            }

        }


        return () => {
            fetchSeasons()
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

    const winnerMutationSubmitHandler = async (values) => {
        try {
            winnerMutation.mutate(
                {
                    winner: values.id,
                    game_id: gameId,
                    season_id: seasonId
                },
                {
                    onSuccess: (responseData) => { },
                    onError: (err) => {
                        if (err?.response?.status === 401) { logout(); }
                    },
                }
            );
        } catch (err) { }
    };



    const changeSound = () => {
        localStorage.setItem("dama-sound", !soundOn);
        setSoundOn((prev) => !prev);
    };

    return (localStorage.getItem("gameId") && <>
        <div
            className={`
  
    relative  flex flex-col min-h-screen items-center justify-evenly `}
        >

            <section className="w-full flex items-center justify-between">
                {soundOn ? (
                    <button
                        onClick={changeSound}
                        className="ml-[8%] flex flex-col items-center justify-center"
                    >
                        <svg
                            width="23"
                            height="23"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M15.658 10.057L16.365 9.35C16.4579 9.25716 16.5316 9.14692 16.5819 9.02559C16.6322 8.90426 16.6582 8.7742 16.6582 8.64285C16.6582 8.51151 16.6324 8.38143 16.5822 8.26007C16.532 8.1387 16.4583 8.02841 16.3655 7.9355C16.2727 7.84259 16.1624 7.76888 16.0411 7.71857C15.9198 7.66826 15.7897 7.64234 15.6584 7.6423C15.527 7.64225 15.3969 7.66808 15.2756 7.7183C15.1542 7.76852 15.0439 7.84216 14.951 7.935L14.244 8.643L13.537 7.935C13.3494 7.74749 13.0949 7.6422 12.8296 7.6423C12.5644 7.64239 12.31 7.74786 12.1225 7.9355C11.935 8.12314 11.8297 8.37758 11.8298 8.64285C11.8299 8.90812 11.9354 9.16249 12.123 9.35L12.83 10.057L12.123 10.764C11.9408 10.9526 11.84 11.2052 11.8423 11.4674C11.8446 11.7296 11.9498 11.9804 12.1352 12.1658C12.3206 12.3512 12.5714 12.4564 12.8336 12.4587C13.0958 12.461 13.3484 12.3602 13.537 12.178L14.244 11.471L14.951 12.178C15.1396 12.3602 15.3922 12.461 15.6544 12.4587C15.9166 12.4564 16.1674 12.3512 16.3528 12.1658C16.5382 11.9804 16.6434 11.7296 16.6457 11.4674C16.648 11.2052 16.5472 10.9526 16.365 10.764L15.658 10.057ZM4 0H16C17.0609 0 18.0783 0.421427 18.8284 1.17157C19.5786 1.92172 20 2.93913 20 4V16C20 17.0609 19.5786 18.0783 18.8284 18.8284C18.0783 19.5786 17.0609 20 16 20H4C2.93913 20 1.92172 19.5786 1.17157 18.8284C0.421427 18.0783 0 17.0609 0 16V4C0 2.93913 0.421427 1.92172 1.17157 1.17157C1.92172 0.421427 2.93913 0 4 0ZM5.282 13.287H6.287L8.11 14.997C8.48086 15.3442 8.96997 15.5373 9.478 15.537H9.682C10.1063 15.537 10.5133 15.3684 10.8134 15.0684C11.1134 14.7683 11.282 14.3613 11.282 13.937V6.137C11.282 5.71265 11.1134 5.30569 10.8134 5.00563C10.5133 4.70557 10.1063 4.537 9.682 4.537H9.478C8.96983 4.53699 8.48071 4.73042 8.11 5.078L6.287 6.788H5.282C4.75157 6.788 4.24286 6.99871 3.86779 7.37379C3.49271 7.74886 3.282 8.25757 3.282 8.788V11.288C3.282 11.8184 3.49271 12.3271 3.86779 12.7022C4.24286 13.0773 4.75157 13.288 5.282 13.288V13.287ZM7.078 8.787L9.282 6.72V13.354L7.078 11.287H5.282V8.787H7.078Z"
                                fill="#FF4C01"
                            />
                        </svg>
                        <p className="text-white text-xs">
                            {Localization["SoundOn"][lang]}
                        </p>
                    </button>
                ) : (
                    <button
                        onClick={changeSound}
                        className="ml-[8%] flex flex-col items-center justify-center"
                    >
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M15.658 10.057L16.365 9.35C16.4579 9.25716 16.5316 9.14692 16.5819 9.02559C16.6322 8.90426 16.6582 8.7742 16.6582 8.64285C16.6582 8.51151 16.6324 8.38143 16.5822 8.26007C16.532 8.1387 16.4583 8.02841 16.3655 7.9355C16.2727 7.84259 16.1624 7.76888 16.0411 7.71857C15.9198 7.66826 15.7897 7.64234 15.6584 7.6423C15.527 7.64225 15.3969 7.66808 15.2756 7.7183C15.1542 7.76852 15.0439 7.84216 14.951 7.935L14.244 8.643L13.537 7.935C13.3494 7.74749 13.0949 7.6422 12.8296 7.6423C12.5644 7.64239 12.31 7.74786 12.1225 7.9355C11.935 8.12314 11.8297 8.37758 11.8298 8.64285C11.8299 8.90812 11.9354 9.16249 12.123 9.35L12.83 10.057L12.123 10.764C11.9408 10.9526 11.84 11.2052 11.8423 11.4674C11.8446 11.7296 11.9498 11.9804 12.1352 12.1658C12.3206 12.3512 12.5714 12.4564 12.8336 12.4587C13.0958 12.461 13.3484 12.3602 13.537 12.178L14.244 11.471L14.951 12.178C15.1396 12.3602 15.3922 12.461 15.6544 12.4587C15.9166 12.4564 16.1674 12.3512 16.3528 12.1658C16.5382 11.9804 16.6434 11.7296 16.6457 11.4674C16.648 11.2052 16.5472 10.9526 16.365 10.764L15.658 10.057ZM4 0H16C17.0609 0 18.0783 0.421427 18.8284 1.17157C19.5786 1.92172 20 2.93913 20 4V16C20 17.0609 19.5786 18.0783 18.8284 18.8284C18.0783 19.5786 17.0609 20 16 20H4C2.93913 20 1.92172 19.5786 1.17157 18.8284C0.421427 18.0783 0 17.0609 0 16V4C0 2.93913 0.421427 1.92172 1.17157 1.17157C1.92172 0.421427 2.93913 0 4 0ZM5.282 13.287H6.287L8.11 14.997C8.48086 15.3442 8.96997 15.5373 9.478 15.537H9.682C10.1063 15.537 10.5133 15.3684 10.8134 15.0684C11.1134 14.7683 11.282 14.3613 11.282 13.937V6.137C11.282 5.71265 11.1134 5.30569 10.8134 5.00563C10.5133 4.70557 10.1063 4.537 9.682 4.537H9.478C8.96983 4.53699 8.48071 4.73042 8.11 5.078L6.287 6.788H5.282C4.75157 6.788 4.24286 6.99871 3.86779 7.37379C3.49271 7.74886 3.282 8.25757 3.282 8.788V11.288C3.282 11.8184 3.49271 12.3271 3.86779 12.7022C4.24286 13.0773 4.75157 13.288 5.282 13.288V13.287ZM7.078 8.787L9.282 6.72V13.354L7.078 11.287H5.282V8.787H7.078Z"
                                fill="#FF4C01"
                            />
                        </svg>
                        <p className="text-white text-xs">
                            {Localization["SoundOff"][lang]}
                        </p>
                    </button>
                )}

                <section className="flex flex-col">
                    <div>
                        {currentPlayer && playerOneIp && (
                            <p className="text-white font-bold text-sm">
                                {Localization["Timer"][lang]} : {timerP1}
                            </p>
                        )}
                        {!currentPlayer && playerTwoIp && (
                            <p className="text-white font-bold text-sm">
                                {Localization["Timer"][lang]} : {timerP2}
                            </p>
                        )}
                    </div>
                    {passedCounter === 3 && (
                        <p className="text-yellow-400 font-bold text-xs">
                            {Localization["You will lose"][lang]}
                        </p>
                    )}
                </section>

                <button
                    className="mr-8"
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
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M9.7656 1.0273C10.3031 0.866059 10.8708 0.832704 11.4235 0.929896C11.9762 1.02709 12.4985 1.25214 12.9487 1.58707C13.399 1.92201 13.7647 2.35757 14.0167 2.85897C14.2686 3.36037 14.3999 3.91374 14.4 4.4749V22.0237C14.3999 22.5849 14.2686 23.1382 14.0167 23.6396C13.7647 24.141 13.399 24.5766 12.9487 24.9115C12.4985 25.2465 11.9762 25.4715 11.4235 25.5687C10.8708 25.6659 10.3031 25.6325 9.7656 25.4713L2.5656 23.3113C1.82412 23.0889 1.17409 22.6333 0.711938 22.0123C0.249785 21.3913 0.000126947 20.6378 0 19.8637V6.6349C0.000126947 5.86077 0.249785 5.10731 0.711938 4.48628C1.17409 3.86525 1.82412 3.40973 2.5656 3.1873L9.7656 1.0273ZM15.6 3.6493C15.6 3.33104 15.7264 3.02581 15.9515 2.80077C16.1765 2.57573 16.4817 2.4493 16.8 2.4493H20.4C21.3548 2.4493 22.2705 2.82858 22.9456 3.50371C23.6207 4.17884 24 5.09452 24 6.0493V7.2493C24 7.56756 23.8736 7.87278 23.6485 8.09783C23.4235 8.32287 23.1183 8.4493 22.8 8.4493C22.4817 8.4493 22.1765 8.32287 21.9515 8.09783C21.7264 7.87278 21.6 7.56756 21.6 7.2493V6.0493C21.6 5.73104 21.4736 5.42581 21.2485 5.20077C21.0235 4.97573 20.7183 4.8493 20.4 4.8493H16.8C16.4817 4.8493 16.1765 4.72287 15.9515 4.49783C15.7264 4.27278 15.6 3.96756 15.6 3.6493ZM22.8 18.0493C23.1183 18.0493 23.4235 18.1757 23.6485 18.4008C23.8736 18.6258 24 18.931 24 19.2493V20.4493C24 21.4041 23.6207 22.3198 22.9456 22.9949C22.2705 23.67 21.3548 24.0493 20.4 24.0493H16.8C16.4817 24.0493 16.1765 23.9229 15.9515 23.6978C15.7264 23.4728 15.6 23.1676 15.6 22.8493C15.6 22.531 15.7264 22.2258 15.9515 22.0008C16.1765 21.7757 16.4817 21.6493 16.8 21.6493H20.4C20.7183 21.6493 21.0235 21.5229 21.2485 21.2978C21.4736 21.0728 21.6 20.7676 21.6 20.4493V19.2493C21.6 18.931 21.7264 18.6258 21.9515 18.4008C22.1765 18.1757 22.4817 18.0493 22.8 18.0493ZM8.4 12.0493C8.08174 12.0493 7.77652 12.1757 7.55147 12.4008C7.32643 12.6258 7.2 12.931 7.2 13.2493C7.2 13.5676 7.32643 13.8728 7.55147 14.0978C7.77652 14.3229 8.08174 14.4493 8.4 14.4493H8.4012C8.71946 14.4493 9.02468 14.3229 9.24973 14.0978C9.47477 13.8728 9.6012 13.5676 9.6012 13.2493C9.6012 12.931 9.47477 12.6258 9.24973 12.4008C9.02468 12.1757 8.71946 12.0493 8.4012 12.0493H8.4Z"
                            fill="#FF4C01"
                        />
                        <path
                            d="M16.8 13.2494H22.8M22.8 13.2494L20.4 10.8494M22.8 13.2494L20.4 15.6494"
                            stroke="#FF4C01"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                    <p className="text-white text-xs">{Localization["Exit"][lang]}</p>
                </button>
            </section>
            <section className="flex justify-evenly items-center w-full md:hidden">
                <div className="">
                    <div
                        className={
                            currentPlayer
                                ? "flex flex-col items-center space-y-2 p-1 rounded-full border-4 border-orange-color w-16 h-16"
                                : "flex flex-col items-center space-y-2 p-1 rounded-full border-2 border-orange-color w-16"
                        }
                    >
                        <img
                            src={playerOneData && playerOneData?.profile_image ? playerOneData?.profile_image : Avatar}
                            className="h-12 rounded-full"
                            alt=""
                        />
                    </div>
                    <h4 className="text-white capitalize  font-semibold text-xs">
                        {playerOneData && playerOneData.username}
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
                            src={playerTwoData && playerTwoData.profile_image ? playerTwoData?.profile_image : Avatar
                            }
                            className="h-12 rounded-full"
                            alt=""
                        />
                    </div>
                    <h4 className="text-white capitalize  font-semibold text-xs">
                        {playerTwoData && playerTwoData.username}
                    </h4>
                </div>
            </section>

            <section className="flex justify-evenly items-center text-sm w-full md:hidden">
                <div className="border-r-[3px] border-gray-400 text-white w-1/2 ">
                    <div className="flex justify-center items-center text-[.7rem] gap-x-2 font-bold mb-2">
                        <p className="bg-gray-300 text-black pr-[.2rem] w-12 rounded">
                            {Localization["Moves"][lang]}
                        </p>
                        <p>{moveRef.current[0]}</p>
                    </div>
                    <div className="flex justify-center items-center text-[.7rem] gap-x-2 font-bold mb-2">
                        <p className="bg-gray-300 text-black pr-[.2rem] w-12 rounded">
                            {Localization["Pawns"][lang]}
                        </p>
                        <p>{pawns[0]}</p>
                    </div>
                </div>

                <div className="text-white w-1/2">
                    <div className="flex justify-center items-center text-[.7rem] gap-x-2 font-bold mb-2">
                        <p>{moveRef.current[1]}</p>
                        <p className="bg-gray-300 text-black pr-[.2rem] w-12 rounded">
                            {Localization["Moves"][lang]}
                        </p>
                    </div>
                    <div className="flex justify-center items-center text-[.7rem] gap-x-2 font-bold mb-2">
                        <p>{pawns[1]}</p>
                        <p className="bg-gray-300 text-black pr-[.2rem] w-12 rounded">
                            {Localization["Pawns"][lang]}
                        </p>
                    </div>
                </div>
            </section>


            <div
                className="w-full h-4 flex justify-center items-center"
            >
                {playerOneIp &&
                    (!currentPlayer ? (
                        <ThreeDots
                            height="20"
                            width="40"
                            radius="9"
                            color="#f75105"
                            ariaLabel="three-dots-loading"
                            wrapperStyle={{}}
                            wrapperClassName=""
                            visible={true}
                        />
                    ) : (
                        <h1 className="text-white font-normal">
                            {Localization["Your turn"][lang]}
                        </h1>
                    ))}
                {playerTwoIp &&
                    (currentPlayer ? (
                        <ThreeDots
                            height="20"
                            width="40"
                            radius="9"
                            color="#f75105"
                            ariaLabel="three-dots-loading"
                            wrapperStyle={{}}
                            wrapperClassName=""
                            visible={true}
                        />
                    ) : (
                        <h1 className="text-white font-normal">
                            {Localization["Your turn"][lang]}
                        </h1>
                    ))}
            </div>
            <div className={""}>
                <div
                    className={`box ${!id
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
                        boardState={localStorage.getItem("playerOne")
                            ? dict_reverse(boardState)
                            : boardState
                        }
                        currentPlayer={currentPlayer}
                        activePiece={gameState.activePiece}
                        moves={gameState.moves}
                        columns={columns}
                        onClick={(coordinates) => handleClick(coordinates)}
                        numberOfPlayers={gameState.players}
                        tracker={gameState.tracker ? gameState.tracker : null}
                        isFirstMove={firstMove}
                        setIsFirstMove={setFirstMove}
                        showAllMoves={showAllMoves}
                    />
                </div>
            </div>

            <div className="flex justify-evenly items-center w-full">

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
                    <p className="text-xs font-bold text-white">
                        {Localization["Draw"][lang]}
                    </p>
                </div>

                {id === 1 && <div onClick={() => setShowAllMoves(prev => !prev)} className="flex flex-col cursor-pointer">
                    <div className="rounded-full flex flex-col items-center justify-center">
                        {showAllMoves ? <svg xmlns="http://www.w3.org/2000/svg" width="33" height="33" viewBox="0 0 24 24"><path fill="#ff4c01" d="M7 18q-2.5 0-4.25-1.75T1 12q0-2.5 1.75-4.25T7 6h10q2.5 0 4.25 1.75T23 12q0 2.5-1.75 4.25T17 18H7Zm10-3q1.25 0 2.125-.875T20 12q0-1.25-.875-2.125T17 9q-1.25 0-2.125.875T14 12q0 1.25.875 2.125T17 15Z" /></svg>
                            : <svg xmlns="http://www.w3.org/2000/svg" width="33" height="33" viewBox="0 0 24 24"><path fill="#ff4c01" d="M17 7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h10c2.76 0 5-2.24 5-5s-2.24-5-5-5zM7 15c-1.66 0-3-1.34-3-3s1.34-3 3-3s3 1.34 3 3s-1.34 3-3 3z" /></svg>
                        }
                    </div>
                    <p className="text-xs font-bold text-white">
                        {Localization["Show Hint"][lang]}
                    </p>
                </div>}

                <div className="flex items-center justify-center flex-col">
                    <BsFillChatFill
                        onClick={openChatFilled}
                        size={30}
                        className="text-orange-color"
                    />
                    <p className="text-xs font-bold text-white">{Localization["Chat"][lang]}</p>
                </div>
            </div>

            {latestMessage && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ type: "tween", duration: 1, ease: "easeInOut" }}
                    className={
                        msgSender === "playerOne"
                            ? "absolute top-36  bg-white max-w-sm  p-1 w-44 left-3  border border-orange-color rounded-lg m-3"
                            : "absolute top-36  bg-white max-w-sm  p-1 w-44 right-3  border border-orange-color rounded-lg m-3"
                    }
                >
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
                </motion.div>
            )}
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
                            placeholder={Localization["write your message..."][lang]}
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
                {btCoin && (
                    <p className="text-xs font-bold text-white">
                        {Localization["Bet"][lang]} {btCoin} {Localization["coins"][lang]}
                    </p>
                )}
            </div>
            <ExitWarningModal
                isExitModalOpen={isExitModalOpen}
                set_isExitModalOpen={setIsExitModalOpen}
                gameState={gameState}
                isLeague={true}
                seasonId={seasonId ? seasonId : null}
                playerData={playerOneData.id === user.id ? playerTwoData.id : playerOneData.id}
            />

            <WinnerModal
                isWinnerModalOpen={isWinnerModalOpen}
                setIsWinnerModalOpen={setIsWinnerModalOpen}
                winnerPlayer={winnerPlayer}
                resetGame={resetGame}
                rejectGameRequest={rejectGameRequest}
                gameState={gameState}
                isLeague={true}
                seasonId={seasonId ? seasonId : null}
            />

            <DrawGameModal
                isDrawModalOpen={isDrawModalOpen}
                setIsDrawModalOpen={setIsDrawModalOpen}
                acceptGameRequest={acceptGameRequest}
                rejectGameRequest={rejectDrawGameRequest}
                showResetWaiting={showResetWaiting}
                gameId={id}
                seasonId={seasonId}
            />
            <UserLeavesModal
                setIsLeaveModalOpen={setIsLeaveModalOpen}
                isLeaveModalOpen={isLeaveModalOpen}
            />
            <NewGameRequestModal
                isNewGameModalOpen={isNewGameModalOpen}
                setIsNewGameModalOpen={setIsNewGameModalOpen}
            />
            <Toaster />
        </div>
    </>
    );
};

export default LeagueGame;