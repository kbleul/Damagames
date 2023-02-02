import React, { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import Pic1 from "../../assets/pic1.jpg";
import Pic2 from "../../assets/pic2.png";
import Pic3 from "../../assets/pic3.png";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "../../context/auth";
import toast, { Toaster } from "react-hot-toast";
import { FaTimes } from "react-icons/fa";
import { BsFillPatchCheckFill } from "react-icons/bs";
const ChangeProfile = ({ changeProfileModal, setChangeProfileModal }) => {
  const { login, token } = useAuth();
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
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
            toast("profile changed successfully");
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
  const [selected, setSelected] = useState(null);
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
                  className="w-full max-w-md transform overflow-hidden 
            rounded-2xl bg-dark-bg p-6 text-left align-middle shadow-xl transition-all"
                >
                  <div
                    onClick={() => setChangeProfileModal(false)}
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
                        class="w-full border-orange-color border border-red-400 
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
                            <title>Close</title>
                            <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
                          </svg>
                        </span>
                      </div>
                    )}
                    {/* profiles */}
                    <div className="flex flex-col items-center space-y-2 w-full">
                      <div className="flex items-center space-x-3 just-fy-center">
                        {images.map((img, i) => (
                          <div
                            key={i}
                            className="relative"
                            onClick={() => {
                              setSelected(i);
                              setSelectedImage(img.value);
                            }}
                          >
                            {selected === i && (
                              <BsFillPatchCheckFill className="absolute bottom-2 right-2 text-orange-color" />
                            )}
                            <img
                              src={img.img}
                              alt=""
                              className="h-20 w-20 object-cover"
                            />
                          </div>
                        ))}
                      </div>
                      {selected !== null && (
                        <button
                          disabled={profileMutation.isLoading}
                          onClick={profileMutationSubmitHandler}
                          className="rounded-md bg-orange-bg text-white font-medium w-[70%] p-2"
                        >
                          {profileMutation.isLoading ? "Loading..." : "Update"}
                        </button>
                      )}
                    </div>
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

export default ChangeProfile;
