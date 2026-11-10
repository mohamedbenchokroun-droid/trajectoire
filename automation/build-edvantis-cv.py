from pathlib import Path
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor, white
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import Paragraph
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from pypdf import PdfReader
from PIL import Image
from io import BytesIO
from reportlab.lib.utils import ImageReader

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'output/pdf/CV Mohamed Benchokroun Design Graphique.pdf'
OUT.parent.mkdir(parents=True, exist_ok=True)
for name, fn in [('Cal','calibri.ttf'),('CalB','calibrib.ttf'),('CalI','calibrii.ttf')]:
    pdfmetrics.registerFont(TTFont(name, str(Path('C:/Windows/Fonts') / fn)))
pdfmetrics.registerFontFamily('Cal', normal='Cal', bold='CalB', italic='CalI', boldItalic='CalB')
W,H=595.276,841.89
NAVY=HexColor('#1c2b49'); GOLD=HexColor('#c49a40'); INK=HexColor('#283141')
c=canvas.Canvas(str(OUT), pagesize=(W,H))
c.setTitle('Mohamed Benchokroun - Design graphique et communication visuelle')
c.setAuthor('Mohamed Benchokroun')
c.setFillColor(NAVY); c.rect(0,0,198,H,fill=1,stroke=0)

def para(txt,x,top,width,size=10.1,leading=13.3,color=INK,bold=False):
    p=Paragraph(txt,ParagraphStyle('p',fontName='CalB' if bold else 'Cal',fontSize=size,leading=leading,textColor=color))
    _,h=p.wrap(width,H)
    if top+h>H-20: raise ValueError(f'Overflow: {txt[:50]} at {top+h}')
    p.drawOn(c,x,H-top-h)
    return top+h

def section(txt,x,top,width,side=False):
    para(txt,x,top,width,10.2,13,white if side else NAVY,True)
    c.setStrokeColor(GOLD);c.setLineWidth(.55);c.line(x,H-top-17,x+width,H-top-17)
    return top+24

def job(title,org,dates,body,y):
    y=para(title,218,y,353,10.8,13.4,NAVY,True)
    y=para(org+' | '+dates,218,y+2,353,9.1,11.5,HexColor('#77736b'))
    y=para(body,218,y+5,353,10,13.2)
    return y+16

# Preserve the established navy/gold identity and original photograph.
c.saveState();p=c.beginPath();p.circle(99,H-99,63);c.clipPath(p,stroke=0,fill=0)
photo=Image.open(ROOT/'cv-generator/orig/word/media/image1.png').convert('RGB')
photo.thumbnail((650,650))
photo_bytes=BytesIO();photo.save(photo_bytes,format='JPEG',quality=91,optimize=True);photo_bytes.seek(0)
c.drawImage(ImageReader(photo_bytes),34,H-164,130,130,mask='auto',preserveAspectRatio=True,anchor='c')
c.restoreState();c.setStrokeColor(GOLD);c.setLineWidth(1.7);c.circle(99,H-99,65,stroke=1,fill=0)
y=section('CONTACT',15,190,165,True)
y=para('Rabat / Témara, Maroc<br/>+212 6 97 95 32 61<br/><font size="8.6">mohamed.benchokroun@gmail.com</font><br/>Permis B',15,y,169,9.4,13.1,white)
y=section('DESIGN &amp; PRODUCTION',15,y+22,165,True)
y=para('<b>Identités visuelles</b><br/>Branding et déclinaisons print / digital.<br/><br/><b>Design éditorial</b><br/>Rapports, catalogues et supports institutionnels.<br/><br/><b>Image &amp; événementiel</b><br/>Vidéo, motion design et scénographie 3D.',15,y,165,9.7,13.2,white)
y=section('OUTILS',15,y+21,165,True)
y=para('Photoshop, Illustrator, InDesign<br/>After Effects, Premiere Pro<br/>Canva, Blender, SketchUp<br/>IA générative et outils no-code',15,y,165,9.7,13.2,white)
y=section('MÉTHODE DE TRAVAIL',15,y+21,165,True)
y=para('Du besoin client au livrable :<br/>brief, recherche, pistes visuelles, choix argumentés et déclinaisons print / digital.<br/><br/>Coordination des intervenants, intégration des retours et suivi de production.',15,y,165,9.5,13,white)
y=section('LANGUES',15,y+21,165,True)
y=para('Arabe et français : courant<br/>Anglais : professionnel',15,y,165,9.5,13,white)
y=section('PORTFOLIO',15,y+20,165,True)
para('<link href="https://sovereign-studio.lovable.app/portfolio" color="#e3bc67"><b>Voir mes réalisations en ligne</b></link><br/><font size="8.5">sovereign-studio.lovable.app</font>',15,y,165,9.5,13,white)

