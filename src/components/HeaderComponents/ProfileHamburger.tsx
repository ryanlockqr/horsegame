import React from "react";
import "../../styles/HeaderStyles/ProfileStyles.css";
import { NavLink } from "react-router-dom";
import { useUser } from "../../utils/UserContext";

export const ProfileHamburger: React.FC = () => {
  const [isHovered, setIsHovered] = React.useState(false);
  const { user } = useUser();
  return (
    <div
      id="profile"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {user.isLoggedIn && (
        <span className="logged-in-reminder">
          Logged in as: {user.username}
        </span>
      )}
      {!user.isLoggedIn && (
        <span className="logged-in-reminder">You are not logged in</span>
      )}
      <NavLink to="/profile">
        <img src={user.profilePicture} alt="pp" />
      </NavLink>
      {isHovered && (
        <div id="profile-hover">
          <div id="profile-hover-content">
            <div id="profile-hover-content-username">
              <span>Logged in as: {user.username}</span>
            </div>
            <div id="profile-hover-content-logout">
              <span>Logout</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
