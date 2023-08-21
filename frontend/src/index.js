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

Sentry.init({
  dsn: "https://70f27f61dade58bb212e8c376afaa534@o4505741745520640.ingest.sentry.io/4505741747421184",
  integrations: [
    new Sentry.BrowserTracing({
      // See docs for support of different versions of variation of react router
      // https://docs.sentry.io/platforms/javascript/guides/react/configuration/integrations/react-router/
      routingInstrumentation: Sentry.reactRouterV6Instrumentation(
        React.useEffect,
        useLocation,
        useNavigationType,
        createRoutesFromChildren,
        matchRoutes
      ),
    }),
    new Sentry.Replay()
  ],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  tracesSampleRate: 1.0,

  // Set `tracePropagationTargets` to control for which URLs distributed tracing should be enabled
  tracePropagationTargets: ["localhost", /^https:\/\/yourserver\.io\/api/],

  // Capture Replay for 10% of all sessions,
  // plus for 100% of sessions with an error
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
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

reportWebVitals()