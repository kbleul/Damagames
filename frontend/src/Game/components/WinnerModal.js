import React, { Component, Fragment, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import wancha from "../../assets/wancha.svg";
import { useAuth } from "../../context/auth";

const WinnerModal = ({
  isWinnerModalOpen,
  setIsWinnerModalOpen,
  winnerPlayer,
  resetGame,
  rejectGameRequest,
  gameState,
  setNewGameWithComputer,
}) => {
  const { user, token, setUser } = useAuth();
  const navigate = useNavigate();
  const playerOneIp = localStorage.getItem("playerOneIp");
  const playerTwoIp = localStorage.getItem("playerTwoIp");
  const handleResetGame = () => {
    calcPts()
    if (gameState.players > 1) {
      resetGame();
    } else {
      setIsWinnerModalOpen(false);
      setNewGameWithComputer();
    }
  };

  const calcPts = () => {
    token && setUser({ ...user, coin: user.coin + 50 })
  }

  const userCoin = token ? JSON.parse(localStorage.getItem("dama_user_data")).user.coin : null

  const CongraMsg = () => {
    return ((token && userCoin)
      ? <div className="text-white flex flex-col items-center justify-center gap-3 text-sm">
        <h2 className="text-2xl">Congratulations!</h2>
        <p>Previous = {userCoin - 50} coins</p>
        <p>Total = {userCoin} coins</p>
      </div> : <div className="text-white">Congratulations! You won 50 coins</div>)
  }

  const LostMsg = () => {
    return (token && userCoin ? <div className="text-white flex flex-col items-center justify-center gap-3 text-sm">
      <h2 className="text-2xl">You Lost ! </h2>
      <p>You won 0 coins.</p>
      <p>Total = {userCoin} coins</p>
    </div> : <div className="text-white">You Lost! You won 0 coins.</div>)
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
                    <button
                      type="button"
                      className="w-[60%] p-2 bg-orange-bg rounded-md cursor-pointer select-none
                    active:translate-y-2  active:[box-shadow:0_0px_0_0_#1b6ff8,0_0px_0_0_#1b70f841]
                    active:border-b-[0px]
                    transition-all duration-150 [box-shadow:0_5px_0_0_#c93b00,0_5px_0_0_#c93b00]
                    border-b-[1px] border-gray-300/50 font-semibold text-white
                  "
                      onClick={handleResetGame}
                    >
                      Rematch
                    </button>
                    <button
                      type="button"
                      className="w-[60%] p-2 bg-sky-700 rounded-md cursor-pointer select-none
                    active:translate-y-2  active:[box-shadow:0_0px_0_0_#026ca4,0_0px_0_0_#026ca4]
                    active:border-b-[0px]
                    transition-all duration-150 [box-shadow:0_5px_0_0_#026ca4,0_5px_0_0_#026ca4]
                    border-b-[1px] border-gray-300/50 font-semibold text-white
                  "
                      onClick={() => {
                        calcPts();
                        rejectGameRequest();
                        navigate("/create-game");
                      }}
                    >
                      NewGame
                    </button>
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
