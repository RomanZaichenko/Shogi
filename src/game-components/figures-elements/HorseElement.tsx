import { Board, useBoard } from "../../classes/Board.ts";
import { useEffect, useState } from "react";
import Figure from "../../classes/Figure.ts";

interface HorseElementProps {
  row: number;
  col: number;
  isCaptured: boolean;
  figure: Figure;
  owner: string;
}

function HorseElement({
  row,
  col,
  isCaptured,
  figure,
  owner,
}: HorseElementProps) {
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

  let horseImage: string;

  if (isCaptured) {
    horseImage = "horse.png";
    const onHorseClick = () => {
      if (owner === board.currentTurn) {
        board.selectCapturedFigure(figure);
        board.horseMoveDisplay.displayDropIn(figure);
        const movesToDisplay = board.cellsToMoveDisplay;
        displayAvailableMoves(movesToDisplay);
      }
    };

    return (
      <div
        className="figure"
        onClick={onHorseClick}
        draggable
        onDragStart={onHorseClick}
        onDragEnd={() => {
          board.selectedCell = null;
          clearMoves();
          board.clearCapturesDisplay();
        }}
      >
        <img src={`/images/figures/${horseImage}`} alt="" />
      </div>
    );
  } else {
    const onHorseClick = () => {
      if (!cell) return;

      if (
        (board.currentTurn == "sente" && !cell.displayRotated) ||
        (board.currentTurn == "gote" && cell.displayRotated)
      ) {
        if (!cell.canCapture) {
          board.selectedCell = cell;
          board.horseMoveDisplay.displayMoves(cell);
          const movesToDisplay = board.cellsToMoveDisplay;
          displayAvailableMoves(movesToDisplay);
        }
      }
    };

    if (isPromoted) {
      horseImage = "horse_promotion.png";
    } else {
      horseImage = "horse.png";
    }

    return (
      <div
        className="figure"
        onClick={onHorseClick}
        draggable
        onDragStart={onHorseClick}
        onDragEnd={() => {
          board.selectedCell = null;
          clearMoves();
          board.clearCapturesDisplay();
        }}
      >
        <img src={`/images/figures/${horseImage}`} alt="" />
      </div>
    );
  }
}

export default HorseElement;
