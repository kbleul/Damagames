import React from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { FaCoins } from "react-icons/fa";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "../../context/auth";
import { MdOutlineCancel } from "react-icons/md";
import Tele from '../../assets/TeleNew.jpg'
const CoinModal = ({ isCoinModalOpen, setIsCoinModalOpen }) => {
  const { user, token, setUser } = useAuth();
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
  };
  const [selectedCoin, setSelectedCoin] = useState(null);
  const coinData = [
    {
      id: 1,
      coinAmount: 1000,
      amountMoney: 10,
    },
    {
      id: 2,
      coinAmount: 1500,
      amountMoney: 15,
    },
    {
      id: 3,
      coinAmount: 2500,
      amountMoney: 20,
    },
    {
      id: 4,
      coinAmount: 5000,
      amountMoney: 40,
    },
    {
      id: 5,
      coinAmount: 10000,
      amountMoney: 75,
    },
    {
      id: 6,
      coinAmount: 15000,
      amountMoney: 100,
    },
  ];

  //post api for payment
  const paymentMutation = useMutation(
    async (newData) =>
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}telebirr/pay`,
        newData,
        {
          headers,
        }
      ),
    {
      retry: false,
    }
  );

  const paymentMutationSubmitHandler = async (values) => {
    try {
      paymentMutation.mutate(
        {
          price: selectedCoin.amountMoney,
          coin: selectedCoin.coinAmount
        },
        {
          onSuccess: (responseData) => {
            // user &&
            // 				localStorage.setItem(
            // 					"dama_user_data",
            // 					JSON.stringify({
            // 						token,
            // 						user: {
            // 							...user,
            // 							coin: parseInt(user.coin) + parseInt(selectedCoin.amountMoney),
            // 							current_point: parseInt(user.coin) + parseInt(selectedCoin.amountMoney)
            // 						},
            // 					})
            // 				);

            // 			user &&
            // 				setUser({
            // 					...user,
            // 					coin: parseInt(user.coin) + parseInt(selectedCoin.amountMoney),
            // 					current_point: parseInt(user.coin) + parseInt(selectedCoin.amountMoney)
            // 				});
            window.open(responseData?.data?.data?.data?.toPayUrl, "_self");
          },
          onError: (err) => { },
        }
      );
    } catch (err) { }
  };
  return (
    <>
      <Transition appear show={isCoinModalOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setIsCoinModalOpen(true)}
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
              rounded-2xl bg-[#181920] p-6 text-left align-middle shadow-xl transition-all"
                >
                  {!selectedCoin && (
                    <Dialog.Title
                      as="h3"
                      className="capitalize text-lg font-medium leading-6 text-white text-center"
                    >
                      select coin
                    </Dialog.Title>
                  )}
                  {selectedCoin && (
                    <button
                      onClick={() => setSelectedCoin(null)}
                      className="z-10 top-2 bg-orange-color rounded-full w-6 h-6 flex justify-center items-center mr-2  fixed left-2 md:left-4"
                    >
                      <svg
                        width="18"
                        height="14"
                        viewBox="0 0 18 14"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M0.396166 0.973833C0.500244 0.722555 0.676505 0.507786 0.902656 0.356693C1.12881 0.205599 1.39469 0.124969 1.66667 0.125H10.8333C12.6567 
                    0.125 14.4054 0.849328 15.6947 2.13864C16.984 3.42795 17.7083 5.17664 17.7083 7C17.7083 8.82336 16.984 10.572 15.6947 11.8614C14.4054 13.1507
                     12.6567 13.875 10.8333 13.875H2.58333C2.21866 13.875 1.86892 13.7301 1.61106 13.4723C1.3532 13.2144 1.20833 12.8647 1.20833 12.5C1.20833 12.1353
                      1.3532 11.7856 1.61106 11.5277C1.86892 11.2699 2.21866 11.125 2.58333 11.125H10.8333C11.9274 11.125 12.9766 10.6904 13.7501 9.91682C14.5237 9.14323 
                      14.9583 8.09402 14.9583 7C14.9583 5.90598 14.5237 4.85677 13.7501 4.08318C12.9766 3.3096 11.9274 2.875 10.8333 2.875H4.98592L5.84758 3.73667C6.09793 
                      3.99611 6.23636 4.34351 6.23306 4.70403C6.22976 5.06455 6.08499 5.40935 5.82993 5.66417C5.57487 5.91898 5.22994 6.06343 4.86941 6.06639C4.50889 6.06935 
                      4.16163 5.93059 3.90242 5.68L0.694083 2.47167C0.501936 2.27941 0.371084 2.03451 0.318058 1.76791C0.265033 1.50132 0.292214 1.22499 0.396166 0.973833Z"
                          fill="#191921"
                        />
                      </svg>
                    </button>
                  )}
                  <MdOutlineCancel
                    onClick={() => { setIsCoinModalOpen(false); setSelectedCoin(null) }}
                    className="absolute top-2 right-2 text-orange-color w-6 h-6"
                  />
                  {!selectedCoin ? (
                    <div className="mt-2 flex flex-col space-y-3 ">
                      {coinData.map((coin) => (
                        <div
                          onClick={() => setSelectedCoin(coin)}
                          className="flex items-center justify-between hover:scale-[1.03] transition-all duration-500"
                        >
                          <div className="flex items-start  flex-col space-y-2">
                            <div className="flex items-center space-x-3  text-white">
                              <FaCoins
                                size={30}
                                className="text-orange-color"
                              />
                              <div className="flex flex-col items-items space-y-1  text-white">
                                <p>{coin.coinAmount} coins</p>
                                <p className="font-medium text-white">
                                  {coin.amountMoney} birr
                                </p>
                              </div>
                            </div>
                          </div>
                          <button
                            className="relative w-fit px-10 p-2 bg-orange-bg rounded-md cursor-pointer select-none
                       active:translate-y-2  active:[box-shadow:0_0px_0_0_#1b6ff8,0_0px_0_0_#1b70f841]
                       active:border-b-[0px] flex items-center justify-center
                       transition-all duration-150 [box-shadow:0_5px_0_0_#c93b00,0_5px_0_0_#c93b00]
                       border-b-[1px] border-gray-400/50 font-semibold text-white
                       "
                          >
                            Buy
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center space-y-2 mt-4">
                      <div className="flex items-center space-x-2">
                        {/* <h3 className="text-white font-medium capitalize">
                          selected coin
                        </h3> */}
                        <h3 className="text-white font-medium capitalize">
                          <span className="text-orange-color text-3xl font-semibold">{selectedCoin?.coinAmount}</span> coins
                        </h3>
                      </div>
                      <div className="flex items-center space-x-2">
                        <h3 className="text-white font-medium capitalize">
                          Amount
                        </h3>
                        <h3 className="text-white font-medium capitalize">
                          {selectedCoin?.amountMoney} birr

                        </h3>
                      </div>
                      <button
                        onClick={paymentMutationSubmitHandler}
                        disabled={paymentMutation.isLoading}
                        className="relative w-fit px-10 p-2 bg-white rounded-md cursor-pointer select-none
                       active:translate-y-2  active:[box-shadow:0_0px_0_0_#f1f1f1,0_0px_0_0_#f1f1f1]
                       active:border-b-[0px] flex items-center justify-center
                       transition-all duration-150 [box-shadow:0_5px_0_0_#f1f1f1,0_5px_0_0_#f1f1f1]
                       border-b-[1px] border-gray-400/50 font-semibold text-gray-900
                       "
                      >
                        {paymentMutation.isLoading
                          ? "please wait..."
                          : <div className="flex items-center space-x-2"><span>Pay with</span>   <img src={Tele} alt="" className="h-8" /></div>}
                      </button>
                    </div>
                  )}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default CoinModal;
