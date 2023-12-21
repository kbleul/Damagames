

export const handleSquareClick = (clickedSquare, moveFrom, isEmpty,
    CreatedGame, gameBoard, methods) => {

    if (!isEmpty) {
        if (moveFrom && moveFrom.row === clickedSquare.clickedRow && moveFrom.col === clickedSquare.clickedCol) {
            methods.setMoveFrom(null)
            return
        }

        methods.setMoveFrom({ row: clickedSquare.clickedRow, col: clickedSquare.clickedCol })
    }

    else if (isEmpty && moveFrom) {

        const move = CreatedGame.humanPlayer.move(gameBoard,
            { ...moveFrom }, { row: clickedSquare.clickedRow, col: clickedSquare.clickedCol }, CreatedGame)

        methods.setBoardState([...move])
        methods.setMoveFrom(null)
    }

}