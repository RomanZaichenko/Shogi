import CellElement from "./CellElement.tsx";
import { Cell } from "../classes/Cell.ts";
import "../styles/CellRow.css";

interface CellRowProps {
  row: number;
  coordinates: Cell[][];
}

function CellRow({ row, coordinates }: CellRowProps) {
  return (
    <>
      <div className="row-container">
        <div className="cell-row">
          {coordinates[row].map((_, col) => (
            <CellElement key={`${row}-${col}`} row={row} col={col} />
          ))}
        </div>
        <p className="row-number">{row + 1}</p>
      </div>
    </>
  );
}

export default CellRow;
