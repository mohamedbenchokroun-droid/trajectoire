from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_JUSTIFY, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.utils import simpleSplit
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas
from reportlab.platypus import Paragraph


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "output" / "pdf"
OUTPUT.mkdir(parents=True, exist_ok=True)

fonts = Path("C:/Windows/Fonts")
pdfmetrics.registerFont(TTFont("Arial", str(fonts / "arial.ttf")))
pdfmetrics.registerFont(TTFont("Arial-Bold", str(fonts / "arialbd.ttf")))
pdfmetrics.registerFontFamily("Arial", normal="Arial", bold="Arial-Bold")

NAVY = colors.HexColor("#1B2A4A")
GOLD = colors.HexColor("#C9A14A")
INK = colors.HexColor("#263246")
MUTED = colors.HexColor("#5F6A79")
BODY = ParagraphStyle(
    "body", fontName="Arial", fontSize=10.7, leading=17.5,
    textColor=INK, alignment=TA_JUSTIFY,
)
SALUTE = ParagraphStyle("salute", parent=BODY, alignment=TA_LEFT)

LETTERS = [
    {
        "file": "Lettre_Mohamed_Benchokroun_UIR_Communication_Sante_2026-10-01.pdf",
        "title": "Chargé(e) de Communication - Collège des Sciences de la Santé",
        "destination": "Collège des Sciences de la Santé - UIR",
        "subject": "Candidature - Chargé(e) de Communication (réf. UIR 766)",
        "paragraphs": [
            "Votre poste associe plan de communication, coordination des entités du Collège, "
            "production de contenus et valorisation d'une mission institutionnelle. Ce périmètre "
            "correspond à mon expérience de communication corporate et événementielle acquise "
            "auprès d'organisations internationales et d'institutions publiques.",
            "Depuis 2021, je cadre des dispositifs de communication de la conception à la livraison : "
            "messages, supports éditoriaux et visuels, coordination des parties prenantes et "
            "événements. J'ai notamment piloté deux éditions d'un Investor Day régional. "
            "Mes expériences antérieures comprennent également la communication digitale, "
            "l'animation de communautés et la création de contenus audiovisuels.",
            "Je pourrais contribuer à structurer des plans de communication adaptés aux "
            "établissements du Collège, à fluidifier la coordination avec la communication "
            "centrale et à rendre les travaux des équipes plus visibles. Titulaire d'une licence "
            "en ingénierie de services, je suis conscient que l'annonce demande un Bac+5 ; "
            "je souhaite néanmoins soumettre à votre appréciation mon expérience opérationnelle "
            "de quatorze ans.",
            "Je serais heureux d'échanger sur les priorités du Collège et la contribution "
            "concrète que je pourrais apporter à son rayonnement.",
        ],
    },
    {
        "file": "Lettre_Mohamed_Benchokroun_UIR_Programmes_Entrepreneuriat_2026-10-01.pdf",
        "title": "Chargé(e) de Programmes Entrepreneuriat & Community Building",
        "destination": "Centre d'Innovation et d'Entrepreneuriat - UIR",
        "subject": "Candidature - Programmes Entrepreneuriat & Community Building (réf. UIR 768)",
        "paragraphs": [
            "Le poste proposé par le Centre d'Innovation et d'Entrepreneuriat réunit animation "
            "d'écosystème, événements, partenariats et valorisation de projets. Je souhaite y "
            "apporter mon expérience de coordination institutionnelle et de développement "
            "de relations avec des acteurs publics et privés.",
            "Depuis 2021, j'ai conçu et piloté des événements réunissant institutions, entreprises "
            "et investisseurs, notamment deux éditions d'un Investor Day régional. De la "
            "mobilisation des intervenants aux contenus et au suivi des livrables, j'assure "
            "la cohérence du projet et la qualité de son exécution. Mon parcours commercial "
            "B2B m'a également donné une pratique durable de la prospection, de la relation "
            "partenariale et du suivi structuré des opportunités.",
            "Je pourrais contribuer aux événements et à l'animation de la communauté du CIE, "
            "ainsi qu'à la mise en valeur de ses projets et partenariats. Je ne revendique pas "
            "d'expérience directe en gestion d'incubateur ; je propose une expérience "
            "transférable en coordination multi-acteurs. Titulaire d'une licence en ingénierie "
            "de services, je suis également conscient de l'exigence Bac+5 de l'annonce.",
            "Je serais heureux de vous présenter la façon dont ces compétences pourraient "
            "servir les programmes et la communauté entrepreneuriale de l'UIR.",
        ],
    },
    {
        "file": "Lettre_Mohamed_Benchokroun_UIR_Recrutement_International_2026-10-01.pdf",
        "title": "Responsable Recrutement Étudiants Internationaux - Focus Afrique",
        "destination": "Direction des Relations Internationales et des Partenariats - UIR",
        "subject": "Candidature - Recrutement Étudiants Internationaux, Focus Afrique (réf. UIR 769)",
        "paragraphs": [
            "Le développement de l'UIR en Afrique appelle une approche qui associe "
            "prospection, partenariats, communication et suivi des candidats. C'est à "
            "l'intersection de ces disciplines que je souhaite mettre mon expérience "
            "commerciale et institutionnelle au service de votre équipe.",
            "Mon parcours de quatorze ans comprend le développement de comptes B2B au Maroc "
            "et en Afrique, la négociation et le suivi de relations partenariales, ainsi que "
            "la structuration de processus commerciaux à l'aide d'un CRM. Depuis 2021, "
            "j'ai également conçu et piloté des événements institutionnels réunissant "
            "acteurs publics, entreprises et investisseurs, avec une responsabilité sur les "
            "contenus, la coordination et la livraison.",
            "Je pourrais contribuer au ciblage et à la prospection des partenaires africains, "
            "aux salons et campagnes de communication, ainsi qu'au suivi des contacts et "
            "des indicateurs d'acquisition. Je n'ai pas exercé directement dans les admissions "
            "universitaires internationales : ma candidature repose sur des compétences "
            "transférables. Titulaire d'une licence en ingénierie de services, je suis également "
            "conscient de l'exigence Bac+5 de votre offre.",
            "Je serais heureux d'échanger avec vous sur les marchés prioritaires et sur "
            "les résultats que cette expérience pourrait aider l'UIR à atteindre.",
        ],
    },
]


