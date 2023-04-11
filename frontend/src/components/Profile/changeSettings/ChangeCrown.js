import React, { Fragment, useState } from "react";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { Dialog, Transition } from "@headlessui/react";

import { useAuth } from "../../../context/auth";

import { FaTimes } from "react-icons/fa";
import { AiFillCheckCircle } from "react-icons/ai";
import { Localization } from "../../../utils/language";

const ChangeCrown = ({
  crown,
  showChangeCrownModal,
  setShowChangeCrownModal,
}) => {
  const { login, token, user, lang } = useAuth();
  const [successMessage, setSuccessMessage] = useState(null);

  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
  };

  //for items that are bought from store
  const crownSelectMutation = useMutation(
    async (newData) =>
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}select-crown/${crown?.id}`,
        newData,
        {
          headers,
        }
      ),
    {
      retry: false,
    }
  );

  const crownSelectSubmitHandler = async (values) => {
    try {
      crownSelectMutation.mutate(
        {},
        {
          onSuccess: (responseData) => {
            if (localStorage.getItem("lang")) {
              if (localStorage.getItem("lang") === "Amh") {
                setSuccessMessage(Localization["Crown changed."]?.Amh)
              } else {
                setSuccessMessage("Crown changed.")
              }
            } else {
              setSuccessMessage("Crown changed.")
            }
            setTimeout(() => {
              login(token, { ...user, default_crown: crown });
            }, 800);
          },
          onError: (err) => {
            //  setErrorMessage(err?.response?.data?.data);
          },
        }
      );
    } catch (err) { }
  };

  return (
    <Transition appear show={showChangeCrownModal} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        onClose={() => setShowChangeCrownModal(true)}
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
                  onClick={() => setShowChangeCrownModal(false)}
                  className={`text-orange-color absolute rounded-full border-2 border-orange-color right-3 top-2 cursor-pointer`}
                >
                  <FaTimes size={20} />
                </div>
                <div className="flex flex-col items-center space-y-2 w-full">
                  <div className="text-white mb-4 flex flex-col items-center space-x-3 just-fy-center">
                    <h2>{crown?.name}</h2>
                    <img className="w-1/2" src={crown?.item} alt="" />
                    {successMessage && (
                      <div className="text-white flex items-center justify-center pt-2">
                        <p>{successMessage}</p>
                        <AiFillCheckCircle
                          size={20}
                          className="text-green-300"
                        />
                      </div>
                    )}
                  </div>

                  <button
                    disabled={crownSelectMutation.isLoading}
                    onClick={crownSelectSubmitHandler}
                    className="rounded-md bg-orange-bg text-white font-medium w-[70%] p-2"
                  >
                    {" "}
                    {crownSelectMutation.isLoading
                      ? <>{Localization["Loading"][lang]}</>
                      : <>{Localization["Update default crown"][lang]}</>}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ChangeCrown;
