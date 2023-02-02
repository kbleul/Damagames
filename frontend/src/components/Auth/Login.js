import React, { useState } from "react";
import { Form, Formik, Field } from "formik";
import * as Yup from "yup";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "../../context/auth";
import { ThreeDots } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";
import { Footer } from "../../Game/components/Footer";
const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const firstPlayer = JSON.parse(localStorage.getItem("playerOne"));
  const secondPlayer = JSON.parse(localStorage.getItem("playerTwo"));
  const playerId = localStorage.getItem("playerOneIp")
    ? firstPlayer
    : secondPlayer;
  const playerTwoId = localStorage.getItem("playerTwoIp");
  const [errorMessage, setErrorMessage] = useState("");
  const singUpValidationSchema = Yup.object().shape({
    phone: Yup.string()
      .matches(/^[0-9]{9}$/, "phone starts with 9 and 9 char in length")
      .required("phone is required"),
    password: Yup.string().min(4).required("password is required"),
  });
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  const onSubmit = (values) => {
    loginMutationSubmitHandler(values);
  };
  const loginMutation = useMutation(
    async (newData) =>
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}login`, newData, {
        headers,
      }),
    {
      retry: false,
    }
  );

  const loginMutationSubmitHandler = async (values) => {
    try {
      loginMutation.mutate(
        {
          phone: "251".concat(values?.phone),
          password: values.password,
        },
        {
          onSuccess: (responseData) => {
            login(
              responseData?.data?.data?.token,
              responseData?.data?.data?.user
            );
            navigate('/')
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
      <div className="max-w-sm mx-auto flex flex-col items-center justify-center p-3 w-full space-y-2">
        {errorMessage && (
          <div
            class=" w-full border border-red-400 text-white px-4 py-3 
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
            phone: "",
            password: "",
          }}
          validationSchema={singUpValidationSchema}
          onSubmit={onSubmit}
        >
          {({ errors, touched, values, setTouched, setFieldValue }) => (
            <Form className="flex flex-col items-start space-y-2 w-full">
              <div className="flex flex-col items-start space-y-2 w-full">
                {/* phone */}
                <div
                  className={`input flex items-center h-[42px]  border rounded-[4px]  w-full ${errors.phone && touched.phone
                    ? "border border-red-500"
                    : "border border-orange-color "
                    }`}
                >
                  <span
                    className="border-r border-orange-color text-gray-200 font-semibold text-sm
               rounded-l-md h-full flex flex-grow text-center px-2 items-center justify-center "
                  >
                    +251
                  </span>
                  <Field
                    as="input"
                    type="tel"
                    // value={phone}
                    // onChange={(event) => setPhone(event.target.value)}
                    placeholder="900-00-00"
                    name="phone"
                    className=" h-[42px] w-full flex-grow font-medium  text-gray-200 pl-3
                     bg-transparent border-none focus:border-none focus:ring-0  
                       focus:outline-none"
                  />
                </div>
                {errors.phone && touched.phone ? (
                  <p className="text-[13px] font-medium text-red-500">
                    {errors.phone}
                  </p>
                ) : null}
                {/* password */}
                <p
                  onClick={() => navigate("/forgot-password")}
                  className="text-white font-medium text-end self-end justify-end text-sm cursor-pointer"
                >
                  Forgot password
                </p>
                <Field
                  as="input"
                  type="password"
                  placeholder="password"
                  name="password"
                  className={`rounded-[4px] pl-3 w-full h-[42px] bg-transparent font-medium  focus:outline-none focus:ring-0   text-gray-200 
                  ${errors.password && touched.password
                      ? "border border-red-500"
                      : "border border-orange-color "
                    }`}
                />
                {errors.password && touched.password ? (
                  <p className="text-[13px] font-medium text-red-500">
                    {errors.password}
                  </p>
                ) : null}
              </div>
              <button
                disabled={loginMutation.isLoading}
                type="submit"
                className="w-full  rounded-md   flex items-center justify-center
                    bg-orange-bg px-4 py-2 text-sm text-white font-medium
                    hover:opacity-80"
              >
                {loginMutation.isLoading ? (
                  <ThreeDots
                    height="25"
                    width="50"
                    radius="9"
                    color="#fff"
                    ariaLabel="three-dots-loading"
                    wrapperStyle={{}}
                    wrapperClassName=""
                    visible={true}
                  />
                ) : (
                  " Log in"
                )}
              </button>
            </Form>
          )}
        </Formik>
        <p className="text-white font-medium">
          Don't have account ?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="text-orange-color underline cursor-pointer"
          >
            SignUp
          </span>
        </p>

        <span
          onClick={() => navigate("/")}
          className="text-orange-color underline cursor-pointer"
        >
          Back
        </span>
      </div>
      <Footer />
    </>
  );
};

export default Login;
