import Mediator from "./Mediator.ts";
import Figure from "../../Figure.ts";
import { Cell } from "../../Cell.ts";
import King from "../../figures/King.ts";
import MoveImplementation from "../bridge/MoveImplementation.ts";
import { Board } from "../../Board.ts";
import SaveStatsCommand from "../command/SaveStatsCommand.ts";

class MoveMediator implements Mediator {
  public isWon: boolean = false;
  protected moveImplementation: MoveImplementation | undefined;

  setMoveImplementation(moveImpl: MoveImplementation): void {
    this.moveImplementation = moveImpl;
  }

  canMoveTo(figure: Figure, cell: Cell): boolean {
    const availableCells = figure.checkAvailableCells();
    return availableCells.includes(cell);
  }

  isKingChecked(king: King): boolean {
    const board = Board.instance;
    const kingRow = king.getRow();
    const kingCol = king.getCol();
    const kingCell = board.getCell(kingRow, kingCol);

    for (const row of board.coordinates) {
      for (const cell of row) {
        if (!cell.isOccupied) continue;

        const figure = cell.figureOn;
        if (!figure) continue;

        if (cell.displayRotated === kingCell.displayRotated) continue;

        const availableCells = figure.checkAvailableCells();
        const captures = figure.checkCaptures(availableCells);

        if (
          captures &&
          captures.some((capturedCell) => capturedCell === kingCell)
        ) {
          return true;
        }
      }
    }

    return false;
  }

  isGameOver(): boolean {
    const board = Board.instance;

    if (board.goteKing?.isCaptured) {
      this.isWon = true;
      board.winsCounter++;
      board.statsInvoker.setCommand(
        new SaveStatsCommand(board.winsCounter, board.losesCounter),
      );
      board.statsInvoker.executeStorageOperation();
      return true;
    }
    if (board.senteKing?.isCaptured) {
      this.isWon = false;
      board.losesCounter++;
      board.statsInvoker.setCommand(
        new SaveStatsCommand(board.winsCounter, board.losesCounter),
      );
      board.statsInvoker.executeStorageOperation();
      return true;
    }

    return false;
  }

  gameOver(isWon: boolean) {
    if (isWon) {
      console.log("You won!");
    } else {
      console.log("You lost!");
    }

    Board.instance.isPlaying = false;
  }

  getMoveOrder(figure: Figure, cell: Cell) {
    const board = Board.instance;

    if (this.canMoveTo(figure, cell)) {
      this?.moveImplementation?.executeMove(figure, cell);

      if (this.isGameOver()) {
        this.gameOver(this.isWon);
      } else {
        if (board.goteKing && this.isKingChecked(board.goteKing)) {
          board.goteKing.isChecked = true;
        }
        if (board.senteKing && this.isKingChecked(board.senteKing)) {
          board.senteKing.isChecked = true;
        }
      }
    }
  }
}

export default MoveMediator;
