
import React, { useState } from 'react'
import { useAuth } from "../context/auth";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import axios from "axios";



const SideMenu = () => {
  const navigate = useNavigate();
  const { user, token, logout } = useAuth();
  const [showMenu, setShowMenu] = useState(false)

  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
  };

  const userLogOut = () => {
    handleLogout();
    logout();
    navigate("/create-game")
  };

  const logOutMutation = useMutation(
    async (newData) =>
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}logout`, newData, {
        headers,
      }),
    {
      retry: false,
    }
  );

  const handleLogout = async (values) => {
    try {
      logOutMutation.mutate(
        {},
        {
          onSuccess: (responseData) => { },
          onError: (err) => { },
        }
      );
    } catch (err) { }
  };

  return (<>
    {user && token ? <div className="absolute top-0 flex flex-col justify-end items-end w-[90%] mt-[3vh] ml-[5%]">
      <button className='mb-4 border-2 border-orange-500 rounded-full p-[.1rem]' onClick={() => setShowMenu(prev => !prev)}>
        <svg width="27" height="26" viewBox="0 0 18 15" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1.271 13.346C1.271 13.346 3.5 10.5 9 10.5C14.5 10.5 16.73 13.346 16.73 13.346M9 7C9.79565 7 10.5587 6.68393 11.1213 6.12132C11.6839 5.55871 12 4.79565 12 4C12 3.20435 11.6839 2.44129 11.1213 1.87868C10.5587 1.31607 9.79565 1 9 1C8.20435 1 7.44128 1.31607 6.87868 1.87868C6.31607 2.44129 6 3.20435 6 4C6 4.79565 6.31607 5.55871 6.87868 6.12132C7.44128 6.68393 8.20435 7 9 7Z" stroke="#FF4C01" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>

      </button>

      {showMenu && <ul className="font-bold z-10 ml-24 w-[50%] max-w-[10rem] border border-orange-color border-b-0 text-orange-color cursor-pointer">
        <li className='text-orange-color hover:text-black py-2 w-full border-b border-orange-color hover:border-black hover:bg-orange-color'
          onClick={() => {
            setShowMenu(false);
            navigate("/profile")
          }}>Profile</li>
        <li className='text-orange-color hover:text-black py-2 w-full border-b border-orange-color hover:border-black hover:bg-orange-color'
          onClick={() => {
            userLogOut()
          }}>Logout</li>
      </ul>}
    </div> : <></>}
  </>
  )
}

export default SideMenu