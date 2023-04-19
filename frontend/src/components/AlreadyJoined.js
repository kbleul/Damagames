
import React from 'react'
import { useNavigate } from "react-router-dom";
import damaPeople from "../assets/dama-people.png"
import { Localization } from '../utils/language';
import { useAuth } from '../context/auth';


const AlreadyJoined = () => {
  const navigate = useNavigate();
  const { lang } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen space-y-2">
      <div className='border border-orange-color p-4 rounded-lg mb-8'>
        <img src={damaPeople} alt="" />
      </div>
      <h4 className='font-bold text-center text-white w-3/5 '>{Localization["someone has already"][lang]}</h4>
      <button
        onClick={() => navigate("/new-game")}
        className="mt-4 bg-orange-bg p-2 px-10 font-medium text-white rounded-sm"
      >
        {Localization["Create Game"][lang]}
      </button>
    </div>
  )
}

export default AlreadyJoined