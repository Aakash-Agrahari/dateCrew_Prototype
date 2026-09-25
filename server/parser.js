import { checkProfile } from "./checker.js";
export const CATEGORIES = ["age","height","religion","diet","smoking","kids","location","career","looks","family","other"];
const RULES = {
  age: /\b(old|older|young|younger|age)\b/i, height: /\b(short|tall|height)\b/i,
  religion: /religion|community|caste|faith|muslim|hindu|christian|sikh|jain/i,
  diet: /non-?veg|vegetarian|\bveg\b|eats? meat|diet/i, smoking: /smok|cigarette|vape/i,
  kids: /\bkids?\b|children|child/i, location: /relocat|city|location|lives in|abroad/i,
  career: /\bjob\b|salary|income|career|profession|earn/i, looks: /photo|looks|attractive|appearance|spark/i,
  family: /family|parents|joint|conservative/i,
};
const SOFT = /maybe|not sure|\?|spark|vibe|just (doesn't|does not)|feel/i;

export function ruleParse(text) {
  const reasons = Object.keys(RULES).filter((k) => RULES[k].test(text));
  return { reasons: reasons.length ? reasons : ["other"], soft: SOFT.test(text), source: "rules" };
}

async function llmParse(text) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return null;
  const model = process.env.GEMINI_MODEL || "gemini-3.5-flash-lite";
  try {
    const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
      method: "POST",
      headers: { "content-type": "application/json", "x-goog-api-key": key },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: `You classify a matrimonial client's free-text rejection of a profile. Reply with ONLY JSON: {"reasons": [..], "soft": boolean}. reasons must be from: ${CATEGORIES.join(", ")}. Only include a reason if it is the client's actual objection (ignore negated mentions like "height is fine"). soft=true if the client sounds unsure/vague/gut-feel rather than firm.` }] },
        contents: [{ role: "user", parts: [{ text }] }],
        generationConfig: { responseMimeType: "application/json", maxOutputTokens: 300, temperature: 0 },
      }),
    });
    const data = await r.json();
    const parsed = JSON.parse(data.candidates[0].content.parts[0].text.replace(/```json|```/g, "").trim());
    return { reasons: parsed.reasons.filter((x) => CATEGORIES.includes(x)), soft: !!parsed.soft, source: "gemini" };
  } catch { return null; }
}

// Key insight: was the rejection PREVENTABLE, i.e. did the profile break a stated preference?
export function enrich(parsed, client, profile) {
  const violations = checkProfile(client.prefs, profile);
  const violated = violations.map((v) => v.field);
  const preventable = parsed.reasons.some((r) => violated.includes(r));
  const newSignals = parsed.reasons.filter((r) => ["career", "looks", "family", "other"].includes(r));
  return { ...parsed, violations, preventable, newSignals };
}

export async function parseFeedback(text, client, profile) {
  const parsed = (await llmParse(text)) || ruleParse(text);
  return enrich(parsed, client, profile);
}
