import Human from "../classes/Human.js";
import Move from "../classes/Move.js";
import Board from "../classes/Board.js";
import Player from "../classes/Player.js";
import Capture from "./Capture.js";


const { ColorObj, Piece, Position } = require("../classes/Piece");

export const createAndLogBoard = () => {
  const boardSize = 8;
  const board = new Board(boardSize);

  // Create and place pieces on the board
  // const piece1 = new Piece(ColorObj.RED, new Position(0, 0));
  // const piece2 = new Piece(ColorObj.BLACK, new Position(7, 7));
  // const piece3 = new Piece(ColorObj.RED, new Position(3, 4));
  // board.putAt(piece1, new Position(0, 0));
  // board.putAt(piece2, new Position(7, 7));
  // board.putAt(piece3, new Position(3, 4));

  // Display the board
  // board.display();

  // console.log(board)

  // const piece1 = new Piece(ColorObj.RED, new Position(0, 0));
  // const piece2 = new Piece(ColorObj.RED, new Position(0, 2));
  // const piece3 = new Piece(ColorObj.RED, new Position(0, 4));
  // const piece4 = new Piece(ColorObj.RED, new Position(0, 6));

  // const piece5 = new Piece(ColorObj.RED, new Position(1, 1));
  // const piece6 = new Piece(ColorObj.RED, new Position(1, 3));
  // const piece7 = new Piece(ColorObj.RED, new Position(1, 5));
  // const piece8 = new Piece(ColorObj.RED, new Position(1, 7));

  // const piece9 = new Piece(ColorObj.RED, new Position(2, 0));
  // const piece10 = new Piece(ColorObj.RED, new Position(2, 2));
  // const piece11 = new Piece(ColorObj.RED, new Position(2, 4));
  // const piece12 = new Piece(ColorObj.RED, new Position(2, 6));

  // board.putAt(piece1, new Position(0, 0));
  // board.putAt(piece2, new Position(0, 2));
  // board.putAt(piece3, new Position(0, 4));
  // board.putAt(piece4, new Position(0, 6));

  // board.putAt(piece5, new Position(1, 1));
  // board.putAt(piece6, new Position(1, 3));
  // board.putAt(piece7, new Position(1, 5));
  // board.putAt(piece8, new Position(1, 7));

  // board.putAt(piece9, new Position(2, 0));
  // board.putAt(piece10, new Position(2, 2));
  // board.putAt(piece11, new Position(2, 4));
  // board.putAt(piece12, new Position(2, 6));

  // console.log(board.board)

  // Test other functionalities
  // console.log("Size of the board:", board.getSize());
  // console.log(
  //   "Piece at (0, 0) for Red color:",
  //   board.pieceAt(0, 0, ColorObj.RED)
  // );
  // console.log(
  //   "Piece at (7, 7) for Black color:",
  //   board.pieceAt(7, 7, ColorObj.BLACK)
  // );
  // console.log("Piece at (3, 4):", board.getPieceAt(new Position(3, 4)));
  // console.log(
  //   "Piece color at (3, 4):",
  //   board.getPieceColor(new Position(3, 4))
  // );

  // // Modify the board
  // const newPosition = new Position(2, 2);
  // piece1.move(newPosition);
  // board.setPieceAt(newPosition, piece1);
  // board.remove([piece2]);
  // console.log(
  //   "Piece at (0, 0) after moving:",
  //   board.pieceAt(0, 0, ColorObj.RED)
  // );
  // console.log("Piece at (2, 2):", board.getPieceAt(newPosition));

  // Display the modified board
  board.display();
};


export const createBoardWithPieces = () => {
  const boardSize = 8;
  const board = new Board(boardSize);

  const piecePositions = {
    playerOne: [
      [7, 0], [7, 2], [7, 4], [7, 6],
      [6, 1], [6, 3], [6, 5], [6, 7],
      [4, 1], [5, 2], [5, 4], [5, 6],
    ],
    playerTwo: [
      [0, 0], [0, 2], [1, 4], [0, 6],
      [1, 1], [1, 3], [1, 5], [1, 7],
      [3, 2], [2, 2], [2, 4], [2, 6]
    ]
  }

  const pieces = [];

  for (const [row, col] of piecePositions.playerOne) {
    const newPosition = new Position(row, col)
    const piece = new Piece(ColorObj.RED, newPosition);
    board.putAt(piece, newPosition);
    pieces.push(piece);
  }

  for (const [row, col] of piecePositions.playerTwo) {
    const newPosition = new Position(row, col)
    const piece = new Piece(ColorObj.BLACK, newPosition);
    board.putAt(piece, newPosition);
    pieces.push(piece);
  }


  for (let i = 0; i < board.size; i++) {
    for (let j = 0; j < board.size; j++) {
      !board.getPieceAt({ row: i, col: j }) && board.putAt(null, { row: i, col: j })

    }
  }

  return board
  // pieces array now contains all the created pieces
}


