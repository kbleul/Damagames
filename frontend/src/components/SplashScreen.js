import React, { Component } from "react";
import background from "../assets/backdrop.jpg";
const SplashScreen = () => {
  return (
    <div
      style={{
        backgroundImage: `url(${background})`,
        backgroundPosition: "center",
        minWidth: "100vw",
        minHeight: "100vh",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        width: "100%",
        overflow: "hidden",
      }}
    ></div>
  );
};

export default SplashScreen;
