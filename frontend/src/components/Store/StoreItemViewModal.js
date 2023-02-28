
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { useAuth } from "../../context/auth";
import toast, { Toaster } from "react-hot-toast";
import { MdOutlineCancel } from "react-icons/md";
import { useNavigate } from "react-router-dom";


import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const StoreItemView = ({ isShowModalOpen, set_isShowModalOpen, item }) => {
    const { user, token } = useAuth();
    const [errorMessage, setErrorMessage] = useState(null)
    const navigate = useNavigate();
    const [showPurchasedItemModal, setShowPurchasedItemModal] = useState(false)


    const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
    };

    const purchaseMutation = useMutation(
        async (newData) =>
            await axios.post(
                `${process.env.REACT_APP_BACKEND_URL}purchase-item`,
                newData,
                {
                    headers,
                }
            ),
        {
            retry: false,
        }
    );

    const purchaseMutationSubmitHandler = async (values) => {
        try {
            purchaseMutation.mutate(
                {
                    item_id: item.id,
                },
                {
                    onSuccess: (responseData) => {
                        console.log(responseData)
                        set_isShowModalOpen(false)
                        setShowPurchasedItemModal(true)
                    },
                    onError: (err) => {
                        set_isShowModalOpen(false)
                        toast.error(err?.response?.data?.data, {
                            style: {
                                border: '1px solid #713200',
                                padding: '16px',
                                color: 'white',
                                fontWeight: "bold",
                                backgroundColor: 'black'
                            },
                            iconTheme: {
                                primary: '#713200',
                                secondary: '#FFFAEE',
                            },
                        });
                    },
                }
            );
        } catch (err) {
            console.log(err.response?.data?.data.data)

        }
    };

    // useEffect(() => {
    //     showPurchasedItemModal && setTimeout(3000, () => setShowPurchasedItemModal(false))
    // }, [showPurchasedItemModal])

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

                                    <MdOutlineCancel onClick={() => set_isShowModalOpen(false)} className="absolute top-2 right-2 text-orange-color w-6 h-6" />
                                    {item && <>
                                        <Dialog.Title
                                            as="h3"
                                            className="text-lg font-medium leading-6 text-white text-center"
                                        >  {item.name} </Dialog.Title>
                                        <section className="mt-2">
                                            {/* <div className="flex flex-col items-center justify-center">
                                                <img src={item.value ? item.value : item.img} alt="" />
                                                <h2 className="text-white text-center capitalize text-sm mb-4">{item.name}</h2>
                                            </div> */}
                                            <section className="w-4/5 ml-[10%] text-xs font-light ">
                                                <div className="text-white  flex justify-around items-center py-4">
                                                    <p className="text-5xl text-right mr-2 w-3/5 font-bold ">{item.price}</p>
                                                    <p className="text-6xl ml-2 justify-self-start  w-1/2">
                                                        <svg width="45" height="45" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <g clip-path="url(#clip0_176_1143)">
                                                                <path d="M21.6 29C21.6 28.7348 21.4946 28.4804 21.3071 28.2929C21.1196 28.1054 20.8652 28 20.6 28H14.6C14.3348 28 14.0804 28.1054 13.8929 28.2929C13.7054 28.4804 13.6 28.7348 13.6 29C13.6 29.2652 13.7054 29.5196 13.8929 29.7071C14.0804 29.8946 14.3348 30 14.6 30H20.6C20.8652 30 21.1196 29.8946 21.3071 29.7071C21.4946 29.5196 21.6 29.2652 21.6 29Z" fill="white" />
                                                                <path d="M22.54 24H16.54C16.2748 24 16.0204 24.1054 15.8329 24.2929C15.6454 24.4804 15.54 24.7348 15.54 25C15.54 25.2652 15.6454 25.5196 15.8329 25.7071C16.0204 25.8946 16.2748 26 16.54 26H22.54C22.8052 26 23.0596 25.8946 23.2471 25.7071C23.4347 25.5196 23.54 25.2652 23.54 25C23.54 24.7348 23.4347 24.4804 23.2471 24.2929C23.0596 24.1054 22.8052 24 22.54 24Z" fill="white" />
                                                                <path d="M22 32H16C15.7348 32 15.4804 32.1054 15.2929 32.2929C15.1054 32.4804 15 32.7348 15 33C15 33.2652 15.1054 33.5196 15.2929 33.7071C15.4804 33.8946 15.7348 34 16 34H22C22.2652 34 22.5196 33.8946 22.7071 33.7071C22.8946 33.5196 23 33.2652 23 33C23 32.7348 22.8946 32.4804 22.7071 32.2929C22.5196 32.1054 22.2652 32 22 32Z" fill="white" />
                                                                <path d="M32.7 32H25.7C25.4348 32 25.1804 32.1054 24.9929 32.2929C24.8054 32.4804 24.7 32.7348 24.7 33C24.7 33.2652 24.8054 33.5196 24.9929 33.7071C25.1804 33.8946 25.4348 34 25.7 34H32.7C32.9652 34 33.2196 33.8946 33.4071 33.7071C33.5947 33.5196 33.7 33.2652 33.7 33C33.7 32.7348 33.5947 32.4804 33.4071 32.2929C33.2196 32.1054 32.9652 32 32.7 32Z" fill="white" />
                                                                <path d="M33.7 28H26.7C26.4348 28 26.1804 28.1054 25.9929 28.2929C25.8054 28.4804 25.7 28.7348 25.7 29C25.7 29.2652 25.8054 29.5196 25.9929 29.7071C26.1804 29.8946 26.4348 30 26.7 30H33.7C33.9652 30 34.2196 29.8946 34.4071 29.7071C34.5947 29.5196 34.7 29.2652 34.7 29C34.7 28.7348 34.5947 28.4804 34.4071 28.2929C34.2196 28.1054 33.9652 28 33.7 28Z" fill="white" />
                                                                <path d="M33.74 26C33.4469 22.479 32.4901 19.0452 30.92 15.88C29.416 13.0197 27.2489 10.5612 24.6 8.71L27 3.42C27.0774 3.2619 27.1117 3.08618 27.0994 2.9106C27.0871 2.73501 27.0287 2.56578 26.93 2.42C26.839 2.29212 26.7191 2.18746 26.5802 2.1145C26.4412 2.04153 26.287 2.00231 26.13 2H9.80001C9.6319 1.99959 9.4664 2.04156 9.31881 2.12204C9.17122 2.20251 9.04629 2.3189 8.95559 2.46044C8.86488 2.60198 8.81132 2.7641 8.79986 2.93182C8.7884 3.09954 8.81941 3.26744 8.89001 3.42L11.34 8.73C8.71049 10.5829 6.5582 13.0334 5.06001 15.88C2.91001 19.88 2.24001 24.77 2.06001 28.16C2.03054 28.6563 2.10418 29.1533 2.27628 29.6197C2.44839 30.0861 2.71524 30.5118 3.06001 30.87C3.42237 31.222 3.85143 31.4979 4.32197 31.6817C4.79251 31.8654 5.29504 31.9533 5.80001 31.94H12V30H5.72001C5.4937 29.9993 5.26986 29.9529 5.06193 29.8635C4.85401 29.7742 4.66628 29.6437 4.51001 29.48C4.35352 29.3176 4.23266 29.1243 4.15517 28.9125C4.07768 28.7007 4.04527 28.4751 4.06001 28.25C4.20001 25.64 4.75001 20.67 6.82001 16.8C8.27924 14.0271 10.437 11.6832 13.08 10H14.08C13.4024 10.9375 12.778 11.9123 12.21 12.92C11.6315 13.9922 11.1399 15.1092 10.74 16.26L12.11 17.18C12.5148 15.986 13.013 14.8257 13.6 13.71C14.3209 12.4127 15.1399 11.1724 16.05 10H17.05C17.7208 11.6034 18.1943 13.2824 18.46 15C18.6772 16.2751 18.7843 17.5665 18.78 18.86L20.36 17.75C20.316 16.7443 20.2091 15.7424 20.04 14.75C19.7717 13.1282 19.3429 11.537 18.76 10H19.54L20.45 8H13.21L11.36 4H24.57L22.07 9.47C22.4986 9.69954 22.9097 9.96024 23.3 10.25C25.7502 11.9404 27.7596 14.1933 29.16 16.82C30.5627 19.7002 31.4333 22.8102 31.73 26H33.74Z" fill="white" />
                                                            </g>
                                                            <defs>
                                                                <clipPath id="clip0_176_1143">
                                                                    <rect width="36" height="36" fill="white" />
                                                                </clipPath>
                                                            </defs>
                                                        </svg>
                                                    </p>
                                                </div>

                                            </section>

                                        </section>

                                        <div className="mt-4 flex w-full items-center space-x-5 justify-center text-white">


                                            {parseInt(user.coin) >= item.price ?
                                                <button
                                                    type="button"
                                                    className="rounded-md bg-orange-600 px-6  p-2
                           text-sm font-medium text-white hover:bg-orange-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                                    onClick={purchaseMutationSubmitHandler}
                                                >
                                                    Buy Now
                                                </button>
                                                : <div>
                                                    <p>You don't have sufficient coins. Play more games to purchase this item.</p>

                                                    <div className="w-full flex justify-center mt-4">
                                                        <button type="button"
                                                            className="rounded-md bg-orange-600 px-6  p-2
                           text-sm font-medium text-white hover:bg-orange-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                                            onClick={() => navigate("/create-game")}>Play Game</button>
                                                    </div>

                                                </div>}
                                        </div></>
                                    }
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
            <Toaster />

            {item && <PurchasedNotifyModal
                showPurchasedItemModal={showPurchasedItemModal}
                setShowPurchasedItemModal={setShowPurchasedItemModal}
                name={item.name}
                type={item.type}
            />}
        </>
    );
}


const PurchasedNotifyModal = ({ showPurchasedItemModal, setShowPurchasedItemModal, name, type }) => {


    return (
        <>
            <Transition appear show={showPurchasedItemModal} as={Fragment}>
                <Dialog
                    as="div"
                    className="relative z-10"
                    onClose={() => setShowPurchasedItemModal(true)}
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

                                    <MdOutlineCancel onClick={() => setShowPurchasedItemModal(false)} className="absolute top-2 right-2 text-orange-color w-6 h-6" />


                                    <Dialog.Title
                                        as="h3"
                                        className="text-sm font-medium leading-6 text-white text-center"
                                    >  Purchased <span className="text-orange-color">{name} {type}</span> sucessfully !
                                    </Dialog.Title>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
            <Toaster />

        </>
    );
}

export default StoreItemView