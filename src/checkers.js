var board, currentPlayer

var resetBoard = function () {
  board = [
    [' X ', 'wht', ' X ', 'wht', ' X ', 'wht', ' X ', 'wht'],
    ['wht', ' X ', 'wht', ' X ', 'wht', ' X ', 'wht', ' X '],
    [' X ', 'wht', ' X ', 'wht', ' X ', 'wht', ' X ', 'wht'],
    [' X ', ' X ', ' X ', ' X ', ' X ', ' X ', ' X ', ' X '],
    [' X ', ' X ', ' X ', ' X ', ' X ', ' X ', ' X ', ' X '],
    ['red', ' X ', 'red', ' X ', 'red', ' X ', 'red', ' X '],
    [' X ', 'red', ' X ', 'red', ' X ', 'red', ' X ', 'red'],
    ['red', ' X ', 'red', ' X ', 'red', ' X ', 'red', ' X ']
  ];

  currentPlayer = 'wht'
};

var enemyPlayer = function(currentPlayer) {
  if (currentPlayer === 'wht') {
    return 'red'
  } else {
    return 'wht'
  }
}

var makeMove = function (row1, col1, row2, col2) {
  console.log("makeMove called")
  board[row1][col1] = " X ";
  board[row2][col2] = currentPlayer;
  // currentPlayer = enemyPlayer(currentPlayer);       // Change players
  console.log(board)
  $(document).trigger("boardChange", [board]);
  // getMove();
}

var removePiece = function (row, col) {
  console.log("removePiece called on row " + row + ", column " + col)
  board[row][col] = " X ";
  $(document).trigger("pieceTaken", [currentPlayer, enemyPlayer(currentPlayer), row, col]);
}

var attemptMove = function (row1, col1, row2, col2) {
  console.log("attemptMove called with params: " + row1 + col1 + row2 + col2);
  if (selectedPieceBelongsToCurrentPlayer(row1, col1)) {
    if (nextPositionIsEmpty(row2, col2)) {
      if (currentPlayer === "wht") {                // if the current player is white
        tryMove(row1, col1, row2, col2, "down")
      } else {                                      // if the current player is red
        tryMove(row1, col1, row2, col2, "up")
      }
    }
  }
}

//:::
//universal (both player) methods:
//:::

function selectedPieceBelongsToCurrentPlayer(row1, col1) {
  if (board[row1][col1] === currentPlayer) {
    console.log("current player is white; white piece selected");
    return true
  } else {
    console.log("Error: You didn't select one of your pieces");
    $(document).trigger("invalidMove", "You didn't select one of your pieces!")
    return false
  }
}

function nextPositionIsEmpty(row2, col2) {
  if (board[row2][col2] === " X ") {
    console.log("destination is empty");
    return true
  } else {
    console.log("Error: That position is not empty")
    $(document).trigger("invalidMove", "That position is not empty")
    return false
  }
}

var vertMove = function(start, distance, direction) {             // helper function to isValidOneSquareMove and isValidTwoSquareMove
  if (direction === "down") {
    return start + distance
  } else {
    return start - distance
  }
}

function isValidOneSquareMove(row1, col1, row2, col2, direction) {
  if (vertMove(row1, 1, direction) === row2 && (col2 === col1 -1 || col2 === col1 + 1)) {
    console.log("valid non-aggressive downward move");
    return true
  } else {
    console.log("Error: Not a valid non-aggressive move")
    return false
  }
}

function isValidTwoSquareMove(row1, col1, row2, col2, direction) {
  if (vertMove(row1, 2, direction) === row2 && (col2 === col1 - 2 || col2 === col1 + 2)) {                        //check if it is moving 2 spaces
    if (vertMove(row1, 2, direction) === row2 && col1 + 2 === col2) {                                             //check if it is moving down and to the right
      if (board[vertMove(row1, 1, direction)][col1 + 1] != currentPlayer && board[vertMove(row1, 1, direction)][col1 + 1] != " X ") { //check if there is an enemy piece down and to the right
        removePiece(vertMove(row1, 1, direction), col1 + 1);
        return true 
      }
    } else if (vertMove(row1, 2, direction) === row2 && col1 - 2 === col2) {                                      //check if it is moving down and to the left
      if (board[vertMove(row1, 1, direction)][col1 - 1] != currentPlayer && board[vertMove(row1, 1, direction)][col1 - 1] != " X ") { //check if there is an enemy piece down and to the left
        removePiece(vertMove(row1, 1, direction), col1 - 1)
        return true
      }
    }
  } else {
    console.log("Error: Not a valid aggressive move");
    $(document).trigger("invalidMove", "Not a valid aggressive move")
    return false
  }
}

function tryMove(row1, col1, row2, col2, direction) {
  if (isValidOneSquareMove(row1, col1, row2, col2, direction)) {
    makeMove(row1, col1, row2, col2);
  } else if (isValidTwoSquareMove(row1, col1, row2, col2, direction)) {
    makeMove(row1, col1, row2, col2);
  }
}