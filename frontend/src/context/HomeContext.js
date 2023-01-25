import { createContext, useState, useEffect, useContext } from "react";

const HomeContext = createContext();

export function useHome() {
  return useContext(HomeContext);
}

export function HomeProvider({ children }) {
  const [checked, setChecked] = useState(false);
 
  // const [tokenExpirationDate, setTokenExpirationDate] = useState();

  useEffect(() => {
    setTimeout(() => setChecked(true), 2000);
  }, []);

  //Return
  return (
    <HomeContext.Provider
      value={{
        checked,
      
      }}
    >
      {children}
    </HomeContext.Provider>
  );
}
