import React, { useEffect, Suspense, useState } from "react";
import { clearCacheApiData } from "./utils/utilFunc"
import { useHome } from "./context/HomeContext";
import { useAuth } from "./context/auth";
import TagManager from "react-gtm-module";
import socket from "./utils/socket.io";
import {
  Route,
  Routes,
  Navigate,
  useNavigate
} from "react-router-dom";
import ToastContainer from "./utils/ToastContainer";
import League from "./components/League/League";
import LeagueHistory from "./components/League/LeagueHistory";
import PlayLeagueInvite from "./components/League/components/PlayLeagueInvite";
import LeagueGame from "./components/League/LeagueGame";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import LeagueGameIsActiveModal from "./components/League/components/LeagueGameIsActiveModal";
//'G-YM283P3T0J'
const tagManagerArgs = {
  gtmId: process.env.REACT_APP_GTM_ID,
};

const SplashScreen = React.lazy(() => import("./components/SplashScreen"));
// import SplashScreen from "./components/SplashScreen"
const Success = React.lazy(() => import("./components/Success"));

const CreateGame = React.lazy(() => import("./components/CreateGame"));
const JoinGame = React.lazy(() => import("./components/JoinGame"));
const NewGame = React.lazy(() => import("./components/NewGame"));
const AlreadyJoined = React.lazy(() => import("./components/AlreadyJoined"));
const PublicGames = React.lazy(() => import("./components/PublicGames"));
const NewGamePublic = React.lazy(() => import("./components/NewGamePublic"));
const PlayerBoard = React.lazy(() => import("./Scoreboard/PlayerHistory"));
const ScoreBoard = React.lazy(() => import("./Scoreboard/ScoreBoard"));
const Signup = React.lazy(() => import("./components/Auth/Signup"));
const Login = React.lazy(() => import("./components/Auth/Login"));
const ForgotPassword = React.lazy(() =>
  import("./components/Auth/ForgotPassword")
);
const Profile = React.lazy(() => import("./components/Profile/Profile"));
const Game = React.lazy(() => import("./Game/Game"));

const Store = React.lazy(() => import("./components/Store/Store"));
const PrivacyPolicy = React.lazy(() => import("./components/PrivacyPolicy"));
const AvatarHistory = React.lazy(() => import("./components/Store/AvatarHistory"))



