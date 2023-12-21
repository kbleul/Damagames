const Computer = require("./Computer");
const Human = require("./Human");
const { Position, ColorObj } = require("./Piece");

class Game {
    initializePlayers() {
        // Initialize human and computer players with their respective colors
        this.humanPlayer = new Human(this.gameBoard);
        this.computerPlayer = new Computer(this.gameBoard);
    }

    isGameOver() {
        // Check if either player has no pieces left
        if (
            this.humanPlayer.getPieces(this.gameBoard.pieces()).length === 0 ||
            this.computerPlayer.getPieces(this.gameBoard.pieces()).length === 0
        ) {
            // Game is over when one player has no pieces left
            return true;
        }

        // Check for a draw (e.g., no legal moves left for the current player)
        const pieces = currentPlayer.getPieces(this.gameBoard.pieces());
        if (!this.hasLegalMoves(pieces)) {
            return true;
        }

        // Add other game-over conditions if needed

        return false;
    }

    hasLegalMoves(boardPieces) {
        // Iterate through the player's board
        for (const piece of boardPieces) {
            // Check for valid moves and captures for the current piece
            if (piece && this.hasValidMoves(piece)) {
                return true; // Return true if at least one piece has legal moves
            }
        }

        return false; // Return false if no piece has legal moves
    }

    hasValidMoves(piece) {
        if (!piece) return false;

        // Get the piece's current position
        const currentPosition = piece.getPosition();

        // Check if the piece is a king
        const isKing = piece.isKing;

        // Check for valid moves and captures
        for (let newRow = currentPosition.row - 1; newRow <= currentPosition.row + 1; newRow += 2) {
            for (let newCol = currentPosition.col - 1; newCol <= currentPosition.col + 1; newCol += 2) {
                // Check if the new position is on the board
                if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
                    // Check if the new position is unoccupied
                    if (this.isPositionEmpty(new Position(newRow, newCol))) {
                        // For regular pieces, they can only move forward
                        if (!isKing) {
                            if (
                                piece.getColor() === ColorObj.RED &&
                                newRow > currentPosition.row
                            ) {
                                // This is a valid forward move for a red piece
                                return true;
                            } else if (
                                piece.getColor() === ColorObj.BLACK &&
                                newRow < currentPosition.row
                            ) {
                                // This is a valid forward move for a black piece
                                return true;
                            }
                        } else {
                            // For king pieces, they can move in any direction
                            // This is a valid move for a king
                            return true;
                        }
                    }
                    // Check for a possible capture (jump over an opponent's piece)
                    else if (this.isOpponentPieceAt(piece.getColor(), new Position(newRow, newCol))) {
                        const jumpRow = newRow + (newRow - currentPosition.row);
                        const jumpCol = newCol + (newCol - currentPosition.col);
                        // Check if the jump position is on the board and unoccupied
                        if (
                            jumpRow >= 0 &&
                            jumpRow < 8 &&
                            jumpCol >= 0 &&
                            jumpCol < 8 &&
                            this.isPositionEmpty(new Position(jumpRow, jumpCol))
                        ) {
                            // This is a valid capture move
                            return true;
                        }
                    }
                }
            }
        }

        return false;
    }

    isPositionEmpty(position) {
        // Check if the given position on the board is empty (no piece at that position)
        for (const pieces of this.gameBoard.pieces()) {
            for (const piece of pieces) {
                if (piece && piece.getPosition().isEqual(position)) {
                    return false; // The position is occupied by a piece
                }
            }
        }

        return true; // The position is empty
    }

    isOpponentPieceAt(playerColor, position) {
        // Check if there is an opponent's piece at the given position
        for (const pieces of this.gameBoard.pieces()) {
            for (const piece of pieces) {
                if (piece && piece.getPosition().isEqual(position) && piece.getColor() !== playerColor) {
                    return true; // There is an opponent's piece at the position
                }
            }
        }

        return false; // There is no opponent's piece at the position
    }

    displayGameResult() { }

    initializeBoard() {
        this.gameBoard.init();
    }

    getPieces() {
        return this.gameBoard.pieces();
    }
}


module.exports = Game;
