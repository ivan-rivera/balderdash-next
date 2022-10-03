/**
 * Base data validator used in forms
 */
export const baseSessionValidators = {
    username: (value) => (/^[a-zA-Z0-9_.-]{2,10}/).test(value) ? null : 'Must have 2-10 letters, numbers or dashes',
}


/**
 * Validator used for new session creation
 */
export const newSessionValidators = {
    rounds: (value) => (value < 50 && value > 0) ? null : 'Number of rounds must be between 1 and 50',
}


/**
 * Validator used to join an existing session
 */
export const joinSessionValidators = {
    sessionId: (value) => (/^[A-Z0-9]*$/).test(value) ? null : 'Only numbers and uppercase letters are allowed',
}
