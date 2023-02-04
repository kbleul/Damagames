

import React from 'react'
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { useNavigate } from "react-router-dom";

const PrivatePolicyModal = ({
    isPrivacyModalOpen,
    set_isPrivateModalOpen
}) => {
    const navigate = useNavigate();

    const handleAccept = () => {
        navigate("/create-game");
    };
    return (
        <>
            <Transition appear show={isPrivacyModalOpen} as={Fragment}>
                <Dialog
                    as="div"
                    className="relative z-10"
                    onClose={() => set_isPrivateModalOpen(true)}
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
                                        By clicking accept you are agreeing to the privacy policy
                                    </Dialog.Title>
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-500 text-center ">
                                            Please read the full privacy policy before accepting.
                                        </p>
                                    </div>

                                    <div className="mt-4 flex w-full items-center space-x-5 justify-center">
                                        <button
                                            type="button"
                                            className="rounded-md   px-6  p-2 text-white
                         text-sm font-medium  bg-orange-600 hover:bg-orange-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                            onClick={handleAccept}
                                        >
                                            Accept
                                        </button>
                                        <button
                                            type="button"
                                            className=" rounded-md  px-6 p-2 bg-blue-100 text-black  text-sm font-medium hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                            onClick={() => set_isPrivateModalOpen(false)}
                                        >
                                            Keep Reading
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

export default PrivatePolicyModal