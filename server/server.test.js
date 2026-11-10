"use strict";

const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const os = require("node:os");
const path = require("node:path");
const net = require("node:net");
const crypto = require("node:crypto");
const { spawn } = require("node:child_process");

const auth = "Basic " + Buffer.from("test:une-longue-cle-de-test-123456789").toString("base64");

test("site privé et données persistantes", async t => {
  const data = await fs.mkdtemp(path.join(os.tmpdir(), "trajectoire-test-"));
  t.after(() => fs.rm(data, { recursive: true, force: true }));
  await fs.mkdir(path.join(data, "offres"));
  await fs.writeFile(path.join(data, "offres", "essai.json"), JSON.stringify({ statut: "postule", secret: "ancienne note" }));
  const cvDir = path.join(data, "cv-files");
  await fs.mkdir(cvDir);
  await fs.writeFile(path.join(cvDir, "CV Mohamed Benchokroun Sales.pdf"), "%PDF-1.4\n%%EOF\n");
  await fs.writeFile(path.join(cvDir, "CV Mohamed Benchokroun Design Graphique.pdf"), "%PDF-1.4\n%%EOF\n");
  const archivePath = path.join(data, "passation.zip");
  await fs.writeFile(archivePath, "archive privée");
  const handoffToken = "a".repeat(64);

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
      TRAJECTOIRE_CV_DIR: cvDir,
      TRAJECTOIRE_HANDOFF_ARCHIVE: archivePath,
      TRAJECTOIRE_HANDOFF_TOKEN_HASH: crypto.createHash("sha256").update(handoffToken).digest("hex"),
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
  assert.equal((await fetch(url + "/passation/archive")).status, 401);
  assert.equal((await fetch(url + "/passation/" + "b".repeat(64))).status, 401);
  const redeemed = await fetch(url + "/passation/" + handoffToken, { redirect: "manual" });
  assert.equal(redeemed.status, 302);
  assert.equal(redeemed.headers.get("location"), "/passation");
  const cookie = redeemed.headers.get("set-cookie").split(";")[0];
  assert.match(redeemed.headers.get("set-cookie"), /HttpOnly; Secure; SameSite=Lax/);
  const handoffPage = await fetch(url + "/passation", { headers: { Cookie: cookie } });
  assert.equal(handoffPage.status, 200);
  assert.match(await handoffPage.text(), /Projet complet/);
  const archive = await fetch(url + "/passation/archive", { headers: { Cookie: cookie } });
  assert.equal(archive.status, 200);
  assert.equal(archive.headers.get("content-type"), "application/zip");
  assert.equal(await archive.text(), "archive privée");
  assert.equal((await fetch(url + "/api/state", { headers: { Cookie: cookie } })).status, 200);
  const page = await fetch(url, { headers: { Authorization: auth } });
  assert.equal(page.status, 200);
  assert.match(await page.text(), /db-adapter\.js/);
  assert.equal((await fetch(url + "/suivi.js")).status, 401);
  assert.equal((await fetch(url + "/cv/sales.pdf")).status, 401);
  assert.equal((await fetch(url + "/cv/inconnu.pdf", { headers: { Authorization: auth } })).status, 404);
  const pdf = await fetch(url + "/cv/sales.pdf", { headers: { Authorization: auth } });
  assert.equal(pdf.status, 200);
  assert.equal(pdf.headers.get("content-type"), "application/pdf");
  assert.equal(pdf.headers.get("content-disposition"), 'inline; filename="CV Mohamed Benchokroun Sales.pdf"');
  assert.match(await pdf.text(), /%PDF-1\.4/);
  const designPdf = await fetch(url + "/cv/design.pdf", { headers: { Authorization: auth } });
  assert.equal(designPdf.status, 200);
  assert.equal(designPdf.headers.get("content-disposition"), 'inline; filename="CV Mohamed Benchokroun Design Graphique.pdf"');
  assert.equal((await fetch(url + "/cv/com.pdf", { headers: { Authorization: auth } })).status, 404);
  const logic = await fetch(url + "/suivi.js", { headers: { Authorization: auth } });
  assert.equal(logic.status, 200);
  assert.match(await logic.text(), /trajectoireSuivi/);

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
