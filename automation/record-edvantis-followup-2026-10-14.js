"use strict";

const fs = require("node:fs/promises");
const path = require("node:path");

const batchId = "edvantis-relance-2026-10-14";
const sentAt = "2026-10-14T10:45:28+01:00";
const proofUrl = "https://mail.google.com/mail/u/0/#sent/1a139cd7518b3eaf";

async function main() {
  const dataDir = process.env.TRAJECTOIRE_DATA_DIR;
  if (!dataDir) throw new Error("TRAJECTOIRE_DATA_DIR requis");
  const base = path.resolve(dataDir);
  const offerPath = path.join(base, "offres", "edvantis_design_graphique_9629675.json");
  const taskPath = path.join(base, "taches", "2026-10-14.json");
  const [offerStat, taskStat, offerBefore, taskBefore] = await Promise.all([
    fs.stat(offerPath), fs.stat(taskPath), fs.readFile(offerPath, "utf8"), fs.readFile(taskPath, "utf8")
  ]);
  const offer = JSON.parse(offerBefore);
  const tasks = JSON.parse(taskBefore);
  if (!/Edvantis/i.test(offer.entreprise || "") || offer.statut !== "postule" ||
      (offer.historique || []).some(h => h.batch_id === batchId) ||
      (offer.preuves || []).some(p => p.url === proofUrl)) {
    throw new Error("Fiche Edvantis déjà relancée ou modifiée ; aucune écriture");
  }
  const task = (tasks.items || []).find(i => i.batch_id === "edvantis-envoi-2026-10-09" &&
    /relance J\+5/i.test(i.texte || ""));
  if (!task || task.fait) throw new Error("Tâche Edvantis absente ou déjà faite ; aucune écriture");

  const nextOffer = {
    ...offer,
    statut: "relance",
    nb_relances: (offer.nb_relances || 0) + 1,
    derniere_action: "2026-10-14",
    action: "Relance courtoise envoyée à Zahia le 14/10 dans le fil Gmail initial ; en attente de confirmation de transmission à la direction pédagogique. Vérifier une réponse le 21/10, sans relance répétitive.",
    action_date: "2026-10-21",
    qui: "agent",
    action_planifiee: {
      date: "2026-10-21",
      texte: "Vérifier une réponse de Zahia et l'état du dossier ; ne pas envoyer une deuxième relance automatiquement.",
      qui: "agent"
    },
    relance_preparee: {
      ...offer.relance_preparee,
      statut: "envoyee",
      envoyee_le: sentAt,
      message_id: "1a139cd7518b3eaf",
      thread_id: "1a12142281ddab58"
    },
    preuves: [...(offer.preuves || []), {
      type: "email_relance_envoye",
      verifiee: true,
      le: sentAt,
      label: "Gmail SENT : relance à Zahia dans le fil de candidature du 9 octobre ; aucune pièce jointe renvoyée.",
      url: proofUrl,
      reference: "Emploi.ma 9629675"
    }],
    historique: [...(offer.historique || []), {
      action: "relance",
      le: sentAt,
      par: "agent",
      batch_id: batchId,
      notes: "Aucune réponse Gmail de Zahia depuis le 9/10. Relance unique J+5 envoyée et vérifiée dans Gmail SENT, même fil, même destinataire. Aucune preuve de réception ou de transmission à la direction pédagogique."
    }],
    maj: sentAt
  };
  const nextTasks = {
    ...tasks,
    items: tasks.items.map(i => i === task ? {
      ...i,
      fait: true,
      detail: "Gmail vérifié : aucune réponse de Zahia ; relance J+5 envoyée dans le fil initial le 14/10, preuve dans la fiche Edvantis."
    } : i),
    maj: sentAt
  };

  const backupDir = path.join(base, ".backups", batchId);
  await fs.mkdir(backupDir, { recursive: false, mode: 0o700 });
  await Promise.all([
    fs.writeFile(path.join(backupDir, "edvantis_design_graphique_9629675.json"), offerBefore, { mode: 0o600, flag: "wx" }),
    fs.writeFile(path.join(backupDir, "2026-10-14.json"), taskBefore, { mode: 0o600, flag: "wx" })
  ]);
  if (await fs.readFile(offerPath, "utf8") !== offerBefore ||
      await fs.readFile(taskPath, "utf8") !== taskBefore) {
    throw new Error("Écriture concurrente ; aucune écriture");
  }
  const offerTmp = `${offerPath}.${process.pid}.tmp`;
  const taskTmp = `${taskPath}.${process.pid}.tmp`;
  await fs.writeFile(offerTmp, JSON.stringify(nextOffer, null, 2) + "\n", { mode: 0o600, flag: "wx" });
  await fs.writeFile(taskTmp, JSON.stringify(nextTasks, null, 2) + "\n", { mode: 0o600, flag: "wx" });
  await Promise.all([
    fs.chown(offerTmp, offerStat.uid, offerStat.gid), fs.chown(taskTmp, taskStat.uid, taskStat.gid)
  ]);
  await Promise.all([
    fs.chmod(offerTmp, offerStat.mode & 0o777), fs.chmod(taskTmp, taskStat.mode & 0o777)
  ]);
  await fs.rename(offerTmp, offerPath);
  await fs.rename(taskTmp, taskPath);
  console.log(JSON.stringify({ recorded: "edvantis", sent: true, proofUrl, backupDir }));
}

main().catch(error => { console.error(error.message); process.exitCode = 1; });
