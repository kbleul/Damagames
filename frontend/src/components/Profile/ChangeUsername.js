import React, { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "../../context/auth";
import toast, { Toaster } from "react-hot-toast";
import { FaTimes } from "react-icons/fa";
import { AiFillCheckCircle } from "react-icons/ai";
import { Localization } from "../../utils/language";


const ChangeProfile = ({ changeUsernameModal, setChangeUsernameModal, username }) => {
  const { login, token, user, lang } = useAuth();

  const [uname, setUname] = useState(username);
  const [errorMessage, setErrorMessage] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState(null)


  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
  };

  const onSubmit = () => {
    setErrorMessage(null)
    if (uname.length < 2) { setErrorMessage(Localization["Username is too short !"][lang]) }
    else if (uname === username) { setChangeUsernameModal(false) }
    else {
      setIsLoading(true)
      registerMutationSubmitHandler()
    }
  }

  const registerMutation = useMutation(
    async (newData) =>
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}update-username`,
        newData,
        {
          headers,
        }
      ),
    {
      retry: false,
    }
  );

  const registerMutationSubmitHandler = async (values) => {
    try {
      registerMutation.mutate(
        {
          username: uname
        },
        {
          onSuccess: (responseData) => {
            setIsLoading(false)

            setSuccessMessage(Localization["Username changed."][lang])

            setTimeout(() => {
              login(token, { ...user, username: responseData?.data?.data?.user?.username });
            }, 800)

          },
          onError: (err) => {
            setErrorMessage(err?.response?.data?.data);
          },
        }
      );
    } catch (err) { }
  };

  return (
    <>
      <Transition appear show={changeUsernameModal} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setChangeUsernameModal(true)}
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
            rounded-2xl bg-dark-bg p-6 text-left align-middle shadow-xl transition-all"
                >

                  <div
                    onClick={() => setChangeUsernameModal(false)}
                    className={`text-orange-color absolute rounded-full border-2 border-orange-color right-3 top-2 cursor-pointer`}
                  >
                    <FaTimes
                      size={20}
                    />
                  </div>
                  <article className="flex flex-col items-center justify-center mt-8 text-white">
                    <h2 className=" mb-4 w-[80%] text-left">
                      {Localization["Username"][lang]}
                    </h2>
                    <input className="w-[90%] bg-inherit border md:border-2 focus:border-red-500 focus:outline-none focus:ring-0 border-gray-500 text-white py-2 px-4 rounded-lg" value={uname} onChange={e => setUname(e.target.value)} />
                    {errorMessage && <p className="w-[90%] text-red-400 p-4 text-xs">{errorMessage}</p>}
                    {successMessage && <div className='text-white flex items-center justify-center pt-2'>
                      <p>{successMessage}</p>
                      <AiFillCheckCircle size={20} className="text-green-300" />
                    </div>}
                    <button onClick={onSubmit} className="mt-8 w-[90%] border border-orange-color rounded-lg text-white bg-orange-color text-sm py-2">{isLoading ?
                      <>{Localization["Loading"][lang]}</>
                      : <>{Localization["Change Username"][lang]}</>
                    }</button>
                  </article>
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
