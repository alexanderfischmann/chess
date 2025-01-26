const selectSound = new Audio("./resources/button-press-beep-269718.mp3");
const moveSound = new Audio("./resources/move-self.mp3")

function createChessBoard() {
  const chessBoard = document.createElement("div");
  chessBoard.classList.add("chess-board");

  const initialPieces = [
    ["♜", "♞", "♝", "♛", "♚", "♝", "♞", "♜"],
    ["♟", "♟", "♟", "♟", "♟", "♟", "♟", "♟"],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["♙", "♙", "♙", "♙", "♙", "♙", "♙", "♙"],
    ["♖", "♘", "♗", "♕", "♔", "♗", "♘", "♖"]
  ];

  const boardState = [...initialPieces];
  let selectedSquare = null;
  let currentPlayer = "white";

  function handleSquareClick(row, col) {
    if (currentPlayer !== "white") return;

    if (selectedSquare) {
      const [selectedRow, selectedCol] = selectedSquare;

      if (selectedRow !== row || selectedCol !== col) {
        boardState[row][col] = boardState[selectedRow][selectedCol];
        boardState[selectedRow][selectedCol] = "";
        selectedSquare = null;
        currentPlayer = "black";
        moveSound.play();
        renderChessBoard();
        setTimeout(aiMove, 500);
        return;
      }
    }

    if (boardState[row][col] && boardState[row][col] === "♙") {
      selectedSquare = [row, col];
      selectSound.play(); // Play selection sound
    } else {
      selectedSquare = null;
    }
    renderChessBoard();
  }

  function aiMove() {
    const possibleMoves = [];
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        if (boardState[row][col] === "♟") {
          const forward = row + 1;
          if (forward < 8 && !boardState[forward][col]) {
            possibleMoves.push({ from: [row, col], to: [forward, col] });
          }
          if (
            forward < 8 &&
            col > 0 &&
            boardState[forward][col - 1]?.startsWith("♙")
          ) {
            possibleMoves.push({ from: [row, col], to: [forward, col - 1] });
          }
          if (
            forward < 8 &&
            col < 7 &&
            boardState[forward][col + 1]?.startsWith("♙")
          ) {
            possibleMoves.push({ from: [row, col], to: [forward, col + 1] });
          }
        }
      }
    }

    if (possibleMoves.length > 0) {
      const move = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
      const [fromRow, fromCol] = move.from;
      const [toRow, toCol] = move.to;
      boardState[toRow][toCol] = boardState[fromRow][fromCol];
      boardState[fromRow][fromCol] = "";
    }
    currentPlayer = "white";
    renderChessBoard();
  }

  function renderChessBoard() {
    chessBoard.innerHTML = "";

    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const square = document.createElement("div");
        square.classList.add("square");

        if ((row + col) % 2 === 0) {
          square.classList.add("light");
        } else {
          square.classList.add("dark");
        }

        const piece = boardState[row][col];
        if (piece) {
          square.textContent = piece;
          square.classList.add("piece", piece === piece.toUpperCase() ? "white" : "black");
        }

        if (
          selectedSquare &&
          selectedSquare[0] === row &&
          selectedSquare[1] === col
        ) {
          square.classList.add("selected");
        }

        square.addEventListener("click", () => handleSquareClick(row, col));

        chessBoard.appendChild(square);
      }
    }
  }

  renderChessBoard();
  return chessBoard;
}

document.getElementById("root").appendChild(createChessBoard());