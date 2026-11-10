"use strict";

const fs = require("node:fs/promises");
const path = require("node:path");

const batchId = "edvantis-refus-2026-10-14";
const receivedAt = "2026-10-14T14:53:01Z";
const proofUrl = "https://mail.google.com/mail/u/0/#all/1a13ae7159b3dc14";

async function main() {
  const base = process.env.TRAJECTOIRE_DATA_DIR;
  if (!base) throw new Error("TRAJECTOIRE_DATA_DIR requis");
  const file = path.join(path.resolve(base), "offres", "edvantis_design_graphique_9629675.json");
  const before = await fs.readFile(file, "utf8");
  const stat = await fs.stat(file);
  const offer = JSON.parse(before);
  if (!/Edvantis/i.test(offer.entreprise || "") || offer.statut !== "relance" ||
      (offer.historique || []).some(h => h.batch_id === batchId)) {
    throw new Error("Fiche Edvantis déjà modifiée ; aucune écriture");
  }
  const next = {
    ...offer,
    statut: "refus",
    derniere_action: "2026-10-14",
    action: "Réponse de la directrice d’Art’Com Rabat reçue le 14/10 : candidature non retenue pour le poste d’enseignant permanent. Le ministère exige un master directement lié au design graphique ou à l’architecture d’intérieur. Aucune nouvelle relance sur ce poste.",
    action_date: null,
    qui: "agent",
    action_planifiee: null,
    entreprise_info: `${offer.entreprise_info || ""} Réponse officielle Art’Com Rabat du 14/10 : recrutement permanent soumis à un master spécialisé directement aligné avec l’enseignement.`,
    preuves: [...(offer.preuves || []), {
      type: "reponse_refus",
      verifiee: true,
      le: receivedAt,
      label: "Email de Chaimae Khallouqi, directrice Art’Com Rabat, en copie à Zahia : expérience appréciée, mais diplôme non éligible pour un poste d’enseignant permanent.",
      url: proofUrl,
      reference: "Gmail 1a13ae7159b3dc14"
    }],
    historique: [...(offer.historique || []), {
      action: "refus",
      le: receivedAt,
      par: "recruteur",
      batch_id: batchId,
      notes: "Réponse de la directrice d’Art’Com Rabat : master spécialisé exigé par le ministère pour les enseignants permanents ; expérience professionnelle reconnue mais candidature non recevable. Aucune relance supplémentaire."
    }],
    maj: receivedAt
  };
  const backupDir = path.join(path.resolve(base), ".backups", batchId);
  await fs.mkdir(backupDir, { recursive: false, mode: 0o700 });
  await fs.writeFile(path.join(backupDir, path.basename(file)), before, { mode: 0o600, flag: "wx" });
  if (await fs.readFile(file, "utf8") !== before) throw new Error("Écriture concurrente ; aucune écriture");
  const tmp = `${file}.${process.pid}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(next, null, 2) + "\n", { mode: 0o600, flag: "wx" });
  await fs.chown(tmp, stat.uid, stat.gid);
  await fs.chmod(tmp, stat.mode & 0o777);
  await fs.rename(tmp, file);
  console.log(JSON.stringify({ recorded: "edvantis-refus", proofUrl, backupDir }));
}

main().catch(error => { console.error(error.message); process.exitCode = 1; });
