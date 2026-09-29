# Trajectoire

Système de recherche d'emploi de Mohamed Benchokroun (Rabat – Témara) : repérage des offres, candidatures multicanal, relances automatiques et tableau de bord de suivi.

> Dépôt **privé** : il contient des données personnelles (coordonnées, textes de candidature, entreprises visées). Ne pas le rendre public.

> **Reprise par un autre agent : lire `AGENTS.md` en premier.**

## Contenu

| Dossier | Rôle |
|---|---|
| `cockpit/trajectoire.html` | Le tableau de bord « Trajectoire » (artifact Claude avec base de données partagée) : actions du jour, candidatures, fiches de poste, réseau, CV. |
| `cv-generator/` | Génération des 4 CV (Sales, Communication, Transformation digitale, Anglais) dans le design Word d'origine, sans toucher à la mise en page. |
| `data/seed.js` | Données initiales : offres qualifiées, organisations cibles, tâches, mot du coach. |
| `automation/suivi-recherche-emploi.md` | Consignes du suivi automatique quotidien (jours ouvrés, 7 h 30). |

## Générer les CV

Prérequis : Windows, Microsoft Word, Node.js. Le fichier Word d'origine (`orig/`) n'est pas versionné : il reste en local dans `C:\Users\mbenc\cvsrc`.

```bash
cd cv-generator
npm install          # @xmldom/xmldom
node build.js        # applique les textes de versions.js au design d'origine
powershell -File pack.ps1   # .docx + export PDF page 1
```

Les textes de chaque version sont dans `versions.js`.

## Règles du projet

- Critères : 30 km autour de Témara, 15 000 DH net minimum, grandes organisations structurées.
- Secteurs exclus : banques et assurances conventionnelles, crédit, alcool, jeux, tabac.
- Aucun nom de client sur les profils publics (LinkedIn, ReKrute).
- Candidatures envoyées uniquement après validation (« ok ») ; relance J+5, appel J+10, classement J+20.
