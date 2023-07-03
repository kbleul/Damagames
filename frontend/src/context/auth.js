import {
  createContext,
  useState,
  useCallback,
  useEffect,
  useContext,
} from "react";
import { Localization } from "../utils/language";
import socket from "../utils/socket.io";


const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [lang, setLang] = useState(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => { }, [user]);

  const login = useCallback((token, user) => {
    setToken(token);
    setUser(user);
    localStorage.setItem(
      "dama_user_data",
      JSON.stringify({
        token,
        user,
      })
    );
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("dama_user_data");
    localStorage.getItem("dama-user-seasons") && localStorage.removeItem("dama-user-seasons");

    socket.emit("remove-from-active-league")
  }, []);

  let loginData;

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("dama_user_data"));
    if (storedData) {
      if (storedData?.token) {
        loginData = login(storedData?.token, storedData?.user);
        setTimeout(() => setChecked(true), 300);
      }

      setTimeout(() => setChecked(true), 300);
    }
    setTimeout(() => setChecked(true), 300);
  }, [loginData]);

  useEffect(() => {
    if (localStorage.getItem("lang")) {
      setLang(localStorage.getItem("lang"));
    } else {
      setLang("ENG");
      localStorage.setItem("lang", "ENG");
    }
  }, [])

  const setLanguage = (pref) => {
    setLang(pref);
    localStorage.setItem("lang", pref)
  }


  //Return
  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        checked,
        login,
        logout,
        setUser,
        setToken,
        lang,
        setLanguage,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
