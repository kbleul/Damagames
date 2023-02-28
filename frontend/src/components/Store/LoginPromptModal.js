

import React from 'react'
import { useNavigate } from 'react-router-dom';
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { MdOutlineCancel } from "react-icons/md";

const LoginPromptModal = ({ isShowModalOpen, set_isShowModalOpen }) => {

    const navigate = useNavigate()
    return (
        <>
            <Transition appear show={isShowModalOpen} as={Fragment}>
                <Dialog
                    as="div"
                    className="relative z-10"
                    onClose={() => set_isShowModalOpen(true)}
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
                                        className="text-md font-medium leading-6 text-white text-center"
                                    >
                                        You need to login to buy items.
                                    </Dialog.Title>

                                    <MdOutlineCancel onClick={() => set_isShowModalOpen(false)} className="absolute top-2 right-2 text-orange-color w-6 h-6" />

                                    <div className="mt-4 flex w-full items-center space-x-5 justify-center">
                                        <button
                                            type="button"
                                            className="rounded-md bg-orange-600 px-6  p-2
                   text-sm font-medium text-white hover:bg-orange-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                            onClick={() => navigate("/login")}
                                        >
                                            Login
                                        </button>

                                        <p className='text-sm text-white'>or</p>

                                        <button
                                            type="button"
                                            className="rounded-md bg-gray-300 px-6  p-2
                   text-sm font-medium text-black hover:bg-orange-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                            onClick={() => navigate("/signup")}
                                        >
                                            Signup
                                        </button>

                                    </div>

                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    )
}

export default LoginPromptModal