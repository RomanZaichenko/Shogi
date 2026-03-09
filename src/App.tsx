import "./styles/App.css";
import MainMenu from "./game-components/MainMenu.tsx";
import GameArea from "./game-components/GameArea.tsx";
import GameOver from "./game-components/GameOver.tsx";
import { useState } from "react";
import BoardProvider from "./game-components/BoardProvider.tsx";
import Profile from "./game-components/Profile.tsx";

function App() {
  const [gameStage, setGameStage] = useState<
    "menu" | "game" | "gameOver" | "profile"
  >("menu");

  return (
    <BoardProvider>
      {gameStage === "menu" && <MainMenu setGameStage={setGameStage} />}
      {gameStage === "game" && <GameArea setGameStage={setGameStage} />}
      {gameStage === "gameOver" && <GameOver setGameStage={setGameStage} />}
      {gameStage === "profile" && <Profile setGameStage={setGameStage} />}
    </BoardProvider>
  );
}

export default App;
