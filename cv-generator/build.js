// Produit les 4 versions du CV à partir du .docx d'origine, en ne changeant que les textes.
const fs = require('fs');
const path = require('path');
const { DOMParser, XMLSerializer } = require('@xmldom/xmldom');
const W = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main';
const SRC = path.join(__dirname, 'orig', 'word', 'document.xml');

const V = require('./versions.js');

function build(key) {
  const v = V[key];
  const doc = new DOMParser().parseFromString(fs.readFileSync(SRC, 'utf8'), 'text/xml');
  const all = tag => Array.from(doc.getElementsByTagNameNS(W, tag));
  const kids = (el, tag) => Array.from(el.childNodes).filter(n => n.nodeType === 1 && n.localName === tag);
  const texts = p => Array.from(p.getElementsByTagNameNS(W, 't'));
  const ptext = p => texts(p).map(t => t.textContent).join('');
  const setT = (t, s) => { t.textContent = s; t.setAttribute('xml:space', 'preserve'); };
  // Met le texte dans les runs : tableau -> un élément par <w:t>, chaîne -> tout dans le 1er
  function setText(p, val) {
    const ts = texts(p);
    const arr = Array.isArray(val) ? val : [val];
    ts.forEach((t, i) => setT(t, i < arr.length ? arr[i] : ''));
    // supprimer les runs devenus vides (sauf le premier)
    ts.forEach((t, i) => { if (i >= arr.length && i > 0) { const r = t.parentNode; if (r && r.parentNode) r.parentNode.removeChild(r); } });
  }
  const findP = s => all('p').find(p => ptext(p).trim() === s);

  // ---------- Cellules principales ----------
  const bodyTbl = kids(doc.getElementsByTagNameNS(W, 'body')[0], 'tbl')[0];
  const row = kids(bodyTbl, 'tr')[0];
  const [left, right] = kids(row, 'tc');

  // ---------- Remplacements simples de titres ----------
  for (const [from, to] of Object.entries(v.labels || {})) {
    all('p').filter(p => ptext(p).trim() === from).forEach(p => setText(p, to));
  }

  // ---------- Barre latérale ----------
  const lp = kids(left, 'p');
  const idx = s => lp.findIndex(p => ptext(p).trim() === s);
  // Contact
  const iC = idx('CONTACT') >= 0 ? idx('CONTACT') : idx(v.labels?.CONTACT || 'CONTACT');
  setText(lp[iC + 1], v.ville);
  setText(lp[iC + 4], v.permis);
  // Compétences : 3 paires titre/description après le titre de section
  const iK = lp.findIndex(p => ptext(p).includes('Communication Corporate & RSE'));
  v.competences.forEach(([titre, desc], k) => {
    const pt = lp[iK + 2 * k], pd = lp[iK + 2 * k + 1];
    const ts = texts(pt); setT(ts[ts.length - 1], titre);
    setText(pd, desc);
  });
  // Expertise complémentaire : 3 lignes "— texte"
  const iE = lp.findIndex(p => ptext(p).includes('Conseil en communication institutionnelle'));
  v.expertise.forEach((s, k) => setText(lp[iE + k], ['— ', s]));
  // Langues
  (v.langues || []).forEach(([from, to]) => { const p = lp.find(p => ptext(p).trim() === from); if (p) setText(p, to); });
  // Outils : 7 lignes
  const iO = lp.findIndex(p => ptext(p).includes('Microsoft Office'));
  v.outils.forEach((s, k) => setText(lp[iO + k], ['— ', s]));
  // Centres d'intérêt
  const iI = lp.findIndex(p => ptext(p).includes('Écriture'));
  (v.interets || []).forEach((s, k) => setText(lp[iI + k], ['— ', s]));

  // ---------- Colonne principale ----------
  const rk = Array.from(right.childNodes).filter(n => n.nodeType === 1 && (n.localName === 'p' || n.localName === 'tbl'));
  const rp = rk.filter(n => n.localName === 'p');
  setText(rp.find(p => ptext(p).includes('Responsable Communication Corporate & Digitale')), v.titre);
  setText(rp.find(p => ptext(p).startsWith('Expert en communication')), v.profil);

  // Blocs d'expérience : tableau (titre / société / dates) + puces + paragraphe vide
  const tbls = rk.filter(n => n.localName === 'tbl');
  const blocs = tbls.map(t => {
    const items = [];
    let n = t.nextSibling;
    while (n) {
      if (n.nodeType === 1) {
        if (n.localName !== 'p' || ptext(n).trim() === '' || ptext(n).trim() === 'FORMATION') break;
        items.push(n);
      }
      n = n.nextSibling;
    }
    const sep = n; // paragraphe vide après le bloc (ou titre FORMATION)
    return { tbl: t, puces: items, sep };
  });
  const cles = ['mb', 'corpotex', 'emw', 'mbc', 'geantech'];
  const orig = Object.fromEntries(blocs.map((b, i) => [cles[i], b]));
  const ancre = blocs[blocs.length - 1].sep; // paragraphe vide après le dernier bloc
  // Retirer tous les blocs, puis les réinsérer dans l'ordre voulu avant l'ancre
  blocs.forEach(b => { right.removeChild(b.tbl); b.puces.forEach(p => right.removeChild(p)); });
  v.experiences.forEach((e, k) => {
    const o = orig[cles[Math.min(k, cles.length - 1)]]; // gabarit par position : garde les espacements d'origine
    const t = o.tbl.cloneNode(true);
    const tps = Array.from(t.getElementsByTagNameNS(W, 'p')).filter(p => ptext(p).trim());
    setText(tps[0], e.titre);
    setText(tps[1], e.org);
    setText(tps[2], e.dates);
    right.insertBefore(t, ancre);
    const modele = o.puces[0];
    e.puces.forEach(([label, txt]) => {
      const p = modele.cloneNode(true);
      setText(p, [label, ' ' + txt]);
      right.insertBefore(p, ancre);
    });
  });

  // Formation
  const iF = rk.findIndex(n => n.localName === 'p' && ['FORMATION', v.labels?.FORMATION].includes(ptext(n).trim()));
  const fps = Array.from(right.childNodes).filter(n => n.nodeType === 1 && n.localName === 'p');
  const titreF = fps.find(p => ['FORMATION', v.labels?.FORMATION].includes(ptext(p).trim()));
  const lignesF = [];
  let n = titreF.nextSibling;
  while (n) { if (n.nodeType === 1 && n.localName === 'p' && ptext(n).trim()) lignesF.push(n); n = n.nextSibling; }
  const modeleF = lignesF[2];
  // nouvelle première ligne : le master, en gras
  const pm = modeleF.cloneNode(true);
  setText(pm, v.formation[0]);
  Array.from(pm.getElementsByTagNameNS(W, 'jc')).forEach(j => j.setAttribute('w:val', 'left'));
  const rpr = pm.getElementsByTagNameNS(W, 'rPr')[pm.getElementsByTagNameNS(W, 'rPr').length - 1];
  if (rpr && !rpr.getElementsByTagNameNS(W, 'b').length) { const b = doc.createElementNS(W, 'w:b'); rpr.insertBefore(b, rpr.firstChild); }
  right.insertBefore(pm, lignesF[0]);
  v.formation.slice(1).forEach((s, k) => setText(lignesF[k], s));
  lignesF.slice(v.formation.length - 1).forEach(p => right.removeChild(p));

  // Dernier paragraphe du document (après le grand tableau) : minuscule, pour éviter une 2e page blanche
  const body = doc.getElementsByTagNameNS(W, 'body')[0];
  const lastP = kids(body, 'p').pop();
  if (lastP) {
    let ppr = kids(lastP, 'pPr')[0];
    if (!ppr) { ppr = doc.createElementNS(W, 'w:pPr'); lastP.insertBefore(ppr, lastP.firstChild); }
    Array.from(ppr.childNodes).filter(c => c.localName === 'spacing' || c.localName === 'rPr').forEach(c => ppr.removeChild(c));
    const sp = doc.createElementNS(W, 'w:spacing'); sp.setAttribute('w:before', '0'); sp.setAttribute('w:after', '0'); sp.setAttribute('w:line', '20'); sp.setAttribute('w:lineRule', 'exact');
    const pstyle = kids(ppr, 'pStyle')[0];
    ppr.insertBefore(sp, pstyle ? pstyle.nextSibling : ppr.firstChild);
    const rp2 = doc.createElementNS(W, 'w:rPr'); rp2.appendChild(doc.createElementNS(W, 'w:vanish')); const sz = doc.createElementNS(W, 'w:sz'); sz.setAttribute('w:val', '2'); rp2.appendChild(sz); ppr.appendChild(rp2);
  }

  const out = path.join(__dirname, 'out', key);
  fs.rmSync(out, { recursive: true, force: true });
  fs.cpSync(path.join(__dirname, 'orig'), out, { recursive: true });
  fs.writeFileSync(path.join(out, 'word', 'document.xml'), new XMLSerializer().serializeToString(doc));
  console.log('ok', key);
}

for (const k of process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(V)) build(k);
