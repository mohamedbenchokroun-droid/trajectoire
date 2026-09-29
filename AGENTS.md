# Passation — recherche d'emploi de Mohamed Benchokroun

Ce dépôt contient tout le système de recherche d'emploi monté avec Claude (sept. 2026). Ce fichier permet à un autre agent (ChatGPT Codex ou autre) de reprendre le travail sans rien redemander à Mohamed. État au **29 septembre 2026**.

## 1. Qui, quoi

- **Mohamed Benchokroun**, Témara (Maroc). Tél. 06 97 95 32 61, mohamed.benchokroun@gmail.com.
- 14 ans d'expérience : développement commercial B2B, communication corporate et événementiel institutionnel, outils digitaux (CRM no-code, automatisation, IA générative).
- Il travaille à plein temps. **Il n'a pas le temps de suivre.** Il veut que ça tourne tout seul et ne regarder qu'un tableau de bord.

## 2. Règles non négociables

**Critères**
- Maximum ~30 km de Témara : Rabat, Salé, Skhirat, Témara, Technopolis. **Pas de Casablanca.**
- **15 000 DH net/mois minimum.**
- Grandes organisations structurées et connues : multinationales, groupes, semi-public, organisations internationales. **Pas de PME familiales.**
- Métiers : commercial, communication, marketing, design, transformation digitale.

**Secteurs exclus (motif religieux)**
- Banques et assurances conventionnelles ; crédit, microfinance, leasing.
- Hôtels qui servent de l'alcool ; jeux (SOREC, loterie) ; alcool ; tabac.
- Banques participatives : demander avant.

**Executive Master**
- UIR « Leading Digital Transformation » : il commence en février 2027 et il n'est pas encore admis.
- On écrit toujours **« (en cours) » sans aucune date**. C'est son choix, ne pas rouvrir le sujet.

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

**Validation**
- Tout envoi en son nom (candidature, message, relance) passe par **un « ok » de sa part, un seul par lot**.
- Il a écrit : « tu peux envoyer des messages en mon nom, je te le permets ».

**Style de communication**
- Réponses **très courtes**.
- **Regrouper toutes ses actions en une seule demande par jour.** Il s'est plaint : « j'arrive pas à suivre », « si à chaque fois tu me dis fais ci fais ça, ça prend plus de temps qu'à faire moi-même ».
- Ne jamais lui demander ce qu'on peut décider soi-même.
- Il écrit en français et en darija.

**Limites**
- Ne jamais taper ses mots de passe ni créer de compte à sa place. Il se connecte lui-même.
- Ne jamais faire de capture d'écran du bureau (incident de vie privée).

## 3. Les 4 CV

Ils sont dans `C:\Users\mbenc\OneDrive\Documents\Recherche emploi 2026\CV\`, en `.docx` et `.pdf` d'une page. Ils sont aussi sur Google Drive, sous ces noms exacts :

| Clé | Fichier | Usage |
|---|---|---|
| `sales` | CV_Mohamed_Benchokroun_Sales.pdf | Commercial, grands comptes |
| `com` | CV_Mohamed_Benchokroun_Communication.pdf (= « CV_C ») | Communication, RSE, événementiel |
| `digital` | CV_Mohamed_Benchokroun_Transformation_Digitale.pdf | Transformation digitale, adoption d'outils |
| `en` | CV_Mohamed_Benchokroun_EN.pdf | Offres en anglais |

- Les textes sont dans `cv-generator/versions.js`. Voir le README pour régénérer.
- Le design est le sien, avec barre latérale navy, photo et accents dorés. **Ne pas changer le design.**
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
- Le profil est rempli à 95 %, sans nom de client : résumé, 5 expériences, formations Bac+3, 3 langues, 15 compétences.
- **Ce qui bloque les candidatures** : il manque la **date de naissance** (obligatoire) et le **salaire actuel** (tranche obligatoire). Seul Mohamed peut les donner.
- Tant que le profil n'est pas complet, le bouton des offres affiche « Je m'identifie pour postuler ».

**Espace candidat VINCI** (`vinci-construction.profils.org`) : utilisé pour SOGEA.

**Canaux abandonnés**
- Outlook, qu'on ne peut pas automatiser.
- Le connecteur Gmail pour les pièces jointes : fichier trop lourd.

## 5. Tableau de bord « Trajectoire »

- Il est dans `cockpit/trajectoire.html`. Palette mauve, police Plus Jakarta Sans 800 + Manrope, en-tête en verre flouté, pleine largeur, grande fiche centrée, clics annulables. **Il a refusé le bleu et le style navy/or.**
- En ligne, c'est un artifact Claude avec base intégrée : https://claude.ai/artifact/QXH2qYRhYJzRxEEvsyVamr. **Cette base n'est accessible que depuis Claude.**
- Pour continuer ailleurs, la source de vérité est l'**export JSON** dans `data/export/` : `offres/*.json` (une fiche par candidature) et `cibles/*.json` (organisations à approcher).
- Il faudra soit reconstruire un tableau de bord qui lit ces fichiers (même design), soit tenir un simple fichier de suivi.

**Champs d'une offre**
- Identité : `entreprise`, `poste`, `lieu`, `km`, `source`, `url`.
- Choix du CV : `cv` (sales|com|digital|en).
- Évaluation : `match`, `salaire`, `pourquoi`, `missions[]`, `risques`, `contacts[]`, `message`.
- `statut` : a_postuler | postule | relance | entretien | offre | refus | abandon | veille.
- Suivi : `action`, `qui`, `action_date`, `historique[]`, `nb_relances`, `date_postule`, `relance{}`.

**Règle de relance** : relance à J+5, appel à J+10, classement à J+20.

## 6. Pipeline au 29/09/2026

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

## 7. Prochaines étapes

1. **Obtenir de Mohamed, en une seule question** : sa date de naissance et sa tranche de salaire actuel. Ensuite, finir le profil ReKrute et postuler à NOVEC, MEDZ et Hilti.
2. **Le 5 octobre** : relancer les 9 candidatures du 28-29/09. Préparer les textes et obtenir un seul « ok ».
3. **Le 6 octobre** : relancer Casanet et Ciments si les invitations ne sont pas acceptées.
4. **Chaque jour ouvré** : chercher de nouvelles offres (LinkedIn, ReKrute, emploi.ma, sites carrière des grands groupes et des organisations internationales à Rabat) qui respectent **toutes** les règles de la section 2. Qualifier chaque offre (match, salaire estimé, missions, CV à utiliser), puis présenter le lot à Mohamed en quelques lignes.
5. Les organisations à approcher en direct sont dans `data/export/cibles/` : AMDIE, CDG, MASEN, ICESCO, ADD, Maroc Telecom, cabinets de recrutement, réseau des organisations internationales…
6. Une tâche Claude planifiée (`automation/suivi-recherche-emploi.md`, jours ouvrés à 7 h 30) faisait ce travail quotidien. **Si Codex reprend, penser à la désactiver côté Claude pour éviter les doublons.**
