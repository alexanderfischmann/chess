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
           || 
          Math.abs(row - selectedRow) <= 1 && 
          Math.abs(col - selectedCol) <= 1 &&
          boardState[row][col] && !protectedPieces.includes(boardState[row][col])
        ) {
          movePiece(selectedRow, selectedCol, row, col);
          return;
        }
      }

      if (selectedPiece === "♖") {
        if (
          !boardState[row][col] || boardState[row][col] && !protectedPieces.includes(boardState[row][col])
        ){
          movePiece(selectedRow, selectedCol, row, col);
          return;
        }
      };

      if (selectedPiece === "♕") {
        const rowDiff = row - selectedRow;
        const colDiff = col - selectedCol;
      
        const stepRow = Math.sign(rowDiff);
        const stepCol = Math.sign(colDiff);
      
        const isStraight = rowDiff === 0 || colDiff === 0;
        const isDiagonal = Math.abs(rowDiff) === Math.abs(colDiff);
      
        if (isStraight || isDiagonal) {
          let clearPath = true;
          let r = selectedRow + stepRow;
          let c = selectedCol + stepCol;
      
          while (r !== row || c !== col) {
            if (boardState[r][c] !== "") {
              clearPath = false;
              break;
            }
            r += stepRow;
            c += stepCol;
          }
      
          if (clearPath && (!boardState[row][col] || !protectedPieces.includes(boardState[row][col]))) {
            movePiece(selectedRow, selectedCol, row, col);
            return;
          }
        }
      }
      
      if (selectedPiece === "♗") {
        const rowDiff = row - selectedRow;
        const colDiff = col - selectedCol;
      
        if (Math.abs(rowDiff) === Math.abs(colDiff)) {
          const stepRow = Math.sign(rowDiff);
          const stepCol = Math.sign(colDiff);
      
          let r = selectedRow + stepRow;
          let c = selectedCol + stepCol;
          let clearPath = true;
      
          while (r !== row && c !== col) {
            if (boardState[r][c] !== "") {
              clearPath = false;
              break;
            }
            r += stepRow;
            c += stepCol;
          }
      
          if (clearPath && (!boardState[row][col] || !protectedPieces.includes(boardState[row][col]))) {
            movePiece(selectedRow, selectedCol, row, col);
            return;
          }
        }
      }

      if (selectedPiece === "♘") {
        const rowDiff = Math.abs(row - selectedRow);
        const colDiff = Math.abs(col - selectedCol);
      
        if ((rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2)) {
          if (!boardState[row][col] || !protectedPieces.includes(boardState[row][col])) {
            movePiece(selectedRow, selectedCol, row, col);
            return;
          }
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

  const isOpponent = (piece) => piece && !["♟", "♜", "♞", "♝", "♛", "♚"].includes(piece);

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = boardState[row][col];
      if (!piece) continue;

      const forward = row + 1;

      if (piece === "♟") {
        if (forward < 8 && !boardState[forward][col]) {
          possibleMoves.push({ from: [row, col], to: [forward, col] });
        }

        if (forward < 8 && col > 0 && isOpponent(boardState[forward][col - 1])) {
          possibleMoves.push({ from: [row, col], to: [forward, col - 1] });
        }

        if (forward < 8 && col < 7 && isOpponent(boardState[forward][col + 1])) {
          possibleMoves.push({ from: [row, col], to: [forward, col + 1] });
        }
      }

      if (piece === "♜") {
        const directions = [[1,0], [-1,0], [0,1], [0,-1]];
        for (let [dr, dc] of directions) {
          for (let i = 1; i < 8; i++) {
            const r = row + dr * i;
            const c = col + dc * i;
            if (r < 0 || r > 7 || c < 0 || c > 7) break;
            const target = boardState[r][c];
            if (!target) {
              possibleMoves.push({ from: [row, col], to: [r, c] });
            } else if (isOpponent(target)) {
              possibleMoves.push({ from: [row, col], to: [r, c] });
              break;
            } else {
              break;
            }
          }
        }
      }

      if (piece === "♞") {
        const moves = [
          [2, 1], [2, -1], [-2, 1], [-2, -1],
          [1, 2], [1, -2], [-1, 2], [-1, -2]
        ];
        for (let [dr, dc] of moves) {
          const r = row + dr;
          const c = col + dc;
          if (r >= 0 && r < 8 && c >= 0 && c < 8) {
            const target = boardState[r][c];
            if (!target || isOpponent(target)) {
              possibleMoves.push({ from: [row, col], to: [r, c] });
            }
          }
        }
      }

      if (piece === "♝") {
        const directions = [[1,1], [1,-1], [-1,1], [-1,-1]];
        for (let [dr, dc] of directions) {
          for (let i = 1; i < 8; i++) {
            const r = row + dr * i;
            const c = col + dc * i;
            if (r < 0 || r > 7 || c < 0 || c > 7) break;
            const target = boardState[r][c];
            if (!target) {
              possibleMoves.push({ from: [row, col], to: [r, c] });
            } else if (isOpponent(target)) {
              possibleMoves.push({ from: [row, col], to: [r, c] });
              break;
            } else {
              break;
            }
          }
        }
      }

      if (piece === "♛") {
        const directions = [
          [1,0], [-1,0], [0,1], [0,-1],
          [1,1], [1,-1], [-1,1], [-1,-1]
        ];
        for (let [dr, dc] of directions) {
          for (let i = 1; i < 8; i++) {
            const r = row + dr * i;
            const c = col + dc * i;
            if (r < 0 || r > 7 || c < 0 || c > 7) break;
            const target = boardState[r][c];
            if (!target) {
              possibleMoves.push({ from: [row, col], to: [r, c] });
            } else if (isOpponent(target)) {
              possibleMoves.push({ from: [row, col], to: [r, c] });
              break;
            } else {
              break;
            }
          }
        }
      }

      if (piece === "♚") {
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0) continue;
            const r = row + dr;
            const c = col + dc;
            if (r >= 0 && r < 8 && c >= 0 && c < 8) {
              const target = boardState[r][c];
              if (!target || isOpponent(target)) {
                possibleMoves.push({ from: [row, col], to: [r, c] });
              }
            }
          }
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
    moveSound.play();
  }

  currentPlayer = "white";
  renderChessBoard();
}

  function renderChessBoard() {
    chessBoard.innerHTML = "";
  
    let whiteKingExists = false;
    let blackKingExists = false;
  
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
          if (piece === "♔") whiteKingExists = true;
          if (piece === "♚") blackKingExists = true;
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
  
    const statusEl = document.getElementById("game-status");
    if (statusEl) {
      statusEl.className = "";
      if (!whiteKingExists) {
        statusEl.textContent = "GAME OVER";
        statusEl.classList.add("game-over");
      } else if (!blackKingExists) {
        statusEl.textContent = "YOU WIN";
        statusEl.classList.add("you-win");
      } else {
        statusEl.textContent = "";
      }
    }
  }  

  renderChessBoard();
  return chessBoard;
}

document.getElementById("root").appendChild(createChessBoard());