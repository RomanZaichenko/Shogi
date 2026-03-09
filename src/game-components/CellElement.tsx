import "../styles/CellElement.css";
import { Board, useBoard } from "../classes/Board.ts";
import React, { useState, useEffect, useRef, createContext } from "react";
import KingElement from "./figures-elements/KingElement.tsx";
import PawnElement from "./figures-elements/PawnElement.tsx";
import GoldenGeneralElement from "./figures-elements/GoldenGeneralElement.tsx";
import SilverGeneralElement from "./figures-elements/SilverGeneralElement.tsx";
import HorseElement from "./figures-elements/HorseElement.tsx";
import SpearElement from "./figures-elements/SpearElement.tsx";
import ElephantElement from "./figures-elements/ElephantElement.tsx";
import RookElement from "./figures-elements/RookElement.tsx";
import ClickImplementation from "../classes/service/bridge/ClickImplementation.ts";
import DragImplementation from "../classes/service/bridge/DragImplementation.ts";
import DefaultState from "../classes/service/state/DefaultState.ts";

interface CellElementProps {
  row: number;
  col: number;
}

export const CanMoveToContext = createContext(false);

export const FigureComponents = {
  King: KingElement,
  GoldenGeneral: GoldenGeneralElement,
  SilverGeneral: SilverGeneralElement,
  Horse: HorseElement,
  Spear: SpearElement,
  Elephant: ElephantElement,
  Rook: RookElement,
  Pawn: PawnElement,
};

function CellElement({ row, col }: CellElementProps) {
  const { getBoardCell } = useBoard();
  const cell = getBoardCell(row, col);
  const [, setTick] = useState(0);

  const figureRef = useRef<HTMLDivElement>(null);
  const canMoveDot = useRef<HTMLDivElement>(null);

  const board = Board.instance;
  const clickImplementation = new ClickImplementation();
  const dragImplementation = new DragImplementation();

  let figureElement = null;

  const onCellClick = () => {
    if (cell.isOccupied && !cell.canCapture) {
      board.selectedCell = cell;
    } else if (cell.canMoveTo) {
      if (board.selectedCell || board.figureToDrop) {
        const figureToMove = board.selectedCell?.figureOn
          ? board.selectedCell.figureOn
          : board.figureToDrop;
        if (figureToMove) {
          board.mediator.setMoveImplementation(clickImplementation);

          if (cell.canCapture) {
            const capturedFigure = cell.figureOn;
            if (capturedFigure) {
              capturedFigure.setFigureState(new DefaultState());
              capturedFigure.setRow(-1);
              capturedFigure.setCol(-1);
              capturedFigure.setCaptured();

              if (board.currentTurn === "sente") {
                board.senteCapturedFigures.push(capturedFigure);
              } else {
                board.goteCapturedFigures.push(capturedFigure);
              }
            }
          }

          if (!cell.canCapture) {
            cell.displayRotated = board.currentTurn !== "sente";
          }

          board.moveFigure(cell);
          board.clearMoves();
          board.selectedCell = null;
        }
      }
    }
  };

  const onFigureDrop = () => {
    if (cell.canMoveTo) {
      const startingCell = board.selectedCell ? board.selectedCell : null;
      const figureToDrop = startingCell?.figureOn || board.figureToDrop;

      if (figureToDrop) {
        board.mediator.setMoveImplementation(dragImplementation);

        if (cell.canCapture) {
          const capturedFigure = cell.figureOn;
          if (capturedFigure) {
            capturedFigure.setFigureState(new DefaultState());
            capturedFigure.setRow(-1);
            capturedFigure.setCol(-1);
            capturedFigure.setCaptured();

            if (board.currentTurn === "sente") {
              board.senteCapturedFigures.push(capturedFigure);
            } else {
              board.goteCapturedFigures.push(capturedFigure);
            }
          }
        }
        board.moveFigure(cell);
        board.clearMoves();
        board.selectedCell = null;
      }
    } else {
      board.clearMoves();
    }
  };

  useEffect(() => {
    const listener = () => setTick((prev) => prev + 1);
    board.subscribe(listener);
    return () => board.unsubscribe(listener);
  }, [board]);

  const figureOn = cell.figureOn;

  if (cell.isOccupied && figureOn) {
    const name = figureOn.figureName;

    const FigureComponent = FigureComponents[
      name as keyof typeof FigureComponents
    ] as React.ElementType;

    if (!FigureComponent) {
      console.error(`Component for figure "${name}" not found!`);
      return <div className="cell error-cell"></div>;
    }

    figureElement = (
      <FigureComponent
        rotated={cell.displayRotated}
        row={row}
        col={col}
        isCaptured={false}
      />
    );

    return (
      <CanMoveToContext.Provider value={cell.canCapture}>
        <div
          className={cell.canCapture ? "cell-capture" : "cell"}
          onClick={onCellClick}
          onDrop={onFigureDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          <div
            className={cell.displayRotated ? "figure-rotated" : "figure"}
            ref={figureRef}
          >
            {figureElement}
          </div>
        </div>
      </CanMoveToContext.Provider>
    );
  } else if (cell.canMoveTo) {
    return (
      <CanMoveToContext.Provider value={cell.canMoveTo}>
        <div
          className="cell"
          onClick={onCellClick}
          onDrop={onFigureDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          <div className="cell-dot" ref={canMoveDot}></div>
        </div>
      </CanMoveToContext.Provider>
    );
  } else {
    return <div className="cell" onClick={onCellClick}></div>;
  }
}

export default CellElement;