import "../styles/GameArea.css";
import BoardElement from "./BoardElement.tsx";
import CapturedFiguresArea from "./CapturedFiguresArea.tsx";

interface GameAreaProps {
  setGameStage: (stage: "menu" | "game" | "gameOver") => void;
}

function GameArea({ setGameStage }: GameAreaProps) {
  return (
    <main id="game-area">
      <CapturedFiguresArea
        side="left"
        owner="gote"
        setGameStage={setGameStage}
      />
      <BoardElement />
      <CapturedFiguresArea
        side="right"
        owner="sente"
        setGameStage={setGameStage}
      />
      <button onClick={() => setGameStage("gameOver")}>
        End Game (simulate)
      </button>
    </main>
  );
}

export default GameArea;
