const fs = require('fs');
const path = require('path');

const dir = process.env.TRAJECTOIRE_DATA_DIR;
if (!dir || !dir.startsWith('/opt/trajectoire/runtime-data')) {
  throw new Error('Répertoire vivant non confirmé');
}

const file = path.join(dir, 'offres', 'interface_graphiste_senior_6067024.json');
const offer = JSON.parse(fs.readFileSync(file, 'utf8'));
const batchId = 'interface-revue-2026-10-26';
if (offer.statut !== 'postule' || offer.date_postule !== '2026-10-20') {
  throw new Error('État de la candidature inattendu');
}
if ((offer.historique || []).some((entry) => entry.batch_id === batchId)) {
  console.log('Revue Interface déjà enregistrée');
  process.exit(0);
}

const now = new Date().toISOString();
offer.historique ||= [];
offer.historique.push({
  action: 'controle_j5_sans_relance',
  le: now,
  par: 'agent',
  batch_id: batchId,
  notes: 'Gmail contrôlé le 26/10 : accusé Workable du 20/10 seulement, aucune réponse du recruteur. Le message d’accusé vient d’une adresse noreply et le client final reste non nommé ; aucune relance envoyée sans contact fiable.',
});
offer.action = 'Aucune réponse au contrôle J+6 ; attendre et revérifier le 30/10, sans relance sur une adresse noreply.';
offer.action_date = '2026-10-30';
offer.action_planifiee = {
  date: '2026-10-30',
  texte: 'Vérifier une réponse ou un contact nominatif fiable avant toute relance ; ne pas écrire à noreply.',
  qui: 'agent',
};
offer.maj = now;

fs.writeFileSync(file, JSON.stringify(offer, null, 2) + '\n');
console.log('Revue Interface enregistrée sans envoi');
