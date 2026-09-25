import "dotenv/config";
import express from "express";
import cors from "cors";

import { clients, profiles, rejections } from "../server/data.js";
import { checkProfile } from "../server/checker.js";
import { parseFeedback, ruleParse, enrich } from "../server/parser.js";

const app = express();

app.use(cors());
app.use(express.json());

const find = (arr, id) => arr.find((x) => x.id === id);

app.get("/api/data", (_, res) => {
  res.json({ clients, profiles });
});

app.post("/api/check", (req, res) => {
  const { clientId, profileId } = req.body;

  const client = find(clients, clientId);
  const profile = find(profiles, profileId);

  if (!client || !profile) {
    return res.status(404).json({
      error: "Client or profile not found",
    });
  }

  const violations = checkProfile(client.prefs, profile);

  res.json({
    ok: violations.length === 0,
    violations,
  });
});

app.post("/api/feedback", async (req, res) => {
  try {
    const { clientId, profileId, text } = req.body;

    const client = find(clients, clientId);
    const profile = find(profiles, profileId);

    if (!client || !profile) {
      return res.status(404).json({
        error: "Client or profile not found",
      });
    }

    const result = await parseFeedback(
      text,
      client,
      profile
    );

    res.json(result);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to parse feedback",
    });
  }
});

app.get("/api/insights", (_, res) => {
  const rows = rejections.map((r) => ({
    ...r,
    ...enrich(
      ruleParse(r.text),
      find(clients, r.clientId),
      find(profiles, r.profileId)
    ),
  }));

  const counts = {};

  rows.forEach((r) => {
    r.reasons.forEach((reason) => {
      counts[reason] = (counts[reason] || 0) + 1;
    });
  });

  res.json({
    total: rows.length,
    preventablePct: Math.round(
      (100 * rows.filter((r) => r.preventable).length) /
        rows.length
    ),
    softPct: Math.round(
      (100 * rows.filter((r) => r.soft).length) /
        rows.length
    ),
    reasonCounts: Object.entries(counts).sort(
      (a, b) => b[1] - a[1]
    ),
    rows,
  });
});

export default app;