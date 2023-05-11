import React, { useContext } from "react";
import * as utils from "./utils.js";
import { TurnContext } from "../../context/TurnContext";
import { useAuth } from "../../context/auth.js";

import { getMoves, movePiece } from "./ReactCheckers.js";

const columns = {
  a: 0,
  b: 1,
  c: 2,
  d: 3,
  e: 4,
  f: 5,
  g: 6,
  h: 7,
};

const Board = (props) => {
  const { user } = useAuth();
  let hintCoordinate = []

  let tracker = props.tracker;

  const [MyTurn, setMyTurn] = useContext(TurnContext);

  let isFirstMove = props["isFirstMove"]
  let propsMain = props


  function Square(props) {

    const onClick = props["onClick"];

    let squareClasses;

    if (propsMain.numberOfPlayers !== 1) {
      if (isFirstMove && props.numberOfPlayers !== 1) {

        if (props["squareClasses"].includes("player2")) {
          squareClasses = props["squareClasses"] + " myturn";
        }
        else {
          squareClasses = props["squareClasses"]
        }

        if (props["squareClasses"].includes("player1")) {
          squareClasses = props["squareClasses"] + " myturn";
        }
        else {
          squareClasses = props["squareClasses"]
        }
      }
      else {

        if (
          props.numberOfPlayers > 1
            ? JSON.parse(localStorage.getItem("playerOne")) &&
            MyTurn === "player1" &&
            props["squareClasses"].includes("player1")
            : MyTurn === "player1" && props["squareClasses"].includes("player1")
        ) {
          squareClasses = props["squareClasses"] + " myturn";
        } else if (
          props.numberOfPlayers > 1
            ? JSON.parse(localStorage.getItem("playerTwo")) &&
            MyTurn === "player2" &&
            props["squareClasses"].includes("player2")
            : MyTurn === "player2" && props["squareClasses"].includes("player2")
        ) {
          squareClasses = props["squareClasses"] + " myturn";
        } else {
          squareClasses = props["squareClasses"];
        }
      }

    }

    else {
      if (propsMain.numberOfPlayers == 1) {

        if (propsMain["currentPlayer"] && props["squareClasses"].includes("player1")) {
          squareClasses = props["squareClasses"] + " myturn";
        }

        else if (!propsMain["currentPlayer"] && props["squareClasses"].includes("player2")) {
          squareClasses = props["squareClasses"] + " myturn";
        }

        else {
          squareClasses = props["squareClasses"]
        }


      }
    }

    let movesData = [[]]


    if (propsMain.numberOfPlayers != 1) {
      if (propsMain.currentPlayer && localStorage.getItem("playerOne") && squareClasses.includes("player1")) {
        let coordinate = squareClasses.split(" ")[0]

        movesData = getMoves(
          columns,
          propsMain.boardState,
          coordinate,
          squareClasses.includes("king"),
          false
        );
        movesData[0] && movesData[0].length > 0 && hintCoordinate.push(coordinate);

        if (movesData[0] && movesData[0].length > 0) {
          squareClasses = squareClasses + " " + "movable" + " " + "player1-all"
        }
      }

      else if (!propsMain.currentPlayer && localStorage.getItem("playerTwo") && squareClasses.includes("player2")) {
        let coordinate = squareClasses.split(" ")[0]
        movesData = getMoves(
          columns,
          propsMain.boardState,
          coordinate,
          squareClasses.includes("king"),
          false
        );
        movesData[0] && movesData[0].length > 0 && hintCoordinate.push(coordinate);

        if (movesData[0] && movesData[0].length > 0) {
          squareClasses = squareClasses + " " + "movable" + " " + "player1-all"
        }
      }
    }

    return (
      <div>
        <button
          className={
            tracker &&
              (squareClasses.includes(tracker.moved) ||
                squareClasses.includes(tracker.to))
              ? "square " + squareClasses + " tracker"
              : "square " + squareClasses
          }
          onClick={onClick}
        />
      </div>
    );
  }

  function renderSquare(coordinates, squareClasses) {
    return (
      <div className="sub-box">
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

    const evenColor = user
      ? user.default_board
        ? `${user.default_board?.name} primary`
        : "Default primary"
      : "Default primary";
    const oddColor = user
      ? user.default_board
        ? `${user.default_board?.name} secondary`
        : "Default secondary"
      : "Default secondary";

    const colorClass =
      (utils.isOdd(col) && utils.isOdd(row)) ||
        (!utils.isOdd(col) && !utils.isOdd(row))
        ? evenColor
        : oddColor;

    let squareClasses = [];

    squareClasses.push(coordinates);
    squareClasses.push(colorClass);

    if (props.activePiece === coordinates) {
      squareClasses.push("isActive");
    }
    if (moves.indexOf(coordinates) > -1) {
      let moveClass = "movable " + currentPlayer + "-move";
      squareClasses.push(moveClass);
    }

    const pawnType = user
      ? user.default_board
        ? user.default_board?.name
        : "Default"
      : "Default";

    let crownType

    if (props.playingCrown && props.boardState[coordinates]) {
      crownType = props.boardState[coordinates].player === "player1" ?
        props.playingCrown.p1 : props.playingCrown.p2
    } else {
      crownType = user
        ? user.default_crown
          ? user.default_crown?.name === "Crown" ? "Default" : user.default_crown?.name
          : "Default"
        : "Default";
    }


    if (props.boardState[coordinates] !== null) {
      squareClasses.push(
        props.boardState[coordinates].player + " " + pawnType + " piece"
      );

      if (props.boardState[coordinates].isKing === true) {
        squareClasses.push("king " + crownType);
      }
    }

    squareClasses = squareClasses.join(" ");

    columnsRender.push(
      renderSquare(coordinates, squareClasses, props.boardState[coordinates])
    );

    if (columnsRender.length >= 8) {
      columnsRender = columnsRender.reverse();
      boardRender.push(
        <div key={boardRender.length} className="board-col">
          {columnsRender}
        </div>
      );
      columnsRender = [];
    }
  }

  return <div>{boardRender}</div>;
};

export default Board;