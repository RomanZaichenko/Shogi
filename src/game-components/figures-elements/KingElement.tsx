import { useState, useEffect } from "react";
import { Board, useBoard } from "../../classes/Board.ts";

interface KingElementProps {
  row: number;
  col: number;
  isCaptured: boolean;
  setGameStage: (stage: "menu" | "game" | "gameOver") => void;
}

function KingElement({ row, col, isCaptured, setGameStage }: KingElementProps) {
  const board = Board.instance;
  const { getBoardCell, displayAvailableMoves, clearMoves } = useBoard();
  const [, setTick] = useState(0); // Виправляємо помилку невикористаного tick

  const cell = isCaptured ? null : getBoardCell(row, col);

  useEffect(() => {
    if (isCaptured) {
      console.log("worked");
      board.clearBoard();
      setGameStage("gameOver");
    }
  }, [isCaptured, setGameStage, board]);

  useEffect(() => {}, [cell]);

  useEffect(() => {
    if (isCaptured) return;

    const listener = () => {
      setTick((prevTick) => prevTick + 1);
    };

    board.subscribe(listener);

    return () => {
      board.unsubscribe(listener);
    };
  }, [board, isCaptured]);

  if (isCaptured) {
    return null;
  }

  const onKingClicked = () => {
    if (!cell) return;

    if (
      (board.currentTurn === "sente" && !cell.displayRotated) ||
      (board.currentTurn === "gote" && cell.displayRotated)
    ) {
      if (cell.canCapture) {
        cell.canCapture = false;
      }

      board.selectedCell = cell;
      board.kingMoveDisplay.displayMoves(cell);
      const movesToDisplay = board.cellsToMoveDisplay;
      displayAvailableMoves(movesToDisplay);
    }
  };

  return (
    <div
      className="figure"
      onClick={onKingClicked}
      draggable
      onDragStart={onKingClicked}
      onDragEnd={() => {
        board.selectedCell = null;
        clearMoves();
        board.clearCapturesDisplay();
      }}
    >
      <img src="/images/figures/king.png" alt="King" />
    </div>
  );
}

export default KingElement;
