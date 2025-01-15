import React from "react";
import "../../styles/HeaderStyles/Header.css";
import { HeaderMidButtonsContainer } from "./HeaderMiddleButtons";
import { ProfileHamburger } from "./ProfileHamburger";
import { HeaderLeftButtonsContainer } from "./HeaderLeftButtons";

const DEV =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1";

export const Header: React.FC = () => {
  return (
    <div id="menu">
      <HeaderLeftButtonsContainer />

      <HeaderMidButtonsContainer />

      <ProfileHamburger />
    </div>
  );
};
