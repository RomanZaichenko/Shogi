import { Board, useBoard } from "../../classes/Board.ts";
import { useEffect, useState } from "react";
import Figure from "../../classes/Figure.ts";

interface SpearElementProps {
  row: number;
  col: number;
  isCaptured: boolean;
  figure: Figure;
  owner: string;
}

function SpearElement({
  row,
  col,
  isCaptured,
  figure,
  owner,
}: SpearElementProps) {
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
    if (cell && cell.figureOn?.getState().checkPromotion() != undefined) {
      setIsPromoted(!!cell.figureOn?.getState().checkPromotion());
    }
  }, [cell]);

  let spearImage: string;

  if (isCaptured) {
    spearImage = "spear.png";
    const onSpearClick = () => {
      if (owner == board.currentTurn) {
        board.selectCapturedFigure(figure);
        board.spearMoveDisplay.displayDropIn(figure);
        const movesToDisplay = board.cellsToMoveDisplay;
        displayAvailableMoves(movesToDisplay);
      }
    };

    return (
      <div
        className="figure"
        onClick={onSpearClick}
        draggable
        onDragStart={onSpearClick}
        onDragEnd={() => {
          board.selectedCell = null;
          clearMoves();
          board.clearCapturesDisplay();
        }}
      >
        <img src={`/images/figures/${spearImage}`} alt="Captured Spear" />
      </div>
    );
  } else {
    const onSpearClick = () => {
      if (!cell) return;

      if (
        (board.currentTurn == "sente" && !cell.displayRotated) ||
        (board.currentTurn == "gote" && cell.displayRotated)
      ) {
        if (!cell.canCapture) {
          board.selectedCell = cell;
          board.spearMoveDisplay.displayMoves(cell);
          const movesToDisplay = board.cellsToMoveDisplay;
          displayAvailableMoves(movesToDisplay);
        }
      }
    };

    if (isPromoted) {
      spearImage = "spear_promotion.png";
    } else {
      spearImage = "spear.png";
    }

    return (
      <div
        className="figure"
        onClick={onSpearClick}
        draggable
        onDragStart={onSpearClick}
        onDragEnd={() => {
          board.selectedCell = null;
          clearMoves();
          board.clearCapturesDisplay();
        }}
      >
        <img src={`/images/figures/${spearImage}`} alt="Spear" />
      </div>
    );
  }
}

export default SpearElement;
