"use strict";

// Exécution manuelle uniquement après confirmation réelle du formulaire NOVEC.
const fs = require("node:fs/promises");
const path = require("node:path");

async function main() {
  const dataDir = process.env.TRAJECTOIRE_DATA_DIR;
  if (!dataDir) throw new Error("TRAJECTOIRE_DATA_DIR requis");
  const file = path.join(path.resolve(dataDir), "offres", "novec.json");
  const originalStat = await fs.stat(file);
  const before = await fs.readFile(file, "utf8");
  const current = JSON.parse(before);
  if (current.statut !== "pret" || current.date_postule || current.preuves?.length || !/NOVEC/i.test(current.entreprise || "")) {
    throw new Error("Fiche NOVEC modifiée ou candidature déjà enregistrée ; aucune écriture");
  }

  const now = new Date().toISOString();
  const sentDate = "2026-10-01";
  const proof = {
    type: "confirmation",
    verifiee: true,
    le: sentDate,
    label: "Formulaire officiel NOVEC : « Merci pour votre message. Il a été envoyé. »",
    reference: "186128",
    url: "https://www.novec.ma/condidature-spontannee/"
  };
  const next = {
    ...current,
    statut: "postule",
    date_postule: sentDate,
    cv: "sales",
    canal_envoi: "Formulaire officiel NOVEC (candidature spontanée, poste et référence précisés)",
    url_candidature: "https://www.novec.ma/condidature-spontannee/",
    piece_jointe_cv: "CV_Mohamed_Benchokroun_Sales.pdf",
    piece_jointe_lettre: "Lettre_Mohamed_Benchokroun_NOVEC_Developpement_Afrique_2026-10-01.pdf",
    action: "Préparer la relance J+5 en vérifiant d'abord l'accusé éventuel par e-mail.",
    action_date: "2026-10-06",
    qui: "agent",
    nb_relances: 0,
    pourquoi: "Expérience commerciale B2B et de coordination institutionnelle pertinente pour le développement en Afrique. Écart explicite : Bac+5 et expérience en ingénierie demandés, non démontrés dans le parcours.",
    priorite: "B",
    comment: "Candidature transmise via le formulaire officiel général de NOVEC le 01/10/2026, avec le poste et la référence ReKrute 186128 indiqués. Confirmation visible : « Merci pour votre message. Il a été envoyé. » Pas de preuve d'intégration dans l'ATS ReKrute.",
    preuves: [...(current.preuves || []), proof],
    historique: [...(current.historique || []), {
      action: "postule",
      le: now,
      par: "agent",
      canal: "formulaire_officiel_novec",
      notes: "Candidature envoyée après accord ponctuel de Mohamed ; CV Sales et lettre PDF joints ; confirmation affichée par novec.ma."
    }],
    maj: now
  };
  delete next.blocage;

  const backupDir = path.join(path.resolve(dataDir), ".backups", "novec-envoi-2026-10-01");
  await fs.mkdir(backupDir, { recursive: true, mode: 0o700 });
  const backup = path.join(backupDir, "novec-before.json");
  await fs.writeFile(backup, before, { mode: 0o600, flag: "wx" });
  if (await fs.readFile(file, "utf8") !== before) throw new Error("Écriture concurrente ; sauvegarde créée : " + backup);
  const temporary = file + "." + process.pid + ".tmp";
  await fs.writeFile(temporary, JSON.stringify(next, null, 2) + "\n", { mode: 0o600, flag: "wx" });
  await fs.chown(temporary, originalStat.uid, originalStat.gid);
  await fs.chmod(temporary, originalStat.mode & 0o777);
  await fs.rename(temporary, file);
  console.log(JSON.stringify({ id: "novec", statut: next.statut, date_postule: sentDate, preuve: proof.label, backup }));
}

main().catch(error => { console.error(error.message); process.exitCode = 1; });
