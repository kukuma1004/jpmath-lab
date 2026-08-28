(function(){
  'use strict';
  const NS='http://www.w3.org/2000/svg';
  function s(tag,attrs={},text=''){const n=document.createElementNS(NS,tag);Object.entries(attrs).forEach(([k,v])=>n.setAttribute(k,v));if(text)n.textContent=text;return n}
  function clear(node){while(node.firstChild)node.removeChild(node.firstChild)}
  function clamp(v,a,b){return Math.max(a,Math.min(b,v))}
  function seeded(seed){let t=seed>>>0;return function(){t+=0x6D2B79F5;let r=Math.imul(t^(t>>>15),1|t);r^=r+Math.imul(r^(r>>>7),61|r);return((r^(r>>>14))>>>0)/4294967296}}
  function shuffle(arr,rng=Math.random){const a=arr.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
  function cartesian(svg,b={xmin:-5,xmax:5,ymin:-4,ymax:4},pad=42){
    const W=640,H=400,plot={x:pad,y:20,w:W-pad-18,h:H-20-pad};
    const sx=x=>plot.x+(x-b.xmin)/(b.xmax-b.xmin)*plot.w, sy=y=>plot.y+plot.h-(y-b.ymin)/(b.ymax-b.ymin)*plot.h;
    const xOf=px=>b.xmin+(px-plot.x)/plot.w*(b.xmax-b.xmin),yOf=py=>b.ymax-(py-plot.y)/plot.h*(b.ymax-b.ymin);
    function grid(){
      const g=s('g',{'aria-hidden':'true'});for(let x=Math.ceil(b.xmin);x<=b.xmax;x++){g.appendChild(s('line',{x1:sx(x),y1:plot.y,x2:sx(x),y2:plot.y+plot.h,stroke:'#DCE5E0','stroke-width':x===0?1.6:1}));if(x!==0)g.appendChild(s('text',{x:sx(x),y:sy(0)+17,'text-anchor':'middle',fill:'#7A8881','font-size':10},String(x)))}for(let y=Math.ceil(b.ymin);y<=b.ymax;y++){g.appendChild(s('line',{x1:plot.x,y1:sy(y),x2:plot.x+plot.w,y2:sy(y),stroke:'#DCE5E0','stroke-width':y===0?1.6:1}));if(y!==0)g.appendChild(s('text',{x:sx(0)-8,y:sy(y)+3,'text-anchor':'end',fill:'#7A8881','font-size':10},String(y)))}svg.appendChild(g)}
    return{W,H,plot,sx,sy,xOf,yOf,grid,b};
  }
  function project3(p,view={yaw:-.65,pitch:.48,scale:105,cx:320,cy:205}){const cy=Math.cos(view.yaw),sy=Math.sin(view.yaw),cp=Math.cos(view.pitch),sp=Math.sin(view.pitch);const x=cy*p[0]+sy*p[2],z=-sy*p[0]+cy*p[2],y=cp*p[1]-sp*z,zz=sp*p[1]+cp*z;return{x:view.cx+x*view.scale,y:view.cy-y*view.scale,z:zz}}
  const sub=(a,b)=>a.map((v,i)=>v-b[i]),dot=(a,b)=>a.reduce((q,v,i)=>q+v*b[i],0),cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
  function tabs(){
    const buttons=[...document.querySelectorAll('.tab-btn')],pages=[...document.querySelectorAll('[data-page]')];
    function show(name,updateHash=false){if(!['theory','lab','game'].includes(name))name='theory';buttons.forEach(b=>b.classList.toggle('active',b.dataset.tab===name));pages.forEach(p=>p.classList.toggle('hidden',p.dataset.page!==name));if(updateHash)history.replaceState(null,'',`#${name}`);window.dispatchEvent(new CustomEvent('geolab:tab',{detail:name}))}
    buttons.forEach(b=>b.addEventListener('click',()=>show(b.dataset.tab,true)));document.querySelectorAll('[data-go-tab]').forEach(b=>b.addEventListener('click',()=>show(b.dataset.goTab,true)));const initial=(location.hash.match(/^#(theory|lab|game)$/)||[])[1]||'theory';show(initial);return{show}
  }
  function renderMath(root=document.body){if(!window.katex||!window.renderMathInElement)return;try{window.renderMathInElement(root,{delimiters:[{left:'\\(',right:'\\)',display:false},{left:'\\[',right:'\\]',display:true}],throwOnError:false})}catch(error){console.warn('[GeoLab] 수식 자동 렌더링을 건너뜁니다.',error)}}
  class Arena{
    constructor(root,config){this.root=root;this.c=config;this.mode='solo';this.seed=0;this.rounds=[];this.session=0;this.results=[];this.timer=0;this.locked=false;this.audio=null;this.lastTick=-1;this.bind();this.show('start');this.renderLeaders()}
    q(sel){return this.root.querySelector(sel)}
    bind(){
      this.root.querySelectorAll('[data-arena-mode]').forEach(b=>b.addEventListener('click',()=>this.start(b.dataset.arenaMode)));
      this.q('[data-arena-next-player]').addEventListener('click',()=>this.startSession(1));
      this.q('[data-arena-replay]').addEventListener('click',()=>this.show('start'));
      this.q('[data-arena-quit]').addEventListener('click',()=>{this.stopTimer();this.show('start')});
      window.addEventListener('geolab:tab',e=>{if(e.detail!=='game'){this.stopTimer();if(this.q('[data-arena-screen="play"]')&&!this.q('[data-arena-screen="play"]').classList.contains('hidden'))this.show('start')}})
    }
    show(name){this.root.querySelectorAll('[data-arena-screen]').forEach(n=>n.classList.toggle('hidden',n.dataset.arenaScreen!==name))}
    start(mode){this.mode=mode;this.seed=Date.now()&0xffffffff;this.rounds=this.c.createRounds(seeded(this.seed));this.results=[];this.session=0;this.sound=this.q('[data-arena-sound]').checked;this.startSession(0)}
    startSession(index){this.session=index;this.state={round:0,score:0,streak:0,lives:3,correct:0};this.show('play');this.beginRound()}
    playerName(index=this.session){const input=this.q(index===0?'[data-player-one]':'[data-player-two]');return(input.value||`PLAYER ${index+1}`).trim().slice(0,12)}
    beginRound(){if(this.state.round>=this.rounds.length||this.state.lives<=0){this.finishSession();return}this.locked=false;this.lastTick=-1;this.updateHud();const round=this.rounds[this.state.round];this.q('[data-arena-question]').textContent=round.question;const svg=this.q('[data-arena-svg]');clear(svg);this.c.draw(svg,round);const grid=this.q('[data-arena-choices]');grid.innerHTML='';round.choices.forEach((label,i)=>{const b=document.createElement('button');b.type='button';b.className='btn choice';b.textContent=label;b.addEventListener('click',()=>this.answer(i));grid.appendChild(b)});this.startTimer()}
    startTimer(){const total=this.c.roundMs||8000,start=performance.now();this.stopTimer();const tick=now=>{const remain=Math.max(0,total-(now-start)),ratio=remain/total;const fill=this.q('[data-arena-timer]');fill.style.width=(ratio*100)+'%';fill.classList.toggle('danger',ratio<.32);const sec=Math.ceil(remain/1000);if(sec<=3&&sec!==this.lastTick){this.lastTick=sec;this.beep('tick')}if(remain<=0){this.answer(-1,true);return}this.timer=requestAnimationFrame(tick)};this.timer=requestAnimationFrame(tick);this.timerStart=start;this.timerTotal=total}
    stopTimer(){cancelAnimationFrame(this.timer)}
    ratio(){return clamp(1-(performance.now()-this.timerStart)/this.timerTotal,0,1)}
    answer(index,timeout=false){if(this.locked)return;this.locked=true;const ratio=this.ratio();this.stopTimer();const round=this.rounds[this.state.round],ok=index===round.correct;const buttons=[...this.root.querySelectorAll('[data-arena-choices] .choice')];buttons.forEach((b,i)=>{b.disabled=true;if(i===round.correct)b.classList.add('correct');else if(i===index)b.classList.add('wrong')});let points=0;if(ok){this.state.streak++;this.state.correct++;const mult=1+Math.min(2,Math.floor(this.state.streak/3)*.5);points=Math.round((100+ratio*100)*mult);this.state.score+=points;this.beep('good')}else{this.state.streak=0;this.state.lives--;this.beep('bad');this.q('[data-arena-screen="play"]').classList.add('shake');setTimeout(()=>this.q('[data-arena-screen="play"]').classList.remove('shake'),500)}this.updateHud();const fb=this.q('[data-arena-feedback]');fb.className='feedback '+(ok?'good':'bad');this.q('[data-feedback-icon]').textContent=ok?'✓':timeout?'⌛':'✕';this.q('[data-feedback-title]').textContent=ok?(this.state.streak>=3?'콤보 폭발!':'정답!'):(timeout?'시간 초과!':'라이프 -1');this.q('[data-feedback-sub]').textContent=round.explanation;this.q('[data-feedback-points]').textContent=ok?`+${points}점`:'+0점';fb.classList.remove('hidden');setTimeout(()=>{fb.classList.add('hidden');this.state.round++;this.beginRound()},850)}
    updateHud(){this.q('[data-hud-player]').textContent=this.playerName();this.q('[data-hud-round]').textContent=`${Math.min(this.state.round+1,this.rounds.length)}/${this.rounds.length}`;this.q('[data-hud-score]').textContent=this.state.score;this.q('[data-hud-combo]').textContent=this.state.streak?`×${(1+Math.min(2,Math.floor(this.state.streak/3)*.5)).toFixed(1)}`:'×1.0';this.q('[data-hud-lives]').textContent='♥'.repeat(this.state.lives)+'♡'.repeat(3-this.state.lives)}
    finishSession(){this.stopTimer();this.results[this.session]={name:this.playerName(),score:this.state.score,correct:this.state.correct};this.saveLeader(this.results[this.session]);if(this.mode==='duel'&&this.session===0){this.q('[data-handoff-name]').textContent=this.playerName(1);this.q('[data-handoff-score]').textContent=`${this.results[0].name}의 기록은 ${this.results[0].score}점. 같은 문제에 도전하세요.`;this.show('handoff')}else this.finishGame()}
    finishGame(){this.show('end');const solo=this.mode==='solo',r0=this.results[0];this.q('[data-solo-result]').classList.toggle('hidden',!solo);this.q('[data-duel-result]').classList.toggle('hidden',solo);if(solo){this.q('[data-final-score]').textContent=r0.score;this.q('[data-final-summary]').textContent=`${r0.correct}/${this.rounds.length} 성공 · 최고 콤보에 다시 도전해보세요.`}else{const a=this.results[0],b=this.results[1];this.q('[data-duel-one-name]').textContent=a.name;this.q('[data-duel-one-score]').textContent=a.score;this.q('[data-duel-two-name]').textContent=b.name;this.q('[data-duel-two-score]').textContent=b.score;const one=this.q('[data-duel-one]'),two=this.q('[data-duel-two]');one.classList.toggle('winner',a.score>b.score);two.classList.toggle('winner',b.score>a.score);this.q('[data-winner-line]').textContent=a.score===b.score?'완벽한 무승부!':`${a.score>b.score?a.name:b.name} 승리!`};this.renderLeaders()}
    key(){return'jp_geo_arena_'+this.c.id}
    loadLeaders(){try{return JSON.parse(localStorage.getItem(this.key()))||[]}catch(e){return[]}}
    saveLeader(r){try{const list=this.loadLeaders();list.push({name:r.name,score:r.score});list.sort((a,b)=>b.score-a.score);localStorage.setItem(this.key(),JSON.stringify(list.slice(0,5)))}catch(e){}}
    renderLeaders(){const box=this.q('[data-leader-list]'),list=this.loadLeaders();box.innerHTML='';if(!list.length){box.innerHTML='<div class="leader-row"><span>—</span><span>첫 기록에 도전하세요</span><b>0</b></div>';return}list.forEach((r,i)=>{const row=document.createElement('div');row.className='leader-row';row.innerHTML=`<span>${i+1}</span><span></span><b>${r.score}</b>`;row.children[1].textContent=r.name;box.appendChild(row)})}
    beep(type){if(!this.sound)return;try{this.audio=this.audio||new(window.AudioContext||window.webkitAudioContext)();const o=this.audio.createOscillator(),g=this.audio.createGain();o.connect(g);g.connect(this.audio.destination);const now=this.audio.currentTime,f=type==='good'?660:type==='bad'?130:360;o.frequency.setValueAtTime(f,now);if(type==='good')o.frequency.exponentialRampToValueAtTime(990,now+.12);g.gain.setValueAtTime(.055,now);g.gain.exponentialRampToValueAtTime(.001,now+.15);o.start(now);o.stop(now+.16);if(type==='bad'&&navigator.vibrate)navigator.vibrate(70)}catch(e){}}
  }
  // ── 입체 그리기 ────────────────────────────────────────────────────────
  // 큰 원 몇 개를 겹쳐 놓으면 구로 보이지 않는다. 구가 구로 보이려면
  //  1) 빛 방향이 있는 음영, 2) 위도·경도 격자, 3) 앞뒤 구분이 함께 있어야 한다.
  // 실험실마다 따로 그리지 않도록 여기에 모아 둔다.
  const solid={
    LATS:[-60,-30,0,30,60],
    LONS:[0,30,60,90,120,150],

    // 극축은 화면 위쪽에 가까운 월드 y축으로 둔다 (지구본과 같은 인상)
    ring(center,r,kind,deg){
      const ang=deg*Math.PI/180,pts=[],N=112;
      for(let n=0;n<=N;n++){
        const t=n/N*Math.PI*2;
        if(kind==='lat'){
          const rr=r*Math.cos(ang),yy=r*Math.sin(ang);
          pts.push([center[0]+rr*Math.cos(t),center[1]+yy,center[2]+rr*Math.sin(t)]);
        }else{
          pts.push([center[0]+r*Math.cos(t)*Math.cos(ang),center[1]+r*Math.sin(t),center[2]+r*Math.cos(t)*Math.sin(ang)]);
        }
      }
      return pts;
    },

    // 시점 깊이로 앞/뒤 구간을 나눈다. project3 의 z는 화면 앞쪽이 큰 값이다.
    split(points,project,refZ){
      const runs=[];let cur=null;
      points.forEach(function(p){
        const q=project(p),front=q.z>=refZ;
        if(!cur||cur.front!==front){
          if(cur)cur.d+='L'+q.x+' '+q.y;     // 경계점을 공유해 구간 사이가 벌어지지 않게 한다
          cur={front:front,d:'M'+q.x+' '+q.y};
          runs.push(cur);
        }else cur.d+='L'+q.x+' '+q.y;
      });
      return runs;
    },

    // 구 몸통용 방사형 그라디언트. 빛은 왼쪽 위에서 온다.
    gradient(id,tint){
      const g=s('radialGradient',{id:id,cx:'.34',cy:'.30',r:'.82'});
      const stops=tint||['#efeaf7','#b9a5da','#6f52a3','#3d2c60'];
      [['0%',stops[0],'.95'],['46%',stops[1],'.55'],['82%',stops[2],'.34'],['100%',stops[3],'.22']]
        .forEach(function(x){g.appendChild(s('stop',{offset:x[0],'stop-color':x[1],'stop-opacity':x[2]}))});
      return g;
    },

    // add(tag,attrs) 로 그리는 실험실이면 그대로 쓸 수 있다.
    // opts: {center,r,color,scale,gradientId,ghost,opacity}
    sphere(add,project,opts){
      const c=opts.center,r=opts.r,color=opts.color;
      if(!(r>0.001))return;
      const q=project(c),R=r*opts.scale;
      if(opts.ghost){
        add('circle',{cx:q.x,cy:q.y,r:R,fill:'none',stroke:color,'stroke-width':2,
          'stroke-dasharray':'8 7',opacity:(opts.opacity||.7),'pointer-events':'none'});
        ['lat','lon'].forEach(function(kind){
          [0,90].forEach(function(deg){
            solid.split(solid.ring(c,r,kind,deg),project,q.z).forEach(function(run){
              add('path',{d:run.d,fill:'none',stroke:color,'stroke-width':1.3,
                opacity:run.front?.5:.2,'stroke-dasharray':'6 6','pointer-events':'none'});
            });
          });
        });
        return;
      }
      if(opts.gradientId)add('circle',{cx:q.x,cy:q.y,r:R,fill:'url(#'+opts.gradientId+')','pointer-events':'none'});
      const rings=[];
      solid.LATS.forEach(function(d){rings.push({pts:solid.ring(c,r,'lat',d),main:d===0})});
      solid.LONS.forEach(function(d){rings.push({pts:solid.ring(c,r,'lon',d),main:false})});
      // 뒤쪽을 먼저, 앞쪽을 나중에 그려 앞뒤가 겹쳐 보이게 한다
      [false,true].forEach(function(wantFront){
        rings.forEach(function(ring){
          solid.split(ring.pts,project,q.z).forEach(function(run){
            if(run.front!==wantFront)return;
            add('path',{d:run.d,fill:'none',stroke:color,
              'stroke-width':run.front?(ring.main?1.9:1.15):.9,
              opacity:run.front?(ring.main?.9:.5):.16,
              'stroke-dasharray':run.front?'':'3 4','pointer-events':'none'});
          });
        });
      });
      add('circle',{cx:q.x,cy:q.y,r:R,fill:'none',stroke:color,'stroke-width':2.2,
        opacity:(opts.opacity||.85),'pointer-events':'none'});
    },

    // 평면은 반투명 사각형만으로는 기울기가 읽히지 않는다.
    // 면 위의 격자와 테두리를 깊이에 따라 진하기를 달리해 기울기를 보여 준다.
    // opts: {p,u,w,size,color,opacity,ghost,grid}
    planePatch(add,project,opts){
      const p=opts.p,u=opts.u,w=opts.w,size=opts.size,color=opts.color;
      const at=function(a,b){return p.map(function(x,i){return x+size*a*u[i]+size*b*w[i]})};
      const cs=[[-1,-1],[1,-1],[1,1],[-1,1]].map(function(c){return at(c[0],c[1])});
      const pj=cs.map(project),cz=project(p).z;
      // 가까울수록 1, 멀수록 0
      const near=function(pt){return Math.max(0,Math.min(1,.5+(project(pt).z-cz)/(size*1.25)))};
      add('polygon',{points:pj.map(function(q){return q.x+','+q.y}).join(' '),
        fill:color,opacity:(opts.opacity||.1),'pointer-events':'none'});
      if(!opts.ghost){
        const N=opts.grid||4;
        for(let k=-N;k<=N;k++){
          const t=k/N;
          [[u,w],[w,u]].forEach(function(pair){
            const a=pair[0],b=pair[1];
            const s0=p.map(function(x,i){return x+t*size*a[i]-size*b[i]}),
                  s1=p.map(function(x,i){return x+t*size*a[i]+size*b[i]});
            const m=s0.map(function(x,i){return (x+s1[i])/2}),f=near(m);
            const q0=project(s0),q1=project(s1);
            add('line',{x1:q0.x,y1:q0.y,x2:q1.x,y2:q1.y,stroke:color,
              'stroke-width':(.55+f*.75).toFixed(2),opacity:(.13+f*.3).toFixed(3),'pointer-events':'none'});
          });
        }
      }
      for(let i=0;i<4;i++){
        const a=cs[i],b=cs[(i+1)%4],m=a.map(function(x,j){return (x+b[j])/2}),f=near(m);
        add('line',{x1:pj[i].x,y1:pj[i].y,x2:pj[(i+1)%4].x,y2:pj[(i+1)%4].y,stroke:color,
          'stroke-width':opts.ghost?2.2:(1+f*1.7).toFixed(2),
          opacity:opts.ghost?.6:(.32+f*.5).toFixed(3),
          'stroke-dasharray':opts.ghost?'8 6':'','pointer-events':'none'});
      }
    }
  };

  window.GeoLab={s,clear,clamp,seeded,shuffle,cartesian,project3,sub,dot,cross,tabs,renderMath,Arena,solid};
})();
