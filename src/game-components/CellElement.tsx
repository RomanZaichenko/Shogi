import "../styles/CellElement.css";
import { Board, useBoard } from "../classes/Board.ts";
import React, { useState, useEffect, useRef, createContext } from "react"; // Видалено useContext
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
import GeneralPromotionDecorator from "../classes/service/decorator/GeneralPromotionDecorator.ts";
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
            if (board.currentTurn == "sente") {
              const figure = cell.figureOn; // Змінено let на const

              figure?.setFigureState(new DefaultState());
              figure?.setRow(-1);
              figure?.setCol(-1);
              figure?.setCaptured();

              if (cell.isOccupied && figure) {
                board.senteCapturedFigures.push(figure);
              }
              console.log("Sente pushed");
              console.log(board.senteCapturedFigures);
            } else {
              const figure = cell.figureOn;

              figure?.setFigureState(new DefaultState());
              figure?.setRow(-1);
              figure?.setCol(-1);
              figure?.setCaptured();

              if (cell.isOccupied && figure) {
                board.goteCapturedFigures.push(figure);
              }
              console.log("Gote pushed");
              console.log(board.goteCapturedFigures);
            }
          }

          if (!cell.canCapture) {
            if (board.currentTurn == "sente") {
              cell.displayRotated = false;
            } else {
              cell.displayRotated = true;
            }
          }

          board.moveFigure(cell);
          board.clearMoves();
          board.selectedCell = null;
        }
      }
    }
  };

  const onFigureDrop = () => {
    console.log(cell.canMoveTo);
    if (cell.canMoveTo) {
      const startingCell = board.selectedCell ? board.selectedCell : null;
      if (startingCell || board.figureToDrop) {
        const figureToDrop = startingCell?.figureOn || board.figureToDrop;

        if (figureToDrop) {
          board.mediator.setMoveImplementation(dragImplementation);

          if (cell.canCapture) {
            if (board.currentTurn == "sente") {
              const figure = cell.figureOn;

              figure?.setFigureState(new DefaultState());
              figure?.setRow(-1);
              figure?.setCol(-1);
              figure?.setCaptured();
              if (cell.isOccupied && figure) {
                board.senteCapturedFigures.push(figure);
              }
              console.log("Sente pushed");
              console.log(board.senteCapturedFigures);
            } else {
              const figure = cell.figureOn;

              figure?.setFigureState(new DefaultState());
              figure?.setRow(-1);
              figure?.setCol(-1);
              figure?.setCaptured();
              if (cell.isOccupied && figure) {
                board.goteCapturedFigures.push(figure);
              }
              console.log("Just pushed");
              console.log(board.goteCapturedFigures);
            }
          }
          board.moveFigure(cell);
          board.clearMoves();
          board.selectedCell = null;
        }
      }
    } else {
      board.clearMoves();
    }
  };

  useEffect(() => {
    const listener = () => {
      setTick((prevTick) => prevTick + 1);
    };

    board.subscribe(listener);

    return () => {
      board.unsubscribe(listener);
    };
  }, [board, row, col]);

  const figureOn = cell.figureOn;

  if (cell.isOccupied && figureOn) {
    let name = figureOn.constructor.name;

    if (figureOn.constructor.name === "GeneralPromotionDecorator") {
      const decorateCell = figureOn as GeneralPromotionDecorator;

      // @ts-expect-error: Доступ до захищеної властивості
      const figureName = decorateCell.figure.constructor.name;

      switch (figureName) {
        case "Pawn":
          name = "Pawn";
          break;
        case "Horse":
          name = "Horse";
          break;
        case "SilverGeneral":
          name = "SilverGeneral";
          break;
        case "Spear":
          name = "Spear";
          break;
      }
    } else if (figureOn.constructor.name === "ElephantPromotionDecorator") {
      name = "Elephant";
    } else if (figureOn.constructor.name === "RookPromotionDecorator") {
      name = "Rook";
    }

    const FigureComponent = FigureComponents[
      name as keyof typeof FigureComponents
    ] as React.ElementType;
    figureElement = (
      <FigureComponent
        rotated={cell.displayRotated}
        row={row}
        col={col}
        isCaptured={false}
      />
    );

    if (cell.canCapture) {
      return (
        <CanMoveToContext.Provider value={cell.canCapture}>
          <div
            className="cell-capture"
            onClick={onCellClick}
            onDrop={onFigureDrop}
            onDragOver={(event) => event.preventDefault()}
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
    } else {
      return (
        <div className="cell" onClick={onCellClick} onDrop={onFigureDrop}>
          <div
            className={cell.displayRotated ? "figure-rotated" : "figure"}
            ref={figureRef}
          >
            {figureElement}
          </div>
        </div>
      );
    }
  } else if (cell.canMoveTo) {
    return (
      <CanMoveToContext.Provider value={cell.canMoveTo}>
        <div
          className="cell"
          onClick={onCellClick}
          onDrop={onFigureDrop}
          onDragOver={(event) => event.preventDefault()}
        >
          <div className={"cell-dot"} ref={canMoveDot}></div>
        </div>
      </CanMoveToContext.Provider>
    );
  } else {
    return <div className="cell" onClick={onCellClick}></div>;
  }
}

export default CellElement;
