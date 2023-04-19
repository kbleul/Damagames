import React from "react";
import { useAuth } from "../context/Auth";
import NoAuthRoutes from "./NoAuthRoutes";
import AuthRoutes from "./AuthRoutes";

const Route = () => {
  const { user, token } = useAuth();
  return <>{!user && !token ? <NoAuthRoutes /> : <AuthRoutes />}</>;
};

export default Route;
