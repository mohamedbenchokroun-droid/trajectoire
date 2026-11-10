"use strict";

const fs = require("node:fs/promises");
const path = require("node:path");

const batchId = "uir-rrei-refus-2026-10-15";
const receivedAt = "2026-10-14T18:35:14Z";
const proofUrl = "https://mail.google.com/mail/u/0/#all/1a13bb27d663baaa";

async function main() {
  const dataDir = process.env.TRAJECTOIRE_DATA_DIR;
  if (!dataDir) throw new Error("TRAJECTOIRE_DATA_DIR requis");
  const base = path.resolve(dataDir);
  const rreiPath = path.join(base, "offres", "uir_recrutement_international_2026.json");
  const ciePath = path.join(base, "offres", "uir_cie.json");
  const [rreiBefore, cieBefore, rreiStat, cieStat] = await Promise.all([
    fs.readFile(rreiPath, "utf8"), fs.readFile(ciePath, "utf8"), fs.stat(rreiPath), fs.stat(ciePath)
  ]);
  const rrei = JSON.parse(rreiBefore);
  const cie = JSON.parse(cieBefore);
  if (rrei.statut !== "postule" || !/Recrutement Étudiants Internationaux/i.test(rrei.poste || "") ||
      (rrei.historique || []).some(h => h.batch_id === batchId) || cie.statut !== "postule") {
    throw new Error("État UIR inattendu ; aucune écriture");
  }
  const nextRrei = {
    ...rrei,
    statut: "refus",
    derniere_action: "2026-10-14",
    action: "UIR : refus explicite reçu le 14/10 pour le poste RREI-0926. Dossier conservé par l'université pour d'éventuelles opportunités futures ; aucune relance sur ce poste.",
    action_date: null,
    action_planifiee: null,
    relance_preparee: { ...rrei.relance_preparee, statut: "annulee_refus", texte: "" },
    relance: { ...rrei.relance, statut: "annulee_refus", texte: "" },
    preuves: [...(rrei.preuves || []), {
      type: "reponse_refus", verifiee: true, le: receivedAt,
      label: "Gmail : candidature@uir.ac.ma, objet « Votre candidature sur le poste RREI-0926 » ; refus explicite après examen, dossier conservé.",
      url: proofUrl, reference: "RREI-0926"
    }],
    historique: [...(rrei.historique || []), {
      action: "refus", le: receivedAt, par: "recruteur", batch_id: batchId,
      notes: "Email UIR reçu pour RREI-0926. Ce refus ne concerne pas la candidature CIE 768, toujours en attente."
    }],
    maj: receivedAt
  };
  const nextCie = {
    ...cie,
    action: "Seule la candidature CIE 768 reste en attente à l’UIR. Refus reçus pour Communication et RREI-0926 ; ne pas envoyer l'ancien brouillon commun. Vérifier les réponses après le délai d'un mois annoncé dans l'accusé.",
    action_date: "2026-11-01",
    action_planifiee: {
      date: "2026-11-01", qui: "agent",
      texte: "Vérifier la réponse UIR pour le poste CIE 768, sans relance automatique."
    },
    relance_preparee: { ...cie.relance_preparee, statut: "annulee_obsolete", texte: "" },
    relance: { ...cie.relance, statut: "annulee_obsolete", texte: "" },
    historique: [...(cie.historique || []), {
      action: "suivi", le: receivedAt, par: "agent", batch_id: batchId,
      notes: "Refus UIR RREI-0926 vérifié ; le poste CIE 768 reste sans réponse. Brouillon commun à deux postes annulé."
    }],
    maj: receivedAt
  };
  const backupDir = path.join(base, ".backups", batchId);
  await fs.mkdir(backupDir, { recursive: false, mode: 0o700 });
  await Promise.all([
    fs.writeFile(path.join(backupDir, path.basename(rreiPath)), rreiBefore, { mode: 0o600, flag: "wx" }),
    fs.writeFile(path.join(backupDir, path.basename(ciePath)), cieBefore, { mode: 0o600, flag: "wx" })
  ]);
  if (await fs.readFile(rreiPath, "utf8") !== rreiBefore ||
      await fs.readFile(ciePath, "utf8") !== cieBefore) throw new Error("Écriture concurrente ; aucune écriture");
  for (const [file, data, stat] of [[rreiPath, nextRrei, rreiStat], [ciePath, nextCie, cieStat]]) {
    const tmp = `${file}.${process.pid}.tmp`;
    await fs.writeFile(tmp, JSON.stringify(data, null, 2) + "\n", { mode: 0o600, flag: "wx" });
    await fs.chown(tmp, stat.uid, stat.gid);
    await fs.chmod(tmp, stat.mode & 0o777);
    await fs.rename(tmp, file);
  }
  console.log(JSON.stringify({ recorded: "uir-rrei-refus", cie: "en attente", proofUrl, backupDir }));
}

main().catch(error => { console.error(error.message); process.exitCode = 1; });
