var moveSequence = [];
var games = 0;
var col, row, col1, row1
var redCapped = 0;
var whiteCapped = 0; //more global variables... meh
var $showPieces = function(board) {  																		// display all pieces in GUI
	for (row = 0; row < board.length; row++) {
		for (col = 0; col < board.length; col++) {
			if (board[row][col] === "wht") {
				$(".row-" + numToChar[row] + " .col-" + col).append("<div class=whitepiece></div")
			} else if (board[row][col] === "red") {
				$(".row-" + numToChar[row] + " .col-" + col).append("<div class=redpiece></div")
			} else if (board[row][col] === "whtK") {
				$(".row-" + numToChar[row] + " .col-" + col).append("<div class=whiteKing></div")
			} else if (board[row][col] === "redK") {
				$(".row-" + numToChar[row] + " .col-" + col).append("<div class=redKing></div")
			}
		}
	}	
}

$(document).ready(function(e) {

	$(".start").click(function(e){																			// when "start new game" button clicked:
		e.preventDefault();
		resetGame();																						// reset the game
	})
	
	$(document).on('boardChange', function (e, board) {														// when the board changes:
		e.preventDefault();
		turns += 1;																							// increment the "turns counter";
		$(".turncounter").html("Turns: " + turns);															// update the "turns counter" in the GUI;
		$(".col").children().remove();																		// remove all current piece divs;
		$showPieces(board);																					// display all pieces
	});

	$(document).on("pieceTaken", function (e, currentPlayer, enemyPlayer, row, col) {									// when a piece is taken:
		e.preventDefault();
		alert(enemyPlayer + " took " + currentPlayer + "'s piece at location " + row + ", " + col + "!");				// alert which piece was taken;
		if (currentPlayer === "wht") {																					// if the current player is white;
			$(".capturedWhite").append("<div class='captured red'></div>")												// add a white piece to the "red captured pieces" div;
			redCapped += 1;																								// increment "red capped" counter;
		} else {
			$(".capturedRed").append("<div class='captured white'></div>")												// else add a red piece to the "white captured pieces" div;
			whiteCapped += 1;
		}
		if (redCapped === 12) {																							// Win condition is implemented here
			alert("White wins!");
			resetGame();
		} else if (whiteCapped === 12) {																				
			alert("Red Wins!");
			resetGame();
		}
		
	})

	$(document).on("invalidMove", function(e, args){														// Generic invalidMove alert (is this necessary/used?)
		e.preventDefault();
		alert(args)
	})

	$(document).mousemove(function (e){																		// When the mouse moves:
  		$(".mousemove").css({																				// add the css attributes to "mousemove" divs that make the div track the mouse whenever it moves
    		left: e.pageX - 15,
    		top: e.pageY - 20
  		});
  	});

	$(document).on("grabPiece", function (e, row, col) {	
		e.preventDefault();
		if (board[row][col] === "wht") {
			console.log("you selected a white piece")
			$( "body" ).append("<div class='mousemove whitepiece'></div>")
		} else if (board[row][col] === "red") {
			$( "body" ).append("<div class='mousemove redpiece'></div>")
		} else if (board[row][col] === "whtK") {
			$( "body" ).append("<div class='mousemove whiteKing'></div>")
		} else if (board[row][col] === "redK") {
			$( "body" ).append("<div class='mousemove redKing'></div>")
		}
	});

	$( ".col" ).click(function(e) {													// extract the y-coordinate of click
	  col = parseInt(this.className[8]);
	  console.log("col = " + col)
	});

	$( ".row" ).click(function(e) {													// extract the x-coordinate of click
	  row = numToChar.indexOf(this.className[8]);
	  console.log("row = " + row);
	  registerClick(row, col);
	})

})

function registerClick (row, col) {
	console.log("the current moveSequence is: " + moveSequence)
	moveSequence.push(row);
	moveSequence.push(col);
	if (moveSequence.length == 2) {													// if only one click has so far been registered
		if (selectedPieceBelongsToCurrentPlayer(row, col)) {						// if the piece clicked on belongs to the current player
			$(document).trigger("grabPiece", [row, col]);							// trigger the grabPiece animation
		} else {
			console.log("Error: you didn't select one of your pieces");				// else alert error, reset moveSequence
			alert("You didn't select one of your pieces");
			moveSequence = [];
			$( ".mousemove" ).remove();	// this may be unnecessary		
		}
	}
	if (moveSequence.length > 1 && (moveSequence[moveSequence.length - 1] === moveSequence[moveSequence.length - 3] && moveSequence[moveSequence.length - 2] === moveSequence[moveSequence.length - 4])) { // if there are actually coordinates, and if the last two clicks were on the same coordinates
		if (moveSequence.length == 6) { 																																								   // if it is a single (non n > 1 -- jump) move 
			console.log("the moveSequence is 6 characters long")
			if (attemptMove(moveSequence[0], moveSequence[1], moveSequence[2], moveSequence[3]) == "nonaggressive") {															  							// if the first two clicks actually result in a valid one square move
				console.log("attempting move of first two clicks; nonaggressive");
				makeMove(moveSequence[0], moveSequence[1], moveSequence[2], moveSequence[3]);
				moveSequence = [];
				currentPlayer = enemyPlayer(currentPlayer);
				$( ".mousemove" ).remove();
			} else if (attemptMove(moveSequence[0], moveSequence[1], moveSequence[2], moveSequence[3]) == "aggressive") {
				console.log("attempting move of first two clicks; aggressive");
				makeMove(moveSequence[0], moveSequence[1], moveSequence[2], moveSequence[3]);
				removePiece(moveSequence[0], moveSequence[1], moveSequence[2], moveSequence[3]);
				moveSequence = [];
				currentPlayer = enemyPlayer(currentPlayer);
				$( ".mousemove" ).remove();
			} else {
				moveSequence = [];
				$( ".mousemove" ).remove();
			}																				  
		} else {
			var successfulMoves = 0;
			for (i = 0; i < moveSequence.length - 4; i += 2) {															// else, for each coordinate pair:
				console.log("The moveSequence iterator running")
				if (attemptMove(moveSequence[i], moveSequence[i + 1], moveSequence[i + 2], moveSequence[i + 3]) === "aggressive") {
					makeMove(moveSequence[i], moveSequence[i + 1], moveSequence[i + 2], moveSequence[i + 3]);
					removePiece(moveSequence[i], moveSequence[i + 1], moveSequence[i + 2], moveSequence[i + 3]);
					successfulMoves += 1
				}
			}

			if (successfulMoves > 0) {
				moveSequence = [];
				currentPlayer = enemyPlayer(currentPlayer);
				$( ".mousemove" ).remove();		
			} else {
				moveSequence = [];
				$( ".mousemove" ).remove();
				alert("You didn't make a valid move!")
			}		

		}

	} 
}  