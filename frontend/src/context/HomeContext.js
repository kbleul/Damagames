import { createContext, useState, useEffect, useContext } from "react";

const HomeContext = createContext();

export function useHome() {
  return useContext(HomeContext);
}

export function HomeProvider({ children }) {
  const [checked, setChecked] = useState(false);
  const [isBet, setIsBet] = useState(false)
  const [betCoin, setBetCoin] = useState(0)

  // const [tokenExpirationDate, setTokenExpirationDate] = useState();

  useEffect(() => {
    setTimeout(() => setChecked(true), 2000);
  }, []);

  //Return
  return (
    <HomeContext.Provider
      value={{
        checked, isBet, setIsBet,
        betCoin, setBetCoin
      }}
    >
      {children}
    </HomeContext.Provider>
  );
}
