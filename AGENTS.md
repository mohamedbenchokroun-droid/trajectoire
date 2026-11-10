# Passation — recherche d'emploi de Mohamed Benchokroun

Ce dépôt contient le système de recherche d'emploi de Mohamed. **État opérationnel au 12 octobre 2026** : la source de vérité est le cockpit vivant et ses fichiers `runtime-data/` sur Hetzner, jamais l'export Git. Les sections historiques ci-dessous ne remplacent pas les preuves et statuts du cockpit.

**Mise à jour du 9 octobre 2026 — CVthèque :** nommer les nouveaux CV avec des espaces, jamais des underscores, et ne pas inclure le nom d'un employeur dans le nom d'un CV réutilisable. Le CV Design graphique est une cinquième version générique ; les cinq PDF doivent être consultables d'un clic dans le cockpit, sans téléchargement imposé. Conserver tels quels les noms des pièces jointes historiques dans les preuves d'envoi.

## 1. Qui, quoi

- **Mohamed Benchokroun**, Témara (Maroc). Tél. 06 97 95 32 61, mohamed.benchokroun@gmail.com.
- 14 ans d'expérience : développement commercial B2B, communication corporate et événementiel institutionnel, outils digitaux (CRM no-code, automatisation, IA générative).
- Il travaille à plein temps. **Il n'a pas le temps de suivre.** Il veut que ça tourne tout seul et ne regarder qu'un tableau de bord.

## 2. Règles non négociables

**Critères**
- Maximum ~30 km de Témara : Rabat, Salé, Skhirat, Témara, Technopolis. **Pas de Casablanca.**
- **Objectif : salaire strictement supérieur à 12 000 DH net/mois**, selon le critère fixé par Mohamed le 9 octobre 2026. Quand la rémunération n'est pas publiée, l'indiquer comme non vérifiée ; ne pas inventer de chiffre.
- Grandes organisations structurées et connues : multinationales, groupes, semi-public, organisations internationales. **Pas de PME familiales.**
- Métiers : commercial, communication, marketing, design, transformation digitale.

**Secteurs exclus (motif religieux)**
- Banques et assurances conventionnelles ; crédit, microfinance, leasing.
- Hôtels qui servent de l'alcool ; jeux (SOREC, loterie) ; alcool ; tabac.
- Banques participatives : demander avant.
- **Sofrecom Maroc : ne jamais candidater ni contacter pour Mohamed.** Sa femme y travaille ; conflit d'intérêts familial signalé par Mohamed le 30/09/2026.

**Executive Master**
- Inscription à l'UIR « Leading Digital Transformation » confirmée le 7 octobre 2026 pour la promotion 2026-2027. Présenter la formation comme en cours / promotion 2026-2027, sans laisser croire que le diplôme est déjà acquis ni écrire « diplôme non obtenu » sur le CV.

**Confidentialité**
- **Jamais de noms de clients sur un support public** (LinkedIn, ReKrute, posts). Sont concernés : BEI/EIB, IFC, GIZ, Cluster EnR, CRI, Nexans et les noms d'événements.
- Formulations à utiliser : « organisations internationales », « bailleurs de fonds », « institutions publiques », « événements investisseurs régionaux ».
- Dans les CV et les mails envoyés en privé aux recruteurs, les noms sont acceptés.

**Profil public unique**
- LinkedIn et ReKrute portent un seul profil universel. Il doit parler à la fois aux recruteurs commerciaux, communication et transformation digitale.
- Seul le CV joint change d'une offre à l'autre.

**Un seul CV par entreprise**
- Si une entreprise a déjà reçu un CV, on renvoie le même, même pour un second poste.
- SOGEA a reçu le CV Communication (CV_C) pour les deux postes.

**Envoi des e-mails**
- Le CV part en **vraie pièce jointe PDF**.
- **Jamais « Fwd: »** dans l'objet, **jamais de lien Drive** dans le corps.

**Autonomie des envois**
- Depuis le 9 octobre, Mohamed donne carte blanche pour les candidatures et relances **ciblées**, lorsque l'annonce, le profil, les données requises, le canal et l'absence de doublon sont vérifiés. Ne pas demander un accord par lot. Respecter néanmoins toute confirmation ponctuelle imposée par l'outil ou le site au moment d'une action sensible.
- Ne jamais transformer une veille, un brouillon ou un formulaire commencé en « candidature envoyée » sans preuve visible. Ne pas arroser des postes hors critères pour augmenter le compteur.

