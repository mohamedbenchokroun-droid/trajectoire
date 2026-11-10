"use strict";

const fs = require("node:fs/promises");
const path = require("node:path");
const batchId = "hilti-revue-2026-10-12";
const checkedAt = "2026-10-12T15:00:00+01:00";

async function main() {
  const dataDir = process.env.TRAJECTOIRE_DATA_DIR;
  if (!dataDir) throw new Error("TRAJECTOIRE_DATA_DIR requis");
  const base = path.resolve(dataDir);
  const target = path.join(base, "offres", "hilti.json");
  const stat = await fs.stat(target);
  const before = await fs.readFile(target, "utf8");
  const current = JSON.parse(before);
  if (!/Hilti/i.test(current.entreprise || "") || current.statut !== "a_postuler" ||
      (current.historique || []).some(h => h.batch_id === batchId)) throw new Error("Fiche Hilti modifiée ; aucune écriture");
  const next = {
    ...current,
    action: "Offre officielle 20527 active le 12/10 : profil commercial compatible, salaire non publié. Parcours Hilti ouvert ; aucune candidature envoyée. Dépôt du CV Sales et des coordonnées en attente de l'autorisation ponctuelle demandée.",
    action_date: "2026-10-12",
    action_planifiee: {
      date: "2026-10-12",
      texte: "Hilti : accord ponctuel pour transmettre le CV Sales et les coordonnées, puis finaliser les champs du formulaire sans inventer de données.",
      qui: "vous"
    },
    blocage: "Autorisation ponctuelle de transmission du CV et des coordonnées en attente ; salaire >12 000 DH net non confirmé par l'annonce.",
    salaire: "Non publié ; seuil recherché strictement supérieur à 12 000 DH net/mois, à vérifier.",
    risques: "Salaire fixe et bonus non chiffrés. Expérience BTP souhaitée, non obligatoire ; permis B requis. Aucun diplôme minimum affiché sur la page officielle. Ne pas prétendre connaître le package.",
    offre_verifiee_le: "2026-10-12",
    historique: [...(current.historique || []), {
      action: "verification",
      le: checkedAt,
      par: "agent",
      batch_id: batchId,
      notes: "Page officielle Hilti 20527 et première étape Avature vérifiées. 2 ans de vente et permis exigés ; BTP préféré. Salaire non publié. Aucun CV transmis, aucun compte créé, aucune candidature envoyée."
    }],
    maj: checkedAt
  };
  const backupDir = path.join(base, ".backups", batchId);
  await fs.mkdir(backupDir, { recursive: false, mode: 0o700 });
  await fs.writeFile(path.join(backupDir, "hilti.json"), before, { mode: 0o600, flag: "wx" });
  if (await fs.readFile(target, "utf8") !== before) throw new Error("Écriture concurrente ; aucune écriture");
  const temporary = `${target}.${process.pid}.tmp`;
  await fs.writeFile(temporary, JSON.stringify(next, null, 2) + "\n", { mode: 0o600, flag: "wx" });
  await fs.chown(temporary, stat.uid, stat.gid);
  await fs.chmod(temporary, stat.mode & 0o777);
  await fs.rename(temporary, target);
  console.log(JSON.stringify({ recorded: "hilti", status: next.statut, sent: false, backupDir }));
}

main().catch(error => { console.error(error.message); process.exitCode = 1; });
