import express from "express";
import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = Number(process.env.PORT || 4173);
const dataDir = join(__dirname, "data");
const dbPath = join(dataDir, "exam-state.json");
const distDir = join(__dirname, "dist");

const defaultState = {
  banks: [],
  activeBankId: null,
  records: [],
  wrongBook: {},
  updatedAt: null
};

function ensureDatabase() {
  if (!existsSync(dataDir)) mkdirSync(dataDir, { recursive: true });
  if (!existsSync(dbPath)) {
    writeFileSync(dbPath, JSON.stringify(defaultState, null, 2), "utf8");
  }
}

function readState() {
  ensureDatabase();
  try {
    return { ...defaultState, ...JSON.parse(readFileSync(dbPath, "utf8")) };
  } catch {
    const backupPath = join(dataDir, `exam-state-broken-${Date.now()}.json`);
    writeFileSync(backupPath, readFileSync(dbPath, "utf8"), "utf8");
    writeFileSync(dbPath, JSON.stringify(defaultState, null, 2), "utf8");
    return defaultState;
  }
}

function writeState(state) {
  ensureDatabase();
  const nextState = {
    banks: Array.isArray(state.banks) ? state.banks : [],
    activeBankId: state.activeBankId || null,
    records: Array.isArray(state.records) ? state.records : [],
    wrongBook: state.wrongBook && typeof state.wrongBook === "object" ? state.wrongBook : {},
    updatedAt: new Date().toISOString()
  };
  const tempPath = `${dbPath}.tmp`;
  writeFileSync(tempPath, JSON.stringify(nextState, null, 2), "utf8");
  renameSync(tempPath, dbPath);
  return nextState;
}

app.use(express.json({ limit: "20mb" }));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, dbPath });
});

app.get("/api/state", (_req, res) => {
  res.json(readState());
});

app.put("/api/state", (req, res) => {
  res.json(writeState(req.body || {}));
});

function sendAppHtml(res) {
  const html = readFileSync(join(distDir, "index.html"), "utf8")
    .replace(/\s+type="module"/g, " defer")
    .replace(/\s+crossorigin/g, "")
    .replace(
      '<div id="root"></div>',
      '<div id="root"><div style="padding: 32px; font-family: -apple-system, BlinkMacSystemFont, Microsoft YaHei, sans-serif; color: #334155;">正在加载个人模拟考试系统...</div></div>'
    );
  res.type("html").send(html);
}

app.use(express.static(distDir, { index: false }));

app.get(/.*/, (_req, res) => {
  sendAppHtml(res);
});

app.listen(port, "127.0.0.1", () => {
  ensureDatabase();
  console.log(`Personal Exam System: http://127.0.0.1:${port}/`);
  console.log(`Database file: ${dbPath}`);
});
