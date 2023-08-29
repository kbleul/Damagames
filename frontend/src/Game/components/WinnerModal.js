import React, { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useNavigate } from "react-router-dom";
import wancha from "../../assets/wancha.svg";
import { useAuth } from "../../context/auth";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Localization } from "../../utils/language";

const WinnerModal = ({
  isWinnerModalOpen,
  setIsWinnerModalOpen,
  winnerPlayer,
  resetGame,
  rejectGameRequest,
  gameState,
  setNewGameWithComputer,
  isLeague,
  seasonId
}) => {
  const { user, token, setUser, lang, logout } = useAuth();
  const navigate = useNavigate();

  const [season_id, setSeason_id] = useState(null)
  const playerOneIp = localStorage.getItem("playerOneIp");
  const playerTwoIp = localStorage.getItem("playerTwoIp");

  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
  };

  const header = {
    "Content-Type": "application/json",
    Accept: "application/json"
  };

  const createGameMutation = useMutation(

    async (newData) =>
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}play-with-computer`, newData, {
        headers,
      }),
    {
      retry: false,
    }
  );

  const createGameMutation_NoAuth = useMutation(

    async (newData) =>
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}play-with-computer-na`, newData, {
        headers,
      }),
    {
      retry: false,
    }
  );

  const createGameAI = async (values) => {

    try {
      user && token ? createGameMutation.mutate(
        {},
        {
          onSuccess: (responseData) => {
            localStorage.setItem("gameId", responseData?.data?.data?.id)
            setNewGameWithComputer();
            setIsWinnerModalOpen(false);
          },
          onError: (err) => {
            if (err?.response?.status === 401) { logout(); }
          },
        }
      ) :
        createGameMutation_NoAuth.mutate(
          {},
          {
            onSuccess: (responseData) => {
              localStorage.setItem("gameId", responseData?.data?.data?.id)
              setNewGameWithComputer();
              setIsWinnerModalOpen(false);
            },
            onError: (err) => {
              if (err?.response?.status === 401) { logout(); }
            },
          }
        )
    } catch (err) { }
  };


  const handleResetGame = () => {
    checkWinner()
    if (gameState.players > 1) {
      resetGame();
    } else {
      createGameAI()
    }
  };


  const savePts = () => {
    setUser({ ...user, coin: user.coin + 50 })

    const tempObj = { ...user, coin: user.coin + 50 }

    localStorage.setItem("dama_user_data",
      JSON.stringify({
        token, user: { ...tempObj },
      }))
  }

  const checkWinner = () => {

    if (user && token) {

      if (gameState.players == 1 && (gameState.winner === "player1pieces" || gameState.winner === "player1moves")) {
        savePts()
      }
      else if (gameState.players > 1 && (winnerPlayer === "player1pieces" ||
        winnerPlayer === "player1moves") && playerOneIp != null) {
        savePts()
      }
      else if (gameState.players > 1 && (winnerPlayer === "player2pieces" ||
        winnerPlayer === "player2moves") && playerTwoIp != null) {
        savePts()
      }

    }

  }

  const userCoin = token ? JSON.parse(localStorage.getItem("dama_user_data")).user.coin : null


  const finishGameMutation = useMutation(
    async (newData) =>
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}play-with-computer-done/${localStorage.getItem("gameId")}`, newData, {
        headers,
      }),
    { retry: true, }
  );

  const finishGameAI = async (values) => {
    try {
      finishGameMutation.mutate(
        { is_user_win: values },
        {
          onSuccess: (responseData) => { localStorage.removeItem("gameId") },
          onError: (err) => {
            if (err?.response?.status === 401) { logout(); }
          },
        }
      );
    } catch (err) { }
  };


  const finishGameMutation_NoAuth = useMutation(
    async (newData) =>
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}play-with-computer-na-done/${localStorage.getItem("gameId")}`, newData, {
        headers: header,
      }),
    { retry: false, }
  );

  const finishGameAI_NoAuth = async (values) => {
    try {
      finishGameMutation_NoAuth.mutate(
        { is_user_win: values },
        {
          onSuccess: (responseData) => { localStorage.removeItem("gameId") },
          onError: (err) => {
            if (err?.response?.status === 401) { logout(); }
          },
        }
      );
    } catch (err) { }
  };



  const fetchSeasonsMutation = useMutation(
    async (newData) =>
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}player-season/${user.id}`, newData, {
        headers,
      }),
    { retry: true, }
  );

  const fetchSeasons = async (values) => {

    try {
      fetchSeasonsMutation.mutate(
        {},
        {
          onSuccess: (responseData) => {
            const seasons = responseData?.data?.data
            localStorage.setItem("dama-user-seasons", JSON.stringify(seasons));
            setTimeout(() => { navigate(`/league/${season_id}`) }, 2500)
          },
          onError: (err) => {
            setTimeout(() => { navigate(`/league/${season_id}`) }, 2500)
            if (err?.response?.status === 401) { logout(); }
          },
          enabled: user ? true : false,
        },
      );
    } catch (err) { navigate(`/league/${season_id}`); }
  };



  useEffect(() => {
    if (isWinnerModalOpen && gameState.players === 1) {
      if (user && token) {
        if (gameState.winner === "player1pieces" || gameState.winner === "player1moves") { finishGameAI(true) }
        else { finishGameAI(false) }
      }

      else {
        if (gameState.winner === "player1pieces" || gameState.winner === "player1moves") { finishGameAI_NoAuth(true) }
        else { finishGameAI_NoAuth(false) }
      }
    }
    !season_id && setSeason_id(seasonId)


    if (isWinnerModalOpen && isLeague) {

      setTimeout(fetchSeasons, 2500)
    }
  }, [isWinnerModalOpen])


  const CongraMsg = () => {
    return ((token && userCoin)
      ? <div className="text-white flex flex-col items-center justify-center gap-3 text-sm">
        <h2 className="text-2xl">{Localization["Congratulations"][lang]}</h2>

        {isLeague ?
          <p>{Localization["You won 3 coins."][lang]}</p>

          : <div>
            <p>{Localization["Previous"][lang]} = {userCoin} {Localization["coins"][lang]}</p>
            <p>{Localization["Total"][lang]} = {userCoin + 50} {Localization["coins"][lang]}</p>
          </div>}

      </div> : <div className="text-white">{Localization["Congratulations"][lang]}</div>)
  }
  // 191921
  const LostMsg = () => {
    return (token && userCoin ? <div className="text-white flex flex-col items-center justify-center gap-3 text-sm">
      <h2 className="text-2xl">{Localization["You Lost !"][lang]}</h2>
      <p>{Localization["You won 0 coins."][lang]}</p>
      <p>{Localization["Total"][lang]} = {userCoin} {Localization["coins"][lang]}</p>
    </div> : <div className="text-white">{Localization["You Lost !"][lang]} {Localization["You won 0 coins."][lang]}</div>)
  }


  return (
    <>
      <Transition appear show={isWinnerModalOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setIsWinnerModalOpen(true)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel
                  className="w-full max-w-md transform overflow-hidden 
              rounded-2xl bg-dark-bg p-6 text-left align-middle shadow-xl transition-all"
                >
                  <div className="mt-2">
                    {gameState.players != 1 && (
                      <div className="text-white font-semibold text-center capitalize py-5">
                        {gameState.players > 1
                          ? winnerPlayer === "player1pieces" ||
                            winnerPlayer === "player1moves"
                            ? playerOneIp != null
                              ? <CongraMsg />
                              : <LostMsg />
                            : winnerPlayer === "player2pieces" ||
                              winnerPlayer === "player2moves"
                              ? playerTwoIp != null
                                ? <CongraMsg />
                                : <LostMsg />
                              : ""
                          : gameState?.winner == "player2pieces" ||
                            "player2moves"
                            ? <LostMsg />
                            : <CongraMsg />}
                      </div>
                    )}
                    {gameState.players == 1 && (
                      <div className="w-[60%] ml-[20%] text-white font-semibold  text-center capitalize py-5">
                        {gameState.winner === "player1pieces" ||
                          gameState.winner === "player1moves"
                          ? <CongraMsg />
                          : <LostMsg />}
                      </div>
                    )}
                    <img src={wancha} alt="" className="absolute bottom-0 " />
                  </div>
                  {/* button */}
                  <div className="mt-4 flex flex-col items-center justify-center w-full space-y-4 pb-2">
                    {!isLeague && <button
                      type="button"
                      className="w-[60%] p-2 bg-orange-bg rounded-md cursor-pointer select-none
                    active:translate-y-2  active:[box-shadow:0_0px_0_0_#1b6ff8,0_0px_0_0_#1b70f841]
                    active:border-b-[0px]
                    transition-all duration-150 [box-shadow:0_5px_0_0_#c93b00,0_5px_0_0_#c93b00]
                    border-b-[1px] border-gray-300/50 font-semibold text-white"
                      onClick={handleResetGame}
                    >
                      {Localization["Rematch"][lang]}
                    </button>}
                    {!isLeague && <button
                      type="button"
                      className="w-[60%] p-2 bg-sky-700 rounded-md cursor-pointer select-none
                    active:translate-y-2  active:[box-shadow:0_0px_0_0_#026ca4,0_0px_0_0_#026ca4]
                    active:border-b-[0px]
                    transition-all duration-150 [box-shadow:0_5px_0_0_#026ca4,0_5px_0_0_#026ca4]
                    border-b-[1px] border-gray-300/50 font-semibold text-white
                  "
                      onClick={() => {
                        checkWinner();
                        gameState.players > 1 && rejectGameRequest();
                        navigate("/create-game");
                      }}
                    >{Localization["New Game"][lang]}

                    </button>}

                    {isLeague && <button
                      type="button"
                      className="w-[60%] p-2 bg-sky-700 rounded-md cursor-pointer select-none
                    active:translate-y-2  active:[box-shadow:0_0px_0_0_#026ca4,0_0px_0_0_#026ca4]
                    active:border-b-[0px]
                    transition-all duration-150 [box-shadow:0_5px_0_0_#026ca4,0_5px_0_0_#026ca4]
                    border-b-[1px] border-gray-300/50 font-semibold text-white
                  "
                      onClick={() => {
                        checkWinner();
                        navigate(`/league/${season_id}`);
                      }}
                    >{Localization["View Table"][lang]}

                    </button>}
                  </div>
                </Dialog.Panel>

              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default WinnerModal;
