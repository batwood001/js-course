var numToChar = ["a", "b", "c", "d", "e", "f", "g", "h"];
var moveSequence = [];
var games = 0;
var clicks = 0;
var col, row, col1, row1
var $showPieces = function(board) {
	for (row = 0; row < board.length; row++) {
		for (col = 0; col < board.length; col++) {
			if (board[row][col] === "wht") {
				$(".row-" + numToChar[row] + " .col-" + col).append("<div class=whitepiece></div")
			} else if (board[row][col] === "red") {
				$(".row-" + numToChar[row] + " .col-" + col).append("<div class=redpiece></div")
			}
		}
	}	
}

var redCapped = 0;
var whiteCapped = 0; //more global variables... meh

var resetGame = function(){
	games += 1;
	$(".col").children().remove();
	$(".gamecounter").html("Games: " + games);
	$(".turncounter").html("Turns: 0");
	$(".capturedWhite").children().remove();
	$(".capturedRed").children().remove();
	resetBoard();
	turns = 0;
	displayBoard();
	$showPieces(board);	
}

$(document).ready(function(e) {

	$(".start").click(function(e){
		e.preventDefault();
		resetGame();
	})
	
	$(document).on('boardChange', function (e, board) {
		e.preventDefault();
		turns += 1;
		$(".turncounter").html("Turns: " + turns);
		$(".col").children().remove();
		$showPieces(board);
	});

	$(document).on("pieceTaken", function (e, currentPlayer, enemyPlayer, row, col) {
		e.preventDefault();
		alert(enemyPlayer + " took " + currentPlayer + "'s piece at location " + row + ", " + col + "!");
		if (currentPlayer === "wht") {
			$(".capturedWhite").append("<div class='captured red'></div>")
			redCapped += 1;
		} else {
			$(".capturedRed").append("<div class='captured white'></div>")
			whiteCapped += 1;
		}
		if (redCapped === 12) {
			alert("White wins!");
			resetGame();
		} else if (whiteCapped === 12) {
			alert("Red Wins!");
			resetGame();
		}
		
	})

	$(document).on("invalidMove", function(e, args){
		e.preventDefault();
		alert(args)
	})

	$(document).mousemove(function (e){
  		$(".mousemove").css({
    		left: e.pageX - 15,
    		top: e.pageY - 20
  		});
  	});

	$(document).on("grabPiece", function (e, row, col) {
		e.preventDefault();
		if (currentPlayer === "wht") {
			$( "body" ).append("<div class='mousemove whitepiece'></div>")
		} else {
			$( "body" ).append("<div class='mousemove redpiece'></div>")
		}
	});

	$( ".col" ).click(function(e) {
	  col = parseInt(this.className[8]);
	  console.log("col = " + col)
	});

	$( ".row" ).click(function(e) {
	  row = numToChar.indexOf(this.className[8]);
	  console.log("row = " + row);
	  registerClick(row, col);
	})

})



function registerClick (row, col) {
	moveSequence.push(row);
	moveSequence.push(col);
	if (moveSequence.length == 2) {
		if (selectedPieceBelongsToCurrentPlayer(row, col)) {
			$(document).trigger("grabPiece");
		}
	}
	if (moveSequence.length >= 4) {
		if (moveSequence[moveSequence.length - 1] === moveSequence[moveSequence.length - 3] && moveSequence[moveSequence.length - 2] === moveSequence[moveSequence.length - 4]) { // if the last two clicks were on the same coordinates
			if (isValidOneSquareMove(moveSequence[0], moveSequence[1], moveSequence[2], moveSequence[3])) { 																	  // if the first two clicks result in a valid one square move
				console.log("isValidOneSquareMove ran correctly, despite missing direction arg");
				attemptMove(moveSequence[0], moveSequence[1], moveSequence[2], moveSequence[3])																					  // attempt the move
			} else {
				for (i = 0; i < moveSequence.length - 4; i += 2) {															// else, for each coordinate pair:
					console.log("The moveSequence iterator running")
					attemptMove(moveSequence[i], moveSequence[i + 1], moveSequence[i + 2], moveSequence[i + 3])				// attempt the move between this pair and the next one
				}
			} 
		moveSequence = [];							// reset moveSequence
		currentPlayer = enemyPlayer(currentPlayer); // There is a problem where Errors still result in the currentPlayer switching. One very hacky way of fixing it would be to change the player when an error occurs, then this would change it back...
		$( ".mousemove" ).remove();					// Maybe a more enduring solution is to check every move before any of them are made (rather than making them sequentially). If all moves are valid, THEN run the move and change the currentplayer. 
		}  
	}
}
