(()=>{var Gn=typeof window<"u",No=Gn?window:null,Xi=Gn?document:null,Me={OBJECT:0,ATTRIBUTE:1,CSS:2,TRANSFORM:3,CSS_VAR:4},re={NUMBER:0,UNIT:1,COLOR:2,COMPLEX:3},qe={NONE:0,AUTO:1,FORCE:2},Be={replace:0,none:1,blend:2},_c=Symbol(),fi=Symbol(),Uo=Symbol(),qi=Symbol(),Lu=Symbol(),ie=1e-11,Nr=1e12,pi=1e3,Ur=240,Wn="",Du="var(",Fr=[],Fo=(()=>{let n=new Map;return n.set("x","translateX"),n.set("y","translateY"),n.set("z","translateZ"),n})(),Bs=["perspective","translateX","translateY","translateZ","rotate","rotateX","rotateY","rotateZ","scale","scaleX","scaleY","scaleZ","skew","skewX","skewY"],Nu=Bs.reduce((n,t)=>({...n,[t]:t+"("}),{}),dn=()=>{},Uu=n=>n,Fu=/\)\s*[-.\d]/,Ou=/(^#([\da-f]{3}){1,2}$)|(^#([\da-f]{4}){1,2}$)/i,Bu=/rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/i,ku=/rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*(-?\d+|-?\d*.\d+)\s*\)/i,zu=/hsl\(\s*(-?\d+|-?\d*.\d+)\s*,\s*(-?\d+|-?\d*.\d+)%\s*,\s*(-?\d+|-?\d*.\d+)%\s*\)/i,Vu=/hsla\(\s*(-?\d+|-?\d*.\d+)\s*,\s*(-?\d+|-?\d*.\d+)%\s*,\s*(-?\d+|-?\d*.\d+)%\s*,\s*(-?\d+|-?\d*.\d+)\s*\)/i,xc=/[-+]?\d*\.?\d+(?:e[-+]?\d)?/gi,Oo=/^([-+]?\d*\.?\d+(?:e[-+]?\d+)?)([a-z]+|%)$/i,Hu=/([a-z])([A-Z])/g,Gu=/(\*=|\+=|-=)/,Wu=/var\(\s*(--[\w-]+)(?:\s*,\s*([^)]+))?\s*\)/;var ks={id:null,keyframes:null,playbackEase:null,playbackRate:1,frameRate:Ur,loop:0,reversed:!1,alternate:!1,autoplay:!0,persist:!1,duration:pi,delay:0,loopDelay:0,ease:"out(2)",composition:Be.replace,modifier:Uu,onBegin:dn,onBeforeUpdate:dn,onUpdate:dn,onLoop:dn,onPause:dn,onComplete:dn,onRender:dn},Or={current:null,root:Xi},de={defaults:ks,precision:4,timeScale:1,tickThreshold:200,editor:null},yc={version:"4.5.0",engine:null};Gn&&(No.AnimeJS||(No.AnimeJS=[]),No.AnimeJS.push(yc));var vc=n=>n.replace(Hu,"$1-$2").toLowerCase(),Pn=(n,t)=>n.indexOf(t)===0,Ei=Date.now,Xn=Array.isArray,ms=n=>n&&n.constructor===Object,vn=n=>typeof n=="number"&&!isNaN(n),Mn=n=>typeof n=="string",fn=n=>typeof n=="function",Vt=n=>typeof n>"u",mi=n=>Vt(n)||n===null,Bo=n=>Gn&&n instanceof SVGElement,Mc=n=>Ou.test(n),bc=n=>Pn(n,"rgb"),Sc=n=>Pn(n,"hsl"),qu=n=>Mc(n)||(bc(n)||Sc(n))&&(n[n.length-1]===")"||!Fu.test(n)),Br=n=>!de.defaults.hasOwnProperty(n),Vp=["opacity","rotate","overflow","color"],Yu=(n,t)=>{if(Vp.includes(t))return!1;if(n.getAttribute(t)||t in n){if(t==="scale"){let e=n.parentNode;return e&&e.tagName==="filter"}return!0}},ko=n=>Mn(n)?parseFloat(n):n,gs=Math.pow,kr=Math.sqrt,Zu=Math.sin,Ju=Math.cos,zr=Math.abs;var _s=Math.floor,$u=Math.asin;var Vr=Math.PI,Xu=Math.round,bn=(n,t,e)=>n<t?t:n>e?e:n,xe=(n,t)=>{if(t<0)return n;if(!t)return Xu(n);let e=10**t;return Xu(n*e)/e};var zs=(n,t,e)=>e===1?t:e===0?n:n+(t-n)*e,xs=n=>n===1/0?Nr:n===-1/0?-Nr:n,wi=n=>n<=ie?ie:xs(xe(n,11)),Ge=n=>Xn(n)?[...n]:n,zo=(n,t)=>{let e={...n};for(let i in t){let s=n[i];e[i]=Vt(s)?t[i]:s}return e},ye=(n,t,e,i="_prev",s="_next")=>{let r=n._head,o=s;for(e&&(r=n._tail,o=i);r;){let a=r[o];t(r),r=a}},Ai=(n,t,e="_prev",i="_next")=>{let s=t[e],r=t[i];s?s[i]=r:n._head=r,r?r[e]=s:n._tail=s,t[e]=null,t[i]=null},Kn=(n,t,e,i="_prev",s="_next")=>{let r=n._tail;for(;r&&e&&e(r,t);)r=r[i];let o=r?r[s]:n._head;r?r[s]=t:n._head=t,o?o[i]=t:n._tail=t,t[i]=r,t[s]=o};var Ku=(n,t,e)=>{let i=n.style.transform;if(i){let s=n[qi],r=0,o=i.length,a;for(;r<o;){for(;r<o&&i.charCodeAt(r)===32;)r++;if(r>=o)break;let c=r;for(;r<o&&i.charCodeAt(r)!==40;)r++;if(r>=o)break;let h=i.substring(c,r),d=1,u=r+1,f=-1,p=-1;for(r++;r<o&&d>0;){let g=i.charCodeAt(r);g===40?d++:g===41?d--:g===44&&d===1&&(f===-1?f=r:p===-1&&(p=r)),r++}let x=r-1;h==="translate"||h==="translate3d"?(f===-1?s.translateX=i.substring(u,x).trim():(s.translateX=i.substring(u,f).trim(),p===-1?s.translateY=i.substring(f+1,x).trim():(s.translateY=i.substring(f+1,p).trim(),s.translateZ=i.substring(p+1,x).trim())),a=i.substring(u,x)):h==="scale"||h==="scale3d"?f===-1?s.scale=i.substring(u,x).trim():(s.scaleX=i.substring(u,f).trim(),p===-1?s.scaleY=i.substring(f+1,x).trim():(s.scaleY=i.substring(f+1,p).trim(),s.scaleZ=i.substring(p+1,x).trim())):s[h]=i.substring(u,x)}if(t==="translate3d"&&a)return e&&(e[t]=a),a;let l=s[t];if(!Vt(l))return e&&(e[t]=l),l}return t==="translate3d"?"0px, 0px, 0px":t==="rotate3d"?"0, 0, 0, 0deg":Pn(t,"scale")?"1":Pn(t,"rotate")||Pn(t,"skew")?"0deg":"0px"},Vo=n=>{let t=Wn;for(let e=0,i=Bs.length;e<i;e++){let s=Bs[e],r=n[s];if(r!==void 0){if(s==="translateX"){let o=n.translateY;if(o!==void 0){let a=n.translateZ;a!==void 0?(t+=`translate3d(${r},${o},${a}) `,e+=2):(t+=`translate(${r},${o}) `,e+=1);continue}}if(s==="scaleX"&&n.scale===void 0){let o=n.scaleY;if(o!==void 0){let a=n.scaleZ;a!==void 0?(t+=`scale3d(${r},${o},${a}) `,e+=2):(t+=`scale(${r},${o}) `,e+=1);continue}}t+=`${Nu[s]}${r}) `}s==="rotateZ"&&n.rotate3d!==void 0&&(t+=`rotate3d(${n.rotate3d}) `)}return n.matrix!==void 0&&(t+=`matrix(${n.matrix}) `),n.matrix3d!==void 0&&(t+=`matrix3d(${n.matrix3d}) `),t};var Tc=[];function Ho(n,t){if(!n)return null;let e=Tc.length;t:for(let i=0;i<e;i++){let s=Tc[i];if(s.detect&&!s.detect(n))continue;let r=s.targetAdapters;for(let o=0,a=r.length;o<a;o++){let l=r[o];if(l.detect(n)){let c=l.props[t];if(c&&(!c.gate||c.gate(n)))return c;break t}}}for(let i=0;i<e;i++){let s=Tc[i];if(s.detect&&!s.detect(n))continue;let r=s.propertyResolvers;for(let o=0,a=r.length;o<a;o++){let l=r[o](n,t);if(l)return l}}return null}var Hp=n=>{let t=Bu.exec(n)||ku.exec(n),e=Vt(t[4])?1:+t[4];return[+t[1],+t[2],+t[3],e]},Gp=n=>{let t=n.length,e=t===4||t===5;return[+("0x"+n[1]+n[e?1:2]),+("0x"+n[e?2:3]+n[e?2:4]),+("0x"+n[e?3:5]+n[e?3:6]),t===5||t===9?+(+("0x"+n[e?4:7]+n[e?4:8])/255).toFixed(3):1]},Ec=(n,t,e)=>(e<0&&(e+=1),e>1&&(e-=1),e<1/6?n+(t-n)*6*e:e<1/2?t:e<2/3?n+(t-n)*(2/3-e)*6:n),Wp=n=>{let t=zu.exec(n)||Vu.exec(n),e=+t[1]/360,i=+t[2]/100,s=+t[3]/100,r=Vt(t[4])?1:+t[4],o,a,l;if(i===0)o=a=l=s;else{let c=s<.5?s*(1+i):s+i-s*i,h=2*s-c;o=xe(Ec(h,c,e+1/3)*255,0),a=xe(Ec(h,c,e)*255,0),l=xe(Ec(h,c,e-1/3)*255,0)}return[o,a,l,r]},ju=n=>bc(n)?Hp(n):Mc(n)?Gp(n):Sc(n)?Wp(n):[0,0,0,1];var ke=(n,t)=>Vt(n)?t:n,Qu=(n,t)=>{let e=n.match(Wu),i=t[fi]?t:document.documentElement,s=getComputedStyle(i)?.getPropertyValue(e[1]);return(!s||s.trim()===Wn)&&e[2]&&(s=e[2].trim()),s||0},gi=(n,t,e,i,s,r)=>{if(fn(n)){if(!s){let a=n(t,e,i,r);return isNaN(+a)?a||0:+a}let o=()=>{let a=n(t,e,i,r);return isNaN(+a)?a||0:+a};return s.func=o,o()}if(Mn(n)&&Pn(n,Du)){if(!s)return Qu(n,t);let o=()=>Qu(n,t);return s.func=o,o()}return n},wc=(n,t)=>n[fi]?n[Uo]&&Yu(n,t)?Me.ATTRIBUTE:Bs.includes(t)||Fo.get(t)?Me.TRANSFORM:Pn(t,"--")?Me.CSS_VAR:t in n.style?Me.CSS:t in n?Me.OBJECT:Me.ATTRIBUTE:Me.OBJECT,td=(n,t,e)=>{let i=n.style[t];i&&e&&(e[t]=i);let s=i||getComputedStyle(n[Lu]||n).getPropertyValue(t);return s==="auto"?"0":s},Yi=(n,t,e,i)=>{let s=Vt(e)?wc(n,t):e,r=Ho(n,t);if(r){let o=r.get(n);return o&&i&&(i[t]=o),o??0}if(s===Me.OBJECT){let o=n[t];return o&&i&&(i[t]=o),o||0}if(s===Me.ATTRIBUTE){let o=n.getAttribute(t);return o&&i&&(i[t]=o),o}return s===Me.TRANSFORM?Ku(n,t,i):s===Me.CSS_VAR?td(n,t,i).trimStart():td(n,t,i)},Vs=(n,t,e)=>e==="-"?n-t:e==="+"?n+t:n*t,Go=()=>({t:re.NUMBER,n:0,u:null,o:null,d:null,s:null}),Sn=(n,t)=>{if(t.t=re.NUMBER,t.n=0,t.u=null,t.o=null,t.d=null,t.s=null,!n)return t;let e=+n;if(!isNaN(e))return t.n=e,t;let i=n;i[1]==="="&&(t.o=i[0],i=i.slice(2));let s=i.includes(" ")?!1:Oo.exec(i);if(s)return t.t=re.UNIT,t.n=+s[1],t.u=s[2],t;if(t.o)return t.n=+i,t;if(qu(i))return t.t=re.COLOR,t.d=ju(i),t;{let r=i.match(xc);return t.t=re.COMPLEX,t.d=r?r.map(Number):[],t.s=i.split(xc)||[],t}},Ac=(n,t)=>(t.t=n._valueType,t.n=n._toNumber,t.u=n._unit,t.o=null,t.d=Ge(n._toNumbers),t.s=Ge(n._strings),t),In=Go(),Wo=(n,t,e)=>{let i=n._modifier,s=n._fromNumbers,r=n._toNumbers,o=n._strings,a=o[0];for(let l=0,c=r.length;l<c;l++){let h=i(xe(zs(s[l],r[l],t),e)),d=o[l+1];a+=`${d?h+d:h}`,n._numbers[l]=h}return a};var Hr=(n,t,e,i,s)=>{let r=n.parent,o=n.duration,a=n.completed,l=n.iterationDuration,c=n.iterationCount,h=n._currentIteration,d=n._loopDelay,u=n._reversed,f=n._alternate,p=n._hasChildren,x=n._delay,g=n._currentTime,m=x+l,E=t-x,C=bn(g,-x,o),M=bn(E,-x,o),w=E-g,v=M>0,S=M>=o,_=o<=ie,T=s===qe.FORCE,R=0,P=E,D=0;if(c>1){let J=l+(S?0:d),et=~~(M/J);n._currentIteration=bn(et,0,c),S&&n._currentIteration--,R=n._currentIteration%2,P=M-et*J||0}let k=u^(f&&R),L=n._ease,z=S?k?0:o:k?l-P:P;L&&(z=l*L(z/l)||0);let W=(r?r.backwards:E<g)?!k:!!k;if(n._currentTime=E,n._iterationTime=z,n.backwards=W,v&&!n.began?(n.began=!0,!e&&!(r&&(W||!r.began))&&n.onBegin(n)):E<=0&&(n.began=!1),!e&&!p&&v&&n._currentIteration!==h&&n.onLoop(n),T||s===qe.AUTO&&(t>=(r&&x>0?0:x)&&t<=m||t<=x&&C>x||t>=m&&C!==o)||z>=m&&C!==o||z<=x&&C>0&&!S||t<=C&&C===o&&a||S&&!a&&_){if(v&&(n.computeDeltaTime(C),e||n.onBeforeUpdate(n)),!p){let J=T||(W?w*-1:w)>=de.tickThreshold,et=xe(n._offset+(r?r._offset:0)+x+z,12),O=n._head,q,j,yt,Tt,pe=0;for(;O;){let qt=O._composition,Et=O._currentTime,Y=O._changeDuration,K=O._absoluteStartTime+O._changeDuration,it=O._nextRep,Ct=O._prevRep,ot=qt!==Be.none,ut=Ct?Ct._absoluteStartTime+Ct._changeDuration:0,Yt=Ct&&Ct.parent!==O.parent,Bt=!it||it._isOverridden?K:it.parent===O.parent?K+it._delay:it._absoluteStartTime<it._absoluteUpdateStartTime?it._absoluteStartTime:it._absoluteUpdateStartTime;if((J||(Et!==Y||et<=Bt||Ct&&!Yt&&(!it||it.parent!==O.parent))&&(Et!==0||et>=O._absoluteStartTime||Yt&&!O._hasFromValue&&!Ct._isOverridden&&et>=ut||it&&!it._isOverridden&&it.parent===O.parent&&it._currentTime!==0&&z<it._startTime))&&(!Ct||Yt||z>=O._startTime)&&(!ot||!O._isOverridden&&(!O._isOverlapped||et<=K)&&(!it||it._isOverridden||et<=Bt)&&(!Ct||Ct._isOverridden||(Yt?et>=O._absoluteStartTime||!O._hasFromValue&&et>=ut:et>=ut+O._delay)))){let Wt=O._currentTime=bn(z-O._startTime,0,Y),kt=O._ease(Wt/O._updateDuration),Dt=O._modifier,te=O._valueType,ue=O._tweenType,Se=ue===Me.OBJECT,jt=te===re.NUMBER,le=jt&&Se||kt===0||kt===1?-1:de.precision,I,ne;if(jt)I=ne=Dt(xe(zs(O._fromNumber,O._toNumber,kt),le));else if(te===re.UNIT)ne=Dt(xe(zs(O._fromNumber,O._toNumber,kt),le)),I=`${ne}${O._unit}`;else if(te===re.COLOR){let Pt=O._numbers,A=O._fromNumbers,y=O._toNumbers,B=1-kt,V=A[0],Z=A[1],st=A[2],rt=y[0],$=y[1],Q=y[2];Pt[0]=Dt(Math.sqrt(V*V*B+rt*rt*kt)),Pt[1]=Dt(Math.sqrt(Z*Z*B+$*$*kt)),Pt[2]=Dt(Math.sqrt(st*st*B+Q*Q*kt)),Pt[3]=Dt(zs(A[3],y[3],kt)),(!O._setter||i)&&(I=`rgba(${xe(Pt[0],0)},${xe(Pt[1],0)},${xe(Pt[2],0)},${Pt[3]})`)}else te===re.COMPLEX&&(I=Wo(O,kt,le));if(ot&&(O._number=ne),!i&&qt!==Be.blend){let Pt=O.property;q=O.target,O._setter?O._setter(q,ne,O):Se?q[Pt]=I:ue===Me.ATTRIBUTE?q.setAttribute(Pt,I):(j=q.style,ue===Me.TRANSFORM?(q!==yt&&(yt=q,Tt=q[qi]),Tt[Pt]=I,pe=1):ue===Me.CSS?j[Pt]=I:ue===Me.CSS_VAR&&j.setProperty(Pt,I)),v&&(D=1)}else O._value=I}else Et&&Ct&&!Yt&&z<O._startTime&&(O._currentTime=0);pe&&O._renderTransforms&&(j.transform=Vo(Tt),pe=0),O=O._next}!e&&D&&n.onRender(n)}!e&&v&&n.onUpdate(n)}return r&&_?!e&&(r.began&&!W&&E>0&&!a||W&&E<=ie&&a)&&(n.onComplete(n),n.completed=!W):v&&S?c===1/0?n._startTime+=n.duration:n._currentIteration>=c-1&&(n.paused=!0,!a&&!p&&(n.completed=!0,!e&&!(r&&(W||!r.began))&&(n.onComplete(n),n._resolve(n)))):n.completed=!1,D},_i=(n,t,e,i,s)=>{let r=n._currentIteration;if(Hr(n,t,e,i,s),n._hasChildren){let o=n,a=o.backwards,l=i?t:o._iterationTime,c=Ei(),h=0,d=!0;if(!i&&o._currentIteration!==r){let u=o.iterationDuration;ye(o,f=>{if(!a)!f.completed&&!f.backwards&&f._currentTime<f.iterationDuration&&Hr(f,u,e,1,qe.FORCE),f.began=!1,f.completed=!1;else{let p=f.duration,x=f._offset+f._delay,g=x+p;!e&&p<=ie&&(!x||g===u)&&f.onComplete(f)}}),e||o.onLoop(o)}ye(o,u=>{let f=xe((l-u._offset)*u._speed,12);if(a&&f>u._delay+u.duration)return;let p=u._fps<o._fps?u.requestTick(c):s;h+=Hr(u,f,e,i,p),!u.completed&&d&&(d=!1)},a),!e&&h&&o.onRender(o),(d||a)&&o._currentTime>=o.duration&&(o.paused=!0,o.completed||(o.completed=!0,e||(o.onComplete(o),o._resolve(o))))}};var ed={},Xo=(n,t,e)=>{if(e===Me.TRANSFORM){let i=Fo.get(n);return i||n}else if(e===Me.CSS||e===Me.ATTRIBUTE&&Bo(t)&&n in t.style){let i=ed[n];if(i)return i;{let s=n&&vc(n);return ed[n]=s,s}}else return n},Gr=(n,t=!1)=>{if(n._hasChildren)ye(n,e=>Gr(e,t),!0);else{let e=n;e.pause(),ye(e,i=>{let s=i.property,r=i.target,o=i._tweenType,a=i._inlineValue,l=mi(a)||a===Wn;if(i._setter){if(!t&&!l){if(Sn(a,In),In.d){let c=In.d,h=i._numbers;for(let d=0,u=c.length;d<u;d++)h[d]=c[d]}else i._number=In.n;i._setter(i.target,i._number,i)}}else if(o===Me.OBJECT)!t&&!l&&(r[s]=a);else if(r[fi])if(o===Me.ATTRIBUTE)t||(l?r.removeAttribute(s):r.setAttribute(s,a));else{let c=r.style;if(o===Me.TRANSFORM){let h=r[qi];l?delete h[s]:h[s]=a,i._renderTransforms&&(Object.keys(h).length?c.transform=Vo(h):c.removeProperty("transform"))}else l?c.removeProperty(vc(s)):c[s]=a}r[fi]&&e._tail===i&&e.targets.forEach(c=>{c.getAttribute&&c.getAttribute("style")===Wn&&c.removeAttribute("style")})})}return n};var Hs=class{constructor(t=0){this.deltaTime=0,this._currentTime=t,this._lastTickTime=t,this._startTime=t,this._lastTime=t,this._frameDuration=pi/Ur,this._fps=Ur,this._speed=1,this._hasChildren=!1,this._head=null,this._tail=null}get fps(){return this._fps}set fps(t){let e=+t,i=e<ie?ie:e,s=pi/i;i>ks.frameRate&&(ks.frameRate=i),this._fps=i,this._frameDuration=s}get speed(){return this._speed}set speed(t){let e=+t;this._speed=e<ie?ie:e}requestTick(t){let e=this._frameDuration,i=t-this._lastTickTime,s=e*.25,r=s<4?s:4;return i+r<e?qe.NONE:(this._lastTickTime=i>=e?t-i%e:t,qe.AUTO)}computeDeltaTime(t){let e=t-this._lastTime;return this.deltaTime=e,this._lastTime=t,e}};var Ri={animation:null,update:dn},nd=n=>{let t=Ri.animation;return t||(t={duration:ie,computeDeltaTime:dn,_offset:0,_delay:0,_head:null,_tail:null},Ri.animation=t,Ri.update=()=>{n.forEach(e=>{for(let i in e){let s=e[i],r=s._head;if(r){let o=r._valueType,a=o===re.COMPLEX||o===re.COLOR?Ge(r._fromNumbers):null,l=r._fromNumber,c=s._tail;for(;c&&c!==r;){if(a)for(let h=0,d=c._numbers.length;h<d;h++)a[h]+=c._numbers[h];else l+=c._number;c=c._prevAdd}r._toNumber=l,r._toNumbers=a}}}),Hr(t,1,1,0,qe.FORCE)}),t};var id=Gn?requestAnimationFrame:setImmediate,Xp=Gn?cancelAnimationFrame:clearImmediate,Rc=class extends Hs{constructor(t){super(t),this.useDefaultMainLoop=!0,this.pauseOnDocumentHidden=!0,this.defaults=ks,this.paused=!0,this.reqId=0}update(){let t=this._currentTime=Ei();if(this.requestTick(t)){this.computeDeltaTime(t);let e=this._speed,i=this._fps,s=this._head;for(;s;){let r=s._next;s.paused?(Ai(this,s),this._hasChildren=!!this._tail,s._running=!1,s.completed&&!s._cancelled&&s.cancel()):_i(s,(t-s._startTime)*s._speed*e,0,0,s._fps<i?s.requestTick(t):qe.AUTO),s=r}Ri.update()}}wake(){return this.useDefaultMainLoop&&!this.reqId&&(this.requestTick(Ei()),this.reqId=id(sd)),this}pause(){if(this.reqId)return this.paused=!0,qp()}resume(){if(this.paused)return this.paused=!1,ye(this,t=>t.resetTime()),this.wake()}get speed(){return this._speed*(de.timeScale===1?1:pi)}set speed(t){let e=t*de.timeScale;this._speed!==e&&(this._speed=e,ye(this,i=>i.speed=i._speed))}get timeUnit(){return de.timeScale===1?"ms":"s"}set timeUnit(t){let i=t==="s",s=i?.001:1;if(de.timeScale!==s){de.timeScale=s,de.tickThreshold=200*s;let r=i?.001:pi;this.defaults.duration*=r,this._speed*=r}}get precision(){return de.precision}set precision(t){de.precision=t}},Ye=(()=>{let n=new Rc(Ei());return Gn&&(yc.engine=n,Xi.addEventListener("visibilitychange",()=>{n.pauseOnDocumentHidden&&(Xi.hidden?n.pause():n.resume())})),n})(),sd=()=>{Ye._head?(Ye.reqId=id(sd),Ye.update()):Ye.reqId=0},qp=()=>(Xp(Ye.reqId),Ye.reqId=0,Ye);var qo={_rep:new WeakMap,_add:new Map},Xr=(n,t,e="_rep")=>{let i=qo[e],s=i.get(n);return s||(s={},i.set(n,s)),s[t]?s[t]:s[t]={_head:null,_tail:null}},Yp=(n,t)=>n._isOverridden||n._absoluteStartTime>t._absoluteStartTime,Wr=n=>{n._isOverlapped=1,n._isOverridden=1,n._changeDuration=ie,n._currentTime=ie},Yo=(n,t)=>{let e=n._composition;if(e===Be.replace){let i=n._absoluteStartTime;Kn(t,n,Yp,"_prevRep","_nextRep");let s=n._prevRep;if(s){let r=s.parent,o=s._absoluteEndTime;if(n.parent.id!==r.id&&r.iterationCount>1&&o+(r.duration-r.iterationDuration)>i){Wr(s);let c=s._prevRep;for(;c&&c.parent.id===r.id;)Wr(c),c=c._prevRep}let a=n._absoluteUpdateStartTime;if(o>a){let c=s._startTime,h=o-(c+s._updateDuration),d=xe(a-h-c,12);s._changeDuration=d,s._currentTime=d,s._isOverlapped=1,d<ie&&Wr(s)}let l=n.parent.parent;if(!l||l!==r.parent){let c=!0;if(ye(r,h=>{h._isOverlapped||(c=!1)}),c){let h=r.parent;if(h){let d=!0;ye(h,u=>{u!==r&&ye(u,f=>{f._isOverlapped||(d=!1)})}),d&&h.cancel()}else r.cancel()}}}}else if(e===Be.blend){let i=Xr(n.target,n.property,"_add"),s=nd(qo._add),r=i._head;r||(r={...n},r._composition=Be.replace,r._updateDuration=ie,r._startTime=0,r._numbers=Ge(n._fromNumbers),r._number=0,r._next=null,r._prev=null,Kn(i,r),Kn(s,r));let o=n._toNumber;if(n._fromNumber=r._fromNumber-o,n._toNumber=0,n._numbers=Ge(n._fromNumbers),n._number=0,r._fromNumber=o,n._toNumbers.length){let a=Ge(n._toNumbers);a.forEach((l,c)=>{n._fromNumbers[c]=r._fromNumbers[c]-l,n._toNumbers[c]=0}),r._fromNumbers=a}Kn(i,n,null,"_prevAdd","_nextAdd")}return n},Cc=n=>{let t=n._composition;if(t!==Be.none){let e=n.target,i=n.property,o=qo._rep.get(e)[i];if(Ai(o,n,"_prevRep","_nextRep"),t===Be.blend){let a=qo._add,l=a.get(e);if(!l)return;let c=l[i],h=Ri.animation;Ai(c,n,"_prevAdd","_nextAdd");let d=c._head;if(d&&d===c._tail){Ai(c,d,"_prevAdd","_nextAdd"),Ai(h,d);let u=!0;for(let f in l)if(l[f]._head){u=!1;break}u&&a.delete(e)}}}return n},rd=(n,t,e)=>{let i=!1;return ye(t,s=>{let r=s.target;if(n.includes(r)){let o=s.property,a=s._tweenType,l=Xo(e,r,a);(!l||l&&l===o)&&(s.parent._tail===s&&s._tweenType===Me.TRANSFORM&&s._prev&&s._prev._tweenType===Me.TRANSFORM&&(s._prev._renderTransforms=1),Ai(t,s),Cc(s),i=!0)}},!0),i},Pc=(n,t,e)=>{let i=t||Ye,s;if(i._hasChildren){let r=0;ye(i,o=>{if(!o._hasChildren)if(s=rd(n,o,e),s&&!o._head)o.cancel(),Ai(i,o);else{let l=o._offset+o._delay+o.duration;l>r&&(r=l)}o._head?Pc(n,o,e):o._hasChildren=!1},!0),Vt(i.iterationDuration)||(i.iterationDuration=r)}else s=rd(n,i,e);s&&!i._head&&(i._hasChildren=!1,i.cancel&&i.cancel())};var od=n=>(n.paused=!0,n.began=!1,n.completed=!1,n),Ic=n=>(n._cancelled&&(n._hasChildren?ye(n,Ic):ye(n,t=>{t._composition!==Be.none&&Yo(t,Xr(t.target,t.property))}),n._cancelled=0),n),ad=0,Zp=(n,t)=>n._priority>t._priority,ys=class extends Hs{constructor(t={},e=null,i=0){super(0),++ad;let{id:s,delay:r,duration:o,reversed:a,alternate:l,loop:c,loopDelay:h,autoplay:d,frameRate:u,playbackRate:f,priority:p,onComplete:x,onLoop:g,onPause:m,onBegin:E,onBeforeUpdate:C,onUpdate:M}=t;Or.current&&Or.current.register(this);let w=e?0:Ye._lastTickTime,v=e?e.defaults:de.defaults,S=fn(r)||Vt(r)?v.delay:+r,_=fn(o)||Vt(o)?1/0:+o,T=ke(c,v.loop),R=ke(h,v.loopDelay),P=T===!0||T===1/0||T<0?1/0:T+1,D=0;e?D=i:(Ye.reqId||Ye.requestTick(Ei()),D=(Ye._lastTickTime-Ye._startTime)*de.timeScale),this.id=Vt(s)?ad:s,this.parent=e,this.duration=xs((_+R)*P-R)||ie,this.backwards=!1,this.paused=!0,this.began=!1,this.completed=!1,this.onBegin=E||v.onBegin,this.onBeforeUpdate=C||v.onBeforeUpdate,this.onUpdate=M||v.onUpdate,this.onLoop=g||v.onLoop,this.onPause=m||v.onPause,this.onComplete=x||v.onComplete,this.iterationDuration=_,this.iterationCount=P,this._autoplay=e?!1:ke(d,v.autoplay),this._offset=D,this._delay=S,this._loopDelay=R,this._iterationTime=0,this._currentIteration=0,this._resolve=dn,this._running=!1,this._reversed=+ke(a,v.reversed),this._reverse=this._reversed,this._cancelled=0,this._alternate=ke(l,v.alternate),this._prev=null,this._next=null,this._lastTickTime=w,this._startTime=w,this._lastTime=w,this._fps=ke(u,v.frameRate),this._speed=ke(f,v.playbackRate),this._priority=+ke(p,1)}get cancelled(){return!!this._cancelled}set cancelled(t){t?this.cancel():this.reset(!0).play()}get currentTime(){return bn(xe(this._currentTime,de.precision),-this._delay,this.duration)}set currentTime(t){let e=this.paused;this.pause().seek(+t),e||this.resume()}get iterationCurrentTime(){return bn(xe(this._iterationTime,de.precision),0,this.iterationDuration)}set iterationCurrentTime(t){this.currentTime=this.iterationDuration*this._currentIteration+t}get progress(){return bn(xe(this._currentTime/this.duration,10),0,1)}set progress(t){this.currentTime=this.duration*t}get iterationProgress(){return bn(xe(this._iterationTime/this.iterationDuration,10),0,1)}set iterationProgress(t){let e=this.iterationDuration;this.currentTime=e*this._currentIteration+e*t}get currentIteration(){return this._currentIteration}set currentIteration(t){this.currentTime=this.iterationDuration*bn(+t,0,this.iterationCount-1)}get reversed(){return!!this._reversed}set reversed(t){t?this.reverse():this.play()}get speed(){return super.speed}set speed(t){super.speed=t,this.resetTime()}reset(t=!1){return Ic(this),this._reversed&&!this._reverse&&(this.reversed=!1),this._iterationTime=this.iterationDuration,_i(this,0,1,~~t,qe.FORCE),od(this),this._hasChildren&&ye(this,od),this}init(t=!1){this.fps=this._fps,this.speed=this._speed,!t&&this._hasChildren&&_i(this,this.duration,1,~~t,qe.FORCE),this.reset(t);let e=this._autoplay;return e===!0?this.resume():e&&!Vt(e.linked)&&e.link(this),this}resetTime(){let t=1/(this._speed*Ye._speed);return this._startTime=Ei()-(this._currentTime+this._delay)*t,this}pause(){return this.paused?this:(this.paused=!0,this.onPause(this),this)}resume(){return this.paused?(this.paused=!1,this.duration<=ie&&!this._hasChildren?_i(this,ie,0,0,qe.FORCE):(this._running||(Kn(Ye,this,Zp),Ye._hasChildren=!0,this._running=!0),this.resetTime(),this._startTime-=12,Ye.wake()),this):this}restart(){return this.reset().resume()}seek(t,e=0,i=0){Ic(this),this.completed=!1;let s=this.paused;return this.paused=!0,_i(this,t+this._delay,~~e,~~i,qe.AUTO),s?this:this.resume()}alternate(){let t=this._reversed,e=this.iterationCount,i=this.iterationDuration,s=e===1/0?_s(Nr/i):e;return this._reversed=+(this._alternate&&!(s%2)?t:!t),e===1/0?this.iterationProgress=this._reversed?1-this.iterationProgress:this.iterationProgress:this.seek(i*s-this._currentTime),this.resetTime(),this}play(){return this._reversed&&this.alternate(),this.resume()}reverse(){return this._reversed||this.alternate(),this.resume()}cancel(){return this._hasChildren?ye(this,t=>t.cancel(),!0):ye(this,Cc),this._cancelled=1,this.pause()}stretch(t){let e=this.duration,i=wi(t);if(e===i)return this;let s=t/e,r=t<=ie;return this.duration=r?ie:i,this.iterationDuration=r?ie:wi(this.iterationDuration*s),this._offset*=s,this._delay*=s,this._loopDelay*=s,this}revert(){_i(this,0,1,0,qe.AUTO);let t=this._autoplay;return t&&t.linked&&t.linked===this&&t.revert(),this.cancel()}complete(t=0){return this.seek(this.duration,t).cancel()}then(t=dn){let e=this.then,i=()=>{this.then=null,t(this),this.then=e,this._resolve=dn};return new Promise(s=>(this._resolve=()=>s(i()),this.completed&&this._resolve(),this))}};function ld(n){let t=Mn(n)?Or.root.querySelectorAll(n):n;if(t instanceof NodeList||t instanceof HTMLCollection)return t}function Zo(n){if(mi(n))return[];if(!Gn)return Xn(n)&&n.flat(1/0)||[n];if(Xn(n)){let e=n.flat(1/0),i=[];for(let s=0,r=e.length;s<r;s++){let o=e[s];if(!mi(o)){let a=ld(o);if(a)for(let l=0,c=a.length;l<c;l++){let h=a[l];if(!mi(h)){let d=!1;for(let u=0,f=i.length;u<f;u++)if(i[u]===h){d=!0;break}d||i.push(h)}}else{let l=!1;for(let c=0,h=i.length;c<h;c++)if(i[c]===o){l=!0;break}l||i.push(o)}}}return i}let t=ld(n);return t?Array.from(t):[n]}function Jo(n){let t=Zo(n),e=t.length;for(let i=0;i<e;i++){let s=t[i];if(!s[_c]){s[_c]=!0;let r=Bo(s);(s.nodeType||r)&&(s[fi]=!0,s[Uo]=r,s[qi]={})}}return t}var Lc={deg:1,rad:180/Vr,turn:360},cd={},Dc=(n,t,e,i=!1)=>{let s=t.u,r=t.n;if(t.t===re.UNIT&&s===e)return t;let o=r+s+e,a=cd[o];if(!Vt(a)&&!i)t.n=a;else{let l;if(s in Lc)l=r*Lc[s]/Lc[e];else{let h=n.cloneNode(),d=n.parentNode,u=d&&d!==Xi?d:Xi.body;u.appendChild(h);let f=h.style;f.width=100+s;let p=h.offsetWidth||100;f.width=100+e;let x=h.offsetWidth||100,g=p/x;u.removeChild(h),l=g*r}t.n=l,cd[o]=l}return t.t,re.UNIT,t.u=e,t};var Ci=n=>n;var qr=(n=1.68)=>t=>gs(t,+n),Uc={in:n=>t=>n(t),out:n=>t=>1-n(1-t),inOut:n=>t=>t<.5?n(t*2)/2:1-n(t*-2+2)/2,outIn:n=>t=>t<.5?(1-n(1-t*2))/2:(n(t*2-1)+1)/2},Jp=Vr/2,hd=Vr*2,ud={[Wn]:qr,Quad:qr(2),Cubic:qr(3),Quart:qr(4),Quint:qr(5),Sine:n=>1-Ju(n*Jp),Circ:n=>1-kr(1-n*n),Expo:n=>n?gs(2,10*n-10):0,Bounce:n=>{let t,e=4;for(;n<((t=gs(2,--e))-1)/11;);return 1/gs(4,3-e)-7.5625*gs((t*3-2)/22-n,2)},Back:(n=1.7)=>t=>(+n+1)*t*t*t-+n*t*t,Elastic:(n=1,t=.3)=>{let e=bn(+n,1,10),i=bn(+t,ie,2),s=i/hd*$u(1/e),r=hd/i;return o=>o===0||o===1?o:-e*gs(2,-10*(1-o))*Zu((1-o-s)*r)}},Nc=(()=>{let n={linear:Ci,none:Ci};for(let t in Uc)for(let e in ud){let i=ud[e],s=Uc[t];n[t+e]=e===Wn||e==="Back"||e==="Elastic"?(r,o)=>s(i(r,o)):s(i)}return n})(),$o={linear:Ci,none:Ci},$p=n=>{if($o[n])return $o[n];if(n.indexOf("(")<=-1){let e=Uc[n]||n.includes("Back")||n.includes("Elastic")?Nc[n]():Nc[n];return e?$o[n]=e:Ci}else{let t=n.slice(0,-1).split("("),e=Nc[t[0]];return e?$o[n]=e(...t[1].split(",")):Ci}},dd=["steps(","irregular(","linear(","cubicBezier("],vs=n=>{if(Mn(n)){for(let e=0,i=dd.length;e<i;e++)if(Pn(n,dd[e]))return console.warn(`String syntax for \`ease: "${n}"\` has been removed from the core and replaced by importing and passing the easing function directly: \`ease: ${n}\``),Ci}return fn(n)?n:Mn(n)?$p(n):Ci};var $t=Go(),oe=Go(),Gs={},Ko={func:null},jo={func:null},Qo=[null],Ws=[null,null],ta={to:null},Kp=0,fd=0,Zi,xi,jp=(n,t)=>{let e={};if(Xn(n)){let i=[].concat(...n.map(s=>Object.keys(s))).filter(Br);for(let s=0,r=i.length;s<r;s++){let o=i[s],a=n.map(l=>{let c={};for(let h in l){let d=l[h];Br(h)?h===o&&(c.to=d):c[h]=d}return c});e[o]=a}}else{let i=ke(t.duration,de.defaults.duration);Object.keys(n).map(r=>({o:parseFloat(r)/100,p:n[r]})).sort((r,o)=>r.o-o.o).forEach(r=>{let o=r.o,a=r.p;for(let l in a)if(Br(l)){let c=e[l];c||(c=e[l]=[]);let h=o*i,d=c.length,u=c[d-1],f={to:a[l]},p=0;for(let x=0;x<d;x++)p+=c[x].duration;d===1&&(f.from=u.to),a.ease&&(f.ease=a.ease),f.duration=h-(d?p:0),c.push(f)}return r});for(let r in e){let o=e[r],a;for(let l=0,c=o.length;l<c;l++){let h=o[l],d=h.ease;h.ease=a||void 0,a=d}o[0].duration||o.shift()}}return e},Xs=class extends ys{constructor(t,e,i,s,r=!1,o=0,a){super(e,i,s),this._head,this._tail,++fd;let l=Jo(t),c=l.length,h=e.keyframes,d=h?zo(jp(h,e),e):e,{id:u,delay:f,duration:p,ease:x,playbackEase:g,modifier:m,composition:E,onRender:C}=d,M=i?i.defaults:de.defaults,w=ke(x,M.ease),v=ke(g,M.playbackEase),S=v?vs(v):null,_=!Vt(w.ease),T=_?w.ease:ke(x,S?"linear":M.ease),R=_?w.settlingDuration:ke(p,M.duration),P=ke(f,M.delay),D=m||M.modifier,k=Vt(E)&&c>=pi?Be.none:Vt(E)?M.composition:E,L=this._offset+(i?i._offset:0);_&&(w.parent=this);let z=NaN,W=NaN,J=0,et=0;for(let O=0;O<c;O++){let q=l[O],j=o||O,yt=a||l,Tt=NaN,pe=NaN;for(let qt in d)if(Br(qt)){let Et=wc(q,qt),Y=Ho(q,qt),K=Xo(qt,q,Et),it=d[qt],Ct=Xn(it);if(r&&!Ct&&(Ws[0]=it,Ws[1]=it,it=Ws),Ct){let kt=it.length,Dt=!ms(it[0]);kt===2&&Dt?(ta.to=it,Qo[0]=ta,Zi=Qo):kt>2&&Dt?(Zi=[],it.forEach((te,ue)=>{ue?ue===1?(Ws[1]=te,Zi.push(Ws)):Zi.push(te):Ws[0]=te})):Zi=it}else Qo[0]=it,Zi=Qo;let ot=null,ut=null,Yt=NaN,Bt=0,Wt=0;for(let kt=Zi.length;Wt<kt;Wt++){let Dt=Zi[Wt];ms(Dt)?xi=Dt:(ta.to=Dt,xi=ta),Ko.func=null,jo.func=null;let te=gi(ke(xi.composition,k),q,j,yt,null,null),ue=vn(te)?te:Be[te];!ot&&ue!==Be.none&&(ot=Xr(q,K));let Se=ot?ot._tail:null,jt=i&&Se&&Se.parent.parent===i?Se:ut,le=gi(xi.to,q,j,yt,Ko,jt),I;ms(le)&&!Vt(le.to)?(xi=le,I=le.to):I=le;let ne=gi(xi.from,q,j,yt,jo,jt),Pt=xi.ease||T,A=gi(Pt,q,j,yt,null,jt),y=fn(A)||Mn(A)?A:Pt,B=!Vt(y)&&!Vt(y.ease),V=B?y.ease:y,Z=B?y.settlingDuration:gi(ke(xi.duration,kt>1?gi(R,q,j,yt,null,jt)/kt:R),q,j,yt,null,jt),st=gi(ke(xi.delay,Wt?0:P),q,j,yt,null,jt),rt=xi.modifier||D,$=!Vt(ne),Q=!Vt(I),at=Xn(I),Ut=at||$&&Q,dt=ut?Bt:0,ct=ut?Bt+st:st,It=xe(L+ct,12),Ht=xe(L+dt,12);!et&&($||at)&&(et=1);let zt=ut;if(ue!==Be.none){let Nt=ot._head;for(;Nt&&Nt._absoluteStartTime<=It;)if(Nt._isOverridden||(zt=Nt),Nt=Nt._nextRep,Nt&&Nt._absoluteStartTime>=It)for(;Nt;)Wr(Nt),Nt=Nt._nextRep}if(Ut){Sn(at?gi(I[0],q,j,yt,jo,jt):ne,$t),Sn(at?gi(I[1],q,j,yt,Ko,jt):I,oe);let Nt=Yi(q,K,Et,Gs);$t.t===re.NUMBER&&(zt?zt._valueType===re.UNIT&&($t.t=re.UNIT,$t.u=zt._unit):(Sn(Nt,In),In.t===re.UNIT&&($t.t=re.UNIT,$t.u=In.u)))}else Q?Sn(I,oe):ut?Ac(ut,oe):Sn(i&&zt&&zt.parent.parent===i?zt._value:Yi(q,K,Et,Gs),oe),$?Sn(ne,$t):ut?Ac(ut,$t):Sn(i&&zt&&zt.parent.parent===i?zt._value:Yi(q,K,Et,Gs),$t);if($t.o&&($t.n=Vs(zt?zt._toNumber:Sn(Yi(q,K,Et,Gs),In).n,$t.n,$t.o)),oe.o&&(oe.n=Vs($t.n,oe.n,oe.o)),$t.t!==oe.t){if($t.t===re.COMPLEX||oe.t===re.COMPLEX){let Nt=$t.t===re.COMPLEX?$t:oe,Kt=$t.t===re.COMPLEX?oe:$t;Kt.t=re.COMPLEX,Kt.s=Ge(Nt.s),Kt.d=Nt.d.map(()=>Kt.n)}else if($t.t===re.UNIT||oe.t===re.UNIT){let Nt=$t.t===re.UNIT?$t:oe,Kt=$t.t===re.UNIT?oe:$t;Kt.t=re.UNIT,Kt.u=Nt.u}else if($t.t===re.COLOR||oe.t===re.COLOR){let Nt=$t.t===re.COLOR?$t:oe,Kt=$t.t===re.COLOR?oe:$t;Kt.t=re.COLOR,Kt.d=Nt.d.map(()=>0)}}if($t.u!==oe.u){let Nt=oe.u?$t:oe;Nt=Dc(q,Nt,oe.u?oe.u:$t.u,!1)}if(oe.d&&$t.d&&oe.d.length!==$t.d.length){let Nt=$t.d.length>oe.d.length?$t:oe,Kt=Nt===$t?oe:$t;Kt.d=Nt.d.map((Vn,Cn)=>Vt(Kt.d[Cn])?0:Kt.d[Cn]),Kt.s=Ge(Nt.s)}let F=xe(+Z||ie,12),ht=Gs[K];mi(ht)||(Gs[K]=null);let tt=Y?Y.set:null;Bt=xe(ct+F,12);let lt=$t.d,mt=oe.d,nt=oe.s,xt={parent:this,id:Kp++,property:K,target:q,_value:null,_toFunc:Ko.func,_fromFunc:jo.func,_ease:vs(V),_fromNumbers:lt?Ge(lt):Fr,_toNumbers:mt?Ge(mt):Fr,_strings:nt?Ge(nt):Fr,_fromNumber:$t.n,_toNumber:oe.n,_numbers:lt?Ge(lt):Fr,_number:$t.n,_unit:oe.u,_modifier:rt,_currentTime:0,_startTime:ct,_delay:+st,_updateDuration:F,_changeDuration:F,_absoluteStartTime:It,_absoluteUpdateStartTime:Ht,_absoluteEndTime:xe(L+Bt,12),_hasFromValue:$||at?1:0,_tweenType:Et,_setter:tt,_valueType:oe.t,_composition:ue,_isOverlapped:0,_isOverridden:0,_renderTransforms:0,_inlineValue:ht,_prevRep:null,_nextRep:null,_prevAdd:null,_nextAdd:null,_prev:null,_next:null};ue!==Be.none&&Yo(xt,ot);let wt=xt._valueType;if(wt===re.COMPLEX)xt._value=Wo(xt,1,-1);else if(wt===re.UNIT)xt._value=`${rt(xt._toNumber)}${xt._unit}`;else if(wt===re.COLOR){let Nt=oe.d;xt._value=`rgba(${xe(Nt[0],0)},${xe(Nt[1],0)},${xe(Nt[2],0)},${Nt[3]})`}else xt._value=rt(xt._toNumber);isNaN(Yt)&&(Yt=xt._startTime),ut=xt,J++,Kn(this,xt)}(isNaN(W)||Yt<W)&&(W=Yt),(isNaN(z)||Bt>z)&&(z=Bt),Et===Me.TRANSFORM&&(Tt=J-Wt,pe=J)}if(!isNaN(Tt)){let qt=0;ye(this,Et=>{qt>=Tt&&qt<pe&&(Et._renderTransforms=1,Et._composition===Be.blend&&ye(Ri.animation,Y=>{Y.id===Et.id&&(Y._renderTransforms=1)})),qt++})}}c||console.warn("No target found. Make sure the element you're trying to animate is accessible before creating your animation."),W?(ye(this,O=>{O._startTime-O._delay||(O._delay-=W),O._startTime-=W}),z-=W):W=0,z||(z=ie,this.iterationCount=0),this.targets=l,this.id=Vt(u)?fd:u,this.duration=z===ie?ie:xs((z+this._loopDelay)*this.iterationCount-this._loopDelay)||ie,this.onRender=C||M.onRender,this._ease=S,this._delay=W,this.iterationDuration=z,!this._autoplay&&et&&this.onRender(this)}stretch(t){let e=this.duration;if(e===wi(t))return this;let i=t/e;return ye(this,s=>{s._updateDuration=wi(s._updateDuration*i),s._changeDuration=wi(s._changeDuration*i),s._currentTime*=i,s._delay*=i,s._startTime*=i,s._absoluteStartTime*=i,s._absoluteUpdateStartTime*=i,s._absoluteEndTime*=i}),super.stretch(t)}refresh(){return ye(this,t=>{let e=t._toFunc,i=t._fromFunc;(e||i)&&(i?(Sn(i(),$t),$t.u!==t._unit&&t.target[fi]&&Dc(t.target,$t,t._unit,!0),t._fromNumbers=Ge($t.d),t._fromNumber=$t.n):e&&(Sn(Yi(t.target,t.property,t._tweenType),In),t._fromNumbers=Ge(In.d),t._fromNumber=In.n),e&&(Sn(e(),oe),t._toNumbers=Ge(oe.d),t._strings=Ge(oe.s),t._toNumber=oe.o?Vs(t._fromNumber,oe.n,oe.o):oe.n))}),this.duration===ie&&this.restart(),this}revert(){return super.revert(),Gr(this)}then(t){return super.then(t)}},qs=(n,t)=>de.editor?de.editor.addAnimation(n,t):new Xs(n,t,null,0,!1).init();var Qp=(n,t)=>{if(Pn(t,"<")){let e=t[1]==="<",i=n._tail,s=i?i._offset+i._delay:0;return e?s:s+i.duration}},Ms=(n,t)=>{let e=n.iterationDuration;if(e===ie&&(e=0),Vt(t))return e;if(vn(+t))return+t;let i=t,s=n?n.labels:null,r=!mi(s),o=Qp(n,i),a=!Vt(o),l=Gu.exec(i);if(l){let c=l[0],h=i.split(c),d=r&&h[0]?s[h[0]]:e,u=a?o:r?d:e,f=+h[1];return Vs(u,f,c[0])}else return a?o:r?Vt(s[i])?e:s[i]:e};function tm(n){return xs((n.iterationDuration+n._loopDelay)*n.iterationCount-n._loopDelay)||ie}function Fc(n,t,e,i,s,r){let a=vn(n.duration)&&n.duration<=ie?e-ie:e;t.composition&&_i(t,a,1,1,qe.AUTO);let l=i?new Xs(i,n,t,a,!1,s,r):new ys(n,t,a);return t.composition&&l.init(!0),Kn(t,l),ye(t,c=>{let d=c._offset+c._delay+c.duration;d>t.iterationDuration&&(t.iterationDuration=d)}),t.duration=tm(t),t}var pd=0,ea=class extends ys{constructor(t={}){super(t,null,0),++pd,this.id=Vt(t.id)?pd:t.id,this.duration=0,this.labels={};let e=t.defaults,i=de.defaults;this.defaults=e?zo(e,i):i,this.composition=ke(t.composition,!0),this.onRender=t.onRender||i.onRender;let s=ke(t.playbackEase,i.playbackEase);this._ease=s?vs(s):null,this.iterationDuration=0}add(t,e,i){let s=ms(e),r=ms(t);if(s||r){if(this._hasChildren=!0,s){let o=e,a=de.editor&&de.editor.addTimelineChild,l=i&&i.type==="Stagger"&&de.editor,c=fn(i)?i:null;if(c||l){let h=Zo(t),d=this.duration,u=this.iterationDuration,f=o.id,p=0,x=h.length,g=a?a(t,o,this.id,i,x):null,m=c||de.editor.resolveStagger(i.defaultValue);h.forEach(E=>{let C={...g||o};this.duration=d,this.iterationDuration=u,Vt(f)||(C.id=f+"-"+p);let M=Ms(this,m(E,p,h,null,this));Fc(C,this,M,E,p,h),p++})}else{let h=a?a(t,o,this.id,i):o,d=i&&i.type?i.defaultValue:i;Fc(h,this,Ms(this,d),t)}}else Fc(t,this,Ms(this,e));return this.composition&&this.init(!0),this}}sync(t,e){if(Vt(t)||t&&Vt(t.pause))return this;t.pause();let i=+(t.effect?t.effect.getTiming().duration:t.duration);!Vt(t)&&!Vt(t.persist)&&(t.persist=!0);let s=de.editor,r=s&&s.addTimelineChild;s&&s.addTimelineSync&&(e=s.addTimelineSync(t,e,this.id),s.addTimelineChild=null);let o=this.add(t,{currentTime:[0,i],duration:i,delay:0,ease:"linear",playbackEase:"linear"},e);return s&&(s.addTimelineChild=r),o}set(t,e,i){return Vt(e)?this:(e.duration=ie,e.composition=Be.replace,this.add(t,e,i))}call(t,e){return Vt(t)||t&&!fn(t)?this:(de.editor&&de.editor.addTimelineCall&&(e=de.editor.addTimelineCall(t,e,this.id)),this.add({duration:0,delay:0,onComplete:()=>t(this)},e))}label(t,e){return Vt(t)||t&&!Mn(t)?this:(de.editor&&de.editor.addTimelineLabel&&(e=de.editor.addTimelineLabel(t,e,this.id)),this.labels[t]=Ms(this,e),this)}remove(t,e){return Pc(Zo(t),this,e),this}stretch(t){let e=this.duration;if(e===wi(t))return this;let i=t/e,s=this.labels;ye(this,r=>r.stretch(r.duration*i));for(let r in s)s[r]*=i;return super.stretch(t)}refresh(){return ye(this,t=>{t.refresh&&t.refresh()}),this}revert(){return super.revert(),ye(this,t=>t.revert,!0),Gr(this)}then(t){return super.then(t)}},Oc=n=>de.editor?de.editor.addTimeline(n):new ea(n).init();var Bc=(n=0,t=1,e=0)=>{let i=10**e;return Math.floor((Math.random()*(t-n+1/i)+n)*i)/i},em=0,md=(n,t=0,e=1,i=0)=>{let s=n===void 0?em++:n;return(r=t,o=e,a=i)=>{s+=1831565813,s=Math.imul(s^s>>>15,s|1),s^=s+Math.imul(s^s>>>7,s|61);let l=10**a;return Math.floor((((s^s>>>14)>>>0)/4294967296*(o-r+1/l)+r)*l)/l}};var gd=(n,t=Bc)=>{let e=n.length,i,s;for(;e;)s=t(0,--e),i=n[e],n[e]=n[s],n[s]=i;return n};var Ys=(n,t={})=>{let e=[],i=0,s,r=null,o=t.from,a=t.reversed,l=t.ease,c=!Vt(l),d=c&&!Vt(l.ease)?l.ease:c?vs(l):null,u=t.grid,f=u===!0,p=t.axis,x=t.total,g=Vt(o)||o===0||o==="first",m=o==="center",E=o==="last",C=o==="random",M=Xn(o),w=Xn(n),v=t.use,S=w?ko(n[0]):ko(n),_=w?ko(n[1]):0,T=Oo.exec((w?n[1]:n)+Wn),R=t.start||0+(w?S:0),P=t.seed,k=!Vt(P)&&P!==!1?md(P===!0?0:P):Bc,L=t.jitter,z=!Vt(L),W=Xn(L),J=W?L[0]:L||0,et=W?L[1]:L||0,O=g?0:vn(o)?o:0;return(q,j,yt,Tt,pe)=>{let[qt]=Jo(q),Et=Vt(x)?yt.length:x,Y=Vt(v)?!1:fn(v)?v(qt,j,Et):Yi(qt,v),K=vn(Y)||Mn(Y)&&vn(+Y)?+Y:j,it=K>=0&&K<Et?K:j;if(m&&(O=(Et-1)/2),E&&(O=Et-1),!e.length){if(f){let ut=!0,Yt=!1,Bt=1/0,Wt=1/0,kt=1/0,Dt=-1/0,te=-1/0,ue=-1/0,Se=[],jt=[],le=[];for(let I=0;I<Et;I++){let ne=yt[I],Pt=0,A=0,y=0,B=!1;if(ne&&fn(ne.getBoundingClientRect)){let V=ne.getBoundingClientRect();Pt=V.left+V.width/2,A=V.top+V.height/2,B=!0}else{let V=ne;V&&vn(V.x)&&vn(V.y)&&(Pt=V.x,A=V.y,vn(V.z)&&(y=V.z,Yt=!0),B=!0)}if(!B){ut=!1;break}Se.push(Pt),jt.push(A),le.push(y),Pt<Bt&&(Bt=Pt),A<Wt&&(Wt=A),y<kt&&(kt=y),Pt>Dt&&(Dt=Pt),A>te&&(te=A),y>ue&&(ue=y)}if(ut){let I=Se[0],ne=jt[0],Pt=le[0];M?(I=Bt+o[0]*(Dt-Bt),ne=Wt+o[1]*(te-Wt),Pt=Yt?kt+(o.length>=3?o[2]:.5)*(ue-kt):0):m?(I=(Bt+Dt)/2,ne=(Wt+te)/2,Pt=(kt+ue)/2):E?(I=Se[Et-1],ne=jt[Et-1],Pt=le[Et-1]):vn(o)&&(I=Se[o],ne=jt[o],Pt=le[o]);for(let y=0;y<Et;y++){let B=I-Se[y],V=ne-jt[y],Z=Pt-le[y],st=kr(B*B+V*V+(Yt?Z*Z:0));p==="x"&&(st=-B),p==="y"&&(st=-V),p==="z"&&(st=-Z),e.push(st)}let A=1/0;for(let y=0;y<Et;y++){let B=zr(e[y]);B>0&&B<A&&(A=B)}if(A>0&&A<1/0)for(let y=0;y<Et;y++)e[y]=e[y]/A}else for(let I=0;I<Et;I++)e.push(zr(O-I))}else for(let ut=0;ut<Et;ut++)if(!u)e.push(zr(O-ut));else{let Yt=u.length,Bt=u[0]*u[1],Wt,kt,Dt;M?(Wt=o[0]*(u[0]-1),kt=o[1]*(u[1]-1),Dt=Yt===3?(o.length>=3?o[2]:.5)*(u[2]-1):0):m?(Wt=(u[0]-1)/2,kt=(u[1]-1)/2,Dt=Yt===3?(u[2]-1)/2:0):(Wt=O%u[0],kt=_s(O/u[0])%u[1],Dt=Yt===3?_s(O/Bt):0);let te=ut%u[0],ue=_s(ut/u[0])%u[1],Se=Yt===3?_s(ut/Bt):0,jt=Wt-te,le=kt-ue,I=Dt-Se,ne=kr(jt*jt+le*le+(Yt===3?I*I:0));p==="x"&&(ne=-jt),p==="y"&&(ne=-le),p==="z"&&(ne=-I),e.push(ne)}i=e[0];for(let ut=1;ut<Et;ut++)e[ut]>i&&(i=e[ut]);if(d||a)for(let ut=0;ut<Et;ut++){let Yt=e[ut];d&&(Yt=d(Yt/i)*i),a&&(Yt=p?-Yt:zr(i-Yt)),e[ut]=Yt}if(z){r=new Array(Et);for(let ut=0;ut<Et;ut++)r[ut]=k(-1,1,4)}C&&(e=gd(e,k))}let Ct=w?(_-S)/i:S;Vt(s)&&(s=pe?Ms(pe,Vt(t.start)?pe.iterationDuration:R):R);let ot=s+(Ct*xe(e[it],2)||0);if(z){let ut=i?e[it]/i:0,Yt=J+(et-J)*ut;ot=ot+r[it]*Yt}return t.modifier&&(ot=t.modifier(ot)),T&&(ot=`${ot}${T[2]}`),ot}};var as={LEFT:0,MIDDLE:1,RIGHT:2,ROTATE:0,DOLLY:1,PAN:2},ls={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},Xd=0,gh=1,qd=2;var xo=1,Yd=2,br=3,cs=0,xn=1,Zn=2,bi=0,Sr=1,_h=2,xh=3,yh=4,Zd=5;var Is=100,Jd=101,$d=102,Kd=103,jd=104,Qd=200,tf=201,ef=202,nf=203,vh=204,Mh=205,sf=206,rf=207,of=208,af=209,lf=210,cf=211,hf=212,uf=213,df=214,Ca=0,Pa=1,Ia=2,hr=3,La=4,Da=5,Na=6,Ua=7,bh=0,ff=1,pf=2,ri=0,Sh=1,Th=2,Eh=3,yo=4,wh=5,Ah=6,Rh=7;var Ch=300,hs=301,Ls=302,hl=303,ul=304,vo=306,Fa=1e3,vi=1001,Oa=1002,Qe=1003,mf=1004;var Mo=1005;var sn=1006,dl=1007;var us=1008;var wn=1009,Ph=1010,Ih=1011,Tr=1012,fl=1013,oi=1014,ai=1015,li=1016,pl=1017,ml=1018,Er=1020,Lh=35902,Dh=35899,Nh=1021,Uh=1022,Jn=1023,Mi=1026,ds=1027,Fh=1028,gl=1029,fs=1030,_l=1031;var xl=1033,bo=33776,So=33777,To=33778,Eo=33779,yl=35840,vl=35841,Ml=35842,bl=35843,Sl=36196,Tl=37492,El=37496,wl=37488,Al=37489,wo=37490,Rl=37491,Cl=37808,Pl=37809,Il=37810,Ll=37811,Dl=37812,Nl=37813,Ul=37814,Fl=37815,Ol=37816,Bl=37817,kl=37818,zl=37819,Vl=37820,Hl=37821,Gl=36492,Wl=36494,Xl=36495,ql=36283,Yl=36284,Ao=36285,Zl=36286;var Qr=2300,Ba=2301,Aa=2302,ch=2303,hh=2400,uh=2401,dh=2402;var gf=3200;var Jl=0,_f=1,zi="",mn="srgb",to="srgb-linear",eo="linear",be="srgb";var Ra=7680;var xf=519,yf=512,vf=513,Mf=514,$l=515,bf=516,Sf=517,Kl=518,Tf=519,Ef=35044;var Oh="300 es",ei=2e3,ur=2001;function nm(n){for(let t=n.length-1;t>=0;--t)if(n[t]>=65535)return!0;return!1}function im(n){return ArrayBuffer.isView(n)&&!(n instanceof DataView)}function no(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function wf(){let n=no("canvas");return n.style.display="block",n}var _d={},dr=null;function Bh(...n){let t="THREE."+n.shift();dr?dr("log",t,...n):console.log(t,...n)}function Af(n){let t=n[0];if(typeof t=="string"&&t.startsWith("TSL:")){let e=n[1];e&&e.isStackTrace?n[0]+=" "+e.getLocation():n[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return n}function Gt(...n){n=Af(n);let t="THREE."+n.shift();if(dr)dr("warn",t,...n);else{let e=n[0];e&&e.isStackTrace?console.warn(e.getError(t)):console.warn(t,...n)}}function Jt(...n){n=Af(n);let t="THREE."+n.shift();if(dr)dr("error",t,...n);else{let e=n[0];e&&e.isStackTrace?console.error(e.getError(t)):console.error(t,...n)}}function ws(...n){let t=n.join(" ");t in _d||(_d[t]=!0,Gt(...n))}function Rf(n,t,e){return new Promise(function(i,s){function r(){switch(n.clientWaitSync(t,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:s();break;case n.TIMEOUT_EXPIRED:setTimeout(r,e);break;default:i()}}setTimeout(r,e)})}var Cf={[Ca]:Pa,[Ia]:Na,[La]:Ua,[hr]:Da,[Pa]:Ca,[Na]:Ia,[Ua]:La,[Da]:hr},ni=class{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});let i=this._listeners;i[t]===void 0&&(i[t]=[]),i[t].indexOf(e)===-1&&i[t].push(e)}hasEventListener(t,e){let i=this._listeners;return i===void 0?!1:i[t]!==void 0&&i[t].indexOf(e)!==-1}removeEventListener(t,e){let i=this._listeners;if(i===void 0)return;let s=i[t];if(s!==void 0){let r=s.indexOf(e);r!==-1&&s.splice(r,1)}}dispatchEvent(t){let e=this._listeners;if(e===void 0)return;let i=e[t.type];if(i!==void 0){t.target=this;let s=i.slice(0);for(let r=0,o=s.length;r<o;r++)s[r].call(this,t);t.target=null}}},on=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],xd=1234567,lr=Math.PI/180,fr=180/Math.PI;function wr(){let n=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(on[n&255]+on[n>>8&255]+on[n>>16&255]+on[n>>24&255]+"-"+on[t&255]+on[t>>8&255]+"-"+on[t>>16&15|64]+on[t>>24&255]+"-"+on[e&63|128]+on[e>>8&255]+"-"+on[e>>16&255]+on[e>>24&255]+on[i&255]+on[i>>8&255]+on[i>>16&255]+on[i>>24&255]).toLowerCase()}function fe(n,t,e){return Math.max(t,Math.min(e,n))}function kh(n,t){return(n%t+t)%t}function sm(n,t,e,i,s){return i+(n-t)*(s-i)/(e-t)}function rm(n,t,e){return n!==t?(e-n)/(t-n):0}function jr(n,t,e){return(1-e)*n+e*t}function om(n,t,e,i){return jr(n,t,1-Math.exp(-e*i))}function am(n,t=1){return t-Math.abs(kh(n,t*2)-t)}function lm(n,t,e){return n<=t?0:n>=e?1:(n=(n-t)/(e-t),n*n*(3-2*n))}function cm(n,t,e){return n<=t?0:n>=e?1:(n=(n-t)/(e-t),n*n*n*(n*(n*6-15)+10))}function hm(n,t){return n+Math.floor(Math.random()*(t-n+1))}function um(n,t){return n+Math.random()*(t-n)}function dm(n){return n*(.5-Math.random())}function fm(n){n!==void 0&&(xd=n);let t=xd+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function pm(n){return n*lr}function mm(n){return n*fr}function gm(n){return n>0&&Number.isInteger(n)&&2**Math.round(Math.log2(n))===n}function _m(n){return Math.pow(2,Math.ceil(Math.log(n)/Math.LN2))}function xm(n){return Math.pow(2,Math.floor(Math.log(n)/Math.LN2))}function ym(n,t,e,i,s){let r=Math.cos,o=Math.sin,a=r(e/2),l=o(e/2),c=r((t+i)/2),h=o((t+i)/2),d=r((t-i)/2),u=o((t-i)/2),f=r((i-t)/2),p=o((i-t)/2);switch(s){case"XYX":n.set(a*h,l*d,l*u,a*c);break;case"YZY":n.set(l*u,a*h,l*d,a*c);break;case"ZXZ":n.set(l*d,l*u,a*h,a*c);break;case"XZX":n.set(a*h,l*p,l*f,a*c);break;case"YXY":n.set(l*f,a*h,l*p,a*c);break;case"ZYZ":n.set(l*p,l*f,a*h,a*c);break;default:Gt("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function ar(n,t){switch(t.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:case Uint8ClampedArray:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("THREE.MathUtils: Invalid component type.")}}function pn(n,t){switch(t.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:case Uint8ClampedArray:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("THREE.MathUtils: Invalid component type.")}}var zh={DEG2RAD:lr,RAD2DEG:fr,generateUUID:wr,clamp:fe,euclideanModulo:kh,mapLinear:sm,inverseLerp:rm,lerp:jr,damp:om,pingpong:am,smoothstep:lm,smootherstep:cm,randInt:hm,randFloat:um,randFloatSpread:dm,seededRandom:fm,degToRad:pm,radToDeg:mm,isPowerOfTwo:gm,ceilPowerOfTwo:_m,floorPowerOfTwo:xm,setQuaternionFromProperEuler:ym,normalize:pn,denormalize:ar},Xh=class Xh{constructor(t=0,e=0){this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("THREE.Vector2: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){let e=this.x,i=this.y,s=t.elements;return this.x=s[0]*e+s[3]*i+s[6],this.y=s[1]*e+s[4]*i+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=fe(this.x,t.x,e.x),this.y=fe(this.y,t.y,e.y),this}clampScalar(t,e){return this.x=fe(this.x,t,e),this.y=fe(this.y,t,e),this}clampLength(t,e){let i=this.length();return this.divideScalar(i||1).multiplyScalar(fe(i,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let i=this.dot(t)/e;return Math.acos(fe(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,i=this.y-t.y;return e*e+i*i}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){let i=Math.cos(e),s=Math.sin(e),r=this.x-t.x,o=this.y-t.y;return this.x=r*i-o*s+t.x,this.y=r*s+o*i+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}};Xh.prototype.isVector2=!0;var Zt=Xh,Un=class{constructor(t=0,e=0,i=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=i,this._w=s}static slerpFlat(t,e,i,s,r,o,a){let l=i[s+0],c=i[s+1],h=i[s+2],d=i[s+3],u=r[o+0],f=r[o+1],p=r[o+2],x=r[o+3];if(d!==x||l!==u||c!==f||h!==p){let g=l*u+c*f+h*p+d*x;g<0&&(u=-u,f=-f,p=-p,x=-x,g=-g);let m=1-a;if(g<.9995){let E=Math.acos(g),C=Math.sin(E);m=Math.sin(m*E)/C,a=Math.sin(a*E)/C,l=l*m+u*a,c=c*m+f*a,h=h*m+p*a,d=d*m+x*a}else{l=l*m+u*a,c=c*m+f*a,h=h*m+p*a,d=d*m+x*a;let E=1/Math.sqrt(l*l+c*c+h*h+d*d);l*=E,c*=E,h*=E,d*=E}}t[e]=l,t[e+1]=c,t[e+2]=h,t[e+3]=d}static multiplyQuaternionsFlat(t,e,i,s,r,o){let a=i[s],l=i[s+1],c=i[s+2],h=i[s+3],d=r[o],u=r[o+1],f=r[o+2],p=r[o+3];return t[e]=a*p+h*d+l*f-c*u,t[e+1]=l*p+h*u+c*d-a*f,t[e+2]=c*p+h*f+a*u-l*d,t[e+3]=h*p-a*d-l*u-c*f,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,i,s){return this._x=t,this._y=e,this._z=i,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){let i=t._x,s=t._y,r=t._z,o=t._order,a=Math.cos,l=Math.sin,c=a(i/2),h=a(s/2),d=a(r/2),u=l(i/2),f=l(s/2),p=l(r/2);switch(o){case"XYZ":this._x=u*h*d+c*f*p,this._y=c*f*d-u*h*p,this._z=c*h*p+u*f*d,this._w=c*h*d-u*f*p;break;case"YXZ":this._x=u*h*d+c*f*p,this._y=c*f*d-u*h*p,this._z=c*h*p-u*f*d,this._w=c*h*d+u*f*p;break;case"ZXY":this._x=u*h*d-c*f*p,this._y=c*f*d+u*h*p,this._z=c*h*p+u*f*d,this._w=c*h*d-u*f*p;break;case"ZYX":this._x=u*h*d-c*f*p,this._y=c*f*d+u*h*p,this._z=c*h*p-u*f*d,this._w=c*h*d+u*f*p;break;case"YZX":this._x=u*h*d+c*f*p,this._y=c*f*d+u*h*p,this._z=c*h*p-u*f*d,this._w=c*h*d-u*f*p;break;case"XZY":this._x=u*h*d-c*f*p,this._y=c*f*d-u*h*p,this._z=c*h*p+u*f*d,this._w=c*h*d+u*f*p;break;default:Gt("Quaternion: .setFromEuler() encountered an unknown order: "+o)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){let i=e/2,s=Math.sin(i);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(t){let e=t.elements,i=e[0],s=e[4],r=e[8],o=e[1],a=e[5],l=e[9],c=e[2],h=e[6],d=e[10],u=i+a+d;if(u>0){let f=.5/Math.sqrt(u+1);this._w=.25/f,this._x=(h-l)*f,this._y=(r-c)*f,this._z=(o-s)*f}else if(i>a&&i>d){let f=2*Math.sqrt(1+i-a-d);this._w=(h-l)/f,this._x=.25*f,this._y=(s+o)/f,this._z=(r+c)/f}else if(a>d){let f=2*Math.sqrt(1+a-i-d);this._w=(r-c)/f,this._x=(s+o)/f,this._y=.25*f,this._z=(l+h)/f}else{let f=2*Math.sqrt(1+d-i-a);this._w=(o-s)/f,this._x=(r+c)/f,this._y=(l+h)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let i=t.dot(e)+1;return i<1e-8?(i=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=i):(this._x=0,this._y=-t.z,this._z=t.y,this._w=i)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=i),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(fe(this.dot(t),-1,1)))}rotateTowards(t,e){let i=this.angleTo(t);if(i===0)return this;let s=Math.min(1,e/i);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){let i=t._x,s=t._y,r=t._z,o=t._w,a=e._x,l=e._y,c=e._z,h=e._w;return this._x=i*h+o*a+s*c-r*l,this._y=s*h+o*l+r*a-i*c,this._z=r*h+o*c+i*l-s*a,this._w=o*h-i*a-s*l-r*c,this._onChangeCallback(),this}slerp(t,e){let i=t._x,s=t._y,r=t._z,o=t._w,a=this.dot(t);a<0&&(i=-i,s=-s,r=-r,o=-o,a=-a);let l=1-e;if(a<.9995){let c=Math.acos(a),h=Math.sin(c);l=Math.sin(l*c)/h,e=Math.sin(e*c)/h,this._x=this._x*l+i*e,this._y=this._y*l+s*e,this._z=this._z*l+r*e,this._w=this._w*l+o*e,this._onChangeCallback()}else this._x=this._x*l+i*e,this._y=this._y*l+s*e,this._z=this._z*l+r*e,this._w=this._w*l+o*e,this.normalize();return this}slerpQuaternions(t,e,i){return this.copy(t).slerp(e,i)}random(){let t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),i=Math.random(),s=Math.sqrt(1-i),r=Math.sqrt(i);return this.set(s*Math.sin(t),s*Math.cos(t),r*Math.sin(e),r*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},qh=class qh{constructor(t=0,e=0,i=0){this.x=t,this.y=e,this.z=i}set(t,e,i){return i===void 0&&(i=this.z),this.x=t,this.y=e,this.z=i,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("THREE.Vector3: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(yd.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(yd.setFromAxisAngle(t,e))}applyMatrix3(t){let e=this.x,i=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[3]*i+r[6]*s,this.y=r[1]*e+r[4]*i+r[7]*s,this.z=r[2]*e+r[5]*i+r[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){let e=this.x,i=this.y,s=this.z,r=t.elements,o=1/(r[3]*e+r[7]*i+r[11]*s+r[15]);return this.x=(r[0]*e+r[4]*i+r[8]*s+r[12])*o,this.y=(r[1]*e+r[5]*i+r[9]*s+r[13])*o,this.z=(r[2]*e+r[6]*i+r[10]*s+r[14])*o,this}applyQuaternion(t){let e=this.x,i=this.y,s=this.z,r=t.x,o=t.y,a=t.z,l=t.w,c=2*(o*s-a*i),h=2*(a*e-r*s),d=2*(r*i-o*e);return this.x=e+l*c+o*d-a*h,this.y=i+l*h+a*c-r*d,this.z=s+l*d+r*h-o*c,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){let e=this.x,i=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[4]*i+r[8]*s,this.y=r[1]*e+r[5]*i+r[9]*s,this.z=r[2]*e+r[6]*i+r[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=fe(this.x,t.x,e.x),this.y=fe(this.y,t.y,e.y),this.z=fe(this.z,t.z,e.z),this}clampScalar(t,e){return this.x=fe(this.x,t,e),this.y=fe(this.y,t,e),this.z=fe(this.z,t,e),this}clampLength(t,e){let i=this.length();return this.divideScalar(i||1).multiplyScalar(fe(i,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){let i=t.x,s=t.y,r=t.z,o=e.x,a=e.y,l=e.z;return this.x=s*l-r*a,this.y=r*o-i*l,this.z=i*a-s*o,this}projectOnVector(t){let e=t.lengthSq();if(e===0)return this.set(0,0,0);let i=t.dot(this)/e;return this.copy(t).multiplyScalar(i)}projectOnPlane(t){return kc.copy(this).projectOnVector(t),this.sub(kc)}reflect(t){return this.sub(kc.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let i=this.dot(t)/e;return Math.acos(fe(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,i=this.y-t.y,s=this.z-t.z;return e*e+i*i+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,i){let s=Math.sin(e)*t;return this.x=s*Math.sin(i),this.y=Math.cos(e)*t,this.z=s*Math.cos(i),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,i){return this.x=t*Math.sin(e),this.y=i,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){let e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){let e=this.setFromMatrixColumn(t,0).length(),i=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=i,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let t=Math.random()*Math.PI*2,e=Math.random()*2-1,i=Math.sqrt(1-e*e);return this.x=i*Math.cos(t),this.y=e,this.z=i*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}};qh.prototype.isVector3=!0;var N=qh,kc=new N,yd=new Un,Yh=class Yh{constructor(t,e,i,s,r,o,a,l,c){this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,i,s,r,o,a,l,c)}set(t,e,i,s,r,o,a,l,c){let h=this.elements;return h[0]=t,h[1]=s,h[2]=a,h[3]=e,h[4]=r,h[5]=l,h[6]=i,h[7]=o,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){let e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],this}extractBasis(t,e,i){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(t){let e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let i=t.elements,s=e.elements,r=this.elements,o=i[0],a=i[3],l=i[6],c=i[1],h=i[4],d=i[7],u=i[2],f=i[5],p=i[8],x=s[0],g=s[3],m=s[6],E=s[1],C=s[4],M=s[7],w=s[2],v=s[5],S=s[8];return r[0]=o*x+a*E+l*w,r[3]=o*g+a*C+l*v,r[6]=o*m+a*M+l*S,r[1]=c*x+h*E+d*w,r[4]=c*g+h*C+d*v,r[7]=c*m+h*M+d*S,r[2]=u*x+f*E+p*w,r[5]=u*g+f*C+p*v,r[8]=u*m+f*M+p*S,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){let t=this.elements,e=t[0],i=t[1],s=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8];return e*o*h-e*a*c-i*r*h+i*a*l+s*r*c-s*o*l}invert(){let t=this.elements,e=t[0],i=t[1],s=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8],d=h*o-a*c,u=a*l-h*r,f=c*r-o*l,p=e*d+i*u+s*f;if(p===0)return this.set(0,0,0,0,0,0,0,0,0);let x=1/p;return t[0]=d*x,t[1]=(s*c-h*i)*x,t[2]=(a*i-s*o)*x,t[3]=u*x,t[4]=(h*e-s*l)*x,t[5]=(s*r-a*e)*x,t[6]=f*x,t[7]=(i*l-c*e)*x,t[8]=(o*e-i*r)*x,this}transpose(){let t,e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){let e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,i,s,r,o,a){let l=Math.cos(r),c=Math.sin(r);return this.set(i*l,i*c,-i*(l*o+c*a)+o+t,-s*c,s*l,-s*(-c*o+l*a)+a+e,0,0,1),this}scale(t,e){return ws("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(zc.makeScale(t,e)),this}rotate(t){return ws("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(zc.makeRotation(-t)),this}translate(t,e){return ws("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(zc.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){let e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,i,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){let e=this.elements,i=t.elements;for(let s=0;s<9;s++)if(e[s]!==i[s])return!1;return!0}fromArray(t,e=0){for(let i=0;i<9;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){let i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t}clone(){return new this.constructor().fromArray(this.elements)}};Yh.prototype.isMatrix3=!0;var Qt=Yh,zc=new Qt,vd=new Qt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Md=new Qt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function vm(){let n={enabled:!0,workingColorSpace:to,spaces:{},convert:function(s,r,o){return this.enabled===!1||r===o||!r||!o||(this.spaces[r].transfer===be&&(s.r=Oi(s.r),s.g=Oi(s.g),s.b=Oi(s.b)),this.spaces[r].primaries!==this.spaces[o].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[o].fromXYZ)),this.spaces[o].transfer===be&&(s.r=cr(s.r),s.g=cr(s.g),s.b=cr(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===zi?eo:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,o){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[o].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return ws("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),n.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return ws("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),n.colorSpaceToWorking(s,r)}},t=[.64,.33,.3,.6,.15,.06],e=[.2126,.7152,.0722],i=[.3127,.329];return n.define({[to]:{primaries:t,whitePoint:i,transfer:eo,toXYZ:vd,fromXYZ:Md,luminanceCoefficients:e,workingColorSpaceConfig:{unpackColorSpace:mn},outputColorSpaceConfig:{drawingBufferColorSpace:mn}},[mn]:{primaries:t,whitePoint:i,transfer:be,toXYZ:vd,fromXYZ:Md,luminanceCoefficients:e,outputColorSpaceConfig:{drawingBufferColorSpace:mn}}}),n}var ge=vm();function Oi(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function cr(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}var Zs,ka=class{static getDataURL(t,e="image/png"){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let i;if(t instanceof HTMLCanvasElement)i=t;else{Zs===void 0&&(Zs=no("canvas")),Zs.width=t.width,Zs.height=t.height;let s=Zs.getContext("2d");t instanceof ImageData?s.putImageData(t,0,0):s.drawImage(t,0,0,t.width,t.height),i=Zs}return i.toDataURL(e)}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){let e=no("canvas");e.width=t.width,e.height=t.height;let i=e.getContext("2d");i.drawImage(t,0,0,t.width,t.height);let s=i.getImageData(0,0,t.width,t.height),r=s.data;for(let o=0;o<r.length;o++)r[o]=Oi(r[o]/255)*255;return i.putImageData(s,0,0),e}else if(t.data){let e=t.data.slice(0);for(let i=0;i<e.length;i++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[i]=Math.floor(Oi(e[i]/255)*255):e[i]=Oi(e[i]);return{data:e,width:t.width,height:t.height}}else return Gt("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}},Mm=0,pr=class{constructor(t=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:Mm++}),this.uuid=wr(),this.data=t,this.dataReady=!0,this.version=0}getSize(t){let e=this.data;return typeof HTMLVideoElement<"u"&&e instanceof HTMLVideoElement?t.set(e.videoWidth,e.videoHeight,0):typeof VideoFrame<"u"&&e instanceof VideoFrame?t.set(e.displayWidth,e.displayHeight,0):e!==null?t.set(e.width,e.height,e.depth||0):t.set(0,0,0),t}set needsUpdate(t){t===!0&&this.version++}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];let i={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let o=0,a=s.length;o<a;o++)s[o].isDataTexture?r.push(Vc(s[o].image)):r.push(Vc(s[o]))}else r=Vc(s);i.url=r}return e||(t.images[this.uuid]=i),i}};function Vc(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?ka.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(Gt("Texture: Unable to serialize Texture."),{})}var bm=0,Hc=new N,Tn=class n extends ni{constructor(t=n.DEFAULT_IMAGE,e=n.DEFAULT_MAPPING,i=vi,s=vi,r=sn,o=us,a=Jn,l=wn,c=n.DEFAULT_ANISOTROPY,h=zi){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:bm++}),this.uuid=wr(),this.name="",this.source=new pr(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=i,this.wrapT=s,this.magFilter=r,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new Zt(0,0),this.repeat=new Zt(1,1),this.center=new Zt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Qt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(Hc).x}get height(){return this.source.getSize(Hc).y}get depth(){return this.source.getSize(Hc).z}get image(){return this.source.data}set image(t){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.normalized=t.normalized,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.renderTarget=t.renderTarget,this.isRenderTargetTexture=t.isRenderTargetTexture,this.isArrayTexture=t.isArrayTexture,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}setValues(t){for(let e in t){let i=t[e];if(i===void 0){Gt(`Texture.setValues(): parameter '${e}' has value of undefined.`);continue}let s=this[e];if(s===void 0){Gt(`Texture.setValues(): property '${e}' does not exist.`);continue}s&&i&&s.isVector2&&i.isVector2||s&&i&&s.isVector3&&i.isVector3||s&&i&&s.isMatrix3&&i.isMatrix3?s.copy(i):this[e]=i}}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];let i={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),e||(t.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==Ch)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case Fa:t.x=t.x-Math.floor(t.x);break;case vi:t.x=t.x<0?0:1;break;case Oa:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case Fa:t.y=t.y-Math.floor(t.y);break;case vi:t.y=t.y<0?0:1;break;case Oa:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}};Tn.DEFAULT_IMAGE=null;Tn.DEFAULT_MAPPING=Ch;Tn.DEFAULT_ANISOTROPY=1;var Zh=class Zh{constructor(t=0,e=0,i=0,s=1){this.x=t,this.y=e,this.z=i,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,i,s){return this.x=t,this.y=e,this.z=i,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("THREE.Vector4: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){let e=this.x,i=this.y,s=this.z,r=this.w,o=t.elements;return this.x=o[0]*e+o[4]*i+o[8]*s+o[12]*r,this.y=o[1]*e+o[5]*i+o[9]*s+o[13]*r,this.z=o[2]*e+o[6]*i+o[10]*s+o[14]*r,this.w=o[3]*e+o[7]*i+o[11]*s+o[15]*r,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);let e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,i,s,r,l=t.elements,c=l[0],h=l[4],d=l[8],u=l[1],f=l[5],p=l[9],x=l[2],g=l[6],m=l[10];if(Math.abs(h-u)<.01&&Math.abs(d-x)<.01&&Math.abs(p-g)<.01){if(Math.abs(h+u)<.1&&Math.abs(d+x)<.1&&Math.abs(p+g)<.1&&Math.abs(c+f+m-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;let C=(c+1)/2,M=(f+1)/2,w=(m+1)/2,v=(h+u)/4,S=(d+x)/4,_=(p+g)/4;return C>M&&C>w?C<.01?(i=0,s=.707106781,r=.707106781):(i=Math.sqrt(C),s=v/i,r=S/i):M>w?M<.01?(i=.707106781,s=0,r=.707106781):(s=Math.sqrt(M),i=v/s,r=_/s):w<.01?(i=.707106781,s=.707106781,r=0):(r=Math.sqrt(w),i=S/r,s=_/r),this.set(i,s,r,e),this}let E=Math.sqrt((g-p)*(g-p)+(d-x)*(d-x)+(u-h)*(u-h));return Math.abs(E)<.001&&(E=1),this.x=(g-p)/E,this.y=(d-x)/E,this.z=(u-h)/E,this.w=Math.acos((c+f+m-1)/2),this}setFromMatrixPosition(t){let e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=fe(this.x,t.x,e.x),this.y=fe(this.y,t.y,e.y),this.z=fe(this.z,t.z,e.z),this.w=fe(this.w,t.w,e.w),this}clampScalar(t,e){return this.x=fe(this.x,t,e),this.y=fe(this.y,t,e),this.z=fe(this.z,t,e),this.w=fe(this.w,t,e),this}clampLength(t,e){let i=this.length();return this.divideScalar(i||1).multiplyScalar(fe(i,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this.w=t.w+(e.w-t.w)*i,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}};Zh.prototype.isVector4=!0;var Ne=Zh,za=class extends ni{constructor(t=1,e=1,i={}){super(),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:sn,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},i),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=i.depth,this.scissor=new Ne(0,0,t,e),this.scissorTest=!1,this.viewport=new Ne(0,0,t,e),this.textures=[];let s={width:t,height:e,depth:i.depth},r=new Tn(s),o=i.count;for(let a=0;a<o;a++)this.textures[a]=r.clone(),this.textures[a].isRenderTargetTexture=!0,this.textures[a].renderTarget=this;this._setTextureOptions(i),this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveColorBuffer=i.resolveColorBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this.storeMultisampledColorBuffer=i.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=i.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=i.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=i.depthTexture,this.samples=i.samples,this.multiview=i.multiview,this.useArrayDepthTexture=i.useArrayDepthTexture}_setTextureOptions(t={}){let e={minFilter:sn,generateMipmaps:!1,flipY:!1,internalFormat:null};t.mapping!==void 0&&(e.mapping=t.mapping),t.wrapS!==void 0&&(e.wrapS=t.wrapS),t.wrapT!==void 0&&(e.wrapT=t.wrapT),t.wrapR!==void 0&&(e.wrapR=t.wrapR),t.magFilter!==void 0&&(e.magFilter=t.magFilter),t.minFilter!==void 0&&(e.minFilter=t.minFilter),t.format!==void 0&&(e.format=t.format),t.type!==void 0&&(e.type=t.type),t.anisotropy!==void 0&&(e.anisotropy=t.anisotropy),t.colorSpace!==void 0&&(e.colorSpace=t.colorSpace),t.flipY!==void 0&&(e.flipY=t.flipY),t.generateMipmaps!==void 0&&(e.generateMipmaps=t.generateMipmaps),t.internalFormat!==void 0&&(e.internalFormat=t.internalFormat);for(let i=0;i<this.textures.length;i++)this.textures[i].setValues(e)}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}set depthTexture(t){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),t!==null&&t.renderTarget===null&&(t.renderTarget=this),this._depthTexture=t}get depthTexture(){return this._depthTexture}setSize(t,e,i=1){if(this.width!==t||this.height!==e||this.depth!==i){this.width=t,this.height=e,this.depth=i;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=t,this.textures[s].image.height=e,this.textures[s].image.depth=i,this.textures[s].isData3DTexture!==!0&&(this.textures[s].isArrayTexture=this.textures[s].image.depth>1);this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let e=0,i=t.textures.length;e<i;e++){this.textures[e]=t.textures[e].clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;let s=Object.assign({},t.textures[e].image);this.textures[e].source=new pr(s)}if(this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveColorBuffer=t.resolveColorBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,this.storeMultisampledColorBuffer=t.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=t.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=t.storeMultisampledStencilBuffer,t.depthTexture!==null)if(t.depthTexture.renderTarget===t){let e=t.depthTexture.clone();e.renderTarget=null,this.depthTexture=e}else this.depthTexture=t.depthTexture;return this.samples=t.samples,this.multiview=t.multiview,this.useArrayDepthTexture=t.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}},En=class extends za{constructor(t=1,e=1,i={}){super(t,e,i),this.isWebGLRenderTarget=!0}},io=class extends Tn{constructor(t=null,e=1,i=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:i,depth:s},this.magFilter=Qe,this.minFilter=Qe,this.wrapR=vi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(t){return super.copy(t),this.wrapR=t.wrapR,this}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}};var Va=class extends Tn{constructor(t=null,e=1,i=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:i,depth:s},this.magFilter=Qe,this.minFilter=Qe,this.wrapR=vi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(t){return super.copy(t),this.wrapR=t.wrapR,this}};var cl=class cl{constructor(t,e,i,s,r,o,a,l,c,h,d,u,f,p,x,g){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,i,s,r,o,a,l,c,h,d,u,f,p,x,g)}set(t,e,i,s,r,o,a,l,c,h,d,u,f,p,x,g){let m=this.elements;return m[0]=t,m[4]=e,m[8]=i,m[12]=s,m[1]=r,m[5]=o,m[9]=a,m[13]=l,m[2]=c,m[6]=h,m[10]=d,m[14]=u,m[3]=f,m[7]=p,m[11]=x,m[15]=g,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new cl().fromArray(this.elements)}copy(t){let e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],e[9]=i[9],e[10]=i[10],e[11]=i[11],e[12]=i[12],e[13]=i[13],e[14]=i[14],e[15]=i[15],this}copyPosition(t){let e=this.elements,i=t.elements;return e[12]=i[12],e[13]=i[13],e[14]=i[14],this}setFromMatrix3(t){let e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,i){return this.determinantAffine()===0?(t.set(1,0,0),e.set(0,1,0),i.set(0,0,1),this):(t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this)}makeBasis(t,e,i){return this.set(t.x,e.x,i.x,0,t.y,e.y,i.y,0,t.z,e.z,i.z,0,0,0,0,1),this}extractRotation(t){if(t.determinantAffine()===0)return this.identity();let e=this.elements,i=t.elements,s=1/Js.setFromMatrixColumn(t,0).length(),r=1/Js.setFromMatrixColumn(t,1).length(),o=1/Js.setFromMatrixColumn(t,2).length();return e[0]=i[0]*s,e[1]=i[1]*s,e[2]=i[2]*s,e[3]=0,e[4]=i[4]*r,e[5]=i[5]*r,e[6]=i[6]*r,e[7]=0,e[8]=i[8]*o,e[9]=i[9]*o,e[10]=i[10]*o,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){let e=this.elements,i=t.x,s=t.y,r=t.z,o=Math.cos(i),a=Math.sin(i),l=Math.cos(s),c=Math.sin(s),h=Math.cos(r),d=Math.sin(r);if(t.order==="XYZ"){let u=o*h,f=o*d,p=a*h,x=a*d;e[0]=l*h,e[4]=-l*d,e[8]=c,e[1]=f+p*c,e[5]=u-x*c,e[9]=-a*l,e[2]=x-u*c,e[6]=p+f*c,e[10]=o*l}else if(t.order==="YXZ"){let u=l*h,f=l*d,p=c*h,x=c*d;e[0]=u+x*a,e[4]=p*a-f,e[8]=o*c,e[1]=o*d,e[5]=o*h,e[9]=-a,e[2]=f*a-p,e[6]=x+u*a,e[10]=o*l}else if(t.order==="ZXY"){let u=l*h,f=l*d,p=c*h,x=c*d;e[0]=u-x*a,e[4]=-o*d,e[8]=p+f*a,e[1]=f+p*a,e[5]=o*h,e[9]=x-u*a,e[2]=-o*c,e[6]=a,e[10]=o*l}else if(t.order==="ZYX"){let u=o*h,f=o*d,p=a*h,x=a*d;e[0]=l*h,e[4]=p*c-f,e[8]=u*c+x,e[1]=l*d,e[5]=x*c+u,e[9]=f*c-p,e[2]=-c,e[6]=a*l,e[10]=o*l}else if(t.order==="YZX"){let u=o*l,f=o*c,p=a*l,x=a*c;e[0]=l*h,e[4]=x-u*d,e[8]=p*d+f,e[1]=d,e[5]=o*h,e[9]=-a*h,e[2]=-c*h,e[6]=f*d+p,e[10]=u-x*d}else if(t.order==="XZY"){let u=o*l,f=o*c,p=a*l,x=a*c;e[0]=l*h,e[4]=-d,e[8]=c*h,e[1]=u*d+x,e[5]=o*h,e[9]=f*d-p,e[2]=p*d-f,e[6]=a*h,e[10]=x*d+u}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(Sm,t,Tm)}lookAt(t,e,i){let s=this.elements;return Ln.subVectors(t,e),Ln.lengthSq()===0&&(Ln.z=1),Ln.normalize(),Ji.crossVectors(i,Ln),Ji.lengthSq()===0&&(Math.abs(i.z)===1?Ln.x+=1e-4:Ln.z+=1e-4,Ln.normalize(),Ji.crossVectors(i,Ln)),Ji.normalize(),na.crossVectors(Ln,Ji),s[0]=Ji.x,s[4]=na.x,s[8]=Ln.x,s[1]=Ji.y,s[5]=na.y,s[9]=Ln.y,s[2]=Ji.z,s[6]=na.z,s[10]=Ln.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let i=t.elements,s=e.elements,r=this.elements,o=i[0],a=i[4],l=i[8],c=i[12],h=i[1],d=i[5],u=i[9],f=i[13],p=i[2],x=i[6],g=i[10],m=i[14],E=i[3],C=i[7],M=i[11],w=i[15],v=s[0],S=s[4],_=s[8],T=s[12],R=s[1],P=s[5],D=s[9],k=s[13],L=s[2],z=s[6],W=s[10],J=s[14],et=s[3],O=s[7],q=s[11],j=s[15];return r[0]=o*v+a*R+l*L+c*et,r[4]=o*S+a*P+l*z+c*O,r[8]=o*_+a*D+l*W+c*q,r[12]=o*T+a*k+l*J+c*j,r[1]=h*v+d*R+u*L+f*et,r[5]=h*S+d*P+u*z+f*O,r[9]=h*_+d*D+u*W+f*q,r[13]=h*T+d*k+u*J+f*j,r[2]=p*v+x*R+g*L+m*et,r[6]=p*S+x*P+g*z+m*O,r[10]=p*_+x*D+g*W+m*q,r[14]=p*T+x*k+g*J+m*j,r[3]=E*v+C*R+M*L+w*et,r[7]=E*S+C*P+M*z+w*O,r[11]=E*_+C*D+M*W+w*q,r[15]=E*T+C*k+M*J+w*j,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){let t=this.elements,e=t[0],i=t[4],s=t[8],r=t[12],o=t[1],a=t[5],l=t[9],c=t[13],h=t[2],d=t[6],u=t[10],f=t[14],p=t[3],x=t[7],g=t[11],m=t[15],E=l*f-c*u,C=a*f-c*d,M=a*u-l*d,w=o*f-c*h,v=o*u-l*h,S=o*d-a*h;return e*(x*E-g*C+m*M)-i*(p*E-g*w+m*v)+s*(p*C-x*w+m*S)-r*(p*M-x*v+g*S)}determinantAffine(){let t=this.elements,e=t[0],i=t[4],s=t[8],r=t[1],o=t[5],a=t[9],l=t[2],c=t[6],h=t[10];return e*(o*h-a*c)-i*(r*h-a*l)+s*(r*c-o*l)}transpose(){let t=this.elements,e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,i){let s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=i),this}invert(){let t=this.elements,e=t[0],i=t[1],s=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8],d=t[9],u=t[10],f=t[11],p=t[12],x=t[13],g=t[14],m=t[15],E=e*a-i*o,C=e*l-s*o,M=e*c-r*o,w=i*l-s*a,v=i*c-r*a,S=s*c-r*l,_=h*x-d*p,T=h*g-u*p,R=h*m-f*p,P=d*g-u*x,D=d*m-f*x,k=u*m-f*g,L=E*k-C*D+M*P+w*R-v*T+S*_;if(L===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let z=1/L;return t[0]=(a*k-l*D+c*P)*z,t[1]=(s*D-i*k-r*P)*z,t[2]=(x*S-g*v+m*w)*z,t[3]=(u*v-d*S-f*w)*z,t[4]=(l*R-o*k-c*T)*z,t[5]=(e*k-s*R+r*T)*z,t[6]=(g*M-p*S-m*C)*z,t[7]=(h*S-u*M+f*C)*z,t[8]=(o*D-a*R+c*_)*z,t[9]=(i*R-e*D-r*_)*z,t[10]=(p*v-x*M+m*E)*z,t[11]=(d*M-h*v-f*E)*z,t[12]=(a*T-o*P-l*_)*z,t[13]=(e*P-i*T+s*_)*z,t[14]=(x*C-p*w-g*E)*z,t[15]=(h*w-d*C+u*E)*z,this}scale(t){let e=this.elements,i=t.x,s=t.y,r=t.z;return e[0]*=i,e[4]*=s,e[8]*=r,e[1]*=i,e[5]*=s,e[9]*=r,e[2]*=i,e[6]*=s,e[10]*=r,e[3]*=i,e[7]*=s,e[11]*=r,this}getMaxScaleOnAxis(){let t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],i=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,i,s))}makeTranslation(t,e,i){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,i,0,0,0,1),this}makeRotationX(t){let e=Math.cos(t),i=Math.sin(t);return this.set(1,0,0,0,0,e,-i,0,0,i,e,0,0,0,0,1),this}makeRotationY(t){let e=Math.cos(t),i=Math.sin(t);return this.set(e,0,i,0,0,1,0,0,-i,0,e,0,0,0,0,1),this}makeRotationZ(t){let e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,0,i,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){let i=Math.cos(e),s=Math.sin(e),r=1-i,o=t.x,a=t.y,l=t.z,c=r*o,h=r*a;return this.set(c*o+i,c*a-s*l,c*l+s*a,0,c*a+s*l,h*a+i,h*l-s*o,0,c*l-s*a,h*l+s*o,r*l*l+i,0,0,0,0,1),this}makeScale(t,e,i){return this.set(t,0,0,0,0,e,0,0,0,0,i,0,0,0,0,1),this}makeShear(t,e,i,s,r,o){return this.set(1,i,r,0,t,1,o,0,e,s,1,0,0,0,0,1),this}compose(t,e,i){let s=this.elements,r=e._x,o=e._y,a=e._z,l=e._w,c=r+r,h=o+o,d=a+a,u=r*c,f=r*h,p=r*d,x=o*h,g=o*d,m=a*d,E=l*c,C=l*h,M=l*d,w=i.x,v=i.y,S=i.z;return s[0]=(1-(x+m))*w,s[1]=(f+M)*w,s[2]=(p-C)*w,s[3]=0,s[4]=(f-M)*v,s[5]=(1-(u+m))*v,s[6]=(g+E)*v,s[7]=0,s[8]=(p+C)*S,s[9]=(g-E)*S,s[10]=(1-(u+x))*S,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,i){let s=this.elements;t.x=s[12],t.y=s[13],t.z=s[14];let r=this.determinantAffine();if(r===0)return i.set(1,1,1),e.identity(),this;let o=Js.set(s[0],s[1],s[2]).length(),a=Js.set(s[4],s[5],s[6]).length(),l=Js.set(s[8],s[9],s[10]).length();r<0&&(o=-o),jn.copy(this);let c=1/o,h=1/a,d=1/l;return jn.elements[0]*=c,jn.elements[1]*=c,jn.elements[2]*=c,jn.elements[4]*=h,jn.elements[5]*=h,jn.elements[6]*=h,jn.elements[8]*=d,jn.elements[9]*=d,jn.elements[10]*=d,e.setFromRotationMatrix(jn),i.x=o,i.y=a,i.z=l,this}makePerspective(t,e,i,s,r,o,a=ei,l=!1){let c=this.elements,h=2*r/(e-t),d=2*r/(i-s),u=(e+t)/(e-t),f=(i+s)/(i-s),p,x;if(l)p=r/(o-r),x=o*r/(o-r);else if(a===ei)p=-(o+r)/(o-r),x=-2*o*r/(o-r);else if(a===ur)p=-o/(o-r),x=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return c[0]=h,c[4]=0,c[8]=u,c[12]=0,c[1]=0,c[5]=d,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=p,c[14]=x,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,e,i,s,r,o,a=ei,l=!1){let c=this.elements,h=2/(e-t),d=2/(i-s),u=-(e+t)/(e-t),f=-(i+s)/(i-s),p,x;if(l)p=1/(o-r),x=o/(o-r);else if(a===ei)p=-2/(o-r),x=-(o+r)/(o-r);else if(a===ur)p=-1/(o-r),x=-r/(o-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return c[0]=h,c[4]=0,c[8]=0,c[12]=u,c[1]=0,c[5]=d,c[9]=0,c[13]=f,c[2]=0,c[6]=0,c[10]=p,c[14]=x,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){let e=this.elements,i=t.elements;for(let s=0;s<16;s++)if(e[s]!==i[s])return!1;return!0}fromArray(t,e=0){for(let i=0;i<16;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){let i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t[e+9]=i[9],t[e+10]=i[10],t[e+11]=i[11],t[e+12]=i[12],t[e+13]=i[13],t[e+14]=i[14],t[e+15]=i[15],t}};cl.prototype.isMatrix4=!0;var De=cl,Js=new N,jn=new De,Sm=new N(0,0,0),Tm=new N(1,1,1),Ji=new N,na=new N,Ln=new N,bd=new De,Sd=new Un,Bi=class n{constructor(t=0,e=0,i=0,s=n.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=i,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,i,s=this._order){return this._x=t,this._y=e,this._z=i,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,i=!0){let s=t.elements,r=s[0],o=s[4],a=s[8],l=s[1],c=s[5],h=s[9],d=s[2],u=s[6],f=s[10];switch(e){case"XYZ":this._y=Math.asin(fe(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-h,f),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(u,c),this._z=0);break;case"YXZ":this._x=Math.asin(-fe(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(a,f),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-d,r),this._z=0);break;case"ZXY":this._x=Math.asin(fe(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(-d,f),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-fe(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(u,f),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(fe(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-d,r)):(this._x=0,this._y=Math.atan2(a,f));break;case"XZY":this._z=Math.asin(-fe(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(u,c),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-h,f),this._y=0);break;default:Gt("Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,i===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,i){return bd.makeRotationFromQuaternion(t),this.setFromRotationMatrix(bd,e,i)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return Sd.setFromEuler(this),this.setFromQuaternion(Sd,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};Bi.DEFAULT_ORDER="XYZ";var so=class{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}},Em=0,Td=new N,$s=new Un,Pi=new De,ia=new N,Yr=new N,wm=new N,Am=new Un,Ed=new N(1,0,0),wd=new N(0,1,0),Ad=new N(0,0,1),Rd={type:"added"},Rm={type:"removed"},Ks={type:"childadded",child:null},Gc={type:"childremoved",child:null},tn=class n extends ni{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Em++}),this.uuid=wr(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=n.DEFAULT_UP.clone();let t=new N,e=new Bi,i=new Un,s=new N(1,1,1);function r(){i.setFromEuler(e,!1)}function o(){e.setFromQuaternion(i,void 0,!1)}e._onChange(r),i._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new De},normalMatrix:{value:new Qt}}),this.matrix=new De,this.matrixWorld=new De,this.matrixAutoUpdate=n.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=n.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new so,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return $s.setFromAxisAngle(t,e),this.quaternion.multiply($s),this}rotateOnWorldAxis(t,e){return $s.setFromAxisAngle(t,e),this.quaternion.premultiply($s),this}rotateX(t){return this.rotateOnAxis(Ed,t)}rotateY(t){return this.rotateOnAxis(wd,t)}rotateZ(t){return this.rotateOnAxis(Ad,t)}translateOnAxis(t,e){return Td.copy(t).applyQuaternion(this.quaternion),this.position.add(Td.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(Ed,t)}translateY(t){return this.translateOnAxis(wd,t)}translateZ(t){return this.translateOnAxis(Ad,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(Pi.copy(this.matrixWorld).invert())}lookAt(t,e,i){t.isVector3?ia.copy(t):ia.set(t,e,i);let s=this.parent;this.updateWorldMatrix(!0,!1),Yr.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Pi.lookAt(Yr,ia,this.up):Pi.lookAt(ia,Yr,this.up),this.quaternion.setFromRotationMatrix(Pi),s&&(Pi.extractRotation(s.matrixWorld),$s.setFromRotationMatrix(Pi),this.quaternion.premultiply($s.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(Jt("Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(Rd),Ks.child=t,this.dispatchEvent(Ks),Ks.child=null):Jt("Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}let e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(Rm),Gc.child=t,this.dispatchEvent(Gc),Gc.child=null),this}removeFromParent(){let t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),Pi.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),Pi.multiply(t.parent.matrixWorld)),t.applyMatrix4(Pi),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(Rd),Ks.child=t,this.dispatchEvent(Ks),Ks.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let i=0,s=this.children.length;i<s;i++){let o=this.children[i].getObjectByProperty(t,e);if(o!==void 0)return o}}getObjectsByProperty(t,e,i=[]){this[t]===e&&i.push(this);let s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].getObjectsByProperty(t,e,i);return i}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Yr,t,wm),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Yr,Am,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);let e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}intersectsFrustum(){}traverse(t){t(this);let e=this.children;for(let i=0,s=e.length;i<s;i++)e[i].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);let e=this.children;for(let i=0,s=e.length;i<s;i++)e[i].traverseVisible(t)}traverseAncestors(t){let e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);let t=this.pivot;if(t!==null){let e=t.x,i=t.y,s=t.z,r=this.matrix.elements;r[12]+=e-r[0]*e-r[4]*i-r[8]*s,r[13]+=i-r[1]*e-r[5]*i-r[9]*s,r[14]+=s-r[2]*e-r[6]*i-r[10]*s}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);let e=this.children;for(let i=0,s=e.length;i<s;i++)e[i].updateMatrixWorld(t)}updateWorldMatrix(t,e,i=!1){let s=this.parent;if(t===!0&&s!==null&&s.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||i)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,i=!0),e===!0){let r=this.children;for(let o=0,a=r.length;o<a;o++)r[o].updateWorldMatrix(!1,!0,i)}}toJSON(t){let e=t===void 0||typeof t=="string",i={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});let s={};s.uuid=this.uuid,s.type=this.type,s.name=this.name,s.castShadow=this.castShadow,s.receiveShadow=this.receiveShadow,s.visible=this.visible,s.frustumCulled=this.frustumCulled,s.renderOrder=this.renderOrder,s.static=this.static,s.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.pivot!==null&&(s.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(s.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(s.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(a=>({...a,boundingBox:a.boundingBox?a.boundingBox.toJSON():void 0,boundingSphere:a.boundingSphere?a.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(a=>({...a})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(t),s.indirectTexture=this._indirectTexture.toJSON(t),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(t.geometries,this.geometry);let a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){let l=a.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){let d=l[c];r(t.shapes,d)}else r(t.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(r(t.materials,this.material[l]));s.material=a}else s.material=r(t.materials,this.material);if(this.children.length>0){s.children=[];for(let a=0;a<this.children.length;a++)s.children.push(this.children[a].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let a=0;a<this.animations.length;a++){let l=this.animations[a];s.animations.push(r(t.animations,l))}}if(e){let a=o(t.geometries),l=o(t.materials),c=o(t.textures),h=o(t.images),d=o(t.shapes),u=o(t.skeletons),f=o(t.animations),p=o(t.nodes);a.length>0&&(i.geometries=a),l.length>0&&(i.materials=l),c.length>0&&(i.textures=c),h.length>0&&(i.images=h),d.length>0&&(i.shapes=d),u.length>0&&(i.skeletons=u),f.length>0&&(i.animations=f),p.length>0&&(i.nodes=p)}return i.object=s,i;function o(a){let l=[];for(let c in a){let h=a[c];delete h.metadata,l.push(h)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.pivot=t.pivot!==null?t.pivot.clone():null,this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.static=t.static,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let i=0;i<t.children.length;i++){let s=t.children[i];this.add(s.clone())}return this}dispose(){this.dispatchEvent({type:"dispose"})}};tn.DEFAULT_UP=new N(0,1,0);tn.DEFAULT_MATRIX_AUTO_UPDATE=!0;tn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var Fi=class extends tn{constructor(){super(),this.isGroup=!0,this.type="Group"}},Cm={type:"move"},mr=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Fi,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Fi,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new N,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new N),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Fi,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new N,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new N,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){let e=this._hand;if(e)for(let i of t.hand.values())this._getHandJoint(e,i)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,i){let s=null,r=null,o=null,a=this._targetRay,l=this._grip,c=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(c&&t.hand){o=!0;for(let x of t.hand.values()){let g=e.getJointPose(x,i),m=this._getHandJoint(c,x);g!==null&&(m.matrix.fromArray(g.transform.matrix),m.matrix.decompose(m.position,m.rotation,m.scale),m.matrixWorldNeedsUpdate=!0,m.jointRadius=g.radius),m.visible=g!==null}let h=c.joints["index-finger-tip"],d=c.joints["thumb-tip"],u=h.position.distanceTo(d.position),f=.02,p=.005;c.inputState.pinching&&u>f+p?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!c.inputState.pinching&&u<=f-p&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,i),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1,l.eventsEnabled&&l.dispatchEvent({type:"gripUpdated",data:t,target:this})));a!==null&&(s=e.getPose(t.targetRaySpace,i),s===null&&r!==null&&(s=r),s!==null&&(a.matrix.fromArray(s.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,s.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(s.linearVelocity)):a.hasLinearVelocity=!1,s.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(s.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(Cm)))}return a!==null&&(a.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){let i=new Fi;i.matrixAutoUpdate=!1,i.visible=!1,t.joints[e.jointName]=i,t.add(i)}return t.joints[e.jointName]}},Pf={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},$i={h:0,s:0,l:0},sa={h:0,s:0,l:0};function Wc(n,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?n+(t-n)*6*e:e<1/2?t:e<2/3?n+(t-n)*6*(2/3-e):n}var ae=class{constructor(t,e,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,i)}set(t,e,i){if(e===void 0&&i===void 0){let s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,i);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=mn){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,ge.colorSpaceToWorking(this,e),this}setRGB(t,e,i,s=ge.workingColorSpace){return this.r=t,this.g=e,this.b=i,ge.colorSpaceToWorking(this,s),this}setHSL(t,e,i,s=ge.workingColorSpace){if(t=kh(t,1),e=fe(e,0,1),i=fe(i,0,1),e===0)this.r=this.g=this.b=i;else{let r=i<=.5?i*(1+e):i+e-i*e,o=2*i-r;this.r=Wc(o,r,t+1/3),this.g=Wc(o,r,t),this.b=Wc(o,r,t-1/3)}return ge.colorSpaceToWorking(this,s),this}setStyle(t,e=mn){function i(r){r!==void 0&&parseFloat(r)<1&&Gt("Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let r,o=s[1],a=s[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:Gt("Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){let r=s[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(o===6)return this.setHex(parseInt(r,16),e);Gt("Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=mn){let i=Pf[t.toLowerCase()];return i!==void 0?this.setHex(i,e):Gt("Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=Oi(t.r),this.g=Oi(t.g),this.b=Oi(t.b),this}copyLinearToSRGB(t){return this.r=cr(t.r),this.g=cr(t.g),this.b=cr(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=mn){return ge.workingToColorSpace(an.copy(this),t),Math.round(fe(an.r*255,0,255))*65536+Math.round(fe(an.g*255,0,255))*256+Math.round(fe(an.b*255,0,255))}getHexString(t=mn){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=ge.workingColorSpace){ge.workingToColorSpace(an.copy(this),e);let i=an.r,s=an.g,r=an.b,o=Math.max(i,s,r),a=Math.min(i,s,r),l,c,h=(a+o)/2;if(a===o)l=0,c=0;else{let d=o-a;switch(c=h<=.5?d/(o+a):d/(2-o-a),o){case i:l=(s-r)/d+(s<r?6:0);break;case s:l=(r-i)/d+2;break;case r:l=(i-s)/d+4;break}l/=6}return t.h=l,t.s=c,t.l=h,t}getRGB(t,e=ge.workingColorSpace){return ge.workingToColorSpace(an.copy(this),e),t.r=an.r,t.g=an.g,t.b=an.b,t}getStyle(t=mn){ge.workingToColorSpace(an.copy(this),t);let e=an.r,i=an.g,s=an.b;return t!==mn?`color(${t} ${e.toFixed(3)} ${i.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(i*255)},${Math.round(s*255)})`}offsetHSL(t,e,i){return this.getHSL($i),this.setHSL($i.h+t,$i.s+e,$i.l+i)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,i){return this.r=t.r+(e.r-t.r)*i,this.g=t.g+(e.g-t.g)*i,this.b=t.b+(e.b-t.b)*i,this}lerpHSL(t,e){this.getHSL($i),t.getHSL(sa);let i=jr($i.h,sa.h,e),s=jr($i.s,sa.s,e),r=jr($i.l,sa.l,e);return this.setHSL(i,s,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){let e=this.r,i=this.g,s=this.b,r=t.elements;return this.r=r[0]*e+r[3]*i+r[6]*s,this.g=r[1]*e+r[4]*i+r[7]*s,this.b=r[2]*e+r[5]*i+r[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},an=new ae;ae.NAMES=Pf;var ro=class extends tn{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Bi,this.environmentIntensity=1,this.environmentRotation=new Bi,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){let e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),e.object.backgroundBlurriness=this.backgroundBlurriness,e.object.backgroundIntensity=this.backgroundIntensity,e.object.backgroundRotation=this.backgroundRotation.toArray(),e.object.environmentIntensity=this.environmentIntensity,e.object.environmentRotation=this.environmentRotation.toArray(),e}},Qn=new N,Ii=new N,Xc=new N,Li=new N,js=new N,Qs=new N,Cd=new N,qc=new N,Yc=new N,Zc=new N,Jc=new Ne,$c=new Ne,Kc=new Ne,Ui=class n{constructor(t=new N,e=new N,i=new N){this.a=t,this.b=e,this.c=i}static getNormal(t,e,i,s){s.subVectors(i,e),Qn.subVectors(t,e),s.cross(Qn);let r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(t,e,i,s,r){Qn.subVectors(s,e),Ii.subVectors(i,e),Xc.subVectors(t,e);let o=Qn.dot(Qn),a=Qn.dot(Ii),l=Qn.dot(Xc),c=Ii.dot(Ii),h=Ii.dot(Xc),d=o*c-a*a;if(d===0)return r.set(0,0,0),null;let u=1/d,f=(c*l-a*h)*u,p=(o*h-a*l)*u;return r.set(1-f-p,p,f)}static containsPoint(t,e,i,s){return this.getBarycoord(t,e,i,s,Li)===null?!1:Li.x>=0&&Li.y>=0&&Li.x+Li.y<=1}static getInterpolation(t,e,i,s,r,o,a,l){return this.getBarycoord(t,e,i,s,Li)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,Li.x),l.addScaledVector(o,Li.y),l.addScaledVector(a,Li.z),l)}static getInterpolatedAttribute(t,e,i,s,r,o){return Jc.setScalar(0),$c.setScalar(0),Kc.setScalar(0),Jc.fromBufferAttribute(t,e),$c.fromBufferAttribute(t,i),Kc.fromBufferAttribute(t,s),o.setScalar(0),o.addScaledVector(Jc,r.x),o.addScaledVector($c,r.y),o.addScaledVector(Kc,r.z),o}static isFrontFacing(t,e,i,s){return Qn.subVectors(i,e),Ii.subVectors(t,e),Qn.cross(Ii).dot(s)<0}set(t,e,i){return this.a.copy(t),this.b.copy(e),this.c.copy(i),this}setFromPointsAndIndices(t,e,i,s){return this.a.copy(t[e]),this.b.copy(t[i]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,i,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,i),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return Qn.subVectors(this.c,this.b),Ii.subVectors(this.a,this.b),Qn.cross(Ii).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return n.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return n.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,i,s,r){return n.getInterpolation(t,this.a,this.b,this.c,e,i,s,r)}containsPoint(t){return n.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return n.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){let i=this.a,s=this.b,r=this.c,o,a;js.subVectors(s,i),Qs.subVectors(r,i),qc.subVectors(t,i);let l=js.dot(qc),c=Qs.dot(qc);if(l<=0&&c<=0)return e.copy(i);Yc.subVectors(t,s);let h=js.dot(Yc),d=Qs.dot(Yc);if(h>=0&&d<=h)return e.copy(s);let u=l*d-h*c;if(u<=0&&l>=0&&h<=0)return o=l/(l-h),e.copy(i).addScaledVector(js,o);Zc.subVectors(t,r);let f=js.dot(Zc),p=Qs.dot(Zc);if(p>=0&&f<=p)return e.copy(r);let x=f*c-l*p;if(x<=0&&c>=0&&p<=0)return a=c/(c-p),e.copy(i).addScaledVector(Qs,a);let g=h*p-f*d;if(g<=0&&d-h>=0&&f-p>=0)return Cd.subVectors(r,s),a=(d-h)/(d-h+(f-p)),e.copy(s).addScaledVector(Cd,a);let m=1/(g+x+u);return o=x*m,a=u*m,e.copy(i).addScaledVector(js,o).addScaledVector(Qs,a)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}},ts=class{constructor(t=new N(1/0,1/0,1/0),e=new N(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e+=3)this.expandByPoint(ti.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,i=t.count;e<i;e++)this.expandByPoint(ti.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){let i=ti.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(i),this.max.copy(t).add(i),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);let i=t.geometry;if(i!==void 0){let r=i.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let o=0,a=r.count;o<a;o++)t.isMesh===!0?t.getVertexPosition(o,ti):ti.fromBufferAttribute(r,o),ti.applyMatrix4(t.matrixWorld),this.expandByPoint(ti);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),ra.copy(t.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),ra.copy(i.boundingBox)),ra.applyMatrix4(t.matrixWorld),this.union(ra)}let s=t.children;for(let r=0,o=s.length;r<o;r++)this.expandByObject(s[r],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,ti),ti.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,i;return t.normal.x>0?(e=t.normal.x*this.min.x,i=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,i=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,i+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,i+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,i+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,i+=t.normal.z*this.min.z),e<=-t.constant&&i>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(Zr),oa.subVectors(this.max,Zr),tr.subVectors(t.a,Zr),er.subVectors(t.b,Zr),nr.subVectors(t.c,Zr),Ki.subVectors(er,tr),ji.subVectors(nr,er),bs.subVectors(tr,nr);let e=[0,-Ki.z,Ki.y,0,-ji.z,ji.y,0,-bs.z,bs.y,Ki.z,0,-Ki.x,ji.z,0,-ji.x,bs.z,0,-bs.x,-Ki.y,Ki.x,0,-ji.y,ji.x,0,-bs.y,bs.x,0];return!jc(e,tr,er,nr,oa)||(e=[1,0,0,0,1,0,0,0,1],!jc(e,tr,er,nr,oa))?!1:(aa.crossVectors(Ki,ji),e=[aa.x,aa.y,aa.z],jc(e,tr,er,nr,oa))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,ti).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(ti).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(Di[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),Di[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),Di[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),Di[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),Di[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),Di[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),Di[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),Di[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(Di),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(t){return this.min.fromArray(t.min),this.max.fromArray(t.max),this}},Di=[new N,new N,new N,new N,new N,new N,new N,new N],ti=new N,ra=new ts,tr=new N,er=new N,nr=new N,Ki=new N,ji=new N,bs=new N,Zr=new N,oa=new N,aa=new N,Ss=new N;function jc(n,t,e,i,s){for(let r=0,o=n.length-3;r<=o;r+=3){Ss.fromArray(n,r);let a=s.x*Math.abs(Ss.x)+s.y*Math.abs(Ss.y)+s.z*Math.abs(Ss.z),l=t.dot(Ss),c=e.dot(Ss),h=i.dot(Ss);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>a)return!1}return!0}var We=new N,la=new Zt,Pm=0,Yn=class extends ni{constructor(t,e,i=!1){if(super(),Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Pm++}),this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=i,this.usage=Ef,this.updateRanges=[],this.gpuType=ai,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,i){t*=this.itemSize,i*=e.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[t+s]=e.array[i+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,i=this.count;e<i;e++)la.fromBufferAttribute(this,e),la.applyMatrix3(t),this.setXY(e,la.x,la.y);else if(this.itemSize===3)for(let e=0,i=this.count;e<i;e++)We.fromBufferAttribute(this,e),We.applyMatrix3(t),this.setXYZ(e,We.x,We.y,We.z);return this}applyMatrix4(t){for(let e=0,i=this.count;e<i;e++)We.fromBufferAttribute(this,e),We.applyMatrix4(t),this.setXYZ(e,We.x,We.y,We.z);return this}applyNormalMatrix(t){for(let e=0,i=this.count;e<i;e++)We.fromBufferAttribute(this,e),We.applyNormalMatrix(t),this.setXYZ(e,We.x,We.y,We.z);return this}transformDirection(t){for(let e=0,i=this.count;e<i;e++)We.fromBufferAttribute(this,e),We.transformDirection(t),this.setXYZ(e,We.x,We.y,We.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let i=this.array[t*this.itemSize+e];return this.normalized&&(i=ar(i,this.array)),i}setComponent(t,e,i){return this.normalized&&(i=pn(i,this.array)),this.array[t*this.itemSize+e]=i,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=ar(e,this.array)),e}setX(t,e){return this.normalized&&(e=pn(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=ar(e,this.array)),e}setY(t,e){return this.normalized&&(e=pn(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=ar(e,this.array)),e}setZ(t,e){return this.normalized&&(e=pn(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=ar(e,this.array)),e}setW(t,e){return this.normalized&&(e=pn(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,i){return t*=this.itemSize,this.normalized&&(e=pn(e,this.array),i=pn(i,this.array)),this.array[t+0]=e,this.array[t+1]=i,this}setXYZ(t,e,i,s){return t*=this.itemSize,this.normalized&&(e=pn(e,this.array),i=pn(i,this.array),s=pn(s,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=s,this}setXYZW(t,e,i,s,r){return t*=this.itemSize,this.normalized&&(e=pn(e,this.array),i=pn(i,this.array),s=pn(s,this.array),r=pn(r,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=s,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return t.name=this.name,t.usage=this.usage,t.gpuType=this.gpuType,t}dispose(){this.dispatchEvent({type:"dispose"})}};var oo=class extends Yn{constructor(t,e,i){super(new Uint16Array(t),e,i)}};var ao=class extends Yn{constructor(t,e,i){super(new Uint32Array(t),e,i)}};var Pe=class extends Yn{constructor(t,e,i){super(new Float32Array(t),e,i)}},Im=new ts,Jr=new N,Qc=new N,As=class{constructor(t=new N,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){let i=this.center;e!==void 0?i.copy(e):Im.setFromPoints(t).getCenter(i);let s=0;for(let r=0,o=t.length;r<o;r++)s=Math.max(s,i.distanceToSquared(t[r]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){let e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){let i=this.center.distanceToSquared(t);return e.copy(t),i>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;Jr.subVectors(t,this.center);let e=Jr.lengthSq();if(e>this.radius*this.radius){let i=Math.sqrt(e),s=(i-this.radius)*.5;this.center.addScaledVector(Jr,s/i),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(Qc.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(Jr.copy(t.center).add(Qc)),this.expandByPoint(Jr.copy(t.center).sub(Qc))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(t){return this.radius=t.radius,this.center.fromArray(t.center),this}},Lm=0,qn=new De,th=new tn,ir=new N,Dn=new ts,$r=new ts,je=new N,Xe=class n extends ni{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Lm++}),this.uuid=wr(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(nm(t)?ao:oo)(t,1):this.index=t,this}setIndirect(t,e=0){return this.indirect=t,this.indirectOffset=e,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,i=0){this.groups.push({start:t,count:e,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){let e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);let i=this.attributes.normal;if(i!==void 0){let r=new Qt().getNormalMatrix(t);i.applyNormalMatrix(r),i.needsUpdate=!0}let s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(t){return qn.makeRotationFromQuaternion(t),this.applyMatrix4(qn),this}rotateX(t){return qn.makeRotationX(t),this.applyMatrix4(qn),this}rotateY(t){return qn.makeRotationY(t),this.applyMatrix4(qn),this}rotateZ(t){return qn.makeRotationZ(t),this.applyMatrix4(qn),this}translate(t,e,i){return qn.makeTranslation(t,e,i),this.applyMatrix4(qn),this}scale(t,e,i){return qn.makeScale(t,e,i),this.applyMatrix4(qn),this}lookAt(t){return th.lookAt(t),th.updateMatrix(),this.applyMatrix4(th.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(ir).negate(),this.translate(ir.x,ir.y,ir.z),this}setFromPoints(t){let e=this.getAttribute("position");if(e===void 0){let i=[];for(let s=0,r=t.length;s<r;s++){let o=t[s];i.push(o.x,o.y,o.z||0)}this.setAttribute("position",new Pe(i,3))}else{let i=Math.min(t.length,e.count);for(let s=0;s<i;s++){let r=t[s];e.setXYZ(s,r.x,r.y,r.z||0)}t.length>e.count&&Gt("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new ts);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){Jt("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new N(-1/0,-1/0,-1/0),new N(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let i=0,s=e.length;i<s;i++){let r=e[i];Dn.setFromBufferAttribute(r),this.morphTargetsRelative?(je.addVectors(this.boundingBox.min,Dn.min),this.boundingBox.expandByPoint(je),je.addVectors(this.boundingBox.max,Dn.max),this.boundingBox.expandByPoint(je)):(this.boundingBox.expandByPoint(Dn.min),this.boundingBox.expandByPoint(Dn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&Jt('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new As);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){Jt("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new N,1/0);return}if(t){let i=this.boundingSphere.center;if(Dn.setFromBufferAttribute(t),e)for(let r=0,o=e.length;r<o;r++){let a=e[r];$r.setFromBufferAttribute(a),this.morphTargetsRelative?(je.addVectors(Dn.min,$r.min),Dn.expandByPoint(je),je.addVectors(Dn.max,$r.max),Dn.expandByPoint(je)):(Dn.expandByPoint($r.min),Dn.expandByPoint($r.max))}Dn.getCenter(i);let s=0;for(let r=0,o=t.count;r<o;r++)je.fromBufferAttribute(t,r),s=Math.max(s,i.distanceToSquared(je));if(e)for(let r=0,o=e.length;r<o;r++){let a=e[r],l=this.morphTargetsRelative;for(let c=0,h=a.count;c<h;c++)je.fromBufferAttribute(a,c),l&&(ir.fromBufferAttribute(t,c),je.add(ir)),s=Math.max(s,i.distanceToSquared(je))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&Jt('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){Jt("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let i=e.position,s=e.normal,r=e.uv,o=this.getAttribute("tangent");(o===void 0||o.count!==i.count)&&(o=new Yn(new Float32Array(4*i.count),4),this.setAttribute("tangent",o));let a=[],l=[];for(let _=0;_<i.count;_++)a[_]=new N,l[_]=new N;let c=new N,h=new N,d=new N,u=new Zt,f=new Zt,p=new Zt,x=new N,g=new N;function m(_,T,R){c.fromBufferAttribute(i,_),h.fromBufferAttribute(i,T),d.fromBufferAttribute(i,R),u.fromBufferAttribute(r,_),f.fromBufferAttribute(r,T),p.fromBufferAttribute(r,R),h.sub(c),d.sub(c),f.sub(u),p.sub(u);let P=1/(f.x*p.y-p.x*f.y);isFinite(P)&&(x.copy(h).multiplyScalar(p.y).addScaledVector(d,-f.y).multiplyScalar(P),g.copy(d).multiplyScalar(f.x).addScaledVector(h,-p.x).multiplyScalar(P),a[_].add(x),a[T].add(x),a[R].add(x),l[_].add(g),l[T].add(g),l[R].add(g))}let E=this.groups;E.length===0&&(E=[{start:0,count:t.count}]);for(let _=0,T=E.length;_<T;++_){let R=E[_],P=R.start,D=R.count;for(let k=P,L=P+D;k<L;k+=3)m(t.getX(k+0),t.getX(k+1),t.getX(k+2))}let C=new N,M=new N,w=new N,v=new N;function S(_){w.fromBufferAttribute(s,_),v.copy(w);let T=a[_];C.copy(T),C.sub(w.multiplyScalar(w.dot(T))).normalize(),M.crossVectors(v,T);let P=M.dot(l[_])<0?-1:1;o.setXYZW(_,C.x,C.y,C.z,P)}for(let _=0,T=E.length;_<T;++_){let R=E[_],P=R.start,D=R.count;for(let k=P,L=P+D;k<L;k+=3)S(t.getX(k+0)),S(t.getX(k+1)),S(t.getX(k+2))}this._transformed=!0}computeVertexNormals(){let t=this.index,e=this.getAttribute("position");if(e!==void 0){let i=this.getAttribute("normal");if(i===void 0||i.count!==e.count)i=new Yn(new Float32Array(e.count*3),3),this.setAttribute("normal",i);else for(let u=0,f=i.count;u<f;u++)i.setXYZ(u,0,0,0);let s=new N,r=new N,o=new N,a=new N,l=new N,c=new N,h=new N,d=new N;if(t)for(let u=0,f=t.count;u<f;u+=3){let p=t.getX(u+0),x=t.getX(u+1),g=t.getX(u+2);s.fromBufferAttribute(e,p),r.fromBufferAttribute(e,x),o.fromBufferAttribute(e,g),h.subVectors(o,r),d.subVectors(s,r),h.cross(d),a.fromBufferAttribute(i,p),l.fromBufferAttribute(i,x),c.fromBufferAttribute(i,g),a.add(h),l.add(h),c.add(h),i.setXYZ(p,a.x,a.y,a.z),i.setXYZ(x,l.x,l.y,l.z),i.setXYZ(g,c.x,c.y,c.z)}else for(let u=0,f=e.count;u<f;u+=3)s.fromBufferAttribute(e,u+0),r.fromBufferAttribute(e,u+1),o.fromBufferAttribute(e,u+2),h.subVectors(o,r),d.subVectors(s,r),h.cross(d),i.setXYZ(u+0,h.x,h.y,h.z),i.setXYZ(u+1,h.x,h.y,h.z),i.setXYZ(u+2,h.x,h.y,h.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){let t=this.attributes.normal;for(let e=0,i=t.count;e<i;e++)je.fromBufferAttribute(t,e),je.normalize(),t.setXYZ(e,je.x,je.y,je.z)}toNonIndexed(){function t(a,l){let c=a.array,h=a.itemSize,d=a.normalized,u=new c.constructor(l.length*h),f=0,p=0;for(let x=0,g=l.length;x<g;x++){a.isInterleavedBufferAttribute?f=l[x]*a.data.stride+a.offset:f=l[x]*h;for(let m=0;m<h;m++)u[p++]=c[f++]}return new Yn(u,h,d)}if(this.index===null)return Gt("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let e=new n,i=this.index.array,s=this.attributes;for(let a in s){let l=s[a],c=t(l,i);e.setAttribute(a,c)}let r=this.morphAttributes;for(let a in r){let l=[],c=r[a];for(let h=0,d=c.length;h<d;h++){let u=c[h],f=t(u,i);l.push(f)}e.morphAttributes[a]=l}e.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let a=0,l=o.length;a<l;a++){let c=o[a];e.addGroup(c.start,c.count,c.materialIndex)}return e}toJSON(){let t={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,t.name=this.name,Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){let l=this.parameters;for(let c in l)l[c]!==void 0&&(t[c]=l[c]);return t}t.data={attributes:{}};let e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});let i=this.attributes;for(let l in i){let c=i[l];t.data.attributes[l]=c.toJSON(t.data)}let s={},r=!1;for(let l in this.morphAttributes){let c=this.morphAttributes[l],h=[];for(let d=0,u=c.length;d<u;d++){let f=c[d];h.push(f.toJSON(t.data))}h.length>0&&(s[l]=h,r=!0)}r&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);let o=this.groups;o.length>0&&(t.data.groups=JSON.parse(JSON.stringify(o)));let a=this.boundingSphere;return a!==null&&(t.data.boundingSphere=a.toJSON()),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let e={};this.name=t.name;let i=t.index;i!==null&&this.setIndex(i.clone());let s=t.attributes;for(let c in s){let h=s[c];this.setAttribute(c,h.clone(e))}let r=t.morphAttributes;for(let c in r){let h=[],d=r[c];for(let u=0,f=d.length;u<f;u++)h.push(d[u].clone(e));this.morphAttributes[c]=h}this.morphTargetsRelative=t.morphTargetsRelative;let o=t.groups;for(let c=0,h=o.length;c<h;c++){let d=o[c];this.addGroup(d.start,d.count,d.materialIndex)}let a=t.boundingBox;a!==null&&(this.boundingBox=a.clone());let l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this._transformed=t._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}};var eh=new N,Dm=new N,Nm=new Qt,Nn=class{constructor(t=new N(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,i,s){return this.normal.set(t,e,i),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,i){let s=eh.subVectors(i,e).cross(Dm.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){let t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e,i=!0){let s=t.delta(eh),r=this.normal.dot(s);if(r===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;let o=-(t.start.dot(this.normal)+this.constant)/r;return i===!0&&(o<0||o>1)?null:e.copy(t.start).addScaledVector(s,o)}intersectsLine(t){let e=this.distanceToPoint(t.start),i=this.distanceToPoint(t.end);return e<0&&i>0||i<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){let i=e||Nm.getNormalMatrix(t),s=this.coplanarPoint(eh).applyMatrix4(t),r=this.normal.applyMatrix3(i).normalize();return this.constant=-s.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(t){return this.normal.fromArray(t.normal),this.constant=t.constant,this}},Um=0,ki=class extends ni{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Um++}),this.uuid=wr(),this.name="",this.type="Material",this.blending=Sr,this.side=cs,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=vh,this.blendDst=Mh,this.blendEquation=Is,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new ae(0,0,0),this.blendAlpha=0,this.depthFunc=hr,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=xf,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Ra,this.stencilZFail=Ra,this.stencilZPass=Ra,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(let e in t){let i=t[e];if(i===void 0){Gt(`Material: parameter '${e}' has value of undefined.`);continue}let s=this[e];if(s===void 0){Gt(`Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(i):s&&s.isVector2&&i&&i.isVector2||s&&s.isEuler&&i&&i.isEuler||s&&s.isVector3&&i&&i.isVector3?s.copy(i):this[e]=i}}toJSON(t){let e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});let i={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,i.blending=this.blending,i.side=this.side,i.shadowSide=this.shadowSide,i.vertexColors=this.vertexColors,i.opacity=this.opacity,i.transparent=this.transparent,i.blendSrc=this.blendSrc,i.blendDst=this.blendDst,i.blendEquation=this.blendEquation,i.blendSrcAlpha=this.blendSrcAlpha,i.blendDstAlpha=this.blendDstAlpha,i.blendEquationAlpha=this.blendEquationAlpha,i.blendColor=this.blendColor.getHex(),i.blendAlpha=this.blendAlpha,i.depthFunc=this.depthFunc,i.depthTest=this.depthTest,i.depthWrite=this.depthWrite,i.colorWrite=this.colorWrite,i.clipIntersection=this.clipIntersection,i.clipShadows=this.clipShadows,i.stencilWriteMask=this.stencilWriteMask,i.stencilFunc=this.stencilFunc,i.stencilRef=this.stencilRef,i.stencilFuncMask=this.stencilFuncMask,i.stencilFail=this.stencilFail,i.stencilZFail=this.stencilZFail,i.stencilZPass=this.stencilZPass,i.stencilWrite=this.stencilWrite,i.polygonOffset=this.polygonOffset,i.polygonOffsetFactor=this.polygonOffsetFactor,i.polygonOffsetUnits=this.polygonOffsetUnits,i.dithering=this.dithering,i.alphaTest=this.alphaTest,i.alphaHash=this.alphaHash,i.alphaToCoverage=this.alphaToCoverage,i.premultipliedAlpha=this.premultipliedAlpha,i.forceSinglePass=this.forceSinglePass,i.allowOverride=this.allowOverride,i.visible=this.visible,i.toneMapped=this.toneMapped,i.name=this.name,this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(i.sheenColorMap=this.sheenColorMap.toJSON(t).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(i.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(t).uuid),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(i.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(t).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(t).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(t).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(t).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(t).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(i.clippingPlanes=this.clippingPlanes.map(r=>r.toJSON())),this.rotation!==void 0&&(i.rotation=this.rotation),this.depthPacking!==void 0&&(i.depthPacking=this.depthPacking),this.linewidth!==void 0&&(i.linewidth=this.linewidth),this.linecap!==void 0&&(i.linecap=this.linecap),this.linejoin!==void 0&&(i.linejoin=this.linejoin),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.wireframe!==void 0&&(i.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(i.flatShading=this.flatShading),this.fog!==void 0&&(i.fog=this.fog),Object.keys(this.userData).length>0&&(i.userData=this.userData);function s(r){let o=[];for(let a in r){let l=r[a];delete l.metadata,o.push(l)}return o}if(e){let r=s(t.textures),o=s(t.images);r.length>0&&(i.textures=r),o.length>0&&(i.images=o)}return i}fromJSON(t,e){if(t.uuid!==void 0&&(this.uuid=t.uuid),t.name!==void 0&&(this.name=t.name),t.color!==void 0&&this.color!==void 0&&this.color.setHex(t.color),t.roughness!==void 0&&(this.roughness=t.roughness),t.metalness!==void 0&&(this.metalness=t.metalness),t.sheen!==void 0&&(this.sheen=t.sheen),t.sheenColor!==void 0&&(this.sheenColor=new ae().setHex(t.sheenColor)),t.sheenRoughness!==void 0&&(this.sheenRoughness=t.sheenRoughness),t.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(t.emissive),t.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(t.specular),t.specularIntensity!==void 0&&(this.specularIntensity=t.specularIntensity),t.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(t.specularColor),t.shininess!==void 0&&(this.shininess=t.shininess),t.clearcoat!==void 0&&(this.clearcoat=t.clearcoat),t.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=t.clearcoatRoughness),t.dispersion!==void 0&&(this.dispersion=t.dispersion),t.retroreflectivity!==void 0&&(this.retroreflectivity=t.retroreflectivity),t.iridescence!==void 0&&(this.iridescence=t.iridescence),t.iridescenceIOR!==void 0&&(this.iridescenceIOR=t.iridescenceIOR),t.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=t.iridescenceThicknessRange),t.transmission!==void 0&&(this.transmission=t.transmission),t.thickness!==void 0&&(this.thickness=t.thickness),t.attenuationDistance!==void 0&&(this.attenuationDistance=t.attenuationDistance),t.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(t.attenuationColor),t.anisotropy!==void 0&&(this.anisotropy=t.anisotropy),t.anisotropyRotation!==void 0&&(this.anisotropyRotation=t.anisotropyRotation),t.fog!==void 0&&(this.fog=t.fog),t.flatShading!==void 0&&(this.flatShading=t.flatShading),t.blending!==void 0&&(this.blending=t.blending),t.combine!==void 0&&(this.combine=t.combine),t.side!==void 0&&(this.side=t.side),t.shadowSide!==void 0&&(this.shadowSide=t.shadowSide),t.opacity!==void 0&&(this.opacity=t.opacity),t.transparent!==void 0&&(this.transparent=t.transparent),t.alphaTest!==void 0&&(this.alphaTest=t.alphaTest),t.alphaHash!==void 0&&(this.alphaHash=t.alphaHash),t.depthFunc!==void 0&&(this.depthFunc=t.depthFunc),t.depthTest!==void 0&&(this.depthTest=t.depthTest),t.depthWrite!==void 0&&(this.depthWrite=t.depthWrite),t.colorWrite!==void 0&&(this.colorWrite=t.colorWrite),t.clippingPlanes!==void 0&&(this.clippingPlanes=t.clippingPlanes.map(i=>new Nn().fromJSON(i))),t.clipIntersection!==void 0&&(this.clipIntersection=t.clipIntersection),t.clipShadows!==void 0&&(this.clipShadows=t.clipShadows),t.depthPacking!==void 0&&(this.depthPacking=t.depthPacking),t.blendSrc!==void 0&&(this.blendSrc=t.blendSrc),t.blendDst!==void 0&&(this.blendDst=t.blendDst),t.blendEquation!==void 0&&(this.blendEquation=t.blendEquation),t.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=t.blendSrcAlpha),t.blendDstAlpha!==void 0&&(this.blendDstAlpha=t.blendDstAlpha),t.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=t.blendEquationAlpha),t.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(t.blendColor),t.blendAlpha!==void 0&&(this.blendAlpha=t.blendAlpha),t.stencilWriteMask!==void 0&&(this.stencilWriteMask=t.stencilWriteMask),t.stencilFunc!==void 0&&(this.stencilFunc=t.stencilFunc),t.stencilRef!==void 0&&(this.stencilRef=t.stencilRef),t.stencilFuncMask!==void 0&&(this.stencilFuncMask=t.stencilFuncMask),t.stencilFail!==void 0&&(this.stencilFail=t.stencilFail),t.stencilZFail!==void 0&&(this.stencilZFail=t.stencilZFail),t.stencilZPass!==void 0&&(this.stencilZPass=t.stencilZPass),t.stencilWrite!==void 0&&(this.stencilWrite=t.stencilWrite),t.wireframe!==void 0&&(this.wireframe=t.wireframe),t.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=t.wireframeLinewidth),t.wireframeLinecap!==void 0&&(this.wireframeLinecap=t.wireframeLinecap),t.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=t.wireframeLinejoin),t.rotation!==void 0&&(this.rotation=t.rotation),t.linewidth!==void 0&&(this.linewidth=t.linewidth),t.linecap!==void 0&&(this.linecap=t.linecap),t.linejoin!==void 0&&(this.linejoin=t.linejoin),t.dashSize!==void 0&&(this.dashSize=t.dashSize),t.gapSize!==void 0&&(this.gapSize=t.gapSize),t.scale!==void 0&&(this.scale=t.scale),t.polygonOffset!==void 0&&(this.polygonOffset=t.polygonOffset),t.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=t.polygonOffsetFactor),t.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=t.polygonOffsetUnits),t.dithering!==void 0&&(this.dithering=t.dithering),t.alphaToCoverage!==void 0&&(this.alphaToCoverage=t.alphaToCoverage),t.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=t.premultipliedAlpha),t.forceSinglePass!==void 0&&(this.forceSinglePass=t.forceSinglePass),t.allowOverride!==void 0&&(this.allowOverride=t.allowOverride),t.visible!==void 0&&(this.visible=t.visible),t.toneMapped!==void 0&&(this.toneMapped=t.toneMapped),t.userData!==void 0&&(this.userData=t.userData),t.vertexColors!==void 0&&(typeof t.vertexColors=="number"?this.vertexColors=t.vertexColors>0:this.vertexColors=t.vertexColors),t.size!==void 0&&(this.size=t.size),t.sizeAttenuation!==void 0&&(this.sizeAttenuation=t.sizeAttenuation),t.map!==void 0&&(this.map=e[t.map]||null),t.matcap!==void 0&&(this.matcap=e[t.matcap]||null),t.alphaMap!==void 0&&(this.alphaMap=e[t.alphaMap]||null),t.bumpMap!==void 0&&(this.bumpMap=e[t.bumpMap]||null),t.bumpScale!==void 0&&(this.bumpScale=t.bumpScale),t.normalMap!==void 0&&(this.normalMap=e[t.normalMap]||null),t.normalMapType!==void 0&&(this.normalMapType=t.normalMapType),t.normalScale!==void 0){let i=t.normalScale;Array.isArray(i)===!1&&(i=[i,i]),this.normalScale=new Zt().fromArray(i)}return t.displacementMap!==void 0&&(this.displacementMap=e[t.displacementMap]||null),t.displacementScale!==void 0&&(this.displacementScale=t.displacementScale),t.displacementBias!==void 0&&(this.displacementBias=t.displacementBias),t.roughnessMap!==void 0&&(this.roughnessMap=e[t.roughnessMap]||null),t.metalnessMap!==void 0&&(this.metalnessMap=e[t.metalnessMap]||null),t.emissiveMap!==void 0&&(this.emissiveMap=e[t.emissiveMap]||null),t.emissiveIntensity!==void 0&&(this.emissiveIntensity=t.emissiveIntensity),t.specularMap!==void 0&&(this.specularMap=e[t.specularMap]||null),t.specularIntensityMap!==void 0&&(this.specularIntensityMap=e[t.specularIntensityMap]||null),t.specularColorMap!==void 0&&(this.specularColorMap=e[t.specularColorMap]||null),t.envMap!==void 0&&(this.envMap=e[t.envMap]||null),t.envMapRotation!==void 0&&this.envMapRotation.fromArray(t.envMapRotation),t.envMapIntensity!==void 0&&(this.envMapIntensity=t.envMapIntensity),t.reflectivity!==void 0&&(this.reflectivity=t.reflectivity),t.refractionRatio!==void 0&&(this.refractionRatio=t.refractionRatio),t.lightMap!==void 0&&(this.lightMap=e[t.lightMap]||null),t.lightMapIntensity!==void 0&&(this.lightMapIntensity=t.lightMapIntensity),t.aoMap!==void 0&&(this.aoMap=e[t.aoMap]||null),t.aoMapIntensity!==void 0&&(this.aoMapIntensity=t.aoMapIntensity),t.gradientMap!==void 0&&(this.gradientMap=e[t.gradientMap]||null),t.clearcoatMap!==void 0&&(this.clearcoatMap=e[t.clearcoatMap]||null),t.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=e[t.clearcoatRoughnessMap]||null),t.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=e[t.clearcoatNormalMap]||null),t.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new Zt().fromArray(t.clearcoatNormalScale)),t.iridescenceMap!==void 0&&(this.iridescenceMap=e[t.iridescenceMap]||null),t.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=e[t.iridescenceThicknessMap]||null),t.transmissionMap!==void 0&&(this.transmissionMap=e[t.transmissionMap]||null),t.thicknessMap!==void 0&&(this.thicknessMap=e[t.thicknessMap]||null),t.anisotropyMap!==void 0&&(this.anisotropyMap=e[t.anisotropyMap]||null),t.sheenColorMap!==void 0&&(this.sheenColorMap=e[t.sheenColorMap]||null),t.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=e[t.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;let e=t.clippingPlanes,i=null;if(e!==null){let s=e.length;i=new Array(s);for(let r=0;r!==s;++r)i[r]=e[r].clone()}return this.clippingPlanes=i,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.allowOverride=t.allowOverride,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}};var Ni=new N,nh=new N,ca=new N,ha=new N,Rs=class{constructor(t=new N,e=new N(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,Ni)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);let i=e.dot(this.direction);return i<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){let e=Ni.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(Ni.copy(this.origin).addScaledVector(this.direction,e),Ni.distanceToSquared(t))}distanceSqToSegment(t,e,i,s){nh.copy(t).add(e).multiplyScalar(.5),ca.copy(e).sub(t).normalize(),ha.copy(this.origin).sub(nh);let r=t.distanceTo(e)*.5,o=-this.direction.dot(ca),a=ha.dot(this.direction),l=-ha.dot(ca),c=ha.lengthSq(),h=Math.abs(1-o*o),d,u,f,p;if(h>0)if(d=o*l-a,u=o*a-l,p=r*h,d>=0)if(u>=-p)if(u<=p){let x=1/h;d*=x,u*=x,f=d*(d+o*u+2*a)+u*(o*d+u+2*l)+c}else u=r,d=Math.max(0,-(o*u+a)),f=-d*d+u*(u+2*l)+c;else u=-r,d=Math.max(0,-(o*u+a)),f=-d*d+u*(u+2*l)+c;else u<=-p?(d=Math.max(0,-(-o*r+a)),u=d>0?-r:Math.min(Math.max(-r,-l),r),f=-d*d+u*(u+2*l)+c):u<=p?(d=0,u=Math.min(Math.max(-r,-l),r),f=u*(u+2*l)+c):(d=Math.max(0,-(o*r+a)),u=d>0?r:Math.min(Math.max(-r,-l),r),f=-d*d+u*(u+2*l)+c);else u=o>0?-r:r,d=Math.max(0,-(o*u+a)),f=-d*d+u*(u+2*l)+c;return i&&i.copy(this.origin).addScaledVector(this.direction,d),s&&s.copy(nh).addScaledVector(ca,u),f}intersectSphere(t,e){if(t.radius<0)return null;Ni.subVectors(t.center,this.origin);let i=Ni.dot(this.direction),s=Ni.dot(Ni)-i*i,r=t.radius*t.radius;if(s>r)return null;let o=Math.sqrt(r-s),a=i-o,l=i+o;return l<0?null:a<0?this.at(l,e):this.at(a,e)}intersectsSphere(t){return t.radius<0?!1:this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){let e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;let i=-(this.origin.dot(t.normal)+t.constant)/e;return i>=0?i:null}intersectPlane(t,e){let i=this.distanceToPlane(t);return i===null?null:this.at(i,e)}intersectsPlane(t){let e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let i,s,r,o,a,l,c=1/this.direction.x,h=1/this.direction.y,d=1/this.direction.z,u=this.origin;return c>=0?(i=(t.min.x-u.x)*c,s=(t.max.x-u.x)*c):(i=(t.max.x-u.x)*c,s=(t.min.x-u.x)*c),h>=0?(r=(t.min.y-u.y)*h,o=(t.max.y-u.y)*h):(r=(t.max.y-u.y)*h,o=(t.min.y-u.y)*h),i>o||r>s||((r>i||isNaN(i))&&(i=r),(o<s||isNaN(s))&&(s=o),d>=0?(a=(t.min.z-u.z)*d,l=(t.max.z-u.z)*d):(a=(t.max.z-u.z)*d,l=(t.min.z-u.z)*d),i>l||a>s)||((a>i||i!==i)&&(i=a),(l<s||s!==s)&&(s=l),s<0)?null:this.at(i>=0?i:s,e)}intersectsBox(t){return this.intersectBox(t,Ni)!==null}intersectTriangle(t,e,i,s,r){let o=this.origin,a=this.direction,l=a.x,c=a.y,h=a.z,d=t.x-o.x,u=t.y-o.y,f=t.z-o.z,p=e.x-o.x,x=e.y-o.y,g=e.z-o.z,m=i.x-o.x,E=i.y-o.y,C=i.z-o.z,M=Math.abs(l),w=Math.abs(c),v=Math.abs(h),S,_,T,R,P,D,k,L,z,W,J,et;if(M>=w&&M>=v?(T=l,D=d,z=p,et=m,l>=0?(S=c,_=h,R=u,P=f,k=x,L=g,W=E,J=C):(S=h,_=c,R=f,P=u,k=g,L=x,W=C,J=E)):w>=v?(T=c,D=u,z=x,et=E,c>=0?(S=h,_=l,R=f,P=d,k=g,L=p,W=C,J=m):(S=l,_=h,R=d,P=f,k=p,L=g,W=m,J=C)):(T=h,D=f,z=g,et=C,h>=0?(S=l,_=c,R=d,P=u,k=p,L=x,W=m,J=E):(S=c,_=l,R=u,P=d,k=x,L=p,W=E,J=m)),T===0)return null;let O=S/T,q=_/T,j=1/T,yt=R-O*D,Tt=P-q*D,pe=k-O*z,qt=L-q*z,Et=W-O*et,Y=J-q*et,K=Et*qt-Y*pe,it=yt*Y-Tt*Et,Ct=pe*Tt-qt*yt;if(s){if(K<0||it<0||Ct<0)return null}else if((K<0||it<0||Ct<0)&&(K>0||it>0||Ct>0))return null;let ot=K+it+Ct;if(ot===0)return null;let ut=j*(K*D+it*z+Ct*et);return(ot>0?ut<0:ut>0)?null:this.at(ut/ot,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},gr=class extends ki{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new ae(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Bi,this.combine=bh,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}},Pd=new De,Ts=new Rs,ua=new As,Id=new N,da=new N,fa=new N,pa=new N,ih=new N,ma=new N,Ld=new N,ga=new N,gn=class extends tn{constructor(t=new Xe,e=new gr){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){let e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){let s=e[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(t,e){let i=this.geometry,s=i.attributes.position,r=i.morphAttributes.position,o=i.morphTargetsRelative;e.fromBufferAttribute(s,t);let a=this.morphTargetInfluences;if(r&&a){ma.set(0,0,0);for(let l=0,c=r.length;l<c;l++){let h=a[l],d=r[l];h!==0&&(ih.fromBufferAttribute(d,t),o?ma.addScaledVector(ih,h):ma.addScaledVector(ih.sub(e),h))}e.add(ma)}return e}intersectsFrustum(t){return t.intersectsObject(this)}raycast(t,e){let i=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),ua.copy(i.boundingSphere),ua.applyMatrix4(r),Ts.copy(t.ray).recast(t.near),!(ua.containsPoint(Ts.origin)===!1&&(Ts.intersectSphere(ua,Id)===null||Ts.origin.distanceToSquared(Id)>(t.far-t.near)**2))&&(Pd.copy(r).invert(),Ts.copy(t.ray).applyMatrix4(Pd),!(i.boundingBox!==null&&Ts.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(t,e,Ts)))}_computeIntersections(t,e,i){let s,r=this.geometry,o=this.material,a=r.index,l=r.attributes.position,c=r.attributes.uv,h=r.attributes.uv1,d=r.attributes.normal,u=r.groups,f=r.drawRange;if(a!==null)if(Array.isArray(o))for(let p=0,x=u.length;p<x;p++){let g=u[p],m=o[g.materialIndex],E=Math.max(g.start,f.start),C=Math.min(a.count,Math.min(g.start+g.count,f.start+f.count));for(let M=E,w=C;M<w;M+=3){let v=a.getX(M),S=a.getX(M+1),_=a.getX(M+2);s=_a(this,m,t,i,c,h,d,v,S,_),s&&(s.faceIndex=Math.floor(M/3),s.face.materialIndex=g.materialIndex,e.push(s))}}else{let p=Math.max(0,f.start),x=Math.min(a.count,f.start+f.count);for(let g=p,m=x;g<m;g+=3){let E=a.getX(g),C=a.getX(g+1),M=a.getX(g+2);s=_a(this,o,t,i,c,h,d,E,C,M),s&&(s.faceIndex=Math.floor(g/3),e.push(s))}}else if(l!==void 0)if(Array.isArray(o))for(let p=0,x=u.length;p<x;p++){let g=u[p],m=o[g.materialIndex],E=Math.max(g.start,f.start),C=Math.min(l.count,Math.min(g.start+g.count,f.start+f.count));for(let M=E,w=C;M<w;M+=3){let v=M,S=M+1,_=M+2;s=_a(this,m,t,i,c,h,d,v,S,_),s&&(s.faceIndex=Math.floor(M/3),s.face.materialIndex=g.materialIndex,e.push(s))}}else{let p=Math.max(0,f.start),x=Math.min(l.count,f.start+f.count);for(let g=p,m=x;g<m;g+=3){let E=g,C=g+1,M=g+2;s=_a(this,o,t,i,c,h,d,E,C,M),s&&(s.faceIndex=Math.floor(g/3),e.push(s))}}}};function Fm(n,t,e,i,s,r,o,a){let l;if(t.side===xn?l=i.intersectTriangle(o,r,s,!0,a):l=i.intersectTriangle(s,r,o,t.side===cs,a),l===null)return null;ga.copy(a),ga.applyMatrix4(n.matrixWorld);let c=e.ray.origin.distanceTo(ga);return c<e.near||c>e.far?null:{distance:c,point:ga.clone(),object:n}}function _a(n,t,e,i,s,r,o,a,l,c){n.getVertexPosition(a,da),n.getVertexPosition(l,fa),n.getVertexPosition(c,pa);let h=Fm(n,t,e,i,da,fa,pa,Ld);if(h){let d=new N;Ui.getBarycoord(Ld,da,fa,pa,d),s&&(h.uv=Ui.getInterpolatedAttribute(s,a,l,c,d,new Zt)),r&&(h.uv1=Ui.getInterpolatedAttribute(r,a,l,c,d,new Zt)),o&&(h.normal=Ui.getInterpolatedAttribute(o,a,l,c,d,new N),h.normal.dot(i.direction)>0&&h.normal.multiplyScalar(-1));let u={a,b:l,c,normal:new N,materialIndex:0};Ui.getNormal(da,fa,pa,u.normal),h.face=u,h.barycoord=d}return h}var Ha=class extends Tn{constructor(t=null,e=1,i=1,s,r,o,a,l,c=Qe,h=Qe,d,u){super(null,o,a,l,c,h,s,r,d,u),this.isDataTexture=!0,this.image={data:t,width:e,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var Es=new As,Om=new Zt(.5,.5),xa=new N,_r=class{constructor(t=new Nn,e=new Nn,i=new Nn,s=new Nn,r=new Nn,o=new Nn){this.planes=[t,e,i,s,r,o]}set(t,e,i,s,r,o){let a=this.planes;return a[0].copy(t),a[1].copy(e),a[2].copy(i),a[3].copy(s),a[4].copy(r),a[5].copy(o),this}copy(t){let e=this.planes;for(let i=0;i<6;i++)e[i].copy(t.planes[i]);return this}setFromProjectionMatrix(t,e=ei,i=!1){let s=this.planes,r=t.elements,o=r[0],a=r[1],l=r[2],c=r[3],h=r[4],d=r[5],u=r[6],f=r[7],p=r[8],x=r[9],g=r[10],m=r[11],E=r[12],C=r[13],M=r[14],w=r[15];if(s[0].setComponents(c-o,f-h,m-p,w-E).normalize(),s[1].setComponents(c+o,f+h,m+p,w+E).normalize(),s[2].setComponents(c+a,f+d,m+x,w+C).normalize(),s[3].setComponents(c-a,f-d,m-x,w-C).normalize(),i)s[4].setComponents(l,u,g,M).normalize(),s[5].setComponents(c-l,f-u,m-g,w-M).normalize();else if(s[4].setComponents(c-l,f-u,m-g,w-M).normalize(),e===ei)s[5].setComponents(c+l,f+u,m+g,w+M).normalize();else if(e===ur)s[5].setComponents(l,u,g,M).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),Es.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{let e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),Es.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(Es)}intersectsSprite(t){Es.center.set(0,0,0);let e=Om.distanceTo(t.center);return Es.radius=.7071067811865476+e,Es.applyMatrix4(t.matrixWorld),this.intersectsSphere(Es)}intersectsSphere(t){let e=this.planes,i=t.center,s=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(i)<s)return!1;return!0}intersectsBox(t){let e=this.planes;for(let i=0;i<6;i++){let s=e[i];if(xa.x=s.normal.x>0?t.max.x:t.min.x,xa.y=s.normal.y>0?t.max.y:t.min.y,xa.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(xa)<0)return!1}return!0}containsPoint(t){let e=this.planes;for(let i=0;i<6;i++)if(e[i].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};var Ze=class extends ki{constructor(t){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new ae(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}},Ga=new N,Wa=new N,Dd=new De,Kr=new Rs,ya=new As,sh=new N,Nd=new N,Cs=class extends tn{constructor(t=new Xe,e=new Ze){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){let t=this.geometry;if(t.index===null){let e=t.attributes.position,i=[0];for(let s=1,r=e.count;s<r;s++)Ga.fromBufferAttribute(e,s-1),Wa.fromBufferAttribute(e,s),i[s]=i[s-1],i[s]+=Ga.distanceTo(Wa);t.setAttribute("lineDistance",new Pe(i,1))}else Gt("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}intersectsFrustum(t){return t.intersectsObject(this)}raycast(t,e){let i=this.geometry,s=this.matrixWorld,r=t.params.Line.threshold,o=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),ya.copy(i.boundingSphere),ya.applyMatrix4(s),ya.radius+=r,t.ray.intersectsSphere(ya)===!1)return;Dd.copy(s).invert(),Kr.copy(t.ray).applyMatrix4(Dd);let a=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=this.isLineSegments?2:1,h=i.index,u=i.attributes.position;if(h!==null){let f=Math.max(0,o.start),p=Math.min(h.count,o.start+o.count);for(let x=f,g=p-1;x<g;x+=c){let m=h.getX(x),E=h.getX(x+1),C=va(this,t,Kr,l,m,E,x);C&&e.push(C)}if(this.isLineLoop){let x=h.getX(p-1),g=h.getX(f),m=va(this,t,Kr,l,x,g,p-1);m&&e.push(m)}}else{let f=Math.max(0,o.start),p=Math.min(u.count,o.start+o.count);for(let x=f,g=p-1;x<g;x+=c){let m=va(this,t,Kr,l,x,x+1,x);m&&e.push(m)}if(this.isLineLoop){let x=va(this,t,Kr,l,p-1,f,p-1);x&&e.push(x)}}}updateMorphTargets(){let e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){let s=e[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}};function va(n,t,e,i,s,r,o){let a=n.geometry.attributes.position;if(Ga.fromBufferAttribute(a,s),Wa.fromBufferAttribute(a,r),e.distanceSqToSegment(Ga,Wa,sh,Nd)>i)return;sh.applyMatrix4(n.matrixWorld);let c=t.ray.origin.distanceTo(sh);if(!(c<t.near||c>t.far))return{distance:c,point:Nd.clone().applyMatrix4(n.matrixWorld),index:o,face:null,faceIndex:null,barycoord:null,object:n}}var Ud=new N,Fd=new N,_n=class extends Cs{constructor(t,e){super(t,e),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){let t=this.geometry;if(t.index===null){let e=t.attributes.position,i=[];for(let s=0,r=e.count;s<r;s+=2)Ud.fromBufferAttribute(e,s),Fd.fromBufferAttribute(e,s+1),i[s]=s===0?0:i[s-1],i[s+1]=i[s]+Ud.distanceTo(Fd);t.setAttribute("lineDistance",new Pe(i,1))}else Gt("LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}};var lo=class extends Tn{constructor(t=[],e=hs,i,s,r,o,a,l,c,h){super(t,e,i,s,r,o,a,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}};var es=class extends Tn{constructor(t,e,i=oi,s,r,o,a=Qe,l=Qe,c,h=Mi,d=1){if(h!==Mi&&h!==ds)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");let u={width:t,height:e,depth:d};super(u,s,r,o,a,l,h,i,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.source=new pr(Object.assign({},t.image)),this.compareFunction=t.compareFunction,this}toJSON(t){let e=super.toJSON(t);return e.compareFunction=this.compareFunction,e}},Xa=class extends es{constructor(t,e=oi,i=hs,s,r,o=Qe,a=Qe,l,c=Mi){let h={width:t,height:t,depth:1},d=[h,h,h,h,h,h];super(t,t,e,i,s,r,o,a,l,c),this.image=d,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(t){this.image=t}},co=class extends Tn{constructor(t=null){super(),this.sourceTexture=t,this.isExternalTexture=!0}copy(t){return super.copy(t),this.sourceTexture=t.sourceTexture,this}},xr=class n extends Xe{constructor(t=1,e=1,i=1,s=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:i,widthSegments:s,heightSegments:r,depthSegments:o};let a=this;s=Math.floor(s),r=Math.floor(r),o=Math.floor(o);let l=[],c=[],h=[],d=[],u=0,f=0;p("z","y","x",-1,-1,i,e,t,o,r,0),p("z","y","x",1,-1,i,e,-t,o,r,1),p("x","z","y",1,1,t,i,e,s,o,2),p("x","z","y",1,-1,t,i,-e,s,o,3),p("x","y","z",1,-1,t,e,i,s,r,4),p("x","y","z",-1,-1,t,e,-i,s,r,5),this.setIndex(l),this.setAttribute("position",new Pe(c,3)),this.setAttribute("normal",new Pe(h,3)),this.setAttribute("uv",new Pe(d,2));function p(x,g,m,E,C,M,w,v,S,_,T){let R=M/S,P=w/_,D=M/2,k=w/2,L=v/2,z=S+1,W=_+1,J=0,et=0,O=new N;for(let q=0;q<W;q++){let j=q*P-k;for(let yt=0;yt<z;yt++){let Tt=yt*R-D;O[x]=Tt*E,O[g]=j*C,O[m]=L,c.push(O.x,O.y,O.z),O[x]=0,O[g]=0,O[m]=v>0?1:-1,h.push(O.x,O.y,O.z),d.push(yt/S),d.push(1-q/_),J+=1}}for(let q=0;q<_;q++)for(let j=0;j<S;j++){let yt=u+j+z*q,Tt=u+j+z*(q+1),pe=u+(j+1)+z*(q+1),qt=u+(j+1)+z*q;l.push(yt,Tt,qt),l.push(Tt,pe,qt),et+=6}a.addGroup(f,et,T),f+=et,u+=J}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new n(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}};var ns=class n extends Xe{constructor(t=1,e=1,i=1,s=32,r=1,o=!1,a=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:i,radialSegments:s,heightSegments:r,openEnded:o,thetaStart:a,thetaLength:l};let c=this;s=Math.floor(s),r=Math.floor(r);let h=[],d=[],u=[],f=[],p=0,x=[],g=i/2,m=0;E(),o===!1&&(t>0&&C(!0),e>0&&C(!1)),this.setIndex(h),this.setAttribute("position",new Pe(d,3)),this.setAttribute("normal",new Pe(u,3)),this.setAttribute("uv",new Pe(f,2));function E(){let M=new N,w=new N,v=0,S=(e-t)/i;for(let _=0;_<=r;_++){let T=[],R=_/r,P=R*(e-t)+t;for(let D=0;D<=s;D++){let k=D/s,L=k*l+a,z=Math.sin(L),W=Math.cos(L);w.x=P*z,w.y=-R*i+g,w.z=P*W,d.push(w.x,w.y,w.z),M.set(z,S,W).normalize(),u.push(M.x,M.y,M.z),f.push(k,1-R),T.push(p++)}x.push(T)}for(let _=0;_<s;_++)for(let T=0;T<r;T++){let R=x[T][_],P=x[T+1][_],D=x[T+1][_+1],k=x[T][_+1];(t>0||T!==0)&&(h.push(R,P,k),v+=3),(e>0||T!==r-1)&&(h.push(P,D,k),v+=3)}c.addGroup(m,v,0),m+=v}function C(M){let w=p,v=new Zt,S=new N,_=0,T=M===!0?t:e,R=M===!0?1:-1;for(let D=1;D<=s;D++)d.push(0,g*R,0),u.push(0,R,0),f.push(.5,.5),p++;let P=p;for(let D=0;D<=s;D++){let L=D/s*l+a,z=Math.cos(L),W=Math.sin(L);S.x=T*W,S.y=g*R,S.z=T*z,d.push(S.x,S.y,S.z),u.push(0,R,0),v.x=z*.5+.5,v.y=W*.5*R+.5,f.push(v.x,v.y),p++}for(let D=0;D<s;D++){let k=w+D,L=P+D;M===!0?h.push(L,L+1,k):h.push(L+1,L,k),_+=3}c.addGroup(m,_,M===!0?1:2),m+=_}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new n(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}},ii=class n extends ns{constructor(t=1,e=1,i=32,s=1,r=!1,o=0,a=Math.PI*2){super(0,t,e,i,s,r,o,a),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:i,heightSegments:s,openEnded:r,thetaStart:o,thetaLength:a}}static fromJSON(t){return new n(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}};var Ma=new N,ba=new N,rh=new N,Sa=new Ui,Ps=class extends Xe{constructor(t=null,e=1){if(super(),this.type="EdgesGeometry",this.parameters={geometry:t,thresholdAngle:e},t!==null){let s=Math.pow(10,4),r=Math.cos(lr*e),o=t.getIndex(),a=t.getAttribute("position"),l=o?o.count:a.count,c=[0,0,0],h=["a","b","c"],d=new Array(3),u={},f=[];for(let p=0;p<l;p+=3){o?(c[0]=o.getX(p),c[1]=o.getX(p+1),c[2]=o.getX(p+2)):(c[0]=p,c[1]=p+1,c[2]=p+2);let{a:x,b:g,c:m}=Sa;if(x.fromBufferAttribute(a,c[0]),g.fromBufferAttribute(a,c[1]),m.fromBufferAttribute(a,c[2]),Sa.getNormal(rh),d[0]=`${Math.round(x.x*s)},${Math.round(x.y*s)},${Math.round(x.z*s)}`,d[1]=`${Math.round(g.x*s)},${Math.round(g.y*s)},${Math.round(g.z*s)}`,d[2]=`${Math.round(m.x*s)},${Math.round(m.y*s)},${Math.round(m.z*s)}`,!(d[0]===d[1]||d[1]===d[2]||d[2]===d[0]))for(let E=0;E<3;E++){let C=(E+1)%3,M=d[E],w=d[C],v=Sa[h[E]],S=Sa[h[C]],_=`${M}_${w}`,T=`${w}_${M}`;T in u&&u[T]?(rh.dot(u[T].normal)<=r&&(f.push(v.x,v.y,v.z),f.push(S.x,S.y,S.z)),u[T]=null):_ in u||(u[_]={index0:c[E],index1:c[C],normal:rh.clone()})}}for(let p in u)if(u[p]){let{index0:x,index1:g}=u[p];Ma.fromBufferAttribute(a,x),ba.fromBufferAttribute(a,g),f.push(Ma.x,Ma.y,Ma.z),f.push(ba.x,ba.y,ba.z)}this.setAttribute("position",new Pe(f,3))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}};var Ue=class n extends Xe{constructor(t=1,e=1,i=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:i,heightSegments:s};let r=t/2,o=e/2,a=Math.floor(i),l=Math.floor(s),c=a+1,h=l+1,d=t/a,u=e/l,f=[],p=[],x=[],g=[];for(let m=0;m<h;m++){let E=m*u-o;for(let C=0;C<c;C++){let M=C*d-r;p.push(M,-E,0),x.push(0,0,1),g.push(C/a),g.push(1-m/l)}}for(let m=0;m<l;m++)for(let E=0;E<a;E++){let C=E+c*m,M=E+c*(m+1),w=E+1+c*(m+1),v=E+1+c*m;f.push(C,M,v),f.push(M,w,v)}this.setIndex(f),this.setAttribute("position",new Pe(p,3)),this.setAttribute("normal",new Pe(x,3)),this.setAttribute("uv",new Pe(g,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new n(t.width,t.height,t.widthSegments,t.heightSegments)}};var Fe=class n extends Xe{constructor(t=1,e=32,i=16,s=0,r=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:i,phiStart:s,phiLength:r,thetaStart:o,thetaLength:a},e=Math.max(3,Math.floor(e)),i=Math.max(2,Math.floor(i));let l=Math.min(o+a,Math.PI),c=0,h=[],d=new N,u=new N,f=[],p=[],x=[],g=[];for(let m=0;m<=i;m++){let E=[],C=m/i,M=o+C*a,w=t*Math.cos(M),v=Math.sqrt(t*t-w*w),S=0;m===0&&o===0?S=.5/e:m===i&&l===Math.PI&&(S=-.5/e);for(let _=0;_<=e;_++){let T=_/e,R=s+T*r;d.x=-v*Math.cos(R),d.y=w,d.z=v*Math.sin(R),p.push(d.x,d.y,d.z),u.copy(d).normalize(),x.push(u.x,u.y,u.z),g.push(T+S,1-C),E.push(c++)}h.push(E)}for(let m=0;m<i;m++)for(let E=0;E<e;E++){let C=h[m][E+1],M=h[m][E],w=h[m+1][E],v=h[m+1][E+1];(m!==0||o>0)&&f.push(C,M,v),(m!==i-1||l<Math.PI)&&f.push(M,w,v)}this.setIndex(f),this.setAttribute("position",new Pe(p,3)),this.setAttribute("normal",new Pe(x,3)),this.setAttribute("uv",new Pe(g,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new n(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}};var is=class n extends Xe{constructor(t=1,e=.4,i=12,s=48,r=Math.PI*2,o=0,a=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:i,tubularSegments:s,arc:r,thetaStart:o,thetaLength:a},i=Math.floor(i),s=Math.floor(s);let l=[],c=[],h=[],d=[],u=new N,f=new N,p=new N;for(let x=0;x<=i;x++){let g=o+x/i*a;for(let m=0;m<=s;m++){let E=m/s*r;f.x=(t+e*Math.cos(g))*Math.cos(E),f.y=(t+e*Math.cos(g))*Math.sin(E),f.z=e*Math.sin(g),c.push(f.x,f.y,f.z),u.x=t*Math.cos(E),u.y=t*Math.sin(E),p.subVectors(f,u).normalize(),h.push(p.x,p.y,p.z),d.push(m/s),d.push(x/i)}}for(let x=1;x<=i;x++)for(let g=1;g<=s;g++){let m=(s+1)*x+g-1,E=(s+1)*(x-1)+g-1,C=(s+1)*(x-1)+g,M=(s+1)*x+g;l.push(m,E,M),l.push(E,C,M)}this.setIndex(l),this.setAttribute("position",new Pe(c,3)),this.setAttribute("normal",new Pe(h,3)),this.setAttribute("uv",new Pe(d,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new n(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc,t.thetaStart,t.thetaLength)}};var Fn=class extends Xe{constructor(t=null){if(super(),this.type="WireframeGeometry",this.parameters={geometry:t},t!==null){let e=[],i=new Set,s=new N,r=new N;if(t.index!==null){let o=t.attributes.position,a=t.index,l=t.groups;l.length===0&&(l=[{start:0,count:a.count,materialIndex:0}]);for(let c=0,h=l.length;c<h;++c){let d=l[c],u=d.start,f=d.count;for(let p=u,x=u+f;p<x;p+=3)for(let g=0;g<3;g++){let m=a.getX(p+g),E=a.getX(p+(g+1)%3);s.fromBufferAttribute(o,m),r.fromBufferAttribute(o,E),Od(s,r,i)===!0&&(e.push(s.x,s.y,s.z),e.push(r.x,r.y,r.z))}}}else{let o=t.attributes.position;for(let a=0,l=o.count/3;a<l;a++)for(let c=0;c<3;c++){let h=3*a+c,d=3*a+(c+1)%3;s.fromBufferAttribute(o,h),r.fromBufferAttribute(o,d),Od(s,r,i)===!0&&(e.push(s.x,s.y,s.z),e.push(r.x,r.y,r.z))}}this.setAttribute("position",new Pe(e,3))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}};function Od(n,t,e){let i=`${n.x},${n.y},${n.z}-${t.x},${t.y},${t.z}`,s=`${t.x},${t.y},${t.z}-${n.x},${n.y},${n.z}`;return e.has(i)===!0||e.has(s)===!0?!1:(e.add(i),e.add(s),!0)}function Ds(n){let t={};for(let e in n){t[e]={};for(let i in n[e]){let s=n[e][i];if(Bd(s))s.isRenderTargetTexture?(Gt("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][i]=null):t[e][i]=s.clone();else if(Array.isArray(s))if(Bd(s[0])){let r=[];for(let o=0,a=s.length;o<a;o++)r[o]=s[o].clone();t[e][i]=r}else t[e][i]=s.slice();else t[e][i]=s}}return t}function cn(n){let t={};for(let e=0;e<n.length;e++){let i=Ds(n[e]);for(let s in i)t[s]=i[s]}return t}function Bd(n){return n&&(n.isColor||n.isMatrix3||n.isMatrix4||n.isVector2||n.isVector3||n.isVector4||n.isTexture||n.isQuaternion)}function Bm(n){let t=[];for(let e=0;e<n.length;e++)t.push(n[e].clone());return t}function Vh(n){let t=n.getRenderTarget();return t===null?n.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:ge.workingColorSpace}var If={clone:Ds,merge:cn},km=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,zm=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,On=class extends ki{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=km,this.fragmentShader=zm,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=Ds(t.uniforms),this.uniformsGroups=Bm(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this.defaultAttributeValues=Object.assign({},t.defaultAttributeValues),this.index0AttributeName=t.index0AttributeName,this.uniformsNeedUpdate=t.uniformsNeedUpdate,this}toJSON(t){let e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(let s in this.uniforms){let o=this.uniforms[s].value;o&&o.isTexture?e.uniforms[s]={type:"t",value:o.toJSON(t).uuid}:o&&o.isColor?e.uniforms[s]={type:"c",value:o.getHex()}:o&&o.isVector2?e.uniforms[s]={type:"v2",value:o.toArray()}:o&&o.isVector3?e.uniforms[s]={type:"v3",value:o.toArray()}:o&&o.isVector4?e.uniforms[s]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?e.uniforms[s]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?e.uniforms[s]={type:"m4",value:o.toArray()}:e.uniforms[s]={value:o}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;let i={};for(let s in this.extensions)this.extensions[s]===!0&&(i[s]=!0);return Object.keys(i).length>0&&(e.extensions=i),e}fromJSON(t,e){if(super.fromJSON(t,e),t.uniforms!==void 0)for(let i in t.uniforms){let s=t.uniforms[i];switch(this.uniforms[i]={},s.type){case"t":this.uniforms[i].value=e[s.value]||null;break;case"c":this.uniforms[i].value=new ae().setHex(s.value);break;case"v2":this.uniforms[i].value=new Zt().fromArray(s.value);break;case"v3":this.uniforms[i].value=new N().fromArray(s.value);break;case"v4":this.uniforms[i].value=new Ne().fromArray(s.value);break;case"m3":this.uniforms[i].value=new Qt().fromArray(s.value);break;case"m4":this.uniforms[i].value=new De().fromArray(s.value);break;default:this.uniforms[i].value=s.value}}if(t.defines!==void 0&&(this.defines=t.defines),t.vertexShader!==void 0&&(this.vertexShader=t.vertexShader),t.fragmentShader!==void 0&&(this.fragmentShader=t.fragmentShader),t.glslVersion!==void 0&&(this.glslVersion=t.glslVersion),t.extensions!==void 0)for(let i in t.extensions)this.extensions[i]=t.extensions[i];return t.lights!==void 0&&(this.lights=t.lights),t.clipping!==void 0&&(this.clipping=t.clipping),this}},qa=class extends On{constructor(t){super(t),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}},Ya=class extends ki{constructor(t){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new ae(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new ae(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Jl,this.normalScale=new Zt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Bi,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}},ho=class extends Ya{constructor(t){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new Zt(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return fe(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(e){this.ior=(1+.4*e)/(1-.4*e)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new ae(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new ae(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new ae(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._retroreflectivity=0,this._sheen=0,this._transmission=0,this.setValues(t)}get anisotropy(){return this._anisotropy}set anisotropy(t){this._anisotropy>0!=t>0&&this.version++,this._anisotropy=t}get clearcoat(){return this._clearcoat}set clearcoat(t){this._clearcoat>0!=t>0&&this.version++,this._clearcoat=t}get iridescence(){return this._iridescence}set iridescence(t){this._iridescence>0!=t>0&&this.version++,this._iridescence=t}get dispersion(){return this._dispersion}set dispersion(t){this._dispersion>0!=t>0&&this.version++,this._dispersion=t}get retroreflectivity(){return this._retroreflectivity}set retroreflectivity(t){this._retroreflectivity>0!=t>0&&this.version++,this._retroreflectivity=t}get sheen(){return this._sheen}set sheen(t){this._sheen>0!=t>0&&this.version++,this._sheen=t}get transmission(){return this._transmission}set transmission(t){this._transmission>0!=t>0&&this.version++,this._transmission=t}copy(t){return super.copy(t),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=t.anisotropy,this.anisotropyRotation=t.anisotropyRotation,this.anisotropyMap=t.anisotropyMap,this.clearcoat=t.clearcoat,this.clearcoatMap=t.clearcoatMap,this.clearcoatRoughness=t.clearcoatRoughness,this.clearcoatRoughnessMap=t.clearcoatRoughnessMap,this.clearcoatNormalMap=t.clearcoatNormalMap,this.clearcoatNormalScale.copy(t.clearcoatNormalScale),this.dispersion=t.dispersion,this.ior=t.ior,this.iridescence=t.iridescence,this.iridescenceMap=t.iridescenceMap,this.iridescenceIOR=t.iridescenceIOR,this.iridescenceThicknessRange=[...t.iridescenceThicknessRange],this.iridescenceThicknessMap=t.iridescenceThicknessMap,this.retroreflectivity=t.retroreflectivity,this.sheen=t.sheen,this.sheenColor.copy(t.sheenColor),this.sheenColorMap=t.sheenColorMap,this.sheenRoughness=t.sheenRoughness,this.sheenRoughnessMap=t.sheenRoughnessMap,this.transmission=t.transmission,this.transmissionMap=t.transmissionMap,this.thickness=t.thickness,this.thicknessMap=t.thicknessMap,this.attenuationDistance=t.attenuationDistance,this.attenuationColor.copy(t.attenuationColor),this.specularIntensity=t.specularIntensity,this.specularIntensityMap=t.specularIntensityMap,this.specularColor.copy(t.specularColor),this.specularColorMap=t.specularColorMap,this}};var Za=class extends ki{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=gf,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}},Ja=class extends ki{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}};var uo=class extends Ze{constructor(t){super(),this.isLineDashedMaterial=!0,this.type="LineDashedMaterial",this.scale=1,this.dashSize=3,this.gapSize=1,this.setValues(t)}copy(t){return super.copy(t),this.scale=t.scale,this.dashSize=t.dashSize,this.gapSize=t.gapSize,this}};function sr(n,t){return!n||n.constructor===t?n:typeof t.BYTES_PER_ELEMENT=="number"?new t(n):Array.prototype.slice.call(n)}function oh(n){return n!==void 0&&n.inTangents!==void 0&&n.outTangents!==void 0}var ss=class{constructor(t,e,i,s){this.parameterPositions=t,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new e.constructor(i),this.sampleValues=e,this.valueSize=i,this.settings=null,this.DefaultSettings_={}}evaluate(t){let e=this.parameterPositions,i=this._cachedIndex,s=e[i],r=e[i-1];t:{e:{let o;n:{i:if(!(t<s)){for(let a=i+2;;){if(s===void 0){if(t<r)break i;return i=e.length,this._cachedIndex=i,this.copySampleValue_(i-1)}if(i===a)break;if(r=s,s=e[++i],t<s)break e}o=e.length;break n}if(!(t>=r)){let a=e[1];t<a&&(i=2,r=a);for(let l=i-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(i===l)break;if(s=r,r=e[--i-1],t>=r)break e}o=i,i=0;break n}break t}for(;i<o;){let a=i+o>>>1;t<e[a]?o=a:i=a+1}if(s=e[i],r=e[i-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return i=e.length,this._cachedIndex=i,this.copySampleValue_(i-1)}this._cachedIndex=i,this.intervalChanged_(i,r,s)}return this.interpolate_(i,r,t,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(t){let e=this.resultBuffer,i=this.sampleValues,s=this.valueSize,r=t*s;for(let o=0;o!==s;++o)e[o]=i[r+o];return e}interpolate_(){throw new Error("THREE.Interpolant: Call to abstract method.")}intervalChanged_(){}},$a=class extends ss{constructor(t,e,i,s){super(t,e,i,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:hh,endingEnd:hh}}intervalChanged_(t,e,i){let s=this.parameterPositions,r=t-2,o=t+1,a=s[r],l=s[o];if(a===void 0)switch(this.getSettings_().endingStart){case uh:r=t,a=2*e-i;break;case dh:r=s.length-2,a=e+s[r]-s[r+1];break;default:r=t,a=i}if(l===void 0)switch(this.getSettings_().endingEnd){case uh:o=t,l=2*i-e;break;case dh:o=1,l=i+s[1]-s[0];break;default:o=t-1,l=e}let c=(i-e)*.5,h=this.valueSize;this._weightPrev=c/(e-a),this._weightNext=c/(l-i),this._offsetPrev=r*h,this._offsetNext=o*h}interpolate_(t,e,i,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=t*a,c=l-a,h=this._offsetPrev,d=this._offsetNext,u=this._weightPrev,f=this._weightNext,p=(i-e)/(s-e),x=p*p,g=x*p,m=-u*g+2*u*x-u*p,E=(1+u)*g+(-1.5-2*u)*x+(-.5+u)*p+1,C=(-1-f)*g+(1.5+f)*x+.5*p,M=f*g-f*x;for(let w=0;w!==a;++w)r[w]=m*o[h+w]+E*o[c+w]+C*o[l+w]+M*o[d+w];return r}},Ka=class extends ss{constructor(t,e,i,s){super(t,e,i,s)}interpolate_(t,e,i,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=t*a,c=l-a,h=(i-e)/(s-e),d=1-h;for(let u=0;u!==a;++u)r[u]=o[c+u]*d+o[l+u]*h;return r}},ja=class extends ss{constructor(t,e,i,s){super(t,e,i,s)}interpolate_(t){return this.copySampleValue_(t-1)}},Qa=class extends ss{interpolate_(t,e,i,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=t*a,c=l-a,h=this.inTangents,d=this.outTangents;if(!h||!d){let p=(i-e)/(s-e),x=1-p;for(let g=0;g!==a;++g)r[g]=o[c+g]*x+o[l+g]*p;return r}let u=a*2,f=t-1;for(let p=0;p!==a;++p){let x=o[c+p],g=o[l+p],m=f*u+p*2,E=d[m],C=d[m+1],M=t*u+p*2,w=h[M],v=h[M+1],S=Hm(i,e,E,w,s);r[p]=Lf(S,x,C,v,g)}return r}};function Lf(n,t,e,i,s){let r=1-n;return r*r*r*t+3*r*r*n*e+3*r*n*n*i+n*n*n*s}function Vm(n,t,e,i,s){let r=1-n;return 3*r*r*(e-t)+6*r*n*(i-e)+3*n*n*(s-i)}function Hm(n,t,e,i,s){let r=(n-t)/(s-t);for(let o=0;o<8;o++){let a=Lf(r,t,e,i,s)-n;if(Math.abs(a)<1e-10)break;let l=Vm(r,t,e,i,s);if(Math.abs(l)<1e-10)break;r=Math.max(0,Math.min(1,r-a/l))}return r}var Bn=class{constructor(t,e,i,s){if(t===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(e===void 0||e.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+t);this.name=t,this.times=sr(e,this.TimeBufferType),this.values=sr(i,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(t){let e=t.constructor,i;if(e.toJSON!==this.toJSON)i=e.toJSON(t);else{i={name:t.name,times:sr(t.times,Array),values:sr(t.values,Array)};let s=t.getInterpolation();s!==t.DefaultInterpolation&&(i.interpolation=s),oh(t.settings)&&(i.settings={inTangents:sr(t.settings.inTangents,Array),outTangents:sr(t.settings.outTangents,Array)})}return i.type=t.ValueTypeName,i}InterpolantFactoryMethodDiscrete(t){return new ja(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodLinear(t){return new Ka(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodSmooth(t){return new $a(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodBezier(t){let e=new Qa(this.times,this.values,this.getValueSize(),t);return this.settings&&(e.inTangents=this.settings.inTangents,e.outTangents=this.settings.outTangents),e}setInterpolation(t){let e;switch(t){case Qr:e=this.InterpolantFactoryMethodDiscrete;break;case Ba:e=this.InterpolantFactoryMethodLinear;break;case Aa:e=this.InterpolantFactoryMethodSmooth;break;case ch:e=this.InterpolantFactoryMethodBezier;break}if(e===void 0){let i="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(t!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(i);return Gt("KeyframeTrack:",i),this}return this.createInterpolant=e,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Qr;case this.InterpolantFactoryMethodLinear:return Ba;case this.InterpolantFactoryMethodSmooth:return Aa;case this.InterpolantFactoryMethodBezier:return ch}}getValueSize(){return this.values.length/this.times.length}shift(t){if(t!==0){let e=this.times;for(let i=0,s=e.length;i!==s;++i)e[i]+=t}return this}scale(t){if(t!==1){let e=this.times;for(let i=0,s=e.length;i!==s;++i)e[i]*=t;oh(this.settings)&&(kd(this.settings.inTangents,t),kd(this.settings.outTangents,t))}return this}trim(t,e){let i=this.times,s=i.length,r=0,o=s-1;for(;r!==s&&i[r]<t;)++r;for(;o!==-1&&i[o]>e;)--o;if(++o,r!==0||o!==s){r>=o&&(o=Math.max(o,1),r=o-1);let a=this.getValueSize();this.times=i.slice(r,o),this.values=this.values.slice(r*a,o*a)}return this}validate(){let t=!0,e=this.getValueSize();e-Math.floor(e)!==0&&(Jt("KeyframeTrack: Invalid value size in track.",this),t=!1);let i=this.times,s=this.values,r=i.length;r===0&&(Jt("KeyframeTrack: Track is empty.",this),t=!1);let o=null;for(let a=0;a!==r;a++){let l=i[a];if(typeof l=="number"&&isNaN(l)){Jt("KeyframeTrack: Time is not a valid number.",this,a,l),t=!1;break}if(o!==null&&o>l){Jt("KeyframeTrack: Out of order keys.",this,a,l,o),t=!1;break}o=l}if(s!==void 0&&im(s))for(let a=0,l=s.length;a!==l;++a){let c=s[a];if(isNaN(c)){Jt("KeyframeTrack: Value is not a valid number.",this,a,c),t=!1;break}}return t}optimize(){let t=this.times.slice(),e=this.values.slice(),i=this.getValueSize(),s=this.getInterpolation()===Aa,r=t.length-1,o=1;for(let a=1;a<r;++a){let l=!1,c=t[a],h=t[a+1];if(c!==h&&(a!==1||c!==t[0]))if(s)l=!0;else{let d=a*i,u=d-i,f=d+i;for(let p=0;p!==i;++p){let x=e[d+p];if(x!==e[u+p]||x!==e[f+p]){l=!0;break}}}if(l){if(a!==o){t[o]=t[a];let d=a*i,u=o*i;for(let f=0;f!==i;++f)e[u+f]=e[d+f]}++o}}if(r>0){t[o]=t[r];for(let a=r*i,l=o*i,c=0;c!==i;++c)e[l+c]=e[a+c];++o}return o!==t.length?(this.times=t.slice(0,o),this.values=e.slice(0,o*i)):(this.times=t,this.values=e),this}clone(){let t=this.times.slice(),e=this.values.slice(),i=this.constructor,s=new i(this.name,t,e);return s.createInterpolant=this.createInterpolant,oh(this.settings)&&(s.settings={inTangents:this.settings.inTangents.slice(),outTangents:this.settings.outTangents.slice()}),s}};function kd(n,t){for(let e=0,i=n.length;e!==i;e+=2)n[e]*=t}Bn.prototype.ValueTypeName="";Bn.prototype.TimeBufferType=Float32Array;Bn.prototype.ValueBufferType=Float32Array;Bn.prototype.DefaultInterpolation=Ba;var rs=class extends Bn{constructor(t,e,i){super(t,e,i)}};rs.prototype.ValueTypeName="bool";rs.prototype.ValueBufferType=Array;rs.prototype.DefaultInterpolation=Qr;rs.prototype.InterpolantFactoryMethodLinear=void 0;rs.prototype.InterpolantFactoryMethodSmooth=void 0;var tl=class extends Bn{constructor(t,e,i,s){super(t,e,i,s)}};tl.prototype.ValueTypeName="color";var el=class extends Bn{constructor(t,e,i,s){super(t,e,i,s)}};el.prototype.ValueTypeName="number";var nl=class extends ss{constructor(t,e,i,s){super(t,e,i,s)}interpolate_(t,e,i,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=(i-e)/(s-e),c=t*a;for(let h=c+a;c!==h;c+=4)Un.slerpFlat(r,0,o,c-a,o,c,l);return r}},fo=class extends Bn{constructor(t,e,i,s){super(t,e,i,s)}InterpolantFactoryMethodLinear(t){return new nl(this.times,this.values,this.getValueSize(),t)}};fo.prototype.ValueTypeName="quaternion";fo.prototype.InterpolantFactoryMethodSmooth=void 0;var os=class extends Bn{constructor(t,e,i){super(t,e,i)}};os.prototype.ValueTypeName="string";os.prototype.ValueBufferType=Array;os.prototype.DefaultInterpolation=Qr;os.prototype.InterpolantFactoryMethodLinear=void 0;os.prototype.InterpolantFactoryMethodSmooth=void 0;var il=class extends Bn{constructor(t,e,i,s){super(t,e,i,s)}};il.prototype.ValueTypeName="vector";var sl=class{constructor(t,e,i){let s=this,r=!1,o=0,a=0,l,c=[];this.onStart=void 0,this.onLoad=t,this.onProgress=e,this.onError=i,this._abortController=null,this.itemStart=function(h){a++,r===!1&&s.onStart!==void 0&&s.onStart(h,o,a),r=!0},this.itemEnd=function(h){o++,s.onProgress!==void 0&&s.onProgress(h,o,a),o===a&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(h){s.onError!==void 0&&s.onError(h)},this.resolveURL=function(h){return h=h.normalize("NFC"),l?l(h):h},this.setURLModifier=function(h){return l=h,this},this.addHandler=function(h,d){return c.push(h,d),this},this.removeHandler=function(h){let d=c.indexOf(h);return d!==-1&&c.splice(d,2),this},this.getHandler=function(h){for(let d=0,u=c.length;d<u;d+=2){let f=c[d],p=c[d+1];if(f.global&&(f.lastIndex=0),f.test(h))return p}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||(this._abortController=new AbortController),this._abortController}},Df=new sl,rl=class{constructor(t){this.manager=t!==void 0?t:Df,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}load(){}loadAsync(t,e){let i=this;return new Promise(function(s,r){i.load(t,s,e,r)})}parse(){}setCrossOrigin(t){return this.crossOrigin=t,this}setWithCredentials(t){return this.withCredentials=t,this}setPath(t){return this.path=t,this}setResourcePath(t){return this.resourcePath=t,this}setRequestHeader(t){return this.requestHeader=t,this}abort(){return this}};rl.DEFAULT_MATERIAL_NAME="__DEFAULT";var po=class extends tn{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new ae(t),this.intensity=e}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){let e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,e}},mo=class extends po{constructor(t,e,i){super(t,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(tn.DEFAULT_UP),this.updateMatrix(),this.groundColor=new ae(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}toJSON(t){let e=super.toJSON(t);return e.object.groundColor=this.groundColor.getHex(),e}},ah=new De,zd=new N,Vd=new N,ol=class{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Zt(512,512),this.mapType=wn,this.map=null,this.mapPass=null,this.matrix=new De,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new _r,this._frameExtents=new Zt(1,1),this._viewportCount=1,this._viewports=[new Ne(0,0,1,1)]}getViewportCount(){return this._viewportCount}getCamera(){return this.camera}getFrustum(){return this._frustum}updateMatrices(t){let e=this.camera;zd.setFromMatrixPosition(t.matrixWorld),e.position.copy(zd),Vd.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(Vd),e.updateMatrixWorld(),this._updateMatrix(e,this.matrix,this._frustum)}_updateMatrix(t,e,i,s){ah.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),i.setFromProjectionMatrix(ah,t.coordinateSystem,t.reversedDepth);let r=this._frameExtents,o=s?s.z/r.x:1,a=s?s.w/r.y:1,l=s?s.x/r.x:0,c=s?s.y/r.y:0;t.coordinateSystem===ur||t.reversedDepth?e.set(.5*o,0,0,.5*o+l,0,.5*a,0,.5*a+c,0,0,1,0,0,0,0,1):e.set(.5*o,0,0,.5*o+l,0,.5*a,0,.5*a+c,0,0,.5,.5,0,0,0,1),e.multiply(ah)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.autoUpdate=t.autoUpdate,this.needsUpdate=t.needsUpdate,this.normalBias=t.normalBias,this.blurSamples=t.blurSamples,this.mapSize.copy(t.mapSize),this.biasNode=t.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){let t={};return t.intensity=this.intensity,t.bias=this.bias,t.normalBias=this.normalBias,t.radius=this.radius,t.blurSamples=this.blurSamples,t.mapSize=this.mapSize.toArray(),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}},Ta=new N,Ea=new Un,yi=new N,go=class extends tn{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new De,this.projectionMatrix=new De,this.projectionMatrixInverse=new De,this.coordinateSystem=ei,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorld.decompose(Ta,Ea,yi),yi.x===1&&yi.y===1&&yi.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Ta,Ea,yi.set(1,1,1)).invert()}updateWorldMatrix(t,e,i=!1){super.updateWorldMatrix(t,e,i),this.matrixWorld.decompose(Ta,Ea,yi),yi.x===1&&yi.y===1&&yi.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Ta,Ea,yi.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}},Qi=new N,Hd=new Zt,Gd=new Zt,ln=class extends go{constructor(t=50,e=1,i=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=i,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){let e=.5*this.getFilmHeight()/t;this.fov=fr*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){let t=Math.tan(lr*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return fr*2*Math.atan(Math.tan(lr*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,i){Qi.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(Qi.x,Qi.y).multiplyScalar(-t/Qi.z),Qi.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(Qi.x,Qi.y).multiplyScalar(-t/Qi.z)}getViewSize(t,e){return this.getViewBounds(t,Hd,Gd),e.subVectors(Gd,Hd)}setViewOffset(t,e,i,s,r,o){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=this.near,e=t*Math.tan(lr*.5*this.fov)/this.zoom,i=2*e,s=this.aspect*i,r=-.5*s,o=this.view;if(this.view!==null&&this.view.enabled){let l=o.fullWidth,c=o.fullHeight;r+=o.offsetX*s/l,e-=o.offsetY*i/c,s*=o.width/l,i*=o.height/c}let a=this.filmOffset;a!==0&&(r+=t*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,e,e-i,t,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}};var yr=class extends go{constructor(t=-1,e=1,i=1,s=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=i,this.bottom=s,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,i,s,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,s=(this.top+this.bottom)/2,r=i-t,o=i+t,a=s+e,l=s-e;if(this.view!==null&&this.view.enabled){let c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,o=r+c*this.view.width,a-=h*this.view.offsetY,l=a-h*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}},fh=class extends ol{constructor(){super(new yr(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},vr=class extends po{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(tn.DEFAULT_UP),this.updateMatrix(),this.target=new tn,this.shadow=new fh}dispose(){super.dispose(),this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}toJSON(t){let e=super.toJSON(t);return e.object.shadow=this.shadow.toJSON(),e.object.target=this.target.uuid,e}};var rr=-90,or=1,al=class extends tn{constructor(t,e,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;let s=new ln(rr,or,t,e);s.layers=this.layers,this.add(s);let r=new ln(rr,or,t,e);r.layers=this.layers,this.add(r);let o=new ln(rr,or,t,e);o.layers=this.layers,this.add(o);let a=new ln(rr,or,t,e);a.layers=this.layers,this.add(a);let l=new ln(rr,or,t,e);l.layers=this.layers,this.add(l);let c=new ln(rr,or,t,e);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let t=this.coordinateSystem,e=this.children.concat(),[i,s,r,o,a,l]=e;for(let c of e)this.remove(c);if(t===ei)i.up.set(0,1,0),i.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===ur)i.up.set(0,-1,0),i.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(let c of e)this.add(c),c.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();let{renderTarget:i,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());let[r,o,a,l,c,h]=this.children,d=t.getRenderTarget(),u=t.getActiveCubeFace(),f=t.getActiveMipmapLevel(),p=t.xr.enabled;t.xr.enabled=!1;let x=i.texture.generateMipmaps;i.texture.generateMipmaps=!1;let g=!1;t.isWebGLRenderer===!0?g=t.state.buffers.depth.getReversed():g=t.reversedDepthBuffer,t.setRenderTarget(i,0,s),g&&t.autoClear===!1&&t.clearDepth(),t.render(e,r),t.setRenderTarget(i,1,s),g&&t.autoClear===!1&&t.clearDepth(),t.render(e,o),t.setRenderTarget(i,2,s),g&&t.autoClear===!1&&t.clearDepth(),t.render(e,a),t.setRenderTarget(i,3,s),g&&t.autoClear===!1&&t.clearDepth(),t.render(e,l),t.setRenderTarget(i,4,s),g&&t.autoClear===!1&&t.clearDepth(),t.render(e,c),i.texture.generateMipmaps=x,t.setRenderTarget(i,5,s),g&&t.autoClear===!1&&t.clearDepth(),t.render(e,h),t.setRenderTarget(d,u,f),t.xr.enabled=p,i.texture.needsPMREMUpdate=!0}},ll=class extends ln{constructor(t=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=t}};var Hh="\\[\\]\\.:\\/",Gm=new RegExp("["+Hh+"]","g"),Gh="[^"+Hh+"]",Wm="[^"+Hh.replace("\\.","")+"]",Xm=/((?:WC+[\/:])*)/.source.replace("WC",Gh),qm=/(WCOD+)?/.source.replace("WCOD",Wm),Ym=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",Gh),Zm=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",Gh),Jm=new RegExp("^"+Xm+qm+Ym+Zm+"$"),$m=["material","materials","bones","map"],ph=class{constructor(t,e,i){let s=i||Le.parseTrackName(e);this._targetGroup=t,this._bindings=t.subscribe_(e,s)}getValue(t,e){this.bind();let i=this._targetGroup.nCachedObjects_,s=this._bindings[i];s!==void 0&&s.getValue(t,e)}setValue(t,e){let i=this._bindings;for(let s=this._targetGroup.nCachedObjects_,r=i.length;s!==r;++s)i[s].setValue(t,e)}bind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,i=t.length;e!==i;++e)t[e].bind()}unbind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,i=t.length;e!==i;++e)t[e].unbind()}},Le=class n{constructor(t,e,i){this.path=e,this.parsedPath=i||n.parseTrackName(e),this.node=n.findNode(t,this.parsedPath.nodeName),this.rootNode=t,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(t,e,i){return t&&t.isAnimationObjectGroup?new n.Composite(t,e,i):new n(t,e,i)}static sanitizeNodeName(t){return t.replace(/\s/g,"_").replace(Gm,"")}static parseTrackName(t){let e=Jm.exec(t);if(e===null)throw new Error("THREE.PropertyBinding: Cannot parse trackName: "+t);let i={nodeName:e[2],objectName:e[3],objectIndex:e[4],propertyName:e[5],propertyIndex:e[6]},s=i.nodeName&&i.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){let r=i.nodeName.substring(s+1);$m.indexOf(r)!==-1&&(i.nodeName=i.nodeName.substring(0,s),i.objectName=r)}if(i.propertyName===null||i.propertyName.length===0)throw new Error("THREE.PropertyBinding: can not parse propertyName from trackName: "+t);return i}static findNode(t,e){if(e===void 0||e===""||e==="."||e===-1||e===t.name||e===t.uuid)return t;if(t.skeleton){let i=t.skeleton.getBoneByName(e);if(i!==void 0)return i}if(t.children){let i=function(r){for(let o=0;o<r.length;o++){let a=r[o];if(a.name===e||a.uuid===e)return a;let l=i(a.children);if(l)return l}return null},s=i(t.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(t,e){t[e]=this.targetObject[this.propertyName]}_getValue_array(t,e){let i=this.resolvedProperty;for(let s=0,r=i.length;s!==r;++s)t[e++]=i[s]}_getValue_arrayElement(t,e){t[e]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(t,e){this.resolvedProperty.toArray(t,e)}_setValue_direct(t,e){this.targetObject[this.propertyName]=t[e]}_setValue_direct_setNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(t,e){let i=this.resolvedProperty;for(let s=0,r=i.length;s!==r;++s)i[s]=t[e++]}_setValue_array_setNeedsUpdate(t,e){let i=this.resolvedProperty;for(let s=0,r=i.length;s!==r;++s)i[s]=t[e++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(t,e){let i=this.resolvedProperty;for(let s=0,r=i.length;s!==r;++s)i[s]=t[e++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(t,e){this.resolvedProperty[this.propertyIndex]=t[e]}_setValue_arrayElement_setNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(t,e){this.resolvedProperty.fromArray(t,e)}_setValue_fromArray_setNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(t,e){this.bind(),this.getValue(t,e)}_setValue_unbound(t,e){this.bind(),this.setValue(t,e)}bind(){let t=this.node,e=this.parsedPath,i=e.objectName,s=e.propertyName,r=e.propertyIndex;if(t||(t=n.findNode(this.rootNode,e.nodeName),this.node=t),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!t){Gt("PropertyBinding: No target node found for track: "+this.path+".");return}if(i){let c=e.objectIndex;switch(i){case"materials":if(!t.material){Jt("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.materials){Jt("PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}t=t.material.materials;break;case"bones":if(!t.skeleton){Jt("PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}t=t.skeleton.bones;for(let h=0;h<t.length;h++)if(t[h].name===c){c=h;break}break;case"map":if("map"in t){t=t.map;break}if(!t.material){Jt("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.map){Jt("PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}t=t.material.map;break;default:if(t[i]===void 0){Jt("PropertyBinding: Can not bind to objectName of node undefined.",this);return}t=t[i]}if(c!==void 0){if(t[c]===void 0){Jt("PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,t);return}t=t[c]}}let o=t[s];if(o===void 0){let c=e.nodeName;Jt("PropertyBinding: Trying to update property for track: "+c+"."+s+" but it wasn't found.",t);return}let a=this.Versioning.None;this.targetObject=t,t.isMaterial===!0?a=this.Versioning.NeedsUpdate:t.isObject3D===!0&&(a=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(r!==void 0){if(s==="morphTargetInfluences"){if(!t.geometry){Jt("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!t.geometry.morphAttributes){Jt("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}t.morphTargetDictionary[r]!==void 0&&(r=t.morphTargetDictionary[r])}l=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=r}else o.fromArray!==void 0&&o.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(l=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=s;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][a]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};Le.Composite=ph;Le.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};Le.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};Le.prototype.GetterByBindingType=[Le.prototype._getValue_direct,Le.prototype._getValue_array,Le.prototype._getValue_arrayElement,Le.prototype._getValue_toArray];Le.prototype.SetterByBindingTypeAndVersioning=[[Le.prototype._setValue_direct,Le.prototype._setValue_direct_setNeedsUpdate,Le.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[Le.prototype._setValue_array,Le.prototype._setValue_array_setNeedsUpdate,Le.prototype._setValue_array_setMatrixWorldNeedsUpdate],[Le.prototype._setValue_arrayElement,Le.prototype._setValue_arrayElement_setNeedsUpdate,Le.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[Le.prototype._setValue_fromArray,Le.prototype._setValue_fromArray_setNeedsUpdate,Le.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var tb=new Float32Array(1);var Mr=class{constructor(t=1,e=0,i=0){this.radius=t,this.phi=e,this.theta=i}set(t,e,i){return this.radius=t,this.phi=e,this.theta=i,this}copy(t){return this.radius=t.radius,this.phi=t.phi,this.theta=t.theta,this}makeSafe(){return this.phi=fe(this.phi,1e-6,Math.PI-1e-6),this}setFromVector3(t){return this.setFromCartesianCoords(t.x,t.y,t.z)}setFromCartesianCoords(t,e,i){return this.radius=Math.sqrt(t*t+e*e+i*i),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(t,i),this.phi=Math.acos(fe(e/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}};var Jh=class Jh{constructor(t,e,i,s){this.elements=[1,0,0,1],t!==void 0&&this.set(t,e,i,s)}identity(){return this.set(1,0,0,1),this}fromArray(t,e=0){for(let i=0;i<4;i++)this.elements[i]=t[i+e];return this}set(t,e,i,s){let r=this.elements;return r[0]=t,r[2]=e,r[1]=i,r[3]=s,this}};Jh.prototype.isMatrix2=!0;var mh=Jh;var Wd=new N,wa,lh,si=class extends tn{constructor(t=new N(0,0,1),e=new N(0,0,0),i=1,s=16776960,r=i*.2,o=r*.2){super(),this.type="ArrowHelper",wa===void 0&&(wa=new Xe,wa.setAttribute("position",new Pe([0,0,0,0,1,0],3)),lh=new ii(.5,1,5,1),lh.translate(0,-.5,0)),this.position.copy(e),this.line=new Cs(wa,new Ze({color:s,toneMapped:!1})),this.line.matrixAutoUpdate=!1,this.add(this.line),this.cone=new gn(lh,new gr({color:s,toneMapped:!1})),this.cone.matrixAutoUpdate=!1,this.add(this.cone),this.setDirection(t),this.setLength(i,r,o)}setDirection(t){if(t.y>.99999)this.quaternion.set(0,0,0,1);else if(t.y<-.99999)this.quaternion.set(1,0,0,0);else{Wd.set(t.z,0,-t.x).normalize();let e=Math.acos(t.y);this.quaternion.setFromAxisAngle(Wd,e)}}setLength(t,e=t*.2,i=e*.2){this.line.scale.set(1,Math.max(1e-4,t-e),1),this.line.updateMatrix(),this.cone.scale.set(i,e,i),this.cone.position.y=t,this.cone.updateMatrix()}setColor(t){this.line.material.color.set(t),this.cone.material.color.set(t)}copy(t){return super.copy(t,!1),this.line.copy(t.line),this.cone.copy(t.cone),this}dispose(){super.dispose(),this.line.geometry.dispose(),this.line.material.dispose(),this.cone.geometry.dispose(),this.cone.material.dispose()}};var _o=class extends ni{constructor(t,e=null){super(),this.object=t,this.domElement=e,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(t){this.domElement!==null&&this.disconnect(),this.domElement=t}disconnect(){}dispose(){}update(){}};function Wh(n,t,e,i){let s=Km(i);switch(e){case Nh:return n*t;case Fh:return n*t/s.components*s.byteLength;case gl:return n*t/s.components*s.byteLength;case fs:return n*t*2/s.components*s.byteLength;case _l:return n*t*2/s.components*s.byteLength;case Uh:return n*t*3/s.components*s.byteLength;case Jn:return n*t*4/s.components*s.byteLength;case xl:return n*t*4/s.components*s.byteLength;case bo:case So:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*8;case To:case Eo:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case vl:case bl:return Math.max(n,16)*Math.max(t,8)/4;case yl:case Ml:return Math.max(n,8)*Math.max(t,8)/2;case Sl:case Tl:case wl:case Al:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*8;case El:case wo:case Rl:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case Cl:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case Pl:return Math.floor((n+4)/5)*Math.floor((t+3)/4)*16;case Il:return Math.floor((n+4)/5)*Math.floor((t+4)/5)*16;case Ll:return Math.floor((n+5)/6)*Math.floor((t+4)/5)*16;case Dl:return Math.floor((n+5)/6)*Math.floor((t+5)/6)*16;case Nl:return Math.floor((n+7)/8)*Math.floor((t+4)/5)*16;case Ul:return Math.floor((n+7)/8)*Math.floor((t+5)/6)*16;case Fl:return Math.floor((n+7)/8)*Math.floor((t+7)/8)*16;case Ol:return Math.floor((n+9)/10)*Math.floor((t+4)/5)*16;case Bl:return Math.floor((n+9)/10)*Math.floor((t+5)/6)*16;case kl:return Math.floor((n+9)/10)*Math.floor((t+7)/8)*16;case zl:return Math.floor((n+9)/10)*Math.floor((t+9)/10)*16;case Vl:return Math.floor((n+11)/12)*Math.floor((t+9)/10)*16;case Hl:return Math.floor((n+11)/12)*Math.floor((t+11)/12)*16;case Gl:case Wl:case Xl:return Math.ceil(n/4)*Math.ceil(t/4)*16;case ql:case Yl:return Math.ceil(n/4)*Math.ceil(t/4)*8;case Ao:case Zl:return Math.ceil(n/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function Km(n){switch(n){case wn:case Ph:return{byteLength:1,components:1};case Tr:case Ih:case li:return{byteLength:2,components:1};case pl:case ml:return{byteLength:2,components:4};case oi:case fl:case ai:return{byteLength:4,components:1};case Lh:case Dh:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${n}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"186"}}));typeof window<"u"&&(window.__THREE__?Gt("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="186");function ep(){let n=null,t=!1,e=null,i=null;function s(r,o){i=n.requestAnimationFrame(s),e(r,o)}return{start:function(){t!==!0&&e!==null&&n!==null&&(i=n.requestAnimationFrame(s),t=!0)},stop:function(){n!==null&&n.cancelAnimationFrame(i),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){n=r}}}function Qm(n){let t=new WeakMap;function e(a,l){let c=a.array,h=a.usage,d=c.byteLength,u=n.createBuffer();n.bindBuffer(l,u),n.bufferData(l,c,h),a.onUploadCallback();let f;if(c instanceof Float32Array)f=n.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)f=n.HALF_FLOAT;else if(c instanceof Uint16Array)a.isFloat16BufferAttribute?f=n.HALF_FLOAT:f=n.UNSIGNED_SHORT;else if(c instanceof Int16Array)f=n.SHORT;else if(c instanceof Uint32Array)f=n.UNSIGNED_INT;else if(c instanceof Int32Array)f=n.INT;else if(c instanceof Int8Array)f=n.BYTE;else if(c instanceof Uint8Array)f=n.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)f=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:u,type:f,bytesPerElement:c.BYTES_PER_ELEMENT,version:a.version,size:d}}function i(a,l,c){let h=l.array,d=l.updateRanges;if(n.bindBuffer(c,a),d.length===0)n.bufferSubData(c,0,h);else{d.sort((f,p)=>f.start-p.start);let u=0;for(let f=1;f<d.length;f++){let p=d[u],x=d[f];x.start<=p.start+p.count+1?p.count=Math.max(p.count,x.start+x.count-p.start):(++u,d[u]=x)}d.length=u+1;for(let f=0,p=d.length;f<p;f++){let x=d[f];n.bufferSubData(c,x.start*h.BYTES_PER_ELEMENT,h,x.start,x.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(a){return a.isInterleavedBufferAttribute&&(a=a.data),t.get(a)}function r(a){a.isInterleavedBufferAttribute&&(a=a.data);let l=t.get(a);l&&(n.deleteBuffer(l.buffer),t.delete(a))}function o(a,l){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){let h=t.get(a);(!h||h.version<a.version)&&t.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}let c=t.get(a);if(c===void 0)t.set(a,e(a,l));else if(c.version<a.version){if(c.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(c.buffer,a,l),c.version=a.version}}return{get:s,remove:r,update:o}}var tg=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,eg=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,ng=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,ig=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,sg=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,rg=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,og=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT )
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN )
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,ag=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,lg=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,cg=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,hg=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,ug=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,dg=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,fg=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,pg=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,mg=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,gg=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,_g=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,xg=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,yg=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,vg=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,Mg=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,bg=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,Sg=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
#define inverseTransformDirection transformDirectionByInverseViewMatrix
vec3 transformNormalByInverseViewMatrix( in vec3 normal, in mat4 viewMatrix ) {
	return normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );
}
vec3 transformDirectionByInverseViewMatrix( in vec3 dir, in mat4 viewMatrix ) {
	return normalize( ( vec4( dir, 0.0 ) * viewMatrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,Tg=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,Eg=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
#endif`,wg=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Ag=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Rg=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Cg=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Pg="gl_FragColor = linearToOutputTexel( gl_FragColor );",Ig=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Lg=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,Dg=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,Ng=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,Ug=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS

		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Fg=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,Og=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Bg=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,kg=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,zg=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Vg=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,Hg=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Gg=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Wg=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Xg=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_SUN_LIGHTS > 0
	struct SunLight {
		vec3 direction;
		vec3 color;
	};
	uniform SunLight sunLights[ NUM_SUN_LIGHTS ];
	void getSunLightInfo( const in SunLight sunLight, out IncidentLight light ) {
		light.color = sunLight.color;
		light.direction = sunLight.direction;
		light.visible = true;
	}
#endif
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,qg=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_RETROREFLECTION
		vec3 getIBLRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 retroVec = normalize( mix( viewDir, normal, pow4( roughness ) ) );
				retroVec = transformDirectionByInverseViewMatrix( retroVec, viewMatrix );
				vec4 envMapColor = textureCubeUV( envMap, envMapRotation * retroVec, roughness );
				return envMapColor.rgb * envMapIntensity;
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
		#ifdef USE_RETROREFLECTION
			vec3 getIBLAnisotropyRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
				#ifdef ENVMAP_TYPE_CUBE_UV
					vec3 bentNormal = cross( bitangent, viewDir );
					bentNormal = normalize( cross( bentNormal, bitangent ) );
					bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
					return getIBLRetroRadiance( viewDir, bentNormal, roughness );
				#else
					return vec3( 0.0 );
				#endif
			}
		#endif
	#endif
#endif`,Yg=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Zg=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Jg=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,$g=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Kg=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_RETROREFLECTION
	material.retroreflectivity = retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,jg=`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	vec2 dfg;
	vec3 multiScatteringCompensation;
	#ifdef USE_RETROREFLECTION
		float retroreflectivity;
	#endif
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0Dielectric;
		vec3 iridescenceF0Metallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec2 fab, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec2 fab, const in vec3 specularColor, const in float specularF90, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN

		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );

		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );

		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );

		irradiance *= sheenEnergyComp;

	#endif
	vec3 specularBRDF = BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	#ifdef USE_RETROREFLECTION
		vec3 retroViewDir = reflect( - geometryViewDir, geometryNormal );
		vec3 retroSpecularBRDF = BRDF_GGX( directLight.direction, retroViewDir, geometryNormal, material );
		specularBRDF = mix( specularBRDF, retroSpecularBRDF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directSpecular += irradiance * specularBRDF * material.multiScatteringCompensation;
	vec3 halfDir = normalize( directLight.direction + geometryViewDir );
	float dotVH = saturate( dot( geometryViewDir, halfDir ) );
	vec3 F = F_Schlick( material.specularColor, material.specularF90, dotVH );
	#ifdef USE_RETROREFLECTION
		vec3 retroHalfDir = normalize( directLight.direction + retroViewDir );
		float dotRetroVH = saturate( dot( retroViewDir, retroHalfDir ) );
		vec3 retroF = F_Schlick( material.specularColor, material.specularF90, dotRetroVH );
		F = mix( F, retroF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - F );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScattering, multiScattering );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScattering, multiScattering );
	#endif
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - singleScattering - multiScattering );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		sheenSpecularIndirect += irradiance * material.sheenColor * sheenAlbedo * RECIPROCAL_PI;
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( material.dfg, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceF0Metallic, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( material.dfg, material.diffuseColor, material.specularF90, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,Qg=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		vec3 iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		vec3 iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( iridescenceFresnelDielectric, iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0Dielectric = Schlick_to_F0( iridescenceFresnelDielectric, 1.0, dotNVi );
		material.iridescenceF0Metallic = Schlick_to_F0( iridescenceFresnelMetallic, 1.0, dotNVi );
	}
#endif
#ifdef STANDARD
	float dotNVms = saturate( dot( geometryNormal, geometryViewDir ) );
	material.dfg = texture2D( dfgLUT, vec2( material.roughness, dotNVms ) ).rg;
	#if ( NUM_SUN_LIGHTS > 0 || NUM_DIR_LIGHTS > 0 || NUM_POINT_LIGHTS > 0 || NUM_SPOT_LIGHTS > 0 )
		float EssMs = material.dfg.x + material.dfg.y;
		material.multiScatteringCompensation = 1.0 + material.specularColorBlended * ( 1.0 / EssMs - 1.0 );
	#endif
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SUN_LIGHTS > 0 ) && defined( RE_Direct )
	SunLight sunLight;
	#if defined( USE_SHADOWMAP ) && NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHTS; i ++ ) {
		sunLight = sunLights[ i ];
		getSunLightInfo( sunLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SUN_LIGHT_SHADOWS )
		sunLightShadow = sunLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getSunShadow( sunShadowMap[ i ], sunLightShadow, UNROLLED_LOOP_INDEX ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#ifdef USE_LIGHT_PROBES_GRID
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );
		irradiance += getLightProbeGridIrradiance( probeWorldPos, probeWorldNormal );
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,t0=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_CUBE_UV )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		vec3 iblRadiance = getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		vec3 iblRadiance = getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_RETROREFLECTION
		#ifdef USE_ANISOTROPY
			vec3 retroIBLRadiance = getIBLAnisotropyRetroRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
		#else
			vec3 retroIBLRadiance = getIBLRetroRadiance( geometryViewDir, geometryNormal, material.roughness );
		#endif
		iblRadiance = mix( iblRadiance, retroIBLRadiance, saturate( material.retroreflectivity ) );
	#endif
	radiance += iblRadiance;
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,e0=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,n0=`#ifdef USE_LIGHT_PROBES_GRID
uniform highp sampler3D probesSH;
uniform vec3 probesMin;
uniform vec3 probesMax;
uniform vec3 probesResolution;
vec3 getLightProbeGridIrradiance( vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 resMinusOne = res - 1.0;
	vec3 probeSpacing = gridRange / resMinusOne;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.0, 1.0 );
	uvw = uvw * resMinusOne / res + 0.5 / res;
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,i0=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,s0=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,r0=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,o0=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,a0=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,l0=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,c0=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,h0=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,u0=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,d0=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,f0=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,p0=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,m0=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,g0=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,_0=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,x0=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#ifdef DOUBLE_SIDED
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#ifdef DOUBLE_SIDED
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,y0=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,v0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,M0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,b0=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,S0=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,T0=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,E0=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,w0=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,A0=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,R0=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,C0=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER

		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {

	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,P0=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,I0=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,L0=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,D0=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,N0=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,U0=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,F0=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		#define SUN_LIGHT_CASCADES 2
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#else
			uniform sampler2D sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#endif
		uniform mat4 sunShadowMatrix[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		uniform vec4 sunShadowCascade[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
		struct SunLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SunLightShadow sunLightShadows[ NUM_SUN_LIGHT_SHADOWS ];
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif

				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_SUN_LIGHT_SHADOWS > 0
		float getSunShadow(
			#if defined( SHADOWMAP_TYPE_PCF )
				sampler2DShadow shadowMap,
			#else
				sampler2D shadowMap,
			#endif
			SunLightShadow sunLightShadow,
			int shadowIndex
		) {
			vec4 shadowWorldPosition = vec4( vSunShadowWorldPosition.xyz + vSunShadowWorldNormal * sunLightShadow.shadowNormalBias, 1.0 );
			float viewDepth = vSunShadowWorldPosition.w;
			int cascadeOffset = shadowIndex * SUN_LIGHT_CASCADES;
			float shadow = 1.0;
			for ( int i = SUN_LIGHT_CASCADES - 1; i >= 0; i -- ) {
				vec4 cascade = sunShadowCascade[ cascadeOffset + i ];
				if ( viewDepth >= cascade.x && viewDepth < cascade.y ) {
					float cascadeShadow = getShadow(
						shadowMap,
						sunLightShadow.shadowMapSize,
						sunLightShadow.shadowIntensity,
						sunLightShadow.shadowBias,
						sunLightShadow.shadowRadius,
						sunShadowMatrix[ cascadeOffset + i ] * shadowWorldPosition
					);
					shadow = mix( cascadeShadow, shadow, smoothstep( cascade.z, cascade.y, viewDepth ) );
				}
			}
			return shadow;
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float dp = ( shadowCameraNear * ( shadowCameraFar - viewSpaceZ ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp -= shadowBias;
			#else
				float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp += shadowBias;
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			vec2 sample0 = vogelDiskSample( 0, 5, phi );
			vec2 sample1 = vogelDiskSample( 1, 5, phi );
			vec2 sample2 = vogelDiskSample( 2, 5, phi );
			vec2 sample3 = vogelDiskSample( 3, 5, phi );
			vec2 sample4 = vogelDiskSample( 4, 5, phi );
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * sample0.x + bitangent * sample0.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample1.x + bitangent * sample1.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample2.x + bitangent * sample2.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample3.x + bitangent * sample3.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample4.x + bitangent * sample4.y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,O0=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,B0=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_SUN_LIGHT_SHADOWS > 0
		vSunShadowWorldPosition = vec4( worldPosition.xyz, - mvPosition.z );
		vSunShadowWorldNormal = shadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,k0=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHT_SHADOWS; i ++ ) {
		sunLight = sunLightShadows[ i ];
		shadow *= receiveShadow ? getSunShadow( sunShadowMap[ i ], sunLight, UNROLLED_LOOP_INDEX ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,z0=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,V0=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,H0=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,G0=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,W0=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,X0=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,q0=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Y0=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,Z0=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,J0=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,$0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,K0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,j0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,Q0=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,t_=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,e_=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,n_=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,i_=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,s_=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,r_=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,o_=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,a_=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,l_=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,c_=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,h_=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,u_=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,d_=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,f_=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,p_=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,m_=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,g_=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,__=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,x_=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,y_=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,v_=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,M_=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,b_=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,S_=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,T_=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,E_=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_RETROREFLECTION
	uniform float retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN

		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;

	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,w_=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,A_=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,R_=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,C_=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,P_=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,I_=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,L_=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,D_=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,he={alphahash_fragment:tg,alphahash_pars_fragment:eg,alphamap_fragment:ng,alphamap_pars_fragment:ig,alphatest_fragment:sg,alphatest_pars_fragment:rg,aomap_fragment:og,aomap_pars_fragment:ag,batching_pars_vertex:lg,batching_vertex:cg,begin_vertex:hg,beginnormal_vertex:ug,bsdfs:dg,iridescence_fragment:fg,bumpmap_pars_fragment:pg,clipping_planes_fragment:mg,clipping_planes_pars_fragment:gg,clipping_planes_pars_vertex:_g,clipping_planes_vertex:xg,color_fragment:yg,color_pars_fragment:vg,color_pars_vertex:Mg,color_vertex:bg,common:Sg,cube_uv_reflection_fragment:Tg,defaultnormal_vertex:Eg,displacementmap_pars_vertex:wg,displacementmap_vertex:Ag,emissivemap_fragment:Rg,emissivemap_pars_fragment:Cg,colorspace_fragment:Pg,colorspace_pars_fragment:Ig,envmap_fragment:Lg,envmap_common_pars_fragment:Dg,envmap_pars_fragment:Ng,envmap_pars_vertex:Ug,envmap_physical_pars_fragment:qg,envmap_vertex:Fg,fog_vertex:Og,fog_pars_vertex:Bg,fog_fragment:kg,fog_pars_fragment:zg,gradientmap_pars_fragment:Vg,lightmap_pars_fragment:Hg,lights_lambert_fragment:Gg,lights_lambert_pars_fragment:Wg,lights_pars_begin:Xg,lights_toon_fragment:Yg,lights_toon_pars_fragment:Zg,lights_phong_fragment:Jg,lights_phong_pars_fragment:$g,lights_physical_fragment:Kg,lights_physical_pars_fragment:jg,lights_fragment_begin:Qg,lights_fragment_maps:t0,lights_fragment_end:e0,lightprobes_pars_fragment:n0,logdepthbuf_fragment:i0,logdepthbuf_pars_fragment:s0,logdepthbuf_pars_vertex:r0,logdepthbuf_vertex:o0,map_fragment:a0,map_pars_fragment:l0,map_particle_fragment:c0,map_particle_pars_fragment:h0,metalnessmap_fragment:u0,metalnessmap_pars_fragment:d0,morphinstance_vertex:f0,morphcolor_vertex:p0,morphnormal_vertex:m0,morphtarget_pars_vertex:g0,morphtarget_vertex:_0,normal_fragment_begin:x0,normal_fragment_maps:y0,normal_pars_fragment:v0,normal_pars_vertex:M0,normal_vertex:b0,normalmap_pars_fragment:S0,clearcoat_normal_fragment_begin:T0,clearcoat_normal_fragment_maps:E0,clearcoat_pars_fragment:w0,iridescence_pars_fragment:A0,opaque_fragment:R0,packing:C0,premultiplied_alpha_fragment:P0,project_vertex:I0,dithering_fragment:L0,dithering_pars_fragment:D0,roughnessmap_fragment:N0,roughnessmap_pars_fragment:U0,shadowmap_pars_fragment:F0,shadowmap_pars_vertex:O0,shadowmap_vertex:B0,shadowmask_pars_fragment:k0,skinbase_vertex:z0,skinning_pars_vertex:V0,skinning_vertex:H0,skinnormal_vertex:G0,specularmap_fragment:W0,specularmap_pars_fragment:X0,tonemapping_fragment:q0,tonemapping_pars_fragment:Y0,transmission_fragment:Z0,transmission_pars_fragment:J0,uv_pars_fragment:$0,uv_pars_vertex:K0,uv_vertex:j0,worldpos_vertex:Q0,background_vert:t_,background_frag:e_,backgroundCube_vert:n_,backgroundCube_frag:i_,cube_vert:s_,cube_frag:r_,depth_vert:o_,depth_frag:a_,distance_vert:l_,distance_frag:c_,equirect_vert:h_,equirect_frag:u_,linedashed_vert:d_,linedashed_frag:f_,meshbasic_vert:p_,meshbasic_frag:m_,meshlambert_vert:g_,meshlambert_frag:__,meshmatcap_vert:x_,meshmatcap_frag:y_,meshnormal_vert:v_,meshnormal_frag:M_,meshphong_vert:b_,meshphong_frag:S_,meshphysical_vert:T_,meshphysical_frag:E_,meshtoon_vert:w_,meshtoon_frag:A_,points_vert:R_,points_frag:C_,shadow_vert:P_,shadow_frag:I_,sprite_vert:L_,sprite_frag:D_},pt={common:{diffuse:{value:new ae(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Qt},alphaMap:{value:null},alphaMapTransform:{value:new Qt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Qt}},envmap:{envMap:{value:null},envMapRotation:{value:new Qt},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Qt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Qt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Qt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Qt},normalScale:{value:new Zt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Qt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Qt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Qt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Qt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new ae(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new N},probesMax:{value:new N},probesResolution:{value:new N}},points:{diffuse:{value:new ae(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Qt},alphaTest:{value:0},uvTransform:{value:new Qt}},sprite:{diffuse:{value:new ae(16777215)},opacity:{value:1},center:{value:new Zt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Qt},alphaMap:{value:null},alphaMapTransform:{value:new Qt},alphaTest:{value:0}}},Ti={basic:{uniforms:cn([pt.common,pt.specularmap,pt.envmap,pt.aomap,pt.lightmap,pt.fog]),vertexShader:he.meshbasic_vert,fragmentShader:he.meshbasic_frag},lambert:{uniforms:cn([pt.common,pt.specularmap,pt.envmap,pt.aomap,pt.lightmap,pt.emissivemap,pt.bumpmap,pt.normalmap,pt.displacementmap,pt.fog,pt.lights,{emissive:{value:new ae(0)},envMapIntensity:{value:1}}]),vertexShader:he.meshlambert_vert,fragmentShader:he.meshlambert_frag},phong:{uniforms:cn([pt.common,pt.specularmap,pt.envmap,pt.aomap,pt.lightmap,pt.emissivemap,pt.bumpmap,pt.normalmap,pt.displacementmap,pt.fog,pt.lights,{emissive:{value:new ae(0)},specular:{value:new ae(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:he.meshphong_vert,fragmentShader:he.meshphong_frag},standard:{uniforms:cn([pt.common,pt.envmap,pt.aomap,pt.lightmap,pt.emissivemap,pt.bumpmap,pt.normalmap,pt.displacementmap,pt.roughnessmap,pt.metalnessmap,pt.fog,pt.lights,{emissive:{value:new ae(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:he.meshphysical_vert,fragmentShader:he.meshphysical_frag},toon:{uniforms:cn([pt.common,pt.aomap,pt.lightmap,pt.emissivemap,pt.bumpmap,pt.normalmap,pt.displacementmap,pt.gradientmap,pt.fog,pt.lights,{emissive:{value:new ae(0)}}]),vertexShader:he.meshtoon_vert,fragmentShader:he.meshtoon_frag},matcap:{uniforms:cn([pt.common,pt.bumpmap,pt.normalmap,pt.displacementmap,pt.fog,{matcap:{value:null}}]),vertexShader:he.meshmatcap_vert,fragmentShader:he.meshmatcap_frag},points:{uniforms:cn([pt.points,pt.fog]),vertexShader:he.points_vert,fragmentShader:he.points_frag},dashed:{uniforms:cn([pt.common,pt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:he.linedashed_vert,fragmentShader:he.linedashed_frag},depth:{uniforms:cn([pt.common,pt.displacementmap]),vertexShader:he.depth_vert,fragmentShader:he.depth_frag},normal:{uniforms:cn([pt.common,pt.bumpmap,pt.normalmap,pt.displacementmap,{opacity:{value:1}}]),vertexShader:he.meshnormal_vert,fragmentShader:he.meshnormal_frag},sprite:{uniforms:cn([pt.sprite,pt.fog]),vertexShader:he.sprite_vert,fragmentShader:he.sprite_frag},background:{uniforms:{uvTransform:{value:new Qt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:he.background_vert,fragmentShader:he.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Qt}},vertexShader:he.backgroundCube_vert,fragmentShader:he.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:he.cube_vert,fragmentShader:he.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:he.equirect_vert,fragmentShader:he.equirect_frag},distance:{uniforms:cn([pt.common,pt.displacementmap,{referencePosition:{value:new N},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:he.distance_vert,fragmentShader:he.distance_frag},shadow:{uniforms:cn([pt.lights,pt.fog,{color:{value:new ae(0)},opacity:{value:1}}]),vertexShader:he.shadow_vert,fragmentShader:he.shadow_frag}};Ti.physical={uniforms:cn([Ti.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Qt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Qt},clearcoatNormalScale:{value:new Zt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Qt},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Qt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Qt},sheen:{value:0},sheenColor:{value:new ae(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Qt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Qt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Qt},transmissionSamplerSize:{value:new Zt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Qt},attenuationDistance:{value:0},attenuationColor:{value:new ae(0)},specularColor:{value:new ae(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Qt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Qt},anisotropyVector:{value:new Zt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Qt}}]),vertexShader:he.meshphysical_vert,fragmentShader:he.meshphysical_frag};var jl={r:0,b:0,g:0},N_=new De,np=new Qt;np.set(-1,0,0,0,1,0,0,0,1);function U_(n,t,e,i,s,r){let o=new ae(0),a=s===!0?0:1,l,c,h=null,d=0,u=null;function f(E){let C=E.isScene===!0?E.background:null;if(C&&C.isTexture){let M=E.backgroundBlurriness>0;C=t.get(C,M)}return C}function p(E){let C=!1,M=f(E);M===null?g(o,a):M&&M.isColor&&(g(M,1),C=!0);let w=n.xr.getEnvironmentBlendMode();w==="additive"?e.buffers.color.setClear(0,0,0,1,r):w==="alpha-blend"&&e.buffers.color.setClear(0,0,0,0,r),(n.autoClear||C)&&(e.buffers.depth.setTest(!0),e.buffers.depth.setMask(!0),e.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function x(E,C){let M=f(C);M&&(M.isCubeTexture||M.mapping===vo)?(c===void 0&&(c=new gn(new xr(1,1,1),new On({name:"BackgroundCubeMaterial",uniforms:Ds(Ti.backgroundCube.uniforms),vertexShader:Ti.backgroundCube.vertexShader,fragmentShader:Ti.backgroundCube.fragmentShader,side:xn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(w,v,S){this.matrixWorld.copyPosition(S.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(c)),c.material.uniforms.envMap.value=M,c.material.uniforms.backgroundBlurriness.value=C.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=C.backgroundIntensity,c.material.uniforms.backgroundRotation.value.setFromMatrix4(N_.makeRotationFromEuler(C.backgroundRotation)).transpose(),M.isCubeTexture&&M.isRenderTargetTexture===!1&&c.material.uniforms.backgroundRotation.value.premultiply(np),c.material.toneMapped=ge.getTransfer(M.colorSpace)!==be,(h!==M||d!==M.version||u!==n.toneMapping)&&(c.material.needsUpdate=!0,h=M,d=M.version,u=n.toneMapping),c.layers.enableAll(),E.unshift(c,c.geometry,c.material,0,0,null)):M&&M.isTexture&&(l===void 0&&(l=new gn(new Ue(2,2),new On({name:"BackgroundMaterial",uniforms:Ds(Ti.background.uniforms),vertexShader:Ti.background.vertexShader,fragmentShader:Ti.background.fragmentShader,side:cs,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(l)),l.material.uniforms.t2D.value=M,l.material.uniforms.backgroundIntensity.value=C.backgroundIntensity,l.material.toneMapped=ge.getTransfer(M.colorSpace)!==be,M.matrixAutoUpdate===!0&&M.updateMatrix(),l.material.uniforms.uvTransform.value.copy(M.matrix),(h!==M||d!==M.version||u!==n.toneMapping)&&(l.material.needsUpdate=!0,h=M,d=M.version,u=n.toneMapping),l.layers.enableAll(),E.unshift(l,l.geometry,l.material,0,0,null))}function g(E,C){E.getRGB(jl,Vh(n)),e.buffers.color.setClear(jl.r,jl.g,jl.b,C,r)}function m(){c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return o},setClearColor:function(E,C=1){o.set(E),a=C,g(o,a)},getClearAlpha:function(){return a},setClearAlpha:function(E){a=E,g(o,a)},render:p,addToRenderList:x,dispose:m}}function F_(n,t){let e=n.getParameter(n.MAX_VERTEX_ATTRIBS),i={},s=u(null),r=s,o=!1;function a(P,D,k,L,z){let W=!1,J=d(P,L,k,D);r!==J&&(r=J,c(r.object)),W=f(P,L,k,z),W&&p(P,L,k,z),z!==null&&t.update(z,n.ELEMENT_ARRAY_BUFFER),(W||o)&&(o=!1,M(P,D,k,L),z!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,t.get(z).buffer))}function l(){return n.createVertexArray()}function c(P){return n.bindVertexArray(P)}function h(P){return n.deleteVertexArray(P)}function d(P,D,k,L){let z=L.wireframe===!0,W=i[D.id];W===void 0&&(W={},i[D.id]=W);let J=P.isInstancedMesh===!0?P.id:0,et=W[J];et===void 0&&(et={},W[J]=et);let O=et[k.id];O===void 0&&(O={},et[k.id]=O);let q=O[z];return q===void 0&&(q=u(l()),O[z]=q),q}function u(P){let D=[],k=[],L=[];for(let z=0;z<e;z++)D[z]=0,k[z]=0,L[z]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:D,enabledAttributes:k,attributeDivisors:L,object:P,attributes:{},index:null}}function f(P,D,k,L){let z=r.attributes,W=D.attributes,J=0,et=k.getAttributes();for(let O in et)if(et[O].location>=0){let j=z[O],yt=W[O];if(yt===void 0&&(O==="instanceMatrix"&&P.instanceMatrix&&(yt=P.instanceMatrix),O==="instanceColor"&&P.instanceColor&&(yt=P.instanceColor)),j===void 0||j.attribute!==yt||yt&&j.data!==yt.data)return!0;J++}return r.attributesNum!==J||r.index!==L}function p(P,D,k,L){let z={},W=D.attributes,J=0,et=k.getAttributes();for(let O in et)if(et[O].location>=0){let j=W[O];j===void 0&&(O==="instanceMatrix"&&P.instanceMatrix&&(j=P.instanceMatrix),O==="instanceColor"&&P.instanceColor&&(j=P.instanceColor));let yt={};yt.attribute=j,j&&j.data&&(yt.data=j.data),z[O]=yt,J++}r.attributes=z,r.attributesNum=J,r.index=L}function x(){let P=r.newAttributes;for(let D=0,k=P.length;D<k;D++)P[D]=0}function g(P){m(P,0)}function m(P,D){let k=r.newAttributes,L=r.enabledAttributes,z=r.attributeDivisors;k[P]=1,L[P]===0&&(n.enableVertexAttribArray(P),L[P]=1),z[P]!==D&&(n.vertexAttribDivisor(P,D),z[P]=D)}function E(){let P=r.newAttributes,D=r.enabledAttributes;for(let k=0,L=D.length;k<L;k++)D[k]!==P[k]&&(n.disableVertexAttribArray(k),D[k]=0)}function C(P,D,k,L,z,W,J){J===!0?n.vertexAttribIPointer(P,D,k,z,W):n.vertexAttribPointer(P,D,k,L,z,W)}function M(P,D,k,L){x();let z=L.attributes,W=k.getAttributes(),J=D.defaultAttributeValues;for(let et in W){let O=W[et];if(O.location>=0){let q=z[et];if(q===void 0&&(et==="instanceMatrix"&&P.instanceMatrix&&(q=P.instanceMatrix),et==="instanceColor"&&P.instanceColor&&(q=P.instanceColor)),q!==void 0){let j=q.normalized,yt=q.itemSize,Tt=t.get(q);if(Tt===void 0)continue;let pe=Tt.buffer,qt=Tt.type,Et=Tt.bytesPerElement,Y=qt===n.INT||qt===n.UNSIGNED_INT||q.gpuType===fl;if(q.isInterleavedBufferAttribute){let K=q.data,it=K.stride,Ct=q.offset;if(K.isInstancedInterleavedBuffer){for(let ot=0;ot<O.locationSize;ot++)m(O.location+ot,K.meshPerAttribute);P.isInstancedMesh!==!0&&L._maxInstanceCount===void 0&&(L._maxInstanceCount=K.meshPerAttribute*K.count)}else for(let ot=0;ot<O.locationSize;ot++)g(O.location+ot);n.bindBuffer(n.ARRAY_BUFFER,pe);for(let ot=0;ot<O.locationSize;ot++)C(O.location+ot,yt/O.locationSize,qt,j,it*Et,(Ct+yt/O.locationSize*ot)*Et,Y)}else{if(q.isInstancedBufferAttribute){for(let K=0;K<O.locationSize;K++)m(O.location+K,q.meshPerAttribute);P.isInstancedMesh!==!0&&L._maxInstanceCount===void 0&&(L._maxInstanceCount=q.meshPerAttribute*q.count)}else for(let K=0;K<O.locationSize;K++)g(O.location+K);n.bindBuffer(n.ARRAY_BUFFER,pe);for(let K=0;K<O.locationSize;K++)C(O.location+K,yt/O.locationSize,qt,j,yt*Et,yt/O.locationSize*K*Et,Y)}}else if(J!==void 0){let j=J[et];if(j!==void 0)switch(j.length){case 2:n.vertexAttrib2fv(O.location,j);break;case 3:n.vertexAttrib3fv(O.location,j);break;case 4:n.vertexAttrib4fv(O.location,j);break;default:n.vertexAttrib1fv(O.location,j)}}}}E()}function w(){T();for(let P in i){let D=i[P];for(let k in D){let L=D[k];for(let z in L){let W=L[z];for(let J in W)h(W[J].object),delete W[J];delete L[z]}}delete i[P]}}function v(P){if(i[P.id]===void 0)return;let D=i[P.id];for(let k in D){let L=D[k];for(let z in L){let W=L[z];for(let J in W)h(W[J].object),delete W[J];delete L[z]}}delete i[P.id]}function S(P){for(let D in i){let k=i[D];for(let L in k){let z=k[L];if(z[P.id]===void 0)continue;let W=z[P.id];for(let J in W)h(W[J].object),delete W[J];delete z[P.id]}}}function _(P){for(let D in i){let k=i[D],L=P.isInstancedMesh===!0?P.id:0,z=k[L];if(z!==void 0){for(let W in z){let J=z[W];for(let et in J)h(J[et].object),delete J[et];delete z[W]}delete k[L],Object.keys(k).length===0&&delete i[D]}}}function T(){R(),o=!0,r!==s&&(r=s,c(r.object))}function R(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:a,reset:T,resetDefaultState:R,dispose:w,releaseStatesOfGeometry:v,releaseStatesOfObject:_,releaseStatesOfProgram:S,initAttributes:x,enableAttribute:g,disableUnusedAttributes:E}}function O_(n,t,e){let i;function s(l){i=l}function r(l,c){n.drawArrays(i,l,c),e.update(c,i,1)}function o(l,c,h){h!==0&&(n.drawArraysInstanced(i,l,c,h),e.update(c,i,h))}function a(l,c,h){if(h===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,l,0,c,0,h);let u=0;for(let f=0;f<h;f++)u+=c[f];e.update(u,i,1)}this.setMode=s,this.render=r,this.renderInstances=o,this.renderMultiDraw=a}function B_(n,t,e,i){let s;function r(){if(s!==void 0)return s;if(t.has("EXT_texture_filter_anisotropic")===!0){let S=t.get("EXT_texture_filter_anisotropic");s=n.getParameter(S.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function o(S){return!(S!==Jn&&i.convert(S)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(S){let _=S===li&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(S!==wn&&S!==ai&&!_&&i.convert(S)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE))}function l(S){if(S==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";S="mediump"}return S==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=e.precision!==void 0?e.precision:"highp",h=l(c);h!==c&&(Gt("WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);let d=e.logarithmicDepthBuffer===!0,u=e.reversedDepthBuffer===!0&&t.has("EXT_clip_control");e.reversedDepthBuffer===!0&&u===!1&&Gt("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");let f=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),p=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),x=n.getParameter(n.MAX_TEXTURE_SIZE),g=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),m=n.getParameter(n.MAX_VERTEX_ATTRIBS),E=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),C=n.getParameter(n.MAX_VARYING_VECTORS),M=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),w=n.getParameter(n.MAX_SAMPLES),v=n.getParameter(n.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:o,textureTypeReadable:a,precision:c,logarithmicDepthBuffer:d,reversedDepthBuffer:u,maxTextures:f,maxVertexTextures:p,maxTextureSize:x,maxCubemapSize:g,maxAttributes:m,maxVertexUniforms:E,maxVaryings:C,maxFragmentUniforms:M,maxSamples:w,samples:v}}function k_(n){let t=this,e=null,i=0,s=!1,r=!1,o=new Nn,a=new Qt,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(d,u){let f=d.length!==0||u||i!==0||s;return s=u,i=d.length,f},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(d,u){e=h(d,u,0)},this.setState=function(d,u,f){let p=d.clippingPlanes,x=d.clipIntersection,g=d.clipShadows,m=n.get(d);if(!s||p===null||p.length===0||r&&!g)r?h(null):c();else{let E=r?0:i,C=E*4,M=m.clippingState||null;l.value=M,M=h(p,u,C,f);for(let w=0;w!==C;++w)M[w]=e[w];m.clippingState=M,this.numIntersection=x?this.numPlanes:0,this.numPlanes+=E}};function c(){l.value!==e&&(l.value=e,l.needsUpdate=i>0),t.numPlanes=i,t.numIntersection=0}function h(d,u,f,p){let x=d!==null?d.length:0,g=null;if(x!==0){if(g=l.value,p!==!0||g===null){let m=f+x*4,E=u.matrixWorldInverse;a.getNormalMatrix(E),(g===null||g.length<m)&&(g=new Float32Array(m));for(let C=0,M=f;C!==x;++C,M+=4)o.copy(d[C]).applyMatrix4(E,a),o.normal.toArray(g,M),g[M+3]=o.constant}l.value=g,l.needsUpdate=!0}return t.numPlanes=x,t.numIntersection=0,g}}var Rr=4,z_=6,V_=20,H_=256,Ro=new yr,Nf=new ae,$h=null,Kh=0,jh=0,Qh=!1,G_=new N,Ns=new N,tc=class{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(t,e=0,i=.1,s=100,r={}){let{size:o=256,position:a=G_}=r;$h=this._renderer.getRenderTarget(),Kh=this._renderer.getActiveCubeFace(),jh=this._renderer.getActiveMipmapLevel(),Qh=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(o);let l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(t,i,s,l,a),e>0&&this._blur(l,0,0,e),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Of(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Ff(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodMeshes.length;t++)this._lodMeshes[t].geometry.dispose()}_cleanup(t){this._renderer.setRenderTarget($h,Kh,jh),this._renderer.xr.enabled=Qh,t.scissorTest=!1,Ar(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===hs||t.mapping===Ls?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),$h=this._renderer.getRenderTarget(),Kh=this._renderer.getActiveCubeFace(),jh=this._renderer.getActiveMipmapLevel(),Qh=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let i=e||this._allocateTargets();return this._textureToCubeUV(t,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){let t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,i={magFilter:sn,minFilter:sn,generateMipmaps:!1,type:li,format:Jn,colorSpace:to,depthBuffer:!1},s=Uf(t,e,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Uf(t,e,i);let{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods}=W_(r)),this._blurMaterial=q_(r,t,e),this._ggxMaterial=X_(r,t,e)}return s}_compileMaterial(t){let e=new gn(new Xe,t);this._renderer.compile(e,Ro)}_sceneToCubeUV(t,e,i,s,r){let l=new ln(90,1,e,i),c=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],d=this._renderer,u=d.autoClear,f=d.toneMapping;d.getClearColor(Nf),d.toneMapping=ri,d.autoClear=!1,d.state.buffers.depth.getReversed()&&(d.setRenderTarget(s),d.clearDepth(),d.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new gn(new xr,new gr({name:"PMREM.Background",side:xn,depthWrite:!1,depthTest:!1})));let x=this._backgroundBox,g=x.material,m=!1,E=t.background;E?E.isColor&&(g.color.copy(E),t.background=null,m=!0):(g.color.copy(Nf),m=!0);for(let C=0;C<6;C++){let M=C%3;M===0?(l.up.set(0,c[C],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x+h[C],r.y,r.z)):M===1?(l.up.set(0,0,c[C]),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y+h[C],r.z)):(l.up.set(0,c[C],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y,r.z+h[C]));let w=this._cubeSize;Ar(s,M*w,C>2?w:0,w,w),d.setRenderTarget(s),m&&d.render(x,l),d.render(t,l)}d.toneMapping=f,d.autoClear=u,t.background=E}_textureToCubeUV(t,e){let i=this._renderer,s=t.mapping===hs||t.mapping===Ls;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=Of()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Ff());let r=s?this._cubemapMaterial:this._equirectMaterial,o=this._lodMeshes[0];o.material=r;let a=r.uniforms;a.envMap.value=t;let l=this._cubeSize;Ar(e,0,0,3*l,2*l),i.setRenderTarget(e),i.render(o,Ro)}_applyPMREM(t){let e=this._renderer,i=e.autoClear;e.autoClear=!1;let s=this._lodMeshes.length;for(let r=1;r<s;r++)this._applyGGXFilter(t,r-1,r);e.autoClear=i}_applyGGXFilter(t,e,i){let s=this._renderer,r=this._pingPongRenderTarget,o=this._ggxMaterial,a=this._lodMeshes[i];a.material=o;let l=o.uniforms,c=i/(this._lodMeshes.length-1),h=e/(this._lodMeshes.length-1),d=Math.sqrt(c*c-h*h),u=c*1.25,f=d*u,{_lodMax:p}=this,x=this._sizeLods[i],g=3*x*(i>p-Rr?i-p+Rr:0),m=4*(this._cubeSize-x);l.envMap.value=t.texture,l.roughness.value=f,l.mipInt.value=p-e,Ar(r,g,m,3*x,2*x),s.setRenderTarget(r),s.render(a,Ro),l.envMap.value=r.texture,l.roughness.value=0,l.mipInt.value=p-i,Ar(t,g,m,3*x,2*x),s.setRenderTarget(t),s.render(a,Ro)}_blur(t,e,i,s){let r=this._pingPongRenderTarget,o=Math.min(s,Math.PI)/Math.SQRT2;this._blurPass(t,r,e,i,o),this._blurPass(r,t,i,i,o)}_blurPass(t,e,i,s,r){let o=this._renderer,a=this._blurMaterial,l=this._lodMeshes[s];l.material=a;let c=a.uniforms;c.envMap.value=t.texture,c.sigma.value=r,c.mipInt.value=this._lodMax-i;let h=this._sizeLods[s],d=3*h*(s>this._lodMax-Rr?s-this._lodMax+Rr:0),u=4*(this._cubeSize-h);Ar(e,d,u,3*h,2*h),o.setRenderTarget(e),o.render(l,Ro)}};function W_(n){let t=[],e=[],i=n,s=n-Rr+1+z_;for(let r=0;r<s;r++){let o=Math.pow(2,i);t.push(o);let a=1/(o-2),l=-a,c=1+a,h=[l,l,c,l,c,c,l,l,c,c,l,c],d=6,u=6,f=3,p=new Float32Array(f*u*d),x=new Float32Array(f*u*d);for(let m=0;m<d;m++){let E=m%3*2/3-1,C=m>2?0:-1,M=[E,C,0,E+2/3,C,0,E+2/3,C+1,0,E,C,0,E+2/3,C+1,0,E,C+1,0];p.set(M,f*u*m);for(let w=0;w<u;w++){let v=h[w*2]*2-1,S=h[w*2+1]*2-1;m===0?Ns.set(1,S,v):m===1?Ns.set(-v,1,-S):m===2?Ns.set(-v,S,1):m===3?Ns.set(-1,S,-v):m===4?Ns.set(-v,-1,S):Ns.set(v,S,-1),Ns.toArray(x,(m*u+w)*f)}}let g=new Xe;g.setAttribute("position",new Yn(p,f)),g.setAttribute("outputDirection",new Yn(x,f)),e.push(new gn(g,null)),i>Rr&&i--}return{lodMeshes:e,sizeLods:t}}function Uf(n,t,e){let i=new En(n,t,e);return i.texture.mapping=vo,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function Ar(n,t,e,i,s){n.viewport.set(t,e,i,s),n.scissor.set(t,e,i,s)}function X_(n,t,e){return new On({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:H_,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:ic(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 4.1: Orthonormal basis
				vec3 T1 = vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(V, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + V.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * V;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:bi,depthTest:!1,depthWrite:!1})}function q_(n,t,e){return new On({name:"SphericalGaussianBlur",defines:{SAMPLES:V_,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},sigma:{value:0},mipInt:{value:0}},vertexShader:ic(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float sigma;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359
			#define GOLDEN_ANGLE 2.39996322973

			void main() {

				if ( sigma == 0.0 ) {

					gl_FragColor = vec4( bilinearCubeUV( envMap, vOutputDirection, mipInt ), 1.0 );
					return;

				}

				vec3 outputDirection = normalize( vOutputDirection );

				vec3 up = abs( outputDirection.z ) < 0.999 ? vec3( 0.0, 0.0, 1.0 ) : vec3( 1.0, 0.0, 0.0 );
				vec3 tangent = normalize( cross( up, outputDirection ) );
				vec3 bitangent = cross( outputDirection, tangent );

				// Truncate the kernel at three standard deviations or at the antipode.
				float thetaMax = min( 3.0 * sigma, PI );
				float truncation = 1.0 - exp( - 0.5 * thetaMax * thetaMax / ( sigma * sigma ) );

				vec3 accumColor = vec3( 0.0 );
				float accumWeight = 0.0;

				for ( int i = 0; i < SAMPLES; i ++ ) {

					// Stratified inverse-CDF sampling of the Gaussian, placed on a golden-angle spiral.
					float stratum = ( float( i ) + 0.5 ) / float( SAMPLES );
					float theta = sigma * sqrt( - 2.0 * log( 1.0 - stratum * truncation ) );
					float phi = float( i ) * GOLDEN_ANGLE;

					vec3 offset = cos( phi ) * tangent + sin( phi ) * bitangent;
					vec3 sampleDirection = cos( theta ) * outputDirection + sin( theta ) * offset;

					// Correct the planar sample density to solid angle.
					float weight = sin( theta ) / theta;

					accumColor += weight * bilinearCubeUV( envMap, sampleDirection, mipInt );
					accumWeight += weight;

				}

				gl_FragColor = vec4( accumColor / accumWeight, 1.0 );

			}
		`,blending:bi,depthTest:!1,depthWrite:!1})}function Ff(){return new On({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:ic(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:bi,depthTest:!1,depthWrite:!1})}function Of(){return new On({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:ic(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:bi,depthTest:!1,depthWrite:!1})}function ic(){return`

		precision mediump float;
		precision mediump int;

		attribute vec3 outputDirection;

		varying vec3 vOutputDirection;

		void main() {

			vOutputDirection = outputDirection;
			gl_Position = vec4( position, 1.0 );

		}
	`}var ec=class extends En{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;let i={width:t,height:t,depth:1},s=[i,i,i,i,i,i];this.texture=new lo(s),this._setTextureOptions(e),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;let i={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new xr(5,5,5),r=new On({name:"CubemapFromEquirect",uniforms:Ds(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:xn,blending:bi});r.uniforms.tEquirect.value=e;let o=new gn(s,r),a=e.minFilter;return e.minFilter===us&&(e.minFilter=sn),new al(1,10,this).update(t,o),e.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(t,e=!0,i=!0,s=!0){let r=t.getRenderTarget();for(let o=0;o<6;o++)t.setRenderTarget(this,o),t.clear(e,i,s);t.setRenderTarget(r)}};function Y_(n){let t=new WeakMap,e=new WeakMap,i=null;function s(u,f=!1){return u==null?null:f?o(u):r(u)}function r(u){if(u&&u.isTexture){let f=u.mapping;if(f===hl||f===ul)if(t.has(u)){let p=t.get(u).texture;return a(p,u.mapping)}else{let p=u.image;if(p&&p.height>0){let x=new ec(p.height);return x.fromEquirectangularTexture(n,u),t.set(u,x),u.addEventListener("dispose",c),a(x.texture,u.mapping)}else return null}}return u}function o(u){if(u&&u.isTexture){let f=u.mapping,p=f===hl||f===ul,x=f===hs||f===Ls;if(p||x){let g=e.get(u),m=g!==void 0?g.texture.pmremVersion:0;if(u.isRenderTargetTexture&&u.pmremVersion!==m)return i===null&&(i=new tc(n)),g=p?i.fromEquirectangular(u,g):i.fromCubemap(u,g),g.texture.pmremVersion=u.pmremVersion,e.set(u,g),g.texture;if(g!==void 0)return g.texture;{let E=u.image;return p&&E&&E.height>0||x&&E&&l(E)?(i===null&&(i=new tc(n)),g=p?i.fromEquirectangular(u):i.fromCubemap(u),g.texture.pmremVersion=u.pmremVersion,e.set(u,g),u.addEventListener("dispose",h),g.texture):null}}}return u}function a(u,f){return f===hl?u.mapping=hs:f===ul&&(u.mapping=Ls),u}function l(u){let f=0,p=6;for(let x=0;x<p;x++)u[x]!==void 0&&f++;return f===p}function c(u){let f=u.target;f.removeEventListener("dispose",c);let p=t.get(f);p!==void 0&&(t.delete(f),p.dispose())}function h(u){let f=u.target;f.removeEventListener("dispose",h);let p=e.get(f);p!==void 0&&(e.delete(f),p.dispose())}function d(){t=new WeakMap,e=new WeakMap,i!==null&&(i.dispose(),i=null)}return{get:s,dispose:d}}function Z_(n){let t={};function e(i){if(t[i]!==void 0)return t[i];let s=n.getExtension(i);return t[i]=s,s}return{has:function(i){return e(i)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(i){let s=e(i);return s===null&&ws("WebGLRenderer: "+i+" extension not supported."),s}}}function J_(n,t,e,i){let s={},r=new WeakMap;function o(d){let u=d.target;u.index!==null&&t.remove(u.index);for(let p in u.attributes)t.remove(u.attributes[p]);u.removeEventListener("dispose",o),delete s[u.id];let f=r.get(u);f&&(t.remove(f),r.delete(u)),i.releaseStatesOfGeometry(u),u.isInstancedBufferGeometry===!0&&delete u._maxInstanceCount,e.memory.geometries--}function a(d,u){return s[u.id]===!0||(u.addEventListener("dispose",o),s[u.id]=!0,e.memory.geometries++),u}function l(d){let u=d.attributes;for(let f in u)t.update(u[f],n.ARRAY_BUFFER)}function c(d){let u=[],f=d.index,p=d.attributes.position,x=0;if(p===void 0)return;if(f!==null){let E=f.array;x=f.version;for(let C=0,M=E.length;C<M;C+=3){let w=E[C+0],v=E[C+1],S=E[C+2];u.push(w,v,v,S,S,w)}}else{let E=p.array;x=p.version;for(let C=0,M=E.length/3-1;C<M;C+=3){let w=C+0,v=C+1,S=C+2;u.push(w,v,v,S,S,w)}}let g=new(p.count>=65535?ao:oo)(u,1);g.version=x;let m=r.get(d);m&&t.remove(m),r.set(d,g)}function h(d){let u=r.get(d);if(u){let f=d.index;f!==null&&u.version<f.version&&c(d)}else c(d);return r.get(d)}return{get:a,update:l,getWireframeAttribute:h}}function $_(n,t,e){let i;function s(d){i=d}let r,o;function a(d){r=d.type,o=d.bytesPerElement}function l(d,u){n.drawElements(i,u,r,d*o),e.update(u,i,1)}function c(d,u,f){f!==0&&(n.drawElementsInstanced(i,u,r,d*o,f),e.update(u,i,f))}function h(d,u,f){if(f===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,u,0,r,d,0,f);let x=0;for(let g=0;g<f;g++)x+=u[g];e.update(x,i,1)}this.setMode=s,this.setIndex=a,this.render=l,this.renderInstances=c,this.renderMultiDraw=h}function K_(n){let t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function i(r,o,a){switch(e.calls++,o){case n.TRIANGLES:e.triangles+=a*(r/3);break;case n.LINES:e.lines+=a*(r/2);break;case n.LINE_STRIP:e.lines+=a*(r-1);break;case n.LINE_LOOP:e.lines+=a*r;break;case n.POINTS:e.points+=a*r;break;default:Jt("WebGLInfo: Unknown draw mode:",o);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:i}}function j_(n,t,e){let i=new WeakMap,s=new Ne;function r(o,a,l){let c=o.morphTargetInfluences,h=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,d=h!==void 0?h.length:0,u=i.get(a);if(u===void 0||u.count!==d){let T=function(){S.dispose(),i.delete(a),a.removeEventListener("dispose",T)};u!==void 0&&u.texture.dispose();let f=a.morphAttributes.position!==void 0,p=a.morphAttributes.normal!==void 0,x=a.morphAttributes.color!==void 0,g=a.morphAttributes.position||[],m=a.morphAttributes.normal||[],E=a.morphAttributes.color||[],C=0;f===!0&&(C=1),p===!0&&(C=2),x===!0&&(C=3);let M=a.attributes.position.count*C,w=1;M>t.maxTextureSize&&(w=Math.ceil(M/t.maxTextureSize),M=t.maxTextureSize);let v=new Float32Array(M*w*4*d),S=new io(v,M,w,d);S.type=ai,S.needsUpdate=!0;let _=C*4;for(let R=0;R<d;R++){let P=g[R],D=m[R],k=E[R],L=M*w*4*R;for(let z=0;z<P.count;z++){let W=z*_;f===!0&&(s.fromBufferAttribute(P,z),v[L+W+0]=s.x,v[L+W+1]=s.y,v[L+W+2]=s.z,v[L+W+3]=0),p===!0&&(s.fromBufferAttribute(D,z),v[L+W+4]=s.x,v[L+W+5]=s.y,v[L+W+6]=s.z,v[L+W+7]=0),x===!0&&(s.fromBufferAttribute(k,z),v[L+W+8]=s.x,v[L+W+9]=s.y,v[L+W+10]=s.z,v[L+W+11]=k.itemSize===4?s.w:1)}}u={count:d,texture:S,size:new Zt(M,w)},i.set(a,u),a.addEventListener("dispose",T)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)l.getUniforms().setValue(n,"morphTexture",o.morphTexture,e);else{let f=0;for(let x=0;x<c.length;x++)f+=c[x];let p=a.morphTargetsRelative?1:1-f;l.getUniforms().setValue(n,"morphTargetBaseInfluence",p),l.getUniforms().setValue(n,"morphTargetInfluences",c)}l.getUniforms().setValue(n,"morphTargetsTexture",u.texture,e),l.getUniforms().setValue(n,"morphTargetsTextureSize",u.size)}return{update:r}}function Q_(n,t,e,i,s){let r=new WeakMap;function o(c){let h=s.render.frame,d=c.geometry,u=t.get(c,d);if(r.get(u)!==h&&(t.update(u),r.set(u,h)),c.isInstancedMesh&&(c.hasEventListener("dispose",l)===!1&&c.addEventListener("dispose",l),r.get(c)!==h&&(e.update(c.instanceMatrix,n.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,n.ARRAY_BUFFER),r.set(c,h))),c.isSkinnedMesh){let f=c.skeleton;r.get(f)!==h&&(f.update(),r.set(f,h))}return u}function a(){r=new WeakMap}function l(c){let h=c.target;h.removeEventListener("dispose",l),i.releaseStatesOfObject(h),e.remove(h.instanceMatrix),h.instanceColor!==null&&e.remove(h.instanceColor)}return{update:o,dispose:a}}var tx={[Sh]:"LINEAR_TONE_MAPPING",[Th]:"REINHARD_TONE_MAPPING",[Eh]:"CINEON_TONE_MAPPING",[yo]:"ACES_FILMIC_TONE_MAPPING",[Ah]:"AGX_TONE_MAPPING",[Rh]:"NEUTRAL_TONE_MAPPING",[wh]:"CUSTOM_TONE_MAPPING"};function ex(n,t,e,i,s,r){let o=new En(t,e,{type:n,depthBuffer:s,stencilBuffer:r,samples:i?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1}),a=null,l=null,c=new Xe;c.setAttribute("position",new Pe([-1,3,0,-1,-1,0,3,-1,0],3)),c.setAttribute("uv",new Pe([0,2,0,0,2,0],2));let h=new qa({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),d=new gn(c,h),u=new yr(-1,1,1,-1,0,1),f=null,p=null,x=!1,g,m=null,E=[],C=!1;this.setSize=function(M,w){o.setSize(M,w),a!==null&&a.setSize(M,w),l!==null&&l.setSize(M,w);for(let v=0;v<E.length;v++){let S=E[v];S.setSize&&S.setSize(M,w)}},this.setEffects=function(M){E=M,C=E.length>0&&E[0].isRenderPass===!0;let w=o.width,v=o.height;E.length>0&&a===null&&(a=new En(w,v,{type:li,depthBuffer:!1,stencilBuffer:!1}),l=new En(w,v,{type:li,depthBuffer:!1,stencilBuffer:!1}));for(let S=0;S<E.length;S++){let _=E[S];_.setSize&&_.setSize(w,v)}},this.begin=function(M,w){if(x||M.toneMapping===ri&&E.length===0)return!1;if(m=w,w!==null){let v=w.width,S=w.height;(o.width!==v||o.height!==S)&&this.setSize(v,S)}return C===!1&&M.setRenderTarget(o),g=M.toneMapping,M.toneMapping=ri,!0},this.hasRenderPass=function(){return C},this.end=function(M,w){M.toneMapping=g,x=!0;let v=o,S=a;for(let _=0;_<E.length;_++){let T=E[_];T.enabled!==!1&&(T.render(M,S,v,w),T.needsSwap!==!1&&(v=S,S=S===a?l:a))}if(f!==M.outputColorSpace||p!==M.toneMapping){f=M.outputColorSpace,p=M.toneMapping,h.defines={},ge.getTransfer(f)===be&&(h.defines.SRGB_TRANSFER="");let _=tx[p];_&&(h.defines[_]=""),h.needsUpdate=!0}h.uniforms.tDiffuse.value=v.texture,M.setRenderTarget(m),M.render(d,u),m=null,x=!1},this.isCompositing=function(){return x},this.dispose=function(){o.dispose(),a!==null&&a.dispose(),l!==null&&l.dispose(),c.dispose(),h.dispose()}}var ip=new Tn,nu=new es(1,1),sp=new io,rp=new Va,op=new lo,Bf=[],kf=[],zf=new Float32Array(16),Vf=new Float32Array(9),Hf=new Float32Array(4);function Pr(n,t,e){let i=n[0];if(i<=0||i>0)return n;let s=t*e,r=Bf[s];if(r===void 0&&(r=new Float32Array(s),Bf[s]=r),t!==0){i.toArray(r,0);for(let o=1,a=0;o!==t;++o)a+=e,n[o].toArray(r,a)}return r}function Je(n,t){if(n.length!==t.length)return!1;for(let e=0,i=n.length;e<i;e++)if(n[e]!==t[e])return!1;return!0}function $e(n,t){for(let e=0,i=t.length;e<i;e++)n[e]=t[e]}function sc(n,t){let e=kf[t];e===void 0&&(e=new Int32Array(t),kf[t]=e);for(let i=0;i!==t;++i)e[i]=n.allocateTextureUnit();return e}function nx(n,t){let e=this.cache;e[0]!==t&&(n.uniform1f(this.addr,t),e[0]=t)}function ix(n,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Je(e,t))return;n.uniform2fv(this.addr,t),$e(e,t)}}function sx(n,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(n.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(Je(e,t))return;n.uniform3fv(this.addr,t),$e(e,t)}}function rx(n,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Je(e,t))return;n.uniform4fv(this.addr,t),$e(e,t)}}function ox(n,t){let e=this.cache,i=t.elements;if(i===void 0){if(Je(e,t))return;n.uniformMatrix2fv(this.addr,!1,t),$e(e,t)}else{if(Je(e,i))return;Hf.set(i),n.uniformMatrix2fv(this.addr,!1,Hf),$e(e,i)}}function ax(n,t){let e=this.cache,i=t.elements;if(i===void 0){if(Je(e,t))return;n.uniformMatrix3fv(this.addr,!1,t),$e(e,t)}else{if(Je(e,i))return;Vf.set(i),n.uniformMatrix3fv(this.addr,!1,Vf),$e(e,i)}}function lx(n,t){let e=this.cache,i=t.elements;if(i===void 0){if(Je(e,t))return;n.uniformMatrix4fv(this.addr,!1,t),$e(e,t)}else{if(Je(e,i))return;zf.set(i),n.uniformMatrix4fv(this.addr,!1,zf),$e(e,i)}}function cx(n,t){let e=this.cache;e[0]!==t&&(n.uniform1i(this.addr,t),e[0]=t)}function hx(n,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Je(e,t))return;n.uniform2iv(this.addr,t),$e(e,t)}}function ux(n,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Je(e,t))return;n.uniform3iv(this.addr,t),$e(e,t)}}function dx(n,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Je(e,t))return;n.uniform4iv(this.addr,t),$e(e,t)}}function fx(n,t){let e=this.cache;e[0]!==t&&(n.uniform1ui(this.addr,t),e[0]=t)}function px(n,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Je(e,t))return;n.uniform2uiv(this.addr,t),$e(e,t)}}function mx(n,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Je(e,t))return;n.uniform3uiv(this.addr,t),$e(e,t)}}function gx(n,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Je(e,t))return;n.uniform4uiv(this.addr,t),$e(e,t)}}function _x(n,t,e){let i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s);let r;this.type===n.SAMPLER_2D_SHADOW?(nu.compareFunction=e.isReversedDepthBuffer()?Kl:$l,r=nu):r=ip,e.setTexture2D(t||r,s)}function xx(n,t,e){let i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),e.setTexture3D(t||rp,s)}function yx(n,t,e){let i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),e.setTextureCube(t||op,s)}function vx(n,t,e){let i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),e.setTexture2DArray(t||sp,s)}function Mx(n){switch(n){case 5126:return nx;case 35664:return ix;case 35665:return sx;case 35666:return rx;case 35674:return ox;case 35675:return ax;case 35676:return lx;case 5124:case 35670:return cx;case 35667:case 35671:return hx;case 35668:case 35672:return ux;case 35669:case 35673:return dx;case 5125:return fx;case 36294:return px;case 36295:return mx;case 36296:return gx;case 35678:case 36198:case 36298:case 36306:case 35682:return _x;case 35679:case 36299:case 36307:return xx;case 35680:case 36300:case 36308:case 36293:return yx;case 36289:case 36303:case 36311:case 36292:return vx}}function bx(n,t){n.uniform1fv(this.addr,t)}function Sx(n,t){let e=Pr(t,this.size,2);n.uniform2fv(this.addr,e)}function Tx(n,t){let e=Pr(t,this.size,3);n.uniform3fv(this.addr,e)}function Ex(n,t){let e=Pr(t,this.size,4);n.uniform4fv(this.addr,e)}function wx(n,t){let e=Pr(t,this.size,4);n.uniformMatrix2fv(this.addr,!1,e)}function Ax(n,t){let e=Pr(t,this.size,9);n.uniformMatrix3fv(this.addr,!1,e)}function Rx(n,t){let e=Pr(t,this.size,16);n.uniformMatrix4fv(this.addr,!1,e)}function Cx(n,t){n.uniform1iv(this.addr,t)}function Px(n,t){n.uniform2iv(this.addr,t)}function Ix(n,t){n.uniform3iv(this.addr,t)}function Lx(n,t){n.uniform4iv(this.addr,t)}function Dx(n,t){n.uniform1uiv(this.addr,t)}function Nx(n,t){n.uniform2uiv(this.addr,t)}function Ux(n,t){n.uniform3uiv(this.addr,t)}function Fx(n,t){n.uniform4uiv(this.addr,t)}function Ox(n,t,e){let i=this.cache,s=t.length,r=sc(e,s);Je(i,r)||(n.uniform1iv(this.addr,r),$e(i,r));let o;this.type===n.SAMPLER_2D_SHADOW?o=nu:o=ip;for(let a=0;a!==s;++a)e.setTexture2D(t[a]||o,r[a])}function Bx(n,t,e){let i=this.cache,s=t.length,r=sc(e,s);Je(i,r)||(n.uniform1iv(this.addr,r),$e(i,r));for(let o=0;o!==s;++o)e.setTexture3D(t[o]||rp,r[o])}function kx(n,t,e){let i=this.cache,s=t.length,r=sc(e,s);Je(i,r)||(n.uniform1iv(this.addr,r),$e(i,r));for(let o=0;o!==s;++o)e.setTextureCube(t[o]||op,r[o])}function zx(n,t,e){let i=this.cache,s=t.length,r=sc(e,s);Je(i,r)||(n.uniform1iv(this.addr,r),$e(i,r));for(let o=0;o!==s;++o)e.setTexture2DArray(t[o]||sp,r[o])}function Vx(n){switch(n){case 5126:return bx;case 35664:return Sx;case 35665:return Tx;case 35666:return Ex;case 35674:return wx;case 35675:return Ax;case 35676:return Rx;case 5124:case 35670:return Cx;case 35667:case 35671:return Px;case 35668:case 35672:return Ix;case 35669:case 35673:return Lx;case 5125:return Dx;case 36294:return Nx;case 36295:return Ux;case 36296:return Fx;case 35678:case 36198:case 36298:case 36306:case 35682:return Ox;case 35679:case 36299:case 36307:return Bx;case 35680:case 36300:case 36308:case 36293:return kx;case 36289:case 36303:case 36311:case 36292:return zx}}var iu=class{constructor(t,e,i){this.id=t,this.addr=i,this.cache=[],this.type=e.type,this.setValue=Mx(e.type)}},su=class{constructor(t,e,i){this.id=t,this.addr=i,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=Vx(e.type)}},ru=class{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,i){let s=this.seq;for(let r=0,o=s.length;r!==o;++r){let a=s[r];a.setValue(t,e[a.id],i)}}},tu=/(\w+)(\])?(\[|\.)?/g;function Gf(n,t){n.seq.push(t),n.map[t.id]=t}function Hx(n,t,e){let i=n.name,s=i.length;for(tu.lastIndex=0;;){let r=tu.exec(i),o=tu.lastIndex,a=r[1],l=r[2]==="]",c=r[3];if(l&&(a=a|0),c===void 0||c==="["&&o+2===s){Gf(e,c===void 0?new iu(a,n,t):new su(a,n,t));break}else{let d=e.map[a];d===void 0&&(d=new ru(a),Gf(e,d)),e=d}}}var Cr=class{constructor(t,e){this.seq=[],this.map={};let i=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let o=0;o<i;++o){let a=t.getActiveUniform(e,o),l=t.getUniformLocation(e,a.name);Hx(a,l,this)}let s=[],r=[];for(let o of this.seq)o.type===t.SAMPLER_2D_SHADOW||o.type===t.SAMPLER_CUBE_SHADOW||o.type===t.SAMPLER_2D_ARRAY_SHADOW?s.push(o):r.push(o);s.length>0&&(this.seq=s.concat(r))}setValue(t,e,i,s){let r=this.map[e];r!==void 0&&r.setValue(t,i,s)}setOptional(t,e,i){let s=e[i];s!==void 0&&this.setValue(t,i,s)}static upload(t,e,i,s){for(let r=0,o=e.length;r!==o;++r){let a=e[r],l=i[a.id];l.needsUpdate!==!1&&a.setValue(t,l.value,s)}}static seqWithValue(t,e){let i=[];for(let s=0,r=t.length;s!==r;++s){let o=t[s];o.id in e&&i.push(o)}return i}};function Wf(n,t,e){let i=n.createShader(t);return n.shaderSource(i,e),n.compileShader(i),i}var Gx=37297,Wx=0;function Xx(n,t){let e=n.split(`
`),i=[],s=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let o=s;o<r;o++){let a=o+1;i.push(`${a===t?">":" "} ${a}: ${e[o]}`)}return i.join(`
`)}var Xf=new Qt;function qx(n){ge._getMatrix(Xf,ge.workingColorSpace,n);let t=`mat3( ${Xf.elements.map(e=>e.toFixed(4))} )`;switch(ge.getTransfer(n)){case eo:return[t,"LinearTransferOETF"];case be:return[t,"sRGBTransferOETF"];default:return Gt("WebGLProgram: Unsupported color space: ",n),[t,"LinearTransferOETF"]}}function qf(n,t,e){let i=n.getShaderParameter(t,n.COMPILE_STATUS),r=(n.getShaderInfoLog(t)||"").trim();if(i&&r==="")return"";let o=/ERROR: 0:(\d+)/.exec(r);if(o){let a=parseInt(o[1]);return e.toUpperCase()+`

`+r+`

`+Xx(n.getShaderSource(t),a)}else return r}function Yx(n,t){let e=qx(t);return[`vec4 ${n}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}var Zx={[Sh]:"Linear",[Th]:"Reinhard",[Eh]:"Cineon",[yo]:"ACESFilmic",[Ah]:"AgX",[Rh]:"Neutral",[wh]:"Custom"};function Jx(n,t){let e=Zx[t];return e===void 0?(Gt("WebGLProgram: Unsupported toneMapping:",t),"vec3 "+n+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+n+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}var Ql=new N;function $x(){ge.getLuminanceCoefficients(Ql);let n=Ql.x.toFixed(4),t=Ql.y.toFixed(4),e=Ql.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${n}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Kx(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Po).join(`
`)}function jx(n){let t=[];for(let e in n){let i=n[e];i!==!1&&t.push("#define "+e+" "+i)}return t.join(`
`)}function Qx(n,t){let e={},i=n.getProgramParameter(t,n.ACTIVE_ATTRIBUTES);for(let s=0;s<i;s++){let r=n.getActiveAttrib(t,s),o=r.name,a=1;r.type===n.FLOAT_MAT2&&(a=2),r.type===n.FLOAT_MAT3&&(a=3),r.type===n.FLOAT_MAT4&&(a=4),e[o]={type:r.type,location:n.getAttribLocation(t,o),locationSize:a}}return e}function Po(n){return n!==""}function Yf(n,t){let e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return n.replace(/NUM_SUN_LIGHTS/g,t.numSunLights).replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,t.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Zf(n,t){return n.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}var ty=/^[ \t]*#include +<([\w\d./]+)>/gm;function ou(n){return n.replace(ty,ny)}var ey=new Map;function ny(n,t){let e=he[t];if(e===void 0){let i=ey.get(t);if(i!==void 0)e=he[i],Gt('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,i);else throw new Error("THREE.WebGLProgram: Can not resolve #include <"+t+">")}return ou(e)}var iy=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Jf(n){return n.replace(iy,sy)}function sy(n,t,e,i){let s="";for(let r=parseInt(t);r<parseInt(e);r++)s+=i.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function $f(n){let t=`precision ${n.precision} float;
	precision ${n.precision} int;
	precision ${n.precision} sampler2D;
	precision ${n.precision} samplerCube;
	precision ${n.precision} sampler3D;
	precision ${n.precision} sampler2DArray;
	precision ${n.precision} sampler2DShadow;
	precision ${n.precision} samplerCubeShadow;
	precision ${n.precision} sampler2DArrayShadow;
	precision ${n.precision} isampler2D;
	precision ${n.precision} isampler3D;
	precision ${n.precision} isamplerCube;
	precision ${n.precision} isampler2DArray;
	precision ${n.precision} usampler2D;
	precision ${n.precision} usampler3D;
	precision ${n.precision} usamplerCube;
	precision ${n.precision} usampler2DArray;
	`;return n.precision==="highp"?t+=`
#define HIGH_PRECISION`:n.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:n.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}var ry={[xo]:"SHADOWMAP_TYPE_PCF",[br]:"SHADOWMAP_TYPE_VSM"};function oy(n){return ry[n.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}var ay={[hs]:"ENVMAP_TYPE_CUBE",[Ls]:"ENVMAP_TYPE_CUBE",[vo]:"ENVMAP_TYPE_CUBE_UV"};function ly(n){return n.envMap===!1?"ENVMAP_TYPE_CUBE":ay[n.envMapMode]||"ENVMAP_TYPE_CUBE"}var cy={[Ls]:"ENVMAP_MODE_REFRACTION"};function hy(n){return n.envMap===!1?"ENVMAP_MODE_REFLECTION":cy[n.envMapMode]||"ENVMAP_MODE_REFLECTION"}var uy={[bh]:"ENVMAP_BLENDING_MULTIPLY",[ff]:"ENVMAP_BLENDING_MIX",[pf]:"ENVMAP_BLENDING_ADD"};function dy(n){return n.envMap===!1?"ENVMAP_BLENDING_NONE":uy[n.combine]||"ENVMAP_BLENDING_NONE"}function fy(n){let t=n.envMapCubeUVHeight;if(t===null)return null;let e=Math.log2(t)-2,i=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),112)),texelHeight:i,maxMip:e}}function py(n,t,e,i){let s=n.getContext(),r=e.defines,o=e.vertexShader,a=e.fragmentShader,l=oy(e),c=ly(e),h=hy(e),d=dy(e),u=fy(e),f=Kx(e),p=jx(r),x=s.createProgram(),g,m,E=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(g=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,p].filter(Po).join(`
`),g.length>0&&(g+=`
`),m=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,p].filter(Po).join(`
`),m.length>0&&(m+=`
`)):(g=[$f(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,p,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexNormals?"#define HAS_NORMAL":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Po).join(`
`),m=[$f(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,p,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+c:"",e.envMap?"#define "+h:"",e.envMap?"#define "+d:"",u?"#define CUBEUV_TEXEL_WIDTH "+u.texelWidth:"",u?"#define CUBEUV_TEXEL_HEIGHT "+u.texelHeight:"",u?"#define CUBEUV_MAX_MIP "+u.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.retroreflection?"#define USE_RETROREFLECTION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor?"#define USE_COLOR":"",e.vertexAlphas||e.batchingColor?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.numLightProbeGrids>0?"#define USE_LIGHT_PROBES_GRID":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==ri?"#define TONE_MAPPING":"",e.toneMapping!==ri?he.tonemapping_pars_fragment:"",e.toneMapping!==ri?Jx("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",he.colorspace_pars_fragment,Yx("linearToOutputTexel",e.outputColorSpace),$x(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(Po).join(`
`)),o=ou(o),o=Yf(o,e),o=Zf(o,e),a=ou(a),a=Yf(a,e),a=Zf(a,e),o=Jf(o),a=Jf(a),e.isRawShaderMaterial!==!0&&(E=`#version 300 es
`,g=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+g,m=["#define varying in",e.glslVersion===Oh?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===Oh?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+m);let C=E+g+o,M=E+m+a,w=Wf(s,s.VERTEX_SHADER,C),v=Wf(s,s.FRAGMENT_SHADER,M);s.attachShader(x,w),s.attachShader(x,v),e.index0AttributeName!==void 0?s.bindAttribLocation(x,0,e.index0AttributeName):e.hasPositionAttribute===!0&&s.bindAttribLocation(x,0,"position"),s.linkProgram(x);function S(P){if(n.debug.checkShaderErrors){let D=s.getProgramInfoLog(x)||"",k=s.getShaderInfoLog(w)||"",L=s.getShaderInfoLog(v)||"",z=D.trim(),W=k.trim(),J=L.trim(),et=!0,O=!0;if(s.getProgramParameter(x,s.LINK_STATUS)===!1)if(et=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(s,x,w,v);else{let q=qf(s,w,"vertex"),j=qf(s,v,"fragment");Jt("WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(x,s.VALIDATE_STATUS)+`

Material Name: `+P.name+`
Material Type: `+P.type+`

Program Info Log: `+z+`
`+q+`
`+j)}else z!==""?Gt("WebGLProgram: Program Info Log:",z):(W===""||J==="")&&(O=!1);O&&(P.diagnostics={runnable:et,programLog:z,vertexShader:{log:W,prefix:g},fragmentShader:{log:J,prefix:m}})}s.deleteShader(w),s.deleteShader(v),_=new Cr(s,x),T=Qx(s,x)}let _;this.getUniforms=function(){return _===void 0&&S(this),_};let T;this.getAttributes=function(){return T===void 0&&S(this),T};let R=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return R===!1&&(R=s.getProgramParameter(x,Gx)),R},this.destroy=function(){i.releaseStatesOfProgram(this),s.deleteProgram(x),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=Wx++,this.cacheKey=t,this.usedTimes=1,this.program=x,this.vertexShader=w,this.fragmentShader=v,this}var my=0,au=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t,e,i){let s=this._getShaderCacheForMaterial(t);return s.has(e)===!1&&(s.add(e),e.usedTimes++),s.has(i)===!1&&(s.add(i),i.usedTimes++),this}remove(t){let e=this.materialCache.get(t);for(let i of e)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(t),this}getVertexShaderStage(t){return this._getShaderStage(t.vertexShader)}getFragmentShaderStage(t){return this._getShaderStage(t.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){let e=this.materialCache,i=e.get(t);return i===void 0&&(i=new Set,e.set(t,i)),i}_getShaderStage(t){let e=this.shaderCache,i=e.get(t);return i===void 0&&(i=new lu(t),e.set(t,i)),i}},lu=class{constructor(t){this.id=my++,this.code=t,this.usedTimes=0}};function gy(n){return n===fs||n===wo||n===Ao}function _y(n,t,e,i,s,r){let o=new so,a=new au,l=new Set,c=[],h=new Map,d=i.logarithmicDepthBuffer,u=i.precision,f={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function p(_){return l.add(_),_===0?"uv":`uv${_}`}function x(_,T,R,P,D,k){let L=P.fog,z=D.geometry,W=_.isMeshStandardMaterial||_.isMeshLambertMaterial||_.isMeshPhongMaterial?P.environment:null,J=_.isMeshStandardMaterial||_.isMeshLambertMaterial&&!_.envMap||_.isMeshPhongMaterial&&!_.envMap,et=t.get(_.envMap||W,J),O=et&&et.mapping===vo?et.image.height:null,q=f[_.type];_.precision!==null&&(u=i.getMaxPrecision(_.precision),u!==_.precision&&Gt("WebGLProgram.getParameters:",_.precision,"not supported, using",u,"instead."));let j=z.morphAttributes.position||z.morphAttributes.normal||z.morphAttributes.color,yt=j!==void 0?j.length:0,Tt=0;z.morphAttributes.position!==void 0&&(Tt=1),z.morphAttributes.normal!==void 0&&(Tt=2),z.morphAttributes.color!==void 0&&(Tt=3);let pe,qt,Et,Y;if(q){let Nt=Ti[q];pe=Nt.vertexShader,qt=Nt.fragmentShader}else{pe=_.vertexShader,qt=_.fragmentShader;let Nt=a.getVertexShaderStage(_),Kt=a.getFragmentShaderStage(_);a.update(_,Nt,Kt),Et=Nt.id,Y=Kt.id}let K=n.getRenderTarget(),it=n.state.buffers.depth.getReversed(),Ct=D.isInstancedMesh===!0,ot=D.isBatchedMesh===!0,ut=!!_.map,Yt=!!_.matcap,Bt=!!et,Wt=!!_.aoMap,kt=!!_.lightMap,Dt=!!_.bumpMap&&_.wireframe===!1,te=!!_.normalMap,ue=!!_.displacementMap,Se=!!_.emissiveMap,jt=!!_.metalnessMap,le=!!_.roughnessMap,I=_.anisotropy>0,ne=_.clearcoat>0,Pt=_.dispersion>0,A=_.retroreflectivity>0,y=_.iridescence>0,B=_.sheen>0,V=_.transmission>0,Z=I&&!!_.anisotropyMap,st=ne&&!!_.clearcoatMap,rt=ne&&!!_.clearcoatNormalMap,$=ne&&!!_.clearcoatRoughnessMap,Q=y&&!!_.iridescenceMap,at=y&&!!_.iridescenceThicknessMap,Ut=B&&!!_.sheenColorMap,dt=B&&!!_.sheenRoughnessMap,ct=!!_.specularMap,It=!!_.specularColorMap,Ht=!!_.specularIntensityMap,zt=V&&!!_.transmissionMap,F=V&&!!_.thicknessMap,ht=!!_.gradientMap,tt=!!_.alphaMap,lt=_.alphaTest>0,mt=!!_.alphaHash,nt=!!_.extensions,xt=ri;_.toneMapped&&(K===null||K.isXRRenderTarget===!0)&&(xt=n.toneMapping);let wt={shaderID:q,shaderType:_.type,shaderName:_.name,vertexShader:pe,fragmentShader:qt,defines:_.defines,customVertexShaderID:Et,customFragmentShaderID:Y,isRawShaderMaterial:_.isRawShaderMaterial===!0,glslVersion:_.glslVersion,precision:u,batching:ot,batchingColor:ot&&D._colorsTexture!==null,instancing:Ct,instancingColor:Ct&&D.instanceColor!==null,instancingMorph:Ct&&D.morphTexture!==null,outputColorSpace:K===null?n.outputColorSpace:K.isXRRenderTarget===!0?K.texture.colorSpace:ge.workingColorSpace,alphaToCoverage:!!_.alphaToCoverage,map:ut,matcap:Yt,envMap:Bt,envMapMode:Bt&&et.mapping,envMapCubeUVHeight:O,aoMap:Wt,lightMap:kt,bumpMap:Dt,normalMap:te,displacementMap:ue,emissiveMap:Se,normalMapObjectSpace:te&&_.normalMapType===_f,normalMapTangentSpace:te&&_.normalMapType===Jl,packedNormalMap:te&&_.normalMapType===Jl&&gy(_.normalMap.format),metalnessMap:jt,roughnessMap:le,anisotropy:I,anisotropyMap:Z,clearcoat:ne,clearcoatMap:st,clearcoatNormalMap:rt,clearcoatRoughnessMap:$,dispersion:Pt,retroreflection:A,iridescence:y,iridescenceMap:Q,iridescenceThicknessMap:at,sheen:B,sheenColorMap:Ut,sheenRoughnessMap:dt,specularMap:ct,specularColorMap:It,specularIntensityMap:Ht,transmission:V,transmissionMap:zt,thicknessMap:F,gradientMap:ht,opaque:_.transparent===!1&&_.blending===Sr&&_.alphaToCoverage===!1,alphaMap:tt,alphaTest:lt,alphaHash:mt,combine:_.combine,mapUv:ut&&p(_.map.channel),aoMapUv:Wt&&p(_.aoMap.channel),lightMapUv:kt&&p(_.lightMap.channel),bumpMapUv:Dt&&p(_.bumpMap.channel),normalMapUv:te&&p(_.normalMap.channel),displacementMapUv:ue&&p(_.displacementMap.channel),emissiveMapUv:Se&&p(_.emissiveMap.channel),metalnessMapUv:jt&&p(_.metalnessMap.channel),roughnessMapUv:le&&p(_.roughnessMap.channel),anisotropyMapUv:Z&&p(_.anisotropyMap.channel),clearcoatMapUv:st&&p(_.clearcoatMap.channel),clearcoatNormalMapUv:rt&&p(_.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:$&&p(_.clearcoatRoughnessMap.channel),iridescenceMapUv:Q&&p(_.iridescenceMap.channel),iridescenceThicknessMapUv:at&&p(_.iridescenceThicknessMap.channel),sheenColorMapUv:Ut&&p(_.sheenColorMap.channel),sheenRoughnessMapUv:dt&&p(_.sheenRoughnessMap.channel),specularMapUv:ct&&p(_.specularMap.channel),specularColorMapUv:It&&p(_.specularColorMap.channel),specularIntensityMapUv:Ht&&p(_.specularIntensityMap.channel),transmissionMapUv:zt&&p(_.transmissionMap.channel),thicknessMapUv:F&&p(_.thicknessMap.channel),alphaMapUv:tt&&p(_.alphaMap.channel),vertexTangents:!!z.attributes.tangent&&(te||I),vertexNormals:!!z.attributes.normal,vertexColors:_.vertexColors,vertexAlphas:_.vertexColors===!0&&!!z.attributes.color&&z.attributes.color.itemSize===4,pointsUvs:D.isPoints===!0&&!!z.attributes.uv&&(ut||tt),fog:!!L,useFog:_.fog===!0,fogExp2:!!L&&L.isFogExp2,flatShading:_.wireframe===!1&&(_.flatShading===!0||z.attributes.normal===void 0&&te===!1&&(_.isMeshLambertMaterial||_.isMeshPhongMaterial||_.isMeshStandardMaterial||_.isMeshPhysicalMaterial)),sizeAttenuation:_.sizeAttenuation===!0,logarithmicDepthBuffer:d,reversedDepthBuffer:it,skinning:D.isSkinnedMesh===!0,hasPositionAttribute:z.attributes.position!==void 0,morphTargets:z.morphAttributes.position!==void 0,morphNormals:z.morphAttributes.normal!==void 0,morphColors:z.morphAttributes.color!==void 0,morphTargetsCount:yt,morphTextureStride:Tt,numSunLights:T.sun.length,numDirLights:T.directional.length,numPointLights:T.point.length,numSpotLights:T.spot.length,numSpotLightMaps:T.spotLightMap.length,numRectAreaLights:T.rectArea.length,numHemiLights:T.hemi.length,numSunLightShadows:T.sunShadowMap.length,numDirLightShadows:T.directionalShadowMap.length,numPointLightShadows:T.pointShadowMap.length,numSpotLightShadows:T.spotShadowMap.length,numSpotLightShadowsWithMaps:T.numSpotLightShadowsWithMaps,numLightProbes:T.numLightProbes,numLightProbeGrids:k.length,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:_.dithering,shadowMapEnabled:n.shadowMap.enabled&&R.length>0,shadowMapType:n.shadowMap.type,toneMapping:xt,decodeVideoTexture:ut&&_.map.isVideoTexture===!0&&ge.getTransfer(_.map.colorSpace)===be,decodeVideoTextureEmissive:Se&&_.emissiveMap.isVideoTexture===!0&&ge.getTransfer(_.emissiveMap.colorSpace)===be,premultipliedAlpha:_.premultipliedAlpha,doubleSided:_.side===Zn,flipSided:_.side===xn,useDepthPacking:_.depthPacking>=0,depthPacking:_.depthPacking||0,index0AttributeName:_.index0AttributeName,extensionClipCullDistance:nt&&_.extensions.clipCullDistance===!0&&e.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(nt&&_.extensions.multiDraw===!0||ot)&&e.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:e.has("KHR_parallel_shader_compile"),customProgramCacheKey:_.customProgramCacheKey()};return wt.vertexUv1s=l.has(1),wt.vertexUv2s=l.has(2),wt.vertexUv3s=l.has(3),l.clear(),wt}function g(_){let T=[];if(_.shaderID?T.push(_.shaderID):(T.push(_.customVertexShaderID),T.push(_.customFragmentShaderID)),_.defines!==void 0)for(let R in _.defines)T.push(R),T.push(_.defines[R]);return _.isRawShaderMaterial===!1&&(m(T,_),E(T,_),T.push(n.outputColorSpace)),T.push(_.customProgramCacheKey),T.join()}function m(_,T){_.push(T.precision),_.push(T.outputColorSpace),_.push(T.envMapMode),_.push(T.envMapCubeUVHeight),_.push(T.mapUv),_.push(T.alphaMapUv),_.push(T.lightMapUv),_.push(T.aoMapUv),_.push(T.bumpMapUv),_.push(T.normalMapUv),_.push(T.displacementMapUv),_.push(T.emissiveMapUv),_.push(T.metalnessMapUv),_.push(T.roughnessMapUv),_.push(T.anisotropyMapUv),_.push(T.clearcoatMapUv),_.push(T.clearcoatNormalMapUv),_.push(T.clearcoatRoughnessMapUv),_.push(T.iridescenceMapUv),_.push(T.iridescenceThicknessMapUv),_.push(T.sheenColorMapUv),_.push(T.sheenRoughnessMapUv),_.push(T.specularMapUv),_.push(T.specularColorMapUv),_.push(T.specularIntensityMapUv),_.push(T.transmissionMapUv),_.push(T.thicknessMapUv),_.push(T.combine),_.push(T.fogExp2),_.push(T.sizeAttenuation),_.push(T.morphTargetsCount),_.push(T.morphAttributeCount),_.push(T.numSunLights),_.push(T.numDirLights),_.push(T.numPointLights),_.push(T.numSpotLights),_.push(T.numSpotLightMaps),_.push(T.numHemiLights),_.push(T.numRectAreaLights),_.push(T.numSunLightShadows),_.push(T.numDirLightShadows),_.push(T.numPointLightShadows),_.push(T.numSpotLightShadows),_.push(T.numSpotLightShadowsWithMaps),_.push(T.numLightProbes),_.push(T.shadowMapType),_.push(T.toneMapping),_.push(T.numClippingPlanes),_.push(T.numClipIntersection),_.push(T.depthPacking)}function E(_,T){o.disableAll(),T.instancing&&o.enable(0),T.instancingColor&&o.enable(1),T.instancingMorph&&o.enable(2),T.matcap&&o.enable(3),T.envMap&&o.enable(4),T.normalMapObjectSpace&&o.enable(5),T.normalMapTangentSpace&&o.enable(6),T.clearcoat&&o.enable(7),T.iridescence&&o.enable(8),T.alphaTest&&o.enable(9),T.vertexColors&&o.enable(10),T.vertexAlphas&&o.enable(11),T.vertexUv1s&&o.enable(12),T.vertexUv2s&&o.enable(13),T.vertexUv3s&&o.enable(14),T.vertexTangents&&o.enable(15),T.anisotropy&&o.enable(16),T.alphaHash&&o.enable(17),T.batching&&o.enable(18),T.dispersion&&o.enable(19),T.retroreflection&&o.enable(24),T.batchingColor&&o.enable(20),T.gradientMap&&o.enable(21),T.packedNormalMap&&o.enable(22),T.vertexNormals&&o.enable(23),_.push(o.mask),o.disableAll(),T.fog&&o.enable(0),T.useFog&&o.enable(1),T.flatShading&&o.enable(2),T.logarithmicDepthBuffer&&o.enable(3),T.reversedDepthBuffer&&o.enable(4),T.skinning&&o.enable(5),T.morphTargets&&o.enable(6),T.morphNormals&&o.enable(7),T.morphColors&&o.enable(8),T.premultipliedAlpha&&o.enable(9),T.shadowMapEnabled&&o.enable(10),T.doubleSided&&o.enable(11),T.flipSided&&o.enable(12),T.useDepthPacking&&o.enable(13),T.dithering&&o.enable(14),T.transmission&&o.enable(15),T.sheen&&o.enable(16),T.opaque&&o.enable(17),T.pointsUvs&&o.enable(18),T.decodeVideoTexture&&o.enable(19),T.decodeVideoTextureEmissive&&o.enable(20),T.alphaToCoverage&&o.enable(21),T.numLightProbeGrids>0&&o.enable(22),T.hasPositionAttribute&&o.enable(23),_.push(o.mask)}function C(_){let T=f[_.type],R;if(T){let P=Ti[T];R=If.clone(P.uniforms)}else R=_.uniforms;return R}function M(_,T){let R=h.get(T);return R!==void 0?++R.usedTimes:(R=new py(n,T,_,s),c.push(R),h.set(T,R)),R}function w(_){if(--_.usedTimes===0){let T=c.indexOf(_);c[T]=c[c.length-1],c.pop(),h.delete(_.cacheKey),_.destroy()}}function v(_){a.remove(_)}function S(){a.dispose()}return{getParameters:x,getProgramCacheKey:g,getUniforms:C,acquireProgram:M,releaseProgram:w,releaseShaderCache:v,programs:c,dispose:S}}function xy(){let n=new WeakMap;function t(o){return n.has(o)}function e(o){let a=n.get(o);return a===void 0&&(a={},n.set(o,a)),a}function i(o){n.delete(o)}function s(o,a,l){n.get(o)[a]=l}function r(){n=new WeakMap}return{has:t,get:e,remove:i,update:s,dispose:r}}function yy(n,t){return n.groupOrder!==t.groupOrder?n.groupOrder-t.groupOrder:n.renderOrder!==t.renderOrder?n.renderOrder-t.renderOrder:n.material.id!==t.material.id?n.material.id-t.material.id:n.materialVariant!==t.materialVariant?n.materialVariant-t.materialVariant:n.z!==t.z?n.z-t.z:n.id-t.id}function Kf(n,t){return n.groupOrder!==t.groupOrder?n.groupOrder-t.groupOrder:n.renderOrder!==t.renderOrder?n.renderOrder-t.renderOrder:n.z!==t.z?t.z-n.z:n.id-t.id}function jf(){let n=[],t=0,e=[],i=[],s=[];function r(){t=0,e.length=0,i.length=0,s.length=0}function o(u){let f=0;return u.isInstancedMesh&&(f+=2),u.isSkinnedMesh&&(f+=1),f}function a(u,f,p,x,g,m){let E=n[t];return E===void 0?(E={id:u.id,object:u,geometry:f,material:p,materialVariant:o(u),groupOrder:x,renderOrder:u.renderOrder,z:g,group:m},n[t]=E):(E.id=u.id,E.object=u,E.geometry=f,E.material=p,E.materialVariant=o(u),E.groupOrder=x,E.renderOrder=u.renderOrder,E.z=g,E.group=m),t++,E}function l(u,f,p,x,g,m,E){E.reversedDepth===!0&&(g=-g);let C=a(u,f,p,x,g,m);p.transmission>0?i.push(C):p.transparent===!0?s.push(C):e.push(C)}function c(u,f,p,x,g,m){let E=a(u,f,p,x,g,m);p.transmission>0?i.unshift(E):p.transparent===!0?s.unshift(E):e.unshift(E)}function h(u,f){e.length>1&&e.sort(u||yy),i.length>1&&i.sort(f||Kf),s.length>1&&s.sort(f||Kf)}function d(){for(let u=t,f=n.length;u<f;u++){let p=n[u];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:e,transmissive:i,transparent:s,init:r,push:l,unshift:c,finish:d,sort:h}}function vy(){let n=new WeakMap;function t(i,s){let r=n.get(i),o;return r===void 0?(o=new jf,n.set(i,[o])):s>=r.length?(o=new jf,r.push(o)):o=r[s],o}function e(){n=new WeakMap}return{get:t,dispose:e}}function My(){let n={};return{get:function(t){if(n[t.id]!==void 0)return n[t.id];let e;switch(t.type){case"SunLight":case"DirectionalLight":e={direction:new N,color:new ae};break;case"SpotLight":e={position:new N,direction:new N,color:new ae,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new N,color:new ae,distance:0,decay:0};break;case"HemisphereLight":e={direction:new N,skyColor:new ae,groundColor:new ae};break;case"RectAreaLight":e={color:new ae,position:new N,halfWidth:new N,halfHeight:new N};break}return n[t.id]=e,e}}}function by(){let n={};return{get:function(t){if(n[t.id]!==void 0)return n[t.id];let e;switch(t.type){case"SunLight":case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Zt};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Zt};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Zt,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[t.id]=e,e}}}var Sy=0;function Ty(n,t){return(t.castShadow?2:0)-(n.castShadow?2:0)+(t.map?1:0)-(n.map?1:0)}function Ey(n){let t=new My,e=by(),i={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)i.probe.push(new N);let s=new N,r=new De,o=new De;function a(c){let h=0,d=0,u=0;for(let D=0;D<9;D++)i.probe[D].set(0,0,0);let f=0,p=0,x=0,g=0,m=0,E=0,C=0,M=0,w=0,v=0,S=0,_=0,T=0,R=0;c.sort(Ty);for(let D=0,k=c.length;D<k;D++){let L=c[D],z=L.color,W=L.intensity,J=L.distance,et=null;if(L.shadow&&L.shadow.map&&(L.shadow.map.texture.format===fs?et=L.shadow.map.texture:et=L.shadow.map.depthTexture||L.shadow.map.texture),L.isAmbientLight)h+=z.r*W,d+=z.g*W,u+=z.b*W;else if(L.isLightProbe){for(let O=0;O<9;O++)i.probe[O].addScaledVector(L.sh.coefficients[O],W);R++}else if(L.isSunLight){let O=t.get(L);if(O.color.copy(L.color).multiplyScalar(L.intensity),L.castShadow){let q=L.shadow,j=e.get(L);j.shadowIntensity=q.intensity,j.shadowBias=q.bias,j.shadowNormalBias=q.normalBias,j.shadowRadius=q.radius,j.shadowMapSize.copy(q.mapSize).multiply(q.getFrameExtents()),i.sunShadow[p]=j,i.sunShadowMap[p]=et;let yt=q.getViewportCount();for(let Tt=0;Tt<yt;Tt++)i.sunShadowMatrix[x+Tt]=q.getMatrix(Tt),i.sunShadowCascade[x+Tt]=q._cascadeData[Tt];x+=yt,p++}i.sun[f]=O,f++}else if(L.isDirectionalLight){let O=t.get(L);if(O.color.copy(L.color).multiplyScalar(L.intensity),L.castShadow){let q=L.shadow,j=e.get(L);j.shadowIntensity=q.intensity,j.shadowBias=q.bias,j.shadowNormalBias=q.normalBias,j.shadowRadius=q.radius,j.shadowMapSize=q.mapSize,i.directionalShadow[g]=j,i.directionalShadowMap[g]=et,i.directionalShadowMatrix[g]=L.shadow.matrix,w++}i.directional[g]=O,g++}else if(L.isSpotLight){let O=t.get(L);O.position.setFromMatrixPosition(L.matrixWorld),O.color.copy(z).multiplyScalar(W),O.distance=J,O.coneCos=Math.cos(L.angle),O.penumbraCos=Math.cos(L.angle*(1-L.penumbra)),O.decay=L.decay,i.spot[E]=O;let q=L.shadow;if(L.map&&(i.spotLightMap[_]=L.map,_++,q.updateMatrices(L),L.castShadow&&T++),i.spotLightMatrix[E]=q.matrix,L.castShadow){let j=e.get(L);j.shadowIntensity=q.intensity,j.shadowBias=q.bias,j.shadowNormalBias=q.normalBias,j.shadowRadius=q.radius,j.shadowMapSize=q.mapSize,i.spotShadow[E]=j,i.spotShadowMap[E]=et,S++}E++}else if(L.isRectAreaLight){let O=t.get(L);O.color.copy(z).multiplyScalar(W),O.halfWidth.set(L.width*.5,0,0),O.halfHeight.set(0,L.height*.5,0),i.rectArea[C]=O,C++}else if(L.isPointLight){let O=t.get(L);if(O.color.copy(L.color).multiplyScalar(L.intensity),O.distance=L.distance,O.decay=L.decay,L.castShadow){let q=L.shadow,j=e.get(L);j.shadowIntensity=q.intensity,j.shadowBias=q.bias,j.shadowNormalBias=q.normalBias,j.shadowRadius=q.radius,j.shadowMapSize=q.mapSize,j.shadowCameraNear=q.camera.near,j.shadowCameraFar=q.camera.far,i.pointShadow[m]=j,i.pointShadowMap[m]=et,i.pointShadowMatrix[m]=L.shadow.matrix,v++}i.point[m]=O,m++}else if(L.isHemisphereLight){let O=t.get(L);O.skyColor.copy(L.color).multiplyScalar(W),O.groundColor.copy(L.groundColor).multiplyScalar(W),i.hemi[M]=O,M++}}C>0&&(n.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=pt.LTC_FLOAT_1,i.rectAreaLTC2=pt.LTC_FLOAT_2):(i.rectAreaLTC1=pt.LTC_HALF_1,i.rectAreaLTC2=pt.LTC_HALF_2)),i.ambient[0]=h,i.ambient[1]=d,i.ambient[2]=u;let P=i.hash;(P.sunLength!==f||P.directionalLength!==g||P.pointLength!==m||P.spotLength!==E||P.rectAreaLength!==C||P.hemiLength!==M||P.numSunShadows!==p||P.numDirectionalShadows!==w||P.numPointShadows!==v||P.numSpotShadows!==S||P.numSpotMaps!==_||P.numLightProbes!==R)&&(i.sun.length=f,i.directional.length=g,i.spot.length=E,i.rectArea.length=C,i.point.length=m,i.hemi.length=M,i.sunShadow.length=p,i.sunShadowMap.length=p,i.sunShadowMatrix.length=x,i.sunShadowCascade.length=x,i.directionalShadow.length=w,i.directionalShadowMap.length=w,i.directionalShadowMatrix.length=w,i.pointShadow.length=v,i.pointShadowMap.length=v,i.pointShadowMatrix.length=v,i.spotShadow.length=S,i.spotShadowMap.length=S,i.spotLightMatrix.length=S+_-T,i.spotLightMap.length=_,i.numSpotLightShadowsWithMaps=T,i.numLightProbes=R,P.sunLength=f,P.directionalLength=g,P.pointLength=m,P.spotLength=E,P.rectAreaLength=C,P.hemiLength=M,P.numSunShadows=p,P.numDirectionalShadows=w,P.numPointShadows=v,P.numSpotShadows=S,P.numSpotMaps=_,P.numLightProbes=R,i.version=Sy++)}function l(c,h){let d=0,u=0,f=0,p=0,x=0,g=0,m=h.matrixWorldInverse;for(let E=0,C=c.length;E<C;E++){let M=c[E];if(M.isSunLight){let w=i.sun[d];w.direction.setFromMatrixPosition(M.matrixWorld),w.direction.transformDirection(m),d++}else if(M.isDirectionalLight){let w=i.directional[u];w.direction.setFromMatrixPosition(M.matrixWorld),s.setFromMatrixPosition(M.target.matrixWorld),w.direction.sub(s),w.direction.transformDirection(m),u++}else if(M.isSpotLight){let w=i.spot[p];w.position.setFromMatrixPosition(M.matrixWorld),w.position.applyMatrix4(m),w.direction.setFromMatrixPosition(M.matrixWorld),s.setFromMatrixPosition(M.target.matrixWorld),w.direction.sub(s),w.direction.transformDirection(m),p++}else if(M.isRectAreaLight){let w=i.rectArea[x];w.position.setFromMatrixPosition(M.matrixWorld),w.position.applyMatrix4(m),o.identity(),r.copy(M.matrixWorld),r.premultiply(m),o.extractRotation(r),w.halfWidth.set(M.width*.5,0,0),w.halfHeight.set(0,M.height*.5,0),w.halfWidth.applyMatrix4(o),w.halfHeight.applyMatrix4(o),x++}else if(M.isPointLight){let w=i.point[f];w.position.setFromMatrixPosition(M.matrixWorld),w.position.applyMatrix4(m),f++}else if(M.isHemisphereLight){let w=i.hemi[g];w.direction.setFromMatrixPosition(M.matrixWorld),w.direction.transformDirection(m),g++}}}return{setup:a,setupView:l,state:i}}function Qf(n){let t=new Ey(n),e=[],i=[],s=[];function r(u){d.camera=u,e.length=0,i.length=0,s.length=0}function o(u){e.push(u)}function a(u){i.push(u)}function l(u){s.push(u)}function c(){t.setup(e)}function h(u){t.setupView(e,u)}let d={lightsArray:e,shadowsArray:i,lightProbeGridArray:s,camera:null,lights:t,transmissionRenderTarget:{},textureUnits:0};return{init:r,state:d,setupLights:c,setupLightsView:h,pushLight:o,pushShadow:a,pushLightProbeGrid:l}}function wy(n){let t=new WeakMap;function e(s,r=0){let o=t.get(s),a;return o===void 0?(a=new Qf(n),t.set(s,[a])):r>=o.length?(a=new Qf(n),o.push(a)):a=o[r],a}function i(){t=new WeakMap}return{get:e,dispose:i}}var Ay=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Ry=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,Cy=[new N(1,0,0),new N(-1,0,0),new N(0,1,0),new N(0,-1,0),new N(0,0,1),new N(0,0,-1)],Py=[new N(0,-1,0),new N(0,-1,0),new N(0,0,1),new N(0,0,-1),new N(0,-1,0),new N(0,-1,0)],tp=new De,Co=new N,eu=new N;function Iy(n,t,e){let i=new _r,s=new Zt,r=new Zt,o=new Ne,a=new Za,l=new Ja,c={},h=e.maxTextureSize,d={[cs]:xn,[xn]:cs,[Zn]:Zn},u=new On({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Zt},radius:{value:4}},vertexShader:Ay,fragmentShader:Ry}),f=u.clone();f.defines.HORIZONTAL_PASS=1;let p=new Xe;p.setAttribute("position",new Yn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let x=new gn(p,u),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=xo;let m=this.type;this.render=function(v,S,_){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||v.length===0)return;this.type===Yd&&(Gt("WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead."),this.type=xo);let T=n.getRenderTarget(),R=n.getActiveCubeFace(),P=n.getActiveMipmapLevel(),D=n.state;D.setBlending(bi),D.buffers.depth.getReversed()===!0?D.buffers.color.setClear(0,0,0,0):D.buffers.color.setClear(1,1,1,1),D.buffers.depth.setTest(!0),D.setScissorTest(!1);let k=m!==this.type;k&&S.traverse(function(L){L.material&&(Array.isArray(L.material)?L.material.forEach(z=>z.needsUpdate=!0):L.material.needsUpdate=!0)});for(let L=0,z=v.length;L<z;L++){let W=v[L],J=W.shadow;if(J===void 0){Gt("WebGLShadowMap:",W,"has no shadow.");continue}if(J.autoUpdate===!1&&J.needsUpdate===!1)continue;s.copy(J.mapSize);let et=J.getFrameExtents();s.multiply(et),r.copy(J.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/et.x),s.x=r.x*et.x,J.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/et.y),s.y=r.y*et.y,J.mapSize.y=r.y));let O=n.state.buffers.depth.getReversed();if(J.camera._reversedDepth=O,J.map===null||k===!0){if(J.map!==null&&(J.map.depthTexture!==null&&(J.map.depthTexture.dispose(),J.map.depthTexture=null),J.map.dispose()),this.type===br){if(W.isPointLight){Gt("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}J.map=new En(s.x,s.y,{format:fs,type:li,minFilter:sn,magFilter:sn,generateMipmaps:!1}),J.map.texture.name=W.name+".shadowMap",J.map.depthTexture=new es(s.x,s.y,ai),J.map.depthTexture.name=W.name+".shadowMapDepth",J.map.depthTexture.format=Mi,J.map.depthTexture.compareFunction=null,J.map.depthTexture.minFilter=Qe,J.map.depthTexture.magFilter=Qe}else W.isPointLight?(J.map=new ec(s.x),J.map.depthTexture=new Xa(s.x,oi)):(J.map=new En(s.x,s.y),J.map.depthTexture=new es(s.x,s.y,oi)),J.map.depthTexture.name=W.name+".shadowMap",J.map.depthTexture.format=Mi,this.type===xo?(J.map.depthTexture.compareFunction=O?Kl:$l,J.map.depthTexture.minFilter=sn,J.map.depthTexture.magFilter=sn):(J.map.depthTexture.compareFunction=null,J.map.depthTexture.minFilter=Qe,J.map.depthTexture.magFilter=Qe);J.camera.updateProjectionMatrix()}J.map.isWebGLCubeRenderTarget!==!0&&(J.map.width!==s.x||J.map.height!==s.y)&&J.map.setSize(s.x,s.y);let q=J.map.isWebGLCubeRenderTarget?6:J.getViewportCount();W.isPointLight!==!0&&J.updateMatrices(W,_);for(let j=0;j<q;j++){let yt=J.getCamera(j);if(W.isPointLight){let Tt=J.camera,pe=J.matrix,qt=W.distance||Tt.far;qt!==Tt.far&&(Tt.far=qt,Tt.updateProjectionMatrix()),Co.setFromMatrixPosition(W.matrixWorld),Tt.position.copy(Co),eu.copy(Tt.position),eu.add(Cy[j]),Tt.up.copy(Py[j]),Tt.lookAt(eu),Tt.updateMatrixWorld(),pe.makeTranslation(-Co.x,-Co.y,-Co.z),tp.multiplyMatrices(Tt.projectionMatrix,Tt.matrixWorldInverse),J._frustum.setFromProjectionMatrix(tp,Tt.coordinateSystem,Tt.reversedDepth)}if(J.map.isWebGLCubeRenderTarget)n.setRenderTarget(J.map,j),n.clear();else{j===0&&(n.setRenderTarget(J.map),n.clear());let Tt=J.getViewport(j);o.set(r.x*Tt.x,r.y*Tt.y,r.x*Tt.z,r.y*Tt.w),D.viewport(o)}i=J.getFrustum(j),M(S,_,yt,W,this.type)}J.isPointLightShadow!==!0&&this.type===br&&E(J,_),J.needsUpdate=!1}m=this.type,g.needsUpdate=!1,n.setRenderTarget(T,R,P)};function E(v,S){let _=t.update(x);u.defines.VSM_SAMPLES!==v.blurSamples&&(u.defines.VSM_SAMPLES=v.blurSamples,f.defines.VSM_SAMPLES=v.blurSamples,u.needsUpdate=!0,f.needsUpdate=!0),v.mapPass===null?v.mapPass=new En(s.x,s.y,{format:fs,type:li}):(v.mapPass.width!==v.map.width||v.mapPass.height!==v.map.height)&&v.mapPass.setSize(v.map.width,v.map.height),u.uniforms.shadow_pass.value=v.map.depthTexture,u.uniforms.resolution.value.set(v.map.width,v.map.height),u.uniforms.radius.value=v.radius,n.setRenderTarget(v.mapPass),n.clear(),n.renderBufferDirect(S,null,_,u,x,null),f.uniforms.shadow_pass.value=v.mapPass.texture,f.uniforms.resolution.value.set(v.map.width,v.map.height),f.uniforms.radius.value=v.radius,n.setRenderTarget(v.map),n.clear(),n.renderBufferDirect(S,null,_,f,x,null)}function C(v,S,_,T){let R=null,P=_.isPointLight===!0?v.customDistanceMaterial:v.customDepthMaterial;if(P!==void 0)R=P;else if(R=_.isPointLight===!0?l:a,n.localClippingEnabled&&S.clipShadows===!0&&Array.isArray(S.clippingPlanes)&&S.clippingPlanes.length!==0||S.displacementMap&&S.displacementScale!==0||S.alphaMap&&S.alphaTest>0||S.map&&S.alphaTest>0||S.alphaToCoverage===!0){let D=R.uuid,k=S.uuid,L=c[D];L===void 0&&(L={},c[D]=L);let z=L[k];z===void 0&&(z=R.clone(),L[k]=z,S.addEventListener("dispose",w)),R=z}if(R.visible=S.visible,R.wireframe=S.wireframe,T===br?R.side=S.shadowSide!==null?S.shadowSide:S.side:R.side=S.shadowSide!==null?S.shadowSide:d[S.side],R.alphaMap=S.alphaMap,R.alphaTest=S.alphaToCoverage===!0?.5:S.alphaTest,R.map=S.map,R.clipShadows=S.clipShadows,R.clippingPlanes=S.clippingPlanes,R.clipIntersection=S.clipIntersection,R.displacementMap=S.displacementMap,R.displacementScale=S.displacementScale,R.displacementBias=S.displacementBias,R.wireframeLinewidth=S.wireframeLinewidth,R.linewidth=S.linewidth,_.isPointLight===!0&&R.isMeshDistanceMaterial===!0){let D=n.properties.get(R);D.light=_}return R}function M(v,S,_,T,R){if(v.visible===!1)return;if(v.layers.test(S.layers)&&(v.isMesh||v.isLine||v.isPoints)&&(v.castShadow||v.receiveShadow&&R===br)&&(!v.frustumCulled||v.intersectsFrustum(i))){v.modelViewMatrix.multiplyMatrices(_.matrixWorldInverse,v.matrixWorld);let k=t.update(v),L=v.material;if(Array.isArray(L)){let z=k.groups;for(let W=0,J=z.length;W<J;W++){let et=z[W],O=L[et.materialIndex];if(O&&O.visible){let q=C(v,O,T,R);v.onBeforeShadow(n,v,S,_,k,q,et),n.renderBufferDirect(_,null,k,q,v,et),v.onAfterShadow(n,v,S,_,k,q,et)}}}else if(L.visible){let z=C(v,L,T,R);v.onBeforeShadow(n,v,S,_,k,z,null),n.renderBufferDirect(_,null,k,z,v,null),v.onAfterShadow(n,v,S,_,k,z,null)}}let D=v.children;for(let k=0,L=D.length;k<L;k++)M(D[k],S,_,T,R)}function w(v){v.target.removeEventListener("dispose",w);for(let _ in c){let T=c[_],R=v.target.uuid;R in T&&(T[R].dispose(),delete T[R])}}}function Ly(n,t){function e(){let F=!1,ht=new Ne,tt=null,lt=new Ne(0,0,0,0);return{setMask:function(mt){tt!==mt&&!F&&(n.colorMask(mt,mt,mt,mt),tt=mt)},setLocked:function(mt){F=mt},setClear:function(mt,nt,xt,wt,Nt){Nt===!0&&(mt*=wt,nt*=wt,xt*=wt),ht.set(mt,nt,xt,wt),lt.equals(ht)===!1&&(n.clearColor(mt,nt,xt,wt),lt.copy(ht))},reset:function(){F=!1,tt=null,lt.set(-1,0,0,0)}}}function i(){let F=!1,ht=!1,tt=null,lt=null,mt=null;return{setReversed:function(nt){if(ht!==nt){let xt=t.get("EXT_clip_control");nt?xt.clipControlEXT(xt.LOWER_LEFT_EXT,xt.ZERO_TO_ONE_EXT):xt.clipControlEXT(xt.LOWER_LEFT_EXT,xt.NEGATIVE_ONE_TO_ONE_EXT),ht=nt;let wt=mt;mt=null,this.setClear(wt)}},getReversed:function(){return ht},setTest:function(nt){nt?K(n.DEPTH_TEST):it(n.DEPTH_TEST)},setMask:function(nt){tt!==nt&&!F&&(n.depthMask(nt),tt=nt)},setFunc:function(nt){if(ht&&(nt=Cf[nt]),lt!==nt){switch(nt){case Ca:n.depthFunc(n.NEVER);break;case Pa:n.depthFunc(n.ALWAYS);break;case Ia:n.depthFunc(n.LESS);break;case hr:n.depthFunc(n.LEQUAL);break;case La:n.depthFunc(n.EQUAL);break;case Da:n.depthFunc(n.GEQUAL);break;case Na:n.depthFunc(n.GREATER);break;case Ua:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}lt=nt}},setLocked:function(nt){F=nt},setClear:function(nt){mt!==nt&&(mt=nt,ht&&(nt=1-nt),n.clearDepth(nt))},reset:function(){F=!1,tt=null,lt=null,mt=null,ht=!1}}}function s(){let F=!1,ht=null,tt=null,lt=null,mt=null,nt=null,xt=null,wt=null,Nt=null;return{setTest:function(Kt){F||(Kt?K(n.STENCIL_TEST):it(n.STENCIL_TEST))},setMask:function(Kt){ht!==Kt&&!F&&(n.stencilMask(Kt),ht=Kt)},setFunc:function(Kt,Vn,Cn){(tt!==Kt||lt!==Vn||mt!==Cn)&&(n.stencilFunc(Kt,Vn,Cn),tt=Kt,lt=Vn,mt=Cn)},setOp:function(Kt,Vn,Cn){(nt!==Kt||xt!==Vn||wt!==Cn)&&(n.stencilOp(Kt,Vn,Cn),nt=Kt,xt=Vn,wt=Cn)},setLocked:function(Kt){F=Kt},setClear:function(Kt){Nt!==Kt&&(n.clearStencil(Kt),Nt=Kt)},reset:function(){F=!1,ht=null,tt=null,lt=null,mt=null,nt=null,xt=null,wt=null,Nt=null}}}let r=new e,o=new i,a=new s,l=new WeakMap,c=new WeakMap,h={},d={},u={},f=new WeakMap,p=[],x=null,g=!1,m=null,E=null,C=null,M=null,w=null,v=null,S=null,_=new ae(0,0,0),T=0,R=!1,P=null,D=null,k=null,L=null,z=null,W=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS),J=!1,et=0,O=n.getParameter(n.VERSION);O.indexOf("WebGL")!==-1?(et=parseFloat(/^WebGL (\d)/.exec(O)[1]),J=et>=1):O.indexOf("OpenGL ES")!==-1&&(et=parseFloat(/^OpenGL ES (\d)/.exec(O)[1]),J=et>=2);let q=null,j={},yt=n.getParameter(n.SCISSOR_BOX),Tt=n.getParameter(n.VIEWPORT),pe=new Ne().fromArray(yt),qt=new Ne().fromArray(Tt);function Et(F,ht,tt,lt){let mt=new Uint8Array(4),nt=n.createTexture();n.bindTexture(F,nt),n.texParameteri(F,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(F,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let xt=0;xt<tt;xt++)F===n.TEXTURE_3D||F===n.TEXTURE_2D_ARRAY?n.texImage3D(ht,0,n.RGBA,1,1,lt,0,n.RGBA,n.UNSIGNED_BYTE,mt):n.texImage2D(ht+xt,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,mt);return nt}let Y={};Y[n.TEXTURE_2D]=Et(n.TEXTURE_2D,n.TEXTURE_2D,1),Y[n.TEXTURE_CUBE_MAP]=Et(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),Y[n.TEXTURE_2D_ARRAY]=Et(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),Y[n.TEXTURE_3D]=Et(n.TEXTURE_3D,n.TEXTURE_3D,1,1),r.setClear(0,0,0,1),o.setClear(1),a.setClear(0),K(n.DEPTH_TEST),o.setFunc(hr),Dt(!1),te(gh),K(n.CULL_FACE),Wt(bi);function K(F){h[F]!==!0&&(n.enable(F),h[F]=!0)}function it(F){h[F]!==!1&&(n.disable(F),h[F]=!1)}function Ct(F,ht){return u[F]!==ht?(n.bindFramebuffer(F,ht),u[F]=ht,F===n.DRAW_FRAMEBUFFER&&(u[n.FRAMEBUFFER]=ht),F===n.FRAMEBUFFER&&(u[n.DRAW_FRAMEBUFFER]=ht),!0):!1}function ot(F,ht){let tt=p,lt=!1;if(F){tt=f.get(ht),tt===void 0&&(tt=[],f.set(ht,tt));let mt=F.textures;if(tt.length!==mt.length||tt[0]!==n.COLOR_ATTACHMENT0){for(let nt=0,xt=mt.length;nt<xt;nt++)tt[nt]=n.COLOR_ATTACHMENT0+nt;tt.length=mt.length,lt=!0}}else tt[0]!==n.BACK&&(tt[0]=n.BACK,lt=!0);lt&&n.drawBuffers(tt)}function ut(F){return x!==F?(n.useProgram(F),x=F,!0):!1}let Yt={[Is]:n.FUNC_ADD,[Jd]:n.FUNC_SUBTRACT,[$d]:n.FUNC_REVERSE_SUBTRACT};Yt[Kd]=n.MIN,Yt[jd]=n.MAX;let Bt={[Qd]:n.ZERO,[tf]:n.ONE,[ef]:n.SRC_COLOR,[vh]:n.SRC_ALPHA,[lf]:n.SRC_ALPHA_SATURATE,[of]:n.DST_COLOR,[sf]:n.DST_ALPHA,[nf]:n.ONE_MINUS_SRC_COLOR,[Mh]:n.ONE_MINUS_SRC_ALPHA,[af]:n.ONE_MINUS_DST_COLOR,[rf]:n.ONE_MINUS_DST_ALPHA,[cf]:n.CONSTANT_COLOR,[hf]:n.ONE_MINUS_CONSTANT_COLOR,[uf]:n.CONSTANT_ALPHA,[df]:n.ONE_MINUS_CONSTANT_ALPHA};function Wt(F,ht,tt,lt,mt,nt,xt,wt,Nt,Kt){if(F===bi){g===!0&&(it(n.BLEND),g=!1);return}if(g===!1&&(K(n.BLEND),g=!0),F!==Zd){if(F!==m||Kt!==R){if((E!==Is||w!==Is)&&(n.blendEquation(n.FUNC_ADD),E=Is,w=Is),Kt)switch(F){case Sr:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case _h:n.blendFunc(n.ONE,n.ONE);break;case xh:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case yh:n.blendFuncSeparate(n.DST_COLOR,n.ONE_MINUS_SRC_ALPHA,n.ZERO,n.ONE);break;default:Jt("WebGLState: Invalid blending: ",F);break}else switch(F){case Sr:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case _h:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE,n.ONE,n.ONE);break;case xh:Jt("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case yh:Jt("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:Jt("WebGLState: Invalid blending: ",F);break}C=null,M=null,v=null,S=null,_.set(0,0,0),T=0,m=F,R=Kt}return}mt=mt||ht,nt=nt||tt,xt=xt||lt,(ht!==E||mt!==w)&&(n.blendEquationSeparate(Yt[ht],Yt[mt]),E=ht,w=mt),(tt!==C||lt!==M||nt!==v||xt!==S)&&(n.blendFuncSeparate(Bt[tt],Bt[lt],Bt[nt],Bt[xt]),C=tt,M=lt,v=nt,S=xt),(wt.equals(_)===!1||Nt!==T)&&(n.blendColor(wt.r,wt.g,wt.b,Nt),_.copy(wt),T=Nt),m=F,R=!1}function kt(F,ht){F.side===Zn?it(n.CULL_FACE):K(n.CULL_FACE);let tt=F.side===xn;ht&&(tt=!tt),Dt(tt),F.blending===Sr&&F.transparent===!1?Wt(bi):Wt(F.blending,F.blendEquation,F.blendSrc,F.blendDst,F.blendEquationAlpha,F.blendSrcAlpha,F.blendDstAlpha,F.blendColor,F.blendAlpha,F.premultipliedAlpha),o.setFunc(F.depthFunc),o.setTest(F.depthTest),o.setMask(F.depthWrite),r.setMask(F.colorWrite);let lt=F.stencilWrite;a.setTest(lt),lt&&(a.setMask(F.stencilWriteMask),a.setFunc(F.stencilFunc,F.stencilRef,F.stencilFuncMask),a.setOp(F.stencilFail,F.stencilZFail,F.stencilZPass)),Se(F.polygonOffset,F.polygonOffsetFactor,F.polygonOffsetUnits),F.alphaToCoverage===!0?K(n.SAMPLE_ALPHA_TO_COVERAGE):it(n.SAMPLE_ALPHA_TO_COVERAGE)}function Dt(F){P!==F&&(F?n.frontFace(n.CW):n.frontFace(n.CCW),P=F)}function te(F){F!==Xd?(K(n.CULL_FACE),F!==D&&(F===gh?n.cullFace(n.BACK):F===qd?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):it(n.CULL_FACE),D=F}function ue(F){F!==k&&(J&&n.lineWidth(F),k=F)}function Se(F,ht,tt){F?(K(n.POLYGON_OFFSET_FILL),(L!==ht||z!==tt)&&(L=ht,z=tt,o.getReversed()&&(ht=-ht),n.polygonOffset(ht,tt))):it(n.POLYGON_OFFSET_FILL)}function jt(F){F?K(n.SCISSOR_TEST):it(n.SCISSOR_TEST)}function le(F){F===void 0&&(F=n.TEXTURE0+W-1),q!==F&&(n.activeTexture(F),q=F)}function I(F,ht,tt){tt===void 0&&(q===null?tt=n.TEXTURE0+W-1:tt=q);let lt=j[tt];lt===void 0&&(lt={type:void 0,texture:void 0},j[tt]=lt),(lt.type!==F||lt.texture!==ht)&&(q!==tt&&(n.activeTexture(tt),q=tt),n.bindTexture(F,ht||Y[F]),lt.type=F,lt.texture=ht)}function ne(){let F=j[q];F!==void 0&&F.type!==void 0&&(n.bindTexture(F.type,null),F.type=void 0,F.texture=void 0)}function Pt(){try{n.compressedTexImage2D(...arguments)}catch(F){Jt("WebGLState:",F)}}function A(){try{n.compressedTexImage3D(...arguments)}catch(F){Jt("WebGLState:",F)}}function y(){try{n.texSubImage2D(...arguments)}catch(F){Jt("WebGLState:",F)}}function B(){try{n.texSubImage3D(...arguments)}catch(F){Jt("WebGLState:",F)}}function V(){try{n.compressedTexSubImage2D(...arguments)}catch(F){Jt("WebGLState:",F)}}function Z(){try{n.compressedTexSubImage3D(...arguments)}catch(F){Jt("WebGLState:",F)}}function st(){try{n.texStorage2D(...arguments)}catch(F){Jt("WebGLState:",F)}}function rt(){try{n.texStorage3D(...arguments)}catch(F){Jt("WebGLState:",F)}}function $(){try{n.texImage2D(...arguments)}catch(F){Jt("WebGLState:",F)}}function Q(){try{n.texImage3D(...arguments)}catch(F){Jt("WebGLState:",F)}}function at(F){return d[F]!==void 0?d[F]:n.getParameter(F)}function Ut(F,ht){d[F]!==ht&&(n.pixelStorei(F,ht),d[F]=ht)}function dt(F){pe.equals(F)===!1&&(n.scissor(F.x,F.y,F.z,F.w),pe.copy(F))}function ct(F){qt.equals(F)===!1&&(n.viewport(F.x,F.y,F.z,F.w),qt.copy(F))}function It(F,ht){let tt=c.get(ht);tt===void 0&&(tt=new WeakMap,c.set(ht,tt));let lt=tt.get(F);lt===void 0&&(lt=n.getUniformBlockIndex(ht,F.name),tt.set(F,lt))}function Ht(F,ht){let lt=c.get(ht).get(F);l.get(ht)!==lt&&(n.uniformBlockBinding(ht,lt,F.__bindingPointIndex),l.set(ht,lt))}function zt(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),o.setReversed(!1),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),n.pixelStorei(n.PACK_ALIGNMENT,4),n.pixelStorei(n.UNPACK_ALIGNMENT,4),n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,!1),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,n.BROWSER_DEFAULT_WEBGL),n.pixelStorei(n.PACK_ROW_LENGTH,0),n.pixelStorei(n.PACK_SKIP_PIXELS,0),n.pixelStorei(n.PACK_SKIP_ROWS,0),n.pixelStorei(n.UNPACK_ROW_LENGTH,0),n.pixelStorei(n.UNPACK_IMAGE_HEIGHT,0),n.pixelStorei(n.UNPACK_SKIP_PIXELS,0),n.pixelStorei(n.UNPACK_SKIP_ROWS,0),n.pixelStorei(n.UNPACK_SKIP_IMAGES,0),h={},d={},q=null,j={},u={},f=new WeakMap,p=[],x=null,g=!1,m=null,E=null,C=null,M=null,w=null,v=null,S=null,_=new ae(0,0,0),T=0,R=!1,P=null,D=null,k=null,L=null,z=null,pe.set(0,0,n.canvas.width,n.canvas.height),qt.set(0,0,n.canvas.width,n.canvas.height),r.reset(),o.reset(),a.reset()}return{buffers:{color:r,depth:o,stencil:a},enable:K,disable:it,bindFramebuffer:Ct,drawBuffers:ot,useProgram:ut,setBlending:Wt,setMaterial:kt,setFlipSided:Dt,setCullFace:te,setLineWidth:ue,setPolygonOffset:Se,setScissorTest:jt,activeTexture:le,bindTexture:I,unbindTexture:ne,compressedTexImage2D:Pt,compressedTexImage3D:A,texImage2D:$,texImage3D:Q,pixelStorei:Ut,getParameter:at,updateUBOMapping:It,uniformBlockBinding:Ht,texStorage2D:st,texStorage3D:rt,texSubImage2D:y,texSubImage3D:B,compressedTexSubImage2D:V,compressedTexSubImage3D:Z,scissor:dt,viewport:ct,reset:zt}}function Dy(n,t,e,i,s,r,o){let a=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new Zt,h=new WeakMap,d=new Set,u,f=new WeakMap,p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function x(A,y){return p?new OffscreenCanvas(A,y):no("canvas")}function g(A,y,B){let V=1,Z=Pt(A);if((Z.width>B||Z.height>B)&&(V=B/Math.max(Z.width,Z.height)),V<1)if(typeof HTMLImageElement<"u"&&A instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&A instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&A instanceof ImageBitmap||typeof VideoFrame<"u"&&A instanceof VideoFrame){let st=Math.floor(V*Z.width),rt=Math.floor(V*Z.height);u===void 0&&(u=x(st,rt));let $=y?x(st,rt):u;return $.width=st,$.height=rt,$.getContext("2d").drawImage(A,0,0,st,rt),Gt("WebGLRenderer: Texture has been resized from ("+Z.width+"x"+Z.height+") to ("+st+"x"+rt+")."),$}else return"data"in A&&Gt("WebGLRenderer: Image in DataTexture is too big ("+Z.width+"x"+Z.height+")."),A;return A}function m(A){return A.generateMipmaps}function E(A){n.generateMipmap(A)}function C(A){return A.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:A.isWebGL3DRenderTarget?n.TEXTURE_3D:A.isWebGLArrayRenderTarget||A.isCompressedArrayTexture?n.TEXTURE_2D_ARRAY:n.TEXTURE_2D}function M(A,y,B,V,Z,st=!1){if(A!==null){if(n[A]!==void 0)return n[A];Gt("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+A+"'")}let rt;V&&(rt=t.get("EXT_texture_norm16"),rt||Gt("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let $=y;if(y===n.RED&&(B===n.FLOAT&&($=n.R32F),B===n.HALF_FLOAT&&($=n.R16F),B===n.UNSIGNED_BYTE&&($=n.R8),B===n.UNSIGNED_SHORT&&rt&&($=rt.R16_EXT),B===n.SHORT&&rt&&($=rt.R16_SNORM_EXT)),y===n.RED_INTEGER&&(B===n.UNSIGNED_BYTE&&($=n.R8UI),B===n.UNSIGNED_SHORT&&($=n.R16UI),B===n.UNSIGNED_INT&&($=n.R32UI),B===n.BYTE&&($=n.R8I),B===n.SHORT&&($=n.R16I),B===n.INT&&($=n.R32I)),y===n.RG&&(B===n.FLOAT&&($=n.RG32F),B===n.HALF_FLOAT&&($=n.RG16F),B===n.UNSIGNED_BYTE&&($=n.RG8),B===n.UNSIGNED_SHORT&&rt&&($=rt.RG16_EXT),B===n.SHORT&&rt&&($=rt.RG16_SNORM_EXT)),y===n.RG_INTEGER&&(B===n.UNSIGNED_BYTE&&($=n.RG8UI),B===n.UNSIGNED_SHORT&&($=n.RG16UI),B===n.UNSIGNED_INT&&($=n.RG32UI),B===n.BYTE&&($=n.RG8I),B===n.SHORT&&($=n.RG16I),B===n.INT&&($=n.RG32I)),y===n.RGB_INTEGER&&(B===n.UNSIGNED_BYTE&&($=n.RGB8UI),B===n.UNSIGNED_SHORT&&($=n.RGB16UI),B===n.UNSIGNED_INT&&($=n.RGB32UI),B===n.BYTE&&($=n.RGB8I),B===n.SHORT&&($=n.RGB16I),B===n.INT&&($=n.RGB32I)),y===n.RGBA_INTEGER&&(B===n.UNSIGNED_BYTE&&($=n.RGBA8UI),B===n.UNSIGNED_SHORT&&($=n.RGBA16UI),B===n.UNSIGNED_INT&&($=n.RGBA32UI),B===n.BYTE&&($=n.RGBA8I),B===n.SHORT&&($=n.RGBA16I),B===n.INT&&($=n.RGBA32I)),y===n.RGB&&(B===n.UNSIGNED_SHORT&&rt&&($=rt.RGB16_EXT),B===n.SHORT&&rt&&($=rt.RGB16_SNORM_EXT),B===n.UNSIGNED_INT_5_9_9_9_REV&&($=n.RGB9_E5),B===n.UNSIGNED_INT_10F_11F_11F_REV&&($=n.R11F_G11F_B10F)),y===n.RGBA){let Q=st?eo:ge.getTransfer(Z);B===n.FLOAT&&($=n.RGBA32F),B===n.HALF_FLOAT&&($=n.RGBA16F),B===n.UNSIGNED_BYTE&&($=Q===be?n.SRGB8_ALPHA8:n.RGBA8),B===n.UNSIGNED_SHORT&&rt&&($=rt.RGBA16_EXT),B===n.SHORT&&rt&&($=rt.RGBA16_SNORM_EXT),B===n.UNSIGNED_SHORT_4_4_4_4&&($=n.RGBA4),B===n.UNSIGNED_SHORT_5_5_5_1&&($=n.RGB5_A1)}return($===n.R16F||$===n.R32F||$===n.RG16F||$===n.RG32F||$===n.RGBA16F||$===n.RGBA32F)&&t.get("EXT_color_buffer_float"),$}function w(A,y){let B;return A?y===null||y===oi||y===Er?B=n.DEPTH24_STENCIL8:y===ai?B=n.DEPTH32F_STENCIL8:y===Tr&&(B=n.DEPTH24_STENCIL8,Gt("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):y===null||y===oi||y===Er?B=n.DEPTH_COMPONENT24:y===ai?B=n.DEPTH_COMPONENT32F:y===Tr&&(B=n.DEPTH_COMPONENT16),B}function v(A,y){return m(A)===!0||A.isFramebufferTexture&&A.minFilter!==Qe&&A.minFilter!==sn?Math.log2(Math.max(y.width,y.height))+1:A.mipmaps!==void 0&&A.mipmaps.length>0?A.mipmaps.length:A.isCompressedTexture&&Array.isArray(A.image)?y.mipmaps.length:1}function S(A){let y=A.target;y.removeEventListener("dispose",S),T(y),y.isVideoTexture&&h.delete(y),y.isHTMLTexture&&d.delete(y)}function _(A){let y=A.target;y.removeEventListener("dispose",_),P(y)}function T(A){let y=i.get(A);if(y.__webglInit===void 0)return;let B=A.source,V=f.get(B);if(V){let Z=V[y.__cacheKey];Z.usedTimes--,Z.usedTimes===0&&R(A),Object.keys(V).length===0&&f.delete(B)}i.remove(A)}function R(A){let y=i.get(A);n.deleteTexture(y.__webglTexture);let B=A.source,V=f.get(B);delete V[y.__cacheKey],o.memory.textures--}function P(A){let y=i.get(A);if(A.depthTexture&&(A.depthTexture.dispose(),i.remove(A.depthTexture)),A.isWebGLCubeRenderTarget)for(let V=0;V<6;V++){if(Array.isArray(y.__webglFramebuffer[V]))for(let Z=0;Z<y.__webglFramebuffer[V].length;Z++)n.deleteFramebuffer(y.__webglFramebuffer[V][Z]);else n.deleteFramebuffer(y.__webglFramebuffer[V]);y.__webglDepthbuffer&&n.deleteRenderbuffer(y.__webglDepthbuffer[V])}else{if(Array.isArray(y.__webglFramebuffer))for(let V=0;V<y.__webglFramebuffer.length;V++)n.deleteFramebuffer(y.__webglFramebuffer[V]);else n.deleteFramebuffer(y.__webglFramebuffer);if(y.__webglDepthbuffer&&n.deleteRenderbuffer(y.__webglDepthbuffer),y.__webglMultisampledFramebuffer&&n.deleteFramebuffer(y.__webglMultisampledFramebuffer),y.__webglColorRenderbuffer)for(let V=0;V<y.__webglColorRenderbuffer.length;V++)y.__webglColorRenderbuffer[V]&&n.deleteRenderbuffer(y.__webglColorRenderbuffer[V]);y.__webglDepthRenderbuffer&&n.deleteRenderbuffer(y.__webglDepthRenderbuffer)}let B=A.textures;for(let V=0,Z=B.length;V<Z;V++){let st=i.get(B[V]);st.__webglTexture&&(n.deleteTexture(st.__webglTexture),o.memory.textures--),i.remove(B[V])}i.remove(A)}let D=0;function k(){D=0}function L(){return D}function z(A){D=A}function W(){let A=D;return A>=s.maxTextures&&Gt("WebGLTextures: Trying to use "+(A+1)+" texture units while this GPU supports only "+s.maxTextures),D+=1,A}function J(A){let y=[];return y.push(A.wrapS),y.push(A.wrapT),y.push(A.wrapR||0),y.push(A.magFilter),y.push(A.minFilter),y.push(A.anisotropy),y.push(A.internalFormat),y.push(A.format),y.push(A.type),y.push(A.generateMipmaps),y.push(A.premultiplyAlpha),y.push(A.flipY),y.push(A.unpackAlignment),y.push(A.colorSpace),y.join()}function et(A,y){let B=i.get(A);if(A.isVideoTexture&&I(A),A.isRenderTargetTexture===!1&&A.isExternalTexture!==!0&&A.version>0&&B.__version!==A.version){let V=A.image;if(V===null)Gt("WebGLRenderer: Texture marked for update but no image data found.");else if(V.complete===!1)Gt("WebGLRenderer: Texture marked for update but image is incomplete");else{it(B,A,y);return}}else A.isExternalTexture&&(B.__webglTexture=A.sourceTexture?A.sourceTexture:null);e.bindTexture(n.TEXTURE_2D,B.__webglTexture,n.TEXTURE0+y)}function O(A,y){let B=i.get(A);if(A.isRenderTargetTexture===!1&&A.version>0&&B.__version!==A.version){it(B,A,y);return}else A.isExternalTexture&&(B.__webglTexture=A.sourceTexture?A.sourceTexture:null);e.bindTexture(n.TEXTURE_2D_ARRAY,B.__webglTexture,n.TEXTURE0+y)}function q(A,y){let B=i.get(A);if(A.isRenderTargetTexture===!1&&A.version>0&&B.__version!==A.version){it(B,A,y);return}e.bindTexture(n.TEXTURE_3D,B.__webglTexture,n.TEXTURE0+y)}function j(A,y){let B=i.get(A);if(A.isCubeDepthTexture!==!0&&A.version>0&&B.__version!==A.version){Ct(B,A,y);return}e.bindTexture(n.TEXTURE_CUBE_MAP,B.__webglTexture,n.TEXTURE0+y)}let yt={[Fa]:n.REPEAT,[vi]:n.CLAMP_TO_EDGE,[Oa]:n.MIRRORED_REPEAT},Tt={[Qe]:n.NEAREST,[mf]:n.NEAREST_MIPMAP_NEAREST,[Mo]:n.NEAREST_MIPMAP_LINEAR,[sn]:n.LINEAR,[dl]:n.LINEAR_MIPMAP_NEAREST,[us]:n.LINEAR_MIPMAP_LINEAR},pe={[yf]:n.NEVER,[Tf]:n.ALWAYS,[vf]:n.LESS,[$l]:n.LEQUAL,[Mf]:n.EQUAL,[Kl]:n.GEQUAL,[bf]:n.GREATER,[Sf]:n.NOTEQUAL};function qt(A,y){if(y.type===ai&&t.has("OES_texture_float_linear")===!1&&(y.magFilter===sn||y.magFilter===dl||y.magFilter===Mo||y.magFilter===us||y.minFilter===sn||y.minFilter===dl||y.minFilter===Mo||y.minFilter===us)&&Gt("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(A,n.TEXTURE_WRAP_S,yt[y.wrapS]),n.texParameteri(A,n.TEXTURE_WRAP_T,yt[y.wrapT]),(A===n.TEXTURE_3D||A===n.TEXTURE_2D_ARRAY)&&n.texParameteri(A,n.TEXTURE_WRAP_R,yt[y.wrapR]),n.texParameteri(A,n.TEXTURE_MAG_FILTER,Tt[y.magFilter]),n.texParameteri(A,n.TEXTURE_MIN_FILTER,Tt[y.minFilter]),y.compareFunction&&(n.texParameteri(A,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(A,n.TEXTURE_COMPARE_FUNC,pe[y.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(y.magFilter===Qe||y.minFilter!==Mo&&y.minFilter!==us||y.type===ai&&t.has("OES_texture_float_linear")===!1)return;if(y.anisotropy>1||i.get(y).__currentAnisotropy){let B=t.get("EXT_texture_filter_anisotropic");n.texParameterf(A,B.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(y.anisotropy,s.getMaxAnisotropy())),i.get(y).__currentAnisotropy=y.anisotropy}}}function Et(A,y){let B=!1;A.__webglInit===void 0&&(A.__webglInit=!0,y.addEventListener("dispose",S));let V=y.source,Z=f.get(V);Z===void 0&&(Z={},f.set(V,Z));let st=J(y);if(st!==A.__cacheKey){Z[st]===void 0&&(Z[st]={texture:n.createTexture(),usedTimes:0},o.memory.textures++,B=!0),Z[st].usedTimes++;let rt=Z[A.__cacheKey];rt!==void 0&&(Z[A.__cacheKey].usedTimes--,rt.usedTimes===0&&R(y)),A.__cacheKey=st,A.__webglTexture=Z[st].texture}return B}function Y(A,y,B){return Math.floor(Math.floor(A/B)/y)}function K(A,y,B,V){let st=A.updateRanges;if(st.length===0)e.texSubImage2D(n.TEXTURE_2D,0,0,0,y.width,y.height,B,V,y.data);else{st.sort((Ut,dt)=>Ut.start-dt.start);let rt=0;for(let Ut=1;Ut<st.length;Ut++){let dt=st[rt],ct=st[Ut],It=dt.start+dt.count,Ht=Y(ct.start,y.width,4),zt=Y(dt.start,y.width,4);ct.start<=It+1&&Ht===zt&&Y(ct.start+ct.count-1,y.width,4)===Ht?dt.count=Math.max(dt.count,ct.start+ct.count-dt.start):(++rt,st[rt]=ct)}st.length=rt+1;let $=e.getParameter(n.UNPACK_ROW_LENGTH),Q=e.getParameter(n.UNPACK_SKIP_PIXELS),at=e.getParameter(n.UNPACK_SKIP_ROWS);e.pixelStorei(n.UNPACK_ROW_LENGTH,y.width);for(let Ut=0,dt=st.length;Ut<dt;Ut++){let ct=st[Ut],It=Math.floor(ct.start/4),Ht=Math.ceil(ct.count/4),zt=It%y.width,F=Math.floor(It/y.width),ht=Ht,tt=1;e.pixelStorei(n.UNPACK_SKIP_PIXELS,zt),e.pixelStorei(n.UNPACK_SKIP_ROWS,F),e.texSubImage2D(n.TEXTURE_2D,0,zt,F,ht,tt,B,V,y.data)}A.clearUpdateRanges(),e.pixelStorei(n.UNPACK_ROW_LENGTH,$),e.pixelStorei(n.UNPACK_SKIP_PIXELS,Q),e.pixelStorei(n.UNPACK_SKIP_ROWS,at)}}function it(A,y,B){let V=n.TEXTURE_2D;(y.isDataArrayTexture||y.isCompressedArrayTexture)&&(V=n.TEXTURE_2D_ARRAY),y.isData3DTexture&&(V=n.TEXTURE_3D);let Z=Et(A,y),st=y.source;e.bindTexture(V,A.__webglTexture,n.TEXTURE0+B);let rt=i.get(st);if(st.version!==rt.__version||Z===!0){if(e.activeTexture(n.TEXTURE0+B),(typeof ImageBitmap<"u"&&y.image instanceof ImageBitmap)===!1){let tt=ge.getPrimaries(ge.workingColorSpace),lt=y.colorSpace===zi?null:ge.getPrimaries(y.colorSpace),mt=y.colorSpace===zi||tt===lt?n.NONE:n.BROWSER_DEFAULT_WEBGL;e.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,y.flipY),e.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,y.premultiplyAlpha),e.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,mt)}e.pixelStorei(n.UNPACK_ALIGNMENT,y.unpackAlignment);let Q=g(y.image,!1,s.maxTextureSize);Q=ne(y,Q);let at=r.convert(y.format,y.colorSpace),Ut=r.convert(y.type),dt=M(y.internalFormat,at,Ut,y.normalized,y.colorSpace,y.isVideoTexture);qt(V,y);let ct,It=y.mipmaps,Ht=y.isVideoTexture!==!0,zt=rt.__version===void 0||Z===!0,F=st.dataReady,ht=v(y,Q);if(y.isDepthTexture)dt=w(y.format===ds,y.type),zt&&(Ht?e.texStorage2D(n.TEXTURE_2D,1,dt,Q.width,Q.height):e.texImage2D(n.TEXTURE_2D,0,dt,Q.width,Q.height,0,at,Ut,null));else if(y.isDataTexture)if(It.length>0){Ht&&zt&&e.texStorage2D(n.TEXTURE_2D,ht,dt,It[0].width,It[0].height);for(let tt=0,lt=It.length;tt<lt;tt++)ct=It[tt],Ht?F&&e.texSubImage2D(n.TEXTURE_2D,tt,0,0,ct.width,ct.height,at,Ut,ct.data):e.texImage2D(n.TEXTURE_2D,tt,dt,ct.width,ct.height,0,at,Ut,ct.data);y.generateMipmaps=!1}else Ht?(zt&&e.texStorage2D(n.TEXTURE_2D,ht,dt,Q.width,Q.height),F&&K(y,Q,at,Ut)):e.texImage2D(n.TEXTURE_2D,0,dt,Q.width,Q.height,0,at,Ut,Q.data);else if(y.isCompressedTexture)if(y.isCompressedArrayTexture){Ht&&zt&&e.texStorage3D(n.TEXTURE_2D_ARRAY,ht,dt,It[0].width,It[0].height,Q.depth);for(let tt=0,lt=It.length;tt<lt;tt++)if(ct=It[tt],y.format!==Jn)if(at!==null)if(Ht){if(F)if(y.layerUpdates.size>0){let mt=Wh(ct.width,ct.height,y.format,y.type);for(let nt of y.layerUpdates){let xt=ct.data.subarray(nt*mt/ct.data.BYTES_PER_ELEMENT,(nt+1)*mt/ct.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,tt,0,0,nt,ct.width,ct.height,1,at,xt)}}else e.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,tt,0,0,0,ct.width,ct.height,Q.depth,at,ct.data)}else e.compressedTexImage3D(n.TEXTURE_2D_ARRAY,tt,dt,ct.width,ct.height,Q.depth,0,ct.data,0,0);else Gt("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Ht?F&&e.texSubImage3D(n.TEXTURE_2D_ARRAY,tt,0,0,0,ct.width,ct.height,Q.depth,at,Ut,ct.data):e.texImage3D(n.TEXTURE_2D_ARRAY,tt,dt,ct.width,ct.height,Q.depth,0,at,Ut,ct.data);y.layerUpdates.size>0&&y.clearLayerUpdates()}else{Ht&&zt&&e.texStorage2D(n.TEXTURE_2D,ht,dt,It[0].width,It[0].height);for(let tt=0,lt=It.length;tt<lt;tt++)ct=It[tt],y.format!==Jn?at!==null?Ht?F&&e.compressedTexSubImage2D(n.TEXTURE_2D,tt,0,0,ct.width,ct.height,at,ct.data):e.compressedTexImage2D(n.TEXTURE_2D,tt,dt,ct.width,ct.height,0,ct.data):Gt("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Ht?F&&e.texSubImage2D(n.TEXTURE_2D,tt,0,0,ct.width,ct.height,at,Ut,ct.data):e.texImage2D(n.TEXTURE_2D,tt,dt,ct.width,ct.height,0,at,Ut,ct.data)}else if(y.isDataArrayTexture)if(Ht){if(zt&&e.texStorage3D(n.TEXTURE_2D_ARRAY,ht,dt,Q.width,Q.height,Q.depth),F)if(y.layerUpdates.size>0){let tt=Wh(Q.width,Q.height,y.format,y.type);for(let lt of y.layerUpdates){let mt=Q.data.subarray(lt*tt/Q.data.BYTES_PER_ELEMENT,(lt+1)*tt/Q.data.BYTES_PER_ELEMENT);e.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,lt,Q.width,Q.height,1,at,Ut,mt)}y.clearLayerUpdates()}else e.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,Q.width,Q.height,Q.depth,at,Ut,Q.data)}else e.texImage3D(n.TEXTURE_2D_ARRAY,0,dt,Q.width,Q.height,Q.depth,0,at,Ut,Q.data);else if(y.isData3DTexture)Ht?(zt&&e.texStorage3D(n.TEXTURE_3D,ht,dt,Q.width,Q.height,Q.depth),F&&e.texSubImage3D(n.TEXTURE_3D,0,0,0,0,Q.width,Q.height,Q.depth,at,Ut,Q.data)):e.texImage3D(n.TEXTURE_3D,0,dt,Q.width,Q.height,Q.depth,0,at,Ut,Q.data);else if(y.isFramebufferTexture){if(zt)if(Ht)e.texStorage2D(n.TEXTURE_2D,ht,dt,Q.width,Q.height);else{let tt=Q.width,lt=Q.height;for(let mt=0;mt<ht;mt++)e.texImage2D(n.TEXTURE_2D,mt,dt,tt,lt,0,at,Ut,null),tt>>=1,lt>>=1}}else if(y.isHTMLTexture){if("texElementImage2D"in n){let tt=n.canvas;if(tt.hasAttribute("layoutsubtree")||tt.setAttribute("layoutsubtree","true"),Q.parentNode!==tt){tt.appendChild(Q),d.add(y),tt.onpaint=lt=>{let mt=lt.changedElements;for(let nt of d)mt.includes(nt.image)&&(nt.needsUpdate=!0)},tt.requestPaint();return}if(n.texElementImage2D.length===3)n.texElementImage2D(n.TEXTURE_2D,n.RGBA8,Q);else{let mt=n.RGBA,nt=n.RGBA,xt=n.UNSIGNED_BYTE;n.texElementImage2D(n.TEXTURE_2D,0,mt,nt,xt,Q)}n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MIN_FILTER,n.LINEAR),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_S,n.CLAMP_TO_EDGE),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_T,n.CLAMP_TO_EDGE)}}else if(It.length>0){if(Ht&&zt){let tt=Pt(It[0]);e.texStorage2D(n.TEXTURE_2D,ht,dt,tt.width,tt.height)}for(let tt=0,lt=It.length;tt<lt;tt++)ct=It[tt],Ht?F&&e.texSubImage2D(n.TEXTURE_2D,tt,0,0,at,Ut,ct):e.texImage2D(n.TEXTURE_2D,tt,dt,at,Ut,ct);y.generateMipmaps=!1}else if(Ht){if(zt){let tt=Pt(Q);e.texStorage2D(n.TEXTURE_2D,ht,dt,tt.width,tt.height)}F&&e.texSubImage2D(n.TEXTURE_2D,0,0,0,at,Ut,Q)}else e.texImage2D(n.TEXTURE_2D,0,dt,at,Ut,Q);m(y)&&E(V),rt.__version=st.version,y.onUpdate&&y.onUpdate(y)}A.__version=y.version}function Ct(A,y,B){if(y.image.length!==6)return;let V=Et(A,y),Z=y.source;e.bindTexture(n.TEXTURE_CUBE_MAP,A.__webglTexture,n.TEXTURE0+B);let st=i.get(Z);if(Z.version!==st.__version||V===!0){e.activeTexture(n.TEXTURE0+B);let rt=ge.getPrimaries(ge.workingColorSpace),$=y.colorSpace===zi?null:ge.getPrimaries(y.colorSpace),Q=y.colorSpace===zi||rt===$?n.NONE:n.BROWSER_DEFAULT_WEBGL;e.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,y.flipY),e.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,y.premultiplyAlpha),e.pixelStorei(n.UNPACK_ALIGNMENT,y.unpackAlignment),e.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,Q);let at=y.isCompressedTexture||y.image[0].isCompressedTexture,Ut=y.image[0]&&y.image[0].isDataTexture,dt=[];for(let nt=0;nt<6;nt++)!at&&!Ut?dt[nt]=g(y.image[nt],!0,s.maxCubemapSize):dt[nt]=Ut?y.image[nt].image:y.image[nt],dt[nt]=ne(y,dt[nt]);let ct=dt[0],It=r.convert(y.format,y.colorSpace),Ht=r.convert(y.type),zt=M(y.internalFormat,It,Ht,y.normalized,y.colorSpace),F=y.isVideoTexture!==!0,ht=st.__version===void 0||V===!0,tt=Z.dataReady,lt=v(y,ct);qt(n.TEXTURE_CUBE_MAP,y);let mt;if(at){F&&ht&&e.texStorage2D(n.TEXTURE_CUBE_MAP,lt,zt,ct.width,ct.height);for(let nt=0;nt<6;nt++){mt=dt[nt].mipmaps;for(let xt=0;xt<mt.length;xt++){let wt=mt[xt];y.format!==Jn?It!==null?F?tt&&e.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+nt,xt,0,0,wt.width,wt.height,It,wt.data):e.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+nt,xt,zt,wt.width,wt.height,0,wt.data):Gt("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):F?tt&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+nt,xt,0,0,wt.width,wt.height,It,Ht,wt.data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+nt,xt,zt,wt.width,wt.height,0,It,Ht,wt.data)}}}else{if(mt=y.mipmaps,F&&ht){mt.length>0&&lt++;let nt=Pt(dt[0]);e.texStorage2D(n.TEXTURE_CUBE_MAP,lt,zt,nt.width,nt.height)}for(let nt=0;nt<6;nt++)if(Ut){F?tt&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+nt,0,0,0,dt[nt].width,dt[nt].height,It,Ht,dt[nt].data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+nt,0,zt,dt[nt].width,dt[nt].height,0,It,Ht,dt[nt].data);for(let xt=0;xt<mt.length;xt++){let Nt=mt[xt].image[nt].image;F?tt&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+nt,xt+1,0,0,Nt.width,Nt.height,It,Ht,Nt.data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+nt,xt+1,zt,Nt.width,Nt.height,0,It,Ht,Nt.data)}}else{F?tt&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+nt,0,0,0,It,Ht,dt[nt]):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+nt,0,zt,It,Ht,dt[nt]);for(let xt=0;xt<mt.length;xt++){let wt=mt[xt];F?tt&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+nt,xt+1,0,0,It,Ht,wt.image[nt]):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+nt,xt+1,zt,It,Ht,wt.image[nt])}}}m(y)&&E(n.TEXTURE_CUBE_MAP),st.__version=Z.version,y.onUpdate&&y.onUpdate(y)}A.__version=y.version}function ot(A,y,B,V,Z,st){let rt=r.convert(B.format,B.colorSpace),$=r.convert(B.type),Q=M(B.internalFormat,rt,$,B.normalized,B.colorSpace),at=i.get(y),Ut=i.get(B);if(Ut.__renderTarget=y,!at.__hasExternalTextures){let dt=Math.max(1,y.width>>st),ct=Math.max(1,y.height>>st);Z===n.TEXTURE_3D||Z===n.TEXTURE_2D_ARRAY?e.texImage3D(Z,st,Q,dt,ct,y.depth,0,rt,$,null):e.texImage2D(Z,st,Q,dt,ct,0,rt,$,null)}e.bindFramebuffer(n.FRAMEBUFFER,A),le(y)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,V,Z,Ut.__webglTexture,0,jt(y)):(Z===n.TEXTURE_2D||Z>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&Z<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,V,Z,Ut.__webglTexture,st),e.bindFramebuffer(n.FRAMEBUFFER,null)}function ut(A,y,B){if(n.bindRenderbuffer(n.RENDERBUFFER,A),y.depthBuffer){let V=y.depthTexture,Z=V&&V.isDepthTexture?V.type:null,st=w(y.stencilBuffer,Z),rt=y.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;le(y)?a.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,jt(y),st,y.width,y.height):B?n.renderbufferStorageMultisample(n.RENDERBUFFER,jt(y),st,y.width,y.height):n.renderbufferStorage(n.RENDERBUFFER,st,y.width,y.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,rt,n.RENDERBUFFER,A)}else{let V=y.textures;for(let Z=0;Z<V.length;Z++){let st=V[Z],rt=r.convert(st.format,st.colorSpace),$=r.convert(st.type),Q=M(st.internalFormat,rt,$,st.normalized,st.colorSpace);le(y)?a.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,jt(y),Q,y.width,y.height):B?n.renderbufferStorageMultisample(n.RENDERBUFFER,jt(y),Q,y.width,y.height):n.renderbufferStorage(n.RENDERBUFFER,Q,y.width,y.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function Yt(A,y,B){let V=y.isWebGLCubeRenderTarget===!0;if(e.bindFramebuffer(n.FRAMEBUFFER,A),!(y.depthTexture&&y.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");let Z=i.get(y.depthTexture);if(Z.__renderTarget=y,(!Z.__webglTexture||y.depthTexture.image.width!==y.width||y.depthTexture.image.height!==y.height)&&(y.depthTexture.image.width=y.width,y.depthTexture.image.height=y.height,y.depthTexture.needsUpdate=!0),V){if(Z.__webglInit===void 0&&(Z.__webglInit=!0,y.depthTexture.addEventListener("dispose",S)),Z.__webglTexture===void 0){Z.__webglTexture=n.createTexture(),e.bindTexture(n.TEXTURE_CUBE_MAP,Z.__webglTexture),qt(n.TEXTURE_CUBE_MAP,y.depthTexture);let at=r.convert(y.depthTexture.format),Ut=r.convert(y.depthTexture.type),dt;y.depthTexture.format===Mi?dt=n.DEPTH_COMPONENT24:y.depthTexture.format===ds&&(dt=n.DEPTH24_STENCIL8);for(let ct=0;ct<6;ct++)n.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ct,0,dt,y.width,y.height,0,at,Ut,null)}}else et(y.depthTexture,0);let st=Z.__webglTexture,rt=jt(y),$=V?n.TEXTURE_CUBE_MAP_POSITIVE_X+B:n.TEXTURE_2D,Q=y.depthTexture.format===ds?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;if(y.depthTexture.format===Mi)le(y)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,Q,$,st,0,rt):n.framebufferTexture2D(n.FRAMEBUFFER,Q,$,st,0);else if(y.depthTexture.format===ds)le(y)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,Q,$,st,0,rt):n.framebufferTexture2D(n.FRAMEBUFFER,Q,$,st,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function Bt(A){let y=i.get(A),B=A.isWebGLCubeRenderTarget===!0;if(y.__boundDepthTexture!==A.depthTexture){let V=A.depthTexture;if(y.__depthDisposeCallback&&y.__depthDisposeCallback(),V){let Z=()=>{delete y.__boundDepthTexture,delete y.__depthDisposeCallback,V.removeEventListener("dispose",Z)};V.addEventListener("dispose",Z),y.__depthDisposeCallback=Z}y.__boundDepthTexture=V}if(A.depthTexture&&!y.__autoAllocateDepthBuffer)if(B)for(let V=0;V<6;V++)Yt(y.__webglFramebuffer[V],A,V);else{let V=A.texture.mipmaps;V&&V.length>0?Yt(y.__webglFramebuffer[0],A,0):Yt(y.__webglFramebuffer,A,0)}else if(B){y.__webglDepthbuffer=[];for(let V=0;V<6;V++)if(e.bindFramebuffer(n.FRAMEBUFFER,y.__webglFramebuffer[V]),y.__webglDepthbuffer[V]===void 0)y.__webglDepthbuffer[V]=n.createRenderbuffer(),ut(y.__webglDepthbuffer[V],A,!1);else{let Z=A.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,st=y.__webglDepthbuffer[V];n.bindRenderbuffer(n.RENDERBUFFER,st),n.framebufferRenderbuffer(n.FRAMEBUFFER,Z,n.RENDERBUFFER,st)}}else{let V=A.texture.mipmaps;if(V&&V.length>0?e.bindFramebuffer(n.FRAMEBUFFER,y.__webglFramebuffer[0]):e.bindFramebuffer(n.FRAMEBUFFER,y.__webglFramebuffer),y.__webglDepthbuffer===void 0)y.__webglDepthbuffer=n.createRenderbuffer(),ut(y.__webglDepthbuffer,A,!1);else{let Z=A.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,st=y.__webglDepthbuffer;n.bindRenderbuffer(n.RENDERBUFFER,st),n.framebufferRenderbuffer(n.FRAMEBUFFER,Z,n.RENDERBUFFER,st)}}e.bindFramebuffer(n.FRAMEBUFFER,null)}function Wt(A,y,B){let V=i.get(A);y!==void 0&&ot(V.__webglFramebuffer,A,A.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),B!==void 0&&Bt(A)}function kt(A){let y=A.texture,B=i.get(A),V=i.get(y);A.addEventListener("dispose",_);let Z=A.textures,st=A.isWebGLCubeRenderTarget===!0,rt=Z.length>1;if(rt||(V.__webglTexture===void 0&&(V.__webglTexture=n.createTexture()),V.__version=y.version,o.memory.textures++),st){B.__webglFramebuffer=[];for(let $=0;$<6;$++)if(y.mipmaps&&y.mipmaps.length>0){B.__webglFramebuffer[$]=[];for(let Q=0;Q<y.mipmaps.length;Q++)B.__webglFramebuffer[$][Q]=n.createFramebuffer()}else B.__webglFramebuffer[$]=n.createFramebuffer()}else{if(y.mipmaps&&y.mipmaps.length>0){B.__webglFramebuffer=[];for(let $=0;$<y.mipmaps.length;$++)B.__webglFramebuffer[$]=n.createFramebuffer()}else B.__webglFramebuffer=n.createFramebuffer();if(rt)for(let $=0,Q=Z.length;$<Q;$++){let at=i.get(Z[$]);at.__webglTexture===void 0&&(at.__webglTexture=n.createTexture(),o.memory.textures++)}if(A.samples>0&&le(A)===!1){B.__webglMultisampledFramebuffer=n.createFramebuffer(),B.__webglColorRenderbuffer=[],e.bindFramebuffer(n.FRAMEBUFFER,B.__webglMultisampledFramebuffer);for(let $=0;$<Z.length;$++){let Q=Z[$];B.__webglColorRenderbuffer[$]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,B.__webglColorRenderbuffer[$]);let at=r.convert(Q.format,Q.colorSpace),Ut=r.convert(Q.type),dt=M(Q.internalFormat,at,Ut,Q.normalized,Q.colorSpace,A.isXRRenderTarget===!0),ct=jt(A);n.renderbufferStorageMultisample(n.RENDERBUFFER,ct,dt,A.width,A.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+$,n.RENDERBUFFER,B.__webglColorRenderbuffer[$])}n.bindRenderbuffer(n.RENDERBUFFER,null),A.depthBuffer&&(B.__webglDepthRenderbuffer=n.createRenderbuffer(),ut(B.__webglDepthRenderbuffer,A,!0)),e.bindFramebuffer(n.FRAMEBUFFER,null)}}if(st){e.bindTexture(n.TEXTURE_CUBE_MAP,V.__webglTexture),qt(n.TEXTURE_CUBE_MAP,y);for(let $=0;$<6;$++)if(y.mipmaps&&y.mipmaps.length>0)for(let Q=0;Q<y.mipmaps.length;Q++)ot(B.__webglFramebuffer[$][Q],A,y,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+$,Q);else ot(B.__webglFramebuffer[$],A,y,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+$,0);m(y)&&E(n.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(rt){for(let $=0,Q=Z.length;$<Q;$++){let at=Z[$],Ut=i.get(at),dt=n.TEXTURE_2D;(A.isWebGL3DRenderTarget||A.isWebGLArrayRenderTarget)&&(dt=A.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),e.bindTexture(dt,Ut.__webglTexture),qt(dt,at),ot(B.__webglFramebuffer,A,at,n.COLOR_ATTACHMENT0+$,dt,0),m(at)&&E(dt)}e.unbindTexture()}else{let $=n.TEXTURE_2D;if((A.isWebGL3DRenderTarget||A.isWebGLArrayRenderTarget)&&($=A.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),e.bindTexture($,V.__webglTexture),qt($,y),y.mipmaps&&y.mipmaps.length>0)for(let Q=0;Q<y.mipmaps.length;Q++)ot(B.__webglFramebuffer[Q],A,y,n.COLOR_ATTACHMENT0,$,Q);else ot(B.__webglFramebuffer,A,y,n.COLOR_ATTACHMENT0,$,0);m(y)&&E($),e.unbindTexture()}A.depthBuffer&&Bt(A)}function Dt(A){let y=A.textures;for(let B=0,V=y.length;B<V;B++){let Z=y[B];if(m(Z)){let st=C(A),rt=i.get(Z).__webglTexture;e.bindTexture(st,rt),E(st),e.unbindTexture()}}}let te=[],ue=[];function Se(A){if(A.samples>0){if(le(A)===!1){let y=A.textures,B=A.width,V=A.height,Z=n.COLOR_BUFFER_BIT,st=A.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,rt=i.get(A),$=y.length>1;if($)for(let at=0;at<y.length;at++)e.bindFramebuffer(n.FRAMEBUFFER,rt.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+at,n.RENDERBUFFER,null),e.bindFramebuffer(n.FRAMEBUFFER,rt.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+at,n.TEXTURE_2D,null,0);e.bindFramebuffer(n.READ_FRAMEBUFFER,rt.__webglMultisampledFramebuffer);let Q=A.texture.mipmaps;Q&&Q.length>0?e.bindFramebuffer(n.DRAW_FRAMEBUFFER,rt.__webglFramebuffer[0]):e.bindFramebuffer(n.DRAW_FRAMEBUFFER,rt.__webglFramebuffer);for(let at=0;at<y.length;at++){if(A.resolveDepthBuffer&&(A.depthBuffer&&(Z|=n.DEPTH_BUFFER_BIT),A.stencilBuffer&&A.resolveStencilBuffer&&(Z|=n.STENCIL_BUFFER_BIT)),$){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,rt.__webglColorRenderbuffer[at]);let Ut=i.get(y[at]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,Ut,0)}n.blitFramebuffer(0,0,B,V,0,0,B,V,Z,n.NEAREST),l===!0&&(te.length=0,ue.length=0,te.push(n.COLOR_ATTACHMENT0+at),A.depthBuffer&&A.storeMultisampledDepthBuffer===!1&&(te.push(st),ue.push(st),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,ue)),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,te))}if(e.bindFramebuffer(n.READ_FRAMEBUFFER,null),e.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),$)for(let at=0;at<y.length;at++){e.bindFramebuffer(n.FRAMEBUFFER,rt.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+at,n.RENDERBUFFER,rt.__webglColorRenderbuffer[at]);let Ut=i.get(y[at]).__webglTexture;e.bindFramebuffer(n.FRAMEBUFFER,rt.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+at,n.TEXTURE_2D,Ut,0)}e.bindFramebuffer(n.DRAW_FRAMEBUFFER,rt.__webglMultisampledFramebuffer)}else if(A.depthBuffer&&A.storeMultisampledDepthBuffer===!1&&l){let y=A.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[y])}}}function jt(A){return Math.min(s.maxSamples,A.samples)}function le(A){let y=i.get(A);return A.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&y.__useRenderToTexture!==!1}function I(A){let y=o.render.frame;h.get(A)!==y&&(h.set(A,y),A.update())}function ne(A,y){let B=A.colorSpace,V=A.format,Z=A.type;return A.isCompressedTexture===!0||A.isVideoTexture===!0||B!==to&&B!==zi&&(ge.getTransfer(B)===be?(V!==Jn||Z!==wn)&&Gt("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):Jt("WebGLTextures: Unsupported texture color space:",B)),y}function Pt(A){return typeof HTMLImageElement<"u"&&A instanceof HTMLImageElement?(c.width=A.naturalWidth||A.width,c.height=A.naturalHeight||A.height):typeof VideoFrame<"u"&&A instanceof VideoFrame?(c.width=A.displayWidth,c.height=A.displayHeight):(c.width=A.width,c.height=A.height),c}this.allocateTextureUnit=W,this.resetTextureUnits=k,this.getTextureUnits=L,this.setTextureUnits=z,this.setTexture2D=et,this.setTexture2DArray=O,this.setTexture3D=q,this.setTextureCube=j,this.rebindTextures=Wt,this.setupRenderTarget=kt,this.updateRenderTargetMipmap=Dt,this.updateMultisampleRenderTarget=Se,this.setupDepthRenderbuffer=Bt,this.setupFrameBufferTexture=ot,this.useMultisampledRTT=le,this.isReversedDepthBuffer=function(){return e.buffers.depth.getReversed()}}function Ny(n,t){function e(i,s=zi){let r,o=ge.getTransfer(s);if(i===wn)return n.UNSIGNED_BYTE;if(i===pl)return n.UNSIGNED_SHORT_4_4_4_4;if(i===ml)return n.UNSIGNED_SHORT_5_5_5_1;if(i===Lh)return n.UNSIGNED_INT_5_9_9_9_REV;if(i===Dh)return n.UNSIGNED_INT_10F_11F_11F_REV;if(i===Ph)return n.BYTE;if(i===Ih)return n.SHORT;if(i===Tr)return n.UNSIGNED_SHORT;if(i===fl)return n.INT;if(i===oi)return n.UNSIGNED_INT;if(i===ai)return n.FLOAT;if(i===li)return n.HALF_FLOAT;if(i===Nh)return n.ALPHA;if(i===Uh)return n.RGB;if(i===Jn)return n.RGBA;if(i===Mi)return n.DEPTH_COMPONENT;if(i===ds)return n.DEPTH_STENCIL;if(i===Fh)return n.RED;if(i===gl)return n.RED_INTEGER;if(i===fs)return n.RG;if(i===_l)return n.RG_INTEGER;if(i===xl)return n.RGBA_INTEGER;if(i===bo||i===So||i===To||i===Eo)if(o===be)if(r=t.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(i===bo)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===So)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===To)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===Eo)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=t.get("WEBGL_compressed_texture_s3tc"),r!==null){if(i===bo)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===So)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===To)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===Eo)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===yl||i===vl||i===Ml||i===bl)if(r=t.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(i===yl)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===vl)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===Ml)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===bl)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===Sl||i===Tl||i===El||i===wl||i===Al||i===wo||i===Rl)if(r=t.get("WEBGL_compressed_texture_etc"),r!==null){if(i===Sl||i===Tl)return o===be?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(i===El)return o===be?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC;if(i===wl)return r.COMPRESSED_R11_EAC;if(i===Al)return r.COMPRESSED_SIGNED_R11_EAC;if(i===wo)return r.COMPRESSED_RG11_EAC;if(i===Rl)return r.COMPRESSED_SIGNED_RG11_EAC}else return null;if(i===Cl||i===Pl||i===Il||i===Ll||i===Dl||i===Nl||i===Ul||i===Fl||i===Ol||i===Bl||i===kl||i===zl||i===Vl||i===Hl)if(r=t.get("WEBGL_compressed_texture_astc"),r!==null){if(i===Cl)return o===be?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===Pl)return o===be?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===Il)return o===be?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===Ll)return o===be?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===Dl)return o===be?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===Nl)return o===be?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===Ul)return o===be?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===Fl)return o===be?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===Ol)return o===be?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===Bl)return o===be?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===kl)return o===be?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===zl)return o===be?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===Vl)return o===be?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===Hl)return o===be?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===Gl||i===Wl||i===Xl)if(r=t.get("EXT_texture_compression_bptc"),r!==null){if(i===Gl)return o===be?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===Wl)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===Xl)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===ql||i===Yl||i===Ao||i===Zl)if(r=t.get("EXT_texture_compression_rgtc"),r!==null){if(i===ql)return r.COMPRESSED_RED_RGTC1_EXT;if(i===Yl)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===Ao)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===Zl)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===Er?n.UNSIGNED_INT_24_8:n[i]!==void 0?n[i]:null}return{convert:e}}var Uy=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Fy=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`,cu=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e){if(this.texture===null){let i=new co(t.texture);(t.depthNear!==e.depthNear||t.depthFar!==e.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=i}}getMesh(t){if(this.texture!==null&&this.mesh===null){let e=t.cameras[0].viewport,i=new On({vertexShader:Uy,fragmentShader:Fy,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new gn(new Ue(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},hu=class extends ni{constructor(t,e){super();let i=this,s=null,r=1,o=null,a="local-floor",l=1,c=null,h=null,d=null,u=null,f=null,p=null,x=typeof XRWebGLBinding<"u",g=new cu,m={},E=e.getContextAttributes(),C=null,M=null,w=[],v=[],S=new Zt,_=null,T=null,R=new ln;R.viewport=new Ne;let P=new ln;P.viewport=new Ne;let D=[R,P],k=new ll,L=null,z=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Y){let K=w[Y];return K===void 0&&(K=new mr,w[Y]=K),K.getTargetRaySpace()},this.getControllerGrip=function(Y){let K=w[Y];return K===void 0&&(K=new mr,w[Y]=K),K.getGripSpace()},this.getHand=function(Y){let K=w[Y];return K===void 0&&(K=new mr,w[Y]=K),K.getHandSpace()};function W(Y){let K=v.indexOf(Y.inputSource);if(K===-1)return;let it=w[K];it!==void 0&&(it.update(Y.inputSource,Y.frame,c||o),it.dispatchEvent({type:Y.type,data:Y.inputSource}))}function J(){s.removeEventListener("select",W),s.removeEventListener("selectstart",W),s.removeEventListener("selectend",W),s.removeEventListener("squeeze",W),s.removeEventListener("squeezestart",W),s.removeEventListener("squeezeend",W),s.removeEventListener("end",J),s.removeEventListener("inputsourceschange",et);for(let Y=0;Y<w.length;Y++){let K=v[Y];K!==null&&(v[Y]=null,w[Y].disconnect(K))}L=null,z=null,g.reset();for(let Y in m)delete m[Y];if(t.setRenderTarget(C),f=null,u=null,d=null,s=null,M=null,Et.stop(),i.isPresenting=!1,t.setPixelRatio(_),t.setSize(S.width,S.height,!1),T!==null){let Y=T.camera;Y.fov=T.fov,Y.zoom=T.zoom,Y.updateProjectionMatrix(),T=null}i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Y){r=Y,i.isPresenting===!0&&Gt("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Y){a=Y,i.isPresenting===!0&&Gt("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(Y){c=Y},this.getBaseLayer=function(){return u!==null?u:f},this.getBinding=function(){return d===null&&x&&(d=new XRWebGLBinding(s,e)),d},this.getFrame=function(){return p},this.getSession=function(){return s},this.setSession=async function(Y){if(s=Y,s!==null){if(C=t.getRenderTarget(),s.addEventListener("select",W),s.addEventListener("selectstart",W),s.addEventListener("selectend",W),s.addEventListener("squeeze",W),s.addEventListener("squeezestart",W),s.addEventListener("squeezeend",W),s.addEventListener("end",J),s.addEventListener("inputsourceschange",et),E.xrCompatible!==!0&&await e.makeXRCompatible(),_=t.getPixelRatio(),t.getSize(S),x&&"createProjectionLayer"in XRWebGLBinding.prototype){let it=null,Ct=null,ot=null;E.depth&&(ot=E.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,it=E.stencil?ds:Mi,Ct=E.stencil?Er:oi);let ut={colorFormat:e.RGBA8,depthFormat:ot,scaleFactor:r};d=this.getBinding(),u=d.createProjectionLayer(ut),s.updateRenderState({layers:[u]}),t.setPixelRatio(1),t.setSize(u.textureWidth,u.textureHeight,!1),M=new En(u.textureWidth,u.textureHeight,{format:Jn,type:wn,depthTexture:new es(u.textureWidth,u.textureHeight,Ct,void 0,void 0,void 0,void 0,void 0,void 0,it),stencilBuffer:E.stencil,colorSpace:t.outputColorSpace,samples:E.antialias?4:0,resolveDepthBuffer:u.ignoreDepthValues===!1,resolveStencilBuffer:u.ignoreDepthValues===!1,storeMultisampledDepthBuffer:u.ignoreDepthValues===!1,storeMultisampledStencilBuffer:u.ignoreDepthValues===!1})}else{let it={antialias:E.antialias,alpha:!0,depth:E.depth,stencil:E.stencil,framebufferScaleFactor:r};f=new XRWebGLLayer(s,e,it),s.updateRenderState({baseLayer:f}),t.setPixelRatio(1),t.setSize(f.framebufferWidth,f.framebufferHeight,!1),M=new En(f.framebufferWidth,f.framebufferHeight,{format:Jn,type:wn,colorSpace:t.outputColorSpace,stencilBuffer:E.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1,storeMultisampledDepthBuffer:f.ignoreDepthValues===!1,storeMultisampledStencilBuffer:f.ignoreDepthValues===!1})}M.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await s.requestReferenceSpace(a),Et.setContext(s),Et.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return g.getDepthTexture()};function et(Y){for(let K=0;K<Y.removed.length;K++){let it=Y.removed[K],Ct=v.indexOf(it);Ct>=0&&(v[Ct]=null,w[Ct].disconnect(it))}for(let K=0;K<Y.added.length;K++){let it=Y.added[K],Ct=v.indexOf(it);if(Ct===-1){for(let ut=0;ut<w.length;ut++)if(ut>=v.length){v.push(it),Ct=ut;break}else if(v[ut]===null){v[ut]=it,Ct=ut;break}if(Ct===-1)break}let ot=w[Ct];ot&&ot.connect(it)}}let O=new N,q=new N;function j(Y,K,it){O.setFromMatrixPosition(K.matrixWorld),q.setFromMatrixPosition(it.matrixWorld);let Ct=O.distanceTo(q),ot=K.projectionMatrix.elements,ut=it.projectionMatrix.elements,Yt=ot[14]/(ot[10]-1),Bt=ot[14]/(ot[10]+1),Wt=(ot[9]+1)/ot[5],kt=(ot[9]-1)/ot[5],Dt=(ot[8]-1)/ot[0],te=(ut[8]+1)/ut[0],ue=Yt*Dt,Se=Yt*te,jt=Ct/(-Dt+te),le=jt*-Dt;if(K.matrixWorld.decompose(Y.position,Y.quaternion,Y.scale),Y.translateX(le),Y.translateZ(jt),Y.matrixWorld.compose(Y.position,Y.quaternion,Y.scale),Y.matrixWorldInverse.copy(Y.matrixWorld).invert(),ot[10]===-1)Y.projectionMatrix.copy(K.projectionMatrix),Y.projectionMatrixInverse.copy(K.projectionMatrixInverse);else{let I=Yt+jt,ne=Bt+jt,Pt=ue-le,A=Se+(Ct-le),y=Wt*Bt/ne*I,B=kt*Bt/ne*I;Y.projectionMatrix.makePerspective(Pt,A,y,B,I,ne),Y.projectionMatrixInverse.copy(Y.projectionMatrix).invert()}}function yt(Y,K){K===null?Y.matrixWorld.copy(Y.matrix):Y.matrixWorld.multiplyMatrices(K.matrixWorld,Y.matrix),Y.matrixWorldInverse.copy(Y.matrixWorld).invert()}this.updateCamera=function(Y){if(s===null)return;let K=Y.near,it=Y.far;g.texture!==null&&(g.depthNear>0&&(K=g.depthNear),g.depthFar>0&&(it=g.depthFar)),k.near=P.near=R.near=K,k.far=P.far=R.far=it,(L!==k.near||z!==k.far)&&(s.updateRenderState({depthNear:k.near,depthFar:k.far}),L=k.near,z=k.far),k.layers.mask=Y.layers.mask|6,R.layers.mask=k.layers.mask&-5,P.layers.mask=k.layers.mask&-3;let Ct=Y.parent,ot=k.cameras;yt(k,Ct);for(let ut=0;ut<ot.length;ut++)yt(ot[ut],Ct);ot.length===2?j(k,R,P):k.projectionMatrix.copy(R.projectionMatrix),T===null&&Y.isPerspectiveCamera&&(T={camera:Y,fov:Y.fov,zoom:Y.zoom}),Tt(Y,k,Ct)};function Tt(Y,K,it){it===null?Y.matrix.copy(K.matrixWorld):(Y.matrix.copy(it.matrixWorld),Y.matrix.invert(),Y.matrix.multiply(K.matrixWorld)),Y.matrix.decompose(Y.position,Y.quaternion,Y.scale),Y.updateMatrixWorld(!0),Y.projectionMatrix.copy(K.projectionMatrix),Y.projectionMatrixInverse.copy(K.projectionMatrixInverse),Y.isPerspectiveCamera&&(Y.fov=fr*2*Math.atan(1/Y.projectionMatrix.elements[5]),Y.zoom=1)}this.getCamera=function(){return k},this.getFoveation=function(){if(!(u===null&&f===null))return l},this.setFoveation=function(Y){l=Y,u!==null&&(u.fixedFoveation=Y),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=Y)},this.hasDepthSensing=function(){return g.texture!==null},this.getDepthSensingMesh=function(){return g.getMesh(k)},this.getCameraTexture=function(Y){return m[Y]};let pe=null;function qt(Y,K){if(h=K.getViewerPose(c||o),p=K,h!==null){let it=h.views;f!==null&&(t.setRenderTargetFramebuffer(M,f.framebuffer),t.setRenderTarget(M));let Ct=!1;it.length!==k.cameras.length&&(k.cameras.length=0,Ct=!0);for(let Bt=0;Bt<it.length;Bt++){let Wt=it[Bt],kt=null;if(f!==null)kt=f.getViewport(Wt);else{let te=d.getViewSubImage(u,Wt);kt=te.viewport,Bt===0&&(t.setRenderTargetTextures(M,te.colorTexture,te.depthStencilTexture),t.setRenderTarget(M))}let Dt=D[Bt];Dt===void 0&&(Dt=new ln,Dt.layers.enable(Bt),Dt.viewport=new Ne,D[Bt]=Dt),Dt.matrix.fromArray(Wt.transform.matrix),Dt.matrix.decompose(Dt.position,Dt.quaternion,Dt.scale),Dt.projectionMatrix.fromArray(Wt.projectionMatrix),Dt.projectionMatrixInverse.copy(Dt.projectionMatrix).invert(),Dt.viewport.set(kt.x,kt.y,kt.width,kt.height),Bt===0&&(k.matrix.copy(Dt.matrix),k.matrix.decompose(k.position,k.quaternion,k.scale)),Ct===!0&&k.cameras.push(Dt)}let ot=s.enabledFeatures;if(ot&&ot.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&x){d=i.getBinding();let Bt=d.getDepthInformation(it[0]);Bt&&Bt.isValid&&Bt.texture&&g.init(Bt,s.renderState)}if(ot&&ot.includes("camera-access")&&x){t.state.unbindTexture(),d=i.getBinding();for(let Bt=0;Bt<it.length;Bt++){let Wt=it[Bt].camera;if(Wt){let kt=m[Wt];kt||(kt=new co,m[Wt]=kt);let Dt=d.getCameraImage(Wt);kt.sourceTexture=Dt}}}}for(let it=0;it<w.length;it++){let Ct=v[it],ot=w[it];Ct!==null&&ot!==void 0&&ot.update(Ct,K,c||o)}pe&&pe(Y,K),K.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:K}),p=null}let Et=new ep;Et.setAnimationLoop(qt),this.setAnimationLoop=function(Y){pe=Y},this.dispose=function(){}}},Oy=new De,ap=new Qt;ap.set(-1,0,0,0,1,0,0,0,1);function By(n,t){function e(g,m){g.matrixAutoUpdate===!0&&g.updateMatrix(),m.value.copy(g.matrix)}function i(g,m){m.color.getRGB(g.fogColor.value,Vh(n)),m.isFog?(g.fogNear.value=m.near,g.fogFar.value=m.far):m.isFogExp2&&(g.fogDensity.value=m.density)}function s(g,m,E,C,M){m.isNodeMaterial?m.uniformsNeedUpdate=!1:m.isMeshBasicMaterial?r(g,m):m.isMeshLambertMaterial?(r(g,m),m.envMap&&(g.envMapIntensity.value=m.envMapIntensity)):m.isMeshToonMaterial?(r(g,m),d(g,m)):m.isMeshPhongMaterial?(r(g,m),h(g,m),m.envMap&&(g.envMapIntensity.value=m.envMapIntensity)):m.isMeshStandardMaterial?(r(g,m),u(g,m),m.isMeshPhysicalMaterial&&f(g,m,M)):m.isMeshMatcapMaterial?(r(g,m),p(g,m)):m.isMeshDepthMaterial?r(g,m):m.isMeshDistanceMaterial?(r(g,m),x(g,m)):m.isMeshNormalMaterial?r(g,m):m.isLineBasicMaterial?(o(g,m),m.isLineDashedMaterial&&a(g,m)):m.isPointsMaterial?l(g,m,E,C):m.isSpriteMaterial?c(g,m):m.isShadowMaterial?(g.color.value.copy(m.color),g.opacity.value=m.opacity):m.isShaderMaterial&&(m.uniformsNeedUpdate=!1)}function r(g,m){g.opacity.value=m.opacity,m.color&&g.diffuse.value.copy(m.color),m.emissive&&g.emissive.value.copy(m.emissive).multiplyScalar(m.emissiveIntensity),m.map&&(g.map.value=m.map,e(m.map,g.mapTransform)),m.alphaMap&&(g.alphaMap.value=m.alphaMap,e(m.alphaMap,g.alphaMapTransform)),m.bumpMap&&(g.bumpMap.value=m.bumpMap,e(m.bumpMap,g.bumpMapTransform),g.bumpScale.value=m.bumpScale,m.side===xn&&(g.bumpScale.value*=-1)),m.normalMap&&(g.normalMap.value=m.normalMap,e(m.normalMap,g.normalMapTransform),g.normalScale.value.copy(m.normalScale),m.side===xn&&g.normalScale.value.negate()),m.displacementMap&&(g.displacementMap.value=m.displacementMap,e(m.displacementMap,g.displacementMapTransform),g.displacementScale.value=m.displacementScale,g.displacementBias.value=m.displacementBias),m.emissiveMap&&(g.emissiveMap.value=m.emissiveMap,e(m.emissiveMap,g.emissiveMapTransform)),m.specularMap&&(g.specularMap.value=m.specularMap,e(m.specularMap,g.specularMapTransform)),m.alphaTest>0&&(g.alphaTest.value=m.alphaTest);let E=t.get(m),C=E.envMap,M=E.envMapRotation;C&&(g.envMap.value=C,g.envMapRotation.value.setFromMatrix4(Oy.makeRotationFromEuler(M)).transpose(),C.isCubeTexture&&C.isRenderTargetTexture===!1&&g.envMapRotation.value.premultiply(ap),g.reflectivity.value=m.reflectivity,g.ior.value=m.ior,g.refractionRatio.value=m.refractionRatio),m.lightMap&&(g.lightMap.value=m.lightMap,g.lightMapIntensity.value=m.lightMapIntensity,e(m.lightMap,g.lightMapTransform)),m.aoMap&&(g.aoMap.value=m.aoMap,g.aoMapIntensity.value=m.aoMapIntensity,e(m.aoMap,g.aoMapTransform))}function o(g,m){g.diffuse.value.copy(m.color),g.opacity.value=m.opacity,m.map&&(g.map.value=m.map,e(m.map,g.mapTransform))}function a(g,m){g.dashSize.value=m.dashSize,g.totalSize.value=m.dashSize+m.gapSize,g.scale.value=m.scale}function l(g,m,E,C){g.diffuse.value.copy(m.color),g.opacity.value=m.opacity,g.size.value=m.size*E,g.scale.value=C*.5,m.map&&(g.map.value=m.map,e(m.map,g.uvTransform)),m.alphaMap&&(g.alphaMap.value=m.alphaMap,e(m.alphaMap,g.alphaMapTransform)),m.alphaTest>0&&(g.alphaTest.value=m.alphaTest)}function c(g,m){g.diffuse.value.copy(m.color),g.opacity.value=m.opacity,g.rotation.value=m.rotation,m.map&&(g.map.value=m.map,e(m.map,g.mapTransform)),m.alphaMap&&(g.alphaMap.value=m.alphaMap,e(m.alphaMap,g.alphaMapTransform)),m.alphaTest>0&&(g.alphaTest.value=m.alphaTest)}function h(g,m){g.specular.value.copy(m.specular),g.shininess.value=Math.max(m.shininess,1e-4)}function d(g,m){m.gradientMap&&(g.gradientMap.value=m.gradientMap)}function u(g,m){g.metalness.value=m.metalness,m.metalnessMap&&(g.metalnessMap.value=m.metalnessMap,e(m.metalnessMap,g.metalnessMapTransform)),g.roughness.value=m.roughness,m.roughnessMap&&(g.roughnessMap.value=m.roughnessMap,e(m.roughnessMap,g.roughnessMapTransform)),m.envMap&&(g.envMapIntensity.value=m.envMapIntensity)}function f(g,m,E){g.ior.value=m.ior,m.sheen>0&&(g.sheenColor.value.copy(m.sheenColor).multiplyScalar(m.sheen),g.sheenRoughness.value=m.sheenRoughness,m.sheenColorMap&&(g.sheenColorMap.value=m.sheenColorMap,e(m.sheenColorMap,g.sheenColorMapTransform)),m.sheenRoughnessMap&&(g.sheenRoughnessMap.value=m.sheenRoughnessMap,e(m.sheenRoughnessMap,g.sheenRoughnessMapTransform))),m.clearcoat>0&&(g.clearcoat.value=m.clearcoat,g.clearcoatRoughness.value=m.clearcoatRoughness,m.clearcoatMap&&(g.clearcoatMap.value=m.clearcoatMap,e(m.clearcoatMap,g.clearcoatMapTransform)),m.clearcoatRoughnessMap&&(g.clearcoatRoughnessMap.value=m.clearcoatRoughnessMap,e(m.clearcoatRoughnessMap,g.clearcoatRoughnessMapTransform)),m.clearcoatNormalMap&&(g.clearcoatNormalMap.value=m.clearcoatNormalMap,e(m.clearcoatNormalMap,g.clearcoatNormalMapTransform),g.clearcoatNormalScale.value.copy(m.clearcoatNormalScale),m.side===xn&&g.clearcoatNormalScale.value.negate())),m.dispersion>0&&(g.dispersion.value=m.dispersion),m.retroreflectivity>0&&(g.retroreflectivity.value=m.retroreflectivity),m.iridescence>0&&(g.iridescence.value=m.iridescence,g.iridescenceIOR.value=m.iridescenceIOR,g.iridescenceThicknessMinimum.value=m.iridescenceThicknessRange[0],g.iridescenceThicknessMaximum.value=m.iridescenceThicknessRange[1],m.iridescenceMap&&(g.iridescenceMap.value=m.iridescenceMap,e(m.iridescenceMap,g.iridescenceMapTransform)),m.iridescenceThicknessMap&&(g.iridescenceThicknessMap.value=m.iridescenceThicknessMap,e(m.iridescenceThicknessMap,g.iridescenceThicknessMapTransform))),m.transmission>0&&(g.transmission.value=m.transmission,g.transmissionSamplerMap.value=E.texture,g.transmissionSamplerSize.value.set(E.width,E.height),m.transmissionMap&&(g.transmissionMap.value=m.transmissionMap,e(m.transmissionMap,g.transmissionMapTransform)),g.thickness.value=m.thickness,m.thicknessMap&&(g.thicknessMap.value=m.thicknessMap,e(m.thicknessMap,g.thicknessMapTransform)),g.attenuationDistance.value=m.attenuationDistance,g.attenuationColor.value.copy(m.attenuationColor)),m.anisotropy>0&&(g.anisotropyVector.value.set(m.anisotropy*Math.cos(m.anisotropyRotation),m.anisotropy*Math.sin(m.anisotropyRotation)),m.anisotropyMap&&(g.anisotropyMap.value=m.anisotropyMap,e(m.anisotropyMap,g.anisotropyMapTransform))),g.specularIntensity.value=m.specularIntensity,g.specularColor.value.copy(m.specularColor),m.specularColorMap&&(g.specularColorMap.value=m.specularColorMap,e(m.specularColorMap,g.specularColorMapTransform)),m.specularIntensityMap&&(g.specularIntensityMap.value=m.specularIntensityMap,e(m.specularIntensityMap,g.specularIntensityMapTransform))}function p(g,m){m.matcap&&(g.matcap.value=m.matcap)}function x(g,m){let E=t.get(m).light;g.referencePosition.value.setFromMatrixPosition(E.matrixWorld),g.nearDistance.value=E.shadow.camera.near,g.farDistance.value=E.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:s}}function ky(n,t,e,i){let s={},r={},o=[],a=n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS);function l(M,w){let v=w.program;i.uniformBlockBinding(M,v)}function c(M,w){let v=s[M.id];v===void 0&&(g(M),v=h(M),s[M.id]=v,M.addEventListener("dispose",E));let S=w.program;i.updateUBOMapping(M,S);let _=t.render.frame;r[M.id]!==_&&(u(M),r[M.id]=_)}function h(M){let w=d();M.__bindingPointIndex=w;let v=n.createBuffer(),S=M.__size,_=M.usage;return n.bindBuffer(n.UNIFORM_BUFFER,v),n.bufferData(n.UNIFORM_BUFFER,S,_),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,w,v),v}function d(){for(let M=0;M<a;M++)if(o.indexOf(M)===-1)return o.push(M),M;return Jt("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function u(M){let w=s[M.id],v=M.uniforms,S=M.__cache;n.bindBuffer(n.UNIFORM_BUFFER,w);for(let _=0,T=v.length;_<T;_++){let R=v[_];if(Array.isArray(R))for(let P=0,D=R.length;P<D;P++)f(R[P],_,P,S);else f(R,_,0,S)}n.bindBuffer(n.UNIFORM_BUFFER,null)}function f(M,w,v,S){if(x(M,w,v,S)===!0){let _=M.__offset,T=M.value;if(Array.isArray(T)){let R=0;for(let P=0;P<T.length;P++){let D=T[P],k=m(D);p(D,M.__data,R),typeof D!="number"&&typeof D!="boolean"&&!D.isMatrix3&&!ArrayBuffer.isView(D)&&(R+=k.storage/Float32Array.BYTES_PER_ELEMENT)}}else p(T,M.__data,0);n.bufferSubData(n.UNIFORM_BUFFER,_,M.__data)}}function p(M,w,v){typeof M=="number"||typeof M=="boolean"?w[0]=M:M.isMatrix3?(w[0]=M.elements[0],w[1]=M.elements[1],w[2]=M.elements[2],w[3]=0,w[4]=M.elements[3],w[5]=M.elements[4],w[6]=M.elements[5],w[7]=0,w[8]=M.elements[6],w[9]=M.elements[7],w[10]=M.elements[8],w[11]=0):ArrayBuffer.isView(M)?w.set(new M.constructor(M.buffer,M.byteOffset,w.length)):M.toArray(w,v)}function x(M,w,v,S){let _=M.value,T=w+"_"+v;if(S[T]===void 0)return typeof _=="number"||typeof _=="boolean"?S[T]=_:ArrayBuffer.isView(_)?S[T]=_.slice():S[T]=_.clone(),!0;{let R=S[T];if(typeof _=="number"||typeof _=="boolean"){if(R!==_)return S[T]=_,!0}else{if(ArrayBuffer.isView(_))return!0;if(R.equals(_)===!1)return R.copy(_),!0}}return!1}function g(M){let w=M.uniforms,v=0,S=16;for(let T=0,R=w.length;T<R;T++){let P=Array.isArray(w[T])?w[T]:[w[T]];for(let D=0,k=P.length;D<k;D++){let L=P[D],z=Array.isArray(L.value)?L.value:[L.value];for(let W=0,J=z.length;W<J;W++){let et=z[W],O=m(et),q=v%S,j=q%O.boundary,yt=q+j;v+=j,yt!==0&&S-yt<O.storage&&(v+=S-yt),L.__data=new Float32Array(O.storage/Float32Array.BYTES_PER_ELEMENT),L.__offset=v,v+=O.storage}}}let _=v%S;return _>0&&(v+=S-_),M.__size=v,M.__cache={},this}function m(M){let w={boundary:0,storage:0};return typeof M=="number"||typeof M=="boolean"?(w.boundary=4,w.storage=4):M.isVector2?(w.boundary=8,w.storage=8):M.isVector3||M.isColor?(w.boundary=16,w.storage=12):M.isVector4?(w.boundary=16,w.storage=16):M.isMatrix3?(w.boundary=48,w.storage=48):M.isMatrix4?(w.boundary=64,w.storage=64):M.isTexture?Gt("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(M)?(w.boundary=16,w.storage=M.byteLength):Gt("WebGLRenderer: Unsupported uniform value type.",M),w}function E(M){let w=M.target;w.removeEventListener("dispose",E);let v=o.indexOf(w.__bindingPointIndex);o.splice(v,1),n.deleteBuffer(s[w.id]),delete s[w.id],delete r[w.id]}function C(){for(let M in s)n.deleteBuffer(s[M]);o=[],s={},r={}}return{bind:l,update:c,dispose:C}}var zy=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]),Si=null;function Vy(){return Si===null&&(Si=new Ha(zy,16,16,fs,li),Si.name="DFG_LUT",Si.minFilter=sn,Si.magFilter=sn,Si.wrapS=vi,Si.wrapT=vi,Si.generateMipmaps=!1,Si.needsUpdate=!0),Si}var nc=class{constructor(t={}){let{canvas:e=wf(),context:i=null,depth:s=!0,stencil:r=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:d=!1,reversedDepthBuffer:u=!1,outputBufferType:f=wn}=t;this.isWebGLRenderer=!0;let p;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");p=i.getContextAttributes().alpha}else p=o;let x=f,g=new Set([xl,_l,gl]),m=new Set([wn,oi,Tr,Er,pl,ml]),E=new Uint32Array(4),C=new Int32Array(4),M=new N,w=null,v=null,S=[],_=[],T=null;this.domElement=e,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=ri,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let R=this,P=!1,D=null,k=null,L=null,z=null;this._outputColorSpace=mn;let W=0,J=0,et=null,O=-1,q=null,j=new Ne,yt=new Ne,Tt=null,pe=new ae(0),qt=0,Et=e.width,Y=e.height,K=1,it=null,Ct=null,ot=new Ne(0,0,Et,Y),ut=new Ne(0,0,Et,Y),Yt=!1,Bt=new _r,Wt=!1,kt=!1,Dt=new De,te=new N,ue=new Ne,Se={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},jt=!1;function le(){return et===null?K:1}let I=i;function ne(b,U){return e.getContext(b,U)}let Pt,A,y,B,V,Z,st,rt,$,Q,at,Ut,dt,ct,It,Ht,zt,F,ht,tt,lt,mt,nt;try{let b={alpha:!0,depth:s,stencil:r,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:d};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${"186"}`),e.addEventListener("webglcontextlost",Nt,!1),e.addEventListener("webglcontextrestored",Kt,!1),e.addEventListener("webglcontextcreationerror",Vn,!1),I===null){let U="webgl2";if(I=ne(U,b),I===null)throw ne(U)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}xt()}catch(b){throw e.removeEventListener("webglcontextlost",Nt,!1),e.removeEventListener("webglcontextrestored",Kt,!1),e.removeEventListener("webglcontextcreationerror",Vn,!1),Jt("WebGLRenderer: "+b.message),b}function xt(){Pt=new Z_(I),Pt.init(),lt=new Ny(I,Pt),A=new B_(I,Pt,t,lt),y=new Ly(I,Pt),A.reversedDepthBuffer&&u&&y.buffers.depth.setReversed(!0),k=I.createFramebuffer(),L=I.createFramebuffer(),z=I.createFramebuffer(),B=new K_(I),V=new xy,Z=new Dy(I,Pt,y,V,A,lt,B),st=new Y_(R),rt=new Qm(I),mt=new F_(I,rt),$=new J_(I,rt,B,mt),Q=new Q_(I,$,rt,mt,B),F=new j_(I,A,Z),It=new k_(V),at=new _y(R,st,Pt,A,mt,It),Ut=new By(R,V),dt=new vy,ct=new wy(Pt),zt=new U_(R,st,y,Q,p,l),Ht=new Iy(R,Q,A),nt=new ky(I,B,A,y),ht=new O_(I,Pt,B),tt=new $_(I,Pt,B),B.programs=at.programs,R.capabilities=A,R.extensions=Pt,R.properties=V,R.renderLists=dt,R.shadowMap=Ht,R.state=y,R.info=B}x!==wn&&(T=new ex(x,e.width,e.height,a,s,r));let wt=new hu(R,I);this.xr=wt,this.getContext=function(){return I},this.getContextAttributes=function(){return I.getContextAttributes()},this.forceContextLoss=function(){let b=Pt.get("WEBGL_lose_context");b&&b.loseContext()},this.forceContextRestore=function(){let b=Pt.get("WEBGL_lose_context");b&&b.restoreContext()},this.getPixelRatio=function(){return K},this.setPixelRatio=function(b){b!==void 0&&(K=b,this.setSize(Et,Y,!1))},this.getSize=function(b){return b.set(Et,Y)},this.setSize=function(b,U,X=!0){if(wt.isPresenting){Gt("WebGLRenderer: Can't change size while VR device is presenting.");return}Et=b,Y=U,e.width=Math.floor(b*K),e.height=Math.floor(U*K),X===!0&&(e.style.width=b+"px",e.style.height=U+"px"),T!==null&&T.setSize(e.width,e.height),this.setViewport(0,0,b,U)},this.getDrawingBufferSize=function(b){return b.set(Et*K,Y*K).floor()},this.setDrawingBufferSize=function(b,U,X){Et=b,Y=U,K=X,e.width=Math.floor(b*X),e.height=Math.floor(U*X),this.setViewport(0,0,b,U)},this.setEffects=function(b){if(x===wn){Jt("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(b){for(let U=0;U<b.length;U++)if(b[U].isOutputPass===!0){Gt("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}T.setEffects(b||[])},this.getCurrentViewport=function(b){return b.copy(j)},this.getViewport=function(b){return b.copy(ot)},this.setViewport=function(b,U,X,H){b.isVector4?ot.set(b.x,b.y,b.z,b.w):ot.set(b,U,X,H),y.viewport(j.copy(ot).multiplyScalar(K).round())},this.getScissor=function(b){return b.copy(ut)},this.setScissor=function(b,U,X,H){b.isVector4?ut.set(b.x,b.y,b.z,b.w):ut.set(b,U,X,H),y.scissor(yt.copy(ut).multiplyScalar(K).round())},this.getScissorTest=function(){return Yt},this.setScissorTest=function(b){y.setScissorTest(Yt=b)},this.setOpaqueSort=function(b){it=b},this.setTransparentSort=function(b){Ct=b},this.getClearColor=function(b){return b.copy(zt.getClearColor())},this.setClearColor=function(){zt.setClearColor(...arguments)},this.getClearAlpha=function(){return zt.getClearAlpha()},this.setClearAlpha=function(){zt.setClearAlpha(...arguments)},this.clear=function(b=!0,U=!0,X=!0){let H=0;if(b){let G=!1;if(et!==null){let _t=et.texture.format;G=g.has(_t)}if(G){let _t=et.texture.type,St=m.has(_t),gt=zt.getClearColor(),At=zt.getClearAlpha(),Ft=gt.r,ce=gt.g,me=gt.b;St?(E[0]=Ft,E[1]=ce,E[2]=me,E[3]=At,I.clearBufferuiv(I.COLOR,0,E)):(C[0]=Ft,C[1]=ce,C[2]=me,C[3]=At,I.clearBufferiv(I.COLOR,0,C))}else H|=I.COLOR_BUFFER_BIT}U&&(H|=I.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),X&&(H|=I.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),H!==0&&I.clear(H)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(b){b.setRenderer(this),D=b},this.dispose=function(){e.removeEventListener("webglcontextlost",Nt,!1),e.removeEventListener("webglcontextrestored",Kt,!1),e.removeEventListener("webglcontextcreationerror",Vn,!1),zt.dispose(),dt.dispose(),ct.dispose(),V.dispose(),st.dispose(),Q.dispose(),mt.dispose(),nt.dispose(),at.dispose(),wt.dispose(),wt.removeEventListener("sessionstart",Su),wt.removeEventListener("sessionend",Tu),ps.stop()};function Nt(b){b.preventDefault(),Bh("WebGLRenderer: Context Lost."),P=!0}function Kt(){Bh("WebGLRenderer: Context Restored."),P=!1;let b=B.autoReset,U=Ht.enabled,X=Ht.autoUpdate,H=Ht.needsUpdate,G=Ht.type;xt(),B.autoReset=b,Ht.enabled=U,Ht.autoUpdate=X,Ht.needsUpdate=H,Ht.type=G}function Vn(b){Jt("WebGLRenderer: A WebGL context could not be created. Reason: ",b.statusMessage)}function Cn(b){let U=b.target;U.removeEventListener("dispose",Cn),Np(U)}function Np(b){Up(b),V.remove(b)}function Up(b){let U=V.get(b).programs;U!==void 0&&(U.forEach(function(X){at.releaseProgram(X)}),b.isShaderMaterial&&at.releaseShaderCache(b))}this.renderBufferDirect=function(b,U,X,H,G,_t){U===null&&(U=Se);let St=G.isMesh&&G.matrixWorld.determinantAffine()<0,gt=Bp(b,U,X,H,G);y.setMaterial(H,St);let At=X.index,Ft=1;if(H.wireframe===!0){if(At=$.getWireframeAttribute(X),At===void 0)return;Ft=2}let ce=X.drawRange,me=X.attributes.position,Rt=ce.start*Ft,ve=(ce.start+ce.count)*Ft;_t!==null&&(Rt=Math.max(Rt,_t.start*Ft),ve=Math.min(ve,(_t.start+_t.count)*Ft)),At!==null?(Rt=Math.max(Rt,0),ve=Math.min(ve,At.count)):me!=null&&(Rt=Math.max(Rt,0),ve=Math.min(ve,me.count));let He=ve-Rt;if(He<0||He===1/0)return;mt.setup(G,H,gt,X,At);let Ie,we=ht;if(At!==null&&(Ie=rt.get(At),we=tt,we.setIndex(Ie)),G.isMesh)H.wireframe===!0?(y.setLineWidth(H.wireframeLinewidth*le()),we.setMode(I.LINES)):we.setMode(I.TRIANGLES);else if(G.isLine){let rn=H.linewidth;rn===void 0&&(rn=1),y.setLineWidth(rn*le()),G.isLineSegments?we.setMode(I.LINES):G.isLineLoop?we.setMode(I.LINE_LOOP):we.setMode(I.LINE_STRIP)}else G.isPoints?we.setMode(I.POINTS):G.isSprite&&we.setMode(I.TRIANGLES);if(G.isBatchedMesh)if(Pt.get("WEBGL_multi_draw"))we.renderMultiDraw(G._multiDrawStarts,G._multiDrawCounts,G._multiDrawCount);else{let rn=G._multiDrawStarts,Mt=G._multiDrawCounts,un=G._multiDrawCount,_e=At?rt.get(At).bytesPerElement:1,Hn=V.get(H).currentProgram.getUniforms();for(let di=0;di<un;di++)Hn.setValue(I,"_gl_DrawID",di),we.render(rn[di]/_e,Mt[di])}else if(G.isInstancedMesh)we.renderInstances(Rt,He,G.count);else if(X.isInstancedBufferGeometry){let rn=X._maxInstanceCount!==void 0?X._maxInstanceCount:1/0,Mt=Math.min(X.instanceCount,rn);we.renderInstances(Rt,He,Mt)}else we.render(Rt,He)};function bu(b,U,X,H){D!==null&&b.isNodeMaterial&&D.setObject(H,b),Wt===!0&&It.setState(b,X,!1),b.transparent===!0&&b.side===Zn&&b.forceSinglePass===!1?(b.side=xn,b.needsUpdate=!0,Do(b,U,H),b.side=cs,b.needsUpdate=!0,Do(b,U,H),b.side=Zn):Do(b,U,H)}this.compile=function(b,U,X=null){X===null&&(X=b),D!==null&&D.renderStart(b,U,X),v=ct.get(X),v.init(U),_.push(v),X.traverseVisible(function(G){G.isLight&&G.layers.test(U.layers)&&(v.pushLight(G),G.castShadow&&v.pushShadow(G))}),b!==X&&b.traverseVisible(function(G){G.isLight&&G.layers.test(U.layers)&&(v.pushLight(G),G.castShadow&&v.pushShadow(G))}),v.setupLights(),D!==null&&D.updateLights(v.state.lightsArray),kt=this.localClippingEnabled,Wt=It.init(this.clippingPlanes,kt),Wt===!0&&It.setGlobalState(this.clippingPlanes,U),D!==null&&Ht.render(v.state.shadowsArray,X,U);let H=new Set;return b.traverse(function(G){if(!(G.isMesh||G.isPoints||G.isLine||G.isSprite))return;let _t=G.material;if(_t)if(Array.isArray(_t))for(let St=0;St<_t.length;St++){let gt=_t[St];bu(gt,X,U,G),H.add(gt)}else bu(_t,X,U,G),H.add(_t)}),v=_.pop(),D!==null&&D.renderEnd(),H},this.compileAsync=function(b,U,X=null){let H=this.compile(b,U,X);return new Promise(G=>{function _t(){if(H.forEach(function(St){let At=V.get(St).currentProgram;(At===void 0||At.isReady())&&H.delete(St)}),H.size===0){G(b);return}setTimeout(_t,10)}Pt.get("KHR_parallel_shader_compile")!==null?_t():setTimeout(_t,10)})};let mc=null;function Fp(b){mc&&mc(b)}function Su(){ps.stop()}function Tu(){ps.start()}let ps=new ep;ps.setAnimationLoop(Fp),typeof self<"u"&&ps.setContext(self),this.setAnimationLoop=function(b){mc=b,wt.setAnimationLoop(b),b===null?ps.stop():ps.start()},wt.addEventListener("sessionstart",Su),wt.addEventListener("sessionend",Tu),this.render=function(b,U){if(U!==void 0&&U.isCamera!==!0){Jt("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(P===!0)return;D!==null&&D.renderStart(b,U);let X=wt.enabled===!0&&wt.isPresenting===!0,H=T!==null&&(et===null||X)&&T.begin(R,et);if(b.matrixWorldAutoUpdate===!0&&b.updateMatrixWorld(),U.parent===null&&U.matrixWorldAutoUpdate===!0&&U.updateMatrixWorld(),wt.enabled===!0&&wt.isPresenting===!0&&(T===null||T.isCompositing()===!1)&&(wt.cameraAutoUpdate===!0&&wt.updateCamera(U),U=wt.getCamera()),b.isScene===!0&&b.onBeforeRender(R,b,U,et),v=ct.get(b,_.length),v.init(U),v.state.textureUnits=Z.getTextureUnits(),_.push(v),Dt.multiplyMatrices(U.projectionMatrix,U.matrixWorldInverse),Bt.setFromProjectionMatrix(Dt,ei,U.reversedDepth),kt=this.localClippingEnabled,Wt=It.init(this.clippingPlanes,kt),w=dt.get(b,S.length),w.init(),S.push(w),wt.enabled===!0&&wt.isPresenting===!0){let St=R.xr.getDepthSensingMesh();St!==null&&gc(St,U,-1/0,R.sortObjects)}gc(b,U,0,R.sortObjects),w.finish(),D!==null&&D.updateLights(v.state.lightsArray),R.sortObjects===!0&&w.sort(it,Ct),jt=wt.enabled===!1||wt.isPresenting===!1||wt.hasDepthSensing()===!1,jt&&zt.addToRenderList(w,b),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),Wt===!0&&It.beginShadows();let G=v.state.shadowsArray;if(Ht.render(G,b,U),Wt===!0&&It.endShadows(),(H&&T.hasRenderPass())===!1){let St=w.opaque,gt=w.transmissive;if(v.setupLights(),U.isArrayCamera){let At=U.cameras;if(gt.length>0)for(let Ft=0,ce=At.length;Ft<ce;Ft++){let me=At[Ft];wu(St,gt,b,me)}jt&&zt.render(b);for(let Ft=0,ce=At.length;Ft<ce;Ft++){let me=At[Ft];Eu(w,b,me,me.viewport)}}else gt.length>0&&wu(St,gt,b,U),jt&&zt.render(b),Eu(w,b,U)}et!==null&&J===0&&(Z.updateMultisampleRenderTarget(et),Z.updateRenderTargetMipmap(et)),H&&T.end(R),b.isScene===!0&&b.onAfterRender(R,b,U),mt.resetDefaultState(),O=-1,q=null,_.pop(),_.length>0?(v=_[_.length-1],Z.setTextureUnits(v.state.textureUnits),Wt===!0&&It.setGlobalState(R.clippingPlanes,v.state.camera)):v=null,S.pop(),S.length>0?w=S[S.length-1]:w=null,D!==null&&D.renderEnd()};function gc(b,U,X,H){if(b.visible===!1)return;if(b.layers.test(U.layers)){if(b.isGroup)X=b.renderOrder;else if(b.isLOD)b.autoUpdate===!0&&b.update(U);else if(b.isLightProbeGrid)v.pushLightProbeGrid(b);else if(b.isLight)v.pushLight(b),b.castShadow&&v.pushShadow(b);else if(b.isSprite){if(!b.frustumCulled||b.intersectsFrustum(Bt)){H&&ue.setFromMatrixPosition(b.matrixWorld).applyMatrix4(Dt);let St=Q.update(b),gt=b.material;gt.visible&&w.push(b,St,gt,X,ue.z,null,U)}}else if((b.isMesh||b.isLine||b.isPoints)&&(!b.frustumCulled||b.intersectsFrustum(Bt))){let St=Q.update(b),gt=b.material;if(H&&(b.boundingSphere!==void 0?(b.boundingSphere===null&&b.computeBoundingSphere(),ue.copy(b.boundingSphere.center)):(St.boundingSphere===null&&St.computeBoundingSphere(),ue.copy(St.boundingSphere.center)),ue.applyMatrix4(b.matrixWorld).applyMatrix4(Dt)),Array.isArray(gt)){let At=St.groups;for(let Ft=0,ce=At.length;Ft<ce;Ft++){let me=At[Ft],Rt=gt[me.materialIndex];Rt&&Rt.visible&&w.push(b,St,Rt,X,ue.z,me,U)}}else gt.visible&&w.push(b,St,gt,X,ue.z,null,U)}}let _t=b.children;for(let St=0,gt=_t.length;St<gt;St++)gc(_t[St],U,X,H)}function Eu(b,U,X,H){let{opaque:G,transmissive:_t,transparent:St}=b;v.setupLightsView(X),Wt===!0&&It.setGlobalState(R.clippingPlanes,X),H&&y.viewport(j.copy(H)),G.length>0&&Lo(G,U,X),_t.length>0&&Lo(_t,U,X),St.length>0&&Lo(St,U,X),y.buffers.depth.setTest(!0),y.buffers.depth.setMask(!0),y.buffers.color.setMask(!0),y.setPolygonOffset(!1)}function wu(b,U,X,H){if((X.isScene===!0?X.overrideMaterial:null)!==null)return;if(v.state.transmissionRenderTarget[H.id]===void 0){let Rt=Pt.has("EXT_color_buffer_half_float")||Pt.has("EXT_color_buffer_float");v.state.transmissionRenderTarget[H.id]=new En(1,1,{generateMipmaps:!0,type:Rt?li:wn,minFilter:us,samples:Math.max(4,A.samples),stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:ge.workingColorSpace})}let _t=v.state.transmissionRenderTarget[H.id],St=H.viewport||j;_t.setSize(St.z*R.transmissionResolutionScale,St.w*R.transmissionResolutionScale);let gt=R.getRenderTarget(),At=R.getActiveCubeFace(),Ft=R.getActiveMipmapLevel();R.setRenderTarget(_t),R.getClearColor(pe),qt=R.getClearAlpha(),qt<1&&R.setClearColor(16777215,.5),R.clear(),jt&&zt.render(X);let ce=R.toneMapping;R.toneMapping=ri;let me=H.viewport;if(H.viewport!==void 0&&(H.viewport=void 0),v.setupLightsView(H),Wt===!0&&It.setGlobalState(R.clippingPlanes,H),Lo(b,X,H),Z.updateMultisampleRenderTarget(_t),Z.updateRenderTargetMipmap(_t),Pt.has("WEBGL_multisampled_render_to_texture")===!1){let Rt=!1;for(let ve=0,He=U.length;ve<He;ve++){let Ie=U[ve],{object:we,geometry:rn,material:Mt,group:un}=Ie;if(Mt.side===Zn&&we.layers.test(H.layers)){let _e=Mt.side;Mt.side=xn,Mt.needsUpdate=!0,Au(we,X,H,rn,Mt,un),Mt.side=_e,Mt.needsUpdate=!0,Rt=!0}}Rt===!0&&(Z.updateMultisampleRenderTarget(_t),Z.updateRenderTargetMipmap(_t))}R.setRenderTarget(gt,At,Ft),R.setClearColor(pe,qt),me!==void 0&&(H.viewport=me),R.toneMapping=ce}function Lo(b,U,X){let H=U.isScene===!0?U.overrideMaterial:null;for(let G=0,_t=b.length;G<_t;G++){let St=b[G],{object:gt,geometry:At,group:Ft}=St,ce=St.material;ce.allowOverride===!0&&H!==null&&(ce=H),gt.layers.test(X.layers)&&Au(gt,U,X,At,ce,Ft)}}function Au(b,U,X,H,G,_t){D!==null&&G.isNodeMaterial&&D.setObject(b,G),b.onBeforeRender(R,U,X,H,G,_t),b.modelViewMatrix.multiplyMatrices(X.matrixWorldInverse,b.matrixWorld),b.normalMatrix.getNormalMatrix(b.modelViewMatrix),G.onBeforeRender(R,U,X,H,b,_t),G.transparent===!0&&G.side===Zn&&G.forceSinglePass===!1?(G.side=xn,G.needsUpdate=!0,R.renderBufferDirect(X,U,H,G,b,_t),G.side=cs,G.needsUpdate=!0,R.renderBufferDirect(X,U,H,G,b,_t),G.side=Zn):R.renderBufferDirect(X,U,H,G,b,_t),b.onAfterRender(R,U,X,H,G,_t)}function Do(b,U,X){U.isScene!==!0&&(U=Se);let H=V.get(b),G=v.state.lights,_t=v.state.shadowsArray,St=G.state.version,gt=at.getParameters(b,G.state,_t,U,X,v.state.lightProbeGridArray),At=at.getProgramCacheKey(gt),Ft=H.programs;H.environment=b.isMeshStandardMaterial||b.isMeshLambertMaterial||b.isMeshPhongMaterial?U.environment:null,H.fog=U.fog;let ce=b.isMeshStandardMaterial||b.isMeshLambertMaterial&&!b.envMap||b.isMeshPhongMaterial&&!b.envMap;H.envMap=st.get(b.envMap||H.environment,ce),H.envMapRotation=H.environment!==null&&b.envMap===null?U.environmentRotation:b.envMapRotation,Ft===void 0&&(b.addEventListener("dispose",Cn),Ft=new Map,H.programs=Ft);let me=Ft.get(At);if(me!==void 0){if(H.currentProgram===me&&H.lightsStateVersion===St)return Cu(b,gt),me}else gt.uniforms=at.getUniforms(b),D!==null&&b.isNodeMaterial&&D.build(b,X,gt),b.onBeforeCompile(gt,R),me=at.acquireProgram(gt,At),Ft.set(At,me),H.uniforms=gt.uniforms;let Rt=H.uniforms;return(!b.isShaderMaterial&&!b.isRawShaderMaterial||b.clipping===!0)&&(Rt.clippingPlanes=It.uniform),Cu(b,gt),H.needsLights=zp(b),H.lightsStateVersion=St,H.needsLights&&(Rt.ambientLightColor.value=G.state.ambient,Rt.lightProbe.value=G.state.probe,Rt.sunLights.value=G.state.sun,Rt.sunLightShadows.value=G.state.sunShadow,Rt.directionalLights.value=G.state.directional,Rt.directionalLightShadows.value=G.state.directionalShadow,Rt.spotLights.value=G.state.spot,Rt.spotLightShadows.value=G.state.spotShadow,Rt.rectAreaLights.value=G.state.rectArea,Rt.ltc_1.value=G.state.rectAreaLTC1,Rt.ltc_2.value=G.state.rectAreaLTC2,Rt.pointLights.value=G.state.point,Rt.pointLightShadows.value=G.state.pointShadow,Rt.hemisphereLights.value=G.state.hemi,Rt.sunShadowMatrix.value=G.state.sunShadowMatrix,Rt.sunShadowCascade.value=G.state.sunShadowCascade,Rt.directionalShadowMatrix.value=G.state.directionalShadowMatrix,Rt.spotLightMatrix.value=G.state.spotLightMatrix,Rt.spotLightMap.value=G.state.spotLightMap,Rt.pointShadowMatrix.value=G.state.pointShadowMatrix),H.lightProbeGrid=v.state.lightProbeGridArray.length>0,H.currentProgram=me,H.uniformsList=null,me}function Ru(b){if(b.uniformsList===null){let U=b.currentProgram.getUniforms();b.uniformsList=Cr.seqWithValue(U.seq,b.uniforms)}return b.uniformsList}function Cu(b,U){let X=V.get(b);X.outputColorSpace=U.outputColorSpace,X.batching=U.batching,X.batchingColor=U.batchingColor,X.instancing=U.instancing,X.instancingColor=U.instancingColor,X.instancingMorph=U.instancingMorph,X.skinning=U.skinning,X.morphTargets=U.morphTargets,X.morphNormals=U.morphNormals,X.morphColors=U.morphColors,X.morphTargetsCount=U.morphTargetsCount,X.numClippingPlanes=U.numClippingPlanes,X.numIntersection=U.numClipIntersection,X.vertexAlphas=U.vertexAlphas,X.vertexTangents=U.vertexTangents,X.toneMapping=U.toneMapping}function Op(b,U){if(b.length===0)return null;if(b.length===1)return b[0].texture!==null?b[0]:null;M.setFromMatrixPosition(U.matrixWorld);for(let X=0,H=b.length;X<H;X++){let G=b[X];if(G.texture!==null&&G.boundingBox.containsPoint(M))return G}return null}function Bp(b,U,X,H,G){U.isScene!==!0&&(U=Se),Z.resetTextureUnits();let _t=U.fog,St=H.isMeshStandardMaterial||H.isMeshLambertMaterial||H.isMeshPhongMaterial?U.environment:null,gt=et===null?R.outputColorSpace:et.isXRRenderTarget===!0?et.texture.colorSpace:ge.workingColorSpace,At=H.isMeshStandardMaterial||H.isMeshLambertMaterial&&!H.envMap||H.isMeshPhongMaterial&&!H.envMap,Ft=st.get(H.envMap||St,At),ce=H.vertexColors===!0&&!!X.attributes.color&&X.attributes.color.itemSize===4,me=!!X.attributes.tangent&&(!!H.normalMap||H.anisotropy>0),Rt=!!X.morphAttributes.position,ve=!!X.morphAttributes.normal,He=!!X.morphAttributes.color,Ie=ri;H.toneMapped&&(et===null||et.isXRRenderTarget===!0)&&(Ie=R.toneMapping);let we=X.morphAttributes.position||X.morphAttributes.normal||X.morphAttributes.color,rn=we!==void 0?we.length:0,Mt=V.get(H),un=v.state.lights;if(Wt===!0&&(kt===!0||b!==q)){let Ce=b===q&&H.id===O;It.setState(H,b,Ce)}let _e=!1;H.version===Mt.__version?(Mt.needsLights&&Mt.lightsStateVersion!==un.state.version||Mt.outputColorSpace!==gt||G.isBatchedMesh&&Mt.batching===!1||!G.isBatchedMesh&&Mt.batching===!0||G.isBatchedMesh&&Mt.batchingColor===!0&&G._colorsTexture===null||G.isBatchedMesh&&Mt.batchingColor===!1&&G._colorsTexture!==null||G.isInstancedMesh&&Mt.instancing===!1||!G.isInstancedMesh&&Mt.instancing===!0||G.isSkinnedMesh&&Mt.skinning===!1||!G.isSkinnedMesh&&Mt.skinning===!0||G.isInstancedMesh&&Mt.instancingColor===!0&&G.instanceColor===null||G.isInstancedMesh&&Mt.instancingColor===!1&&G.instanceColor!==null||G.isInstancedMesh&&Mt.instancingMorph===!0&&G.morphTexture===null||G.isInstancedMesh&&Mt.instancingMorph===!1&&G.morphTexture!==null||Mt.envMap!==Ft||H.fog===!0&&Mt.fog!==_t||Mt.numClippingPlanes!==void 0&&(Mt.numClippingPlanes!==It.numPlanes||Mt.numIntersection!==It.numIntersection)||Mt.vertexAlphas!==ce||Mt.vertexTangents!==me||Mt.morphTargets!==Rt||Mt.morphNormals!==ve||Mt.morphColors!==He||Mt.toneMapping!==Ie||Mt.morphTargetsCount!==rn||!!Mt.lightProbeGrid!=v.state.lightProbeGridArray.length>0)&&(_e=!0):(_e=!0,Mt.__version=H.version);let Hn=Mt.currentProgram;_e===!0&&(Hn=Do(H,U,G),D&&H.isNodeMaterial&&D.onUpdateProgram(H,Hn,Mt));let di=!1,Hi=!1,Fs=!1,Ee=Hn.getUniforms(),Ve=Mt.uniforms;if(y.useProgram(Hn.program)&&(di=!0,Hi=!0,Fs=!0),H.id!==O&&(O=H.id,Hi=!0),Mt.needsLights){let Ce=Op(v.state.lightProbeGridArray,G);Mt.lightProbeGrid!==Ce&&(Mt.lightProbeGrid=Ce,Hi=!0)}if(di||q!==b){y.buffers.depth.getReversed()&&b.reversedDepth!==!0&&(b._reversedDepth=!0,b.updateProjectionMatrix()),Ee.setValue(I,"projectionMatrix",b.projectionMatrix),Ee.setValue(I,"viewMatrix",b.matrixWorldInverse);let Wi=Ee.map.cameraPosition;Wi!==void 0&&Wi.setValue(I,te.setFromMatrixPosition(b.matrixWorld)),A.logarithmicDepthBuffer&&Ee.setValue(I,"logDepthBufFC",2/(Math.log(b.far+1)/Math.LN2)),(H.isMeshPhongMaterial||H.isMeshToonMaterial||H.isMeshLambertMaterial||H.isMeshBasicMaterial||H.isMeshStandardMaterial||H.isShaderMaterial)&&Ee.setValue(I,"isOrthographic",b.isOrthographicCamera===!0),q!==b&&(q=b,Hi=!0,Fs=!0)}if(Mt.needsLights&&(un.state.sunShadowMap.length>0&&Ee.setValue(I,"sunShadowMap",un.state.sunShadowMap,Z),un.state.directionalShadowMap.length>0&&Ee.setValue(I,"directionalShadowMap",un.state.directionalShadowMap,Z),un.state.spotShadowMap.length>0&&Ee.setValue(I,"spotShadowMap",un.state.spotShadowMap,Z),un.state.pointShadowMap.length>0&&Ee.setValue(I,"pointShadowMap",un.state.pointShadowMap,Z)),G.isSkinnedMesh){Ee.setOptional(I,G,"bindMatrix"),Ee.setOptional(I,G,"bindMatrixInverse");let Ce=G.skeleton;Ce&&(Ce.boneTexture===null&&Ce.computeBoneTexture(),Ee.setValue(I,"boneTexture",Ce.boneTexture,Z))}G.isBatchedMesh&&(Ee.setOptional(I,G,"batchingTexture"),Ee.setValue(I,"batchingTexture",G._matricesTexture,Z),Ee.setOptional(I,G,"batchingIdTexture"),Ee.setValue(I,"batchingIdTexture",G._indirectTexture,Z),Ee.setOptional(I,G,"batchingColorTexture"),G._colorsTexture!==null&&Ee.setValue(I,"batchingColorTexture",G._colorsTexture,Z));let Gi=X.morphAttributes;if((Gi.position!==void 0||Gi.normal!==void 0||Gi.color!==void 0)&&F.update(G,X,Hn),(Hi||Mt.receiveShadow!==G.receiveShadow)&&(Mt.receiveShadow=G.receiveShadow,Ee.setValue(I,"receiveShadow",G.receiveShadow)),(H.isMeshStandardMaterial||H.isMeshLambertMaterial||H.isMeshPhongMaterial)&&H.envMap===null&&U.environment!==null&&(Ve.envMapIntensity.value=U.environmentIntensity),Ve.dfgLUT!==void 0&&(Ve.dfgLUT.value=Vy()),Hi){if(Ee.setValue(I,"toneMappingExposure",R.toneMappingExposure),Mt.needsLights&&kp(Ve,Fs),_t&&H.fog===!0&&Ut.refreshFogUniforms(Ve,_t),Ut.refreshMaterialUniforms(Ve,H,K,Y,v.state.transmissionRenderTarget[b.id]),Mt.needsLights&&Mt.lightProbeGrid){let Ce=Mt.lightProbeGrid;Ve.probesSH.value=Ce.texture,Ve.probesMin.value.copy(Ce.boundingBox.min),Ve.probesMax.value.copy(Ce.boundingBox.max),Ve.probesResolution.value.copy(Ce.resolution)}Cr.upload(I,Ru(Mt),Ve,Z)}if(H.isShaderMaterial&&H.uniformsNeedUpdate===!0&&(Cr.upload(I,Ru(Mt),Ve,Z),H.uniformsNeedUpdate=!1),H.isSpriteMaterial&&Ee.setValue(I,"center",G.center),Ee.setValue(I,"modelViewMatrix",G.modelViewMatrix),Ee.setValue(I,"normalMatrix",G.normalMatrix),Ee.setValue(I,"modelMatrix",G.matrixWorld),H.uniformsGroups!==void 0){let Ce=H.uniformsGroups;for(let Wi=0,Os=Ce.length;Wi<Os;Wi++){let Iu=Ce[Wi];nt.update(Iu,Hn),nt.bind(Iu,Hn)}}return Hn}function kp(b,U){b.ambientLightColor.needsUpdate=U,b.lightProbe.needsUpdate=U,b.sunLights.needsUpdate=U,b.sunLightShadows.needsUpdate=U,b.directionalLights.needsUpdate=U,b.directionalLightShadows.needsUpdate=U,b.pointLights.needsUpdate=U,b.pointLightShadows.needsUpdate=U,b.spotLights.needsUpdate=U,b.spotLightShadows.needsUpdate=U,b.rectAreaLights.needsUpdate=U,b.hemisphereLights.needsUpdate=U}function zp(b){return b.isMeshLambertMaterial||b.isMeshToonMaterial||b.isMeshPhongMaterial||b.isMeshStandardMaterial||b.isShadowMaterial||b.isShaderMaterial&&b.lights===!0}this.getActiveCubeFace=function(){return W},this.getActiveMipmapLevel=function(){return J},this.getRenderTarget=function(){return et},this.setRenderTargetTextures=function(b,U,X){let H=V.get(b);H.__autoAllocateDepthBuffer=b.resolveDepthBuffer===!1,H.__autoAllocateDepthBuffer===!1&&(H.__useRenderToTexture=!1),V.get(b.texture).__webglTexture=U,V.get(b.depthTexture).__webglTexture=H.__autoAllocateDepthBuffer?void 0:X,H.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(b,U){let X=V.get(b);X.__webglFramebuffer=U,X.__useDefaultFramebuffer=U===void 0},this.setRenderTarget=function(b,U=0,X=0){et=b,W=U,J=X;let H=null,G=!1,_t=!1;if(b){let gt=V.get(b);if(gt.__useDefaultFramebuffer!==void 0){y.bindFramebuffer(I.FRAMEBUFFER,gt.__webglFramebuffer),j.copy(b.viewport),yt.copy(b.scissor),Tt=b.scissorTest,y.viewport(j),y.scissor(yt),y.setScissorTest(Tt),O=-1;return}else if(gt.__webglFramebuffer===void 0)Z.setupRenderTarget(b);else if(gt.__hasExternalTextures)Z.rebindTextures(b,V.get(b.texture).__webglTexture,V.get(b.depthTexture).__webglTexture);else if(b.depthBuffer){let ce=b.depthTexture;if(gt.__boundDepthTexture!==ce){if(ce!==null&&V.has(ce)&&(b.width!==ce.image.width||b.height!==ce.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");Z.setupDepthRenderbuffer(b)}}let At=b.texture;(At.isData3DTexture||At.isDataArrayTexture||At.isCompressedArrayTexture)&&(_t=!0);let Ft=V.get(b).__webglFramebuffer;b.isWebGLCubeRenderTarget?(Array.isArray(Ft[U])?H=Ft[U][X]:H=Ft[U],G=!0):b.samples>0&&Z.useMultisampledRTT(b)===!1?H=V.get(b).__webglMultisampledFramebuffer:Array.isArray(Ft)?H=Ft[X]:H=Ft,j.copy(b.viewport),yt.copy(b.scissor),Tt=b.scissorTest}else j.copy(ot).multiplyScalar(K).floor(),yt.copy(ut).multiplyScalar(K).floor(),Tt=Yt;if(X!==0&&(H=k),y.bindFramebuffer(I.FRAMEBUFFER,H)&&y.drawBuffers(b,H),y.viewport(j),y.scissor(yt),y.setScissorTest(Tt),G){let gt=V.get(b.texture);I.framebufferTexture2D(I.FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_CUBE_MAP_POSITIVE_X+U,gt.__webglTexture,X)}else if(_t){let gt=U;for(let At=0;At<b.textures.length;At++){let Ft=V.get(b.textures[At]);I.framebufferTextureLayer(I.FRAMEBUFFER,I.COLOR_ATTACHMENT0+At,Ft.__webglTexture,X,gt)}}else if(b!==null&&X!==0){let gt=V.get(b.texture);I.framebufferTexture2D(I.FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_2D,gt.__webglTexture,X)}O=-1};function Pu(b){let U=V.get(b);return(U.__readFormat!==b.format||U.__readType!==b.type)&&(U.__readFormat=b.format,U.__readType=b.type,U.__formatReadable=A.textureFormatReadable(b.format),U.__typeReadable=A.textureTypeReadable(b.type)),U}this.readRenderTargetPixels=function(b,U,X,H,G,_t,St,gt=0){if(!(b&&b.isWebGLRenderTarget)){Jt("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let At=V.get(b).__webglFramebuffer;if(b.isWebGLCubeRenderTarget&&St!==void 0&&(At=At[St]),At){y.bindFramebuffer(I.FRAMEBUFFER,At);try{let Ft=b.textures[gt],ce=Ft.format,me=Ft.type;b.textures.length>1&&I.readBuffer(I.COLOR_ATTACHMENT0+gt);let Rt=Pu(Ft);if(Rt.__formatReadable===!1){Jt("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(Rt.__typeReadable===!1){Jt("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}U>=0&&U<=b.width-H&&X>=0&&X<=b.height-G&&I.readPixels(U,X,H,G,lt.convert(ce),lt.convert(me),_t)}finally{let Ft=et!==null?V.get(et).__webglFramebuffer:null;y.bindFramebuffer(I.FRAMEBUFFER,Ft)}}},this.readRenderTargetPixelsAsync=async function(b,U,X,H,G,_t,St,gt=0){if(!(b&&b.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let At=V.get(b).__webglFramebuffer;if(b.isWebGLCubeRenderTarget&&St!==void 0&&(At=At[St]),At)if(U>=0&&U<=b.width-H&&X>=0&&X<=b.height-G){y.bindFramebuffer(I.FRAMEBUFFER,At);let Ft=b.textures[gt],ce=Ft.format,me=Ft.type;b.textures.length>1&&I.readBuffer(I.COLOR_ATTACHMENT0+gt);let Rt=Pu(Ft);if(Rt.__formatReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(Rt.__typeReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");let ve=I.createBuffer();I.bindBuffer(I.PIXEL_PACK_BUFFER,ve),I.bufferData(I.PIXEL_PACK_BUFFER,_t.byteLength,I.STREAM_READ),I.readPixels(U,X,H,G,lt.convert(ce),lt.convert(me),0),I.bindBuffer(I.PIXEL_PACK_BUFFER,null);let He=et!==null?V.get(et).__webglFramebuffer:null;y.bindFramebuffer(I.FRAMEBUFFER,He);let Ie=I.fenceSync(I.SYNC_GPU_COMMANDS_COMPLETE,0);return I.flush(),await Rf(I,Ie,4),I.bindBuffer(I.PIXEL_PACK_BUFFER,ve),I.getBufferSubData(I.PIXEL_PACK_BUFFER,0,_t),I.bindBuffer(I.PIXEL_PACK_BUFFER,null),I.deleteBuffer(ve),I.deleteSync(Ie),_t}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(b,U=null,X=0){let H=Math.pow(2,-X),G=Math.floor(b.image.width*H),_t=Math.floor(b.image.height*H),St=U!==null?U.x:0,gt=U!==null?U.y:0;Z.setTexture2D(b,0),I.copyTexSubImage2D(I.TEXTURE_2D,X,0,0,St,gt,G,_t),y.unbindTexture()},this.copyTextureToTexture=function(b,U,X=null,H=null,G=0,_t=0){let St,gt,At,Ft,ce,me,Rt,ve,He,Ie=b.isCompressedTexture?b.mipmaps[_t]:b.image;if(X!==null)St=X.max.x-X.min.x,gt=X.max.y-X.min.y,At=X.isBox3?X.max.z-X.min.z:1,Ft=X.min.x,ce=X.min.y,me=X.isBox3?X.min.z:0;else{let Ve=Math.pow(2,-G);St=Math.floor(Ie.width*Ve),gt=Math.floor(Ie.height*Ve),b.isDataArrayTexture?At=Ie.depth:b.isData3DTexture?At=Math.floor(Ie.depth*Ve):At=1,Ft=0,ce=0,me=0}H!==null?(Rt=H.x,ve=H.y,He=H.z):(Rt=0,ve=0,He=0);let we=lt.convert(U.format),rn=lt.convert(U.type),Mt;U.isData3DTexture?(Z.setTexture3D(U,0),Mt=I.TEXTURE_3D):U.isDataArrayTexture||U.isCompressedArrayTexture?(Z.setTexture2DArray(U,0),Mt=I.TEXTURE_2D_ARRAY):(Z.setTexture2D(U,0),Mt=I.TEXTURE_2D),y.activeTexture(I.TEXTURE0),y.pixelStorei(I.UNPACK_FLIP_Y_WEBGL,U.flipY),y.pixelStorei(I.UNPACK_PREMULTIPLY_ALPHA_WEBGL,U.premultiplyAlpha),y.pixelStorei(I.UNPACK_ALIGNMENT,U.unpackAlignment);let un=y.getParameter(I.UNPACK_ROW_LENGTH),_e=y.getParameter(I.UNPACK_IMAGE_HEIGHT),Hn=y.getParameter(I.UNPACK_SKIP_PIXELS),di=y.getParameter(I.UNPACK_SKIP_ROWS),Hi=y.getParameter(I.UNPACK_SKIP_IMAGES);y.pixelStorei(I.UNPACK_ROW_LENGTH,Ie.width),y.pixelStorei(I.UNPACK_IMAGE_HEIGHT,Ie.height),y.pixelStorei(I.UNPACK_SKIP_PIXELS,Ft),y.pixelStorei(I.UNPACK_SKIP_ROWS,ce),y.pixelStorei(I.UNPACK_SKIP_IMAGES,me);let Fs=b.isDataArrayTexture||b.isData3DTexture,Ee=U.isDataArrayTexture||U.isData3DTexture;if(b.isDepthTexture){let Ve=V.get(b),Gi=V.get(U),Ce=V.get(Ve.__renderTarget),Wi=V.get(Gi.__renderTarget);y.bindFramebuffer(I.READ_FRAMEBUFFER,Ce.__webglFramebuffer),y.bindFramebuffer(I.DRAW_FRAMEBUFFER,Wi.__webglFramebuffer);for(let Os=0;Os<At;Os++)Fs&&(I.framebufferTextureLayer(I.READ_FRAMEBUFFER,I.COLOR_ATTACHMENT0,V.get(b).__webglTexture,G,me+Os),I.framebufferTextureLayer(I.DRAW_FRAMEBUFFER,I.COLOR_ATTACHMENT0,V.get(U).__webglTexture,_t,He+Os)),I.blitFramebuffer(Ft,ce,St,gt,Rt,ve,St,gt,I.DEPTH_BUFFER_BIT,I.NEAREST);y.bindFramebuffer(I.READ_FRAMEBUFFER,null),y.bindFramebuffer(I.DRAW_FRAMEBUFFER,null)}else if(G!==0||b.isRenderTargetTexture||V.has(b)){let Ve=V.get(b),Gi=V.get(U);y.bindFramebuffer(I.READ_FRAMEBUFFER,L),y.bindFramebuffer(I.DRAW_FRAMEBUFFER,z);for(let Ce=0;Ce<At;Ce++)Fs?I.framebufferTextureLayer(I.READ_FRAMEBUFFER,I.COLOR_ATTACHMENT0,Ve.__webglTexture,G,me+Ce):I.framebufferTexture2D(I.READ_FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_2D,Ve.__webglTexture,G),Ee?I.framebufferTextureLayer(I.DRAW_FRAMEBUFFER,I.COLOR_ATTACHMENT0,Gi.__webglTexture,_t,He+Ce):I.framebufferTexture2D(I.DRAW_FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_2D,Gi.__webglTexture,_t),G!==0?I.blitFramebuffer(Ft,ce,St,gt,Rt,ve,St,gt,I.COLOR_BUFFER_BIT,I.NEAREST):Ee?I.copyTexSubImage3D(Mt,_t,Rt,ve,He+Ce,Ft,ce,St,gt):I.copyTexSubImage2D(Mt,_t,Rt,ve,Ft,ce,St,gt);y.bindFramebuffer(I.READ_FRAMEBUFFER,null),y.bindFramebuffer(I.DRAW_FRAMEBUFFER,null)}else Ee?b.isDataTexture||b.isData3DTexture?I.texSubImage3D(Mt,_t,Rt,ve,He,St,gt,At,we,rn,Ie.data):U.isCompressedArrayTexture?I.compressedTexSubImage3D(Mt,_t,Rt,ve,He,St,gt,At,we,Ie.data):I.texSubImage3D(Mt,_t,Rt,ve,He,St,gt,At,we,rn,Ie):b.isDataTexture?I.texSubImage2D(I.TEXTURE_2D,_t,Rt,ve,St,gt,we,rn,Ie.data):b.isCompressedTexture?I.compressedTexSubImage2D(I.TEXTURE_2D,_t,Rt,ve,Ie.width,Ie.height,we,Ie.data):I.texSubImage2D(I.TEXTURE_2D,_t,Rt,ve,St,gt,we,rn,Ie);y.pixelStorei(I.UNPACK_ROW_LENGTH,un),y.pixelStorei(I.UNPACK_IMAGE_HEIGHT,_e),y.pixelStorei(I.UNPACK_SKIP_PIXELS,Hn),y.pixelStorei(I.UNPACK_SKIP_ROWS,di),y.pixelStorei(I.UNPACK_SKIP_IMAGES,Hi),_t===0&&U.generateMipmaps&&I.generateMipmap(Mt),y.unbindTexture()},this.initRenderTarget=function(b){V.get(b).__webglFramebuffer===void 0&&Z.setupRenderTarget(b)},this.initTexture=function(b){b.isCubeTexture?Z.setTextureCube(b,0):b.isData3DTexture?Z.setTexture3D(b,0):b.isDataArrayTexture||b.isCompressedArrayTexture?Z.setTexture2DArray(b,0):Z.setTexture2D(b,0),y.unbindTexture()},this.resetState=function(){W=0,J=0,et=null,y.reset(),mt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return ei}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;let e=this.getContext();e.drawingBufferColorSpace=ge._getDrawingBufferColorSpace(t),e.unpackColorSpace=ge._getUnpackColorSpace()}};var lp={type:"change"},fu={type:"start"},hp={type:"end"},rc=new Rs,cp=new Nn,Hy=Math.cos(70*zh.DEG2RAD),Ke=new N,An=2*Math.PI,Te={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},du=1e-6,oc=class extends _o{constructor(t,e=null){super(t,e),this.state=Te.NONE,this.target=new N,this.cursor=new N,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.keyRotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:as.ROTATE,MIDDLE:as.DOLLY,RIGHT:as.PAN},this.touches={ONE:ls.ROTATE,TWO:ls.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._cursorStyle="auto",this._domElementKeyEvents=null,this._lastPosition=new N,this._lastQuaternion=new Un,this._lastTargetPosition=new N,this._quat=new Un().setFromUnitVectors(t.up,new N(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new Mr,this._sphericalDelta=new Mr,this._scale=1,this._panOffset=new N,this._rotateStart=new Zt,this._rotateEnd=new Zt,this._rotateDelta=new Zt,this._panStart=new Zt,this._panEnd=new Zt,this._panDelta=new Zt,this._dollyStart=new Zt,this._dollyEnd=new Zt,this._dollyDelta=new Zt,this._dollyDirection=new N,this._mouse=new Zt,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=Wy.bind(this),this._onPointerDown=Gy.bind(this),this._onPointerUp=Xy.bind(this),this._onContextMenu=jy.bind(this),this._onMouseWheel=Zy.bind(this),this._onKeyDown=Jy.bind(this),this._onTouchStart=$y.bind(this),this._onTouchMove=Ky.bind(this),this._onMouseDown=qy.bind(this),this._onMouseMove=Yy.bind(this),this._interceptControlDown=Qy.bind(this),this._interceptControlUp=tv.bind(this),this.domElement!==null&&this.connect(this.domElement),this.update()}set cursorStyle(t){this._cursorStyle=t,t==="grab"?this.domElement.style.cursor="grab":this.domElement.style.cursor="auto"}get cursorStyle(){return this._cursorStyle}connect(t){super.connect(t),this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.state=Te.NONE,this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.ownerDocument.removeEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents();let t=this.domElement.getRootNode();t.removeEventListener("keydown",this._interceptControlDown,{capture:!0}),t.removeEventListener("keyup",this._interceptControlUp,{capture:!0}),this._controlActive=!1,this._pointers.length=0,this._pointerPositions={},this.domElement.style.touchAction="",this.domElement.style.cursor="auto"}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(t){t.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=t}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(lp),this.update(),this.state=Te.NONE}pan(t,e){this._pan(t,e),this.update()}dollyIn(t){this._dollyIn(t),this.update()}dollyOut(t){this._dollyOut(t),this.update()}rotateLeft(t){this._rotateLeft(t),this.update()}rotateUp(t){this._rotateUp(t),this.update()}update(t=null){let e=this.object.position;Ke.copy(e).sub(this.target),Ke.applyQuaternion(this._quat),this._spherical.setFromVector3(Ke),this.autoRotate&&this.state===Te.NONE&&this._rotateLeft(this._getAutoRotationAngle(t)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let i=this.minAzimuthAngle,s=this.maxAzimuthAngle;isFinite(i)&&isFinite(s)&&(i<-Math.PI?i+=An:i>Math.PI&&(i-=An),s<-Math.PI?s+=An:s>Math.PI&&(s-=An),i<=s?this._spherical.theta=Math.max(i,Math.min(s,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(i+s)/2?Math.max(i,this._spherical.theta):Math.min(s,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let r=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{let o=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),r=o!=this._spherical.radius}if(Ke.setFromSpherical(this._spherical),Ke.applyQuaternion(this._quatInverse),e.copy(this.target).add(Ke),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let o=null;if(this.object.isPerspectiveCamera){let a=Ke.length();o=this._clampDistance(a*this._scale);let l=a-o;this.object.position.addScaledVector(this._dollyDirection,l),this.object.updateMatrixWorld(),r=!!l}else if(this.object.isOrthographicCamera){let a=new N(this._mouse.x,this._mouse.y,0);a.unproject(this.object);let l=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),r=l!==this.object.zoom;let c=new N(this._mouse.x,this._mouse.y,0);c.unproject(this.object),this.object.position.sub(c).add(a),this.object.updateMatrixWorld(),o=Ke.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;o!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(o).add(this.object.position):(rc.origin.copy(this.object.position),rc.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(rc.direction))<Hy?this.object.lookAt(this.target):(cp.setFromNormalAndCoplanarPoint(this.object.up,this.target),rc.intersectPlane(cp,this.target))))}else if(this.object.isOrthographicCamera){let o=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),o!==this.object.zoom&&(this.object.updateProjectionMatrix(),r=!0)}return this._scale=1,this._performCursorZoom=!1,r||this._lastPosition.distanceToSquared(this.object.position)>du||8*(1-this._lastQuaternion.dot(this.object.quaternion))>du||this._lastTargetPosition.distanceToSquared(this.target)>du?(this.dispatchEvent(lp),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(t){return t!==null?An/60*this.autoRotateSpeed*t:An/60/60*this.autoRotateSpeed}_getZoomScale(t){let e=Math.abs(t*.01);return Math.pow(.95,this.zoomSpeed*e)}_rotateLeft(t){this._sphericalDelta.theta-=t}_rotateUp(t){this._sphericalDelta.phi-=t}_panLeft(t,e){Ke.setFromMatrixColumn(e,0),Ke.multiplyScalar(-t),this._panOffset.add(Ke)}_panUp(t,e){this.screenSpacePanning===!0?Ke.setFromMatrixColumn(e,1):(Ke.setFromMatrixColumn(e,0),Ke.crossVectors(this.object.up,Ke)),Ke.multiplyScalar(t),this._panOffset.add(Ke)}_pan(t,e){let i=this.domElement;if(this.object.isPerspectiveCamera){let s=this.object.position;Ke.copy(s).sub(this.target);let r=Ke.length();r*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*t*r/i.clientHeight,this.object.matrix),this._panUp(2*e*r/i.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(t*(this.object.right-this.object.left)/this.object.zoom/i.clientWidth,this.object.matrix),this._panUp(e*(this.object.top-this.object.bottom)/this.object.zoom/i.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(t){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=t:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(t){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=t:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(t,e){if(!this.zoomToCursor)return;this._performCursorZoom=!0;let i=this.domElement.getBoundingClientRect(),s=t-i.left,r=e-i.top,o=i.width,a=i.height;this._mouse.x=s/o*2-1,this._mouse.y=-(r/a)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(t){return Math.max(this.minDistance,Math.min(this.maxDistance,t))}_handleMouseDownRotate(t){this._rotateStart.set(t.clientX,t.clientY)}_handleMouseDownDolly(t){this._updateZoomParameters(t.clientX,t.clientX),this._dollyStart.set(t.clientX,t.clientY)}_handleMouseDownPan(t){this._panStart.set(t.clientX,t.clientY)}_handleMouseMoveRotate(t){this._rotateEnd.set(t.clientX,t.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);let e=this.domElement;this._rotateLeft(An*this._rotateDelta.x/e.clientHeight),this._rotateUp(An*this._rotateDelta.y/e.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(t){this._dollyEnd.set(t.clientX,t.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(t){this._panEnd.set(t.clientX,t.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(t){this._updateZoomParameters(t.clientX,t.clientY),t.deltaY<0?this._dollyIn(this._getZoomScale(t.deltaY)):t.deltaY>0&&this._dollyOut(this._getZoomScale(t.deltaY)),this.update()}_handleKeyDown(t){let e=!1;switch(t.code){case this.keys.UP:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateUp(An*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,this.keyPanSpeed),e=!0;break;case this.keys.BOTTOM:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateUp(-An*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,-this.keyPanSpeed),e=!0;break;case this.keys.LEFT:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateLeft(An*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(this.keyPanSpeed,0),e=!0;break;case this.keys.RIGHT:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateLeft(-An*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(-this.keyPanSpeed,0),e=!0;break}e&&(t.preventDefault(),this.update())}_handleTouchStartRotate(t){if(this._pointers.length===1)this._rotateStart.set(t.pageX,t.pageY);else{let e=this._getSecondPointerPosition(t),i=.5*(t.pageX+e.x),s=.5*(t.pageY+e.y);this._rotateStart.set(i,s)}}_handleTouchStartPan(t){if(this._pointers.length===1)this._panStart.set(t.pageX,t.pageY);else{let e=this._getSecondPointerPosition(t),i=.5*(t.pageX+e.x),s=.5*(t.pageY+e.y);this._panStart.set(i,s)}}_handleTouchStartDolly(t){let e=this._getSecondPointerPosition(t),i=t.pageX-e.x,s=t.pageY-e.y,r=Math.sqrt(i*i+s*s);this._dollyStart.set(0,r)}_handleTouchStartDollyPan(t){this.enableZoom&&this._handleTouchStartDolly(t),this.enablePan&&this._handleTouchStartPan(t)}_handleTouchStartDollyRotate(t){this.enableZoom&&this._handleTouchStartDolly(t),this.enableRotate&&this._handleTouchStartRotate(t)}_handleTouchMoveRotate(t){if(this._pointers.length==1)this._rotateEnd.set(t.pageX,t.pageY);else{let i=this._getSecondPointerPosition(t),s=.5*(t.pageX+i.x),r=.5*(t.pageY+i.y);this._rotateEnd.set(s,r)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);let e=this.domElement;this._rotateLeft(An*this._rotateDelta.x/e.clientHeight),this._rotateUp(An*this._rotateDelta.y/e.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(t){if(this._pointers.length===1)this._panEnd.set(t.pageX,t.pageY);else{let e=this._getSecondPointerPosition(t),i=.5*(t.pageX+e.x),s=.5*(t.pageY+e.y);this._panEnd.set(i,s)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(t){let e=this._getSecondPointerPosition(t),i=t.pageX-e.x,s=t.pageY-e.y,r=Math.sqrt(i*i+s*s);this._dollyEnd.set(0,r),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);let o=(t.pageX+e.x)*.5,a=(t.pageY+e.y)*.5;this._updateZoomParameters(o,a)}_handleTouchMoveDollyPan(t){this.enableZoom&&this._handleTouchMoveDolly(t),this.enablePan&&this._handleTouchMovePan(t)}_handleTouchMoveDollyRotate(t){this.enableZoom&&this._handleTouchMoveDolly(t),this.enableRotate&&this._handleTouchMoveRotate(t)}_addPointer(t){this._pointers.push(t.pointerId)}_removePointer(t){delete this._pointerPositions[t.pointerId];for(let e=0;e<this._pointers.length;e++)if(this._pointers[e]==t.pointerId){this._pointers.splice(e,1);return}}_isTrackingPointer(t){for(let e=0;e<this._pointers.length;e++)if(this._pointers[e]==t.pointerId)return!0;return!1}_trackPointer(t){let e=this._pointerPositions[t.pointerId];e===void 0&&(e=new Zt,this._pointerPositions[t.pointerId]=e),e.set(t.pageX,t.pageY)}_getSecondPointerPosition(t){let e=t.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[e]}_customWheelEvent(t){let e=t.deltaMode,i={clientX:t.clientX,clientY:t.clientY,deltaY:t.deltaY};switch(e){case 1:i.deltaY*=16;break;case 2:i.deltaY*=100;break}return t.ctrlKey&&!this._controlActive&&(i.deltaY*=10),i}};function Gy(n){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(n.pointerId),this.domElement.ownerDocument.addEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(n)&&(this._addPointer(n),n.pointerType==="touch"?this._onTouchStart(n):this._onMouseDown(n),this._cursorStyle==="grab"&&(this.domElement.style.cursor="grabbing")))}function Wy(n){this.enabled!==!1&&(n.pointerType==="touch"?this._onTouchMove(n):this._onMouseMove(n))}function Xy(n){switch(this._removePointer(n),this._pointers.length){case 0:this.domElement.releasePointerCapture(n.pointerId),this.domElement.ownerDocument.removeEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(hp),this.state=Te.NONE,this._cursorStyle==="grab"&&(this.domElement.style.cursor="grab");break;case 1:let t=this._pointers[0],e=this._pointerPositions[t];this._onTouchStart({pointerId:t,pageX:e.x,pageY:e.y});break}}function qy(n){let t;switch(n.button){case 0:t=this.mouseButtons.LEFT;break;case 1:t=this.mouseButtons.MIDDLE;break;case 2:t=this.mouseButtons.RIGHT;break;default:t=-1}switch(t){case as.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(n),this.state=Te.DOLLY;break;case as.ROTATE:if(n.ctrlKey||n.metaKey||n.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(n),this.state=Te.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(n),this.state=Te.ROTATE}break;case as.PAN:if(n.ctrlKey||n.metaKey||n.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(n),this.state=Te.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(n),this.state=Te.PAN}break;default:this.state=Te.NONE}this.state!==Te.NONE&&this.dispatchEvent(fu)}function Yy(n){switch(this.state){case Te.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(n);break;case Te.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(n);break;case Te.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(n);break}}function Zy(n){this.enabled===!1||this.enableZoom===!1||this.state!==Te.NONE||(n.preventDefault(),this.dispatchEvent(fu),this._handleMouseWheel(this._customWheelEvent(n)),this.dispatchEvent(hp))}function Jy(n){this.enabled!==!1&&this._handleKeyDown(n)}function $y(n){switch(this._trackPointer(n),this._pointers.length){case 1:switch(this.touches.ONE){case ls.ROTATE:if(this.enableRotate===!1)return;this._handleTouchStartRotate(n),this.state=Te.TOUCH_ROTATE;break;case ls.PAN:if(this.enablePan===!1)return;this._handleTouchStartPan(n),this.state=Te.TOUCH_PAN;break;default:this.state=Te.NONE}break;case 2:switch(this.touches.TWO){case ls.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(n),this.state=Te.TOUCH_DOLLY_PAN;break;case ls.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(n),this.state=Te.TOUCH_DOLLY_ROTATE;break;default:this.state=Te.NONE}break;default:this.state=Te.NONE}this.state!==Te.NONE&&this.dispatchEvent(fu)}function Ky(n){switch(this._trackPointer(n),this.state){case Te.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(n),this.update();break;case Te.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(n),this.update();break;case Te.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(n),this.update();break;case Te.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(n),this.update();break;default:this.state=Te.NONE}}function jy(n){this.enabled!==!1&&n.preventDefault()}function Qy(n){n.key==="Control"&&(this._controlActive=!0,this.domElement.getRootNode().addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function tv(n){n.key==="Control"&&(this._controlActive=!1,this.domElement.getRootNode().removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}var pu=n=>["space-points","ellipsoid","line-plane","point-projection"].includes(n);function up(n){let t=n,e=t.kind,i=14806692,s=12900275,r=document.createElement("div");r.className="scene-live-label",t.host.append(r);let o=(a,l=.055)=>{let c=t.mesh(new Fe(l,14,10),i,1);return c.position.set(...a),c};if(e==="space-points"){let a=[-1.5,-.9,-.8],l=[1.5,1.05,.9];o(a),o(l),t.line([a,l],i,1),t.line([a,[l[0],a[1],a[2]],[l[0],l[1],a[2]],l],s,.5,!0);let c=o(a,.09);for(let h=0;h<3;h++){let d=[...a];d[h]+=3.3,t.line([a,d],s,.2)}t.updates.push(h=>{let d=.5+.43*Math.sin(h*.38);c.position.set(...a.map((u,f)=>(1-d)*u+d*l[f])),r.textContent="AP : PB = "+d.toFixed(2)+" : "+(1-d).toFixed(2)})}else if(e==="ellipsoid"){let h=t.mesh(new Fe(1,56,36),7445365,.28);h.scale.set(2,1.6,1.6);let d=new _n(new Fn(new Fe(1,24,16)),new Ze({color:s,transparent:!0,opacity:.15}));d.scale.copy(h.scale),t.group.add(d),o([-1.2,0,0]),o([1.2,0,0]);let u=o([2,0,0],.075),f=t.line([[-1.2,0,0],[2,0,0]],i,.9),p=t.line([[1.2,0,0],[2,0,0]],i,.9),x=t.line([[0,0,0],[0,0,0]],s,.7);t.updates.push(g=>{let m=g*.25+.5,E=g*.15+.5,C=[2*Math.cos(m),1.6*Math.sin(m)*Math.cos(E),1.6*Math.sin(m)*Math.sin(E)];u.position.set(...C),t.updateLine(f,[[-1.2,0,0],C]),t.updateLine(p,[[1.2,0,0],C]);let M=[];for(let w=0;w<=128;w++){let v=w/128*2*Math.PI;M.push([2*Math.cos(v),1.6*Math.sin(v)*Math.cos(E),1.6*Math.sin(v)*Math.sin(E)])}t.updateLine(x,M),r.textContent="\uB450 \uCD08\uC810\uC744 \uD3EC\uD568\uD558\uB294 \uB2E8\uBA74 \xB7 PF\u2081 + PF\u2082 = 4"})}else if(e==="line-plane"){let a=t.mesh(new Ue(4.2,3.1),9414526,.23);a.rotation.x=-Math.PI/2;let l=t.line([[-2,1,0],[2,-1,0]],i,1),c=o([0,1,0]);t.group.add(new si(new N(0,1,0),new N(0,0,0),1.5,s,.18,.08)),t.updates.push(h=>{let d=Math.floor(h/5)%3,u=d===2?0:1,f=d===0?-.7:0,p=[-2,u-2*f,-.5],x=[2,u+2*f,.5];t.updateLine(l,[p,x]),c.position.set(0,u,0),r.textContent=["\uAD50\uCC28 \xB7 v\xB7n \u2260 0","\uD3C9\uD589 \xB7 v\xB7n = 0, P\uB294 \uD3C9\uBA74 \uBC16","\uD3EC\uD568 \xB7 v\xB7n = 0, P\uB294 \uD3C9\uBA74 \uC704"][d]})}else if(e==="point-projection"){let a=t.mesh(new Ue(4.2,3.1),9414526,.23);a.rotation.x=-Math.PI/2;let l=[-.8,.9,.3],c=[.8,-.9,.3],h=o(l),d=o(c),u=o([0,0,0],.08),f=o([0,0,0],.08),p=[t.line([l,l],s,.6,!0),t.line([c,c],s,.6,!0)];t.line([l,c],s,.3),t.updates.push(x=>{let g=-Math.atan2(1.6,1.8)+.65*Math.sin(x*.25),m=new N(Math.sin(g),Math.cos(g),0);a.quaternion.setFromUnitVectors(new N(0,0,1),m),[l,c].forEach((E,C)=>{let M=new N(...E),w=M.clone().addScaledVector(m,-M.dot(m));(C?f:u).position.copy(w),t.updateLine(p[C],[E,w.toArray()])}),r.textContent="\uCC28\uBCA1\uD130\uAC00 \uAD00\uCC30 \uBC29\uD5A5\uACFC \uD3C9\uD589\uD558\uBA74 \uC815\uC0AC\uC601\uC774 \uACB9\uCE69\uB2C8\uB2E4"})}}function dp(n){let e={riemann:'<path d="M65 215 H295 M75 215 V70"/><path d="M80 215V206H120V179H160V134H200V71H240V215" opacity=".4"/><path d="M80 215 Q160 215 240 71" stroke-width="2"/>',"signed-area":'<path d="M60 138H300 M180 38V230" opacity=".3"/><path d="M80 205L280 71"/><path d="M80 205V138H180Z M180 138H280V71Z" fill="currentColor" fill-opacity=".13"/>',parabola:'<path d="M65 55 Q180 320 295 55"/><path d="M65 222H295" opacity=".5"/><circle cx="180" cy="141" r="4" fill="currentColor"/><path d="M180 141L255 156V222" stroke-dasharray="4 4"/>',rolle:'<path d="M55 80H305 M75 133H285 M100 185H260" opacity=".3"/>'+[55,115,180,235,305].map(i=>'<circle cx="'+i+'" cy="80" r="4"/>').join("")+[85,145,210,275].map(i=>'<circle cx="'+i+'" cy="133" r="4"/>').join("")+[115,180,245].map(i=>'<circle cx="'+i+'" cy="185" r="4"/>').join(""),ellipsoid:'<ellipse cx="180" cy="135" rx="123" ry="78"/><ellipse cx="180" cy="135" rx="123" ry="30" opacity=".5"/><ellipse cx="180" cy="135" rx="45" ry="78" opacity=".3"/><path d="M105 135L205 60L255 135"/><circle cx="105" cy="135" r="3"/><circle cx="255" cy="135" r="3"/>',rotation:'<path d="M55 176H305 M180 50V231" opacity=".3"/><path d="M75 230L285 57 M98 54L274 235" stroke-dasharray="4 4" opacity=".55"/><path d="M80 68Q180 300 280 68" stroke-width="2"/>',compound:'<path d="M60 218H305 M70 218V43" opacity=".3"/><path d="M90 65Q120 179 292 198" stroke-width="2"/><path d="M90 55Q120 173 292 195" stroke-dasharray="5 5" opacity=".6"/>',"tangent-conic":'<ellipse cx="180" cy="135" rx="104" ry="67"/><path d="M284 40V232"/><circle cx="284" cy="135" r="4" fill="currentColor"/>',restore:'<path d="M70 195C150 20 200 247 292 62 M70 218C150 43 200 270 292 85 M70 172C150 -3 200 224 292 39" opacity=".7"/>',"restore-quadratic":'<path d="M65 65Q180 280 295 65 M65 100Q180 315 295 100 M65 30Q180 245 295 30" opacity=".7"/>',model:'<path d="M65 215H300 M80 215V48" opacity=".3"/><path d="M85 210L285 60 M85 210Q250 195 285 60 M85 210C175 210 175 60 285 60" opacity=".7"/>',curvature:'<path d="M70 222C150 222 206 50 290 50" stroke-width="2"/><path d="M100 228L260 45" stroke-dasharray="5 5" opacity=".5"/><circle cx="180" cy="137" r="5"/>',ratio:'<path d="M62 200C128 -40 205 300 298 60"/><path d="M114 222H245 M114 215V229 M180 215V229 M245 215V229" opacity=".5"/><circle cx="114" cy="105" r="4"/><circle cx="180" cy="135" r="4"/><circle cx="245" cy="165" r="4"/>',chain:'<path d="M58 55Q133 300 208 55"/><path d="M165 220C220 220 240 55 299 55"/><circle cx="133" cy="178" r="4"/><circle cx="233" cy="135" r="4"/>',"tangent-count":'<path d="M63 213C123 -15 213 285 300 52"/><path d="M55 180L300 80 M68 230L285 36 M60 108L300 158" opacity=".5"/><circle cx="207" cy="118" r="5" fill="currentColor"/>',"mean-value":'<path d="M70 195Q180 225 285 63"/><path d="M70 195L285 63 M95 230L280 116" opacity=".6"/>',"space-points":'<path d="M78 196L180 155L280 72 M78 196H280V72 M180 155V44 M180 155L285 222" opacity=".65"/><circle cx="78" cy="196" r="5"/><circle cx="280" cy="72" r="5"/><circle cx="180" cy="155" r="5" fill="currentColor"/>',"line-plane":'<path d="M55 175L214 113L305 164L145 225Z" opacity=".4"/><path d="M91 70L268 208 M180 166V45"/><circle cx="180" cy="141" r="5"/>',"point-projection":'<path d="M60 191L214 132L302 181L146 240Z" opacity=".4"/><path d="M110 70L170 186 M205 55L215 167" stroke-dasharray="4 4"/><circle cx="110" cy="70" r="5"/><circle cx="205" cy="55" r="5"/><circle cx="170" cy="186" r="3"/><circle cx="215" cy="167" r="3"/>'}[n];return e?'<svg viewBox="0 0 360 270" aria-hidden="true" focusable="false"><g fill="none" stroke="currentColor" stroke-width="1.4">'+e+"</g></svg>":null}function fp({kind:n,t,phase:e,c:i,path:s,dot:r,green:o,pale:a}){if(!["riemann","signed-area","parabola","rolle","restore","restore-quadratic","ratio","mean-value","chain","model","compound","tangent-conic","tangent-count","rotation","curvature"].includes(n))return!1;let c=(u,f=-200,p=122)=>{i.font="12px sans-serif",i.fillStyle=a,i.fillText(u,f,p)},h=(u,f=-2,p=2,x=85,g=35,m=o,E=2)=>{let C=[];for(let M=f;M<=p+1e-4;M+=(p-f)/150)C.push([M*x,35-u(M)*g]);s(C,m,E)},d=(u,f=a)=>{i.setLineDash([5,5]),s(u,f,1),i.setLineDash([])};if(n==="riemann"){let u=4+Math.floor(18*(.5+.5*Math.sin(t*.28))),f=300/u,p=35,x=-150;for(let m=0;m<u;m++){let E=(m/u)**2*185,C=((m+1)/u)**2*185;i.fillStyle=o+"15",i.fillRect(x+m*f,p-C,f,C),i.strokeStyle=a+"55",i.strokeRect(x+m*f,p-C,f,C),i.strokeStyle=o,i.strokeRect(x+m*f,p-E,f,E)}let g=[];for(let m=0;m<=120;m++){let E=m/120;g.push([x+300*E,p-185*E*E])}s(g),s([[x,p],[150,p]],a,1),c("n = "+u+"   L = "+((u-1)*(2*u-1)/(6*u*u)).toFixed(4)+"   R = "+((u+1)*(2*u+1)/(6*u*u)).toFixed(4),-190,104),c("f(x)=x\xB2 \xB7 [0,1] \xB7 \u222Bf = 1/3",-190,128)}else if(n==="signed-area"){let u=-2+4*(.5+.5*Math.sin(t*.25));for(let f=-2;f<u;f+=.025){let p=f*55;i.fillStyle=f<0?a+"2b":o+"44",i.fillRect(f*85,Math.min(35,35-p),2.5,Math.abs(p))}h(f=>f,-2,2,85,55),r(u*85,35-u*55,5),c("\u222B f = "+((u*u-4)/2).toFixed(2)+"   \u222B |f| = "+(u<0?(4-u*u)/2:2+u*u/2).toFixed(2)),c("f(x)=x \xB7 \uC2DC\uC791\uC810 \u22122",-200,144)}else if(n==="parabola"){let u=.6+.55*(.5+.5*Math.sin(t*.3)),f=1.5*Math.sin(t*.3+.7),p=f*f/(4*u),x=62,g=[0,35-u*x],m=[f*x,35-p*x],E=[f*x,35+u*x];h(C=>C*C/(4*u),-2.4,2.4,x,x),d([[-200,35+u*x],[200,35+u*x]]),s([g,m,E],a,1.2),r(...g,5),r(...m,5),c("F",g[0]+10,g[1]),c("d(P,F) = d(P,\uC900\uC120)",-200,-145)}else if(n==="rolle"){let u=[-2,-1,0,1,2],f=[-Math.sqrt((15+Math.sqrt(145))/10),-Math.sqrt((15-Math.sqrt(145))/10),Math.sqrt((15-Math.sqrt(145))/10),Math.sqrt((15+Math.sqrt(145))/10)];h(x=>x**5-5*x**3+4*x,-2.12,2.12,85,15),u.forEach(x=>r(x*85,35,4));let p=.45+.4*Math.sin(t*.3);for(let x=0;x<4;x++)s([[u[x]*85,77],[u[x+1]*85,77]],a+"60",1),r(f[x]*85,95,5,o+Math.round(p*255).toString(16).padStart(2,"0"));c("f\uC758 \uADFC 5\uAC1C \u2192 f\u2032\uC758 \uADFC 4\uAC1C",-185,132)}else if(n==="restore"||n==="restore-quadratic"){let u=n==="restore"?p=>p**3/3-p:p=>p*p;[-1.2,0,1.2].forEach((p,x)=>h(g=>u(g)+p,-1.8,1.8,86,32,x===1?o:a+"55",x===1?2:1));let f=.9*Math.sin(t*.3);h(p=>u(p)+f,-1.8,1.8,86,32,o+"b0",2),r(86,35-(u(1)+f)*32,5),c(n==="restore"?"\uAC19\uC740 \uB3C4\uD568\uC218 x\xB2\u22121, \uB2EC\uB77C\uC9C0\uB294 \uC801\uBD84\uC0C1\uC218 C":"\uAC19\uC740 \uB3C4\uD568\uC218 2x, \uB2EC\uB77C\uC9C0\uB294 \uC801\uBD84\uC0C1\uC218 C",-205,132)}else if(n==="ratio")h(u=>u**3-3*u,-1.85,1.85,85,28),[[-1,2],[0,0],[1,-2]].forEach(u=>r(u[0]*85,35-u[1]*28,5)),s([[-85,105],[0,105],[85,105]],a,1),[-85,0,85].forEach(u=>s([[u,100],[u,110]],a,1)),c("1",-46,126),c("1",39,126),c("\uBCC0\uACE1\uC810\uC744 \uAE30\uC900\uC73C\uB85C \uB098\uB208 \uC218\uD3C9 \uAC70\uB9AC",-180,-138);else if(n==="mean-value"){h(f=>f*f,-1.5,2.1,80,35),s([[-80,0],[160,-105]],a,1.5);let u=.5+.8*Math.sin(t*.27);s([[-120,35-(u*u+2*u*(-1.5-u))*35],[172,35-(u*u+2*u*(2.15-u))*35]],o,1.3),r(u*80,35-u*u*35,5),c("\uD3C9\uADE0 \uAE30\uC6B8\uAE30 1 = f\u2032(1/2)",-185,130),c("f(x)=x\xB2, \uAD6C\uAC04 [\u22121,2]",-185,151)}else if(n==="chain"){let u=Math.floor(t/6)%3,f=[p=>p*p,p=>p**3,p=>p**4][u];h(f,-1.5,1.5,90,32),r(0,35,5),c(["x\xB2 \xB7 \uB3C4\uD568\uC218 \uBD80\uD638 \u2212 \u2192 + \xB7 \uADF9\uC18C","x\xB3 \xB7 \uB3C4\uD568\uC218 \uBD80\uD638 + \u2192 + \xB7 \uADF9\uAC12 \uC544\uB2D8","x\u2074 \xB7 \uB450 \uC870\uAC74\uC774 \uACB9\uCCD0\uB3C4 \uBD80\uD638 \uD655\uC778"][u],-205,130),c("h\u2032(0)=0 \uB2E4\uC74C\uC5D0, \uC591\uCABD \uBD80\uD638\uB97C \uC77D\uC2B5\uB2C8\uB2E4.",-205,-140)}else if(n==="model")h(u=>1+.3*u,-2,2,80,55,a,1.4),h(u=>Math.exp(.5*u),-2,2,80,55,o,1.7),h(u=>2/(1+Math.exp(-u)),-2,2,80,55,a,1.4),c("\uC77C\uCC28 \xB7 \uC9C0\uC218 \xB7 \uB85C\uC9C0\uC2A4\uD2F1 \uD6C4\uBCF4 \uD568\uC218",-200,120),c("\uC804\uC2DC\uC6A9 \uD568\uC218 \uB3C4\uD574 \xB7 \uD559\uC0DD \uC2E4\uCE21 \uC790\uB8CC \uC544\uB2D8",-200,144);else if(n==="compound"){let u=E=>-180+(E-1)/14*360,f=E=>35-E*2.6,p=E=>Math.log(2)/Math.log(1+E/100),x=[],g=[];for(let E=1.5;E<=15;E+=.07)x.push([u(E),f(p(E))]),g.push([u(E),f(72/E)]);s(x),d(g);let m=3+9*(.5+.5*Math.sin(t*.24));r(u(m),f(p(m)),5),c("r="+m.toFixed(1)+"%  \uC815\uD655\uAC12 "+p(m).toFixed(2)+"\uB144  72/r "+(72/m).toFixed(2)+"\uB144",-205,118),c("\uC5F0 1\uD68C \uBCF5\uB9AC \xB7 \uC77C\uC815\uD55C \uC774\uC728\uC758 \uC218\uD559 \uBAA8\uD615",-205,142)}else if(n==="tangent-conic"){let p=t*.23,x=[];for(let E=0;E<=160;E++){let C=E/160*Math.PI*2;x.push([2*Math.cos(C)*80,35-1*Math.sin(C)*80])}s(x);let g=[2*Math.cos(p),1*Math.sin(p)],m=[-2*Math.sin(p),1*Math.cos(p)];s([[80*(g[0]-2*m[0]),35-80*(g[1]-2*m[1])],[80*(g[0]+2*m[0]),35-80*(g[1]+2*m[1])]],a,1.2),r(g[0]*80,35-g[1]*80,5),c("\uC218\uC9C1\uC778 \uACBD\uC6B0\uC5D0\uB3C4 \uC811\uC810\uACFC \uC911\uADFC\uC740 \uB0A8\uC2B5\uB2C8\uB2E4.",-205,145)}else if(n==="tangent-count"){let u=[-.12,0,.3,1,1.12][Math.floor(t/5)%5],f=g=>2*g**3-3*g*g+u,p=[],x=g=>{p.some(m=>Math.abs(m-g)<1e-5)||p.push(g)};for(let g of[0,1])Math.abs(f(g))<1e-8&&x(g);for(let[g,m]of[[-3,0],[0,1],[1,3]]){let E=g,C=m;if(!(f(E)*f(C)>=0)){for(let M=0;M<45;M++){let w=(E+C)/2;f(E)*f(w)<=0?C=w:E=w}x((E+C)/2)}}h(g=>g**3,-1.3,1.75,85,28),p.forEach(g=>{s([[-110,35-(3*g*g*(-110/85)-2*g**3)*28],[180,35-(3*g*g*(180/85)-2*g**3)*28]],a+"8f",1),r(g*85,35-g**3*28,4)}),r(85,35-u*28,6),c("P(1, "+u+") \xB7 \uC11C\uB85C \uB2E4\uB978 \uC811\uC120 "+p.length+"\uAC1C",-205,136)}else if(n==="rotation"){h(x=>x*x,-1.55,1.55,60,60);let u=.7*Math.sin(t*.22),f=Math.cos(u),p=Math.sin(u);s([[-200*f,35+200*p],[200*f,35-200*p]],o,1.2),s([[200*p,35+200*f],[-200*p,35-200*f]],a,1.2),r(60,-25,5),c("\uC810\uC740 \uADF8\uB300\uB85C \xB7 \uC88C\uD45C\uCD95\uC774 \uD68C\uC804\uD569\uB2C8\uB2E4.",-205,130),c("XY\uD56D\uC758 \uACC4\uC218 = \u2212a sin(2\u03B8)",-205,151)}else if(n==="curvature"){h(p=>p**3,-1.8,1.8,85,26);let u=1.4*Math.sin(t*.3),f=3*u*u;s([[-180,35-(u**3+f*(-180/85-u))*26],[180,35-(u**3+f*(180/85-u))*26]],a,1.1),r(u*85,35-u**3*26,5),c("f(x)=x\xB3 \xB7 f\u2032\u2032(x)=6x \xB7 "+(u<0?"\uAE30\uC6B8\uAE30\uAC00 \uC791\uC544\uC9D1\uB2C8\uB2E4":"\uAE30\uC6B8\uAE30\uAC00 \uCEE4\uC9D1\uB2C8\uB2E4"),-205,136)}return!0}var kn=14806692,ci=14082502,pp=6391659,mp=n=>pu(n)||["hero","sphere-slice","sphere-vector","distance","slices","hypersphere","projection","vectors","planes","cone","surface"].includes(n);function Io(n,t=0){let e=dp(n);if(e)return e;let i=(a,l="")=>'<path d="'+a+'" fill="none" stroke="currentColor" stroke-width="1.3" '+l+"/>",s=(a,l,c,h,d="")=>'<line x1="'+a+'" y1="'+l+'" x2="'+c+'" y2="'+h+'" stroke="currentColor" stroke-width="1.1" '+d+"/>",r=(a,l,c,h="")=>'<circle cx="'+a+'" cy="'+l+'" r="'+c+'" fill="none" stroke="currentColor" stroke-width="1.1" '+h+"/>",o="";if(["sphere-slice","sphere-vector","slices","hypersphere","hero"].includes(n)){if(o+=r(180,136,83),o+='<ellipse cx="180" cy="136" rx="33" ry="83" fill="none" stroke="currentColor" opacity=".4"/>',o+='<ellipse cx="180" cy="136" rx="83" ry="27" fill="none" stroke="currentColor" opacity=".5"/>',o+='<ellipse cx="180" cy="113" rx="79" ry="24" fill="currentColor" opacity=".12"/>',o+='<ellipse cx="180" cy="113" rx="79" ry="24" fill="none" stroke="currentColor" stroke-width="2"/>',o+=s(180,136,180,113,'stroke-dasharray="3 4"'),o+=s(180,136,250,123),o+=r(180,136,3,'fill="currentColor"'),n==="slices")for(let a=80;a<205;a+=17){let l=Math.sqrt(Math.max(0,6889-(a-136)**2));o+='<ellipse cx="180" cy="'+a+'" rx="'+l+'" ry="'+l*.25+'" fill="none" stroke="currentColor" opacity=".45"/>'}n==="sphere-vector"&&(o+=s(110,190,237,76,'stroke-width="2"'))}else if(["distance","planes","projection"].includes(n))o+=i("M 63 167 L 214 108 L 302 158 L 151 223 Z",'fill="currentColor" fill-opacity=".06"'),o+=s(175,65,175,172,'stroke-dasharray="4 5"'),o+=s(175,65,260,180),o+=s(175,172,260,180,'opacity=".5"'),o+=i("M175 163 L184 165 L184 174",'opacity=".65"'),o+=r(175,65,4,'fill="currentColor"'),o+=r(175,172,3,'fill="currentColor"'),n==="projection"&&(o+=i("M105 71 L230 84 L247 143 L125 131 Z",'fill="currentColor" fill-opacity=".08"'));else if(n==="cone")o+=i("M105 211 L180 56 L255 211"),o+='<ellipse cx="180" cy="211" rx="75" ry="20" fill="none" stroke="currentColor" opacity=".6"/>',o+=i("M180 56 L129 159 M180 56 L231 159",'opacity=".25"'),o+='<ellipse cx="180" cy="159" rx="51" ry="16" transform="rotate(-18 180 159)" fill="currentColor" fill-opacity=".12" stroke="currentColor" stroke-width="2"/>';else if(n==="vectors")o+=s(85,198,282,198,'opacity=".22"'),o+=s(85,198,251,198,'stroke-width="2.5"'),o+=s(85,198,226,88,'stroke-width="2"'),o+=i("M235 191 L251 198 L235 205"),o+=i("M212 91 L226 88 L222 103"),o+=s(226,88,226,198,'stroke-dasharray="3 5" opacity=".5"'),o+=i("M133 198 Q133 180 121 171",'opacity=".6"');else if(n==="conics")o+='<ellipse cx="180" cy="137" rx="116" ry="70" transform="rotate(-14 180 137)" fill="none" stroke="currentColor" stroke-width="1.6"/>',o+=r(110,155,3,'fill="currentColor"'),o+=r(249,120,3,'fill="currentColor"'),o+=i("M110 155 L203 70 L249 120",'opacity=".4"');else if(n==="reflection")o+=i("M74 73 Q180 300 286 73",'stroke-width="2"'),o+=s(96,45,96,110,'opacity=".6"'),o+=s(96,110,180,157,'stroke-width="1.5"'),o+=s(245,45,245,139,'opacity=".6"'),o+=s(245,139,180,157,'stroke-width="1.5"'),o+=r(180,157,4,'fill="currentColor"'),o+=s(180,57,180,227,'stroke-dasharray="3 5" opacity=".2"');else if(n==="surface"){for(let a=-3;a<=3;a++){let l="";for(let c=-3;c<=3;c+=.25){let h=180+c*26+a*14,d=150+a*16-(c*c-a*a)*4;l+=(l?" L":"M")+h+" "+d}o+=i(l,'opacity=".45"')}o+=i("M78 179 Q180 83 282 179",'stroke-width="2"')}else o+=s(49,207,309,207,'opacity=".23"'),o+=s(132,43,132,235,'opacity=".23"'),n==="area"&&(o+=i("M78 207 C113 100 130 80 170 160 S240 258 284 68 L284 207 Z",'fill="currentColor" fill-opacity=".11"')),["tangents","derivative","area","antiderivative","asymptote"].includes(n)?o+=i("M61 214 C109 38 147 111 179 164 S251 252 298 54",'stroke-width="1.7"'):o+=i("M57 194 Q183 240 291 52",'stroke-width="1.7"'),n==="newton"?o+=i("M291 52 L219 207 L219 157 L180 207 L180 192 L167 207",'opacity=".65"'):n==="asymptote"?o+=s(71,222,291,61,'stroke-dasharray="4 5" opacity=".5"'):n==="join"?o+=i("M180 171 L296 104",'stroke-width="1.6"'):n==="zoom"?(o+=r(201,151,49,'opacity=".6"'),o+=s(235,187,270,224,'opacity=".6"'),o+=s(161,180,245,111,'stroke-dasharray="4 5" opacity=".5"')):o+=s(104,235,281,75,'opacity=".6"'),o+=r(206,151,4,'fill="currentColor"');return'<svg viewBox="0 0 360 270" aria-hidden="true" focusable="false">'+o+"</svg>"}var Ir=class{constructor(t,e,i={}){this.host=t,this.kind=e,this.options=i,this.enabled=i.motion!==!1,this.time=0,this.phase=0,this.visible=!0,this.destroyed=!1,this.raf=0;try{mp(e)?(this.init3D(),this.applyPalette()):this.init2D()}catch(s){this.controls?.dispose(),this.renderer?.dispose(),this.renderer?.forceContextLoss(),this.renderer=null,this.scene=null,this.controls=null,t.replaceChildren(),mp(e)?(t.innerHTML=Io(e),t.dataset.renderer="svg-fallback",this.staticFallback=!0,this.enabled=!1):(this.init2D(),t.dataset.renderer="canvas2d-fallback"),console.warn("\uC804\uC2DC \uB3C4\uD574\uB97C \uB300\uCCB4 \uD654\uBA74\uC73C\uB85C \uD45C\uC2DC\uD569\uB2C8\uB2E4.",s.message)}this.resizeObserver=new ResizeObserver(()=>{this.resize(),this.draw()}),this.resizeObserver.observe(t),this.visibility=new IntersectionObserver(s=>{this.visible=s[0].isIntersecting,this.visible&&this.enabled&&this.start()},{rootMargin:"150px"}),this.visibility.observe(t),this.resize(),this.draw(),this.enabled&&this.start()}init3D(){this.scene=new ro,this.camera=new ln(34,1,.1,60),this.camera.position.set(5,3.5,6.5),this.camera.lookAt(0,0,0),this.renderer=new nc({alpha:!0,antialias:!0,powerPreference:"low-power"}),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,window.innerWidth<700?1.25:1.6)),this.renderer.setClearColor(0,0),this.renderer.outputColorSpace=mn,this.renderer.toneMapping=yo,this.renderer.toneMappingExposure=1.2,this.host.append(this.renderer.domElement),this.host.dataset.renderer="webgl",this.scene.add(new mo(15330805,1779252,2.5));let t=new vr(16777215,3.1);t.position.set(-3,6,4),this.scene.add(t);let e=new vr(12110052,2);e.position.set(5,-2,-3),this.scene.add(e),this.group=new Fi,this.scene.add(this.group),this.controls=new oc(this.camera,this.renderer.domElement),this.controls.enablePan=!1,this.controls.enableZoom=!1,this.controls.enableDamping=!0,this.controls.dampingFactor=.065,this.controls.maxPolarAngle=Math.PI*.75,this.controls.minPolarAngle=.3,this.controls.addEventListener("change",()=>{this.raf||this.renderer.render(this.scene,this.camera)}),this.renderer.domElement.style.touchAction="pan-y",this.updates=[],["hero","sphere-slice","sphere-vector","slices","hypersphere"].includes(this.kind)?this.sphere():["distance","planes"].includes(this.kind)?this.distance():this.kind==="projection"?this.projection():this.kind==="vectors"?this.vectors():this.kind==="cone"?this.cone():this.kind==="surface"?this.surface():pu(this.kind)&&up(this)}applyPalette(){if(!Number.isFinite(this.options.hue))return;let t={};this.scene.traverse(e=>{for(let i of Array.isArray(e.material)?e.material:e.material?[e.material]:[])i.color&&(i.color.getHSL(t),t.s>.08&&i.color.setHSL(this.options.hue,Math.min(.62,Math.max(.28,t.s)),t.l))})}material(t=pp,e=.75){return new ho({color:t,roughness:.33,metalness:.12,transparent:e<1,opacity:e,side:Zn,depthWrite:e>=1,clearcoat:.7})}mesh(t,e=pp,i=.75){let s=new gn(t,this.material(e,i));return this.group.add(s),s}line(t,e=kn,i=.8,s=!1){let r=new Xe().setFromPoints(t.map(l=>new N(...l))),o=s?new uo({color:e,transparent:!0,opacity:i,dashSize:.07,gapSize:.05}):new Ze({color:e,transparent:!0,opacity:i}),a=new Cs(r,o);return s&&a.computeLineDistances(),this.group.add(a),a}updateLine(t,e){t.geometry.setFromPoints(e.map(i=>new N(...i))),t.material.isLineDashedMaterial&&t.computeLineDistances()}sphere(){let e=this.mesh(new Fe(1.65,56,40),6129773,this.kind==="hero"?.38:.28),i=new _n(new Fn(new Fe(1.65,24,16)),new Ze({color:12768929,transparent:!0,opacity:.14}));this.group.add(i);let s=this.mesh(new Ue(4.5,3.4),11257477,.12);s.rotation.x=-Math.PI/2;let r=this.mesh(new is(1,.018,8,128),kn,.95);r.rotation.x=Math.PI/2;let o=this.line([[0,0,0],[1.4,.5,0]],kn,.7),a=this.line([[0,0,0],[0,.5,0]],ci,.6,!0),l=this.mesh(new is(1.65,.006,4,120),ci,.35);if(l.rotation.x=Math.PI/2,this.group.rotation.z=-.13,this.kind==="slices"){e.visible=!1,s.visible=!1,r.visible=!1,o.visible=!1,a.visible=!1;for(let h=-1.45;h<1.5;h+=.24){let d=Math.sqrt(2.7224999999999997-h*h),u=this.mesh(new ns(d,d,.027,64),9613941,.23);u.position.y=h}}let c=this.mesh(new Fe(.045,14,10),kn,1);this.updates.push(h=>{let d=.72*Math.sin(h*.38+this.phase*.8),u=Math.sqrt(1.65*1.65-d*d);if(s.position.y=d,r.position.y=d,r.scale.set(u,u,1),this.updateLine(o,[[0,0,0],[u,d,0]]),this.updateLine(a,[[0,0,0],[0,d,0]]),c.position.set(u,d,0),i.rotation.y=h*.045,this.group.rotation.y=.15+Math.sin(h*.09)*.14,this.kind==="hypersphere"){let f=.85*Math.sin(h*.4),p=Math.sqrt(1-f*f);e.scale.setScalar(p),i.scale.setScalar(p),r.visible=!1,s.visible=!1,o.visible=!1,a.visible=!1,l.scale.setScalar(p),c.visible=!1}if(this.kind==="sphere-vector"){s.visible=!1,r.visible=!1,a.visible=!1;let f=h*.25,p=[1.65*Math.cos(f),1.65*Math.sin(f),0];this.updateLine(o,[[0,0,0],p]),c.position.set(...p)}})}distance(){let t=this.mesh(new Ue(4.1,3.3),9414526,.25);t.rotation.x=-Math.PI/2,t.position.y=-.75;let e=this.line([[-2.05,-.75,-1.65],[2.05,-.75,-1.65],[2.05,-.75,1.65],[-2.05,-.75,1.65],[-2.05,-.75,-1.65]],ci,.35),i=[.2,1.55,.1],s=[.2,-.75,.1];this.line([i,s],kn,.95,!0),this.mesh(new Fe(.065,16,12),kn,1).position.set(...i),this.mesh(new Fe(.035,12,8),ci,1).position.set(...s);let a=this.mesh(new Fe(.05,12,8),13687998,1),l=this.line([i,[1,-.75,1]],ci,.6),c=this.line([s,[1,-.75,1]],ci,.4);this.line([[.2,-.56,.1],[.4,-.56,.1],[.4,-.75,.1]],kn,.55),this.updates.push(h=>{let d=[.2+1.3*Math.cos(h*.4),-.75,.1+.9*Math.sin(h*.4)];a.position.set(...d),this.updateLine(l,[i,d]),this.updateLine(c,[s,d]),this.group.rotation.y=-.25+Math.sin(h*.1)*.12})}projection(){let t=this.mesh(new Ue(3.2,2.1),12111e3,.25);t.rotation.x=-Math.PI/2,t.position.y=-1;let e=this.mesh(new Ue(3.2,2.1),8824953,.5);e.position.y=.7;let i=new _n(new Ps(e.geometry),new Ze({color:kn,transparent:!0,opacity:.85}));e.add(i);let s=Array.from({length:4},()=>this.line([[0,0,0],[0,-1,0]],ci,.4,!0));this.updates.push(r=>{let o=.35+.7*(.5+.5*Math.sin(r*.35));e.rotation.x=-Math.PI/2+o,t.scale.y=Math.cos(o),[[-1.6,-1.05],[1.6,-1.05],[1.6,1.05],[-1.6,1.05]].forEach((l,c)=>{let h=[l[0],.7+l[1]*Math.sin(o),-l[1]*Math.cos(o)];this.updateLine(s[c],[h,[h[0],-1,h[2]]])}),this.group.rotation.y=-.15})}vectors(){let t=new N(-1.4,-.6,0);this.group.add(new si(new N(1,0,0),t,2.8,ci,.23,.12));let e=new si(new N(.6,1,0).normalize(),t,2.5,kn,.23,.12);this.group.add(e);let i=this.line([[0,1,0],[0,-.6,0]],ci,.5,!0),s=this.line([[-1.4,-.6,0],[0,-.6,0]],kn,.7);this.updates.push(r=>{let o=.3+2.5*(.5+.5*Math.sin(r*.35));e.setDirection(new N(Math.cos(o),Math.sin(o),0));let a=-1.4+2.5*Math.cos(o),l=-.6+2.5*Math.sin(o);this.updateLine(i,[[a,l,0],[a,-.6,0]]),this.updateLine(s,[[-1.4,-.6,0],[a,-.6,0]]),this.group.rotation.y=-.2})}cone(){let t=this.mesh(new ii(1.25,2.25,64,1,!0),7445365,.28);t.rotation.z=Math.PI,t.position.y=1.125;let e=this.mesh(new ii(1.25,2.25,64,1,!0),7445365,.22);e.position.y=-1.125;let i=new Ze({color:ci,transparent:!0,opacity:.17});for(let a of[t,e]){let l=new _n(new Fn(new ii(1.25,2.25,24,1,!0)),i);l.position.copy(a.position),l.rotation.copy(a.rotation),this.group.add(l)}let s=new Xe().setFromPoints([new N(-2,0,-2),new N(2,0,-2),new N(2,0,2),new N(-2,0,2)]);s.setIndex([0,1,2,0,2,3]),s.computeVertexNormals();let r=this.mesh(s,12899480,.12),o=[];for(let a=0;a<8;a++)o.push(this.line([[0,0,0],[0,0,0]],kn,.96));this.camera.position.set(6.8,3.5,7.8),this.controls.update(),this.updates.push(a=>{let l=.18+1.05*(.5+.5*Math.sin(a*.23)),c=Math.tan(l),h=.32,d=r.geometry.attributes.position;for(let f=0;f<d.count;f++)d.setY(f,c*d.getX(f)+h);d.needsUpdate=!0,r.geometry.computeVertexNormals();let u=[];for(let f of[1,-1]){let p=[];for(let x=0;x<=250;x++){let g=x/250*Math.PI*2,m=1.25/2.25,E=1-f*m*c*Math.cos(g),C=f*m*h/E,M=C*Math.cos(g),w=C*Math.sin(g),v=c*M+h;C>=0&&C<2&&Math.abs(v)<2.23?p.push([M,v,w]):p.length&&(u.push(p),p=[])}p.length&&u.push(p)}o.forEach((f,p)=>{f.visible=!!u[p]&&u[p].length>1,f.visible&&this.updateLine(f,u[p])})})}surface(){let t=new Ue(3.8,3.8,40,40),e=t.attributes.position;for(let a=0;a<e.count;a++){let l=e.getX(a),c=e.getY(a);e.setXYZ(a,l,.22*(l*l-c*c),c)}t.computeVertexNormals(),this.mesh(t,7773814,.5);let i=new _n(new Fn(t),new Ze({color:ci,transparent:!0,opacity:.16}));this.group.add(i);let s=this.mesh(new Ue(4,2.8),12177041,.11),r=this.line([[0,0,0],[1,1,0]],kn,1),o=this.mesh(new Fe(.055,12,8),kn,1);this.updates.push(a=>{let l=1.15*Math.sin(a*.3);s.position.z=l;let c=[];for(let d=-1.9;d<=1.91;d+=.04)c.push([d,.22*(d*d-l*l),l]);this.updateLine(r,c);let h=.8*Math.cos(a*.4);o.position.set(h,.22*(h*h-l*l),l),this.group.rotation.y=-.25})}init2D(){this.canvas=document.createElement("canvas"),this.host.append(this.canvas),this.ctx=this.canvas.getContext("2d"),this.host.dataset.renderer="canvas2d"}resize(){let t=this.host.getBoundingClientRect();if(this.width=Math.max(1,t.width),this.height=Math.max(1,t.height),this.renderer)this.renderer.setSize(this.width,this.height,!1),this.camera.aspect=this.width/this.height,this.camera.updateProjectionMatrix();else if(this.canvas){let e=Math.min(window.devicePixelRatio||1,2);this.canvas.width=this.width*e,this.canvas.height=this.height*e,this.ctx.setTransform(e,0,0,e,0,0)}}setPhase(t){this.phase=t,this.draw()}setMotion(t){this.enabled=t&&!this.staticFallback,this.controls&&(this.controls.enableDamping=t),this.enabled?this.start():(cancelAnimationFrame(this.raf),this.raf=0,this.draw())}start(){if(this.raf||this.destroyed)return;this.last=0;let t=e=>{if(this.destroyed||!this.enabled||!this.visible){this.raf=0;return}this.time+=this.last?Math.min((e-this.last)/1e3,.08):0,this.last=e,this.draw(),this.raf=requestAnimationFrame(t)};this.raf=requestAnimationFrame(t)}draw(){this.destroyed||(this.renderer?(this.updates.forEach(t=>t(this.time)),this.controls.update(),this.renderer.render(this.scene,this.camera)):this.ctx&&this.drawCanvas())}drawCanvas(){let t=this.ctx,e=this.width,i=this.height,s=Math.min(e/500,i/400),r=e*.49,o=i*.58,a=this.time,l=this.options.primary||"#ddec9d",c="#dce2ed";t.clearRect(0,0,e,i),t.save(),t.translate(r,o),t.scale(s,s),t.lineWidth=1,t.strokeStyle="#ccddbb17";for(let f=-210;f<=210;f+=35)t.beginPath(),t.moveTo(f,-180),t.lineTo(f,140),t.stroke();for(let f=-175;f<145;f+=35)t.beginPath(),t.moveTo(-220,f),t.lineTo(220,f),t.stroke();let h=(f,p=l,x=2)=>{t.beginPath(),f.forEach((g,m)=>m?t.lineTo(g[0],g[1]):t.moveTo(g[0],g[1])),t.strokeStyle=p,t.lineWidth=x,t.stroke()},d=(f,p,x=4,g=l)=>{t.beginPath(),t.arc(f,p,x,0,Math.PI*2),t.fillStyle=g,t.fill()};if(h([[-220,35],[220,35]],"#d0dfbf35",1),h([[0,-170],[0,130]],"#d0dfbf35",1),fp({kind:this.kind,t:a,phase:this.phase,c:t,path:h,dot:d,green:l,pale:c})){t.restore();return}let u=f=>this.kind==="join"?f<.8?f*f:1.6*f-.64:this.kind==="derivative"||this.kind==="tangents"||this.kind==="area"?f*f*f-1.4*f:this.kind==="antiderivative"?-Math.cos(f)*1.2:this.kind==="asymptote"?Math.sqrt(1+f*f):this.kind==="newton"?f*f-1:f*f;if(this.kind==="conics"){let f=[];for(let g=0;g<=180;g++){let m=g/180*Math.PI*2;f.push([Math.cos(m)*155,Math.sin(m)*84-12])}h(f),d(-105,-12),d(105,-12);let p=a*.25,x=[Math.cos(p)*155,Math.sin(p)*84-12];h([[-105,-12],x,[105,-12]],"#d2e1b67f",1),d(...x,5)}else if(this.kind==="reflection"){let f=[];for(let m=-2.2;m<=2.21;m+=.03)f.push([m*70,80-m*m*34]);h(f);let p=[0,80-4900/136],x=(.4+1.35*(.5+.5*Math.sin(a*.4)))*70,g=80-(x/70)**2*34;h([[x,-150],[x,g],p],"#c8db9dab",1.4),d(...p,5),d(x,g,4),t.fillStyle=c,t.font="13px sans-serif",t.fillText("F",12,p[1]+4)}else{let f=[];for(let p=-1.8;p<2.4;p+=.025)f.push([p*86,-u(p)*28+35]);if(this.kind==="area"&&(t.beginPath(),t.moveTo(-1.6*86,85),f.filter(p=>p[0]>-1.6*86&&p[0]<1.6*86).forEach(p=>t.lineTo(...p)),t.lineTo(1.6*86,85),t.closePath(),t.fillStyle="#d9eba51a",t.fill()),h(f),this.kind==="asymptote")t.setLineDash([5,6]),h([[-210,35+5880/86],[210,35-5880/86]],"#ccdcac90",1.2),h([[-210,35-5880/86],[210,35+5880/86]],"#ccdcac70",1.2),t.setLineDash([]);else if(this.kind==="newton"){let p=1.9,x=E=>E*E-1,g=E=>2*E,m=[];for(let E=0;E<4;E++){let C=p-x(p)/g(p);m.push([p*86,35-x(p)*28],[C*86,35],[C*86,35-x(C)*28]),p=C}h(m,"#b7ce927f",1),d(p*86,35,4)}else{let p=this.kind==="tangents"?.5:this.kind==="join"?.8:.65,x=.12+1.12*(.5+.5*Math.cos(a*.5+this.phase)),g=u(p),m=u(p+x),E=(u(p+.001)-u(p-.001))/.002,C=(m-g)/x,M=[[-1.7*86,35-(g+E*(-1.7-p))*28],[2.3*86,35-(g+E*(2.3-p))*28]];t.setLineDash([5,6]),h(M,"#d2e1bd75",1),t.setLineDash([]),h([[-1.7*86,35-(g+C*(-1.7-p))*28],[2.3*86,35-(g+C*(2.3-p))*28]],"#c8dc9cb0",1.4),d(p*86,35-g*28,4),d((p+x)*86,35-m*28,5),t.beginPath(),t.arc((p+x)*86,35-m*28,12,0,Math.PI*2),t.strokeStyle="#dae9ad55",t.lineWidth=1,t.stroke()}}t.restore()}dispose(){this.destroyed=!0,cancelAnimationFrame(this.raf),this.resizeObserver?.disconnect(),this.visibility?.disconnect(),this.controls?.dispose(),this.scene&&this.scene.traverse(t=>{t.geometry?.dispose(),t.material&&(Array.isArray(t.material)?t.material.forEach(e=>e.dispose()):t.material.dispose())}),this.renderer?.dispose(),this.renderer?.forceContextLoss(),this.host.replaceChildren()}};var ee=(n,t,e)=>({family:n,focus:t,beats:e.split("|")}),ev={"e-01-c":ee("riemann","\uC9C1\uC0AC\uAC01\uD615\uACFC \uACE1\uC120 \uC0AC\uC774\uC758 \uD2C8","\uACE1\uC120 \uC544\uB798, \uBE48\uD2C8\uC774 \uBCF4\uC778\uB2E4.|\uC67C\uCABD\uACFC \uC624\uB978\uCABD\uC744 \uB530\uB85C \uC7A1\uB294\uB2E4.|\uB124 \uCE78\uC744, \uC5F4\uC5EC\uC12F \uCE78\uC73C\uB85C.|\uD45C\uBCF8\uC810\uC744 \uBC14\uAFB8\uBA74 \uB2F5\uB3C4 \uB2EC\uB77C\uC9C4\uB2E4.|\uB450 \uD569 \uC0AC\uC774\uB85C, \uCC38\uAC12\uC774 \uBAA8\uC778\uB2E4.|\uC798\uAC8C \uB098\uB208 \uD569\uC774 \uC801\uBD84\uC73C\uB85C.|\uC774\uC81C \uBD84\uD560 \uC218\uB97C \uC9C1\uC811 \uBC14\uAFD4 \uBCF4\uC790."),"a-06-c":ee("volume","\uB2E8\uBA74\uC758 \uD569\uACFC \uACE1\uBA74\uC758 \uB760","\uACF5\uC2DD\uC744, \uC587\uAC8C \uC798\uB77C \uBCF8\uB2E4.|\uC6D0\uD310 \uD558\uB098\uC758 \uB113\uC774\uB97C \uAD6C\uD55C\uB2E4.|\uD769\uC5B4\uC9C4 \uB2E8\uBA74\uC774 \uAD6C\uB97C \uCC44\uC6B4\uB2E4.|\uC6D0\uD310\uACFC \uD45C\uBA74\uC758 \uB760\uB294 \uB2E4\uB974\uB2E4.|\uB2E8\uBA74\uC801\uC774 \uB192\uC774\uC758 \uD568\uC218\uAC00 \uB41C\uB2E4.|\uD55C \uC7A5\uC529 \uC313\uC544, \uC785\uCCB4\uB97C \uC77D\uB2E4.|\uB2E4\uB978 \uC785\uCCB4\uC5D0\uB3C4 \uAC19\uC740 \uC9C8\uBB38\uC744."),"e-02-c":ee("signed","\uBD80\uD638 \uC788\uB294 \uB204\uC801\uACFC \uC804\uCCB4 \uB113\uC774","\uB113\uC774\uB294 \uB0A8\uC558\uB294\uB370, \uD569\uC740 0.|\uAE30\uC900\uC120 \uC704\uC640 \uC544\uB798\uB97C \uB098\uB208\uB2E4.|\uC74C\uC218\uC640 \uC591\uC218\uAC00 \uB530\uB85C \uC313\uC778\uB2E4.|\uC0C1\uC1C4\uC640 \uC0AC\uB77C\uC9D0\uC744 \uAD6C\uBCC4\uD55C\uB2E4.|\uC801\uBD84 0, \uC804\uCCB4 \uB113\uC774 4.|\uC5B4\uB5A4 \uC591\uC744 \uB354\uD558\uB294\uC9C0 \uBA3C\uC800 \uBB3B\uB2E4.|\uB204\uC801\uC758 \uB05D\uC810\uC744 \uC6C0\uC9C1\uC5EC \uBCF4\uC790."),"e-09-c":ee("restore-quadratic","\uC801\uBD84\uC0C1\uC218\uC640 \uD55C \uC810\uC758 \uC870\uAC74","\uAE30\uC6B8\uAE30\uB294 \uAC19\uC740\uB370, \uB192\uC774\uB294 \uB2E4\uB974\uB2E4.|\uBAA8\uC591\uACFC \uC704\uCE58\uB97C \uBD84\uB9AC\uD55C\uB2E4.|\uAC19\uC740 \uACE1\uC120\uC774 \uC704\uC544\uB798\uB85C \uAC08\uB77C\uC9C4\uB2E4.|\uB3C4\uD568\uC218\uB9CC\uC73C\uB85C \uD558\uB098\uB97C \uACE0\uB97C \uC218 \uC5C6\uB2E4.|\uD55C \uC810\uC774, \uC0C1\uC218\uB97C \uACB0\uC815\uD55C\uB2E4.|\uC5EC\uB7EC \uACE1\uC120\uC5D0\uC11C \uD558\uB098\uC758 \uACE1\uC120\uC73C\uB85C.|\uC870\uAC74\uC744 \uBC14\uAFB8\uC5B4 \uB2E4\uC2DC \uBCF5\uC6D0\uD574 \uBCF4\uC790."),"e-03-c":ee("rolle","\uC11C\uB85C \uB2E4\uB978 \uC2E4\uADFC \uC0AC\uC774\uC758 \uB07C\uC784","\uB2E4\uC12F \uADFC \uC0AC\uC774, \uB2E4\uC74C \uADFC\uC774 \uD0DC\uC5B4\uB09C\uB2E4.|\uC778\uC811\uD55C \uB450 \uADFC\uC744 \uC787\uB294\uB2E4.|\uBBF8\uBD84\uD560 \uB54C\uB9C8\uB2E4 \uD55C \uC904\uC529 \uC904\uC5B4\uB4E0\uB2E4.|\uC911\uBCF5\uADFC\uC740 \uB530\uB85C \uC0B4\uD3B4\uC57C \uD55C\uB2E4.|\uADFC\uACFC \uADFC \uC0AC\uC774\uB97C \uB2E4\uC2DC \uD655\uC778\uD55C\uB2E4.|\uCC28\uC218\uBCF4\uB2E4 \uC911\uC694\uD55C, \uC870\uAC74\uC758 \uC5ED\uD560.|\uB2E4\uB978 \uADFC\uC744 \uB193\uC544\uB3C4 \uB07C\uC784\uC740 \uB0A8\uC744\uAE4C."),"e-04-c":ee("restore","\uB3C4\uD568\uC218\uC758 \uBD80\uD638\uB85C \uC77D\uB294 \uC6D0\uD568\uC218","\uBCC0\uD654\uC728\uC5D0\uC11C, \uACE1\uC120\uC758 \uBAA8\uC591\uC73C\uB85C.|\uC591\uC218\uC640 \uC74C\uC218\uC778 \uAD6C\uAC04\uC744 \uB098\uB208\uB2E4.|\uAE30\uC6B8\uAE30\uC758 \uBD80\uD638\uAC00 \uBC29\uD5A5\uC744 \uC815\uD55C\uB2E4.|0\uC774\uB77C\uB294 \uAC12\uB9CC\uC73C\uB85C\uB294 \uBD80\uC871\uD558\uB2E4.|\uC88C\uC6B0 \uBD80\uD638\uAC00 \uBC14\uB00C\uB294\uC9C0 \uC77D\uB294\uB2E4.|\uBAA8\uC591\uC744 \uC54C\uACE0\uB3C4 \uB192\uC774\uB294 \uB0A8\uB294\uB2E4.|\uD559\uC0DD\uC774 \uB9CC\uB4E0 \uBCF5\uC6D0 \uACFC\uC815\uC744 \uB9CC\uB098\uB2E4."),"a-07-c":ee("zoom","\uAD00\uCC30 \uBC94\uC704\uC640 \uC811\uC120 \uC624\uCC28","\uACE1\uC120 \uC18D\uC5D0, \uC9C1\uC120\uC774 \uC228\uC5B4 \uC788\uB2E4.|\uD55C \uC810\uC744 \uC911\uC2EC\uC5D0 \uACE0\uC815\uD55C\uB2E4.|\uBC94\uC704\uB97C \uC881\uD790\uC218\uB85D \uACE1\uB960\uC774 \uC791\uC544\uC9C4\uB2E4.|\uB208\uB300\uC911 \uB300\uC2E0, \uCC28\uC774\uB97C \uC7B0\uB2E4.|\uBC94\uC704 1/10, \uC624\uCC28 1/100.|\uC791\uC740 \uBC94\uC704\uC5D0\uC11C \uB4DC\uB7EC\uB098\uB294 \uC120\uD615\uC131.|\uD655\uB300 \uBC30\uC728\uC744 \uC9C1\uC811 \uBC14\uAFB8\uC5B4 \uBCF4\uC790."),"a-09-c":ee("limits","\uADF9\uD55C\uC758 \uD615\uD0DC\uC640 \uC801\uC6A9 \uC870\uAC74","\uBBF8\uBD84\uD558\uAE30 \uC804, \uD615\uD0DC\uB97C \uBA3C\uC800 \uBCF8\uB2E4.|0/0\uC778\uAC00, \uBD84\uC790\uC640 \uBD84\uBAA8\uB97C \uB098\uB208\uB2E4.|\uAC00\uB2A5\uD55C \uC2DD\uC740 \uAC19\uC740 \uAC12\uC73C\uB85C \uBAA8\uC778\uB2E4.|\uAC19\uC774 \uBBF8\uBD84\uD588\uB294\uB370, \uACB0\uB860\uC740 \uB2E4\uB974\uB2E4.|\uC778\uC218\uBD84\uD574\uB85C \uD55C \uBC88 \uB354 \uD655\uC778\uD55C\uB2E4.|\uACC4\uC0B0\uBCF4\uB2E4 \uC55E\uC11C\uB294 \uC801\uC6A9 \uC870\uAC74.|\uB450 \uC2DD\uC744 \uB098\uB780\uD788 \uD655\uC778\uD574 \uBCF4\uC790."),"a-03-c":ee("secant","\uB450 \uC810\uC758 \uAE30\uC6B8\uAE30\uC5D0\uC11C \uD55C \uC810\uC73C\uB85C","\uB450 \uC810\uC5D0\uC11C, \uD55C \uC810\uC758 \uAE30\uC6B8\uAE30\uB85C.|\uACE0\uC815\uD560 \uC810\uACFC \uC6C0\uC9C1\uC77C \uC810\uC744 \uB098\uB208\uB2E4.|\uB450 \uBC88\uC9F8 \uC810\uC774 \uCCAB \uC810\uC73C\uB85C \uB2E4\uAC00\uC628\uB2E4.|h=0\uC744 \uBC14\uB85C \uB123\uC744 \uC218\uB294 \uC5C6\uB2E4.|\uD560\uC120\uACFC \uC811\uC120\uC758 \uCC28\uC774\uB97C \uC77D\uB294\uB2E4.|\uAC00\uAE4C\uC6CC\uC9C0\uB294 \uAC12\uC73C\uB85C \uC21C\uAC04\uC744 \uC815\uC758\uD558\uB2E4.|\uC774\uC81C \uB450 \uC810 \uC0AC\uC774\uB97C \uC6C0\uC9C1\uC5EC \uBCF4\uC790."),"e-05-c":ee("ratio","\uC0BC\uCC28\uD568\uC218\uC758 \uADF9\uC810\uACFC \uBCC0\uACE1\uC810","\uBAA8\uC591\uC774 \uBC14\uB00C\uC5B4\uB3C4, \uAC00\uC6B4\uB370\uB294 \uB0A8\uC744\uAE4C.|\uB450 \uADF9\uC810\uACFC \uBCC0\uACE1\uC810\uC744 \uCC0D\uB294\uB2E4.|\uC11C\uB85C \uB2E4\uB978 \uB192\uC774, \uAC19\uC740 \uC218\uD3C9 \uBE44\uC728.|\uAC70\uB9AC\uC758 \uBC29\uD5A5\uC744 \uBA3C\uC800 \uAD6C\uBD84\uD55C\uB2E4.|\uBCC0\uACE1\uC810 \uC591\uCABD\uC758 \uAC70\uB9AC\uB97C \uBE44\uAD50\uD55C\uB2E4.|\uB2EE\uC740 \uBAA8\uC591 \uC548\uC5D0\uC11C \uAD00\uACC4\uB97C \uCC3E\uB2E4.|\uB2E4\uB978 \uC0BC\uCC28\uD568\uC218\uC5D0\uB3C4 \uBB3C\uC5B4\uBCF4\uC790."),"a-04-c":ee("extrema","\uB3C4\uD568\uC218\uC758 \uADFC\uACFC \uBD80\uD638 \uBCC0\uD654","\uBCF5\uC7A1\uD55C \uACE1\uC120\uC5D0, \uD45C\uC2DD\uC744 \uB0A8\uAE34\uB2E4.|\uAE30\uC6B8\uAE30\uAC00 0\uC778 \uACF3\uC744 \uCC3E\uB294\uB2E4.|\uC99D\uAC00\uC640 \uAC10\uC18C\uAC00 \uAC08\uB77C\uC9C4\uB2E4.|\uBA48\uCDC4\uB2E4\uACE0 \uBAA8\uB450 \uADF9\uAC12\uC740 \uC544\uB2C8\uB2E4.|\uC810 \uD558\uB098\uBCF4\uB2E4 \uC591\uCABD\uC758 \uBD80\uD638\uB97C.|\uBBF8\uBD84\uC73C\uB85C \uACE1\uC120\uC758 \uC9C0\uB3C4\uB97C \uC77D\uB2E4.|\uACC4\uC218 \uBCC0\uD654\uAC00 \uBAA8\uC591\uC744 \uBC14\uAFC0\uAE4C."),"a-08-c":ee("newton","\uC811\uC120\uC73C\uB85C \uC774\uB3D9\uD558\uB294 \uBC18\uBCF5 \uACFC\uC815","\uC811\uC120\uC744 \uD0C0\uACE0, \uADFC\uC744 \uD5A5\uD574.|\uCD9C\uBC1C\uC810\uC5D0\uC11C \uC811\uC120\uC744 \uAE0B\uB294\uB2E4.|\uB2E4\uC74C \uAD50\uC810\uC774 \uC0C8 \uCD9C\uBC1C\uC810\uC774 \uB41C\uB2E4.|\uAE30\uC6B8\uAE30\uAC00 0\uC774\uBA74 \uAE38\uC774 \uB04A\uAE34\uB2E4.|\uBC18\uBCF5 \uC0AC\uC774\uC758 \uAC70\uB9AC\uB97C \uBE44\uAD50\uD55C\uB2E4.|\uAC00\uAE4C\uC6CC\uC9D0\uC5D0\uB3C4 \uC870\uAC74\uC774 \uD544\uC694\uD558\uB2E4.|\uD559\uC0DD \uC6F9\uC571\uC5D0\uC11C \uCD9C\uBC1C\uC810\uC744 \uACE8\uB77C \uBCF4\uC790."),"e-06-c":ee("mean-value","\uD3C9\uADE0 \uBCC0\uD654\uC728\uACFC \uC21C\uAC04 \uBCC0\uD654\uC728","\uB450 \uC810\uC758 \uD3C9\uADE0, \uD55C \uC810\uC758 \uC21C\uAC04.|\uAD6C\uAC04 \uC591 \uB05D\uC744 \uBA3C\uC800 \uACE0\uC815\uD55C\uB2E4.|\uC811\uC120\uC774 \uD560\uC120\uACFC \uB098\uB780\uD574\uC9C0\uB294 \uC21C\uAC04.|\uBAA8\uC11C\uB9AC\uAC00 \uC788\uC73C\uBA74 \uC870\uAC74\uC774 \uAE68\uC9C4\uB2E4.|\uAD6C\uAC04 \uC548\uC758 \uD55C \uC810\uC744 \uD655\uC778\uD55C\uB2E4.|\uD3C9\uADE0\uACFC \uC21C\uAC04\uC744 \uC787\uB294 \uC815\uB9AC.|\uB2E4\uB978 \uAD6C\uAC04\uC758 \uAC19\uC740 \uAE30\uC6B8\uAE30\uB97C \uCC3E\uC544\uBCF4\uC790."),"e-07-c":ee("chain","\uD569\uC131\uD568\uC218\uC758 \uC601\uC810\uACFC \uADF9\uAC12","0\uC744 \uCC3E\uC558\uB294\uB370, \uADF9\uAC12\uC77C\uAE4C.|\uB450 \uBCC0\uD654\uC728\uC744 \uB530\uB85C \uC77D\uB294\uB2E4.|\uACF1\uC774 0\uC774 \uB418\uB294 \uAE38\uC774 \uAC08\uB77C\uC9C4\uB2E4.|x\xB3\uC740 \uBA48\uCD94\uC5B4\uB3C4 \uBC29\uD5A5\uC744 \uC548 \uBC14\uAFBC\uB2E4.|x\xB2\uACFC x\xB3\uC758 \uC591\uCABD \uBD80\uD638\uB97C \uBE44\uAD50\uD55C\uB2E4.|\uC601\uC810 \uB2E4\uC74C\uC5D0\uB294 \uBD80\uD638\uB97C \uBCF4\uC790.|\uD559\uC0DD\uC758 \uD569\uC131\uD568\uC218 \uD0D0\uAD6C\uB85C \uC774\uC5B4\uC9C4\uB2E4."),"e-10-c":ee("tangent-merge","\uC811\uC810 \uBC29\uC815\uC2DD\uC758 \uC911\uADFC\uACFC \uC811\uC120 \uC218","\uC811\uC810\uC774 \uACB9\uCE58\uBA74, \uBA87 \uAC1C\uB97C \uC140\uAE4C.|\uACE1\uC120 \uBC16\uC758 \uC810\uC744 \uACE0\uC815\uD55C\uB2E4.|\uC811\uC120\uB4E4\uC774 \uD55C \uC810\uC73C\uB85C \uBAA8\uC778\uB2E4.|\uACBD\uACC4\uC5D0\uC11C \uB450 \uC811\uC810\uC774 \uD558\uB098\uAC00 \uB41C\uB2E4.|\uC911\uBCF5 \uD69F\uC218\uC640 \uC11C\uB85C \uB2E4\uB978 \uADFC\uC744 \uB098\uB208\uB2E4.|\uBC29\uC815\uC2DD\uC758 \uADFC\uC5D0\uC11C \uC811\uC120 \uC218\uB85C.|\uC811\uC810\uC758 \uACBD\uACC4\uB97C \uC9C1\uC811 \uC0B4\uD3B4\uBCF4\uC790."),"a-05-c":ee("area-scale","\uC0AC\uCC28\uD568\uC218\uC758 \uB2EE\uC74C\uACFC \uB113\uC774\uBE44","\uB298\uC5B4\uB09C \uBAA8\uC591, \uADF8\uB300\uB85C\uC778 \uB113\uC774\uBE44.|\uB113\uC774\uB97C \uB450 \uC601\uC5ED\uC73C\uB85C \uB098\uB208\uB2E4.|\uAC00\uB85C\uC640 \uC138\uB85C\uAC00 \uD568\uAED8 \uB298\uC5B4\uB09C\uB2E4.|\uB113\uC774 \uC790\uCCB4\uC640 \uBE44\uC728\uC744 \uAD6C\uBD84\uD55C\uB2E4.|\uAC19\uC740 \uBC30\uC728\uC774 \uB450 \uC601\uC5ED\uC5D0 \uC791\uC6A9\uD55C\uB2E4.|\uACF5\uD1B5 \uBC30\uC728\uC774 \uBE44\uC5D0\uC11C \uC0AC\uB77C\uC9C4\uB2E4.|\uD559\uC0DD\uC774 \uC815\uB9AC\uD55C \uB113\uC774\uBE44\uB97C \uB9CC\uB098\uB2E4."),"a-10-c":ee("antiderivative","\uB3C4\uD568\uC218\uC5D0\uC11C \uC6D0\uD568\uC218\uB85C \uAC00\uB294 \uB204\uC801","\uBCC0\uD654\uC758 \uAE30\uB85D\uC73C\uB85C, \uC6D0\uB798 \uAE38\uC744 \uCC3E\uB2E4.|\uC591\uC218\uC640 \uC74C\uC218\uC778 \uAE30\uC6B8\uAE30\uB97C \uC77D\uB294\uB2E4.|\uC870\uAE08\uC529 \uC313\uC778 \uBCC0\uD654\uAC00 \uACE1\uC120\uC774 \uB41C\uB2E4.|\uCD9C\uBC1C \uB192\uC774\uB294 \uC544\uC9C1 \uC815\uD574\uC9C0\uC9C0 \uC54A\uC558\uB2E4.|\uAC19\uC740 \uB3C4\uD568\uC218, \uB2E4\uB978 \uC801\uBD84\uC0C1\uC218.|\uB3C4\uD568\uC218\uB85C \uBAA8\uC591\uC744 \uBCF5\uC6D0\uD558\uB2E4.|\uD559\uC0DD \uC6F9\uC571\uC5D0\uC11C \uC9C1\uC811 \uADF8\uB824 \uBCF4\uC790."),"e-11-c":ee("curvature","\uC774\uACC4\uB3C4\uD568\uC218\uC758 \uBD80\uD638\uC640 \uBCC0\uACE1","\uAE30\uC6B8\uAE30\uB294, \uC5B4\uB290 \uCABD\uC73C\uB85C \uBC14\uB014\uAE4C.|\uC811\uC120\uC758 \uAE30\uC6B8\uAE30\uB97C \uC5F0\uC18D\uD574\uC11C \uC77D\uB294\uB2E4.|\uD55C\uCABD\uC740 \uC904\uACE0, \uB2E4\uB978 \uCABD\uC740 \uB298\uC5B4\uB09C\uB2E4.|\uC774\uACC4\uB3C4\uD568\uC218 0\uB9CC\uC73C\uB85C \uBD80\uC871\uD558\uB2E4.|x\xB3\uACFC x\u2074, \uBD80\uD638 \uBCC0\uD654\uB97C \uBE44\uAD50\uD55C\uB2E4.|\uC810\uC758 \uAC12\uBCF4\uB2E4 \uC804\uD6C4\uC758 \uBCC0\uD654\uB97C.|\uD559\uC0DD\uC758 \uD310\uC815 \uACFC\uC815\uC744 \uC774\uC5B4 \uC77D\uC790."),"e-08-c":ee("model","\uD6C4\uBCF4 \uD568\uC218\uC640 \uC794\uCC28\uC758 \uBE44\uAD50","\uB2EE\uC740 \uC608\uCE21, \uB2E4\uB978 \uC624\uCC28.|\uC138 \uBAA8\uD615\uC5D0 \uAC19\uC740 \uC790\uB8CC\uB97C \uB193\uB294\uB2E4.|\uC810\uACFC \uC608\uCE21 \uC0AC\uC774\uC5D0 \uD2C8\uC774 \uC0DD\uAE34\uB2E4.|\uAC89\uBAA8\uC591\uB9CC\uC73C\uB85C \uACE0\uB974\uC9C0 \uC54A\uB294\uB2E4.|\uC794\uCC28\uB97C \uAC19\uC740 \uAE30\uC900\uC73C\uB85C \uBAA8\uC740\uB2E4.|\uC5B4\uB5A4 \uC790\uB8CC\uB85C \uBE44\uAD50\uD588\uB294\uC9C0 \uBB3B\uB2E4.|\uD559\uC0DD\uC758 \uC608\uCE21 \uBAA8\uD615\uC744 \uB9CC\uB098\uB2E4."),"a-01-c":ee("tangents","\uD55C \uC810\uC744 \uC9C0\uB098\uB294 \uC0BC\uCC28\uD568\uC218\uC758 \uC811\uC120","\uD55C \uC810\uC744 \uC9C0\uB098\uB294, \uC5EC\uB7EC \uC811\uC120.|\uC811\uC810 t\uB97C \uBA3C\uC800 \uC6C0\uC9C1\uC778\uB2E4.|\uC811\uC120 \uC138 \uAC1C\uAC00 \uAC19\uC740 \uC810\uC744 \uC9C0\uB09C\uB2E4.|\uC810\uC744 \uC62E\uAE30\uBA74 \uAC1C\uC218\uAC00 \uBC14\uB010\uB2E4.|\uC811\uC810 \uBC29\uC815\uC2DD\uC758 \uC11C\uB85C \uB2E4\uB978 \uC2E4\uADFC.|\uAE30\uC6B8\uAE30\uBCF4\uB2E4 \uC811\uC810\uC744 \uBBF8\uC9C0\uC218\uB85C.|\uB2E4\uB978 \uC810\uC5D0\uC11C\uB294 \uBA87 \uAC1C\uAC00 \uB420\uAE4C."),"a-02-c":ee("join","\uD568\uC218\uC758 \uC5F0\uACB0\uACFC \uB9E4\uB044\uB7EC\uC6C0","\uC774\uC5B4\uC84C\uB2E4\uB294 \uAC83\uB9CC\uC73C\uB85C \uCDA9\uBD84\uD560\uAE4C.|\uC67C\uCABD\uACFC \uC624\uB978\uCABD\uC744 \uB530\uB85C \uB193\uB294\uB2E4.|\uB192\uC774\uB97C \uB9DE\uCD94\uC5B4 \uD55C \uC810\uC5D0\uC11C \uC787\uB294\uB2E4.|\uC5F0\uACB0\uB418\uC5B4\uB3C4 \uBAA8\uC11C\uB9AC\uB294 \uB0A8\uB294\uB2E4.|\uAC12\uACFC \uAE30\uC6B8\uAE30\uB97C \uD568\uAED8 \uB9DE\uCD98\uB2E4.|\uB04A\uAE40\uC744 \uB118\uC5B4\uC11C, \uB9E4\uB044\uB7FD\uAC8C.|\uC811\uD569\uC810\uC744 \uC9C1\uC811 \uBC14\uAFB8\uC5B4 \uBCF4\uC790."),"a-11-c":ee("surface","\uD55C \uBCC0\uC218\uB97C \uACE0\uC815\uD55C \uB2E8\uBA74\uC758 \uBBF8\uBD84","\uC785\uCCB4 \uC704\uC5D0\uC11C, \uD558\uB098\uB97C \uACE0\uC815\uD558\uB2E4.|\uB450 \uBC29\uD5A5\uC744 \uB530\uB85C \uD45C\uC2DC\uD55C\uB2E4.|\uD3C9\uBA74\uC73C\uB85C \uC798\uB77C \uACE1\uC120\uC744 \uAEBC\uB0B8\uB2E4.|\uC804\uCCB4 \uBCC0\uD654\uC640 \uD55C \uBC29\uD5A5\uC758 \uBCC0\uD654\uB97C \uB098\uB208\uB2E4.|\uB2E8\uBA74 \uC704 \uC811\uC120\uC774 \uBCC0\uD654\uC728\uC744 \uB9D0\uD55C\uB2E4.|\uACF5\uAC04\uC758 \uC9C8\uBB38\uC744 \uD3C9\uBA74\uC73C\uB85C \uC62E\uAE30\uB2E4.|\uB2E4\uB978 \uBC29\uD5A5\uC73C\uB85C \uB2E4\uC2DC \uC798\uB77C \uBCF4\uC790."),"e-01-g":ee("space-points","\uACF5\uAC04 \uC120\uBD84\uC758 \uB0B4\uBD84\uACFC \uC678\uBD84","\uB450 \uC810 \uC0AC\uC774, \uD55C \uC810\uC744 \uB193\uB2E4.|\uC138 \uC88C\uD45C\uC758 \uBCC0\uD654\uB97C \uB098\uB204\uC5B4 \uBCF8\uB2E4.|\uAC19\uC740 \uBE44\uC728\uB85C \uC138 \uBC29\uD5A5\uC744 \uC6C0\uC9C1\uC778\uB2E4.|1\uC744 \uB118\uC73C\uBA74 \uC120\uBD84 \uBC16\uC73C\uB85C.|\uACF5\uAC04\uACFC \uC88C\uD45C\uC758 \uBE44\uC728\uC744 \uBE44\uAD50\uD55C\uB2E4.|\uC88C\uD45C \uC14B\uC744 \uD558\uB098\uC758 \uC2DD\uC73C\uB85C.|\uD559\uC0DD \uC6F9\uC571\uC5D0\uC11C \uBE44\uC728\uC744 \uBC14\uAFD4 \uBCF4\uC790."),"a-06-g":ee("dimension","\uCC28\uC6D0\uC744 \uB0AE\uCD94\uC5B4 \uBCF4\uB294 \uB2E8\uBA74","\uBCF4\uC774\uC9C0 \uC54A\uB294 \uCC28\uC6D0\uC744, \uC798\uB77C \uBCF4\uB2E4.|\uD55C \uC88C\uD45C\uB97C \uACE0\uC815\uD55C\uB2E4.|\uAD6C\uC5D0\uC11C \uC6D0\uC73C\uB85C, \uCC28\uC6D0\uC774 \uB0B4\uB824\uAC04\uB2E4.|\uACBD\uACC4\uC5D0 \uB2FF\uC73C\uBA74 \uB2E8\uBA74\uC774 \uC904\uC5B4\uB4E0\uB2E4.|\uB0A8\uC740 \uC88C\uD45C\uAC00 \uC791\uC740 \uAD6C\uB97C \uC774\uB8EC\uB2E4.|\uC9C1\uC811 \uBCFC \uC218 \uC5C6\uC5B4\uB3C4 \uAD00\uACC4\uB294 \uC77D\uD78C\uB2E4.|\uCC28\uC6D0\uC744 \uBC14\uAFB8\uC5B4 \uAC19\uC740 \uC9C8\uBB38\uC744."),"e-02-g":ee("parabola","\uCD08\uC810\uACFC \uC900\uC120\uAE4C\uC9C0 \uAC19\uC740 \uAC70\uB9AC","\uAC19\uC740 \uAC70\uB9AC\uC758 \uC810\uB4E4\uC774 \uACE1\uC120\uC774 \uB41C\uB2E4.|\uCD08\uC810 \uD558\uB098\uC640 \uC9C1\uC120 \uD558\uB098\uB97C \uB193\uB294\uB2E4.|\uB450 \uAC70\uB9AC\uAC00 \uAC19\uC740 \uC810\uC744 \uC787\uB294\uB2E4.|\uC900\uC120\uAE4C\uC9C0\uB294 \uC218\uC9C1\uC73C\uB85C \uC7AC\uC57C \uD55C\uB2E4.|\uB450 \uC120\uBD84\uC758 \uAE38\uC774\uB97C \uBE44\uAD50\uD55C\uB2E4.|\uAC70\uB9AC \uC870\uAC74\uC774 \uD3EC\uBB3C\uC120\uC758 \uC2DD\uC73C\uB85C.|\uCD08\uC810\uC758 \uC704\uCE58\uB97C \uBC14\uAFB8\uC5B4 \uBCF4\uC790."),"e-03-g":ee("ellipsoid","\uAC70\uB9AC \uD569\uACFC \uACF5\uAC04\uC758 \uD68C\uC804\uD0C0\uC6D0\uCCB4","\uD0C0\uC6D0\uC774 \uD3C9\uBA74 \uBC16\uC73C\uB85C \uD3BC\uCCD0\uC9C4\uB2E4.|\uACF5\uAC04\uC5D0 \uB450 \uCD08\uC810\uC744 \uACE0\uC815\uD55C\uB2E4.|\uAC70\uB9AC\uC758 \uD569\uC744 \uC720\uC9C0\uD558\uBA70 \uD68C\uC804\uD55C\uB2E4.|a\uC640 c\uC758 \uACBD\uACC4\uC5D0\uC11C\uB294 \uB2EC\uB77C\uC9C4\uB2E4.|\uC911\uC2EC\uC744 \uC9C0\uB098\uB294 \uB2E8\uBA74\uC744 \uAEBC\uB0B8\uB2E4.|\uAC70\uB9AC \uC870\uAC74\uC744 \uACF5\uAC04\uC73C\uB85C \uB113\uD788\uB2E4.|\uD3C9\uBA74\uACFC \uC785\uCCB4\uB97C \uBC88\uAC08\uC544 \uBCF4\uC790."),"e-04-g":ee("conic-boundary","\uCD08\uC810 \uAC70\uB9AC \uC870\uAC74\uC758 \uC874\uC7AC\uC640 \uACBD\uACC4","\uC870\uAC74 \uD558\uB098\uAC00, \uACE1\uC120\uC744 \uC5C6\uC564\uB2E4.|\uCD08\uC810 \uC0AC\uC774 \uAC70\uB9AC 2c\uB97C \uACE0\uC815\uD55C\uB2E4.|\uD569\uACFC \uCC28\uC758 \uC870\uAC74\uC744 \uB098\uB780\uD788 \uBCF8\uB2E4.|\uACBD\uACC4\uAC12\uC5D0\uC11C \uACE1\uC120\uC774 \uD1F4\uD654\uD55C\uB2E4.|\uC874\uC7AC\uD558\uB294 \uC870\uAC74\uC744 \uBA3C\uC800 \uD655\uC778\uD55C\uB2E4.|\uBC29\uC815\uC2DD \uC55E\uC5D0, \uAC00\uB2A5\uD55C \uAC70\uB9AC\uB97C.|\uD559\uC0DD\uC758 \uACBD\uACC4 \uC870\uAC74 \uD0D0\uAD6C\uB85C."),"a-07-g":ee("projection","\uAE30\uC6B8\uAE30\uC640 \uC815\uC0AC\uC601 \uB113\uC774","\uB113\uC774\uB294, \uADF8\uB9BC\uC790\uC5D0\uC11C \uC904\uC5B4\uB4E0\uB2E4.|\uC6D0\uB798 \uBA74\uACFC \uD22C\uC601\uBA74\uC744 \uB098\uB208\uB2E4.|\uAE30\uC6B8\uC77C\uC218\uB85D \uADF8\uB9BC\uC790\uAC00 \uC811\uD78C\uB2E4.|\uAE38\uC774\uC640 \uB113\uC774\uC758 \uBE44\uB97C \uD63C\uB3D9\uD558\uC9C0 \uC54A\uB294\uB2E4.|\uAE30\uC6B8\uAE30 \uD558\uB098\uAC00 \uB192\uC774\uB97C \uC904\uC778\uB2E4.|\uBA74\uC801\uC5D0 \uB0A8\uB294 \uCF54\uC0AC\uC778\uC758 \uBAAB.|\uB2E4\uB978 \uAC01\uB3C4\uC758 \uADF8\uB9BC\uC790\uB97C \uB9CC\uB4E4\uC5B4 \uBCF4\uC790."),"a-09-g":ee("cone-cut","\uC808\uB2E8\uD3C9\uBA74\uC774 \uB9CC\uB4DC\uB294 \uC774\uCC28\uACE1\uC120","\uD558\uB098\uC758 \uC6D0\uBFD4, \uC11C\uB85C \uB2E4\uB978 \uACE1\uC120.|\uC790\uB974\uB294 \uD3C9\uBA74\uC744 \uB193\uB294\uB2E4.|\uD3C9\uBA74\uC758 \uAE30\uC6B8\uAE30\uAC00 \uB2EC\uB77C\uC9C4\uB2E4.|\uBAA8\uC120\uACFC \uB098\uB780\uD55C \uC21C\uAC04\uC774 \uACBD\uACC4\uB2E4.|\uC6D0\uC744 \uC9C0\uB098 \uD0C0\uC6D0\xB7\uD3EC\uBB3C\uC120\xB7\uC30D\uACE1\uC120\uC73C\uB85C.|\uACF5\uAC04\uC758 \uC808\uB2E8\uC774 \uD3C9\uBA74\uC758 \uACE1\uC120\uC73C\uB85C.|\uB124 \uAC00\uC9C0 \uB2E8\uBA74\uC744 \uC774\uC5B4 \uBCF4\uC790."),"a-03-g":ee("focal","\uAC70\uB9AC\uC758 \uD569\uACFC \uCC28\uB85C \uB9CC\uB4DC\uB294 \uACE1\uC120","\uB354\uD560\uAE4C, \uBE84\uAE4C. \uACE1\uC120\uC774 \uAC08\uB9B0\uB2E4.|\uB450 \uCD08\uC810\uC744 \uAC19\uC740 \uC790\uB9AC\uC5D0 \uB193\uB294\uB2E4.|\uD55C \uC810\uC5D0\uC11C \uB450 \uAC70\uB9AC\uB97C \uC787\uB294\uB2E4.|\uD569\uC758 \uC870\uAC74\uACFC \uCC28\uC758 \uC870\uAC74\uC744 \uB098\uB208\uB2E4.|\uACE0\uC815\uB418\uB294 \uAC12\uC774 \uB2E4\uB974\uB2E4.|\uAC19\uC740 \uB450 \uC810\uC5D0\uC11C \uB2E4\uB978 \uACE1\uC120\uC73C\uB85C.|\uC870\uAC74\uC744 \uBC14\uAFB8\uC5B4 \uADA4\uC801\uC744 \uBCF4\uC790."),"e-05-g":ee("line-plane","\uBC95\uC120 \uB0B4\uC801\uACFC \uD55C \uC810\uC758 \uD3EC\uD568 \uC5EC\uBD80","\uD3C9\uD589\uACFC \uD3EC\uD568, \uAC19\uC740 \uB0B4\uC801 0.|\uBC29\uD5A5\uBCA1\uD130\uC640 \uBC95\uC120\uC744 \uAEBC\uB0B8\uB2E4.|\uC9C1\uC120\uC774 \uD3C9\uBA74\uC744 \uAC00\uB85C\uC9C0\uB978\uB2E4.|\uBC29\uD5A5\uC774 \uAC19\uC544\uB3C4 \uC704\uCE58\uB294 \uB2E4\uB974\uB2E4.|\uC9C1\uC120 \uC704 \uD55C \uC810\uC744 \uB354 \uD655\uC778\uD55C\uB2E4.|\uBC29\uD5A5 \uC870\uAC74\uC5D0 \uC704\uCE58 \uC870\uAC74\uC744 \uB354\uD558\uB2E4.|\uC138 \uAC00\uC9C0 \uC704\uCE58 \uAD00\uACC4\uB97C \uC0B4\uD3B4\uBCF4\uC790."),"a-04-g":ee("minimum","\uC9C1\uAC01\uC0BC\uAC01\uD615\uACFC \uCD5C\uB2E8\uAC70\uB9AC","\uB9CE\uC740 \uAE38 \uC911, \uAC00\uC7A5 \uC9E7\uC740 \uD558\uB098.|\uD3C9\uBA74 \uC704\uC758 \uB3C4\uCC29\uC810\uC744 \uC6C0\uC9C1\uC778\uB2E4.|\uC0AC\uC120 \uAE38\uC774\uAC00 \uC218\uC120\uBCF4\uB2E4 \uAE38\uC5B4\uC9C4\uB2E4.|\uBE57\uBCC0\uACFC \uC218\uC120\uC744 \uAD6C\uBD84\uD55C\uB2E4.|\uB0A8\uB294 \uAE38\uC774\uB294 \uC9C1\uAC01\uC0BC\uAC01\uD615 \uC548\uC5D0.|\uBAA8\uB4E0 \uAE38\uC758 \uC544\uB798\uC5D0, \uC218\uC120 \uD558\uB098.|\uB3C4\uCC29\uC810\uC744 \uBC14\uAFB8\uC5B4 \uBE44\uAD50\uD574 \uBCF4\uC790."),"a-08-g":ee("plane-distance","\uBC95\uC120 \uBC29\uD5A5\uC758 \uC131\uBD84\uACFC \uAC70\uB9AC \uACF5\uC2DD","\uACF5\uAC04\uC758 \uAC70\uB9AC\uB97C, \uD55C \uBC29\uD5A5\uC73C\uB85C.|\uD3C9\uBA74\uC758 \uBC95\uC120\uC744 \uC138\uC6B4\uB2E4.|\uC810\uC5D0\uC11C \uD3C9\uBA74\uC73C\uB85C \uC218\uC120\uC744 \uB0B4\uB9B0\uB2E4.|\uBC95\uC120\uC758 \uD06C\uAE30\uB97C \uADF8\uB300\uB85C \uC4F0\uBA74 \uC548 \uB41C\uB2E4.|\uC131\uBD84\uC744 \uBC95\uC120 \uAE38\uC774\uB85C \uB098\uB208\uB2E4.|\uC88C\uD45C\uC2DD \uC18D\uC5D0 \uC228\uC740 \uC815\uC0AC\uC601.|\uD559\uC0DD\uC758 \uAC70\uB9AC \uACC4\uC0B0\uAE30\uB97C \uB9CC\uB098 \uBCF4\uC790."),"e-06-g":ee("overlap","\uAD00\uCC30 \uBC29\uD5A5\uC5D0 \uB530\uB978 \uC815\uC0AC\uC601 \uACB9\uCE68","\uB2E4\uB978 \uB450 \uC810\uC774, \uD558\uB098\uB85C \uBCF4\uC778\uB2E4.|\uAD00\uCC30 \uBC29\uD5A5\uC744 \uB530\uB85C \uD45C\uC2DC\uD55C\uB2E4.|\uB450 \uC810\uC758 \uADF8\uB9BC\uC790\uAC00 \uAC00\uAE4C\uC6CC\uC9C4\uB2E4.|\uACB9\uCE5C \uADF8\uB9BC\uC790\uAC00 \uAC19\uC740 \uC810\uC740 \uC544\uB2C8\uB2E4.|\uCC28\uBCA1\uD130\uC640 \uC2DC\uC120\uC774 \uB098\uB780\uD574\uC9C4\uB2E4.|\uBCF4\uC774\uB294 \uC704\uCE58\uC640 \uC2E4\uC81C \uC704\uCE58\uB97C \uB098\uB204\uB2E4.|\uC2DC\uC120\uC744 \uBC14\uAFB8\uC5B4 \uB2E4\uC2DC \uAD00\uCC30\uD558\uC790."),"e-07-g":ee("cone-discriminant","\uC808\uB2E8\uAC01\uACFC \uC774\uCC28\uD56D\uC758 \uBD80\uD638","\uAC01\uB3C4 \uD558\uB098\uAC00, \uC2DD\uC758 \uBD80\uD638\uB97C \uBC14\uAFBC\uB2E4.|\uC6D0\uBFD4\uACFC \uD3C9\uBA74\uC758 \uC2DD\uC744 \uACB9\uCE5C\uB2E4.|\uC808\uB2E8\uAC01\uC774 \uBAA8\uC120\uC5D0 \uAC00\uAE4C\uC6CC\uC9C4\uB2E4.|D=0, \uACBD\uACC4\uB97C \uC815\uD655\uD788 \uC77D\uB294\uB2E4.|\uBD80\uD638 \uC138 \uAC1C\uAC00 \uB2E8\uBA74\uC744 \uAC00\uB978\uB2E4.|\uACF5\uAC04\uC758 \uAC01\uB3C4\uC640 \uC2DD\uC758 \uACC4\uC218\uAC00 \uB9CC\uB098\uB2E4.|\uACBD\uACC4 \uC591\uCABD\uC744 \uCC28\uB840\uB85C \uBE44\uAD50\uD558\uC790."),"e-10-g":ee("conic-tangent","\uC811\uC810 \uCE58\uD658\uACFC \uC218\uC9C1 \uC811\uC120\uC758 \uC911\uADFC","\uC811\uC120 \uACF5\uC2DD \uB4A4\uC5D0, \uC911\uADFC\uC774 \uC788\uB2E4.|\uACE1\uC120 \uC704 \uC811\uC810\uC744 \uBA3C\uC800 \uC815\uD55C\uB2E4.|\uD55C \uC810\uC5D0\uC11C \uC811\uC120\uC774 \uACE1\uC120\uC5D0 \uB2FF\uB294\uB2E4.|\uC218\uC9C1 \uC811\uC120\uB3C4 \uB193\uCE58\uC9C0 \uC54A\uB294\uB2E4.|\uB300\uC785\uD55C \uC2DD\uC774 \uC644\uC804\uC81C\uACF1\uC774 \uB41C\uB2E4.|\uB2E4\uB978 \uD45C\uD604, \uAC19\uC740 \uC911\uADFC \uC870\uAC74.|\uD559\uC0DD \uC6F9\uC571\uC5D0\uC11C \uC811\uC810\uC744 \uBC14\uAFD4 \uBCF4\uC790."),"a-05-g":ee("dot","\uD68C\uC804\uD558\uB294 \uBCA1\uD130\uC640 \uBD80\uD638 \uC788\uB294 \uC0AC\uC601","\uBC29\uD5A5\uC774 \uBC14\uB00C\uBA74, \uBD80\uD638\uB3C4 \uBC14\uB010\uB2E4.|\uD55C \uBCA1\uD130\uB97C \uAE30\uC900\uC73C\uB85C \uACE0\uC815\uD55C\uB2E4.|\uB2E4\uB978 \uBCA1\uD130\uAC00 \uC9C1\uAC01\uC744 \uC9C0\uB09C\uB2E4.|\uAE38\uC774\uAC00 \uC591\uC218\uC5EC\uB3C4 \uB0B4\uC801\uC740 \uC74C\uC218.|\uC0AC\uC601\uC774 \uAE30\uC900\uC810\uC758 \uB4A4\uB85C \uB118\uC5B4\uAC04\uB2E4.|\uBC29\uD5A5\uACFC \uD06C\uAE30\uB97C \uD55C \uAC12\uC5D0 \uB2F4\uB2E4.|\uAC01\uB3C4\uB97C \uC9C1\uC811 \uBC14\uAFB8\uC5B4 \uBCF4\uC790."),"e-11-g":ee("rotation","\uC810 \uD68C\uC804\uACFC \uC88C\uD45C\uCD95 \uD68C\uC804\uC758 \uAD6C\uBCC4","\uACE1\uC120\uC774 \uB3CC\uAE4C, \uC88C\uD45C\uAC00 \uB3CC\uAE4C.|\uACE0\uC815\uD560 \uB300\uC0C1\uBD80\uD130 \uACE0\uB978\uB2E4.|\uCD95\uC744 \uB3CC\uB9AC\uBA74 \uC88C\uD45C\uAC00 \uB2EC\uB77C\uC9C4\uB2E4.|90\uB3C4\uC5D0\uC11C\uB294 XY\uD56D\uC774 \uC0AC\uB77C\uC9C4\uB2E4.|\uAC19\uC740 \uC810\uC744 \uB450 \uC88C\uD45C\uB85C \uD655\uC778\uD55C\uB2E4.|\uD68C\uC804\uC758 \uBC29\uD5A5\uC774 \uC2DD\uC758 \uBD80\uD638\uB85C.|\uD559\uC0DD\uC758 \uC88C\uD45C\uBCC0\uD658\uC744 \uC0B4\uD3B4\uBCF4\uC790."),"e-08-g":ee("reflection","\uD3EC\uBB3C\uC120\uC758 \uCD08\uC810\uC73C\uB85C \uD5A5\uD558\uB294 \uAD11\uC120","\uD3C9\uD589\uD55C \uBE5B\uC774, \uD55C \uC810\uC73C\uB85C \uBAA8\uC778\uB2E4.|\uCD08\uC810\uACFC \uC811\uC120\uC758 \uBC95\uC120\uC744 \uC138\uC6B4\uB2E4.|\uC785\uC0AC\uD55C \uAD11\uC120\uC774 \uBC29\uD5A5\uC744 \uBC14\uAFBC\uB2E4.|\uAF2D\uC9D3\uC810\uC758 \uACBD\uC6B0\uB3C4 \uB530\uB85C \uBCF8\uB2E4.|\uBC18\uC0AC \uBC29\uD5A5\uACFC \uCD08\uC810\uC744 \uBE44\uAD50\uD55C\uB2E4.|\uAC70\uB9AC \uC870\uAC74\uC5D0\uC11C \uBE5B\uC758 \uACBD\uB85C\uB85C.|\uB2E4\uB978 \uC811\uC810\uC5D0\uC11C \uBE5B\uC744 \uBCF4\uB0B4 \uBCF4\uC790."),"a-01-g":ee("sphere-extreme","\uAD6C \uC704 \uB3D9\uC810\uC758 \uB0B4\uC801\uACFC \uC0AC\uC601 \uADF9\uAC12","\uAD6C \uC704\uC758 \uC810, \uADF8\uB9BC\uC790\uC758 \uC591 \uB05D.|\uC911\uC2EC\uACFC \uBC18\uC9C0\uB984 \uBCA1\uD130\uB97C \uB098\uB208\uB2E4.|\uC810\uC774 \uC6C0\uC9C1\uC774\uBA70 \uC0AC\uC601\uC774 \uB298\uC5B4\uB09C\uB2E4.|\uB2E4\uB978 \uACE1\uBA74\uC5D0 \uADF8\uB300\uB85C \uC62E\uAE38 \uC218 \uC788\uC744\uAE4C.|\uACE0\uC815\uCD95 \uBC29\uD5A5\uC758 \uC591 \uB05D\uC744 \uCC3E\uB294\uB2E4.|\uB0B4\uC801\uC758 \uADF9\uAC12\uC744 \uADF8\uB9BC\uC790\uB85C \uC77D\uB2E4.|\uACE1\uBA74\uC744 \uBC14\uAFB8\uC5B4 \uC9C8\uBB38\uC744 \uC774\uC5B4 \uAC00\uC790."),"a-02-g":ee("sphere-slice","\uAD6C\uC640 \uD3C9\uBA74\uC758 \uAD50\uC120 \uBC0F \uC811\uC810","\uD3C9\uBA74\uC774 \uC9C0\uB098\uAC00\uBA74, \uC6D0\uC774 \uB0A8\uB294\uB2E4.|\uC911\uC2EC\uC5D0\uC11C \uD3C9\uBA74\uAE4C\uC9C0 \uC218\uC120\uC744 \uB0B4\uB9B0\uB2E4.|\uB2E8\uBA74 \uC704 \uC810\uC774 \uC6D0\uC744 \uB530\uB77C \uBAA8\uC778\uB2E4.|\uC811\uD558\uBA74 \uD55C \uC810, \uBC97\uC5B4\uB098\uBA74 \uACF5\uC9D1\uD569.|R\uACFC d\uAC00 \uAC19\uC740 r\uC744 \uACB0\uC815\uD55C\uB2E4.|\uC77C\uC815\uD55C \uAC70\uB9AC\uC5D0\uC11C \uD0DC\uC5B4\uB09C \uC6D0.|\uD3C9\uBA74\uC744 \uC62E\uACA8 \uACBD\uACC4\uB97C \uC0B4\uD3B4\uBCF4\uC790."),"a-11-g":ee("asymptote","\uACE1\uC120\uACFC \uC810\uADFC\uC120 \uC0AC\uC774\uC758 \uAC70\uB9AC","\uBA40\uC5B4\uC9C8\uC218\uB85D, \uC120\uC5D0 \uAC00\uAE4C\uC6CC\uC9C4\uB2E4.|\uACE1\uC120\uACFC \uC9C1\uC120\uC744 \uB530\uB85C \uADF8\uB9B0\uB2E4.|\uC810\uC774 \uBA40\uC5B4\uC9C0\uBA70 \uD2C8\uC774 \uC904\uC5B4\uB4E0\uB2E4.|\uD3EC\uBB3C\uC120\uC5D0\uB294 \uAC19\uC740 \uACB0\uB860\uC744 \uBABB \uC4F4\uB2E4.|\uC704\uCE58\uAC00 \uC544\uB2C8\uB77C \uAC70\uB9AC\uB97C \uBE44\uAD50\uD55C\uB2E4.|\uB05D\uC5D0\uC11C \uB4DC\uB7EC\uB098\uB294 \uBC29\uC815\uC2DD\uC758 \uAD6C\uC870.|\uBA40\uB9AC \uC788\uB294 \uC810\uC5D0\uC11C \uB2E4\uC2DC \uD655\uC778\uD558\uC790."),"e-09-e":ee("compound","\uBCF5\uB9AC\uC758 \uC815\uD655\uD55C \uAE30\uAC04\uACFC \uADFC\uC0AC \uC624\uCC28","72\uB77C\uB294 \uC218\uB294, \uC5BC\uB9C8\uB098 \uAC00\uAE4C\uC6B8\uAE4C.|\uC815\uD655\uD55C \uAE30\uAC04\uACFC \uADFC\uC0AC\uB97C \uB098\uB208\uB2E4.|\uC774\uC728\uB9C8\uB2E4 \uB450 \uACE1\uC120\uC758 \uD2C8\uC774 \uB2EC\uB77C\uC9C4\uB2E4.|\uD55C \uC774\uC728\uC758 \uC77C\uCE58\uB85C \uC77C\uBC18\uD654\uD558\uC9C0 \uC54A\uB294\uB2E4.|\uAC19\uC740 \uAD6C\uAC04\uC5D0\uC11C \uC624\uCC28\uB97C \uBE44\uAD50\uD55C\uB2E4.|\uD3B8\uB9AC\uD55C \uADFC\uC0AC\uC5D0\uB3C4 \uC870\uAC74\uC774 \uC788\uB2E4.|\uC774\uC728\uC744 \uBC14\uAFB8\uC5B4 \uC624\uCC28\uB97C \uC0B4\uD3B4\uBCF4\uC790.")};function ac(n){let t=ev[n.id];if(!t)throw new Error("\uC7A5\uBA74 \uC124\uACC4\uAC00 \uC5C6\uB294 \uD0D0\uAD6C: "+n.id);return t}var gp=["\uC9C8\uBB38","\uC870\uAC74","\uC2DC\uB3C4","\uB2E4\uC2DC \uBCF4\uAE30","\uAD00\uACC4","\uC815\uB9AC","\uC791\uD488"];function _p(n,{id:t,light:e}){let i="math-scene-"+t,s=n.match(/<style>([\s\S]*?)<\/style>/)?.[1]||"",r=s.replace(/([^{}]+)\{/g,(a,l)=>l.split(",").map(c=>"#"+i+" "+c.trim()).join(",")+"{"),o="#"+i+" .primary{stroke:#e1e6cb;stroke-width:2}#"+i+" .secondary{stroke:#afc1a5;stroke-width:1.4;opacity:.82}#"+i+" .ghost{stroke:#b5c5b0;opacity:.28;stroke-width:1}#"+i+" .wash,#"+i+" .positive-fill,#"+i+" .plane-wash{fill:#b5c99e;fill-opacity:.18}#"+i+" .node{fill:#e9ebd8;stroke:#a7bc9b;stroke-width:1.2}#"+i+" .label,#"+i+" .warning-label{font-size:17px;paint-order:stroke;stroke:#203f35;stroke-width:3px;stroke-linejoin:round}#"+i+" .label,#"+i+" .tiny,#"+i+" .metric{fill:#d6dfc6}#"+i+" .axis{stroke:#bccab1;opacity:.22}#"+i+" .guide{stroke:#bccab1;opacity:.58}";return n=n.replace(/<text([^>]*)>([^<]*)<\/text>/g,(a,l,c)=>c.length>22?"<text"+l.replace('class="','class="long-label ')+">"+c+"</text>":a),n.replace("<svg ",'<svg id="'+i+'" ').replace("<style>"+s+"</style>","<style>"+r+o+"</style>")}var nv=n=>String(n).replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t]),hn=n=>Number(n.toFixed(3)),Lt=(n,t)=>[380+n*78,254-t*48],gu=(n,t="primary",e="")=>'<path d="'+n+'" class="'+t+'" '+(t==="guide"?"":'data-draw="" pathLength="1" ')+e+"/>",ft=(n,t,e="primary",i="")=>gu("M"+n.map(hn).join(" ")+"L"+t.map(hn).join(" "),e,i?'data-morph="'+i+'"':""),Oe=(n,t="primary",e=!1,i="")=>gu(n.map((s,r)=>(r?"L":"M")+s.map(hn).join(" ")).join(" ")+(e?"Z":""),t,i?'data-morph="'+i+'"':""),$n=(n,t,e,i="primary")=>'<circle cx="'+hn(n)+'" cy="'+hn(t)+'" r="'+hn(e)+'" class="'+i+'" data-pop=""/>',Rn=(n,t,e,i,s="primary",r="")=>'<ellipse cx="'+hn(n)+'" cy="'+hn(t)+'" rx="'+hn(e)+'" ry="'+hn(i)+'" class="'+s+'" data-pop="" '+r+"/>",bt=(n,t="",e=12,i=-12,s="")=>$n(...n,5,"node").replace('data-pop=""',s?'data-pop="" data-morph="'+s+'"':'data-pop=""')+(t?Xt(t,n[0]+e,n[1]+i):""),Xt=(n,t,e,i="label",s="start")=>'<text x="'+hn(t)+'" y="'+hn(e)+'" text-anchor="'+s+'" class="'+i+'" data-label="">'+nv(n)+"</text>",ze=(n,t=0)=>'<g data-stage-group="" data-order="'+t+'">'+n+"</g>",yn=(n,t,e="primary",i="")=>{let s=Math.atan2(t[1]-n[1],t[0]-n[0]),r=[t[0]-13*Math.cos(s-.38),t[1]-13*Math.sin(s-.38)],o=[t[0]-13*Math.cos(s+.38),t[1]-13*Math.sin(s+.38)];return ft(n,t,e,i?i+"-shaft":"")+Oe([r,t,o],e,!1,i?i+"-head":"")},se=(n,t=-3,e=3,i="primary",s=Lt)=>{let r="",o=[];for(let a=0;a<=150;a++){let l=t+(e-t)*a/150,c=n(l),h=s(l,c);!Number.isFinite(c)||h[1]<30||h[1]>407?(o.length>1&&(r+=Oe(o,i)),o=[]):o.push(h)}return o.length>1&&(r+=Oe(o,i)),r},hi=()=>ze(ft([68,254],[697,254],"axis")+ft([380,43],[380,402],"axis")+Xt("x",700,245,"tiny")+Xt("y",391,48,"tiny"),0),Ae=(n,t="")=>Xt(n,380,428,"metric","middle")+(t?Xt(t,380,451,"tiny","middle"):""),mu=(n,t,e,i)=>'<g transform="translate(35 45) scale(.46)">'+n+'</g><g transform="translate(375 45) scale(.46)">'+t+"</g>"+Xt(e,207,335,"label","middle")+Xt(i,555,335,"label","middle")+ft([380,78],[380,340],"axis"),xp=(n,t)=>n==="quadratic"?t*t:n==="cubic"?t*t*t/3-t:n==="wave"?-Math.cos(t):t*t*t-3*t;function _u(n=1.8,t=4){let e=n,i=[];for(let s=0;s<t&&!(Math.abs(2*e)<1e-10);s++){let r=e-(e*e-2)/(2*e);i.push({x:e,y:e*e-2,next:r}),e=r}return i}function lc(n){return n.slice(0,-1).map((t,e)=>t*(n.length-e-1))}function yp(n,t){return n.reduce((e,i)=>e*t+i,0)}function xu(n,t){let e=lc(n);return t.slice(0,-1).map((i,s)=>{let r=t[s+1];for(let o=0;o<55;o++){let a=(i+r)/2;yp(e,i)*yp(e,a)<=0?r=a:i=a}return(i+r)/2})}function iv(n){let t=[4,4,12,6,24,40,16][n],e=114,i=347,s=530,r=255,o=s/t,a="";for(let d=0;d<t;d++){let u=(n===3?d+.5:d)/t,f=u*u*r;a+=ze('<rect x="'+hn(e+d*o)+'" y="'+hn(i-f)+'" width="'+hn(o-1)+'" height="'+hn(f)+'" class="wash" data-rise=""/>'+ft([e+d*o,i-f],[e+(d+1)*o,i-f],"secondary"),d)}let l=se(d=>d*d,0,1,"primary",(d,u)=>[e+d*s,i-u*r]),c=(t-1)*(2*t-1)/(6*t*t),h=(t+1)*(2*t+1)/(6*t*t);return ft([100,i],[665,i],"axis")+a+ze(l,2)+(n>0?Xt("f(x) = x\xB2",528,76)+Xt("n = "+t,113,76):"")+(n===4||n===5?ft([114,392],[644,392],"secondary")+bt([114+c*900,392],"L\u2099",-25,-14)+bt([414,392],"1/3",-10,-14)+bt([114+h*900,392],"R\u2099",0,-14):"")+Ae(n===3?"\uD45C\uBCF8\uC810 \uBCC0\uACBD \xB7 \uC911\uC810 \uBAA8\uD615":"\uC88C\uD569 "+c.toFixed(4)+"  \u2264  1/3  \u2264  \uC6B0\uD569 "+h.toFixed(4))}function sv(n){let t="",e=[1,3,9,8,16,23,12][n];for(let i=0;i<e;i++){let s=e===1?0:-1+2*i/(e-1),r=Math.sqrt(Math.max(0,1-s*s));t+=ze(Rn(380,233+s*135,155*r,38*r,"secondary")+(n>1?Rn(380,233+s*135,155*r,38*r,"wash"):""),i)}return t+=Rn(380,233,155,147,"ghost"),(n===1||n===4||n===5)&&(t+=ft([380,233],[510,233],"primary")+ft([380,233],[380,135],"guide")+bt([380,233],"O")+Xt("r\xB2 = R\xB2 \u2212 x\xB2",428,130)),n===3&&(t+=gu("M230 175 Q380 130 530 175 L530 197 Q380 157 230 197Z","warning-fill")+Xt("\uACE1\uBA74\uC758 \uB760 \u2260 \uC6D0\uD310\uC758 \uB113\uC774",380,63,"warning-label","middle")),t+Ae(n===3?"\uAC89\uB113\uC774\uB294 \uACE1\uBA74\uC758 \uACBD\uC0AC \uD3ED\uC744 \uBC18\uC601\uD55C\uB2E4.":"A(x) = \u03C0(R\xB2 \u2212 x\xB2) \xB7 \uC587\uC740 \uB2E8\uBA74\uC758 \uD569")}function rv(n){let t=(r,o)=>[380+r*123,240-o*75],e=[.8,2,1.2,2,2,2,1.6][n],i="";n>0&&(i+=Oe([t(-2,0),t(-2,-2),t(0,0)],"negative-fill",!0)),i+=Oe([t(0,0),t(e,e),t(e,0)],"positive-fill",!0,"positive-area");let s=ft([78,240],[694,240],"axis")+ze(i,0)+ze(se(r=>r,-2,2,"primary",t),1);return(n===3||n>=4)&&(s+=yn([210,350],[333,375],"secondary")+yn([550,127],[427,375],"primary")+Xt("\u22122",225,301,"label","middle")+Xt("+2",535,180,"label","middle")),s+Ae(n===3?"\uC0C1\uC1C4\uB418\uC5B4\uB3C4 \uC601\uC5ED\uC740 \uB0A8\uB294\uB2E4.":n>=4?"\uC815\uC801\uBD84 = 0    /    \uC804\uCCB4 \uB113\uC774 = 4":"\uAE30\uC900\uC120 \uC704\uB294 +, \uC544\uB798\uB294 \u2212")}function ov(n,t){let e=hi(),i=o=>xp("cubic",o),s="",r="";if(["restore-quadratic","restore","antiderivative"].includes(n)){let o=n==="restore-quadratic"?"quadratic":n==="antiderivative"?"wave":"cubic";i=l=>xp(o,l);let a=t===0?[0]:t===1?[0]:t===2?[-1.5,0,1.5]:t===3?[-2,-1,0,1,2]:t===4?[2]:t===5?[-1.5,0,1.5]:[-.8,.8];for(let[l,c]of a.entries())e+=ze(se(h=>i(h)+c,-2.35,2.35,l===Math.floor(a.length/2)?"primary":"secondary"),l);t===4&&n==="restore-quadratic"&&(s=bt(Lt(1,3),"(1, 3)")+Xt("C = 2",543,115)),(t===1||t===4)&&n!=="restore-quadratic"&&(s=se(l=>o==="wave"?Math.sin(l):l*l-1,-2.1,2.1,"guide")+Xt("\uC810\uC120: \uB3C4\uD568\uC218",75,72,"tiny")),r=n==="restore-quadratic"?t===4?"f(1)=3 \u2192 f(x)=x\xB2+2":"\uAC19\uC740 \uB3C4\uD568\uC218 2x \xB7 \uC11C\uB85C \uB2E4\uB978 \uC0C1\uC218 C":n==="antiderivative"?"\uBAA8\uD615: \uB3C4\uD568\uC218 sin x \u2192 \uC6D0\uD568\uC218 \u2212cos x + C":"\uBAA8\uD615: \uB3C4\uD568\uC218 x\xB2\u22121 \u2192 \uC6D0\uD568\uC218 x\xB3/3\u2212x+C"}else if(n==="zoom"||n==="secant"){let o=n==="zoom",a=[1.4,1.2,.5,.15,.1,.04,.3][t],l=.45;i=d=>d*d;let c=o?[2,1.5,.65,1,.2,.09,.4][t]:1,h=(d,u)=>[380+(d-l)/c*135,245-(u-l*l)/c*95];if(e=ft([70,245],[690,245],"axis")+ft([380,53],[380,400],"axis")+se(i,l-c*2.1,l+c*2.1,"primary",h)+se(d=>l*l+2*l*(d-l),l-c*2,l+c*2,"guide",h)+bt(h(l,l*l),"A"),o)s=ft(h(l+c,i(l+c)),h(l+c,l*l+2*l*c),"warning")+bt(h(l+c,i(l+c)),"\uACE1\uC120")+Xt("\u03B4 = "+c,79,80),r="\uC774\uCC28\uD568\uC218 \uC608\uC2DC \xB7 |h|\u2264\u03B4\uC5D0\uC11C \uCD5C\uB300 \uCC28\uC774 = \u03B4\xB2 = "+(c*c).toFixed(4);else{let d=l+a,u=l+d;s=se(f=>l*l+u*(f-l),-1.8,2.1,"secondary")+bt(Lt(d,d*d),"B",12,-12,"secant-point")+ft(Lt(l,0),Lt(d,0),"warning")+Xt("h = "+a,90,80),e=hi()+se(i,-1.7,2.05)+se(f=>l*l+2*l*(f-l),-2,2.5,"guide")+bt(Lt(l,l*l),"A"),r=t===3?"h\uB294 0\uC774 \uC544\uB2CC \uC0C1\uD0DC\uB85C \uAC00\uAE4C\uC6CC\uC9C4\uB2E4.":"\uD560\uC120 \uAE30\uC6B8\uAE30 "+u.toFixed(2)+" \u2192 \uC811\uC120 \uAE30\uC6B8\uAE30 "+(2*l).toFixed(2)}}else if(n==="join"){let o=t===0?1.5:0,a=[-.5,-.5,.5,-.8,2,2,2][t];e+=se(l=>l*l,-2.1,1)+se(l=>1+o+a*(l-1),1,3.3,"secondary")+bt(Lt(1,1),"s"),t>=2&&(s=ft(Lt(.3,-.4),Lt(1.8,2.6),t<4?"warning":"guide")+Xt("\uC67C\uCABD \uAE30\uC6B8\uAE30 2",80,83)+Xt("\uC624\uB978\uCABD \uAE30\uC6B8\uAE30 "+a,450,83)),t===6&&(s+=bt(Lt(1.6,2.2),"\uAC19\uC740 \uAE30\uC6B8\uAE30")),t===5&&(s+=$n(...Lt(1,1),25,"secondary")+ft(Lt(.8,0),Lt(.8,1),"guide")+ft(Lt(1.2,0),Lt(1.2,1.4),"guide")),r=t===0?"\uBA3C\uC800 \uD568\uC22B\uAC12\uC758 \uB04A\uAE40\uC744 \uBCF8\uB2E4.":t<4?"\uAC12\uC740 \uAC19\uC544\uB3C4 \uAE30\uC6B8\uAE30\uB294 \uB2E4\uB974\uB2E4.":"P(s)=Q(s), P\u2032(s)=Q\u2032(s)"}else if(n==="ratio"){let o=[.65,.8,1.25,.9,1.1,.75,1.05][t];i=a=>o*(a*a*a-3*a),e+=se(i,-1.9,1.9)+[-1,0,1].map(a=>bt(Lt(a,i(a)))).join(""),s=ft([302,355],[458,355],"secondary")+Xt("1",341,382)+Xt("1",419,382)+ft([380,345],[380,365],"secondary"),t===3&&(s+=ft(Lt(-1,i(-1)),Lt(0,0),"warning")+Xt("\uC218\uD3C9 \uAC70\uB9AC\uC640 \uC0AC\uC120 \uAE38\uC774\uB294 \uB2E4\uB974\uB2E4.",380,68,"warning-label","middle")),r="\uBAA8\uD615: a(x\xB3\u22123x) \xB7 \uB450 \uADF9\uC810\uC758 \uAC00\uC6B4\uB370\uC5D0 \uBCC0\uACE1\uC810"}else if(n==="mean-value")if(t===3)e+=se(o=>Math.abs(o),-2,2)+ft(Lt(-2,2),Lt(2,2),"secondary")+$n(...Lt(0,0),18,"warning"),r="\uBC18\uB840 \uBAA8\uD615 |x| \xB7 \uAD6C\uAC04 \uC548\uC5D0\uC11C \uBBF8\uBD84 \uAC00\uB2A5\uD558\uC9C0 \uC54A\uB2E4.";else{let o=[-1,.1,.5,.5,.5,.5,.8][t];i=a=>a*a/2,e+=se(i,-1.6,2.3)+ft(Lt(-1,.5),Lt(2,2),"secondary"),s=se(a=>o*o/2+o*(a-o),-2.5,2.5,"guide")+bt(Lt(o,i(o)),"c"),r="\uBAA8\uD615 x\xB2/2, [\u22121,2] \xB7 c=1/2\uC5D0\uC11C \uAC19\uC740 \uAE30\uC6B8\uAE30"}else if(n==="chain"||n==="curvature"){let o=n==="chain"?l=>l*l:l=>l*l*l/2,a=n==="chain"?l=>l*l*l/2:l=>l**4/3;if(t===3||t===4)e=mu(hi()+se(o,-1.7,1.7)+bt(Lt(0,0)),hi()+se(a,-1.7,1.7)+bt(Lt(0,0)),n==="chain"?"x\xB2 \xB7 \u2212 \u2192 +":"x\xB3 \xB7 f\u2033: \u2212 \u2192 +",n==="chain"?"x\xB3 \xB7 + \u2192 +":"x\u2074 \xB7 f\u2033: + \u2192 +"),r=n==="chain"?"\uB3C4\uD568\uC218\uC758 \uC601\uC810 \uC774\uD6C4, \uBD80\uD638 \uBCC0\uD654\uB97C \uD655\uC778\uD55C\uB2E4.":"\uC774\uACC4\uB3C4\uD568\uC218 0 \uC774\uD6C4, \uBD80\uD638 \uBCC0\uD654\uB97C \uD655\uC778\uD55C\uB2E4.";else{let l=[-1.4,-.8,0,0,.2,.8,1.2][t];i=n==="chain"?h=>h*h*h/2:h=>h*h*h/2;let c=1.5*l*l;e+=se(i,-1.7,1.7)+se(h=>i(l)+c*(h-l),-2,2,"secondary")+bt(Lt(l,i(l))),r=n==="chain"?"\uD569\uC131\uD568\uC218 \uB3C4\uD568\uC218\uC758 \uACF1 \xB7 \uC601\uC810\uACFC \uADF9\uAC12\uC740 \uBCC4\uB3C4 \uD310\uC815":"\uBAA8\uD615 x\xB3 \xB7 \uC811\uC120\uC758 \uAE30\uC6B8\uAE30\uAC00 \uC904\uB2E4\uAC00 \uB298\uC5B4\uB09C\uB2E4."}}else{let o=t===6?5:3;i=a=>a*a*a-o*a,e+=se(i,-1.9,1.9),t===1&&(e+=se(a=>3*a*a-o,-1.5,1.5,"guide")),t===4&&(e+=se(a=>3*a*a-o,-1.5,1.5,"secondary")),t===5&&(e+=ft(Lt(0,-3),Lt(0,3),"guide")+bt(Lt(0,0))),t>=1&&(s=[-Math.sqrt(o/3),Math.sqrt(o/3)].map(a=>bt(Lt(a,i(a)))).join("")),t>=2&&(s+=yn(Lt(-1.8,1),Lt(-1.3,1),"secondary")+yn(Lt(-.6,-.5),Lt(.1,-.5),"warning")+yn(Lt(1.3,-1),Lt(1.8,-1),"secondary")),t===3&&(e=mu(hi()+se(i,-1.9,1.9),hi()+se(a=>a**3/2,-1.8,1.8)+bt(Lt(0,0)),"\uADF9\uC810: \uBD80\uD638\uAC00 \uBC14\uB01C","\uC815\uC9C0\uC810: \uBD80\uD638\uAC00 \uC548 \uBC14\uB01C"),s=""),r=t===3?"f\u2032(x)=0\uB9CC\uC73C\uB85C\uB294 \uADF9\uAC12\uC744 \uD310\uB2E8\uD560 \uC218 \uC5C6\uB2E4.":"\uBAA8\uD615 x\xB3\u2212"+o+"x \xB7 \uADF9\uC810\uC758 \uC591\uCABD \uBD80\uD638\uB97C \uC77D\uB294\uB2E4."}return e+ze(s,3)+Ae(r)}function av(n){let t=hi()+se(i=>i*i-2,-1.9,2.45),e=_u(n===0?2.1:1.8,[1,1,3,0,4,5,3][n]);return n===3?t+bt(Lt(0,-2),"f\u2032(0)=0")+ft(Lt(-2,-2),Lt(2,-2),"warning")+Ae("\uCD9C\uBC1C\uC810 0 \xB7 \uC811\uC120\uC774 x\uCD95\uACFC \uB9CC\uB098\uC9C0 \uC54A\uB294\uB2E4."):(e.forEach((i,s)=>{t+=ze(Oe([Lt(i.x,i.y),Lt(i.next,0),Lt(i.next,i.next*i.next-2)],s===e.length-1?"primary":"secondary")+bt(Lt(i.x,i.y)),s)}),t+Ae("\uBAA8\uD615 x\xB2\u22122 \xB7 x\u2099\u208A\u2081 = x\u2099 \u2212 f(x\u2099)/f\u2032(x\u2099)"))}function lv(n,t){let e=n==="tangent-merge"?[.6,.8,.5,1,1,.7,.4][t]:[.35,.5,.7,1.3,.25,.35,.9][t],i=1,s=l=>2*l*l*l-3*i*l*l+e,r=[];for(let l of[0,1])Math.abs(s(l))<1e-10&&r.push(l);for(let[l,c]of[[-2,0],[0,1],[1,3]]){let h=l,d=c;if(!(s(h)*s(d)>=0)){for(let u=0;u<50;u++){let f=(h+d)/2;s(h)*s(f)<=0?d=f:h=f}r.push((h+d)/2)}}let o=hi()+se(l=>l**3,-1.45,1.6);return(t===0?r.slice(0,1):r).forEach((l,c)=>o+=ze(se(h=>3*l*l*h-2*l**3,-2.5,2.8,"secondary")+bt(Lt(l,l**3)),c)),o+=bt(Lt(i,e),"P(1, "+e+")",14,24),t===4&&(o+=ft([180,380],[620,380],"axis"),r.forEach(l=>o+=bt([340+l*110,380]))),o+Ae(t===3&&n==="tangent-merge"?"\uACBD\uACC4 \xB7 \uC11C\uB85C \uB2E4\uB978 \uC811\uC810 2\uAC1C \xB7 \uD55C \uC811\uC810\uC740 \uC911\uADFC":"\uC11C\uB85C \uB2E4\uB978 \uC811\uC810 "+r.length+"\uAC1C \xB7 2t\xB3\u22123t\xB2+b=0")}function cv(n){let t=[1,2,-67,-68,672,0],e=[-8,-4,0,3,7],i=[e],s=t;for(let a=0;a<4;a++)i.push(xu(s,i.at(-1))),s=lc(s);let r="",o=[1,2,4,2,5,5,4][n];return i.slice(0,o).forEach((a,l)=>{let c=96+l*62;r+=ft([91,c],[665,c],"axis")+Xt(l===0?"f":"f"+"\u2032".repeat(l),50,c+5,"tiny"),a.forEach((h,d)=>{let u=[380+h*30,c];r+=ze(bt(u,l===0?String(h):""),l+d),l>0&&(r+=Oe([[380+i[l-1][d]*30,c-62],u,[380+i[l-1][d+1]*30,c-62]],"guide"))})}),n===3&&(r+=$n(380,96,17,"warning")+Xt("\uC11C\uB85C \uB2E4\uB978 \uC2E4\uADFC \uC870\uAC74",380,309,"warning-label","middle")),r+Ae("\uC608\uC2DC: (x+8)(x+4)x(x\u22123)(x\u22127) \xB7 \uADFC\uC758 \uC704\uCE58\uB97C \uB530\uB85C \uACC4\uC0B0")}function hv(n){let t=[.65,.65,1,.75,1.12,.9,.85][n],e=(o,a)=>[380+o*114*t,235-a*46*t],i=o=>o*(o*o-1),s="",r=(o,a,l)=>Oe([e(o,0),...Array.from({length:51},(c,h)=>{let d=o+(a-o)*h/50;return e(d,i(d))}),e(a,0)],l,!0);return s+=r(-1,0,"positive-fill")+r(0,1,"negative-fill")+se(i,-1.5,1.5,"primary",e)+ft(e(-2,0),e(2,0),"axis"),n>=1&&(s+=Xt("\uC0BC\uCC28\uD568\uC218\uC758 \uD45C\uC900\uD654 \uBAA8\uD615",380,67,"label","middle")),n===3&&(s+=Xt("\uAC19\uC740 \uACBD\uACC4\uB97C \uC720\uC9C0\uD574\uC57C \uAC19\uC740 \uBE44\uC728\uC744 \uBE44\uAD50\uD55C\uB2E4.",380,102,"warning-label","middle")),n>=4&&([4,4,5,3,8,7,1].forEach((o,a)=>s+=ze('<rect x="'+(225+a*44)+'" y="'+(385-o*6)+'" width="27" height="'+o*6+'" class="wash" data-rise=""/>'+Xt(String(o),238+a*44,404,"tiny","middle"),a)),s+=Xt("\uD559\uC0DD \uAE30\uB85D\uC5D0 \uC81C\uC2DC\uD55C \uC77C\uACF1 \uB113\uC774\uBE44 \xB7 \uACBD\uACC4\uC640 \uD568\uAED8 \uC77D\uAE30",380,302,"tiny","middle")),s+Ae("\uC0BC\uCC28\uD568\uC218\uC758 \uAC00\uB85C n \xB7 \uC138\uB85C |a|n\xB3 \u2192 \uB113\uC774 \uACF5\uD1B5 \uBC30\uC728 |a|n\u2074")}function uv(n){let t=a=>a+1,e=a=>(a+1)/(a-1),i=(a,l)=>[110+(a-1)*370,345-l*48],s=(a,l=!1)=>ft([100,345],[650,345],"axis")+ft([110,65],[110,365],"guide")+se(a,1.02,2.45,l?"warning":"primary",i),r=s(n===3?e:t,n===3);return[[],[1.5,1.25],[1.2,1.1,1.05,1.01],[1.5,1.2,1.1],[1.25,1.125,1.0625],[1.4],[1.6,1.05]][n].forEach((a,l)=>r+=ze(bt(i(a,n===3?e(a):t(a))),l)),n===5?r=mu(s(t),s(e,!0),"0/0 \u2192 2","2/0\u207A \u2192 +\u221E"):n===3?r+=Xt("(x+1)/(x\u22121)",418,98,"warning-label")+Xt("\uBBF8\uBD84\uD55C \uBE44 1 \u2260 \uC6D0\uB798 \uADF9\uD55C +\u221E",380,78,"warning-label","middle"):r+=Xt("(x\xB2\u22121)/(x\u22121) = x+1",295,82)+ft([110,249],[645,249],"guide")+$n(110,249,6,"primary"),n===4&&(r+=Oe([[190,325],[325,325],[460,325]],"secondary")+$n(190,325,17,"secondary")+$n(325,325,17,"secondary")+$n(460,325,17,"secondary")),r+Ae(n===3?"2/0\uD615 \xB7 \uAC19\uC740 \uBBF8\uBD84 \uACC4\uC0B0\uC744 \uC801\uC6A9\uD560 \uC218 \uC5C6\uB2E4.":n===5?"\uD615\uD0DC \uD655\uC778 \u2192 \uC801\uC6A9 \uC870\uAC74 \uD655\uC778 \u2192 \uB3C5\uB9BD\uC801\uC778 \uAC80\uC0B0":"0/0\uD615 \xB7 \uC870\uAC74 \uD655\uC778 \uB4A4, \uADF9\uD55C\uAC12 2")}function dv(n){let t=[.2,.7,1.2,1.7,2.2,2.7],e=t.map(l=>.7+.6*l+.09*Math.sin(4*l)),i=(l,c)=>[140+l*170,350-c*110],s=[l=>.7+.6*l,l=>.65*Math.exp(.6*l),l=>2.8/(1+Math.exp(-2*(l-1.2)))],r=ft([115,350],[667,350],"axis")+ft([140,54],[140,368],"axis"),o=n===0||n===5?1:n===1||n===3||n===4?3:2,a=n===3?2:n===5?0:1;return s.slice(0,o).forEach((l,c)=>r+=ze(se(l,0,2.9,c===0?"primary":"secondary",i),c)),t.forEach((l,c)=>{if(r+=bt(i(l,e[c])),n>=2&&(r+=ft(i(l,e[c]),i(l,s[a](l)),"warning")),n===4){let h=Math.abs(e[c]-s[1](l))*35;r+='<rect x="'+(174+c*74)+'" y="'+(390-h)+'" width="25" height="'+h+'" class="wash" data-rise=""/>'}}),r+Xt("\uC804\uC2DC \uC124\uBA85\uC744 \uC704\uD55C \uAC00\uC0C1 \uC790\uB8CC",380,68,"tiny","middle")+Ae(n>=4?"\uC794\uCC28 \u2192 \uAC19\uC740 \uC624\uCC28 \uAE30\uC900\uC73C\uB85C \uBE44\uAD50":"\uC77C\uCC28 \xB7 \uC9C0\uC218 \xB7 \uB85C\uC9C0\uC2A4\uD2F1 \uD6C4\uBCF4 \xB7 \uC2E4\uC81C \uCE21\uC815 \uC790\uB8CC \uC544\uB2D8")}var vp=(n=280,t="wash")=>Oe([[148,n+30],[450,n-58],[631,n+25],[330,n+113]],t,!0);function fv(n,t){let e=vp(),i="",s=n==="plane-distance"?[99,137,90,174,122,151,110][t]:99,r=[355-(286-s)*.13,s],o=[355,286];if(n==="line-plane"){let a=t===0||t===1||t===2?0:t===3?1:t===4||t===5?2:1,l=a===0?100:0,c=a===2?83:0;t>=1&&(e+=yn([465,293],[465,100],"secondary")+Xt("n",475,111));let h=t===2?145:l;e+=ft([190,174+c-h],[597,174+c+h],"primary","line-direction")+bt([380,174+c],"P",12,-12,"line-anchor"),t===5&&(e+=ft([220,184],[565,184],"warning")+bt([440,184],"\uD3C9\uBA74 \uBC16",12,-12)),t===3&&(e+=ft([170,283],[627,283],"guide")),i=["\uAD50\uCC28 \xB7 n\xB7v \u2260 0","\uD3C9\uD589 \xB7 n\xB7v = 0, P\uB294 \uD3C9\uBA74 \uBC16","\uD3EC\uD568 \xB7 n\xB7v = 0, P\uB294 \uD3C9\uBA74 \uC704"][a]}else if(n==="overlap"){let a=[145,110,55,0,0,0,60][t],l=[330+a,176],c=[355+a,286];e+=bt(r,"A")+bt(l,"B")+ft(r,o,"guide")+ft(l,c,"guide")+bt(o,"A\u2032",-30,25)+(a>0?bt(c,"B\u2032",12,25):$n(...o,14,"secondary"))+yn([595,98],[620,210],"secondary"),(t===3||t===4)&&(e+=ft(r,l,"warning")+Xt("\uB2E4\uB978 \uB450 \uC810",375,65,"warning-label","middle")),i=a===0?"\uCC28\uBCA1\uD130\uAC00 \uAD00\uCC30 \uBC29\uD5A5\uACFC \uB098\uB780\uD574\uC838 \uD22C\uC601\uC774 \uACB9\uCE5C\uB2E4.":"\uAD00\uCC30 \uBC29\uD5A5\uC740 \uACE0\uC815 \xB7 \uB450 \uC810\uC758 \uD22C\uC601 \uC704\uCE58\uB97C \uBE44\uAD50"}else{let a=[485,485,560,465,355,355,440][t],l=[a,286+.1*(a-355)];e+=bt(r,"P")+bt(o,"H",-24,26)+(t>=1?ft(r,o,"guide","distance-drop"):""),n==="minimum"?e+=bt(l,"Q",10,20)+ft(r,l,t===4?"secondary":"primary")+ft(o,l,"secondary"):e+=yn(o,[332,110],"secondary","normal-vector")+Xt("\uBC95\uC120 n",402,126)+(t>=2?ft(r,[520,300],"ghost"):""),e+=Oe([[352,265],[371,270],[374,288]],"secondary"),t===3&&(e+=Xt(n==="minimum"?"\uBE57\uBCC0 \u2265 \uC218\uC120":"\uBC95\uC120 \uBCA1\uD130\uB97C \uB2E8\uC704 \uAE38\uC774\uB85C",380,63,"warning-label","middle")),i=n==="minimum"?"PQ\xB2 = PH\xB2 + HQ\xB2 \u2265 PH\xB2":n==="plane-distance"?"\uBC95\uC120 \uBC29\uD5A5 \uC131\uBD84 \xF7 \uBC95\uC120\uC758 \uD06C\uAE30 = \uAC70\uB9AC":"\uD55C \uBC29\uD5A5\uC73C\uB85C \uBD84\uB9AC\uD558\uBA74 \uC218\uC120\uC774 \uB0A8\uB294\uB2E4."}return e+Ae(i)}function pv(n){let t=[170,325],e=[610,105],i=[.3,.3,.65,1.16,.5,.75,.4][n],s=t.map((o,a)=>(1-i)*o+i*e[a]),r=Oe([t,[610,325],e],"guide")+ft(t,e)+bt(t,"A",-24,25)+bt(e,"B")+bt(s,"P",12,25,"space-moving-point");return n>=1&&(r+=Oe([t,[s[0],325],s],"secondary")+Xt("x \xB7 y \xB7 z \uB97C \uAC19\uC740 \uBE44\uC728\uB85C",380,65,"label","middle")),n===3&&(r+=ft(e,s,"warning")),r+Ae("\u03BB = "+i+" \xB7 "+(i>1?"\uC678\uBD84: \uC120\uBD84 \uBC16":"\uB0B4\uBD84: \uC120\uBD84 \uC548"))}function mv(n,t){let r=n==="sphere-slice"?[.2,.45,.65,1.13,.5,.72,.3][t]:n==="dimension"?[0,.25,.5,1,.6,.75,.4][t]:[.2,.4,.7,-.65,.9,1,.45][t],o=$n(380,224,141,"ghost")+Rn(380,224,141,39,"ghost")+Rn(380,224,51,141,"ghost"),a="";if(n==="sphere-extreme"){let l=[2.6,2.1,1.4,.9,.3,0,1][t],c=[380+141*Math.cos(l),224-141*Math.sin(l)],h=[c[0],365];o+=yn([180,365],[580,365],"secondary")+ft([380,224],c)+bt(c,"P",12,-12,"sphere-point")+ft(c,h,"guide","sphere-shadow")+bt(h,"\uC0AC\uC601",-15,30)+ft([380,365],h,"primary")+bt([380,224],"C"),t===3&&(o+=Rn(380,224,141*1.3,141*.7,"warning")+Xt("\uD0C0\uC6D0\uCCB4\uB85C \uADF8\uB300\uB85C \uD655\uC7A5\uD560 \uC218 \uC788\uC744\uAE4C?",380,54,"warning-label","middle")),a="\uAD6C\uC758 \uBC18\uC9C0\uB984 \uBC29\uD5A5\uC744 \uACE0\uC815\uCD95\uC5D0 \uC815\uC0AC\uC601\uD55C\uB2E4."}else{let l=224-r*141,c=Math.sqrt(Math.max(0,1-r*r))*141;if(o+=vp(l-50,"plane-wash"),r<=1&&(o+=Rn(380,l,c,c*.26,"primary",'data-morph="slice-ring"')+(t>=2?Rn(380,l,c,c*.26,"wash"):"")+ft([380,224],[380,l],"guide","slice-depth")+ft([380,l],[380+c,l],"secondary","slice-radius")+ft([380,224],[380+c,l],"secondary","slice-hypotenuse")+bt([380,224],"O")+bt([380,l],"H",-25,-12),t===2||t===4))for(let h=0;h<8;h++)o+=ze(bt([380+c*Math.cos(h*Math.PI/4),l+c*.26*Math.sin(h*Math.PI/4)]),h);t===3&&n==="sphere-slice"&&(o+=$n(380,83,5,"warning")+Xt("d=R: \uD55C \uC810 / d>R: \uB9CC\uB098\uC9C0 \uC54A\uC74C",380,64,"warning-label","middle")),a=n==="dimension"?"\uD574\uC124 \uBAA8\uD615: \uD55C \uC88C\uD45C \uACE0\uC815 \u2192 \uBC18\uC9C0\uB984 \u221A(R\xB2\u2212d\xB2)\uC758 \uB0AE\uC740 \uCC28\uC6D0 \uAD6C":r>1?"d > R \xB7 \uC2E4\uC218 \uBC18\uC9C0\uB984\uC744 \uAC16\uB294 \uB2E8\uBA74\uC774 \uC5C6\uB2E4.":"d/R = "+r+" \xB7 r/R = "+Math.sqrt(1-r*r).toFixed(3)}return o+Ae(a)}function gv(n){let t=[.15,.3,.85,Math.PI/2,Math.PI/3,.65,.45][n],e=150*Math.cos(t),i=[[230,105],[530,105],[570,105+e],[270,105+e]],s=[[230,290],[530,290],[570,290+e*.4],[270,290+e*.4]],r=Oe(s,"wash",!0,"shadow-face")+Oe(i,"primary",!0,"original-face");return i.forEach((o,a)=>r+=ze(ft(o,s[a],"guide","projection-ray-"+a)+bt(o),a)),r+=Xt("\uC6D0\uB798 \uBA74",570,106)+Xt("\uC815\uC0AC\uC601",570,337)+yn([145,130],[145,320],"secondary"),r+Ae("\u03B8 = "+Math.round(t*180/Math.PI)+"\xB0 \xB7 \uADF8\uB9BC\uC790 \uB113\uC774 / \uC6D0\uB798 \uB113\uC774 = "+Math.abs(Math.cos(t)).toFixed(3))}function _v(n,t){let e=n==="conic-boundary",i=n==="focal"&&t>=3||e&&t===2,s=e&&t===3,r=2.25,o=1.45,a=Math.sqrt(r*r-o*o),l=[.4,.7,1.05,.2,1.4,1.1,.55][t],c="",h=Lt(-o,0),d=Lt(o,0);if(s)c=ft(h,d,"warning")+Xt("\uAC70\uB9AC\uC758 \uD569 = \uCD08\uC810 \uC0AC\uC774 \uAC70\uB9AC",380,93,"warning-label","middle");else if(i){c+=se(p=>Math.sqrt(o*o-1.1*1.1)*Math.sqrt(Math.max(0,p*p/(1.1*1.1)-1)),1.1,2.8)+se(p=>-Math.sqrt(o*o-1.1*1.1)*Math.sqrt(Math.max(0,p*p/(1.1*1.1)-1)),1.1,2.8)+se(p=>Math.sqrt(o*o-1.1*1.1)*Math.sqrt(Math.max(0,p*p/(1.1*1.1)-1)),-2.8,-1.1)+se(p=>-Math.sqrt(o*o-1.1*1.1)*Math.sqrt(Math.max(0,p*p/(1.1*1.1)-1)),-2.8,-1.1);let u=[.2,.4,.5,.3,.65,.9,.45][t],f=Lt(1.1*Math.cosh(u),Math.sqrt(o*o-1.1*1.1)*Math.sinh(u));c+=ft(h,f,"secondary")+ft(f,d,"primary")+bt(f,"P")}else{c+=Rn(380,254,r*78,a*48);let u=Lt(r*Math.cos(l),a*Math.sin(l));t>0&&(c+=ze(ft(h,u,"secondary")+ft(u,d,"primary")+bt(u,"P"),2))}return c+=bt(h,"F\u2081",-12,26)+bt(d,"F\u2082",-12,26),c+Ae(s?"\uACBD\uACC4\uC5D0\uC11C\uB294 \uC120\uBD84\uC73C\uB85C \uD1F4\uD654\uD55C\uB2E4.":i?"\uC608\uC2DC \uC30D\uACE1\uC120 \xB7 |PF\u2081\u2212PF\u2082| = \uC77C\uC815":"\uC608\uC2DC \uD0C0\uC6D0 \xB7 PF\u2081+PF\u2082 = \uC77C\uC815")}function xv(n){let t=[.65,.8,.8,.8,.8,1,.65][n],e=[1.2,1.1,.6,-1.2,1.5,1.1,.5][n],i=l=>l*l/(4*t),s=Lt(e,i(e)),r=Lt(0,t),o=Lt(e,-t),a=hi()+se(i,-2.55,2.55)+bt(r,"F")+ft(Lt(-3.1,-t),Lt(3.1,-t),"guide")+Xt("\uC900\uC120 y=\u2212p",75,254+t*48+26);return n>=1&&(a+=ze(ft(r,s,"primary")+ft(s,o,"secondary")+bt(s,"P")+bt(o,"H",8,25),2)),n===3&&(a+=ft(s,Lt(-2,-t),"warning")+Xt("\uC900\uC120 \uC704 \uC784\uC758 \uC810\uAE4C\uC9C0\uC758 \uAC70\uB9AC\uC640\uB294 \uB2E4\uB974\uB2E4.",380,66,"warning-label","middle")),a+Ae("\uCD08\uC810 \uAC70\uB9AC = \uC900\uC120\uAE4C\uC9C0\uC758 \uC218\uC9C1 \uAC70\uB9AC \xB7 x\xB2 = 4py")}function yv(n){let t=[2.25,2.25,2.25,1.3,2.25,2.25,2.25][n],e=1.3,i=Math.sqrt(Math.max(0,t*t-e*e)),s=[.3,.5,1.1,.1,1.8,2.1,.8][n],r=[380+t*95*Math.cos(s),232-i*65*Math.sin(s)],o=[380-e*95,232],a=[380+e*95,232],l=Rn(380,232,t*95,i*65,"primary",'data-morph="ellipsoid-section"')+Rn(380,232,t*95,i*24,"ghost")+Rn(380,232,t*30,i*65,"ghost")+bt(o,"F\u2081",-12,25)+bt(a,"F\u2082",-12,25);return n>=1&&(l+=ze(ft(o,r,"secondary")+ft(a,r,"primary")+bt(r,"P"),2)),n===4&&(l+=Rn(380,232,t*95,i*30,"secondary",'transform="rotate(-25 380 232)"')),l+Ae(n===3?"a=c \xB7 \uD68C\uC804\uD0C0\uC6D0\uCCB4\uAC00 \uC120\uBD84\uC73C\uB85C \uD1F4\uD654\uD55C\uB2E4.":"\uC608\uC2DC \uD68C\uC804\uD0C0\uC6D0\uCCB4 \xB7 \uB450 \uCD08\uC810\uAE4C\uC9C0 \uAC70\uB9AC\uC758 \uD569 = 2a")}function vv(n,t){let e=n==="cone-discriminant",i=e?[.35,.65,.92,1,1.25,1.15,.7][t]:[0,.4,.7,1,1.28,.9,.3][t],s=.5,r=(l,c,h)=>[380+75*l+35*c,224-70*h+18*c],o="";for(let l of[-1,1]){let c=[];for(let h=0;h<=120;h++){let d=h/120*Math.PI*2;c.push(r(2*Math.cos(d),2*Math.sin(d),2*l))}o+=Oe(c,"ghost");for(let h of[Math.atan2(35,75),Math.atan2(35,75)+Math.PI])o+=ft(r(0,0,0),r(2*Math.cos(h),2*Math.sin(h),2*l),"ghost")}o+=Oe([r(-2,-2,-2*i+s),r(2,-2,2*i+s),r(2,2,2*i+s),r(-2,2,-2*i+s)],"plane-wash",!0,"cut-plane");for(let l of[1,-1]){let c=[];for(let h=0;h<=360;h++){let d=h/360*Math.PI*2,u=l*s/(1-l*i*Math.cos(d));u>0&&u<2?c.push(r(u*Math.cos(d),u*Math.sin(d),l*u)):c.length&&(c.length>1&&(o+=Oe(c)),c=[])}c.length>1&&(o+=Oe(c))}let a=i===0?"\uC6D0":i<1?"\uD0C0\uC6D0":i===1?"\uD3EC\uBB3C\uC120":"\uC30D\uACE1\uC120";return t>=3&&(o+=Xt("\uC808\uB2E8 \uC870\uAC74: "+a,380,47,t===3?"warning-label":"label","middle")),o+Ae(e?"\uC608\uC2DC k=1 \xB7 1\u2212m\xB2 = "+(1-i*i).toFixed(3)+" \xB7 "+a:"\uC6D0\uBFD4\uACFC \uC808\uB2E8\uD3C9\uBA74\uC758 \uAD50\uC120 \xB7 "+a)}function Mv(n){let t=[.65,.65,1.1,0,.55,.8,.3][n],e=2.2,i=1.4,s=Lt(e*Math.cos(t),i*Math.sin(t)),r=[-e*Math.sin(t),i*Math.cos(t)],o=Rn(380,254,e*78,i*48)+bt(s,"P",12,-12,"tangent-point");return n>=1&&(o+=ze(ft([s[0]-r[0]*156,s[1]+r[1]*96],[s[0]+r[0]*156,s[1]-r[1]*96],"secondary"),2)),n===3&&(o+=Xt("x=a \xB7 \uC218\uC9C1 \uC811\uC120",380,75,"warning-label","middle")),n>=4&&(o+=$n(...s,22,"secondary")+Xt("D=0 \xB7 \uAC19\uC740 \uAD50\uC810\uC774 \uB450 \uBC88",380,354,"label","middle")),o+Ae(n===3?"\uAE30\uC6B8\uAE30\uB85C \uD45C\uD604\uD560 \uC218 \uC5C6\uC5B4\uB3C4 \uC911\uADFC \uC870\uAC74\uC740 \uB0A8\uB294\uB2E4.":"\uD0C0\uC6D0 \uC704 \uC811\uC810 \xB7 xx\u2081/a\xB2 + yy\u2081/b\xB2 = 1")}function bv(n){let t=[.55,.7,Math.PI/2,2.2,2.6,2.05,1.2][n],e=[320,289],i=[320+210*Math.cos(t),289-170*Math.sin(t)],s=[i[0],289],r=yn(e,[620,289],"secondary")+yn(e,i,"primary","moving-vector")+bt(e,"O",-25,25);return n>=1&&(r+=ft(i,s,"guide","vector-drop")+ft(e,s,n>2?"warning":"primary","vector-component")+bt(s)),r+=Xt("u",640,294)+Xt("v",i[0]+14,i[1]-14),r+Ae("\u03B8 = "+Math.round(t*180/Math.PI)+"\xB0 \xB7 cos \u03B8 = "+Math.cos(t).toFixed(3)+" \xB7 \uB0B4\uC801 "+(Math.abs(Math.cos(t))<1e-8?"0":t>Math.PI/2?"\uC74C\uC218":"\uC591\uC218"))}function Sv(n){let t=[0,Math.PI/12,Math.PI/4,Math.PI/2,Math.PI/4,Math.PI/6,Math.PI/5][n],e=Math.cos(t),i=Math.sin(t),s=hi()+se(l=>l*l,-1.75,1.75,"ghost"),r=Lt(0,0),o=(l,c)=>Lt(e*l-i*c,i*l+e*c);s+=yn(o(-2.5,0),o(2.5,0),"primary","axis-x")+yn(o(0,-2.5),o(0,3.3),"secondary","axis-y");let a=Lt(1,1);return s+=bt(a,"\uACE0\uC815\uB41C \uC810")+ft(r,a,"guide"),n>=2&&(s+=Xt("X",...o(2.6,0))+Xt("Y",...o(0,3.5))),s+Ae("\uC88C\uD45C\uCD95 \uD68C\uC804 "+Math.round(t*180/Math.PI)+"\xB0 \xB7 XY \uACC4\uC218 \u2212sin(2\u03B8) = "+(-Math.sin(2*t)).toFixed(3))}function Tv(n){let e=(a,l)=>[380+a*92,340-l*68],i=a=>a*a/3.6,s=e(0,.9),r=se(i,-2.8,2.8,"primary",e)+bt(s,"F");return(n===0?[-1.6]:n===1?[-1.6]:n===2?[-2,-1,1,2]:n===3?[0]:[-2.3,-1.2,.8,2]).forEach((a,l)=>{let c=e(a,i(a));if(r+=ze(ft([c[0],57],c,"secondary")+(n>=2?yn(c,s):"")+bt(c),l),n===1){let h=a/1.8;r+=ft([c[0]-70,c[1]+70*h*68/92],[c[0]+70,c[1]-70*h*68/92],"guide")}}),r+Ae(n===3?"\uAF2D\uC9D3\uC810\uC5D0\uC11C\uB294 \uC785\uC0AC\uAD11\uACFC \uBC18\uC0AC\uAD11\uC774 \uCD95 \uC704\uC5D0\uC11C \uACB9\uCE5C\uB2E4.":"\uD3EC\uBB3C\uC120\uC758 \uCD95\uACFC \uD3C9\uD589\uD55C \uC785\uC0AC\uAD11 \u2192 \uCD08\uC810 F")}function Ev(n){let t=[1.6,2.1,2.8,2.1,3.7,4.4,2.8][n],e=(o,a)=>[380+o*57,260-a*43],i=ft(e(-4.8,-4.8),e(4.8,4.8),"guide")+ft(e(-4.8,4.8),e(4.8,-4.8),"guide");if(n===3)return i=hi()+se(o=>.5*o*o,-2.5,2.5)+se(o=>o+1,-2.5,2.5,"warning")+Ae("\uD55C \uC9C1\uC120\uACFC \uBA87 \uC810\uC758 \uAC70\uB9AC\uB9CC\uC73C\uB85C \uC77C\uBC18\uD654\uD560 \uC218 \uC5C6\uB2E4."),i;for(let o of[-1,1])for(let a of[-1,1])i+=se(l=>o*Math.sqrt(l*l-1),a<0?-4.6:1,a<0?-1:4.6,"primary",e);let s=e(t,Math.sqrt(t*t-1)),r=e(t,t);return i+=bt(s,"\uACE1\uC120",15,16)+ft(s,r,"warning")+bt(r,"\uC9C1\uC120",15,-12),i+Ae("\uC608\uC2DC x\xB2\u2212y\xB2=1 \xB7 \uC218\uC9C1 \uD2C8 x\u2212\u221A(x\xB2\u22121) = "+(t-Math.sqrt(t*t-1)).toFixed(4))}function wv(n){let t=r=>Math.log(2)/Math.log(1+r/100),e=(r,o)=>[105+(r-1)*40,367-o*4.3],i=[8,8,4,1.5,12,8,6][n],s=ft([100,367],[694,367],"axis")+se(t,1.1,15,"primary",e)+se(r=>72/r,1.1,15,"guide",e)+bt(e(i,t(i)),"\uC815\uD655\uAC12",16,25);if(n>=1&&(s+=ft(e(i,t(i)),e(i,72/i),"warning")+bt(e(i,72/i),"72/r",16,-12)),n===4)for(let r of[2,4,6,8,10,12,14])s+=ft(e(r,t(r)),e(r,72/r),"warning");return s+Ae("r="+i+"% \xB7 \uC815\uD655 "+t(i).toFixed(3)+"\uB144 / 72\uC758 \uBC95\uCE59 "+(72/i).toFixed(3)+"\uB144")}function Av(n){let t=[-.9,-.9,.2,.7,.7,-.4,.3][n],e=(o,a,l)=>[380+o*80+a*35,320+a*30-l*18],i=(o,a)=>o*o+2*a*a,s="";for(let o=-2;o<=2;o+=.4){let a=[];for(let l=-2.1;l<=2.1;l+=.06)a.push(e(l,o,i(l,o)));s+=Oe(a,"ghost")}for(let o=-2;o<=2;o+=.4){let a=[];for(let l=-2;l<=2;l+=.06)a.push(e(o,l,i(o,l)));s+=Oe(a,"ghost")}let r=[];for(let o=-2.1;o<=2.1;o+=.05)r.push(e(o,t,i(o,t)));if(s+=ze(Oe(r),2),n>=1&&(s+=Oe([e(-2.2,t,-1),e(2.2,t,-1),e(2.2,t,8),e(-2.2,t,8)],"plane-wash",!0,"slice-plane")),n>=4){let a=e(.85,t,i(.85,t)),l=2*.85;s+=ft(e(-.5,t,i(.85,t)+l*(-.5-.85)),e(2,t,i(.85,t)+l*(2-.85)),"secondary","slice-tangent")+bt(a)}return s+Ae("z=x\xB2+2y\xB2 \xB7 y="+t+"\uB97C \uACE0\uC815\uD55C \uB2E8\uBA74 \xB7 x \uBC29\uD5A5 \uAE30\uC6B8\uAE30 2x")}function Mp(n,t){let e=ac(n),i=Math.max(0,Math.min(6,Math.trunc(t))),s=e.family,r;if(["zoom","secant","join","ratio","mean-value","chain","curvature","extrema","restore","restore-quadratic","antiderivative"].includes(s))r=ov(s,i);else if(["line-plane","overlap","minimum","plane-distance"].includes(s))r=fv(s,i);else if(["sphere-slice","sphere-extreme","dimension"].includes(s))r=mv(s,i);else if(["focal","conic-boundary"].includes(s))r=_v(s,i);else if(["cone-cut","cone-discriminant"].includes(s))r=vv(s,i);else if(["tangents","tangent-merge"].includes(s))r=lv(s,i);else{let h={riemann:iv,volume:sv,signed:rv,newton:av,rolle:cv,"area-scale":hv,limits:uv,model:dv,"space-points":pv,projection:gv,parabola:xv,ellipsoid:yv,"conic-tangent":Mv,dot:bv,rotation:Sv,reflection:Tv,asymptote:Ev,compound:wv,surface:Av};if(!h[s])throw Error("\uB3C4\uD574\uAC00 \uC5C6\uB294 \uC7A5\uBA74 "+s);r=h[s](i)}let o={calculus:"#ffb47f",geometry:"#b5c5ff",economics:"#91e5c6"}[n.subjectKey]||"#b5c5ff",a='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 760 470" aria-hidden="true" focusable="false" data-family="'+s+'" data-phase="'+i+'"><style>.primary,.secondary,.guide,.axis,.ghost,.warning{fill:none;stroke-linecap:round;stroke-linejoin:round}.primary{stroke:'+o+";stroke-width:2.5}.secondary{stroke:#e2ebfa;stroke-width:1.5;opacity:.8}.guide{stroke:#a5b3cd;stroke-width:1.2;stroke-dasharray:5 7;opacity:.7}.axis{stroke:#a5b3cd;stroke-width:.8;opacity:.25}.ghost{stroke:#b6c4df;stroke-width:1;opacity:.23}.warning{stroke:#ffd593;stroke-width:2;stroke-dasharray:4 5}.node{fill:"+o+";stroke:#fff4e5;stroke-width:1.1}.wash{fill:"+o+";fill-opacity:.12;stroke:"+o+";stroke-width:1}.plane-wash{fill:#b5c5ff;fill-opacity:.07;stroke:#c1cbdf;stroke-opacity:.4;stroke-width:1}.positive-fill{fill:"+o+";fill-opacity:.26;stroke:"+o+';stroke-width:1}.negative-fill{fill:#86b2ef;fill-opacity:.27;stroke:#86b2ef;stroke-width:1}.warning-fill{fill:#ffd593;fill-opacity:.25;stroke:#ffd593;stroke-width:1}.label,.metric,.tiny,.warning-label{font-family:"Malgun Gothic","Apple SD Gothic Neo",sans-serif;fill:#e3ebfa;font-weight:400}.label{font-size:15px}.metric{font-size:15px;fill:#f5f6fb}.tiny{font-size:12px;fill:#a9bad5}.warning-label{font-size:15px;fill:#ffd593}</style>'+r+"</svg>",c=(r.match(/class="metric"[^>]*>([^<]+)</)?.[1]||e.focus).replace(/&amp;/g,"&").replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&quot;/g,'"').replace(/&#39;/g,"'");return{svg:_p(a,{id:n.id+"-"+i,light:o}),phase:i,family:s,headline:e.beats[i],focus:e.focus,annotation:c}}var Us=(n,t=.22)=>.5-.5*Math.cos(n*t);function cc(n,t){return Math.abs(t)>n?null:Math.sqrt(Math.max(0,n*n-t*t))}function Rv(n,t,e){let i=Math.sqrt(n*n-t*t);return[n*Math.cos(e),i*Math.sin(e)]}function Cv(n){let t=i=>2*i*i*i-3*i*i+n,e=[];for(let i of[0,1])Math.abs(t(i))<1e-9&&e.push(i);for(let[i,s]of[[-4,0],[0,1],[1,4]]){let r=i,o=s;if(!(t(r)*t(o)>=0)){for(let a=0;a<50;a++){let l=(r+o)/2;t(r)*t(l)<=0?o=l:r=l}e.push((r+o)/2)}}return e.sort((i,s)=>i-s)}function bp(n,t,e=0){let i=[],s=[],r=[],o={},a=Us(t),l=t*.18+.55,c=Math.max(0,Math.min(6,Math.round(e))),h=v=>{let S=Math.max(0,Math.min(6,e)),_=Math.floor(S),T=S-_;return v[_]*(1-T)+v[Math.min(6,_+1)]*T},d=(v,S)=>[380+v*88,262-S*53],u=(v,S="primary",_=!1)=>i.push({points:v,role:S,closed:_}),f=(v,S="",_="primary")=>{s.push({point:v,role:_}),S&&r.push({point:[v[0]+11,v[1]-13],text:S})},p=(v,S)=>r.push({text:v,point:S}),x=(v,S=-2.5,_=2.5,T="primary",R=d)=>{let P=[];for(let D=0;D<=160;D++){let k=S+(_-S)*D/160,L=R(k,v(k));!L.every(Number.isFinite)||L[1]<38||L[1]>394?(P.length>1&&u(P,T),P=[]):P.push(L)}P.length>1&&u(P,T)},g=(v,S="primary")=>u(v.map(_=>d(..._)),S),m=()=>{u([[80,262],[689,262]],"axis"),u([[380,46],[380,391]],"axis")},E=(v,S,_,T="secondary",R=d)=>{x(P=>v(_)+S(_)*(P-_),-2.8,2.8,T,R),f(R(_,v(_)),"P")},C=(v,S)=>g(Array.from({length:181},(_,T)=>{let R=T/180*2*Math.PI;return[v*Math.cos(R),S*Math.sin(R)]})),M="",w="\uC218\uC2DD\uC73C\uB85C \uACC4\uC0B0\uD55C \uC804\uC2DC \uC608\uC2DC \uBAA8\uD615";if(n==="riemann"){let v=Math.max(3,Math.round(h([5,8,18,10,30,45,22])*(.8+.4*a))),S=353,_=117,T=526,R=255;for(let k=0;k<v;k++){let L=_+k*T/v,z=R*(k/v)**2,W=R*((k+1)/v)**2;u([[L,S],[L,S-W],[L+T/v,S-W],[L+T/v,S]],"wash",!0),u([[L,S-z],[L+T/v,S-z]],"secondary")}x(k=>k*k,0,1,"primary",(k,L)=>[_+k*T,S-L*R]),u([[105,S],[660,S]],"axis");let P=(v-1)*(2*v-1)/(6*v*v),D=(v+1)*(2*v+1)/(6*v*v);Object.assign(o,{n:v,lower:P,upper:D,integral:1/3}),M="n = "+v+"   \uC88C\uD569 "+P.toFixed(4)+"  \u2264  1/3  \u2264  \uC6B0\uD569 "+D.toFixed(4),w="\uBD84\uD560 \uC218\uB97C \uBC14\uAFB8\uC5B4 \uB450 \uD569 \uC0AC\uC774\uC5D0 \uC801\uBD84\uAC12\uC774 \uB0A8\uB294 \uBAA8\uC2B5\uC744 \uBD05\uB2C8\uB2E4."}else if(n==="signed"){m();let v=c===4||c===5?2:-2+4*a;x(S=>S,-2,2),v<0?u([d(-2,0),d(-2,-2),d(v,v),d(v,0)],"negative",!0):(u([d(-2,0),d(-2,-2),d(0,0)],"negative",!0),u([d(0,0),d(v,v),d(v,0)],"wash",!0)),f(d(v,v),"b"),Object.assign(o,{end:v,integral:(v*v-4)/2,area:v<0?(4-v*v)/2:2+v*v/2}),M="b = "+v.toFixed(2)+"   \u222B f = "+o.integral.toFixed(3)+"   \u222B |f| = "+o.area.toFixed(3),w="\uAE30\uC900\uC120 \uC704\uC640 \uC544\uB798\uB97C \uC9C0\uB098\uBA70 \uBD80\uD638 \uC788\uB294 \uB204\uC801\uACFC \uB113\uC774\uAC00 \uB2EC\uB77C\uC9D1\uB2C8\uB2E4."}else if(["restore","restore-quadratic","antiderivative"].includes(n)){m();let v=n==="restore-quadratic"?_=>_*_:n==="antiderivative"?_=>-Math.cos(_):_=>_*_*_/3-_,S=n==="restore-quadratic"?h([0,0,0,0,2,0,0])+h([.3,.5,1.25,1.4,0,1.25,.8])*Math.sin(t*.21):h([.4,.6,1.25,.7,1,1.25,.8])*Math.sin(t*.21);for(let _ of[-1.25,0,1.25])x(T=>v(T)+_,-2.2,2.2,"ghost");x(_=>v(_)+S,-2.2,2.2),f(d(1,v(1)+S)),o.C=S,M="C = "+S.toFixed(2)+"   \xB7   \uAC19\uC740 \uAE30\uC6B8\uAE30, \uB2E4\uB978 \uCD9C\uBC1C \uB192\uC774",w="\uC801\uBD84\uC0C1\uC218\uAC00 \uB2EC\uB77C\uC838\uB3C4 \uACE1\uC120\uC758 \uAC01 \uC9C0\uC810 \uAE30\uC6B8\uAE30\uB294 \uC720\uC9C0\uB429\uB2C8\uB2E4."}else if(n==="rolle"){let v=[1,2,-67,-68,672,0],S=[-8,-4,0,3,7],_=Math.min(3,Math.floor(t/4.5)%4),T=c<2?2:4;for(let R=0;R<T;R++){let P=106+R*77;u([[94,P],[667,P]],"axis");for(let D=0;D<S.length;D++){let k=[380+S[D]*31,P];f(k,"",R===_?"primary":"ghost"),R<3&&D<S.length-1&&u([[k[0],P+13],[380+S[D+1]*31,P+13]],"guide")}p(R===0?"f":R===1?"f\u2032":R===2?"f\u2033":"f\u2034",[62,P+6]),R<3&&(S=xu(v,S),v=lc(v))}o.coefficients=[1,2,-67,-68,672,0],M="5 \u2192 4 \u2192 3 \u2192 2   \xB7   \uC11C\uB85C \uB2E4\uB978 \uB450 \uADFC \uC0AC\uC774, \uB3C4\uD568\uC218\uC758 \uADFC",w="\uD559\uC0DD\uC774 \uB2E4\uB8EC \uB2E4\uC12F \uADFC\uC758 \uC608\uC2DC\uC5D0\uC11C \uBBF8\uBD84\uD560 \uB54C\uB9C8\uB2E4 \uADFC\uC758 \uB07C\uC784\uC744 \uC77D\uC2B5\uB2C8\uB2E4."}else if(n==="zoom"||n==="secant"){let S=h([1.4,1.2,.5,.15,.1,.04,.3])*(.85+.3*a),_=n==="zoom"?h([2,1.5,.65,1,.2,.09,.4])*(.85+.3*a):1,T=P=>P*P,R=n==="zoom"?(P,D)=>[380+(P-.45)/_*100,235-(D-.45*.45)/_*68]:d;n==="secant"?m():(u([[82,235],[688,235]],"axis"),u([[380,50],[380,390]],"axis")),x(T,.45-2.7*_,.45+2.7*_,"primary",R),x(P=>.45*.45+2*.45*(P-.45),.45-2.6*_,.45+2.6*_,"guide",R),f(R(.45,.45*.45),"A"),n==="secant"?(x(P=>.45*.45+(2*.45+S)*(P-.45),-2.3,2.3,"secondary"),f(d(.45+S,T(.45+S)),"B"),M="h = "+S.toFixed(3)+"   \xB7   \uD560\uC120 "+(2*.45+S).toFixed(3)+" \u2192 \uC811\uC120 "+(2*.45).toFixed(3)):(u([R(.45+_,T(.45+_)),R(.45+_,.45*.45+2*.45*_)],"secondary"),M="\uAD00\uCC30 \uBC94\uC704 \u03B4 = "+_.toFixed(3)+"   \xB7   \uCD5C\uB300 \uCC28\uC774 \u03B4\xB2 = "+(_*_).toFixed(4)),Object.assign(o,{h:S,delta:_,slope:2*.45+S}),w=n==="zoom"?"\uAC19\uC740 \uC810\uC744 \uC911\uC2EC\uC73C\uB85C \uBC94\uC704\uB97C \uCC9C\uCC9C\uD788 \uC881\uD600 \uACE1\uC120\uACFC \uC811\uC120\uC758 \uCC28\uC774\uB97C \uBD05\uB2C8\uB2E4.":"\uB450 \uBC88\uC9F8 \uC810\uC774 \uC811\uADFC\uD558\uBA74 \uC2E4\uC81C \uD560\uC120\uC758 \uAE30\uC6B8\uAE30\uAC00 \uC811\uC120\uC5D0 \uAC00\uAE4C\uC6CC\uC9D1\uB2C8\uB2E4."}else if(n==="limits"){m();let v=.035+1.65*a,S=1+v;x(_=>_+1,-2.6,2.6),f(d(1,2),"","ghost"),f(d(S,S+1),"x"),f(d(1-v,2-v)),o.x=S,M="(x\xB2\u22121)/(x\u22121) = x+1, x\u22601   \xB7   \uD604\uC7AC "+(S+1).toFixed(3),w="\uAD6C\uBA4D \uB09C \uC810\uC5D0 \uAC12\uC744 \uB300\uC785\uD558\uC9C0 \uC54A\uACE0 \uC591\uCABD\uC5D0\uC11C \uAC19\uC740 \uAC12\uC73C\uB85C \uC811\uADFC\uD569\uB2C8\uB2E4."}else if(n==="ratio"||n==="extrema"||n==="area-scale"){m();let v=.55+.35*a,S=.8+.22*Math.sin(t*.17),_=.2*Math.sin(t*.13),T=R=>v*((R-_)**3-3*S*S*(R-_));x(T,-2.7,2.7);for(let R of[_-S,_,_+S])f(d(R,T(R)));if(n==="area-scale"){for(let[R,P]of[[_-Math.sqrt(3)*S,_],[_,_+Math.sqrt(3)*S]]){let D=[d(R,0)];for(let k=0;k<=65;k++){let L=R+(P-R)*k/65;D.push(d(L,T(L)))}D.push(d(P,0)),u(D,"wash",!0)}M="\uC0BC\uCC28\uD568\uC218 \uC608\uC2DC   \xB7   \uACF5\uD1B5 \uB113\uC774 \uBC30\uC728 |a|n\u2074 = "+(v*S**4).toFixed(3)}else u([d(_-S,-2),d(_+S,-2)],"guide"),M=n==="ratio"?"\uADF9\uC810 \u2212n, +n   \xB7   \uBCC0\uACE1\uC810 0\uC5D0\uC11C \uC218\uD3C9 \uAC70\uB9AC 1 : 1":"f\u2032 = 0\uC778 \uB450 \uC810\uACFC \uADF8 \uC0AC\uC774\uC758 \uAE30\uC6B8\uAE30 \uBCC0\uD654\uB97C \uC77D\uC2B5\uB2C8\uB2E4.";Object.assign(o,{a:v,n:S,center:_,areaScale:v*S**4}),w=n==="area-scale"?"\uBAA8\uC591\uC744 \uBCC0\uD615\uD574\uB3C4 \uB113\uC774\uC758 \uACF5\uD1B5 \uBC30\uC728\uC774 \uC5B4\uB5BB\uAC8C \uBC14\uB00C\uB294\uC9C0 \uBD05\uB2C8\uB2E4.":"\uC0BC\uCC28\uD568\uC218\uC758 \uC774\uB3D9\uACFC \uD655\uB300 \uC18D\uC5D0\uC11C \uADF9\uC810\uACFC \uBCC0\uACE1\uC810\uC758 \uAD00\uACC4\uB97C \uC77D\uC2B5\uB2C8\uB2E4."}else if(n==="newton"){m(),x(P=>P*P-2,-1.9,2.05);let v=_u(1.95,4),S=t/3%4,_=Math.floor(S);for(let P=0;P<=_;P++){let D=v[P];u([d(D.x,D.y),d(D.next,0),d(D.next,D.next*D.next-2)],P===_?"secondary":"ghost")}let T=v[_],R=d(T.x+(T.next-T.x)*(S-_),T.y*(1-(S-_)));f(R),Object.assign(o,{steps:v,index:_}),M="x"+(_+1)+" = "+T.next.toFixed(6)+"   \xB7   \u221A2 = "+Math.SQRT2.toFixed(6),w="\uC811\uC120\uC744 \uB530\uB77C \uB2E4\uC74C \uADFC\uC0BF\uAC12\uC73C\uB85C \uC774\uB3D9\uD558\uB294 \uB274\uD134 \uBC29\uBC95\uC758 \uD55C \uBC88\uC744 \uCC9C\uCC9C\uD788 \uBD05\uB2C8\uB2E4."}else if(n==="mean-value"){m(),x(S=>S*S,-1.6,2.1),u([d(-1,1),d(2,4)],"guide");let v=-.8+2.6*a;E(S=>S*S,S=>2*S,v),o.a=v,M="\uD3C9\uADE0 \uAE30\uC6B8\uAE30 1   \xB7   \uD604\uC7AC \uC21C\uAC04 \uAE30\uC6B8\uAE30 "+(2*v).toFixed(3)+"   \xB7   \uC77C\uCE58: c=1/2",w="\uC811\uC810\uC744 \uC774\uB3D9\uD558\uBA70 \uD3C9\uADE0 \uAE30\uC6B8\uAE30\uC640 \uB098\uB780\uD574\uC9C0\uB294 \uC21C\uAC04\uC744 \uCC3E\uC2B5\uB2C8\uB2E4."}else if(n==="chain"||n==="curvature"){m();let v=e===3,S=v?R=>R**4:R=>R**3,_=v?R=>4*R**3:R=>3*R*R,T=1.35*Math.sin(t*.2);x(S,-1.7,1.7),E(S,_,T),o.a=T,M=n==="chain"?v?"x\u2074 : f\u2032\uC758 \uBD80\uD638 \u2212 \u2192 +":"x\xB3 : f\u2032(0)=0\uC774\uC9C0\uB9CC \uBD80\uD638 + \u2192 +":v?"x\u2074 : f\u2033(0)=0\uC774\uC9C0\uB9CC \uC624\uBAA9\xB7\uBCFC\uB85D\uC740 \uC720\uC9C0":"x\xB3 : f\u2033(x)=6x   \xB7   \uD604\uC7AC "+(6*T).toFixed(3),w="0\uC774\uB77C\uB294 \uAC12 \uD558\uB098\uBCF4\uB2E4 \uC88C\uC6B0\uC5D0\uC11C \uC2E4\uC81C\uB85C \uBC14\uB00C\uB294 \uBC29\uD5A5\uC744 \uD655\uC778\uD569\uB2C8\uB2E4."}else if(n==="tangents"||n==="tangent-merge"){m(),x(_=>_**3,-1.45,1.7);let v=n==="tangent-merge"?1+.2*Math.sin(t*.16):.5+.65*Math.sin(t*.16),S=Cv(v);for(let _ of S)x(T=>3*_*_*T-2*_**3,-2,2,"secondary"),f(d(_,_**3));f(d(1,v),"P"),Object.assign(o,{b:v,roots:S}),M="P(1, "+v.toFixed(3)+")   \xB7   \uC11C\uB85C \uB2E4\uB978 \uC811\uC120 "+S.length+"\uAC1C",w="\uAC19\uC740 \uC810\uC744 \uC9C0\uB098\uB294 \uC811\uC120\uC744 \uC2E4\uC81C \uC811\uC810 \uBC29\uC815\uC2DD\uC73C\uB85C \uB2E4\uC2DC \uAD6C\uD569\uB2C8\uB2E4."}else if(n==="join"){m();let v=e>=4?2:2+.85*Math.sin(t*.22);x(S=>S*S,-1.7,1),x(S=>v*(S-1)+1,1,2.5,"secondary"),f(d(1,1)),o.slope=v,M="\uC811\uD569\uC810 (1,1)   \xB7   \uC67C\uCABD \uAE30\uC6B8\uAE30 2 / \uC624\uB978\uCABD "+v.toFixed(3),w="\uB192\uC774\uB97C \uC720\uC9C0\uD55C \uCC44 \uC624\uB978\uCABD \uAE30\uC6B8\uAE30\uB97C \uBC14\uAFB8\uACE0 \uB9C8\uC9C0\uB9C9\uC5D0\uB294 \uB458\uC744 \uB9DE\uCDA5\uB2C8\uB2E4."}else if(n==="model"){m();let v=[_=>1+.3*_,_=>Math.exp(.5*_),_=>2/(1+Math.exp(-_))];v.forEach((_,T)=>x(_,-2.5,2.5,T===1?"primary":"ghost"));let S=-2+4*a;for(let _ of v)f(d(S,_(S)));o.x=S,M="\uC77C\uCC28 \xB7 \uC9C0\uC218 \xB7 \uB85C\uC9C0\uC2A4\uD2F1   \xB7   \uAC19\uC740 x\uC5D0\uC11C \uC608\uCE21\uC744 \uBE44\uAD50",w="\uC138 \uAC00\uC9C0 \uD6C4\uBCF4 \uD568\uC218\uC758 \uC608\uC2DC\uC774\uBA70 \uD559\uC0DD\uC758 \uC2E4\uCE21 \uC790\uB8CC\uB97C \uB300\uC2E0\uD558\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4."}else if(n==="parabola"||n==="reflection"){m();let v=.8,S=P=>P*P/(4*v),_=2.2*Math.sin(t*.18),T=d(_,S(_)),R=d(0,v);if(x(S,-2.65,2.65),f(R,"F"),f(T,"P"),n==="parabola")u([d(-2.8,-v),d(2.8,-v)],"guide"),u([R,T,d(_,-v)],"secondary"),M="PF = PH = "+(S(_)+v).toFixed(3)+"   \xB7   \uC900\uC120 y=\u22120.8";else{u([[T[0],48],T,R],"secondary");let P=Us(t,.7),D=P<.5?[T[0],48+(T[1]-48)*P*2]:[T[0]+(R[0]-T[0])*(P-.5)*2,T[1]+(R[1]-T[1])*(P-.5)*2];f(D),M="\uCD95\uACFC \uD3C9\uD589\uD55C \uC785\uC0AC\uAD11   \u2192   \uD3EC\uBB3C\uC120\uC758 \uCD08\uC810 F"}Object.assign(o,{p:v,x:_,y:S(_)}),w=n==="parabola"?"\uD3EC\uBB3C\uC120 \uC704\uC758 \uC810\uC774 \uC6C0\uC9C1\uC5EC\uB3C4 \uCD08\uC810\uACFC \uC900\uC120\uAE4C\uC9C0\uC758 \uAC70\uB9AC\uB294 \uAC19\uC2B5\uB2C8\uB2E4.":"\uC785\uC0AC\uAD11\uACFC \uBC18\uC0AC\uAD11\uC758 \uACBD\uB85C\uAC00 \uC811\uC810\uC5D0 \uB530\uB77C \uC5F0\uC18D\uD574\uC11C \uB2EC\uB77C\uC9D1\uB2C8\uB2E4."}else if(n==="focal"||n==="conic-boundary"){m();let v=1.4,S=n==="focal"&&e>=3,_=n==="conic-boundary"?v+.03+1*a:S?1.05:2.2,T=Math.sqrt(Math.abs(_*_-v*v)),R;if(S){for(let P of[-1,1])for(let D of[-1,1])x(k=>P*T*Math.sqrt(k*k/(_*_)-1),D<0?-2.8:_,D<0?-_:2.8);R=[_*Math.cosh(.6*Math.sin(l)),T*Math.sinh(.6*Math.sin(l))]}else C(_,T),R=Rv(_,v,l);g([[-v,0],R,[v,0]],"secondary"),f(d(-v,0),"F\u2081"),f(d(v,0),"F\u2082"),f(d(...R),"P"),Object.assign(o,{a:_,c:v,Q:R,hyper:S}),M=S?"|PF\u2081\u2212PF\u2082| = 2a = "+(2*_).toFixed(3):"PF\u2081+PF\u2082 = 2a = "+(2*_).toFixed(3)+"   \xB7   2c = "+(2*v).toFixed(1),w="\uCD08\uC810\uAE4C\uC9C0\uC758 \uAC70\uB9AC \uC870\uAC74\uC744 \uC720\uC9C0\uD558\uBA70 \uC810\uC774 \uACE1\uC120\uC744 \uB530\uB77C \uC6C0\uC9C1\uC785\uB2C8\uB2E4."}else if(n==="conic-tangent"){m();let v=2.2,S=1.35,_=[v*Math.cos(l),S*Math.sin(l)],T=[-v*Math.sin(l),S*Math.cos(l)];C(v,S),g([[_[0]-2*T[0],_[1]-2*T[1]],[_[0]+2*T[0],_[1]+2*T[1]]],"secondary"),f(d(..._),"P"),o.Q=_,M="xx\u2081/a\xB2 + yy\u2081/b\xB2 = 1   \xB7   \uC218\uC9C1 \uC811\uC120\uC5D0\uC11C\uB3C4 \uAC19\uC740 \uC811\uC810 \uC870\uAC74",w="\uC811\uC810\uC744 \uC5F0\uC18D\uD574\uC11C \uC774\uB3D9\uD574\uB3C4 \uC9C1\uC120\uC740 \uD0C0\uC6D0\uC5D0 \uC811\uD569\uB2C8\uB2E4."}else if(n==="rotation"){let v=.85*Math.sin(t*.15),S=Math.cos(v),_=Math.sin(v),T=(R,P)=>d(S*R-_*P,_*R+S*P);x(R=>R*R,-1.8,1.8,"ghost"),u([T(-2.9,0),T(2.9,0)]),u([T(0,-2.2),T(0,3.6)],"secondary"),f(d(1,1),"\uACE0\uC815\uB41C \uC810"),o.theta=v,M="\uC88C\uD45C\uCD95 \uD68C\uC804 "+(v*180/Math.PI).toFixed(1)+"\xB0   \xB7   XY \uACC4\uC218 \u2212sin(2\u03B8) = "+(-Math.sin(2*v)).toFixed(3),w="\uC810\uACFC \uACE1\uC120\uC740 \uACE0\uC815\uD558\uACE0 \uC88C\uD45C\uCD95\uB9CC \uCC9C\uCC9C\uD788 \uD68C\uC804\uD569\uB2C8\uB2E4."}else if(n==="asymptote"){let v=(T,R)=>[380+T*48,265-R*35];for(let T of[-1,1]){u([v(-5,-5*T),v(5,5*T)],"guide");for(let R of[-1,1])x(P=>T*Math.sqrt(P*P-1),R<0?-5:1,R<0?-1:5,"primary",v)}let S=1.1+3.7*a,_=Math.sqrt(S*S-1);u([v(S,_),v(S,S)],"secondary"),f(v(S,_)),o.gap=S-_,M="x\xB2\u2212y\xB2=1   \xB7   \uC218\uC9C1 \uD2C8 x\u2212\u221A(x\xB2\u22121) = "+o.gap.toFixed(4),w="\uC30D\uACE1\uC120 \uC704\uC758 \uC810\uC774 \uBA40\uC5B4\uC9C0\uBA70 \uC810\uADFC\uC120\uACFC\uC758 \uD2C8\uC774 \uC904\uC5B4\uB4ED\uB2C8\uB2E4."}else if(n==="compound"){let v=T=>Math.log(2)/Math.log(1+T/100),S=(T,R)=>[105+(T-1)*39,371-R*4.3],_=2+12*a;x(v,1.2,15,"primary",S),x(T=>72/T,1.2,15,"guide",S),u([S(_,v(_)),S(_,72/_)],"secondary"),f(S(_,v(_))),Object.assign(o,{rate:_,exact:v(_),approx:72/_}),M="r="+_.toFixed(2)+"%   \xB7   \uC815\uD655 "+v(_).toFixed(3)+"\uB144 / 72\uC758 \uBC95\uCE59 "+(72/_).toFixed(3)+"\uB144",w="\uC5F0 1\uD68C \uBCF5\uB9AC\uC640 \uC77C\uC815\uD55C \uC774\uC728 \uBAA8\uD615\uC5D0\uC11C \uADFC\uC0AC\uC758 \uC624\uCC28\uB97C \uBE44\uAD50\uD569\uB2C8\uB2E4."}else throw new Error("\uC5F0\uC18D \uBAA8\uD615\uC774 \uC815\uC758\uB418\uC9C0 \uC54A\uC740 \uC8FC\uC81C: "+n);return{family:n,paths:i,dots:s,labels:r,metric:M,description:w,values:o}}var Sp="#e3e8cd",Pv="#b3c6b2",zn=14476725,hc=class extends Ir{constructor(t,e,i){super(t,e.kind,{motion:!1,family:i,primary:Sp}),this.allowed=!1,this.targetPhase=0,this.phaseValue=0,this.metric=document.createElement("p"),this.metric.className="living-metric",t.append(this.metric),this.draw()}applyPalette(){let t={};if(this.scene.traverse(e=>{for(let i of Array.isArray(e.material)?e.material:e.material?[e.material]:[])i.color&&(i.color.getHSL(t),t.s>.08&&i.color.setHSL(.29,Math.min(.28,t.s),t.l))}),this.renderer.toneMappingExposure=1.08,this.controls.enabled=!1,this.kind==="line-plane"){let e=this.group.children.find(r=>r.isMesh&&r.geometry.type==="PlaneGeometry"),i=this.group.children.find(r=>r.isLine),s=this.group.children.find(r=>r.isMesh&&r.geometry.type==="SphereGeometry");this.updates=[r=>{let o=Math.round(this.phaseValue)>=4?2:Math.round(this.phaseValue)===3?1:0,a=o===0?-.7:0,l=o===2?0:1;this.updateLine(i,[[-2,l-2*a,-.5],[2,l+2*a,.5]]),s.position.set(0,l,0),e.position.y=0,this.setMetric(["\uAD50\uCC28 \xB7 v\xB7n \u2260 0","\uD3C9\uD589 \xB7 v\xB7n = 0, \uC9C1\uC120\uC740 \uD3C9\uBA74 \uBC16","\uD3EC\uD568 \xB7 v\xB7n = 0, \uC9C1\uC120\uC758 \uC810\uC740 \uD3C9\uBA74 \uC704"][o]),this.group.rotation.y=-.22+Math.sin(r*.09)*.06}]}}init2D(){if(super.init2D(),!this.ctx)throw new Error("Canvas unavailable")}setMetric(t){this.pendingMetric=t,this.metric&&this.metric.textContent!==t&&(this.metric.textContent=t)}sphere(){let e=this.options.family,i=this.mesh(new Fe(1.65,52,36),7378040,.27),s=new _n(new Fn(new Fe(1.65,22,14)),new Ze({color:12833208,transparent:!0,opacity:.12}));this.group.add(s);let r=this.mesh(new Ue(4.5,3.4),10729619,.12);r.rotation.x=-Math.PI/2;let o=this.mesh(new is(1,.013,6,100),zn,.96);o.rotation.x=Math.PI/2;let a=this.line([[0,0,0],[1,1,0]],zn,.75),l=this.line([[0,0,0],[0,1,0]],12701883,.5,!0),c=this.mesh(new Fe(.038,12,8),zn,1),h=[];if(e==="volume"){for(let d=0;d<23;d++){let u=-1.54+d*3.08/22,f=cc(1.65,u),p=this.mesh(new ns(f,f,.022,52),11387548,.19);p.position.y=u,h.push(p)}i.visible=!1}this.group.rotation.z=-.1,this.updates.push(d=>{let u=Us(d,.24),f=this.phaseValue??this.phase;if(e==="dimension"){let p=1.5015*Math.sin(d*.16),x=cc(1.65,p);i.scale.setScalar(x/1.65),s.scale.setScalar(x/1.65),r.visible=o.visible=a.visible=l.visible=c.visible=!1,this.setMetric("4\uCC28\uC6D0 \uAD6C\uC758 3\uCC28\uC6D0 \uB2E8\uBA74 \uC608\uC2DC \xB7 r\xB2 = R\xB2 \u2212 w\xB2 \xB7 w = "+p.toFixed(2))}else if(e==="sphere-extreme"){r.visible=o.visible=l.visible=!1;let p=d*.19,x=[1.65*Math.cos(p),1.65*Math.sin(p),0];this.updateLine(a,[[0,0,0],x]),c.position.set(...x),this.setMetric("\uAD6C \uC704 \uB3D9\uC810\uC758 \uACE0\uC815\uCD95 \uC0AC\uC601 \xB7 "+(1.65*Math.cos(p)).toFixed(3))}else{let p=e==="sphere-slice"&&Math.round(f)===3?1.65*(.92+.2*u):1.65*(.14+.67*u),x=cc(1.65,p);if(r.position.y=p,o.visible=x!==null,c.visible=x!==null,a.visible=x!==null,l.visible=!0,x!==null&&(o.position.y=p,o.scale.set(x,x,1),this.updateLine(a,[[0,p,0],[x,p,0]]),c.position.set(x,p,0)),this.updateLine(l,[[0,0,0],[0,p,0]]),e==="volume"){r.visible=o.visible=a.visible=l.visible=c.visible=!1;let g=1+Math.floor(u*22);h.forEach((m,E)=>{m.visible=E<g}),this.setMetric("\uAD6C\uC758 \uB2E8\uBA74\uC801 A(x) = \u03C0(R\xB2\u2212x\xB2) \xB7 \uC6D0\uD310 "+g+"\uAC1C\uB85C \uC77D\uB294 \uC608\uC2DC")}else this.setMetric(x===null?"|d| > R \xB7 \uAD6C\uC640 \uD3C9\uBA74\uC774 \uB9CC\uB098\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4.":"r\xB2 + d\xB2 = R\xB2 \xB7 d = "+p.toFixed(3)+" / r = "+x.toFixed(3))}this.group.rotation.y=.13+Math.sin(d*.07)*.13})}surface(){let t=(c,h)=>.17*(c*c+2*h*h)-.9,e=new Ue(3.8,3.4,32,28),i=e.attributes.position;for(let c=0;c<i.count;c++){let h=i.getX(c),d=i.getY(c);i.setXYZ(c,h,t(h,d),d)}e.computeVertexNormals(),this.mesh(e,8428419,.38);let s=new _n(new Fn(e),new Ze({color:12833208,transparent:!0,opacity:.16}));this.group.add(s);let r=this.mesh(new Ue(4.2,3),12307370,.1),o=this.line([[0,0,0],[1,1,0]],zn,.95),a=this.line([[0,0,0],[1,1,0]],14542546,.75),l=this.mesh(new Fe(.045,12,8),zn,1);this.updates.push(c=>{let h=1.2*Math.sin(c*.17),d=.8*Math.cos(c*.21);r.position.z=h,this.updateLine(o,Array.from({length:81},(u,f)=>{let p=-1.9+f*3.8/80;return[p,t(p,h),h]})),this.updateLine(a,[[-1.6,t(d,h)+.34*d*(-1.6-d),h],[1.6,t(d,h)+.34*d*(1.6-d),h]]),l.position.set(d,t(d,h),h),this.group.rotation.y=-.22,this.setMetric("z=x\xB2+2y\xB2 \xB7 y="+h.toFixed(2)+" \uACE0\uC815 \xB7 \u2202z/\u2202x=2x="+(2*d).toFixed(3))})}projection(){let t=this.mesh(new Ue(3.2,2.1),12111e3,.22);t.rotation.x=-Math.PI/2,t.position.y=-1;let e=this.mesh(new Ue(3.2,2.1),8824953,.43);e.position.y=.7,e.add(new _n(new Ps(e.geometry),new Ze({color:zn,transparent:!0,opacity:.8})));let i=Array.from({length:4},()=>this.line([[0,0,0],[0,-1,0]],12898489,.35,!0));this.updates.push(s=>{let r=Math.max(0,Math.min(6,this.phaseValue??0)),o=Math.floor(r),a=[.15,.3,.85,Math.PI/2,Math.PI/3,.65,.45],l=a[o]*(1-r+o)+a[Math.min(6,o+1)]*(r-o),c=Math.min(Math.PI/2,Math.max(0,l+.1*Math.sin(s*.2)));e.rotation.x=-Math.PI/2+c,t.scale.y=Math.cos(c),[[-1.6,-1.05],[1.6,-1.05],[1.6,1.05],[-1.6,1.05]].forEach((h,d)=>{let u=[h[0],.7+h[1]*Math.sin(c),-h[1]*Math.cos(c)];this.updateLine(i[d],[u,[u[0],-1,u[2]]])}),this.group.rotation.y=-.15,this.setMetric("\uADF8\uB9BC\uC790 \uB113\uC774 / \uC6D0\uB798 \uB113\uC774 = cos \u03B8 = "+Math.cos(c).toFixed(3))})}distance(){let t=this.mesh(new Ue(4.1,3.3),9414526,.22);t.rotation.x=-Math.PI/2,t.position.y=-.75;let e=[.2,1.55,.1],i=[.2,-.75,.1];this.line([e,i],zn,.95,!0),this.mesh(new Fe(.055,14,10),zn,1).position.set(...e),this.mesh(new Fe(.032,12,8),12701883,1).position.set(...i);let o=this.mesh(new Fe(.04,12,8),zn,1),a=this.line([e,[1,-.75,1]],12701883,.65),l=this.line([i,[1,-.75,1]],12701883,.4);this.line([[.2,-.56,.1],[.4,-.56,.1],[.4,-.75,.1]],zn,.5),this.updates.push(c=>{let h=(this.phaseValue??0)>=4?.12+.32*Us(c,.18):.35+1.05*Us(c,.2),d=[i[0]+h*Math.cos(c*.23),i[1],i[2]+h*Math.sin(c*.23)],u=Math.hypot(2.3,h);o.position.set(...d),this.updateLine(a,[e,d]),this.updateLine(l,[i,d]),this.group.rotation.y=-.25+Math.sin(c*.08)*.08,this.setMetric("\uC218\uC120 PH = 2.300   \u2264   \uC0AC\uC120 PQ = "+u.toFixed(3))})}vectors(){let t=new N(-1.4,-.6,0);this.group.add(new si(new N(1,0,0),t,2.8,12701883,.17,.09));let e=new si(new N(1,1,0).normalize(),t,2.5,zn,.17,.09);this.group.add(e);let i=this.line([[0,1,0],[0,-.6,0]],12701883,.45,!0),s=this.line([[-1.4,-.6,0],[0,-.6,0]],zn,.8);this.updates.push(r=>{let o=this.phaseValue??0,a=o<2?.45:o<3?Math.PI/2:o<5?2.3:1.5,l=a+.3*Math.sin(r*.21),c=t.x+2.5*Math.cos(l),h=t.y+2.5*Math.sin(l);e.setDirection(new N(Math.cos(l),Math.sin(l),0)),this.updateLine(i,[[c,h,0],[c,t.y,0]]),this.updateLine(s,[t.toArray(),[c,t.y,0]]),this.group.rotation.y=-.2,this.setMetric("\u03B8 = "+(l*180/Math.PI).toFixed(1)+"\xB0   \xB7   \uB0B4\uC801 7 cos \u03B8 = "+(7*Math.cos(l)).toFixed(3))})}cone(){let i=.5555555555555556;for(let a of[-1,1]){let l=this.mesh(new ii(1.25,2.25,56,1,!0),8625539,.22);l.rotation.z=a>0?Math.PI:0,l.position.y=a*2.25/2;let c=new _n(new Fn(new ii(1.25,2.25,18,1,!0)),new Ze({color:12833208,transparent:!0,opacity:.13}));c.position.copy(l.position),c.rotation.copy(l.rotation),this.group.add(c)}let s=new Ue(4,4,1,1),r=this.mesh(s,12307370,.12),o=Array.from({length:12},()=>this.line([[0,0,0],[0,0,0]],zn,.97));this.camera.position.set(6.8,3.5,7.8),this.controls.update(),this.updates.push(a=>{let l=.18+1.04*Us(a,.13),c=Math.tan(l),h=.32,d=r.geometry.attributes.position;for(let f=0;f<d.count;f++){let p=d.getX(f),x=f<2?-2:2;d.setXYZ(f,p,c*p+h,x)}d.needsUpdate=!0,s.computeVertexNormals();let u=[];for(let f of[1,-1]){let p=[];for(let x=0;x<=320;x++){let g=x/320*Math.PI*2,m=f*i*h/(1-f*i*c*Math.cos(g)),E=m*Math.cos(g),C=m*Math.sin(g),M=c*E+h;m>=0&&m<=1.25&&Math.abs(M)<=2.25?p.push([E,M,C]):p.length&&(u.push(p),p=[])}p.length&&u.push(p)}o.forEach((f,p)=>{f.visible=!!u[p]&&u[p].length>1,f.visible&&this.updateLine(f,u[p])}),this.group.rotation.y=.08+Math.sin(a*.06)*.08,this.setMetric("\uC808\uB2E8\uBA74 y=mx+b \xB7 m="+c.toFixed(3)+" \xB7 \uACBD\uACC4 m=H/R="+(2.25/1.25).toFixed(2))})}drawDepth(t,e){let c=t.createLinearGradient(0,204,0,393);c.addColorStop(0,"rgba(226,236,205,0)"),c.addColorStop(1,"rgba(226,236,205,.16)"),t.save(),t.lineWidth=.8,t.strokeStyle=c;for(let h=1;h<=7;h++){let d=h/7,u=204+189*d*d;t.beginPath(),t.moveTo(45,u),t.lineTo(715,u),t.stroke()}for(let h=0;h<=10;h++){let d=45+670*(h/10);t.beginPath(),t.moveTo(380+(d-380)*.16,204),t.lineTo(d,393),t.stroke()}t.restore(),t.save(),t.strokeStyle="rgba(12,16,10,.30)",t.lineCap="round",t.lineJoin="round",t.filter="blur(2px)";for(let h of e.paths)h.closed||h.role==="guide"||h.role==="axis"||(t.beginPath(),h.points.forEach((d,u)=>{let f=d[0]+(d[0]-380)*.05,p=393-(393-d[1])*.1;u?t.lineTo(f,p):t.moveTo(f,p)}),t.lineWidth=h.role==="primary"?3.2:2,t.stroke());t.restore()}drawCanvas(){if(!this.ctx)return;let t=this.ctx,e=this.width,i=this.height,s=Math.min(e/760,i/470),r=(e-760*s)/2,o=(i-470*s)/2,a=bp(this.options.family,this.time,this.phaseValue??0);t.clearRect(0,0,e,i),t.save(),t.translate(r,o),t.scale(s,s),t.beginPath(),t.rect(45,28,670,365),t.clip(),this.drawDepth(t,a);let l={primary:Sp,secondary:"#a6baa0",axis:"#afc3b12c",guide:"#cad7c47a",ghost:"#b9c9b44d",wash:"#b9cfa127",negative:"#cda98b30"};for(let c of a.paths)t.beginPath(),c.points.forEach((h,d)=>d?t.lineTo(...h):t.moveTo(...h)),c.closed?(t.closePath(),t.fillStyle=l[c.role],t.fill()):(t.strokeStyle=l[c.role],t.lineWidth=c.role==="primary"?3:c.role==="secondary"?1.7:1,c.role==="primary"?(t.shadowColor="rgba(227,232,205,.5)",t.shadowBlur=9):t.shadowBlur=0,t.lineCap="round",t.lineJoin="round",t.setLineDash(c.role==="guide"?[5,7]:[]),t.stroke());t.shadowBlur=0,t.setLineDash([]);for(let c of a.dots)t.beginPath(),t.arc(...c.point,c.role==="primary"?4:3,0,Math.PI*2),t.fillStyle=l[c.role],t.fill();t.font=Math.max(16,12/Math.max(.1,s))+'px "IBM Plex Sans KR",sans-serif',t.fillStyle=Pv;for(let c of a.labels)t.fillText(c.text,...c.point);t.restore(),this.setMetric(a.metric),this.description=a.description}setPhase(t){this.targetPhase=t,this.phaseValue===void 0&&(this.phaseValue=t),this.draw()}setMotion(t){this.allowed=t,super.setMotion(t)}start(){if(this.raf||this.destroyed||!this.allowed||document.hidden)return;this.last=0;let t=e=>{if(this.destroyed||!this.enabled||!this.visible||document.hidden){this.raf=0;return}if(!this.last||e-this.last>=32){let i=this.last?Math.min((e-this.last)/1e3,.08):0;this.last=e,this.time+=i,this.phaseValue+=(this.targetPhase-this.phaseValue)*(1-Math.exp(-i*4.2)),this.phase=this.phaseValue,this.draw()}this.raf=requestAnimationFrame(t)};this.raf=requestAnimationFrame(t)}draw(){super.draw();let t=this.host.querySelector(".scene-live-label");t?.textContent?this.setMetric(t.textContent):this.pendingMetric&&this.setMetric(this.pendingMetric)}dispose(){super.dispose(),this.metric=null}};var Tp=n=>String(n).replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t]),uc=class{constructor(t,e,{motion:i=!0,onPlaybackChange:s=()=>{},onViewChange:r=()=>{}}={}){this.host=t,this.work=e,this.enabled=i,this.phase=-1,this.animations=[],this.destroyed=!1,this.paused=!1,this.onPlaybackChange=s,this.onViewChange=r,this.view="model",this.caption=t.closest(".motion-theater")?.querySelector(".scene-live-caption"),this.visible=typeof IntersectionObserver!="function",this.presented=-1,this.visibilityHandler=()=>{document.hidden?this.finish():this.present()},document.addEventListener("visibilitychange",this.visibilityHandler),typeof IntersectionObserver=="function"&&(this.observer=new IntersectionObserver(o=>{this.visible=!!o[0]?.isIntersecting,this.visible?this.present():this.finish()},{threshold:.08}),this.observer.observe(t)),t.dataset.renderer="studio-model"}get playing(){return this.enabled&&!this.paused}present(){this.destroyed||!this.visible||!this.playing||document.hidden||this.phase<0||(this.presented!==this.phase?this.setPhase(this.phase,{replay:!0}):this.model?.setMotion(this.view==="model"))}finish(){this.model?.setMotion(!1),this.animations.forEach(t=>{t.pause(),t.revert()}),this.animations=[],this.host.querySelectorAll("[data-outgoing]").forEach(t=>t.remove()),this.host.querySelectorAll("[data-draw]").forEach(t=>{t.style.removeProperty("stroke-dasharray"),t.style.removeProperty("stroke-dashoffset")}),this.host.classList.remove("is-playing")}setMotion(t){t!==this.enabled&&(this.enabled=t,t?this.present():(this.finish(),this.model&&(this.model.phase=this.model.phaseValue=this.phase,this.model.draw())),this.onPlaybackChange(this.playing))}setPlaying(t){this.paused=!t,t?this.present():this.finish(),this.onPlaybackChange(this.playing)}setView(t){if(t==="model"&&!this.model)return;this.view=t==="diagram"?"diagram":"model",this.host.dataset.view=this.view;let e=this.view==="model";this.model?.resize(),this.model?.draw(),this.model?.setMotion(e&&this.visible&&this.playing&&!document.hidden),this.caption&&(this.caption.textContent=e?"\uC5F0\uC18D \uC608\uC2DC \uBAA8\uD615 \xB7 \uC218\uD559\uC801 \uAD00\uACC4\uB97C \uCC9C\uCC9C\uD788 \uC0B4\uD3B4\uBD05\uB2C8\uB2E4.":this.frame.annotation),this.onViewChange(this.view,!!this.model)}setPhase(t,{replay:e=!1}={}){if(this.destroyed)return;let i=Math.max(0,Math.min(6,Math.trunc(t)));if(i===this.phase&&!e)return;this.finish();let s=this.host.querySelector(".motion-frame"),r=this.frame=Mp(this.work,i),o=document.createElement("div");if(o.className="motion-frame",o.innerHTML='<div class="motion-stage-copy"><p class="motion-kicker"><span>'+String(i+1).padStart(2,"0")+"</span> "+gp[i]+"</p><h3>"+Tp(r.headline)+'</h3><div class="motion-focus"><span></span><p>'+Tp(r.focus)+'</p></div><small>\uC804\uC2DC \uD574\uC124 \xB7 \uC608\uC2DC \uBAA8\uD615</small></div><div class="motion-camera"><div class="motion-illustration">'+r.svg+"</div></div>",this.phase=i,this.host.dataset.phase=String(i),this.host.dataset.family=r.family,this.host.setAttribute("aria-label",r.headline+" "+r.focus+"\uC5D0 \uB300\uD55C \uC804\uC2DC \uD574\uC124\uC6A9 \uB3C4\uD574"),s&&(s.setAttribute("data-outgoing",""),s.setAttribute("aria-hidden","true"),this.enabled||s.remove()),this.host.append(o),this.modelTried)this.model&&o.querySelector(".motion-camera").append(this.modelHost);else{this.modelTried=!0,this.modelHost=document.createElement("div"),this.modelHost.className="living-illustration",this.modelHost.setAttribute("aria-hidden","true"),o.querySelector(".motion-camera").append(this.modelHost);try{this.model=new hc(this.modelHost,this.work,r.family),this.model.staticFallback&&(this.model.dispose(),this.model=null)}catch{this.model=null}this.model||(this.modelHost.remove(),this.view="diagram")}if(this.model?.resize(),this.model?.setPhase(i),this.model&&!this.enabled&&(this.model.phase=this.model.phaseValue=i,this.model.draw()),this.setView(this.view),!this.playing||document.hidden||!this.visible){s?.remove();return}this.presented=i,this.host.classList.add("is-playing"),this.model?.setMotion(this.view==="model");let a=(c,h)=>{if(!c||c.length===0)return;let d=qs(c,h);return this.animations.push(d),d},l=0;if(s&&!e&&o.querySelectorAll("[data-morph]").forEach(c=>{let h=s.querySelector('[data-morph="'+c.dataset.morph+'"]');if(!h||h.tagName!==c.tagName)return;let d={};for(let u of["d","cx","cy","r","rx","ry","x","y","width","height"]){let f=h.getAttribute(u),p=c.getAttribute(u);f===null||p===null||f===p||u==="d"&&(f.replace(/[-+\d.e]+/gi,"")!==p.replace(/[-+\d.e]+/gi,"")||(f.match(/[-+]?\d*\.?\d+(?:e[-+]?\d+)?/gi)||[]).length!==(p.match(/[-+]?\d*\.?\d+(?:e[-+]?\d+)?/gi)||[]).length)||(d[u]=[f,p])}Object.keys(d).length&&(a(c,{...d,duration:820,ease:"inOut(3)"}),l++)}),this.host.dataset.morphs=String(l),s&&a(s,{opacity:[1,0],duration:260,ease:"inOut(2)",onComplete:()=>s.remove()}),a(o.querySelector(".motion-stage-copy"),{opacity:[0,1],translateY:[12,0],duration:520,delay:40,ease:"out(4)"}),this.view==="diagram"){let c=o.querySelectorAll(".primary[data-draw],.secondary[data-draw]");c.forEach(h=>{h.style.strokeDasharray="1",h.style.strokeDashoffset="1"}),a(c,{strokeDashoffset:[1,0],delay:Ys(13,{start:40}),duration:760,ease:"inOut(3)"}),a(o.querySelectorAll("[data-label]"),{opacity:[0,1],delay:Ys(9,{start:150}),duration:400,ease:"out(3)"})}}replay(){this.enabled&&(this.paused=!1,this.model&&(this.model.time=0,this.model.phase=this.model.phaseValue=this.phase,this.model.draw()),this.onPlaybackChange(this.playing),this.setPhase(this.phase,{replay:!0}))}dispose(){this.destroyed=!0,this.finish(),this.model?.dispose(),this.model=null,this.observer?.disconnect(),document.removeEventListener("visibilitychange",this.visibilityHandler),this.host.replaceChildren()}};function Iv(n,t,e,i,s,r=i,o=s){let a=Math.min(3,Math.max(1,Number.isFinite(n)?n:1)),l=Math.max(0,(r*a-i)/2),c=Math.max(0,(o*a-s)/2);return{scale:a,x:Math.max(-l,Math.min(l,t||0)),y:Math.max(-c,Math.min(c,e||0))}}var dc=class{constructor({host:t,launch:e,title:i,onStep:s,onTogglePlay:r=()=>{},getPlaying:o=()=>!0}){this.host=t,this.launch=e,this.onStep=s,this.getPlaying=o,this.caption=t.closest(".motion-theater")?.querySelector(".scene-live-caption"),this.isOpen=!1,this.view={scale:1,x:0,y:0},this.listeners=[],this.pointers=new Map,this.dialog=document.createElement("dialog"),this.dialog.className="diagram-dialog",this.dialog.setAttribute("aria-label","\uD0D0\uAD6C \uB3C4\uD574 \uD06C\uAC8C \uBCF4\uAE30"),this.dialog.setAttribute("aria-modal","true"),this.dialog.innerHTML='<div class="diagram-shell"><header class="diagram-header"><div><p>\uC218\uD559 \uB3C4\uD574 \uD06C\uAC8C \uBCF4\uAE30</p><h2></h2></div><button type="button" data-viewer-close aria-label="\uB3C4\uD574 \uD06C\uAC8C \uBCF4\uAE30 \uB2EB\uAE30">\uB2EB\uAE30 <span aria-hidden="true">\xD7</span></button></header><div class="diagram-surface" tabindex="0" aria-label="\uD655\uB300\uD558\uBA74 \uBC00\uC5B4\uC11C \uB3C4\uD574\uB97C \uC774\uB3D9\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4"><div class="diagram-mount"></div></div><div class="diagram-zoom-tools" role="group" aria-label="\uB3C4\uD574 \uD655\uB300 \uCD95\uC18C"><button type="button" data-zoom-out aria-label="\uB3C4\uD574 \uCD95\uC18C">\u2212</button><button type="button" data-zoom-reset aria-label="\uB3C4\uD574 \uD06C\uAE30\uC640 \uC704\uCE58 \uCD08\uAE30\uD654">100%</button><button type="button" data-zoom-in aria-label="\uB3C4\uD574 \uD655\uB300">\uFF0B</button><p>\uB450 \uC190\uAC00\uB77D\uC73C\uB85C \uD655\uB300 \xB7 \uBC00\uC5B4\uC11C \uC774\uB3D9</p></div><nav class="diagram-navigation" aria-label="\uD655\uB300 \uB3C4\uD574 \uC7A5 \uB118\uAE30\uAE30"><button type="button" data-viewer-previous>\u2190 \uC774\uC804</button><span data-viewer-position aria-live="polite"></span><button type="button" data-viewer-next>\uB2E4\uC74C \u2192</button></nav></div>',this.dialog.querySelector("h2").textContent=i,document.getElementById("main").append(this.dialog);let a=document.createElement("p");a.id="diagramDescription",a.className="diagram-description",this.dialog.append(a),this.dialog.setAttribute("aria-describedby","diagramDescription");let l=this.dialog.querySelector("[data-viewer-close]"),c=document.createElement("div");c.className="diagram-header-actions",l.before(c);let h=document.createElement("button");h.type="button",h.dataset.viewerPlay="",h.setAttribute("aria-label","\uB3C4\uD574 \uC560\uB2C8\uBA54\uC774\uC158 \uC7AC\uC0DD \uB610\uB294 \uC77C\uC2DC\uC815\uC9C0"),c.append(h,l),this.updatePlayback(),this.surface=this.dialog.querySelector(".diagram-surface"),this.mount=this.dialog.querySelector(".diagram-mount");let d=(p,x,g,m)=>{p.addEventListener(x,g,m),this.listeners.push(()=>p.removeEventListener(x,g,m))};d(e,"click",()=>this.open()),d(this.dialog.querySelector("[data-viewer-close]"),"click",()=>this.close()),d(h,"click",()=>{r(),this.updatePlayback()}),d(this.dialog,"cancel",p=>{p.preventDefault(),this.close()}),d(this.dialog,"close",()=>this.restore()),d(this.dialog.querySelector("[data-viewer-previous]"),"click",()=>this.onStep(-1)),d(this.dialog.querySelector("[data-viewer-next]"),"click",()=>this.onStep(1)),d(this.dialog.querySelector("[data-zoom-in]"),"click",()=>this.zoom(this.view.scale*1.4)),d(this.dialog.querySelector("[data-zoom-out]"),"click",()=>this.zoom(this.view.scale/1.4)),d(this.dialog.querySelector("[data-zoom-reset]"),"click",()=>this.reset()),d(this.surface,"wheel",p=>{this.isOpen&&(p.preventDefault(),this.zoom(this.view.scale*Math.exp(-p.deltaY*.002),p.clientX,p.clientY))},{passive:!1}),d(this.surface,"pointerdown",p=>{if(!(!this.isOpen||p.button>0)){this.pointers.set(p.pointerId,{x:p.clientX,y:p.clientY});try{this.surface.setPointerCapture(p.pointerId)}catch{}this.rebase()}}),d(this.surface,"pointermove",p=>{if(!this.pointers.has(p.pointerId))return;this.pointers.set(p.pointerId,{x:p.clientX,y:p.clientY});let x=[...this.pointers.values()];if(x.length>=2&&this.gesture?.distance){let[g,m]=x,E=this.gesture.scale*Math.hypot(g.x-m.x,g.y-m.y)/this.gesture.distance,C=this.surface.getBoundingClientRect(),M=Math.min(3,Math.max(1,E))/this.gesture.scale,w=(g.x+m.x)/2-C.left-C.width/2,v=(g.y+m.y)/2-C.top-C.height/2;this.apply(E,w-(this.gesture.mx-this.gesture.x)*M,v-(this.gesture.my-this.gesture.y)*M)}else x.length===1&&this.gesture&&this.apply(this.view.scale,this.gesture.x+x[0].x-this.gesture.px,this.gesture.y+x[0].y-this.gesture.py)});let u=p=>{this.pointers.delete(p.pointerId),this.rebase()};d(this.surface,"pointerup",u),d(this.surface,"pointercancel",u),d(this.surface,"lostpointercapture",u),d(this.dialog,"keydown",p=>{p.target.closest("button")||(p.key==="+"||p.key==="="?(p.preventDefault(),this.zoom(this.view.scale*1.4)):p.key==="-"&&(p.preventDefault(),this.zoom(this.view.scale/1.4)))});let f=()=>{this.isOpen&&this.apply(this.view.scale,this.view.x,this.view.y)};d(window,"resize",f),window.visualViewport&&d(window.visualViewport,"resize",f)}rebase(){let t=[...this.pointers.values()],e=this.surface.getBoundingClientRect();this.gesture=t.length?{...this.view,px:t[0].x,py:t[0].y}:null,t.length>=2&&Object.assign(this.gesture,{distance:Math.hypot(t[0].x-t[1].x,t[0].y-t[1].y),mx:(t[0].x+t[1].x)/2-e.left-e.width/2,my:(t[0].y+t[1].y)/2-e.top-e.height/2})}apply(t,e,i){let s=this.host.querySelector(".motion-frame:not([data-outgoing]) .motion-camera");if(!s)return;let r=this.surface.getBoundingClientRect(),o=s.offsetWidth||r.width||1,a=s.offsetHeight||r.height||1;this.view=Iv(t,e,i,r.width||1,r.height||1,o,a),s.style.transform="translate("+this.view.x+"px,"+this.view.y+"px) scale("+this.view.scale+")",this.dialog.querySelector("[data-zoom-reset]").textContent=Math.round(this.view.scale*100)+"%",this.dialog.querySelector("[data-zoom-out]").disabled=this.view.scale<=1,this.dialog.querySelector("[data-zoom-in]").disabled=this.view.scale>=3,this.surface.classList.toggle("is-zoomed",this.view.scale>1)}zoom(t,e,i){let s=this.surface.getBoundingClientRect(),r=(e??s.left+s.width/2)-s.left-s.width/2,o=(i??s.top+s.height/2)-s.top-s.height/2,a=Math.min(3,Math.max(1,t)),l=a/this.view.scale;this.apply(a,r-(r-this.view.x)*l,o-(o-this.view.y)*l)}reset(){this.view={scale:1,x:0,y:0},this.isOpen&&this.apply(1,0,0)}updatePlayback(){let t=this.dialog.querySelector("[data-viewer-play]");if(!t)return;let e=this.getPlaying();t.textContent=e?"\u2161":"\u25B7",t.setAttribute("aria-pressed",String(!e))}update(t,e){this.index=t,this.dialog.querySelector("[data-viewer-position]").textContent=String(t+1).padStart(2,"0")+" / 07 \xB7 "+e,this.dialog.querySelector("[data-viewer-previous]").disabled=t===0,this.dialog.querySelector("[data-viewer-next]").disabled=t===6,this.dialog.querySelector(".diagram-description").textContent=(this.host.getAttribute("aria-label")||"")+" "+(this.caption?.textContent||""),this.reset()}open(){this.isOpen||(this.isOpen=!0,this.previousFocus=document.activeElement,this.placeholder=document.createElement("div"),this.placeholder.className="diagram-placeholder",this.placeholder.style.height=Math.max(1,this.host.getBoundingClientRect().height)+"px",this.host.before(this.placeholder),this.mount.append(this.host),document.body.classList.add("diagram-open"),typeof this.dialog.showModal=="function"?this.dialog.showModal():this.dialog.setAttribute("open",""),this.reset(),this.updatePlayback(),this.dialog.querySelector("[data-viewer-close]").focus())}restore(t=!0){this.isOpen&&(this.isOpen=!1,this.host.querySelectorAll(".motion-camera").forEach(e=>e.style.removeProperty("transform")),this.placeholder?.replaceWith(this.host),this.placeholder=null,document.body.classList.remove("diagram-open"),this.pointers.clear(),this.gesture=null,t&&this.previousFocus?.isConnected&&this.previousFocus.focus({preventScroll:!0}))}close({focus:t=!0}={}){this.isOpen&&(this.restore(t),typeof this.dialog.close=="function"?this.dialog.close():this.dialog.removeAttribute("open"))}dispose(){this.close({focus:!1}),this.listeners.forEach(t=>t()),this.dialog.remove()}};var ui={calculus:{label:"\uBBF8\uC801\uBD84\u2160",mark:"f\u2032",title:"\uBCC0\uD654\uB97C \uC77D\uB2E4.",description:"\uAC00\uAE4C\uC6CC\uC9C0\uB294 \uAC12, \uC21C\uAC04\uC758 \uAE30\uC6B8\uAE30, \uC313\uC774\uB294 \uC591\uC5D0\uC11C \uC9C8\uBB38\uC744 \uCC3E\uC2B5\uB2C8\uB2E4.",kind:"secant",color:"#bf4630",light:"#ffe3c6",hue:.055},geometry:{label:"\uAE30\uD558",mark:"\u2220",title:"\uACF5\uAC04\uC744 \uBCF4\uB2E4.",description:"\uAC70\uB9AC\uC640 \uBC29\uD5A5, \uD3C9\uBA74\uACFC \uC785\uCCB4 \uC0AC\uC774\uC5D0\uC11C \uBCF4\uC774\uC9C0 \uC54A\uB358 \uAD00\uACC4\uB97C \uBC1C\uACAC\uD569\uB2C8\uB2E4.",kind:"ellipsoid",color:"#4c5fd0",light:"#d5dcff",hue:.63},economics:{label:"\uACBD\uC81C\uC218\uD559",mark:"%",title:"\uC120\uD0DD\uC744 \uB530\uC9C0\uB2E4.",description:"\uC218\uC640 \uBAA8\uD615\uC73C\uB85C \uC77C\uC0C1\uC758 \uC120\uD0DD\uACFC \uADFC\uC0AC\uC758 \uC624\uCC28\uB97C \uC0B4\uD3B4\uBD05\uB2C8\uB2E4.",kind:"compound",color:"#12735d",light:"#c5efdf",hue:.43}},Vi=n=>n.id.slice(0,4);function yu(n,t="all",e="all"){return n.filter(i=>(t==="all"||i.subjectKey===t)&&(e==="all"||Vi(i)===e))}function Ep(n,t=7){return Math.min(t-1,Math.max(0,Number.isFinite(n)?Math.trunc(n):0))}function wp(n,t){return Math.abs(n)>=70&&Math.abs(n)>Math.abs(t)*1.5?n<0?1:-1:0}function vu(n){try{let t=new URL(n?.url);return t.protocol==="https:"&&!t.username&&!t.password?t.href:null}catch{return null}}function fc(n,t=360){let e=String(n||"").trim();if(e.length<=t)return e;let i=e.lastIndexOf("\uB2E4.",t);return i<t*.55?i=t-1:i+=1,e.slice(0,i+1)+"\u2026"}function Ap(n){let t=n.raw;return[{key:"question",label:"\uC9C8\uBB38",title:"\uBB34\uC5C7\uC774 \uAD81\uAE08\uD588\uC744\uAE4C.",intro:n.question,primary:t.hypothesis,fields:[["\uCC98\uC74C \uC138\uC6B4 \uC608\uC0C1",t.hypothesis]]},{key:"method",label:"\uBC29\uBC95",title:"\uC5B4\uB5BB\uAC8C \uC54C\uC544\uBCF4\uAE30\uB85C \uD588\uC744\uAE4C.",intro:"\uAC19\uAC8C \uB458 \uAC83\uACFC \uBC14\uAFC0 \uAC83. \uD559\uC0DD\uC774 \uC120\uD0DD\uD55C \uBC29\uBC95\uC744 \uC77D\uC2B5\uB2C8\uB2E4.",primary:t.plan||t.conditions,fields:[["\uD0D0\uAD6C \uACC4\uD68D",t.plan],["\uBC14\uAFC0 \uC870\uAC74\uACFC \uC790\uB8CC",t.conditions]]},{key:"process",label:"\uC218\uD589",title:"\uC5B4\uB5A4 \uC2DC\uB3C4\uB97C \uD588\uC744\uAE4C.",intro:"\uC544\uB798 \uB0B4\uC6A9\uC740 \uD559\uC0DD\uC774 \uC800\uC7A5\uD55C \uC218\uD589 \uAE30\uB85D\uC785\uB2C8\uB2E4.",primary:t.process,fields:[["\uC218\uD589 \uACFC\uC815",t.process]]},{key:"revision",label:"\uC218\uC815",title:"\uC0DD\uAC01\uC744 \uBC14\uAFBC \uC21C\uAC04.",intro:"\uB73B\uB300\uB85C \uB418\uC9C0 \uC54A\uC558\uB358 \uC7A5\uBA74\uACFC, \uADF8\uB2E4\uC74C\uC758 \uC120\uD0DD\uC744 \uC77D\uC2B5\uB2C8\uB2E4.",primary:t.revision,fields:[["\uC2E4\uD328\uC640 \uC218\uC815",t.revision]]},{key:"evidence",label:"\uADFC\uAC70",title:"\uBB34\uC5C7\uC744 \uADFC\uAC70\uB85C \uB0A8\uACBC\uC744\uAE4C.",intro:"\uACC4\uC0B0\uACFC \uAD00\uCC30, \uC2E4\uD589\uACFC \uD574\uC11D\uC744 \uD559\uC0DD\uC758 \uAE30\uB85D\uC5D0\uC11C \uD655\uC778\uD569\uB2C8\uB2E4.",primary:t.evidence,fields:[["\uACB0\uACFC\uC640 \uADFC\uAC70",t.evidence],["\uC218\uD559\uC801 \uD574\uC11D",t.interpretation]]},{key:"conclusion",label:"\uACB0\uB860",title:"\uC54C\uAC8C \uB41C \uAC83\uACFC, \uB0A8\uC740 \uAC83.",intro:"\uD558\uB098\uC758 \uACB0\uB860\uC774 \uB2E4\uC74C \uC9C8\uBB38\uC758 \uCD9C\uBC1C\uC810\uC774 \uB429\uB2C8\uB2E4.",primary:t.conclusion,fields:[["\uACB0\uB860",t.conclusion],["\uD55C\uACC4\uC640 \uC8FC\uC758\uD560 \uC810",t.limits],["\uC0C8\uB85C\uC6B4 \uC9C8\uBB38",t.next]]},{key:"artifact",label:"\uC791\uD488",title:"\uC774\uC81C, \uC791\uD488 \uC55E\uC73C\uB85C.",intro:"\uD559\uC0DD\uC774 \uB9CC\uB4E0 \uC6F9\uC571\uC744 \uC6D0\uB798 \uBAA8\uC2B5\uC73C\uB85C \uB9CC\uB0A9\uB2C8\uB2E4.",primary:"",fields:[]}]}var nn=document.getElementById("main"),Pp=matchMedia("(prefers-reduced-motion: reduce)"),vt={data:null,subject:"all",student:"all",page:"",work:null,motion:!Pp.matches,scenes:[],observers:[],listeners:[],slide:0},Ot=n=>document.getElementById(n),Re=n=>String(n??"").replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t]),Mu=n=>String(n||"").split(`
`).map(t=>"<span>"+Re(t)+"</span>").join(""),Lr=n=>ui[n.subjectKey]?.label||n.subject,Lv=n=>[...new Set(n.map(Lr))].join(" \xB7 "),Dv=n=>n.topicMismatch?"\uC8FC\uC81C \uC815\uB9AC \uC911":n.recordComplete||n.status==="\uCD5C\uC885 \uC81C\uCD9C"?"\uD0D0\uAD6C \uAE30\uB85D \uC644\uB8CC":"\uC791\uC131 \uC911",Nv=n=>String(n||"").split(/\n\s*\n/).filter(Boolean).map(t=>"<p>"+Re(t).replace(/\n/g,"<br>")+"</p>").join(""),Uv=(n,t=360)=>n?'<div class="source-label">\uD559\uC0DD \uAE30\uB85D \xB7 \uBC1C\uCDCC</div><div class="student-excerpt">'+Nv(fc(n,t))+"</div>":'<p class="pending-text">\uC774 \uBD80\uBD84\uC740 \uC544\uC9C1 \uAE30\uB85D\uC744 \uAE30\uB2E4\uB9AC\uACE0 \uC788\uC2B5\uB2C8\uB2E4.</p>';function Fv(n){let t=n.filter(([,e])=>e);return t.length?'<details class="source-details"><summary>\uC6D0\uBB38 \uC804\uCCB4 \uD3BC\uCCD0\uBCF4\uAE30 <span aria-hidden="true">\uFF0B</span></summary>'+t.map(([e,i])=>'<section class="original-field"><h4>'+Re(e)+'</h4><div class="original-text">'+Re(i)+"</div></section>").join("")+"</details>":""}function en(n,t,e,i){n.addEventListener(t,e,i),vt.listeners.push(()=>n.removeEventListener(t,e,i))}function Ip(){vt.listeners.forEach(n=>n()),vt.listeners=[],vt.scenes.forEach(n=>n.dispose()),vt.scenes=[],vt.observers.forEach(n=>n.disconnect()),vt.observers=[],vt.work=null}function Ov(n,t,e="geometry"){if(!n)return null;try{let i=ui[e]||ui.geometry,s=new Ir(n,t,{motion:vt.motion,primary:i.light,hue:i.hue});return vt.scenes.push(s),s}catch{return n.innerHTML=Io(t),null}}function Lp(n){if(!vt.motion)return;let t=new IntersectionObserver(e=>e.forEach(({target:i,isIntersecting:s})=>{if(s){try{qs(i,{opacity:[.3,1],translateY:[16,0],duration:500,ease:"out(3)"})}catch{}t.unobserve(i)}}),{threshold:.08});n.querySelectorAll(".reveal").forEach(e=>t.observe(e)),vt.observers.push(t)}function Dr(){document.body.classList.toggle("reduced-motion",!vt.motion);let n=Ot("motionButton");n.setAttribute("aria-pressed",String(!vt.motion)),n.lastElementChild.textContent=vt.motion?"\uBAA8\uC158 \uC904\uC774\uAE30":"\uBAA8\uC158 \uCF1C\uAE30",vt.scenes.forEach(e=>e.setMotion(vt.motion));let t=Ot("replayScene");t&&(t.disabled=!vt.motion,t.innerHTML=vt.motion?'<span aria-hidden="true">\u21BB</span> \uB2E4\uC2DC \uBCF4\uAE30':"\uBAA8\uC158 \uAEBC\uC9D0")}Ot("motionButton").addEventListener("click",()=>{vt.motion=!vt.motion,Dr()});Pp.addEventListener("change",n=>{vt.motion=!n.matches,Dr()});document.querySelector(".skip-link").addEventListener("click",n=>{n.preventDefault(),nn.focus({preventScroll:!0}),nn.scrollIntoView({behavior:"auto"})});function Bv(){nn.querySelectorAll("[data-math]").forEach(n=>{try{window.katex.render(n.dataset.math,n,{throwOnError:!0,strict:"ignore",trust:!1,output:"htmlAndMathml"})}catch{n.textContent=n.dataset.math}}),window.katex&&nn.querySelectorAll(".student-excerpt,.chapter-intro,.chapter-quote,.closing-note,.next-question").forEach(n=>{let t=document.createTreeWalker(n,NodeFilter.SHOW_TEXT),e=[],i;for(;i=t.nextNode();)e.push(i);for(let s of e){let r=/\\\(([\s\S]+?)\\\)|\\\[([\s\S]+?)\\\]|\$\$([^$]+?)\$\$|\$([^$\n]+?)\$/g,o=s.textContent,a=document.createDocumentFragment(),l,c=0,h=!1;for(;l=r.exec(o);){a.append(document.createTextNode(o.slice(c,l.index)));let d=document.createElement("span");try{window.katex.render(l[1]||l[2]||l[3]||l[4],d,{throwOnError:!0,strict:"ignore",trust:!1,output:"htmlAndMathml"}),a.append(d)}catch{a.append(document.createTextNode(l[0]))}c=r.lastIndex,h=!0}h&&(a.append(document.createTextNode(o.slice(c))),s.replaceWith(a))}})}function Dp(n){document.body.dataset.subject=n,document.querySelectorAll("[data-nav-subject]").forEach(t=>{t.dataset.navSubject===n?t.setAttribute("aria-current","page"):t.removeAttribute("aria-current")})}function kv(n,t){let e=ui[n],i=t.filter(s=>s.subjectKey===n).length;return'<a class="subject-room reveal" data-subject="'+n+'" href="#/collection?subject='+n+'"><div class="room-art">'+Io(e.kind)+'<span class="room-mark" aria-hidden="true">'+e.mark+'</span></div><div class="room-copy"><div class="room-meta"><strong>'+e.label+"</strong><span>"+i+"\uAC1C\uC758 \uD0D0\uAD6C</span></div><h3>"+e.title+"</h3><p>"+e.description+'</p><span class="room-entry">\uC774 \uACFC\uBAA9 \uB458\uB7EC\uBCF4\uAE30 <b aria-hidden="true">\u2197</b></span></div></a>'}function zv(n,t){return'<a class="work-card reveal" data-subject="'+n.subjectKey+'" href="#/work/'+n.id+'" aria-label="'+Re(n.name+" \xB7 "+Lr(n)+" \xB7 "+n.title.replace(/\n/g," "))+'"><div class="card-art">'+Io(n.kind,t)+'<span class="card-number">'+String(t+1).padStart(2,"0")+'</span></div><div class="card-copy"><div class="card-meta"><span class="subject-mark">'+ui[n.subjectKey].mark+"</span><span>"+Lr(n)+" \xB7 "+Re(n.name)+"</span></div><h3>"+Mu(n.title)+"</h3><p>"+Re(n.caption)+'</p><div class="card-bottom"><span>'+Re(n.tags.slice(0,2).join(" \xB7 "))+'</span><b aria-hidden="true">\u2197</b></div></div></a>'}function pc(){let n=vt.data.works,t=yu(n,vt.subject,vt.student),e=yu(n,vt.subject),i=[...new Map(e.map(s=>[Vi(s),s])).values()].sort((s,r)=>s.name.localeCompare(r.name,"ko"));Ot("studentFilter").innerHTML='<option value="all">\uBAA8\uB4E0 \uD0D0\uAD6C\uC790</option>'+i.map(s=>'<option value="'+Vi(s)+'">'+Re(s.name)+"</option>").join(""),Ot("studentFilter").value=vt.student,Ot("workGrid").innerHTML=t.length?t.map(s=>zv(s,n.indexOf(s))).join(""):'<p class="no-results">\uC774 \uC870\uAC74\uC5D0 \uB9DE\uB294 \uD0D0\uAD6C\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4. \uB2E4\uB978 \uACFC\uBAA9\uC774\uB098 \uD0D0\uAD6C\uC790\uB97C \uC120\uD0DD\uD574 \uC8FC\uC138\uC694.</p>',Ot("collectionTitle").textContent=vt.subject==="all"?"\uC11C\uB85C \uB2E4\uB978 \uC9C8\uBB38\uC744 \uB9CC\uB098\uB2E4.":ui[vt.subject].label+"\uC758 \uC9C8\uBB38\uB4E4.",Ot("resultCount").textContent=t.length+"\uAC1C\uC758 \uD0D0\uAD6C",document.querySelectorAll("[data-filter]").forEach(s=>s.setAttribute("aria-pressed",String(s.dataset.filter===vt.subject))),Dp(vt.subject),Lp(Ot("workGrid"))}function Vv(){Ip(),vt.page="home",document.body.classList.remove("work-page"),document.title="\uC9C8\uBB38\uC774 \uB0A8\uAE34 \uADA4\uC801 \xB7 \uC218\uD559 \uD0D0\uAD6C\uC804";let n=vt.data.works,t=[...new Map(n.map(e=>[Vi(e),e])).values()].sort((e,i)=>e.name.localeCompare(i.name,"ko"));if(nn.innerHTML='<section class="hero" aria-labelledby="exhibitionTitle"><div class="hero-copy"><p class="eyebrow">2026 \uC218\uD559 \uD0D0\uAD6C\uC804</p><h1 id="exhibitionTitle"><span>\uD558\uB098\uC758 \uC9C8\uBB38\uC774</span><span>\uC790\uAE30\uB9CC\uC758 <em>\uBAA8\uC591</em>\uC744</span><span>\uAC16\uAE30\uAE4C\uC9C0.</span></h1><p class="hero-intro">'+t.length+"\uBA85\uC774 \uB0A8\uAE34 "+n.length+'\uAC1C\uC758 \uD0D0\uAD6C.<br>\uC815\uB2F5\uC5D0 \uB2FF\uAE30 \uC804\uC758 \uACE0\uBBFC\uACFC,<br>\uC0DD\uAC01\uC744 \uBC14\uAFBC \uC21C\uAC04\uC744 \uD568\uAED8 \uC77D\uC2B5\uB2C8\uB2E4.</p><a class="primary-link" href="#/subjects">\uC5B4\uB5A4 \uC9C8\uBB38\uBD80\uD130 \uB9CC\uB098 \uBCFC\uAE4C\uC694 <span aria-hidden="true">\u2193</span></a><div class="hero-meta"><span><b>'+t.length+"</b> \uD0D0\uAD6C\uC790</span><span><b>"+n.length+'</b> \uD0D0\uAD6C \uAE30\uB85D</span><span>\uC138 \uAC1C\uC758 \uACFC\uBAA9</span></div></div><div class="hero-art"><div class="hero-poster"><div id="heroScene" class="scene-host" role="img" aria-label="\uD3C9\uBA74\uACFC \uAD6C\uAC00 \uB9CC\uB098\uBA70 \uB2E8\uBA74\uC774 \uB2EC\uB77C\uC9C0\uB294 \uC804\uC2DC \uD574\uC124 \uB3C4\uD574"></div></div><span class="art-caption">\uAC19\uC740 \uB300\uC0C1\uB3C4, \uC9C8\uBB38\uC5D0 \uB530\uB77C \uB2E4\uB974\uAC8C \uBCF4\uC785\uB2C8\uB2E4.</span><span class="hero-orbit" aria-hidden="true">\uC9C8\uBB38 \xB7 \uC2DC\uB3C4 \xB7 \uC218\uC815 \xB7 \uBC1C\uACAC</span></div></section><section class="section-shell subjects-section" id="subjects" aria-labelledby="subjectsTitle"><div class="section-heading"><div><p class="eyebrow">\uACFC\uBAA9\uC73C\uB85C \uB4E4\uC5B4\uAC00\uAE30</p><h2 id="subjectsTitle">\uC11C\uB85C \uB2E4\uB978 \uAD00\uC810,<br>\uC774\uC5B4\uC9C0\uB294 \uD638\uAE30\uC2EC.</h2></div><p>\uBBF8\uC801\uBD84\uC740 \uBCC0\uD654\uB85C, \uAE30\uD558\uB294 \uACF5\uAC04\uC73C\uB85C,<br>\uACBD\uC81C\uC218\uD559\uC740 \uC120\uD0DD\uACFC \uBAA8\uD615\uC73C\uB85C \uC9C8\uBB38\uD569\uB2C8\uB2E4.</p></div><div class="subject-rooms">'+Object.keys(ui).map(e=>kv(e,n)).join("")+'</div></section><section class="section-shell collection" id="collection" aria-labelledby="collectionTitle"><div class="section-heading"><div><p class="eyebrow">\uD0D0\uAD6C \uAE30\uB85D \uBAA8\uC544 \uBCF4\uAE30</p><h2 id="collectionTitle">\uC11C\uB85C \uB2E4\uB978 \uC9C8\uBB38\uC744 \uB9CC\uB098\uB2E4.</h2></div><p>\uC791\uD488\uC744 \uACE0\uB974\uBA74 \uC9C8\uBB38\uBD80\uD130 \uACB0\uB860\uAE4C\uC9C0<br>\uC77C\uACF1 \uC7A5\uC73C\uB85C \uB118\uACA8 \uC77D\uC744 \uC218 \uC788\uC2B5\uB2C8\uB2E4.</p></div><div class="filter-bar"><div class="subject-tabs" role="group" aria-label="\uACFC\uBAA9 \uC120\uD0DD"><button type="button" data-filter="all" aria-pressed="true">\uC804\uCCB4 <span>'+n.length+"</span></button>"+Object.entries(ui).map(([e,i])=>'<button type="button" data-filter="'+e+'" data-subject="'+e+'" aria-pressed="false"><span class="filter-mark" aria-hidden="true">'+i.mark+"</span>"+i.label+" <span>"+n.filter(s=>s.subjectKey===e).length+"</span></button>").join("")+'</div><label class="student-select" for="studentFilter"><span>\uD0D0\uAD6C\uC790</span><select id="studentFilter"></select></label></div><div class="collection-summary"><span id="resultCount" aria-live="polite"></span><p>\uD559\uC0DD\uC758 \uAE30\uB85D\uACFC \uC804\uC2DC \uD574\uC124\uC740 \uAD6C\uBD84\uD574 \uD45C\uC2DC\uD569\uB2C8\uB2E4.</p></div><div class="work-grid" id="workGrid"></div></section><section class="section-shell students-section" id="students" aria-labelledby="studentsTitle"><div class="section-heading"><div><p class="eyebrow">\uC9C8\uBB38\uC758 \uC8FC\uC778\uB4E4</p><h2 id="studentsTitle">\uD55C \uC0AC\uB78C\uC758 \uAD00\uC2EC\uC744<br>\uD568\uAED8 \uC77D\uC5B4 \uBCF4\uC138\uC694.</h2></div><p>\uC774\uB984\uC744 \uACE0\uB974\uBA74 \uADF8 \uD559\uC0DD\uC774 \uB0A8\uAE34<br>\uD0D0\uAD6C\uB4E4\uC744 \uD55C\uACF3\uC5D0\uC11C \uB9CC\uB0A0 \uC218 \uC788\uC2B5\uB2C8\uB2E4.</p></div><div class="student-list">'+t.map((e,i)=>'<a class="student-row" href="#/collection?student='+Vi(e)+'"><span class="student-number">'+String(i+1).padStart(2,"0")+"</span><span><strong>"+Re(e.name)+"</strong><small>"+Re(Lv(n.filter(s=>Vi(s)===Vi(e))))+'</small></span><span class="student-arrow" aria-hidden="true">\u2197</span></a>').join("")+"</div></section>",Ov(Ot("heroScene"),"hero","geometry"),pc(),Dr(),Lp(nn),nn.querySelectorAll("[data-filter]").forEach(e=>en(e,"click",()=>{vt.subject=e.dataset.filter,vt.student="all";let i="#/collection"+(vt.subject==="all"?"":"?subject="+vt.subject);location.hash===i?pc():location.hash=i})),en(Ot("studentFilter"),"change",e=>{vt.student=e.target.value,pc()}),vt.motion)try{Oc({defaults:{duration:460,ease:"out(3)"}}).add(nn.querySelectorAll(".hero h1>span"),{opacity:[0,1],translateY:[20,0],delay:Ys(52)},0).add(nn.querySelectorAll(".hero-intro,.hero-meta"),{opacity:[0,1],translateY:[10,0]},180)}catch{}}function Hv(n){let t=n.artifact.status,e=vu(n.artifact),i,s,r;return t==="linked"&&e?(i="\uC9C8\uBB38\uC744 \uC9C1\uC811 \uC6C0\uC9C1\uC5EC \uBCF4\uC138\uC694.",s="\uD559\uC0DD\uC774 \uC81C\uCD9C\uD55C \uC6F9\uC571\uC785\uB2C8\uB2E4. \uC55E\uC5D0\uC11C \uC77D\uC740 \uC870\uAC74\uC744 \uBC14\uAFB8\uBA70 \uAE30\uB85D \uC18D \uC124\uBA85\uACFC \uD654\uBA74\uC758 \uACB0\uACFC\uB97C \uD568\uAED8 \uC0B4\uD3B4\uBCF4\uC138\uC694.",r='<a class="button-solid" href="'+Re(e)+'" target="_blank" rel="noopener noreferrer">\uD559\uC0DD \uC6F9\uC571 \uC5F4\uAE30 <span aria-hidden="true">\u2197</span></a><button class="button-line" id="embedButton" type="button">\uC804\uC2DC \uC548\uC5D0\uC11C \uCCB4\uD5D8\uD558\uAE30</button>'):t==="unavailable"?(i="\uC791\uD488\uC758 \uC0C8 \uC8FC\uC18C\uB97C \uAE30\uB2E4\uB9BD\uB2C8\uB2E4.",s="\uD604\uC7AC \uC81C\uCD9C \uC8FC\uC18C\uC5D0 \uC5F0\uACB0\uB418\uC9C0 \uC54A\uC544 \uB2E4\uC2DC \uD655\uC778\uD558\uACE0 \uC788\uC2B5\uB2C8\uB2E4. \uD0D0\uAD6C \uAE30\uB85D\uC740 \uBA3C\uC800 \uC804\uC2DC\uD558\uACE0, \uC0C8 \uC8FC\uC18C\uB098 \uC6D0\uBCF8 \uD30C\uC77C\uC744 \uBC1B\uC73C\uBA74 \uCCB4\uD5D8\uC744 \uC5F0\uACB0\uD569\uB2C8\uB2E4.",r='<span class="artifact-status">\uC791\uD488 \uC8FC\uC18C \uD655\uC778 \uC911</span>'):t==="awaiting-file"?(i="\uC791\uD488\uC758 \uC6D0\uBCF8\uC744 \uBAA8\uC73C\uACE0 \uC788\uC2B5\uB2C8\uB2E4.",s="\uD604\uC7AC \uC81C\uCD9C \uC8FC\uC18C\uB294 \uD559\uC0DD \uAE30\uAE30 \uC548\uC758 \uD30C\uC77C\uC744 \uAC00\uB9AC\uD0B5\uB2C8\uB2E4. HTML \uC6D0\uBCF8\uC744 \uC5F0\uACB0\uD558\uBA74 \uC774 \uC790\uB9AC\uC5D0\uC11C \uC791\uD488\uC744 \uCCB4\uD5D8\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4.",r='<span class="artifact-status">\uC6D0\uBCF8 \uD30C\uC77C \uC218\uD569 \uC911</span>'):(i="\uC774 \uC790\uB9AC\uC5D0\uC11C \uC791\uD488\uC744 \uB9CC\uB098\uAC8C \uB429\uB2C8\uB2E4.",s="\uD0D0\uAD6C \uAE30\uB85D\uC744 \uBA3C\uC800 \uC804\uC2DC\uD588\uC2B5\uB2C8\uB2E4. \uD559\uC0DD\uC774 \uB9CC\uB4E0 \uC6F9\uC571\uC774\uB098 \uC790\uB8CC\uAC00 \uC900\uBE44\uB418\uBA74 \uC774 \uC790\uB9AC\uC5D0 \uC5F0\uACB0\uD569\uB2C8\uB2E4.",r='<span class="artifact-status">\uC6F9\uC571 \uC900\uBE44 \uC911</span>'),'<div class="artifact-card"><span class="artifact-symbol" aria-hidden="true">\u2197</span><h3>'+i+"</h3><p>"+s+'</p><div class="artifact-actions">'+r+"</div></div>"+(n.recordNote?'<div class="closing-note"><strong>\uD568\uAED8 \uC77D\uC5B4 \uC8FC\uC138\uC694</strong><p>'+Re(n.recordNote)+"</p></div>":"")}function Gv(n,t,e){let i=n.key==="artifact"?Hv(e):Uv(n.primary,n.key==="conclusion"?300:360);return n.key==="revision"&&n.primary&&(i='<div class="source-label">\uD559\uC0DD\uC774 \uB0A8\uAE34 \uC2DC\uB3C4\uC640 \uC218\uC815 \xB7 \uBC1C\uCDCC</div><blockquote class="chapter-quote">'+Re(fc(n.primary,310))+"</blockquote>"),n.key==="evidence"&&e.recordNote&&(i+='<div class="closing-note"><strong>\uAE30\uB85D\uC744 \uC77D\uB294 \uAD00\uC810</strong><p>'+Re(e.recordNote)+"</p></div>"),n.key==="conclusion"&&(i+='<div class="closing-note"><strong>\uC804\uC2DC \uD574\uC124</strong><p>'+Re(e.readingNote)+"</p></div>"+(e.raw.next?'<div class="next-question"><strong>\uC774\uC5B4 \uAC00\uACE0 \uC2F6\uC740 \uC9C8\uBB38</strong><p>'+Re(fc(e.raw.next,170))+"</p></div>":"")),'<article class="deck-slide" role="tabpanel" id="slide-'+t+'" aria-labelledby="chapter-tab-'+t+'" tabindex="-1" '+(t?"hidden":"")+'><div class="chapter-number">'+String(t+1).padStart(2,"0")+" <span>/ 07</span></div><h2>"+n.title+'</h2><p class="chapter-intro">'+Re(n.intro)+"</p>"+i+Fv(n.fields)+"</article>"}function Wv(n){let t=ac(n);return'<aside class="deck-figure motion-theater" aria-label="\uD0D0\uAD6C \uACFC\uC815\uC5D0 \uB530\uB77C \uBC14\uB00C\uB294 \uC804\uC2DC \uD574\uC124"><div class="theater-topline"><span><i aria-hidden="true"></i> '+Re(t.focus)+'</span><div class="theater-actions"><button class="scene-view" id="sceneView" type="button" aria-pressed="false">\uB2E8\uACC4\uBCC4 \uAD00\uACC4\uB3C4</button><button class="scene-play" id="scenePlay" type="button" aria-pressed="false">\u2161 \uC77C\uC2DC\uC815\uC9C0</button><button class="scene-replay" id="replayScene" type="button"><span aria-hidden="true">\u21BB</span> \uB2E4\uC2DC \uBCF4\uAE30</button><button class="scene-expand" id="expandScene" type="button" aria-haspopup="dialog"><span aria-hidden="true">\u26F6</span> \uD06C\uAC8C \uBCF4\uAE30</button></div></div><div id="storyScene" class="motion-stage" role="img" aria-label="\uD0D0\uAD6C \uACFC\uC815\uC744 \uB530\uB77C \uBC14\uB00C\uB294 \uC804\uC2DC \uD574\uC124 \uB3C4\uD574"></div><div class="theater-bottomline"><p class="scene-live-caption"></p><span>\uD559\uC0DD\uC758 \uC2E4\uC81C \uAE30\uB85D\uC740 \uC544\uB798\uC5D0\uC11C \uC77D\uC2B5\uB2C8\uB2E4.</span></div></aside><div class="story-equation"><span>\uAD00\uACC4\uB97C \uC787\uB294 \uC2DD</span><div data-math="'+Re(n.math)+'"></div><p>'+Re(n.mathLabel)+"</p></div>"}function Xv(n,t){return'<nav class="deck-controls" aria-label="\uD0D0\uAD6C \uC7A5 \uB118\uAE30\uAE30"><button class="deck-previous" id="previousSlide" type="button"><span aria-hidden="true">\u2190</span> \uC774\uC804</button><button class="deck-position" id="chapterMenu" type="button" aria-expanded="false" aria-controls="chapterPopover"><span id="slidePosition" aria-live="polite"></span><small>\uB2E8\uACC4 \uC120\uD0DD <span aria-hidden="true">\u2303</span></small></button><button class="deck-next" id="nextSlide" type="button">\uB2E4\uC74C <span aria-hidden="true">\u2192</span></button><div class="deck-progress" aria-hidden="true"><span id="deckProgress"></span></div><div class="dock-menu" id="chapterPopover" role="group" aria-label="\uD0D0\uAD6C \uB2E8\uACC4 \uBC14\uB85C \uAC00\uAE30" hidden>'+n.map((e,i)=>'<button type="button" data-jump="'+i+'"><span>'+String(i+1).padStart(2,"0")+"</span>"+e.label+"</button>").join("")+'<a href="'+t+'">\u2190 \uACFC\uBAA9\uC758 \uD0D0\uAD6C \uBAA9\uB85D\uC73C\uB85C</a></div></nav>'}function Rp(n){let t=Ot("scenePlay");t&&(t.setAttribute("aria-pressed",String(!n)),t.innerHTML=n?'<span aria-hidden="true">\u2161</span> \uC77C\uC2DC\uC815\uC9C0':'<span aria-hidden="true">\u25B7</span> \uC7AC\uC0DD',nn.querySelectorAll("[data-viewer-play]").forEach(e=>{e.textContent=n?"\u2161":"\u25B7",e.setAttribute("aria-pressed",String(!n))}))}function qv(n){Ip(),vt.page="work",vt.work=n,vt.slide=-1,document.body.classList.add("work-page"),Dp(n.subjectKey),document.title=n.title.replace(/\n/g," ")+" \xB7 "+n.name+" \xB7 \uC218\uD559 \uD0D0\uAD6C\uC804";let t=Ap(n),e=vt.data.works.filter(x=>x.subjectKey===n.subjectKey),i=e[(e.indexOf(n)+1)%e.length],s="#/collection?subject="+n.subjectKey,r=e.length>1?"#/work/"+i.id:"#/subjects",o=e.length>1?"\uAC19\uC740 \uACFC\uBAA9\uC758 \uB2E4\uC74C \uC9C8\uBB38 \xB7 "+i.name:"\uB2E4\uB978 \uACFC\uBAA9\uC758 \uC9C8\uBB38\uB3C4 \uB9CC\uB098 \uBCF4\uC138\uC694",a=e.length>1?i.title:"\uB2E4\uC74C \uD638\uAE30\uC2EC\uC744 \uCC3E\uC544\uBCFC\uAE4C\uC694.";nn.innerHTML='<header class="work-heading"><a class="back-link" href="'+s+'">\u2190 '+Lr(n)+' \uD0D0\uAD6C\uB85C \uB3CC\uC544\uAC00\uAE30</a><div class="work-byline"><span class="subject-badge">'+ui[n.subjectKey].mark+" "+Lr(n)+"</span><strong>"+Re(n.name)+"</strong><span>"+Dv(n)+"</span></div><h1>"+Mu(n.title)+'</h1><p class="work-caption">'+Re(n.caption)+'</p><div class="work-tags">'+n.tags.map(x=>"<span>"+Re(x)+"</span>").join("")+'</div></header><section class="story-deck" id="storyDeck" aria-label="'+Re(n.name)+'\uC758 \uD0D0\uAD6C \uC77C\uACF1 \uC7A5"><div class="deck-tab-list" id="deckTabs" role="tablist" aria-label="\uD0D0\uAD6C \uACFC\uC815">'+t.map((x,g)=>'<button id="chapter-tab-'+g+'" role="tab" aria-controls="slide-'+g+'" aria-selected="'+(g===0)+'" tabindex="'+(g===0?"0":"-1")+'" data-slide="'+g+'"><b>'+String(g+1).padStart(2,"0")+"</b>"+x.label+"</button>").join("")+'</div><div class="deck-reader" id="deckReader">'+Wv(n)+'<div class="deck-copy"><div class="reading-topline"><span>\uD559\uC0DD\uC774 \uB0A8\uAE34 \uD0D0\uAD6C \uAE30\uB85D</span><span>\uC6D0\uBB38\uC744 \uBC14\uD0D5\uC73C\uB85C \uC77D\uC2B5\uB2C8\uB2E4.</span></div>'+t.map((x,g)=>Gv(x,g,n)).join("")+'</div></div><section class="embedded-work" id="embeddedWork" aria-label="\uD559\uC0DD \uC6F9\uC571 \uC6D0\uBCF8" hidden><div class="embed-bar"><span>\uD559\uC0DD\uC774 \uB9CC\uB4E0 \uC6F9\uC571 \xB7 \uC6D0\uBCF8 \uD654\uBA74</span><button id="closeEmbed" type="button">\uCCB4\uD5D8 \uB2EB\uAE30 \u2191</button></div><div id="iframeMount"></div></section><p class="deck-instruction">\uBC84\uD2BC\uC774\uB098 \u2190 \u2192 \uBC29\uD5A5\uD0A4\uB85C \uB118\uAE41\uB2C8\uB2E4. \uBAA8\uBC14\uC77C\uC5D0\uC11C\uB294 \uAE00 \uC601\uC5ED\uC744 \uC88C\uC6B0\uB85C \uBC00\uC5B4 \uBCF4\uC138\uC694.</p></section><section class="work-epilogue"><p>\uD559\uC0DD\uC774 \uC800\uC7A5\uD55C \uC6D0\uBB38\uC744 \uBC14\uD0D5\uC73C\uB85C \uAD6C\uC131\uD588\uC2B5\uB2C8\uB2E4.<br>\uC804\uC2DC \uB3C4\uD574\uB294 \uD559\uC0DD \uC791\uD488\uACFC \uAD6C\uBD84\uD55C \uD574\uC124\uC774\uBA70, \uC6F9\uC571 \uC900\uBE44 \uC0C1\uD0DC\uB294 \uB9C8\uC9C0\uB9C9 \uC7A5\uC5D0\uC11C \uD655\uC778\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4.</p><span>\uAE30\uB85D \uC218\uC815 \xB7 '+Re(n.updated)+'</span></section><a class="next-work" href="'+r+'"><div><span>'+Re(o)+"</span><h2>"+Mu(a)+'</h2></div><b aria-hidden="true">\u2197</b></a>',nn.insertAdjacentHTML("beforeend",Xv(t,s));let l=null,c=(x,g)=>{let m=Ot("sceneView");m.hidden=!g,m.setAttribute("aria-pressed",String(x==="diagram")),m.textContent=x==="diagram"?"\uC6C0\uC9C1\uC774\uB294 \uBAA8\uD615":"\uB2E8\uACC4\uBCC4 \uAD00\uACC4\uB3C4";let E=document.querySelector(".diagram-description");E&&(E.textContent=Ot("storyScene").getAttribute("aria-label")+" "+document.querySelector(".scene-live-caption").textContent)},h=new uc(Ot("storyScene"),n,{motion:vt.motion,onPlaybackChange:Rp,onViewChange:c});vt.scenes.push(h),Bv(),Dr(),Rp(h.playing),en(Ot("sceneView"),"click",()=>h.setView(h.view==="model"?"diagram":"model")),en(Ot("replayScene"),"click",()=>h.replay());let d=()=>{vt.motion?h.setPlaying(!h.playing):(vt.motion=!0,Dr(),h.setPlaying(!0))};en(Ot("scenePlay"),"click",d);let u=(x,{focus:g=!1}={})=>{let m=Ep(x,t.length);if(m===vt.slide)return;let E=vt.slide;vt.slide=m,nn.querySelectorAll(".deck-slide").forEach((w,v)=>{w.hidden=v!==m}),nn.querySelectorAll("[data-slide]").forEach((w,v)=>{w.setAttribute("aria-selected",String(v===m)),w.tabIndex=v===m?0:-1}),Ot("previousSlide").disabled=m===0,Ot("nextSlide").disabled=!1,Ot("nextSlide").innerHTML=m===6?e.length>1?"\uB2E4\uC74C \uD0D0\uAD6C \u2197":"\uACFC\uBAA9 \uBCF4\uAE30 \u2197":'\uB2E4\uC74C <span aria-hidden="true">\u2192</span>',Ot("nextSlide").setAttribute("aria-label",m===6?"\uB2E4\uC74C \uD0D0\uAD6C\uB85C \uC774\uB3D9":"\uB2E4\uC74C \uC7A5"),Ot("slidePosition").textContent=String(m+1).padStart(2,"0")+" / 07 \xB7 "+t[m].label,Ot("deckProgress").style.width=(m+1)/t.length*100+"%",h.setPhase(m),Ot("storyDeck").dataset.phase=String(m),l?.update(m,t[m].label),nn.querySelectorAll("[data-jump]").forEach((w,v)=>{v===m?w.setAttribute("aria-current","step"):w.removeAttribute("aria-current")}),Ot("embeddedWork").hidden=m!==6||!Ot("iframeMount").firstChild;let C=Ot("chapter-tab-"+m),M=Ot("deckTabs");if(M.scrollTo({left:C.offsetLeft-M.clientWidth/2+C.clientWidth/2,behavior:vt.motion?"smooth":"auto"}),g&&C.focus({preventScroll:!0}),E>=0&&!l?.isOpen){let w=Ot("slide-"+m);if(vt.motion)try{qs(w,{opacity:[.5,1],translateY:[16,0],duration:500,ease:"out(3)"})}catch{}Ot("storyDeck").getBoundingClientRect().top<70&&Ot("storyDeck").scrollIntoView({block:"start",behavior:vt.motion?"smooth":"auto"})}};nn.querySelectorAll("[data-slide]").forEach(x=>en(x,"click",()=>u(Number(x.dataset.slide)))),en(Ot("previousSlide"),"click",()=>u(vt.slide-1)),en(Ot("nextSlide"),"click",()=>{vt.slide===6?location.hash=r:u(vt.slide+1)});let f=()=>{Ot("chapterPopover").hidden=!0,Ot("chapterMenu").setAttribute("aria-expanded","false")};en(Ot("chapterMenu"),"click",()=>{let x=Ot("chapterPopover").hidden;Ot("chapterPopover").hidden=!x,Ot("chapterMenu").setAttribute("aria-expanded",String(x))}),nn.querySelectorAll("[data-jump]").forEach(x=>en(x,"click",()=>{f(),u(Number(x.dataset.jump)),Ot("chapterMenu").focus({preventScroll:!0})})),en(document,"pointerdown",x=>{x.target.closest?.(".deck-controls")||f()}),en(document,"keydown",x=>{x.key==="Escape"&&!Ot("chapterPopover").hidden&&(f(),Ot("chapterMenu").focus({preventScroll:!0}))}),l=new dc({host:Ot("storyScene"),launch:Ot("expandScene"),title:n.title.replace(/\n/g," "),onStep:x=>u(vt.slide+x),onTogglePlay:d,getPlaying:()=>h.playing}),vt.listeners.push(()=>l.dispose()),en(document,"keydown",x=>{if(x.altKey||x.ctrlKey||x.metaKey||x.target.closest?.("input,textarea,select,[contenteditable],iframe"))return;let g=x.key==="ArrowRight"?1:x.key==="ArrowLeft"?-1:0;g&&(x.preventDefault(),u(vt.slide+g,{focus:!!x.target.closest?.('[role="tablist"]')}))});let p=null;en(Ot("deckReader"),"touchstart",x=>{let g=x.touches[0];p=g&&g.clientX>24&&g.clientX<innerWidth-24&&!x.target.closest("canvas,svg,.deck-figure,button,a,summary,details,input,iframe")?{x:g.clientX,y:g.clientY}:null},{passive:!0}),en(Ot("deckReader"),"touchend",x=>{if(!p)return;let g=x.changedTouches[0],m=wp(g.clientX-p.x,g.clientY-p.y);p=null,m&&u(vt.slide+m)},{passive:!0}),en(Ot("deckReader"),"touchcancel",()=>{p=null},{passive:!0}),Ot("embedButton")&&en(Ot("embedButton"),"click",()=>{let x=Ot("iframeMount");if(!x.firstChild){let g=document.createElement("iframe");g.title=n.name+"\uC758 "+Lr(n)+" \uC6F9\uC571",g.setAttribute("sandbox","allow-scripts allow-same-origin allow-forms"),g.referrerPolicy="no-referrer",g.src=vu(n.artifact),x.append(g)}Ot("embeddedWork").hidden=!1,Ot("embeddedWork").scrollIntoView({block:"start",behavior:vt.motion?"smooth":"auto"})}),en(Ot("closeEmbed"),"click",()=>{Ot("iframeMount").replaceChildren(),Ot("embeddedWork").hidden=!0,Ot("embedButton")?.focus()}),u(0)}function Cp(){let[n,t]=(location.hash.slice(1)||"/").split("?"),e=new URLSearchParams(t||"");if(n.startsWith("/work/")){let i=vt.data.works.find(s=>s.id===n.slice(6));if(i){qv(i),scrollTo({top:0,behavior:"auto"});return}}if(n==="/collection"){let i=e.get("subject");vt.subject=ui[i]?i:"all",vt.student=e.get("student")||"all"}n==="/"&&(vt.subject="all",vt.student="all"),vt.page!=="home"||n==="/"?Vv():pc(),["/collection","/subjects","/students"].includes(n)?requestAnimationFrame(()=>Ot(n.slice(1))?.scrollIntoView({block:"start",behavior:vt.motion?"smooth":"auto"})):scrollTo({top:0,behavior:"auto"})}async function Yv(){Dr();let n,t=["localhost","127.0.0.1","[::1]"].includes(location.hostname);try{let e=await fetch(t?"/api/exhibits":"data/exhibits.json",{cache:"no-store",credentials:"same-origin"});if(!e.ok)throw Error("\uC804\uC2DC \uC5F0\uACB0 \uC911");n=await e.json()}catch{try{n=await(await fetch("data/exhibits.json",{cache:"no-store"})).json()}catch{n={works:[]}}}if(!n.works?.length){nn.innerHTML='<section class="loading-surface"><p class="eyebrow">2026 \uC218\uD559 \uD0D0\uAD6C\uC804</p><h1>\uC9C8\uBB38\uC774 \uB0A8\uAE34 \uADA4\uC801.</h1><p>\uC804\uC2DC \uC790\uB8CC\uB97C \uC5F0\uACB0\uD558\uACE0 \uC788\uC2B5\uB2C8\uB2E4. \uC7A0\uC2DC \uD6C4 \uB2E4\uC2DC \uC5F4\uC5B4 \uC8FC\uC138\uC694.</p></section>';return}vt.data=n,Ot("previewLabel").textContent=n.privatePreview?"\uAD50\uC0AC\uC6A9 \uBBF8\uB9AC\uBCF4\uAE30 \xB7 "+n.asOf:"2026 \uC218\uD559 \uD0D0\uAD6C\uC804 \xB7 "+new Set(n.works.map(Vi)).size+"\uBA85\uC758 \uC9C8\uBB38",window.addEventListener("hashchange",Cp),Cp()}Yv();})();
/*! Bundled license information:

animejs/dist/modules/core/consts.js:
animejs/dist/modules/core/globals.js:
animejs/dist/modules/core/helpers.js:
animejs/dist/modules/core/transforms.js:
animejs/dist/modules/core/colors.js:
animejs/dist/modules/core/values.js:
animejs/dist/modules/core/render.js:
animejs/dist/modules/core/styles.js:
animejs/dist/modules/core/clock.js:
animejs/dist/modules/core/targets.js:
animejs/dist/modules/core/units.js:
  (**
   * Anime.js - core - ESM
   * @version v4.5.0
   * @license MIT
   * @copyright 2026 - Julian Garnier
   *)

animejs/dist/modules/adapters/registry.js:
  (**
   * Anime.js - adapters - ESM
   * @version v4.5.0
   * @license MIT
   * @copyright 2026 - Julian Garnier
   *)

animejs/dist/modules/animation/additive.js:
animejs/dist/modules/animation/composition.js:
animejs/dist/modules/animation/animation.js:
  (**
   * Anime.js - animation - ESM
   * @version v4.5.0
   * @license MIT
   * @copyright 2026 - Julian Garnier
   *)

animejs/dist/modules/engine/engine.js:
  (**
   * Anime.js - engine - ESM
   * @version v4.5.0
   * @license MIT
   * @copyright 2026 - Julian Garnier
   *)

animejs/dist/modules/timer/timer.js:
  (**
   * Anime.js - timer - ESM
   * @version v4.5.0
   * @license MIT
   * @copyright 2026 - Julian Garnier
   *)

animejs/dist/modules/easings/none.js:
animejs/dist/modules/easings/eases/parser.js:
  (**
   * Anime.js - easings - ESM
   * @version v4.5.0
   * @license MIT
   * @copyright 2026 - Julian Garnier
   *)

animejs/dist/modules/timeline/position.js:
animejs/dist/modules/timeline/timeline.js:
  (**
   * Anime.js - timeline - ESM
   * @version v4.5.0
   * @license MIT
   * @copyright 2026 - Julian Garnier
   *)

animejs/dist/modules/utils/random.js:
animejs/dist/modules/utils/stagger.js:
  (**
   * Anime.js - utils - ESM
   * @version v4.5.0
   * @license MIT
   * @copyright 2026 - Julian Garnier
   *)

animejs/dist/modules/index.js:
  (**
   * Anime.js - ESM
   * @version v4.5.0
   * @license MIT
   * @copyright 2026 - Julian Garnier
   *)

three/build/three.core.js:
three/build/three.module.js:
  (**
   * @license
   * Copyright 2010-2026 Three.js Authors
   * SPDX-License-Identifier: MIT
   *)
*/
