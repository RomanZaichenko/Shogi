import { useEffect, useState } from "react";
import { Board, useBoard } from "../../classes/Board.ts";
import Figure from "../../classes/Figure.ts";

interface RookElementProps {
  row: number;
  col: number;
  isCaptured: boolean;
  figure: Figure;
  owner: string;
}

function RookElement({
  row,
  col,
  isCaptured,
  figure,
  owner,
}: RookElementProps) {
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

  let rookImage: string;

  if (isCaptured) {
    rookImage = "rook.png";
    const onRookClick = () => {
      if (owner === board.currentTurn) {
        board.selectCapturedFigure(figure);
        board.rookMoveDisplay.displayDropIn(figure);
        const movesToDisplay = board.cellsToMoveDisplay;
        displayAvailableMoves(movesToDisplay);
      }
    };

    return (
      <div
        className="figure"
        onClick={onRookClick}
        draggable
        onDragStart={onRookClick}
        onDragEnd={() => {
          board.selectedCell = null;
          clearMoves();
          board.clearCapturesDisplay();
        }}
      >
        <img src={`/images/figures/${rookImage}`} alt="Captured Rook" />
      </div>
    );
  } else {
    const onRookClick = () => {
      if (!cell) return;

      if (
        (board.currentTurn == "sente" && !cell.displayRotated) ||
        (board.currentTurn == "gote" && cell.displayRotated)
      ) {
        if (!cell.canCapture) {
          board.selectedCell = cell;
          board.rookMoveDisplay.displayMoves(cell);
          const movesToDisplay = board.cellsToMoveDisplay;
          displayAvailableMoves(movesToDisplay);
        }
      }
    };

    if (isPromoted) {
      rookImage = "rook_promotion.png";
    } else {
      rookImage = "rook.png";
    }

    return (
      <div
        className="figure"
        onClick={onRookClick}
        draggable
        onDragStart={onRookClick}
        onDragEnd={() => {
          board.selectedCell = null;
          clearMoves();
          board.clearCapturesDisplay();
        }}
      >
        <img src={`/images/figures/${rookImage}`} alt="Rook" />
      </div>
    );
  }
}

export default RookElement;
