import { useEffect, useState } from "react";
import { Board, useBoard } from "../../classes/Board.ts";
import Figure from "../../classes/Figure.ts";

interface ElephantElementProps {
  row: number;
  col: number;
  isCaptured: boolean;
  figure: Figure;
  owner: string;
}

function ElephantElement({
  row,
  col,
  isCaptured,
  figure,
  owner,
}: ElephantElementProps) {
  const { getBoardCell, displayAvailableMoves, clearMoves } = useBoard();
  const board = Board.instance;

  const [, setTick] = useState(0);
  const [isPromoted, setIsPromoted] = useState(false);

  const cell = isCaptured ? null : getBoardCell(row, col);

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

  useEffect(() => {
    if (cell && cell.figureOn?.getState().checkPromotion() !== undefined) {
      setIsPromoted(!!cell.figureOn?.getState().checkPromotion());
    }
  }, [cell]);

  if (isCaptured) {
    const elephantImage = "elephant.png";
    const onElephantClick = () => {
      if (board.currentTurn === owner) {
        board.figureToDrop = figure;
        board.elephantMoveDisplay.displayDropIn(figure);
        const movesToDisplay = board.cellsToMoveDisplay;
        displayAvailableMoves(movesToDisplay);
      }
    };

    return (
      <div
        className="figure"
        onClick={onElephantClick}
        draggable
        onDragStart={onElephantClick}
        onDragEnd={() => {
          board.selectedCell = null;
          clearMoves();
          board.clearCapturesDisplay();
        }}
      >
        <img
          src={`src/images/figures/${elephantImage}`}
          alt="Captured Elephant"
        />
      </div>
    );
  } else {
    const onElephantClick = () => {
      if (!cell) return;

      if (board.currentTurn === "sente" && !cell.displayRotated) {
        if (!cell.canCapture) {
          board.selectedCell = cell;
          board.elephantMoveDisplay.displayMoves(cell);
          const movesToDisplay = board.cellsToMoveDisplay;
          displayAvailableMoves(movesToDisplay);
        }
      } else if (board.currentTurn === "gote" && cell.displayRotated) {
        if (!cell.canCapture) {
          board.selectedCell = cell;
          board.elephantMoveDisplay.displayMoves(cell);
          const movesToDisplay = board.cellsToMoveDisplay;
          displayAvailableMoves(movesToDisplay);
        }
      }
    };

    const elephantImage = isPromoted
      ? "elephant_promotion.png"
      : "elephant.png";

    return (
      <div
        className="figure"
        onClick={onElephantClick}
        draggable
        onDragStart={onElephantClick}
        onDragEnd={() => {
          board.selectedCell = null;
          clearMoves();
          board.clearCapturesDisplay();
        }}
      >
        <img src={`src/images/figures/${elephantImage}`} alt="Elephant" />
      </div>
    );
  }
}

export default ElephantElement;
