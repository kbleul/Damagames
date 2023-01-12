import React from "react";
import { useNavigate } from "react-router-dom";
import joined from "../assets/joined.png";
const ErrorPage = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center p-5 space-y-2">
      <img src={joined} alt="" className="h-36" />
      <h1 className="text-white font-medium  capitalize">
        someone has already joined the game
      </h1>
      <p
            onClick={() => navigate("/create-game")}
            className="text-orange-color font-medium z-20 text-center pt-3 cursor-pointer"
          >
            Back
          </p>
    </div>
  );
};

export default ErrorPage;
