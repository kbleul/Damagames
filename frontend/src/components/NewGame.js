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
import { BsFacebook, BsTelegram } from "react-icons/bs";
import { RiWhatsappFill } from "react-icons/ri";
import { useAuth } from "../context/auth";

const NewGame = () => {
  const { user, token } = useAuth();

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

  //  console.log(gameId)

  useEffect(() => {
    socket.on("getMessage", (data) => {
      if (data.status === "started") {
        console.log("playerTwo_info ", data.player2);
        localStorage.setItem("p1", data.player1);
        localStorage.setItem("p2", data.player2);
        navigate("/game");
      }
    });

    socket.on("userLeaveMessage", (data) => {
      console.log("newGame", data);
    });
    // socket.on('disconnect',()=>{
    //   alert("disconnected")
    // })
    // socket.emit("join-room", gameId);
  }, []);

  const submitName = () => {
    if (user && token) {
      if (
        (betRef.current.checked && !coinAmount <= 0) ||
        !betRef.current.checked
      ) {
        loggedInNameMutationSubmitHandler();
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
            console.log(responseData?.data?.data);
            socket.emit("join-room", responseData?.data?.data?.game);
            setIsCreated(true);
            setValue(
              `${process.env.REACT_APP_FRONTEND_URL}/join-game/` +
                responseData?.data?.data?.game
            );
            setCode(responseData?.data?.data?.code);
            //first clear local storage
            localStorage.clear();
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
          onError: (err) => { console.log("error", err)},
        }
      );
    } catch (err) {
      console.log(err);
    }
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
            console.log(responseData?.data?.data);
            socket.emit("join-room", responseData?.data?.data?.game);
            setIsCreated(true);
            setValue(
              `${process.env.REACT_APP_FRONTEND_URL}/join-game/` +
                responseData?.data?.data?.game
            );

            if (betRef.current.checked) {
              localStorage.setItem("bt_coin_amount", coinAmount);
            }
            setCode(responseData?.data?.data?.code);
            //first clear local storage
            // localStorage.clear();
            localStorage.setItem("gameId", responseData?.data?.data?.game);
            localStorage.setItem(
              "playerOne",
              JSON.stringify(responseData?.data?.data?.playerOne)
            );
            // localStorage.setItem("playerOneToken", responseData?.data?.data?.token);
            localStorage.setItem("playerOneIp", responseData?.data?.data?.ip);
          },
          onError: (err) => {
            console.log(err.response.data.data);
            setCoinError(err.response.data.data);
          },
        }
      );
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    socket.on("private-room", (data) => console.log(data));
  }, []);

  console.log(JSON.parse(localStorage.getItem("dama_user_data"))?.user);

  const checkCoinAmoute = (e) => {
    setCoinAmount(e.target.value);

    if (e.target.value > profileData?.data?.data?.data?.coins) {
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
        headers:header,
      }),
    {
      keepPreviousData: true,
      refetchOnWindowFocus: false,
      retry: false,
      enabled: !!token,
    }
  );
  console.log(profileData?.data?.data?.data);
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
          <div className="flex justify-evenly items-center  w-3/5">
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
            <p className="text-white">Your coins : {profileData?.data?.data?.data?.coins}</p>
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
              )}
            </>
          )}
          <button
            disabled={nameMutation.isLoading}
            onClick={submitName}
            className="bg-orange-bg hover:opacity-70  p-2 px-10 font-semibold text-white rounded-md w-full"
          >
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
                className=" bg-transparent text-white focus:outline-none focus:ring-0  w-full"
              />
              <CopyToClipboard text={value} onCopy={() => setIsCopied(true)}>
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
                className="bg-transparent flex flex-grow text-white focus:outline-none focus:ring-0"
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
