import {createContext, useContext, useState, useEffect, ReactNode} from 'react';
import {S3Client, ListObjectsCommand} from '@aws-sdk/client-s3';

interface S3ContextType {
    objects: any[];
    isLoading: boolean;
    error: Error | null;
    refreshObjects: () => Promise<void>;
}

const S3Context = createContext<S3ContextType | undefined>(undefined);

export function S3Provider({ children }: { children: ReactNode }) {
    const [objects, setObjects] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const s3Client = new S3Client({
        region: 'us-east-1',
        credentials: {
            accessKeyId: '<YOUR_AwsAccessKey_HERE>',
            secretAccessKey: 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY',
        },
        endpoint: 'XXXXXXXXXXXXXXXXXXXXXXXX',
        forcePathStyle: true,
    });

    const fetchObjects = async () => {
        try {
            const command = new ListObjectsCommand({
                Bucket: 'XXXXXXXXXX',
                Prefix: 'profile_pictures/',
            });
            const response = await s3Client.send(command);
            setObjects(response.Contents || []);
            setIsLoading(false);
        } catch (err) {
            setError(err as Error);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchObjects();
    }, []);

    const refreshObjects = async () => {
        setIsLoading(true);
        await fetchObjects();
    };

    return (
        <S3Context.Provider value={{ objects, isLoading, error, refreshObjects }}>
            {children}
        </S3Context.Provider>
    );
}



/**
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

/**
 * @type {import('aws-amplify/data').Client<import('../amplify/data/resource').Schema>}
 */

Amplify.configure(outputs);
const client = generateClient({
  authMode: "apiKey",
});

export default function App() {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    fetchNotes();
  }, []);

  async function fetchNotes() {
    const { data: scores } = await client.models.scoreEntry.list();
    await Promise.all(
      scores.map(async (note) => {
        if (note.image) {
          const linkToStorageFile = await getUrl({
            path: `profile_pictures/${note.name}/profile_pic.jpg`,
          });
          console.log(linkToStorageFile.url);
          note.image = linkToStorageFile.url;
        }
        return note;
      })
    );
    setNotes(scores);
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
    const userAttributes = await fetchUserAttributes();
    const email = userAttributes.email; // Access email attribute

    try {
      // Upload the image to S3
      uploadData({
        path: `profile_pictures/${email}/profile_pic.jpg`,
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

      // Store highscore in the database
      const { data: newHighscore } = await client.models.scoreEntry.create({
        name: email, // Storing email as username
        score: highscore,
        image: profilePicUrl,
      });

      console.log("Highscore stored successfully:", newHighscore);
    } catch (error) {
      console.error("Error storing highscore:", error);
    }
  }

  return (
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
    </Authenticator>
  );
}
