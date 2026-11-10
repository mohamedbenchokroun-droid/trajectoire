"""Build a source-checked, unsent EU Delegation application package."""
from pathlib import Path
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether
from pypdf import PdfReader, PdfWriter

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "output" / "pdf"
OUT.mkdir(parents=True, exist_ok=True)
FONT = Path(r"C:\Windows\Fonts")
pdfmetrics.registerFont(TTFont("Arial", str(FONT / "arial.ttf")))
pdfmetrics.registerFont(TTFont("Arial-Bold", str(FONT / "arialbd.ttf")))
pdfmetrics.registerFontFamily("Arial", normal="Arial", bold="Arial-Bold")
BLUE = colors.HexColor("#173A63")
MID = colors.HexColor("#54708C")
LIGHT = colors.HexColor("#E6EDF4")
INK = colors.HexColor("#203040")
styles = getSampleStyleSheet()
styles.add(ParagraphStyle(name="NameX", fontName="Arial-Bold", fontSize=19, leading=22, textColor=BLUE, spaceAfter=4))
styles.add(ParagraphStyle(name="SubX", fontName="Arial", fontSize=10, leading=14, textColor=MID, spaceAfter=7))
styles.add(ParagraphStyle(name="SectionX", fontName="Arial-Bold", fontSize=10.8, leading=15, textColor=BLUE, spaceBefore=15, spaceAfter=8))
styles.add(ParagraphStyle(name="RoleX", fontName="Arial-Bold", fontSize=9.7, leading=13.6, textColor=INK, spaceAfter=3))
styles.add(ParagraphStyle(name="BodyX", fontName="Arial", fontSize=9.4, leading=14.1, textColor=INK, spaceAfter=8))
styles.add(ParagraphStyle(name="SmallX", fontName="Arial", fontSize=9.1, leading=13.4, textColor=INK, spaceAfter=5))
styles.add(ParagraphStyle(name="DateX", fontName="Arial-Bold", fontSize=8.2, leading=11, textColor=MID))
styles.add(ParagraphStyle(name="LetterX", fontName="Arial", fontSize=10, leading=16.2, textColor=INK, spaceAfter=11))

def P(s, style="BodyX"):
    return Paragraph(s, styles[style])

def heading(s):
    return P(s.upper(), "SectionX")

def item(date, role, employer, bullets):
    rows = [[P(date, "DateX"), P(f"{role}<br/><font color='#54708C'>{employer}</font>", "RoleX")]]
    t = Table(rows, colWidths=[35*mm, 151*mm], hAlign="LEFT")
    t.setStyle(TableStyle([("VALIGN", (0,0),(-1,-1),"TOP"), ("LEFTPADDING",(0,0),(-1,-1),0), ("RIGHTPADDING",(0,0),(-1,-1),4), ("TOPPADDING",(0,0),(-1,-1),2), ("BOTTOMPADDING",(0,0),(-1,-1),1)]))
    out = [t]
    for bullet in bullets:
        out.append(P("• " + bullet, "SmallX"))
    out.append(Spacer(1, 9))
    return KeepTogether(out)

def footer(canvas, doc):
    canvas.saveState()
    width, _ = A4
    canvas.setStrokeColor(LIGHT)
    canvas.line(17*mm, 17*mm, width-17*mm, 17*mm)
    canvas.setFont("Arial", 7.5)
    canvas.setFillColor(MID)
    canvas.drawString(17*mm, 12*mm, "Mohamed Benchokroun  •  Candidature Délégation UE au Maroc")
    canvas.drawRightString(width-17*mm, 12*mm, str(doc.page))
    canvas.restoreState()

