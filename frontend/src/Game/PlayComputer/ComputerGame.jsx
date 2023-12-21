import React, { useState } from "react";
import { ColorObj } from "./classes/Piece";

import Game from "./classes/Game";
import { handleSquareClick } from "./utils/logic";


const ComputerGame = () => {

  const [CreatedGame,] = useState(new Game());
  const gameBoard = CreatedGame.gameBoard

  const [boardState, setBoardState] = useState([...CreatedGame.gameBoard.board])

  const [moveFrom, setMoveFrom] = useState(null)


  return (
    <article className="text-white ml-[10%] w-4/5 h-[60vh]  mt-0 border ">
      {boardState && boardState && boardState.length > 0 && boardState.map((boardRowArr, indexRow) =>
        <section key={indexRow + "-row-" + indexRow} className="w-full h-[12.5%] border flex">
          {boardRowArr.map((boardCol, indexCol) =>
            <button key={indexCol + "-col-" + indexCol} className="w-[12.5%] h-full border-l border-r flex items-center justify-center"
              onClick={() => boardCol ?
                handleSquareClick({ clickedRow: indexRow, clickedCol: indexCol }, moveFrom, false, CreatedGame, gameBoard, { setMoveFrom, setBoardState }) :
                handleSquareClick({ clickedRow: indexRow, clickedCol: indexCol }, moveFrom, true, CreatedGame, gameBoard, { setMoveFrom, setBoardState })}>
              {boardCol && <div
                className={boardCol.color === ColorObj.RED ? "w-4 h-4 rounded-full bg-red-500 text-white text-xs" : "w-4 h-4 rounded-full bg-white text-black text-xs"} >{boardCol.color}</div>}
            </button>
          )}
        </section>)
      }
    </article >)
};

export default ComputerGame;
