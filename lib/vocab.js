const data = import("../public/rare_words.csv");

const vocab = {};
async function buildVocab() {
  if (Object.keys(vocab).length > 0) return vocab;
  const words = await data;
  for (let i = 0; i < words.length; i++) {
    vocab[words[i].word] = words[i].definition;
  }
}

export async function sampleWord() {
  await buildVocab();
  const keys = Object.keys(vocab);
  const index = Math.floor(Math.random() * keys.length);
  return keys[index];
}

export async function getWordDefinition(word) {
  if (Object.keys(vocab).length === 0) await buildVocab();
  return vocab[word];
}
