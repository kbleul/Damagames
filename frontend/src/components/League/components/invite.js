import React, { Component, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
// import { ThreeDots } from "react-loader-spinner";
// import { Localization } from "../../utils/language";
// import { useAuth } from "../../context/auth";

const DrawGameModal = ({
    isDrawModalOpen, setIsDrawModalOpen
}) => {

    return (
        <>
            <Transition appear show={isDrawModalOpen} as={Fragment}>
                <Dialog onClose={() => setIsDrawModalOpen(true)}
                    as="div"
                    className="relative z-10"

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
                                        <p>Hello</p>
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
