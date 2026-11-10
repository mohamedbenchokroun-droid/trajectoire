"use strict";
const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const os = require("node:os");
const path = require("node:path");
const { applyBatch, validate } = require("./apply-batch.js");

test("un lot sauvegarde les données, conserve l’historique et ne déclare aucun envoi", async t => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), "trajectoire-batch-"));
  t.after(() => fs.rm(directory, { recursive: true, force: true }));
  await fs.mkdir(path.join(directory, "offres"));
  const current = { statut: "a_postuler", note: "À conserver", historique: [{ action: "analyse" }] };
  const file = path.join(directory, "offres", "essai.json");
  await fs.writeFile(file, JSON.stringify(current));
  const batch = { id: "lot-essai", patches: [{ id: "essai", expectedStatuses: ["a_postuler", "pret"], patch: { statut: "pret", action_date: "2026-10-01", message: "Brouillon" } }] };
  const result = await applyBatch(directory, batch);
  assert.deepEqual(result.applied, ["essai"]);
  assert.deepEqual(JSON.parse(await fs.readFile(path.join(result.backup, "essai.json"), "utf8")), current);
  const updated = JSON.parse(await fs.readFile(file, "utf8"));
  assert.equal(updated.note, current.note);
  assert.equal(updated.historique.length, 2);
  assert.equal(updated.historique[1].action, "prepare");
  assert.equal(updated.date_postule, undefined);
  assert.deepEqual((await applyBatch(directory, batch)).applied, []);
});

test("un envoi récent ou une exclusion ne sont jamais écrasés", async t => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), "trajectoire-protection-"));
  t.after(() => fs.rm(directory, { recursive: true, force: true }));
  await fs.mkdir(path.join(directory, "offres"));
  const records = { envoye: { statut: "postule", date_postule: "2026-09-30" }, exclu: { statut: "a_postuler", entreprise: "Sofrecom Maroc" }, preuve: { statut: "a_postuler", preuves: [{ type: "confirmation", verifiee: true, le: "2026-09-30" }] } };
  for (const [id, value] of Object.entries(records)) await fs.writeFile(path.join(directory, "offres", id + ".json"), JSON.stringify(value));
  const batch = { id: "lot-protection", patches: Object.keys(records).map(id => ({ id, expectedStatuses: ["a_postuler", "postule"], patch: { statut: "pret" } })) };
  assert.deepEqual((await applyBatch(directory, batch)).applied, []);
  for (const [id, value] of Object.entries(records)) assert.deepEqual(JSON.parse(await fs.readFile(path.join(directory, "offres", id + ".json"), "utf8")), value);
});

test("le lot rejette traversée de chemin, champ historique et statut envoyé", () => {
  const batch = (id, patch) => ({ id: "lot-validation", patches: [{ id, expectedStatuses: ["a_postuler"], patch }] });
  assert.throws(() => validate(batch("../secret", { statut: "pret" })));
  assert.throws(() => validate(batch("essai", { statut: "pret", historique: [] })));
  assert.throws(() => validate(batch("essai", { statut: "postule" })));
  assert.throws(() => validate(batch("essai", { statut: "pret", action_date: "2026-02-30" })));
});
