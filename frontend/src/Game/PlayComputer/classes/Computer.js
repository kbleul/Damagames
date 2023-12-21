const Move = require("./Move");
const { ColorObj } = require("./Piece");

class Computer {
    constructor() {
        this.color = ColorObj.BLACK
    }

    move(board) {
        const depth = 20; // Adjust the depth for game's complexity
        const alpha = Number.MIN_SAFE_INTEGER;
        const beta = Number.MAX_SAFE_INTEGER;
        const bestMove = this.alphaBetaStack(board, depth, alpha, beta, true);
        this.applyMove(bestMove, board, true);
    }

    getMove(board) {
        const depth = 1; // Adjust the depth for game's complexity
        const alpha = Number.MIN_SAFE_INTEGER;
        const beta = Number.MAX_SAFE_INTEGER;
        return this.alphaBetaStack(board, depth, alpha, beta, true);
    }

    minimax(board, depth, maximizing) {
        let bestMove;

        if (depth === 0 || this.isGameOver(board, maximizing)) {
            const evaluation = this.evaluate(board);
            bestMove = new Move(); // Create a Move class if it doesn't exist
            bestMove.setScore(evaluation);
            return bestMove;
        }

        let bestScore = maximizing ? Number.MIN_SAFE_INTEGER : Number.MAX_SAFE_INTEGER;
        const playerPieces = this.getPieces(board, maximizing);
        const shuffledPieces = this.shuffle1D(playerPieces); // Implement your shuffle function

        for (const piece of shuffledPieces) {
            if (!piece) continue;

            const clonedBoard = this.deepCopy(board);
            const allPossibleMoves = this.generateMoves(piece, clonedBoard, maximizing);
            const shuffledMoves = this.shuffle1D(allPossibleMoves); // Implement your shuffle function

            for (const move of shuffledMoves) {
                const newBoard = this.simulateMove(piece, move, clonedBoard, maximizing);
                const result = this.minimax(newBoard, depth - 1, !maximizing);
                const score = this.evaluate(newBoard);

                if ((maximizing && score > bestScore) || (!maximizing && score < bestScore)) {
                    bestScore = score;
                    bestMove = move;
                }
            }
        }

        return bestMove;
    }

    alphaBeta(board, depth, alpha, beta, maximizing) {
        let bestMove;
        let bestScore = maximizing ? Number.MIN_SAFE_INTEGER : Number.MAX_SAFE_INTEGER;

        if (depth === 0 || this.isGameOver(board, maximizing)) {
            bestMove = new Move(); // Create a Move class if it doesn't exist
            bestMove.setScore(bestScore);
            return bestMove;
        }

        const playerPieces = this.getPieces(board, maximizing);
        const shuffledPieces = this.shuffle1D(playerPieces); // Implement your shuffle function

        for (const piece of shuffledPieces) {
            if (!piece) continue;

            const allPossibleMoves = this.generateMoves(piece, board, maximizing);
            const shuffledMoves = this.shuffle1D(allPossibleMoves); // Implement your shuffle function

            for (const move of shuffledMoves) {
                if (!this.isPositionEmpty(move.to.row, move.to.col, board)) continue;

                const clonedBoard = this.deepCopy(board);
                const newBoard = this.simulateMove(piece, move, clonedBoard, maximizing);

                let score;
                if (maximizing) {
                    score = this.evaluate(newBoard);
                    bestScore = Math.max(bestScore, score);
                    alpha = Math.max(alpha, score);
                    const alphaMove = this.alphaBeta(newBoard, depth - 1, alpha, beta, false);
                } else {
                    score = this.evaluate(newBoard);
                    bestScore = Math.min(bestScore, score);
                    beta = Math.min(beta, score);
                    const betaMove = this.alphaBeta(newBoard, depth - 1, alpha, beta, true);
                }

                if (beta <= alpha) {
                    return bestMove; // Prune the remaining subtree if it won't be chosen
                }

                if ((maximizing && score >= bestScore) || (!maximizing && score <= bestScore)) {
                    bestScore = score;
                    bestMove = move;
                    bestMove.score = score;
                }
            }
        }

        return bestMove;
    }

