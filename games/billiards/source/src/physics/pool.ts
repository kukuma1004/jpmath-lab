import type { BallState, PocketConfig, TableConfig, Vec2 } from './types';
import type { Rail } from './CollisionSystem';
import { makeBall } from './presets';

/** Nine-foot playing surface, 57.15 mm pool balls, SI units. */
export const POOL_TABLE: TableConfig = {
  kind: 'pool', width: 2.54, height: 1.27, ballRadius: 0.028575, ballMass: 0.17,
  pockets: [
    { id:'tl',x:-1.304,z:-0.669,radius:0.072,mouth:0.132 },
    { id:'tm',x:0,z:-0.708,radius:0.075,mouth:0.150 },
    { id:'tr',x:1.304,z:-0.669,radius:0.072,mouth:0.132 },
    { id:'bl',x:-1.304,z:0.669,radius:0.072,mouth:0.132 },
    { id:'bm',x:0,z:0.708,radius:0.075,mouth:0.150 },
    { id:'br',x:1.304,z:0.669,radius:0.072,mouth:0.132 },
  ],
};

/** Physical cushion nose faces. Balls collide at one radius from these segments. */
export interface RailSegment {
  id: string;
  rail: Rail;
  a: Vec2;
  b: Vec2;
  normal: Vec2;
  kind: 'rail'|'jaw';
}
export interface PocketLine { a: Vec2; b: Vec2; center: Vec2 }
export interface PocketGeometry {
  pocket: PocketConfig;
  /** Unit direction from the bed into the pocket. */
  outward: Vec2;
  /** Entry edge between the two main rail ends. */
  mouth: PocketLine;
  /** Drop boundary behind the finite jaw faces; the visible hole is centred at pocket.x/z. */
  throat: PocketLine;
}

const geometryCache=new WeakMap<TableConfig,PocketGeometry[]>();
const railsCache=new WeakMap<TableConfig,RailSegment[]>();
const plus=(a:Vec2,b:Vec2,scale=1):Vec2=>({x:a.x+b.x*scale,z:a.z+b.z*scale});
const line=(a:Vec2,b:Vec2):PocketLine=>({a,b,center:{x:(a.x+b.x)/2,z:(a.z+b.z)/2}});

/**
 * Pocket.radius describes the visible fall hole, never a capture disc on the cloth.
 * Corner mouth is a diagonal opening; side mouth is a cut along its rail.
 * Returned geometry is shared read-only data. Do not mutate cached arrays or vectors.
 */
export function getPocketGeometry(table:TableConfig):PocketGeometry[]{
  const cached=geometryCache.get(table);if(cached)return cached;
  const hw=table.width/2,hh=table.height/2;
  const result=(table.pockets??[]).map(pocket=>{
    const corner=Math.abs(pocket.x)>hw*.7&&Math.abs(pocket.z)>hh*.7;
    const sx=Math.sign(pocket.x)||1,sz=Math.sign(pocket.z)||1;
    const outward:Vec2=corner?{x:sx/Math.SQRT2,z:sz/Math.SQRT2}:Math.abs(pocket.z)/hh>=Math.abs(pocket.x)/hw?{x:0,z:sz}:{x:sx,z:0};
    const tangent={x:-outward.z,z:outward.x};
    let a:Vec2,b:Vec2;
    if(corner){const cut=pocket.mouth/Math.SQRT2;a={x:sx*(hw-cut),z:sz*hh};b={x:sx*hw,z:sz*(hh-cut)};}
    else{
      const center={x:outward.x?outward.x*hw:pocket.x,z:outward.z?outward.z*hh:pocket.z};
      a=plus(center,tangent,-pocket.mouth/2);b=plus(center,tangent,pocket.mouth/2);
    }
    const mouth=line(a,b);
    if((mouth.a.x-mouth.center.x)*tangent.x+(mouth.a.z-mouth.center.z)*tangent.z>0){const swap=mouth.a;mouth.a=mouth.b;mouth.b=swap;}
    const center=plus(pocket,outward,-pocket.radius*.42),halfWidth=Math.min(pocket.radius*.84,pocket.mouth*.425);
    return {pocket,outward,mouth,throat:line(plus(center,tangent,-halfWidth),plus(center,tangent,halfWidth))};
  });
  geometryCache.set(table,result);return result;
}

