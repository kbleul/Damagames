import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import background from "../assets/backdrop.jpg";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import toast, { Toaster } from "react-hot-toast";
import socket from "../utils/socket.io";
import { useAuth } from "../context/auth";

const JoinGame = () => {
  const { user, token } = useAuth();
  const [isVerified, setIsVerified] = useState(false);
  const { id } = useParams();
  const gameId = localStorage.getItem("gameId");
  const [code, setCode] = useState("");
  //store player one name
  const [myFriend, setMyFriend] = useState("Your Friend");

  console.log({ myFriend });
  // alert(gameId)
  // const playerTwo = JSON.parse(localStorage.getItem("playerTwo"))
  const navigate = useNavigate();
  const [name, setName] = useState(user && token ? user.username : "");
  useEffect(() => {
    socket.on("getMessage", (data) => {
      navigate("/game");
    });
  }, [navigate]);
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
  const joinGameMutationSubmitHandler = async (values) => {
    try {
      joinGameMutation.mutate(
        {},
        {
          onSuccess: (responseData) => {
            console.log(responseData?.data);

            responseData?.data?.data?.playerOne?.username &&  setMyFriend(prev => prev + " " + responseData?.data?.data?.playerOne?.username);

            localStorage.setItem(
              "players",
              JSON.stringify({
                player1: responseData?.data?.data?.playerOne?.username,
                player2: responseData?.data?.data?.playerTwo?.username,
              })
            );
          },
          onError: (err) => {
            console.log(err?.response?.data?.message);
            navigate("/already-joined");
          },
        }
      );
    } catch (err) {
      console.log(err);
    }
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
          socket.emit("sendMessage", {
            status: "started",
            player2: JSON.stringify(responseData?.data?.data?.playerTwo),
          });
          socket.emit("join-room", id);
          // socket.emit("sendMessage", { status: "started" });
          console.log(responseData?.data);
          // navigate("/game");
          //first clear local storage
          localStorage.clear();
          localStorage.setItem("playerTwoIp", responseData?.data?.data?.ip);
          localStorage.setItem(
            "playerTwo",
            JSON.stringify(responseData?.data?.data?.playerTwo)
          );
          // setIsCreated(true)
          // setValue(responseData?.data?.data?.data?.invitationLink)
          localStorage.setItem("gameId", responseData?.data?.data?.game);
          // localStorage.setItem('user',responseData?.data?.data?.data?.user)
        },
        onError: (err) => {
          console.log(err?.response?.data?.message);
        },
      });
    } catch (err) {
      console.log(err);
    }
  };

  //with code
  const nameMutationWithCode = async (values) => {
    try {
      nameMutation.mutate(user && token ? {} : { username: name }, {
        onSuccess: (responseData) => {
          socket.emit("join-room", gameId);

          socket.emit("sendMessage", { status: "started" });
          console.log(responseData?.data);

          navigate("/game");
          //first clear local storage
          localStorage.clear();
          localStorage.setItem("p1", responseData?.data?.data?.playerOne.name);
          localStorage.setItem("p2", responseData?.data?.data?.playerTwo.name);
          localStorage.setItem("playerTwoIp", responseData?.data?.data?.ip);
          localStorage.setItem(
            "playerTwo",
            JSON.stringify(responseData?.data?.data?.playerTwo)
          );
          localStorage.setItem("gameId", responseData?.data?.data?.game);
        },
        onError: (err) => {
          console.log(err?.response?.data?.message);
        },
      });
    } catch (err) {
      console.log(err);
    }
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
        user && token ? `${process.env.REACT_APP_BACKEND_URL}auth-join-game-via-code` : 
                        `${process.env.REACT_APP_BACKEND_URL}join-game-via-code`,
        newData,
        {
          headers:user && token ? header : headers,
        }
      ),
    {
      retry: false,
    }
  );
  const joinViaCodeMutationSubmitHandler = async (values) => {
    try {
      joinViaCodeMutation.mutate(
        { code: code },
        {
          onSuccess: (responseData) => {
            console.log(responseData?.data);
            setIsVerified(true);
            responseData?.data?.data?.playerOne?.username && setMyFriend(prev => prev + " " + responseData?.data?.data?.playerOne?.username);
            localStorage.setItem("gameId", responseData?.data?.data?.game);
          },
          onError: (err) => {
            console.log(err?.response?.data);
            toast(err?.response?.data?.message);
          },
        }
      );
    } catch (err) {
      console.log(err);
    }
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
                <span
                  className={
                    myFriend === "Your Friend"
                      ? ""
                      : "font-bold text-orange-400"
                  }
                >
                   {myFriend}
                </span>{" "}
                is waiting for you. <br />
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
                className="bg-orange-bg p-2 px-10 font-medium text-white rounded-sm w-full"
              >
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
              <span
                className={
                  myFriend === "Your Friend" ? "" : "font-bold text-orange-400"
                }
              >
                 {myFriend}
              </span>{" "}
              is waiting for you. <br />
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
              className="bg-orange-bg p-2 px-10 font-medium text-white rounded-sm w-full"
            >
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
            className="flex flex-col items-center justify-center space-y-2  border
             border-orange-color p-3 rounded-sm w-full bg-dark-bg max-w-[600px]"
          >
            <h2 className="font-medium text-white text-lg">Enter Code</h2>

            <input
              type="text"
              placeholder="Enter code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="bg-transparent  border border-orange-color w-full
                   p-2 rounded-sm text-white focus:outline-none focus:ring-0"
            />
            <button
              disabled={joinViaCodeMutation.isLoading}
              onClick={handleSubmitCode}
              className="bg-orange-bg p-2 px-10 font-medium text-white rounded-sm w-full"
            >
              {joinViaCodeMutation.isLoading ? "Loading..." : "Submit"}
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
      {/* {isVerified ? (
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
              Your Friend is Waiting You Join Now !
            </p>

            <input
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
              className="bg-orange-bg p-2 px-10 font-medium text-white rounded-sm w-full"
            >
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
            className="flex flex-col items-center justify-center space-y-2  border
           border-orange-color p-3 rounded-sm w-full"
          >
            <h2 className="font-medium text-white text-lg">Enter Link</h2>

            <input
              type="text"
              placeholder="Enter code"
              // value={value}
              className="bg-transparent  border border-orange-color w-full
                 p-2 rounded-sm text-white focus:outline-none focus:ring-0"
            />
            <button className="bg-orange-bg p-2 px-10 font-medium text-white rounded-sm w-full">
              Submit
            </button>
            <p
              onClick={() => navigate("/create-game")}
              className="text-orange-color text-center pt-3 cursor-pointer"
            >
              Back
            </p>
          </div>
        </div>
      )} */}
      <Toaster />
    </div>
  );
};

export default JoinGame;
