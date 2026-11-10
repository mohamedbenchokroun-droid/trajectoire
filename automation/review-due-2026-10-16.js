const fs = require('fs');
const path = require('path');
const dir = process.env.TRAJECTOIRE_DATA_DIR;
if (!dir || !dir.startsWith('/opt/trajectoire/runtime-data')) throw new Error('Répertoire vivant non confirmé');
const now = new Date().toISOString();
function change(name, expected, edit) {
  const file = path.join(dir, 'offres', name);
  const offer = JSON.parse(fs.readFileSync(file, 'utf8'));
  if (offer.statut !== expected) throw new Error(`${name}: statut inattendu ${offer.statut}`);
  if ((offer.historique || []).some(x => x.batch_id === 'revue-2026-10-16')) { console.log(`${name}: déjà revu`); return; }
  edit(offer);
  offer.historique ||= [];
  offer.historique.push({ action: 'Revue ciblée du 16 octobre', le: now, par: 'agent', batch_id: 'revue-2026-10-16', notes: offer.action });
  offer.maj = now;
  fs.writeFileSync(file, JSON.stringify(offer, null, 2) + '\n');
  console.log(`${name}: ${offer.statut}; prochaine action ${offer.action_date || 'aucune'}`);
}
change('icesco_designer_2026.json', 'veille', o => {
  o.statut = 'abandon';
  o.priorite = 'C';
  o.offre_verifiee_le = '2026-10-16';
  o.salaire = 'Non publié';
  o.risques = 'Affiche officielle vérifiée : Master degree requis ; diplôme obtenu Bac+3. 5 années d’expérience et maîtrise de deux langues ICESCO aussi demandées. Salaire non publié.';
  o.action = 'Écart de diplôme éliminatoire vérifié sur l’affiche officielle 2026 : Master requis, Bac+3 obtenu. Ne pas postuler ni envoyer de demande d’informations pour ce poste.';
  o.action_date = null;
  o.action_planifiee = null;
});
change('ue_maroc_information_communication_2026.json', 'postule', o => {
  o.action = 'Gmail vérifié le 16/10 : aucun retour identifié de la Délégation. La page officielle décrit toujours la procédure après clôture, sans résultat publié ; candidature maintenue en attente, aucun rappel envoyé.';
  o.action_date = '2026-10-23';
  o.action_planifiee = { date: '2026-10-23', texte: 'Vérifier Gmail et clôture officielle de la procédure UE ; ne pas classer refus sans preuve.', qui: 'agent' };
});
