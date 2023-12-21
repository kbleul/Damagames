const Capture = require("../utils/classes/Capture");
const { PlayerTurn } = require("../utils/data");
const Move = require("./Move");
const { ColorObj, Position } = require("./Piece");
const Player = require("./Player");

class Human extends Player {
    constructor() {
        super(ColorObj.RED);
    }

    move(gameBoard, from, to, CreatedGame) {

        const fromPosition = new Position(from.row, from.col);
        const toPosition = new Position(to.row, to.col);

        const captureMove = Capture.getCaptureMove(from, gameBoard.board)

        const pieceToMove = gameBoard.pieceAt(from.row, from.col, this.color);
        if (this.theMoveIsValid(fromPosition, toPosition, gameBoard.board)) {
            if (pieceToMove && pieceToMove.getColor() === this.color) {
                gameBoard.setPieceAt({ row: from.row, col: from.col }, { row: to.row, col: to.col })
                CreatedGame.setCurrentPlayer(PlayerTurn.Computer)
            } else {
                console.log("The 'from' position doesn't contain your piece. Try again.");
            }
        }

        else if (captureMove) {
            let capturePiece = from
            // let isCapturing = true

            // while (isCapturing) {
            if (captureMove.to.row === to.row && captureMove.to.col === to.col) {
                const captureMove = Capture.getCaptureMove(capturePiece, gameBoard.board)

                Capture.handle(gameBoard.board, captureMove)
                CreatedGame.setCurrentPlayer(PlayerTurn.Computer)
            }
        }
        else {
            console.log("Invalid positions. Try again.");
        }

        return gameBoard.board
    }

    getPieces(board) {
        const pieces = [];
        for (const row of board) {
            for (const piece of row) {
                if (piece && piece.getColor() === this.color) {
                    pieces.push(piece);
                }
            }
        }
        return pieces;
    }

    makeMove(piece, move, board) {
        // Implementation not provided in the original C++ code
    }


    applyMove(move, board, gameBoard) {
        const from = move.from;
        const to = move.to;
        board[to.row][to.col] = board[from.row][from.col];
        board[from.row][from.col] = null;
        board[to.row][to.col].setPosition(to);

        const capturePos = this.getCapturePosition(from, to);
        if (capturePos.row !== -1 && capturePos.col !== -1) {
            board[capturePos.row][capturePos.col] = null;
        }

        if (this.isPromotionRow(to.row, board[to.row][to.col].getColor())) {
            board[to.row][to.col].setKing(true);
        }
    }

    getPiece(board, pos) {
        return null;
    }

    static isAdjacentDiagonal(from, to, isKing) {
        const rowDiff = Math.abs(to.row - from.row);
        const colDiff = Math.abs(to.col - from.col);

        if (isKing) {
            return rowDiff === 1 && colDiff === 1;
        }

        return to.row >= from.row && rowDiff === 1 && colDiff === 1;
    }
}


module.exports = Human;



