"use strict";

// À exécuter uniquement après vérification du message Gmail SENT.
const fs = require("node:fs/promises");
const path = require("node:path");

const sentAt = "2026-10-12T14:50:52+01:00";
const mailUrl = "https://mail.google.com/mail/u/0/#sent/1a1309857f902641";

async function main() {
  const dataDir = process.env.TRAJECTOIRE_DATA_DIR;
  if (!dataDir) throw new Error("TRAJECTOIRE_DATA_DIR requis");
  const base = path.resolve(dataDir);
  const target = path.join(base, "cibles", "talio.json");
  const names = await fs.readdir(path.join(base, "cibles"));
  for (const name of names.filter(n => n.endsWith(".json"))) {
    const data = JSON.parse(await fs.readFile(path.join(base, "cibles", name), "utf8"));
    if (/^Talio/i.test(data.nom || "")) throw new Error("Talio déjà présent dans le cockpit ; aucune écriture");
  }
  const record = {
    nom: "Talio — profil validé, missions à proposer",
    secteur: "Plateforme de mise en relation talents et entreprises",
    lieu: "France / télétravail depuis le Maroc à confirmer",
    url: "https://www.taliotalent.com/dashboard",
    priorite: "A",
    statut: "chaud",
    cv: "digital",
    postes: "Missions de transformation digitale à proposer ; aucune offre, client ni contrat encore présenté.",
    pourquoi: "Profil admis et validé par Talio le 25/09/2026. Il est visible auprès des entreprises partenaires ; cela ne vaut pas proposition ni contrat signé.",
    porte: "Compte Talio et talent@taliotalent.com ; demande de précisions envoyée le 12/10 (Gmail SENT).",
    action: "Attendre la réponse sur le calendrier, le contrat (salarié ou prestation), la durée, la rémunération et le télétravail depuis le Maroc. Vérifier le 19/10 sans relance automatique.",
    action_date: "2026-10-19",
    source: "Emails Talio du 25/09/2026 et Gmail SENT du 12/10/2026",
    preuve: {
      type: "email_envoye",
      verifiee: true,
      le: sentAt,
      label: "Demande de clarification envoyée à talent@taliotalent.com, Gmail SENT 1a1309857f902641",
      url: mailUrl,
      message_id: "1a1309857f902641"
    },
    historique: [
      { action: "profil_admis", le: "2026-09-25", source: "Gmail 1a0d7e26f5fbf64a" },
      { action: "profil_valide", le: "2026-09-25", source: "Gmail 1a0d8eda1886f20f" },
      { action: "demande_modalites_envoyee", le: sentAt, source: mailUrl }
    ],
    maj: sentAt
  };
  const collectionStat = await fs.stat(path.join(base, "cibles"));
  await fs.writeFile(target, JSON.stringify(record, null, 2) + "\n", { mode: 0o600, flag: "wx" });
  await fs.chown(target, collectionStat.uid, collectionStat.gid);
  console.log(JSON.stringify({ recorded: "talio", status: record.statut, mailUrl }));
}

main().catch(error => { console.error(error.message); process.exitCode = 1; });
