import React from "react";
import { NavLink } from "react-router-dom";
import "../../styles/HeaderStyles/Header.css";
import { HeaderMidButtonsContainer } from "./HeaderMiddleButtons";
import { Profile } from "./Profile";

const BUTTONS = ["Play", "Settings", "Help"];
const BUTTONS_DEV = ["High Scores", "Dev Menu"];

const DEV =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1";

export const Header: React.FC = () => {
  if (DEV && !BUTTONS.includes(BUTTONS_DEV[0])) {
    BUTTONS_DEV.forEach((button: string) => {
      BUTTONS.push(button);
    });
  }
  return (
    <div id="menu">
      <NavLink to="">
        <img src="/favicon.png" alt="logo.png" />
      </NavLink>

      <HeaderMidButtonsContainer />

      <Profile />
    </div>
  );
};
