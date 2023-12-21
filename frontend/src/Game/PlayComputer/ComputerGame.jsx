import React, { useRef, useState } from "react";
import { createBoardWithPieces } from "./utils/test";
import { ColorObj, Position } from "./classes/Piece";
import Human from "./classes/Human";
import Computer from "./classes/Computer";


const ComputerGame = () => {

  const boardState = useRef(createBoardWithPieces())
  const [boardStateT, setBoardStateT] = useState([...boardState.current.board])

  const humanPlayer = new Human();
  const computerPlayer = new Computer();


  const [clickedSquare, setClickedSquare] = useState(null)

  const handleSquareClick = (indexRow, indexColumn, clickedSquare, isEmpty) => {

    // if (!isEmpty) {
    //   if (clickedSquare && clickedSquare.x === indexRow && clickedSquare.y === indexColumn) {
    //     setClickedSquare(null)
    //     return
    //   }

    //   setClickedSquare({ x: indexRow, y: indexColumn })
    // }

    // else if (isEmpty && clickedSquare) {

    //   setClickedSquare(prev => { return { position: { ...prev } } })

    //   const playingPiece = boardState.current.board[clickedSquare.x][clickedSquare.y]

    //   boardState.current.setPieceAt({ row: clickedSquare.x, col: clickedSquare.y }, null)
    //   // console.log(playingPiece)
    //   playingPiece.setPosition(new Position(indexRow, indexColumn))
    //   boardState.current.setPieceAt({ row: indexRow, col: indexColumn }, playingPiece)
    //   // boardState.current.removePiece(playingPiece)

    //   setClickedSquare(null)

    //   setBoardStateT([...boardState.current.board])
    // }
    console.log("[[object]]")
    humanPlayer.move(boardState.current)

  }



  return (
    <article className="text-white ml-[10%] w-4/5 h-[60vh]  mt-0 border ">
      {boardStateT && boardStateT && boardStateT.length > 0 && boardStateT.map((boardRowArr, indexRow) =>
        <section key={indexRow + "-row-" + indexRow} className="w-full h-[12.5%] border flex">
          {boardRowArr.map((boardCol, indexCol) =>
            <div key={indexCol + "-col-" + indexCol} className="w-[12.5%] h-full border-l border-r flex items-center justify-center"
              onClick={() => boardCol ? handleSquareClick(indexRow, indexCol, clickedSquare, false) : handleSquareClick(indexRow, indexCol, clickedSquare, true)}>
              {boardCol && <div
                className={boardCol.color === ColorObj.RED ? "w-4 h-4 rounded-full bg-red-500 text-white text-xs" : "w-4 h-4 rounded-full bg-white text-black text-xs"} >{boardCol.color}</div>}
            </div>
          )}
        </section>)}
    </article>)
};

export default ComputerGame;
