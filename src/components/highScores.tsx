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
  const [lastRefreshed, setLastRefreshed] = React.useState(() => {
    const stored = localStorage.getItem("lastRefreshed");
    return stored ? parseInt(stored) : Date.now();
  });
  const [canRefresh, setCanRefresh] = React.useState(true);
  const [scores, setScores] = React.useState<any[]>(() => {
    const stored = localStorage.getItem("highScores");
    return stored ? JSON.parse(stored) : [];
  });
  const { user } = useUser();
  const [t] = useTranslation();

  const ONE_MINUTE = 1000 * 60;
  const FIVE_MINUTES = ONE_MINUTE * 5;

  React.useEffect(() => {
    localStorage.setItem("highScores", JSON.stringify(scores));
    localStorage.setItem("lastRefreshed", lastRefreshed.toString());
  }, [scores, lastRefreshed]);

  React.useEffect(() => {
    // Only fetch if we have no scores OR if it's been 5 minutes since last refresh
    const timeSinceLastRefresh = Date.now() - lastRefreshed;
    if (
      (!waitingForData && scores.length === 0) ||
      timeSinceLastRefresh >= FIVE_MINUTES
    ) {
      getHighScores();
    }

    const checkInterval = setInterval(() => {
      const timeSinceLastRefresh = Date.now() - lastRefreshed;
      if (timeSinceLastRefresh >= FIVE_MINUTES) {
        getHighScores();
      }
    }, 5000);

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
          highScore.username = highScore.name ? highScore.name : "Anonymous";
        })
      );

      highScores.sort((a: any, b: any) => b.description - a.description);

      setLastRefreshed(Date.now());

      console.log(highScores);

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
                    key={score.id}
                  >
                    <td>
                      <div className="user">
                        <img src={score.image} alt="profile" />
                        <span>{score.username}</span>
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
