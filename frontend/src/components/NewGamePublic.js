
import { useEffect, useState } from "react";
import dateFormat, { masks } from "dateformat";

import { useAuth } from "../context/auth";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import socket from "../utils/socket.io";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { IoIosCopy } from "react-icons/io";
import background from "../assets/backdrop.jpg";

const ACTION = {
  "MENU": "menu",
  "CREATING": "creating",
  "CREATED": "created"
}

const NewGamePublic = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  //"menu" || "creating" || "created"
  const [action, setAction] = useState(ACTION.MENU);
  const [name, setName] = useState("");
  const [open, setOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [value, setValue] = useState("");
  const [code, setCode] = useState("");
  const [codeCopied, setCodeCopied] = useState(false);

  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  const header = {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
  };

  //no userName if the user logged in
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
        { has_bet: false },
        {
          onSuccess: (responseData) => {
            socket.emit("join-room", responseData?.data?.data?.game);
            setAction(ACTION.CREATED);
            setValue(
              `${process.env.REACT_APP_FRONTEND_URL}/join-game/` +
              responseData?.data?.data?.game
            );
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
          onError: (err) => { },
        }
      );
    } catch (err) {
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
            setAction(ACTION.CREATED);
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

            let now = new Date();
            let time =
              now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
            socket.emit("postPublicGame", {
              code: responseData?.data?.data?.code,
              link:
                `${process.env.REACT_APP_FRONTEND_URL}/join-game/` +
                responseData?.data?.data?.game,
              createdBy: responseData?.data?.data?.playerOne.username,
              rank: responseData?.data?.data?.playerOne.rank,
              coin: responseData?.data?.data?.playerOne.coin,
            });
          },
          onError: (err) => { },
        }
      );
    } catch (err) {
    }
  };

  const submitName = () => {
    if (user && token) {
      loggedInNameMutationSubmitHandler();
    } else {
      if (!name) {
        toast("name is required.");
        return;
      }
      nameMutationSubmitHandler();
    }
  };
  useEffect(() => {
    socket.on("getMessage", (data) => {
      if (data.status === "started") {
        localStorage.setItem("p1", data.player1);
        localStorage.setItem("p2", data.player2);
        navigate("/game");
      }
    })
  }, [])

  return (
    <main
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
        className="z-10 bg-orange-color rounded-full w-8 h-8 flex justify-center items-center mr-2 mt-2 fixed right-0 md:right-4"
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
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M0.396166 0.973833C0.500244 0.722555 0.676505 0.507786 0.902656 0.356693C1.12881 0.205599 1.39469 0.124969 1.66667 0.125H10.8333C12.6567 0.125 14.4054 0.849328 15.6947 2.13864C16.984 3.42795 17.7083 5.17664 17.7083 7C17.7083 8.82336 16.984 10.572 15.6947 11.8614C14.4054 13.1507 12.6567 13.875 10.8333 13.875H2.58333C2.21866 13.875 1.86892 13.7301 1.61106 13.4723C1.3532 13.2144 1.20833 12.8647 1.20833 12.5C1.20833 12.1353 1.3532 11.7856 1.61106 11.5277C1.86892 11.2699 2.21866 11.125 2.58333 11.125H10.8333C11.9274 11.125 12.9766 10.6904 13.7501 9.91682C14.5237 9.14323 14.9583 8.09402 14.9583 7C14.9583 5.90598 14.5237 4.85677 13.7501 4.08318C12.9766 3.3096 11.9274 2.875 10.8333 2.875H4.98592L5.84758 3.73667C6.09793 3.99611 6.23636 4.34351 6.23306 4.70403C6.22976 5.06455 6.08499 5.40935 5.82993 5.66417C5.57487 5.91898 5.22994 6.06343 4.86941 6.06639C4.50889 6.06935 4.16163 5.93059 3.90242 5.68L0.694083 2.47167C0.501936 2.27941 0.371084 2.03451 0.318058 1.76791C0.265033 1.50132 0.292214 1.22499 0.396166 0.973833Z"
            fill="#191921"
          />
        </svg>
      </button>
      {action === ACTION.MENU && (
        <section className="flex flex-col items-center justify-between">
          <button
            onClick={() => setAction(ACTION.CREATING)}
            className="w-3/5 mt-[40vh] border-2 bg-transparent border-orange-color p-2 px-11 font-medium text-orange-color rounded-lg max-w-[20rem]"
          >
            Create Game
          </button>

          <button
            onClick={() => navigate("/join-public")}
            className="w-3/5 mt-4 border-2 bg-transparent border-orange-color p-2 px-11 font-medium text-orange-color rounded-lg max-w-[20rem]"
          >
            Join Game
          </button>
        </section>
      )}
      {action === ACTION.CREATING && (
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
          <button
            onClick={submitName}
            className="bg-orange-bg hover:opacity-70  p-2 px-10 font-semibold text-white rounded-md w-full"
          >
            {nameMutation.isLoading || loggedInMutation.isLoading
              ? "Creating..."
              : "Create"}
          </button>
          <p
            onClick={() => setAction(ACTION.MENU)}
            className="text-orange-color font-medium  text-center pt-3  cursor-pointer"
          >
            Back
          </p>
        </div>
      )}

      {action === ACTION.CREATED && (
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
                    className={`${isCopied ? "text-green-500" : "text-gray-300"
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
                    className={`${codeCopied ? "text-green-500" : "text-gray-400"
                      }`}
                  />
                )}
              </CopyToClipboard>
            </div>
          </div>
        </div>
      )}
      <Toaster />
    </main>
  );
};

export default NewGamePublic;
