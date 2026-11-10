"use strict";

// À exécuter uniquement après vérification du message Gmail SENT ci-dessous.
const fs = require("node:fs/promises");
const path = require("node:path");

const batchId = "ntu-relance-2026-10-12";
const messageId = "1a12ffe13a750d1f";
const threadId = "1a0ea58565d11fe5";
const sentAt = "2026-10-12T12:02:22.000Z";
const sentText = "Dear Recruitment Team, I am following up on my application of 29 September for the two Rabat assignments: Senior Non-Key Expert – Communication & Visibility and Communication & Knowledge Management Expert. My background combines institutional communications, stakeholder coordination and the delivery of visual, editorial and event content for international organisations. Could you let me know whether either selection process is still ongoing, and whether you need any further information from me? My CV is attached in the earlier message in this thread. Kind regards, Mohamed Benchokroun.";

async function main() {
  const dataDir = process.env.TRAJECTOIRE_DATA_DIR;
  if (!dataDir) throw new Error("TRAJECTOIRE_DATA_DIR requis");
  const offerDir = path.join(path.resolve(dataDir), "offres");
  const ids = ["ntu_com", "ntu_km"];
  const plans = [];
  for (const id of ids) {
    const file = path.join(offerDir, `${id}.json`);
    const stat = await fs.stat(file);
    const before = await fs.readFile(file, "utf8");
    const current = JSON.parse(before);
    if (current.statut !== "postule" || current.date_postule !== "2026-09-29" || Number(current.nb_relances || 0) !== 0 ||
        (current.historique || []).some(h => h.batch_id === batchId) ||
        !/NTU International/i.test(current.entreprise || "")) {
      throw new Error(`Fiche ${id} modifiée ou relance déjà enregistrée ; aucune écriture`);
    }
    const proof = {
      type: "email_envoye",
      verifiee: true,
      le: sentAt,
      label: "Gmail SENT : une relance commune aux deux postes NTU, dans le fil de candidature du 29/09 ; aucun CV renvoyé.",
      url: `https://mail.google.com/mail/u/0/#sent/${messageId}`,
      message_id: messageId,
      thread_id: threadId,
      reference: "Relance NTU 12/10/2026"
    };
    const next = {
      ...current,
      nb_relances: 1,
      derniere_action: "2026-10-12",
      action: "Relance commune envoyée le 12/10. Attendre la réponse ; vérifier une seule fois le 19/10, sans nouvel envoi automatique.",
      action_date: "2026-10-19",
      action_planifiee: {
        date: "2026-10-19",
        texte: "NTU : contrôler la réponse à la relance du 12/10 ; aucune nouvelle relance sans motif.",
        qui: "agent"
      },
      relance_preparee: {
        ...(current.relance_preparee || {}),
        statut: "envoyee",
        date_envoi: "2026-10-12",
        message_id_envoye: messageId,
        thread_id: threadId,
        texte: sentText,
        note: "L'ancien brouillon Gmail du 08/10 n'a pas été envoyé ; ne pas l'envoyer en doublon."
      },
      preuves: [...(current.preuves || []), proof],
      historique: [...(current.historique || []), {
        action: "relance_envoyee",
        le: sentAt,
        par: "agent",
        batch_id: batchId,
        canal: "gmail",
        notes: `Relance unique commune aux deux postes, Gmail SENT ${messageId}, thread ${threadId}. Ancien brouillon non envoyé. Aucun CV ou autre pièce jointe renvoyé.`
      }],
      maj: sentAt
    };
    plans.push({ id, file, stat, before, next });
  }

  const backupDir = path.join(path.resolve(dataDir), ".backups", batchId);
  await fs.mkdir(backupDir, { recursive: false, mode: 0o700 });
  for (const plan of plans) {
    await fs.writeFile(path.join(backupDir, `${plan.id}.json`), plan.before, { mode: 0o600, flag: "wx" });
  }
  for (const plan of plans) {
    if (await fs.readFile(plan.file, "utf8") !== plan.before) throw new Error(`Écriture concurrente : ${plan.id} ; aucune écriture sur cette fiche`);
    const temporary = `${plan.file}.${process.pid}.tmp`;
    await fs.writeFile(temporary, JSON.stringify(plan.next, null, 2) + "\n", { mode: 0o600, flag: "wx" });
    await fs.chown(temporary, plan.stat.uid, plan.stat.gid);
    await fs.chmod(temporary, plan.stat.mode & 0o777);
    await fs.rename(temporary, plan.file);
  }
  console.log(JSON.stringify({ recorded: ids, messageId, threadId, sentAt, backupDir }));
}

main().catch(error => { console.error(error.message); process.exitCode = 1; });
