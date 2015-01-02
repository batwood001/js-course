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
  console.log("makeMove called with params " + row1 + col1 + row2 + col2);
  if (board[row1][col1] === "redK") {
    board[row2][col2] = "redK"
  } else if (board[row1][col1] === "whtK") {
    board[row2][col2] = "whtK"
  } else if (board[row1][col1] === "red" && row2 === 0) {
    console.log("UNIT SHOULD BE KINGED")
    board[row2][col2] = "redK"
  } else if (board[row1][col1] === "wht" && row2 === 7) {
    board[row2][col2] = "whtK"
  } else {
    board[row2][col2] = currentPlayer;
  }
  board[row1][col1] = " X ";

  displayBoard()
  $(document).trigger("boardChange", [board]);
}

var removePiece = function (row1, col1, row2, col2) {
  var row = (row1 + row2) / 2
  var col = (col1 + col2) / 2  // taking the average of the rows and columns give the piece in between
  console.log("removePiece called on row " + row + ", column " + col)
  board[row][col] = " X ";
  $(document).trigger("pieceTaken", [currentPlayer, enemyPlayer(currentPlayer), row, col]);
  $(document).trigger("boardChange", [board]);
}

var attemptMove = function (row1, col1, row2, col2) {
  console.log("attemptMove called with params: " + row1 + col1 + row2 + col2);
  if (selectedPieceBelongsToCurrentPlayer(row1, col1)) {
    if (nextPositionIsEmpty(row2, col2)) {
      if (board[row1][col1] === "wht") {
        if (isValidMove(row1, col1, row2, col2, "down")) {
          return (isValidMove(row1, col1, row2, col2, "down"))
        } else {
          return false
        }
      } else if (board[row1][col1] === "red") {
        if (isValidMove(row1, col1, row2, col2, "up")) {
          return (isValidMove(row1, col1, row2, col2, "up"))
        } else {
          return false
        }
      } else if (board[row1][col1] === "whtK" || board[row1][col1] === "redK") {
        console.log("YOU ARE MOVING A KINGED PIECE")
        if (isValidMove(row1, col1, row2, col2, "up")) {
          return (isValidMove(row1, col1, row2, col2, "up"))
        } else if (isValidMove(row1, col1, row2, col2, "down")) {
          return (isValidMove(row1, col1, row2, col2, "down"))
        } else {
          return false
        }
      } else {
        return false
      }
    }
  }
}

//:::
//universal (both player) methods:
//:::

function selectedPieceBelongsToCurrentPlayer(row1, col1) {
  if (board[row1][col1] === currentPlayer || board[row1][col1] === currentPlayer + "K") {
    return true
  } else {
    return false
  }
}

function nextPositionIsEmpty(row2, col2) {
  if (board[row2][col2] === " X ") {
    console.log("destination is empty");
    return true
  } else {
    console.log("Error: That position is not empty")
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
    console.log("Not a valid non-aggressive move");
    return false
  }
}

function isValidTwoSquareMove(row1, col1, row2, col2, direction) {
  if (vertMove(row1, 2, direction) === row2 && (col2 === col1 - 2 || col2 === col1 + 2)) {                        //check if it is moving 2 spaces
    if (vertMove(row1, 2, direction) === row2 && col1 + 2 === col2) {                                             //check if it is moving down and to the right
      if (board[vertMove(row1, 1, direction)][col1 + 1] != currentPlayer && board[vertMove(row1, 1, direction)][col1 + 1] != " X ") { //check if there is an enemy piece down and to the right
        return "valid right move" 
      }
    } else if (vertMove(row1, 2, direction) === row2 && col1 - 2 === col2) {                                      //check if it is moving down and to the left
      if (board[vertMove(row1, 1, direction)][col1 - 1] != currentPlayer && board[vertMove(row1, 1, direction)][col1 - 1] != " X ") { //check if there is an enemy piece down and to the left
        return "valid left move"
      }
    }
  } else {
    console.log("Not a valid aggressive move");
    return false
  }
}

function isValidMove(row1, col1, row2, col2, direction) {
  if (isValidOneSquareMove(row1, col1, row2, col2, direction)) {
    return "nonaggressive"
  } else if (isValidTwoSquareMove(row1, col1, row2, col2, direction) === "valid right move") {
    return "aggressive"
  } else if (isValidTwoSquareMove(row1, col1, row2, col2, direction) === "valid left move") {
    return "aggressive"
  } else {
    return false
  }
}

var resetGame = function(){
  games += 1;
  $(".col").children().remove();
  $(".gamecounter").html("Games: " + games);
  $(".turncounter").html("Turns: 0");
  $(".capturedWhite").children().remove();
  $(".capturedRed").children().remove();
  resetBoard();
  turns = 0;
  redCapped = 0;
  whiteCapped = 0;
  displayBoard();
  $showPieces(board); 
}
