import React from "react";
import { FaMoneyBillWave } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import money from "../assets/money.svg";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "../context/auth";
const Success = () => {
  const navigate = useNavigate();
  const { user, token, setUser } = useAuth();
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
  };

  const profileData = useQuery(
    ["profileDataApi"],
    async () =>
      await axios.get(`${process.env.REACT_APP_BACKEND_URL}profile`, {
        headers,
      }),
    {
      keepPreviousData: true,
      refetchOnWindowFocus: false,
      retry: false,
      enabled: !!token,
      onSuccess: (res) => {
        console.log(res?.data?.data);
        localStorage.setItem(
          "dama_user_data",
          JSON.stringify({
            token,
            user: {
              ...user,
              coin: res?.data?.data?.coin,
              current_point: res?.data?.data?.current_point,
            },
          })
        );
        setUser({
          ...user,
          coin: res?.data?.data?.coin,
          current_point: res?.data?.data?.current_point,
        });
      },
    }
  );
  return (
    <div className="flex flex-col space-y-2 items-center justify-center max-w-xl mx-auto p-3">
      <img src={money} />
      <h3 className="text-white font-medium">
        Payment Successful! Thank you for your purchase
      </h3>
      <button
        className="relative w-full p-2 bg-orange-bg rounded-md cursor-pointer select-none
            active:translate-y-2  active:[box-shadow:0_0px_0_0_#1b6ff8,0_0px_0_0_#1b70f841]
            active:border-b-[0px] flex items-center justify-center
            transition-all duration-150 [box-shadow:0_5px_0_0_#c93b00,0_5px_0_0_#c93b00]
            border-b-[1px] border-gray-400/50 font-semibold text-white
          "
        onClick={() => navigate("/create-game")}
      >
        Go to home
      </button>
    </div>
  );
};

export default Success;
