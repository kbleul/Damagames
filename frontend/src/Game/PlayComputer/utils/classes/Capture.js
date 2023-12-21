const Move = require("../../classes/Move");
const { ColorObj } = require("../../classes/Piece");

class Capture {
    static isCaptureMove(from, to, board, maximizing) {
        const rowDiff = to.row - from.row;
        const colDiff = to.col - from.col;

        const playerColor = maximizing ? ColorObj.BLACK : ColorObj.RED;

        const pieceToBeEaten = Capture.getCapturePosition(from, to);
        if (pieceToBeEaten.row >= 0 && pieceToBeEaten.col >= 0
            && pieceToBeEaten.row < 8 && pieceToBeEaten.col < 8) {
            const opponentPiece = board[pieceToBeEaten.row][pieceToBeEaten.col];

            return Math.abs(rowDiff) === 2 && Math.abs(colDiff) === 2 && opponentPiece &&
                opponentPiece.getColor() !== playerColor;
        }
        return false

    }

    static getCapturePosition(from, to) {
        return { row: (from.row + to.row) / 2, col: (from.col + to.col) / 2 };
    }

    static hasMoreCaptures(position, board, player) {
        for (let row = -1; row <= 1; row += 2) {
            for (let col = -1; col <= 1; col += 2) {
                const nextPos = { row: position.row + row * 2, col: position.col + col * 2 };
                const validPosition = (nextPos.row > 0 && nextPos.col > 0) && (nextPos.row < 8 && nextPos.col < 8);
                if (validPosition &&
                    Capture.isCaptureMove(position, nextPos, board)) {
                    return true;
                }
            }
        }

        return false;
    }

    static handle(board, move, maximizing) {

        const piece = board[move.from.row][move.from.col]
        const from = move.from;
        const to = move.to;
        const catchedPiece = Capture.getCapturePosition(from, to);

        board[to.row][to.col] = piece;
        board[from.row][from.col] = null;
        board[catchedPiece.row][catchedPiece.col] = null;

        piece.setPosition(to);
        piece.setJumpedPosition(catchedPiece);
        if (!maximizing && to.row === 0) {
            piece.setKing(true)
        }
        return 1;
    }

    static getCaptureMove(position, board, maximizing) {

        let captureMove = null
        for (let row = -1; row <= 1; row += 2) {
            for (let col = -1; col <= 1; col += 2) {
                const nextPos = { row: position.row + row * 2, col: position.col + col * 2 };

                const validPosition = (nextPos.row >= 0 && nextPos.col >= 0) && (nextPos.row < 8 && nextPos.col < 8);

                if (validPosition &&
                    Capture.isCaptureMove(position, nextPos, board, maximizing)) {
                    captureMove = new Move(position, nextPos)
                }
            }
        }

        return captureMove
    }
}


module.exports = Capture;
