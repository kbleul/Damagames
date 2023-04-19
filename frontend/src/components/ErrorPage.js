import React from "react";
import { useNavigate } from "react-router-dom";
import joined from "../assets/joined.png";
import { useAuth } from "../context/auth";
import { Localization } from "../utils/language"

const ErrorPage = () => {
  const navigate = useNavigate();
  const { lang } = useAuth();


  return (
    <div className="flex flex-col items-center justify-center p-5 space-y-2">
      <img src={joined} alt="" className="h-36" />
      <h1 className="text-white font-medium  capitalize">
        {Localization["someone has already"][lang]}
      </h1>
      <p
        onClick={() => navigate("/create-game")}
        className="text-orange-color font-medium z-20 text-center pt-3 cursor-pointer"
      >
        {Localization["Back"][lang]}
      </p>
    </div>
  );
};

export default ErrorPage;
