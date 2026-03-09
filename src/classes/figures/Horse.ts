import Mediator from "../service/mediator/Mediator.ts";
import {Cell} from "../Cell.ts";
import {Board} from "../Board.ts";
import Figure from "../Figure.ts";
import FigureState from "../service/state/FigureState.ts";
import PromotionState from "../service/state/PromotionState.ts";
import GeneralPromotionDecorator from "../service/decorator/GeneralPromotionDecorator.ts";

class Horse extends Figure{
    public readonly figureName: string = "Horse";
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
            const row = this.figureCoordinates.row;
            const col = this.figureCoordinates.col;

            const startCell = board.getCell(row, col);
            let cellToCheck: Cell;

            if (board.currentTurn == "sente") {
                if (row - 2 >= 0) {
                    if (col - 1 >= 0) {
                        cellToCheck = board.getCell(row - 2, col - 1);

                        if (!cellToCheck.isOccupied ||
                          (cellToCheck.displayRotated != startCell.displayRotated)) {
                            availableCells.push(cellToCheck);
                        }
                    }

                    if (col + 1 <= 8) {
                        cellToCheck = board.getCell(row - 2, col + 1);
                        if (!cellToCheck.isOccupied ||
                          (cellToCheck.displayRotated != startCell.displayRotated)) {
                            availableCells.push(cellToCheck);
                        }
                    }

                }
            }
            else {
                if (row + 2 <= 8) {
                    if (col - 1 >= 0) {
                        cellToCheck = board.getCell(row + 2, col - 1);

                        if (!cellToCheck.isOccupied ||
                          (cellToCheck.displayRotated != startCell.displayRotated)) {
                            availableCells.push(cellToCheck);
                        }
                    }

                    if (col + 1 <= 8) {
                        cellToCheck = board.getCell(row + 2, col + 1);
                        if (!cellToCheck.isOccupied ||
                          (cellToCheck.displayRotated != startCell.displayRotated)) {
                            availableCells.push(cellToCheck);
                        }
                    }

                }
            }

            return availableCells;
        }
    }

    checkPromotion() :boolean {
        const currentTurn = Board.instance.currentTurn;

        if (currentTurn == "sente") {
            if (this.figureCoordinates.row == 1 || this.figureCoordinates.row == 0) {
                return true;
            }
            if (this.figureCoordinates.row == 2 ) {
                const answer = confirm("Do you want to promote this horse?");

                if (answer) {
                    return true;
                }
            }
        }
        else {
            if (this.figureCoordinates.row == 7 || this.figureCoordinates.row == 8) {
                return true;
            }
            if (this.figureCoordinates.row == 6 ) {
                const answer = confirm("Do you want to promote this horse?");

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

export default Horse;