function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n));
}

function tokenize(text) {
  return (text || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s#+.-]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

const DEFAULT_TECH_KEYWORDS = [
  "javascript",
  "typescript",
  "react",
  "redux",
  "node",
  "express",
  "mongodb",
  "mongoose",
  "firebase",
  "vite",
  "tailwind",
  "api",
  "rest",
  "graphql",
  "sql",
  "jwt",
  "oauth",
  "razorpay",
  "webhook",
  "cache",
  "docker",
  "kubernetes",
  "testing",
  "jest",
  "cicd",
  "deployment",
  "security",
  "performance",
  "optimization",
  "accessibility",
];

function detectTechKeywordHits(allTokens) {
  const tokenSet = new Set(allTokens);
  const hits = [];
  for (const kw of DEFAULT_TECH_KEYWORDS) {
    if (tokenSet.has(kw)) hits.push(kw);
  }
  return hits;
}

function detectStructure(text) {
  const t = (text || "").toLowerCase();
  const hasLabels =
    /(^|\n|\s)(situation|task|action|result)\s*[:\-]/i.test(text || "");
  const hasSequence =
    (t.includes("situation") && t.includes("task") && t.includes("action")) ||
    (t.includes("task") && t.includes("action") && t.includes("result"));
  const hasBullets = /(^|\n)\s*[-•*]\s+\S+/.test(text || "");
  return {
    hasStar: hasLabels || hasSequence,
    hasBullets,
  };
}

function scoreAnswerLength(avgWords) {
  // tuned for interview answers: too short hurts, overly long doesn't add much
  if (avgWords <= 20) return 5;
  if (avgWords <= 40) return 12;
  if (avgWords <= 80) return 22;
  if (avgWords <= 140) return 28;
  return 24;
}

export function computeATSScore(answers) {
  const texts = (Array.isArray(answers) ? answers : [])
    .map((a) => (a || "").trim())
    .filter(Boolean);

  const joined = texts.join("\n\n");
  const tokens = tokenize(joined);
  const totalWords = tokens.length || 1;

  const techHits = detectTechKeywordHits(tokens);
  const keywordDensity = techHits.length / Math.max(1, new Set(tokens).size);

  const avgWords = texts.length
    ? texts.reduce((sum, t) => sum + tokenize(t).length, 0) / texts.length
    : 0;

  const structure = detectStructure(joined);

  // Breakdowns (0-100 overall, sub-scores are normalized)
  const keywordScoreRaw = clamp(techHits.length * 2, 0, 40); // up to 20 unique hits -> 40
  const densityBonus = clamp(Math.round(keywordDensity * 60), 0, 10); // small bonus
  const keywordScore = clamp(keywordScoreRaw + densityBonus, 0, 45);

  const structureScore = clamp((structure.hasStar ? 20 : 0) + (structure.hasBullets ? 10 : 0), 0, 30);

  const clarityScore = clamp(scoreAnswerLength(avgWords), 0, 30);

  const overall = clamp(Math.round(((keywordScore / 45) * 40) + ((clarityScore / 30) * 30) + ((structureScore / 30) * 30)), 0, 100);

  let label = "Needs major improvement";
  if (overall >= 85) label = "Excellent resume optimization";
  else if (overall >= 70) label = "Strong ATS alignment";
  else if (overall >= 50) label = "Moderate ATS compatibility";

  const suggestions = [];
  if (keywordScore < 22) suggestions.push("Add more role-relevant technical keywords naturally in your answers.");
  if (structureScore < 15) suggestions.push("Use a structured format (STAR) for behavioral questions.");
  if (clarityScore < 15) suggestions.push("Aim for clearer, slightly longer answers with concrete examples.");
  if (!suggestions.length) suggestions.push("Keep answers structured and keyword-rich while staying concise.");

  return {
    overall,
    label,
    breakdown: {
      keywordMatchScore: clamp(Math.round((keywordScore / 45) * 100), 0, 100),
      clarityScore: clamp(Math.round((clarityScore / 30) * 100), 0, 100),
      structureScore: clamp(Math.round((structureScore / 30) * 100), 0, 100),
      keywordHits: techHits,
      avgWords: Math.round(avgWords),
    },
    suggestions,
  };
}

