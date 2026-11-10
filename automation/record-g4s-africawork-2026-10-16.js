const fs = require('fs');
const path = require('path');
const dir = process.env.TRAJECTOIRE_DATA_DIR;
if (!dir || !dir.startsWith('/opt/trajectoire/runtime-data')) throw new Error('Répertoire vivant non confirmé');
const offers = path.join(dir, 'offres');
const now = new Date().toISOString();
const g4sFile = path.join(offers, 'g4s.json');
const g4s = JSON.parse(fs.readFileSync(g4sFile, 'utf8'));
if (g4s.statut !== 'postule') throw new Error('Statut G4S inattendu');
if (!(g4s.historique || []).some(x => x.batch_id === 'g4s-proof-2026-10-16')) {
  g4s.preuves ||= [];
  g4s.preuves.push({ type: 'linkedin_candidature_confirmee', verifiee: true, le: now,
    label: 'LinkedIn : Statut de la demande — Candidature envoyée, il y a 2 semaines ; offre fermée aux nouveaux dépôts',
    url: 'https://www.linkedin.com/jobs/view/4460721715/' });
  g4s.historique ||= [];
  g4s.historique.push({ action: 'Preuve de candidature vérifiée sur LinkedIn', le: now, par: 'agent', batch_id: 'g4s-proof-2026-10-16',
    notes: 'Statut de la demande = Candidature envoyée. Aucune réponse Gmail du domaine G4S depuis le 10/10. Le brouillon de relance reste non envoyé.' });
  g4s.action = 'Candidature LinkedIn confirmée le 16/10 ; offre fermée aux nouveaux dépôts. Brouillon Gmail de relance non envoyé ; aucune réponse RH identifiée.';
  g4s.action_date = '2026-10-19';
  g4s.action_planifiee = { date: '2026-10-19', texte: 'Revoir réponse G4S et utilité de la relance ; ne pas marquer refus sans preuve.', qui: 'agent' };
  g4s.maj = now;
  fs.writeFileSync(g4sFile, JSON.stringify(g4s, null, 2) + '\n');
  console.log('g4s.json: preuve ajoutée');
}
const awFile = path.join(offers, 'africawork_bd_rabat_9597129.json');
if (!fs.existsSync(awFile)) {
  const aw = {
    entreprise: 'AFRICAWORK', poste: 'Commercial / Business Developer – Rabat',
    lieu: 'Rabat', couloir: 'sales', source: 'emploi.ma — annonce employeur AFRICAWORK',
    url: 'https://www.emploi.ma/offre-emploi-maroc/commercialbusiness-developer-rabat-9597129',
    publie: '2026-09-23', offre_verifiee_le: '2026-10-16', cv: 'sales',
    priorite: 'B', match: 70, statut: 'veille', salaire: 'Non publié — seuil >12 000 DH net non vérifié',
    pourquoi: 'CDI à Rabat, Bac+3 accepté, développement commercial B2B de services de recrutement/ESN et portefeuille grands comptes ; groupe présent sur plusieurs marchés africains.',
    missions: ['Prospection et qualification de clients', 'Construction et négociation d’offres de services', 'Gestion et fidélisation de comptes B2B'],
    risques: 'Annonce antérieure de trois semaines ; salaire non publié. Accès emploi.ma bloqué le 16/10 par vérification de sécurité Cloudflare. Ne pas contourner. Expérience directe recrutement/ESN seulement souhaitée, non confirmée dans le parcours.',
    action: 'Piste nouvellement intégrée. Aucun envoi : contrôle de sécurité du site et rémunération à vérifier. Chercher un canal officiel accessible avant candidature.',
    action_date: '2026-10-19', action_planifiee: { date: '2026-10-19', texte: 'Vérifier accès normal à l’annonce, canal officiel et niveau de rémunération ; candidature ciblée si critères confirmés.', qui: 'agent' },
    historique: [{ action: 'Piste identifiée, non postulée', le: now, par: 'agent', batch_id: 'veille-2026-10-16', notes: 'Source emploi.ma et liste carrière AfricaWork ; Bac+3/CDI/Rabat vérifiés. Aucun envoi.' }], maj: now
  };
  fs.writeFileSync(awFile, JSON.stringify(aw, null, 2) + '\n');
  console.log('africawork_bd_rabat_9597129.json: piste créée');
} else console.log('africawork_bd_rabat_9597129.json: existant, aucune duplication');
