const selectSound = new Audio("./resources/notify.mp3");
const moveSound = new Audio("./resources/move-self.mp3")

const protectedPieces = ["♙", "♖", "♘", "♗", "♕", "♔"]

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
      const selectedPiece = boardState[selectedRow][selectedCol];
  
      if (selectedPiece === "♙") {
        const forward = selectedRow - 1;
        const doubleForward = selectedRow - 2;

        if (row === forward && col === selectedCol && !boardState[row][col]) {
          movePiece(selectedRow, selectedCol, row, col);
          return;
        }
  
        if (selectedRow === 6 && row === doubleForward && col === selectedCol && !boardState[forward][col] && !boardState[row][col]) {
          movePiece(selectedRow, selectedCol, row, col);
          return;
        }
  
        if (row === forward && (col === selectedCol - 1 || col === selectedCol + 1) 
          && boardState[row][col] && !protectedPieces.includes(boardState[row][col])) {
        movePiece(selectedRow, selectedCol, row, col);
        return;
      }
      
      }

      if (selectedPiece === "♔") {
        if (
          Math.abs(row - selectedRow) <= 1 && 
          Math.abs(col - selectedCol) <= 1 &&
          !boardState[row][col]
        ) {
          movePiece(selectedRow, selectedCol, row, col);
          return;
        }
      }

      if (selectedPiece === "♖") {
        if (!boardState[row][col]){
          movePiece(selectedRow, selectedCol, row, col);
          return;
        }
      }
    }
  
    if (boardState[row][col] && boardState[row][col]) {
      selectedSquare = [row, col];
      selectSound.play();
    } else {
      selectedSquare = null;
    }
    renderChessBoard();
  }
  
  function movePiece(fromRow, fromCol, toRow, toCol) {
    boardState[toRow][toCol] = boardState[fromRow][fromCol];
    boardState[fromRow][fromCol] = "";
  
    selectedSquare = null;
    currentPlayer = "black";
    moveSound.play();
    renderChessBoard();
    setTimeout(aiMove, 500);
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

          if (forward < 8 && col > 0 && boardState[forward][col - 1] && boardState[forward][col - 1] !== "♟") {
            possibleMoves.push({ from: [row, col], to: [forward, col - 1] });
          }

          if (forward < 8 && col < 7 && boardState[forward][col + 1] && boardState[forward][col + 1] !== "♟") {
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
      moveSound.play()
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