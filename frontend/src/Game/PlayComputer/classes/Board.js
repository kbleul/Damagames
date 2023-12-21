const { ColorObj, Position } = require("../classes/Piece");

class Board {
  constructor(size = 8) {
    this.size = size;
    this.board = new Array(size);
    for (let i = 0; i < size; i++) {
      this.board[i] = new Array(size);
    }
  }

  getSize() {
    return this.size;
  }

  pieceAt(row, col, color) {
    const piece = this.board[row][col];

    if (piece && piece.getColor() === color) {
      return piece;
    }
    return null;
  }

  getPieceAt(position) {
    return this.board[position.row][position.col];
  }

  at(position) {
    return this.getPieceAt(position);
  }

  setPieceAt(oldPosition, newPosition) {
    const playingPiece = this.board[oldPosition.row][oldPosition.col]

    this.board[oldPosition.row][oldPosition.col] = null
    playingPiece.setPosition(new Position(newPosition.row, newPosition.col))
    this.board[newPosition.row][newPosition.col] = playingPiece;

    if (this.board[newPosition.row][newPosition.col] &&
      !this.board[newPosition.row][newPosition.col].isKing &&
      newPosition.row === 0) {
      this.board[newPosition.row][newPosition.col].setKing(true)
    }

  }

  pieces() {
    return this.board;
  }

  getBoard() {
    return this.board;
  }

  set(updatedBoard) {
    this.board = updatedBoard;
  }

  getPieceColor(position) {
    const piece = this.board[position.row][position.col];
    if (piece) {
      return piece.getColor();
    }
    return ColorObj.EMPTY;
  }

  display() {
    // Implement your display logic here
  }

  init() {
    // Implement your initialization logic here


  }

  clear() {
    // Implement your clear logic here
  }

  putAt(piece, position) {
    this.board[position.row][position.col] = piece;
  }

  remove(pieces) {
    for (const piece of pieces) {
      this.removePiece(piece);
    }
  }

  removePiece(piece) {
    const position = piece.getPosition();
    this.board[position.row][position.col] = null;
  }

  isValidPosition(position) {
    return (
      position.row >= 0 &&
      position.row < this.size &&
      position.col >= 0 &&
      position.col < this.size
    );
  }
}

module.exports = Board;
