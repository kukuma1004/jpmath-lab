import type { BallState, TableConfig } from './types';
import type { PhysicsConfig } from './config';

export type Rail = 'left'|'right'|'top'|'bottom';
export interface Contact { time: number; a: number; b?: number; rail?: Rail }
const EPS = 1e-10;

/** Earliest swept-circle time, including contacts before the next discrete frame. */
export function ballTimeOfImpact(a: BallState, b: BallState, diameter: number, horizon: number): number | null {
  const dx = b.position.x-a.position.x, dz = b.position.z-a.position.z;
  const vx = b.velocity.x-a.velocity.x, vz = b.velocity.z-a.velocity.z;
  const approach = dx*vx+dz*vz;
  if (approach >= -EPS) return null;
  const c = dx*dx+dz*dz-diameter*diameter;
  if (c <= EPS) return 0;
  const speed2 = vx*vx+vz*vz;
  const disc = approach*approach-speed2*c;
  if (disc < 0 || speed2 < EPS) return null;
  // Equivalent stable quadratic root avoids cancellation for nearly touching balls.
  const t = c / (-approach+Math.sqrt(disc));
  return t >= -EPS && t <= horizon+EPS ? Math.max(0, Math.min(horizon, t)) : null;
}

export function earliestContact(balls: BallState[], table: TableConfig, horizon: number): Contact | null {
  const xLimit=table.width/2-table.ballRadius, zLimit=table.height/2-table.ballRadius;
  let best: Contact | null = null;
  const consider=(contact: Contact)=>{
    if (contact.time >= -EPS && contact.time <= horizon+EPS && (!best || contact.time < best.time-EPS)) {
      best={...contact,time:Math.max(0,Math.min(horizon,contact.time))};
    }
  };
  for(let i=0;i<balls.length;i++) {
    const {position:p,velocity:v}=balls[i];
    if(v.x < -EPS) consider({time:(-xLimit-p.x)/v.x,a:i,rail:'left'});
    if(v.x > EPS) consider({time:(xLimit-p.x)/v.x,a:i,rail:'right'});
    if(v.z < -EPS) consider({time:(-zLimit-p.z)/v.z,a:i,rail:'top'});
    if(v.z > EPS) consider({time:(zLimit-p.z)/v.z,a:i,rail:'bottom'});
    for(let j=i+1;j<balls.length;j++) {
      const t=ballTimeOfImpact(balls[i],balls[j],2*table.ballRadius,horizon);
      if(t !== null) consider({time:t,a:i,b:j});
    }
  }
  return best;
}

/** Impulses at constrained planar solid spheres, with Coulomb-clamped contact friction. */
export function resolveBallCollision(a: BallState, b: BallState, table: TableConfig, config: PhysicsConfig): number {
  const r=table.ballRadius,m=table.ballMass,inertia=0.4*m*r*r;
  const dx=b.position.x-a.position.x,dz=b.position.z-a.position.z,length=Math.hypot(dx,dz);
  const nx=length>EPS?dx/length:1,nz=length>EPS?dz/length:0;
  const vn=(b.velocity.x-a.velocity.x)*nx+(b.velocity.z-a.velocity.z)*nz;
  if(vn>=-EPS) return 0;
  const jn=-(1+config.ballRestitution)*vn*m/2;
  const tx=-nz,tz=nx;
  // Contact B-A horizontal tangent slip. At A r=+Rn; at B r=-Rn.
  const vt=(b.velocity.x-a.velocity.x)*tx+(b.velocity.z-a.velocity.z)*tz
    + r*(a.angularVelocity.y+b.angularVelocity.y);
  // Vertical slip changes roll spin while vertical translation is constrained by the cloth.
  const vy=-r*((a.angularVelocity.z+b.angularVelocity.z)*nx-(a.angularVelocity.x+b.angularVelocity.x)*nz);
  let jt=-vt/(2/m+2*r*r/inertia),jy=-vy/(2*r*r/inertia);
  const tangent=Math.hypot(jt,jy),limit=config.ballFriction*jn;
  if(tangent>limit && tangent>0){jt*=limit/tangent;jy*=limit/tangent;}
  const jx=jn*nx+jt*tx,jz=jn*nz+jt*tz;
  a.velocity.x-=jx/m;a.velocity.z-=jz/m;
  b.velocity.x+=jx/m;b.velocity.z+=jz/m;
  // Both torques are -R n × J_t; the normal impulse passes through each centre.
  const wx=r*nz*jy/inertia,wy=r*(nx*jt*tz-nz*jt*tx)/inertia,wz=-r*nx*jy/inertia;
  a.angularVelocity.x+=wx;a.angularVelocity.y+=wy;a.angularVelocity.z+=wz;
  b.angularVelocity.x+=wx;b.angularVelocity.y+=wy;b.angularVelocity.z+=wz;
  return -vn;
}

export function railNormal(rail: Rail): {x:number;z:number} {
  return rail==='left'?{x:1,z:0}:rail==='right'?{x:-1,z:0}:rail==='top'?{x:0,z:1}:{x:0,z:-1};
}

export function resolveCushionCollision(ball: BallState, rail: Rail, table: TableConfig, config: PhysicsConfig): number {
  const {x:nx,z:nz}=railNormal(rail),tx=-nz,tz=nx;
  const v=ball.velocity,w=ball.angularVelocity,r=table.ballRadius,m=table.ballMass,inertia=0.4*m*r*r;
  const vn=v.x*nx+v.z*nz;
  if(vn>=-EPS) return 0;
  const jn=-(1+config.cushionRestitution)*vn*m;
  const vt=v.x*tx+v.z*tz+r*w.y;
  // r_contact=-Rn; contact y velocity is R(ωx nz - ωz nx).
  const vy=r*(w.x*nz-w.z*nx);
  let jt=-vt/(1/m+r*r/inertia),jy=-vy/(r*r/inertia);
  const tangent=Math.hypot(jt,jy),limit=config.cushionFriction*jn;
  if(tangent>limit && tangent>0){jt*=limit/tangent;jy*=limit/tangent;}
  v.x+=(jn*nx+jt*tx)/m;v.z+=(jn*nz+jt*tz)/m;
  // (-R n) × J_t.
  w.x+=r*nz*jy/inertia;
  w.y+=r*(nx*jt*tz-nz*jt*tx)/inertia;
  w.z-=r*nx*jy/inertia;
  return -vn;
}

/** Geometric roundoff recovery only. Does not alter velocities or generate scoring events. */
export function correctPositions(balls: BallState[],table: TableConfig): void {
  const xLimit=table.width/2-table.ballRadius,zLimit=table.height/2-table.ballRadius,diameter=2*table.ballRadius;
  for(let pass=0;pass<6;pass++){
    let adjusted=false;
    for(let i=0;i<balls.length;i++){
      const p=balls[i].position;
      p.x=Math.max(-xLimit,Math.min(xLimit,p.x));p.z=Math.max(-zLimit,Math.min(zLimit,p.z));
      for(let j=i+1;j<balls.length;j++){
        const q=balls[j].position,dx=q.x-p.x,dz=q.z-p.z,d=Math.hypot(dx,dz);
        if(d<diameter-1e-10){
          const nx=d>EPS?dx/d:1,nz=d>EPS?dz/d:0,shift=(diameter-d+1e-10)*0.5;
          p.x-=nx*shift;p.z-=nz*shift;q.x+=nx*shift;q.z+=nz*shift;adjusted=true;
        }
      }
    }
    if(!adjusted)break;
  }
}