    alphaBetaStack(initialBoard, depth, alpha, beta, maximizing) {
        const stateStack = [];

        // Initialize with the root state
        stateStack.push({
            board: initialBoard,
            depth,
            alpha,
            beta,
            maximizing,
        });

        let bestMove;
        let bestScore = maximizing ? Number.MIN_SAFE_INTEGER : Number.MAX_SAFE_INTEGER;

        while (stateStack.length > 0) {
            const currentState = stateStack.pop();
            const { board, depth, alpha, beta, maximizing } = currentState;

            if (depth === 0 || this.isGameOver(board, maximizing)) {
                bestMove = new Move(); // Create a Move class if it doesn't exist
                bestMove.setScore(maximizing ? this.evaluate(board) : -this.evaluate(board));
                continue;
            }

            const playerPieces = this.getPieces(board, maximizing);
            const shuffledPieces = this.shuffle1D(playerPieces); // Implement your shuffle function

            for (const piece of shuffledPieces) {
                if (!piece) continue;

                const allPossibleMoves = this.generateMoves(piece, board, maximizing);
                const shuffledMoves = this.shuffle1D(allPossibleMoves); // Implement your shuffle function

                for (const move of shuffledMoves) {
                    if (!this.isPositionEmpty(move.to.row, move.to.col, board)) continue;

                    const clonedBoard = this.deepCopy(board);
                    const newBoard = this.simulateMove(piece, move, clonedBoard, maximizing);

                    let score;
                    if (maximizing) {
                        score = this.evaluate(newBoard);
                        bestScore = Math.max(bestScore, score);
                        alpha = Math.max(alpha, score);
                    } else {
                        score = this.evaluate(newBoard);
                        bestScore = Math.min(bestScore, score);
                        beta = Math.min(beta, score);
                    }

                    if (beta <= alpha) {
                        // Prune the remaining subtree if it won't be chosen
                        continue;
                    }

                    // Push the next state onto the stack
                    stateStack.push({
                        board: newBoard,
                        depth: depth - 1,
                        alpha,
                        beta,
                        maximizing: !maximizing,
                    });

                    if ((maximizing && score >= bestScore) || (!maximizing && score <= bestScore)) {
                        bestScore = score;
                        bestMove = move;
                        bestMove.score = score;
                    }
                }
            }
        }

        return bestMove;
    }

    getPieces(board, computer) {
        const pieces = [];
        // Iterate through the 'board' and collect pieces with the computer player's color
        for (const row of board) {
            for (const piece of row) {
                if (piece && piece.getColor() === ColorObj.BLACK) {
                    pieces.push(piece);
                }
            }
        }

        return pieces;
    }

    getAdjacentDiagonalForMaximizer(from, to, isKing) {
        // Check if the 'to' position is adjacent diagonally to the 'from' position
        const rowDiff = Math.abs(to.row - from.row);
        const colDiff = Math.abs(to.col - from.col);
        const isValidRowDiff = isKing ? rowDiff === 1 : rowDiff === 1 || rowDiff === 2;
        const isValidColDiff = colDiff === 1;

        return isValidRowDiff && isValidColDiff;
    }

    getAdjacentDiagonalForMinimizer(from, to, isKing) {
        // Check if the 'to' position is adjacent diagonally to the 'from' position
        const rowDiff = Math.abs(to.row - from.row);
        const colDiff = Math.abs(to.col - from.col);
        const isValidRowDiff = isKing ? rowDiff === 1 : rowDiff === 1 || rowDiff === 2;
        const isValidColDiff = colDiff === 1;

        return isValidRowDiff && isValidColDiff;
    }

    simulateMove(piece, move, board, computer) {
        const clonedBoard = this.deepCopy(board);
        // Perform the move on the cloned board
        // (This part needs to be implemented based on your game's logic)

        return clonedBoard;
    }

    evaluate(board) {
        let evaluation = 0;
        // Implement your evaluation function based on the current state of the board
        // You can assign scores to different game states based on your game's rules

        return evaluation;
    }

    applyMove(move, board, computer) {
        // Apply the chosen move to the actual game board
        // (This part needs to be implemented based on your game's logic)
    }

    isGameOver(board, maximizing) {
        // Check if the game is over based on the current state of the board
        // You can implement game-over conditions based on your game's rules
        return false;
    }

    isPositionEmpty(row, col, board) {
        // Check if the specified position on the board is empty
        // (This part needs to be implemented based on your game's logic)
        return true;
    }

    generateMoves(piece, board, computer) {
        // Generate all possible moves for the given piece on the current board
        // (This part needs to be implemented based on your game's logic)
        return [];
    }

    deepCopy(board) {
        // Create a deep copy of the board to simulate moves without modifying the original board
        // (This part needs to be implemented based on your game's logic)
        return board;
    }

    shuffle1D(array) {
        // Implement a function to shuffle a 1D array
        // (This part needs to be implemented based on your preferred shuffle algorithm)
        return array;
    }
}


module.exports = Computer