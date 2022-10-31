const papa = require("papaparse");

const VOCAB_URL =
  "https://raw.githubusercontent.com/ivan-rivera/balderdash-next/main/public/rare_words.csv";
// const VOCAB_URL =
//   "https://raw.githubusercontent.com/ivan-rivera/balderdash-next/main/public/test_rare_words.csv";

let vocab = {};
export async function buildVocab() {
  await fetch(VOCAB_URL)
    .then((resp) => resp.text())
    .then((text) => {
      papa.parse(text, { header: true }).data.forEach((row) => {
        vocab[row.word] = row.definition;
      });
    });
}

export async function sampleWord() {
  await buildVocab();
  const keys = Object.keys(vocab);
  console.log(keys.slice(0, 10));
  const index = Math.floor(Math.random() * keys.length);
  console.log(keys[index]);
  return keys[index];
}

export async function getWordDefinition(word) {
  if (Object.keys(vocab).length === 0) await buildVocab();
  return vocab[word];
}
