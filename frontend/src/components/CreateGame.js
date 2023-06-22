import { useState, useEffect } from "react";
import Joyride from 'react-joyride';
import { useQuery } from "@tanstack/react-query";
import SideMenu from "./SideMenu";
import { useNavigate } from "react-router-dom";
import background from "../assets/backdrop.jpg";
import avatar from "../assets/logo.png";
import { useAuth } from "../context/auth";
import { Link } from "react-router-dom";
import { Localization } from "../utils/language"

import "./style.css";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Footer } from "./Footer";
import { BsFillCaretDownFill, BsFillCaretUpFill } from "react-icons/bs";

import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControl from '@mui/material/FormControl';

import { Circles } from "react-loader-spinner";
import { SORTBY, LANG } from "../utils/data"
import TopFour from "./TopFour";
import { sortScoreBoard, cacheApiResponse } from "../utils/utilFunc";

import socket from "../utils/socket.io";


const CreateGame = () => {
  const navigate = useNavigate();
  const { user, token, lang, setLanguage } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const [showTourPrompt, setShowTourPrompt] = useState(false);
  const [showLangPrompt, setShowLangPrompt] = useState(false);

  const [showLangMenu, setShowLangMenu] = useState(false);

  const [LangValue, setLangValue] = useState(lang);

  const [tourItems, setTourItems] = useState(null);
  const [topFour, setTopFour] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [allBadges, setAllBadges] = useState(null);




  function handleSecond(url) {
    setTimeout(() => {
      navigate(`/${url}`);
    }, 300);
  }
  const startTour = () => {
    setShowTourPrompt(false)
    setTourItems({
      run: true,
      steps: [
        {
          target: '.first-step',
          content: Localization["Sharpen your skills with"][lang],
          disableBeacon: true
        },
        {
          target: '.second-step',
          content: Localization["Start your own exciting"][lang],
        },
        {
          target: '.third-step',
          content: Localization["Join a game your friend created"][lang],
        },
        {
          target: '.fourth-step',
          content: Localization["Dive into the action with"][lang],
        }
        ,
        {
          target: '.sixth-step',
          content: Localization["Keep track of your"][lang],
        }
        ,
        {
          target: '.seventh-step',
          content: Localization["Customize your game with"][lang],
        },
        {
          target: '.fifth-step',
          content: Localization["Join the community of dama"][lang],
        }
      ]
    })
  }

  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
  };

  const header = {
    "Content-Type": "application/json",
    Accept: "application/json"
  };

  const createGameMutation = useMutation(
    async (newData) =>
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}play-with-computer`, newData, {
        headers,
      }),
    {
      retry: false,
    }
  );

  const createGameAI = async (values) => {
    try {
      createGameMutation.mutate(
        {},
        {
          onSuccess: (responseData) => {
            localStorage.setItem("gameId", responseData?.data?.data?.id)
            handleSecond(`game/${1}`)
          },
          onError: (err) => { },
        }
      );
    } catch (err) { }
  };


  const createGamNoAuthMutation = useMutation(
    async (newData) =>
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}play-with-computer-na`, newData, {
        headers: header,
      }),
    {
      retry: false,
    }
  );

  const createGameAI_NoAuth = () => {
    try {
      createGamNoAuthMutation.mutate(
        {},
        {
          onSuccess: (responseData) => {
            localStorage.setItem("gameId", responseData?.data?.data?.id)
            handleSecond(`game/${1}`)
          },
          onError: (err) => { },
        }
      );
    } catch (err) { }
  }


  const handleJoyrideCallback = data => {
    const { action, status } = data;
    if (status === "finished" || status === "skipped" || action === "close") {
      localStorage.setItem("onBoardig", true)
      localStorage.setItem("showOnBoardig", true)
    }
  };


  const checkIn = () => {

    const { id, username, profile_image, game_point, default_board, default_crown } = user

    socket.emit("checkInLeague", {
      seasonId: "12s",
      userData: { id, username, profile_image, game_point, default_board, default_crown }
    });

    socket.emit("clearSeason", {
      seasonId: "1234s"
    });
  }

  const scoreBoardData = useQuery(
    ["soreBoardDataApi"],
    async () =>
      await axios.get(`${process.env.REACT_APP_BACKEND_URL}top-four`, {
        headers,
      }),
    {
      keepPreviousData: true,
      refetchOnWindowFocus: false,
      retry: false,
      //   enabled: !!token,
      onSuccess: (res) => {
        let sortedArr = sortScoreBoard(SORTBY.PERSON, res.data.data)

        cacheApiResponse("TopFour", sortedArr)
        setTopFour(sortedArr)

        sortedArr = []
        setIsLoading(false)
      },
      enabled: localStorage.getItem("TopFour") ? false : true,
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


        setAllBadges(tempArr)
        cacheApiResponse("BadgesAll", tempArr)

        tempArr = []
      },
      enabled: (!isLoading && !localStorage.getItem("BadgesAll")) ? true : false,
    }
  );


  useEffect(() => {
    localStorage.removeItem("isNotPublic");

    //get cached items
    if (localStorage.getItem("TopFour")) {
      setTopFour(JSON.parse(localStorage.getItem("TopFour")))
      setAllBadges(JSON.parse(localStorage.getItem("BadgesAll")))
      setIsLoading(false)
    }


  }, [])

  useEffect(() => {
    if (!localStorage.getItem("onBoardig")) {
      if (localStorage.getItem("promptChecked")) {
        setShowLangPrompt(false)
        !tourItems && setTimeout(() => setShowTourPrompt(true), 600)
      } else {
        setShowTourPrompt(false)
        setShowLangPrompt(true)
      }

    }
  })



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
        position: "relative",
      }}
    >

      {tourItems && <Joyride
        callback={handleJoyrideCallback}
        steps={tourItems.steps}
        continuous
        hideCloseButton
        run={tourItems.run}
        scrollToFirstStep
        showProgress
        showSkipButton
        spotlightClicks={false}
        styles={{
          options: {
            arrowColor: 'rgb(215 56 13 / 90%)',
            overlayColor: 'rgba(79, 26, 0, 0.4)',
            primaryColor: '#000',
            textColor: '#000',
            zIndex: 1000,
            backgroundColor: "rgb(215 56 13 / 90%)",
          },
        }}
      />}

      {allBadges && allBadges.length > 0 && <SideMenu showMenu={showMenu} setShowMenu={setShowMenu} badges={allBadges} />}

      <article className="w-full flex justify-center absolute top-4">
        {!user && !token && (
          <section className=" w-[90%] flex items-center">
            {!user && !showLangPrompt && <div className="flex flex-col w-1/2 text-white ">
              <button className="border rounded-md border-orange-color text-orange-color py-1 flex gap-2 items-center justify-center w-24"
                onClick={() => setShowLangMenu(prev => !prev)}>
                {LANG[lang]}
                {showLangMenu ? <BsFillCaretUpFill /> : <BsFillCaretDownFill />}
              </button>

              {showLangMenu && <ul className="w-24 text-orange-color border-b border-orange-color mt-1">
                {Object.keys(LANG).filter(tempL => tempL !== lang).map(tempL =>
                  (<li onClick={() => setLanguage(tempL)} className="rounded-md border-b border-orange-color cursor-pointer hover:border-b-orange-400 py-1">{LANG[tempL]}</li>))}
              </ul>}

            </div>}
            <div className={showLangPrompt ? " w-1/2 flex" : " w-1/2 flex justify-end"}>

              <button
                onClick={() => {
                  handleSecond("login");
                }}
                className="fifth-step relative w-22 p-2 bg-orange-bg rounded-md cursor-pointer select-none px-5
  active:translate-y-2  active:[box-shadow:0_0px_0_0_#1b6ff8,0_0px_0_0_#1b70f841]
  active:border-b-[0px] flex items-center justify-center
  transition-all duration-150 [box-shadow:0_5px_0_0_#c93b00,0_5px_0_0_#c93b00]
  border-b-[1px] border-gray-400/50 font-semibold text-white
">
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-md" />
                {Localization["Login"][lang]}
              </button>
            </div>
          </section>

        )}
      </article>

      {showLangPrompt && <section className="absolute top-0 h-[100vh] flex items-center justify-center w-full z-10">
        <div className=" w-[90%] max-w-[450px] py-8 onboarding_prompt rounded-lg">
          <p className="pt-4 font-bold text-black">Select your language preference</p>
          <p className="pt-4 pb-6 font-bold text-black">የቋንቋ ምርጫዎን ይምረጡ።</p>

          <FormControl>
            <RadioGroup
              aria-labelledby="demo-controlled-radio-buttons-group"
              name="controlled-radio-buttons-group"
              value={LangValue}
            >
              <div className="border text-white border-white w-60 rounded-lg">
                <FormControlLabel value="ENG" control={<Radio color="default" />} label={LANG.ENG}
                  onClick={e => setLangValue(e.target.value)} />
              </div>

              <div className="border text-white border-white w-60 rounded-lg mt-8">
                <FormControlLabel value="AMH" control={<Radio color="default" />} label={LANG.AMH}
                  onClick={e => setLangValue(e.target.value)} />
              </div>

            </RadioGroup>

          </FormControl>

          <br></br>
          <button className="border px-16 py-2 rounded-full border-white text-black bg-white 
         focus:bg-gray-300  hover:bg-gray-300 font-bold mt-8"
            onClick={() => {
              LangValue !== lang && setLanguage(LangValue);
              localStorage.setItem("promptChecked", true)
              setShowLangPrompt(false)
            }}>Select / ምረጥ</button>
        </div>
      </section>}


      {
        showTourPrompt && <section className="absolute top-0 h-[100vh] flex items-center justify-center w-full z-10">
          <div className=" w-[90%] max-w-[450px] py-8 onboarding_prompt">
            <h3 className="pb-6  font-bold text-5xl">{Localization["Dama"][lang]}</h3>
            <p className="pb-6">{Localization["Let’s begin by going"][lang]}</p>
            <button className="border px-10 py-2 rounded-full border-white text-black bg-white 
         focus:bg-gray-300  hover:bg-gray-300 font-bold" onClick={startTour}>{Localization["Start Tour"][lang]}</button>
          </div>
        </section>
      }

      <div onClick={() => { setShowMenu(false); setShowLangMenu(false); }}
        className={user ? "max-w-xs p-3 mx-auto flex flex-col items-center justify-center gap-y-2 min-h-[48vh] space-y-2" : "max-w-xs p-3 mx-auto flex flex-col items-center justify-center gap-y-2 min-h-[70vh] space-y-2 mt-16"}>
        {!user && !token && <div className="h-[180px] w-[200px] bg-inherit mt-18 mb-8 ">
          <img src={avatar} className="" alt="avatar" />
        </div>}
        <button
          onClick={() => {
            user && token ? createGameAI() : createGameAI_NoAuth()
          }}
          className="first-step relative w-full p-2 bg-orange-bg rounded-md cursor-pointer select-none
        active:translate-y-2  active:[box-shadow:0_0px_0_0_#1b6ff8,0_0px_0_0_#1b70f841]
        active:border-b-[0px] flex items-center justify-center
        transition-all duration-150 [box-shadow:0_5px_0_0_#c93b00,0_5px_0_0_#c93b00]
        border-b-[1px] border-gray-400/50 font-semibold text-white
      "
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-md" />
          {Localization["Play With Computer"][lang]}
        </button>
        <div className="w-full grid grid-cols-2 gap-3">

          <button
            onClick={() => handleSecond("new-game")}
            className="second-step relative w-full p-2 bg-orange-bg rounded-md cursor-pointer select-none
  active:translate-y-2  active:[box-shadow:0_0px_0_0_#1b6ff8,0_0px_0_0_#1b70f841]
  active:border-b-[0px] flex items-center justify-center
  transition-all duration-150 [box-shadow:0_5px_0_0_#c93b00,0_5px_0_0_#c93b00]
  border-b-[1px] border-gray-400/50 font-semibold text-white
"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-md" />
            {Localization["Create Game"][lang]}
          </button>
          <button
            onClick={() => handleSecond("join-game")}
            className="third-step relative w-full p-2 bg-orange-bg rounded-md cursor-pointer select-none
          active:translate-y-2  active:[box-shadow:0_0px_0_0_#1b6ff8,0_0px_0_0_#1b70f841]
          active:border-b-[0px] flex items-center justify-center
          transition-all duration-150 [box-shadow:0_5px_0_0_#c93b00,0_5px_0_0_#c93b00]
          border-b-[1px] border-gray-400/50 font-semibold text-white
        "
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-md" />
            {Localization["Join Game"][lang]}
          </button>
        </div>

        <button
          onClick={() => handleSecond("new-game-public")}
          className="fourth-step relative w-full p-2 bg-orange-bg rounded-md cursor-pointer select-none
        active:translate-y-2  active:[box-shadow:0_0px_0_0_#1b6ff8,0_0px_0_0_#1b70f841]
        active:border-b-[0px] flex items-center justify-center
        transition-all duration-150 [box-shadow:0_5px_0_0_#c93b00,0_5px_0_0_#c93b00]
        border-b-[1px] border-gray-400/50 font-semibold text-white
      "
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-md" />
          {Localization["Public Game"][lang]}
        </button>



        <section className="w-4/5 max-w-[30rem] flex items-center justify-evenly mt-[12vh]">
          <Link
            to="/score-board"
            className="sixth-step flex flex-col justify-evenly items-center mt-4"
          >
            <div className="h-8 w-10 rounded-sm bg-orange-color px-2 flex justify-center items-center">
              <svg
                width="20"
                height="18"
                viewBox="0 0 20 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15.5 11.5H14V8.5H15.5V11.5ZM14 0C13.45 0 13 0.45 13 1V2H7V1C7 0.45 6.55 0 6 0C5.45 0 5 0.45 5 1V2H2C0.9 2 0 2.9 0 4V16C0 17.1 0.9 18 2 18H18C19.1 18 20 17.1 20 16V4C20 2.9 19.1 2 18 2H15V1C15 0.45 14.55 0 14 0ZM7.5 12.25C7.5 12.66 7.16 13 6.75 13H4C3.45 13 3 12.55 3 12V10.5C3 9.95 3.45 9.5 4 9.5H6V8.5H3.75C3.34 8.5 3 8.16 3 7.75C3 7.34 3.34 7 3.75 7H6.5C7.05 7 7.5 7.45 7.5 8V9.5C7.5 10.05 7.05 10.5 6.5 10.5H4.5V11.5H6.75C7.16 11.5 7.5 11.84 7.5 12.25ZM17 12C17 12.55 16.55 13 16 13H13.5C12.95 13 12.5 12.55 12.5 12V8C12.5 7.45 12.95 7 13.5 7H16C16.55 7 17 7.45 17 8V12ZM10.75 4.75C10.75 5.16 10.41 5.5 10 5.5C9.59 5.5 9.25 5.16 9.25 4.75C9.25 4.34 9.59 4 10 4C10.41 4 10.75 4.34 10.75 4.75ZM10.75 8.25C10.75 8.66 10.41 9 10 9C9.59 9 9.25 8.66 9.25 8.25C9.25 7.84 9.59 7.5 10 7.5C10.41 7.5 10.75 7.84 10.75 8.25ZM10.75 11.75C10.75 12.16 10.41 12.5 10 12.5C9.59 12.5 9.25 12.16 9.25 11.75C9.25 11.34 9.59 11 10 11C10.41 11 10.75 11.34 10.75 11.75ZM10.75 15.25C10.75 15.66 10.41 16 10 16C9.59 16 9.25 15.66 9.25 15.25C9.25 14.84 9.59 14.5 10 14.5C10.41 14.5 10.75 14.84 10.75 15.25Z"
                  fill="#191921"
                />
              </svg>
            </div>
            <p className="text-orange-color text-[.7rem]">
              {Localization["Score board"][lang]}
            </p>
          </Link>
          <Link
            to="/store"
            className="seventh-step flex flex-col justify-evenly items-center mt-4"
          >
            <div className="h-8 w-10 rounded-sm bg-orange-color px-2 fle
          x justify-center items-center pt-1">
              <svg
                width="22"
                height="22"
                viewBox="0 0 22 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6.59977 17.6C5.38981 17.6 4.41085 18.59 4.41085 19.8C4.41085 21.01 5.38981 22 6.59977 22C7.80973 22 8.7997 21.01 8.7997 19.8C8.7997 18.59 7.80973 17.6 6.59977 17.6ZM0 0V2.2H2.19992L6.15979 10.549L4.67484 13.244C4.49885 13.552 4.39985 13.915 4.39985 14.3C4.39985 15.51 5.38981 16.5 6.59977 16.5H19.7993V14.3H7.06176C6.90776 14.3 6.78677 14.179 6.78677 14.025L6.81977 13.893L7.80973 12.1H16.0044C16.8294 12.1 17.5554 11.649 17.9294 10.967L21.8672 3.828C21.958 3.66013 22.0037 3.47158 21.9998 3.28078C21.9959 3.08998 21.9426 2.90346 21.845 2.73943C21.7475 2.5754 21.6091 2.43947 21.4433 2.34492C21.2776 2.25037 21.0901 2.20044 20.8993 2.2H4.63084L3.59688 0H0ZM17.5994 17.6C16.3894 17.6 15.4105 18.59 15.4105 19.8C15.4105 21.01 16.3894 22 17.5994 22C18.8094 22 19.7993 21.01 19.7993 19.8C19.7993 18.59 18.8094 17.6 17.5994 17.6Z"
                  fill="#191921"
                />
              </svg>
            </div>
            <p className="text-orange-color text-[.7rem]">
              {Localization["Store"][lang]}
            </p>
          </Link>

          <Link
            to="/league"
            className="seventh-step flex flex-col justify-evenly items-center mt-4"
          >
            <div className="h-8 w-10 rounded-sm bg-orange-color px-2 fle
          x justify-center items-center pt-1">
              <svg width="22" height="22" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0.5513 24.1986C1.10444 24.2436 1.16311 23.9772 1.15054 23.5493C1.11701 22.097 1.14635 20.6409 1.13378 19.1886C1.13378 18.9409 1.1673 18.7496 1.46482 18.667C1.54025 18.6445 1.66597 18.5957 1.67016 18.5544C1.71626 17.8601 2.30712 18.1641 2.69264 18.1078C2.89798 18.0778 3.11588 18.1041 3.44274 18.1041C2.41607 17.0683 2.59626 16.0588 3.22902 15.0156C3.66484 14.2988 4.28922 13.7509 5.03513 13.3005C5.77684 12.8577 6.56885 12.505 7.40276 12.2273C8.93648 11.7169 10.4702 11.2103 12.0081 10.6999C11.9704 11.0189 12.05 11.3266 12.1171 11.6306C12.3894 12.8615 13.655 13.7546 15.1258 13.7621C16.5548 13.7696 17.8497 12.9028 18.0969 11.7319C18.2897 10.8237 17.9083 10.0582 17.1121 9.51776C16.4417 9.05992 15.6496 9.0299 14.8954 9.41268C14.3338 9.69789 13.9441 10.0994 13.9064 10.7224C13.8729 11.3078 14.0698 11.7844 14.6397 12.0997C15.4485 12.5462 16.5003 12.1672 16.5296 11.4242C16.5422 11.1427 16.4668 10.8875 16.0896 10.895C15.7167 10.9025 15.6832 11.1502 15.767 11.4129C15.8215 11.5855 15.7586 11.6981 15.6035 11.7919C15.4527 11.882 15.3186 11.837 15.1803 11.7694C14.8115 11.5855 14.623 11.0939 14.7738 10.7036C14.954 10.242 15.4904 9.93807 16.0268 9.9906C16.6344 10.0544 17.1708 10.5423 17.2337 11.0939C17.3175 11.8107 16.9864 12.4449 16.3746 12.7414C15.6287 13.1016 14.5853 13.0003 13.9734 12.5162C13.2108 11.912 13.0264 11.139 13.127 10.2758C13.2862 10.1745 13.2317 10.0281 13.2234 9.89303C13.546 9.55904 13.8142 9.19127 14.2291 8.92107C15.5994 8.02791 18.034 8.7672 18.562 10.2045C18.8847 11.0827 18.6417 11.8445 18.2687 12.6213C18.2017 12.7639 18.0173 12.9703 18.1975 13.0604C18.3986 13.1654 18.5872 12.9665 18.7087 12.8089C19.0565 12.3661 19.2828 11.8858 19.3959 11.3454C19.727 9.79921 18.4028 8.02791 16.6847 7.72394C15.7335 7.55506 14.8367 7.67515 13.9567 7.99789C14.0782 7.87405 14.2039 7.75396 14.3213 7.63012C14.3715 7.57383 14.4595 7.465 14.447 7.45374C13.8058 6.87581 14.8995 6.94336 14.7738 6.5268C14.2835 6.37669 14.5056 6.18906 14.8451 5.94888C15.1007 5.76499 15.4485 5.58486 15.2432 5.17956C15.1803 5.05572 15.306 4.94689 15.394 4.86808C15.6832 4.61665 15.7586 4.29766 15.7376 3.96367C15.7167 3.61841 15.7251 3.31069 15.9597 2.99545C16.1399 2.75528 16.0016 2.44755 15.8801 2.17735C15.7167 1.81709 15.7712 1.53938 16.2489 1.42305C16.362 1.39678 16.4542 1.31046 16.5674 1.29545C17.1792 1.20539 17.4767 0.860132 17.5396 0.323486C17.594 0.346003 17.6401 0.357261 17.6401 0.368519C17.6527 1.02901 18.0927 1.23166 18.759 1.32547C19.4169 1.41929 19.4127 1.47558 19.178 1.99722C19.0649 2.24865 19.0817 2.5151 19.1739 2.74777C19.354 3.20561 19.4001 3.68221 19.5049 4.15131C19.639 4.74424 19.6013 5.3672 19.5719 5.94888C19.551 6.34292 19.5929 6.70318 19.6893 7.05219C19.8443 7.61511 19.5845 8.17427 19.7354 8.72968C19.8862 9.27758 19.5636 9.88553 19.9784 10.4072C19.5929 10.8275 20.0916 11.2891 19.9156 11.6831C19.8276 11.8782 19.9156 11.927 19.9994 11.9983C20.8668 12.7639 21.7468 13.522 22.6184 14.2875C22.7819 14.4301 22.9788 14.5014 23.1925 14.5465C23.4356 14.599 23.6996 14.6365 23.7415 14.9255C23.7457 14.9555 23.7582 15.0005 23.7792 15.0043C24.6173 15.1582 24.303 15.7774 24.3994 16.2315C24.3491 16.5654 23.8756 16.6593 23.8588 17.0083C23.775 17.0083 23.6954 17.0195 23.6577 17.0983C23.4482 17.271 23.3099 17.2409 23.1087 17.0345C22.7861 16.7043 22.4592 16.3628 22.0024 16.1601C22.212 16.5429 22.5807 16.7981 22.8992 17.0871C23.0752 17.2447 23.1925 17.4023 23.1464 17.635C22.7358 17.7476 22.4047 17.9315 22.3461 18.3555C21.9312 18.4643 21.6043 18.652 21.5415 19.076C21.1266 19.1849 20.7998 19.3725 20.7369 19.7966C20.5274 19.8191 20.3639 19.9167 20.2173 20.0443C19.4378 20.7348 18.6542 21.4215 17.9125 22.1383C16.7978 23.2153 15.6035 24.2173 14.4721 25.2794C14.3674 25.3807 14.1997 25.4482 14.183 25.6171C14.4051 25.6809 14.4889 25.5233 14.5978 25.4257C14.9456 25.1217 15.2935 24.8215 15.6245 24.5025C15.8005 24.3337 15.9178 24.3187 16.098 24.5025C16.4458 24.844 16.823 25.1668 17.1834 25.5008C17.263 25.5758 17.3342 25.7072 17.4516 25.6021C17.5731 25.4933 17.4055 25.4182 17.3384 25.3544C17.0493 25.0842 16.7685 24.8028 16.45 24.5626C16.0855 24.2886 16.0687 24.0897 16.4333 23.7783C17.506 22.8551 18.562 21.9131 19.5887 20.9487C19.9868 20.5772 20.4813 20.2844 20.7411 19.8041C21.1099 19.654 21.3781 19.4138 21.5457 19.0836C21.9144 18.9334 22.1826 18.6933 22.3502 18.363C22.719 18.2129 22.983 17.9727 23.1548 17.6425C23.3224 17.5299 23.4565 17.5749 23.5864 17.7063C23.6828 17.8076 23.7834 17.9127 23.9552 17.9089C24.0432 18.3067 24.4036 18.4643 24.7598 18.6257C24.7933 18.8246 24.8562 18.9972 25.1327 18.9897C25.1411 20.5621 25.1788 22.1308 25.1411 23.7032C25.1285 24.2474 25.4805 24.1348 25.8242 24.1798C26.3144 24.2436 26.2642 23.9772 26.2642 23.6957C26.26 20.9111 26.2642 18.1303 26.2642 15.3458C26.2642 15.1807 26.2767 15.0193 26.2851 14.8542C27.2112 14.28 27.8775 13.4619 28.6988 12.7902C28.7491 12.7489 28.7785 12.6813 28.6988 12.6363C28.5941 12.5763 28.5019 12.6288 28.4306 12.6926C28.0451 13.0416 27.6764 13.4131 27.2741 13.7434C26.9388 14.0211 26.6832 14.3701 26.2725 14.5765C26.2684 11.1164 26.2642 7.65263 26.2558 4.19259C26.2558 3.90362 26.4192 3.6747 26.5952 3.4608C27.6386 2.1811 29.1514 1.63695 30.8025 1.31046C30.9994 1.27294 31.0707 1.38177 31.1545 1.4981C32.0093 2.67647 32.8642 3.85859 33.7274 5.0332C33.8573 5.20958 33.8615 5.39722 33.8615 5.59237C33.8615 10.2083 33.8741 14.8242 33.8573 19.4401C33.8573 19.8829 33.9914 19.9504 34.4189 19.8304C34.7373 19.744 35.0726 19.714 35.3994 19.6577C35.3659 19.7666 35.3366 19.8754 35.3031 19.9842C34.8421 20.1118 34.6074 20.4421 34.3979 20.7948C34.0124 20.9299 33.7442 21.1663 33.5933 21.5153C33.2078 21.6504 32.9396 21.8869 32.7888 22.2359C32.4032 22.371 32.135 22.6074 31.9842 22.9564C31.5987 23.0915 31.3305 23.3279 31.1796 23.6769C30.7941 23.812 30.5259 24.0485 30.375 24.3975C29.9895 24.5326 29.7213 24.769 29.5705 25.118C29.2185 25.2268 28.9796 25.4332 28.8706 25.756C28.703 25.7635 28.5396 25.7822 28.372 25.7822C18.6878 25.7822 9.00352 25.786 -0.684894 25.786C-0.785466 25.786 -0.88185 25.771 -0.982422 25.7635C-0.873469 25.5533 -0.647183 25.437 -0.492135 25.2644C-0.228134 24.9679 0.199297 24.7953 0.333393 24.3937C0.471679 24.3937 0.53035 24.3262 0.534541 24.2098L0.5513 24.1986ZM9.59438 18.5356C9.59438 18.6707 9.69076 18.7533 9.78714 18.8359C11.0527 19.9692 12.3182 21.1025 13.5837 22.2321C13.6801 22.3147 13.7681 22.461 13.9693 22.3372C13.9232 22.2847 13.8896 22.2359 13.8435 22.1983C12.6157 21.095 11.3879 19.9917 10.1517 18.8959C9.98829 18.7533 9.83324 18.5957 9.60277 18.5281C9.51058 18.1791 9.16276 18.0103 8.90714 17.7888C8.59286 17.5149 8.32047 17.2747 8.71438 16.8994C9.46867 17.0008 9.90448 17.3836 10.0051 18.0365C10.0302 18.1829 10.0051 18.3217 10.2774 18.3142C12.1296 18.2579 13.9818 18.2167 15.8382 18.1829C16.0896 18.1791 16.1483 18.0891 16.1315 17.8827C16.0603 16.9595 15.9933 16.0326 15.9388 15.1094C15.922 14.8504 15.8215 14.7416 15.5281 14.6515C14.2333 14.25 12.9216 14.4039 11.6058 14.4789C11.4801 14.4864 11.3837 14.5314 11.2957 14.6065C10.4995 15.2895 9.64048 15.9087 8.77724 16.5204C8.58448 16.6555 8.61381 16.7606 8.71019 16.9032C8.3079 17.1659 8.00618 17.0608 7.71285 16.7268C7.48656 16.4679 7.20161 16.2577 6.9418 16.025C6.8119 15.9087 6.68199 15.7811 6.5018 15.8562C6.88732 16.2164 7.2519 16.603 7.67514 16.937C8.04809 17.2334 8.00618 17.4248 7.66675 17.725C6.05761 19.1398 4.46941 20.5734 2.87702 22.007C2.76807 22.1045 2.57112 22.1796 2.64655 22.4535C2.82255 22.3034 2.95664 22.1983 3.08235 22.0858C4.67893 20.656 6.2797 19.2337 7.85952 17.7964C8.15705 17.5262 8.34142 17.5337 8.63057 17.7964C8.92809 18.0666 9.15438 18.4231 9.59857 18.5469L9.59438 18.5356ZM7.22675 13.7284C6.06599 14.1299 4.94293 14.4151 4.19703 15.2482C3.34217 16.2014 3.57265 17.2672 4.72922 17.9052C4.74179 17.3685 4.93875 16.9595 5.57989 16.8544C5.73075 16.8281 5.7978 16.6818 5.86065 16.5542C6.29646 15.6498 6.73646 14.7416 7.22675 13.7284ZM20.0664 18.2017C20.6084 18.1866 20.8878 17.939 20.9045 17.4586C20.9129 17.2334 20.9171 17.0083 20.9213 16.7869C20.9213 16.5654 20.8836 16.344 21.244 16.2765C21.4912 16.2277 21.4409 15.9913 21.4619 15.8186C21.487 15.6235 21.2984 15.6198 21.1643 15.5822C20.7662 15.4696 20.364 15.3683 19.9659 15.2557C18.474 14.8354 18.319 14.9518 18.3483 16.3703C18.3567 16.693 18.4363 16.8957 18.8218 16.8994C19.3247 16.9069 19.5678 17.1509 19.6474 17.5674C19.6725 17.6988 19.7396 17.8301 19.7396 17.9615C19.7396 18.1941 19.8653 18.2467 20.0706 18.2017H20.0664Z" fill="#191921" />
                <path d="M-0.0389767 11.334C-0.0305958 11.6793 -0.0180225 12.0208 -0.0180225 12.3661C-0.0180225 16.1526 -0.0180225 19.9354 -0.0180225 23.7219C-0.0180225 23.9696 -0.0557404 24.221 0.359118 24.1948C0.359118 24.2586 0.359118 24.3224 0.359118 24.3862C-0.265265 24.7314 -0.776504 25.1742 -1.14527 25.7447C-1.45955 25.7522 -1.77803 25.7709 -2.09232 25.7709C-5.32738 25.7709 -8.56663 25.7709 -11.8017 25.7709C-11.9986 25.7709 -12.1998 25.7484 -12.3967 25.7372C-12.8116 25.1517 -13.348 24.6714 -14.0059 24.2998C-14.0059 24.1835 -14.0729 24.1197 -14.207 24.1197C-14.1903 24.0784 -14.1903 24.0221 -14.1567 23.9959C-12.6607 22.6636 -11.1647 21.3352 -9.66454 20.0104C-9.57234 19.9279 -9.49692 19.819 -9.34187 19.8115C-9.33349 21.1137 -9.29158 22.416 -9.33349 23.7182C-9.35025 24.2398 -9.02339 24.1497 -8.67977 24.1835C-8.26072 24.2248 -8.14339 24.0934 -8.14758 23.7182C-8.16853 22.1458 -8.15596 20.5733 -8.15596 19.0009C-8.15596 18.8208 -8.13501 18.6444 -8.12243 18.4643C-7.86681 18.4418 -7.70758 18.3254 -7.66567 18.0928H-7.66986C-7.46034 18.0928 -7.37653 17.9277 -7.23405 17.8376C-7.02453 17.7062 -6.9491 17.4398 -6.66834 17.3797C-6.66415 17.5111 -6.56776 17.5974 -6.47138 17.68C-4.76585 19.2073 -3.06451 20.7347 -1.35479 22.2583C-1.28355 22.3221 -1.21231 22.446 -1.06565 22.3409C-1.09498 22.157 -1.27098 22.0707 -1.3925 21.9581C-2.43175 21.0237 -3.47099 20.0892 -4.51442 19.1586C-5.18909 18.5581 -5.87633 17.9689 -6.55938 17.3722C-6.55938 17.1433 -6.34567 17.0458 -6.199 16.9107C-4.27556 15.1844 -2.35213 13.4619 -0.424501 11.7356C-0.298786 11.623 -0.131166 11.5292 -0.122786 11.3416H-0.126973C-0.0892591 11.3416 -0.0515471 11.3416 -0.0180225 11.3416L-0.0389767 11.334Z" fill="#545454" />
                <path d="M-8.16504 18.2579C-8.16504 13.702 -8.16504 9.14616 -8.16504 4.59031C-8.1399 4.55653 -8.11475 4.52276 -8.08542 4.48523C-6.27094 4.87927 -4.44807 5.20201 -2.57073 5.22828C-2.28577 5.22828 -2.00501 5.23953 -1.72006 5.23578C-1.51891 5.23578 -1.29682 5.1945 -1.32615 5.48346C-1.33034 5.54726 -1.28844 5.61856 -1.2172 5.60731C-0.861009 5.55852 -0.798148 5.71989 -0.81491 5.99009C-0.823291 6.12894 -0.655676 6.11393 -0.550914 6.13645C-0.52158 6.22276 -0.458718 6.2753 -0.362336 6.29781C-0.349765 6.38788 -0.370719 6.53799 -0.324624 6.55676C0.165665 6.74064 -0.0187197 7.11967 -0.0187197 7.42364C-0.0103378 8.66581 -0.0270977 9.90797 -0.0354786 11.1501C-0.119288 11.1877 -0.140244 11.259 -0.144435 11.334L-0.140241 11.3303C-0.370718 11.3378 -0.479671 11.5104 -0.617957 11.6342C-2.56235 13.368 -4.50255 15.1055 -6.43436 16.8468C-6.63132 17.0232 -6.80732 17.132 -7.07551 17.0044C-7.24313 16.6029 -7.64961 16.404 -7.98485 16.1488C-7.76694 16.5091 -7.54904 16.8693 -7.07132 17.0007C-6.92884 17.2371 -7.03779 17.4022 -7.23894 17.5711C-7.41075 17.7175 -7.64961 17.8338 -7.67894 18.0815L-7.67475 18.0777C-7.83399 18.1378 -7.99742 18.1941 -8.15666 18.2541L-8.16504 18.2579Z" fill="#545454" />
                <path d="M13.1272 10.2757C13.0266 11.1388 13.211 11.9119 13.9737 12.5161C14.5855 13.0002 15.6289 13.1015 16.3748 12.7413C16.9908 12.4448 17.3219 11.8106 17.2339 11.0938C17.1668 10.5459 16.6304 10.0543 16.027 9.99048C15.4906 9.93419 14.9542 10.2419 14.774 10.7035C14.6232 11.0938 14.8118 11.5854 15.1805 11.7693C15.3188 11.8368 15.4529 11.8819 15.6038 11.7918C15.7588 11.698 15.8259 11.5854 15.7672 11.4128C15.6834 11.1501 15.7169 10.9062 16.0899 10.8949C16.467 10.8874 16.5424 11.1426 16.5299 11.424C16.4963 12.1671 15.4487 12.5461 14.64 12.0995C14.07 11.7843 13.8731 11.3077 13.9066 10.7223C13.9443 10.0993 14.334 9.69777 14.8956 9.41256C15.6499 9.02978 16.4419 9.0598 17.1123 9.51763C17.9043 10.058 18.2899 10.8236 18.0971 11.7318C17.8499 12.9064 16.5508 13.7733 15.126 13.762C13.6552 13.7545 12.3939 12.8651 12.1173 11.6304C12.0502 11.3227 11.9664 11.015 12.0083 10.6998C12.3729 10.5459 12.7291 10.362 13.1272 10.2757Z" fill="#191921" />
                <path d="M13.9612 7.99785C14.8412 7.67511 15.7379 7.55878 16.6892 7.7239C18.4073 8.02787 19.7315 9.79918 19.4004 11.3453C19.2831 11.8895 19.061 12.3661 18.7132 12.8089C18.5875 12.9665 18.4031 13.1654 18.2019 13.0603C18.0176 12.9665 18.2019 12.7639 18.2732 12.6213C18.6503 11.8407 18.8892 11.0789 18.5665 10.2045C18.0385 8.76717 15.6038 8.02787 14.2335 8.92103C13.8145 9.19123 13.5505 9.559 13.2278 9.893C12.968 9.65657 13.0099 9.47269 13.3242 9.29631C13.5002 9.19498 13.6427 9.04112 13.7935 8.90602C13.8648 8.84222 13.936 8.75216 13.8187 8.68461C13.1734 8.33185 13.8103 8.20801 13.9654 7.99785H13.9612ZM13.9947 8.65459C13.9947 8.65459 13.957 8.68461 13.936 8.69962C13.9612 8.70712 13.9863 8.72213 14.0115 8.72589C14.0198 8.72589 14.0366 8.71088 14.045 8.70337C14.0282 8.68836 14.0115 8.67335 13.9947 8.65834V8.65459Z" fill="#191921" />
                <path d="M24.648 16.4678C24.7402 16.9407 24.6606 17.4173 24.6899 17.8939C24.6983 18.0027 24.6312 18.1828 24.824 18.1791C25.3352 18.1753 25.1299 18.4906 25.1509 18.712C25.021 18.682 24.8952 18.6557 24.7653 18.6257C24.6522 18.2466 24.3337 18.0515 23.9608 17.9051C23.9608 17.6049 23.3615 17.4848 23.659 17.0945C23.747 17.0983 23.8183 17.0795 23.8602 17.0045C24.208 16.9294 24.3463 16.6029 24.6438 16.4678H24.648Z" fill="#191921" />
                <path d="M-1.14941 25.7409C-0.780651 25.1705 -0.265222 24.7276 0.354971 24.3824C0.225066 24.7802 -0.202365 24.9528 -0.470556 25.253C-0.625605 25.4257 -0.85189 25.542 -0.960843 25.7521C-1.0237 25.7521 -1.08656 25.7446 -1.14941 25.7446V25.7409Z" fill="#6E6E6E" />
                <path d="M24.6469 16.4678C24.3494 16.6029 24.2111 16.9294 23.8633 17.0045C23.88 16.6555 24.3578 16.5617 24.4039 16.2277C24.4877 16.3027 24.6134 16.3477 24.6469 16.4678Z" fill="#191921" />
                <path d="M24.7725 18.6257C24.9018 18.6558 25.027 18.682 25.1563 18.712C25.1563 18.8059 25.148 18.8959 25.148 18.9898C24.8726 18.9935 24.81 18.8209 24.7766 18.6257H24.7725Z" fill="#191921" />
                <path d="M0.354763 24.3824C0.354763 24.3186 0.354763 24.2548 0.354763 24.191C0.421636 24.191 0.48433 24.191 0.551203 24.1947C0.551203 24.3111 0.488511 24.3786 0.350586 24.3786L0.354763 24.3824Z" fill="#6E6E6E" />
                <path d="M-0.152344 11.3378C-0.148189 11.2628 -0.127419 11.1915 -0.0443283 11.1539C0.00968057 11.214 0.00968057 11.274 -0.0443283 11.3378C-0.081719 11.3378 -0.119108 11.3378 -0.152344 11.3378Z" fill="#7D7D7D" />
                <path d="M8.71059 16.8995C8.31669 17.2785 8.58487 17.5187 8.90335 17.7889C9.15897 18.0103 9.50678 18.1792 9.59898 18.5282H9.59479C9.15059 18.4081 8.92431 18.0516 8.62678 17.7814C8.33764 17.5187 8.15325 17.5112 7.85573 17.7814C6.27172 19.2224 4.67096 20.6447 3.07857 22.0708C2.95286 22.1834 2.81876 22.2922 2.64276 22.4385C2.56733 22.1646 2.76428 22.0895 2.87323 21.992C4.46562 20.5584 6.05382 19.1249 7.66297 17.7101C8.0024 17.4136 8.04431 17.2184 7.67135 16.922C7.24811 16.588 6.88354 16.1977 6.49801 15.8412C6.68239 15.7699 6.80811 15.8937 6.93802 16.0101C7.19783 16.2427 7.48697 16.4566 7.70906 16.7118C8.0024 17.0458 8.29993 17.1509 8.7064 16.8882L8.71059 16.8995Z" fill="#191921" />
                <path d="M20.7534 19.7966C20.4894 20.2769 19.995 20.5734 19.6011 20.9412C18.5702 21.9019 17.5184 22.8476 16.4456 23.7707C16.0852 24.0822 16.0978 24.2811 16.4624 24.5551C16.7808 24.7952 17.0616 25.0767 17.3508 25.3469C17.422 25.4145 17.5854 25.4895 17.4639 25.5946C17.3466 25.6997 17.2753 25.5683 17.1957 25.4933C16.8353 25.1593 16.4624 24.8365 16.1104 24.495C15.9302 24.3149 15.8128 24.3299 15.6368 24.495C15.3058 24.814 14.958 25.1142 14.6102 25.4182C14.5012 25.5158 14.4132 25.6734 14.1953 25.6096C14.2121 25.437 14.3797 25.3694 14.4845 25.2718C15.6117 24.2098 16.8102 23.2116 17.9249 22.1308C18.6666 21.414 19.4502 20.7273 20.2296 20.0367C20.3763 19.9092 20.5397 19.8078 20.7492 19.7891L20.7576 19.7928L20.7534 19.7966Z" fill="#191921" />
                <path d="M9.5992 18.5319C9.82967 18.5957 9.98891 18.7533 10.1482 18.8996C11.3802 19.9954 12.608 21.0988 13.84 22.2021C13.8861 22.2433 13.9196 22.2921 13.9657 22.3409C13.7645 22.4648 13.6765 22.3184 13.5802 22.2358C12.3146 21.1063 11.0491 19.9692 9.78358 18.8396C9.6872 18.7533 9.59082 18.6707 9.59082 18.5394L9.59501 18.5356L9.5992 18.5319Z" fill="#191921" />
                <path d="M23.6667 17.0946C23.3692 17.4849 23.9726 17.6049 23.9684 17.9052C23.7966 17.9089 23.696 17.8038 23.5996 17.7025C23.4739 17.5712 23.3398 17.5261 23.168 17.6387L23.1596 17.6312C23.2057 17.4023 23.0842 17.2447 22.9124 17.0833C22.5939 16.7943 22.2251 16.5392 22.0156 16.1564C22.4682 16.3628 22.7992 16.7005 23.1219 17.0308C23.3231 17.2372 23.4572 17.2672 23.6709 17.0946H23.6667Z" fill="#191921" />
                <path d="M21.5591 19.076C21.3914 19.4062 21.1232 19.6464 20.7545 19.7965L20.7461 19.7927C20.809 19.3687 21.1358 19.181 21.5507 19.0722L21.5591 19.0797V19.076Z" fill="#191921" />
                <path d="M22.3548 18.3518C22.4134 17.9277 22.7445 17.7401 23.1552 17.6312L23.1635 17.6387C22.9917 17.9652 22.7277 18.2092 22.359 18.3593L22.3506 18.3518H22.3548Z" fill="#191921" />
                <path d="M21.5501 19.0723C21.6129 18.6482 21.9398 18.4606 22.3547 18.3517C22.3547 18.3517 22.3588 18.3555 22.3588 18.3593C22.1912 18.6895 21.923 18.9297 21.5543 19.0798L21.5459 19.0723H21.5501Z" fill="#191921" />
                <path d="M23.9639 17.9014C24.3368 18.0478 24.6553 18.2429 24.7684 18.622C24.4164 18.4606 24.0519 18.303 23.9639 17.9014Z" fill="#191921" />
                <path d="M23.8659 17.0045C23.8243 17.0789 23.7535 17.1012 23.666 17.0938C23.7077 17.0157 23.7826 17.0008 23.8659 17.0045Z" fill="#545454" />
                <path d="M13.993 8.65832C13.993 8.65832 14.0259 8.6881 14.0423 8.70298C14.03 8.71043 14.0177 8.72903 14.0094 8.72531C13.9848 8.72159 13.9602 8.71043 13.9355 8.69926C13.9561 8.68437 13.9725 8.66949 13.993 8.6546V8.65832Z" fill="#545454" />
              </svg>
            </div>
            <p className="text-orange-color text-[.7rem]">
              {Localization["League"][lang]}
            </p>
          </Link>

          <button
            onClick={checkIn}
            className="seventh-step flex flex-col justify-evenly items-center mt-4"
          >
            <div className="h-8 w-10 rounded-sm bg-orange-color px-2 fle
          x justify-center items-center pt-1">
              <svg width="22" height="22" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0.5513 24.1986C1.10444 24.2436 1.16311 23.9772 1.15054 23.5493C1.11701 22.097 1.14635 20.6409 1.13378 19.1886C1.13378 18.9409 1.1673 18.7496 1.46482 18.667C1.54025 18.6445 1.66597 18.5957 1.67016 18.5544C1.71626 17.8601 2.30712 18.1641 2.69264 18.1078C2.89798 18.0778 3.11588 18.1041 3.44274 18.1041C2.41607 17.0683 2.59626 16.0588 3.22902 15.0156C3.66484 14.2988 4.28922 13.7509 5.03513 13.3005C5.77684 12.8577 6.56885 12.505 7.40276 12.2273C8.93648 11.7169 10.4702 11.2103 12.0081 10.6999C11.9704 11.0189 12.05 11.3266 12.1171 11.6306C12.3894 12.8615 13.655 13.7546 15.1258 13.7621C16.5548 13.7696 17.8497 12.9028 18.0969 11.7319C18.2897 10.8237 17.9083 10.0582 17.1121 9.51776C16.4417 9.05992 15.6496 9.0299 14.8954 9.41268C14.3338 9.69789 13.9441 10.0994 13.9064 10.7224C13.8729 11.3078 14.0698 11.7844 14.6397 12.0997C15.4485 12.5462 16.5003 12.1672 16.5296 11.4242C16.5422 11.1427 16.4668 10.8875 16.0896 10.895C15.7167 10.9025 15.6832 11.1502 15.767 11.4129C15.8215 11.5855 15.7586 11.6981 15.6035 11.7919C15.4527 11.882 15.3186 11.837 15.1803 11.7694C14.8115 11.5855 14.623 11.0939 14.7738 10.7036C14.954 10.242 15.4904 9.93807 16.0268 9.9906C16.6344 10.0544 17.1708 10.5423 17.2337 11.0939C17.3175 11.8107 16.9864 12.4449 16.3746 12.7414C15.6287 13.1016 14.5853 13.0003 13.9734 12.5162C13.2108 11.912 13.0264 11.139 13.127 10.2758C13.2862 10.1745 13.2317 10.0281 13.2234 9.89303C13.546 9.55904 13.8142 9.19127 14.2291 8.92107C15.5994 8.02791 18.034 8.7672 18.562 10.2045C18.8847 11.0827 18.6417 11.8445 18.2687 12.6213C18.2017 12.7639 18.0173 12.9703 18.1975 13.0604C18.3986 13.1654 18.5872 12.9665 18.7087 12.8089C19.0565 12.3661 19.2828 11.8858 19.3959 11.3454C19.727 9.79921 18.4028 8.02791 16.6847 7.72394C15.7335 7.55506 14.8367 7.67515 13.9567 7.99789C14.0782 7.87405 14.2039 7.75396 14.3213 7.63012C14.3715 7.57383 14.4595 7.465 14.447 7.45374C13.8058 6.87581 14.8995 6.94336 14.7738 6.5268C14.2835 6.37669 14.5056 6.18906 14.8451 5.94888C15.1007 5.76499 15.4485 5.58486 15.2432 5.17956C15.1803 5.05572 15.306 4.94689 15.394 4.86808C15.6832 4.61665 15.7586 4.29766 15.7376 3.96367C15.7167 3.61841 15.7251 3.31069 15.9597 2.99545C16.1399 2.75528 16.0016 2.44755 15.8801 2.17735C15.7167 1.81709 15.7712 1.53938 16.2489 1.42305C16.362 1.39678 16.4542 1.31046 16.5674 1.29545C17.1792 1.20539 17.4767 0.860132 17.5396 0.323486C17.594 0.346003 17.6401 0.357261 17.6401 0.368519C17.6527 1.02901 18.0927 1.23166 18.759 1.32547C19.4169 1.41929 19.4127 1.47558 19.178 1.99722C19.0649 2.24865 19.0817 2.5151 19.1739 2.74777C19.354 3.20561 19.4001 3.68221 19.5049 4.15131C19.639 4.74424 19.6013 5.3672 19.5719 5.94888C19.551 6.34292 19.5929 6.70318 19.6893 7.05219C19.8443 7.61511 19.5845 8.17427 19.7354 8.72968C19.8862 9.27758 19.5636 9.88553 19.9784 10.4072C19.5929 10.8275 20.0916 11.2891 19.9156 11.6831C19.8276 11.8782 19.9156 11.927 19.9994 11.9983C20.8668 12.7639 21.7468 13.522 22.6184 14.2875C22.7819 14.4301 22.9788 14.5014 23.1925 14.5465C23.4356 14.599 23.6996 14.6365 23.7415 14.9255C23.7457 14.9555 23.7582 15.0005 23.7792 15.0043C24.6173 15.1582 24.303 15.7774 24.3994 16.2315C24.3491 16.5654 23.8756 16.6593 23.8588 17.0083C23.775 17.0083 23.6954 17.0195 23.6577 17.0983C23.4482 17.271 23.3099 17.2409 23.1087 17.0345C22.7861 16.7043 22.4592 16.3628 22.0024 16.1601C22.212 16.5429 22.5807 16.7981 22.8992 17.0871C23.0752 17.2447 23.1925 17.4023 23.1464 17.635C22.7358 17.7476 22.4047 17.9315 22.3461 18.3555C21.9312 18.4643 21.6043 18.652 21.5415 19.076C21.1266 19.1849 20.7998 19.3725 20.7369 19.7966C20.5274 19.8191 20.3639 19.9167 20.2173 20.0443C19.4378 20.7348 18.6542 21.4215 17.9125 22.1383C16.7978 23.2153 15.6035 24.2173 14.4721 25.2794C14.3674 25.3807 14.1997 25.4482 14.183 25.6171C14.4051 25.6809 14.4889 25.5233 14.5978 25.4257C14.9456 25.1217 15.2935 24.8215 15.6245 24.5025C15.8005 24.3337 15.9178 24.3187 16.098 24.5025C16.4458 24.844 16.823 25.1668 17.1834 25.5008C17.263 25.5758 17.3342 25.7072 17.4516 25.6021C17.5731 25.4933 17.4055 25.4182 17.3384 25.3544C17.0493 25.0842 16.7685 24.8028 16.45 24.5626C16.0855 24.2886 16.0687 24.0897 16.4333 23.7783C17.506 22.8551 18.562 21.9131 19.5887 20.9487C19.9868 20.5772 20.4813 20.2844 20.7411 19.8041C21.1099 19.654 21.3781 19.4138 21.5457 19.0836C21.9144 18.9334 22.1826 18.6933 22.3502 18.363C22.719 18.2129 22.983 17.9727 23.1548 17.6425C23.3224 17.5299 23.4565 17.5749 23.5864 17.7063C23.6828 17.8076 23.7834 17.9127 23.9552 17.9089C24.0432 18.3067 24.4036 18.4643 24.7598 18.6257C24.7933 18.8246 24.8562 18.9972 25.1327 18.9897C25.1411 20.5621 25.1788 22.1308 25.1411 23.7032C25.1285 24.2474 25.4805 24.1348 25.8242 24.1798C26.3144 24.2436 26.2642 23.9772 26.2642 23.6957C26.26 20.9111 26.2642 18.1303 26.2642 15.3458C26.2642 15.1807 26.2767 15.0193 26.2851 14.8542C27.2112 14.28 27.8775 13.4619 28.6988 12.7902C28.7491 12.7489 28.7785 12.6813 28.6988 12.6363C28.5941 12.5763 28.5019 12.6288 28.4306 12.6926C28.0451 13.0416 27.6764 13.4131 27.2741 13.7434C26.9388 14.0211 26.6832 14.3701 26.2725 14.5765C26.2684 11.1164 26.2642 7.65263 26.2558 4.19259C26.2558 3.90362 26.4192 3.6747 26.5952 3.4608C27.6386 2.1811 29.1514 1.63695 30.8025 1.31046C30.9994 1.27294 31.0707 1.38177 31.1545 1.4981C32.0093 2.67647 32.8642 3.85859 33.7274 5.0332C33.8573 5.20958 33.8615 5.39722 33.8615 5.59237C33.8615 10.2083 33.8741 14.8242 33.8573 19.4401C33.8573 19.8829 33.9914 19.9504 34.4189 19.8304C34.7373 19.744 35.0726 19.714 35.3994 19.6577C35.3659 19.7666 35.3366 19.8754 35.3031 19.9842C34.8421 20.1118 34.6074 20.4421 34.3979 20.7948C34.0124 20.9299 33.7442 21.1663 33.5933 21.5153C33.2078 21.6504 32.9396 21.8869 32.7888 22.2359C32.4032 22.371 32.135 22.6074 31.9842 22.9564C31.5987 23.0915 31.3305 23.3279 31.1796 23.6769C30.7941 23.812 30.5259 24.0485 30.375 24.3975C29.9895 24.5326 29.7213 24.769 29.5705 25.118C29.2185 25.2268 28.9796 25.4332 28.8706 25.756C28.703 25.7635 28.5396 25.7822 28.372 25.7822C18.6878 25.7822 9.00352 25.786 -0.684894 25.786C-0.785466 25.786 -0.88185 25.771 -0.982422 25.7635C-0.873469 25.5533 -0.647183 25.437 -0.492135 25.2644C-0.228134 24.9679 0.199297 24.7953 0.333393 24.3937C0.471679 24.3937 0.53035 24.3262 0.534541 24.2098L0.5513 24.1986ZM9.59438 18.5356C9.59438 18.6707 9.69076 18.7533 9.78714 18.8359C11.0527 19.9692 12.3182 21.1025 13.5837 22.2321C13.6801 22.3147 13.7681 22.461 13.9693 22.3372C13.9232 22.2847 13.8896 22.2359 13.8435 22.1983C12.6157 21.095 11.3879 19.9917 10.1517 18.8959C9.98829 18.7533 9.83324 18.5957 9.60277 18.5281C9.51058 18.1791 9.16276 18.0103 8.90714 17.7888C8.59286 17.5149 8.32047 17.2747 8.71438 16.8994C9.46867 17.0008 9.90448 17.3836 10.0051 18.0365C10.0302 18.1829 10.0051 18.3217 10.2774 18.3142C12.1296 18.2579 13.9818 18.2167 15.8382 18.1829C16.0896 18.1791 16.1483 18.0891 16.1315 17.8827C16.0603 16.9595 15.9933 16.0326 15.9388 15.1094C15.922 14.8504 15.8215 14.7416 15.5281 14.6515C14.2333 14.25 12.9216 14.4039 11.6058 14.4789C11.4801 14.4864 11.3837 14.5314 11.2957 14.6065C10.4995 15.2895 9.64048 15.9087 8.77724 16.5204C8.58448 16.6555 8.61381 16.7606 8.71019 16.9032C8.3079 17.1659 8.00618 17.0608 7.71285 16.7268C7.48656 16.4679 7.20161 16.2577 6.9418 16.025C6.8119 15.9087 6.68199 15.7811 6.5018 15.8562C6.88732 16.2164 7.2519 16.603 7.67514 16.937C8.04809 17.2334 8.00618 17.4248 7.66675 17.725C6.05761 19.1398 4.46941 20.5734 2.87702 22.007C2.76807 22.1045 2.57112 22.1796 2.64655 22.4535C2.82255 22.3034 2.95664 22.1983 3.08235 22.0858C4.67893 20.656 6.2797 19.2337 7.85952 17.7964C8.15705 17.5262 8.34142 17.5337 8.63057 17.7964C8.92809 18.0666 9.15438 18.4231 9.59857 18.5469L9.59438 18.5356ZM7.22675 13.7284C6.06599 14.1299 4.94293 14.4151 4.19703 15.2482C3.34217 16.2014 3.57265 17.2672 4.72922 17.9052C4.74179 17.3685 4.93875 16.9595 5.57989 16.8544C5.73075 16.8281 5.7978 16.6818 5.86065 16.5542C6.29646 15.6498 6.73646 14.7416 7.22675 13.7284ZM20.0664 18.2017C20.6084 18.1866 20.8878 17.939 20.9045 17.4586C20.9129 17.2334 20.9171 17.0083 20.9213 16.7869C20.9213 16.5654 20.8836 16.344 21.244 16.2765C21.4912 16.2277 21.4409 15.9913 21.4619 15.8186C21.487 15.6235 21.2984 15.6198 21.1643 15.5822C20.7662 15.4696 20.364 15.3683 19.9659 15.2557C18.474 14.8354 18.319 14.9518 18.3483 16.3703C18.3567 16.693 18.4363 16.8957 18.8218 16.8994C19.3247 16.9069 19.5678 17.1509 19.6474 17.5674C19.6725 17.6988 19.7396 17.8301 19.7396 17.9615C19.7396 18.1941 19.8653 18.2467 20.0706 18.2017H20.0664Z" fill="#191921" />
                <path d="M-0.0389767 11.334C-0.0305958 11.6793 -0.0180225 12.0208 -0.0180225 12.3661C-0.0180225 16.1526 -0.0180225 19.9354 -0.0180225 23.7219C-0.0180225 23.9696 -0.0557404 24.221 0.359118 24.1948C0.359118 24.2586 0.359118 24.3224 0.359118 24.3862C-0.265265 24.7314 -0.776504 25.1742 -1.14527 25.7447C-1.45955 25.7522 -1.77803 25.7709 -2.09232 25.7709C-5.32738 25.7709 -8.56663 25.7709 -11.8017 25.7709C-11.9986 25.7709 -12.1998 25.7484 -12.3967 25.7372C-12.8116 25.1517 -13.348 24.6714 -14.0059 24.2998C-14.0059 24.1835 -14.0729 24.1197 -14.207 24.1197C-14.1903 24.0784 -14.1903 24.0221 -14.1567 23.9959C-12.6607 22.6636 -11.1647 21.3352 -9.66454 20.0104C-9.57234 19.9279 -9.49692 19.819 -9.34187 19.8115C-9.33349 21.1137 -9.29158 22.416 -9.33349 23.7182C-9.35025 24.2398 -9.02339 24.1497 -8.67977 24.1835C-8.26072 24.2248 -8.14339 24.0934 -8.14758 23.7182C-8.16853 22.1458 -8.15596 20.5733 -8.15596 19.0009C-8.15596 18.8208 -8.13501 18.6444 -8.12243 18.4643C-7.86681 18.4418 -7.70758 18.3254 -7.66567 18.0928H-7.66986C-7.46034 18.0928 -7.37653 17.9277 -7.23405 17.8376C-7.02453 17.7062 -6.9491 17.4398 -6.66834 17.3797C-6.66415 17.5111 -6.56776 17.5974 -6.47138 17.68C-4.76585 19.2073 -3.06451 20.7347 -1.35479 22.2583C-1.28355 22.3221 -1.21231 22.446 -1.06565 22.3409C-1.09498 22.157 -1.27098 22.0707 -1.3925 21.9581C-2.43175 21.0237 -3.47099 20.0892 -4.51442 19.1586C-5.18909 18.5581 -5.87633 17.9689 -6.55938 17.3722C-6.55938 17.1433 -6.34567 17.0458 -6.199 16.9107C-4.27556 15.1844 -2.35213 13.4619 -0.424501 11.7356C-0.298786 11.623 -0.131166 11.5292 -0.122786 11.3416H-0.126973C-0.0892591 11.3416 -0.0515471 11.3416 -0.0180225 11.3416L-0.0389767 11.334Z" fill="#545454" />
                <path d="M-8.16504 18.2579C-8.16504 13.702 -8.16504 9.14616 -8.16504 4.59031C-8.1399 4.55653 -8.11475 4.52276 -8.08542 4.48523C-6.27094 4.87927 -4.44807 5.20201 -2.57073 5.22828C-2.28577 5.22828 -2.00501 5.23953 -1.72006 5.23578C-1.51891 5.23578 -1.29682 5.1945 -1.32615 5.48346C-1.33034 5.54726 -1.28844 5.61856 -1.2172 5.60731C-0.861009 5.55852 -0.798148 5.71989 -0.81491 5.99009C-0.823291 6.12894 -0.655676 6.11393 -0.550914 6.13645C-0.52158 6.22276 -0.458718 6.2753 -0.362336 6.29781C-0.349765 6.38788 -0.370719 6.53799 -0.324624 6.55676C0.165665 6.74064 -0.0187197 7.11967 -0.0187197 7.42364C-0.0103378 8.66581 -0.0270977 9.90797 -0.0354786 11.1501C-0.119288 11.1877 -0.140244 11.259 -0.144435 11.334L-0.140241 11.3303C-0.370718 11.3378 -0.479671 11.5104 -0.617957 11.6342C-2.56235 13.368 -4.50255 15.1055 -6.43436 16.8468C-6.63132 17.0232 -6.80732 17.132 -7.07551 17.0044C-7.24313 16.6029 -7.64961 16.404 -7.98485 16.1488C-7.76694 16.5091 -7.54904 16.8693 -7.07132 17.0007C-6.92884 17.2371 -7.03779 17.4022 -7.23894 17.5711C-7.41075 17.7175 -7.64961 17.8338 -7.67894 18.0815L-7.67475 18.0777C-7.83399 18.1378 -7.99742 18.1941 -8.15666 18.2541L-8.16504 18.2579Z" fill="#545454" />
                <path d="M13.1272 10.2757C13.0266 11.1388 13.211 11.9119 13.9737 12.5161C14.5855 13.0002 15.6289 13.1015 16.3748 12.7413C16.9908 12.4448 17.3219 11.8106 17.2339 11.0938C17.1668 10.5459 16.6304 10.0543 16.027 9.99048C15.4906 9.93419 14.9542 10.2419 14.774 10.7035C14.6232 11.0938 14.8118 11.5854 15.1805 11.7693C15.3188 11.8368 15.4529 11.8819 15.6038 11.7918C15.7588 11.698 15.8259 11.5854 15.7672 11.4128C15.6834 11.1501 15.7169 10.9062 16.0899 10.8949C16.467 10.8874 16.5424 11.1426 16.5299 11.424C16.4963 12.1671 15.4487 12.5461 14.64 12.0995C14.07 11.7843 13.8731 11.3077 13.9066 10.7223C13.9443 10.0993 14.334 9.69777 14.8956 9.41256C15.6499 9.02978 16.4419 9.0598 17.1123 9.51763C17.9043 10.058 18.2899 10.8236 18.0971 11.7318C17.8499 12.9064 16.5508 13.7733 15.126 13.762C13.6552 13.7545 12.3939 12.8651 12.1173 11.6304C12.0502 11.3227 11.9664 11.015 12.0083 10.6998C12.3729 10.5459 12.7291 10.362 13.1272 10.2757Z" fill="#191921" />
                <path d="M13.9612 7.99785C14.8412 7.67511 15.7379 7.55878 16.6892 7.7239C18.4073 8.02787 19.7315 9.79918 19.4004 11.3453C19.2831 11.8895 19.061 12.3661 18.7132 12.8089C18.5875 12.9665 18.4031 13.1654 18.2019 13.0603C18.0176 12.9665 18.2019 12.7639 18.2732 12.6213C18.6503 11.8407 18.8892 11.0789 18.5665 10.2045C18.0385 8.76717 15.6038 8.02787 14.2335 8.92103C13.8145 9.19123 13.5505 9.559 13.2278 9.893C12.968 9.65657 13.0099 9.47269 13.3242 9.29631C13.5002 9.19498 13.6427 9.04112 13.7935 8.90602C13.8648 8.84222 13.936 8.75216 13.8187 8.68461C13.1734 8.33185 13.8103 8.20801 13.9654 7.99785H13.9612ZM13.9947 8.65459C13.9947 8.65459 13.957 8.68461 13.936 8.69962C13.9612 8.70712 13.9863 8.72213 14.0115 8.72589C14.0198 8.72589 14.0366 8.71088 14.045 8.70337C14.0282 8.68836 14.0115 8.67335 13.9947 8.65834V8.65459Z" fill="#191921" />
                <path d="M24.648 16.4678C24.7402 16.9407 24.6606 17.4173 24.6899 17.8939C24.6983 18.0027 24.6312 18.1828 24.824 18.1791C25.3352 18.1753 25.1299 18.4906 25.1509 18.712C25.021 18.682 24.8952 18.6557 24.7653 18.6257C24.6522 18.2466 24.3337 18.0515 23.9608 17.9051C23.9608 17.6049 23.3615 17.4848 23.659 17.0945C23.747 17.0983 23.8183 17.0795 23.8602 17.0045C24.208 16.9294 24.3463 16.6029 24.6438 16.4678H24.648Z" fill="#191921" />
                <path d="M-1.14941 25.7409C-0.780651 25.1705 -0.265222 24.7276 0.354971 24.3824C0.225066 24.7802 -0.202365 24.9528 -0.470556 25.253C-0.625605 25.4257 -0.85189 25.542 -0.960843 25.7521C-1.0237 25.7521 -1.08656 25.7446 -1.14941 25.7446V25.7409Z" fill="#6E6E6E" />
                <path d="M24.6469 16.4678C24.3494 16.6029 24.2111 16.9294 23.8633 17.0045C23.88 16.6555 24.3578 16.5617 24.4039 16.2277C24.4877 16.3027 24.6134 16.3477 24.6469 16.4678Z" fill="#191921" />
                <path d="M24.7725 18.6257C24.9018 18.6558 25.027 18.682 25.1563 18.712C25.1563 18.8059 25.148 18.8959 25.148 18.9898C24.8726 18.9935 24.81 18.8209 24.7766 18.6257H24.7725Z" fill="#191921" />
                <path d="M0.354763 24.3824C0.354763 24.3186 0.354763 24.2548 0.354763 24.191C0.421636 24.191 0.48433 24.191 0.551203 24.1947C0.551203 24.3111 0.488511 24.3786 0.350586 24.3786L0.354763 24.3824Z" fill="#6E6E6E" />
                <path d="M-0.152344 11.3378C-0.148189 11.2628 -0.127419 11.1915 -0.0443283 11.1539C0.00968057 11.214 0.00968057 11.274 -0.0443283 11.3378C-0.081719 11.3378 -0.119108 11.3378 -0.152344 11.3378Z" fill="#7D7D7D" />
                <path d="M8.71059 16.8995C8.31669 17.2785 8.58487 17.5187 8.90335 17.7889C9.15897 18.0103 9.50678 18.1792 9.59898 18.5282H9.59479C9.15059 18.4081 8.92431 18.0516 8.62678 17.7814C8.33764 17.5187 8.15325 17.5112 7.85573 17.7814C6.27172 19.2224 4.67096 20.6447 3.07857 22.0708C2.95286 22.1834 2.81876 22.2922 2.64276 22.4385C2.56733 22.1646 2.76428 22.0895 2.87323 21.992C4.46562 20.5584 6.05382 19.1249 7.66297 17.7101C8.0024 17.4136 8.04431 17.2184 7.67135 16.922C7.24811 16.588 6.88354 16.1977 6.49801 15.8412C6.68239 15.7699 6.80811 15.8937 6.93802 16.0101C7.19783 16.2427 7.48697 16.4566 7.70906 16.7118C8.0024 17.0458 8.29993 17.1509 8.7064 16.8882L8.71059 16.8995Z" fill="#191921" />
                <path d="M20.7534 19.7966C20.4894 20.2769 19.995 20.5734 19.6011 20.9412C18.5702 21.9019 17.5184 22.8476 16.4456 23.7707C16.0852 24.0822 16.0978 24.2811 16.4624 24.5551C16.7808 24.7952 17.0616 25.0767 17.3508 25.3469C17.422 25.4145 17.5854 25.4895 17.4639 25.5946C17.3466 25.6997 17.2753 25.5683 17.1957 25.4933C16.8353 25.1593 16.4624 24.8365 16.1104 24.495C15.9302 24.3149 15.8128 24.3299 15.6368 24.495C15.3058 24.814 14.958 25.1142 14.6102 25.4182C14.5012 25.5158 14.4132 25.6734 14.1953 25.6096C14.2121 25.437 14.3797 25.3694 14.4845 25.2718C15.6117 24.2098 16.8102 23.2116 17.9249 22.1308C18.6666 21.414 19.4502 20.7273 20.2296 20.0367C20.3763 19.9092 20.5397 19.8078 20.7492 19.7891L20.7576 19.7928L20.7534 19.7966Z" fill="#191921" />
                <path d="M9.5992 18.5319C9.82967 18.5957 9.98891 18.7533 10.1482 18.8996C11.3802 19.9954 12.608 21.0988 13.84 22.2021C13.8861 22.2433 13.9196 22.2921 13.9657 22.3409C13.7645 22.4648 13.6765 22.3184 13.5802 22.2358C12.3146 21.1063 11.0491 19.9692 9.78358 18.8396C9.6872 18.7533 9.59082 18.6707 9.59082 18.5394L9.59501 18.5356L9.5992 18.5319Z" fill="#191921" />
                <path d="M23.6667 17.0946C23.3692 17.4849 23.9726 17.6049 23.9684 17.9052C23.7966 17.9089 23.696 17.8038 23.5996 17.7025C23.4739 17.5712 23.3398 17.5261 23.168 17.6387L23.1596 17.6312C23.2057 17.4023 23.0842 17.2447 22.9124 17.0833C22.5939 16.7943 22.2251 16.5392 22.0156 16.1564C22.4682 16.3628 22.7992 16.7005 23.1219 17.0308C23.3231 17.2372 23.4572 17.2672 23.6709 17.0946H23.6667Z" fill="#191921" />
                <path d="M21.5591 19.076C21.3914 19.4062 21.1232 19.6464 20.7545 19.7965L20.7461 19.7927C20.809 19.3687 21.1358 19.181 21.5507 19.0722L21.5591 19.0797V19.076Z" fill="#191921" />
                <path d="M22.3548 18.3518C22.4134 17.9277 22.7445 17.7401 23.1552 17.6312L23.1635 17.6387C22.9917 17.9652 22.7277 18.2092 22.359 18.3593L22.3506 18.3518H22.3548Z" fill="#191921" />
                <path d="M21.5501 19.0723C21.6129 18.6482 21.9398 18.4606 22.3547 18.3517C22.3547 18.3517 22.3588 18.3555 22.3588 18.3593C22.1912 18.6895 21.923 18.9297 21.5543 19.0798L21.5459 19.0723H21.5501Z" fill="#191921" />
                <path d="M23.9639 17.9014C24.3368 18.0478 24.6553 18.2429 24.7684 18.622C24.4164 18.4606 24.0519 18.303 23.9639 17.9014Z" fill="#191921" />
                <path d="M23.8659 17.0045C23.8243 17.0789 23.7535 17.1012 23.666 17.0938C23.7077 17.0157 23.7826 17.0008 23.8659 17.0045Z" fill="#545454" />
                <path d="M13.993 8.65832C13.993 8.65832 14.0259 8.6881 14.0423 8.70298C14.03 8.71043 14.0177 8.72903 14.0094 8.72531C13.9848 8.72159 13.9602 8.71043 13.9355 8.69926C13.9561 8.68437 13.9725 8.66949 13.993 8.6546V8.65832Z" fill="#545454" />
              </svg>
            </div>
            <p className="text-orange-color text-[.7rem]">
              Check IN
            </p>
          </button>


        </section>

      </div>
      <article className="w-full flex items-center justify-center mt-6 ">
        <article className="px-2 w-full max-w-[600px]">
          {!isLoading && allBadges && <section className="text-white text-left font-bold">
            <div className="flex">
              <p className="">{Localization["top"][lang]}</p>
              <p className="rounded-full bg-orange-color w-5 h-5 text-center ml-1 mt-[.1rem] text-sm pr-[0.1rem]">4</p>
            </div>
            <h3 className="text-3xl">{Localization["leaders"][lang]}</h3>
          </section>}

          {!isLoading && allBadges &&
            <section onClick={() => navigate("/score-board")}
              className="mt-2 pt-1 flex flex-col justify-center items-center score-box  h-auto min-h-[7rem] md:min-h-[10rem]">
              {topFour.map(item => (
                <TopFour key={item?.id} item={item} user={user} badges={allBadges} />
              ))}
            </section>}

          {isLoading && <section className="mt-2 flex justify-center items-center score-box h-[15vh] border">
            <Circles
              height="30"
              width="50"
              radius="9"
              color="#FF4C01"
              ariaLabel="three-dots-loading"
              wrapperStyle={{}}
              wrapperClassName=""
              visible={true}
            />
          </section>}

          <div className="score-box-bottom"></div>

        </article>
      </article>

      <Footer />

    </div >
  );
};

export default CreateGame;