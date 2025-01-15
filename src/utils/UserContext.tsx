import {
  fetchUserAttributes,
  FetchUserAttributesOutput,
} from "@aws-amplify/auth";
import React, { createContext, useState, useContext } from "react";
console.log("Fetching user attributes...");

const amplifyCredentials: FetchUserAttributesOutput =
  await fetchUserAttributes();

console.log(amplifyCredentials);
type User = {
  username: string;
  isLoggedIn: boolean;
  profilePicture: string;
  email: string;
};

export const defaultUser: User = {
  username: "AnonymousUser" + Math.floor(Math.random() * 1000),
  isLoggedIn: false,
  profilePicture: "defaultUser.jpg",
  email:
    amplifyCredentials.email_verified && amplifyCredentials.email
      ? amplifyCredentials.email
      : "",
};

type UserContextType = {
  user: User;
  setUser: (user: User) => void;
  updateUsername: (username: string) => void;
  updateProfilePicture: (pictureUrl: string) => void;
  setLoggedIn: (status: boolean) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Initialize state with default values
  const [user, setUser] = useState<User>(() => {
    try {
      const savedUser = localStorage.getItem("user");
      return savedUser ? JSON.parse(savedUser) : defaultUser;
    } catch (e) {
      localStorage.removeItem("user");
      return defaultUser;
    }
  });

  // Helper function to save user state to localStorage
  const saveUser = (newUserState: User) => {
    localStorage.setItem("user", JSON.stringify(newUserState));
    setUser(newUserState);
  };

  // Convenience methods for updating specific user properties
  const updateUsername = (username: string) => {
    saveUser({ ...user, username });
  };

  const updateProfilePicture = (pictureUrl: string) => {
    saveUser({ ...user, profilePicture: pictureUrl });
  };

  const setLoggedIn = (status: boolean) => {
    saveUser({ ...user, isLoggedIn: status });
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser: saveUser,
        updateUsername,
        updateProfilePicture,
        setLoggedIn,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
