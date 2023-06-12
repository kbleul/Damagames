import { createContext, useState, useEffect, useContext } from "react";

const HomeContext = createContext<any | null>(null);

export function useHome() {
  return useContext(HomeContext);
}

export function HomeProvider({ children }: any) {
  const [checked, setChecked] = useState<boolean>(false);
  const [isSideBarOpen, setIsSideBarOpen] = useState<boolean>(true);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isSmallScreen, setIsSmallScreen] = useState<boolean>(false);

  useEffect(() => {
    setTimeout(() => setChecked(true), 2000);
  }, []);

  //Return
  return (
    <HomeContext.Provider
      value={{
        checked,
        isSideBarOpen, setIsSideBarOpen,isOpen, setIsOpen,
        isSmallScreen, setIsSmallScreen
      }}
    >
      {children}
    </HomeContext.Provider>
  );
}
