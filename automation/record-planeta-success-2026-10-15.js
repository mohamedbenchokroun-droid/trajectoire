"use strict";
const fs = require("node:fs/promises");
const path = require("node:path");

async function main() {
  const dataDir = process.env.TRAJECTOIRE_DATA_DIR;
  if (!dataDir) throw new Error("TRAJECTOIRE_DATA_DIR requis");
  const file = path.join(path.resolve(dataDir), "offres", "planeta_eslsca_admissions_125689066.json");
  const item = JSON.parse(await fs.readFile(file, "utf8"));
  if (item.statut !== "a_postuler" || item.dossier_statut !== "cv_televerse_non_envoye_captcha_requis") {
    throw new Error("Statut modifié depuis le contrôle ; aucune écriture");
  }
  const at = new Date().toISOString();
  item.statut = "postule";
  item.date_postule = "2026-10-15";
  item.dossier_statut = "formulaire_soumis_confirmation_site";
  item.action = "Candidature soumise sur Talent Clue avec le CV Sales. Après le clic Apply, redirection vers B4work affichant « ¡Inscripción realizada con éxito! ». Aucun courriel d'accusé trouvé lors de la vérification immédiate ; ne pas poursuivre l'inscription optionnelle B4work.";
  item.action_date = "2026-10-15";
  item.action_planifiee = { date: "2026-10-20", texte: "Contrôler les réponses/accusés, puis décider si une seule relance J+5 est utile et possible.", qui: "agent" };
  item.risques = "Salaire absent de l'annonce et date de publication initiale non vérifiée (republication LinkedIn le 13/10). Le titre 'chargé(e)' peut être inférieur au niveau et au salaire visés ; vérifier la rémunération à l'échange. Confirmation visible sur le site, sans courriel d'accusé retrouvé immédiatement.";
  item.preuves = Array.isArray(item.preuves) ? item.preuves : [];
  item.preuves.push({ type: "confirmation", le: at, verifiee: true, label: "Formulaire Talent Clue soumis ; page B4work : inscription réalisée avec succès", reference: "Capture locale : automation/preuve-eslsca-envoi-2026-10-15.png" });
  item.historique = Array.isArray(item.historique) ? item.historique : [];
  item.historique.push({ action: "candidature_envoyee", le: at, par: "agent", batch_id: "planeta-success-2026-10-15", notes: "CAPTCHA validé avec autorisation ponctuelle de Mohamed. Apply sur l'offre officielle 125689066, CV Sales déjà téléversé ; redirection vers candidate.b4workapp.com/register/email avec le texte ¡Inscripción realizada con éxito!. Capture locale conservée. Étape suivante B4work non suivie (elle accepte d'autres conditions)." });
  item.maj = at;
  await fs.writeFile(file, JSON.stringify(item, null, 2) + "\n");
  console.log(JSON.stringify({ recorded: path.basename(file), statut: item.statut, proof: item.preuves.at(-1).label, at }));
}
main().catch(error => { console.error(error.message); process.exitCode = 1; });
