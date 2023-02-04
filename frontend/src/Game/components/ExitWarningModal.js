import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { useNavigate } from "react-router-dom";
import socket from "../../utils/socket.io";
import { clearCookie } from "../../utils/data";

export default function ExitWarningModal({
  isExitModalOpen,
  set_isExitModalOpen,
  gameState,
}) {
  const navigate = useNavigate();

  const handleExit = () => {
    //exit socket code here
    if (gameState?.players > 1) {
      socket.emit("sendExitGameRequest", { status: "Exit" });
    }
    clearCookie.forEach((data) => {
      localStorage.getItem(data) && localStorage.removeItem(data);
    });

    navigate("/create-game");
  };
  return (
    <>
      <Transition appear show={isExitModalOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
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
                    You are about to leave this game !
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500 text-center ">
                      Are you sure you want to leave and lose this game ?
                    </p>
                  </div>

                  <div className="mt-4 flex w-full items-center space-x-5 justify-center">
                    <button
                      type="button"
                      className="rounded-md  bg-blue-100 px-6  p-2
                       text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={handleExit}
                    >
                      Yes
                    </button>
                    <button
                      type="button"
                      className=" rounded-md  px-6 p-2 bg-orange-600 text-white text-sm font-medium hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={() => set_isExitModalOpen(false)}
                    >
                      No
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
