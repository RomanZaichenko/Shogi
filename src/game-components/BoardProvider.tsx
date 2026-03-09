import React, { useState } from "react";
import { Board, BoardContext } from "../classes/Board.ts";
import { Cell } from "../classes/Cell.ts";

interface BoardProviderProps {
  children: React.ReactNode;
}

const BoardProvider: React.FC<BoardProviderProps> = ({ children }) => {
  const [board] = useState(Board.instance);

  const getBoardCell = (row: number, col: number) => {
    return board.getCell(row, col);
  };

  const displayAvailableMoves = (availableMoves: Cell[]) => {
    board.displayAvailableMoves(availableMoves);
  };

  const clearMoves = () => {
    board.clearMoves();
  };

  return (
    <BoardContext.Provider
      value={{ board, getBoardCell, displayAvailableMoves, clearMoves }}
    >
      {children}
    </BoardContext.Provider>
  );
};

export default BoardProvider;
