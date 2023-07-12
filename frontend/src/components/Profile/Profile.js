import React, { useEffect, useState } from "react";
import ChangePassword from "./ChangePassword";
import ChangeUsername from "./ChangeUsername";

import { AiFillCamera } from "react-icons/ai";
import ChangeBoard from "./changeSettings/ChangeBoard";
import ChangeCrown from "./changeSettings/ChangeCrown";
import { AiFillCheckCircle } from "react-icons/ai";
import { BsFillCaretDownFill, BsFillCaretUpFill } from "react-icons/bs";


import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "../../context/auth";
import ChangeProfile from "./ChangeProfile";
import ForgotPassword from "./ForgotPassword";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Localization } from "../../utils/language";
import { LANG } from "../../utils/data"
import { assignBadgeToUser } from "../../utils/utilFunc";


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
  const [showLangMenu, setShowLangMenu] = useState(false);

  const [badgeData, setBadgeData] = useState(null);

  const { user, token, lang, setLanguage } = useAuth();
  const navigate = useNavigate();


  const LANGs = { "AMH": "amharic", "ENG": "english" }

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
        setMyBoards([]);
        setMyCrowns([]);

        for (const [, value] of Object.entries(res.data.data.boards)) {
          setMyBoards((prev) => [...prev, value]);
        }
        for (const [, value] of Object.entries(res.data.data.crowns)) {
          setMyCrowns((prev) => [...prev, value]);
        }
      },
      onError: (err) => {
        toast(err.message);
      },
    }
  );

  const getAllBadges = useQuery(
    ["getAllBadgesApi"],
    async () =>
      await axios.get(`${process.env.REACT_APP_BACKEND_URL}get-badges`, {
        headers,
      }),
    {
      keepPreviousData: true,
      refetchOnWindowFocus: false,
      retry: false,
      onSuccess: (res) => {
        let tempArr = res.data.data.reverse()

        let data = assignBadgeToUser(user.game_point, tempArr)

        let badge = res.data.data.find(item => item.id === data.id)
        setBadgeData(badge)

        tempArr = data = badge = []

      },
      enabled: !myItemsFetch.isLoading
    }
  );


  const langMutation = useMutation(
    async (newData) =>
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}update-language`,
        newData,
        {
          headers,
        }
      ),
    {
      retry: false,
    }
  );

  const langMutationSubmitHandler = async (values) => {
    try {
      langMutation.mutate(
        { language: values },
        {
          onSuccess: (responseData) => {

          },
          onError: (err) => { },
        }
      );
    } catch (err) { }
  };



  const saveLang = (pref) => {
    setLanguage(pref);
    langMutationSubmitHandler(pref)
  }


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
        <div className="flex flex-col items-center space-y-2">
          <div className="flex items-center justify-end">
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

      <article className="text-white mt-4 flex flex-col gap-y-4 items-center justify-center">

        {badgeData && <section className="w-1/2 md:max-w-[600px] mb-12 mt-2 flex flex-col items-center justify-center">

          <div className=''>
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 32 32" fill="red"><path fill={badgeData?.color} d="m23 2l1.593 3L28 5.414l-2.5 2.253L26 11l-3-1.875L20 11l.5-3.333L18 5.414L21.5 5L23 2z" /><path fill={badgeData?.color} d="m22.717 13.249l-1.938-.498a6.994 6.994 0 1 1-5.028-8.531l.499-1.937A8.99 8.99 0 0 0 8 17.69V30l6-4l6 4V17.708a8.963 8.963 0 0 0 2.717-4.459ZM18 26.263l-4-2.667l-4 2.667V19.05a8.924 8.924 0 0 0 8 .006Z" /></svg>
          </div>
          <p className=" font-mono uppercase tracking-widest">{badgeData.name[LANGs[lang]]}</p>

        </section>}


        <section className="w-[70%] md:max-w-[600px] ">

          <div
            onClick={() => setChangeUsernameModal(true)}
            className="relative w-full p-2 bg-orange-bg  cursor-pointer  border-gray-400/50 font-semibold text-white py-2 border rounded-md border-orange-colo  flex gap-2 items-center justify-center "
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-md" />

            <p className="text-sm font-bold w-3/5">{user.username}</p>
            <svg
              width="14"
              height="15"
              viewBox="0 0 20 19"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M13.2933 0.792726C13.6683 0.417784 14.1769 0.207153 14.7073 0.207153C15.2376 0.207153 15.7462 0.417784 16.1213 0.792726L18.7073 3.37873C19.0822 3.75378 19.2928 4.2624 19.2928 4.79273C19.2928 5.32305 19.0822 5.83167 18.7073 6.20673L17.1213 7.79273L11.7073 2.37873L13.2933 0.792726ZM10.2933 3.79273L1.29328 12.7927C0.918177 13.1677 0.707389 13.6763 0.707275 14.2067V16.7927C0.707275 17.3232 0.917989 17.8319 1.29306 18.2069C1.66813 18.582 2.17684 18.7927 2.70728 18.7927H5.29328C5.82367 18.7926 6.33229 18.5818 6.70728 18.2067L15.7073 9.20673L10.2933 3.79273Z"
                fill="#CCCCCC"
              />
            </svg>
          </div>
        </section>
        <section className="w-[70%] md:max-w-[600px] ">
          <div
            onClick={() => setChangePasswordModal(true)}
            className="py-2 border rounded-md border-orange-color text-orange-color text-sm flex gap-2 items-center justify-center "
          >
            <p className="w-3/5">
              {Localization["Change Password"][lang]}
            </p>
            <svg
              width="14"
              height="15"
              viewBox="0 0 25 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M5.09077 9.6V5.6C5.09077 4.8646 5.23562 4.1364 5.51705 3.45697C5.79847 2.77755 6.21097 2.16021 6.73097 1.6402C7.25098 1.12019 7.86832 0.707701 8.54774 0.426275C9.22717 0.144848 9.95537 0 10.6908 0C11.4262 0 12.1544 0.144848 12.8338 0.426275C13.5132 0.707701 14.1306 1.12019 14.6506 1.6402C15.1706 2.16021 15.5831 2.77755 15.8645 3.45697C16.1459 4.1364 16.2908 4.8646 16.2908 5.6V9.6H18.6908C19.3273 9.6 19.9377 9.85286 20.3878 10.3029C20.8379 10.753 21.0908 11.3635 21.0908 12V12.88C21.995 13.0636 22.8079 13.5542 23.3919 14.2686C23.9758 14.983 24.2948 15.8773 24.2948 16.8C24.2948 17.7227 23.9758 18.617 23.3919 19.3314C22.8079 20.0458 21.995 20.5364 21.0908 20.72V21.6C21.0908 22.2365 20.8379 22.847 20.3878 23.2971C19.9377 23.7471 19.3273 24 18.6908 24H2.69077C2.05425 24 1.4438 23.7471 0.993715 23.2971C0.543628 22.847 0.290771 22.2365 0.290771 21.6L0.290771 12C0.290771 11.3635 0.543628 10.753 0.993715 10.3029C1.4438 9.85286 2.05425 9.6 2.69077 9.6H5.09077ZM6.69077 5.6C6.69077 4.53913 7.1122 3.52172 7.86234 2.77157C8.61249 2.02143 9.6299 1.6 10.6908 1.6C11.7516 1.6 12.7691 2.02143 13.5192 2.77157C14.2693 3.52172 14.6908 4.53913 14.6908 5.6V9.6H6.69077V5.6ZM13.8908 14.4C13.2542 14.4 12.6438 14.6529 12.1937 15.1029C11.7436 15.553 11.4908 16.1635 11.4908 16.8C11.4908 17.4365 11.7436 18.047 12.1937 18.4971C12.6438 18.9471 13.2542 19.2 13.8908 19.2H20.2908C20.9273 19.2 21.5377 18.9471 21.9878 18.4971C22.4379 18.047 22.6908 17.4365 22.6908 16.8C22.6908 16.1635 22.4379 15.553 21.9878 15.1029C21.5377 14.6529 20.9273 14.4 20.2908 14.4H13.8908Z"
                fill="white"
              />
            </svg>
          </div>
        </section>

        <section className="w-[70%] md:max-w-[600px] ">
          <div className="py-2 border rounded-md border-orange-color text-orange-color text-sm flex gap-2 items-center justify-center ">
            <p>+{user.phone}</p>
          </div>
        </section>

        <div className="flex flex-col w-1/2 text-white w-[70%] md:max-w-[600px]">

          <button className="py-2 border rounded-md border-orange-color text-orange-color text-sm flex gap-2 items-center justify-center "
            onClick={() => setShowLangMenu(prev => !prev)}>{LANG[lang]}
            {showLangMenu ? <BsFillCaretUpFill /> : <BsFillCaretDownFill />}
          </button>

          {showLangMenu && <ul className="w-full text-sm text-orange-color border-b border-orange-color border-b-0 mt-1">
            {Object.keys(LANG).filter(tempL => tempL !== lang).map(tempL =>
              (<li onClick={() => saveLang(tempL)} className="cursor-pointer hover:border-b-orange-400 py-2 border-b rounded-md border-orange-color text-orange-color text-sm flex gap-2 items-center justify-center ">{LANG[tempL]}</li>))}
          </ul>}


        </div>
      </article>


      {user && user.seasons && user.seasons.length > 0 && <article
        className="mt-16 mb-2 rounded-3xl mx-2 md:w-1/2 md:ml-[25%] h-[15vh]"
        style={{
          background: `linear-gradient(180deg, #FF4C01 0%, rgba(0, 0, 0, 0) 139.19%)`,
        }}
      >

        <h3 className="w-full text-white text-2xl text-center font-bold pt-4">Leagues joined</h3>

        <section className="flex gap-x-8 text-white overflow-x-scroll px-2 h-[60%]">
          {user.seasons.map(season => (
            <div className="flex items-center justify-center text-xl gap-x-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 10 12" fill="none">
                <mask id="mask0_3490_6881" maskUnits="userSpaceOnUse" x="0" y="0" width="10" height="12">
                  <path d="M9.47404 0.0795288H0.526367V11.302H9.47404V0.0795288Z" fill="white" />
                </mask>
                <g mask="url(#mask0_3490_6881)">
                  <path d="M0.389044 10.6894C0.589229 10.7076 0.61046 10.5999 0.60591 10.427C0.593777 9.84012 0.604394 9.2517 0.599845 8.66479C0.599845 8.5647 0.611976 8.48736 0.719651 8.45399C0.746949 8.44489 0.792447 8.42518 0.793963 8.4085C0.810645 8.12793 1.02448 8.25077 1.164 8.22803C1.23831 8.21589 1.31717 8.22651 1.43547 8.22651C1.06391 7.80794 1.12912 7.39999 1.35812 6.97839C1.51584 6.68872 1.74181 6.46731 2.01176 6.28532C2.28019 6.10637 2.56682 5.96381 2.86861 5.85159C3.42367 5.64534 3.97873 5.4406 4.5353 5.23435C4.52165 5.36326 4.55047 5.48761 4.57473 5.61045C4.67331 6.10788 5.13131 6.46882 5.66362 6.47186C6.18076 6.47489 6.64938 6.12457 6.73885 5.6514C6.80862 5.2844 6.67061 4.97502 6.38247 4.75663C6.13982 4.57161 5.85319 4.55948 5.58021 4.71417C5.37699 4.82943 5.23595 4.9917 5.2223 5.24345C5.21017 5.48003 5.28145 5.67263 5.4877 5.80002C5.78039 5.98049 6.16105 5.82732 6.17167 5.52704C6.17621 5.4133 6.14892 5.31018 6.01243 5.31321C5.87745 5.31624 5.86532 5.41634 5.89565 5.52249C5.91537 5.59226 5.89262 5.63775 5.83651 5.67567C5.78191 5.71206 5.73338 5.69386 5.68333 5.66657C5.54988 5.59226 5.48163 5.39359 5.53623 5.23587C5.60144 5.04933 5.79556 4.92649 5.98968 4.94772C6.20958 4.9735 6.4037 5.17065 6.42645 5.39359C6.45678 5.68325 6.33697 5.93955 6.11555 6.05935C5.8456 6.20494 5.46798 6.164 5.24657 5.96836C4.97055 5.7242 4.90382 5.41179 4.94022 5.06298C4.99785 5.02203 4.97814 4.96289 4.9751 4.90829C5.09188 4.77332 5.18894 4.62469 5.33908 4.5155C5.83499 4.15456 6.71611 4.45332 6.90719 5.03416C7.02397 5.38904 6.93601 5.6969 6.80103 6.01082C6.77677 6.06845 6.71004 6.15186 6.77525 6.18826C6.84805 6.23072 6.91629 6.15035 6.96027 6.08665C7.08615 5.9077 7.16804 5.71358 7.20899 5.4952C7.3288 4.87038 6.84956 4.15456 6.22778 4.03172C5.88352 3.96348 5.55898 4.01201 5.2405 4.14243C5.28448 4.09238 5.32998 4.04385 5.37244 3.99381C5.39064 3.97106 5.42249 3.92708 5.41794 3.92253C5.1859 3.68898 5.58173 3.71628 5.53623 3.54794C5.35879 3.48728 5.43917 3.41145 5.56201 3.31439C5.65452 3.24008 5.78039 3.16729 5.70608 3.0035C5.68333 2.95345 5.72883 2.90947 5.76068 2.87762C5.86532 2.77601 5.89262 2.64711 5.88504 2.51213C5.87745 2.37261 5.88049 2.24825 5.96541 2.12086C6.03063 2.0238 5.98058 1.89945 5.9366 1.79025C5.87745 1.64467 5.89717 1.53244 6.07006 1.48543C6.111 1.47481 6.14437 1.43993 6.18531 1.43386C6.40673 1.39747 6.5144 1.25794 6.53715 1.04108C6.55687 1.05018 6.57355 1.05473 6.57355 1.05928C6.5781 1.32619 6.73734 1.40808 6.97847 1.446C7.21657 1.48391 7.21505 1.50666 7.13013 1.71746C7.08918 1.81907 7.09525 1.92674 7.12861 2.02077C7.19382 2.20579 7.2105 2.39839 7.24842 2.58796C7.29695 2.82758 7.2833 3.07933 7.27268 3.31439C7.2651 3.47363 7.28026 3.61922 7.31515 3.76026C7.37126 3.98774 7.27723 4.21371 7.33183 4.43816C7.38642 4.65957 7.26965 4.90526 7.41979 5.11606C7.28027 5.28591 7.46074 5.47245 7.39704 5.63169C7.36519 5.71055 7.39704 5.73026 7.42737 5.75908C7.7413 6.06845 8.05977 6.3748 8.37522 6.68417C8.43436 6.7418 8.50564 6.77062 8.58298 6.78882C8.67095 6.81005 8.76649 6.82521 8.78165 6.94199C8.78317 6.95412 8.78772 6.97232 8.7953 6.97384C9.09861 7.03601 8.98487 7.28625 9.01975 7.46975C9.00155 7.60472 8.83018 7.64264 8.82412 7.78368C8.79379 7.78368 8.76497 7.78823 8.75132 7.82007C8.6755 7.88983 8.62545 7.8777 8.55265 7.79429C8.43588 7.66083 8.31759 7.52283 8.15228 7.44094C8.22811 7.59562 8.36157 7.69875 8.47683 7.81552C8.54052 7.87922 8.58298 7.94291 8.5663 8.03694C8.41768 8.08244 8.29787 8.15675 8.27664 8.32812C8.1265 8.3721 8.00821 8.44793 7.98546 8.6193C7.83532 8.66328 7.71703 8.7391 7.69428 8.91048C7.61846 8.91957 7.55931 8.95901 7.50623 9.01057C7.22415 9.28961 6.94056 9.56714 6.67213 9.85681C6.26872 10.2921 5.83651 10.697 5.42704 11.1262C5.38912 11.1671 5.32846 11.1944 5.32239 11.2627C5.40277 11.2884 5.4331 11.2247 5.47253 11.1853C5.59841 11.0625 5.72428 10.9411 5.84409 10.8122C5.90778 10.744 5.95025 10.7379 6.01546 10.8122C6.14133 10.9502 6.27782 11.0807 6.40825 11.2156C6.43706 11.246 6.46284 11.299 6.50531 11.2566C6.54929 11.2126 6.48862 11.1823 6.46436 11.1565C6.35972 11.0473 6.25811 10.9336 6.14285 10.8365C6.01091 10.7258 6.00484 10.6454 6.13678 10.5195C6.52502 10.1465 6.90719 9.76581 7.27875 9.37606C7.42282 9.22592 7.60177 9.10763 7.6958 8.91351C7.82926 8.85285 7.92632 8.75579 7.98698 8.62233C8.12044 8.56167 8.2175 8.46461 8.27816 8.33115C8.41162 8.27049 8.50716 8.17343 8.56934 8.03997C8.63 7.99448 8.67853 8.01268 8.72554 8.06575C8.76042 8.1067 8.79682 8.14917 8.859 8.14765C8.89085 8.3084 9.02127 8.3721 9.15018 8.43731C9.16231 8.51769 9.18506 8.58745 9.28515 8.58442C9.28818 9.21985 9.30183 9.85377 9.28818 10.4892C9.28363 10.7091 9.41102 10.6636 9.53538 10.6818C9.71282 10.7076 9.69462 10.5999 9.69462 10.4862C9.6931 9.36089 9.69462 8.23713 9.69462 7.11184C9.69462 7.04511 9.69917 6.9799 9.7022 6.91317C10.0374 6.68114 10.2785 6.35053 10.5757 6.07907C10.5939 6.06239 10.6046 6.03509 10.5757 6.01689C10.5378 5.99263 10.5045 6.01386 10.4787 6.03964C10.3392 6.18068 10.2057 6.33082 10.0601 6.46427C9.93879 6.5765 9.84628 6.71754 9.69765 6.80095C9.69614 5.40269 9.69462 4.00291 9.69159 2.60464C9.69159 2.48787 9.75073 2.39536 9.81443 2.30892C10.192 1.79177 10.7395 1.57187 11.337 1.43993C11.4083 1.42476 11.4341 1.46874 11.4644 1.51576C11.7738 1.99196 12.0832 2.46967 12.3956 2.94435C12.4426 3.01563 12.4441 3.09146 12.4441 3.17032C12.4441 5.03568 12.4487 6.90104 12.4426 8.7664C12.4426 8.94536 12.4911 8.97265 12.6458 8.92412C12.7611 8.88924 12.8824 8.87711 13.0007 8.85436C12.9886 8.89834 12.978 8.94232 12.9658 8.9863C12.799 9.03787 12.7141 9.17132 12.6383 9.31388C12.4987 9.36847 12.4017 9.46402 12.3471 9.60506C12.2076 9.65965 12.1105 9.7552 12.0559 9.89624C11.9164 9.95083 11.8193 10.0464 11.7647 10.1874C11.6252 10.242 11.5281 10.3376 11.4735 10.4786C11.334 10.5332 11.237 10.6287 11.1824 10.7698C11.0428 10.8244 10.9458 10.9199 10.8912 11.061C10.7638 11.1049 10.6773 11.1883 10.6379 11.3188C10.5773 11.3218 10.5181 11.3294 10.4574 11.3294C6.95269 11.3294 3.44793 11.3309 -0.0583393 11.3309C-0.0947366 11.3309 -0.129618 11.3248 -0.166016 11.3218C-0.126585 11.2369 -0.0446916 11.1899 0.0114209 11.1201C0.106964 11.0003 0.261653 10.9305 0.310182 10.7683C0.360229 10.7683 0.381462 10.741 0.382978 10.6939L0.389044 10.6894ZM3.66177 8.40091C3.66177 8.45551 3.69665 8.48887 3.73153 8.52224C4.18953 8.98024 4.64753 9.43824 5.10553 9.89472C5.14041 9.92808 5.17226 9.98723 5.24505 9.93718C5.22837 9.91595 5.21624 9.89624 5.19955 9.88107C4.7552 9.4352 4.31085 8.98934 3.86347 8.5465C3.80432 8.48887 3.74821 8.42518 3.6648 8.39788C3.63144 8.25684 3.50556 8.1886 3.41305 8.09912C3.29931 7.98841 3.20073 7.89135 3.34329 7.7397C3.61627 7.78064 3.77399 7.93533 3.81039 8.19921C3.81949 8.25836 3.81039 8.31447 3.90897 8.31144C4.57928 8.28869 5.2496 8.27201 5.92143 8.25836C6.01243 8.25684 6.03366 8.22044 6.02759 8.13703C6.00181 7.76396 5.97755 7.38937 5.95783 7.0163C5.95176 6.91166 5.91537 6.86768 5.80921 6.83128C5.34059 6.66901 4.86591 6.73119 4.38971 6.76152C4.34422 6.76455 4.30934 6.78275 4.27749 6.81308C3.98934 7.08909 3.67845 7.33933 3.36604 7.58652C3.29628 7.64112 3.30689 7.68358 3.34177 7.74121C3.19619 7.84737 3.08699 7.80491 2.98083 7.66993C2.89894 7.56529 2.79581 7.48037 2.70179 7.38634C2.65478 7.33933 2.60776 7.28776 2.54255 7.31809C2.68207 7.46368 2.81401 7.61989 2.96719 7.75486C3.10216 7.87467 3.08699 7.95201 2.96415 8.07334C2.3818 8.64508 1.80702 9.2244 1.23073 9.80373C1.1913 9.84316 1.12002 9.87349 1.14732 9.9842C1.21102 9.92353 1.25954 9.88107 1.30504 9.83557C1.88285 9.25777 2.46217 8.68299 3.03391 8.10215C3.14159 7.99296 3.20832 7.99599 3.31296 8.10215C3.42063 8.21134 3.50253 8.35542 3.66328 8.40546L3.66177 8.40091ZM2.80491 6.45821C2.38483 6.62048 1.97839 6.73574 1.70845 7.07241C1.39907 7.45762 1.48248 7.88832 1.90105 8.14613C1.9056 7.92927 1.97688 7.76396 2.20891 7.7215C2.2635 7.71088 2.28777 7.65174 2.31052 7.60017C2.46824 7.23468 2.62748 6.86768 2.80491 6.45821ZM7.45164 8.26594C7.64778 8.25987 7.74888 8.15978 7.75495 7.96566C7.75798 7.87467 7.7595 7.78368 7.76101 7.6942C7.76101 7.60472 7.74736 7.51525 7.87779 7.48795C7.96727 7.46823 7.94907 7.37269 7.95665 7.30293C7.96575 7.22407 7.8975 7.22255 7.84897 7.20739C7.7049 7.16189 7.55931 7.12094 7.41524 7.07545C6.87535 6.90559 6.81923 6.9526 6.82985 7.52586C6.83288 7.65629 6.8617 7.73818 7.00122 7.7397C7.18321 7.74273 7.27117 7.84131 7.29998 8.00964C7.30908 8.06272 7.33334 8.1158 7.33334 8.16888C7.33334 8.26291 7.37884 8.28414 7.45315 8.26594H7.45164Z" fill="white" />
                  <path d="M4.94024 5.06291C4.90384 5.41171 4.97057 5.72412 5.24659 5.96829C5.468 6.16392 5.84562 6.20487 6.11557 6.05928C6.3385 5.93947 6.45831 5.68318 6.42647 5.39351C6.4022 5.1721 6.20808 4.97343 5.9897 4.94765C5.79558 4.9249 5.60146 5.04926 5.53625 5.23579C5.48165 5.39351 5.5499 5.59218 5.68335 5.66649C5.7334 5.69379 5.78193 5.71199 5.83653 5.67559C5.89264 5.63768 5.9169 5.59218 5.89567 5.52242C5.86534 5.41626 5.87747 5.31769 6.01245 5.31314C6.14894 5.3101 6.17623 5.41323 6.17169 5.52697C6.15955 5.82725 5.78041 5.98042 5.48772 5.79995C5.28147 5.67256 5.21019 5.47996 5.22232 5.24338C5.23597 4.99163 5.37701 4.82936 5.58023 4.7141C5.85321 4.55941 6.13984 4.57154 6.38249 4.75656C6.66911 4.97495 6.80864 5.28432 6.73887 5.65133C6.6494 6.12601 6.17927 6.47633 5.66364 6.47179C5.13133 6.46875 4.67485 6.10933 4.57475 5.61038C4.55049 5.48602 4.52016 5.36167 4.53532 5.23428C4.66726 5.1721 4.79617 5.09779 4.94024 5.06291Z" fill="white" />
                  <path d="M5.24106 4.14241C5.55954 4.01199 5.88408 3.96497 6.22834 4.0317C6.85012 4.15454 7.32935 4.87035 7.20955 5.49518C7.16708 5.71508 7.08671 5.90768 6.96083 6.08663C6.91534 6.15033 6.84861 6.2307 6.77581 6.18824C6.70908 6.15033 6.77581 6.06843 6.80159 6.0108C6.93808 5.69536 7.02453 5.3875 6.90775 5.03414C6.71667 4.4533 5.83555 4.15454 5.33964 4.51548C5.18798 4.62467 5.09244 4.7733 4.97566 4.90827C4.88164 4.81273 4.8968 4.73841 5.01054 4.66714C5.07424 4.62619 5.1258 4.56401 5.1804 4.50942C5.20618 4.48363 5.23196 4.44724 5.1895 4.41994C4.95595 4.27738 5.18646 4.22734 5.24258 4.14241H5.24106ZM5.25319 4.40781C5.25319 4.40781 5.23954 4.41994 5.23196 4.426C5.24106 4.42904 5.25016 4.4351 5.25926 4.43662C5.26229 4.43662 5.26836 4.43055 5.27139 4.42752C5.26532 4.42146 5.25926 4.41539 5.25319 4.40932V4.40781Z" fill="white" />
                  <path d="M9.1086 7.56525C9.14197 7.75633 9.11315 7.94893 9.12377 8.14154C9.1268 8.18552 9.10254 8.25831 9.1723 8.25679C9.35732 8.25528 9.28301 8.38267 9.29059 8.47215C9.24358 8.46001 9.19808 8.4494 9.15107 8.43727C9.11012 8.28409 8.99486 8.20523 8.85989 8.14609C8.85989 8.02476 8.64302 7.97623 8.7507 7.81851C8.78254 7.82003 8.80832 7.81244 8.82349 7.78211C8.94936 7.75178 8.99941 7.61984 9.10709 7.56525H9.1086Z" fill="white" />
                  <path d="M9.10879 7.56526C9.00111 7.61986 8.95107 7.7518 8.8252 7.78213C8.83126 7.64109 9.00415 7.60317 9.02083 7.4682C9.05116 7.49853 9.09666 7.51673 9.10879 7.56526Z" fill="white" />
                  <path d="M9.1543 8.43732C9.20131 8.44945 9.24681 8.46007 9.29382 8.4722C9.29382 8.51011 9.29079 8.54651 9.29079 8.58442C9.19069 8.58594 9.16795 8.51618 9.15581 8.43732H9.1543Z" fill="white" />
                  <path d="M3.34169 7.73968C3.19914 7.89285 3.29619 7.98991 3.41145 8.0991C3.50396 8.18858 3.62984 8.25683 3.6632 8.39786H3.66169C3.50093 8.34934 3.41904 8.20526 3.31136 8.09607C3.20672 7.98991 3.13999 7.98688 3.03231 8.09607C2.45906 8.67843 1.87973 9.2532 1.30344 9.82949C1.25795 9.87499 1.20942 9.91897 1.14572 9.97811C1.11843 9.86741 1.1897 9.83708 1.22913 9.79764C1.80542 9.21832 2.3802 8.639 2.96255 8.06726C3.08539 7.94745 3.10056 7.86859 2.96559 7.74878C2.81242 7.61381 2.68048 7.45608 2.54095 7.31201C2.60768 7.2832 2.65318 7.33324 2.70019 7.38026C2.79422 7.47428 2.89886 7.56073 2.97924 7.66385C3.08539 7.79883 3.19307 7.84129 3.34018 7.73513L3.34169 7.73968Z" fill="white" />
                  <path d="M7.70056 8.9105C7.60501 9.10462 7.42606 9.22443 7.2835 9.37305C6.91043 9.76129 6.52978 10.1435 6.14154 10.5165C6.01111 10.6424 6.01566 10.7228 6.1476 10.8335C6.26286 10.9306 6.36447 11.0443 6.46911 11.1535C6.49489 11.1808 6.55404 11.2111 6.51006 11.2536C6.4676 11.296 6.44182 11.243 6.413 11.2126C6.28258 11.0777 6.14761 10.9472 6.02021 10.8092C5.955 10.7364 5.91254 10.7425 5.84884 10.8092C5.72904 10.9381 5.60316 11.0595 5.47729 11.1823C5.43786 11.2217 5.40601 11.2854 5.32715 11.2596C5.33321 11.1899 5.39388 11.1626 5.43179 11.1232C5.83974 10.694 6.27348 10.2906 6.67688 9.8538C6.94531 9.56414 7.22891 9.28661 7.51099 9.00756C7.56407 8.956 7.62321 8.91505 7.69904 8.90747L7.70207 8.90899L7.70056 8.9105Z" fill="white" />
                  <path d="M3.66319 8.39941C3.7466 8.4252 3.80423 8.48889 3.86186 8.54804C4.30772 8.99087 4.75208 9.43674 5.19794 9.8826C5.21462 9.89929 5.22675 9.919 5.24344 9.93872C5.17064 9.98876 5.13879 9.92962 5.10391 9.89625C4.64591 9.43977 4.18792 8.98025 3.72992 8.52377C3.69504 8.48889 3.66016 8.45553 3.66016 8.40245L3.66167 8.40093L3.66319 8.39941Z" fill="white" />
                  <path d="M8.75377 7.81853C8.6461 7.97625 8.86448 8.02478 8.86296 8.14611C8.80079 8.14762 8.76439 8.10516 8.72951 8.06421C8.68401 8.01113 8.63548 7.99293 8.5733 8.03843L8.57027 8.0354C8.58695 7.94289 8.54297 7.87919 8.48079 7.81398C8.36553 7.69721 8.23208 7.59408 8.15625 7.43939C8.32004 7.5228 8.43985 7.65929 8.55662 7.79275C8.62941 7.87616 8.67794 7.88829 8.75529 7.81853H8.75377Z" fill="white" />
                  <path d="M7.99148 8.61925C7.93082 8.75271 7.83376 8.84977 7.7003 8.91043L7.69727 8.90892C7.72001 8.73754 7.8383 8.66172 7.98844 8.61774L7.99148 8.62077V8.61925Z" fill="white" />
                  <path d="M8.27984 8.32658C8.30107 8.15521 8.42088 8.07938 8.5695 8.0354L8.57253 8.03843C8.51035 8.17037 8.41481 8.26895 8.28135 8.32961L8.27832 8.32658H8.27984Z" fill="white" />
                  <path d="M7.98784 8.61778C8.01059 8.44641 8.12888 8.37058 8.27902 8.3266C8.27902 8.3266 8.28054 8.32812 8.28054 8.32963C8.21988 8.46309 8.12282 8.56015 7.98936 8.62081L7.98633 8.61778H7.98784Z" fill="white" />
                  <path d="M8.86133 8.14459C8.9963 8.20374 9.11156 8.2826 9.15251 8.43577C9.02512 8.37056 8.89318 8.30686 8.86133 8.14459Z" fill="white" />
                  <path d="M8.8267 7.78213C8.81153 7.81246 8.78575 7.82156 8.75391 7.81853C8.76907 7.78668 8.79637 7.78062 8.8267 7.78213Z" fill="#545454" />
                  <path d="M5.25365 4.40929C5.25365 4.40929 5.26579 4.42142 5.27185 4.42749C5.2673 4.43052 5.26275 4.43811 5.25972 4.43659C5.25062 4.43507 5.24152 4.43052 5.23242 4.42597C5.24 4.41991 5.24607 4.41384 5.25365 4.40778V4.40929Z" fill="#545454" />
                </g>
              </svg>
              <p key={season.id}>{JSON.parse(season?.season_name)?.english}</p>
            </div>

          ))}
        </section>


      </article>}


      {
        myBoards && (
          <article
            className="mt-16 mb-2 border-2 rounded-3xl mx-2 md:w-1/2 md:ml-[25%]"
            style={{
              background: `linear-gradient(90deg, #FF4C01 0%, rgba(0, 0, 0, 0) 139.19%)`,
            }}
          >
            <h2 className="text-black font-extrabold">
              {Localization["My Boards"][lang]}
            </h2>

            {myBoards?.length === 0 ? (
              <div className="text-white py-4">
                <p>{Localization["My Boards"][lang]}
                </p>
                <p>{Localization["You don't have any boards yet."][lang]}
                </p>
                <button
                  className="bg-white text-black font-bold px-8 py-2 rounded-3xl mt-2 cursor-pointer"
                  onClick={() => navigate("/store")}
                >
                  {Localization["Shop"][lang]}
                </button>
              </div>
            ) : (
              <section className="flex overflow-x-scroll text-white">
                {myBoards?.map((board) => (
                  <div
                    onClick={() => {
                      user.default_board?.id !== board.id &&
                        setSelectedBoard(board);
                      user.default_board?.id !== board.id &&
                        setShowChangeBoardModal(true);
                    }}
                    className="flex-shrink-0 w-1/2 flex flex-col items-center justify-center pb-3"
                    key={board.id}
                  >
                    <h2 className="text-center">{board.name}</h2>
                    <div className="relative max-h-[30vh] w-[70%]">
                      <img className="" src={board.item} alt="" />
                      {user.default_board?.id === board.id && (
                        <AiFillCheckCircle
                          size={30}
                          className="absolute bottom-0 right-0 text-green-400"
                        />
                      )}
                    </div>
                  </div>
                ))}
              </section>
            )}
          </article>
        )
      }
      {
        myCrowns && (
          <article
            className="mt-16 mb-2 border-2 rounded-3xl mx-2 md:w-1/2 md:ml-[25%] h-[20vh]"
            style={{
              background: `linear-gradient(90deg, #FF4C01 0%, rgba(0, 0, 0, 0) 139.19%)`,
            }}
          >
            <h2 className="text-black font-extrabold">
              {Localization["My Crowns"][lang]}
            </h2>

            {myCrowns?.length === 0 ? (
              <div className="text-white py-4">
                <p>{Localization["You don't have any crowns yet."][lang]}</p>
                <p>{Localization["Go to the store to buy one"][lang]}
                </p>
                <button
                  className="bg-white text-black font-bold px-8 py-2 rounded-3xl mt-2 cursor-pointer"
                  onClick={() => navigate("/store")}
                >
                  {Localization["Shop"][lang]}
                </button>
              </div>
            ) : (
              <section className="flex overflow-x-scroll text-white">
                {myCrowns?.map((crown) => (
                  <div
                    onClick={() => {
                      user.default_crown?.id !== crown.id &&
                        setSelectedCrown(crown);
                      user.default_crown?.id !== crown.id &&
                        setShowChangeCrownModal(true);
                    }}
                    className="flex-shrink-0 w-1/2 flex flex-col items-center justify-center pb-3"
                    id={crown.id}
                  >
                    <h2 className="text-center">{crown.name}</h2>
                    <div className="relative max-h-[30vh] w-[70%]">
                      <img className="" src={crown.item} alt="" />
                      {user.default_crown?.id === crown.id && (
                        <AiFillCheckCircle
                          size={30}
                          className="absolute bottom-0 right-0  text-green-400"
                        />
                      )}
                    </div>
                  </div>
                ))}
              </section>
            )}
          </article>
        )
      }

      <ChangeBoard
        board={selectedBoard}
        showChangeBoardModal={showChangeBoardModal}
        setShowChangeBoardModal={setShowChangeBoardModal}
      />
      <ChangeCrown
        crown={selectedCrown}
        showChangeCrownModal={showChangeCrownModal}
        setShowChangeCrownModal={setShowChangeCrownModal}
      />



    </article >
  );
};

export default Profile;