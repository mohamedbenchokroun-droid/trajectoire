"use strict";

// Met à jour uniquement le lien de la fiche existante ; l'envoi Gmail historique reste inchangé.
const id = "edvantis_design_graphique_9629675";
const base = "http://127.0.0.1:8096";
const authorization = "Basic " + Buffer.from(
  process.env.TRAJECTOIRE_USERNAME + ":" + process.env.TRAJECTOIRE_PASSWORD
).toString("base64");
const headers = { Authorization: authorization };

async function main() {
  const stateResponse = await fetch(base + "/api/state", { headers });
  if (!stateResponse.ok) throw new Error("Lecture du suivi impossible : " + stateResponse.status);
  const state = await stateResponse.json();
  const offer = state.offres?.[id];
  if (!offer || offer.statut !== "postule") throw new Error("Fiche Edvantis absente ou statut inattendu");
  if (offer.cv === "design") return console.log("Fiche déjà liée au CV Design graphique.");
  if (offer.cv !== "Design graphique (Edvantis)") throw new Error("CV actuel inattendu : " + offer.cv);

  const patchResponse = await fetch(base + "/api/offres/" + id, {
    method: "PATCH",
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify({
      cv: "design",
      cv_fichier_local: "C:\\Users\\mbenc\\Documents\\Codex\\2026-09-29\\j-ai\\work\\trajectoire\\cv-files\\CV Mohamed Benchokroun Design Graphique.pdf"
    })
  });
  if (!patchResponse.ok) throw new Error("Mise à jour refusée : " + patchResponse.status);
  const verifyResponse = await fetch(base + "/api/state", { headers });
  if (!verifyResponse.ok) throw new Error("Vérification du suivi impossible");
  const verified = (await verifyResponse.json()).offres[id];
  if (verified.cv !== "design" || verified.statut !== "postule" ||
      verified.piece_jointe_cv !== offer.piece_jointe_cv ||
      JSON.stringify(verified.preuves) !== JSON.stringify(offer.preuves)) {
    throw new Error("Vérification de la fiche échouée");
  }
  console.log("Fiche Edvantis liée au CV Design graphique ; preuve et statut conservés.");
}

main().catch(error => { console.error(error); process.exitCode = 1; });
