import { useState, useRef, Dispatch, SetStateAction } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { GiGamepadCross } from "react-icons/gi";
import { useAuth } from "../../context/Auth";
import { PulseLoader } from "react-spinners";
import useValidPhone from "../../hooks/useValidPhone";

const Login = () => {
  const passwordRef = useRef<HTMLInputElement>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [phone, setPhone] = useValidPhone();
  const { login } = useAuth();
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    loginMutationSubmitHandler();
  };

  //POST REQUEST
  const loginMutation = useMutation(
    async (newData: any) =>
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}login`,
        newData,
        {
          headers,
        }
      ),
    {
      retry: false,
    }
  );

  const loginMutationSubmitHandler = async () => {
    try {
      loginMutation.mutate(
        {
          phone: "251".concat(phone as string),
          password: passwordRef.current?.value,
        },
        {
          onSuccess: (responseData: any) => {
            login(
              responseData?.data?.data?.token,
              responseData?.data?.data?.user
            );
          },
          onError: (err: any) => {
            setError("Incorrect phone or Password");
          },
        }
      );
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="p-3 flex flex-col items-center justify-center min-h-screen w-full max-w-sm mx-auto">
      <div className="text-center flex items-center justify-center">
        <GiGamepadCross className="text-6xl text-main-color" />
      </div>
      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-500 px-4 py-3 rounded relative w-full"
          role="alert"
        >
          <span className="block sm:inline font-medium">{error}</span>
          <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
            <svg
              onClick={() => setError("")}
              className="fill-current h-6 w-6 text-red-500"
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
      <div className="w-full mt-2 flex flex-col items-center space-y-2">
        <form
          action=""
          onSubmit={handleSubmit}
          className="w-full flex flex-col items-center space-y-2"
        >
          <div className="flex items-center w-full border border-gray-300 rounded-sm">
            <span className="border-r-2 border-gray-300 font-medium text-gray-700 px-2">
              +251
            </span>
            <input
              type="tel"
              value={phone as string}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                (setPhone as Dispatch<SetStateAction<string>>)(e.target.value)
              }
              placeholder="Phone"
              className="w-full p-2  font-medium text-gray-500 focus:outline-none ring-0"
              required
            />
          </div>
          <div className="flex items-center w-full border border-gray-300 rounded-sm ">
            <input
              ref={passwordRef}
              type={showPassword ? "text" : "password"}
              name=""
              id=""
              placeholder="Password"
              className="w-full p-2 focus:outline-none ring-0 font-medium text-gray-500"
              required
            />
            <div
              className="px-2 h-fit cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <AiFillEyeInvisible size={22} color="#aeaeae" />
              ) : (
                <AiFillEye size={22} color="#aeaeae" />
              )}
            </div>
          </div>

          <button
            disabled={loginMutation.isLoading}
            type="submit"
            className=" rounded-sm  bg-main-bg p-3 text-[15px] text-white font-medium
                   hover:bg-main-bg/70 disabled:hover:bg-main-bg  w-full flex items-center justify-center"
          >
            {loginMutation.isLoading ? <PulseLoader color="#fff" /> : "Log in"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
