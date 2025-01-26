// Select the root element
const root = document.getElementById("root");

// Create a chess board
function createChessBoard() {
  const chessBoard = document.createElement("div");
  chessBoard.classList.add("chess-board");

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const square = document.createElement("div");
      square.classList.add("square");

      // Alternate between light and dark squares
      if ((row + col) % 2 === 0) {
        square.classList.add("light");
      } else {
        square.classList.add("dark");
      }

      // Optionally add piece placeholders
      if (row === 1) {
        square.textContent = "♟"; // Black Pawn
        square.classList.add("piece", "black");
      } else if (row === 6) {
        square.textContent = "♙"; // White Pawn
        square.classList.add("piece", "white");
      }

      // Add event listeners for interactions
      square.addEventListener("click", () => handleSquareClick(square));

      chessBoard.appendChild(square);
    }
  }

  return chessBoard;
}

// Handle click event for squares
function handleSquareClick(square) {
  const isSelected = square.classList.contains("selected");

  // Deselect if already selected
  document.querySelectorAll(".square.selected").forEach((sq) => {
    sq.classList.remove("selected");
  });

  if (!isSelected) {
    square.classList.add("selected");
  }
}

// Render the chess board
root.appendChild(createChessBoard());
