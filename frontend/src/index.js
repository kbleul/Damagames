import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import { HomeProvider } from "./context/HomeContext";
import { TurnProvider } from "./context/TurnContext";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/auth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();
const root = ReactDOM.createRoot(document.getElementById("root"));



root.render(
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <BrowserRouter>
        <HomeProvider>
          <TurnProvider>
            <App />
          </TurnProvider>
        </HomeProvider>
      </BrowserRouter>
    </AuthProvider>
  </QueryClientProvider>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA

serviceWorkerRegistration.register({
  onUpdate: (e) => {
    const { waiting } = e || {};
    const { postMessage = null } = waiting || {};
    const { update } = e || {};

    if (postMessage) {
      postMessage({ type: 'SKIP_WAITING' });
    }
    update().then(() => {
      window.location.reload();
    });
  },
});
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
