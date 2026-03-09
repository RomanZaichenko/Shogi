import Mediator from "../service/mediator/Mediator.ts";
import {Cell} from "../Cell.ts";
import {Board} from "../Board.ts";
import Figure from "../Figure.ts";
import FigureState from "../service/state/FigureState.ts";
import PromotionState from "../service/state/PromotionState.ts";
import GeneralPromotionDecorator from "../service/decorator/GeneralPromotionDecorator.ts";


class Spear extends Figure{
    public readonly figureName: string = "Spear";
    constructor(mediator: Mediator, row: number, col: number, state: FigureState) {
        super(mediator, row, col, state);
    }

    move(cell: Cell) {
        super.move(cell);

        if(this.checkPromotion()) {
            cell.figureOn  = new GeneralPromotionDecorator(
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

            let row = this.figureCoordinates.row;
            const col = this.figureCoordinates.col;

            const startCell = board.getCell(row, col);
            let cellToCheck: Cell;

            if (board.currentTurn == "sente") {
                if (row - 1 >= 0) {
                    do {
                        cellToCheck = board.getCell(row - 1, col);
                        if (!cellToCheck.isOccupied ||
                          (cellToCheck.displayRotated != startCell.displayRotated)) {
                            availableCells.push(cellToCheck);

                            if (cellToCheck.isOccupied) {
                                break;
                            }
                        } else {
                            break;
                        }

                        row--;
                    }
                    while (!cellToCheck.isOccupied && row-1 >= 0);
                }
            }
            else {
                if (row + 1 <= 8) {
                    do {
                        cellToCheck = board.getCell(row + 1, col);
                        if (!cellToCheck.isOccupied ||
                          (cellToCheck.displayRotated != startCell.displayRotated)) {
                            availableCells.push(cellToCheck);

                            if (cellToCheck.isOccupied) {
                                break;
                            }
                        } else {
                            break;
                        }

                        row++;
                    }
                    while (!cellToCheck.isOccupied && row+1 <= 8);
                }
            }

            return availableCells;
        }
    }

    checkPromotion() :boolean{
        const currentTurn = Board.instance.currentTurn;

        if (currentTurn == "sente") {
            if (this.figureCoordinates.row == 0) {
                return true;
            }
            if (this.figureCoordinates.row == 1 || this.figureCoordinates.row == 2 ) {
                const answer = confirm("Do you want to promote this spear?");

                if (answer) {
                    return true;
                }
            }
        }
        else {
            if (this.figureCoordinates.row == 8) {
                return true;
            }
            if (this.figureCoordinates.row == 6 || this.figureCoordinates.row == 7 ) {
                const answer = confirm("Do you want to promote this spear?");

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

export default Spear;