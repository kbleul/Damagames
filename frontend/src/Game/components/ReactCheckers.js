import * as utils from "./utils.js";

//get corners
function getCorners(columns, coordinates) {
  const col = utils.getColAsInt(columns, coordinates);
  const row = utils.getRowAsInt(coordinates);

  const columnLeft =
    col - 1 >= 0 ? utils.getColAsAlph(columns, col - 1) : false;
  const columnRight =
    col + 1 <= 7 ? utils.getColAsAlph(columns, col + 1) : false;

  const rowUpper = row + 1 < 9 ? row + 1 : false;
  const rowLower = row - 1 > 0 ? row - 1 : false;

  let corners = {};

  corners.leftUpper =
    columnLeft !== false && rowUpper !== false ? columnLeft + rowUpper : null;
  corners.rightUpper =
    columnRight !== false && rowUpper !== false ? columnRight + rowUpper : null;
  corners.leftLower =
    columnLeft !== false && rowLower !== false ? columnLeft + rowLower : null;
  corners.rightLower =
    columnRight !== false && rowLower !== false ? columnRight + rowLower : null;

  return corners;
}

//get moves
export function getMoves(columns, boardState, coordinates, isKing = false, hasJumped = false) {
  if (boardState[coordinates] === null) {
    return [];
  }

  let moves = [];
  let jumps = [];

  let killJumps = {};

  const corners = getCorners(columns, coordinates);

  const row = utils.getRowAsInt(coordinates);
  const player = boardState[coordinates].player;


  const advanceRow = player === "player1" ? row - 1 : row + 1;

  for (let key in corners) {
    if (!corners.hasOwnProperty(key)) {
      continue;
    }

    let cornerCoordinates = corners[key];

    if (cornerCoordinates === null) {
      continue;
    }

    if (!isKing && cornerCoordinates.indexOf(advanceRow) < 0) {
      continue;
    }

    if (boardState[cornerCoordinates] === null) {
      moves.push(cornerCoordinates);
    } else {
      let neighborPiece = boardState[cornerCoordinates];

      if (neighborPiece.player === player) {
        continue;
      }

      let opponentCorners = getCorners(columns, cornerCoordinates);
      let potentialJump = opponentCorners[key];

      if (boardState[potentialJump] === null) {
        killJumps[cornerCoordinates] = potentialJump;
        jumps.push(potentialJump);
      }
    }
  }

  let movesOut;

  if (hasJumped === false) {
    movesOut = moves.concat(jumps);
  } else {
    // If the piece has already jumped, only additional jumps are available
    movesOut = jumps;
  }

  let killJumpsOut = jumps.length > 0 ? killJumps : null;

  return [movesOut, killJumpsOut];
}

//move piece
export function movePiece(columns, coordinates, gameState) {

  let currentState = Object.assign({}, gameState.history[gameState.stepNumber]);
  let boardState = Object.assign({}, currentState.boardState);
  let movingPiece = Object.assign({}, boardState[gameState.activePiece]);

  let jumpArray = [];
  for (let key in gameState.jumpKills) {
    if (!gameState.jumpKills.hasOwnProperty(key)) {
      continue;
    }

    jumpArray.push(gameState.jumpKills[key]);

  }

  // Don't move if the coordinates don't match a moveable or jumpable square.
  if (
    gameState.moves.indexOf(coordinates) < 0 &&
    jumpArray.indexOf(coordinates) < 0
  ) {
    return null;
  }

  // King me maybe?
  if (shouldKing(movingPiece, coordinates)) {
    movingPiece.isKing = true;
  }

  // Move piece to new coordinates
  boardState[gameState.activePiece] = null;
  boardState[coordinates] = movingPiece;
  // Remove opponent piece if jump is made
  const player = movingPiece.player;
  let hasJumped = null;
  let newMoves = [];
  let setCurrentPlayer = player === "player2";
  let setActivePiece = null;

  if (jumpArray.indexOf(coordinates) > -1) {
    let opponentPosition = utils.getKeyByValue(gameState.jumpKills, coordinates);
    //remove oponent piece

    boardState[opponentPosition] = null;
    newMoves = getMoves(
      columns,
      boardState,
      coordinates,
      movingPiece.isKing,
      true
    );

    if (newMoves[0].length > 0) {
      hasJumped = true;
      setCurrentPlayer = currentState.currentPlayer;
      setActivePiece = coordinates;
    } else {
      hasJumped = null;
    }
  }

  if (hasJumped === true) {
    if (newMoves[0].length > 0) {
      setCurrentPlayer = currentState.currentPlayer;
      setActivePiece = coordinates;
    }
  }

  let stateOut = {};

  stateOut.boardState = boardState;
  stateOut.currentPlayer = setCurrentPlayer;
  stateOut.activePiece = setActivePiece;
  stateOut.moves = hasJumped === true ? newMoves[0] : [];
  stateOut.jumpKills = hasJumped === true ? newMoves[1] : null;
  stateOut.hasJumped = hasJumped === true ? player : null;
  stateOut.winner = evaluateWinner(columns, boardState);

  return stateOut;
}


//should king
export function shouldKing(movingPiece, coordinates) {
  if (movingPiece.isKing === true) {
    return false;
  }

  const row = utils.getRowAsInt(coordinates);
  const player = movingPiece.player;

  return (
    (row === 1 && player === "player1") || (row === 8 && player === "player2")
  );
}

//evaluate winner

export function evaluateWinner(columns, boardState) {
  let player1Pieces = 0;
  let player1Moves = 0;

  let player2Pieces = 0;
  let player2Moves = 0;

  for (let coordinates in boardState) {
    if (
      !boardState.hasOwnProperty(coordinates) ||
      boardState[coordinates] === null
    ) {
      continue;
    }

    const movesData = getMoves(
      columns,
      boardState,
      coordinates,
      boardState[coordinates].isKing,
      false
    );
    const moveCount = movesData[0].length;
    // console.log(boardState[coordinates].player);
    if (boardState[coordinates].player === "player1") {
      ++player1Pieces;
      player1Moves += moveCount;
    } else {
      ++player2Pieces;
      player2Moves += moveCount;
    }
  }

  if (player1Pieces === 0) {
    return "player2pieces";
  }

  if (player2Pieces === 0) {
    return "player1pieces";
  }

  if (player1Moves === 0) {
    return "player2moves";
  }

  if (player2Moves === 0) {
    return "player1moves";
  }

  return null;
}
