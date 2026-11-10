"use strict";

const fs = require("node:fs/promises");
const path = require("node:path");

async function main() {
  const dataDir = process.env.TRAJECTOIRE_DATA_DIR;
  if (!dataDir) throw new Error("TRAJECTOIRE_DATA_DIR requis");
  const base = path.resolve(dataDir);
  const offersDir = path.join(base, "offres");
  const names = await fs.readdir(offersDir);
  for (const name of names.filter(n => n.endsWith(".json"))) {
    const item = JSON.parse(await fs.readFile(path.join(offersDir, name), "utf8"));
    if (/^otis$/i.test(item.entreprise || "") && /branch manager|responsable d.agence/i.test(item.poste || "")) {
      throw new Error("Offre Otis déjà enregistrée ; aucune écriture");
    }
  }
  const at = new Date().toISOString();
  const item = {
    entreprise: "Otis",
    poste: "Branch Manager (H/F) — agence de Rabat",
    lieu: "Rabat, Rue Achih",
    source: "Otis Careers / Workday, annonce 20146597",
    url: "https://otis.wd504.myworkdayjobs.com/fr-CA/REC_Ext_Gateway/job/Sec-13-Block-D-Rue-Achih-Rabat/Branch-Manager--H-F-_20146597",
    statut: "a_postuler",
    priorite: "B",
    match: 68,
    cv: "sales",
    salaire: "18 000 à 22 000 DH nets/mois selon profil, publié par Otis ; véhicule, 13e mois et indemnités annoncés",
    publication: "2026-10-12",
    offre_verifiee_le: "2026-10-15",
    contrat: "Temps plein, sur site ; nature CDI/CDD non précisée sur la page officielle",
    pourquoi: "Grand groupe international structuré, à Rabat ; poste mêlant développement commercial, relation grands comptes, pilotage d'équipe et opérations ; rémunération au-dessus du seuil demandé.",
    missions: [
      "Déployer la stratégie régionale et développer les relations avec les comptes importants",
      "Piloter les résultats de l'agence : commerce, chantier, qualité, sécurité et finances",
      "Manager une équipe pluridisciplinaire et respecter les procédures Otis"
    ],
    risques: "Le poste demande un management confirmé d'équipes de terrain et une expérience de P&L/centre de profit pour l'une des voies de qualification. Le CV atteste coordination commerciale et opérationnelle mais ne démontre pas une responsabilité P&L ni une expérience industrielle ; ne pas l'affirmer. Workday exige un compte avec mot de passe ; aucun compte créé, aucune candidature envoyée.",
    action: "Annonce officielle vérifiée le 15/10. CV Sales actuel contrôlé. Dépôt impossible sans création ou connexion à un compte Workday ; candidature non envoyée.",
    action_date: "2026-10-15",
    qui: "agent",
    action_planifiee: { date: "2026-10-16", texte: "Reprendre Otis seulement si un compte Workday existant est accessible ; ne pas créer de compte ni inventer l'expérience P&L.", qui: "agent" },
    dossier_statut: "cv_selectionne_non_envoye_compte_requis",
    message: "Je souhaite contribuer au développement de votre agence de Rabat en m'appuyant sur 14 ans d'expérience en développement commercial B2B, gestion de comptes et coordination de projets. Chez Corpotex, je pilote les échanges commerciaux jusqu'à la livraison et ai structuré le suivi des opportunités dans un CRM no-code. Mon parcours associe relation avec les décideurs, négociation et coordination d'équipes. Je serais heureux d'échanger sur vos objectifs commerciaux et opérationnels, en toute transparence sur mon expérience sectorielle.",
    historique: [{ action: "verification", le: at, par: "agent", batch_id: "otis-verification-2026-10-15", notes: "Annonce Otis Careers 20146597 vérifiée dans le navigateur : publiée le 12/10/2026, Rabat, temps plein, sur site, 18-22 kDH nets selon profil. Formulaire Workday exige un nouveau compte ou une connexion. Aucun compte créé, aucun CV transmis, aucune candidature envoyée." }],
    maj: at
  };
  const target = path.join(offersDir, "otis_branch_manager_20146597.json");
  await fs.writeFile(target, JSON.stringify(item, null, 2) + "\n", { mode: 0o600, flag: "wx" });
  const dirStat = await fs.stat(offersDir);
  await fs.chown(target, dirStat.uid, dirStat.gid);
  console.log(JSON.stringify({ recorded: path.basename(target), status: item.statut, sent: false }));
}

main().catch(error => { console.error(error.message); process.exitCode = 1; });
