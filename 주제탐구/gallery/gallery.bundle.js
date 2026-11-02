(()=>{var kn=typeof window<"u",Io=kn?window:null,Gi=kn?document:null,Me={OBJECT:0,ATTRIBUTE:1,CSS:2,TRANSFORM:3,CSS_VAR:4},se={NUMBER:0,UNIT:1,COLOR:2,COMPLEX:3},We={NONE:0,AUTO:1,FORCE:2},Fe={replace:0,none:1,blend:2},uc=Symbol(),li=Symbol(),Lo=Symbol(),Wi=Symbol(),bu=Symbol(),ne=1e-11,Rr=1e12,ci=1e3,Pr=240,zn="",Tu="var(",Ir=[],Do=(()=>{let n=new Map;return n.set("x","translateX"),n.set("y","translateY"),n.set("z","translateZ"),n})(),Ns=["perspective","translateX","translateY","translateZ","rotate","rotateX","rotateY","rotateZ","scale","scaleX","scaleY","scaleZ","skew","skewX","skewY"],Eu=Ns.reduce((n,t)=>({...n,[t]:t+"("}),{}),an=()=>{},wu=n=>n,Au=/\)\s*[-.\d]/,Cu=/(^#([\da-f]{3}){1,2}$)|(^#([\da-f]{4}){1,2}$)/i,Ru=/rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/i,Pu=/rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*(-?\d+|-?\d*.\d+)\s*\)/i,Iu=/hsl\(\s*(-?\d+|-?\d*.\d+)\s*,\s*(-?\d+|-?\d*.\d+)%\s*,\s*(-?\d+|-?\d*.\d+)%\s*\)/i,Lu=/hsla\(\s*(-?\d+|-?\d*.\d+)\s*,\s*(-?\d+|-?\d*.\d+)%\s*,\s*(-?\d+|-?\d*.\d+)%\s*,\s*(-?\d+|-?\d*.\d+)\s*\)/i,dc=/[-+]?\d*\.?\d+(?:e[-+]?\d)?/gi,No=/^([-+]?\d*\.?\d+(?:e[-+]?\d+)?)([a-z]+|%)$/i,Du=/([a-z])([A-Z])/g,Nu=/(\*=|\+=|-=)/,Uu=/var\(\s*(--[\w-]+)(?:\s*,\s*([^)]+))?\s*\)/;var Us={id:null,keyframes:null,playbackEase:null,playbackRate:1,frameRate:Pr,loop:0,reversed:!1,alternate:!1,autoplay:!0,persist:!1,duration:ci,delay:0,loopDelay:0,ease:"out(2)",composition:Fe.replace,modifier:wu,onBegin:an,onBeforeUpdate:an,onUpdate:an,onLoop:an,onPause:an,onComplete:an,onRender:an},Lr={current:null,root:Gi},de={defaults:Us,precision:4,timeScale:1,tickThreshold:200,editor:null},fc={version:"4.5.0",engine:null};kn&&(Io.AnimeJS||(Io.AnimeJS=[]),Io.AnimeJS.push(fc));var pc=n=>n.replace(Du,"$1-$2").toLowerCase(),Cn=(n,t)=>n.indexOf(t)===0,Mi=Date.now,Vn=Array.isArray,fs=n=>n&&n.constructor===Object,gn=n=>typeof n=="number"&&!isNaN(n),_n=n=>typeof n=="string",ln=n=>typeof n=="function",zt=n=>typeof n>"u",hi=n=>zt(n)||n===null,Uo=n=>kn&&n instanceof SVGElement,mc=n=>Cu.test(n),gc=n=>Cn(n,"rgb"),_c=n=>Cn(n,"hsl"),Ou=n=>mc(n)||(gc(n)||_c(n))&&(n[n.length-1]===")"||!Au.test(n)),Dr=n=>!de.defaults.hasOwnProperty(n),Ip=["opacity","rotate","overflow","color"],Bu=(n,t)=>{if(Ip.includes(t))return!1;if(n.getAttribute(t)||t in n){if(t==="scale"){let e=n.parentNode;return e&&e.tagName==="filter"}return!0}},Fo=n=>_n(n)?parseFloat(n):n,ps=Math.pow,Nr=Math.sqrt,ku=Math.sin,zu=Math.cos,Ur=Math.abs;var ms=Math.floor,Vu=Math.asin;var Fr=Math.PI,Fu=Math.round,xn=(n,t,e)=>n<t?t:n>e?e:n,xe=(n,t)=>{if(t<0)return n;if(!t)return Fu(n);let e=10**t;return Fu(n*e)/e};var Fs=(n,t,e)=>e===1?t:e===0?n:n+(t-n)*e,gs=n=>n===1/0?Rr:n===-1/0?-Rr:n,Si=n=>n<=ne?ne:gs(xe(n,11)),Ve=n=>Vn(n)?[...n]:n,Oo=(n,t)=>{let e={...n};for(let i in t){let s=n[i];e[i]=zt(s)?t[i]:s}return e},ye=(n,t,e,i="_prev",s="_next")=>{let r=n._head,o=s;for(e&&(r=n._tail,o=i);r;){let a=r[o];t(r),r=a}},bi=(n,t,e="_prev",i="_next")=>{let s=t[e],r=t[i];s?s[i]=r:n._head=r,r?r[e]=s:n._tail=s,t[e]=null,t[i]=null},Zn=(n,t,e,i="_prev",s="_next")=>{let r=n._tail;for(;r&&e&&e(r,t);)r=r[i];let o=r?r[s]:n._head;r?r[s]=t:n._head=t,o?o[i]=t:n._tail=t,t[i]=r,t[s]=o};var Hu=(n,t,e)=>{let i=n.style.transform;if(i){let s=n[Wi],r=0,o=i.length,a;for(;r<o;){for(;r<o&&i.charCodeAt(r)===32;)r++;if(r>=o)break;let c=r;for(;r<o&&i.charCodeAt(r)!==40;)r++;if(r>=o)break;let u=i.substring(c,r),d=1,h=r+1,f=-1,m=-1;for(r++;r<o&&d>0;){let g=i.charCodeAt(r);g===40?d++:g===41?d--:g===44&&d===1&&(f===-1?f=r:m===-1&&(m=r)),r++}let x=r-1;u==="translate"||u==="translate3d"?(f===-1?s.translateX=i.substring(h,x).trim():(s.translateX=i.substring(h,f).trim(),m===-1?s.translateY=i.substring(f+1,x).trim():(s.translateY=i.substring(f+1,m).trim(),s.translateZ=i.substring(m+1,x).trim())),a=i.substring(h,x)):u==="scale"||u==="scale3d"?f===-1?s.scale=i.substring(h,x).trim():(s.scaleX=i.substring(h,f).trim(),m===-1?s.scaleY=i.substring(f+1,x).trim():(s.scaleY=i.substring(f+1,m).trim(),s.scaleZ=i.substring(m+1,x).trim())):s[u]=i.substring(h,x)}if(t==="translate3d"&&a)return e&&(e[t]=a),a;let l=s[t];if(!zt(l))return e&&(e[t]=l),l}return t==="translate3d"?"0px, 0px, 0px":t==="rotate3d"?"0, 0, 0, 0deg":Cn(t,"scale")?"1":Cn(t,"rotate")||Cn(t,"skew")?"0deg":"0px"},Bo=n=>{let t=zn;for(let e=0,i=Ns.length;e<i;e++){let s=Ns[e],r=n[s];if(r!==void 0){if(s==="translateX"){let o=n.translateY;if(o!==void 0){let a=n.translateZ;a!==void 0?(t+=`translate3d(${r},${o},${a}) `,e+=2):(t+=`translate(${r},${o}) `,e+=1);continue}}if(s==="scaleX"&&n.scale===void 0){let o=n.scaleY;if(o!==void 0){let a=n.scaleZ;a!==void 0?(t+=`scale3d(${r},${o},${a}) `,e+=2):(t+=`scale(${r},${o}) `,e+=1);continue}}t+=`${Eu[s]}${r}) `}s==="rotateZ"&&n.rotate3d!==void 0&&(t+=`rotate3d(${n.rotate3d}) `)}return n.matrix!==void 0&&(t+=`matrix(${n.matrix}) `),n.matrix3d!==void 0&&(t+=`matrix3d(${n.matrix3d}) `),t};var xc=[];function ko(n,t){if(!n)return null;let e=xc.length;t:for(let i=0;i<e;i++){let s=xc[i];if(s.detect&&!s.detect(n))continue;let r=s.targetAdapters;for(let o=0,a=r.length;o<a;o++){let l=r[o];if(l.detect(n)){let c=l.props[t];if(c&&(!c.gate||c.gate(n)))return c;break t}}}for(let i=0;i<e;i++){let s=xc[i];if(s.detect&&!s.detect(n))continue;let r=s.propertyResolvers;for(let o=0,a=r.length;o<a;o++){let l=r[o](n,t);if(l)return l}}return null}var Lp=n=>{let t=Ru.exec(n)||Pu.exec(n),e=zt(t[4])?1:+t[4];return[+t[1],+t[2],+t[3],e]},Dp=n=>{let t=n.length,e=t===4||t===5;return[+("0x"+n[1]+n[e?1:2]),+("0x"+n[e?2:3]+n[e?2:4]),+("0x"+n[e?3:5]+n[e?3:6]),t===5||t===9?+(+("0x"+n[e?4:7]+n[e?4:8])/255).toFixed(3):1]},yc=(n,t,e)=>(e<0&&(e+=1),e>1&&(e-=1),e<1/6?n+(t-n)*6*e:e<1/2?t:e<2/3?n+(t-n)*(2/3-e)*6:n),Np=n=>{let t=Iu.exec(n)||Lu.exec(n),e=+t[1]/360,i=+t[2]/100,s=+t[3]/100,r=zt(t[4])?1:+t[4],o,a,l;if(i===0)o=a=l=s;else{let c=s<.5?s*(1+i):s+i-s*i,u=2*s-c;o=xe(yc(u,c,e+1/3)*255,0),a=xe(yc(u,c,e)*255,0),l=xe(yc(u,c,e-1/3)*255,0)}return[o,a,l,r]},Gu=n=>gc(n)?Lp(n):mc(n)?Dp(n):_c(n)?Np(n):[0,0,0,1];var Oe=(n,t)=>zt(n)?t:n,Wu=(n,t)=>{let e=n.match(Uu),i=t[li]?t:document.documentElement,s=getComputedStyle(i)?.getPropertyValue(e[1]);return(!s||s.trim()===zn)&&e[2]&&(s=e[2].trim()),s||0},ui=(n,t,e,i,s,r)=>{if(ln(n)){if(!s){let a=n(t,e,i,r);return isNaN(+a)?a||0:+a}let o=()=>{let a=n(t,e,i,r);return isNaN(+a)?a||0:+a};return s.func=o,o()}if(_n(n)&&Cn(n,Tu)){if(!s)return Wu(n,t);let o=()=>Wu(n,t);return s.func=o,o()}return n},vc=(n,t)=>n[li]?n[Lo]&&Bu(n,t)?Me.ATTRIBUTE:Ns.includes(t)||Do.get(t)?Me.TRANSFORM:Cn(t,"--")?Me.CSS_VAR:t in n.style?Me.CSS:t in n?Me.OBJECT:Me.ATTRIBUTE:Me.OBJECT,Xu=(n,t,e)=>{let i=n.style[t];i&&e&&(e[t]=i);let s=i||getComputedStyle(n[bu]||n).getPropertyValue(t);return s==="auto"?"0":s},Xi=(n,t,e,i)=>{let s=zt(e)?vc(n,t):e,r=ko(n,t);if(r){let o=r.get(n);return o&&i&&(i[t]=o),o??0}if(s===Me.OBJECT){let o=n[t];return o&&i&&(i[t]=o),o||0}if(s===Me.ATTRIBUTE){let o=n.getAttribute(t);return o&&i&&(i[t]=o),o}return s===Me.TRANSFORM?Hu(n,t,i):s===Me.CSS_VAR?Xu(n,t,i).trimStart():Xu(n,t,i)},Os=(n,t,e)=>e==="-"?n-t:e==="+"?n+t:n*t,zo=()=>({t:se.NUMBER,n:0,u:null,o:null,d:null,s:null}),yn=(n,t)=>{if(t.t=se.NUMBER,t.n=0,t.u=null,t.o=null,t.d=null,t.s=null,!n)return t;let e=+n;if(!isNaN(e))return t.n=e,t;let i=n;i[1]==="="&&(t.o=i[0],i=i.slice(2));let s=i.includes(" ")?!1:No.exec(i);if(s)return t.t=se.UNIT,t.n=+s[1],t.u=s[2],t;if(t.o)return t.n=+i,t;if(Ou(i))return t.t=se.COLOR,t.d=Gu(i),t;{let r=i.match(dc);return t.t=se.COMPLEX,t.d=r?r.map(Number):[],t.s=i.split(dc)||[],t}},Mc=(n,t)=>(t.t=n._valueType,t.n=n._toNumber,t.u=n._unit,t.o=null,t.d=Ve(n._toNumbers),t.s=Ve(n._strings),t),Rn=zo(),Vo=(n,t,e)=>{let i=n._modifier,s=n._fromNumbers,r=n._toNumbers,o=n._strings,a=o[0];for(let l=0,c=r.length;l<c;l++){let u=i(xe(Fs(s[l],r[l],t),e)),d=o[l+1];a+=`${d?u+d:u}`,n._numbers[l]=u}return a};var Or=(n,t,e,i,s)=>{let r=n.parent,o=n.duration,a=n.completed,l=n.iterationDuration,c=n.iterationCount,u=n._currentIteration,d=n._loopDelay,h=n._reversed,f=n._alternate,m=n._hasChildren,x=n._delay,g=n._currentTime,p=x+l,S=t-x,A=xn(g,-x,o),M=xn(S,-x,o),T=S-g,b=M>0,C=M>=o,y=o<=ne,w=s===We.FORCE,P=0,F=S,B=0;if(c>1){let J=l+(C?0:d),et=~~(M/J);n._currentIteration=xn(et,0,c),C&&n._currentIteration--,P=n._currentIteration%2,F=M-et*J||0}let V=h^(f&&P),I=n._ease,k=C?V?0:o:V?l-F:F;I&&(k=l*I(k/l)||0);let W=(r?r.backwards:S<g)?!V:!!V;if(n._currentTime=S,n._iterationTime=k,n.backwards=W,b&&!n.began?(n.began=!0,!e&&!(r&&(W||!r.began))&&n.onBegin(n)):S<=0&&(n.began=!1),!e&&!m&&b&&n._currentIteration!==u&&n.onLoop(n),w||s===We.AUTO&&(t>=(r&&x>0?0:x)&&t<=p||t<=x&&A>x||t>=p&&A!==o)||k>=p&&A!==o||k<=x&&A>0&&!C||t<=A&&A===o&&a||C&&!a&&y){if(b&&(n.computeDeltaTime(A),e||n.onBeforeUpdate(n)),!m){let J=w||(W?T*-1:T)>=de.tickThreshold,et=xe(n._offset+(r?r._offset:0)+x+k,12),U=n._head,q,j,yt,bt,pe=0;for(;U;){let Xt=U._composition,Tt=U._currentTime,Y=U._changeDuration,K=U._absoluteStartTime+U._changeDuration,it=U._nextRep,Rt=U._prevRep,ot=Xt!==Fe.none,ut=Rt?Rt._absoluteStartTime+Rt._changeDuration:0,qt=Rt&&Rt.parent!==U.parent,Ot=!it||it._isOverridden?K:it.parent===U.parent?K+it._delay:it._absoluteStartTime<it._absoluteUpdateStartTime?it._absoluteStartTime:it._absoluteUpdateStartTime;if((J||(Tt!==Y||et<=Ot||Rt&&!qt&&(!it||it.parent!==U.parent))&&(Tt!==0||et>=U._absoluteStartTime||qt&&!U._hasFromValue&&!Rt._isOverridden&&et>=ut||it&&!it._isOverridden&&it.parent===U.parent&&it._currentTime!==0&&k<it._startTime))&&(!Rt||qt||k>=U._startTime)&&(!ot||!U._isOverridden&&(!U._isOverlapped||et<=K)&&(!it||it._isOverridden||et<=Ot)&&(!Rt||Rt._isOverridden||(qt?et>=U._absoluteStartTime||!U._hasFromValue&&et>=ut:et>=ut+U._delay)))){let Gt=U._currentTime=xn(k-U._startTime,0,Y),Bt=U._ease(Gt/U._updateDuration),Dt=U._modifier,Qt=U._valueType,ue=U._tweenType,be=ue===Me.OBJECT,Kt=Qt===se.NUMBER,le=Kt&&be||Bt===0||Bt===1?-1:de.precision,R,ee;if(Kt)R=ee=Dt(xe(Fs(U._fromNumber,U._toNumber,Bt),le));else if(Qt===se.UNIT)ee=Dt(xe(Fs(U._fromNumber,U._toNumber,Bt),le)),R=`${ee}${U._unit}`;else if(Qt===se.COLOR){let Pt=U._numbers,E=U._fromNumbers,_=U._toNumbers,O=1-Bt,z=E[0],Z=E[1],st=E[2],rt=_[0],$=_[1],Q=_[2];Pt[0]=Dt(Math.sqrt(z*z*O+rt*rt*Bt)),Pt[1]=Dt(Math.sqrt(Z*Z*O+$*$*Bt)),Pt[2]=Dt(Math.sqrt(st*st*O+Q*Q*Bt)),Pt[3]=Dt(Fs(E[3],_[3],Bt)),(!U._setter||i)&&(R=`rgba(${xe(Pt[0],0)},${xe(Pt[1],0)},${xe(Pt[2],0)},${Pt[3]})`)}else Qt===se.COMPLEX&&(R=Vo(U,Bt,le));if(ot&&(U._number=ee),!i&&Xt!==Fe.blend){let Pt=U.property;q=U.target,U._setter?U._setter(q,ee,U):be?q[Pt]=R:ue===Me.ATTRIBUTE?q.setAttribute(Pt,R):(j=q.style,ue===Me.TRANSFORM?(q!==yt&&(yt=q,bt=q[Wi]),bt[Pt]=R,pe=1):ue===Me.CSS?j[Pt]=R:ue===Me.CSS_VAR&&j.setProperty(Pt,R)),b&&(B=1)}else U._value=R}else Tt&&Rt&&!qt&&k<U._startTime&&(U._currentTime=0);pe&&U._renderTransforms&&(j.transform=Bo(bt),pe=0),U=U._next}!e&&B&&n.onRender(n)}!e&&b&&n.onUpdate(n)}return r&&y?!e&&(r.began&&!W&&S>0&&!a||W&&S<=ne&&a)&&(n.onComplete(n),n.completed=!W):b&&C?c===1/0?n._startTime+=n.duration:n._currentIteration>=c-1&&(n.paused=!0,!a&&!m&&(n.completed=!0,!e&&!(r&&(W||!r.began))&&(n.onComplete(n),n._resolve(n)))):n.completed=!1,B},di=(n,t,e,i,s)=>{let r=n._currentIteration;if(Or(n,t,e,i,s),n._hasChildren){let o=n,a=o.backwards,l=i?t:o._iterationTime,c=Mi(),u=0,d=!0;if(!i&&o._currentIteration!==r){let h=o.iterationDuration;ye(o,f=>{if(!a)!f.completed&&!f.backwards&&f._currentTime<f.iterationDuration&&Or(f,h,e,1,We.FORCE),f.began=!1,f.completed=!1;else{let m=f.duration,x=f._offset+f._delay,g=x+m;!e&&m<=ne&&(!x||g===h)&&f.onComplete(f)}}),e||o.onLoop(o)}ye(o,h=>{let f=xe((l-h._offset)*h._speed,12);if(a&&f>h._delay+h.duration)return;let m=h._fps<o._fps?h.requestTick(c):s;u+=Or(h,f,e,i,m),!h.completed&&d&&(d=!1)},a),!e&&u&&o.onRender(o),(d||a)&&o._currentTime>=o.duration&&(o.paused=!0,o.completed||(o.completed=!0,e||(o.onComplete(o),o._resolve(o))))}};var qu={},Ho=(n,t,e)=>{if(e===Me.TRANSFORM){let i=Do.get(n);return i||n}else if(e===Me.CSS||e===Me.ATTRIBUTE&&Uo(t)&&n in t.style){let i=qu[n];if(i)return i;{let s=n&&pc(n);return qu[n]=s,s}}else return n},Br=(n,t=!1)=>{if(n._hasChildren)ye(n,e=>Br(e,t),!0);else{let e=n;e.pause(),ye(e,i=>{let s=i.property,r=i.target,o=i._tweenType,a=i._inlineValue,l=hi(a)||a===zn;if(i._setter){if(!t&&!l){if(yn(a,Rn),Rn.d){let c=Rn.d,u=i._numbers;for(let d=0,h=c.length;d<h;d++)u[d]=c[d]}else i._number=Rn.n;i._setter(i.target,i._number,i)}}else if(o===Me.OBJECT)!t&&!l&&(r[s]=a);else if(r[li])if(o===Me.ATTRIBUTE)t||(l?r.removeAttribute(s):r.setAttribute(s,a));else{let c=r.style;if(o===Me.TRANSFORM){let u=r[Wi];l?delete u[s]:u[s]=a,i._renderTransforms&&(Object.keys(u).length?c.transform=Bo(u):c.removeProperty("transform"))}else l?c.removeProperty(pc(s)):c[s]=a}r[li]&&e._tail===i&&e.targets.forEach(c=>{c.getAttribute&&c.getAttribute("style")===zn&&c.removeAttribute("style")})})}return n};var Bs=class{constructor(t=0){this.deltaTime=0,this._currentTime=t,this._lastTickTime=t,this._startTime=t,this._lastTime=t,this._frameDuration=ci/Pr,this._fps=Pr,this._speed=1,this._hasChildren=!1,this._head=null,this._tail=null}get fps(){return this._fps}set fps(t){let e=+t,i=e<ne?ne:e,s=ci/i;i>Us.frameRate&&(Us.frameRate=i),this._fps=i,this._frameDuration=s}get speed(){return this._speed}set speed(t){let e=+t;this._speed=e<ne?ne:e}requestTick(t){let e=this._frameDuration,i=t-this._lastTickTime,s=e*.25,r=s<4?s:4;return i+r<e?We.NONE:(this._lastTickTime=i>=e?t-i%e:t,We.AUTO)}computeDeltaTime(t){let e=t-this._lastTime;return this.deltaTime=e,this._lastTime=t,e}};var Ti={animation:null,update:an},Yu=n=>{let t=Ti.animation;return t||(t={duration:ne,computeDeltaTime:an,_offset:0,_delay:0,_head:null,_tail:null},Ti.animation=t,Ti.update=()=>{n.forEach(e=>{for(let i in e){let s=e[i],r=s._head;if(r){let o=r._valueType,a=o===se.COMPLEX||o===se.COLOR?Ve(r._fromNumbers):null,l=r._fromNumber,c=s._tail;for(;c&&c!==r;){if(a)for(let u=0,d=c._numbers.length;u<d;u++)a[u]+=c._numbers[u];else l+=c._number;c=c._prevAdd}r._toNumber=l,r._toNumbers=a}}}),Or(t,1,1,0,We.FORCE)}),t};var Zu=kn?requestAnimationFrame:setImmediate,Up=kn?cancelAnimationFrame:clearImmediate,Sc=class extends Bs{constructor(t){super(t),this.useDefaultMainLoop=!0,this.pauseOnDocumentHidden=!0,this.defaults=Us,this.paused=!0,this.reqId=0}update(){let t=this._currentTime=Mi();if(this.requestTick(t)){this.computeDeltaTime(t);let e=this._speed,i=this._fps,s=this._head;for(;s;){let r=s._next;s.paused?(bi(this,s),this._hasChildren=!!this._tail,s._running=!1,s.completed&&!s._cancelled&&s.cancel()):di(s,(t-s._startTime)*s._speed*e,0,0,s._fps<i?s.requestTick(t):We.AUTO),s=r}Ti.update()}}wake(){return this.useDefaultMainLoop&&!this.reqId&&(this.requestTick(Mi()),this.reqId=Zu(Ju)),this}pause(){if(this.reqId)return this.paused=!0,Fp()}resume(){if(this.paused)return this.paused=!1,ye(this,t=>t.resetTime()),this.wake()}get speed(){return this._speed*(de.timeScale===1?1:ci)}set speed(t){let e=t*de.timeScale;this._speed!==e&&(this._speed=e,ye(this,i=>i.speed=i._speed))}get timeUnit(){return de.timeScale===1?"ms":"s"}set timeUnit(t){let i=t==="s",s=i?.001:1;if(de.timeScale!==s){de.timeScale=s,de.tickThreshold=200*s;let r=i?.001:ci;this.defaults.duration*=r,this._speed*=r}}get precision(){return de.precision}set precision(t){de.precision=t}},Xe=(()=>{let n=new Sc(Mi());return kn&&(fc.engine=n,Gi.addEventListener("visibilitychange",()=>{n.pauseOnDocumentHidden&&(Gi.hidden?n.pause():n.resume())})),n})(),Ju=()=>{Xe._head?(Xe.reqId=Zu(Ju),Xe.update()):Xe.reqId=0},Fp=()=>(Up(Xe.reqId),Xe.reqId=0,Xe);var Go={_rep:new WeakMap,_add:new Map},zr=(n,t,e="_rep")=>{let i=Go[e],s=i.get(n);return s||(s={},i.set(n,s)),s[t]?s[t]:s[t]={_head:null,_tail:null}},Op=(n,t)=>n._isOverridden||n._absoluteStartTime>t._absoluteStartTime,kr=n=>{n._isOverlapped=1,n._isOverridden=1,n._changeDuration=ne,n._currentTime=ne},Wo=(n,t)=>{let e=n._composition;if(e===Fe.replace){let i=n._absoluteStartTime;Zn(t,n,Op,"_prevRep","_nextRep");let s=n._prevRep;if(s){let r=s.parent,o=s._absoluteEndTime;if(n.parent.id!==r.id&&r.iterationCount>1&&o+(r.duration-r.iterationDuration)>i){kr(s);let c=s._prevRep;for(;c&&c.parent.id===r.id;)kr(c),c=c._prevRep}let a=n._absoluteUpdateStartTime;if(o>a){let c=s._startTime,u=o-(c+s._updateDuration),d=xe(a-u-c,12);s._changeDuration=d,s._currentTime=d,s._isOverlapped=1,d<ne&&kr(s)}let l=n.parent.parent;if(!l||l!==r.parent){let c=!0;if(ye(r,u=>{u._isOverlapped||(c=!1)}),c){let u=r.parent;if(u){let d=!0;ye(u,h=>{h!==r&&ye(h,f=>{f._isOverlapped||(d=!1)})}),d&&u.cancel()}else r.cancel()}}}}else if(e===Fe.blend){let i=zr(n.target,n.property,"_add"),s=Yu(Go._add),r=i._head;r||(r={...n},r._composition=Fe.replace,r._updateDuration=ne,r._startTime=0,r._numbers=Ve(n._fromNumbers),r._number=0,r._next=null,r._prev=null,Zn(i,r),Zn(s,r));let o=n._toNumber;if(n._fromNumber=r._fromNumber-o,n._toNumber=0,n._numbers=Ve(n._fromNumbers),n._number=0,r._fromNumber=o,n._toNumbers.length){let a=Ve(n._toNumbers);a.forEach((l,c)=>{n._fromNumbers[c]=r._fromNumbers[c]-l,n._toNumbers[c]=0}),r._fromNumbers=a}Zn(i,n,null,"_prevAdd","_nextAdd")}return n},bc=n=>{let t=n._composition;if(t!==Fe.none){let e=n.target,i=n.property,o=Go._rep.get(e)[i];if(bi(o,n,"_prevRep","_nextRep"),t===Fe.blend){let a=Go._add,l=a.get(e);if(!l)return;let c=l[i],u=Ti.animation;bi(c,n,"_prevAdd","_nextAdd");let d=c._head;if(d&&d===c._tail){bi(c,d,"_prevAdd","_nextAdd"),bi(u,d);let h=!0;for(let f in l)if(l[f]._head){h=!1;break}h&&a.delete(e)}}}return n},$u=(n,t,e)=>{let i=!1;return ye(t,s=>{let r=s.target;if(n.includes(r)){let o=s.property,a=s._tweenType,l=Ho(e,r,a);(!l||l&&l===o)&&(s.parent._tail===s&&s._tweenType===Me.TRANSFORM&&s._prev&&s._prev._tweenType===Me.TRANSFORM&&(s._prev._renderTransforms=1),bi(t,s),bc(s),i=!0)}},!0),i},Tc=(n,t,e)=>{let i=t||Xe,s;if(i._hasChildren){let r=0;ye(i,o=>{if(!o._hasChildren)if(s=$u(n,o,e),s&&!o._head)o.cancel(),bi(i,o);else{let l=o._offset+o._delay+o.duration;l>r&&(r=l)}o._head?Tc(n,o,e):o._hasChildren=!1},!0),zt(i.iterationDuration)||(i.iterationDuration=r)}else s=$u(n,i,e);s&&!i._head&&(i._hasChildren=!1,i.cancel&&i.cancel())};var Ku=n=>(n.paused=!0,n.began=!1,n.completed=!1,n),Ec=n=>(n._cancelled&&(n._hasChildren?ye(n,Ec):ye(n,t=>{t._composition!==Fe.none&&Wo(t,zr(t.target,t.property))}),n._cancelled=0),n),ju=0,Bp=(n,t)=>n._priority>t._priority,_s=class extends Bs{constructor(t={},e=null,i=0){super(0),++ju;let{id:s,delay:r,duration:o,reversed:a,alternate:l,loop:c,loopDelay:u,autoplay:d,frameRate:h,playbackRate:f,priority:m,onComplete:x,onLoop:g,onPause:p,onBegin:S,onBeforeUpdate:A,onUpdate:M}=t;Lr.current&&Lr.current.register(this);let T=e?0:Xe._lastTickTime,b=e?e.defaults:de.defaults,C=ln(r)||zt(r)?b.delay:+r,y=ln(o)||zt(o)?1/0:+o,w=Oe(c,b.loop),P=Oe(u,b.loopDelay),F=w===!0||w===1/0||w<0?1/0:w+1,B=0;e?B=i:(Xe.reqId||Xe.requestTick(Mi()),B=(Xe._lastTickTime-Xe._startTime)*de.timeScale),this.id=zt(s)?ju:s,this.parent=e,this.duration=gs((y+P)*F-P)||ne,this.backwards=!1,this.paused=!0,this.began=!1,this.completed=!1,this.onBegin=S||b.onBegin,this.onBeforeUpdate=A||b.onBeforeUpdate,this.onUpdate=M||b.onUpdate,this.onLoop=g||b.onLoop,this.onPause=p||b.onPause,this.onComplete=x||b.onComplete,this.iterationDuration=y,this.iterationCount=F,this._autoplay=e?!1:Oe(d,b.autoplay),this._offset=B,this._delay=C,this._loopDelay=P,this._iterationTime=0,this._currentIteration=0,this._resolve=an,this._running=!1,this._reversed=+Oe(a,b.reversed),this._reverse=this._reversed,this._cancelled=0,this._alternate=Oe(l,b.alternate),this._prev=null,this._next=null,this._lastTickTime=T,this._startTime=T,this._lastTime=T,this._fps=Oe(h,b.frameRate),this._speed=Oe(f,b.playbackRate),this._priority=+Oe(m,1)}get cancelled(){return!!this._cancelled}set cancelled(t){t?this.cancel():this.reset(!0).play()}get currentTime(){return xn(xe(this._currentTime,de.precision),-this._delay,this.duration)}set currentTime(t){let e=this.paused;this.pause().seek(+t),e||this.resume()}get iterationCurrentTime(){return xn(xe(this._iterationTime,de.precision),0,this.iterationDuration)}set iterationCurrentTime(t){this.currentTime=this.iterationDuration*this._currentIteration+t}get progress(){return xn(xe(this._currentTime/this.duration,10),0,1)}set progress(t){this.currentTime=this.duration*t}get iterationProgress(){return xn(xe(this._iterationTime/this.iterationDuration,10),0,1)}set iterationProgress(t){let e=this.iterationDuration;this.currentTime=e*this._currentIteration+e*t}get currentIteration(){return this._currentIteration}set currentIteration(t){this.currentTime=this.iterationDuration*xn(+t,0,this.iterationCount-1)}get reversed(){return!!this._reversed}set reversed(t){t?this.reverse():this.play()}get speed(){return super.speed}set speed(t){super.speed=t,this.resetTime()}reset(t=!1){return Ec(this),this._reversed&&!this._reverse&&(this.reversed=!1),this._iterationTime=this.iterationDuration,di(this,0,1,~~t,We.FORCE),Ku(this),this._hasChildren&&ye(this,Ku),this}init(t=!1){this.fps=this._fps,this.speed=this._speed,!t&&this._hasChildren&&di(this,this.duration,1,~~t,We.FORCE),this.reset(t);let e=this._autoplay;return e===!0?this.resume():e&&!zt(e.linked)&&e.link(this),this}resetTime(){let t=1/(this._speed*Xe._speed);return this._startTime=Mi()-(this._currentTime+this._delay)*t,this}pause(){return this.paused?this:(this.paused=!0,this.onPause(this),this)}resume(){return this.paused?(this.paused=!1,this.duration<=ne&&!this._hasChildren?di(this,ne,0,0,We.FORCE):(this._running||(Zn(Xe,this,Bp),Xe._hasChildren=!0,this._running=!0),this.resetTime(),this._startTime-=12,Xe.wake()),this):this}restart(){return this.reset().resume()}seek(t,e=0,i=0){Ec(this),this.completed=!1;let s=this.paused;return this.paused=!0,di(this,t+this._delay,~~e,~~i,We.AUTO),s?this:this.resume()}alternate(){let t=this._reversed,e=this.iterationCount,i=this.iterationDuration,s=e===1/0?ms(Rr/i):e;return this._reversed=+(this._alternate&&!(s%2)?t:!t),e===1/0?this.iterationProgress=this._reversed?1-this.iterationProgress:this.iterationProgress:this.seek(i*s-this._currentTime),this.resetTime(),this}play(){return this._reversed&&this.alternate(),this.resume()}reverse(){return this._reversed||this.alternate(),this.resume()}cancel(){return this._hasChildren?ye(this,t=>t.cancel(),!0):ye(this,bc),this._cancelled=1,this.pause()}stretch(t){let e=this.duration,i=Si(t);if(e===i)return this;let s=t/e,r=t<=ne;return this.duration=r?ne:i,this.iterationDuration=r?ne:Si(this.iterationDuration*s),this._offset*=s,this._delay*=s,this._loopDelay*=s,this}revert(){di(this,0,1,0,We.AUTO);let t=this._autoplay;return t&&t.linked&&t.linked===this&&t.revert(),this.cancel()}complete(t=0){return this.seek(this.duration,t).cancel()}then(t=an){let e=this.then,i=()=>{this.then=null,t(this),this.then=e,this._resolve=an};return new Promise(s=>(this._resolve=()=>s(i()),this.completed&&this._resolve(),this))}};function Qu(n){let t=_n(n)?Lr.root.querySelectorAll(n):n;if(t instanceof NodeList||t instanceof HTMLCollection)return t}function Xo(n){if(hi(n))return[];if(!kn)return Vn(n)&&n.flat(1/0)||[n];if(Vn(n)){let e=n.flat(1/0),i=[];for(let s=0,r=e.length;s<r;s++){let o=e[s];if(!hi(o)){let a=Qu(o);if(a)for(let l=0,c=a.length;l<c;l++){let u=a[l];if(!hi(u)){let d=!1;for(let h=0,f=i.length;h<f;h++)if(i[h]===u){d=!0;break}d||i.push(u)}}else{let l=!1;for(let c=0,u=i.length;c<u;c++)if(i[c]===o){l=!0;break}l||i.push(o)}}}return i}let t=Qu(n);return t?Array.from(t):[n]}function qo(n){let t=Xo(n),e=t.length;for(let i=0;i<e;i++){let s=t[i];if(!s[uc]){s[uc]=!0;let r=Uo(s);(s.nodeType||r)&&(s[li]=!0,s[Lo]=r,s[Wi]={})}}return t}var wc={deg:1,rad:180/Fr,turn:360},td={},Ac=(n,t,e,i=!1)=>{let s=t.u,r=t.n;if(t.t===se.UNIT&&s===e)return t;let o=r+s+e,a=td[o];if(!zt(a)&&!i)t.n=a;else{let l;if(s in wc)l=r*wc[s]/wc[e];else{let u=n.cloneNode(),d=n.parentNode,h=d&&d!==Gi?d:Gi.body;h.appendChild(u);let f=u.style;f.width=100+s;let m=u.offsetWidth||100;f.width=100+e;let x=u.offsetWidth||100,g=m/x;h.removeChild(u),l=g*r}t.n=l,td[o]=l}return t.t,se.UNIT,t.u=e,t};var Ei=n=>n;var Vr=(n=1.68)=>t=>ps(t,+n),Rc={in:n=>t=>n(t),out:n=>t=>1-n(1-t),inOut:n=>t=>t<.5?n(t*2)/2:1-n(t*-2+2)/2,outIn:n=>t=>t<.5?(1-n(1-t*2))/2:(n(t*2-1)+1)/2},kp=Fr/2,ed=Fr*2,nd={[zn]:Vr,Quad:Vr(2),Cubic:Vr(3),Quart:Vr(4),Quint:Vr(5),Sine:n=>1-zu(n*kp),Circ:n=>1-Nr(1-n*n),Expo:n=>n?ps(2,10*n-10):0,Bounce:n=>{let t,e=4;for(;n<((t=ps(2,--e))-1)/11;);return 1/ps(4,3-e)-7.5625*ps((t*3-2)/22-n,2)},Back:(n=1.7)=>t=>(+n+1)*t*t*t-+n*t*t,Elastic:(n=1,t=.3)=>{let e=xn(+n,1,10),i=xn(+t,ne,2),s=i/ed*Vu(1/e),r=ed/i;return o=>o===0||o===1?o:-e*ps(2,-10*(1-o))*ku((1-o-s)*r)}},Cc=(()=>{let n={linear:Ei,none:Ei};for(let t in Rc)for(let e in nd){let i=nd[e],s=Rc[t];n[t+e]=e===zn||e==="Back"||e==="Elastic"?(r,o)=>s(i(r,o)):s(i)}return n})(),Yo={linear:Ei,none:Ei},zp=n=>{if(Yo[n])return Yo[n];if(n.indexOf("(")<=-1){let e=Rc[n]||n.includes("Back")||n.includes("Elastic")?Cc[n]():Cc[n];return e?Yo[n]=e:Ei}else{let t=n.slice(0,-1).split("("),e=Cc[t[0]];return e?Yo[n]=e(...t[1].split(",")):Ei}},id=["steps(","irregular(","linear(","cubicBezier("],xs=n=>{if(_n(n)){for(let e=0,i=id.length;e<i;e++)if(Cn(n,id[e]))return console.warn(`String syntax for \`ease: "${n}"\` has been removed from the core and replaced by importing and passing the easing function directly: \`ease: ${n}\``),Ei}return ln(n)?n:_n(n)?zp(n):Ei};var Jt=zo(),re=zo(),ks={},Zo={func:null},Jo={func:null},$o=[null],zs=[null,null],Ko={to:null},Vp=0,sd=0,qi,fi,Hp=(n,t)=>{let e={};if(Vn(n)){let i=[].concat(...n.map(s=>Object.keys(s))).filter(Dr);for(let s=0,r=i.length;s<r;s++){let o=i[s],a=n.map(l=>{let c={};for(let u in l){let d=l[u];Dr(u)?u===o&&(c.to=d):c[u]=d}return c});e[o]=a}}else{let i=Oe(t.duration,de.defaults.duration);Object.keys(n).map(r=>({o:parseFloat(r)/100,p:n[r]})).sort((r,o)=>r.o-o.o).forEach(r=>{let o=r.o,a=r.p;for(let l in a)if(Dr(l)){let c=e[l];c||(c=e[l]=[]);let u=o*i,d=c.length,h=c[d-1],f={to:a[l]},m=0;for(let x=0;x<d;x++)m+=c[x].duration;d===1&&(f.from=h.to),a.ease&&(f.ease=a.ease),f.duration=u-(d?m:0),c.push(f)}return r});for(let r in e){let o=e[r],a;for(let l=0,c=o.length;l<c;l++){let u=o[l],d=u.ease;u.ease=a||void 0,a=d}o[0].duration||o.shift()}}return e},Vs=class extends _s{constructor(t,e,i,s,r=!1,o=0,a){super(e,i,s),this._head,this._tail,++sd;let l=qo(t),c=l.length,u=e.keyframes,d=u?Oo(Hp(u,e),e):e,{id:h,delay:f,duration:m,ease:x,playbackEase:g,modifier:p,composition:S,onRender:A}=d,M=i?i.defaults:de.defaults,T=Oe(x,M.ease),b=Oe(g,M.playbackEase),C=b?xs(b):null,y=!zt(T.ease),w=y?T.ease:Oe(x,C?"linear":M.ease),P=y?T.settlingDuration:Oe(m,M.duration),F=Oe(f,M.delay),B=p||M.modifier,V=zt(S)&&c>=ci?Fe.none:zt(S)?M.composition:S,I=this._offset+(i?i._offset:0);y&&(T.parent=this);let k=NaN,W=NaN,J=0,et=0;for(let U=0;U<c;U++){let q=l[U],j=o||U,yt=a||l,bt=NaN,pe=NaN;for(let Xt in d)if(Dr(Xt)){let Tt=vc(q,Xt),Y=ko(q,Xt),K=Ho(Xt,q,Tt),it=d[Xt],Rt=Vn(it);if(r&&!Rt&&(zs[0]=it,zs[1]=it,it=zs),Rt){let Bt=it.length,Dt=!fs(it[0]);Bt===2&&Dt?(Ko.to=it,$o[0]=Ko,qi=$o):Bt>2&&Dt?(qi=[],it.forEach((Qt,ue)=>{ue?ue===1?(zs[1]=Qt,qi.push(zs)):qi.push(Qt):zs[0]=Qt})):qi=it}else $o[0]=it,qi=$o;let ot=null,ut=null,qt=NaN,Ot=0,Gt=0;for(let Bt=qi.length;Gt<Bt;Gt++){let Dt=qi[Gt];fs(Dt)?fi=Dt:(Ko.to=Dt,fi=Ko),Zo.func=null,Jo.func=null;let Qt=ui(Oe(fi.composition,V),q,j,yt,null,null),ue=gn(Qt)?Qt:Fe[Qt];!ot&&ue!==Fe.none&&(ot=zr(q,K));let be=ot?ot._tail:null,Kt=i&&be&&be.parent.parent===i?be:ut,le=ui(fi.to,q,j,yt,Zo,Kt),R;fs(le)&&!zt(le.to)?(fi=le,R=le.to):R=le;let ee=ui(fi.from,q,j,yt,Jo,Kt),Pt=fi.ease||w,E=ui(Pt,q,j,yt,null,Kt),_=ln(E)||_n(E)?E:Pt,O=!zt(_)&&!zt(_.ease),z=O?_.ease:_,Z=O?_.settlingDuration:ui(Oe(fi.duration,Bt>1?ui(P,q,j,yt,null,Kt)/Bt:P),q,j,yt,null,Kt),st=ui(Oe(fi.delay,Gt?0:F),q,j,yt,null,Kt),rt=fi.modifier||B,$=!zt(ee),Q=!zt(R),at=Vn(R),Ut=at||$&&Q,dt=ut?Ot:0,ct=ut?Ot+st:st,It=xe(I+ct,12),Vt=xe(I+dt,12);!et&&($||at)&&(et=1);let kt=ut;if(ue!==Fe.none){let Nt=ot._head;for(;Nt&&Nt._absoluteStartTime<=It;)if(Nt._isOverridden||(kt=Nt),Nt=Nt._nextRep,Nt&&Nt._absoluteStartTime>=It)for(;Nt;)kr(Nt),Nt=Nt._nextRep}if(Ut){yn(at?ui(R[0],q,j,yt,Jo,Kt):ee,Jt),yn(at?ui(R[1],q,j,yt,Zo,Kt):R,re);let Nt=Xi(q,K,Tt,ks);Jt.t===se.NUMBER&&(kt?kt._valueType===se.UNIT&&(Jt.t=se.UNIT,Jt.u=kt._unit):(yn(Nt,Rn),Rn.t===se.UNIT&&(Jt.t=se.UNIT,Jt.u=Rn.u)))}else Q?yn(R,re):ut?Mc(ut,re):yn(i&&kt&&kt.parent.parent===i?kt._value:Xi(q,K,Tt,ks),re),$?yn(ee,Jt):ut?Mc(ut,Jt):yn(i&&kt&&kt.parent.parent===i?kt._value:Xi(q,K,Tt,ks),Jt);if(Jt.o&&(Jt.n=Os(kt?kt._toNumber:yn(Xi(q,K,Tt,ks),Rn).n,Jt.n,Jt.o)),re.o&&(re.n=Os(Jt.n,re.n,re.o)),Jt.t!==re.t){if(Jt.t===se.COMPLEX||re.t===se.COMPLEX){let Nt=Jt.t===se.COMPLEX?Jt:re,$t=Jt.t===se.COMPLEX?re:Jt;$t.t=se.COMPLEX,$t.s=Ve(Nt.s),$t.d=Nt.d.map(()=>$t.n)}else if(Jt.t===se.UNIT||re.t===se.UNIT){let Nt=Jt.t===se.UNIT?Jt:re,$t=Jt.t===se.UNIT?re:Jt;$t.t=se.UNIT,$t.u=Nt.u}else if(Jt.t===se.COLOR||re.t===se.COLOR){let Nt=Jt.t===se.COLOR?Jt:re,$t=Jt.t===se.COLOR?re:Jt;$t.t=se.COLOR,$t.d=Nt.d.map(()=>0)}}if(Jt.u!==re.u){let Nt=re.u?Jt:re;Nt=Ac(q,Nt,re.u?re.u:Jt.u,!1)}if(re.d&&Jt.d&&re.d.length!==Jt.d.length){let Nt=Jt.d.length>re.d.length?Jt:re,$t=Nt===Jt?re:Jt;$t.d=Nt.d.map((On,An)=>zt($t.d[An])?0:$t.d[An]),$t.s=Ve(Nt.s)}let N=xe(+Z||ne,12),ht=ks[K];hi(ht)||(ks[K]=null);let tt=Y?Y.set:null;Ot=xe(ct+N,12);let lt=Jt.d,mt=re.d,nt=re.s,xt={parent:this,id:Vp++,property:K,target:q,_value:null,_toFunc:Zo.func,_fromFunc:Jo.func,_ease:xs(z),_fromNumbers:lt?Ve(lt):Ir,_toNumbers:mt?Ve(mt):Ir,_strings:nt?Ve(nt):Ir,_fromNumber:Jt.n,_toNumber:re.n,_numbers:lt?Ve(lt):Ir,_number:Jt.n,_unit:re.u,_modifier:rt,_currentTime:0,_startTime:ct,_delay:+st,_updateDuration:N,_changeDuration:N,_absoluteStartTime:It,_absoluteUpdateStartTime:Vt,_absoluteEndTime:xe(I+Ot,12),_hasFromValue:$||at?1:0,_tweenType:Tt,_setter:tt,_valueType:re.t,_composition:ue,_isOverlapped:0,_isOverridden:0,_renderTransforms:0,_inlineValue:ht,_prevRep:null,_nextRep:null,_prevAdd:null,_nextAdd:null,_prev:null,_next:null};ue!==Fe.none&&Wo(xt,ot);let Et=xt._valueType;if(Et===se.COMPLEX)xt._value=Vo(xt,1,-1);else if(Et===se.UNIT)xt._value=`${rt(xt._toNumber)}${xt._unit}`;else if(Et===se.COLOR){let Nt=re.d;xt._value=`rgba(${xe(Nt[0],0)},${xe(Nt[1],0)},${xe(Nt[2],0)},${Nt[3]})`}else xt._value=rt(xt._toNumber);isNaN(qt)&&(qt=xt._startTime),ut=xt,J++,Zn(this,xt)}(isNaN(W)||qt<W)&&(W=qt),(isNaN(k)||Ot>k)&&(k=Ot),Tt===Me.TRANSFORM&&(bt=J-Gt,pe=J)}if(!isNaN(bt)){let Xt=0;ye(this,Tt=>{Xt>=bt&&Xt<pe&&(Tt._renderTransforms=1,Tt._composition===Fe.blend&&ye(Ti.animation,Y=>{Y.id===Tt.id&&(Y._renderTransforms=1)})),Xt++})}}c||console.warn("No target found. Make sure the element you're trying to animate is accessible before creating your animation."),W?(ye(this,U=>{U._startTime-U._delay||(U._delay-=W),U._startTime-=W}),k-=W):W=0,k||(k=ne,this.iterationCount=0),this.targets=l,this.id=zt(h)?sd:h,this.duration=k===ne?ne:gs((k+this._loopDelay)*this.iterationCount-this._loopDelay)||ne,this.onRender=A||M.onRender,this._ease=C,this._delay=W,this.iterationDuration=k,!this._autoplay&&et&&this.onRender(this)}stretch(t){let e=this.duration;if(e===Si(t))return this;let i=t/e;return ye(this,s=>{s._updateDuration=Si(s._updateDuration*i),s._changeDuration=Si(s._changeDuration*i),s._currentTime*=i,s._delay*=i,s._startTime*=i,s._absoluteStartTime*=i,s._absoluteUpdateStartTime*=i,s._absoluteEndTime*=i}),super.stretch(t)}refresh(){return ye(this,t=>{let e=t._toFunc,i=t._fromFunc;(e||i)&&(i?(yn(i(),Jt),Jt.u!==t._unit&&t.target[li]&&Ac(t.target,Jt,t._unit,!0),t._fromNumbers=Ve(Jt.d),t._fromNumber=Jt.n):e&&(yn(Xi(t.target,t.property,t._tweenType),Rn),t._fromNumbers=Ve(Rn.d),t._fromNumber=Rn.n),e&&(yn(e(),re),t._toNumbers=Ve(re.d),t._strings=Ve(re.s),t._toNumber=re.o?Os(t._fromNumber,re.n,re.o):re.n))}),this.duration===ne&&this.restart(),this}revert(){return super.revert(),Br(this)}then(t){return super.then(t)}},Hs=(n,t)=>de.editor?de.editor.addAnimation(n,t):new Vs(n,t,null,0,!1).init();var Gp=(n,t)=>{if(Cn(t,"<")){let e=t[1]==="<",i=n._tail,s=i?i._offset+i._delay:0;return e?s:s+i.duration}},ys=(n,t)=>{let e=n.iterationDuration;if(e===ne&&(e=0),zt(t))return e;if(gn(+t))return+t;let i=t,s=n?n.labels:null,r=!hi(s),o=Gp(n,i),a=!zt(o),l=Nu.exec(i);if(l){let c=l[0],u=i.split(c),d=r&&u[0]?s[u[0]]:e,h=a?o:r?d:e,f=+u[1];return Os(h,f,c[0])}else return a?o:r?zt(s[i])?e:s[i]:e};function Wp(n){return gs((n.iterationDuration+n._loopDelay)*n.iterationCount-n._loopDelay)||ne}function Pc(n,t,e,i,s,r){let a=gn(n.duration)&&n.duration<=ne?e-ne:e;t.composition&&di(t,a,1,1,We.AUTO);let l=i?new Vs(i,n,t,a,!1,s,r):new _s(n,t,a);return t.composition&&l.init(!0),Zn(t,l),ye(t,c=>{let d=c._offset+c._delay+c.duration;d>t.iterationDuration&&(t.iterationDuration=d)}),t.duration=Wp(t),t}var rd=0,jo=class extends _s{constructor(t={}){super(t,null,0),++rd,this.id=zt(t.id)?rd:t.id,this.duration=0,this.labels={};let e=t.defaults,i=de.defaults;this.defaults=e?Oo(e,i):i,this.composition=Oe(t.composition,!0),this.onRender=t.onRender||i.onRender;let s=Oe(t.playbackEase,i.playbackEase);this._ease=s?xs(s):null,this.iterationDuration=0}add(t,e,i){let s=fs(e),r=fs(t);if(s||r){if(this._hasChildren=!0,s){let o=e,a=de.editor&&de.editor.addTimelineChild,l=i&&i.type==="Stagger"&&de.editor,c=ln(i)?i:null;if(c||l){let u=Xo(t),d=this.duration,h=this.iterationDuration,f=o.id,m=0,x=u.length,g=a?a(t,o,this.id,i,x):null,p=c||de.editor.resolveStagger(i.defaultValue);u.forEach(S=>{let A={...g||o};this.duration=d,this.iterationDuration=h,zt(f)||(A.id=f+"-"+m);let M=ys(this,p(S,m,u,null,this));Pc(A,this,M,S,m,u),m++})}else{let u=a?a(t,o,this.id,i):o,d=i&&i.type?i.defaultValue:i;Pc(u,this,ys(this,d),t)}}else Pc(t,this,ys(this,e));return this.composition&&this.init(!0),this}}sync(t,e){if(zt(t)||t&&zt(t.pause))return this;t.pause();let i=+(t.effect?t.effect.getTiming().duration:t.duration);!zt(t)&&!zt(t.persist)&&(t.persist=!0);let s=de.editor,r=s&&s.addTimelineChild;s&&s.addTimelineSync&&(e=s.addTimelineSync(t,e,this.id),s.addTimelineChild=null);let o=this.add(t,{currentTime:[0,i],duration:i,delay:0,ease:"linear",playbackEase:"linear"},e);return s&&(s.addTimelineChild=r),o}set(t,e,i){return zt(e)?this:(e.duration=ne,e.composition=Fe.replace,this.add(t,e,i))}call(t,e){return zt(t)||t&&!ln(t)?this:(de.editor&&de.editor.addTimelineCall&&(e=de.editor.addTimelineCall(t,e,this.id)),this.add({duration:0,delay:0,onComplete:()=>t(this)},e))}label(t,e){return zt(t)||t&&!_n(t)?this:(de.editor&&de.editor.addTimelineLabel&&(e=de.editor.addTimelineLabel(t,e,this.id)),this.labels[t]=ys(this,e),this)}remove(t,e){return Tc(Xo(t),this,e),this}stretch(t){let e=this.duration;if(e===Si(t))return this;let i=t/e,s=this.labels;ye(this,r=>r.stretch(r.duration*i));for(let r in s)s[r]*=i;return super.stretch(t)}refresh(){return ye(this,t=>{t.refresh&&t.refresh()}),this}revert(){return super.revert(),ye(this,t=>t.revert,!0),Br(this)}then(t){return super.then(t)}},Ic=n=>de.editor?de.editor.addTimeline(n):new jo(n).init();var Lc=(n=0,t=1,e=0)=>{let i=10**e;return Math.floor((Math.random()*(t-n+1/i)+n)*i)/i},Xp=0,od=(n,t=0,e=1,i=0)=>{let s=n===void 0?Xp++:n;return(r=t,o=e,a=i)=>{s+=1831565813,s=Math.imul(s^s>>>15,s|1),s^=s+Math.imul(s^s>>>7,s|61);let l=10**a;return Math.floor((((s^s>>>14)>>>0)/4294967296*(o-r+1/l)+r)*l)/l}};var ad=(n,t=Lc)=>{let e=n.length,i,s;for(;e;)s=t(0,--e),i=n[e],n[e]=n[s],n[s]=i;return n};var wi=(n,t={})=>{let e=[],i=0,s,r=null,o=t.from,a=t.reversed,l=t.ease,c=!zt(l),d=c&&!zt(l.ease)?l.ease:c?xs(l):null,h=t.grid,f=h===!0,m=t.axis,x=t.total,g=zt(o)||o===0||o==="first",p=o==="center",S=o==="last",A=o==="random",M=Vn(o),T=Vn(n),b=t.use,C=T?Fo(n[0]):Fo(n),y=T?Fo(n[1]):0,w=No.exec((T?n[1]:n)+zn),P=t.start||0+(T?C:0),F=t.seed,V=!zt(F)&&F!==!1?od(F===!0?0:F):Lc,I=t.jitter,k=!zt(I),W=Vn(I),J=W?I[0]:I||0,et=W?I[1]:I||0,U=g?0:gn(o)?o:0;return(q,j,yt,bt,pe)=>{let[Xt]=qo(q),Tt=zt(x)?yt.length:x,Y=zt(b)?!1:ln(b)?b(Xt,j,Tt):Xi(Xt,b),K=gn(Y)||_n(Y)&&gn(+Y)?+Y:j,it=K>=0&&K<Tt?K:j;if(p&&(U=(Tt-1)/2),S&&(U=Tt-1),!e.length){if(f){let ut=!0,qt=!1,Ot=1/0,Gt=1/0,Bt=1/0,Dt=-1/0,Qt=-1/0,ue=-1/0,be=[],Kt=[],le=[];for(let R=0;R<Tt;R++){let ee=yt[R],Pt=0,E=0,_=0,O=!1;if(ee&&ln(ee.getBoundingClientRect)){let z=ee.getBoundingClientRect();Pt=z.left+z.width/2,E=z.top+z.height/2,O=!0}else{let z=ee;z&&gn(z.x)&&gn(z.y)&&(Pt=z.x,E=z.y,gn(z.z)&&(_=z.z,qt=!0),O=!0)}if(!O){ut=!1;break}be.push(Pt),Kt.push(E),le.push(_),Pt<Ot&&(Ot=Pt),E<Gt&&(Gt=E),_<Bt&&(Bt=_),Pt>Dt&&(Dt=Pt),E>Qt&&(Qt=E),_>ue&&(ue=_)}if(ut){let R=be[0],ee=Kt[0],Pt=le[0];M?(R=Ot+o[0]*(Dt-Ot),ee=Gt+o[1]*(Qt-Gt),Pt=qt?Bt+(o.length>=3?o[2]:.5)*(ue-Bt):0):p?(R=(Ot+Dt)/2,ee=(Gt+Qt)/2,Pt=(Bt+ue)/2):S?(R=be[Tt-1],ee=Kt[Tt-1],Pt=le[Tt-1]):gn(o)&&(R=be[o],ee=Kt[o],Pt=le[o]);for(let _=0;_<Tt;_++){let O=R-be[_],z=ee-Kt[_],Z=Pt-le[_],st=Nr(O*O+z*z+(qt?Z*Z:0));m==="x"&&(st=-O),m==="y"&&(st=-z),m==="z"&&(st=-Z),e.push(st)}let E=1/0;for(let _=0;_<Tt;_++){let O=Ur(e[_]);O>0&&O<E&&(E=O)}if(E>0&&E<1/0)for(let _=0;_<Tt;_++)e[_]=e[_]/E}else for(let R=0;R<Tt;R++)e.push(Ur(U-R))}else for(let ut=0;ut<Tt;ut++)if(!h)e.push(Ur(U-ut));else{let qt=h.length,Ot=h[0]*h[1],Gt,Bt,Dt;M?(Gt=o[0]*(h[0]-1),Bt=o[1]*(h[1]-1),Dt=qt===3?(o.length>=3?o[2]:.5)*(h[2]-1):0):p?(Gt=(h[0]-1)/2,Bt=(h[1]-1)/2,Dt=qt===3?(h[2]-1)/2:0):(Gt=U%h[0],Bt=ms(U/h[0])%h[1],Dt=qt===3?ms(U/Ot):0);let Qt=ut%h[0],ue=ms(ut/h[0])%h[1],be=qt===3?ms(ut/Ot):0,Kt=Gt-Qt,le=Bt-ue,R=Dt-be,ee=Nr(Kt*Kt+le*le+(qt===3?R*R:0));m==="x"&&(ee=-Kt),m==="y"&&(ee=-le),m==="z"&&(ee=-R),e.push(ee)}i=e[0];for(let ut=1;ut<Tt;ut++)e[ut]>i&&(i=e[ut]);if(d||a)for(let ut=0;ut<Tt;ut++){let qt=e[ut];d&&(qt=d(qt/i)*i),a&&(qt=m?-qt:Ur(i-qt)),e[ut]=qt}if(k){r=new Array(Tt);for(let ut=0;ut<Tt;ut++)r[ut]=V(-1,1,4)}A&&(e=ad(e,V))}let Rt=T?(y-C)/i:C;zt(s)&&(s=pe?ys(pe,zt(t.start)?pe.iterationDuration:P):P);let ot=s+(Rt*xe(e[it],2)||0);if(k){let ut=i?e[it]/i:0,qt=J+(et-J)*ut;ot=ot+r[it]*qt}return t.modifier&&(ot=t.modifier(ot)),w&&(ot=`${ot}${w[2]}`),ot}};var rs={LEFT:0,MIDDLE:1,RIGHT:2,ROTATE:0,DOLLY:1,PAN:2},os={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},Fd=0,hh=1,Od=2;var po=1,Bd=2,yr=3,as=0,pn=1,Wn=2,xi=0,vr=1,uh=2,dh=3,fh=4,kd=5;var Cs=100,zd=101,Vd=102,Hd=103,Gd=104,Wd=200,Xd=201,qd=202,Yd=203,ph=204,mh=205,Zd=206,Jd=207,$d=208,Kd=209,jd=210,Qd=211,tf=212,ef=213,nf=214,wa=0,Aa=1,Ca=2,rr=3,Ra=4,Pa=5,Ia=6,La=7,gh=0,sf=1,rf=2,ti=0,_h=1,xh=2,yh=3,mo=4,vh=5,Mh=6,Sh=7;var bh=300,ls=301,Rs=302,al=303,ll=304,go=306,Da=1e3,mi=1001,Na=1002,$e=1003,of=1004;var _o=1005;var je=1006,cl=1007;var cs=1008;var bn=1009,Th=1010,Eh=1011,Mr=1012,hl=1013,ei=1014,ni=1015,ii=1016,ul=1017,dl=1018,Sr=1020,wh=35902,Ah=35899,Ch=1021,Rh=1022,Xn=1023,gi=1026,hs=1027,Ph=1028,fl=1029,us=1030,pl=1031;var ml=1033,xo=33776,yo=33777,vo=33778,Mo=33779,gl=35840,_l=35841,xl=35842,yl=35843,vl=36196,Ml=37492,Sl=37496,bl=37488,Tl=37489,So=37490,El=37491,wl=37808,Al=37809,Cl=37810,Rl=37811,Pl=37812,Il=37813,Ll=37814,Dl=37815,Nl=37816,Ul=37817,Fl=37818,Ol=37819,Bl=37820,kl=37821,zl=36492,Vl=36494,Hl=36495,Gl=36283,Wl=36284,bo=36285,Xl=36286;var Zr=2300,Ua=2301,Ta=2302,ih=2303,sh=2400,rh=2401,oh=2402;var af=3200;var ql=0,lf=1,Bi="",hn="srgb",Jr="srgb-linear",$r="linear",Se="srgb";var Ea=7680;var cf=519,hf=512,uf=513,df=514,Yl=515,ff=516,pf=517,Zl=518,mf=519,gf=35044;var Ih="300 es",jn=2e3,or=2001;function qp(n){for(let t=n.length-1;t>=0;--t)if(n[t]>=65535)return!0;return!1}function Yp(n){return ArrayBuffer.isView(n)&&!(n instanceof DataView)}function Kr(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function _f(){let n=Kr("canvas");return n.style.display="block",n}var ld={},ar=null;function Lh(...n){let t="THREE."+n.shift();ar?ar("log",t,...n):console.log(t,...n)}function xf(n){let t=n[0];if(typeof t=="string"&&t.startsWith("TSL:")){let e=n[1];e&&e.isStackTrace?n[0]+=" "+e.getLocation():n[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return n}function Ht(...n){n=xf(n);let t="THREE."+n.shift();if(ar)ar("warn",t,...n);else{let e=n[0];e&&e.isStackTrace?console.warn(e.getError(t)):console.warn(t,...n)}}function Zt(...n){n=xf(n);let t="THREE."+n.shift();if(ar)ar("error",t,...n);else{let e=n[0];e&&e.isStackTrace?console.error(e.getError(t)):console.error(t,...n)}}function Ts(...n){let t=n.join(" ");t in ld||(ld[t]=!0,Ht(...n))}function yf(n,t,e){return new Promise(function(i,s){function r(){switch(n.clientWaitSync(t,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:s();break;case n.TIMEOUT_EXPIRED:setTimeout(r,e);break;default:i()}}setTimeout(r,e)})}var vf={[wa]:Aa,[Ca]:Ia,[Ra]:La,[rr]:Pa,[Aa]:wa,[Ia]:Ca,[La]:Ra,[Pa]:rr},Qn=class{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});let i=this._listeners;i[t]===void 0&&(i[t]=[]),i[t].indexOf(e)===-1&&i[t].push(e)}hasEventListener(t,e){let i=this._listeners;return i===void 0?!1:i[t]!==void 0&&i[t].indexOf(e)!==-1}removeEventListener(t,e){let i=this._listeners;if(i===void 0)return;let s=i[t];if(s!==void 0){let r=s.indexOf(e);r!==-1&&s.splice(r,1)}}dispatchEvent(t){let e=this._listeners;if(e===void 0)return;let i=e[t.type];if(i!==void 0){t.target=this;let s=i.slice(0);for(let r=0,o=s.length;r<o;r++)s[r].call(this,t);t.target=null}}},tn=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],cd=1234567,ir=Math.PI/180,lr=180/Math.PI;function br(){let n=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(tn[n&255]+tn[n>>8&255]+tn[n>>16&255]+tn[n>>24&255]+"-"+tn[t&255]+tn[t>>8&255]+"-"+tn[t>>16&15|64]+tn[t>>24&255]+"-"+tn[e&63|128]+tn[e>>8&255]+"-"+tn[e>>16&255]+tn[e>>24&255]+tn[i&255]+tn[i>>8&255]+tn[i>>16&255]+tn[i>>24&255]).toLowerCase()}function fe(n,t,e){return Math.max(t,Math.min(e,n))}function Dh(n,t){return(n%t+t)%t}function Zp(n,t,e,i,s){return i+(n-t)*(s-i)/(e-t)}function Jp(n,t,e){return n!==t?(e-n)/(t-n):0}function Yr(n,t,e){return(1-e)*n+e*t}function $p(n,t,e,i){return Yr(n,t,1-Math.exp(-e*i))}function Kp(n,t=1){return t-Math.abs(Dh(n,t*2)-t)}function jp(n,t,e){return n<=t?0:n>=e?1:(n=(n-t)/(e-t),n*n*(3-2*n))}function Qp(n,t,e){return n<=t?0:n>=e?1:(n=(n-t)/(e-t),n*n*n*(n*(n*6-15)+10))}function tm(n,t){return n+Math.floor(Math.random()*(t-n+1))}function em(n,t){return n+Math.random()*(t-n)}function nm(n){return n*(.5-Math.random())}function im(n){n!==void 0&&(cd=n);let t=cd+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function sm(n){return n*ir}function rm(n){return n*lr}function om(n){return n>0&&Number.isInteger(n)&&2**Math.round(Math.log2(n))===n}function am(n){return Math.pow(2,Math.ceil(Math.log(n)/Math.LN2))}function lm(n){return Math.pow(2,Math.floor(Math.log(n)/Math.LN2))}function cm(n,t,e,i,s){let r=Math.cos,o=Math.sin,a=r(e/2),l=o(e/2),c=r((t+i)/2),u=o((t+i)/2),d=r((t-i)/2),h=o((t-i)/2),f=r((i-t)/2),m=o((i-t)/2);switch(s){case"XYX":n.set(a*u,l*d,l*h,a*c);break;case"YZY":n.set(l*h,a*u,l*d,a*c);break;case"ZXZ":n.set(l*d,l*h,a*u,a*c);break;case"XZX":n.set(a*u,l*m,l*f,a*c);break;case"YXY":n.set(l*f,a*u,l*m,a*c);break;case"ZYZ":n.set(l*m,l*f,a*u,a*c);break;default:Ht("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function nr(n,t){switch(t.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:case Uint8ClampedArray:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("THREE.MathUtils: Invalid component type.")}}function cn(n,t){switch(t.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:case Uint8ClampedArray:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("THREE.MathUtils: Invalid component type.")}}var Nh={DEG2RAD:ir,RAD2DEG:lr,generateUUID:br,clamp:fe,euclideanModulo:Dh,mapLinear:Zp,inverseLerp:Jp,lerp:Yr,damp:$p,pingpong:Kp,smoothstep:jp,smootherstep:Qp,randInt:tm,randFloat:em,randFloatSpread:nm,seededRandom:im,degToRad:sm,radToDeg:rm,isPowerOfTwo:om,ceilPowerOfTwo:am,floorPowerOfTwo:lm,setQuaternionFromProperEuler:cm,normalize:cn,denormalize:nr},kh=class kh{constructor(t=0,e=0){this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("THREE.Vector2: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){let e=this.x,i=this.y,s=t.elements;return this.x=s[0]*e+s[3]*i+s[6],this.y=s[1]*e+s[4]*i+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=fe(this.x,t.x,e.x),this.y=fe(this.y,t.y,e.y),this}clampScalar(t,e){return this.x=fe(this.x,t,e),this.y=fe(this.y,t,e),this}clampLength(t,e){let i=this.length();return this.divideScalar(i||1).multiplyScalar(fe(i,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let i=this.dot(t)/e;return Math.acos(fe(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,i=this.y-t.y;return e*e+i*i}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){let i=Math.cos(e),s=Math.sin(e),r=this.x-t.x,o=this.y-t.y;return this.x=r*i-o*s+t.x,this.y=r*s+o*i+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}};kh.prototype.isVector2=!0;var Yt=kh,Dn=class{constructor(t=0,e=0,i=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=i,this._w=s}static slerpFlat(t,e,i,s,r,o,a){let l=i[s+0],c=i[s+1],u=i[s+2],d=i[s+3],h=r[o+0],f=r[o+1],m=r[o+2],x=r[o+3];if(d!==x||l!==h||c!==f||u!==m){let g=l*h+c*f+u*m+d*x;g<0&&(h=-h,f=-f,m=-m,x=-x,g=-g);let p=1-a;if(g<.9995){let S=Math.acos(g),A=Math.sin(S);p=Math.sin(p*S)/A,a=Math.sin(a*S)/A,l=l*p+h*a,c=c*p+f*a,u=u*p+m*a,d=d*p+x*a}else{l=l*p+h*a,c=c*p+f*a,u=u*p+m*a,d=d*p+x*a;let S=1/Math.sqrt(l*l+c*c+u*u+d*d);l*=S,c*=S,u*=S,d*=S}}t[e]=l,t[e+1]=c,t[e+2]=u,t[e+3]=d}static multiplyQuaternionsFlat(t,e,i,s,r,o){let a=i[s],l=i[s+1],c=i[s+2],u=i[s+3],d=r[o],h=r[o+1],f=r[o+2],m=r[o+3];return t[e]=a*m+u*d+l*f-c*h,t[e+1]=l*m+u*h+c*d-a*f,t[e+2]=c*m+u*f+a*h-l*d,t[e+3]=u*m-a*d-l*h-c*f,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,i,s){return this._x=t,this._y=e,this._z=i,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){let i=t._x,s=t._y,r=t._z,o=t._order,a=Math.cos,l=Math.sin,c=a(i/2),u=a(s/2),d=a(r/2),h=l(i/2),f=l(s/2),m=l(r/2);switch(o){case"XYZ":this._x=h*u*d+c*f*m,this._y=c*f*d-h*u*m,this._z=c*u*m+h*f*d,this._w=c*u*d-h*f*m;break;case"YXZ":this._x=h*u*d+c*f*m,this._y=c*f*d-h*u*m,this._z=c*u*m-h*f*d,this._w=c*u*d+h*f*m;break;case"ZXY":this._x=h*u*d-c*f*m,this._y=c*f*d+h*u*m,this._z=c*u*m+h*f*d,this._w=c*u*d-h*f*m;break;case"ZYX":this._x=h*u*d-c*f*m,this._y=c*f*d+h*u*m,this._z=c*u*m-h*f*d,this._w=c*u*d+h*f*m;break;case"YZX":this._x=h*u*d+c*f*m,this._y=c*f*d+h*u*m,this._z=c*u*m-h*f*d,this._w=c*u*d-h*f*m;break;case"XZY":this._x=h*u*d-c*f*m,this._y=c*f*d-h*u*m,this._z=c*u*m+h*f*d,this._w=c*u*d+h*f*m;break;default:Ht("Quaternion: .setFromEuler() encountered an unknown order: "+o)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){let i=e/2,s=Math.sin(i);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(t){let e=t.elements,i=e[0],s=e[4],r=e[8],o=e[1],a=e[5],l=e[9],c=e[2],u=e[6],d=e[10],h=i+a+d;if(h>0){let f=.5/Math.sqrt(h+1);this._w=.25/f,this._x=(u-l)*f,this._y=(r-c)*f,this._z=(o-s)*f}else if(i>a&&i>d){let f=2*Math.sqrt(1+i-a-d);this._w=(u-l)/f,this._x=.25*f,this._y=(s+o)/f,this._z=(r+c)/f}else if(a>d){let f=2*Math.sqrt(1+a-i-d);this._w=(r-c)/f,this._x=(s+o)/f,this._y=.25*f,this._z=(l+u)/f}else{let f=2*Math.sqrt(1+d-i-a);this._w=(o-s)/f,this._x=(r+c)/f,this._y=(l+u)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let i=t.dot(e)+1;return i<1e-8?(i=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=i):(this._x=0,this._y=-t.z,this._z=t.y,this._w=i)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=i),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(fe(this.dot(t),-1,1)))}rotateTowards(t,e){let i=this.angleTo(t);if(i===0)return this;let s=Math.min(1,e/i);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){let i=t._x,s=t._y,r=t._z,o=t._w,a=e._x,l=e._y,c=e._z,u=e._w;return this._x=i*u+o*a+s*c-r*l,this._y=s*u+o*l+r*a-i*c,this._z=r*u+o*c+i*l-s*a,this._w=o*u-i*a-s*l-r*c,this._onChangeCallback(),this}slerp(t,e){let i=t._x,s=t._y,r=t._z,o=t._w,a=this.dot(t);a<0&&(i=-i,s=-s,r=-r,o=-o,a=-a);let l=1-e;if(a<.9995){let c=Math.acos(a),u=Math.sin(c);l=Math.sin(l*c)/u,e=Math.sin(e*c)/u,this._x=this._x*l+i*e,this._y=this._y*l+s*e,this._z=this._z*l+r*e,this._w=this._w*l+o*e,this._onChangeCallback()}else this._x=this._x*l+i*e,this._y=this._y*l+s*e,this._z=this._z*l+r*e,this._w=this._w*l+o*e,this.normalize();return this}slerpQuaternions(t,e,i){return this.copy(t).slerp(e,i)}random(){let t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),i=Math.random(),s=Math.sqrt(1-i),r=Math.sqrt(i);return this.set(s*Math.sin(t),s*Math.cos(t),r*Math.sin(e),r*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},zh=class zh{constructor(t=0,e=0,i=0){this.x=t,this.y=e,this.z=i}set(t,e,i){return i===void 0&&(i=this.z),this.x=t,this.y=e,this.z=i,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("THREE.Vector3: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(hd.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(hd.setFromAxisAngle(t,e))}applyMatrix3(t){let e=this.x,i=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[3]*i+r[6]*s,this.y=r[1]*e+r[4]*i+r[7]*s,this.z=r[2]*e+r[5]*i+r[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){let e=this.x,i=this.y,s=this.z,r=t.elements,o=1/(r[3]*e+r[7]*i+r[11]*s+r[15]);return this.x=(r[0]*e+r[4]*i+r[8]*s+r[12])*o,this.y=(r[1]*e+r[5]*i+r[9]*s+r[13])*o,this.z=(r[2]*e+r[6]*i+r[10]*s+r[14])*o,this}applyQuaternion(t){let e=this.x,i=this.y,s=this.z,r=t.x,o=t.y,a=t.z,l=t.w,c=2*(o*s-a*i),u=2*(a*e-r*s),d=2*(r*i-o*e);return this.x=e+l*c+o*d-a*u,this.y=i+l*u+a*c-r*d,this.z=s+l*d+r*u-o*c,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){let e=this.x,i=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[4]*i+r[8]*s,this.y=r[1]*e+r[5]*i+r[9]*s,this.z=r[2]*e+r[6]*i+r[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=fe(this.x,t.x,e.x),this.y=fe(this.y,t.y,e.y),this.z=fe(this.z,t.z,e.z),this}clampScalar(t,e){return this.x=fe(this.x,t,e),this.y=fe(this.y,t,e),this.z=fe(this.z,t,e),this}clampLength(t,e){let i=this.length();return this.divideScalar(i||1).multiplyScalar(fe(i,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){let i=t.x,s=t.y,r=t.z,o=e.x,a=e.y,l=e.z;return this.x=s*l-r*a,this.y=r*o-i*l,this.z=i*a-s*o,this}projectOnVector(t){let e=t.lengthSq();if(e===0)return this.set(0,0,0);let i=t.dot(this)/e;return this.copy(t).multiplyScalar(i)}projectOnPlane(t){return Dc.copy(this).projectOnVector(t),this.sub(Dc)}reflect(t){return this.sub(Dc.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let i=this.dot(t)/e;return Math.acos(fe(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,i=this.y-t.y,s=this.z-t.z;return e*e+i*i+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,i){let s=Math.sin(e)*t;return this.x=s*Math.sin(i),this.y=Math.cos(e)*t,this.z=s*Math.cos(i),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,i){return this.x=t*Math.sin(e),this.y=i,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){let e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){let e=this.setFromMatrixColumn(t,0).length(),i=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=i,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let t=Math.random()*Math.PI*2,e=Math.random()*2-1,i=Math.sqrt(1-e*e);return this.x=i*Math.cos(t),this.y=e,this.z=i*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}};zh.prototype.isVector3=!0;var L=zh,Dc=new L,hd=new Dn,Vh=class Vh{constructor(t,e,i,s,r,o,a,l,c){this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,i,s,r,o,a,l,c)}set(t,e,i,s,r,o,a,l,c){let u=this.elements;return u[0]=t,u[1]=s,u[2]=a,u[3]=e,u[4]=r,u[5]=l,u[6]=i,u[7]=o,u[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){let e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],this}extractBasis(t,e,i){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(t){let e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let i=t.elements,s=e.elements,r=this.elements,o=i[0],a=i[3],l=i[6],c=i[1],u=i[4],d=i[7],h=i[2],f=i[5],m=i[8],x=s[0],g=s[3],p=s[6],S=s[1],A=s[4],M=s[7],T=s[2],b=s[5],C=s[8];return r[0]=o*x+a*S+l*T,r[3]=o*g+a*A+l*b,r[6]=o*p+a*M+l*C,r[1]=c*x+u*S+d*T,r[4]=c*g+u*A+d*b,r[7]=c*p+u*M+d*C,r[2]=h*x+f*S+m*T,r[5]=h*g+f*A+m*b,r[8]=h*p+f*M+m*C,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){let t=this.elements,e=t[0],i=t[1],s=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],u=t[8];return e*o*u-e*a*c-i*r*u+i*a*l+s*r*c-s*o*l}invert(){let t=this.elements,e=t[0],i=t[1],s=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],u=t[8],d=u*o-a*c,h=a*l-u*r,f=c*r-o*l,m=e*d+i*h+s*f;if(m===0)return this.set(0,0,0,0,0,0,0,0,0);let x=1/m;return t[0]=d*x,t[1]=(s*c-u*i)*x,t[2]=(a*i-s*o)*x,t[3]=h*x,t[4]=(u*e-s*l)*x,t[5]=(s*r-a*e)*x,t[6]=f*x,t[7]=(i*l-c*e)*x,t[8]=(o*e-i*r)*x,this}transpose(){let t,e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){let e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,i,s,r,o,a){let l=Math.cos(r),c=Math.sin(r);return this.set(i*l,i*c,-i*(l*o+c*a)+o+t,-s*c,s*l,-s*(-c*o+l*a)+a+e,0,0,1),this}scale(t,e){return Ts("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(Nc.makeScale(t,e)),this}rotate(t){return Ts("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(Nc.makeRotation(-t)),this}translate(t,e){return Ts("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(Nc.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){let e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,i,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){let e=this.elements,i=t.elements;for(let s=0;s<9;s++)if(e[s]!==i[s])return!1;return!0}fromArray(t,e=0){for(let i=0;i<9;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){let i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t}clone(){return new this.constructor().fromArray(this.elements)}};Vh.prototype.isMatrix3=!0;var jt=Vh,Nc=new jt,ud=new jt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),dd=new jt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function hm(){let n={enabled:!0,workingColorSpace:Jr,spaces:{},convert:function(s,r,o){return this.enabled===!1||r===o||!r||!o||(this.spaces[r].transfer===Se&&(s.r=Ni(s.r),s.g=Ni(s.g),s.b=Ni(s.b)),this.spaces[r].primaries!==this.spaces[o].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[o].fromXYZ)),this.spaces[o].transfer===Se&&(s.r=sr(s.r),s.g=sr(s.g),s.b=sr(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===Bi?$r:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,o){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[o].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return Ts("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),n.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return Ts("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),n.colorSpaceToWorking(s,r)}},t=[.64,.33,.3,.6,.15,.06],e=[.2126,.7152,.0722],i=[.3127,.329];return n.define({[Jr]:{primaries:t,whitePoint:i,transfer:$r,toXYZ:ud,fromXYZ:dd,luminanceCoefficients:e,workingColorSpaceConfig:{unpackColorSpace:hn},outputColorSpaceConfig:{drawingBufferColorSpace:hn}},[hn]:{primaries:t,whitePoint:i,transfer:Se,toXYZ:ud,fromXYZ:dd,luminanceCoefficients:e,outputColorSpaceConfig:{drawingBufferColorSpace:hn}}}),n}var ge=hm();function Ni(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function sr(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}var Gs,Fa=class{static getDataURL(t,e="image/png"){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let i;if(t instanceof HTMLCanvasElement)i=t;else{Gs===void 0&&(Gs=Kr("canvas")),Gs.width=t.width,Gs.height=t.height;let s=Gs.getContext("2d");t instanceof ImageData?s.putImageData(t,0,0):s.drawImage(t,0,0,t.width,t.height),i=Gs}return i.toDataURL(e)}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){let e=Kr("canvas");e.width=t.width,e.height=t.height;let i=e.getContext("2d");i.drawImage(t,0,0,t.width,t.height);let s=i.getImageData(0,0,t.width,t.height),r=s.data;for(let o=0;o<r.length;o++)r[o]=Ni(r[o]/255)*255;return i.putImageData(s,0,0),e}else if(t.data){let e=t.data.slice(0);for(let i=0;i<e.length;i++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[i]=Math.floor(Ni(e[i]/255)*255):e[i]=Ni(e[i]);return{data:e,width:t.width,height:t.height}}else return Ht("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}},um=0,cr=class{constructor(t=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:um++}),this.uuid=br(),this.data=t,this.dataReady=!0,this.version=0}getSize(t){let e=this.data;return typeof HTMLVideoElement<"u"&&e instanceof HTMLVideoElement?t.set(e.videoWidth,e.videoHeight,0):typeof VideoFrame<"u"&&e instanceof VideoFrame?t.set(e.displayWidth,e.displayHeight,0):e!==null?t.set(e.width,e.height,e.depth||0):t.set(0,0,0),t}set needsUpdate(t){t===!0&&this.version++}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];let i={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let o=0,a=s.length;o<a;o++)s[o].isDataTexture?r.push(Uc(s[o].image)):r.push(Uc(s[o]))}else r=Uc(s);i.url=r}return e||(t.images[this.uuid]=i),i}};function Uc(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?Fa.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(Ht("Texture: Unable to serialize Texture."),{})}var dm=0,Fc=new L,vn=class n extends Qn{constructor(t=n.DEFAULT_IMAGE,e=n.DEFAULT_MAPPING,i=mi,s=mi,r=je,o=cs,a=Xn,l=bn,c=n.DEFAULT_ANISOTROPY,u=Bi){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:dm++}),this.uuid=br(),this.name="",this.source=new cr(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=i,this.wrapT=s,this.magFilter=r,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new Yt(0,0),this.repeat=new Yt(1,1),this.center=new Yt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new jt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(Fc).x}get height(){return this.source.getSize(Fc).y}get depth(){return this.source.getSize(Fc).z}get image(){return this.source.data}set image(t){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.normalized=t.normalized,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.renderTarget=t.renderTarget,this.isRenderTargetTexture=t.isRenderTargetTexture,this.isArrayTexture=t.isArrayTexture,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}setValues(t){for(let e in t){let i=t[e];if(i===void 0){Ht(`Texture.setValues(): parameter '${e}' has value of undefined.`);continue}let s=this[e];if(s===void 0){Ht(`Texture.setValues(): property '${e}' does not exist.`);continue}s&&i&&s.isVector2&&i.isVector2||s&&i&&s.isVector3&&i.isVector3||s&&i&&s.isMatrix3&&i.isMatrix3?s.copy(i):this[e]=i}}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];let i={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),e||(t.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==bh)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case Da:t.x=t.x-Math.floor(t.x);break;case mi:t.x=t.x<0?0:1;break;case Na:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case Da:t.y=t.y-Math.floor(t.y);break;case mi:t.y=t.y<0?0:1;break;case Na:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}};vn.DEFAULT_IMAGE=null;vn.DEFAULT_MAPPING=bh;vn.DEFAULT_ANISOTROPY=1;var Hh=class Hh{constructor(t=0,e=0,i=0,s=1){this.x=t,this.y=e,this.z=i,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,i,s){return this.x=t,this.y=e,this.z=i,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("THREE.Vector4: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){let e=this.x,i=this.y,s=this.z,r=this.w,o=t.elements;return this.x=o[0]*e+o[4]*i+o[8]*s+o[12]*r,this.y=o[1]*e+o[5]*i+o[9]*s+o[13]*r,this.z=o[2]*e+o[6]*i+o[10]*s+o[14]*r,this.w=o[3]*e+o[7]*i+o[11]*s+o[15]*r,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);let e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,i,s,r,l=t.elements,c=l[0],u=l[4],d=l[8],h=l[1],f=l[5],m=l[9],x=l[2],g=l[6],p=l[10];if(Math.abs(u-h)<.01&&Math.abs(d-x)<.01&&Math.abs(m-g)<.01){if(Math.abs(u+h)<.1&&Math.abs(d+x)<.1&&Math.abs(m+g)<.1&&Math.abs(c+f+p-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;let A=(c+1)/2,M=(f+1)/2,T=(p+1)/2,b=(u+h)/4,C=(d+x)/4,y=(m+g)/4;return A>M&&A>T?A<.01?(i=0,s=.707106781,r=.707106781):(i=Math.sqrt(A),s=b/i,r=C/i):M>T?M<.01?(i=.707106781,s=0,r=.707106781):(s=Math.sqrt(M),i=b/s,r=y/s):T<.01?(i=.707106781,s=.707106781,r=0):(r=Math.sqrt(T),i=C/r,s=y/r),this.set(i,s,r,e),this}let S=Math.sqrt((g-m)*(g-m)+(d-x)*(d-x)+(h-u)*(h-u));return Math.abs(S)<.001&&(S=1),this.x=(g-m)/S,this.y=(d-x)/S,this.z=(h-u)/S,this.w=Math.acos((c+f+p-1)/2),this}setFromMatrixPosition(t){let e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=fe(this.x,t.x,e.x),this.y=fe(this.y,t.y,e.y),this.z=fe(this.z,t.z,e.z),this.w=fe(this.w,t.w,e.w),this}clampScalar(t,e){return this.x=fe(this.x,t,e),this.y=fe(this.y,t,e),this.z=fe(this.z,t,e),this.w=fe(this.w,t,e),this}clampLength(t,e){let i=this.length();return this.divideScalar(i||1).multiplyScalar(fe(i,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this.w=t.w+(e.w-t.w)*i,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}};Hh.prototype.isVector4=!0;var Ne=Hh,Oa=class extends Qn{constructor(t=1,e=1,i={}){super(),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:je,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},i),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=i.depth,this.scissor=new Ne(0,0,t,e),this.scissorTest=!1,this.viewport=new Ne(0,0,t,e),this.textures=[];let s={width:t,height:e,depth:i.depth},r=new vn(s),o=i.count;for(let a=0;a<o;a++)this.textures[a]=r.clone(),this.textures[a].isRenderTargetTexture=!0,this.textures[a].renderTarget=this;this._setTextureOptions(i),this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveColorBuffer=i.resolveColorBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this.storeMultisampledColorBuffer=i.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=i.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=i.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=i.depthTexture,this.samples=i.samples,this.multiview=i.multiview,this.useArrayDepthTexture=i.useArrayDepthTexture}_setTextureOptions(t={}){let e={minFilter:je,generateMipmaps:!1,flipY:!1,internalFormat:null};t.mapping!==void 0&&(e.mapping=t.mapping),t.wrapS!==void 0&&(e.wrapS=t.wrapS),t.wrapT!==void 0&&(e.wrapT=t.wrapT),t.wrapR!==void 0&&(e.wrapR=t.wrapR),t.magFilter!==void 0&&(e.magFilter=t.magFilter),t.minFilter!==void 0&&(e.minFilter=t.minFilter),t.format!==void 0&&(e.format=t.format),t.type!==void 0&&(e.type=t.type),t.anisotropy!==void 0&&(e.anisotropy=t.anisotropy),t.colorSpace!==void 0&&(e.colorSpace=t.colorSpace),t.flipY!==void 0&&(e.flipY=t.flipY),t.generateMipmaps!==void 0&&(e.generateMipmaps=t.generateMipmaps),t.internalFormat!==void 0&&(e.internalFormat=t.internalFormat);for(let i=0;i<this.textures.length;i++)this.textures[i].setValues(e)}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}set depthTexture(t){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),t!==null&&t.renderTarget===null&&(t.renderTarget=this),this._depthTexture=t}get depthTexture(){return this._depthTexture}setSize(t,e,i=1){if(this.width!==t||this.height!==e||this.depth!==i){this.width=t,this.height=e,this.depth=i;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=t,this.textures[s].image.height=e,this.textures[s].image.depth=i,this.textures[s].isData3DTexture!==!0&&(this.textures[s].isArrayTexture=this.textures[s].image.depth>1);this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let e=0,i=t.textures.length;e<i;e++){this.textures[e]=t.textures[e].clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;let s=Object.assign({},t.textures[e].image);this.textures[e].source=new cr(s)}if(this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveColorBuffer=t.resolveColorBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,this.storeMultisampledColorBuffer=t.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=t.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=t.storeMultisampledStencilBuffer,t.depthTexture!==null)if(t.depthTexture.renderTarget===t){let e=t.depthTexture.clone();e.renderTarget=null,this.depthTexture=e}else this.depthTexture=t.depthTexture;return this.samples=t.samples,this.multiview=t.multiview,this.useArrayDepthTexture=t.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}},Mn=class extends Oa{constructor(t=1,e=1,i={}){super(t,e,i),this.isWebGLRenderTarget=!0}},jr=class extends vn{constructor(t=null,e=1,i=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:i,depth:s},this.magFilter=$e,this.minFilter=$e,this.wrapR=mi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(t){return super.copy(t),this.wrapR=t.wrapR,this}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}};var Ba=class extends vn{constructor(t=null,e=1,i=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:i,depth:s},this.magFilter=$e,this.minFilter=$e,this.wrapR=mi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(t){return super.copy(t),this.wrapR=t.wrapR,this}};var ol=class ol{constructor(t,e,i,s,r,o,a,l,c,u,d,h,f,m,x,g){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,i,s,r,o,a,l,c,u,d,h,f,m,x,g)}set(t,e,i,s,r,o,a,l,c,u,d,h,f,m,x,g){let p=this.elements;return p[0]=t,p[4]=e,p[8]=i,p[12]=s,p[1]=r,p[5]=o,p[9]=a,p[13]=l,p[2]=c,p[6]=u,p[10]=d,p[14]=h,p[3]=f,p[7]=m,p[11]=x,p[15]=g,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new ol().fromArray(this.elements)}copy(t){let e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],e[9]=i[9],e[10]=i[10],e[11]=i[11],e[12]=i[12],e[13]=i[13],e[14]=i[14],e[15]=i[15],this}copyPosition(t){let e=this.elements,i=t.elements;return e[12]=i[12],e[13]=i[13],e[14]=i[14],this}setFromMatrix3(t){let e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,i){return this.determinantAffine()===0?(t.set(1,0,0),e.set(0,1,0),i.set(0,0,1),this):(t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this)}makeBasis(t,e,i){return this.set(t.x,e.x,i.x,0,t.y,e.y,i.y,0,t.z,e.z,i.z,0,0,0,0,1),this}extractRotation(t){if(t.determinantAffine()===0)return this.identity();let e=this.elements,i=t.elements,s=1/Ws.setFromMatrixColumn(t,0).length(),r=1/Ws.setFromMatrixColumn(t,1).length(),o=1/Ws.setFromMatrixColumn(t,2).length();return e[0]=i[0]*s,e[1]=i[1]*s,e[2]=i[2]*s,e[3]=0,e[4]=i[4]*r,e[5]=i[5]*r,e[6]=i[6]*r,e[7]=0,e[8]=i[8]*o,e[9]=i[9]*o,e[10]=i[10]*o,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){let e=this.elements,i=t.x,s=t.y,r=t.z,o=Math.cos(i),a=Math.sin(i),l=Math.cos(s),c=Math.sin(s),u=Math.cos(r),d=Math.sin(r);if(t.order==="XYZ"){let h=o*u,f=o*d,m=a*u,x=a*d;e[0]=l*u,e[4]=-l*d,e[8]=c,e[1]=f+m*c,e[5]=h-x*c,e[9]=-a*l,e[2]=x-h*c,e[6]=m+f*c,e[10]=o*l}else if(t.order==="YXZ"){let h=l*u,f=l*d,m=c*u,x=c*d;e[0]=h+x*a,e[4]=m*a-f,e[8]=o*c,e[1]=o*d,e[5]=o*u,e[9]=-a,e[2]=f*a-m,e[6]=x+h*a,e[10]=o*l}else if(t.order==="ZXY"){let h=l*u,f=l*d,m=c*u,x=c*d;e[0]=h-x*a,e[4]=-o*d,e[8]=m+f*a,e[1]=f+m*a,e[5]=o*u,e[9]=x-h*a,e[2]=-o*c,e[6]=a,e[10]=o*l}else if(t.order==="ZYX"){let h=o*u,f=o*d,m=a*u,x=a*d;e[0]=l*u,e[4]=m*c-f,e[8]=h*c+x,e[1]=l*d,e[5]=x*c+h,e[9]=f*c-m,e[2]=-c,e[6]=a*l,e[10]=o*l}else if(t.order==="YZX"){let h=o*l,f=o*c,m=a*l,x=a*c;e[0]=l*u,e[4]=x-h*d,e[8]=m*d+f,e[1]=d,e[5]=o*u,e[9]=-a*u,e[2]=-c*u,e[6]=f*d+m,e[10]=h-x*d}else if(t.order==="XZY"){let h=o*l,f=o*c,m=a*l,x=a*c;e[0]=l*u,e[4]=-d,e[8]=c*u,e[1]=h*d+x,e[5]=o*u,e[9]=f*d-m,e[2]=m*d-f,e[6]=a*u,e[10]=x*d+h}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(fm,t,pm)}lookAt(t,e,i){let s=this.elements;return Pn.subVectors(t,e),Pn.lengthSq()===0&&(Pn.z=1),Pn.normalize(),Yi.crossVectors(i,Pn),Yi.lengthSq()===0&&(Math.abs(i.z)===1?Pn.x+=1e-4:Pn.z+=1e-4,Pn.normalize(),Yi.crossVectors(i,Pn)),Yi.normalize(),Qo.crossVectors(Pn,Yi),s[0]=Yi.x,s[4]=Qo.x,s[8]=Pn.x,s[1]=Yi.y,s[5]=Qo.y,s[9]=Pn.y,s[2]=Yi.z,s[6]=Qo.z,s[10]=Pn.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let i=t.elements,s=e.elements,r=this.elements,o=i[0],a=i[4],l=i[8],c=i[12],u=i[1],d=i[5],h=i[9],f=i[13],m=i[2],x=i[6],g=i[10],p=i[14],S=i[3],A=i[7],M=i[11],T=i[15],b=s[0],C=s[4],y=s[8],w=s[12],P=s[1],F=s[5],B=s[9],V=s[13],I=s[2],k=s[6],W=s[10],J=s[14],et=s[3],U=s[7],q=s[11],j=s[15];return r[0]=o*b+a*P+l*I+c*et,r[4]=o*C+a*F+l*k+c*U,r[8]=o*y+a*B+l*W+c*q,r[12]=o*w+a*V+l*J+c*j,r[1]=u*b+d*P+h*I+f*et,r[5]=u*C+d*F+h*k+f*U,r[9]=u*y+d*B+h*W+f*q,r[13]=u*w+d*V+h*J+f*j,r[2]=m*b+x*P+g*I+p*et,r[6]=m*C+x*F+g*k+p*U,r[10]=m*y+x*B+g*W+p*q,r[14]=m*w+x*V+g*J+p*j,r[3]=S*b+A*P+M*I+T*et,r[7]=S*C+A*F+M*k+T*U,r[11]=S*y+A*B+M*W+T*q,r[15]=S*w+A*V+M*J+T*j,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){let t=this.elements,e=t[0],i=t[4],s=t[8],r=t[12],o=t[1],a=t[5],l=t[9],c=t[13],u=t[2],d=t[6],h=t[10],f=t[14],m=t[3],x=t[7],g=t[11],p=t[15],S=l*f-c*h,A=a*f-c*d,M=a*h-l*d,T=o*f-c*u,b=o*h-l*u,C=o*d-a*u;return e*(x*S-g*A+p*M)-i*(m*S-g*T+p*b)+s*(m*A-x*T+p*C)-r*(m*M-x*b+g*C)}determinantAffine(){let t=this.elements,e=t[0],i=t[4],s=t[8],r=t[1],o=t[5],a=t[9],l=t[2],c=t[6],u=t[10];return e*(o*u-a*c)-i*(r*u-a*l)+s*(r*c-o*l)}transpose(){let t=this.elements,e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,i){let s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=i),this}invert(){let t=this.elements,e=t[0],i=t[1],s=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],u=t[8],d=t[9],h=t[10],f=t[11],m=t[12],x=t[13],g=t[14],p=t[15],S=e*a-i*o,A=e*l-s*o,M=e*c-r*o,T=i*l-s*a,b=i*c-r*a,C=s*c-r*l,y=u*x-d*m,w=u*g-h*m,P=u*p-f*m,F=d*g-h*x,B=d*p-f*x,V=h*p-f*g,I=S*V-A*B+M*F+T*P-b*w+C*y;if(I===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let k=1/I;return t[0]=(a*V-l*B+c*F)*k,t[1]=(s*B-i*V-r*F)*k,t[2]=(x*C-g*b+p*T)*k,t[3]=(h*b-d*C-f*T)*k,t[4]=(l*P-o*V-c*w)*k,t[5]=(e*V-s*P+r*w)*k,t[6]=(g*M-m*C-p*A)*k,t[7]=(u*C-h*M+f*A)*k,t[8]=(o*B-a*P+c*y)*k,t[9]=(i*P-e*B-r*y)*k,t[10]=(m*b-x*M+p*S)*k,t[11]=(d*M-u*b-f*S)*k,t[12]=(a*w-o*F-l*y)*k,t[13]=(e*F-i*w+s*y)*k,t[14]=(x*A-m*T-g*S)*k,t[15]=(u*T-d*A+h*S)*k,this}scale(t){let e=this.elements,i=t.x,s=t.y,r=t.z;return e[0]*=i,e[4]*=s,e[8]*=r,e[1]*=i,e[5]*=s,e[9]*=r,e[2]*=i,e[6]*=s,e[10]*=r,e[3]*=i,e[7]*=s,e[11]*=r,this}getMaxScaleOnAxis(){let t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],i=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,i,s))}makeTranslation(t,e,i){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,i,0,0,0,1),this}makeRotationX(t){let e=Math.cos(t),i=Math.sin(t);return this.set(1,0,0,0,0,e,-i,0,0,i,e,0,0,0,0,1),this}makeRotationY(t){let e=Math.cos(t),i=Math.sin(t);return this.set(e,0,i,0,0,1,0,0,-i,0,e,0,0,0,0,1),this}makeRotationZ(t){let e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,0,i,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){let i=Math.cos(e),s=Math.sin(e),r=1-i,o=t.x,a=t.y,l=t.z,c=r*o,u=r*a;return this.set(c*o+i,c*a-s*l,c*l+s*a,0,c*a+s*l,u*a+i,u*l-s*o,0,c*l-s*a,u*l+s*o,r*l*l+i,0,0,0,0,1),this}makeScale(t,e,i){return this.set(t,0,0,0,0,e,0,0,0,0,i,0,0,0,0,1),this}makeShear(t,e,i,s,r,o){return this.set(1,i,r,0,t,1,o,0,e,s,1,0,0,0,0,1),this}compose(t,e,i){let s=this.elements,r=e._x,o=e._y,a=e._z,l=e._w,c=r+r,u=o+o,d=a+a,h=r*c,f=r*u,m=r*d,x=o*u,g=o*d,p=a*d,S=l*c,A=l*u,M=l*d,T=i.x,b=i.y,C=i.z;return s[0]=(1-(x+p))*T,s[1]=(f+M)*T,s[2]=(m-A)*T,s[3]=0,s[4]=(f-M)*b,s[5]=(1-(h+p))*b,s[6]=(g+S)*b,s[7]=0,s[8]=(m+A)*C,s[9]=(g-S)*C,s[10]=(1-(h+x))*C,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,i){let s=this.elements;t.x=s[12],t.y=s[13],t.z=s[14];let r=this.determinantAffine();if(r===0)return i.set(1,1,1),e.identity(),this;let o=Ws.set(s[0],s[1],s[2]).length(),a=Ws.set(s[4],s[5],s[6]).length(),l=Ws.set(s[8],s[9],s[10]).length();r<0&&(o=-o),Jn.copy(this);let c=1/o,u=1/a,d=1/l;return Jn.elements[0]*=c,Jn.elements[1]*=c,Jn.elements[2]*=c,Jn.elements[4]*=u,Jn.elements[5]*=u,Jn.elements[6]*=u,Jn.elements[8]*=d,Jn.elements[9]*=d,Jn.elements[10]*=d,e.setFromRotationMatrix(Jn),i.x=o,i.y=a,i.z=l,this}makePerspective(t,e,i,s,r,o,a=jn,l=!1){let c=this.elements,u=2*r/(e-t),d=2*r/(i-s),h=(e+t)/(e-t),f=(i+s)/(i-s),m,x;if(l)m=r/(o-r),x=o*r/(o-r);else if(a===jn)m=-(o+r)/(o-r),x=-2*o*r/(o-r);else if(a===or)m=-o/(o-r),x=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return c[0]=u,c[4]=0,c[8]=h,c[12]=0,c[1]=0,c[5]=d,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=m,c[14]=x,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,e,i,s,r,o,a=jn,l=!1){let c=this.elements,u=2/(e-t),d=2/(i-s),h=-(e+t)/(e-t),f=-(i+s)/(i-s),m,x;if(l)m=1/(o-r),x=o/(o-r);else if(a===jn)m=-2/(o-r),x=-(o+r)/(o-r);else if(a===or)m=-1/(o-r),x=-r/(o-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return c[0]=u,c[4]=0,c[8]=0,c[12]=h,c[1]=0,c[5]=d,c[9]=0,c[13]=f,c[2]=0,c[6]=0,c[10]=m,c[14]=x,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){let e=this.elements,i=t.elements;for(let s=0;s<16;s++)if(e[s]!==i[s])return!1;return!0}fromArray(t,e=0){for(let i=0;i<16;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){let i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t[e+9]=i[9],t[e+10]=i[10],t[e+11]=i[11],t[e+12]=i[12],t[e+13]=i[13],t[e+14]=i[14],t[e+15]=i[15],t}};ol.prototype.isMatrix4=!0;var De=ol,Ws=new L,Jn=new De,fm=new L(0,0,0),pm=new L(1,1,1),Yi=new L,Qo=new L,Pn=new L,fd=new De,pd=new Dn,Ui=class n{constructor(t=0,e=0,i=0,s=n.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=i,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,i,s=this._order){return this._x=t,this._y=e,this._z=i,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,i=!0){let s=t.elements,r=s[0],o=s[4],a=s[8],l=s[1],c=s[5],u=s[9],d=s[2],h=s[6],f=s[10];switch(e){case"XYZ":this._y=Math.asin(fe(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-u,f),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(h,c),this._z=0);break;case"YXZ":this._x=Math.asin(-fe(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(a,f),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-d,r),this._z=0);break;case"ZXY":this._x=Math.asin(fe(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(-d,f),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-fe(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(h,f),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(fe(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-u,c),this._y=Math.atan2(-d,r)):(this._x=0,this._y=Math.atan2(a,f));break;case"XZY":this._z=Math.asin(-fe(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(h,c),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-u,f),this._y=0);break;default:Ht("Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,i===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,i){return fd.makeRotationFromQuaternion(t),this.setFromRotationMatrix(fd,e,i)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return pd.setFromEuler(this),this.setFromQuaternion(pd,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};Ui.DEFAULT_ORDER="XYZ";var Qr=class{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}},mm=0,md=new L,Xs=new Dn,Ai=new De,ta=new L,Hr=new L,gm=new L,_m=new Dn,gd=new L(1,0,0),_d=new L(0,1,0),xd=new L(0,0,1),yd={type:"added"},xm={type:"removed"},qs={type:"childadded",child:null},Oc={type:"childremoved",child:null},Ke=class n extends Qn{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:mm++}),this.uuid=br(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=n.DEFAULT_UP.clone();let t=new L,e=new Ui,i=new Dn,s=new L(1,1,1);function r(){i.setFromEuler(e,!1)}function o(){e.setFromQuaternion(i,void 0,!1)}e._onChange(r),i._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new De},normalMatrix:{value:new jt}}),this.matrix=new De,this.matrixWorld=new De,this.matrixAutoUpdate=n.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=n.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Qr,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return Xs.setFromAxisAngle(t,e),this.quaternion.multiply(Xs),this}rotateOnWorldAxis(t,e){return Xs.setFromAxisAngle(t,e),this.quaternion.premultiply(Xs),this}rotateX(t){return this.rotateOnAxis(gd,t)}rotateY(t){return this.rotateOnAxis(_d,t)}rotateZ(t){return this.rotateOnAxis(xd,t)}translateOnAxis(t,e){return md.copy(t).applyQuaternion(this.quaternion),this.position.add(md.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(gd,t)}translateY(t){return this.translateOnAxis(_d,t)}translateZ(t){return this.translateOnAxis(xd,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(Ai.copy(this.matrixWorld).invert())}lookAt(t,e,i){t.isVector3?ta.copy(t):ta.set(t,e,i);let s=this.parent;this.updateWorldMatrix(!0,!1),Hr.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Ai.lookAt(Hr,ta,this.up):Ai.lookAt(ta,Hr,this.up),this.quaternion.setFromRotationMatrix(Ai),s&&(Ai.extractRotation(s.matrixWorld),Xs.setFromRotationMatrix(Ai),this.quaternion.premultiply(Xs.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(Zt("Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(yd),qs.child=t,this.dispatchEvent(qs),qs.child=null):Zt("Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}let e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(xm),Oc.child=t,this.dispatchEvent(Oc),Oc.child=null),this}removeFromParent(){let t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),Ai.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),Ai.multiply(t.parent.matrixWorld)),t.applyMatrix4(Ai),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(yd),qs.child=t,this.dispatchEvent(qs),qs.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let i=0,s=this.children.length;i<s;i++){let o=this.children[i].getObjectByProperty(t,e);if(o!==void 0)return o}}getObjectsByProperty(t,e,i=[]){this[t]===e&&i.push(this);let s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].getObjectsByProperty(t,e,i);return i}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Hr,t,gm),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Hr,_m,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);let e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}intersectsFrustum(){}traverse(t){t(this);let e=this.children;for(let i=0,s=e.length;i<s;i++)e[i].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);let e=this.children;for(let i=0,s=e.length;i<s;i++)e[i].traverseVisible(t)}traverseAncestors(t){let e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);let t=this.pivot;if(t!==null){let e=t.x,i=t.y,s=t.z,r=this.matrix.elements;r[12]+=e-r[0]*e-r[4]*i-r[8]*s,r[13]+=i-r[1]*e-r[5]*i-r[9]*s,r[14]+=s-r[2]*e-r[6]*i-r[10]*s}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);let e=this.children;for(let i=0,s=e.length;i<s;i++)e[i].updateMatrixWorld(t)}updateWorldMatrix(t,e,i=!1){let s=this.parent;if(t===!0&&s!==null&&s.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||i)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,i=!0),e===!0){let r=this.children;for(let o=0,a=r.length;o<a;o++)r[o].updateWorldMatrix(!1,!0,i)}}toJSON(t){let e=t===void 0||typeof t=="string",i={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});let s={};s.uuid=this.uuid,s.type=this.type,s.name=this.name,s.castShadow=this.castShadow,s.receiveShadow=this.receiveShadow,s.visible=this.visible,s.frustumCulled=this.frustumCulled,s.renderOrder=this.renderOrder,s.static=this.static,s.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.pivot!==null&&(s.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(s.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(s.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(a=>({...a,boundingBox:a.boundingBox?a.boundingBox.toJSON():void 0,boundingSphere:a.boundingSphere?a.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(a=>({...a})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(t),s.indirectTexture=this._indirectTexture.toJSON(t),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(t.geometries,this.geometry);let a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){let l=a.shapes;if(Array.isArray(l))for(let c=0,u=l.length;c<u;c++){let d=l[c];r(t.shapes,d)}else r(t.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(r(t.materials,this.material[l]));s.material=a}else s.material=r(t.materials,this.material);if(this.children.length>0){s.children=[];for(let a=0;a<this.children.length;a++)s.children.push(this.children[a].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let a=0;a<this.animations.length;a++){let l=this.animations[a];s.animations.push(r(t.animations,l))}}if(e){let a=o(t.geometries),l=o(t.materials),c=o(t.textures),u=o(t.images),d=o(t.shapes),h=o(t.skeletons),f=o(t.animations),m=o(t.nodes);a.length>0&&(i.geometries=a),l.length>0&&(i.materials=l),c.length>0&&(i.textures=c),u.length>0&&(i.images=u),d.length>0&&(i.shapes=d),h.length>0&&(i.skeletons=h),f.length>0&&(i.animations=f),m.length>0&&(i.nodes=m)}return i.object=s,i;function o(a){let l=[];for(let c in a){let u=a[c];delete u.metadata,l.push(u)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.pivot=t.pivot!==null?t.pivot.clone():null,this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.static=t.static,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let i=0;i<t.children.length;i++){let s=t.children[i];this.add(s.clone())}return this}dispose(){this.dispatchEvent({type:"dispose"})}};Ke.DEFAULT_UP=new L(0,1,0);Ke.DEFAULT_MATRIX_AUTO_UPDATE=!0;Ke.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var Di=class extends Ke{constructor(){super(),this.isGroup=!0,this.type="Group"}},ym={type:"move"},hr=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Di,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Di,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new L,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new L),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Di,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new L,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new L,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){let e=this._hand;if(e)for(let i of t.hand.values())this._getHandJoint(e,i)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,i){let s=null,r=null,o=null,a=this._targetRay,l=this._grip,c=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(c&&t.hand){o=!0;for(let x of t.hand.values()){let g=e.getJointPose(x,i),p=this._getHandJoint(c,x);g!==null&&(p.matrix.fromArray(g.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=g.radius),p.visible=g!==null}let u=c.joints["index-finger-tip"],d=c.joints["thumb-tip"],h=u.position.distanceTo(d.position),f=.02,m=.005;c.inputState.pinching&&h>f+m?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!c.inputState.pinching&&h<=f-m&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,i),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1,l.eventsEnabled&&l.dispatchEvent({type:"gripUpdated",data:t,target:this})));a!==null&&(s=e.getPose(t.targetRaySpace,i),s===null&&r!==null&&(s=r),s!==null&&(a.matrix.fromArray(s.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,s.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(s.linearVelocity)):a.hasLinearVelocity=!1,s.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(s.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(ym)))}return a!==null&&(a.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){let i=new Di;i.matrixAutoUpdate=!1,i.visible=!1,t.joints[e.jointName]=i,t.add(i)}return t.joints[e.jointName]}},Mf={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Zi={h:0,s:0,l:0},ea={h:0,s:0,l:0};function Bc(n,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?n+(t-n)*6*e:e<1/2?t:e<2/3?n+(t-n)*6*(2/3-e):n}var oe=class{constructor(t,e,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,i)}set(t,e,i){if(e===void 0&&i===void 0){let s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,i);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=hn){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,ge.colorSpaceToWorking(this,e),this}setRGB(t,e,i,s=ge.workingColorSpace){return this.r=t,this.g=e,this.b=i,ge.colorSpaceToWorking(this,s),this}setHSL(t,e,i,s=ge.workingColorSpace){if(t=Dh(t,1),e=fe(e,0,1),i=fe(i,0,1),e===0)this.r=this.g=this.b=i;else{let r=i<=.5?i*(1+e):i+e-i*e,o=2*i-r;this.r=Bc(o,r,t+1/3),this.g=Bc(o,r,t),this.b=Bc(o,r,t-1/3)}return ge.colorSpaceToWorking(this,s),this}setStyle(t,e=hn){function i(r){r!==void 0&&parseFloat(r)<1&&Ht("Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let r,o=s[1],a=s[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:Ht("Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){let r=s[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(o===6)return this.setHex(parseInt(r,16),e);Ht("Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=hn){let i=Mf[t.toLowerCase()];return i!==void 0?this.setHex(i,e):Ht("Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=Ni(t.r),this.g=Ni(t.g),this.b=Ni(t.b),this}copyLinearToSRGB(t){return this.r=sr(t.r),this.g=sr(t.g),this.b=sr(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=hn){return ge.workingToColorSpace(en.copy(this),t),Math.round(fe(en.r*255,0,255))*65536+Math.round(fe(en.g*255,0,255))*256+Math.round(fe(en.b*255,0,255))}getHexString(t=hn){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=ge.workingColorSpace){ge.workingToColorSpace(en.copy(this),e);let i=en.r,s=en.g,r=en.b,o=Math.max(i,s,r),a=Math.min(i,s,r),l,c,u=(a+o)/2;if(a===o)l=0,c=0;else{let d=o-a;switch(c=u<=.5?d/(o+a):d/(2-o-a),o){case i:l=(s-r)/d+(s<r?6:0);break;case s:l=(r-i)/d+2;break;case r:l=(i-s)/d+4;break}l/=6}return t.h=l,t.s=c,t.l=u,t}getRGB(t,e=ge.workingColorSpace){return ge.workingToColorSpace(en.copy(this),e),t.r=en.r,t.g=en.g,t.b=en.b,t}getStyle(t=hn){ge.workingToColorSpace(en.copy(this),t);let e=en.r,i=en.g,s=en.b;return t!==hn?`color(${t} ${e.toFixed(3)} ${i.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(i*255)},${Math.round(s*255)})`}offsetHSL(t,e,i){return this.getHSL(Zi),this.setHSL(Zi.h+t,Zi.s+e,Zi.l+i)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,i){return this.r=t.r+(e.r-t.r)*i,this.g=t.g+(e.g-t.g)*i,this.b=t.b+(e.b-t.b)*i,this}lerpHSL(t,e){this.getHSL(Zi),t.getHSL(ea);let i=Yr(Zi.h,ea.h,e),s=Yr(Zi.s,ea.s,e),r=Yr(Zi.l,ea.l,e);return this.setHSL(i,s,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){let e=this.r,i=this.g,s=this.b,r=t.elements;return this.r=r[0]*e+r[3]*i+r[6]*s,this.g=r[1]*e+r[4]*i+r[7]*s,this.b=r[2]*e+r[5]*i+r[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},en=new oe;oe.NAMES=Mf;var to=class extends Ke{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Ui,this.environmentIntensity=1,this.environmentRotation=new Ui,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){let e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),e.object.backgroundBlurriness=this.backgroundBlurriness,e.object.backgroundIntensity=this.backgroundIntensity,e.object.backgroundRotation=this.backgroundRotation.toArray(),e.object.environmentIntensity=this.environmentIntensity,e.object.environmentRotation=this.environmentRotation.toArray(),e}},$n=new L,Ci=new L,kc=new L,Ri=new L,Ys=new L,Zs=new L,vd=new L,zc=new L,Vc=new L,Hc=new L,Gc=new Ne,Wc=new Ne,Xc=new Ne,Li=class n{constructor(t=new L,e=new L,i=new L){this.a=t,this.b=e,this.c=i}static getNormal(t,e,i,s){s.subVectors(i,e),$n.subVectors(t,e),s.cross($n);let r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(t,e,i,s,r){$n.subVectors(s,e),Ci.subVectors(i,e),kc.subVectors(t,e);let o=$n.dot($n),a=$n.dot(Ci),l=$n.dot(kc),c=Ci.dot(Ci),u=Ci.dot(kc),d=o*c-a*a;if(d===0)return r.set(0,0,0),null;let h=1/d,f=(c*l-a*u)*h,m=(o*u-a*l)*h;return r.set(1-f-m,m,f)}static containsPoint(t,e,i,s){return this.getBarycoord(t,e,i,s,Ri)===null?!1:Ri.x>=0&&Ri.y>=0&&Ri.x+Ri.y<=1}static getInterpolation(t,e,i,s,r,o,a,l){return this.getBarycoord(t,e,i,s,Ri)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,Ri.x),l.addScaledVector(o,Ri.y),l.addScaledVector(a,Ri.z),l)}static getInterpolatedAttribute(t,e,i,s,r,o){return Gc.setScalar(0),Wc.setScalar(0),Xc.setScalar(0),Gc.fromBufferAttribute(t,e),Wc.fromBufferAttribute(t,i),Xc.fromBufferAttribute(t,s),o.setScalar(0),o.addScaledVector(Gc,r.x),o.addScaledVector(Wc,r.y),o.addScaledVector(Xc,r.z),o}static isFrontFacing(t,e,i,s){return $n.subVectors(i,e),Ci.subVectors(t,e),$n.cross(Ci).dot(s)<0}set(t,e,i){return this.a.copy(t),this.b.copy(e),this.c.copy(i),this}setFromPointsAndIndices(t,e,i,s){return this.a.copy(t[e]),this.b.copy(t[i]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,i,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,i),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return $n.subVectors(this.c,this.b),Ci.subVectors(this.a,this.b),$n.cross(Ci).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return n.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return n.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,i,s,r){return n.getInterpolation(t,this.a,this.b,this.c,e,i,s,r)}containsPoint(t){return n.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return n.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){let i=this.a,s=this.b,r=this.c,o,a;Ys.subVectors(s,i),Zs.subVectors(r,i),zc.subVectors(t,i);let l=Ys.dot(zc),c=Zs.dot(zc);if(l<=0&&c<=0)return e.copy(i);Vc.subVectors(t,s);let u=Ys.dot(Vc),d=Zs.dot(Vc);if(u>=0&&d<=u)return e.copy(s);let h=l*d-u*c;if(h<=0&&l>=0&&u<=0)return o=l/(l-u),e.copy(i).addScaledVector(Ys,o);Hc.subVectors(t,r);let f=Ys.dot(Hc),m=Zs.dot(Hc);if(m>=0&&f<=m)return e.copy(r);let x=f*c-l*m;if(x<=0&&c>=0&&m<=0)return a=c/(c-m),e.copy(i).addScaledVector(Zs,a);let g=u*m-f*d;if(g<=0&&d-u>=0&&f-m>=0)return vd.subVectors(r,s),a=(d-u)/(d-u+(f-m)),e.copy(s).addScaledVector(vd,a);let p=1/(g+x+h);return o=x*p,a=h*p,e.copy(i).addScaledVector(Ys,o).addScaledVector(Zs,a)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}},ji=class{constructor(t=new L(1/0,1/0,1/0),e=new L(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e+=3)this.expandByPoint(Kn.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,i=t.count;e<i;e++)this.expandByPoint(Kn.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){let i=Kn.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(i),this.max.copy(t).add(i),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);let i=t.geometry;if(i!==void 0){let r=i.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let o=0,a=r.count;o<a;o++)t.isMesh===!0?t.getVertexPosition(o,Kn):Kn.fromBufferAttribute(r,o),Kn.applyMatrix4(t.matrixWorld),this.expandByPoint(Kn);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),na.copy(t.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),na.copy(i.boundingBox)),na.applyMatrix4(t.matrixWorld),this.union(na)}let s=t.children;for(let r=0,o=s.length;r<o;r++)this.expandByObject(s[r],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,Kn),Kn.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,i;return t.normal.x>0?(e=t.normal.x*this.min.x,i=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,i=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,i+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,i+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,i+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,i+=t.normal.z*this.min.z),e<=-t.constant&&i>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(Gr),ia.subVectors(this.max,Gr),Js.subVectors(t.a,Gr),$s.subVectors(t.b,Gr),Ks.subVectors(t.c,Gr),Ji.subVectors($s,Js),$i.subVectors(Ks,$s),vs.subVectors(Js,Ks);let e=[0,-Ji.z,Ji.y,0,-$i.z,$i.y,0,-vs.z,vs.y,Ji.z,0,-Ji.x,$i.z,0,-$i.x,vs.z,0,-vs.x,-Ji.y,Ji.x,0,-$i.y,$i.x,0,-vs.y,vs.x,0];return!qc(e,Js,$s,Ks,ia)||(e=[1,0,0,0,1,0,0,0,1],!qc(e,Js,$s,Ks,ia))?!1:(sa.crossVectors(Ji,$i),e=[sa.x,sa.y,sa.z],qc(e,Js,$s,Ks,ia))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,Kn).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(Kn).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(Pi[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),Pi[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),Pi[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),Pi[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),Pi[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),Pi[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),Pi[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),Pi[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(Pi),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(t){return this.min.fromArray(t.min),this.max.fromArray(t.max),this}},Pi=[new L,new L,new L,new L,new L,new L,new L,new L],Kn=new L,na=new ji,Js=new L,$s=new L,Ks=new L,Ji=new L,$i=new L,vs=new L,Gr=new L,ia=new L,sa=new L,Ms=new L;function qc(n,t,e,i,s){for(let r=0,o=n.length-3;r<=o;r+=3){Ms.fromArray(n,r);let a=s.x*Math.abs(Ms.x)+s.y*Math.abs(Ms.y)+s.z*Math.abs(Ms.z),l=t.dot(Ms),c=e.dot(Ms),u=i.dot(Ms);if(Math.max(-Math.max(l,c,u),Math.min(l,c,u))>a)return!1}return!0}var He=new L,ra=new Yt,vm=0,Gn=class extends Qn{constructor(t,e,i=!1){if(super(),Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:vm++}),this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=i,this.usage=gf,this.updateRanges=[],this.gpuType=ni,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,i){t*=this.itemSize,i*=e.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[t+s]=e.array[i+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,i=this.count;e<i;e++)ra.fromBufferAttribute(this,e),ra.applyMatrix3(t),this.setXY(e,ra.x,ra.y);else if(this.itemSize===3)for(let e=0,i=this.count;e<i;e++)He.fromBufferAttribute(this,e),He.applyMatrix3(t),this.setXYZ(e,He.x,He.y,He.z);return this}applyMatrix4(t){for(let e=0,i=this.count;e<i;e++)He.fromBufferAttribute(this,e),He.applyMatrix4(t),this.setXYZ(e,He.x,He.y,He.z);return this}applyNormalMatrix(t){for(let e=0,i=this.count;e<i;e++)He.fromBufferAttribute(this,e),He.applyNormalMatrix(t),this.setXYZ(e,He.x,He.y,He.z);return this}transformDirection(t){for(let e=0,i=this.count;e<i;e++)He.fromBufferAttribute(this,e),He.transformDirection(t),this.setXYZ(e,He.x,He.y,He.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let i=this.array[t*this.itemSize+e];return this.normalized&&(i=nr(i,this.array)),i}setComponent(t,e,i){return this.normalized&&(i=cn(i,this.array)),this.array[t*this.itemSize+e]=i,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=nr(e,this.array)),e}setX(t,e){return this.normalized&&(e=cn(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=nr(e,this.array)),e}setY(t,e){return this.normalized&&(e=cn(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=nr(e,this.array)),e}setZ(t,e){return this.normalized&&(e=cn(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=nr(e,this.array)),e}setW(t,e){return this.normalized&&(e=cn(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,i){return t*=this.itemSize,this.normalized&&(e=cn(e,this.array),i=cn(i,this.array)),this.array[t+0]=e,this.array[t+1]=i,this}setXYZ(t,e,i,s){return t*=this.itemSize,this.normalized&&(e=cn(e,this.array),i=cn(i,this.array),s=cn(s,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=s,this}setXYZW(t,e,i,s,r){return t*=this.itemSize,this.normalized&&(e=cn(e,this.array),i=cn(i,this.array),s=cn(s,this.array),r=cn(r,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=s,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return t.name=this.name,t.usage=this.usage,t.gpuType=this.gpuType,t}dispose(){this.dispatchEvent({type:"dispose"})}};var eo=class extends Gn{constructor(t,e,i){super(new Uint16Array(t),e,i)}};var no=class extends Gn{constructor(t,e,i){super(new Uint32Array(t),e,i)}};var Pe=class extends Gn{constructor(t,e,i){super(new Float32Array(t),e,i)}},Mm=new ji,Wr=new L,Yc=new L,Es=class{constructor(t=new L,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){let i=this.center;e!==void 0?i.copy(e):Mm.setFromPoints(t).getCenter(i);let s=0;for(let r=0,o=t.length;r<o;r++)s=Math.max(s,i.distanceToSquared(t[r]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){let e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){let i=this.center.distanceToSquared(t);return e.copy(t),i>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;Wr.subVectors(t,this.center);let e=Wr.lengthSq();if(e>this.radius*this.radius){let i=Math.sqrt(e),s=(i-this.radius)*.5;this.center.addScaledVector(Wr,s/i),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(Yc.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(Wr.copy(t.center).add(Yc)),this.expandByPoint(Wr.copy(t.center).sub(Yc))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(t){return this.radius=t.radius,this.center.fromArray(t.center),this}},Sm=0,Hn=new De,Zc=new Ke,js=new L,In=new ji,Xr=new ji,Je=new L,Ge=class n extends Qn{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Sm++}),this.uuid=br(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(qp(t)?no:eo)(t,1):this.index=t,this}setIndirect(t,e=0){return this.indirect=t,this.indirectOffset=e,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,i=0){this.groups.push({start:t,count:e,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){let e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);let i=this.attributes.normal;if(i!==void 0){let r=new jt().getNormalMatrix(t);i.applyNormalMatrix(r),i.needsUpdate=!0}let s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(t){return Hn.makeRotationFromQuaternion(t),this.applyMatrix4(Hn),this}rotateX(t){return Hn.makeRotationX(t),this.applyMatrix4(Hn),this}rotateY(t){return Hn.makeRotationY(t),this.applyMatrix4(Hn),this}rotateZ(t){return Hn.makeRotationZ(t),this.applyMatrix4(Hn),this}translate(t,e,i){return Hn.makeTranslation(t,e,i),this.applyMatrix4(Hn),this}scale(t,e,i){return Hn.makeScale(t,e,i),this.applyMatrix4(Hn),this}lookAt(t){return Zc.lookAt(t),Zc.updateMatrix(),this.applyMatrix4(Zc.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(js).negate(),this.translate(js.x,js.y,js.z),this}setFromPoints(t){let e=this.getAttribute("position");if(e===void 0){let i=[];for(let s=0,r=t.length;s<r;s++){let o=t[s];i.push(o.x,o.y,o.z||0)}this.setAttribute("position",new Pe(i,3))}else{let i=Math.min(t.length,e.count);for(let s=0;s<i;s++){let r=t[s];e.setXYZ(s,r.x,r.y,r.z||0)}t.length>e.count&&Ht("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new ji);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){Zt("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new L(-1/0,-1/0,-1/0),new L(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let i=0,s=e.length;i<s;i++){let r=e[i];In.setFromBufferAttribute(r),this.morphTargetsRelative?(Je.addVectors(this.boundingBox.min,In.min),this.boundingBox.expandByPoint(Je),Je.addVectors(this.boundingBox.max,In.max),this.boundingBox.expandByPoint(Je)):(this.boundingBox.expandByPoint(In.min),this.boundingBox.expandByPoint(In.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&Zt('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Es);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){Zt("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new L,1/0);return}if(t){let i=this.boundingSphere.center;if(In.setFromBufferAttribute(t),e)for(let r=0,o=e.length;r<o;r++){let a=e[r];Xr.setFromBufferAttribute(a),this.morphTargetsRelative?(Je.addVectors(In.min,Xr.min),In.expandByPoint(Je),Je.addVectors(In.max,Xr.max),In.expandByPoint(Je)):(In.expandByPoint(Xr.min),In.expandByPoint(Xr.max))}In.getCenter(i);let s=0;for(let r=0,o=t.count;r<o;r++)Je.fromBufferAttribute(t,r),s=Math.max(s,i.distanceToSquared(Je));if(e)for(let r=0,o=e.length;r<o;r++){let a=e[r],l=this.morphTargetsRelative;for(let c=0,u=a.count;c<u;c++)Je.fromBufferAttribute(a,c),l&&(js.fromBufferAttribute(t,c),Je.add(js)),s=Math.max(s,i.distanceToSquared(Je))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&Zt('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){Zt("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let i=e.position,s=e.normal,r=e.uv,o=this.getAttribute("tangent");(o===void 0||o.count!==i.count)&&(o=new Gn(new Float32Array(4*i.count),4),this.setAttribute("tangent",o));let a=[],l=[];for(let y=0;y<i.count;y++)a[y]=new L,l[y]=new L;let c=new L,u=new L,d=new L,h=new Yt,f=new Yt,m=new Yt,x=new L,g=new L;function p(y,w,P){c.fromBufferAttribute(i,y),u.fromBufferAttribute(i,w),d.fromBufferAttribute(i,P),h.fromBufferAttribute(r,y),f.fromBufferAttribute(r,w),m.fromBufferAttribute(r,P),u.sub(c),d.sub(c),f.sub(h),m.sub(h);let F=1/(f.x*m.y-m.x*f.y);isFinite(F)&&(x.copy(u).multiplyScalar(m.y).addScaledVector(d,-f.y).multiplyScalar(F),g.copy(d).multiplyScalar(f.x).addScaledVector(u,-m.x).multiplyScalar(F),a[y].add(x),a[w].add(x),a[P].add(x),l[y].add(g),l[w].add(g),l[P].add(g))}let S=this.groups;S.length===0&&(S=[{start:0,count:t.count}]);for(let y=0,w=S.length;y<w;++y){let P=S[y],F=P.start,B=P.count;for(let V=F,I=F+B;V<I;V+=3)p(t.getX(V+0),t.getX(V+1),t.getX(V+2))}let A=new L,M=new L,T=new L,b=new L;function C(y){T.fromBufferAttribute(s,y),b.copy(T);let w=a[y];A.copy(w),A.sub(T.multiplyScalar(T.dot(w))).normalize(),M.crossVectors(b,w);let F=M.dot(l[y])<0?-1:1;o.setXYZW(y,A.x,A.y,A.z,F)}for(let y=0,w=S.length;y<w;++y){let P=S[y],F=P.start,B=P.count;for(let V=F,I=F+B;V<I;V+=3)C(t.getX(V+0)),C(t.getX(V+1)),C(t.getX(V+2))}this._transformed=!0}computeVertexNormals(){let t=this.index,e=this.getAttribute("position");if(e!==void 0){let i=this.getAttribute("normal");if(i===void 0||i.count!==e.count)i=new Gn(new Float32Array(e.count*3),3),this.setAttribute("normal",i);else for(let h=0,f=i.count;h<f;h++)i.setXYZ(h,0,0,0);let s=new L,r=new L,o=new L,a=new L,l=new L,c=new L,u=new L,d=new L;if(t)for(let h=0,f=t.count;h<f;h+=3){let m=t.getX(h+0),x=t.getX(h+1),g=t.getX(h+2);s.fromBufferAttribute(e,m),r.fromBufferAttribute(e,x),o.fromBufferAttribute(e,g),u.subVectors(o,r),d.subVectors(s,r),u.cross(d),a.fromBufferAttribute(i,m),l.fromBufferAttribute(i,x),c.fromBufferAttribute(i,g),a.add(u),l.add(u),c.add(u),i.setXYZ(m,a.x,a.y,a.z),i.setXYZ(x,l.x,l.y,l.z),i.setXYZ(g,c.x,c.y,c.z)}else for(let h=0,f=e.count;h<f;h+=3)s.fromBufferAttribute(e,h+0),r.fromBufferAttribute(e,h+1),o.fromBufferAttribute(e,h+2),u.subVectors(o,r),d.subVectors(s,r),u.cross(d),i.setXYZ(h+0,u.x,u.y,u.z),i.setXYZ(h+1,u.x,u.y,u.z),i.setXYZ(h+2,u.x,u.y,u.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){let t=this.attributes.normal;for(let e=0,i=t.count;e<i;e++)Je.fromBufferAttribute(t,e),Je.normalize(),t.setXYZ(e,Je.x,Je.y,Je.z)}toNonIndexed(){function t(a,l){let c=a.array,u=a.itemSize,d=a.normalized,h=new c.constructor(l.length*u),f=0,m=0;for(let x=0,g=l.length;x<g;x++){a.isInterleavedBufferAttribute?f=l[x]*a.data.stride+a.offset:f=l[x]*u;for(let p=0;p<u;p++)h[m++]=c[f++]}return new Gn(h,u,d)}if(this.index===null)return Ht("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let e=new n,i=this.index.array,s=this.attributes;for(let a in s){let l=s[a],c=t(l,i);e.setAttribute(a,c)}let r=this.morphAttributes;for(let a in r){let l=[],c=r[a];for(let u=0,d=c.length;u<d;u++){let h=c[u],f=t(h,i);l.push(f)}e.morphAttributes[a]=l}e.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let a=0,l=o.length;a<l;a++){let c=o[a];e.addGroup(c.start,c.count,c.materialIndex)}return e}toJSON(){let t={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,t.name=this.name,Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){let l=this.parameters;for(let c in l)l[c]!==void 0&&(t[c]=l[c]);return t}t.data={attributes:{}};let e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});let i=this.attributes;for(let l in i){let c=i[l];t.data.attributes[l]=c.toJSON(t.data)}let s={},r=!1;for(let l in this.morphAttributes){let c=this.morphAttributes[l],u=[];for(let d=0,h=c.length;d<h;d++){let f=c[d];u.push(f.toJSON(t.data))}u.length>0&&(s[l]=u,r=!0)}r&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);let o=this.groups;o.length>0&&(t.data.groups=JSON.parse(JSON.stringify(o)));let a=this.boundingSphere;return a!==null&&(t.data.boundingSphere=a.toJSON()),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let e={};this.name=t.name;let i=t.index;i!==null&&this.setIndex(i.clone());let s=t.attributes;for(let c in s){let u=s[c];this.setAttribute(c,u.clone(e))}let r=t.morphAttributes;for(let c in r){let u=[],d=r[c];for(let h=0,f=d.length;h<f;h++)u.push(d[h].clone(e));this.morphAttributes[c]=u}this.morphTargetsRelative=t.morphTargetsRelative;let o=t.groups;for(let c=0,u=o.length;c<u;c++){let d=o[c];this.addGroup(d.start,d.count,d.materialIndex)}let a=t.boundingBox;a!==null&&(this.boundingBox=a.clone());let l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this._transformed=t._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}};var Jc=new L,bm=new L,Tm=new jt,Ln=class{constructor(t=new L(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,i,s){return this.normal.set(t,e,i),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,i){let s=Jc.subVectors(i,e).cross(bm.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){let t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e,i=!0){let s=t.delta(Jc),r=this.normal.dot(s);if(r===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;let o=-(t.start.dot(this.normal)+this.constant)/r;return i===!0&&(o<0||o>1)?null:e.copy(t.start).addScaledVector(s,o)}intersectsLine(t){let e=this.distanceToPoint(t.start),i=this.distanceToPoint(t.end);return e<0&&i>0||i<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){let i=e||Tm.getNormalMatrix(t),s=this.coplanarPoint(Jc).applyMatrix4(t),r=this.normal.applyMatrix3(i).normalize();return this.constant=-s.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(t){return this.normal.fromArray(t.normal),this.constant=t.constant,this}},Em=0,Fi=class extends Qn{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Em++}),this.uuid=br(),this.name="",this.type="Material",this.blending=vr,this.side=as,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=ph,this.blendDst=mh,this.blendEquation=Cs,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new oe(0,0,0),this.blendAlpha=0,this.depthFunc=rr,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=cf,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Ea,this.stencilZFail=Ea,this.stencilZPass=Ea,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(let e in t){let i=t[e];if(i===void 0){Ht(`Material: parameter '${e}' has value of undefined.`);continue}let s=this[e];if(s===void 0){Ht(`Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(i):s&&s.isVector2&&i&&i.isVector2||s&&s.isEuler&&i&&i.isEuler||s&&s.isVector3&&i&&i.isVector3?s.copy(i):this[e]=i}}toJSON(t){let e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});let i={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,i.blending=this.blending,i.side=this.side,i.shadowSide=this.shadowSide,i.vertexColors=this.vertexColors,i.opacity=this.opacity,i.transparent=this.transparent,i.blendSrc=this.blendSrc,i.blendDst=this.blendDst,i.blendEquation=this.blendEquation,i.blendSrcAlpha=this.blendSrcAlpha,i.blendDstAlpha=this.blendDstAlpha,i.blendEquationAlpha=this.blendEquationAlpha,i.blendColor=this.blendColor.getHex(),i.blendAlpha=this.blendAlpha,i.depthFunc=this.depthFunc,i.depthTest=this.depthTest,i.depthWrite=this.depthWrite,i.colorWrite=this.colorWrite,i.clipIntersection=this.clipIntersection,i.clipShadows=this.clipShadows,i.stencilWriteMask=this.stencilWriteMask,i.stencilFunc=this.stencilFunc,i.stencilRef=this.stencilRef,i.stencilFuncMask=this.stencilFuncMask,i.stencilFail=this.stencilFail,i.stencilZFail=this.stencilZFail,i.stencilZPass=this.stencilZPass,i.stencilWrite=this.stencilWrite,i.polygonOffset=this.polygonOffset,i.polygonOffsetFactor=this.polygonOffsetFactor,i.polygonOffsetUnits=this.polygonOffsetUnits,i.dithering=this.dithering,i.alphaTest=this.alphaTest,i.alphaHash=this.alphaHash,i.alphaToCoverage=this.alphaToCoverage,i.premultipliedAlpha=this.premultipliedAlpha,i.forceSinglePass=this.forceSinglePass,i.allowOverride=this.allowOverride,i.visible=this.visible,i.toneMapped=this.toneMapped,i.name=this.name,this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(i.sheenColorMap=this.sheenColorMap.toJSON(t).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(i.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(t).uuid),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(i.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(t).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(t).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(t).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(t).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(t).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(i.clippingPlanes=this.clippingPlanes.map(r=>r.toJSON())),this.rotation!==void 0&&(i.rotation=this.rotation),this.depthPacking!==void 0&&(i.depthPacking=this.depthPacking),this.linewidth!==void 0&&(i.linewidth=this.linewidth),this.linecap!==void 0&&(i.linecap=this.linecap),this.linejoin!==void 0&&(i.linejoin=this.linejoin),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.wireframe!==void 0&&(i.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(i.flatShading=this.flatShading),this.fog!==void 0&&(i.fog=this.fog),Object.keys(this.userData).length>0&&(i.userData=this.userData);function s(r){let o=[];for(let a in r){let l=r[a];delete l.metadata,o.push(l)}return o}if(e){let r=s(t.textures),o=s(t.images);r.length>0&&(i.textures=r),o.length>0&&(i.images=o)}return i}fromJSON(t,e){if(t.uuid!==void 0&&(this.uuid=t.uuid),t.name!==void 0&&(this.name=t.name),t.color!==void 0&&this.color!==void 0&&this.color.setHex(t.color),t.roughness!==void 0&&(this.roughness=t.roughness),t.metalness!==void 0&&(this.metalness=t.metalness),t.sheen!==void 0&&(this.sheen=t.sheen),t.sheenColor!==void 0&&(this.sheenColor=new oe().setHex(t.sheenColor)),t.sheenRoughness!==void 0&&(this.sheenRoughness=t.sheenRoughness),t.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(t.emissive),t.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(t.specular),t.specularIntensity!==void 0&&(this.specularIntensity=t.specularIntensity),t.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(t.specularColor),t.shininess!==void 0&&(this.shininess=t.shininess),t.clearcoat!==void 0&&(this.clearcoat=t.clearcoat),t.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=t.clearcoatRoughness),t.dispersion!==void 0&&(this.dispersion=t.dispersion),t.retroreflectivity!==void 0&&(this.retroreflectivity=t.retroreflectivity),t.iridescence!==void 0&&(this.iridescence=t.iridescence),t.iridescenceIOR!==void 0&&(this.iridescenceIOR=t.iridescenceIOR),t.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=t.iridescenceThicknessRange),t.transmission!==void 0&&(this.transmission=t.transmission),t.thickness!==void 0&&(this.thickness=t.thickness),t.attenuationDistance!==void 0&&(this.attenuationDistance=t.attenuationDistance),t.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(t.attenuationColor),t.anisotropy!==void 0&&(this.anisotropy=t.anisotropy),t.anisotropyRotation!==void 0&&(this.anisotropyRotation=t.anisotropyRotation),t.fog!==void 0&&(this.fog=t.fog),t.flatShading!==void 0&&(this.flatShading=t.flatShading),t.blending!==void 0&&(this.blending=t.blending),t.combine!==void 0&&(this.combine=t.combine),t.side!==void 0&&(this.side=t.side),t.shadowSide!==void 0&&(this.shadowSide=t.shadowSide),t.opacity!==void 0&&(this.opacity=t.opacity),t.transparent!==void 0&&(this.transparent=t.transparent),t.alphaTest!==void 0&&(this.alphaTest=t.alphaTest),t.alphaHash!==void 0&&(this.alphaHash=t.alphaHash),t.depthFunc!==void 0&&(this.depthFunc=t.depthFunc),t.depthTest!==void 0&&(this.depthTest=t.depthTest),t.depthWrite!==void 0&&(this.depthWrite=t.depthWrite),t.colorWrite!==void 0&&(this.colorWrite=t.colorWrite),t.clippingPlanes!==void 0&&(this.clippingPlanes=t.clippingPlanes.map(i=>new Ln().fromJSON(i))),t.clipIntersection!==void 0&&(this.clipIntersection=t.clipIntersection),t.clipShadows!==void 0&&(this.clipShadows=t.clipShadows),t.depthPacking!==void 0&&(this.depthPacking=t.depthPacking),t.blendSrc!==void 0&&(this.blendSrc=t.blendSrc),t.blendDst!==void 0&&(this.blendDst=t.blendDst),t.blendEquation!==void 0&&(this.blendEquation=t.blendEquation),t.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=t.blendSrcAlpha),t.blendDstAlpha!==void 0&&(this.blendDstAlpha=t.blendDstAlpha),t.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=t.blendEquationAlpha),t.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(t.blendColor),t.blendAlpha!==void 0&&(this.blendAlpha=t.blendAlpha),t.stencilWriteMask!==void 0&&(this.stencilWriteMask=t.stencilWriteMask),t.stencilFunc!==void 0&&(this.stencilFunc=t.stencilFunc),t.stencilRef!==void 0&&(this.stencilRef=t.stencilRef),t.stencilFuncMask!==void 0&&(this.stencilFuncMask=t.stencilFuncMask),t.stencilFail!==void 0&&(this.stencilFail=t.stencilFail),t.stencilZFail!==void 0&&(this.stencilZFail=t.stencilZFail),t.stencilZPass!==void 0&&(this.stencilZPass=t.stencilZPass),t.stencilWrite!==void 0&&(this.stencilWrite=t.stencilWrite),t.wireframe!==void 0&&(this.wireframe=t.wireframe),t.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=t.wireframeLinewidth),t.wireframeLinecap!==void 0&&(this.wireframeLinecap=t.wireframeLinecap),t.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=t.wireframeLinejoin),t.rotation!==void 0&&(this.rotation=t.rotation),t.linewidth!==void 0&&(this.linewidth=t.linewidth),t.linecap!==void 0&&(this.linecap=t.linecap),t.linejoin!==void 0&&(this.linejoin=t.linejoin),t.dashSize!==void 0&&(this.dashSize=t.dashSize),t.gapSize!==void 0&&(this.gapSize=t.gapSize),t.scale!==void 0&&(this.scale=t.scale),t.polygonOffset!==void 0&&(this.polygonOffset=t.polygonOffset),t.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=t.polygonOffsetFactor),t.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=t.polygonOffsetUnits),t.dithering!==void 0&&(this.dithering=t.dithering),t.alphaToCoverage!==void 0&&(this.alphaToCoverage=t.alphaToCoverage),t.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=t.premultipliedAlpha),t.forceSinglePass!==void 0&&(this.forceSinglePass=t.forceSinglePass),t.allowOverride!==void 0&&(this.allowOverride=t.allowOverride),t.visible!==void 0&&(this.visible=t.visible),t.toneMapped!==void 0&&(this.toneMapped=t.toneMapped),t.userData!==void 0&&(this.userData=t.userData),t.vertexColors!==void 0&&(typeof t.vertexColors=="number"?this.vertexColors=t.vertexColors>0:this.vertexColors=t.vertexColors),t.size!==void 0&&(this.size=t.size),t.sizeAttenuation!==void 0&&(this.sizeAttenuation=t.sizeAttenuation),t.map!==void 0&&(this.map=e[t.map]||null),t.matcap!==void 0&&(this.matcap=e[t.matcap]||null),t.alphaMap!==void 0&&(this.alphaMap=e[t.alphaMap]||null),t.bumpMap!==void 0&&(this.bumpMap=e[t.bumpMap]||null),t.bumpScale!==void 0&&(this.bumpScale=t.bumpScale),t.normalMap!==void 0&&(this.normalMap=e[t.normalMap]||null),t.normalMapType!==void 0&&(this.normalMapType=t.normalMapType),t.normalScale!==void 0){let i=t.normalScale;Array.isArray(i)===!1&&(i=[i,i]),this.normalScale=new Yt().fromArray(i)}return t.displacementMap!==void 0&&(this.displacementMap=e[t.displacementMap]||null),t.displacementScale!==void 0&&(this.displacementScale=t.displacementScale),t.displacementBias!==void 0&&(this.displacementBias=t.displacementBias),t.roughnessMap!==void 0&&(this.roughnessMap=e[t.roughnessMap]||null),t.metalnessMap!==void 0&&(this.metalnessMap=e[t.metalnessMap]||null),t.emissiveMap!==void 0&&(this.emissiveMap=e[t.emissiveMap]||null),t.emissiveIntensity!==void 0&&(this.emissiveIntensity=t.emissiveIntensity),t.specularMap!==void 0&&(this.specularMap=e[t.specularMap]||null),t.specularIntensityMap!==void 0&&(this.specularIntensityMap=e[t.specularIntensityMap]||null),t.specularColorMap!==void 0&&(this.specularColorMap=e[t.specularColorMap]||null),t.envMap!==void 0&&(this.envMap=e[t.envMap]||null),t.envMapRotation!==void 0&&this.envMapRotation.fromArray(t.envMapRotation),t.envMapIntensity!==void 0&&(this.envMapIntensity=t.envMapIntensity),t.reflectivity!==void 0&&(this.reflectivity=t.reflectivity),t.refractionRatio!==void 0&&(this.refractionRatio=t.refractionRatio),t.lightMap!==void 0&&(this.lightMap=e[t.lightMap]||null),t.lightMapIntensity!==void 0&&(this.lightMapIntensity=t.lightMapIntensity),t.aoMap!==void 0&&(this.aoMap=e[t.aoMap]||null),t.aoMapIntensity!==void 0&&(this.aoMapIntensity=t.aoMapIntensity),t.gradientMap!==void 0&&(this.gradientMap=e[t.gradientMap]||null),t.clearcoatMap!==void 0&&(this.clearcoatMap=e[t.clearcoatMap]||null),t.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=e[t.clearcoatRoughnessMap]||null),t.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=e[t.clearcoatNormalMap]||null),t.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new Yt().fromArray(t.clearcoatNormalScale)),t.iridescenceMap!==void 0&&(this.iridescenceMap=e[t.iridescenceMap]||null),t.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=e[t.iridescenceThicknessMap]||null),t.transmissionMap!==void 0&&(this.transmissionMap=e[t.transmissionMap]||null),t.thicknessMap!==void 0&&(this.thicknessMap=e[t.thicknessMap]||null),t.anisotropyMap!==void 0&&(this.anisotropyMap=e[t.anisotropyMap]||null),t.sheenColorMap!==void 0&&(this.sheenColorMap=e[t.sheenColorMap]||null),t.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=e[t.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;let e=t.clippingPlanes,i=null;if(e!==null){let s=e.length;i=new Array(s);for(let r=0;r!==s;++r)i[r]=e[r].clone()}return this.clippingPlanes=i,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.allowOverride=t.allowOverride,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}};var Ii=new L,$c=new L,oa=new L,aa=new L,ws=class{constructor(t=new L,e=new L(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,Ii)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);let i=e.dot(this.direction);return i<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){let e=Ii.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(Ii.copy(this.origin).addScaledVector(this.direction,e),Ii.distanceToSquared(t))}distanceSqToSegment(t,e,i,s){$c.copy(t).add(e).multiplyScalar(.5),oa.copy(e).sub(t).normalize(),aa.copy(this.origin).sub($c);let r=t.distanceTo(e)*.5,o=-this.direction.dot(oa),a=aa.dot(this.direction),l=-aa.dot(oa),c=aa.lengthSq(),u=Math.abs(1-o*o),d,h,f,m;if(u>0)if(d=o*l-a,h=o*a-l,m=r*u,d>=0)if(h>=-m)if(h<=m){let x=1/u;d*=x,h*=x,f=d*(d+o*h+2*a)+h*(o*d+h+2*l)+c}else h=r,d=Math.max(0,-(o*h+a)),f=-d*d+h*(h+2*l)+c;else h=-r,d=Math.max(0,-(o*h+a)),f=-d*d+h*(h+2*l)+c;else h<=-m?(d=Math.max(0,-(-o*r+a)),h=d>0?-r:Math.min(Math.max(-r,-l),r),f=-d*d+h*(h+2*l)+c):h<=m?(d=0,h=Math.min(Math.max(-r,-l),r),f=h*(h+2*l)+c):(d=Math.max(0,-(o*r+a)),h=d>0?r:Math.min(Math.max(-r,-l),r),f=-d*d+h*(h+2*l)+c);else h=o>0?-r:r,d=Math.max(0,-(o*h+a)),f=-d*d+h*(h+2*l)+c;return i&&i.copy(this.origin).addScaledVector(this.direction,d),s&&s.copy($c).addScaledVector(oa,h),f}intersectSphere(t,e){if(t.radius<0)return null;Ii.subVectors(t.center,this.origin);let i=Ii.dot(this.direction),s=Ii.dot(Ii)-i*i,r=t.radius*t.radius;if(s>r)return null;let o=Math.sqrt(r-s),a=i-o,l=i+o;return l<0?null:a<0?this.at(l,e):this.at(a,e)}intersectsSphere(t){return t.radius<0?!1:this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){let e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;let i=-(this.origin.dot(t.normal)+t.constant)/e;return i>=0?i:null}intersectPlane(t,e){let i=this.distanceToPlane(t);return i===null?null:this.at(i,e)}intersectsPlane(t){let e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let i,s,r,o,a,l,c=1/this.direction.x,u=1/this.direction.y,d=1/this.direction.z,h=this.origin;return c>=0?(i=(t.min.x-h.x)*c,s=(t.max.x-h.x)*c):(i=(t.max.x-h.x)*c,s=(t.min.x-h.x)*c),u>=0?(r=(t.min.y-h.y)*u,o=(t.max.y-h.y)*u):(r=(t.max.y-h.y)*u,o=(t.min.y-h.y)*u),i>o||r>s||((r>i||isNaN(i))&&(i=r),(o<s||isNaN(s))&&(s=o),d>=0?(a=(t.min.z-h.z)*d,l=(t.max.z-h.z)*d):(a=(t.max.z-h.z)*d,l=(t.min.z-h.z)*d),i>l||a>s)||((a>i||i!==i)&&(i=a),(l<s||s!==s)&&(s=l),s<0)?null:this.at(i>=0?i:s,e)}intersectsBox(t){return this.intersectBox(t,Ii)!==null}intersectTriangle(t,e,i,s,r){let o=this.origin,a=this.direction,l=a.x,c=a.y,u=a.z,d=t.x-o.x,h=t.y-o.y,f=t.z-o.z,m=e.x-o.x,x=e.y-o.y,g=e.z-o.z,p=i.x-o.x,S=i.y-o.y,A=i.z-o.z,M=Math.abs(l),T=Math.abs(c),b=Math.abs(u),C,y,w,P,F,B,V,I,k,W,J,et;if(M>=T&&M>=b?(w=l,B=d,k=m,et=p,l>=0?(C=c,y=u,P=h,F=f,V=x,I=g,W=S,J=A):(C=u,y=c,P=f,F=h,V=g,I=x,W=A,J=S)):T>=b?(w=c,B=h,k=x,et=S,c>=0?(C=u,y=l,P=f,F=d,V=g,I=m,W=A,J=p):(C=l,y=u,P=d,F=f,V=m,I=g,W=p,J=A)):(w=u,B=f,k=g,et=A,u>=0?(C=l,y=c,P=d,F=h,V=m,I=x,W=p,J=S):(C=c,y=l,P=h,F=d,V=x,I=m,W=S,J=p)),w===0)return null;let U=C/w,q=y/w,j=1/w,yt=P-U*B,bt=F-q*B,pe=V-U*k,Xt=I-q*k,Tt=W-U*et,Y=J-q*et,K=Tt*Xt-Y*pe,it=yt*Y-bt*Tt,Rt=pe*bt-Xt*yt;if(s){if(K<0||it<0||Rt<0)return null}else if((K<0||it<0||Rt<0)&&(K>0||it>0||Rt>0))return null;let ot=K+it+Rt;if(ot===0)return null;let ut=j*(K*B+it*k+Rt*et);return(ot>0?ut<0:ut>0)?null:this.at(ut/ot,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},ur=class extends Fi{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new oe(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Ui,this.combine=gh,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}},Md=new De,Ss=new ws,la=new Es,Sd=new L,ca=new L,ha=new L,ua=new L,Kc=new L,da=new L,bd=new L,fa=new L,un=class extends Ke{constructor(t=new Ge,e=new ur){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){let e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){let s=e[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(t,e){let i=this.geometry,s=i.attributes.position,r=i.morphAttributes.position,o=i.morphTargetsRelative;e.fromBufferAttribute(s,t);let a=this.morphTargetInfluences;if(r&&a){da.set(0,0,0);for(let l=0,c=r.length;l<c;l++){let u=a[l],d=r[l];u!==0&&(Kc.fromBufferAttribute(d,t),o?da.addScaledVector(Kc,u):da.addScaledVector(Kc.sub(e),u))}e.add(da)}return e}intersectsFrustum(t){return t.intersectsObject(this)}raycast(t,e){let i=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),la.copy(i.boundingSphere),la.applyMatrix4(r),Ss.copy(t.ray).recast(t.near),!(la.containsPoint(Ss.origin)===!1&&(Ss.intersectSphere(la,Sd)===null||Ss.origin.distanceToSquared(Sd)>(t.far-t.near)**2))&&(Md.copy(r).invert(),Ss.copy(t.ray).applyMatrix4(Md),!(i.boundingBox!==null&&Ss.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(t,e,Ss)))}_computeIntersections(t,e,i){let s,r=this.geometry,o=this.material,a=r.index,l=r.attributes.position,c=r.attributes.uv,u=r.attributes.uv1,d=r.attributes.normal,h=r.groups,f=r.drawRange;if(a!==null)if(Array.isArray(o))for(let m=0,x=h.length;m<x;m++){let g=h[m],p=o[g.materialIndex],S=Math.max(g.start,f.start),A=Math.min(a.count,Math.min(g.start+g.count,f.start+f.count));for(let M=S,T=A;M<T;M+=3){let b=a.getX(M),C=a.getX(M+1),y=a.getX(M+2);s=pa(this,p,t,i,c,u,d,b,C,y),s&&(s.faceIndex=Math.floor(M/3),s.face.materialIndex=g.materialIndex,e.push(s))}}else{let m=Math.max(0,f.start),x=Math.min(a.count,f.start+f.count);for(let g=m,p=x;g<p;g+=3){let S=a.getX(g),A=a.getX(g+1),M=a.getX(g+2);s=pa(this,o,t,i,c,u,d,S,A,M),s&&(s.faceIndex=Math.floor(g/3),e.push(s))}}else if(l!==void 0)if(Array.isArray(o))for(let m=0,x=h.length;m<x;m++){let g=h[m],p=o[g.materialIndex],S=Math.max(g.start,f.start),A=Math.min(l.count,Math.min(g.start+g.count,f.start+f.count));for(let M=S,T=A;M<T;M+=3){let b=M,C=M+1,y=M+2;s=pa(this,p,t,i,c,u,d,b,C,y),s&&(s.faceIndex=Math.floor(M/3),s.face.materialIndex=g.materialIndex,e.push(s))}}else{let m=Math.max(0,f.start),x=Math.min(l.count,f.start+f.count);for(let g=m,p=x;g<p;g+=3){let S=g,A=g+1,M=g+2;s=pa(this,o,t,i,c,u,d,S,A,M),s&&(s.faceIndex=Math.floor(g/3),e.push(s))}}}};function wm(n,t,e,i,s,r,o,a){let l;if(t.side===pn?l=i.intersectTriangle(o,r,s,!0,a):l=i.intersectTriangle(s,r,o,t.side===as,a),l===null)return null;fa.copy(a),fa.applyMatrix4(n.matrixWorld);let c=e.ray.origin.distanceTo(fa);return c<e.near||c>e.far?null:{distance:c,point:fa.clone(),object:n}}function pa(n,t,e,i,s,r,o,a,l,c){n.getVertexPosition(a,ca),n.getVertexPosition(l,ha),n.getVertexPosition(c,ua);let u=wm(n,t,e,i,ca,ha,ua,bd);if(u){let d=new L;Li.getBarycoord(bd,ca,ha,ua,d),s&&(u.uv=Li.getInterpolatedAttribute(s,a,l,c,d,new Yt)),r&&(u.uv1=Li.getInterpolatedAttribute(r,a,l,c,d,new Yt)),o&&(u.normal=Li.getInterpolatedAttribute(o,a,l,c,d,new L),u.normal.dot(i.direction)>0&&u.normal.multiplyScalar(-1));let h={a,b:l,c,normal:new L,materialIndex:0};Li.getNormal(ca,ha,ua,h.normal),u.face=h,u.barycoord=d}return u}var ka=class extends vn{constructor(t=null,e=1,i=1,s,r,o,a,l,c=$e,u=$e,d,h){super(null,o,a,l,c,u,s,r,d,h),this.isDataTexture=!0,this.image={data:t,width:e,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var bs=new Es,Am=new Yt(.5,.5),ma=new L,dr=class{constructor(t=new Ln,e=new Ln,i=new Ln,s=new Ln,r=new Ln,o=new Ln){this.planes=[t,e,i,s,r,o]}set(t,e,i,s,r,o){let a=this.planes;return a[0].copy(t),a[1].copy(e),a[2].copy(i),a[3].copy(s),a[4].copy(r),a[5].copy(o),this}copy(t){let e=this.planes;for(let i=0;i<6;i++)e[i].copy(t.planes[i]);return this}setFromProjectionMatrix(t,e=jn,i=!1){let s=this.planes,r=t.elements,o=r[0],a=r[1],l=r[2],c=r[3],u=r[4],d=r[5],h=r[6],f=r[7],m=r[8],x=r[9],g=r[10],p=r[11],S=r[12],A=r[13],M=r[14],T=r[15];if(s[0].setComponents(c-o,f-u,p-m,T-S).normalize(),s[1].setComponents(c+o,f+u,p+m,T+S).normalize(),s[2].setComponents(c+a,f+d,p+x,T+A).normalize(),s[3].setComponents(c-a,f-d,p-x,T-A).normalize(),i)s[4].setComponents(l,h,g,M).normalize(),s[5].setComponents(c-l,f-h,p-g,T-M).normalize();else if(s[4].setComponents(c-l,f-h,p-g,T-M).normalize(),e===jn)s[5].setComponents(c+l,f+h,p+g,T+M).normalize();else if(e===or)s[5].setComponents(l,h,g,M).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),bs.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{let e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),bs.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(bs)}intersectsSprite(t){bs.center.set(0,0,0);let e=Am.distanceTo(t.center);return bs.radius=.7071067811865476+e,bs.applyMatrix4(t.matrixWorld),this.intersectsSphere(bs)}intersectsSphere(t){let e=this.planes,i=t.center,s=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(i)<s)return!1;return!0}intersectsBox(t){let e=this.planes;for(let i=0;i<6;i++){let s=e[i];if(ma.x=s.normal.x>0?t.max.x:t.min.x,ma.y=s.normal.y>0?t.max.y:t.min.y,ma.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(ma)<0)return!1}return!0}containsPoint(t){let e=this.planes;for(let i=0;i<6;i++)if(e[i].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};var Sn=class extends Fi{constructor(t){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new oe(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}},za=new L,Va=new L,Td=new De,qr=new ws,ga=new Es,jc=new L,Ed=new L,As=class extends Ke{constructor(t=new Ge,e=new Sn){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){let t=this.geometry;if(t.index===null){let e=t.attributes.position,i=[0];for(let s=1,r=e.count;s<r;s++)za.fromBufferAttribute(e,s-1),Va.fromBufferAttribute(e,s),i[s]=i[s-1],i[s]+=za.distanceTo(Va);t.setAttribute("lineDistance",new Pe(i,1))}else Ht("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}intersectsFrustum(t){return t.intersectsObject(this)}raycast(t,e){let i=this.geometry,s=this.matrixWorld,r=t.params.Line.threshold,o=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),ga.copy(i.boundingSphere),ga.applyMatrix4(s),ga.radius+=r,t.ray.intersectsSphere(ga)===!1)return;Td.copy(s).invert(),qr.copy(t.ray).applyMatrix4(Td);let a=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=this.isLineSegments?2:1,u=i.index,h=i.attributes.position;if(u!==null){let f=Math.max(0,o.start),m=Math.min(u.count,o.start+o.count);for(let x=f,g=m-1;x<g;x+=c){let p=u.getX(x),S=u.getX(x+1),A=_a(this,t,qr,l,p,S,x);A&&e.push(A)}if(this.isLineLoop){let x=u.getX(m-1),g=u.getX(f),p=_a(this,t,qr,l,x,g,m-1);p&&e.push(p)}}else{let f=Math.max(0,o.start),m=Math.min(h.count,o.start+o.count);for(let x=f,g=m-1;x<g;x+=c){let p=_a(this,t,qr,l,x,x+1,x);p&&e.push(p)}if(this.isLineLoop){let x=_a(this,t,qr,l,m-1,f,m-1);x&&e.push(x)}}}updateMorphTargets(){let e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){let s=e[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}};function _a(n,t,e,i,s,r,o){let a=n.geometry.attributes.position;if(za.fromBufferAttribute(a,s),Va.fromBufferAttribute(a,r),e.distanceSqToSegment(za,Va,jc,Ed)>i)return;jc.applyMatrix4(n.matrixWorld);let c=t.ray.origin.distanceTo(jc);if(!(c<t.near||c>t.far))return{distance:c,point:Ed.clone().applyMatrix4(n.matrixWorld),index:o,face:null,faceIndex:null,barycoord:null,object:n}}var wd=new L,Ad=new L,_i=class extends As{constructor(t,e){super(t,e),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){let t=this.geometry;if(t.index===null){let e=t.attributes.position,i=[];for(let s=0,r=e.count;s<r;s+=2)wd.fromBufferAttribute(e,s),Ad.fromBufferAttribute(e,s+1),i[s]=s===0?0:i[s-1],i[s+1]=i[s]+wd.distanceTo(Ad);t.setAttribute("lineDistance",new Pe(i,1))}else Ht("LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}};var io=class extends vn{constructor(t=[],e=ls,i,s,r,o,a,l,c,u){super(t,e,i,s,r,o,a,l,c,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}};var Qi=class extends vn{constructor(t,e,i=ei,s,r,o,a=$e,l=$e,c,u=gi,d=1){if(u!==gi&&u!==hs)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");let h={width:t,height:e,depth:d};super(h,s,r,o,a,l,u,i,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.source=new cr(Object.assign({},t.image)),this.compareFunction=t.compareFunction,this}toJSON(t){let e=super.toJSON(t);return e.compareFunction=this.compareFunction,e}},Ha=class extends Qi{constructor(t,e=ei,i=ls,s,r,o=$e,a=$e,l,c=gi){let u={width:t,height:t,depth:1},d=[u,u,u,u,u,u];super(t,t,e,i,s,r,o,a,l,c),this.image=d,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(t){this.image=t}},so=class extends vn{constructor(t=null){super(),this.sourceTexture=t,this.isExternalTexture=!0}copy(t){return super.copy(t),this.sourceTexture=t.sourceTexture,this}},fr=class n extends Ge{constructor(t=1,e=1,i=1,s=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:i,widthSegments:s,heightSegments:r,depthSegments:o};let a=this;s=Math.floor(s),r=Math.floor(r),o=Math.floor(o);let l=[],c=[],u=[],d=[],h=0,f=0;m("z","y","x",-1,-1,i,e,t,o,r,0),m("z","y","x",1,-1,i,e,-t,o,r,1),m("x","z","y",1,1,t,i,e,s,o,2),m("x","z","y",1,-1,t,i,-e,s,o,3),m("x","y","z",1,-1,t,e,i,s,r,4),m("x","y","z",-1,-1,t,e,-i,s,r,5),this.setIndex(l),this.setAttribute("position",new Pe(c,3)),this.setAttribute("normal",new Pe(u,3)),this.setAttribute("uv",new Pe(d,2));function m(x,g,p,S,A,M,T,b,C,y,w){let P=M/C,F=T/y,B=M/2,V=T/2,I=b/2,k=C+1,W=y+1,J=0,et=0,U=new L;for(let q=0;q<W;q++){let j=q*F-V;for(let yt=0;yt<k;yt++){let bt=yt*P-B;U[x]=bt*S,U[g]=j*A,U[p]=I,c.push(U.x,U.y,U.z),U[x]=0,U[g]=0,U[p]=b>0?1:-1,u.push(U.x,U.y,U.z),d.push(yt/C),d.push(1-q/y),J+=1}}for(let q=0;q<y;q++)for(let j=0;j<C;j++){let yt=h+j+k*q,bt=h+j+k*(q+1),pe=h+(j+1)+k*(q+1),Xt=h+(j+1)+k*q;l.push(yt,bt,Xt),l.push(bt,pe,Xt),et+=6}a.addGroup(f,et,w),f+=et,h+=J}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new n(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}};var pr=class n extends Ge{constructor(t=1,e=1,i=1,s=32,r=1,o=!1,a=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:i,radialSegments:s,heightSegments:r,openEnded:o,thetaStart:a,thetaLength:l};let c=this;s=Math.floor(s),r=Math.floor(r);let u=[],d=[],h=[],f=[],m=0,x=[],g=i/2,p=0;S(),o===!1&&(t>0&&A(!0),e>0&&A(!1)),this.setIndex(u),this.setAttribute("position",new Pe(d,3)),this.setAttribute("normal",new Pe(h,3)),this.setAttribute("uv",new Pe(f,2));function S(){let M=new L,T=new L,b=0,C=(e-t)/i;for(let y=0;y<=r;y++){let w=[],P=y/r,F=P*(e-t)+t;for(let B=0;B<=s;B++){let V=B/s,I=V*l+a,k=Math.sin(I),W=Math.cos(I);T.x=F*k,T.y=-P*i+g,T.z=F*W,d.push(T.x,T.y,T.z),M.set(k,C,W).normalize(),h.push(M.x,M.y,M.z),f.push(V,1-P),w.push(m++)}x.push(w)}for(let y=0;y<s;y++)for(let w=0;w<r;w++){let P=x[w][y],F=x[w+1][y],B=x[w+1][y+1],V=x[w][y+1];(t>0||w!==0)&&(u.push(P,F,V),b+=3),(e>0||w!==r-1)&&(u.push(F,B,V),b+=3)}c.addGroup(p,b,0),p+=b}function A(M){let T=m,b=new Yt,C=new L,y=0,w=M===!0?t:e,P=M===!0?1:-1;for(let B=1;B<=s;B++)d.push(0,g*P,0),h.push(0,P,0),f.push(.5,.5),m++;let F=m;for(let B=0;B<=s;B++){let I=B/s*l+a,k=Math.cos(I),W=Math.sin(I);C.x=w*W,C.y=g*P,C.z=w*k,d.push(C.x,C.y,C.z),h.push(0,P,0),b.x=k*.5+.5,b.y=W*.5*P+.5,f.push(b.x,b.y),m++}for(let B=0;B<s;B++){let V=T+B,I=F+B;M===!0?u.push(I,I+1,V):u.push(I+1,I,V),y+=3}c.addGroup(p,y,M===!0?1:2),p+=y}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new n(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}},ts=class n extends pr{constructor(t=1,e=1,i=32,s=1,r=!1,o=0,a=Math.PI*2){super(0,t,e,i,s,r,o,a),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:i,heightSegments:s,openEnded:r,thetaStart:o,thetaLength:a}}static fromJSON(t){return new n(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}};var xa=new L,ya=new L,Qc=new L,va=new Li,ro=class extends Ge{constructor(t=null,e=1){if(super(),this.type="EdgesGeometry",this.parameters={geometry:t,thresholdAngle:e},t!==null){let s=Math.pow(10,4),r=Math.cos(ir*e),o=t.getIndex(),a=t.getAttribute("position"),l=o?o.count:a.count,c=[0,0,0],u=["a","b","c"],d=new Array(3),h={},f=[];for(let m=0;m<l;m+=3){o?(c[0]=o.getX(m),c[1]=o.getX(m+1),c[2]=o.getX(m+2)):(c[0]=m,c[1]=m+1,c[2]=m+2);let{a:x,b:g,c:p}=va;if(x.fromBufferAttribute(a,c[0]),g.fromBufferAttribute(a,c[1]),p.fromBufferAttribute(a,c[2]),va.getNormal(Qc),d[0]=`${Math.round(x.x*s)},${Math.round(x.y*s)},${Math.round(x.z*s)}`,d[1]=`${Math.round(g.x*s)},${Math.round(g.y*s)},${Math.round(g.z*s)}`,d[2]=`${Math.round(p.x*s)},${Math.round(p.y*s)},${Math.round(p.z*s)}`,!(d[0]===d[1]||d[1]===d[2]||d[2]===d[0]))for(let S=0;S<3;S++){let A=(S+1)%3,M=d[S],T=d[A],b=va[u[S]],C=va[u[A]],y=`${M}_${T}`,w=`${T}_${M}`;w in h&&h[w]?(Qc.dot(h[w].normal)<=r&&(f.push(b.x,b.y,b.z),f.push(C.x,C.y,C.z)),h[w]=null):y in h||(h[y]={index0:c[S],index1:c[A],normal:Qc.clone()})}}for(let m in h)if(h[m]){let{index0:x,index1:g}=h[m];xa.fromBufferAttribute(a,x),ya.fromBufferAttribute(a,g),f.push(xa.x,xa.y,xa.z),f.push(ya.x,ya.y,ya.z)}this.setAttribute("position",new Pe(f,3))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}};var dn=class n extends Ge{constructor(t=1,e=1,i=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:i,heightSegments:s};let r=t/2,o=e/2,a=Math.floor(i),l=Math.floor(s),c=a+1,u=l+1,d=t/a,h=e/l,f=[],m=[],x=[],g=[];for(let p=0;p<u;p++){let S=p*h-o;for(let A=0;A<c;A++){let M=A*d-r;m.push(M,-S,0),x.push(0,0,1),g.push(A/a),g.push(1-p/l)}}for(let p=0;p<l;p++)for(let S=0;S<a;S++){let A=S+c*p,M=S+c*(p+1),T=S+1+c*(p+1),b=S+1+c*p;f.push(A,M,b),f.push(M,T,b)}this.setIndex(f),this.setAttribute("position",new Pe(m,3)),this.setAttribute("normal",new Pe(x,3)),this.setAttribute("uv",new Pe(g,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new n(t.width,t.height,t.widthSegments,t.heightSegments)}};var fn=class n extends Ge{constructor(t=1,e=32,i=16,s=0,r=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:i,phiStart:s,phiLength:r,thetaStart:o,thetaLength:a},e=Math.max(3,Math.floor(e)),i=Math.max(2,Math.floor(i));let l=Math.min(o+a,Math.PI),c=0,u=[],d=new L,h=new L,f=[],m=[],x=[],g=[];for(let p=0;p<=i;p++){let S=[],A=p/i,M=o+A*a,T=t*Math.cos(M),b=Math.sqrt(t*t-T*T),C=0;p===0&&o===0?C=.5/e:p===i&&l===Math.PI&&(C=-.5/e);for(let y=0;y<=e;y++){let w=y/e,P=s+w*r;d.x=-b*Math.cos(P),d.y=T,d.z=b*Math.sin(P),m.push(d.x,d.y,d.z),h.copy(d).normalize(),x.push(h.x,h.y,h.z),g.push(w+C,1-A),S.push(c++)}u.push(S)}for(let p=0;p<i;p++)for(let S=0;S<e;S++){let A=u[p][S+1],M=u[p][S],T=u[p+1][S],b=u[p+1][S+1];(p!==0||o>0)&&f.push(A,M,b),(p!==i-1||l<Math.PI)&&f.push(M,T,b)}this.setIndex(f),this.setAttribute("position",new Pe(m,3)),this.setAttribute("normal",new Pe(x,3)),this.setAttribute("uv",new Pe(g,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new n(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}};var mr=class n extends Ge{constructor(t=1,e=.4,i=12,s=48,r=Math.PI*2,o=0,a=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:i,tubularSegments:s,arc:r,thetaStart:o,thetaLength:a},i=Math.floor(i),s=Math.floor(s);let l=[],c=[],u=[],d=[],h=new L,f=new L,m=new L;for(let x=0;x<=i;x++){let g=o+x/i*a;for(let p=0;p<=s;p++){let S=p/s*r;f.x=(t+e*Math.cos(g))*Math.cos(S),f.y=(t+e*Math.cos(g))*Math.sin(S),f.z=e*Math.sin(g),c.push(f.x,f.y,f.z),h.x=t*Math.cos(S),h.y=t*Math.sin(S),m.subVectors(f,h).normalize(),u.push(m.x,m.y,m.z),d.push(p/s),d.push(x/i)}}for(let x=1;x<=i;x++)for(let g=1;g<=s;g++){let p=(s+1)*x+g-1,S=(s+1)*(x-1)+g-1,A=(s+1)*(x-1)+g,M=(s+1)*x+g;l.push(p,S,M),l.push(S,A,M)}this.setIndex(l),this.setAttribute("position",new Pe(c,3)),this.setAttribute("normal",new Pe(u,3)),this.setAttribute("uv",new Pe(d,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new n(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc,t.thetaStart,t.thetaLength)}};var Oi=class extends Ge{constructor(t=null){if(super(),this.type="WireframeGeometry",this.parameters={geometry:t},t!==null){let e=[],i=new Set,s=new L,r=new L;if(t.index!==null){let o=t.attributes.position,a=t.index,l=t.groups;l.length===0&&(l=[{start:0,count:a.count,materialIndex:0}]);for(let c=0,u=l.length;c<u;++c){let d=l[c],h=d.start,f=d.count;for(let m=h,x=h+f;m<x;m+=3)for(let g=0;g<3;g++){let p=a.getX(m+g),S=a.getX(m+(g+1)%3);s.fromBufferAttribute(o,p),r.fromBufferAttribute(o,S),Cd(s,r,i)===!0&&(e.push(s.x,s.y,s.z),e.push(r.x,r.y,r.z))}}}else{let o=t.attributes.position;for(let a=0,l=o.count/3;a<l;a++)for(let c=0;c<3;c++){let u=3*a+c,d=3*a+(c+1)%3;s.fromBufferAttribute(o,u),r.fromBufferAttribute(o,d),Cd(s,r,i)===!0&&(e.push(s.x,s.y,s.z),e.push(r.x,r.y,r.z))}}this.setAttribute("position",new Pe(e,3))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}};function Cd(n,t,e){let i=`${n.x},${n.y},${n.z}-${t.x},${t.y},${t.z}`,s=`${t.x},${t.y},${t.z}-${n.x},${n.y},${n.z}`;return e.has(i)===!0||e.has(s)===!0?!1:(e.add(i),e.add(s),!0)}function Ps(n){let t={};for(let e in n){t[e]={};for(let i in n[e]){let s=n[e][i];if(Rd(s))s.isRenderTargetTexture?(Ht("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][i]=null):t[e][i]=s.clone();else if(Array.isArray(s))if(Rd(s[0])){let r=[];for(let o=0,a=s.length;o<a;o++)r[o]=s[o].clone();t[e][i]=r}else t[e][i]=s.slice();else t[e][i]=s}}return t}function sn(n){let t={};for(let e=0;e<n.length;e++){let i=Ps(n[e]);for(let s in i)t[s]=i[s]}return t}function Rd(n){return n&&(n.isColor||n.isMatrix3||n.isMatrix4||n.isVector2||n.isVector3||n.isVector4||n.isTexture||n.isQuaternion)}function Cm(n){let t=[];for(let e=0;e<n.length;e++)t.push(n[e].clone());return t}function Uh(n){let t=n.getRenderTarget();return t===null?n.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:ge.workingColorSpace}var Sf={clone:Ps,merge:sn},Rm=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Pm=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,Nn=class extends Fi{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Rm,this.fragmentShader=Pm,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=Ps(t.uniforms),this.uniformsGroups=Cm(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this.defaultAttributeValues=Object.assign({},t.defaultAttributeValues),this.index0AttributeName=t.index0AttributeName,this.uniformsNeedUpdate=t.uniformsNeedUpdate,this}toJSON(t){let e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(let s in this.uniforms){let o=this.uniforms[s].value;o&&o.isTexture?e.uniforms[s]={type:"t",value:o.toJSON(t).uuid}:o&&o.isColor?e.uniforms[s]={type:"c",value:o.getHex()}:o&&o.isVector2?e.uniforms[s]={type:"v2",value:o.toArray()}:o&&o.isVector3?e.uniforms[s]={type:"v3",value:o.toArray()}:o&&o.isVector4?e.uniforms[s]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?e.uniforms[s]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?e.uniforms[s]={type:"m4",value:o.toArray()}:e.uniforms[s]={value:o}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;let i={};for(let s in this.extensions)this.extensions[s]===!0&&(i[s]=!0);return Object.keys(i).length>0&&(e.extensions=i),e}fromJSON(t,e){if(super.fromJSON(t,e),t.uniforms!==void 0)for(let i in t.uniforms){let s=t.uniforms[i];switch(this.uniforms[i]={},s.type){case"t":this.uniforms[i].value=e[s.value]||null;break;case"c":this.uniforms[i].value=new oe().setHex(s.value);break;case"v2":this.uniforms[i].value=new Yt().fromArray(s.value);break;case"v3":this.uniforms[i].value=new L().fromArray(s.value);break;case"v4":this.uniforms[i].value=new Ne().fromArray(s.value);break;case"m3":this.uniforms[i].value=new jt().fromArray(s.value);break;case"m4":this.uniforms[i].value=new De().fromArray(s.value);break;default:this.uniforms[i].value=s.value}}if(t.defines!==void 0&&(this.defines=t.defines),t.vertexShader!==void 0&&(this.vertexShader=t.vertexShader),t.fragmentShader!==void 0&&(this.fragmentShader=t.fragmentShader),t.glslVersion!==void 0&&(this.glslVersion=t.glslVersion),t.extensions!==void 0)for(let i in t.extensions)this.extensions[i]=t.extensions[i];return t.lights!==void 0&&(this.lights=t.lights),t.clipping!==void 0&&(this.clipping=t.clipping),this}},Ga=class extends Nn{constructor(t){super(t),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}},Wa=class extends Fi{constructor(t){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new oe(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new oe(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=ql,this.normalScale=new Yt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Ui,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}},oo=class extends Wa{constructor(t){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new Yt(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return fe(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(e){this.ior=(1+.4*e)/(1-.4*e)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new oe(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new oe(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new oe(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._retroreflectivity=0,this._sheen=0,this._transmission=0,this.setValues(t)}get anisotropy(){return this._anisotropy}set anisotropy(t){this._anisotropy>0!=t>0&&this.version++,this._anisotropy=t}get clearcoat(){return this._clearcoat}set clearcoat(t){this._clearcoat>0!=t>0&&this.version++,this._clearcoat=t}get iridescence(){return this._iridescence}set iridescence(t){this._iridescence>0!=t>0&&this.version++,this._iridescence=t}get dispersion(){return this._dispersion}set dispersion(t){this._dispersion>0!=t>0&&this.version++,this._dispersion=t}get retroreflectivity(){return this._retroreflectivity}set retroreflectivity(t){this._retroreflectivity>0!=t>0&&this.version++,this._retroreflectivity=t}get sheen(){return this._sheen}set sheen(t){this._sheen>0!=t>0&&this.version++,this._sheen=t}get transmission(){return this._transmission}set transmission(t){this._transmission>0!=t>0&&this.version++,this._transmission=t}copy(t){return super.copy(t),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=t.anisotropy,this.anisotropyRotation=t.anisotropyRotation,this.anisotropyMap=t.anisotropyMap,this.clearcoat=t.clearcoat,this.clearcoatMap=t.clearcoatMap,this.clearcoatRoughness=t.clearcoatRoughness,this.clearcoatRoughnessMap=t.clearcoatRoughnessMap,this.clearcoatNormalMap=t.clearcoatNormalMap,this.clearcoatNormalScale.copy(t.clearcoatNormalScale),this.dispersion=t.dispersion,this.ior=t.ior,this.iridescence=t.iridescence,this.iridescenceMap=t.iridescenceMap,this.iridescenceIOR=t.iridescenceIOR,this.iridescenceThicknessRange=[...t.iridescenceThicknessRange],this.iridescenceThicknessMap=t.iridescenceThicknessMap,this.retroreflectivity=t.retroreflectivity,this.sheen=t.sheen,this.sheenColor.copy(t.sheenColor),this.sheenColorMap=t.sheenColorMap,this.sheenRoughness=t.sheenRoughness,this.sheenRoughnessMap=t.sheenRoughnessMap,this.transmission=t.transmission,this.transmissionMap=t.transmissionMap,this.thickness=t.thickness,this.thicknessMap=t.thicknessMap,this.attenuationDistance=t.attenuationDistance,this.attenuationColor.copy(t.attenuationColor),this.specularIntensity=t.specularIntensity,this.specularIntensityMap=t.specularIntensityMap,this.specularColor.copy(t.specularColor),this.specularColorMap=t.specularColorMap,this}};var Xa=class extends Fi{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=af,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}},qa=class extends Fi{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}};var ao=class extends Sn{constructor(t){super(),this.isLineDashedMaterial=!0,this.type="LineDashedMaterial",this.scale=1,this.dashSize=3,this.gapSize=1,this.setValues(t)}copy(t){return super.copy(t),this.scale=t.scale,this.dashSize=t.dashSize,this.gapSize=t.gapSize,this}};function Qs(n,t){return!n||n.constructor===t?n:typeof t.BYTES_PER_ELEMENT=="number"?new t(n):Array.prototype.slice.call(n)}function th(n){return n!==void 0&&n.inTangents!==void 0&&n.outTangents!==void 0}var es=class{constructor(t,e,i,s){this.parameterPositions=t,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new e.constructor(i),this.sampleValues=e,this.valueSize=i,this.settings=null,this.DefaultSettings_={}}evaluate(t){let e=this.parameterPositions,i=this._cachedIndex,s=e[i],r=e[i-1];t:{e:{let o;n:{i:if(!(t<s)){for(let a=i+2;;){if(s===void 0){if(t<r)break i;return i=e.length,this._cachedIndex=i,this.copySampleValue_(i-1)}if(i===a)break;if(r=s,s=e[++i],t<s)break e}o=e.length;break n}if(!(t>=r)){let a=e[1];t<a&&(i=2,r=a);for(let l=i-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(i===l)break;if(s=r,r=e[--i-1],t>=r)break e}o=i,i=0;break n}break t}for(;i<o;){let a=i+o>>>1;t<e[a]?o=a:i=a+1}if(s=e[i],r=e[i-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return i=e.length,this._cachedIndex=i,this.copySampleValue_(i-1)}this._cachedIndex=i,this.intervalChanged_(i,r,s)}return this.interpolate_(i,r,t,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(t){let e=this.resultBuffer,i=this.sampleValues,s=this.valueSize,r=t*s;for(let o=0;o!==s;++o)e[o]=i[r+o];return e}interpolate_(){throw new Error("THREE.Interpolant: Call to abstract method.")}intervalChanged_(){}},Ya=class extends es{constructor(t,e,i,s){super(t,e,i,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:sh,endingEnd:sh}}intervalChanged_(t,e,i){let s=this.parameterPositions,r=t-2,o=t+1,a=s[r],l=s[o];if(a===void 0)switch(this.getSettings_().endingStart){case rh:r=t,a=2*e-i;break;case oh:r=s.length-2,a=e+s[r]-s[r+1];break;default:r=t,a=i}if(l===void 0)switch(this.getSettings_().endingEnd){case rh:o=t,l=2*i-e;break;case oh:o=1,l=i+s[1]-s[0];break;default:o=t-1,l=e}let c=(i-e)*.5,u=this.valueSize;this._weightPrev=c/(e-a),this._weightNext=c/(l-i),this._offsetPrev=r*u,this._offsetNext=o*u}interpolate_(t,e,i,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=t*a,c=l-a,u=this._offsetPrev,d=this._offsetNext,h=this._weightPrev,f=this._weightNext,m=(i-e)/(s-e),x=m*m,g=x*m,p=-h*g+2*h*x-h*m,S=(1+h)*g+(-1.5-2*h)*x+(-.5+h)*m+1,A=(-1-f)*g+(1.5+f)*x+.5*m,M=f*g-f*x;for(let T=0;T!==a;++T)r[T]=p*o[u+T]+S*o[c+T]+A*o[l+T]+M*o[d+T];return r}},Za=class extends es{constructor(t,e,i,s){super(t,e,i,s)}interpolate_(t,e,i,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=t*a,c=l-a,u=(i-e)/(s-e),d=1-u;for(let h=0;h!==a;++h)r[h]=o[c+h]*d+o[l+h]*u;return r}},Ja=class extends es{constructor(t,e,i,s){super(t,e,i,s)}interpolate_(t){return this.copySampleValue_(t-1)}},$a=class extends es{interpolate_(t,e,i,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=t*a,c=l-a,u=this.inTangents,d=this.outTangents;if(!u||!d){let m=(i-e)/(s-e),x=1-m;for(let g=0;g!==a;++g)r[g]=o[c+g]*x+o[l+g]*m;return r}let h=a*2,f=t-1;for(let m=0;m!==a;++m){let x=o[c+m],g=o[l+m],p=f*h+m*2,S=d[p],A=d[p+1],M=t*h+m*2,T=u[M],b=u[M+1],C=Lm(i,e,S,T,s);r[m]=bf(C,x,A,b,g)}return r}};function bf(n,t,e,i,s){let r=1-n;return r*r*r*t+3*r*r*n*e+3*r*n*n*i+n*n*n*s}function Im(n,t,e,i,s){let r=1-n;return 3*r*r*(e-t)+6*r*n*(i-e)+3*n*n*(s-i)}function Lm(n,t,e,i,s){let r=(n-t)/(s-t);for(let o=0;o<8;o++){let a=bf(r,t,e,i,s)-n;if(Math.abs(a)<1e-10)break;let l=Im(r,t,e,i,s);if(Math.abs(l)<1e-10)break;r=Math.max(0,Math.min(1,r-a/l))}return r}var Un=class{constructor(t,e,i,s){if(t===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(e===void 0||e.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+t);this.name=t,this.times=Qs(e,this.TimeBufferType),this.values=Qs(i,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(t){let e=t.constructor,i;if(e.toJSON!==this.toJSON)i=e.toJSON(t);else{i={name:t.name,times:Qs(t.times,Array),values:Qs(t.values,Array)};let s=t.getInterpolation();s!==t.DefaultInterpolation&&(i.interpolation=s),th(t.settings)&&(i.settings={inTangents:Qs(t.settings.inTangents,Array),outTangents:Qs(t.settings.outTangents,Array)})}return i.type=t.ValueTypeName,i}InterpolantFactoryMethodDiscrete(t){return new Ja(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodLinear(t){return new Za(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodSmooth(t){return new Ya(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodBezier(t){let e=new $a(this.times,this.values,this.getValueSize(),t);return this.settings&&(e.inTangents=this.settings.inTangents,e.outTangents=this.settings.outTangents),e}setInterpolation(t){let e;switch(t){case Zr:e=this.InterpolantFactoryMethodDiscrete;break;case Ua:e=this.InterpolantFactoryMethodLinear;break;case Ta:e=this.InterpolantFactoryMethodSmooth;break;case ih:e=this.InterpolantFactoryMethodBezier;break}if(e===void 0){let i="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(t!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(i);return Ht("KeyframeTrack:",i),this}return this.createInterpolant=e,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Zr;case this.InterpolantFactoryMethodLinear:return Ua;case this.InterpolantFactoryMethodSmooth:return Ta;case this.InterpolantFactoryMethodBezier:return ih}}getValueSize(){return this.values.length/this.times.length}shift(t){if(t!==0){let e=this.times;for(let i=0,s=e.length;i!==s;++i)e[i]+=t}return this}scale(t){if(t!==1){let e=this.times;for(let i=0,s=e.length;i!==s;++i)e[i]*=t;th(this.settings)&&(Pd(this.settings.inTangents,t),Pd(this.settings.outTangents,t))}return this}trim(t,e){let i=this.times,s=i.length,r=0,o=s-1;for(;r!==s&&i[r]<t;)++r;for(;o!==-1&&i[o]>e;)--o;if(++o,r!==0||o!==s){r>=o&&(o=Math.max(o,1),r=o-1);let a=this.getValueSize();this.times=i.slice(r,o),this.values=this.values.slice(r*a,o*a)}return this}validate(){let t=!0,e=this.getValueSize();e-Math.floor(e)!==0&&(Zt("KeyframeTrack: Invalid value size in track.",this),t=!1);let i=this.times,s=this.values,r=i.length;r===0&&(Zt("KeyframeTrack: Track is empty.",this),t=!1);let o=null;for(let a=0;a!==r;a++){let l=i[a];if(typeof l=="number"&&isNaN(l)){Zt("KeyframeTrack: Time is not a valid number.",this,a,l),t=!1;break}if(o!==null&&o>l){Zt("KeyframeTrack: Out of order keys.",this,a,l,o),t=!1;break}o=l}if(s!==void 0&&Yp(s))for(let a=0,l=s.length;a!==l;++a){let c=s[a];if(isNaN(c)){Zt("KeyframeTrack: Value is not a valid number.",this,a,c),t=!1;break}}return t}optimize(){let t=this.times.slice(),e=this.values.slice(),i=this.getValueSize(),s=this.getInterpolation()===Ta,r=t.length-1,o=1;for(let a=1;a<r;++a){let l=!1,c=t[a],u=t[a+1];if(c!==u&&(a!==1||c!==t[0]))if(s)l=!0;else{let d=a*i,h=d-i,f=d+i;for(let m=0;m!==i;++m){let x=e[d+m];if(x!==e[h+m]||x!==e[f+m]){l=!0;break}}}if(l){if(a!==o){t[o]=t[a];let d=a*i,h=o*i;for(let f=0;f!==i;++f)e[h+f]=e[d+f]}++o}}if(r>0){t[o]=t[r];for(let a=r*i,l=o*i,c=0;c!==i;++c)e[l+c]=e[a+c];++o}return o!==t.length?(this.times=t.slice(0,o),this.values=e.slice(0,o*i)):(this.times=t,this.values=e),this}clone(){let t=this.times.slice(),e=this.values.slice(),i=this.constructor,s=new i(this.name,t,e);return s.createInterpolant=this.createInterpolant,th(this.settings)&&(s.settings={inTangents:this.settings.inTangents.slice(),outTangents:this.settings.outTangents.slice()}),s}};function Pd(n,t){for(let e=0,i=n.length;e!==i;e+=2)n[e]*=t}Un.prototype.ValueTypeName="";Un.prototype.TimeBufferType=Float32Array;Un.prototype.ValueBufferType=Float32Array;Un.prototype.DefaultInterpolation=Ua;var ns=class extends Un{constructor(t,e,i){super(t,e,i)}};ns.prototype.ValueTypeName="bool";ns.prototype.ValueBufferType=Array;ns.prototype.DefaultInterpolation=Zr;ns.prototype.InterpolantFactoryMethodLinear=void 0;ns.prototype.InterpolantFactoryMethodSmooth=void 0;var Ka=class extends Un{constructor(t,e,i,s){super(t,e,i,s)}};Ka.prototype.ValueTypeName="color";var ja=class extends Un{constructor(t,e,i,s){super(t,e,i,s)}};ja.prototype.ValueTypeName="number";var Qa=class extends es{constructor(t,e,i,s){super(t,e,i,s)}interpolate_(t,e,i,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=(i-e)/(s-e),c=t*a;for(let u=c+a;c!==u;c+=4)Dn.slerpFlat(r,0,o,c-a,o,c,l);return r}},lo=class extends Un{constructor(t,e,i,s){super(t,e,i,s)}InterpolantFactoryMethodLinear(t){return new Qa(this.times,this.values,this.getValueSize(),t)}};lo.prototype.ValueTypeName="quaternion";lo.prototype.InterpolantFactoryMethodSmooth=void 0;var is=class extends Un{constructor(t,e,i){super(t,e,i)}};is.prototype.ValueTypeName="string";is.prototype.ValueBufferType=Array;is.prototype.DefaultInterpolation=Zr;is.prototype.InterpolantFactoryMethodLinear=void 0;is.prototype.InterpolantFactoryMethodSmooth=void 0;var tl=class extends Un{constructor(t,e,i,s){super(t,e,i,s)}};tl.prototype.ValueTypeName="vector";var el=class{constructor(t,e,i){let s=this,r=!1,o=0,a=0,l,c=[];this.onStart=void 0,this.onLoad=t,this.onProgress=e,this.onError=i,this._abortController=null,this.itemStart=function(u){a++,r===!1&&s.onStart!==void 0&&s.onStart(u,o,a),r=!0},this.itemEnd=function(u){o++,s.onProgress!==void 0&&s.onProgress(u,o,a),o===a&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(u){s.onError!==void 0&&s.onError(u)},this.resolveURL=function(u){return u=u.normalize("NFC"),l?l(u):u},this.setURLModifier=function(u){return l=u,this},this.addHandler=function(u,d){return c.push(u,d),this},this.removeHandler=function(u){let d=c.indexOf(u);return d!==-1&&c.splice(d,2),this},this.getHandler=function(u){for(let d=0,h=c.length;d<h;d+=2){let f=c[d],m=c[d+1];if(f.global&&(f.lastIndex=0),f.test(u))return m}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||(this._abortController=new AbortController),this._abortController}},Tf=new el,nl=class{constructor(t){this.manager=t!==void 0?t:Tf,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}load(){}loadAsync(t,e){let i=this;return new Promise(function(s,r){i.load(t,s,e,r)})}parse(){}setCrossOrigin(t){return this.crossOrigin=t,this}setWithCredentials(t){return this.withCredentials=t,this}setPath(t){return this.path=t,this}setResourcePath(t){return this.resourcePath=t,this}setRequestHeader(t){return this.requestHeader=t,this}abort(){return this}};nl.DEFAULT_MATERIAL_NAME="__DEFAULT";var co=class extends Ke{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new oe(t),this.intensity=e}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){let e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,e}},ho=class extends co{constructor(t,e,i){super(t,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Ke.DEFAULT_UP),this.updateMatrix(),this.groundColor=new oe(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}toJSON(t){let e=super.toJSON(t);return e.object.groundColor=this.groundColor.getHex(),e}},eh=new De,Id=new L,Ld=new L,il=class{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Yt(512,512),this.mapType=bn,this.map=null,this.mapPass=null,this.matrix=new De,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new dr,this._frameExtents=new Yt(1,1),this._viewportCount=1,this._viewports=[new Ne(0,0,1,1)]}getViewportCount(){return this._viewportCount}getCamera(){return this.camera}getFrustum(){return this._frustum}updateMatrices(t){let e=this.camera;Id.setFromMatrixPosition(t.matrixWorld),e.position.copy(Id),Ld.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(Ld),e.updateMatrixWorld(),this._updateMatrix(e,this.matrix,this._frustum)}_updateMatrix(t,e,i,s){eh.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),i.setFromProjectionMatrix(eh,t.coordinateSystem,t.reversedDepth);let r=this._frameExtents,o=s?s.z/r.x:1,a=s?s.w/r.y:1,l=s?s.x/r.x:0,c=s?s.y/r.y:0;t.coordinateSystem===or||t.reversedDepth?e.set(.5*o,0,0,.5*o+l,0,.5*a,0,.5*a+c,0,0,1,0,0,0,0,1):e.set(.5*o,0,0,.5*o+l,0,.5*a,0,.5*a+c,0,0,.5,.5,0,0,0,1),e.multiply(eh)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.autoUpdate=t.autoUpdate,this.needsUpdate=t.needsUpdate,this.normalBias=t.normalBias,this.blurSamples=t.blurSamples,this.mapSize.copy(t.mapSize),this.biasNode=t.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){let t={};return t.intensity=this.intensity,t.bias=this.bias,t.normalBias=this.normalBias,t.radius=this.radius,t.blurSamples=this.blurSamples,t.mapSize=this.mapSize.toArray(),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}},Ma=new L,Sa=new Dn,pi=new L,uo=class extends Ke{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new De,this.projectionMatrix=new De,this.projectionMatrixInverse=new De,this.coordinateSystem=jn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorld.decompose(Ma,Sa,pi),pi.x===1&&pi.y===1&&pi.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Ma,Sa,pi.set(1,1,1)).invert()}updateWorldMatrix(t,e,i=!1){super.updateWorldMatrix(t,e,i),this.matrixWorld.decompose(Ma,Sa,pi),pi.x===1&&pi.y===1&&pi.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Ma,Sa,pi.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}},Ki=new L,Dd=new Yt,Nd=new Yt,nn=class extends uo{constructor(t=50,e=1,i=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=i,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){let e=.5*this.getFilmHeight()/t;this.fov=lr*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){let t=Math.tan(ir*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return lr*2*Math.atan(Math.tan(ir*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,i){Ki.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(Ki.x,Ki.y).multiplyScalar(-t/Ki.z),Ki.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(Ki.x,Ki.y).multiplyScalar(-t/Ki.z)}getViewSize(t,e){return this.getViewBounds(t,Dd,Nd),e.subVectors(Nd,Dd)}setViewOffset(t,e,i,s,r,o){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=this.near,e=t*Math.tan(ir*.5*this.fov)/this.zoom,i=2*e,s=this.aspect*i,r=-.5*s,o=this.view;if(this.view!==null&&this.view.enabled){let l=o.fullWidth,c=o.fullHeight;r+=o.offsetX*s/l,e-=o.offsetY*i/c,s*=o.width/l,i*=o.height/c}let a=this.filmOffset;a!==0&&(r+=t*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,e,e-i,t,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}};var gr=class extends uo{constructor(t=-1,e=1,i=1,s=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=i,this.bottom=s,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,i,s,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,s=(this.top+this.bottom)/2,r=i-t,o=i+t,a=s+e,l=s-e;if(this.view!==null&&this.view.enabled){let c=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,o=r+c*this.view.width,a-=u*this.view.offsetY,l=a-u*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}},ah=class extends il{constructor(){super(new gr(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},_r=class extends co{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Ke.DEFAULT_UP),this.updateMatrix(),this.target=new Ke,this.shadow=new ah}dispose(){super.dispose(),this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}toJSON(t){let e=super.toJSON(t);return e.object.shadow=this.shadow.toJSON(),e.object.target=this.target.uuid,e}};var tr=-90,er=1,sl=class extends Ke{constructor(t,e,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;let s=new nn(tr,er,t,e);s.layers=this.layers,this.add(s);let r=new nn(tr,er,t,e);r.layers=this.layers,this.add(r);let o=new nn(tr,er,t,e);o.layers=this.layers,this.add(o);let a=new nn(tr,er,t,e);a.layers=this.layers,this.add(a);let l=new nn(tr,er,t,e);l.layers=this.layers,this.add(l);let c=new nn(tr,er,t,e);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let t=this.coordinateSystem,e=this.children.concat(),[i,s,r,o,a,l]=e;for(let c of e)this.remove(c);if(t===jn)i.up.set(0,1,0),i.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===or)i.up.set(0,-1,0),i.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(let c of e)this.add(c),c.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();let{renderTarget:i,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());let[r,o,a,l,c,u]=this.children,d=t.getRenderTarget(),h=t.getActiveCubeFace(),f=t.getActiveMipmapLevel(),m=t.xr.enabled;t.xr.enabled=!1;let x=i.texture.generateMipmaps;i.texture.generateMipmaps=!1;let g=!1;t.isWebGLRenderer===!0?g=t.state.buffers.depth.getReversed():g=t.reversedDepthBuffer,t.setRenderTarget(i,0,s),g&&t.autoClear===!1&&t.clearDepth(),t.render(e,r),t.setRenderTarget(i,1,s),g&&t.autoClear===!1&&t.clearDepth(),t.render(e,o),t.setRenderTarget(i,2,s),g&&t.autoClear===!1&&t.clearDepth(),t.render(e,a),t.setRenderTarget(i,3,s),g&&t.autoClear===!1&&t.clearDepth(),t.render(e,l),t.setRenderTarget(i,4,s),g&&t.autoClear===!1&&t.clearDepth(),t.render(e,c),i.texture.generateMipmaps=x,t.setRenderTarget(i,5,s),g&&t.autoClear===!1&&t.clearDepth(),t.render(e,u),t.setRenderTarget(d,h,f),t.xr.enabled=m,i.texture.needsPMREMUpdate=!0}},rl=class extends nn{constructor(t=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=t}};var Fh="\\[\\]\\.:\\/",Dm=new RegExp("["+Fh+"]","g"),Oh="[^"+Fh+"]",Nm="[^"+Fh.replace("\\.","")+"]",Um=/((?:WC+[\/:])*)/.source.replace("WC",Oh),Fm=/(WCOD+)?/.source.replace("WCOD",Nm),Om=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",Oh),Bm=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",Oh),km=new RegExp("^"+Um+Fm+Om+Bm+"$"),zm=["material","materials","bones","map"],lh=class{constructor(t,e,i){let s=i||Le.parseTrackName(e);this._targetGroup=t,this._bindings=t.subscribe_(e,s)}getValue(t,e){this.bind();let i=this._targetGroup.nCachedObjects_,s=this._bindings[i];s!==void 0&&s.getValue(t,e)}setValue(t,e){let i=this._bindings;for(let s=this._targetGroup.nCachedObjects_,r=i.length;s!==r;++s)i[s].setValue(t,e)}bind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,i=t.length;e!==i;++e)t[e].bind()}unbind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,i=t.length;e!==i;++e)t[e].unbind()}},Le=class n{constructor(t,e,i){this.path=e,this.parsedPath=i||n.parseTrackName(e),this.node=n.findNode(t,this.parsedPath.nodeName),this.rootNode=t,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(t,e,i){return t&&t.isAnimationObjectGroup?new n.Composite(t,e,i):new n(t,e,i)}static sanitizeNodeName(t){return t.replace(/\s/g,"_").replace(Dm,"")}static parseTrackName(t){let e=km.exec(t);if(e===null)throw new Error("THREE.PropertyBinding: Cannot parse trackName: "+t);let i={nodeName:e[2],objectName:e[3],objectIndex:e[4],propertyName:e[5],propertyIndex:e[6]},s=i.nodeName&&i.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){let r=i.nodeName.substring(s+1);zm.indexOf(r)!==-1&&(i.nodeName=i.nodeName.substring(0,s),i.objectName=r)}if(i.propertyName===null||i.propertyName.length===0)throw new Error("THREE.PropertyBinding: can not parse propertyName from trackName: "+t);return i}static findNode(t,e){if(e===void 0||e===""||e==="."||e===-1||e===t.name||e===t.uuid)return t;if(t.skeleton){let i=t.skeleton.getBoneByName(e);if(i!==void 0)return i}if(t.children){let i=function(r){for(let o=0;o<r.length;o++){let a=r[o];if(a.name===e||a.uuid===e)return a;let l=i(a.children);if(l)return l}return null},s=i(t.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(t,e){t[e]=this.targetObject[this.propertyName]}_getValue_array(t,e){let i=this.resolvedProperty;for(let s=0,r=i.length;s!==r;++s)t[e++]=i[s]}_getValue_arrayElement(t,e){t[e]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(t,e){this.resolvedProperty.toArray(t,e)}_setValue_direct(t,e){this.targetObject[this.propertyName]=t[e]}_setValue_direct_setNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(t,e){let i=this.resolvedProperty;for(let s=0,r=i.length;s!==r;++s)i[s]=t[e++]}_setValue_array_setNeedsUpdate(t,e){let i=this.resolvedProperty;for(let s=0,r=i.length;s!==r;++s)i[s]=t[e++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(t,e){let i=this.resolvedProperty;for(let s=0,r=i.length;s!==r;++s)i[s]=t[e++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(t,e){this.resolvedProperty[this.propertyIndex]=t[e]}_setValue_arrayElement_setNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(t,e){this.resolvedProperty.fromArray(t,e)}_setValue_fromArray_setNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(t,e){this.bind(),this.getValue(t,e)}_setValue_unbound(t,e){this.bind(),this.setValue(t,e)}bind(){let t=this.node,e=this.parsedPath,i=e.objectName,s=e.propertyName,r=e.propertyIndex;if(t||(t=n.findNode(this.rootNode,e.nodeName),this.node=t),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!t){Ht("PropertyBinding: No target node found for track: "+this.path+".");return}if(i){let c=e.objectIndex;switch(i){case"materials":if(!t.material){Zt("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.materials){Zt("PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}t=t.material.materials;break;case"bones":if(!t.skeleton){Zt("PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}t=t.skeleton.bones;for(let u=0;u<t.length;u++)if(t[u].name===c){c=u;break}break;case"map":if("map"in t){t=t.map;break}if(!t.material){Zt("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.map){Zt("PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}t=t.material.map;break;default:if(t[i]===void 0){Zt("PropertyBinding: Can not bind to objectName of node undefined.",this);return}t=t[i]}if(c!==void 0){if(t[c]===void 0){Zt("PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,t);return}t=t[c]}}let o=t[s];if(o===void 0){let c=e.nodeName;Zt("PropertyBinding: Trying to update property for track: "+c+"."+s+" but it wasn't found.",t);return}let a=this.Versioning.None;this.targetObject=t,t.isMaterial===!0?a=this.Versioning.NeedsUpdate:t.isObject3D===!0&&(a=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(r!==void 0){if(s==="morphTargetInfluences"){if(!t.geometry){Zt("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!t.geometry.morphAttributes){Zt("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}t.morphTargetDictionary[r]!==void 0&&(r=t.morphTargetDictionary[r])}l=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=r}else o.fromArray!==void 0&&o.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(l=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=s;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][a]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};Le.Composite=lh;Le.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};Le.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};Le.prototype.GetterByBindingType=[Le.prototype._getValue_direct,Le.prototype._getValue_array,Le.prototype._getValue_arrayElement,Le.prototype._getValue_toArray];Le.prototype.SetterByBindingTypeAndVersioning=[[Le.prototype._setValue_direct,Le.prototype._setValue_direct_setNeedsUpdate,Le.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[Le.prototype._setValue_array,Le.prototype._setValue_array_setNeedsUpdate,Le.prototype._setValue_array_setMatrixWorldNeedsUpdate],[Le.prototype._setValue_arrayElement,Le.prototype._setValue_arrayElement_setNeedsUpdate,Le.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[Le.prototype._setValue_fromArray,Le.prototype._setValue_fromArray_setNeedsUpdate,Le.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var GS=new Float32Array(1);var xr=class{constructor(t=1,e=0,i=0){this.radius=t,this.phi=e,this.theta=i}set(t,e,i){return this.radius=t,this.phi=e,this.theta=i,this}copy(t){return this.radius=t.radius,this.phi=t.phi,this.theta=t.theta,this}makeSafe(){return this.phi=fe(this.phi,1e-6,Math.PI-1e-6),this}setFromVector3(t){return this.setFromCartesianCoords(t.x,t.y,t.z)}setFromCartesianCoords(t,e,i){return this.radius=Math.sqrt(t*t+e*e+i*i),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(t,i),this.phi=Math.acos(fe(e/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}};var Gh=class Gh{constructor(t,e,i,s){this.elements=[1,0,0,1],t!==void 0&&this.set(t,e,i,s)}identity(){return this.set(1,0,0,1),this}fromArray(t,e=0){for(let i=0;i<4;i++)this.elements[i]=t[i+e];return this}set(t,e,i,s){let r=this.elements;return r[0]=t,r[2]=e,r[1]=i,r[3]=s,this}};Gh.prototype.isMatrix2=!0;var ch=Gh;var Ud=new L,ba,nh,ss=class extends Ke{constructor(t=new L(0,0,1),e=new L(0,0,0),i=1,s=16776960,r=i*.2,o=r*.2){super(),this.type="ArrowHelper",ba===void 0&&(ba=new Ge,ba.setAttribute("position",new Pe([0,0,0,0,1,0],3)),nh=new ts(.5,1,5,1),nh.translate(0,-.5,0)),this.position.copy(e),this.line=new As(ba,new Sn({color:s,toneMapped:!1})),this.line.matrixAutoUpdate=!1,this.add(this.line),this.cone=new un(nh,new ur({color:s,toneMapped:!1})),this.cone.matrixAutoUpdate=!1,this.add(this.cone),this.setDirection(t),this.setLength(i,r,o)}setDirection(t){if(t.y>.99999)this.quaternion.set(0,0,0,1);else if(t.y<-.99999)this.quaternion.set(1,0,0,0);else{Ud.set(t.z,0,-t.x).normalize();let e=Math.acos(t.y);this.quaternion.setFromAxisAngle(Ud,e)}}setLength(t,e=t*.2,i=e*.2){this.line.scale.set(1,Math.max(1e-4,t-e),1),this.line.updateMatrix(),this.cone.scale.set(i,e,i),this.cone.position.y=t,this.cone.updateMatrix()}setColor(t){this.line.material.color.set(t),this.cone.material.color.set(t)}copy(t){return super.copy(t,!1),this.line.copy(t.line),this.cone.copy(t.cone),this}dispose(){super.dispose(),this.line.geometry.dispose(),this.line.material.dispose(),this.cone.geometry.dispose(),this.cone.material.dispose()}};var fo=class extends Qn{constructor(t,e=null){super(),this.object=t,this.domElement=e,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(t){this.domElement!==null&&this.disconnect(),this.domElement=t}disconnect(){}dispose(){}update(){}};function Bh(n,t,e,i){let s=Vm(i);switch(e){case Ch:return n*t;case Ph:return n*t/s.components*s.byteLength;case fl:return n*t/s.components*s.byteLength;case us:return n*t*2/s.components*s.byteLength;case pl:return n*t*2/s.components*s.byteLength;case Rh:return n*t*3/s.components*s.byteLength;case Xn:return n*t*4/s.components*s.byteLength;case ml:return n*t*4/s.components*s.byteLength;case xo:case yo:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*8;case vo:case Mo:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case _l:case yl:return Math.max(n,16)*Math.max(t,8)/4;case gl:case xl:return Math.max(n,8)*Math.max(t,8)/2;case vl:case Ml:case bl:case Tl:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*8;case Sl:case So:case El:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case wl:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case Al:return Math.floor((n+4)/5)*Math.floor((t+3)/4)*16;case Cl:return Math.floor((n+4)/5)*Math.floor((t+4)/5)*16;case Rl:return Math.floor((n+5)/6)*Math.floor((t+4)/5)*16;case Pl:return Math.floor((n+5)/6)*Math.floor((t+5)/6)*16;case Il:return Math.floor((n+7)/8)*Math.floor((t+4)/5)*16;case Ll:return Math.floor((n+7)/8)*Math.floor((t+5)/6)*16;case Dl:return Math.floor((n+7)/8)*Math.floor((t+7)/8)*16;case Nl:return Math.floor((n+9)/10)*Math.floor((t+4)/5)*16;case Ul:return Math.floor((n+9)/10)*Math.floor((t+5)/6)*16;case Fl:return Math.floor((n+9)/10)*Math.floor((t+7)/8)*16;case Ol:return Math.floor((n+9)/10)*Math.floor((t+9)/10)*16;case Bl:return Math.floor((n+11)/12)*Math.floor((t+9)/10)*16;case kl:return Math.floor((n+11)/12)*Math.floor((t+11)/12)*16;case zl:case Vl:case Hl:return Math.ceil(n/4)*Math.ceil(t/4)*16;case Gl:case Wl:return Math.ceil(n/4)*Math.ceil(t/4)*8;case bo:case Xl:return Math.ceil(n/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function Vm(n){switch(n){case bn:case Th:return{byteLength:1,components:1};case Mr:case Eh:case ii:return{byteLength:2,components:1};case ul:case dl:return{byteLength:2,components:4};case ei:case hl:case ni:return{byteLength:4,components:1};case wh:case Ah:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${n}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"186"}}));typeof window<"u"&&(window.__THREE__?Ht("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="186");function qf(){let n=null,t=!1,e=null,i=null;function s(r,o){i=n.requestAnimationFrame(s),e(r,o)}return{start:function(){t!==!0&&e!==null&&n!==null&&(i=n.requestAnimationFrame(s),t=!0)},stop:function(){n!==null&&n.cancelAnimationFrame(i),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){n=r}}}function Gm(n){let t=new WeakMap;function e(a,l){let c=a.array,u=a.usage,d=c.byteLength,h=n.createBuffer();n.bindBuffer(l,h),n.bufferData(l,c,u),a.onUploadCallback();let f;if(c instanceof Float32Array)f=n.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)f=n.HALF_FLOAT;else if(c instanceof Uint16Array)a.isFloat16BufferAttribute?f=n.HALF_FLOAT:f=n.UNSIGNED_SHORT;else if(c instanceof Int16Array)f=n.SHORT;else if(c instanceof Uint32Array)f=n.UNSIGNED_INT;else if(c instanceof Int32Array)f=n.INT;else if(c instanceof Int8Array)f=n.BYTE;else if(c instanceof Uint8Array)f=n.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)f=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:h,type:f,bytesPerElement:c.BYTES_PER_ELEMENT,version:a.version,size:d}}function i(a,l,c){let u=l.array,d=l.updateRanges;if(n.bindBuffer(c,a),d.length===0)n.bufferSubData(c,0,u);else{d.sort((f,m)=>f.start-m.start);let h=0;for(let f=1;f<d.length;f++){let m=d[h],x=d[f];x.start<=m.start+m.count+1?m.count=Math.max(m.count,x.start+x.count-m.start):(++h,d[h]=x)}d.length=h+1;for(let f=0,m=d.length;f<m;f++){let x=d[f];n.bufferSubData(c,x.start*u.BYTES_PER_ELEMENT,u,x.start,x.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(a){return a.isInterleavedBufferAttribute&&(a=a.data),t.get(a)}function r(a){a.isInterleavedBufferAttribute&&(a=a.data);let l=t.get(a);l&&(n.deleteBuffer(l.buffer),t.delete(a))}function o(a,l){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){let u=t.get(a);(!u||u.version<a.version)&&t.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}let c=t.get(a);if(c===void 0)t.set(a,e(a,l));else if(c.version<a.version){if(c.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(c.buffer,a,l),c.version=a.version}}return{get:s,remove:r,update:o}}var Wm=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Xm=`#ifdef USE_ALPHAHASH
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
#endif`,qm=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Ym=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Zm=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Jm=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,$m=`#ifdef USE_AOMAP
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
#endif`,Km=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,jm=`#ifdef USE_BATCHING
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
#endif`,Qm=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,tg=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,eg=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,ng=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,ig=`#ifdef USE_IRIDESCENCE
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
#endif`,sg=`#ifdef USE_BUMPMAP
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
#endif`,rg=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,og=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,ag=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,lg=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,cg=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,hg=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,ug=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,dg=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
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
#endif`,fg=`#define PI 3.141592653589793
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
} // validated`,pg=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,mg=`vec3 transformedNormal = objectNormal;
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
#endif`,gg=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,_g=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,xg=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,yg=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,vg="gl_FragColor = linearToOutputTexel( gl_FragColor );",Mg=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Sg=`#ifdef USE_ENVMAP
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
#endif`,bg=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,Tg=`#ifdef USE_ENVMAP
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
#endif`,Eg=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS

		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,wg=`#ifdef USE_ENVMAP
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
#endif`,Ag=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Cg=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Rg=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Pg=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Ig=`#ifdef USE_GRADIENTMAP
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
}`,Lg=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Dg=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Ng=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Ug=`uniform bool receiveShadow;
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
#include <lightprobes_pars_fragment>`,Fg=`#ifdef USE_ENVMAP
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
#endif`,Og=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Bg=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,kg=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,zg=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Vg=`PhysicalMaterial material;
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
#endif`,Hg=`uniform sampler2D dfgLUT;
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
}`,Gg=`
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
#endif`,Wg=`#if defined( RE_IndirectDiffuse )
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
#endif`,Xg=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,qg=`#ifdef USE_LIGHT_PROBES_GRID
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
#endif`,Yg=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Zg=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Jg=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,$g=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Kg=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,jg=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Qg=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,t0=`#if defined( USE_POINTS_UV )
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
#endif`,e0=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,n0=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,i0=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,s0=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,r0=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,o0=`#ifdef USE_MORPHTARGETS
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
#endif`,a0=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,l0=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,c0=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,h0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,u0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,d0=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,f0=`#ifdef USE_NORMALMAP
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
#endif`,p0=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,m0=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,g0=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,_0=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,x0=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,y0=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,v0=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,M0=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,S0=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,b0=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,T0=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,E0=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,w0=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,A0=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,C0=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,R0=`float getShadowMask() {
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
}`,P0=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,I0=`#ifdef USE_SKINNING
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
#endif`,L0=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,D0=`#ifdef USE_SKINNING
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
#endif`,N0=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,U0=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,F0=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,O0=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,B0=`#ifdef USE_TRANSMISSION
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
#endif`,k0=`#ifdef USE_TRANSMISSION
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
#endif`,z0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,V0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,H0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,G0=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,W0=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,X0=`uniform sampler2D t2D;
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
}`,q0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Y0=`#ifdef ENVMAP_TYPE_CUBE
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
}`,Z0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,J0=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,$0=`#include <common>
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
}`,K0=`#if DEPTH_PACKING == 3200
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
}`,j0=`#define DISTANCE
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
}`,Q0=`#define DISTANCE
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
}`,t_=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,e_=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,n_=`uniform float scale;
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
}`,i_=`uniform vec3 diffuse;
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
}`,s_=`#include <common>
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
}`,r_=`uniform vec3 diffuse;
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
}`,o_=`#define LAMBERT
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
}`,a_=`#define LAMBERT
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
}`,l_=`#define MATCAP
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
}`,c_=`#define MATCAP
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
}`,h_=`#define NORMAL
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
}`,u_=`#define NORMAL
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
}`,d_=`#define PHONG
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
}`,f_=`#define PHONG
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
}`,p_=`#define STANDARD
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
}`,m_=`#define STANDARD
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
}`,g_=`#define TOON
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
}`,__=`#define TOON
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
}`,x_=`uniform float size;
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
}`,y_=`uniform vec3 diffuse;
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
}`,v_=`#include <common>
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
}`,M_=`uniform vec3 color;
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
}`,S_=`uniform float rotation;
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
}`,b_=`uniform vec3 diffuse;
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
}`,he={alphahash_fragment:Wm,alphahash_pars_fragment:Xm,alphamap_fragment:qm,alphamap_pars_fragment:Ym,alphatest_fragment:Zm,alphatest_pars_fragment:Jm,aomap_fragment:$m,aomap_pars_fragment:Km,batching_pars_vertex:jm,batching_vertex:Qm,begin_vertex:tg,beginnormal_vertex:eg,bsdfs:ng,iridescence_fragment:ig,bumpmap_pars_fragment:sg,clipping_planes_fragment:rg,clipping_planes_pars_fragment:og,clipping_planes_pars_vertex:ag,clipping_planes_vertex:lg,color_fragment:cg,color_pars_fragment:hg,color_pars_vertex:ug,color_vertex:dg,common:fg,cube_uv_reflection_fragment:pg,defaultnormal_vertex:mg,displacementmap_pars_vertex:gg,displacementmap_vertex:_g,emissivemap_fragment:xg,emissivemap_pars_fragment:yg,colorspace_fragment:vg,colorspace_pars_fragment:Mg,envmap_fragment:Sg,envmap_common_pars_fragment:bg,envmap_pars_fragment:Tg,envmap_pars_vertex:Eg,envmap_physical_pars_fragment:Fg,envmap_vertex:wg,fog_vertex:Ag,fog_pars_vertex:Cg,fog_fragment:Rg,fog_pars_fragment:Pg,gradientmap_pars_fragment:Ig,lightmap_pars_fragment:Lg,lights_lambert_fragment:Dg,lights_lambert_pars_fragment:Ng,lights_pars_begin:Ug,lights_toon_fragment:Og,lights_toon_pars_fragment:Bg,lights_phong_fragment:kg,lights_phong_pars_fragment:zg,lights_physical_fragment:Vg,lights_physical_pars_fragment:Hg,lights_fragment_begin:Gg,lights_fragment_maps:Wg,lights_fragment_end:Xg,lightprobes_pars_fragment:qg,logdepthbuf_fragment:Yg,logdepthbuf_pars_fragment:Zg,logdepthbuf_pars_vertex:Jg,logdepthbuf_vertex:$g,map_fragment:Kg,map_pars_fragment:jg,map_particle_fragment:Qg,map_particle_pars_fragment:t0,metalnessmap_fragment:e0,metalnessmap_pars_fragment:n0,morphinstance_vertex:i0,morphcolor_vertex:s0,morphnormal_vertex:r0,morphtarget_pars_vertex:o0,morphtarget_vertex:a0,normal_fragment_begin:l0,normal_fragment_maps:c0,normal_pars_fragment:h0,normal_pars_vertex:u0,normal_vertex:d0,normalmap_pars_fragment:f0,clearcoat_normal_fragment_begin:p0,clearcoat_normal_fragment_maps:m0,clearcoat_pars_fragment:g0,iridescence_pars_fragment:_0,opaque_fragment:x0,packing:y0,premultiplied_alpha_fragment:v0,project_vertex:M0,dithering_fragment:S0,dithering_pars_fragment:b0,roughnessmap_fragment:T0,roughnessmap_pars_fragment:E0,shadowmap_pars_fragment:w0,shadowmap_pars_vertex:A0,shadowmap_vertex:C0,shadowmask_pars_fragment:R0,skinbase_vertex:P0,skinning_pars_vertex:I0,skinning_vertex:L0,skinnormal_vertex:D0,specularmap_fragment:N0,specularmap_pars_fragment:U0,tonemapping_fragment:F0,tonemapping_pars_fragment:O0,transmission_fragment:B0,transmission_pars_fragment:k0,uv_pars_fragment:z0,uv_pars_vertex:V0,uv_vertex:H0,worldpos_vertex:G0,background_vert:W0,background_frag:X0,backgroundCube_vert:q0,backgroundCube_frag:Y0,cube_vert:Z0,cube_frag:J0,depth_vert:$0,depth_frag:K0,distance_vert:j0,distance_frag:Q0,equirect_vert:t_,equirect_frag:e_,linedashed_vert:n_,linedashed_frag:i_,meshbasic_vert:s_,meshbasic_frag:r_,meshlambert_vert:o_,meshlambert_frag:a_,meshmatcap_vert:l_,meshmatcap_frag:c_,meshnormal_vert:h_,meshnormal_frag:u_,meshphong_vert:d_,meshphong_frag:f_,meshphysical_vert:p_,meshphysical_frag:m_,meshtoon_vert:g_,meshtoon_frag:__,points_vert:x_,points_frag:y_,shadow_vert:v_,shadow_frag:M_,sprite_vert:S_,sprite_frag:b_},pt={common:{diffuse:{value:new oe(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new jt},alphaMap:{value:null},alphaMapTransform:{value:new jt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new jt}},envmap:{envMap:{value:null},envMapRotation:{value:new jt},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new jt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new jt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new jt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new jt},normalScale:{value:new Yt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new jt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new jt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new jt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new jt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new oe(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new L},probesMax:{value:new L},probesResolution:{value:new L}},points:{diffuse:{value:new oe(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new jt},alphaTest:{value:0},uvTransform:{value:new jt}},sprite:{diffuse:{value:new oe(16777215)},opacity:{value:1},center:{value:new Yt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new jt},alphaMap:{value:null},alphaMapTransform:{value:new jt},alphaTest:{value:0}}},vi={basic:{uniforms:sn([pt.common,pt.specularmap,pt.envmap,pt.aomap,pt.lightmap,pt.fog]),vertexShader:he.meshbasic_vert,fragmentShader:he.meshbasic_frag},lambert:{uniforms:sn([pt.common,pt.specularmap,pt.envmap,pt.aomap,pt.lightmap,pt.emissivemap,pt.bumpmap,pt.normalmap,pt.displacementmap,pt.fog,pt.lights,{emissive:{value:new oe(0)},envMapIntensity:{value:1}}]),vertexShader:he.meshlambert_vert,fragmentShader:he.meshlambert_frag},phong:{uniforms:sn([pt.common,pt.specularmap,pt.envmap,pt.aomap,pt.lightmap,pt.emissivemap,pt.bumpmap,pt.normalmap,pt.displacementmap,pt.fog,pt.lights,{emissive:{value:new oe(0)},specular:{value:new oe(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:he.meshphong_vert,fragmentShader:he.meshphong_frag},standard:{uniforms:sn([pt.common,pt.envmap,pt.aomap,pt.lightmap,pt.emissivemap,pt.bumpmap,pt.normalmap,pt.displacementmap,pt.roughnessmap,pt.metalnessmap,pt.fog,pt.lights,{emissive:{value:new oe(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:he.meshphysical_vert,fragmentShader:he.meshphysical_frag},toon:{uniforms:sn([pt.common,pt.aomap,pt.lightmap,pt.emissivemap,pt.bumpmap,pt.normalmap,pt.displacementmap,pt.gradientmap,pt.fog,pt.lights,{emissive:{value:new oe(0)}}]),vertexShader:he.meshtoon_vert,fragmentShader:he.meshtoon_frag},matcap:{uniforms:sn([pt.common,pt.bumpmap,pt.normalmap,pt.displacementmap,pt.fog,{matcap:{value:null}}]),vertexShader:he.meshmatcap_vert,fragmentShader:he.meshmatcap_frag},points:{uniforms:sn([pt.points,pt.fog]),vertexShader:he.points_vert,fragmentShader:he.points_frag},dashed:{uniforms:sn([pt.common,pt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:he.linedashed_vert,fragmentShader:he.linedashed_frag},depth:{uniforms:sn([pt.common,pt.displacementmap]),vertexShader:he.depth_vert,fragmentShader:he.depth_frag},normal:{uniforms:sn([pt.common,pt.bumpmap,pt.normalmap,pt.displacementmap,{opacity:{value:1}}]),vertexShader:he.meshnormal_vert,fragmentShader:he.meshnormal_frag},sprite:{uniforms:sn([pt.sprite,pt.fog]),vertexShader:he.sprite_vert,fragmentShader:he.sprite_frag},background:{uniforms:{uvTransform:{value:new jt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:he.background_vert,fragmentShader:he.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new jt}},vertexShader:he.backgroundCube_vert,fragmentShader:he.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:he.cube_vert,fragmentShader:he.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:he.equirect_vert,fragmentShader:he.equirect_frag},distance:{uniforms:sn([pt.common,pt.displacementmap,{referencePosition:{value:new L},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:he.distance_vert,fragmentShader:he.distance_frag},shadow:{uniforms:sn([pt.lights,pt.fog,{color:{value:new oe(0)},opacity:{value:1}}]),vertexShader:he.shadow_vert,fragmentShader:he.shadow_frag}};vi.physical={uniforms:sn([vi.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new jt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new jt},clearcoatNormalScale:{value:new Yt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new jt},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new jt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new jt},sheen:{value:0},sheenColor:{value:new oe(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new jt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new jt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new jt},transmissionSamplerSize:{value:new Yt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new jt},attenuationDistance:{value:0},attenuationColor:{value:new oe(0)},specularColor:{value:new oe(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new jt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new jt},anisotropyVector:{value:new Yt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new jt}}]),vertexShader:he.meshphysical_vert,fragmentShader:he.meshphysical_frag};var Jl={r:0,b:0,g:0},T_=new De,Yf=new jt;Yf.set(-1,0,0,0,1,0,0,0,1);function E_(n,t,e,i,s,r){let o=new oe(0),a=s===!0?0:1,l,c,u=null,d=0,h=null;function f(S){let A=S.isScene===!0?S.background:null;if(A&&A.isTexture){let M=S.backgroundBlurriness>0;A=t.get(A,M)}return A}function m(S){let A=!1,M=f(S);M===null?g(o,a):M&&M.isColor&&(g(M,1),A=!0);let T=n.xr.getEnvironmentBlendMode();T==="additive"?e.buffers.color.setClear(0,0,0,1,r):T==="alpha-blend"&&e.buffers.color.setClear(0,0,0,0,r),(n.autoClear||A)&&(e.buffers.depth.setTest(!0),e.buffers.depth.setMask(!0),e.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function x(S,A){let M=f(A);M&&(M.isCubeTexture||M.mapping===go)?(c===void 0&&(c=new un(new fr(1,1,1),new Nn({name:"BackgroundCubeMaterial",uniforms:Ps(vi.backgroundCube.uniforms),vertexShader:vi.backgroundCube.vertexShader,fragmentShader:vi.backgroundCube.fragmentShader,side:pn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(T,b,C){this.matrixWorld.copyPosition(C.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(c)),c.material.uniforms.envMap.value=M,c.material.uniforms.backgroundBlurriness.value=A.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=A.backgroundIntensity,c.material.uniforms.backgroundRotation.value.setFromMatrix4(T_.makeRotationFromEuler(A.backgroundRotation)).transpose(),M.isCubeTexture&&M.isRenderTargetTexture===!1&&c.material.uniforms.backgroundRotation.value.premultiply(Yf),c.material.toneMapped=ge.getTransfer(M.colorSpace)!==Se,(u!==M||d!==M.version||h!==n.toneMapping)&&(c.material.needsUpdate=!0,u=M,d=M.version,h=n.toneMapping),c.layers.enableAll(),S.unshift(c,c.geometry,c.material,0,0,null)):M&&M.isTexture&&(l===void 0&&(l=new un(new dn(2,2),new Nn({name:"BackgroundMaterial",uniforms:Ps(vi.background.uniforms),vertexShader:vi.background.vertexShader,fragmentShader:vi.background.fragmentShader,side:as,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(l)),l.material.uniforms.t2D.value=M,l.material.uniforms.backgroundIntensity.value=A.backgroundIntensity,l.material.toneMapped=ge.getTransfer(M.colorSpace)!==Se,M.matrixAutoUpdate===!0&&M.updateMatrix(),l.material.uniforms.uvTransform.value.copy(M.matrix),(u!==M||d!==M.version||h!==n.toneMapping)&&(l.material.needsUpdate=!0,u=M,d=M.version,h=n.toneMapping),l.layers.enableAll(),S.unshift(l,l.geometry,l.material,0,0,null))}function g(S,A){S.getRGB(Jl,Uh(n)),e.buffers.color.setClear(Jl.r,Jl.g,Jl.b,A,r)}function p(){c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return o},setClearColor:function(S,A=1){o.set(S),a=A,g(o,a)},getClearAlpha:function(){return a},setClearAlpha:function(S){a=S,g(o,a)},render:m,addToRenderList:x,dispose:p}}function w_(n,t){let e=n.getParameter(n.MAX_VERTEX_ATTRIBS),i={},s=h(null),r=s,o=!1;function a(F,B,V,I,k){let W=!1,J=d(F,I,V,B);r!==J&&(r=J,c(r.object)),W=f(F,I,V,k),W&&m(F,I,V,k),k!==null&&t.update(k,n.ELEMENT_ARRAY_BUFFER),(W||o)&&(o=!1,M(F,B,V,I),k!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,t.get(k).buffer))}function l(){return n.createVertexArray()}function c(F){return n.bindVertexArray(F)}function u(F){return n.deleteVertexArray(F)}function d(F,B,V,I){let k=I.wireframe===!0,W=i[B.id];W===void 0&&(W={},i[B.id]=W);let J=F.isInstancedMesh===!0?F.id:0,et=W[J];et===void 0&&(et={},W[J]=et);let U=et[V.id];U===void 0&&(U={},et[V.id]=U);let q=U[k];return q===void 0&&(q=h(l()),U[k]=q),q}function h(F){let B=[],V=[],I=[];for(let k=0;k<e;k++)B[k]=0,V[k]=0,I[k]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:B,enabledAttributes:V,attributeDivisors:I,object:F,attributes:{},index:null}}function f(F,B,V,I){let k=r.attributes,W=B.attributes,J=0,et=V.getAttributes();for(let U in et)if(et[U].location>=0){let j=k[U],yt=W[U];if(yt===void 0&&(U==="instanceMatrix"&&F.instanceMatrix&&(yt=F.instanceMatrix),U==="instanceColor"&&F.instanceColor&&(yt=F.instanceColor)),j===void 0||j.attribute!==yt||yt&&j.data!==yt.data)return!0;J++}return r.attributesNum!==J||r.index!==I}function m(F,B,V,I){let k={},W=B.attributes,J=0,et=V.getAttributes();for(let U in et)if(et[U].location>=0){let j=W[U];j===void 0&&(U==="instanceMatrix"&&F.instanceMatrix&&(j=F.instanceMatrix),U==="instanceColor"&&F.instanceColor&&(j=F.instanceColor));let yt={};yt.attribute=j,j&&j.data&&(yt.data=j.data),k[U]=yt,J++}r.attributes=k,r.attributesNum=J,r.index=I}function x(){let F=r.newAttributes;for(let B=0,V=F.length;B<V;B++)F[B]=0}function g(F){p(F,0)}function p(F,B){let V=r.newAttributes,I=r.enabledAttributes,k=r.attributeDivisors;V[F]=1,I[F]===0&&(n.enableVertexAttribArray(F),I[F]=1),k[F]!==B&&(n.vertexAttribDivisor(F,B),k[F]=B)}function S(){let F=r.newAttributes,B=r.enabledAttributes;for(let V=0,I=B.length;V<I;V++)B[V]!==F[V]&&(n.disableVertexAttribArray(V),B[V]=0)}function A(F,B,V,I,k,W,J){J===!0?n.vertexAttribIPointer(F,B,V,k,W):n.vertexAttribPointer(F,B,V,I,k,W)}function M(F,B,V,I){x();let k=I.attributes,W=V.getAttributes(),J=B.defaultAttributeValues;for(let et in W){let U=W[et];if(U.location>=0){let q=k[et];if(q===void 0&&(et==="instanceMatrix"&&F.instanceMatrix&&(q=F.instanceMatrix),et==="instanceColor"&&F.instanceColor&&(q=F.instanceColor)),q!==void 0){let j=q.normalized,yt=q.itemSize,bt=t.get(q);if(bt===void 0)continue;let pe=bt.buffer,Xt=bt.type,Tt=bt.bytesPerElement,Y=Xt===n.INT||Xt===n.UNSIGNED_INT||q.gpuType===hl;if(q.isInterleavedBufferAttribute){let K=q.data,it=K.stride,Rt=q.offset;if(K.isInstancedInterleavedBuffer){for(let ot=0;ot<U.locationSize;ot++)p(U.location+ot,K.meshPerAttribute);F.isInstancedMesh!==!0&&I._maxInstanceCount===void 0&&(I._maxInstanceCount=K.meshPerAttribute*K.count)}else for(let ot=0;ot<U.locationSize;ot++)g(U.location+ot);n.bindBuffer(n.ARRAY_BUFFER,pe);for(let ot=0;ot<U.locationSize;ot++)A(U.location+ot,yt/U.locationSize,Xt,j,it*Tt,(Rt+yt/U.locationSize*ot)*Tt,Y)}else{if(q.isInstancedBufferAttribute){for(let K=0;K<U.locationSize;K++)p(U.location+K,q.meshPerAttribute);F.isInstancedMesh!==!0&&I._maxInstanceCount===void 0&&(I._maxInstanceCount=q.meshPerAttribute*q.count)}else for(let K=0;K<U.locationSize;K++)g(U.location+K);n.bindBuffer(n.ARRAY_BUFFER,pe);for(let K=0;K<U.locationSize;K++)A(U.location+K,yt/U.locationSize,Xt,j,yt*Tt,yt/U.locationSize*K*Tt,Y)}}else if(J!==void 0){let j=J[et];if(j!==void 0)switch(j.length){case 2:n.vertexAttrib2fv(U.location,j);break;case 3:n.vertexAttrib3fv(U.location,j);break;case 4:n.vertexAttrib4fv(U.location,j);break;default:n.vertexAttrib1fv(U.location,j)}}}}S()}function T(){w();for(let F in i){let B=i[F];for(let V in B){let I=B[V];for(let k in I){let W=I[k];for(let J in W)u(W[J].object),delete W[J];delete I[k]}}delete i[F]}}function b(F){if(i[F.id]===void 0)return;let B=i[F.id];for(let V in B){let I=B[V];for(let k in I){let W=I[k];for(let J in W)u(W[J].object),delete W[J];delete I[k]}}delete i[F.id]}function C(F){for(let B in i){let V=i[B];for(let I in V){let k=V[I];if(k[F.id]===void 0)continue;let W=k[F.id];for(let J in W)u(W[J].object),delete W[J];delete k[F.id]}}}function y(F){for(let B in i){let V=i[B],I=F.isInstancedMesh===!0?F.id:0,k=V[I];if(k!==void 0){for(let W in k){let J=k[W];for(let et in J)u(J[et].object),delete J[et];delete k[W]}delete V[I],Object.keys(V).length===0&&delete i[B]}}}function w(){P(),o=!0,r!==s&&(r=s,c(r.object))}function P(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:a,reset:w,resetDefaultState:P,dispose:T,releaseStatesOfGeometry:b,releaseStatesOfObject:y,releaseStatesOfProgram:C,initAttributes:x,enableAttribute:g,disableUnusedAttributes:S}}function A_(n,t,e){let i;function s(l){i=l}function r(l,c){n.drawArrays(i,l,c),e.update(c,i,1)}function o(l,c,u){u!==0&&(n.drawArraysInstanced(i,l,c,u),e.update(c,i,u))}function a(l,c,u){if(u===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,l,0,c,0,u);let h=0;for(let f=0;f<u;f++)h+=c[f];e.update(h,i,1)}this.setMode=s,this.render=r,this.renderInstances=o,this.renderMultiDraw=a}function C_(n,t,e,i){let s;function r(){if(s!==void 0)return s;if(t.has("EXT_texture_filter_anisotropic")===!0){let C=t.get("EXT_texture_filter_anisotropic");s=n.getParameter(C.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function o(C){return!(C!==Xn&&i.convert(C)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(C){let y=C===ii&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(C!==bn&&C!==ni&&!y&&i.convert(C)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE))}function l(C){if(C==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";C="mediump"}return C==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=e.precision!==void 0?e.precision:"highp",u=l(c);u!==c&&(Ht("WebGLRenderer:",c,"not supported, using",u,"instead."),c=u);let d=e.logarithmicDepthBuffer===!0,h=e.reversedDepthBuffer===!0&&t.has("EXT_clip_control");e.reversedDepthBuffer===!0&&h===!1&&Ht("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");let f=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),m=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),x=n.getParameter(n.MAX_TEXTURE_SIZE),g=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),p=n.getParameter(n.MAX_VERTEX_ATTRIBS),S=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),A=n.getParameter(n.MAX_VARYING_VECTORS),M=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),T=n.getParameter(n.MAX_SAMPLES),b=n.getParameter(n.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:o,textureTypeReadable:a,precision:c,logarithmicDepthBuffer:d,reversedDepthBuffer:h,maxTextures:f,maxVertexTextures:m,maxTextureSize:x,maxCubemapSize:g,maxAttributes:p,maxVertexUniforms:S,maxVaryings:A,maxFragmentUniforms:M,maxSamples:T,samples:b}}function R_(n){let t=this,e=null,i=0,s=!1,r=!1,o=new Ln,a=new jt,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(d,h){let f=d.length!==0||h||i!==0||s;return s=h,i=d.length,f},this.beginShadows=function(){r=!0,u(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(d,h){e=u(d,h,0)},this.setState=function(d,h,f){let m=d.clippingPlanes,x=d.clipIntersection,g=d.clipShadows,p=n.get(d);if(!s||m===null||m.length===0||r&&!g)r?u(null):c();else{let S=r?0:i,A=S*4,M=p.clippingState||null;l.value=M,M=u(m,h,A,f);for(let T=0;T!==A;++T)M[T]=e[T];p.clippingState=M,this.numIntersection=x?this.numPlanes:0,this.numPlanes+=S}};function c(){l.value!==e&&(l.value=e,l.needsUpdate=i>0),t.numPlanes=i,t.numIntersection=0}function u(d,h,f,m){let x=d!==null?d.length:0,g=null;if(x!==0){if(g=l.value,m!==!0||g===null){let p=f+x*4,S=h.matrixWorldInverse;a.getNormalMatrix(S),(g===null||g.length<p)&&(g=new Float32Array(p));for(let A=0,M=f;A!==x;++A,M+=4)o.copy(d[A]).applyMatrix4(S,a),o.normal.toArray(g,M),g[M+3]=o.constant}l.value=g,l.needsUpdate=!0}return t.numPlanes=x,t.numIntersection=0,g}}var Er=4,P_=6,I_=20,L_=256,To=new gr,Ef=new oe,Wh=null,Xh=0,qh=0,Yh=!1,D_=new L,Is=new L,Kl=class{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(t,e=0,i=.1,s=100,r={}){let{size:o=256,position:a=D_}=r;Wh=this._renderer.getRenderTarget(),Xh=this._renderer.getActiveCubeFace(),qh=this._renderer.getActiveMipmapLevel(),Yh=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(o);let l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(t,i,s,l,a),e>0&&this._blur(l,0,0,e),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Cf(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Af(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodMeshes.length;t++)this._lodMeshes[t].geometry.dispose()}_cleanup(t){this._renderer.setRenderTarget(Wh,Xh,qh),this._renderer.xr.enabled=Yh,t.scissorTest=!1,Tr(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===ls||t.mapping===Rs?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),Wh=this._renderer.getRenderTarget(),Xh=this._renderer.getActiveCubeFace(),qh=this._renderer.getActiveMipmapLevel(),Yh=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let i=e||this._allocateTargets();return this._textureToCubeUV(t,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){let t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,i={magFilter:je,minFilter:je,generateMipmaps:!1,type:ii,format:Xn,colorSpace:Jr,depthBuffer:!1},s=wf(t,e,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=wf(t,e,i);let{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods}=N_(r)),this._blurMaterial=F_(r,t,e),this._ggxMaterial=U_(r,t,e)}return s}_compileMaterial(t){let e=new un(new Ge,t);this._renderer.compile(e,To)}_sceneToCubeUV(t,e,i,s,r){let l=new nn(90,1,e,i),c=[1,-1,1,1,1,1],u=[1,1,1,-1,-1,-1],d=this._renderer,h=d.autoClear,f=d.toneMapping;d.getClearColor(Ef),d.toneMapping=ti,d.autoClear=!1,d.state.buffers.depth.getReversed()&&(d.setRenderTarget(s),d.clearDepth(),d.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new un(new fr,new ur({name:"PMREM.Background",side:pn,depthWrite:!1,depthTest:!1})));let x=this._backgroundBox,g=x.material,p=!1,S=t.background;S?S.isColor&&(g.color.copy(S),t.background=null,p=!0):(g.color.copy(Ef),p=!0);for(let A=0;A<6;A++){let M=A%3;M===0?(l.up.set(0,c[A],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x+u[A],r.y,r.z)):M===1?(l.up.set(0,0,c[A]),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y+u[A],r.z)):(l.up.set(0,c[A],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y,r.z+u[A]));let T=this._cubeSize;Tr(s,M*T,A>2?T:0,T,T),d.setRenderTarget(s),p&&d.render(x,l),d.render(t,l)}d.toneMapping=f,d.autoClear=h,t.background=S}_textureToCubeUV(t,e){let i=this._renderer,s=t.mapping===ls||t.mapping===Rs;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=Cf()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Af());let r=s?this._cubemapMaterial:this._equirectMaterial,o=this._lodMeshes[0];o.material=r;let a=r.uniforms;a.envMap.value=t;let l=this._cubeSize;Tr(e,0,0,3*l,2*l),i.setRenderTarget(e),i.render(o,To)}_applyPMREM(t){let e=this._renderer,i=e.autoClear;e.autoClear=!1;let s=this._lodMeshes.length;for(let r=1;r<s;r++)this._applyGGXFilter(t,r-1,r);e.autoClear=i}_applyGGXFilter(t,e,i){let s=this._renderer,r=this._pingPongRenderTarget,o=this._ggxMaterial,a=this._lodMeshes[i];a.material=o;let l=o.uniforms,c=i/(this._lodMeshes.length-1),u=e/(this._lodMeshes.length-1),d=Math.sqrt(c*c-u*u),h=c*1.25,f=d*h,{_lodMax:m}=this,x=this._sizeLods[i],g=3*x*(i>m-Er?i-m+Er:0),p=4*(this._cubeSize-x);l.envMap.value=t.texture,l.roughness.value=f,l.mipInt.value=m-e,Tr(r,g,p,3*x,2*x),s.setRenderTarget(r),s.render(a,To),l.envMap.value=r.texture,l.roughness.value=0,l.mipInt.value=m-i,Tr(t,g,p,3*x,2*x),s.setRenderTarget(t),s.render(a,To)}_blur(t,e,i,s){let r=this._pingPongRenderTarget,o=Math.min(s,Math.PI)/Math.SQRT2;this._blurPass(t,r,e,i,o),this._blurPass(r,t,i,i,o)}_blurPass(t,e,i,s,r){let o=this._renderer,a=this._blurMaterial,l=this._lodMeshes[s];l.material=a;let c=a.uniforms;c.envMap.value=t.texture,c.sigma.value=r,c.mipInt.value=this._lodMax-i;let u=this._sizeLods[s],d=3*u*(s>this._lodMax-Er?s-this._lodMax+Er:0),h=4*(this._cubeSize-u);Tr(e,d,h,3*u,2*u),o.setRenderTarget(e),o.render(l,To)}};function N_(n){let t=[],e=[],i=n,s=n-Er+1+P_;for(let r=0;r<s;r++){let o=Math.pow(2,i);t.push(o);let a=1/(o-2),l=-a,c=1+a,u=[l,l,c,l,c,c,l,l,c,c,l,c],d=6,h=6,f=3,m=new Float32Array(f*h*d),x=new Float32Array(f*h*d);for(let p=0;p<d;p++){let S=p%3*2/3-1,A=p>2?0:-1,M=[S,A,0,S+2/3,A,0,S+2/3,A+1,0,S,A,0,S+2/3,A+1,0,S,A+1,0];m.set(M,f*h*p);for(let T=0;T<h;T++){let b=u[T*2]*2-1,C=u[T*2+1]*2-1;p===0?Is.set(1,C,b):p===1?Is.set(-b,1,-C):p===2?Is.set(-b,C,1):p===3?Is.set(-1,C,-b):p===4?Is.set(-b,-1,C):Is.set(b,C,-1),Is.toArray(x,(p*h+T)*f)}}let g=new Ge;g.setAttribute("position",new Gn(m,f)),g.setAttribute("outputDirection",new Gn(x,f)),e.push(new un(g,null)),i>Er&&i--}return{lodMeshes:e,sizeLods:t}}function wf(n,t,e){let i=new Mn(n,t,e);return i.texture.mapping=go,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function Tr(n,t,e,i,s){n.viewport.set(t,e,i,s),n.scissor.set(t,e,i,s)}function U_(n,t,e){return new Nn({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:L_,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:tc(),fragmentShader:`

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
		`,blending:xi,depthTest:!1,depthWrite:!1})}function F_(n,t,e){return new Nn({name:"SphericalGaussianBlur",defines:{SAMPLES:I_,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},sigma:{value:0},mipInt:{value:0}},vertexShader:tc(),fragmentShader:`

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
		`,blending:xi,depthTest:!1,depthWrite:!1})}function Af(){return new Nn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:tc(),fragmentShader:`

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
		`,blending:xi,depthTest:!1,depthWrite:!1})}function Cf(){return new Nn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:tc(),fragmentShader:`

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
	`}var jl=class extends Mn{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;let i={width:t,height:t,depth:1},s=[i,i,i,i,i,i];this.texture=new io(s),this._setTextureOptions(e),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;let i={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new fr(5,5,5),r=new Nn({name:"CubemapFromEquirect",uniforms:Ps(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:pn,blending:xi});r.uniforms.tEquirect.value=e;let o=new un(s,r),a=e.minFilter;return e.minFilter===cs&&(e.minFilter=je),new sl(1,10,this).update(t,o),e.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(t,e=!0,i=!0,s=!0){let r=t.getRenderTarget();for(let o=0;o<6;o++)t.setRenderTarget(this,o),t.clear(e,i,s);t.setRenderTarget(r)}};function O_(n){let t=new WeakMap,e=new WeakMap,i=null;function s(h,f=!1){return h==null?null:f?o(h):r(h)}function r(h){if(h&&h.isTexture){let f=h.mapping;if(f===al||f===ll)if(t.has(h)){let m=t.get(h).texture;return a(m,h.mapping)}else{let m=h.image;if(m&&m.height>0){let x=new jl(m.height);return x.fromEquirectangularTexture(n,h),t.set(h,x),h.addEventListener("dispose",c),a(x.texture,h.mapping)}else return null}}return h}function o(h){if(h&&h.isTexture){let f=h.mapping,m=f===al||f===ll,x=f===ls||f===Rs;if(m||x){let g=e.get(h),p=g!==void 0?g.texture.pmremVersion:0;if(h.isRenderTargetTexture&&h.pmremVersion!==p)return i===null&&(i=new Kl(n)),g=m?i.fromEquirectangular(h,g):i.fromCubemap(h,g),g.texture.pmremVersion=h.pmremVersion,e.set(h,g),g.texture;if(g!==void 0)return g.texture;{let S=h.image;return m&&S&&S.height>0||x&&S&&l(S)?(i===null&&(i=new Kl(n)),g=m?i.fromEquirectangular(h):i.fromCubemap(h),g.texture.pmremVersion=h.pmremVersion,e.set(h,g),h.addEventListener("dispose",u),g.texture):null}}}return h}function a(h,f){return f===al?h.mapping=ls:f===ll&&(h.mapping=Rs),h}function l(h){let f=0,m=6;for(let x=0;x<m;x++)h[x]!==void 0&&f++;return f===m}function c(h){let f=h.target;f.removeEventListener("dispose",c);let m=t.get(f);m!==void 0&&(t.delete(f),m.dispose())}function u(h){let f=h.target;f.removeEventListener("dispose",u);let m=e.get(f);m!==void 0&&(e.delete(f),m.dispose())}function d(){t=new WeakMap,e=new WeakMap,i!==null&&(i.dispose(),i=null)}return{get:s,dispose:d}}function B_(n){let t={};function e(i){if(t[i]!==void 0)return t[i];let s=n.getExtension(i);return t[i]=s,s}return{has:function(i){return e(i)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(i){let s=e(i);return s===null&&Ts("WebGLRenderer: "+i+" extension not supported."),s}}}function k_(n,t,e,i){let s={},r=new WeakMap;function o(d){let h=d.target;h.index!==null&&t.remove(h.index);for(let m in h.attributes)t.remove(h.attributes[m]);h.removeEventListener("dispose",o),delete s[h.id];let f=r.get(h);f&&(t.remove(f),r.delete(h)),i.releaseStatesOfGeometry(h),h.isInstancedBufferGeometry===!0&&delete h._maxInstanceCount,e.memory.geometries--}function a(d,h){return s[h.id]===!0||(h.addEventListener("dispose",o),s[h.id]=!0,e.memory.geometries++),h}function l(d){let h=d.attributes;for(let f in h)t.update(h[f],n.ARRAY_BUFFER)}function c(d){let h=[],f=d.index,m=d.attributes.position,x=0;if(m===void 0)return;if(f!==null){let S=f.array;x=f.version;for(let A=0,M=S.length;A<M;A+=3){let T=S[A+0],b=S[A+1],C=S[A+2];h.push(T,b,b,C,C,T)}}else{let S=m.array;x=m.version;for(let A=0,M=S.length/3-1;A<M;A+=3){let T=A+0,b=A+1,C=A+2;h.push(T,b,b,C,C,T)}}let g=new(m.count>=65535?no:eo)(h,1);g.version=x;let p=r.get(d);p&&t.remove(p),r.set(d,g)}function u(d){let h=r.get(d);if(h){let f=d.index;f!==null&&h.version<f.version&&c(d)}else c(d);return r.get(d)}return{get:a,update:l,getWireframeAttribute:u}}function z_(n,t,e){let i;function s(d){i=d}let r,o;function a(d){r=d.type,o=d.bytesPerElement}function l(d,h){n.drawElements(i,h,r,d*o),e.update(h,i,1)}function c(d,h,f){f!==0&&(n.drawElementsInstanced(i,h,r,d*o,f),e.update(h,i,f))}function u(d,h,f){if(f===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,h,0,r,d,0,f);let x=0;for(let g=0;g<f;g++)x+=h[g];e.update(x,i,1)}this.setMode=s,this.setIndex=a,this.render=l,this.renderInstances=c,this.renderMultiDraw=u}function V_(n){let t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function i(r,o,a){switch(e.calls++,o){case n.TRIANGLES:e.triangles+=a*(r/3);break;case n.LINES:e.lines+=a*(r/2);break;case n.LINE_STRIP:e.lines+=a*(r-1);break;case n.LINE_LOOP:e.lines+=a*r;break;case n.POINTS:e.points+=a*r;break;default:Zt("WebGLInfo: Unknown draw mode:",o);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:i}}function H_(n,t,e){let i=new WeakMap,s=new Ne;function r(o,a,l){let c=o.morphTargetInfluences,u=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,d=u!==void 0?u.length:0,h=i.get(a);if(h===void 0||h.count!==d){let w=function(){C.dispose(),i.delete(a),a.removeEventListener("dispose",w)};h!==void 0&&h.texture.dispose();let f=a.morphAttributes.position!==void 0,m=a.morphAttributes.normal!==void 0,x=a.morphAttributes.color!==void 0,g=a.morphAttributes.position||[],p=a.morphAttributes.normal||[],S=a.morphAttributes.color||[],A=0;f===!0&&(A=1),m===!0&&(A=2),x===!0&&(A=3);let M=a.attributes.position.count*A,T=1;M>t.maxTextureSize&&(T=Math.ceil(M/t.maxTextureSize),M=t.maxTextureSize);let b=new Float32Array(M*T*4*d),C=new jr(b,M,T,d);C.type=ni,C.needsUpdate=!0;let y=A*4;for(let P=0;P<d;P++){let F=g[P],B=p[P],V=S[P],I=M*T*4*P;for(let k=0;k<F.count;k++){let W=k*y;f===!0&&(s.fromBufferAttribute(F,k),b[I+W+0]=s.x,b[I+W+1]=s.y,b[I+W+2]=s.z,b[I+W+3]=0),m===!0&&(s.fromBufferAttribute(B,k),b[I+W+4]=s.x,b[I+W+5]=s.y,b[I+W+6]=s.z,b[I+W+7]=0),x===!0&&(s.fromBufferAttribute(V,k),b[I+W+8]=s.x,b[I+W+9]=s.y,b[I+W+10]=s.z,b[I+W+11]=V.itemSize===4?s.w:1)}}h={count:d,texture:C,size:new Yt(M,T)},i.set(a,h),a.addEventListener("dispose",w)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)l.getUniforms().setValue(n,"morphTexture",o.morphTexture,e);else{let f=0;for(let x=0;x<c.length;x++)f+=c[x];let m=a.morphTargetsRelative?1:1-f;l.getUniforms().setValue(n,"morphTargetBaseInfluence",m),l.getUniforms().setValue(n,"morphTargetInfluences",c)}l.getUniforms().setValue(n,"morphTargetsTexture",h.texture,e),l.getUniforms().setValue(n,"morphTargetsTextureSize",h.size)}return{update:r}}function G_(n,t,e,i,s){let r=new WeakMap;function o(c){let u=s.render.frame,d=c.geometry,h=t.get(c,d);if(r.get(h)!==u&&(t.update(h),r.set(h,u)),c.isInstancedMesh&&(c.hasEventListener("dispose",l)===!1&&c.addEventListener("dispose",l),r.get(c)!==u&&(e.update(c.instanceMatrix,n.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,n.ARRAY_BUFFER),r.set(c,u))),c.isSkinnedMesh){let f=c.skeleton;r.get(f)!==u&&(f.update(),r.set(f,u))}return h}function a(){r=new WeakMap}function l(c){let u=c.target;u.removeEventListener("dispose",l),i.releaseStatesOfObject(u),e.remove(u.instanceMatrix),u.instanceColor!==null&&e.remove(u.instanceColor)}return{update:o,dispose:a}}var W_={[_h]:"LINEAR_TONE_MAPPING",[xh]:"REINHARD_TONE_MAPPING",[yh]:"CINEON_TONE_MAPPING",[mo]:"ACES_FILMIC_TONE_MAPPING",[Mh]:"AGX_TONE_MAPPING",[Sh]:"NEUTRAL_TONE_MAPPING",[vh]:"CUSTOM_TONE_MAPPING"};function X_(n,t,e,i,s,r){let o=new Mn(t,e,{type:n,depthBuffer:s,stencilBuffer:r,samples:i?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1}),a=null,l=null,c=new Ge;c.setAttribute("position",new Pe([-1,3,0,-1,-1,0,3,-1,0],3)),c.setAttribute("uv",new Pe([0,2,0,0,2,0],2));let u=new Ga({uniforms:{tDiffuse:{value:null}},vertexShader:`
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
			}`,depthTest:!1,depthWrite:!1}),d=new un(c,u),h=new gr(-1,1,1,-1,0,1),f=null,m=null,x=!1,g,p=null,S=[],A=!1;this.setSize=function(M,T){o.setSize(M,T),a!==null&&a.setSize(M,T),l!==null&&l.setSize(M,T);for(let b=0;b<S.length;b++){let C=S[b];C.setSize&&C.setSize(M,T)}},this.setEffects=function(M){S=M,A=S.length>0&&S[0].isRenderPass===!0;let T=o.width,b=o.height;S.length>0&&a===null&&(a=new Mn(T,b,{type:ii,depthBuffer:!1,stencilBuffer:!1}),l=new Mn(T,b,{type:ii,depthBuffer:!1,stencilBuffer:!1}));for(let C=0;C<S.length;C++){let y=S[C];y.setSize&&y.setSize(T,b)}},this.begin=function(M,T){if(x||M.toneMapping===ti&&S.length===0)return!1;if(p=T,T!==null){let b=T.width,C=T.height;(o.width!==b||o.height!==C)&&this.setSize(b,C)}return A===!1&&M.setRenderTarget(o),g=M.toneMapping,M.toneMapping=ti,!0},this.hasRenderPass=function(){return A},this.end=function(M,T){M.toneMapping=g,x=!0;let b=o,C=a;for(let y=0;y<S.length;y++){let w=S[y];w.enabled!==!1&&(w.render(M,C,b,T),w.needsSwap!==!1&&(b=C,C=C===a?l:a))}if(f!==M.outputColorSpace||m!==M.toneMapping){f=M.outputColorSpace,m=M.toneMapping,u.defines={},ge.getTransfer(f)===Se&&(u.defines.SRGB_TRANSFER="");let y=W_[m];y&&(u.defines[y]=""),u.needsUpdate=!0}u.uniforms.tDiffuse.value=b.texture,M.setRenderTarget(p),M.render(d,h),p=null,x=!1},this.isCompositing=function(){return x},this.dispose=function(){o.dispose(),a!==null&&a.dispose(),l!==null&&l.dispose(),c.dispose(),u.dispose()}}var Zf=new vn,$h=new Qi(1,1),Jf=new jr,$f=new Ba,Kf=new io,Rf=[],Pf=[],If=new Float32Array(16),Lf=new Float32Array(9),Df=new Float32Array(4);function Ar(n,t,e){let i=n[0];if(i<=0||i>0)return n;let s=t*e,r=Rf[s];if(r===void 0&&(r=new Float32Array(s),Rf[s]=r),t!==0){i.toArray(r,0);for(let o=1,a=0;o!==t;++o)a+=e,n[o].toArray(r,a)}return r}function qe(n,t){if(n.length!==t.length)return!1;for(let e=0,i=n.length;e<i;e++)if(n[e]!==t[e])return!1;return!0}function Ye(n,t){for(let e=0,i=t.length;e<i;e++)n[e]=t[e]}function ec(n,t){let e=Pf[t];e===void 0&&(e=new Int32Array(t),Pf[t]=e);for(let i=0;i!==t;++i)e[i]=n.allocateTextureUnit();return e}function q_(n,t){let e=this.cache;e[0]!==t&&(n.uniform1f(this.addr,t),e[0]=t)}function Y_(n,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(qe(e,t))return;n.uniform2fv(this.addr,t),Ye(e,t)}}function Z_(n,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(n.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(qe(e,t))return;n.uniform3fv(this.addr,t),Ye(e,t)}}function J_(n,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(qe(e,t))return;n.uniform4fv(this.addr,t),Ye(e,t)}}function $_(n,t){let e=this.cache,i=t.elements;if(i===void 0){if(qe(e,t))return;n.uniformMatrix2fv(this.addr,!1,t),Ye(e,t)}else{if(qe(e,i))return;Df.set(i),n.uniformMatrix2fv(this.addr,!1,Df),Ye(e,i)}}function K_(n,t){let e=this.cache,i=t.elements;if(i===void 0){if(qe(e,t))return;n.uniformMatrix3fv(this.addr,!1,t),Ye(e,t)}else{if(qe(e,i))return;Lf.set(i),n.uniformMatrix3fv(this.addr,!1,Lf),Ye(e,i)}}function j_(n,t){let e=this.cache,i=t.elements;if(i===void 0){if(qe(e,t))return;n.uniformMatrix4fv(this.addr,!1,t),Ye(e,t)}else{if(qe(e,i))return;If.set(i),n.uniformMatrix4fv(this.addr,!1,If),Ye(e,i)}}function Q_(n,t){let e=this.cache;e[0]!==t&&(n.uniform1i(this.addr,t),e[0]=t)}function tx(n,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(qe(e,t))return;n.uniform2iv(this.addr,t),Ye(e,t)}}function ex(n,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(qe(e,t))return;n.uniform3iv(this.addr,t),Ye(e,t)}}function nx(n,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(qe(e,t))return;n.uniform4iv(this.addr,t),Ye(e,t)}}function ix(n,t){let e=this.cache;e[0]!==t&&(n.uniform1ui(this.addr,t),e[0]=t)}function sx(n,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(qe(e,t))return;n.uniform2uiv(this.addr,t),Ye(e,t)}}function rx(n,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(qe(e,t))return;n.uniform3uiv(this.addr,t),Ye(e,t)}}function ox(n,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(qe(e,t))return;n.uniform4uiv(this.addr,t),Ye(e,t)}}function ax(n,t,e){let i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s);let r;this.type===n.SAMPLER_2D_SHADOW?($h.compareFunction=e.isReversedDepthBuffer()?Zl:Yl,r=$h):r=Zf,e.setTexture2D(t||r,s)}function lx(n,t,e){let i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),e.setTexture3D(t||$f,s)}function cx(n,t,e){let i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),e.setTextureCube(t||Kf,s)}function hx(n,t,e){let i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),e.setTexture2DArray(t||Jf,s)}function ux(n){switch(n){case 5126:return q_;case 35664:return Y_;case 35665:return Z_;case 35666:return J_;case 35674:return $_;case 35675:return K_;case 35676:return j_;case 5124:case 35670:return Q_;case 35667:case 35671:return tx;case 35668:case 35672:return ex;case 35669:case 35673:return nx;case 5125:return ix;case 36294:return sx;case 36295:return rx;case 36296:return ox;case 35678:case 36198:case 36298:case 36306:case 35682:return ax;case 35679:case 36299:case 36307:return lx;case 35680:case 36300:case 36308:case 36293:return cx;case 36289:case 36303:case 36311:case 36292:return hx}}function dx(n,t){n.uniform1fv(this.addr,t)}function fx(n,t){let e=Ar(t,this.size,2);n.uniform2fv(this.addr,e)}function px(n,t){let e=Ar(t,this.size,3);n.uniform3fv(this.addr,e)}function mx(n,t){let e=Ar(t,this.size,4);n.uniform4fv(this.addr,e)}function gx(n,t){let e=Ar(t,this.size,4);n.uniformMatrix2fv(this.addr,!1,e)}function _x(n,t){let e=Ar(t,this.size,9);n.uniformMatrix3fv(this.addr,!1,e)}function xx(n,t){let e=Ar(t,this.size,16);n.uniformMatrix4fv(this.addr,!1,e)}function yx(n,t){n.uniform1iv(this.addr,t)}function vx(n,t){n.uniform2iv(this.addr,t)}function Mx(n,t){n.uniform3iv(this.addr,t)}function Sx(n,t){n.uniform4iv(this.addr,t)}function bx(n,t){n.uniform1uiv(this.addr,t)}function Tx(n,t){n.uniform2uiv(this.addr,t)}function Ex(n,t){n.uniform3uiv(this.addr,t)}function wx(n,t){n.uniform4uiv(this.addr,t)}function Ax(n,t,e){let i=this.cache,s=t.length,r=ec(e,s);qe(i,r)||(n.uniform1iv(this.addr,r),Ye(i,r));let o;this.type===n.SAMPLER_2D_SHADOW?o=$h:o=Zf;for(let a=0;a!==s;++a)e.setTexture2D(t[a]||o,r[a])}function Cx(n,t,e){let i=this.cache,s=t.length,r=ec(e,s);qe(i,r)||(n.uniform1iv(this.addr,r),Ye(i,r));for(let o=0;o!==s;++o)e.setTexture3D(t[o]||$f,r[o])}function Rx(n,t,e){let i=this.cache,s=t.length,r=ec(e,s);qe(i,r)||(n.uniform1iv(this.addr,r),Ye(i,r));for(let o=0;o!==s;++o)e.setTextureCube(t[o]||Kf,r[o])}function Px(n,t,e){let i=this.cache,s=t.length,r=ec(e,s);qe(i,r)||(n.uniform1iv(this.addr,r),Ye(i,r));for(let o=0;o!==s;++o)e.setTexture2DArray(t[o]||Jf,r[o])}function Ix(n){switch(n){case 5126:return dx;case 35664:return fx;case 35665:return px;case 35666:return mx;case 35674:return gx;case 35675:return _x;case 35676:return xx;case 5124:case 35670:return yx;case 35667:case 35671:return vx;case 35668:case 35672:return Mx;case 35669:case 35673:return Sx;case 5125:return bx;case 36294:return Tx;case 36295:return Ex;case 36296:return wx;case 35678:case 36198:case 36298:case 36306:case 35682:return Ax;case 35679:case 36299:case 36307:return Cx;case 35680:case 36300:case 36308:case 36293:return Rx;case 36289:case 36303:case 36311:case 36292:return Px}}var Kh=class{constructor(t,e,i){this.id=t,this.addr=i,this.cache=[],this.type=e.type,this.setValue=ux(e.type)}},jh=class{constructor(t,e,i){this.id=t,this.addr=i,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=Ix(e.type)}},Qh=class{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,i){let s=this.seq;for(let r=0,o=s.length;r!==o;++r){let a=s[r];a.setValue(t,e[a.id],i)}}},Zh=/(\w+)(\])?(\[|\.)?/g;function Nf(n,t){n.seq.push(t),n.map[t.id]=t}function Lx(n,t,e){let i=n.name,s=i.length;for(Zh.lastIndex=0;;){let r=Zh.exec(i),o=Zh.lastIndex,a=r[1],l=r[2]==="]",c=r[3];if(l&&(a=a|0),c===void 0||c==="["&&o+2===s){Nf(e,c===void 0?new Kh(a,n,t):new jh(a,n,t));break}else{let d=e.map[a];d===void 0&&(d=new Qh(a),Nf(e,d)),e=d}}}var wr=class{constructor(t,e){this.seq=[],this.map={};let i=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let o=0;o<i;++o){let a=t.getActiveUniform(e,o),l=t.getUniformLocation(e,a.name);Lx(a,l,this)}let s=[],r=[];for(let o of this.seq)o.type===t.SAMPLER_2D_SHADOW||o.type===t.SAMPLER_CUBE_SHADOW||o.type===t.SAMPLER_2D_ARRAY_SHADOW?s.push(o):r.push(o);s.length>0&&(this.seq=s.concat(r))}setValue(t,e,i,s){let r=this.map[e];r!==void 0&&r.setValue(t,i,s)}setOptional(t,e,i){let s=e[i];s!==void 0&&this.setValue(t,i,s)}static upload(t,e,i,s){for(let r=0,o=e.length;r!==o;++r){let a=e[r],l=i[a.id];l.needsUpdate!==!1&&a.setValue(t,l.value,s)}}static seqWithValue(t,e){let i=[];for(let s=0,r=t.length;s!==r;++s){let o=t[s];o.id in e&&i.push(o)}return i}};function Uf(n,t,e){let i=n.createShader(t);return n.shaderSource(i,e),n.compileShader(i),i}var Dx=37297,Nx=0;function Ux(n,t){let e=n.split(`
`),i=[],s=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let o=s;o<r;o++){let a=o+1;i.push(`${a===t?">":" "} ${a}: ${e[o]}`)}return i.join(`
`)}var Ff=new jt;function Fx(n){ge._getMatrix(Ff,ge.workingColorSpace,n);let t=`mat3( ${Ff.elements.map(e=>e.toFixed(4))} )`;switch(ge.getTransfer(n)){case $r:return[t,"LinearTransferOETF"];case Se:return[t,"sRGBTransferOETF"];default:return Ht("WebGLProgram: Unsupported color space: ",n),[t,"LinearTransferOETF"]}}function Of(n,t,e){let i=n.getShaderParameter(t,n.COMPILE_STATUS),r=(n.getShaderInfoLog(t)||"").trim();if(i&&r==="")return"";let o=/ERROR: 0:(\d+)/.exec(r);if(o){let a=parseInt(o[1]);return e.toUpperCase()+`

`+r+`

`+Ux(n.getShaderSource(t),a)}else return r}function Ox(n,t){let e=Fx(t);return[`vec4 ${n}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}var Bx={[_h]:"Linear",[xh]:"Reinhard",[yh]:"Cineon",[mo]:"ACESFilmic",[Mh]:"AgX",[Sh]:"Neutral",[vh]:"Custom"};function kx(n,t){let e=Bx[t];return e===void 0?(Ht("WebGLProgram: Unsupported toneMapping:",t),"vec3 "+n+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+n+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}var $l=new L;function zx(){ge.getLuminanceCoefficients($l);let n=$l.x.toFixed(4),t=$l.y.toFixed(4),e=$l.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${n}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Vx(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(wo).join(`
`)}function Hx(n){let t=[];for(let e in n){let i=n[e];i!==!1&&t.push("#define "+e+" "+i)}return t.join(`
`)}function Gx(n,t){let e={},i=n.getProgramParameter(t,n.ACTIVE_ATTRIBUTES);for(let s=0;s<i;s++){let r=n.getActiveAttrib(t,s),o=r.name,a=1;r.type===n.FLOAT_MAT2&&(a=2),r.type===n.FLOAT_MAT3&&(a=3),r.type===n.FLOAT_MAT4&&(a=4),e[o]={type:r.type,location:n.getAttribLocation(t,o),locationSize:a}}return e}function wo(n){return n!==""}function Bf(n,t){let e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return n.replace(/NUM_SUN_LIGHTS/g,t.numSunLights).replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,t.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function kf(n,t){return n.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}var Wx=/^[ \t]*#include +<([\w\d./]+)>/gm;function tu(n){return n.replace(Wx,qx)}var Xx=new Map;function qx(n,t){let e=he[t];if(e===void 0){let i=Xx.get(t);if(i!==void 0)e=he[i],Ht('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,i);else throw new Error("THREE.WebGLProgram: Can not resolve #include <"+t+">")}return tu(e)}var Yx=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function zf(n){return n.replace(Yx,Zx)}function Zx(n,t,e,i){let s="";for(let r=parseInt(t);r<parseInt(e);r++)s+=i.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function Vf(n){let t=`precision ${n.precision} float;
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
#define LOW_PRECISION`),t}var Jx={[po]:"SHADOWMAP_TYPE_PCF",[yr]:"SHADOWMAP_TYPE_VSM"};function $x(n){return Jx[n.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}var Kx={[ls]:"ENVMAP_TYPE_CUBE",[Rs]:"ENVMAP_TYPE_CUBE",[go]:"ENVMAP_TYPE_CUBE_UV"};function jx(n){return n.envMap===!1?"ENVMAP_TYPE_CUBE":Kx[n.envMapMode]||"ENVMAP_TYPE_CUBE"}var Qx={[Rs]:"ENVMAP_MODE_REFRACTION"};function ty(n){return n.envMap===!1?"ENVMAP_MODE_REFLECTION":Qx[n.envMapMode]||"ENVMAP_MODE_REFLECTION"}var ey={[gh]:"ENVMAP_BLENDING_MULTIPLY",[sf]:"ENVMAP_BLENDING_MIX",[rf]:"ENVMAP_BLENDING_ADD"};function ny(n){return n.envMap===!1?"ENVMAP_BLENDING_NONE":ey[n.combine]||"ENVMAP_BLENDING_NONE"}function iy(n){let t=n.envMapCubeUVHeight;if(t===null)return null;let e=Math.log2(t)-2,i=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),112)),texelHeight:i,maxMip:e}}function sy(n,t,e,i){let s=n.getContext(),r=e.defines,o=e.vertexShader,a=e.fragmentShader,l=$x(e),c=jx(e),u=ty(e),d=ny(e),h=iy(e),f=Vx(e),m=Hx(r),x=s.createProgram(),g,p,S=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(g=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m].filter(wo).join(`
`),g.length>0&&(g+=`
`),p=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m].filter(wo).join(`
`),p.length>0&&(p+=`
`)):(g=[Vf(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+u:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexNormals?"#define HAS_NORMAL":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(wo).join(`
`),p=[Vf(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+c:"",e.envMap?"#define "+u:"",e.envMap?"#define "+d:"",h?"#define CUBEUV_TEXEL_WIDTH "+h.texelWidth:"",h?"#define CUBEUV_TEXEL_HEIGHT "+h.texelHeight:"",h?"#define CUBEUV_MAX_MIP "+h.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.retroreflection?"#define USE_RETROREFLECTION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor?"#define USE_COLOR":"",e.vertexAlphas||e.batchingColor?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.numLightProbeGrids>0?"#define USE_LIGHT_PROBES_GRID":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==ti?"#define TONE_MAPPING":"",e.toneMapping!==ti?he.tonemapping_pars_fragment:"",e.toneMapping!==ti?kx("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",he.colorspace_pars_fragment,Ox("linearToOutputTexel",e.outputColorSpace),zx(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(wo).join(`
`)),o=tu(o),o=Bf(o,e),o=kf(o,e),a=tu(a),a=Bf(a,e),a=kf(a,e),o=zf(o),a=zf(a),e.isRawShaderMaterial!==!0&&(S=`#version 300 es
`,g=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+g,p=["#define varying in",e.glslVersion===Ih?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===Ih?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);let A=S+g+o,M=S+p+a,T=Uf(s,s.VERTEX_SHADER,A),b=Uf(s,s.FRAGMENT_SHADER,M);s.attachShader(x,T),s.attachShader(x,b),e.index0AttributeName!==void 0?s.bindAttribLocation(x,0,e.index0AttributeName):e.hasPositionAttribute===!0&&s.bindAttribLocation(x,0,"position"),s.linkProgram(x);function C(F){if(n.debug.checkShaderErrors){let B=s.getProgramInfoLog(x)||"",V=s.getShaderInfoLog(T)||"",I=s.getShaderInfoLog(b)||"",k=B.trim(),W=V.trim(),J=I.trim(),et=!0,U=!0;if(s.getProgramParameter(x,s.LINK_STATUS)===!1)if(et=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(s,x,T,b);else{let q=Of(s,T,"vertex"),j=Of(s,b,"fragment");Zt("WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(x,s.VALIDATE_STATUS)+`

Material Name: `+F.name+`
Material Type: `+F.type+`

Program Info Log: `+k+`
`+q+`
`+j)}else k!==""?Ht("WebGLProgram: Program Info Log:",k):(W===""||J==="")&&(U=!1);U&&(F.diagnostics={runnable:et,programLog:k,vertexShader:{log:W,prefix:g},fragmentShader:{log:J,prefix:p}})}s.deleteShader(T),s.deleteShader(b),y=new wr(s,x),w=Gx(s,x)}let y;this.getUniforms=function(){return y===void 0&&C(this),y};let w;this.getAttributes=function(){return w===void 0&&C(this),w};let P=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return P===!1&&(P=s.getProgramParameter(x,Dx)),P},this.destroy=function(){i.releaseStatesOfProgram(this),s.deleteProgram(x),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=Nx++,this.cacheKey=t,this.usedTimes=1,this.program=x,this.vertexShader=T,this.fragmentShader=b,this}var ry=0,eu=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t,e,i){let s=this._getShaderCacheForMaterial(t);return s.has(e)===!1&&(s.add(e),e.usedTimes++),s.has(i)===!1&&(s.add(i),i.usedTimes++),this}remove(t){let e=this.materialCache.get(t);for(let i of e)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(t),this}getVertexShaderStage(t){return this._getShaderStage(t.vertexShader)}getFragmentShaderStage(t){return this._getShaderStage(t.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){let e=this.materialCache,i=e.get(t);return i===void 0&&(i=new Set,e.set(t,i)),i}_getShaderStage(t){let e=this.shaderCache,i=e.get(t);return i===void 0&&(i=new nu(t),e.set(t,i)),i}},nu=class{constructor(t){this.id=ry++,this.code=t,this.usedTimes=0}};function oy(n){return n===us||n===So||n===bo}function ay(n,t,e,i,s,r){let o=new Qr,a=new eu,l=new Set,c=[],u=new Map,d=i.logarithmicDepthBuffer,h=i.precision,f={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function m(y){return l.add(y),y===0?"uv":`uv${y}`}function x(y,w,P,F,B,V){let I=F.fog,k=B.geometry,W=y.isMeshStandardMaterial||y.isMeshLambertMaterial||y.isMeshPhongMaterial?F.environment:null,J=y.isMeshStandardMaterial||y.isMeshLambertMaterial&&!y.envMap||y.isMeshPhongMaterial&&!y.envMap,et=t.get(y.envMap||W,J),U=et&&et.mapping===go?et.image.height:null,q=f[y.type];y.precision!==null&&(h=i.getMaxPrecision(y.precision),h!==y.precision&&Ht("WebGLProgram.getParameters:",y.precision,"not supported, using",h,"instead."));let j=k.morphAttributes.position||k.morphAttributes.normal||k.morphAttributes.color,yt=j!==void 0?j.length:0,bt=0;k.morphAttributes.position!==void 0&&(bt=1),k.morphAttributes.normal!==void 0&&(bt=2),k.morphAttributes.color!==void 0&&(bt=3);let pe,Xt,Tt,Y;if(q){let Nt=vi[q];pe=Nt.vertexShader,Xt=Nt.fragmentShader}else{pe=y.vertexShader,Xt=y.fragmentShader;let Nt=a.getVertexShaderStage(y),$t=a.getFragmentShaderStage(y);a.update(y,Nt,$t),Tt=Nt.id,Y=$t.id}let K=n.getRenderTarget(),it=n.state.buffers.depth.getReversed(),Rt=B.isInstancedMesh===!0,ot=B.isBatchedMesh===!0,ut=!!y.map,qt=!!y.matcap,Ot=!!et,Gt=!!y.aoMap,Bt=!!y.lightMap,Dt=!!y.bumpMap&&y.wireframe===!1,Qt=!!y.normalMap,ue=!!y.displacementMap,be=!!y.emissiveMap,Kt=!!y.metalnessMap,le=!!y.roughnessMap,R=y.anisotropy>0,ee=y.clearcoat>0,Pt=y.dispersion>0,E=y.retroreflectivity>0,_=y.iridescence>0,O=y.sheen>0,z=y.transmission>0,Z=R&&!!y.anisotropyMap,st=ee&&!!y.clearcoatMap,rt=ee&&!!y.clearcoatNormalMap,$=ee&&!!y.clearcoatRoughnessMap,Q=_&&!!y.iridescenceMap,at=_&&!!y.iridescenceThicknessMap,Ut=O&&!!y.sheenColorMap,dt=O&&!!y.sheenRoughnessMap,ct=!!y.specularMap,It=!!y.specularColorMap,Vt=!!y.specularIntensityMap,kt=z&&!!y.transmissionMap,N=z&&!!y.thicknessMap,ht=!!y.gradientMap,tt=!!y.alphaMap,lt=y.alphaTest>0,mt=!!y.alphaHash,nt=!!y.extensions,xt=ti;y.toneMapped&&(K===null||K.isXRRenderTarget===!0)&&(xt=n.toneMapping);let Et={shaderID:q,shaderType:y.type,shaderName:y.name,vertexShader:pe,fragmentShader:Xt,defines:y.defines,customVertexShaderID:Tt,customFragmentShaderID:Y,isRawShaderMaterial:y.isRawShaderMaterial===!0,glslVersion:y.glslVersion,precision:h,batching:ot,batchingColor:ot&&B._colorsTexture!==null,instancing:Rt,instancingColor:Rt&&B.instanceColor!==null,instancingMorph:Rt&&B.morphTexture!==null,outputColorSpace:K===null?n.outputColorSpace:K.isXRRenderTarget===!0?K.texture.colorSpace:ge.workingColorSpace,alphaToCoverage:!!y.alphaToCoverage,map:ut,matcap:qt,envMap:Ot,envMapMode:Ot&&et.mapping,envMapCubeUVHeight:U,aoMap:Gt,lightMap:Bt,bumpMap:Dt,normalMap:Qt,displacementMap:ue,emissiveMap:be,normalMapObjectSpace:Qt&&y.normalMapType===lf,normalMapTangentSpace:Qt&&y.normalMapType===ql,packedNormalMap:Qt&&y.normalMapType===ql&&oy(y.normalMap.format),metalnessMap:Kt,roughnessMap:le,anisotropy:R,anisotropyMap:Z,clearcoat:ee,clearcoatMap:st,clearcoatNormalMap:rt,clearcoatRoughnessMap:$,dispersion:Pt,retroreflection:E,iridescence:_,iridescenceMap:Q,iridescenceThicknessMap:at,sheen:O,sheenColorMap:Ut,sheenRoughnessMap:dt,specularMap:ct,specularColorMap:It,specularIntensityMap:Vt,transmission:z,transmissionMap:kt,thicknessMap:N,gradientMap:ht,opaque:y.transparent===!1&&y.blending===vr&&y.alphaToCoverage===!1,alphaMap:tt,alphaTest:lt,alphaHash:mt,combine:y.combine,mapUv:ut&&m(y.map.channel),aoMapUv:Gt&&m(y.aoMap.channel),lightMapUv:Bt&&m(y.lightMap.channel),bumpMapUv:Dt&&m(y.bumpMap.channel),normalMapUv:Qt&&m(y.normalMap.channel),displacementMapUv:ue&&m(y.displacementMap.channel),emissiveMapUv:be&&m(y.emissiveMap.channel),metalnessMapUv:Kt&&m(y.metalnessMap.channel),roughnessMapUv:le&&m(y.roughnessMap.channel),anisotropyMapUv:Z&&m(y.anisotropyMap.channel),clearcoatMapUv:st&&m(y.clearcoatMap.channel),clearcoatNormalMapUv:rt&&m(y.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:$&&m(y.clearcoatRoughnessMap.channel),iridescenceMapUv:Q&&m(y.iridescenceMap.channel),iridescenceThicknessMapUv:at&&m(y.iridescenceThicknessMap.channel),sheenColorMapUv:Ut&&m(y.sheenColorMap.channel),sheenRoughnessMapUv:dt&&m(y.sheenRoughnessMap.channel),specularMapUv:ct&&m(y.specularMap.channel),specularColorMapUv:It&&m(y.specularColorMap.channel),specularIntensityMapUv:Vt&&m(y.specularIntensityMap.channel),transmissionMapUv:kt&&m(y.transmissionMap.channel),thicknessMapUv:N&&m(y.thicknessMap.channel),alphaMapUv:tt&&m(y.alphaMap.channel),vertexTangents:!!k.attributes.tangent&&(Qt||R),vertexNormals:!!k.attributes.normal,vertexColors:y.vertexColors,vertexAlphas:y.vertexColors===!0&&!!k.attributes.color&&k.attributes.color.itemSize===4,pointsUvs:B.isPoints===!0&&!!k.attributes.uv&&(ut||tt),fog:!!I,useFog:y.fog===!0,fogExp2:!!I&&I.isFogExp2,flatShading:y.wireframe===!1&&(y.flatShading===!0||k.attributes.normal===void 0&&Qt===!1&&(y.isMeshLambertMaterial||y.isMeshPhongMaterial||y.isMeshStandardMaterial||y.isMeshPhysicalMaterial)),sizeAttenuation:y.sizeAttenuation===!0,logarithmicDepthBuffer:d,reversedDepthBuffer:it,skinning:B.isSkinnedMesh===!0,hasPositionAttribute:k.attributes.position!==void 0,morphTargets:k.morphAttributes.position!==void 0,morphNormals:k.morphAttributes.normal!==void 0,morphColors:k.morphAttributes.color!==void 0,morphTargetsCount:yt,morphTextureStride:bt,numSunLights:w.sun.length,numDirLights:w.directional.length,numPointLights:w.point.length,numSpotLights:w.spot.length,numSpotLightMaps:w.spotLightMap.length,numRectAreaLights:w.rectArea.length,numHemiLights:w.hemi.length,numSunLightShadows:w.sunShadowMap.length,numDirLightShadows:w.directionalShadowMap.length,numPointLightShadows:w.pointShadowMap.length,numSpotLightShadows:w.spotShadowMap.length,numSpotLightShadowsWithMaps:w.numSpotLightShadowsWithMaps,numLightProbes:w.numLightProbes,numLightProbeGrids:V.length,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:y.dithering,shadowMapEnabled:n.shadowMap.enabled&&P.length>0,shadowMapType:n.shadowMap.type,toneMapping:xt,decodeVideoTexture:ut&&y.map.isVideoTexture===!0&&ge.getTransfer(y.map.colorSpace)===Se,decodeVideoTextureEmissive:be&&y.emissiveMap.isVideoTexture===!0&&ge.getTransfer(y.emissiveMap.colorSpace)===Se,premultipliedAlpha:y.premultipliedAlpha,doubleSided:y.side===Wn,flipSided:y.side===pn,useDepthPacking:y.depthPacking>=0,depthPacking:y.depthPacking||0,index0AttributeName:y.index0AttributeName,extensionClipCullDistance:nt&&y.extensions.clipCullDistance===!0&&e.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(nt&&y.extensions.multiDraw===!0||ot)&&e.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:e.has("KHR_parallel_shader_compile"),customProgramCacheKey:y.customProgramCacheKey()};return Et.vertexUv1s=l.has(1),Et.vertexUv2s=l.has(2),Et.vertexUv3s=l.has(3),l.clear(),Et}function g(y){let w=[];if(y.shaderID?w.push(y.shaderID):(w.push(y.customVertexShaderID),w.push(y.customFragmentShaderID)),y.defines!==void 0)for(let P in y.defines)w.push(P),w.push(y.defines[P]);return y.isRawShaderMaterial===!1&&(p(w,y),S(w,y),w.push(n.outputColorSpace)),w.push(y.customProgramCacheKey),w.join()}function p(y,w){y.push(w.precision),y.push(w.outputColorSpace),y.push(w.envMapMode),y.push(w.envMapCubeUVHeight),y.push(w.mapUv),y.push(w.alphaMapUv),y.push(w.lightMapUv),y.push(w.aoMapUv),y.push(w.bumpMapUv),y.push(w.normalMapUv),y.push(w.displacementMapUv),y.push(w.emissiveMapUv),y.push(w.metalnessMapUv),y.push(w.roughnessMapUv),y.push(w.anisotropyMapUv),y.push(w.clearcoatMapUv),y.push(w.clearcoatNormalMapUv),y.push(w.clearcoatRoughnessMapUv),y.push(w.iridescenceMapUv),y.push(w.iridescenceThicknessMapUv),y.push(w.sheenColorMapUv),y.push(w.sheenRoughnessMapUv),y.push(w.specularMapUv),y.push(w.specularColorMapUv),y.push(w.specularIntensityMapUv),y.push(w.transmissionMapUv),y.push(w.thicknessMapUv),y.push(w.combine),y.push(w.fogExp2),y.push(w.sizeAttenuation),y.push(w.morphTargetsCount),y.push(w.morphAttributeCount),y.push(w.numSunLights),y.push(w.numDirLights),y.push(w.numPointLights),y.push(w.numSpotLights),y.push(w.numSpotLightMaps),y.push(w.numHemiLights),y.push(w.numRectAreaLights),y.push(w.numSunLightShadows),y.push(w.numDirLightShadows),y.push(w.numPointLightShadows),y.push(w.numSpotLightShadows),y.push(w.numSpotLightShadowsWithMaps),y.push(w.numLightProbes),y.push(w.shadowMapType),y.push(w.toneMapping),y.push(w.numClippingPlanes),y.push(w.numClipIntersection),y.push(w.depthPacking)}function S(y,w){o.disableAll(),w.instancing&&o.enable(0),w.instancingColor&&o.enable(1),w.instancingMorph&&o.enable(2),w.matcap&&o.enable(3),w.envMap&&o.enable(4),w.normalMapObjectSpace&&o.enable(5),w.normalMapTangentSpace&&o.enable(6),w.clearcoat&&o.enable(7),w.iridescence&&o.enable(8),w.alphaTest&&o.enable(9),w.vertexColors&&o.enable(10),w.vertexAlphas&&o.enable(11),w.vertexUv1s&&o.enable(12),w.vertexUv2s&&o.enable(13),w.vertexUv3s&&o.enable(14),w.vertexTangents&&o.enable(15),w.anisotropy&&o.enable(16),w.alphaHash&&o.enable(17),w.batching&&o.enable(18),w.dispersion&&o.enable(19),w.retroreflection&&o.enable(24),w.batchingColor&&o.enable(20),w.gradientMap&&o.enable(21),w.packedNormalMap&&o.enable(22),w.vertexNormals&&o.enable(23),y.push(o.mask),o.disableAll(),w.fog&&o.enable(0),w.useFog&&o.enable(1),w.flatShading&&o.enable(2),w.logarithmicDepthBuffer&&o.enable(3),w.reversedDepthBuffer&&o.enable(4),w.skinning&&o.enable(5),w.morphTargets&&o.enable(6),w.morphNormals&&o.enable(7),w.morphColors&&o.enable(8),w.premultipliedAlpha&&o.enable(9),w.shadowMapEnabled&&o.enable(10),w.doubleSided&&o.enable(11),w.flipSided&&o.enable(12),w.useDepthPacking&&o.enable(13),w.dithering&&o.enable(14),w.transmission&&o.enable(15),w.sheen&&o.enable(16),w.opaque&&o.enable(17),w.pointsUvs&&o.enable(18),w.decodeVideoTexture&&o.enable(19),w.decodeVideoTextureEmissive&&o.enable(20),w.alphaToCoverage&&o.enable(21),w.numLightProbeGrids>0&&o.enable(22),w.hasPositionAttribute&&o.enable(23),y.push(o.mask)}function A(y){let w=f[y.type],P;if(w){let F=vi[w];P=Sf.clone(F.uniforms)}else P=y.uniforms;return P}function M(y,w){let P=u.get(w);return P!==void 0?++P.usedTimes:(P=new sy(n,w,y,s),c.push(P),u.set(w,P)),P}function T(y){if(--y.usedTimes===0){let w=c.indexOf(y);c[w]=c[c.length-1],c.pop(),u.delete(y.cacheKey),y.destroy()}}function b(y){a.remove(y)}function C(){a.dispose()}return{getParameters:x,getProgramCacheKey:g,getUniforms:A,acquireProgram:M,releaseProgram:T,releaseShaderCache:b,programs:c,dispose:C}}function ly(){let n=new WeakMap;function t(o){return n.has(o)}function e(o){let a=n.get(o);return a===void 0&&(a={},n.set(o,a)),a}function i(o){n.delete(o)}function s(o,a,l){n.get(o)[a]=l}function r(){n=new WeakMap}return{has:t,get:e,remove:i,update:s,dispose:r}}function cy(n,t){return n.groupOrder!==t.groupOrder?n.groupOrder-t.groupOrder:n.renderOrder!==t.renderOrder?n.renderOrder-t.renderOrder:n.material.id!==t.material.id?n.material.id-t.material.id:n.materialVariant!==t.materialVariant?n.materialVariant-t.materialVariant:n.z!==t.z?n.z-t.z:n.id-t.id}function Hf(n,t){return n.groupOrder!==t.groupOrder?n.groupOrder-t.groupOrder:n.renderOrder!==t.renderOrder?n.renderOrder-t.renderOrder:n.z!==t.z?t.z-n.z:n.id-t.id}function Gf(){let n=[],t=0,e=[],i=[],s=[];function r(){t=0,e.length=0,i.length=0,s.length=0}function o(h){let f=0;return h.isInstancedMesh&&(f+=2),h.isSkinnedMesh&&(f+=1),f}function a(h,f,m,x,g,p){let S=n[t];return S===void 0?(S={id:h.id,object:h,geometry:f,material:m,materialVariant:o(h),groupOrder:x,renderOrder:h.renderOrder,z:g,group:p},n[t]=S):(S.id=h.id,S.object=h,S.geometry=f,S.material=m,S.materialVariant=o(h),S.groupOrder=x,S.renderOrder=h.renderOrder,S.z=g,S.group=p),t++,S}function l(h,f,m,x,g,p,S){S.reversedDepth===!0&&(g=-g);let A=a(h,f,m,x,g,p);m.transmission>0?i.push(A):m.transparent===!0?s.push(A):e.push(A)}function c(h,f,m,x,g,p){let S=a(h,f,m,x,g,p);m.transmission>0?i.unshift(S):m.transparent===!0?s.unshift(S):e.unshift(S)}function u(h,f){e.length>1&&e.sort(h||cy),i.length>1&&i.sort(f||Hf),s.length>1&&s.sort(f||Hf)}function d(){for(let h=t,f=n.length;h<f;h++){let m=n[h];if(m.id===null)break;m.id=null,m.object=null,m.geometry=null,m.material=null,m.group=null}}return{opaque:e,transmissive:i,transparent:s,init:r,push:l,unshift:c,finish:d,sort:u}}function hy(){let n=new WeakMap;function t(i,s){let r=n.get(i),o;return r===void 0?(o=new Gf,n.set(i,[o])):s>=r.length?(o=new Gf,r.push(o)):o=r[s],o}function e(){n=new WeakMap}return{get:t,dispose:e}}function uy(){let n={};return{get:function(t){if(n[t.id]!==void 0)return n[t.id];let e;switch(t.type){case"SunLight":case"DirectionalLight":e={direction:new L,color:new oe};break;case"SpotLight":e={position:new L,direction:new L,color:new oe,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new L,color:new oe,distance:0,decay:0};break;case"HemisphereLight":e={direction:new L,skyColor:new oe,groundColor:new oe};break;case"RectAreaLight":e={color:new oe,position:new L,halfWidth:new L,halfHeight:new L};break}return n[t.id]=e,e}}}function dy(){let n={};return{get:function(t){if(n[t.id]!==void 0)return n[t.id];let e;switch(t.type){case"SunLight":case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Yt};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Yt};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Yt,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[t.id]=e,e}}}var fy=0;function py(n,t){return(t.castShadow?2:0)-(n.castShadow?2:0)+(t.map?1:0)-(n.map?1:0)}function my(n){let t=new uy,e=dy(),i={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)i.probe.push(new L);let s=new L,r=new De,o=new De;function a(c){let u=0,d=0,h=0;for(let B=0;B<9;B++)i.probe[B].set(0,0,0);let f=0,m=0,x=0,g=0,p=0,S=0,A=0,M=0,T=0,b=0,C=0,y=0,w=0,P=0;c.sort(py);for(let B=0,V=c.length;B<V;B++){let I=c[B],k=I.color,W=I.intensity,J=I.distance,et=null;if(I.shadow&&I.shadow.map&&(I.shadow.map.texture.format===us?et=I.shadow.map.texture:et=I.shadow.map.depthTexture||I.shadow.map.texture),I.isAmbientLight)u+=k.r*W,d+=k.g*W,h+=k.b*W;else if(I.isLightProbe){for(let U=0;U<9;U++)i.probe[U].addScaledVector(I.sh.coefficients[U],W);P++}else if(I.isSunLight){let U=t.get(I);if(U.color.copy(I.color).multiplyScalar(I.intensity),I.castShadow){let q=I.shadow,j=e.get(I);j.shadowIntensity=q.intensity,j.shadowBias=q.bias,j.shadowNormalBias=q.normalBias,j.shadowRadius=q.radius,j.shadowMapSize.copy(q.mapSize).multiply(q.getFrameExtents()),i.sunShadow[m]=j,i.sunShadowMap[m]=et;let yt=q.getViewportCount();for(let bt=0;bt<yt;bt++)i.sunShadowMatrix[x+bt]=q.getMatrix(bt),i.sunShadowCascade[x+bt]=q._cascadeData[bt];x+=yt,m++}i.sun[f]=U,f++}else if(I.isDirectionalLight){let U=t.get(I);if(U.color.copy(I.color).multiplyScalar(I.intensity),I.castShadow){let q=I.shadow,j=e.get(I);j.shadowIntensity=q.intensity,j.shadowBias=q.bias,j.shadowNormalBias=q.normalBias,j.shadowRadius=q.radius,j.shadowMapSize=q.mapSize,i.directionalShadow[g]=j,i.directionalShadowMap[g]=et,i.directionalShadowMatrix[g]=I.shadow.matrix,T++}i.directional[g]=U,g++}else if(I.isSpotLight){let U=t.get(I);U.position.setFromMatrixPosition(I.matrixWorld),U.color.copy(k).multiplyScalar(W),U.distance=J,U.coneCos=Math.cos(I.angle),U.penumbraCos=Math.cos(I.angle*(1-I.penumbra)),U.decay=I.decay,i.spot[S]=U;let q=I.shadow;if(I.map&&(i.spotLightMap[y]=I.map,y++,q.updateMatrices(I),I.castShadow&&w++),i.spotLightMatrix[S]=q.matrix,I.castShadow){let j=e.get(I);j.shadowIntensity=q.intensity,j.shadowBias=q.bias,j.shadowNormalBias=q.normalBias,j.shadowRadius=q.radius,j.shadowMapSize=q.mapSize,i.spotShadow[S]=j,i.spotShadowMap[S]=et,C++}S++}else if(I.isRectAreaLight){let U=t.get(I);U.color.copy(k).multiplyScalar(W),U.halfWidth.set(I.width*.5,0,0),U.halfHeight.set(0,I.height*.5,0),i.rectArea[A]=U,A++}else if(I.isPointLight){let U=t.get(I);if(U.color.copy(I.color).multiplyScalar(I.intensity),U.distance=I.distance,U.decay=I.decay,I.castShadow){let q=I.shadow,j=e.get(I);j.shadowIntensity=q.intensity,j.shadowBias=q.bias,j.shadowNormalBias=q.normalBias,j.shadowRadius=q.radius,j.shadowMapSize=q.mapSize,j.shadowCameraNear=q.camera.near,j.shadowCameraFar=q.camera.far,i.pointShadow[p]=j,i.pointShadowMap[p]=et,i.pointShadowMatrix[p]=I.shadow.matrix,b++}i.point[p]=U,p++}else if(I.isHemisphereLight){let U=t.get(I);U.skyColor.copy(I.color).multiplyScalar(W),U.groundColor.copy(I.groundColor).multiplyScalar(W),i.hemi[M]=U,M++}}A>0&&(n.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=pt.LTC_FLOAT_1,i.rectAreaLTC2=pt.LTC_FLOAT_2):(i.rectAreaLTC1=pt.LTC_HALF_1,i.rectAreaLTC2=pt.LTC_HALF_2)),i.ambient[0]=u,i.ambient[1]=d,i.ambient[2]=h;let F=i.hash;(F.sunLength!==f||F.directionalLength!==g||F.pointLength!==p||F.spotLength!==S||F.rectAreaLength!==A||F.hemiLength!==M||F.numSunShadows!==m||F.numDirectionalShadows!==T||F.numPointShadows!==b||F.numSpotShadows!==C||F.numSpotMaps!==y||F.numLightProbes!==P)&&(i.sun.length=f,i.directional.length=g,i.spot.length=S,i.rectArea.length=A,i.point.length=p,i.hemi.length=M,i.sunShadow.length=m,i.sunShadowMap.length=m,i.sunShadowMatrix.length=x,i.sunShadowCascade.length=x,i.directionalShadow.length=T,i.directionalShadowMap.length=T,i.directionalShadowMatrix.length=T,i.pointShadow.length=b,i.pointShadowMap.length=b,i.pointShadowMatrix.length=b,i.spotShadow.length=C,i.spotShadowMap.length=C,i.spotLightMatrix.length=C+y-w,i.spotLightMap.length=y,i.numSpotLightShadowsWithMaps=w,i.numLightProbes=P,F.sunLength=f,F.directionalLength=g,F.pointLength=p,F.spotLength=S,F.rectAreaLength=A,F.hemiLength=M,F.numSunShadows=m,F.numDirectionalShadows=T,F.numPointShadows=b,F.numSpotShadows=C,F.numSpotMaps=y,F.numLightProbes=P,i.version=fy++)}function l(c,u){let d=0,h=0,f=0,m=0,x=0,g=0,p=u.matrixWorldInverse;for(let S=0,A=c.length;S<A;S++){let M=c[S];if(M.isSunLight){let T=i.sun[d];T.direction.setFromMatrixPosition(M.matrixWorld),T.direction.transformDirection(p),d++}else if(M.isDirectionalLight){let T=i.directional[h];T.direction.setFromMatrixPosition(M.matrixWorld),s.setFromMatrixPosition(M.target.matrixWorld),T.direction.sub(s),T.direction.transformDirection(p),h++}else if(M.isSpotLight){let T=i.spot[m];T.position.setFromMatrixPosition(M.matrixWorld),T.position.applyMatrix4(p),T.direction.setFromMatrixPosition(M.matrixWorld),s.setFromMatrixPosition(M.target.matrixWorld),T.direction.sub(s),T.direction.transformDirection(p),m++}else if(M.isRectAreaLight){let T=i.rectArea[x];T.position.setFromMatrixPosition(M.matrixWorld),T.position.applyMatrix4(p),o.identity(),r.copy(M.matrixWorld),r.premultiply(p),o.extractRotation(r),T.halfWidth.set(M.width*.5,0,0),T.halfHeight.set(0,M.height*.5,0),T.halfWidth.applyMatrix4(o),T.halfHeight.applyMatrix4(o),x++}else if(M.isPointLight){let T=i.point[f];T.position.setFromMatrixPosition(M.matrixWorld),T.position.applyMatrix4(p),f++}else if(M.isHemisphereLight){let T=i.hemi[g];T.direction.setFromMatrixPosition(M.matrixWorld),T.direction.transformDirection(p),g++}}}return{setup:a,setupView:l,state:i}}function Wf(n){let t=new my(n),e=[],i=[],s=[];function r(h){d.camera=h,e.length=0,i.length=0,s.length=0}function o(h){e.push(h)}function a(h){i.push(h)}function l(h){s.push(h)}function c(){t.setup(e)}function u(h){t.setupView(e,h)}let d={lightsArray:e,shadowsArray:i,lightProbeGridArray:s,camera:null,lights:t,transmissionRenderTarget:{},textureUnits:0};return{init:r,state:d,setupLights:c,setupLightsView:u,pushLight:o,pushShadow:a,pushLightProbeGrid:l}}function gy(n){let t=new WeakMap;function e(s,r=0){let o=t.get(s),a;return o===void 0?(a=new Wf(n),t.set(s,[a])):r>=o.length?(a=new Wf(n),o.push(a)):a=o[r],a}function i(){t=new WeakMap}return{get:e,dispose:i}}var _y=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,xy=`uniform sampler2D shadow_pass;
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
}`,yy=[new L(1,0,0),new L(-1,0,0),new L(0,1,0),new L(0,-1,0),new L(0,0,1),new L(0,0,-1)],vy=[new L(0,-1,0),new L(0,-1,0),new L(0,0,1),new L(0,0,-1),new L(0,-1,0),new L(0,-1,0)],Xf=new De,Eo=new L,Jh=new L;function My(n,t,e){let i=new dr,s=new Yt,r=new Yt,o=new Ne,a=new Xa,l=new qa,c={},u=e.maxTextureSize,d={[as]:pn,[pn]:as,[Wn]:Wn},h=new Nn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Yt},radius:{value:4}},vertexShader:_y,fragmentShader:xy}),f=h.clone();f.defines.HORIZONTAL_PASS=1;let m=new Ge;m.setAttribute("position",new Gn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let x=new un(m,h),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=po;let p=this.type;this.render=function(b,C,y){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||b.length===0)return;this.type===Bd&&(Ht("WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead."),this.type=po);let w=n.getRenderTarget(),P=n.getActiveCubeFace(),F=n.getActiveMipmapLevel(),B=n.state;B.setBlending(xi),B.buffers.depth.getReversed()===!0?B.buffers.color.setClear(0,0,0,0):B.buffers.color.setClear(1,1,1,1),B.buffers.depth.setTest(!0),B.setScissorTest(!1);let V=p!==this.type;V&&C.traverse(function(I){I.material&&(Array.isArray(I.material)?I.material.forEach(k=>k.needsUpdate=!0):I.material.needsUpdate=!0)});for(let I=0,k=b.length;I<k;I++){let W=b[I],J=W.shadow;if(J===void 0){Ht("WebGLShadowMap:",W,"has no shadow.");continue}if(J.autoUpdate===!1&&J.needsUpdate===!1)continue;s.copy(J.mapSize);let et=J.getFrameExtents();s.multiply(et),r.copy(J.mapSize),(s.x>u||s.y>u)&&(s.x>u&&(r.x=Math.floor(u/et.x),s.x=r.x*et.x,J.mapSize.x=r.x),s.y>u&&(r.y=Math.floor(u/et.y),s.y=r.y*et.y,J.mapSize.y=r.y));let U=n.state.buffers.depth.getReversed();if(J.camera._reversedDepth=U,J.map===null||V===!0){if(J.map!==null&&(J.map.depthTexture!==null&&(J.map.depthTexture.dispose(),J.map.depthTexture=null),J.map.dispose()),this.type===yr){if(W.isPointLight){Ht("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}J.map=new Mn(s.x,s.y,{format:us,type:ii,minFilter:je,magFilter:je,generateMipmaps:!1}),J.map.texture.name=W.name+".shadowMap",J.map.depthTexture=new Qi(s.x,s.y,ni),J.map.depthTexture.name=W.name+".shadowMapDepth",J.map.depthTexture.format=gi,J.map.depthTexture.compareFunction=null,J.map.depthTexture.minFilter=$e,J.map.depthTexture.magFilter=$e}else W.isPointLight?(J.map=new jl(s.x),J.map.depthTexture=new Ha(s.x,ei)):(J.map=new Mn(s.x,s.y),J.map.depthTexture=new Qi(s.x,s.y,ei)),J.map.depthTexture.name=W.name+".shadowMap",J.map.depthTexture.format=gi,this.type===po?(J.map.depthTexture.compareFunction=U?Zl:Yl,J.map.depthTexture.minFilter=je,J.map.depthTexture.magFilter=je):(J.map.depthTexture.compareFunction=null,J.map.depthTexture.minFilter=$e,J.map.depthTexture.magFilter=$e);J.camera.updateProjectionMatrix()}J.map.isWebGLCubeRenderTarget!==!0&&(J.map.width!==s.x||J.map.height!==s.y)&&J.map.setSize(s.x,s.y);let q=J.map.isWebGLCubeRenderTarget?6:J.getViewportCount();W.isPointLight!==!0&&J.updateMatrices(W,y);for(let j=0;j<q;j++){let yt=J.getCamera(j);if(W.isPointLight){let bt=J.camera,pe=J.matrix,Xt=W.distance||bt.far;Xt!==bt.far&&(bt.far=Xt,bt.updateProjectionMatrix()),Eo.setFromMatrixPosition(W.matrixWorld),bt.position.copy(Eo),Jh.copy(bt.position),Jh.add(yy[j]),bt.up.copy(vy[j]),bt.lookAt(Jh),bt.updateMatrixWorld(),pe.makeTranslation(-Eo.x,-Eo.y,-Eo.z),Xf.multiplyMatrices(bt.projectionMatrix,bt.matrixWorldInverse),J._frustum.setFromProjectionMatrix(Xf,bt.coordinateSystem,bt.reversedDepth)}if(J.map.isWebGLCubeRenderTarget)n.setRenderTarget(J.map,j),n.clear();else{j===0&&(n.setRenderTarget(J.map),n.clear());let bt=J.getViewport(j);o.set(r.x*bt.x,r.y*bt.y,r.x*bt.z,r.y*bt.w),B.viewport(o)}i=J.getFrustum(j),M(C,y,yt,W,this.type)}J.isPointLightShadow!==!0&&this.type===yr&&S(J,y),J.needsUpdate=!1}p=this.type,g.needsUpdate=!1,n.setRenderTarget(w,P,F)};function S(b,C){let y=t.update(x);h.defines.VSM_SAMPLES!==b.blurSamples&&(h.defines.VSM_SAMPLES=b.blurSamples,f.defines.VSM_SAMPLES=b.blurSamples,h.needsUpdate=!0,f.needsUpdate=!0),b.mapPass===null?b.mapPass=new Mn(s.x,s.y,{format:us,type:ii}):(b.mapPass.width!==b.map.width||b.mapPass.height!==b.map.height)&&b.mapPass.setSize(b.map.width,b.map.height),h.uniforms.shadow_pass.value=b.map.depthTexture,h.uniforms.resolution.value.set(b.map.width,b.map.height),h.uniforms.radius.value=b.radius,n.setRenderTarget(b.mapPass),n.clear(),n.renderBufferDirect(C,null,y,h,x,null),f.uniforms.shadow_pass.value=b.mapPass.texture,f.uniforms.resolution.value.set(b.map.width,b.map.height),f.uniforms.radius.value=b.radius,n.setRenderTarget(b.map),n.clear(),n.renderBufferDirect(C,null,y,f,x,null)}function A(b,C,y,w){let P=null,F=y.isPointLight===!0?b.customDistanceMaterial:b.customDepthMaterial;if(F!==void 0)P=F;else if(P=y.isPointLight===!0?l:a,n.localClippingEnabled&&C.clipShadows===!0&&Array.isArray(C.clippingPlanes)&&C.clippingPlanes.length!==0||C.displacementMap&&C.displacementScale!==0||C.alphaMap&&C.alphaTest>0||C.map&&C.alphaTest>0||C.alphaToCoverage===!0){let B=P.uuid,V=C.uuid,I=c[B];I===void 0&&(I={},c[B]=I);let k=I[V];k===void 0&&(k=P.clone(),I[V]=k,C.addEventListener("dispose",T)),P=k}if(P.visible=C.visible,P.wireframe=C.wireframe,w===yr?P.side=C.shadowSide!==null?C.shadowSide:C.side:P.side=C.shadowSide!==null?C.shadowSide:d[C.side],P.alphaMap=C.alphaMap,P.alphaTest=C.alphaToCoverage===!0?.5:C.alphaTest,P.map=C.map,P.clipShadows=C.clipShadows,P.clippingPlanes=C.clippingPlanes,P.clipIntersection=C.clipIntersection,P.displacementMap=C.displacementMap,P.displacementScale=C.displacementScale,P.displacementBias=C.displacementBias,P.wireframeLinewidth=C.wireframeLinewidth,P.linewidth=C.linewidth,y.isPointLight===!0&&P.isMeshDistanceMaterial===!0){let B=n.properties.get(P);B.light=y}return P}function M(b,C,y,w,P){if(b.visible===!1)return;if(b.layers.test(C.layers)&&(b.isMesh||b.isLine||b.isPoints)&&(b.castShadow||b.receiveShadow&&P===yr)&&(!b.frustumCulled||b.intersectsFrustum(i))){b.modelViewMatrix.multiplyMatrices(y.matrixWorldInverse,b.matrixWorld);let V=t.update(b),I=b.material;if(Array.isArray(I)){let k=V.groups;for(let W=0,J=k.length;W<J;W++){let et=k[W],U=I[et.materialIndex];if(U&&U.visible){let q=A(b,U,w,P);b.onBeforeShadow(n,b,C,y,V,q,et),n.renderBufferDirect(y,null,V,q,b,et),b.onAfterShadow(n,b,C,y,V,q,et)}}}else if(I.visible){let k=A(b,I,w,P);b.onBeforeShadow(n,b,C,y,V,k,null),n.renderBufferDirect(y,null,V,k,b,null),b.onAfterShadow(n,b,C,y,V,k,null)}}let B=b.children;for(let V=0,I=B.length;V<I;V++)M(B[V],C,y,w,P)}function T(b){b.target.removeEventListener("dispose",T);for(let y in c){let w=c[y],P=b.target.uuid;P in w&&(w[P].dispose(),delete w[P])}}}function Sy(n,t){function e(){let N=!1,ht=new Ne,tt=null,lt=new Ne(0,0,0,0);return{setMask:function(mt){tt!==mt&&!N&&(n.colorMask(mt,mt,mt,mt),tt=mt)},setLocked:function(mt){N=mt},setClear:function(mt,nt,xt,Et,Nt){Nt===!0&&(mt*=Et,nt*=Et,xt*=Et),ht.set(mt,nt,xt,Et),lt.equals(ht)===!1&&(n.clearColor(mt,nt,xt,Et),lt.copy(ht))},reset:function(){N=!1,tt=null,lt.set(-1,0,0,0)}}}function i(){let N=!1,ht=!1,tt=null,lt=null,mt=null;return{setReversed:function(nt){if(ht!==nt){let xt=t.get("EXT_clip_control");nt?xt.clipControlEXT(xt.LOWER_LEFT_EXT,xt.ZERO_TO_ONE_EXT):xt.clipControlEXT(xt.LOWER_LEFT_EXT,xt.NEGATIVE_ONE_TO_ONE_EXT),ht=nt;let Et=mt;mt=null,this.setClear(Et)}},getReversed:function(){return ht},setTest:function(nt){nt?K(n.DEPTH_TEST):it(n.DEPTH_TEST)},setMask:function(nt){tt!==nt&&!N&&(n.depthMask(nt),tt=nt)},setFunc:function(nt){if(ht&&(nt=vf[nt]),lt!==nt){switch(nt){case wa:n.depthFunc(n.NEVER);break;case Aa:n.depthFunc(n.ALWAYS);break;case Ca:n.depthFunc(n.LESS);break;case rr:n.depthFunc(n.LEQUAL);break;case Ra:n.depthFunc(n.EQUAL);break;case Pa:n.depthFunc(n.GEQUAL);break;case Ia:n.depthFunc(n.GREATER);break;case La:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}lt=nt}},setLocked:function(nt){N=nt},setClear:function(nt){mt!==nt&&(mt=nt,ht&&(nt=1-nt),n.clearDepth(nt))},reset:function(){N=!1,tt=null,lt=null,mt=null,ht=!1}}}function s(){let N=!1,ht=null,tt=null,lt=null,mt=null,nt=null,xt=null,Et=null,Nt=null;return{setTest:function($t){N||($t?K(n.STENCIL_TEST):it(n.STENCIL_TEST))},setMask:function($t){ht!==$t&&!N&&(n.stencilMask($t),ht=$t)},setFunc:function($t,On,An){(tt!==$t||lt!==On||mt!==An)&&(n.stencilFunc($t,On,An),tt=$t,lt=On,mt=An)},setOp:function($t,On,An){(nt!==$t||xt!==On||Et!==An)&&(n.stencilOp($t,On,An),nt=$t,xt=On,Et=An)},setLocked:function($t){N=$t},setClear:function($t){Nt!==$t&&(n.clearStencil($t),Nt=$t)},reset:function(){N=!1,ht=null,tt=null,lt=null,mt=null,nt=null,xt=null,Et=null,Nt=null}}}let r=new e,o=new i,a=new s,l=new WeakMap,c=new WeakMap,u={},d={},h={},f=new WeakMap,m=[],x=null,g=!1,p=null,S=null,A=null,M=null,T=null,b=null,C=null,y=new oe(0,0,0),w=0,P=!1,F=null,B=null,V=null,I=null,k=null,W=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS),J=!1,et=0,U=n.getParameter(n.VERSION);U.indexOf("WebGL")!==-1?(et=parseFloat(/^WebGL (\d)/.exec(U)[1]),J=et>=1):U.indexOf("OpenGL ES")!==-1&&(et=parseFloat(/^OpenGL ES (\d)/.exec(U)[1]),J=et>=2);let q=null,j={},yt=n.getParameter(n.SCISSOR_BOX),bt=n.getParameter(n.VIEWPORT),pe=new Ne().fromArray(yt),Xt=new Ne().fromArray(bt);function Tt(N,ht,tt,lt){let mt=new Uint8Array(4),nt=n.createTexture();n.bindTexture(N,nt),n.texParameteri(N,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(N,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let xt=0;xt<tt;xt++)N===n.TEXTURE_3D||N===n.TEXTURE_2D_ARRAY?n.texImage3D(ht,0,n.RGBA,1,1,lt,0,n.RGBA,n.UNSIGNED_BYTE,mt):n.texImage2D(ht+xt,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,mt);return nt}let Y={};Y[n.TEXTURE_2D]=Tt(n.TEXTURE_2D,n.TEXTURE_2D,1),Y[n.TEXTURE_CUBE_MAP]=Tt(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),Y[n.TEXTURE_2D_ARRAY]=Tt(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),Y[n.TEXTURE_3D]=Tt(n.TEXTURE_3D,n.TEXTURE_3D,1,1),r.setClear(0,0,0,1),o.setClear(1),a.setClear(0),K(n.DEPTH_TEST),o.setFunc(rr),Dt(!1),Qt(hh),K(n.CULL_FACE),Gt(xi);function K(N){u[N]!==!0&&(n.enable(N),u[N]=!0)}function it(N){u[N]!==!1&&(n.disable(N),u[N]=!1)}function Rt(N,ht){return h[N]!==ht?(n.bindFramebuffer(N,ht),h[N]=ht,N===n.DRAW_FRAMEBUFFER&&(h[n.FRAMEBUFFER]=ht),N===n.FRAMEBUFFER&&(h[n.DRAW_FRAMEBUFFER]=ht),!0):!1}function ot(N,ht){let tt=m,lt=!1;if(N){tt=f.get(ht),tt===void 0&&(tt=[],f.set(ht,tt));let mt=N.textures;if(tt.length!==mt.length||tt[0]!==n.COLOR_ATTACHMENT0){for(let nt=0,xt=mt.length;nt<xt;nt++)tt[nt]=n.COLOR_ATTACHMENT0+nt;tt.length=mt.length,lt=!0}}else tt[0]!==n.BACK&&(tt[0]=n.BACK,lt=!0);lt&&n.drawBuffers(tt)}function ut(N){return x!==N?(n.useProgram(N),x=N,!0):!1}let qt={[Cs]:n.FUNC_ADD,[zd]:n.FUNC_SUBTRACT,[Vd]:n.FUNC_REVERSE_SUBTRACT};qt[Hd]=n.MIN,qt[Gd]=n.MAX;let Ot={[Wd]:n.ZERO,[Xd]:n.ONE,[qd]:n.SRC_COLOR,[ph]:n.SRC_ALPHA,[jd]:n.SRC_ALPHA_SATURATE,[$d]:n.DST_COLOR,[Zd]:n.DST_ALPHA,[Yd]:n.ONE_MINUS_SRC_COLOR,[mh]:n.ONE_MINUS_SRC_ALPHA,[Kd]:n.ONE_MINUS_DST_COLOR,[Jd]:n.ONE_MINUS_DST_ALPHA,[Qd]:n.CONSTANT_COLOR,[tf]:n.ONE_MINUS_CONSTANT_COLOR,[ef]:n.CONSTANT_ALPHA,[nf]:n.ONE_MINUS_CONSTANT_ALPHA};function Gt(N,ht,tt,lt,mt,nt,xt,Et,Nt,$t){if(N===xi){g===!0&&(it(n.BLEND),g=!1);return}if(g===!1&&(K(n.BLEND),g=!0),N!==kd){if(N!==p||$t!==P){if((S!==Cs||T!==Cs)&&(n.blendEquation(n.FUNC_ADD),S=Cs,T=Cs),$t)switch(N){case vr:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case uh:n.blendFunc(n.ONE,n.ONE);break;case dh:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case fh:n.blendFuncSeparate(n.DST_COLOR,n.ONE_MINUS_SRC_ALPHA,n.ZERO,n.ONE);break;default:Zt("WebGLState: Invalid blending: ",N);break}else switch(N){case vr:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case uh:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE,n.ONE,n.ONE);break;case dh:Zt("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case fh:Zt("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:Zt("WebGLState: Invalid blending: ",N);break}A=null,M=null,b=null,C=null,y.set(0,0,0),w=0,p=N,P=$t}return}mt=mt||ht,nt=nt||tt,xt=xt||lt,(ht!==S||mt!==T)&&(n.blendEquationSeparate(qt[ht],qt[mt]),S=ht,T=mt),(tt!==A||lt!==M||nt!==b||xt!==C)&&(n.blendFuncSeparate(Ot[tt],Ot[lt],Ot[nt],Ot[xt]),A=tt,M=lt,b=nt,C=xt),(Et.equals(y)===!1||Nt!==w)&&(n.blendColor(Et.r,Et.g,Et.b,Nt),y.copy(Et),w=Nt),p=N,P=!1}function Bt(N,ht){N.side===Wn?it(n.CULL_FACE):K(n.CULL_FACE);let tt=N.side===pn;ht&&(tt=!tt),Dt(tt),N.blending===vr&&N.transparent===!1?Gt(xi):Gt(N.blending,N.blendEquation,N.blendSrc,N.blendDst,N.blendEquationAlpha,N.blendSrcAlpha,N.blendDstAlpha,N.blendColor,N.blendAlpha,N.premultipliedAlpha),o.setFunc(N.depthFunc),o.setTest(N.depthTest),o.setMask(N.depthWrite),r.setMask(N.colorWrite);let lt=N.stencilWrite;a.setTest(lt),lt&&(a.setMask(N.stencilWriteMask),a.setFunc(N.stencilFunc,N.stencilRef,N.stencilFuncMask),a.setOp(N.stencilFail,N.stencilZFail,N.stencilZPass)),be(N.polygonOffset,N.polygonOffsetFactor,N.polygonOffsetUnits),N.alphaToCoverage===!0?K(n.SAMPLE_ALPHA_TO_COVERAGE):it(n.SAMPLE_ALPHA_TO_COVERAGE)}function Dt(N){F!==N&&(N?n.frontFace(n.CW):n.frontFace(n.CCW),F=N)}function Qt(N){N!==Fd?(K(n.CULL_FACE),N!==B&&(N===hh?n.cullFace(n.BACK):N===Od?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):it(n.CULL_FACE),B=N}function ue(N){N!==V&&(J&&n.lineWidth(N),V=N)}function be(N,ht,tt){N?(K(n.POLYGON_OFFSET_FILL),(I!==ht||k!==tt)&&(I=ht,k=tt,o.getReversed()&&(ht=-ht),n.polygonOffset(ht,tt))):it(n.POLYGON_OFFSET_FILL)}function Kt(N){N?K(n.SCISSOR_TEST):it(n.SCISSOR_TEST)}function le(N){N===void 0&&(N=n.TEXTURE0+W-1),q!==N&&(n.activeTexture(N),q=N)}function R(N,ht,tt){tt===void 0&&(q===null?tt=n.TEXTURE0+W-1:tt=q);let lt=j[tt];lt===void 0&&(lt={type:void 0,texture:void 0},j[tt]=lt),(lt.type!==N||lt.texture!==ht)&&(q!==tt&&(n.activeTexture(tt),q=tt),n.bindTexture(N,ht||Y[N]),lt.type=N,lt.texture=ht)}function ee(){let N=j[q];N!==void 0&&N.type!==void 0&&(n.bindTexture(N.type,null),N.type=void 0,N.texture=void 0)}function Pt(){try{n.compressedTexImage2D(...arguments)}catch(N){Zt("WebGLState:",N)}}function E(){try{n.compressedTexImage3D(...arguments)}catch(N){Zt("WebGLState:",N)}}function _(){try{n.texSubImage2D(...arguments)}catch(N){Zt("WebGLState:",N)}}function O(){try{n.texSubImage3D(...arguments)}catch(N){Zt("WebGLState:",N)}}function z(){try{n.compressedTexSubImage2D(...arguments)}catch(N){Zt("WebGLState:",N)}}function Z(){try{n.compressedTexSubImage3D(...arguments)}catch(N){Zt("WebGLState:",N)}}function st(){try{n.texStorage2D(...arguments)}catch(N){Zt("WebGLState:",N)}}function rt(){try{n.texStorage3D(...arguments)}catch(N){Zt("WebGLState:",N)}}function $(){try{n.texImage2D(...arguments)}catch(N){Zt("WebGLState:",N)}}function Q(){try{n.texImage3D(...arguments)}catch(N){Zt("WebGLState:",N)}}function at(N){return d[N]!==void 0?d[N]:n.getParameter(N)}function Ut(N,ht){d[N]!==ht&&(n.pixelStorei(N,ht),d[N]=ht)}function dt(N){pe.equals(N)===!1&&(n.scissor(N.x,N.y,N.z,N.w),pe.copy(N))}function ct(N){Xt.equals(N)===!1&&(n.viewport(N.x,N.y,N.z,N.w),Xt.copy(N))}function It(N,ht){let tt=c.get(ht);tt===void 0&&(tt=new WeakMap,c.set(ht,tt));let lt=tt.get(N);lt===void 0&&(lt=n.getUniformBlockIndex(ht,N.name),tt.set(N,lt))}function Vt(N,ht){let lt=c.get(ht).get(N);l.get(ht)!==lt&&(n.uniformBlockBinding(ht,lt,N.__bindingPointIndex),l.set(ht,lt))}function kt(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),o.setReversed(!1),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),n.pixelStorei(n.PACK_ALIGNMENT,4),n.pixelStorei(n.UNPACK_ALIGNMENT,4),n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,!1),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,n.BROWSER_DEFAULT_WEBGL),n.pixelStorei(n.PACK_ROW_LENGTH,0),n.pixelStorei(n.PACK_SKIP_PIXELS,0),n.pixelStorei(n.PACK_SKIP_ROWS,0),n.pixelStorei(n.UNPACK_ROW_LENGTH,0),n.pixelStorei(n.UNPACK_IMAGE_HEIGHT,0),n.pixelStorei(n.UNPACK_SKIP_PIXELS,0),n.pixelStorei(n.UNPACK_SKIP_ROWS,0),n.pixelStorei(n.UNPACK_SKIP_IMAGES,0),u={},d={},q=null,j={},h={},f=new WeakMap,m=[],x=null,g=!1,p=null,S=null,A=null,M=null,T=null,b=null,C=null,y=new oe(0,0,0),w=0,P=!1,F=null,B=null,V=null,I=null,k=null,pe.set(0,0,n.canvas.width,n.canvas.height),Xt.set(0,0,n.canvas.width,n.canvas.height),r.reset(),o.reset(),a.reset()}return{buffers:{color:r,depth:o,stencil:a},enable:K,disable:it,bindFramebuffer:Rt,drawBuffers:ot,useProgram:ut,setBlending:Gt,setMaterial:Bt,setFlipSided:Dt,setCullFace:Qt,setLineWidth:ue,setPolygonOffset:be,setScissorTest:Kt,activeTexture:le,bindTexture:R,unbindTexture:ee,compressedTexImage2D:Pt,compressedTexImage3D:E,texImage2D:$,texImage3D:Q,pixelStorei:Ut,getParameter:at,updateUBOMapping:It,uniformBlockBinding:Vt,texStorage2D:st,texStorage3D:rt,texSubImage2D:_,texSubImage3D:O,compressedTexSubImage2D:z,compressedTexSubImage3D:Z,scissor:dt,viewport:ct,reset:kt}}function by(n,t,e,i,s,r,o){let a=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new Yt,u=new WeakMap,d=new Set,h,f=new WeakMap,m=!1;try{m=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function x(E,_){return m?new OffscreenCanvas(E,_):Kr("canvas")}function g(E,_,O){let z=1,Z=Pt(E);if((Z.width>O||Z.height>O)&&(z=O/Math.max(Z.width,Z.height)),z<1)if(typeof HTMLImageElement<"u"&&E instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&E instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&E instanceof ImageBitmap||typeof VideoFrame<"u"&&E instanceof VideoFrame){let st=Math.floor(z*Z.width),rt=Math.floor(z*Z.height);h===void 0&&(h=x(st,rt));let $=_?x(st,rt):h;return $.width=st,$.height=rt,$.getContext("2d").drawImage(E,0,0,st,rt),Ht("WebGLRenderer: Texture has been resized from ("+Z.width+"x"+Z.height+") to ("+st+"x"+rt+")."),$}else return"data"in E&&Ht("WebGLRenderer: Image in DataTexture is too big ("+Z.width+"x"+Z.height+")."),E;return E}function p(E){return E.generateMipmaps}function S(E){n.generateMipmap(E)}function A(E){return E.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:E.isWebGL3DRenderTarget?n.TEXTURE_3D:E.isWebGLArrayRenderTarget||E.isCompressedArrayTexture?n.TEXTURE_2D_ARRAY:n.TEXTURE_2D}function M(E,_,O,z,Z,st=!1){if(E!==null){if(n[E]!==void 0)return n[E];Ht("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+E+"'")}let rt;z&&(rt=t.get("EXT_texture_norm16"),rt||Ht("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let $=_;if(_===n.RED&&(O===n.FLOAT&&($=n.R32F),O===n.HALF_FLOAT&&($=n.R16F),O===n.UNSIGNED_BYTE&&($=n.R8),O===n.UNSIGNED_SHORT&&rt&&($=rt.R16_EXT),O===n.SHORT&&rt&&($=rt.R16_SNORM_EXT)),_===n.RED_INTEGER&&(O===n.UNSIGNED_BYTE&&($=n.R8UI),O===n.UNSIGNED_SHORT&&($=n.R16UI),O===n.UNSIGNED_INT&&($=n.R32UI),O===n.BYTE&&($=n.R8I),O===n.SHORT&&($=n.R16I),O===n.INT&&($=n.R32I)),_===n.RG&&(O===n.FLOAT&&($=n.RG32F),O===n.HALF_FLOAT&&($=n.RG16F),O===n.UNSIGNED_BYTE&&($=n.RG8),O===n.UNSIGNED_SHORT&&rt&&($=rt.RG16_EXT),O===n.SHORT&&rt&&($=rt.RG16_SNORM_EXT)),_===n.RG_INTEGER&&(O===n.UNSIGNED_BYTE&&($=n.RG8UI),O===n.UNSIGNED_SHORT&&($=n.RG16UI),O===n.UNSIGNED_INT&&($=n.RG32UI),O===n.BYTE&&($=n.RG8I),O===n.SHORT&&($=n.RG16I),O===n.INT&&($=n.RG32I)),_===n.RGB_INTEGER&&(O===n.UNSIGNED_BYTE&&($=n.RGB8UI),O===n.UNSIGNED_SHORT&&($=n.RGB16UI),O===n.UNSIGNED_INT&&($=n.RGB32UI),O===n.BYTE&&($=n.RGB8I),O===n.SHORT&&($=n.RGB16I),O===n.INT&&($=n.RGB32I)),_===n.RGBA_INTEGER&&(O===n.UNSIGNED_BYTE&&($=n.RGBA8UI),O===n.UNSIGNED_SHORT&&($=n.RGBA16UI),O===n.UNSIGNED_INT&&($=n.RGBA32UI),O===n.BYTE&&($=n.RGBA8I),O===n.SHORT&&($=n.RGBA16I),O===n.INT&&($=n.RGBA32I)),_===n.RGB&&(O===n.UNSIGNED_SHORT&&rt&&($=rt.RGB16_EXT),O===n.SHORT&&rt&&($=rt.RGB16_SNORM_EXT),O===n.UNSIGNED_INT_5_9_9_9_REV&&($=n.RGB9_E5),O===n.UNSIGNED_INT_10F_11F_11F_REV&&($=n.R11F_G11F_B10F)),_===n.RGBA){let Q=st?$r:ge.getTransfer(Z);O===n.FLOAT&&($=n.RGBA32F),O===n.HALF_FLOAT&&($=n.RGBA16F),O===n.UNSIGNED_BYTE&&($=Q===Se?n.SRGB8_ALPHA8:n.RGBA8),O===n.UNSIGNED_SHORT&&rt&&($=rt.RGBA16_EXT),O===n.SHORT&&rt&&($=rt.RGBA16_SNORM_EXT),O===n.UNSIGNED_SHORT_4_4_4_4&&($=n.RGBA4),O===n.UNSIGNED_SHORT_5_5_5_1&&($=n.RGB5_A1)}return($===n.R16F||$===n.R32F||$===n.RG16F||$===n.RG32F||$===n.RGBA16F||$===n.RGBA32F)&&t.get("EXT_color_buffer_float"),$}function T(E,_){let O;return E?_===null||_===ei||_===Sr?O=n.DEPTH24_STENCIL8:_===ni?O=n.DEPTH32F_STENCIL8:_===Mr&&(O=n.DEPTH24_STENCIL8,Ht("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):_===null||_===ei||_===Sr?O=n.DEPTH_COMPONENT24:_===ni?O=n.DEPTH_COMPONENT32F:_===Mr&&(O=n.DEPTH_COMPONENT16),O}function b(E,_){return p(E)===!0||E.isFramebufferTexture&&E.minFilter!==$e&&E.minFilter!==je?Math.log2(Math.max(_.width,_.height))+1:E.mipmaps!==void 0&&E.mipmaps.length>0?E.mipmaps.length:E.isCompressedTexture&&Array.isArray(E.image)?_.mipmaps.length:1}function C(E){let _=E.target;_.removeEventListener("dispose",C),w(_),_.isVideoTexture&&u.delete(_),_.isHTMLTexture&&d.delete(_)}function y(E){let _=E.target;_.removeEventListener("dispose",y),F(_)}function w(E){let _=i.get(E);if(_.__webglInit===void 0)return;let O=E.source,z=f.get(O);if(z){let Z=z[_.__cacheKey];Z.usedTimes--,Z.usedTimes===0&&P(E),Object.keys(z).length===0&&f.delete(O)}i.remove(E)}function P(E){let _=i.get(E);n.deleteTexture(_.__webglTexture);let O=E.source,z=f.get(O);delete z[_.__cacheKey],o.memory.textures--}function F(E){let _=i.get(E);if(E.depthTexture&&(E.depthTexture.dispose(),i.remove(E.depthTexture)),E.isWebGLCubeRenderTarget)for(let z=0;z<6;z++){if(Array.isArray(_.__webglFramebuffer[z]))for(let Z=0;Z<_.__webglFramebuffer[z].length;Z++)n.deleteFramebuffer(_.__webglFramebuffer[z][Z]);else n.deleteFramebuffer(_.__webglFramebuffer[z]);_.__webglDepthbuffer&&n.deleteRenderbuffer(_.__webglDepthbuffer[z])}else{if(Array.isArray(_.__webglFramebuffer))for(let z=0;z<_.__webglFramebuffer.length;z++)n.deleteFramebuffer(_.__webglFramebuffer[z]);else n.deleteFramebuffer(_.__webglFramebuffer);if(_.__webglDepthbuffer&&n.deleteRenderbuffer(_.__webglDepthbuffer),_.__webglMultisampledFramebuffer&&n.deleteFramebuffer(_.__webglMultisampledFramebuffer),_.__webglColorRenderbuffer)for(let z=0;z<_.__webglColorRenderbuffer.length;z++)_.__webglColorRenderbuffer[z]&&n.deleteRenderbuffer(_.__webglColorRenderbuffer[z]);_.__webglDepthRenderbuffer&&n.deleteRenderbuffer(_.__webglDepthRenderbuffer)}let O=E.textures;for(let z=0,Z=O.length;z<Z;z++){let st=i.get(O[z]);st.__webglTexture&&(n.deleteTexture(st.__webglTexture),o.memory.textures--),i.remove(O[z])}i.remove(E)}let B=0;function V(){B=0}function I(){return B}function k(E){B=E}function W(){let E=B;return E>=s.maxTextures&&Ht("WebGLTextures: Trying to use "+(E+1)+" texture units while this GPU supports only "+s.maxTextures),B+=1,E}function J(E){let _=[];return _.push(E.wrapS),_.push(E.wrapT),_.push(E.wrapR||0),_.push(E.magFilter),_.push(E.minFilter),_.push(E.anisotropy),_.push(E.internalFormat),_.push(E.format),_.push(E.type),_.push(E.generateMipmaps),_.push(E.premultiplyAlpha),_.push(E.flipY),_.push(E.unpackAlignment),_.push(E.colorSpace),_.join()}function et(E,_){let O=i.get(E);if(E.isVideoTexture&&R(E),E.isRenderTargetTexture===!1&&E.isExternalTexture!==!0&&E.version>0&&O.__version!==E.version){let z=E.image;if(z===null)Ht("WebGLRenderer: Texture marked for update but no image data found.");else if(z.complete===!1)Ht("WebGLRenderer: Texture marked for update but image is incomplete");else{it(O,E,_);return}}else E.isExternalTexture&&(O.__webglTexture=E.sourceTexture?E.sourceTexture:null);e.bindTexture(n.TEXTURE_2D,O.__webglTexture,n.TEXTURE0+_)}function U(E,_){let O=i.get(E);if(E.isRenderTargetTexture===!1&&E.version>0&&O.__version!==E.version){it(O,E,_);return}else E.isExternalTexture&&(O.__webglTexture=E.sourceTexture?E.sourceTexture:null);e.bindTexture(n.TEXTURE_2D_ARRAY,O.__webglTexture,n.TEXTURE0+_)}function q(E,_){let O=i.get(E);if(E.isRenderTargetTexture===!1&&E.version>0&&O.__version!==E.version){it(O,E,_);return}e.bindTexture(n.TEXTURE_3D,O.__webglTexture,n.TEXTURE0+_)}function j(E,_){let O=i.get(E);if(E.isCubeDepthTexture!==!0&&E.version>0&&O.__version!==E.version){Rt(O,E,_);return}e.bindTexture(n.TEXTURE_CUBE_MAP,O.__webglTexture,n.TEXTURE0+_)}let yt={[Da]:n.REPEAT,[mi]:n.CLAMP_TO_EDGE,[Na]:n.MIRRORED_REPEAT},bt={[$e]:n.NEAREST,[of]:n.NEAREST_MIPMAP_NEAREST,[_o]:n.NEAREST_MIPMAP_LINEAR,[je]:n.LINEAR,[cl]:n.LINEAR_MIPMAP_NEAREST,[cs]:n.LINEAR_MIPMAP_LINEAR},pe={[hf]:n.NEVER,[mf]:n.ALWAYS,[uf]:n.LESS,[Yl]:n.LEQUAL,[df]:n.EQUAL,[Zl]:n.GEQUAL,[ff]:n.GREATER,[pf]:n.NOTEQUAL};function Xt(E,_){if(_.type===ni&&t.has("OES_texture_float_linear")===!1&&(_.magFilter===je||_.magFilter===cl||_.magFilter===_o||_.magFilter===cs||_.minFilter===je||_.minFilter===cl||_.minFilter===_o||_.minFilter===cs)&&Ht("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(E,n.TEXTURE_WRAP_S,yt[_.wrapS]),n.texParameteri(E,n.TEXTURE_WRAP_T,yt[_.wrapT]),(E===n.TEXTURE_3D||E===n.TEXTURE_2D_ARRAY)&&n.texParameteri(E,n.TEXTURE_WRAP_R,yt[_.wrapR]),n.texParameteri(E,n.TEXTURE_MAG_FILTER,bt[_.magFilter]),n.texParameteri(E,n.TEXTURE_MIN_FILTER,bt[_.minFilter]),_.compareFunction&&(n.texParameteri(E,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(E,n.TEXTURE_COMPARE_FUNC,pe[_.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(_.magFilter===$e||_.minFilter!==_o&&_.minFilter!==cs||_.type===ni&&t.has("OES_texture_float_linear")===!1)return;if(_.anisotropy>1||i.get(_).__currentAnisotropy){let O=t.get("EXT_texture_filter_anisotropic");n.texParameterf(E,O.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(_.anisotropy,s.getMaxAnisotropy())),i.get(_).__currentAnisotropy=_.anisotropy}}}function Tt(E,_){let O=!1;E.__webglInit===void 0&&(E.__webglInit=!0,_.addEventListener("dispose",C));let z=_.source,Z=f.get(z);Z===void 0&&(Z={},f.set(z,Z));let st=J(_);if(st!==E.__cacheKey){Z[st]===void 0&&(Z[st]={texture:n.createTexture(),usedTimes:0},o.memory.textures++,O=!0),Z[st].usedTimes++;let rt=Z[E.__cacheKey];rt!==void 0&&(Z[E.__cacheKey].usedTimes--,rt.usedTimes===0&&P(_)),E.__cacheKey=st,E.__webglTexture=Z[st].texture}return O}function Y(E,_,O){return Math.floor(Math.floor(E/O)/_)}function K(E,_,O,z){let st=E.updateRanges;if(st.length===0)e.texSubImage2D(n.TEXTURE_2D,0,0,0,_.width,_.height,O,z,_.data);else{st.sort((Ut,dt)=>Ut.start-dt.start);let rt=0;for(let Ut=1;Ut<st.length;Ut++){let dt=st[rt],ct=st[Ut],It=dt.start+dt.count,Vt=Y(ct.start,_.width,4),kt=Y(dt.start,_.width,4);ct.start<=It+1&&Vt===kt&&Y(ct.start+ct.count-1,_.width,4)===Vt?dt.count=Math.max(dt.count,ct.start+ct.count-dt.start):(++rt,st[rt]=ct)}st.length=rt+1;let $=e.getParameter(n.UNPACK_ROW_LENGTH),Q=e.getParameter(n.UNPACK_SKIP_PIXELS),at=e.getParameter(n.UNPACK_SKIP_ROWS);e.pixelStorei(n.UNPACK_ROW_LENGTH,_.width);for(let Ut=0,dt=st.length;Ut<dt;Ut++){let ct=st[Ut],It=Math.floor(ct.start/4),Vt=Math.ceil(ct.count/4),kt=It%_.width,N=Math.floor(It/_.width),ht=Vt,tt=1;e.pixelStorei(n.UNPACK_SKIP_PIXELS,kt),e.pixelStorei(n.UNPACK_SKIP_ROWS,N),e.texSubImage2D(n.TEXTURE_2D,0,kt,N,ht,tt,O,z,_.data)}E.clearUpdateRanges(),e.pixelStorei(n.UNPACK_ROW_LENGTH,$),e.pixelStorei(n.UNPACK_SKIP_PIXELS,Q),e.pixelStorei(n.UNPACK_SKIP_ROWS,at)}}function it(E,_,O){let z=n.TEXTURE_2D;(_.isDataArrayTexture||_.isCompressedArrayTexture)&&(z=n.TEXTURE_2D_ARRAY),_.isData3DTexture&&(z=n.TEXTURE_3D);let Z=Tt(E,_),st=_.source;e.bindTexture(z,E.__webglTexture,n.TEXTURE0+O);let rt=i.get(st);if(st.version!==rt.__version||Z===!0){if(e.activeTexture(n.TEXTURE0+O),(typeof ImageBitmap<"u"&&_.image instanceof ImageBitmap)===!1){let tt=ge.getPrimaries(ge.workingColorSpace),lt=_.colorSpace===Bi?null:ge.getPrimaries(_.colorSpace),mt=_.colorSpace===Bi||tt===lt?n.NONE:n.BROWSER_DEFAULT_WEBGL;e.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,_.flipY),e.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,_.premultiplyAlpha),e.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,mt)}e.pixelStorei(n.UNPACK_ALIGNMENT,_.unpackAlignment);let Q=g(_.image,!1,s.maxTextureSize);Q=ee(_,Q);let at=r.convert(_.format,_.colorSpace),Ut=r.convert(_.type),dt=M(_.internalFormat,at,Ut,_.normalized,_.colorSpace,_.isVideoTexture);Xt(z,_);let ct,It=_.mipmaps,Vt=_.isVideoTexture!==!0,kt=rt.__version===void 0||Z===!0,N=st.dataReady,ht=b(_,Q);if(_.isDepthTexture)dt=T(_.format===hs,_.type),kt&&(Vt?e.texStorage2D(n.TEXTURE_2D,1,dt,Q.width,Q.height):e.texImage2D(n.TEXTURE_2D,0,dt,Q.width,Q.height,0,at,Ut,null));else if(_.isDataTexture)if(It.length>0){Vt&&kt&&e.texStorage2D(n.TEXTURE_2D,ht,dt,It[0].width,It[0].height);for(let tt=0,lt=It.length;tt<lt;tt++)ct=It[tt],Vt?N&&e.texSubImage2D(n.TEXTURE_2D,tt,0,0,ct.width,ct.height,at,Ut,ct.data):e.texImage2D(n.TEXTURE_2D,tt,dt,ct.width,ct.height,0,at,Ut,ct.data);_.generateMipmaps=!1}else Vt?(kt&&e.texStorage2D(n.TEXTURE_2D,ht,dt,Q.width,Q.height),N&&K(_,Q,at,Ut)):e.texImage2D(n.TEXTURE_2D,0,dt,Q.width,Q.height,0,at,Ut,Q.data);else if(_.isCompressedTexture)if(_.isCompressedArrayTexture){Vt&&kt&&e.texStorage3D(n.TEXTURE_2D_ARRAY,ht,dt,It[0].width,It[0].height,Q.depth);for(let tt=0,lt=It.length;tt<lt;tt++)if(ct=It[tt],_.format!==Xn)if(at!==null)if(Vt){if(N)if(_.layerUpdates.size>0){let mt=Bh(ct.width,ct.height,_.format,_.type);for(let nt of _.layerUpdates){let xt=ct.data.subarray(nt*mt/ct.data.BYTES_PER_ELEMENT,(nt+1)*mt/ct.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,tt,0,0,nt,ct.width,ct.height,1,at,xt)}}else e.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,tt,0,0,0,ct.width,ct.height,Q.depth,at,ct.data)}else e.compressedTexImage3D(n.TEXTURE_2D_ARRAY,tt,dt,ct.width,ct.height,Q.depth,0,ct.data,0,0);else Ht("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Vt?N&&e.texSubImage3D(n.TEXTURE_2D_ARRAY,tt,0,0,0,ct.width,ct.height,Q.depth,at,Ut,ct.data):e.texImage3D(n.TEXTURE_2D_ARRAY,tt,dt,ct.width,ct.height,Q.depth,0,at,Ut,ct.data);_.layerUpdates.size>0&&_.clearLayerUpdates()}else{Vt&&kt&&e.texStorage2D(n.TEXTURE_2D,ht,dt,It[0].width,It[0].height);for(let tt=0,lt=It.length;tt<lt;tt++)ct=It[tt],_.format!==Xn?at!==null?Vt?N&&e.compressedTexSubImage2D(n.TEXTURE_2D,tt,0,0,ct.width,ct.height,at,ct.data):e.compressedTexImage2D(n.TEXTURE_2D,tt,dt,ct.width,ct.height,0,ct.data):Ht("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Vt?N&&e.texSubImage2D(n.TEXTURE_2D,tt,0,0,ct.width,ct.height,at,Ut,ct.data):e.texImage2D(n.TEXTURE_2D,tt,dt,ct.width,ct.height,0,at,Ut,ct.data)}else if(_.isDataArrayTexture)if(Vt){if(kt&&e.texStorage3D(n.TEXTURE_2D_ARRAY,ht,dt,Q.width,Q.height,Q.depth),N)if(_.layerUpdates.size>0){let tt=Bh(Q.width,Q.height,_.format,_.type);for(let lt of _.layerUpdates){let mt=Q.data.subarray(lt*tt/Q.data.BYTES_PER_ELEMENT,(lt+1)*tt/Q.data.BYTES_PER_ELEMENT);e.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,lt,Q.width,Q.height,1,at,Ut,mt)}_.clearLayerUpdates()}else e.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,Q.width,Q.height,Q.depth,at,Ut,Q.data)}else e.texImage3D(n.TEXTURE_2D_ARRAY,0,dt,Q.width,Q.height,Q.depth,0,at,Ut,Q.data);else if(_.isData3DTexture)Vt?(kt&&e.texStorage3D(n.TEXTURE_3D,ht,dt,Q.width,Q.height,Q.depth),N&&e.texSubImage3D(n.TEXTURE_3D,0,0,0,0,Q.width,Q.height,Q.depth,at,Ut,Q.data)):e.texImage3D(n.TEXTURE_3D,0,dt,Q.width,Q.height,Q.depth,0,at,Ut,Q.data);else if(_.isFramebufferTexture){if(kt)if(Vt)e.texStorage2D(n.TEXTURE_2D,ht,dt,Q.width,Q.height);else{let tt=Q.width,lt=Q.height;for(let mt=0;mt<ht;mt++)e.texImage2D(n.TEXTURE_2D,mt,dt,tt,lt,0,at,Ut,null),tt>>=1,lt>>=1}}else if(_.isHTMLTexture){if("texElementImage2D"in n){let tt=n.canvas;if(tt.hasAttribute("layoutsubtree")||tt.setAttribute("layoutsubtree","true"),Q.parentNode!==tt){tt.appendChild(Q),d.add(_),tt.onpaint=lt=>{let mt=lt.changedElements;for(let nt of d)mt.includes(nt.image)&&(nt.needsUpdate=!0)},tt.requestPaint();return}if(n.texElementImage2D.length===3)n.texElementImage2D(n.TEXTURE_2D,n.RGBA8,Q);else{let mt=n.RGBA,nt=n.RGBA,xt=n.UNSIGNED_BYTE;n.texElementImage2D(n.TEXTURE_2D,0,mt,nt,xt,Q)}n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MIN_FILTER,n.LINEAR),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_S,n.CLAMP_TO_EDGE),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_T,n.CLAMP_TO_EDGE)}}else if(It.length>0){if(Vt&&kt){let tt=Pt(It[0]);e.texStorage2D(n.TEXTURE_2D,ht,dt,tt.width,tt.height)}for(let tt=0,lt=It.length;tt<lt;tt++)ct=It[tt],Vt?N&&e.texSubImage2D(n.TEXTURE_2D,tt,0,0,at,Ut,ct):e.texImage2D(n.TEXTURE_2D,tt,dt,at,Ut,ct);_.generateMipmaps=!1}else if(Vt){if(kt){let tt=Pt(Q);e.texStorage2D(n.TEXTURE_2D,ht,dt,tt.width,tt.height)}N&&e.texSubImage2D(n.TEXTURE_2D,0,0,0,at,Ut,Q)}else e.texImage2D(n.TEXTURE_2D,0,dt,at,Ut,Q);p(_)&&S(z),rt.__version=st.version,_.onUpdate&&_.onUpdate(_)}E.__version=_.version}function Rt(E,_,O){if(_.image.length!==6)return;let z=Tt(E,_),Z=_.source;e.bindTexture(n.TEXTURE_CUBE_MAP,E.__webglTexture,n.TEXTURE0+O);let st=i.get(Z);if(Z.version!==st.__version||z===!0){e.activeTexture(n.TEXTURE0+O);let rt=ge.getPrimaries(ge.workingColorSpace),$=_.colorSpace===Bi?null:ge.getPrimaries(_.colorSpace),Q=_.colorSpace===Bi||rt===$?n.NONE:n.BROWSER_DEFAULT_WEBGL;e.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,_.flipY),e.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,_.premultiplyAlpha),e.pixelStorei(n.UNPACK_ALIGNMENT,_.unpackAlignment),e.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,Q);let at=_.isCompressedTexture||_.image[0].isCompressedTexture,Ut=_.image[0]&&_.image[0].isDataTexture,dt=[];for(let nt=0;nt<6;nt++)!at&&!Ut?dt[nt]=g(_.image[nt],!0,s.maxCubemapSize):dt[nt]=Ut?_.image[nt].image:_.image[nt],dt[nt]=ee(_,dt[nt]);let ct=dt[0],It=r.convert(_.format,_.colorSpace),Vt=r.convert(_.type),kt=M(_.internalFormat,It,Vt,_.normalized,_.colorSpace),N=_.isVideoTexture!==!0,ht=st.__version===void 0||z===!0,tt=Z.dataReady,lt=b(_,ct);Xt(n.TEXTURE_CUBE_MAP,_);let mt;if(at){N&&ht&&e.texStorage2D(n.TEXTURE_CUBE_MAP,lt,kt,ct.width,ct.height);for(let nt=0;nt<6;nt++){mt=dt[nt].mipmaps;for(let xt=0;xt<mt.length;xt++){let Et=mt[xt];_.format!==Xn?It!==null?N?tt&&e.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+nt,xt,0,0,Et.width,Et.height,It,Et.data):e.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+nt,xt,kt,Et.width,Et.height,0,Et.data):Ht("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):N?tt&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+nt,xt,0,0,Et.width,Et.height,It,Vt,Et.data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+nt,xt,kt,Et.width,Et.height,0,It,Vt,Et.data)}}}else{if(mt=_.mipmaps,N&&ht){mt.length>0&&lt++;let nt=Pt(dt[0]);e.texStorage2D(n.TEXTURE_CUBE_MAP,lt,kt,nt.width,nt.height)}for(let nt=0;nt<6;nt++)if(Ut){N?tt&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+nt,0,0,0,dt[nt].width,dt[nt].height,It,Vt,dt[nt].data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+nt,0,kt,dt[nt].width,dt[nt].height,0,It,Vt,dt[nt].data);for(let xt=0;xt<mt.length;xt++){let Nt=mt[xt].image[nt].image;N?tt&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+nt,xt+1,0,0,Nt.width,Nt.height,It,Vt,Nt.data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+nt,xt+1,kt,Nt.width,Nt.height,0,It,Vt,Nt.data)}}else{N?tt&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+nt,0,0,0,It,Vt,dt[nt]):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+nt,0,kt,It,Vt,dt[nt]);for(let xt=0;xt<mt.length;xt++){let Et=mt[xt];N?tt&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+nt,xt+1,0,0,It,Vt,Et.image[nt]):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+nt,xt+1,kt,It,Vt,Et.image[nt])}}}p(_)&&S(n.TEXTURE_CUBE_MAP),st.__version=Z.version,_.onUpdate&&_.onUpdate(_)}E.__version=_.version}function ot(E,_,O,z,Z,st){let rt=r.convert(O.format,O.colorSpace),$=r.convert(O.type),Q=M(O.internalFormat,rt,$,O.normalized,O.colorSpace),at=i.get(_),Ut=i.get(O);if(Ut.__renderTarget=_,!at.__hasExternalTextures){let dt=Math.max(1,_.width>>st),ct=Math.max(1,_.height>>st);Z===n.TEXTURE_3D||Z===n.TEXTURE_2D_ARRAY?e.texImage3D(Z,st,Q,dt,ct,_.depth,0,rt,$,null):e.texImage2D(Z,st,Q,dt,ct,0,rt,$,null)}e.bindFramebuffer(n.FRAMEBUFFER,E),le(_)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,z,Z,Ut.__webglTexture,0,Kt(_)):(Z===n.TEXTURE_2D||Z>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&Z<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,z,Z,Ut.__webglTexture,st),e.bindFramebuffer(n.FRAMEBUFFER,null)}function ut(E,_,O){if(n.bindRenderbuffer(n.RENDERBUFFER,E),_.depthBuffer){let z=_.depthTexture,Z=z&&z.isDepthTexture?z.type:null,st=T(_.stencilBuffer,Z),rt=_.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;le(_)?a.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,Kt(_),st,_.width,_.height):O?n.renderbufferStorageMultisample(n.RENDERBUFFER,Kt(_),st,_.width,_.height):n.renderbufferStorage(n.RENDERBUFFER,st,_.width,_.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,rt,n.RENDERBUFFER,E)}else{let z=_.textures;for(let Z=0;Z<z.length;Z++){let st=z[Z],rt=r.convert(st.format,st.colorSpace),$=r.convert(st.type),Q=M(st.internalFormat,rt,$,st.normalized,st.colorSpace);le(_)?a.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,Kt(_),Q,_.width,_.height):O?n.renderbufferStorageMultisample(n.RENDERBUFFER,Kt(_),Q,_.width,_.height):n.renderbufferStorage(n.RENDERBUFFER,Q,_.width,_.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function qt(E,_,O){let z=_.isWebGLCubeRenderTarget===!0;if(e.bindFramebuffer(n.FRAMEBUFFER,E),!(_.depthTexture&&_.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");let Z=i.get(_.depthTexture);if(Z.__renderTarget=_,(!Z.__webglTexture||_.depthTexture.image.width!==_.width||_.depthTexture.image.height!==_.height)&&(_.depthTexture.image.width=_.width,_.depthTexture.image.height=_.height,_.depthTexture.needsUpdate=!0),z){if(Z.__webglInit===void 0&&(Z.__webglInit=!0,_.depthTexture.addEventListener("dispose",C)),Z.__webglTexture===void 0){Z.__webglTexture=n.createTexture(),e.bindTexture(n.TEXTURE_CUBE_MAP,Z.__webglTexture),Xt(n.TEXTURE_CUBE_MAP,_.depthTexture);let at=r.convert(_.depthTexture.format),Ut=r.convert(_.depthTexture.type),dt;_.depthTexture.format===gi?dt=n.DEPTH_COMPONENT24:_.depthTexture.format===hs&&(dt=n.DEPTH24_STENCIL8);for(let ct=0;ct<6;ct++)n.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ct,0,dt,_.width,_.height,0,at,Ut,null)}}else et(_.depthTexture,0);let st=Z.__webglTexture,rt=Kt(_),$=z?n.TEXTURE_CUBE_MAP_POSITIVE_X+O:n.TEXTURE_2D,Q=_.depthTexture.format===hs?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;if(_.depthTexture.format===gi)le(_)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,Q,$,st,0,rt):n.framebufferTexture2D(n.FRAMEBUFFER,Q,$,st,0);else if(_.depthTexture.format===hs)le(_)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,Q,$,st,0,rt):n.framebufferTexture2D(n.FRAMEBUFFER,Q,$,st,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function Ot(E){let _=i.get(E),O=E.isWebGLCubeRenderTarget===!0;if(_.__boundDepthTexture!==E.depthTexture){let z=E.depthTexture;if(_.__depthDisposeCallback&&_.__depthDisposeCallback(),z){let Z=()=>{delete _.__boundDepthTexture,delete _.__depthDisposeCallback,z.removeEventListener("dispose",Z)};z.addEventListener("dispose",Z),_.__depthDisposeCallback=Z}_.__boundDepthTexture=z}if(E.depthTexture&&!_.__autoAllocateDepthBuffer)if(O)for(let z=0;z<6;z++)qt(_.__webglFramebuffer[z],E,z);else{let z=E.texture.mipmaps;z&&z.length>0?qt(_.__webglFramebuffer[0],E,0):qt(_.__webglFramebuffer,E,0)}else if(O){_.__webglDepthbuffer=[];for(let z=0;z<6;z++)if(e.bindFramebuffer(n.FRAMEBUFFER,_.__webglFramebuffer[z]),_.__webglDepthbuffer[z]===void 0)_.__webglDepthbuffer[z]=n.createRenderbuffer(),ut(_.__webglDepthbuffer[z],E,!1);else{let Z=E.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,st=_.__webglDepthbuffer[z];n.bindRenderbuffer(n.RENDERBUFFER,st),n.framebufferRenderbuffer(n.FRAMEBUFFER,Z,n.RENDERBUFFER,st)}}else{let z=E.texture.mipmaps;if(z&&z.length>0?e.bindFramebuffer(n.FRAMEBUFFER,_.__webglFramebuffer[0]):e.bindFramebuffer(n.FRAMEBUFFER,_.__webglFramebuffer),_.__webglDepthbuffer===void 0)_.__webglDepthbuffer=n.createRenderbuffer(),ut(_.__webglDepthbuffer,E,!1);else{let Z=E.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,st=_.__webglDepthbuffer;n.bindRenderbuffer(n.RENDERBUFFER,st),n.framebufferRenderbuffer(n.FRAMEBUFFER,Z,n.RENDERBUFFER,st)}}e.bindFramebuffer(n.FRAMEBUFFER,null)}function Gt(E,_,O){let z=i.get(E);_!==void 0&&ot(z.__webglFramebuffer,E,E.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),O!==void 0&&Ot(E)}function Bt(E){let _=E.texture,O=i.get(E),z=i.get(_);E.addEventListener("dispose",y);let Z=E.textures,st=E.isWebGLCubeRenderTarget===!0,rt=Z.length>1;if(rt||(z.__webglTexture===void 0&&(z.__webglTexture=n.createTexture()),z.__version=_.version,o.memory.textures++),st){O.__webglFramebuffer=[];for(let $=0;$<6;$++)if(_.mipmaps&&_.mipmaps.length>0){O.__webglFramebuffer[$]=[];for(let Q=0;Q<_.mipmaps.length;Q++)O.__webglFramebuffer[$][Q]=n.createFramebuffer()}else O.__webglFramebuffer[$]=n.createFramebuffer()}else{if(_.mipmaps&&_.mipmaps.length>0){O.__webglFramebuffer=[];for(let $=0;$<_.mipmaps.length;$++)O.__webglFramebuffer[$]=n.createFramebuffer()}else O.__webglFramebuffer=n.createFramebuffer();if(rt)for(let $=0,Q=Z.length;$<Q;$++){let at=i.get(Z[$]);at.__webglTexture===void 0&&(at.__webglTexture=n.createTexture(),o.memory.textures++)}if(E.samples>0&&le(E)===!1){O.__webglMultisampledFramebuffer=n.createFramebuffer(),O.__webglColorRenderbuffer=[],e.bindFramebuffer(n.FRAMEBUFFER,O.__webglMultisampledFramebuffer);for(let $=0;$<Z.length;$++){let Q=Z[$];O.__webglColorRenderbuffer[$]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,O.__webglColorRenderbuffer[$]);let at=r.convert(Q.format,Q.colorSpace),Ut=r.convert(Q.type),dt=M(Q.internalFormat,at,Ut,Q.normalized,Q.colorSpace,E.isXRRenderTarget===!0),ct=Kt(E);n.renderbufferStorageMultisample(n.RENDERBUFFER,ct,dt,E.width,E.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+$,n.RENDERBUFFER,O.__webglColorRenderbuffer[$])}n.bindRenderbuffer(n.RENDERBUFFER,null),E.depthBuffer&&(O.__webglDepthRenderbuffer=n.createRenderbuffer(),ut(O.__webglDepthRenderbuffer,E,!0)),e.bindFramebuffer(n.FRAMEBUFFER,null)}}if(st){e.bindTexture(n.TEXTURE_CUBE_MAP,z.__webglTexture),Xt(n.TEXTURE_CUBE_MAP,_);for(let $=0;$<6;$++)if(_.mipmaps&&_.mipmaps.length>0)for(let Q=0;Q<_.mipmaps.length;Q++)ot(O.__webglFramebuffer[$][Q],E,_,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+$,Q);else ot(O.__webglFramebuffer[$],E,_,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+$,0);p(_)&&S(n.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(rt){for(let $=0,Q=Z.length;$<Q;$++){let at=Z[$],Ut=i.get(at),dt=n.TEXTURE_2D;(E.isWebGL3DRenderTarget||E.isWebGLArrayRenderTarget)&&(dt=E.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),e.bindTexture(dt,Ut.__webglTexture),Xt(dt,at),ot(O.__webglFramebuffer,E,at,n.COLOR_ATTACHMENT0+$,dt,0),p(at)&&S(dt)}e.unbindTexture()}else{let $=n.TEXTURE_2D;if((E.isWebGL3DRenderTarget||E.isWebGLArrayRenderTarget)&&($=E.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),e.bindTexture($,z.__webglTexture),Xt($,_),_.mipmaps&&_.mipmaps.length>0)for(let Q=0;Q<_.mipmaps.length;Q++)ot(O.__webglFramebuffer[Q],E,_,n.COLOR_ATTACHMENT0,$,Q);else ot(O.__webglFramebuffer,E,_,n.COLOR_ATTACHMENT0,$,0);p(_)&&S($),e.unbindTexture()}E.depthBuffer&&Ot(E)}function Dt(E){let _=E.textures;for(let O=0,z=_.length;O<z;O++){let Z=_[O];if(p(Z)){let st=A(E),rt=i.get(Z).__webglTexture;e.bindTexture(st,rt),S(st),e.unbindTexture()}}}let Qt=[],ue=[];function be(E){if(E.samples>0){if(le(E)===!1){let _=E.textures,O=E.width,z=E.height,Z=n.COLOR_BUFFER_BIT,st=E.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,rt=i.get(E),$=_.length>1;if($)for(let at=0;at<_.length;at++)e.bindFramebuffer(n.FRAMEBUFFER,rt.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+at,n.RENDERBUFFER,null),e.bindFramebuffer(n.FRAMEBUFFER,rt.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+at,n.TEXTURE_2D,null,0);e.bindFramebuffer(n.READ_FRAMEBUFFER,rt.__webglMultisampledFramebuffer);let Q=E.texture.mipmaps;Q&&Q.length>0?e.bindFramebuffer(n.DRAW_FRAMEBUFFER,rt.__webglFramebuffer[0]):e.bindFramebuffer(n.DRAW_FRAMEBUFFER,rt.__webglFramebuffer);for(let at=0;at<_.length;at++){if(E.resolveDepthBuffer&&(E.depthBuffer&&(Z|=n.DEPTH_BUFFER_BIT),E.stencilBuffer&&E.resolveStencilBuffer&&(Z|=n.STENCIL_BUFFER_BIT)),$){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,rt.__webglColorRenderbuffer[at]);let Ut=i.get(_[at]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,Ut,0)}n.blitFramebuffer(0,0,O,z,0,0,O,z,Z,n.NEAREST),l===!0&&(Qt.length=0,ue.length=0,Qt.push(n.COLOR_ATTACHMENT0+at),E.depthBuffer&&E.storeMultisampledDepthBuffer===!1&&(Qt.push(st),ue.push(st),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,ue)),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,Qt))}if(e.bindFramebuffer(n.READ_FRAMEBUFFER,null),e.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),$)for(let at=0;at<_.length;at++){e.bindFramebuffer(n.FRAMEBUFFER,rt.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+at,n.RENDERBUFFER,rt.__webglColorRenderbuffer[at]);let Ut=i.get(_[at]).__webglTexture;e.bindFramebuffer(n.FRAMEBUFFER,rt.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+at,n.TEXTURE_2D,Ut,0)}e.bindFramebuffer(n.DRAW_FRAMEBUFFER,rt.__webglMultisampledFramebuffer)}else if(E.depthBuffer&&E.storeMultisampledDepthBuffer===!1&&l){let _=E.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[_])}}}function Kt(E){return Math.min(s.maxSamples,E.samples)}function le(E){let _=i.get(E);return E.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&_.__useRenderToTexture!==!1}function R(E){let _=o.render.frame;u.get(E)!==_&&(u.set(E,_),E.update())}function ee(E,_){let O=E.colorSpace,z=E.format,Z=E.type;return E.isCompressedTexture===!0||E.isVideoTexture===!0||O!==Jr&&O!==Bi&&(ge.getTransfer(O)===Se?(z!==Xn||Z!==bn)&&Ht("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):Zt("WebGLTextures: Unsupported texture color space:",O)),_}function Pt(E){return typeof HTMLImageElement<"u"&&E instanceof HTMLImageElement?(c.width=E.naturalWidth||E.width,c.height=E.naturalHeight||E.height):typeof VideoFrame<"u"&&E instanceof VideoFrame?(c.width=E.displayWidth,c.height=E.displayHeight):(c.width=E.width,c.height=E.height),c}this.allocateTextureUnit=W,this.resetTextureUnits=V,this.getTextureUnits=I,this.setTextureUnits=k,this.setTexture2D=et,this.setTexture2DArray=U,this.setTexture3D=q,this.setTextureCube=j,this.rebindTextures=Gt,this.setupRenderTarget=Bt,this.updateRenderTargetMipmap=Dt,this.updateMultisampleRenderTarget=be,this.setupDepthRenderbuffer=Ot,this.setupFrameBufferTexture=ot,this.useMultisampledRTT=le,this.isReversedDepthBuffer=function(){return e.buffers.depth.getReversed()}}function Ty(n,t){function e(i,s=Bi){let r,o=ge.getTransfer(s);if(i===bn)return n.UNSIGNED_BYTE;if(i===ul)return n.UNSIGNED_SHORT_4_4_4_4;if(i===dl)return n.UNSIGNED_SHORT_5_5_5_1;if(i===wh)return n.UNSIGNED_INT_5_9_9_9_REV;if(i===Ah)return n.UNSIGNED_INT_10F_11F_11F_REV;if(i===Th)return n.BYTE;if(i===Eh)return n.SHORT;if(i===Mr)return n.UNSIGNED_SHORT;if(i===hl)return n.INT;if(i===ei)return n.UNSIGNED_INT;if(i===ni)return n.FLOAT;if(i===ii)return n.HALF_FLOAT;if(i===Ch)return n.ALPHA;if(i===Rh)return n.RGB;if(i===Xn)return n.RGBA;if(i===gi)return n.DEPTH_COMPONENT;if(i===hs)return n.DEPTH_STENCIL;if(i===Ph)return n.RED;if(i===fl)return n.RED_INTEGER;if(i===us)return n.RG;if(i===pl)return n.RG_INTEGER;if(i===ml)return n.RGBA_INTEGER;if(i===xo||i===yo||i===vo||i===Mo)if(o===Se)if(r=t.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(i===xo)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===yo)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===vo)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===Mo)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=t.get("WEBGL_compressed_texture_s3tc"),r!==null){if(i===xo)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===yo)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===vo)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===Mo)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===gl||i===_l||i===xl||i===yl)if(r=t.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(i===gl)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===_l)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===xl)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===yl)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===vl||i===Ml||i===Sl||i===bl||i===Tl||i===So||i===El)if(r=t.get("WEBGL_compressed_texture_etc"),r!==null){if(i===vl||i===Ml)return o===Se?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(i===Sl)return o===Se?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC;if(i===bl)return r.COMPRESSED_R11_EAC;if(i===Tl)return r.COMPRESSED_SIGNED_R11_EAC;if(i===So)return r.COMPRESSED_RG11_EAC;if(i===El)return r.COMPRESSED_SIGNED_RG11_EAC}else return null;if(i===wl||i===Al||i===Cl||i===Rl||i===Pl||i===Il||i===Ll||i===Dl||i===Nl||i===Ul||i===Fl||i===Ol||i===Bl||i===kl)if(r=t.get("WEBGL_compressed_texture_astc"),r!==null){if(i===wl)return o===Se?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===Al)return o===Se?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===Cl)return o===Se?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===Rl)return o===Se?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===Pl)return o===Se?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===Il)return o===Se?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===Ll)return o===Se?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===Dl)return o===Se?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===Nl)return o===Se?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===Ul)return o===Se?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===Fl)return o===Se?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===Ol)return o===Se?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===Bl)return o===Se?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===kl)return o===Se?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===zl||i===Vl||i===Hl)if(r=t.get("EXT_texture_compression_bptc"),r!==null){if(i===zl)return o===Se?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===Vl)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===Hl)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===Gl||i===Wl||i===bo||i===Xl)if(r=t.get("EXT_texture_compression_rgtc"),r!==null){if(i===Gl)return r.COMPRESSED_RED_RGTC1_EXT;if(i===Wl)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===bo)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===Xl)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===Sr?n.UNSIGNED_INT_24_8:n[i]!==void 0?n[i]:null}return{convert:e}}var Ey=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,wy=`
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

}`,iu=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e){if(this.texture===null){let i=new so(t.texture);(t.depthNear!==e.depthNear||t.depthFar!==e.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=i}}getMesh(t){if(this.texture!==null&&this.mesh===null){let e=t.cameras[0].viewport,i=new Nn({vertexShader:Ey,fragmentShader:wy,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new un(new dn(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},su=class extends Qn{constructor(t,e){super();let i=this,s=null,r=1,o=null,a="local-floor",l=1,c=null,u=null,d=null,h=null,f=null,m=null,x=typeof XRWebGLBinding<"u",g=new iu,p={},S=e.getContextAttributes(),A=null,M=null,T=[],b=[],C=new Yt,y=null,w=null,P=new nn;P.viewport=new Ne;let F=new nn;F.viewport=new Ne;let B=[P,F],V=new rl,I=null,k=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Y){let K=T[Y];return K===void 0&&(K=new hr,T[Y]=K),K.getTargetRaySpace()},this.getControllerGrip=function(Y){let K=T[Y];return K===void 0&&(K=new hr,T[Y]=K),K.getGripSpace()},this.getHand=function(Y){let K=T[Y];return K===void 0&&(K=new hr,T[Y]=K),K.getHandSpace()};function W(Y){let K=b.indexOf(Y.inputSource);if(K===-1)return;let it=T[K];it!==void 0&&(it.update(Y.inputSource,Y.frame,c||o),it.dispatchEvent({type:Y.type,data:Y.inputSource}))}function J(){s.removeEventListener("select",W),s.removeEventListener("selectstart",W),s.removeEventListener("selectend",W),s.removeEventListener("squeeze",W),s.removeEventListener("squeezestart",W),s.removeEventListener("squeezeend",W),s.removeEventListener("end",J),s.removeEventListener("inputsourceschange",et);for(let Y=0;Y<T.length;Y++){let K=b[Y];K!==null&&(b[Y]=null,T[Y].disconnect(K))}I=null,k=null,g.reset();for(let Y in p)delete p[Y];if(t.setRenderTarget(A),f=null,h=null,d=null,s=null,M=null,Tt.stop(),i.isPresenting=!1,t.setPixelRatio(y),t.setSize(C.width,C.height,!1),w!==null){let Y=w.camera;Y.fov=w.fov,Y.zoom=w.zoom,Y.updateProjectionMatrix(),w=null}i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Y){r=Y,i.isPresenting===!0&&Ht("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Y){a=Y,i.isPresenting===!0&&Ht("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(Y){c=Y},this.getBaseLayer=function(){return h!==null?h:f},this.getBinding=function(){return d===null&&x&&(d=new XRWebGLBinding(s,e)),d},this.getFrame=function(){return m},this.getSession=function(){return s},this.setSession=async function(Y){if(s=Y,s!==null){if(A=t.getRenderTarget(),s.addEventListener("select",W),s.addEventListener("selectstart",W),s.addEventListener("selectend",W),s.addEventListener("squeeze",W),s.addEventListener("squeezestart",W),s.addEventListener("squeezeend",W),s.addEventListener("end",J),s.addEventListener("inputsourceschange",et),S.xrCompatible!==!0&&await e.makeXRCompatible(),y=t.getPixelRatio(),t.getSize(C),x&&"createProjectionLayer"in XRWebGLBinding.prototype){let it=null,Rt=null,ot=null;S.depth&&(ot=S.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,it=S.stencil?hs:gi,Rt=S.stencil?Sr:ei);let ut={colorFormat:e.RGBA8,depthFormat:ot,scaleFactor:r};d=this.getBinding(),h=d.createProjectionLayer(ut),s.updateRenderState({layers:[h]}),t.setPixelRatio(1),t.setSize(h.textureWidth,h.textureHeight,!1),M=new Mn(h.textureWidth,h.textureHeight,{format:Xn,type:bn,depthTexture:new Qi(h.textureWidth,h.textureHeight,Rt,void 0,void 0,void 0,void 0,void 0,void 0,it),stencilBuffer:S.stencil,colorSpace:t.outputColorSpace,samples:S.antialias?4:0,resolveDepthBuffer:h.ignoreDepthValues===!1,resolveStencilBuffer:h.ignoreDepthValues===!1,storeMultisampledDepthBuffer:h.ignoreDepthValues===!1,storeMultisampledStencilBuffer:h.ignoreDepthValues===!1})}else{let it={antialias:S.antialias,alpha:!0,depth:S.depth,stencil:S.stencil,framebufferScaleFactor:r};f=new XRWebGLLayer(s,e,it),s.updateRenderState({baseLayer:f}),t.setPixelRatio(1),t.setSize(f.framebufferWidth,f.framebufferHeight,!1),M=new Mn(f.framebufferWidth,f.framebufferHeight,{format:Xn,type:bn,colorSpace:t.outputColorSpace,stencilBuffer:S.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1,storeMultisampledDepthBuffer:f.ignoreDepthValues===!1,storeMultisampledStencilBuffer:f.ignoreDepthValues===!1})}M.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await s.requestReferenceSpace(a),Tt.setContext(s),Tt.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return g.getDepthTexture()};function et(Y){for(let K=0;K<Y.removed.length;K++){let it=Y.removed[K],Rt=b.indexOf(it);Rt>=0&&(b[Rt]=null,T[Rt].disconnect(it))}for(let K=0;K<Y.added.length;K++){let it=Y.added[K],Rt=b.indexOf(it);if(Rt===-1){for(let ut=0;ut<T.length;ut++)if(ut>=b.length){b.push(it),Rt=ut;break}else if(b[ut]===null){b[ut]=it,Rt=ut;break}if(Rt===-1)break}let ot=T[Rt];ot&&ot.connect(it)}}let U=new L,q=new L;function j(Y,K,it){U.setFromMatrixPosition(K.matrixWorld),q.setFromMatrixPosition(it.matrixWorld);let Rt=U.distanceTo(q),ot=K.projectionMatrix.elements,ut=it.projectionMatrix.elements,qt=ot[14]/(ot[10]-1),Ot=ot[14]/(ot[10]+1),Gt=(ot[9]+1)/ot[5],Bt=(ot[9]-1)/ot[5],Dt=(ot[8]-1)/ot[0],Qt=(ut[8]+1)/ut[0],ue=qt*Dt,be=qt*Qt,Kt=Rt/(-Dt+Qt),le=Kt*-Dt;if(K.matrixWorld.decompose(Y.position,Y.quaternion,Y.scale),Y.translateX(le),Y.translateZ(Kt),Y.matrixWorld.compose(Y.position,Y.quaternion,Y.scale),Y.matrixWorldInverse.copy(Y.matrixWorld).invert(),ot[10]===-1)Y.projectionMatrix.copy(K.projectionMatrix),Y.projectionMatrixInverse.copy(K.projectionMatrixInverse);else{let R=qt+Kt,ee=Ot+Kt,Pt=ue-le,E=be+(Rt-le),_=Gt*Ot/ee*R,O=Bt*Ot/ee*R;Y.projectionMatrix.makePerspective(Pt,E,_,O,R,ee),Y.projectionMatrixInverse.copy(Y.projectionMatrix).invert()}}function yt(Y,K){K===null?Y.matrixWorld.copy(Y.matrix):Y.matrixWorld.multiplyMatrices(K.matrixWorld,Y.matrix),Y.matrixWorldInverse.copy(Y.matrixWorld).invert()}this.updateCamera=function(Y){if(s===null)return;let K=Y.near,it=Y.far;g.texture!==null&&(g.depthNear>0&&(K=g.depthNear),g.depthFar>0&&(it=g.depthFar)),V.near=F.near=P.near=K,V.far=F.far=P.far=it,(I!==V.near||k!==V.far)&&(s.updateRenderState({depthNear:V.near,depthFar:V.far}),I=V.near,k=V.far),V.layers.mask=Y.layers.mask|6,P.layers.mask=V.layers.mask&-5,F.layers.mask=V.layers.mask&-3;let Rt=Y.parent,ot=V.cameras;yt(V,Rt);for(let ut=0;ut<ot.length;ut++)yt(ot[ut],Rt);ot.length===2?j(V,P,F):V.projectionMatrix.copy(P.projectionMatrix),w===null&&Y.isPerspectiveCamera&&(w={camera:Y,fov:Y.fov,zoom:Y.zoom}),bt(Y,V,Rt)};function bt(Y,K,it){it===null?Y.matrix.copy(K.matrixWorld):(Y.matrix.copy(it.matrixWorld),Y.matrix.invert(),Y.matrix.multiply(K.matrixWorld)),Y.matrix.decompose(Y.position,Y.quaternion,Y.scale),Y.updateMatrixWorld(!0),Y.projectionMatrix.copy(K.projectionMatrix),Y.projectionMatrixInverse.copy(K.projectionMatrixInverse),Y.isPerspectiveCamera&&(Y.fov=lr*2*Math.atan(1/Y.projectionMatrix.elements[5]),Y.zoom=1)}this.getCamera=function(){return V},this.getFoveation=function(){if(!(h===null&&f===null))return l},this.setFoveation=function(Y){l=Y,h!==null&&(h.fixedFoveation=Y),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=Y)},this.hasDepthSensing=function(){return g.texture!==null},this.getDepthSensingMesh=function(){return g.getMesh(V)},this.getCameraTexture=function(Y){return p[Y]};let pe=null;function Xt(Y,K){if(u=K.getViewerPose(c||o),m=K,u!==null){let it=u.views;f!==null&&(t.setRenderTargetFramebuffer(M,f.framebuffer),t.setRenderTarget(M));let Rt=!1;it.length!==V.cameras.length&&(V.cameras.length=0,Rt=!0);for(let Ot=0;Ot<it.length;Ot++){let Gt=it[Ot],Bt=null;if(f!==null)Bt=f.getViewport(Gt);else{let Qt=d.getViewSubImage(h,Gt);Bt=Qt.viewport,Ot===0&&(t.setRenderTargetTextures(M,Qt.colorTexture,Qt.depthStencilTexture),t.setRenderTarget(M))}let Dt=B[Ot];Dt===void 0&&(Dt=new nn,Dt.layers.enable(Ot),Dt.viewport=new Ne,B[Ot]=Dt),Dt.matrix.fromArray(Gt.transform.matrix),Dt.matrix.decompose(Dt.position,Dt.quaternion,Dt.scale),Dt.projectionMatrix.fromArray(Gt.projectionMatrix),Dt.projectionMatrixInverse.copy(Dt.projectionMatrix).invert(),Dt.viewport.set(Bt.x,Bt.y,Bt.width,Bt.height),Ot===0&&(V.matrix.copy(Dt.matrix),V.matrix.decompose(V.position,V.quaternion,V.scale)),Rt===!0&&V.cameras.push(Dt)}let ot=s.enabledFeatures;if(ot&&ot.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&x){d=i.getBinding();let Ot=d.getDepthInformation(it[0]);Ot&&Ot.isValid&&Ot.texture&&g.init(Ot,s.renderState)}if(ot&&ot.includes("camera-access")&&x){t.state.unbindTexture(),d=i.getBinding();for(let Ot=0;Ot<it.length;Ot++){let Gt=it[Ot].camera;if(Gt){let Bt=p[Gt];Bt||(Bt=new so,p[Gt]=Bt);let Dt=d.getCameraImage(Gt);Bt.sourceTexture=Dt}}}}for(let it=0;it<T.length;it++){let Rt=b[it],ot=T[it];Rt!==null&&ot!==void 0&&ot.update(Rt,K,c||o)}pe&&pe(Y,K),K.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:K}),m=null}let Tt=new qf;Tt.setAnimationLoop(Xt),this.setAnimationLoop=function(Y){pe=Y},this.dispose=function(){}}},Ay=new De,jf=new jt;jf.set(-1,0,0,0,1,0,0,0,1);function Cy(n,t){function e(g,p){g.matrixAutoUpdate===!0&&g.updateMatrix(),p.value.copy(g.matrix)}function i(g,p){p.color.getRGB(g.fogColor.value,Uh(n)),p.isFog?(g.fogNear.value=p.near,g.fogFar.value=p.far):p.isFogExp2&&(g.fogDensity.value=p.density)}function s(g,p,S,A,M){p.isNodeMaterial?p.uniformsNeedUpdate=!1:p.isMeshBasicMaterial?r(g,p):p.isMeshLambertMaterial?(r(g,p),p.envMap&&(g.envMapIntensity.value=p.envMapIntensity)):p.isMeshToonMaterial?(r(g,p),d(g,p)):p.isMeshPhongMaterial?(r(g,p),u(g,p),p.envMap&&(g.envMapIntensity.value=p.envMapIntensity)):p.isMeshStandardMaterial?(r(g,p),h(g,p),p.isMeshPhysicalMaterial&&f(g,p,M)):p.isMeshMatcapMaterial?(r(g,p),m(g,p)):p.isMeshDepthMaterial?r(g,p):p.isMeshDistanceMaterial?(r(g,p),x(g,p)):p.isMeshNormalMaterial?r(g,p):p.isLineBasicMaterial?(o(g,p),p.isLineDashedMaterial&&a(g,p)):p.isPointsMaterial?l(g,p,S,A):p.isSpriteMaterial?c(g,p):p.isShadowMaterial?(g.color.value.copy(p.color),g.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function r(g,p){g.opacity.value=p.opacity,p.color&&g.diffuse.value.copy(p.color),p.emissive&&g.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(g.map.value=p.map,e(p.map,g.mapTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,e(p.alphaMap,g.alphaMapTransform)),p.bumpMap&&(g.bumpMap.value=p.bumpMap,e(p.bumpMap,g.bumpMapTransform),g.bumpScale.value=p.bumpScale,p.side===pn&&(g.bumpScale.value*=-1)),p.normalMap&&(g.normalMap.value=p.normalMap,e(p.normalMap,g.normalMapTransform),g.normalScale.value.copy(p.normalScale),p.side===pn&&g.normalScale.value.negate()),p.displacementMap&&(g.displacementMap.value=p.displacementMap,e(p.displacementMap,g.displacementMapTransform),g.displacementScale.value=p.displacementScale,g.displacementBias.value=p.displacementBias),p.emissiveMap&&(g.emissiveMap.value=p.emissiveMap,e(p.emissiveMap,g.emissiveMapTransform)),p.specularMap&&(g.specularMap.value=p.specularMap,e(p.specularMap,g.specularMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest);let S=t.get(p),A=S.envMap,M=S.envMapRotation;A&&(g.envMap.value=A,g.envMapRotation.value.setFromMatrix4(Ay.makeRotationFromEuler(M)).transpose(),A.isCubeTexture&&A.isRenderTargetTexture===!1&&g.envMapRotation.value.premultiply(jf),g.reflectivity.value=p.reflectivity,g.ior.value=p.ior,g.refractionRatio.value=p.refractionRatio),p.lightMap&&(g.lightMap.value=p.lightMap,g.lightMapIntensity.value=p.lightMapIntensity,e(p.lightMap,g.lightMapTransform)),p.aoMap&&(g.aoMap.value=p.aoMap,g.aoMapIntensity.value=p.aoMapIntensity,e(p.aoMap,g.aoMapTransform))}function o(g,p){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,p.map&&(g.map.value=p.map,e(p.map,g.mapTransform))}function a(g,p){g.dashSize.value=p.dashSize,g.totalSize.value=p.dashSize+p.gapSize,g.scale.value=p.scale}function l(g,p,S,A){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,g.size.value=p.size*S,g.scale.value=A*.5,p.map&&(g.map.value=p.map,e(p.map,g.uvTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,e(p.alphaMap,g.alphaMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest)}function c(g,p){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,g.rotation.value=p.rotation,p.map&&(g.map.value=p.map,e(p.map,g.mapTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,e(p.alphaMap,g.alphaMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest)}function u(g,p){g.specular.value.copy(p.specular),g.shininess.value=Math.max(p.shininess,1e-4)}function d(g,p){p.gradientMap&&(g.gradientMap.value=p.gradientMap)}function h(g,p){g.metalness.value=p.metalness,p.metalnessMap&&(g.metalnessMap.value=p.metalnessMap,e(p.metalnessMap,g.metalnessMapTransform)),g.roughness.value=p.roughness,p.roughnessMap&&(g.roughnessMap.value=p.roughnessMap,e(p.roughnessMap,g.roughnessMapTransform)),p.envMap&&(g.envMapIntensity.value=p.envMapIntensity)}function f(g,p,S){g.ior.value=p.ior,p.sheen>0&&(g.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),g.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(g.sheenColorMap.value=p.sheenColorMap,e(p.sheenColorMap,g.sheenColorMapTransform)),p.sheenRoughnessMap&&(g.sheenRoughnessMap.value=p.sheenRoughnessMap,e(p.sheenRoughnessMap,g.sheenRoughnessMapTransform))),p.clearcoat>0&&(g.clearcoat.value=p.clearcoat,g.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(g.clearcoatMap.value=p.clearcoatMap,e(p.clearcoatMap,g.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(g.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,e(p.clearcoatRoughnessMap,g.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(g.clearcoatNormalMap.value=p.clearcoatNormalMap,e(p.clearcoatNormalMap,g.clearcoatNormalMapTransform),g.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===pn&&g.clearcoatNormalScale.value.negate())),p.dispersion>0&&(g.dispersion.value=p.dispersion),p.retroreflectivity>0&&(g.retroreflectivity.value=p.retroreflectivity),p.iridescence>0&&(g.iridescence.value=p.iridescence,g.iridescenceIOR.value=p.iridescenceIOR,g.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],g.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(g.iridescenceMap.value=p.iridescenceMap,e(p.iridescenceMap,g.iridescenceMapTransform)),p.iridescenceThicknessMap&&(g.iridescenceThicknessMap.value=p.iridescenceThicknessMap,e(p.iridescenceThicknessMap,g.iridescenceThicknessMapTransform))),p.transmission>0&&(g.transmission.value=p.transmission,g.transmissionSamplerMap.value=S.texture,g.transmissionSamplerSize.value.set(S.width,S.height),p.transmissionMap&&(g.transmissionMap.value=p.transmissionMap,e(p.transmissionMap,g.transmissionMapTransform)),g.thickness.value=p.thickness,p.thicknessMap&&(g.thicknessMap.value=p.thicknessMap,e(p.thicknessMap,g.thicknessMapTransform)),g.attenuationDistance.value=p.attenuationDistance,g.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(g.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(g.anisotropyMap.value=p.anisotropyMap,e(p.anisotropyMap,g.anisotropyMapTransform))),g.specularIntensity.value=p.specularIntensity,g.specularColor.value.copy(p.specularColor),p.specularColorMap&&(g.specularColorMap.value=p.specularColorMap,e(p.specularColorMap,g.specularColorMapTransform)),p.specularIntensityMap&&(g.specularIntensityMap.value=p.specularIntensityMap,e(p.specularIntensityMap,g.specularIntensityMapTransform))}function m(g,p){p.matcap&&(g.matcap.value=p.matcap)}function x(g,p){let S=t.get(p).light;g.referencePosition.value.setFromMatrixPosition(S.matrixWorld),g.nearDistance.value=S.shadow.camera.near,g.farDistance.value=S.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:s}}function Ry(n,t,e,i){let s={},r={},o=[],a=n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS);function l(M,T){let b=T.program;i.uniformBlockBinding(M,b)}function c(M,T){let b=s[M.id];b===void 0&&(g(M),b=u(M),s[M.id]=b,M.addEventListener("dispose",S));let C=T.program;i.updateUBOMapping(M,C);let y=t.render.frame;r[M.id]!==y&&(h(M),r[M.id]=y)}function u(M){let T=d();M.__bindingPointIndex=T;let b=n.createBuffer(),C=M.__size,y=M.usage;return n.bindBuffer(n.UNIFORM_BUFFER,b),n.bufferData(n.UNIFORM_BUFFER,C,y),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,T,b),b}function d(){for(let M=0;M<a;M++)if(o.indexOf(M)===-1)return o.push(M),M;return Zt("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function h(M){let T=s[M.id],b=M.uniforms,C=M.__cache;n.bindBuffer(n.UNIFORM_BUFFER,T);for(let y=0,w=b.length;y<w;y++){let P=b[y];if(Array.isArray(P))for(let F=0,B=P.length;F<B;F++)f(P[F],y,F,C);else f(P,y,0,C)}n.bindBuffer(n.UNIFORM_BUFFER,null)}function f(M,T,b,C){if(x(M,T,b,C)===!0){let y=M.__offset,w=M.value;if(Array.isArray(w)){let P=0;for(let F=0;F<w.length;F++){let B=w[F],V=p(B);m(B,M.__data,P),typeof B!="number"&&typeof B!="boolean"&&!B.isMatrix3&&!ArrayBuffer.isView(B)&&(P+=V.storage/Float32Array.BYTES_PER_ELEMENT)}}else m(w,M.__data,0);n.bufferSubData(n.UNIFORM_BUFFER,y,M.__data)}}function m(M,T,b){typeof M=="number"||typeof M=="boolean"?T[0]=M:M.isMatrix3?(T[0]=M.elements[0],T[1]=M.elements[1],T[2]=M.elements[2],T[3]=0,T[4]=M.elements[3],T[5]=M.elements[4],T[6]=M.elements[5],T[7]=0,T[8]=M.elements[6],T[9]=M.elements[7],T[10]=M.elements[8],T[11]=0):ArrayBuffer.isView(M)?T.set(new M.constructor(M.buffer,M.byteOffset,T.length)):M.toArray(T,b)}function x(M,T,b,C){let y=M.value,w=T+"_"+b;if(C[w]===void 0)return typeof y=="number"||typeof y=="boolean"?C[w]=y:ArrayBuffer.isView(y)?C[w]=y.slice():C[w]=y.clone(),!0;{let P=C[w];if(typeof y=="number"||typeof y=="boolean"){if(P!==y)return C[w]=y,!0}else{if(ArrayBuffer.isView(y))return!0;if(P.equals(y)===!1)return P.copy(y),!0}}return!1}function g(M){let T=M.uniforms,b=0,C=16;for(let w=0,P=T.length;w<P;w++){let F=Array.isArray(T[w])?T[w]:[T[w]];for(let B=0,V=F.length;B<V;B++){let I=F[B],k=Array.isArray(I.value)?I.value:[I.value];for(let W=0,J=k.length;W<J;W++){let et=k[W],U=p(et),q=b%C,j=q%U.boundary,yt=q+j;b+=j,yt!==0&&C-yt<U.storage&&(b+=C-yt),I.__data=new Float32Array(U.storage/Float32Array.BYTES_PER_ELEMENT),I.__offset=b,b+=U.storage}}}let y=b%C;return y>0&&(b+=C-y),M.__size=b,M.__cache={},this}function p(M){let T={boundary:0,storage:0};return typeof M=="number"||typeof M=="boolean"?(T.boundary=4,T.storage=4):M.isVector2?(T.boundary=8,T.storage=8):M.isVector3||M.isColor?(T.boundary=16,T.storage=12):M.isVector4?(T.boundary=16,T.storage=16):M.isMatrix3?(T.boundary=48,T.storage=48):M.isMatrix4?(T.boundary=64,T.storage=64):M.isTexture?Ht("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(M)?(T.boundary=16,T.storage=M.byteLength):Ht("WebGLRenderer: Unsupported uniform value type.",M),T}function S(M){let T=M.target;T.removeEventListener("dispose",S);let b=o.indexOf(T.__bindingPointIndex);o.splice(b,1),n.deleteBuffer(s[T.id]),delete s[T.id],delete r[T.id]}function A(){for(let M in s)n.deleteBuffer(s[M]);o=[],s={},r={}}return{bind:l,update:c,dispose:A}}var Py=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]),yi=null;function Iy(){return yi===null&&(yi=new ka(Py,16,16,us,ii),yi.name="DFG_LUT",yi.minFilter=je,yi.magFilter=je,yi.wrapS=mi,yi.wrapT=mi,yi.generateMipmaps=!1,yi.needsUpdate=!0),yi}var Ql=class{constructor(t={}){let{canvas:e=_f(),context:i=null,depth:s=!0,stencil:r=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:d=!1,reversedDepthBuffer:h=!1,outputBufferType:f=bn}=t;this.isWebGLRenderer=!0;let m;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");m=i.getContextAttributes().alpha}else m=o;let x=f,g=new Set([ml,pl,fl]),p=new Set([bn,ei,Mr,Sr,ul,dl]),S=new Uint32Array(4),A=new Int32Array(4),M=new L,T=null,b=null,C=[],y=[],w=null;this.domElement=e,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=ti,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let P=this,F=!1,B=null,V=null,I=null,k=null;this._outputColorSpace=hn;let W=0,J=0,et=null,U=-1,q=null,j=new Ne,yt=new Ne,bt=null,pe=new oe(0),Xt=0,Tt=e.width,Y=e.height,K=1,it=null,Rt=null,ot=new Ne(0,0,Tt,Y),ut=new Ne(0,0,Tt,Y),qt=!1,Ot=new dr,Gt=!1,Bt=!1,Dt=new De,Qt=new L,ue=new Ne,be={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},Kt=!1;function le(){return et===null?K:1}let R=i;function ee(v,D){return e.getContext(v,D)}let Pt,E,_,O,z,Z,st,rt,$,Q,at,Ut,dt,ct,It,Vt,kt,N,ht,tt,lt,mt,nt;try{let v={alpha:!0,depth:s,stencil:r,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:u,failIfMajorPerformanceCaveat:d};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${"186"}`),e.addEventListener("webglcontextlost",Nt,!1),e.addEventListener("webglcontextrestored",$t,!1),e.addEventListener("webglcontextcreationerror",On,!1),R===null){let D="webgl2";if(R=ee(D,v),R===null)throw ee(D)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}xt()}catch(v){throw e.removeEventListener("webglcontextlost",Nt,!1),e.removeEventListener("webglcontextrestored",$t,!1),e.removeEventListener("webglcontextcreationerror",On,!1),Zt("WebGLRenderer: "+v.message),v}function xt(){Pt=new B_(R),Pt.init(),lt=new Ty(R,Pt),E=new C_(R,Pt,t,lt),_=new Sy(R,Pt),E.reversedDepthBuffer&&h&&_.buffers.depth.setReversed(!0),V=R.createFramebuffer(),I=R.createFramebuffer(),k=R.createFramebuffer(),O=new V_(R),z=new ly,Z=new by(R,Pt,_,z,E,lt,O),st=new O_(P),rt=new Gm(R),mt=new w_(R,rt),$=new k_(R,rt,O,mt),Q=new G_(R,$,rt,mt,O),N=new H_(R,E,Z),It=new R_(z),at=new ay(P,st,Pt,E,mt,It),Ut=new Cy(P,z),dt=new hy,ct=new gy(Pt),kt=new E_(P,st,_,Q,m,l),Vt=new My(P,Q,E),nt=new Ry(R,O,E,_),ht=new A_(R,Pt,O),tt=new z_(R,Pt,O),O.programs=at.programs,P.capabilities=E,P.extensions=Pt,P.properties=z,P.renderLists=dt,P.shadowMap=Vt,P.state=_,P.info=O}x!==bn&&(w=new X_(x,e.width,e.height,a,s,r));let Et=new su(P,R);this.xr=Et,this.getContext=function(){return R},this.getContextAttributes=function(){return R.getContextAttributes()},this.forceContextLoss=function(){let v=Pt.get("WEBGL_lose_context");v&&v.loseContext()},this.forceContextRestore=function(){let v=Pt.get("WEBGL_lose_context");v&&v.restoreContext()},this.getPixelRatio=function(){return K},this.setPixelRatio=function(v){v!==void 0&&(K=v,this.setSize(Tt,Y,!1))},this.getSize=function(v){return v.set(Tt,Y)},this.setSize=function(v,D,X=!0){if(Et.isPresenting){Ht("WebGLRenderer: Can't change size while VR device is presenting.");return}Tt=v,Y=D,e.width=Math.floor(v*K),e.height=Math.floor(D*K),X===!0&&(e.style.width=v+"px",e.style.height=D+"px"),w!==null&&w.setSize(e.width,e.height),this.setViewport(0,0,v,D)},this.getDrawingBufferSize=function(v){return v.set(Tt*K,Y*K).floor()},this.setDrawingBufferSize=function(v,D,X){Tt=v,Y=D,K=X,e.width=Math.floor(v*X),e.height=Math.floor(D*X),this.setViewport(0,0,v,D)},this.setEffects=function(v){if(x===bn){Zt("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(v){for(let D=0;D<v.length;D++)if(v[D].isOutputPass===!0){Ht("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}w.setEffects(v||[])},this.getCurrentViewport=function(v){return v.copy(j)},this.getViewport=function(v){return v.copy(ot)},this.setViewport=function(v,D,X,H){v.isVector4?ot.set(v.x,v.y,v.z,v.w):ot.set(v,D,X,H),_.viewport(j.copy(ot).multiplyScalar(K).round())},this.getScissor=function(v){return v.copy(ut)},this.setScissor=function(v,D,X,H){v.isVector4?ut.set(v.x,v.y,v.z,v.w):ut.set(v,D,X,H),_.scissor(yt.copy(ut).multiplyScalar(K).round())},this.getScissorTest=function(){return qt},this.setScissorTest=function(v){_.setScissorTest(qt=v)},this.setOpaqueSort=function(v){it=v},this.setTransparentSort=function(v){Rt=v},this.getClearColor=function(v){return v.copy(kt.getClearColor())},this.setClearColor=function(){kt.setClearColor(...arguments)},this.getClearAlpha=function(){return kt.getClearAlpha()},this.setClearAlpha=function(){kt.setClearAlpha(...arguments)},this.clear=function(v=!0,D=!0,X=!0){let H=0;if(v){let G=!1;if(et!==null){let _t=et.texture.format;G=g.has(_t)}if(G){let _t=et.texture.type,St=p.has(_t),gt=kt.getClearColor(),At=kt.getClearAlpha(),Ft=gt.r,ce=gt.g,me=gt.b;St?(S[0]=Ft,S[1]=ce,S[2]=me,S[3]=At,R.clearBufferuiv(R.COLOR,0,S)):(A[0]=Ft,A[1]=ce,A[2]=me,A[3]=At,R.clearBufferiv(R.COLOR,0,A))}else H|=R.COLOR_BUFFER_BIT}D&&(H|=R.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),X&&(H|=R.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),H!==0&&R.clear(H)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(v){v.setRenderer(this),B=v},this.dispose=function(){e.removeEventListener("webglcontextlost",Nt,!1),e.removeEventListener("webglcontextrestored",$t,!1),e.removeEventListener("webglcontextcreationerror",On,!1),kt.dispose(),dt.dispose(),ct.dispose(),z.dispose(),st.dispose(),Q.dispose(),mt.dispose(),nt.dispose(),at.dispose(),Et.dispose(),Et.removeEventListener("sessionstart",pu),Et.removeEventListener("sessionend",mu),ds.stop()};function Nt(v){v.preventDefault(),Lh("WebGLRenderer: Context Lost."),F=!0}function $t(){Lh("WebGLRenderer: Context Restored."),F=!1;let v=O.autoReset,D=Vt.enabled,X=Vt.autoUpdate,H=Vt.needsUpdate,G=Vt.type;xt(),O.autoReset=v,Vt.enabled=D,Vt.autoUpdate=X,Vt.needsUpdate=H,Vt.type=G}function On(v){Zt("WebGLRenderer: A WebGL context could not be created. Reason: ",v.statusMessage)}function An(v){let D=v.target;D.removeEventListener("dispose",An),Tp(D)}function Tp(v){Ep(v),z.remove(v)}function Ep(v){let D=z.get(v).programs;D!==void 0&&(D.forEach(function(X){at.releaseProgram(X)}),v.isShaderMaterial&&at.releaseShaderCache(v))}this.renderBufferDirect=function(v,D,X,H,G,_t){D===null&&(D=be);let St=G.isMesh&&G.matrixWorld.determinantAffine()<0,gt=Cp(v,D,X,H,G);_.setMaterial(H,St);let At=X.index,Ft=1;if(H.wireframe===!0){if(At=$.getWireframeAttribute(X),At===void 0)return;Ft=2}let ce=X.drawRange,me=X.attributes.position,Ct=ce.start*Ft,ve=(ce.start+ce.count)*Ft;_t!==null&&(Ct=Math.max(Ct,_t.start*Ft),ve=Math.min(ve,(_t.start+_t.count)*Ft)),At!==null?(Ct=Math.max(Ct,0),ve=Math.min(ve,At.count)):me!=null&&(Ct=Math.max(Ct,0),ve=Math.min(ve,me.count));let ze=ve-Ct;if(ze<0||ze===1/0)return;mt.setup(G,H,gt,X,At);let Ie,we=ht;if(At!==null&&(Ie=rt.get(At),we=tt,we.setIndex(Ie)),G.isMesh)H.wireframe===!0?(_.setLineWidth(H.wireframeLinewidth*le()),we.setMode(R.LINES)):we.setMode(R.TRIANGLES);else if(G.isLine){let Qe=H.linewidth;Qe===void 0&&(Qe=1),_.setLineWidth(Qe*le()),G.isLineSegments?we.setMode(R.LINES):G.isLineLoop?we.setMode(R.LINE_LOOP):we.setMode(R.LINE_STRIP)}else G.isPoints?we.setMode(R.POINTS):G.isSprite&&we.setMode(R.TRIANGLES);if(G.isBatchedMesh)if(Pt.get("WEBGL_multi_draw"))we.renderMultiDraw(G._multiDrawStarts,G._multiDrawCounts,G._multiDrawCount);else{let Qe=G._multiDrawStarts,vt=G._multiDrawCounts,on=G._multiDrawCount,_e=At?rt.get(At).bytesPerElement:1,Bn=z.get(H).currentProgram.getUniforms();for(let ai=0;ai<on;ai++)Bn.setValue(R,"_gl_DrawID",ai),we.render(Qe[ai]/_e,vt[ai])}else if(G.isInstancedMesh)we.renderInstances(Ct,ze,G.count);else if(X.isInstancedBufferGeometry){let Qe=X._maxInstanceCount!==void 0?X._maxInstanceCount:1/0,vt=Math.min(X.instanceCount,Qe);we.renderInstances(Ct,ze,vt)}else we.render(Ct,ze)};function fu(v,D,X,H){B!==null&&v.isNodeMaterial&&B.setObject(H,v),Gt===!0&&It.setState(v,X,!1),v.transparent===!0&&v.side===Wn&&v.forceSinglePass===!1?(v.side=pn,v.needsUpdate=!0,Po(v,D,H),v.side=as,v.needsUpdate=!0,Po(v,D,H),v.side=Wn):Po(v,D,H)}this.compile=function(v,D,X=null){X===null&&(X=v),B!==null&&B.renderStart(v,D,X),b=ct.get(X),b.init(D),y.push(b),X.traverseVisible(function(G){G.isLight&&G.layers.test(D.layers)&&(b.pushLight(G),G.castShadow&&b.pushShadow(G))}),v!==X&&v.traverseVisible(function(G){G.isLight&&G.layers.test(D.layers)&&(b.pushLight(G),G.castShadow&&b.pushShadow(G))}),b.setupLights(),B!==null&&B.updateLights(b.state.lightsArray),Bt=this.localClippingEnabled,Gt=It.init(this.clippingPlanes,Bt),Gt===!0&&It.setGlobalState(this.clippingPlanes,D),B!==null&&Vt.render(b.state.shadowsArray,X,D);let H=new Set;return v.traverse(function(G){if(!(G.isMesh||G.isPoints||G.isLine||G.isSprite))return;let _t=G.material;if(_t)if(Array.isArray(_t))for(let St=0;St<_t.length;St++){let gt=_t[St];fu(gt,X,D,G),H.add(gt)}else fu(_t,X,D,G),H.add(_t)}),b=y.pop(),B!==null&&B.renderEnd(),H},this.compileAsync=function(v,D,X=null){let H=this.compile(v,D,X);return new Promise(G=>{function _t(){if(H.forEach(function(St){let At=z.get(St).currentProgram;(At===void 0||At.isReady())&&H.delete(St)}),H.size===0){G(v);return}setTimeout(_t,10)}Pt.get("KHR_parallel_shader_compile")!==null?_t():setTimeout(_t,10)})};let cc=null;function wp(v){cc&&cc(v)}function pu(){ds.stop()}function mu(){ds.start()}let ds=new qf;ds.setAnimationLoop(wp),typeof self<"u"&&ds.setContext(self),this.setAnimationLoop=function(v){cc=v,Et.setAnimationLoop(v),v===null?ds.stop():ds.start()},Et.addEventListener("sessionstart",pu),Et.addEventListener("sessionend",mu),this.render=function(v,D){if(D!==void 0&&D.isCamera!==!0){Zt("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(F===!0)return;B!==null&&B.renderStart(v,D);let X=Et.enabled===!0&&Et.isPresenting===!0,H=w!==null&&(et===null||X)&&w.begin(P,et);if(v.matrixWorldAutoUpdate===!0&&v.updateMatrixWorld(),D.parent===null&&D.matrixWorldAutoUpdate===!0&&D.updateMatrixWorld(),Et.enabled===!0&&Et.isPresenting===!0&&(w===null||w.isCompositing()===!1)&&(Et.cameraAutoUpdate===!0&&Et.updateCamera(D),D=Et.getCamera()),v.isScene===!0&&v.onBeforeRender(P,v,D,et),b=ct.get(v,y.length),b.init(D),b.state.textureUnits=Z.getTextureUnits(),y.push(b),Dt.multiplyMatrices(D.projectionMatrix,D.matrixWorldInverse),Ot.setFromProjectionMatrix(Dt,jn,D.reversedDepth),Bt=this.localClippingEnabled,Gt=It.init(this.clippingPlanes,Bt),T=dt.get(v,C.length),T.init(),C.push(T),Et.enabled===!0&&Et.isPresenting===!0){let St=P.xr.getDepthSensingMesh();St!==null&&hc(St,D,-1/0,P.sortObjects)}hc(v,D,0,P.sortObjects),T.finish(),B!==null&&B.updateLights(b.state.lightsArray),P.sortObjects===!0&&T.sort(it,Rt),Kt=Et.enabled===!1||Et.isPresenting===!1||Et.hasDepthSensing()===!1,Kt&&kt.addToRenderList(T,v),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),Gt===!0&&It.beginShadows();let G=b.state.shadowsArray;if(Vt.render(G,v,D),Gt===!0&&It.endShadows(),(H&&w.hasRenderPass())===!1){let St=T.opaque,gt=T.transmissive;if(b.setupLights(),D.isArrayCamera){let At=D.cameras;if(gt.length>0)for(let Ft=0,ce=At.length;Ft<ce;Ft++){let me=At[Ft];_u(St,gt,v,me)}Kt&&kt.render(v);for(let Ft=0,ce=At.length;Ft<ce;Ft++){let me=At[Ft];gu(T,v,me,me.viewport)}}else gt.length>0&&_u(St,gt,v,D),Kt&&kt.render(v),gu(T,v,D)}et!==null&&J===0&&(Z.updateMultisampleRenderTarget(et),Z.updateRenderTargetMipmap(et)),H&&w.end(P),v.isScene===!0&&v.onAfterRender(P,v,D),mt.resetDefaultState(),U=-1,q=null,y.pop(),y.length>0?(b=y[y.length-1],Z.setTextureUnits(b.state.textureUnits),Gt===!0&&It.setGlobalState(P.clippingPlanes,b.state.camera)):b=null,C.pop(),C.length>0?T=C[C.length-1]:T=null,B!==null&&B.renderEnd()};function hc(v,D,X,H){if(v.visible===!1)return;if(v.layers.test(D.layers)){if(v.isGroup)X=v.renderOrder;else if(v.isLOD)v.autoUpdate===!0&&v.update(D);else if(v.isLightProbeGrid)b.pushLightProbeGrid(v);else if(v.isLight)b.pushLight(v),v.castShadow&&b.pushShadow(v);else if(v.isSprite){if(!v.frustumCulled||v.intersectsFrustum(Ot)){H&&ue.setFromMatrixPosition(v.matrixWorld).applyMatrix4(Dt);let St=Q.update(v),gt=v.material;gt.visible&&T.push(v,St,gt,X,ue.z,null,D)}}else if((v.isMesh||v.isLine||v.isPoints)&&(!v.frustumCulled||v.intersectsFrustum(Ot))){let St=Q.update(v),gt=v.material;if(H&&(v.boundingSphere!==void 0?(v.boundingSphere===null&&v.computeBoundingSphere(),ue.copy(v.boundingSphere.center)):(St.boundingSphere===null&&St.computeBoundingSphere(),ue.copy(St.boundingSphere.center)),ue.applyMatrix4(v.matrixWorld).applyMatrix4(Dt)),Array.isArray(gt)){let At=St.groups;for(let Ft=0,ce=At.length;Ft<ce;Ft++){let me=At[Ft],Ct=gt[me.materialIndex];Ct&&Ct.visible&&T.push(v,St,Ct,X,ue.z,me,D)}}else gt.visible&&T.push(v,St,gt,X,ue.z,null,D)}}let _t=v.children;for(let St=0,gt=_t.length;St<gt;St++)hc(_t[St],D,X,H)}function gu(v,D,X,H){let{opaque:G,transmissive:_t,transparent:St}=v;b.setupLightsView(X),Gt===!0&&It.setGlobalState(P.clippingPlanes,X),H&&_.viewport(j.copy(H)),G.length>0&&Ro(G,D,X),_t.length>0&&Ro(_t,D,X),St.length>0&&Ro(St,D,X),_.buffers.depth.setTest(!0),_.buffers.depth.setMask(!0),_.buffers.color.setMask(!0),_.setPolygonOffset(!1)}function _u(v,D,X,H){if((X.isScene===!0?X.overrideMaterial:null)!==null)return;if(b.state.transmissionRenderTarget[H.id]===void 0){let Ct=Pt.has("EXT_color_buffer_half_float")||Pt.has("EXT_color_buffer_float");b.state.transmissionRenderTarget[H.id]=new Mn(1,1,{generateMipmaps:!0,type:Ct?ii:bn,minFilter:cs,samples:Math.max(4,E.samples),stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:ge.workingColorSpace})}let _t=b.state.transmissionRenderTarget[H.id],St=H.viewport||j;_t.setSize(St.z*P.transmissionResolutionScale,St.w*P.transmissionResolutionScale);let gt=P.getRenderTarget(),At=P.getActiveCubeFace(),Ft=P.getActiveMipmapLevel();P.setRenderTarget(_t),P.getClearColor(pe),Xt=P.getClearAlpha(),Xt<1&&P.setClearColor(16777215,.5),P.clear(),Kt&&kt.render(X);let ce=P.toneMapping;P.toneMapping=ti;let me=H.viewport;if(H.viewport!==void 0&&(H.viewport=void 0),b.setupLightsView(H),Gt===!0&&It.setGlobalState(P.clippingPlanes,H),Ro(v,X,H),Z.updateMultisampleRenderTarget(_t),Z.updateRenderTargetMipmap(_t),Pt.has("WEBGL_multisampled_render_to_texture")===!1){let Ct=!1;for(let ve=0,ze=D.length;ve<ze;ve++){let Ie=D[ve],{object:we,geometry:Qe,material:vt,group:on}=Ie;if(vt.side===Wn&&we.layers.test(H.layers)){let _e=vt.side;vt.side=pn,vt.needsUpdate=!0,xu(we,X,H,Qe,vt,on),vt.side=_e,vt.needsUpdate=!0,Ct=!0}}Ct===!0&&(Z.updateMultisampleRenderTarget(_t),Z.updateRenderTargetMipmap(_t))}P.setRenderTarget(gt,At,Ft),P.setClearColor(pe,Xt),me!==void 0&&(H.viewport=me),P.toneMapping=ce}function Ro(v,D,X){let H=D.isScene===!0?D.overrideMaterial:null;for(let G=0,_t=v.length;G<_t;G++){let St=v[G],{object:gt,geometry:At,group:Ft}=St,ce=St.material;ce.allowOverride===!0&&H!==null&&(ce=H),gt.layers.test(X.layers)&&xu(gt,D,X,At,ce,Ft)}}function xu(v,D,X,H,G,_t){B!==null&&G.isNodeMaterial&&B.setObject(v,G),v.onBeforeRender(P,D,X,H,G,_t),v.modelViewMatrix.multiplyMatrices(X.matrixWorldInverse,v.matrixWorld),v.normalMatrix.getNormalMatrix(v.modelViewMatrix),G.onBeforeRender(P,D,X,H,v,_t),G.transparent===!0&&G.side===Wn&&G.forceSinglePass===!1?(G.side=pn,G.needsUpdate=!0,P.renderBufferDirect(X,D,H,G,v,_t),G.side=as,G.needsUpdate=!0,P.renderBufferDirect(X,D,H,G,v,_t),G.side=Wn):P.renderBufferDirect(X,D,H,G,v,_t),v.onAfterRender(P,D,X,H,G,_t)}function Po(v,D,X){D.isScene!==!0&&(D=be);let H=z.get(v),G=b.state.lights,_t=b.state.shadowsArray,St=G.state.version,gt=at.getParameters(v,G.state,_t,D,X,b.state.lightProbeGridArray),At=at.getProgramCacheKey(gt),Ft=H.programs;H.environment=v.isMeshStandardMaterial||v.isMeshLambertMaterial||v.isMeshPhongMaterial?D.environment:null,H.fog=D.fog;let ce=v.isMeshStandardMaterial||v.isMeshLambertMaterial&&!v.envMap||v.isMeshPhongMaterial&&!v.envMap;H.envMap=st.get(v.envMap||H.environment,ce),H.envMapRotation=H.environment!==null&&v.envMap===null?D.environmentRotation:v.envMapRotation,Ft===void 0&&(v.addEventListener("dispose",An),Ft=new Map,H.programs=Ft);let me=Ft.get(At);if(me!==void 0){if(H.currentProgram===me&&H.lightsStateVersion===St)return vu(v,gt),me}else gt.uniforms=at.getUniforms(v),B!==null&&v.isNodeMaterial&&B.build(v,X,gt),v.onBeforeCompile(gt,P),me=at.acquireProgram(gt,At),Ft.set(At,me),H.uniforms=gt.uniforms;let Ct=H.uniforms;return(!v.isShaderMaterial&&!v.isRawShaderMaterial||v.clipping===!0)&&(Ct.clippingPlanes=It.uniform),vu(v,gt),H.needsLights=Pp(v),H.lightsStateVersion=St,H.needsLights&&(Ct.ambientLightColor.value=G.state.ambient,Ct.lightProbe.value=G.state.probe,Ct.sunLights.value=G.state.sun,Ct.sunLightShadows.value=G.state.sunShadow,Ct.directionalLights.value=G.state.directional,Ct.directionalLightShadows.value=G.state.directionalShadow,Ct.spotLights.value=G.state.spot,Ct.spotLightShadows.value=G.state.spotShadow,Ct.rectAreaLights.value=G.state.rectArea,Ct.ltc_1.value=G.state.rectAreaLTC1,Ct.ltc_2.value=G.state.rectAreaLTC2,Ct.pointLights.value=G.state.point,Ct.pointLightShadows.value=G.state.pointShadow,Ct.hemisphereLights.value=G.state.hemi,Ct.sunShadowMatrix.value=G.state.sunShadowMatrix,Ct.sunShadowCascade.value=G.state.sunShadowCascade,Ct.directionalShadowMatrix.value=G.state.directionalShadowMatrix,Ct.spotLightMatrix.value=G.state.spotLightMatrix,Ct.spotLightMap.value=G.state.spotLightMap,Ct.pointShadowMatrix.value=G.state.pointShadowMatrix),H.lightProbeGrid=b.state.lightProbeGridArray.length>0,H.currentProgram=me,H.uniformsList=null,me}function yu(v){if(v.uniformsList===null){let D=v.currentProgram.getUniforms();v.uniformsList=wr.seqWithValue(D.seq,v.uniforms)}return v.uniformsList}function vu(v,D){let X=z.get(v);X.outputColorSpace=D.outputColorSpace,X.batching=D.batching,X.batchingColor=D.batchingColor,X.instancing=D.instancing,X.instancingColor=D.instancingColor,X.instancingMorph=D.instancingMorph,X.skinning=D.skinning,X.morphTargets=D.morphTargets,X.morphNormals=D.morphNormals,X.morphColors=D.morphColors,X.morphTargetsCount=D.morphTargetsCount,X.numClippingPlanes=D.numClippingPlanes,X.numIntersection=D.numClipIntersection,X.vertexAlphas=D.vertexAlphas,X.vertexTangents=D.vertexTangents,X.toneMapping=D.toneMapping}function Ap(v,D){if(v.length===0)return null;if(v.length===1)return v[0].texture!==null?v[0]:null;M.setFromMatrixPosition(D.matrixWorld);for(let X=0,H=v.length;X<H;X++){let G=v[X];if(G.texture!==null&&G.boundingBox.containsPoint(M))return G}return null}function Cp(v,D,X,H,G){D.isScene!==!0&&(D=be),Z.resetTextureUnits();let _t=D.fog,St=H.isMeshStandardMaterial||H.isMeshLambertMaterial||H.isMeshPhongMaterial?D.environment:null,gt=et===null?P.outputColorSpace:et.isXRRenderTarget===!0?et.texture.colorSpace:ge.workingColorSpace,At=H.isMeshStandardMaterial||H.isMeshLambertMaterial&&!H.envMap||H.isMeshPhongMaterial&&!H.envMap,Ft=st.get(H.envMap||St,At),ce=H.vertexColors===!0&&!!X.attributes.color&&X.attributes.color.itemSize===4,me=!!X.attributes.tangent&&(!!H.normalMap||H.anisotropy>0),Ct=!!X.morphAttributes.position,ve=!!X.morphAttributes.normal,ze=!!X.morphAttributes.color,Ie=ti;H.toneMapped&&(et===null||et.isXRRenderTarget===!0)&&(Ie=P.toneMapping);let we=X.morphAttributes.position||X.morphAttributes.normal||X.morphAttributes.color,Qe=we!==void 0?we.length:0,vt=z.get(H),on=b.state.lights;if(Gt===!0&&(Bt===!0||v!==q)){let Re=v===q&&H.id===U;It.setState(H,v,Re)}let _e=!1;H.version===vt.__version?(vt.needsLights&&vt.lightsStateVersion!==on.state.version||vt.outputColorSpace!==gt||G.isBatchedMesh&&vt.batching===!1||!G.isBatchedMesh&&vt.batching===!0||G.isBatchedMesh&&vt.batchingColor===!0&&G._colorsTexture===null||G.isBatchedMesh&&vt.batchingColor===!1&&G._colorsTexture!==null||G.isInstancedMesh&&vt.instancing===!1||!G.isInstancedMesh&&vt.instancing===!0||G.isSkinnedMesh&&vt.skinning===!1||!G.isSkinnedMesh&&vt.skinning===!0||G.isInstancedMesh&&vt.instancingColor===!0&&G.instanceColor===null||G.isInstancedMesh&&vt.instancingColor===!1&&G.instanceColor!==null||G.isInstancedMesh&&vt.instancingMorph===!0&&G.morphTexture===null||G.isInstancedMesh&&vt.instancingMorph===!1&&G.morphTexture!==null||vt.envMap!==Ft||H.fog===!0&&vt.fog!==_t||vt.numClippingPlanes!==void 0&&(vt.numClippingPlanes!==It.numPlanes||vt.numIntersection!==It.numIntersection)||vt.vertexAlphas!==ce||vt.vertexTangents!==me||vt.morphTargets!==Ct||vt.morphNormals!==ve||vt.morphColors!==ze||vt.toneMapping!==Ie||vt.morphTargetsCount!==Qe||!!vt.lightProbeGrid!=b.state.lightProbeGridArray.length>0)&&(_e=!0):(_e=!0,vt.__version=H.version);let Bn=vt.currentProgram;_e===!0&&(Bn=Po(H,D,G),B&&H.isNodeMaterial&&B.onUpdateProgram(H,Bn,vt));let ai=!1,zi=!1,Ls=!1,Ee=Bn.getUniforms(),ke=vt.uniforms;if(_.useProgram(Bn.program)&&(ai=!0,zi=!0,Ls=!0),H.id!==U&&(U=H.id,zi=!0),vt.needsLights){let Re=Ap(b.state.lightProbeGridArray,G);vt.lightProbeGrid!==Re&&(vt.lightProbeGrid=Re,zi=!0)}if(ai||q!==v){_.buffers.depth.getReversed()&&v.reversedDepth!==!0&&(v._reversedDepth=!0,v.updateProjectionMatrix()),Ee.setValue(R,"projectionMatrix",v.projectionMatrix),Ee.setValue(R,"viewMatrix",v.matrixWorldInverse);let Hi=Ee.map.cameraPosition;Hi!==void 0&&Hi.setValue(R,Qt.setFromMatrixPosition(v.matrixWorld)),E.logarithmicDepthBuffer&&Ee.setValue(R,"logDepthBufFC",2/(Math.log(v.far+1)/Math.LN2)),(H.isMeshPhongMaterial||H.isMeshToonMaterial||H.isMeshLambertMaterial||H.isMeshBasicMaterial||H.isMeshStandardMaterial||H.isShaderMaterial)&&Ee.setValue(R,"isOrthographic",v.isOrthographicCamera===!0),q!==v&&(q=v,zi=!0,Ls=!0)}if(vt.needsLights&&(on.state.sunShadowMap.length>0&&Ee.setValue(R,"sunShadowMap",on.state.sunShadowMap,Z),on.state.directionalShadowMap.length>0&&Ee.setValue(R,"directionalShadowMap",on.state.directionalShadowMap,Z),on.state.spotShadowMap.length>0&&Ee.setValue(R,"spotShadowMap",on.state.spotShadowMap,Z),on.state.pointShadowMap.length>0&&Ee.setValue(R,"pointShadowMap",on.state.pointShadowMap,Z)),G.isSkinnedMesh){Ee.setOptional(R,G,"bindMatrix"),Ee.setOptional(R,G,"bindMatrixInverse");let Re=G.skeleton;Re&&(Re.boneTexture===null&&Re.computeBoneTexture(),Ee.setValue(R,"boneTexture",Re.boneTexture,Z))}G.isBatchedMesh&&(Ee.setOptional(R,G,"batchingTexture"),Ee.setValue(R,"batchingTexture",G._matricesTexture,Z),Ee.setOptional(R,G,"batchingIdTexture"),Ee.setValue(R,"batchingIdTexture",G._indirectTexture,Z),Ee.setOptional(R,G,"batchingColorTexture"),G._colorsTexture!==null&&Ee.setValue(R,"batchingColorTexture",G._colorsTexture,Z));let Vi=X.morphAttributes;if((Vi.position!==void 0||Vi.normal!==void 0||Vi.color!==void 0)&&N.update(G,X,Bn),(zi||vt.receiveShadow!==G.receiveShadow)&&(vt.receiveShadow=G.receiveShadow,Ee.setValue(R,"receiveShadow",G.receiveShadow)),(H.isMeshStandardMaterial||H.isMeshLambertMaterial||H.isMeshPhongMaterial)&&H.envMap===null&&D.environment!==null&&(ke.envMapIntensity.value=D.environmentIntensity),ke.dfgLUT!==void 0&&(ke.dfgLUT.value=Iy()),zi){if(Ee.setValue(R,"toneMappingExposure",P.toneMappingExposure),vt.needsLights&&Rp(ke,Ls),_t&&H.fog===!0&&Ut.refreshFogUniforms(ke,_t),Ut.refreshMaterialUniforms(ke,H,K,Y,b.state.transmissionRenderTarget[v.id]),vt.needsLights&&vt.lightProbeGrid){let Re=vt.lightProbeGrid;ke.probesSH.value=Re.texture,ke.probesMin.value.copy(Re.boundingBox.min),ke.probesMax.value.copy(Re.boundingBox.max),ke.probesResolution.value.copy(Re.resolution)}wr.upload(R,yu(vt),ke,Z)}if(H.isShaderMaterial&&H.uniformsNeedUpdate===!0&&(wr.upload(R,yu(vt),ke,Z),H.uniformsNeedUpdate=!1),H.isSpriteMaterial&&Ee.setValue(R,"center",G.center),Ee.setValue(R,"modelViewMatrix",G.modelViewMatrix),Ee.setValue(R,"normalMatrix",G.normalMatrix),Ee.setValue(R,"modelMatrix",G.matrixWorld),H.uniformsGroups!==void 0){let Re=H.uniformsGroups;for(let Hi=0,Ds=Re.length;Hi<Ds;Hi++){let Su=Re[Hi];nt.update(Su,Bn),nt.bind(Su,Bn)}}return Bn}function Rp(v,D){v.ambientLightColor.needsUpdate=D,v.lightProbe.needsUpdate=D,v.sunLights.needsUpdate=D,v.sunLightShadows.needsUpdate=D,v.directionalLights.needsUpdate=D,v.directionalLightShadows.needsUpdate=D,v.pointLights.needsUpdate=D,v.pointLightShadows.needsUpdate=D,v.spotLights.needsUpdate=D,v.spotLightShadows.needsUpdate=D,v.rectAreaLights.needsUpdate=D,v.hemisphereLights.needsUpdate=D}function Pp(v){return v.isMeshLambertMaterial||v.isMeshToonMaterial||v.isMeshPhongMaterial||v.isMeshStandardMaterial||v.isShadowMaterial||v.isShaderMaterial&&v.lights===!0}this.getActiveCubeFace=function(){return W},this.getActiveMipmapLevel=function(){return J},this.getRenderTarget=function(){return et},this.setRenderTargetTextures=function(v,D,X){let H=z.get(v);H.__autoAllocateDepthBuffer=v.resolveDepthBuffer===!1,H.__autoAllocateDepthBuffer===!1&&(H.__useRenderToTexture=!1),z.get(v.texture).__webglTexture=D,z.get(v.depthTexture).__webglTexture=H.__autoAllocateDepthBuffer?void 0:X,H.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(v,D){let X=z.get(v);X.__webglFramebuffer=D,X.__useDefaultFramebuffer=D===void 0},this.setRenderTarget=function(v,D=0,X=0){et=v,W=D,J=X;let H=null,G=!1,_t=!1;if(v){let gt=z.get(v);if(gt.__useDefaultFramebuffer!==void 0){_.bindFramebuffer(R.FRAMEBUFFER,gt.__webglFramebuffer),j.copy(v.viewport),yt.copy(v.scissor),bt=v.scissorTest,_.viewport(j),_.scissor(yt),_.setScissorTest(bt),U=-1;return}else if(gt.__webglFramebuffer===void 0)Z.setupRenderTarget(v);else if(gt.__hasExternalTextures)Z.rebindTextures(v,z.get(v.texture).__webglTexture,z.get(v.depthTexture).__webglTexture);else if(v.depthBuffer){let ce=v.depthTexture;if(gt.__boundDepthTexture!==ce){if(ce!==null&&z.has(ce)&&(v.width!==ce.image.width||v.height!==ce.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");Z.setupDepthRenderbuffer(v)}}let At=v.texture;(At.isData3DTexture||At.isDataArrayTexture||At.isCompressedArrayTexture)&&(_t=!0);let Ft=z.get(v).__webglFramebuffer;v.isWebGLCubeRenderTarget?(Array.isArray(Ft[D])?H=Ft[D][X]:H=Ft[D],G=!0):v.samples>0&&Z.useMultisampledRTT(v)===!1?H=z.get(v).__webglMultisampledFramebuffer:Array.isArray(Ft)?H=Ft[X]:H=Ft,j.copy(v.viewport),yt.copy(v.scissor),bt=v.scissorTest}else j.copy(ot).multiplyScalar(K).floor(),yt.copy(ut).multiplyScalar(K).floor(),bt=qt;if(X!==0&&(H=V),_.bindFramebuffer(R.FRAMEBUFFER,H)&&_.drawBuffers(v,H),_.viewport(j),_.scissor(yt),_.setScissorTest(bt),G){let gt=z.get(v.texture);R.framebufferTexture2D(R.FRAMEBUFFER,R.COLOR_ATTACHMENT0,R.TEXTURE_CUBE_MAP_POSITIVE_X+D,gt.__webglTexture,X)}else if(_t){let gt=D;for(let At=0;At<v.textures.length;At++){let Ft=z.get(v.textures[At]);R.framebufferTextureLayer(R.FRAMEBUFFER,R.COLOR_ATTACHMENT0+At,Ft.__webglTexture,X,gt)}}else if(v!==null&&X!==0){let gt=z.get(v.texture);R.framebufferTexture2D(R.FRAMEBUFFER,R.COLOR_ATTACHMENT0,R.TEXTURE_2D,gt.__webglTexture,X)}U=-1};function Mu(v){let D=z.get(v);return(D.__readFormat!==v.format||D.__readType!==v.type)&&(D.__readFormat=v.format,D.__readType=v.type,D.__formatReadable=E.textureFormatReadable(v.format),D.__typeReadable=E.textureTypeReadable(v.type)),D}this.readRenderTargetPixels=function(v,D,X,H,G,_t,St,gt=0){if(!(v&&v.isWebGLRenderTarget)){Zt("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let At=z.get(v).__webglFramebuffer;if(v.isWebGLCubeRenderTarget&&St!==void 0&&(At=At[St]),At){_.bindFramebuffer(R.FRAMEBUFFER,At);try{let Ft=v.textures[gt],ce=Ft.format,me=Ft.type;v.textures.length>1&&R.readBuffer(R.COLOR_ATTACHMENT0+gt);let Ct=Mu(Ft);if(Ct.__formatReadable===!1){Zt("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(Ct.__typeReadable===!1){Zt("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}D>=0&&D<=v.width-H&&X>=0&&X<=v.height-G&&R.readPixels(D,X,H,G,lt.convert(ce),lt.convert(me),_t)}finally{let Ft=et!==null?z.get(et).__webglFramebuffer:null;_.bindFramebuffer(R.FRAMEBUFFER,Ft)}}},this.readRenderTargetPixelsAsync=async function(v,D,X,H,G,_t,St,gt=0){if(!(v&&v.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let At=z.get(v).__webglFramebuffer;if(v.isWebGLCubeRenderTarget&&St!==void 0&&(At=At[St]),At)if(D>=0&&D<=v.width-H&&X>=0&&X<=v.height-G){_.bindFramebuffer(R.FRAMEBUFFER,At);let Ft=v.textures[gt],ce=Ft.format,me=Ft.type;v.textures.length>1&&R.readBuffer(R.COLOR_ATTACHMENT0+gt);let Ct=Mu(Ft);if(Ct.__formatReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(Ct.__typeReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");let ve=R.createBuffer();R.bindBuffer(R.PIXEL_PACK_BUFFER,ve),R.bufferData(R.PIXEL_PACK_BUFFER,_t.byteLength,R.STREAM_READ),R.readPixels(D,X,H,G,lt.convert(ce),lt.convert(me),0),R.bindBuffer(R.PIXEL_PACK_BUFFER,null);let ze=et!==null?z.get(et).__webglFramebuffer:null;_.bindFramebuffer(R.FRAMEBUFFER,ze);let Ie=R.fenceSync(R.SYNC_GPU_COMMANDS_COMPLETE,0);return R.flush(),await yf(R,Ie,4),R.bindBuffer(R.PIXEL_PACK_BUFFER,ve),R.getBufferSubData(R.PIXEL_PACK_BUFFER,0,_t),R.bindBuffer(R.PIXEL_PACK_BUFFER,null),R.deleteBuffer(ve),R.deleteSync(Ie),_t}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(v,D=null,X=0){let H=Math.pow(2,-X),G=Math.floor(v.image.width*H),_t=Math.floor(v.image.height*H),St=D!==null?D.x:0,gt=D!==null?D.y:0;Z.setTexture2D(v,0),R.copyTexSubImage2D(R.TEXTURE_2D,X,0,0,St,gt,G,_t),_.unbindTexture()},this.copyTextureToTexture=function(v,D,X=null,H=null,G=0,_t=0){let St,gt,At,Ft,ce,me,Ct,ve,ze,Ie=v.isCompressedTexture?v.mipmaps[_t]:v.image;if(X!==null)St=X.max.x-X.min.x,gt=X.max.y-X.min.y,At=X.isBox3?X.max.z-X.min.z:1,Ft=X.min.x,ce=X.min.y,me=X.isBox3?X.min.z:0;else{let ke=Math.pow(2,-G);St=Math.floor(Ie.width*ke),gt=Math.floor(Ie.height*ke),v.isDataArrayTexture?At=Ie.depth:v.isData3DTexture?At=Math.floor(Ie.depth*ke):At=1,Ft=0,ce=0,me=0}H!==null?(Ct=H.x,ve=H.y,ze=H.z):(Ct=0,ve=0,ze=0);let we=lt.convert(D.format),Qe=lt.convert(D.type),vt;D.isData3DTexture?(Z.setTexture3D(D,0),vt=R.TEXTURE_3D):D.isDataArrayTexture||D.isCompressedArrayTexture?(Z.setTexture2DArray(D,0),vt=R.TEXTURE_2D_ARRAY):(Z.setTexture2D(D,0),vt=R.TEXTURE_2D),_.activeTexture(R.TEXTURE0),_.pixelStorei(R.UNPACK_FLIP_Y_WEBGL,D.flipY),_.pixelStorei(R.UNPACK_PREMULTIPLY_ALPHA_WEBGL,D.premultiplyAlpha),_.pixelStorei(R.UNPACK_ALIGNMENT,D.unpackAlignment);let on=_.getParameter(R.UNPACK_ROW_LENGTH),_e=_.getParameter(R.UNPACK_IMAGE_HEIGHT),Bn=_.getParameter(R.UNPACK_SKIP_PIXELS),ai=_.getParameter(R.UNPACK_SKIP_ROWS),zi=_.getParameter(R.UNPACK_SKIP_IMAGES);_.pixelStorei(R.UNPACK_ROW_LENGTH,Ie.width),_.pixelStorei(R.UNPACK_IMAGE_HEIGHT,Ie.height),_.pixelStorei(R.UNPACK_SKIP_PIXELS,Ft),_.pixelStorei(R.UNPACK_SKIP_ROWS,ce),_.pixelStorei(R.UNPACK_SKIP_IMAGES,me);let Ls=v.isDataArrayTexture||v.isData3DTexture,Ee=D.isDataArrayTexture||D.isData3DTexture;if(v.isDepthTexture){let ke=z.get(v),Vi=z.get(D),Re=z.get(ke.__renderTarget),Hi=z.get(Vi.__renderTarget);_.bindFramebuffer(R.READ_FRAMEBUFFER,Re.__webglFramebuffer),_.bindFramebuffer(R.DRAW_FRAMEBUFFER,Hi.__webglFramebuffer);for(let Ds=0;Ds<At;Ds++)Ls&&(R.framebufferTextureLayer(R.READ_FRAMEBUFFER,R.COLOR_ATTACHMENT0,z.get(v).__webglTexture,G,me+Ds),R.framebufferTextureLayer(R.DRAW_FRAMEBUFFER,R.COLOR_ATTACHMENT0,z.get(D).__webglTexture,_t,ze+Ds)),R.blitFramebuffer(Ft,ce,St,gt,Ct,ve,St,gt,R.DEPTH_BUFFER_BIT,R.NEAREST);_.bindFramebuffer(R.READ_FRAMEBUFFER,null),_.bindFramebuffer(R.DRAW_FRAMEBUFFER,null)}else if(G!==0||v.isRenderTargetTexture||z.has(v)){let ke=z.get(v),Vi=z.get(D);_.bindFramebuffer(R.READ_FRAMEBUFFER,I),_.bindFramebuffer(R.DRAW_FRAMEBUFFER,k);for(let Re=0;Re<At;Re++)Ls?R.framebufferTextureLayer(R.READ_FRAMEBUFFER,R.COLOR_ATTACHMENT0,ke.__webglTexture,G,me+Re):R.framebufferTexture2D(R.READ_FRAMEBUFFER,R.COLOR_ATTACHMENT0,R.TEXTURE_2D,ke.__webglTexture,G),Ee?R.framebufferTextureLayer(R.DRAW_FRAMEBUFFER,R.COLOR_ATTACHMENT0,Vi.__webglTexture,_t,ze+Re):R.framebufferTexture2D(R.DRAW_FRAMEBUFFER,R.COLOR_ATTACHMENT0,R.TEXTURE_2D,Vi.__webglTexture,_t),G!==0?R.blitFramebuffer(Ft,ce,St,gt,Ct,ve,St,gt,R.COLOR_BUFFER_BIT,R.NEAREST):Ee?R.copyTexSubImage3D(vt,_t,Ct,ve,ze+Re,Ft,ce,St,gt):R.copyTexSubImage2D(vt,_t,Ct,ve,Ft,ce,St,gt);_.bindFramebuffer(R.READ_FRAMEBUFFER,null),_.bindFramebuffer(R.DRAW_FRAMEBUFFER,null)}else Ee?v.isDataTexture||v.isData3DTexture?R.texSubImage3D(vt,_t,Ct,ve,ze,St,gt,At,we,Qe,Ie.data):D.isCompressedArrayTexture?R.compressedTexSubImage3D(vt,_t,Ct,ve,ze,St,gt,At,we,Ie.data):R.texSubImage3D(vt,_t,Ct,ve,ze,St,gt,At,we,Qe,Ie):v.isDataTexture?R.texSubImage2D(R.TEXTURE_2D,_t,Ct,ve,St,gt,we,Qe,Ie.data):v.isCompressedTexture?R.compressedTexSubImage2D(R.TEXTURE_2D,_t,Ct,ve,Ie.width,Ie.height,we,Ie.data):R.texSubImage2D(R.TEXTURE_2D,_t,Ct,ve,St,gt,we,Qe,Ie);_.pixelStorei(R.UNPACK_ROW_LENGTH,on),_.pixelStorei(R.UNPACK_IMAGE_HEIGHT,_e),_.pixelStorei(R.UNPACK_SKIP_PIXELS,Bn),_.pixelStorei(R.UNPACK_SKIP_ROWS,ai),_.pixelStorei(R.UNPACK_SKIP_IMAGES,zi),_t===0&&D.generateMipmaps&&R.generateMipmap(vt),_.unbindTexture()},this.initRenderTarget=function(v){z.get(v).__webglFramebuffer===void 0&&Z.setupRenderTarget(v)},this.initTexture=function(v){v.isCubeTexture?Z.setTextureCube(v,0):v.isData3DTexture?Z.setTexture3D(v,0):v.isDataArrayTexture||v.isCompressedArrayTexture?Z.setTexture2DArray(v,0):Z.setTexture2D(v,0),_.unbindTexture()},this.resetState=function(){W=0,J=0,et=null,_.reset(),mt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return jn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;let e=this.getContext();e.drawingBufferColorSpace=ge._getDrawingBufferColorSpace(t),e.unpackColorSpace=ge._getUnpackColorSpace()}};var tp={type:"change"},ou={type:"start"},np={type:"end"},nc=new ws,ep=new Ln,Ly=Math.cos(70*Nh.DEG2RAD),Ze=new L,Tn=2*Math.PI,Te={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},ru=1e-6,ic=class extends fo{constructor(t,e=null){super(t,e),this.state=Te.NONE,this.target=new L,this.cursor=new L,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.keyRotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:rs.ROTATE,MIDDLE:rs.DOLLY,RIGHT:rs.PAN},this.touches={ONE:os.ROTATE,TWO:os.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._cursorStyle="auto",this._domElementKeyEvents=null,this._lastPosition=new L,this._lastQuaternion=new Dn,this._lastTargetPosition=new L,this._quat=new Dn().setFromUnitVectors(t.up,new L(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new xr,this._sphericalDelta=new xr,this._scale=1,this._panOffset=new L,this._rotateStart=new Yt,this._rotateEnd=new Yt,this._rotateDelta=new Yt,this._panStart=new Yt,this._panEnd=new Yt,this._panDelta=new Yt,this._dollyStart=new Yt,this._dollyEnd=new Yt,this._dollyDelta=new Yt,this._dollyDirection=new L,this._mouse=new Yt,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=Ny.bind(this),this._onPointerDown=Dy.bind(this),this._onPointerUp=Uy.bind(this),this._onContextMenu=Hy.bind(this),this._onMouseWheel=By.bind(this),this._onKeyDown=ky.bind(this),this._onTouchStart=zy.bind(this),this._onTouchMove=Vy.bind(this),this._onMouseDown=Fy.bind(this),this._onMouseMove=Oy.bind(this),this._interceptControlDown=Gy.bind(this),this._interceptControlUp=Wy.bind(this),this.domElement!==null&&this.connect(this.domElement),this.update()}set cursorStyle(t){this._cursorStyle=t,t==="grab"?this.domElement.style.cursor="grab":this.domElement.style.cursor="auto"}get cursorStyle(){return this._cursorStyle}connect(t){super.connect(t),this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.state=Te.NONE,this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.ownerDocument.removeEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents();let t=this.domElement.getRootNode();t.removeEventListener("keydown",this._interceptControlDown,{capture:!0}),t.removeEventListener("keyup",this._interceptControlUp,{capture:!0}),this._controlActive=!1,this._pointers.length=0,this._pointerPositions={},this.domElement.style.touchAction="",this.domElement.style.cursor="auto"}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(t){t.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=t}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(tp),this.update(),this.state=Te.NONE}pan(t,e){this._pan(t,e),this.update()}dollyIn(t){this._dollyIn(t),this.update()}dollyOut(t){this._dollyOut(t),this.update()}rotateLeft(t){this._rotateLeft(t),this.update()}rotateUp(t){this._rotateUp(t),this.update()}update(t=null){let e=this.object.position;Ze.copy(e).sub(this.target),Ze.applyQuaternion(this._quat),this._spherical.setFromVector3(Ze),this.autoRotate&&this.state===Te.NONE&&this._rotateLeft(this._getAutoRotationAngle(t)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let i=this.minAzimuthAngle,s=this.maxAzimuthAngle;isFinite(i)&&isFinite(s)&&(i<-Math.PI?i+=Tn:i>Math.PI&&(i-=Tn),s<-Math.PI?s+=Tn:s>Math.PI&&(s-=Tn),i<=s?this._spherical.theta=Math.max(i,Math.min(s,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(i+s)/2?Math.max(i,this._spherical.theta):Math.min(s,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let r=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{let o=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),r=o!=this._spherical.radius}if(Ze.setFromSpherical(this._spherical),Ze.applyQuaternion(this._quatInverse),e.copy(this.target).add(Ze),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let o=null;if(this.object.isPerspectiveCamera){let a=Ze.length();o=this._clampDistance(a*this._scale);let l=a-o;this.object.position.addScaledVector(this._dollyDirection,l),this.object.updateMatrixWorld(),r=!!l}else if(this.object.isOrthographicCamera){let a=new L(this._mouse.x,this._mouse.y,0);a.unproject(this.object);let l=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),r=l!==this.object.zoom;let c=new L(this._mouse.x,this._mouse.y,0);c.unproject(this.object),this.object.position.sub(c).add(a),this.object.updateMatrixWorld(),o=Ze.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;o!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(o).add(this.object.position):(nc.origin.copy(this.object.position),nc.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(nc.direction))<Ly?this.object.lookAt(this.target):(ep.setFromNormalAndCoplanarPoint(this.object.up,this.target),nc.intersectPlane(ep,this.target))))}else if(this.object.isOrthographicCamera){let o=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),o!==this.object.zoom&&(this.object.updateProjectionMatrix(),r=!0)}return this._scale=1,this._performCursorZoom=!1,r||this._lastPosition.distanceToSquared(this.object.position)>ru||8*(1-this._lastQuaternion.dot(this.object.quaternion))>ru||this._lastTargetPosition.distanceToSquared(this.target)>ru?(this.dispatchEvent(tp),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(t){return t!==null?Tn/60*this.autoRotateSpeed*t:Tn/60/60*this.autoRotateSpeed}_getZoomScale(t){let e=Math.abs(t*.01);return Math.pow(.95,this.zoomSpeed*e)}_rotateLeft(t){this._sphericalDelta.theta-=t}_rotateUp(t){this._sphericalDelta.phi-=t}_panLeft(t,e){Ze.setFromMatrixColumn(e,0),Ze.multiplyScalar(-t),this._panOffset.add(Ze)}_panUp(t,e){this.screenSpacePanning===!0?Ze.setFromMatrixColumn(e,1):(Ze.setFromMatrixColumn(e,0),Ze.crossVectors(this.object.up,Ze)),Ze.multiplyScalar(t),this._panOffset.add(Ze)}_pan(t,e){let i=this.domElement;if(this.object.isPerspectiveCamera){let s=this.object.position;Ze.copy(s).sub(this.target);let r=Ze.length();r*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*t*r/i.clientHeight,this.object.matrix),this._panUp(2*e*r/i.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(t*(this.object.right-this.object.left)/this.object.zoom/i.clientWidth,this.object.matrix),this._panUp(e*(this.object.top-this.object.bottom)/this.object.zoom/i.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(t){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=t:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(t){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=t:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(t,e){if(!this.zoomToCursor)return;this._performCursorZoom=!0;let i=this.domElement.getBoundingClientRect(),s=t-i.left,r=e-i.top,o=i.width,a=i.height;this._mouse.x=s/o*2-1,this._mouse.y=-(r/a)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(t){return Math.max(this.minDistance,Math.min(this.maxDistance,t))}_handleMouseDownRotate(t){this._rotateStart.set(t.clientX,t.clientY)}_handleMouseDownDolly(t){this._updateZoomParameters(t.clientX,t.clientX),this._dollyStart.set(t.clientX,t.clientY)}_handleMouseDownPan(t){this._panStart.set(t.clientX,t.clientY)}_handleMouseMoveRotate(t){this._rotateEnd.set(t.clientX,t.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);let e=this.domElement;this._rotateLeft(Tn*this._rotateDelta.x/e.clientHeight),this._rotateUp(Tn*this._rotateDelta.y/e.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(t){this._dollyEnd.set(t.clientX,t.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(t){this._panEnd.set(t.clientX,t.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(t){this._updateZoomParameters(t.clientX,t.clientY),t.deltaY<0?this._dollyIn(this._getZoomScale(t.deltaY)):t.deltaY>0&&this._dollyOut(this._getZoomScale(t.deltaY)),this.update()}_handleKeyDown(t){let e=!1;switch(t.code){case this.keys.UP:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateUp(Tn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,this.keyPanSpeed),e=!0;break;case this.keys.BOTTOM:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateUp(-Tn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,-this.keyPanSpeed),e=!0;break;case this.keys.LEFT:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateLeft(Tn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(this.keyPanSpeed,0),e=!0;break;case this.keys.RIGHT:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateLeft(-Tn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(-this.keyPanSpeed,0),e=!0;break}e&&(t.preventDefault(),this.update())}_handleTouchStartRotate(t){if(this._pointers.length===1)this._rotateStart.set(t.pageX,t.pageY);else{let e=this._getSecondPointerPosition(t),i=.5*(t.pageX+e.x),s=.5*(t.pageY+e.y);this._rotateStart.set(i,s)}}_handleTouchStartPan(t){if(this._pointers.length===1)this._panStart.set(t.pageX,t.pageY);else{let e=this._getSecondPointerPosition(t),i=.5*(t.pageX+e.x),s=.5*(t.pageY+e.y);this._panStart.set(i,s)}}_handleTouchStartDolly(t){let e=this._getSecondPointerPosition(t),i=t.pageX-e.x,s=t.pageY-e.y,r=Math.sqrt(i*i+s*s);this._dollyStart.set(0,r)}_handleTouchStartDollyPan(t){this.enableZoom&&this._handleTouchStartDolly(t),this.enablePan&&this._handleTouchStartPan(t)}_handleTouchStartDollyRotate(t){this.enableZoom&&this._handleTouchStartDolly(t),this.enableRotate&&this._handleTouchStartRotate(t)}_handleTouchMoveRotate(t){if(this._pointers.length==1)this._rotateEnd.set(t.pageX,t.pageY);else{let i=this._getSecondPointerPosition(t),s=.5*(t.pageX+i.x),r=.5*(t.pageY+i.y);this._rotateEnd.set(s,r)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);let e=this.domElement;this._rotateLeft(Tn*this._rotateDelta.x/e.clientHeight),this._rotateUp(Tn*this._rotateDelta.y/e.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(t){if(this._pointers.length===1)this._panEnd.set(t.pageX,t.pageY);else{let e=this._getSecondPointerPosition(t),i=.5*(t.pageX+e.x),s=.5*(t.pageY+e.y);this._panEnd.set(i,s)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(t){let e=this._getSecondPointerPosition(t),i=t.pageX-e.x,s=t.pageY-e.y,r=Math.sqrt(i*i+s*s);this._dollyEnd.set(0,r),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);let o=(t.pageX+e.x)*.5,a=(t.pageY+e.y)*.5;this._updateZoomParameters(o,a)}_handleTouchMoveDollyPan(t){this.enableZoom&&this._handleTouchMoveDolly(t),this.enablePan&&this._handleTouchMovePan(t)}_handleTouchMoveDollyRotate(t){this.enableZoom&&this._handleTouchMoveDolly(t),this.enableRotate&&this._handleTouchMoveRotate(t)}_addPointer(t){this._pointers.push(t.pointerId)}_removePointer(t){delete this._pointerPositions[t.pointerId];for(let e=0;e<this._pointers.length;e++)if(this._pointers[e]==t.pointerId){this._pointers.splice(e,1);return}}_isTrackingPointer(t){for(let e=0;e<this._pointers.length;e++)if(this._pointers[e]==t.pointerId)return!0;return!1}_trackPointer(t){let e=this._pointerPositions[t.pointerId];e===void 0&&(e=new Yt,this._pointerPositions[t.pointerId]=e),e.set(t.pageX,t.pageY)}_getSecondPointerPosition(t){let e=t.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[e]}_customWheelEvent(t){let e=t.deltaMode,i={clientX:t.clientX,clientY:t.clientY,deltaY:t.deltaY};switch(e){case 1:i.deltaY*=16;break;case 2:i.deltaY*=100;break}return t.ctrlKey&&!this._controlActive&&(i.deltaY*=10),i}};function Dy(n){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(n.pointerId),this.domElement.ownerDocument.addEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(n)&&(this._addPointer(n),n.pointerType==="touch"?this._onTouchStart(n):this._onMouseDown(n),this._cursorStyle==="grab"&&(this.domElement.style.cursor="grabbing")))}function Ny(n){this.enabled!==!1&&(n.pointerType==="touch"?this._onTouchMove(n):this._onMouseMove(n))}function Uy(n){switch(this._removePointer(n),this._pointers.length){case 0:this.domElement.releasePointerCapture(n.pointerId),this.domElement.ownerDocument.removeEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(np),this.state=Te.NONE,this._cursorStyle==="grab"&&(this.domElement.style.cursor="grab");break;case 1:let t=this._pointers[0],e=this._pointerPositions[t];this._onTouchStart({pointerId:t,pageX:e.x,pageY:e.y});break}}function Fy(n){let t;switch(n.button){case 0:t=this.mouseButtons.LEFT;break;case 1:t=this.mouseButtons.MIDDLE;break;case 2:t=this.mouseButtons.RIGHT;break;default:t=-1}switch(t){case rs.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(n),this.state=Te.DOLLY;break;case rs.ROTATE:if(n.ctrlKey||n.metaKey||n.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(n),this.state=Te.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(n),this.state=Te.ROTATE}break;case rs.PAN:if(n.ctrlKey||n.metaKey||n.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(n),this.state=Te.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(n),this.state=Te.PAN}break;default:this.state=Te.NONE}this.state!==Te.NONE&&this.dispatchEvent(ou)}function Oy(n){switch(this.state){case Te.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(n);break;case Te.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(n);break;case Te.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(n);break}}function By(n){this.enabled===!1||this.enableZoom===!1||this.state!==Te.NONE||(n.preventDefault(),this.dispatchEvent(ou),this._handleMouseWheel(this._customWheelEvent(n)),this.dispatchEvent(np))}function ky(n){this.enabled!==!1&&this._handleKeyDown(n)}function zy(n){switch(this._trackPointer(n),this._pointers.length){case 1:switch(this.touches.ONE){case os.ROTATE:if(this.enableRotate===!1)return;this._handleTouchStartRotate(n),this.state=Te.TOUCH_ROTATE;break;case os.PAN:if(this.enablePan===!1)return;this._handleTouchStartPan(n),this.state=Te.TOUCH_PAN;break;default:this.state=Te.NONE}break;case 2:switch(this.touches.TWO){case os.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(n),this.state=Te.TOUCH_DOLLY_PAN;break;case os.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(n),this.state=Te.TOUCH_DOLLY_ROTATE;break;default:this.state=Te.NONE}break;default:this.state=Te.NONE}this.state!==Te.NONE&&this.dispatchEvent(ou)}function Vy(n){switch(this._trackPointer(n),this.state){case Te.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(n),this.update();break;case Te.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(n),this.update();break;case Te.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(n),this.update();break;case Te.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(n),this.update();break;default:this.state=Te.NONE}}function Hy(n){this.enabled!==!1&&n.preventDefault()}function Gy(n){n.key==="Control"&&(this._controlActive=!0,this.domElement.getRootNode().addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function Wy(n){n.key==="Control"&&(this._controlActive=!1,this.domElement.getRootNode().removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}var au=n=>["space-points","ellipsoid","line-plane","point-projection"].includes(n);function ip(n){let t=n,e=t.kind,i=14806692,s=12900275,r=document.createElement("div");r.className="scene-live-label",t.host.append(r);let o=(a,l=.055)=>{let c=t.mesh(new fn(l,14,10),i,1);return c.position.set(...a),c};if(e==="space-points"){let a=[-1.5,-.9,-.8],l=[1.5,1.05,.9];o(a),o(l),t.line([a,l],i,1),t.line([a,[l[0],a[1],a[2]],[l[0],l[1],a[2]],l],s,.5,!0);let c=o(a,.09);for(let u=0;u<3;u++){let d=[...a];d[u]+=3.3,t.line([a,d],s,.2)}t.updates.push(u=>{let d=.5+.43*Math.sin(u*.38);c.position.set(...a.map((h,f)=>(1-d)*h+d*l[f])),r.textContent="AP : PB = "+d.toFixed(2)+" : "+(1-d).toFixed(2)})}else if(e==="ellipsoid"){let u=t.mesh(new fn(1,56,36),7445365,.28);u.scale.set(2,1.6,1.6);let d=new _i(new Oi(new fn(1,24,16)),new Sn({color:s,transparent:!0,opacity:.15}));d.scale.copy(u.scale),t.group.add(d),o([-1.2,0,0]),o([1.2,0,0]);let h=o([2,0,0],.075),f=t.line([[-1.2,0,0],[2,0,0]],i,.9),m=t.line([[1.2,0,0],[2,0,0]],i,.9),x=t.line([[0,0,0],[0,0,0]],s,.7);t.updates.push(g=>{let p=g*.25+.5,S=g*.15+.5,A=[2*Math.cos(p),1.6*Math.sin(p)*Math.cos(S),1.6*Math.sin(p)*Math.sin(S)];h.position.set(...A),t.updateLine(f,[[-1.2,0,0],A]),t.updateLine(m,[[1.2,0,0],A]);let M=[];for(let T=0;T<=128;T++){let b=T/128*2*Math.PI;M.push([2*Math.cos(b),1.6*Math.sin(b)*Math.cos(S),1.6*Math.sin(b)*Math.sin(S)])}t.updateLine(x,M),r.textContent="\uB450 \uCD08\uC810\uC744 \uD3EC\uD568\uD558\uB294 \uB2E8\uBA74 \xB7 PF\u2081 + PF\u2082 = 4"})}else if(e==="line-plane"){let a=t.mesh(new dn(4.2,3.1),9414526,.23);a.rotation.x=-Math.PI/2;let l=t.line([[-2,1,0],[2,-1,0]],i,1),c=o([0,1,0]);t.group.add(new ss(new L(0,1,0),new L(0,0,0),1.5,s,.18,.08)),t.updates.push(u=>{let d=Math.floor(u/5)%3,h=d===2?0:1,f=d===0?-.7:0,m=[-2,h-2*f,-.5],x=[2,h+2*f,.5];t.updateLine(l,[m,x]),c.position.set(0,h,0),r.textContent=["\uAD50\uCC28 \xB7 v\xB7n \u2260 0","\uD3C9\uD589 \xB7 v\xB7n = 0, P\uB294 \uD3C9\uBA74 \uBC16","\uD3EC\uD568 \xB7 v\xB7n = 0, P\uB294 \uD3C9\uBA74 \uC704"][d]})}else if(e==="point-projection"){let a=t.mesh(new dn(4.2,3.1),9414526,.23);a.rotation.x=-Math.PI/2;let l=[-.8,.9,.3],c=[.8,-.9,.3],u=o(l),d=o(c),h=o([0,0,0],.08),f=o([0,0,0],.08),m=[t.line([l,l],s,.6,!0),t.line([c,c],s,.6,!0)];t.line([l,c],s,.3),t.updates.push(x=>{let g=-Math.atan2(1.6,1.8)+.65*Math.sin(x*.25),p=new L(Math.sin(g),Math.cos(g),0);a.quaternion.setFromUnitVectors(new L(0,0,1),p),[l,c].forEach((S,A)=>{let M=new L(...S),T=M.clone().addScaledVector(p,-M.dot(p));(A?f:h).position.copy(T),t.updateLine(m[A],[S,T.toArray()])}),r.textContent="\uCC28\uBCA1\uD130\uAC00 \uAD00\uCC30 \uBC29\uD5A5\uACFC \uD3C9\uD589\uD558\uBA74 \uC815\uC0AC\uC601\uC774 \uACB9\uCE69\uB2C8\uB2E4"})}}function sp(n){let e={riemann:'<path d="M65 215 H295 M75 215 V70"/><path d="M80 215V206H120V179H160V134H200V71H240V215" opacity=".4"/><path d="M80 215 Q160 215 240 71" stroke-width="2"/>',"signed-area":'<path d="M60 138H300 M180 38V230" opacity=".3"/><path d="M80 205L280 71"/><path d="M80 205V138H180Z M180 138H280V71Z" fill="currentColor" fill-opacity=".13"/>',parabola:'<path d="M65 55 Q180 320 295 55"/><path d="M65 222H295" opacity=".5"/><circle cx="180" cy="141" r="4" fill="currentColor"/><path d="M180 141L255 156V222" stroke-dasharray="4 4"/>',rolle:'<path d="M55 80H305 M75 133H285 M100 185H260" opacity=".3"/>'+[55,115,180,235,305].map(i=>'<circle cx="'+i+'" cy="80" r="4"/>').join("")+[85,145,210,275].map(i=>'<circle cx="'+i+'" cy="133" r="4"/>').join("")+[115,180,245].map(i=>'<circle cx="'+i+'" cy="185" r="4"/>').join(""),ellipsoid:'<ellipse cx="180" cy="135" rx="123" ry="78"/><ellipse cx="180" cy="135" rx="123" ry="30" opacity=".5"/><ellipse cx="180" cy="135" rx="45" ry="78" opacity=".3"/><path d="M105 135L205 60L255 135"/><circle cx="105" cy="135" r="3"/><circle cx="255" cy="135" r="3"/>',rotation:'<path d="M55 176H305 M180 50V231" opacity=".3"/><path d="M75 230L285 57 M98 54L274 235" stroke-dasharray="4 4" opacity=".55"/><path d="M80 68Q180 300 280 68" stroke-width="2"/>',compound:'<path d="M60 218H305 M70 218V43" opacity=".3"/><path d="M90 65Q120 179 292 198" stroke-width="2"/><path d="M90 55Q120 173 292 195" stroke-dasharray="5 5" opacity=".6"/>',"tangent-conic":'<ellipse cx="180" cy="135" rx="104" ry="67"/><path d="M284 40V232"/><circle cx="284" cy="135" r="4" fill="currentColor"/>',restore:'<path d="M70 195C150 20 200 247 292 62 M70 218C150 43 200 270 292 85 M70 172C150 -3 200 224 292 39" opacity=".7"/>',"restore-quadratic":'<path d="M65 65Q180 280 295 65 M65 100Q180 315 295 100 M65 30Q180 245 295 30" opacity=".7"/>',model:'<path d="M65 215H300 M80 215V48" opacity=".3"/><path d="M85 210L285 60 M85 210Q250 195 285 60 M85 210C175 210 175 60 285 60" opacity=".7"/>',curvature:'<path d="M70 222C150 222 206 50 290 50" stroke-width="2"/><path d="M100 228L260 45" stroke-dasharray="5 5" opacity=".5"/><circle cx="180" cy="137" r="5"/>',ratio:'<path d="M62 200C128 -40 205 300 298 60"/><path d="M114 222H245 M114 215V229 M180 215V229 M245 215V229" opacity=".5"/><circle cx="114" cy="105" r="4"/><circle cx="180" cy="135" r="4"/><circle cx="245" cy="165" r="4"/>',chain:'<path d="M58 55Q133 300 208 55"/><path d="M165 220C220 220 240 55 299 55"/><circle cx="133" cy="178" r="4"/><circle cx="233" cy="135" r="4"/>',"tangent-count":'<path d="M63 213C123 -15 213 285 300 52"/><path d="M55 180L300 80 M68 230L285 36 M60 108L300 158" opacity=".5"/><circle cx="207" cy="118" r="5" fill="currentColor"/>',"mean-value":'<path d="M70 195Q180 225 285 63"/><path d="M70 195L285 63 M95 230L280 116" opacity=".6"/>',"space-points":'<path d="M78 196L180 155L280 72 M78 196H280V72 M180 155V44 M180 155L285 222" opacity=".65"/><circle cx="78" cy="196" r="5"/><circle cx="280" cy="72" r="5"/><circle cx="180" cy="155" r="5" fill="currentColor"/>',"line-plane":'<path d="M55 175L214 113L305 164L145 225Z" opacity=".4"/><path d="M91 70L268 208 M180 166V45"/><circle cx="180" cy="141" r="5"/>',"point-projection":'<path d="M60 191L214 132L302 181L146 240Z" opacity=".4"/><path d="M110 70L170 186 M205 55L215 167" stroke-dasharray="4 4"/><circle cx="110" cy="70" r="5"/><circle cx="205" cy="55" r="5"/><circle cx="170" cy="186" r="3"/><circle cx="215" cy="167" r="3"/>'}[n];return e?'<svg viewBox="0 0 360 270" aria-hidden="true" focusable="false"><g fill="none" stroke="currentColor" stroke-width="1.4">'+e+"</g></svg>":null}function rp({kind:n,t,phase:e,c:i,path:s,dot:r,green:o,pale:a}){if(!["riemann","signed-area","parabola","rolle","restore","restore-quadratic","ratio","mean-value","chain","model","compound","tangent-conic","tangent-count","rotation","curvature"].includes(n))return!1;let c=(h,f=-200,m=122)=>{i.font="12px sans-serif",i.fillStyle=a,i.fillText(h,f,m)},u=(h,f=-2,m=2,x=85,g=35,p=o,S=2)=>{let A=[];for(let M=f;M<=m+1e-4;M+=(m-f)/150)A.push([M*x,35-h(M)*g]);s(A,p,S)},d=(h,f=a)=>{i.setLineDash([5,5]),s(h,f,1),i.setLineDash([])};if(n==="riemann"){let h=4+Math.floor(18*(.5+.5*Math.sin(t*.28))),f=300/h,m=35,x=-150;for(let p=0;p<h;p++){let S=(p/h)**2*185,A=((p+1)/h)**2*185;i.fillStyle=o+"15",i.fillRect(x+p*f,m-A,f,A),i.strokeStyle=a+"55",i.strokeRect(x+p*f,m-A,f,A),i.strokeStyle=o,i.strokeRect(x+p*f,m-S,f,S)}let g=[];for(let p=0;p<=120;p++){let S=p/120;g.push([x+300*S,m-185*S*S])}s(g),s([[x,m],[150,m]],a,1),c("n = "+h+"   L = "+((h-1)*(2*h-1)/(6*h*h)).toFixed(4)+"   R = "+((h+1)*(2*h+1)/(6*h*h)).toFixed(4),-190,104),c("f(x)=x\xB2 \xB7 [0,1] \xB7 \u222Bf = 1/3",-190,128)}else if(n==="signed-area"){let h=-2+4*(.5+.5*Math.sin(t*.25));for(let f=-2;f<h;f+=.025){let m=f*55;i.fillStyle=f<0?a+"2b":o+"44",i.fillRect(f*85,Math.min(35,35-m),2.5,Math.abs(m))}u(f=>f,-2,2,85,55),r(h*85,35-h*55,5),c("\u222B f = "+((h*h-4)/2).toFixed(2)+"   \u222B |f| = "+(h<0?(4-h*h)/2:2+h*h/2).toFixed(2)),c("f(x)=x \xB7 \uC2DC\uC791\uC810 \u22122",-200,144)}else if(n==="parabola"){let h=.6+.55*(.5+.5*Math.sin(t*.3)),f=1.5*Math.sin(t*.3+.7),m=f*f/(4*h),x=62,g=[0,35-h*x],p=[f*x,35-m*x],S=[f*x,35+h*x];u(A=>A*A/(4*h),-2.4,2.4,x,x),d([[-200,35+h*x],[200,35+h*x]]),s([g,p,S],a,1.2),r(...g,5),r(...p,5),c("F",g[0]+10,g[1]),c("d(P,F) = d(P,\uC900\uC120)",-200,-145)}else if(n==="rolle"){let h=[-2,-1,0,1,2],f=[-Math.sqrt((15+Math.sqrt(145))/10),-Math.sqrt((15-Math.sqrt(145))/10),Math.sqrt((15-Math.sqrt(145))/10),Math.sqrt((15+Math.sqrt(145))/10)];u(x=>x**5-5*x**3+4*x,-2.12,2.12,85,15),h.forEach(x=>r(x*85,35,4));let m=.45+.4*Math.sin(t*.3);for(let x=0;x<4;x++)s([[h[x]*85,77],[h[x+1]*85,77]],a+"60",1),r(f[x]*85,95,5,o+Math.round(m*255).toString(16).padStart(2,"0"));c("f\uC758 \uADFC 5\uAC1C \u2192 f\u2032\uC758 \uADFC 4\uAC1C",-185,132)}else if(n==="restore"||n==="restore-quadratic"){let h=n==="restore"?m=>m**3/3-m:m=>m*m;[-1.2,0,1.2].forEach((m,x)=>u(g=>h(g)+m,-1.8,1.8,86,32,x===1?o:a+"55",x===1?2:1));let f=.9*Math.sin(t*.3);u(m=>h(m)+f,-1.8,1.8,86,32,o+"b0",2),r(86,35-(h(1)+f)*32,5),c(n==="restore"?"\uAC19\uC740 \uB3C4\uD568\uC218 x\xB2\u22121, \uB2EC\uB77C\uC9C0\uB294 \uC801\uBD84\uC0C1\uC218 C":"\uAC19\uC740 \uB3C4\uD568\uC218 2x, \uB2EC\uB77C\uC9C0\uB294 \uC801\uBD84\uC0C1\uC218 C",-205,132)}else if(n==="ratio")u(h=>h**3-3*h,-1.85,1.85,85,28),[[-1,2],[0,0],[1,-2]].forEach(h=>r(h[0]*85,35-h[1]*28,5)),s([[-85,105],[0,105],[85,105]],a,1),[-85,0,85].forEach(h=>s([[h,100],[h,110]],a,1)),c("1",-46,126),c("1",39,126),c("\uBCC0\uACE1\uC810\uC744 \uAE30\uC900\uC73C\uB85C \uB098\uB208 \uC218\uD3C9 \uAC70\uB9AC",-180,-138);else if(n==="mean-value"){u(f=>f*f,-1.5,2.1,80,35),s([[-80,0],[160,-105]],a,1.5);let h=.5+.8*Math.sin(t*.27);s([[-120,35-(h*h+2*h*(-1.5-h))*35],[172,35-(h*h+2*h*(2.15-h))*35]],o,1.3),r(h*80,35-h*h*35,5),c("\uD3C9\uADE0 \uAE30\uC6B8\uAE30 1 = f\u2032(1/2)",-185,130),c("f(x)=x\xB2, \uAD6C\uAC04 [\u22121,2]",-185,151)}else if(n==="chain"){let h=Math.floor(t/6)%3,f=[m=>m*m,m=>m**3,m=>m**4][h];u(f,-1.5,1.5,90,32),r(0,35,5),c(["x\xB2 \xB7 \uB3C4\uD568\uC218 \uBD80\uD638 \u2212 \u2192 + \xB7 \uADF9\uC18C","x\xB3 \xB7 \uB3C4\uD568\uC218 \uBD80\uD638 + \u2192 + \xB7 \uADF9\uAC12 \uC544\uB2D8","x\u2074 \xB7 \uB450 \uC870\uAC74\uC774 \uACB9\uCCD0\uB3C4 \uBD80\uD638 \uD655\uC778"][h],-205,130),c("h\u2032(0)=0 \uB2E4\uC74C\uC5D0, \uC591\uCABD \uBD80\uD638\uB97C \uC77D\uC2B5\uB2C8\uB2E4.",-205,-140)}else if(n==="model")u(h=>1+.3*h,-2,2,80,55,a,1.4),u(h=>Math.exp(.5*h),-2,2,80,55,o,1.7),u(h=>2/(1+Math.exp(-h)),-2,2,80,55,a,1.4),c("\uC77C\uCC28 \xB7 \uC9C0\uC218 \xB7 \uB85C\uC9C0\uC2A4\uD2F1 \uD6C4\uBCF4 \uD568\uC218",-200,120),c("\uC804\uC2DC\uC6A9 \uD568\uC218 \uB3C4\uD574 \xB7 \uD559\uC0DD \uC2E4\uCE21 \uC790\uB8CC \uC544\uB2D8",-200,144);else if(n==="compound"){let h=S=>-180+(S-1)/14*360,f=S=>35-S*2.6,m=S=>Math.log(2)/Math.log(1+S/100),x=[],g=[];for(let S=1.5;S<=15;S+=.07)x.push([h(S),f(m(S))]),g.push([h(S),f(72/S)]);s(x),d(g);let p=3+9*(.5+.5*Math.sin(t*.24));r(h(p),f(m(p)),5),c("r="+p.toFixed(1)+"%  \uC815\uD655\uAC12 "+m(p).toFixed(2)+"\uB144  72/r "+(72/p).toFixed(2)+"\uB144",-205,118),c("\uC5F0 1\uD68C \uBCF5\uB9AC \xB7 \uC77C\uC815\uD55C \uC774\uC728\uC758 \uC218\uD559 \uBAA8\uD615",-205,142)}else if(n==="tangent-conic"){let m=t*.23,x=[];for(let S=0;S<=160;S++){let A=S/160*Math.PI*2;x.push([2*Math.cos(A)*80,35-1*Math.sin(A)*80])}s(x);let g=[2*Math.cos(m),1*Math.sin(m)],p=[-2*Math.sin(m),1*Math.cos(m)];s([[80*(g[0]-2*p[0]),35-80*(g[1]-2*p[1])],[80*(g[0]+2*p[0]),35-80*(g[1]+2*p[1])]],a,1.2),r(g[0]*80,35-g[1]*80,5),c("\uC218\uC9C1\uC778 \uACBD\uC6B0\uC5D0\uB3C4 \uC811\uC810\uACFC \uC911\uADFC\uC740 \uB0A8\uC2B5\uB2C8\uB2E4.",-205,145)}else if(n==="tangent-count"){let h=[-.12,0,.3,1,1.12][Math.floor(t/5)%5],f=g=>2*g**3-3*g*g+h,m=[],x=g=>{m.some(p=>Math.abs(p-g)<1e-5)||m.push(g)};for(let g of[0,1])Math.abs(f(g))<1e-8&&x(g);for(let[g,p]of[[-3,0],[0,1],[1,3]]){let S=g,A=p;if(!(f(S)*f(A)>=0)){for(let M=0;M<45;M++){let T=(S+A)/2;f(S)*f(T)<=0?A=T:S=T}x((S+A)/2)}}u(g=>g**3,-1.3,1.75,85,28),m.forEach(g=>{s([[-110,35-(3*g*g*(-110/85)-2*g**3)*28],[180,35-(3*g*g*(180/85)-2*g**3)*28]],a+"8f",1),r(g*85,35-g**3*28,4)}),r(85,35-h*28,6),c("P(1, "+h+") \xB7 \uC11C\uB85C \uB2E4\uB978 \uC811\uC120 "+m.length+"\uAC1C",-205,136)}else if(n==="rotation"){u(x=>x*x,-1.55,1.55,60,60);let h=.7*Math.sin(t*.22),f=Math.cos(h),m=Math.sin(h);s([[-200*f,35+200*m],[200*f,35-200*m]],o,1.2),s([[200*m,35+200*f],[-200*m,35-200*f]],a,1.2),r(60,-25,5),c("\uC810\uC740 \uADF8\uB300\uB85C \xB7 \uC88C\uD45C\uCD95\uC774 \uD68C\uC804\uD569\uB2C8\uB2E4.",-205,130),c("XY\uD56D\uC758 \uACC4\uC218 = \u2212a sin(2\u03B8)",-205,151)}else if(n==="curvature"){u(m=>m**3,-1.8,1.8,85,26);let h=1.4*Math.sin(t*.3),f=3*h*h;s([[-180,35-(h**3+f*(-180/85-h))*26],[180,35-(h**3+f*(180/85-h))*26]],a,1.1),r(h*85,35-h**3*26,5),c("f(x)=x\xB3 \xB7 f\u2032\u2032(x)=6x \xB7 "+(h<0?"\uAE30\uC6B8\uAE30\uAC00 \uC791\uC544\uC9D1\uB2C8\uB2E4":"\uAE30\uC6B8\uAE30\uAC00 \uCEE4\uC9D1\uB2C8\uB2E4"),-205,136)}return!0}var Fn=14806692,si=14082502,op=6391659,ap=n=>au(n)||["hero","sphere-slice","sphere-vector","distance","slices","hypersphere","projection","vectors","planes","cone","surface"].includes(n);function Ao(n,t=0){let e=sp(n);if(e)return e;let i=(a,l="")=>'<path d="'+a+'" fill="none" stroke="currentColor" stroke-width="1.3" '+l+"/>",s=(a,l,c,u,d="")=>'<line x1="'+a+'" y1="'+l+'" x2="'+c+'" y2="'+u+'" stroke="currentColor" stroke-width="1.1" '+d+"/>",r=(a,l,c,u="")=>'<circle cx="'+a+'" cy="'+l+'" r="'+c+'" fill="none" stroke="currentColor" stroke-width="1.1" '+u+"/>",o="";if(["sphere-slice","sphere-vector","slices","hypersphere","hero"].includes(n)){if(o+=r(180,136,83),o+='<ellipse cx="180" cy="136" rx="33" ry="83" fill="none" stroke="currentColor" opacity=".4"/>',o+='<ellipse cx="180" cy="136" rx="83" ry="27" fill="none" stroke="currentColor" opacity=".5"/>',o+='<ellipse cx="180" cy="113" rx="79" ry="24" fill="currentColor" opacity=".12"/>',o+='<ellipse cx="180" cy="113" rx="79" ry="24" fill="none" stroke="currentColor" stroke-width="2"/>',o+=s(180,136,180,113,'stroke-dasharray="3 4"'),o+=s(180,136,250,123),o+=r(180,136,3,'fill="currentColor"'),n==="slices")for(let a=80;a<205;a+=17){let l=Math.sqrt(Math.max(0,6889-(a-136)**2));o+='<ellipse cx="180" cy="'+a+'" rx="'+l+'" ry="'+l*.25+'" fill="none" stroke="currentColor" opacity=".45"/>'}n==="sphere-vector"&&(o+=s(110,190,237,76,'stroke-width="2"'))}else if(["distance","planes","projection"].includes(n))o+=i("M 63 167 L 214 108 L 302 158 L 151 223 Z",'fill="currentColor" fill-opacity=".06"'),o+=s(175,65,175,172,'stroke-dasharray="4 5"'),o+=s(175,65,260,180),o+=s(175,172,260,180,'opacity=".5"'),o+=i("M175 163 L184 165 L184 174",'opacity=".65"'),o+=r(175,65,4,'fill="currentColor"'),o+=r(175,172,3,'fill="currentColor"'),n==="projection"&&(o+=i("M105 71 L230 84 L247 143 L125 131 Z",'fill="currentColor" fill-opacity=".08"'));else if(n==="cone")o+=i("M105 211 L180 56 L255 211"),o+='<ellipse cx="180" cy="211" rx="75" ry="20" fill="none" stroke="currentColor" opacity=".6"/>',o+=i("M180 56 L129 159 M180 56 L231 159",'opacity=".25"'),o+='<ellipse cx="180" cy="159" rx="51" ry="16" transform="rotate(-18 180 159)" fill="currentColor" fill-opacity=".12" stroke="currentColor" stroke-width="2"/>';else if(n==="vectors")o+=s(85,198,282,198,'opacity=".22"'),o+=s(85,198,251,198,'stroke-width="2.5"'),o+=s(85,198,226,88,'stroke-width="2"'),o+=i("M235 191 L251 198 L235 205"),o+=i("M212 91 L226 88 L222 103"),o+=s(226,88,226,198,'stroke-dasharray="3 5" opacity=".5"'),o+=i("M133 198 Q133 180 121 171",'opacity=".6"');else if(n==="conics")o+='<ellipse cx="180" cy="137" rx="116" ry="70" transform="rotate(-14 180 137)" fill="none" stroke="currentColor" stroke-width="1.6"/>',o+=r(110,155,3,'fill="currentColor"'),o+=r(249,120,3,'fill="currentColor"'),o+=i("M110 155 L203 70 L249 120",'opacity=".4"');else if(n==="reflection")o+=i("M74 73 Q180 300 286 73",'stroke-width="2"'),o+=s(96,45,96,110,'opacity=".6"'),o+=s(96,110,180,157,'stroke-width="1.5"'),o+=s(245,45,245,139,'opacity=".6"'),o+=s(245,139,180,157,'stroke-width="1.5"'),o+=r(180,157,4,'fill="currentColor"'),o+=s(180,57,180,227,'stroke-dasharray="3 5" opacity=".2"');else if(n==="surface"){for(let a=-3;a<=3;a++){let l="";for(let c=-3;c<=3;c+=.25){let u=180+c*26+a*14,d=150+a*16-(c*c-a*a)*4;l+=(l?" L":"M")+u+" "+d}o+=i(l,'opacity=".45"')}o+=i("M78 179 Q180 83 282 179",'stroke-width="2"')}else o+=s(49,207,309,207,'opacity=".23"'),o+=s(132,43,132,235,'opacity=".23"'),n==="area"&&(o+=i("M78 207 C113 100 130 80 170 160 S240 258 284 68 L284 207 Z",'fill="currentColor" fill-opacity=".11"')),["tangents","derivative","area","antiderivative","asymptote"].includes(n)?o+=i("M61 214 C109 38 147 111 179 164 S251 252 298 54",'stroke-width="1.7"'):o+=i("M57 194 Q183 240 291 52",'stroke-width="1.7"'),n==="newton"?o+=i("M291 52 L219 207 L219 157 L180 207 L180 192 L167 207",'opacity=".65"'):n==="asymptote"?o+=s(71,222,291,61,'stroke-dasharray="4 5" opacity=".5"'):n==="join"?o+=i("M180 171 L296 104",'stroke-width="1.6"'):n==="zoom"?(o+=r(201,151,49,'opacity=".6"'),o+=s(235,187,270,224,'opacity=".6"'),o+=s(161,180,245,111,'stroke-dasharray="4 5" opacity=".5"')):o+=s(104,235,281,75,'opacity=".6"'),o+=r(206,151,4,'fill="currentColor"');return'<svg viewBox="0 0 360 270" aria-hidden="true" focusable="false">'+o+"</svg>"}var sc=class{constructor(t,e,i={}){this.host=t,this.kind=e,this.options=i,this.enabled=i.motion!==!1,this.time=0,this.phase=0,this.visible=!0,this.destroyed=!1,this.raf=0;try{ap(e)?(this.init3D(),this.applyPalette()):this.init2D()}catch(s){this.controls?.dispose(),this.renderer?.dispose(),this.renderer?.forceContextLoss(),this.renderer=null,this.scene=null,this.controls=null,t.replaceChildren(),ap(e)?(t.innerHTML=Ao(e),t.dataset.renderer="svg-fallback",this.staticFallback=!0,this.enabled=!1):(this.init2D(),t.dataset.renderer="canvas2d-fallback"),console.warn("\uC804\uC2DC \uB3C4\uD574\uB97C \uB300\uCCB4 \uD654\uBA74\uC73C\uB85C \uD45C\uC2DC\uD569\uB2C8\uB2E4.",s.message)}this.resizeObserver=new ResizeObserver(()=>{this.resize(),this.draw()}),this.resizeObserver.observe(t),this.visibility=new IntersectionObserver(s=>{this.visible=s[0].isIntersecting,this.visible&&this.enabled&&this.start()},{rootMargin:"150px"}),this.visibility.observe(t),this.resize(),this.draw(),this.enabled&&this.start()}init3D(){this.scene=new to,this.camera=new nn(34,1,.1,60),this.camera.position.set(5,3.5,6.5),this.camera.lookAt(0,0,0),this.renderer=new Ql({alpha:!0,antialias:!0,powerPreference:"low-power"}),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,window.innerWidth<700?1.25:1.6)),this.renderer.setClearColor(0,0),this.renderer.outputColorSpace=hn,this.renderer.toneMapping=mo,this.renderer.toneMappingExposure=1.2,this.host.append(this.renderer.domElement),this.host.dataset.renderer="webgl",this.scene.add(new ho(15330805,1779252,2.5));let t=new _r(16777215,3.1);t.position.set(-3,6,4),this.scene.add(t);let e=new _r(12110052,2);e.position.set(5,-2,-3),this.scene.add(e),this.group=new Di,this.scene.add(this.group),this.controls=new ic(this.camera,this.renderer.domElement),this.controls.enablePan=!1,this.controls.enableZoom=!1,this.controls.enableDamping=!0,this.controls.dampingFactor=.065,this.controls.maxPolarAngle=Math.PI*.75,this.controls.minPolarAngle=.3,this.controls.addEventListener("change",()=>{this.raf||this.renderer.render(this.scene,this.camera)}),this.renderer.domElement.style.touchAction="pan-y",this.updates=[],["hero","sphere-slice","sphere-vector","slices","hypersphere"].includes(this.kind)?this.sphere():["distance","planes"].includes(this.kind)?this.distance():this.kind==="projection"?this.projection():this.kind==="vectors"?this.vectors():this.kind==="cone"?this.cone():this.kind==="surface"?this.surface():au(this.kind)&&ip(this)}applyPalette(){if(!Number.isFinite(this.options.hue))return;let t={};this.scene.traverse(e=>{for(let i of Array.isArray(e.material)?e.material:e.material?[e.material]:[])i.color&&(i.color.getHSL(t),t.s>.08&&i.color.setHSL(this.options.hue,Math.min(.62,Math.max(.28,t.s)),t.l))})}material(t=op,e=.75){return new oo({color:t,roughness:.33,metalness:.12,transparent:e<1,opacity:e,side:Wn,depthWrite:e>=1,clearcoat:.7})}mesh(t,e=op,i=.75){let s=new un(t,this.material(e,i));return this.group.add(s),s}line(t,e=Fn,i=.8,s=!1){let r=new Ge().setFromPoints(t.map(l=>new L(...l))),o=s?new ao({color:e,transparent:!0,opacity:i,dashSize:.07,gapSize:.05}):new Sn({color:e,transparent:!0,opacity:i}),a=new As(r,o);return s&&a.computeLineDistances(),this.group.add(a),a}updateLine(t,e){t.geometry.setFromPoints(e.map(i=>new L(...i))),t.material.isLineDashedMaterial&&t.computeLineDistances()}sphere(){let e=this.mesh(new fn(1.65,56,40),6129773,this.kind==="hero"?.38:.28),i=new _i(new Oi(new fn(1.65,24,16)),new Sn({color:12768929,transparent:!0,opacity:.14}));this.group.add(i);let s=this.mesh(new dn(4.5,3.4),11257477,.12);s.rotation.x=-Math.PI/2;let r=this.mesh(new mr(1,.018,8,128),Fn,.95);r.rotation.x=Math.PI/2;let o=this.line([[0,0,0],[1.4,.5,0]],Fn,.7),a=this.line([[0,0,0],[0,.5,0]],si,.6,!0),l=this.mesh(new mr(1.65,.006,4,120),si,.35);if(l.rotation.x=Math.PI/2,this.group.rotation.z=-.13,this.kind==="slices"){e.visible=!1,s.visible=!1,r.visible=!1,o.visible=!1,a.visible=!1;for(let u=-1.45;u<1.5;u+=.24){let d=Math.sqrt(2.7224999999999997-u*u),h=this.mesh(new pr(d,d,.027,64),9613941,.23);h.position.y=u}}let c=this.mesh(new fn(.045,14,10),Fn,1);this.updates.push(u=>{let d=.72*Math.sin(u*.38+this.phase*.8),h=Math.sqrt(1.65*1.65-d*d);if(s.position.y=d,r.position.y=d,r.scale.set(h,h,1),this.updateLine(o,[[0,0,0],[h,d,0]]),this.updateLine(a,[[0,0,0],[0,d,0]]),c.position.set(h,d,0),i.rotation.y=u*.045,this.group.rotation.y=.15+Math.sin(u*.09)*.14,this.kind==="hypersphere"){let f=.85*Math.sin(u*.4),m=Math.sqrt(1-f*f);e.scale.setScalar(m),i.scale.setScalar(m),r.visible=!1,s.visible=!1,o.visible=!1,a.visible=!1,l.scale.setScalar(m),c.visible=!1}if(this.kind==="sphere-vector"){s.visible=!1,r.visible=!1,a.visible=!1;let f=u*.25,m=[1.65*Math.cos(f),1.65*Math.sin(f),0];this.updateLine(o,[[0,0,0],m]),c.position.set(...m)}})}distance(){let t=this.mesh(new dn(4.1,3.3),9414526,.25);t.rotation.x=-Math.PI/2,t.position.y=-.75;let e=this.line([[-2.05,-.75,-1.65],[2.05,-.75,-1.65],[2.05,-.75,1.65],[-2.05,-.75,1.65],[-2.05,-.75,-1.65]],si,.35),i=[.2,1.55,.1],s=[.2,-.75,.1];this.line([i,s],Fn,.95,!0),this.mesh(new fn(.065,16,12),Fn,1).position.set(...i),this.mesh(new fn(.035,12,8),si,1).position.set(...s);let a=this.mesh(new fn(.05,12,8),13687998,1),l=this.line([i,[1,-.75,1]],si,.6),c=this.line([s,[1,-.75,1]],si,.4);this.line([[.2,-.56,.1],[.4,-.56,.1],[.4,-.75,.1]],Fn,.55),this.updates.push(u=>{let d=[.2+1.3*Math.cos(u*.4),-.75,.1+.9*Math.sin(u*.4)];a.position.set(...d),this.updateLine(l,[i,d]),this.updateLine(c,[s,d]),this.group.rotation.y=-.25+Math.sin(u*.1)*.12})}projection(){let t=this.mesh(new dn(3.2,2.1),12111e3,.25);t.rotation.x=-Math.PI/2,t.position.y=-1;let e=this.mesh(new dn(3.2,2.1),8824953,.5);e.position.y=.7;let i=new _i(new ro(e.geometry),new Sn({color:Fn,transparent:!0,opacity:.85}));e.add(i);let s=Array.from({length:4},()=>this.line([[0,0,0],[0,-1,0]],si,.4,!0));this.updates.push(r=>{let o=.35+.7*(.5+.5*Math.sin(r*.35));e.rotation.x=-Math.PI/2+o,t.scale.y=Math.cos(o),[[-1.6,-1.05],[1.6,-1.05],[1.6,1.05],[-1.6,1.05]].forEach((l,c)=>{let u=[l[0],.7+l[1]*Math.sin(o),-l[1]*Math.cos(o)];this.updateLine(s[c],[u,[u[0],-1,u[2]]])}),this.group.rotation.y=-.15})}vectors(){let t=new L(-1.4,-.6,0);this.group.add(new ss(new L(1,0,0),t,2.8,si,.23,.12));let e=new ss(new L(.6,1,0).normalize(),t,2.5,Fn,.23,.12);this.group.add(e);let i=this.line([[0,1,0],[0,-.6,0]],si,.5,!0),s=this.line([[-1.4,-.6,0],[0,-.6,0]],Fn,.7);this.updates.push(r=>{let o=.3+2.5*(.5+.5*Math.sin(r*.35));e.setDirection(new L(Math.cos(o),Math.sin(o),0));let a=-1.4+2.5*Math.cos(o),l=-.6+2.5*Math.sin(o);this.updateLine(i,[[a,l,0],[a,-.6,0]]),this.updateLine(s,[[-1.4,-.6,0],[a,-.6,0]]),this.group.rotation.y=-.2})}cone(){let t=this.mesh(new ts(1.25,2.25,64,1,!0),7445365,.28);t.rotation.z=Math.PI,t.position.y=1.125;let e=this.mesh(new ts(1.25,2.25,64,1,!0),7445365,.22);e.position.y=-1.125;let i=new Sn({color:si,transparent:!0,opacity:.17});for(let a of[t,e]){let l=new _i(new Oi(new ts(1.25,2.25,24,1,!0)),i);l.position.copy(a.position),l.rotation.copy(a.rotation),this.group.add(l)}let s=new Ge().setFromPoints([new L(-2,0,-2),new L(2,0,-2),new L(2,0,2),new L(-2,0,2)]);s.setIndex([0,1,2,0,2,3]),s.computeVertexNormals();let r=this.mesh(s,12899480,.12),o=[];for(let a=0;a<8;a++)o.push(this.line([[0,0,0],[0,0,0]],Fn,.96));this.camera.position.set(6.8,3.5,7.8),this.controls.update(),this.updates.push(a=>{let l=.18+1.05*(.5+.5*Math.sin(a*.23)),c=Math.tan(l),u=.32,d=r.geometry.attributes.position;for(let f=0;f<d.count;f++)d.setY(f,c*d.getX(f)+u);d.needsUpdate=!0,r.geometry.computeVertexNormals();let h=[];for(let f of[1,-1]){let m=[];for(let x=0;x<=250;x++){let g=x/250*Math.PI*2,p=1.25/2.25,S=1-f*p*c*Math.cos(g),A=f*p*u/S,M=A*Math.cos(g),T=A*Math.sin(g),b=c*M+u;A>=0&&A<2&&Math.abs(b)<2.23?m.push([M,b,T]):m.length&&(h.push(m),m=[])}m.length&&h.push(m)}o.forEach((f,m)=>{f.visible=!!h[m]&&h[m].length>1,f.visible&&this.updateLine(f,h[m])})})}surface(){let t=new dn(3.8,3.8,40,40),e=t.attributes.position;for(let a=0;a<e.count;a++){let l=e.getX(a),c=e.getY(a);e.setXYZ(a,l,.22*(l*l-c*c),c)}t.computeVertexNormals(),this.mesh(t,7773814,.5);let i=new _i(new Oi(t),new Sn({color:si,transparent:!0,opacity:.16}));this.group.add(i);let s=this.mesh(new dn(4,2.8),12177041,.11),r=this.line([[0,0,0],[1,1,0]],Fn,1),o=this.mesh(new fn(.055,12,8),Fn,1);this.updates.push(a=>{let l=1.15*Math.sin(a*.3);s.position.z=l;let c=[];for(let d=-1.9;d<=1.91;d+=.04)c.push([d,.22*(d*d-l*l),l]);this.updateLine(r,c);let u=.8*Math.cos(a*.4);o.position.set(u,.22*(u*u-l*l),l),this.group.rotation.y=-.25})}init2D(){this.canvas=document.createElement("canvas"),this.host.append(this.canvas),this.ctx=this.canvas.getContext("2d"),this.host.dataset.renderer="canvas2d"}resize(){let t=this.host.getBoundingClientRect();if(this.width=Math.max(1,t.width),this.height=Math.max(1,t.height),this.renderer)this.renderer.setSize(this.width,this.height,!1),this.camera.aspect=this.width/this.height,this.camera.updateProjectionMatrix();else if(this.canvas){let e=Math.min(window.devicePixelRatio||1,2);this.canvas.width=this.width*e,this.canvas.height=this.height*e,this.ctx.setTransform(e,0,0,e,0,0)}}setPhase(t){this.phase=t,this.draw()}setMotion(t){this.enabled=t&&!this.staticFallback,this.controls&&(this.controls.enableDamping=t),this.enabled?this.start():(cancelAnimationFrame(this.raf),this.raf=0,this.draw())}start(){if(this.raf||this.destroyed)return;this.last=0;let t=e=>{if(this.destroyed||!this.enabled||!this.visible){this.raf=0;return}this.time+=this.last?Math.min((e-this.last)/1e3,.08):0,this.last=e,this.draw(),this.raf=requestAnimationFrame(t)};this.raf=requestAnimationFrame(t)}draw(){this.destroyed||(this.renderer?(this.updates.forEach(t=>t(this.time)),this.controls.update(),this.renderer.render(this.scene,this.camera)):this.ctx&&this.drawCanvas())}drawCanvas(){let t=this.ctx,e=this.width,i=this.height,s=Math.min(e/500,i/400),r=e*.49,o=i*.58,a=this.time,l=this.options.primary||"#ddec9d",c="#dce2ed";t.clearRect(0,0,e,i),t.save(),t.translate(r,o),t.scale(s,s),t.lineWidth=1,t.strokeStyle="#ccddbb17";for(let f=-210;f<=210;f+=35)t.beginPath(),t.moveTo(f,-180),t.lineTo(f,140),t.stroke();for(let f=-175;f<145;f+=35)t.beginPath(),t.moveTo(-220,f),t.lineTo(220,f),t.stroke();let u=(f,m=l,x=2)=>{t.beginPath(),f.forEach((g,p)=>p?t.lineTo(g[0],g[1]):t.moveTo(g[0],g[1])),t.strokeStyle=m,t.lineWidth=x,t.stroke()},d=(f,m,x=4,g=l)=>{t.beginPath(),t.arc(f,m,x,0,Math.PI*2),t.fillStyle=g,t.fill()};if(u([[-220,35],[220,35]],"#d0dfbf35",1),u([[0,-170],[0,130]],"#d0dfbf35",1),rp({kind:this.kind,t:a,phase:this.phase,c:t,path:u,dot:d,green:l,pale:c})){t.restore();return}let h=f=>this.kind==="join"?f<.8?f*f:1.6*f-.64:this.kind==="derivative"||this.kind==="tangents"||this.kind==="area"?f*f*f-1.4*f:this.kind==="antiderivative"?-Math.cos(f)*1.2:this.kind==="asymptote"?Math.sqrt(1+f*f):this.kind==="newton"?f*f-1:f*f;if(this.kind==="conics"){let f=[];for(let g=0;g<=180;g++){let p=g/180*Math.PI*2;f.push([Math.cos(p)*155,Math.sin(p)*84-12])}u(f),d(-105,-12),d(105,-12);let m=a*.25,x=[Math.cos(m)*155,Math.sin(m)*84-12];u([[-105,-12],x,[105,-12]],"#d2e1b67f",1),d(...x,5)}else if(this.kind==="reflection"){let f=[];for(let p=-2.2;p<=2.21;p+=.03)f.push([p*70,80-p*p*34]);u(f);let m=[0,80-4900/136],x=(.4+1.35*(.5+.5*Math.sin(a*.4)))*70,g=80-(x/70)**2*34;u([[x,-150],[x,g],m],"#c8db9dab",1.4),d(...m,5),d(x,g,4),t.fillStyle=c,t.font="13px sans-serif",t.fillText("F",12,m[1]+4)}else{let f=[];for(let m=-1.8;m<2.4;m+=.025)f.push([m*86,-h(m)*28+35]);if(this.kind==="area"&&(t.beginPath(),t.moveTo(-1.6*86,85),f.filter(m=>m[0]>-1.6*86&&m[0]<1.6*86).forEach(m=>t.lineTo(...m)),t.lineTo(1.6*86,85),t.closePath(),t.fillStyle="#d9eba51a",t.fill()),u(f),this.kind==="asymptote")t.setLineDash([5,6]),u([[-210,35+5880/86],[210,35-5880/86]],"#ccdcac90",1.2),u([[-210,35-5880/86],[210,35+5880/86]],"#ccdcac70",1.2),t.setLineDash([]);else if(this.kind==="newton"){let m=1.9,x=S=>S*S-1,g=S=>2*S,p=[];for(let S=0;S<4;S++){let A=m-x(m)/g(m);p.push([m*86,35-x(m)*28],[A*86,35],[A*86,35-x(A)*28]),m=A}u(p,"#b7ce927f",1),d(m*86,35,4)}else{let m=this.kind==="tangents"?.5:this.kind==="join"?.8:.65,x=.12+1.12*(.5+.5*Math.cos(a*.5+this.phase)),g=h(m),p=h(m+x),S=(h(m+.001)-h(m-.001))/.002,A=(p-g)/x,M=[[-1.7*86,35-(g+S*(-1.7-m))*28],[2.3*86,35-(g+S*(2.3-m))*28]];t.setLineDash([5,6]),u(M,"#d2e1bd75",1),t.setLineDash([]),u([[-1.7*86,35-(g+A*(-1.7-m))*28],[2.3*86,35-(g+A*(2.3-m))*28]],"#c8dc9cb0",1.4),d(m*86,35-g*28,4),d((m+x)*86,35-p*28,5),t.beginPath(),t.arc((m+x)*86,35-p*28,12,0,Math.PI*2),t.strokeStyle="#dae9ad55",t.lineWidth=1,t.stroke()}}t.restore()}dispose(){this.destroyed=!0,cancelAnimationFrame(this.raf),this.resizeObserver?.disconnect(),this.visibility?.disconnect(),this.controls?.dispose(),this.scene&&this.scene.traverse(t=>{t.geometry?.dispose(),t.material&&(Array.isArray(t.material)?t.material.forEach(e=>e.dispose()):t.material.dispose())}),this.renderer?.dispose(),this.renderer?.forceContextLoss(),this.host.replaceChildren()}};var te=(n,t,e)=>({family:n,focus:t,beats:e.split("|")}),Xy={"e-01-c":te("riemann","\uC9C1\uC0AC\uAC01\uD615\uACFC \uACE1\uC120 \uC0AC\uC774\uC758 \uD2C8","\uACE1\uC120 \uC544\uB798, \uBE48\uD2C8\uC774 \uBCF4\uC778\uB2E4.|\uC67C\uCABD\uACFC \uC624\uB978\uCABD\uC744 \uB530\uB85C \uC7A1\uB294\uB2E4.|\uB124 \uCE78\uC744, \uC5F4\uC5EC\uC12F \uCE78\uC73C\uB85C.|\uD45C\uBCF8\uC810\uC744 \uBC14\uAFB8\uBA74 \uB2F5\uB3C4 \uB2EC\uB77C\uC9C4\uB2E4.|\uB450 \uD569 \uC0AC\uC774\uB85C, \uCC38\uAC12\uC774 \uBAA8\uC778\uB2E4.|\uC798\uAC8C \uB098\uB208 \uD569\uC774 \uC801\uBD84\uC73C\uB85C.|\uC774\uC81C \uBD84\uD560 \uC218\uB97C \uC9C1\uC811 \uBC14\uAFD4 \uBCF4\uC790."),"a-06-c":te("volume","\uB2E8\uBA74\uC758 \uD569\uACFC \uACE1\uBA74\uC758 \uB760","\uACF5\uC2DD\uC744, \uC587\uAC8C \uC798\uB77C \uBCF8\uB2E4.|\uC6D0\uD310 \uD558\uB098\uC758 \uB113\uC774\uB97C \uAD6C\uD55C\uB2E4.|\uD769\uC5B4\uC9C4 \uB2E8\uBA74\uC774 \uAD6C\uB97C \uCC44\uC6B4\uB2E4.|\uC6D0\uD310\uACFC \uD45C\uBA74\uC758 \uB760\uB294 \uB2E4\uB974\uB2E4.|\uB2E8\uBA74\uC801\uC774 \uB192\uC774\uC758 \uD568\uC218\uAC00 \uB41C\uB2E4.|\uD55C \uC7A5\uC529 \uC313\uC544, \uC785\uCCB4\uB97C \uC77D\uB2E4.|\uB2E4\uB978 \uC785\uCCB4\uC5D0\uB3C4 \uAC19\uC740 \uC9C8\uBB38\uC744."),"e-02-c":te("signed","\uBD80\uD638 \uC788\uB294 \uB204\uC801\uACFC \uC804\uCCB4 \uB113\uC774","\uB113\uC774\uB294 \uB0A8\uC558\uB294\uB370, \uD569\uC740 0.|\uAE30\uC900\uC120 \uC704\uC640 \uC544\uB798\uB97C \uB098\uB208\uB2E4.|\uC74C\uC218\uC640 \uC591\uC218\uAC00 \uB530\uB85C \uC313\uC778\uB2E4.|\uC0C1\uC1C4\uC640 \uC0AC\uB77C\uC9D0\uC744 \uAD6C\uBCC4\uD55C\uB2E4.|\uC801\uBD84 0, \uC804\uCCB4 \uB113\uC774 4.|\uC5B4\uB5A4 \uC591\uC744 \uB354\uD558\uB294\uC9C0 \uBA3C\uC800 \uBB3B\uB2E4.|\uB204\uC801\uC758 \uB05D\uC810\uC744 \uC6C0\uC9C1\uC5EC \uBCF4\uC790."),"e-09-c":te("restore-quadratic","\uC801\uBD84\uC0C1\uC218\uC640 \uD55C \uC810\uC758 \uC870\uAC74","\uAE30\uC6B8\uAE30\uB294 \uAC19\uC740\uB370, \uB192\uC774\uB294 \uB2E4\uB974\uB2E4.|\uBAA8\uC591\uACFC \uC704\uCE58\uB97C \uBD84\uB9AC\uD55C\uB2E4.|\uAC19\uC740 \uACE1\uC120\uC774 \uC704\uC544\uB798\uB85C \uAC08\uB77C\uC9C4\uB2E4.|\uB3C4\uD568\uC218\uB9CC\uC73C\uB85C \uD558\uB098\uB97C \uACE0\uB97C \uC218 \uC5C6\uB2E4.|\uD55C \uC810\uC774, \uC0C1\uC218\uB97C \uACB0\uC815\uD55C\uB2E4.|\uC5EC\uB7EC \uACE1\uC120\uC5D0\uC11C \uD558\uB098\uC758 \uACE1\uC120\uC73C\uB85C.|\uC870\uAC74\uC744 \uBC14\uAFB8\uC5B4 \uB2E4\uC2DC \uBCF5\uC6D0\uD574 \uBCF4\uC790."),"e-03-c":te("rolle","\uC11C\uB85C \uB2E4\uB978 \uC2E4\uADFC \uC0AC\uC774\uC758 \uB07C\uC784","\uB2E4\uC12F \uADFC \uC0AC\uC774, \uB2E4\uC74C \uADFC\uC774 \uD0DC\uC5B4\uB09C\uB2E4.|\uC778\uC811\uD55C \uB450 \uADFC\uC744 \uC787\uB294\uB2E4.|\uBBF8\uBD84\uD560 \uB54C\uB9C8\uB2E4 \uD55C \uC904\uC529 \uC904\uC5B4\uB4E0\uB2E4.|\uC911\uBCF5\uADFC\uC740 \uB530\uB85C \uC0B4\uD3B4\uC57C \uD55C\uB2E4.|\uADFC\uACFC \uADFC \uC0AC\uC774\uB97C \uB2E4\uC2DC \uD655\uC778\uD55C\uB2E4.|\uCC28\uC218\uBCF4\uB2E4 \uC911\uC694\uD55C, \uC870\uAC74\uC758 \uC5ED\uD560.|\uB2E4\uB978 \uADFC\uC744 \uB193\uC544\uB3C4 \uB07C\uC784\uC740 \uB0A8\uC744\uAE4C."),"e-04-c":te("restore","\uB3C4\uD568\uC218\uC758 \uBD80\uD638\uB85C \uC77D\uB294 \uC6D0\uD568\uC218","\uBCC0\uD654\uC728\uC5D0\uC11C, \uACE1\uC120\uC758 \uBAA8\uC591\uC73C\uB85C.|\uC591\uC218\uC640 \uC74C\uC218\uC778 \uAD6C\uAC04\uC744 \uB098\uB208\uB2E4.|\uAE30\uC6B8\uAE30\uC758 \uBD80\uD638\uAC00 \uBC29\uD5A5\uC744 \uC815\uD55C\uB2E4.|0\uC774\uB77C\uB294 \uAC12\uB9CC\uC73C\uB85C\uB294 \uBD80\uC871\uD558\uB2E4.|\uC88C\uC6B0 \uBD80\uD638\uAC00 \uBC14\uB00C\uB294\uC9C0 \uC77D\uB294\uB2E4.|\uBAA8\uC591\uC744 \uC54C\uACE0\uB3C4 \uB192\uC774\uB294 \uB0A8\uB294\uB2E4.|\uD559\uC0DD\uC774 \uB9CC\uB4E0 \uBCF5\uC6D0 \uACFC\uC815\uC744 \uB9CC\uB098\uB2E4."),"a-07-c":te("zoom","\uAD00\uCC30 \uBC94\uC704\uC640 \uC811\uC120 \uC624\uCC28","\uACE1\uC120 \uC18D\uC5D0, \uC9C1\uC120\uC774 \uC228\uC5B4 \uC788\uB2E4.|\uD55C \uC810\uC744 \uC911\uC2EC\uC5D0 \uACE0\uC815\uD55C\uB2E4.|\uBC94\uC704\uB97C \uC881\uD790\uC218\uB85D \uACE1\uB960\uC774 \uC791\uC544\uC9C4\uB2E4.|\uB208\uB300\uC911 \uB300\uC2E0, \uCC28\uC774\uB97C \uC7B0\uB2E4.|\uBC94\uC704 1/10, \uC624\uCC28 1/100.|\uC791\uC740 \uBC94\uC704\uC5D0\uC11C \uB4DC\uB7EC\uB098\uB294 \uC120\uD615\uC131.|\uD655\uB300 \uBC30\uC728\uC744 \uC9C1\uC811 \uBC14\uAFB8\uC5B4 \uBCF4\uC790."),"a-09-c":te("limits","\uADF9\uD55C\uC758 \uD615\uD0DC\uC640 \uC801\uC6A9 \uC870\uAC74","\uBBF8\uBD84\uD558\uAE30 \uC804, \uD615\uD0DC\uB97C \uBA3C\uC800 \uBCF8\uB2E4.|0/0\uC778\uAC00, \uBD84\uC790\uC640 \uBD84\uBAA8\uB97C \uB098\uB208\uB2E4.|\uAC00\uB2A5\uD55C \uC2DD\uC740 \uAC19\uC740 \uAC12\uC73C\uB85C \uBAA8\uC778\uB2E4.|\uAC19\uC774 \uBBF8\uBD84\uD588\uB294\uB370, \uACB0\uB860\uC740 \uB2E4\uB974\uB2E4.|\uC778\uC218\uBD84\uD574\uB85C \uD55C \uBC88 \uB354 \uD655\uC778\uD55C\uB2E4.|\uACC4\uC0B0\uBCF4\uB2E4 \uC55E\uC11C\uB294 \uC801\uC6A9 \uC870\uAC74.|\uB450 \uC2DD\uC744 \uB098\uB780\uD788 \uD655\uC778\uD574 \uBCF4\uC790."),"a-03-c":te("secant","\uB450 \uC810\uC758 \uAE30\uC6B8\uAE30\uC5D0\uC11C \uD55C \uC810\uC73C\uB85C","\uB450 \uC810\uC5D0\uC11C, \uD55C \uC810\uC758 \uAE30\uC6B8\uAE30\uB85C.|\uACE0\uC815\uD560 \uC810\uACFC \uC6C0\uC9C1\uC77C \uC810\uC744 \uB098\uB208\uB2E4.|\uB450 \uBC88\uC9F8 \uC810\uC774 \uCCAB \uC810\uC73C\uB85C \uB2E4\uAC00\uC628\uB2E4.|h=0\uC744 \uBC14\uB85C \uB123\uC744 \uC218\uB294 \uC5C6\uB2E4.|\uD560\uC120\uACFC \uC811\uC120\uC758 \uCC28\uC774\uB97C \uC77D\uB294\uB2E4.|\uAC00\uAE4C\uC6CC\uC9C0\uB294 \uAC12\uC73C\uB85C \uC21C\uAC04\uC744 \uC815\uC758\uD558\uB2E4.|\uC774\uC81C \uB450 \uC810 \uC0AC\uC774\uB97C \uC6C0\uC9C1\uC5EC \uBCF4\uC790."),"e-05-c":te("ratio","\uC0BC\uCC28\uD568\uC218\uC758 \uADF9\uC810\uACFC \uBCC0\uACE1\uC810","\uBAA8\uC591\uC774 \uBC14\uB00C\uC5B4\uB3C4, \uAC00\uC6B4\uB370\uB294 \uB0A8\uC744\uAE4C.|\uB450 \uADF9\uC810\uACFC \uBCC0\uACE1\uC810\uC744 \uCC0D\uB294\uB2E4.|\uC11C\uB85C \uB2E4\uB978 \uB192\uC774, \uAC19\uC740 \uC218\uD3C9 \uBE44\uC728.|\uAC70\uB9AC\uC758 \uBC29\uD5A5\uC744 \uBA3C\uC800 \uAD6C\uBD84\uD55C\uB2E4.|\uBCC0\uACE1\uC810 \uC591\uCABD\uC758 \uAC70\uB9AC\uB97C \uBE44\uAD50\uD55C\uB2E4.|\uB2EE\uC740 \uBAA8\uC591 \uC548\uC5D0\uC11C \uAD00\uACC4\uB97C \uCC3E\uB2E4.|\uB2E4\uB978 \uC0BC\uCC28\uD568\uC218\uC5D0\uB3C4 \uBB3C\uC5B4\uBCF4\uC790."),"a-04-c":te("extrema","\uB3C4\uD568\uC218\uC758 \uADFC\uACFC \uBD80\uD638 \uBCC0\uD654","\uBCF5\uC7A1\uD55C \uACE1\uC120\uC5D0, \uD45C\uC2DD\uC744 \uB0A8\uAE34\uB2E4.|\uAE30\uC6B8\uAE30\uAC00 0\uC778 \uACF3\uC744 \uCC3E\uB294\uB2E4.|\uC99D\uAC00\uC640 \uAC10\uC18C\uAC00 \uAC08\uB77C\uC9C4\uB2E4.|\uBA48\uCDC4\uB2E4\uACE0 \uBAA8\uB450 \uADF9\uAC12\uC740 \uC544\uB2C8\uB2E4.|\uC810 \uD558\uB098\uBCF4\uB2E4 \uC591\uCABD\uC758 \uBD80\uD638\uB97C.|\uBBF8\uBD84\uC73C\uB85C \uACE1\uC120\uC758 \uC9C0\uB3C4\uB97C \uC77D\uB2E4.|\uACC4\uC218 \uBCC0\uD654\uAC00 \uBAA8\uC591\uC744 \uBC14\uAFC0\uAE4C."),"a-08-c":te("newton","\uC811\uC120\uC73C\uB85C \uC774\uB3D9\uD558\uB294 \uBC18\uBCF5 \uACFC\uC815","\uC811\uC120\uC744 \uD0C0\uACE0, \uADFC\uC744 \uD5A5\uD574.|\uCD9C\uBC1C\uC810\uC5D0\uC11C \uC811\uC120\uC744 \uAE0B\uB294\uB2E4.|\uB2E4\uC74C \uAD50\uC810\uC774 \uC0C8 \uCD9C\uBC1C\uC810\uC774 \uB41C\uB2E4.|\uAE30\uC6B8\uAE30\uAC00 0\uC774\uBA74 \uAE38\uC774 \uB04A\uAE34\uB2E4.|\uBC18\uBCF5 \uC0AC\uC774\uC758 \uAC70\uB9AC\uB97C \uBE44\uAD50\uD55C\uB2E4.|\uAC00\uAE4C\uC6CC\uC9D0\uC5D0\uB3C4 \uC870\uAC74\uC774 \uD544\uC694\uD558\uB2E4.|\uD559\uC0DD \uC6F9\uC571\uC5D0\uC11C \uCD9C\uBC1C\uC810\uC744 \uACE8\uB77C \uBCF4\uC790."),"e-06-c":te("mean-value","\uD3C9\uADE0 \uBCC0\uD654\uC728\uACFC \uC21C\uAC04 \uBCC0\uD654\uC728","\uB450 \uC810\uC758 \uD3C9\uADE0, \uD55C \uC810\uC758 \uC21C\uAC04.|\uAD6C\uAC04 \uC591 \uB05D\uC744 \uBA3C\uC800 \uACE0\uC815\uD55C\uB2E4.|\uC811\uC120\uC774 \uD560\uC120\uACFC \uB098\uB780\uD574\uC9C0\uB294 \uC21C\uAC04.|\uBAA8\uC11C\uB9AC\uAC00 \uC788\uC73C\uBA74 \uC870\uAC74\uC774 \uAE68\uC9C4\uB2E4.|\uAD6C\uAC04 \uC548\uC758 \uD55C \uC810\uC744 \uD655\uC778\uD55C\uB2E4.|\uD3C9\uADE0\uACFC \uC21C\uAC04\uC744 \uC787\uB294 \uC815\uB9AC.|\uB2E4\uB978 \uAD6C\uAC04\uC758 \uAC19\uC740 \uAE30\uC6B8\uAE30\uB97C \uCC3E\uC544\uBCF4\uC790."),"e-07-c":te("chain","\uD569\uC131\uD568\uC218\uC758 \uC601\uC810\uACFC \uADF9\uAC12","0\uC744 \uCC3E\uC558\uB294\uB370, \uADF9\uAC12\uC77C\uAE4C.|\uB450 \uBCC0\uD654\uC728\uC744 \uB530\uB85C \uC77D\uB294\uB2E4.|\uACF1\uC774 0\uC774 \uB418\uB294 \uAE38\uC774 \uAC08\uB77C\uC9C4\uB2E4.|x\xB3\uC740 \uBA48\uCD94\uC5B4\uB3C4 \uBC29\uD5A5\uC744 \uC548 \uBC14\uAFBC\uB2E4.|x\xB2\uACFC x\xB3\uC758 \uC591\uCABD \uBD80\uD638\uB97C \uBE44\uAD50\uD55C\uB2E4.|\uC601\uC810 \uB2E4\uC74C\uC5D0\uB294 \uBD80\uD638\uB97C \uBCF4\uC790.|\uD559\uC0DD\uC758 \uD569\uC131\uD568\uC218 \uD0D0\uAD6C\uB85C \uC774\uC5B4\uC9C4\uB2E4."),"e-10-c":te("tangent-merge","\uC811\uC810 \uBC29\uC815\uC2DD\uC758 \uC911\uADFC\uACFC \uC811\uC120 \uC218","\uC811\uC810\uC774 \uACB9\uCE58\uBA74, \uBA87 \uAC1C\uB97C \uC140\uAE4C.|\uACE1\uC120 \uBC16\uC758 \uC810\uC744 \uACE0\uC815\uD55C\uB2E4.|\uC811\uC120\uB4E4\uC774 \uD55C \uC810\uC73C\uB85C \uBAA8\uC778\uB2E4.|\uACBD\uACC4\uC5D0\uC11C \uB450 \uC811\uC810\uC774 \uD558\uB098\uAC00 \uB41C\uB2E4.|\uC911\uBCF5 \uD69F\uC218\uC640 \uC11C\uB85C \uB2E4\uB978 \uADFC\uC744 \uB098\uB208\uB2E4.|\uBC29\uC815\uC2DD\uC758 \uADFC\uC5D0\uC11C \uC811\uC120 \uC218\uB85C.|\uC811\uC810\uC758 \uACBD\uACC4\uB97C \uC9C1\uC811 \uC0B4\uD3B4\uBCF4\uC790."),"a-05-c":te("area-scale","\uC0AC\uCC28\uD568\uC218\uC758 \uB2EE\uC74C\uACFC \uB113\uC774\uBE44","\uB298\uC5B4\uB09C \uBAA8\uC591, \uADF8\uB300\uB85C\uC778 \uB113\uC774\uBE44.|\uB113\uC774\uB97C \uB450 \uC601\uC5ED\uC73C\uB85C \uB098\uB208\uB2E4.|\uAC00\uB85C\uC640 \uC138\uB85C\uAC00 \uD568\uAED8 \uB298\uC5B4\uB09C\uB2E4.|\uB113\uC774 \uC790\uCCB4\uC640 \uBE44\uC728\uC744 \uAD6C\uBD84\uD55C\uB2E4.|\uAC19\uC740 \uBC30\uC728\uC774 \uB450 \uC601\uC5ED\uC5D0 \uC791\uC6A9\uD55C\uB2E4.|\uACF5\uD1B5 \uBC30\uC728\uC774 \uBE44\uC5D0\uC11C \uC0AC\uB77C\uC9C4\uB2E4.|\uD559\uC0DD\uC774 \uC815\uB9AC\uD55C \uB113\uC774\uBE44\uB97C \uB9CC\uB098\uB2E4."),"a-10-c":te("antiderivative","\uB3C4\uD568\uC218\uC5D0\uC11C \uC6D0\uD568\uC218\uB85C \uAC00\uB294 \uB204\uC801","\uBCC0\uD654\uC758 \uAE30\uB85D\uC73C\uB85C, \uC6D0\uB798 \uAE38\uC744 \uCC3E\uB2E4.|\uC591\uC218\uC640 \uC74C\uC218\uC778 \uAE30\uC6B8\uAE30\uB97C \uC77D\uB294\uB2E4.|\uC870\uAE08\uC529 \uC313\uC778 \uBCC0\uD654\uAC00 \uACE1\uC120\uC774 \uB41C\uB2E4.|\uCD9C\uBC1C \uB192\uC774\uB294 \uC544\uC9C1 \uC815\uD574\uC9C0\uC9C0 \uC54A\uC558\uB2E4.|\uAC19\uC740 \uB3C4\uD568\uC218, \uB2E4\uB978 \uC801\uBD84\uC0C1\uC218.|\uB3C4\uD568\uC218\uB85C \uBAA8\uC591\uC744 \uBCF5\uC6D0\uD558\uB2E4.|\uD559\uC0DD \uC6F9\uC571\uC5D0\uC11C \uC9C1\uC811 \uADF8\uB824 \uBCF4\uC790."),"e-11-c":te("curvature","\uC774\uACC4\uB3C4\uD568\uC218\uC758 \uBD80\uD638\uC640 \uBCC0\uACE1","\uAE30\uC6B8\uAE30\uB294, \uC5B4\uB290 \uCABD\uC73C\uB85C \uBC14\uB014\uAE4C.|\uC811\uC120\uC758 \uAE30\uC6B8\uAE30\uB97C \uC5F0\uC18D\uD574\uC11C \uC77D\uB294\uB2E4.|\uD55C\uCABD\uC740 \uC904\uACE0, \uB2E4\uB978 \uCABD\uC740 \uB298\uC5B4\uB09C\uB2E4.|\uC774\uACC4\uB3C4\uD568\uC218 0\uB9CC\uC73C\uB85C \uBD80\uC871\uD558\uB2E4.|x\xB3\uACFC x\u2074, \uBD80\uD638 \uBCC0\uD654\uB97C \uBE44\uAD50\uD55C\uB2E4.|\uC810\uC758 \uAC12\uBCF4\uB2E4 \uC804\uD6C4\uC758 \uBCC0\uD654\uB97C.|\uD559\uC0DD\uC758 \uD310\uC815 \uACFC\uC815\uC744 \uC774\uC5B4 \uC77D\uC790."),"e-08-c":te("model","\uD6C4\uBCF4 \uD568\uC218\uC640 \uC794\uCC28\uC758 \uBE44\uAD50","\uB2EE\uC740 \uC608\uCE21, \uB2E4\uB978 \uC624\uCC28.|\uC138 \uBAA8\uD615\uC5D0 \uAC19\uC740 \uC790\uB8CC\uB97C \uB193\uB294\uB2E4.|\uC810\uACFC \uC608\uCE21 \uC0AC\uC774\uC5D0 \uD2C8\uC774 \uC0DD\uAE34\uB2E4.|\uAC89\uBAA8\uC591\uB9CC\uC73C\uB85C \uACE0\uB974\uC9C0 \uC54A\uB294\uB2E4.|\uC794\uCC28\uB97C \uAC19\uC740 \uAE30\uC900\uC73C\uB85C \uBAA8\uC740\uB2E4.|\uC5B4\uB5A4 \uC790\uB8CC\uB85C \uBE44\uAD50\uD588\uB294\uC9C0 \uBB3B\uB2E4.|\uD559\uC0DD\uC758 \uC608\uCE21 \uBAA8\uD615\uC744 \uB9CC\uB098\uB2E4."),"a-01-c":te("tangents","\uD55C \uC810\uC744 \uC9C0\uB098\uB294 \uC0BC\uCC28\uD568\uC218\uC758 \uC811\uC120","\uD55C \uC810\uC744 \uC9C0\uB098\uB294, \uC5EC\uB7EC \uC811\uC120.|\uC811\uC810 t\uB97C \uBA3C\uC800 \uC6C0\uC9C1\uC778\uB2E4.|\uC811\uC120 \uC138 \uAC1C\uAC00 \uAC19\uC740 \uC810\uC744 \uC9C0\uB09C\uB2E4.|\uC810\uC744 \uC62E\uAE30\uBA74 \uAC1C\uC218\uAC00 \uBC14\uB010\uB2E4.|\uC811\uC810 \uBC29\uC815\uC2DD\uC758 \uC11C\uB85C \uB2E4\uB978 \uC2E4\uADFC.|\uAE30\uC6B8\uAE30\uBCF4\uB2E4 \uC811\uC810\uC744 \uBBF8\uC9C0\uC218\uB85C.|\uB2E4\uB978 \uC810\uC5D0\uC11C\uB294 \uBA87 \uAC1C\uAC00 \uB420\uAE4C."),"a-02-c":te("join","\uD568\uC218\uC758 \uC5F0\uACB0\uACFC \uB9E4\uB044\uB7EC\uC6C0","\uC774\uC5B4\uC84C\uB2E4\uB294 \uAC83\uB9CC\uC73C\uB85C \uCDA9\uBD84\uD560\uAE4C.|\uC67C\uCABD\uACFC \uC624\uB978\uCABD\uC744 \uB530\uB85C \uB193\uB294\uB2E4.|\uB192\uC774\uB97C \uB9DE\uCD94\uC5B4 \uD55C \uC810\uC5D0\uC11C \uC787\uB294\uB2E4.|\uC5F0\uACB0\uB418\uC5B4\uB3C4 \uBAA8\uC11C\uB9AC\uB294 \uB0A8\uB294\uB2E4.|\uAC12\uACFC \uAE30\uC6B8\uAE30\uB97C \uD568\uAED8 \uB9DE\uCD98\uB2E4.|\uB04A\uAE40\uC744 \uB118\uC5B4\uC11C, \uB9E4\uB044\uB7FD\uAC8C.|\uC811\uD569\uC810\uC744 \uC9C1\uC811 \uBC14\uAFB8\uC5B4 \uBCF4\uC790."),"a-11-c":te("surface","\uD55C \uBCC0\uC218\uB97C \uACE0\uC815\uD55C \uB2E8\uBA74\uC758 \uBBF8\uBD84","\uC785\uCCB4 \uC704\uC5D0\uC11C, \uD558\uB098\uB97C \uACE0\uC815\uD558\uB2E4.|\uB450 \uBC29\uD5A5\uC744 \uB530\uB85C \uD45C\uC2DC\uD55C\uB2E4.|\uD3C9\uBA74\uC73C\uB85C \uC798\uB77C \uACE1\uC120\uC744 \uAEBC\uB0B8\uB2E4.|\uC804\uCCB4 \uBCC0\uD654\uC640 \uD55C \uBC29\uD5A5\uC758 \uBCC0\uD654\uB97C \uB098\uB208\uB2E4.|\uB2E8\uBA74 \uC704 \uC811\uC120\uC774 \uBCC0\uD654\uC728\uC744 \uB9D0\uD55C\uB2E4.|\uACF5\uAC04\uC758 \uC9C8\uBB38\uC744 \uD3C9\uBA74\uC73C\uB85C \uC62E\uAE30\uB2E4.|\uB2E4\uB978 \uBC29\uD5A5\uC73C\uB85C \uB2E4\uC2DC \uC798\uB77C \uBCF4\uC790."),"e-01-g":te("space-points","\uACF5\uAC04 \uC120\uBD84\uC758 \uB0B4\uBD84\uACFC \uC678\uBD84","\uB450 \uC810 \uC0AC\uC774, \uD55C \uC810\uC744 \uB193\uB2E4.|\uC138 \uC88C\uD45C\uC758 \uBCC0\uD654\uB97C \uB098\uB204\uC5B4 \uBCF8\uB2E4.|\uAC19\uC740 \uBE44\uC728\uB85C \uC138 \uBC29\uD5A5\uC744 \uC6C0\uC9C1\uC778\uB2E4.|1\uC744 \uB118\uC73C\uBA74 \uC120\uBD84 \uBC16\uC73C\uB85C.|\uACF5\uAC04\uACFC \uC88C\uD45C\uC758 \uBE44\uC728\uC744 \uBE44\uAD50\uD55C\uB2E4.|\uC88C\uD45C \uC14B\uC744 \uD558\uB098\uC758 \uC2DD\uC73C\uB85C.|\uD559\uC0DD \uC6F9\uC571\uC5D0\uC11C \uBE44\uC728\uC744 \uBC14\uAFD4 \uBCF4\uC790."),"a-06-g":te("dimension","\uCC28\uC6D0\uC744 \uB0AE\uCD94\uC5B4 \uBCF4\uB294 \uB2E8\uBA74","\uBCF4\uC774\uC9C0 \uC54A\uB294 \uCC28\uC6D0\uC744, \uC798\uB77C \uBCF4\uB2E4.|\uD55C \uC88C\uD45C\uB97C \uACE0\uC815\uD55C\uB2E4.|\uAD6C\uC5D0\uC11C \uC6D0\uC73C\uB85C, \uCC28\uC6D0\uC774 \uB0B4\uB824\uAC04\uB2E4.|\uACBD\uACC4\uC5D0 \uB2FF\uC73C\uBA74 \uB2E8\uBA74\uC774 \uC904\uC5B4\uB4E0\uB2E4.|\uB0A8\uC740 \uC88C\uD45C\uAC00 \uC791\uC740 \uAD6C\uB97C \uC774\uB8EC\uB2E4.|\uC9C1\uC811 \uBCFC \uC218 \uC5C6\uC5B4\uB3C4 \uAD00\uACC4\uB294 \uC77D\uD78C\uB2E4.|\uCC28\uC6D0\uC744 \uBC14\uAFB8\uC5B4 \uAC19\uC740 \uC9C8\uBB38\uC744."),"e-02-g":te("parabola","\uCD08\uC810\uACFC \uC900\uC120\uAE4C\uC9C0 \uAC19\uC740 \uAC70\uB9AC","\uAC19\uC740 \uAC70\uB9AC\uC758 \uC810\uB4E4\uC774 \uACE1\uC120\uC774 \uB41C\uB2E4.|\uCD08\uC810 \uD558\uB098\uC640 \uC9C1\uC120 \uD558\uB098\uB97C \uB193\uB294\uB2E4.|\uB450 \uAC70\uB9AC\uAC00 \uAC19\uC740 \uC810\uC744 \uC787\uB294\uB2E4.|\uC900\uC120\uAE4C\uC9C0\uB294 \uC218\uC9C1\uC73C\uB85C \uC7AC\uC57C \uD55C\uB2E4.|\uB450 \uC120\uBD84\uC758 \uAE38\uC774\uB97C \uBE44\uAD50\uD55C\uB2E4.|\uAC70\uB9AC \uC870\uAC74\uC774 \uD3EC\uBB3C\uC120\uC758 \uC2DD\uC73C\uB85C.|\uCD08\uC810\uC758 \uC704\uCE58\uB97C \uBC14\uAFB8\uC5B4 \uBCF4\uC790."),"e-03-g":te("ellipsoid","\uAC70\uB9AC \uD569\uACFC \uACF5\uAC04\uC758 \uD68C\uC804\uD0C0\uC6D0\uCCB4","\uD0C0\uC6D0\uC774 \uD3C9\uBA74 \uBC16\uC73C\uB85C \uD3BC\uCCD0\uC9C4\uB2E4.|\uACF5\uAC04\uC5D0 \uB450 \uCD08\uC810\uC744 \uACE0\uC815\uD55C\uB2E4.|\uAC70\uB9AC\uC758 \uD569\uC744 \uC720\uC9C0\uD558\uBA70 \uD68C\uC804\uD55C\uB2E4.|a\uC640 c\uC758 \uACBD\uACC4\uC5D0\uC11C\uB294 \uB2EC\uB77C\uC9C4\uB2E4.|\uC911\uC2EC\uC744 \uC9C0\uB098\uB294 \uB2E8\uBA74\uC744 \uAEBC\uB0B8\uB2E4.|\uAC70\uB9AC \uC870\uAC74\uC744 \uACF5\uAC04\uC73C\uB85C \uB113\uD788\uB2E4.|\uD3C9\uBA74\uACFC \uC785\uCCB4\uB97C \uBC88\uAC08\uC544 \uBCF4\uC790."),"e-04-g":te("conic-boundary","\uCD08\uC810 \uAC70\uB9AC \uC870\uAC74\uC758 \uC874\uC7AC\uC640 \uACBD\uACC4","\uC870\uAC74 \uD558\uB098\uAC00, \uACE1\uC120\uC744 \uC5C6\uC564\uB2E4.|\uCD08\uC810 \uC0AC\uC774 \uAC70\uB9AC 2c\uB97C \uACE0\uC815\uD55C\uB2E4.|\uD569\uACFC \uCC28\uC758 \uC870\uAC74\uC744 \uB098\uB780\uD788 \uBCF8\uB2E4.|\uACBD\uACC4\uAC12\uC5D0\uC11C \uACE1\uC120\uC774 \uD1F4\uD654\uD55C\uB2E4.|\uC874\uC7AC\uD558\uB294 \uC870\uAC74\uC744 \uBA3C\uC800 \uD655\uC778\uD55C\uB2E4.|\uBC29\uC815\uC2DD \uC55E\uC5D0, \uAC00\uB2A5\uD55C \uAC70\uB9AC\uB97C.|\uD559\uC0DD\uC758 \uACBD\uACC4 \uC870\uAC74 \uD0D0\uAD6C\uB85C."),"a-07-g":te("projection","\uAE30\uC6B8\uAE30\uC640 \uC815\uC0AC\uC601 \uB113\uC774","\uB113\uC774\uB294, \uADF8\uB9BC\uC790\uC5D0\uC11C \uC904\uC5B4\uB4E0\uB2E4.|\uC6D0\uB798 \uBA74\uACFC \uD22C\uC601\uBA74\uC744 \uB098\uB208\uB2E4.|\uAE30\uC6B8\uC77C\uC218\uB85D \uADF8\uB9BC\uC790\uAC00 \uC811\uD78C\uB2E4.|\uAE38\uC774\uC640 \uB113\uC774\uC758 \uBE44\uB97C \uD63C\uB3D9\uD558\uC9C0 \uC54A\uB294\uB2E4.|\uAE30\uC6B8\uAE30 \uD558\uB098\uAC00 \uB192\uC774\uB97C \uC904\uC778\uB2E4.|\uBA74\uC801\uC5D0 \uB0A8\uB294 \uCF54\uC0AC\uC778\uC758 \uBAAB.|\uB2E4\uB978 \uAC01\uB3C4\uC758 \uADF8\uB9BC\uC790\uB97C \uB9CC\uB4E4\uC5B4 \uBCF4\uC790."),"a-09-g":te("cone-cut","\uC808\uB2E8\uD3C9\uBA74\uC774 \uB9CC\uB4DC\uB294 \uC774\uCC28\uACE1\uC120","\uD558\uB098\uC758 \uC6D0\uBFD4, \uC11C\uB85C \uB2E4\uB978 \uACE1\uC120.|\uC790\uB974\uB294 \uD3C9\uBA74\uC744 \uB193\uB294\uB2E4.|\uD3C9\uBA74\uC758 \uAE30\uC6B8\uAE30\uAC00 \uB2EC\uB77C\uC9C4\uB2E4.|\uBAA8\uC120\uACFC \uB098\uB780\uD55C \uC21C\uAC04\uC774 \uACBD\uACC4\uB2E4.|\uC6D0\uC744 \uC9C0\uB098 \uD0C0\uC6D0\xB7\uD3EC\uBB3C\uC120\xB7\uC30D\uACE1\uC120\uC73C\uB85C.|\uACF5\uAC04\uC758 \uC808\uB2E8\uC774 \uD3C9\uBA74\uC758 \uACE1\uC120\uC73C\uB85C.|\uB124 \uAC00\uC9C0 \uB2E8\uBA74\uC744 \uC774\uC5B4 \uBCF4\uC790."),"a-03-g":te("focal","\uAC70\uB9AC\uC758 \uD569\uACFC \uCC28\uB85C \uB9CC\uB4DC\uB294 \uACE1\uC120","\uB354\uD560\uAE4C, \uBE84\uAE4C. \uACE1\uC120\uC774 \uAC08\uB9B0\uB2E4.|\uB450 \uCD08\uC810\uC744 \uAC19\uC740 \uC790\uB9AC\uC5D0 \uB193\uB294\uB2E4.|\uD55C \uC810\uC5D0\uC11C \uB450 \uAC70\uB9AC\uB97C \uC787\uB294\uB2E4.|\uD569\uC758 \uC870\uAC74\uACFC \uCC28\uC758 \uC870\uAC74\uC744 \uB098\uB208\uB2E4.|\uACE0\uC815\uB418\uB294 \uAC12\uC774 \uB2E4\uB974\uB2E4.|\uAC19\uC740 \uB450 \uC810\uC5D0\uC11C \uB2E4\uB978 \uACE1\uC120\uC73C\uB85C.|\uC870\uAC74\uC744 \uBC14\uAFB8\uC5B4 \uADA4\uC801\uC744 \uBCF4\uC790."),"e-05-g":te("line-plane","\uBC95\uC120 \uB0B4\uC801\uACFC \uD55C \uC810\uC758 \uD3EC\uD568 \uC5EC\uBD80","\uD3C9\uD589\uACFC \uD3EC\uD568, \uAC19\uC740 \uB0B4\uC801 0.|\uBC29\uD5A5\uBCA1\uD130\uC640 \uBC95\uC120\uC744 \uAEBC\uB0B8\uB2E4.|\uC9C1\uC120\uC774 \uD3C9\uBA74\uC744 \uAC00\uB85C\uC9C0\uB978\uB2E4.|\uBC29\uD5A5\uC774 \uAC19\uC544\uB3C4 \uC704\uCE58\uB294 \uB2E4\uB974\uB2E4.|\uC9C1\uC120 \uC704 \uD55C \uC810\uC744 \uB354 \uD655\uC778\uD55C\uB2E4.|\uBC29\uD5A5 \uC870\uAC74\uC5D0 \uC704\uCE58 \uC870\uAC74\uC744 \uB354\uD558\uB2E4.|\uC138 \uAC00\uC9C0 \uC704\uCE58 \uAD00\uACC4\uB97C \uC0B4\uD3B4\uBCF4\uC790."),"a-04-g":te("minimum","\uC9C1\uAC01\uC0BC\uAC01\uD615\uACFC \uCD5C\uB2E8\uAC70\uB9AC","\uB9CE\uC740 \uAE38 \uC911, \uAC00\uC7A5 \uC9E7\uC740 \uD558\uB098.|\uD3C9\uBA74 \uC704\uC758 \uB3C4\uCC29\uC810\uC744 \uC6C0\uC9C1\uC778\uB2E4.|\uC0AC\uC120 \uAE38\uC774\uAC00 \uC218\uC120\uBCF4\uB2E4 \uAE38\uC5B4\uC9C4\uB2E4.|\uBE57\uBCC0\uACFC \uC218\uC120\uC744 \uAD6C\uBD84\uD55C\uB2E4.|\uB0A8\uB294 \uAE38\uC774\uB294 \uC9C1\uAC01\uC0BC\uAC01\uD615 \uC548\uC5D0.|\uBAA8\uB4E0 \uAE38\uC758 \uC544\uB798\uC5D0, \uC218\uC120 \uD558\uB098.|\uB3C4\uCC29\uC810\uC744 \uBC14\uAFB8\uC5B4 \uBE44\uAD50\uD574 \uBCF4\uC790."),"a-08-g":te("plane-distance","\uBC95\uC120 \uBC29\uD5A5\uC758 \uC131\uBD84\uACFC \uAC70\uB9AC \uACF5\uC2DD","\uACF5\uAC04\uC758 \uAC70\uB9AC\uB97C, \uD55C \uBC29\uD5A5\uC73C\uB85C.|\uD3C9\uBA74\uC758 \uBC95\uC120\uC744 \uC138\uC6B4\uB2E4.|\uC810\uC5D0\uC11C \uD3C9\uBA74\uC73C\uB85C \uC218\uC120\uC744 \uB0B4\uB9B0\uB2E4.|\uBC95\uC120\uC758 \uD06C\uAE30\uB97C \uADF8\uB300\uB85C \uC4F0\uBA74 \uC548 \uB41C\uB2E4.|\uC131\uBD84\uC744 \uBC95\uC120 \uAE38\uC774\uB85C \uB098\uB208\uB2E4.|\uC88C\uD45C\uC2DD \uC18D\uC5D0 \uC228\uC740 \uC815\uC0AC\uC601.|\uD559\uC0DD\uC758 \uAC70\uB9AC \uACC4\uC0B0\uAE30\uB97C \uB9CC\uB098 \uBCF4\uC790."),"e-06-g":te("overlap","\uAD00\uCC30 \uBC29\uD5A5\uC5D0 \uB530\uB978 \uC815\uC0AC\uC601 \uACB9\uCE68","\uB2E4\uB978 \uB450 \uC810\uC774, \uD558\uB098\uB85C \uBCF4\uC778\uB2E4.|\uAD00\uCC30 \uBC29\uD5A5\uC744 \uB530\uB85C \uD45C\uC2DC\uD55C\uB2E4.|\uB450 \uC810\uC758 \uADF8\uB9BC\uC790\uAC00 \uAC00\uAE4C\uC6CC\uC9C4\uB2E4.|\uACB9\uCE5C \uADF8\uB9BC\uC790\uAC00 \uAC19\uC740 \uC810\uC740 \uC544\uB2C8\uB2E4.|\uCC28\uBCA1\uD130\uC640 \uC2DC\uC120\uC774 \uB098\uB780\uD574\uC9C4\uB2E4.|\uBCF4\uC774\uB294 \uC704\uCE58\uC640 \uC2E4\uC81C \uC704\uCE58\uB97C \uB098\uB204\uB2E4.|\uC2DC\uC120\uC744 \uBC14\uAFB8\uC5B4 \uB2E4\uC2DC \uAD00\uCC30\uD558\uC790."),"e-07-g":te("cone-discriminant","\uC808\uB2E8\uAC01\uACFC \uC774\uCC28\uD56D\uC758 \uBD80\uD638","\uAC01\uB3C4 \uD558\uB098\uAC00, \uC2DD\uC758 \uBD80\uD638\uB97C \uBC14\uAFBC\uB2E4.|\uC6D0\uBFD4\uACFC \uD3C9\uBA74\uC758 \uC2DD\uC744 \uACB9\uCE5C\uB2E4.|\uC808\uB2E8\uAC01\uC774 \uBAA8\uC120\uC5D0 \uAC00\uAE4C\uC6CC\uC9C4\uB2E4.|D=0, \uACBD\uACC4\uB97C \uC815\uD655\uD788 \uC77D\uB294\uB2E4.|\uBD80\uD638 \uC138 \uAC1C\uAC00 \uB2E8\uBA74\uC744 \uAC00\uB978\uB2E4.|\uACF5\uAC04\uC758 \uAC01\uB3C4\uC640 \uC2DD\uC758 \uACC4\uC218\uAC00 \uB9CC\uB098\uB2E4.|\uACBD\uACC4 \uC591\uCABD\uC744 \uCC28\uB840\uB85C \uBE44\uAD50\uD558\uC790."),"e-10-g":te("conic-tangent","\uC811\uC810 \uCE58\uD658\uACFC \uC218\uC9C1 \uC811\uC120\uC758 \uC911\uADFC","\uC811\uC120 \uACF5\uC2DD \uB4A4\uC5D0, \uC911\uADFC\uC774 \uC788\uB2E4.|\uACE1\uC120 \uC704 \uC811\uC810\uC744 \uBA3C\uC800 \uC815\uD55C\uB2E4.|\uD55C \uC810\uC5D0\uC11C \uC811\uC120\uC774 \uACE1\uC120\uC5D0 \uB2FF\uB294\uB2E4.|\uC218\uC9C1 \uC811\uC120\uB3C4 \uB193\uCE58\uC9C0 \uC54A\uB294\uB2E4.|\uB300\uC785\uD55C \uC2DD\uC774 \uC644\uC804\uC81C\uACF1\uC774 \uB41C\uB2E4.|\uB2E4\uB978 \uD45C\uD604, \uAC19\uC740 \uC911\uADFC \uC870\uAC74.|\uD559\uC0DD \uC6F9\uC571\uC5D0\uC11C \uC811\uC810\uC744 \uBC14\uAFD4 \uBCF4\uC790."),"a-05-g":te("dot","\uD68C\uC804\uD558\uB294 \uBCA1\uD130\uC640 \uBD80\uD638 \uC788\uB294 \uC0AC\uC601","\uBC29\uD5A5\uC774 \uBC14\uB00C\uBA74, \uBD80\uD638\uB3C4 \uBC14\uB010\uB2E4.|\uD55C \uBCA1\uD130\uB97C \uAE30\uC900\uC73C\uB85C \uACE0\uC815\uD55C\uB2E4.|\uB2E4\uB978 \uBCA1\uD130\uAC00 \uC9C1\uAC01\uC744 \uC9C0\uB09C\uB2E4.|\uAE38\uC774\uAC00 \uC591\uC218\uC5EC\uB3C4 \uB0B4\uC801\uC740 \uC74C\uC218.|\uC0AC\uC601\uC774 \uAE30\uC900\uC810\uC758 \uB4A4\uB85C \uB118\uC5B4\uAC04\uB2E4.|\uBC29\uD5A5\uACFC \uD06C\uAE30\uB97C \uD55C \uAC12\uC5D0 \uB2F4\uB2E4.|\uAC01\uB3C4\uB97C \uC9C1\uC811 \uBC14\uAFB8\uC5B4 \uBCF4\uC790."),"e-11-g":te("rotation","\uC810 \uD68C\uC804\uACFC \uC88C\uD45C\uCD95 \uD68C\uC804\uC758 \uAD6C\uBCC4","\uACE1\uC120\uC774 \uB3CC\uAE4C, \uC88C\uD45C\uAC00 \uB3CC\uAE4C.|\uACE0\uC815\uD560 \uB300\uC0C1\uBD80\uD130 \uACE0\uB978\uB2E4.|\uCD95\uC744 \uB3CC\uB9AC\uBA74 \uC88C\uD45C\uAC00 \uB2EC\uB77C\uC9C4\uB2E4.|90\uB3C4\uC5D0\uC11C\uB294 XY\uD56D\uC774 \uC0AC\uB77C\uC9C4\uB2E4.|\uAC19\uC740 \uC810\uC744 \uB450 \uC88C\uD45C\uB85C \uD655\uC778\uD55C\uB2E4.|\uD68C\uC804\uC758 \uBC29\uD5A5\uC774 \uC2DD\uC758 \uBD80\uD638\uB85C.|\uD559\uC0DD\uC758 \uC88C\uD45C\uBCC0\uD658\uC744 \uC0B4\uD3B4\uBCF4\uC790."),"e-08-g":te("reflection","\uD3EC\uBB3C\uC120\uC758 \uCD08\uC810\uC73C\uB85C \uD5A5\uD558\uB294 \uAD11\uC120","\uD3C9\uD589\uD55C \uBE5B\uC774, \uD55C \uC810\uC73C\uB85C \uBAA8\uC778\uB2E4.|\uCD08\uC810\uACFC \uC811\uC120\uC758 \uBC95\uC120\uC744 \uC138\uC6B4\uB2E4.|\uC785\uC0AC\uD55C \uAD11\uC120\uC774 \uBC29\uD5A5\uC744 \uBC14\uAFBC\uB2E4.|\uAF2D\uC9D3\uC810\uC758 \uACBD\uC6B0\uB3C4 \uB530\uB85C \uBCF8\uB2E4.|\uBC18\uC0AC \uBC29\uD5A5\uACFC \uCD08\uC810\uC744 \uBE44\uAD50\uD55C\uB2E4.|\uAC70\uB9AC \uC870\uAC74\uC5D0\uC11C \uBE5B\uC758 \uACBD\uB85C\uB85C.|\uB2E4\uB978 \uC811\uC810\uC5D0\uC11C \uBE5B\uC744 \uBCF4\uB0B4 \uBCF4\uC790."),"a-01-g":te("sphere-extreme","\uAD6C \uC704 \uB3D9\uC810\uC758 \uB0B4\uC801\uACFC \uC0AC\uC601 \uADF9\uAC12","\uAD6C \uC704\uC758 \uC810, \uADF8\uB9BC\uC790\uC758 \uC591 \uB05D.|\uC911\uC2EC\uACFC \uBC18\uC9C0\uB984 \uBCA1\uD130\uB97C \uB098\uB208\uB2E4.|\uC810\uC774 \uC6C0\uC9C1\uC774\uBA70 \uC0AC\uC601\uC774 \uB298\uC5B4\uB09C\uB2E4.|\uB2E4\uB978 \uACE1\uBA74\uC5D0 \uADF8\uB300\uB85C \uC62E\uAE38 \uC218 \uC788\uC744\uAE4C.|\uACE0\uC815\uCD95 \uBC29\uD5A5\uC758 \uC591 \uB05D\uC744 \uCC3E\uB294\uB2E4.|\uB0B4\uC801\uC758 \uADF9\uAC12\uC744 \uADF8\uB9BC\uC790\uB85C \uC77D\uB2E4.|\uACE1\uBA74\uC744 \uBC14\uAFB8\uC5B4 \uC9C8\uBB38\uC744 \uC774\uC5B4 \uAC00\uC790."),"a-02-g":te("sphere-slice","\uAD6C\uC640 \uD3C9\uBA74\uC758 \uAD50\uC120 \uBC0F \uC811\uC810","\uD3C9\uBA74\uC774 \uC9C0\uB098\uAC00\uBA74, \uC6D0\uC774 \uB0A8\uB294\uB2E4.|\uC911\uC2EC\uC5D0\uC11C \uD3C9\uBA74\uAE4C\uC9C0 \uC218\uC120\uC744 \uB0B4\uB9B0\uB2E4.|\uB2E8\uBA74 \uC704 \uC810\uC774 \uC6D0\uC744 \uB530\uB77C \uBAA8\uC778\uB2E4.|\uC811\uD558\uBA74 \uD55C \uC810, \uBC97\uC5B4\uB098\uBA74 \uACF5\uC9D1\uD569.|R\uACFC d\uAC00 \uAC19\uC740 r\uC744 \uACB0\uC815\uD55C\uB2E4.|\uC77C\uC815\uD55C \uAC70\uB9AC\uC5D0\uC11C \uD0DC\uC5B4\uB09C \uC6D0.|\uD3C9\uBA74\uC744 \uC62E\uACA8 \uACBD\uACC4\uB97C \uC0B4\uD3B4\uBCF4\uC790."),"a-11-g":te("asymptote","\uACE1\uC120\uACFC \uC810\uADFC\uC120 \uC0AC\uC774\uC758 \uAC70\uB9AC","\uBA40\uC5B4\uC9C8\uC218\uB85D, \uC120\uC5D0 \uAC00\uAE4C\uC6CC\uC9C4\uB2E4.|\uACE1\uC120\uACFC \uC9C1\uC120\uC744 \uB530\uB85C \uADF8\uB9B0\uB2E4.|\uC810\uC774 \uBA40\uC5B4\uC9C0\uBA70 \uD2C8\uC774 \uC904\uC5B4\uB4E0\uB2E4.|\uD3EC\uBB3C\uC120\uC5D0\uB294 \uAC19\uC740 \uACB0\uB860\uC744 \uBABB \uC4F4\uB2E4.|\uC704\uCE58\uAC00 \uC544\uB2C8\uB77C \uAC70\uB9AC\uB97C \uBE44\uAD50\uD55C\uB2E4.|\uB05D\uC5D0\uC11C \uB4DC\uB7EC\uB098\uB294 \uBC29\uC815\uC2DD\uC758 \uAD6C\uC870.|\uBA40\uB9AC \uC788\uB294 \uC810\uC5D0\uC11C \uB2E4\uC2DC \uD655\uC778\uD558\uC790."),"e-09-e":te("compound","\uBCF5\uB9AC\uC758 \uC815\uD655\uD55C \uAE30\uAC04\uACFC \uADFC\uC0AC \uC624\uCC28","72\uB77C\uB294 \uC218\uB294, \uC5BC\uB9C8\uB098 \uAC00\uAE4C\uC6B8\uAE4C.|\uC815\uD655\uD55C \uAE30\uAC04\uACFC \uADFC\uC0AC\uB97C \uB098\uB208\uB2E4.|\uC774\uC728\uB9C8\uB2E4 \uB450 \uACE1\uC120\uC758 \uD2C8\uC774 \uB2EC\uB77C\uC9C4\uB2E4.|\uD55C \uC774\uC728\uC758 \uC77C\uCE58\uB85C \uC77C\uBC18\uD654\uD558\uC9C0 \uC54A\uB294\uB2E4.|\uAC19\uC740 \uAD6C\uAC04\uC5D0\uC11C \uC624\uCC28\uB97C \uBE44\uAD50\uD55C\uB2E4.|\uD3B8\uB9AC\uD55C \uADFC\uC0AC\uC5D0\uB3C4 \uC870\uAC74\uC774 \uC788\uB2E4.|\uC774\uC728\uC744 \uBC14\uAFB8\uC5B4 \uC624\uCC28\uB97C \uC0B4\uD3B4\uBCF4\uC790.")};function rc(n){let t=Xy[n.id];if(!t)throw new Error("\uC7A5\uBA74 \uC124\uACC4\uAC00 \uC5C6\uB294 \uD0D0\uAD6C: "+n.id);return t}var lp=["\uC9C8\uBB38","\uC870\uAC74","\uC2DC\uB3C4","\uB2E4\uC2DC \uBCF4\uAE30","\uAD00\uACC4","\uC815\uB9AC","\uC791\uD488"];var qy=n=>String(n).replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t]),rn=n=>Number(n.toFixed(3)),Lt=(n,t)=>[380+n*78,254-t*48],cu=(n,t="primary",e="")=>'<path d="'+n+'" class="'+t+'" '+(t==="guide"?"":'data-draw="" pathLength="1" ')+e+"/>",ft=(n,t,e="primary",i="")=>cu("M"+n.map(rn).join(" ")+"L"+t.map(rn).join(" "),e,i?'data-morph="'+i+'"':""),Ue=(n,t="primary",e=!1,i="")=>cu(n.map((s,r)=>(r?"L":"M")+s.map(rn).join(" ")).join(" ")+(e?"Z":""),t,i?'data-morph="'+i+'"':""),qn=(n,t,e,i="primary")=>'<circle cx="'+rn(n)+'" cy="'+rn(t)+'" r="'+rn(e)+'" class="'+i+'" data-pop=""/>',En=(n,t,e,i,s="primary",r="")=>'<ellipse cx="'+rn(n)+'" cy="'+rn(t)+'" rx="'+rn(e)+'" ry="'+rn(i)+'" class="'+s+'" data-pop="" '+r+"/>",Mt=(n,t="",e=12,i=-12,s="")=>qn(...n,5,"node").replace('data-pop=""',s?'data-pop="" data-morph="'+s+'"':'data-pop=""')+(t?Wt(t,n[0]+e,n[1]+i):""),Wt=(n,t,e,i="label",s="start")=>'<text x="'+rn(t)+'" y="'+rn(e)+'" text-anchor="'+s+'" class="'+i+'" data-label="">'+qy(n)+"</text>",Be=(n,t=0)=>'<g data-stage-group="" data-order="'+t+'">'+n+"</g>",mn=(n,t,e="primary",i="")=>{let s=Math.atan2(t[1]-n[1],t[0]-n[0]),r=[t[0]-13*Math.cos(s-.38),t[1]-13*Math.sin(s-.38)],o=[t[0]-13*Math.cos(s+.38),t[1]-13*Math.sin(s+.38)];return ft(n,t,e,i?i+"-shaft":"")+Ue([r,t,o],e,!1,i?i+"-head":"")},ie=(n,t=-3,e=3,i="primary",s=Lt)=>{let r="",o=[];for(let a=0;a<=150;a++){let l=t+(e-t)*a/150,c=n(l),u=s(l,c);!Number.isFinite(c)||u[1]<30||u[1]>407?(o.length>1&&(r+=Ue(o,i)),o=[]):o.push(u)}return o.length>1&&(r+=Ue(o,i)),r},ri=()=>Be(ft([68,254],[697,254],"axis")+ft([380,43],[380,402],"axis")+Wt("x",700,245,"tiny")+Wt("y",391,48,"tiny"),0),Ae=(n,t="")=>Wt(n,380,428,"metric","middle")+(t?Wt(t,380,451,"tiny","middle"):""),lu=(n,t,e,i)=>'<g transform="translate(35 45) scale(.46)">'+n+'</g><g transform="translate(375 45) scale(.46)">'+t+"</g>"+Wt(e,207,335,"label","middle")+Wt(i,555,335,"label","middle")+ft([380,78],[380,340],"axis"),cp=(n,t)=>n==="quadratic"?t*t:n==="cubic"?t*t*t/3-t:n==="wave"?-Math.cos(t):t*t*t-3*t;function Yy(n=1.8,t=4){let e=n,i=[];for(let s=0;s<t&&!(Math.abs(2*e)<1e-10);s++){let r=e-(e*e-2)/(2*e);i.push({x:e,y:e*e-2,next:r}),e=r}return i}function up(n){return n.slice(0,-1).map((t,e)=>t*(n.length-e-1))}function hp(n,t){return n.reduce((e,i)=>e*t+i,0)}function Zy(n,t){let e=up(n);return t.slice(0,-1).map((i,s)=>{let r=t[s+1];for(let o=0;o<55;o++){let a=(i+r)/2;hp(e,i)*hp(e,a)<=0?r=a:i=a}return(i+r)/2})}function Jy(n){let t=[4,4,12,6,24,40,16][n],e=114,i=347,s=530,r=255,o=s/t,a="";for(let d=0;d<t;d++){let h=(n===3?d+.5:d)/t,f=h*h*r;a+=Be('<rect x="'+rn(e+d*o)+'" y="'+rn(i-f)+'" width="'+rn(o-1)+'" height="'+rn(f)+'" class="wash" data-rise=""/>'+ft([e+d*o,i-f],[e+(d+1)*o,i-f],"secondary"),d)}let l=ie(d=>d*d,0,1,"primary",(d,h)=>[e+d*s,i-h*r]),c=(t-1)*(2*t-1)/(6*t*t),u=(t+1)*(2*t+1)/(6*t*t);return ft([100,i],[665,i],"axis")+a+Be(l,2)+(n>0?Wt("f(x) = x\xB2",528,76)+Wt("n = "+t,113,76):"")+(n===4||n===5?ft([114,392],[644,392],"secondary")+Mt([114+c*900,392],"L\u2099",-25,-14)+Mt([414,392],"1/3",-10,-14)+Mt([114+u*900,392],"R\u2099",0,-14):"")+Ae(n===3?"\uD45C\uBCF8\uC810 \uBCC0\uACBD \xB7 \uC911\uC810 \uBAA8\uD615":"\uC88C\uD569 "+c.toFixed(4)+"  \u2264  1/3  \u2264  \uC6B0\uD569 "+u.toFixed(4))}function $y(n){let t="",e=[1,3,9,8,16,23,12][n];for(let i=0;i<e;i++){let s=e===1?0:-1+2*i/(e-1),r=Math.sqrt(Math.max(0,1-s*s));t+=Be(En(380,233+s*135,155*r,38*r,"secondary")+(n>1?En(380,233+s*135,155*r,38*r,"wash"):""),i)}return t+=En(380,233,155,147,"ghost"),(n===1||n===4||n===5)&&(t+=ft([380,233],[510,233],"primary")+ft([380,233],[380,135],"guide")+Mt([380,233],"O")+Wt("r\xB2 = R\xB2 \u2212 x\xB2",428,130)),n===3&&(t+=cu("M230 175 Q380 130 530 175 L530 197 Q380 157 230 197Z","warning-fill")+Wt("\uACE1\uBA74\uC758 \uB760 \u2260 \uC6D0\uD310\uC758 \uB113\uC774",380,63,"warning-label","middle")),t+Ae(n===3?"\uAC89\uB113\uC774\uB294 \uACE1\uBA74\uC758 \uACBD\uC0AC \uD3ED\uC744 \uBC18\uC601\uD55C\uB2E4.":"A(x) = \u03C0(R\xB2 \u2212 x\xB2) \xB7 \uC587\uC740 \uB2E8\uBA74\uC758 \uD569")}function Ky(n){let t=(r,o)=>[380+r*123,240-o*75],e=[.8,2,1.2,2,2,2,1.6][n],i="";n>0&&(i+=Ue([t(-2,0),t(-2,-2),t(0,0)],"negative-fill",!0)),i+=Ue([t(0,0),t(e,e),t(e,0)],"positive-fill",!0,"positive-area");let s=ft([78,240],[694,240],"axis")+Be(i,0)+Be(ie(r=>r,-2,2,"primary",t),1);return(n===3||n>=4)&&(s+=mn([210,350],[333,375],"secondary")+mn([550,127],[427,375],"primary")+Wt("\u22122",225,301,"label","middle")+Wt("+2",535,180,"label","middle")),s+Ae(n===3?"\uC0C1\uC1C4\uB418\uC5B4\uB3C4 \uC601\uC5ED\uC740 \uB0A8\uB294\uB2E4.":n>=4?"\uC815\uC801\uBD84 = 0    /    \uC804\uCCB4 \uB113\uC774 = 4":"\uAE30\uC900\uC120 \uC704\uB294 +, \uC544\uB798\uB294 \u2212")}function jy(n,t){let e=ri(),i=o=>cp("cubic",o),s="",r="";if(["restore-quadratic","restore","antiderivative"].includes(n)){let o=n==="restore-quadratic"?"quadratic":n==="antiderivative"?"wave":"cubic";i=l=>cp(o,l);let a=t===0?[0]:t===1?[0]:t===2?[-1.5,0,1.5]:t===3?[-2,-1,0,1,2]:t===4?[2]:t===5?[-1.5,0,1.5]:[-.8,.8];for(let[l,c]of a.entries())e+=Be(ie(u=>i(u)+c,-2.35,2.35,l===Math.floor(a.length/2)?"primary":"secondary"),l);t===4&&n==="restore-quadratic"&&(s=Mt(Lt(1,3),"(1, 3)")+Wt("C = 2",543,115)),(t===1||t===4)&&n!=="restore-quadratic"&&(s=ie(l=>o==="wave"?Math.sin(l):l*l-1,-2.1,2.1,"guide")+Wt("\uC810\uC120: \uB3C4\uD568\uC218",75,72,"tiny")),r=n==="restore-quadratic"?t===4?"f(1)=3 \u2192 f(x)=x\xB2+2":"\uAC19\uC740 \uB3C4\uD568\uC218 2x \xB7 \uC11C\uB85C \uB2E4\uB978 \uC0C1\uC218 C":n==="antiderivative"?"\uBAA8\uD615: \uB3C4\uD568\uC218 sin x \u2192 \uC6D0\uD568\uC218 \u2212cos x + C":"\uBAA8\uD615: \uB3C4\uD568\uC218 x\xB2\u22121 \u2192 \uC6D0\uD568\uC218 x\xB3/3\u2212x+C"}else if(n==="zoom"||n==="secant"){let o=n==="zoom",a=[1.4,1.2,.5,.15,.1,.04,.3][t],l=.45;i=d=>d*d;let c=o?[2,1.5,.65,1,.2,.09,.4][t]:1,u=(d,h)=>[380+(d-l)/c*135,245-(h-l*l)/c*95];if(e=ft([70,245],[690,245],"axis")+ft([380,53],[380,400],"axis")+ie(i,l-c*2.1,l+c*2.1,"primary",u)+ie(d=>l*l+2*l*(d-l),l-c*2,l+c*2,"guide",u)+Mt(u(l,l*l),"A"),o)s=ft(u(l+c,i(l+c)),u(l+c,l*l+2*l*c),"warning")+Mt(u(l+c,i(l+c)),"\uACE1\uC120")+Wt("\u03B4 = "+c,79,80),r="\uC774\uCC28\uD568\uC218 \uC608\uC2DC \xB7 |h|\u2264\u03B4\uC5D0\uC11C \uCD5C\uB300 \uCC28\uC774 = \u03B4\xB2 = "+(c*c).toFixed(4);else{let d=l+a,h=l+d;s=ie(f=>l*l+h*(f-l),-1.8,2.1,"secondary")+Mt(Lt(d,d*d),"B",12,-12,"secant-point")+ft(Lt(l,0),Lt(d,0),"warning")+Wt("h = "+a,90,80),e=ri()+ie(i,-1.7,2.05)+ie(f=>l*l+2*l*(f-l),-2,2.5,"guide")+Mt(Lt(l,l*l),"A"),r=t===3?"h\uB294 0\uC774 \uC544\uB2CC \uC0C1\uD0DC\uB85C \uAC00\uAE4C\uC6CC\uC9C4\uB2E4.":"\uD560\uC120 \uAE30\uC6B8\uAE30 "+h.toFixed(2)+" \u2192 \uC811\uC120 \uAE30\uC6B8\uAE30 "+(2*l).toFixed(2)}}else if(n==="join"){let o=t===0?1.5:0,a=[-.5,-.5,.5,-.8,2,2,2][t];e+=ie(l=>l*l,-2.1,1)+ie(l=>1+o+a*(l-1),1,3.3,"secondary")+Mt(Lt(1,1),"s"),t>=2&&(s=ft(Lt(.3,-.4),Lt(1.8,2.6),t<4?"warning":"guide")+Wt("\uC67C\uCABD \uAE30\uC6B8\uAE30 2",80,83)+Wt("\uC624\uB978\uCABD \uAE30\uC6B8\uAE30 "+a,450,83)),t===6&&(s+=Mt(Lt(1.6,2.2),"\uAC19\uC740 \uAE30\uC6B8\uAE30")),t===5&&(s+=qn(...Lt(1,1),25,"secondary")+ft(Lt(.8,0),Lt(.8,1),"guide")+ft(Lt(1.2,0),Lt(1.2,1.4),"guide")),r=t===0?"\uBA3C\uC800 \uD568\uC22B\uAC12\uC758 \uB04A\uAE40\uC744 \uBCF8\uB2E4.":t<4?"\uAC12\uC740 \uAC19\uC544\uB3C4 \uAE30\uC6B8\uAE30\uB294 \uB2E4\uB974\uB2E4.":"P(s)=Q(s), P\u2032(s)=Q\u2032(s)"}else if(n==="ratio"){let o=[.65,.8,1.25,.9,1.1,.75,1.05][t];i=a=>o*(a*a*a-3*a),e+=ie(i,-1.9,1.9)+[-1,0,1].map(a=>Mt(Lt(a,i(a)))).join(""),s=ft([302,355],[458,355],"secondary")+Wt("1",341,382)+Wt("1",419,382)+ft([380,345],[380,365],"secondary"),t===3&&(s+=ft(Lt(-1,i(-1)),Lt(0,0),"warning")+Wt("\uC218\uD3C9 \uAC70\uB9AC\uC640 \uC0AC\uC120 \uAE38\uC774\uB294 \uB2E4\uB974\uB2E4.",380,68,"warning-label","middle")),r="\uBAA8\uD615: a(x\xB3\u22123x) \xB7 \uB450 \uADF9\uC810\uC758 \uAC00\uC6B4\uB370\uC5D0 \uBCC0\uACE1\uC810"}else if(n==="mean-value")if(t===3)e+=ie(o=>Math.abs(o),-2,2)+ft(Lt(-2,2),Lt(2,2),"secondary")+qn(...Lt(0,0),18,"warning"),r="\uBC18\uB840 \uBAA8\uD615 |x| \xB7 \uAD6C\uAC04 \uC548\uC5D0\uC11C \uBBF8\uBD84 \uAC00\uB2A5\uD558\uC9C0 \uC54A\uB2E4.";else{let o=[-1,.1,.5,.5,.5,.5,.8][t];i=a=>a*a/2,e+=ie(i,-1.6,2.3)+ft(Lt(-1,.5),Lt(2,2),"secondary"),s=ie(a=>o*o/2+o*(a-o),-2.5,2.5,"guide")+Mt(Lt(o,i(o)),"c"),r="\uBAA8\uD615 x\xB2/2, [\u22121,2] \xB7 c=1/2\uC5D0\uC11C \uAC19\uC740 \uAE30\uC6B8\uAE30"}else if(n==="chain"||n==="curvature"){let o=n==="chain"?l=>l*l:l=>l*l*l/2,a=n==="chain"?l=>l*l*l/2:l=>l**4/3;if(t===3||t===4)e=lu(ri()+ie(o,-1.7,1.7)+Mt(Lt(0,0)),ri()+ie(a,-1.7,1.7)+Mt(Lt(0,0)),n==="chain"?"x\xB2 \xB7 \u2212 \u2192 +":"x\xB3 \xB7 f\u2033: \u2212 \u2192 +",n==="chain"?"x\xB3 \xB7 + \u2192 +":"x\u2074 \xB7 f\u2033: + \u2192 +"),r=n==="chain"?"\uB3C4\uD568\uC218\uC758 \uC601\uC810 \uC774\uD6C4, \uBD80\uD638 \uBCC0\uD654\uB97C \uD655\uC778\uD55C\uB2E4.":"\uC774\uACC4\uB3C4\uD568\uC218 0 \uC774\uD6C4, \uBD80\uD638 \uBCC0\uD654\uB97C \uD655\uC778\uD55C\uB2E4.";else{let l=[-1.4,-.8,0,0,.2,.8,1.2][t];i=n==="chain"?u=>u*u*u/2:u=>u*u*u/2;let c=1.5*l*l;e+=ie(i,-1.7,1.7)+ie(u=>i(l)+c*(u-l),-2,2,"secondary")+Mt(Lt(l,i(l))),r=n==="chain"?"\uD569\uC131\uD568\uC218 \uB3C4\uD568\uC218\uC758 \uACF1 \xB7 \uC601\uC810\uACFC \uADF9\uAC12\uC740 \uBCC4\uB3C4 \uD310\uC815":"\uBAA8\uD615 x\xB3 \xB7 \uC811\uC120\uC758 \uAE30\uC6B8\uAE30\uAC00 \uC904\uB2E4\uAC00 \uB298\uC5B4\uB09C\uB2E4."}}else{let o=t===6?5:3;i=a=>a*a*a-o*a,e+=ie(i,-1.9,1.9),t===1&&(e+=ie(a=>3*a*a-o,-1.5,1.5,"guide")),t===4&&(e+=ie(a=>3*a*a-o,-1.5,1.5,"secondary")),t===5&&(e+=ft(Lt(0,-3),Lt(0,3),"guide")+Mt(Lt(0,0))),t>=1&&(s=[-Math.sqrt(o/3),Math.sqrt(o/3)].map(a=>Mt(Lt(a,i(a)))).join("")),t>=2&&(s+=mn(Lt(-1.8,1),Lt(-1.3,1),"secondary")+mn(Lt(-.6,-.5),Lt(.1,-.5),"warning")+mn(Lt(1.3,-1),Lt(1.8,-1),"secondary")),t===3&&(e=lu(ri()+ie(i,-1.9,1.9),ri()+ie(a=>a**3/2,-1.8,1.8)+Mt(Lt(0,0)),"\uADF9\uC810: \uBD80\uD638\uAC00 \uBC14\uB01C","\uC815\uC9C0\uC810: \uBD80\uD638\uAC00 \uC548 \uBC14\uB01C"),s=""),r=t===3?"f\u2032(x)=0\uB9CC\uC73C\uB85C\uB294 \uADF9\uAC12\uC744 \uD310\uB2E8\uD560 \uC218 \uC5C6\uB2E4.":"\uBAA8\uD615 x\xB3\u2212"+o+"x \xB7 \uADF9\uC810\uC758 \uC591\uCABD \uBD80\uD638\uB97C \uC77D\uB294\uB2E4."}return e+Be(s,3)+Ae(r)}function Qy(n){let t=ri()+ie(i=>i*i-2,-1.9,2.45),e=Yy(n===0?2.1:1.8,[1,1,3,0,4,5,3][n]);return n===3?t+Mt(Lt(0,-2),"f\u2032(0)=0")+ft(Lt(-2,-2),Lt(2,-2),"warning")+Ae("\uCD9C\uBC1C\uC810 0 \xB7 \uC811\uC120\uC774 x\uCD95\uACFC \uB9CC\uB098\uC9C0 \uC54A\uB294\uB2E4."):(e.forEach((i,s)=>{t+=Be(Ue([Lt(i.x,i.y),Lt(i.next,0),Lt(i.next,i.next*i.next-2)],s===e.length-1?"primary":"secondary")+Mt(Lt(i.x,i.y)),s)}),t+Ae("\uBAA8\uD615 x\xB2\u22122 \xB7 x\u2099\u208A\u2081 = x\u2099 \u2212 f(x\u2099)/f\u2032(x\u2099)"))}function tv(n,t){let e=n==="tangent-merge"?[.6,.8,.5,1,1,.7,.4][t]:[.35,.5,.7,1.3,.25,.35,.9][t],i=1,s=l=>2*l*l*l-3*i*l*l+e,r=[];for(let l of[0,1])Math.abs(s(l))<1e-10&&r.push(l);for(let[l,c]of[[-2,0],[0,1],[1,3]]){let u=l,d=c;if(!(s(u)*s(d)>=0)){for(let h=0;h<50;h++){let f=(u+d)/2;s(u)*s(f)<=0?d=f:u=f}r.push((u+d)/2)}}let o=ri()+ie(l=>l**3,-1.45,1.6);return(t===0?r.slice(0,1):r).forEach((l,c)=>o+=Be(ie(u=>3*l*l*u-2*l**3,-2.5,2.8,"secondary")+Mt(Lt(l,l**3)),c)),o+=Mt(Lt(i,e),"P(1, "+e+")",14,24),t===4&&(o+=ft([180,380],[620,380],"axis"),r.forEach(l=>o+=Mt([340+l*110,380]))),o+Ae(t===3&&n==="tangent-merge"?"\uACBD\uACC4 \xB7 \uC11C\uB85C \uB2E4\uB978 \uC811\uC810 2\uAC1C \xB7 \uD55C \uC811\uC810\uC740 \uC911\uADFC":"\uC11C\uB85C \uB2E4\uB978 \uC811\uC810 "+r.length+"\uAC1C \xB7 2t\xB3\u22123t\xB2+b=0")}function ev(n){let t=[1,2,-67,-68,672,0],e=[-8,-4,0,3,7],i=[e],s=t;for(let a=0;a<4;a++)i.push(Zy(s,i.at(-1))),s=up(s);let r="",o=[1,2,4,2,5,5,4][n];return i.slice(0,o).forEach((a,l)=>{let c=96+l*62;r+=ft([91,c],[665,c],"axis")+Wt(l===0?"f":"f"+"\u2032".repeat(l),50,c+5,"tiny"),a.forEach((u,d)=>{let h=[380+u*30,c];r+=Be(Mt(h,l===0?String(u):""),l+d),l>0&&(r+=Ue([[380+i[l-1][d]*30,c-62],h,[380+i[l-1][d+1]*30,c-62]],"guide"))})}),n===3&&(r+=qn(380,96,17,"warning")+Wt("\uC11C\uB85C \uB2E4\uB978 \uC2E4\uADFC \uC870\uAC74",380,309,"warning-label","middle")),r+Ae("\uC608\uC2DC: (x+8)(x+4)x(x\u22123)(x\u22127) \xB7 \uADFC\uC758 \uC704\uCE58\uB97C \uB530\uB85C \uACC4\uC0B0")}function nv(n){let t=[.65,.65,1,.75,1.12,.9,.85][n],e=(o,a)=>[380+o*114*t,235-a*46*t],i=o=>o*(o*o-1),s="",r=(o,a,l)=>Ue([e(o,0),...Array.from({length:51},(c,u)=>{let d=o+(a-o)*u/50;return e(d,i(d))}),e(a,0)],l,!0);return s+=r(-1,0,"positive-fill")+r(0,1,"negative-fill")+ie(i,-1.5,1.5,"primary",e)+ft(e(-2,0),e(2,0),"axis"),n>=1&&(s+=Wt("\uC0BC\uCC28\uD568\uC218\uC758 \uD45C\uC900\uD654 \uBAA8\uD615",380,67,"label","middle")),n===3&&(s+=Wt("\uAC19\uC740 \uACBD\uACC4\uB97C \uC720\uC9C0\uD574\uC57C \uAC19\uC740 \uBE44\uC728\uC744 \uBE44\uAD50\uD55C\uB2E4.",380,102,"warning-label","middle")),n>=4&&([4,4,5,3,8,7,1].forEach((o,a)=>s+=Be('<rect x="'+(225+a*44)+'" y="'+(385-o*6)+'" width="27" height="'+o*6+'" class="wash" data-rise=""/>'+Wt(String(o),238+a*44,404,"tiny","middle"),a)),s+=Wt("\uD559\uC0DD \uAE30\uB85D\uC5D0 \uC81C\uC2DC\uD55C \uC77C\uACF1 \uB113\uC774\uBE44 \xB7 \uACBD\uACC4\uC640 \uD568\uAED8 \uC77D\uAE30",380,302,"tiny","middle")),s+Ae("\uC0BC\uCC28\uD568\uC218\uC758 \uAC00\uB85C n \xB7 \uC138\uB85C |a|n\xB3 \u2192 \uB113\uC774 \uACF5\uD1B5 \uBC30\uC728 |a|n\u2074")}function iv(n){let t=a=>a+1,e=a=>(a+1)/(a-1),i=(a,l)=>[110+(a-1)*370,345-l*48],s=(a,l=!1)=>ft([100,345],[650,345],"axis")+ft([110,65],[110,365],"guide")+ie(a,1.02,2.45,l?"warning":"primary",i),r=s(n===3?e:t,n===3);return[[],[1.5,1.25],[1.2,1.1,1.05,1.01],[1.5,1.2,1.1],[1.25,1.125,1.0625],[1.4],[1.6,1.05]][n].forEach((a,l)=>r+=Be(Mt(i(a,n===3?e(a):t(a))),l)),n===5?r=lu(s(t),s(e,!0),"0/0 \u2192 2","2/0\u207A \u2192 +\u221E"):n===3?r+=Wt("(x+1)/(x\u22121)",418,98,"warning-label")+Wt("\uBBF8\uBD84\uD55C \uBE44 1 \u2260 \uC6D0\uB798 \uADF9\uD55C +\u221E",380,78,"warning-label","middle"):r+=Wt("(x\xB2\u22121)/(x\u22121) = x+1",295,82)+ft([110,249],[645,249],"guide")+qn(110,249,6,"primary"),n===4&&(r+=Ue([[190,325],[325,325],[460,325]],"secondary")+qn(190,325,17,"secondary")+qn(325,325,17,"secondary")+qn(460,325,17,"secondary")),r+Ae(n===3?"2/0\uD615 \xB7 \uAC19\uC740 \uBBF8\uBD84 \uACC4\uC0B0\uC744 \uC801\uC6A9\uD560 \uC218 \uC5C6\uB2E4.":n===5?"\uD615\uD0DC \uD655\uC778 \u2192 \uC801\uC6A9 \uC870\uAC74 \uD655\uC778 \u2192 \uB3C5\uB9BD\uC801\uC778 \uAC80\uC0B0":"0/0\uD615 \xB7 \uC870\uAC74 \uD655\uC778 \uB4A4, \uADF9\uD55C\uAC12 2")}function sv(n){let t=[.2,.7,1.2,1.7,2.2,2.7],e=t.map(l=>.7+.6*l+.09*Math.sin(4*l)),i=(l,c)=>[140+l*170,350-c*110],s=[l=>.7+.6*l,l=>.65*Math.exp(.6*l),l=>2.8/(1+Math.exp(-2*(l-1.2)))],r=ft([115,350],[667,350],"axis")+ft([140,54],[140,368],"axis"),o=n===0||n===5?1:n===1||n===3||n===4?3:2,a=n===3?2:n===5?0:1;return s.slice(0,o).forEach((l,c)=>r+=Be(ie(l,0,2.9,c===0?"primary":"secondary",i),c)),t.forEach((l,c)=>{if(r+=Mt(i(l,e[c])),n>=2&&(r+=ft(i(l,e[c]),i(l,s[a](l)),"warning")),n===4){let u=Math.abs(e[c]-s[1](l))*35;r+='<rect x="'+(174+c*74)+'" y="'+(390-u)+'" width="25" height="'+u+'" class="wash" data-rise=""/>'}}),r+Wt("\uC804\uC2DC \uC124\uBA85\uC744 \uC704\uD55C \uAC00\uC0C1 \uC790\uB8CC",380,68,"tiny","middle")+Ae(n>=4?"\uC794\uCC28 \u2192 \uAC19\uC740 \uC624\uCC28 \uAE30\uC900\uC73C\uB85C \uBE44\uAD50":"\uC77C\uCC28 \xB7 \uC9C0\uC218 \xB7 \uB85C\uC9C0\uC2A4\uD2F1 \uD6C4\uBCF4 \xB7 \uC2E4\uC81C \uCE21\uC815 \uC790\uB8CC \uC544\uB2D8")}var dp=(n=280,t="wash")=>Ue([[148,n+30],[450,n-58],[631,n+25],[330,n+113]],t,!0);function rv(n,t){let e=dp(),i="",s=n==="plane-distance"?[99,137,90,174,122,151,110][t]:99,r=[355-(286-s)*.13,s],o=[355,286];if(n==="line-plane"){let a=t===0||t===1||t===2?0:t===3?1:t===4||t===5?2:1,l=a===0?100:0,c=a===2?83:0;t>=1&&(e+=mn([465,293],[465,100],"secondary")+Wt("n",475,111));let u=t===2?145:l;e+=ft([190,174+c-u],[597,174+c+u],"primary","line-direction")+Mt([380,174+c],"P",12,-12,"line-anchor"),t===5&&(e+=ft([220,184],[565,184],"warning")+Mt([440,184],"\uD3C9\uBA74 \uBC16",12,-12)),t===3&&(e+=ft([170,283],[627,283],"guide")),i=["\uAD50\uCC28 \xB7 n\xB7v \u2260 0","\uD3C9\uD589 \xB7 n\xB7v = 0, P\uB294 \uD3C9\uBA74 \uBC16","\uD3EC\uD568 \xB7 n\xB7v = 0, P\uB294 \uD3C9\uBA74 \uC704"][a]}else if(n==="overlap"){let a=[145,110,55,0,0,0,60][t],l=[330+a,176],c=[355+a,286];e+=Mt(r,"A")+Mt(l,"B")+ft(r,o,"guide")+ft(l,c,"guide")+Mt(o,"A\u2032",-30,25)+(a>0?Mt(c,"B\u2032",12,25):qn(...o,14,"secondary"))+mn([595,98],[620,210],"secondary"),(t===3||t===4)&&(e+=ft(r,l,"warning")+Wt("\uB2E4\uB978 \uB450 \uC810",375,65,"warning-label","middle")),i=a===0?"\uCC28\uBCA1\uD130\uAC00 \uAD00\uCC30 \uBC29\uD5A5\uACFC \uB098\uB780\uD574\uC838 \uD22C\uC601\uC774 \uACB9\uCE5C\uB2E4.":"\uAD00\uCC30 \uBC29\uD5A5\uC740 \uACE0\uC815 \xB7 \uB450 \uC810\uC758 \uD22C\uC601 \uC704\uCE58\uB97C \uBE44\uAD50"}else{let a=[485,485,560,465,355,355,440][t],l=[a,286+.1*(a-355)];e+=Mt(r,"P")+Mt(o,"H",-24,26)+(t>=1?ft(r,o,"guide","distance-drop"):""),n==="minimum"?e+=Mt(l,"Q",10,20)+ft(r,l,t===4?"secondary":"primary")+ft(o,l,"secondary"):e+=mn(o,[332,110],"secondary","normal-vector")+Wt("\uBC95\uC120 n",402,126)+(t>=2?ft(r,[520,300],"ghost"):""),e+=Ue([[352,265],[371,270],[374,288]],"secondary"),t===3&&(e+=Wt(n==="minimum"?"\uBE57\uBCC0 \u2265 \uC218\uC120":"\uBC95\uC120 \uBCA1\uD130\uB97C \uB2E8\uC704 \uAE38\uC774\uB85C",380,63,"warning-label","middle")),i=n==="minimum"?"PQ\xB2 = PH\xB2 + HQ\xB2 \u2265 PH\xB2":n==="plane-distance"?"\uBC95\uC120 \uBC29\uD5A5 \uC131\uBD84 \xF7 \uBC95\uC120\uC758 \uD06C\uAE30 = \uAC70\uB9AC":"\uD55C \uBC29\uD5A5\uC73C\uB85C \uBD84\uB9AC\uD558\uBA74 \uC218\uC120\uC774 \uB0A8\uB294\uB2E4."}return e+Ae(i)}function ov(n){let t=[170,325],e=[610,105],i=[.3,.3,.65,1.16,.5,.75,.4][n],s=t.map((o,a)=>(1-i)*o+i*e[a]),r=Ue([t,[610,325],e],"guide")+ft(t,e)+Mt(t,"A",-24,25)+Mt(e,"B")+Mt(s,"P",12,25,"space-moving-point");return n>=1&&(r+=Ue([t,[s[0],325],s],"secondary")+Wt("x \xB7 y \xB7 z \uB97C \uAC19\uC740 \uBE44\uC728\uB85C",380,65,"label","middle")),n===3&&(r+=ft(e,s,"warning")),r+Ae("\u03BB = "+i+" \xB7 "+(i>1?"\uC678\uBD84: \uC120\uBD84 \uBC16":"\uB0B4\uBD84: \uC120\uBD84 \uC548"))}function av(n,t){let r=n==="sphere-slice"?[.2,.45,.65,1.13,.5,.72,.3][t]:n==="dimension"?[0,.25,.5,1,.6,.75,.4][t]:[.2,.4,.7,-.65,.9,1,.45][t],o=qn(380,224,141,"ghost")+En(380,224,141,39,"ghost")+En(380,224,51,141,"ghost"),a="";if(n==="sphere-extreme"){let l=[2.6,2.1,1.4,.9,.3,0,1][t],c=[380+141*Math.cos(l),224-141*Math.sin(l)],u=[c[0],365];o+=mn([180,365],[580,365],"secondary")+ft([380,224],c)+Mt(c,"P",12,-12,"sphere-point")+ft(c,u,"guide","sphere-shadow")+Mt(u,"\uC0AC\uC601",-15,30)+ft([380,365],u,"primary")+Mt([380,224],"C"),t===3&&(o+=En(380,224,141*1.3,141*.7,"warning")+Wt("\uD0C0\uC6D0\uCCB4\uB85C \uADF8\uB300\uB85C \uD655\uC7A5\uD560 \uC218 \uC788\uC744\uAE4C?",380,54,"warning-label","middle")),a="\uAD6C\uC758 \uBC18\uC9C0\uB984 \uBC29\uD5A5\uC744 \uACE0\uC815\uCD95\uC5D0 \uC815\uC0AC\uC601\uD55C\uB2E4."}else{let l=224-r*141,c=Math.sqrt(Math.max(0,1-r*r))*141;if(o+=dp(l-50,"plane-wash"),r<=1&&(o+=En(380,l,c,c*.26,"primary",'data-morph="slice-ring"')+(t>=2?En(380,l,c,c*.26,"wash"):"")+ft([380,224],[380,l],"guide","slice-depth")+ft([380,l],[380+c,l],"secondary","slice-radius")+ft([380,224],[380+c,l],"secondary","slice-hypotenuse")+Mt([380,224],"O")+Mt([380,l],"H",-25,-12),t===2||t===4))for(let u=0;u<8;u++)o+=Be(Mt([380+c*Math.cos(u*Math.PI/4),l+c*.26*Math.sin(u*Math.PI/4)]),u);t===3&&n==="sphere-slice"&&(o+=qn(380,83,5,"warning")+Wt("d=R: \uD55C \uC810 / d>R: \uB9CC\uB098\uC9C0 \uC54A\uC74C",380,64,"warning-label","middle")),a=n==="dimension"?"\uD574\uC124 \uBAA8\uD615: \uD55C \uC88C\uD45C \uACE0\uC815 \u2192 \uBC18\uC9C0\uB984 \u221A(R\xB2\u2212d\xB2)\uC758 \uB0AE\uC740 \uCC28\uC6D0 \uAD6C":r>1?"d > R \xB7 \uC2E4\uC218 \uBC18\uC9C0\uB984\uC744 \uAC16\uB294 \uB2E8\uBA74\uC774 \uC5C6\uB2E4.":"d/R = "+r+" \xB7 r/R = "+Math.sqrt(1-r*r).toFixed(3)}return o+Ae(a)}function lv(n){let t=[.15,.3,.85,Math.PI/2,Math.PI/3,.65,.45][n],e=150*Math.cos(t),i=[[230,105],[530,105],[570,105+e],[270,105+e]],s=[[230,290],[530,290],[570,290+e*.4],[270,290+e*.4]],r=Ue(s,"wash",!0,"shadow-face")+Ue(i,"primary",!0,"original-face");return i.forEach((o,a)=>r+=Be(ft(o,s[a],"guide","projection-ray-"+a)+Mt(o),a)),r+=Wt("\uC6D0\uB798 \uBA74",570,106)+Wt("\uC815\uC0AC\uC601",570,337)+mn([145,130],[145,320],"secondary"),r+Ae("\u03B8 = "+Math.round(t*180/Math.PI)+"\xB0 \xB7 \uADF8\uB9BC\uC790 \uB113\uC774 / \uC6D0\uB798 \uB113\uC774 = "+Math.abs(Math.cos(t)).toFixed(3))}function cv(n,t){let e=n==="conic-boundary",i=n==="focal"&&t>=3||e&&t===2,s=e&&t===3,r=2.25,o=1.45,a=Math.sqrt(r*r-o*o),l=[.4,.7,1.05,.2,1.4,1.1,.55][t],c="",u=Lt(-o,0),d=Lt(o,0);if(s)c=ft(u,d,"warning")+Wt("\uAC70\uB9AC\uC758 \uD569 = \uCD08\uC810 \uC0AC\uC774 \uAC70\uB9AC",380,93,"warning-label","middle");else if(i){c+=ie(m=>Math.sqrt(o*o-1.1*1.1)*Math.sqrt(Math.max(0,m*m/(1.1*1.1)-1)),1.1,2.8)+ie(m=>-Math.sqrt(o*o-1.1*1.1)*Math.sqrt(Math.max(0,m*m/(1.1*1.1)-1)),1.1,2.8)+ie(m=>Math.sqrt(o*o-1.1*1.1)*Math.sqrt(Math.max(0,m*m/(1.1*1.1)-1)),-2.8,-1.1)+ie(m=>-Math.sqrt(o*o-1.1*1.1)*Math.sqrt(Math.max(0,m*m/(1.1*1.1)-1)),-2.8,-1.1);let h=[.2,.4,.5,.3,.65,.9,.45][t],f=Lt(1.1*Math.cosh(h),Math.sqrt(o*o-1.1*1.1)*Math.sinh(h));c+=ft(u,f,"secondary")+ft(f,d,"primary")+Mt(f,"P")}else{c+=En(380,254,r*78,a*48);let h=Lt(r*Math.cos(l),a*Math.sin(l));t>0&&(c+=Be(ft(u,h,"secondary")+ft(h,d,"primary")+Mt(h,"P"),2))}return c+=Mt(u,"F\u2081",-12,26)+Mt(d,"F\u2082",-12,26),c+Ae(s?"\uACBD\uACC4\uC5D0\uC11C\uB294 \uC120\uBD84\uC73C\uB85C \uD1F4\uD654\uD55C\uB2E4.":i?"\uC608\uC2DC \uC30D\uACE1\uC120 \xB7 |PF\u2081\u2212PF\u2082| = \uC77C\uC815":"\uC608\uC2DC \uD0C0\uC6D0 \xB7 PF\u2081+PF\u2082 = \uC77C\uC815")}function hv(n){let t=[.65,.8,.8,.8,.8,1,.65][n],e=[1.2,1.1,.6,-1.2,1.5,1.1,.5][n],i=l=>l*l/(4*t),s=Lt(e,i(e)),r=Lt(0,t),o=Lt(e,-t),a=ri()+ie(i,-2.55,2.55)+Mt(r,"F")+ft(Lt(-3.1,-t),Lt(3.1,-t),"guide")+Wt("\uC900\uC120 y=\u2212p",75,254+t*48+26);return n>=1&&(a+=Be(ft(r,s,"primary")+ft(s,o,"secondary")+Mt(s,"P")+Mt(o,"H",8,25),2)),n===3&&(a+=ft(s,Lt(-2,-t),"warning")+Wt("\uC900\uC120 \uC704 \uC784\uC758 \uC810\uAE4C\uC9C0\uC758 \uAC70\uB9AC\uC640\uB294 \uB2E4\uB974\uB2E4.",380,66,"warning-label","middle")),a+Ae("\uCD08\uC810 \uAC70\uB9AC = \uC900\uC120\uAE4C\uC9C0\uC758 \uC218\uC9C1 \uAC70\uB9AC \xB7 x\xB2 = 4py")}function uv(n){let t=[2.25,2.25,2.25,1.3,2.25,2.25,2.25][n],e=1.3,i=Math.sqrt(Math.max(0,t*t-e*e)),s=[.3,.5,1.1,.1,1.8,2.1,.8][n],r=[380+t*95*Math.cos(s),232-i*65*Math.sin(s)],o=[380-e*95,232],a=[380+e*95,232],l=En(380,232,t*95,i*65,"primary",'data-morph="ellipsoid-section"')+En(380,232,t*95,i*24,"ghost")+En(380,232,t*30,i*65,"ghost")+Mt(o,"F\u2081",-12,25)+Mt(a,"F\u2082",-12,25);return n>=1&&(l+=Be(ft(o,r,"secondary")+ft(a,r,"primary")+Mt(r,"P"),2)),n===4&&(l+=En(380,232,t*95,i*30,"secondary",'transform="rotate(-25 380 232)"')),l+Ae(n===3?"a=c \xB7 \uD68C\uC804\uD0C0\uC6D0\uCCB4\uAC00 \uC120\uBD84\uC73C\uB85C \uD1F4\uD654\uD55C\uB2E4.":"\uC608\uC2DC \uD68C\uC804\uD0C0\uC6D0\uCCB4 \xB7 \uB450 \uCD08\uC810\uAE4C\uC9C0 \uAC70\uB9AC\uC758 \uD569 = 2a")}function dv(n,t){let e=n==="cone-discriminant",i=e?[.35,.65,.92,1,1.25,1.15,.7][t]:[0,.4,.7,1,1.28,.9,.3][t],s=.5,r=(l,c,u)=>[380+75*l+35*c,224-70*u+18*c],o="";for(let l of[-1,1]){let c=[];for(let u=0;u<=120;u++){let d=u/120*Math.PI*2;c.push(r(2*Math.cos(d),2*Math.sin(d),2*l))}o+=Ue(c,"ghost");for(let u of[Math.atan2(35,75),Math.atan2(35,75)+Math.PI])o+=ft(r(0,0,0),r(2*Math.cos(u),2*Math.sin(u),2*l),"ghost")}o+=Ue([r(-2,-2,-2*i+s),r(2,-2,2*i+s),r(2,2,2*i+s),r(-2,2,-2*i+s)],"plane-wash",!0,"cut-plane");for(let l of[1,-1]){let c=[];for(let u=0;u<=360;u++){let d=u/360*Math.PI*2,h=l*s/(1-l*i*Math.cos(d));h>0&&h<2?c.push(r(h*Math.cos(d),h*Math.sin(d),l*h)):c.length&&(c.length>1&&(o+=Ue(c)),c=[])}c.length>1&&(o+=Ue(c))}let a=i===0?"\uC6D0":i<1?"\uD0C0\uC6D0":i===1?"\uD3EC\uBB3C\uC120":"\uC30D\uACE1\uC120";return t>=3&&(o+=Wt("\uC808\uB2E8 \uC870\uAC74: "+a,380,47,t===3?"warning-label":"label","middle")),o+Ae(e?"\uC608\uC2DC k=1 \xB7 1\u2212m\xB2 = "+(1-i*i).toFixed(3)+" \xB7 "+a:"\uC6D0\uBFD4\uACFC \uC808\uB2E8\uD3C9\uBA74\uC758 \uAD50\uC120 \xB7 "+a)}function fv(n){let t=[.65,.65,1.1,0,.55,.8,.3][n],e=2.2,i=1.4,s=Lt(e*Math.cos(t),i*Math.sin(t)),r=[-e*Math.sin(t),i*Math.cos(t)],o=En(380,254,e*78,i*48)+Mt(s,"P",12,-12,"tangent-point");return n>=1&&(o+=Be(ft([s[0]-r[0]*156,s[1]+r[1]*96],[s[0]+r[0]*156,s[1]-r[1]*96],"secondary"),2)),n===3&&(o+=Wt("x=a \xB7 \uC218\uC9C1 \uC811\uC120",380,75,"warning-label","middle")),n>=4&&(o+=qn(...s,22,"secondary")+Wt("D=0 \xB7 \uAC19\uC740 \uAD50\uC810\uC774 \uB450 \uBC88",380,354,"label","middle")),o+Ae(n===3?"\uAE30\uC6B8\uAE30\uB85C \uD45C\uD604\uD560 \uC218 \uC5C6\uC5B4\uB3C4 \uC911\uADFC \uC870\uAC74\uC740 \uB0A8\uB294\uB2E4.":"\uD0C0\uC6D0 \uC704 \uC811\uC810 \xB7 xx\u2081/a\xB2 + yy\u2081/b\xB2 = 1")}function pv(n){let t=[.55,.7,Math.PI/2,2.2,2.6,2.05,1.2][n],e=[320,289],i=[320+210*Math.cos(t),289-170*Math.sin(t)],s=[i[0],289],r=mn(e,[620,289],"secondary")+mn(e,i,"primary","moving-vector")+Mt(e,"O",-25,25);return n>=1&&(r+=ft(i,s,"guide","vector-drop")+ft(e,s,n>2?"warning":"primary","vector-component")+Mt(s)),r+=Wt("u",640,294)+Wt("v",i[0]+14,i[1]-14),r+Ae("\u03B8 = "+Math.round(t*180/Math.PI)+"\xB0 \xB7 cos \u03B8 = "+Math.cos(t).toFixed(3)+" \xB7 \uB0B4\uC801 "+(Math.abs(Math.cos(t))<1e-8?"0":t>Math.PI/2?"\uC74C\uC218":"\uC591\uC218"))}function mv(n){let t=[0,Math.PI/12,Math.PI/4,Math.PI/2,Math.PI/4,Math.PI/6,Math.PI/5][n],e=Math.cos(t),i=Math.sin(t),s=ri()+ie(l=>l*l,-1.75,1.75,"ghost"),r=Lt(0,0),o=(l,c)=>Lt(e*l-i*c,i*l+e*c);s+=mn(o(-2.5,0),o(2.5,0),"primary","axis-x")+mn(o(0,-2.5),o(0,3.3),"secondary","axis-y");let a=Lt(1,1);return s+=Mt(a,"\uACE0\uC815\uB41C \uC810")+ft(r,a,"guide"),n>=2&&(s+=Wt("X",...o(2.6,0))+Wt("Y",...o(0,3.5))),s+Ae("\uC88C\uD45C\uCD95 \uD68C\uC804 "+Math.round(t*180/Math.PI)+"\xB0 \xB7 XY \uACC4\uC218 \u2212sin(2\u03B8) = "+(-Math.sin(2*t)).toFixed(3))}function gv(n){let e=(a,l)=>[380+a*92,340-l*68],i=a=>a*a/3.6,s=e(0,.9),r=ie(i,-2.8,2.8,"primary",e)+Mt(s,"F");return(n===0?[-1.6]:n===1?[-1.6]:n===2?[-2,-1,1,2]:n===3?[0]:[-2.3,-1.2,.8,2]).forEach((a,l)=>{let c=e(a,i(a));if(r+=Be(ft([c[0],57],c,"secondary")+(n>=2?mn(c,s):"")+Mt(c),l),n===1){let u=a/1.8;r+=ft([c[0]-70,c[1]+70*u*68/92],[c[0]+70,c[1]-70*u*68/92],"guide")}}),r+Ae(n===3?"\uAF2D\uC9D3\uC810\uC5D0\uC11C\uB294 \uC785\uC0AC\uAD11\uACFC \uBC18\uC0AC\uAD11\uC774 \uCD95 \uC704\uC5D0\uC11C \uACB9\uCE5C\uB2E4.":"\uD3EC\uBB3C\uC120\uC758 \uCD95\uACFC \uD3C9\uD589\uD55C \uC785\uC0AC\uAD11 \u2192 \uCD08\uC810 F")}function _v(n){let t=[1.6,2.1,2.8,2.1,3.7,4.4,2.8][n],e=(o,a)=>[380+o*57,260-a*43],i=ft(e(-4.8,-4.8),e(4.8,4.8),"guide")+ft(e(-4.8,4.8),e(4.8,-4.8),"guide");if(n===3)return i=ri()+ie(o=>.5*o*o,-2.5,2.5)+ie(o=>o+1,-2.5,2.5,"warning")+Ae("\uD55C \uC9C1\uC120\uACFC \uBA87 \uC810\uC758 \uAC70\uB9AC\uB9CC\uC73C\uB85C \uC77C\uBC18\uD654\uD560 \uC218 \uC5C6\uB2E4."),i;for(let o of[-1,1])for(let a of[-1,1])i+=ie(l=>o*Math.sqrt(l*l-1),a<0?-4.6:1,a<0?-1:4.6,"primary",e);let s=e(t,Math.sqrt(t*t-1)),r=e(t,t);return i+=Mt(s,"\uACE1\uC120",15,16)+ft(s,r,"warning")+Mt(r,"\uC9C1\uC120",15,-12),i+Ae("\uC608\uC2DC x\xB2\u2212y\xB2=1 \xB7 \uC218\uC9C1 \uD2C8 x\u2212\u221A(x\xB2\u22121) = "+(t-Math.sqrt(t*t-1)).toFixed(4))}function xv(n){let t=r=>Math.log(2)/Math.log(1+r/100),e=(r,o)=>[105+(r-1)*40,367-o*4.3],i=[8,8,4,1.5,12,8,6][n],s=ft([100,367],[694,367],"axis")+ie(t,1.1,15,"primary",e)+ie(r=>72/r,1.1,15,"guide",e)+Mt(e(i,t(i)),"\uC815\uD655\uAC12",16,25);if(n>=1&&(s+=ft(e(i,t(i)),e(i,72/i),"warning")+Mt(e(i,72/i),"72/r",16,-12)),n===4)for(let r of[2,4,6,8,10,12,14])s+=ft(e(r,t(r)),e(r,72/r),"warning");return s+Ae("r="+i+"% \xB7 \uC815\uD655 "+t(i).toFixed(3)+"\uB144 / 72\uC758 \uBC95\uCE59 "+(72/i).toFixed(3)+"\uB144")}function yv(n){let t=[-.9,-.9,.2,.7,.7,-.4,.3][n],e=(o,a,l)=>[380+o*80+a*35,320+a*30-l*18],i=(o,a)=>o*o+2*a*a,s="";for(let o=-2;o<=2;o+=.4){let a=[];for(let l=-2.1;l<=2.1;l+=.06)a.push(e(l,o,i(l,o)));s+=Ue(a,"ghost")}for(let o=-2;o<=2;o+=.4){let a=[];for(let l=-2;l<=2;l+=.06)a.push(e(o,l,i(o,l)));s+=Ue(a,"ghost")}let r=[];for(let o=-2.1;o<=2.1;o+=.05)r.push(e(o,t,i(o,t)));if(s+=Be(Ue(r),2),n>=1&&(s+=Ue([e(-2.2,t,-1),e(2.2,t,-1),e(2.2,t,8),e(-2.2,t,8)],"plane-wash",!0,"slice-plane")),n>=4){let a=e(.85,t,i(.85,t)),l=2*.85;s+=ft(e(-.5,t,i(.85,t)+l*(-.5-.85)),e(2,t,i(.85,t)+l*(2-.85)),"secondary","slice-tangent")+Mt(a)}return s+Ae("z=x\xB2+2y\xB2 \xB7 y="+t+"\uB97C \uACE0\uC815\uD55C \uB2E8\uBA74 \xB7 x \uBC29\uD5A5 \uAE30\uC6B8\uAE30 2x")}function fp(n,t){let e=rc(n),i=Math.max(0,Math.min(6,Math.trunc(t))),s=e.family,r;if(["zoom","secant","join","ratio","mean-value","chain","curvature","extrema","restore","restore-quadratic","antiderivative"].includes(s))r=jy(s,i);else if(["line-plane","overlap","minimum","plane-distance"].includes(s))r=rv(s,i);else if(["sphere-slice","sphere-extreme","dimension"].includes(s))r=av(s,i);else if(["focal","conic-boundary"].includes(s))r=cv(s,i);else if(["cone-cut","cone-discriminant"].includes(s))r=dv(s,i);else if(["tangents","tangent-merge"].includes(s))r=tv(s,i);else{let u={riemann:Jy,volume:$y,signed:Ky,newton:Qy,rolle:ev,"area-scale":nv,limits:iv,model:sv,"space-points":ov,projection:lv,parabola:hv,ellipsoid:uv,"conic-tangent":fv,dot:pv,rotation:mv,reflection:gv,asymptote:_v,compound:xv,surface:yv};if(!u[s])throw Error("\uB3C4\uD574\uAC00 \uC5C6\uB294 \uC7A5\uBA74 "+s);r=u[s](i)}let o={calculus:"#ffb47f",geometry:"#b5c5ff",economics:"#91e5c6"}[n.subjectKey]||"#b5c5ff",a='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 760 470" aria-hidden="true" focusable="false" data-family="'+s+'" data-phase="'+i+'"><style>.primary,.secondary,.guide,.axis,.ghost,.warning{fill:none;stroke-linecap:round;stroke-linejoin:round}.primary{stroke:'+o+";stroke-width:2.5}.secondary{stroke:#e2ebfa;stroke-width:1.5;opacity:.8}.guide{stroke:#a5b3cd;stroke-width:1.2;stroke-dasharray:5 7;opacity:.7}.axis{stroke:#a5b3cd;stroke-width:.8;opacity:.25}.ghost{stroke:#b6c4df;stroke-width:1;opacity:.23}.warning{stroke:#ffd593;stroke-width:2;stroke-dasharray:4 5}.node{fill:"+o+";stroke:#fff4e5;stroke-width:1.1}.wash{fill:"+o+";fill-opacity:.12;stroke:"+o+";stroke-width:1}.plane-wash{fill:#b5c5ff;fill-opacity:.07;stroke:#c1cbdf;stroke-opacity:.4;stroke-width:1}.positive-fill{fill:"+o+";fill-opacity:.26;stroke:"+o+';stroke-width:1}.negative-fill{fill:#86b2ef;fill-opacity:.27;stroke:#86b2ef;stroke-width:1}.warning-fill{fill:#ffd593;fill-opacity:.25;stroke:#ffd593;stroke-width:1}.label,.metric,.tiny,.warning-label{font-family:"Malgun Gothic","Apple SD Gothic Neo",sans-serif;fill:#e3ebfa;font-weight:400}.label{font-size:15px}.metric{font-size:15px;fill:#f5f6fb}.tiny{font-size:12px;fill:#a9bad5}.warning-label{font-size:15px;fill:#ffd593}</style>'+r+"</svg>",c=(r.match(/class="metric"[^>]*>([^<]+)</)?.[1]||e.focus).replace(/&amp;/g,"&").replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&quot;/g,'"').replace(/&#39;/g,"'");return{svg:a,phase:i,family:s,headline:e.beats[i],focus:e.focus,annotation:c}}var pp=n=>String(n).replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t]),vv=new Set(["zoom","dimension","sphere-slice","surface"]),mp=new Set(["riemann","volume","rolle","newton","space-points","reflection"]),Mv=new Set(["projection","rotation","dot","cone-cut","cone-discriminant","ellipsoid"]),oc=class{constructor(t,e,{motion:i=!0}={}){this.host=t,this.work=e,this.enabled=i,this.phase=-1,this.animations=[],this.destroyed=!1,this.visibilityHandler=()=>{document.hidden&&this.finish()},document.addEventListener("visibilitychange",this.visibilityHandler),t.dataset.renderer="motion-svg"}finish(){this.animations.forEach(t=>{t.pause(),t.revert()}),this.animations=[],this.host.querySelectorAll("[data-outgoing]").forEach(t=>t.remove()),this.host.querySelectorAll("[data-draw]").forEach(t=>{t.style.removeProperty("stroke-dasharray"),t.style.removeProperty("stroke-dashoffset")}),this.host.classList.remove("is-playing")}setMotion(t){t!==this.enabled&&(this.enabled=t,t||this.finish())}setPhase(t,{replay:e=!1}={}){if(this.destroyed)return;let i=Math.max(0,Math.min(6,Math.trunc(t)));if(i===this.phase&&!e)return;this.finish();let s=this.host.querySelector(".motion-frame"),r=this.phase,o=i>=r?1:-1,a=fp(this.work,i),l=document.createElement("div");l.className="motion-frame",l.innerHTML='<div class="motion-stage-copy"><p class="motion-kicker"><span>'+String(i+1).padStart(2,"0")+"</span> "+lp[i]+"</p><h3>"+pp(a.headline)+'</h3><div class="motion-focus"><span></span><p>'+pp(a.focus)+'</p></div><small>\uC804\uC2DC \uD574\uC124 \xB7 \uC608\uC2DC \uBAA8\uD615</small></div><div class="motion-illustration">'+a.svg+"</div>",this.phase=i,this.host.dataset.phase=String(i),this.host.dataset.family=a.family,this.host.setAttribute("aria-label",a.headline+" "+a.focus+"\uC5D0 \uB300\uD55C \uC804\uC2DC \uD574\uC124\uC6A9 \uB3C4\uD574"),s&&(s.setAttribute("data-outgoing",""),s.setAttribute("aria-hidden","true"),this.enabled||s.remove()),this.host.append(l);let c=this.host.closest(".motion-theater")?.querySelector(".scene-live-caption");if(c&&(c.textContent=a.annotation),!this.enabled||document.hidden)return;this.host.classList.add("is-playing");let u=(x,g)=>{if(!x||x.length===0)return;let p=Hs(x,g);return this.animations.push(p),p},d=0;s&&!e&&l.querySelectorAll("[data-morph]").forEach(x=>{let g=s.querySelector('[data-morph="'+x.dataset.morph+'"]');if(!g||g.tagName!==x.tagName)return;let p={};for(let S of["d","cx","cy","r","rx","ry","x","y","width","height"]){let A=g.getAttribute(S),M=x.getAttribute(S);A===null||M===null||A===M||S==="d"&&(A.replace(/[-+\d.e]+/gi,"")!==M.replace(/[-+\d.e]+/gi,"")||(A.match(/[-+]?\d*\.?\d+(?:e[-+]?\d+)?/gi)||[]).length!==(M.match(/[-+]?\d*\.?\d+(?:e[-+]?\d+)?/gi)||[]).length)||(p[S]=[A,M])}Object.keys(p).length&&(u(x,{...p,duration:1250,ease:"inOut(3)"}),d++)}),this.host.dataset.morphs=String(d),s&&u(s,{opacity:[1,0],translateX:[0,-o*50],duration:240,ease:"in(2)",onComplete:()=>s.remove()}),u(l,{opacity:[0,1],translateX:[o*34,0],duration:560,ease:"out(3)"}),u(l.querySelector(".motion-stage-copy h3"),{opacity:[0,1],translateY:[18,0],duration:650,delay:100,ease:"out(4)"});let h=l.querySelector(".motion-illustration");vv.has(a.family)?u(h,{scale:[i===0?1.23:o>0?1.13:.91,1],duration:1150,ease:"out(4)"}):Mv.has(a.family)&&u(h,{rotate:[o*-4,0],scale:[.94,1],duration:1100,ease:"out(4)"});let f=l.querySelectorAll("[data-stage-group]");u(f,{opacity:[0,1],translateY:[mp.has(a.family)?24:10,0],delay:wi(mp.has(a.family)?45:28,{start:160}),duration:680,ease:"out(3)"});let m=l.querySelectorAll(".primary[data-draw],.secondary[data-draw]");m.forEach(x=>{x.style.strokeDasharray="1",x.style.strokeDashoffset="1"}),u(m,{strokeDashoffset:[1,0],delay:wi(35,{start:200}),duration:950,ease:"inOut(3)"}),u(l.querySelectorAll(".node[data-pop]"),{opacity:[0,1],scale:[.2,1],delay:wi(45,{start:420}),duration:560,ease:"out(3)"}),u(l.querySelectorAll("[data-label]"),{opacity:[0,1],delay:wi(18,{start:530}),duration:480,ease:"out(2)"}),u(l.querySelectorAll(".wash[data-rise],.positive-fill,.negative-fill"),{opacity:[0,1],scaleY:[.15,1],delay:wi(30,{start:240}),duration:880,ease:"out(3)"})}replay(){this.setPhase(this.phase,{replay:!0})}dispose(){this.destroyed=!0,this.finish(),document.removeEventListener("visibilitychange",this.visibilityHandler),this.host.replaceChildren()}};var oi={calculus:{label:"\uBBF8\uC801\uBD84\u2160",mark:"f\u2032",title:"\uBCC0\uD654\uB97C \uC77D\uB2E4.",description:"\uAC00\uAE4C\uC6CC\uC9C0\uB294 \uAC12, \uC21C\uAC04\uC758 \uAE30\uC6B8\uAE30, \uC313\uC774\uB294 \uC591\uC5D0\uC11C \uC9C8\uBB38\uC744 \uCC3E\uC2B5\uB2C8\uB2E4.",kind:"secant",color:"#bf4630",light:"#ffe3c6",hue:.055},geometry:{label:"\uAE30\uD558",mark:"\u2220",title:"\uACF5\uAC04\uC744 \uBCF4\uB2E4.",description:"\uAC70\uB9AC\uC640 \uBC29\uD5A5, \uD3C9\uBA74\uACFC \uC785\uCCB4 \uC0AC\uC774\uC5D0\uC11C \uBCF4\uC774\uC9C0 \uC54A\uB358 \uAD00\uACC4\uB97C \uBC1C\uACAC\uD569\uB2C8\uB2E4.",kind:"ellipsoid",color:"#4c5fd0",light:"#d5dcff",hue:.63},economics:{label:"\uACBD\uC81C\uC218\uD559",mark:"%",title:"\uC120\uD0DD\uC744 \uB530\uC9C0\uB2E4.",description:"\uC218\uC640 \uBAA8\uD615\uC73C\uB85C \uC77C\uC0C1\uC758 \uC120\uD0DD\uACFC \uADFC\uC0AC\uC758 \uC624\uCC28\uB97C \uC0B4\uD3B4\uBD05\uB2C8\uB2E4.",kind:"compound",color:"#12735d",light:"#c5efdf",hue:.43}},ki=n=>n.id.slice(0,4);function hu(n,t="all",e="all"){return n.filter(i=>(t==="all"||i.subjectKey===t)&&(e==="all"||ki(i)===e))}function gp(n,t=7){return Math.min(t-1,Math.max(0,Number.isFinite(n)?Math.trunc(n):0))}function _p(n,t){return Math.abs(n)>=70&&Math.abs(n)>Math.abs(t)*1.5?n<0?1:-1:0}function uu(n){try{let t=new URL(n?.url);return t.protocol==="https:"&&!t.username&&!t.password?t.href:null}catch{return null}}function ac(n,t=360){let e=String(n||"").trim();if(e.length<=t)return e;let i=e.lastIndexOf("\uB2E4.",t);return i<t*.55?i=t-1:i+=1,e.slice(0,i+1)+"\u2026"}function xp(n){let t=n.raw;return[{key:"question",label:"\uC9C8\uBB38",title:"\uBB34\uC5C7\uC774 \uAD81\uAE08\uD588\uC744\uAE4C.",intro:n.question,primary:t.hypothesis,fields:[["\uCC98\uC74C \uC138\uC6B4 \uC608\uC0C1",t.hypothesis]]},{key:"method",label:"\uBC29\uBC95",title:"\uC5B4\uB5BB\uAC8C \uC54C\uC544\uBCF4\uAE30\uB85C \uD588\uC744\uAE4C.",intro:"\uAC19\uAC8C \uB458 \uAC83\uACFC \uBC14\uAFC0 \uAC83. \uD559\uC0DD\uC774 \uC120\uD0DD\uD55C \uBC29\uBC95\uC744 \uC77D\uC2B5\uB2C8\uB2E4.",primary:t.plan||t.conditions,fields:[["\uD0D0\uAD6C \uACC4\uD68D",t.plan],["\uBC14\uAFC0 \uC870\uAC74\uACFC \uC790\uB8CC",t.conditions]]},{key:"process",label:"\uC218\uD589",title:"\uC5B4\uB5A4 \uC2DC\uB3C4\uB97C \uD588\uC744\uAE4C.",intro:"\uC544\uB798 \uB0B4\uC6A9\uC740 \uD559\uC0DD\uC774 \uC800\uC7A5\uD55C \uC218\uD589 \uAE30\uB85D\uC785\uB2C8\uB2E4.",primary:t.process,fields:[["\uC218\uD589 \uACFC\uC815",t.process]]},{key:"revision",label:"\uC218\uC815",title:"\uC0DD\uAC01\uC744 \uBC14\uAFBC \uC21C\uAC04.",intro:"\uB73B\uB300\uB85C \uB418\uC9C0 \uC54A\uC558\uB358 \uC7A5\uBA74\uACFC, \uADF8\uB2E4\uC74C\uC758 \uC120\uD0DD\uC744 \uC77D\uC2B5\uB2C8\uB2E4.",primary:t.revision,fields:[["\uC2E4\uD328\uC640 \uC218\uC815",t.revision]]},{key:"evidence",label:"\uADFC\uAC70",title:"\uBB34\uC5C7\uC744 \uADFC\uAC70\uB85C \uB0A8\uACBC\uC744\uAE4C.",intro:"\uACC4\uC0B0\uACFC \uAD00\uCC30, \uC2E4\uD589\uACFC \uD574\uC11D\uC744 \uD559\uC0DD\uC758 \uAE30\uB85D\uC5D0\uC11C \uD655\uC778\uD569\uB2C8\uB2E4.",primary:t.evidence,fields:[["\uACB0\uACFC\uC640 \uADFC\uAC70",t.evidence],["\uC218\uD559\uC801 \uD574\uC11D",t.interpretation]]},{key:"conclusion",label:"\uACB0\uB860",title:"\uC54C\uAC8C \uB41C \uAC83\uACFC, \uB0A8\uC740 \uAC83.",intro:"\uD558\uB098\uC758 \uACB0\uB860\uC774 \uB2E4\uC74C \uC9C8\uBB38\uC758 \uCD9C\uBC1C\uC810\uC774 \uB429\uB2C8\uB2E4.",primary:t.conclusion,fields:[["\uACB0\uB860",t.conclusion],["\uD55C\uACC4\uC640 \uC8FC\uC758\uD560 \uC810",t.limits],["\uC0C8\uB85C\uC6B4 \uC9C8\uBB38",t.next]]},{key:"artifact",label:"\uC791\uD488",title:"\uC774\uC81C, \uC791\uD488 \uC55E\uC73C\uB85C.",intro:"\uD559\uC0DD\uC774 \uB9CC\uB4E0 \uC6F9\uC571\uC744 \uC6D0\uB798 \uBAA8\uC2B5\uC73C\uB85C \uB9CC\uB0A9\uB2C8\uB2E4.",primary:"",fields:[]}]}var wn=document.getElementById("main"),vp=matchMedia("(prefers-reduced-motion: reduce)"),wt={data:null,subject:"all",student:"all",page:"",work:null,motion:!vp.matches,scenes:[],observers:[],listeners:[],slide:0},ae=n=>document.getElementById(n),Ce=n=>String(n??"").replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t]),du=n=>String(n||"").split(`
`).map(t=>"<span>"+Ce(t)+"</span>").join(""),Cr=n=>oi[n.subjectKey]?.label||n.subject,Sv=n=>[...new Set(n.map(Cr))].join(" \xB7 "),bv=n=>n.topicMismatch?"\uC8FC\uC81C \uC815\uB9AC \uC911":n.recordComplete||n.status==="\uCD5C\uC885 \uC81C\uCD9C"?"\uD0D0\uAD6C \uAE30\uB85D \uC644\uB8CC":"\uC791\uC131 \uC911",Tv=n=>String(n||"").split(/\n\s*\n/).filter(Boolean).map(t=>"<p>"+Ce(t).replace(/\n/g,"<br>")+"</p>").join(""),Ev=(n,t=360)=>n?'<div class="source-label">\uD559\uC0DD \uAE30\uB85D \xB7 \uBC1C\uCDCC</div><div class="student-excerpt">'+Tv(ac(n,t))+"</div>":'<p class="pending-text">\uC774 \uBD80\uBD84\uC740 \uC544\uC9C1 \uAE30\uB85D\uC744 \uAE30\uB2E4\uB9AC\uACE0 \uC788\uC2B5\uB2C8\uB2E4.</p>';function wv(n){let t=n.filter(([,e])=>e);return t.length?'<details class="source-details"><summary>\uC6D0\uBB38 \uC804\uCCB4 \uD3BC\uCCD0\uBCF4\uAE30 <span aria-hidden="true">\uFF0B</span></summary>'+t.map(([e,i])=>'<section class="original-field"><h4>'+Ce(e)+'</h4><div class="original-text">'+Ce(i)+"</div></section>").join("")+"</details>":""}function Yn(n,t,e,i){n.addEventListener(t,e,i),wt.listeners.push(()=>n.removeEventListener(t,e,i))}function Mp(){wt.listeners.forEach(n=>n()),wt.listeners=[],wt.scenes.forEach(n=>n.dispose()),wt.scenes=[],wt.observers.forEach(n=>n.disconnect()),wt.observers=[],wt.work=null}function Av(n,t,e="geometry"){if(!n)return null;try{let i=oi[e]||oi.geometry,s=new sc(n,t,{motion:wt.motion,primary:i.light,hue:i.hue});return wt.scenes.push(s),s}catch{return n.innerHTML=Ao(t),null}}function Sp(n){if(!wt.motion)return;let t=new IntersectionObserver(e=>e.forEach(({target:i,isIntersecting:s})=>{if(s){try{Hs(i,{opacity:[.3,1],translateY:[16,0],duration:500,ease:"out(3)"})}catch{}t.unobserve(i)}}),{threshold:.08});n.querySelectorAll(".reveal").forEach(e=>t.observe(e)),wt.observers.push(t)}function Co(){document.body.classList.toggle("reduced-motion",!wt.motion);let n=ae("motionButton");n.setAttribute("aria-pressed",String(!wt.motion)),n.lastElementChild.textContent=wt.motion?"\uBAA8\uC158 \uC904\uC774\uAE30":"\uBAA8\uC158 \uCF1C\uAE30",wt.scenes.forEach(e=>e.setMotion(wt.motion));let t=ae("replayScene");t&&(t.disabled=!wt.motion,t.innerHTML=wt.motion?'<span aria-hidden="true">\u21BB</span> \uC7A5\uBA74 \uB2E4\uC2DC \uBCF4\uAE30':"\uC6C0\uC9C1\uC784\uC744 \uC904\uC778 \uC0C1\uD0DC")}ae("motionButton").addEventListener("click",()=>{wt.motion=!wt.motion,Co()});vp.addEventListener("change",n=>{wt.motion=!n.matches,Co()});document.querySelector(".skip-link").addEventListener("click",n=>{n.preventDefault(),wn.focus({preventScroll:!0}),wn.scrollIntoView({behavior:"auto"})});function Cv(){wn.querySelectorAll("[data-math]").forEach(n=>{try{window.katex.render(n.dataset.math,n,{throwOnError:!0,strict:"ignore",trust:!1,output:"htmlAndMathml"})}catch{n.textContent=n.dataset.math}}),window.katex&&wn.querySelectorAll(".student-excerpt,.chapter-intro,.chapter-quote,.closing-note,.next-question").forEach(n=>{let t=document.createTreeWalker(n,NodeFilter.SHOW_TEXT),e=[],i;for(;i=t.nextNode();)e.push(i);for(let s of e){let r=/\\\(([\s\S]+?)\\\)|\\\[([\s\S]+?)\\\]|\$\$([^$]+?)\$\$|\$([^$\n]+?)\$/g,o=s.textContent,a=document.createDocumentFragment(),l,c=0,u=!1;for(;l=r.exec(o);){a.append(document.createTextNode(o.slice(c,l.index)));let d=document.createElement("span");try{window.katex.render(l[1]||l[2]||l[3]||l[4],d,{throwOnError:!0,strict:"ignore",trust:!1,output:"htmlAndMathml"}),a.append(d)}catch{a.append(document.createTextNode(l[0]))}c=r.lastIndex,u=!0}u&&(a.append(document.createTextNode(o.slice(c))),s.replaceWith(a))}})}function bp(n){document.body.dataset.subject=n,document.querySelectorAll("[data-nav-subject]").forEach(t=>{t.dataset.navSubject===n?t.setAttribute("aria-current","page"):t.removeAttribute("aria-current")})}function Rv(n,t){let e=oi[n],i=t.filter(s=>s.subjectKey===n).length;return'<a class="subject-room reveal" data-subject="'+n+'" href="#/collection?subject='+n+'"><div class="room-art">'+Ao(e.kind)+'<span class="room-mark" aria-hidden="true">'+e.mark+'</span></div><div class="room-copy"><div class="room-meta"><strong>'+e.label+"</strong><span>"+i+"\uAC1C\uC758 \uD0D0\uAD6C</span></div><h3>"+e.title+"</h3><p>"+e.description+'</p><span class="room-entry">\uC774 \uACFC\uBAA9 \uB458\uB7EC\uBCF4\uAE30 <b aria-hidden="true">\u2197</b></span></div></a>'}function Pv(n,t){return'<a class="work-card reveal" data-subject="'+n.subjectKey+'" href="#/work/'+n.id+'" aria-label="'+Ce(n.name+" \xB7 "+Cr(n)+" \xB7 "+n.title.replace(/\n/g," "))+'"><div class="card-art">'+Ao(n.kind,t)+'<span class="card-number">'+String(t+1).padStart(2,"0")+'</span></div><div class="card-copy"><div class="card-meta"><span class="subject-mark">'+oi[n.subjectKey].mark+"</span><span>"+Cr(n)+" \xB7 "+Ce(n.name)+"</span></div><h3>"+du(n.title)+"</h3><p>"+Ce(n.caption)+'</p><div class="card-bottom"><span>'+Ce(n.tags.slice(0,2).join(" \xB7 "))+'</span><b aria-hidden="true">\u2197</b></div></div></a>'}function lc(){let n=wt.data.works,t=hu(n,wt.subject,wt.student),e=hu(n,wt.subject),i=[...new Map(e.map(s=>[ki(s),s])).values()].sort((s,r)=>s.name.localeCompare(r.name,"ko"));ae("studentFilter").innerHTML='<option value="all">\uBAA8\uB4E0 \uD0D0\uAD6C\uC790</option>'+i.map(s=>'<option value="'+ki(s)+'">'+Ce(s.name)+"</option>").join(""),ae("studentFilter").value=wt.student,ae("workGrid").innerHTML=t.length?t.map(s=>Pv(s,n.indexOf(s))).join(""):'<p class="no-results">\uC774 \uC870\uAC74\uC5D0 \uB9DE\uB294 \uD0D0\uAD6C\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4. \uB2E4\uB978 \uACFC\uBAA9\uC774\uB098 \uD0D0\uAD6C\uC790\uB97C \uC120\uD0DD\uD574 \uC8FC\uC138\uC694.</p>',ae("collectionTitle").textContent=wt.subject==="all"?"\uC11C\uB85C \uB2E4\uB978 \uC9C8\uBB38\uC744 \uB9CC\uB098\uB2E4.":oi[wt.subject].label+"\uC758 \uC9C8\uBB38\uB4E4.",ae("resultCount").textContent=t.length+"\uAC1C\uC758 \uD0D0\uAD6C",document.querySelectorAll("[data-filter]").forEach(s=>s.setAttribute("aria-pressed",String(s.dataset.filter===wt.subject))),bp(wt.subject),Sp(ae("workGrid"))}function Iv(){Mp(),wt.page="home",document.body.classList.remove("work-page"),document.title="\uC9C8\uBB38\uC774 \uB0A8\uAE34 \uADA4\uC801 \xB7 \uC218\uD559 \uD0D0\uAD6C\uC804";let n=wt.data.works,t=[...new Map(n.map(e=>[ki(e),e])).values()].sort((e,i)=>e.name.localeCompare(i.name,"ko"));if(wn.innerHTML='<section class="hero" aria-labelledby="exhibitionTitle"><div class="hero-copy"><p class="eyebrow">2026 \uC218\uD559 \uD0D0\uAD6C\uC804</p><h1 id="exhibitionTitle"><span>\uD558\uB098\uC758 \uC9C8\uBB38\uC774</span><span>\uC790\uAE30\uB9CC\uC758 <em>\uBAA8\uC591</em>\uC744</span><span>\uAC16\uAE30\uAE4C\uC9C0.</span></h1><p class="hero-intro">'+t.length+"\uBA85\uC774 \uB0A8\uAE34 "+n.length+'\uAC1C\uC758 \uD0D0\uAD6C.<br>\uC815\uB2F5\uC5D0 \uB2FF\uAE30 \uC804\uC758 \uACE0\uBBFC\uACFC,<br>\uC0DD\uAC01\uC744 \uBC14\uAFBC \uC21C\uAC04\uC744 \uD568\uAED8 \uC77D\uC2B5\uB2C8\uB2E4.</p><a class="primary-link" href="#/subjects">\uC5B4\uB5A4 \uC9C8\uBB38\uBD80\uD130 \uB9CC\uB098 \uBCFC\uAE4C\uC694 <span aria-hidden="true">\u2193</span></a><div class="hero-meta"><span><b>'+t.length+"</b> \uD0D0\uAD6C\uC790</span><span><b>"+n.length+'</b> \uD0D0\uAD6C \uAE30\uB85D</span><span>\uC138 \uAC1C\uC758 \uACFC\uBAA9</span></div></div><div class="hero-art"><div id="heroScene" class="scene-host" role="img" aria-label="\uD3C9\uBA74\uACFC \uAD6C\uAC00 \uB9CC\uB098\uBA70 \uB2E8\uBA74\uC774 \uB2EC\uB77C\uC9C0\uB294 \uC804\uC2DC \uD574\uC124 \uB3C4\uD574"></div><span class="art-caption">\uAC19\uC740 \uB300\uC0C1\uB3C4, \uC9C8\uBB38\uC5D0 \uB530\uB77C \uB2E4\uB974\uAC8C \uBCF4\uC785\uB2C8\uB2E4.</span><span class="hero-orbit" aria-hidden="true">\uC9C8\uBB38 \xB7 \uC2DC\uB3C4 \xB7 \uC218\uC815 \xB7 \uBC1C\uACAC</span></div></section><section class="section-shell subjects-section" id="subjects" aria-labelledby="subjectsTitle"><div class="section-heading"><div><p class="eyebrow">\uACFC\uBAA9\uC73C\uB85C \uB4E4\uC5B4\uAC00\uAE30</p><h2 id="subjectsTitle">\uC11C\uB85C \uB2E4\uB978 \uAD00\uC810,<br>\uC774\uC5B4\uC9C0\uB294 \uD638\uAE30\uC2EC.</h2></div><p>\uBBF8\uC801\uBD84\uC740 \uBCC0\uD654\uB85C, \uAE30\uD558\uB294 \uACF5\uAC04\uC73C\uB85C,<br>\uACBD\uC81C\uC218\uD559\uC740 \uC120\uD0DD\uACFC \uBAA8\uD615\uC73C\uB85C \uC9C8\uBB38\uD569\uB2C8\uB2E4.</p></div><div class="subject-rooms">'+Object.keys(oi).map(e=>Rv(e,n)).join("")+'</div></section><section class="section-shell collection" id="collection" aria-labelledby="collectionTitle"><div class="section-heading"><div><p class="eyebrow">\uD0D0\uAD6C \uAE30\uB85D \uBAA8\uC544 \uBCF4\uAE30</p><h2 id="collectionTitle">\uC11C\uB85C \uB2E4\uB978 \uC9C8\uBB38\uC744 \uB9CC\uB098\uB2E4.</h2></div><p>\uC791\uD488\uC744 \uACE0\uB974\uBA74 \uC9C8\uBB38\uBD80\uD130 \uACB0\uB860\uAE4C\uC9C0<br>\uC77C\uACF1 \uC7A5\uC73C\uB85C \uB118\uACA8 \uC77D\uC744 \uC218 \uC788\uC2B5\uB2C8\uB2E4.</p></div><div class="filter-bar"><div class="subject-tabs" role="group" aria-label="\uACFC\uBAA9 \uC120\uD0DD"><button type="button" data-filter="all" aria-pressed="true">\uC804\uCCB4 <span>'+n.length+"</span></button>"+Object.entries(oi).map(([e,i])=>'<button type="button" data-filter="'+e+'" data-subject="'+e+'" aria-pressed="false"><span class="filter-mark" aria-hidden="true">'+i.mark+"</span>"+i.label+" <span>"+n.filter(s=>s.subjectKey===e).length+"</span></button>").join("")+'</div><label class="student-select" for="studentFilter"><span>\uD0D0\uAD6C\uC790</span><select id="studentFilter"></select></label></div><div class="collection-summary"><span id="resultCount" aria-live="polite"></span><p>\uD559\uC0DD\uC758 \uAE30\uB85D\uACFC \uC804\uC2DC \uD574\uC124\uC740 \uAD6C\uBD84\uD574 \uD45C\uC2DC\uD569\uB2C8\uB2E4.</p></div><div class="work-grid" id="workGrid"></div></section><section class="section-shell students-section" id="students" aria-labelledby="studentsTitle"><div class="section-heading"><div><p class="eyebrow">\uC9C8\uBB38\uC758 \uC8FC\uC778\uB4E4</p><h2 id="studentsTitle">\uD55C \uC0AC\uB78C\uC758 \uAD00\uC2EC\uC744<br>\uD568\uAED8 \uC77D\uC5B4 \uBCF4\uC138\uC694.</h2></div><p>\uC774\uB984\uC744 \uACE0\uB974\uBA74 \uADF8 \uD559\uC0DD\uC774 \uB0A8\uAE34<br>\uD0D0\uAD6C\uB4E4\uC744 \uD55C\uACF3\uC5D0\uC11C \uB9CC\uB0A0 \uC218 \uC788\uC2B5\uB2C8\uB2E4.</p></div><div class="student-list">'+t.map((e,i)=>'<a class="student-row" href="#/collection?student='+ki(e)+'"><span class="student-number">'+String(i+1).padStart(2,"0")+"</span><span><strong>"+Ce(e.name)+"</strong><small>"+Ce(Sv(n.filter(s=>ki(s)===ki(e))))+'</small></span><span class="student-arrow" aria-hidden="true">\u2197</span></a>').join("")+"</div></section>",Av(ae("heroScene"),"hero","geometry"),lc(),Co(),Sp(wn),wn.querySelectorAll("[data-filter]").forEach(e=>Yn(e,"click",()=>{wt.subject=e.dataset.filter,wt.student="all";let i="#/collection"+(wt.subject==="all"?"":"?subject="+wt.subject);location.hash===i?lc():location.hash=i})),Yn(ae("studentFilter"),"change",e=>{wt.student=e.target.value,lc()}),wt.motion)try{Ic({defaults:{duration:650,ease:"out(3)"}}).add(wn.querySelectorAll(".hero h1>span"),{opacity:[0,1],translateY:[20,0],delay:wi(85)},0).add(wn.querySelectorAll(".hero-intro,.hero-meta"),{opacity:[0,1],translateY:[10,0]},180)}catch{}}function Lv(n){let t=n.artifact.status,e=uu(n.artifact),i,s,r;return t==="linked"&&e?(i="\uC9C8\uBB38\uC744 \uC9C1\uC811 \uC6C0\uC9C1\uC5EC \uBCF4\uC138\uC694.",s="\uD559\uC0DD\uC774 \uC81C\uCD9C\uD55C \uC6F9\uC571\uC785\uB2C8\uB2E4. \uC55E\uC5D0\uC11C \uC77D\uC740 \uC870\uAC74\uC744 \uBC14\uAFB8\uBA70 \uAE30\uB85D \uC18D \uC124\uBA85\uACFC \uD654\uBA74\uC758 \uACB0\uACFC\uB97C \uD568\uAED8 \uC0B4\uD3B4\uBCF4\uC138\uC694.",r='<a class="button-solid" href="'+Ce(e)+'" target="_blank" rel="noopener noreferrer">\uD559\uC0DD \uC6F9\uC571 \uC5F4\uAE30 <span aria-hidden="true">\u2197</span></a><button class="button-line" id="embedButton" type="button">\uC804\uC2DC \uC548\uC5D0\uC11C \uCCB4\uD5D8\uD558\uAE30</button>'):t==="unavailable"?(i="\uC791\uD488\uC758 \uC0C8 \uC8FC\uC18C\uB97C \uAE30\uB2E4\uB9BD\uB2C8\uB2E4.",s="\uD604\uC7AC \uC81C\uCD9C \uC8FC\uC18C\uC5D0 \uC5F0\uACB0\uB418\uC9C0 \uC54A\uC544 \uB2E4\uC2DC \uD655\uC778\uD558\uACE0 \uC788\uC2B5\uB2C8\uB2E4. \uD0D0\uAD6C \uAE30\uB85D\uC740 \uBA3C\uC800 \uC804\uC2DC\uD558\uACE0, \uC0C8 \uC8FC\uC18C\uB098 \uC6D0\uBCF8 \uD30C\uC77C\uC744 \uBC1B\uC73C\uBA74 \uCCB4\uD5D8\uC744 \uC5F0\uACB0\uD569\uB2C8\uB2E4.",r='<span class="artifact-status">\uC791\uD488 \uC8FC\uC18C \uD655\uC778 \uC911</span>'):t==="awaiting-file"?(i="\uC791\uD488\uC758 \uC6D0\uBCF8\uC744 \uBAA8\uC73C\uACE0 \uC788\uC2B5\uB2C8\uB2E4.",s="\uD604\uC7AC \uC81C\uCD9C \uC8FC\uC18C\uB294 \uD559\uC0DD \uAE30\uAE30 \uC548\uC758 \uD30C\uC77C\uC744 \uAC00\uB9AC\uD0B5\uB2C8\uB2E4. HTML \uC6D0\uBCF8\uC744 \uC5F0\uACB0\uD558\uBA74 \uC774 \uC790\uB9AC\uC5D0\uC11C \uC791\uD488\uC744 \uCCB4\uD5D8\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4.",r='<span class="artifact-status">\uC6D0\uBCF8 \uD30C\uC77C \uC218\uD569 \uC911</span>'):(i="\uC774 \uC790\uB9AC\uC5D0\uC11C \uC791\uD488\uC744 \uB9CC\uB098\uAC8C \uB429\uB2C8\uB2E4.",s="\uD0D0\uAD6C \uAE30\uB85D\uC744 \uBA3C\uC800 \uC804\uC2DC\uD588\uC2B5\uB2C8\uB2E4. \uD559\uC0DD\uC774 \uB9CC\uB4E0 \uC6F9\uC571\uC774\uB098 \uC790\uB8CC\uAC00 \uC900\uBE44\uB418\uBA74 \uC774 \uC790\uB9AC\uC5D0 \uC5F0\uACB0\uD569\uB2C8\uB2E4.",r='<span class="artifact-status">\uC6F9\uC571 \uC900\uBE44 \uC911</span>'),'<div class="artifact-card"><span class="artifact-symbol" aria-hidden="true">\u2197</span><h3>'+i+"</h3><p>"+s+'</p><div class="artifact-actions">'+r+"</div></div>"+(n.recordNote?'<div class="closing-note"><strong>\uD568\uAED8 \uC77D\uC5B4 \uC8FC\uC138\uC694</strong><p>'+Ce(n.recordNote)+"</p></div>":"")}function Dv(n,t,e){let i=n.key==="artifact"?Lv(e):Ev(n.primary,n.key==="conclusion"?300:360);return n.key==="revision"&&n.primary&&(i='<div class="source-label">\uD559\uC0DD\uC774 \uB0A8\uAE34 \uC2DC\uB3C4\uC640 \uC218\uC815 \xB7 \uBC1C\uCDCC</div><blockquote class="chapter-quote">'+Ce(ac(n.primary,310))+"</blockquote>"),n.key==="evidence"&&e.recordNote&&(i+='<div class="closing-note"><strong>\uAE30\uB85D\uC744 \uC77D\uB294 \uAD00\uC810</strong><p>'+Ce(e.recordNote)+"</p></div>"),n.key==="conclusion"&&(i+='<div class="closing-note"><strong>\uC804\uC2DC \uD574\uC124</strong><p>'+Ce(e.readingNote)+"</p></div>"+(e.raw.next?'<div class="next-question"><strong>\uC774\uC5B4 \uAC00\uACE0 \uC2F6\uC740 \uC9C8\uBB38</strong><p>'+Ce(ac(e.raw.next,170))+"</p></div>":"")),'<article class="deck-slide" role="tabpanel" id="slide-'+t+'" aria-labelledby="chapter-tab-'+t+'" tabindex="-1" '+(t?"hidden":"")+'><div class="chapter-number">'+String(t+1).padStart(2,"0")+" <span>/ 07</span></div><h2>"+n.title+'</h2><p class="chapter-intro">'+Ce(n.intro)+"</p>"+i+wv(n.fields)+"</article>"}function Nv(n){let t=rc(n);return'<aside class="deck-figure motion-theater" aria-label="\uD0D0\uAD6C \uACFC\uC815\uC5D0 \uB530\uB77C \uBC14\uB00C\uB294 \uC804\uC2DC \uD574\uC124"><div class="theater-topline"><span><i aria-hidden="true"></i> '+Ce(t.focus)+'</span><button class="scene-replay" id="replayScene" type="button"><span aria-hidden="true">\u21BB</span> \uC7A5\uBA74 \uB2E4\uC2DC \uBCF4\uAE30</button></div><div id="storyScene" class="motion-stage" role="img" aria-label="\uD0D0\uAD6C \uACFC\uC815\uC744 \uB530\uB77C \uBC14\uB00C\uB294 \uC804\uC2DC \uD574\uC124 \uB3C4\uD574"></div><div class="theater-bottomline"><p class="scene-live-caption"></p><span>\uD559\uC0DD\uC758 \uC2E4\uC81C \uAE30\uB85D\uC740 \uC544\uB798\uC5D0\uC11C \uC77D\uC2B5\uB2C8\uB2E4.</span></div></aside><div class="story-equation"><span>\uAD00\uACC4\uB97C \uC787\uB294 \uC2DD</span><div data-math="'+Ce(n.math)+'"></div><p>'+Ce(n.mathLabel)+"</p></div>"}function Uv(n){Mp(),wt.page="work",wt.work=n,wt.slide=-1,document.body.classList.add("work-page"),bp(n.subjectKey),document.title=n.title.replace(/\n/g," ")+" \xB7 "+n.name+" \xB7 \uC218\uD559 \uD0D0\uAD6C\uC804";let t=xp(n),e=wt.data.works.filter(d=>d.subjectKey===n.subjectKey),i=e[(e.indexOf(n)+1)%e.length],s="#/collection?subject="+n.subjectKey,r=e.length>1?"#/work/"+i.id:"#/subjects",o=e.length>1?"\uAC19\uC740 \uACFC\uBAA9\uC758 \uB2E4\uC74C \uC9C8\uBB38 \xB7 "+i.name:"\uB2E4\uB978 \uACFC\uBAA9\uC758 \uC9C8\uBB38\uB3C4 \uB9CC\uB098 \uBCF4\uC138\uC694",a=e.length>1?i.title:"\uB2E4\uC74C \uD638\uAE30\uC2EC\uC744 \uCC3E\uC544\uBCFC\uAE4C\uC694.";wn.innerHTML='<header class="work-heading"><a class="back-link" href="'+s+'">\u2190 '+Cr(n)+' \uD0D0\uAD6C\uB85C \uB3CC\uC544\uAC00\uAE30</a><div class="work-byline"><span class="subject-badge">'+oi[n.subjectKey].mark+" "+Cr(n)+"</span><strong>"+Ce(n.name)+"</strong><span>"+bv(n)+"</span></div><h1>"+du(n.title)+'</h1><p class="work-caption">'+Ce(n.caption)+'</p><div class="work-tags">'+n.tags.map(d=>"<span>"+Ce(d)+"</span>").join("")+'</div></header><section class="story-deck" id="storyDeck" aria-label="'+Ce(n.name)+'\uC758 \uD0D0\uAD6C \uC77C\uACF1 \uC7A5"><div class="deck-tab-list" id="deckTabs" role="tablist" aria-label="\uD0D0\uAD6C \uACFC\uC815">'+t.map((d,h)=>'<button id="chapter-tab-'+h+'" role="tab" aria-controls="slide-'+h+'" aria-selected="'+(h===0)+'" tabindex="'+(h===0?"0":"-1")+'" data-slide="'+h+'"><b>'+String(h+1).padStart(2,"0")+"</b>"+d.label+"</button>").join("")+'</div><div class="deck-reader" id="deckReader">'+Nv(n)+'<div class="deck-copy"><div class="reading-topline"><span>\uD559\uC0DD\uC774 \uB0A8\uAE34 \uD0D0\uAD6C \uAE30\uB85D</span><span>\uC6D0\uBB38\uC744 \uBC14\uD0D5\uC73C\uB85C \uC77D\uC2B5\uB2C8\uB2E4.</span></div>'+t.map((d,h)=>Dv(d,h,n)).join("")+'</div></div><section class="embedded-work" id="embeddedWork" aria-label="\uD559\uC0DD \uC6F9\uC571 \uC6D0\uBCF8" hidden><div class="embed-bar"><span>\uD559\uC0DD\uC774 \uB9CC\uB4E0 \uC6F9\uC571 \xB7 \uC6D0\uBCF8 \uD654\uBA74</span><button id="closeEmbed" type="button">\uCCB4\uD5D8 \uB2EB\uAE30 \u2191</button></div><div id="iframeMount"></div></section><div class="deck-controls"><button class="deck-previous" id="previousSlide" type="button"><span aria-hidden="true">\u2190</span> \uC774\uC804</button><div class="deck-position"><p id="slidePosition" aria-live="polite"></p><div class="deck-progress" aria-hidden="true"><span id="deckProgress"></span></div></div><button class="deck-next" id="nextSlide" type="button">\uB2E4\uC74C <span aria-hidden="true">\u2192</span></button></div><p class="deck-instruction">\uBC84\uD2BC\uC774\uB098 \u2190 \u2192 \uBC29\uD5A5\uD0A4\uB85C \uB118\uAE41\uB2C8\uB2E4. \uBAA8\uBC14\uC77C\uC5D0\uC11C\uB294 \uAE00 \uC601\uC5ED\uC744 \uC88C\uC6B0\uB85C \uBC00\uC5B4 \uBCF4\uC138\uC694.</p></section><section class="work-epilogue"><p>\uD559\uC0DD\uC774 \uC800\uC7A5\uD55C \uC6D0\uBB38\uC744 \uBC14\uD0D5\uC73C\uB85C \uAD6C\uC131\uD588\uC2B5\uB2C8\uB2E4.<br>\uC804\uC2DC \uB3C4\uD574\uB294 \uD559\uC0DD \uC791\uD488\uACFC \uAD6C\uBD84\uD55C \uD574\uC124\uC774\uBA70, \uC6F9\uC571 \uC900\uBE44 \uC0C1\uD0DC\uB294 \uB9C8\uC9C0\uB9C9 \uC7A5\uC5D0\uC11C \uD655\uC778\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4.</p><span>\uAE30\uB85D \uC218\uC815 \xB7 '+Ce(n.updated)+'</span></section><a class="next-work" href="'+r+'"><div><span>'+Ce(o)+"</span><h2>"+du(a)+'</h2></div><b aria-hidden="true">\u2197</b></a>';let l=new oc(ae("storyScene"),n,{motion:wt.motion});wt.scenes.push(l),Cv(),Co(),Yn(ae("replayScene"),"click",()=>l.replay());let c=(d,{focus:h=!1}={})=>{let f=gp(d,t.length);if(f===wt.slide)return;let m=wt.slide;wt.slide=f,wn.querySelectorAll(".deck-slide").forEach((p,S)=>{p.hidden=S!==f}),wn.querySelectorAll("[data-slide]").forEach((p,S)=>{p.setAttribute("aria-selected",String(S===f)),p.tabIndex=S===f?0:-1}),ae("previousSlide").disabled=f===0,ae("nextSlide").disabled=f===t.length-1,ae("slidePosition").textContent=String(f+1).padStart(2,"0")+" / 07 \xB7 "+t[f].label,ae("deckProgress").style.width=(f+1)/t.length*100+"%",l.setPhase(f),ae("storyDeck").dataset.phase=String(f),ae("embeddedWork").hidden=f!==6||!ae("iframeMount").firstChild;let x=ae("chapter-tab-"+f),g=ae("deckTabs");if(g.scrollTo({left:x.offsetLeft-g.clientWidth/2+x.clientWidth/2,behavior:wt.motion?"smooth":"auto"}),h&&x.focus({preventScroll:!0}),m>=0){let p=ae("slide-"+f);if(wt.motion)try{Hs(p,{opacity:[.5,1],translateY:[16,0],duration:500,ease:"out(3)"})}catch{}ae("storyDeck").getBoundingClientRect().top<70&&ae("storyDeck").scrollIntoView({block:"start",behavior:wt.motion?"smooth":"auto"})}};wn.querySelectorAll("[data-slide]").forEach(d=>Yn(d,"click",()=>c(Number(d.dataset.slide)))),Yn(ae("previousSlide"),"click",()=>c(wt.slide-1)),Yn(ae("nextSlide"),"click",()=>c(wt.slide+1)),Yn(document,"keydown",d=>{if(d.altKey||d.ctrlKey||d.metaKey||d.target.closest?.("input,textarea,select,[contenteditable],iframe"))return;let h=d.key==="ArrowRight"?1:d.key==="ArrowLeft"?-1:0;h&&(d.preventDefault(),c(wt.slide+h,{focus:!!d.target.closest?.('[role="tablist"]')}))});let u=null;Yn(ae("deckReader"),"touchstart",d=>{let h=d.touches[0];u=h&&h.clientX>24&&h.clientX<innerWidth-24&&!d.target.closest("canvas,svg,.deck-figure,button,a,summary,details,input,iframe")?{x:h.clientX,y:h.clientY}:null},{passive:!0}),Yn(ae("deckReader"),"touchend",d=>{if(!u)return;let h=d.changedTouches[0],f=_p(h.clientX-u.x,h.clientY-u.y);u=null,f&&c(wt.slide+f)},{passive:!0}),Yn(ae("deckReader"),"touchcancel",()=>{u=null},{passive:!0}),ae("embedButton")&&Yn(ae("embedButton"),"click",()=>{let d=ae("iframeMount");if(!d.firstChild){let h=document.createElement("iframe");h.title=n.name+"\uC758 "+Cr(n)+" \uC6F9\uC571",h.setAttribute("sandbox","allow-scripts allow-same-origin allow-forms"),h.referrerPolicy="no-referrer",h.src=uu(n.artifact),d.append(h)}ae("embeddedWork").hidden=!1,ae("embeddedWork").scrollIntoView({block:"start",behavior:wt.motion?"smooth":"auto"})}),Yn(ae("closeEmbed"),"click",()=>{ae("iframeMount").replaceChildren(),ae("embeddedWork").hidden=!0,ae("embedButton")?.focus()}),c(0)}function yp(){let[n,t]=(location.hash.slice(1)||"/").split("?"),e=new URLSearchParams(t||"");if(n.startsWith("/work/")){let i=wt.data.works.find(s=>s.id===n.slice(6));if(i){Uv(i),scrollTo({top:0,behavior:"auto"});return}}if(n==="/collection"){let i=e.get("subject");wt.subject=oi[i]?i:"all",wt.student=e.get("student")||"all"}n==="/"&&(wt.subject="all",wt.student="all"),wt.page!=="home"||n==="/"?Iv():lc(),["/collection","/subjects","/students"].includes(n)?requestAnimationFrame(()=>ae(n.slice(1))?.scrollIntoView({block:"start",behavior:wt.motion?"smooth":"auto"})):scrollTo({top:0,behavior:"auto"})}async function Fv(){Co();let n,t=["localhost","127.0.0.1","[::1]"].includes(location.hostname);try{let e=await fetch(t?"/api/exhibits":"data/exhibits.json",{cache:"no-store",credentials:"same-origin"});if(!e.ok)throw Error("\uC804\uC2DC \uC5F0\uACB0 \uC911");n=await e.json()}catch{try{n=await(await fetch("data/exhibits.json",{cache:"no-store"})).json()}catch{n={works:[]}}}if(!n.works?.length){wn.innerHTML='<section class="loading-surface"><p class="eyebrow">2026 \uC218\uD559 \uD0D0\uAD6C\uC804</p><h1>\uC9C8\uBB38\uC774 \uB0A8\uAE34 \uADA4\uC801.</h1><p>\uC804\uC2DC \uC790\uB8CC\uB97C \uC5F0\uACB0\uD558\uACE0 \uC788\uC2B5\uB2C8\uB2E4. \uC7A0\uC2DC \uD6C4 \uB2E4\uC2DC \uC5F4\uC5B4 \uC8FC\uC138\uC694.</p></section>';return}wt.data=n,ae("previewLabel").textContent=n.privatePreview?"\uAD50\uC0AC\uC6A9 \uBBF8\uB9AC\uBCF4\uAE30 \xB7 "+n.asOf:"2026 \uC218\uD559 \uD0D0\uAD6C\uC804 \xB7 "+new Set(n.works.map(ki)).size+"\uBA85\uC758 \uC9C8\uBB38",window.addEventListener("hashchange",yp),yp()}Fv();})();
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
