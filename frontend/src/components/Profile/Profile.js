import React, { useState } from "react";
import ChangePassword from "./ChangePassword";
import ChangeUsername from "./ChangeUsername";

import { AiFillCamera } from "react-icons/ai";
import ChangeBoard from "./changeSettings/ChangeBoard"
import ChangeCrown from "./changeSettings/ChangeCrown"
import { AiFillStar } from "react-icons/ai";
import { AiFillCheckCircle } from "react-icons/ai";


import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "../../context/auth";
import ChangeProfile from "./ChangeProfile";
import ForgotPassword from "./ForgotPassword";
import { Navigate, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

const Profile = () => {
  const [changePasswordModal, setChangePasswordModal] = useState(false);
  const [forgotPasswordModal, setForgotPasswordModal] = useState(false);
  const [changeProfileModal, setChangeProfileModal] = useState(false);
  const [changeUsernameModal, setChangeUsernameModal] = useState(false);

  const [myBoards, setMyBoards] = useState(null);
  const [myCrowns, setMyCrowns] = useState(null);

  const [selectedBoard, setSelectedBoard] = useState(null);
  const [selectedCrown, setSelectedCrown] = useState(null);
  const [showChangeBoardModal, setShowChangeBoardModal] = useState(false);
  const [showChangeCrownModal, setShowChangeCrownModal] = useState(false);

  const { user, token } = useAuth();
  const navigate = useNavigate();

  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
  };

  const myItemsFetch = useQuery(
    ["myItemsFetch"],
    async () =>
      await axios.get(`${process.env.REACT_APP_BACKEND_URL}my-items`, {
        headers,
      }),
    {
      keepPreviousData: true,
      refetchOnWindowFocus: false,
      retry: false,
      onSuccess: (res) => {
        setMyBoards([])
        setMyCrowns([])

        for (const [, value] of Object.entries(res.data.data.boards)) {
          setMyBoards(prev => [...prev, value])
        }
        for (const [, value] of Object.entries(res.data.data.crowns)) {
          setMyCrowns(prev => [...prev, value])
        }

      },
      onError: err => {
        toast(err.message)
      }
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
      <div className="mt-16">
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
                className="h-36 w-36 rounded-full object-cover"
              />
              <button
                onClick={() => setChangeProfileModal(true)}
                className="text-white absolute 
          bottom-0 right-0  flex items-center justify-center space-x-4 h-8"
              >
                <AiFillCamera size={20} />
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

      <article className="text-white mt-16 flex flex-col gap-y-4 items-center justify-center">
        <section className="w-[70%] md:max-w-[600px] ">
          {/* <p className="text-left text-sm mb-1">Username</p> */}

          <div onClick={() => setChangeUsernameModal(true)}
            className="relative w-full p-2 bg-orange-bg  cursor-pointer  border-gray-400/50 font-semibold text-white py-2 border rounded-md border-orange-colo  flex gap-2 items-center justify-center ">
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-md" />

            <p className="text-sm font-bold w-3/5">{user.username}</p>
            <svg width="14" height="15" viewBox="0 0 20 19" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M13.2933 0.792726C13.6683 0.417784 14.1769 0.207153 14.7073 0.207153C15.2376 0.207153 15.7462 0.417784 16.1213 0.792726L18.7073 3.37873C19.0822 3.75378 19.2928 4.2624 19.2928 4.79273C19.2928 5.32305 19.0822 5.83167 18.7073 6.20673L17.1213 7.79273L11.7073 2.37873L13.2933 0.792726ZM10.2933 3.79273L1.29328 12.7927C0.918177 13.1677 0.707389 13.6763 0.707275 14.2067V16.7927C0.707275 17.3232 0.917989 17.8319 1.29306 18.2069C1.66813 18.582 2.17684 18.7927 2.70728 18.7927H5.29328C5.82367 18.7926 6.33229 18.5818 6.70728 18.2067L15.7073 9.20673L10.2933 3.79273Z" fill="#CCCCCC" />
            </svg>
          </div>
        </section>
        <section className="w-[70%] md:max-w-[600px] ">
          {/* <p className="text-left text-sm mb-1">Password</p> */}
          <div onClick={() => setChangePasswordModal(true)}
            className="py-2 border rounded-md border-orange-color text-orange-color text-sm flex gap-2 items-center justify-center ">
            <p className="w-3/5">Change Password</p>
            <svg width="14" height="15" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M5.09077 9.6V5.6C5.09077 4.8646 5.23562 4.1364 5.51705 3.45697C5.79847 2.77755 6.21097 2.16021 6.73097 1.6402C7.25098 1.12019 7.86832 0.707701 8.54774 0.426275C9.22717 0.144848 9.95537 0 10.6908 0C11.4262 0 12.1544 0.144848 12.8338 0.426275C13.5132 0.707701 14.1306 1.12019 14.6506 1.6402C15.1706 2.16021 15.5831 2.77755 15.8645 3.45697C16.1459 4.1364 16.2908 4.8646 16.2908 5.6V9.6H18.6908C19.3273 9.6 19.9377 9.85286 20.3878 10.3029C20.8379 10.753 21.0908 11.3635 21.0908 12V12.88C21.995 13.0636 22.8079 13.5542 23.3919 14.2686C23.9758 14.983 24.2948 15.8773 24.2948 16.8C24.2948 17.7227 23.9758 18.617 23.3919 19.3314C22.8079 20.0458 21.995 20.5364 21.0908 20.72V21.6C21.0908 22.2365 20.8379 22.847 20.3878 23.2971C19.9377 23.7471 19.3273 24 18.6908 24H2.69077C2.05425 24 1.4438 23.7471 0.993715 23.2971C0.543628 22.847 0.290771 22.2365 0.290771 21.6L0.290771 12C0.290771 11.3635 0.543628 10.753 0.993715 10.3029C1.4438 9.85286 2.05425 9.6 2.69077 9.6H5.09077ZM6.69077 5.6C6.69077 4.53913 7.1122 3.52172 7.86234 2.77157C8.61249 2.02143 9.6299 1.6 10.6908 1.6C11.7516 1.6 12.7691 2.02143 13.5192 2.77157C14.2693 3.52172 14.6908 4.53913 14.6908 5.6V9.6H6.69077V5.6ZM13.8908 14.4C13.2542 14.4 12.6438 14.6529 12.1937 15.1029C11.7436 15.553 11.4908 16.1635 11.4908 16.8C11.4908 17.4365 11.7436 18.047 12.1937 18.4971C12.6438 18.9471 13.2542 19.2 13.8908 19.2H20.2908C20.9273 19.2 21.5377 18.9471 21.9878 18.4971C22.4379 18.047 22.6908 17.4365 22.6908 16.8C22.6908 16.1635 22.4379 15.553 21.9878 15.1029C21.5377 14.6529 20.9273 14.4 20.2908 14.4H13.8908Z" fill="white" />
            </svg>

          </div>

        </section>

        <section className="w-[70%] md:max-w-[600px] ">

          <div
            className="py-2 border rounded-md border-orange-color text-orange-color text-sm flex gap-2 items-center justify-center ">
            <p>+{user.phone}</p>
          </div>
        </section>


      </article>

      {myBoards && <article className="mt-16 mb-2 border-2 rounded-3xl mx-2 md:w-1/2 md:ml-[25%]" style={{
        background: `linear-gradient(90deg, #FF4C01 0%, rgba(0, 0, 0, 0) 139.19%)`
      }}>
        <h2 className="text-black font-extrabold">My Boards</h2>

        {myBoards?.length === 0 ?
          <div className="text-white py-4">
            <p>You don't have any boards yet.</p>
            <p>Go to the store to buy one</p>
            <button className="bg-white text-black font-bold px-8 py-2 rounded-3xl mt-2 cursor-pointer"
              onClick={() => navigate("/store")}>Store</button>
          </div> :
          <section className="flex overflow-x-scroll text-white">
            {myBoards?.map(board => (
              <div onClick={() => {
                user.default_board !== board.item && setSelectedBoard(board)
                user.default_board !== board.item && setShowChangeBoardModal(true)
              }}
                className="flex-shrink-0 w-1/2 flex flex-col items-center justify-center pb-3" id={board.id}>
                <h2 className="text-center">{board.name}</h2>
                <div className="relative max-h-[30vh] w-[70%]">
                  <img className="" src={board.item} alt="" />
                  {user.default_board === board.item &&
                    <AiFillCheckCircle size={30} className="absolute bottom-0 right-0 text-green-400" />
                  }
                </div>

              </div>
            ))}
          </section>}
      </article>
      }
      {myCrowns && <article className="mt-16 mb-2 border-2 rounded-3xl mx-2 md:w-1/2 md:ml-[25%]" style={{
        background: `linear-gradient(90deg, #FF4C01 0%, rgba(0, 0, 0, 0) 139.19%)`
      }}>
        <h2 className="text-black font-extrabold">My Crowns</h2>

        {myCrowns?.length === 0 ?
          <div className="text-white py-4">
            <p>You don't have any crowns yet.</p>
            <p>Go to the store to buy one</p>
            <button className="bg-white text-black font-bold px-8 py-2 rounded-3xl mt-2 cursor-pointer"
              onClick={() => navigate("/store")}>Store</button>
          </div> :
          <section className="flex overflow-x-scroll text-white">
            {myCrowns?.map(crown => (
              <div onClick={() => {
                user.default_crown !== crown.item && setSelectedCrown(crown)
                user.default_crown !== crown.item && setShowChangeCrownModal(true)
              }}
                className="flex-shrink-0 w-1/2 flex flex-col items-center justify-center pb-3" id={crown.id}>
                <h2 className="text-center">{crown.name}</h2>
                <div className="relative max-h-[30vh] w-[70%]">
                  <img className="" src={crown.item} alt="" />
                  {user.default_crown === crown.item &&
                    <AiFillCheckCircle size={30} className="absolute bottom-0 right-0  text-green-400" />
                  }
                </div>
              </div>
            ))}
          </section>}
      </article>}

      <ChangeBoard board={selectedBoard} showChangeBoardModal={showChangeBoardModal} setShowChangeBoardModal={setShowChangeBoardModal} />
      <ChangeCrown crown={selectedCrown} showChangeCrownModal={showChangeCrownModal} setShowChangeCrownModal={setShowChangeCrownModal} />

    </article>
  );
};

export default Profile;
