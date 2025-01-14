import React from "react";
import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/api";
import { getUrl } from "aws-amplify/storage";
import outputs from "../../amplify_outputs.json";

import { BeatLoader, RingLoader } from "react-spinners";

import "../styles/HighScores.css";
import { useTranslation } from "react-i18next";
import { useUser } from "../utils/UserContext";

/**
 * @type {import('aws-amplify/data').Client<import('../amplify/data/resource').Schema>}
 */

Amplify.configure(outputs);
const client = generateClient({
  authMode: "apiKey",
});
export const HighScores: React.FC = () => {
  const [waitingForData, setWaitingForData] = React.useState(false);
  const [lastRefreshed, setLastRefreshed] = React.useState(Date.now());
  const [canRefresh, setCanRefresh] = React.useState(true);
  const [scores, setScores] = React.useState<any[]>([]);
  const { user } = useUser();
  const [t] = useTranslation();

  const ONE_MINUTE = 1000 * 60;
  const FIVE_MINUTES = ONE_MINUTE * 5;

  React.useEffect(() => {
    // Initial load if no scores
    if (!waitingForData && scores.length === 0) {
      getHighScores();
    }

    const checkInterval = setInterval(() => {
      const timeSinceLastRefresh = Date.now() - lastRefreshed;
      if (timeSinceLastRefresh >= FIVE_MINUTES) {
        getHighScores();
      }
    }, 5000); // Check every 5 seconds

    return () => clearInterval(checkInterval);
  }, [lastRefreshed, scores.length]);

  React.useEffect(() => {
    const buttonStateInterval = setInterval(() => {
      const timeSinceLastRefresh = Date.now() - lastRefreshed;
      setCanRefresh(!waitingForData && timeSinceLastRefresh > ONE_MINUTE);
    }, 1000); // Check every second

    return () => clearInterval(buttonStateInterval);
  }, [lastRefreshed, waitingForData]);

  async function getHighScores() {
    if (waitingForData) {
      return;
    }

    setWaitingForData(true);
    try {
      const { data: highScores } = await client.models.Note.list();
      await Promise.all(
        highScores.map(async (highScore: any) => {
          const linkToStorageFile = await getUrl({
            path: `profile_pictures/${highScore.name}/profile_pic.jpg`,
          });
          highScore.image = linkToStorageFile.url;
        })
      );

      highScores.sort((a: any, b: any) => b.description - a.description);

      setLastRefreshed(Date.now());

      // set scores to the highest 10
      setScores(highScores.slice(0, 15));
      setCanRefresh(false);
    } catch (e) {
      console.log(e);
    } finally {
      setWaitingForData(false);
    }
  }

  return (
    <div id="high-scores-component">
      <div id="phase1">
        <h1>{t("high-scores.title")}</h1>
        <span>
          {t("high-scores.last-updated", {
            date: new Date(lastRefreshed).toLocaleString(),
          })}
        </span>
      </div>
      <div id="phase2">
        {canRefresh && (
          <button onClick={getHighScores} disabled={waitingForData}>
            {!waitingForData && <span>{t("high-scores.refresh")}</span>}
            <RingLoader color="darkblue" loading={waitingForData} size={15} />
          </button>
        )}
      </div>
      <div id="phase3">
        <table>
          <thead>
            <tr>
              <th>{t("high-scores.user")}</th>
              <th>{t("high-scores.score")}</th>
            </tr>
          </thead>
          {!waitingForData && (
            <tbody>
              {scores.map((score: any) => {
                return (
                  <tr
                    className={score.name === user.username ? "user-row" : ""}
                  >
                    <td>
                      <div className="user">
                        <img src={score.image} alt="profile" />
                        <span>{score.name}</span>
                      </div>
                    </td>
                    <td className="score">{score.description || 0}</td>
                  </tr>
                );
              })}
            </tbody>
          )}
        </table>

        <BeatLoader color="darkblue" loading={waitingForData} size={15} />
      </div>
    </div>
  );
};
