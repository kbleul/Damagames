import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import background from "../assets/background.png";
import { IoIosCopy } from "react-icons/io";
const CreateGame = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        backgroundImage: `url(${background})`,
        backgroundPosition: "center",
        minWidth: "100vw",
        minHeight: "100vh",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        width: "100%",
        overflow:'hidden'
      }}
    >
      <div className="flex flex-col items-center justify-center min-h-screen space-y-2">
        <button
          onClick={() => navigate("/new-game")}
          className="bg-orange-bg p-2 px-10 font-medium text-white rounded-sm"
        >
          Create Game
        </button>
        <button 
        onClick={() => navigate("/join-game")}
        className="border-2 bg-transparent border-orange-color p-2 px-11 font-medium text-orange-color rounded-sm">
          Join Game
        </button>
      </div>
    </div>
  );
};

export default CreateGame;
