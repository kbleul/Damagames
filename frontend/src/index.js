import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import swConfig from './swConfig'
import { HomeProvider } from "./context/HomeContext";
import { TurnProvider } from "./context/TurnContext";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/auth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import * as Sentry from "@sentry/react";
import reportWebVitals from "./reportWebVitals";

process.env.REACT_APP_NODE_ENV === "production" && Sentry.init({
  dsn: "https://70f27f61dade58bb212e8c376afaa534@o4505741745520640.ingest.sentry.io/4505741747421184",
  integrations: [
    new Sentry.BrowserTracing({
      // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
      tracePropagationTargets: ["https://damagames.com/"],
    }),
    new Sentry.Replay(),
  ],
  // Performance Monitoring
  tracesSampleRate: 0.3, // Capture 100% of the transactions, reduce in production!
  // Session Replay
  replaysSessionSampleRate: 0.3, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
});

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
serviceWorkerRegistration.register(swConfig, { mode: "standalone", prefersRelatedApplications: "true", });

process.env.REACT_APP_NODE_ENV === "production" && reportWebVitals()