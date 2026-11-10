"use strict";

const base = "http://127.0.0.1:8096";
const authorization = "Basic " + Buffer.from(
  process.env.TRAJECTOIRE_USERNAME + ":" + process.env.TRAJECTOIRE_PASSWORD
).toString("base64");
const headers = { Authorization: authorization };

async function main() {
  const page = await fetch(base + "/", { headers });
  if (!page.ok) throw new Error("Cockpit indisponible : " + page.status);
  const html = await page.text();
  if (!html.includes("Voir le CV") || !html.includes("/cv/design.pdf")) {
    throw new Error("CVthèque non mise à jour dans le cockpit");
  }
  for (const key of ["sales", "com", "digital", "en", "design"]) {
    const response = await fetch(base + "/cv/" + key + ".pdf", { headers });
    if (!response.ok) throw new Error("CV " + key + " indisponible : " + response.status);
    if (response.headers.get("content-type") !== "application/pdf" ||
        !response.headers.get("content-disposition")?.startsWith("inline; filename=")) {
      throw new Error("CV " + key + " non consultable en ligne");
    }
    if (response.headers.get("content-disposition").includes("_")) {
      throw new Error("Nom du CV " + key + " contient un underscore");
    }
    const bytes = Buffer.from(await response.arrayBuffer());
    if (bytes.subarray(0, 5).toString() !== "%PDF-") throw new Error("PDF " + key + " invalide");
    console.log(key + " : consultable (" + bytes.length + " octets)");
  }
  const privateResponse = await fetch(base + "/cv/design.pdf");
  if (privateResponse.status !== 401) throw new Error("Protection d'accès du CV absente");
}

main().catch(error => { console.error(error); process.exitCode = 1; });
