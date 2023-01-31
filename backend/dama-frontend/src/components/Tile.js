import React from "react";
import orange from "../assets/orange-coin.svg";
const Tile = ({number,image,index}) => {
  if (number % 2 === 0) {
    return <div >{index}</div>;
  } else {
    return (
      <div
        style={{
          backgroundImage: `url(${image})`,
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
        className="w-[75px] h-[75px] bg-[#181920] border-l-2 border-t-2 border-[#FF4C01]"
      >{index}</div>
    );
  }
};

export default Tile;
