import React from "react";
import Route from "./routes/Route";
import { useAuth } from "./context/Auth";

const App: React.FC = () => {
  const {  checked } = useAuth();
  return (
    <>
      {checked ? (
        <Route />
      ) : (
        <div>
          <h1>Loading</h1>
        </div>
      )}
    </>
  );
};

export default App;
