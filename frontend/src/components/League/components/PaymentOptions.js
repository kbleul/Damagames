import { Dialog, Transition } from "@headlessui/react";
import React, { useState, Fragment } from "react";
import { ImCancelCircle } from "react-icons/im"
import { useAuth } from "../../../context/auth";

import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import socket from "../../../utils/socket.io";
import { Localization } from "../../../utils/language";


const PaymentOptions = ({
    isPaymentModalOpen,
    setIsPaymentModalOpen,
    selectedMethod,
    setSelectedMethod,
    seasons,
    isCoinModalOpen,
    setIsCoinModalOpen
}) => {
    const { user, token, login, lang } = useAuth()

    const activeSeason = seasons.find(season => season.is_active === true)


    const [loading, setLoading] = useState(false)
    const [err, setErr] = useState(null)


    const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
    };

    const joinSeasonMutation = useMutation(
        async (newData) =>
            await axios.post(
                `${process.env.REACT_APP_BACKEND_URL}join-season`,
                newData,
                {
                    headers,
                }
            ),
        {
            retry: false,
        }
    );

    const joinSeasonSubmitHandler = async (values) => {
        try {

            joinSeasonMutation.mutate(
                {
                    season_id: activeSeason.id,
                    user_id: user.id,
                },
                {
                    onSuccess: (responseData) => {

                        const { id: userId, username, profile_image, game_point, default_board, default_crown } = user

                        localStorage.setItem("setIsReloading", true)
                        console.log(user.seasons)
                        let newSeason = user.seasons ?
                            [...user.seasons, activeSeason] : [activeSeason]

                        login(token, {
                            ...user,
                            coin: parseInt(user.coin) - parseInt(activeSeason.season_price),
                            current_point: parseInt(user.coin) - parseInt(activeSeason.season_price),
                            seasons: [...newSeason]
                        })

                        socket.emit("checkInLeague", {
                            seasonId: activeSeason.id,
                            userData: { id: userId, username, profile_image, game_point, default_board, default_crown }
                        });

                        localStorage.setItem("dama-user-seasons",
                            JSON.stringify(
                                [...newSeason]
                            ))
                        console.log("yess", [...newSeason])

                        // setChanged((prev) => ++prev);
                        setIsPaymentModalOpen(false);
                        setLoading(false)
                        setErr(null)
                    },
                    onError: (err) => {
                        setLoading(false)
                        setErr(err?.response?.data?.data)
                    },
                }
            );
        } catch (err) { console.log(err); }
    };



    return (<>{user &&
        <Transition appear show={isPaymentModalOpen} as={Fragment}>
            {err ?
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
                                    <h2 className="text-orange-600 font-bold text-sm text-center w-full">{Localization["You already subscribed to this season."][lang]}</h2>

                                </Dialog.Panel>

                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>

                :
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
                                    <h2 className="text-orange-600 font-bold text-xl text-center w-full">{Localization["Subscribe to join league"][lang]}</h2>

                                    <div className=" w-full flex flex-col items-center text-white text-sm gap-y-4 py-4">
                                        <p>{Localization["Your coins"][lang]} - {user.coin}{Localization["coins"][lang]}</p>
                                        <p>{Localization["Season Price"][lang]} - {activeSeason?.season_price} {Localization["coins"][lang]}</p>
                                    </div>




                                    {parseInt(user.coin) >= parseInt(activeSeason?.season_price) ?
                                        <button onClick={() => {
                                            setLoading(true)
                                            joinSeasonSubmitHandler()
                                        }}
                                            className={selectedMethod ?
                                                "w-[70%] bg-gradient-to-b from-orange-500 to-orange-700 rounded-full my-2 py-2 font-semibold text-black" :
                                                "opacity-80 w-[70%] bg-gradient-to-b from-orange-500 to-orange-700 rounded-full my-2 py-2 font-semibold text-black"}>
                                            {Localization["Subscribe"][lang]}
                                        </button>
                                        :
                                        <div className="w-full flex flex-col items-center justify-center mt-6">

                                            <p className="text-white">{Localization["You don't have sufficient coins"][lang]}</p>
                                            <button onClick={() => {
                                                setIsPaymentModalOpen(false);
                                                setIsCoinModalOpen(true)

                                            }}
                                                className={selectedMethod ?
                                                    "w-[70%] bg-gradient-to-b from-orange-500 to-orange-700 rounded-full my-2 py-2 font-semibold text-black" :
                                                    "opacity-80 w-[70%] bg-gradient-to-b from-orange-500 to-orange-700 rounded-full my-2 py-2 font-semibold text-black"}>
                                                {Localization["Buy Coins"][lang]}
                                            </button>
                                        </div>
                                    }
                                </Dialog.Panel>

                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>}
        </Transition >
    }
    </>
    )
}

export default PaymentOptions