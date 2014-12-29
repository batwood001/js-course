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

$(document).ready(function(e) {

	$(".start").click(function(e){
		games += 1;
		e.preventDefault();
		$(".col").children().remove();
		$(".gamecounter").html("Games: " + games);
		$(".turncounter").html("Turns: 0");
		$(".capturedWhite").children().remove();
		$(".capturedRed").children().remove();
		resetBoard();
		turns = 0;
		displayBoard();
		$showPieces(board);
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
		} else {
			$(".capturedRed").append("<div class='captured white'></div>")
		}
		
	})

	$(document).on("invalidMove", function(e, args){
		e.preventDefault();
		alert(args)
	})


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
	if (moveSequence.length >= 4) {
		console.log("Here's the moveSequence: " + moveSequence)
		if (moveSequence[moveSequence.length - 1] === moveSequence[moveSequence.length - 3] && moveSequence[moveSequence.length - 2] === moveSequence[moveSequence.length - 4]) {
			console.log("the thing worked")
			if (isValidOneSquareMove(moveSequence[0], moveSequence[1], moveSequence[2], moveSequence[3])) {
				attemptMove(moveSequence[0], moveSequence[1], moveSequence[2], moveSequence[3])
			} else {
			for (i = 0; i < moveSequence.length - 4; i += 2) {
				console.log("The moveSequence iterator running")
				attemptMove(moveSequence[i], moveSequence[i + 1], moveSequence[i + 2], moveSequence[i + 3])
				} 
			}
		moveSequence = [];
		currentPlayer = enemyPlayer(currentPlayer);	
		}  
	}
}



// function registerClick() {
// 	clicks += 1
// 	if (clicks === 2) {
// 	  	console.log("2 clicks; col1 = " + col1 + ", row1 = " + row1 + ", col = " + col + ", row = " + row)
// 	  	attemptMove(row1, col1, row, col);
// 	  	clicks = 0;
// 	} else {
// 	  	col1 = col;
// 	  	row1 = row;
// 	  	console.log("col1this = " + col1 + ", row1this = " + row1);
// 	}	
// }

