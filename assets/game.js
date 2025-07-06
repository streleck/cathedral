let turn = 'yellow'
const firstTurn = 'yellow'
//const turn = Math.floor(2 * Math.random())
let selectedPiece = {}
let pieces = {}
let boardCursor = [undefined, undefined]
const gameSquares = document.getElementsByClassName('game-square')
const borderSquares = document.getElementsByClassName('border-square')
const infoMessage = document.getElementById('info-message')
const skipButton = document.getElementById('skip')

let board = makeBoard(10, 10)


function restartGame (){
  pieces = createPieces()
  selectedPiece = pieces.cathedral
}

// Create event listeners for the board squares
for (let square of gameSquares){
  square.addEventListener('click', onClickSquare)
  square.addEventListener('mouseenter', onMouseenter)
  square.addEventListener('mouseleave', onMouseleave)
}

// Create event listeners for pieces in bank
const gamePieces = document.getElementsByClassName('game-piece')
for (let piece of gamePieces){
  piece.addEventListener('click', onClickPiece)
}



//Skip
skipButton.addEventListener('click', function(){
  board = updateOwnership(board)
  selectedPiece = {}
  let yellowBank = document.getElementById('yellow-bank')
  let blueBank = document.getElementById('blue-bank')
  if(turn === 'yellow'){
    turn = 'blue'
    yellowBank.style.setProperty('display', 'none')
    blueBank.style.setProperty('display', 'block')
    infoMessage.innerText = turn.charAt(0).toUpperCase() + turn.slice(1) + ' player\'s turn.'
  }
  else {
    turn = 'yellow'
    blueBank.style.setProperty('display', 'none')
    yellowBank.style.setProperty('display', 'block')
    infoMessage.innerText = turn.charAt(0).toUpperCase() + turn.slice(1) + ' player\'s turn.'
  }
})

const checkSquare = function(X, Y){
  if(sameGroup.indexOf(X.toString() + Y.toString()) !== -1 || borderingPieces.indexOf(gameBoard[X][Y]) !== -1){
    return
  }
  else if(gameBoard[X][Y] === 'empty'){
    sameGroup.push(X.toString() + Y.toString())
    checkNeighbors(X.toString() + Y.toString())
  }
  else {
    borderingPieces.push(gameBoard[X][Y])
    return
  }
}

const checkNeighbors = function(coordinateString){
  const X = parseInt(coordinateString[0])
  const Y = parseInt(coordinateString[1])
  if(X>0 && Y>0){
    checkSquare(X-1, Y-1)
  }
  if(X>0){
    checkSquare(X-1, Y)
  }
  if(X>0 && Y<9){
    checkSquare(X-1, Y+1)
  }
  if(Y>0){
    checkSquare(X, Y-1)
  }
  if(Y<9){
    checkSquare(X, Y+1)  
  }
  if(X<9 && Y>0){
    checkSquare(X+1, Y-1)
  }
  if(X<9){
    checkSquare(X+1, Y)
  }
  if(X<9 && Y<9){
    checkSquare(X+1, Y+1)
  }
}

function groupify(gameBoard, X, Y){
  const sameGroup = [X.toString() + Y.toString()]
  const borderingPieces = []
  checkNeighbors(X.toString()+Y.toString())
  console.log('borders ', borderingPieces)
  console.log('group ', sameGroup)
  return {borderingPieces, sameGroup}
}



function updateOwnership(gameBoard){
  for(let i=0; i<10; i++){
    for(let j=0; j<10; j++){
      if(gameBoard[i][j] === 'empty'){
        let localGroup = groupify(gameBoard, i, j)
        console.log('local creq ', localGroup)

        let countColors = function(pieces){
          let yellows = []
          let blues = []
          let cathedrals = []
          for(let piece of pieces){
            console.log('peace! ', piece)
            console.log('first char: ', piece[0])
            switch(piece[0]){
              case 'y':
                yellows.push(piece)
                break
              case 'b':
                blues.push(piece)
                break
              case 'c':
                cathedrals.push(piece)
                break
              default:
                console.log('what is it? ', piece)
                break
            }
          }
          return {yellows, blues, cathedrals}
        }


        let fillArea = function(area, color){
          if(area.length = 0){
            return
          }
          for(square of area){
           gameBoard[square[0]][square[1]] = color
           document.getElementById('x' + square[0] + '-y' + square[1]).style.setProperty('background-color', 'light' + color)
          }
        }
        let erasePiece = function(pieceName, newColor){
          for (let i=0; i<10; i++){
            for(let j=0; j<10; j++){
              if(gameBoard[i][j] === pieceName){
                gameBoard[i][j] = newColor
              }
            }
          }
        }
        // Dertermine
        if(blues.length > 0 && yellows.length + cathedrals.length === 0){
          fillArea(localGroup.sameGroup, 'blue')
        }
        else if(yellows.length > 0 && blues.length + cathedrals.length === 0){
          fillArea(localGroup.sameGroup, 'yellow')
        }
        else if(yellows.length === 1 && blues.length === 1 && cathedrals.length == 0){
          for(let piece of localGroup.borderingPieces){
            //pieces[piece].occupiedSpaces.length
          }
        }
        else if(yellows.length + cathedrals.length < 2){
          if(cathedrals.length === 1){
            erasePiece('cathedral')
          }
          erasePiece(yellows[0])
          fillArea(localGroup.sameGroup, 'blue')
        }
        else if(blues.length + cathedrals.length < 2){
          if(cathedrals.length === 1){
            erasePiece('cathedral')
          }
          erasePiece(blues[0])
          fillArea(localGroup.sameGroup, 'yellow')
        }
      }
    }
  }
  return gameBoard
}


document.body.addEventListener('keypress', (event) => {
    if(event.keyCode === 32){
      event.preventDefault()
      onSpacebar(event)
    }
})












































restartGame()