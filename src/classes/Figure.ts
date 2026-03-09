import {Cell} from "./Cell.ts";
import Mediator from "./service/mediator/Mediator.ts";
import {Board} from "./Board.ts";
import FigureState from "./service/state/FigureState.ts";

abstract class Figure {
    public abstract readonly figureName: string;
    protected mediator: Mediator;
    protected figureCoordinates: {row: number, col: number};
    private state: FigureState;
    public isCaptured: boolean = false;
    public isChecked: boolean = false;

    constructor(mediator: Mediator, row: number, col: number, state: FigureState) {
        this.mediator = mediator;
        this.figureCoordinates = {row, col};
        this.state = state;
        this.setFigureState(state);
    }


    move(cell: Cell): void {
        const board = Board.instance;
        const row = this.figureCoordinates.row;
        const col = this.figureCoordinates.col;
        const startMoveCell = board.getCell(row, col)

        board.removeFigureFromCell(startMoveCell);
        board.displayFigureOrder(cell, this, startMoveCell.displayRotated);
        this.figureCoordinates.row = cell.coords.row;
        this.figureCoordinates.col = cell.coords.column;
    }

    abstract checkAvailableCells(): Cell[];

    abstract checkCaptures(cells: Cell[]): Cell[];

    requestForMove(cell: Cell) {
        this.mediator.getMoveOrder(this, cell);
    }

    commonCheck(cells: Cell[]): Cell[] {
        const board = Board.instance;

        board.coordinates.forEach((cellRow) => {
            cellRow.forEach((cell) => {
                if (!cell.isOccupied) {
                    cells.push(cell);
                }
            })
        })
        return cells;
    }


    getRow(): number {
        return this.figureCoordinates.row;
    }

    setRow(row: number) {
        this.figureCoordinates.row = row;
    }

    getCol(): number {
        return this.figureCoordinates.col;
    }

    setCaptured() {
        this.isCaptured = true;
    }

    setCol(col: number) {
        this.figureCoordinates.col = col;
    }

    public setFigureState(state: FigureState) {
        this.state = state;
        this.state.setFigure(this);
    }

    public getState(): FigureState {
        return this.state;
    }


    public getFigureMediator(): Mediator {
        return this.mediator;
    }
}

export default Figure;