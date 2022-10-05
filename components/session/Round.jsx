import { ROUND_STATES } from "../../lib/constants";
import { Menu, Button, Title, Text } from "@mantine/core";
import DasherState from "./DahserState";
import cookieCutter from "cookie-cutter";

const scenarioHandler = (round) => {
  switch (round.state) {
    case ROUND_STATES.DASHER:
      return <DasherState dasher={round.dasher} word={round.word} />;
    case ROUND_STATES.GUESSING:
      return <div>Guessing</div>;
    case ROUND_STATES.JUDGING:
      return <div>Judging</div>;
    case ROUND_STATES.VOTING:
      return <div>Voting</div>;
    case ROUND_STATES.RESULTS:
      return <div>Results</div>;
    default:
      return (
        <Title style={{ marginTop: "200px", marginBottom: "200px" }}>
          Loading...
        </Title>
      );
  }
};

function Scoreboard({ players }) {
  const scores = Object.entries(players).map(([player, content], index) => [
    index,
    player,
    content.score,
  ]);
  return (
    <Menu shadow="md" width={300} style={{ marginTop: "auto" }}>
      <Menu.Target>
        <Button variant="default" color="gray">
          Scoreboard
        </Button>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Label>Scoreboard</Menu.Label>
        {scores.map((content) => {
          const [index, player, score] = content;
          return (
            <Menu.Item key={index}>
              {player}: {score}
            </Menu.Item>
          );
        })}
      </Menu.Dropdown>
    </Menu>
  );
}

export default function Round({ sessionData }) {
  const { limit, rounds, players } = sessionData;
  const latestRound = rounds.at(-1);
  return (
    <>
      {latestRound.state != null && (
        <Title size="h1">
          Round {latestRound.number} of {limit}
        </Title>
      )}
      <div
        style={{
          fontStyle: "italic",
          paddingTop: "10px",
          paddingBottom: "10px",
        }}
      >
        {latestRound.dasher === cookieCutter.get("username") ? (
          <Text color="dimmed">You are the dasher</Text>
        ) : (
          <Text color="dimmed">You are a guesser</Text>
        )}
      </div>
      {scenarioHandler(latestRound)}
      <div
        style={{
          paddingTop: "80px",
        }}
      >
        {latestRound.state != null && <Scoreboard players={players} />}
      </div>
    </>
  );
}
