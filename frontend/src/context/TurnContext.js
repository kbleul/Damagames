import {  useState , createContext } from "react";
  
 export const TurnContext = createContext();
  
  
  export function TurnProvider({ children }) {
    const [MyTurn, setMyTurn] = useState("player1");
  
    //Return
    return (
      <TurnContext.Provider value={[MyTurn, setMyTurn]}>{children}</TurnContext.Provider>
    );
  }
  