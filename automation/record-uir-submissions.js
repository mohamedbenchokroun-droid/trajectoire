"use strict";

// Exécution manuelle uniquement après les trois confirmations du portail UIR.
const fs = require("node:fs/promises");
const path = require("node:path");

const sentDate = "2026-10-01";
const records = [
  {
    id: "uir_com",
    reference: "UIR 766",
    url: "https://uir-recrutement.ma/emplois/administratif-fr/766-chargee-de-communication-fr/",
    letter: "Lettre_Mohamed_Benchokroun_UIR_Communication_Sante_2026-10-01.pdf",
    title: "Chargé(e) de Communication - Collège des Sciences de la Santé",
    why: "Communication institutionnelle, production de contenus et coordination d'événements pertinentes. Candidature exploratoire : poste demandant Bac+5, diplôme obtenu Bac+3 ; salaire non publié.",
    risks: "Bac+5 demandé, Bac+3 déclaré. Salaire non publié ; vérifier le seuil de 15 000 DH net/mois avant tout entretien approfondi."
  },
  {
    id: "uir_cie",
    reference: "UIR 768",
    url: "https://uir-recrutement.ma/emplois/administratif-fr/768-chargee-de-programmes-entrepreneuriat-community-building-h-f-fr/",
    letter: "Lettre_Mohamed_Benchokroun_UIR_Programmes_Entrepreneuriat_2026-10-01.pdf",
    title: "Chargé(e) de Programmes Entrepreneuriat & Community Building",
    why: "Animation d'événements, coordination multi-acteurs et partenariats transférables au CIE. Candidature exploratoire : Bac+5 demandé et expérience directe en incubation non établie.",
    risks: "Bac+5 demandé, Bac+3 déclaré. Pas d'expérience directe revendiquée en gestion d'incubateur. Salaire non publié ; vérifier le seuil de 15 000 DH net/mois."
  },
  {
    id: "uir_recrutement_international_2026",
    reference: "UIR 769",
    url: "https://uir-recrutement.ma/emplois/administratif-fr/769-responsable-recrutement-etudiants-internationaux-focus-afrique-fr/",
    letter: "Lettre_Mohamed_Benchokroun_UIR_Recrutement_International_2026-10-01.pdf",
    title: "Responsable Recrutement Étudiants Internationaux - Focus Afrique",
    why: "Prospection B2B Afrique, CRM, communication et événements transférables au recrutement international. Candidature exploratoire : Bac+5 et expérience directe des admissions non établis.",
    risks: "Bac+5 demandé, Bac+3 déclaré. Aucune expérience directe d'admissions universitaires revendiquée. Salaire non publié ; vérifier le seuil de 15 000 DH net/mois."
  }
];

async function main() {
  const dataDir = process.env.TRAJECTOIRE_DATA_DIR;
  if (!dataDir) throw new Error("TRAJECTOIRE_DATA_DIR requis");
  const root = path.resolve(dataDir);
  const backupDir = path.join(root, ".backups", "uir-envoi-2026-10-01");
  const now = new Date().toISOString();

  const updates = [];
  for (const item of records) {
    const file = path.join(root, "offres", `${item.id}.json`);
    const stat = await fs.stat(file);
    const before = await fs.readFile(file, "utf8");
    const current = JSON.parse(before);
    if (!/Université Internationale de Rabat|\bUIR\b/i.test(current.entreprise || "") ||
        current.date_postule || current.statut === "postule" || current.preuves?.length) {
      throw new Error(`Fiche ${item.id} déjà envoyée ou modifiée ; aucune écriture`);
    }
    if (!["veille", "a_postuler", "pret"].includes(current.statut)) {
      throw new Error(`Statut inattendu pour ${item.id} : ${current.statut}`);
    }
    const proof = {
      type: "confirmation",
      verifiee: true,
      le: sentDate,
      label: `Portail officiel UIR : « Merci pour votre candidature » après envoi pour ${item.title}`,
      reference: item.reference,
      url: "https://uir-recrutement.ma/remerciements/"
    };
    const next = {
      ...current,
      statut: "postule",
      date_postule: sentDate,
      cv: "com",
      canal_envoi: "Portail officiel de recrutement UIR (offre spécifique)",
      url_candidature: item.url,
      piece_jointe_cv: "CV_Mohamed_Benchokroun_Communication.pdf",
      piece_jointe_lettre: item.letter,
      action: "Préparer la relance J+5 après vérification de tout accusé par e-mail.",
      action_date: "2026-10-06",
      qui: "agent",
      nb_relances: 0,
      salaire: "Non communiqué ; seuil à confirmer : 15 000 DH net/mois.",
      pourquoi: item.why,
      risques: item.risks,
      comment: `Candidature ${item.reference} envoyée le 01/10/2026 via le portail officiel UIR. Même CV Communication joint aux trois offres UIR, avec lettre ciblée. Confirmation affichée : « Merci pour votre candidature ». Bac+3 déclaré.`,
      preuves: [...(current.preuves || []), proof],
      historique: [...(current.historique || []), {
        action: "postule",
        le: now,
        par: "agent",
        canal: "portail_officiel_uir",
        notes: `Envoi après accord ponctuel de Mohamed ; ${item.reference} ; CV Communication et lettre PDF joints ; page de remerciement affichée.`
      }],
      maj: now
    };
    delete next.salaire_sous_seuil;
    if (item.id === "uir_recrutement_international_2026") {
      next.message = "Lettre de motivation ciblée jointe en PDF ; le brouillon textuel initial n'a pas été envoyé.";
    }
    updates.push({ item, file, stat, before, next });
  }

  await fs.mkdir(backupDir, { recursive: true, mode: 0o700 });
  for (const update of updates) {
    const backup = path.join(backupDir, `${update.item.id}-before.json`);
    await fs.writeFile(backup, update.before, { mode: 0o600, flag: "wx" });
    update.backup = backup;
  }
  for (const update of updates) {
    if (await fs.readFile(update.file, "utf8") !== update.before) {
      throw new Error(`Écriture concurrente sur ${update.item.id} ; sauvegardes créées, aucune fiche modifiée`);
    }
  }
  for (const update of updates) {
    const temporary = `${update.file}.${process.pid}.tmp`;
    await fs.writeFile(temporary, JSON.stringify(update.next, null, 2) + "\n", { mode: 0o600, flag: "wx" });
    await fs.chown(temporary, update.stat.uid, update.stat.gid);
    await fs.chmod(temporary, update.stat.mode & 0o777);
    await fs.rename(temporary, update.file);
    console.log(JSON.stringify({ id: update.item.id, statut: "postule", date_postule: sentDate, reference: update.item.reference, backup: update.backup }));
  }
}

main().catch(error => { console.error(error.message); process.exitCode = 1; });
