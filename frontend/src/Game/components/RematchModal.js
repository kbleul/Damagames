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
                  <div className="p-2 flex flex-col items-center space-y-2">
                    <h1 className="text-white font-medium capitalize text-center">
                      You friend is request for rematch? You want to reMatch?
                    </h1>

                    <button
                      className="w-[60%] justify-center rounded-md 
                    bg-orange-bg px-4 py-2 text-sm text-white font-medium
                    hover:opacity-80"
                      onClick={acceptGameRequest}
                    >
                      Accept
                    </button>
                    <button
                      className="w-[60%] justify-center rounded-md 
                    bg-orange-bg px-4 py-2 text-sm text-white font-medium
                    hover:opacity-80"
                      onClick={()=>{rejectGameRequest();localStorage.clear();navigate('/create-game')}}
                    >
                      Reject
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

export default RematchModal;
