import React from "react";
import { FaMoneyBillWave } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import money from "../assets/money.svg";
const Success = () => {
  const navigate = useNavigate();
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