/** Finite main rail faces plus tapered pocket jaws, suitable for identical renderer geometry. */
export function getRailSegments(table:TableConfig):RailSegment[]{
  const cached=railsCache.get(table);if(cached)return cached;
  const hw=table.width/2,hh=table.height/2,result:RailSegment[]=[];
  const gaps:Record<Rail,[number,number][]>={left:[],right:[],top:[],bottom:[]};
  const geometry=getPocketGeometry(table);
  for(const g of geometry){
    const {outward:n,pocket}=g;
    if(n.x!==0&&n.z!==0){
      const cut=pocket.mouth/Math.SQRT2,x=Math.sign(n.x)*hw,z=Math.sign(n.z)*hh;
      gaps[n.z<0?'top':'bottom'].push([Math.min(x,x-Math.sign(n.x)*cut),Math.max(x,x-Math.sign(n.x)*cut)]);
      gaps[n.x<0?'left':'right'].push([Math.min(z,z-Math.sign(n.z)*cut),Math.max(z,z-Math.sign(n.z)*cut)]);
    }else if(n.z!==0)gaps[n.z<0?'top':'bottom'].push([pocket.x-pocket.mouth/2,pocket.x+pocket.mouth/2]);
    else gaps[n.x<0?'left':'right'].push([pocket.z-pocket.mouth/2,pocket.z+pocket.mouth/2]);
  }
  for(const rail of ['left','right','top','bottom'] as const){
    const horizontal=rail==='top'||rail==='bottom',extent=horizontal?hw:hh;
    const normal:Vec2=rail==='left'?{x:1,z:0}:rail==='right'?{x:-1,z:0}:rail==='top'?{x:0,z:1}:{x:0,z:-1};
    const point=(value:number):Vec2=>horizontal?{x:value,z:rail==='top'?-hh:hh}:{x:rail==='left'?-hw:hw,z:value};
    let from=-extent,index=0;
    for(const [start,end] of gaps[rail].sort((a,b)=>a[0]-b[0])){
      const to=Math.max(-extent,Math.min(extent,start));
      if(to>from+1e-9)result.push({id:`${rail}-${index++}`,rail,a:point(from),b:point(to),normal:{...normal},kind:'rail'});
      from=Math.max(from,Math.min(extent,end));
    }
    if(from<extent-1e-9)result.push({id:`${rail}-${index}`,rail,a:point(from),b:point(extent),normal:{...normal},kind:'rail'});
  }
  for(const g of geometry){
    for(const side of ['a','b'] as const){
      const a=g.mouth[side],b=g.throat[side],dx=b.x-a.x,dz=b.z-a.z,length=Math.hypot(dx,dz);
      let normal={x:-dz/length,z:dx/length};
      if((g.mouth.center.x-a.x)*normal.x+(g.mouth.center.z-a.z)*normal.z<0)normal={x:-normal.x,z:-normal.z};
      const rail:Rail=Math.abs(Math.abs(a.x)-hw)<1e-8?(a.x<0?'left':'right'):(a.z<0?'top':'bottom');
      result.push({id:`jaw-${g.pocket.id}-${side}`,rail,a:{...a},b:{...b},normal,kind:'jaw'});
    }
  }
  railsCache.set(table,result);return result;
}

/** WPA rack constraints: apex on foot spot, 8 in centre, rear corners opposite groups. */
export function createPoolRack():BallState[]{
  const r=POOL_TABLE.ballRadius,gap=.00005,rowStep=Math.sqrt(3)*(r+gap/2),columnStep=2*r+gap;
  const numbers=[1,9,2,10,8,3,11,4,12,5,6,13,7,14,15];
  // Start clearly behind the head string; the exact boundary is not a legal
  // ball-in-hand centre for the opening break.
  const balls=[makeBall('white','white',-.85,0)];
  let index=0;
  for(let row=0;row<5;row++)for(let column=0;column<=row;column++){
    const number=numbers[index++],ball=makeBall(`ball-${number}`,'pool',POOL_TABLE.width/4+row*rowStep,(column-row/2)*columnStep);
    ball.number=number;balls.push(ball);
  }
  return balls;
}