const App = () => {

  const { checked } = useHome();
  const { user, setUser, token, login } = useAuth();
  const navigate = useNavigate()

  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false)
  const [activeSeasons, setActiveSeasons] = useState(null)

  const [fetchedSeasons, setFetchedSeasons] = useState(false)


  const [inviteData, setInviteData] = useState(null)


  useEffect(() => {
    TagManager.initialize(tagManagerArgs);

    window.addEventListener('beforeunload', clearCacheApiData);

    return () => {
      // Remove event listener when component unmounts
      window.removeEventListener('beforeunload', clearCacheApiData);
      console.log("triggered")
      localStorage.getItem("seasonId") && localStorage.removeItem("seasonId")
      localStorage.getItem("gameId") && localStorage.removeItem("gameId")
      localStorage.getItem("gamePlayers") && localStorage.removeItem("gamePlayers")
    };


    //
  }, []);


  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to Socket.io server ");

      // socket.on("play-league-invite", data => {
      //   console.log(user)
      //   if (user && user.id !== data.sender.id && !isInviteModalOpen) {
      //     setInviteData(data)
      //     setIsInviteModalOpen(true)
      //   }
      // })


    });

  });


  const checkInUser = (seasonId) => {

    const { id, username, profile_image, game_point, default_board, default_crown } = user

    socket.on("play-league-invite", data => {
      console.log(user)
      if (user && user.id !== data.sender.id && !isInviteModalOpen) {
        setActiveSeasons(null)
        setInviteData(data)
        setIsInviteModalOpen(true)
      }
    })

    socket.on("leauge-game-started", data => {
      if (data.gameId && data.seasonId) {
        setActiveSeasons(null)
        setIsInviteModalOpen(false)
        navigate(`/league-game/${data.gameId}`)
        localStorage.setItem("seasonId", data.seasonId)
        console.log("League game started", data)
        localStorage.setItem("gamePlayers", JSON.stringify({
          p1: data.playerOne, p2: data.playerTwo
        }))
      }
    })

    socket.emit("checkInLeague", {
      seasonId: seasonId,
      userData: { id, username, profile_image, game_point, default_board, default_crown }
    });

    // socket.emit("clearSeason", {
    //   seasonId: "1234s"
    // });
  }

  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
  };

  const fetchSeasonsMutation = useMutation(
    async (newData) =>
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}player-season/${user.id}`, newData, {
        headers,
      }),
    {
      retry: false,
    }
  );

  const fetchSeasons = async (values) => {
    try {
      fetchSeasonsMutation.mutate(
        {},
        {
          onSuccess: (responseData) => {
            const seasons = responseData?.data?.data

            console.log(seasons)
            seasons.length > 0 && setActiveSeasons([...seasons])
            seasons.forEach((season) => {
              season.is_active_season && checkInUser(season.id)
            })

            // login(token, {
            //   ...user,
            //   seasons: [...seasons]
            // })

            // 
            localStorage.setItem("dama-user-seasons", JSON.stringify(seasons));

            setFetchedSeasons(prev => !prev)
          },
          onError: (err) => { },
          enabled: user ? true : false,
        },
      );
    } catch (err) { }
  };

  useEffect(() => {
    console.log("first")
    !localStorage.getItem("setIsReloading") &&
      user && fetchSeasons()

    localStorage.removeItem("setIsReloading")


    useEffect(() => {
      let userSeasons = localStorage.getItem("dama-user-seasons")
      if (user && userSeasons) {
        if (user.seasons) {
          console.log("here", user.seasons.length, JSON.parse(userSeasons).length)

          if (user.seasons.length !== JSON.parse(userSeasons).length) {
            setUser({ ...user, seasons: [...JSON.parse(userSeasons)] })
          }
        }
      }
    }, [fetchedSeasons])

    const HomeComp = () => {
      return (
        <>
          {isInviteModalOpen && <PlayLeagueInvite
            isInviteModalOpen={isInviteModalOpen}
            setIsInviteModalOpen={setIsInviteModalOpen}
            inviteData={inviteData} />}

          {activeSeasons && <LeagueGameIsActiveModal activeSeasons={activeSeasons} setActiveSeasons={setActiveSeasons} />}

          <Routes>
            <Route path="*" element={<Navigate to="/create-game" />} />
            <Route path="/create-game" element={<CreateGame />} />
            <Route path="/new-game" element={<NewGame />} />
            <Route path="/join-game" element={<JoinGame />} />
            <Route path="/join-game/:id" element={<JoinGame />} />
            <Route path="/game" element={<Game />} />
            <Route path="/game/:id" element={<Game />} />
            <Route path="/already-joined" element={<AlreadyJoined />} />
            <Route path="/score-board" element={<ScoreBoard />} />
            <Route path="/player-board" element={<PlayerBoard />} />
            <Route
              path="/profile"
              element={user && token ? <Profile /> : <Navigate to="/login" />}
            />
            <Route path="/join-public" element={<PublicGames />} />
            <Route path="/new-game-public" element={<NewGamePublic />} />
            <Route path="/store" element={<Store />} />
            <Route path="/avatar-history/:id" element={<AvatarHistory />} />
            <Route path="/payment/success" element={<Success />} />

            <Route path="/league" element={<League />} />
            <Route path="/league/:id" element={<LeagueHistory
              isInviteModalOpen={isInviteModalOpen}
              setIsInviteModalOpen={setIsInviteModalOpen}
              setInviteData={setInviteData} />} />
            <Route path="/league-game/:id" element={<LeagueGame />} />


            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="*" element={<CreateGame />} />
          </Routes>
        </>
      );
    };

    const AuthComp = () => {
      return (
        <>
          <Routes>
            <Route path="" element={<Navigate to="/create-game" />} />
            <Route path="/create-game" element={<CreateGame />} />
            <Route path="/new-game" element={<NewGame />} />
            <Route path="/join-game" element={<JoinGame />} />
            <Route path="/join-game/:id" element={<JoinGame />} />
            <Route path="/game" element={<Game />} />
            <Route path="/game/:id" element={<Game />} />
            <Route path="/already-joined" element={<AlreadyJoined />} />
            <Route path="/score-board" element={<ScoreBoard />} />
            <Route path="/player-board" element={<PlayerBoard />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/join-public" element={<PublicGames />} />
            <Route path="/new-game-public" element={<NewGamePublic />} />
            <Route path="/store" element={<Store />} />
            <Route path="/avatar-history/:id" element={<AvatarHistory />} />

            <Route path="/league" element={<League />} />
            <Route path="/league/:id" element={<LeagueHistory
              isInviteModalOpen={isInviteModalOpen}
              setIsInviteModalOpen={setIsInviteModalOpen}
              setInviteData={setInviteData} />} />

            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="*" element={<Navigate to="/create-game" />} />
          </Routes>
        </>
      );
    };
    function RoutComp() {
      if (token && user) {
        return <HomeComp />;
      } else {
        return <AuthComp />;
      }
    }
    return (
      <>
        {checked ? (
          <Suspense fallback={<SplashScreen />}>
            <ToastContainer />
            <RoutComp />
          </Suspense>
        ) : (
          <SplashScreen />
        )}
      </>
    );
  };

  export default App;
