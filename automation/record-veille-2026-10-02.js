"use strict";
// Run inside the existing Trajectoire container. Default: read-only preview.
// Does not submit applications or send messages. Credentials remain in-process.
const fs = require('node:fs/promises');
const path = require('node:path');
const batch = 'veille-2026-10-02';
const day = '2026-10-02';
const apply = process.argv.includes('--apply');
const now = new Date().toISOString();
const auth = Buffer.from(process.env.TRAJECTOIRE_USERNAME + ':' + process.env.TRAJECTOIRE_PASSWORD).toString('base64');
const endpoint = 'http://127.0.0.1:8096/api/';
async function api(route, patch) {
  const r = await fetch(endpoint + route, {method: patch ? 'PATCH' : 'GET', headers: {Authorization: 'Basic ' + auth, 'Content-Type': 'application/json'}, ...(patch ? {body: JSON.stringify(patch)} : {})});
  if (!r.ok) throw new Error('API status ' + r.status);
  return r.json();
}
const addDays = (s, n) => { const d = new Date(s + 'T12:00:00Z'); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0,10); };
const contacts = [
  {ids:['uir_com','uir_cie','uir_recrutement_international_2026'],nom:'Widad LAOUFIR',role:'Directrice du Capital Humain — UIR',url:'https://www.linkedin.com/in/widad-laoufir/',note:'Bonjour Mme Laoufir, j’ai déposé mes candidatures UIR (communication, entrepreneuriat, recrutement Afrique). Mon parcours allie communication et développement B2B. Au plaisir d’échanger. Mohamed'},
  {ids:['novec'],nom:'Maryeme BENRAHO',role:'Cadre RH — NOVEC',url:'https://www.linkedin.com/in/maryeme-benraho-03b1a0128/',note:'Bonjour Mme Benraho, j’ai candidaté au poste Responsable Développement Afrique chez NOVEC. Mon parcours associe développement B2B et communication institutionnelle. Pourrions-nous échanger ? Mohamed'},
  {ids:['sogea','sogea_com'],nom:'Sofia Naciri',role:'Responsable Développement RH — SOGEA Maroc et DUMEZ Maroc',url:'https://www.linkedin.com/in/sofianaciri/',note:'Bonjour Mme Naciri, j’ai candidaté chez SOGEA en communication et au poste Responsable digital et transformation. Mon parcours relie communication, projets et outils digitaux. Échangeons ? Mohamed'},
  {ids:['dxc_bcm'],nom:'Fatima Zahra Laalou',role:'Talent Acquisition Senior — DXC Maroc',url:'https://www.linkedin.com/in/fatima-zahra-laalou-823500195/'},
  {ids:['dxc_pa'],nom:'Hajar Najem',role:'Senior Talent Acquisition — DXC Technology Morocco',url:'https://www.linkedin.com/in/hajar-najem-798719151/'},
  {ids:['ntu_com','ntu_km'],nom:'Marina Mihaila',role:'Recruitment Consultant — NTU International A/S',url:'https://www.linkedin.com/in/marina-mihaila-08b0a3167/'}
];
const gmailUrl = 'https://mail.google.com/mail/u/0/#inbox/FMfcgzQhWfWjqpRfwcfVpVFmlGRXVzTk';
const hiltiUrl = 'https://careers.hilti.group/en-gb/jobs/20527-en/account-manager-rabat/';
async function main() {
  const state = await api('state');
  const updates = [];
  for (const [id, x] of Object.entries(state.offres)) {
    if ((x.historique || []).some(h => h.batch_id === batch)) continue;
    const c = contacts.find(c => c.ids.includes(id));
    const active = ['postule','relance'].includes(x.statut);
    if (!active && id !== 'hilti') continue;
    const p = {maj:now};
    const events = [];
    if (c) {
      const entry = {nom:c.nom,role:c.role + ' — invitation envoyée le 01/10/2026 ; acceptation à vérifier',url:c.url,invitation:{date:'2026-10-01',statut:'envoyee',verifiee:true,note:c.note || null,preuve:'Interface LinkedIn : Invitation envoyée et En attente le 01/10 ; acceptation non vérifiée le 02/10.'}};
      const old = x.contacts || [];
      p.contacts = [...old.filter(v => v.url !== c.url && v.nom.toLowerCase() !== c.nom.toLowerCase()),entry];
      events.push({action:'Invitation LinkedIn',le:'2026-10-01',par:'agent',notes:c.nom + ' : ' + (c.note ? 'invitation avec note envoyée' : 'invitation simple envoyée, aucun message direct') + '. Confirmation LinkedIn vérifiée le 01/10. Acceptation non vérifiée aujourd’hui.'});
    }
    if (id.startsWith('uir_')) {
      p.preuves = [...(x.preuves || []),{type:'accuse',verifiee:true,le:day,label:'Gmail : trois accusés génériques de candidature@uir.ac.ma reçus le 01/10 (16:13 et 16:15), vérifiés ensemble ; postes non nommés dans ces emails.',url:gmailUrl}];
      p.comment = (x.comment || '') + ' Le 02/10 : trois accusés génériques UIR vérifiés dans Gmail. Délai annoncé : un mois ; aucun refus à déduire avant vérification.';
      events.push({action:'Accusés vérifiés',le:now,par:'agent',notes:'Trois emails UIR génériques, sans référence de poste ; aucune réponse personnalisée ni invitation à entretien observée.'});
    }
    if (active && /^\d{4}-\d{2}-\d{2}$/.test(x.date_postule || '')) {
      const base = x.date_postule;
      const grouped = id.startsWith('uir_') ? 'mes trois candidatures UIR (communication santé, programmes entrepreneuriat et recrutement international Afrique)' : id.startsWith('sogea') ? 'mes candidatures SOGEA en communication et transformation digitale' : id.startsWith('ntu_') ? 'mes candidatures NTU en communication et knowledge management / visibilité' : id.startsWith('dxc_') ? 'mes candidatures DXC Business Change Manager et Lead Power Apps Adoption' : 'ma candidature au poste de ' + x.poste;
      const englishRole = id.startsWith('ntu_') ? 'the Communication & Knowledge Management and Communication & Visibility opportunities' : 'the ' + x.poste + ' role';
      const text = x.cv === 'en' ? `Hello, I am following up on my application for ${englishRole}. My experience combines B2B business development, institutional communication and project coordination, with hands-on use of digital tools. I would welcome a conversation and would be happy to provide any further information. Thank you for your consideration. Best regards, Mohamed Benchokroun` : `Bonjour, je me permets de revenir vers vous concernant ${grouped}. Mon parcours associe développement B2B, communication institutionnelle et coordination de projets, avec une pratique opérationnelle des outils digitaux. Je reste disponible pour un échange et pour tout complément utile. Merci pour votre retour. Mohamed Benchokroun`;
      p.relance_preparee = {statut:'brouillon_non_envoye',prevue:addDays(base,5),texte:text,consigne:'Vérifier les réponses et l’acceptation LinkedIn avant envoi. Un seul message par entreprise ; pas de relance rapprochée après la note du 01/10. Validation ponctuelle nécessaire.'};
      if (!x.relance || !/envoy[eé]e/.test(x.relance.statut || '')) p.relance = {...p.relance_preparee,canal:'Canal à confirmer : réponse au fil existant ou LinkedIn si accepté'};
      p.action_date = addDays(base,5);
      p.action = 'Brouillon J+5 prêt : vérifier les réponses et éviter les doublons avec l’invitation du 01/10 ; aucun envoi automatique.';
      p.qui = 'agent';
      p.appel_prepare = {date:addDays(base,10),statut:'brouillon_non_effectue',script:`Bonjour, Mohamed Benchokroun à l’appareil. Je vous appelle au sujet de ${grouped}. Pourriez-vous m’indiquer si mon dossier a été orienté vers l’équipe concernée et si un complément serait utile ?`,consigne:'Numéro professionnel à vérifier. Appeler un jour ouvré uniquement, après contrôle des réponses et validation. Aucun numéro inventé.'};
      p.revue_j20 = {date:addDays(base,20),statut:'verification_a_faire',consigne:id.startsWith('uir_') ? 'Ne pas classer automatiquement. Vérifier les réponses et le délai UIR d’un mois.' : 'Vérifier les réponses et l’état réel du recrutement ; aucun classement automatique.'};
    }
    if (id === 'hilti') {
      if (x.date_postule || !['expire','veille','a_postuler'].includes(x.statut)) throw new Error('Hilti modifié, arrêt');
      Object.assign(p,{statut:'a_postuler',source:'Hilti Careers — site officiel',url:hiltiUrl,source_verifiee:hiltiUrl,reference_offre:'20527',publie:'Date de publication non affichée',date_limite:{__delete__:true},offre_verifiee_le:day,cv:'sales',priorite:'B',salaire:'Non publié ; minimum requis 15 000 DH net/mois à confirmer.',salaire_sous_seuil:{__delete__:true},entreprise_info:'Groupe international Hilti. Vérification sur son site carrières officiel.',risques:'Permis de conduire requis, non vérifié dans cette veille. Familiarité BTP souhaitée. Salaire non publié : seuil non confirmé. Date de publication inconnue ; ne pas présenter comme nouvelle annonce.',missions:['Développer les comptes et les ventes de solutions BTP à Rabat','Prospecter, réaliser des démonstrations et suivre les clients','Piloter les opportunités et le reporting commercial'],pourquoi:'Expérience B2B et relation clients transférable. Poste terrain ; expertise BTP et permis à vérifier.',action_date:day,qui:'agent',action:'Source officielle 20527 trouvée ; CV Sales et brouillon prêts. Vérifier permis, rémunération et accès au formulaire avant toute soumission.',comment:'Ancienne annonce ReKrute 183465 expirée le 10/09. Le 02/10, même poste repéré sur Hilti Careers, référence 20527, avec bouton Apply Now. Fiche conservée sans doublon ; aucun envoi.',message:'Bonjour, je souhaite vous proposer ma candidature au poste Account Manager Rabat (20527). Mon parcours de 14 ans associe développement commercial B2B, suivi de comptes, négociation et structuration des processus commerciaux. Basé à Témara, je souhaite mettre ces compétences au service du développement de votre portefeuille à Rabat. Je serais heureux d’échanger sur les besoins du secteur. Cordialement, Mohamed Benchokroun'});
      events.push({action:'Source officielle retrouvée',le:now,par:'agent',notes:'Hilti 20527 : bouton Apply Now présent, date et salaire non affichés. Ancienne source ReKrute 183465 expirée conservée dans l’historique. Aucun envoi.'});
    }
    p.historique = [...(x.historique || []),...events,{action:'Veille et préparation',le:now,par:'agent',batch_id:batch,notes:'Suivi lu en direct, brouillons et échéances préparés ; aucune candidature, relance ou invitation envoyée par cette veille.'}];
    updates.push({collection:'offres',id,before:x,patch:p});
  }
  const previousTasks = state.taches[day] || {};
  if (!(previousTasks.items || []).some(i => i.batch_id === batch)) {
    const items = [
      {texte:'UIR : trois accusés de candidature reçus, vérifiés dans Gmail',detail:'Emails génériques du 01/10 à 16:13 et 16:15 ; pas de réponse à entretien. Relance groupée préparée pour le 06/10.',fait:true},
      {texte:'Six invitations LinkedIn du 01/10 enregistrées',detail:'UIR, NOVEC, SOGEA, DXC (2), NTU ; trois avec note et trois simples. Acceptation non vérifiée aujourd’hui. Aucun nouveau contact dans cette veille.',fait:true},
      {texte:'Hilti Rabat : source officielle retrouvée, priorité B, CV Sales',detail:hiltiUrl + ' — référence 20527. Date et salaire non publiés. Permis requis à vérifier. Aucun envoi.',fait:true},
      {texte:'Relances J+5 et appels J+10 préparés sans envoi',detail:'SOGEA 03–04/10 ; lot du 29/09 : 04/10 ; NOVEC/UIR : 06/10. Appels 08, 09, 11/10 (report au lundi 12 si dimanche). Vérifier réponses et éviter les doublons avec les invitations récentes.',fait:true},
      {texte:'Qualifier les pistes C avant candidature',detail:'NOVEC Chargé Développement Afrique 186129 : Bac+5/2–3 ans, déjà une candidature Responsable ; ne pas doubler. Volkswagen Rabat : expérience automobile et structure à vérifier, salaire inconnu ; page Emploi.ma inaccessible (403).',fait:false},
      {texte:'Vérifier les prérequis Hilti et l’accès au formulaire',detail:'Minimum 15 000 DH net non confirmé et permis non vérifié. Ancienne fiche ReKrute expirée remplacée par la source officielle, sans créer un doublon.',fait:false}
    ].map(i => ({...i,responsable:'agent',batch_id:batch}));
    updates.push({collection:'taches',id:day,before:previousTasks,patch:{items:[...(previousTasks.items || []),...items],maj:now}});
  }
  console.log(JSON.stringify({mode:apply?'apply':'preview',updates:updates.map(u=>u.collection+'/'+u.id)}));
  if (!apply || !updates.length) return;
  const dir = path.join(process.env.TRAJECTOIRE_DATA_DIR,'.backups',batch+'-'+Date.now());
  await fs.mkdir(dir,{recursive:true,mode:0o700});
  for (const u of updates) {
    const current = (await api('state'))[u.collection][u.id] || {};
    if (JSON.stringify(current)!==JSON.stringify(u.before)) throw new Error('Modification concurrente : '+u.id);
    await fs.writeFile(path.join(dir,u.collection+'-'+u.id+'.json'),JSON.stringify(u.before,null,2)+'\n',{flag:'wx',mode:0o600});
    await api(u.collection+'/'+u.id,u.patch);
    const after = (await api('state'))[u.collection][u.id];
    for (const [key,value] of Object.entries(u.patch)) {
      if (value && value.__delete__) { if (key in after) throw new Error('Suppression de champ non confirmée : '+u.id+'/'+key); }
      else if (JSON.stringify(after[key])!==JSON.stringify(value)) throw new Error('Vérification échouée : '+u.id+'/'+key);
    }
    console.log(JSON.stringify({verified:u.collection+'/'+u.id}));
  }
  console.log(JSON.stringify({backup:dir,done:true}));
}
main().catch(e=>{console.error(e.message);process.exitCode=1;});
