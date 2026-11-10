"use strict";
const auth = Buffer.from(process.env.TRAJECTOIRE_USERNAME + ':' + process.env.TRAJECTOIRE_PASSWORD).toString('base64');
fetch('http://127.0.0.1:8096/api/state', {headers:{Authorization:'Basic '+auth}}).then(async r=>{
  if(!r.ok) throw new Error('HTTP '+r.status);
  const s=await r.json();
  const keys=['entreprise','poste','lieu','statut','priorite','cv','url','date_postule','action','action_date','nb_relances','contacts','relance_preparee','appel_prepare','preuves','risques','offre_verifiee_le','date_limite'];
  console.log(JSON.stringify({offres:Object.fromEntries(Object.entries(s.offres).map(([id,o])=>[id,Object.fromEntries(keys.filter(k=>o[k]!==undefined).map(k=>[k,o[k]]))])),taches:s.taches,cibles:s.cibles}));
}).catch(e=>{console.error(e.message);process.exitCode=1;});
