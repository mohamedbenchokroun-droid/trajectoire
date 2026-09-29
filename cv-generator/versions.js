// Contenu des 4 versions du CV (même design, seuls les textes changent)
const MASTER_FR = 'Executive Master Leading Digital Transformation — UIR, Rabat (en cours)';
const FORMATION_FR = [
  MASTER_FR,
  "Licence en Ingénierie de Services — Université d'Angers, France (2011)",
  'DTS en Gestion des Entreprises — Institut International IIMTH, Rabat (2010)',
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
    profil: "Expert en communication corporate et digitale fort de 14 ans d'expérience dans la définition et le déploiement de stratégies de communication interne et externe. Spécialiste de la création de contenus multi-supports (éditoriaux, graphiques, audiovisuels) et du pilotage d'événements institutionnels d'envergure, j'allie vision stratégique, maîtrise des outils digitaux avancés (IA, No-Code, Suite Adobe) et aisance relationnelle pour valoriser l'image de marque et accompagner les engagements RSE d'entreprises et d'organisations d'excellence.",
    competences: [
      ['Communication Corporate & RSE :', "Définition et déploiement de stratégies de communication interne/externe, communication digitale, plan d'action RSE & engagement citoyen, relations publiques et institutionnelles"],
      ['Création de Contenus & Médias', "Conception et production de contenus éditoriaux, création graphique, retouche d'image, montage vidéo et Motion Design."],
      ['Événementiel & Coordination', "Pilotage d'événements de A à Z, scénographie, coordination des parties prenantes (internes/externes), logistique et présence sur site."],
    ],
    expertise: ['Conseil en communication institutionnelle', 'Direction de projets événementiels', 'Supervision de production visuelle'],
    experiences: [
      { ...MB, puces: [
        ['Définition & Déploiement de la Stratégie :', "Conseil et pilotage stratégique de la communication interne et externe pour des organisations nationales et internationales d'envergure (BEI, IFC, GIZ, Cluster EnR)."],
        ['Création & Production de Contenus :', 'Conception et production globale de contenus éditoriaux, supports graphiques, identités visuelles et contenus audiovisuels / Motion Design.'],
        ['Événementiel & RSE :', "Direction de bout en bout d'événements institutionnels majeurs (note de conception, scénographie, supports, présence en ligne, déploiement sur site). Projets phares : " + EVENTS + '.'],
        ['Communication Digitale :', "Gestion de la présence en ligne, coordination avec l'ensemble des parties prenantes internes et externes."],
      ] },
      { ...CPX, puces: [
        ['Pilotage & Process Internes :', 'Structuration, animation des équipes commerciales et opérationnelles, et optimisation de la chaîne de valeur.'],
        ['Projets Digitaux sur Mesure :', "Conception et développement d'un CRM et de plusieurs outils No-Code intégrant des workflows automatisés pour fluidifier le suivi et la communication interne/externe."],
        ['Développement B2B :', 'Gestion et négociation de comptes stratégiques dans les secteurs textile, médical et équipements de protection individuelle (EPI).'],
      ] },
      { ...EMW, puces: [
        ['Supervision de Production Corporate :', 'Direction de la production des contenus corporate (catalogues, supports commerciaux, vidéo, motion design).'],
        ['Gestion de Projets & Comptes Stratégiques :', 'Développement et gestion de comptes clés sur le marché marocain avec expansion sur le marché africain.'],
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
    profil: "Business Developer B2B fort de 14 ans d'expérience dans le développement de portefeuilles clients, la gestion de comptes stratégiques et la structuration d'opérations commerciales. Double compétence vente et communication : de la prospection et la négociation jusqu'à la création de supports et d'événements institutionnels de haut niveau, pour des clients allant des PME industrielles aux organisations internationales (BEI, IFC, GIZ). Marchés Maroc et Afrique, outils digitaux maîtrisés (CRM, automatisation, IA).",
    competences: [
      ['Développement Commercial B2B :', 'Prospection, ouverture et négociation de comptes stratégiques, cycle de vente complet, marchés Maroc & Afrique.'],
      ['Pilotage & Structuration', "Animation d'équipes commerciales et opérationnelles, process de vente, CRM, tableaux de bord et reporting."],
      ['Relation Institutionnelle', 'Interface avec les organisations internationales (BEI, IFC, GIZ), les institutions publiques et les directions générales.'],
    ],
    expertise: ['Communication corporate & événementiel', 'Supports commerciaux & contenus visuels', 'No-Code, automatisation & IA'],
    experiences: [
      { ...CPX, puces: [
        ['Développement B2B :', 'Prospection, négociation et gestion de comptes stratégiques dans les secteurs textile, médical et équipements de protection individuelle (EPI).'],
        ["Pilotage d'Équipes & Process :", 'Animation des équipes commerciales et opérationnelles, structuration du cycle de vente de la prospection au recouvrement, maîtrise de la chaîne de valeur.'],
        ['CRM & Prospection Multicanal :', "Conception d'un CRM No-Code sur mesure (relances, devis et reporting automatisés) et campagnes WhatsApp, email et téléphone pilotées par tableau de bord."],
      ] },
      { ...MB, puces: [
        ['Relation Institutionnelle :', "Conseil et pilotage de projets pour la BEI, l'IFC, la GIZ et le Cluster EnR : cadrage, coordination des prestataires et validation des livrables."],
        ['Événementiel Investisseurs :', "Direction de bout en bout d'événements institutionnels. Projets phares : " + EVENTS + '.'],
      ] },
      { ...EMW, puces: [
        ['Grands Comptes :', 'Développement et gestion de comptes stratégiques sur le marché marocain et expansion sur le marché africain.'],
        ['Cycle de Vente B2B :', 'Prospection, propositions commerciales, négociation et fidélisation.'],
        ['Supports Commerciaux :', 'Supervision de la production des contenus corporate (catalogues, vidéos, motion design).'],
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
    profil: "Professionnel du développement commercial et de la communication fort de 14 ans d'expérience, spécialisé dans la conception et le déploiement d'outils digitaux qui changent la façon de travailler des équipes : CRM No-Code sur mesure, workflows automatisés, pilotage par tableaux de bord et IA générative. Trait d'union entre les métiers, la technique et la communication du changement. Executive Master « Leading Digital Transformation » à l'UIR (en cours).",
    competences: [
      ['Transformation & Adoption :', "Cadrage des besoins métier, déploiement d'outils, conduite du changement et adoption par les équipes."],
      ['No-Code, Automatisation & IA', 'CRM sur mesure, workflows automatisés (n8n, ManyChat), IA générative appliquée aux métiers.'],
      ['Pilotage par la Donnée', 'Tableaux de bord, indicateurs de performance, optimisation des process commerciaux et opérationnels.'],
    ],
    expertise: ['Gestion de projets multi-acteurs', 'Communication du changement', 'Développement commercial B2B'],
    experiences: [
      { ...CPX, puces: [
        ['CRM No-Code sur Mesure :', "Conception et déploiement d'un CRM intégrant pipeline, relances, devis et reporting automatisés, adopté par les équipes commerciales et opérationnelles."],
        ['Automatisation des Flux :', 'Workflows n8n et ManyChat pour la prospection et la communication interne/externe ; tableaux de bord de conversion par canal.'],
        ['Conduite du Changement :', "Structuration des process de vente et de la chaîne de valeur, accompagnement des équipes dans l'adoption des nouveaux outils et de l'IA générative."],
        ['Développement B2B :', 'Gestion et négociation de comptes stratégiques (textile, médical, EPI).'],
      ] },
      { ...MB, puces: [
        ['Gestion de Projets Multi-Acteurs :', "Pilotage de projets pour la BEI, l'IFC, la GIZ et le Cluster EnR : cadrage, planning, coordination des prestataires, livrables."],
        ['Dispositifs Digitaux :', "Présence en ligne et outils digitaux d'événements majeurs. Projets phares : " + EVENTS + '.'],
      ] },
      { ...EMW, puces: [
        ['Comptes Stratégiques :', 'Développement et gestion de comptes clés au Maroc et expansion sur le marché africain.'],
        ['Production Digitale :', 'Supervision des contenus corporate : vidéos, motion design, catalogues.'],
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
    profil: 'Business development and communications professional with 14 years of experience in Morocco and Africa: B2B key account development, sales team leadership, and communication and investor events for international organisations (EIB, IFC, GIZ). I combine sales execution with the ability to build the brand, content and digital tools that support it (custom no-code CRM, automation, generative AI). Executive Master in Leading Digital Transformation, International University of Rabat (in progress).',
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
        ['Key Accounts:', 'Development and negotiation of strategic accounts in textiles, medical supplies and personal protective equipment.'],
        ['Team & Process:', 'Led sales and operations teams; structured the sales cycle from prospecting to delivery and collection.'],
        ['Digital Tools:', 'Designed a custom no-code CRM with automated workflows; multichannel prospecting tracked by conversion dashboards.'],
      ] },
      { cle: 'emw', titre: 'Key Account & Business Development Manager', org: 'E-Maroc Wave — Rabat', dates: 'Oct. 2015 – Sept. 2020', puces: [
        ['Key Accounts:', 'Developed and managed strategic accounts in Morocco and expanded into African markets.'],
        ['Corporate Content:', 'Supervised production of catalogues, sales materials, video and motion design.'],
      ] },
      { cle: 'mbc', titre: 'Communications Manager', org: 'Maroc Business Consulting — Rabat', dates: 'July 2014 – Oct. 2015', puces: [
        ['Digital & Media:', 'Digital strategy, e-commerce website www.youpi.co.ma, community management and email campaigns.'],
      ] },
      { cle: 'geantech', titre: 'Marketing & Communications Officer', org: 'Geantech Agency S.A.R.L. — Rabat', dates: 'Apr. 2012 – Jun. 2014', puces: [
        ['Strategy & Design:', 'Marketing strategy, graphic design and visual communication materials.'],
      ] },
    ],
    formation: [
      'Executive Master, Leading Digital Transformation — UIR, Rabat (in progress)',
      'Professional Bachelor, Service Engineering — University of Angers, France (2011)',
      'Higher Technician Diploma, Business Management — IIMTH, Rabat (2010)',
      'Google Certification — Digital Marketing Fundamentals (2019)',
    ],
  },
};
