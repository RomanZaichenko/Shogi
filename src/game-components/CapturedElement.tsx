import Figure from "../classes/Figure.ts";
import GeneralPromotionDecorator from "../classes/service/decorator/GeneralPromotionDecorator.ts";
import PawnCreator from "../classes/service/abstractFactory/PawnCreator.ts";
import HorseCreator from "../classes/service/abstractFactory/HorseCreator.ts";
import SilverGeneralCreator from "../classes/service/abstractFactory/SilverGeneralCreator.ts";
import SpearCreator from "../classes/service/abstractFactory/SpearCreator.ts";
import ElephantCreator from "../classes/service/abstractFactory/ElephantCreator.ts";
import RookCreator from "../classes/service/abstractFactory/RookCreator.ts";
import DefaultState from "../classes/service/state/DefaultState.ts";
import { FigureComponents } from "./CellElement.tsx";
import React from "react";

interface CapturedElementProps {
  figure: Figure;
  owner: string;
  setGameStage: (stage: "menu" | "game" | "gameOver") => void;
}

function CapturedElement({
  figure,
  owner,
  setGameStage,
}: CapturedElementProps) {
  const pawnCreator = new PawnCreator();
  const horseCreator = new HorseCreator();
  const silverGeneralCreator = new SilverGeneralCreator();
  const spearCreator = new SpearCreator();
  const elephantCreator = new ElephantCreator();
  const rookCreator = new RookCreator();

  if (!figure) {
    return null;
  }

  // @ts-expect-error: Навмисний доступ до protected властивості для фабрики
  const mediator = figure.mediator;

  const row = figure?.getRow();
  const col = figure?.getCol();

  let name = figure?.constructor.name;

  if (name === "GeneralPromotionDecorator") {
    const decorateCell = figure as GeneralPromotionDecorator;

    const figureName = decorateCell.figure.constructor.name;

    switch (figureName) {
      case "Pawn":
        name = "Pawn";
        figure = pawnCreator.createFigure(
          mediator,
          row,
          col,
          new DefaultState(),
        );
        break;
      case "Horse":
        name = "Horse";
        figure = horseCreator.createFigure(
          mediator,
          row,
          col,
          new DefaultState(),
        );
        break;
      case "SilverGeneral":
        name = "SilverGeneral";
        figure = silverGeneralCreator.createFigure(
          mediator,
          row,
          col,
          new DefaultState(),
        );
        break;
      case "Spear":
        name = "Spear";
        figure = spearCreator.createFigure(
          mediator,
          row,
          col,
          new DefaultState(),
        );
        break;
    }
  } else if (name === "ElephantPromotionDecorator") {
    name = "Elephant";
    figure = elephantCreator.createFigure(
      mediator,
      row,
      col,
      new DefaultState(),
    );
  } else if (name === "RookPromotionDecorator") {
    name = "Rook";
    figure = rookCreator.createFigure(mediator, row, col, new DefaultState());
  }

  const FigureComponent = FigureComponents[
    name as keyof typeof FigureComponents
  ] as React.ElementType;

  if (!FigureComponent) {
    return null;
  }

  return (
    <div className="captured-figure">
      <FigureComponent
        row={row}
        col={col}
        isCaptured={true}
        figure={figure}
        owner={owner}
        setGameStage={setGameStage}
      />
    </div>
  );
}

export default CapturedElement;
