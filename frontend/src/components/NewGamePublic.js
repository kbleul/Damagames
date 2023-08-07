import { useEffect, useState } from "react";

import { useAuth } from "../context/auth";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import socket from "../utils/socket.io";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { clearCookie } from "../utils/data";
import background from "../assets/backdrop.jpg";
import ExitWarningModal from "../Game/components/ExitWarningModal";
import { Localization } from "../utils/language";
import { Circles } from "react-loader-spinner";

import wellDone from "../assets/Done.png"

const ACTION = {
  MENU: "menu",
  CREATING: "creating",
  CREATED: "created",
};

const NewGamePublic = () => {
  const { user, token, lang, logout } = useAuth();
  const navigate = useNavigate();

  //"menu" || "creating" || "created"
  const [action, setAction] = useState(ACTION.MENU);
  const [name, setName] = useState("");
  const [isCreated, setIsCreated] = useState(false);

  const [value, setValue] = useState("");
  const [code, setCode] = useState("");
  const [isExitModalOpen, setIsExitModalOpen] = useState(false);

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

            localStorage.setItem("gameId", responseData?.data?.data?.game);
            localStorage.setItem(
              "playerOne",
              JSON.stringify(responseData?.data?.data?.playerOne)
            );

            localStorage.setItem("playerOneIp", responseData?.data?.data?.ip);
          },
          onError: (err) => {
            if (err?.response?.status === 401) { logout(); }
          },
        }
      );
    } catch (err) { }
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
    } catch (err) { }
  };

  const submitName = () => {
    if (user && token) {
      setIsCreated(true)
      loggedInNameMutationSubmitHandler();
    } else {
      if (!name) {
        toast(Localization["name is required."][lang]);
        return;
      }
      setIsCreated(true)
      nameMutationSubmitHandler();
    }
  };

  useEffect(() => {
    socket.on("getMessage", (data) => {
      if (data.status === "started") {
        localStorage.setItem("p2", data.player2);
        navigate("/game");
      }
    });
  }, []);

  return (<>
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
            d="M0.396166 0.973833C0.500244 0.722555 0.676505 0.507786 0.902656 0.356693C1.12881 0.205599 1.39469 0.124969 1.66667 0.125H10.8333C12.6567 0.125 14.4054 0.849328 15.6947 2.13864C16.984 3.42795 17.7083 5.17664 17.7083 7C17.7083 8.82336 16.984 10.572 15.6947 11.8614C14.4054 13.1507 12.6567 13.875 10.8333 13.875H2.58333C2.21866 13.875 1.86892 13.7301 1.61106 13.4723C1.3532 13.2144 1.20833 12.8647 1.20833 12.5C1.20833 12.1353 1.3532 11.7856 1.61106 11.5277C1.86892 11.2699 2.21866 11.125 2.58333 11.125H10.8333C11.9274 11.125 12.9766 10.6904 13.7501 9.91682C14.5237 9.14323 14.9583 8.09402 14.9583 7C14.9583 5.90598 14.5237 4.85677 13.7501 4.08318C12.9766 3.3096 11.9274 2.875 10.8333 2.875H4.98592L5.84758 3.73667C6.09793 3.99611 6.23636 4.34351 6.23306 4.70403C6.22976 5.06455 6.08499 5.40935 5.82993 5.66417C5.57487 5.91898 5.22994 6.06343 4.86941 6.06639C4.50889 6.06935 4.16163 5.93059 3.90242 5.68L0.694083 2.47167C0.501936 2.27941 0.371084 2.03451 0.318058 1.76791C0.265033 1.50132 0.292214 1.22499 0.396166 0.973833Z"
            fill="#191921"
          />
        </svg>
      </button>
      {action === ACTION.MENU && (
        <section className="flex flex-col items-center justify-center h-[100vh] w-4/5 ml-[10%]">
          <button
            onClick={() => setAction(ACTION.CREATING)}
            className="relative w-full max-w-[400px] p-2 bg-orange-bg rounded-md cursor-pointer select-none
          active:translate-y-2  active:[box-shadow:0_0px_0_0_#1b6ff8,0_0px_0_0_#1b70f841]
          active:border-b-[0px] flex items-center justify-center
          transition-all duration-150 [box-shadow:0_5px_0_0_#c93b00,0_5px_0_0_#c93b00]
          border-b-[1px] border-gray-400/50 font-semibold text-white mb-8
              "
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-md" />
            {Localization["Create Game"][lang]}
          </button>

          <button
            onClick={() => navigate("/join-public")}
            className="relative w-full max-w-[400px] p-2 bg-orange-bg rounded-md cursor-pointer select-none
          active:translate-y-2  active:[box-shadow:0_0px_0_0_#1b6ff8,0_0px_0_0_#1b70f841]
          active:border-b-[0px] flex items-center justify-center
          transition-all duration-150 [box-shadow:0_5px_0_0_#c93b00,0_5px_0_0_#c93b00]
          border-b-[1px] border-gray-400/50 font-semibold text-white
              "
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-md" />
            {Localization["Join Game"][lang]}
          </button>
        </section>
      )}
      {action === ACTION.CREATING && (
        <div
          className=" w-full  flex flex-col max-w-xl mx-auto
            items-center justify-center min-h-screen space-y-2 p-5 "
        >
          <h2 className="font-medium text-white text-lg pt-5">
            {Localization["Tell us your name"][lang]}
          </h2>
          <input
            type="text"
            disabled={user}
            onChange={(e) => setName(e.target.value)}
            value={user ? user.username : name}
            className="bg-transparent border  border-orange-color  p-2 w-full rounded-md
                text-white focus:outline-none focus:ring-0  font-medium "
            placeholder={Localization["Tell us your name"][lang]}
          />
          <button
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
              ? Localization["Creating"][lang] : Localization["Create"][lang]}
          </button>
        </div>
      )}

      {action === ACTION.CREATED && (<article className="flex items-center justify-center relative w-full h-[100vh] ">
        <section className="text-white border-2 border-orange-color w-4/5 max-w-[400px] flex flex-col items-center justify-evenly 
         space-y-2 py-8 rounded-[2rem]">
          <div className="flex flex-col justify-center items-center w-4/5">
            <img className="w-12 h-12" src={wellDone} alt="" />
            <h2 className="font-bold text-2xl pt-4 ">{Localization["Great Work"][lang]}</h2>
            <p className=" pb-2 text-sm">{Localization["Game created successfully!"][lang]}</p>
          </div>

          <div className="flex flex-col justify-center items-center pt-4 ">
            <Circles color="#FF4C01" height="40" width="40" />
            <p className="px-6 py-8 ">{Localization["Waiting for someone to"][lang]}</p>
          </div>
        </section>
      </article>
      )}


      <Toaster />

      <ExitWarningModal
        isExitModalOpen={isExitModalOpen}
        set_isExitModalOpen={setIsExitModalOpen}
        beforeGame={true}
      />
    </main>



  </>
  );
};

export default NewGamePublic;


