import {
  createContext,
  useState,
  useCallback,
  useEffect,
  useContext,
} from "react";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {}, [user]);

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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
