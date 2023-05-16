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

import Avatar from "../assets/Avatar.png";
import { Circles } from "react-loader-spinner";
import { SORTBY, LANG } from "../utils/data"
import { sortScoreBoard } from "../utils/utilFunc"



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
        console.log(res.data.data)
        let sortedArr = sortScoreBoard(SORTBY.PERSON, res.data.data)


        setTopFour(sortedArr)

        sortedArr = []
        setIsLoading(false)
      },
      enabled: true
    }
  );


  useEffect(() => {
    localStorage.removeItem("isNotPublic");
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

  // by = computer person coin


  useEffect(() => {
    console.log(topFour)
  }, [topFour])

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

      <SideMenu showMenu={showMenu} setShowMenu={setShowMenu} />

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
            <div className="h-6 w-8 bg-orange-color px-2 flex justify-center items-center rounded-sm">
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
            <div className="h-6 w-8 bg-orange-color px-2 fle
          x justify-center items-center pt-1">
              <svg
                width="18"
                height="18"
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


        </section>

      </div>
      <article className="w-full flex items-center justify-center mt-6">
        <article className="w-4/5  max-w-[500px]">
          <section className="text-white text-left font-bold">
            <div className="flex">
              <p className="">{Localization["top"][lang]}</p>
              <p className="rounded-full bg-orange-color w-5 h-5 text-center ml-1 mt-[.1rem] text-sm pr-[0.1rem]">4</p>
            </div>
            <h3 className="text-3xl">{Localization["leaders"][lang]}</h3>
          </section>

          {!isLoading &&
            <section onClick={() => navigate("/score-board")} className="mt-2 flex justify-center items-center score-box h-[15vh] min-h-[7rem] md:min-h-[10rem] border">
              {topFour.map(item => (
                <div className="mx-1 mt-4 mb-2 flex-grow w-1/4 cursor-pointer">
                  <div className="h-16 md:h-24 border border-orange-color rounded-md flex items-center justify-center overflow-hidden">
                    <img className="w-full" src={item.profile_image ? item.profile_image : Avatar} alt="" />
                  </div>
                  <p className="text-white text-xs md:text-base text-left  pl-1 font-bold">{item.username ? item.username : " - "}</p>
                  <p className="text-orange-color text-[.6rem]  md:text-sm text-left pl-1">{item.match_history.wins} wins</p>
                </div>
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