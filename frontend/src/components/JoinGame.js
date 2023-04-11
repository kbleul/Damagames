import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import background from "../assets/backdrop.jpg";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import toast, { Toaster } from "react-hot-toast";
import socket from "../utils/socket.io";
import { useAuth } from "../context/auth";

import { clearCookie } from "../utils/data";
import { Footer } from "./Footer";
import { Localization } from "../utils/language";

const JoinGame = () => {
  const { user, token, lang } = useAuth();
  const [isMessageSent, setIsMessageSent] = useState(false);
  const [isMessageListened, setIsMessageListened] = useState(false);
  const [socketLoading, setsocketLoading] = useState(false);
  const [tempPlayer, setTempPlayer] = useState(null);

  const [isVerified, setIsVerified] = useState(false);
  const { id } = useParams();
  const gameId = localStorage.getItem("gameId");
  const [code, setCode] = useState("");
  //store player one name
  const [myFriend, setMyFriend] = useState("");

  // to check if  creater and the joining player are the same
  const sameUser = useRef(false);
  const useLess = useRef(false);
  let msgCounter = 0;

  const ipRef = useRef(localStorage.getItem("playerOneIp"));
  const navigate = useNavigate();
  const [name, setName] = useState(user && token ? user.username : "");

  useEffect(() => {
    socket.on("getMessage", (data) => {
      if (data?.player2) {
        setIsMessageSent(false);
        setIsMessageListened(true);
        useLess.current = true;
        navigate("/game");
      }
    });

    socket.on("samePerson", (data) => {
      msgCounter === 0 && toast(data);
      sameUser.current = true;
      ++msgCounter;
    });
  }, [isMessageListened]);

  setInterval(() => {
    if (!useLess.current) {
      if (isMessageSent && !isMessageListened) {
        socket.emit("sendMessage", {
          status: "started",
          player2: JSON.stringify(tempPlayer),
        });

      }
    }
  }, 500);

  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  const header = {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
  };
  useEffect(() => {
    if (id) {
      joinGameMutationSubmitHandler();
    }
  }, [id]);

  //send join-game id to backend
  const joinGameMutation = useMutation(
    async (newData) =>
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}join-game/${id}`,
        newData,
        {
          headers,
        }
      ),
    {
      retry: false,
    }
  );

  //if logged in
  const joinBetGameMutation = useMutation(
    async (newData) =>
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}auth-join-game/${id}`,
        newData,
        {
          headers: header,
        }
      ),
    {
      retry: false,
    }
  );

  const joinGameMutationSubmitHandler = async (values) => {
    try {
      if (user && token) {
        joinBetGameMutation.mutate(
          {},
          {
            onSuccess: (responseData) => {
              responseData?.data?.data?.playerOne?.username &&
                setMyFriend(responseData?.data?.data?.playerOne.username);

              localStorage.setItem(
                "players",
                JSON.stringify({
                  player1: responseData?.data?.data?.playerOne?.username,
                  player2: responseData?.data?.data?.playerTwo?.username,
                })
              );
            },
            onError: (err) => {
              navigate("/already-joined");
            },
          }
        );
      } else {
        joinGameMutation.mutate(
          {},
          {
            onSuccess: (responseData) => {
              responseData?.data?.data?.playerOne?.username &&
                setMyFriend(responseData?.data?.data?.playerOne.username);

              localStorage.setItem(
                "players",
                JSON.stringify({
                  player1: responseData?.data?.data?.playerOne?.username,
                  player2: responseData?.data?.data?.playerTwo?.username,
                })
              );
            },
            onError: (err) => {
              navigate("/already-joined");
            },
          }
        );
      }
    } catch (err) { }
  };

  const handleJoin = () => {
    if (!name) {
      toast("name is required.");

      return;
    }
    if (id) {
      nameMutationSubmitHandler();
      return;
    }
    if (gameId) {
      nameMutationWithCode();
    }
  };
  const nameMutation = useMutation(
    async (newData) =>
      await axios.post(
        id
          ? user && token
            ? `${process.env.REACT_APP_BACKEND_URL}auth-start-game/${id}`
            : `${process.env.REACT_APP_BACKEND_URL}add-player/${id}`
          : user && token
            ? `${process.env.REACT_APP_BACKEND_URL}auth-start-game/${gameId}`
            : `${process.env.REACT_APP_BACKEND_URL}add-player/${gameId}`,
        newData,
        {
          headers: user && token ? header : headers,
        }
      ),
    {
      retry: false,
    }
  );
  const nameMutationSubmitHandler = async (values) => {
    try {
      nameMutation.mutate(user && token ? {} : { username: name }, {
        onSuccess: (responseData) => {
          if (gameId) {
            socket.emit("join-room", gameId);
          } else {
            socket.emit("join-room", id);
          }
          if (ipRef.current !== responseData?.data?.data?.ip) {
            socket.emit("sendMessage", {
              status: "started",
              player2: JSON.stringify(responseData?.data?.data?.playerTwo),
            });
            setIsMessageSent(true);
            setsocketLoading(true);
          }
          setTempPlayer(JSON.stringify(responseData?.data?.data?.playerTwo));
          socket.emit("join-room", id);

          //first clear local storage
          clearCookie.forEach((data) => {
            localStorage.getItem(data) && localStorage.removeItem(data);
          });
          localStorage.setItem(
            "p1",
            responseData?.data?.data?.playerOne.username
          );
          localStorage.setItem(
            "p2",
            responseData?.data?.data?.playerTwo.username
          );
          localStorage.setItem("playerTwoIp", responseData?.data?.data?.ip);
          localStorage.setItem(
            "playerTwo",
            JSON.stringify(responseData?.data?.data?.playerTwo)
          );
          localStorage.setItem("gameId", responseData?.data?.data?.game);
        },
        onError: (err) => { },
      });
    } catch (err) { }
  };

  //with code
  const nameMutationWithCode = async (values) => {
    try {
      nameMutation.mutate(user && token ? {} : { username: name }, {
        onSuccess: (responseData) => {
          socket.emit("join-room", gameId);
          if (ipRef.current !== responseData?.data?.data?.ip) {
            socket.emit("sendMessage", {
              status: "started",
              player2: JSON.stringify(responseData?.data?.data?.playerTwo),
            });
            setIsMessageSent(true);
            setsocketLoading(true);
          }
          setTempPlayer(JSON.stringify(responseData?.data?.data?.playerTwo));
          //first clear local storage
          clearCookie.forEach((data) => {
            localStorage.getItem(data) && localStorage.removeItem(data);
          });
          localStorage.setItem(
            "p1",
            responseData?.data?.data?.playerOne.username
          );
          localStorage.setItem(
            "p2",
            responseData?.data?.data?.playerTwo.username
          );
          localStorage.setItem("playerTwoIp", responseData?.data?.data?.ip);
          localStorage.setItem(
            "playerTwo",
            JSON.stringify(responseData?.data?.data?.playerTwo)
          );
          localStorage.setItem("gameId", responseData?.data?.data?.game);
        },
        onError: (err) => { },
      });
    } catch (err) { }
  };

  const handleSubmitCode = () => {
    if (!code || [...code].length !== 6) {
      toast("code character should be 6");
      return;
    }
    joinViaCodeMutationSubmitHandler();
  };
  const joinViaCodeMutation = useMutation(
    async (newData) =>
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}join-game-via-code`,
        newData,
        {
          headers,
        }
      ),
    {
      retry: false,
    }
  );

  //if signed in
  const joinBetViaCodeMutation = useMutation(
    async (newData) =>
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}auth-join-game-via-code`,
        newData,
        { headers: header }
      ),
    {
      retry: false,
    }
  );

  const joinViaCodeMutationSubmitHandler = async (values) => {
    try {
      if (user && token) {
        joinBetViaCodeMutation.mutate(
          { code: code },
          {
            onSuccess: (responseData) => {
              localStorage.setItem(
                "bt_coin_amount",
                responseData?.data?.data?.bet_coin
              );

              socket.emit("leave", gameId);
              socket.emit("leave", id);
              setIsVerified(true);
              responseData?.data?.data?.playerOne.username &&
                setMyFriend(responseData?.data?.data?.playerOne.username);
              localStorage.setItem("gameId", responseData?.data?.data?.game);
            },
            onError: (err) => {
              err?.response?.data?.data
                ? toast(err?.response?.data?.data)
                : toast(err?.response?.data?.message);
            },
          }
        );
      } else {
        joinViaCodeMutation.mutate(
          { code: code },
          {
            onSuccess: (responseData) => {
              socket.emit("leave", gameId);
              socket.emit("leave", id);
              setIsVerified(true);
              responseData?.data?.data?.playerOne.username &&
                setMyFriend(responseData?.data?.data?.playerOne.username);
              localStorage.setItem("gameId", responseData?.data?.data?.game);
              localStorage.setItem(
                "p1",
                responseData?.data?.data?.playerOne.username
              );
            },
            onError: (err) => {
              err?.response?.data?.data
                ? toast(err?.response?.data?.data)
                : toast(err?.response?.data?.message);
            },
          }
        );
      }
    } catch (err) { }
  };
  return (
    <div
      style={{
        backgroundImage: `url(${background})`,
        backgroundPosition: "center",
        minWidth: "100vw",
        minHeight: "100vh",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        width: "100%",
        overflow: "hidden",
      }}
    >
      <button
        className="z-10 bg-orange-color rounded-full w-8 h-8 flex justify-center items-center mr-2 mt-2 fixed left-2 md:left-4"
        onClick={() => navigate("/create-game")}
      >
        <svg
          width="18"
          height="14"
          viewBox="0 0 18 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M0.396166 0.973833C0.500244 0.722555 0.676505 0.507786 0.902656 0.356693C1.12881 0.205599 1.39469 0.124969 1.66667 0.125H10.8333C12.6567 
                    0.125 14.4054 0.849328 15.6947 2.13864C16.984 3.42795 17.7083 5.17664 17.7083 7C17.7083 8.82336 16.984 10.572 15.6947 11.8614C14.4054 13.1507
                     12.6567 13.875 10.8333 13.875H2.58333C2.21866 13.875 1.86892 13.7301 1.61106 13.4723C1.3532 13.2144 1.20833 12.8647 1.20833 12.5C1.20833 12.1353
                      1.3532 11.7856 1.61106 11.5277C1.86892 11.2699 2.21866 11.125 2.58333 11.125H10.8333C11.9274 11.125 12.9766 10.6904 13.7501 9.91682C14.5237 9.14323 
                      14.9583 8.09402 14.9583 7C14.9583 5.90598 14.5237 4.85677 13.7501 4.08318C12.9766 3.3096 11.9274 2.875 10.8333 2.875H4.98592L5.84758 3.73667C6.09793 
                      3.99611 6.23636 4.34351 6.23306 4.70403C6.22976 5.06455 6.08499 5.40935 5.82993 5.66417C5.57487 5.91898 5.22994 6.06343 4.86941 6.06639C4.50889 6.06935 
                      4.16163 5.93059 3.90242 5.68L0.694083 2.47167C0.501936 2.27941 0.371084 2.03451 0.318058 1.76791C0.265033 1.50132 0.292214 1.22499 0.396166 0.973833Z"
            fill="#191921"
          />
        </svg>
      </button>
      {id ? (
        joinGameMutation.isLoading ? (
          <div
            className="flex flex-col items-center justify-center 
      min-h-screen  p-5 "
          >
            <h2 className="text-white font-semibold">
              {Localization["Loading"][lang]}
            </h2>
          </div>
        ) : (
          <div
            className="flex flex-col items-center justify-center 
      min-h-screen  p-5 "
          >
            <div
              className="flex flex-col items-center justify-center space-y-2  border
         border-orange-color p-3 rounded-sm w-full max-w-xs mx-auto"
            >
              <h2 className="font-medium text-white text-lg pt-4">
                {!user && !token &&
                  <>{Localization["Tell us your name"][lang]}</>
                }
              </h2>
              <p className="text-gray-400 pb-2">
                <>{Localization["Your Friend"][lang]}</>
                {" "}
                <span className={"text-orange-color"}>{myFriend}</span>
                <>{Localization["waiting for you."][lang]}</>
                <br />
                <>{Localization["Join Now !!"][lang]}</>
              </p>

              <input
                disabled={user && token}
                type="text"
                placeholder={Localization["Tell us your name"][lang]}

                onChange={(e) => setName(e.target.value)}
                value={name}
                className="bg-transparent  border border-orange-color w-full
               p-2 rounded-sm text-white focus:outline-none focus:ring-0"
              />
              <button
                onClick={handleJoin}
                disabled={nameMutation.isLoading}
                className="relative w-full p-2 bg-orange-bg rounded-md cursor-pointer select-none
                active:translate-y-2  active:[box-shadow:0_0px_0_0_#1b6ff8,0_0px_0_0_#1b70f841]
                active:border-b-[0px] flex items-center justify-center
                transition-all duration-150 [box-shadow:0_5px_0_0_#c93b00,0_5px_0_0_#c93b00]
                border-b-[1px] border-gray-400/50 font-semibold text-white
              "
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-md" />
                {nameMutation.isLoading ?
                  <>{Localization["Loading"][lang]}</>
                  : <>{Localization["Join"][lang]}</>
                }
              </button>
            </div>
          </div>
        )
      ) : isVerified ? (
        <div
          className="flex flex-col items-center justify-center 
          min-h-screen  p-5 "
        >
          <div
            className="flex flex-col items-center justify-center space-y-2  border
             border-orange-color p-3 rounded-sm w-full max-w-xs mx-auto"
          >
            <h2 className="font-medium text-white text-lg pt-4">
              {Localization["Tell us your name"][lang]}
            </h2>
            <p className="text-gray-400 pb-2">

              {Localization["Your Friend"][lang]}
              {" "}
              <span className={"text-orange-color"}>{myFriend}</span>
              <>{Localization["waiting for you."][lang]}</>
              <br />
              <>{Localization["Join Now !!"][lang]}</>
            </p>

            <input
              disabled={user && token}
              type="text"
              placeholder={Localization["Tell us your name"][lang]}

              onChange={(e) => setName(e.target.value)}
              value={name}
              className="bg-transparent  border border-orange-color w-full
                   p-2 rounded-sm text-white focus:outline-none focus:ring-0"
            />
            <button
              onClick={handleJoin}
              disabled={nameMutation.isLoading}
              className="relative w-full p-2 bg-orange-bg rounded-md cursor-pointer select-none
              active:translate-y-2  active:[box-shadow:0_0px_0_0_#1b6ff8,0_0px_0_0_#1b70f841]
              active:border-b-[0px] flex items-center justify-center
              transition-all duration-150 [box-shadow:0_5px_0_0_#c93b00,0_5px_0_0_#c93b00]
              border-b-[1px] border-gray-400/50 font-semibold text-white
            "
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-md" />
              {nameMutation.isLoading || socketLoading ?
                <>{Localization["Loading"][lang]}</>
                : <>{Localization["Join"][lang]}</>
              }
            </button>
          </div>
        </div>
      ) : (
        <div
          className="flex flex-col items-center justify-center 
          min-h-screen  p-5 "
        >
          <div
            className="flex flex-col items-center justify-center space-y-4  
             p-3 rounded-sm w-full bg-dark-bg max-w-[600px] "
          >
            <h2 className="font-medium text-white text-lg capitalize">
              {Localization["enter code"][lang]}
            </h2>

            <input
              type="text"
              placeholder={Localization["enter code"][lang]}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="bg-transparent  border border-orange-color w-full
                   p-2 rounded-sm text-white focus:outline-none focus:ring-0"
            />
            <button
              disabled={
                joinViaCodeMutation.isLoading ||
                joinBetViaCodeMutation.isLoading
              }
              onClick={handleSubmitCode}
              className="relative w-full p-2 bg-orange-bg rounded-md cursor-pointer select-none
              active:translate-y-2  active:[box-shadow:0_0px_0_0_#1b6ff8,0_0px_0_0_#1b70f841]
              active:border-b-[0px] flex items-center justify-center
              transition-all duration-150 [box-shadow:0_5px_0_0_#c93b00,0_5px_0_0_#c93b00]
              border-b-[1px] border-gray-400/50 font-semibold text-white
            "
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-md" />
              {joinViaCodeMutation.isLoading || joinBetViaCodeMutation.isLoading
                ? <>{Localization["Loading"][lang]}</>
                : <>{Localization["Submit"][lang]}</>}
            </button>
          </div>
        </div>
      )}
      <Footer />

      <Toaster />
    </div>
  );
};

export default JoinGame;
