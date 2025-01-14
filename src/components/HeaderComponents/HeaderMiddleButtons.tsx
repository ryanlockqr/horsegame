import React from "react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";

import "../../styles/HeaderStyles/Header.css";

const BUTTONS = ["header.play", "header.settings", ];
const BUTTONS_DEV = ["header.high-scores", "header.dev-menu"];

const DEV =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1";

export const HeaderMidButtonsContainer: React.FC = () => {
  const { t } = useTranslation();
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
            to={`/${button
              .toLowerCase()
              .replace(" ", "-")
              .replace("header.", "")}`}
            className={({ isActive }) => (isActive ? "selected" : "")}
          >
            {t(button)}
          </NavLink>
        </div>
      ))}
    </div>
  );
};
