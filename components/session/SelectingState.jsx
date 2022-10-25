/**
 * What users see when the state is in the "dasher" state
 */

import { Title, Text, Card, Group, Button } from "@mantine/core";
import cookieCutter from "cookie-cutter";
import { useEffect, useState } from "react";
import { getWordDefinition } from "../../lib/vocab";
import { updateRoundState, updateWord } from "../../lib/firebase";
import { ROUND_STATES } from "../../lib/constants";

const cardStyle = {
  maxWidth: "350px",
  marginLeft: "auto",
  marginRight: "auto",
};

/**
 * Component that users see when they are the dasher
 */
function DasherView(word, definition, roundNumber, sessionId) {
  const paddingSides = "20px";
  return (
    <>
      <Title size="h2">Word Selection</Title>
      <Text style={{ paddingLeft: paddingSides, paddingRight: paddingSides }}>
        Pick a word that you think your friends will have a hard time guessing.
        You are the only one who can see this screen!
      </Text>
      <br />
      <Card shadow="lg" radius="md" withBorder style={cardStyle} mb="md">
        <Title size="h3" color="dimmed" mb="md">
          Sampled Word
        </Title>
        <Title size="h4" color="red.5" weight={800} transform="uppercase">
          {word}
        </Title>
        <Title size="h4" italic>
          {definition}
        </Title>
      </Card>
      <Group
        position="center"
        spacing="md"
        grow
        align="center"
        style={cardStyle}
      >
        <Button
          variant="outline"
          color="red"
          onClick={() => updateWord(sessionId, roundNumber)}
        >
          New Word
        </Button>
        <Button
          variant="filled"
          color="red"
          onClick={() =>
            updateRoundState(sessionId, roundNumber, ROUND_STATES.GUESSING)
          }
        >
          Confirm Word
        </Button>
      </Group>
    </>
  );
}

/**
 * Component that users see when they are not the dasher
 */
function GuesserView(word) {
  return (
    <Text size="xl" mt="xl" mb="xl">
      Please wait for the dasher to select the word...
    </Text>
  );
}

export default function SelectingState({
  sessionId,
  dasher,
  word,
  roundNumber,
}) {
  const [definition, setDefinition] = useState("");
  useEffect(() => {
    getWordDefinition(word)
      .then(setDefinition)
      .catch((error) =>
        console.log(`Error retrieving definition for word ${word}: ${error}`)
      );
  }, [word]);
  return cookieCutter.get("username") === dasher
    ? DasherView(word, definition, roundNumber, sessionId)
    : GuesserView(word);
}
