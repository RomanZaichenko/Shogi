import { Board, useBoard } from "../../classes/Board.ts";
import { useEffect, useState } from "react";
import Figure from "../../classes/Figure.ts";

interface SilverGeneralElementProps {
  row: number;
  col: number;
  isCaptured: boolean;
  figure: Figure;
  owner: string;
}

function SilverGeneralElement({
  row,
  col,
  isCaptured,
  figure,
  owner,
}: SilverGeneralElementProps) {
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

  let silverGeneralImage: string;

  if (isCaptured) {
    silverGeneralImage = "silver_general.png";
    const onSilverGeneralClick = () => {
      if (owner == board.currentTurn) {
        board.selectCapturedFigure(figure);
        board.silverGeneralMoveDisplay.displayDropIn(figure);
        const movesToDisplay = board.cellsToMoveDisplay;
        displayAvailableMoves(movesToDisplay);
      }
    };

    return (
      <div
        className="figure"
        onClick={onSilverGeneralClick}
        draggable
        onDragStart={onSilverGeneralClick}
        onDragEnd={() => {
          board.selectedCell = null;
          clearMoves();
          board.clearCapturesDisplay();
        }}
      >
        <img
          src={`/images/figures/${silverGeneralImage}`}
          alt="Captured Silver General"
        />
      </div>
    );
  } else {
    const onSilverGeneralClick = () => {
      if (!cell) return;

      if (
        (board.currentTurn == "sente" && !cell.displayRotated) ||
        (board.currentTurn == "gote" && cell.displayRotated)
      ) {
        if (!cell.canCapture) {
          board.selectedCell = cell;
          board.silverGeneralMoveDisplay.displayMoves(cell);
          const movesToDisplay = board.cellsToMoveDisplay;
          displayAvailableMoves(movesToDisplay);
        }
      }
    };

    if (isPromoted) {
      silverGeneralImage = "silver_general-promotion.png";
    } else {
      silverGeneralImage = "silver_general.png";
    }

    return (
      <div
        className="figure"
        onClick={onSilverGeneralClick}
        draggable
        onDragStart={onSilverGeneralClick}
        onDragEnd={() => {
          board.selectedCell = null;
          clearMoves();
          board.clearCapturesDisplay();
        }}
      >
        <img
          src={`/images/figures/${silverGeneralImage}`}
          alt="Silver General"
        />
      </div>
    );
  }
}

export default SilverGeneralElement;
