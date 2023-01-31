import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import background from "../assets/background.png";
import Pusher from "pusher-js";
import axios from "axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import toast, { Toaster } from "react-hot-toast";

const JoinGame = () => {
  const [isVerified, setIsVerified] = useState(false);
  const location = useLocation();
  const { id } = useParams();
  // console.log(location.search.split('=')[1])
  const [code, setCode] = useState("");
  const [success, setSuccess] = useState(false);
  const gameId = location.search;
  console.log({id})
  // alert(gameId)
  // const playerTwo = JSON.parse(localStorage.getItem("playerTwo"))
  const navigate = useNavigate();
  const [name, setName] = useState("");
  useEffect(() => {
    const pusher = new Pusher(process.env.REACT_APP_PUSHER_KEY, {
      cluster: "ap2",
      encrypted: false,
      authEndpoint: `${process.env.REACT_APP_BACKEND_URL}sockets/authenticate`,
    });
    if (id) {
      const channel1 = pusher.subscribe(`private-dama.${id}`, {
        authEndpoint: `${process.env.REACT_APP_BACKEND_URL}sockets/authenticate`,
      });
      channel1.bind("joined", function (data) {
        if (data.status === "joined") {
          setIsVerified(true);
        }
        console.log({ data });
      });
    }

    // console.log(channel1)
    var callback = (started, data) => {
      // console.log(data);
      if (data.status === "started") {
        navigate("/game");
        localStorage.setItem("playerOne", JSON.stringify(data.playerOne));
        localStorage.setItem("playerTwo", JSON.stringify(data.playerTwo));
      } else if (data.status === "joined") {
        setIsVerified(true);
      }
    };

    pusher.bind_global(callback);
  }, [id, navigate]);
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
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
          },
          onError: (err) => {},
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
    nameMutationSubmitHandler();
  };
  const nameMutation = useMutation(
    async (newData) =>
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}add-player/${id}`,
        newData,
        {
          headers,
        }
      ),
    {
      retry: false,
    }
  );
  const nameMutationSubmitHandler = async (values) => {
    try {
      nameMutation.mutate(
        { name: name },
        {
          onSuccess: (responseData) => {
            console.log(responseData?.data);
            localStorage.setItem("playerTwoIp", responseData?.data?.ip);
            // setIsCreated(true)
            // setValue(responseData?.data?.data?.invitationLink)
            localStorage.setItem("gameId",responseData?.data?.game)
            // localStorage.setItem('user',responseData?.data?.data?.user)
          },
          onError: (err) => {
            console.log(err?.response?.data?.data);
          },
        }
      );
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
  const joinViaCodeMutationSubmitHandler = async (values) => {
    try {
      joinViaCodeMutation.mutate(
        { code: code },
        {
          onSuccess: (responseData) => {
            console.log(responseData?.data);
            setIsVerified(true);
            // setIsCreated(true)
            // setValue(responseData?.data?.data?.invitationLink)
            localStorage.setItem(
              "playerTwo",
              JSON.stringify(responseData?.data?.playerTwo)
            );
            localStorage.setItem("playerTwoToken", responseData?.data?.token);
          },
          onError: (err) => {
            console.log(err?.response?.data);
            toast(err?.response?.data?.data);
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
