import React from "react";
import "../../styles/HeaderStyles/Header.css";
import { HeaderMidButtonsContainer } from "./HeaderMiddleButtons";
import { ProfileHamburger } from "./ProfileHamburger";
import { HeaderLeftButtonsContainer } from "./HeaderLeftButtons";

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
      <HeaderLeftButtonsContainer />

      <HeaderMidButtonsContainer />

      <ProfileHamburger />
    </div>
  );
};
