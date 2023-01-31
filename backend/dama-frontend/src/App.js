import React, { useEffect } from "react";
import SplashScreen from "./components/SplashScreen";
import { useHome } from "./context/HomeContext";
import { CreateGame, NewGame, JoinGame } from "./components";
import {
  Route,
  Routes,
  Navigate,
  useNavigate,
} from "react-router-dom";
import Game from "./Game/Game";
import Pusher from "pusher-js";

const App = () => {
  const { checked } = useHome();
  const navigate = useNavigate();
  const gameId = localStorage.getItem("gameId");
  const firstPlayer = JSON.parse(localStorage.getItem("playerOne"));
  const secondPlayer = JSON.parse(localStorage.getItem("playerTwo"));
  // useEffect(() => {
  //   const pusher = new Pusher(process.env.REACT_APP_PUSHER_KEY, {
  //     cluster: "ap2",
  //     encrypted: false,
  //     authEndpoint: `${process.env.REACT_APP_BACKEND_URL}sockets/authenticate`,
  //   });
  //   // Pusher.logToConsole = true;
  //   if (gameId) {
  //     const channel1 = pusher.subscribe(`private-dama.${gameId}`, {
  //       authEndpoint: `${process.env.REACT_APP_BACKEND_URL}sockets/authenticate`,
  //     });
  //     channel1.bind("joined", function (data) {
  //       console.log("app", data);
  //     });
  //   }
  //   var callback = (started, data) => {
  //     // console.log({data});
  //     if (data.status === "started") {
  //       navigate("/game");
  //       //  localStorage.setItem('playerOne',JSON.stringify(data.playerOne))
  //       //  localStorage.setItem('playerTwo',JSON.stringify(data.playerTwo))
  //     }
  //   };
  //   pusher.bind_global(callback);
  // }, [gameId, navigate]);

  return (
    <>
      {checked ? (
        firstPlayer && secondPlayer ? (
          <Routes>
            <Route path="" element={<Navigate to="/create-game" />} />
            <Route path="/create-game" element={<CreateGame />} />
            <Route path="/new-game" element={<NewGame />} />
            <Route path="/join-game" element={<JoinGame />} />
            <Route path="/join-game/:id" element={<JoinGame />} />
            <Route path="/game" element={<Game />} />
          </Routes>
        ) : (
          <Routes>
            <Route path="*" element={<Navigate to="/create-game" />} />
            <Route path="/create-game" element={<CreateGame />} />
            <Route path="/new-game" element={<NewGame />} />
            <Route path="/join-game" element={<JoinGame />} />
            <Route path="/join-game/:id" element={<JoinGame />} />
          </Routes>
        )
      ) : (
        // <Game />
        <SplashScreen />
      )}
    </>
  );
};

export default App;
