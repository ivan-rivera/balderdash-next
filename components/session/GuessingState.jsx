import cookieCutter from "cookie-cutter";
import {
  Button,
  Card,
  Center,
  SegmentedControl,
  Text,
  Textarea,
  Title,
} from "@mantine/core";
import { IconCheck, IconX } from "@tabler/icons";
import { useEffect, useState } from "react";
import { MAX_DEF_LEN, MIN_DEF_LEN, ROUND_STATES } from "../../lib/constants";
import {
  updateRoundState,
  updateUserGuess,
  updateUserIsCorrect,
} from "../../lib/firebase";
import { getWordDefinition } from "../../lib/vocab";

function GuesserEntryView({ sessionId, roundNumber }) {
  const [definition, setDefinition] = useState("");
  const invalidDefinition =
    definition.length < MIN_DEF_LEN || definition.length > MAX_DEF_LEN;
  return (
    <>
      <Textarea
        placeholder="Your definition..."
        value={definition}
        onChange={(event) => setDefinition(event.currentTarget.value)}
        ml="auto"
        mr="auto"
        minRows={3}
        style={{ maxWidth: "500px" }}
      />
      <Button
        variant="filled"
        color="red.8"
        radius="md"
        mt="xl"
        mb="xl"
        uppercase
        disabled={invalidDefinition}
        onClick={() =>
          updateUserGuess(
            sessionId,
            roundNumber,
            cookieCutter.get("username"),
            definition
          )
        }
      >
        Submit
      </Button>
      {invalidDefinition && (
        <Text italic>
          Definition must be between {MIN_DEF_LEN} and {MAX_DEF_LEN} characters
        </Text>
      )}
    </>
  );
}

function GuesserWaitView({ guess }) {
  return (
    <>
      <Title size="h4" mt="md" mb="xl" italic>
        {guess}
      </Title>
      <Text pl="lg" pr="lg">
        You have already submitted your answer, please wait for the others
      </Text>
    </>
  );
}

function GuesserView(sessionId, word, guesses, roundNumber) {
  const guess = guesses[cookieCutter.get("username")].guess;
  return (
    <div style={{ paddingLeft: "10px", paddingRight: "10px" }}>
      <Title size="h2">Define the following word</Title>
      <Title color="red.8" pt="xl" pb="xl" transform="uppercase">
        {word}
      </Title>
      {guess.length > 0 ? (
        <GuesserWaitView guess={guess} />
      ) : (
        <GuesserEntryView sessionId={sessionId} roundNumber={roundNumber} />
      )}
    </div>
  );
}

function submissionHandler(sessionId, roundNumber, guesses) {
  Object.keys(guesses).forEach((user) => {
    if (guesses[user].correct) {
      updateUserIsCorrect(sessionId, roundNumber, user).catch((error) =>
        console.log(error)
      );
    }
  });
  updateRoundState(sessionId, roundNumber, ROUND_STATES.VOTING).catch((error) =>
    console.log(error)
  );
}

function GuessCard({ guesses }) {
  return Object.keys(guesses).map((user, index) => {
    const guess = guesses[user].guess;
    const waiting = guess.length == 0;
    return (
      <Card
        key={index}
        shadow="xl"
        radius="md"
        mt="lg"
        mb="lg"
        withBorder
        style={{
          maxWidth: "350px",
          marginLeft: "auto",
          marginRight: "auto",
          padding: "5px",
        }}
      >
        <Text size="xs" align="left" color="dimmed" pb="xs">
          {user}
        </Text>
        <Text color={waiting ? "dimmed" : "white"} italic>
          {waiting ? "Waiting for answer..." : guess}
        </Text>
        <div
          style={{
            paddingTop: "10px",
            marginLeft: "auto",
            marginRight: "auto",
            maxWidth: "200px",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <SegmentedControl
            ml="auto"
            mr="auto"
            disabled={waiting}
            onChange={(v) => (guesses[user].correct = Boolean(v))}
            data={[
              {
                label: (
                  <Center>
                    <IconX size={25} />
                  </Center>
                ),
                value: 0,
              },
              {
                label: (
                  <Center>
                    <IconCheck size={25} />
                  </Center>
                ),
                value: 1,
              },
            ]}
          />
        </div>
      </Card>
    );
  });
}

function DasherView(sessionId, word, guesses, roundNumber, definition) {
  const ready = Object.keys(guesses).every(
    (user) => guesses[user].guess.length > 0
  );
  return (
    <>
      <Card ml="auto" mr="auto" mb="xl" style={{ maxWidth: "350px" }}>
        <Title color="red.8" size="h4" transform="uppercase">
          {word}
        </Title>
        <Text size="lg" italic>
          {definition}
        </Text>
      </Card>
      <Title size="h3">Mark correct definitions</Title>
      <GuessCard guesses={guesses} />
      <Button
        mt="md"
        color="red.8"
        disabled={!ready}
        onClick={() => submissionHandler(sessionId, roundNumber, guesses)}
      >
        Submit
      </Button>
      {!ready && (
        <Text size="xs" pt="md" italic>
          Please wait for users to submit their answers
        </Text>
      )}
    </>
  );
}

export default function GuessingState({
  sessionId,
  dasher,
  word,
  guesses,
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
    ? DasherView(sessionId, word, guesses, roundNumber, definition)
    : GuesserView(sessionId, word, guesses, roundNumber);
}
