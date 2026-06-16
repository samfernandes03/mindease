import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);

app.get("/", (req, res) => {
  res.json({ message: "MindEase Mock API running" });
});

app.listen(PORT, () => {
  console.log(`Mock API running on http://localhost:${PORT}`);
});
