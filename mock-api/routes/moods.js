import express from "express";
import crypto from "crypto";
import { readDB, writeDB } from "../utils/db.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

/* -----------------------------------------
   GET ALL MOODS (user-specific)
----------------------------------------- */
router.get("/", authMiddleware, (req, res) => {
  const db = readDB();
  if (!db.moods) db.moods = [];

  const moods = db.moods.filter(m => m.userId === req.user.id);
  res.json(moods);
});

/* -----------------------------------------
   CREATE MOOD ENTRY
----------------------------------------- */
router.post("/", authMiddleware, (req, res) => {
  const db = readDB();
  if (!db.moods) db.moods = [];

  const newMood = {
    id: crypto.randomUUID(),
    userId: req.user.id,
    mood: req.body.mood,
    score: req.body.score,
    message: req.body.message || "",
    date: new Date().toISOString()
  };

  db.moods.push(newMood);
  writeDB(db);

  res.json(newMood);
});

/* -----------------------------------------
   UPDATE MOOD ENTRY
----------------------------------------- */
router.put("/:id", authMiddleware, (req, res) => {
  const db = readDB();
  if (!db.moods) db.moods = [];

  const mood = db.moods.find(m => m.id === req.params.id && m.userId === req.user.id);

  if (!mood) return res.status(404).json({ message: "Mood not found" });

  Object.assign(mood, req.body);
  writeDB(db);

  res.json(mood);
});

/* -----------------------------------------
   DELETE MOOD ENTRY
----------------------------------------- */
router.delete("/:id", authMiddleware, (req, res) => {
  const db = readDB();
  if (!db.moods) db.moods = [];

  const before = db.moods.length;

  db.moods = db.moods.filter(m => !(m.id === req.params.id && m.userId === req.user.id));

  if (db.moods.length === before)
    return res.status(404).json({ message: "Mood not found" });

  writeDB(db);
  res.json({ success: true });
});

/* -----------------------------------------
   STATS: average, best day, correlation
----------------------------------------- */
router.get("/stats", authMiddleware, (req, res) => {
  const db = readDB();
  const moods = db.moods?.filter(m => m.userId === req.user.id) || [];

  if (moods.length === 0) {
    return res.json({
      average: 0,
      bestDay: null,
      correlation: 0
    });
  }

  // Average
  const average = moods.reduce((sum, m) => sum + m.score, 0) / moods.length;

  // Best day of week
  const dayScores = {};
  moods.forEach(m => {
    const day = new Date(m.date).toLocaleDateString("en-US", { weekday: "long" });
    if (!dayScores[day]) dayScores[day] = [];
    dayScores[day].push(m.score);
  });

  const bestDay = Object.entries(dayScores)
    .map(([day, scores]) => ({
      day,
      avg: scores.reduce((a, b) => a + b) / scores.length
    }))
    .sort((a, b) => b.avg - a.avg)[0].day;

  // Correlation (score vs time)
  const scores = moods.map(m => m.score);
  const x = moods.map((_, i) => i + 1);

  const meanX = x.reduce((a, b) => a + b) / x.length;
  const meanY = scores.reduce((a, b) => a + b) / scores.length;

  const numerator = x.reduce((sum, xi, i) => sum + (xi - meanX) * (scores[i] - meanY), 0);
  const denominator = Math.sqrt(
    x.reduce((sum, xi) => sum + (xi - meanX) ** 2, 0) *
    scores.reduce((sum, yi) => sum + (yi - meanY) ** 2, 0)
  );

  const correlation = denominator === 0 ? 0 : numerator / denominator;

  res.json({
    average: Number(average.toFixed(2)),
    bestDay,
    correlation: Number(correlation.toFixed(2))
  });
});

/* -----------------------------------------
   CHART DATA: weekly averages
----------------------------------------- */
router.get("/chart", authMiddleware, (req, res) => {
  const db = readDB();
  const moods = db.moods?.filter(m => m.userId === req.user.id) || [];

  const week = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const result = week.map(day => ({ day, avg: 0 }));

  const grouped = {};

  moods.forEach(m => {
    const day = new Date(m.date).toLocaleDateString("en-US", { weekday: "short" });
    if (!grouped[day]) grouped[day] = [];
    grouped[day].push(m.score);
  });

  result.forEach(r => {
    if (grouped[r.day]) {
      r.avg = grouped[r.day].reduce((a, b) => a + b) / grouped[r.day].length;
    }
  });

  res.json(result);
});

export default router;
