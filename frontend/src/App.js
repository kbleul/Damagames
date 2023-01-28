import React, { useEffect } from "react";
import SplashScreen from "./components/SplashScreen";
import { useHome } from "./context/HomeContext";
import { CreateGame, NewGame, JoinGame } from "./components";
import AlreadyJoined from "./components/AlreadyJoined";
import PlayerBoard from "./Scoreboard/PlayerHistory";
import ScoreBoard from "./Scoreboard/ScoreBoard";
import Signup from "./components/Auth/Signup";
import ForgotPassword from "./components/Auth/ForgotPassword";
import { Route, Routes, Navigate, useNavigate } from "react-router-dom";
import Game from "./Game/Game";
import socket from "./utils/socket.io";
import ErrorPage from "./components/ErrorPage";
import Login from "./components/Auth/Login";
import Profile from "./components/Profile/Profile";
import { useAuth } from "./context/auth";
import PublicGame from "./components/PublicGame";
const App = () => {
  const { checked } = useHome();
  const { user, token } = useAuth();
  const firstPlayer = JSON.parse(localStorage.getItem("playerOne"));
  const secondPlayer = JSON.parse(localStorage.getItem("playerTwo"));
  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to Socket.io server");
    });
  });

  const HomeComp = () => {
    return (
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
        <Route path="/profile" element={<Profile />} />
        <Route path="/pubic-game" element={<PublicGame />} />
      </Routes>
    );
  };

  const AuthComp = () => {
    return (
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
        <Route path="/pubic-game" element={<PublicGame />} />
      </Routes>
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
