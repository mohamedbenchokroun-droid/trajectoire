"use strict";

// À exécuter uniquement après vérification du message LinkedIn dans la conversation.
const fs = require("node:fs/promises");
const path = require("node:path");

const batchId = "casanet-relance-2026-10-12";
const sentAt = "2026-10-12T14:30:00+01:00";
const conversationUrl = "https://www.linkedin.com/messaging/thread/2-ZDFhZWY5YzUtZDUxMy00OGM5LThiMmItZjFlZDlhMWY2Y2Q3XzEwMA==/";
const sentText = "Bonjour Madame Benlemmouden, je reviens vers vous au sujet de ma candidature au poste d’Account Manager chez Casanet. Mon expérience en développement de comptes B2B et en structuration du suivi commercial pourrait-elle répondre à vos priorités actuelles ? Si le recrutement est toujours ouvert, je serais ravi d’échanger brièvement. Bien cordialement, Mohamed Benchokroun.";

async function main() {
  const dataDir = process.env.TRAJECTOIRE_DATA_DIR;
  if (!dataDir) throw new Error("TRAJECTOIRE_DATA_DIR requis");
  const file = path.join(path.resolve(dataDir), "offres", "casanet.json");
  const stat = await fs.stat(file);
  const before = await fs.readFile(file, "utf8");
  const current = JSON.parse(before);
  if (!/Casanet/i.test(current.entreprise || "") || current.statut !== "relance" ||
      Number(current.nb_relances || 0) !== 1 ||
      (current.historique || []).some(h => h.batch_id === batchId)) {
    throw new Error("Fiche Casanet modifiée ou relance déjà enregistrée ; aucune écriture");
  }

  const next = {
    ...current,
    nb_relances: 2,
    derniere_action: "2026-10-12",
    action: "Relance LinkedIn envoyée à Jennate Benlemmouden le 12/10, message corrigé et vérifié. Attendre sa réponse ; contrôler le 19/10 sans nouvelle relance automatique.",
    action_date: "2026-10-19",
    action_planifiee: {
      date: "2026-10-19",
      texte: "Casanet : contrôler la réponse LinkedIn à la relance du 12/10 ; ne pas réécrire sans motif.",
      qui: "agent"
    },
    relance_preparee: {
      ...(current.relance_preparee || {}),
      texte: sentText,
      date_envoi: "2026-10-12",
      statut: "envoyee",
      url: conversationUrl
    },
    salaire: "Non publié ; seuil recherché strictement supérieur à 12 000 DH net/mois, à confirmer avant toute proposition.",
    risques: "5 ans d'account management IT demandés ; expérience B2B et projets digitaux transférables mais écart sectoriel. Salaire non publié, seuil >12 000 DH net non confirmé.",
    preuves: [...(current.preuves || []), {
      type: "message_linkedin_envoye",
      verifiee: true,
      le: sentAt,
      label: "Message à Jennate Benlemmouden visible dans la conversation LinkedIn à 14:30, corrigé via Modifier ; une seule relance envoyée le 12/10.",
      url: conversationUrl,
      reference: "Relance Casanet 12/10/2026"
    }],
    historique: [...(current.historique || []), {
      action: "relance_envoyee",
      le: sentAt,
      par: "agent",
      batch_id: batchId,
      canal: "linkedin",
      notes: "Message corrigé et vérifié dans la conversation de Jennate Benlemmouden à 14:30 ; aucune nouvelle candidature ni pièce jointe."
    }],
    maj: sentAt
  };
  const backupDir = path.join(path.resolve(dataDir), ".backups", batchId);
  await fs.mkdir(backupDir, { recursive: false, mode: 0o700 });
  await fs.writeFile(path.join(backupDir, "casanet.json"), before, { mode: 0o600, flag: "wx" });
  if (await fs.readFile(file, "utf8") !== before) throw new Error("Écriture concurrente ; aucune écriture");
  const temporary = `${file}.${process.pid}.tmp`;
  await fs.writeFile(temporary, JSON.stringify(next, null, 2) + "\n", { mode: 0o600, flag: "wx" });
  await fs.chown(temporary, stat.uid, stat.gid);
  await fs.chmod(temporary, stat.mode & 0o777);
  await fs.rename(temporary, file);
  console.log(JSON.stringify({ recorded: "casanet", sentAt, conversationUrl, backupDir }));
}

main().catch(error => { console.error(error.message); process.exitCode = 1; });
