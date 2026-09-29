(function () {
  "use strict";

  const listeners = { offres: new Set(), cibles: new Set(), taches: new Set(), profil: new Set() };
  let state = null;
  let timer = null;

  function emit() {
    if (!state) return;
    for (const name of ["offres", "cibles", "taches"]) {
      const docs = Object.entries(state[name] || {}).map(([id, data]) => ({ id, data: () => data }));
      for (const cb of listeners[name]) cb({ docs });
    }
    const profile = state.profil?.chiffres;
    for (const cb of listeners.profil) cb({ exists: !!profile, data: () => profile || {} });
  }

  async function refresh() {
    const response = await fetch("/api/state", { cache: "no-store" });
    if (!response.ok) throw new Error("Chargement impossible : " + response.status);
    state = await response.json();
    emit();
  }

  function subscribe(name, callback, onError) {
    const wrapped = value => {
      try { callback(value); } catch (error) { onError?.(error); }
    };
    listeners[name].add(wrapped);
    if (state) {
      if (name === "profil") wrapped({ exists: !!state.profil?.chiffres, data: () => state.profil?.chiffres || {} });
      else wrapped({ docs: Object.entries(state[name] || {}).map(([id, data]) => ({ id, data: () => data })) });
    }
    return () => listeners[name].delete(wrapped);
  }

  const db = {
    collection(name) {
      if (!["offres", "cibles", "taches"].includes(name)) throw new Error("Collection inconnue");
      return { onSnapshot: (callback, onError) => subscribe(name, callback, onError) };
    },
    doc(path) {
      const [name, id] = path.split("/");
      if (!listeners[name] || !id) throw new Error("Document inconnu");
      return {
        onSnapshot: (callback, onError) => {
          if (path !== "profil/chiffres") throw new Error("Abonnement non pris en charge");
          return subscribe("profil", callback, onError);
        },
        async update(patch) {
          const response = await fetch("/api/" + encodeURIComponent(name) + "/" + encodeURIComponent(id), {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(patch)
          });
          if (!response.ok) throw new Error("Enregistrement impossible : " + response.status);
          await refresh();
        }
      };
    }
  };

  window.trajectoireDB = {
    async use() {
      await refresh();
      if (!timer) timer = setInterval(() => refresh().catch(() => {}), 15000);
      return db;
    }
  };
})();
