// Contenu des 4 versions du CV (même design, seuls les textes changent)
const MASTER_FR = 'Executive Master Leading Digital Transformation — UIR, promotion 2026-2027';
const FORMATION_FR = [
  MASTER_FR,
  "Licence Droit, Économie, Gestion — Ingénierie des Services, Université d'Angers (2011)",
  'Certification Google — Fondamentaux du Marketing Digital (2019)',
];
const OUTILS_FR = [
  'Microsoft 365',
  'IA générative : ChatGPT, Claude, Gemini, Copilot, Mistral',
  'No-Code : Lovable, V0',
  'Adobe CC (Photoshop, Illustrator, InDesign, After Effects, Premiere Pro)',
  'Canva, Blender, SketchUp',
  'ERP / CRM : Odoo, Dolibarr',
  'Automatisation : n8n, ManyChat',
];
const EVENTS = 'Guelmim Investor Day (2 éditions), Essaouira Investor Day, Solar Rooftop 500, Nexans Climate Summit, 20 ans BEI, SheWins Arabia';

const MB = { cle: 'mb', titre: 'Consultant en Communication Institutionnelle & Événementiel', org: 'MB Creative – Rabat', dates: 'Sept. 2021 – Présent' };
const CPX = { cle: 'corpotex', titre: 'Responsable Commercial B2B & Solutions Digitales', org: 'Corpotex (ex Marc Yates SARL) – Témara / Casablanca', dates: 'Sept. 2020 – Présent' };
const EMW = { cle: 'emw', titre: 'Responsable Commercial & Développement Grands Comptes', org: 'E-Maroc Wave — Rabat', dates: 'Oct. 2015 – Sept. 2020' };
const MBC = { cle: 'mbc', titre: 'Responsable Communication', org: 'Maroc Business Consulting — Rabat', dates: 'Juil. 2014 – Oct. 2015' };
const GEA = { cle: 'geantech', titre: 'Chargé Marketing et Communication', org: 'Geantech Agency S.A.R.L. — Rabat', dates: 'Avr. 2012 – Juin 2014' };

const baseFR = {
  ville: ['Rabat / Témara, Maroc'],
  permis: 'Permis B',
  outils: OUTILS_FR,
  formation: FORMATION_FR,
};

