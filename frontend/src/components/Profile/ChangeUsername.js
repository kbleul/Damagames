import React, { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "../../context/auth";
import toast, { Toaster } from "react-hot-toast";
import { FaTimes } from "react-icons/fa";


const SHOWiTEM = { "AVATAR": "avatar", "BOARD": "board", "CROWN": "crown" }
const ChangeProfile = ({ changeUsernameModal, setChangeUsernameModal, username }) => {
  const { login, token, user, setUser } = useAuth();

  const [uname, setUname] = useState(username);
  const [errorMessage, setErrorMessage] = useState(null)
  const [isLoading, setIsLoading] = useState(false)


  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
  };

  const onSubmit = () => {
    setErrorMessage(null)
    if (uname.length < 2) { setErrorMessage("Username is too short !") }
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
            setChangeUsernameModal(false);
            console.log(responseData?.data?.data?.user)

            localStorage.setItem(
              "dama_user_data",
              JSON.stringify({
                token,
                user: {
                  ...user,
                  username: responseData?.data?.data?.user?.username
                },
              })
            );
            setUser({ ...user, username: responseData?.data?.data?.user?.username })
            toast(responseData?.data?.message);
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
                  className="w-full max-w-md transform overflow-hidden 
            rounded-2xl bg-dark-bg p-6 text-left align-middle shadow-xl transition-all"
                >

                  <div
                    onClick={() => setChangeUsernameModal(false)}
                    className={`absolute right-3 top-2 border-2 rounded-md  p-1 cursor-pointer`}
                  >
                    <FaTimes
                      size={15}
                      style={{
                        color: "#fff",
                      }}
                    />
                  </div>
                  <article className="flex flex-col items-center justify-center mt-8 text-white">
                    <h2 className=" mb-4 w-[80%] text-left">Username</h2>
                    <input className="w-[90%] bg-inherit border md:border-2 focus:border-red-500 focus:outline-none focus:ring-0 border-gray-500 text-white py-2 px-4 rounded-lg" value={uname} onChange={e => setUname(e.target.value)} />
                    {errorMessage && <p className="w-[90%] text-red-400 p-4 text-xs">{errorMessage}</p>}
                    <button onClick={onSubmit} className="mt-8 w-[90%] border border-orange-color rounded-lg text-white bg-orange-color text-sm py-2">{isLoading ? "Loading..." : "Change Username"}</button>
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
