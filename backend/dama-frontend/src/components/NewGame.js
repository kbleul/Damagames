import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import background from "../assets/background.png";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { IoIosCopy } from "react-icons/io";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import toast, { Toaster } from "react-hot-toast";
import Pusher from "pusher-js";
const NewGame = () => {
  const navigate = useNavigate();
  const [isCreated, setIsCreated] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [value, setValue] = useState("");
  const [code, setCode] = useState("");
  const [codeCopied, setCodeCopied] = useState(false);
  const [name, setName] = useState("");
  useEffect(() => {
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  }, [isCopied]);

  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  const gameId = localStorage.getItem("gameId");
  //  console.log(gameId)
  useEffect(() => {
    const pusher = new Pusher(process.env.REACT_APP_PUSHER_KEY, {
      cluster: "ap2",
      encrypted: false,
      authEndpoint: `${process.env.REACT_APP_BACKEND_URL}sockets/authenticate`,
    });
    if (gameId) {
      const channel1 = pusher.subscribe(`private-dama.${gameId}`, {
        authEndpoint: `${process.env.REACT_APP_BACKEND_URL}sockets/authenticate`,
      });
      channel1.bind("joined", function (data) {
        console.log("data", data);
      });
    }
    var callback = (started, data) => {
      // console.log({data});
      if (data.status === "started") {
        navigate("/game");
        localStorage.setItem("playerOne", JSON.stringify(data.playerOne));
        localStorage.setItem("playerTwo", JSON.stringify(data.playerTwo));
      }
    };
    pusher.bind_global(callback);
    console.log("called");
  }, [gameId]);
  const submitName = () => {
    if (!name) {
      toast("name is required.");
      return;
    }
    nameMutationSubmitHandler();
  };

  const nameMutation = useMutation(
    async (newData) =>
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}add-player`,
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
            // console.log(responseData?.data);
            setIsCreated(true);
            setValue(
               "https://dama-blue.vercel.app/join-game/" + responseData?.data?.game
            );
            setCode(responseData?.data?.code);
            localStorage.setItem("gameId", responseData?.data?.game);
            localStorage.setItem(
              "playerOne",
              JSON.stringify(responseData?.data?.playerOne)
            );
            localStorage.setItem("playerOneToken", responseData?.data?.token);
            localStorage.setItem("playerOneIp", responseData?.data?.ip);
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
      {!isCreated ? (
        <div className="flex flex-col items-center justify-center min-h-screen space-y-2 p-5 max-w-xs mx-auto">
          <h2 className="font-medium text-white text-lg pt-5">
            Tell Us Your name
          </h2>
          <input
            type="text"
            onChange={(e) => setName(e.target.value)}
            value={name}
            className="bg-transparent border border-orange-color p-2 w-full
               text-white focus:outline-none focus:ring-0"
            placeholder="Tell Us Your name"
          />
          <button
            disabled={nameMutation.isLoading}
            onClick={submitName}
            className="bg-orange-bg p-2 px-10 font-medium text-white rounded-sm w-full"
          >
            {nameMutation.isLoading ? "Creating..." : "Create"}
          </button>
          <p
            onClick={() => navigate("/create-game")}
            className="text-orange-color text-center pt-3 cursor-pointer"
          >
            Back
          </p>
        </div>
      ) : (
        <div
          className="flex flex-col items-center justify-center 
        min-h-screen space-y-2 "
        >
          <div className="flex flex-col items-center justify-center  border border-orange-color p-3 rounded-sm">
            <h2 className="font-medium text-white text-lg">Great Work!</h2>
            <p className="text-gray-400 pb-2">
              Now send this link to your friend
            </p>
            <div className="flex items-center border border-gray-400 p-2 rounded-sm">
              <input
                type="text"
                value={value}
                disabled
                className="bg-transparent text-white focus:outline-none focus:ring-0"
              />
              <CopyToClipboard text={value} onCopy={() => setIsCopied(true)}>
                {isCopied ? (
                  <p className="text-xs text-green-500">Copied</p>
                ) : (
                  <IoIosCopy
                    className={`${
                      isCopied ? "text-green-500" : "text-gray-400"
                    }`}
                  />
                )}
              </CopyToClipboard>
            </div>
            {/* via code */}
            <div className="flex items-center space-x-2 justify-center">
              <div className="bg-orange-bg w-20 h-[1px]" />
              <p className="text-center text-orange-color py-2">or</p>
              <div className="bg-orange-bg w-20 h-[1px]" />
            </div>
            {/* code */}
            <div className="flex items-center border border-gray-400 p-2 rounded-sm">
              <input
                type="text"
                value={code}
                disabled
                className="bg-transparent text-white focus:outline-none focus:ring-0"
              />
              <CopyToClipboard text={code} onCopy={() => setCodeCopied(true)}>
                {codeCopied ? (
                  <p className="text-xs text-green-500">Copied</p>
                ) : (
                  <IoIosCopy
                    className={`${
                      codeCopied ? "text-green-500" : "text-gray-400"
                    }`}
                  />
                )}
              </CopyToClipboard>
            </div>
          </div>
        </div>
      )}

      <Toaster />
    </div>
  );
};

export default NewGame;
