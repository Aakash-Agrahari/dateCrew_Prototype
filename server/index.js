import "dotenv/config";
import express from "express";
import cors from "cors";
import { clients, profiles, rejections } from "./data.js";
import { checkProfile } from "./checker.js";
import { parseFeedback, ruleParse, enrich } from "./parser.js";

const app = express();
app.use(cors(), express.json());
const find = (arr, id) => arr.find((x) => x.id === id);

app.get("/api/data", (_, res) => res.json({ clients, profiles }));

app.post("/api/check", (req, res) => {
  const { clientId, profileId } = req.body;
  const violations = checkProfile(find(clients, clientId).prefs, find(profiles, profileId));
  res.json({ ok: violations.length === 0, violations });
});

app.post("/api/feedback", async (req, res) => {
  const { clientId, profileId, text } = req.body;
  res.json(await parseFeedback(text, find(clients, clientId), find(profiles, profileId)));
});

app.get("/api/insights", (_, res) => {
  const rows = rejections.map((r) => ({ ...r, ...enrich(ruleParse(r.text), find(clients, r.clientId), find(profiles, r.profileId)) }));
  const counts = {};
  rows.forEach((r) => r.reasons.forEach((x) => (counts[x] = (counts[x] || 0) + 1)));
  res.json({
    total: rows.length,
    preventablePct: Math.round((100 * rows.filter((r) => r.preventable).length) / rows.length),
    softPct: Math.round((100 * rows.filter((r) => r.soft).length) / rows.length),
    reasonCounts: Object.entries(counts).sort((a, b) => b[1] - a[1]),
    rows,
  });
});

app.listen(3001, () => console.log("API on http://localhost:3001"));
