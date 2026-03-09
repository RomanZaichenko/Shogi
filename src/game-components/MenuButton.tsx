import "../styles/MenuButton.css";
import * as React from "react";

interface MenuButtonProps {
  buttonName: string;
  clickHandler: () => void;
}

function MenuButton({ buttonName, clickHandler }: MenuButtonProps) {
  return (
    <button
      style={{ "--button-content": `"${buttonName}"` } as React.CSSProperties}
      className="menu-button"
      onClick={() => clickHandler()}
    ></button>
  );
}

export default MenuButton;
