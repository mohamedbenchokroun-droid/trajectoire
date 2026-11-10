(function (root, factory) {
  const logic = factory();
  if (typeof module === "object" && module.exports) module.exports = logic;
  else root.trajectoireSuivi = logic;
})(typeof window === "object" ? window : globalThis, function () {
  "use strict";
  const closed = new Set(["refus", "abandon", "offre", "expire", "exclu"]);
  function date(value) {
    const s = String(value || "").slice(0, 10);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return null;
    const d = new Date(s + "T12:00:00Z");
    return Number.isFinite(+d) && d.toISOString().slice(0, 10) === s ? s : null;
  }
  function addDays(value, days) {
    const s = date(value); if (!s) return null;
    const d = new Date(s + "T12:00:00Z");
    d.setUTCDate(d.getUTCDate() + days);
    return d.toISOString().slice(0, 10);
  }
  const norm = value => String(value || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  function exclusion(x) {
    return x.exclusion_motif || (/\bsofrecom\b/.test(norm(x.entreprise)) ? "Entreprise exclue de la recherche" : "");
  }
  function sent(x) {
    return !!date(x.date_postule) || ["postule", "relance", "entretien", "offre"].includes(x.statut) || (x.historique || []).some(h => ["postule", "envoye"].includes(h.action));
  }
  function next(x, today) {
    if (closed.has(x.statut) || exclusion(x) || x.doublon_de) return null;
    if (x.statut === "entretien") return { qui: "vous", kind: "itw", t: "Préparer l’entretien", d: date(x.entretien?.date) || today };
    if (date(x.action_planifiee?.date) && x.action_planifiee?.texte) return {
      qui: x.action_planifiee.qui === "vous" ? "vous" : "agent", kind: "review",
      t: x.action_planifiee.texte, d: date(x.action_planifiee.date)
    };
    if (x.appel && !x.appel.fait) return { qui: "vous", kind: "call", t: x.appel.motif || "Appeler le recruteur", d: date(x.appel.date) || today };
    if (x.blocage) return { qui: "agent", kind: "blocked", t: "Résoudre : " + x.blocage, d: date(x.action_date) || today };
    if (x.statut === "pret") return { qui: "agent", kind: "send", t: "Candidature prête · envoi prévu", d: date(x.action_date) || today };
    if (["postule", "relance"].includes(x.statut)) {
      const n = Math.max(0, Number(x.nb_relances) || 0);
      const base = date(x.date_postule), last = date(x.derniere_action);
      if (!base && !last) return { qui: "agent", kind: "blocked", t: "Vérifier la date d’envoi", d: today };
      const offset = base ? (n === 0 ? 5 : n === 1 ? 10 : 20) : (n >= 2 ? 10 : 5);
      return { qui: n === 1 ? "vous" : "agent", kind: n === 0 ? "followup" : n === 1 ? "call" : "review", t: n === 0 ? "Préparer la relance J+5" : n === 1 ? "Appel de suivi J+10" : "Faire le point à J+20", d: addDays(base || last, offset) };
    }
    if (!x.statut || x.statut === "a_postuler") return { qui: "agent", kind: "prep", t: "Préparer la candidature", d: date(x.action_date) || today };
    return null;
  }
  function canonical(value) {
    try {
      const u = new URL(value);
      if (!["https:", "http:"].includes(u.protocol)) return "";
      const job = u.hostname.endsWith("linkedin.com") && u.pathname.match(/\/jobs\/view\/(?:[^/]*-)?(\d+)\/?$/);
      if (job) return "linkedin:" + job[1];
      for (const key of [...u.searchParams.keys()]) if (/^(utm_|trk|trackingId|refId)/i.test(key)) u.searchParams.delete(key);
      u.hash = ""; u.searchParams.sort();
      return u.hostname.toLowerCase().replace(/^www\./, "") + u.pathname.replace(/\/$/, "") + u.search;
    } catch { return ""; }
  }
  function duplicates(offres) {
    const keys = new Map(), result = new Map();
    for (const x of offres) {
      const company = /\b(vinci|sogea)\b/.test(norm(x.entreprise)) ? "vinci" : norm(x.entreprise);
      const candidates = [canonical(x.url) && "url:" + canonical(x.url), x.reference_offre && company && "ref:" + company + ":" + norm(x.reference_offre)].filter(Boolean);
      const previous = candidates.map(k => keys.get(k)).find(Boolean);
      if (previous) result.set(x.id, previous.id);
      for (const k of candidates) if (!keys.has(k)) keys.set(k, previous || x);
    }
    return result;
  }
  function proofs(x) {
    return (Array.isArray(x.preuves) ? x.preuves : []).filter(p => p && p.verifiee === true && date(p.le) && ["confirmation", "email_envoye", "accuse"].includes(p.type));
  }
  function agenda(offres, today, horizon = 14) {
    const end = addDays(today, horizon), dup = duplicates(offres), entries = [];
    for (const x of offres) {
      if (dup.has(x.id)) continue;
      const n = next(x, today); if (!n) continue;
      if (n.d <= end) entries.push({ ...n, id: x.id, entreprise: x.entreprise, poste: x.poste, forecast: false });
      const base = date(x.date_postule), count = Math.max(0, Number(x.nb_relances) || 0);
      if (base && ["postule", "relance"].includes(x.statut) && !x.blocage && !x.appel && !(date(x.action_planifiee?.date) && x.action_planifiee?.texte)) {
        const milestones = [[10, "vous", "call", "Appel de suivi J+10"], [20, "agent", "review", "Faire le point à J+20"]];
        for (const [days, qui, kind, t] of milestones) {
          const d = addDays(base, days);
          if (d > n.d && d <= end && (count < 1 || days === 20)) entries.push({ id: x.id, entreprise: x.entreprise, poste: x.poste, qui, kind, t, d, forecast: true });
        }
      }
    }
    return entries.sort((a, b) => a.d.localeCompare(b.d) || a.entreprise.localeCompare(b.entreprise));
  }
  return { date, addDays, exclusion, sent, next, canonical, duplicates, proofs, agenda };
});
