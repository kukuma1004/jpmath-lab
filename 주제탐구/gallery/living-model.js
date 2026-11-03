import * as THREE from 'three';
import {SceneView} from './scenes.js';
import {liveMathFrame,studioWave,sphereSection} from './living-math.js';

const INK='#e3e8cd',FAINT='#b3c6b2',ACCENT=0xdce5b5;
// Keep one renderer and one clock while the reader moves through the seven chapters.
export class LivingModel extends SceneView{
  constructor(host,work,family){
    super(host,work.kind,{motion:false,family,primary:INK});
    this.allowed=false;this.targetPhase=0;this.phaseValue=0;this.metric=document.createElement('p');this.metric.className='living-metric';host.append(this.metric);
    this.draw();
  }
  applyPalette(){
    // Use the original translucent sage material, with highlights supplied by lights rather than glow filters.
    const hsl={};this.scene.traverse(o=>{for(const m of(Array.isArray(o.material)?o.material:o.material?[o.material]:[])){if(!m.color)continue;m.color.getHSL(hsl);if(hsl.s>.08)m.color.setHSL(.29,Math.min(.28,hsl.s),hsl.l)}});
    this.renderer.toneMappingExposure=1.08;this.controls.enabled=false;
    if(this.kind==='line-plane'){
      // The chapter determines the case; avoid the earlier abrupt timed jump between three cases.
      const plane=this.group.children.find(x=>x.isMesh&&x.geometry.type==='PlaneGeometry'),line=this.group.children.find(x=>x.isLine),point=this.group.children.find(x=>x.isMesh&&x.geometry.type==='SphereGeometry');
      this.updates=[t=>{const mode=Math.round(this.phaseValue)>=4?2:Math.round(this.phaseValue)===3?1:0,dy=mode===0?-.7:0,y=mode===2?0:1;this.updateLine(line,[[-2,y-2*dy,-.5],[2,y+2*dy,.5]]);point.position.set(0,y,0);plane.position.y=0;this.setMetric(['교차 · v·n ≠ 0','평행 · v·n = 0, 직선은 평면 밖','포함 · v·n = 0, 직선의 점은 평면 위'][mode]);this.group.rotation.y=-.22+Math.sin(t*.09)*.06}];
    }
  }
  init2D(){super.init2D();if(!this.ctx)throw new Error('Canvas unavailable');}
  setMetric(text){this.pendingMetric=text;if(this.metric&&this.metric.textContent!==text)this.metric.textContent=text}
  sphere(){
    const R=1.65,family=this.options.family,solid=this.mesh(new THREE.SphereGeometry(R,52,36),0x709478,.27);
    const wire=new THREE.LineSegments(new THREE.WireframeGeometry(new THREE.SphereGeometry(R,22,14)),new THREE.LineBasicMaterial({color:0xc3d1b8,transparent:true,opacity:.12}));this.group.add(wire);
    const plane=this.mesh(new THREE.PlaneGeometry(4.5,3.4),0xa3b893,.12);plane.rotation.x=-Math.PI/2;
    const ring=this.mesh(new THREE.TorusGeometry(1,.013,6,100),ACCENT,.96);ring.rotation.x=Math.PI/2;
    const radius=this.line([[0,0,0],[1,1,0]],ACCENT,.75),height=this.line([[0,0,0],[0,1,0]],0xc1d0bb,.5,true),marker=this.mesh(new THREE.SphereGeometry(.038,12,8),ACCENT,1);
    const disks=[];if(family==='volume'){for(let i=0;i<23;i++){const y=-1.54+i*3.08/22,r=sphereSection(R,y),disk=this.mesh(new THREE.CylinderGeometry(r,r,.022,52),0xadc29c,.19);disk.position.y=y;disks.push(disk)}solid.visible=false}
    this.group.rotation.z=-.10;
    this.updates.push(t=>{
      const wave=studioWave(t,.24),phase=this.phaseValue??this.phase;
      if(family==='dimension'){
        const w=R*.91*Math.sin(t*.16),r=sphereSection(R,w);solid.scale.setScalar(r/R);wire.scale.setScalar(r/R);plane.visible=ring.visible=radius.visible=height.visible=marker.visible=false;
        this.setMetric('4차원 구의 3차원 단면 예시 · r² = R² − w² · w = '+w.toFixed(2));
      }else if(family==='sphere-extreme'){
        plane.visible=ring.visible=height.visible=false;const a=t*.19,P=[R*Math.cos(a),R*Math.sin(a),0];this.updateLine(radius,[[0,0,0],P]);marker.position.set(...P);this.setMetric('구 위 동점의 고정축 사영 · '+(R*Math.cos(a)).toFixed(3));
      }else{
        const d=family==='sphere-slice'&&Math.round(phase)===3?R*(.92+.2*wave):R*(.14+.67*wave),r=sphereSection(R,d);
        plane.position.y=d;ring.visible=r!==null;marker.visible=r!==null;radius.visible=r!==null;height.visible=true;
        if(r!==null){ring.position.y=d;ring.scale.set(r,r,1);this.updateLine(radius,[[0,d,0],[r,d,0]]);marker.position.set(r,d,0)}this.updateLine(height,[[0,0,0],[0,d,0]]);
        if(family==='volume'){plane.visible=ring.visible=radius.visible=height.visible=marker.visible=false;const count=1+Math.floor(wave*22);disks.forEach((disk,i)=>{disk.visible=i<count});this.setMetric('구의 단면적 A(x) = π(R²−x²) · 원판 '+count+'개로 읽는 예시')}
        else this.setMetric(r===null?'|d| > R · 구와 평면이 만나지 않습니다.':'r² + d² = R² · d = '+d.toFixed(3)+' / r = '+r.toFixed(3));
      }
      this.group.rotation.y=.13+Math.sin(t*.07)*.13;
    });
  }
  surface(){
    // z = x² + 2y², not the older saddle fallback. Three's vertical axis represents height.
    const f=(x,y)=>.17*(x*x+2*y*y)-.9,geo=new THREE.PlaneGeometry(3.8,3.4,32,28),pos=geo.attributes.position;
    for(let i=0;i<pos.count;i++){const x=pos.getX(i),y=pos.getY(i);pos.setXYZ(i,x,f(x,y),y)}geo.computeVertexNormals();this.mesh(geo,0x809b83,.38);
    const wire=new THREE.LineSegments(new THREE.WireframeGeometry(geo),new THREE.LineBasicMaterial({color:0xc3d1b8,transparent:true,opacity:.16}));this.group.add(wire);
    const plane=this.mesh(new THREE.PlaneGeometry(4.2,3),0xbbcbaa,.10),slice=this.line([[0,0,0],[1,1,0]],ACCENT,.95),tangent=this.line([[0,0,0],[1,1,0]],0xdde6d2,.75),point=this.mesh(new THREE.SphereGeometry(.045,12,8),ACCENT,1);
    this.updates.push(t=>{const y=1.2*Math.sin(t*.17),x=.8*Math.cos(t*.21);plane.position.z=y;this.updateLine(slice,Array.from({length:81},(_,i)=>{const u=-1.9+i*3.8/80;return[u,f(u,y),y]}));this.updateLine(tangent,[[-1.6,f(x,y)+.34*x*(-1.6-x),y],[1.6,f(x,y)+.34*x*(1.6-x),y]]);point.position.set(x,f(x,y),y);this.group.rotation.y=-.22;this.setMetric('z=x²+2y² · y='+y.toFixed(2)+' 고정 · ∂z/∂x=2x='+(2*x).toFixed(3));});
  }
  projection(){
    const lower=this.mesh(new THREE.PlaneGeometry(3.2,2.1),0xb8cc98,.22);lower.rotation.x=-Math.PI/2;lower.position.y=-1;
    const upper=this.mesh(new THREE.PlaneGeometry(3.2,2.1),0x86a879,.43);upper.position.y=.7;
    upper.add(new THREE.LineSegments(new THREE.EdgesGeometry(upper.geometry),new THREE.LineBasicMaterial({color:ACCENT,transparent:true,opacity:.8})));
    const links=Array.from({length:4},()=>this.line([[0,0,0],[0,-1,0]],0xc4d0b9,.35,true));
    this.updates.push(t=>{const p=Math.max(0,Math.min(6,this.phaseValue??0)),i=Math.floor(p),a=[.15,.3,.85,Math.PI/2,Math.PI/3,.65,.45],base=a[i]*(1-p+i)+a[Math.min(6,i+1)]*(p-i),theta=Math.min(Math.PI/2,Math.max(0,base+.1*Math.sin(t*.2)));upper.rotation.x=-Math.PI/2+theta;lower.scale.y=Math.cos(theta);[[-1.6,-1.05],[1.6,-1.05],[1.6,1.05],[-1.6,1.05]].forEach((c,j)=>{const P=[c[0],.7+c[1]*Math.sin(theta),-c[1]*Math.cos(theta)];this.updateLine(links[j],[P,[P[0],-1,P[2]]])});this.group.rotation.y=-.15;this.setMetric('그림자 넓이 / 원래 넓이 = cos θ = '+Math.cos(theta).toFixed(3));});
  }
  distance(){
    const plane=this.mesh(new THREE.PlaneGeometry(4.1,3.3),0x8fa77e,.22);plane.rotation.x=-Math.PI/2;plane.position.y=-.75;
    const P=[.2,1.55,.1],H=[.2,-.75,.1];this.line([P,H],ACCENT,.95,true);const node=this.mesh(new THREE.SphereGeometry(.055,14,10),ACCENT,1);node.position.set(...P);const foot=this.mesh(new THREE.SphereGeometry(.032,12,8),0xc1d0bb,1);foot.position.set(...H);
    const Qnode=this.mesh(new THREE.SphereGeometry(.04,12,8),ACCENT,1),diagonal=this.line([P,[1,-.75,1]],0xc1d0bb,.65),base=this.line([H,[1,-.75,1]],0xc1d0bb,.4);
    this.line([[.2,-.56,.1],[.4,-.56,.1],[.4,-.75,.1]],ACCENT,.5);
    this.updates.push(t=>{const r=(this.phaseValue??0)>=4?.12+.32*studioWave(t,.18):.35+1.05*studioWave(t,.2),Q=[H[0]+r*Math.cos(t*.23),H[1],H[2]+r*Math.sin(t*.23)],length=Math.hypot(2.3,r);Qnode.position.set(...Q);this.updateLine(diagonal,[P,Q]);this.updateLine(base,[H,Q]);this.group.rotation.y=-.25+Math.sin(t*.08)*.08;this.setMetric('수선 PH = 2.300   ≤   사선 PQ = '+length.toFixed(3));});
  }
  vectors(){
    const O=new THREE.Vector3(-1.4,-.6,0);this.group.add(new THREE.ArrowHelper(new THREE.Vector3(1,0,0),O,2.8,0xc1d0bb,.17,.09));
    const v=new THREE.ArrowHelper(new THREE.Vector3(1,1,0).normalize(),O,2.5,ACCENT,.17,.09);this.group.add(v);const drop=this.line([[0,1,0],[0,-.6,0]],0xc1d0bb,.45,true),component=this.line([[-1.4,-.6,0],[0,-.6,0]],ACCENT,.8);
    this.updates.push(t=>{const p=this.phaseValue??0,base=p<2?.45:p<3?Math.PI/2:p<5?2.3:1.5,theta=base+.3*Math.sin(t*.21),x=O.x+2.5*Math.cos(theta),y=O.y+2.5*Math.sin(theta);v.setDirection(new THREE.Vector3(Math.cos(theta),Math.sin(theta),0));this.updateLine(drop,[[x,y,0],[x,O.y,0]]);this.updateLine(component,[O.toArray(),[x,O.y,0]]);this.group.rotation.y=-.2;this.setMetric('θ = '+(theta*180/Math.PI).toFixed(1)+'°   ·   내적 7 cos θ = '+(7*Math.cos(theta)).toFixed(3));});
  }
  cone(){
    const R=1.25,H=2.25,k=R/H;
    for(const sign of[-1,1]){const cone=this.mesh(new THREE.ConeGeometry(R,H,56,1,true),0x839d83,.22);cone.rotation.z=sign>0?Math.PI:0;cone.position.y=sign*H/2;const wire=new THREE.LineSegments(new THREE.WireframeGeometry(new THREE.ConeGeometry(R,H,18,1,true)),new THREE.LineBasicMaterial({color:0xc3d1b8,transparent:true,opacity:.13}));wire.position.copy(cone.position);wire.rotation.copy(cone.rotation);this.group.add(wire)}
    const geo=new THREE.PlaneGeometry(4,4,1,1),plane=this.mesh(geo,0xbbcbaa,.12),curves=Array.from({length:12},()=>this.line([[0,0,0],[0,0,0]],ACCENT,.97));this.camera.position.set(6.8,3.5,7.8);this.controls.update();
    this.updates.push(t=>{const angle=.18+1.04*studioWave(t,.13),m=Math.tan(angle),b=.32,p=plane.geometry.attributes.position;
      for(let i=0;i<p.count;i++){const x=p.getX(i),z=i<2?-2:2;p.setXYZ(i,x,m*x+b,z)}p.needsUpdate=true;geo.computeVertexNormals();const paths=[];
      for(const sign of[1,-1]){let points=[];for(let i=0;i<=320;i++){const q=i/320*Math.PI*2,r=sign*k*b/(1-sign*k*m*Math.cos(q)),x=r*Math.cos(q),z=r*Math.sin(q),y=m*x+b;if(r>=0&&r<=R&&Math.abs(y)<=H)points.push([x,y,z]);else if(points.length){paths.push(points);points=[]}}if(points.length)paths.push(points)}
      curves.forEach((curve,i)=>{curve.visible=!!paths[i]&&paths[i].length>1;if(curve.visible)this.updateLine(curve,paths[i])});this.group.rotation.y=.08+Math.sin(t*.06)*.08;this.setMetric('절단면 y=mx+b · m='+m.toFixed(3)+' · 경계 m=H/R='+ (H/R).toFixed(2));
    });
  }
  // 미적분 계열은 평면 곡선이라 기하의 입체 모형에 비해 밋밋해 보였다(2026-11-03).
  // 같은 2D 캔버스 위에 원근 바닥과 바닥 그림자를 깔아 곡선이 공간 안에 놓이게 한다.
  // 수학적 내용(frame.paths)은 그대로 두고 배경과 그림자만 더한다.
  drawDepth(c,frame){
    const L=45,R=715,T=28,B=393,VX=(L+R)/2,HZ=T+176;
    const grid=c.createLinearGradient(0,HZ,0,B);
    grid.addColorStop(0,'rgba(226,236,205,0)');grid.addColorStop(1,'rgba(226,236,205,.16)');
    c.save();c.lineWidth=.8;c.strokeStyle=grid;
    for(let i=1;i<=7;i++){const t=i/7,y=HZ+(B-HZ)*t*t;c.beginPath();c.moveTo(L,y);c.lineTo(R,y);c.stroke()}
    for(let i=0;i<=10;i++){const x=L+(R-L)*(i/10);c.beginPath();c.moveTo(VX+(x-VX)*.16,HZ);c.lineTo(x,B);c.stroke()}
    c.restore();
    // 곡선을 바닥에 눕힌 그림자. 원본 좌표를 바닥 쪽으로 눌러 옆으로 조금 벌린다.
    c.save();c.strokeStyle='rgba(12,16,10,.30)';c.lineCap='round';c.lineJoin='round';c.filter='blur(2px)';
    for(const path of frame.paths){
      if(path.closed||path.role==='guide'||path.role==='axis')continue;
      c.beginPath();
      path.points.forEach((pt,i)=>{
        const x=pt[0]+(pt[0]-VX)*.05,y=B-(B-pt[1])*.10;
        i?c.lineTo(x,y):c.moveTo(x,y);
      });
      c.lineWidth=path.role==='primary'?3.2:2;c.stroke();
    }
    c.restore();
  }
  drawCanvas(){
    if(!this.ctx)return;const c=this.ctx,W=this.width,H=this.height,scale=Math.min(W/760,H/470),dx=(W-760*scale)/2,dy=(H-470*scale)/2,frame=liveMathFrame(this.options.family,this.time,this.phaseValue??0);
    c.clearRect(0,0,W,H);c.save();c.translate(dx,dy);c.scale(scale,scale);c.beginPath();c.rect(45,28,670,365);c.clip();
    this.drawDepth(c,frame);
    const colors={primary:INK,secondary:'#cfe0c0',axis:'#afc3b148',guide:'#dbe6cf9c',ghost:'#b9c9b470',wash:'#b9cfa127',negative:'#cda98b30'};
    for(const path of frame.paths){c.beginPath();path.points.forEach((p,i)=>i?c.lineTo(...p):c.moveTo(...p));if(path.closed){c.closePath();c.fillStyle=colors[path.role];c.fill()}else{c.strokeStyle=colors[path.role];c.lineWidth=path.role==='primary'?3:path.role==='secondary'?1.7:1;if(path.role==='primary'){c.shadowColor='rgba(227,232,205,.5)';c.shadowBlur=9}else c.shadowBlur=0;c.lineCap='round';c.lineJoin='round';c.setLineDash(path.role==='guide'?[5,7]:[]);c.stroke()}}
    c.shadowBlur=0;c.setLineDash([]);for(const node of frame.dots){const main=node.role==='primary';if(main){c.beginPath();c.arc(...node.point,10,0,Math.PI*2);c.strokeStyle='rgba(227,232,205,.42)';c.lineWidth=1.2;c.stroke()}c.beginPath();c.arc(...node.point,main?5.4:3,0,Math.PI*2);c.fillStyle=colors[node.role];if(main){c.shadowColor='rgba(227,232,205,.65)';c.shadowBlur=12}c.fill();c.shadowBlur=0}
    c.font=Math.max(16,12/Math.max(.1,scale))+'px "IBM Plex Sans KR",sans-serif';c.fillStyle=FAINT;for(const label of frame.labels)c.fillText(label.text,...label.point);c.restore();this.setMetric(frame.metric);this.description=frame.description;
  }
  setPhase(value){this.targetPhase=value;if(this.phaseValue===undefined)this.phaseValue=value;this.draw()}
  setMotion(on){this.allowed=on;super.setMotion(on)}
  start(){
    if(this.raf||this.destroyed||!this.allowed||document.hidden)return;this.last=0;
    const tick=ts=>{if(this.destroyed||!this.enabled||!this.visible||document.hidden){this.raf=0;return}if(!this.last||ts-this.last>=32){const dt=this.last?Math.min((ts-this.last)/1000,.08):0;this.last=ts;this.time+=dt;this.phaseValue+=(this.targetPhase-this.phaseValue)*(1-Math.exp(-dt*4.2));this.phase=this.phaseValue;this.draw()}this.raf=requestAnimationFrame(tick)};this.raf=requestAnimationFrame(tick);
  }
  draw(){super.draw();const label=this.host.querySelector('.scene-live-label');if(label?.textContent)this.setMetric(label.textContent);else if(this.pendingMetric)this.setMetric(this.pendingMetric)}
  dispose(){super.dispose();this.metric=null}
}
