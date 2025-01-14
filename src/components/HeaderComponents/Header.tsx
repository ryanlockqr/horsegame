import React from "react";
import "../../styles/HeaderStyles/Header.css";
import { HeaderMidButtonsContainer } from "./HeaderMiddleButtons";
import { ProfileHamburger } from "./ProfileHamburger";
import { HeaderLeftButtonsContainer } from "./HeaderLeftButtons";

const BUTTONS = ["Play", "Settings", "High Scores"];
const BUTTONS_DEV = "Dev Menu";

const DEV =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1";

export const Header: React.FC = () => {
  if (DEV && !BUTTONS.includes(BUTTONS_DEV)) {
    BUTTONS.push(BUTTONS_DEV);
  }

  return (
    <div id="menu">
      <HeaderLeftButtonsContainer />

      <HeaderMidButtonsContainer />

      <ProfileHamburger />
    </div>
  );
};
