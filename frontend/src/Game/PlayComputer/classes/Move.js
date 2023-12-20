class Move {
    constructor(from, to) {
        this.from = from;
        this.to = to;
        this.next = null;
    }

    addNextMove(nextMove) {
        let current = this.next;

        if (!current) {
            this.next = new Move(nextMove.from, nextMove.to);
            return;
        }

        while (current.next) {
            current = current.next;
        }

        current.next = new Move(nextMove.from, nextMove.to);
    }

    getNext() {
        return this.next;
    }

    displayNextMoves() {
        let current = this.next;

        if (!current) {
            console.log("No next moves to display.");
            return;
        }

        while (current.next) {
            console.log(`From: (${current.from.row}, ${current.from.col}), To: (${current.to.row}, ${current.to.col})`);
            current = current.next;
        }

        console.log(`From: (${current.from.row}, ${current.from.col}), To: (${current.to.row}, ${current.to.col})`);
    }
}


module.exports = Move;
