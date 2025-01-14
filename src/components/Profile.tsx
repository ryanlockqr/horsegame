import React, { useState } from "react";
import "../styles/Profile.css";
import { useTranslation } from "react-i18next";
import { defaultUser, useUser } from "../utils/UserContext";

type UsernameErrorCheckResult = {
  e: string | null /* error message */;
  error: boolean /* whether or not there was an error */;
};

export const Profile: React.FC = () => {
  const { t } = useTranslation();
  const { user, setUser, setLoggedIn, updateProfilePicture, updateUsername } =
    useUser();

  /* state for component to know when to show the username change box */
  const [usernameChangeInProgress, setUsernameChangeInProgress] =
    useState(false);

  /* state for component to know when to show the profile picture change upload  box */
  const [pfpChangeInProgress, setPfpChangeInProgress] = useState(false);

  /* state for component to know when to show the login box */
  const [userLoggingIn, setUserLoggingIn] = useState(false);

  const usernameRegex = /^[a-zA-Z0-9]*$/;

  if (!user.isLoggedIn) {
    return (
      <div id="profile-component-guest">
        <img id="profile-picture" src="defaultUser.jpg"></img>
        <span>{t("Hello")}, Guest!</span>
        <button>
          <span onClick={() => setUserLoggingIn(true)}>Sign In</span>
        </button>
        {userLoggingIn && (
          <div id="login-box">
            <textarea id="username" placeholder="Username"></textarea>
            <button onClick={() => handleLoginRequest()}>Submit</button>
          </div>
        )}
      </div>
    );
  }

  function handleLoginRequest() {
    const newUsername = (
      document.getElementById("username") as HTMLInputElement
    ).value;
    let res = validateUsername(newUsername);
    if (res.error) {
      alert(res.e);
      return;
    }
    setUserLoggingIn(false);
    setUser({
      isLoggedIn: true,
      username: newUsername,
      profilePicture: "defaultUser.jpg",
    });
  }

  function changeUsername(newUsername: string) {
    updateUsername(newUsername);
  }

  function handleUsernameChangeRequest(newUsername: string) {
    const res = validateUsername(newUsername);
    if (res.error) {
      return res.e;
    }
  }

  /* prevent RCE, SQL injection, XSS, racism, profanity, etc. */
  function validateUsername(newUsername: string): UsernameErrorCheckResult {
    let res: UsernameErrorCheckResult = {
      e: null,
      error: false,
    };

    if (!usernameRegex.test(newUsername)) {
      res.e = "Usernames can only contain letters and numbers! No spaces!";
      res.error = true;
      return res;
    }

    if (newUsername === user.username) {
      res.e = "You're already using that username!";
      res.error = true;
      return res;
    }

    if (newUsername.length < 3) {
      res.e = "Usernames must be at least 3 characters long!";
      res.error = true;
      return res;
    }

    // valid username
    return res;
  }

  function showUsernameChange() {
    // close current open dialog box (if open) and open correct one
    setPfpChangeInProgress(false);
    setUsernameChangeInProgress(true);
  }

  function showPFPChange() {
    // close current open dialog box (if open) and open correct one
    setUsernameChangeInProgress(false);
    setPfpChangeInProgress(true);
  }

  function submitNewDetails() {
    if (usernameChangeInProgress) {
      const newUsername = (
        document.getElementById("new-username") as HTMLInputElement
      ).value;

      const err = handleUsernameChangeRequest(newUsername);
      if (err) {
        alert(err);
        return;
      }
      changeUsername(newUsername);
    }
    if (pfpChangeInProgress) {
      const newPFP = (document.getElementById("new-pfp") as HTMLInputElement)
        .value;
      updateProfilePicture(newPFP);
    }
  }

  return (
    <div id="profile-component">
      <div id="sign-out-button">
        <button onClick={() => setUser(defaultUser)}>{t("sign-out")}</button>
      </div>
      <img id="profile-picture" src={user.profilePicture}></img>
      <span>{t("user-page-greeting", { name: user.username })}</span>

      <div id="user-change-detail-buttons-container">
        <button onClick={showUsernameChange}>
          <span>Change username</span>
        </button>
        <button onClick={showPFPChange}>
          <span>Change profile picture</span>
        </button>
      </div>

      {(usernameChangeInProgress || pfpChangeInProgress) && (
        <div id="new-detail-container">
          {usernameChangeInProgress && (
            <div>
              <textarea id="new-username" placeholder="New username"></textarea>
            </div>
          )}

          {pfpChangeInProgress && (
            <div>
              <button>Upload</button>
            </div>
          )}

          <button onClick={submitNewDetails}>
            <span>Submit</span>
          </button>

          <button
            onClick={() => {
              setUsernameChangeInProgress(false);
              setPfpChangeInProgress(false);
            }}
          >
            <span>Cancel</span>
          </button>
        </div>
      )}
    </div>
  );
};