y=para('MOHAMED BENCHOKROUN',218,33,353,19,23,NAVY,True)
y=para('Designer graphique senior<br/>Communication visuelle &amp; projets institutionnels',218,y+7,353,11.6,15,GOLD,True)
y=section('PROFIL',218,y+20,353)
y=para('14 ans de parcours en communication et développement de projets, avec une pratique du design graphique depuis 2014. Je relie le brief, la conception visuelle et la production : identités, édition, contenus digitaux et dispositifs événementiels. J’interviens du cadrage à la livraison, au contact des clients et des équipes de production.',218,y,353)
y=section('EXPÉRIENCE PROFESSIONNELLE',218,y+17,353)
y=job('Consultant en communication institutionnelle & événementiel','MB Creative - Rabat','Sept. 2021 - présent',
       '<b>Création :</b> identités visuelles, supports éditoriaux, contenus vidéo et motion design.<br/><b>Projets :</b> cadrage, coordination des parties prenantes et suivi de production pour la BEI, l’IFC, la GIZ et le Cluster EnR.<br/><b>Réalisations :</b> Essaouira Investor Days, Guelmim Investor Day (2 éditions), Nexans Climate Summit et SheWins Arabia.',y)
y=job('Responsable commercial B2B & solutions digitales','Corpotex - Témara / Casablanca','Sept. 2020 - présent',
       '<b>Développement B2B :</b> prospection, offres adaptées, négociation et fidélisation de comptes dans le textile, le médical et les EPI.<br/><b>Exécution :</b> coordination des équipes et suivi des projets jusqu’à la livraison.<br/><b>Outils :</b> conception d’un CRM no-code pour les devis et relances.',y)
y=job('Responsable commercial & développement grands comptes','E-Maroc Wave - Rabat','Oct. 2015 - sept. 2020',
       '<b>Grands comptes :</b> prospection, qualification des besoins, propositions commerciales, négociation et suivi de clients au Maroc et sur des marchés africains.<br/><b>Projets :</b> coordination des livrables corporate, dont catalogues, supports commerciaux et contenus audiovisuels.',y)
y=job('Responsable communication','Maroc Business Consulting - Rabat','Juil. 2014 - oct. 2015',
       'Pilotage de la communication digitale et du site e-commerce Youpi ; animation de communauté et campagnes emailing.',y)
y=job('Chargé marketing et communication','Geantech Agency - Rabat','Avr. 2012 - juin 2014',
       'Élaboration de la stratégie marketing et déploiement des supports de communication ; conception graphique pour les projets clients.',y)
y=section('FORMATION',218,y,353)
y=para('<b>Licence Droit, Économie, Gestion</b> - mention Ingénierie des Services, Université d’Angers (2011)<br/><b>Technicien spécialisé en gestion hôtelière</b> - IIMTH, Rabat (2010)<br/>Certification Google - Fondamentaux du Marketing Digital (2019)',218,y,353,9.6,12.6)
c.save()
reader=PdfReader(str(OUT));assert len(reader.pages)==1
text=reader.pages[0].extract_text()
for token in ['BENCHOKROUN','Design','Licence','Corpotex','négociation']:
    assert token in text,token
print(str(OUT));print('Pages:',len(reader.pages),'Final baseline:',round(y,1),'Bytes:',OUT.stat().st_size)