module.exports = {
  // ======================= COMMUNICATION =======================
  Communication: {
    ...baseFR,
    titre: 'Responsable Communication Corporate & Digitale',
    profil: "14 ans d'expérience en communication et développement de projets. Pour des organisations comme la BEI, l'IFC et la GIZ, je cadre les besoins, construis la proposition, coordonne les intervenants et livre les contenus et événements. En parallèle, je développe des comptes B2B et structure leur suivi commercial avec des outils digitaux.",
    competences: [
      ['Communication Corporate & RSE :', "Définition et déploiement de stratégies de communication interne/externe, communication digitale, plan d'action RSE & engagement citoyen, relations publiques et institutionnelles"],
      ['Création de Contenus & Médias', "Conception et production de contenus éditoriaux, création graphique, retouche d'image, montage vidéo et Motion Design."],
      ['Événementiel & Coordination', "Pilotage d'événements de A à Z, scénographie, coordination des parties prenantes (internes/externes), logistique et présence sur site."],
    ],
    expertise: ['Conseil en communication institutionnelle', 'Direction de projets événementiels', 'Supervision de production visuelle'],
    experiences: [
      { ...MB, puces: [
        ['Stratégie & Coordination :', "Cadrage de la communication interne et externe pour la BEI, l'IFC, la GIZ et le Cluster EnR ; coordination des parties prenantes et validation des livrables."],
        ['Création & Production de Contenus :', 'Conception et production globale de contenus éditoriaux, supports graphiques, identités visuelles et contenus audiovisuels / Motion Design.'],
        ['Événements Institutionnels :', "Pilotage de la note de conception à la mise en œuvre sur site. Références : " + EVENTS + '.'],
        ['Communication Digitale :', "Gestion de la présence en ligne, coordination avec l'ensemble des parties prenantes internes et externes."],
      ] },
      { ...CPX, puces: [
        ['Développement B2B :', 'Prospection, négociation et fidélisation de comptes professionnels dans les secteurs textile, médical et EPI ; offres adaptées aux besoins des clients.'],
        ['Pilotage commercial :', 'Coordination des équipes et suivi des dossiers, de la proposition à la livraison et au recouvrement.'],
        ['Structuration digitale :', "Conception d'un CRM no-code et de workflows pour les devis, les relances et le reporting."],
      ] },
      { ...EMW, puces: [
        ['Développement grands comptes :', 'Prospection, qualification des besoins, propositions commerciales et négociation auprès de clients au Maroc et sur des marchés africains.'],
        ['Pilotage des comptes :', 'Suivi de la relation client et coordination des projets, de la commande à la livraison des supports corporate.'],
      ] },
      { ...MBC, puces: [
        ['Communication Digitale & Médias :', 'Stratégie digitale, site e-commerce www.youpi.co.ma, animation de communauté et campagnes emailing.'],
      ] },
      { ...GEA, puces: [
        ['Stratégie & Création :', 'Élaboration de la stratégie marketing, création graphique et déploiement des supports de communication visuelle.'],
      ] },
    ],
  },

  // ======================= SALES =======================
  Sales: {
    ...baseFR,
    titre: 'Responsable Développement Commercial B2B & Grands Comptes',
    profil: "14 ans d'expérience en développement B2B, gestion de comptes et coordination de projets au Maroc et en Afrique. Je mène la prospection, construis des offres adaptées, négocie et accompagne les clients jusqu'à la livraison. Chez Corpotex, j'ai structuré le suivi commercial avec un CRM no-code ; mon expérience en communication renforce la qualité des propositions et la relation avec les décideurs.",
    competences: [
      ['Développement Commercial B2B :', 'Prospection, ouverture et négociation de comptes stratégiques, cycle de vente complet, marchés Maroc & Afrique.'],
      ['Pilotage & Structuration', "Animation d'équipes commerciales et opérationnelles, process de vente, CRM, tableaux de bord et reporting."],
      ['Relation Institutionnelle', 'Interface avec les organisations internationales (BEI, IFC, GIZ), les institutions publiques et les directions générales.'],
    ],
    expertise: ['Communication corporate & événementiel', 'Supports commerciaux & contenus visuels', 'No-Code, automatisation & IA'],
    experiences: [
      { ...CPX, puces: [
        ['Développement B2B :', 'Prospection, construction d’offres, négociation et fidélisation de comptes professionnels dans les secteurs textile, médical et EPI.'],
        ['Cycle commercial :', 'Coordination des équipes commerciales et opérationnelles ; suivi des dossiers du premier contact à la livraison et au recouvrement.'],
        ['CRM & pilotage :', "Conception d'un CRM no-code réunissant pipeline, devis, relances et reporting pour fiabiliser le suivi des opportunités."],
      ] },
      { ...MB, puces: [
        ['Relation Institutionnelle :', "Conseil et pilotage de projets pour la BEI, l'IFC, la GIZ et le Cluster EnR : cadrage, coordination des prestataires et validation des livrables."],
        ['Événementiel Investisseurs :', "Direction de bout en bout d'événements institutionnels. Projets phares : " + EVENTS + '.'],
      ] },
      { ...EMW, puces: [
        ['Grands comptes :', 'Prospection et développement de comptes stratégiques au Maroc et sur des marchés africains.'],
        ['Vente B2B :', 'Qualification des besoins, élaboration de propositions, négociation et suivi de la relation client.'],
        ['Exécution des projets :', 'Coordination des livrables corporate, dont catalogues, supports commerciaux et contenus audiovisuels.'],
      ] },
      { ...MBC, puces: [
        ['Communication Digitale & E-commerce :', 'Pilotage de la stratégie digitale, administration du site e-commerce www.youpi.co.ma, animation de communauté et campagnes emailing.'],
      ] },
      { ...GEA, puces: [
        ['Développement Commercial & Marketing :', 'Élaboration de la stratégie marketing, prospection et création des supports de communication visuelle.'],
      ] },
    ],
  },

  // ======================= TRANSFORMATION DIGITALE =======================
  Transformation_Digitale: {
    ...baseFR,
    titre: 'Chef de Projet Transformation Digitale & Business Solutions',
    profil: "14 ans d'expérience en développement commercial et coordination de projets, avec une pratique directe des outils digitaux. Chez Corpotex, j'ai conçu un CRM no-code pour suivre les opportunités, les devis et les relances. Je pars des besoins des équipes, structure les processus et accompagne l'usage de l'outil dans le travail quotidien.",
    competences: [
      ['Transformation & Adoption :', "Cadrage des besoins métier, déploiement d'outils, conduite du changement et adoption par les équipes."],
      ['No-Code, Automatisation & IA', 'CRM sur mesure, workflows automatisés (n8n, ManyChat), IA générative appliquée aux métiers.'],
      ['Pilotage par la Donnée', 'Tableaux de bord, indicateurs de performance, optimisation des process commerciaux et opérationnels.'],
    ],
    expertise: ['Gestion de projets multi-acteurs', 'Communication du changement', 'Développement commercial B2B'],
    experiences: [
      { ...CPX, puces: [
        ['CRM No-Code sur Mesure :', "Conception et déploiement d'un CRM réunissant pipeline, devis, relances et reporting, utilisé par les équipes commerciales et opérationnelles."],
        ['Automatisation des Flux :', 'Workflows n8n et ManyChat pour les relances et la communication ; tableaux de bord de suivi par canal.'],
        ['Conduite du Changement :', "Structuration des process de vente et de la chaîne de valeur, accompagnement des équipes dans l'adoption des nouveaux outils et de l'IA générative."],
        ['Développement B2B :', 'Gestion et négociation de comptes stratégiques (textile, médical, EPI).'],
      ] },
      { ...MB, puces: [
        ['Gestion de Projets Multi-Acteurs :', "Pilotage de projets pour la BEI, l'IFC, la GIZ et le Cluster EnR : cadrage, planning, coordination des prestataires, livrables."],
        ['Dispositifs Digitaux :', "Présence en ligne et outils digitaux d'événements majeurs. Projets phares : " + EVENTS + '.'],
      ] },
      { ...EMW, puces: [
        ['Développement grands comptes :', 'Prospection, propositions et négociation pour des clients au Maroc et sur des marchés africains.'],
        ['Suivi et production :', 'Coordination des projets clients et des contenus corporate, dont catalogues, vidéo et motion design.'],
      ] },
      { ...MBC, puces: [
        ['E-commerce & Digital :', 'Administration du site e-commerce www.youpi.co.ma, pilotage de la stratégie digitale, campagnes emailing et animation de communauté.'],
      ] },
      { ...GEA, puces: [
        ['Stratégie & Création :', 'Élaboration de la stratégie marketing, création graphique et déploiement des supports de communication visuelle.'],
      ] },
    ],
  },

  // ======================= ANGLAIS =======================
  EN: {
    labels: {
      'COMPETENCES CLES': 'KEY SKILLS', 'EXPERTISE COMPLÉMENTAIRE': 'ADDITIONAL EXPERTISE', 'LANGUES': 'LANGUAGES',
      'OUTILS': 'TOOLS', "CENTRES D'INTÉRÊT": 'INTERESTS', 'PROFIL': 'PROFILE', 'EXPÉRIENCE PROFESSIONNELLE': 'PROFESSIONAL EXPERIENCE', 'FORMATION': 'EDUCATION',
    },
    ville: ['Rabat / Témara, Morocco'],
    permis: 'Driving licence',
    langues: [['Arabe', 'Arabic'], ['Français', 'French'], ['Anglais', 'English'], ['Espagnol', 'Spanish'], ['Allemand', 'German']],
    interets: ['Writing (novels & essays)', 'Nutrition & health', 'Reading', 'Travel'],
    titre: 'Business Development & Communications Manager',
    profil: 'B2B business development and communications manager with 14 years of experience in Morocco and Africa. I prospect for accounts, shape proposals, negotiate and coordinate delivery. Alongside institutional projects for the EIB, IFC and GIZ, I manage multi-sector client relationships at Corpotex and built a no-code CRM for quotations, follow-ups and reporting.',
    competences: [
      ['Business Development :', 'Prospecting, key account negotiation, full B2B / B2G sales cycle, Morocco & Africa.'],
      ['Communications & Events', 'Institutional communications, investor events, content production, video and motion design.'],
      ['Stakeholder Relations', 'Working with the EIB, IFC, GIZ, public institutions and senior management.'],
    ],
    expertise: ['Visibility of donor-funded programmes', 'Team leadership & sales process', 'No-code, automation & AI'],
    outils: [
      'Microsoft 365',
      'Generative AI: ChatGPT, Claude, Gemini, Copilot, Mistral',
      'No-code: Lovable, V0',
      'Adobe CC (Photoshop, Illustrator, InDesign, After Effects, Premiere Pro)',
      'Canva, Blender, SketchUp',
      'ERP / CRM: Odoo, Dolibarr',
      'Automation: n8n, ManyChat',
    ],
    experiences: [
      { cle: 'mb', titre: 'Communications & Events Consultant', org: 'MB Creative – Rabat', dates: 'Sept. 2021 – Present', puces: [
        ['Strategy & Advisory:', 'Internal and external communication strategy for national and international organisations (EIB, IFC, GIZ, Moroccan renewable energy cluster).'],
        ['Investor & Institutional Events:', 'End-to-end direction: concept note, set design, materials, online presence, on-site delivery. Guelmim Investor Day (2 editions), Essaouira Investor Day, Solar Rooftop 500, Nexans Climate Summit, EIB 20th anniversary, SheWins Arabia.'],
        ['Content Production:', 'Editorial content, visual identities, video and motion design.'],
      ] },
      { cle: 'corpotex', titre: 'B2B Sales & Digital Solutions Manager', org: 'Corpotex (ex Marc Yates) – Témara / Casablanca', dates: 'Sept. 2020 – Present', puces: [
        ['B2B Accounts:', 'Prospected, developed and negotiated accounts in textiles, medical supplies and personal protective equipment.'],
        ['Sales Delivery:', 'Coordinated sales and operations teams from proposal through delivery and payment follow-up.'],
        ['Digital Tools:', 'Designed a no-code CRM for pipeline, quotations, follow-ups and reporting.'],
      ] },
      { cle: 'emw', titre: 'Key Account & Business Development Manager', org: 'E-Maroc Wave — Rabat', dates: 'Oct. 2015 – Sept. 2020', puces: [
        ['Business Development:', 'Prospected and developed key accounts in Morocco and African markets; prepared proposals and negotiated with clients.'],
        ['Account Delivery:', 'Maintained client relationships and coordinated corporate deliverables, including catalogues and audiovisual content.'],
      ] },
      { cle: 'mbc', titre: 'Communications Manager', org: 'Maroc Business Consulting — Rabat', dates: 'July 2014 – Oct. 2015', puces: [
        ['Digital & Media:', 'Digital strategy, e-commerce website www.youpi.co.ma, community management and email campaigns.'],
      ] },
      { cle: 'geantech', titre: 'Marketing & Communications Officer', org: 'Geantech Agency S.A.R.L. — Rabat', dates: 'Apr. 2012 – Jun. 2014', puces: [
        ['Strategy & Design:', 'Marketing strategy, graphic design and visual communication materials.'],
      ] },
    ],
    formation: [
      'Executive Master, Leading Digital Transformation — UIR, 2026-2027 cohort',
      'Bachelor’s degree, Economics & Management, Service Engineering — University of Angers (2011)',
      'Google Certification — Digital Marketing Fundamentals (2019)',
    ],
  },
};