def write_letter(item):
    path = OUTPUT / item["file"]
    w, h = A4
    left = right = 58
    content_w = w - left - right
    c = canvas.Canvas(str(path), pagesize=A4, pageCompression=1)
    c.setTitle(f"Candidature - {item['title']} - UIR")
    c.setAuthor("Mohamed Benchokroun")

    c.setFillColor(NAVY)
    c.rect(0, h - 130, w, 130, fill=1, stroke=0)
    c.setFillColor(GOLD)
    c.rect(left, h - 96, 4, 55, fill=1, stroke=0)
    c.setFillColor(colors.white)
    c.setFont("Arial-Bold", 17)
    c.drawString(left + 16, h - 62, "MOHAMED BENCHOKROUN")
    c.setFont("Arial", 9.5)
    c.drawString(left + 16, h - 81, "Communication corporate  •  Événementiel  •  Partenariats")
    c.drawString(left + 16, h - 102, "Témara  |  +212 6 97 95 32 61  |  mohamed.benchokroun@gmail.com")

    c.setFillColor(MUTED)
    c.setFont("Arial", 10)
    c.drawRightString(w - right, h - 165, "Témara, le 1er octobre 2026")
    c.setFillColor(INK)
    c.setFont("Arial-Bold", 10.5)
    c.drawString(left, h - 207, "À l'attention de la Direction du Capital Humain")
    c.setFont("Arial", 10.5)
    c.drawString(left, h - 225, item["destination"])

    c.setFillColor(NAVY)
    c.setFont("Arial-Bold", 10.5)
    subject_lines = simpleSplit(item["subject"], "Arial-Bold", 10.5, content_w)
    for index, line in enumerate(subject_lines):
        c.drawString(left, h - 270 - index * 15, line)
    rule_y = h - 285 - (len(subject_lines) - 1) * 15
    c.setStrokeColor(GOLD)
    c.setLineWidth(1.2)
    c.line(left, rule_y, w - right, rule_y)

    y = rule_y - 26
    blocks = [("Madame, Monsieur,", SALUTE, 18)]
    blocks.extend((paragraph, BODY, 16) for paragraph in item["paragraphs"])
    blocks.append((
        "Je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées.",
        BODY, 17,
    ))
    for content, style, gap in blocks:
        paragraph = Paragraph(content, style)
        _, height = paragraph.wrap(content_w, 600)
        paragraph.drawOn(c, left, y - height)
        y -= height + gap

    if y < 92:
        raise RuntimeError(f"Le texte déborde : {path.name}, y={y:.1f}")

    c.setFillColor(NAVY)
    c.setFont("Arial-Bold", 10.5)
    c.drawString(left, y - 5, "Mohamed Benchokroun")
    c.setStrokeColor(GOLD)
    c.setLineWidth(0.8)
    c.line(left, 54, w - right, 54)
    c.setFillColor(MUTED)
    c.setFont("Arial", 8)
    c.drawString(left, 41, "Dossier préparé pour le portail de recrutement de l'UIR")
    c.save()
    print(path)


for letter in LETTERS:
    write_letter(letter)
