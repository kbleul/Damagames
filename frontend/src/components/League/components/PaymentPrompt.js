

import { Dialog, Transition } from "@headlessui/react";
import React, { Fragment, useState } from "react";
import { ImCancelCircle } from "react-icons/im"

import teleImg from "../../../assets/TeleNew.jpg"

const PaymentPrompt = ({ isPaymentPromptModalOpen, setIsPaymentPromptModalOpen, selectedMethod, setIsPaymentModalOpen }) => {
    return (
        <Transition appear show={isPaymentPromptModalOpen} as={Fragment}>
            <Dialog
                as="div"
                className="relative z-10"
                onClose={() => setIsPaymentPromptModalOpen(true)}
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
                                className="relative w-full max-w-md transform overflow-hidden 
  rounded-2xl bg-dark-bg p-6 text-left align-middle shadow-xl transition-all flex flex-col justify-center items-center border border-orange-color"
                            >

                                <ImCancelCircle
                                    onClick={() => {
                                        setIsPaymentPromptModalOpen(false)
                                        setIsPaymentModalOpen(true)
                                    }} className="w-6 h-6 absolute top-2 right-2 text-orange-600 cursor-pointer" />
                                <h2 className="text-orange-600 font-bold text-xl text-center w-full pt-6">Pay via telebirr</h2>
                                {selectedMethod && <p className="text-white py-2">{selectedMethod}</p>}
                                <div className=" w-full flex flex-col items-center ">

                                    <img className="w-2/5 h-12 rounded-full" src={teleImg} alt="" />
                                </div>

                                <button
                                    className="mt-4 w-[70%] bg-gradient-to-b from-orange-500 to-orange-700 rounded-full my-2 py-2 font-semibold text-black">Pay
                                </button>
                            </Dialog.Panel>

                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition >
    )
}

export default PaymentPrompt