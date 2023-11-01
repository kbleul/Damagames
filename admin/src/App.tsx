import React from "react";
import Route from "./routes/Route";
import { useAuth } from "./context/Auth";

const App: React.FC = () => {
  const { checked } = useAuth();
  return (
    <div className="bg-[#f0f0f0]">
      {checked ? (
        <Route />
      ) : (
        <div>
          <h1>Loading</h1>
        </div>
      )}
    </div>
  );
};

export default App;
