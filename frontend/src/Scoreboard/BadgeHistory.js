

import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { MdOutlineCancel } from "react-icons/md";
import { useAuth } from "../context/auth";

const BadgeHistory = ({
    isBadgeHistoryOpen, setIsBadgeHistoryOpen, badge
}) => {
    const { lang } = useAuth();
    const LANG = { "AMH": "amharic", "ENG": "english" }

    return (
        <>
            <Transition appear show={isBadgeHistoryOpen} as={Fragment}>
                <Dialog
                    as="div"
                    className="relative z-50"
                    onClose={() => setIsBadgeHistoryOpen(true)}
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
                                    {/* <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-white text-center"
                    >
                      {Localization["you are about to"][lang]}
                    </Dialog.Title> */}

                                    <MdOutlineCancel
                                        onClick={() => setIsBadgeHistoryOpen(false)}
                                        className='absolute top-2 right-2 text-orange-color w-6 h-6'
                                    />

                                    {<div className="mt-2 text-white flex flex-col w-full items-center justify-center">
                                        <div>
                                            <img className="w-24" src={badge?.url} alt="" />
                                        </div>
                                        <h3 className="font-mont fnt-bold text-xl text-gray-400 tracking-widest py-2">{badge?.name[LANG[lang]]}</h3>
                                        <p className="mt-2 text-sm text-white text-center ">
                                            {badge?.desc[LANG[lang]]}
                                        </p>
                                    </div>
                                    }

                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    );
};



export default BadgeHistory;