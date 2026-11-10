"use strict";

const fs = require("node:fs/promises");
const path = require("node:path");

const batchId = "hilti-formulaire-bloque-2026-10-12";
const checkedAt = "2026-10-12T16:13:16+01:00";

async function main() {
  const dataDir = process.env.TRAJECTOIRE_DATA_DIR;
  if (!dataDir) throw new Error("TRAJECTOIRE_DATA_DIR requis");
  const base = path.resolve(dataDir);
  const target = path.join(base, "offres", "hilti.json");
  const stat = await fs.stat(target);
  const before = await fs.readFile(target, "utf8");
  const current = JSON.parse(before);
  if (!/Hilti/i.test(current.entreprise || "") || current.statut !== "a_postuler" ||
      (current.historique || []).some(h => h.batch_id === batchId)) {
    throw new Error("Fiche Hilti modifiée ; aucune écriture");
  }
  const next = {
    ...current,
    action: "12/10 : CV Sales chargé et analysé par le formulaire Hilti. Candidature finale non envoyée : inscription avec mot de passe obligatoire. Offre ReKrute 183465 ouverte jusqu'au 17/11, mais session déconnectée et connexion Google refusée par la sécurité du navigateur.",
    action_date: "2026-10-12",
    action_planifiee: {
      date: "2026-10-13",
      texte: "Reprendre uniquement après accès ReKrute autorisé et connecté, ou exception explicite à la règle interdisant la création d'un compte Hilti. Vérifier l'absence de candidature antérieure avant envoi.",
      qui: "agent"
    },
    blocage: "Aucun dépôt final. Hilti exige un compte et un mot de passe ; la création de compte est exclue par consigne. ReKrute est déconnecté et sa connexion Google a été refusée par la sécurité du navigateur. Salaire > 12 000 DH net non vérifié.",
    comment: "Ancienne fiche ReKrute 183465 de nouveau active : publication du 17/09 au 17/11/2026, vérifiée le 12/10. Elle semble concerner le même poste Rabat ; aucune candidature ReKrute n'a été envoyée. Offre officielle Hilti 20527 toujours ouverte.",
    source_alternative: "https://www.rekrute.com/offre-emploi-account-manager-hf-rabat-recrutement-hilti-maroc-rabat-183465.html",
    historique: [...(current.historique || []), {
      action: "formulaire_commence_non_envoye",
      le: checkedAt,
      par: "agent",
      batch_id: batchId,
      notes: "Autorisation ponctuelle reçue pour le CV Sales et les coordonnées. Le PDF CV Mohamed Benchokroun Sales.pdf a été chargé dans Avature, puis des données ont été préremplies à l'étape Register 2/3. Deux champs mot de passe obligatoires imposent la création d'un compte, interdite par la consigne. ReKrute 183465 active jusqu'au 17/11, mais session déconnectée ; tentative de connexion Google arrêtée par contrôle de sécurité. Aucun dépôt final, aucun compte créé, aucune confirmation d'envoi."
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
