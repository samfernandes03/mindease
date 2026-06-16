import fs from "fs";
import path from "path";

const DB_PATH = path.join(process.cwd(), "db.json");

export function readDB() {
  return JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
}

export function writeDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}
