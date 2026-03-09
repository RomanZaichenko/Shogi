import FigurePromotionDecorator from "./FigurePromotionDecorator.ts";
import { Cell } from "../../Cell.ts";
import { Board } from "../../Board.ts";

class GeneralPromotionDecorator extends FigurePromotionDecorator {
  public checkAvailableCells(): Cell[] {
    const board = Board.instance;
    const row = this.figureCoordinates.row;
    const col = this.figureCoordinates.col;

    const startCell = board.getCell(row, col);
    let cellToCheck: Cell;
    const availableCells: Cell[] = [];

    if (row - 1 >= 0) {
      for (let i = col - 1; i <= col + 1; i++) {
        if ((i == col - 1 && i < 0) || (i == col + 1 && i > 8)) {
          continue;
        }

        cellToCheck = board.getCell(row - 1, i);

        if (
          !cellToCheck.isOccupied ||
          cellToCheck.displayRotated != startCell.displayRotated
        ) {
          availableCells.push(cellToCheck);
        }
      }
    }

    for (let i = col - 1; i <= col + 1; i++) {
      if ((i == col - 1 && i < 0) || (i == col + 1 && i > 8)) {
        continue;
      }
      cellToCheck = board.getCell(row, i);

      if (
        !cellToCheck.isOccupied ||
        cellToCheck.displayRotated != startCell.displayRotated
      ) {
        availableCells.push(cellToCheck);
      }
    }

    if (row + 1 <= 8) {
      cellToCheck = board.getCell(row + 1, col);
      if (
        !cellToCheck.isOccupied ||
        cellToCheck.displayRotated != startCell.displayRotated
      ) {
        availableCells.push(cellToCheck);
      }
    }

    return availableCells;
  }

  public checkCaptures(cells: Cell[]): Cell[] {
    const board = Board.instance;
    const startCell = board.getCell(this.getRow(), this.getCol());
    const cellsToCapture: Cell[] = [];
    cells.forEach((cell: Cell) => {
      if (cell.displayRotated != startCell.displayRotated) {
        cellsToCapture.push(cell);
      }
    });

    return cellsToCapture;
  }

  public get figureName(): string {
    return this.figure.figureName;
  }
}

export default GeneralPromotionDecorator;
