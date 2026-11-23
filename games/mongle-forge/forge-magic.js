'use strict';

const ForgeMagic = (() => {
  function mount(canvas, weapon) {
    let ctx = canvas.getContext('2d');
    const layers = new Map(), sprites = new Map();
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    let magic = null, width = 1, height = 1, frame = 0, last = 0, geometry;
    const noise = n => { const value = Math.sin(n * 12.9898 + 78.233) * 43758.5453; return value - Math.floor(value); };
    function resize() {
      const rect = canvas.getBoundingClientRect(), item = weapon.getBoundingClientRect();
      width = rect.width; height = rect.height;
      const dpr = Math.min(devicePixelRatio || 1, 1);
      canvas.width = Math.max(1, Math.round(width * dpr)); canvas.height = Math.max(1, Math.round(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      layers.clear();
      const size = Math.min(item.width, item.height), x = item.left - rect.left + (item.width - size) / 2, y = item.top - rect.top + (item.height - size) / 2;
      if (width <= 0 || height <= 0 || size <= 0) { geometry = null; return; }
      geometry = { ax: x + size * .36, ay: y + size * .68, bx: x + size * .91, by: y + size * .09, size };
      draw(0);
    }
    function dot(x, y, radius, color) { ctx.fillStyle = color; ctx.beginPath(); ctx.arc(x,y,radius,0,Math.PI*2); ctx.fill(); }
    function star(x,y,r,color) { ctx.strokeStyle=color;ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(x-r,y);ctx.lineTo(x+r,y);ctx.moveTo(x,y-r);ctx.lineTo(x,y+r);ctx.stroke(); }
    // Rasterize expensive, unchanged glows once. Moving particles reuse small sprites.
    function layer(key, paint) {
      if (!layers.has(key)) {
        const bitmap=document.createElement('canvas'), main=ctx;
        bitmap.width=canvas.width;bitmap.height=canvas.height;
        ctx=bitmap.getContext('2d');ctx.setTransform(canvas.width/width,0,0,canvas.height/height,0,0);
        ctx.lineCap='round';paint();ctx=main;layers.set(key,bitmap);
      }
      ctx.drawImage(layers.get(key),0,0,width,height);
    }
    function particle(x,y,r,color,shape='dot') {
      const key=color+shape;
      if(!sprites.has(key)) {
        const bitmap=document.createElement('canvas'),main=ctx;
        bitmap.width=bitmap.height=48;ctx=bitmap.getContext('2d');
        ctx.shadowColor=color;ctx.shadowBlur=10;
        if(shape==='star')star(24,24,3,color);else dot(24,24,3,color);
        ctx=main;sprites.set(key,bitmap);
      }
      const size=r*16;ctx.drawImage(sprites.get(key),x-size/2,y-size/2,size,size);
    }
    function draw(time) {
      ctx.clearRect(0,0,width,height);
      if (!magic || !geometry) return;
      const t=time/1000, g=geometry, dx=g.bx-g.ax, dy=g.by-g.ay, length=Math.hypot(dx,dy), nx=-dy/length, ny=dx/length, strength=1+(magic.tier-1)*.15;
      if (!Number.isFinite(length) || length < 1) return;
      const point=(u,offset=0)=>({x:g.ax+dx*u+nx*offset,y:g.ay+dy*u+ny*offset});
      ctx.save();ctx.globalCompositeOperation='lighter';ctx.lineCap='round';
      if(magic.id==='fire') {
        const center=point(.53), heat=ctx.createRadialGradient(center.x,center.y,0,center.x,center.y,g.size*.42);
        heat.addColorStop(0,'#ff7b171c');heat.addColorStop(.6,'#ff6b1208');heat.addColorStop(1,'#ff6b1200');ctx.fillStyle=heat;ctx.fillRect(0,0,width,height);
        const ringX=width*.54,ringY=height*.675,radius=width*.19;
        layer('fire-ring',()=>{
        ctx.save();ctx.translate(ringX,ringY);ctx.scale(1,.22);
        const ringHeat=ctx.createRadialGradient(0,0,0,0,0,radius*1.4);ringHeat.addColorStop(0,'#fff4d11f');ringHeat.addColorStop(.65,'#ff99243d');ringHeat.addColorStop(1,'#ff721000');ctx.fillStyle=ringHeat;ctx.fillRect(-radius*1.5,-radius*1.5,radius*3,radius*3);ctx.restore();
        ctx.shadowColor='#ff7b0a';ctx.shadowBlur=22;
        for(let ring=0;ring<5;ring++){
          for(const layer of [0,1]){
            ctx.strokeStyle=layer?'#fff1bede':'#ff7e2766';ctx.lineWidth=layer?1.8:8;ctx.beginPath();
            for(let j=0;j<=64;j++){const angle=j/64*Math.PI*1.7+ring*1.7,rr=radius*(.85+ring*.065+Math.sin(angle*5+ring)*.028);const x=ringX+Math.cos(angle)*rr,y=ringY+Math.sin(angle)*rr*.15+Math.sin(angle*7+ring)*3;if(j)ctx.lineTo(x,y);else ctx.moveTo(x,y)}ctx.stroke();
          }
        }
        });
        for(let i=0;i<65;i++){const angle=noise(i+19)*Math.PI*2+t*.3,r=radius*(.75+noise(i+29)*.55),rise=(noise(i+39)+t*.12)%1,x=ringX+Math.cos(angle)*r,y=ringY+Math.sin(angle)*r*.15-rise*height*.06;ctx.globalAlpha=(1-rise)*.9;particle(x,y,.8+noise(i+18)*.7,i%3?'#ffb648':'#fff4d7');}ctx.globalAlpha=1;
      } else if(magic.id==='ice') {
        layer('ice-shards',()=>{for(let i=0;i<7+magic.tier*2;i++){
          const u=noise(i+11), drift=Math.sin(t*.7+i)*g.size*.015, p=point(u,(i%2?1:-1)*g.size*(.035+noise(i+17)*.09)*strength+drift);
          const size=g.size*(.005+noise(i+31)*.01)*strength;
          ctx.save();ctx.translate(p.x,p.y);ctx.rotate(i*2.3+Math.sin(t*.4+i)*.16);ctx.shadowColor='#72d6ff';ctx.shadowBlur=12;
          const gradient=ctx.createLinearGradient(-size,0,size,0);gradient.addColorStop(0,'#3c9dcc77');gradient.addColorStop(.5,'#e9fdffee');gradient.addColorStop(1,'#8bddff99');ctx.fillStyle=gradient;
          ctx.beginPath();ctx.moveTo(0,-size*2);ctx.lineTo(size*.7,0);ctx.lineTo(0,size*1.3);ctx.lineTo(-size*.6,0);ctx.closePath();ctx.fill();ctx.strokeStyle='#e5fcffbb';ctx.lineWidth=1;ctx.stroke();ctx.restore();
        }});
      } else if(magic.id==='thunder') {
        const phase=Math.floor(t*2.2), pulse=.52+.48*Math.sin(t*4.4)**2;
        ctx.globalAlpha=pulse;layer('bolt-'+phase%6,()=>{for(let bolt=0;bolt<2+Math.floor(magic.tier/2);bolt++){
          ctx.beginPath();for(let j=0;j<=18;j++){const p=point(j/18,(noise(j+phase*21+bolt*73)-.5)*g.size*.14*strength);if(!j)ctx.moveTo(p.x,p.y);else ctx.lineTo(p.x,p.y)}
          ctx.strokeStyle=bolt%2?'#b0baff':'#68b9ff';ctx.shadowColor='#7d9dff';ctx.shadowBlur=18;ctx.lineWidth=3;ctx.stroke();ctx.shadowBlur=0;ctx.strokeStyle='#f1f8ff';ctx.lineWidth=.9;ctx.stroke();
        }});ctx.globalAlpha=1;
      } else if(magic.id==='void') {
        const center=point(.42), radius=g.size*.085*strength;
        ctx.save();ctx.translate(center.x,center.y);ctx.rotate(-.55);ctx.globalCompositeOperation='source-over';
        const gradient=ctx.createRadialGradient(0,0,radius*.1,0,0,radius);gradient.addColorStop(0,'#05051aaf');gradient.addColorStop(.7,'#18103939');gradient.addColorStop(1,'#a674ff00');ctx.fillStyle=gradient;ctx.beginPath();ctx.ellipse(0,0,radius*1.5,radius*.65,0,0,Math.PI*2);ctx.fill();
        ctx.globalCompositeOperation='lighter';ctx.strokeStyle='#c997ff';ctx.shadowColor='#9254ff';ctx.shadowBlur=16;ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(0,0,radius*1.5,radius*.65,0,t*.3,t*.3+Math.PI*1.7);ctx.stroke();ctx.restore();
      } else {
        const center=point(.05), span=g.size*.28*strength;
        layer('radiance-wings',()=>{ctx.shadowColor='#ffe99b';ctx.shadowBlur=14;
        for(let side of [-1,1])for(let i=0;i<9+magic.tier;i++){
          const spread=span*(.55+i*.055), end=point(.19+i*.018,side*spread);
          ctx.strokeStyle=i%2?'#fff6c8cc':'#e3b657aa';ctx.lineWidth=1.2+i*.12;ctx.beginPath();ctx.moveTo(center.x,center.y);ctx.quadraticCurveTo(center.x+nx*side*spread*.4+dx*.15,center.y+ny*side*spread*.4+dy*.15,end.x,end.y);ctx.stroke();
        }});
      }
      ctx.shadowBlur=0;
      const count=55+magic.tier*13;
      for(let i=0;i<count;i++){
        const progress=(noise(i+55)+t*(magic.id==='ice'?.035:.085))%1, side=i%2?1:-1;
        const p=point(noise(i+75),(noise(i+95)*.2+.018)*g.size*side*strength);
        let x=p.x+Math.sin(t*.7+i)*g.size*.018,y=p.y-progress*g.size*.16;
        if(magic.id==='void'){const a=t*.7+i*2.4,r=(1-progress)*g.size*.21*strength,c=point(.45);x=c.x+Math.cos(a)*r*1.5;y=c.y+Math.sin(a)*r*.6;}
        ctx.globalAlpha=Math.sin(progress*Math.PI)*.85;
        if(magic.id==='ice'||magic.id==='radiance')particle(x,y,(1+noise(i+6)*2.5)*g.size/600,magic.color,'star');
        else particle(x,y,(.7+noise(i+26)*1.4)*g.size/600,magic.id==='fire'?'#ffc15e':magic.color);
      }
      ctx.globalAlpha=1;
      if(magic.tier>=2){const center=point(.36), radius=g.size*(.16+magic.tier*.012);ctx.strokeStyle=magic.color+'77';ctx.lineWidth=1;ctx.setLineDash(magic.id==='ice'?[8,10]:[40,14]);ctx.beginPath();ctx.ellipse(center.x,center.y,radius*1.4,radius*.62,-.65,t*.15,t*.15+Math.PI*2);ctx.stroke();ctx.setLineDash([]);}
      ctx.restore();
    }
    function loop(time) {
      frame=0;
      if(!magic||document.hidden||reduced.matches)return;
      if(time-last>=30){draw(time);last=time;}
      frame=requestAnimationFrame(loop);
    }
    function update(next) {
      const changed=magic?.id!==next?.id||magic?.tier!==next?.tier;
      magic=next;
      canvas.hidden=!magic;
      if(!magic){cancelAnimationFrame(frame);frame=0;ctx.clearRect(0,0,width,height);return;}
      if(changed)resize();
      if(reduced.matches)draw(0);else if(!frame)frame=requestAnimationFrame(loop);
    }
    new ResizeObserver(resize).observe(canvas.parentElement);
    weapon.addEventListener('load',resize);
    document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(frame);frame=0;}else update(magic)});
    reduced.addEventListener('change',()=>{cancelAnimationFrame(frame);frame=0;update(magic)});
    resize();return {update};
  }
  return { mount };
})();
