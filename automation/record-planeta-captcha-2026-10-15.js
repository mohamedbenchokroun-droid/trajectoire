"use strict";
const fs = require("node:fs/promises");
const path = require("node:path");

async function main() {
  const dataDir = process.env.TRAJECTOIRE_DATA_DIR;
  if (!dataDir) throw new Error("TRAJECTOIRE_DATA_DIR requis");
  const file = path.join(path.resolve(dataDir), "offres", "planeta_eslsca_admissions_125689066.json");
  const item = JSON.parse(await fs.readFile(file, "utf8"));
  if (item.statut !== "a_postuler" || item.dossier_statut !== "pret_non_envoye") {
    throw new Error("Statut modifié depuis la préparation ; aucune écriture");
  }
  const at = new Date().toISOString();
  item.action = "CV Sales téléversé sur le formulaire officiel et champs remplis ; l'envoi a été refusé faute de reCAPTCHA. Candidature non envoyée.";
  item.action_date = "2026-10-15";
  item.action_planifiee = { date: "2026-10-15", texte: "Finaliser le reCAPTCHA uniquement après autorisation ponctuelle, puis vérifier la confirmation d'envoi.", qui: "agent" };
  item.dossier_statut = "cv_televerse_non_envoye_captcha_requis";
  item.historique = Array.isArray(item.historique) ? item.historique : [];
  item.historique.push({ action: "blocage_envoi", le: at, par: "agent", batch_id: "planeta-captcha-2026-10-15", notes: "Formulaire Talent Clue complété, CV Mohamed Benchokroun Sales.pdf téléversé. Clic Apply effectué ; message d'erreur : The answer you entered for the CAPTCHA was not correct. Aucun accusé de réception, ne pas compter comme candidature envoyée." });
  item.maj = at;
  await fs.writeFile(file, JSON.stringify(item, null, 2) + "\n");
  console.log(JSON.stringify({ recorded: path.basename(file), sent: false, blocker: "reCAPTCHA" }));
}
main().catch(error => { console.error(error.message); process.exitCode = 1; });
