import {
  Chip,
  Text,
  Card,
  Stack,
  Grid,
  Title,
  Button,
  Group,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { getWordDefinition } from "../../lib/vocab";
import { sortBy } from "lodash";
import cookieCutter from "cookie-cutter";
import {
  castVote,
  incrementUserScore,
  updateRoundState,
} from "../../lib/firebase";
import { ROUND_STATES, TRUE_DEFINITION } from "../../lib/constants";

const CARD_WIDTH = "350px";

function Option(
  index,
  voters,
  definition,
  owner,
  checked,
  disabled,
  allVotesSubmitted
) {
  return (
    <Card
      key={index}
      radius="md"
      shadow="xl"
      style={{ width: CARD_WIDTH }}
      withBorder
    >
      <Grid grow>
        <Grid.Col span={6}>
          {allVotesSubmitted && (
            <Text size="xs" color="dimmed" align="left">
              Votes: {voters.length}
            </Text>
          )}
        </Grid.Col>
        <Grid.Col span={6}>
          <Text
            size="xs"
            color={owner == TRUE_DEFINITION ? "red.8" : "dimmed"}
            align="right"
          >
            {disabled && owner}
            {owner == cookieCutter.get("username") && " (You)"}
          </Text>
        </Grid.Col>
        <Grid.Col span={12}>
          <Text mt="xs" mb="lg" italic>
            {definition}
          </Text>
        </Grid.Col>
        <Grid.Col span={12}>
          <Chip
            variant="filled"
            checked={checked}
            disabled={disabled}
            value={owner}
            style={{ textAlign: "center" }}
          >
            Answer {index + 1}
          </Chip>
        </Grid.Col>
        {allVotesSubmitted && voters.length > 0 && (
          <Grid.Col span={12} pt="xs">
            <Text size="xs">Received votes from:</Text>
            <Text size="xs">{voters.join(", ")}</Text>
          </Grid.Col>
        )}
      </Grid>
    </Card>
  );
}

function Options({
  guesses,
  definition,
  voteSetter,
  seed,
  allowedToVote,
  allVotesSubmitted,
}) {
  if (definition === undefined || guesses == undefined) return;
  const trueDefinitionVoters = Object.keys(guesses).filter((user) =>
    guesses[user].hasOwnProperty("correctVote")
      ? guesses[user].correctVote
      : false
  );
  const options = sortBy(
    Object.keys(guesses)
      .filter((user) => !guesses[user].correct)
      .map((user) => ({
        owner: user,
        definition: guesses[user].guess,
        votes: guesses[user].hasOwnProperty("votes")
          ? Object.keys(guesses[user].votes)
          : [],
      }))
      .concat(
        Array({
          owner: TRUE_DEFINITION,
          definition: definition,
          votes: trueDefinitionVoters,
        })
      ),
    "definition"
  );
  return (
    <Stack align="stretch" justify="center">
      <Chip.Group
        position="center"
        m="auto"
        onChange={voteSetter}
        style={{ width: CARD_WIDTH }}
      >
        {options.map((entry, index) => {
          const voters = entry.hasOwnProperty("votes") ? entry.votes : [];
          const checked = voters.includes(cookieCutter.get("username"));
          return Option(
            index,
            voters,
            entry.definition,
            entry.owner,
            checked,
            !allowedToVote || entry.owner == cookieCutter.get("username"),
            allVotesSubmitted
          );
        })}
      </Chip.Group>
    </Stack>
  );
}

function submitVote(sessionId, roundNumber, vote) {
  castVote(sessionId, roundNumber, cookieCutter.get("username"), vote).catch(
    (error) => console.log(`failed to cast a vote: ${error}`)
  );
}

function handleContinueButton(
  sessionId,
  roundNumber,
  awardDasherPoints,
  dasher
) {
  if (awardDasherPoints) {
    incrementUserScore(sessionId, dasher, 2).catch((error) =>
      console.log(`failed to increment user score: ${error}`)
    );
  }
  updateRoundState(sessionId, roundNumber, ROUND_STATES.RESULTS).catch(
    (error) => console.log(error)
  );
}

function IneligibleToVote(
  sessionId,
  roundNumber,
  dasher,
  word,
  definition,
  usersWithIncorrectGuesses
) {
  return (
    <>
      <Title size="h3" transform="uppercase" color="red.8" mb="sm">
        {word}
      </Title>
      <Title size="h5" mb="xl" italic>
        {definition}
      </Title>
      <Title mb="sm" size="h4">
        Not enough eligible voters
      </Title>
      {usersWithIncorrectGuesses.length > 0 && (
        <Text ml="auto" mr="auto" size="sm" style={{ width: CARD_WIDTH }}>
          Everyone except for {usersWithIncorrectGuesses[0]} guessed the correct
          definition and since the remaining player is not allowed to vote for
          their own definition, there are not enough eligible voters to
          continue, therefore no more points will be awarded in this round.
          Please wait for the dasher to continue.
        </Text>
      )}
      {usersWithIncorrectGuesses.length == 0 && (
        <Text ml="auto" mr="auto" size="sm" style={{ width: CARD_WIDTH }}>
          Everyone guessed the correct definition, therefore no points can be
          awarded via voting. Please wait for the dasher to continue
        </Text>
      )}
      {dasher === cookieCutter.get("username") && (
        <Button
          mt="xs"
          mb="xl"
          variant="filled"
          color="red.8"
          radius="md"
          onClick={() =>
            handleContinueButton(sessionId, roundNumber, false, dasher)
          }
        >
          Next
        </Button>
      )}
    </>
  );
}

function VotingScreen(
  word,
  definition,
  seed,
  sessionId,
  roundNumber,
  dasher,
  guesses,
  vote,
  setVote,
  allowedToVote,
  userVoted,
  allVotesSubmitted,
  guessedCorrectly,
  correctUsers
) {
  return (
    <>
      <Title size="h3" transform="uppercase" color="red.8" mb="md">
        {word}
      </Title>
      <Title size="h5" mb="md">
        Pick the true definition
      </Title>
      <Text
        ml="auto"
        mr="auto"
        mb="md"
        size="xs"
        align="center"
        italic
        style={{ maxWidth: CARD_WIDTH }}
      >
        Note: the dasher and those who have submitted the correct definition are
        note allowed to vote, the rest are not allowed to vote for their own
        definitions.
      </Text>
      <Options
        guesses={guesses}
        definition={definition}
        voteSetter={setVote}
        seed={seed}
        allowedToVote={allowedToVote}
        allVotesSubmitted={allVotesSubmitted}
      />
      <Group
        mt="md"
        ml="auto"
        mr="auto"
        position="center"
        style={{ maxWidth: CARD_WIDTH }}
      >
        <Text size="xs" italic>
          After submitting a vote, you will see the author of each definition.
          When everyone submits their votes, you will see who voted for each
          answer. After reviewing the results, the dasher will then be able to
          proceed to the next stage where you will get to see the scoreboard.
        </Text>
        {cookieCutter.get("username") != dasher && !guessedCorrectly && (
          <Button
            mt="xs"
            mb="xl"
            variant="filled"
            color="red.8"
            radius="md"
            disabled={vote == "" || userVoted}
            onClick={() => submitVote(sessionId, roundNumber, vote)}
          >
            Vote
          </Button>
        )}
        {dasher === cookieCutter.get("username") && (
          <Button
            mt="xs"
            mb="xl"
            variant="filled"
            color="red.8"
            radius="md"
            disabled={!allVotesSubmitted}
            onClick={() =>
              handleContinueButton(
                sessionId,
                roundNumber,
                correctUsers.length == 0,
                dasher
              )
            }
          >
            Next
          </Button>
        )}
      </Group>
      <Group
        mt="md"
        ml="auto"
        mr="auto"
        position="center"
        style={{ maxWidth: CARD_WIDTH }}
      >
        {guessedCorrectly && (
          <Text size="sm" weight={1000} color="red.4">
            You have guessed the definition correctly! This means you can not
            vote for other definitions. Please wait for their others to submit
            their votes and for the dasher to move us to the next stage
          </Text>
        )}
        {dasher === cookieCutter.get("username") && (
          <Text size="sm" weight={1000} color="red.4">
            As the dasher, you are not allowed to vote. Please wait for the
            others to submit their votes
          </Text>
        )}
        {userVoted && (
          <Text size="sm" weight={1000} color="red.4">
            You have voted
          </Text>
        )}
      </Group>
    </>
  );
}

export default function VotingState({
  sessionId,
  roundNumber,
  guesses,
  word,
  seed,
  dasher,
}) {
  const guessedCorrectly = guesses.hasOwnProperty(cookieCutter.get("username"))
    ? guesses[cookieCutter.get("username")].correct
    : false;
  const usersWithIncorrectGuesses = Object.keys(guesses).filter(
    (user) => !guesses[user].correct
  );
  const usersWithCorrectGuesses = Object.keys(guesses).filter(
    (user) => guesses[user].correct
  );
  const usersWithCorrectVotes = Object.keys(guesses).filter((user) => {
    return guesses[user].hasOwnProperty("correctVote")
      ? guesses[user].correctVote
      : false;
  });
  const correctUsers = usersWithCorrectGuesses.concat(usersWithCorrectVotes);
  const usersWithWrongVotes = Object.assign(
    {},
    ...Object.keys(guesses).flatMap((user) => {
      return guesses[user].hasOwnProperty("votes")
        ? Object.keys(guesses[user].votes).map((v) => {
            return { [v]: user };
          })
        : null;
    })
  );
  const usersWhoVoted = Object.keys(usersWithWrongVotes).concat(
    usersWithCorrectVotes
  );
  const expectedVotes = Object.keys(guesses).filter(
    (user) => !guesses[user].correct
  ).length;
  const votingCanProceed = expectedVotes > 1;
  const allVotesSubmitted = usersWhoVoted.length == expectedVotes;
  const userVoted = usersWhoVoted.includes(cookieCutter.get("username"));
  const allowedToVote =
    !userVoted && cookieCutter.get("username") != dasher && !guessedCorrectly;
  const [definition, setDefinition] = useState("");
  const [vote, setVote] = useState("");
  useEffect(() => {
    getWordDefinition(word)
      .then(setDefinition)
      .catch((error) =>
        console.log(`Error retrieving definition for word ${word}: ${error}`)
      );
  }, [word]);
  return votingCanProceed
    ? VotingScreen(
        word,
        definition.charAt(0).toUpperCase() + definition.slice(1),
        seed,
        sessionId,
        roundNumber,
        dasher,
        guesses,
        vote,
        setVote,
        allowedToVote,
        userVoted,
        allVotesSubmitted,
        guessedCorrectly,
        correctUsers
      )
    : IneligibleToVote(
        sessionId,
        roundNumber,
        dasher,
        word,
        definition.charAt(0).toUpperCase() + definition.slice(1),
        usersWithIncorrectGuesses
      );
}
