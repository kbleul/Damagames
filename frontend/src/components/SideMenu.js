import React, { useState } from "react";
import { useAuth } from "../context/auth";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { BiMenu } from 'react-icons/bi';
import { CiMenuKebab } from 'react-icons/ci';
import Avatar from "../assets/Avatar.png"



const SideMenu = ({ isprofile }) => {
  const navigate = useNavigate();
  const { user, token, logout } = useAuth();
  const [showMenu, setShowMenu] = useState(false);

  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
  };

  const userLogOut = () => {
    handleLogout();
    logout();
    navigate("/create-game");
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

  const historyData = useQuery(
    ["historyDataApi"],
    async () =>
      await axios.get(`${process.env.REACT_APP_BACKEND_URL}match-history`, {
        headers,
      }),
    {
      keepPreviousData: true,
      refetchOnWindowFocus: false,
      retry: false,
      enabled: !!token,
    }
  );



  return (
    <>
      {user && token && <article className="md:w-4/5 md:ml-[10%] py-4 text-white w-full pb-2 rounded-bl-3xl" style={{
        background: `linear-gradient(90deg, #FF4C01 0%, rgba(0, 0, 0, 0) 139.19%)`
      }}>

        <section className="flex flex-col justify-end items-end">


          {showMenu &&
            <ul className="absolute right-0 top-12 bg-orange-color text-black font-bold z-10 ml-24 w-[50%] max-w-[10rem] border border-orange-color border-b-0 cursor-pointer">
              <li
                className=" py-2 w-full border-b border-black hover:border-black hover:bg-orange-color"
                onClick={() => {
                  setShowMenu(false);
                  navigate("/profile");
                }}
              >
                Profile
              </li>
              <li
                className="py-2 w-full border-b border-black hover:border-black hover:bg-orange-color"
                onClick={() => {
                  userLogOut();
                }}
              >
                Logout
              </li>
            </ul>
          }
        </section>
        {
          !isprofile && <>
            <article className="flex ">

              <section className="w-[96%] md:[90%] flex items-start justify-end ">
                <div className="w-14 h-14 md:w-16 md:h-16 border-2  border-black rounded-full flex items-center justify-center font-bold">
                  <img className="w-12 h-12 md:w-14 md:h-14  border rounded-full" src={user.profile_image ? user.profile_image : Avatar} alt="profile" />
                </div>
                <div className="border-b-2 border-black pb-2 w-4/5 md:[90%]">
                  <div className="flex justify-between items-center w-full">
                    <h5 className="text-left font-bold text-black text-base md:text-[1.2rem] ml-2">{user.username}</h5>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-xs text-left ml-2">Coins earned : {user.coin}</p>
                    <p className="text-xs mr-2">Games played - {historyData?.data?.data?.data?.played}</p>
                  </div>

                </div>
              </section>

              <div onClick={() => setShowMenu((prev) => !prev)} className="w-[4%] md:w-[10%] mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 32 32"><path fill="none" stroke="currentColor" stroke-width="2" d="M16 24a1 1 0 1 0 0-2a1 1 0 0 0 0 2Zm0-7a1 1 0 1 0 0-2a1 1 0 0 0 0 2Zm0-7a1 1 0 1 0 0-2a1 1 0 0 0 0 2Z" /></svg>
              </div>
            </article>

            <section className="w-[60%] ml-[20%] flex items-center justify-center font-bold">
              <div className="w-[33.33%] flex justify-center items-center gap-2 text-xs">
                <h5>Win - </h5>
                <p>{historyData?.data?.data?.data?.wins}</p>
              </div>
              <div className="w-[33.33%] flex justify-center items-center gap-2 text-xs">
                <h5>Draw - </h5>
                <p>{historyData?.data?.data?.data?.draw}</p>
              </div>
              <div className="w-[33.33%] flex justify-center items-center gap-2 text-xs">
                <h5>Loss - </h5>
                <p>{historyData?.data?.data?.data?.losses}</p>
              </div>
            </section>
          </>
        }

      </article>}

    </>
  );
};

export default SideMenu;
