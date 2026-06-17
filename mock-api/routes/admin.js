import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, "../db.json");

function readDb() {
  const data = fs.readFileSync(dbPath, "utf-8");
  return JSON.parse(data);
}

function requireAdmin(req, res, next) {
  const db = readDb();
  const user = db.users.find((item) => item.id === req.user.id);

  if (!user || user.role !== "admin") {
    return res.status(403).json({
      message: "Acesso negado. Apenas administradores podem aceder."
    });
  }

  next();
}

router.get("/overview", authMiddleware, requireAdmin, (req, res) => {
  const db = readDb();

  const users = db.users.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role || "user",
    createdAt: user.createdAt || null
  }));

  const tasks = db.tasks || [];

  res.json({
    users,
    tasks
  });
});

export default router;