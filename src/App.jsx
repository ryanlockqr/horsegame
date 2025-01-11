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
import { getUrl } from "aws-amplify/storage";
import { uploadData } from "aws-amplify/storage";
import { generateClient } from "aws-amplify/data";
import outputs from "../amplify_outputs.json";
import { aws_amplify } from "aws-cdk-lib";
import { StorageImage } from '@aws-amplify/ui-react-storage';
/**
 * @type {import('aws-amplify/data').Client<import('../amplify/data/resource').Schema>}
 */

const paths = [
  "horse.jpg",
];

Amplify.configure(outputs);
const client = generateClient({
  authMode: "userPool",
});

export default function App() {
  const [notes, setNotes] = useState([]);
  const [skinUrls, setSkins] = useState([]);

  useEffect(() => {
    fetchNotes();
    const urls = paths.map((path) => `skins/${path}`);
    setSkins(urls);
  }, []);

  async function fetchNotes() {
    const { data: notes } = await client.models.Note.list();
    console.log(notes);
    setNotes(notes);
  }

  async function fetchSkins() {
      const result = await Storage.list("skins/"); // List objects under 'skins/' folder
      const skinUrls = await Promise.all(
        result.map(async (skin) => {
          const linkToStorageFile = await getUrl({
            path: skin.key,
          });
          console.log(linkToStorageFile);
          return linkToStorageFile;
        })
      );
      console.log(skinUrls);
      setSkins(skinUrls);
  }
  

  async function createNote(event) {
    event.preventDefault();
    const form = new FormData(event.target);

    const { data: newNote } = await client.models.Note.create({
      name: form.get("name"),
      description: form.get("description"),
    });

    console.log(newNote);

    fetchNotes();
    event.target.reset();
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
              <TextField
                name="name"
                placeholder="Note Name"
                label="Note Name"
                labelHidden
                variation="quiet"
                required
              />
              <TextField
                name="description"
                placeholder="Note Description"
                label="Note Description"
                labelHidden
                variation="quiet"
                required
              />

              <Button type="submit" variation="primary">
                Create Note
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
              </Flex>
            ))}
          </Grid>
          <Heading level={2}>Available Skins</Heading>
          <Grid
            margin="3rem 0"
            autoFlow="column"
            justifyContent="center"
            gap="2rem"
            alignContent="center"
          >
            {skinUrls.map((url, index) => (
              <View key={index} width="200px" height="200px" border="1px solid #ccc" padding="1rem">
                <Image src={url} alt={`Skin ${index}`} width="100%" height="100%" />
              </View>
            ))}
          </Grid>
          <Button onClick={signOut}>Sign Out</Button>
        </Flex>
      )}
    </Authenticator>
  );
}