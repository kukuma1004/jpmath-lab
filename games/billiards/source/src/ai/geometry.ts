import type { BallState, TableConfig, Vec2 } from '../physics/types';
export const distance=(a:Vec2,b:Vec2):number=>Math.hypot(a.x-b.x,a.z-b.z);
export const angleTo=(a:Vec2,b:Vec2):number=>Math.atan2(b.z-a.z,b.x-a.x);
export const unit=(a:Vec2,b:Vec2):Vec2=>{const d=distance(a,b)||1;return{x:(b.x-a.x)/d,z:(b.z-a.z)/d};};
export const clamp=(v:number,min:number,max:number):number=>Math.max(min,Math.min(max,v));
export function pathClear(a:Vec2,b:Vec2,balls:BallState[],radius:number,ignore:string[]):boolean {
  const dx=b.x-a.x,dz=b.z-a.z,len=dx*dx+dz*dz;
  return !balls.some(ball=>{
    if(ball.pocketed||ignore.includes(ball.id))return false;
    const u=clamp(((ball.position.x-a.x)*dx+(ball.position.z-a.z)*dz)/(len||1),0,1);
    return Math.hypot(ball.position.x-a.x-u*dx,ball.position.z-a.z-u*dz)<radius*2+.001;
  });
}
/** Unfolding a rectangular bed supplies geometrical candidates only; the engine decides success. */
export function mirroredPoints(p:Vec2,table:TableConfig,depth:number):{point:Vec2;rails:number}[]{
  const w=table.width-2*table.ballRadius,h=table.height-2*table.ballRadius;
  const out:{point:Vec2;rails:number}[]=[];
  for(let x=-depth;x<=depth;x++)for(let z=-depth;z<=depth;z++){
    const rails=Math.abs(x)+Math.abs(z);if(rails>depth)continue;
    out.push({point:{x:x*w+(Math.abs(x)%2?-p.x:p.x),z:z*h+(Math.abs(z)%2?-p.z:p.z)},rails});
  }
  return out.sort((a,b)=>a.rails-b.rails);
}
export function rng(seed:number):()=>number {
  let s=seed|0;
  return()=>{s=(s+0x6D2B79F5)|0;let v=Math.imul(s^(s>>>15),1|s);v^=v+Math.imul(v^(v>>>7),61|v);return((v^(v>>>14))>>>0)/4294967296;};
}
