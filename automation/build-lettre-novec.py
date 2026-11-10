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
OUTPUT = ROOT / "output" / "pdf" / "Lettre_Mohamed_Benchokroun_NOVEC_Developpement_Afrique_2026-10-01.pdf"
OUTPUT.parent.mkdir(parents=True, exist_ok=True)

font_dir = Path("C:/Windows/Fonts")
pdfmetrics.registerFont(TTFont("Arial", str(font_dir / "arial.ttf")))
pdfmetrics.registerFont(TTFont("Arial-Bold", str(font_dir / "arialbd.ttf")))
pdfmetrics.registerFontFamily("Arial", normal="Arial", bold="Arial-Bold")

navy = colors.HexColor("#1B2A4A")
gold = colors.HexColor("#C9A14A")
ink = colors.HexColor("#263246")
muted = colors.HexColor("#5F6A79")
w, h = A4
left = 58
right = 58
content_w = w - left - right

c = canvas.Canvas(str(OUTPUT), pagesize=A4, pageCompression=1)
c.setTitle("Candidature - Responsable Développement Afrique - NOVEC")
c.setAuthor("Mohamed Benchokroun")

c.setFillColor(navy)
c.rect(0, h - 130, w, 130, fill=1, stroke=0)
c.setFillColor(gold)
c.rect(left, h - 96, 4, 55, fill=1, stroke=0)
c.setFillColor(colors.white)
c.setFont("Arial-Bold", 17)
c.drawString(left + 16, h - 62, "MOHAMED BENCHOKROUN")
c.setFont("Arial", 9.5)
c.drawString(left + 16, h - 81, "Développement commercial B2B  •  Partenariats  •  Afrique")
c.drawString(left + 16, h - 102, "Témara  |  +212 6 97 95 32 61  |  mohamed.benchokroun@gmail.com")

c.setFillColor(muted)
c.setFont("Arial", 10)
c.drawRightString(w - right, h - 165, "Témara, le 1er octobre 2026")
c.setFillColor(ink)
c.setFont("Arial-Bold", 10.5)
c.drawString(left, h - 207, "À l'attention de la Direction du recrutement")
c.setFont("Arial", 10.5)
c.drawString(left, h - 225, "NOVEC — Technopolis, Salé")

subject = "Candidature — Responsable Développement Afrique (offre ReKrute n° 186128)"
c.setFillColor(navy)
c.setFont("Arial-Bold", 10.5)
for i, line in enumerate(simpleSplit(subject, "Arial-Bold", 10.5, content_w)):
    c.drawString(left, h - 270 - i * 15, line)
c.setStrokeColor(gold)
c.setLineWidth(1.2)
c.line(left, h - 291, w - right, h - 291)

style = ParagraphStyle(
    "body",
    fontName="Arial",
    fontSize=10.7,
    leading=17.5,
    textColor=ink,
    alignment=TA_JUSTIFY,
    spaceAfter=0,
)
salute_style = ParagraphStyle("salute", parent=style, alignment=TA_LEFT)

paragraphs = [
    ("Madame, Monsieur,", salute_style, 19),
    (
        "Je vous adresse ma candidature au poste de Responsable Développement Afrique. "
        "Mon parcours de 14 ans associe développement commercial B2B, gestion de comptes stratégiques "
        "et coordination de projets institutionnels au Maroc et en Afrique.",
        style,
        17,
    ),
    (
        "Chez E-Maroc Wave, j'ai développé et suivi des comptes clés sur le marché marocain, "
        "avec une expansion vers l'Afrique. Chez Corpotex, je pilote la prospection, la négociation "
        "et la fidélisation des comptes B2B, tout en structurant les équipes et le suivi commercial "
        "à l'aide d'un CRM et de tableaux de bord.",
        style,
        17,
    ),
    (
        "Mes missions de communication pour des organisations internationales et des institutions publiques "
        "m'ont également appris à coordonner des interlocuteurs variés, à clarifier leurs besoins et à "
        "tenir des projets complexes jusqu'à la livraison. Je souhaite mettre cette double expérience "
        "commerciale et institutionnelle au service des opportunités et des partenariats de NOVEC en Afrique.",
        style,
        17,
    ),
    (
        "Je serais heureux d'échanger avec vous sur les priorités de votre équipe et sur la contribution "
        "concrète que je pourrais apporter à son développement.",
        style,
        17,
    ),
    ("Je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées.", style, 18),
]

y = h - 319
for body, para_style, gap in paragraphs:
    paragraph = Paragraph(body, para_style)
    _, ph = paragraph.wrap(content_w, 600)
    paragraph.drawOn(c, left, y - ph)
    y -= ph + gap

if y < 95:
    raise RuntimeError(f"Le texte déborde sur le pied de page : y={y:.1f}")

c.setFillColor(navy)
c.setFont("Arial-Bold", 10.5)
c.drawString(left, y - 5, "Mohamed Benchokroun")
c.setStrokeColor(gold)
c.setLineWidth(0.8)
c.line(left, 54, w - right, 54)
c.setFillColor(muted)
c.setFont("Arial", 8)
c.drawString(left, 41, "Dossier préparé pour le formulaire officiel NOVEC")
c.save()
print(OUTPUT)
