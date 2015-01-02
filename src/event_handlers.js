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
			} else if (board[row][col] === "whtK") {
				$(".row-" + numToChar[row] + " .col-" + col).append("<div class=whiteKing></div")
			} else if (board[row][col] === "redK") {
				$(".row-" + numToChar[row] + " .col-" + col).append("<div class=redKing></div")
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
	redCapped = 0;
	whiteCapped = 0;
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
	console.log("the current moveSequence is: " + moveSequence)
	moveSequence.push(row);
	moveSequence.push(col);
	if (moveSequence.length == 2) {
		if (selectedPieceBelongsToCurrentPlayer(row, col)) {
			$(document).trigger("grabPiece", [row, col]);
		} else {
			console.log("Error: you didn't select one of your pieces");
			alert("You didn't select one of your pieces");
			moveSequence = [];
			$( ".mousemove" ).remove();
		}
	}
	if (moveSequence.length > 1 && (moveSequence[moveSequence.length - 1] === moveSequence[moveSequence.length - 3] && moveSequence[moveSequence.length - 2] === moveSequence[moveSequence.length - 4])) { // if there are actually coordinates, and if the last two clicks were on the same coordinates
		if (moveSequence.length == 6) { 																																								   // if it is a single (non n > 1 -- jump) move 
			console.log("the moveSequence is 6 characters long")
			if (attemptMove(moveSequence[0], moveSequence[1], moveSequence[2], moveSequence[3]) == "nonaggressive") {															  												// if the first two clicks actually result in a valid one square move
				console.log("attempting move of first two clicks; nonaggressive");
				makeMove(moveSequence[0], moveSequence[1], moveSequence[2], moveSequence[3]);
				moveSequence = [];
				currentPlayer = enemyPlayer(currentPlayer);
				$( ".mousemove" ).remove();
			} else if (attemptMove(moveSequence[0], moveSequence[1], moveSequence[2], moveSequence[3]) == "aggressive") {
				console.log("attempting move of first two clicks; aggressive");
				removePiece(moveSequence[0], moveSequence[1], moveSequence[2], moveSequence[3]);
				makeMove(moveSequence[0], moveSequence[1], moveSequence[2], moveSequence[3]);
				moveSequence = [];
				currentPlayer = enemyPlayer(currentPlayer);
				$( ".mousemove" ).remove();
			} else {
				moveSequence = [];
				$( ".mousemove" ).remove();
			}																				  
		} else {
			// if (testAllMoves(moveSequence)) {
			// var numAggressiveMoves = 0;
			var tester = 0;
			for (i = 0; i < moveSequence.length - 4; i += 2) {															// else, for each coordinate pair:
				console.log("The moveSequence iterator running")
				if (attemptMove(moveSequence[i], moveSequence[i + 1], moveSequence[i + 2], moveSequence[i + 3]) === "aggressive") {
					removePiece(moveSequence[i], moveSequence[i + 1], moveSequence[i + 2], moveSequence[i + 3]);
					makeMove(moveSequence[i], moveSequence[i + 1], moveSequence[i + 2], moveSequence[i + 3]);
					tester += 1
				}
			}
				// } else {
				// 	moveSequence = [];
				// 	// currentPlayer = enemyPlayer(currentPlayer);
				// 	console.log("Error--one move didn't register correctly")
				// 	$( ".mousemove" ).remove();
				// 	break
				// }
			if (tester > 1) {
				moveSequence = [];
				currentPlayer = enemyPlayer(currentPlayer);
				$( ".mousemove" ).remove();		
			} else {
				moveSequence = [];
				$( ".mousemove" ).remove();
			}		
			// }
					// removePiece(moveSequence[i], moveSequence[i + 1], moveSequence[i + 2], moveSequence[i + 3]);
					// makeMove(moveSequence[i], moveSequence[i + 1], moveSequence[i + 2], moveSequence[i + 3]);
					// tester += 1;
					// removePiece(vertMove(row1, 1, direction), col1 + 1);
			}
			// tester.forEach(function(test){
			// 	if (test === "aggressive") {
			// 		numAggressiveMoves += 1
			// 	}
			// })
			// console.log("the tester array is: " + tester)
			// if (numAggressiveMoves === tester.length) {
			// 	for (i = 0; i < moveSequence.length - 4; i += 2) {
			// 		removePiece(moveSequence[i], moveSequence[i + 1], moveSequence[i + 2], moveSequence[i + 3]);
			// 		makeMove(moveSequence[i], moveSequence[i + 1], moveSequence[i + 2], moveSequence[i + 3]);
			// 	}
			// 	moveSequence = [];
			// 	currentPlayer = enemyPlayer(currentPlayer);
			// 	$( ".mousemove" ).remove();
			// } else {
			// 	alert("One of the moves you made is invalid!")
			// 	moveSequence = [];
			// 	$( ".mousemove" ).remove();
			// }
		} 
	}  


var testAllMoves = function(moveSequence) {
	console.log("testing all moves in moveSequence" + moveSequence)
    var success = 0;
    for (i = 0; i < moveSequence.length - 4; i+= 2) {
        if (attemptMove(moveSequence[i], moveSequence[i + 1], moveSequence[i + 2], moveSequence[i + 3])) { 
        	success += 1;
        	console.log("move # " + i + "is valid") 
        }
    }
    if (success == ((moveSequence.length / 2) - 1)) { 
        return true
    } else {
        return false
    }
}