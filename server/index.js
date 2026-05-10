const path = require("path");

require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const Database = require("better-sqlite3");

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin";
const JWT_SECRET = process.env.JWT_SECRET || "dev-only-jwt-secret";

if (!process.env.JWT_SECRET) {
  console.warn(
    "[admin] JWT_SECRET is not set in .env; using a development default. Set JWT_SECRET for production."
  );
}

const dbPath = path.join(__dirname, "data.db");
const db = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now'))
  );
`);

const seedRows = db.prepare("SELECT COUNT(*) AS c FROM messages").get();
if (seedRows.c === 0) {
  const insert = db.prepare(
    "INSERT INTO messages (name, message) VALUES (?, ?)"
  );
  const seed = [
    ["Vezok", "Be happy baby 💍💋"],
    [
      "Fidan Nəcəfova",
      "Əziz Madina xanım, bu gözəl günün hər anı sizin üçün unudulmaz olsun! Yeni qurduğunuz yuvanızdan sevgi, bərəkət və gülüş heç vaxt əskik olmasın. Bir ömür boyu əl-ələ, xoşbəxt yaşamağınızı arzu edirəm. Təbriklər!",
    ],
    [
      "Gülşən Ayaz",
      "Mədinəm, bu gün sənin ən gözəl günündür. Arzu edirəm ki, üzündəki bu təbəssüm heç vaxt əskik olmasın. Ömür boyu əl-ələ, xoşbəxt yaşamağınızı diləyirəm.",
    ],
    [
      "KONUL TEACHER",
      "Əzizim Mədinə və Abdulla! Sizi bu gözəl və mənalı gün münasibətilə ürəkdən təbrik edirəm! Bu günü görmək mənim üçün də çox xüsusi və sevindiricidir. Sizi tanıyan bir müəllim kimi, həyatınızın bu yeni mərhələsinə addım atdığınızı görmək qürurverici və çox xoşdur. Həyat uzun bir yoldur — bu yolda ən vacibi bir-birinizə dayaq olmaq, anlayışlı və səbirli davranmaqdır. İnanıram ki, siz bunu bacaracaqsınız. Sevginiz sizi hər zaman qoruyacaq, ən çətin anlarda belə yol göstərəcək. Qoy evinizdən sevinc, gülüş və istilik heç vaxt əskik olmasın. Bir-birinizə hər zaman hörmətlə yanaşın, kiçik anların belə qədrini bilin. Unutmayın, xoşbəxtlik böyük şeylərdə deyil, birlikdə paylaşdığınız sadə anlarda gizlidir. Sizə ürəkdən xoşbəxt, uzun və mənalı bir ailə həyatı arzulayıram. Hər zaman üzünüz gülsün, yolunuz açıq olsun. Sizi sevən müəlliminiz 🤍 KONUL TEACHER",
    ],
    [
      "Гюнель",
      "Родная, с твоим счастливым днём! Желаю вам мира и счастья в доме. Пусть Аллах хранит ваш союз. Твоё счастье — моя радость💗🫶🏻",
    ],
  ];
  const runMany = db.transaction((rows) => {
    for (const [name, message] of rows) insert.run(name, message);
  });
  runMany(seed);
}

function requireAdmin(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const token = auth.slice("Bearer ".length).trim();
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: "Unauthorized" });
  }
}

const app = express();
app.use(cors());
app.use(express.json({ limit: "64kb" }));

app.get("/api/messages", (_req, res) => {
  try {
    const rows = db
      .prepare(
        "SELECT id, name, message, created_at FROM messages ORDER BY id DESC"
      )
      .all();
    res.json(rows);
  } catch {
    res.status(500).json({ error: "Failed to load messages" });
  }
});

app.post("/api/messages", (req, res) => {
  const name = typeof req.body?.name === "string" ? req.body.name.trim() : "";
  const message =
    typeof req.body?.message === "string" ? req.body.message.trim() : "";
  if (!name || !message) {
    return res.status(400).json({ error: "name and message are required" });
  }
  try {
    const insert = db.prepare(
      "INSERT INTO messages (name, message) VALUES (?, ?)"
    );
    const result = insert.run(name, message);
    const row = db
      .prepare(
        "SELECT id, name, message, created_at FROM messages WHERE id = ?"
      )
      .get(result.lastInsertRowid);
    res.status(201).json(row);
  } catch {
    res.status(500).json({ error: "Failed to save message" });
  }
});

app.post("/api/admin/login", (req, res) => {
  const username =
    typeof req.body?.username === "string" ? req.body.username.trim() : "";
  const password =
    typeof req.body?.password === "string" ? req.body.password : "";
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    const token = jwt.sign({ role: "admin" }, JWT_SECRET, { expiresIn: "8h" });
    return res.json({ token });
  }
  res.status(401).json({ error: "Invalid credentials" });
});

app.put("/api/admin/messages/:id", requireAdmin, (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({ error: "Invalid id" });
  }
  const name = typeof req.body?.name === "string" ? req.body.name.trim() : "";
  const message =
    typeof req.body?.message === "string" ? req.body.message.trim() : "";
  if (!name || !message) {
    return res.status(400).json({ error: "name and message are required" });
  }
  try {
    const info = db
      .prepare("UPDATE messages SET name = ?, message = ? WHERE id = ?")
      .run(name, message, id);
    if (info.changes === 0) {
      return res.status(404).json({ error: "Not found" });
    }
    const row = db
      .prepare(
        "SELECT id, name, message, created_at FROM messages WHERE id = ?"
      )
      .get(id);
    res.json(row);
  } catch {
    res.status(500).json({ error: "Failed to update message" });
  }
});

app.delete("/api/admin/messages/:id", requireAdmin, (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({ error: "Invalid id" });
  }
  try {
    const info = db.prepare("DELETE FROM messages WHERE id = ?").run(id);
    if (info.changes === 0) {
      return res.status(404).json({ error: "Not found" });
    }
    res.status(204).send();
  } catch {
    res.status(500).json({ error: "Failed to delete message" });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});
