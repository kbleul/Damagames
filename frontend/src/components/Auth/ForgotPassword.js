import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { useMutation, useQuery } from "@tanstack/react-query";
import useValidPhone from "../../Hook/useValidPhone";
import ReactCodeInput from "react-code-input";
import { ThreeDots } from "react-loader-spinner";
import axios from "axios";
import { Footer } from "../Footer";
import { Localization } from "../../utils/language";
import { useAuth } from "../../context/auth";

const ForgotPassword = () => {
  const [temporaryToken, setTemporaryToken] = useState(null);
  const [phone, setPhone, PhoneError] = useValidPhone();
  const [hasPhone, sethasPhone] = useState(false);
  const [hasCode, sethasCode] = useState(false);
  const [code, setCode] = useState("");
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [confirmpassword, setConfirmpassword] = useState("");
  const { lang } = useAuth();

  useEffect(() => {
    if ([...code].length == 4) {
      otpForgotSubmitHandler();
    }
  }, [code]);

  const handlShowPasword = () => {
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
        toast(Localization["please enter PhoneNo"][lang])
        return;
      }

      otpMutationSubmitHandler();
    } else {
      if (!hasCode) {
        if ([...code].length !== 4) {
          toast(Localization["Verification Code must 6 digits"][lang]);
          return;
        }

        otpForgotSubmitHandler();
      } else {
        if (!password || !confirmpassword) {
          toast(Localization["please enter password"][lang]);
          return;
        }
        if (password !== confirmpassword) {
          toast(Localization["password does not match"][lang])
          return;
        }
        changePasswordSubmitHandler();
      }
    }
  };

  const forgotPasswordMutation = useMutation(
    async (newData) =>
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}reset-password`,
        newData,
        {
          headers,
        }
      ),
    {
      retry: false,
    }
  );

  const otpMutationSubmitHandler = async () => {
    try {
      forgotPasswordMutation.mutate(
        { phone: "251".concat(phone) },
        {
          onSuccess: (responseData) => {
            sethasPhone(true);
            toast.success(Localization["OTP is sent to your phone"][lang]);
          },
          onError: (err) => {
            toast.error(err?.response?.data?.data);
          },
        }
      );
    } catch (err) { }
  };

  const forgotOtpMutation = useMutation(
    async (newData) =>
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}verify-password`,
        newData,
        {
          headers,
        }
      ),
    {
      retry: false,
    }
  );
  const otpForgotSubmitHandler = async () => {
    try {
      forgotOtpMutation.mutate(
        {
          phone: "251".concat(phone),
          password: code,
        },
        {
          onSuccess: (responseData) => {
            setTemporaryToken(responseData?.data?.data?.token);
            sethasCode(true);
            toast.success(Localization["success"][lang]);
          },
          onError: (err) => {
            toast.error(err?.response?.data?.message);
          },
        }
      );
    } catch (err) { }
  };
  const changePasswordMutation = useMutation(
    async (newData) =>
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}reset-change-password`,
        newData,
        {
          headers: header,
        }
      ),
    {
      retry: false,
    }
  );
  const changePasswordSubmitHandler = async () => {
    try {
      changePasswordMutation.mutate(
        {
          password: password,
          confirm_password: confirmpassword,
        },
        {
          onSuccess: (responseData) => {
            toast.success(Localization["password has been successfully changed"][lang]);
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

  //resend otp
  const resendOtpMutation = useMutation(
    async (newData) =>
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}resend-otp`,
        newData,
        {
          headers,
        }
      ),
    {
      retry: false,
    }
  );

  const resendOtpSubmitHandler = async () => {
    try {
      resendOtpMutation.mutate(
        { phone: "251".concat(phone) },
        {
          onSuccess: (responseData) => {
            toast.success(Localization["OTP is sent to your phone"][lang]);
          },
          onError: (err) => {
            toast.error(err?.response?.data?.data);
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
              <h1 className="font-medium text-[#fff] text-center">
                {Localization["Enter your Phone and we'll send"][lang]}
              </h1>
            ) : hasCode ? (
              <h1 className="font-medium text-[#fff] text-center">
                {Localization["Enter Your New Password"][lang]}
              </h1>
            ) : (
              <h1 className="font-medium text-[#fff] text-center">
                {Localization["Your OTP Code:"][lang]}
              </h1>
            )}
          </div>
          {/* form */}
          {!hasPhone ? (
            <div className="flex flex-col items-start space-y-2  w-full">
              <div className="w-full flex flex-col items-start space-y-1">
                <p className="text-[13px] text-gray-300">{Localization["Phone no"][lang]}</p>
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
                    placeholder="900-00-00"
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
                {forgotPasswordMutation.isLoading ? (
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
                  Localization["Send"][lang]
                )}
              </button>

              <p
                onClick={() => navigate("/login")}
                className="font-medium text-[#fff] text-center w-full  cursor-pointer  "
              >
                {Localization["Back to login"][lang]}
              </p>
            </div>
          ) : !hasCode ? (
            <div className="flex flex-col items-center w-full space-y-2">
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
                {forgotOtpMutation.isLoading ? (
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
                  Localization["Send"][lang]
                )}
              </button>
              <p
                onClick={resendOtpSubmitHandler}
                className="font-medium text-[#fff] text-center w-full  cursor-pointer hover:opacity-70 "
              >
                {Localization["Re-Send"][lang]}
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center w-full space-y-2">
              <div className="flex items-center   h-[42px]  border-2 rounded-md border-orange-color w-full">
                <input
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  type={showPassword ? "text" : "password"}
                  placeholder={Localization["password"][lang]}
                  className="w-full flex-grow h-[42px] text-white pl-3 bg-transparent border-none focus:border-none focus:ring-0  
         focus:outline-none"
                />
                <button
                  onClick={handlShowPasword}
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
                  onChange={(event) => setConfirmpassword(event.target.value)}
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder={Localization["Confirm Password"][lang]}
                  name="phoneNo"
                  className="w-full h-[42px] text-white flex-grow pl-3 bg-transparent border-none focus:border-none focus:ring-0  
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
                className="relative w-full p-2 bg-orange-bg rounded-md cursor-pointer select-none
                active:translate-y-2  active:[box-shadow:0_0px_0_0_#1b6ff8,0_0px_0_0_#1b70f841]
                active:border-b-[0px] flex items-center justify-center
                transition-all duration-150 [box-shadow:0_5px_0_0_#c93b00,0_5px_0_0_#c93b00]
                border-b-[1px] border-gray-400/50 font-semibold text-white
                    "
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-md" />
                {changePasswordMutation.isLoading ? (
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
                  Localization["Back to login"][lang]
                )}
              </button>
              <p
                onClick={() => navigate("/login")}
                className="font-medium text-[#fff] text-center w-full  cursor-pointer  "
              >
                {Localization["Back to login"][lang]}
              </p>
            </div>
          )}
        </div>
      </div>
      <Toaster />
    </>
  );
};

export default ForgotPassword;
