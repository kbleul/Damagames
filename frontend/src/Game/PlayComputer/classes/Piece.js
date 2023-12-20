

const ColorObj = {
  RED: 1,
  BLACK: 2,
  RED_KING_COLOR: 3,
  BLACK_KING_COLOR: 4,
  EMPTY: 5,
};

class Position {
  constructor(row = -1, col = -1) {
    this.row = row;
    this.col = col;
  }

  isEqual(other) {
    return this.row === other.row && this.col === other.col;
  }

  isLessThan(other) {
    if (this.row < other.row) {
      return true;
    } else if (this.row === other.row) {
      return this.col < other.col;
    }
    return false;
  }

  isGreaterThan(other) {
    if (this.row > other.row) {
      return true;
    } else if (this.row === other.row) {
      return this.col > other.col;
    }
    return false;
  }

  toString() {
    return `(${this.row}, ${this.col})`;
  }
}

class Piece {
  constructor(color, position) {
    this.color = color;
    this.position = position;
    this.jumpedPosition = null;
    this.isKing = false;
  }

  getColor() {
    return this.color;
  }

  setColor(newColor) {
    this.color = newColor;
  }

  getPosition() {
    return this.position;
  }

  move(newPosition) {
    this.position = newPosition;
  }

  setPosition(newPosition) {
    console.log("newPosition", newPosition, this.position);
    this.position.row = newPosition.row;
    this.position.col = newPosition.col;

    console.log(this.position)
  }

  setKing(king) {
    this.isKing = king;
  }

  setJumpedPosition(jumpedPosition) {
    this.jumpedPosition = jumpedPosition;
  }

  getJumpedPosition() {
    return this.jumpedPosition;
  }

  clone() {
    const piece = new Piece(this.color, this.position);
    piece.isKing = this.isKing;
    return piece;
  }
}

module.exports = { Piece, Position, ColorObj };
