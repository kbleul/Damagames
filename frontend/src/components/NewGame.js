import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import background from "../assets/backdrop.jpg";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { IoIosCopy } from "react-icons/io";
import axios from "axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import toast, { Toaster } from "react-hot-toast";
import socket from "../utils/socket.io";
import "./style.css";
import { BottomSheet } from "react-spring-bottom-sheet";
import "react-spring-bottom-sheet/dist/style.css";
import { BsTelegram } from "react-icons/bs";
import { Slider } from "@mui/material";

import { useAuth } from "../context/auth";
import { Footer } from "./Footer";
import { useHome } from "../context/HomeContext";
import { clearCookie } from "../utils/data";

const NewGame = () => {
  const { user, token } = useAuth();
  //const { setIsBet, setBetCoin } = useHome();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const [isCreated, setIsCreated] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [value, setValue] = useState("");
  const [code, setCode] = useState("");
  const [loginPrompt, setLoginPromt] = useState(false);
  const [coinError, setCoinError] = useState(null);

  const [codeCopied, setCodeCopied] = useState(false);
  const [name, setName] = useState("");
  const [coinAmount, setCoinAmount] = useState(0);
  // const playerCoins =
  //   user && token
  //     ? JSON.parse(localStorage.getItem("dama_user_data"))?.user?.coin
  //     : null;

  //coins input
  const [showInput, setShowInput] = useState(false);

  const gameId = localStorage.getItem("gameId");
  const betRef = useRef();

  const playerCoins =
    user && token
      ? JSON.parse(localStorage.getItem("dama_user_data"))?.user?.coin
      : null;

  useEffect(() => {
    setTimeout(() => {
      setIsCopied(false);
      setCodeCopied(false);
    }, 2000);
    // if (codeCopied || isCopied) {
    //   setOpen(true);
    // }
  }, [isCopied, codeCopied]);

  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  const header = {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
  };
  const playerOneIp = localStorage.getItem("playerOneIp");
  useEffect(() => {
    socket.on("getMessage", (data) => {
      console.log(data?.player2);
      if (data.status === "started" && data?.player2) {
        navigate("/game");
        localStorage.setItem("p2Info", data?.player2);
      }
    });

    socket.on("userLeaveMessage", (data) => {});
  }, []);

  const submitName = () => {
    if (user && token) {
      if (
        (betRef.current.checked && !coinAmount <= 0) ||
        !betRef.current.checked
      ) {
        if (
          (betRef.current.checked && !coinAmount <= 0) ||
          !betRef.current.checked
        ) {
          loggedInNameMutationSubmitHandler();
        }
      }
    } else {
      if (!name) {
        toast("name is required.");
        return;
      }
      nameMutationSubmitHandler();
    }
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
        { username: name, has_bet: false },
        {
          onSuccess: (responseData) => {
            socket.emit("join-room", responseData?.data?.data?.game);

            setIsCreated(true);
            setValue(
              `${process.env.REACT_APP_FRONTEND_URL}join-game/` +
                responseData?.data?.data?.game
            );
            setCode(responseData?.data?.data?.code);
            //first clear local storage
            clearCookie.forEach((data) => {
              localStorage.getItem(data) && localStorage.removeItem(data);
            });
            localStorage.setItem("gameId", responseData?.data?.data?.game);
            localStorage.setItem(
              "playerOne",
              JSON.stringify(responseData?.data?.data?.playerOne)
            );
            localStorage.setItem(
              "playerOneToken",
              responseData?.data?.data?.token
            );
            localStorage.setItem("playerOneIp", responseData?.data?.data?.ip);
          },
          onError: (err) => {},
        }
      );
    } catch (err) {}
  };

  //no userName if the user ligged in
  const loggedInMutation = useMutation(
    async (newData) =>
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}auth-create-game`,
        newData,
        {
          headers: header,
        }
      ),
    {
      retry: false,
    }
  );
  const loggedInNameMutationSubmitHandler = async (values) => {
    try {
      loggedInMutation.mutate(
        betRef.current.checked
          ? { has_bet: true, coin: coinAmount }
          : { has_bet: false },
        {
          onSuccess: (responseData) => {
            socket.emit("join-room", responseData?.data?.data?.game);
            setIsCreated(true);
            setValue(
              `${process.env.REACT_APP_FRONTEND_URL}join-game/` +
                responseData?.data?.data?.game
            );

            if (betRef.current.checked) {
              localStorage.setItem("bt_coin_amount", coinAmount);
            }

            //first clear local storage
            clearCookie.forEach((data) => {
              localStorage.getItem(data) && localStorage.removeItem(data);
            });
            setCode(responseData?.data?.data?.code);
            localStorage.setItem("gameId", responseData?.data?.data?.game);
            localStorage.setItem(
              "playerOne",
              JSON.stringify(responseData?.data?.data?.playerOne)
            );
            // localStorage.setItem("playerOneToken", responseData?.data?.data?.token);
            localStorage.setItem("playerOneIp", responseData?.data?.data?.ip);
          },
          onError: (err) => {
            setCoinError(err.response.data.data);
          },
        }
      );
    } catch (err) {}
  };
  useEffect(() => {
    socket.on("private-room", (data) => {});
  }, []);

  const checkCoinAmoute = (e) => {
    setCoinAmount(e.target.value);

    if (e.target.value > playerCoins) {
      setCoinError("Amount has to be less than you coins");
    } else if (e.target.value <= 0) {
      setCoinError("Invalid Amount");
    } else {
      setCoinError(null);
    }
  };

  //profile
  const profileData = useQuery(
    ["profileDataApi"],
    async () =>
      await axios.get(`${process.env.REACT_APP_BACKEND_URL}match-history`, {
        headers: header,
      }),
    {
      keepPreviousData: true,
      refetchOnWindowFocus: false,
      retry: false,
      enabled: !!token,
    }
  );

  const shareLink = async () => {
    {
      const tempurl = value.split("/").splice(-1)[0];
      console.log(tempurl[0]);
      if (navigator.share) {
        try {
          await navigator
            .share({
              url: `${tempurl}`,
            })
            .then(() =>
              console.log("Hooray! Your content was shared to tha world")
            );
        } catch (error) {
          console.log(`Oops! I couldn't share to the world because: ${error}`);
        }
      } else {
        // fallback code
        console.log(
          "Web share is currently not supported on this browser. Please provide a callback"
        );
      }
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
        <div
          className=" w-full  flex flex-col max-w-xl mx-auto
         items-center justify-center min-h-screen space-y-2 p-5 "
        >
          <h2 className="font-medium text-white text-lg pt-5">
            Tell Us Your name
          </h2>
          <input
            type="text"
            disabled={user}
            onChange={(e) => setName(e.target.value)}
            value={user ? user.username : name}
            className="bg-transparent border  border-orange-color  p-2 w-full rounded-md
               text-white focus:outline-none focus:ring-0  font-medium "
            placeholder="Tell Us Your name"
          />
          <div className="flex justify-evenly items-center  w-3/5 accent-orange-600">
            <input
              onChange={() => {
                if (betRef.current.checked) {
                  if (user && token) {
                    setShowInput(true);
                  } else {
                    //show sign in promp
                    setLoginPromt(true);
                  }
                } else {
                  setShowInput(false);
                }
              }}
              ref={betRef}
              type="checkbox"
              id="bet"
              name="bet"
              value="Bet"
            />
            <label for="bet" className="text-white">
              Play for coins
            </label>
          </div>
          {profileData?.data?.data?.data?.coins && (
            <p className="text-white">
              Your coins : {profileData?.data?.data?.data?.coins}
            </p>
          )}

          {coinError && <p className="text-red-400 text-sm">{coinError}</p>}
          {loginPrompt && (
            <p className="text-red-400 text-sm">
              Log in to bet coins{" "}
              <span
                onClick={() => navigate("/login")}
                className="text-white font-bold cursor-pointer"
                href="/login"
              >
                Here
              </span>
            </p>
          )}
          {/* {coinsError && <p className="text-red-400 text-sm">You need at least 1 coin to play with coin<a className="text-white font-bold" href="/login">Here</a></p>} */}

          {showInput && (
            <>
              {profileData?.data?.data?.data?.coins === 0 ? (
                <p className="text-white">Not enough coins</p>
              ) : (
                <div className=" w-4/5">
                  <Slider
                    aria-label="Default"
                    valueLabelDisplay="auto"
                    defaultValue={parseInt(playerCoins) / 10}
                    step={10}
                    min={1}
                    max={parseInt(playerCoins)}
                    color="warning"
                    onChange={(e) => setCoinAmount(e.target.value)}
                  />
                </div>
              )}

              {/* (
                <input
                  className="bg-transparent border  border-orange-color  p-2 w-[60%] rounded-md
                text-white focus:outline-none focus:ring-0 text-center font-medium"
                  onChange={(e) => checkCoinAmoute(e)}
                  type="number"
                  placeholder="Enter number of coins"
                  min="1"
                  max="10"
                  value={coinAmount}
                />
              ) */}
            </>
          )}
          <button
            disabled={nameMutation.isLoading}
            onClick={submitName}
            className="relative w-full p-2 bg-orange-bg rounded-md cursor-pointer select-none
            active:translate-y-2  active:[box-shadow:0_0px_0_0_#1b6ff8,0_0px_0_0_#1b70f841]
            active:border-b-[0px] flex items-center justify-center
            transition-all duration-150 [box-shadow:0_5px_0_0_#c93b00,0_5px_0_0_#c93b00]
            border-b-[1px] border-gray-400/50 font-semibold text-white
          "
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-md" />
            {nameMutation.isLoading || loggedInMutation.isLoading
              ? "Creating..."
              : "Create"}
          </button>
          <p
            onClick={() => navigate("/create-game")}
            className="text-orange-color font-medium  text-center pt-3  cursor-pointer"
          >
            Back
          </p>
        </div>
      ) : (
        <div
          className="absolute  w-full flex flex-col items-center justify-center 
        min-h-screen space-y-2 p-5"
        >
          <div
            className="flex flex-col items-center justify-center max-w-xl mx-auto w-full 
           border-2 border-orange-color p-3 rounded-md"
          >
            <h2 className="font-medium text-white text-lg ">Great Work!</h2>
            <p className="text-gray-200 pb-2 capitalize ">
              Now send this link to your friend
            </p>

            <div className="z-40 flex items-center border border-gray-400 p-2 rounded-sm w-full">
              <input
                type="text"
                value={value}
                disabled
                className=" bg-transparent text-white focus:outline-none focus:ring-0  w-full pr-2"
              />

              <CopyToClipboard
                className="w-8 h-5 text-white border-l-2 border-orange-color pl-2"
                text={value}
                onCopy={() => setIsCopied(true)}
              >
                {isCopied ? (
                  <p className="text-xs text-green-500">Copied</p>
                ) : (
                  <IoIosCopy
                    className={`${
                      isCopied ? "text-green-500" : "text-gray-300"
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
            <div className="flex items-center  border border-gray-400 p-2 rounded-sm  w-full">
              <input
                type="text"
                value={code}
                disabled
                className="w-[90%] bg-transparent flex flex-grow text-white focus:outline-none focus:ring-0 "
              />

              <CopyToClipboard
                className="w-8 h-5 text-white border-l-2 border-orange-color pl-2"
                text={code}
                onCopy={() => setCodeCopied(true)}
              >
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

            <p
              className="text-white w-14 h-12 rounded-full mt-4 text-center"
              onClick={shareLink}
            >
              Share
            </p>
          </div>
        </div>
      )}
      <Footer />
      <BottomSheet
        open={open}
        onDismiss={() => setOpen(false)}
        snapPoints={({ maxHeight }) => [maxHeight / 3, maxHeight * 0.8]}
      >
        <div className="p-5 flex flex-col items-center justify-center space-y-2">
          <h1 className="font-medium capitalize text-gray-700">
            Share the link Via
          </h1>
          <div className="flex items-center justify-center space-x-3">
            <BsTelegram size={40} className="text-sky-500" />
            <BsTelegram size={40} className="text-sky-500" />
            <BsTelegram size={40} className="text-sky-500" />
            <BsTelegram size={40} className="text-sky-500" />
          </div>
        </div>
      </BottomSheet>
      <Toaster />
    </div>
  );
};

export default NewGame;
