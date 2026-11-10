"use strict";

// Mise à jour ciblée et sauvegardée du suivi, jamais un outil d'envoi.
// Arrêter le service pendant l'application du lot pour éviter les écritures concurrentes.
const fs = require("node:fs/promises");
const path = require("node:path");
const { sent, proofs, date, exclusion } = require("../cockpit/suivi.js");
const idPattern = /^[a-z0-9][a-z0-9_-]{0,79}$/i;
const fields = new Set(["statut", "cv", "qui", "action_date", "action", "blocage", "offre_verifiee_le", "date_limite", "reference_offre", "source_verifiee", "salaire", "risques", "comment", "message"]);

function validate(batch) {
  if (!batch || !idPattern.test(batch.id) || !Array.isArray(batch.patches) || !batch.patches.length || batch.patches.length > 50) throw new Error("Lot invalide");
  const ids = new Set();
  for (const item of batch.patches) {
    if (!item || !idPattern.test(item.id) || ids.has(item.id) || !Array.isArray(item.expectedStatuses) || !item.expectedStatuses.length) throw new Error("Identifiant ou condition invalide");
    ids.add(item.id);
    if (!item.patch || typeof item.patch !== "object" || Array.isArray(item.patch)) throw new Error("Mise à jour invalide");
    for (const [key, value] of Object.entries(item.patch)) {
      if (!fields.has(key) || typeof value !== "string") throw new Error("Champ interdit : " + key);
      if (["action_date", "offre_verifiee_le", "date_limite"].includes(key) && !date(value)) throw new Error("Date invalide : " + key);
    }
    if (!["pret", "expire"].includes(item.patch.statut)) throw new Error("Un lot de préparation ne peut pas déclarer un envoi");
    if (item.patch.cv && !["sales", "com", "digital", "en", "design"].includes(item.patch.cv)) throw new Error("CV inconnu");
  }
}

async function applyBatch(dataDir, batch) {
  validate(batch);
  const plans = [], skipped = [];
  for (const item of batch.patches) {
    const file = path.join(path.resolve(dataDir), "offres", item.id + ".json");
    const before = await fs.readFile(file, "utf8");
    const current = JSON.parse(before);
    if (sent(current) || proofs(current).length || exclusion(current) || current.doublon_de || !item.expectedStatuses.includes(current.statut)) {
      skipped.push({ id: item.id, raison: "État actuel protégé" }); continue;
    }
    if ((current.historique || []).some(h => h.batch_id === batch.id)) {
      skipped.push({ id: item.id, raison: "Lot déjà appliqué" }); continue;
    }
    const le = new Date().toISOString();
    const h = { action: item.patch.statut === "pret" ? "prepare" : "verification", le, par: "agent", batch_id: batch.id, notes: item.patch.statut === "pret" ? "Candidature préparée ; aucun envoi effectué." : "Offre expirée vérifiée ; aucun envoi effectué." };
    plans.push({ id: item.id, file, before, next: { ...current, ...item.patch, maj: le, historique: [...(current.historique || []), h] } });
  }
  let backup = null;
  if (plans.length) {
    const parent = path.join(path.resolve(dataDir), ".backups");
    await fs.mkdir(parent, { recursive: true, mode: 0o700 });
    backup = await fs.mkdtemp(path.join(parent, batch.id + "-"));
    for (const plan of plans) await fs.writeFile(path.join(backup, plan.id + ".json"), plan.before, { mode: 0o600 });
    for (const plan of plans) {
      if (await fs.readFile(plan.file, "utf8") !== plan.before) throw new Error("Modification concurrente : " + plan.id + "; sauvegarde : " + backup);
      const temporary = plan.file + "." + process.pid + ".batch.tmp";
      await fs.writeFile(temporary, JSON.stringify(plan.next, null, 2) + "\n", { mode: 0o600, flag: "wx" });
      await fs.rename(temporary, plan.file);
    }
  }
  return { applied: plans.map(p => p.id), skipped, backup };
}

if (require.main === module) {
  (async () => {
    const dataDir = process.env.TRAJECTOIRE_DATA_DIR;
    if (!dataDir) throw new Error("TRAJECTOIRE_DATA_DIR requis");
    let input = "";
    for await (const chunk of process.stdin) {
      input += chunk;
      if (Buffer.byteLength(input) > 262144) throw new Error("Lot trop volumineux");
    }
    console.log(JSON.stringify(await applyBatch(dataDir, JSON.parse(input))));
  })().catch(error => { console.error(error.message); process.exitCode = 1; });
}
module.exports = { applyBatch, validate };
