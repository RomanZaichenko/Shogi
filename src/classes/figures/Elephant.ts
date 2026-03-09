import Mediator from "../service/mediator/Mediator.ts";
import {Cell} from "../Cell.ts";
import {Board} from "../Board.ts";
import Figure from "../Figure.ts";
import FigureState from "../service/state/FigureState.ts";
import PromotionState from "../service/state/PromotionState.ts";
import ElephantPromotionDecorator from "../service/decorator/ElephantPromotionDecorator.ts";


class Elephant extends Figure {
    public readonly figureName: string = "Elephant";
    constructor(mediator: Mediator, row: number, col: number, state: FigureState) {
        super(mediator, row, col, state);
    }

    move(cell: Cell) {
        super.move(cell);

        if(this.checkPromotion()) {
            cell.figureOn  = new ElephantPromotionDecorator(
              this.mediator,
              this.figureCoordinates.row,
              this.figureCoordinates.col,
              new PromotionState(),
              this
            );
        }

    }

    public checkAvailableCells(){
        const availableCells: Cell[] = [];
        if (this.isCaptured){
            return super.commonCheck(availableCells);
        }
        else {
            const board = Board.instance;
            const row = this.figureCoordinates.row;
            const col = this.figureCoordinates.col;

            const startCell = board.getCell(row, col);
            let cellToCheck: Cell;


            if (row - 1 >= 0 && col - 1 >= 0) {
                let rowCount = row;
                let colCount = col;
                do {
                    cellToCheck = board.getCell(rowCount-1, colCount-1);

                    if(!cellToCheck.isOccupied ||
                      (cellToCheck.displayRotated != startCell.displayRotated)) {
                        availableCells.push(cellToCheck);
                        if (cellToCheck.isOccupied) {
                            break;
                        }
                    }
                    else {
                        break;
                    }
                    rowCount--;
                    colCount--;
                }
                while (rowCount - 1 >= 0 && colCount - 1 >= 0);
            }

            if (row - 1 >= 0 && col + 1 <= 8) {
                let rowCount = row;
                let colCount = col;
                do {
                    cellToCheck = board.getCell(rowCount-1, colCount+1);
                    if((cellToCheck.displayRotated != startCell.displayRotated) ||
                      !cellToCheck.isOccupied ) {
                        availableCells.push(cellToCheck);

                        if (cellToCheck.isOccupied) {
                            break;
                        }
                    }
                    else{
                        break;
                    }
                    rowCount--;
                    colCount++;
                }
                while ((rowCount - 1 >= 0 && colCount + 1 <= 8));
            }

            if (row + 1 <= 8 && col - 1 >= 0) {
                let rowCount = row;
                let colCount = col;
                do {
                    cellToCheck = board.getCell(rowCount+1, colCount-1);
                    if((cellToCheck.displayRotated != startCell.displayRotated) ||
                      !cellToCheck.isOccupied ) {
                        availableCells.push(cellToCheck);

                        if (cellToCheck.isOccupied) {
                            break;
                        }
                    }
                    else {
                        break;
                    }
                    rowCount++;
                    colCount--;
                }
                while ((rowCount + 1 <= 8 && colCount - 1 >= 0));
            }

            if (row + 1 <= 8 && col + 1 <= 8) {
                let rowCount = row;
                let colCount = col;
                do {
                    cellToCheck = board.getCell(rowCount+1, colCount+1);
                    if((cellToCheck.displayRotated != startCell.displayRotated) ||
                      !cellToCheck.isOccupied ) {
                        availableCells.push(cellToCheck);

                        if (cellToCheck.isOccupied) {
                            break;
                        }
                    }
                    else {
                        break;
                    }
                    rowCount++;
                    colCount++;
                }
                while ((rowCount + 1 <= 8 && colCount + 1 <= 8));
            }

            return availableCells;
        }
    }

    checkPromotion(): boolean {
        if (this.getState().checkPromotion()){
            return false;
        }
        const currentTurn = Board.instance.currentTurn;

        if (currentTurn == "sente") {
            if (this.figureCoordinates.row <= 2) {
                const answer = confirm("Do you want to promote this elephant?");

                if (answer) {
                    return true;
                }
            }
        }
        else {
            if (this.figureCoordinates.row >= 6) {
                const answer = confirm("Do you want to promote this elephant?");

                if (answer) {
                    return true;
                }
            }
        }
        return false;
    }

    public checkCaptures(cells: Cell[]) :Cell[] {
        const board = Board.instance;
        const startCell = board.getCell(this.getRow(), this.getCol());
        const cellsToCapture :Cell[] = [];
        cells.forEach((cell: Cell) => {
            if(cell.displayRotated != startCell.displayRotated){
                cellsToCapture.push(cell);
            }
        })



        return cellsToCapture;
    }
}

export default Elephant;