import React, { useState } from "react";
import { Form, Formik, Field } from "formik";
import * as Yup from "yup";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "../../context/auth";
import { ThreeDots } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";
import { Footer } from "../Footer";
import { useHome } from "../../context/HomeContext";
import { Localization } from "../../utils/language"

const Login = () => {
  const { login, lang } = useAuth();
  const navigate = useNavigate();
  const firstPlayer = JSON.parse(localStorage.getItem("playerOne"));
  const secondPlayer = JSON.parse(localStorage.getItem("playerTwo"));
  const playerId = localStorage.getItem("playerOneIp")
    ? firstPlayer
    : secondPlayer;
  const playerTwoId = localStorage.getItem("playerTwoIp");
  const [errorMessage, setErrorMessage] = useState("");
  const { setMessageType } = useHome()

  const singUpValidationSchema = Yup.object().shape({
    phone: Yup.string()
      .matches(/^[0-9]{9}$/, Localization["phone number starts with 9"][lang])
      .required(Localization["phone is required"][lang]),
    password: Yup.string().min(4).required(Localization["password is required"][lang]),
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
            const newUser = {
              ...responseData?.data?.data?.user,
              default_board: responseData?.data?.data?.default_board,
              default_crown: responseData?.data?.data?.default_crown,
              seasons: [...responseData?.data?.data?.seasons]
            }

            login(
              responseData?.data?.data?.token,
              newUser
            );
            setMessageType({
              type: "SUCCESS",
              message: Localization["Login successful!"][lang],
            });
            navigate('/')
          },
          onError: (err) => {
            setErrorMessage(err.response.data.data);
          },
        }
      );
    } catch (err) { }
  };
  return (<>
    <main className="relative">
      <button
        className={"z-10 bg-orange-color rounded-full w-8 h-8 flex justify-center items-center mr-2 mt-2 fixed top-0 left-2 md:left-4"}
        onClick={() => navigate("/")}
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
      <div className="max-w-sm mx-auto flex flex-col items-center justify-center p-3 w-full space-y-2 relative">

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
                <title>{Localization["Close"][lang]}</title>
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
                  {Localization["Forgot Password"][lang]}
                </p>
                <Field
                  as="input"
                  type="password"
                  placeholder={Localization["password"][lang]}
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
                className="relative w-full p-2 bg-orange-bg rounded-md cursor-pointer select-none
          active:translate-y-2  active:[box-shadow:0_0px_0_0_#1b6ff8,0_0px_0_0_#1b70f841]
          active:border-b-[0px] flex items-center justify-center
          transition-all duration-150 [box-shadow:0_5px_0_0_#c93b00,0_5px_0_0_#c93b00]
          border-b-[1px] border-gray-400/50 font-semibold text-white
        "
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-md" />
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
                ) : <>
                  {Localization["Login"][lang]}</>
                }
              </button>
            </Form>
          )}
        </Formik>


        <p
          className=" text-xs text-gray-400 text-right text-center w-full  cursor-pointer  "
        >
          {Localization["Don't have account"][lang]}
          {" "}<span onClick={() => navigate("/signup")} className="text-orange-color underline font-bold ml-1">
            {Localization["Sign up"][lang]}
          </span>
        </p>
      </div>
    </main>

  </>
  );
};

export default Login;
