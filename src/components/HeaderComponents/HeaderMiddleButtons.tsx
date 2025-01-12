import React from "react";
import { NavLink } from "react-router-dom";
import "../../styles/HeaderStyles/HeaderMiddleButtonStyles.css";

const BUTTONS = ["Play", "Settings", "Help"];
const BUTTONS_DEV = ["High Scores", "Dev Menu"];

const DEV =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1";

export const HeaderMidButtonsContainer: React.FC = () => {
  if (DEV && !BUTTONS.includes(BUTTONS_DEV[0])) {
    BUTTONS_DEV.forEach((button: string) => {
      BUTTONS.push(button);
    });
  }
  return (
    <div id="header-middle-buttons-container">
      {BUTTONS.map((button) => (
        <div className="buttonContainer" key={button}>
          <NavLink
            to={`/${button.toLowerCase().replace(" ", "-")}`}
            className={({ isActive }) => (isActive ? "selected" : "")}
          >
            {button}
          </NavLink>
        </div>
      ))}
    </div>
  );
};
