const opponentOf = (playerColor) => {
    if (playerColor == 'yellow') {
      return 'blue'
    } else {
      return 'yellow'
    }
}

const createPieces = () => {
    return {
      'blue-W': new Piece('blue', 'W', [[-1, -1], [-1, 0], [0, 1], [1, 1]]),
      'blue-U': new Piece('blue', 'U', [[-1, -1], [-1, 0], [1, 0], [1, -1]]),
      'blue-+': new Piece('blue', '+', [[-1, 0], [0, -1], [0, 1], [1, 0]]),
      'blue-&': new Piece('blue', '&', [[-1, 0], [0, -1], [1, 1], [0, 1]]),
      'blue-Z': new Piece('blue', 'Z', [[0, -1], [1, 0], [1, 1]]),
      'blue-square': new Piece('blue', 'square', [[-1, 0], [-1, -1], [0, -1]]),
      'blue-T': new Piece('blue', 'T', [[0, -1], [0, 1], [1, 0]]),
      'blue-line': new Piece('blue', 'line', [[0, 1], [0, -1]]),
      'blue-V1': new Piece('blue', 'V1', [[0, -1], [1, 0]]),
      'blue-V2': new Piece('blue', 'V2', [[0, -1], [1, 0]]),
      'blue-two1': new Piece('blue', 'two1', [[0, -1]]),
      'blue-two2': new Piece('blue', 'two2', [[0, -1]]),
      'blue-one1': new Piece('blue', 'one1', []),
      'blue-one2':  new Piece('blue', 'one2', []),
      'yellow-W': new Piece('yellow', 'W', [[-1, -1], [-1, 0], [0, 1], [1, 1]]),
      'yellow-U': new Piece('yellow', 'U', [[-1, -1], [-1, 0], [1, 0], [1, -1]]),
      'yellow-+': new Piece('yellow', '+', [[-1, 0], [0, -1], [0, 1], [1, 0]]),
      'yellow-&': new Piece('yellow', '&', [[-1, 0], [0, -1], [1, 1], [0, 1]]),
      'yellow-Z': new Piece('yellow', 'Z', [[0, -1], [1, 0], [1, 1]]),
      'yellow-square': new Piece('yellow', 'square', [[-1, 0], [-1, -1], [0, -1]]),
      'yellow-T': new Piece('yellow', 'T', [[0, -1], [0, 1], [1, 0]]),
      'yellow-line': new Piece('yellow', 'line', [[0, 1], [0, -1]]),
      'yellow-V1': new Piece('yellow', 'V1', [[0, -1], [1, 0]]),
      'yellow-V2': new Piece('yellow', 'V2', [[0, -1], [1, 0]]),
      'yellow-two1': new Piece('yellow', 'two1', [[0, -1]]),
      'yellow-two2': new Piece('yellow', 'two2', [[0, -1]]),
      'yellow-one1': new Piece('yellow', 'one1', []),
      'yellow-one2':  new Piece('yellow', 'one2', []),
      'cathedral': new Piece('cathedral', 'cathedral', [[-1, 0], [0, 1], [0, 2], [1, 0], [0, -1]])
    }
}

const makeBoard = (rows, columns) => {
    const board = []
    for (let i=0; i<rows; i++) {
      const row = []
      for (let j=0; j<columns; j++) {
        row.push(new Space())
      }
      board.push(row)
    }
    return board
}

const isPlacementValid = (board, X, Y, piece) => {
    for(let occupiedSpace of piece.occupiedSpaces){
        let spaceX = X + occupiedSpace[0]
        let spaceY = Y + occupiedSpace[1]
        
        if(spaceX < 0 || spaceX > 9 || spaceY < 0 || spaceY > 9){
        return false
        }
        let thisSpace = board[spaceX][spaceY]
        if(thisSpace.piece || thisSpace.owner === opponentOf(piece.player)){
        return false
        }
    }
    return true
} 