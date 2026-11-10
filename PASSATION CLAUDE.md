# Passation de Trajectoire à Claude — 28 octobre 2026

## À lire d'abord

Mohamed Benchokroun souhaite que Claude reprenne le développement du cockpit et le suivi quotidien de sa recherche d'emploi, avec très peu d'interventions de sa part. Lire `AGENTS.md` pour ses critères et préférences. Les données de candidature sont personnelles : garder le dépôt et les copies privés.

Le cockpit est à <https://trajectoire.65-109-143-147.sslip.io/>. Le lien de passation reçu de Mohamed ouvre une session privée sur ce site et donne accès à l'archive du projet. Ce lien est une clé d'accès : ne pas le publier, ne pas le mettre dans un dépôt ou un message à un tiers.

## Contenu de l'archive

- `source-locale/` : copie du projet de travail au 28/10, avec les modifications encore absentes du dépôt GitHub privé. **C'est la base à utiliser pour modifier le code.**
- `serveur-au-28-10/` : code réellement déployé, cinq CV PDF et copie de `runtime-data/` à la date de la passation. Comparer avec le cockpit avant d'agir : cette copie vieillit dès sa création.
- `trajectoire-history.bundle` : historique Git disponible localement ; le dépôt privé est <https://github.com/mohamedbenchokroun-droid/trajectoire>. Le dépôt GitHub est actuellement en retard sur `source-locale/`.
- `MANIFESTE.json` : empreintes SHA-256 et taille des éléments de l'archive.

Ne **jamais** recopier `data/export/` ou la copie `serveur-au-28-10/runtime-data/` sur la production : cela écraserait les candidatures et relances plus récentes.

## État au 28 octobre

Le serveur contient 39 offres : 15 `postule`, 3 `relance`, 5 `refus`, 6 `abandon`, 5 `veille`, 4 `a_postuler`, 1 `pret`. Les statuts et preuves détaillés sont dans les fiches du cockpit. Un e-mail de relance à l'UM6SS a été envoyé le 26/10, preuve dans sa fiche. Une alerte LinkedIn du 27/10 signale un message de **Fatima Zahra Laalou, recruteuse DXC Technology Maroc**. L'alerte Gmail ne contient pas le texte du message : ne pas déduire qu'il concerne une candidature précise ni lui répondre sans le lire. Le 28/10, eCarsTrade « Team Lead – Key Account Management, Northern Africa » a été ajouté en `veille` ; aucun dossier envoyé, salaire et adéquation de management à vérifier.

Les cinq CV PDF sont dans `cv-files/`, consultables par clic depuis le cockpit. Garder le même CV pour plusieurs postes chez un même employeur. Ne pas modifier rétroactivement le nom ou la version du CV joint à une candidature déjà envoyée.

## Exploitation et déploiement

- Serveur Hetzner : `root@65.109.143.147`. Sur **cet ordinateur**, la clé SSH utilisée précédemment se trouve dans `C:\Users\mbenc\.ssh\id_ed25519`. La clé privée n'est pas incluse dans l'archive.
- Répertoire de production : `/opt/trajectoire`. Les données vivantes sont dans `/opt/trajectoire/runtime-data/`. Le conteneur est lancé par Docker Compose ; `deploy/install.sh` décrit l'installation initiale. L'authentification du cockpit vient de `/opt/trajectoire/.env`, également exclu de l'archive.
- Avant tout déploiement : lire l'état vivant, sauvegarder `runtime-data/`, comparer le code déployé avec `source-locale/`, tester les changements, puis ne déployer que les fichiers nécessaires. **Ne jamais remplacer les données vivantes par un export Git ou une archive.**
- Le lien de passation permet l'édition des fiches du cockpit et le téléchargement du projet. Modifier le code exécuté sur le serveur nécessite un accès de développement distinct (SSH ou GitHub + déploiement). Ne pas supposer que l'accès au site donne un shell sur le serveur.

## Connexions externes et automatisation

Les autorisations Gmail, LinkedIn, GitHub, ReKrute et les connecteurs MCP de Codex ne sont **pas transférables** à Claude. Mohamed devra connecter dans Claude les services nécessaires, avec ses propres autorisations. Ne pas demander ou copier de mot de passe ni de clé privée dans les messages. Vérifier chaque accès avant de l'utiliser.

La veille quotidienne Codex `trajectoire-veille-emploi-quotidienne` n'est pas portable automatiquement. Si Claude met en place sa propre veille, éviter deux automatisations parallèles qui pourraient envoyer des candidatures ou relances en double. Les règles de la veille figurent dans `AGENTS.md` et `automation/suivi-recherche-emploi.md` ; la carte blanche de Mohamed du 9 octobre autorise les envois ciblés et exacts, avec preuve, mais pas les envois de masse, les données inventées ou la création de comptes.

## Première reprise recommandée

1. Ouvrir le lien de passation puis le cockpit. Lire les fiches et vérifier les réponses récentes avant tout envoi.
2. Télécharger l'archive, travailler dans `source-locale/` et comparer au code du serveur.
3. Lire le message LinkedIn de la recruteuse DXC, puis mettre à jour la fiche appropriée seulement si son contenu confirme le lien avec une candidature.
4. Vérifier les offres et relances dues ; conserver une preuve et la date de toute action réellement envoyée.

