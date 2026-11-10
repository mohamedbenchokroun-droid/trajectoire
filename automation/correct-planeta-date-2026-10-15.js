"use strict";
const fs = require("node:fs/promises");
const path = require("node:path");

async function main() {
  const base = process.env.TRAJECTOIRE_DATA_DIR;
  if (!base) throw new Error("TRAJECTOIRE_DATA_DIR requis");
  const file = path.join(path.resolve(base), "offres", "planeta_eslsca_admissions_125689066.json");
  const item = JSON.parse(await fs.readFile(file, "utf8"));
  if (item.source !== "Grupo Planeta Careers / Talent Clue, offre 125689066" || item.publication !== "2026-10-13" || item.statut !== "a_postuler") {
    throw new Error("Fiche modifiée depuis l'ajout ; aucune correction automatique");
  }
  item.publication = null;
  item.republication_linkedin = "2026-10-13";
  item.risques = "Salaire absent de l'annonce et date de publication initiale non vérifiée (republication LinkedIn le 13/10). Le titre 'chargé(e)' peut être inférieur au niveau et au salaire visés ; ne pas présumer plus de 12 000 DH nets. Aucun envoi confirmé.";
  item.maj = new Date().toISOString();
  await fs.writeFile(file, JSON.stringify(item, null, 2) + "\n", { flag: "w" });
  console.log(JSON.stringify({ corrected: path.basename(file), publication: item.publication, republication: item.republication_linkedin }));
}
main().catch(error => { console.error(error.message); process.exitCode = 1; });
