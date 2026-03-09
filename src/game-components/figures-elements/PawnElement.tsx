import { useEffect, useState } from "react"; // Прибрано зайвий createContext
import { Board, useBoard } from "../../classes/Board.ts";
import Figure from "../../classes/Figure.ts";

interface PawnElementProps {
  row: number;
  col: number;
  isCaptured: boolean;
  figure: Figure;
  owner: string;
}

function PawnElement({
  row,
  col,
  isCaptured,
  figure,
  owner,
}: PawnElementProps) {
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

  let pawnImage: string;

  if (isCaptured) {
    pawnImage = "pawn.png";
    const onPawnClick = () => {
      if (owner === board.currentTurn) {
        board.selectCapturedFigure(figure);
        board.pawnMoveDisplay.displayDropIn(figure);
        const movesToDisplay = board.cellsToMoveDisplay;
        displayAvailableMoves(movesToDisplay);
      }
    };

    return (
      <div
        className="figure"
        onClick={onPawnClick}
        draggable
        onDragStart={onPawnClick}
        onDragEnd={() => {
          board.selectedCell = null;
          clearMoves();
          board.clearCapturesDisplay();
        }}
      >
        <img src={`/images/figures/${pawnImage}`} alt="Captured Pawn" />
      </div>
    );
  } else {
    const onPawnClick = () => {
      if (!cell) return;

      if (
        (board.currentTurn == "sente" && !cell.displayRotated) ||
        (board.currentTurn == "gote" && cell.displayRotated)
      ) {
        if (!cell.canCapture) {
          board.selectedCell = cell;
          board.pawnMoveDisplay.displayMoves(cell);
          const movesToDisplay = board.cellsToMoveDisplay;
          displayAvailableMoves(movesToDisplay);
        }
      }
    };

    if (isPromoted) {
      pawnImage = "pawn_promotion.png";
    } else {
      pawnImage = "pawn.png";
    }

    return (
      <div
        className="figure"
        onClick={onPawnClick}
        draggable
        onDragStart={onPawnClick}
        onDragEnd={() => {
          board.selectedCell = null;
          clearMoves();
          board.clearCapturesDisplay();
        }}
      >
        <img src={`/images/figures/${pawnImage}`} alt="Pawn" />
      </div>
    );
  }
}

export default PawnElement;