// testPlayer.js


// function testPlayer() {
//   // Create a player
//   const player = new Player(/* player parameters */);

//   // Test the initial state of the player
//   console.log('Player color:', player.getColor());

//   // Perform player actions
//   const board = /* create the game board */;
//   const gameBoard = /* create the game board object */;
//   player.move(board, gameBoard);
//   const pieces = player.getPieces(board);
//   const piece = /* select a piece from the pieces array */;
//   const move = /* create a move */;
//   player.makeMove(piece, move, board);
//   player.applyMove(move, board);
//   const isPromotionRow = player.isPromotionRow(/* row */, /* piece color */);
//   const boardPosition = /* specify a position on the board */;
//   const selectedPiece = player.getPiece(gameBoard, boardPosition);
//   const isValidMove = player.isValidMove(/* row */, /* col */);
//   const isPositionEmpty = player.isPositionEmpty(/* row */, /* col */, board);
//   const capturePosition = player.getCapturePosition(/* from position */, /* to position */);
//   const isAdjacentDiagonal = player.isAdjacentDiagonal(/* from position */, /* to position */, /* is king */);
//   const isMoveValid = player.theMoveIsValid(/* from position */, /* to position */, board, gameBoard, player);
//   const isMoveValidMaximizer = player.theMoveIsValid(/* from position */, /* to position */, board, gameBoard, player, true);

//   // Test the player's actions and methods
//   console.log('Player pieces:', pieces);
//   console.log('Is promotion row:', isPromotionRow);
//   console.log('Selected piece:', selectedPiece);
//   console.log('Is valid move:', isValidMove);
//   console.log('Is position empty:', isPositionEmpty);
//   console.log('Capture position:', capturePosition);
//   console.log('Is adjacent diagonal:', isAdjacentDiagonal);
//   console.log('Is move valid:', isMoveValid);
//   console.log('Is move valid (maximizer):', isMoveValidMaximizer);
// }

// Run the test function
// testPlayer();


export function testGameClasses() {
  // Create a sample game board (2D array of pieces)
  // const board = [
  //   [null, null, null, null, null, null, null, null],
  //   [null, null, null, null, null, null, null, null],
  //   [null, null, null, null, null, null, null, null],
  //   [null, null, null, null, null, null, null, null],
  //   [null, null, null, null, null, null, null, null],
  //   [null, null, null, null, null, null, null, null],
  //   [null, null, null, null, null, null, null, null],
  //   [null, null, null, null, null, null, null, null],
  // ];

  // Create a sample game board object
  const gameBoard = createBoardWithPieces()
  console.log(gameBoard.board);

  // // Create an instance of the Human class
  const humanPlayer = new Human(gameBoard);
  // // Test the move function
  // console.log("Testing move function:");
  // humanPlayer.move(board, gameBoard);

  // console.log(board, gameBoard)
  // Test the Capture class
  console.log("\nTesting Capture class:");

  // // Create an instance of the Capture class


  // Create a sample Move

  setTimeout(() => {
    let x = true
    let myMove = { row: 4, col: 1 }
    while (x) {
      const newMove = Capture.getCaptureMove(myMove, gameBoard.board, humanPlayer)
      console.log("newMove", newMove)
      if (newMove) {
        Capture.handle(gameBoard.board, newMove)
        myMove = newMove.to
        console.log("myMove", myMove)

      } else {
        x = false
      }
    }

    console.log(gameBoard.board)
  }, 5000);





  // Test isCaptureMove function
  // console.log("isCaptureMove:", jumpkills);

  // console.log(gameBoard.board[5][0])
  // Capture.handle(gameBoard.board, { from: { row: 5, col: 0 }, to: { row: 3, col: 2 } })
  // console.log("isCaptureMove:", Capture.isCaptureMove({ row: 3, col: 2 }, { row: 3, col: 2 }, gameBoard.board, humanPlayer));



  // Test hasMoreCaptures function
  //console.log("hasMoreCaptures:", captureInstance.hasMoreCaptures({ row: 4, col: 5 }, board, humanPlayer));

  // // Test handle function
  // console.log("handle result:", captureInstance.handle(board, board[2][3], sampleMove));

  // // Display the modified board after handle function
  // console.log("Updated board:", board);

  // // Test getConsecutiveCaptureMoves function
  // console.log("Consecutive capture moves:", captureInstance.getConsecutiveCaptureMoves({ row: 4, col: 5 }, board, humanPlayer));
}

// Run the test function
