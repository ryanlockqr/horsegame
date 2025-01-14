import React from "react";
import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/api";
import { getUrl } from "aws-amplify/storage";
import outputs from "../../amplify_outputs.json";

import "../styles/HighScores.css";

/**
 * @type {import('aws-amplify/data').Client<import('../amplify/data/resource').Schema>}
 */

Amplify.configure(outputs);
const client = generateClient({
  authMode: "userPool",
});
export const HighScores: React.FC = () => {
  const [waitingForData, setWaitingForData] = React.useState(false);
  const [scores, setScores] = React.useState<any[]>([]);

  async function getHighScores() {
    setWaitingForData(true);
    const { data: highScores } = await client.models.Note.list();
    await Promise.all(
      highScores.map(async (highScore: any) => {
        const linkToStorageFile = await getUrl({
          path: `profile_pictures/${highScore.name}/profile_pic.jpg`,
        });
        console.log(linkToStorageFile.url);
        highScore.image = linkToStorageFile.url;
      })
    );
    console.log(highScores);
    setScores(highScores.sort((a: any, b: any) => b.score - a.score));
    setWaitingForData(false);
  }

  return (
    <div id="high-scores-component">
      <div id="phase1">
        <h1>High Scores</h1>
      </div>
      <div id="phase2">
        <button onClick={getHighScores} disabled={waitingForData}>
          {!waitingForData && <span>Refresh</span>}
          {waitingForData && <span>wait</span>}
        </button>
      </div>
      <div id="phase3">
        <table>
          <tr>
            <th>User</th>
            <th>Score</th>
            <th>Date</th>
          </tr>
          {scores.map((score: any) => {
            return (
              <tr>
                <td>
                  <div className="user">
                    <img src={score.image} alt="profile" />
                    <span>{score.name}</span>
                  </div>
                </td>
                <td>{score.score}</td>
                <td>{score.date}</td>
              </tr>
            );
          })}
        </table>
      </div>
    </div>
  );
};
