import React from "react";
import * as utils from "./utils.js";
const Board = (props) => {
  function Square(props) {
    const squareClasses = props["squareClasses"];
    const onClick = props["onClick"];

    return (
      <div>
        <button className={"square " + squareClasses} onClick={onClick} />
      </div>
    );
  }

  function renderSquare(coordinates, squareClasses) {
    return (
      <div>
        <Square
          key={coordinates}
          squareClasses={squareClasses}
          onClick={() => props.onClick(coordinates)}
        />
      </div>
    );
  }
  let boardRender = [];
  let columnsRender = [];
  const moves = props.moves;
  for (let coordinates in props.boardState) {

    if (!props.boardState.hasOwnProperty(coordinates)) {
        continue;
    }

    const col = utils.getColAsInt(props.columns, coordinates);
    const row = utils.getRowAsInt(coordinates);

    const currentPlayer = utils.returnPlayerName(props.currentPlayer);

    const colorClass  = ( (utils.isOdd(col) && utils.isOdd(row)) || (!utils.isOdd(col) && !(utils.isOdd(row)) ) ) ? 'white' : 'black';

    let squareClasses = [];

    squareClasses.push(coordinates);
    squareClasses.push(colorClass);

    if (props.activePiece === coordinates) {
        squareClasses.push('isActive');
    }

    if (moves.indexOf(coordinates) > -1) {
        let moveClass = 'movable ' + currentPlayer + '-move';
        squareClasses.push(moveClass);
    }

    if (props.boardState[coordinates] !== null) {
        squareClasses.push(props.boardState[coordinates].player + ' piece');

        if (props.boardState[coordinates].isKing === true ) {
            squareClasses.push('king');
        }
    }

    squareClasses = squareClasses.join(' ');

    columnsRender.push(renderSquare(coordinates, squareClasses, props.boardState[coordinates]));

    if (columnsRender.length >= 8) {
        columnsRender = columnsRender.reverse();
        boardRender.push(<div key={boardRender.length} className="board-col">{columnsRender}</div>);
        columnsRender = [];
    }
}
  return <div>{boardRender}</div>;
};

export default Board;
