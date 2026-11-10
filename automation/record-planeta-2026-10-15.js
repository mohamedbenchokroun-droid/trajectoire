"use strict";

const fs = require("node:fs/promises");
const path = require("node:path");

async function main() {
  const dataDir = process.env.TRAJECTOIRE_DATA_DIR;
  if (!dataDir) throw new Error("TRAJECTOIRE_DATA_DIR requis");
  const offersDir = path.join(path.resolve(dataDir), "offres");
  for (const name of (await fs.readdir(offersDir)).filter(n => n.endsWith(".json"))) {
    const offer = JSON.parse(await fs.readFile(path.join(offersDir, name), "utf8"));
    if (/planeta|eslsca/i.test(offer.entreprise || "") && /admissions/i.test(offer.poste || "")) {
      throw new Error("Candidature ESLSCA/Planeta déjà suivie ; aucune écriture");
    }
  }
  const at = new Date().toISOString();
  const offer = {
    entreprise: "ESLSCA Business School Rabat / Grupo Planeta",
    poste: "Chargé(e) des Admissions",
    lieu: "Rabat",
    source: "Grupo Planeta Careers / Talent Clue, offre 125689066",
    url: "https://grupoplaneta.talentclue.com/en/node/125689066/4590/modal",
    statut: "a_postuler",
    priorite: "B",
    match: 76,
    cv: "sales",
    salaire: "Non publié ; conformité au seuil de plus de 12 000 DH nets à confirmer",
    publication: null,
    republication_linkedin: "2026-10-13",
    offre_verifiee_le: "2026-10-15",
    contrat: "Sur site ; type de contrat non précisé dans l'annonce officielle",
    pourquoi: "Groupe international structuré, à Rabat ; le rôle associe développement commercial B2C/B2B, partenariats, événements, CRM et suivi de KPI. Bac+3 accepté.",
    missions: [
      "Identifier, contacter et conseiller les candidats aux formations",
      "Développer des partenariats avec écoles, universités et entreprises",
      "Participer aux forums et événements, piloter le suivi des objectifs dans le CRM"
    ],
    risques: "Salaire absent de l'annonce et date de publication initiale non vérifiée (republication LinkedIn le 13/10). Le titre 'chargé(e)' peut être inférieur au niveau et au salaire visés ; ne pas présumer plus de 12 000 DH nets. Aucun envoi confirmé.",
    action: "Offre et formulaire officiel vérifiés le 15/10 ; CV Sales sélectionné. Envoi non effectué à ce stade.",
    action_date: "2026-10-15",
    qui: "agent",
    action_planifiee: { date: "2026-10-16", texte: "Finaliser la candidature si transmission du CV autorisée et vérifier le salaire lors d'un échange recruteur.", qui: "agent" },
    dossier_statut: "pret_non_envoye",
    message: "Mon parcours associe développement commercial B2B, relation client et coordination de projets institutionnels et événementiels. J'ai structuré le suivi des opportunités dans un CRM no-code et travaillé avec des organisations de formation sur des projets concrets. Je souhaite mettre cette expérience au service de l'accompagnement des candidats, du développement de partenariats et du pilotage des admissions d'ESLSCA Rabat.",
    historique: [{ action: "verification", le: at, par: "agent", batch_id: "planeta-verification-2026-10-15", notes: "Annonce officielle active et formulaire Talent Clue vérifiés le 15/10/2026. Quatre postes indiqués ; Rabat, sur site, Bac+3 à Bac+5, salaire non communiqué. Aucun CV transmis ni candidature envoyée à ce stade." }],
    maj: at
  };
  const target = path.join(offersDir, "planeta_eslsca_admissions_125689066.json");
  await fs.writeFile(target, JSON.stringify(offer, null, 2) + "\n", { mode: 0o600, flag: "wx" });
  const dirStat = await fs.stat(offersDir);
  await fs.chown(target, dirStat.uid, dirStat.gid);
  console.log(JSON.stringify({ recorded: path.basename(target), status: offer.statut, sent: false }));
}

main().catch(error => { console.error(error.message); process.exitCode = 1; });
