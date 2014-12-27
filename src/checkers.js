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

var $invalid = $(document).trigger("invalidMove")

var makeMove = function (row1, col1, row2, col2) {
  console.log("makeMove called")
  board[row1][col1] = " X ";
  board[row2][col2] = currentPlayer;
  currentPlayer = enemyPlayer(currentPlayer); // Change players
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
  if (board[row1][col1] === currentPlayer) {  // if the selected position belongs to the player
    console.log("current player is white; white piece selected");
    if (board[row2][col2] === " X ") { // if the position to be moved to is empty
      console.log("destination is empty");
      if (currentPlayer === "wht") {  // if the current player is white
        console.log("currentPlayer is indeed white");
        if (row1 + 1 === row2 && (col2 === col1 -1 || col2 === col1 + 1)) { // check if it is a valid non-aggressive (1-square) move
          console.log("Valid non-aggressive move");
          makeMove(row1, col1, row2, col2);
        } 
        else if (row1 + 2 === row2 && (col2 === col1 - 2 || col2 === col1 + 2)) { // else check if it is an aggressive (2-square) move
          console.log("AGGRESSIVE MOVE DETECTED")
          if (row1 + 2 === row2 && col1 + 2 === col2) { // check if the move is indeed down and to the right
            console.log("THE MOVE IS DOWN AND TO THE RIGHT")
            if (board[row1 + 1][col1 + 1] != currentPlayer && board[row1 + 1][col1 + 1] != " X ") { // check if there is an enemy piece down and to the right
              console.log("ENEMY PIECE DOWN AND TO THE RIGHT DETECTED")
              removePiece(row1 + 1, col1 + 1);
              makeMove(row1, col1, row2, col2);
            } else {
              console.log("Error: Not a valid move")
              $invalid
            }
          }
          else if (row1 + 2 === row2 && col1 - 2 === col2) { // check if the move is indeed down and to the left
            if (board[row1 + 1][col1 - 1] != currentPlayer && board[row1 + 1][col1 - 1] != " X ") { // check if there is an enemy piece down and to the left
              removePiece(row1 + 1, col1 - 1);
              makeMove(row1, col1, row2, col2);
            } else {  
              console.log("Error: Not a valid move")
              $invalid
            }
          }
          else {
            console.log("Error: Not a valid move")
            $invalid
          }
        } 
      }
      
      else { // if the current player is red
        if (row1 - 1 === row2 && (col2 === col1 -1 || col2 === col1 + 1)) { // check if it is a valid non-aggressive (1-square) move
          console.log("valid non-aggressive move by red")
          makeMove(row1, col1, row2, col2);
        } 
        else if (row1 - 2 === row2 && (col2 === col1 - 2 || col2 === col1 + 2)) { // else check if it is an aggressive (2-square) move
          console.log("AGGRESSIVE MOVE DETECTED")
          if (row1 - 2 === row2 && col1 + 2 === col2) { // check if the move is indeed down and to the right
            console.log("THE MOVE IS UP AND TO THE RIGHT")
            if (board[row1 - 1][col1 + 1] != currentPlayer && board[row1 - 1][col1 + 1] != " X ") { // check if there is an enemy piece up and to the right
              console.log("ENEMY PIECE UP AND TO THE RIGHT DETECTED")
              removePiece(row1 - 1, col1 + 1);
              makeMove(row1, col1, row2, col2);
            } else {
              console.log("Error: Not a valid move")
              $invalid
            }
          }
          else if (row1 - 2 === row2 && col1 - 2 === col2) { // check if the move is indeed up and to the left
            console.log("THE MOVE IS UP AND TO THE LEFT")
            if (board[row1 - 1][col1 - 1] != currentPlayer && board[row1 - 1][col1 - 1] != " X ") { // check if there is an enemy piece up and to the left
            console.log("ENEMY PIECE UP AND TO THE LEFT DETECTED")
              removePiece(row1 - 1, col1 - 1);
              makeMove(row1, col1, row2, col2);
            } else {
              console.log("Error: Not a valid move")
              $invalid
            }
          }
          else {
            console.log("Error: Not a valid move")
            $invalid
          }
        } 
      }
    } else {
      console.log("Error: Not a valid move")
      $(document).trigger("invalidMove", "That is not a valid position to move to!")
    }
  } else {
    console.log("Error: Not a valid move")
    $(document).trigger("invalidMove", "You didn't move one of your pieces!")
  }
}