/** Ball-in-hand requires an interior centre, away from every live ball and pocket mouth. */
export function canPlaceBall(table:TableConfig,balls:BallState[],ballId:string,position:Vec2,zone:'anywhere'|'kitchen'='anywhere'):boolean{
  const r=table.ballRadius;
  if(![position.x,position.z].every(Number.isFinite)||Math.abs(position.x)>table.width/2-r||Math.abs(position.z)>table.height/2-r)return false;
  if(zone==='kitchen'&&position.x>=-table.width/4)return false;
  if(!balls.some(ball=>ball.id===ballId))return false;
  if(balls.some(ball=>ball.id!==ballId&&!ball.pocketed&&Math.hypot(ball.position.x-position.x,ball.position.z-position.z)<2*r+1e-6))return false;
  // A ball must not be placed over a corner cutout or into a side-pocket entrance.
  for(const g of getPocketGeometry(table)){
    const inward=(position.x-g.mouth.center.x)*g.outward.x+(position.z-g.mouth.center.z)*g.outward.z;
    const lateral=(position.x-g.mouth.center.x)*(-g.outward.z)+(position.z-g.mouth.center.z)*g.outward.x;
    const halfWidth=Math.hypot(g.mouth.a.x-g.mouth.b.x,g.mouth.a.z-g.mouth.b.z)/2;
    if(inward>-r&&Math.abs(lateral)<halfWidth+r)return false;
  }
  return true;
}

/** Snapshot validity includes the short physical shelf between mouth and fall throat. */
export function isInsideTableOrPocketApproach(table:TableConfig,position:Vec2):boolean{
  const r=table.ballRadius;
  if(Math.abs(position.x)<=table.width/2-r+1e-8&&Math.abs(position.z)<=table.height/2-r+1e-8)return true;
  // A centre may legitimately wrap around a rounded rail end before it crosses
  // the mouth plane. A rectangular R-inset, or width-R on sloping jaws, cuts
  // away that valid free region. Use the same finite faces/endcaps as CCD.
  const clear=getRailSegments(table).every(segment=>{
    const dx=segment.b.x-segment.a.x,dz=segment.b.z-segment.a.z;
    const u=Math.max(0,Math.min(1,((position.x-segment.a.x)*dx+(position.z-segment.a.z)*dz)/(dx*dx+dz*dz)));
    return Math.hypot(position.x-segment.a.x-u*dx,position.z-segment.a.z-u*dz)>=r-1e-8;
  });
  if(!clear)return false;
  if(table.pockets?.length&&Math.abs(position.x)<=table.width/2+1e-8&&Math.abs(position.z)<=table.height/2+1e-8)return true;
  return getPocketGeometry(table).some(g=>{
    const n=g.outward,dx=position.x-g.mouth.center.x,dz=position.z-g.mouth.center.z,depth=dx*n.x+dz*n.z;
    const length=(g.throat.center.x-g.mouth.center.x)*n.x+(g.throat.center.z-g.mouth.center.z)*n.z;
    const lateral=dx*(-n.z)+dz*n.x;
    const mouthHalf=Math.hypot(g.mouth.a.x-g.mouth.b.x,g.mouth.a.z-g.mouth.b.z)/2;
    const throatHalf=Math.hypot(g.throat.a.x-g.throat.b.x,g.throat.a.z-g.throat.b.z)/2;
    const width=mouthHalf+(throatHalf-mouthHalf)*Math.max(0,Math.min(1,depth/length));
    return depth>=-r-1e-8&&depth<=length+1e-8&&Math.abs(lateral)<=width+1e-8;
  });
}
