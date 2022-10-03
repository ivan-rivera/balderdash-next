/**
 * Firebase API
 */

import generateSessionId from "./random";
import { db } from '../firebase';
import { ref, set, child, get, onValue } from "firebase/database";
import {GAME_STATES, MAX_PLAYERS, ROUND_STATES} from "./constants";
import {sampleWord} from "./vocab";


const sessions = ref(db, 'sessions');


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
 * creator: string,
 * rounds: number,
 * roundDesc: {number: number, dasher: string, word: string, state: string},
 * state: string,
 * users: [string]
 * }>}
 */
async function getSessionValue(sessionId) {
    const sessionRef = child(sessions, sessionId);
    const sessionSnapshot = await get(sessionRef);
    return sessionSnapshot.val();
}


/**
 * Retrieve users in a session
 * @param sessionId {string} a session ID
 * @return {Promise<string[]|*[]>} a list of users as strings in the session
 */
export async function getSessionPlayers(sessionId) {
    const contents = await getSessionValue(sessionId)
    const users = contents.users
    return users ? Object.keys(users) : [];
}


/**
 * Get the creator of the session
 * @param sessionId session ID
 * @return {Promise<string>}
 */
export async function getSessionCreator(sessionId) {
    const content = await getSessionValue(sessionId)
    return content.creator;
}


export async function getSessionRoundCount(sessionId) {
    const content = await getSessionValue(sessionId)
    return content.rounds;
}


/**
 * Sync players in a session so that any new joiners are reflected reactively
 * @param sessionId Id of the session
 * @param playerSetter state setter that fills the user array
 * @constructor
 */
export function syncSessionPlayers(sessionId, playerSetter) {
    const sessionPlayersRef = child(sessions, sessionId + "/users")
    onValue(sessionPlayersRef, (snapshot) => {
        const users = snapshot.val()
        const userList = users ? Object.keys(users) : []
        playerSetter(userList)
    })
}


export function syncSessionState(sessionId, stateSetter) {
    const sessionStateRef = child(sessions, sessionId + "/state")
    onValue(sessionStateRef, (snapshot) => stateSetter(snapshot.val()))
}

export function syncRoundState(sessionId, roundSetter) {
    const roundStateRef = child(sessions, sessionId + "/roundDesc/state")
    onValue(roundStateRef, (snapshot) => roundSetter(snapshot.val()))
}

export function syncDasher(sessionId, dasherSetter) {
    const dasherRef = child(sessions, sessionId + "/roundDesc/dasher")
    onValue(dasherRef, (snapshot) => dasherSetter(snapshot.val()))
}

export function syncRoundNumber(sessionId, roundSetter) {
    const roundRef = child(sessions, sessionId + "/roundDesc/number")
    onValue(roundRef, (snapshot) => roundSetter(snapshot.val()))
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
        .then(snapshot => snapshot.exists())
        .catch(error => console.log(`Session ID check failed with error: ${error}`))
}


/**
 * Retrieve session state
 * @param sessionId
 * @return {Promise<*>}
 */
export async function getSessionState(sessionId) {
    const content = await getSessionValue(sessionId);
    return content.state;
}


/**
 * Check if the session is accepting players
 * There are 2 reasons why the session may not be accepting players: (1) it is full and (2) it has already started
 * @param sessionId - session ID
 * @return {Promise<{acceptingPlayers: boolean, errors: *[]}>}
 */
async function sessionIsAcceptingPlayers(sessionId) {
    let errors = [];
    const users = await getSessionPlayers(sessionId);
    if (users.length >= MAX_PLAYERS) errors.push(`Session ${sessionId} is full`);
    if (await getSessionState(sessionId) !== GAME_STATES.INITIATED) errors.push(`The session is not accepting players`);
    return {acceptingPlayers: errors.length === 0, errors};
}


/**
 * Create a new session in the database
 * After successfully joining a session, the creator also joins the session
 * @param creator (string) the name of the creator of the session
 * @param rounds (number) the number of rounds to play in the session
 * @return (Promise<Object>) a promise that contains an error (if present) and a session ID
 */
export async function initSession(creator, rounds) {
    const initialState = {creator: creator, state: GAME_STATES.INITIATED, rounds: rounds}
    const sessionId = await createNewSessionId();
    return set(child(sessions, sessionId), initialState)
        .then(() => joinSession(sessionId, creator))
        .catch(error => ({sessionId: null, error}))
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
    if (!await sessionIdExists(sessionId)) return {sessionId: null, error: `Session ${sessionId} does not exist`};
    if((await getSessionPlayers(sessionId)).includes(username)) return {sessionId: null, error: `"${username}" is taken`};
    const {acceptingPlayers, errors} = await sessionIsAcceptingPlayers(sessionId);
    if (!acceptingPlayers) return {sessionId: null, error: errors.join(", ")};
    const sessionRef = child(sessions, sessionId);
    return set(child(sessionRef, `users/${username}`), {score: 0})
        .then(() => ({sessionId, error: null}))
        .catch(error => ({sessionId: null, error}))
}


/**
 * instantiate a new round.
 * NOTE: we are overwriting data of previous rounds because we don't need to keep track of them
 * @param sessionId
 * @return {Promise<void>}
 */
export async function newRound(sessionId) {
    const sessionContent = await getSessionValue(sessionId);
    const roundNumber = (sessionContent.roundDesc ?? {number: 0}).number + 1;
    const players = sessionContent.users ? Object.keys(sessionContent.users) : [];
    const word = await sampleWord()
    const data = {
        number: roundNumber,
        dasher: players[(roundNumber - 1) % players.length],
        word: word,
        state: ROUND_STATES.DASHER
    }
    const roundRef = child(child(sessions, sessionId), '/roundDesc')
    set(roundRef, data).catch(error => error)
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
        .catch(error => error)
}