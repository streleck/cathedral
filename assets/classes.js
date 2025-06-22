function Space (piece) {
    this.piece = piece ?? null
    this.owner = null

    this.placePiece = (piece) => {
        this.piece = piece
        this.owner = piece.player
    }
}

function Piece (player, type, occupiedSpaces) {
    this.player = player
    this.type = type
    this.name = this.type === 'cathedral' ? 'cathedral' : `${player}-${type}`
    this.occupiedSpaces = occupiedSpaces
    this.occupiedSpaces.push([0,0])
    this.isAvailable = true
  
    this.getPieceSpaces = () => {
      const pieceMap = []
      for(let space of this.occupiedSpaces){
        // Create a list of borders and delete those that arent needed
        const thisSpaceBorders = ['top', 'right', 'bottom', 'left']
        for(let otherSpace of this.occupiedSpaces){
          // There's a space to the right, so you can delete the right border...
          if(space[0] === otherSpace[0]+1 && space[1] === otherSpace[1]){
            thisSpaceBorders.splice(thisSpaceBorders.indexOf('left'), 1)
          }
          if(space[0] === otherSpace[0]-1 && space[1] === otherSpace[1]){
            thisSpaceBorders.splice(thisSpaceBorders.indexOf('right'), 1)
          }
          if(space[1] === otherSpace[1]+1 && space[0] === otherSpace[0]){
            thisSpaceBorders.splice(thisSpaceBorders.indexOf('top'), 1)
          }
          if(space[1] === otherSpace[1]-1 && space[0] === otherSpace[0]){
            thisSpaceBorders.splice(thisSpaceBorders.indexOf('bottom'), 1)
          }
        }
        pieceMap.push({coordinates: space, borders: thisSpaceBorders})
      }
      return pieceMap
    }
    
    this.rotate = () => {
      let newSpaces = []
      for(let space of this.occupiedSpaces){
        let newX = -1 * space[1]
        let newY = space[0]
        newSpaces.push([newX, newY])
      }
      this.occupiedSpaces = newSpaces
    }
  }