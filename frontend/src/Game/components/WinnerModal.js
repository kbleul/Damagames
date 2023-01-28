import React, { Component, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import wancha from "../../assets/wancha.svg";

const WinnerModal = ({
  isWinnerModalOpen,
  setIsWinnerModalOpen,
  winnerPlayer,
  resetGame,
  rejectGameRequest,
}) => {
  const navigate = useNavigate();
  const playerOneIp = localStorage.getItem("playerOneIp");
  const playerTwoIp = localStorage.getItem("playerTwoIp");
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
                    {/* <p className="text-sm text-gray-500">
                    Your payment has been successfully submitted. 
                  </p> */}

                    <h1 className="text-white font-semibold text-2xl text-center capitalize py-5">
                      {winnerPlayer === "player1pieces" ||
                      winnerPlayer === "player1moves"
                        ? playerOneIp != null
                          ? "congratulation!"
                          : "You Lose!"
                        : winnerPlayer === "player2pieces" ||
                          winnerPlayer === "player2moves"
                        ? playerTwoIp != null
                          ? "congratulation!"
                          : "You Lose!"
                        : ""}
                    </h1>
                    <img src={wancha} alt="" className="absolute bottom-0 " />
                  </div>
                  {/* button */}
                  <div className="mt-4 flex flex-col items-center justify-center w-full space-y-2 pb-2">
                    <button
                      type="button"
                      className="w-[60%] justify-center rounded-md 
                    bg-orange-bg px-4 py-2 text-sm text-white font-medium
                    hover:opacity-80"
                      onClick={resetGame}
                    >
                      Rematch
                    </button>
                    <button
                      type="button"
                      className="w-[60%] justify-center rounded-md border
                    border-orange-color px-4 py-2 text-sm text-white font-medium
                    hover:opacity-80"
                      onClick={()=>{rejectGameRequest();navigate('/create-game')}}
                    >
                      NewGame
                    </button>
                  </div>
                  <div className="flex items-center justify-center w-full">
                    {winnerPlayer === "player1pieces" ||
                    winnerPlayer === "player1moves" ? (
                      playerOneIp ? (
                        <button
                          type="button"
                          className="w-[60%] justify-center rounded-md border capitalize
                        border-orange-color px-4 py-2 text-sm text-white font-medium
                        hover:opacity-80"
                          onClick={() => {
                            setIsWinnerModalOpen(false);
                            navigate("/signup");
                          }}
                        >
                          save match
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="w-[60%] justify-center rounded-md border capitalize
                      border-orange-color px-4 py-2 text-sm text-white font-medium
                      hover:opacity-80"
                          onClick={() => {
                            setIsWinnerModalOpen(false);
                            navigate("/signup");
                          }}
                        >
                          save match
                        </button>
                      )
                    ) : winnerPlayer === "player2pieces" ||
                      winnerPlayer === "player2moves" ? (
                      playerTwoIp != null ? (
                        <button
                          type="button"
                          className="w-[60%] justify-center rounded-md border capitalize
                        border-orange-color px-4 py-2 text-sm text-white font-medium
                        hover:opacity-80"
                          onClick={() => {
                            setIsWinnerModalOpen(false);
                            navigate("/signup");
                          }}
                        >
                          save match
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="w-[60%] justify-center rounded-md border capitalize
                      border-orange-color px-4 py-2 text-sm text-white font-medium
                      hover:opacity-80"
                          onClick={() => {
                            setIsWinnerModalOpen(false);
                            navigate("/signup");
                          }}
                        >
                          save match
                        </button>
                      )
                    ) : (
                      ""
                    )}
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
