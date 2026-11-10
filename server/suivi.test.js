"use strict";
const { test } = require("node:test");
const assert = require("node:assert/strict");
const logic = require("../cockpit/suivi.js");
test("J+5, J+10 et J+20 restent ancrés sur l’envoi initial", () => {
  const x = { statut: "postule", date_postule: "2026-09-29", derniere_action: "2026-10-08" };
  assert.equal(logic.next(x, "2026-09-30").d, "2026-10-04");
  assert.equal(logic.next({ ...x, nb_relances: 1 }, "2026-09-30").d, "2026-10-09");
  assert.equal(logic.next({ ...x, nb_relances: 2 }, "2026-09-30").d, "2026-10-19");
});
test("les anciennes fiches restent utilisables, les dates invalides sont signalées", () => {
  assert.equal(logic.next({ statut: "relance", nb_relances: 1, derniere_action: "2026-09-29" }, "2026-09-30").d, "2026-10-04");
  assert.equal(logic.date("2026-02-30"), null);
  assert.equal(logic.next({ statut: "postule" }, "2026-09-30").kind, "blocked");
});
test("les exclusions et dossiers clos ne produisent aucune action", () => {
  assert.equal(logic.next({ entreprise: "Sofrecom Maroc", statut: "pret" }, "2026-09-30"), null);
  assert.equal(logic.next({ statut: "abandon", appel: { fait: false } }, "2026-09-30"), null);
  assert.equal(logic.next({ statut: "pret", doublon_de: "original" }, "2026-09-30"), null);
});
test("un titre similaire ne suffit pas à déclarer un doublon", () => {
  const a = { id: "a", entreprise: "VINCI Construction", url: "https://www.linkedin.com/jobs/view/4469264591/?utm_source=mail", reference_offre: "2026-132411" };
  const b = { id: "b", entreprise: "SOGEA Maroc", url: "https://linkedin.com/jobs/view/4472477002/", reference_offre: "2026-132411" };
  const c = { id: "c", entreprise: "SOGEA Maroc", url: "https://linkedin.com/jobs/view/999999/", poste: "Communication" };
  const d = { id: "d", url: "https://linkedin.com/jobs/view/4469264591/?trk=mail" };
  assert.deepEqual([...logic.duplicates([a, b, c, d])], [["b", "a"], ["d", "a"]]);
});
test("une date déclarée n’est pas une preuve vérifiée", () => {
  assert.equal(logic.sent({ statut: "abandon" }), false);
  assert.equal(logic.sent({ statut: "abandon", date_postule: "2026-09-29" }), true);
  assert.equal(logic.proofs({ preuves: [{ type: "confirmation", le: "2026-09-29" }] }).length, 0);
  assert.equal(logic.proofs({ preuves: [{ type: "confirmation", le: "2026-09-29", verifiee: true }] }).length, 1);
});
test("l’agenda distingue les actions dues des prévisions", () => {
  const rows = logic.agenda([{ id: "a", entreprise: "Test", statut: "postule", date_postule: "2026-09-29" }], "2026-09-30");
  assert.deepEqual(rows.map(r => [r.d, r.forecast, r.qui]), [["2026-10-04", false, "agent"], ["2026-10-09", true, "vous"]]);
  assert.equal(logic.next({ statut: "pret", action_date: "2026-10-01" }, "2026-09-30").d, "2026-10-01");
});
test("un suivi explicite remplace les relances et appels automatiques", () => {
  const x = {id:"ue",entreprise:"UE",statut:"postule",date_postule:"2026-10-06",action_planifiee:{date:"2026-10-16",texte:"Vérifier le recrutement officiel"}};
  assert.equal(logic.next(x,"2026-10-06").d,"2026-10-16");
  assert.deepEqual(logic.agenda([x],"2026-10-06").map(r=>[r.d,r.forecast]),[["2026-10-16",false]]);
  assert.equal(logic.next({...x,statut:"refus"},"2026-10-06"),null);
  assert.equal(logic.next({...x,entreprise:"Sofrecom"},"2026-10-06"),null);
  assert.equal(logic.next({...x,statut:"entretien",entretien:{date:"2026-10-08"}},"2026-10-06").d,"2026-10-08");
});
test("une action planifiée invalide conserve le suivi standard",()=>{
  const x={id:"x",entreprise:"Test",statut:"postule",date_postule:"2026-10-06",action_planifiee:{date:"2026-02-30",texte:"Invalide"}};
  assert.equal(logic.next(x,"2026-10-06").d,"2026-10-11");
  assert.equal(logic.agenda([x],"2026-10-06").length,2);
});
