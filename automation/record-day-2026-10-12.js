"use strict";

const fs = require("node:fs/promises");
const path = require("node:path");

async function main() {
  const dataDir = process.env.TRAJECTOIRE_DATA_DIR;
  if (!dataDir) throw new Error("TRAJECTOIRE_DATA_DIR requis");
  const file = path.join(path.resolve(dataDir), "taches", "2026-10-12.json");
  const stat = await fs.stat(file);
  const before = await fs.readFile(file, "utf8");
  const current = JSON.parse(before);
  const items = structuredClone(current.items || []);
  if (items.some(x => x.batch_id === "reprise-2026-10-12")) throw new Error("Journée déjà enregistrée");
  const uir = items.find(x => x.texte === "UIR : revoir les deux candidatures encore ouvertes");
  const checks = items.find(x => x.texte === "Relances : contrôle des réponses avant tout lot");
  if (!uir || !checks) throw new Error("Tâches du jour modifiées ; aucune écriture");
  uir.fait = true;
  uir.detail = "Gmail relu le 12/10 : un refus UIR (Communication santé), deux candidatures encore sans réponse. L'accusé UIR indique qu'une absence de réponse à un mois vaut dossier non retenu ; pas de nouvelle relance aujourd'hui. NOVEC : pas de réponse reçue, pas de nouvel envoi.";
  checks.fait = true;
  checks.detail = "Gmail relu le 12/10 ; NTU relancé une seule fois dans le fil d'origine pour deux postes, message SENT 1a12ffe13a750d1f. Aucun envoi à G4S, NOVEC ou UIR aujourd'hui ; Edvantis à revoir le 14/10.";
  items.push({
    texte: "CVthèque : cinq CV corrigés et publiés",
    detail: "PDF Communication, Sales, Transformation digitale, EN et Design graphique corrigés, vérifiés visuellement et accessibles d'un clic dans le cockpit. Historique d'envoi Edvantis préservé.",
    fait: true,
    responsable: "agent",
    batch_id: "reprise-2026-10-12"
  });
  items.push({
    texte: "NTU : relance unique envoyée pour les deux postes",
    detail: "Gmail SENT du 12/10, même fil que la candidature du 29/09 ; preuve et prochaine vérification du 19/10 sur chaque fiche NTU.",
    fait: true,
    responsable: "agent",
    batch_id: "reprise-2026-10-12"
  });
  const next = { ...current, items, maj: new Date().toISOString() };
  const backupDir = path.join(path.resolve(dataDir), ".backups", "jour-2026-10-12");
  await fs.mkdir(backupDir, { recursive: false, mode: 0o700 });
  await fs.writeFile(path.join(backupDir, "2026-10-12.json"), before, { mode: 0o600, flag: "wx" });
  if (await fs.readFile(file, "utf8") !== before) throw new Error("Écriture concurrente ; journée non modifiée");
  const temporary = file + "." + process.pid + ".tmp";
  await fs.writeFile(temporary, JSON.stringify(next, null, 2) + "\n", { mode: 0o600, flag: "wx" });
  await fs.chown(temporary, stat.uid, stat.gid);
  await fs.chmod(temporary, stat.mode & 0o777);
  await fs.rename(temporary, file);
  console.log(JSON.stringify({ date: "2026-10-12", faits: items.filter(x => x.fait).length, restants: items.filter(x => !x.fait).length, backupDir }));
}

main().catch(error => { console.error(error.message); process.exitCode = 1; });
