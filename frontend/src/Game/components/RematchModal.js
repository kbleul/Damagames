import React, { Component, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Link, useNavigate } from "react-router-dom";
import wancha from "../../assets/wancha.svg";
const RematchModal = ({
  isRematchModalOpen,
  setIsRematchModalOpen,
  acceptGameRequest,
  rejectGameRequest,
}) => {
  const navigate = useNavigate();
  return (
    <>
      <Transition appear show={isRematchModalOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setIsRematchModalOpen(true)}
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
                  <div className="p-2 flex flex-col items-center space-y-4">
                    <h1 className="text-white font-medium capitalize text-center">
                      You friend is request for rematch? You want to reMatch?
                    </h1>
        <div className="grid grid-cols-2 gap-3 w-full">

                    <button
                      className="w-full p-2 bg-sky-700 rounded-md cursor-pointer select-none
                   active:translate-y-2  active:[box-shadow:0_0px_0_0_#026ca4,0_0px_0_0_#026ca4]
                   active:border-b-[0px]
                   transition-all duration-150 [box-shadow:0_5px_0_0_#026ca4,0_5px_0_0_#026ca4]
                   border-b-[1px] border-gray-300/50 font-medium text-white
                 "
                      onClick={acceptGameRequest}
                    >
                      Accept
                    </button>
                    <button
                      className="w-full p-2 bg-orange-bg rounded-md cursor-pointer select-none
                  active:translate-y-2  active:[box-shadow:0_0px_0_0_#1b6ff8,0_0px_0_0_#1b70f841]
                  active:border-b-[0px]
                  transition-all duration-150 [box-shadow:0_5px_0_0_#c93b00,0_5px_0_0_#c93b00]
                  border-b-[1px] border-gray-300/50 font-medium text-white
                "
                      onClick={() => {
                        rejectGameRequest();
                        localStorage.clear();
                        navigate("/create-game");
                      }}
                    >
                      Reject
                    </button>
        </div>
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

export default RematchModal;
