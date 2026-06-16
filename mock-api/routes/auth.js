import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { readDB, writeDB } from "../utils/db.js";
import { v4 as uuid } from "uuid";

const router = express.Router();
const JWT_SECRET = "super-secret-mindease"; // em real seria env

// POST /auth/register
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ message: "Missing fields" });

  const db = readDB();
  const existing = db.users.find(u => u.email === email);

  if (existing)
    return res.status(409).json({ message: "Email already registered" });

  const hashed = await bcrypt.hash(password, 10);

  const newUser = {
    id: uuid(),
    name,
    email,
    password: hashed,
    photo: null,
    preferences: {
      notifications: true,
      breakReminders: true
    },
    createdAt: new Date().toISOString()
  };

  db.users.push(newUser);
  writeDB(db);

  return res.status(201).json({ message: "User created" });
});

// POST /auth/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "Missing fields" });

  const db = readDB();
  const user = db.users.find(u => u.email === email);

  if (!user)
    return res.status(401).json({ message: "Invalid credentials" });

  const match = await bcrypt.compare(password, user.password);
  if (!match)
    return res.status(401).json({ message: "Invalid credentials" });

  const token = jwt.sign(
    { id: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: "1h" }
  );

  return res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      photo: user.photo,
      preferences: user.preferences
    }
  });
});

export default router;
