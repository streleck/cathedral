const colorSquare = (square) => {
    let X = square.id[1]
    let Y = square.id[4]
    
    const space = board[X][Y]
    let color = COLOR_MAP.emptySpaces.unclaimed
    if (space.piece) {
        color = COLOR_MAP.pieces[space.piece.player]
    } else if (space.owner) {
        color = COLOR_MAP.space[space.owner]
    } 

    square.style.setProperty('background-color', color)
}

const highlightSquare = (X, Y) => {
    // Disregard squares beyond board / borders
    if(X < -1 || X > 10 || Y < -1 || Y > 10){
      return
    }
    // Color invalid border spaces
    else if(X === -1){
      let invalidSquare = document.getElementById('left-y' + Y)
      invalidSquare.style.setProperty('background-color', COLOR_MAP.highlights.invalid)
    }
    else if(X === 10){
      let invalidSquare = document.getElementById('right-y' + Y)
      invalidSquare.style.setProperty('background-color', COLOR_MAP.highlights.invalid)  
    }
    else if(Y === -1){
      let invalidSquare = document.getElementById('top-x' + X)
      invalidSquare.style.setProperty('background-color', COLOR_MAP.highlights.invalid)  
    }
    else if(Y === 10){
      let invalidSquare = document.getElementById('bottom-x' + X)
      invalidSquare.style.setProperty('background-color', COLOR_MAP.highlights.invalid)  
    }
    else {
      let domElement = document.getElementById('x'+ X + '-y' + Y)
      const space = board[X][Y]
      if(!space.piece && space.owner !== turn){
        domElement.style.setProperty('background-color', COLOR_MAP.highlights.valid)
      }
      else {
        domElement.style.setProperty('background-color', COLOR_MAP.highlights.invalid)
      }
    }
}

const onClickSquare = (event) => {
    let X = +event.target.id[1]
    let Y = +event.target.id[4]
    let square = board[X][Y]
    if(Object.keys(selectedPiece).length === 0){
      return
    } else {
  
      if(isPlacementValid(board, X, Y, selectedPiece)){
        // Color the squares
        let pieceSpaces = selectedPiece.getPieceSpaces()
        for(let pieceSpace of pieceSpaces){
          const spaceX = X + pieceSpace.coordinates[0]
          const spaceY = Y + pieceSpace.coordinates[1]
          const space = board[spaceX][spaceY]
          space.placePiece(selectedPiece)
          let domElement = document.getElementById('x'+ spaceX + '-y' + spaceY)
          domElement.style.setProperty('background-color', selectedPiece.name === 'cathedral' ? 'white' : turn)
          domElement.style.setProperty('border', '1px solid ' + (selectedPiece.name === 'cathedral' ? 'white' : turn))
          for(border of pieceSpace.borders){
            domElement.style.setProperty('border-' + border, '1px solid white')
          }
        }
        if (selectedPiece.name === 'cathedral'){
          infoMessage.innerText = turn.charAt(0).toUpperCase() + turn.slice(1) + ' player\'s turn.'
        } else{
          // Make that piece unavailable, and do the turn-changing stuff
          pieces[selectedPiece.name].isAvailable = false
          let pieceHtmlElement = document.getElementById(selectedPiece.name)
          pieceHtmlElement.style.setProperty('opacity', '0.0')
          let yellowBank = document.getElementById('yellow-bank')
          let blueBank = document.getElementById('blue-bank')
          
          if(turn === 'yellow'){
            turn = 'blue'
            yellowBank.style.setProperty('display', 'none')
            blueBank.style.setProperty('display', 'block')
            infoMessage.innerText = turn.charAt(0).toUpperCase() + turn.slice(1) + ' player\'s turn.'
          } else {
            turn = 'yellow'
            blueBank.style.setProperty('display', 'none')
            yellowBank.style.setProperty('display', 'block')
            infoMessage.innerText = turn.charAt(0).toUpperCase() + turn.slice(1) + ' player\'s turn.'
          }
        }
        selectedPiece = {}
      }
      return
    }
  }

const onClickPiece = function(event) {
    // Don't let them choose a piece if they're placing the cathedral
    if (selectedPiece.name === 'cathedral'){
      return
    }
    // Don't let them choose the piece if they dont have it
    if (!pieces[event.target.id].isAvailable){
      return
    }
    // Assign the new selected piece
    selectedPiece = pieces[event.target.id]
    let allPieces = document.getElementsByClassName('game-piece')
    for (let piece of allPieces){
      piece.style.setProperty('border', '1px solid white')
    }
    event.target.style.setProperty('border', '1px solid red')
}

const onMouseenter = function(event){
    if(!selectedPiece || Object.keys(selectedPiece).length === 0){
      return
    }
    let X = +event.target.id[1]
    let Y = +event.target.id[4]
    boardCursor = [X, Y]
    for(let occupiedSpace of selectedPiece.occupiedSpaces){
        let spaceX = X + occupiedSpace[0]
        let spaceY = Y + occupiedSpace[1]
        highlightSquare(spaceX, spaceY)
    }
}

const onMouseleave = function(event){
    boardCursor = [undefined, undefined]
    for(let square of borderSquares){
      square.style.setProperty('background-color', 'white')
    }
    let boardSquares = document.getElementsByClassName('game-square')
  
    for (let square of boardSquares) {
        colorSquare(square)
    }
}

const onSpacebar = function(event){
    // If boardCursor not on board, do nothing
    if (!boardCursor || (typeof boardCursor[1] !== 'number')){
      return
    }
    if(Object.keys(selectedPiece).length > 0){
      let X = boardCursor[0]
      let Y = boardCursor[1]
      // Get rid of current highlighted squares
      for(let borderSquare of borderSquares){
        borderSquare.style.setProperty('background-color', 'white')
      }
      for(let occupiedSpace of selectedPiece.occupiedSpaces){
        let spaceX = X + occupiedSpace[0]
        let spaceY = Y + occupiedSpace[1]
        // Ignore spaces not contained on board
        if(spaceX < 0 || spaceX > 9 || spaceY < 0 || spaceY > 9){
          continue
        }
        const domElement = document.getElementById('x'+ spaceX + '-y' + spaceY)
        colorSquare(domElement)
      }
      // Make the rotation
      selectedPiece.rotate()
      for(let occupiedSpace of selectedPiece.occupiedSpaces){
        let spaceX = X + occupiedSpace[0]
        let spaceY = Y + occupiedSpace[1]
        // Disregard squares beyond board / borders
        if(spaceX < -1 || spaceX > 10 || spaceY < -1 || spaceY > 10){
          continue
        }
        highlightSquare(spaceX, spaceY)
      }
    }
}