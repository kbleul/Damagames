import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { useNavigate } from "react-router-dom";
import socket from "../../utils/socket.io";
import { clearCookie } from "../../utils/data";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Localization } from "../../utils/language";
import { useAuth } from "../../context/auth";

export default function ExitWarningModal({
  isExitModalOpen,
  set_isExitModalOpen,
  gameState,
  beforeGame,
  isLeague,
  seasonId,
  playerData
}) {
  const navigate = useNavigate();
  const gameId = localStorage.getItem("gameId");
  const { lang, logout } = useAuth();

  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json"
  };

  const exitGameMutation = useMutation(
    async (newData) =>
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}game-exit/${gameId}`,
        newData,
        {
          headers,
        }
      ),
    {
      retry: false,
    }
  );



  const exitLeagueGameMutation = useMutation(
    async (newData) =>
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}scores`,
        newData,
        { headers }
      ),
    {
      retry: false,
    }
  );

  const exitGameMutationSubmitHandler = async (values) => {
    try {
      if (isLeague) {
        try {
          exitLeagueGameMutation.mutate(
            {
              winner: playerData,
              game_id: gameId,
              season_id: seasonId
            },
            {
              onSuccess: (responseData) => { navigate(`/league/${seasonId}`) },
              onError: (err) => {
                if (err?.response?.status === 401) { logout(); }
                else navigate(`/league/${seasonId}`)
              },
            }
          )
        } catch (err) { navigate(`/league/${seasonId}`) }


      }

      else {
        exitGameMutation.mutate(
          {
          },
          {
            onSuccess: (responseData) => {
            },
            onError: (err) => {
              if (err?.response?.status === 401) { logout(); }
            },
          }
        );
      }

    } catch (err) { }
  };


  const handleExit = () => {
    //exit socket code here
    if (gameState?.players > 1 || beforeGame) {
      exitGameMutationSubmitHandler()
      socket.emit("sendExitGameRequest", { status: "Exit" });
    }
    socket.emit('leave', gameId)
    clearCookie.forEach((data) => {
      localStorage.getItem(data) && localStorage.removeItem(data);
    });

    !isLeague && navigate("/create-game");
  };


  return (
    <>
      <Transition appear show={isExitModalOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => set_isExitModalOpen(true)}
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

          <div className="fixed inset-0 overflow-y-auto ">
            <div className=" flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="border border-orange-500 bg-[#181920] w-full max-w-md transform overflow-hidden rounded-2xl  p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-white text-center"
                  >
                    {Localization["you are about to"][lang]}
                  </Dialog.Title>


                  {beforeGame ? <div className="mt-2">
                    <p className="text-sm text-gray-500 text-center ">
                      {Localization["Are you sure"][lang]}
                    </p>
                  </div> :
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 text-center ">
                        {Localization["Are you sure_"][lang]}
                      </p>
                    </div>
                  }

                  {isLeague && <div className="mt-2">
                    <p className="text-sm text-gray-500 text-center ">
                      {Localization["Are you sure_league"][lang]}
                    </p>
                  </div>}

                  <div className="mt-4 flex w-full items-center space-x-5 justify-center">
                    <button
                      type="button"
                      className="w-full p-2  bg-sky-700 rounded-md cursor-pointer select-none
                       active:translate-y-2  active:[box-shadow:0_0px_0_0_#026ca4,0_0px_0_0_#026ca4]
                       active:border-b-[0px]
                       transition-all duration-150 [box-shadow:0_5px_0_0_#026ca4,0_5px_0_0_#026ca4]
                       border-b-[1px] border-gray-300/50 font-semibold text-white
                     "
                      onClick={handleExit}
                    >
                      {Localization["Yes"][lang]}
                    </button>
                    <button
                      type="button"
                      onClick={() => set_isExitModalOpen(false)}
                      className="w-full p-2 bg-orange-bg rounded-md cursor-pointer select-none
                      active:translate-y-2  active:[box-shadow:0_0px_0_0_#1b6ff8,0_0px_0_0_#1b70f841]
                      active:border-b-[0px]
                      transition-all duration-150 [box-shadow:0_5px_0_0_#c93b00,0_5px_0_0_#c93b00]
                      border-b-[1px] border-gray-300/50 font-medium text-white
                    "
                    >
                      {Localization["No"][lang]}
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
}
