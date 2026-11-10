const fs = require('fs');
const path = require('path');
const dir = process.env.TRAJECTOIRE_DATA_DIR;
if (!dir || !dir.startsWith('/opt/trajectoire/runtime-data')) throw new Error('Répertoire vivant non confirmé');
const now = new Date().toISOString();
const names = ['dxc_bcm.json', 'dxc_pa.json'];
const message = 'Bonjour Madame Laalou, merci d’avoir accepté mon invitation. J’ai candidaté le 29 septembre aux postes Business Change Manager et Lead Power Apps Adoption à Technopolis. Mon parcours associe développement B2B, communication et structuration de processus, avec la conception d’un CRM no-code pour les équipes. Pourriez-vous m’indiquer si mon profil peut correspondre à l’un de ces besoins, ou m’orienter vers la personne qui suit ces recrutements ? Bien cordialement, Mohamed Benchokroun.';
for (const name of names) {
  const file = path.join(dir, 'offres', name);
  const offer = JSON.parse(fs.readFileSync(file, 'utf8'));
  if (offer.entreprise !== 'DXC Technology Maroc' || offer.statut !== 'postule') throw new Error(`État inattendu: ${name}`);
  if ((offer.historique || []).some(x => x.batch_id === 'dxc-relance-2026-10-16')) { console.log(`${name}: déjà enregistré`); continue; }
  offer.historique ||= [];
  offer.historique.push({
    action: 'Relance LinkedIn envoyée à Fatima Zahra Laalou', le: now, par: 'agent',
    batch_id: 'dxc-relance-2026-10-16',
    notes: 'Un seul message commun aux deux candidatures. Confirmation visuelle LinkedIn : « Envoyé le 16/10/2026, 11:24 ». ' + message
  });
  offer.preuves ||= [];
  offer.preuves.push({ type: 'linkedin_message_envoye', verifiee: true, le: now,
    label: 'Un message unique DXC — Fatima Zahra Laalou — 16/10/2026',
    url: 'https://www.linkedin.com/in/fatima-zahra-laalou-823500195/' });
  offer.nb_relances = 1;
  offer.derniere_action = '2026-10-16';
  offer.action_date = '2026-10-23';
  offer.action = 'Relance commune envoyée le 16/10 à Fatima Zahra Laalou ; attendre une réponse, vérifier le 23/10 sans nouvel envoi automatique.';
  offer.action_planifiee = { date: '2026-10-23', texte: 'Vérifier réponse LinkedIn à la relance du 16/10 ; ne pas renvoyer de message sans élément nouveau.', qui: 'agent' };
  if (offer.relance_preparee) { offer.relance_preparee.statut = 'envoyee'; offer.relance_preparee.date_envoi = '2026-10-16'; offer.relance_preparee.texte_envoye = message; }
  if (offer.relance) { offer.relance.statut = 'envoyee'; offer.relance.date_envoi = '2026-10-16'; }
  offer.maj = now;
  fs.writeFileSync(file, JSON.stringify(offer, null, 2) + '\n');
  console.log(`${name}: relance envoyée enregistrée`);
}
