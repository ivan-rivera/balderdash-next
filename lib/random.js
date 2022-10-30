/**
 * Tools for generating a random session ID
 *
 */

const letters = "abcdefghijklmnopqrstuvwxyz".toUpperCase();

function generateRandomIndex(array) {
  const index = Math.floor(Math.random() * array.length);
  return array[index];
}

function generateRandomString(len, root = "") {
  if (len === 0) return root;
  const newRoot = root + generateRandomIndex(letters);
  return generateRandomString(len - 1, newRoot);
}

function generateRandomNumber(len) {
  const max = Math.pow(10, len) - 1;
  const num = Math.floor(Math.random() * max);
  return String(num).padStart(len, "0");
}

export function generateRandomSeed() {
  return Math.floor(Math.random() * 100);
}

export function generateSessionId(characters = 5, integers = 3) {
  return generateRandomString(characters) + generateRandomNumber(integers);
}
