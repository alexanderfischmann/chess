import React, { useState } from "react";
import "./Chess.css"; // Assuming you have some basic CSS for styling the board

const initialBoard = [
  ["r", "n", "b", "q", "k", "b", "n", "r"],
  ["p", "p", "p", "p", "p", "p", "p", "p"],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  ["P", "P", "P", "P", "P", "P", "P", "P"],
  ["R", "N", "B", "Q", "K", "B", "N", "R"],
];

const pieceValues = {
  p: -1, n: -3, b: -3, r: -5, q: -9, k: -900,
  P: 1, N: 3, B: 3, R: 5, Q: 9, K: 900,
};

const ChessBoard = () => {
  const [board, setBoard] = useState(initialBoard);
  const [selected, setSelected] = useState(null);
  const [turn, setTurn] = useState("white");

  const isWhitePiece = (piece) => piece && piece.toUpperCase() === piece;
  const isBlackPiece = (piece) => piece && piece.toLowerCase() === piece;

  const handleSquareClick = (row, col) => {
    const piece = board[row][col];

    if (selected) {
      // Make a move
      const newBoard = board.map((r) => [...r]);
      newBoard[selected.row][selected.col] = null;
      newBoard[row][col] = selected.piece;
      setBoard(newBoard);
      setSelected(null);
      setTurn(turn === "white" ? "black" : "white");
    } else if (
      (turn === "white" && isWhitePiece(piece)) ||
      (turn === "black" && isBlackPiece(piece))
    ) {
      setSelected({ row, col, piece });
    }
  };

  const renderSquare = (piece, row, col) => {
    const isSelected = selected?.row === row && selected?.col === col;
    const squareColor = (row + col) % 2 === 0 ? "light" : "dark";
    const selectedClass = isSelected ? "selected" : "";

    return (
      <div
        key={`${row}-${col}`}
        className={`square ${squareColor} ${selectedClass}`}
        onClick={() => handleSquareClick(row, col)}
      >
        {piece && <span className={`piece ${isWhitePiece(piece) ? "white" : "black"}`}>{piece}</span>}
      </div>
    );
  };

  return (
    <div className="chess-board">
      {board.map((row, rowIndex) => (
        <div className="row" key={rowIndex}>
          {row.map((piece, colIndex) => renderSquare(piece, rowIndex, colIndex))}
        </div>
      ))}
    </div>
  );
};

export default ChessBoard;