cv = OUT / "CV_Mohamed_Benchokroun_UE_Communication_Europass.pdf"
doc = SimpleDocTemplate(str(cv), pagesize=A4, rightMargin=16*mm, leftMargin=17*mm, topMargin=17*mm, bottomMargin=22*mm)
story = [P("MOHAMED BENCHOKROUN", "NameX"), P("Communication institutionnelle, digitale et événementielle | Rabat - Témara, Maroc", "SubX")]
story += [P("+212 6 97 95 32 61  •  mohamed.benchokroun@gmail.com  •  Permis B", "SmallX")]
story += [heading("Profil")]
story += [P("Professionnel de la communication et du développement B2B depuis 2012. Conseil en communication institutionnelle, conception de contenus éditoriaux et visuels, coordination d'événements et mobilisation de partenaires au Maroc. Expérience de projets menés pour des organisations internationales et des acteurs publics ; maîtrise des outils numériques de production et de suivi. Candidature au poste de chargé d'information et de communication de la Délégation de l'Union européenne au Maroc.")]
story += [heading("Expérience professionnelle")]
story += [item("09/2021 - aujourd'hui", "Consultant en communication institutionnelle et événementiel", "MB Creative, Rabat", [
    "Conseil et coordination de dispositifs de communication et d'événements institutionnels pour des organisations internationales et des partenaires publics, notamment la BEI, l'IFC et la GIZ.",
    "Conception de notes de projet, contenus éditoriaux, identités visuelles et supports audiovisuels ; coordination des équipes de production et des parties prenantes.",
    "Réalisations : Guelmim Investor Day (deux éditions), Essaouira Investor Day, Solar Rooftop 500, SheWins Arabia et 20 ans de la BEI."
])]
story += [item("09/2020 - aujourd'hui", "Responsable commercial B2B et solutions digitales", "Corpotex, Témara", [
    "Développement et suivi de comptes B2B ; coordination des équipes commerciales et opérationnelles.",
    "Structuration d'un CRM et de processus numériques de suivi, avec automatisations et outils no-code.",
    "Conception de supports commerciaux et amélioration de la circulation de l'information entre fonctions commerciales et opérationnelles."
])]
story += [item("10/2015 - 09/2020", "Responsable commercial et développement grands comptes", "E-Maroc Wave, Rabat", [
    "Gestion de comptes clés et coordination de la production de catalogues, supports commerciaux et contenus corporate.",
    "Supervision des contenus vidéo et motion design à usage commercial et institutionnel.",
    "Contribution au développement commercial au Maroc et à l'ouverture de marchés africains."
])]
story += [PageBreak(), P("MOHAMED BENCHOKROUN", "NameX"), P("Curriculum vitae détaillé | Information et communication", "SubX")]
story += [heading("Expérience professionnelle - suite")]
story += [item("07/2014 - 10/2015", "Responsable communication", "Maroc Business Consulting, Rabat", [
    "Déploiement de la communication digitale, administration du site e-commerce et animation de campagnes emailing."
])]
story += [item("04/2012 - 06/2014", "Chargé de marketing et communication", "Geantech Agency SARL, Rabat", [
    "Création de supports de communication visuelle et appui au déploiement de la stratégie marketing."
])]
story += [heading("Éducation et formation")]
story += [P("<b>2011 - Licence Droit, économie, gestion, mention Ingénierie des services</b><br/>Université d'Angers, France.", "BodyX")]
story += [P("<b>2010 - Technicien spécialisé en gestion hôtelière</b><br/>IIMTH, Rabat.", "BodyX")]
story += [heading("Compétences en communication")]
story += [P("Communication institutionnelle et digitale ; conception de plans et de contenus ; coordination d'événements et de partenaires ; production éditoriale, graphique et audiovisuelle ; outils de gestion de projet et de suivi commercial.")]
story += [heading("Compétences numériques")]
story += [P("Microsoft Office ; Adobe Creative Cloud (Photoshop, Illustrator, InDesign, Premiere Pro, After Effects) ; Canva ; outils no-code et CRM.")]
story += [heading("Langues")]
story += [P("Arabe et français : usage professionnel. Anglais : usage professionnel.")]
story += [heading("Informations complémentaires")]
story += [P("Résidence à Témara, mobilité quotidienne vers Rabat. Références et justificatifs complémentaires disponibles sur demande.")]
doc.build(story, onFirstPage=footer, onLaterPages=footer)

letter = OUT / "Lettre_Mohamed_Benchokroun_Delegation_UE_Maroc.pdf"
doc = SimpleDocTemplate(str(letter), pagesize=A4, rightMargin=22*mm, leftMargin=22*mm, topMargin=23*mm, bottomMargin=24*mm)
letter_story = [P("Mohamed Benchokroun", "RoleX"), P("Témara, Maroc | +212 6 97 95 32 61 | mohamed.benchokroun@gmail.com", "SmallX"), Spacer(1, 16),
    P("À l'attention du comité de sélection<br/>Délégation de l'Union européenne au Maroc<br/>Rabat", "LetterX"),
    Spacer(1, 9), P("Témara, le 5 octobre 2026", "LetterX"),
    P("<b>Objet : Candidature au poste de chargé d'information et de communication</b>", "LetterX"),
    P("Madame, Monsieur,", "LetterX"),
    P("La mission de la Délégation, qui consiste à rendre lisible et concrète l'action de l'Union européenne au Maroc, correspond à la dimension institutionnelle de mon parcours. Je souhaite mettre à votre service une expérience de communication, de production de contenus et de coordination de projets développée depuis 2012 à Rabat.", "LetterX"),
    P("Depuis 2021, mes missions de conseil chez MB Creative m'ont conduit à concevoir et déployer des dispositifs de communication et des événements avec des organisations internationales et des partenaires publics. Parmi les projets figurent deux éditions du Guelmim Investor Day, Essaouira Investor Day, Solar Rooftop 500 et les 20 ans de la BEI. Ces réalisations m'ont appris à articuler messages, supports éditoriaux et visuels, intervenants et contraintes opérationnelles pour des publics variés.", "LetterX"),
    P("J'apporte également une pratique des outils numériques et de la coordination de parties prenantes acquise dans mes fonctions commerciales et de communication. Ma licence en Ingénierie des services, obtenue à l'Université d'Angers, répond au niveau universitaire requis. Basé à Témara, je suis disponible pour exercer à Rabat et pour approfondir, lors d'un entretien, la façon dont je contribuerais à votre stratégie d'information, à vos canaux numériques et à vos événements de diplomatie publique.", "LetterX"),
    P("Vous trouverez ci-joints mon CV détaillé, une copie de mon diplôme et un justificatif d'expérience professionnelle. Je reste à votre disposition pour tout document complémentaire.", "LetterX"),
    P("Je vous prie d'agréer, Madame, Monsieur, l'expression de ma considération distinguée.", "LetterX"),
    Spacer(1, 14), P("<b>Mohamed Benchokroun</b>", "LetterX")]
doc.build(letter_story)

diploma = OUT / "Diplome_Licence_Angers_Mohamed_Benchokroun.pdf"
source = PdfReader(r"C:\Users\mbenc\Downloads\Diplomes.pdf")
writer = PdfWriter()
writer.add_page(source.pages[0])
with diploma.open("wb") as stream:
    writer.write(stream)
print(cv)
print(letter)
print(diploma)
