import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { useMutation, useQuery } from "@tanstack/react-query";
import useValidPhone from "../../Hook/useValidPhone";
import ReactCodeInput from "react-code-input";
import { ThreeDots } from "react-loader-spinner";
import axios from "axios";
import { useAuth } from "../../context/auth";
import { Footer } from "../Footer";
const Signup = () => {
  const { login } = useAuth();
  const [phone, setPhone, PhoneError] = useValidPhone();
  const [hasPhone, sethasPhone] = useState(false);
  const [hasCode, sethasCode] = useState(false);
  const [code, setCode] = useState("");
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [confirmpassword, setConfirmPassword] = useState("");
  const [username, setUserName] = useState("");
  const [temporaryToken, setTemporaryToken] = useState(null);
  useEffect(() => {
    if ([...code].length === 4) {
      verifyOtpSubmitHandler();
    }
  }, [code]);

  const handleShowPassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };
  const handlShowConfirmPasword = () => {
    setShowConfirmPassword((prevConfirmpassword) => !prevConfirmpassword);
  };
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  const header = {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${temporaryToken}`,
  };

  const handleSubmit = (e) => {
    if (e.key === "Enter") {
      forgotPasswordHandler();
    }
  };
  const forgotPasswordHandler = () => {
    if (!hasPhone) {
      if (!phone) {
        toast("please enter PhoneNo");
        return;
      }

      registerSubmitHandler();
    } else {
      if (!hasCode) {
        if ([...code].length !== 4) {
          toast("Verification Code must 4 digits");
          return;
        }

        verifyOtpSubmitHandler();
      } else {
        if (!username) {
          toast("please enter username");
          return;
        }
        if (!password || !confirmpassword) {
          toast("please enter password");
          return;
        }
        if (password !== confirmpassword) {
          toast("password does not match");
          return;
        }
        finishRegisterSubmitHandler();
      }
    }
  };

  const firstPlayer = JSON.parse(localStorage.getItem("playerOne"));
  const secondPlayer = JSON.parse(localStorage.getItem("playerTwo"));
  const playerId = localStorage.getItem("playerOneIp")
    ? firstPlayer
    : secondPlayer;
  const playerTwoId = localStorage.getItem("playerTwoIp");
  const registerMutation = useMutation(
    async (newData) =>
      await axios.post(
        !playerId && !playerTwoId
          ? `${process.env.REACT_APP_BACKEND_URL}register`
          : `${process.env.REACT_APP_BACKEND_URL}register/${playerId.id}`,
        newData,
        {
          headers,
        }
      ),
    {
      retry: false,
    }
  );

  const registerSubmitHandler = async () => {
    try {
      registerMutation.mutate(
        { phone: "251".concat(phone) },
        {
          onSuccess: (responseData) => {
            sethasPhone(true);
            toast.success("otp is sent to your phone");
          },
          onError: (err) => {
            toast.error(err?.response?.data?.data);
          },
        }
      );
    } catch (err) { }
  };

  const verifyOtpMutation = useMutation(
    async (newData) =>
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}verify-otp`,
        newData,
        {
          headers,
        }
      ),
    {
      retry: false,
    }
  );
  const verifyOtpSubmitHandler = async () => {
    try {
      verifyOtpMutation.mutate(
        {
          phone: "251".concat(phone),
          password: code,
        },
        {
          onSuccess: (responseData) => {
            setTemporaryToken(responseData?.data?.data?.token);
            sethasCode(true);
            toast.success("success");
          },
          onError: (err) => {
            toast.error(err?.response?.data?.message);
          },
        }
      );
    } catch (err) { }
  };
  const finishRegisterMutation = useMutation(
    async (newData) =>
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}finish-regster`,
        newData,
        {
          headers: header,
        }
      ),
    {
      retry: false,
    }
  );
  const finishRegisterSubmitHandler = async () => {
    try {
      finishRegisterMutation.mutate(
        {
          username: username,
          password: password,
          password_confirmation: confirmpassword,
        },
        {
          onSuccess: (responseData) => {
            login(temporaryToken, responseData?.data?.data?.user);
            toast.success("success");
            navigate("/login");
          },
          onError: (err) => {
            toast.error(
              err?.response?.data?.message,
              { theme: "colored" },
              {
                position: "bottom-right",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
              }
            );
          },
        }
      );
    } catch (err) { }
  };
  const props = {
    inputStyle: {
      margin: "4px",
      MozAppearance: "textfield",
      width: "40px",
      borderRadius: "5px",
      fontSize: "20px",
      height: "40px",
      backgroundColor: "transparent",
      color: "white",
      border: "2px solid #FF4C01",
      textAlign: "center",
      focus: {
        outline: "none",
        border: "2px solid #FF4C01",
      },
    },
  };
  return (
    <>
      <div className="relative flex items-center justify-center min-h-screen ">
        <div className="max-w-sm mx-auto w-full flex flex-col items-center space-y-2   p-3 rounded-md">
          <div className="flex flex-col items-center space-y-1 w-full">
            {!hasPhone ? (
              <h1 className="font-medium text-[#fff] text-center">Sign up</h1>
            ) : hasCode ? (
              <h1 className="font-medium text-[#fff] text-center">
                Enter Your username and password
              </h1>
            ) : (
              <h1 className="font-medium text-[#fff] text-center">
                Your Otp Code:
              </h1>
            )}
          </div>
          {/* form */}
          {!hasPhone ? (
            <div className="flex flex-col items-start space-y-2  w-full">
              <div className="w-full flex flex-col items-start space-y-1">
                <p className="text-[13px] text-gray-300">Phone no</p>
                <div
                  className="flex items-center   h-[42px]  border-2 rounded-md
                 border-orange-color w-full"
                >
                  <span
                    className="border-r-2 border-orange-color rounded-l-md h-full
                   flex flex-grow font-medium text-white text-center px-2 items-center justify-center "
                  >
                    +251
                  </span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    placeholder="900-00-0000"
                    name="phoneNo"
                    onKeyDown={handleSubmit}
                    className="w-full  h-[42px] text-white flex-grow pl-3 bg-transparent border-none focus:border-none focus:ring-0    focus:outline-none"
                  />
                </div>
                <p className="text-red-600 text-[10px]">{PhoneError}</p>
              </div>

              <button
                onClick={forgotPasswordHandler}
                className="relative w-full p-2 bg-orange-bg rounded-md cursor-pointer select-none
          active:translate-y-2  active:[box-shadow:0_0px_0_0_#1b6ff8,0_0px_0_0_#1b70f841]
          active:border-b-[0px] flex items-center justify-center
          transition-all duration-150 [box-shadow:0_5px_0_0_#c93b00,0_5px_0_0_#c93b00]
          border-b-[1px] border-gray-400/50 font-semibold text-white
              "
              >

                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-md" />
                {registerMutation.isLoading ? (
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
                  "Send"
                )}
              </button>

              <p
                onClick={() => navigate("/login")}
                className="font-medium text-[#fff] text-center w-full  cursor-pointer  "
              >
                Back to login
              </p>
            </div>
          ) : !hasCode ? (
            <div className="flex flex-col items-center w-full space-y-2">
              <button
                className="z-10 bg-orange-color rounded-full w-8 h-8 flex justify-center items-center mr-2 mt-2 fixed right-0 md:right-4"
                onClick={() => navigate("/create-game")}
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
                    d="M0.396166 0.973833C0.500244 0.722555 0.676505 0.507786 0.902656 0.356693C1.12881 0.205599 1.39469 0.124969 1.66667 0.125H10.8333C12.6567 0.125 14.4054 0.849328 15.6947 2.13864C16.984 3.42795 17.7083 5.17664 17.7083 7C17.7083 8.82336 16.984 10.572 15.6947 11.8614C14.4054 13.1507 12.6567 13.875 10.8333 13.875H2.58333C2.21866 13.875 1.86892 13.7301 1.61106 13.4723C1.3532 13.2144 1.20833 12.8647 1.20833 12.5C1.20833 12.1353 1.3532 11.7856 1.61106 11.5277C1.86892 11.2699 2.21866 11.125 2.58333 11.125H10.8333C11.9274 11.125 12.9766 10.6904 13.7501 9.91682C14.5237 9.14323 14.9583 8.09402 14.9583 7C14.9583 5.90598 14.5237 4.85677 13.7501 4.08318C12.9766 3.3096 11.9274 2.875 10.8333 2.875H4.98592L5.84758 3.73667C6.09793 3.99611 6.23636 4.34351 6.23306 4.70403C6.22976 5.06455 6.08499 5.40935 5.82993 5.66417C5.57487 5.91898 5.22994 6.06343 4.86941 6.06639C4.50889 6.06935 4.16163 5.93059 3.90242 5.68L0.694083 2.47167C0.501936 2.27941 0.371084 2.03451 0.318058 1.76791C0.265033 1.50132 0.292214 1.22499 0.396166 0.973833Z"
                    fill="#191921"
                  />
                </svg>
              </button>
              <ReactCodeInput
                type="tel"
                fields={4}
                {...props}
                onChange={(code) => setCode(code)}
              />
              <button
                onClick={forgotPasswordHandler}
                className="relative w-full p-2 bg-orange-bg rounded-md cursor-pointer select-none
          active:translate-y-2  active:[box-shadow:0_0px_0_0_#1b6ff8,0_0px_0_0_#1b70f841]
          active:border-b-[0px] flex items-center justify-center
          transition-all duration-150 [box-shadow:0_5px_0_0_#c93b00,0_5px_0_0_#c93b00]
          border-b-[1px] border-gray-400/50 font-semibold text-white
              "
              >

                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-md" />
                {verifyOtpMutation.isLoading ? (
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
                  "Send"
                )}
              </button>
              <p
                onClick={() => navigate("/login")}
                className="font-medium text-[#fff] text-center w-full  cursor-pointer hover:opacity-70 "
              >
                Re-Send
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center w-full space-y-2">
              <input
                value={username}
                onChange={(event) => setUserName(event.target.value)}
                type="text"
                placeholder="username"
                className="w-full flex-grow h-[42px]  text-white pl-3 bg-transparent border-2 rounded-md
                  border-orange-color focus:ring-0   focus:outline-none"
              />
              <div className="flex items-center   h-[42px]  border-2 rounded-md border-orange-color w-full">
                <input
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  type={showPassword ? "text" : "password"}
                  placeholder="password"
                  className="w-full flex-grow  text-white h-[42px] pl-3 bg-transparent border-none 
                  focus:border-none focus:ring-0  
         focus:outline-none"
                />
                <button
                  onClick={handleShowPassword}
                  className="h-full flex flex-grow text-center 
         px-2 items-center justify-center "
                >
                  {showPassword ? (
                    <AiFillEye size={23} className="text-gray-400" />
                  ) : (
                    <AiFillEyeInvisible size={23} className="text-gray-400" />
                  )}
                </button>
              </div>
              <div className="flex items-center  h-[42px]    border-2 rounded-md border-orange-color w-full">
                <input
                  value={confirmpassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="password"
                  name="phoneNo"
                  className="w-full h-[42px]  text-white flex-grow pl-3 bg-transparent border-none focus:border-none focus:ring-0  
         focus:outline-none"
                  onKeyDown={handleSubmit}
                />
                <button
                  onClick={handlShowConfirmPasword}
                  className="h-full flex flex-grow text-center 
         px-2 items-center justify-center "
                >
                  {showConfirmPassword ? (
                    <AiFillEye size={23} className="text-gray-400" />
                  ) : (
                    <AiFillEyeInvisible size={23} className="text-gray-400" />
                  )}
                </button>
              </div>
              <button
                onClick={forgotPasswordHandler}
                className="w-full p-2 bg-orange-bg rounded-md cursor-pointer select-none px-5
                active:translate-y-2  active:[box-shadow:0_0px_0_0_#1b6ff8,0_0px_0_0_#1b70f841]
                active:border-b-[0px] flex items-center justify-center
                transition-all duration-150 [box-shadow:0_5px_0_0_#c93b00,0_5px_0_0_#c93b00]
                border-b-[1px] border-gray-300/50 font-semibold text-white
              "
              >
                {finishRegisterMutation.isLoading ? (
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
                  "Sign up"
                )}
              </button>
              <p
                onClick={() => navigate("/login")}
                className="font-medium text-[#fff] text-center w-full  cursor-pointer  "
              >
                Already have account ? Login
              </p>
            </div>
          )}
        </div>
      </div>
      <Footer />
      <Toaster />
    </>
  );
};

export default Signup;
