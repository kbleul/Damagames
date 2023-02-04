import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { useNavigate } from "react-router-dom";
import socket from "../../utils/socket.io";
import { clearCookie } from "../../utils/data";

export default function UserLeavesModal({
  isLeaveModalOpen,
  setIsLeaveModalOpen,
}) {
  const navigate = useNavigate();

  const handleExit = () => {
    clearCookie.forEach((data) => {
      localStorage.getItem(data) && localStorage.removeItem(data);
    });

    navigate("/create-game");
  };
  return (
    <>
      <Transition appear show={isLeaveModalOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setIsLeaveModalOpen(true)}
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
                    Your friend has left out the game !
                  </Dialog.Title>
                  <div className="mt-2 flex flex-col items-center space-y-3">
                    <p className="text-sm text-gray-500 text-center ">
                      You can't continue playing the game!
                    </p>

                  <button
                    type="button"
                    className="rounded-md  p-2 w-full text-white font-medium bg-orange-bg"
                    onClick={handleExit}
                    >
                    Leave
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