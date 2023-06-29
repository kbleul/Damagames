import React, { Component, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { ThreeDots } from "react-loader-spinner";
import { Localization } from "../../utils/language";
import { useAuth } from "../../context/auth";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const DrawGameModal = ({
  isDrawModalOpen,
  setIsDrawModalOpen,
  acceptGameRequest,
  rejectGameRequest,
  showResetWaiting,
  gameId,
  seasonId
}) => {
  const { lang } = useAuth();
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",

  };

  const handleDrawGameMutation = useMutation(
    async (newData) =>
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}draw/${gameId}`,
        newData,
        {
          headers,
        }
      ),
    {
      retry: false,
    }
  );

  const handleDrawGameMutationSubmitHandler = async (values) => {
    console.log(values)
    try {
      handleDrawGameMutation.mutate(
        { seasonId: seasonId ? seasonId : null },
        {
          onSuccess: (responseData) => {
          },
          onError: (err) => {
          },

        }
      );
    } catch (err) { }
  };


  return (
    <>
      <Transition appear show={isDrawModalOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setIsDrawModalOpen(true)}
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
                  <div className="p-2 flex flex-col items-center space-y-2">
                    <h1 className="text-white font-medium capitalize text-center">
                      {Localization["You friend has requested for a draw ?"][lang]}
                    </h1>

                    <div className="grid grid-cols-2 gap-3 w-full">
                      <button
                        className="w-full p-2 bg-sky-700 rounded-md cursor-pointer select-none
active:translate-y-2  active:[box-shadow:0_0px_0_0_#026ca4,0_0px_0_0_#026ca4]
active:border-b-[0px]
transition-all duration-150 [box-shadow:0_5px_0_0_#026ca4,0_5px_0_0_#026ca4]
border-b-[1px] border-gray-300/50 font-medium text-white
"
                        onClick={() => {
                          handleDrawGameMutationSubmitHandler()
                          acceptGameRequest()
                        }}
                      >
                        {Localization["Accept"][lang]}
                      </button>
                      <button
                        className="w-full p-2 bg-orange-bg rounded-md cursor-pointer select-none
active:translate-y-2  active:[box-shadow:0_0px_0_0_#1b6ff8,0_0px_0_0_#1b70f841]
active:border-b-[0px]
transition-all duration-150 [box-shadow:0_5px_0_0_#c93b00,0_5px_0_0_#c93b00]
border-b-[1px] border-gray-300/50 font-medium text-white
"
                        onClick={rejectGameRequest}
                      >
                        {Localization["Reject"][lang]}
                      </button>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      <Transition appear show={showResetWaiting} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setIsDrawModalOpen(true)}
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
                  <div className="p-2 flex flex-col items-center space-y-2">
                    <h1 className="text-white font-medium text-center">
                      {Localization["Waiting for your friend"][lang]}
                    </h1>

                    <ThreeDots />
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

export default DrawGameModal;
