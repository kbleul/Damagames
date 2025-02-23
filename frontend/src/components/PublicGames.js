import { useEffect, useState, useRef } from "react";
import socket from "../utils/socket.io";
import Avatar from "../assets/Avatar.png";
import PublicGameImg from "../assets/PublicGameImg.png";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Footer } from "./Footer";
import { Localization } from "../utils/language";


const PubicGames = () => {
  const { user, token, lang, logout } = useAuth();
  const [isMessageSent, setIsMessageSent] = useState(false);
  const [isMessageListened, setIsMessageListened] = useState(false);
  const [socketLoading, setsocketLoading] = useState(false);
  const [tempPlayer, setTempPlayer] = useState(null);

  const [publicGames, setPublicGames] = useState([]);
  const [myFriend, setMyFriend] = useState(Localization["Your Friend"][lang]);
  const [code, setCode] = useState();
  const useLess = useRef(false);
  const [isVerified, setIsVerified] = useState(false);
  const [name, setName] = useState(user && token ? user.username : "");
  const navigate = useNavigate();

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
    socket.on("getPublicGames", (data) => {
      setPublicGames([...data]);
    });

    socket.emit("publicGames");
  }, []);


  useEffect(() => {
    socket.on("getMessage", (data) => {
      setIsMessageSent(false);
      setIsMessageListened(true);
      useLess.current = true;

      navigate("/game");
    });


  }, [isMessageListened]);

  // setInterval(() => {
  //   if (!useLess.current) {
  //     if (isMessageSent && !isMessageListened) {
  //       socket.emit("sendMessage", {
  //         status: "started",
  //         player2: JSON.stringify(tempPlayer),
  //       });
  //     }
  //   }
  // }, 500);

  const handleJoin = () => {
    if (!name) {
      toast(Localization["name is required."][lang]);

      return;
    }
    const gameId = localStorage.getItem("gameId");
    if (gameId) {
      nameMutationWithCode();
    }
  };
  const nameMutation = useMutation(
    async (newData) =>
      await axios.post(
        user && token
          ? `${process.env.REACT_APP_BACKEND_URL
          }auth-start-game/${localStorage.getItem("gameId")}`
          : `${process.env.REACT_APP_BACKEND_URL
          }add-player/${localStorage.getItem("gameId")}`,
        newData,
        {
          headers: user && token ? header : headers,
        }
      ),
    {
      retry: false,
    }
  );

  //with code
  const nameMutationWithCode = async (values) => {
    try {
      nameMutation.mutate(user && token ? {} : { username: name }, {
        onSuccess: (responseData) => {
          socket.emit("join-room", responseData?.data?.data?.game);

          socket.emit("sendMessage", {
            status: "started",
            player2: JSON.stringify(responseData?.data?.data?.playerTwo),
            pl: responseData?.data?.data?.playerOne?.username,
            p2: responseData?.data?.data?.playerTwo?.username,
            playerTwoIp: responseData?.data?.data?.ip,
            gameId: responseData?.data?.data?.game
          });

          localStorage.setItem(
            "playerTwo",
            JSON.stringify(responseData?.data?.data?.playerTwo)
          );

          setTempPlayer(JSON.stringify(responseData?.data?.data?.playerTwo));
          setIsMessageSent(true);
          setsocketLoading(true);


          setTimeout(() => {

            !isMessageListened && socket.emit("sendMessage", {
              status: "started",
              player2: JSON.stringify(responseData?.data?.data?.playerTwo),
              pl: responseData?.data?.data?.playerOne?.username,
              p2: responseData?.data?.data?.playerTwo?.username,
              playerTwoIp: responseData?.data?.data?.ip,
              gameId: responseData?.data?.data?.game
            });
          }, 3000)

        },
        onError: (err) => {
        },
      });
    } catch (err) {
    }
  };

  const handleSubmitCode = (mycode) => {
    socket.emit("joinPublicGame", mycode);
    joinViaCodeMutationSubmitHandler(mycode);

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
        { code: values },
        {
          onSuccess: (responseData) => {
            setIsVerified(true);
            responseData?.data?.data?.playerOne?.username &&
              setMyFriend(
                (prev) =>
                  prev + " " + responseData?.data?.data?.playerOne?.username
              );
            localStorage.setItem("gameId", responseData?.data?.data?.game);
            localStorage.setItem("p1", responseData?.data?.data?.playerOne?.username);

          },
          onError: (err) => {
            toast(err?.response?.data?.message);
          },
        }
      );
    } catch (err) {
    }
  };
  return (
    <>
      {!isVerified ? (
        <main className="flex flex-col items-center h-[100vh] overflow-y-scroll ">
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
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M0.396166 0.973833C0.500244 0.722555 0.676505 0.507786 0.902656 0.356693C1.12881 0.205599 1.39469 0.124969 1.66667 0.125H10.8333C12.6567 0.125 14.4054 0.849328 15.6947 2.13864C16.984 3.42795 17.7083 5.17664 17.7083 7C17.7083 8.82336 16.984 10.572 15.6947 11.8614C14.4054 13.1507 12.6567 13.875 10.8333 13.875H2.58333C2.21866 13.875 1.86892 13.7301 1.61106 13.4723C1.3532 13.2144 1.20833 12.8647 1.20833 12.5C1.20833 12.1353 1.3532 11.7856 1.61106 11.5277C1.86892 11.2699 2.21866 11.125 2.58333 11.125H10.8333C11.9274 11.125 12.9766 10.6904 13.7501 9.91682C14.5237 9.14323 14.9583 8.09402 14.9583 7C14.9583 5.90598 14.5237 4.85677 13.7501 4.08318C12.9766 3.3096 11.9274 2.875 10.8333 2.875H4.98592L5.84758 3.73667C6.09793 3.99611 6.23636 4.34351 6.23306 4.70403C6.22976 5.06455 6.08499 5.40935 5.82993 5.66417C5.57487 5.91898 5.22994 6.06343 4.86941 6.06639C4.50889 6.06935 4.16163 5.93059 3.90242 5.68L0.694083 2.47167C0.501936 2.27941 0.371084 2.03451 0.318058 1.76791C0.265033 1.50132 0.292214 1.22499 0.396166 0.973833Z"
                fill="#191921"
              />
            </svg>
          </button>
          <div>
            <img src={PublicGameImg} alt="" />
          </div>
          {publicGames?.length === 0 && (
            <p className="my-4 mt-[30vh] ml-[2%] w-[96%] max-w-[600px] text-orange-color font-bold">
              {Localization["No public games currently !"][lang]}
            </p>
          )}
          {publicGames?.map((game) => (
            <article
              style={{
                background: `linear-gradient(120deg, rgb(39, 138, 134) 1%, rgba(11, 42, 43, 0.32) 10%, rgb(22, 85, 82) 98%) repeat scroll 0% 0%`,
              }}
              key={game.code}
              className="mt-4 mb-6 rounded-md ml-[2%] w-[96%] max-w-[600px] border "
            >
              <section className="flex justify-evenly px-4 text-xs text-white font-bold border-b border-gray-600">
                <p className="w-1/2">{`${Localization["Rank"][lang]} - ${game.rank}`}</p>
                {/* <p className="">Coins - { game.coin ? game.coin : 0}</p> */}
                <p className="text-xs w-full text-right text-gray-400 mr-2">
                  {game.time}
                </p>
              </section>
              <section className="flex justify-between mt-2 text-sm">
                <div className="w-[80%] flex items-center justify-left pl-4">
                  <img className="w-6 h-6" src={Avatar} alt="avatar" />
                  <p className="text-white ml-4 font-bold">{game.createdBy}</p>
                </div>
                <button
                  onClick={() => {
                    handleSubmitCode(game.code);
                  }}
                  className="w-[20%] mr-4 bg-orange-color hover:bg-orange-600 text-black font-bold px-12 flex items-center justify-center cursor-pointer"
                >
                  {Localization["Play"][lang]}
                </button>
              </section>
              <section className="flex justify-between mt-2"></section>
            </article>
          ))}
        </main>
      ) : (
        <main>
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
                <span
                  className={
                    myFriend === Localization["Your Friend"][lang]
                      ? ""
                      : "font-bold text-orange-400"
                  }
                >
                  {myFriend}
                </span>{" "}
                {Localization["waiting for you."][lang]} <br />
                {Localization["Join Now !!"][lang]}
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
                {nameMutation.isLoading || socketLoading ? Localization["Loading"][lang] : Localization["Join"][lang]}
              </button>
              <p
                onClick={() => navigate("/create-game")}
                className="text-orange-color text-center pt-3 cursor-pointer"
              >
                {Localization["Back"][lang]}
              </p>
            </div>
          </div>
        </main>
      )}
    </>
  );
};

export default PubicGames;
