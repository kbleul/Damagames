import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import ChangePassword from "./ChangePassword";
import ChangeUsername from "./ChangeUsername";

import { AiFillCamera } from "react-icons/ai";
import { FaUserAlt } from "react-icons/fa";


import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "../../context/auth";
import ChangeProfile from "./ChangeProfile";
import ForgotPassword from "./ForgotPassword";
import PlayerHistory from "../../Scoreboard/PlayerHistory";
import { Navigate, useNavigate } from "react-router-dom";
import SideMenu from "../SideMenu";

const Profile = () => {
  const [changePasswordModal, setChangePasswordModal] = useState(false);
  const [forgotPasswordModal, setForgotPasswordModal] = useState(false);
  const [changeProfileModal, setChangeProfileModal] = useState(false);
  const [changeUsernameModal, setChangeUsernameModal] = useState(false);

  const { user, token } = useAuth();
  const navigate = useNavigate();

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
    }
  );

  return (
    <article className="relative">
      <button
        className="z-10 bg-orange-color rounded-full w-8 h-8 flex justify-center items-center mr-2 mt-2 fixed top-0 left-2 md:left-4"
        onClick={() => navigate("/")}
      >
        <svg
          width="18"
          height="14"
          viewBox="0 0 18 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M0.396166 0.973833C0.500244 0.722555 0.676505 0.507786 0.902656 0.356693C1.12881 0.205599 1.39469 0.124969 1.66667 0.125H10.8333C12.6567 0.125 14.4054 0.849328 15.6947 2.13864C16.984 3.42795 17.7083 5.17664 17.7083 7C17.7083 8.82336 16.984 10.572 15.6947 11.8614C14.4054 13.1507 12.6567 13.875 10.8333 13.875H2.58333C2.21866 13.875 1.86892 13.7301 1.61106 13.4723C1.3532 13.2144 1.20833 12.8647 1.20833 12.5C1.20833 12.1353 1.3532 11.7856 1.61106 11.5277C1.86892 11.2699 2.21866 11.125 2.58333 11.125H10.8333C11.9274 11.125 12.9766 10.6904 13.7501 9.91682C14.5237 9.14323 14.9583 8.09402 14.9583 7C14.9583 5.90598 14.5237 4.85677 13.7501 4.08318C12.9766 3.3096 11.9274 2.875 10.8333 2.875H4.98592L5.84758 3.73667C6.09793 3.99611 6.23636 4.34351 6.23306 4.70403C6.22976 5.06455 6.08499 5.40935 5.82993 5.66417C5.57487 5.91898 5.22994 6.06343 4.86941 6.06639C4.50889 6.06935 4.16163 5.93059 3.90242 5.68L0.694083 2.47167C0.501936 2.27941 0.371084 2.03451 0.318058 1.76791C0.265033 1.50132 0.292214 1.22499 0.396166 0.973833Z"
            fill="#191921"
          />
        </svg>
      </button>
      <div className="">
        {/* <SideMenu isprofile={true} /> */}
        <div className="flex flex-col items-center space-y-2  ml-[5%]">
          <div className="flex items-center justify-end space-x-4">
            <div className="relative flex items-center justify-center">
              <img
                src={
                  user?.profile_image
                    ? user?.profile_image
                    : "https://t3.ftcdn.net/jpg/03/46/83/96/240_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg"
                }
                alt=""
                className="h-36 w-36 rounded-md object-cover"
              />
              <button
                onClick={() => setChangeProfileModal(true)}
                className="bg-orange-bg text-white absolute 
          bottom-0 w-full flex items-center justify-center space-x-2"
              >
                <AiFillCamera />
                <span className="whitespace-nowrap ">change profile</span>
              </button>
            </div>


          </div>
        </div>

        <ChangePassword
          changePasswordModal={changePasswordModal}
          setChangePasswordModal={setChangePasswordModal}
        />
        <ChangeProfile
          setChangeProfileModal={setChangeProfileModal}
          changeProfileModal={changeProfileModal}
        />
        <ForgotPassword
          setForgotPasswordModal={setForgotPasswordModal}
          forgotPasswordModal={forgotPasswordModal}
        />
        <ChangeUsername
          setChangeUsernameModal={setChangeUsernameModal}
          changeUsernameModal={changeUsernameModal}
          username={user?.username}
        />
      </div>

      {/* <PlayerHistory playerName={profileData?.data?.data?.data?.username} /> */}

      <article className="text-white mt-16 flex flex-col gap-y-16 items-center justify-center">
        <section className="flex w-3/5 ">
          <div className=" flex items-center justify-center gap-x-4 text-lg  w-[30%]">
            <FaUserAlt />
            <p>Username</p>
          </div>
          <div onClick={() => setChangeUsernameModal(true)} className="w-[70%] border-b"><p>{user.username}</p></div>
        </section>
        <section className="w-4/5 border ">
          <p>Password</p>
          <div onClick={() => setChangePasswordModal(true)}
            className="border border-orange-color text-orange-color text-xs flex items-center justify-center ">
            <p>*****************</p>
            <svg width="20" height="19" viewBox="0 0 20 19" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M13.2933 0.792726C13.6683 0.417784 14.1769 0.207153 14.7073 0.207153C15.2376 0.207153 15.7462 0.417784 16.1213 0.792726L18.7073 3.37873C19.0822 3.75378 19.2928 4.2624 19.2928 4.79273C19.2928 5.32305 19.0822 5.83167 18.7073 6.20673L17.1213 7.79273L11.7073 2.37873L13.2933 0.792726ZM10.2933 3.79273L1.29328 12.7927C0.918177 13.1677 0.707389 13.6763 0.707275 14.2067V16.7927C0.707275 17.3232 0.917989 17.8319 1.29306 18.2069C1.66813 18.582 2.17684 18.7927 2.70728 18.7927H5.29328C5.82367 18.7926 6.33229 18.5818 6.70728 18.2067L15.7073 9.20673L10.2933 3.79273Z" fill="#CCCCCC" />
            </svg>
          </div>
        </section>
      </article>

    </article>
  );
};

export default Profile;
