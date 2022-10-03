/**
 * Possible game states
 */
export const GAME_STATES = {
    LOADING: 'LOADING', // Round state is being loaded
    INITIATED: 'INITIATED', // Round has been created, but not started, players can join
    STARTED: 'STARTED', // Round is in progress, players ca no longer join
    FINISHED: 'FINISHED', // Round is finished
    INVALID: 'INVALID', // The session code is invalid
    ERROR: 'ERROR', // unable to resolve the state of the session
}

export const ROUND_STATES = {
    DASHER: 'DASHER', // Dasher is selecting a word
    GUESSING: 'GUESSING', // Guessers are guessing
    JUDGING: 'JUDGING', // Dasher is judging
    VOTING: 'VOTING', // Guessers are voting
    RESULTS: 'RESULTS', // Round results are being displayed
}


/**
 * Maximum number of players per session
 * @type {number}
 */
export const MAX_PLAYERS = 10;


/**
 * Minimum number of players per session
 * @type {number}
 */
export const MIN_PLAYERS = 4;