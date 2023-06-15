import { Dialog, Transition } from "@headlessui/react";
import React, { Fragment, useState } from "react";
import { ImCancelCircle } from "react-icons/im"
// import BsCircleGrRadialSelected from "react-icons/bs-circle";

const PAYMENTOPTIONS = [
    {
        name: "Per league / 5 birr",
        amount: 5
    },
    {
        name: "Weekly / 15 birr",
        amount: 15
    },
    {
        name: "Monthly / 20 birr",
        amount: 20
    }
]

const PaymentOptions = ({ isPaymentModalOpen, setIsPaymentModalOpen, setIsPaymentPromptModalOpen, selectedMethod, setSelectedMethod }) => {


    return (
        <Transition appear show={isPaymentModalOpen} as={Fragment}>
            <Dialog
                as="div"
                className="relative z-10"
                onClose={() => setIsPaymentModalOpen(true)}
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
                                        setIsPaymentModalOpen(false)
                                        setSelectedMethod(null)
                                    }} className="w-6 h-6 absolute top-2 right-2 text-orange-600 cursor-pointer" />
                                <h2 className="text-orange-600 font-bold text-xl text-center w-full">Subscribe to join league</h2>

                                <div className=" w-full flex flex-col items-center ">
                                    {PAYMENTOPTIONS.map(payment => (
                                        <div key={payment.name} onClick={() => {
                                            selectedMethod !== payment.name && setSelectedMethod(payment.name)
                                        }} className="cursor-pointer flex text-white items-center gap-x-2 w-4/5 pl-[10%] py-1" >
                                            {selectedMethod && selectedMethod === payment.name &&
                                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-green-300 justify-self-start" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="2" d="M12 23c6.075 0 11-4.925 11-11S18.075 1 12 1S1 5.925 1 12s4.925 11 11 11Zm0-10a1 1 0 1 0 0-2a1 1 0 0 0 0 2Zm0 2a3 3 0 1 0 0-6a3 3 0 0 0 0 6Zm0 2a5 5 0 1 0 0-10a5 5 0 0 0 0 10Z" /></svg>
                                            }
                                            {(!selectedMethod || selectedMethod !== payment.name) &&
                                                < svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-green-300 justify-self-start" viewBox="0 0 24 24"><path fill="currentColor" d="M12 21a9 9 0 1 1 9-9a9 9 0 0 1-9 9Zm0-16.5a7.5 7.5 0 1 0 7.5 7.5A7.5 7.5 0 0 0 12 4.5Z" /></svg>
                                            }
                                            <p className="w-4/5 justify-self-start ">{payment.name}</p>
                                        </div>
                                    ))}
                                </div>

                                <button onClick={() => {
                                    if (selectedMethod) {
                                        setIsPaymentModalOpen(false);
                                        setIsPaymentPromptModalOpen(true)
                                    }
                                }}
                                    className={selectedMethod ?
                                        "w-[70%] bg-gradient-to-b from-orange-500 to-orange-700 rounded-full my-2 py-2 font-semibold text-black" :
                                        "opacity-80 w-[70%] bg-gradient-to-b from-orange-500 to-orange-700 rounded-full my-2 py-2 font-semibold text-black"}>Subscribe
                                </button>
                            </Dialog.Panel>

                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition >
    )
}

export default PaymentOptions