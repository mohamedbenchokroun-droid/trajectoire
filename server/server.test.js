"use strict";

const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const os = require("node:os");
const path = require("node:path");
const net = require("node:net");
const { spawn } = require("node:child_process");

const auth = "Basic " + Buffer.from("test:une-longue-cle-de-test-123456789").toString("base64");

test("site privé et données persistantes", async t => {
  const data = await fs.mkdtemp(path.join(os.tmpdir(), "trajectoire-test-"));
  t.after(() => fs.rm(data, { recursive: true, force: true }));
  await fs.mkdir(path.join(data, "offres"));
  await fs.writeFile(path.join(data, "offres", "essai.json"), JSON.stringify({ statut: "postule", secret: "ancienne note" }));

  const port = await new Promise((resolve, reject) => {
    const server = net.createServer();
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const value = server.address().port;
      server.close(() => resolve(value));
    });
  });
  const child = spawn(process.execPath, [path.join(__dirname, "server.js")], {
    env: {
      ...process.env,
      TRAJECTOIRE_HOST: "127.0.0.1",
      TRAJECTOIRE_PORT: String(port),
      TRAJECTOIRE_DATA_DIR: data,
      TRAJECTOIRE_USERNAME: "test",
      TRAJECTOIRE_PASSWORD: "une-longue-cle-de-test-123456789"
    },
    stdio: ["ignore", "pipe", "pipe"]
  });
  t.after(() => child.kill());
  await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error("Serveur non démarré")), 5000);
    child.stdout.once("data", () => { clearTimeout(timeout); resolve(); });
    child.once("exit", code => { clearTimeout(timeout); reject(new Error("Serveur arrêté : " + code)); });
  });

  const url = "http://127.0.0.1:" + port;
  assert.equal((await fetch(url)).status, 401);
  const page = await fetch(url, { headers: { Authorization: auth } });
  assert.equal(page.status, 200);
  assert.match(await page.text(), /db-adapter\.js/);

  const state = await fetch(url + "/api/state", { headers: { Authorization: auth } });
  assert.equal((await state.json()).offres.essai.statut, "postule");

  const patch = await fetch(url + "/api/offres/essai", {
    method: "PATCH",
    headers: { Authorization: auth, "Content-Type": "application/json" },
    body: JSON.stringify({ statut: "relance", secret: { __delete__: true } })
  });
  assert.equal(patch.status, 200);
  assert.deepEqual(JSON.parse(await fs.readFile(path.join(data, "offres", "essai.json"), "utf8")), { statut: "relance" });

  const blocked = await fetch(url + "/api/offres/..%2Fsecret", {
    method: "PATCH",
    headers: { Authorization: auth, "Content-Type": "application/json" },
    body: "{}"
  });
  assert.equal(blocked.status, 404);
});
