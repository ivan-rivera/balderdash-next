/**
 * Firebase API
 */

import { generateSessionId, generateRandomSeed } from "./random";
import { db } from "../firebase";
import {
  ref,
  set,
  update,
  child,
  get,
  onValue,
  increment,
} from "firebase/database";
import {
  GAME_STATES,
  MAX_PLAYERS,
  ROUND_STATES,
  TRUE_DEFINITION,
} from "./constants";
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
 *  seed: number,
 *  guesses: {player: string, guess: string, correct: boolean, correctVote: boolean, seed: number, votes: {player: boolean}}[]
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
  const roundNumber = sessionContent.hasOwnProperty("rounds")
    ? sessionContent.rounds.filter(_).length + 1
    : 1;
  console.log("round number: ", roundNumber);
  const players = sessionContent.players
    ? Object.keys(sessionContent.players)
    : [];
  console.log("players: ", players);
  const word = await sampleWord();
  console.log("word: ", word);
  const dasher = players[(roundNumber - 1) % players.length];
  const guesses = Object.assign(
    {},
    ...players
      .filter((p) => p != dasher)
      .map((p) => ({ [p]: { guess: "", correct: false } }))
  );
  const data = {
    number: roundNumber,
    dasher: dasher,
    word: word,
    state: ROUND_STATES.SELECTING,
  };
  const roundRef = child(sessions, `/${sessionId}/rounds/${roundNumber}`);
  return set(roundRef, data)
    .then(() =>
      set(child(roundRef, "guesses"), guesses).catch((error) =>
        console.log(error)
      )
    )
    .catch((error) => error);
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

export async function updateWord(sessionId, roundNumber) {
  const word = await sampleWord();
  const roundRef = child(sessions, `/${sessionId}/rounds/${roundNumber}`);
  return update(roundRef, { word: word, seed: generateRandomSeed() }).catch(
    (error) => error
  );
}

export async function updateRoundState(sessionId, roundNumber, state) {
  const roundRef = child(sessions, `/${sessionId}/rounds/${roundNumber}`);
  return update(roundRef, { state: state }).catch((error) => error);
}

export async function updateUserGuess(sessionId, roundNumber, username, guess) {
  const roundRef = child(sessions, `/${sessionId}/rounds/${roundNumber}`);
  return update(child(roundRef, `guesses/${username}`), {
    guess: guess,
    seed: generateRandomSeed(),
  }).catch((error) => error);
}

export async function incrementUserScore(sessionId, username, delta = 1) {
  const playersRef = child(sessions, `/${sessionId}/players`);
  await update(child(playersRef, username), { score: increment(delta) });
}

export async function updateUserIsCorrect(sessionId, roundNumber, username) {
  const roundRef = child(sessions, `/${sessionId}/rounds/${roundNumber}`);
  await update(child(roundRef, `guesses/${username}`), { correct: true });
  await incrementUserScore(sessionId, username);
}

export async function castVote(sessionId, roundNumber, username, vote) {
  const roundRef = child(sessions, `/${sessionId}/rounds/${roundNumber}`);
  if (vote == TRUE_DEFINITION) {
    return update(child(roundRef, `guesses/${username}`), {
      correctVote: true,
    })
      .then(() => incrementUserScore(sessionId, username))
      .catch((error) => error);
  } else {
    return update(child(roundRef, `guesses/${vote}/votes`), {
      [username]: true,
    })
      .then(() => incrementUserScore(sessionId, vote))
      .catch((error) => error);
  }
}
