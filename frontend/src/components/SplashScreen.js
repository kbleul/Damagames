import React, { Component } from "react";
import background from "../assets/backdrop.jpg";
import { Circles } from "react-loader-spinner";

const SplashScreen = () => {
  return (
    <div className="flex items-center justify-center"
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
    >
      <Circles
        height="50"
        width="70"
        radius="9"
        color="#FF4C01"
        ariaLabel="three-dots-loading"
        wrapperStyle={{}}
        wrapperClassName=""
        visible={true}
      />

    </div>
  );
};

export default SplashScreen;
