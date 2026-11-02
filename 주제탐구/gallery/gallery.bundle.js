(()=>{var zn=typeof window<"u",Io=zn?window:null,Gi=zn?document:null,Me={OBJECT:0,ATTRIBUTE:1,CSS:2,TRANSFORM:3,CSS_VAR:4},re={NUMBER:0,UNIT:1,COLOR:2,COMPLEX:3},We={NONE:0,AUTO:1,FORCE:2},Fe={replace:0,none:1,blend:2},fc=Symbol(),li=Symbol(),Lo=Symbol(),Wi=Symbol(),Eu=Symbol(),ie=1e-11,Pr=1e12,ci=1e3,Ir=240,Vn="",wu="var(",Lr=[],Do=(()=>{let n=new Map;return n.set("x","translateX"),n.set("y","translateY"),n.set("z","translateZ"),n})(),Ns=["perspective","translateX","translateY","translateZ","rotate","rotateX","rotateY","rotateZ","scale","scaleX","scaleY","scaleZ","skew","skewX","skewY"],Au=Ns.reduce((n,t)=>({...n,[t]:t+"("}),{}),cn=()=>{},Cu=n=>n,Ru=/\)\s*[-.\d]/,Pu=/(^#([\da-f]{3}){1,2}$)|(^#([\da-f]{4}){1,2}$)/i,Iu=/rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/i,Lu=/rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*(-?\d+|-?\d*.\d+)\s*\)/i,Du=/hsl\(\s*(-?\d+|-?\d*.\d+)\s*,\s*(-?\d+|-?\d*.\d+)%\s*,\s*(-?\d+|-?\d*.\d+)%\s*\)/i,Nu=/hsla\(\s*(-?\d+|-?\d*.\d+)\s*,\s*(-?\d+|-?\d*.\d+)%\s*,\s*(-?\d+|-?\d*.\d+)%\s*,\s*(-?\d+|-?\d*.\d+)\s*\)/i,pc=/[-+]?\d*\.?\d+(?:e[-+]?\d)?/gi,No=/^([-+]?\d*\.?\d+(?:e[-+]?\d+)?)([a-z]+|%)$/i,Uu=/([a-z])([A-Z])/g,Fu=/(\*=|\+=|-=)/,Ou=/var\(\s*(--[\w-]+)(?:\s*,\s*([^)]+))?\s*\)/;var Us={id:null,keyframes:null,playbackEase:null,playbackRate:1,frameRate:Ir,loop:0,reversed:!1,alternate:!1,autoplay:!0,persist:!1,duration:ci,delay:0,loopDelay:0,ease:"out(2)",composition:Fe.replace,modifier:Cu,onBegin:cn,onBeforeUpdate:cn,onUpdate:cn,onLoop:cn,onPause:cn,onComplete:cn,onRender:cn},Dr={current:null,root:Gi},de={defaults:Us,precision:4,timeScale:1,tickThreshold:200,editor:null},mc={version:"4.5.0",engine:null};zn&&(Io.AnimeJS||(Io.AnimeJS=[]),Io.AnimeJS.push(mc));var gc=n=>n.replace(Uu,"$1-$2").toLowerCase(),Rn=(n,t)=>n.indexOf(t)===0,Mi=Date.now,Hn=Array.isArray,fs=n=>n&&n.constructor===Object,xn=n=>typeof n=="number"&&!isNaN(n),yn=n=>typeof n=="string",hn=n=>typeof n=="function",Vt=n=>typeof n>"u",hi=n=>Vt(n)||n===null,Uo=n=>zn&&n instanceof SVGElement,_c=n=>Pu.test(n),xc=n=>Rn(n,"rgb"),yc=n=>Rn(n,"hsl"),ku=n=>_c(n)||(xc(n)||yc(n))&&(n[n.length-1]===")"||!Ru.test(n)),Nr=n=>!de.defaults.hasOwnProperty(n),Op=["opacity","rotate","overflow","color"],zu=(n,t)=>{if(Op.includes(t))return!1;if(n.getAttribute(t)||t in n){if(t==="scale"){let e=n.parentNode;return e&&e.tagName==="filter"}return!0}},Fo=n=>yn(n)?parseFloat(n):n,ps=Math.pow,Ur=Math.sqrt,Vu=Math.sin,Hu=Math.cos,Fr=Math.abs;var ms=Math.floor,Gu=Math.asin;var Or=Math.PI,Bu=Math.round,vn=(n,t,e)=>n<t?t:n>e?e:n,xe=(n,t)=>{if(t<0)return n;if(!t)return Bu(n);let e=10**t;return Bu(n*e)/e};var Fs=(n,t,e)=>e===1?t:e===0?n:n+(t-n)*e,gs=n=>n===1/0?Pr:n===-1/0?-Pr:n,Si=n=>n<=ie?ie:gs(xe(n,11)),Ve=n=>Hn(n)?[...n]:n,Oo=(n,t)=>{let e={...n};for(let i in t){let s=n[i];e[i]=Vt(s)?t[i]:s}return e},ye=(n,t,e,i="_prev",s="_next")=>{let r=n._head,o=s;for(e&&(r=n._tail,o=i);r;){let a=r[o];t(r),r=a}},bi=(n,t,e="_prev",i="_next")=>{let s=t[e],r=t[i];s?s[i]=r:n._head=r,r?r[e]=s:n._tail=s,t[e]=null,t[i]=null},Zn=(n,t,e,i="_prev",s="_next")=>{let r=n._tail;for(;r&&e&&e(r,t);)r=r[i];let o=r?r[s]:n._head;r?r[s]=t:n._head=t,o?o[i]=t:n._tail=t,t[i]=r,t[s]=o};var Wu=(n,t,e)=>{let i=n.style.transform;if(i){let s=n[Wi],r=0,o=i.length,a;for(;r<o;){for(;r<o&&i.charCodeAt(r)===32;)r++;if(r>=o)break;let c=r;for(;r<o&&i.charCodeAt(r)!==40;)r++;if(r>=o)break;let u=i.substring(c,r),d=1,h=r+1,f=-1,p=-1;for(r++;r<o&&d>0;){let m=i.charCodeAt(r);m===40?d++:m===41?d--:m===44&&d===1&&(f===-1?f=r:p===-1&&(p=r)),r++}let _=r-1;u==="translate"||u==="translate3d"?(f===-1?s.translateX=i.substring(h,_).trim():(s.translateX=i.substring(h,f).trim(),p===-1?s.translateY=i.substring(f+1,_).trim():(s.translateY=i.substring(f+1,p).trim(),s.translateZ=i.substring(p+1,_).trim())),a=i.substring(h,_)):u==="scale"||u==="scale3d"?f===-1?s.scale=i.substring(h,_).trim():(s.scaleX=i.substring(h,f).trim(),p===-1?s.scaleY=i.substring(f+1,_).trim():(s.scaleY=i.substring(f+1,p).trim(),s.scaleZ=i.substring(p+1,_).trim())):s[u]=i.substring(h,_)}if(t==="translate3d"&&a)return e&&(e[t]=a),a;let l=s[t];if(!Vt(l))return e&&(e[t]=l),l}return t==="translate3d"?"0px, 0px, 0px":t==="rotate3d"?"0, 0, 0, 0deg":Rn(t,"scale")?"1":Rn(t,"rotate")||Rn(t,"skew")?"0deg":"0px"},Bo=n=>{let t=Vn;for(let e=0,i=Ns.length;e<i;e++){let s=Ns[e],r=n[s];if(r!==void 0){if(s==="translateX"){let o=n.translateY;if(o!==void 0){let a=n.translateZ;a!==void 0?(t+=`translate3d(${r},${o},${a}) `,e+=2):(t+=`translate(${r},${o}) `,e+=1);continue}}if(s==="scaleX"&&n.scale===void 0){let o=n.scaleY;if(o!==void 0){let a=n.scaleZ;a!==void 0?(t+=`scale3d(${r},${o},${a}) `,e+=2):(t+=`scale(${r},${o}) `,e+=1);continue}}t+=`${Au[s]}${r}) `}s==="rotateZ"&&n.rotate3d!==void 0&&(t+=`rotate3d(${n.rotate3d}) `)}return n.matrix!==void 0&&(t+=`matrix(${n.matrix}) `),n.matrix3d!==void 0&&(t+=`matrix3d(${n.matrix3d}) `),t};var vc=[];function ko(n,t){if(!n)return null;let e=vc.length;t:for(let i=0;i<e;i++){let s=vc[i];if(s.detect&&!s.detect(n))continue;let r=s.targetAdapters;for(let o=0,a=r.length;o<a;o++){let l=r[o];if(l.detect(n)){let c=l.props[t];if(c&&(!c.gate||c.gate(n)))return c;break t}}}for(let i=0;i<e;i++){let s=vc[i];if(s.detect&&!s.detect(n))continue;let r=s.propertyResolvers;for(let o=0,a=r.length;o<a;o++){let l=r[o](n,t);if(l)return l}}return null}var Bp=n=>{let t=Iu.exec(n)||Lu.exec(n),e=Vt(t[4])?1:+t[4];return[+t[1],+t[2],+t[3],e]},kp=n=>{let t=n.length,e=t===4||t===5;return[+("0x"+n[1]+n[e?1:2]),+("0x"+n[e?2:3]+n[e?2:4]),+("0x"+n[e?3:5]+n[e?3:6]),t===5||t===9?+(+("0x"+n[e?4:7]+n[e?4:8])/255).toFixed(3):1]},Mc=(n,t,e)=>(e<0&&(e+=1),e>1&&(e-=1),e<1/6?n+(t-n)*6*e:e<1/2?t:e<2/3?n+(t-n)*(2/3-e)*6:n),zp=n=>{let t=Du.exec(n)||Nu.exec(n),e=+t[1]/360,i=+t[2]/100,s=+t[3]/100,r=Vt(t[4])?1:+t[4],o,a,l;if(i===0)o=a=l=s;else{let c=s<.5?s*(1+i):s+i-s*i,u=2*s-c;o=xe(Mc(u,c,e+1/3)*255,0),a=xe(Mc(u,c,e)*255,0),l=xe(Mc(u,c,e-1/3)*255,0)}return[o,a,l,r]},Xu=n=>xc(n)?Bp(n):_c(n)?kp(n):yc(n)?zp(n):[0,0,0,1];var Oe=(n,t)=>Vt(n)?t:n,qu=(n,t)=>{let e=n.match(Ou),i=t[li]?t:document.documentElement,s=getComputedStyle(i)?.getPropertyValue(e[1]);return(!s||s.trim()===Vn)&&e[2]&&(s=e[2].trim()),s||0},ui=(n,t,e,i,s,r)=>{if(hn(n)){if(!s){let a=n(t,e,i,r);return isNaN(+a)?a||0:+a}let o=()=>{let a=n(t,e,i,r);return isNaN(+a)?a||0:+a};return s.func=o,o()}if(yn(n)&&Rn(n,wu)){if(!s)return qu(n,t);let o=()=>qu(n,t);return s.func=o,o()}return n},Sc=(n,t)=>n[li]?n[Lo]&&zu(n,t)?Me.ATTRIBUTE:Ns.includes(t)||Do.get(t)?Me.TRANSFORM:Rn(t,"--")?Me.CSS_VAR:t in n.style?Me.CSS:t in n?Me.OBJECT:Me.ATTRIBUTE:Me.OBJECT,Yu=(n,t,e)=>{let i=n.style[t];i&&e&&(e[t]=i);let s=i||getComputedStyle(n[Eu]||n).getPropertyValue(t);return s==="auto"?"0":s},Xi=(n,t,e,i)=>{let s=Vt(e)?Sc(n,t):e,r=ko(n,t);if(r){let o=r.get(n);return o&&i&&(i[t]=o),o??0}if(s===Me.OBJECT){let o=n[t];return o&&i&&(i[t]=o),o||0}if(s===Me.ATTRIBUTE){let o=n.getAttribute(t);return o&&i&&(i[t]=o),o}return s===Me.TRANSFORM?Wu(n,t,i):s===Me.CSS_VAR?Yu(n,t,i).trimStart():Yu(n,t,i)},Os=(n,t,e)=>e==="-"?n-t:e==="+"?n+t:n*t,zo=()=>({t:re.NUMBER,n:0,u:null,o:null,d:null,s:null}),Mn=(n,t)=>{if(t.t=re.NUMBER,t.n=0,t.u=null,t.o=null,t.d=null,t.s=null,!n)return t;let e=+n;if(!isNaN(e))return t.n=e,t;let i=n;i[1]==="="&&(t.o=i[0],i=i.slice(2));let s=i.includes(" ")?!1:No.exec(i);if(s)return t.t=re.UNIT,t.n=+s[1],t.u=s[2],t;if(t.o)return t.n=+i,t;if(ku(i))return t.t=re.COLOR,t.d=Xu(i),t;{let r=i.match(pc);return t.t=re.COMPLEX,t.d=r?r.map(Number):[],t.s=i.split(pc)||[],t}},bc=(n,t)=>(t.t=n._valueType,t.n=n._toNumber,t.u=n._unit,t.o=null,t.d=Ve(n._toNumbers),t.s=Ve(n._strings),t),Pn=zo(),Vo=(n,t,e)=>{let i=n._modifier,s=n._fromNumbers,r=n._toNumbers,o=n._strings,a=o[0];for(let l=0,c=r.length;l<c;l++){let u=i(xe(Fs(s[l],r[l],t),e)),d=o[l+1];a+=`${d?u+d:u}`,n._numbers[l]=u}return a};var Br=(n,t,e,i,s)=>{let r=n.parent,o=n.duration,a=n.completed,l=n.iterationDuration,c=n.iterationCount,u=n._currentIteration,d=n._loopDelay,h=n._reversed,f=n._alternate,p=n._hasChildren,_=n._delay,m=n._currentTime,g=_+l,S=t-_,A=vn(m,-_,o),v=vn(S,-_,o),b=S-m,T=v>0,C=v>=o,y=o<=ie,w=s===We.FORCE,P=0,F=S,B=0;if(c>1){let J=l+(C?0:d),et=~~(v/J);n._currentIteration=vn(et,0,c),C&&n._currentIteration--,P=n._currentIteration%2,F=v-et*J||0}let V=h^(f&&P),I=n._ease,k=C?V?0:o:V?l-F:F;I&&(k=l*I(k/l)||0);let W=(r?r.backwards:S<m)?!V:!!V;if(n._currentTime=S,n._iterationTime=k,n.backwards=W,T&&!n.began?(n.began=!0,!e&&!(r&&(W||!r.began))&&n.onBegin(n)):S<=0&&(n.began=!1),!e&&!p&&T&&n._currentIteration!==u&&n.onLoop(n),w||s===We.AUTO&&(t>=(r&&_>0?0:_)&&t<=g||t<=_&&A>_||t>=g&&A!==o)||k>=g&&A!==o||k<=_&&A>0&&!C||t<=A&&A===o&&a||C&&!a&&y){if(T&&(n.computeDeltaTime(A),e||n.onBeforeUpdate(n)),!p){let J=w||(W?b*-1:b)>=de.tickThreshold,et=xe(n._offset+(r?r._offset:0)+_+k,12),U=n._head,q,j,yt,Tt,pe=0;for(;U;){let qt=U._composition,Et=U._currentTime,Y=U._changeDuration,K=U._absoluteStartTime+U._changeDuration,it=U._nextRep,Rt=U._prevRep,ot=qt!==Fe.none,ut=Rt?Rt._absoluteStartTime+Rt._changeDuration:0,Yt=Rt&&Rt.parent!==U.parent,Ot=!it||it._isOverridden?K:it.parent===U.parent?K+it._delay:it._absoluteStartTime<it._absoluteUpdateStartTime?it._absoluteStartTime:it._absoluteUpdateStartTime;if((J||(Et!==Y||et<=Ot||Rt&&!Yt&&(!it||it.parent!==U.parent))&&(Et!==0||et>=U._absoluteStartTime||Yt&&!U._hasFromValue&&!Rt._isOverridden&&et>=ut||it&&!it._isOverridden&&it.parent===U.parent&&it._currentTime!==0&&k<it._startTime))&&(!Rt||Yt||k>=U._startTime)&&(!ot||!U._isOverridden&&(!U._isOverlapped||et<=K)&&(!it||it._isOverridden||et<=Ot)&&(!Rt||Rt._isOverridden||(Yt?et>=U._absoluteStartTime||!U._hasFromValue&&et>=ut:et>=ut+U._delay)))){let Wt=U._currentTime=vn(k-U._startTime,0,Y),kt=U._ease(Wt/U._updateDuration),Dt=U._modifier,te=U._valueType,ue=U._tweenType,be=ue===Me.OBJECT,jt=te===re.NUMBER,le=jt&&be||kt===0||kt===1?-1:de.precision,R,ne;if(jt)R=ne=Dt(xe(Fs(U._fromNumber,U._toNumber,kt),le));else if(te===re.UNIT)ne=Dt(xe(Fs(U._fromNumber,U._toNumber,kt),le)),R=`${ne}${U._unit}`;else if(te===re.COLOR){let Pt=U._numbers,E=U._fromNumbers,x=U._toNumbers,O=1-kt,z=E[0],Z=E[1],st=E[2],rt=x[0],$=x[1],Q=x[2];Pt[0]=Dt(Math.sqrt(z*z*O+rt*rt*kt)),Pt[1]=Dt(Math.sqrt(Z*Z*O+$*$*kt)),Pt[2]=Dt(Math.sqrt(st*st*O+Q*Q*kt)),Pt[3]=Dt(Fs(E[3],x[3],kt)),(!U._setter||i)&&(R=`rgba(${xe(Pt[0],0)},${xe(Pt[1],0)},${xe(Pt[2],0)},${Pt[3]})`)}else te===re.COMPLEX&&(R=Vo(U,kt,le));if(ot&&(U._number=ne),!i&&qt!==Fe.blend){let Pt=U.property;q=U.target,U._setter?U._setter(q,ne,U):be?q[Pt]=R:ue===Me.ATTRIBUTE?q.setAttribute(Pt,R):(j=q.style,ue===Me.TRANSFORM?(q!==yt&&(yt=q,Tt=q[Wi]),Tt[Pt]=R,pe=1):ue===Me.CSS?j[Pt]=R:ue===Me.CSS_VAR&&j.setProperty(Pt,R)),T&&(B=1)}else U._value=R}else Et&&Rt&&!Yt&&k<U._startTime&&(U._currentTime=0);pe&&U._renderTransforms&&(j.transform=Bo(Tt),pe=0),U=U._next}!e&&B&&n.onRender(n)}!e&&T&&n.onUpdate(n)}return r&&y?!e&&(r.began&&!W&&S>0&&!a||W&&S<=ie&&a)&&(n.onComplete(n),n.completed=!W):T&&C?c===1/0?n._startTime+=n.duration:n._currentIteration>=c-1&&(n.paused=!0,!a&&!p&&(n.completed=!0,!e&&!(r&&(W||!r.began))&&(n.onComplete(n),n._resolve(n)))):n.completed=!1,B},di=(n,t,e,i,s)=>{let r=n._currentIteration;if(Br(n,t,e,i,s),n._hasChildren){let o=n,a=o.backwards,l=i?t:o._iterationTime,c=Mi(),u=0,d=!0;if(!i&&o._currentIteration!==r){let h=o.iterationDuration;ye(o,f=>{if(!a)!f.completed&&!f.backwards&&f._currentTime<f.iterationDuration&&Br(f,h,e,1,We.FORCE),f.began=!1,f.completed=!1;else{let p=f.duration,_=f._offset+f._delay,m=_+p;!e&&p<=ie&&(!_||m===h)&&f.onComplete(f)}}),e||o.onLoop(o)}ye(o,h=>{let f=xe((l-h._offset)*h._speed,12);if(a&&f>h._delay+h.duration)return;let p=h._fps<o._fps?h.requestTick(c):s;u+=Br(h,f,e,i,p),!h.completed&&d&&(d=!1)},a),!e&&u&&o.onRender(o),(d||a)&&o._currentTime>=o.duration&&(o.paused=!0,o.completed||(o.completed=!0,e||(o.onComplete(o),o._resolve(o))))}};var Zu={},Ho=(n,t,e)=>{if(e===Me.TRANSFORM){let i=Do.get(n);return i||n}else if(e===Me.CSS||e===Me.ATTRIBUTE&&Uo(t)&&n in t.style){let i=Zu[n];if(i)return i;{let s=n&&gc(n);return Zu[n]=s,s}}else return n},kr=(n,t=!1)=>{if(n._hasChildren)ye(n,e=>kr(e,t),!0);else{let e=n;e.pause(),ye(e,i=>{let s=i.property,r=i.target,o=i._tweenType,a=i._inlineValue,l=hi(a)||a===Vn;if(i._setter){if(!t&&!l){if(Mn(a,Pn),Pn.d){let c=Pn.d,u=i._numbers;for(let d=0,h=c.length;d<h;d++)u[d]=c[d]}else i._number=Pn.n;i._setter(i.target,i._number,i)}}else if(o===Me.OBJECT)!t&&!l&&(r[s]=a);else if(r[li])if(o===Me.ATTRIBUTE)t||(l?r.removeAttribute(s):r.setAttribute(s,a));else{let c=r.style;if(o===Me.TRANSFORM){let u=r[Wi];l?delete u[s]:u[s]=a,i._renderTransforms&&(Object.keys(u).length?c.transform=Bo(u):c.removeProperty("transform"))}else l?c.removeProperty(gc(s)):c[s]=a}r[li]&&e._tail===i&&e.targets.forEach(c=>{c.getAttribute&&c.getAttribute("style")===Vn&&c.removeAttribute("style")})})}return n};var Bs=class{constructor(t=0){this.deltaTime=0,this._currentTime=t,this._lastTickTime=t,this._startTime=t,this._lastTime=t,this._frameDuration=ci/Ir,this._fps=Ir,this._speed=1,this._hasChildren=!1,this._head=null,this._tail=null}get fps(){return this._fps}set fps(t){let e=+t,i=e<ie?ie:e,s=ci/i;i>Us.frameRate&&(Us.frameRate=i),this._fps=i,this._frameDuration=s}get speed(){return this._speed}set speed(t){let e=+t;this._speed=e<ie?ie:e}requestTick(t){let e=this._frameDuration,i=t-this._lastTickTime,s=e*.25,r=s<4?s:4;return i+r<e?We.NONE:(this._lastTickTime=i>=e?t-i%e:t,We.AUTO)}computeDeltaTime(t){let e=t-this._lastTime;return this.deltaTime=e,this._lastTime=t,e}};var Ti={animation:null,update:cn},Ju=n=>{let t=Ti.animation;return t||(t={duration:ie,computeDeltaTime:cn,_offset:0,_delay:0,_head:null,_tail:null},Ti.animation=t,Ti.update=()=>{n.forEach(e=>{for(let i in e){let s=e[i],r=s._head;if(r){let o=r._valueType,a=o===re.COMPLEX||o===re.COLOR?Ve(r._fromNumbers):null,l=r._fromNumber,c=s._tail;for(;c&&c!==r;){if(a)for(let u=0,d=c._numbers.length;u<d;u++)a[u]+=c._numbers[u];else l+=c._number;c=c._prevAdd}r._toNumber=l,r._toNumbers=a}}}),Br(t,1,1,0,We.FORCE)}),t};var $u=zn?requestAnimationFrame:setImmediate,Vp=zn?cancelAnimationFrame:clearImmediate,Tc=class extends Bs{constructor(t){super(t),this.useDefaultMainLoop=!0,this.pauseOnDocumentHidden=!0,this.defaults=Us,this.paused=!0,this.reqId=0}update(){let t=this._currentTime=Mi();if(this.requestTick(t)){this.computeDeltaTime(t);let e=this._speed,i=this._fps,s=this._head;for(;s;){let r=s._next;s.paused?(bi(this,s),this._hasChildren=!!this._tail,s._running=!1,s.completed&&!s._cancelled&&s.cancel()):di(s,(t-s._startTime)*s._speed*e,0,0,s._fps<i?s.requestTick(t):We.AUTO),s=r}Ti.update()}}wake(){return this.useDefaultMainLoop&&!this.reqId&&(this.requestTick(Mi()),this.reqId=$u(Ku)),this}pause(){if(this.reqId)return this.paused=!0,Hp()}resume(){if(this.paused)return this.paused=!1,ye(this,t=>t.resetTime()),this.wake()}get speed(){return this._speed*(de.timeScale===1?1:ci)}set speed(t){let e=t*de.timeScale;this._speed!==e&&(this._speed=e,ye(this,i=>i.speed=i._speed))}get timeUnit(){return de.timeScale===1?"ms":"s"}set timeUnit(t){let i=t==="s",s=i?.001:1;if(de.timeScale!==s){de.timeScale=s,de.tickThreshold=200*s;let r=i?.001:ci;this.defaults.duration*=r,this._speed*=r}}get precision(){return de.precision}set precision(t){de.precision=t}},Xe=(()=>{let n=new Tc(Mi());return zn&&(mc.engine=n,Gi.addEventListener("visibilitychange",()=>{n.pauseOnDocumentHidden&&(Gi.hidden?n.pause():n.resume())})),n})(),Ku=()=>{Xe._head?(Xe.reqId=$u(Ku),Xe.update()):Xe.reqId=0},Hp=()=>(Vp(Xe.reqId),Xe.reqId=0,Xe);var Go={_rep:new WeakMap,_add:new Map},Vr=(n,t,e="_rep")=>{let i=Go[e],s=i.get(n);return s||(s={},i.set(n,s)),s[t]?s[t]:s[t]={_head:null,_tail:null}},Gp=(n,t)=>n._isOverridden||n._absoluteStartTime>t._absoluteStartTime,zr=n=>{n._isOverlapped=1,n._isOverridden=1,n._changeDuration=ie,n._currentTime=ie},Wo=(n,t)=>{let e=n._composition;if(e===Fe.replace){let i=n._absoluteStartTime;Zn(t,n,Gp,"_prevRep","_nextRep");let s=n._prevRep;if(s){let r=s.parent,o=s._absoluteEndTime;if(n.parent.id!==r.id&&r.iterationCount>1&&o+(r.duration-r.iterationDuration)>i){zr(s);let c=s._prevRep;for(;c&&c.parent.id===r.id;)zr(c),c=c._prevRep}let a=n._absoluteUpdateStartTime;if(o>a){let c=s._startTime,u=o-(c+s._updateDuration),d=xe(a-u-c,12);s._changeDuration=d,s._currentTime=d,s._isOverlapped=1,d<ie&&zr(s)}let l=n.parent.parent;if(!l||l!==r.parent){let c=!0;if(ye(r,u=>{u._isOverlapped||(c=!1)}),c){let u=r.parent;if(u){let d=!0;ye(u,h=>{h!==r&&ye(h,f=>{f._isOverlapped||(d=!1)})}),d&&u.cancel()}else r.cancel()}}}}else if(e===Fe.blend){let i=Vr(n.target,n.property,"_add"),s=Ju(Go._add),r=i._head;r||(r={...n},r._composition=Fe.replace,r._updateDuration=ie,r._startTime=0,r._numbers=Ve(n._fromNumbers),r._number=0,r._next=null,r._prev=null,Zn(i,r),Zn(s,r));let o=n._toNumber;if(n._fromNumber=r._fromNumber-o,n._toNumber=0,n._numbers=Ve(n._fromNumbers),n._number=0,r._fromNumber=o,n._toNumbers.length){let a=Ve(n._toNumbers);a.forEach((l,c)=>{n._fromNumbers[c]=r._fromNumbers[c]-l,n._toNumbers[c]=0}),r._fromNumbers=a}Zn(i,n,null,"_prevAdd","_nextAdd")}return n},Ec=n=>{let t=n._composition;if(t!==Fe.none){let e=n.target,i=n.property,o=Go._rep.get(e)[i];if(bi(o,n,"_prevRep","_nextRep"),t===Fe.blend){let a=Go._add,l=a.get(e);if(!l)return;let c=l[i],u=Ti.animation;bi(c,n,"_prevAdd","_nextAdd");let d=c._head;if(d&&d===c._tail){bi(c,d,"_prevAdd","_nextAdd"),bi(u,d);let h=!0;for(let f in l)if(l[f]._head){h=!1;break}h&&a.delete(e)}}}return n},ju=(n,t,e)=>{let i=!1;return ye(t,s=>{let r=s.target;if(n.includes(r)){let o=s.property,a=s._tweenType,l=Ho(e,r,a);(!l||l&&l===o)&&(s.parent._tail===s&&s._tweenType===Me.TRANSFORM&&s._prev&&s._prev._tweenType===Me.TRANSFORM&&(s._prev._renderTransforms=1),bi(t,s),Ec(s),i=!0)}},!0),i},wc=(n,t,e)=>{let i=t||Xe,s;if(i._hasChildren){let r=0;ye(i,o=>{if(!o._hasChildren)if(s=ju(n,o,e),s&&!o._head)o.cancel(),bi(i,o);else{let l=o._offset+o._delay+o.duration;l>r&&(r=l)}o._head?wc(n,o,e):o._hasChildren=!1},!0),Vt(i.iterationDuration)||(i.iterationDuration=r)}else s=ju(n,i,e);s&&!i._head&&(i._hasChildren=!1,i.cancel&&i.cancel())};var Qu=n=>(n.paused=!0,n.began=!1,n.completed=!1,n),Ac=n=>(n._cancelled&&(n._hasChildren?ye(n,Ac):ye(n,t=>{t._composition!==Fe.none&&Wo(t,Vr(t.target,t.property))}),n._cancelled=0),n),td=0,Wp=(n,t)=>n._priority>t._priority,_s=class extends Bs{constructor(t={},e=null,i=0){super(0),++td;let{id:s,delay:r,duration:o,reversed:a,alternate:l,loop:c,loopDelay:u,autoplay:d,frameRate:h,playbackRate:f,priority:p,onComplete:_,onLoop:m,onPause:g,onBegin:S,onBeforeUpdate:A,onUpdate:v}=t;Dr.current&&Dr.current.register(this);let b=e?0:Xe._lastTickTime,T=e?e.defaults:de.defaults,C=hn(r)||Vt(r)?T.delay:+r,y=hn(o)||Vt(o)?1/0:+o,w=Oe(c,T.loop),P=Oe(u,T.loopDelay),F=w===!0||w===1/0||w<0?1/0:w+1,B=0;e?B=i:(Xe.reqId||Xe.requestTick(Mi()),B=(Xe._lastTickTime-Xe._startTime)*de.timeScale),this.id=Vt(s)?td:s,this.parent=e,this.duration=gs((y+P)*F-P)||ie,this.backwards=!1,this.paused=!0,this.began=!1,this.completed=!1,this.onBegin=S||T.onBegin,this.onBeforeUpdate=A||T.onBeforeUpdate,this.onUpdate=v||T.onUpdate,this.onLoop=m||T.onLoop,this.onPause=g||T.onPause,this.onComplete=_||T.onComplete,this.iterationDuration=y,this.iterationCount=F,this._autoplay=e?!1:Oe(d,T.autoplay),this._offset=B,this._delay=C,this._loopDelay=P,this._iterationTime=0,this._currentIteration=0,this._resolve=cn,this._running=!1,this._reversed=+Oe(a,T.reversed),this._reverse=this._reversed,this._cancelled=0,this._alternate=Oe(l,T.alternate),this._prev=null,this._next=null,this._lastTickTime=b,this._startTime=b,this._lastTime=b,this._fps=Oe(h,T.frameRate),this._speed=Oe(f,T.playbackRate),this._priority=+Oe(p,1)}get cancelled(){return!!this._cancelled}set cancelled(t){t?this.cancel():this.reset(!0).play()}get currentTime(){return vn(xe(this._currentTime,de.precision),-this._delay,this.duration)}set currentTime(t){let e=this.paused;this.pause().seek(+t),e||this.resume()}get iterationCurrentTime(){return vn(xe(this._iterationTime,de.precision),0,this.iterationDuration)}set iterationCurrentTime(t){this.currentTime=this.iterationDuration*this._currentIteration+t}get progress(){return vn(xe(this._currentTime/this.duration,10),0,1)}set progress(t){this.currentTime=this.duration*t}get iterationProgress(){return vn(xe(this._iterationTime/this.iterationDuration,10),0,1)}set iterationProgress(t){let e=this.iterationDuration;this.currentTime=e*this._currentIteration+e*t}get currentIteration(){return this._currentIteration}set currentIteration(t){this.currentTime=this.iterationDuration*vn(+t,0,this.iterationCount-1)}get reversed(){return!!this._reversed}set reversed(t){t?this.reverse():this.play()}get speed(){return super.speed}set speed(t){super.speed=t,this.resetTime()}reset(t=!1){return Ac(this),this._reversed&&!this._reverse&&(this.reversed=!1),this._iterationTime=this.iterationDuration,di(this,0,1,~~t,We.FORCE),Qu(this),this._hasChildren&&ye(this,Qu),this}init(t=!1){this.fps=this._fps,this.speed=this._speed,!t&&this._hasChildren&&di(this,this.duration,1,~~t,We.FORCE),this.reset(t);let e=this._autoplay;return e===!0?this.resume():e&&!Vt(e.linked)&&e.link(this),this}resetTime(){let t=1/(this._speed*Xe._speed);return this._startTime=Mi()-(this._currentTime+this._delay)*t,this}pause(){return this.paused?this:(this.paused=!0,this.onPause(this),this)}resume(){return this.paused?(this.paused=!1,this.duration<=ie&&!this._hasChildren?di(this,ie,0,0,We.FORCE):(this._running||(Zn(Xe,this,Wp),Xe._hasChildren=!0,this._running=!0),this.resetTime(),this._startTime-=12,Xe.wake()),this):this}restart(){return this.reset().resume()}seek(t,e=0,i=0){Ac(this),this.completed=!1;let s=this.paused;return this.paused=!0,di(this,t+this._delay,~~e,~~i,We.AUTO),s?this:this.resume()}alternate(){let t=this._reversed,e=this.iterationCount,i=this.iterationDuration,s=e===1/0?ms(Pr/i):e;return this._reversed=+(this._alternate&&!(s%2)?t:!t),e===1/0?this.iterationProgress=this._reversed?1-this.iterationProgress:this.iterationProgress:this.seek(i*s-this._currentTime),this.resetTime(),this}play(){return this._reversed&&this.alternate(),this.resume()}reverse(){return this._reversed||this.alternate(),this.resume()}cancel(){return this._hasChildren?ye(this,t=>t.cancel(),!0):ye(this,Ec),this._cancelled=1,this.pause()}stretch(t){let e=this.duration,i=Si(t);if(e===i)return this;let s=t/e,r=t<=ie;return this.duration=r?ie:i,this.iterationDuration=r?ie:Si(this.iterationDuration*s),this._offset*=s,this._delay*=s,this._loopDelay*=s,this}revert(){di(this,0,1,0,We.AUTO);let t=this._autoplay;return t&&t.linked&&t.linked===this&&t.revert(),this.cancel()}complete(t=0){return this.seek(this.duration,t).cancel()}then(t=cn){let e=this.then,i=()=>{this.then=null,t(this),this.then=e,this._resolve=cn};return new Promise(s=>(this._resolve=()=>s(i()),this.completed&&this._resolve(),this))}};function ed(n){let t=yn(n)?Dr.root.querySelectorAll(n):n;if(t instanceof NodeList||t instanceof HTMLCollection)return t}function Xo(n){if(hi(n))return[];if(!zn)return Hn(n)&&n.flat(1/0)||[n];if(Hn(n)){let e=n.flat(1/0),i=[];for(let s=0,r=e.length;s<r;s++){let o=e[s];if(!hi(o)){let a=ed(o);if(a)for(let l=0,c=a.length;l<c;l++){let u=a[l];if(!hi(u)){let d=!1;for(let h=0,f=i.length;h<f;h++)if(i[h]===u){d=!0;break}d||i.push(u)}}else{let l=!1;for(let c=0,u=i.length;c<u;c++)if(i[c]===o){l=!0;break}l||i.push(o)}}}return i}let t=ed(n);return t?Array.from(t):[n]}function qo(n){let t=Xo(n),e=t.length;for(let i=0;i<e;i++){let s=t[i];if(!s[fc]){s[fc]=!0;let r=Uo(s);(s.nodeType||r)&&(s[li]=!0,s[Lo]=r,s[Wi]={})}}return t}var Cc={deg:1,rad:180/Or,turn:360},nd={},Rc=(n,t,e,i=!1)=>{let s=t.u,r=t.n;if(t.t===re.UNIT&&s===e)return t;let o=r+s+e,a=nd[o];if(!Vt(a)&&!i)t.n=a;else{let l;if(s in Cc)l=r*Cc[s]/Cc[e];else{let u=n.cloneNode(),d=n.parentNode,h=d&&d!==Gi?d:Gi.body;h.appendChild(u);let f=u.style;f.width=100+s;let p=u.offsetWidth||100;f.width=100+e;let _=u.offsetWidth||100,m=p/_;h.removeChild(u),l=m*r}t.n=l,nd[o]=l}return t.t,re.UNIT,t.u=e,t};var Ei=n=>n;var Hr=(n=1.68)=>t=>ps(t,+n),Ic={in:n=>t=>n(t),out:n=>t=>1-n(1-t),inOut:n=>t=>t<.5?n(t*2)/2:1-n(t*-2+2)/2,outIn:n=>t=>t<.5?(1-n(1-t*2))/2:(n(t*2-1)+1)/2},Xp=Or/2,id=Or*2,sd={[Vn]:Hr,Quad:Hr(2),Cubic:Hr(3),Quart:Hr(4),Quint:Hr(5),Sine:n=>1-Hu(n*Xp),Circ:n=>1-Ur(1-n*n),Expo:n=>n?ps(2,10*n-10):0,Bounce:n=>{let t,e=4;for(;n<((t=ps(2,--e))-1)/11;);return 1/ps(4,3-e)-7.5625*ps((t*3-2)/22-n,2)},Back:(n=1.7)=>t=>(+n+1)*t*t*t-+n*t*t,Elastic:(n=1,t=.3)=>{let e=vn(+n,1,10),i=vn(+t,ie,2),s=i/id*Gu(1/e),r=id/i;return o=>o===0||o===1?o:-e*ps(2,-10*(1-o))*Vu((1-o-s)*r)}},Pc=(()=>{let n={linear:Ei,none:Ei};for(let t in Ic)for(let e in sd){let i=sd[e],s=Ic[t];n[t+e]=e===Vn||e==="Back"||e==="Elastic"?(r,o)=>s(i(r,o)):s(i)}return n})(),Yo={linear:Ei,none:Ei},qp=n=>{if(Yo[n])return Yo[n];if(n.indexOf("(")<=-1){let e=Ic[n]||n.includes("Back")||n.includes("Elastic")?Pc[n]():Pc[n];return e?Yo[n]=e:Ei}else{let t=n.slice(0,-1).split("("),e=Pc[t[0]];return e?Yo[n]=e(...t[1].split(",")):Ei}},rd=["steps(","irregular(","linear(","cubicBezier("],xs=n=>{if(yn(n)){for(let e=0,i=rd.length;e<i;e++)if(Rn(n,rd[e]))return console.warn(`String syntax for \`ease: "${n}"\` has been removed from the core and replaced by importing and passing the easing function directly: \`ease: ${n}\``),Ei}return hn(n)?n:yn(n)?qp(n):Ei};var $t=zo(),oe=zo(),ks={},Zo={func:null},Jo={func:null},$o=[null],zs=[null,null],Ko={to:null},Yp=0,od=0,qi,fi,Zp=(n,t)=>{let e={};if(Hn(n)){let i=[].concat(...n.map(s=>Object.keys(s))).filter(Nr);for(let s=0,r=i.length;s<r;s++){let o=i[s],a=n.map(l=>{let c={};for(let u in l){let d=l[u];Nr(u)?u===o&&(c.to=d):c[u]=d}return c});e[o]=a}}else{let i=Oe(t.duration,de.defaults.duration);Object.keys(n).map(r=>({o:parseFloat(r)/100,p:n[r]})).sort((r,o)=>r.o-o.o).forEach(r=>{let o=r.o,a=r.p;for(let l in a)if(Nr(l)){let c=e[l];c||(c=e[l]=[]);let u=o*i,d=c.length,h=c[d-1],f={to:a[l]},p=0;for(let _=0;_<d;_++)p+=c[_].duration;d===1&&(f.from=h.to),a.ease&&(f.ease=a.ease),f.duration=u-(d?p:0),c.push(f)}return r});for(let r in e){let o=e[r],a;for(let l=0,c=o.length;l<c;l++){let u=o[l],d=u.ease;u.ease=a||void 0,a=d}o[0].duration||o.shift()}}return e},Vs=class extends _s{constructor(t,e,i,s,r=!1,o=0,a){super(e,i,s),this._head,this._tail,++od;let l=qo(t),c=l.length,u=e.keyframes,d=u?Oo(Zp(u,e),e):e,{id:h,delay:f,duration:p,ease:_,playbackEase:m,modifier:g,composition:S,onRender:A}=d,v=i?i.defaults:de.defaults,b=Oe(_,v.ease),T=Oe(m,v.playbackEase),C=T?xs(T):null,y=!Vt(b.ease),w=y?b.ease:Oe(_,C?"linear":v.ease),P=y?b.settlingDuration:Oe(p,v.duration),F=Oe(f,v.delay),B=g||v.modifier,V=Vt(S)&&c>=ci?Fe.none:Vt(S)?v.composition:S,I=this._offset+(i?i._offset:0);y&&(b.parent=this);let k=NaN,W=NaN,J=0,et=0;for(let U=0;U<c;U++){let q=l[U],j=o||U,yt=a||l,Tt=NaN,pe=NaN;for(let qt in d)if(Nr(qt)){let Et=Sc(q,qt),Y=ko(q,qt),K=Ho(qt,q,Et),it=d[qt],Rt=Hn(it);if(r&&!Rt&&(zs[0]=it,zs[1]=it,it=zs),Rt){let kt=it.length,Dt=!fs(it[0]);kt===2&&Dt?(Ko.to=it,$o[0]=Ko,qi=$o):kt>2&&Dt?(qi=[],it.forEach((te,ue)=>{ue?ue===1?(zs[1]=te,qi.push(zs)):qi.push(te):zs[0]=te})):qi=it}else $o[0]=it,qi=$o;let ot=null,ut=null,Yt=NaN,Ot=0,Wt=0;for(let kt=qi.length;Wt<kt;Wt++){let Dt=qi[Wt];fs(Dt)?fi=Dt:(Ko.to=Dt,fi=Ko),Zo.func=null,Jo.func=null;let te=ui(Oe(fi.composition,V),q,j,yt,null,null),ue=xn(te)?te:Fe[te];!ot&&ue!==Fe.none&&(ot=Vr(q,K));let be=ot?ot._tail:null,jt=i&&be&&be.parent.parent===i?be:ut,le=ui(fi.to,q,j,yt,Zo,jt),R;fs(le)&&!Vt(le.to)?(fi=le,R=le.to):R=le;let ne=ui(fi.from,q,j,yt,Jo,jt),Pt=fi.ease||w,E=ui(Pt,q,j,yt,null,jt),x=hn(E)||yn(E)?E:Pt,O=!Vt(x)&&!Vt(x.ease),z=O?x.ease:x,Z=O?x.settlingDuration:ui(Oe(fi.duration,kt>1?ui(P,q,j,yt,null,jt)/kt:P),q,j,yt,null,jt),st=ui(Oe(fi.delay,Wt?0:F),q,j,yt,null,jt),rt=fi.modifier||B,$=!Vt(ne),Q=!Vt(R),at=Hn(R),Ut=at||$&&Q,dt=ut?Ot:0,ct=ut?Ot+st:st,It=xe(I+ct,12),Ht=xe(I+dt,12);!et&&($||at)&&(et=1);let zt=ut;if(ue!==Fe.none){let Nt=ot._head;for(;Nt&&Nt._absoluteStartTime<=It;)if(Nt._isOverridden||(zt=Nt),Nt=Nt._nextRep,Nt&&Nt._absoluteStartTime>=It)for(;Nt;)zr(Nt),Nt=Nt._nextRep}if(Ut){Mn(at?ui(R[0],q,j,yt,Jo,jt):ne,$t),Mn(at?ui(R[1],q,j,yt,Zo,jt):R,oe);let Nt=Xi(q,K,Et,ks);$t.t===re.NUMBER&&(zt?zt._valueType===re.UNIT&&($t.t=re.UNIT,$t.u=zt._unit):(Mn(Nt,Pn),Pn.t===re.UNIT&&($t.t=re.UNIT,$t.u=Pn.u)))}else Q?Mn(R,oe):ut?bc(ut,oe):Mn(i&&zt&&zt.parent.parent===i?zt._value:Xi(q,K,Et,ks),oe),$?Mn(ne,$t):ut?bc(ut,$t):Mn(i&&zt&&zt.parent.parent===i?zt._value:Xi(q,K,Et,ks),$t);if($t.o&&($t.n=Os(zt?zt._toNumber:Mn(Xi(q,K,Et,ks),Pn).n,$t.n,$t.o)),oe.o&&(oe.n=Os($t.n,oe.n,oe.o)),$t.t!==oe.t){if($t.t===re.COMPLEX||oe.t===re.COMPLEX){let Nt=$t.t===re.COMPLEX?$t:oe,Kt=$t.t===re.COMPLEX?oe:$t;Kt.t=re.COMPLEX,Kt.s=Ve(Nt.s),Kt.d=Nt.d.map(()=>Kt.n)}else if($t.t===re.UNIT||oe.t===re.UNIT){let Nt=$t.t===re.UNIT?$t:oe,Kt=$t.t===re.UNIT?oe:$t;Kt.t=re.UNIT,Kt.u=Nt.u}else if($t.t===re.COLOR||oe.t===re.COLOR){let Nt=$t.t===re.COLOR?$t:oe,Kt=$t.t===re.COLOR?oe:$t;Kt.t=re.COLOR,Kt.d=Nt.d.map(()=>0)}}if($t.u!==oe.u){let Nt=oe.u?$t:oe;Nt=Rc(q,Nt,oe.u?oe.u:$t.u,!1)}if(oe.d&&$t.d&&oe.d.length!==$t.d.length){let Nt=$t.d.length>oe.d.length?$t:oe,Kt=Nt===$t?oe:$t;Kt.d=Nt.d.map((Bn,Cn)=>Vt(Kt.d[Cn])?0:Kt.d[Cn]),Kt.s=Ve(Nt.s)}let N=xe(+Z||ie,12),ht=ks[K];hi(ht)||(ks[K]=null);let tt=Y?Y.set:null;Ot=xe(ct+N,12);let lt=$t.d,mt=oe.d,nt=oe.s,xt={parent:this,id:Yp++,property:K,target:q,_value:null,_toFunc:Zo.func,_fromFunc:Jo.func,_ease:xs(z),_fromNumbers:lt?Ve(lt):Lr,_toNumbers:mt?Ve(mt):Lr,_strings:nt?Ve(nt):Lr,_fromNumber:$t.n,_toNumber:oe.n,_numbers:lt?Ve(lt):Lr,_number:$t.n,_unit:oe.u,_modifier:rt,_currentTime:0,_startTime:ct,_delay:+st,_updateDuration:N,_changeDuration:N,_absoluteStartTime:It,_absoluteUpdateStartTime:Ht,_absoluteEndTime:xe(I+Ot,12),_hasFromValue:$||at?1:0,_tweenType:Et,_setter:tt,_valueType:oe.t,_composition:ue,_isOverlapped:0,_isOverridden:0,_renderTransforms:0,_inlineValue:ht,_prevRep:null,_nextRep:null,_prevAdd:null,_nextAdd:null,_prev:null,_next:null};ue!==Fe.none&&Wo(xt,ot);let wt=xt._valueType;if(wt===re.COMPLEX)xt._value=Vo(xt,1,-1);else if(wt===re.UNIT)xt._value=`${rt(xt._toNumber)}${xt._unit}`;else if(wt===re.COLOR){let Nt=oe.d;xt._value=`rgba(${xe(Nt[0],0)},${xe(Nt[1],0)},${xe(Nt[2],0)},${Nt[3]})`}else xt._value=rt(xt._toNumber);isNaN(Yt)&&(Yt=xt._startTime),ut=xt,J++,Zn(this,xt)}(isNaN(W)||Yt<W)&&(W=Yt),(isNaN(k)||Ot>k)&&(k=Ot),Et===Me.TRANSFORM&&(Tt=J-Wt,pe=J)}if(!isNaN(Tt)){let qt=0;ye(this,Et=>{qt>=Tt&&qt<pe&&(Et._renderTransforms=1,Et._composition===Fe.blend&&ye(Ti.animation,Y=>{Y.id===Et.id&&(Y._renderTransforms=1)})),qt++})}}c||console.warn("No target found. Make sure the element you're trying to animate is accessible before creating your animation."),W?(ye(this,U=>{U._startTime-U._delay||(U._delay-=W),U._startTime-=W}),k-=W):W=0,k||(k=ie,this.iterationCount=0),this.targets=l,this.id=Vt(h)?od:h,this.duration=k===ie?ie:gs((k+this._loopDelay)*this.iterationCount-this._loopDelay)||ie,this.onRender=A||v.onRender,this._ease=C,this._delay=W,this.iterationDuration=k,!this._autoplay&&et&&this.onRender(this)}stretch(t){let e=this.duration;if(e===Si(t))return this;let i=t/e;return ye(this,s=>{s._updateDuration=Si(s._updateDuration*i),s._changeDuration=Si(s._changeDuration*i),s._currentTime*=i,s._delay*=i,s._startTime*=i,s._absoluteStartTime*=i,s._absoluteUpdateStartTime*=i,s._absoluteEndTime*=i}),super.stretch(t)}refresh(){return ye(this,t=>{let e=t._toFunc,i=t._fromFunc;(e||i)&&(i?(Mn(i(),$t),$t.u!==t._unit&&t.target[li]&&Rc(t.target,$t,t._unit,!0),t._fromNumbers=Ve($t.d),t._fromNumber=$t.n):e&&(Mn(Xi(t.target,t.property,t._tweenType),Pn),t._fromNumbers=Ve(Pn.d),t._fromNumber=Pn.n),e&&(Mn(e(),oe),t._toNumbers=Ve(oe.d),t._strings=Ve(oe.s),t._toNumber=oe.o?Os(t._fromNumber,oe.n,oe.o):oe.n))}),this.duration===ie&&this.restart(),this}revert(){return super.revert(),kr(this)}then(t){return super.then(t)}},Hs=(n,t)=>de.editor?de.editor.addAnimation(n,t):new Vs(n,t,null,0,!1).init();var Jp=(n,t)=>{if(Rn(t,"<")){let e=t[1]==="<",i=n._tail,s=i?i._offset+i._delay:0;return e?s:s+i.duration}},ys=(n,t)=>{let e=n.iterationDuration;if(e===ie&&(e=0),Vt(t))return e;if(xn(+t))return+t;let i=t,s=n?n.labels:null,r=!hi(s),o=Jp(n,i),a=!Vt(o),l=Fu.exec(i);if(l){let c=l[0],u=i.split(c),d=r&&u[0]?s[u[0]]:e,h=a?o:r?d:e,f=+u[1];return Os(h,f,c[0])}else return a?o:r?Vt(s[i])?e:s[i]:e};function $p(n){return gs((n.iterationDuration+n._loopDelay)*n.iterationCount-n._loopDelay)||ie}function Lc(n,t,e,i,s,r){let a=xn(n.duration)&&n.duration<=ie?e-ie:e;t.composition&&di(t,a,1,1,We.AUTO);let l=i?new Vs(i,n,t,a,!1,s,r):new _s(n,t,a);return t.composition&&l.init(!0),Zn(t,l),ye(t,c=>{let d=c._offset+c._delay+c.duration;d>t.iterationDuration&&(t.iterationDuration=d)}),t.duration=$p(t),t}var ad=0,jo=class extends _s{constructor(t={}){super(t,null,0),++ad,this.id=Vt(t.id)?ad:t.id,this.duration=0,this.labels={};let e=t.defaults,i=de.defaults;this.defaults=e?Oo(e,i):i,this.composition=Oe(t.composition,!0),this.onRender=t.onRender||i.onRender;let s=Oe(t.playbackEase,i.playbackEase);this._ease=s?xs(s):null,this.iterationDuration=0}add(t,e,i){let s=fs(e),r=fs(t);if(s||r){if(this._hasChildren=!0,s){let o=e,a=de.editor&&de.editor.addTimelineChild,l=i&&i.type==="Stagger"&&de.editor,c=hn(i)?i:null;if(c||l){let u=Xo(t),d=this.duration,h=this.iterationDuration,f=o.id,p=0,_=u.length,m=a?a(t,o,this.id,i,_):null,g=c||de.editor.resolveStagger(i.defaultValue);u.forEach(S=>{let A={...m||o};this.duration=d,this.iterationDuration=h,Vt(f)||(A.id=f+"-"+p);let v=ys(this,g(S,p,u,null,this));Lc(A,this,v,S,p,u),p++})}else{let u=a?a(t,o,this.id,i):o,d=i&&i.type?i.defaultValue:i;Lc(u,this,ys(this,d),t)}}else Lc(t,this,ys(this,e));return this.composition&&this.init(!0),this}}sync(t,e){if(Vt(t)||t&&Vt(t.pause))return this;t.pause();let i=+(t.effect?t.effect.getTiming().duration:t.duration);!Vt(t)&&!Vt(t.persist)&&(t.persist=!0);let s=de.editor,r=s&&s.addTimelineChild;s&&s.addTimelineSync&&(e=s.addTimelineSync(t,e,this.id),s.addTimelineChild=null);let o=this.add(t,{currentTime:[0,i],duration:i,delay:0,ease:"linear",playbackEase:"linear"},e);return s&&(s.addTimelineChild=r),o}set(t,e,i){return Vt(e)?this:(e.duration=ie,e.composition=Fe.replace,this.add(t,e,i))}call(t,e){return Vt(t)||t&&!hn(t)?this:(de.editor&&de.editor.addTimelineCall&&(e=de.editor.addTimelineCall(t,e,this.id)),this.add({duration:0,delay:0,onComplete:()=>t(this)},e))}label(t,e){return Vt(t)||t&&!yn(t)?this:(de.editor&&de.editor.addTimelineLabel&&(e=de.editor.addTimelineLabel(t,e,this.id)),this.labels[t]=ys(this,e),this)}remove(t,e){return wc(Xo(t),this,e),this}stretch(t){let e=this.duration;if(e===Si(t))return this;let i=t/e,s=this.labels;ye(this,r=>r.stretch(r.duration*i));for(let r in s)s[r]*=i;return super.stretch(t)}refresh(){return ye(this,t=>{t.refresh&&t.refresh()}),this}revert(){return super.revert(),ye(this,t=>t.revert,!0),kr(this)}then(t){return super.then(t)}},Dc=n=>de.editor?de.editor.addTimeline(n):new jo(n).init();var Nc=(n=0,t=1,e=0)=>{let i=10**e;return Math.floor((Math.random()*(t-n+1/i)+n)*i)/i},Kp=0,ld=(n,t=0,e=1,i=0)=>{let s=n===void 0?Kp++:n;return(r=t,o=e,a=i)=>{s+=1831565813,s=Math.imul(s^s>>>15,s|1),s^=s+Math.imul(s^s>>>7,s|61);let l=10**a;return Math.floor((((s^s>>>14)>>>0)/4294967296*(o-r+1/l)+r)*l)/l}};var cd=(n,t=Nc)=>{let e=n.length,i,s;for(;e;)s=t(0,--e),i=n[e],n[e]=n[s],n[s]=i;return n};var wi=(n,t={})=>{let e=[],i=0,s,r=null,o=t.from,a=t.reversed,l=t.ease,c=!Vt(l),d=c&&!Vt(l.ease)?l.ease:c?xs(l):null,h=t.grid,f=h===!0,p=t.axis,_=t.total,m=Vt(o)||o===0||o==="first",g=o==="center",S=o==="last",A=o==="random",v=Hn(o),b=Hn(n),T=t.use,C=b?Fo(n[0]):Fo(n),y=b?Fo(n[1]):0,w=No.exec((b?n[1]:n)+Vn),P=t.start||0+(b?C:0),F=t.seed,V=!Vt(F)&&F!==!1?ld(F===!0?0:F):Nc,I=t.jitter,k=!Vt(I),W=Hn(I),J=W?I[0]:I||0,et=W?I[1]:I||0,U=m?0:xn(o)?o:0;return(q,j,yt,Tt,pe)=>{let[qt]=qo(q),Et=Vt(_)?yt.length:_,Y=Vt(T)?!1:hn(T)?T(qt,j,Et):Xi(qt,T),K=xn(Y)||yn(Y)&&xn(+Y)?+Y:j,it=K>=0&&K<Et?K:j;if(g&&(U=(Et-1)/2),S&&(U=Et-1),!e.length){if(f){let ut=!0,Yt=!1,Ot=1/0,Wt=1/0,kt=1/0,Dt=-1/0,te=-1/0,ue=-1/0,be=[],jt=[],le=[];for(let R=0;R<Et;R++){let ne=yt[R],Pt=0,E=0,x=0,O=!1;if(ne&&hn(ne.getBoundingClientRect)){let z=ne.getBoundingClientRect();Pt=z.left+z.width/2,E=z.top+z.height/2,O=!0}else{let z=ne;z&&xn(z.x)&&xn(z.y)&&(Pt=z.x,E=z.y,xn(z.z)&&(x=z.z,Yt=!0),O=!0)}if(!O){ut=!1;break}be.push(Pt),jt.push(E),le.push(x),Pt<Ot&&(Ot=Pt),E<Wt&&(Wt=E),x<kt&&(kt=x),Pt>Dt&&(Dt=Pt),E>te&&(te=E),x>ue&&(ue=x)}if(ut){let R=be[0],ne=jt[0],Pt=le[0];v?(R=Ot+o[0]*(Dt-Ot),ne=Wt+o[1]*(te-Wt),Pt=Yt?kt+(o.length>=3?o[2]:.5)*(ue-kt):0):g?(R=(Ot+Dt)/2,ne=(Wt+te)/2,Pt=(kt+ue)/2):S?(R=be[Et-1],ne=jt[Et-1],Pt=le[Et-1]):xn(o)&&(R=be[o],ne=jt[o],Pt=le[o]);for(let x=0;x<Et;x++){let O=R-be[x],z=ne-jt[x],Z=Pt-le[x],st=Ur(O*O+z*z+(Yt?Z*Z:0));p==="x"&&(st=-O),p==="y"&&(st=-z),p==="z"&&(st=-Z),e.push(st)}let E=1/0;for(let x=0;x<Et;x++){let O=Fr(e[x]);O>0&&O<E&&(E=O)}if(E>0&&E<1/0)for(let x=0;x<Et;x++)e[x]=e[x]/E}else for(let R=0;R<Et;R++)e.push(Fr(U-R))}else for(let ut=0;ut<Et;ut++)if(!h)e.push(Fr(U-ut));else{let Yt=h.length,Ot=h[0]*h[1],Wt,kt,Dt;v?(Wt=o[0]*(h[0]-1),kt=o[1]*(h[1]-1),Dt=Yt===3?(o.length>=3?o[2]:.5)*(h[2]-1):0):g?(Wt=(h[0]-1)/2,kt=(h[1]-1)/2,Dt=Yt===3?(h[2]-1)/2:0):(Wt=U%h[0],kt=ms(U/h[0])%h[1],Dt=Yt===3?ms(U/Ot):0);let te=ut%h[0],ue=ms(ut/h[0])%h[1],be=Yt===3?ms(ut/Ot):0,jt=Wt-te,le=kt-ue,R=Dt-be,ne=Ur(jt*jt+le*le+(Yt===3?R*R:0));p==="x"&&(ne=-jt),p==="y"&&(ne=-le),p==="z"&&(ne=-R),e.push(ne)}i=e[0];for(let ut=1;ut<Et;ut++)e[ut]>i&&(i=e[ut]);if(d||a)for(let ut=0;ut<Et;ut++){let Yt=e[ut];d&&(Yt=d(Yt/i)*i),a&&(Yt=p?-Yt:Fr(i-Yt)),e[ut]=Yt}if(k){r=new Array(Et);for(let ut=0;ut<Et;ut++)r[ut]=V(-1,1,4)}A&&(e=cd(e,V))}let Rt=b?(y-C)/i:C;Vt(s)&&(s=pe?ys(pe,Vt(t.start)?pe.iterationDuration:P):P);let ot=s+(Rt*xe(e[it],2)||0);if(k){let ut=i?e[it]/i:0,Yt=J+(et-J)*ut;ot=ot+r[it]*Yt}return t.modifier&&(ot=t.modifier(ot)),w&&(ot=`${ot}${w[2]}`),ot}};var rs={LEFT:0,MIDDLE:1,RIGHT:2,ROTATE:0,DOLLY:1,PAN:2},os={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},Bd=0,dh=1,kd=2;var mo=1,zd=2,yr=3,as=0,gn=1,Xn=2,xi=0,vr=1,fh=2,ph=3,mh=4,Vd=5;var Cs=100,Hd=101,Gd=102,Wd=103,Xd=104,qd=200,Yd=201,Zd=202,Jd=203,gh=204,_h=205,$d=206,Kd=207,jd=208,Qd=209,tf=210,ef=211,nf=212,sf=213,rf=214,wa=0,Aa=1,Ca=2,rr=3,Ra=4,Pa=5,Ia=6,La=7,xh=0,of=1,af=2,ti=0,yh=1,vh=2,Mh=3,go=4,Sh=5,bh=6,Th=7;var Eh=300,ls=301,Rs=302,al=303,ll=304,_o=306,Da=1e3,mi=1001,Na=1002,$e=1003,lf=1004;var xo=1005;var Qe=1006,cl=1007;var cs=1008;var En=1009,wh=1010,Ah=1011,Mr=1012,hl=1013,ei=1014,ni=1015,ii=1016,ul=1017,dl=1018,Sr=1020,Ch=35902,Rh=35899,Ph=1021,Ih=1022,qn=1023,gi=1026,hs=1027,Lh=1028,fl=1029,us=1030,pl=1031;var ml=1033,yo=33776,vo=33777,Mo=33778,So=33779,gl=35840,_l=35841,xl=35842,yl=35843,vl=36196,Ml=37492,Sl=37496,bl=37488,Tl=37489,bo=37490,El=37491,wl=37808,Al=37809,Cl=37810,Rl=37811,Pl=37812,Il=37813,Ll=37814,Dl=37815,Nl=37816,Ul=37817,Fl=37818,Ol=37819,Bl=37820,kl=37821,zl=36492,Vl=36494,Hl=36495,Gl=36283,Wl=36284,To=36285,Xl=36286;var Jr=2300,Ua=2301,Ta=2302,rh=2303,oh=2400,ah=2401,lh=2402;var cf=3200;var ql=0,hf=1,Bi="",dn="srgb",$r="srgb-linear",Kr="linear",Se="srgb";var Ea=7680;var uf=519,df=512,ff=513,pf=514,Yl=515,mf=516,gf=517,Zl=518,_f=519,xf=35044;var Dh="300 es",jn=2e3,or=2001;function jp(n){for(let t=n.length-1;t>=0;--t)if(n[t]>=65535)return!0;return!1}function Qp(n){return ArrayBuffer.isView(n)&&!(n instanceof DataView)}function jr(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function yf(){let n=jr("canvas");return n.style.display="block",n}var hd={},ar=null;function Nh(...n){let t="THREE."+n.shift();ar?ar("log",t,...n):console.log(t,...n)}function vf(n){let t=n[0];if(typeof t=="string"&&t.startsWith("TSL:")){let e=n[1];e&&e.isStackTrace?n[0]+=" "+e.getLocation():n[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return n}function Gt(...n){n=vf(n);let t="THREE."+n.shift();if(ar)ar("warn",t,...n);else{let e=n[0];e&&e.isStackTrace?console.warn(e.getError(t)):console.warn(t,...n)}}function Jt(...n){n=vf(n);let t="THREE."+n.shift();if(ar)ar("error",t,...n);else{let e=n[0];e&&e.isStackTrace?console.error(e.getError(t)):console.error(t,...n)}}function Ts(...n){let t=n.join(" ");t in hd||(hd[t]=!0,Gt(...n))}function Mf(n,t,e){return new Promise(function(i,s){function r(){switch(n.clientWaitSync(t,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:s();break;case n.TIMEOUT_EXPIRED:setTimeout(r,e);break;default:i()}}setTimeout(r,e)})}var Sf={[wa]:Aa,[Ca]:Ia,[Ra]:La,[rr]:Pa,[Aa]:wa,[Ia]:Ca,[La]:Ra,[Pa]:rr},Qn=class{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});let i=this._listeners;i[t]===void 0&&(i[t]=[]),i[t].indexOf(e)===-1&&i[t].push(e)}hasEventListener(t,e){let i=this._listeners;return i===void 0?!1:i[t]!==void 0&&i[t].indexOf(e)!==-1}removeEventListener(t,e){let i=this._listeners;if(i===void 0)return;let s=i[t];if(s!==void 0){let r=s.indexOf(e);r!==-1&&s.splice(r,1)}}dispatchEvent(t){let e=this._listeners;if(e===void 0)return;let i=e[t.type];if(i!==void 0){t.target=this;let s=i.slice(0);for(let r=0,o=s.length;r<o;r++)s[r].call(this,t);t.target=null}}},nn=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],ud=1234567,ir=Math.PI/180,lr=180/Math.PI;function br(){let n=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(nn[n&255]+nn[n>>8&255]+nn[n>>16&255]+nn[n>>24&255]+"-"+nn[t&255]+nn[t>>8&255]+"-"+nn[t>>16&15|64]+nn[t>>24&255]+"-"+nn[e&63|128]+nn[e>>8&255]+"-"+nn[e>>16&255]+nn[e>>24&255]+nn[i&255]+nn[i>>8&255]+nn[i>>16&255]+nn[i>>24&255]).toLowerCase()}function fe(n,t,e){return Math.max(t,Math.min(e,n))}function Uh(n,t){return(n%t+t)%t}function tm(n,t,e,i,s){return i+(n-t)*(s-i)/(e-t)}function em(n,t,e){return n!==t?(e-n)/(t-n):0}function Zr(n,t,e){return(1-e)*n+e*t}function nm(n,t,e,i){return Zr(n,t,1-Math.exp(-e*i))}function im(n,t=1){return t-Math.abs(Uh(n,t*2)-t)}function sm(n,t,e){return n<=t?0:n>=e?1:(n=(n-t)/(e-t),n*n*(3-2*n))}function rm(n,t,e){return n<=t?0:n>=e?1:(n=(n-t)/(e-t),n*n*n*(n*(n*6-15)+10))}function om(n,t){return n+Math.floor(Math.random()*(t-n+1))}function am(n,t){return n+Math.random()*(t-n)}function lm(n){return n*(.5-Math.random())}function cm(n){n!==void 0&&(ud=n);let t=ud+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function hm(n){return n*ir}function um(n){return n*lr}function dm(n){return n>0&&Number.isInteger(n)&&2**Math.round(Math.log2(n))===n}function fm(n){return Math.pow(2,Math.ceil(Math.log(n)/Math.LN2))}function pm(n){return Math.pow(2,Math.floor(Math.log(n)/Math.LN2))}function mm(n,t,e,i,s){let r=Math.cos,o=Math.sin,a=r(e/2),l=o(e/2),c=r((t+i)/2),u=o((t+i)/2),d=r((t-i)/2),h=o((t-i)/2),f=r((i-t)/2),p=o((i-t)/2);switch(s){case"XYX":n.set(a*u,l*d,l*h,a*c);break;case"YZY":n.set(l*h,a*u,l*d,a*c);break;case"ZXZ":n.set(l*d,l*h,a*u,a*c);break;case"XZX":n.set(a*u,l*p,l*f,a*c);break;case"YXY":n.set(l*f,a*u,l*p,a*c);break;case"ZYZ":n.set(l*p,l*f,a*u,a*c);break;default:Gt("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function nr(n,t){switch(t.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:case Uint8ClampedArray:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("THREE.MathUtils: Invalid component type.")}}function un(n,t){switch(t.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:case Uint8ClampedArray:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("THREE.MathUtils: Invalid component type.")}}var Fh={DEG2RAD:ir,RAD2DEG:lr,generateUUID:br,clamp:fe,euclideanModulo:Uh,mapLinear:tm,inverseLerp:em,lerp:Zr,damp:nm,pingpong:im,smoothstep:sm,smootherstep:rm,randInt:om,randFloat:am,randFloatSpread:lm,seededRandom:cm,degToRad:hm,radToDeg:um,isPowerOfTwo:dm,ceilPowerOfTwo:fm,floorPowerOfTwo:pm,setQuaternionFromProperEuler:mm,normalize:un,denormalize:nr},Vh=class Vh{constructor(t=0,e=0){this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("THREE.Vector2: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){let e=this.x,i=this.y,s=t.elements;return this.x=s[0]*e+s[3]*i+s[6],this.y=s[1]*e+s[4]*i+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=fe(this.x,t.x,e.x),this.y=fe(this.y,t.y,e.y),this}clampScalar(t,e){return this.x=fe(this.x,t,e),this.y=fe(this.y,t,e),this}clampLength(t,e){let i=this.length();return this.divideScalar(i||1).multiplyScalar(fe(i,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let i=this.dot(t)/e;return Math.acos(fe(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,i=this.y-t.y;return e*e+i*i}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){let i=Math.cos(e),s=Math.sin(e),r=this.x-t.x,o=this.y-t.y;return this.x=r*i-o*s+t.x,this.y=r*s+o*i+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}};Vh.prototype.isVector2=!0;var Zt=Vh,Nn=class{constructor(t=0,e=0,i=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=i,this._w=s}static slerpFlat(t,e,i,s,r,o,a){let l=i[s+0],c=i[s+1],u=i[s+2],d=i[s+3],h=r[o+0],f=r[o+1],p=r[o+2],_=r[o+3];if(d!==_||l!==h||c!==f||u!==p){let m=l*h+c*f+u*p+d*_;m<0&&(h=-h,f=-f,p=-p,_=-_,m=-m);let g=1-a;if(m<.9995){let S=Math.acos(m),A=Math.sin(S);g=Math.sin(g*S)/A,a=Math.sin(a*S)/A,l=l*g+h*a,c=c*g+f*a,u=u*g+p*a,d=d*g+_*a}else{l=l*g+h*a,c=c*g+f*a,u=u*g+p*a,d=d*g+_*a;let S=1/Math.sqrt(l*l+c*c+u*u+d*d);l*=S,c*=S,u*=S,d*=S}}t[e]=l,t[e+1]=c,t[e+2]=u,t[e+3]=d}static multiplyQuaternionsFlat(t,e,i,s,r,o){let a=i[s],l=i[s+1],c=i[s+2],u=i[s+3],d=r[o],h=r[o+1],f=r[o+2],p=r[o+3];return t[e]=a*p+u*d+l*f-c*h,t[e+1]=l*p+u*h+c*d-a*f,t[e+2]=c*p+u*f+a*h-l*d,t[e+3]=u*p-a*d-l*h-c*f,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,i,s){return this._x=t,this._y=e,this._z=i,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){let i=t._x,s=t._y,r=t._z,o=t._order,a=Math.cos,l=Math.sin,c=a(i/2),u=a(s/2),d=a(r/2),h=l(i/2),f=l(s/2),p=l(r/2);switch(o){case"XYZ":this._x=h*u*d+c*f*p,this._y=c*f*d-h*u*p,this._z=c*u*p+h*f*d,this._w=c*u*d-h*f*p;break;case"YXZ":this._x=h*u*d+c*f*p,this._y=c*f*d-h*u*p,this._z=c*u*p-h*f*d,this._w=c*u*d+h*f*p;break;case"ZXY":this._x=h*u*d-c*f*p,this._y=c*f*d+h*u*p,this._z=c*u*p+h*f*d,this._w=c*u*d-h*f*p;break;case"ZYX":this._x=h*u*d-c*f*p,this._y=c*f*d+h*u*p,this._z=c*u*p-h*f*d,this._w=c*u*d+h*f*p;break;case"YZX":this._x=h*u*d+c*f*p,this._y=c*f*d+h*u*p,this._z=c*u*p-h*f*d,this._w=c*u*d-h*f*p;break;case"XZY":this._x=h*u*d-c*f*p,this._y=c*f*d-h*u*p,this._z=c*u*p+h*f*d,this._w=c*u*d+h*f*p;break;default:Gt("Quaternion: .setFromEuler() encountered an unknown order: "+o)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){let i=e/2,s=Math.sin(i);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(t){let e=t.elements,i=e[0],s=e[4],r=e[8],o=e[1],a=e[5],l=e[9],c=e[2],u=e[6],d=e[10],h=i+a+d;if(h>0){let f=.5/Math.sqrt(h+1);this._w=.25/f,this._x=(u-l)*f,this._y=(r-c)*f,this._z=(o-s)*f}else if(i>a&&i>d){let f=2*Math.sqrt(1+i-a-d);this._w=(u-l)/f,this._x=.25*f,this._y=(s+o)/f,this._z=(r+c)/f}else if(a>d){let f=2*Math.sqrt(1+a-i-d);this._w=(r-c)/f,this._x=(s+o)/f,this._y=.25*f,this._z=(l+u)/f}else{let f=2*Math.sqrt(1+d-i-a);this._w=(o-s)/f,this._x=(r+c)/f,this._y=(l+u)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let i=t.dot(e)+1;return i<1e-8?(i=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=i):(this._x=0,this._y=-t.z,this._z=t.y,this._w=i)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=i),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(fe(this.dot(t),-1,1)))}rotateTowards(t,e){let i=this.angleTo(t);if(i===0)return this;let s=Math.min(1,e/i);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){let i=t._x,s=t._y,r=t._z,o=t._w,a=e._x,l=e._y,c=e._z,u=e._w;return this._x=i*u+o*a+s*c-r*l,this._y=s*u+o*l+r*a-i*c,this._z=r*u+o*c+i*l-s*a,this._w=o*u-i*a-s*l-r*c,this._onChangeCallback(),this}slerp(t,e){let i=t._x,s=t._y,r=t._z,o=t._w,a=this.dot(t);a<0&&(i=-i,s=-s,r=-r,o=-o,a=-a);let l=1-e;if(a<.9995){let c=Math.acos(a),u=Math.sin(c);l=Math.sin(l*c)/u,e=Math.sin(e*c)/u,this._x=this._x*l+i*e,this._y=this._y*l+s*e,this._z=this._z*l+r*e,this._w=this._w*l+o*e,this._onChangeCallback()}else this._x=this._x*l+i*e,this._y=this._y*l+s*e,this._z=this._z*l+r*e,this._w=this._w*l+o*e,this.normalize();return this}slerpQuaternions(t,e,i){return this.copy(t).slerp(e,i)}random(){let t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),i=Math.random(),s=Math.sqrt(1-i),r=Math.sqrt(i);return this.set(s*Math.sin(t),s*Math.cos(t),r*Math.sin(e),r*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},Hh=class Hh{constructor(t=0,e=0,i=0){this.x=t,this.y=e,this.z=i}set(t,e,i){return i===void 0&&(i=this.z),this.x=t,this.y=e,this.z=i,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("THREE.Vector3: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(dd.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(dd.setFromAxisAngle(t,e))}applyMatrix3(t){let e=this.x,i=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[3]*i+r[6]*s,this.y=r[1]*e+r[4]*i+r[7]*s,this.z=r[2]*e+r[5]*i+r[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){let e=this.x,i=this.y,s=this.z,r=t.elements,o=1/(r[3]*e+r[7]*i+r[11]*s+r[15]);return this.x=(r[0]*e+r[4]*i+r[8]*s+r[12])*o,this.y=(r[1]*e+r[5]*i+r[9]*s+r[13])*o,this.z=(r[2]*e+r[6]*i+r[10]*s+r[14])*o,this}applyQuaternion(t){let e=this.x,i=this.y,s=this.z,r=t.x,o=t.y,a=t.z,l=t.w,c=2*(o*s-a*i),u=2*(a*e-r*s),d=2*(r*i-o*e);return this.x=e+l*c+o*d-a*u,this.y=i+l*u+a*c-r*d,this.z=s+l*d+r*u-o*c,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){let e=this.x,i=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[4]*i+r[8]*s,this.y=r[1]*e+r[5]*i+r[9]*s,this.z=r[2]*e+r[6]*i+r[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=fe(this.x,t.x,e.x),this.y=fe(this.y,t.y,e.y),this.z=fe(this.z,t.z,e.z),this}clampScalar(t,e){return this.x=fe(this.x,t,e),this.y=fe(this.y,t,e),this.z=fe(this.z,t,e),this}clampLength(t,e){let i=this.length();return this.divideScalar(i||1).multiplyScalar(fe(i,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){let i=t.x,s=t.y,r=t.z,o=e.x,a=e.y,l=e.z;return this.x=s*l-r*a,this.y=r*o-i*l,this.z=i*a-s*o,this}projectOnVector(t){let e=t.lengthSq();if(e===0)return this.set(0,0,0);let i=t.dot(this)/e;return this.copy(t).multiplyScalar(i)}projectOnPlane(t){return Uc.copy(this).projectOnVector(t),this.sub(Uc)}reflect(t){return this.sub(Uc.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let i=this.dot(t)/e;return Math.acos(fe(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,i=this.y-t.y,s=this.z-t.z;return e*e+i*i+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,i){let s=Math.sin(e)*t;return this.x=s*Math.sin(i),this.y=Math.cos(e)*t,this.z=s*Math.cos(i),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,i){return this.x=t*Math.sin(e),this.y=i,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){let e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){let e=this.setFromMatrixColumn(t,0).length(),i=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=i,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let t=Math.random()*Math.PI*2,e=Math.random()*2-1,i=Math.sqrt(1-e*e);return this.x=i*Math.cos(t),this.y=e,this.z=i*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}};Hh.prototype.isVector3=!0;var L=Hh,Uc=new L,dd=new Nn,Gh=class Gh{constructor(t,e,i,s,r,o,a,l,c){this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,i,s,r,o,a,l,c)}set(t,e,i,s,r,o,a,l,c){let u=this.elements;return u[0]=t,u[1]=s,u[2]=a,u[3]=e,u[4]=r,u[5]=l,u[6]=i,u[7]=o,u[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){let e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],this}extractBasis(t,e,i){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(t){let e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let i=t.elements,s=e.elements,r=this.elements,o=i[0],a=i[3],l=i[6],c=i[1],u=i[4],d=i[7],h=i[2],f=i[5],p=i[8],_=s[0],m=s[3],g=s[6],S=s[1],A=s[4],v=s[7],b=s[2],T=s[5],C=s[8];return r[0]=o*_+a*S+l*b,r[3]=o*m+a*A+l*T,r[6]=o*g+a*v+l*C,r[1]=c*_+u*S+d*b,r[4]=c*m+u*A+d*T,r[7]=c*g+u*v+d*C,r[2]=h*_+f*S+p*b,r[5]=h*m+f*A+p*T,r[8]=h*g+f*v+p*C,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){let t=this.elements,e=t[0],i=t[1],s=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],u=t[8];return e*o*u-e*a*c-i*r*u+i*a*l+s*r*c-s*o*l}invert(){let t=this.elements,e=t[0],i=t[1],s=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],u=t[8],d=u*o-a*c,h=a*l-u*r,f=c*r-o*l,p=e*d+i*h+s*f;if(p===0)return this.set(0,0,0,0,0,0,0,0,0);let _=1/p;return t[0]=d*_,t[1]=(s*c-u*i)*_,t[2]=(a*i-s*o)*_,t[3]=h*_,t[4]=(u*e-s*l)*_,t[5]=(s*r-a*e)*_,t[6]=f*_,t[7]=(i*l-c*e)*_,t[8]=(o*e-i*r)*_,this}transpose(){let t,e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){let e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,i,s,r,o,a){let l=Math.cos(r),c=Math.sin(r);return this.set(i*l,i*c,-i*(l*o+c*a)+o+t,-s*c,s*l,-s*(-c*o+l*a)+a+e,0,0,1),this}scale(t,e){return Ts("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(Fc.makeScale(t,e)),this}rotate(t){return Ts("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(Fc.makeRotation(-t)),this}translate(t,e){return Ts("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(Fc.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){let e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,i,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){let e=this.elements,i=t.elements;for(let s=0;s<9;s++)if(e[s]!==i[s])return!1;return!0}fromArray(t,e=0){for(let i=0;i<9;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){let i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t}clone(){return new this.constructor().fromArray(this.elements)}};Gh.prototype.isMatrix3=!0;var Qt=Gh,Fc=new Qt,fd=new Qt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),pd=new Qt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function gm(){let n={enabled:!0,workingColorSpace:$r,spaces:{},convert:function(s,r,o){return this.enabled===!1||r===o||!r||!o||(this.spaces[r].transfer===Se&&(s.r=Ni(s.r),s.g=Ni(s.g),s.b=Ni(s.b)),this.spaces[r].primaries!==this.spaces[o].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[o].fromXYZ)),this.spaces[o].transfer===Se&&(s.r=sr(s.r),s.g=sr(s.g),s.b=sr(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===Bi?Kr:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,o){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[o].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return Ts("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),n.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return Ts("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),n.colorSpaceToWorking(s,r)}},t=[.64,.33,.3,.6,.15,.06],e=[.2126,.7152,.0722],i=[.3127,.329];return n.define({[$r]:{primaries:t,whitePoint:i,transfer:Kr,toXYZ:fd,fromXYZ:pd,luminanceCoefficients:e,workingColorSpaceConfig:{unpackColorSpace:dn},outputColorSpaceConfig:{drawingBufferColorSpace:dn}},[dn]:{primaries:t,whitePoint:i,transfer:Se,toXYZ:fd,fromXYZ:pd,luminanceCoefficients:e,outputColorSpaceConfig:{drawingBufferColorSpace:dn}}}),n}var ge=gm();function Ni(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function sr(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}var Gs,Fa=class{static getDataURL(t,e="image/png"){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let i;if(t instanceof HTMLCanvasElement)i=t;else{Gs===void 0&&(Gs=jr("canvas")),Gs.width=t.width,Gs.height=t.height;let s=Gs.getContext("2d");t instanceof ImageData?s.putImageData(t,0,0):s.drawImage(t,0,0,t.width,t.height),i=Gs}return i.toDataURL(e)}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){let e=jr("canvas");e.width=t.width,e.height=t.height;let i=e.getContext("2d");i.drawImage(t,0,0,t.width,t.height);let s=i.getImageData(0,0,t.width,t.height),r=s.data;for(let o=0;o<r.length;o++)r[o]=Ni(r[o]/255)*255;return i.putImageData(s,0,0),e}else if(t.data){let e=t.data.slice(0);for(let i=0;i<e.length;i++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[i]=Math.floor(Ni(e[i]/255)*255):e[i]=Ni(e[i]);return{data:e,width:t.width,height:t.height}}else return Gt("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}},_m=0,cr=class{constructor(t=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:_m++}),this.uuid=br(),this.data=t,this.dataReady=!0,this.version=0}getSize(t){let e=this.data;return typeof HTMLVideoElement<"u"&&e instanceof HTMLVideoElement?t.set(e.videoWidth,e.videoHeight,0):typeof VideoFrame<"u"&&e instanceof VideoFrame?t.set(e.displayWidth,e.displayHeight,0):e!==null?t.set(e.width,e.height,e.depth||0):t.set(0,0,0),t}set needsUpdate(t){t===!0&&this.version++}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];let i={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let o=0,a=s.length;o<a;o++)s[o].isDataTexture?r.push(Oc(s[o].image)):r.push(Oc(s[o]))}else r=Oc(s);i.url=r}return e||(t.images[this.uuid]=i),i}};function Oc(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?Fa.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(Gt("Texture: Unable to serialize Texture."),{})}var xm=0,Bc=new L,Sn=class n extends Qn{constructor(t=n.DEFAULT_IMAGE,e=n.DEFAULT_MAPPING,i=mi,s=mi,r=Qe,o=cs,a=qn,l=En,c=n.DEFAULT_ANISOTROPY,u=Bi){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:xm++}),this.uuid=br(),this.name="",this.source=new cr(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=i,this.wrapT=s,this.magFilter=r,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new Zt(0,0),this.repeat=new Zt(1,1),this.center=new Zt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Qt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(Bc).x}get height(){return this.source.getSize(Bc).y}get depth(){return this.source.getSize(Bc).z}get image(){return this.source.data}set image(t){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.normalized=t.normalized,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.renderTarget=t.renderTarget,this.isRenderTargetTexture=t.isRenderTargetTexture,this.isArrayTexture=t.isArrayTexture,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}setValues(t){for(let e in t){let i=t[e];if(i===void 0){Gt(`Texture.setValues(): parameter '${e}' has value of undefined.`);continue}let s=this[e];if(s===void 0){Gt(`Texture.setValues(): property '${e}' does not exist.`);continue}s&&i&&s.isVector2&&i.isVector2||s&&i&&s.isVector3&&i.isVector3||s&&i&&s.isMatrix3&&i.isMatrix3?s.copy(i):this[e]=i}}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];let i={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),e||(t.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==Eh)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case Da:t.x=t.x-Math.floor(t.x);break;case mi:t.x=t.x<0?0:1;break;case Na:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case Da:t.y=t.y-Math.floor(t.y);break;case mi:t.y=t.y<0?0:1;break;case Na:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}};Sn.DEFAULT_IMAGE=null;Sn.DEFAULT_MAPPING=Eh;Sn.DEFAULT_ANISOTROPY=1;var Wh=class Wh{constructor(t=0,e=0,i=0,s=1){this.x=t,this.y=e,this.z=i,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,i,s){return this.x=t,this.y=e,this.z=i,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("THREE.Vector4: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){let e=this.x,i=this.y,s=this.z,r=this.w,o=t.elements;return this.x=o[0]*e+o[4]*i+o[8]*s+o[12]*r,this.y=o[1]*e+o[5]*i+o[9]*s+o[13]*r,this.z=o[2]*e+o[6]*i+o[10]*s+o[14]*r,this.w=o[3]*e+o[7]*i+o[11]*s+o[15]*r,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);let e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,i,s,r,l=t.elements,c=l[0],u=l[4],d=l[8],h=l[1],f=l[5],p=l[9],_=l[2],m=l[6],g=l[10];if(Math.abs(u-h)<.01&&Math.abs(d-_)<.01&&Math.abs(p-m)<.01){if(Math.abs(u+h)<.1&&Math.abs(d+_)<.1&&Math.abs(p+m)<.1&&Math.abs(c+f+g-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;let A=(c+1)/2,v=(f+1)/2,b=(g+1)/2,T=(u+h)/4,C=(d+_)/4,y=(p+m)/4;return A>v&&A>b?A<.01?(i=0,s=.707106781,r=.707106781):(i=Math.sqrt(A),s=T/i,r=C/i):v>b?v<.01?(i=.707106781,s=0,r=.707106781):(s=Math.sqrt(v),i=T/s,r=y/s):b<.01?(i=.707106781,s=.707106781,r=0):(r=Math.sqrt(b),i=C/r,s=y/r),this.set(i,s,r,e),this}let S=Math.sqrt((m-p)*(m-p)+(d-_)*(d-_)+(h-u)*(h-u));return Math.abs(S)<.001&&(S=1),this.x=(m-p)/S,this.y=(d-_)/S,this.z=(h-u)/S,this.w=Math.acos((c+f+g-1)/2),this}setFromMatrixPosition(t){let e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=fe(this.x,t.x,e.x),this.y=fe(this.y,t.y,e.y),this.z=fe(this.z,t.z,e.z),this.w=fe(this.w,t.w,e.w),this}clampScalar(t,e){return this.x=fe(this.x,t,e),this.y=fe(this.y,t,e),this.z=fe(this.z,t,e),this.w=fe(this.w,t,e),this}clampLength(t,e){let i=this.length();return this.divideScalar(i||1).multiplyScalar(fe(i,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this.w=t.w+(e.w-t.w)*i,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}};Wh.prototype.isVector4=!0;var Ne=Wh,Oa=class extends Qn{constructor(t=1,e=1,i={}){super(),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Qe,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},i),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=i.depth,this.scissor=new Ne(0,0,t,e),this.scissorTest=!1,this.viewport=new Ne(0,0,t,e),this.textures=[];let s={width:t,height:e,depth:i.depth},r=new Sn(s),o=i.count;for(let a=0;a<o;a++)this.textures[a]=r.clone(),this.textures[a].isRenderTargetTexture=!0,this.textures[a].renderTarget=this;this._setTextureOptions(i),this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveColorBuffer=i.resolveColorBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this.storeMultisampledColorBuffer=i.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=i.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=i.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=i.depthTexture,this.samples=i.samples,this.multiview=i.multiview,this.useArrayDepthTexture=i.useArrayDepthTexture}_setTextureOptions(t={}){let e={minFilter:Qe,generateMipmaps:!1,flipY:!1,internalFormat:null};t.mapping!==void 0&&(e.mapping=t.mapping),t.wrapS!==void 0&&(e.wrapS=t.wrapS),t.wrapT!==void 0&&(e.wrapT=t.wrapT),t.wrapR!==void 0&&(e.wrapR=t.wrapR),t.magFilter!==void 0&&(e.magFilter=t.magFilter),t.minFilter!==void 0&&(e.minFilter=t.minFilter),t.format!==void 0&&(e.format=t.format),t.type!==void 0&&(e.type=t.type),t.anisotropy!==void 0&&(e.anisotropy=t.anisotropy),t.colorSpace!==void 0&&(e.colorSpace=t.colorSpace),t.flipY!==void 0&&(e.flipY=t.flipY),t.generateMipmaps!==void 0&&(e.generateMipmaps=t.generateMipmaps),t.internalFormat!==void 0&&(e.internalFormat=t.internalFormat);for(let i=0;i<this.textures.length;i++)this.textures[i].setValues(e)}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}set depthTexture(t){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),t!==null&&t.renderTarget===null&&(t.renderTarget=this),this._depthTexture=t}get depthTexture(){return this._depthTexture}setSize(t,e,i=1){if(this.width!==t||this.height!==e||this.depth!==i){this.width=t,this.height=e,this.depth=i;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=t,this.textures[s].image.height=e,this.textures[s].image.depth=i,this.textures[s].isData3DTexture!==!0&&(this.textures[s].isArrayTexture=this.textures[s].image.depth>1);this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let e=0,i=t.textures.length;e<i;e++){this.textures[e]=t.textures[e].clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;let s=Object.assign({},t.textures[e].image);this.textures[e].source=new cr(s)}if(this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveColorBuffer=t.resolveColorBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,this.storeMultisampledColorBuffer=t.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=t.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=t.storeMultisampledStencilBuffer,t.depthTexture!==null)if(t.depthTexture.renderTarget===t){let e=t.depthTexture.clone();e.renderTarget=null,this.depthTexture=e}else this.depthTexture=t.depthTexture;return this.samples=t.samples,this.multiview=t.multiview,this.useArrayDepthTexture=t.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}},bn=class extends Oa{constructor(t=1,e=1,i={}){super(t,e,i),this.isWebGLRenderTarget=!0}},Qr=class extends Sn{constructor(t=null,e=1,i=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:i,depth:s},this.magFilter=$e,this.minFilter=$e,this.wrapR=mi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(t){return super.copy(t),this.wrapR=t.wrapR,this}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}};var Ba=class extends Sn{constructor(t=null,e=1,i=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:i,depth:s},this.magFilter=$e,this.minFilter=$e,this.wrapR=mi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(t){return super.copy(t),this.wrapR=t.wrapR,this}};var ol=class ol{constructor(t,e,i,s,r,o,a,l,c,u,d,h,f,p,_,m){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,i,s,r,o,a,l,c,u,d,h,f,p,_,m)}set(t,e,i,s,r,o,a,l,c,u,d,h,f,p,_,m){let g=this.elements;return g[0]=t,g[4]=e,g[8]=i,g[12]=s,g[1]=r,g[5]=o,g[9]=a,g[13]=l,g[2]=c,g[6]=u,g[10]=d,g[14]=h,g[3]=f,g[7]=p,g[11]=_,g[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new ol().fromArray(this.elements)}copy(t){let e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],e[9]=i[9],e[10]=i[10],e[11]=i[11],e[12]=i[12],e[13]=i[13],e[14]=i[14],e[15]=i[15],this}copyPosition(t){let e=this.elements,i=t.elements;return e[12]=i[12],e[13]=i[13],e[14]=i[14],this}setFromMatrix3(t){let e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,i){return this.determinantAffine()===0?(t.set(1,0,0),e.set(0,1,0),i.set(0,0,1),this):(t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this)}makeBasis(t,e,i){return this.set(t.x,e.x,i.x,0,t.y,e.y,i.y,0,t.z,e.z,i.z,0,0,0,0,1),this}extractRotation(t){if(t.determinantAffine()===0)return this.identity();let e=this.elements,i=t.elements,s=1/Ws.setFromMatrixColumn(t,0).length(),r=1/Ws.setFromMatrixColumn(t,1).length(),o=1/Ws.setFromMatrixColumn(t,2).length();return e[0]=i[0]*s,e[1]=i[1]*s,e[2]=i[2]*s,e[3]=0,e[4]=i[4]*r,e[5]=i[5]*r,e[6]=i[6]*r,e[7]=0,e[8]=i[8]*o,e[9]=i[9]*o,e[10]=i[10]*o,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){let e=this.elements,i=t.x,s=t.y,r=t.z,o=Math.cos(i),a=Math.sin(i),l=Math.cos(s),c=Math.sin(s),u=Math.cos(r),d=Math.sin(r);if(t.order==="XYZ"){let h=o*u,f=o*d,p=a*u,_=a*d;e[0]=l*u,e[4]=-l*d,e[8]=c,e[1]=f+p*c,e[5]=h-_*c,e[9]=-a*l,e[2]=_-h*c,e[6]=p+f*c,e[10]=o*l}else if(t.order==="YXZ"){let h=l*u,f=l*d,p=c*u,_=c*d;e[0]=h+_*a,e[4]=p*a-f,e[8]=o*c,e[1]=o*d,e[5]=o*u,e[9]=-a,e[2]=f*a-p,e[6]=_+h*a,e[10]=o*l}else if(t.order==="ZXY"){let h=l*u,f=l*d,p=c*u,_=c*d;e[0]=h-_*a,e[4]=-o*d,e[8]=p+f*a,e[1]=f+p*a,e[5]=o*u,e[9]=_-h*a,e[2]=-o*c,e[6]=a,e[10]=o*l}else if(t.order==="ZYX"){let h=o*u,f=o*d,p=a*u,_=a*d;e[0]=l*u,e[4]=p*c-f,e[8]=h*c+_,e[1]=l*d,e[5]=_*c+h,e[9]=f*c-p,e[2]=-c,e[6]=a*l,e[10]=o*l}else if(t.order==="YZX"){let h=o*l,f=o*c,p=a*l,_=a*c;e[0]=l*u,e[4]=_-h*d,e[8]=p*d+f,e[1]=d,e[5]=o*u,e[9]=-a*u,e[2]=-c*u,e[6]=f*d+p,e[10]=h-_*d}else if(t.order==="XZY"){let h=o*l,f=o*c,p=a*l,_=a*c;e[0]=l*u,e[4]=-d,e[8]=c*u,e[1]=h*d+_,e[5]=o*u,e[9]=f*d-p,e[2]=p*d-f,e[6]=a*u,e[10]=_*d+h}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(ym,t,vm)}lookAt(t,e,i){let s=this.elements;return In.subVectors(t,e),In.lengthSq()===0&&(In.z=1),In.normalize(),Yi.crossVectors(i,In),Yi.lengthSq()===0&&(Math.abs(i.z)===1?In.x+=1e-4:In.z+=1e-4,In.normalize(),Yi.crossVectors(i,In)),Yi.normalize(),Qo.crossVectors(In,Yi),s[0]=Yi.x,s[4]=Qo.x,s[8]=In.x,s[1]=Yi.y,s[5]=Qo.y,s[9]=In.y,s[2]=Yi.z,s[6]=Qo.z,s[10]=In.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let i=t.elements,s=e.elements,r=this.elements,o=i[0],a=i[4],l=i[8],c=i[12],u=i[1],d=i[5],h=i[9],f=i[13],p=i[2],_=i[6],m=i[10],g=i[14],S=i[3],A=i[7],v=i[11],b=i[15],T=s[0],C=s[4],y=s[8],w=s[12],P=s[1],F=s[5],B=s[9],V=s[13],I=s[2],k=s[6],W=s[10],J=s[14],et=s[3],U=s[7],q=s[11],j=s[15];return r[0]=o*T+a*P+l*I+c*et,r[4]=o*C+a*F+l*k+c*U,r[8]=o*y+a*B+l*W+c*q,r[12]=o*w+a*V+l*J+c*j,r[1]=u*T+d*P+h*I+f*et,r[5]=u*C+d*F+h*k+f*U,r[9]=u*y+d*B+h*W+f*q,r[13]=u*w+d*V+h*J+f*j,r[2]=p*T+_*P+m*I+g*et,r[6]=p*C+_*F+m*k+g*U,r[10]=p*y+_*B+m*W+g*q,r[14]=p*w+_*V+m*J+g*j,r[3]=S*T+A*P+v*I+b*et,r[7]=S*C+A*F+v*k+b*U,r[11]=S*y+A*B+v*W+b*q,r[15]=S*w+A*V+v*J+b*j,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){let t=this.elements,e=t[0],i=t[4],s=t[8],r=t[12],o=t[1],a=t[5],l=t[9],c=t[13],u=t[2],d=t[6],h=t[10],f=t[14],p=t[3],_=t[7],m=t[11],g=t[15],S=l*f-c*h,A=a*f-c*d,v=a*h-l*d,b=o*f-c*u,T=o*h-l*u,C=o*d-a*u;return e*(_*S-m*A+g*v)-i*(p*S-m*b+g*T)+s*(p*A-_*b+g*C)-r*(p*v-_*T+m*C)}determinantAffine(){let t=this.elements,e=t[0],i=t[4],s=t[8],r=t[1],o=t[5],a=t[9],l=t[2],c=t[6],u=t[10];return e*(o*u-a*c)-i*(r*u-a*l)+s*(r*c-o*l)}transpose(){let t=this.elements,e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,i){let s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=i),this}invert(){let t=this.elements,e=t[0],i=t[1],s=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],u=t[8],d=t[9],h=t[10],f=t[11],p=t[12],_=t[13],m=t[14],g=t[15],S=e*a-i*o,A=e*l-s*o,v=e*c-r*o,b=i*l-s*a,T=i*c-r*a,C=s*c-r*l,y=u*_-d*p,w=u*m-h*p,P=u*g-f*p,F=d*m-h*_,B=d*g-f*_,V=h*g-f*m,I=S*V-A*B+v*F+b*P-T*w+C*y;if(I===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let k=1/I;return t[0]=(a*V-l*B+c*F)*k,t[1]=(s*B-i*V-r*F)*k,t[2]=(_*C-m*T+g*b)*k,t[3]=(h*T-d*C-f*b)*k,t[4]=(l*P-o*V-c*w)*k,t[5]=(e*V-s*P+r*w)*k,t[6]=(m*v-p*C-g*A)*k,t[7]=(u*C-h*v+f*A)*k,t[8]=(o*B-a*P+c*y)*k,t[9]=(i*P-e*B-r*y)*k,t[10]=(p*T-_*v+g*S)*k,t[11]=(d*v-u*T-f*S)*k,t[12]=(a*w-o*F-l*y)*k,t[13]=(e*F-i*w+s*y)*k,t[14]=(_*A-p*b-m*S)*k,t[15]=(u*b-d*A+h*S)*k,this}scale(t){let e=this.elements,i=t.x,s=t.y,r=t.z;return e[0]*=i,e[4]*=s,e[8]*=r,e[1]*=i,e[5]*=s,e[9]*=r,e[2]*=i,e[6]*=s,e[10]*=r,e[3]*=i,e[7]*=s,e[11]*=r,this}getMaxScaleOnAxis(){let t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],i=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,i,s))}makeTranslation(t,e,i){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,i,0,0,0,1),this}makeRotationX(t){let e=Math.cos(t),i=Math.sin(t);return this.set(1,0,0,0,0,e,-i,0,0,i,e,0,0,0,0,1),this}makeRotationY(t){let e=Math.cos(t),i=Math.sin(t);return this.set(e,0,i,0,0,1,0,0,-i,0,e,0,0,0,0,1),this}makeRotationZ(t){let e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,0,i,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){let i=Math.cos(e),s=Math.sin(e),r=1-i,o=t.x,a=t.y,l=t.z,c=r*o,u=r*a;return this.set(c*o+i,c*a-s*l,c*l+s*a,0,c*a+s*l,u*a+i,u*l-s*o,0,c*l-s*a,u*l+s*o,r*l*l+i,0,0,0,0,1),this}makeScale(t,e,i){return this.set(t,0,0,0,0,e,0,0,0,0,i,0,0,0,0,1),this}makeShear(t,e,i,s,r,o){return this.set(1,i,r,0,t,1,o,0,e,s,1,0,0,0,0,1),this}compose(t,e,i){let s=this.elements,r=e._x,o=e._y,a=e._z,l=e._w,c=r+r,u=o+o,d=a+a,h=r*c,f=r*u,p=r*d,_=o*u,m=o*d,g=a*d,S=l*c,A=l*u,v=l*d,b=i.x,T=i.y,C=i.z;return s[0]=(1-(_+g))*b,s[1]=(f+v)*b,s[2]=(p-A)*b,s[3]=0,s[4]=(f-v)*T,s[5]=(1-(h+g))*T,s[6]=(m+S)*T,s[7]=0,s[8]=(p+A)*C,s[9]=(m-S)*C,s[10]=(1-(h+_))*C,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,i){let s=this.elements;t.x=s[12],t.y=s[13],t.z=s[14];let r=this.determinantAffine();if(r===0)return i.set(1,1,1),e.identity(),this;let o=Ws.set(s[0],s[1],s[2]).length(),a=Ws.set(s[4],s[5],s[6]).length(),l=Ws.set(s[8],s[9],s[10]).length();r<0&&(o=-o),Jn.copy(this);let c=1/o,u=1/a,d=1/l;return Jn.elements[0]*=c,Jn.elements[1]*=c,Jn.elements[2]*=c,Jn.elements[4]*=u,Jn.elements[5]*=u,Jn.elements[6]*=u,Jn.elements[8]*=d,Jn.elements[9]*=d,Jn.elements[10]*=d,e.setFromRotationMatrix(Jn),i.x=o,i.y=a,i.z=l,this}makePerspective(t,e,i,s,r,o,a=jn,l=!1){let c=this.elements,u=2*r/(e-t),d=2*r/(i-s),h=(e+t)/(e-t),f=(i+s)/(i-s),p,_;if(l)p=r/(o-r),_=o*r/(o-r);else if(a===jn)p=-(o+r)/(o-r),_=-2*o*r/(o-r);else if(a===or)p=-o/(o-r),_=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return c[0]=u,c[4]=0,c[8]=h,c[12]=0,c[1]=0,c[5]=d,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=p,c[14]=_,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,e,i,s,r,o,a=jn,l=!1){let c=this.elements,u=2/(e-t),d=2/(i-s),h=-(e+t)/(e-t),f=-(i+s)/(i-s),p,_;if(l)p=1/(o-r),_=o/(o-r);else if(a===jn)p=-2/(o-r),_=-(o+r)/(o-r);else if(a===or)p=-1/(o-r),_=-r/(o-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return c[0]=u,c[4]=0,c[8]=0,c[12]=h,c[1]=0,c[5]=d,c[9]=0,c[13]=f,c[2]=0,c[6]=0,c[10]=p,c[14]=_,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){let e=this.elements,i=t.elements;for(let s=0;s<16;s++)if(e[s]!==i[s])return!1;return!0}fromArray(t,e=0){for(let i=0;i<16;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){let i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t[e+9]=i[9],t[e+10]=i[10],t[e+11]=i[11],t[e+12]=i[12],t[e+13]=i[13],t[e+14]=i[14],t[e+15]=i[15],t}};ol.prototype.isMatrix4=!0;var De=ol,Ws=new L,Jn=new De,ym=new L(0,0,0),vm=new L(1,1,1),Yi=new L,Qo=new L,In=new L,md=new De,gd=new Nn,Ui=class n{constructor(t=0,e=0,i=0,s=n.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=i,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,i,s=this._order){return this._x=t,this._y=e,this._z=i,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,i=!0){let s=t.elements,r=s[0],o=s[4],a=s[8],l=s[1],c=s[5],u=s[9],d=s[2],h=s[6],f=s[10];switch(e){case"XYZ":this._y=Math.asin(fe(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-u,f),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(h,c),this._z=0);break;case"YXZ":this._x=Math.asin(-fe(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(a,f),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-d,r),this._z=0);break;case"ZXY":this._x=Math.asin(fe(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(-d,f),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-fe(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(h,f),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(fe(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-u,c),this._y=Math.atan2(-d,r)):(this._x=0,this._y=Math.atan2(a,f));break;case"XZY":this._z=Math.asin(-fe(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(h,c),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-u,f),this._y=0);break;default:Gt("Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,i===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,i){return md.makeRotationFromQuaternion(t),this.setFromRotationMatrix(md,e,i)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return gd.setFromEuler(this),this.setFromQuaternion(gd,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};Ui.DEFAULT_ORDER="XYZ";var to=class{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}},Mm=0,_d=new L,Xs=new Nn,Ai=new De,ta=new L,Gr=new L,Sm=new L,bm=new Nn,xd=new L(1,0,0),yd=new L(0,1,0),vd=new L(0,0,1),Md={type:"added"},Tm={type:"removed"},qs={type:"childadded",child:null},kc={type:"childremoved",child:null},Ke=class n extends Qn{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Mm++}),this.uuid=br(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=n.DEFAULT_UP.clone();let t=new L,e=new Ui,i=new Nn,s=new L(1,1,1);function r(){i.setFromEuler(e,!1)}function o(){e.setFromQuaternion(i,void 0,!1)}e._onChange(r),i._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new De},normalMatrix:{value:new Qt}}),this.matrix=new De,this.matrixWorld=new De,this.matrixAutoUpdate=n.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=n.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new to,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return Xs.setFromAxisAngle(t,e),this.quaternion.multiply(Xs),this}rotateOnWorldAxis(t,e){return Xs.setFromAxisAngle(t,e),this.quaternion.premultiply(Xs),this}rotateX(t){return this.rotateOnAxis(xd,t)}rotateY(t){return this.rotateOnAxis(yd,t)}rotateZ(t){return this.rotateOnAxis(vd,t)}translateOnAxis(t,e){return _d.copy(t).applyQuaternion(this.quaternion),this.position.add(_d.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(xd,t)}translateY(t){return this.translateOnAxis(yd,t)}translateZ(t){return this.translateOnAxis(vd,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(Ai.copy(this.matrixWorld).invert())}lookAt(t,e,i){t.isVector3?ta.copy(t):ta.set(t,e,i);let s=this.parent;this.updateWorldMatrix(!0,!1),Gr.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Ai.lookAt(Gr,ta,this.up):Ai.lookAt(ta,Gr,this.up),this.quaternion.setFromRotationMatrix(Ai),s&&(Ai.extractRotation(s.matrixWorld),Xs.setFromRotationMatrix(Ai),this.quaternion.premultiply(Xs.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(Jt("Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(Md),qs.child=t,this.dispatchEvent(qs),qs.child=null):Jt("Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}let e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(Tm),kc.child=t,this.dispatchEvent(kc),kc.child=null),this}removeFromParent(){let t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),Ai.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),Ai.multiply(t.parent.matrixWorld)),t.applyMatrix4(Ai),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(Md),qs.child=t,this.dispatchEvent(qs),qs.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let i=0,s=this.children.length;i<s;i++){let o=this.children[i].getObjectByProperty(t,e);if(o!==void 0)return o}}getObjectsByProperty(t,e,i=[]){this[t]===e&&i.push(this);let s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].getObjectsByProperty(t,e,i);return i}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Gr,t,Sm),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Gr,bm,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);let e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}intersectsFrustum(){}traverse(t){t(this);let e=this.children;for(let i=0,s=e.length;i<s;i++)e[i].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);let e=this.children;for(let i=0,s=e.length;i<s;i++)e[i].traverseVisible(t)}traverseAncestors(t){let e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);let t=this.pivot;if(t!==null){let e=t.x,i=t.y,s=t.z,r=this.matrix.elements;r[12]+=e-r[0]*e-r[4]*i-r[8]*s,r[13]+=i-r[1]*e-r[5]*i-r[9]*s,r[14]+=s-r[2]*e-r[6]*i-r[10]*s}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);let e=this.children;for(let i=0,s=e.length;i<s;i++)e[i].updateMatrixWorld(t)}updateWorldMatrix(t,e,i=!1){let s=this.parent;if(t===!0&&s!==null&&s.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||i)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,i=!0),e===!0){let r=this.children;for(let o=0,a=r.length;o<a;o++)r[o].updateWorldMatrix(!1,!0,i)}}toJSON(t){let e=t===void 0||typeof t=="string",i={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});let s={};s.uuid=this.uuid,s.type=this.type,s.name=this.name,s.castShadow=this.castShadow,s.receiveShadow=this.receiveShadow,s.visible=this.visible,s.frustumCulled=this.frustumCulled,s.renderOrder=this.renderOrder,s.static=this.static,s.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.pivot!==null&&(s.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(s.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(s.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(a=>({...a,boundingBox:a.boundingBox?a.boundingBox.toJSON():void 0,boundingSphere:a.boundingSphere?a.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(a=>({...a})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(t),s.indirectTexture=this._indirectTexture.toJSON(t),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(t.geometries,this.geometry);let a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){let l=a.shapes;if(Array.isArray(l))for(let c=0,u=l.length;c<u;c++){let d=l[c];r(t.shapes,d)}else r(t.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(r(t.materials,this.material[l]));s.material=a}else s.material=r(t.materials,this.material);if(this.children.length>0){s.children=[];for(let a=0;a<this.children.length;a++)s.children.push(this.children[a].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let a=0;a<this.animations.length;a++){let l=this.animations[a];s.animations.push(r(t.animations,l))}}if(e){let a=o(t.geometries),l=o(t.materials),c=o(t.textures),u=o(t.images),d=o(t.shapes),h=o(t.skeletons),f=o(t.animations),p=o(t.nodes);a.length>0&&(i.geometries=a),l.length>0&&(i.materials=l),c.length>0&&(i.textures=c),u.length>0&&(i.images=u),d.length>0&&(i.shapes=d),h.length>0&&(i.skeletons=h),f.length>0&&(i.animations=f),p.length>0&&(i.nodes=p)}return i.object=s,i;function o(a){let l=[];for(let c in a){let u=a[c];delete u.metadata,l.push(u)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.pivot=t.pivot!==null?t.pivot.clone():null,this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.static=t.static,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let i=0;i<t.children.length;i++){let s=t.children[i];this.add(s.clone())}return this}dispose(){this.dispatchEvent({type:"dispose"})}};Ke.DEFAULT_UP=new L(0,1,0);Ke.DEFAULT_MATRIX_AUTO_UPDATE=!0;Ke.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var Di=class extends Ke{constructor(){super(),this.isGroup=!0,this.type="Group"}},Em={type:"move"},hr=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Di,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Di,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new L,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new L),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Di,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new L,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new L,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){let e=this._hand;if(e)for(let i of t.hand.values())this._getHandJoint(e,i)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,i){let s=null,r=null,o=null,a=this._targetRay,l=this._grip,c=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(c&&t.hand){o=!0;for(let _ of t.hand.values()){let m=e.getJointPose(_,i),g=this._getHandJoint(c,_);m!==null&&(g.matrix.fromArray(m.transform.matrix),g.matrix.decompose(g.position,g.rotation,g.scale),g.matrixWorldNeedsUpdate=!0,g.jointRadius=m.radius),g.visible=m!==null}let u=c.joints["index-finger-tip"],d=c.joints["thumb-tip"],h=u.position.distanceTo(d.position),f=.02,p=.005;c.inputState.pinching&&h>f+p?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!c.inputState.pinching&&h<=f-p&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,i),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1,l.eventsEnabled&&l.dispatchEvent({type:"gripUpdated",data:t,target:this})));a!==null&&(s=e.getPose(t.targetRaySpace,i),s===null&&r!==null&&(s=r),s!==null&&(a.matrix.fromArray(s.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,s.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(s.linearVelocity)):a.hasLinearVelocity=!1,s.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(s.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(Em)))}return a!==null&&(a.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){let i=new Di;i.matrixAutoUpdate=!1,i.visible=!1,t.joints[e.jointName]=i,t.add(i)}return t.joints[e.jointName]}},bf={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Zi={h:0,s:0,l:0},ea={h:0,s:0,l:0};function zc(n,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?n+(t-n)*6*e:e<1/2?t:e<2/3?n+(t-n)*6*(2/3-e):n}var ae=class{constructor(t,e,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,i)}set(t,e,i){if(e===void 0&&i===void 0){let s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,i);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=dn){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,ge.colorSpaceToWorking(this,e),this}setRGB(t,e,i,s=ge.workingColorSpace){return this.r=t,this.g=e,this.b=i,ge.colorSpaceToWorking(this,s),this}setHSL(t,e,i,s=ge.workingColorSpace){if(t=Uh(t,1),e=fe(e,0,1),i=fe(i,0,1),e===0)this.r=this.g=this.b=i;else{let r=i<=.5?i*(1+e):i+e-i*e,o=2*i-r;this.r=zc(o,r,t+1/3),this.g=zc(o,r,t),this.b=zc(o,r,t-1/3)}return ge.colorSpaceToWorking(this,s),this}setStyle(t,e=dn){function i(r){r!==void 0&&parseFloat(r)<1&&Gt("Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let r,o=s[1],a=s[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:Gt("Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){let r=s[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(o===6)return this.setHex(parseInt(r,16),e);Gt("Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=dn){let i=bf[t.toLowerCase()];return i!==void 0?this.setHex(i,e):Gt("Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=Ni(t.r),this.g=Ni(t.g),this.b=Ni(t.b),this}copyLinearToSRGB(t){return this.r=sr(t.r),this.g=sr(t.g),this.b=sr(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=dn){return ge.workingToColorSpace(sn.copy(this),t),Math.round(fe(sn.r*255,0,255))*65536+Math.round(fe(sn.g*255,0,255))*256+Math.round(fe(sn.b*255,0,255))}getHexString(t=dn){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=ge.workingColorSpace){ge.workingToColorSpace(sn.copy(this),e);let i=sn.r,s=sn.g,r=sn.b,o=Math.max(i,s,r),a=Math.min(i,s,r),l,c,u=(a+o)/2;if(a===o)l=0,c=0;else{let d=o-a;switch(c=u<=.5?d/(o+a):d/(2-o-a),o){case i:l=(s-r)/d+(s<r?6:0);break;case s:l=(r-i)/d+2;break;case r:l=(i-s)/d+4;break}l/=6}return t.h=l,t.s=c,t.l=u,t}getRGB(t,e=ge.workingColorSpace){return ge.workingToColorSpace(sn.copy(this),e),t.r=sn.r,t.g=sn.g,t.b=sn.b,t}getStyle(t=dn){ge.workingToColorSpace(sn.copy(this),t);let e=sn.r,i=sn.g,s=sn.b;return t!==dn?`color(${t} ${e.toFixed(3)} ${i.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(i*255)},${Math.round(s*255)})`}offsetHSL(t,e,i){return this.getHSL(Zi),this.setHSL(Zi.h+t,Zi.s+e,Zi.l+i)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,i){return this.r=t.r+(e.r-t.r)*i,this.g=t.g+(e.g-t.g)*i,this.b=t.b+(e.b-t.b)*i,this}lerpHSL(t,e){this.getHSL(Zi),t.getHSL(ea);let i=Zr(Zi.h,ea.h,e),s=Zr(Zi.s,ea.s,e),r=Zr(Zi.l,ea.l,e);return this.setHSL(i,s,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){let e=this.r,i=this.g,s=this.b,r=t.elements;return this.r=r[0]*e+r[3]*i+r[6]*s,this.g=r[1]*e+r[4]*i+r[7]*s,this.b=r[2]*e+r[5]*i+r[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},sn=new ae;ae.NAMES=bf;var eo=class extends Ke{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Ui,this.environmentIntensity=1,this.environmentRotation=new Ui,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){let e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),e.object.backgroundBlurriness=this.backgroundBlurriness,e.object.backgroundIntensity=this.backgroundIntensity,e.object.backgroundRotation=this.backgroundRotation.toArray(),e.object.environmentIntensity=this.environmentIntensity,e.object.environmentRotation=this.environmentRotation.toArray(),e}},$n=new L,Ci=new L,Vc=new L,Ri=new L,Ys=new L,Zs=new L,Sd=new L,Hc=new L,Gc=new L,Wc=new L,Xc=new Ne,qc=new Ne,Yc=new Ne,Li=class n{constructor(t=new L,e=new L,i=new L){this.a=t,this.b=e,this.c=i}static getNormal(t,e,i,s){s.subVectors(i,e),$n.subVectors(t,e),s.cross($n);let r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(t,e,i,s,r){$n.subVectors(s,e),Ci.subVectors(i,e),Vc.subVectors(t,e);let o=$n.dot($n),a=$n.dot(Ci),l=$n.dot(Vc),c=Ci.dot(Ci),u=Ci.dot(Vc),d=o*c-a*a;if(d===0)return r.set(0,0,0),null;let h=1/d,f=(c*l-a*u)*h,p=(o*u-a*l)*h;return r.set(1-f-p,p,f)}static containsPoint(t,e,i,s){return this.getBarycoord(t,e,i,s,Ri)===null?!1:Ri.x>=0&&Ri.y>=0&&Ri.x+Ri.y<=1}static getInterpolation(t,e,i,s,r,o,a,l){return this.getBarycoord(t,e,i,s,Ri)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,Ri.x),l.addScaledVector(o,Ri.y),l.addScaledVector(a,Ri.z),l)}static getInterpolatedAttribute(t,e,i,s,r,o){return Xc.setScalar(0),qc.setScalar(0),Yc.setScalar(0),Xc.fromBufferAttribute(t,e),qc.fromBufferAttribute(t,i),Yc.fromBufferAttribute(t,s),o.setScalar(0),o.addScaledVector(Xc,r.x),o.addScaledVector(qc,r.y),o.addScaledVector(Yc,r.z),o}static isFrontFacing(t,e,i,s){return $n.subVectors(i,e),Ci.subVectors(t,e),$n.cross(Ci).dot(s)<0}set(t,e,i){return this.a.copy(t),this.b.copy(e),this.c.copy(i),this}setFromPointsAndIndices(t,e,i,s){return this.a.copy(t[e]),this.b.copy(t[i]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,i,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,i),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return $n.subVectors(this.c,this.b),Ci.subVectors(this.a,this.b),$n.cross(Ci).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return n.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return n.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,i,s,r){return n.getInterpolation(t,this.a,this.b,this.c,e,i,s,r)}containsPoint(t){return n.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return n.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){let i=this.a,s=this.b,r=this.c,o,a;Ys.subVectors(s,i),Zs.subVectors(r,i),Hc.subVectors(t,i);let l=Ys.dot(Hc),c=Zs.dot(Hc);if(l<=0&&c<=0)return e.copy(i);Gc.subVectors(t,s);let u=Ys.dot(Gc),d=Zs.dot(Gc);if(u>=0&&d<=u)return e.copy(s);let h=l*d-u*c;if(h<=0&&l>=0&&u<=0)return o=l/(l-u),e.copy(i).addScaledVector(Ys,o);Wc.subVectors(t,r);let f=Ys.dot(Wc),p=Zs.dot(Wc);if(p>=0&&f<=p)return e.copy(r);let _=f*c-l*p;if(_<=0&&c>=0&&p<=0)return a=c/(c-p),e.copy(i).addScaledVector(Zs,a);let m=u*p-f*d;if(m<=0&&d-u>=0&&f-p>=0)return Sd.subVectors(r,s),a=(d-u)/(d-u+(f-p)),e.copy(s).addScaledVector(Sd,a);let g=1/(m+_+h);return o=_*g,a=h*g,e.copy(i).addScaledVector(Ys,o).addScaledVector(Zs,a)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}},ji=class{constructor(t=new L(1/0,1/0,1/0),e=new L(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e+=3)this.expandByPoint(Kn.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,i=t.count;e<i;e++)this.expandByPoint(Kn.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){let i=Kn.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(i),this.max.copy(t).add(i),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);let i=t.geometry;if(i!==void 0){let r=i.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let o=0,a=r.count;o<a;o++)t.isMesh===!0?t.getVertexPosition(o,Kn):Kn.fromBufferAttribute(r,o),Kn.applyMatrix4(t.matrixWorld),this.expandByPoint(Kn);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),na.copy(t.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),na.copy(i.boundingBox)),na.applyMatrix4(t.matrixWorld),this.union(na)}let s=t.children;for(let r=0,o=s.length;r<o;r++)this.expandByObject(s[r],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,Kn),Kn.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,i;return t.normal.x>0?(e=t.normal.x*this.min.x,i=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,i=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,i+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,i+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,i+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,i+=t.normal.z*this.min.z),e<=-t.constant&&i>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(Wr),ia.subVectors(this.max,Wr),Js.subVectors(t.a,Wr),$s.subVectors(t.b,Wr),Ks.subVectors(t.c,Wr),Ji.subVectors($s,Js),$i.subVectors(Ks,$s),vs.subVectors(Js,Ks);let e=[0,-Ji.z,Ji.y,0,-$i.z,$i.y,0,-vs.z,vs.y,Ji.z,0,-Ji.x,$i.z,0,-$i.x,vs.z,0,-vs.x,-Ji.y,Ji.x,0,-$i.y,$i.x,0,-vs.y,vs.x,0];return!Zc(e,Js,$s,Ks,ia)||(e=[1,0,0,0,1,0,0,0,1],!Zc(e,Js,$s,Ks,ia))?!1:(sa.crossVectors(Ji,$i),e=[sa.x,sa.y,sa.z],Zc(e,Js,$s,Ks,ia))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,Kn).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(Kn).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(Pi[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),Pi[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),Pi[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),Pi[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),Pi[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),Pi[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),Pi[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),Pi[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(Pi),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(t){return this.min.fromArray(t.min),this.max.fromArray(t.max),this}},Pi=[new L,new L,new L,new L,new L,new L,new L,new L],Kn=new L,na=new ji,Js=new L,$s=new L,Ks=new L,Ji=new L,$i=new L,vs=new L,Wr=new L,ia=new L,sa=new L,Ms=new L;function Zc(n,t,e,i,s){for(let r=0,o=n.length-3;r<=o;r+=3){Ms.fromArray(n,r);let a=s.x*Math.abs(Ms.x)+s.y*Math.abs(Ms.y)+s.z*Math.abs(Ms.z),l=t.dot(Ms),c=e.dot(Ms),u=i.dot(Ms);if(Math.max(-Math.max(l,c,u),Math.min(l,c,u))>a)return!1}return!0}var He=new L,ra=new Zt,wm=0,Wn=class extends Qn{constructor(t,e,i=!1){if(super(),Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:wm++}),this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=i,this.usage=xf,this.updateRanges=[],this.gpuType=ni,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,i){t*=this.itemSize,i*=e.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[t+s]=e.array[i+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,i=this.count;e<i;e++)ra.fromBufferAttribute(this,e),ra.applyMatrix3(t),this.setXY(e,ra.x,ra.y);else if(this.itemSize===3)for(let e=0,i=this.count;e<i;e++)He.fromBufferAttribute(this,e),He.applyMatrix3(t),this.setXYZ(e,He.x,He.y,He.z);return this}applyMatrix4(t){for(let e=0,i=this.count;e<i;e++)He.fromBufferAttribute(this,e),He.applyMatrix4(t),this.setXYZ(e,He.x,He.y,He.z);return this}applyNormalMatrix(t){for(let e=0,i=this.count;e<i;e++)He.fromBufferAttribute(this,e),He.applyNormalMatrix(t),this.setXYZ(e,He.x,He.y,He.z);return this}transformDirection(t){for(let e=0,i=this.count;e<i;e++)He.fromBufferAttribute(this,e),He.transformDirection(t),this.setXYZ(e,He.x,He.y,He.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let i=this.array[t*this.itemSize+e];return this.normalized&&(i=nr(i,this.array)),i}setComponent(t,e,i){return this.normalized&&(i=un(i,this.array)),this.array[t*this.itemSize+e]=i,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=nr(e,this.array)),e}setX(t,e){return this.normalized&&(e=un(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=nr(e,this.array)),e}setY(t,e){return this.normalized&&(e=un(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=nr(e,this.array)),e}setZ(t,e){return this.normalized&&(e=un(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=nr(e,this.array)),e}setW(t,e){return this.normalized&&(e=un(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,i){return t*=this.itemSize,this.normalized&&(e=un(e,this.array),i=un(i,this.array)),this.array[t+0]=e,this.array[t+1]=i,this}setXYZ(t,e,i,s){return t*=this.itemSize,this.normalized&&(e=un(e,this.array),i=un(i,this.array),s=un(s,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=s,this}setXYZW(t,e,i,s,r){return t*=this.itemSize,this.normalized&&(e=un(e,this.array),i=un(i,this.array),s=un(s,this.array),r=un(r,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=s,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return t.name=this.name,t.usage=this.usage,t.gpuType=this.gpuType,t}dispose(){this.dispatchEvent({type:"dispose"})}};var no=class extends Wn{constructor(t,e,i){super(new Uint16Array(t),e,i)}};var io=class extends Wn{constructor(t,e,i){super(new Uint32Array(t),e,i)}};var Pe=class extends Wn{constructor(t,e,i){super(new Float32Array(t),e,i)}},Am=new ji,Xr=new L,Jc=new L,Es=class{constructor(t=new L,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){let i=this.center;e!==void 0?i.copy(e):Am.setFromPoints(t).getCenter(i);let s=0;for(let r=0,o=t.length;r<o;r++)s=Math.max(s,i.distanceToSquared(t[r]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){let e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){let i=this.center.distanceToSquared(t);return e.copy(t),i>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;Xr.subVectors(t,this.center);let e=Xr.lengthSq();if(e>this.radius*this.radius){let i=Math.sqrt(e),s=(i-this.radius)*.5;this.center.addScaledVector(Xr,s/i),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(Jc.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(Xr.copy(t.center).add(Jc)),this.expandByPoint(Xr.copy(t.center).sub(Jc))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(t){return this.radius=t.radius,this.center.fromArray(t.center),this}},Cm=0,Gn=new De,$c=new Ke,js=new L,Ln=new ji,qr=new ji,Je=new L,Ge=class n extends Qn{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Cm++}),this.uuid=br(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(jp(t)?io:no)(t,1):this.index=t,this}setIndirect(t,e=0){return this.indirect=t,this.indirectOffset=e,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,i=0){this.groups.push({start:t,count:e,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){let e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);let i=this.attributes.normal;if(i!==void 0){let r=new Qt().getNormalMatrix(t);i.applyNormalMatrix(r),i.needsUpdate=!0}let s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(t){return Gn.makeRotationFromQuaternion(t),this.applyMatrix4(Gn),this}rotateX(t){return Gn.makeRotationX(t),this.applyMatrix4(Gn),this}rotateY(t){return Gn.makeRotationY(t),this.applyMatrix4(Gn),this}rotateZ(t){return Gn.makeRotationZ(t),this.applyMatrix4(Gn),this}translate(t,e,i){return Gn.makeTranslation(t,e,i),this.applyMatrix4(Gn),this}scale(t,e,i){return Gn.makeScale(t,e,i),this.applyMatrix4(Gn),this}lookAt(t){return $c.lookAt(t),$c.updateMatrix(),this.applyMatrix4($c.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(js).negate(),this.translate(js.x,js.y,js.z),this}setFromPoints(t){let e=this.getAttribute("position");if(e===void 0){let i=[];for(let s=0,r=t.length;s<r;s++){let o=t[s];i.push(o.x,o.y,o.z||0)}this.setAttribute("position",new Pe(i,3))}else{let i=Math.min(t.length,e.count);for(let s=0;s<i;s++){let r=t[s];e.setXYZ(s,r.x,r.y,r.z||0)}t.length>e.count&&Gt("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new ji);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){Jt("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new L(-1/0,-1/0,-1/0),new L(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let i=0,s=e.length;i<s;i++){let r=e[i];Ln.setFromBufferAttribute(r),this.morphTargetsRelative?(Je.addVectors(this.boundingBox.min,Ln.min),this.boundingBox.expandByPoint(Je),Je.addVectors(this.boundingBox.max,Ln.max),this.boundingBox.expandByPoint(Je)):(this.boundingBox.expandByPoint(Ln.min),this.boundingBox.expandByPoint(Ln.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&Jt('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Es);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){Jt("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new L,1/0);return}if(t){let i=this.boundingSphere.center;if(Ln.setFromBufferAttribute(t),e)for(let r=0,o=e.length;r<o;r++){let a=e[r];qr.setFromBufferAttribute(a),this.morphTargetsRelative?(Je.addVectors(Ln.min,qr.min),Ln.expandByPoint(Je),Je.addVectors(Ln.max,qr.max),Ln.expandByPoint(Je)):(Ln.expandByPoint(qr.min),Ln.expandByPoint(qr.max))}Ln.getCenter(i);let s=0;for(let r=0,o=t.count;r<o;r++)Je.fromBufferAttribute(t,r),s=Math.max(s,i.distanceToSquared(Je));if(e)for(let r=0,o=e.length;r<o;r++){let a=e[r],l=this.morphTargetsRelative;for(let c=0,u=a.count;c<u;c++)Je.fromBufferAttribute(a,c),l&&(js.fromBufferAttribute(t,c),Je.add(js)),s=Math.max(s,i.distanceToSquared(Je))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&Jt('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){Jt("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let i=e.position,s=e.normal,r=e.uv,o=this.getAttribute("tangent");(o===void 0||o.count!==i.count)&&(o=new Wn(new Float32Array(4*i.count),4),this.setAttribute("tangent",o));let a=[],l=[];for(let y=0;y<i.count;y++)a[y]=new L,l[y]=new L;let c=new L,u=new L,d=new L,h=new Zt,f=new Zt,p=new Zt,_=new L,m=new L;function g(y,w,P){c.fromBufferAttribute(i,y),u.fromBufferAttribute(i,w),d.fromBufferAttribute(i,P),h.fromBufferAttribute(r,y),f.fromBufferAttribute(r,w),p.fromBufferAttribute(r,P),u.sub(c),d.sub(c),f.sub(h),p.sub(h);let F=1/(f.x*p.y-p.x*f.y);isFinite(F)&&(_.copy(u).multiplyScalar(p.y).addScaledVector(d,-f.y).multiplyScalar(F),m.copy(d).multiplyScalar(f.x).addScaledVector(u,-p.x).multiplyScalar(F),a[y].add(_),a[w].add(_),a[P].add(_),l[y].add(m),l[w].add(m),l[P].add(m))}let S=this.groups;S.length===0&&(S=[{start:0,count:t.count}]);for(let y=0,w=S.length;y<w;++y){let P=S[y],F=P.start,B=P.count;for(let V=F,I=F+B;V<I;V+=3)g(t.getX(V+0),t.getX(V+1),t.getX(V+2))}let A=new L,v=new L,b=new L,T=new L;function C(y){b.fromBufferAttribute(s,y),T.copy(b);let w=a[y];A.copy(w),A.sub(b.multiplyScalar(b.dot(w))).normalize(),v.crossVectors(T,w);let F=v.dot(l[y])<0?-1:1;o.setXYZW(y,A.x,A.y,A.z,F)}for(let y=0,w=S.length;y<w;++y){let P=S[y],F=P.start,B=P.count;for(let V=F,I=F+B;V<I;V+=3)C(t.getX(V+0)),C(t.getX(V+1)),C(t.getX(V+2))}this._transformed=!0}computeVertexNormals(){let t=this.index,e=this.getAttribute("position");if(e!==void 0){let i=this.getAttribute("normal");if(i===void 0||i.count!==e.count)i=new Wn(new Float32Array(e.count*3),3),this.setAttribute("normal",i);else for(let h=0,f=i.count;h<f;h++)i.setXYZ(h,0,0,0);let s=new L,r=new L,o=new L,a=new L,l=new L,c=new L,u=new L,d=new L;if(t)for(let h=0,f=t.count;h<f;h+=3){let p=t.getX(h+0),_=t.getX(h+1),m=t.getX(h+2);s.fromBufferAttribute(e,p),r.fromBufferAttribute(e,_),o.fromBufferAttribute(e,m),u.subVectors(o,r),d.subVectors(s,r),u.cross(d),a.fromBufferAttribute(i,p),l.fromBufferAttribute(i,_),c.fromBufferAttribute(i,m),a.add(u),l.add(u),c.add(u),i.setXYZ(p,a.x,a.y,a.z),i.setXYZ(_,l.x,l.y,l.z),i.setXYZ(m,c.x,c.y,c.z)}else for(let h=0,f=e.count;h<f;h+=3)s.fromBufferAttribute(e,h+0),r.fromBufferAttribute(e,h+1),o.fromBufferAttribute(e,h+2),u.subVectors(o,r),d.subVectors(s,r),u.cross(d),i.setXYZ(h+0,u.x,u.y,u.z),i.setXYZ(h+1,u.x,u.y,u.z),i.setXYZ(h+2,u.x,u.y,u.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){let t=this.attributes.normal;for(let e=0,i=t.count;e<i;e++)Je.fromBufferAttribute(t,e),Je.normalize(),t.setXYZ(e,Je.x,Je.y,Je.z)}toNonIndexed(){function t(a,l){let c=a.array,u=a.itemSize,d=a.normalized,h=new c.constructor(l.length*u),f=0,p=0;for(let _=0,m=l.length;_<m;_++){a.isInterleavedBufferAttribute?f=l[_]*a.data.stride+a.offset:f=l[_]*u;for(let g=0;g<u;g++)h[p++]=c[f++]}return new Wn(h,u,d)}if(this.index===null)return Gt("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let e=new n,i=this.index.array,s=this.attributes;for(let a in s){let l=s[a],c=t(l,i);e.setAttribute(a,c)}let r=this.morphAttributes;for(let a in r){let l=[],c=r[a];for(let u=0,d=c.length;u<d;u++){let h=c[u],f=t(h,i);l.push(f)}e.morphAttributes[a]=l}e.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let a=0,l=o.length;a<l;a++){let c=o[a];e.addGroup(c.start,c.count,c.materialIndex)}return e}toJSON(){let t={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,t.name=this.name,Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){let l=this.parameters;for(let c in l)l[c]!==void 0&&(t[c]=l[c]);return t}t.data={attributes:{}};let e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});let i=this.attributes;for(let l in i){let c=i[l];t.data.attributes[l]=c.toJSON(t.data)}let s={},r=!1;for(let l in this.morphAttributes){let c=this.morphAttributes[l],u=[];for(let d=0,h=c.length;d<h;d++){let f=c[d];u.push(f.toJSON(t.data))}u.length>0&&(s[l]=u,r=!0)}r&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);let o=this.groups;o.length>0&&(t.data.groups=JSON.parse(JSON.stringify(o)));let a=this.boundingSphere;return a!==null&&(t.data.boundingSphere=a.toJSON()),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let e={};this.name=t.name;let i=t.index;i!==null&&this.setIndex(i.clone());let s=t.attributes;for(let c in s){let u=s[c];this.setAttribute(c,u.clone(e))}let r=t.morphAttributes;for(let c in r){let u=[],d=r[c];for(let h=0,f=d.length;h<f;h++)u.push(d[h].clone(e));this.morphAttributes[c]=u}this.morphTargetsRelative=t.morphTargetsRelative;let o=t.groups;for(let c=0,u=o.length;c<u;c++){let d=o[c];this.addGroup(d.start,d.count,d.materialIndex)}let a=t.boundingBox;a!==null&&(this.boundingBox=a.clone());let l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this._transformed=t._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}};var Kc=new L,Rm=new L,Pm=new Qt,Dn=class{constructor(t=new L(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,i,s){return this.normal.set(t,e,i),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,i){let s=Kc.subVectors(i,e).cross(Rm.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){let t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e,i=!0){let s=t.delta(Kc),r=this.normal.dot(s);if(r===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;let o=-(t.start.dot(this.normal)+this.constant)/r;return i===!0&&(o<0||o>1)?null:e.copy(t.start).addScaledVector(s,o)}intersectsLine(t){let e=this.distanceToPoint(t.start),i=this.distanceToPoint(t.end);return e<0&&i>0||i<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){let i=e||Pm.getNormalMatrix(t),s=this.coplanarPoint(Kc).applyMatrix4(t),r=this.normal.applyMatrix3(i).normalize();return this.constant=-s.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(t){return this.normal.fromArray(t.normal),this.constant=t.constant,this}},Im=0,Fi=class extends Qn{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Im++}),this.uuid=br(),this.name="",this.type="Material",this.blending=vr,this.side=as,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=gh,this.blendDst=_h,this.blendEquation=Cs,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new ae(0,0,0),this.blendAlpha=0,this.depthFunc=rr,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=uf,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Ea,this.stencilZFail=Ea,this.stencilZPass=Ea,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(let e in t){let i=t[e];if(i===void 0){Gt(`Material: parameter '${e}' has value of undefined.`);continue}let s=this[e];if(s===void 0){Gt(`Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(i):s&&s.isVector2&&i&&i.isVector2||s&&s.isEuler&&i&&i.isEuler||s&&s.isVector3&&i&&i.isVector3?s.copy(i):this[e]=i}}toJSON(t){let e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});let i={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,i.blending=this.blending,i.side=this.side,i.shadowSide=this.shadowSide,i.vertexColors=this.vertexColors,i.opacity=this.opacity,i.transparent=this.transparent,i.blendSrc=this.blendSrc,i.blendDst=this.blendDst,i.blendEquation=this.blendEquation,i.blendSrcAlpha=this.blendSrcAlpha,i.blendDstAlpha=this.blendDstAlpha,i.blendEquationAlpha=this.blendEquationAlpha,i.blendColor=this.blendColor.getHex(),i.blendAlpha=this.blendAlpha,i.depthFunc=this.depthFunc,i.depthTest=this.depthTest,i.depthWrite=this.depthWrite,i.colorWrite=this.colorWrite,i.clipIntersection=this.clipIntersection,i.clipShadows=this.clipShadows,i.stencilWriteMask=this.stencilWriteMask,i.stencilFunc=this.stencilFunc,i.stencilRef=this.stencilRef,i.stencilFuncMask=this.stencilFuncMask,i.stencilFail=this.stencilFail,i.stencilZFail=this.stencilZFail,i.stencilZPass=this.stencilZPass,i.stencilWrite=this.stencilWrite,i.polygonOffset=this.polygonOffset,i.polygonOffsetFactor=this.polygonOffsetFactor,i.polygonOffsetUnits=this.polygonOffsetUnits,i.dithering=this.dithering,i.alphaTest=this.alphaTest,i.alphaHash=this.alphaHash,i.alphaToCoverage=this.alphaToCoverage,i.premultipliedAlpha=this.premultipliedAlpha,i.forceSinglePass=this.forceSinglePass,i.allowOverride=this.allowOverride,i.visible=this.visible,i.toneMapped=this.toneMapped,i.name=this.name,this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(i.sheenColorMap=this.sheenColorMap.toJSON(t).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(i.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(t).uuid),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(i.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(t).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(t).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(t).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(t).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(t).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(i.clippingPlanes=this.clippingPlanes.map(r=>r.toJSON())),this.rotation!==void 0&&(i.rotation=this.rotation),this.depthPacking!==void 0&&(i.depthPacking=this.depthPacking),this.linewidth!==void 0&&(i.linewidth=this.linewidth),this.linecap!==void 0&&(i.linecap=this.linecap),this.linejoin!==void 0&&(i.linejoin=this.linejoin),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.wireframe!==void 0&&(i.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(i.flatShading=this.flatShading),this.fog!==void 0&&(i.fog=this.fog),Object.keys(this.userData).length>0&&(i.userData=this.userData);function s(r){let o=[];for(let a in r){let l=r[a];delete l.metadata,o.push(l)}return o}if(e){let r=s(t.textures),o=s(t.images);r.length>0&&(i.textures=r),o.length>0&&(i.images=o)}return i}fromJSON(t,e){if(t.uuid!==void 0&&(this.uuid=t.uuid),t.name!==void 0&&(this.name=t.name),t.color!==void 0&&this.color!==void 0&&this.color.setHex(t.color),t.roughness!==void 0&&(this.roughness=t.roughness),t.metalness!==void 0&&(this.metalness=t.metalness),t.sheen!==void 0&&(this.sheen=t.sheen),t.sheenColor!==void 0&&(this.sheenColor=new ae().setHex(t.sheenColor)),t.sheenRoughness!==void 0&&(this.sheenRoughness=t.sheenRoughness),t.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(t.emissive),t.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(t.specular),t.specularIntensity!==void 0&&(this.specularIntensity=t.specularIntensity),t.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(t.specularColor),t.shininess!==void 0&&(this.shininess=t.shininess),t.clearcoat!==void 0&&(this.clearcoat=t.clearcoat),t.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=t.clearcoatRoughness),t.dispersion!==void 0&&(this.dispersion=t.dispersion),t.retroreflectivity!==void 0&&(this.retroreflectivity=t.retroreflectivity),t.iridescence!==void 0&&(this.iridescence=t.iridescence),t.iridescenceIOR!==void 0&&(this.iridescenceIOR=t.iridescenceIOR),t.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=t.iridescenceThicknessRange),t.transmission!==void 0&&(this.transmission=t.transmission),t.thickness!==void 0&&(this.thickness=t.thickness),t.attenuationDistance!==void 0&&(this.attenuationDistance=t.attenuationDistance),t.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(t.attenuationColor),t.anisotropy!==void 0&&(this.anisotropy=t.anisotropy),t.anisotropyRotation!==void 0&&(this.anisotropyRotation=t.anisotropyRotation),t.fog!==void 0&&(this.fog=t.fog),t.flatShading!==void 0&&(this.flatShading=t.flatShading),t.blending!==void 0&&(this.blending=t.blending),t.combine!==void 0&&(this.combine=t.combine),t.side!==void 0&&(this.side=t.side),t.shadowSide!==void 0&&(this.shadowSide=t.shadowSide),t.opacity!==void 0&&(this.opacity=t.opacity),t.transparent!==void 0&&(this.transparent=t.transparent),t.alphaTest!==void 0&&(this.alphaTest=t.alphaTest),t.alphaHash!==void 0&&(this.alphaHash=t.alphaHash),t.depthFunc!==void 0&&(this.depthFunc=t.depthFunc),t.depthTest!==void 0&&(this.depthTest=t.depthTest),t.depthWrite!==void 0&&(this.depthWrite=t.depthWrite),t.colorWrite!==void 0&&(this.colorWrite=t.colorWrite),t.clippingPlanes!==void 0&&(this.clippingPlanes=t.clippingPlanes.map(i=>new Dn().fromJSON(i))),t.clipIntersection!==void 0&&(this.clipIntersection=t.clipIntersection),t.clipShadows!==void 0&&(this.clipShadows=t.clipShadows),t.depthPacking!==void 0&&(this.depthPacking=t.depthPacking),t.blendSrc!==void 0&&(this.blendSrc=t.blendSrc),t.blendDst!==void 0&&(this.blendDst=t.blendDst),t.blendEquation!==void 0&&(this.blendEquation=t.blendEquation),t.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=t.blendSrcAlpha),t.blendDstAlpha!==void 0&&(this.blendDstAlpha=t.blendDstAlpha),t.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=t.blendEquationAlpha),t.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(t.blendColor),t.blendAlpha!==void 0&&(this.blendAlpha=t.blendAlpha),t.stencilWriteMask!==void 0&&(this.stencilWriteMask=t.stencilWriteMask),t.stencilFunc!==void 0&&(this.stencilFunc=t.stencilFunc),t.stencilRef!==void 0&&(this.stencilRef=t.stencilRef),t.stencilFuncMask!==void 0&&(this.stencilFuncMask=t.stencilFuncMask),t.stencilFail!==void 0&&(this.stencilFail=t.stencilFail),t.stencilZFail!==void 0&&(this.stencilZFail=t.stencilZFail),t.stencilZPass!==void 0&&(this.stencilZPass=t.stencilZPass),t.stencilWrite!==void 0&&(this.stencilWrite=t.stencilWrite),t.wireframe!==void 0&&(this.wireframe=t.wireframe),t.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=t.wireframeLinewidth),t.wireframeLinecap!==void 0&&(this.wireframeLinecap=t.wireframeLinecap),t.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=t.wireframeLinejoin),t.rotation!==void 0&&(this.rotation=t.rotation),t.linewidth!==void 0&&(this.linewidth=t.linewidth),t.linecap!==void 0&&(this.linecap=t.linecap),t.linejoin!==void 0&&(this.linejoin=t.linejoin),t.dashSize!==void 0&&(this.dashSize=t.dashSize),t.gapSize!==void 0&&(this.gapSize=t.gapSize),t.scale!==void 0&&(this.scale=t.scale),t.polygonOffset!==void 0&&(this.polygonOffset=t.polygonOffset),t.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=t.polygonOffsetFactor),t.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=t.polygonOffsetUnits),t.dithering!==void 0&&(this.dithering=t.dithering),t.alphaToCoverage!==void 0&&(this.alphaToCoverage=t.alphaToCoverage),t.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=t.premultipliedAlpha),t.forceSinglePass!==void 0&&(this.forceSinglePass=t.forceSinglePass),t.allowOverride!==void 0&&(this.allowOverride=t.allowOverride),t.visible!==void 0&&(this.visible=t.visible),t.toneMapped!==void 0&&(this.toneMapped=t.toneMapped),t.userData!==void 0&&(this.userData=t.userData),t.vertexColors!==void 0&&(typeof t.vertexColors=="number"?this.vertexColors=t.vertexColors>0:this.vertexColors=t.vertexColors),t.size!==void 0&&(this.size=t.size),t.sizeAttenuation!==void 0&&(this.sizeAttenuation=t.sizeAttenuation),t.map!==void 0&&(this.map=e[t.map]||null),t.matcap!==void 0&&(this.matcap=e[t.matcap]||null),t.alphaMap!==void 0&&(this.alphaMap=e[t.alphaMap]||null),t.bumpMap!==void 0&&(this.bumpMap=e[t.bumpMap]||null),t.bumpScale!==void 0&&(this.bumpScale=t.bumpScale),t.normalMap!==void 0&&(this.normalMap=e[t.normalMap]||null),t.normalMapType!==void 0&&(this.normalMapType=t.normalMapType),t.normalScale!==void 0){let i=t.normalScale;Array.isArray(i)===!1&&(i=[i,i]),this.normalScale=new Zt().fromArray(i)}return t.displacementMap!==void 0&&(this.displacementMap=e[t.displacementMap]||null),t.displacementScale!==void 0&&(this.displacementScale=t.displacementScale),t.displacementBias!==void 0&&(this.displacementBias=t.displacementBias),t.roughnessMap!==void 0&&(this.roughnessMap=e[t.roughnessMap]||null),t.metalnessMap!==void 0&&(this.metalnessMap=e[t.metalnessMap]||null),t.emissiveMap!==void 0&&(this.emissiveMap=e[t.emissiveMap]||null),t.emissiveIntensity!==void 0&&(this.emissiveIntensity=t.emissiveIntensity),t.specularMap!==void 0&&(this.specularMap=e[t.specularMap]||null),t.specularIntensityMap!==void 0&&(this.specularIntensityMap=e[t.specularIntensityMap]||null),t.specularColorMap!==void 0&&(this.specularColorMap=e[t.specularColorMap]||null),t.envMap!==void 0&&(this.envMap=e[t.envMap]||null),t.envMapRotation!==void 0&&this.envMapRotation.fromArray(t.envMapRotation),t.envMapIntensity!==void 0&&(this.envMapIntensity=t.envMapIntensity),t.reflectivity!==void 0&&(this.reflectivity=t.reflectivity),t.refractionRatio!==void 0&&(this.refractionRatio=t.refractionRatio),t.lightMap!==void 0&&(this.lightMap=e[t.lightMap]||null),t.lightMapIntensity!==void 0&&(this.lightMapIntensity=t.lightMapIntensity),t.aoMap!==void 0&&(this.aoMap=e[t.aoMap]||null),t.aoMapIntensity!==void 0&&(this.aoMapIntensity=t.aoMapIntensity),t.gradientMap!==void 0&&(this.gradientMap=e[t.gradientMap]||null),t.clearcoatMap!==void 0&&(this.clearcoatMap=e[t.clearcoatMap]||null),t.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=e[t.clearcoatRoughnessMap]||null),t.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=e[t.clearcoatNormalMap]||null),t.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new Zt().fromArray(t.clearcoatNormalScale)),t.iridescenceMap!==void 0&&(this.iridescenceMap=e[t.iridescenceMap]||null),t.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=e[t.iridescenceThicknessMap]||null),t.transmissionMap!==void 0&&(this.transmissionMap=e[t.transmissionMap]||null),t.thicknessMap!==void 0&&(this.thicknessMap=e[t.thicknessMap]||null),t.anisotropyMap!==void 0&&(this.anisotropyMap=e[t.anisotropyMap]||null),t.sheenColorMap!==void 0&&(this.sheenColorMap=e[t.sheenColorMap]||null),t.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=e[t.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;let e=t.clippingPlanes,i=null;if(e!==null){let s=e.length;i=new Array(s);for(let r=0;r!==s;++r)i[r]=e[r].clone()}return this.clippingPlanes=i,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.allowOverride=t.allowOverride,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}};var Ii=new L,jc=new L,oa=new L,aa=new L,ws=class{constructor(t=new L,e=new L(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,Ii)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);let i=e.dot(this.direction);return i<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){let e=Ii.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(Ii.copy(this.origin).addScaledVector(this.direction,e),Ii.distanceToSquared(t))}distanceSqToSegment(t,e,i,s){jc.copy(t).add(e).multiplyScalar(.5),oa.copy(e).sub(t).normalize(),aa.copy(this.origin).sub(jc);let r=t.distanceTo(e)*.5,o=-this.direction.dot(oa),a=aa.dot(this.direction),l=-aa.dot(oa),c=aa.lengthSq(),u=Math.abs(1-o*o),d,h,f,p;if(u>0)if(d=o*l-a,h=o*a-l,p=r*u,d>=0)if(h>=-p)if(h<=p){let _=1/u;d*=_,h*=_,f=d*(d+o*h+2*a)+h*(o*d+h+2*l)+c}else h=r,d=Math.max(0,-(o*h+a)),f=-d*d+h*(h+2*l)+c;else h=-r,d=Math.max(0,-(o*h+a)),f=-d*d+h*(h+2*l)+c;else h<=-p?(d=Math.max(0,-(-o*r+a)),h=d>0?-r:Math.min(Math.max(-r,-l),r),f=-d*d+h*(h+2*l)+c):h<=p?(d=0,h=Math.min(Math.max(-r,-l),r),f=h*(h+2*l)+c):(d=Math.max(0,-(o*r+a)),h=d>0?r:Math.min(Math.max(-r,-l),r),f=-d*d+h*(h+2*l)+c);else h=o>0?-r:r,d=Math.max(0,-(o*h+a)),f=-d*d+h*(h+2*l)+c;return i&&i.copy(this.origin).addScaledVector(this.direction,d),s&&s.copy(jc).addScaledVector(oa,h),f}intersectSphere(t,e){if(t.radius<0)return null;Ii.subVectors(t.center,this.origin);let i=Ii.dot(this.direction),s=Ii.dot(Ii)-i*i,r=t.radius*t.radius;if(s>r)return null;let o=Math.sqrt(r-s),a=i-o,l=i+o;return l<0?null:a<0?this.at(l,e):this.at(a,e)}intersectsSphere(t){return t.radius<0?!1:this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){let e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;let i=-(this.origin.dot(t.normal)+t.constant)/e;return i>=0?i:null}intersectPlane(t,e){let i=this.distanceToPlane(t);return i===null?null:this.at(i,e)}intersectsPlane(t){let e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let i,s,r,o,a,l,c=1/this.direction.x,u=1/this.direction.y,d=1/this.direction.z,h=this.origin;return c>=0?(i=(t.min.x-h.x)*c,s=(t.max.x-h.x)*c):(i=(t.max.x-h.x)*c,s=(t.min.x-h.x)*c),u>=0?(r=(t.min.y-h.y)*u,o=(t.max.y-h.y)*u):(r=(t.max.y-h.y)*u,o=(t.min.y-h.y)*u),i>o||r>s||((r>i||isNaN(i))&&(i=r),(o<s||isNaN(s))&&(s=o),d>=0?(a=(t.min.z-h.z)*d,l=(t.max.z-h.z)*d):(a=(t.max.z-h.z)*d,l=(t.min.z-h.z)*d),i>l||a>s)||((a>i||i!==i)&&(i=a),(l<s||s!==s)&&(s=l),s<0)?null:this.at(i>=0?i:s,e)}intersectsBox(t){return this.intersectBox(t,Ii)!==null}intersectTriangle(t,e,i,s,r){let o=this.origin,a=this.direction,l=a.x,c=a.y,u=a.z,d=t.x-o.x,h=t.y-o.y,f=t.z-o.z,p=e.x-o.x,_=e.y-o.y,m=e.z-o.z,g=i.x-o.x,S=i.y-o.y,A=i.z-o.z,v=Math.abs(l),b=Math.abs(c),T=Math.abs(u),C,y,w,P,F,B,V,I,k,W,J,et;if(v>=b&&v>=T?(w=l,B=d,k=p,et=g,l>=0?(C=c,y=u,P=h,F=f,V=_,I=m,W=S,J=A):(C=u,y=c,P=f,F=h,V=m,I=_,W=A,J=S)):b>=T?(w=c,B=h,k=_,et=S,c>=0?(C=u,y=l,P=f,F=d,V=m,I=p,W=A,J=g):(C=l,y=u,P=d,F=f,V=p,I=m,W=g,J=A)):(w=u,B=f,k=m,et=A,u>=0?(C=l,y=c,P=d,F=h,V=p,I=_,W=g,J=S):(C=c,y=l,P=h,F=d,V=_,I=p,W=S,J=g)),w===0)return null;let U=C/w,q=y/w,j=1/w,yt=P-U*B,Tt=F-q*B,pe=V-U*k,qt=I-q*k,Et=W-U*et,Y=J-q*et,K=Et*qt-Y*pe,it=yt*Y-Tt*Et,Rt=pe*Tt-qt*yt;if(s){if(K<0||it<0||Rt<0)return null}else if((K<0||it<0||Rt<0)&&(K>0||it>0||Rt>0))return null;let ot=K+it+Rt;if(ot===0)return null;let ut=j*(K*B+it*k+Rt*et);return(ot>0?ut<0:ut>0)?null:this.at(ut/ot,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},ur=class extends Fi{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new ae(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Ui,this.combine=xh,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}},bd=new De,Ss=new ws,la=new Es,Td=new L,ca=new L,ha=new L,ua=new L,Qc=new L,da=new L,Ed=new L,fa=new L,fn=class extends Ke{constructor(t=new Ge,e=new ur){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){let e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){let s=e[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(t,e){let i=this.geometry,s=i.attributes.position,r=i.morphAttributes.position,o=i.morphTargetsRelative;e.fromBufferAttribute(s,t);let a=this.morphTargetInfluences;if(r&&a){da.set(0,0,0);for(let l=0,c=r.length;l<c;l++){let u=a[l],d=r[l];u!==0&&(Qc.fromBufferAttribute(d,t),o?da.addScaledVector(Qc,u):da.addScaledVector(Qc.sub(e),u))}e.add(da)}return e}intersectsFrustum(t){return t.intersectsObject(this)}raycast(t,e){let i=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),la.copy(i.boundingSphere),la.applyMatrix4(r),Ss.copy(t.ray).recast(t.near),!(la.containsPoint(Ss.origin)===!1&&(Ss.intersectSphere(la,Td)===null||Ss.origin.distanceToSquared(Td)>(t.far-t.near)**2))&&(bd.copy(r).invert(),Ss.copy(t.ray).applyMatrix4(bd),!(i.boundingBox!==null&&Ss.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(t,e,Ss)))}_computeIntersections(t,e,i){let s,r=this.geometry,o=this.material,a=r.index,l=r.attributes.position,c=r.attributes.uv,u=r.attributes.uv1,d=r.attributes.normal,h=r.groups,f=r.drawRange;if(a!==null)if(Array.isArray(o))for(let p=0,_=h.length;p<_;p++){let m=h[p],g=o[m.materialIndex],S=Math.max(m.start,f.start),A=Math.min(a.count,Math.min(m.start+m.count,f.start+f.count));for(let v=S,b=A;v<b;v+=3){let T=a.getX(v),C=a.getX(v+1),y=a.getX(v+2);s=pa(this,g,t,i,c,u,d,T,C,y),s&&(s.faceIndex=Math.floor(v/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{let p=Math.max(0,f.start),_=Math.min(a.count,f.start+f.count);for(let m=p,g=_;m<g;m+=3){let S=a.getX(m),A=a.getX(m+1),v=a.getX(m+2);s=pa(this,o,t,i,c,u,d,S,A,v),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}else if(l!==void 0)if(Array.isArray(o))for(let p=0,_=h.length;p<_;p++){let m=h[p],g=o[m.materialIndex],S=Math.max(m.start,f.start),A=Math.min(l.count,Math.min(m.start+m.count,f.start+f.count));for(let v=S,b=A;v<b;v+=3){let T=v,C=v+1,y=v+2;s=pa(this,g,t,i,c,u,d,T,C,y),s&&(s.faceIndex=Math.floor(v/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{let p=Math.max(0,f.start),_=Math.min(l.count,f.start+f.count);for(let m=p,g=_;m<g;m+=3){let S=m,A=m+1,v=m+2;s=pa(this,o,t,i,c,u,d,S,A,v),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}}};function Lm(n,t,e,i,s,r,o,a){let l;if(t.side===gn?l=i.intersectTriangle(o,r,s,!0,a):l=i.intersectTriangle(s,r,o,t.side===as,a),l===null)return null;fa.copy(a),fa.applyMatrix4(n.matrixWorld);let c=e.ray.origin.distanceTo(fa);return c<e.near||c>e.far?null:{distance:c,point:fa.clone(),object:n}}function pa(n,t,e,i,s,r,o,a,l,c){n.getVertexPosition(a,ca),n.getVertexPosition(l,ha),n.getVertexPosition(c,ua);let u=Lm(n,t,e,i,ca,ha,ua,Ed);if(u){let d=new L;Li.getBarycoord(Ed,ca,ha,ua,d),s&&(u.uv=Li.getInterpolatedAttribute(s,a,l,c,d,new Zt)),r&&(u.uv1=Li.getInterpolatedAttribute(r,a,l,c,d,new Zt)),o&&(u.normal=Li.getInterpolatedAttribute(o,a,l,c,d,new L),u.normal.dot(i.direction)>0&&u.normal.multiplyScalar(-1));let h={a,b:l,c,normal:new L,materialIndex:0};Li.getNormal(ca,ha,ua,h.normal),u.face=h,u.barycoord=d}return u}var ka=class extends Sn{constructor(t=null,e=1,i=1,s,r,o,a,l,c=$e,u=$e,d,h){super(null,o,a,l,c,u,s,r,d,h),this.isDataTexture=!0,this.image={data:t,width:e,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var bs=new Es,Dm=new Zt(.5,.5),ma=new L,dr=class{constructor(t=new Dn,e=new Dn,i=new Dn,s=new Dn,r=new Dn,o=new Dn){this.planes=[t,e,i,s,r,o]}set(t,e,i,s,r,o){let a=this.planes;return a[0].copy(t),a[1].copy(e),a[2].copy(i),a[3].copy(s),a[4].copy(r),a[5].copy(o),this}copy(t){let e=this.planes;for(let i=0;i<6;i++)e[i].copy(t.planes[i]);return this}setFromProjectionMatrix(t,e=jn,i=!1){let s=this.planes,r=t.elements,o=r[0],a=r[1],l=r[2],c=r[3],u=r[4],d=r[5],h=r[6],f=r[7],p=r[8],_=r[9],m=r[10],g=r[11],S=r[12],A=r[13],v=r[14],b=r[15];if(s[0].setComponents(c-o,f-u,g-p,b-S).normalize(),s[1].setComponents(c+o,f+u,g+p,b+S).normalize(),s[2].setComponents(c+a,f+d,g+_,b+A).normalize(),s[3].setComponents(c-a,f-d,g-_,b-A).normalize(),i)s[4].setComponents(l,h,m,v).normalize(),s[5].setComponents(c-l,f-h,g-m,b-v).normalize();else if(s[4].setComponents(c-l,f-h,g-m,b-v).normalize(),e===jn)s[5].setComponents(c+l,f+h,g+m,b+v).normalize();else if(e===or)s[5].setComponents(l,h,m,v).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),bs.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{let e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),bs.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(bs)}intersectsSprite(t){bs.center.set(0,0,0);let e=Dm.distanceTo(t.center);return bs.radius=.7071067811865476+e,bs.applyMatrix4(t.matrixWorld),this.intersectsSphere(bs)}intersectsSphere(t){let e=this.planes,i=t.center,s=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(i)<s)return!1;return!0}intersectsBox(t){let e=this.planes;for(let i=0;i<6;i++){let s=e[i];if(ma.x=s.normal.x>0?t.max.x:t.min.x,ma.y=s.normal.y>0?t.max.y:t.min.y,ma.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(ma)<0)return!1}return!0}containsPoint(t){let e=this.planes;for(let i=0;i<6;i++)if(e[i].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};var Tn=class extends Fi{constructor(t){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new ae(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}},za=new L,Va=new L,wd=new De,Yr=new ws,ga=new Es,th=new L,Ad=new L,As=class extends Ke{constructor(t=new Ge,e=new Tn){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){let t=this.geometry;if(t.index===null){let e=t.attributes.position,i=[0];for(let s=1,r=e.count;s<r;s++)za.fromBufferAttribute(e,s-1),Va.fromBufferAttribute(e,s),i[s]=i[s-1],i[s]+=za.distanceTo(Va);t.setAttribute("lineDistance",new Pe(i,1))}else Gt("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}intersectsFrustum(t){return t.intersectsObject(this)}raycast(t,e){let i=this.geometry,s=this.matrixWorld,r=t.params.Line.threshold,o=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),ga.copy(i.boundingSphere),ga.applyMatrix4(s),ga.radius+=r,t.ray.intersectsSphere(ga)===!1)return;wd.copy(s).invert(),Yr.copy(t.ray).applyMatrix4(wd);let a=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=this.isLineSegments?2:1,u=i.index,h=i.attributes.position;if(u!==null){let f=Math.max(0,o.start),p=Math.min(u.count,o.start+o.count);for(let _=f,m=p-1;_<m;_+=c){let g=u.getX(_),S=u.getX(_+1),A=_a(this,t,Yr,l,g,S,_);A&&e.push(A)}if(this.isLineLoop){let _=u.getX(p-1),m=u.getX(f),g=_a(this,t,Yr,l,_,m,p-1);g&&e.push(g)}}else{let f=Math.max(0,o.start),p=Math.min(h.count,o.start+o.count);for(let _=f,m=p-1;_<m;_+=c){let g=_a(this,t,Yr,l,_,_+1,_);g&&e.push(g)}if(this.isLineLoop){let _=_a(this,t,Yr,l,p-1,f,p-1);_&&e.push(_)}}}updateMorphTargets(){let e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){let s=e[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}};function _a(n,t,e,i,s,r,o){let a=n.geometry.attributes.position;if(za.fromBufferAttribute(a,s),Va.fromBufferAttribute(a,r),e.distanceSqToSegment(za,Va,th,Ad)>i)return;th.applyMatrix4(n.matrixWorld);let c=t.ray.origin.distanceTo(th);if(!(c<t.near||c>t.far))return{distance:c,point:Ad.clone().applyMatrix4(n.matrixWorld),index:o,face:null,faceIndex:null,barycoord:null,object:n}}var Cd=new L,Rd=new L,_i=class extends As{constructor(t,e){super(t,e),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){let t=this.geometry;if(t.index===null){let e=t.attributes.position,i=[];for(let s=0,r=e.count;s<r;s+=2)Cd.fromBufferAttribute(e,s),Rd.fromBufferAttribute(e,s+1),i[s]=s===0?0:i[s-1],i[s+1]=i[s]+Cd.distanceTo(Rd);t.setAttribute("lineDistance",new Pe(i,1))}else Gt("LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}};var so=class extends Sn{constructor(t=[],e=ls,i,s,r,o,a,l,c,u){super(t,e,i,s,r,o,a,l,c,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}};var Qi=class extends Sn{constructor(t,e,i=ei,s,r,o,a=$e,l=$e,c,u=gi,d=1){if(u!==gi&&u!==hs)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");let h={width:t,height:e,depth:d};super(h,s,r,o,a,l,u,i,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.source=new cr(Object.assign({},t.image)),this.compareFunction=t.compareFunction,this}toJSON(t){let e=super.toJSON(t);return e.compareFunction=this.compareFunction,e}},Ha=class extends Qi{constructor(t,e=ei,i=ls,s,r,o=$e,a=$e,l,c=gi){let u={width:t,height:t,depth:1},d=[u,u,u,u,u,u];super(t,t,e,i,s,r,o,a,l,c),this.image=d,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(t){this.image=t}},ro=class extends Sn{constructor(t=null){super(),this.sourceTexture=t,this.isExternalTexture=!0}copy(t){return super.copy(t),this.sourceTexture=t.sourceTexture,this}},fr=class n extends Ge{constructor(t=1,e=1,i=1,s=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:i,widthSegments:s,heightSegments:r,depthSegments:o};let a=this;s=Math.floor(s),r=Math.floor(r),o=Math.floor(o);let l=[],c=[],u=[],d=[],h=0,f=0;p("z","y","x",-1,-1,i,e,t,o,r,0),p("z","y","x",1,-1,i,e,-t,o,r,1),p("x","z","y",1,1,t,i,e,s,o,2),p("x","z","y",1,-1,t,i,-e,s,o,3),p("x","y","z",1,-1,t,e,i,s,r,4),p("x","y","z",-1,-1,t,e,-i,s,r,5),this.setIndex(l),this.setAttribute("position",new Pe(c,3)),this.setAttribute("normal",new Pe(u,3)),this.setAttribute("uv",new Pe(d,2));function p(_,m,g,S,A,v,b,T,C,y,w){let P=v/C,F=b/y,B=v/2,V=b/2,I=T/2,k=C+1,W=y+1,J=0,et=0,U=new L;for(let q=0;q<W;q++){let j=q*F-V;for(let yt=0;yt<k;yt++){let Tt=yt*P-B;U[_]=Tt*S,U[m]=j*A,U[g]=I,c.push(U.x,U.y,U.z),U[_]=0,U[m]=0,U[g]=T>0?1:-1,u.push(U.x,U.y,U.z),d.push(yt/C),d.push(1-q/y),J+=1}}for(let q=0;q<y;q++)for(let j=0;j<C;j++){let yt=h+j+k*q,Tt=h+j+k*(q+1),pe=h+(j+1)+k*(q+1),qt=h+(j+1)+k*q;l.push(yt,Tt,qt),l.push(Tt,pe,qt),et+=6}a.addGroup(f,et,w),f+=et,h+=J}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new n(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}};var pr=class n extends Ge{constructor(t=1,e=1,i=1,s=32,r=1,o=!1,a=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:i,radialSegments:s,heightSegments:r,openEnded:o,thetaStart:a,thetaLength:l};let c=this;s=Math.floor(s),r=Math.floor(r);let u=[],d=[],h=[],f=[],p=0,_=[],m=i/2,g=0;S(),o===!1&&(t>0&&A(!0),e>0&&A(!1)),this.setIndex(u),this.setAttribute("position",new Pe(d,3)),this.setAttribute("normal",new Pe(h,3)),this.setAttribute("uv",new Pe(f,2));function S(){let v=new L,b=new L,T=0,C=(e-t)/i;for(let y=0;y<=r;y++){let w=[],P=y/r,F=P*(e-t)+t;for(let B=0;B<=s;B++){let V=B/s,I=V*l+a,k=Math.sin(I),W=Math.cos(I);b.x=F*k,b.y=-P*i+m,b.z=F*W,d.push(b.x,b.y,b.z),v.set(k,C,W).normalize(),h.push(v.x,v.y,v.z),f.push(V,1-P),w.push(p++)}_.push(w)}for(let y=0;y<s;y++)for(let w=0;w<r;w++){let P=_[w][y],F=_[w+1][y],B=_[w+1][y+1],V=_[w][y+1];(t>0||w!==0)&&(u.push(P,F,V),T+=3),(e>0||w!==r-1)&&(u.push(F,B,V),T+=3)}c.addGroup(g,T,0),g+=T}function A(v){let b=p,T=new Zt,C=new L,y=0,w=v===!0?t:e,P=v===!0?1:-1;for(let B=1;B<=s;B++)d.push(0,m*P,0),h.push(0,P,0),f.push(.5,.5),p++;let F=p;for(let B=0;B<=s;B++){let I=B/s*l+a,k=Math.cos(I),W=Math.sin(I);C.x=w*W,C.y=m*P,C.z=w*k,d.push(C.x,C.y,C.z),h.push(0,P,0),T.x=k*.5+.5,T.y=W*.5*P+.5,f.push(T.x,T.y),p++}for(let B=0;B<s;B++){let V=b+B,I=F+B;v===!0?u.push(I,I+1,V):u.push(I+1,I,V),y+=3}c.addGroup(g,y,v===!0?1:2),g+=y}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new n(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}},ts=class n extends pr{constructor(t=1,e=1,i=32,s=1,r=!1,o=0,a=Math.PI*2){super(0,t,e,i,s,r,o,a),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:i,heightSegments:s,openEnded:r,thetaStart:o,thetaLength:a}}static fromJSON(t){return new n(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}};var xa=new L,ya=new L,eh=new L,va=new Li,oo=class extends Ge{constructor(t=null,e=1){if(super(),this.type="EdgesGeometry",this.parameters={geometry:t,thresholdAngle:e},t!==null){let s=Math.pow(10,4),r=Math.cos(ir*e),o=t.getIndex(),a=t.getAttribute("position"),l=o?o.count:a.count,c=[0,0,0],u=["a","b","c"],d=new Array(3),h={},f=[];for(let p=0;p<l;p+=3){o?(c[0]=o.getX(p),c[1]=o.getX(p+1),c[2]=o.getX(p+2)):(c[0]=p,c[1]=p+1,c[2]=p+2);let{a:_,b:m,c:g}=va;if(_.fromBufferAttribute(a,c[0]),m.fromBufferAttribute(a,c[1]),g.fromBufferAttribute(a,c[2]),va.getNormal(eh),d[0]=`${Math.round(_.x*s)},${Math.round(_.y*s)},${Math.round(_.z*s)}`,d[1]=`${Math.round(m.x*s)},${Math.round(m.y*s)},${Math.round(m.z*s)}`,d[2]=`${Math.round(g.x*s)},${Math.round(g.y*s)},${Math.round(g.z*s)}`,!(d[0]===d[1]||d[1]===d[2]||d[2]===d[0]))for(let S=0;S<3;S++){let A=(S+1)%3,v=d[S],b=d[A],T=va[u[S]],C=va[u[A]],y=`${v}_${b}`,w=`${b}_${v}`;w in h&&h[w]?(eh.dot(h[w].normal)<=r&&(f.push(T.x,T.y,T.z),f.push(C.x,C.y,C.z)),h[w]=null):y in h||(h[y]={index0:c[S],index1:c[A],normal:eh.clone()})}}for(let p in h)if(h[p]){let{index0:_,index1:m}=h[p];xa.fromBufferAttribute(a,_),ya.fromBufferAttribute(a,m),f.push(xa.x,xa.y,xa.z),f.push(ya.x,ya.y,ya.z)}this.setAttribute("position",new Pe(f,3))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}};var pn=class n extends Ge{constructor(t=1,e=1,i=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:i,heightSegments:s};let r=t/2,o=e/2,a=Math.floor(i),l=Math.floor(s),c=a+1,u=l+1,d=t/a,h=e/l,f=[],p=[],_=[],m=[];for(let g=0;g<u;g++){let S=g*h-o;for(let A=0;A<c;A++){let v=A*d-r;p.push(v,-S,0),_.push(0,0,1),m.push(A/a),m.push(1-g/l)}}for(let g=0;g<l;g++)for(let S=0;S<a;S++){let A=S+c*g,v=S+c*(g+1),b=S+1+c*(g+1),T=S+1+c*g;f.push(A,v,T),f.push(v,b,T)}this.setIndex(f),this.setAttribute("position",new Pe(p,3)),this.setAttribute("normal",new Pe(_,3)),this.setAttribute("uv",new Pe(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new n(t.width,t.height,t.widthSegments,t.heightSegments)}};var mn=class n extends Ge{constructor(t=1,e=32,i=16,s=0,r=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:i,phiStart:s,phiLength:r,thetaStart:o,thetaLength:a},e=Math.max(3,Math.floor(e)),i=Math.max(2,Math.floor(i));let l=Math.min(o+a,Math.PI),c=0,u=[],d=new L,h=new L,f=[],p=[],_=[],m=[];for(let g=0;g<=i;g++){let S=[],A=g/i,v=o+A*a,b=t*Math.cos(v),T=Math.sqrt(t*t-b*b),C=0;g===0&&o===0?C=.5/e:g===i&&l===Math.PI&&(C=-.5/e);for(let y=0;y<=e;y++){let w=y/e,P=s+w*r;d.x=-T*Math.cos(P),d.y=b,d.z=T*Math.sin(P),p.push(d.x,d.y,d.z),h.copy(d).normalize(),_.push(h.x,h.y,h.z),m.push(w+C,1-A),S.push(c++)}u.push(S)}for(let g=0;g<i;g++)for(let S=0;S<e;S++){let A=u[g][S+1],v=u[g][S],b=u[g+1][S],T=u[g+1][S+1];(g!==0||o>0)&&f.push(A,v,T),(g!==i-1||l<Math.PI)&&f.push(v,b,T)}this.setIndex(f),this.setAttribute("position",new Pe(p,3)),this.setAttribute("normal",new Pe(_,3)),this.setAttribute("uv",new Pe(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new n(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}};var mr=class n extends Ge{constructor(t=1,e=.4,i=12,s=48,r=Math.PI*2,o=0,a=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:i,tubularSegments:s,arc:r,thetaStart:o,thetaLength:a},i=Math.floor(i),s=Math.floor(s);let l=[],c=[],u=[],d=[],h=new L,f=new L,p=new L;for(let _=0;_<=i;_++){let m=o+_/i*a;for(let g=0;g<=s;g++){let S=g/s*r;f.x=(t+e*Math.cos(m))*Math.cos(S),f.y=(t+e*Math.cos(m))*Math.sin(S),f.z=e*Math.sin(m),c.push(f.x,f.y,f.z),h.x=t*Math.cos(S),h.y=t*Math.sin(S),p.subVectors(f,h).normalize(),u.push(p.x,p.y,p.z),d.push(g/s),d.push(_/i)}}for(let _=1;_<=i;_++)for(let m=1;m<=s;m++){let g=(s+1)*_+m-1,S=(s+1)*(_-1)+m-1,A=(s+1)*(_-1)+m,v=(s+1)*_+m;l.push(g,S,v),l.push(S,A,v)}this.setIndex(l),this.setAttribute("position",new Pe(c,3)),this.setAttribute("normal",new Pe(u,3)),this.setAttribute("uv",new Pe(d,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new n(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc,t.thetaStart,t.thetaLength)}};var Oi=class extends Ge{constructor(t=null){if(super(),this.type="WireframeGeometry",this.parameters={geometry:t},t!==null){let e=[],i=new Set,s=new L,r=new L;if(t.index!==null){let o=t.attributes.position,a=t.index,l=t.groups;l.length===0&&(l=[{start:0,count:a.count,materialIndex:0}]);for(let c=0,u=l.length;c<u;++c){let d=l[c],h=d.start,f=d.count;for(let p=h,_=h+f;p<_;p+=3)for(let m=0;m<3;m++){let g=a.getX(p+m),S=a.getX(p+(m+1)%3);s.fromBufferAttribute(o,g),r.fromBufferAttribute(o,S),Pd(s,r,i)===!0&&(e.push(s.x,s.y,s.z),e.push(r.x,r.y,r.z))}}}else{let o=t.attributes.position;for(let a=0,l=o.count/3;a<l;a++)for(let c=0;c<3;c++){let u=3*a+c,d=3*a+(c+1)%3;s.fromBufferAttribute(o,u),r.fromBufferAttribute(o,d),Pd(s,r,i)===!0&&(e.push(s.x,s.y,s.z),e.push(r.x,r.y,r.z))}}this.setAttribute("position",new Pe(e,3))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}};function Pd(n,t,e){let i=`${n.x},${n.y},${n.z}-${t.x},${t.y},${t.z}`,s=`${t.x},${t.y},${t.z}-${n.x},${n.y},${n.z}`;return e.has(i)===!0||e.has(s)===!0?!1:(e.add(i),e.add(s),!0)}function Ps(n){let t={};for(let e in n){t[e]={};for(let i in n[e]){let s=n[e][i];if(Id(s))s.isRenderTargetTexture?(Gt("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][i]=null):t[e][i]=s.clone();else if(Array.isArray(s))if(Id(s[0])){let r=[];for(let o=0,a=s.length;o<a;o++)r[o]=s[o].clone();t[e][i]=r}else t[e][i]=s.slice();else t[e][i]=s}}return t}function on(n){let t={};for(let e=0;e<n.length;e++){let i=Ps(n[e]);for(let s in i)t[s]=i[s]}return t}function Id(n){return n&&(n.isColor||n.isMatrix3||n.isMatrix4||n.isVector2||n.isVector3||n.isVector4||n.isTexture||n.isQuaternion)}function Nm(n){let t=[];for(let e=0;e<n.length;e++)t.push(n[e].clone());return t}function Oh(n){let t=n.getRenderTarget();return t===null?n.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:ge.workingColorSpace}var Tf={clone:Ps,merge:on},Um=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Fm=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,Un=class extends Fi{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Um,this.fragmentShader=Fm,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=Ps(t.uniforms),this.uniformsGroups=Nm(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this.defaultAttributeValues=Object.assign({},t.defaultAttributeValues),this.index0AttributeName=t.index0AttributeName,this.uniformsNeedUpdate=t.uniformsNeedUpdate,this}toJSON(t){let e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(let s in this.uniforms){let o=this.uniforms[s].value;o&&o.isTexture?e.uniforms[s]={type:"t",value:o.toJSON(t).uuid}:o&&o.isColor?e.uniforms[s]={type:"c",value:o.getHex()}:o&&o.isVector2?e.uniforms[s]={type:"v2",value:o.toArray()}:o&&o.isVector3?e.uniforms[s]={type:"v3",value:o.toArray()}:o&&o.isVector4?e.uniforms[s]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?e.uniforms[s]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?e.uniforms[s]={type:"m4",value:o.toArray()}:e.uniforms[s]={value:o}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;let i={};for(let s in this.extensions)this.extensions[s]===!0&&(i[s]=!0);return Object.keys(i).length>0&&(e.extensions=i),e}fromJSON(t,e){if(super.fromJSON(t,e),t.uniforms!==void 0)for(let i in t.uniforms){let s=t.uniforms[i];switch(this.uniforms[i]={},s.type){case"t":this.uniforms[i].value=e[s.value]||null;break;case"c":this.uniforms[i].value=new ae().setHex(s.value);break;case"v2":this.uniforms[i].value=new Zt().fromArray(s.value);break;case"v3":this.uniforms[i].value=new L().fromArray(s.value);break;case"v4":this.uniforms[i].value=new Ne().fromArray(s.value);break;case"m3":this.uniforms[i].value=new Qt().fromArray(s.value);break;case"m4":this.uniforms[i].value=new De().fromArray(s.value);break;default:this.uniforms[i].value=s.value}}if(t.defines!==void 0&&(this.defines=t.defines),t.vertexShader!==void 0&&(this.vertexShader=t.vertexShader),t.fragmentShader!==void 0&&(this.fragmentShader=t.fragmentShader),t.glslVersion!==void 0&&(this.glslVersion=t.glslVersion),t.extensions!==void 0)for(let i in t.extensions)this.extensions[i]=t.extensions[i];return t.lights!==void 0&&(this.lights=t.lights),t.clipping!==void 0&&(this.clipping=t.clipping),this}},Ga=class extends Un{constructor(t){super(t),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}},Wa=class extends Fi{constructor(t){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new ae(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new ae(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=ql,this.normalScale=new Zt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Ui,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}},ao=class extends Wa{constructor(t){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new Zt(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return fe(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(e){this.ior=(1+.4*e)/(1-.4*e)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new ae(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new ae(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new ae(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._retroreflectivity=0,this._sheen=0,this._transmission=0,this.setValues(t)}get anisotropy(){return this._anisotropy}set anisotropy(t){this._anisotropy>0!=t>0&&this.version++,this._anisotropy=t}get clearcoat(){return this._clearcoat}set clearcoat(t){this._clearcoat>0!=t>0&&this.version++,this._clearcoat=t}get iridescence(){return this._iridescence}set iridescence(t){this._iridescence>0!=t>0&&this.version++,this._iridescence=t}get dispersion(){return this._dispersion}set dispersion(t){this._dispersion>0!=t>0&&this.version++,this._dispersion=t}get retroreflectivity(){return this._retroreflectivity}set retroreflectivity(t){this._retroreflectivity>0!=t>0&&this.version++,this._retroreflectivity=t}get sheen(){return this._sheen}set sheen(t){this._sheen>0!=t>0&&this.version++,this._sheen=t}get transmission(){return this._transmission}set transmission(t){this._transmission>0!=t>0&&this.version++,this._transmission=t}copy(t){return super.copy(t),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=t.anisotropy,this.anisotropyRotation=t.anisotropyRotation,this.anisotropyMap=t.anisotropyMap,this.clearcoat=t.clearcoat,this.clearcoatMap=t.clearcoatMap,this.clearcoatRoughness=t.clearcoatRoughness,this.clearcoatRoughnessMap=t.clearcoatRoughnessMap,this.clearcoatNormalMap=t.clearcoatNormalMap,this.clearcoatNormalScale.copy(t.clearcoatNormalScale),this.dispersion=t.dispersion,this.ior=t.ior,this.iridescence=t.iridescence,this.iridescenceMap=t.iridescenceMap,this.iridescenceIOR=t.iridescenceIOR,this.iridescenceThicknessRange=[...t.iridescenceThicknessRange],this.iridescenceThicknessMap=t.iridescenceThicknessMap,this.retroreflectivity=t.retroreflectivity,this.sheen=t.sheen,this.sheenColor.copy(t.sheenColor),this.sheenColorMap=t.sheenColorMap,this.sheenRoughness=t.sheenRoughness,this.sheenRoughnessMap=t.sheenRoughnessMap,this.transmission=t.transmission,this.transmissionMap=t.transmissionMap,this.thickness=t.thickness,this.thicknessMap=t.thicknessMap,this.attenuationDistance=t.attenuationDistance,this.attenuationColor.copy(t.attenuationColor),this.specularIntensity=t.specularIntensity,this.specularIntensityMap=t.specularIntensityMap,this.specularColor.copy(t.specularColor),this.specularColorMap=t.specularColorMap,this}};var Xa=class extends Fi{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=cf,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}},qa=class extends Fi{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}};var lo=class extends Tn{constructor(t){super(),this.isLineDashedMaterial=!0,this.type="LineDashedMaterial",this.scale=1,this.dashSize=3,this.gapSize=1,this.setValues(t)}copy(t){return super.copy(t),this.scale=t.scale,this.dashSize=t.dashSize,this.gapSize=t.gapSize,this}};function Qs(n,t){return!n||n.constructor===t?n:typeof t.BYTES_PER_ELEMENT=="number"?new t(n):Array.prototype.slice.call(n)}function nh(n){return n!==void 0&&n.inTangents!==void 0&&n.outTangents!==void 0}var es=class{constructor(t,e,i,s){this.parameterPositions=t,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new e.constructor(i),this.sampleValues=e,this.valueSize=i,this.settings=null,this.DefaultSettings_={}}evaluate(t){let e=this.parameterPositions,i=this._cachedIndex,s=e[i],r=e[i-1];t:{e:{let o;n:{i:if(!(t<s)){for(let a=i+2;;){if(s===void 0){if(t<r)break i;return i=e.length,this._cachedIndex=i,this.copySampleValue_(i-1)}if(i===a)break;if(r=s,s=e[++i],t<s)break e}o=e.length;break n}if(!(t>=r)){let a=e[1];t<a&&(i=2,r=a);for(let l=i-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(i===l)break;if(s=r,r=e[--i-1],t>=r)break e}o=i,i=0;break n}break t}for(;i<o;){let a=i+o>>>1;t<e[a]?o=a:i=a+1}if(s=e[i],r=e[i-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return i=e.length,this._cachedIndex=i,this.copySampleValue_(i-1)}this._cachedIndex=i,this.intervalChanged_(i,r,s)}return this.interpolate_(i,r,t,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(t){let e=this.resultBuffer,i=this.sampleValues,s=this.valueSize,r=t*s;for(let o=0;o!==s;++o)e[o]=i[r+o];return e}interpolate_(){throw new Error("THREE.Interpolant: Call to abstract method.")}intervalChanged_(){}},Ya=class extends es{constructor(t,e,i,s){super(t,e,i,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:oh,endingEnd:oh}}intervalChanged_(t,e,i){let s=this.parameterPositions,r=t-2,o=t+1,a=s[r],l=s[o];if(a===void 0)switch(this.getSettings_().endingStart){case ah:r=t,a=2*e-i;break;case lh:r=s.length-2,a=e+s[r]-s[r+1];break;default:r=t,a=i}if(l===void 0)switch(this.getSettings_().endingEnd){case ah:o=t,l=2*i-e;break;case lh:o=1,l=i+s[1]-s[0];break;default:o=t-1,l=e}let c=(i-e)*.5,u=this.valueSize;this._weightPrev=c/(e-a),this._weightNext=c/(l-i),this._offsetPrev=r*u,this._offsetNext=o*u}interpolate_(t,e,i,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=t*a,c=l-a,u=this._offsetPrev,d=this._offsetNext,h=this._weightPrev,f=this._weightNext,p=(i-e)/(s-e),_=p*p,m=_*p,g=-h*m+2*h*_-h*p,S=(1+h)*m+(-1.5-2*h)*_+(-.5+h)*p+1,A=(-1-f)*m+(1.5+f)*_+.5*p,v=f*m-f*_;for(let b=0;b!==a;++b)r[b]=g*o[u+b]+S*o[c+b]+A*o[l+b]+v*o[d+b];return r}},Za=class extends es{constructor(t,e,i,s){super(t,e,i,s)}interpolate_(t,e,i,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=t*a,c=l-a,u=(i-e)/(s-e),d=1-u;for(let h=0;h!==a;++h)r[h]=o[c+h]*d+o[l+h]*u;return r}},Ja=class extends es{constructor(t,e,i,s){super(t,e,i,s)}interpolate_(t){return this.copySampleValue_(t-1)}},$a=class extends es{interpolate_(t,e,i,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=t*a,c=l-a,u=this.inTangents,d=this.outTangents;if(!u||!d){let p=(i-e)/(s-e),_=1-p;for(let m=0;m!==a;++m)r[m]=o[c+m]*_+o[l+m]*p;return r}let h=a*2,f=t-1;for(let p=0;p!==a;++p){let _=o[c+p],m=o[l+p],g=f*h+p*2,S=d[g],A=d[g+1],v=t*h+p*2,b=u[v],T=u[v+1],C=Bm(i,e,S,b,s);r[p]=Ef(C,_,A,T,m)}return r}};function Ef(n,t,e,i,s){let r=1-n;return r*r*r*t+3*r*r*n*e+3*r*n*n*i+n*n*n*s}function Om(n,t,e,i,s){let r=1-n;return 3*r*r*(e-t)+6*r*n*(i-e)+3*n*n*(s-i)}function Bm(n,t,e,i,s){let r=(n-t)/(s-t);for(let o=0;o<8;o++){let a=Ef(r,t,e,i,s)-n;if(Math.abs(a)<1e-10)break;let l=Om(r,t,e,i,s);if(Math.abs(l)<1e-10)break;r=Math.max(0,Math.min(1,r-a/l))}return r}var Fn=class{constructor(t,e,i,s){if(t===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(e===void 0||e.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+t);this.name=t,this.times=Qs(e,this.TimeBufferType),this.values=Qs(i,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(t){let e=t.constructor,i;if(e.toJSON!==this.toJSON)i=e.toJSON(t);else{i={name:t.name,times:Qs(t.times,Array),values:Qs(t.values,Array)};let s=t.getInterpolation();s!==t.DefaultInterpolation&&(i.interpolation=s),nh(t.settings)&&(i.settings={inTangents:Qs(t.settings.inTangents,Array),outTangents:Qs(t.settings.outTangents,Array)})}return i.type=t.ValueTypeName,i}InterpolantFactoryMethodDiscrete(t){return new Ja(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodLinear(t){return new Za(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodSmooth(t){return new Ya(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodBezier(t){let e=new $a(this.times,this.values,this.getValueSize(),t);return this.settings&&(e.inTangents=this.settings.inTangents,e.outTangents=this.settings.outTangents),e}setInterpolation(t){let e;switch(t){case Jr:e=this.InterpolantFactoryMethodDiscrete;break;case Ua:e=this.InterpolantFactoryMethodLinear;break;case Ta:e=this.InterpolantFactoryMethodSmooth;break;case rh:e=this.InterpolantFactoryMethodBezier;break}if(e===void 0){let i="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(t!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(i);return Gt("KeyframeTrack:",i),this}return this.createInterpolant=e,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Jr;case this.InterpolantFactoryMethodLinear:return Ua;case this.InterpolantFactoryMethodSmooth:return Ta;case this.InterpolantFactoryMethodBezier:return rh}}getValueSize(){return this.values.length/this.times.length}shift(t){if(t!==0){let e=this.times;for(let i=0,s=e.length;i!==s;++i)e[i]+=t}return this}scale(t){if(t!==1){let e=this.times;for(let i=0,s=e.length;i!==s;++i)e[i]*=t;nh(this.settings)&&(Ld(this.settings.inTangents,t),Ld(this.settings.outTangents,t))}return this}trim(t,e){let i=this.times,s=i.length,r=0,o=s-1;for(;r!==s&&i[r]<t;)++r;for(;o!==-1&&i[o]>e;)--o;if(++o,r!==0||o!==s){r>=o&&(o=Math.max(o,1),r=o-1);let a=this.getValueSize();this.times=i.slice(r,o),this.values=this.values.slice(r*a,o*a)}return this}validate(){let t=!0,e=this.getValueSize();e-Math.floor(e)!==0&&(Jt("KeyframeTrack: Invalid value size in track.",this),t=!1);let i=this.times,s=this.values,r=i.length;r===0&&(Jt("KeyframeTrack: Track is empty.",this),t=!1);let o=null;for(let a=0;a!==r;a++){let l=i[a];if(typeof l=="number"&&isNaN(l)){Jt("KeyframeTrack: Time is not a valid number.",this,a,l),t=!1;break}if(o!==null&&o>l){Jt("KeyframeTrack: Out of order keys.",this,a,l,o),t=!1;break}o=l}if(s!==void 0&&Qp(s))for(let a=0,l=s.length;a!==l;++a){let c=s[a];if(isNaN(c)){Jt("KeyframeTrack: Value is not a valid number.",this,a,c),t=!1;break}}return t}optimize(){let t=this.times.slice(),e=this.values.slice(),i=this.getValueSize(),s=this.getInterpolation()===Ta,r=t.length-1,o=1;for(let a=1;a<r;++a){let l=!1,c=t[a],u=t[a+1];if(c!==u&&(a!==1||c!==t[0]))if(s)l=!0;else{let d=a*i,h=d-i,f=d+i;for(let p=0;p!==i;++p){let _=e[d+p];if(_!==e[h+p]||_!==e[f+p]){l=!0;break}}}if(l){if(a!==o){t[o]=t[a];let d=a*i,h=o*i;for(let f=0;f!==i;++f)e[h+f]=e[d+f]}++o}}if(r>0){t[o]=t[r];for(let a=r*i,l=o*i,c=0;c!==i;++c)e[l+c]=e[a+c];++o}return o!==t.length?(this.times=t.slice(0,o),this.values=e.slice(0,o*i)):(this.times=t,this.values=e),this}clone(){let t=this.times.slice(),e=this.values.slice(),i=this.constructor,s=new i(this.name,t,e);return s.createInterpolant=this.createInterpolant,nh(this.settings)&&(s.settings={inTangents:this.settings.inTangents.slice(),outTangents:this.settings.outTangents.slice()}),s}};function Ld(n,t){for(let e=0,i=n.length;e!==i;e+=2)n[e]*=t}Fn.prototype.ValueTypeName="";Fn.prototype.TimeBufferType=Float32Array;Fn.prototype.ValueBufferType=Float32Array;Fn.prototype.DefaultInterpolation=Ua;var ns=class extends Fn{constructor(t,e,i){super(t,e,i)}};ns.prototype.ValueTypeName="bool";ns.prototype.ValueBufferType=Array;ns.prototype.DefaultInterpolation=Jr;ns.prototype.InterpolantFactoryMethodLinear=void 0;ns.prototype.InterpolantFactoryMethodSmooth=void 0;var Ka=class extends Fn{constructor(t,e,i,s){super(t,e,i,s)}};Ka.prototype.ValueTypeName="color";var ja=class extends Fn{constructor(t,e,i,s){super(t,e,i,s)}};ja.prototype.ValueTypeName="number";var Qa=class extends es{constructor(t,e,i,s){super(t,e,i,s)}interpolate_(t,e,i,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=(i-e)/(s-e),c=t*a;for(let u=c+a;c!==u;c+=4)Nn.slerpFlat(r,0,o,c-a,o,c,l);return r}},co=class extends Fn{constructor(t,e,i,s){super(t,e,i,s)}InterpolantFactoryMethodLinear(t){return new Qa(this.times,this.values,this.getValueSize(),t)}};co.prototype.ValueTypeName="quaternion";co.prototype.InterpolantFactoryMethodSmooth=void 0;var is=class extends Fn{constructor(t,e,i){super(t,e,i)}};is.prototype.ValueTypeName="string";is.prototype.ValueBufferType=Array;is.prototype.DefaultInterpolation=Jr;is.prototype.InterpolantFactoryMethodLinear=void 0;is.prototype.InterpolantFactoryMethodSmooth=void 0;var tl=class extends Fn{constructor(t,e,i,s){super(t,e,i,s)}};tl.prototype.ValueTypeName="vector";var el=class{constructor(t,e,i){let s=this,r=!1,o=0,a=0,l,c=[];this.onStart=void 0,this.onLoad=t,this.onProgress=e,this.onError=i,this._abortController=null,this.itemStart=function(u){a++,r===!1&&s.onStart!==void 0&&s.onStart(u,o,a),r=!0},this.itemEnd=function(u){o++,s.onProgress!==void 0&&s.onProgress(u,o,a),o===a&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(u){s.onError!==void 0&&s.onError(u)},this.resolveURL=function(u){return u=u.normalize("NFC"),l?l(u):u},this.setURLModifier=function(u){return l=u,this},this.addHandler=function(u,d){return c.push(u,d),this},this.removeHandler=function(u){let d=c.indexOf(u);return d!==-1&&c.splice(d,2),this},this.getHandler=function(u){for(let d=0,h=c.length;d<h;d+=2){let f=c[d],p=c[d+1];if(f.global&&(f.lastIndex=0),f.test(u))return p}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||(this._abortController=new AbortController),this._abortController}},wf=new el,nl=class{constructor(t){this.manager=t!==void 0?t:wf,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}load(){}loadAsync(t,e){let i=this;return new Promise(function(s,r){i.load(t,s,e,r)})}parse(){}setCrossOrigin(t){return this.crossOrigin=t,this}setWithCredentials(t){return this.withCredentials=t,this}setPath(t){return this.path=t,this}setResourcePath(t){return this.resourcePath=t,this}setRequestHeader(t){return this.requestHeader=t,this}abort(){return this}};nl.DEFAULT_MATERIAL_NAME="__DEFAULT";var ho=class extends Ke{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new ae(t),this.intensity=e}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){let e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,e}},uo=class extends ho{constructor(t,e,i){super(t,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Ke.DEFAULT_UP),this.updateMatrix(),this.groundColor=new ae(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}toJSON(t){let e=super.toJSON(t);return e.object.groundColor=this.groundColor.getHex(),e}},ih=new De,Dd=new L,Nd=new L,il=class{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Zt(512,512),this.mapType=En,this.map=null,this.mapPass=null,this.matrix=new De,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new dr,this._frameExtents=new Zt(1,1),this._viewportCount=1,this._viewports=[new Ne(0,0,1,1)]}getViewportCount(){return this._viewportCount}getCamera(){return this.camera}getFrustum(){return this._frustum}updateMatrices(t){let e=this.camera;Dd.setFromMatrixPosition(t.matrixWorld),e.position.copy(Dd),Nd.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(Nd),e.updateMatrixWorld(),this._updateMatrix(e,this.matrix,this._frustum)}_updateMatrix(t,e,i,s){ih.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),i.setFromProjectionMatrix(ih,t.coordinateSystem,t.reversedDepth);let r=this._frameExtents,o=s?s.z/r.x:1,a=s?s.w/r.y:1,l=s?s.x/r.x:0,c=s?s.y/r.y:0;t.coordinateSystem===or||t.reversedDepth?e.set(.5*o,0,0,.5*o+l,0,.5*a,0,.5*a+c,0,0,1,0,0,0,0,1):e.set(.5*o,0,0,.5*o+l,0,.5*a,0,.5*a+c,0,0,.5,.5,0,0,0,1),e.multiply(ih)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.autoUpdate=t.autoUpdate,this.needsUpdate=t.needsUpdate,this.normalBias=t.normalBias,this.blurSamples=t.blurSamples,this.mapSize.copy(t.mapSize),this.biasNode=t.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){let t={};return t.intensity=this.intensity,t.bias=this.bias,t.normalBias=this.normalBias,t.radius=this.radius,t.blurSamples=this.blurSamples,t.mapSize=this.mapSize.toArray(),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}},Ma=new L,Sa=new Nn,pi=new L,fo=class extends Ke{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new De,this.projectionMatrix=new De,this.projectionMatrixInverse=new De,this.coordinateSystem=jn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorld.decompose(Ma,Sa,pi),pi.x===1&&pi.y===1&&pi.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Ma,Sa,pi.set(1,1,1)).invert()}updateWorldMatrix(t,e,i=!1){super.updateWorldMatrix(t,e,i),this.matrixWorld.decompose(Ma,Sa,pi),pi.x===1&&pi.y===1&&pi.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Ma,Sa,pi.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}},Ki=new L,Ud=new Zt,Fd=new Zt,rn=class extends fo{constructor(t=50,e=1,i=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=i,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){let e=.5*this.getFilmHeight()/t;this.fov=lr*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){let t=Math.tan(ir*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return lr*2*Math.atan(Math.tan(ir*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,i){Ki.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(Ki.x,Ki.y).multiplyScalar(-t/Ki.z),Ki.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(Ki.x,Ki.y).multiplyScalar(-t/Ki.z)}getViewSize(t,e){return this.getViewBounds(t,Ud,Fd),e.subVectors(Fd,Ud)}setViewOffset(t,e,i,s,r,o){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=this.near,e=t*Math.tan(ir*.5*this.fov)/this.zoom,i=2*e,s=this.aspect*i,r=-.5*s,o=this.view;if(this.view!==null&&this.view.enabled){let l=o.fullWidth,c=o.fullHeight;r+=o.offsetX*s/l,e-=o.offsetY*i/c,s*=o.width/l,i*=o.height/c}let a=this.filmOffset;a!==0&&(r+=t*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,e,e-i,t,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}};var gr=class extends fo{constructor(t=-1,e=1,i=1,s=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=i,this.bottom=s,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,i,s,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,s=(this.top+this.bottom)/2,r=i-t,o=i+t,a=s+e,l=s-e;if(this.view!==null&&this.view.enabled){let c=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,o=r+c*this.view.width,a-=u*this.view.offsetY,l=a-u*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}},ch=class extends il{constructor(){super(new gr(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},_r=class extends ho{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Ke.DEFAULT_UP),this.updateMatrix(),this.target=new Ke,this.shadow=new ch}dispose(){super.dispose(),this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}toJSON(t){let e=super.toJSON(t);return e.object.shadow=this.shadow.toJSON(),e.object.target=this.target.uuid,e}};var tr=-90,er=1,sl=class extends Ke{constructor(t,e,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;let s=new rn(tr,er,t,e);s.layers=this.layers,this.add(s);let r=new rn(tr,er,t,e);r.layers=this.layers,this.add(r);let o=new rn(tr,er,t,e);o.layers=this.layers,this.add(o);let a=new rn(tr,er,t,e);a.layers=this.layers,this.add(a);let l=new rn(tr,er,t,e);l.layers=this.layers,this.add(l);let c=new rn(tr,er,t,e);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let t=this.coordinateSystem,e=this.children.concat(),[i,s,r,o,a,l]=e;for(let c of e)this.remove(c);if(t===jn)i.up.set(0,1,0),i.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===or)i.up.set(0,-1,0),i.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(let c of e)this.add(c),c.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();let{renderTarget:i,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());let[r,o,a,l,c,u]=this.children,d=t.getRenderTarget(),h=t.getActiveCubeFace(),f=t.getActiveMipmapLevel(),p=t.xr.enabled;t.xr.enabled=!1;let _=i.texture.generateMipmaps;i.texture.generateMipmaps=!1;let m=!1;t.isWebGLRenderer===!0?m=t.state.buffers.depth.getReversed():m=t.reversedDepthBuffer,t.setRenderTarget(i,0,s),m&&t.autoClear===!1&&t.clearDepth(),t.render(e,r),t.setRenderTarget(i,1,s),m&&t.autoClear===!1&&t.clearDepth(),t.render(e,o),t.setRenderTarget(i,2,s),m&&t.autoClear===!1&&t.clearDepth(),t.render(e,a),t.setRenderTarget(i,3,s),m&&t.autoClear===!1&&t.clearDepth(),t.render(e,l),t.setRenderTarget(i,4,s),m&&t.autoClear===!1&&t.clearDepth(),t.render(e,c),i.texture.generateMipmaps=_,t.setRenderTarget(i,5,s),m&&t.autoClear===!1&&t.clearDepth(),t.render(e,u),t.setRenderTarget(d,h,f),t.xr.enabled=p,i.texture.needsPMREMUpdate=!0}},rl=class extends rn{constructor(t=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=t}};var Bh="\\[\\]\\.:\\/",km=new RegExp("["+Bh+"]","g"),kh="[^"+Bh+"]",zm="[^"+Bh.replace("\\.","")+"]",Vm=/((?:WC+[\/:])*)/.source.replace("WC",kh),Hm=/(WCOD+)?/.source.replace("WCOD",zm),Gm=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",kh),Wm=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",kh),Xm=new RegExp("^"+Vm+Hm+Gm+Wm+"$"),qm=["material","materials","bones","map"],hh=class{constructor(t,e,i){let s=i||Le.parseTrackName(e);this._targetGroup=t,this._bindings=t.subscribe_(e,s)}getValue(t,e){this.bind();let i=this._targetGroup.nCachedObjects_,s=this._bindings[i];s!==void 0&&s.getValue(t,e)}setValue(t,e){let i=this._bindings;for(let s=this._targetGroup.nCachedObjects_,r=i.length;s!==r;++s)i[s].setValue(t,e)}bind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,i=t.length;e!==i;++e)t[e].bind()}unbind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,i=t.length;e!==i;++e)t[e].unbind()}},Le=class n{constructor(t,e,i){this.path=e,this.parsedPath=i||n.parseTrackName(e),this.node=n.findNode(t,this.parsedPath.nodeName),this.rootNode=t,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(t,e,i){return t&&t.isAnimationObjectGroup?new n.Composite(t,e,i):new n(t,e,i)}static sanitizeNodeName(t){return t.replace(/\s/g,"_").replace(km,"")}static parseTrackName(t){let e=Xm.exec(t);if(e===null)throw new Error("THREE.PropertyBinding: Cannot parse trackName: "+t);let i={nodeName:e[2],objectName:e[3],objectIndex:e[4],propertyName:e[5],propertyIndex:e[6]},s=i.nodeName&&i.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){let r=i.nodeName.substring(s+1);qm.indexOf(r)!==-1&&(i.nodeName=i.nodeName.substring(0,s),i.objectName=r)}if(i.propertyName===null||i.propertyName.length===0)throw new Error("THREE.PropertyBinding: can not parse propertyName from trackName: "+t);return i}static findNode(t,e){if(e===void 0||e===""||e==="."||e===-1||e===t.name||e===t.uuid)return t;if(t.skeleton){let i=t.skeleton.getBoneByName(e);if(i!==void 0)return i}if(t.children){let i=function(r){for(let o=0;o<r.length;o++){let a=r[o];if(a.name===e||a.uuid===e)return a;let l=i(a.children);if(l)return l}return null},s=i(t.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(t,e){t[e]=this.targetObject[this.propertyName]}_getValue_array(t,e){let i=this.resolvedProperty;for(let s=0,r=i.length;s!==r;++s)t[e++]=i[s]}_getValue_arrayElement(t,e){t[e]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(t,e){this.resolvedProperty.toArray(t,e)}_setValue_direct(t,e){this.targetObject[this.propertyName]=t[e]}_setValue_direct_setNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(t,e){let i=this.resolvedProperty;for(let s=0,r=i.length;s!==r;++s)i[s]=t[e++]}_setValue_array_setNeedsUpdate(t,e){let i=this.resolvedProperty;for(let s=0,r=i.length;s!==r;++s)i[s]=t[e++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(t,e){let i=this.resolvedProperty;for(let s=0,r=i.length;s!==r;++s)i[s]=t[e++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(t,e){this.resolvedProperty[this.propertyIndex]=t[e]}_setValue_arrayElement_setNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(t,e){this.resolvedProperty.fromArray(t,e)}_setValue_fromArray_setNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(t,e){this.bind(),this.getValue(t,e)}_setValue_unbound(t,e){this.bind(),this.setValue(t,e)}bind(){let t=this.node,e=this.parsedPath,i=e.objectName,s=e.propertyName,r=e.propertyIndex;if(t||(t=n.findNode(this.rootNode,e.nodeName),this.node=t),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!t){Gt("PropertyBinding: No target node found for track: "+this.path+".");return}if(i){let c=e.objectIndex;switch(i){case"materials":if(!t.material){Jt("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.materials){Jt("PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}t=t.material.materials;break;case"bones":if(!t.skeleton){Jt("PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}t=t.skeleton.bones;for(let u=0;u<t.length;u++)if(t[u].name===c){c=u;break}break;case"map":if("map"in t){t=t.map;break}if(!t.material){Jt("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.map){Jt("PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}t=t.material.map;break;default:if(t[i]===void 0){Jt("PropertyBinding: Can not bind to objectName of node undefined.",this);return}t=t[i]}if(c!==void 0){if(t[c]===void 0){Jt("PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,t);return}t=t[c]}}let o=t[s];if(o===void 0){let c=e.nodeName;Jt("PropertyBinding: Trying to update property for track: "+c+"."+s+" but it wasn't found.",t);return}let a=this.Versioning.None;this.targetObject=t,t.isMaterial===!0?a=this.Versioning.NeedsUpdate:t.isObject3D===!0&&(a=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(r!==void 0){if(s==="morphTargetInfluences"){if(!t.geometry){Jt("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!t.geometry.morphAttributes){Jt("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}t.morphTargetDictionary[r]!==void 0&&(r=t.morphTargetDictionary[r])}l=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=r}else o.fromArray!==void 0&&o.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(l=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=s;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][a]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};Le.Composite=hh;Le.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};Le.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};Le.prototype.GetterByBindingType=[Le.prototype._getValue_direct,Le.prototype._getValue_array,Le.prototype._getValue_arrayElement,Le.prototype._getValue_toArray];Le.prototype.SetterByBindingTypeAndVersioning=[[Le.prototype._setValue_direct,Le.prototype._setValue_direct_setNeedsUpdate,Le.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[Le.prototype._setValue_array,Le.prototype._setValue_array_setNeedsUpdate,Le.prototype._setValue_array_setMatrixWorldNeedsUpdate],[Le.prototype._setValue_arrayElement,Le.prototype._setValue_arrayElement_setNeedsUpdate,Le.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[Le.prototype._setValue_fromArray,Le.prototype._setValue_fromArray_setNeedsUpdate,Le.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var QS=new Float32Array(1);var xr=class{constructor(t=1,e=0,i=0){this.radius=t,this.phi=e,this.theta=i}set(t,e,i){return this.radius=t,this.phi=e,this.theta=i,this}copy(t){return this.radius=t.radius,this.phi=t.phi,this.theta=t.theta,this}makeSafe(){return this.phi=fe(this.phi,1e-6,Math.PI-1e-6),this}setFromVector3(t){return this.setFromCartesianCoords(t.x,t.y,t.z)}setFromCartesianCoords(t,e,i){return this.radius=Math.sqrt(t*t+e*e+i*i),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(t,i),this.phi=Math.acos(fe(e/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}};var Xh=class Xh{constructor(t,e,i,s){this.elements=[1,0,0,1],t!==void 0&&this.set(t,e,i,s)}identity(){return this.set(1,0,0,1),this}fromArray(t,e=0){for(let i=0;i<4;i++)this.elements[i]=t[i+e];return this}set(t,e,i,s){let r=this.elements;return r[0]=t,r[2]=e,r[1]=i,r[3]=s,this}};Xh.prototype.isMatrix2=!0;var uh=Xh;var Od=new L,ba,sh,ss=class extends Ke{constructor(t=new L(0,0,1),e=new L(0,0,0),i=1,s=16776960,r=i*.2,o=r*.2){super(),this.type="ArrowHelper",ba===void 0&&(ba=new Ge,ba.setAttribute("position",new Pe([0,0,0,0,1,0],3)),sh=new ts(.5,1,5,1),sh.translate(0,-.5,0)),this.position.copy(e),this.line=new As(ba,new Tn({color:s,toneMapped:!1})),this.line.matrixAutoUpdate=!1,this.add(this.line),this.cone=new fn(sh,new ur({color:s,toneMapped:!1})),this.cone.matrixAutoUpdate=!1,this.add(this.cone),this.setDirection(t),this.setLength(i,r,o)}setDirection(t){if(t.y>.99999)this.quaternion.set(0,0,0,1);else if(t.y<-.99999)this.quaternion.set(1,0,0,0);else{Od.set(t.z,0,-t.x).normalize();let e=Math.acos(t.y);this.quaternion.setFromAxisAngle(Od,e)}}setLength(t,e=t*.2,i=e*.2){this.line.scale.set(1,Math.max(1e-4,t-e),1),this.line.updateMatrix(),this.cone.scale.set(i,e,i),this.cone.position.y=t,this.cone.updateMatrix()}setColor(t){this.line.material.color.set(t),this.cone.material.color.set(t)}copy(t){return super.copy(t,!1),this.line.copy(t.line),this.cone.copy(t.cone),this}dispose(){super.dispose(),this.line.geometry.dispose(),this.line.material.dispose(),this.cone.geometry.dispose(),this.cone.material.dispose()}};var po=class extends Qn{constructor(t,e=null){super(),this.object=t,this.domElement=e,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(t){this.domElement!==null&&this.disconnect(),this.domElement=t}disconnect(){}dispose(){}update(){}};function zh(n,t,e,i){let s=Ym(i);switch(e){case Ph:return n*t;case Lh:return n*t/s.components*s.byteLength;case fl:return n*t/s.components*s.byteLength;case us:return n*t*2/s.components*s.byteLength;case pl:return n*t*2/s.components*s.byteLength;case Ih:return n*t*3/s.components*s.byteLength;case qn:return n*t*4/s.components*s.byteLength;case ml:return n*t*4/s.components*s.byteLength;case yo:case vo:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*8;case Mo:case So:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case _l:case yl:return Math.max(n,16)*Math.max(t,8)/4;case gl:case xl:return Math.max(n,8)*Math.max(t,8)/2;case vl:case Ml:case bl:case Tl:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*8;case Sl:case bo:case El:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case wl:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case Al:return Math.floor((n+4)/5)*Math.floor((t+3)/4)*16;case Cl:return Math.floor((n+4)/5)*Math.floor((t+4)/5)*16;case Rl:return Math.floor((n+5)/6)*Math.floor((t+4)/5)*16;case Pl:return Math.floor((n+5)/6)*Math.floor((t+5)/6)*16;case Il:return Math.floor((n+7)/8)*Math.floor((t+4)/5)*16;case Ll:return Math.floor((n+7)/8)*Math.floor((t+5)/6)*16;case Dl:return Math.floor((n+7)/8)*Math.floor((t+7)/8)*16;case Nl:return Math.floor((n+9)/10)*Math.floor((t+4)/5)*16;case Ul:return Math.floor((n+9)/10)*Math.floor((t+5)/6)*16;case Fl:return Math.floor((n+9)/10)*Math.floor((t+7)/8)*16;case Ol:return Math.floor((n+9)/10)*Math.floor((t+9)/10)*16;case Bl:return Math.floor((n+11)/12)*Math.floor((t+9)/10)*16;case kl:return Math.floor((n+11)/12)*Math.floor((t+11)/12)*16;case zl:case Vl:case Hl:return Math.ceil(n/4)*Math.ceil(t/4)*16;case Gl:case Wl:return Math.ceil(n/4)*Math.ceil(t/4)*8;case To:case Xl:return Math.ceil(n/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function Ym(n){switch(n){case En:case wh:return{byteLength:1,components:1};case Mr:case Ah:case ii:return{byteLength:2,components:1};case ul:case dl:return{byteLength:2,components:4};case ei:case hl:case ni:return{byteLength:4,components:1};case Ch:case Rh:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${n}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"186"}}));typeof window<"u"&&(window.__THREE__?Gt("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="186");function Zf(){let n=null,t=!1,e=null,i=null;function s(r,o){i=n.requestAnimationFrame(s),e(r,o)}return{start:function(){t!==!0&&e!==null&&n!==null&&(i=n.requestAnimationFrame(s),t=!0)},stop:function(){n!==null&&n.cancelAnimationFrame(i),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){n=r}}}function Jm(n){let t=new WeakMap;function e(a,l){let c=a.array,u=a.usage,d=c.byteLength,h=n.createBuffer();n.bindBuffer(l,h),n.bufferData(l,c,u),a.onUploadCallback();let f;if(c instanceof Float32Array)f=n.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)f=n.HALF_FLOAT;else if(c instanceof Uint16Array)a.isFloat16BufferAttribute?f=n.HALF_FLOAT:f=n.UNSIGNED_SHORT;else if(c instanceof Int16Array)f=n.SHORT;else if(c instanceof Uint32Array)f=n.UNSIGNED_INT;else if(c instanceof Int32Array)f=n.INT;else if(c instanceof Int8Array)f=n.BYTE;else if(c instanceof Uint8Array)f=n.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)f=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:h,type:f,bytesPerElement:c.BYTES_PER_ELEMENT,version:a.version,size:d}}function i(a,l,c){let u=l.array,d=l.updateRanges;if(n.bindBuffer(c,a),d.length===0)n.bufferSubData(c,0,u);else{d.sort((f,p)=>f.start-p.start);let h=0;for(let f=1;f<d.length;f++){let p=d[h],_=d[f];_.start<=p.start+p.count+1?p.count=Math.max(p.count,_.start+_.count-p.start):(++h,d[h]=_)}d.length=h+1;for(let f=0,p=d.length;f<p;f++){let _=d[f];n.bufferSubData(c,_.start*u.BYTES_PER_ELEMENT,u,_.start,_.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(a){return a.isInterleavedBufferAttribute&&(a=a.data),t.get(a)}function r(a){a.isInterleavedBufferAttribute&&(a=a.data);let l=t.get(a);l&&(n.deleteBuffer(l.buffer),t.delete(a))}function o(a,l){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){let u=t.get(a);(!u||u.version<a.version)&&t.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}let c=t.get(a);if(c===void 0)t.set(a,e(a,l));else if(c.version<a.version){if(c.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(c.buffer,a,l),c.version=a.version}}return{get:s,remove:r,update:o}}var $m=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Km=`#ifdef USE_ALPHAHASH
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
#endif`,jm=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Qm=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,tg=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,eg=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,ng=`#ifdef USE_AOMAP
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
#endif`,ig=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,sg=`#ifdef USE_BATCHING
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
#endif`,rg=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,og=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,ag=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,lg=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,cg=`#ifdef USE_IRIDESCENCE
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
#endif`,hg=`#ifdef USE_BUMPMAP
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
#endif`,ug=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,dg=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,fg=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,pg=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,mg=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,gg=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,_g=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,xg=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
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
#endif`,yg=`#define PI 3.141592653589793
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
} // validated`,vg=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,Mg=`vec3 transformedNormal = objectNormal;
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
#endif`,Sg=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,bg=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Tg=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Eg=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,wg="gl_FragColor = linearToOutputTexel( gl_FragColor );",Ag=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Cg=`#ifdef USE_ENVMAP
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
#endif`,Rg=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,Pg=`#ifdef USE_ENVMAP
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
#endif`,Ig=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS

		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Lg=`#ifdef USE_ENVMAP
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
#endif`,Dg=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Ng=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Ug=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Fg=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Og=`#ifdef USE_GRADIENTMAP
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
}`,Bg=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,kg=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,zg=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Vg=`uniform bool receiveShadow;
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
#include <lightprobes_pars_fragment>`,Hg=`#ifdef USE_ENVMAP
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
#endif`,Gg=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Wg=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Xg=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,qg=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Yg=`PhysicalMaterial material;
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
#endif`,Zg=`uniform sampler2D dfgLUT;
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
}`,Jg=`
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
#endif`,$g=`#if defined( RE_IndirectDiffuse )
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
#endif`,Kg=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,jg=`#ifdef USE_LIGHT_PROBES_GRID
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
#endif`,Qg=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,t0=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,e0=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,n0=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,i0=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,s0=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,r0=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,o0=`#if defined( USE_POINTS_UV )
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
#endif`,a0=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,l0=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,c0=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,h0=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,u0=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,d0=`#ifdef USE_MORPHTARGETS
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
#endif`,f0=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,p0=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,m0=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,g0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,_0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,x0=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,y0=`#ifdef USE_NORMALMAP
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
#endif`,v0=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,M0=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,S0=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,b0=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,T0=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,E0=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,w0=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,A0=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,C0=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,R0=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,P0=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,I0=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,L0=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,D0=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,N0=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,U0=`float getShadowMask() {
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
}`,F0=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,O0=`#ifdef USE_SKINNING
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
#endif`,B0=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,k0=`#ifdef USE_SKINNING
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
#endif`,z0=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,V0=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,H0=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,G0=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,W0=`#ifdef USE_TRANSMISSION
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
#endif`,X0=`#ifdef USE_TRANSMISSION
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
#endif`,q0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Y0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Z0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,J0=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,$0=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,K0=`uniform sampler2D t2D;
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
}`,j0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Q0=`#ifdef ENVMAP_TYPE_CUBE
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
}`,t_=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,e_=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,n_=`#include <common>
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
}`,i_=`#if DEPTH_PACKING == 3200
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
}`,s_=`#define DISTANCE
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
}`,r_=`#define DISTANCE
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
}`,o_=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,a_=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,l_=`uniform float scale;
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
}`,c_=`uniform vec3 diffuse;
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
}`,h_=`#include <common>
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
}`,u_=`uniform vec3 diffuse;
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
}`,d_=`#define LAMBERT
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
}`,f_=`#define LAMBERT
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
}`,p_=`#define MATCAP
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
}`,m_=`#define MATCAP
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
}`,g_=`#define NORMAL
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
}`,__=`#define NORMAL
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
}`,x_=`#define PHONG
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
}`,y_=`#define PHONG
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
}`,v_=`#define STANDARD
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
}`,M_=`#define STANDARD
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
}`,S_=`#define TOON
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
}`,b_=`#define TOON
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
}`,T_=`uniform float size;
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
}`,E_=`uniform vec3 diffuse;
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
}`,w_=`#include <common>
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
}`,A_=`uniform vec3 color;
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
}`,C_=`uniform float rotation;
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
}`,R_=`uniform vec3 diffuse;
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
}`,he={alphahash_fragment:$m,alphahash_pars_fragment:Km,alphamap_fragment:jm,alphamap_pars_fragment:Qm,alphatest_fragment:tg,alphatest_pars_fragment:eg,aomap_fragment:ng,aomap_pars_fragment:ig,batching_pars_vertex:sg,batching_vertex:rg,begin_vertex:og,beginnormal_vertex:ag,bsdfs:lg,iridescence_fragment:cg,bumpmap_pars_fragment:hg,clipping_planes_fragment:ug,clipping_planes_pars_fragment:dg,clipping_planes_pars_vertex:fg,clipping_planes_vertex:pg,color_fragment:mg,color_pars_fragment:gg,color_pars_vertex:_g,color_vertex:xg,common:yg,cube_uv_reflection_fragment:vg,defaultnormal_vertex:Mg,displacementmap_pars_vertex:Sg,displacementmap_vertex:bg,emissivemap_fragment:Tg,emissivemap_pars_fragment:Eg,colorspace_fragment:wg,colorspace_pars_fragment:Ag,envmap_fragment:Cg,envmap_common_pars_fragment:Rg,envmap_pars_fragment:Pg,envmap_pars_vertex:Ig,envmap_physical_pars_fragment:Hg,envmap_vertex:Lg,fog_vertex:Dg,fog_pars_vertex:Ng,fog_fragment:Ug,fog_pars_fragment:Fg,gradientmap_pars_fragment:Og,lightmap_pars_fragment:Bg,lights_lambert_fragment:kg,lights_lambert_pars_fragment:zg,lights_pars_begin:Vg,lights_toon_fragment:Gg,lights_toon_pars_fragment:Wg,lights_phong_fragment:Xg,lights_phong_pars_fragment:qg,lights_physical_fragment:Yg,lights_physical_pars_fragment:Zg,lights_fragment_begin:Jg,lights_fragment_maps:$g,lights_fragment_end:Kg,lightprobes_pars_fragment:jg,logdepthbuf_fragment:Qg,logdepthbuf_pars_fragment:t0,logdepthbuf_pars_vertex:e0,logdepthbuf_vertex:n0,map_fragment:i0,map_pars_fragment:s0,map_particle_fragment:r0,map_particle_pars_fragment:o0,metalnessmap_fragment:a0,metalnessmap_pars_fragment:l0,morphinstance_vertex:c0,morphcolor_vertex:h0,morphnormal_vertex:u0,morphtarget_pars_vertex:d0,morphtarget_vertex:f0,normal_fragment_begin:p0,normal_fragment_maps:m0,normal_pars_fragment:g0,normal_pars_vertex:_0,normal_vertex:x0,normalmap_pars_fragment:y0,clearcoat_normal_fragment_begin:v0,clearcoat_normal_fragment_maps:M0,clearcoat_pars_fragment:S0,iridescence_pars_fragment:b0,opaque_fragment:T0,packing:E0,premultiplied_alpha_fragment:w0,project_vertex:A0,dithering_fragment:C0,dithering_pars_fragment:R0,roughnessmap_fragment:P0,roughnessmap_pars_fragment:I0,shadowmap_pars_fragment:L0,shadowmap_pars_vertex:D0,shadowmap_vertex:N0,shadowmask_pars_fragment:U0,skinbase_vertex:F0,skinning_pars_vertex:O0,skinning_vertex:B0,skinnormal_vertex:k0,specularmap_fragment:z0,specularmap_pars_fragment:V0,tonemapping_fragment:H0,tonemapping_pars_fragment:G0,transmission_fragment:W0,transmission_pars_fragment:X0,uv_pars_fragment:q0,uv_pars_vertex:Y0,uv_vertex:Z0,worldpos_vertex:J0,background_vert:$0,background_frag:K0,backgroundCube_vert:j0,backgroundCube_frag:Q0,cube_vert:t_,cube_frag:e_,depth_vert:n_,depth_frag:i_,distance_vert:s_,distance_frag:r_,equirect_vert:o_,equirect_frag:a_,linedashed_vert:l_,linedashed_frag:c_,meshbasic_vert:h_,meshbasic_frag:u_,meshlambert_vert:d_,meshlambert_frag:f_,meshmatcap_vert:p_,meshmatcap_frag:m_,meshnormal_vert:g_,meshnormal_frag:__,meshphong_vert:x_,meshphong_frag:y_,meshphysical_vert:v_,meshphysical_frag:M_,meshtoon_vert:S_,meshtoon_frag:b_,points_vert:T_,points_frag:E_,shadow_vert:w_,shadow_frag:A_,sprite_vert:C_,sprite_frag:R_},pt={common:{diffuse:{value:new ae(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Qt},alphaMap:{value:null},alphaMapTransform:{value:new Qt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Qt}},envmap:{envMap:{value:null},envMapRotation:{value:new Qt},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Qt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Qt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Qt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Qt},normalScale:{value:new Zt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Qt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Qt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Qt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Qt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new ae(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new L},probesMax:{value:new L},probesResolution:{value:new L}},points:{diffuse:{value:new ae(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Qt},alphaTest:{value:0},uvTransform:{value:new Qt}},sprite:{diffuse:{value:new ae(16777215)},opacity:{value:1},center:{value:new Zt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Qt},alphaMap:{value:null},alphaMapTransform:{value:new Qt},alphaTest:{value:0}}},vi={basic:{uniforms:on([pt.common,pt.specularmap,pt.envmap,pt.aomap,pt.lightmap,pt.fog]),vertexShader:he.meshbasic_vert,fragmentShader:he.meshbasic_frag},lambert:{uniforms:on([pt.common,pt.specularmap,pt.envmap,pt.aomap,pt.lightmap,pt.emissivemap,pt.bumpmap,pt.normalmap,pt.displacementmap,pt.fog,pt.lights,{emissive:{value:new ae(0)},envMapIntensity:{value:1}}]),vertexShader:he.meshlambert_vert,fragmentShader:he.meshlambert_frag},phong:{uniforms:on([pt.common,pt.specularmap,pt.envmap,pt.aomap,pt.lightmap,pt.emissivemap,pt.bumpmap,pt.normalmap,pt.displacementmap,pt.fog,pt.lights,{emissive:{value:new ae(0)},specular:{value:new ae(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:he.meshphong_vert,fragmentShader:he.meshphong_frag},standard:{uniforms:on([pt.common,pt.envmap,pt.aomap,pt.lightmap,pt.emissivemap,pt.bumpmap,pt.normalmap,pt.displacementmap,pt.roughnessmap,pt.metalnessmap,pt.fog,pt.lights,{emissive:{value:new ae(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:he.meshphysical_vert,fragmentShader:he.meshphysical_frag},toon:{uniforms:on([pt.common,pt.aomap,pt.lightmap,pt.emissivemap,pt.bumpmap,pt.normalmap,pt.displacementmap,pt.gradientmap,pt.fog,pt.lights,{emissive:{value:new ae(0)}}]),vertexShader:he.meshtoon_vert,fragmentShader:he.meshtoon_frag},matcap:{uniforms:on([pt.common,pt.bumpmap,pt.normalmap,pt.displacementmap,pt.fog,{matcap:{value:null}}]),vertexShader:he.meshmatcap_vert,fragmentShader:he.meshmatcap_frag},points:{uniforms:on([pt.points,pt.fog]),vertexShader:he.points_vert,fragmentShader:he.points_frag},dashed:{uniforms:on([pt.common,pt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:he.linedashed_vert,fragmentShader:he.linedashed_frag},depth:{uniforms:on([pt.common,pt.displacementmap]),vertexShader:he.depth_vert,fragmentShader:he.depth_frag},normal:{uniforms:on([pt.common,pt.bumpmap,pt.normalmap,pt.displacementmap,{opacity:{value:1}}]),vertexShader:he.meshnormal_vert,fragmentShader:he.meshnormal_frag},sprite:{uniforms:on([pt.sprite,pt.fog]),vertexShader:he.sprite_vert,fragmentShader:he.sprite_frag},background:{uniforms:{uvTransform:{value:new Qt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:he.background_vert,fragmentShader:he.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Qt}},vertexShader:he.backgroundCube_vert,fragmentShader:he.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:he.cube_vert,fragmentShader:he.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:he.equirect_vert,fragmentShader:he.equirect_frag},distance:{uniforms:on([pt.common,pt.displacementmap,{referencePosition:{value:new L},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:he.distance_vert,fragmentShader:he.distance_frag},shadow:{uniforms:on([pt.lights,pt.fog,{color:{value:new ae(0)},opacity:{value:1}}]),vertexShader:he.shadow_vert,fragmentShader:he.shadow_frag}};vi.physical={uniforms:on([vi.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Qt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Qt},clearcoatNormalScale:{value:new Zt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Qt},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Qt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Qt},sheen:{value:0},sheenColor:{value:new ae(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Qt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Qt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Qt},transmissionSamplerSize:{value:new Zt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Qt},attenuationDistance:{value:0},attenuationColor:{value:new ae(0)},specularColor:{value:new ae(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Qt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Qt},anisotropyVector:{value:new Zt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Qt}}]),vertexShader:he.meshphysical_vert,fragmentShader:he.meshphysical_frag};var Jl={r:0,b:0,g:0},P_=new De,Jf=new Qt;Jf.set(-1,0,0,0,1,0,0,0,1);function I_(n,t,e,i,s,r){let o=new ae(0),a=s===!0?0:1,l,c,u=null,d=0,h=null;function f(S){let A=S.isScene===!0?S.background:null;if(A&&A.isTexture){let v=S.backgroundBlurriness>0;A=t.get(A,v)}return A}function p(S){let A=!1,v=f(S);v===null?m(o,a):v&&v.isColor&&(m(v,1),A=!0);let b=n.xr.getEnvironmentBlendMode();b==="additive"?e.buffers.color.setClear(0,0,0,1,r):b==="alpha-blend"&&e.buffers.color.setClear(0,0,0,0,r),(n.autoClear||A)&&(e.buffers.depth.setTest(!0),e.buffers.depth.setMask(!0),e.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function _(S,A){let v=f(A);v&&(v.isCubeTexture||v.mapping===_o)?(c===void 0&&(c=new fn(new fr(1,1,1),new Un({name:"BackgroundCubeMaterial",uniforms:Ps(vi.backgroundCube.uniforms),vertexShader:vi.backgroundCube.vertexShader,fragmentShader:vi.backgroundCube.fragmentShader,side:gn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(b,T,C){this.matrixWorld.copyPosition(C.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(c)),c.material.uniforms.envMap.value=v,c.material.uniforms.backgroundBlurriness.value=A.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=A.backgroundIntensity,c.material.uniforms.backgroundRotation.value.setFromMatrix4(P_.makeRotationFromEuler(A.backgroundRotation)).transpose(),v.isCubeTexture&&v.isRenderTargetTexture===!1&&c.material.uniforms.backgroundRotation.value.premultiply(Jf),c.material.toneMapped=ge.getTransfer(v.colorSpace)!==Se,(u!==v||d!==v.version||h!==n.toneMapping)&&(c.material.needsUpdate=!0,u=v,d=v.version,h=n.toneMapping),c.layers.enableAll(),S.unshift(c,c.geometry,c.material,0,0,null)):v&&v.isTexture&&(l===void 0&&(l=new fn(new pn(2,2),new Un({name:"BackgroundMaterial",uniforms:Ps(vi.background.uniforms),vertexShader:vi.background.vertexShader,fragmentShader:vi.background.fragmentShader,side:as,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(l)),l.material.uniforms.t2D.value=v,l.material.uniforms.backgroundIntensity.value=A.backgroundIntensity,l.material.toneMapped=ge.getTransfer(v.colorSpace)!==Se,v.matrixAutoUpdate===!0&&v.updateMatrix(),l.material.uniforms.uvTransform.value.copy(v.matrix),(u!==v||d!==v.version||h!==n.toneMapping)&&(l.material.needsUpdate=!0,u=v,d=v.version,h=n.toneMapping),l.layers.enableAll(),S.unshift(l,l.geometry,l.material,0,0,null))}function m(S,A){S.getRGB(Jl,Oh(n)),e.buffers.color.setClear(Jl.r,Jl.g,Jl.b,A,r)}function g(){c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return o},setClearColor:function(S,A=1){o.set(S),a=A,m(o,a)},getClearAlpha:function(){return a},setClearAlpha:function(S){a=S,m(o,a)},render:p,addToRenderList:_,dispose:g}}function L_(n,t){let e=n.getParameter(n.MAX_VERTEX_ATTRIBS),i={},s=h(null),r=s,o=!1;function a(F,B,V,I,k){let W=!1,J=d(F,I,V,B);r!==J&&(r=J,c(r.object)),W=f(F,I,V,k),W&&p(F,I,V,k),k!==null&&t.update(k,n.ELEMENT_ARRAY_BUFFER),(W||o)&&(o=!1,v(F,B,V,I),k!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,t.get(k).buffer))}function l(){return n.createVertexArray()}function c(F){return n.bindVertexArray(F)}function u(F){return n.deleteVertexArray(F)}function d(F,B,V,I){let k=I.wireframe===!0,W=i[B.id];W===void 0&&(W={},i[B.id]=W);let J=F.isInstancedMesh===!0?F.id:0,et=W[J];et===void 0&&(et={},W[J]=et);let U=et[V.id];U===void 0&&(U={},et[V.id]=U);let q=U[k];return q===void 0&&(q=h(l()),U[k]=q),q}function h(F){let B=[],V=[],I=[];for(let k=0;k<e;k++)B[k]=0,V[k]=0,I[k]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:B,enabledAttributes:V,attributeDivisors:I,object:F,attributes:{},index:null}}function f(F,B,V,I){let k=r.attributes,W=B.attributes,J=0,et=V.getAttributes();for(let U in et)if(et[U].location>=0){let j=k[U],yt=W[U];if(yt===void 0&&(U==="instanceMatrix"&&F.instanceMatrix&&(yt=F.instanceMatrix),U==="instanceColor"&&F.instanceColor&&(yt=F.instanceColor)),j===void 0||j.attribute!==yt||yt&&j.data!==yt.data)return!0;J++}return r.attributesNum!==J||r.index!==I}function p(F,B,V,I){let k={},W=B.attributes,J=0,et=V.getAttributes();for(let U in et)if(et[U].location>=0){let j=W[U];j===void 0&&(U==="instanceMatrix"&&F.instanceMatrix&&(j=F.instanceMatrix),U==="instanceColor"&&F.instanceColor&&(j=F.instanceColor));let yt={};yt.attribute=j,j&&j.data&&(yt.data=j.data),k[U]=yt,J++}r.attributes=k,r.attributesNum=J,r.index=I}function _(){let F=r.newAttributes;for(let B=0,V=F.length;B<V;B++)F[B]=0}function m(F){g(F,0)}function g(F,B){let V=r.newAttributes,I=r.enabledAttributes,k=r.attributeDivisors;V[F]=1,I[F]===0&&(n.enableVertexAttribArray(F),I[F]=1),k[F]!==B&&(n.vertexAttribDivisor(F,B),k[F]=B)}function S(){let F=r.newAttributes,B=r.enabledAttributes;for(let V=0,I=B.length;V<I;V++)B[V]!==F[V]&&(n.disableVertexAttribArray(V),B[V]=0)}function A(F,B,V,I,k,W,J){J===!0?n.vertexAttribIPointer(F,B,V,k,W):n.vertexAttribPointer(F,B,V,I,k,W)}function v(F,B,V,I){_();let k=I.attributes,W=V.getAttributes(),J=B.defaultAttributeValues;for(let et in W){let U=W[et];if(U.location>=0){let q=k[et];if(q===void 0&&(et==="instanceMatrix"&&F.instanceMatrix&&(q=F.instanceMatrix),et==="instanceColor"&&F.instanceColor&&(q=F.instanceColor)),q!==void 0){let j=q.normalized,yt=q.itemSize,Tt=t.get(q);if(Tt===void 0)continue;let pe=Tt.buffer,qt=Tt.type,Et=Tt.bytesPerElement,Y=qt===n.INT||qt===n.UNSIGNED_INT||q.gpuType===hl;if(q.isInterleavedBufferAttribute){let K=q.data,it=K.stride,Rt=q.offset;if(K.isInstancedInterleavedBuffer){for(let ot=0;ot<U.locationSize;ot++)g(U.location+ot,K.meshPerAttribute);F.isInstancedMesh!==!0&&I._maxInstanceCount===void 0&&(I._maxInstanceCount=K.meshPerAttribute*K.count)}else for(let ot=0;ot<U.locationSize;ot++)m(U.location+ot);n.bindBuffer(n.ARRAY_BUFFER,pe);for(let ot=0;ot<U.locationSize;ot++)A(U.location+ot,yt/U.locationSize,qt,j,it*Et,(Rt+yt/U.locationSize*ot)*Et,Y)}else{if(q.isInstancedBufferAttribute){for(let K=0;K<U.locationSize;K++)g(U.location+K,q.meshPerAttribute);F.isInstancedMesh!==!0&&I._maxInstanceCount===void 0&&(I._maxInstanceCount=q.meshPerAttribute*q.count)}else for(let K=0;K<U.locationSize;K++)m(U.location+K);n.bindBuffer(n.ARRAY_BUFFER,pe);for(let K=0;K<U.locationSize;K++)A(U.location+K,yt/U.locationSize,qt,j,yt*Et,yt/U.locationSize*K*Et,Y)}}else if(J!==void 0){let j=J[et];if(j!==void 0)switch(j.length){case 2:n.vertexAttrib2fv(U.location,j);break;case 3:n.vertexAttrib3fv(U.location,j);break;case 4:n.vertexAttrib4fv(U.location,j);break;default:n.vertexAttrib1fv(U.location,j)}}}}S()}function b(){w();for(let F in i){let B=i[F];for(let V in B){let I=B[V];for(let k in I){let W=I[k];for(let J in W)u(W[J].object),delete W[J];delete I[k]}}delete i[F]}}function T(F){if(i[F.id]===void 0)return;let B=i[F.id];for(let V in B){let I=B[V];for(let k in I){let W=I[k];for(let J in W)u(W[J].object),delete W[J];delete I[k]}}delete i[F.id]}function C(F){for(let B in i){let V=i[B];for(let I in V){let k=V[I];if(k[F.id]===void 0)continue;let W=k[F.id];for(let J in W)u(W[J].object),delete W[J];delete k[F.id]}}}function y(F){for(let B in i){let V=i[B],I=F.isInstancedMesh===!0?F.id:0,k=V[I];if(k!==void 0){for(let W in k){let J=k[W];for(let et in J)u(J[et].object),delete J[et];delete k[W]}delete V[I],Object.keys(V).length===0&&delete i[B]}}}function w(){P(),o=!0,r!==s&&(r=s,c(r.object))}function P(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:a,reset:w,resetDefaultState:P,dispose:b,releaseStatesOfGeometry:T,releaseStatesOfObject:y,releaseStatesOfProgram:C,initAttributes:_,enableAttribute:m,disableUnusedAttributes:S}}function D_(n,t,e){let i;function s(l){i=l}function r(l,c){n.drawArrays(i,l,c),e.update(c,i,1)}function o(l,c,u){u!==0&&(n.drawArraysInstanced(i,l,c,u),e.update(c,i,u))}function a(l,c,u){if(u===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,l,0,c,0,u);let h=0;for(let f=0;f<u;f++)h+=c[f];e.update(h,i,1)}this.setMode=s,this.render=r,this.renderInstances=o,this.renderMultiDraw=a}function N_(n,t,e,i){let s;function r(){if(s!==void 0)return s;if(t.has("EXT_texture_filter_anisotropic")===!0){let C=t.get("EXT_texture_filter_anisotropic");s=n.getParameter(C.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function o(C){return!(C!==qn&&i.convert(C)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(C){let y=C===ii&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(C!==En&&C!==ni&&!y&&i.convert(C)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE))}function l(C){if(C==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";C="mediump"}return C==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=e.precision!==void 0?e.precision:"highp",u=l(c);u!==c&&(Gt("WebGLRenderer:",c,"not supported, using",u,"instead."),c=u);let d=e.logarithmicDepthBuffer===!0,h=e.reversedDepthBuffer===!0&&t.has("EXT_clip_control");e.reversedDepthBuffer===!0&&h===!1&&Gt("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");let f=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),p=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=n.getParameter(n.MAX_TEXTURE_SIZE),m=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),g=n.getParameter(n.MAX_VERTEX_ATTRIBS),S=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),A=n.getParameter(n.MAX_VARYING_VECTORS),v=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),b=n.getParameter(n.MAX_SAMPLES),T=n.getParameter(n.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:o,textureTypeReadable:a,precision:c,logarithmicDepthBuffer:d,reversedDepthBuffer:h,maxTextures:f,maxVertexTextures:p,maxTextureSize:_,maxCubemapSize:m,maxAttributes:g,maxVertexUniforms:S,maxVaryings:A,maxFragmentUniforms:v,maxSamples:b,samples:T}}function U_(n){let t=this,e=null,i=0,s=!1,r=!1,o=new Dn,a=new Qt,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(d,h){let f=d.length!==0||h||i!==0||s;return s=h,i=d.length,f},this.beginShadows=function(){r=!0,u(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(d,h){e=u(d,h,0)},this.setState=function(d,h,f){let p=d.clippingPlanes,_=d.clipIntersection,m=d.clipShadows,g=n.get(d);if(!s||p===null||p.length===0||r&&!m)r?u(null):c();else{let S=r?0:i,A=S*4,v=g.clippingState||null;l.value=v,v=u(p,h,A,f);for(let b=0;b!==A;++b)v[b]=e[b];g.clippingState=v,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=S}};function c(){l.value!==e&&(l.value=e,l.needsUpdate=i>0),t.numPlanes=i,t.numIntersection=0}function u(d,h,f,p){let _=d!==null?d.length:0,m=null;if(_!==0){if(m=l.value,p!==!0||m===null){let g=f+_*4,S=h.matrixWorldInverse;a.getNormalMatrix(S),(m===null||m.length<g)&&(m=new Float32Array(g));for(let A=0,v=f;A!==_;++A,v+=4)o.copy(d[A]).applyMatrix4(S,a),o.normal.toArray(m,v),m[v+3]=o.constant}l.value=m,l.needsUpdate=!0}return t.numPlanes=_,t.numIntersection=0,m}}var Er=4,F_=6,O_=20,B_=256,Eo=new gr,Af=new ae,qh=null,Yh=0,Zh=0,Jh=!1,k_=new L,Is=new L,Kl=class{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(t,e=0,i=.1,s=100,r={}){let{size:o=256,position:a=k_}=r;qh=this._renderer.getRenderTarget(),Yh=this._renderer.getActiveCubeFace(),Zh=this._renderer.getActiveMipmapLevel(),Jh=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(o);let l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(t,i,s,l,a),e>0&&this._blur(l,0,0,e),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Pf(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Rf(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodMeshes.length;t++)this._lodMeshes[t].geometry.dispose()}_cleanup(t){this._renderer.setRenderTarget(qh,Yh,Zh),this._renderer.xr.enabled=Jh,t.scissorTest=!1,Tr(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===ls||t.mapping===Rs?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),qh=this._renderer.getRenderTarget(),Yh=this._renderer.getActiveCubeFace(),Zh=this._renderer.getActiveMipmapLevel(),Jh=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let i=e||this._allocateTargets();return this._textureToCubeUV(t,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){let t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,i={magFilter:Qe,minFilter:Qe,generateMipmaps:!1,type:ii,format:qn,colorSpace:$r,depthBuffer:!1},s=Cf(t,e,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Cf(t,e,i);let{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods}=z_(r)),this._blurMaterial=H_(r,t,e),this._ggxMaterial=V_(r,t,e)}return s}_compileMaterial(t){let e=new fn(new Ge,t);this._renderer.compile(e,Eo)}_sceneToCubeUV(t,e,i,s,r){let l=new rn(90,1,e,i),c=[1,-1,1,1,1,1],u=[1,1,1,-1,-1,-1],d=this._renderer,h=d.autoClear,f=d.toneMapping;d.getClearColor(Af),d.toneMapping=ti,d.autoClear=!1,d.state.buffers.depth.getReversed()&&(d.setRenderTarget(s),d.clearDepth(),d.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new fn(new fr,new ur({name:"PMREM.Background",side:gn,depthWrite:!1,depthTest:!1})));let _=this._backgroundBox,m=_.material,g=!1,S=t.background;S?S.isColor&&(m.color.copy(S),t.background=null,g=!0):(m.color.copy(Af),g=!0);for(let A=0;A<6;A++){let v=A%3;v===0?(l.up.set(0,c[A],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x+u[A],r.y,r.z)):v===1?(l.up.set(0,0,c[A]),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y+u[A],r.z)):(l.up.set(0,c[A],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y,r.z+u[A]));let b=this._cubeSize;Tr(s,v*b,A>2?b:0,b,b),d.setRenderTarget(s),g&&d.render(_,l),d.render(t,l)}d.toneMapping=f,d.autoClear=h,t.background=S}_textureToCubeUV(t,e){let i=this._renderer,s=t.mapping===ls||t.mapping===Rs;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=Pf()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Rf());let r=s?this._cubemapMaterial:this._equirectMaterial,o=this._lodMeshes[0];o.material=r;let a=r.uniforms;a.envMap.value=t;let l=this._cubeSize;Tr(e,0,0,3*l,2*l),i.setRenderTarget(e),i.render(o,Eo)}_applyPMREM(t){let e=this._renderer,i=e.autoClear;e.autoClear=!1;let s=this._lodMeshes.length;for(let r=1;r<s;r++)this._applyGGXFilter(t,r-1,r);e.autoClear=i}_applyGGXFilter(t,e,i){let s=this._renderer,r=this._pingPongRenderTarget,o=this._ggxMaterial,a=this._lodMeshes[i];a.material=o;let l=o.uniforms,c=i/(this._lodMeshes.length-1),u=e/(this._lodMeshes.length-1),d=Math.sqrt(c*c-u*u),h=c*1.25,f=d*h,{_lodMax:p}=this,_=this._sizeLods[i],m=3*_*(i>p-Er?i-p+Er:0),g=4*(this._cubeSize-_);l.envMap.value=t.texture,l.roughness.value=f,l.mipInt.value=p-e,Tr(r,m,g,3*_,2*_),s.setRenderTarget(r),s.render(a,Eo),l.envMap.value=r.texture,l.roughness.value=0,l.mipInt.value=p-i,Tr(t,m,g,3*_,2*_),s.setRenderTarget(t),s.render(a,Eo)}_blur(t,e,i,s){let r=this._pingPongRenderTarget,o=Math.min(s,Math.PI)/Math.SQRT2;this._blurPass(t,r,e,i,o),this._blurPass(r,t,i,i,o)}_blurPass(t,e,i,s,r){let o=this._renderer,a=this._blurMaterial,l=this._lodMeshes[s];l.material=a;let c=a.uniforms;c.envMap.value=t.texture,c.sigma.value=r,c.mipInt.value=this._lodMax-i;let u=this._sizeLods[s],d=3*u*(s>this._lodMax-Er?s-this._lodMax+Er:0),h=4*(this._cubeSize-u);Tr(e,d,h,3*u,2*u),o.setRenderTarget(e),o.render(l,Eo)}};function z_(n){let t=[],e=[],i=n,s=n-Er+1+F_;for(let r=0;r<s;r++){let o=Math.pow(2,i);t.push(o);let a=1/(o-2),l=-a,c=1+a,u=[l,l,c,l,c,c,l,l,c,c,l,c],d=6,h=6,f=3,p=new Float32Array(f*h*d),_=new Float32Array(f*h*d);for(let g=0;g<d;g++){let S=g%3*2/3-1,A=g>2?0:-1,v=[S,A,0,S+2/3,A,0,S+2/3,A+1,0,S,A,0,S+2/3,A+1,0,S,A+1,0];p.set(v,f*h*g);for(let b=0;b<h;b++){let T=u[b*2]*2-1,C=u[b*2+1]*2-1;g===0?Is.set(1,C,T):g===1?Is.set(-T,1,-C):g===2?Is.set(-T,C,1):g===3?Is.set(-1,C,-T):g===4?Is.set(-T,-1,C):Is.set(T,C,-1),Is.toArray(_,(g*h+b)*f)}}let m=new Ge;m.setAttribute("position",new Wn(p,f)),m.setAttribute("outputDirection",new Wn(_,f)),e.push(new fn(m,null)),i>Er&&i--}return{lodMeshes:e,sizeLods:t}}function Cf(n,t,e){let i=new bn(n,t,e);return i.texture.mapping=_o,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function Tr(n,t,e,i,s){n.viewport.set(t,e,i,s),n.scissor.set(t,e,i,s)}function V_(n,t,e){return new Un({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:B_,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:tc(),fragmentShader:`

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
		`,blending:xi,depthTest:!1,depthWrite:!1})}function H_(n,t,e){return new Un({name:"SphericalGaussianBlur",defines:{SAMPLES:O_,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},sigma:{value:0},mipInt:{value:0}},vertexShader:tc(),fragmentShader:`

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
		`,blending:xi,depthTest:!1,depthWrite:!1})}function Rf(){return new Un({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:tc(),fragmentShader:`

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
		`,blending:xi,depthTest:!1,depthWrite:!1})}function Pf(){return new Un({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:tc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:xi,depthTest:!1,depthWrite:!1})}function tc(){return`

		precision mediump float;
		precision mediump int;

		attribute vec3 outputDirection;

		varying vec3 vOutputDirection;

		void main() {

			vOutputDirection = outputDirection;
			gl_Position = vec4( position, 1.0 );

		}
	`}var jl=class extends bn{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;let i={width:t,height:t,depth:1},s=[i,i,i,i,i,i];this.texture=new so(s),this._setTextureOptions(e),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;let i={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new fr(5,5,5),r=new Un({name:"CubemapFromEquirect",uniforms:Ps(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:gn,blending:xi});r.uniforms.tEquirect.value=e;let o=new fn(s,r),a=e.minFilter;return e.minFilter===cs&&(e.minFilter=Qe),new sl(1,10,this).update(t,o),e.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(t,e=!0,i=!0,s=!0){let r=t.getRenderTarget();for(let o=0;o<6;o++)t.setRenderTarget(this,o),t.clear(e,i,s);t.setRenderTarget(r)}};function G_(n){let t=new WeakMap,e=new WeakMap,i=null;function s(h,f=!1){return h==null?null:f?o(h):r(h)}function r(h){if(h&&h.isTexture){let f=h.mapping;if(f===al||f===ll)if(t.has(h)){let p=t.get(h).texture;return a(p,h.mapping)}else{let p=h.image;if(p&&p.height>0){let _=new jl(p.height);return _.fromEquirectangularTexture(n,h),t.set(h,_),h.addEventListener("dispose",c),a(_.texture,h.mapping)}else return null}}return h}function o(h){if(h&&h.isTexture){let f=h.mapping,p=f===al||f===ll,_=f===ls||f===Rs;if(p||_){let m=e.get(h),g=m!==void 0?m.texture.pmremVersion:0;if(h.isRenderTargetTexture&&h.pmremVersion!==g)return i===null&&(i=new Kl(n)),m=p?i.fromEquirectangular(h,m):i.fromCubemap(h,m),m.texture.pmremVersion=h.pmremVersion,e.set(h,m),m.texture;if(m!==void 0)return m.texture;{let S=h.image;return p&&S&&S.height>0||_&&S&&l(S)?(i===null&&(i=new Kl(n)),m=p?i.fromEquirectangular(h):i.fromCubemap(h),m.texture.pmremVersion=h.pmremVersion,e.set(h,m),h.addEventListener("dispose",u),m.texture):null}}}return h}function a(h,f){return f===al?h.mapping=ls:f===ll&&(h.mapping=Rs),h}function l(h){let f=0,p=6;for(let _=0;_<p;_++)h[_]!==void 0&&f++;return f===p}function c(h){let f=h.target;f.removeEventListener("dispose",c);let p=t.get(f);p!==void 0&&(t.delete(f),p.dispose())}function u(h){let f=h.target;f.removeEventListener("dispose",u);let p=e.get(f);p!==void 0&&(e.delete(f),p.dispose())}function d(){t=new WeakMap,e=new WeakMap,i!==null&&(i.dispose(),i=null)}return{get:s,dispose:d}}function W_(n){let t={};function e(i){if(t[i]!==void 0)return t[i];let s=n.getExtension(i);return t[i]=s,s}return{has:function(i){return e(i)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(i){let s=e(i);return s===null&&Ts("WebGLRenderer: "+i+" extension not supported."),s}}}function X_(n,t,e,i){let s={},r=new WeakMap;function o(d){let h=d.target;h.index!==null&&t.remove(h.index);for(let p in h.attributes)t.remove(h.attributes[p]);h.removeEventListener("dispose",o),delete s[h.id];let f=r.get(h);f&&(t.remove(f),r.delete(h)),i.releaseStatesOfGeometry(h),h.isInstancedBufferGeometry===!0&&delete h._maxInstanceCount,e.memory.geometries--}function a(d,h){return s[h.id]===!0||(h.addEventListener("dispose",o),s[h.id]=!0,e.memory.geometries++),h}function l(d){let h=d.attributes;for(let f in h)t.update(h[f],n.ARRAY_BUFFER)}function c(d){let h=[],f=d.index,p=d.attributes.position,_=0;if(p===void 0)return;if(f!==null){let S=f.array;_=f.version;for(let A=0,v=S.length;A<v;A+=3){let b=S[A+0],T=S[A+1],C=S[A+2];h.push(b,T,T,C,C,b)}}else{let S=p.array;_=p.version;for(let A=0,v=S.length/3-1;A<v;A+=3){let b=A+0,T=A+1,C=A+2;h.push(b,T,T,C,C,b)}}let m=new(p.count>=65535?io:no)(h,1);m.version=_;let g=r.get(d);g&&t.remove(g),r.set(d,m)}function u(d){let h=r.get(d);if(h){let f=d.index;f!==null&&h.version<f.version&&c(d)}else c(d);return r.get(d)}return{get:a,update:l,getWireframeAttribute:u}}function q_(n,t,e){let i;function s(d){i=d}let r,o;function a(d){r=d.type,o=d.bytesPerElement}function l(d,h){n.drawElements(i,h,r,d*o),e.update(h,i,1)}function c(d,h,f){f!==0&&(n.drawElementsInstanced(i,h,r,d*o,f),e.update(h,i,f))}function u(d,h,f){if(f===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,h,0,r,d,0,f);let _=0;for(let m=0;m<f;m++)_+=h[m];e.update(_,i,1)}this.setMode=s,this.setIndex=a,this.render=l,this.renderInstances=c,this.renderMultiDraw=u}function Y_(n){let t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function i(r,o,a){switch(e.calls++,o){case n.TRIANGLES:e.triangles+=a*(r/3);break;case n.LINES:e.lines+=a*(r/2);break;case n.LINE_STRIP:e.lines+=a*(r-1);break;case n.LINE_LOOP:e.lines+=a*r;break;case n.POINTS:e.points+=a*r;break;default:Jt("WebGLInfo: Unknown draw mode:",o);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:i}}function Z_(n,t,e){let i=new WeakMap,s=new Ne;function r(o,a,l){let c=o.morphTargetInfluences,u=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,d=u!==void 0?u.length:0,h=i.get(a);if(h===void 0||h.count!==d){let w=function(){C.dispose(),i.delete(a),a.removeEventListener("dispose",w)};h!==void 0&&h.texture.dispose();let f=a.morphAttributes.position!==void 0,p=a.morphAttributes.normal!==void 0,_=a.morphAttributes.color!==void 0,m=a.morphAttributes.position||[],g=a.morphAttributes.normal||[],S=a.morphAttributes.color||[],A=0;f===!0&&(A=1),p===!0&&(A=2),_===!0&&(A=3);let v=a.attributes.position.count*A,b=1;v>t.maxTextureSize&&(b=Math.ceil(v/t.maxTextureSize),v=t.maxTextureSize);let T=new Float32Array(v*b*4*d),C=new Qr(T,v,b,d);C.type=ni,C.needsUpdate=!0;let y=A*4;for(let P=0;P<d;P++){let F=m[P],B=g[P],V=S[P],I=v*b*4*P;for(let k=0;k<F.count;k++){let W=k*y;f===!0&&(s.fromBufferAttribute(F,k),T[I+W+0]=s.x,T[I+W+1]=s.y,T[I+W+2]=s.z,T[I+W+3]=0),p===!0&&(s.fromBufferAttribute(B,k),T[I+W+4]=s.x,T[I+W+5]=s.y,T[I+W+6]=s.z,T[I+W+7]=0),_===!0&&(s.fromBufferAttribute(V,k),T[I+W+8]=s.x,T[I+W+9]=s.y,T[I+W+10]=s.z,T[I+W+11]=V.itemSize===4?s.w:1)}}h={count:d,texture:C,size:new Zt(v,b)},i.set(a,h),a.addEventListener("dispose",w)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)l.getUniforms().setValue(n,"morphTexture",o.morphTexture,e);else{let f=0;for(let _=0;_<c.length;_++)f+=c[_];let p=a.morphTargetsRelative?1:1-f;l.getUniforms().setValue(n,"morphTargetBaseInfluence",p),l.getUniforms().setValue(n,"morphTargetInfluences",c)}l.getUniforms().setValue(n,"morphTargetsTexture",h.texture,e),l.getUniforms().setValue(n,"morphTargetsTextureSize",h.size)}return{update:r}}function J_(n,t,e,i,s){let r=new WeakMap;function o(c){let u=s.render.frame,d=c.geometry,h=t.get(c,d);if(r.get(h)!==u&&(t.update(h),r.set(h,u)),c.isInstancedMesh&&(c.hasEventListener("dispose",l)===!1&&c.addEventListener("dispose",l),r.get(c)!==u&&(e.update(c.instanceMatrix,n.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,n.ARRAY_BUFFER),r.set(c,u))),c.isSkinnedMesh){let f=c.skeleton;r.get(f)!==u&&(f.update(),r.set(f,u))}return h}function a(){r=new WeakMap}function l(c){let u=c.target;u.removeEventListener("dispose",l),i.releaseStatesOfObject(u),e.remove(u.instanceMatrix),u.instanceColor!==null&&e.remove(u.instanceColor)}return{update:o,dispose:a}}var $_={[yh]:"LINEAR_TONE_MAPPING",[vh]:"REINHARD_TONE_MAPPING",[Mh]:"CINEON_TONE_MAPPING",[go]:"ACES_FILMIC_TONE_MAPPING",[bh]:"AGX_TONE_MAPPING",[Th]:"NEUTRAL_TONE_MAPPING",[Sh]:"CUSTOM_TONE_MAPPING"};function K_(n,t,e,i,s,r){let o=new bn(t,e,{type:n,depthBuffer:s,stencilBuffer:r,samples:i?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1}),a=null,l=null,c=new Ge;c.setAttribute("position",new Pe([-1,3,0,-1,-1,0,3,-1,0],3)),c.setAttribute("uv",new Pe([0,2,0,0,2,0],2));let u=new Ga({uniforms:{tDiffuse:{value:null}},vertexShader:`
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
			}`,depthTest:!1,depthWrite:!1}),d=new fn(c,u),h=new gr(-1,1,1,-1,0,1),f=null,p=null,_=!1,m,g=null,S=[],A=!1;this.setSize=function(v,b){o.setSize(v,b),a!==null&&a.setSize(v,b),l!==null&&l.setSize(v,b);for(let T=0;T<S.length;T++){let C=S[T];C.setSize&&C.setSize(v,b)}},this.setEffects=function(v){S=v,A=S.length>0&&S[0].isRenderPass===!0;let b=o.width,T=o.height;S.length>0&&a===null&&(a=new bn(b,T,{type:ii,depthBuffer:!1,stencilBuffer:!1}),l=new bn(b,T,{type:ii,depthBuffer:!1,stencilBuffer:!1}));for(let C=0;C<S.length;C++){let y=S[C];y.setSize&&y.setSize(b,T)}},this.begin=function(v,b){if(_||v.toneMapping===ti&&S.length===0)return!1;if(g=b,b!==null){let T=b.width,C=b.height;(o.width!==T||o.height!==C)&&this.setSize(T,C)}return A===!1&&v.setRenderTarget(o),m=v.toneMapping,v.toneMapping=ti,!0},this.hasRenderPass=function(){return A},this.end=function(v,b){v.toneMapping=m,_=!0;let T=o,C=a;for(let y=0;y<S.length;y++){let w=S[y];w.enabled!==!1&&(w.render(v,C,T,b),w.needsSwap!==!1&&(T=C,C=C===a?l:a))}if(f!==v.outputColorSpace||p!==v.toneMapping){f=v.outputColorSpace,p=v.toneMapping,u.defines={},ge.getTransfer(f)===Se&&(u.defines.SRGB_TRANSFER="");let y=$_[p];y&&(u.defines[y]=""),u.needsUpdate=!0}u.uniforms.tDiffuse.value=T.texture,v.setRenderTarget(g),v.render(d,h),g=null,_=!1},this.isCompositing=function(){return _},this.dispose=function(){o.dispose(),a!==null&&a.dispose(),l!==null&&l.dispose(),c.dispose(),u.dispose()}}var $f=new Sn,jh=new Qi(1,1),Kf=new Qr,jf=new Ba,Qf=new so,If=[],Lf=[],Df=new Float32Array(16),Nf=new Float32Array(9),Uf=new Float32Array(4);function Ar(n,t,e){let i=n[0];if(i<=0||i>0)return n;let s=t*e,r=If[s];if(r===void 0&&(r=new Float32Array(s),If[s]=r),t!==0){i.toArray(r,0);for(let o=1,a=0;o!==t;++o)a+=e,n[o].toArray(r,a)}return r}function qe(n,t){if(n.length!==t.length)return!1;for(let e=0,i=n.length;e<i;e++)if(n[e]!==t[e])return!1;return!0}function Ye(n,t){for(let e=0,i=t.length;e<i;e++)n[e]=t[e]}function ec(n,t){let e=Lf[t];e===void 0&&(e=new Int32Array(t),Lf[t]=e);for(let i=0;i!==t;++i)e[i]=n.allocateTextureUnit();return e}function j_(n,t){let e=this.cache;e[0]!==t&&(n.uniform1f(this.addr,t),e[0]=t)}function Q_(n,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(qe(e,t))return;n.uniform2fv(this.addr,t),Ye(e,t)}}function tx(n,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(n.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(qe(e,t))return;n.uniform3fv(this.addr,t),Ye(e,t)}}function ex(n,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(qe(e,t))return;n.uniform4fv(this.addr,t),Ye(e,t)}}function nx(n,t){let e=this.cache,i=t.elements;if(i===void 0){if(qe(e,t))return;n.uniformMatrix2fv(this.addr,!1,t),Ye(e,t)}else{if(qe(e,i))return;Uf.set(i),n.uniformMatrix2fv(this.addr,!1,Uf),Ye(e,i)}}function ix(n,t){let e=this.cache,i=t.elements;if(i===void 0){if(qe(e,t))return;n.uniformMatrix3fv(this.addr,!1,t),Ye(e,t)}else{if(qe(e,i))return;Nf.set(i),n.uniformMatrix3fv(this.addr,!1,Nf),Ye(e,i)}}function sx(n,t){let e=this.cache,i=t.elements;if(i===void 0){if(qe(e,t))return;n.uniformMatrix4fv(this.addr,!1,t),Ye(e,t)}else{if(qe(e,i))return;Df.set(i),n.uniformMatrix4fv(this.addr,!1,Df),Ye(e,i)}}function rx(n,t){let e=this.cache;e[0]!==t&&(n.uniform1i(this.addr,t),e[0]=t)}function ox(n,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(qe(e,t))return;n.uniform2iv(this.addr,t),Ye(e,t)}}function ax(n,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(qe(e,t))return;n.uniform3iv(this.addr,t),Ye(e,t)}}function lx(n,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(qe(e,t))return;n.uniform4iv(this.addr,t),Ye(e,t)}}function cx(n,t){let e=this.cache;e[0]!==t&&(n.uniform1ui(this.addr,t),e[0]=t)}function hx(n,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(qe(e,t))return;n.uniform2uiv(this.addr,t),Ye(e,t)}}function ux(n,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(qe(e,t))return;n.uniform3uiv(this.addr,t),Ye(e,t)}}function dx(n,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(qe(e,t))return;n.uniform4uiv(this.addr,t),Ye(e,t)}}function fx(n,t,e){let i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s);let r;this.type===n.SAMPLER_2D_SHADOW?(jh.compareFunction=e.isReversedDepthBuffer()?Zl:Yl,r=jh):r=$f,e.setTexture2D(t||r,s)}function px(n,t,e){let i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),e.setTexture3D(t||jf,s)}function mx(n,t,e){let i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),e.setTextureCube(t||Qf,s)}function gx(n,t,e){let i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),e.setTexture2DArray(t||Kf,s)}function _x(n){switch(n){case 5126:return j_;case 35664:return Q_;case 35665:return tx;case 35666:return ex;case 35674:return nx;case 35675:return ix;case 35676:return sx;case 5124:case 35670:return rx;case 35667:case 35671:return ox;case 35668:case 35672:return ax;case 35669:case 35673:return lx;case 5125:return cx;case 36294:return hx;case 36295:return ux;case 36296:return dx;case 35678:case 36198:case 36298:case 36306:case 35682:return fx;case 35679:case 36299:case 36307:return px;case 35680:case 36300:case 36308:case 36293:return mx;case 36289:case 36303:case 36311:case 36292:return gx}}function xx(n,t){n.uniform1fv(this.addr,t)}function yx(n,t){let e=Ar(t,this.size,2);n.uniform2fv(this.addr,e)}function vx(n,t){let e=Ar(t,this.size,3);n.uniform3fv(this.addr,e)}function Mx(n,t){let e=Ar(t,this.size,4);n.uniform4fv(this.addr,e)}function Sx(n,t){let e=Ar(t,this.size,4);n.uniformMatrix2fv(this.addr,!1,e)}function bx(n,t){let e=Ar(t,this.size,9);n.uniformMatrix3fv(this.addr,!1,e)}function Tx(n,t){let e=Ar(t,this.size,16);n.uniformMatrix4fv(this.addr,!1,e)}function Ex(n,t){n.uniform1iv(this.addr,t)}function wx(n,t){n.uniform2iv(this.addr,t)}function Ax(n,t){n.uniform3iv(this.addr,t)}function Cx(n,t){n.uniform4iv(this.addr,t)}function Rx(n,t){n.uniform1uiv(this.addr,t)}function Px(n,t){n.uniform2uiv(this.addr,t)}function Ix(n,t){n.uniform3uiv(this.addr,t)}function Lx(n,t){n.uniform4uiv(this.addr,t)}function Dx(n,t,e){let i=this.cache,s=t.length,r=ec(e,s);qe(i,r)||(n.uniform1iv(this.addr,r),Ye(i,r));let o;this.type===n.SAMPLER_2D_SHADOW?o=jh:o=$f;for(let a=0;a!==s;++a)e.setTexture2D(t[a]||o,r[a])}function Nx(n,t,e){let i=this.cache,s=t.length,r=ec(e,s);qe(i,r)||(n.uniform1iv(this.addr,r),Ye(i,r));for(let o=0;o!==s;++o)e.setTexture3D(t[o]||jf,r[o])}function Ux(n,t,e){let i=this.cache,s=t.length,r=ec(e,s);qe(i,r)||(n.uniform1iv(this.addr,r),Ye(i,r));for(let o=0;o!==s;++o)e.setTextureCube(t[o]||Qf,r[o])}function Fx(n,t,e){let i=this.cache,s=t.length,r=ec(e,s);qe(i,r)||(n.uniform1iv(this.addr,r),Ye(i,r));for(let o=0;o!==s;++o)e.setTexture2DArray(t[o]||Kf,r[o])}function Ox(n){switch(n){case 5126:return xx;case 35664:return yx;case 35665:return vx;case 35666:return Mx;case 35674:return Sx;case 35675:return bx;case 35676:return Tx;case 5124:case 35670:return Ex;case 35667:case 35671:return wx;case 35668:case 35672:return Ax;case 35669:case 35673:return Cx;case 5125:return Rx;case 36294:return Px;case 36295:return Ix;case 36296:return Lx;case 35678:case 36198:case 36298:case 36306:case 35682:return Dx;case 35679:case 36299:case 36307:return Nx;case 35680:case 36300:case 36308:case 36293:return Ux;case 36289:case 36303:case 36311:case 36292:return Fx}}var Qh=class{constructor(t,e,i){this.id=t,this.addr=i,this.cache=[],this.type=e.type,this.setValue=_x(e.type)}},tu=class{constructor(t,e,i){this.id=t,this.addr=i,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=Ox(e.type)}},eu=class{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,i){let s=this.seq;for(let r=0,o=s.length;r!==o;++r){let a=s[r];a.setValue(t,e[a.id],i)}}},$h=/(\w+)(\])?(\[|\.)?/g;function Ff(n,t){n.seq.push(t),n.map[t.id]=t}function Bx(n,t,e){let i=n.name,s=i.length;for($h.lastIndex=0;;){let r=$h.exec(i),o=$h.lastIndex,a=r[1],l=r[2]==="]",c=r[3];if(l&&(a=a|0),c===void 0||c==="["&&o+2===s){Ff(e,c===void 0?new Qh(a,n,t):new tu(a,n,t));break}else{let d=e.map[a];d===void 0&&(d=new eu(a),Ff(e,d)),e=d}}}var wr=class{constructor(t,e){this.seq=[],this.map={};let i=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let o=0;o<i;++o){let a=t.getActiveUniform(e,o),l=t.getUniformLocation(e,a.name);Bx(a,l,this)}let s=[],r=[];for(let o of this.seq)o.type===t.SAMPLER_2D_SHADOW||o.type===t.SAMPLER_CUBE_SHADOW||o.type===t.SAMPLER_2D_ARRAY_SHADOW?s.push(o):r.push(o);s.length>0&&(this.seq=s.concat(r))}setValue(t,e,i,s){let r=this.map[e];r!==void 0&&r.setValue(t,i,s)}setOptional(t,e,i){let s=e[i];s!==void 0&&this.setValue(t,i,s)}static upload(t,e,i,s){for(let r=0,o=e.length;r!==o;++r){let a=e[r],l=i[a.id];l.needsUpdate!==!1&&a.setValue(t,l.value,s)}}static seqWithValue(t,e){let i=[];for(let s=0,r=t.length;s!==r;++s){let o=t[s];o.id in e&&i.push(o)}return i}};function Of(n,t,e){let i=n.createShader(t);return n.shaderSource(i,e),n.compileShader(i),i}var kx=37297,zx=0;function Vx(n,t){let e=n.split(`
`),i=[],s=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let o=s;o<r;o++){let a=o+1;i.push(`${a===t?">":" "} ${a}: ${e[o]}`)}return i.join(`
`)}var Bf=new Qt;function Hx(n){ge._getMatrix(Bf,ge.workingColorSpace,n);let t=`mat3( ${Bf.elements.map(e=>e.toFixed(4))} )`;switch(ge.getTransfer(n)){case Kr:return[t,"LinearTransferOETF"];case Se:return[t,"sRGBTransferOETF"];default:return Gt("WebGLProgram: Unsupported color space: ",n),[t,"LinearTransferOETF"]}}function kf(n,t,e){let i=n.getShaderParameter(t,n.COMPILE_STATUS),r=(n.getShaderInfoLog(t)||"").trim();if(i&&r==="")return"";let o=/ERROR: 0:(\d+)/.exec(r);if(o){let a=parseInt(o[1]);return e.toUpperCase()+`

`+r+`

`+Vx(n.getShaderSource(t),a)}else return r}function Gx(n,t){let e=Hx(t);return[`vec4 ${n}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}var Wx={[yh]:"Linear",[vh]:"Reinhard",[Mh]:"Cineon",[go]:"ACESFilmic",[bh]:"AgX",[Th]:"Neutral",[Sh]:"Custom"};function Xx(n,t){let e=Wx[t];return e===void 0?(Gt("WebGLProgram: Unsupported toneMapping:",t),"vec3 "+n+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+n+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}var $l=new L;function qx(){ge.getLuminanceCoefficients($l);let n=$l.x.toFixed(4),t=$l.y.toFixed(4),e=$l.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${n}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Yx(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Ao).join(`
`)}function Zx(n){let t=[];for(let e in n){let i=n[e];i!==!1&&t.push("#define "+e+" "+i)}return t.join(`
`)}function Jx(n,t){let e={},i=n.getProgramParameter(t,n.ACTIVE_ATTRIBUTES);for(let s=0;s<i;s++){let r=n.getActiveAttrib(t,s),o=r.name,a=1;r.type===n.FLOAT_MAT2&&(a=2),r.type===n.FLOAT_MAT3&&(a=3),r.type===n.FLOAT_MAT4&&(a=4),e[o]={type:r.type,location:n.getAttribLocation(t,o),locationSize:a}}return e}function Ao(n){return n!==""}function zf(n,t){let e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return n.replace(/NUM_SUN_LIGHTS/g,t.numSunLights).replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,t.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Vf(n,t){return n.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}var $x=/^[ \t]*#include +<([\w\d./]+)>/gm;function nu(n){return n.replace($x,jx)}var Kx=new Map;function jx(n,t){let e=he[t];if(e===void 0){let i=Kx.get(t);if(i!==void 0)e=he[i],Gt('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,i);else throw new Error("THREE.WebGLProgram: Can not resolve #include <"+t+">")}return nu(e)}var Qx=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Hf(n){return n.replace(Qx,ty)}function ty(n,t,e,i){let s="";for(let r=parseInt(t);r<parseInt(e);r++)s+=i.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function Gf(n){let t=`precision ${n.precision} float;
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
#define LOW_PRECISION`),t}var ey={[mo]:"SHADOWMAP_TYPE_PCF",[yr]:"SHADOWMAP_TYPE_VSM"};function ny(n){return ey[n.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}var iy={[ls]:"ENVMAP_TYPE_CUBE",[Rs]:"ENVMAP_TYPE_CUBE",[_o]:"ENVMAP_TYPE_CUBE_UV"};function sy(n){return n.envMap===!1?"ENVMAP_TYPE_CUBE":iy[n.envMapMode]||"ENVMAP_TYPE_CUBE"}var ry={[Rs]:"ENVMAP_MODE_REFRACTION"};function oy(n){return n.envMap===!1?"ENVMAP_MODE_REFLECTION":ry[n.envMapMode]||"ENVMAP_MODE_REFLECTION"}var ay={[xh]:"ENVMAP_BLENDING_MULTIPLY",[of]:"ENVMAP_BLENDING_MIX",[af]:"ENVMAP_BLENDING_ADD"};function ly(n){return n.envMap===!1?"ENVMAP_BLENDING_NONE":ay[n.combine]||"ENVMAP_BLENDING_NONE"}function cy(n){let t=n.envMapCubeUVHeight;if(t===null)return null;let e=Math.log2(t)-2,i=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),112)),texelHeight:i,maxMip:e}}function hy(n,t,e,i){let s=n.getContext(),r=e.defines,o=e.vertexShader,a=e.fragmentShader,l=ny(e),c=sy(e),u=oy(e),d=ly(e),h=cy(e),f=Yx(e),p=Zx(r),_=s.createProgram(),m,g,S=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(m=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,p].filter(Ao).join(`
`),m.length>0&&(m+=`
`),g=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,p].filter(Ao).join(`
`),g.length>0&&(g+=`
`)):(m=[Gf(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,p,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+u:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexNormals?"#define HAS_NORMAL":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Ao).join(`
`),g=[Gf(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,p,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+c:"",e.envMap?"#define "+u:"",e.envMap?"#define "+d:"",h?"#define CUBEUV_TEXEL_WIDTH "+h.texelWidth:"",h?"#define CUBEUV_TEXEL_HEIGHT "+h.texelHeight:"",h?"#define CUBEUV_MAX_MIP "+h.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.retroreflection?"#define USE_RETROREFLECTION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor?"#define USE_COLOR":"",e.vertexAlphas||e.batchingColor?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.numLightProbeGrids>0?"#define USE_LIGHT_PROBES_GRID":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==ti?"#define TONE_MAPPING":"",e.toneMapping!==ti?he.tonemapping_pars_fragment:"",e.toneMapping!==ti?Xx("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",he.colorspace_pars_fragment,Gx("linearToOutputTexel",e.outputColorSpace),qx(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(Ao).join(`
`)),o=nu(o),o=zf(o,e),o=Vf(o,e),a=nu(a),a=zf(a,e),a=Vf(a,e),o=Hf(o),a=Hf(a),e.isRawShaderMaterial!==!0&&(S=`#version 300 es
`,m=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,g=["#define varying in",e.glslVersion===Dh?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===Dh?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+g);let A=S+m+o,v=S+g+a,b=Of(s,s.VERTEX_SHADER,A),T=Of(s,s.FRAGMENT_SHADER,v);s.attachShader(_,b),s.attachShader(_,T),e.index0AttributeName!==void 0?s.bindAttribLocation(_,0,e.index0AttributeName):e.hasPositionAttribute===!0&&s.bindAttribLocation(_,0,"position"),s.linkProgram(_);function C(F){if(n.debug.checkShaderErrors){let B=s.getProgramInfoLog(_)||"",V=s.getShaderInfoLog(b)||"",I=s.getShaderInfoLog(T)||"",k=B.trim(),W=V.trim(),J=I.trim(),et=!0,U=!0;if(s.getProgramParameter(_,s.LINK_STATUS)===!1)if(et=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(s,_,b,T);else{let q=kf(s,b,"vertex"),j=kf(s,T,"fragment");Jt("WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(_,s.VALIDATE_STATUS)+`

Material Name: `+F.name+`
Material Type: `+F.type+`

Program Info Log: `+k+`
`+q+`
`+j)}else k!==""?Gt("WebGLProgram: Program Info Log:",k):(W===""||J==="")&&(U=!1);U&&(F.diagnostics={runnable:et,programLog:k,vertexShader:{log:W,prefix:m},fragmentShader:{log:J,prefix:g}})}s.deleteShader(b),s.deleteShader(T),y=new wr(s,_),w=Jx(s,_)}let y;this.getUniforms=function(){return y===void 0&&C(this),y};let w;this.getAttributes=function(){return w===void 0&&C(this),w};let P=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return P===!1&&(P=s.getProgramParameter(_,kx)),P},this.destroy=function(){i.releaseStatesOfProgram(this),s.deleteProgram(_),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=zx++,this.cacheKey=t,this.usedTimes=1,this.program=_,this.vertexShader=b,this.fragmentShader=T,this}var uy=0,iu=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t,e,i){let s=this._getShaderCacheForMaterial(t);return s.has(e)===!1&&(s.add(e),e.usedTimes++),s.has(i)===!1&&(s.add(i),i.usedTimes++),this}remove(t){let e=this.materialCache.get(t);for(let i of e)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(t),this}getVertexShaderStage(t){return this._getShaderStage(t.vertexShader)}getFragmentShaderStage(t){return this._getShaderStage(t.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){let e=this.materialCache,i=e.get(t);return i===void 0&&(i=new Set,e.set(t,i)),i}_getShaderStage(t){let e=this.shaderCache,i=e.get(t);return i===void 0&&(i=new su(t),e.set(t,i)),i}},su=class{constructor(t){this.id=uy++,this.code=t,this.usedTimes=0}};function dy(n){return n===us||n===bo||n===To}function fy(n,t,e,i,s,r){let o=new to,a=new iu,l=new Set,c=[],u=new Map,d=i.logarithmicDepthBuffer,h=i.precision,f={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function p(y){return l.add(y),y===0?"uv":`uv${y}`}function _(y,w,P,F,B,V){let I=F.fog,k=B.geometry,W=y.isMeshStandardMaterial||y.isMeshLambertMaterial||y.isMeshPhongMaterial?F.environment:null,J=y.isMeshStandardMaterial||y.isMeshLambertMaterial&&!y.envMap||y.isMeshPhongMaterial&&!y.envMap,et=t.get(y.envMap||W,J),U=et&&et.mapping===_o?et.image.height:null,q=f[y.type];y.precision!==null&&(h=i.getMaxPrecision(y.precision),h!==y.precision&&Gt("WebGLProgram.getParameters:",y.precision,"not supported, using",h,"instead."));let j=k.morphAttributes.position||k.morphAttributes.normal||k.morphAttributes.color,yt=j!==void 0?j.length:0,Tt=0;k.morphAttributes.position!==void 0&&(Tt=1),k.morphAttributes.normal!==void 0&&(Tt=2),k.morphAttributes.color!==void 0&&(Tt=3);let pe,qt,Et,Y;if(q){let Nt=vi[q];pe=Nt.vertexShader,qt=Nt.fragmentShader}else{pe=y.vertexShader,qt=y.fragmentShader;let Nt=a.getVertexShaderStage(y),Kt=a.getFragmentShaderStage(y);a.update(y,Nt,Kt),Et=Nt.id,Y=Kt.id}let K=n.getRenderTarget(),it=n.state.buffers.depth.getReversed(),Rt=B.isInstancedMesh===!0,ot=B.isBatchedMesh===!0,ut=!!y.map,Yt=!!y.matcap,Ot=!!et,Wt=!!y.aoMap,kt=!!y.lightMap,Dt=!!y.bumpMap&&y.wireframe===!1,te=!!y.normalMap,ue=!!y.displacementMap,be=!!y.emissiveMap,jt=!!y.metalnessMap,le=!!y.roughnessMap,R=y.anisotropy>0,ne=y.clearcoat>0,Pt=y.dispersion>0,E=y.retroreflectivity>0,x=y.iridescence>0,O=y.sheen>0,z=y.transmission>0,Z=R&&!!y.anisotropyMap,st=ne&&!!y.clearcoatMap,rt=ne&&!!y.clearcoatNormalMap,$=ne&&!!y.clearcoatRoughnessMap,Q=x&&!!y.iridescenceMap,at=x&&!!y.iridescenceThicknessMap,Ut=O&&!!y.sheenColorMap,dt=O&&!!y.sheenRoughnessMap,ct=!!y.specularMap,It=!!y.specularColorMap,Ht=!!y.specularIntensityMap,zt=z&&!!y.transmissionMap,N=z&&!!y.thicknessMap,ht=!!y.gradientMap,tt=!!y.alphaMap,lt=y.alphaTest>0,mt=!!y.alphaHash,nt=!!y.extensions,xt=ti;y.toneMapped&&(K===null||K.isXRRenderTarget===!0)&&(xt=n.toneMapping);let wt={shaderID:q,shaderType:y.type,shaderName:y.name,vertexShader:pe,fragmentShader:qt,defines:y.defines,customVertexShaderID:Et,customFragmentShaderID:Y,isRawShaderMaterial:y.isRawShaderMaterial===!0,glslVersion:y.glslVersion,precision:h,batching:ot,batchingColor:ot&&B._colorsTexture!==null,instancing:Rt,instancingColor:Rt&&B.instanceColor!==null,instancingMorph:Rt&&B.morphTexture!==null,outputColorSpace:K===null?n.outputColorSpace:K.isXRRenderTarget===!0?K.texture.colorSpace:ge.workingColorSpace,alphaToCoverage:!!y.alphaToCoverage,map:ut,matcap:Yt,envMap:Ot,envMapMode:Ot&&et.mapping,envMapCubeUVHeight:U,aoMap:Wt,lightMap:kt,bumpMap:Dt,normalMap:te,displacementMap:ue,emissiveMap:be,normalMapObjectSpace:te&&y.normalMapType===hf,normalMapTangentSpace:te&&y.normalMapType===ql,packedNormalMap:te&&y.normalMapType===ql&&dy(y.normalMap.format),metalnessMap:jt,roughnessMap:le,anisotropy:R,anisotropyMap:Z,clearcoat:ne,clearcoatMap:st,clearcoatNormalMap:rt,clearcoatRoughnessMap:$,dispersion:Pt,retroreflection:E,iridescence:x,iridescenceMap:Q,iridescenceThicknessMap:at,sheen:O,sheenColorMap:Ut,sheenRoughnessMap:dt,specularMap:ct,specularColorMap:It,specularIntensityMap:Ht,transmission:z,transmissionMap:zt,thicknessMap:N,gradientMap:ht,opaque:y.transparent===!1&&y.blending===vr&&y.alphaToCoverage===!1,alphaMap:tt,alphaTest:lt,alphaHash:mt,combine:y.combine,mapUv:ut&&p(y.map.channel),aoMapUv:Wt&&p(y.aoMap.channel),lightMapUv:kt&&p(y.lightMap.channel),bumpMapUv:Dt&&p(y.bumpMap.channel),normalMapUv:te&&p(y.normalMap.channel),displacementMapUv:ue&&p(y.displacementMap.channel),emissiveMapUv:be&&p(y.emissiveMap.channel),metalnessMapUv:jt&&p(y.metalnessMap.channel),roughnessMapUv:le&&p(y.roughnessMap.channel),anisotropyMapUv:Z&&p(y.anisotropyMap.channel),clearcoatMapUv:st&&p(y.clearcoatMap.channel),clearcoatNormalMapUv:rt&&p(y.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:$&&p(y.clearcoatRoughnessMap.channel),iridescenceMapUv:Q&&p(y.iridescenceMap.channel),iridescenceThicknessMapUv:at&&p(y.iridescenceThicknessMap.channel),sheenColorMapUv:Ut&&p(y.sheenColorMap.channel),sheenRoughnessMapUv:dt&&p(y.sheenRoughnessMap.channel),specularMapUv:ct&&p(y.specularMap.channel),specularColorMapUv:It&&p(y.specularColorMap.channel),specularIntensityMapUv:Ht&&p(y.specularIntensityMap.channel),transmissionMapUv:zt&&p(y.transmissionMap.channel),thicknessMapUv:N&&p(y.thicknessMap.channel),alphaMapUv:tt&&p(y.alphaMap.channel),vertexTangents:!!k.attributes.tangent&&(te||R),vertexNormals:!!k.attributes.normal,vertexColors:y.vertexColors,vertexAlphas:y.vertexColors===!0&&!!k.attributes.color&&k.attributes.color.itemSize===4,pointsUvs:B.isPoints===!0&&!!k.attributes.uv&&(ut||tt),fog:!!I,useFog:y.fog===!0,fogExp2:!!I&&I.isFogExp2,flatShading:y.wireframe===!1&&(y.flatShading===!0||k.attributes.normal===void 0&&te===!1&&(y.isMeshLambertMaterial||y.isMeshPhongMaterial||y.isMeshStandardMaterial||y.isMeshPhysicalMaterial)),sizeAttenuation:y.sizeAttenuation===!0,logarithmicDepthBuffer:d,reversedDepthBuffer:it,skinning:B.isSkinnedMesh===!0,hasPositionAttribute:k.attributes.position!==void 0,morphTargets:k.morphAttributes.position!==void 0,morphNormals:k.morphAttributes.normal!==void 0,morphColors:k.morphAttributes.color!==void 0,morphTargetsCount:yt,morphTextureStride:Tt,numSunLights:w.sun.length,numDirLights:w.directional.length,numPointLights:w.point.length,numSpotLights:w.spot.length,numSpotLightMaps:w.spotLightMap.length,numRectAreaLights:w.rectArea.length,numHemiLights:w.hemi.length,numSunLightShadows:w.sunShadowMap.length,numDirLightShadows:w.directionalShadowMap.length,numPointLightShadows:w.pointShadowMap.length,numSpotLightShadows:w.spotShadowMap.length,numSpotLightShadowsWithMaps:w.numSpotLightShadowsWithMaps,numLightProbes:w.numLightProbes,numLightProbeGrids:V.length,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:y.dithering,shadowMapEnabled:n.shadowMap.enabled&&P.length>0,shadowMapType:n.shadowMap.type,toneMapping:xt,decodeVideoTexture:ut&&y.map.isVideoTexture===!0&&ge.getTransfer(y.map.colorSpace)===Se,decodeVideoTextureEmissive:be&&y.emissiveMap.isVideoTexture===!0&&ge.getTransfer(y.emissiveMap.colorSpace)===Se,premultipliedAlpha:y.premultipliedAlpha,doubleSided:y.side===Xn,flipSided:y.side===gn,useDepthPacking:y.depthPacking>=0,depthPacking:y.depthPacking||0,index0AttributeName:y.index0AttributeName,extensionClipCullDistance:nt&&y.extensions.clipCullDistance===!0&&e.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(nt&&y.extensions.multiDraw===!0||ot)&&e.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:e.has("KHR_parallel_shader_compile"),customProgramCacheKey:y.customProgramCacheKey()};return wt.vertexUv1s=l.has(1),wt.vertexUv2s=l.has(2),wt.vertexUv3s=l.has(3),l.clear(),wt}function m(y){let w=[];if(y.shaderID?w.push(y.shaderID):(w.push(y.customVertexShaderID),w.push(y.customFragmentShaderID)),y.defines!==void 0)for(let P in y.defines)w.push(P),w.push(y.defines[P]);return y.isRawShaderMaterial===!1&&(g(w,y),S(w,y),w.push(n.outputColorSpace)),w.push(y.customProgramCacheKey),w.join()}function g(y,w){y.push(w.precision),y.push(w.outputColorSpace),y.push(w.envMapMode),y.push(w.envMapCubeUVHeight),y.push(w.mapUv),y.push(w.alphaMapUv),y.push(w.lightMapUv),y.push(w.aoMapUv),y.push(w.bumpMapUv),y.push(w.normalMapUv),y.push(w.displacementMapUv),y.push(w.emissiveMapUv),y.push(w.metalnessMapUv),y.push(w.roughnessMapUv),y.push(w.anisotropyMapUv),y.push(w.clearcoatMapUv),y.push(w.clearcoatNormalMapUv),y.push(w.clearcoatRoughnessMapUv),y.push(w.iridescenceMapUv),y.push(w.iridescenceThicknessMapUv),y.push(w.sheenColorMapUv),y.push(w.sheenRoughnessMapUv),y.push(w.specularMapUv),y.push(w.specularColorMapUv),y.push(w.specularIntensityMapUv),y.push(w.transmissionMapUv),y.push(w.thicknessMapUv),y.push(w.combine),y.push(w.fogExp2),y.push(w.sizeAttenuation),y.push(w.morphTargetsCount),y.push(w.morphAttributeCount),y.push(w.numSunLights),y.push(w.numDirLights),y.push(w.numPointLights),y.push(w.numSpotLights),y.push(w.numSpotLightMaps),y.push(w.numHemiLights),y.push(w.numRectAreaLights),y.push(w.numSunLightShadows),y.push(w.numDirLightShadows),y.push(w.numPointLightShadows),y.push(w.numSpotLightShadows),y.push(w.numSpotLightShadowsWithMaps),y.push(w.numLightProbes),y.push(w.shadowMapType),y.push(w.toneMapping),y.push(w.numClippingPlanes),y.push(w.numClipIntersection),y.push(w.depthPacking)}function S(y,w){o.disableAll(),w.instancing&&o.enable(0),w.instancingColor&&o.enable(1),w.instancingMorph&&o.enable(2),w.matcap&&o.enable(3),w.envMap&&o.enable(4),w.normalMapObjectSpace&&o.enable(5),w.normalMapTangentSpace&&o.enable(6),w.clearcoat&&o.enable(7),w.iridescence&&o.enable(8),w.alphaTest&&o.enable(9),w.vertexColors&&o.enable(10),w.vertexAlphas&&o.enable(11),w.vertexUv1s&&o.enable(12),w.vertexUv2s&&o.enable(13),w.vertexUv3s&&o.enable(14),w.vertexTangents&&o.enable(15),w.anisotropy&&o.enable(16),w.alphaHash&&o.enable(17),w.batching&&o.enable(18),w.dispersion&&o.enable(19),w.retroreflection&&o.enable(24),w.batchingColor&&o.enable(20),w.gradientMap&&o.enable(21),w.packedNormalMap&&o.enable(22),w.vertexNormals&&o.enable(23),y.push(o.mask),o.disableAll(),w.fog&&o.enable(0),w.useFog&&o.enable(1),w.flatShading&&o.enable(2),w.logarithmicDepthBuffer&&o.enable(3),w.reversedDepthBuffer&&o.enable(4),w.skinning&&o.enable(5),w.morphTargets&&o.enable(6),w.morphNormals&&o.enable(7),w.morphColors&&o.enable(8),w.premultipliedAlpha&&o.enable(9),w.shadowMapEnabled&&o.enable(10),w.doubleSided&&o.enable(11),w.flipSided&&o.enable(12),w.useDepthPacking&&o.enable(13),w.dithering&&o.enable(14),w.transmission&&o.enable(15),w.sheen&&o.enable(16),w.opaque&&o.enable(17),w.pointsUvs&&o.enable(18),w.decodeVideoTexture&&o.enable(19),w.decodeVideoTextureEmissive&&o.enable(20),w.alphaToCoverage&&o.enable(21),w.numLightProbeGrids>0&&o.enable(22),w.hasPositionAttribute&&o.enable(23),y.push(o.mask)}function A(y){let w=f[y.type],P;if(w){let F=vi[w];P=Tf.clone(F.uniforms)}else P=y.uniforms;return P}function v(y,w){let P=u.get(w);return P!==void 0?++P.usedTimes:(P=new hy(n,w,y,s),c.push(P),u.set(w,P)),P}function b(y){if(--y.usedTimes===0){let w=c.indexOf(y);c[w]=c[c.length-1],c.pop(),u.delete(y.cacheKey),y.destroy()}}function T(y){a.remove(y)}function C(){a.dispose()}return{getParameters:_,getProgramCacheKey:m,getUniforms:A,acquireProgram:v,releaseProgram:b,releaseShaderCache:T,programs:c,dispose:C}}function py(){let n=new WeakMap;function t(o){return n.has(o)}function e(o){let a=n.get(o);return a===void 0&&(a={},n.set(o,a)),a}function i(o){n.delete(o)}function s(o,a,l){n.get(o)[a]=l}function r(){n=new WeakMap}return{has:t,get:e,remove:i,update:s,dispose:r}}function my(n,t){return n.groupOrder!==t.groupOrder?n.groupOrder-t.groupOrder:n.renderOrder!==t.renderOrder?n.renderOrder-t.renderOrder:n.material.id!==t.material.id?n.material.id-t.material.id:n.materialVariant!==t.materialVariant?n.materialVariant-t.materialVariant:n.z!==t.z?n.z-t.z:n.id-t.id}function Wf(n,t){return n.groupOrder!==t.groupOrder?n.groupOrder-t.groupOrder:n.renderOrder!==t.renderOrder?n.renderOrder-t.renderOrder:n.z!==t.z?t.z-n.z:n.id-t.id}function Xf(){let n=[],t=0,e=[],i=[],s=[];function r(){t=0,e.length=0,i.length=0,s.length=0}function o(h){let f=0;return h.isInstancedMesh&&(f+=2),h.isSkinnedMesh&&(f+=1),f}function a(h,f,p,_,m,g){let S=n[t];return S===void 0?(S={id:h.id,object:h,geometry:f,material:p,materialVariant:o(h),groupOrder:_,renderOrder:h.renderOrder,z:m,group:g},n[t]=S):(S.id=h.id,S.object=h,S.geometry=f,S.material=p,S.materialVariant=o(h),S.groupOrder=_,S.renderOrder=h.renderOrder,S.z=m,S.group=g),t++,S}function l(h,f,p,_,m,g,S){S.reversedDepth===!0&&(m=-m);let A=a(h,f,p,_,m,g);p.transmission>0?i.push(A):p.transparent===!0?s.push(A):e.push(A)}function c(h,f,p,_,m,g){let S=a(h,f,p,_,m,g);p.transmission>0?i.unshift(S):p.transparent===!0?s.unshift(S):e.unshift(S)}function u(h,f){e.length>1&&e.sort(h||my),i.length>1&&i.sort(f||Wf),s.length>1&&s.sort(f||Wf)}function d(){for(let h=t,f=n.length;h<f;h++){let p=n[h];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:e,transmissive:i,transparent:s,init:r,push:l,unshift:c,finish:d,sort:u}}function gy(){let n=new WeakMap;function t(i,s){let r=n.get(i),o;return r===void 0?(o=new Xf,n.set(i,[o])):s>=r.length?(o=new Xf,r.push(o)):o=r[s],o}function e(){n=new WeakMap}return{get:t,dispose:e}}function _y(){let n={};return{get:function(t){if(n[t.id]!==void 0)return n[t.id];let e;switch(t.type){case"SunLight":case"DirectionalLight":e={direction:new L,color:new ae};break;case"SpotLight":e={position:new L,direction:new L,color:new ae,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new L,color:new ae,distance:0,decay:0};break;case"HemisphereLight":e={direction:new L,skyColor:new ae,groundColor:new ae};break;case"RectAreaLight":e={color:new ae,position:new L,halfWidth:new L,halfHeight:new L};break}return n[t.id]=e,e}}}function xy(){let n={};return{get:function(t){if(n[t.id]!==void 0)return n[t.id];let e;switch(t.type){case"SunLight":case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Zt};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Zt};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Zt,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[t.id]=e,e}}}var yy=0;function vy(n,t){return(t.castShadow?2:0)-(n.castShadow?2:0)+(t.map?1:0)-(n.map?1:0)}function My(n){let t=new _y,e=xy(),i={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)i.probe.push(new L);let s=new L,r=new De,o=new De;function a(c){let u=0,d=0,h=0;for(let B=0;B<9;B++)i.probe[B].set(0,0,0);let f=0,p=0,_=0,m=0,g=0,S=0,A=0,v=0,b=0,T=0,C=0,y=0,w=0,P=0;c.sort(vy);for(let B=0,V=c.length;B<V;B++){let I=c[B],k=I.color,W=I.intensity,J=I.distance,et=null;if(I.shadow&&I.shadow.map&&(I.shadow.map.texture.format===us?et=I.shadow.map.texture:et=I.shadow.map.depthTexture||I.shadow.map.texture),I.isAmbientLight)u+=k.r*W,d+=k.g*W,h+=k.b*W;else if(I.isLightProbe){for(let U=0;U<9;U++)i.probe[U].addScaledVector(I.sh.coefficients[U],W);P++}else if(I.isSunLight){let U=t.get(I);if(U.color.copy(I.color).multiplyScalar(I.intensity),I.castShadow){let q=I.shadow,j=e.get(I);j.shadowIntensity=q.intensity,j.shadowBias=q.bias,j.shadowNormalBias=q.normalBias,j.shadowRadius=q.radius,j.shadowMapSize.copy(q.mapSize).multiply(q.getFrameExtents()),i.sunShadow[p]=j,i.sunShadowMap[p]=et;let yt=q.getViewportCount();for(let Tt=0;Tt<yt;Tt++)i.sunShadowMatrix[_+Tt]=q.getMatrix(Tt),i.sunShadowCascade[_+Tt]=q._cascadeData[Tt];_+=yt,p++}i.sun[f]=U,f++}else if(I.isDirectionalLight){let U=t.get(I);if(U.color.copy(I.color).multiplyScalar(I.intensity),I.castShadow){let q=I.shadow,j=e.get(I);j.shadowIntensity=q.intensity,j.shadowBias=q.bias,j.shadowNormalBias=q.normalBias,j.shadowRadius=q.radius,j.shadowMapSize=q.mapSize,i.directionalShadow[m]=j,i.directionalShadowMap[m]=et,i.directionalShadowMatrix[m]=I.shadow.matrix,b++}i.directional[m]=U,m++}else if(I.isSpotLight){let U=t.get(I);U.position.setFromMatrixPosition(I.matrixWorld),U.color.copy(k).multiplyScalar(W),U.distance=J,U.coneCos=Math.cos(I.angle),U.penumbraCos=Math.cos(I.angle*(1-I.penumbra)),U.decay=I.decay,i.spot[S]=U;let q=I.shadow;if(I.map&&(i.spotLightMap[y]=I.map,y++,q.updateMatrices(I),I.castShadow&&w++),i.spotLightMatrix[S]=q.matrix,I.castShadow){let j=e.get(I);j.shadowIntensity=q.intensity,j.shadowBias=q.bias,j.shadowNormalBias=q.normalBias,j.shadowRadius=q.radius,j.shadowMapSize=q.mapSize,i.spotShadow[S]=j,i.spotShadowMap[S]=et,C++}S++}else if(I.isRectAreaLight){let U=t.get(I);U.color.copy(k).multiplyScalar(W),U.halfWidth.set(I.width*.5,0,0),U.halfHeight.set(0,I.height*.5,0),i.rectArea[A]=U,A++}else if(I.isPointLight){let U=t.get(I);if(U.color.copy(I.color).multiplyScalar(I.intensity),U.distance=I.distance,U.decay=I.decay,I.castShadow){let q=I.shadow,j=e.get(I);j.shadowIntensity=q.intensity,j.shadowBias=q.bias,j.shadowNormalBias=q.normalBias,j.shadowRadius=q.radius,j.shadowMapSize=q.mapSize,j.shadowCameraNear=q.camera.near,j.shadowCameraFar=q.camera.far,i.pointShadow[g]=j,i.pointShadowMap[g]=et,i.pointShadowMatrix[g]=I.shadow.matrix,T++}i.point[g]=U,g++}else if(I.isHemisphereLight){let U=t.get(I);U.skyColor.copy(I.color).multiplyScalar(W),U.groundColor.copy(I.groundColor).multiplyScalar(W),i.hemi[v]=U,v++}}A>0&&(n.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=pt.LTC_FLOAT_1,i.rectAreaLTC2=pt.LTC_FLOAT_2):(i.rectAreaLTC1=pt.LTC_HALF_1,i.rectAreaLTC2=pt.LTC_HALF_2)),i.ambient[0]=u,i.ambient[1]=d,i.ambient[2]=h;let F=i.hash;(F.sunLength!==f||F.directionalLength!==m||F.pointLength!==g||F.spotLength!==S||F.rectAreaLength!==A||F.hemiLength!==v||F.numSunShadows!==p||F.numDirectionalShadows!==b||F.numPointShadows!==T||F.numSpotShadows!==C||F.numSpotMaps!==y||F.numLightProbes!==P)&&(i.sun.length=f,i.directional.length=m,i.spot.length=S,i.rectArea.length=A,i.point.length=g,i.hemi.length=v,i.sunShadow.length=p,i.sunShadowMap.length=p,i.sunShadowMatrix.length=_,i.sunShadowCascade.length=_,i.directionalShadow.length=b,i.directionalShadowMap.length=b,i.directionalShadowMatrix.length=b,i.pointShadow.length=T,i.pointShadowMap.length=T,i.pointShadowMatrix.length=T,i.spotShadow.length=C,i.spotShadowMap.length=C,i.spotLightMatrix.length=C+y-w,i.spotLightMap.length=y,i.numSpotLightShadowsWithMaps=w,i.numLightProbes=P,F.sunLength=f,F.directionalLength=m,F.pointLength=g,F.spotLength=S,F.rectAreaLength=A,F.hemiLength=v,F.numSunShadows=p,F.numDirectionalShadows=b,F.numPointShadows=T,F.numSpotShadows=C,F.numSpotMaps=y,F.numLightProbes=P,i.version=yy++)}function l(c,u){let d=0,h=0,f=0,p=0,_=0,m=0,g=u.matrixWorldInverse;for(let S=0,A=c.length;S<A;S++){let v=c[S];if(v.isSunLight){let b=i.sun[d];b.direction.setFromMatrixPosition(v.matrixWorld),b.direction.transformDirection(g),d++}else if(v.isDirectionalLight){let b=i.directional[h];b.direction.setFromMatrixPosition(v.matrixWorld),s.setFromMatrixPosition(v.target.matrixWorld),b.direction.sub(s),b.direction.transformDirection(g),h++}else if(v.isSpotLight){let b=i.spot[p];b.position.setFromMatrixPosition(v.matrixWorld),b.position.applyMatrix4(g),b.direction.setFromMatrixPosition(v.matrixWorld),s.setFromMatrixPosition(v.target.matrixWorld),b.direction.sub(s),b.direction.transformDirection(g),p++}else if(v.isRectAreaLight){let b=i.rectArea[_];b.position.setFromMatrixPosition(v.matrixWorld),b.position.applyMatrix4(g),o.identity(),r.copy(v.matrixWorld),r.premultiply(g),o.extractRotation(r),b.halfWidth.set(v.width*.5,0,0),b.halfHeight.set(0,v.height*.5,0),b.halfWidth.applyMatrix4(o),b.halfHeight.applyMatrix4(o),_++}else if(v.isPointLight){let b=i.point[f];b.position.setFromMatrixPosition(v.matrixWorld),b.position.applyMatrix4(g),f++}else if(v.isHemisphereLight){let b=i.hemi[m];b.direction.setFromMatrixPosition(v.matrixWorld),b.direction.transformDirection(g),m++}}}return{setup:a,setupView:l,state:i}}function qf(n){let t=new My(n),e=[],i=[],s=[];function r(h){d.camera=h,e.length=0,i.length=0,s.length=0}function o(h){e.push(h)}function a(h){i.push(h)}function l(h){s.push(h)}function c(){t.setup(e)}function u(h){t.setupView(e,h)}let d={lightsArray:e,shadowsArray:i,lightProbeGridArray:s,camera:null,lights:t,transmissionRenderTarget:{},textureUnits:0};return{init:r,state:d,setupLights:c,setupLightsView:u,pushLight:o,pushShadow:a,pushLightProbeGrid:l}}function Sy(n){let t=new WeakMap;function e(s,r=0){let o=t.get(s),a;return o===void 0?(a=new qf(n),t.set(s,[a])):r>=o.length?(a=new qf(n),o.push(a)):a=o[r],a}function i(){t=new WeakMap}return{get:e,dispose:i}}var by=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Ty=`uniform sampler2D shadow_pass;
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
}`,Ey=[new L(1,0,0),new L(-1,0,0),new L(0,1,0),new L(0,-1,0),new L(0,0,1),new L(0,0,-1)],wy=[new L(0,-1,0),new L(0,-1,0),new L(0,0,1),new L(0,0,-1),new L(0,-1,0),new L(0,-1,0)],Yf=new De,wo=new L,Kh=new L;function Ay(n,t,e){let i=new dr,s=new Zt,r=new Zt,o=new Ne,a=new Xa,l=new qa,c={},u=e.maxTextureSize,d={[as]:gn,[gn]:as,[Xn]:Xn},h=new Un({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Zt},radius:{value:4}},vertexShader:by,fragmentShader:Ty}),f=h.clone();f.defines.HORIZONTAL_PASS=1;let p=new Ge;p.setAttribute("position",new Wn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let _=new fn(p,h),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=mo;let g=this.type;this.render=function(T,C,y){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||T.length===0)return;this.type===zd&&(Gt("WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead."),this.type=mo);let w=n.getRenderTarget(),P=n.getActiveCubeFace(),F=n.getActiveMipmapLevel(),B=n.state;B.setBlending(xi),B.buffers.depth.getReversed()===!0?B.buffers.color.setClear(0,0,0,0):B.buffers.color.setClear(1,1,1,1),B.buffers.depth.setTest(!0),B.setScissorTest(!1);let V=g!==this.type;V&&C.traverse(function(I){I.material&&(Array.isArray(I.material)?I.material.forEach(k=>k.needsUpdate=!0):I.material.needsUpdate=!0)});for(let I=0,k=T.length;I<k;I++){let W=T[I],J=W.shadow;if(J===void 0){Gt("WebGLShadowMap:",W,"has no shadow.");continue}if(J.autoUpdate===!1&&J.needsUpdate===!1)continue;s.copy(J.mapSize);let et=J.getFrameExtents();s.multiply(et),r.copy(J.mapSize),(s.x>u||s.y>u)&&(s.x>u&&(r.x=Math.floor(u/et.x),s.x=r.x*et.x,J.mapSize.x=r.x),s.y>u&&(r.y=Math.floor(u/et.y),s.y=r.y*et.y,J.mapSize.y=r.y));let U=n.state.buffers.depth.getReversed();if(J.camera._reversedDepth=U,J.map===null||V===!0){if(J.map!==null&&(J.map.depthTexture!==null&&(J.map.depthTexture.dispose(),J.map.depthTexture=null),J.map.dispose()),this.type===yr){if(W.isPointLight){Gt("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}J.map=new bn(s.x,s.y,{format:us,type:ii,minFilter:Qe,magFilter:Qe,generateMipmaps:!1}),J.map.texture.name=W.name+".shadowMap",J.map.depthTexture=new Qi(s.x,s.y,ni),J.map.depthTexture.name=W.name+".shadowMapDepth",J.map.depthTexture.format=gi,J.map.depthTexture.compareFunction=null,J.map.depthTexture.minFilter=$e,J.map.depthTexture.magFilter=$e}else W.isPointLight?(J.map=new jl(s.x),J.map.depthTexture=new Ha(s.x,ei)):(J.map=new bn(s.x,s.y),J.map.depthTexture=new Qi(s.x,s.y,ei)),J.map.depthTexture.name=W.name+".shadowMap",J.map.depthTexture.format=gi,this.type===mo?(J.map.depthTexture.compareFunction=U?Zl:Yl,J.map.depthTexture.minFilter=Qe,J.map.depthTexture.magFilter=Qe):(J.map.depthTexture.compareFunction=null,J.map.depthTexture.minFilter=$e,J.map.depthTexture.magFilter=$e);J.camera.updateProjectionMatrix()}J.map.isWebGLCubeRenderTarget!==!0&&(J.map.width!==s.x||J.map.height!==s.y)&&J.map.setSize(s.x,s.y);let q=J.map.isWebGLCubeRenderTarget?6:J.getViewportCount();W.isPointLight!==!0&&J.updateMatrices(W,y);for(let j=0;j<q;j++){let yt=J.getCamera(j);if(W.isPointLight){let Tt=J.camera,pe=J.matrix,qt=W.distance||Tt.far;qt!==Tt.far&&(Tt.far=qt,Tt.updateProjectionMatrix()),wo.setFromMatrixPosition(W.matrixWorld),Tt.position.copy(wo),Kh.copy(Tt.position),Kh.add(Ey[j]),Tt.up.copy(wy[j]),Tt.lookAt(Kh),Tt.updateMatrixWorld(),pe.makeTranslation(-wo.x,-wo.y,-wo.z),Yf.multiplyMatrices(Tt.projectionMatrix,Tt.matrixWorldInverse),J._frustum.setFromProjectionMatrix(Yf,Tt.coordinateSystem,Tt.reversedDepth)}if(J.map.isWebGLCubeRenderTarget)n.setRenderTarget(J.map,j),n.clear();else{j===0&&(n.setRenderTarget(J.map),n.clear());let Tt=J.getViewport(j);o.set(r.x*Tt.x,r.y*Tt.y,r.x*Tt.z,r.y*Tt.w),B.viewport(o)}i=J.getFrustum(j),v(C,y,yt,W,this.type)}J.isPointLightShadow!==!0&&this.type===yr&&S(J,y),J.needsUpdate=!1}g=this.type,m.needsUpdate=!1,n.setRenderTarget(w,P,F)};function S(T,C){let y=t.update(_);h.defines.VSM_SAMPLES!==T.blurSamples&&(h.defines.VSM_SAMPLES=T.blurSamples,f.defines.VSM_SAMPLES=T.blurSamples,h.needsUpdate=!0,f.needsUpdate=!0),T.mapPass===null?T.mapPass=new bn(s.x,s.y,{format:us,type:ii}):(T.mapPass.width!==T.map.width||T.mapPass.height!==T.map.height)&&T.mapPass.setSize(T.map.width,T.map.height),h.uniforms.shadow_pass.value=T.map.depthTexture,h.uniforms.resolution.value.set(T.map.width,T.map.height),h.uniforms.radius.value=T.radius,n.setRenderTarget(T.mapPass),n.clear(),n.renderBufferDirect(C,null,y,h,_,null),f.uniforms.shadow_pass.value=T.mapPass.texture,f.uniforms.resolution.value.set(T.map.width,T.map.height),f.uniforms.radius.value=T.radius,n.setRenderTarget(T.map),n.clear(),n.renderBufferDirect(C,null,y,f,_,null)}function A(T,C,y,w){let P=null,F=y.isPointLight===!0?T.customDistanceMaterial:T.customDepthMaterial;if(F!==void 0)P=F;else if(P=y.isPointLight===!0?l:a,n.localClippingEnabled&&C.clipShadows===!0&&Array.isArray(C.clippingPlanes)&&C.clippingPlanes.length!==0||C.displacementMap&&C.displacementScale!==0||C.alphaMap&&C.alphaTest>0||C.map&&C.alphaTest>0||C.alphaToCoverage===!0){let B=P.uuid,V=C.uuid,I=c[B];I===void 0&&(I={},c[B]=I);let k=I[V];k===void 0&&(k=P.clone(),I[V]=k,C.addEventListener("dispose",b)),P=k}if(P.visible=C.visible,P.wireframe=C.wireframe,w===yr?P.side=C.shadowSide!==null?C.shadowSide:C.side:P.side=C.shadowSide!==null?C.shadowSide:d[C.side],P.alphaMap=C.alphaMap,P.alphaTest=C.alphaToCoverage===!0?.5:C.alphaTest,P.map=C.map,P.clipShadows=C.clipShadows,P.clippingPlanes=C.clippingPlanes,P.clipIntersection=C.clipIntersection,P.displacementMap=C.displacementMap,P.displacementScale=C.displacementScale,P.displacementBias=C.displacementBias,P.wireframeLinewidth=C.wireframeLinewidth,P.linewidth=C.linewidth,y.isPointLight===!0&&P.isMeshDistanceMaterial===!0){let B=n.properties.get(P);B.light=y}return P}function v(T,C,y,w,P){if(T.visible===!1)return;if(T.layers.test(C.layers)&&(T.isMesh||T.isLine||T.isPoints)&&(T.castShadow||T.receiveShadow&&P===yr)&&(!T.frustumCulled||T.intersectsFrustum(i))){T.modelViewMatrix.multiplyMatrices(y.matrixWorldInverse,T.matrixWorld);let V=t.update(T),I=T.material;if(Array.isArray(I)){let k=V.groups;for(let W=0,J=k.length;W<J;W++){let et=k[W],U=I[et.materialIndex];if(U&&U.visible){let q=A(T,U,w,P);T.onBeforeShadow(n,T,C,y,V,q,et),n.renderBufferDirect(y,null,V,q,T,et),T.onAfterShadow(n,T,C,y,V,q,et)}}}else if(I.visible){let k=A(T,I,w,P);T.onBeforeShadow(n,T,C,y,V,k,null),n.renderBufferDirect(y,null,V,k,T,null),T.onAfterShadow(n,T,C,y,V,k,null)}}let B=T.children;for(let V=0,I=B.length;V<I;V++)v(B[V],C,y,w,P)}function b(T){T.target.removeEventListener("dispose",b);for(let y in c){let w=c[y],P=T.target.uuid;P in w&&(w[P].dispose(),delete w[P])}}}function Cy(n,t){function e(){let N=!1,ht=new Ne,tt=null,lt=new Ne(0,0,0,0);return{setMask:function(mt){tt!==mt&&!N&&(n.colorMask(mt,mt,mt,mt),tt=mt)},setLocked:function(mt){N=mt},setClear:function(mt,nt,xt,wt,Nt){Nt===!0&&(mt*=wt,nt*=wt,xt*=wt),ht.set(mt,nt,xt,wt),lt.equals(ht)===!1&&(n.clearColor(mt,nt,xt,wt),lt.copy(ht))},reset:function(){N=!1,tt=null,lt.set(-1,0,0,0)}}}function i(){let N=!1,ht=!1,tt=null,lt=null,mt=null;return{setReversed:function(nt){if(ht!==nt){let xt=t.get("EXT_clip_control");nt?xt.clipControlEXT(xt.LOWER_LEFT_EXT,xt.ZERO_TO_ONE_EXT):xt.clipControlEXT(xt.LOWER_LEFT_EXT,xt.NEGATIVE_ONE_TO_ONE_EXT),ht=nt;let wt=mt;mt=null,this.setClear(wt)}},getReversed:function(){return ht},setTest:function(nt){nt?K(n.DEPTH_TEST):it(n.DEPTH_TEST)},setMask:function(nt){tt!==nt&&!N&&(n.depthMask(nt),tt=nt)},setFunc:function(nt){if(ht&&(nt=Sf[nt]),lt!==nt){switch(nt){case wa:n.depthFunc(n.NEVER);break;case Aa:n.depthFunc(n.ALWAYS);break;case Ca:n.depthFunc(n.LESS);break;case rr:n.depthFunc(n.LEQUAL);break;case Ra:n.depthFunc(n.EQUAL);break;case Pa:n.depthFunc(n.GEQUAL);break;case Ia:n.depthFunc(n.GREATER);break;case La:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}lt=nt}},setLocked:function(nt){N=nt},setClear:function(nt){mt!==nt&&(mt=nt,ht&&(nt=1-nt),n.clearDepth(nt))},reset:function(){N=!1,tt=null,lt=null,mt=null,ht=!1}}}function s(){let N=!1,ht=null,tt=null,lt=null,mt=null,nt=null,xt=null,wt=null,Nt=null;return{setTest:function(Kt){N||(Kt?K(n.STENCIL_TEST):it(n.STENCIL_TEST))},setMask:function(Kt){ht!==Kt&&!N&&(n.stencilMask(Kt),ht=Kt)},setFunc:function(Kt,Bn,Cn){(tt!==Kt||lt!==Bn||mt!==Cn)&&(n.stencilFunc(Kt,Bn,Cn),tt=Kt,lt=Bn,mt=Cn)},setOp:function(Kt,Bn,Cn){(nt!==Kt||xt!==Bn||wt!==Cn)&&(n.stencilOp(Kt,Bn,Cn),nt=Kt,xt=Bn,wt=Cn)},setLocked:function(Kt){N=Kt},setClear:function(Kt){Nt!==Kt&&(n.clearStencil(Kt),Nt=Kt)},reset:function(){N=!1,ht=null,tt=null,lt=null,mt=null,nt=null,xt=null,wt=null,Nt=null}}}let r=new e,o=new i,a=new s,l=new WeakMap,c=new WeakMap,u={},d={},h={},f=new WeakMap,p=[],_=null,m=!1,g=null,S=null,A=null,v=null,b=null,T=null,C=null,y=new ae(0,0,0),w=0,P=!1,F=null,B=null,V=null,I=null,k=null,W=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS),J=!1,et=0,U=n.getParameter(n.VERSION);U.indexOf("WebGL")!==-1?(et=parseFloat(/^WebGL (\d)/.exec(U)[1]),J=et>=1):U.indexOf("OpenGL ES")!==-1&&(et=parseFloat(/^OpenGL ES (\d)/.exec(U)[1]),J=et>=2);let q=null,j={},yt=n.getParameter(n.SCISSOR_BOX),Tt=n.getParameter(n.VIEWPORT),pe=new Ne().fromArray(yt),qt=new Ne().fromArray(Tt);function Et(N,ht,tt,lt){let mt=new Uint8Array(4),nt=n.createTexture();n.bindTexture(N,nt),n.texParameteri(N,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(N,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let xt=0;xt<tt;xt++)N===n.TEXTURE_3D||N===n.TEXTURE_2D_ARRAY?n.texImage3D(ht,0,n.RGBA,1,1,lt,0,n.RGBA,n.UNSIGNED_BYTE,mt):n.texImage2D(ht+xt,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,mt);return nt}let Y={};Y[n.TEXTURE_2D]=Et(n.TEXTURE_2D,n.TEXTURE_2D,1),Y[n.TEXTURE_CUBE_MAP]=Et(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),Y[n.TEXTURE_2D_ARRAY]=Et(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),Y[n.TEXTURE_3D]=Et(n.TEXTURE_3D,n.TEXTURE_3D,1,1),r.setClear(0,0,0,1),o.setClear(1),a.setClear(0),K(n.DEPTH_TEST),o.setFunc(rr),Dt(!1),te(dh),K(n.CULL_FACE),Wt(xi);function K(N){u[N]!==!0&&(n.enable(N),u[N]=!0)}function it(N){u[N]!==!1&&(n.disable(N),u[N]=!1)}function Rt(N,ht){return h[N]!==ht?(n.bindFramebuffer(N,ht),h[N]=ht,N===n.DRAW_FRAMEBUFFER&&(h[n.FRAMEBUFFER]=ht),N===n.FRAMEBUFFER&&(h[n.DRAW_FRAMEBUFFER]=ht),!0):!1}function ot(N,ht){let tt=p,lt=!1;if(N){tt=f.get(ht),tt===void 0&&(tt=[],f.set(ht,tt));let mt=N.textures;if(tt.length!==mt.length||tt[0]!==n.COLOR_ATTACHMENT0){for(let nt=0,xt=mt.length;nt<xt;nt++)tt[nt]=n.COLOR_ATTACHMENT0+nt;tt.length=mt.length,lt=!0}}else tt[0]!==n.BACK&&(tt[0]=n.BACK,lt=!0);lt&&n.drawBuffers(tt)}function ut(N){return _!==N?(n.useProgram(N),_=N,!0):!1}let Yt={[Cs]:n.FUNC_ADD,[Hd]:n.FUNC_SUBTRACT,[Gd]:n.FUNC_REVERSE_SUBTRACT};Yt[Wd]=n.MIN,Yt[Xd]=n.MAX;let Ot={[qd]:n.ZERO,[Yd]:n.ONE,[Zd]:n.SRC_COLOR,[gh]:n.SRC_ALPHA,[tf]:n.SRC_ALPHA_SATURATE,[jd]:n.DST_COLOR,[$d]:n.DST_ALPHA,[Jd]:n.ONE_MINUS_SRC_COLOR,[_h]:n.ONE_MINUS_SRC_ALPHA,[Qd]:n.ONE_MINUS_DST_COLOR,[Kd]:n.ONE_MINUS_DST_ALPHA,[ef]:n.CONSTANT_COLOR,[nf]:n.ONE_MINUS_CONSTANT_COLOR,[sf]:n.CONSTANT_ALPHA,[rf]:n.ONE_MINUS_CONSTANT_ALPHA};function Wt(N,ht,tt,lt,mt,nt,xt,wt,Nt,Kt){if(N===xi){m===!0&&(it(n.BLEND),m=!1);return}if(m===!1&&(K(n.BLEND),m=!0),N!==Vd){if(N!==g||Kt!==P){if((S!==Cs||b!==Cs)&&(n.blendEquation(n.FUNC_ADD),S=Cs,b=Cs),Kt)switch(N){case vr:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case fh:n.blendFunc(n.ONE,n.ONE);break;case ph:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case mh:n.blendFuncSeparate(n.DST_COLOR,n.ONE_MINUS_SRC_ALPHA,n.ZERO,n.ONE);break;default:Jt("WebGLState: Invalid blending: ",N);break}else switch(N){case vr:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case fh:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE,n.ONE,n.ONE);break;case ph:Jt("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case mh:Jt("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:Jt("WebGLState: Invalid blending: ",N);break}A=null,v=null,T=null,C=null,y.set(0,0,0),w=0,g=N,P=Kt}return}mt=mt||ht,nt=nt||tt,xt=xt||lt,(ht!==S||mt!==b)&&(n.blendEquationSeparate(Yt[ht],Yt[mt]),S=ht,b=mt),(tt!==A||lt!==v||nt!==T||xt!==C)&&(n.blendFuncSeparate(Ot[tt],Ot[lt],Ot[nt],Ot[xt]),A=tt,v=lt,T=nt,C=xt),(wt.equals(y)===!1||Nt!==w)&&(n.blendColor(wt.r,wt.g,wt.b,Nt),y.copy(wt),w=Nt),g=N,P=!1}function kt(N,ht){N.side===Xn?it(n.CULL_FACE):K(n.CULL_FACE);let tt=N.side===gn;ht&&(tt=!tt),Dt(tt),N.blending===vr&&N.transparent===!1?Wt(xi):Wt(N.blending,N.blendEquation,N.blendSrc,N.blendDst,N.blendEquationAlpha,N.blendSrcAlpha,N.blendDstAlpha,N.blendColor,N.blendAlpha,N.premultipliedAlpha),o.setFunc(N.depthFunc),o.setTest(N.depthTest),o.setMask(N.depthWrite),r.setMask(N.colorWrite);let lt=N.stencilWrite;a.setTest(lt),lt&&(a.setMask(N.stencilWriteMask),a.setFunc(N.stencilFunc,N.stencilRef,N.stencilFuncMask),a.setOp(N.stencilFail,N.stencilZFail,N.stencilZPass)),be(N.polygonOffset,N.polygonOffsetFactor,N.polygonOffsetUnits),N.alphaToCoverage===!0?K(n.SAMPLE_ALPHA_TO_COVERAGE):it(n.SAMPLE_ALPHA_TO_COVERAGE)}function Dt(N){F!==N&&(N?n.frontFace(n.CW):n.frontFace(n.CCW),F=N)}function te(N){N!==Bd?(K(n.CULL_FACE),N!==B&&(N===dh?n.cullFace(n.BACK):N===kd?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):it(n.CULL_FACE),B=N}function ue(N){N!==V&&(J&&n.lineWidth(N),V=N)}function be(N,ht,tt){N?(K(n.POLYGON_OFFSET_FILL),(I!==ht||k!==tt)&&(I=ht,k=tt,o.getReversed()&&(ht=-ht),n.polygonOffset(ht,tt))):it(n.POLYGON_OFFSET_FILL)}function jt(N){N?K(n.SCISSOR_TEST):it(n.SCISSOR_TEST)}function le(N){N===void 0&&(N=n.TEXTURE0+W-1),q!==N&&(n.activeTexture(N),q=N)}function R(N,ht,tt){tt===void 0&&(q===null?tt=n.TEXTURE0+W-1:tt=q);let lt=j[tt];lt===void 0&&(lt={type:void 0,texture:void 0},j[tt]=lt),(lt.type!==N||lt.texture!==ht)&&(q!==tt&&(n.activeTexture(tt),q=tt),n.bindTexture(N,ht||Y[N]),lt.type=N,lt.texture=ht)}function ne(){let N=j[q];N!==void 0&&N.type!==void 0&&(n.bindTexture(N.type,null),N.type=void 0,N.texture=void 0)}function Pt(){try{n.compressedTexImage2D(...arguments)}catch(N){Jt("WebGLState:",N)}}function E(){try{n.compressedTexImage3D(...arguments)}catch(N){Jt("WebGLState:",N)}}function x(){try{n.texSubImage2D(...arguments)}catch(N){Jt("WebGLState:",N)}}function O(){try{n.texSubImage3D(...arguments)}catch(N){Jt("WebGLState:",N)}}function z(){try{n.compressedTexSubImage2D(...arguments)}catch(N){Jt("WebGLState:",N)}}function Z(){try{n.compressedTexSubImage3D(...arguments)}catch(N){Jt("WebGLState:",N)}}function st(){try{n.texStorage2D(...arguments)}catch(N){Jt("WebGLState:",N)}}function rt(){try{n.texStorage3D(...arguments)}catch(N){Jt("WebGLState:",N)}}function $(){try{n.texImage2D(...arguments)}catch(N){Jt("WebGLState:",N)}}function Q(){try{n.texImage3D(...arguments)}catch(N){Jt("WebGLState:",N)}}function at(N){return d[N]!==void 0?d[N]:n.getParameter(N)}function Ut(N,ht){d[N]!==ht&&(n.pixelStorei(N,ht),d[N]=ht)}function dt(N){pe.equals(N)===!1&&(n.scissor(N.x,N.y,N.z,N.w),pe.copy(N))}function ct(N){qt.equals(N)===!1&&(n.viewport(N.x,N.y,N.z,N.w),qt.copy(N))}function It(N,ht){let tt=c.get(ht);tt===void 0&&(tt=new WeakMap,c.set(ht,tt));let lt=tt.get(N);lt===void 0&&(lt=n.getUniformBlockIndex(ht,N.name),tt.set(N,lt))}function Ht(N,ht){let lt=c.get(ht).get(N);l.get(ht)!==lt&&(n.uniformBlockBinding(ht,lt,N.__bindingPointIndex),l.set(ht,lt))}function zt(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),o.setReversed(!1),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),n.pixelStorei(n.PACK_ALIGNMENT,4),n.pixelStorei(n.UNPACK_ALIGNMENT,4),n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,!1),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,n.BROWSER_DEFAULT_WEBGL),n.pixelStorei(n.PACK_ROW_LENGTH,0),n.pixelStorei(n.PACK_SKIP_PIXELS,0),n.pixelStorei(n.PACK_SKIP_ROWS,0),n.pixelStorei(n.UNPACK_ROW_LENGTH,0),n.pixelStorei(n.UNPACK_IMAGE_HEIGHT,0),n.pixelStorei(n.UNPACK_SKIP_PIXELS,0),n.pixelStorei(n.UNPACK_SKIP_ROWS,0),n.pixelStorei(n.UNPACK_SKIP_IMAGES,0),u={},d={},q=null,j={},h={},f=new WeakMap,p=[],_=null,m=!1,g=null,S=null,A=null,v=null,b=null,T=null,C=null,y=new ae(0,0,0),w=0,P=!1,F=null,B=null,V=null,I=null,k=null,pe.set(0,0,n.canvas.width,n.canvas.height),qt.set(0,0,n.canvas.width,n.canvas.height),r.reset(),o.reset(),a.reset()}return{buffers:{color:r,depth:o,stencil:a},enable:K,disable:it,bindFramebuffer:Rt,drawBuffers:ot,useProgram:ut,setBlending:Wt,setMaterial:kt,setFlipSided:Dt,setCullFace:te,setLineWidth:ue,setPolygonOffset:be,setScissorTest:jt,activeTexture:le,bindTexture:R,unbindTexture:ne,compressedTexImage2D:Pt,compressedTexImage3D:E,texImage2D:$,texImage3D:Q,pixelStorei:Ut,getParameter:at,updateUBOMapping:It,uniformBlockBinding:Ht,texStorage2D:st,texStorage3D:rt,texSubImage2D:x,texSubImage3D:O,compressedTexSubImage2D:z,compressedTexSubImage3D:Z,scissor:dt,viewport:ct,reset:zt}}function Ry(n,t,e,i,s,r,o){let a=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new Zt,u=new WeakMap,d=new Set,h,f=new WeakMap,p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function _(E,x){return p?new OffscreenCanvas(E,x):jr("canvas")}function m(E,x,O){let z=1,Z=Pt(E);if((Z.width>O||Z.height>O)&&(z=O/Math.max(Z.width,Z.height)),z<1)if(typeof HTMLImageElement<"u"&&E instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&E instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&E instanceof ImageBitmap||typeof VideoFrame<"u"&&E instanceof VideoFrame){let st=Math.floor(z*Z.width),rt=Math.floor(z*Z.height);h===void 0&&(h=_(st,rt));let $=x?_(st,rt):h;return $.width=st,$.height=rt,$.getContext("2d").drawImage(E,0,0,st,rt),Gt("WebGLRenderer: Texture has been resized from ("+Z.width+"x"+Z.height+") to ("+st+"x"+rt+")."),$}else return"data"in E&&Gt("WebGLRenderer: Image in DataTexture is too big ("+Z.width+"x"+Z.height+")."),E;return E}function g(E){return E.generateMipmaps}function S(E){n.generateMipmap(E)}function A(E){return E.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:E.isWebGL3DRenderTarget?n.TEXTURE_3D:E.isWebGLArrayRenderTarget||E.isCompressedArrayTexture?n.TEXTURE_2D_ARRAY:n.TEXTURE_2D}function v(E,x,O,z,Z,st=!1){if(E!==null){if(n[E]!==void 0)return n[E];Gt("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+E+"'")}let rt;z&&(rt=t.get("EXT_texture_norm16"),rt||Gt("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let $=x;if(x===n.RED&&(O===n.FLOAT&&($=n.R32F),O===n.HALF_FLOAT&&($=n.R16F),O===n.UNSIGNED_BYTE&&($=n.R8),O===n.UNSIGNED_SHORT&&rt&&($=rt.R16_EXT),O===n.SHORT&&rt&&($=rt.R16_SNORM_EXT)),x===n.RED_INTEGER&&(O===n.UNSIGNED_BYTE&&($=n.R8UI),O===n.UNSIGNED_SHORT&&($=n.R16UI),O===n.UNSIGNED_INT&&($=n.R32UI),O===n.BYTE&&($=n.R8I),O===n.SHORT&&($=n.R16I),O===n.INT&&($=n.R32I)),x===n.RG&&(O===n.FLOAT&&($=n.RG32F),O===n.HALF_FLOAT&&($=n.RG16F),O===n.UNSIGNED_BYTE&&($=n.RG8),O===n.UNSIGNED_SHORT&&rt&&($=rt.RG16_EXT),O===n.SHORT&&rt&&($=rt.RG16_SNORM_EXT)),x===n.RG_INTEGER&&(O===n.UNSIGNED_BYTE&&($=n.RG8UI),O===n.UNSIGNED_SHORT&&($=n.RG16UI),O===n.UNSIGNED_INT&&($=n.RG32UI),O===n.BYTE&&($=n.RG8I),O===n.SHORT&&($=n.RG16I),O===n.INT&&($=n.RG32I)),x===n.RGB_INTEGER&&(O===n.UNSIGNED_BYTE&&($=n.RGB8UI),O===n.UNSIGNED_SHORT&&($=n.RGB16UI),O===n.UNSIGNED_INT&&($=n.RGB32UI),O===n.BYTE&&($=n.RGB8I),O===n.SHORT&&($=n.RGB16I),O===n.INT&&($=n.RGB32I)),x===n.RGBA_INTEGER&&(O===n.UNSIGNED_BYTE&&($=n.RGBA8UI),O===n.UNSIGNED_SHORT&&($=n.RGBA16UI),O===n.UNSIGNED_INT&&($=n.RGBA32UI),O===n.BYTE&&($=n.RGBA8I),O===n.SHORT&&($=n.RGBA16I),O===n.INT&&($=n.RGBA32I)),x===n.RGB&&(O===n.UNSIGNED_SHORT&&rt&&($=rt.RGB16_EXT),O===n.SHORT&&rt&&($=rt.RGB16_SNORM_EXT),O===n.UNSIGNED_INT_5_9_9_9_REV&&($=n.RGB9_E5),O===n.UNSIGNED_INT_10F_11F_11F_REV&&($=n.R11F_G11F_B10F)),x===n.RGBA){let Q=st?Kr:ge.getTransfer(Z);O===n.FLOAT&&($=n.RGBA32F),O===n.HALF_FLOAT&&($=n.RGBA16F),O===n.UNSIGNED_BYTE&&($=Q===Se?n.SRGB8_ALPHA8:n.RGBA8),O===n.UNSIGNED_SHORT&&rt&&($=rt.RGBA16_EXT),O===n.SHORT&&rt&&($=rt.RGBA16_SNORM_EXT),O===n.UNSIGNED_SHORT_4_4_4_4&&($=n.RGBA4),O===n.UNSIGNED_SHORT_5_5_5_1&&($=n.RGB5_A1)}return($===n.R16F||$===n.R32F||$===n.RG16F||$===n.RG32F||$===n.RGBA16F||$===n.RGBA32F)&&t.get("EXT_color_buffer_float"),$}function b(E,x){let O;return E?x===null||x===ei||x===Sr?O=n.DEPTH24_STENCIL8:x===ni?O=n.DEPTH32F_STENCIL8:x===Mr&&(O=n.DEPTH24_STENCIL8,Gt("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):x===null||x===ei||x===Sr?O=n.DEPTH_COMPONENT24:x===ni?O=n.DEPTH_COMPONENT32F:x===Mr&&(O=n.DEPTH_COMPONENT16),O}function T(E,x){return g(E)===!0||E.isFramebufferTexture&&E.minFilter!==$e&&E.minFilter!==Qe?Math.log2(Math.max(x.width,x.height))+1:E.mipmaps!==void 0&&E.mipmaps.length>0?E.mipmaps.length:E.isCompressedTexture&&Array.isArray(E.image)?x.mipmaps.length:1}function C(E){let x=E.target;x.removeEventListener("dispose",C),w(x),x.isVideoTexture&&u.delete(x),x.isHTMLTexture&&d.delete(x)}function y(E){let x=E.target;x.removeEventListener("dispose",y),F(x)}function w(E){let x=i.get(E);if(x.__webglInit===void 0)return;let O=E.source,z=f.get(O);if(z){let Z=z[x.__cacheKey];Z.usedTimes--,Z.usedTimes===0&&P(E),Object.keys(z).length===0&&f.delete(O)}i.remove(E)}function P(E){let x=i.get(E);n.deleteTexture(x.__webglTexture);let O=E.source,z=f.get(O);delete z[x.__cacheKey],o.memory.textures--}function F(E){let x=i.get(E);if(E.depthTexture&&(E.depthTexture.dispose(),i.remove(E.depthTexture)),E.isWebGLCubeRenderTarget)for(let z=0;z<6;z++){if(Array.isArray(x.__webglFramebuffer[z]))for(let Z=0;Z<x.__webglFramebuffer[z].length;Z++)n.deleteFramebuffer(x.__webglFramebuffer[z][Z]);else n.deleteFramebuffer(x.__webglFramebuffer[z]);x.__webglDepthbuffer&&n.deleteRenderbuffer(x.__webglDepthbuffer[z])}else{if(Array.isArray(x.__webglFramebuffer))for(let z=0;z<x.__webglFramebuffer.length;z++)n.deleteFramebuffer(x.__webglFramebuffer[z]);else n.deleteFramebuffer(x.__webglFramebuffer);if(x.__webglDepthbuffer&&n.deleteRenderbuffer(x.__webglDepthbuffer),x.__webglMultisampledFramebuffer&&n.deleteFramebuffer(x.__webglMultisampledFramebuffer),x.__webglColorRenderbuffer)for(let z=0;z<x.__webglColorRenderbuffer.length;z++)x.__webglColorRenderbuffer[z]&&n.deleteRenderbuffer(x.__webglColorRenderbuffer[z]);x.__webglDepthRenderbuffer&&n.deleteRenderbuffer(x.__webglDepthRenderbuffer)}let O=E.textures;for(let z=0,Z=O.length;z<Z;z++){let st=i.get(O[z]);st.__webglTexture&&(n.deleteTexture(st.__webglTexture),o.memory.textures--),i.remove(O[z])}i.remove(E)}let B=0;function V(){B=0}function I(){return B}function k(E){B=E}function W(){let E=B;return E>=s.maxTextures&&Gt("WebGLTextures: Trying to use "+(E+1)+" texture units while this GPU supports only "+s.maxTextures),B+=1,E}function J(E){let x=[];return x.push(E.wrapS),x.push(E.wrapT),x.push(E.wrapR||0),x.push(E.magFilter),x.push(E.minFilter),x.push(E.anisotropy),x.push(E.internalFormat),x.push(E.format),x.push(E.type),x.push(E.generateMipmaps),x.push(E.premultiplyAlpha),x.push(E.flipY),x.push(E.unpackAlignment),x.push(E.colorSpace),x.join()}function et(E,x){let O=i.get(E);if(E.isVideoTexture&&R(E),E.isRenderTargetTexture===!1&&E.isExternalTexture!==!0&&E.version>0&&O.__version!==E.version){let z=E.image;if(z===null)Gt("WebGLRenderer: Texture marked for update but no image data found.");else if(z.complete===!1)Gt("WebGLRenderer: Texture marked for update but image is incomplete");else{it(O,E,x);return}}else E.isExternalTexture&&(O.__webglTexture=E.sourceTexture?E.sourceTexture:null);e.bindTexture(n.TEXTURE_2D,O.__webglTexture,n.TEXTURE0+x)}function U(E,x){let O=i.get(E);if(E.isRenderTargetTexture===!1&&E.version>0&&O.__version!==E.version){it(O,E,x);return}else E.isExternalTexture&&(O.__webglTexture=E.sourceTexture?E.sourceTexture:null);e.bindTexture(n.TEXTURE_2D_ARRAY,O.__webglTexture,n.TEXTURE0+x)}function q(E,x){let O=i.get(E);if(E.isRenderTargetTexture===!1&&E.version>0&&O.__version!==E.version){it(O,E,x);return}e.bindTexture(n.TEXTURE_3D,O.__webglTexture,n.TEXTURE0+x)}function j(E,x){let O=i.get(E);if(E.isCubeDepthTexture!==!0&&E.version>0&&O.__version!==E.version){Rt(O,E,x);return}e.bindTexture(n.TEXTURE_CUBE_MAP,O.__webglTexture,n.TEXTURE0+x)}let yt={[Da]:n.REPEAT,[mi]:n.CLAMP_TO_EDGE,[Na]:n.MIRRORED_REPEAT},Tt={[$e]:n.NEAREST,[lf]:n.NEAREST_MIPMAP_NEAREST,[xo]:n.NEAREST_MIPMAP_LINEAR,[Qe]:n.LINEAR,[cl]:n.LINEAR_MIPMAP_NEAREST,[cs]:n.LINEAR_MIPMAP_LINEAR},pe={[df]:n.NEVER,[_f]:n.ALWAYS,[ff]:n.LESS,[Yl]:n.LEQUAL,[pf]:n.EQUAL,[Zl]:n.GEQUAL,[mf]:n.GREATER,[gf]:n.NOTEQUAL};function qt(E,x){if(x.type===ni&&t.has("OES_texture_float_linear")===!1&&(x.magFilter===Qe||x.magFilter===cl||x.magFilter===xo||x.magFilter===cs||x.minFilter===Qe||x.minFilter===cl||x.minFilter===xo||x.minFilter===cs)&&Gt("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(E,n.TEXTURE_WRAP_S,yt[x.wrapS]),n.texParameteri(E,n.TEXTURE_WRAP_T,yt[x.wrapT]),(E===n.TEXTURE_3D||E===n.TEXTURE_2D_ARRAY)&&n.texParameteri(E,n.TEXTURE_WRAP_R,yt[x.wrapR]),n.texParameteri(E,n.TEXTURE_MAG_FILTER,Tt[x.magFilter]),n.texParameteri(E,n.TEXTURE_MIN_FILTER,Tt[x.minFilter]),x.compareFunction&&(n.texParameteri(E,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(E,n.TEXTURE_COMPARE_FUNC,pe[x.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(x.magFilter===$e||x.minFilter!==xo&&x.minFilter!==cs||x.type===ni&&t.has("OES_texture_float_linear")===!1)return;if(x.anisotropy>1||i.get(x).__currentAnisotropy){let O=t.get("EXT_texture_filter_anisotropic");n.texParameterf(E,O.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(x.anisotropy,s.getMaxAnisotropy())),i.get(x).__currentAnisotropy=x.anisotropy}}}function Et(E,x){let O=!1;E.__webglInit===void 0&&(E.__webglInit=!0,x.addEventListener("dispose",C));let z=x.source,Z=f.get(z);Z===void 0&&(Z={},f.set(z,Z));let st=J(x);if(st!==E.__cacheKey){Z[st]===void 0&&(Z[st]={texture:n.createTexture(),usedTimes:0},o.memory.textures++,O=!0),Z[st].usedTimes++;let rt=Z[E.__cacheKey];rt!==void 0&&(Z[E.__cacheKey].usedTimes--,rt.usedTimes===0&&P(x)),E.__cacheKey=st,E.__webglTexture=Z[st].texture}return O}function Y(E,x,O){return Math.floor(Math.floor(E/O)/x)}function K(E,x,O,z){let st=E.updateRanges;if(st.length===0)e.texSubImage2D(n.TEXTURE_2D,0,0,0,x.width,x.height,O,z,x.data);else{st.sort((Ut,dt)=>Ut.start-dt.start);let rt=0;for(let Ut=1;Ut<st.length;Ut++){let dt=st[rt],ct=st[Ut],It=dt.start+dt.count,Ht=Y(ct.start,x.width,4),zt=Y(dt.start,x.width,4);ct.start<=It+1&&Ht===zt&&Y(ct.start+ct.count-1,x.width,4)===Ht?dt.count=Math.max(dt.count,ct.start+ct.count-dt.start):(++rt,st[rt]=ct)}st.length=rt+1;let $=e.getParameter(n.UNPACK_ROW_LENGTH),Q=e.getParameter(n.UNPACK_SKIP_PIXELS),at=e.getParameter(n.UNPACK_SKIP_ROWS);e.pixelStorei(n.UNPACK_ROW_LENGTH,x.width);for(let Ut=0,dt=st.length;Ut<dt;Ut++){let ct=st[Ut],It=Math.floor(ct.start/4),Ht=Math.ceil(ct.count/4),zt=It%x.width,N=Math.floor(It/x.width),ht=Ht,tt=1;e.pixelStorei(n.UNPACK_SKIP_PIXELS,zt),e.pixelStorei(n.UNPACK_SKIP_ROWS,N),e.texSubImage2D(n.TEXTURE_2D,0,zt,N,ht,tt,O,z,x.data)}E.clearUpdateRanges(),e.pixelStorei(n.UNPACK_ROW_LENGTH,$),e.pixelStorei(n.UNPACK_SKIP_PIXELS,Q),e.pixelStorei(n.UNPACK_SKIP_ROWS,at)}}function it(E,x,O){let z=n.TEXTURE_2D;(x.isDataArrayTexture||x.isCompressedArrayTexture)&&(z=n.TEXTURE_2D_ARRAY),x.isData3DTexture&&(z=n.TEXTURE_3D);let Z=Et(E,x),st=x.source;e.bindTexture(z,E.__webglTexture,n.TEXTURE0+O);let rt=i.get(st);if(st.version!==rt.__version||Z===!0){if(e.activeTexture(n.TEXTURE0+O),(typeof ImageBitmap<"u"&&x.image instanceof ImageBitmap)===!1){let tt=ge.getPrimaries(ge.workingColorSpace),lt=x.colorSpace===Bi?null:ge.getPrimaries(x.colorSpace),mt=x.colorSpace===Bi||tt===lt?n.NONE:n.BROWSER_DEFAULT_WEBGL;e.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,x.flipY),e.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,x.premultiplyAlpha),e.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,mt)}e.pixelStorei(n.UNPACK_ALIGNMENT,x.unpackAlignment);let Q=m(x.image,!1,s.maxTextureSize);Q=ne(x,Q);let at=r.convert(x.format,x.colorSpace),Ut=r.convert(x.type),dt=v(x.internalFormat,at,Ut,x.normalized,x.colorSpace,x.isVideoTexture);qt(z,x);let ct,It=x.mipmaps,Ht=x.isVideoTexture!==!0,zt=rt.__version===void 0||Z===!0,N=st.dataReady,ht=T(x,Q);if(x.isDepthTexture)dt=b(x.format===hs,x.type),zt&&(Ht?e.texStorage2D(n.TEXTURE_2D,1,dt,Q.width,Q.height):e.texImage2D(n.TEXTURE_2D,0,dt,Q.width,Q.height,0,at,Ut,null));else if(x.isDataTexture)if(It.length>0){Ht&&zt&&e.texStorage2D(n.TEXTURE_2D,ht,dt,It[0].width,It[0].height);for(let tt=0,lt=It.length;tt<lt;tt++)ct=It[tt],Ht?N&&e.texSubImage2D(n.TEXTURE_2D,tt,0,0,ct.width,ct.height,at,Ut,ct.data):e.texImage2D(n.TEXTURE_2D,tt,dt,ct.width,ct.height,0,at,Ut,ct.data);x.generateMipmaps=!1}else Ht?(zt&&e.texStorage2D(n.TEXTURE_2D,ht,dt,Q.width,Q.height),N&&K(x,Q,at,Ut)):e.texImage2D(n.TEXTURE_2D,0,dt,Q.width,Q.height,0,at,Ut,Q.data);else if(x.isCompressedTexture)if(x.isCompressedArrayTexture){Ht&&zt&&e.texStorage3D(n.TEXTURE_2D_ARRAY,ht,dt,It[0].width,It[0].height,Q.depth);for(let tt=0,lt=It.length;tt<lt;tt++)if(ct=It[tt],x.format!==qn)if(at!==null)if(Ht){if(N)if(x.layerUpdates.size>0){let mt=zh(ct.width,ct.height,x.format,x.type);for(let nt of x.layerUpdates){let xt=ct.data.subarray(nt*mt/ct.data.BYTES_PER_ELEMENT,(nt+1)*mt/ct.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,tt,0,0,nt,ct.width,ct.height,1,at,xt)}}else e.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,tt,0,0,0,ct.width,ct.height,Q.depth,at,ct.data)}else e.compressedTexImage3D(n.TEXTURE_2D_ARRAY,tt,dt,ct.width,ct.height,Q.depth,0,ct.data,0,0);else Gt("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Ht?N&&e.texSubImage3D(n.TEXTURE_2D_ARRAY,tt,0,0,0,ct.width,ct.height,Q.depth,at,Ut,ct.data):e.texImage3D(n.TEXTURE_2D_ARRAY,tt,dt,ct.width,ct.height,Q.depth,0,at,Ut,ct.data);x.layerUpdates.size>0&&x.clearLayerUpdates()}else{Ht&&zt&&e.texStorage2D(n.TEXTURE_2D,ht,dt,It[0].width,It[0].height);for(let tt=0,lt=It.length;tt<lt;tt++)ct=It[tt],x.format!==qn?at!==null?Ht?N&&e.compressedTexSubImage2D(n.TEXTURE_2D,tt,0,0,ct.width,ct.height,at,ct.data):e.compressedTexImage2D(n.TEXTURE_2D,tt,dt,ct.width,ct.height,0,ct.data):Gt("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Ht?N&&e.texSubImage2D(n.TEXTURE_2D,tt,0,0,ct.width,ct.height,at,Ut,ct.data):e.texImage2D(n.TEXTURE_2D,tt,dt,ct.width,ct.height,0,at,Ut,ct.data)}else if(x.isDataArrayTexture)if(Ht){if(zt&&e.texStorage3D(n.TEXTURE_2D_ARRAY,ht,dt,Q.width,Q.height,Q.depth),N)if(x.layerUpdates.size>0){let tt=zh(Q.width,Q.height,x.format,x.type);for(let lt of x.layerUpdates){let mt=Q.data.subarray(lt*tt/Q.data.BYTES_PER_ELEMENT,(lt+1)*tt/Q.data.BYTES_PER_ELEMENT);e.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,lt,Q.width,Q.height,1,at,Ut,mt)}x.clearLayerUpdates()}else e.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,Q.width,Q.height,Q.depth,at,Ut,Q.data)}else e.texImage3D(n.TEXTURE_2D_ARRAY,0,dt,Q.width,Q.height,Q.depth,0,at,Ut,Q.data);else if(x.isData3DTexture)Ht?(zt&&e.texStorage3D(n.TEXTURE_3D,ht,dt,Q.width,Q.height,Q.depth),N&&e.texSubImage3D(n.TEXTURE_3D,0,0,0,0,Q.width,Q.height,Q.depth,at,Ut,Q.data)):e.texImage3D(n.TEXTURE_3D,0,dt,Q.width,Q.height,Q.depth,0,at,Ut,Q.data);else if(x.isFramebufferTexture){if(zt)if(Ht)e.texStorage2D(n.TEXTURE_2D,ht,dt,Q.width,Q.height);else{let tt=Q.width,lt=Q.height;for(let mt=0;mt<ht;mt++)e.texImage2D(n.TEXTURE_2D,mt,dt,tt,lt,0,at,Ut,null),tt>>=1,lt>>=1}}else if(x.isHTMLTexture){if("texElementImage2D"in n){let tt=n.canvas;if(tt.hasAttribute("layoutsubtree")||tt.setAttribute("layoutsubtree","true"),Q.parentNode!==tt){tt.appendChild(Q),d.add(x),tt.onpaint=lt=>{let mt=lt.changedElements;for(let nt of d)mt.includes(nt.image)&&(nt.needsUpdate=!0)},tt.requestPaint();return}if(n.texElementImage2D.length===3)n.texElementImage2D(n.TEXTURE_2D,n.RGBA8,Q);else{let mt=n.RGBA,nt=n.RGBA,xt=n.UNSIGNED_BYTE;n.texElementImage2D(n.TEXTURE_2D,0,mt,nt,xt,Q)}n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MIN_FILTER,n.LINEAR),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_S,n.CLAMP_TO_EDGE),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_T,n.CLAMP_TO_EDGE)}}else if(It.length>0){if(Ht&&zt){let tt=Pt(It[0]);e.texStorage2D(n.TEXTURE_2D,ht,dt,tt.width,tt.height)}for(let tt=0,lt=It.length;tt<lt;tt++)ct=It[tt],Ht?N&&e.texSubImage2D(n.TEXTURE_2D,tt,0,0,at,Ut,ct):e.texImage2D(n.TEXTURE_2D,tt,dt,at,Ut,ct);x.generateMipmaps=!1}else if(Ht){if(zt){let tt=Pt(Q);e.texStorage2D(n.TEXTURE_2D,ht,dt,tt.width,tt.height)}N&&e.texSubImage2D(n.TEXTURE_2D,0,0,0,at,Ut,Q)}else e.texImage2D(n.TEXTURE_2D,0,dt,at,Ut,Q);g(x)&&S(z),rt.__version=st.version,x.onUpdate&&x.onUpdate(x)}E.__version=x.version}function Rt(E,x,O){if(x.image.length!==6)return;let z=Et(E,x),Z=x.source;e.bindTexture(n.TEXTURE_CUBE_MAP,E.__webglTexture,n.TEXTURE0+O);let st=i.get(Z);if(Z.version!==st.__version||z===!0){e.activeTexture(n.TEXTURE0+O);let rt=ge.getPrimaries(ge.workingColorSpace),$=x.colorSpace===Bi?null:ge.getPrimaries(x.colorSpace),Q=x.colorSpace===Bi||rt===$?n.NONE:n.BROWSER_DEFAULT_WEBGL;e.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,x.flipY),e.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,x.premultiplyAlpha),e.pixelStorei(n.UNPACK_ALIGNMENT,x.unpackAlignment),e.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,Q);let at=x.isCompressedTexture||x.image[0].isCompressedTexture,Ut=x.image[0]&&x.image[0].isDataTexture,dt=[];for(let nt=0;nt<6;nt++)!at&&!Ut?dt[nt]=m(x.image[nt],!0,s.maxCubemapSize):dt[nt]=Ut?x.image[nt].image:x.image[nt],dt[nt]=ne(x,dt[nt]);let ct=dt[0],It=r.convert(x.format,x.colorSpace),Ht=r.convert(x.type),zt=v(x.internalFormat,It,Ht,x.normalized,x.colorSpace),N=x.isVideoTexture!==!0,ht=st.__version===void 0||z===!0,tt=Z.dataReady,lt=T(x,ct);qt(n.TEXTURE_CUBE_MAP,x);let mt;if(at){N&&ht&&e.texStorage2D(n.TEXTURE_CUBE_MAP,lt,zt,ct.width,ct.height);for(let nt=0;nt<6;nt++){mt=dt[nt].mipmaps;for(let xt=0;xt<mt.length;xt++){let wt=mt[xt];x.format!==qn?It!==null?N?tt&&e.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+nt,xt,0,0,wt.width,wt.height,It,wt.data):e.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+nt,xt,zt,wt.width,wt.height,0,wt.data):Gt("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):N?tt&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+nt,xt,0,0,wt.width,wt.height,It,Ht,wt.data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+nt,xt,zt,wt.width,wt.height,0,It,Ht,wt.data)}}}else{if(mt=x.mipmaps,N&&ht){mt.length>0&&lt++;let nt=Pt(dt[0]);e.texStorage2D(n.TEXTURE_CUBE_MAP,lt,zt,nt.width,nt.height)}for(let nt=0;nt<6;nt++)if(Ut){N?tt&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+nt,0,0,0,dt[nt].width,dt[nt].height,It,Ht,dt[nt].data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+nt,0,zt,dt[nt].width,dt[nt].height,0,It,Ht,dt[nt].data);for(let xt=0;xt<mt.length;xt++){let Nt=mt[xt].image[nt].image;N?tt&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+nt,xt+1,0,0,Nt.width,Nt.height,It,Ht,Nt.data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+nt,xt+1,zt,Nt.width,Nt.height,0,It,Ht,Nt.data)}}else{N?tt&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+nt,0,0,0,It,Ht,dt[nt]):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+nt,0,zt,It,Ht,dt[nt]);for(let xt=0;xt<mt.length;xt++){let wt=mt[xt];N?tt&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+nt,xt+1,0,0,It,Ht,wt.image[nt]):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+nt,xt+1,zt,It,Ht,wt.image[nt])}}}g(x)&&S(n.TEXTURE_CUBE_MAP),st.__version=Z.version,x.onUpdate&&x.onUpdate(x)}E.__version=x.version}function ot(E,x,O,z,Z,st){let rt=r.convert(O.format,O.colorSpace),$=r.convert(O.type),Q=v(O.internalFormat,rt,$,O.normalized,O.colorSpace),at=i.get(x),Ut=i.get(O);if(Ut.__renderTarget=x,!at.__hasExternalTextures){let dt=Math.max(1,x.width>>st),ct=Math.max(1,x.height>>st);Z===n.TEXTURE_3D||Z===n.TEXTURE_2D_ARRAY?e.texImage3D(Z,st,Q,dt,ct,x.depth,0,rt,$,null):e.texImage2D(Z,st,Q,dt,ct,0,rt,$,null)}e.bindFramebuffer(n.FRAMEBUFFER,E),le(x)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,z,Z,Ut.__webglTexture,0,jt(x)):(Z===n.TEXTURE_2D||Z>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&Z<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,z,Z,Ut.__webglTexture,st),e.bindFramebuffer(n.FRAMEBUFFER,null)}function ut(E,x,O){if(n.bindRenderbuffer(n.RENDERBUFFER,E),x.depthBuffer){let z=x.depthTexture,Z=z&&z.isDepthTexture?z.type:null,st=b(x.stencilBuffer,Z),rt=x.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;le(x)?a.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,jt(x),st,x.width,x.height):O?n.renderbufferStorageMultisample(n.RENDERBUFFER,jt(x),st,x.width,x.height):n.renderbufferStorage(n.RENDERBUFFER,st,x.width,x.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,rt,n.RENDERBUFFER,E)}else{let z=x.textures;for(let Z=0;Z<z.length;Z++){let st=z[Z],rt=r.convert(st.format,st.colorSpace),$=r.convert(st.type),Q=v(st.internalFormat,rt,$,st.normalized,st.colorSpace);le(x)?a.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,jt(x),Q,x.width,x.height):O?n.renderbufferStorageMultisample(n.RENDERBUFFER,jt(x),Q,x.width,x.height):n.renderbufferStorage(n.RENDERBUFFER,Q,x.width,x.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function Yt(E,x,O){let z=x.isWebGLCubeRenderTarget===!0;if(e.bindFramebuffer(n.FRAMEBUFFER,E),!(x.depthTexture&&x.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");let Z=i.get(x.depthTexture);if(Z.__renderTarget=x,(!Z.__webglTexture||x.depthTexture.image.width!==x.width||x.depthTexture.image.height!==x.height)&&(x.depthTexture.image.width=x.width,x.depthTexture.image.height=x.height,x.depthTexture.needsUpdate=!0),z){if(Z.__webglInit===void 0&&(Z.__webglInit=!0,x.depthTexture.addEventListener("dispose",C)),Z.__webglTexture===void 0){Z.__webglTexture=n.createTexture(),e.bindTexture(n.TEXTURE_CUBE_MAP,Z.__webglTexture),qt(n.TEXTURE_CUBE_MAP,x.depthTexture);let at=r.convert(x.depthTexture.format),Ut=r.convert(x.depthTexture.type),dt;x.depthTexture.format===gi?dt=n.DEPTH_COMPONENT24:x.depthTexture.format===hs&&(dt=n.DEPTH24_STENCIL8);for(let ct=0;ct<6;ct++)n.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ct,0,dt,x.width,x.height,0,at,Ut,null)}}else et(x.depthTexture,0);let st=Z.__webglTexture,rt=jt(x),$=z?n.TEXTURE_CUBE_MAP_POSITIVE_X+O:n.TEXTURE_2D,Q=x.depthTexture.format===hs?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;if(x.depthTexture.format===gi)le(x)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,Q,$,st,0,rt):n.framebufferTexture2D(n.FRAMEBUFFER,Q,$,st,0);else if(x.depthTexture.format===hs)le(x)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,Q,$,st,0,rt):n.framebufferTexture2D(n.FRAMEBUFFER,Q,$,st,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function Ot(E){let x=i.get(E),O=E.isWebGLCubeRenderTarget===!0;if(x.__boundDepthTexture!==E.depthTexture){let z=E.depthTexture;if(x.__depthDisposeCallback&&x.__depthDisposeCallback(),z){let Z=()=>{delete x.__boundDepthTexture,delete x.__depthDisposeCallback,z.removeEventListener("dispose",Z)};z.addEventListener("dispose",Z),x.__depthDisposeCallback=Z}x.__boundDepthTexture=z}if(E.depthTexture&&!x.__autoAllocateDepthBuffer)if(O)for(let z=0;z<6;z++)Yt(x.__webglFramebuffer[z],E,z);else{let z=E.texture.mipmaps;z&&z.length>0?Yt(x.__webglFramebuffer[0],E,0):Yt(x.__webglFramebuffer,E,0)}else if(O){x.__webglDepthbuffer=[];for(let z=0;z<6;z++)if(e.bindFramebuffer(n.FRAMEBUFFER,x.__webglFramebuffer[z]),x.__webglDepthbuffer[z]===void 0)x.__webglDepthbuffer[z]=n.createRenderbuffer(),ut(x.__webglDepthbuffer[z],E,!1);else{let Z=E.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,st=x.__webglDepthbuffer[z];n.bindRenderbuffer(n.RENDERBUFFER,st),n.framebufferRenderbuffer(n.FRAMEBUFFER,Z,n.RENDERBUFFER,st)}}else{let z=E.texture.mipmaps;if(z&&z.length>0?e.bindFramebuffer(n.FRAMEBUFFER,x.__webglFramebuffer[0]):e.bindFramebuffer(n.FRAMEBUFFER,x.__webglFramebuffer),x.__webglDepthbuffer===void 0)x.__webglDepthbuffer=n.createRenderbuffer(),ut(x.__webglDepthbuffer,E,!1);else{let Z=E.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,st=x.__webglDepthbuffer;n.bindRenderbuffer(n.RENDERBUFFER,st),n.framebufferRenderbuffer(n.FRAMEBUFFER,Z,n.RENDERBUFFER,st)}}e.bindFramebuffer(n.FRAMEBUFFER,null)}function Wt(E,x,O){let z=i.get(E);x!==void 0&&ot(z.__webglFramebuffer,E,E.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),O!==void 0&&Ot(E)}function kt(E){let x=E.texture,O=i.get(E),z=i.get(x);E.addEventListener("dispose",y);let Z=E.textures,st=E.isWebGLCubeRenderTarget===!0,rt=Z.length>1;if(rt||(z.__webglTexture===void 0&&(z.__webglTexture=n.createTexture()),z.__version=x.version,o.memory.textures++),st){O.__webglFramebuffer=[];for(let $=0;$<6;$++)if(x.mipmaps&&x.mipmaps.length>0){O.__webglFramebuffer[$]=[];for(let Q=0;Q<x.mipmaps.length;Q++)O.__webglFramebuffer[$][Q]=n.createFramebuffer()}else O.__webglFramebuffer[$]=n.createFramebuffer()}else{if(x.mipmaps&&x.mipmaps.length>0){O.__webglFramebuffer=[];for(let $=0;$<x.mipmaps.length;$++)O.__webglFramebuffer[$]=n.createFramebuffer()}else O.__webglFramebuffer=n.createFramebuffer();if(rt)for(let $=0,Q=Z.length;$<Q;$++){let at=i.get(Z[$]);at.__webglTexture===void 0&&(at.__webglTexture=n.createTexture(),o.memory.textures++)}if(E.samples>0&&le(E)===!1){O.__webglMultisampledFramebuffer=n.createFramebuffer(),O.__webglColorRenderbuffer=[],e.bindFramebuffer(n.FRAMEBUFFER,O.__webglMultisampledFramebuffer);for(let $=0;$<Z.length;$++){let Q=Z[$];O.__webglColorRenderbuffer[$]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,O.__webglColorRenderbuffer[$]);let at=r.convert(Q.format,Q.colorSpace),Ut=r.convert(Q.type),dt=v(Q.internalFormat,at,Ut,Q.normalized,Q.colorSpace,E.isXRRenderTarget===!0),ct=jt(E);n.renderbufferStorageMultisample(n.RENDERBUFFER,ct,dt,E.width,E.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+$,n.RENDERBUFFER,O.__webglColorRenderbuffer[$])}n.bindRenderbuffer(n.RENDERBUFFER,null),E.depthBuffer&&(O.__webglDepthRenderbuffer=n.createRenderbuffer(),ut(O.__webglDepthRenderbuffer,E,!0)),e.bindFramebuffer(n.FRAMEBUFFER,null)}}if(st){e.bindTexture(n.TEXTURE_CUBE_MAP,z.__webglTexture),qt(n.TEXTURE_CUBE_MAP,x);for(let $=0;$<6;$++)if(x.mipmaps&&x.mipmaps.length>0)for(let Q=0;Q<x.mipmaps.length;Q++)ot(O.__webglFramebuffer[$][Q],E,x,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+$,Q);else ot(O.__webglFramebuffer[$],E,x,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+$,0);g(x)&&S(n.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(rt){for(let $=0,Q=Z.length;$<Q;$++){let at=Z[$],Ut=i.get(at),dt=n.TEXTURE_2D;(E.isWebGL3DRenderTarget||E.isWebGLArrayRenderTarget)&&(dt=E.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),e.bindTexture(dt,Ut.__webglTexture),qt(dt,at),ot(O.__webglFramebuffer,E,at,n.COLOR_ATTACHMENT0+$,dt,0),g(at)&&S(dt)}e.unbindTexture()}else{let $=n.TEXTURE_2D;if((E.isWebGL3DRenderTarget||E.isWebGLArrayRenderTarget)&&($=E.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),e.bindTexture($,z.__webglTexture),qt($,x),x.mipmaps&&x.mipmaps.length>0)for(let Q=0;Q<x.mipmaps.length;Q++)ot(O.__webglFramebuffer[Q],E,x,n.COLOR_ATTACHMENT0,$,Q);else ot(O.__webglFramebuffer,E,x,n.COLOR_ATTACHMENT0,$,0);g(x)&&S($),e.unbindTexture()}E.depthBuffer&&Ot(E)}function Dt(E){let x=E.textures;for(let O=0,z=x.length;O<z;O++){let Z=x[O];if(g(Z)){let st=A(E),rt=i.get(Z).__webglTexture;e.bindTexture(st,rt),S(st),e.unbindTexture()}}}let te=[],ue=[];function be(E){if(E.samples>0){if(le(E)===!1){let x=E.textures,O=E.width,z=E.height,Z=n.COLOR_BUFFER_BIT,st=E.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,rt=i.get(E),$=x.length>1;if($)for(let at=0;at<x.length;at++)e.bindFramebuffer(n.FRAMEBUFFER,rt.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+at,n.RENDERBUFFER,null),e.bindFramebuffer(n.FRAMEBUFFER,rt.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+at,n.TEXTURE_2D,null,0);e.bindFramebuffer(n.READ_FRAMEBUFFER,rt.__webglMultisampledFramebuffer);let Q=E.texture.mipmaps;Q&&Q.length>0?e.bindFramebuffer(n.DRAW_FRAMEBUFFER,rt.__webglFramebuffer[0]):e.bindFramebuffer(n.DRAW_FRAMEBUFFER,rt.__webglFramebuffer);for(let at=0;at<x.length;at++){if(E.resolveDepthBuffer&&(E.depthBuffer&&(Z|=n.DEPTH_BUFFER_BIT),E.stencilBuffer&&E.resolveStencilBuffer&&(Z|=n.STENCIL_BUFFER_BIT)),$){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,rt.__webglColorRenderbuffer[at]);let Ut=i.get(x[at]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,Ut,0)}n.blitFramebuffer(0,0,O,z,0,0,O,z,Z,n.NEAREST),l===!0&&(te.length=0,ue.length=0,te.push(n.COLOR_ATTACHMENT0+at),E.depthBuffer&&E.storeMultisampledDepthBuffer===!1&&(te.push(st),ue.push(st),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,ue)),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,te))}if(e.bindFramebuffer(n.READ_FRAMEBUFFER,null),e.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),$)for(let at=0;at<x.length;at++){e.bindFramebuffer(n.FRAMEBUFFER,rt.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+at,n.RENDERBUFFER,rt.__webglColorRenderbuffer[at]);let Ut=i.get(x[at]).__webglTexture;e.bindFramebuffer(n.FRAMEBUFFER,rt.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+at,n.TEXTURE_2D,Ut,0)}e.bindFramebuffer(n.DRAW_FRAMEBUFFER,rt.__webglMultisampledFramebuffer)}else if(E.depthBuffer&&E.storeMultisampledDepthBuffer===!1&&l){let x=E.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[x])}}}function jt(E){return Math.min(s.maxSamples,E.samples)}function le(E){let x=i.get(E);return E.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&x.__useRenderToTexture!==!1}function R(E){let x=o.render.frame;u.get(E)!==x&&(u.set(E,x),E.update())}function ne(E,x){let O=E.colorSpace,z=E.format,Z=E.type;return E.isCompressedTexture===!0||E.isVideoTexture===!0||O!==$r&&O!==Bi&&(ge.getTransfer(O)===Se?(z!==qn||Z!==En)&&Gt("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):Jt("WebGLTextures: Unsupported texture color space:",O)),x}function Pt(E){return typeof HTMLImageElement<"u"&&E instanceof HTMLImageElement?(c.width=E.naturalWidth||E.width,c.height=E.naturalHeight||E.height):typeof VideoFrame<"u"&&E instanceof VideoFrame?(c.width=E.displayWidth,c.height=E.displayHeight):(c.width=E.width,c.height=E.height),c}this.allocateTextureUnit=W,this.resetTextureUnits=V,this.getTextureUnits=I,this.setTextureUnits=k,this.setTexture2D=et,this.setTexture2DArray=U,this.setTexture3D=q,this.setTextureCube=j,this.rebindTextures=Wt,this.setupRenderTarget=kt,this.updateRenderTargetMipmap=Dt,this.updateMultisampleRenderTarget=be,this.setupDepthRenderbuffer=Ot,this.setupFrameBufferTexture=ot,this.useMultisampledRTT=le,this.isReversedDepthBuffer=function(){return e.buffers.depth.getReversed()}}function Py(n,t){function e(i,s=Bi){let r,o=ge.getTransfer(s);if(i===En)return n.UNSIGNED_BYTE;if(i===ul)return n.UNSIGNED_SHORT_4_4_4_4;if(i===dl)return n.UNSIGNED_SHORT_5_5_5_1;if(i===Ch)return n.UNSIGNED_INT_5_9_9_9_REV;if(i===Rh)return n.UNSIGNED_INT_10F_11F_11F_REV;if(i===wh)return n.BYTE;if(i===Ah)return n.SHORT;if(i===Mr)return n.UNSIGNED_SHORT;if(i===hl)return n.INT;if(i===ei)return n.UNSIGNED_INT;if(i===ni)return n.FLOAT;if(i===ii)return n.HALF_FLOAT;if(i===Ph)return n.ALPHA;if(i===Ih)return n.RGB;if(i===qn)return n.RGBA;if(i===gi)return n.DEPTH_COMPONENT;if(i===hs)return n.DEPTH_STENCIL;if(i===Lh)return n.RED;if(i===fl)return n.RED_INTEGER;if(i===us)return n.RG;if(i===pl)return n.RG_INTEGER;if(i===ml)return n.RGBA_INTEGER;if(i===yo||i===vo||i===Mo||i===So)if(o===Se)if(r=t.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(i===yo)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===vo)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===Mo)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===So)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=t.get("WEBGL_compressed_texture_s3tc"),r!==null){if(i===yo)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===vo)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===Mo)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===So)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===gl||i===_l||i===xl||i===yl)if(r=t.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(i===gl)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===_l)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===xl)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===yl)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===vl||i===Ml||i===Sl||i===bl||i===Tl||i===bo||i===El)if(r=t.get("WEBGL_compressed_texture_etc"),r!==null){if(i===vl||i===Ml)return o===Se?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(i===Sl)return o===Se?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC;if(i===bl)return r.COMPRESSED_R11_EAC;if(i===Tl)return r.COMPRESSED_SIGNED_R11_EAC;if(i===bo)return r.COMPRESSED_RG11_EAC;if(i===El)return r.COMPRESSED_SIGNED_RG11_EAC}else return null;if(i===wl||i===Al||i===Cl||i===Rl||i===Pl||i===Il||i===Ll||i===Dl||i===Nl||i===Ul||i===Fl||i===Ol||i===Bl||i===kl)if(r=t.get("WEBGL_compressed_texture_astc"),r!==null){if(i===wl)return o===Se?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===Al)return o===Se?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===Cl)return o===Se?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===Rl)return o===Se?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===Pl)return o===Se?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===Il)return o===Se?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===Ll)return o===Se?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===Dl)return o===Se?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===Nl)return o===Se?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===Ul)return o===Se?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===Fl)return o===Se?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===Ol)return o===Se?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===Bl)return o===Se?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===kl)return o===Se?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===zl||i===Vl||i===Hl)if(r=t.get("EXT_texture_compression_bptc"),r!==null){if(i===zl)return o===Se?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===Vl)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===Hl)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===Gl||i===Wl||i===To||i===Xl)if(r=t.get("EXT_texture_compression_rgtc"),r!==null){if(i===Gl)return r.COMPRESSED_RED_RGTC1_EXT;if(i===Wl)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===To)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===Xl)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===Sr?n.UNSIGNED_INT_24_8:n[i]!==void 0?n[i]:null}return{convert:e}}var Iy=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Ly=`
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

}`,ru=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e){if(this.texture===null){let i=new ro(t.texture);(t.depthNear!==e.depthNear||t.depthFar!==e.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=i}}getMesh(t){if(this.texture!==null&&this.mesh===null){let e=t.cameras[0].viewport,i=new Un({vertexShader:Iy,fragmentShader:Ly,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new fn(new pn(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},ou=class extends Qn{constructor(t,e){super();let i=this,s=null,r=1,o=null,a="local-floor",l=1,c=null,u=null,d=null,h=null,f=null,p=null,_=typeof XRWebGLBinding<"u",m=new ru,g={},S=e.getContextAttributes(),A=null,v=null,b=[],T=[],C=new Zt,y=null,w=null,P=new rn;P.viewport=new Ne;let F=new rn;F.viewport=new Ne;let B=[P,F],V=new rl,I=null,k=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Y){let K=b[Y];return K===void 0&&(K=new hr,b[Y]=K),K.getTargetRaySpace()},this.getControllerGrip=function(Y){let K=b[Y];return K===void 0&&(K=new hr,b[Y]=K),K.getGripSpace()},this.getHand=function(Y){let K=b[Y];return K===void 0&&(K=new hr,b[Y]=K),K.getHandSpace()};function W(Y){let K=T.indexOf(Y.inputSource);if(K===-1)return;let it=b[K];it!==void 0&&(it.update(Y.inputSource,Y.frame,c||o),it.dispatchEvent({type:Y.type,data:Y.inputSource}))}function J(){s.removeEventListener("select",W),s.removeEventListener("selectstart",W),s.removeEventListener("selectend",W),s.removeEventListener("squeeze",W),s.removeEventListener("squeezestart",W),s.removeEventListener("squeezeend",W),s.removeEventListener("end",J),s.removeEventListener("inputsourceschange",et);for(let Y=0;Y<b.length;Y++){let K=T[Y];K!==null&&(T[Y]=null,b[Y].disconnect(K))}I=null,k=null,m.reset();for(let Y in g)delete g[Y];if(t.setRenderTarget(A),f=null,h=null,d=null,s=null,v=null,Et.stop(),i.isPresenting=!1,t.setPixelRatio(y),t.setSize(C.width,C.height,!1),w!==null){let Y=w.camera;Y.fov=w.fov,Y.zoom=w.zoom,Y.updateProjectionMatrix(),w=null}i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Y){r=Y,i.isPresenting===!0&&Gt("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Y){a=Y,i.isPresenting===!0&&Gt("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(Y){c=Y},this.getBaseLayer=function(){return h!==null?h:f},this.getBinding=function(){return d===null&&_&&(d=new XRWebGLBinding(s,e)),d},this.getFrame=function(){return p},this.getSession=function(){return s},this.setSession=async function(Y){if(s=Y,s!==null){if(A=t.getRenderTarget(),s.addEventListener("select",W),s.addEventListener("selectstart",W),s.addEventListener("selectend",W),s.addEventListener("squeeze",W),s.addEventListener("squeezestart",W),s.addEventListener("squeezeend",W),s.addEventListener("end",J),s.addEventListener("inputsourceschange",et),S.xrCompatible!==!0&&await e.makeXRCompatible(),y=t.getPixelRatio(),t.getSize(C),_&&"createProjectionLayer"in XRWebGLBinding.prototype){let it=null,Rt=null,ot=null;S.depth&&(ot=S.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,it=S.stencil?hs:gi,Rt=S.stencil?Sr:ei);let ut={colorFormat:e.RGBA8,depthFormat:ot,scaleFactor:r};d=this.getBinding(),h=d.createProjectionLayer(ut),s.updateRenderState({layers:[h]}),t.setPixelRatio(1),t.setSize(h.textureWidth,h.textureHeight,!1),v=new bn(h.textureWidth,h.textureHeight,{format:qn,type:En,depthTexture:new Qi(h.textureWidth,h.textureHeight,Rt,void 0,void 0,void 0,void 0,void 0,void 0,it),stencilBuffer:S.stencil,colorSpace:t.outputColorSpace,samples:S.antialias?4:0,resolveDepthBuffer:h.ignoreDepthValues===!1,resolveStencilBuffer:h.ignoreDepthValues===!1,storeMultisampledDepthBuffer:h.ignoreDepthValues===!1,storeMultisampledStencilBuffer:h.ignoreDepthValues===!1})}else{let it={antialias:S.antialias,alpha:!0,depth:S.depth,stencil:S.stencil,framebufferScaleFactor:r};f=new XRWebGLLayer(s,e,it),s.updateRenderState({baseLayer:f}),t.setPixelRatio(1),t.setSize(f.framebufferWidth,f.framebufferHeight,!1),v=new bn(f.framebufferWidth,f.framebufferHeight,{format:qn,type:En,colorSpace:t.outputColorSpace,stencilBuffer:S.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1,storeMultisampledDepthBuffer:f.ignoreDepthValues===!1,storeMultisampledStencilBuffer:f.ignoreDepthValues===!1})}v.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await s.requestReferenceSpace(a),Et.setContext(s),Et.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function et(Y){for(let K=0;K<Y.removed.length;K++){let it=Y.removed[K],Rt=T.indexOf(it);Rt>=0&&(T[Rt]=null,b[Rt].disconnect(it))}for(let K=0;K<Y.added.length;K++){let it=Y.added[K],Rt=T.indexOf(it);if(Rt===-1){for(let ut=0;ut<b.length;ut++)if(ut>=T.length){T.push(it),Rt=ut;break}else if(T[ut]===null){T[ut]=it,Rt=ut;break}if(Rt===-1)break}let ot=b[Rt];ot&&ot.connect(it)}}let U=new L,q=new L;function j(Y,K,it){U.setFromMatrixPosition(K.matrixWorld),q.setFromMatrixPosition(it.matrixWorld);let Rt=U.distanceTo(q),ot=K.projectionMatrix.elements,ut=it.projectionMatrix.elements,Yt=ot[14]/(ot[10]-1),Ot=ot[14]/(ot[10]+1),Wt=(ot[9]+1)/ot[5],kt=(ot[9]-1)/ot[5],Dt=(ot[8]-1)/ot[0],te=(ut[8]+1)/ut[0],ue=Yt*Dt,be=Yt*te,jt=Rt/(-Dt+te),le=jt*-Dt;if(K.matrixWorld.decompose(Y.position,Y.quaternion,Y.scale),Y.translateX(le),Y.translateZ(jt),Y.matrixWorld.compose(Y.position,Y.quaternion,Y.scale),Y.matrixWorldInverse.copy(Y.matrixWorld).invert(),ot[10]===-1)Y.projectionMatrix.copy(K.projectionMatrix),Y.projectionMatrixInverse.copy(K.projectionMatrixInverse);else{let R=Yt+jt,ne=Ot+jt,Pt=ue-le,E=be+(Rt-le),x=Wt*Ot/ne*R,O=kt*Ot/ne*R;Y.projectionMatrix.makePerspective(Pt,E,x,O,R,ne),Y.projectionMatrixInverse.copy(Y.projectionMatrix).invert()}}function yt(Y,K){K===null?Y.matrixWorld.copy(Y.matrix):Y.matrixWorld.multiplyMatrices(K.matrixWorld,Y.matrix),Y.matrixWorldInverse.copy(Y.matrixWorld).invert()}this.updateCamera=function(Y){if(s===null)return;let K=Y.near,it=Y.far;m.texture!==null&&(m.depthNear>0&&(K=m.depthNear),m.depthFar>0&&(it=m.depthFar)),V.near=F.near=P.near=K,V.far=F.far=P.far=it,(I!==V.near||k!==V.far)&&(s.updateRenderState({depthNear:V.near,depthFar:V.far}),I=V.near,k=V.far),V.layers.mask=Y.layers.mask|6,P.layers.mask=V.layers.mask&-5,F.layers.mask=V.layers.mask&-3;let Rt=Y.parent,ot=V.cameras;yt(V,Rt);for(let ut=0;ut<ot.length;ut++)yt(ot[ut],Rt);ot.length===2?j(V,P,F):V.projectionMatrix.copy(P.projectionMatrix),w===null&&Y.isPerspectiveCamera&&(w={camera:Y,fov:Y.fov,zoom:Y.zoom}),Tt(Y,V,Rt)};function Tt(Y,K,it){it===null?Y.matrix.copy(K.matrixWorld):(Y.matrix.copy(it.matrixWorld),Y.matrix.invert(),Y.matrix.multiply(K.matrixWorld)),Y.matrix.decompose(Y.position,Y.quaternion,Y.scale),Y.updateMatrixWorld(!0),Y.projectionMatrix.copy(K.projectionMatrix),Y.projectionMatrixInverse.copy(K.projectionMatrixInverse),Y.isPerspectiveCamera&&(Y.fov=lr*2*Math.atan(1/Y.projectionMatrix.elements[5]),Y.zoom=1)}this.getCamera=function(){return V},this.getFoveation=function(){if(!(h===null&&f===null))return l},this.setFoveation=function(Y){l=Y,h!==null&&(h.fixedFoveation=Y),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=Y)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(V)},this.getCameraTexture=function(Y){return g[Y]};let pe=null;function qt(Y,K){if(u=K.getViewerPose(c||o),p=K,u!==null){let it=u.views;f!==null&&(t.setRenderTargetFramebuffer(v,f.framebuffer),t.setRenderTarget(v));let Rt=!1;it.length!==V.cameras.length&&(V.cameras.length=0,Rt=!0);for(let Ot=0;Ot<it.length;Ot++){let Wt=it[Ot],kt=null;if(f!==null)kt=f.getViewport(Wt);else{let te=d.getViewSubImage(h,Wt);kt=te.viewport,Ot===0&&(t.setRenderTargetTextures(v,te.colorTexture,te.depthStencilTexture),t.setRenderTarget(v))}let Dt=B[Ot];Dt===void 0&&(Dt=new rn,Dt.layers.enable(Ot),Dt.viewport=new Ne,B[Ot]=Dt),Dt.matrix.fromArray(Wt.transform.matrix),Dt.matrix.decompose(Dt.position,Dt.quaternion,Dt.scale),Dt.projectionMatrix.fromArray(Wt.projectionMatrix),Dt.projectionMatrixInverse.copy(Dt.projectionMatrix).invert(),Dt.viewport.set(kt.x,kt.y,kt.width,kt.height),Ot===0&&(V.matrix.copy(Dt.matrix),V.matrix.decompose(V.position,V.quaternion,V.scale)),Rt===!0&&V.cameras.push(Dt)}let ot=s.enabledFeatures;if(ot&&ot.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&_){d=i.getBinding();let Ot=d.getDepthInformation(it[0]);Ot&&Ot.isValid&&Ot.texture&&m.init(Ot,s.renderState)}if(ot&&ot.includes("camera-access")&&_){t.state.unbindTexture(),d=i.getBinding();for(let Ot=0;Ot<it.length;Ot++){let Wt=it[Ot].camera;if(Wt){let kt=g[Wt];kt||(kt=new ro,g[Wt]=kt);let Dt=d.getCameraImage(Wt);kt.sourceTexture=Dt}}}}for(let it=0;it<b.length;it++){let Rt=T[it],ot=b[it];Rt!==null&&ot!==void 0&&ot.update(Rt,K,c||o)}pe&&pe(Y,K),K.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:K}),p=null}let Et=new Zf;Et.setAnimationLoop(qt),this.setAnimationLoop=function(Y){pe=Y},this.dispose=function(){}}},Dy=new De,tp=new Qt;tp.set(-1,0,0,0,1,0,0,0,1);function Ny(n,t){function e(m,g){m.matrixAutoUpdate===!0&&m.updateMatrix(),g.value.copy(m.matrix)}function i(m,g){g.color.getRGB(m.fogColor.value,Oh(n)),g.isFog?(m.fogNear.value=g.near,m.fogFar.value=g.far):g.isFogExp2&&(m.fogDensity.value=g.density)}function s(m,g,S,A,v){g.isNodeMaterial?g.uniformsNeedUpdate=!1:g.isMeshBasicMaterial?r(m,g):g.isMeshLambertMaterial?(r(m,g),g.envMap&&(m.envMapIntensity.value=g.envMapIntensity)):g.isMeshToonMaterial?(r(m,g),d(m,g)):g.isMeshPhongMaterial?(r(m,g),u(m,g),g.envMap&&(m.envMapIntensity.value=g.envMapIntensity)):g.isMeshStandardMaterial?(r(m,g),h(m,g),g.isMeshPhysicalMaterial&&f(m,g,v)):g.isMeshMatcapMaterial?(r(m,g),p(m,g)):g.isMeshDepthMaterial?r(m,g):g.isMeshDistanceMaterial?(r(m,g),_(m,g)):g.isMeshNormalMaterial?r(m,g):g.isLineBasicMaterial?(o(m,g),g.isLineDashedMaterial&&a(m,g)):g.isPointsMaterial?l(m,g,S,A):g.isSpriteMaterial?c(m,g):g.isShadowMaterial?(m.color.value.copy(g.color),m.opacity.value=g.opacity):g.isShaderMaterial&&(g.uniformsNeedUpdate=!1)}function r(m,g){m.opacity.value=g.opacity,g.color&&m.diffuse.value.copy(g.color),g.emissive&&m.emissive.value.copy(g.emissive).multiplyScalar(g.emissiveIntensity),g.map&&(m.map.value=g.map,e(g.map,m.mapTransform)),g.alphaMap&&(m.alphaMap.value=g.alphaMap,e(g.alphaMap,m.alphaMapTransform)),g.bumpMap&&(m.bumpMap.value=g.bumpMap,e(g.bumpMap,m.bumpMapTransform),m.bumpScale.value=g.bumpScale,g.side===gn&&(m.bumpScale.value*=-1)),g.normalMap&&(m.normalMap.value=g.normalMap,e(g.normalMap,m.normalMapTransform),m.normalScale.value.copy(g.normalScale),g.side===gn&&m.normalScale.value.negate()),g.displacementMap&&(m.displacementMap.value=g.displacementMap,e(g.displacementMap,m.displacementMapTransform),m.displacementScale.value=g.displacementScale,m.displacementBias.value=g.displacementBias),g.emissiveMap&&(m.emissiveMap.value=g.emissiveMap,e(g.emissiveMap,m.emissiveMapTransform)),g.specularMap&&(m.specularMap.value=g.specularMap,e(g.specularMap,m.specularMapTransform)),g.alphaTest>0&&(m.alphaTest.value=g.alphaTest);let S=t.get(g),A=S.envMap,v=S.envMapRotation;A&&(m.envMap.value=A,m.envMapRotation.value.setFromMatrix4(Dy.makeRotationFromEuler(v)).transpose(),A.isCubeTexture&&A.isRenderTargetTexture===!1&&m.envMapRotation.value.premultiply(tp),m.reflectivity.value=g.reflectivity,m.ior.value=g.ior,m.refractionRatio.value=g.refractionRatio),g.lightMap&&(m.lightMap.value=g.lightMap,m.lightMapIntensity.value=g.lightMapIntensity,e(g.lightMap,m.lightMapTransform)),g.aoMap&&(m.aoMap.value=g.aoMap,m.aoMapIntensity.value=g.aoMapIntensity,e(g.aoMap,m.aoMapTransform))}function o(m,g){m.diffuse.value.copy(g.color),m.opacity.value=g.opacity,g.map&&(m.map.value=g.map,e(g.map,m.mapTransform))}function a(m,g){m.dashSize.value=g.dashSize,m.totalSize.value=g.dashSize+g.gapSize,m.scale.value=g.scale}function l(m,g,S,A){m.diffuse.value.copy(g.color),m.opacity.value=g.opacity,m.size.value=g.size*S,m.scale.value=A*.5,g.map&&(m.map.value=g.map,e(g.map,m.uvTransform)),g.alphaMap&&(m.alphaMap.value=g.alphaMap,e(g.alphaMap,m.alphaMapTransform)),g.alphaTest>0&&(m.alphaTest.value=g.alphaTest)}function c(m,g){m.diffuse.value.copy(g.color),m.opacity.value=g.opacity,m.rotation.value=g.rotation,g.map&&(m.map.value=g.map,e(g.map,m.mapTransform)),g.alphaMap&&(m.alphaMap.value=g.alphaMap,e(g.alphaMap,m.alphaMapTransform)),g.alphaTest>0&&(m.alphaTest.value=g.alphaTest)}function u(m,g){m.specular.value.copy(g.specular),m.shininess.value=Math.max(g.shininess,1e-4)}function d(m,g){g.gradientMap&&(m.gradientMap.value=g.gradientMap)}function h(m,g){m.metalness.value=g.metalness,g.metalnessMap&&(m.metalnessMap.value=g.metalnessMap,e(g.metalnessMap,m.metalnessMapTransform)),m.roughness.value=g.roughness,g.roughnessMap&&(m.roughnessMap.value=g.roughnessMap,e(g.roughnessMap,m.roughnessMapTransform)),g.envMap&&(m.envMapIntensity.value=g.envMapIntensity)}function f(m,g,S){m.ior.value=g.ior,g.sheen>0&&(m.sheenColor.value.copy(g.sheenColor).multiplyScalar(g.sheen),m.sheenRoughness.value=g.sheenRoughness,g.sheenColorMap&&(m.sheenColorMap.value=g.sheenColorMap,e(g.sheenColorMap,m.sheenColorMapTransform)),g.sheenRoughnessMap&&(m.sheenRoughnessMap.value=g.sheenRoughnessMap,e(g.sheenRoughnessMap,m.sheenRoughnessMapTransform))),g.clearcoat>0&&(m.clearcoat.value=g.clearcoat,m.clearcoatRoughness.value=g.clearcoatRoughness,g.clearcoatMap&&(m.clearcoatMap.value=g.clearcoatMap,e(g.clearcoatMap,m.clearcoatMapTransform)),g.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=g.clearcoatRoughnessMap,e(g.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),g.clearcoatNormalMap&&(m.clearcoatNormalMap.value=g.clearcoatNormalMap,e(g.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(g.clearcoatNormalScale),g.side===gn&&m.clearcoatNormalScale.value.negate())),g.dispersion>0&&(m.dispersion.value=g.dispersion),g.retroreflectivity>0&&(m.retroreflectivity.value=g.retroreflectivity),g.iridescence>0&&(m.iridescence.value=g.iridescence,m.iridescenceIOR.value=g.iridescenceIOR,m.iridescenceThicknessMinimum.value=g.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=g.iridescenceThicknessRange[1],g.iridescenceMap&&(m.iridescenceMap.value=g.iridescenceMap,e(g.iridescenceMap,m.iridescenceMapTransform)),g.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=g.iridescenceThicknessMap,e(g.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),g.transmission>0&&(m.transmission.value=g.transmission,m.transmissionSamplerMap.value=S.texture,m.transmissionSamplerSize.value.set(S.width,S.height),g.transmissionMap&&(m.transmissionMap.value=g.transmissionMap,e(g.transmissionMap,m.transmissionMapTransform)),m.thickness.value=g.thickness,g.thicknessMap&&(m.thicknessMap.value=g.thicknessMap,e(g.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=g.attenuationDistance,m.attenuationColor.value.copy(g.attenuationColor)),g.anisotropy>0&&(m.anisotropyVector.value.set(g.anisotropy*Math.cos(g.anisotropyRotation),g.anisotropy*Math.sin(g.anisotropyRotation)),g.anisotropyMap&&(m.anisotropyMap.value=g.anisotropyMap,e(g.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=g.specularIntensity,m.specularColor.value.copy(g.specularColor),g.specularColorMap&&(m.specularColorMap.value=g.specularColorMap,e(g.specularColorMap,m.specularColorMapTransform)),g.specularIntensityMap&&(m.specularIntensityMap.value=g.specularIntensityMap,e(g.specularIntensityMap,m.specularIntensityMapTransform))}function p(m,g){g.matcap&&(m.matcap.value=g.matcap)}function _(m,g){let S=t.get(g).light;m.referencePosition.value.setFromMatrixPosition(S.matrixWorld),m.nearDistance.value=S.shadow.camera.near,m.farDistance.value=S.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:s}}function Uy(n,t,e,i){let s={},r={},o=[],a=n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS);function l(v,b){let T=b.program;i.uniformBlockBinding(v,T)}function c(v,b){let T=s[v.id];T===void 0&&(m(v),T=u(v),s[v.id]=T,v.addEventListener("dispose",S));let C=b.program;i.updateUBOMapping(v,C);let y=t.render.frame;r[v.id]!==y&&(h(v),r[v.id]=y)}function u(v){let b=d();v.__bindingPointIndex=b;let T=n.createBuffer(),C=v.__size,y=v.usage;return n.bindBuffer(n.UNIFORM_BUFFER,T),n.bufferData(n.UNIFORM_BUFFER,C,y),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,b,T),T}function d(){for(let v=0;v<a;v++)if(o.indexOf(v)===-1)return o.push(v),v;return Jt("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function h(v){let b=s[v.id],T=v.uniforms,C=v.__cache;n.bindBuffer(n.UNIFORM_BUFFER,b);for(let y=0,w=T.length;y<w;y++){let P=T[y];if(Array.isArray(P))for(let F=0,B=P.length;F<B;F++)f(P[F],y,F,C);else f(P,y,0,C)}n.bindBuffer(n.UNIFORM_BUFFER,null)}function f(v,b,T,C){if(_(v,b,T,C)===!0){let y=v.__offset,w=v.value;if(Array.isArray(w)){let P=0;for(let F=0;F<w.length;F++){let B=w[F],V=g(B);p(B,v.__data,P),typeof B!="number"&&typeof B!="boolean"&&!B.isMatrix3&&!ArrayBuffer.isView(B)&&(P+=V.storage/Float32Array.BYTES_PER_ELEMENT)}}else p(w,v.__data,0);n.bufferSubData(n.UNIFORM_BUFFER,y,v.__data)}}function p(v,b,T){typeof v=="number"||typeof v=="boolean"?b[0]=v:v.isMatrix3?(b[0]=v.elements[0],b[1]=v.elements[1],b[2]=v.elements[2],b[3]=0,b[4]=v.elements[3],b[5]=v.elements[4],b[6]=v.elements[5],b[7]=0,b[8]=v.elements[6],b[9]=v.elements[7],b[10]=v.elements[8],b[11]=0):ArrayBuffer.isView(v)?b.set(new v.constructor(v.buffer,v.byteOffset,b.length)):v.toArray(b,T)}function _(v,b,T,C){let y=v.value,w=b+"_"+T;if(C[w]===void 0)return typeof y=="number"||typeof y=="boolean"?C[w]=y:ArrayBuffer.isView(y)?C[w]=y.slice():C[w]=y.clone(),!0;{let P=C[w];if(typeof y=="number"||typeof y=="boolean"){if(P!==y)return C[w]=y,!0}else{if(ArrayBuffer.isView(y))return!0;if(P.equals(y)===!1)return P.copy(y),!0}}return!1}function m(v){let b=v.uniforms,T=0,C=16;for(let w=0,P=b.length;w<P;w++){let F=Array.isArray(b[w])?b[w]:[b[w]];for(let B=0,V=F.length;B<V;B++){let I=F[B],k=Array.isArray(I.value)?I.value:[I.value];for(let W=0,J=k.length;W<J;W++){let et=k[W],U=g(et),q=T%C,j=q%U.boundary,yt=q+j;T+=j,yt!==0&&C-yt<U.storage&&(T+=C-yt),I.__data=new Float32Array(U.storage/Float32Array.BYTES_PER_ELEMENT),I.__offset=T,T+=U.storage}}}let y=T%C;return y>0&&(T+=C-y),v.__size=T,v.__cache={},this}function g(v){let b={boundary:0,storage:0};return typeof v=="number"||typeof v=="boolean"?(b.boundary=4,b.storage=4):v.isVector2?(b.boundary=8,b.storage=8):v.isVector3||v.isColor?(b.boundary=16,b.storage=12):v.isVector4?(b.boundary=16,b.storage=16):v.isMatrix3?(b.boundary=48,b.storage=48):v.isMatrix4?(b.boundary=64,b.storage=64):v.isTexture?Gt("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(v)?(b.boundary=16,b.storage=v.byteLength):Gt("WebGLRenderer: Unsupported uniform value type.",v),b}function S(v){let b=v.target;b.removeEventListener("dispose",S);let T=o.indexOf(b.__bindingPointIndex);o.splice(T,1),n.deleteBuffer(s[b.id]),delete s[b.id],delete r[b.id]}function A(){for(let v in s)n.deleteBuffer(s[v]);o=[],s={},r={}}return{bind:l,update:c,dispose:A}}var Fy=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]),yi=null;function Oy(){return yi===null&&(yi=new ka(Fy,16,16,us,ii),yi.name="DFG_LUT",yi.minFilter=Qe,yi.magFilter=Qe,yi.wrapS=mi,yi.wrapT=mi,yi.generateMipmaps=!1,yi.needsUpdate=!0),yi}var Ql=class{constructor(t={}){let{canvas:e=yf(),context:i=null,depth:s=!0,stencil:r=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:d=!1,reversedDepthBuffer:h=!1,outputBufferType:f=En}=t;this.isWebGLRenderer=!0;let p;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");p=i.getContextAttributes().alpha}else p=o;let _=f,m=new Set([ml,pl,fl]),g=new Set([En,ei,Mr,Sr,ul,dl]),S=new Uint32Array(4),A=new Int32Array(4),v=new L,b=null,T=null,C=[],y=[],w=null;this.domElement=e,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=ti,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let P=this,F=!1,B=null,V=null,I=null,k=null;this._outputColorSpace=dn;let W=0,J=0,et=null,U=-1,q=null,j=new Ne,yt=new Ne,Tt=null,pe=new ae(0),qt=0,Et=e.width,Y=e.height,K=1,it=null,Rt=null,ot=new Ne(0,0,Et,Y),ut=new Ne(0,0,Et,Y),Yt=!1,Ot=new dr,Wt=!1,kt=!1,Dt=new De,te=new L,ue=new Ne,be={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},jt=!1;function le(){return et===null?K:1}let R=i;function ne(M,D){return e.getContext(M,D)}let Pt,E,x,O,z,Z,st,rt,$,Q,at,Ut,dt,ct,It,Ht,zt,N,ht,tt,lt,mt,nt;try{let M={alpha:!0,depth:s,stencil:r,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:u,failIfMajorPerformanceCaveat:d};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${"186"}`),e.addEventListener("webglcontextlost",Nt,!1),e.addEventListener("webglcontextrestored",Kt,!1),e.addEventListener("webglcontextcreationerror",Bn,!1),R===null){let D="webgl2";if(R=ne(D,M),R===null)throw ne(D)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}xt()}catch(M){throw e.removeEventListener("webglcontextlost",Nt,!1),e.removeEventListener("webglcontextrestored",Kt,!1),e.removeEventListener("webglcontextcreationerror",Bn,!1),Jt("WebGLRenderer: "+M.message),M}function xt(){Pt=new W_(R),Pt.init(),lt=new Py(R,Pt),E=new N_(R,Pt,t,lt),x=new Cy(R,Pt),E.reversedDepthBuffer&&h&&x.buffers.depth.setReversed(!0),V=R.createFramebuffer(),I=R.createFramebuffer(),k=R.createFramebuffer(),O=new Y_(R),z=new py,Z=new Ry(R,Pt,x,z,E,lt,O),st=new G_(P),rt=new Jm(R),mt=new L_(R,rt),$=new X_(R,rt,O,mt),Q=new J_(R,$,rt,mt,O),N=new Z_(R,E,Z),It=new U_(z),at=new fy(P,st,Pt,E,mt,It),Ut=new Ny(P,z),dt=new gy,ct=new Sy(Pt),zt=new I_(P,st,x,Q,p,l),Ht=new Ay(P,Q,E),nt=new Uy(R,O,E,x),ht=new D_(R,Pt,O),tt=new q_(R,Pt,O),O.programs=at.programs,P.capabilities=E,P.extensions=Pt,P.properties=z,P.renderLists=dt,P.shadowMap=Ht,P.state=x,P.info=O}_!==En&&(w=new K_(_,e.width,e.height,a,s,r));let wt=new ou(P,R);this.xr=wt,this.getContext=function(){return R},this.getContextAttributes=function(){return R.getContextAttributes()},this.forceContextLoss=function(){let M=Pt.get("WEBGL_lose_context");M&&M.loseContext()},this.forceContextRestore=function(){let M=Pt.get("WEBGL_lose_context");M&&M.restoreContext()},this.getPixelRatio=function(){return K},this.setPixelRatio=function(M){M!==void 0&&(K=M,this.setSize(Et,Y,!1))},this.getSize=function(M){return M.set(Et,Y)},this.setSize=function(M,D,X=!0){if(wt.isPresenting){Gt("WebGLRenderer: Can't change size while VR device is presenting.");return}Et=M,Y=D,e.width=Math.floor(M*K),e.height=Math.floor(D*K),X===!0&&(e.style.width=M+"px",e.style.height=D+"px"),w!==null&&w.setSize(e.width,e.height),this.setViewport(0,0,M,D)},this.getDrawingBufferSize=function(M){return M.set(Et*K,Y*K).floor()},this.setDrawingBufferSize=function(M,D,X){Et=M,Y=D,K=X,e.width=Math.floor(M*X),e.height=Math.floor(D*X),this.setViewport(0,0,M,D)},this.setEffects=function(M){if(_===En){Jt("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(M){for(let D=0;D<M.length;D++)if(M[D].isOutputPass===!0){Gt("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}w.setEffects(M||[])},this.getCurrentViewport=function(M){return M.copy(j)},this.getViewport=function(M){return M.copy(ot)},this.setViewport=function(M,D,X,H){M.isVector4?ot.set(M.x,M.y,M.z,M.w):ot.set(M,D,X,H),x.viewport(j.copy(ot).multiplyScalar(K).round())},this.getScissor=function(M){return M.copy(ut)},this.setScissor=function(M,D,X,H){M.isVector4?ut.set(M.x,M.y,M.z,M.w):ut.set(M,D,X,H),x.scissor(yt.copy(ut).multiplyScalar(K).round())},this.getScissorTest=function(){return Yt},this.setScissorTest=function(M){x.setScissorTest(Yt=M)},this.setOpaqueSort=function(M){it=M},this.setTransparentSort=function(M){Rt=M},this.getClearColor=function(M){return M.copy(zt.getClearColor())},this.setClearColor=function(){zt.setClearColor(...arguments)},this.getClearAlpha=function(){return zt.getClearAlpha()},this.setClearAlpha=function(){zt.setClearAlpha(...arguments)},this.clear=function(M=!0,D=!0,X=!0){let H=0;if(M){let G=!1;if(et!==null){let _t=et.texture.format;G=m.has(_t)}if(G){let _t=et.texture.type,bt=g.has(_t),gt=zt.getClearColor(),At=zt.getClearAlpha(),Ft=gt.r,ce=gt.g,me=gt.b;bt?(S[0]=Ft,S[1]=ce,S[2]=me,S[3]=At,R.clearBufferuiv(R.COLOR,0,S)):(A[0]=Ft,A[1]=ce,A[2]=me,A[3]=At,R.clearBufferiv(R.COLOR,0,A))}else H|=R.COLOR_BUFFER_BIT}D&&(H|=R.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),X&&(H|=R.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),H!==0&&R.clear(H)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(M){M.setRenderer(this),B=M},this.dispose=function(){e.removeEventListener("webglcontextlost",Nt,!1),e.removeEventListener("webglcontextrestored",Kt,!1),e.removeEventListener("webglcontextcreationerror",Bn,!1),zt.dispose(),dt.dispose(),ct.dispose(),z.dispose(),st.dispose(),Q.dispose(),mt.dispose(),nt.dispose(),at.dispose(),wt.dispose(),wt.removeEventListener("sessionstart",gu),wt.removeEventListener("sessionend",_u),ds.stop()};function Nt(M){M.preventDefault(),Nh("WebGLRenderer: Context Lost."),F=!0}function Kt(){Nh("WebGLRenderer: Context Restored."),F=!1;let M=O.autoReset,D=Ht.enabled,X=Ht.autoUpdate,H=Ht.needsUpdate,G=Ht.type;xt(),O.autoReset=M,Ht.enabled=D,Ht.autoUpdate=X,Ht.needsUpdate=H,Ht.type=G}function Bn(M){Jt("WebGLRenderer: A WebGL context could not be created. Reason: ",M.statusMessage)}function Cn(M){let D=M.target;D.removeEventListener("dispose",Cn),Pp(D)}function Pp(M){Ip(M),z.remove(M)}function Ip(M){let D=z.get(M).programs;D!==void 0&&(D.forEach(function(X){at.releaseProgram(X)}),M.isShaderMaterial&&at.releaseShaderCache(M))}this.renderBufferDirect=function(M,D,X,H,G,_t){D===null&&(D=be);let bt=G.isMesh&&G.matrixWorld.determinantAffine()<0,gt=Np(M,D,X,H,G);x.setMaterial(H,bt);let At=X.index,Ft=1;if(H.wireframe===!0){if(At=$.getWireframeAttribute(X),At===void 0)return;Ft=2}let ce=X.drawRange,me=X.attributes.position,Ct=ce.start*Ft,ve=(ce.start+ce.count)*Ft;_t!==null&&(Ct=Math.max(Ct,_t.start*Ft),ve=Math.min(ve,(_t.start+_t.count)*Ft)),At!==null?(Ct=Math.max(Ct,0),ve=Math.min(ve,At.count)):me!=null&&(Ct=Math.max(Ct,0),ve=Math.min(ve,me.count));let ze=ve-Ct;if(ze<0||ze===1/0)return;mt.setup(G,H,gt,X,At);let Ie,we=ht;if(At!==null&&(Ie=rt.get(At),we=tt,we.setIndex(Ie)),G.isMesh)H.wireframe===!0?(x.setLineWidth(H.wireframeLinewidth*le()),we.setMode(R.LINES)):we.setMode(R.TRIANGLES);else if(G.isLine){let en=H.linewidth;en===void 0&&(en=1),x.setLineWidth(en*le()),G.isLineSegments?we.setMode(R.LINES):G.isLineLoop?we.setMode(R.LINE_LOOP):we.setMode(R.LINE_STRIP)}else G.isPoints?we.setMode(R.POINTS):G.isSprite&&we.setMode(R.TRIANGLES);if(G.isBatchedMesh)if(Pt.get("WEBGL_multi_draw"))we.renderMultiDraw(G._multiDrawStarts,G._multiDrawCounts,G._multiDrawCount);else{let en=G._multiDrawStarts,Mt=G._multiDrawCounts,ln=G._multiDrawCount,_e=At?rt.get(At).bytesPerElement:1,kn=z.get(H).currentProgram.getUniforms();for(let ai=0;ai<ln;ai++)kn.setValue(R,"_gl_DrawID",ai),we.render(en[ai]/_e,Mt[ai])}else if(G.isInstancedMesh)we.renderInstances(Ct,ze,G.count);else if(X.isInstancedBufferGeometry){let en=X._maxInstanceCount!==void 0?X._maxInstanceCount:1/0,Mt=Math.min(X.instanceCount,en);we.renderInstances(Ct,ze,Mt)}else we.render(Ct,ze)};function mu(M,D,X,H){B!==null&&M.isNodeMaterial&&B.setObject(H,M),Wt===!0&&It.setState(M,X,!1),M.transparent===!0&&M.side===Xn&&M.forceSinglePass===!1?(M.side=gn,M.needsUpdate=!0,Po(M,D,H),M.side=as,M.needsUpdate=!0,Po(M,D,H),M.side=Xn):Po(M,D,H)}this.compile=function(M,D,X=null){X===null&&(X=M),B!==null&&B.renderStart(M,D,X),T=ct.get(X),T.init(D),y.push(T),X.traverseVisible(function(G){G.isLight&&G.layers.test(D.layers)&&(T.pushLight(G),G.castShadow&&T.pushShadow(G))}),M!==X&&M.traverseVisible(function(G){G.isLight&&G.layers.test(D.layers)&&(T.pushLight(G),G.castShadow&&T.pushShadow(G))}),T.setupLights(),B!==null&&B.updateLights(T.state.lightsArray),kt=this.localClippingEnabled,Wt=It.init(this.clippingPlanes,kt),Wt===!0&&It.setGlobalState(this.clippingPlanes,D),B!==null&&Ht.render(T.state.shadowsArray,X,D);let H=new Set;return M.traverse(function(G){if(!(G.isMesh||G.isPoints||G.isLine||G.isSprite))return;let _t=G.material;if(_t)if(Array.isArray(_t))for(let bt=0;bt<_t.length;bt++){let gt=_t[bt];mu(gt,X,D,G),H.add(gt)}else mu(_t,X,D,G),H.add(_t)}),T=y.pop(),B!==null&&B.renderEnd(),H},this.compileAsync=function(M,D,X=null){let H=this.compile(M,D,X);return new Promise(G=>{function _t(){if(H.forEach(function(bt){let At=z.get(bt).currentProgram;(At===void 0||At.isReady())&&H.delete(bt)}),H.size===0){G(M);return}setTimeout(_t,10)}Pt.get("KHR_parallel_shader_compile")!==null?_t():setTimeout(_t,10)})};let uc=null;function Lp(M){uc&&uc(M)}function gu(){ds.stop()}function _u(){ds.start()}let ds=new Zf;ds.setAnimationLoop(Lp),typeof self<"u"&&ds.setContext(self),this.setAnimationLoop=function(M){uc=M,wt.setAnimationLoop(M),M===null?ds.stop():ds.start()},wt.addEventListener("sessionstart",gu),wt.addEventListener("sessionend",_u),this.render=function(M,D){if(D!==void 0&&D.isCamera!==!0){Jt("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(F===!0)return;B!==null&&B.renderStart(M,D);let X=wt.enabled===!0&&wt.isPresenting===!0,H=w!==null&&(et===null||X)&&w.begin(P,et);if(M.matrixWorldAutoUpdate===!0&&M.updateMatrixWorld(),D.parent===null&&D.matrixWorldAutoUpdate===!0&&D.updateMatrixWorld(),wt.enabled===!0&&wt.isPresenting===!0&&(w===null||w.isCompositing()===!1)&&(wt.cameraAutoUpdate===!0&&wt.updateCamera(D),D=wt.getCamera()),M.isScene===!0&&M.onBeforeRender(P,M,D,et),T=ct.get(M,y.length),T.init(D),T.state.textureUnits=Z.getTextureUnits(),y.push(T),Dt.multiplyMatrices(D.projectionMatrix,D.matrixWorldInverse),Ot.setFromProjectionMatrix(Dt,jn,D.reversedDepth),kt=this.localClippingEnabled,Wt=It.init(this.clippingPlanes,kt),b=dt.get(M,C.length),b.init(),C.push(b),wt.enabled===!0&&wt.isPresenting===!0){let bt=P.xr.getDepthSensingMesh();bt!==null&&dc(bt,D,-1/0,P.sortObjects)}dc(M,D,0,P.sortObjects),b.finish(),B!==null&&B.updateLights(T.state.lightsArray),P.sortObjects===!0&&b.sort(it,Rt),jt=wt.enabled===!1||wt.isPresenting===!1||wt.hasDepthSensing()===!1,jt&&zt.addToRenderList(b,M),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),Wt===!0&&It.beginShadows();let G=T.state.shadowsArray;if(Ht.render(G,M,D),Wt===!0&&It.endShadows(),(H&&w.hasRenderPass())===!1){let bt=b.opaque,gt=b.transmissive;if(T.setupLights(),D.isArrayCamera){let At=D.cameras;if(gt.length>0)for(let Ft=0,ce=At.length;Ft<ce;Ft++){let me=At[Ft];yu(bt,gt,M,me)}jt&&zt.render(M);for(let Ft=0,ce=At.length;Ft<ce;Ft++){let me=At[Ft];xu(b,M,me,me.viewport)}}else gt.length>0&&yu(bt,gt,M,D),jt&&zt.render(M),xu(b,M,D)}et!==null&&J===0&&(Z.updateMultisampleRenderTarget(et),Z.updateRenderTargetMipmap(et)),H&&w.end(P),M.isScene===!0&&M.onAfterRender(P,M,D),mt.resetDefaultState(),U=-1,q=null,y.pop(),y.length>0?(T=y[y.length-1],Z.setTextureUnits(T.state.textureUnits),Wt===!0&&It.setGlobalState(P.clippingPlanes,T.state.camera)):T=null,C.pop(),C.length>0?b=C[C.length-1]:b=null,B!==null&&B.renderEnd()};function dc(M,D,X,H){if(M.visible===!1)return;if(M.layers.test(D.layers)){if(M.isGroup)X=M.renderOrder;else if(M.isLOD)M.autoUpdate===!0&&M.update(D);else if(M.isLightProbeGrid)T.pushLightProbeGrid(M);else if(M.isLight)T.pushLight(M),M.castShadow&&T.pushShadow(M);else if(M.isSprite){if(!M.frustumCulled||M.intersectsFrustum(Ot)){H&&ue.setFromMatrixPosition(M.matrixWorld).applyMatrix4(Dt);let bt=Q.update(M),gt=M.material;gt.visible&&b.push(M,bt,gt,X,ue.z,null,D)}}else if((M.isMesh||M.isLine||M.isPoints)&&(!M.frustumCulled||M.intersectsFrustum(Ot))){let bt=Q.update(M),gt=M.material;if(H&&(M.boundingSphere!==void 0?(M.boundingSphere===null&&M.computeBoundingSphere(),ue.copy(M.boundingSphere.center)):(bt.boundingSphere===null&&bt.computeBoundingSphere(),ue.copy(bt.boundingSphere.center)),ue.applyMatrix4(M.matrixWorld).applyMatrix4(Dt)),Array.isArray(gt)){let At=bt.groups;for(let Ft=0,ce=At.length;Ft<ce;Ft++){let me=At[Ft],Ct=gt[me.materialIndex];Ct&&Ct.visible&&b.push(M,bt,Ct,X,ue.z,me,D)}}else gt.visible&&b.push(M,bt,gt,X,ue.z,null,D)}}let _t=M.children;for(let bt=0,gt=_t.length;bt<gt;bt++)dc(_t[bt],D,X,H)}function xu(M,D,X,H){let{opaque:G,transmissive:_t,transparent:bt}=M;T.setupLightsView(X),Wt===!0&&It.setGlobalState(P.clippingPlanes,X),H&&x.viewport(j.copy(H)),G.length>0&&Ro(G,D,X),_t.length>0&&Ro(_t,D,X),bt.length>0&&Ro(bt,D,X),x.buffers.depth.setTest(!0),x.buffers.depth.setMask(!0),x.buffers.color.setMask(!0),x.setPolygonOffset(!1)}function yu(M,D,X,H){if((X.isScene===!0?X.overrideMaterial:null)!==null)return;if(T.state.transmissionRenderTarget[H.id]===void 0){let Ct=Pt.has("EXT_color_buffer_half_float")||Pt.has("EXT_color_buffer_float");T.state.transmissionRenderTarget[H.id]=new bn(1,1,{generateMipmaps:!0,type:Ct?ii:En,minFilter:cs,samples:Math.max(4,E.samples),stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:ge.workingColorSpace})}let _t=T.state.transmissionRenderTarget[H.id],bt=H.viewport||j;_t.setSize(bt.z*P.transmissionResolutionScale,bt.w*P.transmissionResolutionScale);let gt=P.getRenderTarget(),At=P.getActiveCubeFace(),Ft=P.getActiveMipmapLevel();P.setRenderTarget(_t),P.getClearColor(pe),qt=P.getClearAlpha(),qt<1&&P.setClearColor(16777215,.5),P.clear(),jt&&zt.render(X);let ce=P.toneMapping;P.toneMapping=ti;let me=H.viewport;if(H.viewport!==void 0&&(H.viewport=void 0),T.setupLightsView(H),Wt===!0&&It.setGlobalState(P.clippingPlanes,H),Ro(M,X,H),Z.updateMultisampleRenderTarget(_t),Z.updateRenderTargetMipmap(_t),Pt.has("WEBGL_multisampled_render_to_texture")===!1){let Ct=!1;for(let ve=0,ze=D.length;ve<ze;ve++){let Ie=D[ve],{object:we,geometry:en,material:Mt,group:ln}=Ie;if(Mt.side===Xn&&we.layers.test(H.layers)){let _e=Mt.side;Mt.side=gn,Mt.needsUpdate=!0,vu(we,X,H,en,Mt,ln),Mt.side=_e,Mt.needsUpdate=!0,Ct=!0}}Ct===!0&&(Z.updateMultisampleRenderTarget(_t),Z.updateRenderTargetMipmap(_t))}P.setRenderTarget(gt,At,Ft),P.setClearColor(pe,qt),me!==void 0&&(H.viewport=me),P.toneMapping=ce}function Ro(M,D,X){let H=D.isScene===!0?D.overrideMaterial:null;for(let G=0,_t=M.length;G<_t;G++){let bt=M[G],{object:gt,geometry:At,group:Ft}=bt,ce=bt.material;ce.allowOverride===!0&&H!==null&&(ce=H),gt.layers.test(X.layers)&&vu(gt,D,X,At,ce,Ft)}}function vu(M,D,X,H,G,_t){B!==null&&G.isNodeMaterial&&B.setObject(M,G),M.onBeforeRender(P,D,X,H,G,_t),M.modelViewMatrix.multiplyMatrices(X.matrixWorldInverse,M.matrixWorld),M.normalMatrix.getNormalMatrix(M.modelViewMatrix),G.onBeforeRender(P,D,X,H,M,_t),G.transparent===!0&&G.side===Xn&&G.forceSinglePass===!1?(G.side=gn,G.needsUpdate=!0,P.renderBufferDirect(X,D,H,G,M,_t),G.side=as,G.needsUpdate=!0,P.renderBufferDirect(X,D,H,G,M,_t),G.side=Xn):P.renderBufferDirect(X,D,H,G,M,_t),M.onAfterRender(P,D,X,H,G,_t)}function Po(M,D,X){D.isScene!==!0&&(D=be);let H=z.get(M),G=T.state.lights,_t=T.state.shadowsArray,bt=G.state.version,gt=at.getParameters(M,G.state,_t,D,X,T.state.lightProbeGridArray),At=at.getProgramCacheKey(gt),Ft=H.programs;H.environment=M.isMeshStandardMaterial||M.isMeshLambertMaterial||M.isMeshPhongMaterial?D.environment:null,H.fog=D.fog;let ce=M.isMeshStandardMaterial||M.isMeshLambertMaterial&&!M.envMap||M.isMeshPhongMaterial&&!M.envMap;H.envMap=st.get(M.envMap||H.environment,ce),H.envMapRotation=H.environment!==null&&M.envMap===null?D.environmentRotation:M.envMapRotation,Ft===void 0&&(M.addEventListener("dispose",Cn),Ft=new Map,H.programs=Ft);let me=Ft.get(At);if(me!==void 0){if(H.currentProgram===me&&H.lightsStateVersion===bt)return Su(M,gt),me}else gt.uniforms=at.getUniforms(M),B!==null&&M.isNodeMaterial&&B.build(M,X,gt),M.onBeforeCompile(gt,P),me=at.acquireProgram(gt,At),Ft.set(At,me),H.uniforms=gt.uniforms;let Ct=H.uniforms;return(!M.isShaderMaterial&&!M.isRawShaderMaterial||M.clipping===!0)&&(Ct.clippingPlanes=It.uniform),Su(M,gt),H.needsLights=Fp(M),H.lightsStateVersion=bt,H.needsLights&&(Ct.ambientLightColor.value=G.state.ambient,Ct.lightProbe.value=G.state.probe,Ct.sunLights.value=G.state.sun,Ct.sunLightShadows.value=G.state.sunShadow,Ct.directionalLights.value=G.state.directional,Ct.directionalLightShadows.value=G.state.directionalShadow,Ct.spotLights.value=G.state.spot,Ct.spotLightShadows.value=G.state.spotShadow,Ct.rectAreaLights.value=G.state.rectArea,Ct.ltc_1.value=G.state.rectAreaLTC1,Ct.ltc_2.value=G.state.rectAreaLTC2,Ct.pointLights.value=G.state.point,Ct.pointLightShadows.value=G.state.pointShadow,Ct.hemisphereLights.value=G.state.hemi,Ct.sunShadowMatrix.value=G.state.sunShadowMatrix,Ct.sunShadowCascade.value=G.state.sunShadowCascade,Ct.directionalShadowMatrix.value=G.state.directionalShadowMatrix,Ct.spotLightMatrix.value=G.state.spotLightMatrix,Ct.spotLightMap.value=G.state.spotLightMap,Ct.pointShadowMatrix.value=G.state.pointShadowMatrix),H.lightProbeGrid=T.state.lightProbeGridArray.length>0,H.currentProgram=me,H.uniformsList=null,me}function Mu(M){if(M.uniformsList===null){let D=M.currentProgram.getUniforms();M.uniformsList=wr.seqWithValue(D.seq,M.uniforms)}return M.uniformsList}function Su(M,D){let X=z.get(M);X.outputColorSpace=D.outputColorSpace,X.batching=D.batching,X.batchingColor=D.batchingColor,X.instancing=D.instancing,X.instancingColor=D.instancingColor,X.instancingMorph=D.instancingMorph,X.skinning=D.skinning,X.morphTargets=D.morphTargets,X.morphNormals=D.morphNormals,X.morphColors=D.morphColors,X.morphTargetsCount=D.morphTargetsCount,X.numClippingPlanes=D.numClippingPlanes,X.numIntersection=D.numClipIntersection,X.vertexAlphas=D.vertexAlphas,X.vertexTangents=D.vertexTangents,X.toneMapping=D.toneMapping}function Dp(M,D){if(M.length===0)return null;if(M.length===1)return M[0].texture!==null?M[0]:null;v.setFromMatrixPosition(D.matrixWorld);for(let X=0,H=M.length;X<H;X++){let G=M[X];if(G.texture!==null&&G.boundingBox.containsPoint(v))return G}return null}function Np(M,D,X,H,G){D.isScene!==!0&&(D=be),Z.resetTextureUnits();let _t=D.fog,bt=H.isMeshStandardMaterial||H.isMeshLambertMaterial||H.isMeshPhongMaterial?D.environment:null,gt=et===null?P.outputColorSpace:et.isXRRenderTarget===!0?et.texture.colorSpace:ge.workingColorSpace,At=H.isMeshStandardMaterial||H.isMeshLambertMaterial&&!H.envMap||H.isMeshPhongMaterial&&!H.envMap,Ft=st.get(H.envMap||bt,At),ce=H.vertexColors===!0&&!!X.attributes.color&&X.attributes.color.itemSize===4,me=!!X.attributes.tangent&&(!!H.normalMap||H.anisotropy>0),Ct=!!X.morphAttributes.position,ve=!!X.morphAttributes.normal,ze=!!X.morphAttributes.color,Ie=ti;H.toneMapped&&(et===null||et.isXRRenderTarget===!0)&&(Ie=P.toneMapping);let we=X.morphAttributes.position||X.morphAttributes.normal||X.morphAttributes.color,en=we!==void 0?we.length:0,Mt=z.get(H),ln=T.state.lights;if(Wt===!0&&(kt===!0||M!==q)){let Re=M===q&&H.id===U;It.setState(H,M,Re)}let _e=!1;H.version===Mt.__version?(Mt.needsLights&&Mt.lightsStateVersion!==ln.state.version||Mt.outputColorSpace!==gt||G.isBatchedMesh&&Mt.batching===!1||!G.isBatchedMesh&&Mt.batching===!0||G.isBatchedMesh&&Mt.batchingColor===!0&&G._colorsTexture===null||G.isBatchedMesh&&Mt.batchingColor===!1&&G._colorsTexture!==null||G.isInstancedMesh&&Mt.instancing===!1||!G.isInstancedMesh&&Mt.instancing===!0||G.isSkinnedMesh&&Mt.skinning===!1||!G.isSkinnedMesh&&Mt.skinning===!0||G.isInstancedMesh&&Mt.instancingColor===!0&&G.instanceColor===null||G.isInstancedMesh&&Mt.instancingColor===!1&&G.instanceColor!==null||G.isInstancedMesh&&Mt.instancingMorph===!0&&G.morphTexture===null||G.isInstancedMesh&&Mt.instancingMorph===!1&&G.morphTexture!==null||Mt.envMap!==Ft||H.fog===!0&&Mt.fog!==_t||Mt.numClippingPlanes!==void 0&&(Mt.numClippingPlanes!==It.numPlanes||Mt.numIntersection!==It.numIntersection)||Mt.vertexAlphas!==ce||Mt.vertexTangents!==me||Mt.morphTargets!==Ct||Mt.morphNormals!==ve||Mt.morphColors!==ze||Mt.toneMapping!==Ie||Mt.morphTargetsCount!==en||!!Mt.lightProbeGrid!=T.state.lightProbeGridArray.length>0)&&(_e=!0):(_e=!0,Mt.__version=H.version);let kn=Mt.currentProgram;_e===!0&&(kn=Po(H,D,G),B&&H.isNodeMaterial&&B.onUpdateProgram(H,kn,Mt));let ai=!1,zi=!1,Ls=!1,Ee=kn.getUniforms(),ke=Mt.uniforms;if(x.useProgram(kn.program)&&(ai=!0,zi=!0,Ls=!0),H.id!==U&&(U=H.id,zi=!0),Mt.needsLights){let Re=Dp(T.state.lightProbeGridArray,G);Mt.lightProbeGrid!==Re&&(Mt.lightProbeGrid=Re,zi=!0)}if(ai||q!==M){x.buffers.depth.getReversed()&&M.reversedDepth!==!0&&(M._reversedDepth=!0,M.updateProjectionMatrix()),Ee.setValue(R,"projectionMatrix",M.projectionMatrix),Ee.setValue(R,"viewMatrix",M.matrixWorldInverse);let Hi=Ee.map.cameraPosition;Hi!==void 0&&Hi.setValue(R,te.setFromMatrixPosition(M.matrixWorld)),E.logarithmicDepthBuffer&&Ee.setValue(R,"logDepthBufFC",2/(Math.log(M.far+1)/Math.LN2)),(H.isMeshPhongMaterial||H.isMeshToonMaterial||H.isMeshLambertMaterial||H.isMeshBasicMaterial||H.isMeshStandardMaterial||H.isShaderMaterial)&&Ee.setValue(R,"isOrthographic",M.isOrthographicCamera===!0),q!==M&&(q=M,zi=!0,Ls=!0)}if(Mt.needsLights&&(ln.state.sunShadowMap.length>0&&Ee.setValue(R,"sunShadowMap",ln.state.sunShadowMap,Z),ln.state.directionalShadowMap.length>0&&Ee.setValue(R,"directionalShadowMap",ln.state.directionalShadowMap,Z),ln.state.spotShadowMap.length>0&&Ee.setValue(R,"spotShadowMap",ln.state.spotShadowMap,Z),ln.state.pointShadowMap.length>0&&Ee.setValue(R,"pointShadowMap",ln.state.pointShadowMap,Z)),G.isSkinnedMesh){Ee.setOptional(R,G,"bindMatrix"),Ee.setOptional(R,G,"bindMatrixInverse");let Re=G.skeleton;Re&&(Re.boneTexture===null&&Re.computeBoneTexture(),Ee.setValue(R,"boneTexture",Re.boneTexture,Z))}G.isBatchedMesh&&(Ee.setOptional(R,G,"batchingTexture"),Ee.setValue(R,"batchingTexture",G._matricesTexture,Z),Ee.setOptional(R,G,"batchingIdTexture"),Ee.setValue(R,"batchingIdTexture",G._indirectTexture,Z),Ee.setOptional(R,G,"batchingColorTexture"),G._colorsTexture!==null&&Ee.setValue(R,"batchingColorTexture",G._colorsTexture,Z));let Vi=X.morphAttributes;if((Vi.position!==void 0||Vi.normal!==void 0||Vi.color!==void 0)&&N.update(G,X,kn),(zi||Mt.receiveShadow!==G.receiveShadow)&&(Mt.receiveShadow=G.receiveShadow,Ee.setValue(R,"receiveShadow",G.receiveShadow)),(H.isMeshStandardMaterial||H.isMeshLambertMaterial||H.isMeshPhongMaterial)&&H.envMap===null&&D.environment!==null&&(ke.envMapIntensity.value=D.environmentIntensity),ke.dfgLUT!==void 0&&(ke.dfgLUT.value=Oy()),zi){if(Ee.setValue(R,"toneMappingExposure",P.toneMappingExposure),Mt.needsLights&&Up(ke,Ls),_t&&H.fog===!0&&Ut.refreshFogUniforms(ke,_t),Ut.refreshMaterialUniforms(ke,H,K,Y,T.state.transmissionRenderTarget[M.id]),Mt.needsLights&&Mt.lightProbeGrid){let Re=Mt.lightProbeGrid;ke.probesSH.value=Re.texture,ke.probesMin.value.copy(Re.boundingBox.min),ke.probesMax.value.copy(Re.boundingBox.max),ke.probesResolution.value.copy(Re.resolution)}wr.upload(R,Mu(Mt),ke,Z)}if(H.isShaderMaterial&&H.uniformsNeedUpdate===!0&&(wr.upload(R,Mu(Mt),ke,Z),H.uniformsNeedUpdate=!1),H.isSpriteMaterial&&Ee.setValue(R,"center",G.center),Ee.setValue(R,"modelViewMatrix",G.modelViewMatrix),Ee.setValue(R,"normalMatrix",G.normalMatrix),Ee.setValue(R,"modelMatrix",G.matrixWorld),H.uniformsGroups!==void 0){let Re=H.uniformsGroups;for(let Hi=0,Ds=Re.length;Hi<Ds;Hi++){let Tu=Re[Hi];nt.update(Tu,kn),nt.bind(Tu,kn)}}return kn}function Up(M,D){M.ambientLightColor.needsUpdate=D,M.lightProbe.needsUpdate=D,M.sunLights.needsUpdate=D,M.sunLightShadows.needsUpdate=D,M.directionalLights.needsUpdate=D,M.directionalLightShadows.needsUpdate=D,M.pointLights.needsUpdate=D,M.pointLightShadows.needsUpdate=D,M.spotLights.needsUpdate=D,M.spotLightShadows.needsUpdate=D,M.rectAreaLights.needsUpdate=D,M.hemisphereLights.needsUpdate=D}function Fp(M){return M.isMeshLambertMaterial||M.isMeshToonMaterial||M.isMeshPhongMaterial||M.isMeshStandardMaterial||M.isShadowMaterial||M.isShaderMaterial&&M.lights===!0}this.getActiveCubeFace=function(){return W},this.getActiveMipmapLevel=function(){return J},this.getRenderTarget=function(){return et},this.setRenderTargetTextures=function(M,D,X){let H=z.get(M);H.__autoAllocateDepthBuffer=M.resolveDepthBuffer===!1,H.__autoAllocateDepthBuffer===!1&&(H.__useRenderToTexture=!1),z.get(M.texture).__webglTexture=D,z.get(M.depthTexture).__webglTexture=H.__autoAllocateDepthBuffer?void 0:X,H.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(M,D){let X=z.get(M);X.__webglFramebuffer=D,X.__useDefaultFramebuffer=D===void 0},this.setRenderTarget=function(M,D=0,X=0){et=M,W=D,J=X;let H=null,G=!1,_t=!1;if(M){let gt=z.get(M);if(gt.__useDefaultFramebuffer!==void 0){x.bindFramebuffer(R.FRAMEBUFFER,gt.__webglFramebuffer),j.copy(M.viewport),yt.copy(M.scissor),Tt=M.scissorTest,x.viewport(j),x.scissor(yt),x.setScissorTest(Tt),U=-1;return}else if(gt.__webglFramebuffer===void 0)Z.setupRenderTarget(M);else if(gt.__hasExternalTextures)Z.rebindTextures(M,z.get(M.texture).__webglTexture,z.get(M.depthTexture).__webglTexture);else if(M.depthBuffer){let ce=M.depthTexture;if(gt.__boundDepthTexture!==ce){if(ce!==null&&z.has(ce)&&(M.width!==ce.image.width||M.height!==ce.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");Z.setupDepthRenderbuffer(M)}}let At=M.texture;(At.isData3DTexture||At.isDataArrayTexture||At.isCompressedArrayTexture)&&(_t=!0);let Ft=z.get(M).__webglFramebuffer;M.isWebGLCubeRenderTarget?(Array.isArray(Ft[D])?H=Ft[D][X]:H=Ft[D],G=!0):M.samples>0&&Z.useMultisampledRTT(M)===!1?H=z.get(M).__webglMultisampledFramebuffer:Array.isArray(Ft)?H=Ft[X]:H=Ft,j.copy(M.viewport),yt.copy(M.scissor),Tt=M.scissorTest}else j.copy(ot).multiplyScalar(K).floor(),yt.copy(ut).multiplyScalar(K).floor(),Tt=Yt;if(X!==0&&(H=V),x.bindFramebuffer(R.FRAMEBUFFER,H)&&x.drawBuffers(M,H),x.viewport(j),x.scissor(yt),x.setScissorTest(Tt),G){let gt=z.get(M.texture);R.framebufferTexture2D(R.FRAMEBUFFER,R.COLOR_ATTACHMENT0,R.TEXTURE_CUBE_MAP_POSITIVE_X+D,gt.__webglTexture,X)}else if(_t){let gt=D;for(let At=0;At<M.textures.length;At++){let Ft=z.get(M.textures[At]);R.framebufferTextureLayer(R.FRAMEBUFFER,R.COLOR_ATTACHMENT0+At,Ft.__webglTexture,X,gt)}}else if(M!==null&&X!==0){let gt=z.get(M.texture);R.framebufferTexture2D(R.FRAMEBUFFER,R.COLOR_ATTACHMENT0,R.TEXTURE_2D,gt.__webglTexture,X)}U=-1};function bu(M){let D=z.get(M);return(D.__readFormat!==M.format||D.__readType!==M.type)&&(D.__readFormat=M.format,D.__readType=M.type,D.__formatReadable=E.textureFormatReadable(M.format),D.__typeReadable=E.textureTypeReadable(M.type)),D}this.readRenderTargetPixels=function(M,D,X,H,G,_t,bt,gt=0){if(!(M&&M.isWebGLRenderTarget)){Jt("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let At=z.get(M).__webglFramebuffer;if(M.isWebGLCubeRenderTarget&&bt!==void 0&&(At=At[bt]),At){x.bindFramebuffer(R.FRAMEBUFFER,At);try{let Ft=M.textures[gt],ce=Ft.format,me=Ft.type;M.textures.length>1&&R.readBuffer(R.COLOR_ATTACHMENT0+gt);let Ct=bu(Ft);if(Ct.__formatReadable===!1){Jt("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(Ct.__typeReadable===!1){Jt("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}D>=0&&D<=M.width-H&&X>=0&&X<=M.height-G&&R.readPixels(D,X,H,G,lt.convert(ce),lt.convert(me),_t)}finally{let Ft=et!==null?z.get(et).__webglFramebuffer:null;x.bindFramebuffer(R.FRAMEBUFFER,Ft)}}},this.readRenderTargetPixelsAsync=async function(M,D,X,H,G,_t,bt,gt=0){if(!(M&&M.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let At=z.get(M).__webglFramebuffer;if(M.isWebGLCubeRenderTarget&&bt!==void 0&&(At=At[bt]),At)if(D>=0&&D<=M.width-H&&X>=0&&X<=M.height-G){x.bindFramebuffer(R.FRAMEBUFFER,At);let Ft=M.textures[gt],ce=Ft.format,me=Ft.type;M.textures.length>1&&R.readBuffer(R.COLOR_ATTACHMENT0+gt);let Ct=bu(Ft);if(Ct.__formatReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(Ct.__typeReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");let ve=R.createBuffer();R.bindBuffer(R.PIXEL_PACK_BUFFER,ve),R.bufferData(R.PIXEL_PACK_BUFFER,_t.byteLength,R.STREAM_READ),R.readPixels(D,X,H,G,lt.convert(ce),lt.convert(me),0),R.bindBuffer(R.PIXEL_PACK_BUFFER,null);let ze=et!==null?z.get(et).__webglFramebuffer:null;x.bindFramebuffer(R.FRAMEBUFFER,ze);let Ie=R.fenceSync(R.SYNC_GPU_COMMANDS_COMPLETE,0);return R.flush(),await Mf(R,Ie,4),R.bindBuffer(R.PIXEL_PACK_BUFFER,ve),R.getBufferSubData(R.PIXEL_PACK_BUFFER,0,_t),R.bindBuffer(R.PIXEL_PACK_BUFFER,null),R.deleteBuffer(ve),R.deleteSync(Ie),_t}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(M,D=null,X=0){let H=Math.pow(2,-X),G=Math.floor(M.image.width*H),_t=Math.floor(M.image.height*H),bt=D!==null?D.x:0,gt=D!==null?D.y:0;Z.setTexture2D(M,0),R.copyTexSubImage2D(R.TEXTURE_2D,X,0,0,bt,gt,G,_t),x.unbindTexture()},this.copyTextureToTexture=function(M,D,X=null,H=null,G=0,_t=0){let bt,gt,At,Ft,ce,me,Ct,ve,ze,Ie=M.isCompressedTexture?M.mipmaps[_t]:M.image;if(X!==null)bt=X.max.x-X.min.x,gt=X.max.y-X.min.y,At=X.isBox3?X.max.z-X.min.z:1,Ft=X.min.x,ce=X.min.y,me=X.isBox3?X.min.z:0;else{let ke=Math.pow(2,-G);bt=Math.floor(Ie.width*ke),gt=Math.floor(Ie.height*ke),M.isDataArrayTexture?At=Ie.depth:M.isData3DTexture?At=Math.floor(Ie.depth*ke):At=1,Ft=0,ce=0,me=0}H!==null?(Ct=H.x,ve=H.y,ze=H.z):(Ct=0,ve=0,ze=0);let we=lt.convert(D.format),en=lt.convert(D.type),Mt;D.isData3DTexture?(Z.setTexture3D(D,0),Mt=R.TEXTURE_3D):D.isDataArrayTexture||D.isCompressedArrayTexture?(Z.setTexture2DArray(D,0),Mt=R.TEXTURE_2D_ARRAY):(Z.setTexture2D(D,0),Mt=R.TEXTURE_2D),x.activeTexture(R.TEXTURE0),x.pixelStorei(R.UNPACK_FLIP_Y_WEBGL,D.flipY),x.pixelStorei(R.UNPACK_PREMULTIPLY_ALPHA_WEBGL,D.premultiplyAlpha),x.pixelStorei(R.UNPACK_ALIGNMENT,D.unpackAlignment);let ln=x.getParameter(R.UNPACK_ROW_LENGTH),_e=x.getParameter(R.UNPACK_IMAGE_HEIGHT),kn=x.getParameter(R.UNPACK_SKIP_PIXELS),ai=x.getParameter(R.UNPACK_SKIP_ROWS),zi=x.getParameter(R.UNPACK_SKIP_IMAGES);x.pixelStorei(R.UNPACK_ROW_LENGTH,Ie.width),x.pixelStorei(R.UNPACK_IMAGE_HEIGHT,Ie.height),x.pixelStorei(R.UNPACK_SKIP_PIXELS,Ft),x.pixelStorei(R.UNPACK_SKIP_ROWS,ce),x.pixelStorei(R.UNPACK_SKIP_IMAGES,me);let Ls=M.isDataArrayTexture||M.isData3DTexture,Ee=D.isDataArrayTexture||D.isData3DTexture;if(M.isDepthTexture){let ke=z.get(M),Vi=z.get(D),Re=z.get(ke.__renderTarget),Hi=z.get(Vi.__renderTarget);x.bindFramebuffer(R.READ_FRAMEBUFFER,Re.__webglFramebuffer),x.bindFramebuffer(R.DRAW_FRAMEBUFFER,Hi.__webglFramebuffer);for(let Ds=0;Ds<At;Ds++)Ls&&(R.framebufferTextureLayer(R.READ_FRAMEBUFFER,R.COLOR_ATTACHMENT0,z.get(M).__webglTexture,G,me+Ds),R.framebufferTextureLayer(R.DRAW_FRAMEBUFFER,R.COLOR_ATTACHMENT0,z.get(D).__webglTexture,_t,ze+Ds)),R.blitFramebuffer(Ft,ce,bt,gt,Ct,ve,bt,gt,R.DEPTH_BUFFER_BIT,R.NEAREST);x.bindFramebuffer(R.READ_FRAMEBUFFER,null),x.bindFramebuffer(R.DRAW_FRAMEBUFFER,null)}else if(G!==0||M.isRenderTargetTexture||z.has(M)){let ke=z.get(M),Vi=z.get(D);x.bindFramebuffer(R.READ_FRAMEBUFFER,I),x.bindFramebuffer(R.DRAW_FRAMEBUFFER,k);for(let Re=0;Re<At;Re++)Ls?R.framebufferTextureLayer(R.READ_FRAMEBUFFER,R.COLOR_ATTACHMENT0,ke.__webglTexture,G,me+Re):R.framebufferTexture2D(R.READ_FRAMEBUFFER,R.COLOR_ATTACHMENT0,R.TEXTURE_2D,ke.__webglTexture,G),Ee?R.framebufferTextureLayer(R.DRAW_FRAMEBUFFER,R.COLOR_ATTACHMENT0,Vi.__webglTexture,_t,ze+Re):R.framebufferTexture2D(R.DRAW_FRAMEBUFFER,R.COLOR_ATTACHMENT0,R.TEXTURE_2D,Vi.__webglTexture,_t),G!==0?R.blitFramebuffer(Ft,ce,bt,gt,Ct,ve,bt,gt,R.COLOR_BUFFER_BIT,R.NEAREST):Ee?R.copyTexSubImage3D(Mt,_t,Ct,ve,ze+Re,Ft,ce,bt,gt):R.copyTexSubImage2D(Mt,_t,Ct,ve,Ft,ce,bt,gt);x.bindFramebuffer(R.READ_FRAMEBUFFER,null),x.bindFramebuffer(R.DRAW_FRAMEBUFFER,null)}else Ee?M.isDataTexture||M.isData3DTexture?R.texSubImage3D(Mt,_t,Ct,ve,ze,bt,gt,At,we,en,Ie.data):D.isCompressedArrayTexture?R.compressedTexSubImage3D(Mt,_t,Ct,ve,ze,bt,gt,At,we,Ie.data):R.texSubImage3D(Mt,_t,Ct,ve,ze,bt,gt,At,we,en,Ie):M.isDataTexture?R.texSubImage2D(R.TEXTURE_2D,_t,Ct,ve,bt,gt,we,en,Ie.data):M.isCompressedTexture?R.compressedTexSubImage2D(R.TEXTURE_2D,_t,Ct,ve,Ie.width,Ie.height,we,Ie.data):R.texSubImage2D(R.TEXTURE_2D,_t,Ct,ve,bt,gt,we,en,Ie);x.pixelStorei(R.UNPACK_ROW_LENGTH,ln),x.pixelStorei(R.UNPACK_IMAGE_HEIGHT,_e),x.pixelStorei(R.UNPACK_SKIP_PIXELS,kn),x.pixelStorei(R.UNPACK_SKIP_ROWS,ai),x.pixelStorei(R.UNPACK_SKIP_IMAGES,zi),_t===0&&D.generateMipmaps&&R.generateMipmap(Mt),x.unbindTexture()},this.initRenderTarget=function(M){z.get(M).__webglFramebuffer===void 0&&Z.setupRenderTarget(M)},this.initTexture=function(M){M.isCubeTexture?Z.setTextureCube(M,0):M.isData3DTexture?Z.setTexture3D(M,0):M.isDataArrayTexture||M.isCompressedArrayTexture?Z.setTexture2DArray(M,0):Z.setTexture2D(M,0),x.unbindTexture()},this.resetState=function(){W=0,J=0,et=null,x.reset(),mt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return jn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;let e=this.getContext();e.drawingBufferColorSpace=ge._getDrawingBufferColorSpace(t),e.unpackColorSpace=ge._getUnpackColorSpace()}};var np={type:"change"},lu={type:"start"},sp={type:"end"},nc=new ws,ip=new Dn,By=Math.cos(70*Fh.DEG2RAD),Ze=new L,wn=2*Math.PI,Te={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},au=1e-6,ic=class extends po{constructor(t,e=null){super(t,e),this.state=Te.NONE,this.target=new L,this.cursor=new L,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.keyRotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:rs.ROTATE,MIDDLE:rs.DOLLY,RIGHT:rs.PAN},this.touches={ONE:os.ROTATE,TWO:os.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._cursorStyle="auto",this._domElementKeyEvents=null,this._lastPosition=new L,this._lastQuaternion=new Nn,this._lastTargetPosition=new L,this._quat=new Nn().setFromUnitVectors(t.up,new L(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new xr,this._sphericalDelta=new xr,this._scale=1,this._panOffset=new L,this._rotateStart=new Zt,this._rotateEnd=new Zt,this._rotateDelta=new Zt,this._panStart=new Zt,this._panEnd=new Zt,this._panDelta=new Zt,this._dollyStart=new Zt,this._dollyEnd=new Zt,this._dollyDelta=new Zt,this._dollyDirection=new L,this._mouse=new Zt,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=zy.bind(this),this._onPointerDown=ky.bind(this),this._onPointerUp=Vy.bind(this),this._onContextMenu=Zy.bind(this),this._onMouseWheel=Wy.bind(this),this._onKeyDown=Xy.bind(this),this._onTouchStart=qy.bind(this),this._onTouchMove=Yy.bind(this),this._onMouseDown=Hy.bind(this),this._onMouseMove=Gy.bind(this),this._interceptControlDown=Jy.bind(this),this._interceptControlUp=$y.bind(this),this.domElement!==null&&this.connect(this.domElement),this.update()}set cursorStyle(t){this._cursorStyle=t,t==="grab"?this.domElement.style.cursor="grab":this.domElement.style.cursor="auto"}get cursorStyle(){return this._cursorStyle}connect(t){super.connect(t),this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.state=Te.NONE,this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.ownerDocument.removeEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents();let t=this.domElement.getRootNode();t.removeEventListener("keydown",this._interceptControlDown,{capture:!0}),t.removeEventListener("keyup",this._interceptControlUp,{capture:!0}),this._controlActive=!1,this._pointers.length=0,this._pointerPositions={},this.domElement.style.touchAction="",this.domElement.style.cursor="auto"}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(t){t.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=t}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(np),this.update(),this.state=Te.NONE}pan(t,e){this._pan(t,e),this.update()}dollyIn(t){this._dollyIn(t),this.update()}dollyOut(t){this._dollyOut(t),this.update()}rotateLeft(t){this._rotateLeft(t),this.update()}rotateUp(t){this._rotateUp(t),this.update()}update(t=null){let e=this.object.position;Ze.copy(e).sub(this.target),Ze.applyQuaternion(this._quat),this._spherical.setFromVector3(Ze),this.autoRotate&&this.state===Te.NONE&&this._rotateLeft(this._getAutoRotationAngle(t)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let i=this.minAzimuthAngle,s=this.maxAzimuthAngle;isFinite(i)&&isFinite(s)&&(i<-Math.PI?i+=wn:i>Math.PI&&(i-=wn),s<-Math.PI?s+=wn:s>Math.PI&&(s-=wn),i<=s?this._spherical.theta=Math.max(i,Math.min(s,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(i+s)/2?Math.max(i,this._spherical.theta):Math.min(s,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let r=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{let o=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),r=o!=this._spherical.radius}if(Ze.setFromSpherical(this._spherical),Ze.applyQuaternion(this._quatInverse),e.copy(this.target).add(Ze),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let o=null;if(this.object.isPerspectiveCamera){let a=Ze.length();o=this._clampDistance(a*this._scale);let l=a-o;this.object.position.addScaledVector(this._dollyDirection,l),this.object.updateMatrixWorld(),r=!!l}else if(this.object.isOrthographicCamera){let a=new L(this._mouse.x,this._mouse.y,0);a.unproject(this.object);let l=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),r=l!==this.object.zoom;let c=new L(this._mouse.x,this._mouse.y,0);c.unproject(this.object),this.object.position.sub(c).add(a),this.object.updateMatrixWorld(),o=Ze.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;o!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(o).add(this.object.position):(nc.origin.copy(this.object.position),nc.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(nc.direction))<By?this.object.lookAt(this.target):(ip.setFromNormalAndCoplanarPoint(this.object.up,this.target),nc.intersectPlane(ip,this.target))))}else if(this.object.isOrthographicCamera){let o=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),o!==this.object.zoom&&(this.object.updateProjectionMatrix(),r=!0)}return this._scale=1,this._performCursorZoom=!1,r||this._lastPosition.distanceToSquared(this.object.position)>au||8*(1-this._lastQuaternion.dot(this.object.quaternion))>au||this._lastTargetPosition.distanceToSquared(this.target)>au?(this.dispatchEvent(np),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(t){return t!==null?wn/60*this.autoRotateSpeed*t:wn/60/60*this.autoRotateSpeed}_getZoomScale(t){let e=Math.abs(t*.01);return Math.pow(.95,this.zoomSpeed*e)}_rotateLeft(t){this._sphericalDelta.theta-=t}_rotateUp(t){this._sphericalDelta.phi-=t}_panLeft(t,e){Ze.setFromMatrixColumn(e,0),Ze.multiplyScalar(-t),this._panOffset.add(Ze)}_panUp(t,e){this.screenSpacePanning===!0?Ze.setFromMatrixColumn(e,1):(Ze.setFromMatrixColumn(e,0),Ze.crossVectors(this.object.up,Ze)),Ze.multiplyScalar(t),this._panOffset.add(Ze)}_pan(t,e){let i=this.domElement;if(this.object.isPerspectiveCamera){let s=this.object.position;Ze.copy(s).sub(this.target);let r=Ze.length();r*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*t*r/i.clientHeight,this.object.matrix),this._panUp(2*e*r/i.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(t*(this.object.right-this.object.left)/this.object.zoom/i.clientWidth,this.object.matrix),this._panUp(e*(this.object.top-this.object.bottom)/this.object.zoom/i.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(t){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=t:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(t){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=t:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(t,e){if(!this.zoomToCursor)return;this._performCursorZoom=!0;let i=this.domElement.getBoundingClientRect(),s=t-i.left,r=e-i.top,o=i.width,a=i.height;this._mouse.x=s/o*2-1,this._mouse.y=-(r/a)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(t){return Math.max(this.minDistance,Math.min(this.maxDistance,t))}_handleMouseDownRotate(t){this._rotateStart.set(t.clientX,t.clientY)}_handleMouseDownDolly(t){this._updateZoomParameters(t.clientX,t.clientX),this._dollyStart.set(t.clientX,t.clientY)}_handleMouseDownPan(t){this._panStart.set(t.clientX,t.clientY)}_handleMouseMoveRotate(t){this._rotateEnd.set(t.clientX,t.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);let e=this.domElement;this._rotateLeft(wn*this._rotateDelta.x/e.clientHeight),this._rotateUp(wn*this._rotateDelta.y/e.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(t){this._dollyEnd.set(t.clientX,t.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(t){this._panEnd.set(t.clientX,t.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(t){this._updateZoomParameters(t.clientX,t.clientY),t.deltaY<0?this._dollyIn(this._getZoomScale(t.deltaY)):t.deltaY>0&&this._dollyOut(this._getZoomScale(t.deltaY)),this.update()}_handleKeyDown(t){let e=!1;switch(t.code){case this.keys.UP:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateUp(wn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,this.keyPanSpeed),e=!0;break;case this.keys.BOTTOM:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateUp(-wn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,-this.keyPanSpeed),e=!0;break;case this.keys.LEFT:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateLeft(wn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(this.keyPanSpeed,0),e=!0;break;case this.keys.RIGHT:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateLeft(-wn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(-this.keyPanSpeed,0),e=!0;break}e&&(t.preventDefault(),this.update())}_handleTouchStartRotate(t){if(this._pointers.length===1)this._rotateStart.set(t.pageX,t.pageY);else{let e=this._getSecondPointerPosition(t),i=.5*(t.pageX+e.x),s=.5*(t.pageY+e.y);this._rotateStart.set(i,s)}}_handleTouchStartPan(t){if(this._pointers.length===1)this._panStart.set(t.pageX,t.pageY);else{let e=this._getSecondPointerPosition(t),i=.5*(t.pageX+e.x),s=.5*(t.pageY+e.y);this._panStart.set(i,s)}}_handleTouchStartDolly(t){let e=this._getSecondPointerPosition(t),i=t.pageX-e.x,s=t.pageY-e.y,r=Math.sqrt(i*i+s*s);this._dollyStart.set(0,r)}_handleTouchStartDollyPan(t){this.enableZoom&&this._handleTouchStartDolly(t),this.enablePan&&this._handleTouchStartPan(t)}_handleTouchStartDollyRotate(t){this.enableZoom&&this._handleTouchStartDolly(t),this.enableRotate&&this._handleTouchStartRotate(t)}_handleTouchMoveRotate(t){if(this._pointers.length==1)this._rotateEnd.set(t.pageX,t.pageY);else{let i=this._getSecondPointerPosition(t),s=.5*(t.pageX+i.x),r=.5*(t.pageY+i.y);this._rotateEnd.set(s,r)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);let e=this.domElement;this._rotateLeft(wn*this._rotateDelta.x/e.clientHeight),this._rotateUp(wn*this._rotateDelta.y/e.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(t){if(this._pointers.length===1)this._panEnd.set(t.pageX,t.pageY);else{let e=this._getSecondPointerPosition(t),i=.5*(t.pageX+e.x),s=.5*(t.pageY+e.y);this._panEnd.set(i,s)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(t){let e=this._getSecondPointerPosition(t),i=t.pageX-e.x,s=t.pageY-e.y,r=Math.sqrt(i*i+s*s);this._dollyEnd.set(0,r),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);let o=(t.pageX+e.x)*.5,a=(t.pageY+e.y)*.5;this._updateZoomParameters(o,a)}_handleTouchMoveDollyPan(t){this.enableZoom&&this._handleTouchMoveDolly(t),this.enablePan&&this._handleTouchMovePan(t)}_handleTouchMoveDollyRotate(t){this.enableZoom&&this._handleTouchMoveDolly(t),this.enableRotate&&this._handleTouchMoveRotate(t)}_addPointer(t){this._pointers.push(t.pointerId)}_removePointer(t){delete this._pointerPositions[t.pointerId];for(let e=0;e<this._pointers.length;e++)if(this._pointers[e]==t.pointerId){this._pointers.splice(e,1);return}}_isTrackingPointer(t){for(let e=0;e<this._pointers.length;e++)if(this._pointers[e]==t.pointerId)return!0;return!1}_trackPointer(t){let e=this._pointerPositions[t.pointerId];e===void 0&&(e=new Zt,this._pointerPositions[t.pointerId]=e),e.set(t.pageX,t.pageY)}_getSecondPointerPosition(t){let e=t.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[e]}_customWheelEvent(t){let e=t.deltaMode,i={clientX:t.clientX,clientY:t.clientY,deltaY:t.deltaY};switch(e){case 1:i.deltaY*=16;break;case 2:i.deltaY*=100;break}return t.ctrlKey&&!this._controlActive&&(i.deltaY*=10),i}};function ky(n){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(n.pointerId),this.domElement.ownerDocument.addEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(n)&&(this._addPointer(n),n.pointerType==="touch"?this._onTouchStart(n):this._onMouseDown(n),this._cursorStyle==="grab"&&(this.domElement.style.cursor="grabbing")))}function zy(n){this.enabled!==!1&&(n.pointerType==="touch"?this._onTouchMove(n):this._onMouseMove(n))}function Vy(n){switch(this._removePointer(n),this._pointers.length){case 0:this.domElement.releasePointerCapture(n.pointerId),this.domElement.ownerDocument.removeEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(sp),this.state=Te.NONE,this._cursorStyle==="grab"&&(this.domElement.style.cursor="grab");break;case 1:let t=this._pointers[0],e=this._pointerPositions[t];this._onTouchStart({pointerId:t,pageX:e.x,pageY:e.y});break}}function Hy(n){let t;switch(n.button){case 0:t=this.mouseButtons.LEFT;break;case 1:t=this.mouseButtons.MIDDLE;break;case 2:t=this.mouseButtons.RIGHT;break;default:t=-1}switch(t){case rs.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(n),this.state=Te.DOLLY;break;case rs.ROTATE:if(n.ctrlKey||n.metaKey||n.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(n),this.state=Te.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(n),this.state=Te.ROTATE}break;case rs.PAN:if(n.ctrlKey||n.metaKey||n.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(n),this.state=Te.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(n),this.state=Te.PAN}break;default:this.state=Te.NONE}this.state!==Te.NONE&&this.dispatchEvent(lu)}function Gy(n){switch(this.state){case Te.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(n);break;case Te.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(n);break;case Te.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(n);break}}function Wy(n){this.enabled===!1||this.enableZoom===!1||this.state!==Te.NONE||(n.preventDefault(),this.dispatchEvent(lu),this._handleMouseWheel(this._customWheelEvent(n)),this.dispatchEvent(sp))}function Xy(n){this.enabled!==!1&&this._handleKeyDown(n)}function qy(n){switch(this._trackPointer(n),this._pointers.length){case 1:switch(this.touches.ONE){case os.ROTATE:if(this.enableRotate===!1)return;this._handleTouchStartRotate(n),this.state=Te.TOUCH_ROTATE;break;case os.PAN:if(this.enablePan===!1)return;this._handleTouchStartPan(n),this.state=Te.TOUCH_PAN;break;default:this.state=Te.NONE}break;case 2:switch(this.touches.TWO){case os.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(n),this.state=Te.TOUCH_DOLLY_PAN;break;case os.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(n),this.state=Te.TOUCH_DOLLY_ROTATE;break;default:this.state=Te.NONE}break;default:this.state=Te.NONE}this.state!==Te.NONE&&this.dispatchEvent(lu)}function Yy(n){switch(this._trackPointer(n),this.state){case Te.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(n),this.update();break;case Te.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(n),this.update();break;case Te.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(n),this.update();break;case Te.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(n),this.update();break;default:this.state=Te.NONE}}function Zy(n){this.enabled!==!1&&n.preventDefault()}function Jy(n){n.key==="Control"&&(this._controlActive=!0,this.domElement.getRootNode().addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function $y(n){n.key==="Control"&&(this._controlActive=!1,this.domElement.getRootNode().removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}var cu=n=>["space-points","ellipsoid","line-plane","point-projection"].includes(n);function rp(n){let t=n,e=t.kind,i=14806692,s=12900275,r=document.createElement("div");r.className="scene-live-label",t.host.append(r);let o=(a,l=.055)=>{let c=t.mesh(new mn(l,14,10),i,1);return c.position.set(...a),c};if(e==="space-points"){let a=[-1.5,-.9,-.8],l=[1.5,1.05,.9];o(a),o(l),t.line([a,l],i,1),t.line([a,[l[0],a[1],a[2]],[l[0],l[1],a[2]],l],s,.5,!0);let c=o(a,.09);for(let u=0;u<3;u++){let d=[...a];d[u]+=3.3,t.line([a,d],s,.2)}t.updates.push(u=>{let d=.5+.43*Math.sin(u*.38);c.position.set(...a.map((h,f)=>(1-d)*h+d*l[f])),r.textContent="AP : PB = "+d.toFixed(2)+" : "+(1-d).toFixed(2)})}else if(e==="ellipsoid"){let u=t.mesh(new mn(1,56,36),7445365,.28);u.scale.set(2,1.6,1.6);let d=new _i(new Oi(new mn(1,24,16)),new Tn({color:s,transparent:!0,opacity:.15}));d.scale.copy(u.scale),t.group.add(d),o([-1.2,0,0]),o([1.2,0,0]);let h=o([2,0,0],.075),f=t.line([[-1.2,0,0],[2,0,0]],i,.9),p=t.line([[1.2,0,0],[2,0,0]],i,.9),_=t.line([[0,0,0],[0,0,0]],s,.7);t.updates.push(m=>{let g=m*.25+.5,S=m*.15+.5,A=[2*Math.cos(g),1.6*Math.sin(g)*Math.cos(S),1.6*Math.sin(g)*Math.sin(S)];h.position.set(...A),t.updateLine(f,[[-1.2,0,0],A]),t.updateLine(p,[[1.2,0,0],A]);let v=[];for(let b=0;b<=128;b++){let T=b/128*2*Math.PI;v.push([2*Math.cos(T),1.6*Math.sin(T)*Math.cos(S),1.6*Math.sin(T)*Math.sin(S)])}t.updateLine(_,v),r.textContent="\uB450 \uCD08\uC810\uC744 \uD3EC\uD568\uD558\uB294 \uB2E8\uBA74 \xB7 PF\u2081 + PF\u2082 = 4"})}else if(e==="line-plane"){let a=t.mesh(new pn(4.2,3.1),9414526,.23);a.rotation.x=-Math.PI/2;let l=t.line([[-2,1,0],[2,-1,0]],i,1),c=o([0,1,0]);t.group.add(new ss(new L(0,1,0),new L(0,0,0),1.5,s,.18,.08)),t.updates.push(u=>{let d=Math.floor(u/5)%3,h=d===2?0:1,f=d===0?-.7:0,p=[-2,h-2*f,-.5],_=[2,h+2*f,.5];t.updateLine(l,[p,_]),c.position.set(0,h,0),r.textContent=["\uAD50\uCC28 \xB7 v\xB7n \u2260 0","\uD3C9\uD589 \xB7 v\xB7n = 0, P\uB294 \uD3C9\uBA74 \uBC16","\uD3EC\uD568 \xB7 v\xB7n = 0, P\uB294 \uD3C9\uBA74 \uC704"][d]})}else if(e==="point-projection"){let a=t.mesh(new pn(4.2,3.1),9414526,.23);a.rotation.x=-Math.PI/2;let l=[-.8,.9,.3],c=[.8,-.9,.3],u=o(l),d=o(c),h=o([0,0,0],.08),f=o([0,0,0],.08),p=[t.line([l,l],s,.6,!0),t.line([c,c],s,.6,!0)];t.line([l,c],s,.3),t.updates.push(_=>{let m=-Math.atan2(1.6,1.8)+.65*Math.sin(_*.25),g=new L(Math.sin(m),Math.cos(m),0);a.quaternion.setFromUnitVectors(new L(0,0,1),g),[l,c].forEach((S,A)=>{let v=new L(...S),b=v.clone().addScaledVector(g,-v.dot(g));(A?f:h).position.copy(b),t.updateLine(p[A],[S,b.toArray()])}),r.textContent="\uCC28\uBCA1\uD130\uAC00 \uAD00\uCC30 \uBC29\uD5A5\uACFC \uD3C9\uD589\uD558\uBA74 \uC815\uC0AC\uC601\uC774 \uACB9\uCE69\uB2C8\uB2E4"})}}function op(n){let e={riemann:'<path d="M65 215 H295 M75 215 V70"/><path d="M80 215V206H120V179H160V134H200V71H240V215" opacity=".4"/><path d="M80 215 Q160 215 240 71" stroke-width="2"/>',"signed-area":'<path d="M60 138H300 M180 38V230" opacity=".3"/><path d="M80 205L280 71"/><path d="M80 205V138H180Z M180 138H280V71Z" fill="currentColor" fill-opacity=".13"/>',parabola:'<path d="M65 55 Q180 320 295 55"/><path d="M65 222H295" opacity=".5"/><circle cx="180" cy="141" r="4" fill="currentColor"/><path d="M180 141L255 156V222" stroke-dasharray="4 4"/>',rolle:'<path d="M55 80H305 M75 133H285 M100 185H260" opacity=".3"/>'+[55,115,180,235,305].map(i=>'<circle cx="'+i+'" cy="80" r="4"/>').join("")+[85,145,210,275].map(i=>'<circle cx="'+i+'" cy="133" r="4"/>').join("")+[115,180,245].map(i=>'<circle cx="'+i+'" cy="185" r="4"/>').join(""),ellipsoid:'<ellipse cx="180" cy="135" rx="123" ry="78"/><ellipse cx="180" cy="135" rx="123" ry="30" opacity=".5"/><ellipse cx="180" cy="135" rx="45" ry="78" opacity=".3"/><path d="M105 135L205 60L255 135"/><circle cx="105" cy="135" r="3"/><circle cx="255" cy="135" r="3"/>',rotation:'<path d="M55 176H305 M180 50V231" opacity=".3"/><path d="M75 230L285 57 M98 54L274 235" stroke-dasharray="4 4" opacity=".55"/><path d="M80 68Q180 300 280 68" stroke-width="2"/>',compound:'<path d="M60 218H305 M70 218V43" opacity=".3"/><path d="M90 65Q120 179 292 198" stroke-width="2"/><path d="M90 55Q120 173 292 195" stroke-dasharray="5 5" opacity=".6"/>',"tangent-conic":'<ellipse cx="180" cy="135" rx="104" ry="67"/><path d="M284 40V232"/><circle cx="284" cy="135" r="4" fill="currentColor"/>',restore:'<path d="M70 195C150 20 200 247 292 62 M70 218C150 43 200 270 292 85 M70 172C150 -3 200 224 292 39" opacity=".7"/>',"restore-quadratic":'<path d="M65 65Q180 280 295 65 M65 100Q180 315 295 100 M65 30Q180 245 295 30" opacity=".7"/>',model:'<path d="M65 215H300 M80 215V48" opacity=".3"/><path d="M85 210L285 60 M85 210Q250 195 285 60 M85 210C175 210 175 60 285 60" opacity=".7"/>',curvature:'<path d="M70 222C150 222 206 50 290 50" stroke-width="2"/><path d="M100 228L260 45" stroke-dasharray="5 5" opacity=".5"/><circle cx="180" cy="137" r="5"/>',ratio:'<path d="M62 200C128 -40 205 300 298 60"/><path d="M114 222H245 M114 215V229 M180 215V229 M245 215V229" opacity=".5"/><circle cx="114" cy="105" r="4"/><circle cx="180" cy="135" r="4"/><circle cx="245" cy="165" r="4"/>',chain:'<path d="M58 55Q133 300 208 55"/><path d="M165 220C220 220 240 55 299 55"/><circle cx="133" cy="178" r="4"/><circle cx="233" cy="135" r="4"/>',"tangent-count":'<path d="M63 213C123 -15 213 285 300 52"/><path d="M55 180L300 80 M68 230L285 36 M60 108L300 158" opacity=".5"/><circle cx="207" cy="118" r="5" fill="currentColor"/>',"mean-value":'<path d="M70 195Q180 225 285 63"/><path d="M70 195L285 63 M95 230L280 116" opacity=".6"/>',"space-points":'<path d="M78 196L180 155L280 72 M78 196H280V72 M180 155V44 M180 155L285 222" opacity=".65"/><circle cx="78" cy="196" r="5"/><circle cx="280" cy="72" r="5"/><circle cx="180" cy="155" r="5" fill="currentColor"/>',"line-plane":'<path d="M55 175L214 113L305 164L145 225Z" opacity=".4"/><path d="M91 70L268 208 M180 166V45"/><circle cx="180" cy="141" r="5"/>',"point-projection":'<path d="M60 191L214 132L302 181L146 240Z" opacity=".4"/><path d="M110 70L170 186 M205 55L215 167" stroke-dasharray="4 4"/><circle cx="110" cy="70" r="5"/><circle cx="205" cy="55" r="5"/><circle cx="170" cy="186" r="3"/><circle cx="215" cy="167" r="3"/>'}[n];return e?'<svg viewBox="0 0 360 270" aria-hidden="true" focusable="false"><g fill="none" stroke="currentColor" stroke-width="1.4">'+e+"</g></svg>":null}function ap({kind:n,t,phase:e,c:i,path:s,dot:r,green:o,pale:a}){if(!["riemann","signed-area","parabola","rolle","restore","restore-quadratic","ratio","mean-value","chain","model","compound","tangent-conic","tangent-count","rotation","curvature"].includes(n))return!1;let c=(h,f=-200,p=122)=>{i.font="12px sans-serif",i.fillStyle=a,i.fillText(h,f,p)},u=(h,f=-2,p=2,_=85,m=35,g=o,S=2)=>{let A=[];for(let v=f;v<=p+1e-4;v+=(p-f)/150)A.push([v*_,35-h(v)*m]);s(A,g,S)},d=(h,f=a)=>{i.setLineDash([5,5]),s(h,f,1),i.setLineDash([])};if(n==="riemann"){let h=4+Math.floor(18*(.5+.5*Math.sin(t*.28))),f=300/h,p=35,_=-150;for(let g=0;g<h;g++){let S=(g/h)**2*185,A=((g+1)/h)**2*185;i.fillStyle=o+"15",i.fillRect(_+g*f,p-A,f,A),i.strokeStyle=a+"55",i.strokeRect(_+g*f,p-A,f,A),i.strokeStyle=o,i.strokeRect(_+g*f,p-S,f,S)}let m=[];for(let g=0;g<=120;g++){let S=g/120;m.push([_+300*S,p-185*S*S])}s(m),s([[_,p],[150,p]],a,1),c("n = "+h+"   L = "+((h-1)*(2*h-1)/(6*h*h)).toFixed(4)+"   R = "+((h+1)*(2*h+1)/(6*h*h)).toFixed(4),-190,104),c("f(x)=x\xB2 \xB7 [0,1] \xB7 \u222Bf = 1/3",-190,128)}else if(n==="signed-area"){let h=-2+4*(.5+.5*Math.sin(t*.25));for(let f=-2;f<h;f+=.025){let p=f*55;i.fillStyle=f<0?a+"2b":o+"44",i.fillRect(f*85,Math.min(35,35-p),2.5,Math.abs(p))}u(f=>f,-2,2,85,55),r(h*85,35-h*55,5),c("\u222B f = "+((h*h-4)/2).toFixed(2)+"   \u222B |f| = "+(h<0?(4-h*h)/2:2+h*h/2).toFixed(2)),c("f(x)=x \xB7 \uC2DC\uC791\uC810 \u22122",-200,144)}else if(n==="parabola"){let h=.6+.55*(.5+.5*Math.sin(t*.3)),f=1.5*Math.sin(t*.3+.7),p=f*f/(4*h),_=62,m=[0,35-h*_],g=[f*_,35-p*_],S=[f*_,35+h*_];u(A=>A*A/(4*h),-2.4,2.4,_,_),d([[-200,35+h*_],[200,35+h*_]]),s([m,g,S],a,1.2),r(...m,5),r(...g,5),c("F",m[0]+10,m[1]),c("d(P,F) = d(P,\uC900\uC120)",-200,-145)}else if(n==="rolle"){let h=[-2,-1,0,1,2],f=[-Math.sqrt((15+Math.sqrt(145))/10),-Math.sqrt((15-Math.sqrt(145))/10),Math.sqrt((15-Math.sqrt(145))/10),Math.sqrt((15+Math.sqrt(145))/10)];u(_=>_**5-5*_**3+4*_,-2.12,2.12,85,15),h.forEach(_=>r(_*85,35,4));let p=.45+.4*Math.sin(t*.3);for(let _=0;_<4;_++)s([[h[_]*85,77],[h[_+1]*85,77]],a+"60",1),r(f[_]*85,95,5,o+Math.round(p*255).toString(16).padStart(2,"0"));c("f\uC758 \uADFC 5\uAC1C \u2192 f\u2032\uC758 \uADFC 4\uAC1C",-185,132)}else if(n==="restore"||n==="restore-quadratic"){let h=n==="restore"?p=>p**3/3-p:p=>p*p;[-1.2,0,1.2].forEach((p,_)=>u(m=>h(m)+p,-1.8,1.8,86,32,_===1?o:a+"55",_===1?2:1));let f=.9*Math.sin(t*.3);u(p=>h(p)+f,-1.8,1.8,86,32,o+"b0",2),r(86,35-(h(1)+f)*32,5),c(n==="restore"?"\uAC19\uC740 \uB3C4\uD568\uC218 x\xB2\u22121, \uB2EC\uB77C\uC9C0\uB294 \uC801\uBD84\uC0C1\uC218 C":"\uAC19\uC740 \uB3C4\uD568\uC218 2x, \uB2EC\uB77C\uC9C0\uB294 \uC801\uBD84\uC0C1\uC218 C",-205,132)}else if(n==="ratio")u(h=>h**3-3*h,-1.85,1.85,85,28),[[-1,2],[0,0],[1,-2]].forEach(h=>r(h[0]*85,35-h[1]*28,5)),s([[-85,105],[0,105],[85,105]],a,1),[-85,0,85].forEach(h=>s([[h,100],[h,110]],a,1)),c("1",-46,126),c("1",39,126),c("\uBCC0\uACE1\uC810\uC744 \uAE30\uC900\uC73C\uB85C \uB098\uB208 \uC218\uD3C9 \uAC70\uB9AC",-180,-138);else if(n==="mean-value"){u(f=>f*f,-1.5,2.1,80,35),s([[-80,0],[160,-105]],a,1.5);let h=.5+.8*Math.sin(t*.27);s([[-120,35-(h*h+2*h*(-1.5-h))*35],[172,35-(h*h+2*h*(2.15-h))*35]],o,1.3),r(h*80,35-h*h*35,5),c("\uD3C9\uADE0 \uAE30\uC6B8\uAE30 1 = f\u2032(1/2)",-185,130),c("f(x)=x\xB2, \uAD6C\uAC04 [\u22121,2]",-185,151)}else if(n==="chain"){let h=Math.floor(t/6)%3,f=[p=>p*p,p=>p**3,p=>p**4][h];u(f,-1.5,1.5,90,32),r(0,35,5),c(["x\xB2 \xB7 \uB3C4\uD568\uC218 \uBD80\uD638 \u2212 \u2192 + \xB7 \uADF9\uC18C","x\xB3 \xB7 \uB3C4\uD568\uC218 \uBD80\uD638 + \u2192 + \xB7 \uADF9\uAC12 \uC544\uB2D8","x\u2074 \xB7 \uB450 \uC870\uAC74\uC774 \uACB9\uCCD0\uB3C4 \uBD80\uD638 \uD655\uC778"][h],-205,130),c("h\u2032(0)=0 \uB2E4\uC74C\uC5D0, \uC591\uCABD \uBD80\uD638\uB97C \uC77D\uC2B5\uB2C8\uB2E4.",-205,-140)}else if(n==="model")u(h=>1+.3*h,-2,2,80,55,a,1.4),u(h=>Math.exp(.5*h),-2,2,80,55,o,1.7),u(h=>2/(1+Math.exp(-h)),-2,2,80,55,a,1.4),c("\uC77C\uCC28 \xB7 \uC9C0\uC218 \xB7 \uB85C\uC9C0\uC2A4\uD2F1 \uD6C4\uBCF4 \uD568\uC218",-200,120),c("\uC804\uC2DC\uC6A9 \uD568\uC218 \uB3C4\uD574 \xB7 \uD559\uC0DD \uC2E4\uCE21 \uC790\uB8CC \uC544\uB2D8",-200,144);else if(n==="compound"){let h=S=>-180+(S-1)/14*360,f=S=>35-S*2.6,p=S=>Math.log(2)/Math.log(1+S/100),_=[],m=[];for(let S=1.5;S<=15;S+=.07)_.push([h(S),f(p(S))]),m.push([h(S),f(72/S)]);s(_),d(m);let g=3+9*(.5+.5*Math.sin(t*.24));r(h(g),f(p(g)),5),c("r="+g.toFixed(1)+"%  \uC815\uD655\uAC12 "+p(g).toFixed(2)+"\uB144  72/r "+(72/g).toFixed(2)+"\uB144",-205,118),c("\uC5F0 1\uD68C \uBCF5\uB9AC \xB7 \uC77C\uC815\uD55C \uC774\uC728\uC758 \uC218\uD559 \uBAA8\uD615",-205,142)}else if(n==="tangent-conic"){let p=t*.23,_=[];for(let S=0;S<=160;S++){let A=S/160*Math.PI*2;_.push([2*Math.cos(A)*80,35-1*Math.sin(A)*80])}s(_);let m=[2*Math.cos(p),1*Math.sin(p)],g=[-2*Math.sin(p),1*Math.cos(p)];s([[80*(m[0]-2*g[0]),35-80*(m[1]-2*g[1])],[80*(m[0]+2*g[0]),35-80*(m[1]+2*g[1])]],a,1.2),r(m[0]*80,35-m[1]*80,5),c("\uC218\uC9C1\uC778 \uACBD\uC6B0\uC5D0\uB3C4 \uC811\uC810\uACFC \uC911\uADFC\uC740 \uB0A8\uC2B5\uB2C8\uB2E4.",-205,145)}else if(n==="tangent-count"){let h=[-.12,0,.3,1,1.12][Math.floor(t/5)%5],f=m=>2*m**3-3*m*m+h,p=[],_=m=>{p.some(g=>Math.abs(g-m)<1e-5)||p.push(m)};for(let m of[0,1])Math.abs(f(m))<1e-8&&_(m);for(let[m,g]of[[-3,0],[0,1],[1,3]]){let S=m,A=g;if(!(f(S)*f(A)>=0)){for(let v=0;v<45;v++){let b=(S+A)/2;f(S)*f(b)<=0?A=b:S=b}_((S+A)/2)}}u(m=>m**3,-1.3,1.75,85,28),p.forEach(m=>{s([[-110,35-(3*m*m*(-110/85)-2*m**3)*28],[180,35-(3*m*m*(180/85)-2*m**3)*28]],a+"8f",1),r(m*85,35-m**3*28,4)}),r(85,35-h*28,6),c("P(1, "+h+") \xB7 \uC11C\uB85C \uB2E4\uB978 \uC811\uC120 "+p.length+"\uAC1C",-205,136)}else if(n==="rotation"){u(_=>_*_,-1.55,1.55,60,60);let h=.7*Math.sin(t*.22),f=Math.cos(h),p=Math.sin(h);s([[-200*f,35+200*p],[200*f,35-200*p]],o,1.2),s([[200*p,35+200*f],[-200*p,35-200*f]],a,1.2),r(60,-25,5),c("\uC810\uC740 \uADF8\uB300\uB85C \xB7 \uC88C\uD45C\uCD95\uC774 \uD68C\uC804\uD569\uB2C8\uB2E4.",-205,130),c("XY\uD56D\uC758 \uACC4\uC218 = \u2212a sin(2\u03B8)",-205,151)}else if(n==="curvature"){u(p=>p**3,-1.8,1.8,85,26);let h=1.4*Math.sin(t*.3),f=3*h*h;s([[-180,35-(h**3+f*(-180/85-h))*26],[180,35-(h**3+f*(180/85-h))*26]],a,1.1),r(h*85,35-h**3*26,5),c("f(x)=x\xB3 \xB7 f\u2032\u2032(x)=6x \xB7 "+(h<0?"\uAE30\uC6B8\uAE30\uAC00 \uC791\uC544\uC9D1\uB2C8\uB2E4":"\uAE30\uC6B8\uAE30\uAC00 \uCEE4\uC9D1\uB2C8\uB2E4"),-205,136)}return!0}var On=14806692,si=14082502,lp=6391659,cp=n=>cu(n)||["hero","sphere-slice","sphere-vector","distance","slices","hypersphere","projection","vectors","planes","cone","surface"].includes(n);function Co(n,t=0){let e=op(n);if(e)return e;let i=(a,l="")=>'<path d="'+a+'" fill="none" stroke="currentColor" stroke-width="1.3" '+l+"/>",s=(a,l,c,u,d="")=>'<line x1="'+a+'" y1="'+l+'" x2="'+c+'" y2="'+u+'" stroke="currentColor" stroke-width="1.1" '+d+"/>",r=(a,l,c,u="")=>'<circle cx="'+a+'" cy="'+l+'" r="'+c+'" fill="none" stroke="currentColor" stroke-width="1.1" '+u+"/>",o="";if(["sphere-slice","sphere-vector","slices","hypersphere","hero"].includes(n)){if(o+=r(180,136,83),o+='<ellipse cx="180" cy="136" rx="33" ry="83" fill="none" stroke="currentColor" opacity=".4"/>',o+='<ellipse cx="180" cy="136" rx="83" ry="27" fill="none" stroke="currentColor" opacity=".5"/>',o+='<ellipse cx="180" cy="113" rx="79" ry="24" fill="currentColor" opacity=".12"/>',o+='<ellipse cx="180" cy="113" rx="79" ry="24" fill="none" stroke="currentColor" stroke-width="2"/>',o+=s(180,136,180,113,'stroke-dasharray="3 4"'),o+=s(180,136,250,123),o+=r(180,136,3,'fill="currentColor"'),n==="slices")for(let a=80;a<205;a+=17){let l=Math.sqrt(Math.max(0,6889-(a-136)**2));o+='<ellipse cx="180" cy="'+a+'" rx="'+l+'" ry="'+l*.25+'" fill="none" stroke="currentColor" opacity=".45"/>'}n==="sphere-vector"&&(o+=s(110,190,237,76,'stroke-width="2"'))}else if(["distance","planes","projection"].includes(n))o+=i("M 63 167 L 214 108 L 302 158 L 151 223 Z",'fill="currentColor" fill-opacity=".06"'),o+=s(175,65,175,172,'stroke-dasharray="4 5"'),o+=s(175,65,260,180),o+=s(175,172,260,180,'opacity=".5"'),o+=i("M175 163 L184 165 L184 174",'opacity=".65"'),o+=r(175,65,4,'fill="currentColor"'),o+=r(175,172,3,'fill="currentColor"'),n==="projection"&&(o+=i("M105 71 L230 84 L247 143 L125 131 Z",'fill="currentColor" fill-opacity=".08"'));else if(n==="cone")o+=i("M105 211 L180 56 L255 211"),o+='<ellipse cx="180" cy="211" rx="75" ry="20" fill="none" stroke="currentColor" opacity=".6"/>',o+=i("M180 56 L129 159 M180 56 L231 159",'opacity=".25"'),o+='<ellipse cx="180" cy="159" rx="51" ry="16" transform="rotate(-18 180 159)" fill="currentColor" fill-opacity=".12" stroke="currentColor" stroke-width="2"/>';else if(n==="vectors")o+=s(85,198,282,198,'opacity=".22"'),o+=s(85,198,251,198,'stroke-width="2.5"'),o+=s(85,198,226,88,'stroke-width="2"'),o+=i("M235 191 L251 198 L235 205"),o+=i("M212 91 L226 88 L222 103"),o+=s(226,88,226,198,'stroke-dasharray="3 5" opacity=".5"'),o+=i("M133 198 Q133 180 121 171",'opacity=".6"');else if(n==="conics")o+='<ellipse cx="180" cy="137" rx="116" ry="70" transform="rotate(-14 180 137)" fill="none" stroke="currentColor" stroke-width="1.6"/>',o+=r(110,155,3,'fill="currentColor"'),o+=r(249,120,3,'fill="currentColor"'),o+=i("M110 155 L203 70 L249 120",'opacity=".4"');else if(n==="reflection")o+=i("M74 73 Q180 300 286 73",'stroke-width="2"'),o+=s(96,45,96,110,'opacity=".6"'),o+=s(96,110,180,157,'stroke-width="1.5"'),o+=s(245,45,245,139,'opacity=".6"'),o+=s(245,139,180,157,'stroke-width="1.5"'),o+=r(180,157,4,'fill="currentColor"'),o+=s(180,57,180,227,'stroke-dasharray="3 5" opacity=".2"');else if(n==="surface"){for(let a=-3;a<=3;a++){let l="";for(let c=-3;c<=3;c+=.25){let u=180+c*26+a*14,d=150+a*16-(c*c-a*a)*4;l+=(l?" L":"M")+u+" "+d}o+=i(l,'opacity=".45"')}o+=i("M78 179 Q180 83 282 179",'stroke-width="2"')}else o+=s(49,207,309,207,'opacity=".23"'),o+=s(132,43,132,235,'opacity=".23"'),n==="area"&&(o+=i("M78 207 C113 100 130 80 170 160 S240 258 284 68 L284 207 Z",'fill="currentColor" fill-opacity=".11"')),["tangents","derivative","area","antiderivative","asymptote"].includes(n)?o+=i("M61 214 C109 38 147 111 179 164 S251 252 298 54",'stroke-width="1.7"'):o+=i("M57 194 Q183 240 291 52",'stroke-width="1.7"'),n==="newton"?o+=i("M291 52 L219 207 L219 157 L180 207 L180 192 L167 207",'opacity=".65"'):n==="asymptote"?o+=s(71,222,291,61,'stroke-dasharray="4 5" opacity=".5"'):n==="join"?o+=i("M180 171 L296 104",'stroke-width="1.6"'):n==="zoom"?(o+=r(201,151,49,'opacity=".6"'),o+=s(235,187,270,224,'opacity=".6"'),o+=s(161,180,245,111,'stroke-dasharray="4 5" opacity=".5"')):o+=s(104,235,281,75,'opacity=".6"'),o+=r(206,151,4,'fill="currentColor"');return'<svg viewBox="0 0 360 270" aria-hidden="true" focusable="false">'+o+"</svg>"}var sc=class{constructor(t,e,i={}){this.host=t,this.kind=e,this.options=i,this.enabled=i.motion!==!1,this.time=0,this.phase=0,this.visible=!0,this.destroyed=!1,this.raf=0;try{cp(e)?(this.init3D(),this.applyPalette()):this.init2D()}catch(s){this.controls?.dispose(),this.renderer?.dispose(),this.renderer?.forceContextLoss(),this.renderer=null,this.scene=null,this.controls=null,t.replaceChildren(),cp(e)?(t.innerHTML=Co(e),t.dataset.renderer="svg-fallback",this.staticFallback=!0,this.enabled=!1):(this.init2D(),t.dataset.renderer="canvas2d-fallback"),console.warn("\uC804\uC2DC \uB3C4\uD574\uB97C \uB300\uCCB4 \uD654\uBA74\uC73C\uB85C \uD45C\uC2DC\uD569\uB2C8\uB2E4.",s.message)}this.resizeObserver=new ResizeObserver(()=>{this.resize(),this.draw()}),this.resizeObserver.observe(t),this.visibility=new IntersectionObserver(s=>{this.visible=s[0].isIntersecting,this.visible&&this.enabled&&this.start()},{rootMargin:"150px"}),this.visibility.observe(t),this.resize(),this.draw(),this.enabled&&this.start()}init3D(){this.scene=new eo,this.camera=new rn(34,1,.1,60),this.camera.position.set(5,3.5,6.5),this.camera.lookAt(0,0,0),this.renderer=new Ql({alpha:!0,antialias:!0,powerPreference:"low-power"}),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,window.innerWidth<700?1.25:1.6)),this.renderer.setClearColor(0,0),this.renderer.outputColorSpace=dn,this.renderer.toneMapping=go,this.renderer.toneMappingExposure=1.2,this.host.append(this.renderer.domElement),this.host.dataset.renderer="webgl",this.scene.add(new uo(15330805,1779252,2.5));let t=new _r(16777215,3.1);t.position.set(-3,6,4),this.scene.add(t);let e=new _r(12110052,2);e.position.set(5,-2,-3),this.scene.add(e),this.group=new Di,this.scene.add(this.group),this.controls=new ic(this.camera,this.renderer.domElement),this.controls.enablePan=!1,this.controls.enableZoom=!1,this.controls.enableDamping=!0,this.controls.dampingFactor=.065,this.controls.maxPolarAngle=Math.PI*.75,this.controls.minPolarAngle=.3,this.controls.addEventListener("change",()=>{this.raf||this.renderer.render(this.scene,this.camera)}),this.renderer.domElement.style.touchAction="pan-y",this.updates=[],["hero","sphere-slice","sphere-vector","slices","hypersphere"].includes(this.kind)?this.sphere():["distance","planes"].includes(this.kind)?this.distance():this.kind==="projection"?this.projection():this.kind==="vectors"?this.vectors():this.kind==="cone"?this.cone():this.kind==="surface"?this.surface():cu(this.kind)&&rp(this)}applyPalette(){if(!Number.isFinite(this.options.hue))return;let t={};this.scene.traverse(e=>{for(let i of Array.isArray(e.material)?e.material:e.material?[e.material]:[])i.color&&(i.color.getHSL(t),t.s>.08&&i.color.setHSL(this.options.hue,Math.min(.62,Math.max(.28,t.s)),t.l))})}material(t=lp,e=.75){return new ao({color:t,roughness:.33,metalness:.12,transparent:e<1,opacity:e,side:Xn,depthWrite:e>=1,clearcoat:.7})}mesh(t,e=lp,i=.75){let s=new fn(t,this.material(e,i));return this.group.add(s),s}line(t,e=On,i=.8,s=!1){let r=new Ge().setFromPoints(t.map(l=>new L(...l))),o=s?new lo({color:e,transparent:!0,opacity:i,dashSize:.07,gapSize:.05}):new Tn({color:e,transparent:!0,opacity:i}),a=new As(r,o);return s&&a.computeLineDistances(),this.group.add(a),a}updateLine(t,e){t.geometry.setFromPoints(e.map(i=>new L(...i))),t.material.isLineDashedMaterial&&t.computeLineDistances()}sphere(){let e=this.mesh(new mn(1.65,56,40),6129773,this.kind==="hero"?.38:.28),i=new _i(new Oi(new mn(1.65,24,16)),new Tn({color:12768929,transparent:!0,opacity:.14}));this.group.add(i);let s=this.mesh(new pn(4.5,3.4),11257477,.12);s.rotation.x=-Math.PI/2;let r=this.mesh(new mr(1,.018,8,128),On,.95);r.rotation.x=Math.PI/2;let o=this.line([[0,0,0],[1.4,.5,0]],On,.7),a=this.line([[0,0,0],[0,.5,0]],si,.6,!0),l=this.mesh(new mr(1.65,.006,4,120),si,.35);if(l.rotation.x=Math.PI/2,this.group.rotation.z=-.13,this.kind==="slices"){e.visible=!1,s.visible=!1,r.visible=!1,o.visible=!1,a.visible=!1;for(let u=-1.45;u<1.5;u+=.24){let d=Math.sqrt(2.7224999999999997-u*u),h=this.mesh(new pr(d,d,.027,64),9613941,.23);h.position.y=u}}let c=this.mesh(new mn(.045,14,10),On,1);this.updates.push(u=>{let d=.72*Math.sin(u*.38+this.phase*.8),h=Math.sqrt(1.65*1.65-d*d);if(s.position.y=d,r.position.y=d,r.scale.set(h,h,1),this.updateLine(o,[[0,0,0],[h,d,0]]),this.updateLine(a,[[0,0,0],[0,d,0]]),c.position.set(h,d,0),i.rotation.y=u*.045,this.group.rotation.y=.15+Math.sin(u*.09)*.14,this.kind==="hypersphere"){let f=.85*Math.sin(u*.4),p=Math.sqrt(1-f*f);e.scale.setScalar(p),i.scale.setScalar(p),r.visible=!1,s.visible=!1,o.visible=!1,a.visible=!1,l.scale.setScalar(p),c.visible=!1}if(this.kind==="sphere-vector"){s.visible=!1,r.visible=!1,a.visible=!1;let f=u*.25,p=[1.65*Math.cos(f),1.65*Math.sin(f),0];this.updateLine(o,[[0,0,0],p]),c.position.set(...p)}})}distance(){let t=this.mesh(new pn(4.1,3.3),9414526,.25);t.rotation.x=-Math.PI/2,t.position.y=-.75;let e=this.line([[-2.05,-.75,-1.65],[2.05,-.75,-1.65],[2.05,-.75,1.65],[-2.05,-.75,1.65],[-2.05,-.75,-1.65]],si,.35),i=[.2,1.55,.1],s=[.2,-.75,.1];this.line([i,s],On,.95,!0),this.mesh(new mn(.065,16,12),On,1).position.set(...i),this.mesh(new mn(.035,12,8),si,1).position.set(...s);let a=this.mesh(new mn(.05,12,8),13687998,1),l=this.line([i,[1,-.75,1]],si,.6),c=this.line([s,[1,-.75,1]],si,.4);this.line([[.2,-.56,.1],[.4,-.56,.1],[.4,-.75,.1]],On,.55),this.updates.push(u=>{let d=[.2+1.3*Math.cos(u*.4),-.75,.1+.9*Math.sin(u*.4)];a.position.set(...d),this.updateLine(l,[i,d]),this.updateLine(c,[s,d]),this.group.rotation.y=-.25+Math.sin(u*.1)*.12})}projection(){let t=this.mesh(new pn(3.2,2.1),12111e3,.25);t.rotation.x=-Math.PI/2,t.position.y=-1;let e=this.mesh(new pn(3.2,2.1),8824953,.5);e.position.y=.7;let i=new _i(new oo(e.geometry),new Tn({color:On,transparent:!0,opacity:.85}));e.add(i);let s=Array.from({length:4},()=>this.line([[0,0,0],[0,-1,0]],si,.4,!0));this.updates.push(r=>{let o=.35+.7*(.5+.5*Math.sin(r*.35));e.rotation.x=-Math.PI/2+o,t.scale.y=Math.cos(o),[[-1.6,-1.05],[1.6,-1.05],[1.6,1.05],[-1.6,1.05]].forEach((l,c)=>{let u=[l[0],.7+l[1]*Math.sin(o),-l[1]*Math.cos(o)];this.updateLine(s[c],[u,[u[0],-1,u[2]]])}),this.group.rotation.y=-.15})}vectors(){let t=new L(-1.4,-.6,0);this.group.add(new ss(new L(1,0,0),t,2.8,si,.23,.12));let e=new ss(new L(.6,1,0).normalize(),t,2.5,On,.23,.12);this.group.add(e);let i=this.line([[0,1,0],[0,-.6,0]],si,.5,!0),s=this.line([[-1.4,-.6,0],[0,-.6,0]],On,.7);this.updates.push(r=>{let o=.3+2.5*(.5+.5*Math.sin(r*.35));e.setDirection(new L(Math.cos(o),Math.sin(o),0));let a=-1.4+2.5*Math.cos(o),l=-.6+2.5*Math.sin(o);this.updateLine(i,[[a,l,0],[a,-.6,0]]),this.updateLine(s,[[-1.4,-.6,0],[a,-.6,0]]),this.group.rotation.y=-.2})}cone(){let t=this.mesh(new ts(1.25,2.25,64,1,!0),7445365,.28);t.rotation.z=Math.PI,t.position.y=1.125;let e=this.mesh(new ts(1.25,2.25,64,1,!0),7445365,.22);e.position.y=-1.125;let i=new Tn({color:si,transparent:!0,opacity:.17});for(let a of[t,e]){let l=new _i(new Oi(new ts(1.25,2.25,24,1,!0)),i);l.position.copy(a.position),l.rotation.copy(a.rotation),this.group.add(l)}let s=new Ge().setFromPoints([new L(-2,0,-2),new L(2,0,-2),new L(2,0,2),new L(-2,0,2)]);s.setIndex([0,1,2,0,2,3]),s.computeVertexNormals();let r=this.mesh(s,12899480,.12),o=[];for(let a=0;a<8;a++)o.push(this.line([[0,0,0],[0,0,0]],On,.96));this.camera.position.set(6.8,3.5,7.8),this.controls.update(),this.updates.push(a=>{let l=.18+1.05*(.5+.5*Math.sin(a*.23)),c=Math.tan(l),u=.32,d=r.geometry.attributes.position;for(let f=0;f<d.count;f++)d.setY(f,c*d.getX(f)+u);d.needsUpdate=!0,r.geometry.computeVertexNormals();let h=[];for(let f of[1,-1]){let p=[];for(let _=0;_<=250;_++){let m=_/250*Math.PI*2,g=1.25/2.25,S=1-f*g*c*Math.cos(m),A=f*g*u/S,v=A*Math.cos(m),b=A*Math.sin(m),T=c*v+u;A>=0&&A<2&&Math.abs(T)<2.23?p.push([v,T,b]):p.length&&(h.push(p),p=[])}p.length&&h.push(p)}o.forEach((f,p)=>{f.visible=!!h[p]&&h[p].length>1,f.visible&&this.updateLine(f,h[p])})})}surface(){let t=new pn(3.8,3.8,40,40),e=t.attributes.position;for(let a=0;a<e.count;a++){let l=e.getX(a),c=e.getY(a);e.setXYZ(a,l,.22*(l*l-c*c),c)}t.computeVertexNormals(),this.mesh(t,7773814,.5);let i=new _i(new Oi(t),new Tn({color:si,transparent:!0,opacity:.16}));this.group.add(i);let s=this.mesh(new pn(4,2.8),12177041,.11),r=this.line([[0,0,0],[1,1,0]],On,1),o=this.mesh(new mn(.055,12,8),On,1);this.updates.push(a=>{let l=1.15*Math.sin(a*.3);s.position.z=l;let c=[];for(let d=-1.9;d<=1.91;d+=.04)c.push([d,.22*(d*d-l*l),l]);this.updateLine(r,c);let u=.8*Math.cos(a*.4);o.position.set(u,.22*(u*u-l*l),l),this.group.rotation.y=-.25})}init2D(){this.canvas=document.createElement("canvas"),this.host.append(this.canvas),this.ctx=this.canvas.getContext("2d"),this.host.dataset.renderer="canvas2d"}resize(){let t=this.host.getBoundingClientRect();if(this.width=Math.max(1,t.width),this.height=Math.max(1,t.height),this.renderer)this.renderer.setSize(this.width,this.height,!1),this.camera.aspect=this.width/this.height,this.camera.updateProjectionMatrix();else if(this.canvas){let e=Math.min(window.devicePixelRatio||1,2);this.canvas.width=this.width*e,this.canvas.height=this.height*e,this.ctx.setTransform(e,0,0,e,0,0)}}setPhase(t){this.phase=t,this.draw()}setMotion(t){this.enabled=t&&!this.staticFallback,this.controls&&(this.controls.enableDamping=t),this.enabled?this.start():(cancelAnimationFrame(this.raf),this.raf=0,this.draw())}start(){if(this.raf||this.destroyed)return;this.last=0;let t=e=>{if(this.destroyed||!this.enabled||!this.visible){this.raf=0;return}this.time+=this.last?Math.min((e-this.last)/1e3,.08):0,this.last=e,this.draw(),this.raf=requestAnimationFrame(t)};this.raf=requestAnimationFrame(t)}draw(){this.destroyed||(this.renderer?(this.updates.forEach(t=>t(this.time)),this.controls.update(),this.renderer.render(this.scene,this.camera)):this.ctx&&this.drawCanvas())}drawCanvas(){let t=this.ctx,e=this.width,i=this.height,s=Math.min(e/500,i/400),r=e*.49,o=i*.58,a=this.time,l=this.options.primary||"#ddec9d",c="#dce2ed";t.clearRect(0,0,e,i),t.save(),t.translate(r,o),t.scale(s,s),t.lineWidth=1,t.strokeStyle="#ccddbb17";for(let f=-210;f<=210;f+=35)t.beginPath(),t.moveTo(f,-180),t.lineTo(f,140),t.stroke();for(let f=-175;f<145;f+=35)t.beginPath(),t.moveTo(-220,f),t.lineTo(220,f),t.stroke();let u=(f,p=l,_=2)=>{t.beginPath(),f.forEach((m,g)=>g?t.lineTo(m[0],m[1]):t.moveTo(m[0],m[1])),t.strokeStyle=p,t.lineWidth=_,t.stroke()},d=(f,p,_=4,m=l)=>{t.beginPath(),t.arc(f,p,_,0,Math.PI*2),t.fillStyle=m,t.fill()};if(u([[-220,35],[220,35]],"#d0dfbf35",1),u([[0,-170],[0,130]],"#d0dfbf35",1),ap({kind:this.kind,t:a,phase:this.phase,c:t,path:u,dot:d,green:l,pale:c})){t.restore();return}let h=f=>this.kind==="join"?f<.8?f*f:1.6*f-.64:this.kind==="derivative"||this.kind==="tangents"||this.kind==="area"?f*f*f-1.4*f:this.kind==="antiderivative"?-Math.cos(f)*1.2:this.kind==="asymptote"?Math.sqrt(1+f*f):this.kind==="newton"?f*f-1:f*f;if(this.kind==="conics"){let f=[];for(let m=0;m<=180;m++){let g=m/180*Math.PI*2;f.push([Math.cos(g)*155,Math.sin(g)*84-12])}u(f),d(-105,-12),d(105,-12);let p=a*.25,_=[Math.cos(p)*155,Math.sin(p)*84-12];u([[-105,-12],_,[105,-12]],"#d2e1b67f",1),d(..._,5)}else if(this.kind==="reflection"){let f=[];for(let g=-2.2;g<=2.21;g+=.03)f.push([g*70,80-g*g*34]);u(f);let p=[0,80-4900/136],_=(.4+1.35*(.5+.5*Math.sin(a*.4)))*70,m=80-(_/70)**2*34;u([[_,-150],[_,m],p],"#c8db9dab",1.4),d(...p,5),d(_,m,4),t.fillStyle=c,t.font="13px sans-serif",t.fillText("F",12,p[1]+4)}else{let f=[];for(let p=-1.8;p<2.4;p+=.025)f.push([p*86,-h(p)*28+35]);if(this.kind==="area"&&(t.beginPath(),t.moveTo(-1.6*86,85),f.filter(p=>p[0]>-1.6*86&&p[0]<1.6*86).forEach(p=>t.lineTo(...p)),t.lineTo(1.6*86,85),t.closePath(),t.fillStyle="#d9eba51a",t.fill()),u(f),this.kind==="asymptote")t.setLineDash([5,6]),u([[-210,35+5880/86],[210,35-5880/86]],"#ccdcac90",1.2),u([[-210,35-5880/86],[210,35+5880/86]],"#ccdcac70",1.2),t.setLineDash([]);else if(this.kind==="newton"){let p=1.9,_=S=>S*S-1,m=S=>2*S,g=[];for(let S=0;S<4;S++){let A=p-_(p)/m(p);g.push([p*86,35-_(p)*28],[A*86,35],[A*86,35-_(A)*28]),p=A}u(g,"#b7ce927f",1),d(p*86,35,4)}else{let p=this.kind==="tangents"?.5:this.kind==="join"?.8:.65,_=.12+1.12*(.5+.5*Math.cos(a*.5+this.phase)),m=h(p),g=h(p+_),S=(h(p+.001)-h(p-.001))/.002,A=(g-m)/_,v=[[-1.7*86,35-(m+S*(-1.7-p))*28],[2.3*86,35-(m+S*(2.3-p))*28]];t.setLineDash([5,6]),u(v,"#d2e1bd75",1),t.setLineDash([]),u([[-1.7*86,35-(m+A*(-1.7-p))*28],[2.3*86,35-(m+A*(2.3-p))*28]],"#c8dc9cb0",1.4),d(p*86,35-m*28,4),d((p+_)*86,35-g*28,5),t.beginPath(),t.arc((p+_)*86,35-g*28,12,0,Math.PI*2),t.strokeStyle="#dae9ad55",t.lineWidth=1,t.stroke()}}t.restore()}dispose(){this.destroyed=!0,cancelAnimationFrame(this.raf),this.resizeObserver?.disconnect(),this.visibility?.disconnect(),this.controls?.dispose(),this.scene&&this.scene.traverse(t=>{t.geometry?.dispose(),t.material&&(Array.isArray(t.material)?t.material.forEach(e=>e.dispose()):t.material.dispose())}),this.renderer?.dispose(),this.renderer?.forceContextLoss(),this.host.replaceChildren()}};var ee=(n,t,e)=>({family:n,focus:t,beats:e.split("|")}),Ky={"e-01-c":ee("riemann","\uC9C1\uC0AC\uAC01\uD615\uACFC \uACE1\uC120 \uC0AC\uC774\uC758 \uD2C8","\uACE1\uC120 \uC544\uB798, \uBE48\uD2C8\uC774 \uBCF4\uC778\uB2E4.|\uC67C\uCABD\uACFC \uC624\uB978\uCABD\uC744 \uB530\uB85C \uC7A1\uB294\uB2E4.|\uB124 \uCE78\uC744, \uC5F4\uC5EC\uC12F \uCE78\uC73C\uB85C.|\uD45C\uBCF8\uC810\uC744 \uBC14\uAFB8\uBA74 \uB2F5\uB3C4 \uB2EC\uB77C\uC9C4\uB2E4.|\uB450 \uD569 \uC0AC\uC774\uB85C, \uCC38\uAC12\uC774 \uBAA8\uC778\uB2E4.|\uC798\uAC8C \uB098\uB208 \uD569\uC774 \uC801\uBD84\uC73C\uB85C.|\uC774\uC81C \uBD84\uD560 \uC218\uB97C \uC9C1\uC811 \uBC14\uAFD4 \uBCF4\uC790."),"a-06-c":ee("volume","\uB2E8\uBA74\uC758 \uD569\uACFC \uACE1\uBA74\uC758 \uB760","\uACF5\uC2DD\uC744, \uC587\uAC8C \uC798\uB77C \uBCF8\uB2E4.|\uC6D0\uD310 \uD558\uB098\uC758 \uB113\uC774\uB97C \uAD6C\uD55C\uB2E4.|\uD769\uC5B4\uC9C4 \uB2E8\uBA74\uC774 \uAD6C\uB97C \uCC44\uC6B4\uB2E4.|\uC6D0\uD310\uACFC \uD45C\uBA74\uC758 \uB760\uB294 \uB2E4\uB974\uB2E4.|\uB2E8\uBA74\uC801\uC774 \uB192\uC774\uC758 \uD568\uC218\uAC00 \uB41C\uB2E4.|\uD55C \uC7A5\uC529 \uC313\uC544, \uC785\uCCB4\uB97C \uC77D\uB2E4.|\uB2E4\uB978 \uC785\uCCB4\uC5D0\uB3C4 \uAC19\uC740 \uC9C8\uBB38\uC744."),"e-02-c":ee("signed","\uBD80\uD638 \uC788\uB294 \uB204\uC801\uACFC \uC804\uCCB4 \uB113\uC774","\uB113\uC774\uB294 \uB0A8\uC558\uB294\uB370, \uD569\uC740 0.|\uAE30\uC900\uC120 \uC704\uC640 \uC544\uB798\uB97C \uB098\uB208\uB2E4.|\uC74C\uC218\uC640 \uC591\uC218\uAC00 \uB530\uB85C \uC313\uC778\uB2E4.|\uC0C1\uC1C4\uC640 \uC0AC\uB77C\uC9D0\uC744 \uAD6C\uBCC4\uD55C\uB2E4.|\uC801\uBD84 0, \uC804\uCCB4 \uB113\uC774 4.|\uC5B4\uB5A4 \uC591\uC744 \uB354\uD558\uB294\uC9C0 \uBA3C\uC800 \uBB3B\uB2E4.|\uB204\uC801\uC758 \uB05D\uC810\uC744 \uC6C0\uC9C1\uC5EC \uBCF4\uC790."),"e-09-c":ee("restore-quadratic","\uC801\uBD84\uC0C1\uC218\uC640 \uD55C \uC810\uC758 \uC870\uAC74","\uAE30\uC6B8\uAE30\uB294 \uAC19\uC740\uB370, \uB192\uC774\uB294 \uB2E4\uB974\uB2E4.|\uBAA8\uC591\uACFC \uC704\uCE58\uB97C \uBD84\uB9AC\uD55C\uB2E4.|\uAC19\uC740 \uACE1\uC120\uC774 \uC704\uC544\uB798\uB85C \uAC08\uB77C\uC9C4\uB2E4.|\uB3C4\uD568\uC218\uB9CC\uC73C\uB85C \uD558\uB098\uB97C \uACE0\uB97C \uC218 \uC5C6\uB2E4.|\uD55C \uC810\uC774, \uC0C1\uC218\uB97C \uACB0\uC815\uD55C\uB2E4.|\uC5EC\uB7EC \uACE1\uC120\uC5D0\uC11C \uD558\uB098\uC758 \uACE1\uC120\uC73C\uB85C.|\uC870\uAC74\uC744 \uBC14\uAFB8\uC5B4 \uB2E4\uC2DC \uBCF5\uC6D0\uD574 \uBCF4\uC790."),"e-03-c":ee("rolle","\uC11C\uB85C \uB2E4\uB978 \uC2E4\uADFC \uC0AC\uC774\uC758 \uB07C\uC784","\uB2E4\uC12F \uADFC \uC0AC\uC774, \uB2E4\uC74C \uADFC\uC774 \uD0DC\uC5B4\uB09C\uB2E4.|\uC778\uC811\uD55C \uB450 \uADFC\uC744 \uC787\uB294\uB2E4.|\uBBF8\uBD84\uD560 \uB54C\uB9C8\uB2E4 \uD55C \uC904\uC529 \uC904\uC5B4\uB4E0\uB2E4.|\uC911\uBCF5\uADFC\uC740 \uB530\uB85C \uC0B4\uD3B4\uC57C \uD55C\uB2E4.|\uADFC\uACFC \uADFC \uC0AC\uC774\uB97C \uB2E4\uC2DC \uD655\uC778\uD55C\uB2E4.|\uCC28\uC218\uBCF4\uB2E4 \uC911\uC694\uD55C, \uC870\uAC74\uC758 \uC5ED\uD560.|\uB2E4\uB978 \uADFC\uC744 \uB193\uC544\uB3C4 \uB07C\uC784\uC740 \uB0A8\uC744\uAE4C."),"e-04-c":ee("restore","\uB3C4\uD568\uC218\uC758 \uBD80\uD638\uB85C \uC77D\uB294 \uC6D0\uD568\uC218","\uBCC0\uD654\uC728\uC5D0\uC11C, \uACE1\uC120\uC758 \uBAA8\uC591\uC73C\uB85C.|\uC591\uC218\uC640 \uC74C\uC218\uC778 \uAD6C\uAC04\uC744 \uB098\uB208\uB2E4.|\uAE30\uC6B8\uAE30\uC758 \uBD80\uD638\uAC00 \uBC29\uD5A5\uC744 \uC815\uD55C\uB2E4.|0\uC774\uB77C\uB294 \uAC12\uB9CC\uC73C\uB85C\uB294 \uBD80\uC871\uD558\uB2E4.|\uC88C\uC6B0 \uBD80\uD638\uAC00 \uBC14\uB00C\uB294\uC9C0 \uC77D\uB294\uB2E4.|\uBAA8\uC591\uC744 \uC54C\uACE0\uB3C4 \uB192\uC774\uB294 \uB0A8\uB294\uB2E4.|\uD559\uC0DD\uC774 \uB9CC\uB4E0 \uBCF5\uC6D0 \uACFC\uC815\uC744 \uB9CC\uB098\uB2E4."),"a-07-c":ee("zoom","\uAD00\uCC30 \uBC94\uC704\uC640 \uC811\uC120 \uC624\uCC28","\uACE1\uC120 \uC18D\uC5D0, \uC9C1\uC120\uC774 \uC228\uC5B4 \uC788\uB2E4.|\uD55C \uC810\uC744 \uC911\uC2EC\uC5D0 \uACE0\uC815\uD55C\uB2E4.|\uBC94\uC704\uB97C \uC881\uD790\uC218\uB85D \uACE1\uB960\uC774 \uC791\uC544\uC9C4\uB2E4.|\uB208\uB300\uC911 \uB300\uC2E0, \uCC28\uC774\uB97C \uC7B0\uB2E4.|\uBC94\uC704 1/10, \uC624\uCC28 1/100.|\uC791\uC740 \uBC94\uC704\uC5D0\uC11C \uB4DC\uB7EC\uB098\uB294 \uC120\uD615\uC131.|\uD655\uB300 \uBC30\uC728\uC744 \uC9C1\uC811 \uBC14\uAFB8\uC5B4 \uBCF4\uC790."),"a-09-c":ee("limits","\uADF9\uD55C\uC758 \uD615\uD0DC\uC640 \uC801\uC6A9 \uC870\uAC74","\uBBF8\uBD84\uD558\uAE30 \uC804, \uD615\uD0DC\uB97C \uBA3C\uC800 \uBCF8\uB2E4.|0/0\uC778\uAC00, \uBD84\uC790\uC640 \uBD84\uBAA8\uB97C \uB098\uB208\uB2E4.|\uAC00\uB2A5\uD55C \uC2DD\uC740 \uAC19\uC740 \uAC12\uC73C\uB85C \uBAA8\uC778\uB2E4.|\uAC19\uC774 \uBBF8\uBD84\uD588\uB294\uB370, \uACB0\uB860\uC740 \uB2E4\uB974\uB2E4.|\uC778\uC218\uBD84\uD574\uB85C \uD55C \uBC88 \uB354 \uD655\uC778\uD55C\uB2E4.|\uACC4\uC0B0\uBCF4\uB2E4 \uC55E\uC11C\uB294 \uC801\uC6A9 \uC870\uAC74.|\uB450 \uC2DD\uC744 \uB098\uB780\uD788 \uD655\uC778\uD574 \uBCF4\uC790."),"a-03-c":ee("secant","\uB450 \uC810\uC758 \uAE30\uC6B8\uAE30\uC5D0\uC11C \uD55C \uC810\uC73C\uB85C","\uB450 \uC810\uC5D0\uC11C, \uD55C \uC810\uC758 \uAE30\uC6B8\uAE30\uB85C.|\uACE0\uC815\uD560 \uC810\uACFC \uC6C0\uC9C1\uC77C \uC810\uC744 \uB098\uB208\uB2E4.|\uB450 \uBC88\uC9F8 \uC810\uC774 \uCCAB \uC810\uC73C\uB85C \uB2E4\uAC00\uC628\uB2E4.|h=0\uC744 \uBC14\uB85C \uB123\uC744 \uC218\uB294 \uC5C6\uB2E4.|\uD560\uC120\uACFC \uC811\uC120\uC758 \uCC28\uC774\uB97C \uC77D\uB294\uB2E4.|\uAC00\uAE4C\uC6CC\uC9C0\uB294 \uAC12\uC73C\uB85C \uC21C\uAC04\uC744 \uC815\uC758\uD558\uB2E4.|\uC774\uC81C \uB450 \uC810 \uC0AC\uC774\uB97C \uC6C0\uC9C1\uC5EC \uBCF4\uC790."),"e-05-c":ee("ratio","\uC0BC\uCC28\uD568\uC218\uC758 \uADF9\uC810\uACFC \uBCC0\uACE1\uC810","\uBAA8\uC591\uC774 \uBC14\uB00C\uC5B4\uB3C4, \uAC00\uC6B4\uB370\uB294 \uB0A8\uC744\uAE4C.|\uB450 \uADF9\uC810\uACFC \uBCC0\uACE1\uC810\uC744 \uCC0D\uB294\uB2E4.|\uC11C\uB85C \uB2E4\uB978 \uB192\uC774, \uAC19\uC740 \uC218\uD3C9 \uBE44\uC728.|\uAC70\uB9AC\uC758 \uBC29\uD5A5\uC744 \uBA3C\uC800 \uAD6C\uBD84\uD55C\uB2E4.|\uBCC0\uACE1\uC810 \uC591\uCABD\uC758 \uAC70\uB9AC\uB97C \uBE44\uAD50\uD55C\uB2E4.|\uB2EE\uC740 \uBAA8\uC591 \uC548\uC5D0\uC11C \uAD00\uACC4\uB97C \uCC3E\uB2E4.|\uB2E4\uB978 \uC0BC\uCC28\uD568\uC218\uC5D0\uB3C4 \uBB3C\uC5B4\uBCF4\uC790."),"a-04-c":ee("extrema","\uB3C4\uD568\uC218\uC758 \uADFC\uACFC \uBD80\uD638 \uBCC0\uD654","\uBCF5\uC7A1\uD55C \uACE1\uC120\uC5D0, \uD45C\uC2DD\uC744 \uB0A8\uAE34\uB2E4.|\uAE30\uC6B8\uAE30\uAC00 0\uC778 \uACF3\uC744 \uCC3E\uB294\uB2E4.|\uC99D\uAC00\uC640 \uAC10\uC18C\uAC00 \uAC08\uB77C\uC9C4\uB2E4.|\uBA48\uCDC4\uB2E4\uACE0 \uBAA8\uB450 \uADF9\uAC12\uC740 \uC544\uB2C8\uB2E4.|\uC810 \uD558\uB098\uBCF4\uB2E4 \uC591\uCABD\uC758 \uBD80\uD638\uB97C.|\uBBF8\uBD84\uC73C\uB85C \uACE1\uC120\uC758 \uC9C0\uB3C4\uB97C \uC77D\uB2E4.|\uACC4\uC218 \uBCC0\uD654\uAC00 \uBAA8\uC591\uC744 \uBC14\uAFC0\uAE4C."),"a-08-c":ee("newton","\uC811\uC120\uC73C\uB85C \uC774\uB3D9\uD558\uB294 \uBC18\uBCF5 \uACFC\uC815","\uC811\uC120\uC744 \uD0C0\uACE0, \uADFC\uC744 \uD5A5\uD574.|\uCD9C\uBC1C\uC810\uC5D0\uC11C \uC811\uC120\uC744 \uAE0B\uB294\uB2E4.|\uB2E4\uC74C \uAD50\uC810\uC774 \uC0C8 \uCD9C\uBC1C\uC810\uC774 \uB41C\uB2E4.|\uAE30\uC6B8\uAE30\uAC00 0\uC774\uBA74 \uAE38\uC774 \uB04A\uAE34\uB2E4.|\uBC18\uBCF5 \uC0AC\uC774\uC758 \uAC70\uB9AC\uB97C \uBE44\uAD50\uD55C\uB2E4.|\uAC00\uAE4C\uC6CC\uC9D0\uC5D0\uB3C4 \uC870\uAC74\uC774 \uD544\uC694\uD558\uB2E4.|\uD559\uC0DD \uC6F9\uC571\uC5D0\uC11C \uCD9C\uBC1C\uC810\uC744 \uACE8\uB77C \uBCF4\uC790."),"e-06-c":ee("mean-value","\uD3C9\uADE0 \uBCC0\uD654\uC728\uACFC \uC21C\uAC04 \uBCC0\uD654\uC728","\uB450 \uC810\uC758 \uD3C9\uADE0, \uD55C \uC810\uC758 \uC21C\uAC04.|\uAD6C\uAC04 \uC591 \uB05D\uC744 \uBA3C\uC800 \uACE0\uC815\uD55C\uB2E4.|\uC811\uC120\uC774 \uD560\uC120\uACFC \uB098\uB780\uD574\uC9C0\uB294 \uC21C\uAC04.|\uBAA8\uC11C\uB9AC\uAC00 \uC788\uC73C\uBA74 \uC870\uAC74\uC774 \uAE68\uC9C4\uB2E4.|\uAD6C\uAC04 \uC548\uC758 \uD55C \uC810\uC744 \uD655\uC778\uD55C\uB2E4.|\uD3C9\uADE0\uACFC \uC21C\uAC04\uC744 \uC787\uB294 \uC815\uB9AC.|\uB2E4\uB978 \uAD6C\uAC04\uC758 \uAC19\uC740 \uAE30\uC6B8\uAE30\uB97C \uCC3E\uC544\uBCF4\uC790."),"e-07-c":ee("chain","\uD569\uC131\uD568\uC218\uC758 \uC601\uC810\uACFC \uADF9\uAC12","0\uC744 \uCC3E\uC558\uB294\uB370, \uADF9\uAC12\uC77C\uAE4C.|\uB450 \uBCC0\uD654\uC728\uC744 \uB530\uB85C \uC77D\uB294\uB2E4.|\uACF1\uC774 0\uC774 \uB418\uB294 \uAE38\uC774 \uAC08\uB77C\uC9C4\uB2E4.|x\xB3\uC740 \uBA48\uCD94\uC5B4\uB3C4 \uBC29\uD5A5\uC744 \uC548 \uBC14\uAFBC\uB2E4.|x\xB2\uACFC x\xB3\uC758 \uC591\uCABD \uBD80\uD638\uB97C \uBE44\uAD50\uD55C\uB2E4.|\uC601\uC810 \uB2E4\uC74C\uC5D0\uB294 \uBD80\uD638\uB97C \uBCF4\uC790.|\uD559\uC0DD\uC758 \uD569\uC131\uD568\uC218 \uD0D0\uAD6C\uB85C \uC774\uC5B4\uC9C4\uB2E4."),"e-10-c":ee("tangent-merge","\uC811\uC810 \uBC29\uC815\uC2DD\uC758 \uC911\uADFC\uACFC \uC811\uC120 \uC218","\uC811\uC810\uC774 \uACB9\uCE58\uBA74, \uBA87 \uAC1C\uB97C \uC140\uAE4C.|\uACE1\uC120 \uBC16\uC758 \uC810\uC744 \uACE0\uC815\uD55C\uB2E4.|\uC811\uC120\uB4E4\uC774 \uD55C \uC810\uC73C\uB85C \uBAA8\uC778\uB2E4.|\uACBD\uACC4\uC5D0\uC11C \uB450 \uC811\uC810\uC774 \uD558\uB098\uAC00 \uB41C\uB2E4.|\uC911\uBCF5 \uD69F\uC218\uC640 \uC11C\uB85C \uB2E4\uB978 \uADFC\uC744 \uB098\uB208\uB2E4.|\uBC29\uC815\uC2DD\uC758 \uADFC\uC5D0\uC11C \uC811\uC120 \uC218\uB85C.|\uC811\uC810\uC758 \uACBD\uACC4\uB97C \uC9C1\uC811 \uC0B4\uD3B4\uBCF4\uC790."),"a-05-c":ee("area-scale","\uC0AC\uCC28\uD568\uC218\uC758 \uB2EE\uC74C\uACFC \uB113\uC774\uBE44","\uB298\uC5B4\uB09C \uBAA8\uC591, \uADF8\uB300\uB85C\uC778 \uB113\uC774\uBE44.|\uB113\uC774\uB97C \uB450 \uC601\uC5ED\uC73C\uB85C \uB098\uB208\uB2E4.|\uAC00\uB85C\uC640 \uC138\uB85C\uAC00 \uD568\uAED8 \uB298\uC5B4\uB09C\uB2E4.|\uB113\uC774 \uC790\uCCB4\uC640 \uBE44\uC728\uC744 \uAD6C\uBD84\uD55C\uB2E4.|\uAC19\uC740 \uBC30\uC728\uC774 \uB450 \uC601\uC5ED\uC5D0 \uC791\uC6A9\uD55C\uB2E4.|\uACF5\uD1B5 \uBC30\uC728\uC774 \uBE44\uC5D0\uC11C \uC0AC\uB77C\uC9C4\uB2E4.|\uD559\uC0DD\uC774 \uC815\uB9AC\uD55C \uB113\uC774\uBE44\uB97C \uB9CC\uB098\uB2E4."),"a-10-c":ee("antiderivative","\uB3C4\uD568\uC218\uC5D0\uC11C \uC6D0\uD568\uC218\uB85C \uAC00\uB294 \uB204\uC801","\uBCC0\uD654\uC758 \uAE30\uB85D\uC73C\uB85C, \uC6D0\uB798 \uAE38\uC744 \uCC3E\uB2E4.|\uC591\uC218\uC640 \uC74C\uC218\uC778 \uAE30\uC6B8\uAE30\uB97C \uC77D\uB294\uB2E4.|\uC870\uAE08\uC529 \uC313\uC778 \uBCC0\uD654\uAC00 \uACE1\uC120\uC774 \uB41C\uB2E4.|\uCD9C\uBC1C \uB192\uC774\uB294 \uC544\uC9C1 \uC815\uD574\uC9C0\uC9C0 \uC54A\uC558\uB2E4.|\uAC19\uC740 \uB3C4\uD568\uC218, \uB2E4\uB978 \uC801\uBD84\uC0C1\uC218.|\uB3C4\uD568\uC218\uB85C \uBAA8\uC591\uC744 \uBCF5\uC6D0\uD558\uB2E4.|\uD559\uC0DD \uC6F9\uC571\uC5D0\uC11C \uC9C1\uC811 \uADF8\uB824 \uBCF4\uC790."),"e-11-c":ee("curvature","\uC774\uACC4\uB3C4\uD568\uC218\uC758 \uBD80\uD638\uC640 \uBCC0\uACE1","\uAE30\uC6B8\uAE30\uB294, \uC5B4\uB290 \uCABD\uC73C\uB85C \uBC14\uB014\uAE4C.|\uC811\uC120\uC758 \uAE30\uC6B8\uAE30\uB97C \uC5F0\uC18D\uD574\uC11C \uC77D\uB294\uB2E4.|\uD55C\uCABD\uC740 \uC904\uACE0, \uB2E4\uB978 \uCABD\uC740 \uB298\uC5B4\uB09C\uB2E4.|\uC774\uACC4\uB3C4\uD568\uC218 0\uB9CC\uC73C\uB85C \uBD80\uC871\uD558\uB2E4.|x\xB3\uACFC x\u2074, \uBD80\uD638 \uBCC0\uD654\uB97C \uBE44\uAD50\uD55C\uB2E4.|\uC810\uC758 \uAC12\uBCF4\uB2E4 \uC804\uD6C4\uC758 \uBCC0\uD654\uB97C.|\uD559\uC0DD\uC758 \uD310\uC815 \uACFC\uC815\uC744 \uC774\uC5B4 \uC77D\uC790."),"e-08-c":ee("model","\uD6C4\uBCF4 \uD568\uC218\uC640 \uC794\uCC28\uC758 \uBE44\uAD50","\uB2EE\uC740 \uC608\uCE21, \uB2E4\uB978 \uC624\uCC28.|\uC138 \uBAA8\uD615\uC5D0 \uAC19\uC740 \uC790\uB8CC\uB97C \uB193\uB294\uB2E4.|\uC810\uACFC \uC608\uCE21 \uC0AC\uC774\uC5D0 \uD2C8\uC774 \uC0DD\uAE34\uB2E4.|\uAC89\uBAA8\uC591\uB9CC\uC73C\uB85C \uACE0\uB974\uC9C0 \uC54A\uB294\uB2E4.|\uC794\uCC28\uB97C \uAC19\uC740 \uAE30\uC900\uC73C\uB85C \uBAA8\uC740\uB2E4.|\uC5B4\uB5A4 \uC790\uB8CC\uB85C \uBE44\uAD50\uD588\uB294\uC9C0 \uBB3B\uB2E4.|\uD559\uC0DD\uC758 \uC608\uCE21 \uBAA8\uD615\uC744 \uB9CC\uB098\uB2E4."),"a-01-c":ee("tangents","\uD55C \uC810\uC744 \uC9C0\uB098\uB294 \uC0BC\uCC28\uD568\uC218\uC758 \uC811\uC120","\uD55C \uC810\uC744 \uC9C0\uB098\uB294, \uC5EC\uB7EC \uC811\uC120.|\uC811\uC810 t\uB97C \uBA3C\uC800 \uC6C0\uC9C1\uC778\uB2E4.|\uC811\uC120 \uC138 \uAC1C\uAC00 \uAC19\uC740 \uC810\uC744 \uC9C0\uB09C\uB2E4.|\uC810\uC744 \uC62E\uAE30\uBA74 \uAC1C\uC218\uAC00 \uBC14\uB010\uB2E4.|\uC811\uC810 \uBC29\uC815\uC2DD\uC758 \uC11C\uB85C \uB2E4\uB978 \uC2E4\uADFC.|\uAE30\uC6B8\uAE30\uBCF4\uB2E4 \uC811\uC810\uC744 \uBBF8\uC9C0\uC218\uB85C.|\uB2E4\uB978 \uC810\uC5D0\uC11C\uB294 \uBA87 \uAC1C\uAC00 \uB420\uAE4C."),"a-02-c":ee("join","\uD568\uC218\uC758 \uC5F0\uACB0\uACFC \uB9E4\uB044\uB7EC\uC6C0","\uC774\uC5B4\uC84C\uB2E4\uB294 \uAC83\uB9CC\uC73C\uB85C \uCDA9\uBD84\uD560\uAE4C.|\uC67C\uCABD\uACFC \uC624\uB978\uCABD\uC744 \uB530\uB85C \uB193\uB294\uB2E4.|\uB192\uC774\uB97C \uB9DE\uCD94\uC5B4 \uD55C \uC810\uC5D0\uC11C \uC787\uB294\uB2E4.|\uC5F0\uACB0\uB418\uC5B4\uB3C4 \uBAA8\uC11C\uB9AC\uB294 \uB0A8\uB294\uB2E4.|\uAC12\uACFC \uAE30\uC6B8\uAE30\uB97C \uD568\uAED8 \uB9DE\uCD98\uB2E4.|\uB04A\uAE40\uC744 \uB118\uC5B4\uC11C, \uB9E4\uB044\uB7FD\uAC8C.|\uC811\uD569\uC810\uC744 \uC9C1\uC811 \uBC14\uAFB8\uC5B4 \uBCF4\uC790."),"a-11-c":ee("surface","\uD55C \uBCC0\uC218\uB97C \uACE0\uC815\uD55C \uB2E8\uBA74\uC758 \uBBF8\uBD84","\uC785\uCCB4 \uC704\uC5D0\uC11C, \uD558\uB098\uB97C \uACE0\uC815\uD558\uB2E4.|\uB450 \uBC29\uD5A5\uC744 \uB530\uB85C \uD45C\uC2DC\uD55C\uB2E4.|\uD3C9\uBA74\uC73C\uB85C \uC798\uB77C \uACE1\uC120\uC744 \uAEBC\uB0B8\uB2E4.|\uC804\uCCB4 \uBCC0\uD654\uC640 \uD55C \uBC29\uD5A5\uC758 \uBCC0\uD654\uB97C \uB098\uB208\uB2E4.|\uB2E8\uBA74 \uC704 \uC811\uC120\uC774 \uBCC0\uD654\uC728\uC744 \uB9D0\uD55C\uB2E4.|\uACF5\uAC04\uC758 \uC9C8\uBB38\uC744 \uD3C9\uBA74\uC73C\uB85C \uC62E\uAE30\uB2E4.|\uB2E4\uB978 \uBC29\uD5A5\uC73C\uB85C \uB2E4\uC2DC \uC798\uB77C \uBCF4\uC790."),"e-01-g":ee("space-points","\uACF5\uAC04 \uC120\uBD84\uC758 \uB0B4\uBD84\uACFC \uC678\uBD84","\uB450 \uC810 \uC0AC\uC774, \uD55C \uC810\uC744 \uB193\uB2E4.|\uC138 \uC88C\uD45C\uC758 \uBCC0\uD654\uB97C \uB098\uB204\uC5B4 \uBCF8\uB2E4.|\uAC19\uC740 \uBE44\uC728\uB85C \uC138 \uBC29\uD5A5\uC744 \uC6C0\uC9C1\uC778\uB2E4.|1\uC744 \uB118\uC73C\uBA74 \uC120\uBD84 \uBC16\uC73C\uB85C.|\uACF5\uAC04\uACFC \uC88C\uD45C\uC758 \uBE44\uC728\uC744 \uBE44\uAD50\uD55C\uB2E4.|\uC88C\uD45C \uC14B\uC744 \uD558\uB098\uC758 \uC2DD\uC73C\uB85C.|\uD559\uC0DD \uC6F9\uC571\uC5D0\uC11C \uBE44\uC728\uC744 \uBC14\uAFD4 \uBCF4\uC790."),"a-06-g":ee("dimension","\uCC28\uC6D0\uC744 \uB0AE\uCD94\uC5B4 \uBCF4\uB294 \uB2E8\uBA74","\uBCF4\uC774\uC9C0 \uC54A\uB294 \uCC28\uC6D0\uC744, \uC798\uB77C \uBCF4\uB2E4.|\uD55C \uC88C\uD45C\uB97C \uACE0\uC815\uD55C\uB2E4.|\uAD6C\uC5D0\uC11C \uC6D0\uC73C\uB85C, \uCC28\uC6D0\uC774 \uB0B4\uB824\uAC04\uB2E4.|\uACBD\uACC4\uC5D0 \uB2FF\uC73C\uBA74 \uB2E8\uBA74\uC774 \uC904\uC5B4\uB4E0\uB2E4.|\uB0A8\uC740 \uC88C\uD45C\uAC00 \uC791\uC740 \uAD6C\uB97C \uC774\uB8EC\uB2E4.|\uC9C1\uC811 \uBCFC \uC218 \uC5C6\uC5B4\uB3C4 \uAD00\uACC4\uB294 \uC77D\uD78C\uB2E4.|\uCC28\uC6D0\uC744 \uBC14\uAFB8\uC5B4 \uAC19\uC740 \uC9C8\uBB38\uC744."),"e-02-g":ee("parabola","\uCD08\uC810\uACFC \uC900\uC120\uAE4C\uC9C0 \uAC19\uC740 \uAC70\uB9AC","\uAC19\uC740 \uAC70\uB9AC\uC758 \uC810\uB4E4\uC774 \uACE1\uC120\uC774 \uB41C\uB2E4.|\uCD08\uC810 \uD558\uB098\uC640 \uC9C1\uC120 \uD558\uB098\uB97C \uB193\uB294\uB2E4.|\uB450 \uAC70\uB9AC\uAC00 \uAC19\uC740 \uC810\uC744 \uC787\uB294\uB2E4.|\uC900\uC120\uAE4C\uC9C0\uB294 \uC218\uC9C1\uC73C\uB85C \uC7AC\uC57C \uD55C\uB2E4.|\uB450 \uC120\uBD84\uC758 \uAE38\uC774\uB97C \uBE44\uAD50\uD55C\uB2E4.|\uAC70\uB9AC \uC870\uAC74\uC774 \uD3EC\uBB3C\uC120\uC758 \uC2DD\uC73C\uB85C.|\uCD08\uC810\uC758 \uC704\uCE58\uB97C \uBC14\uAFB8\uC5B4 \uBCF4\uC790."),"e-03-g":ee("ellipsoid","\uAC70\uB9AC \uD569\uACFC \uACF5\uAC04\uC758 \uD68C\uC804\uD0C0\uC6D0\uCCB4","\uD0C0\uC6D0\uC774 \uD3C9\uBA74 \uBC16\uC73C\uB85C \uD3BC\uCCD0\uC9C4\uB2E4.|\uACF5\uAC04\uC5D0 \uB450 \uCD08\uC810\uC744 \uACE0\uC815\uD55C\uB2E4.|\uAC70\uB9AC\uC758 \uD569\uC744 \uC720\uC9C0\uD558\uBA70 \uD68C\uC804\uD55C\uB2E4.|a\uC640 c\uC758 \uACBD\uACC4\uC5D0\uC11C\uB294 \uB2EC\uB77C\uC9C4\uB2E4.|\uC911\uC2EC\uC744 \uC9C0\uB098\uB294 \uB2E8\uBA74\uC744 \uAEBC\uB0B8\uB2E4.|\uAC70\uB9AC \uC870\uAC74\uC744 \uACF5\uAC04\uC73C\uB85C \uB113\uD788\uB2E4.|\uD3C9\uBA74\uACFC \uC785\uCCB4\uB97C \uBC88\uAC08\uC544 \uBCF4\uC790."),"e-04-g":ee("conic-boundary","\uCD08\uC810 \uAC70\uB9AC \uC870\uAC74\uC758 \uC874\uC7AC\uC640 \uACBD\uACC4","\uC870\uAC74 \uD558\uB098\uAC00, \uACE1\uC120\uC744 \uC5C6\uC564\uB2E4.|\uCD08\uC810 \uC0AC\uC774 \uAC70\uB9AC 2c\uB97C \uACE0\uC815\uD55C\uB2E4.|\uD569\uACFC \uCC28\uC758 \uC870\uAC74\uC744 \uB098\uB780\uD788 \uBCF8\uB2E4.|\uACBD\uACC4\uAC12\uC5D0\uC11C \uACE1\uC120\uC774 \uD1F4\uD654\uD55C\uB2E4.|\uC874\uC7AC\uD558\uB294 \uC870\uAC74\uC744 \uBA3C\uC800 \uD655\uC778\uD55C\uB2E4.|\uBC29\uC815\uC2DD \uC55E\uC5D0, \uAC00\uB2A5\uD55C \uAC70\uB9AC\uB97C.|\uD559\uC0DD\uC758 \uACBD\uACC4 \uC870\uAC74 \uD0D0\uAD6C\uB85C."),"a-07-g":ee("projection","\uAE30\uC6B8\uAE30\uC640 \uC815\uC0AC\uC601 \uB113\uC774","\uB113\uC774\uB294, \uADF8\uB9BC\uC790\uC5D0\uC11C \uC904\uC5B4\uB4E0\uB2E4.|\uC6D0\uB798 \uBA74\uACFC \uD22C\uC601\uBA74\uC744 \uB098\uB208\uB2E4.|\uAE30\uC6B8\uC77C\uC218\uB85D \uADF8\uB9BC\uC790\uAC00 \uC811\uD78C\uB2E4.|\uAE38\uC774\uC640 \uB113\uC774\uC758 \uBE44\uB97C \uD63C\uB3D9\uD558\uC9C0 \uC54A\uB294\uB2E4.|\uAE30\uC6B8\uAE30 \uD558\uB098\uAC00 \uB192\uC774\uB97C \uC904\uC778\uB2E4.|\uBA74\uC801\uC5D0 \uB0A8\uB294 \uCF54\uC0AC\uC778\uC758 \uBAAB.|\uB2E4\uB978 \uAC01\uB3C4\uC758 \uADF8\uB9BC\uC790\uB97C \uB9CC\uB4E4\uC5B4 \uBCF4\uC790."),"a-09-g":ee("cone-cut","\uC808\uB2E8\uD3C9\uBA74\uC774 \uB9CC\uB4DC\uB294 \uC774\uCC28\uACE1\uC120","\uD558\uB098\uC758 \uC6D0\uBFD4, \uC11C\uB85C \uB2E4\uB978 \uACE1\uC120.|\uC790\uB974\uB294 \uD3C9\uBA74\uC744 \uB193\uB294\uB2E4.|\uD3C9\uBA74\uC758 \uAE30\uC6B8\uAE30\uAC00 \uB2EC\uB77C\uC9C4\uB2E4.|\uBAA8\uC120\uACFC \uB098\uB780\uD55C \uC21C\uAC04\uC774 \uACBD\uACC4\uB2E4.|\uC6D0\uC744 \uC9C0\uB098 \uD0C0\uC6D0\xB7\uD3EC\uBB3C\uC120\xB7\uC30D\uACE1\uC120\uC73C\uB85C.|\uACF5\uAC04\uC758 \uC808\uB2E8\uC774 \uD3C9\uBA74\uC758 \uACE1\uC120\uC73C\uB85C.|\uB124 \uAC00\uC9C0 \uB2E8\uBA74\uC744 \uC774\uC5B4 \uBCF4\uC790."),"a-03-g":ee("focal","\uAC70\uB9AC\uC758 \uD569\uACFC \uCC28\uB85C \uB9CC\uB4DC\uB294 \uACE1\uC120","\uB354\uD560\uAE4C, \uBE84\uAE4C. \uACE1\uC120\uC774 \uAC08\uB9B0\uB2E4.|\uB450 \uCD08\uC810\uC744 \uAC19\uC740 \uC790\uB9AC\uC5D0 \uB193\uB294\uB2E4.|\uD55C \uC810\uC5D0\uC11C \uB450 \uAC70\uB9AC\uB97C \uC787\uB294\uB2E4.|\uD569\uC758 \uC870\uAC74\uACFC \uCC28\uC758 \uC870\uAC74\uC744 \uB098\uB208\uB2E4.|\uACE0\uC815\uB418\uB294 \uAC12\uC774 \uB2E4\uB974\uB2E4.|\uAC19\uC740 \uB450 \uC810\uC5D0\uC11C \uB2E4\uB978 \uACE1\uC120\uC73C\uB85C.|\uC870\uAC74\uC744 \uBC14\uAFB8\uC5B4 \uADA4\uC801\uC744 \uBCF4\uC790."),"e-05-g":ee("line-plane","\uBC95\uC120 \uB0B4\uC801\uACFC \uD55C \uC810\uC758 \uD3EC\uD568 \uC5EC\uBD80","\uD3C9\uD589\uACFC \uD3EC\uD568, \uAC19\uC740 \uB0B4\uC801 0.|\uBC29\uD5A5\uBCA1\uD130\uC640 \uBC95\uC120\uC744 \uAEBC\uB0B8\uB2E4.|\uC9C1\uC120\uC774 \uD3C9\uBA74\uC744 \uAC00\uB85C\uC9C0\uB978\uB2E4.|\uBC29\uD5A5\uC774 \uAC19\uC544\uB3C4 \uC704\uCE58\uB294 \uB2E4\uB974\uB2E4.|\uC9C1\uC120 \uC704 \uD55C \uC810\uC744 \uB354 \uD655\uC778\uD55C\uB2E4.|\uBC29\uD5A5 \uC870\uAC74\uC5D0 \uC704\uCE58 \uC870\uAC74\uC744 \uB354\uD558\uB2E4.|\uC138 \uAC00\uC9C0 \uC704\uCE58 \uAD00\uACC4\uB97C \uC0B4\uD3B4\uBCF4\uC790."),"a-04-g":ee("minimum","\uC9C1\uAC01\uC0BC\uAC01\uD615\uACFC \uCD5C\uB2E8\uAC70\uB9AC","\uB9CE\uC740 \uAE38 \uC911, \uAC00\uC7A5 \uC9E7\uC740 \uD558\uB098.|\uD3C9\uBA74 \uC704\uC758 \uB3C4\uCC29\uC810\uC744 \uC6C0\uC9C1\uC778\uB2E4.|\uC0AC\uC120 \uAE38\uC774\uAC00 \uC218\uC120\uBCF4\uB2E4 \uAE38\uC5B4\uC9C4\uB2E4.|\uBE57\uBCC0\uACFC \uC218\uC120\uC744 \uAD6C\uBD84\uD55C\uB2E4.|\uB0A8\uB294 \uAE38\uC774\uB294 \uC9C1\uAC01\uC0BC\uAC01\uD615 \uC548\uC5D0.|\uBAA8\uB4E0 \uAE38\uC758 \uC544\uB798\uC5D0, \uC218\uC120 \uD558\uB098.|\uB3C4\uCC29\uC810\uC744 \uBC14\uAFB8\uC5B4 \uBE44\uAD50\uD574 \uBCF4\uC790."),"a-08-g":ee("plane-distance","\uBC95\uC120 \uBC29\uD5A5\uC758 \uC131\uBD84\uACFC \uAC70\uB9AC \uACF5\uC2DD","\uACF5\uAC04\uC758 \uAC70\uB9AC\uB97C, \uD55C \uBC29\uD5A5\uC73C\uB85C.|\uD3C9\uBA74\uC758 \uBC95\uC120\uC744 \uC138\uC6B4\uB2E4.|\uC810\uC5D0\uC11C \uD3C9\uBA74\uC73C\uB85C \uC218\uC120\uC744 \uB0B4\uB9B0\uB2E4.|\uBC95\uC120\uC758 \uD06C\uAE30\uB97C \uADF8\uB300\uB85C \uC4F0\uBA74 \uC548 \uB41C\uB2E4.|\uC131\uBD84\uC744 \uBC95\uC120 \uAE38\uC774\uB85C \uB098\uB208\uB2E4.|\uC88C\uD45C\uC2DD \uC18D\uC5D0 \uC228\uC740 \uC815\uC0AC\uC601.|\uD559\uC0DD\uC758 \uAC70\uB9AC \uACC4\uC0B0\uAE30\uB97C \uB9CC\uB098 \uBCF4\uC790."),"e-06-g":ee("overlap","\uAD00\uCC30 \uBC29\uD5A5\uC5D0 \uB530\uB978 \uC815\uC0AC\uC601 \uACB9\uCE68","\uB2E4\uB978 \uB450 \uC810\uC774, \uD558\uB098\uB85C \uBCF4\uC778\uB2E4.|\uAD00\uCC30 \uBC29\uD5A5\uC744 \uB530\uB85C \uD45C\uC2DC\uD55C\uB2E4.|\uB450 \uC810\uC758 \uADF8\uB9BC\uC790\uAC00 \uAC00\uAE4C\uC6CC\uC9C4\uB2E4.|\uACB9\uCE5C \uADF8\uB9BC\uC790\uAC00 \uAC19\uC740 \uC810\uC740 \uC544\uB2C8\uB2E4.|\uCC28\uBCA1\uD130\uC640 \uC2DC\uC120\uC774 \uB098\uB780\uD574\uC9C4\uB2E4.|\uBCF4\uC774\uB294 \uC704\uCE58\uC640 \uC2E4\uC81C \uC704\uCE58\uB97C \uB098\uB204\uB2E4.|\uC2DC\uC120\uC744 \uBC14\uAFB8\uC5B4 \uB2E4\uC2DC \uAD00\uCC30\uD558\uC790."),"e-07-g":ee("cone-discriminant","\uC808\uB2E8\uAC01\uACFC \uC774\uCC28\uD56D\uC758 \uBD80\uD638","\uAC01\uB3C4 \uD558\uB098\uAC00, \uC2DD\uC758 \uBD80\uD638\uB97C \uBC14\uAFBC\uB2E4.|\uC6D0\uBFD4\uACFC \uD3C9\uBA74\uC758 \uC2DD\uC744 \uACB9\uCE5C\uB2E4.|\uC808\uB2E8\uAC01\uC774 \uBAA8\uC120\uC5D0 \uAC00\uAE4C\uC6CC\uC9C4\uB2E4.|D=0, \uACBD\uACC4\uB97C \uC815\uD655\uD788 \uC77D\uB294\uB2E4.|\uBD80\uD638 \uC138 \uAC1C\uAC00 \uB2E8\uBA74\uC744 \uAC00\uB978\uB2E4.|\uACF5\uAC04\uC758 \uAC01\uB3C4\uC640 \uC2DD\uC758 \uACC4\uC218\uAC00 \uB9CC\uB098\uB2E4.|\uACBD\uACC4 \uC591\uCABD\uC744 \uCC28\uB840\uB85C \uBE44\uAD50\uD558\uC790."),"e-10-g":ee("conic-tangent","\uC811\uC810 \uCE58\uD658\uACFC \uC218\uC9C1 \uC811\uC120\uC758 \uC911\uADFC","\uC811\uC120 \uACF5\uC2DD \uB4A4\uC5D0, \uC911\uADFC\uC774 \uC788\uB2E4.|\uACE1\uC120 \uC704 \uC811\uC810\uC744 \uBA3C\uC800 \uC815\uD55C\uB2E4.|\uD55C \uC810\uC5D0\uC11C \uC811\uC120\uC774 \uACE1\uC120\uC5D0 \uB2FF\uB294\uB2E4.|\uC218\uC9C1 \uC811\uC120\uB3C4 \uB193\uCE58\uC9C0 \uC54A\uB294\uB2E4.|\uB300\uC785\uD55C \uC2DD\uC774 \uC644\uC804\uC81C\uACF1\uC774 \uB41C\uB2E4.|\uB2E4\uB978 \uD45C\uD604, \uAC19\uC740 \uC911\uADFC \uC870\uAC74.|\uD559\uC0DD \uC6F9\uC571\uC5D0\uC11C \uC811\uC810\uC744 \uBC14\uAFD4 \uBCF4\uC790."),"a-05-g":ee("dot","\uD68C\uC804\uD558\uB294 \uBCA1\uD130\uC640 \uBD80\uD638 \uC788\uB294 \uC0AC\uC601","\uBC29\uD5A5\uC774 \uBC14\uB00C\uBA74, \uBD80\uD638\uB3C4 \uBC14\uB010\uB2E4.|\uD55C \uBCA1\uD130\uB97C \uAE30\uC900\uC73C\uB85C \uACE0\uC815\uD55C\uB2E4.|\uB2E4\uB978 \uBCA1\uD130\uAC00 \uC9C1\uAC01\uC744 \uC9C0\uB09C\uB2E4.|\uAE38\uC774\uAC00 \uC591\uC218\uC5EC\uB3C4 \uB0B4\uC801\uC740 \uC74C\uC218.|\uC0AC\uC601\uC774 \uAE30\uC900\uC810\uC758 \uB4A4\uB85C \uB118\uC5B4\uAC04\uB2E4.|\uBC29\uD5A5\uACFC \uD06C\uAE30\uB97C \uD55C \uAC12\uC5D0 \uB2F4\uB2E4.|\uAC01\uB3C4\uB97C \uC9C1\uC811 \uBC14\uAFB8\uC5B4 \uBCF4\uC790."),"e-11-g":ee("rotation","\uC810 \uD68C\uC804\uACFC \uC88C\uD45C\uCD95 \uD68C\uC804\uC758 \uAD6C\uBCC4","\uACE1\uC120\uC774 \uB3CC\uAE4C, \uC88C\uD45C\uAC00 \uB3CC\uAE4C.|\uACE0\uC815\uD560 \uB300\uC0C1\uBD80\uD130 \uACE0\uB978\uB2E4.|\uCD95\uC744 \uB3CC\uB9AC\uBA74 \uC88C\uD45C\uAC00 \uB2EC\uB77C\uC9C4\uB2E4.|90\uB3C4\uC5D0\uC11C\uB294 XY\uD56D\uC774 \uC0AC\uB77C\uC9C4\uB2E4.|\uAC19\uC740 \uC810\uC744 \uB450 \uC88C\uD45C\uB85C \uD655\uC778\uD55C\uB2E4.|\uD68C\uC804\uC758 \uBC29\uD5A5\uC774 \uC2DD\uC758 \uBD80\uD638\uB85C.|\uD559\uC0DD\uC758 \uC88C\uD45C\uBCC0\uD658\uC744 \uC0B4\uD3B4\uBCF4\uC790."),"e-08-g":ee("reflection","\uD3EC\uBB3C\uC120\uC758 \uCD08\uC810\uC73C\uB85C \uD5A5\uD558\uB294 \uAD11\uC120","\uD3C9\uD589\uD55C \uBE5B\uC774, \uD55C \uC810\uC73C\uB85C \uBAA8\uC778\uB2E4.|\uCD08\uC810\uACFC \uC811\uC120\uC758 \uBC95\uC120\uC744 \uC138\uC6B4\uB2E4.|\uC785\uC0AC\uD55C \uAD11\uC120\uC774 \uBC29\uD5A5\uC744 \uBC14\uAFBC\uB2E4.|\uAF2D\uC9D3\uC810\uC758 \uACBD\uC6B0\uB3C4 \uB530\uB85C \uBCF8\uB2E4.|\uBC18\uC0AC \uBC29\uD5A5\uACFC \uCD08\uC810\uC744 \uBE44\uAD50\uD55C\uB2E4.|\uAC70\uB9AC \uC870\uAC74\uC5D0\uC11C \uBE5B\uC758 \uACBD\uB85C\uB85C.|\uB2E4\uB978 \uC811\uC810\uC5D0\uC11C \uBE5B\uC744 \uBCF4\uB0B4 \uBCF4\uC790."),"a-01-g":ee("sphere-extreme","\uAD6C \uC704 \uB3D9\uC810\uC758 \uB0B4\uC801\uACFC \uC0AC\uC601 \uADF9\uAC12","\uAD6C \uC704\uC758 \uC810, \uADF8\uB9BC\uC790\uC758 \uC591 \uB05D.|\uC911\uC2EC\uACFC \uBC18\uC9C0\uB984 \uBCA1\uD130\uB97C \uB098\uB208\uB2E4.|\uC810\uC774 \uC6C0\uC9C1\uC774\uBA70 \uC0AC\uC601\uC774 \uB298\uC5B4\uB09C\uB2E4.|\uB2E4\uB978 \uACE1\uBA74\uC5D0 \uADF8\uB300\uB85C \uC62E\uAE38 \uC218 \uC788\uC744\uAE4C.|\uACE0\uC815\uCD95 \uBC29\uD5A5\uC758 \uC591 \uB05D\uC744 \uCC3E\uB294\uB2E4.|\uB0B4\uC801\uC758 \uADF9\uAC12\uC744 \uADF8\uB9BC\uC790\uB85C \uC77D\uB2E4.|\uACE1\uBA74\uC744 \uBC14\uAFB8\uC5B4 \uC9C8\uBB38\uC744 \uC774\uC5B4 \uAC00\uC790."),"a-02-g":ee("sphere-slice","\uAD6C\uC640 \uD3C9\uBA74\uC758 \uAD50\uC120 \uBC0F \uC811\uC810","\uD3C9\uBA74\uC774 \uC9C0\uB098\uAC00\uBA74, \uC6D0\uC774 \uB0A8\uB294\uB2E4.|\uC911\uC2EC\uC5D0\uC11C \uD3C9\uBA74\uAE4C\uC9C0 \uC218\uC120\uC744 \uB0B4\uB9B0\uB2E4.|\uB2E8\uBA74 \uC704 \uC810\uC774 \uC6D0\uC744 \uB530\uB77C \uBAA8\uC778\uB2E4.|\uC811\uD558\uBA74 \uD55C \uC810, \uBC97\uC5B4\uB098\uBA74 \uACF5\uC9D1\uD569.|R\uACFC d\uAC00 \uAC19\uC740 r\uC744 \uACB0\uC815\uD55C\uB2E4.|\uC77C\uC815\uD55C \uAC70\uB9AC\uC5D0\uC11C \uD0DC\uC5B4\uB09C \uC6D0.|\uD3C9\uBA74\uC744 \uC62E\uACA8 \uACBD\uACC4\uB97C \uC0B4\uD3B4\uBCF4\uC790."),"a-11-g":ee("asymptote","\uACE1\uC120\uACFC \uC810\uADFC\uC120 \uC0AC\uC774\uC758 \uAC70\uB9AC","\uBA40\uC5B4\uC9C8\uC218\uB85D, \uC120\uC5D0 \uAC00\uAE4C\uC6CC\uC9C4\uB2E4.|\uACE1\uC120\uACFC \uC9C1\uC120\uC744 \uB530\uB85C \uADF8\uB9B0\uB2E4.|\uC810\uC774 \uBA40\uC5B4\uC9C0\uBA70 \uD2C8\uC774 \uC904\uC5B4\uB4E0\uB2E4.|\uD3EC\uBB3C\uC120\uC5D0\uB294 \uAC19\uC740 \uACB0\uB860\uC744 \uBABB \uC4F4\uB2E4.|\uC704\uCE58\uAC00 \uC544\uB2C8\uB77C \uAC70\uB9AC\uB97C \uBE44\uAD50\uD55C\uB2E4.|\uB05D\uC5D0\uC11C \uB4DC\uB7EC\uB098\uB294 \uBC29\uC815\uC2DD\uC758 \uAD6C\uC870.|\uBA40\uB9AC \uC788\uB294 \uC810\uC5D0\uC11C \uB2E4\uC2DC \uD655\uC778\uD558\uC790."),"e-09-e":ee("compound","\uBCF5\uB9AC\uC758 \uC815\uD655\uD55C \uAE30\uAC04\uACFC \uADFC\uC0AC \uC624\uCC28","72\uB77C\uB294 \uC218\uB294, \uC5BC\uB9C8\uB098 \uAC00\uAE4C\uC6B8\uAE4C.|\uC815\uD655\uD55C \uAE30\uAC04\uACFC \uADFC\uC0AC\uB97C \uB098\uB208\uB2E4.|\uC774\uC728\uB9C8\uB2E4 \uB450 \uACE1\uC120\uC758 \uD2C8\uC774 \uB2EC\uB77C\uC9C4\uB2E4.|\uD55C \uC774\uC728\uC758 \uC77C\uCE58\uB85C \uC77C\uBC18\uD654\uD558\uC9C0 \uC54A\uB294\uB2E4.|\uAC19\uC740 \uAD6C\uAC04\uC5D0\uC11C \uC624\uCC28\uB97C \uBE44\uAD50\uD55C\uB2E4.|\uD3B8\uB9AC\uD55C \uADFC\uC0AC\uC5D0\uB3C4 \uC870\uAC74\uC774 \uC788\uB2E4.|\uC774\uC728\uC744 \uBC14\uAFB8\uC5B4 \uC624\uCC28\uB97C \uC0B4\uD3B4\uBCF4\uC790.")};function rc(n){let t=Ky[n.id];if(!t)throw new Error("\uC7A5\uBA74 \uC124\uACC4\uAC00 \uC5C6\uB294 \uD0D0\uAD6C: "+n.id);return t}var hp=["\uC9C8\uBB38","\uC870\uAC74","\uC2DC\uB3C4","\uB2E4\uC2DC \uBCF4\uAE30","\uAD00\uACC4","\uC815\uB9AC","\uC791\uD488"];function fp(n,{id:t,light:e}){let i="math-scene-"+t,s=i+"-paint",r=i+"-glow",o=n.match(/<style>([\s\S]*?)<\/style>/)?.[1]||"",a=o.replace(/([^{}]+)\{/g,(u,d)=>d.split(",").map(h=>"#"+i+" "+h.trim()).join(",")+"{"),l='<defs><linearGradient id="'+s+'" gradientUnits="userSpaceOnUse" x1="90" y1="50" x2="680" y2="400"><stop stop-color="#ffffff"/><stop offset=".24" stop-color="'+e+'"/><stop offset=".65" stop-color="'+e+'"/><stop offset="1" stop-color="#6c9de9"/></linearGradient><linearGradient id="'+i+'-surface" gradientUnits="userSpaceOnUse" x1="120" y1="70" x2="640" y2="390"><stop stop-color="'+e+'" stop-opacity=".55"/><stop offset=".45" stop-color="'+e+'" stop-opacity=".12"/><stop offset="1" stop-color="#6c9de9" stop-opacity=".25"/></linearGradient><radialGradient id="'+i+'-aura"><stop stop-color="'+e+'" stop-opacity=".12"/><stop offset="1" stop-color="'+e+'" stop-opacity="0"/></radialGradient><filter id="'+r+'" filterUnits="userSpaceOnUse" x="0" y="0" width="760" height="470" color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation="2.2" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>',c="#"+i+" .primary{stroke:url(#"+s+");stroke-width:3.1;filter:url(#"+r+")}#"+i+" .secondary{stroke-width:1.8;opacity:.87}#"+i+" .ghost{stroke:#9cb6dd;opacity:.3;stroke-width:1.2}#"+i+" .wash,#"+i+" .positive-fill,#"+i+" .plane-wash{fill:url(#"+i+"-surface);fill-opacity:.7}#"+i+" .node{fill:#fffaf2;stroke:"+e+";stroke-width:2;filter:url(#"+r+")}#"+i+" .label,#"+i+" .warning-label{font-size:17px;paint-order:stroke;stroke:#0b1729;stroke-width:3px;stroke-linejoin:round}#"+i+" .motion-flow-trail{fill:none;stroke:"+e+";stroke-width:4;stroke-linecap:round;opacity:.8;filter:url(#"+r+")}#"+i+" .motion-beacon-core{fill:#fffdf5;filter:url(#"+r+")}#"+i+" .motion-beacon-halo{fill:"+e+";opacity:.14}";return n=n.replace(/<text([^>]*)>([^<]*)<\/text>/g,(u,d,h)=>h.length>22?"<text"+d.replace('class="','class="long-label ')+">"+h+"</text>":u),n.replace("<svg ",'<svg id="'+i+'" ').replace("<style>"+o+"</style>",l+"<style>"+a+c+'</style><ellipse class="scene-aura" cx="405" cy="225" rx="300" ry="195" fill="url(#'+i+'-aura)" aria-hidden="true"/>')}function jy(n){if(/[^\d\s.,+eE\-mMlLzZ]/.test(n)||(n.match(/[mM]/g)||[]).length!==1)return null;let t=n.match(/[-+]?\d*\.?\d+(?:e[-+]?\d+)?/gi)?.map(Number)||[];if(t.length<4||t.length%2)return null;let e=[];for(let i=0;i<t.length;i+=2)e.push([t[i],t[i+1]]);return/[zZ]\s*$/.test(n)&&e.push([...e[0]]),e}function Qy({type:n,attrs:t}){let e;if(n==="path")e=jy(t.d||"");else if(n==="circle"||n==="ellipse"){if(t.transform)return null;let r=+t.cx,o=+t.cy,a=+(t.rx??t.r),l=+(t.ry??t.r);if(![r,o,a,l].every(Number.isFinite)||a<=0||l<=0)return null;e=Array.from({length:97},(c,u)=>{let d=u/96*Math.PI*2;return[r+a*Math.cos(d),o+l*Math.sin(d)]})}if(!e?.length||e.some(r=>!r.every(Number.isFinite)||r[0]<10||r[0]>750||r[1]<15||r[1]>410))return null;let i=[0];for(let r=1;r<e.length;r++)i.push(i.at(-1)+Math.hypot(e[r][0]-e[r-1][0],e[r][1]-e[r-1][1]));let s=i.at(-1);return s>=95?{points:e,distances:i,length:s}:null}function up(n,t){let e=Math.max(0,Math.min(1,t))*n.length,i=1,s=n.distances.length-1;for(;i<s;){let c=i+s>>1;n.distances[c]<e?i=c+1:s=c}let r=n.points[i-1],o=n.points[i],a=n.distances[i]-n.distances[i-1],l=a?(e-n.distances[i-1])/a:0;return[r[0]+(o[0]-r[0])*l,r[1]+(o[1]-r[1])*l]}function dp(n,t=2){return n.map(Qy).filter(Boolean).sort((e,i)=>i.length-e.length).slice(0,t)}var oc=class{constructor(t,{compact:e=!1}={}){this.svg=t,this.raf=0,this.destroyed=!1,this.elapsed=0,this.compact=e;let i=r=>[...t.querySelectorAll(r)].filter(o=>!o.closest("[transform]")).map(o=>({type:o.tagName.toLowerCase(),attrs:Object.fromEntries([...o.attributes].map(a=>[a.name,a.value]))}));this.routes=dp(i("path.primary,circle.primary,ellipse.primary"),e?1:2),this.routes.length||(this.routes=dp(i("path.secondary,ellipse.secondary"),1)),this.nodes=[],this.pulses=[],this.group=document.createElementNS("http://www.w3.org/2000/svg","g"),this.group.setAttribute("aria-hidden","true"),this.group.setAttribute("data-scene-flow",""),this.group.style.opacity="0",t.append(this.group);let s=(r,o)=>{let a=document.createElementNS(t.namespaceURI,r);return a.setAttribute("class",o),this.group.append(a),a};for(let r of this.routes){let o=s("path","motion-flow-trail"),a=s("circle","motion-beacon-halo"),l=s("circle","motion-beacon-core");a.setAttribute("r",e?"15":"18"),l.setAttribute("r",e?"4.8":"4.2"),this.nodes.push({route:r,trail:o,halo:a,core:l})}if(!this.nodes.length){let r=[...t.querySelectorAll("circle.node")].filter(o=>!o.closest("[transform]"));for(let o of r.slice(0,e?3:5)){let a=s("circle","motion-beacon-halo");a.setAttribute("cx",o.getAttribute("cx")),a.setAttribute("cy",o.getAttribute("cy")),a.setAttribute("r","12"),this.pulses.push(a)}}}start(){if(this.raf||this.destroyed||!this.nodes.length&&!this.pulses.length)return;this.last=0,this.lastDraw=0;let t=e=>{this.destroyed||(this.elapsed+=this.last?Math.min(e-this.last,100):0,this.last=e,e-this.lastDraw>=33&&(this.lastDraw=e,this.draw(this.elapsed)),this.raf=requestAnimationFrame(t))};this.raf=requestAnimationFrame(t)}draw(t){this.group.style.opacity=String(Math.min(1,Math.max(0,(t-1100)/650))),this.pulses.forEach((e,i)=>{let s=(Math.sin(t/1500-i*.9)+1)/2;e.setAttribute("r",(10+s*7).toFixed(2)),e.style.opacity=(.1+s*.25).toFixed(2)}),this.nodes.forEach(({route:e,trail:i,halo:s,core:r},o)=>{let a=((t-1100)/(this.compact?6200:7800)+o*.39)%1;if(a<0)return;let l=up(e,a),c=Math.min(1,a*12,(1-a)*12);for(let d of[s,r])d.setAttribute("cx",l[0].toFixed(2)),d.setAttribute("cy",l[1].toFixed(2)),d.style.opacity=String(c);let u=Array.from({length:10},(d,h)=>up(e,Math.max(0,a-.13)+Math.min(.13,a)*h/9));i.setAttribute("d",u.map((d,h)=>(h?"L":"M")+d.map(f=>f.toFixed(2)).join(" ")).join("")),i.style.opacity=String(c)})}stop(){cancelAnimationFrame(this.raf),this.raf=0,this.last=0,this.group.style.opacity="0"}dispose(){this.stop(),this.destroyed=!0,this.group.remove()}};var tv=n=>String(n).replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t]),an=n=>Number(n.toFixed(3)),Lt=(n,t)=>[380+n*78,254-t*48],uu=(n,t="primary",e="")=>'<path d="'+n+'" class="'+t+'" '+(t==="guide"?"":'data-draw="" pathLength="1" ')+e+"/>",ft=(n,t,e="primary",i="")=>uu("M"+n.map(an).join(" ")+"L"+t.map(an).join(" "),e,i?'data-morph="'+i+'"':""),Ue=(n,t="primary",e=!1,i="")=>uu(n.map((s,r)=>(r?"L":"M")+s.map(an).join(" ")).join(" ")+(e?"Z":""),t,i?'data-morph="'+i+'"':""),Yn=(n,t,e,i="primary")=>'<circle cx="'+an(n)+'" cy="'+an(t)+'" r="'+an(e)+'" class="'+i+'" data-pop=""/>',An=(n,t,e,i,s="primary",r="")=>'<ellipse cx="'+an(n)+'" cy="'+an(t)+'" rx="'+an(e)+'" ry="'+an(i)+'" class="'+s+'" data-pop="" '+r+"/>",St=(n,t="",e=12,i=-12,s="")=>Yn(...n,5,"node").replace('data-pop=""',s?'data-pop="" data-morph="'+s+'"':'data-pop=""')+(t?Xt(t,n[0]+e,n[1]+i):""),Xt=(n,t,e,i="label",s="start")=>'<text x="'+an(t)+'" y="'+an(e)+'" text-anchor="'+s+'" class="'+i+'" data-label="">'+tv(n)+"</text>",Be=(n,t=0)=>'<g data-stage-group="" data-order="'+t+'">'+n+"</g>",_n=(n,t,e="primary",i="")=>{let s=Math.atan2(t[1]-n[1],t[0]-n[0]),r=[t[0]-13*Math.cos(s-.38),t[1]-13*Math.sin(s-.38)],o=[t[0]-13*Math.cos(s+.38),t[1]-13*Math.sin(s+.38)];return ft(n,t,e,i?i+"-shaft":"")+Ue([r,t,o],e,!1,i?i+"-head":"")},se=(n,t=-3,e=3,i="primary",s=Lt)=>{let r="",o=[];for(let a=0;a<=150;a++){let l=t+(e-t)*a/150,c=n(l),u=s(l,c);!Number.isFinite(c)||u[1]<30||u[1]>407?(o.length>1&&(r+=Ue(o,i)),o=[]):o.push(u)}return o.length>1&&(r+=Ue(o,i)),r},ri=()=>Be(ft([68,254],[697,254],"axis")+ft([380,43],[380,402],"axis")+Xt("x",700,245,"tiny")+Xt("y",391,48,"tiny"),0),Ae=(n,t="")=>Xt(n,380,428,"metric","middle")+(t?Xt(t,380,451,"tiny","middle"):""),hu=(n,t,e,i)=>'<g transform="translate(35 45) scale(.46)">'+n+'</g><g transform="translate(375 45) scale(.46)">'+t+"</g>"+Xt(e,207,335,"label","middle")+Xt(i,555,335,"label","middle")+ft([380,78],[380,340],"axis"),pp=(n,t)=>n==="quadratic"?t*t:n==="cubic"?t*t*t/3-t:n==="wave"?-Math.cos(t):t*t*t-3*t;function ev(n=1.8,t=4){let e=n,i=[];for(let s=0;s<t&&!(Math.abs(2*e)<1e-10);s++){let r=e-(e*e-2)/(2*e);i.push({x:e,y:e*e-2,next:r}),e=r}return i}function gp(n){return n.slice(0,-1).map((t,e)=>t*(n.length-e-1))}function mp(n,t){return n.reduce((e,i)=>e*t+i,0)}function nv(n,t){let e=gp(n);return t.slice(0,-1).map((i,s)=>{let r=t[s+1];for(let o=0;o<55;o++){let a=(i+r)/2;mp(e,i)*mp(e,a)<=0?r=a:i=a}return(i+r)/2})}function iv(n){let t=[4,4,12,6,24,40,16][n],e=114,i=347,s=530,r=255,o=s/t,a="";for(let d=0;d<t;d++){let h=(n===3?d+.5:d)/t,f=h*h*r;a+=Be('<rect x="'+an(e+d*o)+'" y="'+an(i-f)+'" width="'+an(o-1)+'" height="'+an(f)+'" class="wash" data-rise=""/>'+ft([e+d*o,i-f],[e+(d+1)*o,i-f],"secondary"),d)}let l=se(d=>d*d,0,1,"primary",(d,h)=>[e+d*s,i-h*r]),c=(t-1)*(2*t-1)/(6*t*t),u=(t+1)*(2*t+1)/(6*t*t);return ft([100,i],[665,i],"axis")+a+Be(l,2)+(n>0?Xt("f(x) = x\xB2",528,76)+Xt("n = "+t,113,76):"")+(n===4||n===5?ft([114,392],[644,392],"secondary")+St([114+c*900,392],"L\u2099",-25,-14)+St([414,392],"1/3",-10,-14)+St([114+u*900,392],"R\u2099",0,-14):"")+Ae(n===3?"\uD45C\uBCF8\uC810 \uBCC0\uACBD \xB7 \uC911\uC810 \uBAA8\uD615":"\uC88C\uD569 "+c.toFixed(4)+"  \u2264  1/3  \u2264  \uC6B0\uD569 "+u.toFixed(4))}function sv(n){let t="",e=[1,3,9,8,16,23,12][n];for(let i=0;i<e;i++){let s=e===1?0:-1+2*i/(e-1),r=Math.sqrt(Math.max(0,1-s*s));t+=Be(An(380,233+s*135,155*r,38*r,"secondary")+(n>1?An(380,233+s*135,155*r,38*r,"wash"):""),i)}return t+=An(380,233,155,147,"ghost"),(n===1||n===4||n===5)&&(t+=ft([380,233],[510,233],"primary")+ft([380,233],[380,135],"guide")+St([380,233],"O")+Xt("r\xB2 = R\xB2 \u2212 x\xB2",428,130)),n===3&&(t+=uu("M230 175 Q380 130 530 175 L530 197 Q380 157 230 197Z","warning-fill")+Xt("\uACE1\uBA74\uC758 \uB760 \u2260 \uC6D0\uD310\uC758 \uB113\uC774",380,63,"warning-label","middle")),t+Ae(n===3?"\uAC89\uB113\uC774\uB294 \uACE1\uBA74\uC758 \uACBD\uC0AC \uD3ED\uC744 \uBC18\uC601\uD55C\uB2E4.":"A(x) = \u03C0(R\xB2 \u2212 x\xB2) \xB7 \uC587\uC740 \uB2E8\uBA74\uC758 \uD569")}function rv(n){let t=(r,o)=>[380+r*123,240-o*75],e=[.8,2,1.2,2,2,2,1.6][n],i="";n>0&&(i+=Ue([t(-2,0),t(-2,-2),t(0,0)],"negative-fill",!0)),i+=Ue([t(0,0),t(e,e),t(e,0)],"positive-fill",!0,"positive-area");let s=ft([78,240],[694,240],"axis")+Be(i,0)+Be(se(r=>r,-2,2,"primary",t),1);return(n===3||n>=4)&&(s+=_n([210,350],[333,375],"secondary")+_n([550,127],[427,375],"primary")+Xt("\u22122",225,301,"label","middle")+Xt("+2",535,180,"label","middle")),s+Ae(n===3?"\uC0C1\uC1C4\uB418\uC5B4\uB3C4 \uC601\uC5ED\uC740 \uB0A8\uB294\uB2E4.":n>=4?"\uC815\uC801\uBD84 = 0    /    \uC804\uCCB4 \uB113\uC774 = 4":"\uAE30\uC900\uC120 \uC704\uB294 +, \uC544\uB798\uB294 \u2212")}function ov(n,t){let e=ri(),i=o=>pp("cubic",o),s="",r="";if(["restore-quadratic","restore","antiderivative"].includes(n)){let o=n==="restore-quadratic"?"quadratic":n==="antiderivative"?"wave":"cubic";i=l=>pp(o,l);let a=t===0?[0]:t===1?[0]:t===2?[-1.5,0,1.5]:t===3?[-2,-1,0,1,2]:t===4?[2]:t===5?[-1.5,0,1.5]:[-.8,.8];for(let[l,c]of a.entries())e+=Be(se(u=>i(u)+c,-2.35,2.35,l===Math.floor(a.length/2)?"primary":"secondary"),l);t===4&&n==="restore-quadratic"&&(s=St(Lt(1,3),"(1, 3)")+Xt("C = 2",543,115)),(t===1||t===4)&&n!=="restore-quadratic"&&(s=se(l=>o==="wave"?Math.sin(l):l*l-1,-2.1,2.1,"guide")+Xt("\uC810\uC120: \uB3C4\uD568\uC218",75,72,"tiny")),r=n==="restore-quadratic"?t===4?"f(1)=3 \u2192 f(x)=x\xB2+2":"\uAC19\uC740 \uB3C4\uD568\uC218 2x \xB7 \uC11C\uB85C \uB2E4\uB978 \uC0C1\uC218 C":n==="antiderivative"?"\uBAA8\uD615: \uB3C4\uD568\uC218 sin x \u2192 \uC6D0\uD568\uC218 \u2212cos x + C":"\uBAA8\uD615: \uB3C4\uD568\uC218 x\xB2\u22121 \u2192 \uC6D0\uD568\uC218 x\xB3/3\u2212x+C"}else if(n==="zoom"||n==="secant"){let o=n==="zoom",a=[1.4,1.2,.5,.15,.1,.04,.3][t],l=.45;i=d=>d*d;let c=o?[2,1.5,.65,1,.2,.09,.4][t]:1,u=(d,h)=>[380+(d-l)/c*135,245-(h-l*l)/c*95];if(e=ft([70,245],[690,245],"axis")+ft([380,53],[380,400],"axis")+se(i,l-c*2.1,l+c*2.1,"primary",u)+se(d=>l*l+2*l*(d-l),l-c*2,l+c*2,"guide",u)+St(u(l,l*l),"A"),o)s=ft(u(l+c,i(l+c)),u(l+c,l*l+2*l*c),"warning")+St(u(l+c,i(l+c)),"\uACE1\uC120")+Xt("\u03B4 = "+c,79,80),r="\uC774\uCC28\uD568\uC218 \uC608\uC2DC \xB7 |h|\u2264\u03B4\uC5D0\uC11C \uCD5C\uB300 \uCC28\uC774 = \u03B4\xB2 = "+(c*c).toFixed(4);else{let d=l+a,h=l+d;s=se(f=>l*l+h*(f-l),-1.8,2.1,"secondary")+St(Lt(d,d*d),"B",12,-12,"secant-point")+ft(Lt(l,0),Lt(d,0),"warning")+Xt("h = "+a,90,80),e=ri()+se(i,-1.7,2.05)+se(f=>l*l+2*l*(f-l),-2,2.5,"guide")+St(Lt(l,l*l),"A"),r=t===3?"h\uB294 0\uC774 \uC544\uB2CC \uC0C1\uD0DC\uB85C \uAC00\uAE4C\uC6CC\uC9C4\uB2E4.":"\uD560\uC120 \uAE30\uC6B8\uAE30 "+h.toFixed(2)+" \u2192 \uC811\uC120 \uAE30\uC6B8\uAE30 "+(2*l).toFixed(2)}}else if(n==="join"){let o=t===0?1.5:0,a=[-.5,-.5,.5,-.8,2,2,2][t];e+=se(l=>l*l,-2.1,1)+se(l=>1+o+a*(l-1),1,3.3,"secondary")+St(Lt(1,1),"s"),t>=2&&(s=ft(Lt(.3,-.4),Lt(1.8,2.6),t<4?"warning":"guide")+Xt("\uC67C\uCABD \uAE30\uC6B8\uAE30 2",80,83)+Xt("\uC624\uB978\uCABD \uAE30\uC6B8\uAE30 "+a,450,83)),t===6&&(s+=St(Lt(1.6,2.2),"\uAC19\uC740 \uAE30\uC6B8\uAE30")),t===5&&(s+=Yn(...Lt(1,1),25,"secondary")+ft(Lt(.8,0),Lt(.8,1),"guide")+ft(Lt(1.2,0),Lt(1.2,1.4),"guide")),r=t===0?"\uBA3C\uC800 \uD568\uC22B\uAC12\uC758 \uB04A\uAE40\uC744 \uBCF8\uB2E4.":t<4?"\uAC12\uC740 \uAC19\uC544\uB3C4 \uAE30\uC6B8\uAE30\uB294 \uB2E4\uB974\uB2E4.":"P(s)=Q(s), P\u2032(s)=Q\u2032(s)"}else if(n==="ratio"){let o=[.65,.8,1.25,.9,1.1,.75,1.05][t];i=a=>o*(a*a*a-3*a),e+=se(i,-1.9,1.9)+[-1,0,1].map(a=>St(Lt(a,i(a)))).join(""),s=ft([302,355],[458,355],"secondary")+Xt("1",341,382)+Xt("1",419,382)+ft([380,345],[380,365],"secondary"),t===3&&(s+=ft(Lt(-1,i(-1)),Lt(0,0),"warning")+Xt("\uC218\uD3C9 \uAC70\uB9AC\uC640 \uC0AC\uC120 \uAE38\uC774\uB294 \uB2E4\uB974\uB2E4.",380,68,"warning-label","middle")),r="\uBAA8\uD615: a(x\xB3\u22123x) \xB7 \uB450 \uADF9\uC810\uC758 \uAC00\uC6B4\uB370\uC5D0 \uBCC0\uACE1\uC810"}else if(n==="mean-value")if(t===3)e+=se(o=>Math.abs(o),-2,2)+ft(Lt(-2,2),Lt(2,2),"secondary")+Yn(...Lt(0,0),18,"warning"),r="\uBC18\uB840 \uBAA8\uD615 |x| \xB7 \uAD6C\uAC04 \uC548\uC5D0\uC11C \uBBF8\uBD84 \uAC00\uB2A5\uD558\uC9C0 \uC54A\uB2E4.";else{let o=[-1,.1,.5,.5,.5,.5,.8][t];i=a=>a*a/2,e+=se(i,-1.6,2.3)+ft(Lt(-1,.5),Lt(2,2),"secondary"),s=se(a=>o*o/2+o*(a-o),-2.5,2.5,"guide")+St(Lt(o,i(o)),"c"),r="\uBAA8\uD615 x\xB2/2, [\u22121,2] \xB7 c=1/2\uC5D0\uC11C \uAC19\uC740 \uAE30\uC6B8\uAE30"}else if(n==="chain"||n==="curvature"){let o=n==="chain"?l=>l*l:l=>l*l*l/2,a=n==="chain"?l=>l*l*l/2:l=>l**4/3;if(t===3||t===4)e=hu(ri()+se(o,-1.7,1.7)+St(Lt(0,0)),ri()+se(a,-1.7,1.7)+St(Lt(0,0)),n==="chain"?"x\xB2 \xB7 \u2212 \u2192 +":"x\xB3 \xB7 f\u2033: \u2212 \u2192 +",n==="chain"?"x\xB3 \xB7 + \u2192 +":"x\u2074 \xB7 f\u2033: + \u2192 +"),r=n==="chain"?"\uB3C4\uD568\uC218\uC758 \uC601\uC810 \uC774\uD6C4, \uBD80\uD638 \uBCC0\uD654\uB97C \uD655\uC778\uD55C\uB2E4.":"\uC774\uACC4\uB3C4\uD568\uC218 0 \uC774\uD6C4, \uBD80\uD638 \uBCC0\uD654\uB97C \uD655\uC778\uD55C\uB2E4.";else{let l=[-1.4,-.8,0,0,.2,.8,1.2][t];i=n==="chain"?u=>u*u*u/2:u=>u*u*u/2;let c=1.5*l*l;e+=se(i,-1.7,1.7)+se(u=>i(l)+c*(u-l),-2,2,"secondary")+St(Lt(l,i(l))),r=n==="chain"?"\uD569\uC131\uD568\uC218 \uB3C4\uD568\uC218\uC758 \uACF1 \xB7 \uC601\uC810\uACFC \uADF9\uAC12\uC740 \uBCC4\uB3C4 \uD310\uC815":"\uBAA8\uD615 x\xB3 \xB7 \uC811\uC120\uC758 \uAE30\uC6B8\uAE30\uAC00 \uC904\uB2E4\uAC00 \uB298\uC5B4\uB09C\uB2E4."}}else{let o=t===6?5:3;i=a=>a*a*a-o*a,e+=se(i,-1.9,1.9),t===1&&(e+=se(a=>3*a*a-o,-1.5,1.5,"guide")),t===4&&(e+=se(a=>3*a*a-o,-1.5,1.5,"secondary")),t===5&&(e+=ft(Lt(0,-3),Lt(0,3),"guide")+St(Lt(0,0))),t>=1&&(s=[-Math.sqrt(o/3),Math.sqrt(o/3)].map(a=>St(Lt(a,i(a)))).join("")),t>=2&&(s+=_n(Lt(-1.8,1),Lt(-1.3,1),"secondary")+_n(Lt(-.6,-.5),Lt(.1,-.5),"warning")+_n(Lt(1.3,-1),Lt(1.8,-1),"secondary")),t===3&&(e=hu(ri()+se(i,-1.9,1.9),ri()+se(a=>a**3/2,-1.8,1.8)+St(Lt(0,0)),"\uADF9\uC810: \uBD80\uD638\uAC00 \uBC14\uB01C","\uC815\uC9C0\uC810: \uBD80\uD638\uAC00 \uC548 \uBC14\uB01C"),s=""),r=t===3?"f\u2032(x)=0\uB9CC\uC73C\uB85C\uB294 \uADF9\uAC12\uC744 \uD310\uB2E8\uD560 \uC218 \uC5C6\uB2E4.":"\uBAA8\uD615 x\xB3\u2212"+o+"x \xB7 \uADF9\uC810\uC758 \uC591\uCABD \uBD80\uD638\uB97C \uC77D\uB294\uB2E4."}return e+Be(s,3)+Ae(r)}function av(n){let t=ri()+se(i=>i*i-2,-1.9,2.45),e=ev(n===0?2.1:1.8,[1,1,3,0,4,5,3][n]);return n===3?t+St(Lt(0,-2),"f\u2032(0)=0")+ft(Lt(-2,-2),Lt(2,-2),"warning")+Ae("\uCD9C\uBC1C\uC810 0 \xB7 \uC811\uC120\uC774 x\uCD95\uACFC \uB9CC\uB098\uC9C0 \uC54A\uB294\uB2E4."):(e.forEach((i,s)=>{t+=Be(Ue([Lt(i.x,i.y),Lt(i.next,0),Lt(i.next,i.next*i.next-2)],s===e.length-1?"primary":"secondary")+St(Lt(i.x,i.y)),s)}),t+Ae("\uBAA8\uD615 x\xB2\u22122 \xB7 x\u2099\u208A\u2081 = x\u2099 \u2212 f(x\u2099)/f\u2032(x\u2099)"))}function lv(n,t){let e=n==="tangent-merge"?[.6,.8,.5,1,1,.7,.4][t]:[.35,.5,.7,1.3,.25,.35,.9][t],i=1,s=l=>2*l*l*l-3*i*l*l+e,r=[];for(let l of[0,1])Math.abs(s(l))<1e-10&&r.push(l);for(let[l,c]of[[-2,0],[0,1],[1,3]]){let u=l,d=c;if(!(s(u)*s(d)>=0)){for(let h=0;h<50;h++){let f=(u+d)/2;s(u)*s(f)<=0?d=f:u=f}r.push((u+d)/2)}}let o=ri()+se(l=>l**3,-1.45,1.6);return(t===0?r.slice(0,1):r).forEach((l,c)=>o+=Be(se(u=>3*l*l*u-2*l**3,-2.5,2.8,"secondary")+St(Lt(l,l**3)),c)),o+=St(Lt(i,e),"P(1, "+e+")",14,24),t===4&&(o+=ft([180,380],[620,380],"axis"),r.forEach(l=>o+=St([340+l*110,380]))),o+Ae(t===3&&n==="tangent-merge"?"\uACBD\uACC4 \xB7 \uC11C\uB85C \uB2E4\uB978 \uC811\uC810 2\uAC1C \xB7 \uD55C \uC811\uC810\uC740 \uC911\uADFC":"\uC11C\uB85C \uB2E4\uB978 \uC811\uC810 "+r.length+"\uAC1C \xB7 2t\xB3\u22123t\xB2+b=0")}function cv(n){let t=[1,2,-67,-68,672,0],e=[-8,-4,0,3,7],i=[e],s=t;for(let a=0;a<4;a++)i.push(nv(s,i.at(-1))),s=gp(s);let r="",o=[1,2,4,2,5,5,4][n];return i.slice(0,o).forEach((a,l)=>{let c=96+l*62;r+=ft([91,c],[665,c],"axis")+Xt(l===0?"f":"f"+"\u2032".repeat(l),50,c+5,"tiny"),a.forEach((u,d)=>{let h=[380+u*30,c];r+=Be(St(h,l===0?String(u):""),l+d),l>0&&(r+=Ue([[380+i[l-1][d]*30,c-62],h,[380+i[l-1][d+1]*30,c-62]],"guide"))})}),n===3&&(r+=Yn(380,96,17,"warning")+Xt("\uC11C\uB85C \uB2E4\uB978 \uC2E4\uADFC \uC870\uAC74",380,309,"warning-label","middle")),r+Ae("\uC608\uC2DC: (x+8)(x+4)x(x\u22123)(x\u22127) \xB7 \uADFC\uC758 \uC704\uCE58\uB97C \uB530\uB85C \uACC4\uC0B0")}function hv(n){let t=[.65,.65,1,.75,1.12,.9,.85][n],e=(o,a)=>[380+o*114*t,235-a*46*t],i=o=>o*(o*o-1),s="",r=(o,a,l)=>Ue([e(o,0),...Array.from({length:51},(c,u)=>{let d=o+(a-o)*u/50;return e(d,i(d))}),e(a,0)],l,!0);return s+=r(-1,0,"positive-fill")+r(0,1,"negative-fill")+se(i,-1.5,1.5,"primary",e)+ft(e(-2,0),e(2,0),"axis"),n>=1&&(s+=Xt("\uC0BC\uCC28\uD568\uC218\uC758 \uD45C\uC900\uD654 \uBAA8\uD615",380,67,"label","middle")),n===3&&(s+=Xt("\uAC19\uC740 \uACBD\uACC4\uB97C \uC720\uC9C0\uD574\uC57C \uAC19\uC740 \uBE44\uC728\uC744 \uBE44\uAD50\uD55C\uB2E4.",380,102,"warning-label","middle")),n>=4&&([4,4,5,3,8,7,1].forEach((o,a)=>s+=Be('<rect x="'+(225+a*44)+'" y="'+(385-o*6)+'" width="27" height="'+o*6+'" class="wash" data-rise=""/>'+Xt(String(o),238+a*44,404,"tiny","middle"),a)),s+=Xt("\uD559\uC0DD \uAE30\uB85D\uC5D0 \uC81C\uC2DC\uD55C \uC77C\uACF1 \uB113\uC774\uBE44 \xB7 \uACBD\uACC4\uC640 \uD568\uAED8 \uC77D\uAE30",380,302,"tiny","middle")),s+Ae("\uC0BC\uCC28\uD568\uC218\uC758 \uAC00\uB85C n \xB7 \uC138\uB85C |a|n\xB3 \u2192 \uB113\uC774 \uACF5\uD1B5 \uBC30\uC728 |a|n\u2074")}function uv(n){let t=a=>a+1,e=a=>(a+1)/(a-1),i=(a,l)=>[110+(a-1)*370,345-l*48],s=(a,l=!1)=>ft([100,345],[650,345],"axis")+ft([110,65],[110,365],"guide")+se(a,1.02,2.45,l?"warning":"primary",i),r=s(n===3?e:t,n===3);return[[],[1.5,1.25],[1.2,1.1,1.05,1.01],[1.5,1.2,1.1],[1.25,1.125,1.0625],[1.4],[1.6,1.05]][n].forEach((a,l)=>r+=Be(St(i(a,n===3?e(a):t(a))),l)),n===5?r=hu(s(t),s(e,!0),"0/0 \u2192 2","2/0\u207A \u2192 +\u221E"):n===3?r+=Xt("(x+1)/(x\u22121)",418,98,"warning-label")+Xt("\uBBF8\uBD84\uD55C \uBE44 1 \u2260 \uC6D0\uB798 \uADF9\uD55C +\u221E",380,78,"warning-label","middle"):r+=Xt("(x\xB2\u22121)/(x\u22121) = x+1",295,82)+ft([110,249],[645,249],"guide")+Yn(110,249,6,"primary"),n===4&&(r+=Ue([[190,325],[325,325],[460,325]],"secondary")+Yn(190,325,17,"secondary")+Yn(325,325,17,"secondary")+Yn(460,325,17,"secondary")),r+Ae(n===3?"2/0\uD615 \xB7 \uAC19\uC740 \uBBF8\uBD84 \uACC4\uC0B0\uC744 \uC801\uC6A9\uD560 \uC218 \uC5C6\uB2E4.":n===5?"\uD615\uD0DC \uD655\uC778 \u2192 \uC801\uC6A9 \uC870\uAC74 \uD655\uC778 \u2192 \uB3C5\uB9BD\uC801\uC778 \uAC80\uC0B0":"0/0\uD615 \xB7 \uC870\uAC74 \uD655\uC778 \uB4A4, \uADF9\uD55C\uAC12 2")}function dv(n){let t=[.2,.7,1.2,1.7,2.2,2.7],e=t.map(l=>.7+.6*l+.09*Math.sin(4*l)),i=(l,c)=>[140+l*170,350-c*110],s=[l=>.7+.6*l,l=>.65*Math.exp(.6*l),l=>2.8/(1+Math.exp(-2*(l-1.2)))],r=ft([115,350],[667,350],"axis")+ft([140,54],[140,368],"axis"),o=n===0||n===5?1:n===1||n===3||n===4?3:2,a=n===3?2:n===5?0:1;return s.slice(0,o).forEach((l,c)=>r+=Be(se(l,0,2.9,c===0?"primary":"secondary",i),c)),t.forEach((l,c)=>{if(r+=St(i(l,e[c])),n>=2&&(r+=ft(i(l,e[c]),i(l,s[a](l)),"warning")),n===4){let u=Math.abs(e[c]-s[1](l))*35;r+='<rect x="'+(174+c*74)+'" y="'+(390-u)+'" width="25" height="'+u+'" class="wash" data-rise=""/>'}}),r+Xt("\uC804\uC2DC \uC124\uBA85\uC744 \uC704\uD55C \uAC00\uC0C1 \uC790\uB8CC",380,68,"tiny","middle")+Ae(n>=4?"\uC794\uCC28 \u2192 \uAC19\uC740 \uC624\uCC28 \uAE30\uC900\uC73C\uB85C \uBE44\uAD50":"\uC77C\uCC28 \xB7 \uC9C0\uC218 \xB7 \uB85C\uC9C0\uC2A4\uD2F1 \uD6C4\uBCF4 \xB7 \uC2E4\uC81C \uCE21\uC815 \uC790\uB8CC \uC544\uB2D8")}var _p=(n=280,t="wash")=>Ue([[148,n+30],[450,n-58],[631,n+25],[330,n+113]],t,!0);function fv(n,t){let e=_p(),i="",s=n==="plane-distance"?[99,137,90,174,122,151,110][t]:99,r=[355-(286-s)*.13,s],o=[355,286];if(n==="line-plane"){let a=t===0||t===1||t===2?0:t===3?1:t===4||t===5?2:1,l=a===0?100:0,c=a===2?83:0;t>=1&&(e+=_n([465,293],[465,100],"secondary")+Xt("n",475,111));let u=t===2?145:l;e+=ft([190,174+c-u],[597,174+c+u],"primary","line-direction")+St([380,174+c],"P",12,-12,"line-anchor"),t===5&&(e+=ft([220,184],[565,184],"warning")+St([440,184],"\uD3C9\uBA74 \uBC16",12,-12)),t===3&&(e+=ft([170,283],[627,283],"guide")),i=["\uAD50\uCC28 \xB7 n\xB7v \u2260 0","\uD3C9\uD589 \xB7 n\xB7v = 0, P\uB294 \uD3C9\uBA74 \uBC16","\uD3EC\uD568 \xB7 n\xB7v = 0, P\uB294 \uD3C9\uBA74 \uC704"][a]}else if(n==="overlap"){let a=[145,110,55,0,0,0,60][t],l=[330+a,176],c=[355+a,286];e+=St(r,"A")+St(l,"B")+ft(r,o,"guide")+ft(l,c,"guide")+St(o,"A\u2032",-30,25)+(a>0?St(c,"B\u2032",12,25):Yn(...o,14,"secondary"))+_n([595,98],[620,210],"secondary"),(t===3||t===4)&&(e+=ft(r,l,"warning")+Xt("\uB2E4\uB978 \uB450 \uC810",375,65,"warning-label","middle")),i=a===0?"\uCC28\uBCA1\uD130\uAC00 \uAD00\uCC30 \uBC29\uD5A5\uACFC \uB098\uB780\uD574\uC838 \uD22C\uC601\uC774 \uACB9\uCE5C\uB2E4.":"\uAD00\uCC30 \uBC29\uD5A5\uC740 \uACE0\uC815 \xB7 \uB450 \uC810\uC758 \uD22C\uC601 \uC704\uCE58\uB97C \uBE44\uAD50"}else{let a=[485,485,560,465,355,355,440][t],l=[a,286+.1*(a-355)];e+=St(r,"P")+St(o,"H",-24,26)+(t>=1?ft(r,o,"guide","distance-drop"):""),n==="minimum"?e+=St(l,"Q",10,20)+ft(r,l,t===4?"secondary":"primary")+ft(o,l,"secondary"):e+=_n(o,[332,110],"secondary","normal-vector")+Xt("\uBC95\uC120 n",402,126)+(t>=2?ft(r,[520,300],"ghost"):""),e+=Ue([[352,265],[371,270],[374,288]],"secondary"),t===3&&(e+=Xt(n==="minimum"?"\uBE57\uBCC0 \u2265 \uC218\uC120":"\uBC95\uC120 \uBCA1\uD130\uB97C \uB2E8\uC704 \uAE38\uC774\uB85C",380,63,"warning-label","middle")),i=n==="minimum"?"PQ\xB2 = PH\xB2 + HQ\xB2 \u2265 PH\xB2":n==="plane-distance"?"\uBC95\uC120 \uBC29\uD5A5 \uC131\uBD84 \xF7 \uBC95\uC120\uC758 \uD06C\uAE30 = \uAC70\uB9AC":"\uD55C \uBC29\uD5A5\uC73C\uB85C \uBD84\uB9AC\uD558\uBA74 \uC218\uC120\uC774 \uB0A8\uB294\uB2E4."}return e+Ae(i)}function pv(n){let t=[170,325],e=[610,105],i=[.3,.3,.65,1.16,.5,.75,.4][n],s=t.map((o,a)=>(1-i)*o+i*e[a]),r=Ue([t,[610,325],e],"guide")+ft(t,e)+St(t,"A",-24,25)+St(e,"B")+St(s,"P",12,25,"space-moving-point");return n>=1&&(r+=Ue([t,[s[0],325],s],"secondary")+Xt("x \xB7 y \xB7 z \uB97C \uAC19\uC740 \uBE44\uC728\uB85C",380,65,"label","middle")),n===3&&(r+=ft(e,s,"warning")),r+Ae("\u03BB = "+i+" \xB7 "+(i>1?"\uC678\uBD84: \uC120\uBD84 \uBC16":"\uB0B4\uBD84: \uC120\uBD84 \uC548"))}function mv(n,t){let r=n==="sphere-slice"?[.2,.45,.65,1.13,.5,.72,.3][t]:n==="dimension"?[0,.25,.5,1,.6,.75,.4][t]:[.2,.4,.7,-.65,.9,1,.45][t],o=Yn(380,224,141,"ghost")+An(380,224,141,39,"ghost")+An(380,224,51,141,"ghost"),a="";if(n==="sphere-extreme"){let l=[2.6,2.1,1.4,.9,.3,0,1][t],c=[380+141*Math.cos(l),224-141*Math.sin(l)],u=[c[0],365];o+=_n([180,365],[580,365],"secondary")+ft([380,224],c)+St(c,"P",12,-12,"sphere-point")+ft(c,u,"guide","sphere-shadow")+St(u,"\uC0AC\uC601",-15,30)+ft([380,365],u,"primary")+St([380,224],"C"),t===3&&(o+=An(380,224,141*1.3,141*.7,"warning")+Xt("\uD0C0\uC6D0\uCCB4\uB85C \uADF8\uB300\uB85C \uD655\uC7A5\uD560 \uC218 \uC788\uC744\uAE4C?",380,54,"warning-label","middle")),a="\uAD6C\uC758 \uBC18\uC9C0\uB984 \uBC29\uD5A5\uC744 \uACE0\uC815\uCD95\uC5D0 \uC815\uC0AC\uC601\uD55C\uB2E4."}else{let l=224-r*141,c=Math.sqrt(Math.max(0,1-r*r))*141;if(o+=_p(l-50,"plane-wash"),r<=1&&(o+=An(380,l,c,c*.26,"primary",'data-morph="slice-ring"')+(t>=2?An(380,l,c,c*.26,"wash"):"")+ft([380,224],[380,l],"guide","slice-depth")+ft([380,l],[380+c,l],"secondary","slice-radius")+ft([380,224],[380+c,l],"secondary","slice-hypotenuse")+St([380,224],"O")+St([380,l],"H",-25,-12),t===2||t===4))for(let u=0;u<8;u++)o+=Be(St([380+c*Math.cos(u*Math.PI/4),l+c*.26*Math.sin(u*Math.PI/4)]),u);t===3&&n==="sphere-slice"&&(o+=Yn(380,83,5,"warning")+Xt("d=R: \uD55C \uC810 / d>R: \uB9CC\uB098\uC9C0 \uC54A\uC74C",380,64,"warning-label","middle")),a=n==="dimension"?"\uD574\uC124 \uBAA8\uD615: \uD55C \uC88C\uD45C \uACE0\uC815 \u2192 \uBC18\uC9C0\uB984 \u221A(R\xB2\u2212d\xB2)\uC758 \uB0AE\uC740 \uCC28\uC6D0 \uAD6C":r>1?"d > R \xB7 \uC2E4\uC218 \uBC18\uC9C0\uB984\uC744 \uAC16\uB294 \uB2E8\uBA74\uC774 \uC5C6\uB2E4.":"d/R = "+r+" \xB7 r/R = "+Math.sqrt(1-r*r).toFixed(3)}return o+Ae(a)}function gv(n){let t=[.15,.3,.85,Math.PI/2,Math.PI/3,.65,.45][n],e=150*Math.cos(t),i=[[230,105],[530,105],[570,105+e],[270,105+e]],s=[[230,290],[530,290],[570,290+e*.4],[270,290+e*.4]],r=Ue(s,"wash",!0,"shadow-face")+Ue(i,"primary",!0,"original-face");return i.forEach((o,a)=>r+=Be(ft(o,s[a],"guide","projection-ray-"+a)+St(o),a)),r+=Xt("\uC6D0\uB798 \uBA74",570,106)+Xt("\uC815\uC0AC\uC601",570,337)+_n([145,130],[145,320],"secondary"),r+Ae("\u03B8 = "+Math.round(t*180/Math.PI)+"\xB0 \xB7 \uADF8\uB9BC\uC790 \uB113\uC774 / \uC6D0\uB798 \uB113\uC774 = "+Math.abs(Math.cos(t)).toFixed(3))}function _v(n,t){let e=n==="conic-boundary",i=n==="focal"&&t>=3||e&&t===2,s=e&&t===3,r=2.25,o=1.45,a=Math.sqrt(r*r-o*o),l=[.4,.7,1.05,.2,1.4,1.1,.55][t],c="",u=Lt(-o,0),d=Lt(o,0);if(s)c=ft(u,d,"warning")+Xt("\uAC70\uB9AC\uC758 \uD569 = \uCD08\uC810 \uC0AC\uC774 \uAC70\uB9AC",380,93,"warning-label","middle");else if(i){c+=se(p=>Math.sqrt(o*o-1.1*1.1)*Math.sqrt(Math.max(0,p*p/(1.1*1.1)-1)),1.1,2.8)+se(p=>-Math.sqrt(o*o-1.1*1.1)*Math.sqrt(Math.max(0,p*p/(1.1*1.1)-1)),1.1,2.8)+se(p=>Math.sqrt(o*o-1.1*1.1)*Math.sqrt(Math.max(0,p*p/(1.1*1.1)-1)),-2.8,-1.1)+se(p=>-Math.sqrt(o*o-1.1*1.1)*Math.sqrt(Math.max(0,p*p/(1.1*1.1)-1)),-2.8,-1.1);let h=[.2,.4,.5,.3,.65,.9,.45][t],f=Lt(1.1*Math.cosh(h),Math.sqrt(o*o-1.1*1.1)*Math.sinh(h));c+=ft(u,f,"secondary")+ft(f,d,"primary")+St(f,"P")}else{c+=An(380,254,r*78,a*48);let h=Lt(r*Math.cos(l),a*Math.sin(l));t>0&&(c+=Be(ft(u,h,"secondary")+ft(h,d,"primary")+St(h,"P"),2))}return c+=St(u,"F\u2081",-12,26)+St(d,"F\u2082",-12,26),c+Ae(s?"\uACBD\uACC4\uC5D0\uC11C\uB294 \uC120\uBD84\uC73C\uB85C \uD1F4\uD654\uD55C\uB2E4.":i?"\uC608\uC2DC \uC30D\uACE1\uC120 \xB7 |PF\u2081\u2212PF\u2082| = \uC77C\uC815":"\uC608\uC2DC \uD0C0\uC6D0 \xB7 PF\u2081+PF\u2082 = \uC77C\uC815")}function xv(n){let t=[.65,.8,.8,.8,.8,1,.65][n],e=[1.2,1.1,.6,-1.2,1.5,1.1,.5][n],i=l=>l*l/(4*t),s=Lt(e,i(e)),r=Lt(0,t),o=Lt(e,-t),a=ri()+se(i,-2.55,2.55)+St(r,"F")+ft(Lt(-3.1,-t),Lt(3.1,-t),"guide")+Xt("\uC900\uC120 y=\u2212p",75,254+t*48+26);return n>=1&&(a+=Be(ft(r,s,"primary")+ft(s,o,"secondary")+St(s,"P")+St(o,"H",8,25),2)),n===3&&(a+=ft(s,Lt(-2,-t),"warning")+Xt("\uC900\uC120 \uC704 \uC784\uC758 \uC810\uAE4C\uC9C0\uC758 \uAC70\uB9AC\uC640\uB294 \uB2E4\uB974\uB2E4.",380,66,"warning-label","middle")),a+Ae("\uCD08\uC810 \uAC70\uB9AC = \uC900\uC120\uAE4C\uC9C0\uC758 \uC218\uC9C1 \uAC70\uB9AC \xB7 x\xB2 = 4py")}function yv(n){let t=[2.25,2.25,2.25,1.3,2.25,2.25,2.25][n],e=1.3,i=Math.sqrt(Math.max(0,t*t-e*e)),s=[.3,.5,1.1,.1,1.8,2.1,.8][n],r=[380+t*95*Math.cos(s),232-i*65*Math.sin(s)],o=[380-e*95,232],a=[380+e*95,232],l=An(380,232,t*95,i*65,"primary",'data-morph="ellipsoid-section"')+An(380,232,t*95,i*24,"ghost")+An(380,232,t*30,i*65,"ghost")+St(o,"F\u2081",-12,25)+St(a,"F\u2082",-12,25);return n>=1&&(l+=Be(ft(o,r,"secondary")+ft(a,r,"primary")+St(r,"P"),2)),n===4&&(l+=An(380,232,t*95,i*30,"secondary",'transform="rotate(-25 380 232)"')),l+Ae(n===3?"a=c \xB7 \uD68C\uC804\uD0C0\uC6D0\uCCB4\uAC00 \uC120\uBD84\uC73C\uB85C \uD1F4\uD654\uD55C\uB2E4.":"\uC608\uC2DC \uD68C\uC804\uD0C0\uC6D0\uCCB4 \xB7 \uB450 \uCD08\uC810\uAE4C\uC9C0 \uAC70\uB9AC\uC758 \uD569 = 2a")}function vv(n,t){let e=n==="cone-discriminant",i=e?[.35,.65,.92,1,1.25,1.15,.7][t]:[0,.4,.7,1,1.28,.9,.3][t],s=.5,r=(l,c,u)=>[380+75*l+35*c,224-70*u+18*c],o="";for(let l of[-1,1]){let c=[];for(let u=0;u<=120;u++){let d=u/120*Math.PI*2;c.push(r(2*Math.cos(d),2*Math.sin(d),2*l))}o+=Ue(c,"ghost");for(let u of[Math.atan2(35,75),Math.atan2(35,75)+Math.PI])o+=ft(r(0,0,0),r(2*Math.cos(u),2*Math.sin(u),2*l),"ghost")}o+=Ue([r(-2,-2,-2*i+s),r(2,-2,2*i+s),r(2,2,2*i+s),r(-2,2,-2*i+s)],"plane-wash",!0,"cut-plane");for(let l of[1,-1]){let c=[];for(let u=0;u<=360;u++){let d=u/360*Math.PI*2,h=l*s/(1-l*i*Math.cos(d));h>0&&h<2?c.push(r(h*Math.cos(d),h*Math.sin(d),l*h)):c.length&&(c.length>1&&(o+=Ue(c)),c=[])}c.length>1&&(o+=Ue(c))}let a=i===0?"\uC6D0":i<1?"\uD0C0\uC6D0":i===1?"\uD3EC\uBB3C\uC120":"\uC30D\uACE1\uC120";return t>=3&&(o+=Xt("\uC808\uB2E8 \uC870\uAC74: "+a,380,47,t===3?"warning-label":"label","middle")),o+Ae(e?"\uC608\uC2DC k=1 \xB7 1\u2212m\xB2 = "+(1-i*i).toFixed(3)+" \xB7 "+a:"\uC6D0\uBFD4\uACFC \uC808\uB2E8\uD3C9\uBA74\uC758 \uAD50\uC120 \xB7 "+a)}function Mv(n){let t=[.65,.65,1.1,0,.55,.8,.3][n],e=2.2,i=1.4,s=Lt(e*Math.cos(t),i*Math.sin(t)),r=[-e*Math.sin(t),i*Math.cos(t)],o=An(380,254,e*78,i*48)+St(s,"P",12,-12,"tangent-point");return n>=1&&(o+=Be(ft([s[0]-r[0]*156,s[1]+r[1]*96],[s[0]+r[0]*156,s[1]-r[1]*96],"secondary"),2)),n===3&&(o+=Xt("x=a \xB7 \uC218\uC9C1 \uC811\uC120",380,75,"warning-label","middle")),n>=4&&(o+=Yn(...s,22,"secondary")+Xt("D=0 \xB7 \uAC19\uC740 \uAD50\uC810\uC774 \uB450 \uBC88",380,354,"label","middle")),o+Ae(n===3?"\uAE30\uC6B8\uAE30\uB85C \uD45C\uD604\uD560 \uC218 \uC5C6\uC5B4\uB3C4 \uC911\uADFC \uC870\uAC74\uC740 \uB0A8\uB294\uB2E4.":"\uD0C0\uC6D0 \uC704 \uC811\uC810 \xB7 xx\u2081/a\xB2 + yy\u2081/b\xB2 = 1")}function Sv(n){let t=[.55,.7,Math.PI/2,2.2,2.6,2.05,1.2][n],e=[320,289],i=[320+210*Math.cos(t),289-170*Math.sin(t)],s=[i[0],289],r=_n(e,[620,289],"secondary")+_n(e,i,"primary","moving-vector")+St(e,"O",-25,25);return n>=1&&(r+=ft(i,s,"guide","vector-drop")+ft(e,s,n>2?"warning":"primary","vector-component")+St(s)),r+=Xt("u",640,294)+Xt("v",i[0]+14,i[1]-14),r+Ae("\u03B8 = "+Math.round(t*180/Math.PI)+"\xB0 \xB7 cos \u03B8 = "+Math.cos(t).toFixed(3)+" \xB7 \uB0B4\uC801 "+(Math.abs(Math.cos(t))<1e-8?"0":t>Math.PI/2?"\uC74C\uC218":"\uC591\uC218"))}function bv(n){let t=[0,Math.PI/12,Math.PI/4,Math.PI/2,Math.PI/4,Math.PI/6,Math.PI/5][n],e=Math.cos(t),i=Math.sin(t),s=ri()+se(l=>l*l,-1.75,1.75,"ghost"),r=Lt(0,0),o=(l,c)=>Lt(e*l-i*c,i*l+e*c);s+=_n(o(-2.5,0),o(2.5,0),"primary","axis-x")+_n(o(0,-2.5),o(0,3.3),"secondary","axis-y");let a=Lt(1,1);return s+=St(a,"\uACE0\uC815\uB41C \uC810")+ft(r,a,"guide"),n>=2&&(s+=Xt("X",...o(2.6,0))+Xt("Y",...o(0,3.5))),s+Ae("\uC88C\uD45C\uCD95 \uD68C\uC804 "+Math.round(t*180/Math.PI)+"\xB0 \xB7 XY \uACC4\uC218 \u2212sin(2\u03B8) = "+(-Math.sin(2*t)).toFixed(3))}function Tv(n){let e=(a,l)=>[380+a*92,340-l*68],i=a=>a*a/3.6,s=e(0,.9),r=se(i,-2.8,2.8,"primary",e)+St(s,"F");return(n===0?[-1.6]:n===1?[-1.6]:n===2?[-2,-1,1,2]:n===3?[0]:[-2.3,-1.2,.8,2]).forEach((a,l)=>{let c=e(a,i(a));if(r+=Be(ft([c[0],57],c,"secondary")+(n>=2?_n(c,s):"")+St(c),l),n===1){let u=a/1.8;r+=ft([c[0]-70,c[1]+70*u*68/92],[c[0]+70,c[1]-70*u*68/92],"guide")}}),r+Ae(n===3?"\uAF2D\uC9D3\uC810\uC5D0\uC11C\uB294 \uC785\uC0AC\uAD11\uACFC \uBC18\uC0AC\uAD11\uC774 \uCD95 \uC704\uC5D0\uC11C \uACB9\uCE5C\uB2E4.":"\uD3EC\uBB3C\uC120\uC758 \uCD95\uACFC \uD3C9\uD589\uD55C \uC785\uC0AC\uAD11 \u2192 \uCD08\uC810 F")}function Ev(n){let t=[1.6,2.1,2.8,2.1,3.7,4.4,2.8][n],e=(o,a)=>[380+o*57,260-a*43],i=ft(e(-4.8,-4.8),e(4.8,4.8),"guide")+ft(e(-4.8,4.8),e(4.8,-4.8),"guide");if(n===3)return i=ri()+se(o=>.5*o*o,-2.5,2.5)+se(o=>o+1,-2.5,2.5,"warning")+Ae("\uD55C \uC9C1\uC120\uACFC \uBA87 \uC810\uC758 \uAC70\uB9AC\uB9CC\uC73C\uB85C \uC77C\uBC18\uD654\uD560 \uC218 \uC5C6\uB2E4."),i;for(let o of[-1,1])for(let a of[-1,1])i+=se(l=>o*Math.sqrt(l*l-1),a<0?-4.6:1,a<0?-1:4.6,"primary",e);let s=e(t,Math.sqrt(t*t-1)),r=e(t,t);return i+=St(s,"\uACE1\uC120",15,16)+ft(s,r,"warning")+St(r,"\uC9C1\uC120",15,-12),i+Ae("\uC608\uC2DC x\xB2\u2212y\xB2=1 \xB7 \uC218\uC9C1 \uD2C8 x\u2212\u221A(x\xB2\u22121) = "+(t-Math.sqrt(t*t-1)).toFixed(4))}function wv(n){let t=r=>Math.log(2)/Math.log(1+r/100),e=(r,o)=>[105+(r-1)*40,367-o*4.3],i=[8,8,4,1.5,12,8,6][n],s=ft([100,367],[694,367],"axis")+se(t,1.1,15,"primary",e)+se(r=>72/r,1.1,15,"guide",e)+St(e(i,t(i)),"\uC815\uD655\uAC12",16,25);if(n>=1&&(s+=ft(e(i,t(i)),e(i,72/i),"warning")+St(e(i,72/i),"72/r",16,-12)),n===4)for(let r of[2,4,6,8,10,12,14])s+=ft(e(r,t(r)),e(r,72/r),"warning");return s+Ae("r="+i+"% \xB7 \uC815\uD655 "+t(i).toFixed(3)+"\uB144 / 72\uC758 \uBC95\uCE59 "+(72/i).toFixed(3)+"\uB144")}function Av(n){let t=[-.9,-.9,.2,.7,.7,-.4,.3][n],e=(o,a,l)=>[380+o*80+a*35,320+a*30-l*18],i=(o,a)=>o*o+2*a*a,s="";for(let o=-2;o<=2;o+=.4){let a=[];for(let l=-2.1;l<=2.1;l+=.06)a.push(e(l,o,i(l,o)));s+=Ue(a,"ghost")}for(let o=-2;o<=2;o+=.4){let a=[];for(let l=-2;l<=2;l+=.06)a.push(e(o,l,i(o,l)));s+=Ue(a,"ghost")}let r=[];for(let o=-2.1;o<=2.1;o+=.05)r.push(e(o,t,i(o,t)));if(s+=Be(Ue(r),2),n>=1&&(s+=Ue([e(-2.2,t,-1),e(2.2,t,-1),e(2.2,t,8),e(-2.2,t,8)],"plane-wash",!0,"slice-plane")),n>=4){let a=e(.85,t,i(.85,t)),l=2*.85;s+=ft(e(-.5,t,i(.85,t)+l*(-.5-.85)),e(2,t,i(.85,t)+l*(2-.85)),"secondary","slice-tangent")+St(a)}return s+Ae("z=x\xB2+2y\xB2 \xB7 y="+t+"\uB97C \uACE0\uC815\uD55C \uB2E8\uBA74 \xB7 x \uBC29\uD5A5 \uAE30\uC6B8\uAE30 2x")}function xp(n,t){let e=rc(n),i=Math.max(0,Math.min(6,Math.trunc(t))),s=e.family,r;if(["zoom","secant","join","ratio","mean-value","chain","curvature","extrema","restore","restore-quadratic","antiderivative"].includes(s))r=ov(s,i);else if(["line-plane","overlap","minimum","plane-distance"].includes(s))r=fv(s,i);else if(["sphere-slice","sphere-extreme","dimension"].includes(s))r=mv(s,i);else if(["focal","conic-boundary"].includes(s))r=_v(s,i);else if(["cone-cut","cone-discriminant"].includes(s))r=vv(s,i);else if(["tangents","tangent-merge"].includes(s))r=lv(s,i);else{let u={riemann:iv,volume:sv,signed:rv,newton:av,rolle:cv,"area-scale":hv,limits:uv,model:dv,"space-points":pv,projection:gv,parabola:xv,ellipsoid:yv,"conic-tangent":Mv,dot:Sv,rotation:bv,reflection:Tv,asymptote:Ev,compound:wv,surface:Av};if(!u[s])throw Error("\uB3C4\uD574\uAC00 \uC5C6\uB294 \uC7A5\uBA74 "+s);r=u[s](i)}let o={calculus:"#ffb47f",geometry:"#b5c5ff",economics:"#91e5c6"}[n.subjectKey]||"#b5c5ff",a='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 760 470" aria-hidden="true" focusable="false" data-family="'+s+'" data-phase="'+i+'"><style>.primary,.secondary,.guide,.axis,.ghost,.warning{fill:none;stroke-linecap:round;stroke-linejoin:round}.primary{stroke:'+o+";stroke-width:2.5}.secondary{stroke:#e2ebfa;stroke-width:1.5;opacity:.8}.guide{stroke:#a5b3cd;stroke-width:1.2;stroke-dasharray:5 7;opacity:.7}.axis{stroke:#a5b3cd;stroke-width:.8;opacity:.25}.ghost{stroke:#b6c4df;stroke-width:1;opacity:.23}.warning{stroke:#ffd593;stroke-width:2;stroke-dasharray:4 5}.node{fill:"+o+";stroke:#fff4e5;stroke-width:1.1}.wash{fill:"+o+";fill-opacity:.12;stroke:"+o+";stroke-width:1}.plane-wash{fill:#b5c5ff;fill-opacity:.07;stroke:#c1cbdf;stroke-opacity:.4;stroke-width:1}.positive-fill{fill:"+o+";fill-opacity:.26;stroke:"+o+';stroke-width:1}.negative-fill{fill:#86b2ef;fill-opacity:.27;stroke:#86b2ef;stroke-width:1}.warning-fill{fill:#ffd593;fill-opacity:.25;stroke:#ffd593;stroke-width:1}.label,.metric,.tiny,.warning-label{font-family:"Malgun Gothic","Apple SD Gothic Neo",sans-serif;fill:#e3ebfa;font-weight:400}.label{font-size:15px}.metric{font-size:15px;fill:#f5f6fb}.tiny{font-size:12px;fill:#a9bad5}.warning-label{font-size:15px;fill:#ffd593}</style>'+r+"</svg>",c=(r.match(/class="metric"[^>]*>([^<]+)</)?.[1]||e.focus).replace(/&amp;/g,"&").replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&quot;/g,'"').replace(/&#39;/g,"'");return{svg:fp(a,{id:n.id+"-"+i,light:o}),phase:i,family:s,headline:e.beats[i],focus:e.focus,annotation:c}}var yp=n=>String(n).replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t]),Cv=new Set(["zoom","dimension","sphere-slice","surface"]),vp=new Set(["riemann","volume","rolle","newton","space-points","reflection"]),Rv=new Set(["projection","rotation","dot","cone-cut","cone-discriminant","ellipsoid"]),ac=class{constructor(t,e,{motion:i=!0,onPlaybackChange:s=()=>{}}={}){this.host=t,this.work=e,this.enabled=i,this.phase=-1,this.animations=[],this.destroyed=!1,this.paused=!1,this.onPlaybackChange=s,this.caption=t.closest(".motion-theater")?.querySelector(".scene-live-caption"),this.visible=typeof IntersectionObserver!="function",this.presented=-1,this.visibilityHandler=()=>{document.hidden?this.finish():this.present()},document.addEventListener("visibilitychange",this.visibilityHandler),typeof IntersectionObserver=="function"&&(this.observer=new IntersectionObserver(r=>{this.visible=!!r[0]?.isIntersecting,this.visible?this.present():this.finish()},{threshold:.08}),this.observer.observe(t)),t.dataset.renderer="motion-svg"}get playing(){return this.enabled&&!this.paused}present(){this.destroyed||!this.visible||!this.playing||document.hidden||this.phase<0||(this.presented!==this.phase?this.setPhase(this.phase,{replay:!0}):this.flow?.start())}finish(){this.flow?.stop(),this.animations.forEach(t=>{t.pause(),t.revert()}),this.animations=[],this.host.querySelectorAll("[data-outgoing]").forEach(t=>t.remove()),this.host.querySelectorAll("[data-draw]").forEach(t=>{t.style.removeProperty("stroke-dasharray"),t.style.removeProperty("stroke-dashoffset")}),this.host.classList.remove("is-playing")}setMotion(t){t!==this.enabled&&(this.enabled=t,t?this.present():this.finish(),this.onPlaybackChange(this.playing))}setPlaying(t){this.paused=!t,t?this.present():this.finish(),this.onPlaybackChange(this.playing)}setPhase(t,{replay:e=!1}={}){if(this.destroyed)return;let i=Math.max(0,Math.min(6,Math.trunc(t)));if(i===this.phase&&!e)return;this.finish(),this.flow?.dispose(),this.flow=null;let s=this.host.querySelector(".motion-frame"),r=this.phase,o=i>=r?1:-1,a=xp(this.work,i),l=document.createElement("div");l.className="motion-frame",l.innerHTML='<div class="motion-stage-copy"><p class="motion-kicker"><span>'+String(i+1).padStart(2,"0")+"</span> "+hp[i]+"</p><h3>"+yp(a.headline)+'</h3><div class="motion-focus"><span></span><p>'+yp(a.focus)+'</p></div><small>\uC804\uC2DC \uD574\uC124 \xB7 \uC608\uC2DC \uBAA8\uD615</small></div><div class="motion-camera"><div class="motion-illustration">'+a.svg+"</div></div>",this.phase=i,this.host.dataset.phase=String(i),this.host.dataset.family=a.family,this.host.setAttribute("aria-label",a.headline+" "+a.focus+"\uC5D0 \uB300\uD55C \uC804\uC2DC \uD574\uC124\uC6A9 \uB3C4\uD574"),s&&(s.setAttribute("data-outgoing",""),s.setAttribute("aria-hidden","true"),this.enabled||s.remove()),this.host.append(l),this.flow=new oc(l.querySelector("svg"),{compact:matchMedia("(max-width: 780px)").matches});let c=this.caption;if(c&&(c.textContent=a.annotation),!this.playing||document.hidden||!this.visible)return;this.presented=i,this.host.classList.add("is-playing"),this.flow.start();let u=(_,m)=>{if(!_||_.length===0)return;let g=Hs(_,m);return this.animations.push(g),g},d=0;s&&!e&&l.querySelectorAll("[data-morph]").forEach(_=>{let m=s.querySelector('[data-morph="'+_.dataset.morph+'"]');if(!m||m.tagName!==_.tagName)return;let g={};for(let S of["d","cx","cy","r","rx","ry","x","y","width","height"]){let A=m.getAttribute(S),v=_.getAttribute(S);A===null||v===null||A===v||S==="d"&&(A.replace(/[-+\d.e]+/gi,"")!==v.replace(/[-+\d.e]+/gi,"")||(A.match(/[-+]?\d*\.?\d+(?:e[-+]?\d+)?/gi)||[]).length!==(v.match(/[-+]?\d*\.?\d+(?:e[-+]?\d+)?/gi)||[]).length)||(g[S]=[A,v])}Object.keys(g).length&&(u(_,{...g,duration:1250,ease:"inOut(3)"}),d++)}),this.host.dataset.morphs=String(d),s&&u(s,{opacity:[1,0],translateX:[0,-o*50],duration:240,ease:"in(2)",onComplete:()=>s.remove()}),u(l,{opacity:[0,1],translateX:[o*34,0],duration:560,ease:"out(3)"}),u(l.querySelector(".motion-stage-copy h3"),{opacity:[0,1],translateY:[18,0],duration:650,delay:100,ease:"out(4)"});let h=l.querySelector(".motion-illustration");Cv.has(a.family)?u(h,{scale:[i===0?1.23:o>0?1.13:.91,1],duration:1150,ease:"out(4)"}):Rv.has(a.family)&&u(h,{rotate:[o*-4,0],scale:[.94,1],duration:1100,ease:"out(4)"});let f=l.querySelectorAll("[data-stage-group]");u(f,{opacity:[0,1],translateY:[vp.has(a.family)?24:10,0],delay:wi(vp.has(a.family)?45:28,{start:160}),duration:680,ease:"out(3)"});let p=l.querySelectorAll(".primary[data-draw],.secondary[data-draw]");p.forEach(_=>{_.style.strokeDasharray="1",_.style.strokeDashoffset="1"}),u(p,{strokeDashoffset:[1,0],delay:wi(35,{start:200}),duration:950,ease:"inOut(3)"}),u(l.querySelectorAll(".node[data-pop]"),{opacity:[0,1],scale:[.2,1],delay:wi(45,{start:420}),duration:560,ease:"out(3)"}),u(l.querySelectorAll("[data-label]"),{opacity:[0,1],delay:wi(18,{start:530}),duration:480,ease:"out(2)"}),u(l.querySelectorAll(".wash[data-rise],.positive-fill,.negative-fill"),{opacity:[0,1],scaleY:[.15,1],delay:wi(30,{start:240}),duration:880,ease:"out(3)"})}replay(){this.enabled&&(this.paused=!1,this.onPlaybackChange(this.playing),this.setPhase(this.phase,{replay:!0}))}dispose(){this.destroyed=!0,this.finish(),this.flow?.dispose(),this.flow=null,this.observer?.disconnect(),document.removeEventListener("visibilitychange",this.visibilityHandler),this.host.replaceChildren()}};function Pv(n,t,e,i,s,r=i,o=s){let a=Math.min(3,Math.max(1,Number.isFinite(n)?n:1)),l=Math.max(0,(r*a-i)/2),c=Math.max(0,(o*a-s)/2);return{scale:a,x:Math.max(-l,Math.min(l,t||0)),y:Math.max(-c,Math.min(c,e||0))}}var lc=class{constructor({host:t,launch:e,title:i,onStep:s,onTogglePlay:r=()=>{},getPlaying:o=()=>!0}){this.host=t,this.launch=e,this.onStep=s,this.getPlaying=o,this.caption=t.closest(".motion-theater")?.querySelector(".scene-live-caption"),this.isOpen=!1,this.view={scale:1,x:0,y:0},this.listeners=[],this.pointers=new Map,this.dialog=document.createElement("dialog"),this.dialog.className="diagram-dialog",this.dialog.setAttribute("aria-label","\uD0D0\uAD6C \uB3C4\uD574 \uD06C\uAC8C \uBCF4\uAE30"),this.dialog.setAttribute("aria-modal","true"),this.dialog.innerHTML='<div class="diagram-shell"><header class="diagram-header"><div><p>\uC218\uD559 \uB3C4\uD574 \uD06C\uAC8C \uBCF4\uAE30</p><h2></h2></div><button type="button" data-viewer-close aria-label="\uB3C4\uD574 \uD06C\uAC8C \uBCF4\uAE30 \uB2EB\uAE30">\uB2EB\uAE30 <span aria-hidden="true">\xD7</span></button></header><div class="diagram-surface" tabindex="0" aria-label="\uD655\uB300\uD558\uBA74 \uBC00\uC5B4\uC11C \uB3C4\uD574\uB97C \uC774\uB3D9\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4"><div class="diagram-mount"></div></div><div class="diagram-zoom-tools" role="group" aria-label="\uB3C4\uD574 \uD655\uB300 \uCD95\uC18C"><button type="button" data-zoom-out aria-label="\uB3C4\uD574 \uCD95\uC18C">\u2212</button><button type="button" data-zoom-reset aria-label="\uB3C4\uD574 \uD06C\uAE30\uC640 \uC704\uCE58 \uCD08\uAE30\uD654">100%</button><button type="button" data-zoom-in aria-label="\uB3C4\uD574 \uD655\uB300">\uFF0B</button><p>\uB450 \uC190\uAC00\uB77D\uC73C\uB85C \uD655\uB300 \xB7 \uBC00\uC5B4\uC11C \uC774\uB3D9</p></div><nav class="diagram-navigation" aria-label="\uD655\uB300 \uB3C4\uD574 \uC7A5 \uB118\uAE30\uAE30"><button type="button" data-viewer-previous>\u2190 \uC774\uC804</button><span data-viewer-position aria-live="polite"></span><button type="button" data-viewer-next>\uB2E4\uC74C \u2192</button></nav></div>',this.dialog.querySelector("h2").textContent=i,document.getElementById("main").append(this.dialog);let a=document.createElement("p");a.id="diagramDescription",a.className="diagram-description",this.dialog.append(a),this.dialog.setAttribute("aria-describedby","diagramDescription");let l=this.dialog.querySelector("[data-viewer-close]"),c=document.createElement("div");c.className="diagram-header-actions",l.before(c);let u=document.createElement("button");u.type="button",u.dataset.viewerPlay="",u.setAttribute("aria-label","\uB3C4\uD574 \uC560\uB2C8\uBA54\uC774\uC158 \uC7AC\uC0DD \uB610\uB294 \uC77C\uC2DC\uC815\uC9C0"),c.append(u,l),this.updatePlayback(),this.surface=this.dialog.querySelector(".diagram-surface"),this.mount=this.dialog.querySelector(".diagram-mount");let d=(p,_,m,g)=>{p.addEventListener(_,m,g),this.listeners.push(()=>p.removeEventListener(_,m,g))};d(e,"click",()=>this.open()),d(this.dialog.querySelector("[data-viewer-close]"),"click",()=>this.close()),d(u,"click",()=>{r(),this.updatePlayback()}),d(this.dialog,"cancel",p=>{p.preventDefault(),this.close()}),d(this.dialog,"close",()=>this.restore()),d(this.dialog.querySelector("[data-viewer-previous]"),"click",()=>this.onStep(-1)),d(this.dialog.querySelector("[data-viewer-next]"),"click",()=>this.onStep(1)),d(this.dialog.querySelector("[data-zoom-in]"),"click",()=>this.zoom(this.view.scale*1.4)),d(this.dialog.querySelector("[data-zoom-out]"),"click",()=>this.zoom(this.view.scale/1.4)),d(this.dialog.querySelector("[data-zoom-reset]"),"click",()=>this.reset()),d(this.surface,"wheel",p=>{this.isOpen&&(p.preventDefault(),this.zoom(this.view.scale*Math.exp(-p.deltaY*.002),p.clientX,p.clientY))},{passive:!1}),d(this.surface,"pointerdown",p=>{if(!(!this.isOpen||p.button>0)){this.pointers.set(p.pointerId,{x:p.clientX,y:p.clientY});try{this.surface.setPointerCapture(p.pointerId)}catch{}this.rebase()}}),d(this.surface,"pointermove",p=>{if(!this.pointers.has(p.pointerId))return;this.pointers.set(p.pointerId,{x:p.clientX,y:p.clientY});let _=[...this.pointers.values()];if(_.length>=2&&this.gesture?.distance){let[m,g]=_,S=this.gesture.scale*Math.hypot(m.x-g.x,m.y-g.y)/this.gesture.distance,A=this.surface.getBoundingClientRect(),v=Math.min(3,Math.max(1,S))/this.gesture.scale,b=(m.x+g.x)/2-A.left-A.width/2,T=(m.y+g.y)/2-A.top-A.height/2;this.apply(S,b-(this.gesture.mx-this.gesture.x)*v,T-(this.gesture.my-this.gesture.y)*v)}else _.length===1&&this.gesture&&this.apply(this.view.scale,this.gesture.x+_[0].x-this.gesture.px,this.gesture.y+_[0].y-this.gesture.py)});let h=p=>{this.pointers.delete(p.pointerId),this.rebase()};d(this.surface,"pointerup",h),d(this.surface,"pointercancel",h),d(this.surface,"lostpointercapture",h),d(this.dialog,"keydown",p=>{p.target.closest("button")||(p.key==="+"||p.key==="="?(p.preventDefault(),this.zoom(this.view.scale*1.4)):p.key==="-"&&(p.preventDefault(),this.zoom(this.view.scale/1.4)))});let f=()=>{this.isOpen&&this.apply(this.view.scale,this.view.x,this.view.y)};d(window,"resize",f),window.visualViewport&&d(window.visualViewport,"resize",f)}rebase(){let t=[...this.pointers.values()],e=this.surface.getBoundingClientRect();this.gesture=t.length?{...this.view,px:t[0].x,py:t[0].y}:null,t.length>=2&&Object.assign(this.gesture,{distance:Math.hypot(t[0].x-t[1].x,t[0].y-t[1].y),mx:(t[0].x+t[1].x)/2-e.left-e.width/2,my:(t[0].y+t[1].y)/2-e.top-e.height/2})}apply(t,e,i){let s=this.host.querySelector(".motion-frame:not([data-outgoing]) .motion-camera");if(!s)return;let r=this.surface.getBoundingClientRect(),o=s.offsetWidth||r.width||1,a=s.offsetHeight||r.height||1;this.view=Pv(t,e,i,r.width||1,r.height||1,o,a),s.style.transform="translate("+this.view.x+"px,"+this.view.y+"px) scale("+this.view.scale+")",this.dialog.querySelector("[data-zoom-reset]").textContent=Math.round(this.view.scale*100)+"%",this.dialog.querySelector("[data-zoom-out]").disabled=this.view.scale<=1,this.dialog.querySelector("[data-zoom-in]").disabled=this.view.scale>=3,this.surface.classList.toggle("is-zoomed",this.view.scale>1)}zoom(t,e,i){let s=this.surface.getBoundingClientRect(),r=(e??s.left+s.width/2)-s.left-s.width/2,o=(i??s.top+s.height/2)-s.top-s.height/2,a=Math.min(3,Math.max(1,t)),l=a/this.view.scale;this.apply(a,r-(r-this.view.x)*l,o-(o-this.view.y)*l)}reset(){this.view={scale:1,x:0,y:0},this.isOpen&&this.apply(1,0,0)}updatePlayback(){let t=this.dialog.querySelector("[data-viewer-play]");if(!t)return;let e=this.getPlaying();t.textContent=e?"\u2161":"\u25B7",t.setAttribute("aria-pressed",String(!e))}update(t,e){this.index=t,this.dialog.querySelector("[data-viewer-position]").textContent=String(t+1).padStart(2,"0")+" / 07 \xB7 "+e,this.dialog.querySelector("[data-viewer-previous]").disabled=t===0,this.dialog.querySelector("[data-viewer-next]").disabled=t===6,this.dialog.querySelector(".diagram-description").textContent=(this.host.getAttribute("aria-label")||"")+" "+(this.caption?.textContent||""),this.reset()}open(){this.isOpen||(this.isOpen=!0,this.previousFocus=document.activeElement,this.placeholder=document.createElement("div"),this.placeholder.className="diagram-placeholder",this.placeholder.style.height=Math.max(1,this.host.getBoundingClientRect().height)+"px",this.host.before(this.placeholder),this.mount.append(this.host),document.body.classList.add("diagram-open"),typeof this.dialog.showModal=="function"?this.dialog.showModal():this.dialog.setAttribute("open",""),this.reset(),this.updatePlayback(),this.dialog.querySelector("[data-viewer-close]").focus())}restore(t=!0){this.isOpen&&(this.isOpen=!1,this.host.querySelectorAll(".motion-camera").forEach(e=>e.style.removeProperty("transform")),this.placeholder?.replaceWith(this.host),this.placeholder=null,document.body.classList.remove("diagram-open"),this.pointers.clear(),this.gesture=null,t&&this.previousFocus?.isConnected&&this.previousFocus.focus({preventScroll:!0}))}close({focus:t=!0}={}){this.isOpen&&(this.restore(t),typeof this.dialog.close=="function"?this.dialog.close():this.dialog.removeAttribute("open"))}dispose(){this.close({focus:!1}),this.listeners.forEach(t=>t()),this.dialog.remove()}};var oi={calculus:{label:"\uBBF8\uC801\uBD84\u2160",mark:"f\u2032",title:"\uBCC0\uD654\uB97C \uC77D\uB2E4.",description:"\uAC00\uAE4C\uC6CC\uC9C0\uB294 \uAC12, \uC21C\uAC04\uC758 \uAE30\uC6B8\uAE30, \uC313\uC774\uB294 \uC591\uC5D0\uC11C \uC9C8\uBB38\uC744 \uCC3E\uC2B5\uB2C8\uB2E4.",kind:"secant",color:"#bf4630",light:"#ffe3c6",hue:.055},geometry:{label:"\uAE30\uD558",mark:"\u2220",title:"\uACF5\uAC04\uC744 \uBCF4\uB2E4.",description:"\uAC70\uB9AC\uC640 \uBC29\uD5A5, \uD3C9\uBA74\uACFC \uC785\uCCB4 \uC0AC\uC774\uC5D0\uC11C \uBCF4\uC774\uC9C0 \uC54A\uB358 \uAD00\uACC4\uB97C \uBC1C\uACAC\uD569\uB2C8\uB2E4.",kind:"ellipsoid",color:"#4c5fd0",light:"#d5dcff",hue:.63},economics:{label:"\uACBD\uC81C\uC218\uD559",mark:"%",title:"\uC120\uD0DD\uC744 \uB530\uC9C0\uB2E4.",description:"\uC218\uC640 \uBAA8\uD615\uC73C\uB85C \uC77C\uC0C1\uC758 \uC120\uD0DD\uACFC \uADFC\uC0AC\uC758 \uC624\uCC28\uB97C \uC0B4\uD3B4\uBD05\uB2C8\uB2E4.",kind:"compound",color:"#12735d",light:"#c5efdf",hue:.43}},ki=n=>n.id.slice(0,4);function du(n,t="all",e="all"){return n.filter(i=>(t==="all"||i.subjectKey===t)&&(e==="all"||ki(i)===e))}function Mp(n,t=7){return Math.min(t-1,Math.max(0,Number.isFinite(n)?Math.trunc(n):0))}function Sp(n,t){return Math.abs(n)>=70&&Math.abs(n)>Math.abs(t)*1.5?n<0?1:-1:0}function fu(n){try{let t=new URL(n?.url);return t.protocol==="https:"&&!t.username&&!t.password?t.href:null}catch{return null}}function cc(n,t=360){let e=String(n||"").trim();if(e.length<=t)return e;let i=e.lastIndexOf("\uB2E4.",t);return i<t*.55?i=t-1:i+=1,e.slice(0,i+1)+"\u2026"}function bp(n){let t=n.raw;return[{key:"question",label:"\uC9C8\uBB38",title:"\uBB34\uC5C7\uC774 \uAD81\uAE08\uD588\uC744\uAE4C.",intro:n.question,primary:t.hypothesis,fields:[["\uCC98\uC74C \uC138\uC6B4 \uC608\uC0C1",t.hypothesis]]},{key:"method",label:"\uBC29\uBC95",title:"\uC5B4\uB5BB\uAC8C \uC54C\uC544\uBCF4\uAE30\uB85C \uD588\uC744\uAE4C.",intro:"\uAC19\uAC8C \uB458 \uAC83\uACFC \uBC14\uAFC0 \uAC83. \uD559\uC0DD\uC774 \uC120\uD0DD\uD55C \uBC29\uBC95\uC744 \uC77D\uC2B5\uB2C8\uB2E4.",primary:t.plan||t.conditions,fields:[["\uD0D0\uAD6C \uACC4\uD68D",t.plan],["\uBC14\uAFC0 \uC870\uAC74\uACFC \uC790\uB8CC",t.conditions]]},{key:"process",label:"\uC218\uD589",title:"\uC5B4\uB5A4 \uC2DC\uB3C4\uB97C \uD588\uC744\uAE4C.",intro:"\uC544\uB798 \uB0B4\uC6A9\uC740 \uD559\uC0DD\uC774 \uC800\uC7A5\uD55C \uC218\uD589 \uAE30\uB85D\uC785\uB2C8\uB2E4.",primary:t.process,fields:[["\uC218\uD589 \uACFC\uC815",t.process]]},{key:"revision",label:"\uC218\uC815",title:"\uC0DD\uAC01\uC744 \uBC14\uAFBC \uC21C\uAC04.",intro:"\uB73B\uB300\uB85C \uB418\uC9C0 \uC54A\uC558\uB358 \uC7A5\uBA74\uACFC, \uADF8\uB2E4\uC74C\uC758 \uC120\uD0DD\uC744 \uC77D\uC2B5\uB2C8\uB2E4.",primary:t.revision,fields:[["\uC2E4\uD328\uC640 \uC218\uC815",t.revision]]},{key:"evidence",label:"\uADFC\uAC70",title:"\uBB34\uC5C7\uC744 \uADFC\uAC70\uB85C \uB0A8\uACBC\uC744\uAE4C.",intro:"\uACC4\uC0B0\uACFC \uAD00\uCC30, \uC2E4\uD589\uACFC \uD574\uC11D\uC744 \uD559\uC0DD\uC758 \uAE30\uB85D\uC5D0\uC11C \uD655\uC778\uD569\uB2C8\uB2E4.",primary:t.evidence,fields:[["\uACB0\uACFC\uC640 \uADFC\uAC70",t.evidence],["\uC218\uD559\uC801 \uD574\uC11D",t.interpretation]]},{key:"conclusion",label:"\uACB0\uB860",title:"\uC54C\uAC8C \uB41C \uAC83\uACFC, \uB0A8\uC740 \uAC83.",intro:"\uD558\uB098\uC758 \uACB0\uB860\uC774 \uB2E4\uC74C \uC9C8\uBB38\uC758 \uCD9C\uBC1C\uC810\uC774 \uB429\uB2C8\uB2E4.",primary:t.conclusion,fields:[["\uACB0\uB860",t.conclusion],["\uD55C\uACC4\uC640 \uC8FC\uC758\uD560 \uC810",t.limits],["\uC0C8\uB85C\uC6B4 \uC9C8\uBB38",t.next]]},{key:"artifact",label:"\uC791\uD488",title:"\uC774\uC81C, \uC791\uD488 \uC55E\uC73C\uB85C.",intro:"\uD559\uC0DD\uC774 \uB9CC\uB4E0 \uC6F9\uC571\uC744 \uC6D0\uB798 \uBAA8\uC2B5\uC73C\uB85C \uB9CC\uB0A9\uB2C8\uB2E4.",primary:"",fields:[]}]}var je=document.getElementById("main"),wp=matchMedia("(prefers-reduced-motion: reduce)"),vt={data:null,subject:"all",student:"all",page:"",work:null,motion:!wp.matches,scenes:[],observers:[],listeners:[],slide:0},Bt=n=>document.getElementById(n),Ce=n=>String(n??"").replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t]),pu=n=>String(n||"").split(`
`).map(t=>"<span>"+Ce(t)+"</span>").join(""),Cr=n=>oi[n.subjectKey]?.label||n.subject,Iv=n=>[...new Set(n.map(Cr))].join(" \xB7 "),Lv=n=>n.topicMismatch?"\uC8FC\uC81C \uC815\uB9AC \uC911":n.recordComplete||n.status==="\uCD5C\uC885 \uC81C\uCD9C"?"\uD0D0\uAD6C \uAE30\uB85D \uC644\uB8CC":"\uC791\uC131 \uC911",Dv=n=>String(n||"").split(/\n\s*\n/).filter(Boolean).map(t=>"<p>"+Ce(t).replace(/\n/g,"<br>")+"</p>").join(""),Nv=(n,t=360)=>n?'<div class="source-label">\uD559\uC0DD \uAE30\uB85D \xB7 \uBC1C\uCDCC</div><div class="student-excerpt">'+Dv(cc(n,t))+"</div>":'<p class="pending-text">\uC774 \uBD80\uBD84\uC740 \uC544\uC9C1 \uAE30\uB85D\uC744 \uAE30\uB2E4\uB9AC\uACE0 \uC788\uC2B5\uB2C8\uB2E4.</p>';function Uv(n){let t=n.filter(([,e])=>e);return t.length?'<details class="source-details"><summary>\uC6D0\uBB38 \uC804\uCCB4 \uD3BC\uCCD0\uBCF4\uAE30 <span aria-hidden="true">\uFF0B</span></summary>'+t.map(([e,i])=>'<section class="original-field"><h4>'+Ce(e)+'</h4><div class="original-text">'+Ce(i)+"</div></section>").join("")+"</details>":""}function tn(n,t,e,i){n.addEventListener(t,e,i),vt.listeners.push(()=>n.removeEventListener(t,e,i))}function Ap(){vt.listeners.forEach(n=>n()),vt.listeners=[],vt.scenes.forEach(n=>n.dispose()),vt.scenes=[],vt.observers.forEach(n=>n.disconnect()),vt.observers=[],vt.work=null}function Fv(n,t,e="geometry"){if(!n)return null;try{let i=oi[e]||oi.geometry,s=new sc(n,t,{motion:vt.motion,primary:i.light,hue:i.hue});return vt.scenes.push(s),s}catch{return n.innerHTML=Co(t),null}}function Cp(n){if(!vt.motion)return;let t=new IntersectionObserver(e=>e.forEach(({target:i,isIntersecting:s})=>{if(s){try{Hs(i,{opacity:[.3,1],translateY:[16,0],duration:500,ease:"out(3)"})}catch{}t.unobserve(i)}}),{threshold:.08});n.querySelectorAll(".reveal").forEach(e=>t.observe(e)),vt.observers.push(t)}function Rr(){document.body.classList.toggle("reduced-motion",!vt.motion);let n=Bt("motionButton");n.setAttribute("aria-pressed",String(!vt.motion)),n.lastElementChild.textContent=vt.motion?"\uBAA8\uC158 \uC904\uC774\uAE30":"\uBAA8\uC158 \uCF1C\uAE30",vt.scenes.forEach(e=>e.setMotion(vt.motion));let t=Bt("replayScene");t&&(t.disabled=!vt.motion,t.innerHTML=vt.motion?'<span aria-hidden="true">\u21BB</span> \uB2E4\uC2DC \uBCF4\uAE30':"\uBAA8\uC158 \uAEBC\uC9D0")}Bt("motionButton").addEventListener("click",()=>{vt.motion=!vt.motion,Rr()});wp.addEventListener("change",n=>{vt.motion=!n.matches,Rr()});document.querySelector(".skip-link").addEventListener("click",n=>{n.preventDefault(),je.focus({preventScroll:!0}),je.scrollIntoView({behavior:"auto"})});function Ov(){je.querySelectorAll("[data-math]").forEach(n=>{try{window.katex.render(n.dataset.math,n,{throwOnError:!0,strict:"ignore",trust:!1,output:"htmlAndMathml"})}catch{n.textContent=n.dataset.math}}),window.katex&&je.querySelectorAll(".student-excerpt,.chapter-intro,.chapter-quote,.closing-note,.next-question").forEach(n=>{let t=document.createTreeWalker(n,NodeFilter.SHOW_TEXT),e=[],i;for(;i=t.nextNode();)e.push(i);for(let s of e){let r=/\\\(([\s\S]+?)\\\)|\\\[([\s\S]+?)\\\]|\$\$([^$]+?)\$\$|\$([^$\n]+?)\$/g,o=s.textContent,a=document.createDocumentFragment(),l,c=0,u=!1;for(;l=r.exec(o);){a.append(document.createTextNode(o.slice(c,l.index)));let d=document.createElement("span");try{window.katex.render(l[1]||l[2]||l[3]||l[4],d,{throwOnError:!0,strict:"ignore",trust:!1,output:"htmlAndMathml"}),a.append(d)}catch{a.append(document.createTextNode(l[0]))}c=r.lastIndex,u=!0}u&&(a.append(document.createTextNode(o.slice(c))),s.replaceWith(a))}})}function Rp(n){document.body.dataset.subject=n,document.querySelectorAll("[data-nav-subject]").forEach(t=>{t.dataset.navSubject===n?t.setAttribute("aria-current","page"):t.removeAttribute("aria-current")})}function Bv(n,t){let e=oi[n],i=t.filter(s=>s.subjectKey===n).length;return'<a class="subject-room reveal" data-subject="'+n+'" href="#/collection?subject='+n+'"><div class="room-art">'+Co(e.kind)+'<span class="room-mark" aria-hidden="true">'+e.mark+'</span></div><div class="room-copy"><div class="room-meta"><strong>'+e.label+"</strong><span>"+i+"\uAC1C\uC758 \uD0D0\uAD6C</span></div><h3>"+e.title+"</h3><p>"+e.description+'</p><span class="room-entry">\uC774 \uACFC\uBAA9 \uB458\uB7EC\uBCF4\uAE30 <b aria-hidden="true">\u2197</b></span></div></a>'}function kv(n,t){return'<a class="work-card reveal" data-subject="'+n.subjectKey+'" href="#/work/'+n.id+'" aria-label="'+Ce(n.name+" \xB7 "+Cr(n)+" \xB7 "+n.title.replace(/\n/g," "))+'"><div class="card-art">'+Co(n.kind,t)+'<span class="card-number">'+String(t+1).padStart(2,"0")+'</span></div><div class="card-copy"><div class="card-meta"><span class="subject-mark">'+oi[n.subjectKey].mark+"</span><span>"+Cr(n)+" \xB7 "+Ce(n.name)+"</span></div><h3>"+pu(n.title)+"</h3><p>"+Ce(n.caption)+'</p><div class="card-bottom"><span>'+Ce(n.tags.slice(0,2).join(" \xB7 "))+'</span><b aria-hidden="true">\u2197</b></div></div></a>'}function hc(){let n=vt.data.works,t=du(n,vt.subject,vt.student),e=du(n,vt.subject),i=[...new Map(e.map(s=>[ki(s),s])).values()].sort((s,r)=>s.name.localeCompare(r.name,"ko"));Bt("studentFilter").innerHTML='<option value="all">\uBAA8\uB4E0 \uD0D0\uAD6C\uC790</option>'+i.map(s=>'<option value="'+ki(s)+'">'+Ce(s.name)+"</option>").join(""),Bt("studentFilter").value=vt.student,Bt("workGrid").innerHTML=t.length?t.map(s=>kv(s,n.indexOf(s))).join(""):'<p class="no-results">\uC774 \uC870\uAC74\uC5D0 \uB9DE\uB294 \uD0D0\uAD6C\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4. \uB2E4\uB978 \uACFC\uBAA9\uC774\uB098 \uD0D0\uAD6C\uC790\uB97C \uC120\uD0DD\uD574 \uC8FC\uC138\uC694.</p>',Bt("collectionTitle").textContent=vt.subject==="all"?"\uC11C\uB85C \uB2E4\uB978 \uC9C8\uBB38\uC744 \uB9CC\uB098\uB2E4.":oi[vt.subject].label+"\uC758 \uC9C8\uBB38\uB4E4.",Bt("resultCount").textContent=t.length+"\uAC1C\uC758 \uD0D0\uAD6C",document.querySelectorAll("[data-filter]").forEach(s=>s.setAttribute("aria-pressed",String(s.dataset.filter===vt.subject))),Rp(vt.subject),Cp(Bt("workGrid"))}function zv(){Ap(),vt.page="home",document.body.classList.remove("work-page"),document.title="\uC9C8\uBB38\uC774 \uB0A8\uAE34 \uADA4\uC801 \xB7 \uC218\uD559 \uD0D0\uAD6C\uC804";let n=vt.data.works,t=[...new Map(n.map(e=>[ki(e),e])).values()].sort((e,i)=>e.name.localeCompare(i.name,"ko"));if(je.innerHTML='<section class="hero" aria-labelledby="exhibitionTitle"><div class="hero-copy"><p class="eyebrow">2026 \uC218\uD559 \uD0D0\uAD6C\uC804</p><h1 id="exhibitionTitle"><span>\uD558\uB098\uC758 \uC9C8\uBB38\uC774</span><span>\uC790\uAE30\uB9CC\uC758 <em>\uBAA8\uC591</em>\uC744</span><span>\uAC16\uAE30\uAE4C\uC9C0.</span></h1><p class="hero-intro">'+t.length+"\uBA85\uC774 \uB0A8\uAE34 "+n.length+'\uAC1C\uC758 \uD0D0\uAD6C.<br>\uC815\uB2F5\uC5D0 \uB2FF\uAE30 \uC804\uC758 \uACE0\uBBFC\uACFC,<br>\uC0DD\uAC01\uC744 \uBC14\uAFBC \uC21C\uAC04\uC744 \uD568\uAED8 \uC77D\uC2B5\uB2C8\uB2E4.</p><a class="primary-link" href="#/subjects">\uC5B4\uB5A4 \uC9C8\uBB38\uBD80\uD130 \uB9CC\uB098 \uBCFC\uAE4C\uC694 <span aria-hidden="true">\u2193</span></a><div class="hero-meta"><span><b>'+t.length+"</b> \uD0D0\uAD6C\uC790</span><span><b>"+n.length+'</b> \uD0D0\uAD6C \uAE30\uB85D</span><span>\uC138 \uAC1C\uC758 \uACFC\uBAA9</span></div></div><div class="hero-art"><div id="heroScene" class="scene-host" role="img" aria-label="\uD3C9\uBA74\uACFC \uAD6C\uAC00 \uB9CC\uB098\uBA70 \uB2E8\uBA74\uC774 \uB2EC\uB77C\uC9C0\uB294 \uC804\uC2DC \uD574\uC124 \uB3C4\uD574"></div><span class="art-caption">\uAC19\uC740 \uB300\uC0C1\uB3C4, \uC9C8\uBB38\uC5D0 \uB530\uB77C \uB2E4\uB974\uAC8C \uBCF4\uC785\uB2C8\uB2E4.</span><span class="hero-orbit" aria-hidden="true">\uC9C8\uBB38 \xB7 \uC2DC\uB3C4 \xB7 \uC218\uC815 \xB7 \uBC1C\uACAC</span></div></section><section class="section-shell subjects-section" id="subjects" aria-labelledby="subjectsTitle"><div class="section-heading"><div><p class="eyebrow">\uACFC\uBAA9\uC73C\uB85C \uB4E4\uC5B4\uAC00\uAE30</p><h2 id="subjectsTitle">\uC11C\uB85C \uB2E4\uB978 \uAD00\uC810,<br>\uC774\uC5B4\uC9C0\uB294 \uD638\uAE30\uC2EC.</h2></div><p>\uBBF8\uC801\uBD84\uC740 \uBCC0\uD654\uB85C, \uAE30\uD558\uB294 \uACF5\uAC04\uC73C\uB85C,<br>\uACBD\uC81C\uC218\uD559\uC740 \uC120\uD0DD\uACFC \uBAA8\uD615\uC73C\uB85C \uC9C8\uBB38\uD569\uB2C8\uB2E4.</p></div><div class="subject-rooms">'+Object.keys(oi).map(e=>Bv(e,n)).join("")+'</div></section><section class="section-shell collection" id="collection" aria-labelledby="collectionTitle"><div class="section-heading"><div><p class="eyebrow">\uD0D0\uAD6C \uAE30\uB85D \uBAA8\uC544 \uBCF4\uAE30</p><h2 id="collectionTitle">\uC11C\uB85C \uB2E4\uB978 \uC9C8\uBB38\uC744 \uB9CC\uB098\uB2E4.</h2></div><p>\uC791\uD488\uC744 \uACE0\uB974\uBA74 \uC9C8\uBB38\uBD80\uD130 \uACB0\uB860\uAE4C\uC9C0<br>\uC77C\uACF1 \uC7A5\uC73C\uB85C \uB118\uACA8 \uC77D\uC744 \uC218 \uC788\uC2B5\uB2C8\uB2E4.</p></div><div class="filter-bar"><div class="subject-tabs" role="group" aria-label="\uACFC\uBAA9 \uC120\uD0DD"><button type="button" data-filter="all" aria-pressed="true">\uC804\uCCB4 <span>'+n.length+"</span></button>"+Object.entries(oi).map(([e,i])=>'<button type="button" data-filter="'+e+'" data-subject="'+e+'" aria-pressed="false"><span class="filter-mark" aria-hidden="true">'+i.mark+"</span>"+i.label+" <span>"+n.filter(s=>s.subjectKey===e).length+"</span></button>").join("")+'</div><label class="student-select" for="studentFilter"><span>\uD0D0\uAD6C\uC790</span><select id="studentFilter"></select></label></div><div class="collection-summary"><span id="resultCount" aria-live="polite"></span><p>\uD559\uC0DD\uC758 \uAE30\uB85D\uACFC \uC804\uC2DC \uD574\uC124\uC740 \uAD6C\uBD84\uD574 \uD45C\uC2DC\uD569\uB2C8\uB2E4.</p></div><div class="work-grid" id="workGrid"></div></section><section class="section-shell students-section" id="students" aria-labelledby="studentsTitle"><div class="section-heading"><div><p class="eyebrow">\uC9C8\uBB38\uC758 \uC8FC\uC778\uB4E4</p><h2 id="studentsTitle">\uD55C \uC0AC\uB78C\uC758 \uAD00\uC2EC\uC744<br>\uD568\uAED8 \uC77D\uC5B4 \uBCF4\uC138\uC694.</h2></div><p>\uC774\uB984\uC744 \uACE0\uB974\uBA74 \uADF8 \uD559\uC0DD\uC774 \uB0A8\uAE34<br>\uD0D0\uAD6C\uB4E4\uC744 \uD55C\uACF3\uC5D0\uC11C \uB9CC\uB0A0 \uC218 \uC788\uC2B5\uB2C8\uB2E4.</p></div><div class="student-list">'+t.map((e,i)=>'<a class="student-row" href="#/collection?student='+ki(e)+'"><span class="student-number">'+String(i+1).padStart(2,"0")+"</span><span><strong>"+Ce(e.name)+"</strong><small>"+Ce(Iv(n.filter(s=>ki(s)===ki(e))))+'</small></span><span class="student-arrow" aria-hidden="true">\u2197</span></a>').join("")+"</div></section>",Fv(Bt("heroScene"),"hero","geometry"),hc(),Rr(),Cp(je),je.querySelectorAll("[data-filter]").forEach(e=>tn(e,"click",()=>{vt.subject=e.dataset.filter,vt.student="all";let i="#/collection"+(vt.subject==="all"?"":"?subject="+vt.subject);location.hash===i?hc():location.hash=i})),tn(Bt("studentFilter"),"change",e=>{vt.student=e.target.value,hc()}),vt.motion)try{Dc({defaults:{duration:650,ease:"out(3)"}}).add(je.querySelectorAll(".hero h1>span"),{opacity:[0,1],translateY:[20,0],delay:wi(85)},0).add(je.querySelectorAll(".hero-intro,.hero-meta"),{opacity:[0,1],translateY:[10,0]},180)}catch{}}function Vv(n){let t=n.artifact.status,e=fu(n.artifact),i,s,r;return t==="linked"&&e?(i="\uC9C8\uBB38\uC744 \uC9C1\uC811 \uC6C0\uC9C1\uC5EC \uBCF4\uC138\uC694.",s="\uD559\uC0DD\uC774 \uC81C\uCD9C\uD55C \uC6F9\uC571\uC785\uB2C8\uB2E4. \uC55E\uC5D0\uC11C \uC77D\uC740 \uC870\uAC74\uC744 \uBC14\uAFB8\uBA70 \uAE30\uB85D \uC18D \uC124\uBA85\uACFC \uD654\uBA74\uC758 \uACB0\uACFC\uB97C \uD568\uAED8 \uC0B4\uD3B4\uBCF4\uC138\uC694.",r='<a class="button-solid" href="'+Ce(e)+'" target="_blank" rel="noopener noreferrer">\uD559\uC0DD \uC6F9\uC571 \uC5F4\uAE30 <span aria-hidden="true">\u2197</span></a><button class="button-line" id="embedButton" type="button">\uC804\uC2DC \uC548\uC5D0\uC11C \uCCB4\uD5D8\uD558\uAE30</button>'):t==="unavailable"?(i="\uC791\uD488\uC758 \uC0C8 \uC8FC\uC18C\uB97C \uAE30\uB2E4\uB9BD\uB2C8\uB2E4.",s="\uD604\uC7AC \uC81C\uCD9C \uC8FC\uC18C\uC5D0 \uC5F0\uACB0\uB418\uC9C0 \uC54A\uC544 \uB2E4\uC2DC \uD655\uC778\uD558\uACE0 \uC788\uC2B5\uB2C8\uB2E4. \uD0D0\uAD6C \uAE30\uB85D\uC740 \uBA3C\uC800 \uC804\uC2DC\uD558\uACE0, \uC0C8 \uC8FC\uC18C\uB098 \uC6D0\uBCF8 \uD30C\uC77C\uC744 \uBC1B\uC73C\uBA74 \uCCB4\uD5D8\uC744 \uC5F0\uACB0\uD569\uB2C8\uB2E4.",r='<span class="artifact-status">\uC791\uD488 \uC8FC\uC18C \uD655\uC778 \uC911</span>'):t==="awaiting-file"?(i="\uC791\uD488\uC758 \uC6D0\uBCF8\uC744 \uBAA8\uC73C\uACE0 \uC788\uC2B5\uB2C8\uB2E4.",s="\uD604\uC7AC \uC81C\uCD9C \uC8FC\uC18C\uB294 \uD559\uC0DD \uAE30\uAE30 \uC548\uC758 \uD30C\uC77C\uC744 \uAC00\uB9AC\uD0B5\uB2C8\uB2E4. HTML \uC6D0\uBCF8\uC744 \uC5F0\uACB0\uD558\uBA74 \uC774 \uC790\uB9AC\uC5D0\uC11C \uC791\uD488\uC744 \uCCB4\uD5D8\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4.",r='<span class="artifact-status">\uC6D0\uBCF8 \uD30C\uC77C \uC218\uD569 \uC911</span>'):(i="\uC774 \uC790\uB9AC\uC5D0\uC11C \uC791\uD488\uC744 \uB9CC\uB098\uAC8C \uB429\uB2C8\uB2E4.",s="\uD0D0\uAD6C \uAE30\uB85D\uC744 \uBA3C\uC800 \uC804\uC2DC\uD588\uC2B5\uB2C8\uB2E4. \uD559\uC0DD\uC774 \uB9CC\uB4E0 \uC6F9\uC571\uC774\uB098 \uC790\uB8CC\uAC00 \uC900\uBE44\uB418\uBA74 \uC774 \uC790\uB9AC\uC5D0 \uC5F0\uACB0\uD569\uB2C8\uB2E4.",r='<span class="artifact-status">\uC6F9\uC571 \uC900\uBE44 \uC911</span>'),'<div class="artifact-card"><span class="artifact-symbol" aria-hidden="true">\u2197</span><h3>'+i+"</h3><p>"+s+'</p><div class="artifact-actions">'+r+"</div></div>"+(n.recordNote?'<div class="closing-note"><strong>\uD568\uAED8 \uC77D\uC5B4 \uC8FC\uC138\uC694</strong><p>'+Ce(n.recordNote)+"</p></div>":"")}function Hv(n,t,e){let i=n.key==="artifact"?Vv(e):Nv(n.primary,n.key==="conclusion"?300:360);return n.key==="revision"&&n.primary&&(i='<div class="source-label">\uD559\uC0DD\uC774 \uB0A8\uAE34 \uC2DC\uB3C4\uC640 \uC218\uC815 \xB7 \uBC1C\uCDCC</div><blockquote class="chapter-quote">'+Ce(cc(n.primary,310))+"</blockquote>"),n.key==="evidence"&&e.recordNote&&(i+='<div class="closing-note"><strong>\uAE30\uB85D\uC744 \uC77D\uB294 \uAD00\uC810</strong><p>'+Ce(e.recordNote)+"</p></div>"),n.key==="conclusion"&&(i+='<div class="closing-note"><strong>\uC804\uC2DC \uD574\uC124</strong><p>'+Ce(e.readingNote)+"</p></div>"+(e.raw.next?'<div class="next-question"><strong>\uC774\uC5B4 \uAC00\uACE0 \uC2F6\uC740 \uC9C8\uBB38</strong><p>'+Ce(cc(e.raw.next,170))+"</p></div>":"")),'<article class="deck-slide" role="tabpanel" id="slide-'+t+'" aria-labelledby="chapter-tab-'+t+'" tabindex="-1" '+(t?"hidden":"")+'><div class="chapter-number">'+String(t+1).padStart(2,"0")+" <span>/ 07</span></div><h2>"+n.title+'</h2><p class="chapter-intro">'+Ce(n.intro)+"</p>"+i+Uv(n.fields)+"</article>"}function Gv(n){let t=rc(n);return'<aside class="deck-figure motion-theater" aria-label="\uD0D0\uAD6C \uACFC\uC815\uC5D0 \uB530\uB77C \uBC14\uB00C\uB294 \uC804\uC2DC \uD574\uC124"><div class="theater-topline"><span><i aria-hidden="true"></i> '+Ce(t.focus)+'</span><div class="theater-actions"><button class="scene-play" id="scenePlay" type="button" aria-pressed="false">\u2161 \uC77C\uC2DC\uC815\uC9C0</button><button class="scene-replay" id="replayScene" type="button"><span aria-hidden="true">\u21BB</span> \uB2E4\uC2DC \uBCF4\uAE30</button><button class="scene-expand" id="expandScene" type="button" aria-haspopup="dialog"><span aria-hidden="true">\u26F6</span> \uD06C\uAC8C \uBCF4\uAE30</button></div></div><div id="storyScene" class="motion-stage" role="img" aria-label="\uD0D0\uAD6C \uACFC\uC815\uC744 \uB530\uB77C \uBC14\uB00C\uB294 \uC804\uC2DC \uD574\uC124 \uB3C4\uD574"></div><div class="theater-bottomline"><p class="scene-live-caption"></p><span>\uD559\uC0DD\uC758 \uC2E4\uC81C \uAE30\uB85D\uC740 \uC544\uB798\uC5D0\uC11C \uC77D\uC2B5\uB2C8\uB2E4.</span></div></aside><div class="story-equation"><span>\uAD00\uACC4\uB97C \uC787\uB294 \uC2DD</span><div data-math="'+Ce(n.math)+'"></div><p>'+Ce(n.mathLabel)+"</p></div>"}function Wv(n,t){return'<nav class="deck-controls" aria-label="\uD0D0\uAD6C \uC7A5 \uB118\uAE30\uAE30"><button class="deck-previous" id="previousSlide" type="button"><span aria-hidden="true">\u2190</span> \uC774\uC804</button><button class="deck-position" id="chapterMenu" type="button" aria-expanded="false" aria-controls="chapterPopover"><span id="slidePosition" aria-live="polite"></span><small>\uB2E8\uACC4 \uC120\uD0DD <span aria-hidden="true">\u2303</span></small></button><button class="deck-next" id="nextSlide" type="button">\uB2E4\uC74C <span aria-hidden="true">\u2192</span></button><div class="deck-progress" aria-hidden="true"><span id="deckProgress"></span></div><div class="dock-menu" id="chapterPopover" role="group" aria-label="\uD0D0\uAD6C \uB2E8\uACC4 \uBC14\uB85C \uAC00\uAE30" hidden>'+n.map((e,i)=>'<button type="button" data-jump="'+i+'"><span>'+String(i+1).padStart(2,"0")+"</span>"+e.label+"</button>").join("")+'<a href="'+t+'">\u2190 \uACFC\uBAA9\uC758 \uD0D0\uAD6C \uBAA9\uB85D\uC73C\uB85C</a></div></nav>'}function Tp(n){let t=Bt("scenePlay");t&&(t.setAttribute("aria-pressed",String(!n)),t.innerHTML=n?'<span aria-hidden="true">\u2161</span> \uC77C\uC2DC\uC815\uC9C0':'<span aria-hidden="true">\u25B7</span> \uC7AC\uC0DD',je.querySelectorAll("[data-viewer-play]").forEach(e=>{e.textContent=n?"\u2161":"\u25B7",e.setAttribute("aria-pressed",String(!n))}))}function Xv(n){Ap(),vt.page="work",vt.work=n,vt.slide=-1,document.body.classList.add("work-page"),Rp(n.subjectKey),document.title=n.title.replace(/\n/g," ")+" \xB7 "+n.name+" \xB7 \uC218\uD559 \uD0D0\uAD6C\uC804";let t=bp(n),e=vt.data.works.filter(p=>p.subjectKey===n.subjectKey),i=e[(e.indexOf(n)+1)%e.length],s="#/collection?subject="+n.subjectKey,r=e.length>1?"#/work/"+i.id:"#/subjects",o=e.length>1?"\uAC19\uC740 \uACFC\uBAA9\uC758 \uB2E4\uC74C \uC9C8\uBB38 \xB7 "+i.name:"\uB2E4\uB978 \uACFC\uBAA9\uC758 \uC9C8\uBB38\uB3C4 \uB9CC\uB098 \uBCF4\uC138\uC694",a=e.length>1?i.title:"\uB2E4\uC74C \uD638\uAE30\uC2EC\uC744 \uCC3E\uC544\uBCFC\uAE4C\uC694.";je.innerHTML='<header class="work-heading"><a class="back-link" href="'+s+'">\u2190 '+Cr(n)+' \uD0D0\uAD6C\uB85C \uB3CC\uC544\uAC00\uAE30</a><div class="work-byline"><span class="subject-badge">'+oi[n.subjectKey].mark+" "+Cr(n)+"</span><strong>"+Ce(n.name)+"</strong><span>"+Lv(n)+"</span></div><h1>"+pu(n.title)+'</h1><p class="work-caption">'+Ce(n.caption)+'</p><div class="work-tags">'+n.tags.map(p=>"<span>"+Ce(p)+"</span>").join("")+'</div></header><section class="story-deck" id="storyDeck" aria-label="'+Ce(n.name)+'\uC758 \uD0D0\uAD6C \uC77C\uACF1 \uC7A5"><div class="deck-tab-list" id="deckTabs" role="tablist" aria-label="\uD0D0\uAD6C \uACFC\uC815">'+t.map((p,_)=>'<button id="chapter-tab-'+_+'" role="tab" aria-controls="slide-'+_+'" aria-selected="'+(_===0)+'" tabindex="'+(_===0?"0":"-1")+'" data-slide="'+_+'"><b>'+String(_+1).padStart(2,"0")+"</b>"+p.label+"</button>").join("")+'</div><div class="deck-reader" id="deckReader">'+Gv(n)+'<div class="deck-copy"><div class="reading-topline"><span>\uD559\uC0DD\uC774 \uB0A8\uAE34 \uD0D0\uAD6C \uAE30\uB85D</span><span>\uC6D0\uBB38\uC744 \uBC14\uD0D5\uC73C\uB85C \uC77D\uC2B5\uB2C8\uB2E4.</span></div>'+t.map((p,_)=>Hv(p,_,n)).join("")+'</div></div><section class="embedded-work" id="embeddedWork" aria-label="\uD559\uC0DD \uC6F9\uC571 \uC6D0\uBCF8" hidden><div class="embed-bar"><span>\uD559\uC0DD\uC774 \uB9CC\uB4E0 \uC6F9\uC571 \xB7 \uC6D0\uBCF8 \uD654\uBA74</span><button id="closeEmbed" type="button">\uCCB4\uD5D8 \uB2EB\uAE30 \u2191</button></div><div id="iframeMount"></div></section><p class="deck-instruction">\uBC84\uD2BC\uC774\uB098 \u2190 \u2192 \uBC29\uD5A5\uD0A4\uB85C \uB118\uAE41\uB2C8\uB2E4. \uBAA8\uBC14\uC77C\uC5D0\uC11C\uB294 \uAE00 \uC601\uC5ED\uC744 \uC88C\uC6B0\uB85C \uBC00\uC5B4 \uBCF4\uC138\uC694.</p></section><section class="work-epilogue"><p>\uD559\uC0DD\uC774 \uC800\uC7A5\uD55C \uC6D0\uBB38\uC744 \uBC14\uD0D5\uC73C\uB85C \uAD6C\uC131\uD588\uC2B5\uB2C8\uB2E4.<br>\uC804\uC2DC \uB3C4\uD574\uB294 \uD559\uC0DD \uC791\uD488\uACFC \uAD6C\uBD84\uD55C \uD574\uC124\uC774\uBA70, \uC6F9\uC571 \uC900\uBE44 \uC0C1\uD0DC\uB294 \uB9C8\uC9C0\uB9C9 \uC7A5\uC5D0\uC11C \uD655\uC778\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4.</p><span>\uAE30\uB85D \uC218\uC815 \xB7 '+Ce(n.updated)+'</span></section><a class="next-work" href="'+r+'"><div><span>'+Ce(o)+"</span><h2>"+pu(a)+'</h2></div><b aria-hidden="true">\u2197</b></a>',je.insertAdjacentHTML("beforeend",Wv(t,s));let l=null,c=new ac(Bt("storyScene"),n,{motion:vt.motion,onPlaybackChange:Tp});vt.scenes.push(c),Ov(),Rr(),Tp(c.playing),tn(Bt("replayScene"),"click",()=>c.replay());let u=()=>{vt.motion?c.setPlaying(!c.playing):(vt.motion=!0,Rr(),c.setPlaying(!0))};tn(Bt("scenePlay"),"click",u);let d=(p,{focus:_=!1}={})=>{let m=Mp(p,t.length);if(m===vt.slide)return;let g=vt.slide;vt.slide=m,je.querySelectorAll(".deck-slide").forEach((v,b)=>{v.hidden=b!==m}),je.querySelectorAll("[data-slide]").forEach((v,b)=>{v.setAttribute("aria-selected",String(b===m)),v.tabIndex=b===m?0:-1}),Bt("previousSlide").disabled=m===0,Bt("nextSlide").disabled=!1,Bt("nextSlide").innerHTML=m===6?e.length>1?"\uB2E4\uC74C \uD0D0\uAD6C \u2197":"\uACFC\uBAA9 \uBCF4\uAE30 \u2197":'\uB2E4\uC74C <span aria-hidden="true">\u2192</span>',Bt("nextSlide").setAttribute("aria-label",m===6?"\uB2E4\uC74C \uD0D0\uAD6C\uB85C \uC774\uB3D9":"\uB2E4\uC74C \uC7A5"),Bt("slidePosition").textContent=String(m+1).padStart(2,"0")+" / 07 \xB7 "+t[m].label,Bt("deckProgress").style.width=(m+1)/t.length*100+"%",c.setPhase(m),Bt("storyDeck").dataset.phase=String(m),l?.update(m,t[m].label),je.querySelectorAll("[data-jump]").forEach((v,b)=>{b===m?v.setAttribute("aria-current","step"):v.removeAttribute("aria-current")}),Bt("embeddedWork").hidden=m!==6||!Bt("iframeMount").firstChild;let S=Bt("chapter-tab-"+m),A=Bt("deckTabs");if(A.scrollTo({left:S.offsetLeft-A.clientWidth/2+S.clientWidth/2,behavior:vt.motion?"smooth":"auto"}),_&&S.focus({preventScroll:!0}),g>=0&&!l?.isOpen){let v=Bt("slide-"+m);if(vt.motion)try{Hs(v,{opacity:[.5,1],translateY:[16,0],duration:500,ease:"out(3)"})}catch{}Bt("storyDeck").getBoundingClientRect().top<70&&Bt("storyDeck").scrollIntoView({block:"start",behavior:vt.motion?"smooth":"auto"})}};je.querySelectorAll("[data-slide]").forEach(p=>tn(p,"click",()=>d(Number(p.dataset.slide)))),tn(Bt("previousSlide"),"click",()=>d(vt.slide-1)),tn(Bt("nextSlide"),"click",()=>{vt.slide===6?location.hash=r:d(vt.slide+1)});let h=()=>{Bt("chapterPopover").hidden=!0,Bt("chapterMenu").setAttribute("aria-expanded","false")};tn(Bt("chapterMenu"),"click",()=>{let p=Bt("chapterPopover").hidden;Bt("chapterPopover").hidden=!p,Bt("chapterMenu").setAttribute("aria-expanded",String(p))}),je.querySelectorAll("[data-jump]").forEach(p=>tn(p,"click",()=>{h(),d(Number(p.dataset.jump)),Bt("chapterMenu").focus({preventScroll:!0})})),tn(document,"pointerdown",p=>{p.target.closest?.(".deck-controls")||h()}),tn(document,"keydown",p=>{p.key==="Escape"&&!Bt("chapterPopover").hidden&&(h(),Bt("chapterMenu").focus({preventScroll:!0}))}),l=new lc({host:Bt("storyScene"),launch:Bt("expandScene"),title:n.title.replace(/\n/g," "),onStep:p=>d(vt.slide+p),onTogglePlay:u,getPlaying:()=>c.playing}),vt.listeners.push(()=>l.dispose()),tn(document,"keydown",p=>{if(p.altKey||p.ctrlKey||p.metaKey||p.target.closest?.("input,textarea,select,[contenteditable],iframe"))return;let _=p.key==="ArrowRight"?1:p.key==="ArrowLeft"?-1:0;_&&(p.preventDefault(),d(vt.slide+_,{focus:!!p.target.closest?.('[role="tablist"]')}))});let f=null;tn(Bt("deckReader"),"touchstart",p=>{let _=p.touches[0];f=_&&_.clientX>24&&_.clientX<innerWidth-24&&!p.target.closest("canvas,svg,.deck-figure,button,a,summary,details,input,iframe")?{x:_.clientX,y:_.clientY}:null},{passive:!0}),tn(Bt("deckReader"),"touchend",p=>{if(!f)return;let _=p.changedTouches[0],m=Sp(_.clientX-f.x,_.clientY-f.y);f=null,m&&d(vt.slide+m)},{passive:!0}),tn(Bt("deckReader"),"touchcancel",()=>{f=null},{passive:!0}),Bt("embedButton")&&tn(Bt("embedButton"),"click",()=>{let p=Bt("iframeMount");if(!p.firstChild){let _=document.createElement("iframe");_.title=n.name+"\uC758 "+Cr(n)+" \uC6F9\uC571",_.setAttribute("sandbox","allow-scripts allow-same-origin allow-forms"),_.referrerPolicy="no-referrer",_.src=fu(n.artifact),p.append(_)}Bt("embeddedWork").hidden=!1,Bt("embeddedWork").scrollIntoView({block:"start",behavior:vt.motion?"smooth":"auto"})}),tn(Bt("closeEmbed"),"click",()=>{Bt("iframeMount").replaceChildren(),Bt("embeddedWork").hidden=!0,Bt("embedButton")?.focus()}),d(0)}function Ep(){let[n,t]=(location.hash.slice(1)||"/").split("?"),e=new URLSearchParams(t||"");if(n.startsWith("/work/")){let i=vt.data.works.find(s=>s.id===n.slice(6));if(i){Xv(i),scrollTo({top:0,behavior:"auto"});return}}if(n==="/collection"){let i=e.get("subject");vt.subject=oi[i]?i:"all",vt.student=e.get("student")||"all"}n==="/"&&(vt.subject="all",vt.student="all"),vt.page!=="home"||n==="/"?zv():hc(),["/collection","/subjects","/students"].includes(n)?requestAnimationFrame(()=>Bt(n.slice(1))?.scrollIntoView({block:"start",behavior:vt.motion?"smooth":"auto"})):scrollTo({top:0,behavior:"auto"})}async function qv(){Rr();let n,t=["localhost","127.0.0.1","[::1]"].includes(location.hostname);try{let e=await fetch(t?"/api/exhibits":"data/exhibits.json",{cache:"no-store",credentials:"same-origin"});if(!e.ok)throw Error("\uC804\uC2DC \uC5F0\uACB0 \uC911");n=await e.json()}catch{try{n=await(await fetch("data/exhibits.json",{cache:"no-store"})).json()}catch{n={works:[]}}}if(!n.works?.length){je.innerHTML='<section class="loading-surface"><p class="eyebrow">2026 \uC218\uD559 \uD0D0\uAD6C\uC804</p><h1>\uC9C8\uBB38\uC774 \uB0A8\uAE34 \uADA4\uC801.</h1><p>\uC804\uC2DC \uC790\uB8CC\uB97C \uC5F0\uACB0\uD558\uACE0 \uC788\uC2B5\uB2C8\uB2E4. \uC7A0\uC2DC \uD6C4 \uB2E4\uC2DC \uC5F4\uC5B4 \uC8FC\uC138\uC694.</p></section>';return}vt.data=n,Bt("previewLabel").textContent=n.privatePreview?"\uAD50\uC0AC\uC6A9 \uBBF8\uB9AC\uBCF4\uAE30 \xB7 "+n.asOf:"2026 \uC218\uD559 \uD0D0\uAD6C\uC804 \xB7 "+new Set(n.works.map(ki)).size+"\uBA85\uC758 \uC9C8\uBB38",window.addEventListener("hashchange",Ep),Ep()}qv();})();
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
