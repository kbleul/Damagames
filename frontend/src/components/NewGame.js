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
import { IoIosShareAlt } from "react-icons/io";

import { Slider } from "@mui/material";
import { Checkbox } from "@mui/material";

import { useAuth } from "../context/auth";
import { Footer } from "./Footer";
import { useHome } from "../context/HomeContext";
import { clearCookie } from "../utils/data";
import { MdOutlineCancel } from "react-icons/md";
import ExitWarningModal from "../Game/components/ExitWarningModal";

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
  const [isExitModalOpen, setIsExitModalOpen] = useState(false);

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
      // console.log(JSON.stringify(data?.player2));
      if (data.status === "started" && data?.player2) {
        navigate("/game");
        localStorage.setItem("p2Info", data?.player2);
      }
    });

    socket.on("userLeaveMessage", (data) => { });

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
            socket.emit("leave", gameId);
            socket.emit("join-room", responseData?.data?.data?.game);

            setIsCreated(true);
            setValue(
              `${process.env.REACT_APP_FRONTEND_URL}/join-game/` +
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
          onError: (err) => { },
        }
      );
    } catch (err) { }
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
            socket.emit("leave", gameId);
            socket.emit("join-room", responseData?.data?.data?.game);
            setIsCreated(true);
            setValue(
              `${process.env.REACT_APP_FRONTEND_URL}/join-game/` +
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
    } catch (err) { }
  };
  useEffect(() => {
    socket.on("private-room", (data) => { });
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
    const tempurl = value.split("/").splice(-1)[0];
    // console.log(tempurl[0])
    if (navigator.share) {
      try {
        await navigator
          .share({
            url: `join-game/${tempurl}`,
          })
          .then(() => console.log(""));
      } catch (error) {
        console.log(``);
      }
    } else {
      // fallback code
      console.log("");
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
      <button
        className="z-10 bg-orange-color rounded-full w-8 h-8 flex justify-center items-center mr-2 mt-2 fixed left-2 md:left-4"
        onClick={() => isCreated ? setIsExitModalOpen(true) : navigate("/create-game")}
      >
        <svg
          width="18"
          height="14"
          viewBox="0 0 18 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
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
              className="w-6 h-4 accent-orange-color"
              onChange={() => {
                if (betRef.current.checked) {
                  if (user && token) {
                    setShowInput(true);
                    setCoinAmount(profileData?.data?.data?.data?.coins / 10)
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
                    defaultValue={profileData?.data?.data?.data?.coins / 10}
                    step={10}
                    min={1}
                    max={profileData?.data?.data?.data?.coins}
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
        </div>
      ) : (
        <div
          className="absolute  w-full flex flex-col items-center justify-center 
        min-h-screen space-y-2 p-5"
        >
          {/* <MdOutlineCancel onClick={() => setIsCreated(false)} className="absolute top-2 left-2 text-orange-color w-8 h-8" /> */}

          <div
            className="flex flex-col items-center justify-center max-w-xl mx-auto w-full 
            p-3 rounded-md"
          >
            <h2 className="font-medium text-white text-lg ">Great Work!</h2>
            <p className="text-gray-200 pb-2  ">
              Now send this Link to your Friend
            </p>

            <div className="z-40 flex items-center border border-gray-400  w-full rounded-xl">
              <input
                type="text"
                value={value}
                disabled
                className="w-[90%] bg-transparent flex flex-grow text-white focus:outline-none focus:ring-0 p-2 border-r-2"
              />

              <div className="flex items-center">
                <CopyToClipboard
                  className={
                    isCopied
                      ? "w-12 h-full text-green-500 text-xs"
                      : "w-5 h-5 text-orange-color "
                  }
                  text={value}
                  onCopy={() => setIsCopied(true)}
                >
                  {isCopied ? (
                    <p className="w-6 h-6 text-xs text-green-500">Copied</p>
                  ) : (
                    <IoIosCopy
                      className={`${isCopied ? "text-green-500" : "text-red-500"
                        }`}
                    />
                  )}
                </CopyToClipboard>
                <p
                  className={
                    isCopied ? "hidden" : "text-white text-sm font-bold pr-1"
                  }
                >
                  {isCopied ? "Copied" : "Copy"}
                </p>
              </div>

              {/* <input
                type="text"
                value={value}
                disabled
                className=" bg-transparent text-white focus:outline-none focus:ring-0  w-full pr-2 "
              />

              <button onClick={() => setCodeCopied(true)} className={codeCopied ? "text-green-500 text-sm border-l-2 p-2 font-bold" : "text-white text-sm border-l-2 p-2 font-bold"}>{codeCopied ? "Copied" : "Copy"}</button> */}

              {/* <CopyToClipboard
                className="w-8 h-5 text-orange-color border-2 border-orange-color p-2"
                text={value}
                onCopy={() => setIsCopied(true)}
              >
                {isCopied ? (
                  <p className="text-xs text-green-500">Copied</p>
                ) : (
                  <IoIosCopy
                    className={`${isCopied ? "text-green-500" : "text-gray-300"
                      }`}
                  />
                )}
              </CopyToClipboard> */}
            </div>
            {/* via code */}
            <div className="flex items-center space-x-2 justify-center">
              <div className="bg-orange-bg w-20 h-[1px]" />
              <p className="text-center text-orange-color py-2">or</p>
              <div className="bg-orange-bg w-20 h-[1px]" />
            </div>
            {/* code */}
            <div className="flex items-center  border border-gray-400    w-full rounded-xl">
              <input
                type="text"
                value={code}
                disabled
                className="border-r-2 w-[90%] bg-transparent flex flex-grow text-white focus:outline-none focus:ring-0 p-2 rounded-"
              />

              {/* <CopyToClipboard
                className="w-8 h-5 text-white border-l-2 text-orange-color pl-2"
                text={code}
                onCopy={() => setCodeCopied(true)}
              >
                {codeCopied ? (
                  <p className="text-xs text-green-500">Copied</p>
                ) : (
                  <IoIosCopy
                    className={`${codeCopied ? "text-green-500" : "text-gray-400"
                      }`}
                  />
                )}
              </CopyToClipboard> */}

              <div className="flex items-center">
                <CopyToClipboard
                  className={
                    codeCopied
                      ? "w-12 h-full text-green-500 text-xs"
                      : "w-5 h-5 text-orange-color "
                  }
                  text={code}
                  onCopy={() => setCodeCopied(true)}
                >
                  {codeCopied ? (
                    <p className="w-6 h-6 text-xs text-green-500">Copied</p>
                  ) : (
                    <IoIosCopy
                      className={`${codeCopied ? "text-green-500" : "text-red-500"
                        }`}
                    />
                  )}
                </CopyToClipboard>
                <p
                  className={
                    codeCopied ? "hidden" : "text-white text-sm font-bold pr-1"
                  }
                >
                  {codeCopied ? "Copied" : "Copy"}
                </p>
              </div>
            </div>

            <div
              onClick={shareLink}
              className="relative w-4/5 mt-10 p-2 bg-orange-bg rounded-md cursor-pointer select-none
    active:translate-y-2  active:[box-shadow:0_0px_0_0_#1b6ff8,0_0px_0_0_#1b70f841]
    active:border-b-[0px] flex items-center justify-center
    transition-all duration-150 [box-shadow:0_5px_0_0_#c93b00,0_5px_0_0_#c93b00]
    border-b-[1px] border-gray-400/50 font-semibold text-white
     "
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-md" />
              <IoIosShareAlt className="w-6 h-6" />
              <p>Share</p>
            </div>
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

      <ExitWarningModal
        isExitModalOpen={isExitModalOpen}
        set_isExitModalOpen={setIsExitModalOpen}
        beforeGame={true}
      />
    </div>
  );
};

export default NewGame;
