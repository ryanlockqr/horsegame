import { useState, useEffect } from "react";
import {
  Authenticator,
  Button,
  Text,
  TextField,
  Heading,
  Flex,
  View,
  Image,
  Grid,
  Divider,
} from "@aws-amplify/ui-react";
import { Amplify } from "aws-amplify";
import "@aws-amplify/ui-react/styles.css";
import { generateClient } from "aws-amplify/data";
import outputs from "../amplify_outputs.json";
import { uploadData, getUrl } from "aws-amplify/storage";
import { fetchUserAttributes } from "aws-amplify/auth";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from "react";
import { Game } from "./components/Game";
import { DevMenu } from "./components/DevMenu";
import { Header } from "./components/HeaderComponents/Header";
import { Settings } from "./components/Settings";
import { HighScores } from "./components/HighScores";
import { Help } from "./components/Help";

/**
 * @type {import('aws-amplify/data').Client<import('../amplify/data/resource').Schema>}
 */

Amplify.configure(outputs);
const client = generateClient({
  authMode: "userPool",
});

export default function App() {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    fetchNotes();
  }, []);

  async function fetchNotes() {
    const { data: notes } = await client.models.Note.list();
    await Promise.all(
      notes.map(async (note) => {
        if (note.image) {
          const linkToStorageFile = await getUrl({
            path: ({ identityId }) =>
              `profile_pictures/${identityId}/profile_pic.jpg`,
          });
          console.log(linkToStorageFile.url);
          note.image = linkToStorageFile.url;
        }
        return note;
      })
    );
    console.log(notes);
    setNotes(notes);
  }

  async function createNote(event) {
    event.preventDefault();
    storeHighscore(10);
    fetchNotes();
  }

  async function uploadProfilePicture(event) {
    event.preventDefault();
    const form = new FormData(event.target);
    const file = form.get("profilePicture");
    if (!file) {
      alert("Please select an image file.");
      return;
    }

    try {
      // Upload the image to S3
      uploadData({
        path: ({ identityId }) =>
          `profile_pictures/${identityId}/profile_pic.jpg`,
        data: file,
      });

      alert("Profile picture uploaded successfully!");
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      alert("Error uploading profile picture. Please try again.");
    }
  }

  async function storeHighscore(highscore) {
    try {
      // Fetch current user attributes
      const userAttributes = await fetchUserAttributes();
      const email = userAttributes.email; // Access email attribute

      // Fetch profile picture URL from storage
      const profilePicUrl = await getUrl({
        path: ({ identityId }) =>
          `profile_pictures/${identityId}/profile_pic.jpg`,
      });

      // Store highscore in the database
      const { data: newHighscore } = await client.models.Note.create({
        name: email, // Storing email as username
        description: highscore,
        image: profilePicUrl,
      });

      console.log("Highscore stored successfully:", newHighscore);
    } catch (error) {
      console.error("Error storing highscore:", error);
    }
  }

  return (
    <div className="App">
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/play" element={<Game />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/help" element={<Help />} />
          <Route path="/high-scores" element={<HighScores />} />
          <Route path="/dev-menu" element={<DevMenu />} />
        </Routes>
      </BrowserRouter>
    </div>
    /**
    <Authenticator>
      {({ signOut }) => (
        <Flex
          className="App"
          justifyContent="center"
          alignItems="center"
          direction="column"
          width="70%"
          margin="0 auto"
        >
          <Heading level={1}>My Notes App</Heading>
          <View as="form" margin="3rem 0" onSubmit={createNote}>
            <Flex
              direction="column"
              justifyContent="center"
              gap="2rem"
              padding="2rem"
            >
              <Button type="submit" variation="primary">
                Add HighScore
              </Button>
            </Flex>
          </View>
          <Divider />
          <Heading level={2}>Current Notes</Heading>
          <Grid
            margin="3rem 0"
            autoFlow="column"
            justifyContent="center"
            gap="2rem"
            alignContent="center"
          >
            {notes.map((note) => (
              <Flex
                key={note.id || note.name}
                direction="column"
                justifyContent="center"
                alignItems="center"
                gap="2rem"
                border="1px solid #ccc"
                padding="2rem"
                borderRadius="5%"
                className="box"
              >
                <View>
                  <Heading level="3">{note.name}</Heading>
                </View>
                <Text fontStyle="italic">{note.description}</Text>
                {note.image && (
                  <Image
                    src={note.image}
                    alt={`visual`}
                    style={{ width: 400 }}
                  />
                )}
              </Flex>
            ))}
          </Grid>
          <View as="form" onSubmit={uploadProfilePicture}>
            <TextField
              label="Upload Profile Picture"
              name="profilePicture"
              type="file"
              accept="image/png, image/jpeg"
            />
            <Button type="submit">Upload</Button>
          </View>

          <Button onClick={signOut}>Sign Out</Button>
        </Flex>
      )}
    </Authenticator>**/
  );
}
