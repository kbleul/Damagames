import React from "react";
import orange from "../assets/orange-coin.svg";
import yellow from "../assets/yellow-coin.svg";
const Board = () => {
  const horizontal = ["a", "b", "c", "d", "e", "f", "8", "h"];
  const vertical = ["1", "2", "3", "4", "5", "6", "7", "8"];

  let sum = 0;
  let playBoard = [];


  for (let i = 7; i >= 0; i--) {
    for (let j = 0; j < 8; j++) {
      sum += 1;
      const number = j + i + 2;
      if (number % 2 == 0) {
        playBoard.push(
          <div className="relative bg-red-500 w-[75px] h-[75px]"></div>
        );
      } else {
        sum <= 24 &&
          playBoard.push(
            <div      
              style={{
                backgroundImage:`url(${yellow})`,
                backgroundPosition:"center",
                backgroundRepeat:"no-repeat",
              }}
              className="w-[75px] h-[75px] bg-[#181920] cursor-grab border-l-2 border-t-2 border-[#FF4C01]"
            ></div>
          );
        if (sum > 24 && sum < 40) {
          playBoard.push(
            <div className="w-[75px] h-[75px] bg-[#181920] "></div>
          );
        }

        sum >= 40 &&
          playBoard.push(
            <div
              style={{
                backgroundImage: `url(${orange})`,
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
              className="w-[75px] h-[75px] bg-[#181920] border-l-2 border-t-2 border-[#FF4C01]"
            ></div>
          );
      }
    }
  }
  return (
    <div className="grid grid-cols-8 w-[600px] h-[600px] bg-[#2C2C37]">
      {playBoard}
    </div>
  );
};

export default Board;
