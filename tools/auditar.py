# Auditoria: overflow + screenshots em vários tamanhos. Uso: python tools/auditar.py
import http.server, threading, functools, os, sys
from playwright.sync_api import sync_playwright
PORT=8897; OUT='../_ref/ver'; os.makedirs(OUT,exist_ok=True)
H=functools.partial(http.server.SimpleHTTPRequestHandler,directory='.')
http.server.SimpleHTTPRequestHandler.log_message=lambda *a:None
srv=http.server.ThreadingHTTPServer(('127.0.0.1',PORT),H); threading.Thread(target=srv.serve_forever,daemon=True).start()
TAM=[(320,640),(375,812),(390,844),(430,932),(768,1024),(1024,768),(1366,768),(1920,1080),(844,390)]
JS='''()=>{const W=document.documentElement.clientWidth,r=[];document.querySelectorAll('body *').forEach(e=>{const b=e.getBoundingClientRect();if(b.width&&(b.right>W+1||b.left<-1)&&!e.closest('.lb'))r.push(e.tagName+'.'+e.className+' '+Math.round(b.left)+'/'+Math.round(b.right))});return {sw:document.documentElement.scrollWidth,W,r:r.slice(0,8)}}'''
with sync_playwright() as p:
    b=p.chromium.launch(channel='msedge')
    for w,h in TAM:
        pg=b.new_page(viewport={'width':w,'height':h}); erros=[]
        pg.on('pageerror',lambda e:erros.append(str(e)))
        pg.goto(f'http://127.0.0.1:{PORT}/',wait_until='networkidle'); pg.wait_for_timeout(1600)
        pg.screenshot(path=f'{OUT}/hero-{w}x{h}.png')
        if w in (390,1366):
            pg.evaluate("document.querySelectorAll('.revela').forEach(e=>e.classList.add('vis'))"); pg.wait_for_timeout(500)
            pg.screenshot(path=f'{OUT}/full-{w}.png',full_page=True)
        r=pg.evaluate(JS); print(w,h,'scrollW',r['sw'],'W',r['W'],r['r'],erros)
        pg.close()
    b.close()
srv.shutdown()
