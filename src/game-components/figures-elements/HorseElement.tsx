import {Board, useBoard} from "../../classes/Board.ts";
import {useEffect, useState} from "react";
import Figure from "../../classes/Figure.ts";

interface HorseElementProps {
  row: number;
  col: number;
  isCaptured: boolean;
  figure: Figure;
  owner: string;
}

function HorseElement({ row, col, isCaptured, figure, owner }: HorseElementProps) {
  const {getBoardCell, displayAvailableMoves, clearMoves} = useBoard();
  const board = Board.instance;
  let horseImage : string;

  if(isCaptured) {
    horseImage = "horse.png";
    const onHorseClick = () => {

      if (owner === board.currentTurn) {
        board.selectCapturedFigure(figure);
        board.horseMoveDisplay.displayDropIn(figure);
        const movesToDisplay = board.cellsToMoveDisplay; //change
        displayAvailableMoves(movesToDisplay);
      }
    }
    return (<div className="figure" onClick={onHorseClick}
                 draggable
                 onDragStart={onHorseClick}
                 onDragEnd={() => {
                   board.selectedCell = null;
                   clearMoves();
                   board.clearCapturesDisplay();
                 }}>

      <img src={`src/images/figures/${horseImage}`} alt=""/>
    </div>)
  }
  else {
    const cell = getBoardCell(row, col);
    const [tick, setTick] = useState(0);

    const onHorseClick = () => {
      if ((board.currentTurn == "sente" && !cell.displayRotated) ||
        (board.currentTurn == "gote" && cell.displayRotated)) {

        if (!cell.canCapture) {
          board.selectedCell = cell;
          board.horseMoveDisplay.displayMoves(cell);
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
      horseImage = "horse_promotion.png";
    }
    else {
      horseImage = "horse.png";
    }
    return (
      <div className="figure" onClick={onHorseClick}
           draggable
           onDragStart={onHorseClick}
           onDragEnd={() => {
             board.selectedCell = null;
             clearMoves();
             board.clearCapturesDisplay();
           }}>
        <img src={`src/images/figures/${horseImage}`} alt=""/>
      </div>
    )
  }
}

export default HorseElement;