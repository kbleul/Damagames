import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import ChangePassword from "./ChangePassword";
import { AiFillCamera } from "react-icons/ai";
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
    <article className="">
      <div className="h-[40vh]">
        <SideMenu />
        <div className="flex flex-col items-center space-y-2 pt-24 ml-[5%]">
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

            <button
              className="bg-orange-bg p-1 rounded-md self-end"
              onClick={() => setChangePasswordModal(true)}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M3.88574 7.20002V4.27938C3.88574 3.74242 3.9915 3.21072 4.19699 2.71463C4.40248 2.21854 4.70366 1.76779 5.08335 1.3881C5.46304 1.00841 5.91379 0.707225 6.40988 0.501739C6.90597 0.296253 7.43767 0.190491 7.97463 0.190491C8.51159 0.190491 9.04329 0.296253 9.53938 0.501739C10.0355 0.707225 10.4862 1.00841 10.8659 1.3881C11.2456 1.76779 11.5468 2.21854 11.7523 2.71463C11.9578 3.21072 12.0635 3.74242 12.0635 4.27938V7.20002H13.8159C14.2807 7.20002 14.7264 7.38464 15.055 7.71327C15.3837 8.04191 15.5683 8.48764 15.5683 8.9524V9.59494C16.2285 9.729 16.8221 10.0872 17.2484 10.6088C17.6748 11.1305 17.9077 11.7835 17.9077 12.4572C17.9077 13.1309 17.6748 13.7839 17.2484 14.3055C16.8221 14.8271 16.2285 15.1853 15.5683 15.3194V15.9619C15.5683 16.4267 15.3837 16.8724 15.055 17.201C14.7264 17.5297 14.2807 17.7143 13.8159 17.7143H2.13336C1.6686 17.7143 1.22288 17.5297 0.894242 17.201C0.565607 16.8724 0.380981 16.4267 0.380981 15.9619L0.380981 8.9524C0.380981 8.48764 0.565607 8.04191 0.894242 7.71327C1.22288 7.38464 1.6686 7.20002 2.13336 7.20002H3.88574ZM5.054 4.27938C5.054 3.50478 5.36171 2.7619 5.90943 2.21418C6.45716 1.66645 7.20003 1.35874 7.97463 1.35874C8.74923 1.35874 9.49211 1.66645 10.0398 2.21418C10.5876 2.7619 10.8953 3.50478 10.8953 4.27938V7.20002H5.054V4.27938ZM10.3111 10.7048C9.84638 10.7048 9.40065 10.8894 9.07202 11.218C8.74338 11.5467 8.55876 11.9924 8.55876 12.4572C8.55876 12.9219 8.74338 13.3676 9.07202 13.6963C9.40065 14.0249 9.84638 14.2095 10.3111 14.2095H14.9842C15.4489 14.2095 15.8946 14.0249 16.2233 13.6963C16.5519 13.3676 16.7365 12.9219 16.7365 12.4572C16.7365 11.9924 16.5519 11.5467 16.2233 11.218C15.8946 10.8894 15.4489 10.7048 14.9842 10.7048H10.3111Z"
                  fill="#191921"
                />
              </svg>
            </button>
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
      </div>

      <PlayerHistory playerName={profileData?.data?.data?.data?.username} />
      <p
        onClick={() => navigate("/")}
        className="text-orange-color font-medium text-center"
      >
        Back to home
      </p>
    </article>
  );
};

export default Profile;
