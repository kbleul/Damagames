import React, { useEffect } from "react";
import SplashScreen from "./components/SplashScreen";
import { useHome } from "./context/HomeContext";
import { CreateGame, NewGame, JoinGame } from "./components";
import AlreadyJoined from "./components/AlreadyJoined";
import PublicGames from "./components/PublicGames";
import NewGamePublic from "./components/NewGamePublic";

import PlayerBoard from "./Scoreboard/PlayerHistory";
import ScoreBoard from "./Scoreboard/ScoreBoard";
import Signup from "./components/Auth/Signup";
import ForgotPassword from "./components/Auth/ForgotPassword";
import { Route, Routes, Navigate, NavLink, useNavigate } from "react-router-dom";
import Game from "./Game/Game";
import socket from "./utils/socket.io";
import ErrorPage from "./components/ErrorPage";
import Login from "./components/Auth/Login";
import Profile from "./components/Profile/Profile";
import { useAuth } from "./context/auth";
import TagManager from "react-gtm-module";
import Store from "./components/Store";
import PrivacyModal from "./components/PrivacyModal";


//'G-YM283P3T0J'
const tagManagerArgs = {
  gtmId: process.env.REACT_APP_GTM_ID
};

const App = () => {
  const { checked } = useHome();
  const { user, token } = useAuth();
  const firstPlayer = JSON.parse(localStorage.getItem("playerOne"));
  const secondPlayer = JSON.parse(localStorage.getItem("playerTwo"));

  useEffect(() => {
    TagManager.initialize(tagManagerArgs)
  }, []);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to Socket.io server");
    });
  });

  const HomeComp = () => {
    return (<>
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
        <Route path="/profile" element={user && token ? <Profile /> : <Navigate to="/login" />} />
        <Route path="/join-public" element={<PublicGames />} />
        <Route path="/new-game-public" element={<NewGamePublic />} />
        <Route path="/store" element={<Store />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="*" element={<CreateGame />} />

      </Routes>

    </>
    );
  };

  const AuthComp = () => {
    return (<>
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
        <Route path="/profile" element={user && token ? <Profile /> : <Navigate to="/login" />} />
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
  return <>{checked ? <RoutComp /> : <SplashScreen />}</>;
};

export default App;

