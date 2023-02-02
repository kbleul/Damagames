import React, { Component, Fragment } from "react";
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
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const playerOneIp = localStorage.getItem("playerOneIp");
  const playerTwoIp = localStorage.getItem("playerTwoIp");
  const handleResetGame = () => {
    if (gameState.players > 1) {
      resetGame();
    } else {
      setIsWinnerModalOpen(false);
      setNewGameWithComputer();
    }
  };

  const congraMsg = user ?
    `congratulations!
      Previous = ${user.coin} coins
      Total = ${parseInt(user.coin) + 3} coins`
    : "congratulations! You won 3 coins"
  const lostMsg = user ?
    `You Lost! You won 0 coins. 
     Total = ` + user.coin + ` coins`
    : "You Lost! You won 0 coins."

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
                    {gameState.players != 1 &&
                      <h1 className="w-[60%] ml-[20%] text-white font-semibold text-center capitalize py-5">
                        {gameState.players > 1
                          ? winnerPlayer === "player1pieces" ||
                            winnerPlayer === "player1moves"
                            ? playerOneIp != null
                              ? congraMsg : lostMsg
                            : winnerPlayer === "player2pieces" ||
                              winnerPlayer === "player2moves"
                              ? playerTwoIp != null
                                ? congraMsg : lostMsg
                              : ""
                          : gameState?.winner == "player2pieces" || "player2moves"
                            ? lostMsg : congraMsg}
                      </h1>}
                    {gameState.players == 1 &&
                      <h1 className="w-[60%] ml-[20%] text-white font-semibold  text-center capitalize py-5">
                        {gameState.winner === "player1pieces" || gameState.winner === "player1moves"
                          ? congraMsg : lostMsg}
                      </h1>
                    }
                    <img src={wancha} alt="" className="absolute bottom-0 " />
                  </div>
                  {/* button */}
                  <div className="mt-4 flex flex-col items-center justify-center w-full space-y-2 pb-2">
                    <button
                      type="button"
                      className="w-[60%] justify-center rounded-md 
                    bg-orange-bg px-4 py-2 text-sm text-white font-medium
                    hover:opacity-80"
                      onClick={handleResetGame}
                    >
                      Rematch
                    </button>
                    <button
                      type="button"
                      className="w-[60%] justify-center rounded-md border
                    border-orange-color px-4 py-2 text-sm text-white font-medium
                    hover:opacity-80"
                      onClick={() => {
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
