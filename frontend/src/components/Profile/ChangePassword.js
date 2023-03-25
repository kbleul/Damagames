import React, { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Form, Formik, Field } from "formik";
import * as Yup from "yup";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "../../context/auth";
import toast, { Toaster } from "react-hot-toast";
import { FaTimes } from "react-icons/fa";
import { AiFillCheckCircle } from "react-icons/ai";

const ChangePassword = ({ changePasswordModal, setChangePasswordModal }) => {
  const { token } = useAuth();

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState(null)

  const changePasswordValidationSchema = Yup.object().shape({
    currentPassword: Yup.string().required("current password is required"),
    password: Yup.string().min(6).required("new password is required"),
    confirmPassword: Yup.string().when("password", {
      is: (val) => (val && val.length > 0 ? true : false),
      then: Yup.string().oneOf(
        [Yup.ref("password")],
        "new password does not match"
      ),
    }),
  });
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
  };
  const onSubmit = (values) => {
    registerMutationSubmitHandler(values);
  };
  const registerMutation = useMutation(
    async (newData) =>
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}change-password`,
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
          current_password: values?.currentPassword,
          new_password: values.password,
          new_confirm_password: values.confirmPassword,
        },
        {
          onSuccess: (responseData) => {
            setSuccessMessage("Password changed.")

            setTimeout(() => {
              setChangePasswordModal(false)
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
      <Transition appear show={changePasswordModal} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setChangePasswordModal(true)}
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
                    onClick={() => setChangePasswordModal(false)}
                    className={`text-orange-color absolute rounded-full border-2 border-orange-color right-3 top-2 cursor-pointer`}
                  >
                    <FaTimes
                      size={20}
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
                    <Formik
                      initialValues={{
                        currentPassword: "",
                        password: "",
                        confirmPassword: "",
                      }}
                      validationSchema={changePasswordValidationSchema}
                      onSubmit={onSubmit}
                    >
                      {({
                        errors,
                        touched,
                        values,
                        setTouched,
                        setFieldValue,
                      }) => (
                        <Form className="flex flex-col items-start space-y-2 w-full">
                          <div className="flex flex-col items-start space-y-2 w-full">
                            {/* currentPassword */}
                            <Field
                              as="input"
                              type="text"
                              placeholder="Current Password"
                              name="currentPassword"
                              className={`rounded-[4px] pl-3 w-full h-[42px] bg-transparent font-medium  focus:outline-none focus:ring-0   text-gray-200 
                  ${errors.currentPassword && touched.currentPassword
                                  ? "border border-red-500"
                                  : "border border-gray-300 "
                                }`}
                            />
                            {errors.currentPassword &&
                              touched.currentPassword ? (
                              <p className="text-[13px] font-medium text-red-500">
                                {errors.currentPassword}
                              </p>
                            ) : null}
                            {/* password */}
                            <Field
                              as="input"
                              type="text"
                              placeholder="Password"
                              name="password"
                              className={`rounded-[4px] pl-3 w-full h-[42px] bg-transparent font-medium  focus:outline-none focus:ring-0   text-gray-200 
                  ${errors.password && touched.password
                                  ? "border border-red-500"
                                  : "border border-gray-300 "
                                }`}
                            />
                            {errors.password && touched.password ? (
                              <p className="text-[13px] font-medium text-red-500">
                                {errors.password}
                              </p>
                            ) : null}
                            {/* confirm password */}
                            <Field
                              as="input"
                              type="text"
                              placeholder="Confirm Password"
                              name="confirmPassword"
                              className={`rounded-[4px] pl-3 w-full h-[42px] bg-transparent font-medium  focus:outline-none focus:ring-0   text-gray-200 
                  ${errors.confirmPassword && touched.confirmPassword
                                  ? "border border-red-500"
                                  : "border border-gray-300 "
                                }`}
                            />
                            {errors.confirmPassword &&
                              touched.confirmPassword ? (
                              <p className="text-[13px] font-medium text-red-500">
                                {errors.confirmPassword}
                              </p>
                            ) : null}
                          </div>

                          {successMessage && <div className='w-full text-white flex items-center justify-center pt-2'>
                            <p>{successMessage}</p>
                            <AiFillCheckCircle size={20} className="text-green-300" />
                          </div>}
                          <button
                            disabled={registerMutation.isLoading}
                            type="submit"
                            className="w-full justify-center rounded-md 
                    bg-orange-bg px-4 py-2 text-sm text-white font-medium
                    hover:opacity-80"
                          >
                            {registerMutation.isLoading
                              ? "Loading"
                              : " Change Password"}
                          </button>
                        </Form>
                      )}
                    </Formik>
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

export default ChangePassword;
