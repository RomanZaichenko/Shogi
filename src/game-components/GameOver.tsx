import MenuButton from "./MenuButton.tsx";
import "../styles/MainMenu.css";
import { Board } from "../classes/Board.ts";

interface GameOverProps {
  setGameStage: (stage: "menu" | "game" | "gameOver") => void;
}

function GameOver({ setGameStage }: GameOverProps) {
  const board = Board.instance;
  const message: string = board.mediator.isWon ? "Sente Won!" : "Gote Won!";
  return (
    <main id="menu-visible">
      <h1 id="menu-title">Game Over</h1>
      <h2 id="menu-subtitle">{message}</h2>
      <MenuButton
        buttonName={"Back To Menu"}
        clickHandler={() => setGameStage("menu")}
      />
    </main>
  );
}

export default GameOver;
