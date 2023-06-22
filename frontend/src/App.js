import React, { useEffect, Suspense, useState } from "react";
import { clearCacheApiData } from "./utils/utilFunc"
import { useHome } from "./context/HomeContext";
import { useAuth } from "./context/auth";
import TagManager from "react-gtm-module";
import socket from "./utils/socket.io";
import {
  Route,
  Routes,
  Navigate
} from "react-router-dom";
import ToastContainer from "./utils/ToastContainer";
import League from "./components/League/League";
import LeagueHistory from "./components/League/LeagueHistory";
import DrawGameModal from "./components/League/components/invite";
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
const ErrorPage = React.lazy(() => import("./components/ErrorPage"));
const PrivacyPolicy = React.lazy(() => import("./components/PrivacyPolicy"));
const AvatarHistory = React.lazy(() => import("./components/Store/AvatarHistory"))



const App = () => {

  const { checked } = useHome();
  const { user, token } = useAuth();

  const [isDrawModalOpen, setisDrawModalOpen] = useState(false)

  useEffect(() => {
    TagManager.initialize(tagManagerArgs);

    window.addEventListener('beforeunload', clearCacheApiData);

    return () => {
      // Remove event listener when component unmounts
      window.removeEventListener('beforeunload', clearCacheApiData);
    };

  }, []);


  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to Socket.io server ");

      socket.on("play-league-invite", data => {
        console.log(data)
        !isDrawModalOpen && setisDrawModalOpen(true)
      })
    });

  });


  const HomeComp = () => {
    return (
      <>
        <DrawGameModal isDrawModalOpen={isDrawModalOpen} setIsDrawModalOpen={setisDrawModalOpen} />

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
          <Route path="/league/:id" element={<LeagueHistory />} />

          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="*" element={<CreateGame />} />
        </Routes>
      </>
    );
  };

  const AuthComp = () => {
    return (
      <>
        <DrawGameModal isDrawModalOpen={isDrawModalOpen} setIsDrawModalOpen={setisDrawModalOpen} />
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
          <Route path="/league/:id" element={<LeagueHistory />} />

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