**Style de communication**
- Réponses **très courtes**.
- **Regrouper toutes ses actions en une seule demande par jour.** Il s'est plaint : « j'arrive pas à suivre », « si à chaque fois tu me dis fais ci fais ça, ça prend plus de temps qu'à faire moi-même ».
- Ne jamais lui demander ce qu'on peut décider soi-même.
- Il écrit en français et en darija.

**Limites**
- Ne pas créer de compte ni inventer un mot de passe, diplôme, résultat, salaire ou expérience. Si un formulaire exige une donnée inconnue, ne pas deviner. Respecter les vérifications de sécurité et les exigences de confirmation de l'outil utilisé.
- Ne jamais faire de capture d'écran du bureau (incident de vie privée).

## 3. Les 5 CV

Les PDF publics pour consultation en ligne sont dans `cv-files/` et servis par le cockpit. Les sources de travail sont dans `cv-generator/` (quatre versions) et `automation/build-edvantis-cv.py` (version Design, fichier générique). Ne jamais remplacer dans les preuves l'ancien CV réellement envoyé.

| Clé | Fichier | Usage |
|---|---|---|
| `sales` | CV Mohamed Benchokroun Sales.pdf | Commercial, grands comptes |
| `com` | CV Mohamed Benchokroun Communication.pdf | Communication, RSE, événementiel |
| `digital` | CV Mohamed Benchokroun Transformation Digitale.pdf | Transformation digitale, adoption d'outils |
| `en` | CV Mohamed Benchokroun EN.pdf | Offres en anglais |
| `design` | CV Mohamed Benchokroun Design Graphique.pdf | Design graphique, portfolio, enseignement du design |

- Les textes sont dans `cv-generator/versions.js`. Voir le README pour régénérer.
- Les PDF ont été corrigés et vérifiés visuellement le 12/10 ; garder les noms lisibles avec espaces, et vérifier chaque nouvelle version avant publication.
- `cv-generator/lettre_modele.html` et `lettre_sogea.html` : modèles de lettre de motivation (HTML → PDF).

## 4. Canaux et méthodes qui fonctionnent

**Gmail**
- Composer via `https://mail.google.com/mail/u/0/?view=cm&fs=1&to=..&su=..&body=..`.
- Joindre le PDF depuis Drive : icône Drive, puis recherche du nom exact, puis « Ajouter en tant que pièce jointe ».

**LinkedIn « Candidature simplifiée »**
- Téléphone : 697953261 (indicatif +212).
- Disponibilité : immédiate.
- Anglais : professionnel.
- Salaire, si le champ est numérique : 20000.

**Invitations LinkedIn**
- Les notes font **200 caractères maximum** (compte gratuit).
- **Il ne reste qu'une invitation personnalisée pour ce mois** : la garder pour une cible prioritaire.

**ReKrute** (compte n° 284964)
- Profil et connexion à revérifier dans le compte, sans exposer de noms de clients sur le profil public. Mohamed a donné sa date de naissance (06/11/1988) et une indication de tranche salariale le 30/09 ; ne plus les demander mécaniquement. Une session ReKrute peut expirer : vérifier avant de conclure qu'une candidature est possible ou envoyée.

**Espace candidat VINCI** (`vinci-construction.profils.org`) : utilisé pour SOGEA.

**Canaux**
- Gmail et LinkedIn ont été utilisés et vérifiés le 12/10. Évaluer chaque canal connecté au moment de l'action ; ne pas présumer qu'un ancien blocage persiste.

## 5. Tableau de bord « Trajectoire »

- Il est dans `cockpit/trajectoire.html`. Palette mauve, police Plus Jakarta Sans 800 + Manrope, en-tête en verre flouté, pleine largeur, grande fiche centrée, clics annulables. **Il a refusé le bleu et le style navy/or.**
- En ligne : https://trajectoire.65-109-143-147.sslip.io/ sur Hetzner. Les données vivantes sont dans `/opt/trajectoire/runtime-data/` sur ce serveur ; `data/export/` n'est qu'une archive et ne doit **jamais** écraser le suivi vivant. Le serveur fournit `/api/state` et les cinq PDF consultables d'un clic.

**Champs d'une offre**
- Identité : `entreprise`, `poste`, `lieu`, `km`, `source`, `url`.
- Choix du CV : `cv` (sales|com|digital|en|design).
- Évaluation : `match`, `salaire`, `pourquoi`, `missions[]`, `risques`, `contacts[]`, `message`.
- `statut` : a_postuler | postule | relance | entretien | offre | refus | abandon | veille.
- Suivi : `action`, `qui`, `action_date`, `historique[]`, `nb_relances`, `date_postule`, `relance{}`.

