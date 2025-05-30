import {useEffect, useState} from "react";
import {Board, useBoard} from "../../classes/Board.ts";

import Figure from "../../classes/Figure.ts";

interface RookElementProps {
  row: number;
  col: number;
  isCaptured: boolean;
  figure: Figure;
  owner: string;
}

function RookElement({row, col, isCaptured, figure, owner}: RookElementProps) {
  const {getBoardCell, displayAvailableMoves, clearMoves} = useBoard();
  const board = Board.instance;
  let rookImage: string;

  if (isCaptured) {
    rookImage = "rook.png";
    const onRookClick = () => {
      if (owner === board.currentTurn) {
        board.selectCapturedFigure(figure);
        board.rookMoveDisplay.displayDropIn(figure);
        const movesToDisplay = board.cellsToMoveDisplay; //change
        displayAvailableMoves(movesToDisplay);
      }
    }
    return (<div className="figure" onClick={onRookClick}
                 draggable
                 onDragStart={onRookClick}
                 onDragEnd={() => {
                   board.selectedCell = null;
                   clearMoves();
                   board.clearCapturesDisplay();
                 }}>

      <img src={`src/images/figures/${rookImage}`} alt=""/>
    </div>)  }
  else {
    const cell = getBoardCell(row, col);
    const [tick, setTick] = useState(0);

    const onRookClick = () => {
      if ((board.currentTurn == "sente" && !cell.displayRotated) ||
        (board.currentTurn == "gote" && cell.displayRotated)) {

        if (!cell.canCapture){
          board.selectedCell = cell;
          board.rookMoveDisplay.displayMoves(cell);
          const movesToDisplay = board.cellsToMoveDisplay;
          displayAvailableMoves(movesToDisplay);
        }
      }
    }

    useEffect(() => {

    }, [cell]);

    useEffect(() => {
      const listener = () => {
        setTick(prevTick => prevTick+1);
      };

      board.subscribe(listener);

      return () => {
        board.unsubscribe(listener);
      }
    }, [board]);

    const [isPromoted, setIsPromoted] = useState(false);

    useEffect(() => {
      if (cell.figureOn?.getState().checkPromotion() != undefined) {
        setIsPromoted(cell.figureOn?.getState().checkPromotion())
      }
    }, [isPromoted]);


    if (isPromoted) {
      rookImage = "rook_promotion.png";
    }
    else {
      rookImage = "rook.png";
    }

    return (
      <div className="figure" onClick={onRookClick}
           draggable
           onDragStart={onRookClick}
           onDragEnd={() => {
             board.selectedCell = null;
             clearMoves();
             board.clearCapturesDisplay();
           }}>
        <img src={`src/images/figures/${rookImage}`} alt=""/>
      </div>
    )
  }
}

export default RookElement;