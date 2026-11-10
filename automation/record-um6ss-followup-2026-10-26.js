const fs = require('fs');
const path = require('path');

const dir = process.env.TRAJECTOIRE_DATA_DIR;
if (!dir || !dir.startsWith('/opt/trajectoire/runtime-data')) {
  throw new Error('Répertoire vivant non confirmé');
}

const file = path.join(dir, 'offres', 'um6ss_charge_communication_rabat_20261021.json');
const offer = JSON.parse(fs.readFileSync(file, 'utf8'));
const batchId = 'um6ss-relance-2026-10-26';
const mailId = '1a177841f76f1519';
const now = new Date().toISOString();

if (offer.entreprise !== 'Université Mohammed VI des Sciences et de la Santé (UM6SS)' ||
    offer.statut !== 'postule' || offer.date_postule !== '2026-10-21') {
  throw new Error('État de la candidature inattendu');
}
if ((offer.historique || []).some((entry) => entry.batch_id === batchId)) {
  console.log('Relance déjà enregistrée');
  process.exit(0);
}

offer.historique ||= [];
offer.historique.push({
  action: 'relance_email_envoyee',
  le: now,
  par: 'agent',
  batch_id: batchId,
  notes: `Réponse dans le fil de la candidature du 21/10, envoyée à recrutement@um6ss.ma. Message Gmail ${mailId}, label SENT vérifié ; aucun nouveau CV joint, le PDF figure dans le message initial.`,
});
offer.preuves ||= [];
offer.preuves.push({
  type: 'email_relance_envoye',
  le: now,
  verifiee: true,
  label: 'Relance UM6SS envoyée le 26/10 dans le fil de la candidature initiale',
  reference: `Gmail ${mailId}`,
  url: `https://mail.google.com/mail/u/?authuser=mohamed.benchokroun%40gmail.com#all/${mailId}`,
});
offer.statut = 'relance';
offer.nb_relances = (offer.nb_relances || 0) + 1;
offer.derniere_action = '2026-10-26';
offer.action_date = '2026-11-02';
offer.action = 'Relance unique envoyée le 26/10 ; attendre la réponse et contrôler le 02/11 sans nouvel envoi automatique.';
offer.action_planifiee = {
  date: '2026-11-02',
  texte: 'Contrôler les réponses UM6SS ; ne pas relancer de nouveau sans élément utile.',
  qui: 'agent',
};
offer.maj = now;

fs.writeFileSync(file, JSON.stringify(offer, null, 2) + '\n');
console.log('Relance UM6SS enregistrée');
