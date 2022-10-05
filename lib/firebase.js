/**
 * Firebase API
 */

import generateSessionId from "./random";
import { db } from "../firebase";
import { ref, set, child, get, onValue } from "firebase/database";
import { GAME_STATES, MAX_PLAYERS, ROUND_STATES } from "./constants";
import { sampleWord } from "./vocab";

const sessions = ref(db, "sessions");

/**
 * Create a new session ID that does not clash with any of the existing IDs
 * @return {Promise<*>} a unique ID value
 */
async function createNewSessionId() {
  const id = generateSessionId();
  const sessionExists = await sessionIdExists(id);
  if (sessionExists) return createNewSessionId();
  else return id;
}

/**
 * A helper function to get session data
 * @param sessionId
 * @return {Promise<{
 * id: string,
 * creator: string,
 * limit: number,
 * rounds: {
 *  number: number,
 *  dasher: string,
 *  word: string,
 *  state: string,
 *  guesses: {player: string, guess: string, correct: boolean, votes: [string]}
 *  },
 * state: string,
 * players: {player: string, score: number}
 * }>}
 */
async function getSessionValue(sessionId) {
  const sessionRef = child(sessions, sessionId);
  const sessionSnapshot = await get(sessionRef);
  return sessionSnapshot.val();
}

/**
 * Sync session data with the frontend
 * @param sessionId
 * @param setter
 */
export function syncSession(sessionId, setter) {
  const sessionRef = child(sessions, sessionId);
  onValue(sessionRef, (snapshot) => setter(snapshot.val()));
}

/**
 * Check if a particular session ID already exists
 * Note that if the function errors for some reason then it will return true out of fear of
 * overwriting an existing session and instead prompting another check
 * @param sessionId (string) the session ID key to check
 * @return (boolean) true if the session ID already exists, false otherwise
 */
export async function sessionIdExists(sessionId) {
  const sessionRef = child(sessions, sessionId);
  return get(sessionRef)
    .then((snapshot) => snapshot.exists())
    .catch((error) =>
      console.log(`Session ID check failed with error: ${error}`)
    );
}

/**
 * Create a new session in the database
 * After successfully joining a session, the creator also joins the session
 * @param creator (string) the name of the creator of the session
 * @param rounds (number) the number of rounds to play in the session
 * @return (Promise<Object>) a promise that contains an error (if present) and a session ID
 */
export async function initSession(creator, rounds) {
  const sessionId = await createNewSessionId();
  const initialState = {
    id: sessionId,
    creator: creator,
    state: GAME_STATES.INITIATED,
    limit: rounds,
  };
  return set(child(sessions, sessionId), initialState)
    .then(() => joinSession(sessionId, creator))
    .catch((error) => ({ sessionId: null, error }));
}

// TODO: test failure cases
/**
 * Join a session
 * In order to join a session:
 *  (1) the session must exist,
 *  (2) the session must be accepting players, and
 *  (3) the username must not be taken
 * @param sessionId - session ID
 * @param username - username
 * @return {Promise<{sessionId: string|null, error: string|null}>}
 */
export async function joinSession(sessionId, username) {
  const sessionData = await getSessionValue(sessionId);
  const sessionPlayers = sessionData.hasOwnProperty("players")
    ? Object.keys(sessionData.players)
    : [];
  if (!(await sessionIdExists(sessionId)))
    return { sessionId: null, error: `Session ${sessionId} does not exist` };
  if (sessionPlayers.includes(username))
    return { sessionId: null, error: `"${username}" is taken` };
  if (
    !(
      sessionPlayers.length < MAX_PLAYERS &&
      sessionData.state === GAME_STATES.INITIATED
    )
  )
    return {
      sessionId: null,
      error: "This session is either full or has already started",
    };
  const sessionRef = child(sessions, sessionId);
  return set(child(sessionRef, `players/${username}`), { score: 0 })
    .then(() => ({ sessionId, error: null }))
    .catch((error) => ({ sessionId: null, error }));
}

/**
 * instantiate a new round.
 * NOTE: we are overwriting data of previous rounds because we don't need to keep track of them
 * @param sessionId
 * @return {Promise<void>}
 */
export async function newRound(sessionId) {
  const sessionContent = await getSessionValue(sessionId);
  const roundNumber = (Object.keys(sessionContent.limit) ?? []).length + 1;
  const players = sessionContent.players
    ? Object.keys(sessionContent.players)
    : [];
  const word = await sampleWord();
  const dasher = players[(roundNumber - 1) % players.length];
  const data = {
    number: roundNumber,
    dasher: dasher,
    word: word,
    state: ROUND_STATES.DASHER,
  };
  const roundRef = child(sessions, `/${sessionId}/rounds/${roundNumber}`);
  return set(roundRef, data).catch((error) => error);
}

/**
 * Start the session
 * @param sessionId
 * @return {Promise<void>}
 */
export async function startSession(sessionId) {
  const sessionRef = child(sessions, sessionId);
  return set(child(sessionRef, "state"), GAME_STATES.STARTED)
    .then(() => newRound(sessionId))
    .catch((error) => error);
}
