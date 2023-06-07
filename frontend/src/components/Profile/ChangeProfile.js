import React, { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import Pic1 from "../../assets/pic1.jpg";
import Pic2 from "../../assets/pic2.png";
import Pic3 from "../../assets/pic3.png";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "../../context/auth";
import toast, { Toaster } from "react-hot-toast";
import { FaTimes } from "react-icons/fa";
import { BsFillPatchCheckFill } from "react-icons/bs";
import { AiFillStar } from "react-icons/ai";

import { useHome } from "../../context/HomeContext";
import { Localization } from "../../utils/language";
import { useNavigate } from "react-router-dom";

const ChangeProfile = ({ changeProfileModal, setChangeProfileModal }) => {
  const navigate = useNavigate();

  const { login, token, user, lang } = useAuth();
  const { setMessageType } = useHome();
  const [selected, setSelected] = useState(null);

  const [myAvatars, setMyAvatars] = useState([]);


  const [errorMessage, setErrorMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  const [pricePrompt, setPricePrompt] = useState(null);


  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
  };

  const profileMutation = useMutation(
    async (newData) =>
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}update-profile-image`,
        newData,
        {
          headers,
        }
      ),
    {
      retry: false,
    }
  );

  const profileMutationSubmitHandler = async (values) => {
    try {
      profileMutation.mutate(
        {
          profile_image: selectedImage,
        },
        {
          onSuccess: (responseData) => {
            login(token, responseData?.data?.data);
            setChangeProfileModal(false);
            setMessageType({
              type: "SUCCESS",
              message: Localization["profile changed successfully"][lang],
            });
          },
          onError: (err) => {
            setErrorMessage(err?.response?.data?.data);
          },
        }
      );
    } catch (err) { }
  };


  //for items that are bought from store
  const profileSelectMutation = useMutation(
    async (newData) =>
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}select-avatar/${selectedItem.id}`,
        newData,
        {
          headers,
        }
      ),
    {
      retry: false,
    }
  );

  const profileSelectSubmitHandler = async (values) => {
    try {
      profileSelectMutation.mutate(
        {},
        {
          onSuccess: (responseData) => {

            login(token, { ...user, profile_image: selectedItem.img });
            setChangeProfileModal(false);
            toast(Localization["profile changed successfully"][lang]);
          },
          onError: (err) => {
            setErrorMessage(err?.response?.data?.data);
          },
        }
      );
    } catch (err) { }
  };



  const images = [
    {
      value:
        "https://firebasestorage.googleapis.com/v0/b/beu-clone.appspot.com/o/pic1.jpg?alt=media&token=93b11d4c-e2b4-42ff-a7cb-778a23ee4178",
      img: Pic1,
    },
    {
      value:
        "https://firebasestorage.googleapis.com/v0/b/beu-clone.appspot.com/o/pic2.png?alt=media&token=07cb0eb6-5ff7-44ac-b803-cefae293d207",
      img: Pic2,
    },
    {
      value:
        "https://firebasestorage.googleapis.com/v0/b/beu-clone.appspot.com/o/pic3.png?alt=media&token=09ba47fb-2b28-4022-8de3-9cbf82c5f045",
      img: Pic3,
    },
  ];


  const myItemsFetch = useQuery(
    ["myItemsFetch"],
    async () =>
      await axios.get(`${process.env.REACT_APP_BACKEND_URL}my-items`, {
        headers,
      }),
    {
      keepPreviousData: true,
      refetchOnWindowFocus: false,
      retry: false,
      onSuccess: (res) => {
        setMyAvatars([])

        for (const [, value] of Object.entries(res.data.data.avatars)) {
          setMyAvatars(prev => [...prev, value])
        }
      },
      onError: err => {
        toast(err.message)
      }
    }
  );


  return (
    <>
      <Transition appear show={changeProfileModal} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setChangeProfileModal(true)}
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
                  className="border border-orange-500 bg-[#181920] w-full max-w-md transform overflow-hidden 
            rounded-2xl p-6 text-left align-middle shadow-xl transition-all"
                >
                  <div
                    onClick={() => {
                      setPricePrompt(null);
                      setSelectedImage(null);
                      setChangeProfileModal(false);
                      setSelected(null)
                      setSelectedItem([])
                      setErrorMessage("")
                    }}
                    className={`absolute right-3 top-2 text-orange-color cursor-pointer border-2 border-orange-color rounded-full`}
                  >
                    <FaTimes
                      size={20}
                    />
                  </div>
                  <div
                    className=" flex flex-col items-center justify-center
                  pt-5 w-full space-y-2"
                  >
                    {errorMessage && (
                      <div
                        class="w-full border-orange-color border
                        text-red-700 px-4 py-3 
            rounded relative"
                        role="alert"
                      >

                        <span class="block sm:inline">{errorMessage}</span>
                        <span class="absolute top-0 bottom-0 right-0 px-4 py-3">
                          <svg
                            onClick={() => setErrorMessage("")}
                            class="fill-current h-6 w-6 text-red-500"
                            role="button"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                          >
                            <title>{Localization["Close"][lang]}</title>
                            <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
                          </svg>
                        </span>
                      </div>
                    )}

                    <div className="flex flex-col items-center space-y-2 w-full">
                      <div className="grid grid-cols-3 gap-y-2 items-center space-x-3 just-fy-center">
                        {images.map((img, i) => (
                          <div
                            key={i}
                            className={i === 0 ? "pl-3 relative" : "relative"}
                            onClick={() => {
                              setSelected(i);
                              setSelectedImage(img.value);
                              setSelectedItem(null)
                            }}
                          >
                            {selected === i && (
                              <BsFillPatchCheckFill className="absolute bottom-2 right-2 text-orange-color" />
                            )}

                            {!selected && img.value === user.profile_image &&
                              <AiFillStar className="absolute bottom-2 right-2 text-orange-color" />
                            }
                            <img
                              src={img.img}
                              alt=""
                              className="h-20 w-20 object-cover"
                            />
                          </div>
                        ))}
                        {myAvatars.map((avatar, i) => (
                          <div
                            key={i + 3}
                            className="relative"
                            onClick={() => {
                              if (!avatar.price || parseInt(user.coin) >= avatar.price) {
                                setSelected(i + 3);
                                setSelectedItem({ id: avatar.id, img: avatar.item })
                                return
                              }

                            }}
                          >
                            {selected === i + 3 && (
                              <BsFillPatchCheckFill className="absolute bottom-2 right-2 text-orange-color" />
                            )}

                            {!selected && avatar.item === user.profile_image &&
                              <AiFillStar className="absolute bottom-2 right-2 text-orange-color" />
                            }

                            <img
                              src={avatar.item}
                              alt=""
                              className={avatar.price ? "h-20 w-20 object-cover opacity-4 0" : "h-20 w-20 object-cover"}
                            />

                          </div>
                        ))}

                      </div>
                      <div className="flex flex-col gap-4 w-full">
                        {selected !== null && (<>
                          <button
                            disabled={profileSelectMutation.isLoading}
                            onClick={selected < 3 ? profileMutationSubmitHandler : profileSelectSubmitHandler}
                            className="relative w-full p-2 bg-orange-bg rounded-md cursor-pointer select-none
                                active:translate-y-2  active:[box-shadow:0_0px_0_0_#1b6ff8,0_0px_0_0_#1b70f841]
                                active:border-b-[0px] flex items-center justify-center
                                transition-all duration-150 [box-shadow:0_5px_0_0_#c93b00,0_5px_0_0_#c93b00]
                                border-b-[1px] border-gray-400/50 font-semibold text-white"
                          >
                            <div className='absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-md' />

                            {profileSelectMutation.isLoading ?
                              Localization["Loading"][lang]
                              : Localization["Update"][lang]}
                          </button>

                          {selectedItem && selectedItem.id && <button
                            onClick={() => {
                              navigate(`/avatar-history/${selectedItem.id}`)
                            }}
                            className='relative w-full p-2 bg-orange-bg rounded-md cursor-pointer select-none
                                active:translate-y-2  active:[box-shadow:0_0px_0_0_#1b6ff8,0_0px_0_0_#1b70f841]
                                active:border-b-[0px] flex items-center justify-center
                                transition-all duration-150 [box-shadow:0_5px_0_0_#c93b00,0_5px_0_0_#c93b00]
                                border-b-[1px] border-gray-400/50 font-semibold text-white
                                '>
                            <div className='absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-md' />
                            {Localization["View History"][lang]}
                          </button>}
                        </>
                        )}

                      </div>

                    </div>

                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog >
      </Transition >
      <Toaster />
    </>
  );
};

export default ChangeProfile;
