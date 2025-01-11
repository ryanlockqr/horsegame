import type { Schema } from '../amplify/data/resource';
import { generateClient } from 'aws-amplify/data';

const client = generateClient<Schema>();

export async function addUser(username: string, highScore: number) {
  if (!username || isNaN(highScore)) {
    throw new Error("Invalid input: Username must be a string and highScore must be a number.");
  }

  try {
    await client.models.User.create({
      username,
      highScore,
    });
    console.log("User added successfully!");
  } catch (error) {
    console.error("Error adding user:", error);
  }
}

import { useState } from 'react';

export default function HighScoreManager() {
  const [username, setUsername] = useState("");
  const [highScore, setHighScore] = useState<number | "">("");

  const handleSubmit = async () => {
    if (username && highScore !== "") {
      await addUser(username, Number(highScore));
      alert("User added successfully!");
    } else {
      alert("Please enter a valid username and high score.");
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Enter username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="number"
        placeholder="Enter high score"
        value={highScore}
        onChange={(e) => setHighScore(Number(e.target.value))}
      />
      <button onClick={handleSubmit}>Add User</button>
    </div>
  );
}
