import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import background from "../assets/backdrop.jpg";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import toast, { Toaster } from "react-hot-toast";
import socket from "../utils/socket.io";
import { useAuth } from "../context/auth";
import { useHome } from "../context/HomeContext";

import { clearCookie } from "../utils/data";
import { Footer } from "./Footer";

const JoinGame = () => {
  const { user, token } = useAuth();
  const [isVerified, setIsVerified] = useState(false);
  const { id } = useParams();
  const gameId = localStorage.getItem("gameId");
  const [code, setCode] = useState("");
  const [success, setSuccess] = useState(false);
  //store player one name
  const [myFriend, setMyFriend] = useState("");
  // const { setIsBet, setBetCoin } = useHome();

  // to check if  creater and the joining player are the same
  const sameUser = useRef(false);

  let msgCounter = 0;

  const ipRef = useRef(localStorage.getItem("playerOneIp"));
  const navigate = useNavigate();
  const [name, setName] = useState(user && token ? user.username : "");
  useEffect(() => {
    socket.on("getMessage", (data) => {
      navigate("/game");
    });

    socket.on("samePerson", (data) => {
      msgCounter === 0 && toast(data);
      sameUser.current = true;
      ++msgCounter;
    });
  }, []);
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
    } catch (err) {}
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
          }
          socket.emit("join-room", id);

          //first clear local storage
          clearCookie.forEach((data) => {
            localStorage.getItem(data) && localStorage.removeItem(data);
          });
          localStorage.setItem("playerTwoIp", responseData?.data?.data?.ip);
          localStorage.setItem(
            "playerTwo",
            JSON.stringify(responseData?.data?.data?.playerTwo)
          );
          localStorage.setItem("gameId", responseData?.data?.data?.game);
        },
        onError: (err) => {},
      });
    } catch (err) {}
  };

  //with code
  const nameMutationWithCode = async (values) => {
    try {
      nameMutation.mutate(user && token ? {} : { username: name }, {
        onSuccess: (responseData) => {
          console.log("zzzzz", responseData?.data?.data?.playerOne);
          socket.emit("join-room", gameId);
          if (ipRef.current !== responseData?.data?.data?.ip) {
            socket.emit("sendMessage", {
              status: "started",
              player2: JSON.stringify(responseData?.data?.data?.playerTwo),
            });
          }

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
            responseData?.data?.data?.playerOne.username
          );
          localStorage.setItem("playerTwoIp", responseData?.data?.data?.ip);
          localStorage.setItem(
            "playerTwo",
            JSON.stringify(responseData?.data?.data?.playerTwo)
          );
          localStorage.setItem("gameId", responseData?.data?.data?.game);
        },
        onError: (err) => {},
      });
    } catch (err) {}
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

              // if (responseData?.data.data.bet_coin === 0) {
              //   setIsBet(false)
              // } else {
              //   setIsBet(true);
              //   setBetCoin(responseData?.data.data.bet_coin)
              // }

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
    } catch (err) {}
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
      {id ? (
        joinGameMutation.isLoading ? (
          <div
            className="flex flex-col items-center justify-center 
      min-h-screen  p-5 "
          >
            <h2 className="text-white font-semibold">Loading</h2>
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
                {!user && !token && " Tell Us Your Name"}
              </h2>
              <p className="text-gray-400 pb-2">
                Your Friend{" "}
                <span className={"text-orange-color"}>{myFriend}</span> is
                waiting for you. <br />
                Join Now !!
              </p>

              <input
                disabled={user && token}
                type="text"
                placeholder="Tell us Your name"
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
                {nameMutation.isLoading ? "Loading.." : "Join"}
              </button>
              <p
                onClick={() => navigate("/create-game")}
                className="text-orange-color text-center pt-3 cursor-pointer"
              >
                Back
              </p>
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
              Tell Us Your Name
            </h2>
            <p className="text-gray-400 pb-2">
              Your Friend{" "}
              <span className={"text-orange-color"}>{myFriend}</span> is waiting
              for you. <br />
              Join Now !
            </p>

            <input
              disabled={user && token}
              type="text"
              placeholder="Tell us Your name"
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
              {nameMutation.isLoading ? "Loading.." : "Join"}
            </button>
            <p
              onClick={() => navigate("/create-game")}
              className="text-orange-color text-center pt-3 cursor-pointer"
            >
              Back
            </p>
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
            <h2 className="font-medium text-white text-lg capitalize">enter code</h2>
              
            <input
              type="text"
              placeholder="Enter code"
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
                ? "Loading..."
                : "Submit"}
            </button>
            <p
              onClick={() => navigate("/create-game")}
              className="text-orange-color text-center pt-3 cursor-pointer"
            >
              Back
            </p>
          </div>
        </div>
      )}
      <Footer />

      <Toaster />
    </div>
  );
};

export default JoinGame;
