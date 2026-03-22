const DEFAULT_PROFANITY_LIST = [
  "abuse",
  "abusive",
  "idiot",
  "stupid",
  "dumb",
  "moron",
  "bastard",
  "bloody",
  "damn",
  "hell",
  "shit",
  "fuck",
  "fucking",
  "fucker",
  "asshole",
  "bitch",
  "slut",
  "whore",
  "crap",
  "suck",
];

function normalize(text) {
  return (text || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

export function detectProfanity(text, customList) {
  const words = normalize(text);
  if (!words.length) {
    return { isProfane: false, matches: [] };
  }
  const list = Array.isArray(customList) && customList.length
    ? customList
    : DEFAULT_PROFANITY_LIST;

  const set = new Set(words);
  const matches = list.filter((w) => set.has(w));

  return {
    isProfane: matches.length > 0,
    matches,
  };
}

