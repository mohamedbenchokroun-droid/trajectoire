# Trajectoire

Système de recherche d'emploi de Mohamed Benchokroun (Rabat – Témara) : repérage des offres, candidatures multicanal, relances automatiques et tableau de bord de suivi.

> Dépôt **privé** : il contient des données personnelles (coordonnées, textes de candidature, entreprises visées). Ne pas le rendre public.

> **Reprise par un autre agent : lire `AGENTS.md` en premier.**

## Contenu

| Dossier | Rôle |
|---|---|
| `cockpit/trajectoire.html` | Le tableau de bord « Trajectoire » : actions du jour, candidatures, fiches de poste, réseau, CV. Version autonome avec `cockpit/db-adapter.js` et `server/server.js`. |
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

## Déploiement autonome sur Hetzner

Le cockpit ne dépend plus de la base propre à Claude : `server/server.js` sert l'interface et conserve les modifications dans un dossier JSON persistant. `compose.yaml` lance le service sans port public ; le proxy HTTPS du VPS y accède sur le réseau Docker `easypanel`. Une authentification est obligatoire. Les fichiers de `data/export/` servent à initialiser `runtime-data/` **une seule fois** : ne jamais les recopier sur des données de production déjà modifiées.

L'export actuel contient les offres et les cibles, mais pas les tâches quotidiennes, le profil ni les CV PDF de la base Claude. Ces éléments ne sont donc pas synchronisés automatiquement avec l'artifact. Le déploiement du cockpit ne lance aucune recherche d'offres, candidature ou relance automatique.

Les identifiants restent dans `.env` sur le serveur et les données dans `runtime-data/` ; ces deux chemins sont ignorés par Git. Le script `deploy/install.sh` crée un secret d'accès lors du premier démarrage sans le remplacer ensuite. Le routage HTTPS utilisé sur le VPS figure dans `deploy/trajectoire-traefik.yaml`.

## Règles du projet

- Critères : 30 km autour de Témara, 15 000 DH net minimum, grandes organisations structurées.
- Secteurs exclus : banques et assurances conventionnelles, crédit, alcool, jeux, tabac.
- Aucun nom de client sur les profils publics (LinkedIn, ReKrute).
- Candidatures envoyées uniquement après validation (« ok ») ; relance J+5, appel J+10, classement J+20.
