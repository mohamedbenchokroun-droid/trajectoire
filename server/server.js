"use strict";

const http = require("node:http");
const fs = require("node:fs/promises");
const path = require("node:path");
const crypto = require("node:crypto");

const root = path.resolve(__dirname, "..");
const dataDir = path.resolve(process.env.TRAJECTOIRE_DATA_DIR || path.join(root, "data", "export"));
const host = process.env.TRAJECTOIRE_HOST || "127.0.0.1";
const port = Number(process.env.TRAJECTOIRE_PORT || 8096);
const allowed = new Set(["offres", "cibles", "taches", "profil"]);
const idPattern = /^[a-z0-9][a-z0-9_-]{0,79}$/i;
const writes = new Map();
const username = process.env.TRAJECTOIRE_USERNAME;
const password = process.env.TRAJECTOIRE_PASSWORD;
if (!username || !password || password.length < 20) throw new Error("Identifiants Trajectoire manquants ou trop courts");

function authorized(req) {
  if (!req.headers.authorization?.startsWith("Basic ")) return false;
  let supplied;
  try { supplied = Buffer.from(req.headers.authorization.slice(6), "base64").toString("utf8"); }
  catch { return false; }
  const expected = Buffer.from(username + ":" + password);
  const actual = Buffer.from(supplied);
  return actual.length === expected.length && crypto.timingSafeEqual(actual, expected);
}

function respond(res, status, body, contentType = "application/json; charset=utf-8") {
  res.writeHead(status, {
    "Content-Type": contentType,
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "Referrer-Policy": "no-referrer"
  });
  res.end(typeof body === "string" || Buffer.isBuffer(body) ? body : JSON.stringify(body));
}

async function readDoc(collection, id) {
  try {
    return JSON.parse(await fs.readFile(path.join(dataDir, collection, id + ".json"), "utf8"));
  } catch (error) {
    if (error.code === "ENOENT") return null;
    throw error;
  }
}

async function readCollection(collection) {
  const directory = path.join(dataDir, collection);
  let names;
  try { names = await fs.readdir(directory); }
  catch (error) { if (error.code === "ENOENT") return {}; throw error; }
  const result = {};
  for (const name of names) {
    if (!name.endsWith(".json") || !idPattern.test(name.slice(0, -5))) continue;
    result[name.slice(0, -5)] = await readDoc(collection, name.slice(0, -5));
  }
  return result;
}

async function readBody(req) {
  let size = 0;
  const chunks = [];
  for await (const chunk of req) {
    size += chunk.length;
    if (size > 262144) throw Object.assign(new Error("Document trop volumineux"), { status: 413 });
    chunks.push(chunk);
  }
  try { return JSON.parse(Buffer.concat(chunks).toString("utf8")); }
  catch { throw Object.assign(new Error("JSON invalide"), { status: 400 }); }
}

async function patchDoc(collection, id, patch) {
  const key = collection + "/" + id;
  const previous = writes.get(key) || Promise.resolve();
  const task = previous.catch(() => {}).then(async () => {
    const file = path.join(dataDir, collection, id + ".json");
    const current = await readDoc(collection, id) || {};
    const next = { ...current };
    for (const [field, value] of Object.entries(patch)) {
      if (field === "__proto__" || field === "constructor" || field === "prototype") continue;
      if (value && typeof value === "object" && !Array.isArray(value) && value.__delete__ === true) delete next[field];
      else next[field] = value;
    }
    await fs.mkdir(path.dirname(file), { recursive: true });
    const temporary = file + "." + process.pid + ".tmp";
    await fs.writeFile(temporary, JSON.stringify(next, null, 2) + "\n", { mode: 0o600 });
    await fs.rename(temporary, file);
  });
  writes.set(key, task);
  try { await task; } finally { if (writes.get(key) === task) writes.delete(key); }
}

async function handle(req, res) {
  if (!authorized(req)) {
    res.writeHead(401, {
      "WWW-Authenticate": 'Basic realm="Trajectoire", charset="UTF-8"',
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff"
    });
    return res.end("Accès privé");
  }
  const url = new URL(req.url, "http://localhost");
  if (req.method === "GET" && (url.pathname === "/" || url.pathname === "/index.html")) {
    return respond(res, 200, await fs.readFile(path.join(root, "cockpit", "trajectoire.html")), "text/html; charset=utf-8");
  }
  if (req.method === "GET" && url.pathname === "/db-adapter.js") {
    return respond(res, 200, await fs.readFile(path.join(root, "cockpit", "db-adapter.js")), "text/javascript; charset=utf-8");
  }
  if (req.method === "GET" && url.pathname === "/api/state") {
    const state = {};
    for (const collection of allowed) state[collection] = await readCollection(collection);
    return respond(res, 200, state);
  }
  const match = /^\/api\/([^/]+)\/([^/]+)$/.exec(url.pathname);
  if (req.method === "PATCH" && match) {
    const [, collection, id] = match;
    if (!allowed.has(collection) || !idPattern.test(id)) return respond(res, 404, { error: "Document inconnu" });
    if (req.headers["content-type"]?.split(";")[0] !== "application/json") return respond(res, 415, { error: "JSON requis" });
    const patch = await readBody(req);
    if (!patch || typeof patch !== "object" || Array.isArray(patch)) return respond(res, 400, { error: "Objet requis" });
    await patchDoc(collection, id, patch);
    return respond(res, 200, { ok: true });
  }
  return respond(res, 404, { error: "Introuvable" });
}

http.createServer((req, res) => {
  handle(req, res).catch(error => {
    console.error(error);
    if (!res.headersSent) respond(res, error.status || 500, { error: error.status ? error.message : "Erreur serveur" });
  });
}).listen(port, host, () => console.log(`Trajectoire prêt sur ${host}:${port}`));
