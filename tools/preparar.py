# Gera as imagens do site a partir de _ref (rodar da pasta site: python tools/preparar.py)
from PIL import Image, ImageOps
import glob, os, json, random
REF='../_ref'; OUT='assets/img'
def ig(n, k=0):
    f=sorted(glob.glob(f'{REF}/ig/{n}_{k}_*'))
    return f[0]
def crop45(src, dst, w=900, fy=.5):
    im=Image.open(src).convert('RGB'); W,H=im.size; th=W*5/4
    if H>=th: y=int((H-th)*fy); im=im.crop((0,y,W,y+int(th)))
    else: tw=H*4/5; x=int((W-tw)/2); im=im.crop((x,0,x+int(tw),H))
    im=im.resize((w,int(w*5/4)),Image.LANCZOS); im.save(dst,'WEBP',quality=86)
# trabalhos: (indice, estilo)
T=[('031','oriental'),('035','cor'),('048','cor'),('049','cor'),('050','cor'),('054','cor'),('068','cor'),('072','oriental'),
   ('091','cor'),('093','cor'),('155','pb'),('156','oriental'),('160','cor'),('167','oriental'),('171','oriental'),
   ('175','cor'),('182','oriental'),('183','pb'),('187','cor'),('189','cor'),('195','cor'),('196','cor'),('199','oriental'),
   ('201','cor'),('202','cor'),('203','cor'),('207','cor'),('208','cor'),('211','cor'),('213','cor'),('216','cor'),
   ('217','oriental'),('028','cor'),('036','oriental'),('047','cor'),('062','cor'),('129','cor'),('154','pb'),('159','pb')]
lista=[]
for i,(n,e) in enumerate(T):
    d=f'{OUT}/t/{i:02d}.webp'; crop45(ig(n),d); lista.append({'s':f'assets/img/t/{i:02d}.webp','e':e})
json.dump(lista,open('assets/trabalhos.json','w'))
# cartas do tarot (2x)
for f in glob.glob(f'{REF}/cartas/*.png'):
    im=Image.open(f).convert('RGB'); im=im.resize((640,int(640*im.height/im.width)),Image.LANCZOS)
    import numpy as np
    a=np.asarray(im).copy(); h,w=a.shape[:2]; m=np.zeros((h,w),bool); e=int(w*.06); m[:e,:]=m[-e:,:]=True; m[:,:e]=m[:,-e:]=True
    lar=(a[:,:,0]>170)&(a[:,:,1]<140)&(a[:,:,2]<110)
    a[m&lar]=(239,229,204); im=Image.fromarray(a)
    im.save(f'{OUT}/c/'+os.path.basename(f)[:-4]+'.webp','WEBP',quality=90)
# folhas de flash e fechamentos (inteiras)
F={'pasta1':'000_0','pasta2':'000_1','pasta3':'000_3','oriental':'001_0','antebraco':'002_0','ceifador':'045_0','manga':'056_0',
   'cruz':'078_0','pasta4':'000_2','pasta5':'000_4','pasta6':'000_5',
   'fech1':'117_1','fech2':'117_2','fech3':'117_3','fech4':'117_4','fech5':'117_5'}
for k,v in F.items():
    n,j=v.split('_'); im=Image.open(ig(n,int(j))).convert('RGB'); im.thumbnail((1100,1400),Image.LANCZOS)
    im.save(f'{OUT}/f/{k}.webp','WEBP',quality=86)
# pessoas e lugar
crop45(ig('164'),f'{OUT}/arthur.webp',1000,.35)
crop45(ig('170'),f'{OUT}/premio.webp',900,.4)
crop45(ig('083'),f'{OUT}/estudio.webp',900,.5)
# grão do papel
random.seed(3); g=Image.new('L',(220,220))
g.putdata([random.randint(0,255) for _ in range(220*220)])
a=Image.new('RGBA',(220,220)); px=[(40,25,10,int(v*0.07)) for v in g.getdata()]; a.putdata(px); a.save(f'{OUT}/grao.png')
print('ok', len(lista))
# favicon: cabeça do Diabo do tarot dele
d=Image.open(f'{REF}/cartas/diabo.png').convert('RGB'); W,H=d.size
cab=d.crop((int(W*.2),int(H*.05),int(W*.8),int(H*.05)+int(W*.6)))
for s,n in [(32,'favicon.png'),(180,'icon-180.png')]:
    bg=Image.new('RGB',(s,s),(221,85,40)); c=cab.resize((int(s*.86),int(s*.86)),Image.LANCZOS); bg.paste(c,((s-c.width)//2,(s-c.height)//2)); bg.save(f'{OUT}/{n}')
# og
og=Image.new('RGB',(1200,630),(239,229,204))
for i,n in enumerate(['diabo','mago','estrela']):
    c=Image.open(f'{OUT}/c/{n}.webp').convert('RGB').resize((300,562)); og.paste(c,(150+i*320,34))
og.save(f'{OUT}/og.jpg',quality=86)
