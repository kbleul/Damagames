import React from "react";
import { Login } from "../pages";
import { Routes, Route, Navigate } from "react-router-dom";
const NoAuthRoutes = () => {
  return (
    <Routes>
      <Route path="*" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
};

export default NoAuthRoutes;