**Règle de relance** : vérifier les réponses avant toute relance ; J+5 et J+10 sont des points de contrôle, pas des envois automatiques. Éviter les messages répétitifs. N'archiver à J+20 qu'après vérification des réponses et du statut.

## 6. Pipeline historique au 29/09/2026 — NE PAS UTILISER COMME ÉTAT ACTUEL

Le tableau ci-dessous est une archive. Lire les statuts dans le cockpit vivant avant toute action. Au 12/10, SOGEA et un poste UIR ont répondu négativement ; les deux autres UIR sont encore sans réponse ; l'UE, NOVEC et Edvantis ont déjà reçu des candidatures. NTU (un email commun aux deux postes), Casanet et Ciments du Maroc ont été relancés le 12/10, preuves dans leurs fiches. Ne pas redéposer un dossier déjà envoyé.

| Entreprise | Poste | Statut | CV | Postulé le | Prochaine action |
|---|---|---|---|---|---|
| SOGEA Maroc (VINCI) | Responsable digital et transformation | postulé | com (CV_C) + lettre | 29/09 | relance ~05/10 |
| SOGEA Maroc (VINCI) | Poste communication | postulé | com | 28/09 | relance ~05/10 |
| DXC Technology | Lead Power Apps Adoption | postulé | digital | 29/09 | relance 05/10 |
| DXC Technology | Business Change Manager | postulé | digital | 29/09 | relance 05/10 |
| Efekta Education (EF) | Account Director | postulé | en | 29/09 | relance 05/10. Déclaré : deal size 30k USD, prétention 20 000 DH |
| Glovo | Regional Manager North | postulé | en | 29/09 | relance 05/10. En entretien, demander si des partenaires vendent de l'alcool |
| G4S Maroc | Sales Specialist | postulé | sales | 29/09 | relance 05/10 |
| NTU International | Communication & Knowledge Mgmt Expert | postulé (mail + PDF) | en | 29/09 | relance 05/10 |
| NTU International | Senior NKE Communication & Visibility | postulé | en | 29/09 | relance 05/10 |
| Casanet (Maroc Telecom) | Account Manager | relancé | sales | avant le 26/09 | invitation + note envoyée à Jennate Benlemmouden (recrutement) le 29/09 ; relancer le 06/10 |
| Ciments du Maroc | Chef de Secteur Commercial | relancé | sales | avant le 26/09 | invitation + note envoyée à Yousra Ragouby (recrutement) le 29/09 ; relancer le 06/10 |
| LONGi Solar | Channel Sales Manager | veille | en | il y a ~1 mois | CDD, priorité basse |
| NOVEC (groupe CDG) | Responsable Développement Afrique | à postuler (ReKrute) | sales | — | bloqué par le profil ReKrute ; l'offre demande Bac+5, c'est ambitieux |
| MEDZ (groupe CDG) | Directeur Business Development | à postuler (ReKrute) | sales | — | bloqué par le profil ReKrute |
| Hilti Maroc | Account Manager Rabat | à postuler (ReKrute) | sales | — | vérifier que l'offre est ouverte |
| UIR | 2 postes communication | veille | com | — | — |
| DIORH ×2 | CX / RSE | abandonné | — | — | offres fermées |

## 7. Suite opérationnelle

1. Chaque jour, lire le cockpit vivant et les réponses Gmail/LinkedIn connectées, dédupliquer, puis vérifier les annonces récentes sur LinkedIn, ReKrute, emploi.ma, Indeed, Google Emploi, MarocAnnonces et les carrières officielles.
2. N'envoyer que les candidatures adaptées et exactes. Renseigner source, date, lieu, formation requise, salaire publié ou « non publié », CV utilisé et preuve d'envoi. Garder le même CV pour plusieurs postes chez le même employeur.
3. Vérifier les réponses aux relances NTU, Casanet et Ciments du Maroc le 19/10, sans re-relance automatique. Examiner Edvantis à partir du 14/10. UIR : respecter l'accusé de réception d'un mois avant de conclure.
4. Hilti Rabat, référence 20527, reste une piste B vérifiée le 12/10 : 2 ans de vente, permis B, expérience BTP souhaitée ; salaire non publié. LOCAMED Sales Ops/CRM exige Bac+5 ; Ericsson BOS Client Executive exige notamment 10 M USD de ventes annuelles et un réseau de dirigeants télécom, donc ne pas les envoyer en force.
5. L'automatisation Codex `trajectoire-veille-emploi-quotidienne` est active chaque jour à 7 h 30 (heure de Casablanca). Elle doit rester silencieuse si rien d'utile ne change. Vérifier qu'aucune tâche Claude parallèle ne crée de doublon.
