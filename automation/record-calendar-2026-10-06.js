"use strict";
const fs=require('node:fs/promises');
const path=require('node:path');
const auth=Buffer.from(process.env.TRAJECTOIRE_USERNAME+':'+process.env.TRAJECTOIRE_PASSWORD).toString('base64');
async function api(route,patch){const r=await fetch('http://127.0.0.1:8096/api/'+route,{method:patch?'PATCH':'GET',headers:{Authorization:'Basic '+auth,'Content-Type':'application/json'},...(patch?{body:JSON.stringify(patch)}:{})});if(!r.ok)throw new Error(route+' '+r.status);return r.json();}
(async()=>{
const s=await api('state'),batch='calendrier-2026-10-06',dir=path.join(process.env.TRAJECTOIRE_DATA_DIR,'.backups',batch+'-'+Date.now());
await fs.mkdir(dir,{recursive:true,mode:0o700});
const ids=['ue_maroc_information_communication_2026','casanet','ciments','dxc_bcm','dxc_pa','ntu_com','ntu_km','novec','uir_cie','uir_recrutement_international_2026','efekta','g4s','glovo','longi','deloitte_communication_2026'];
for(const id of ids){
 const before=s.offres[id];
 if(!before||['refus','abandon'].includes(before.statut)||(before.historique||[]).some(h=>h.batch_id===batch))continue;
 const p={action_planifiee:{date:before.action_date||'2026-10-13',texte:before.action,qui:before.qui||'agent'},historique:[...(before.historique||[]),{action:'Calendrier explicite vérifié',le:new Date().toISOString(),batch_id:batch,par:'agent',notes:'Le calendrier respecte l’action décidée au lieu des rappels mécaniques J+5/J+10. Aucun envoi.'}]};
 if(id==='ue_maroc_information_communication_2026')p.preuves=(before.preuves||[]).map(x=>x.type==='envoi_email'?{...x,type:'email_envoye'}:x);
 if(id.startsWith('ntu_'))p.preuves=[...(before.preuves||[]),{type:'email_envoye',le:'2026-09-29',verifiee:true,label:'Gmail SENT — candidature et complément CV PDF anglais du 29/09',url:'https://mail.google.com/mail/u/0/#all/1a0ea58565d11fe5'}];
 const current=(await api('state')).offres[id];if(JSON.stringify(current)!==JSON.stringify(before))throw new Error('Concurrent '+id);
 await fs.writeFile(path.join(dir,id+'.json'),JSON.stringify(before),{flag:'wx',mode:0o600});await api('offres/'+id,p);
 const after=(await api('state')).offres[id];for(const[k,v]of Object.entries(p))if(JSON.stringify(after[k])!==JSON.stringify(v))throw new Error('Verify '+id+'/'+k);
 console.log(JSON.stringify({verified:id,date:p.action_planifiee.date}));
}
const day='2026-10-06', ts=(await api('state')).taches[day]||{};
if(!(ts.items||[]).some(x=>x.batch_id===batch)){
 const patch={items:[...(ts.items||[]),{texte:'Affichage calendrier : correctif testé, publication à autoriser',detail:'Les dates personnalisées sont enregistrées mais le site affiche encore ses anciens rappels J+5/J+10. Correctif : 8 tests réussis. Déploiement bloqué par le contrôle de sécurité, car reconstruction/redémarrage du service requis. Aucun redémarrage effectué ; lire les consignes dans les historiques en attendant.',fait:false,responsable:'agent',batch_id:batch}],maj:new Date().toISOString()};
 await fs.writeFile(path.join(dir,'taches-'+day+'.json'),JSON.stringify(ts),{flag:'wx',mode:0o600});
 if(JSON.stringify((await api('state')).taches[day])!==JSON.stringify(ts))throw new Error('Concurrent tasks');
 await api('taches/'+day,patch);
 if(JSON.stringify((await api('state')).taches[day].items)!==JSON.stringify(patch.items))throw new Error('Verify tasks');
}
console.log(JSON.stringify({backup:dir,done:true}));
})().catch(e=>{console.error(e.message);process.exitCode=1;});
