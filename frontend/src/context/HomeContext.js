import { createContext, useState, useEffect, useContext } from "react";

const HomeContext = createContext();

export function useHome() {
  return useContext(HomeContext);
}

export function HomeProvider({ children }) {
  const [checked, setChecked] = useState(false);
  const [isBet, setIsBet] = useState(false);
  const [betCoin, setBetCoin] = useState(0);
  const [messageType, setMessageType] = useState(null);
  const [playerCrown, setPlayerCrown] = useState(
    localStorage.getItem("playerCrown")
  );
  const [playerBoard, setPlayerBoard] = useState(
    localStorage.getItem("playerBoard")
  );

  useEffect(() => {
    setTimeout(() => setChecked(true), 2000);
  }, []);

  //Return
  return (
    <HomeContext.Provider
      value={{
        checked,
        isBet,
        setIsBet,
        betCoin,
        setBetCoin,
        messageType,
        setMessageType,
        playerCrown,
        setPlayerCrown,
        playerBoard,
        setPlayerBoard,
      }}
    >
      {children}
    </HomeContext.Provider>
  );
}
