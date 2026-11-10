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

Les cinq PDF privés sont placés dans `cv-files/` (ignoré par Git), monté en lecture seule dans le conteneur. Les liens `/cv/{sales,com,digital,en,design}.pdf` exigent la même authentification que le cockpit et s'ouvrent directement dans le navigateur. Les noms proposés à l'enregistrement utilisent des espaces, sans underscore ; le CV Design graphique reste réutilisable et n'est pas nommé d'après un employeur. Le déploiement ne doit jamais recopier `data/export/` sur `runtime-data/`.

## Règles du projet

- Critères : environ 30 km autour de Témara, rémunération recherchée strictement supérieure à 12 000 DH net/mois, grandes organisations structurées. Une rémunération absente de l'annonce reste non vérifiée.
- Secteurs exclus : banques et assurances conventionnelles, crédit, alcool, jeux, tabac.
- Aucun nom de client sur les profils publics (LinkedIn, ReKrute).
- Mohamed a donné carte blanche depuis le 9 octobre 2026 pour les candidatures et relances ciblées lorsque l'annonce, l'adéquation, les données requises, le canal et l'absence de doublon sont vérifiés. Une preuve d'envoi est indispensable avant de marquer une candidature comme envoyée. J+5 et J+10 sont des points de contrôle, pas des envois automatiques ; classement J+20 seulement après vérification.

## Reprise par Claude

Lire [`PASSATION CLAUDE.md`](PASSATION%20CLAUDE.md) et `AGENTS.md`. L'archive privée de passation contient aussi un instantané du serveur et les cinq CV. Les mots de passe et clés privées n'y figurent pas.
