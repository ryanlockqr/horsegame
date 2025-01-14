import React from "react";
import "../../styles/HeaderStyles/ProfileStyles.css";
import { NavLink } from "react-router-dom";
import { defaultUser, useUser } from "../../utils/UserContext";

export const ProfileHamburger: React.FC = () => {
  const [isHovered, setIsHovered] = React.useState(false);
  const { user, setUser } = useUser();
  return (
    <div
      id="profile"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div id="always-visible">
        <NavLink to="/profile">
          <img src={user.profilePicture} alt="pp" />
        </NavLink>
      </div>
      {isHovered && (
        <div id="profile-hover">
          {user.isLoggedIn && (
            <div id="profile-hover-content-username">
              <span>Logged in: {user.username}</span>
            </div>
          )}
          {user.isLoggedIn && (
            <div id="profile-hover-content-logout">
              <span onClick={() => setUser(defaultUser)}>Logout</span>
            </div>
          )}
          {!user.isLoggedIn && (
            <div id="profile-hover-content-login">
              <span>
                You are not logged in.{" "}
                <NavLink to="/profile">
                  <u>(Login)</u>
                </NavLink>
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
