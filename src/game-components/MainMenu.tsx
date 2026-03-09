import "../styles/MainMenu.css";
import MenuButton from "./MenuButton.tsx";
import { useEffect, useState, useRef } from "react";

interface MainMenuProps {
  setGameStage: (stage: "menu" | "game" | "gameOver" | "profile") => void;
}

function MainMenu({ setGameStage }: MainMenuProps) {
  const [hidden, setHidden] = useState(false);
  const menuElement = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (menuElement.current) {
      menuElement.current.id = hidden ? "menu-hidden" : "menu-visible";
    }
  }, [hidden]);

  return (
    <>
      <main id="menu" ref={menuElement}>
        <h1 id="menu-title">Shogi</h1>
        <MenuButton
          buttonName={"Play"}
          clickHandler={() => {
            setHidden(true);
            setGameStage("game");
          }}
        />
        <MenuButton
          buttonName={"Profile"}
          clickHandler={() => {
            setHidden(true);
            setGameStage("profile");
          }}
        />
        <MenuButton
          buttonName={"Rules"}
          clickHandler={() => {
            setHidden(true);
          }}
        />
        <MenuButton
          buttonName={"Settings"}
          clickHandler={() => {
            setHidden(true);
          }}
        />
      </main>
    </>
  );
}

export default MainMenu;
