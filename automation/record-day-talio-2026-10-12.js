"use strict";

const fs = require("node:fs/promises");
const path = require("node:path");
const batchId = "talio-suivi-2026-10-12";

async function main() {
  const dataDir = process.env.TRAJECTOIRE_DATA_DIR;
  if (!dataDir) throw new Error("TRAJECTOIRE_DATA_DIR requis");
  const base = path.resolve(dataDir);
  const target = path.join(base, "taches", "2026-10-12.json");
  const talio = JSON.parse(await fs.readFile(path.join(base, "cibles", "talio.json"), "utf8"));
  if (talio.preuve?.message_id !== "1a1309857f902641") throw new Error("Preuve Talio manquante ; aucune écriture");
  const stat = await fs.stat(target);
  const before = await fs.readFile(target, "utf8");
  const current = JSON.parse(before);
  if (!Array.isArray(current.items) || current.items.some(x => x.batch_id === batchId)) throw new Error("Lot Talio déjà présent ; aucune écriture");
  const next = {
    ...current,
    items: [...current.items, {
      texte: "Talio : clarifications demandées sur les missions et le contrat",
      detail: "Profil admis et validé le 25/09, sans proposition ni contrat à ce jour. Email envoyé et vérifié le 12/10 à talent@taliotalent.com sur le calendrier, le statut salarié/prestation, la rémunération et le télétravail depuis le Maroc. Suivi dans Réseau ; réponse à vérifier le 19/10.",
      fait: true,
      responsable: "agent",
      batch_id: batchId
    }],
    maj: new Date().toISOString()
  };
  const backupDir = path.join(base, ".backups", batchId);
  await fs.mkdir(backupDir, { recursive: false, mode: 0o700 });
  await fs.writeFile(path.join(backupDir, "2026-10-12.json"), before, { mode: 0o600, flag: "wx" });
  if (await fs.readFile(target, "utf8") !== before) throw new Error("Écriture concurrente ; aucune écriture");
  const temporary = `${target}.${process.pid}.tmp`;
  await fs.writeFile(temporary, JSON.stringify(next, null, 2) + "\n", { mode: 0o600, flag: "wx" });
  await fs.chown(temporary, stat.uid, stat.gid);
  await fs.chmod(temporary, stat.mode & 0o777);
  await fs.rename(temporary, target);
  console.log(JSON.stringify({ recorded: batchId, done: next.items.filter(x => x.fait).length }));
}

main().catch(error => { console.error(error.message); process.exitCode = 1; });
