/**
 * TODO:
 *  - Split into sub components that will change based on state; support states:
 *      - waiting for players to join
 *      - dasher waiting for input
 *      - guessers guessing
 *      - guessers waiting for others
 *      - dasher judging
 *      - guessers voting
 *      - round results
 *      - final results
 *  - Clean up the scoreboard
 */

import { Title } from "@mantine/core";
import { useRouter } from "next/router";
import Lobby from "../components/session/Lobby";
import Round from "../components/session/Round";
import { useEffect, useState } from "react";
import Error from "../components/errors/Error";
import { syncSession } from "../lib/firebase";
import { GAME_STATES } from "../lib/constants";

const scenarioHandler = (sessionData) => {
  const state = sessionData === null ? GAME_STATES.INVALID : sessionData.state;
  switch (state) {
    case GAME_STATES.INITIATED:
      return <Lobby sessionData={sessionData} />;
    case GAME_STATES.STARTED:
      return <Round sessionData={sessionData} />;
    case GAME_STATES.FINISHED:
      return <div>Game finished</div>; // TODO: add logic
    case GAME_STATES.INVALID:
      return <Error message="The session code is invalid!" />;
    default:
      return (
        <Title style={{ marginTop: "200px", marginBottom: "200px" }}>
          Loading...
        </Title>
      );
  }
};

export default function SessionId() {
  const router = useRouter();
  const { sessionId } = router.query;
  const [sessionData, setSessionData] = useState({});
  useEffect(() => {
    if (!sessionId) return;
    syncSession(sessionId, setSessionData);
    }, [sessionId]);
  return scenarioHandler(sessionData);
}
