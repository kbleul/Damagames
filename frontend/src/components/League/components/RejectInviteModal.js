



import { Dialog, Transition } from "@headlessui/react";
import React, { Fragment } from "react";
import { ImCancelCircle } from "react-icons/im"


const RejectInviteModal = ({ rejectedInviteData, setRejectedInviteData }) => {
    return (
        <Transition appear show={rejectedInviteData ? true : false} as={Fragment}>
            <Dialog
                as="div"
                className="relative z-10"
                onClose={() => setRejectedInviteData(null)}
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
                                        setRejectedInviteData(null)
                                    }} className="w-6 h-6 absolute top-2 right-2 text-orange-600 cursor-pointer" />
                                <h2 className="text-orange-600 font-bold  text-center w-full pt-6">{rejectedInviteData?.messageHeading}</h2>
                                <div className=" w-full flex flex-col items-center text-white">

                                    <p className="text-sm">{rejectedInviteData?.messagePara}</p>
                                </div>

                                <button onClick={() => setRejectedInviteData(null)}
                                    className="mt-8 w-2/5 max-w-[200px] bg-gradient-to-b from-orange-500 to-orange-700 rounded-full my-2 py-2 font-semibold text-black">Ok
                                </button>
                            </Dialog.Panel>

                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition >
    )
}

export default RejectInviteModal