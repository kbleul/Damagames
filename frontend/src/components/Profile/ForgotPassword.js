import React, { Fragment, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "../../context/auth";
import toast, { Toaster } from "react-hot-toast";
import { FaTimes } from "react-icons/fa";
import { BsFillPatchCheckFill } from "react-icons/bs";
const ForgotPassword = ({ forgotPasswordModal, setForgotPasswordModal }) => {
  const { login, token } = useAuth();
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const answerRef = useRef();
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
  };
  const securityQuestionData = useQuery(
    ["securityQuestionDataApi"],
    async () =>
      await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}security-questions`,
        {
          headers,
        }
      ),
    {
      keepPreviousData: true,
      refetchOnWindowFocus: false,
      retry: false,
      //   enabled: !!token,
      onSuccess: (res) => { },
    }
  );
  const handleSecurityQuestion = () => {
    if (!answerRef.current.value) {
      toast("please fill your answer");
      return;
    }
    forgotPasswordMutationSubmitHandler();
  };
  const forgotPasswordMutation = useMutation(
    async (newData) =>
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}security-question-answer`,
        newData,
        {
          headers,
        }
      ),
    {
      retry: false,
    }
  );

  const forgotPasswordMutationSubmitHandler = async (values) => {
    try {
      forgotPasswordMutation.mutate(
        {
          security_question_id: selectedQuestion,
          answer: answerRef.current.value,
        },
        {
          onSuccess: (responseData) => {

            toast("profile changed successfully");
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
      <Transition appear show={forgotPasswordModal} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setForgotPasswordModal(true)}
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
                    onClick={() => setForgotPasswordModal(false)}
                    className={`absolute right-3 top-2 border-2 rounded-md  p-1 cursor-pointer`}
                  >
                    <FaTimes
                      size={15}
                      style={{
                        color: "#fff",
                      }}
                    />
                  </div>
                  <div
                    className=" flex flex-col items-center justify-center
                   p-3 pt-5 w-full space-y-2"
                  >
                    {errorMessage && (
                      <div
                        class="w-full border-orange-color border 
                        text-white px-4 py-3 
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
                            <title>Close</title>
                            <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
                          </svg>
                        </span>
                      </div>
                    )}
                    {/* questions */}
                    {securityQuestionData.isFetched ? (
                      <div className="w-full">
                        <p className="text-white font-medium pb-1">
                          Select Question
                        </p>
                        <select
                          onChange={(e) => setSelectedQuestion(e.target.value)}
                          className="p-2 border-gray-400 rounded-md w-full focus:outline-none"
                        >
                          {securityQuestionData?.data?.data?.map((item) => (
                            <option value={item.id}>{item.question}</option>
                          ))}
                        </select>
                        {selectedQuestion && (
                          <div className="flex flex-col items-start space-y-2 pt-4">
                            <p className="text-gray-300 capitalize">
                              Your answer
                            </p>
                            <input
                              ref={answerRef}
                              type="text"
                              placeholder="your answer"
                              className="p-2 w-full focus:outline-none"
                            />
                            <button
                              disabled={forgotPasswordMutation.isLoading}
                              onClick={handleSecurityQuestion}
                              className="rounded-md bg-orange-bg text-white font-medium w-full p-2"
                            >
                              {forgotPasswordMutation.isLoading
                                ? "Loading..."
                                : "Update"}
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div>Loading</div>
                    )}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
      <Toaster />
    </>
  );
};

export default ForgotPassword;
