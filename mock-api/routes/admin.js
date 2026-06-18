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

function writeDb(db) {
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
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

router.put("/users/:id/role", authMiddleware, requireAdmin, (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  if (!["user", "admin"].includes(role)) {
    return res.status(400).json({
      message: "Role inválida. Usa apenas 'user' ou 'admin'."
    });
  }

  const db = readDb();

  const targetUser = db.users.find((user) => user.id === id);

  if (!targetUser) {
    return res.status(404).json({
      message: "Utilizador não encontrado."
    });
  }

  if (targetUser.id === req.user.id && role !== "admin") {
    return res.status(400).json({
      message: "Não podes remover o teu próprio acesso de administrador."
    });
  }

  targetUser.role = role;

  writeDb(db);

  res.json({
    message: "Role atualizada com sucesso.",
    user: {
      id: targetUser.id,
      name: targetUser.name,
      email: targetUser.email,
      role: targetUser.role,
      createdAt: targetUser.createdAt || null
    }
  });
});

export default router;