"use strict";
// Execute inside the Trajectoire container. Preview by default; --apply writes
// only the named live records after backing up and re-reading each one.
const fs = require('node:fs/promises');
const path = require('node:path');
const batch = 'suivi-2026-10-05';
const apply = process.argv.includes('--apply');
const now = new Date().toISOString();
const auth = Buffer.from(process.env.TRAJECTOIRE_USERNAME + ':' + process.env.TRAJECTOIRE_PASSWORD).toString('base64');
async function api(route, patch) {
  const r = await fetch('http://127.0.0.1:8096/api/' + route, {method:patch?'PATCH':'GET',headers:{Authorization:'Basic '+auth,'Content-Type':'application/json'},...(patch?{body:JSON.stringify(patch)}:{})});
  if (!r.ok) throw new Error(route+' '+r.status);
  return r.json();
}
async function main() {
const state = await api('state');
const updates = [];
function update(id, patch) {
  const before = state.offres[id] || {};
  if ((before.historique||[]).some(e=>e.batch_id===batch)) return;
  patch.historique = [...(before.historique||[]),...(patch.historique||[])];
  updates.push({collection:'offres',id,before,patch});
}
function close(id, date, ref, email, extra) {
  const x = state.offres[id];
  if (!x) throw new Error('Missing '+id);
  if (!['postule','relance','refus'].includes(x.statut)) throw new Error('Unexpected status '+id+' '+x.statut);
  update(id,{statut:'refus',maj:now,derniere_action:date,refus:{date,reference:ref,preuve_email:email,attribution:extra||'confirmée par le libellé du poste dans le courriel'},action:'Refus reçu ; aucune relance automatique. Réponse personnelle déjà envoyée par Mohamed le 05/10 : attendre uniquement un éventuel retour.',qui:'agent',action_date:{__delete__:true},relance_preparee:{__delete__:true},appel_prepare:{__delete__:true},revue_j20:{__delete__:true},historique:[{action:'Refus confirmé',le:date+'T12:00:00Z',par:'agent',batch_id:batch,notes:'Courriel '+email+' ; référence '+ref+'. '+(extra||'Poste identifié explicitement.')+' Réponse personnelle envoyée par Mohamed le 05/10 ; aucun nouvel envoi par l’agent.'}]});
}
close('sogea','2026-10-02','2026-132411','1a0fcc5ce7a03f6a');
close('sogea_com','2026-10-05','2026-131240','1a10903bb14031be');
close('uir_com','2026-10-05','CC-0926','1a10d594913acd00','Attribution au poste de communication probable (code CC), non explicitée dans le courriel ; les deux autres candidatures UIR ne sont pas closes.');

if (!state.offres.deloitte_communication_2026) {
  update('deloitte_communication_2026',{entreprise:'Deloitte Maroc',poste:'Responsable Communication, Marque Employeur & Événementiel',lieu:'à vérifier (piste publique à Casablanca, hors périmètre visé)',source:'Accusé Workday reçu dans Gmail',url:'',cv:'inconnu - ne pas inventer',priorite:'C',statut:'postule',date_postule:'2026-10-02',maj:now,salaire:'Non publié',pourquoi:'Candidature déjà envoyée par Mohamed et accusé reçu ; suivi sans doublon.',risques:'Lieu exact et CV transmis non vérifiés ; Casablanca serait hors périmètre souhaité.',action:'Attendre la décision ; ne pas renvoyer de candidature ni préparer de relance tant que la fiche officielle et le lieu ne sont pas confirmés.',qui:'agent',preuves:[{type:'accuse',verifiee:true,le:'2026-10-02',label:'Accusé Workday Deloitte, poste nommé',url:'https://mail.google.com/mail/u/0/#all/1a0fcd09aba51c04'}],historique:[{action:'Accusé de candidature',le:'2026-10-02T13:32:02Z',par:'agent',batch_id:batch,notes:'Accusé Workday reçu dans Gmail ; application antérieure à cette veille, aucun nouvel envoi.'}]});
}
if (!state.offres.ue_maroc_information_communication_2026) {
  const url='https://www.eeas.europa.eu/delegations/morocco/la-delegation-de-lunion-europeenne-au-maroc-recherche-une-charge-e-dinformation-et-de-communication_fr?s=204';
  update('ue_maroc_information_communication_2026',{entreprise:'Délégation de l’Union européenne au Maroc',poste:'Chargé(e) d’Information et de Communication',lieu:'Rabat',km:20,couloir:'com',source:'EEAS - annonce officielle',url,source_verifiee:url,publie:'2026-09-25',date_limite:'2026-10-09 18:00 (Rabat)',offre_verifiee_le:'2026-10-05',cv:'com',cv_adapte:'CV_Mohamed_Benchokroun_UE_Communication_Europass.pdf',lettre_adaptee:'Lettre_Mohamed_Benchokroun_Delegation_UE_Maroc.pdf',diplome_copie:'Diplome_Licence_Angers_Mohamed_Benchokroun.pdf',priorite:'A',match:85,statut:'a_postuler',maj:now,salaire:'47 617 MAD brut de base selon l’annonce, payable en 13 mensualités ; net non publié.',pourquoi:'Rabat ; diplôme universitaire Bac+3 vérifié ; expérience communication institutionnelle et projets internationaux pertinente.',missions:['Plan de communication, réseaux sociaux et site web','Relations médias, événements et visites officielles','Communication des projets de l’UE et diplomatie publique','Rédaction de communiqués, discours et articles'],risques:'Expérience MB Creative non encore étayée par un justificatif spécifique ; attestation Corpotex seule trouvée. CV structuré au format Europass rédigé localement, non généré par le portail officiel. Arabe/français/anglais à confirmer au niveau demandé.',action_date:'2026-10-06',qui:'agent',action:'Dossier PDF et brouillon préparés. Ajouter une preuve d’expérience en communication, vérifier le format Europass et obtenir un OK ponctuel avant l’envoi ; échéance 09/10 à 18h.',dossier_statut:'brouillon_non_envoye',message:'Madame, Monsieur, veuillez trouver ci-joint ma candidature au poste de chargé d’information et de communication : CV détaillé, lettre de motivation, copie de ma licence et justificatif d’expérience professionnelle. Je reste à votre disposition pour tout complément. Cordialement, Mohamed Benchokroun',destinataire:'DELEGATION-MOROCCO-RECRUTEMENT@eeas.europa.eu',objet:"Candidature pour le poste : Chargé(é) d'Information et de Communication - Mohamed Benchokroun",historique:[{action:'Candidature préparée',le:now,par:'agent',batch_id:batch,notes:'Source EEAS vérifiée ; aucune candidature envoyée. Trois PDFs créés ; attestation Corpotex déjà disponible. Preuve MB Creative à chercher.'}]});
}
const day='2026-10-05', beforeTasks=state.taches[day]||{};
if (!(beforeTasks.items||[]).some(x=>x.batch_id===batch)) {
  const items=[
    {texte:'Refus SOGEA x2 confirmés et clos',detail:'Digital : 02/10 réf. 2026-132411 ; communication : 05/10 réf. 2026-131240. Mohamed a répondu au second refus le 05/10 ; aucune relance automatique.',fait:true},
    {texte:'UIR : refus CC-0926 reçu, deux autres candidatures en attente',detail:'Attribution à la communication probable mais non explicite ; Mohamed a déjà répondu au refus le 05/10. Ne pas relancer le poste clos.',fait:true},
    {texte:'Deloitte : accusé Workday enregistré',detail:'Responsable Communication, Marque Employeur & Événementiel ; reçu le 02/10. Lieu et CV transmis à vérifier ; aucune nouvelle candidature.',fait:true},
    {texte:'UE Maroc : dossier prioritaire A à finaliser avant le 09/10 18h',detail:'CV détaillé, lettre et copie de licence préparés. Preuve de cinq ans de communication MB Creative non trouvée ; attestation Corpotex disponible. Aucun email envoyé.',fait:false}
  ].map(x=>({...x,responsable:'agent',batch_id:batch}));
  updates.push({collection:'taches',id:day,before:beforeTasks,patch:{items:[...(beforeTasks.items||[]),...items],maj:now}});
}
console.log(JSON.stringify({mode:apply?'apply':'preview',updates:updates.map(x=>x.collection+'/'+x.id),liveStatuses:Object.fromEntries(['sogea','sogea_com','uir_com','uir_cie','uir_recrutement_international_2026'].map(id=>[id,state.offres[id]?.statut]))}));
if (!apply) process.exit(0);
const dir=path.join(process.env.TRAJECTOIRE_DATA_DIR,'.backups',batch+'-'+Date.now());
await fs.mkdir(dir,{recursive:true,mode:0o700});
for (const u of updates) {
  const current=(await api('state'))[u.collection][u.id]||{};
  if (JSON.stringify(current)!==JSON.stringify(u.before)) throw new Error('Concurrent modification '+u.id);
  await fs.writeFile(path.join(dir,u.collection+'-'+u.id+'.json'),JSON.stringify(u.before,null,2)+'\n',{flag:'wx',mode:0o600});
  await api(u.collection+'/'+u.id,u.patch);
  const after=(await api('state'))[u.collection][u.id];
  for (const [k,v] of Object.entries(u.patch)) {
    if (v&&v.__delete__) {if(k in after)throw new Error('Delete not verified '+u.id+'/'+k);}
    else if(JSON.stringify(after[k])!==JSON.stringify(v))throw new Error('Verify failed '+u.id+'/'+k);
  }
  console.log(JSON.stringify({verified:u.collection+'/'+u.id}));
}
console.log(JSON.stringify({backup:dir,done:true}));
}
main().catch(e=>{console.error(e.message);process.exitCode=1;});
