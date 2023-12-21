class Player {
    constructor(color) {
        this.color = color;
    }

    getPieces(board) {
        return [];
    }

    getCapturePosition(from, to) {
        const captureRow = Math.floor((from.row + to.row) / 2);
        const captureCol = Math.floor((from.col + to.col) / 2);

        if (this.isValidMove(captureRow, captureCol)) {
            return { row: captureRow, col: captureCol };
        }

        return { row: -1, col: -1 };
    }

    isValidMove(newRow, newCol) {
        return newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8;
    }

    isPositionEmpty(row, col, board) {
        return this.isValidMove(row, col) && !board[row][col];
    }

    isAdjacentDiagonal(from, to, isKing) {
        const rowDiff = Math.abs(to.row - from.row);
        const colDiff = Math.abs(to.col - from.col);

        if (isKing) {
            return rowDiff === 1 && colDiff === 1;
        }

        return to.row <= from.row && rowDiff === 1 && colDiff === 1;
    }


    isPromotionRow(row, pieceColor) {
        return false;
    }

    move(board, gameBoard) {
        // Implementation not provided in the original C++ code
    }

    getPiece(board, position) {
        return null;
    }

    makeMove(piece, move, board) {
        // Implementation not provided in the original C++ code
    }

    getColor() {
        return this.color;
    }

    theMoveIsValid(from, to, board, isMaximizer) {
        const pieceToMove = board[from.row][from.col];
        if (isMaximizer) {
            return (
                pieceToMove &&
                this.isValidMove(from.row, from.col) &&
                this.isValidMove(to.row, to.col) &&
                this.isPositionEmpty(to.row, to.col, board) &&
                this.isAdjacentDiagonal({ row: from.row, col: from.col }, { row: to.row, col: to.col }, pieceToMove.isKing)
            );
        } else {

            return (
                pieceToMove &&
                this.isValidMove(from.row, from.col) &&
                this.isValidMove(to.row, to.col) &&
                this.isPositionEmpty(to.row, to.col, board) &&
                this.isAdjacentDiagonal({ row: from.row, col: from.col }, { row: to.row, col: to.col }, pieceToMove.isKing)
            );
        }
    }
}


module.exports = Player;
