import React from "react";
import "../../styles/HeaderStyles/ProfileStyles.css";

export const Profile: React.FC = () => {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <div
      id="profile"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img src="/favicon.ico" alt="pp" />

      {isHovered && (
        <div id="profile-hover">
          <div id="profile-hover-content">
            <div id="profile-hover-content-username">
              <span>Username</span>
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
