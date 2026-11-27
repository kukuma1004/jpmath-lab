type Point = [number, number];
type Brush = CanvasRenderingContext2D;

function polygon(g:Brush, points:Point[], color:string):void {
  g.fillStyle=color; g.beginPath();
  points.forEach(([x,y],i)=>i ? g.lineTo(x,y) : g.moveTo(x,y));
  g.closePath(); g.fill();
}

function beam(g:Brush, a:Point, b:Point, width:number):void {
  for(const [size,color,shift] of [[width,'#423839',0],[width*.72,'#986f4c',-1],[width*.21,'#e5ba79',-2]] as const) {
    g.strokeStyle=color; g.lineWidth=size; g.beginPath(); g.moveTo(a[0]+shift,a[1]); g.lineTo(b[0]+shift,b[1]); g.stroke();
  }
}

/** An irregular jointed rock face follows each terrace down into the quarry. */
export function drawCliff(g:Brush, ridge:Point[], texture?:HTMLImageElement):void {
  const left=ridge[0]![0], right=ridge[ridge.length-1]![0], bottom=660;
  let seed=Math.floor(right*83);
  const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0; return seed/4294967296;};
  g.save();
  polygon(g,[...ridge,[right,bottom],[left,bottom]],'#40546b');
  g.clip();
  const crest=Math.min(...ridge.map(p=>p[1]));
  const painted=Boolean(texture?.naturalWidth);
  if(painted && texture) {
    // Keep mineral veins continuous between strata, even where a ledge steps down.
    const depth=bottom-crest;
    const sourceWidth=Math.min(.23,Math.max(.045,(right-left)/3200));
    g.drawImage(texture,texture.width*(.91-sourceWidth),texture.height*.245,
      texture.width*sourceWidth,texture.height*.15,left,crest,right-left,depth);
    const shade=g.createLinearGradient(0,crest,0,bottom);
    shade.addColorStop(0,'rgba(49,58,66,.14)');
    shade.addColorStop(.57,'rgba(41,55,75,.34)');
    shade.addColorStop(1,'rgba(28,43,64,.71)');
    g.fillStyle=shade;
    g.fillRect(left,crest,right-left,depth);
  }
  for(let y=crest-42;y<bottom;y+=42) {
    let x=left-42-random()*37;
    while(x<right) {
      const w=29+random()*46, h=38+random()*16, shear=7+random()*14;
      const value=Math.round(44+random()*18-(y-390)*.075);
      const stone=(light:number)=>'hsl(214 17% '+(value+light)+'%)';
      const corners: Point[] = [[x,y+8],[x+w*.33,y-2],[x+w,y+3],[x+w-shear,y+h-5],[x+w*.38-shear,y+h+5],[x-shear,y+h]];
      if(!painted) polygon(g,corners,stone(0));
      const lip=y+7+Math.sin(x*.017+y*.012)*8;
      if(painted && random()<.58) { x+=w-3; continue; }
      polygon(g,[[x,lip],[x+w*.28,lip-3],[x+w,lip-9],[x+w*.6,lip-2],[x+1,lip+3]],'rgba(247,190,113,.49)');
      polygon(g,[[x,lip+3],[x+w*.6,lip-2],[x+w,lip-9],[x+w*.85,lip-3],[x+w*.31,lip+3],[x-2,lip+7]],'rgba(29,40,55,.38)');
      const seam=x+w*.77;
      polygon(g,[[seam,lip-2],[seam-3,lip+8],[seam-12,lip+19],[seam-shear,lip+h-5],[seam-14,lip+18],[seam-6,lip+8]],'rgba(31,40,49,.58)');
      x+=w-3;
    }
  }
  // Exposed bedding forms long sloping shelves across the vertical joints.
  for(let y=crest+17;y<bottom+45;y+=24+random()*20) {
    for(let x=left-45;x<right;) {
      const width=58+random()*104, rise=8+random()*13;
      const level=y-(x-left)*.09+random()*5;
      const shelf:Point[]=[[x,level],[x+width*.33,level-rise*.48],[x+width*.64,level-rise*.57],[x+width,level-rise]];
      polygon(g,[...shelf,[x+width*.82,level-rise+7],[x+width*.38,level-rise*.32+8]],'rgba(24,39,55,.49)');
      polygon(g,[...shelf,[x+width*.73,level-rise*.6-2],[x+width*.36,level-rise*.46-3]],'rgba(242,192,118,.70)');
      x+=width+random()*24;
    }
  }
  for(let i=1;i<ridge.length;i++) {
    const a=ridge[i-1]!, b=ridge[i]!;
    if(b[1]-a[1]>18 && b[0]-a[0]<80) continue;
    const n=Math.ceil((b[0]-a[0])/14);
    for(let j=0;j<n;j++) {
      const x=a[0]+(b[0]-a[0])*j/n,y=a[1]+(b[1]-a[1])*j/n;
      polygon(g,[[x,y-4],[x+16,y-3],[x+12,y+2+random()*2],[x-2,y+4]],random()>.4?'#d4aa70':'#b19a65');
      if(random()>.35) polygon(g,[[x,y],[x+10,y],[x+6,y+3],[x-2,y+3]],'#ffe1a1');
    }
  }
  g.restore();
  for(let i=1;i<ridge.length;i++) {
    const [ax,ay]=ridge[i-1]!, [bx,by]=ridge[i]!;
    if (Math.abs(by-ay)>28 || bx-ax<28) continue;
    for(let j=0;j<(bx-ax)/8;j++) {
      const t=random(), x=ax+(bx-ax)*t, y=ay+(by-ay)*t;
      for(let blade=0;blade<3;blade++) {
        const lean=(random()-.25)*8, h=2+random()*7;
        polygon(g,[[x-1,y+1],[x+lean,y-h],[x+1.8,y+.5]],blade===1?'#fae0a0':'#a29856');
      }
    }
  }
}

export function drawBarricade(g:Brush,x:number,y:number,w:number,bottom:number,texture?:HTMLImageElement):void {
  drawCliff(g,[[x-56,bottom],[x-10,y+65],[x,y],[x+w,y],[x+w,y+63],[x+w+39,bottom]],texture);
  for(const side of [x+2,x+w-3]) beam(g,[side,y+1],[side-3,y+67],5);
  beam(g,[x,y+6],[x+w,y+4],8);
  for(const bolt of [x+4,x+w-5]) { g.fillStyle='#ddd7a8'; g.beginPath(); g.arc(bolt,y+4,1.6,0,Math.PI*2); g.fill(); }
  polygon(g,[[x+w,y+10],[x+w+14,y+8],[x+w+12,y+40],[x+w+7,y+35],[x+w+2,y+41]],'#a84236');
  polygon(g,[[x+w+7,y+15],[x+w+11,y+21],[x+w+7,y+26],[x+w+4,y+21]],'#eeca82');
}
