"use strict";

const fs = require("node:fs/promises");
const path = require("node:path");

const batchId = "linkedin-relances-2026-10-12";

async function main() {
  const dataDir = process.env.TRAJECTOIRE_DATA_DIR;
  if (!dataDir) throw new Error("TRAJECTOIRE_DATA_DIR requis");
  const file = path.join(path.resolve(dataDir), "taches", "2026-10-12.json");
  const stat = await fs.stat(file);
  const before = await fs.readFile(file, "utf8");
  const current = JSON.parse(before);
  if (!Array.isArray(current.items) || current.items.some(x => x.batch_id === batchId)) {
    throw new Error("Journée modifiée ou lot déjà enregistré ; aucune écriture");
  }
  for (const name of ["casanet", "ciments"]) {
    const offer = JSON.parse(await fs.readFile(path.join(path.resolve(dataDir), "offres", `${name}.json`), "utf8"));
    if (!(offer.preuves || []).some(p => p.verifiee && p.type === "message_linkedin_envoye" && p.le.startsWith("2026-10-12"))) {
      throw new Error(`Preuve LinkedIn manquante pour ${name} ; aucune écriture`);
    }
  }
  const next = {
    ...current,
    items: [
      ...current.items.map(item => item.texte === "Reprendre qualification LOCAMED et dossiers Hilti / ICESCO" ? {
        ...item,
        detail: "LOCAMED Sales Operations/CRM : annonces Bac+5, non prioritaire avec Bac+3 ; ne pas envoyer en force. Hilti 20527 : offre officielle toujours active, profil commercial compatible mais salaire non publié et parcours de dépôt CV à finaliser. ICESCO : vérifier les exigences détaillées avant le 25/10. Aucun envoi de ces trois dossiers ce jour."
      } : item),
      {
        texte: "Casanet et Ciments du Maroc : deux relances LinkedIn envoyées",
        detail: "Jennate Benlemmouden (Casanet) à 14:30 et Yousra Ragouby (Ciments du Maroc) à 14:35 le 12/10. Messages visibles, preuves sur les deux fiches ; prochaine vérification le 19/10, sans nouvelle relance automatique.",
        fait: true,
        responsable: "agent",
        batch_id: batchId
      },
      {
        texte: "Filtre des nouvelles offres : garder Hilti, écarter les écarts majeurs",
        detail: "Hilti Rabat 20527 confirmé actif le 12/10 : 2 ans de vente et permis, BTP souhaité, salaire non publié. Ericsson BOS Client Executive exige 10 M USD de ventes annuelles et réseau dirigeants télécom, hors preuve du profil ; LOCAMED Sales Ops/CRM exige Bac+5 ; aucune candidature présentée comme envoyée sur ces offres.",
        fait: true,
        responsable: "agent",
        batch_id: batchId
      }
    ],
    maj: new Date().toISOString()
  };
  const backupDir = path.join(path.resolve(dataDir), ".backups", batchId);
  await fs.mkdir(backupDir, { recursive: false, mode: 0o700 });
  await fs.writeFile(path.join(backupDir, "2026-10-12.json"), before, { mode: 0o600, flag: "wx" });
  if (await fs.readFile(file, "utf8") !== before) throw new Error("Écriture concurrente ; aucune écriture");
  const temporary = `${file}.${process.pid}.tmp`;
  await fs.writeFile(temporary, JSON.stringify(next, null, 2) + "\n", { mode: 0o600, flag: "wx" });
  await fs.chown(temporary, stat.uid, stat.gid);
  await fs.chmod(temporary, stat.mode & 0o777);
  await fs.rename(temporary, file);
  console.log(JSON.stringify({ recorded: batchId, done: next.items.filter(x => x.fait).length, remaining: next.items.filter(x => !x.fait).length }));
}

main().catch(error => { console.error(error.message); process.exitCode = 1; });
