const Capture = require("../utils/Capture");
const Move = require("./Move");
const { ColorObj, Position } = require("./Piece");
const Player = require("./Player");

class Human extends Player {
    constructor() {
        super(ColorObj.RED);
    }

    move(gameBoard) {
        let fromRow, fromCol, toRow, toCol;

        fromRow = 4;
        fromCol = 1
        toRow = 3
        toCol = 2

        const from = new Position(fromRow, fromCol);
        const to = new Position(toRow, toCol);
        const move = new Move(from, to);

        const pieceToMove = gameBoard.pieceAt(fromRow, fromCol, ColorObj.RED);
        if (this.theMoveIsValid(from, to, gameBoard.board)) {
            if (pieceToMove && pieceToMove.getColor() === ColorObj.RED) {
                console.log(move)

                gameBoard.setPieceAt({ row: fromRow, col: fromCol }, { row: toRow, col: toCol })


                console.log("newBoard", gameBoard.board)
            } else {
                console.log("The 'from' position doesn't contain your piece. Try again.");
            }
        } else if (Capture.getCaptureMove({ row: 4, col: 1 }, gameBoard.board)) {
            let capturePiece = { row: 4, col: 1 }
            let isCapturing = true

            console.log(Capture.getCaptureMove(capturePiece, gameBoard.board))

            while (isCapturing) {
                if (Capture.getCaptureMove(capturePiece, gameBoard.board)) {
                    const captureMove = Capture.getCaptureMove(capturePiece, gameBoard.board)
                    Capture.handle(gameBoard.board, captureMove)
                    capturePiece = captureMove.to
                } else {
                    isCapturing = false
                }


            }


            console.log(gameBoard.board)

        } else {
            console.log("Invalid positions. Try again.");
        }

    }

    // move(from, to) {
    //     const [fromRow, fromCol] = from;
    //     const [toRow, toCol] = to;
    //     if (this.isAdjacentDiagonal(from, to, false) && this.isPositionEmpty(toRow, toCol, this.gameBoard.getBoard())) {
    //         const board = this.gameBoard.pieces();
    //         board[toRow][toCol] = board[fromRow][fromCol];
    //         board[fromRow][fromCol] = null;
    //         board[toRow][toCol].setPosition(to);
    //     }
    // }

    // move(from, to, board, gameBoard) {
    //     const [fromRow, fromCol] = from;
    //     const [toRow, toCol] = to;
    //     if (this.isAdjacentDiagonal(from, to, false) && this.isPositionEmpty(toRow, toCol, board)) {
    //         board[toRow][toCol] = board[fromRow][fromCol];
    //         board[fromRow][fromCol] = null;
    //         board[toRow][toCol].setPosition(to);
    //     }
    // }

    getPieces(board) {
        const pieces = [];
        for (const row of board) {
            for (const piece of row) {
                if (piece && piece.getColor() === ColorObj.RED) {
                    pieces.push(piece);
                }
            }
        }
        return pieces;
    }

    makeMove(piece, move, board) {
        // Implementation not provided in the original C++ code
    }

    // applyMove(move, board) {
    //     super.applyMove(move, board);
    // }

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



