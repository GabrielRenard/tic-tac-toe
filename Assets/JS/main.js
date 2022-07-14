let board;
const user = "0";
const ai = "X";

// Array of winning combinations
const winCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [6, 4, 2],
];

const cells = document.querySelectorAll(".cell");
startGame();

function startGame() {
  // Hide endgame result from previous game
  document.querySelector(".endgame").style.display = "none";
  // set the board as an array with keys and values 1 through 9
  board = Array.from(Array(9).keys());
  // Clear the board from previous game
  for (let i = 0; i < cells.length; i++) {
    cells[i].innerText = "";
    // Clear end game highlighted winning combination
    cells[i].style.removeProperty("background-color");
    // Run turnClick function upon clicking a cell
    cells[i].addEventListener("click", turnClick, false);
  }
}

function turnClick(square) {
  if (typeof board[square.target.id] === "number") {
    turn(square.target.id, user);
    if (!checkWin(board, user) && !checkTie()) turn(bestSpot(), ai);
  }
}

function turn(squareId, player) {
  // Set the click event on the board to equal to the human player
  board[squareId] = player;
  // Populate the square with the players mark
  document.getElementById(squareId).innerText = player;
  // Check if the game has been won
  let gameWon = checkWin(board, player);
  if (gameWon) gameOver(gameWon);
}

function checkWin(board, player) {
  let plays = board.reduce(
    (accumulator, element, index) =>
      element === player ? accumulator.concat(index) : accumulator,
    []
  );
  let gameWon = null;
  for (let [index, win] of winCombos.entries()) {
    if (win.every(elem => plays.indexOf(elem) > -1)) {
      gameWon = { index: index, player: player };
      break;
    }
  }
  return gameWon;
}

function gameOver(gameWon) {
  for (let index of winCombos[gameWon.index]) {
    document.getElementById(index).style.backgroundColor =
      gameWon.player == user ? "blue" : "red";
  }
  for (var i = 0; i < cells.length; i++) {
    cells[i].removeEventListener("click", turnClick, false);
  }
  declareWinner(gameWon.player == user ? "You win!" : "You lose.");
}

function declareWinner(who) {
  document.querySelector(".endgame").style.display = "block";
  document.querySelector(".endgame .text").innerText = who;
}

function emptySquares() {
  return board.filter(s => typeof s == "number");
}

function bestSpot() {
  return minimax(board, ai).index;
}

function checkTie() {
  if (emptySquares().length == 0) {
    for (var i = 0; i < cells.length; i++) {
      cells[i].style.backgroundColor = "green";
      cells[i].removeEventListener("click", turnClick, false);
    }
    declareWinner("Tie Game!");
    return true;
  }
  return false;
}

function minimax(newBoard, player) {
  let availSpots = emptySquares();

  if (checkWin(newBoard, user)) {
    return { score: -10 };
  } else if (checkWin(newBoard, ai)) {
    return { score: 10 };
  } else if (availSpots.length === 0) {
    return { score: 0 };
  }
  let moves = [];
  for (let i = 0; i < availSpots.length; i++) {
    let move = {};
    move.index = newBoard[availSpots[i]];
    newBoard[availSpots[i]] = player;

    if (player == ai) {
      var result = minimax(newBoard, user);
      move.score = result.score;
    } else {
      let result = minimax(newBoard, ai);
      move.score = result.score;
    }

    newBoard[availSpots[i]] = move.index;

    moves.push(move);
  }

  let bestMove;
  if (player === ai) {
    let bestScore = -10000;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  } else {
    let bestScore = 10000;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }

  return moves[bestMove];
}
