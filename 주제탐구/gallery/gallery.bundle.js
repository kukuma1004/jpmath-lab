(()=>{var An=typeof window<"u",mo=An?window:null,Ci=An?document:null,me={OBJECT:0,ATTRIBUTE:1,CSS:2,TRANSFORM:3,CSS_VAR:4},jt={NUMBER:0,UNIT:1,COLOR:2,COMPLEX:3},Ue={NONE:0,AUTO:1,FORCE:2},Ce={replace:0,none:1,blend:2},Zl=Symbol(),Zn=Symbol(),go=Symbol(),Ri=Symbol(),ru=Symbol(),Kt=1e-11,fr=1e12,Jn=1e3,pr=240,Cn="",ou="var(",mr=[],_o=(()=>{let n=new Map;return n.set("x","translateX"),n.set("y","translateY"),n.set("z","translateZ"),n})(),ys=["perspective","translateX","translateY","translateZ","rotate","rotateX","rotateY","rotateZ","scale","scaleX","scaleY","scaleZ","skew","skewX","skewY"],au=ys.reduce((n,t)=>({...n,[t]:t+"("}),{}),$e=()=>{},lu=n=>n,cu=/\)\s*[-.\d]/,hu=/(^#([\da-f]{3}){1,2}$)|(^#([\da-f]{4}){1,2}$)/i,uu=/rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/i,du=/rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*(-?\d+|-?\d*.\d+)\s*\)/i,fu=/hsl\(\s*(-?\d+|-?\d*.\d+)\s*,\s*(-?\d+|-?\d*.\d+)%\s*,\s*(-?\d+|-?\d*.\d+)%\s*\)/i,pu=/hsla\(\s*(-?\d+|-?\d*.\d+)\s*,\s*(-?\d+|-?\d*.\d+)%\s*,\s*(-?\d+|-?\d*.\d+)%\s*,\s*(-?\d+|-?\d*.\d+)\s*\)/i,Jl=/[-+]?\d*\.?\d+(?:e[-+]?\d)?/gi,xo=/^([-+]?\d*\.?\d+(?:e[-+]?\d+)?)([a-z]+|%)$/i,mu=/([a-z])([A-Z])/g,gu=/(\*=|\+=|-=)/,_u=/var\(\s*(--[\w-]+)(?:\s*,\s*([^)]+))?\s*\)/;var vs={id:null,keyframes:null,playbackEase:null,playbackRate:1,frameRate:pr,loop:0,reversed:!1,alternate:!1,autoplay:!0,persist:!1,duration:Jn,delay:0,loopDelay:0,ease:"out(2)",composition:Ce.replace,modifier:lu,onBegin:$e,onBeforeUpdate:$e,onUpdate:$e,onLoop:$e,onPause:$e,onComplete:$e,onRender:$e},gr={current:null,root:Ci},re={defaults:vs,precision:4,timeScale:1,tickThreshold:200,editor:null},$l={version:"4.5.0",engine:null};An&&(mo.AnimeJS||(mo.AnimeJS=[]),mo.AnimeJS.push($l));var Kl=n=>n.replace(mu,"$1-$2").toLowerCase(),gn=(n,t)=>n.indexOf(t)===0,ai=Date.now,Rn=Array.isArray,ji=n=>n&&n.constructor===Object,rn=n=>typeof n=="number"&&!isNaN(n),on=n=>typeof n=="string",Ke=n=>typeof n=="function",Ot=n=>typeof n>"u",$n=n=>Ot(n)||n===null,yo=n=>An&&n instanceof SVGElement,jl=n=>hu.test(n),Ql=n=>gn(n,"rgb"),tc=n=>gn(n,"hsl"),yu=n=>jl(n)||(Ql(n)||tc(n))&&(n[n.length-1]===")"||!cu.test(n)),_r=n=>!re.defaults.hasOwnProperty(n),op=["opacity","rotate","overflow","color"],vu=(n,t)=>{if(op.includes(t))return!1;if(n.getAttribute(t)||t in n){if(t==="scale"){let e=n.parentNode;return e&&e.tagName==="filter"}return!0}},vo=n=>on(n)?parseFloat(n):n,Qi=Math.pow,xr=Math.sqrt,Mu=Math.sin,Su=Math.cos,yr=Math.abs;var ts=Math.floor,bu=Math.asin;var vr=Math.PI,xu=Math.round,an=(n,t,e)=>n<t?t:n>e?e:n,de=(n,t)=>{if(t<0)return n;if(!t)return xu(n);let e=10**t;return xu(n*e)/e};var Ms=(n,t,e)=>e===1?t:e===0?n:n+(t-n)*e,es=n=>n===1/0?fr:n===-1/0?-fr:n,li=n=>n<=Kt?Kt:es(de(n,11)),Le=n=>Rn(n)?[...n]:n,Mo=(n,t)=>{let e={...n};for(let i in t){let s=n[i];e[i]=Ot(s)?t[i]:s}return e},fe=(n,t,e,i="_prev",s="_next")=>{let r=n._head,o=s;for(e&&(r=n._tail,o=i);r;){let a=r[o];t(r),r=a}},ci=(n,t,e="_prev",i="_next")=>{let s=t[e],r=t[i];s?s[i]=r:n._head=r,r?r[e]=s:n._tail=s,t[e]=null,t[i]=null},Un=(n,t,e,i="_prev",s="_next")=>{let r=n._tail;for(;r&&e&&e(r,t);)r=r[i];let o=r?r[s]:n._head;r?r[s]=t:n._head=t,o?o[i]=t:n._tail=t,t[i]=r,t[s]=o};var Tu=(n,t,e)=>{let i=n.style.transform;if(i){let s=n[Ri],r=0,o=i.length,a;for(;r<o;){for(;r<o&&i.charCodeAt(r)===32;)r++;if(r>=o)break;let l=r;for(;r<o&&i.charCodeAt(r)!==40;)r++;if(r>=o)break;let u=i.substring(l,r),f=1,h=r+1,d=-1,m=-1;for(r++;r<o&&f>0;){let g=i.charCodeAt(r);g===40?f++:g===41?f--:g===44&&f===1&&(d===-1?d=r:m===-1&&(m=r)),r++}let x=r-1;u==="translate"||u==="translate3d"?(d===-1?s.translateX=i.substring(h,x).trim():(s.translateX=i.substring(h,d).trim(),m===-1?s.translateY=i.substring(d+1,x).trim():(s.translateY=i.substring(d+1,m).trim(),s.translateZ=i.substring(m+1,x).trim())),a=i.substring(h,x)):u==="scale"||u==="scale3d"?d===-1?s.scale=i.substring(h,x).trim():(s.scaleX=i.substring(h,d).trim(),m===-1?s.scaleY=i.substring(d+1,x).trim():(s.scaleY=i.substring(d+1,m).trim(),s.scaleZ=i.substring(m+1,x).trim())):s[u]=i.substring(h,x)}if(t==="translate3d"&&a)return e&&(e[t]=a),a;let c=s[t];if(!Ot(c))return e&&(e[t]=c),c}return t==="translate3d"?"0px, 0px, 0px":t==="rotate3d"?"0, 0, 0, 0deg":gn(t,"scale")?"1":gn(t,"rotate")||gn(t,"skew")?"0deg":"0px"},So=n=>{let t=Cn;for(let e=0,i=ys.length;e<i;e++){let s=ys[e],r=n[s];if(r!==void 0){if(s==="translateX"){let o=n.translateY;if(o!==void 0){let a=n.translateZ;a!==void 0?(t+=`translate3d(${r},${o},${a}) `,e+=2):(t+=`translate(${r},${o}) `,e+=1);continue}}if(s==="scaleX"&&n.scale===void 0){let o=n.scaleY;if(o!==void 0){let a=n.scaleZ;a!==void 0?(t+=`scale3d(${r},${o},${a}) `,e+=2):(t+=`scale(${r},${o}) `,e+=1);continue}}t+=`${au[s]}${r}) `}s==="rotateZ"&&n.rotate3d!==void 0&&(t+=`rotate3d(${n.rotate3d}) `)}return n.matrix!==void 0&&(t+=`matrix(${n.matrix}) `),n.matrix3d!==void 0&&(t+=`matrix3d(${n.matrix3d}) `),t};var ec=[];function bo(n,t){if(!n)return null;let e=ec.length;t:for(let i=0;i<e;i++){let s=ec[i];if(s.detect&&!s.detect(n))continue;let r=s.targetAdapters;for(let o=0,a=r.length;o<a;o++){let c=r[o];if(c.detect(n)){let l=c.props[t];if(l&&(!l.gate||l.gate(n)))return l;break t}}}for(let i=0;i<e;i++){let s=ec[i];if(s.detect&&!s.detect(n))continue;let r=s.propertyResolvers;for(let o=0,a=r.length;o<a;o++){let c=r[o](n,t);if(c)return c}}return null}var ap=n=>{let t=uu.exec(n)||du.exec(n),e=Ot(t[4])?1:+t[4];return[+t[1],+t[2],+t[3],e]},lp=n=>{let t=n.length,e=t===4||t===5;return[+("0x"+n[1]+n[e?1:2]),+("0x"+n[e?2:3]+n[e?2:4]),+("0x"+n[e?3:5]+n[e?3:6]),t===5||t===9?+(+("0x"+n[e?4:7]+n[e?4:8])/255).toFixed(3):1]},nc=(n,t,e)=>(e<0&&(e+=1),e>1&&(e-=1),e<1/6?n+(t-n)*6*e:e<1/2?t:e<2/3?n+(t-n)*(2/3-e)*6:n),cp=n=>{let t=fu.exec(n)||pu.exec(n),e=+t[1]/360,i=+t[2]/100,s=+t[3]/100,r=Ot(t[4])?1:+t[4],o,a,c;if(i===0)o=a=c=s;else{let l=s<.5?s*(1+i):s+i-s*i,u=2*s-l;o=de(nc(u,l,e+1/3)*255,0),a=de(nc(u,l,e)*255,0),c=de(nc(u,l,e-1/3)*255,0)}return[o,a,c,r]},Eu=n=>Ql(n)?ap(n):jl(n)?lp(n):tc(n)?cp(n):[0,0,0,1];var Re=(n,t)=>Ot(n)?t:n,wu=(n,t)=>{let e=n.match(_u),i=t[Zn]?t:document.documentElement,s=getComputedStyle(i)?.getPropertyValue(e[1]);return(!s||s.trim()===Cn)&&e[2]&&(s=e[2].trim()),s||0},Kn=(n,t,e,i,s,r)=>{if(Ke(n)){if(!s){let a=n(t,e,i,r);return isNaN(+a)?a||0:+a}let o=()=>{let a=n(t,e,i,r);return isNaN(+a)?a||0:+a};return s.func=o,o()}if(on(n)&&gn(n,ou)){if(!s)return wu(n,t);let o=()=>wu(n,t);return s.func=o,o()}return n},ic=(n,t)=>n[Zn]?n[go]&&vu(n,t)?me.ATTRIBUTE:ys.includes(t)||_o.get(t)?me.TRANSFORM:gn(t,"--")?me.CSS_VAR:t in n.style?me.CSS:t in n?me.OBJECT:me.ATTRIBUTE:me.OBJECT,Au=(n,t,e)=>{let i=n.style[t];i&&e&&(e[t]=i);let s=i||getComputedStyle(n[ru]||n).getPropertyValue(t);return s==="auto"?"0":s},Pi=(n,t,e,i)=>{let s=Ot(e)?ic(n,t):e,r=bo(n,t);if(r){let o=r.get(n);return o&&i&&(i[t]=o),o??0}if(s===me.OBJECT){let o=n[t];return o&&i&&(i[t]=o),o||0}if(s===me.ATTRIBUTE){let o=n.getAttribute(t);return o&&i&&(i[t]=o),o}return s===me.TRANSFORM?Tu(n,t,i):s===me.CSS_VAR?Au(n,t,i).trimStart():Au(n,t,i)},Ss=(n,t,e)=>e==="-"?n-t:e==="+"?n+t:n*t,To=()=>({t:jt.NUMBER,n:0,u:null,o:null,d:null,s:null}),ln=(n,t)=>{if(t.t=jt.NUMBER,t.n=0,t.u=null,t.o=null,t.d=null,t.s=null,!n)return t;let e=+n;if(!isNaN(e))return t.n=e,t;let i=n;i[1]==="="&&(t.o=i[0],i=i.slice(2));let s=i.includes(" ")?!1:xo.exec(i);if(s)return t.t=jt.UNIT,t.n=+s[1],t.u=s[2],t;if(t.o)return t.n=+i,t;if(yu(i))return t.t=jt.COLOR,t.d=Eu(i),t;{let r=i.match(Jl);return t.t=jt.COMPLEX,t.d=r?r.map(Number):[],t.s=i.split(Jl)||[],t}},sc=(n,t)=>(t.t=n._valueType,t.n=n._toNumber,t.u=n._unit,t.o=null,t.d=Le(n._toNumbers),t.s=Le(n._strings),t),_n=To(),Eo=(n,t,e)=>{let i=n._modifier,s=n._fromNumbers,r=n._toNumbers,o=n._strings,a=o[0];for(let c=0,l=r.length;c<l;c++){let u=i(de(Ms(s[c],r[c],t),e)),f=o[c+1];a+=`${f?u+f:u}`,n._numbers[c]=u}return a};var Mr=(n,t,e,i,s)=>{let r=n.parent,o=n.duration,a=n.completed,c=n.iterationDuration,l=n.iterationCount,u=n._currentIteration,f=n._loopDelay,h=n._reversed,d=n._alternate,m=n._hasChildren,x=n._delay,g=n._currentTime,p=x+c,S=t-x,A=an(g,-x,o),M=an(S,-x,o),T=S-g,b=M>0,C=M>=o,y=o<=Kt,w=s===Ue.FORCE,P=0,F=S,B=0;if(l>1){let J=c+(C?0:f),et=~~(M/J);n._currentIteration=an(et,0,l),C&&n._currentIteration--,P=n._currentIteration%2,F=M-et*J||0}let V=h^(d&&P),I=n._ease,k=C?V?0:o:V?c-F:F;I&&(k=c*I(k/c)||0);let W=(r?r.backwards:S<g)?!V:!!V;if(n._currentTime=S,n._iterationTime=k,n.backwards=W,b&&!n.began?(n.began=!0,!e&&!(r&&(W||!r.began))&&n.onBegin(n)):S<=0&&(n.began=!1),!e&&!m&&b&&n._currentIteration!==u&&n.onLoop(n),w||s===Ue.AUTO&&(t>=(r&&x>0?0:x)&&t<=p||t<=x&&A>x||t>=p&&A!==o)||k>=p&&A!==o||k<=x&&A>0&&!C||t<=A&&A===o&&a||C&&!a&&y){if(b&&(n.computeDeltaTime(A),e||n.onBeforeUpdate(n)),!m){let J=w||(W?T*-1:T)>=re.tickThreshold,et=de(n._offset+(r?r._offset:0)+x+k,12),U=n._head,q,j,xt,Mt,le=0;for(;U;){let Vt=U._composition,St=U._currentTime,Y=U._changeDuration,K=U._absoluteStartTime+U._changeDuration,it=U._nextRep,wt=U._prevRep,ot=Vt!==Ce.none,ut=wt?wt._absoluteStartTime+wt._changeDuration:0,Ht=wt&&wt.parent!==U.parent,Nt=!it||it._isOverridden?K:it.parent===U.parent?K+it._delay:it._absoluteStartTime<it._absoluteUpdateStartTime?it._absoluteStartTime:it._absoluteUpdateStartTime;if((J||(St!==Y||et<=Nt||wt&&!Ht&&(!it||it.parent!==U.parent))&&(St!==0||et>=U._absoluteStartTime||Ht&&!U._hasFromValue&&!wt._isOverridden&&et>=ut||it&&!it._isOverridden&&it.parent===U.parent&&it._currentTime!==0&&k<it._startTime))&&(!wt||Ht||k>=U._startTime)&&(!ot||!U._isOverridden&&(!U._isOverlapped||et<=K)&&(!it||it._isOverridden||et<=Nt)&&(!wt||wt._isOverridden||(Ht?et>=U._absoluteStartTime||!U._hasFromValue&&et>=ut:et>=ut+U._delay)))){let zt=U._currentTime=an(k-U._startTime,0,Y),Ut=U._ease(zt/U._updateDuration),Rt=U._modifier,Jt=U._valueType,se=U._tweenType,_e=se===me.OBJECT,Yt=Jt===jt.NUMBER,ee=Yt&&_e||Ut===0||Ut===1?-1:re.precision,R,$t;if(Yt)R=$t=Rt(de(Ms(U._fromNumber,U._toNumber,Ut),ee));else if(Jt===jt.UNIT)$t=Rt(de(Ms(U._fromNumber,U._toNumber,Ut),ee)),R=`${$t}${U._unit}`;else if(Jt===jt.COLOR){let At=U._numbers,E=U._fromNumbers,_=U._toNumbers,O=1-Ut,z=E[0],Z=E[1],st=E[2],rt=_[0],$=_[1],Q=_[2];At[0]=Rt(Math.sqrt(z*z*O+rt*rt*Ut)),At[1]=Rt(Math.sqrt(Z*Z*O+$*$*Ut)),At[2]=Rt(Math.sqrt(st*st*O+Q*Q*Ut)),At[3]=Rt(Ms(E[3],_[3],Ut)),(!U._setter||i)&&(R=`rgba(${de(At[0],0)},${de(At[1],0)},${de(At[2],0)},${At[3]})`)}else Jt===jt.COMPLEX&&(R=Eo(U,Ut,ee));if(ot&&(U._number=$t),!i&&Vt!==Ce.blend){let At=U.property;q=U.target,U._setter?U._setter(q,$t,U):_e?q[At]=R:se===me.ATTRIBUTE?q.setAttribute(At,R):(j=q.style,se===me.TRANSFORM?(q!==xt&&(xt=q,Mt=q[Ri]),Mt[At]=R,le=1):se===me.CSS?j[At]=R:se===me.CSS_VAR&&j.setProperty(At,R)),b&&(B=1)}else U._value=R}else St&&wt&&!Ht&&k<U._startTime&&(U._currentTime=0);le&&U._renderTransforms&&(j.transform=So(Mt),le=0),U=U._next}!e&&B&&n.onRender(n)}!e&&b&&n.onUpdate(n)}return r&&y?!e&&(r.began&&!W&&S>0&&!a||W&&S<=Kt&&a)&&(n.onComplete(n),n.completed=!W):b&&C?l===1/0?n._startTime+=n.duration:n._currentIteration>=l-1&&(n.paused=!0,!a&&!m&&(n.completed=!0,!e&&!(r&&(W||!r.began))&&(n.onComplete(n),n._resolve(n)))):n.completed=!1,B},jn=(n,t,e,i,s)=>{let r=n._currentIteration;if(Mr(n,t,e,i,s),n._hasChildren){let o=n,a=o.backwards,c=i?t:o._iterationTime,l=ai(),u=0,f=!0;if(!i&&o._currentIteration!==r){let h=o.iterationDuration;fe(o,d=>{if(!a)!d.completed&&!d.backwards&&d._currentTime<d.iterationDuration&&Mr(d,h,e,1,Ue.FORCE),d.began=!1,d.completed=!1;else{let m=d.duration,x=d._offset+d._delay,g=x+m;!e&&m<=Kt&&(!x||g===h)&&d.onComplete(d)}}),e||o.onLoop(o)}fe(o,h=>{let d=de((c-h._offset)*h._speed,12);if(a&&d>h._delay+h.duration)return;let m=h._fps<o._fps?h.requestTick(l):s;u+=Mr(h,d,e,i,m),!h.completed&&f&&(f=!1)},a),!e&&u&&o.onRender(o),(f||a)&&o._currentTime>=o.duration&&(o.paused=!0,o.completed||(o.completed=!0,e||(o.onComplete(o),o._resolve(o))))}};var Cu={},wo=(n,t,e)=>{if(e===me.TRANSFORM){let i=_o.get(n);return i||n}else if(e===me.CSS||e===me.ATTRIBUTE&&yo(t)&&n in t.style){let i=Cu[n];if(i)return i;{let s=n&&Kl(n);return Cu[n]=s,s}}else return n},Sr=(n,t=!1)=>{if(n._hasChildren)fe(n,e=>Sr(e,t),!0);else{let e=n;e.pause(),fe(e,i=>{let s=i.property,r=i.target,o=i._tweenType,a=i._inlineValue,c=$n(a)||a===Cn;if(i._setter){if(!t&&!c){if(ln(a,_n),_n.d){let l=_n.d,u=i._numbers;for(let f=0,h=l.length;f<h;f++)u[f]=l[f]}else i._number=_n.n;i._setter(i.target,i._number,i)}}else if(o===me.OBJECT)!t&&!c&&(r[s]=a);else if(r[Zn])if(o===me.ATTRIBUTE)t||(c?r.removeAttribute(s):r.setAttribute(s,a));else{let l=r.style;if(o===me.TRANSFORM){let u=r[Ri];c?delete u[s]:u[s]=a,i._renderTransforms&&(Object.keys(u).length?l.transform=So(u):l.removeProperty("transform"))}else c?l.removeProperty(Kl(s)):l[s]=a}r[Zn]&&e._tail===i&&e.targets.forEach(l=>{l.getAttribute&&l.getAttribute("style")===Cn&&l.removeAttribute("style")})})}return n};var bs=class{constructor(t=0){this.deltaTime=0,this._currentTime=t,this._lastTickTime=t,this._startTime=t,this._lastTime=t,this._frameDuration=Jn/pr,this._fps=pr,this._speed=1,this._hasChildren=!1,this._head=null,this._tail=null}get fps(){return this._fps}set fps(t){let e=+t,i=e<Kt?Kt:e,s=Jn/i;i>vs.frameRate&&(vs.frameRate=i),this._fps=i,this._frameDuration=s}get speed(){return this._speed}set speed(t){let e=+t;this._speed=e<Kt?Kt:e}requestTick(t){let e=this._frameDuration,i=t-this._lastTickTime,s=e*.25,r=s<4?s:4;return i+r<e?Ue.NONE:(this._lastTickTime=i>=e?t-i%e:t,Ue.AUTO)}computeDeltaTime(t){let e=t-this._lastTime;return this.deltaTime=e,this._lastTime=t,e}};var hi={animation:null,update:$e},Ru=n=>{let t=hi.animation;return t||(t={duration:Kt,computeDeltaTime:$e,_offset:0,_delay:0,_head:null,_tail:null},hi.animation=t,hi.update=()=>{n.forEach(e=>{for(let i in e){let s=e[i],r=s._head;if(r){let o=r._valueType,a=o===jt.COMPLEX||o===jt.COLOR?Le(r._fromNumbers):null,c=r._fromNumber,l=s._tail;for(;l&&l!==r;){if(a)for(let u=0,f=l._numbers.length;u<f;u++)a[u]+=l._numbers[u];else c+=l._number;l=l._prevAdd}r._toNumber=c,r._toNumbers=a}}}),Mr(t,1,1,0,Ue.FORCE)}),t};var Pu=An?requestAnimationFrame:setImmediate,hp=An?cancelAnimationFrame:clearImmediate,rc=class extends bs{constructor(t){super(t),this.useDefaultMainLoop=!0,this.pauseOnDocumentHidden=!0,this.defaults=vs,this.paused=!0,this.reqId=0}update(){let t=this._currentTime=ai();if(this.requestTick(t)){this.computeDeltaTime(t);let e=this._speed,i=this._fps,s=this._head;for(;s;){let r=s._next;s.paused?(ci(this,s),this._hasChildren=!!this._tail,s._running=!1,s.completed&&!s._cancelled&&s.cancel()):jn(s,(t-s._startTime)*s._speed*e,0,0,s._fps<i?s.requestTick(t):Ue.AUTO),s=r}hi.update()}}wake(){return this.useDefaultMainLoop&&!this.reqId&&(this.requestTick(ai()),this.reqId=Pu(Iu)),this}pause(){if(this.reqId)return this.paused=!0,up()}resume(){if(this.paused)return this.paused=!1,fe(this,t=>t.resetTime()),this.wake()}get speed(){return this._speed*(re.timeScale===1?1:Jn)}set speed(t){let e=t*re.timeScale;this._speed!==e&&(this._speed=e,fe(this,i=>i.speed=i._speed))}get timeUnit(){return re.timeScale===1?"ms":"s"}set timeUnit(t){let i=t==="s",s=i?.001:1;if(re.timeScale!==s){re.timeScale=s,re.tickThreshold=200*s;let r=i?.001:Jn;this.defaults.duration*=r,this._speed*=r}}get precision(){return re.precision}set precision(t){re.precision=t}},Fe=(()=>{let n=new rc(ai());return An&&($l.engine=n,Ci.addEventListener("visibilitychange",()=>{n.pauseOnDocumentHidden&&(Ci.hidden?n.pause():n.resume())})),n})(),Iu=()=>{Fe._head?(Fe.reqId=Pu(Iu),Fe.update()):Fe.reqId=0},up=()=>(hp(Fe.reqId),Fe.reqId=0,Fe);var Ao={_rep:new WeakMap,_add:new Map},Tr=(n,t,e="_rep")=>{let i=Ao[e],s=i.get(n);return s||(s={},i.set(n,s)),s[t]?s[t]:s[t]={_head:null,_tail:null}},dp=(n,t)=>n._isOverridden||n._absoluteStartTime>t._absoluteStartTime,br=n=>{n._isOverlapped=1,n._isOverridden=1,n._changeDuration=Kt,n._currentTime=Kt},Co=(n,t)=>{let e=n._composition;if(e===Ce.replace){let i=n._absoluteStartTime;Un(t,n,dp,"_prevRep","_nextRep");let s=n._prevRep;if(s){let r=s.parent,o=s._absoluteEndTime;if(n.parent.id!==r.id&&r.iterationCount>1&&o+(r.duration-r.iterationDuration)>i){br(s);let l=s._prevRep;for(;l&&l.parent.id===r.id;)br(l),l=l._prevRep}let a=n._absoluteUpdateStartTime;if(o>a){let l=s._startTime,u=o-(l+s._updateDuration),f=de(a-u-l,12);s._changeDuration=f,s._currentTime=f,s._isOverlapped=1,f<Kt&&br(s)}let c=n.parent.parent;if(!c||c!==r.parent){let l=!0;if(fe(r,u=>{u._isOverlapped||(l=!1)}),l){let u=r.parent;if(u){let f=!0;fe(u,h=>{h!==r&&fe(h,d=>{d._isOverlapped||(f=!1)})}),f&&u.cancel()}else r.cancel()}}}}else if(e===Ce.blend){let i=Tr(n.target,n.property,"_add"),s=Ru(Ao._add),r=i._head;r||(r={...n},r._composition=Ce.replace,r._updateDuration=Kt,r._startTime=0,r._numbers=Le(n._fromNumbers),r._number=0,r._next=null,r._prev=null,Un(i,r),Un(s,r));let o=n._toNumber;if(n._fromNumber=r._fromNumber-o,n._toNumber=0,n._numbers=Le(n._fromNumbers),n._number=0,r._fromNumber=o,n._toNumbers.length){let a=Le(n._toNumbers);a.forEach((c,l)=>{n._fromNumbers[l]=r._fromNumbers[l]-c,n._toNumbers[l]=0}),r._fromNumbers=a}Un(i,n,null,"_prevAdd","_nextAdd")}return n},oc=n=>{let t=n._composition;if(t!==Ce.none){let e=n.target,i=n.property,o=Ao._rep.get(e)[i];if(ci(o,n,"_prevRep","_nextRep"),t===Ce.blend){let a=Ao._add,c=a.get(e);if(!c)return;let l=c[i],u=hi.animation;ci(l,n,"_prevAdd","_nextAdd");let f=l._head;if(f&&f===l._tail){ci(l,f,"_prevAdd","_nextAdd"),ci(u,f);let h=!0;for(let d in c)if(c[d]._head){h=!1;break}h&&a.delete(e)}}}return n},Lu=(n,t,e)=>{let i=!1;return fe(t,s=>{let r=s.target;if(n.includes(r)){let o=s.property,a=s._tweenType,c=wo(e,r,a);(!c||c&&c===o)&&(s.parent._tail===s&&s._tweenType===me.TRANSFORM&&s._prev&&s._prev._tweenType===me.TRANSFORM&&(s._prev._renderTransforms=1),ci(t,s),oc(s),i=!0)}},!0),i},ac=(n,t,e)=>{let i=t||Fe,s;if(i._hasChildren){let r=0;fe(i,o=>{if(!o._hasChildren)if(s=Lu(n,o,e),s&&!o._head)o.cancel(),ci(i,o);else{let c=o._offset+o._delay+o.duration;c>r&&(r=c)}o._head?ac(n,o,e):o._hasChildren=!1},!0),Ot(i.iterationDuration)||(i.iterationDuration=r)}else s=Lu(n,i,e);s&&!i._head&&(i._hasChildren=!1,i.cancel&&i.cancel())};var Du=n=>(n.paused=!0,n.began=!1,n.completed=!1,n),lc=n=>(n._cancelled&&(n._hasChildren?fe(n,lc):fe(n,t=>{t._composition!==Ce.none&&Co(t,Tr(t.target,t.property))}),n._cancelled=0),n),Nu=0,fp=(n,t)=>n._priority>t._priority,ns=class extends bs{constructor(t={},e=null,i=0){super(0),++Nu;let{id:s,delay:r,duration:o,reversed:a,alternate:c,loop:l,loopDelay:u,autoplay:f,frameRate:h,playbackRate:d,priority:m,onComplete:x,onLoop:g,onPause:p,onBegin:S,onBeforeUpdate:A,onUpdate:M}=t;gr.current&&gr.current.register(this);let T=e?0:Fe._lastTickTime,b=e?e.defaults:re.defaults,C=Ke(r)||Ot(r)?b.delay:+r,y=Ke(o)||Ot(o)?1/0:+o,w=Re(l,b.loop),P=Re(u,b.loopDelay),F=w===!0||w===1/0||w<0?1/0:w+1,B=0;e?B=i:(Fe.reqId||Fe.requestTick(ai()),B=(Fe._lastTickTime-Fe._startTime)*re.timeScale),this.id=Ot(s)?Nu:s,this.parent=e,this.duration=es((y+P)*F-P)||Kt,this.backwards=!1,this.paused=!0,this.began=!1,this.completed=!1,this.onBegin=S||b.onBegin,this.onBeforeUpdate=A||b.onBeforeUpdate,this.onUpdate=M||b.onUpdate,this.onLoop=g||b.onLoop,this.onPause=p||b.onPause,this.onComplete=x||b.onComplete,this.iterationDuration=y,this.iterationCount=F,this._autoplay=e?!1:Re(f,b.autoplay),this._offset=B,this._delay=C,this._loopDelay=P,this._iterationTime=0,this._currentIteration=0,this._resolve=$e,this._running=!1,this._reversed=+Re(a,b.reversed),this._reverse=this._reversed,this._cancelled=0,this._alternate=Re(c,b.alternate),this._prev=null,this._next=null,this._lastTickTime=T,this._startTime=T,this._lastTime=T,this._fps=Re(h,b.frameRate),this._speed=Re(d,b.playbackRate),this._priority=+Re(m,1)}get cancelled(){return!!this._cancelled}set cancelled(t){t?this.cancel():this.reset(!0).play()}get currentTime(){return an(de(this._currentTime,re.precision),-this._delay,this.duration)}set currentTime(t){let e=this.paused;this.pause().seek(+t),e||this.resume()}get iterationCurrentTime(){return an(de(this._iterationTime,re.precision),0,this.iterationDuration)}set iterationCurrentTime(t){this.currentTime=this.iterationDuration*this._currentIteration+t}get progress(){return an(de(this._currentTime/this.duration,10),0,1)}set progress(t){this.currentTime=this.duration*t}get iterationProgress(){return an(de(this._iterationTime/this.iterationDuration,10),0,1)}set iterationProgress(t){let e=this.iterationDuration;this.currentTime=e*this._currentIteration+e*t}get currentIteration(){return this._currentIteration}set currentIteration(t){this.currentTime=this.iterationDuration*an(+t,0,this.iterationCount-1)}get reversed(){return!!this._reversed}set reversed(t){t?this.reverse():this.play()}get speed(){return super.speed}set speed(t){super.speed=t,this.resetTime()}reset(t=!1){return lc(this),this._reversed&&!this._reverse&&(this.reversed=!1),this._iterationTime=this.iterationDuration,jn(this,0,1,~~t,Ue.FORCE),Du(this),this._hasChildren&&fe(this,Du),this}init(t=!1){this.fps=this._fps,this.speed=this._speed,!t&&this._hasChildren&&jn(this,this.duration,1,~~t,Ue.FORCE),this.reset(t);let e=this._autoplay;return e===!0?this.resume():e&&!Ot(e.linked)&&e.link(this),this}resetTime(){let t=1/(this._speed*Fe._speed);return this._startTime=ai()-(this._currentTime+this._delay)*t,this}pause(){return this.paused?this:(this.paused=!0,this.onPause(this),this)}resume(){return this.paused?(this.paused=!1,this.duration<=Kt&&!this._hasChildren?jn(this,Kt,0,0,Ue.FORCE):(this._running||(Un(Fe,this,fp),Fe._hasChildren=!0,this._running=!0),this.resetTime(),this._startTime-=12,Fe.wake()),this):this}restart(){return this.reset().resume()}seek(t,e=0,i=0){lc(this),this.completed=!1;let s=this.paused;return this.paused=!0,jn(this,t+this._delay,~~e,~~i,Ue.AUTO),s?this:this.resume()}alternate(){let t=this._reversed,e=this.iterationCount,i=this.iterationDuration,s=e===1/0?ts(fr/i):e;return this._reversed=+(this._alternate&&!(s%2)?t:!t),e===1/0?this.iterationProgress=this._reversed?1-this.iterationProgress:this.iterationProgress:this.seek(i*s-this._currentTime),this.resetTime(),this}play(){return this._reversed&&this.alternate(),this.resume()}reverse(){return this._reversed||this.alternate(),this.resume()}cancel(){return this._hasChildren?fe(this,t=>t.cancel(),!0):fe(this,oc),this._cancelled=1,this.pause()}stretch(t){let e=this.duration,i=li(t);if(e===i)return this;let s=t/e,r=t<=Kt;return this.duration=r?Kt:i,this.iterationDuration=r?Kt:li(this.iterationDuration*s),this._offset*=s,this._delay*=s,this._loopDelay*=s,this}revert(){jn(this,0,1,0,Ue.AUTO);let t=this._autoplay;return t&&t.linked&&t.linked===this&&t.revert(),this.cancel()}complete(t=0){return this.seek(this.duration,t).cancel()}then(t=$e){let e=this.then,i=()=>{this.then=null,t(this),this.then=e,this._resolve=$e};return new Promise(s=>(this._resolve=()=>s(i()),this.completed&&this._resolve(),this))}};function Uu(n){let t=on(n)?gr.root.querySelectorAll(n):n;if(t instanceof NodeList||t instanceof HTMLCollection)return t}function Ro(n){if($n(n))return[];if(!An)return Rn(n)&&n.flat(1/0)||[n];if(Rn(n)){let e=n.flat(1/0),i=[];for(let s=0,r=e.length;s<r;s++){let o=e[s];if(!$n(o)){let a=Uu(o);if(a)for(let c=0,l=a.length;c<l;c++){let u=a[c];if(!$n(u)){let f=!1;for(let h=0,d=i.length;h<d;h++)if(i[h]===u){f=!0;break}f||i.push(u)}}else{let c=!1;for(let l=0,u=i.length;l<u;l++)if(i[l]===o){c=!0;break}c||i.push(o)}}}return i}let t=Uu(n);return t?Array.from(t):[n]}function Po(n){let t=Ro(n),e=t.length;for(let i=0;i<e;i++){let s=t[i];if(!s[Zl]){s[Zl]=!0;let r=yo(s);(s.nodeType||r)&&(s[Zn]=!0,s[go]=r,s[Ri]={})}}return t}var cc={deg:1,rad:180/vr,turn:360},Fu={},hc=(n,t,e,i=!1)=>{let s=t.u,r=t.n;if(t.t===jt.UNIT&&s===e)return t;let o=r+s+e,a=Fu[o];if(!Ot(a)&&!i)t.n=a;else{let c;if(s in cc)c=r*cc[s]/cc[e];else{let u=n.cloneNode(),f=n.parentNode,h=f&&f!==Ci?f:Ci.body;h.appendChild(u);let d=u.style;d.width=100+s;let m=u.offsetWidth||100;d.width=100+e;let x=u.offsetWidth||100,g=m/x;h.removeChild(u),c=g*r}t.n=c,Fu[o]=c}return t.t,jt.UNIT,t.u=e,t};var ui=n=>n;var Er=(n=1.68)=>t=>Qi(t,+n),dc={in:n=>t=>n(t),out:n=>t=>1-n(1-t),inOut:n=>t=>t<.5?n(t*2)/2:1-n(t*-2+2)/2,outIn:n=>t=>t<.5?(1-n(1-t*2))/2:(n(t*2-1)+1)/2},pp=vr/2,Ou=vr*2,Bu={[Cn]:Er,Quad:Er(2),Cubic:Er(3),Quart:Er(4),Quint:Er(5),Sine:n=>1-Su(n*pp),Circ:n=>1-xr(1-n*n),Expo:n=>n?Qi(2,10*n-10):0,Bounce:n=>{let t,e=4;for(;n<((t=Qi(2,--e))-1)/11;);return 1/Qi(4,3-e)-7.5625*Qi((t*3-2)/22-n,2)},Back:(n=1.7)=>t=>(+n+1)*t*t*t-+n*t*t,Elastic:(n=1,t=.3)=>{let e=an(+n,1,10),i=an(+t,Kt,2),s=i/Ou*bu(1/e),r=Ou/i;return o=>o===0||o===1?o:-e*Qi(2,-10*(1-o))*Mu((1-o-s)*r)}},uc=(()=>{let n={linear:ui,none:ui};for(let t in dc)for(let e in Bu){let i=Bu[e],s=dc[t];n[t+e]=e===Cn||e==="Back"||e==="Elastic"?(r,o)=>s(i(r,o)):s(i)}return n})(),Io={linear:ui,none:ui},mp=n=>{if(Io[n])return Io[n];if(n.indexOf("(")<=-1){let e=dc[n]||n.includes("Back")||n.includes("Elastic")?uc[n]():uc[n];return e?Io[n]=e:ui}else{let t=n.slice(0,-1).split("("),e=uc[t[0]];return e?Io[n]=e(...t[1].split(",")):ui}},ku=["steps(","irregular(","linear(","cubicBezier("],is=n=>{if(on(n)){for(let e=0,i=ku.length;e<i;e++)if(gn(n,ku[e]))return console.warn(`String syntax for \`ease: "${n}"\` has been removed from the core and replaced by importing and passing the easing function directly: \`ease: ${n}\``),ui}return Ke(n)?n:on(n)?mp(n):ui};var Xt=To(),Qt=To(),Ts={},Lo={func:null},Do={func:null},No=[null],Es=[null,null],Uo={to:null},gp=0,zu=0,Ii,Qn,_p=(n,t)=>{let e={};if(Rn(n)){let i=[].concat(...n.map(s=>Object.keys(s))).filter(_r);for(let s=0,r=i.length;s<r;s++){let o=i[s],a=n.map(c=>{let l={};for(let u in c){let f=c[u];_r(u)?u===o&&(l.to=f):l[u]=f}return l});e[o]=a}}else{let i=Re(t.duration,re.defaults.duration);Object.keys(n).map(r=>({o:parseFloat(r)/100,p:n[r]})).sort((r,o)=>r.o-o.o).forEach(r=>{let o=r.o,a=r.p;for(let c in a)if(_r(c)){let l=e[c];l||(l=e[c]=[]);let u=o*i,f=l.length,h=l[f-1],d={to:a[c]},m=0;for(let x=0;x<f;x++)m+=l[x].duration;f===1&&(d.from=h.to),a.ease&&(d.ease=a.ease),d.duration=u-(f?m:0),l.push(d)}return r});for(let r in e){let o=e[r],a;for(let c=0,l=o.length;c<l;c++){let u=o[c],f=u.ease;u.ease=a||void 0,a=f}o[0].duration||o.shift()}}return e},ws=class extends ns{constructor(t,e,i,s,r=!1,o=0,a){super(e,i,s),this._head,this._tail,++zu;let c=Po(t),l=c.length,u=e.keyframes,f=u?Mo(_p(u,e),e):e,{id:h,delay:d,duration:m,ease:x,playbackEase:g,modifier:p,composition:S,onRender:A}=f,M=i?i.defaults:re.defaults,T=Re(x,M.ease),b=Re(g,M.playbackEase),C=b?is(b):null,y=!Ot(T.ease),w=y?T.ease:Re(x,C?"linear":M.ease),P=y?T.settlingDuration:Re(m,M.duration),F=Re(d,M.delay),B=p||M.modifier,V=Ot(S)&&l>=Jn?Ce.none:Ot(S)?M.composition:S,I=this._offset+(i?i._offset:0);y&&(T.parent=this);let k=NaN,W=NaN,J=0,et=0;for(let U=0;U<l;U++){let q=c[U],j=o||U,xt=a||c,Mt=NaN,le=NaN;for(let Vt in f)if(_r(Vt)){let St=ic(q,Vt),Y=bo(q,Vt),K=wo(Vt,q,St),it=f[Vt],wt=Rn(it);if(r&&!wt&&(Es[0]=it,Es[1]=it,it=Es),wt){let Ut=it.length,Rt=!ji(it[0]);Ut===2&&Rt?(Uo.to=it,No[0]=Uo,Ii=No):Ut>2&&Rt?(Ii=[],it.forEach((Jt,se)=>{se?se===1?(Es[1]=Jt,Ii.push(Es)):Ii.push(Jt):Es[0]=Jt})):Ii=it}else No[0]=it,Ii=No;let ot=null,ut=null,Ht=NaN,Nt=0,zt=0;for(let Ut=Ii.length;zt<Ut;zt++){let Rt=Ii[zt];ji(Rt)?Qn=Rt:(Uo.to=Rt,Qn=Uo),Lo.func=null,Do.func=null;let Jt=Kn(Re(Qn.composition,V),q,j,xt,null,null),se=rn(Jt)?Jt:Ce[Jt];!ot&&se!==Ce.none&&(ot=Tr(q,K));let _e=ot?ot._tail:null,Yt=i&&_e&&_e.parent.parent===i?_e:ut,ee=Kn(Qn.to,q,j,xt,Lo,Yt),R;ji(ee)&&!Ot(ee.to)?(Qn=ee,R=ee.to):R=ee;let $t=Kn(Qn.from,q,j,xt,Do,Yt),At=Qn.ease||w,E=Kn(At,q,j,xt,null,Yt),_=Ke(E)||on(E)?E:At,O=!Ot(_)&&!Ot(_.ease),z=O?_.ease:_,Z=O?_.settlingDuration:Kn(Re(Qn.duration,Ut>1?Kn(P,q,j,xt,null,Yt)/Ut:P),q,j,xt,null,Yt),st=Kn(Re(Qn.delay,zt?0:F),q,j,xt,null,Yt),rt=Qn.modifier||B,$=!Ot($t),Q=!Ot(R),at=Rn(R),Lt=at||$&&Q,dt=ut?Nt:0,ct=ut?Nt+st:st,Ct=de(I+ct,12),Bt=de(I+dt,12);!et&&($||at)&&(et=1);let Ft=ut;if(se!==Ce.none){let Pt=ot._head;for(;Pt&&Pt._absoluteStartTime<=Ct;)if(Pt._isOverridden||(Ft=Pt),Pt=Pt._nextRep,Pt&&Pt._absoluteStartTime>=Ct)for(;Pt;)br(Pt),Pt=Pt._nextRep}if(Lt){ln(at?Kn(R[0],q,j,xt,Do,Yt):$t,Xt),ln(at?Kn(R[1],q,j,xt,Lo,Yt):R,Qt);let Pt=Pi(q,K,St,Ts);Xt.t===jt.NUMBER&&(Ft?Ft._valueType===jt.UNIT&&(Xt.t=jt.UNIT,Xt.u=Ft._unit):(ln(Pt,_n),_n.t===jt.UNIT&&(Xt.t=jt.UNIT,Xt.u=_n.u)))}else Q?ln(R,Qt):ut?sc(ut,Qt):ln(i&&Ft&&Ft.parent.parent===i?Ft._value:Pi(q,K,St,Ts),Qt),$?ln($t,Xt):ut?sc(ut,Xt):ln(i&&Ft&&Ft.parent.parent===i?Ft._value:Pi(q,K,St,Ts),Xt);if(Xt.o&&(Xt.n=Ss(Ft?Ft._toNumber:ln(Pi(q,K,St,Ts),_n).n,Xt.n,Xt.o)),Qt.o&&(Qt.n=Ss(Xt.n,Qt.n,Qt.o)),Xt.t!==Qt.t){if(Xt.t===jt.COMPLEX||Qt.t===jt.COMPLEX){let Pt=Xt.t===jt.COMPLEX?Xt:Qt,qt=Xt.t===jt.COMPLEX?Qt:Xt;qt.t=jt.COMPLEX,qt.s=Le(Pt.s),qt.d=Pt.d.map(()=>qt.n)}else if(Xt.t===jt.UNIT||Qt.t===jt.UNIT){let Pt=Xt.t===jt.UNIT?Xt:Qt,qt=Xt.t===jt.UNIT?Qt:Xt;qt.t=jt.UNIT,qt.u=Pt.u}else if(Xt.t===jt.COLOR||Qt.t===jt.COLOR){let Pt=Xt.t===jt.COLOR?Xt:Qt,qt=Xt.t===jt.COLOR?Qt:Xt;qt.t=jt.COLOR,qt.d=Pt.d.map(()=>0)}}if(Xt.u!==Qt.u){let Pt=Qt.u?Xt:Qt;Pt=hc(q,Pt,Qt.u?Qt.u:Xt.u,!1)}if(Qt.d&&Xt.d&&Qt.d.length!==Xt.d.length){let Pt=Xt.d.length>Qt.d.length?Xt:Qt,qt=Pt===Xt?Qt:Xt;qt.d=Pt.d.map((En,mn)=>Ot(qt.d[mn])?0:qt.d[mn]),qt.s=Le(Pt.s)}let N=de(+Z||Kt,12),ht=Ts[K];$n(ht)||(Ts[K]=null);let tt=Y?Y.set:null;Nt=de(ct+N,12);let lt=Xt.d,pt=Qt.d,nt=Qt.s,_t={parent:this,id:gp++,property:K,target:q,_value:null,_toFunc:Lo.func,_fromFunc:Do.func,_ease:is(z),_fromNumbers:lt?Le(lt):mr,_toNumbers:pt?Le(pt):mr,_strings:nt?Le(nt):mr,_fromNumber:Xt.n,_toNumber:Qt.n,_numbers:lt?Le(lt):mr,_number:Xt.n,_unit:Qt.u,_modifier:rt,_currentTime:0,_startTime:ct,_delay:+st,_updateDuration:N,_changeDuration:N,_absoluteStartTime:Ct,_absoluteUpdateStartTime:Bt,_absoluteEndTime:de(I+Nt,12),_hasFromValue:$||at?1:0,_tweenType:St,_setter:tt,_valueType:Qt.t,_composition:se,_isOverlapped:0,_isOverridden:0,_renderTransforms:0,_inlineValue:ht,_prevRep:null,_nextRep:null,_prevAdd:null,_nextAdd:null,_prev:null,_next:null};se!==Ce.none&&Co(_t,ot);let bt=_t._valueType;if(bt===jt.COMPLEX)_t._value=Eo(_t,1,-1);else if(bt===jt.UNIT)_t._value=`${rt(_t._toNumber)}${_t._unit}`;else if(bt===jt.COLOR){let Pt=Qt.d;_t._value=`rgba(${de(Pt[0],0)},${de(Pt[1],0)},${de(Pt[2],0)},${Pt[3]})`}else _t._value=rt(_t._toNumber);isNaN(Ht)&&(Ht=_t._startTime),ut=_t,J++,Un(this,_t)}(isNaN(W)||Ht<W)&&(W=Ht),(isNaN(k)||Nt>k)&&(k=Nt),St===me.TRANSFORM&&(Mt=J-zt,le=J)}if(!isNaN(Mt)){let Vt=0;fe(this,St=>{Vt>=Mt&&Vt<le&&(St._renderTransforms=1,St._composition===Ce.blend&&fe(hi.animation,Y=>{Y.id===St.id&&(Y._renderTransforms=1)})),Vt++})}}l||console.warn("No target found. Make sure the element you're trying to animate is accessible before creating your animation."),W?(fe(this,U=>{U._startTime-U._delay||(U._delay-=W),U._startTime-=W}),k-=W):W=0,k||(k=Kt,this.iterationCount=0),this.targets=c,this.id=Ot(h)?zu:h,this.duration=k===Kt?Kt:es((k+this._loopDelay)*this.iterationCount-this._loopDelay)||Kt,this.onRender=A||M.onRender,this._ease=C,this._delay=W,this.iterationDuration=k,!this._autoplay&&et&&this.onRender(this)}stretch(t){let e=this.duration;if(e===li(t))return this;let i=t/e;return fe(this,s=>{s._updateDuration=li(s._updateDuration*i),s._changeDuration=li(s._changeDuration*i),s._currentTime*=i,s._delay*=i,s._startTime*=i,s._absoluteStartTime*=i,s._absoluteUpdateStartTime*=i,s._absoluteEndTime*=i}),super.stretch(t)}refresh(){return fe(this,t=>{let e=t._toFunc,i=t._fromFunc;(e||i)&&(i?(ln(i(),Xt),Xt.u!==t._unit&&t.target[Zn]&&hc(t.target,Xt,t._unit,!0),t._fromNumbers=Le(Xt.d),t._fromNumber=Xt.n):e&&(ln(Pi(t.target,t.property,t._tweenType),_n),t._fromNumbers=Le(_n.d),t._fromNumber=_n.n),e&&(ln(e(),Qt),t._toNumbers=Le(Qt.d),t._strings=Le(Qt.s),t._toNumber=Qt.o?Ss(t._fromNumber,Qt.n,Qt.o):Qt.n))}),this.duration===Kt&&this.restart(),this}revert(){return super.revert(),Sr(this)}then(t){return super.then(t)}},Fo=(n,t)=>re.editor?re.editor.addAnimation(n,t):new ws(n,t,null,0,!1).init();var xp=(n,t)=>{if(gn(t,"<")){let e=t[1]==="<",i=n._tail,s=i?i._offset+i._delay:0;return e?s:s+i.duration}},ss=(n,t)=>{let e=n.iterationDuration;if(e===Kt&&(e=0),Ot(t))return e;if(rn(+t))return+t;let i=t,s=n?n.labels:null,r=!$n(s),o=xp(n,i),a=!Ot(o),c=gu.exec(i);if(c){let l=c[0],u=i.split(l),f=r&&u[0]?s[u[0]]:e,h=a?o:r?f:e,d=+u[1];return Ss(h,d,l[0])}else return a?o:r?Ot(s[i])?e:s[i]:e};function yp(n){return es((n.iterationDuration+n._loopDelay)*n.iterationCount-n._loopDelay)||Kt}function fc(n,t,e,i,s,r){let a=rn(n.duration)&&n.duration<=Kt?e-Kt:e;t.composition&&jn(t,a,1,1,Ue.AUTO);let c=i?new ws(i,n,t,a,!1,s,r):new ns(n,t,a);return t.composition&&c.init(!0),Un(t,c),fe(t,l=>{let f=l._offset+l._delay+l.duration;f>t.iterationDuration&&(t.iterationDuration=f)}),t.duration=yp(t),t}var Vu=0,Oo=class extends ns{constructor(t={}){super(t,null,0),++Vu,this.id=Ot(t.id)?Vu:t.id,this.duration=0,this.labels={};let e=t.defaults,i=re.defaults;this.defaults=e?Mo(e,i):i,this.composition=Re(t.composition,!0),this.onRender=t.onRender||i.onRender;let s=Re(t.playbackEase,i.playbackEase);this._ease=s?is(s):null,this.iterationDuration=0}add(t,e,i){let s=ji(e),r=ji(t);if(s||r){if(this._hasChildren=!0,s){let o=e,a=re.editor&&re.editor.addTimelineChild,c=i&&i.type==="Stagger"&&re.editor,l=Ke(i)?i:null;if(l||c){let u=Ro(t),f=this.duration,h=this.iterationDuration,d=o.id,m=0,x=u.length,g=a?a(t,o,this.id,i,x):null,p=l||re.editor.resolveStagger(i.defaultValue);u.forEach(S=>{let A={...g||o};this.duration=f,this.iterationDuration=h,Ot(d)||(A.id=d+"-"+m);let M=ss(this,p(S,m,u,null,this));fc(A,this,M,S,m,u),m++})}else{let u=a?a(t,o,this.id,i):o,f=i&&i.type?i.defaultValue:i;fc(u,this,ss(this,f),t)}}else fc(t,this,ss(this,e));return this.composition&&this.init(!0),this}}sync(t,e){if(Ot(t)||t&&Ot(t.pause))return this;t.pause();let i=+(t.effect?t.effect.getTiming().duration:t.duration);!Ot(t)&&!Ot(t.persist)&&(t.persist=!0);let s=re.editor,r=s&&s.addTimelineChild;s&&s.addTimelineSync&&(e=s.addTimelineSync(t,e,this.id),s.addTimelineChild=null);let o=this.add(t,{currentTime:[0,i],duration:i,delay:0,ease:"linear",playbackEase:"linear"},e);return s&&(s.addTimelineChild=r),o}set(t,e,i){return Ot(e)?this:(e.duration=Kt,e.composition=Ce.replace,this.add(t,e,i))}call(t,e){return Ot(t)||t&&!Ke(t)?this:(re.editor&&re.editor.addTimelineCall&&(e=re.editor.addTimelineCall(t,e,this.id)),this.add({duration:0,delay:0,onComplete:()=>t(this)},e))}label(t,e){return Ot(t)||t&&!on(t)?this:(re.editor&&re.editor.addTimelineLabel&&(e=re.editor.addTimelineLabel(t,e,this.id)),this.labels[t]=ss(this,e),this)}remove(t,e){return ac(Ro(t),this,e),this}stretch(t){let e=this.duration;if(e===li(t))return this;let i=t/e,s=this.labels;fe(this,r=>r.stretch(r.duration*i));for(let r in s)s[r]*=i;return super.stretch(t)}refresh(){return fe(this,t=>{t.refresh&&t.refresh()}),this}revert(){return super.revert(),fe(this,t=>t.revert,!0),Sr(this)}then(t){return super.then(t)}},pc=n=>re.editor?re.editor.addTimeline(n):new Oo(n).init();var mc=(n=0,t=1,e=0)=>{let i=10**e;return Math.floor((Math.random()*(t-n+1/i)+n)*i)/i},vp=0,Hu=(n,t=0,e=1,i=0)=>{let s=n===void 0?vp++:n;return(r=t,o=e,a=i)=>{s+=1831565813,s=Math.imul(s^s>>>15,s|1),s^=s+Math.imul(s^s>>>7,s|61);let c=10**a;return Math.floor((((s^s>>>14)>>>0)/4294967296*(o-r+1/c)+r)*c)/c}};var Gu=(n,t=mc)=>{let e=n.length,i,s;for(;e;)s=t(0,--e),i=n[e],n[e]=n[s],n[s]=i;return n};var gc=(n,t={})=>{let e=[],i=0,s,r=null,o=t.from,a=t.reversed,c=t.ease,l=!Ot(c),f=l&&!Ot(c.ease)?c.ease:l?is(c):null,h=t.grid,d=h===!0,m=t.axis,x=t.total,g=Ot(o)||o===0||o==="first",p=o==="center",S=o==="last",A=o==="random",M=Rn(o),T=Rn(n),b=t.use,C=T?vo(n[0]):vo(n),y=T?vo(n[1]):0,w=xo.exec((T?n[1]:n)+Cn),P=t.start||0+(T?C:0),F=t.seed,V=!Ot(F)&&F!==!1?Hu(F===!0?0:F):mc,I=t.jitter,k=!Ot(I),W=Rn(I),J=W?I[0]:I||0,et=W?I[1]:I||0,U=g?0:rn(o)?o:0;return(q,j,xt,Mt,le)=>{let[Vt]=Po(q),St=Ot(x)?xt.length:x,Y=Ot(b)?!1:Ke(b)?b(Vt,j,St):Pi(Vt,b),K=rn(Y)||on(Y)&&rn(+Y)?+Y:j,it=K>=0&&K<St?K:j;if(p&&(U=(St-1)/2),S&&(U=St-1),!e.length){if(d){let ut=!0,Ht=!1,Nt=1/0,zt=1/0,Ut=1/0,Rt=-1/0,Jt=-1/0,se=-1/0,_e=[],Yt=[],ee=[];for(let R=0;R<St;R++){let $t=xt[R],At=0,E=0,_=0,O=!1;if($t&&Ke($t.getBoundingClientRect)){let z=$t.getBoundingClientRect();At=z.left+z.width/2,E=z.top+z.height/2,O=!0}else{let z=$t;z&&rn(z.x)&&rn(z.y)&&(At=z.x,E=z.y,rn(z.z)&&(_=z.z,Ht=!0),O=!0)}if(!O){ut=!1;break}_e.push(At),Yt.push(E),ee.push(_),At<Nt&&(Nt=At),E<zt&&(zt=E),_<Ut&&(Ut=_),At>Rt&&(Rt=At),E>Jt&&(Jt=E),_>se&&(se=_)}if(ut){let R=_e[0],$t=Yt[0],At=ee[0];M?(R=Nt+o[0]*(Rt-Nt),$t=zt+o[1]*(Jt-zt),At=Ht?Ut+(o.length>=3?o[2]:.5)*(se-Ut):0):p?(R=(Nt+Rt)/2,$t=(zt+Jt)/2,At=(Ut+se)/2):S?(R=_e[St-1],$t=Yt[St-1],At=ee[St-1]):rn(o)&&(R=_e[o],$t=Yt[o],At=ee[o]);for(let _=0;_<St;_++){let O=R-_e[_],z=$t-Yt[_],Z=At-ee[_],st=xr(O*O+z*z+(Ht?Z*Z:0));m==="x"&&(st=-O),m==="y"&&(st=-z),m==="z"&&(st=-Z),e.push(st)}let E=1/0;for(let _=0;_<St;_++){let O=yr(e[_]);O>0&&O<E&&(E=O)}if(E>0&&E<1/0)for(let _=0;_<St;_++)e[_]=e[_]/E}else for(let R=0;R<St;R++)e.push(yr(U-R))}else for(let ut=0;ut<St;ut++)if(!h)e.push(yr(U-ut));else{let Ht=h.length,Nt=h[0]*h[1],zt,Ut,Rt;M?(zt=o[0]*(h[0]-1),Ut=o[1]*(h[1]-1),Rt=Ht===3?(o.length>=3?o[2]:.5)*(h[2]-1):0):p?(zt=(h[0]-1)/2,Ut=(h[1]-1)/2,Rt=Ht===3?(h[2]-1)/2:0):(zt=U%h[0],Ut=ts(U/h[0])%h[1],Rt=Ht===3?ts(U/Nt):0);let Jt=ut%h[0],se=ts(ut/h[0])%h[1],_e=Ht===3?ts(ut/Nt):0,Yt=zt-Jt,ee=Ut-se,R=Rt-_e,$t=xr(Yt*Yt+ee*ee+(Ht===3?R*R:0));m==="x"&&($t=-Yt),m==="y"&&($t=-ee),m==="z"&&($t=-R),e.push($t)}i=e[0];for(let ut=1;ut<St;ut++)e[ut]>i&&(i=e[ut]);if(f||a)for(let ut=0;ut<St;ut++){let Ht=e[ut];f&&(Ht=f(Ht/i)*i),a&&(Ht=m?-Ht:yr(i-Ht)),e[ut]=Ht}if(k){r=new Array(St);for(let ut=0;ut<St;ut++)r[ut]=V(-1,1,4)}A&&(e=Gu(e,V))}let wt=T?(y-C)/i:C;Ot(s)&&(s=le?ss(le,Ot(t.start)?le.iterationDuration:P):P);let ot=s+(wt*de(e[it],2)||0);if(k){let ut=i?e[it]/i:0,Ht=J+(et-J)*ut;ot=ot+r[it]*Ht}return t.modifier&&(ot=t.modifier(ot)),w&&(ot=`${ot}${w[2]}`),ot}};var Wi={LEFT:0,MIDDLE:1,RIGHT:2,ROTATE:0,DOLLY:1,PAN:2},Xi={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},xd=0,Zc=1,yd=2;var Kr=1,vd=2,ir=3,qi=0,sn=1,Ln=2,si=0,sr=1,Jc=2,$c=3,Kc=4,Md=5;var fs=100,Sd=101,bd=102,Td=103,Ed=104,wd=200,Ad=201,Cd=202,Rd=203,jc=204,Qc=205,Pd=206,Id=207,Ld=208,Dd=209,Nd=210,Ud=211,Fd=212,Od=213,Bd=214,ua=0,da=1,fa=2,Gs=3,pa=4,ma=5,ga=6,_a=7,th=0,kd=1,zd=2,Vn=0,eh=1,nh=2,ih=3,jr=4,sh=5,rh=6,oh=7;var ah=300,Yi=301,ps=302,qa=303,Ya=304,Qr=306,xa=1e3,ei=1001,ya=1002,Ve=1003,Vd=1004;var to=1005;var Ge=1006,Za=1007;var Zi=1008;var dn=1009,lh=1010,ch=1011,rr=1012,Ja=1013,Hn=1014,Gn=1015,Wn=1016,$a=1017,Ka=1018,or=1020,hh=35902,uh=35899,dh=1021,fh=1022,Dn=1023,ni=1026,Ji=1027,ph=1028,ja=1029,$i=1030,Qa=1031;var tl=1033,eo=33776,no=33777,io=33778,so=33779,el=35840,nl=35841,il=35842,sl=35843,rl=36196,ol=37492,al=37496,ll=37488,cl=37489,ro=37490,hl=37491,ul=37808,dl=37809,fl=37810,pl=37811,ml=37812,gl=37813,_l=37814,xl=37815,yl=37816,vl=37817,Ml=37818,Sl=37819,bl=37820,Tl=37821,El=36492,wl=36494,Al=36495,Cl=36283,Rl=36284,oo=36285,Pl=36286;var Lr=2300,va=2301,ca=2302,Vc=2303,Hc=2400,Gc=2401,Wc=2402;var Hd=3200;var Il=0,Gd=1,bi="",Qe="srgb",Dr="srgb-linear",Nr="linear",ge="srgb";var ha=7680;var Wd=519,Xd=512,qd=513,Yd=514,Ll=515,Zd=516,Jd=517,Dl=518,$d=519,Kd=35044;var mh="300 es",kn=2e3,Ws=2001;function Mp(n){for(let t=n.length-1;t>=0;--t)if(n[t]>=65535)return!0;return!1}function Sp(n){return ArrayBuffer.isView(n)&&!(n instanceof DataView)}function Ur(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function jd(){let n=Ur("canvas");return n.style.display="block",n}var Wu={},Xs=null;function gh(...n){let t="THREE."+n.shift();Xs?Xs("log",t,...n):console.log(t,...n)}function Qd(n){let t=n[0];if(typeof t=="string"&&t.startsWith("TSL:")){let e=n[1];e&&e.isStackTrace?n[0]+=" "+e.getLocation():n[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return n}function kt(...n){n=Qd(n);let t="THREE."+n.shift();if(Xs)Xs("warn",t,...n);else{let e=n[0];e&&e.isStackTrace?console.warn(e.getError(t)):console.warn(t,...n)}}function Wt(...n){n=Qd(n);let t="THREE."+n.shift();if(Xs)Xs("error",t,...n);else{let e=n[0];e&&e.isStackTrace?console.error(e.getError(t)):console.error(t,...n)}}function cs(...n){let t=n.join(" ");t in Wu||(Wu[t]=!0,kt(...n))}function tf(n,t,e){return new Promise(function(i,s){function r(){switch(n.clientWaitSync(t,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:s();break;case n.TIMEOUT_EXPIRED:setTimeout(r,e);break;default:i()}}setTimeout(r,e)})}var ef={[ua]:da,[fa]:ga,[pa]:_a,[Gs]:ma,[da]:ua,[ga]:fa,[_a]:pa,[ma]:Gs},zn=class{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});let i=this._listeners;i[t]===void 0&&(i[t]=[]),i[t].indexOf(e)===-1&&i[t].push(e)}hasEventListener(t,e){let i=this._listeners;return i===void 0?!1:i[t]!==void 0&&i[t].indexOf(e)!==-1}removeEventListener(t,e){let i=this._listeners;if(i===void 0)return;let s=i[t];if(s!==void 0){let r=s.indexOf(e);r!==-1&&s.splice(r,1)}}dispatchEvent(t){let e=this._listeners;if(e===void 0)return;let i=e[t.type];if(i!==void 0){t.target=this;let s=i.slice(0);for(let r=0,o=s.length;r<o;r++)s[r].call(this,t);t.target=null}}},Xe=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],Xu=1234567,Vs=Math.PI/180,qs=180/Math.PI;function ar(){let n=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(Xe[n&255]+Xe[n>>8&255]+Xe[n>>16&255]+Xe[n>>24&255]+"-"+Xe[t&255]+Xe[t>>8&255]+"-"+Xe[t>>16&15|64]+Xe[t>>24&255]+"-"+Xe[e&63|128]+Xe[e>>8&255]+"-"+Xe[e>>16&255]+Xe[e>>24&255]+Xe[i&255]+Xe[i>>8&255]+Xe[i>>16&255]+Xe[i>>24&255]).toLowerCase()}function oe(n,t,e){return Math.max(t,Math.min(e,n))}function _h(n,t){return(n%t+t)%t}function bp(n,t,e,i,s){return i+(n-t)*(s-i)/(e-t)}function Tp(n,t,e){return n!==t?(e-n)/(t-n):0}function Ir(n,t,e){return(1-e)*n+e*t}function Ep(n,t,e,i){return Ir(n,t,1-Math.exp(-e*i))}function wp(n,t=1){return t-Math.abs(_h(n,t*2)-t)}function Ap(n,t,e){return n<=t?0:n>=e?1:(n=(n-t)/(e-t),n*n*(3-2*n))}function Cp(n,t,e){return n<=t?0:n>=e?1:(n=(n-t)/(e-t),n*n*n*(n*(n*6-15)+10))}function Rp(n,t){return n+Math.floor(Math.random()*(t-n+1))}function Pp(n,t){return n+Math.random()*(t-n)}function Ip(n){return n*(.5-Math.random())}function Lp(n){n!==void 0&&(Xu=n);let t=Xu+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function Dp(n){return n*Vs}function Np(n){return n*qs}function Up(n){return n>0&&Number.isInteger(n)&&2**Math.round(Math.log2(n))===n}function Fp(n){return Math.pow(2,Math.ceil(Math.log(n)/Math.LN2))}function Op(n){return Math.pow(2,Math.floor(Math.log(n)/Math.LN2))}function Bp(n,t,e,i,s){let r=Math.cos,o=Math.sin,a=r(e/2),c=o(e/2),l=r((t+i)/2),u=o((t+i)/2),f=r((t-i)/2),h=o((t-i)/2),d=r((i-t)/2),m=o((i-t)/2);switch(s){case"XYX":n.set(a*u,c*f,c*h,a*l);break;case"YZY":n.set(c*h,a*u,c*f,a*l);break;case"ZXZ":n.set(c*f,c*h,a*u,a*l);break;case"XZX":n.set(a*u,c*m,c*d,a*l);break;case"YXY":n.set(c*d,a*u,c*m,a*l);break;case"ZYZ":n.set(c*m,c*d,a*u,a*l);break;default:kt("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function zs(n,t){switch(t.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:case Uint8ClampedArray:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("THREE.MathUtils: Invalid component type.")}}function je(n,t){switch(t.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:case Uint8ClampedArray:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("THREE.MathUtils: Invalid component type.")}}var xh={DEG2RAD:Vs,RAD2DEG:qs,generateUUID:ar,clamp:oe,euclideanModulo:_h,mapLinear:bp,inverseLerp:Tp,lerp:Ir,damp:Ep,pingpong:wp,smoothstep:Ap,smootherstep:Cp,randInt:Rp,randFloat:Pp,randFloatSpread:Ip,seededRandom:Lp,degToRad:Dp,radToDeg:Np,isPowerOfTwo:Up,ceilPowerOfTwo:Fp,floorPowerOfTwo:Op,setQuaternionFromProperEuler:Bp,normalize:je,denormalize:zs},bh=class bh{constructor(t=0,e=0){this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("THREE.Vector2: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){let e=this.x,i=this.y,s=t.elements;return this.x=s[0]*e+s[3]*i+s[6],this.y=s[1]*e+s[4]*i+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=oe(this.x,t.x,e.x),this.y=oe(this.y,t.y,e.y),this}clampScalar(t,e){return this.x=oe(this.x,t,e),this.y=oe(this.y,t,e),this}clampLength(t,e){let i=this.length();return this.divideScalar(i||1).multiplyScalar(oe(i,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let i=this.dot(t)/e;return Math.acos(oe(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,i=this.y-t.y;return e*e+i*i}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){let i=Math.cos(e),s=Math.sin(e),r=this.x-t.x,o=this.y-t.y;return this.x=r*i-o*s+t.x,this.y=r*s+o*i+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}};bh.prototype.isVector2=!0;var Gt=bh,Mn=class{constructor(t=0,e=0,i=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=i,this._w=s}static slerpFlat(t,e,i,s,r,o,a){let c=i[s+0],l=i[s+1],u=i[s+2],f=i[s+3],h=r[o+0],d=r[o+1],m=r[o+2],x=r[o+3];if(f!==x||c!==h||l!==d||u!==m){let g=c*h+l*d+u*m+f*x;g<0&&(h=-h,d=-d,m=-m,x=-x,g=-g);let p=1-a;if(g<.9995){let S=Math.acos(g),A=Math.sin(S);p=Math.sin(p*S)/A,a=Math.sin(a*S)/A,c=c*p+h*a,l=l*p+d*a,u=u*p+m*a,f=f*p+x*a}else{c=c*p+h*a,l=l*p+d*a,u=u*p+m*a,f=f*p+x*a;let S=1/Math.sqrt(c*c+l*l+u*u+f*f);c*=S,l*=S,u*=S,f*=S}}t[e]=c,t[e+1]=l,t[e+2]=u,t[e+3]=f}static multiplyQuaternionsFlat(t,e,i,s,r,o){let a=i[s],c=i[s+1],l=i[s+2],u=i[s+3],f=r[o],h=r[o+1],d=r[o+2],m=r[o+3];return t[e]=a*m+u*f+c*d-l*h,t[e+1]=c*m+u*h+l*f-a*d,t[e+2]=l*m+u*d+a*h-c*f,t[e+3]=u*m-a*f-c*h-l*d,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,i,s){return this._x=t,this._y=e,this._z=i,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){let i=t._x,s=t._y,r=t._z,o=t._order,a=Math.cos,c=Math.sin,l=a(i/2),u=a(s/2),f=a(r/2),h=c(i/2),d=c(s/2),m=c(r/2);switch(o){case"XYZ":this._x=h*u*f+l*d*m,this._y=l*d*f-h*u*m,this._z=l*u*m+h*d*f,this._w=l*u*f-h*d*m;break;case"YXZ":this._x=h*u*f+l*d*m,this._y=l*d*f-h*u*m,this._z=l*u*m-h*d*f,this._w=l*u*f+h*d*m;break;case"ZXY":this._x=h*u*f-l*d*m,this._y=l*d*f+h*u*m,this._z=l*u*m+h*d*f,this._w=l*u*f-h*d*m;break;case"ZYX":this._x=h*u*f-l*d*m,this._y=l*d*f+h*u*m,this._z=l*u*m-h*d*f,this._w=l*u*f+h*d*m;break;case"YZX":this._x=h*u*f+l*d*m,this._y=l*d*f+h*u*m,this._z=l*u*m-h*d*f,this._w=l*u*f-h*d*m;break;case"XZY":this._x=h*u*f-l*d*m,this._y=l*d*f-h*u*m,this._z=l*u*m+h*d*f,this._w=l*u*f+h*d*m;break;default:kt("Quaternion: .setFromEuler() encountered an unknown order: "+o)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){let i=e/2,s=Math.sin(i);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(t){let e=t.elements,i=e[0],s=e[4],r=e[8],o=e[1],a=e[5],c=e[9],l=e[2],u=e[6],f=e[10],h=i+a+f;if(h>0){let d=.5/Math.sqrt(h+1);this._w=.25/d,this._x=(u-c)*d,this._y=(r-l)*d,this._z=(o-s)*d}else if(i>a&&i>f){let d=2*Math.sqrt(1+i-a-f);this._w=(u-c)/d,this._x=.25*d,this._y=(s+o)/d,this._z=(r+l)/d}else if(a>f){let d=2*Math.sqrt(1+a-i-f);this._w=(r-l)/d,this._x=(s+o)/d,this._y=.25*d,this._z=(c+u)/d}else{let d=2*Math.sqrt(1+f-i-a);this._w=(o-s)/d,this._x=(r+l)/d,this._y=(c+u)/d,this._z=.25*d}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let i=t.dot(e)+1;return i<1e-8?(i=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=i):(this._x=0,this._y=-t.z,this._z=t.y,this._w=i)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=i),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(oe(this.dot(t),-1,1)))}rotateTowards(t,e){let i=this.angleTo(t);if(i===0)return this;let s=Math.min(1,e/i);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){let i=t._x,s=t._y,r=t._z,o=t._w,a=e._x,c=e._y,l=e._z,u=e._w;return this._x=i*u+o*a+s*l-r*c,this._y=s*u+o*c+r*a-i*l,this._z=r*u+o*l+i*c-s*a,this._w=o*u-i*a-s*c-r*l,this._onChangeCallback(),this}slerp(t,e){let i=t._x,s=t._y,r=t._z,o=t._w,a=this.dot(t);a<0&&(i=-i,s=-s,r=-r,o=-o,a=-a);let c=1-e;if(a<.9995){let l=Math.acos(a),u=Math.sin(l);c=Math.sin(c*l)/u,e=Math.sin(e*l)/u,this._x=this._x*c+i*e,this._y=this._y*c+s*e,this._z=this._z*c+r*e,this._w=this._w*c+o*e,this._onChangeCallback()}else this._x=this._x*c+i*e,this._y=this._y*c+s*e,this._z=this._z*c+r*e,this._w=this._w*c+o*e,this.normalize();return this}slerpQuaternions(t,e,i){return this.copy(t).slerp(e,i)}random(){let t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),i=Math.random(),s=Math.sqrt(1-i),r=Math.sqrt(i);return this.set(s*Math.sin(t),s*Math.cos(t),r*Math.sin(e),r*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},Th=class Th{constructor(t=0,e=0,i=0){this.x=t,this.y=e,this.z=i}set(t,e,i){return i===void 0&&(i=this.z),this.x=t,this.y=e,this.z=i,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("THREE.Vector3: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(qu.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(qu.setFromAxisAngle(t,e))}applyMatrix3(t){let e=this.x,i=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[3]*i+r[6]*s,this.y=r[1]*e+r[4]*i+r[7]*s,this.z=r[2]*e+r[5]*i+r[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){let e=this.x,i=this.y,s=this.z,r=t.elements,o=1/(r[3]*e+r[7]*i+r[11]*s+r[15]);return this.x=(r[0]*e+r[4]*i+r[8]*s+r[12])*o,this.y=(r[1]*e+r[5]*i+r[9]*s+r[13])*o,this.z=(r[2]*e+r[6]*i+r[10]*s+r[14])*o,this}applyQuaternion(t){let e=this.x,i=this.y,s=this.z,r=t.x,o=t.y,a=t.z,c=t.w,l=2*(o*s-a*i),u=2*(a*e-r*s),f=2*(r*i-o*e);return this.x=e+c*l+o*f-a*u,this.y=i+c*u+a*l-r*f,this.z=s+c*f+r*u-o*l,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){let e=this.x,i=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[4]*i+r[8]*s,this.y=r[1]*e+r[5]*i+r[9]*s,this.z=r[2]*e+r[6]*i+r[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=oe(this.x,t.x,e.x),this.y=oe(this.y,t.y,e.y),this.z=oe(this.z,t.z,e.z),this}clampScalar(t,e){return this.x=oe(this.x,t,e),this.y=oe(this.y,t,e),this.z=oe(this.z,t,e),this}clampLength(t,e){let i=this.length();return this.divideScalar(i||1).multiplyScalar(oe(i,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){let i=t.x,s=t.y,r=t.z,o=e.x,a=e.y,c=e.z;return this.x=s*c-r*a,this.y=r*o-i*c,this.z=i*a-s*o,this}projectOnVector(t){let e=t.lengthSq();if(e===0)return this.set(0,0,0);let i=t.dot(this)/e;return this.copy(t).multiplyScalar(i)}projectOnPlane(t){return _c.copy(this).projectOnVector(t),this.sub(_c)}reflect(t){return this.sub(_c.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let i=this.dot(t)/e;return Math.acos(oe(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,i=this.y-t.y,s=this.z-t.z;return e*e+i*i+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,i){let s=Math.sin(e)*t;return this.x=s*Math.sin(i),this.y=Math.cos(e)*t,this.z=s*Math.cos(i),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,i){return this.x=t*Math.sin(e),this.y=i,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){let e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){let e=this.setFromMatrixColumn(t,0).length(),i=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=i,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let t=Math.random()*Math.PI*2,e=Math.random()*2-1,i=Math.sqrt(1-e*e);return this.x=i*Math.cos(t),this.y=e,this.z=i*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}};Th.prototype.isVector3=!0;var L=Th,_c=new L,qu=new Mn,Eh=class Eh{constructor(t,e,i,s,r,o,a,c,l){this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,i,s,r,o,a,c,l)}set(t,e,i,s,r,o,a,c,l){let u=this.elements;return u[0]=t,u[1]=s,u[2]=a,u[3]=e,u[4]=r,u[5]=c,u[6]=i,u[7]=o,u[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){let e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],this}extractBasis(t,e,i){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(t){let e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let i=t.elements,s=e.elements,r=this.elements,o=i[0],a=i[3],c=i[6],l=i[1],u=i[4],f=i[7],h=i[2],d=i[5],m=i[8],x=s[0],g=s[3],p=s[6],S=s[1],A=s[4],M=s[7],T=s[2],b=s[5],C=s[8];return r[0]=o*x+a*S+c*T,r[3]=o*g+a*A+c*b,r[6]=o*p+a*M+c*C,r[1]=l*x+u*S+f*T,r[4]=l*g+u*A+f*b,r[7]=l*p+u*M+f*C,r[2]=h*x+d*S+m*T,r[5]=h*g+d*A+m*b,r[8]=h*p+d*M+m*C,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){let t=this.elements,e=t[0],i=t[1],s=t[2],r=t[3],o=t[4],a=t[5],c=t[6],l=t[7],u=t[8];return e*o*u-e*a*l-i*r*u+i*a*c+s*r*l-s*o*c}invert(){let t=this.elements,e=t[0],i=t[1],s=t[2],r=t[3],o=t[4],a=t[5],c=t[6],l=t[7],u=t[8],f=u*o-a*l,h=a*c-u*r,d=l*r-o*c,m=e*f+i*h+s*d;if(m===0)return this.set(0,0,0,0,0,0,0,0,0);let x=1/m;return t[0]=f*x,t[1]=(s*l-u*i)*x,t[2]=(a*i-s*o)*x,t[3]=h*x,t[4]=(u*e-s*c)*x,t[5]=(s*r-a*e)*x,t[6]=d*x,t[7]=(i*c-l*e)*x,t[8]=(o*e-i*r)*x,this}transpose(){let t,e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){let e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,i,s,r,o,a){let c=Math.cos(r),l=Math.sin(r);return this.set(i*c,i*l,-i*(c*o+l*a)+o+t,-s*l,s*c,-s*(-l*o+c*a)+a+e,0,0,1),this}scale(t,e){return cs("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(xc.makeScale(t,e)),this}rotate(t){return cs("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(xc.makeRotation(-t)),this}translate(t,e){return cs("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(xc.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){let e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,i,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){let e=this.elements,i=t.elements;for(let s=0;s<9;s++)if(e[s]!==i[s])return!1;return!0}fromArray(t,e=0){for(let i=0;i<9;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){let i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t}clone(){return new this.constructor().fromArray(this.elements)}};Eh.prototype.isMatrix3=!0;var Zt=Eh,xc=new Zt,Yu=new Zt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Zu=new Zt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function kp(){let n={enabled:!0,workingColorSpace:Dr,spaces:{},convert:function(s,r,o){return this.enabled===!1||r===o||!r||!o||(this.spaces[r].transfer===ge&&(s.r=yi(s.r),s.g=yi(s.g),s.b=yi(s.b)),this.spaces[r].primaries!==this.spaces[o].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[o].fromXYZ)),this.spaces[o].transfer===ge&&(s.r=Hs(s.r),s.g=Hs(s.g),s.b=Hs(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===bi?Nr:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,o){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[o].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return cs("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),n.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return cs("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),n.colorSpaceToWorking(s,r)}},t=[.64,.33,.3,.6,.15,.06],e=[.2126,.7152,.0722],i=[.3127,.329];return n.define({[Dr]:{primaries:t,whitePoint:i,transfer:Nr,toXYZ:Yu,fromXYZ:Zu,luminanceCoefficients:e,workingColorSpaceConfig:{unpackColorSpace:Qe},outputColorSpaceConfig:{drawingBufferColorSpace:Qe}},[Qe]:{primaries:t,whitePoint:i,transfer:ge,toXYZ:Yu,fromXYZ:Zu,luminanceCoefficients:e,outputColorSpaceConfig:{drawingBufferColorSpace:Qe}}}),n}var he=kp();function yi(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function Hs(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}var As,Ma=class{static getDataURL(t,e="image/png"){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let i;if(t instanceof HTMLCanvasElement)i=t;else{As===void 0&&(As=Ur("canvas")),As.width=t.width,As.height=t.height;let s=As.getContext("2d");t instanceof ImageData?s.putImageData(t,0,0):s.drawImage(t,0,0,t.width,t.height),i=As}return i.toDataURL(e)}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){let e=Ur("canvas");e.width=t.width,e.height=t.height;let i=e.getContext("2d");i.drawImage(t,0,0,t.width,t.height);let s=i.getImageData(0,0,t.width,t.height),r=s.data;for(let o=0;o<r.length;o++)r[o]=yi(r[o]/255)*255;return i.putImageData(s,0,0),e}else if(t.data){let e=t.data.slice(0);for(let i=0;i<e.length;i++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[i]=Math.floor(yi(e[i]/255)*255):e[i]=yi(e[i]);return{data:e,width:t.width,height:t.height}}else return kt("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}},zp=0,Ys=class{constructor(t=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:zp++}),this.uuid=ar(),this.data=t,this.dataReady=!0,this.version=0}getSize(t){let e=this.data;return typeof HTMLVideoElement<"u"&&e instanceof HTMLVideoElement?t.set(e.videoWidth,e.videoHeight,0):typeof VideoFrame<"u"&&e instanceof VideoFrame?t.set(e.displayWidth,e.displayHeight,0):e!==null?t.set(e.width,e.height,e.depth||0):t.set(0,0,0),t}set needsUpdate(t){t===!0&&this.version++}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];let i={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let o=0,a=s.length;o<a;o++)s[o].isDataTexture?r.push(yc(s[o].image)):r.push(yc(s[o]))}else r=yc(s);i.url=r}return e||(t.images[this.uuid]=i),i}};function yc(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?Ma.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(kt("Texture: Unable to serialize Texture."),{})}var Vp=0,vc=new L,cn=class n extends zn{constructor(t=n.DEFAULT_IMAGE,e=n.DEFAULT_MAPPING,i=ei,s=ei,r=Ge,o=Zi,a=Dn,c=dn,l=n.DEFAULT_ANISOTROPY,u=bi){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Vp++}),this.uuid=ar(),this.name="",this.source=new Ys(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=i,this.wrapT=s,this.magFilter=r,this.minFilter=o,this.anisotropy=l,this.format=a,this.internalFormat=null,this.type=c,this.offset=new Gt(0,0),this.repeat=new Gt(1,1),this.center=new Gt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Zt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(vc).x}get height(){return this.source.getSize(vc).y}get depth(){return this.source.getSize(vc).z}get image(){return this.source.data}set image(t){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.normalized=t.normalized,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.renderTarget=t.renderTarget,this.isRenderTargetTexture=t.isRenderTargetTexture,this.isArrayTexture=t.isArrayTexture,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}setValues(t){for(let e in t){let i=t[e];if(i===void 0){kt(`Texture.setValues(): parameter '${e}' has value of undefined.`);continue}let s=this[e];if(s===void 0){kt(`Texture.setValues(): property '${e}' does not exist.`);continue}s&&i&&s.isVector2&&i.isVector2||s&&i&&s.isVector3&&i.isVector3||s&&i&&s.isMatrix3&&i.isMatrix3?s.copy(i):this[e]=i}}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];let i={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),e||(t.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==ah)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case xa:t.x=t.x-Math.floor(t.x);break;case ei:t.x=t.x<0?0:1;break;case ya:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case xa:t.y=t.y-Math.floor(t.y);break;case ei:t.y=t.y<0?0:1;break;case ya:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}};cn.DEFAULT_IMAGE=null;cn.DEFAULT_MAPPING=ah;cn.DEFAULT_ANISOTROPY=1;var wh=class wh{constructor(t=0,e=0,i=0,s=1){this.x=t,this.y=e,this.z=i,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,i,s){return this.x=t,this.y=e,this.z=i,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("THREE.Vector4: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){let e=this.x,i=this.y,s=this.z,r=this.w,o=t.elements;return this.x=o[0]*e+o[4]*i+o[8]*s+o[12]*r,this.y=o[1]*e+o[5]*i+o[9]*s+o[13]*r,this.z=o[2]*e+o[6]*i+o[10]*s+o[14]*r,this.w=o[3]*e+o[7]*i+o[11]*s+o[15]*r,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);let e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,i,s,r,c=t.elements,l=c[0],u=c[4],f=c[8],h=c[1],d=c[5],m=c[9],x=c[2],g=c[6],p=c[10];if(Math.abs(u-h)<.01&&Math.abs(f-x)<.01&&Math.abs(m-g)<.01){if(Math.abs(u+h)<.1&&Math.abs(f+x)<.1&&Math.abs(m+g)<.1&&Math.abs(l+d+p-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;let A=(l+1)/2,M=(d+1)/2,T=(p+1)/2,b=(u+h)/4,C=(f+x)/4,y=(m+g)/4;return A>M&&A>T?A<.01?(i=0,s=.707106781,r=.707106781):(i=Math.sqrt(A),s=b/i,r=C/i):M>T?M<.01?(i=.707106781,s=0,r=.707106781):(s=Math.sqrt(M),i=b/s,r=y/s):T<.01?(i=.707106781,s=.707106781,r=0):(r=Math.sqrt(T),i=C/r,s=y/r),this.set(i,s,r,e),this}let S=Math.sqrt((g-m)*(g-m)+(f-x)*(f-x)+(h-u)*(h-u));return Math.abs(S)<.001&&(S=1),this.x=(g-m)/S,this.y=(f-x)/S,this.z=(h-u)/S,this.w=Math.acos((l+d+p-1)/2),this}setFromMatrixPosition(t){let e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=oe(this.x,t.x,e.x),this.y=oe(this.y,t.y,e.y),this.z=oe(this.z,t.z,e.z),this.w=oe(this.w,t.w,e.w),this}clampScalar(t,e){return this.x=oe(this.x,t,e),this.y=oe(this.y,t,e),this.z=oe(this.z,t,e),this.w=oe(this.w,t,e),this}clampLength(t,e){let i=this.length();return this.divideScalar(i||1).multiplyScalar(oe(i,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this.w=t.w+(e.w-t.w)*i,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}};wh.prototype.isVector4=!0;var Ae=wh,Sa=class extends zn{constructor(t=1,e=1,i={}){super(),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Ge,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},i),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=i.depth,this.scissor=new Ae(0,0,t,e),this.scissorTest=!1,this.viewport=new Ae(0,0,t,e),this.textures=[];let s={width:t,height:e,depth:i.depth},r=new cn(s),o=i.count;for(let a=0;a<o;a++)this.textures[a]=r.clone(),this.textures[a].isRenderTargetTexture=!0,this.textures[a].renderTarget=this;this._setTextureOptions(i),this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveColorBuffer=i.resolveColorBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this.storeMultisampledColorBuffer=i.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=i.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=i.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=i.depthTexture,this.samples=i.samples,this.multiview=i.multiview,this.useArrayDepthTexture=i.useArrayDepthTexture}_setTextureOptions(t={}){let e={minFilter:Ge,generateMipmaps:!1,flipY:!1,internalFormat:null};t.mapping!==void 0&&(e.mapping=t.mapping),t.wrapS!==void 0&&(e.wrapS=t.wrapS),t.wrapT!==void 0&&(e.wrapT=t.wrapT),t.wrapR!==void 0&&(e.wrapR=t.wrapR),t.magFilter!==void 0&&(e.magFilter=t.magFilter),t.minFilter!==void 0&&(e.minFilter=t.minFilter),t.format!==void 0&&(e.format=t.format),t.type!==void 0&&(e.type=t.type),t.anisotropy!==void 0&&(e.anisotropy=t.anisotropy),t.colorSpace!==void 0&&(e.colorSpace=t.colorSpace),t.flipY!==void 0&&(e.flipY=t.flipY),t.generateMipmaps!==void 0&&(e.generateMipmaps=t.generateMipmaps),t.internalFormat!==void 0&&(e.internalFormat=t.internalFormat);for(let i=0;i<this.textures.length;i++)this.textures[i].setValues(e)}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}set depthTexture(t){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),t!==null&&t.renderTarget===null&&(t.renderTarget=this),this._depthTexture=t}get depthTexture(){return this._depthTexture}setSize(t,e,i=1){if(this.width!==t||this.height!==e||this.depth!==i){this.width=t,this.height=e,this.depth=i;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=t,this.textures[s].image.height=e,this.textures[s].image.depth=i,this.textures[s].isData3DTexture!==!0&&(this.textures[s].isArrayTexture=this.textures[s].image.depth>1);this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let e=0,i=t.textures.length;e<i;e++){this.textures[e]=t.textures[e].clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;let s=Object.assign({},t.textures[e].image);this.textures[e].source=new Ys(s)}if(this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveColorBuffer=t.resolveColorBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,this.storeMultisampledColorBuffer=t.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=t.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=t.storeMultisampledStencilBuffer,t.depthTexture!==null)if(t.depthTexture.renderTarget===t){let e=t.depthTexture.clone();e.renderTarget=null,this.depthTexture=e}else this.depthTexture=t.depthTexture;return this.samples=t.samples,this.multiview=t.multiview,this.useArrayDepthTexture=t.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}},hn=class extends Sa{constructor(t=1,e=1,i={}){super(t,e,i),this.isWebGLRenderTarget=!0}},Fr=class extends cn{constructor(t=null,e=1,i=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:i,depth:s},this.magFilter=Ve,this.minFilter=Ve,this.wrapR=ei,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(t){return super.copy(t),this.wrapR=t.wrapR,this}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}};var ba=class extends cn{constructor(t=null,e=1,i=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:i,depth:s},this.magFilter=Ve,this.minFilter=Ve,this.wrapR=ei,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(t){return super.copy(t),this.wrapR=t.wrapR,this}};var Xa=class Xa{constructor(t,e,i,s,r,o,a,c,l,u,f,h,d,m,x,g){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,i,s,r,o,a,c,l,u,f,h,d,m,x,g)}set(t,e,i,s,r,o,a,c,l,u,f,h,d,m,x,g){let p=this.elements;return p[0]=t,p[4]=e,p[8]=i,p[12]=s,p[1]=r,p[5]=o,p[9]=a,p[13]=c,p[2]=l,p[6]=u,p[10]=f,p[14]=h,p[3]=d,p[7]=m,p[11]=x,p[15]=g,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Xa().fromArray(this.elements)}copy(t){let e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],e[9]=i[9],e[10]=i[10],e[11]=i[11],e[12]=i[12],e[13]=i[13],e[14]=i[14],e[15]=i[15],this}copyPosition(t){let e=this.elements,i=t.elements;return e[12]=i[12],e[13]=i[13],e[14]=i[14],this}setFromMatrix3(t){let e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,i){return this.determinantAffine()===0?(t.set(1,0,0),e.set(0,1,0),i.set(0,0,1),this):(t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this)}makeBasis(t,e,i){return this.set(t.x,e.x,i.x,0,t.y,e.y,i.y,0,t.z,e.z,i.z,0,0,0,0,1),this}extractRotation(t){if(t.determinantAffine()===0)return this.identity();let e=this.elements,i=t.elements,s=1/Cs.setFromMatrixColumn(t,0).length(),r=1/Cs.setFromMatrixColumn(t,1).length(),o=1/Cs.setFromMatrixColumn(t,2).length();return e[0]=i[0]*s,e[1]=i[1]*s,e[2]=i[2]*s,e[3]=0,e[4]=i[4]*r,e[5]=i[5]*r,e[6]=i[6]*r,e[7]=0,e[8]=i[8]*o,e[9]=i[9]*o,e[10]=i[10]*o,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){let e=this.elements,i=t.x,s=t.y,r=t.z,o=Math.cos(i),a=Math.sin(i),c=Math.cos(s),l=Math.sin(s),u=Math.cos(r),f=Math.sin(r);if(t.order==="XYZ"){let h=o*u,d=o*f,m=a*u,x=a*f;e[0]=c*u,e[4]=-c*f,e[8]=l,e[1]=d+m*l,e[5]=h-x*l,e[9]=-a*c,e[2]=x-h*l,e[6]=m+d*l,e[10]=o*c}else if(t.order==="YXZ"){let h=c*u,d=c*f,m=l*u,x=l*f;e[0]=h+x*a,e[4]=m*a-d,e[8]=o*l,e[1]=o*f,e[5]=o*u,e[9]=-a,e[2]=d*a-m,e[6]=x+h*a,e[10]=o*c}else if(t.order==="ZXY"){let h=c*u,d=c*f,m=l*u,x=l*f;e[0]=h-x*a,e[4]=-o*f,e[8]=m+d*a,e[1]=d+m*a,e[5]=o*u,e[9]=x-h*a,e[2]=-o*l,e[6]=a,e[10]=o*c}else if(t.order==="ZYX"){let h=o*u,d=o*f,m=a*u,x=a*f;e[0]=c*u,e[4]=m*l-d,e[8]=h*l+x,e[1]=c*f,e[5]=x*l+h,e[9]=d*l-m,e[2]=-l,e[6]=a*c,e[10]=o*c}else if(t.order==="YZX"){let h=o*c,d=o*l,m=a*c,x=a*l;e[0]=c*u,e[4]=x-h*f,e[8]=m*f+d,e[1]=f,e[5]=o*u,e[9]=-a*u,e[2]=-l*u,e[6]=d*f+m,e[10]=h-x*f}else if(t.order==="XZY"){let h=o*c,d=o*l,m=a*c,x=a*l;e[0]=c*u,e[4]=-f,e[8]=l*u,e[1]=h*f+x,e[5]=o*u,e[9]=d*f-m,e[2]=m*f-d,e[6]=a*u,e[10]=x*f+h}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(Hp,t,Gp)}lookAt(t,e,i){let s=this.elements;return xn.subVectors(t,e),xn.lengthSq()===0&&(xn.z=1),xn.normalize(),Li.crossVectors(i,xn),Li.lengthSq()===0&&(Math.abs(i.z)===1?xn.x+=1e-4:xn.z+=1e-4,xn.normalize(),Li.crossVectors(i,xn)),Li.normalize(),Bo.crossVectors(xn,Li),s[0]=Li.x,s[4]=Bo.x,s[8]=xn.x,s[1]=Li.y,s[5]=Bo.y,s[9]=xn.y,s[2]=Li.z,s[6]=Bo.z,s[10]=xn.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let i=t.elements,s=e.elements,r=this.elements,o=i[0],a=i[4],c=i[8],l=i[12],u=i[1],f=i[5],h=i[9],d=i[13],m=i[2],x=i[6],g=i[10],p=i[14],S=i[3],A=i[7],M=i[11],T=i[15],b=s[0],C=s[4],y=s[8],w=s[12],P=s[1],F=s[5],B=s[9],V=s[13],I=s[2],k=s[6],W=s[10],J=s[14],et=s[3],U=s[7],q=s[11],j=s[15];return r[0]=o*b+a*P+c*I+l*et,r[4]=o*C+a*F+c*k+l*U,r[8]=o*y+a*B+c*W+l*q,r[12]=o*w+a*V+c*J+l*j,r[1]=u*b+f*P+h*I+d*et,r[5]=u*C+f*F+h*k+d*U,r[9]=u*y+f*B+h*W+d*q,r[13]=u*w+f*V+h*J+d*j,r[2]=m*b+x*P+g*I+p*et,r[6]=m*C+x*F+g*k+p*U,r[10]=m*y+x*B+g*W+p*q,r[14]=m*w+x*V+g*J+p*j,r[3]=S*b+A*P+M*I+T*et,r[7]=S*C+A*F+M*k+T*U,r[11]=S*y+A*B+M*W+T*q,r[15]=S*w+A*V+M*J+T*j,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){let t=this.elements,e=t[0],i=t[4],s=t[8],r=t[12],o=t[1],a=t[5],c=t[9],l=t[13],u=t[2],f=t[6],h=t[10],d=t[14],m=t[3],x=t[7],g=t[11],p=t[15],S=c*d-l*h,A=a*d-l*f,M=a*h-c*f,T=o*d-l*u,b=o*h-c*u,C=o*f-a*u;return e*(x*S-g*A+p*M)-i*(m*S-g*T+p*b)+s*(m*A-x*T+p*C)-r*(m*M-x*b+g*C)}determinantAffine(){let t=this.elements,e=t[0],i=t[4],s=t[8],r=t[1],o=t[5],a=t[9],c=t[2],l=t[6],u=t[10];return e*(o*u-a*l)-i*(r*u-a*c)+s*(r*l-o*c)}transpose(){let t=this.elements,e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,i){let s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=i),this}invert(){let t=this.elements,e=t[0],i=t[1],s=t[2],r=t[3],o=t[4],a=t[5],c=t[6],l=t[7],u=t[8],f=t[9],h=t[10],d=t[11],m=t[12],x=t[13],g=t[14],p=t[15],S=e*a-i*o,A=e*c-s*o,M=e*l-r*o,T=i*c-s*a,b=i*l-r*a,C=s*l-r*c,y=u*x-f*m,w=u*g-h*m,P=u*p-d*m,F=f*g-h*x,B=f*p-d*x,V=h*p-d*g,I=S*V-A*B+M*F+T*P-b*w+C*y;if(I===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let k=1/I;return t[0]=(a*V-c*B+l*F)*k,t[1]=(s*B-i*V-r*F)*k,t[2]=(x*C-g*b+p*T)*k,t[3]=(h*b-f*C-d*T)*k,t[4]=(c*P-o*V-l*w)*k,t[5]=(e*V-s*P+r*w)*k,t[6]=(g*M-m*C-p*A)*k,t[7]=(u*C-h*M+d*A)*k,t[8]=(o*B-a*P+l*y)*k,t[9]=(i*P-e*B-r*y)*k,t[10]=(m*b-x*M+p*S)*k,t[11]=(f*M-u*b-d*S)*k,t[12]=(a*w-o*F-c*y)*k,t[13]=(e*F-i*w+s*y)*k,t[14]=(x*A-m*T-g*S)*k,t[15]=(u*T-f*A+h*S)*k,this}scale(t){let e=this.elements,i=t.x,s=t.y,r=t.z;return e[0]*=i,e[4]*=s,e[8]*=r,e[1]*=i,e[5]*=s,e[9]*=r,e[2]*=i,e[6]*=s,e[10]*=r,e[3]*=i,e[7]*=s,e[11]*=r,this}getMaxScaleOnAxis(){let t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],i=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,i,s))}makeTranslation(t,e,i){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,i,0,0,0,1),this}makeRotationX(t){let e=Math.cos(t),i=Math.sin(t);return this.set(1,0,0,0,0,e,-i,0,0,i,e,0,0,0,0,1),this}makeRotationY(t){let e=Math.cos(t),i=Math.sin(t);return this.set(e,0,i,0,0,1,0,0,-i,0,e,0,0,0,0,1),this}makeRotationZ(t){let e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,0,i,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){let i=Math.cos(e),s=Math.sin(e),r=1-i,o=t.x,a=t.y,c=t.z,l=r*o,u=r*a;return this.set(l*o+i,l*a-s*c,l*c+s*a,0,l*a+s*c,u*a+i,u*c-s*o,0,l*c-s*a,u*c+s*o,r*c*c+i,0,0,0,0,1),this}makeScale(t,e,i){return this.set(t,0,0,0,0,e,0,0,0,0,i,0,0,0,0,1),this}makeShear(t,e,i,s,r,o){return this.set(1,i,r,0,t,1,o,0,e,s,1,0,0,0,0,1),this}compose(t,e,i){let s=this.elements,r=e._x,o=e._y,a=e._z,c=e._w,l=r+r,u=o+o,f=a+a,h=r*l,d=r*u,m=r*f,x=o*u,g=o*f,p=a*f,S=c*l,A=c*u,M=c*f,T=i.x,b=i.y,C=i.z;return s[0]=(1-(x+p))*T,s[1]=(d+M)*T,s[2]=(m-A)*T,s[3]=0,s[4]=(d-M)*b,s[5]=(1-(h+p))*b,s[6]=(g+S)*b,s[7]=0,s[8]=(m+A)*C,s[9]=(g-S)*C,s[10]=(1-(h+x))*C,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,i){let s=this.elements;t.x=s[12],t.y=s[13],t.z=s[14];let r=this.determinantAffine();if(r===0)return i.set(1,1,1),e.identity(),this;let o=Cs.set(s[0],s[1],s[2]).length(),a=Cs.set(s[4],s[5],s[6]).length(),c=Cs.set(s[8],s[9],s[10]).length();r<0&&(o=-o),Fn.copy(this);let l=1/o,u=1/a,f=1/c;return Fn.elements[0]*=l,Fn.elements[1]*=l,Fn.elements[2]*=l,Fn.elements[4]*=u,Fn.elements[5]*=u,Fn.elements[6]*=u,Fn.elements[8]*=f,Fn.elements[9]*=f,Fn.elements[10]*=f,e.setFromRotationMatrix(Fn),i.x=o,i.y=a,i.z=c,this}makePerspective(t,e,i,s,r,o,a=kn,c=!1){let l=this.elements,u=2*r/(e-t),f=2*r/(i-s),h=(e+t)/(e-t),d=(i+s)/(i-s),m,x;if(c)m=r/(o-r),x=o*r/(o-r);else if(a===kn)m=-(o+r)/(o-r),x=-2*o*r/(o-r);else if(a===Ws)m=-o/(o-r),x=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return l[0]=u,l[4]=0,l[8]=h,l[12]=0,l[1]=0,l[5]=f,l[9]=d,l[13]=0,l[2]=0,l[6]=0,l[10]=m,l[14]=x,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(t,e,i,s,r,o,a=kn,c=!1){let l=this.elements,u=2/(e-t),f=2/(i-s),h=-(e+t)/(e-t),d=-(i+s)/(i-s),m,x;if(c)m=1/(o-r),x=o/(o-r);else if(a===kn)m=-2/(o-r),x=-(o+r)/(o-r);else if(a===Ws)m=-1/(o-r),x=-r/(o-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return l[0]=u,l[4]=0,l[8]=0,l[12]=h,l[1]=0,l[5]=f,l[9]=0,l[13]=d,l[2]=0,l[6]=0,l[10]=m,l[14]=x,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(t){let e=this.elements,i=t.elements;for(let s=0;s<16;s++)if(e[s]!==i[s])return!1;return!0}fromArray(t,e=0){for(let i=0;i<16;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){let i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t[e+9]=i[9],t[e+10]=i[10],t[e+11]=i[11],t[e+12]=i[12],t[e+13]=i[13],t[e+14]=i[14],t[e+15]=i[15],t}};Xa.prototype.isMatrix4=!0;var we=Xa,Cs=new L,Fn=new we,Hp=new L(0,0,0),Gp=new L(1,1,1),Li=new L,Bo=new L,xn=new L,Ju=new we,$u=new Mn,vi=class n{constructor(t=0,e=0,i=0,s=n.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=i,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,i,s=this._order){return this._x=t,this._y=e,this._z=i,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,i=!0){let s=t.elements,r=s[0],o=s[4],a=s[8],c=s[1],l=s[5],u=s[9],f=s[2],h=s[6],d=s[10];switch(e){case"XYZ":this._y=Math.asin(oe(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-u,d),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(h,l),this._z=0);break;case"YXZ":this._x=Math.asin(-oe(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(a,d),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-f,r),this._z=0);break;case"ZXY":this._x=Math.asin(oe(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(-f,d),this._z=Math.atan2(-o,l)):(this._y=0,this._z=Math.atan2(c,r));break;case"ZYX":this._y=Math.asin(-oe(f,-1,1)),Math.abs(f)<.9999999?(this._x=Math.atan2(h,d),this._z=Math.atan2(c,r)):(this._x=0,this._z=Math.atan2(-o,l));break;case"YZX":this._z=Math.asin(oe(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-u,l),this._y=Math.atan2(-f,r)):(this._x=0,this._y=Math.atan2(a,d));break;case"XZY":this._z=Math.asin(-oe(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(h,l),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-u,d),this._y=0);break;default:kt("Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,i===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,i){return Ju.makeRotationFromQuaternion(t),this.setFromRotationMatrix(Ju,e,i)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return $u.setFromEuler(this),this.setFromQuaternion($u,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};vi.DEFAULT_ORDER="XYZ";var Or=class{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}},Wp=0,Ku=new L,Rs=new Mn,di=new we,ko=new L,wr=new L,Xp=new L,qp=new Mn,ju=new L(1,0,0),Qu=new L(0,1,0),td=new L(0,0,1),ed={type:"added"},Yp={type:"removed"},Ps={type:"childadded",child:null},Mc={type:"childremoved",child:null},He=class n extends zn{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Wp++}),this.uuid=ar(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=n.DEFAULT_UP.clone();let t=new L,e=new vi,i=new Mn,s=new L(1,1,1);function r(){i.setFromEuler(e,!1)}function o(){e.setFromQuaternion(i,void 0,!1)}e._onChange(r),i._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new we},normalMatrix:{value:new Zt}}),this.matrix=new we,this.matrixWorld=new we,this.matrixAutoUpdate=n.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=n.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Or,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return Rs.setFromAxisAngle(t,e),this.quaternion.multiply(Rs),this}rotateOnWorldAxis(t,e){return Rs.setFromAxisAngle(t,e),this.quaternion.premultiply(Rs),this}rotateX(t){return this.rotateOnAxis(ju,t)}rotateY(t){return this.rotateOnAxis(Qu,t)}rotateZ(t){return this.rotateOnAxis(td,t)}translateOnAxis(t,e){return Ku.copy(t).applyQuaternion(this.quaternion),this.position.add(Ku.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(ju,t)}translateY(t){return this.translateOnAxis(Qu,t)}translateZ(t){return this.translateOnAxis(td,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(di.copy(this.matrixWorld).invert())}lookAt(t,e,i){t.isVector3?ko.copy(t):ko.set(t,e,i);let s=this.parent;this.updateWorldMatrix(!0,!1),wr.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?di.lookAt(wr,ko,this.up):di.lookAt(ko,wr,this.up),this.quaternion.setFromRotationMatrix(di),s&&(di.extractRotation(s.matrixWorld),Rs.setFromRotationMatrix(di),this.quaternion.premultiply(Rs.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(Wt("Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(ed),Ps.child=t,this.dispatchEvent(Ps),Ps.child=null):Wt("Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}let e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(Yp),Mc.child=t,this.dispatchEvent(Mc),Mc.child=null),this}removeFromParent(){let t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),di.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),di.multiply(t.parent.matrixWorld)),t.applyMatrix4(di),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(ed),Ps.child=t,this.dispatchEvent(Ps),Ps.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let i=0,s=this.children.length;i<s;i++){let o=this.children[i].getObjectByProperty(t,e);if(o!==void 0)return o}}getObjectsByProperty(t,e,i=[]){this[t]===e&&i.push(this);let s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].getObjectsByProperty(t,e,i);return i}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(wr,t,Xp),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(wr,qp,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);let e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}intersectsFrustum(){}traverse(t){t(this);let e=this.children;for(let i=0,s=e.length;i<s;i++)e[i].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);let e=this.children;for(let i=0,s=e.length;i<s;i++)e[i].traverseVisible(t)}traverseAncestors(t){let e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);let t=this.pivot;if(t!==null){let e=t.x,i=t.y,s=t.z,r=this.matrix.elements;r[12]+=e-r[0]*e-r[4]*i-r[8]*s,r[13]+=i-r[1]*e-r[5]*i-r[9]*s,r[14]+=s-r[2]*e-r[6]*i-r[10]*s}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);let e=this.children;for(let i=0,s=e.length;i<s;i++)e[i].updateMatrixWorld(t)}updateWorldMatrix(t,e,i=!1){let s=this.parent;if(t===!0&&s!==null&&s.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||i)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,i=!0),e===!0){let r=this.children;for(let o=0,a=r.length;o<a;o++)r[o].updateWorldMatrix(!1,!0,i)}}toJSON(t){let e=t===void 0||typeof t=="string",i={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});let s={};s.uuid=this.uuid,s.type=this.type,s.name=this.name,s.castShadow=this.castShadow,s.receiveShadow=this.receiveShadow,s.visible=this.visible,s.frustumCulled=this.frustumCulled,s.renderOrder=this.renderOrder,s.static=this.static,s.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.pivot!==null&&(s.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(s.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(s.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(a=>({...a,boundingBox:a.boundingBox?a.boundingBox.toJSON():void 0,boundingSphere:a.boundingSphere?a.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(a=>({...a})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(t),s.indirectTexture=this._indirectTexture.toJSON(t),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(a,c){return a[c.uuid]===void 0&&(a[c.uuid]=c.toJSON(t)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(t.geometries,this.geometry);let a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){let c=a.shapes;if(Array.isArray(c))for(let l=0,u=c.length;l<u;l++){let f=c[l];r(t.shapes,f)}else r(t.shapes,c)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let a=[];for(let c=0,l=this.material.length;c<l;c++)a.push(r(t.materials,this.material[c]));s.material=a}else s.material=r(t.materials,this.material);if(this.children.length>0){s.children=[];for(let a=0;a<this.children.length;a++)s.children.push(this.children[a].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let a=0;a<this.animations.length;a++){let c=this.animations[a];s.animations.push(r(t.animations,c))}}if(e){let a=o(t.geometries),c=o(t.materials),l=o(t.textures),u=o(t.images),f=o(t.shapes),h=o(t.skeletons),d=o(t.animations),m=o(t.nodes);a.length>0&&(i.geometries=a),c.length>0&&(i.materials=c),l.length>0&&(i.textures=l),u.length>0&&(i.images=u),f.length>0&&(i.shapes=f),h.length>0&&(i.skeletons=h),d.length>0&&(i.animations=d),m.length>0&&(i.nodes=m)}return i.object=s,i;function o(a){let c=[];for(let l in a){let u=a[l];delete u.metadata,c.push(u)}return c}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.pivot=t.pivot!==null?t.pivot.clone():null,this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.static=t.static,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let i=0;i<t.children.length;i++){let s=t.children[i];this.add(s.clone())}return this}dispose(){this.dispatchEvent({type:"dispose"})}};He.DEFAULT_UP=new L(0,1,0);He.DEFAULT_MATRIX_AUTO_UPDATE=!0;He.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var xi=class extends He{constructor(){super(),this.isGroup=!0,this.type="Group"}},Zp={type:"move"},Zs=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new xi,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new xi,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new L,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new L),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new xi,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new L,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new L,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){let e=this._hand;if(e)for(let i of t.hand.values())this._getHandJoint(e,i)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,i){let s=null,r=null,o=null,a=this._targetRay,c=this._grip,l=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(l&&t.hand){o=!0;for(let x of t.hand.values()){let g=e.getJointPose(x,i),p=this._getHandJoint(l,x);g!==null&&(p.matrix.fromArray(g.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=g.radius),p.visible=g!==null}let u=l.joints["index-finger-tip"],f=l.joints["thumb-tip"],h=u.position.distanceTo(f.position),d=.02,m=.005;l.inputState.pinching&&h>d+m?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!l.inputState.pinching&&h<=d-m&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else c!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,i),r!==null&&(c.matrix.fromArray(r.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,r.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(r.linearVelocity)):c.hasLinearVelocity=!1,r.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(r.angularVelocity)):c.hasAngularVelocity=!1,c.eventsEnabled&&c.dispatchEvent({type:"gripUpdated",data:t,target:this})));a!==null&&(s=e.getPose(t.targetRaySpace,i),s===null&&r!==null&&(s=r),s!==null&&(a.matrix.fromArray(s.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,s.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(s.linearVelocity)):a.hasLinearVelocity=!1,s.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(s.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(Zp)))}return a!==null&&(a.visible=s!==null),c!==null&&(c.visible=r!==null),l!==null&&(l.visible=o!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){let i=new xi;i.matrixAutoUpdate=!1,i.visible=!1,t.joints[e.jointName]=i,t.add(i)}return t.joints[e.jointName]}},nf={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Di={h:0,s:0,l:0},zo={h:0,s:0,l:0};function Sc(n,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?n+(t-n)*6*e:e<1/2?t:e<2/3?n+(t-n)*6*(2/3-e):n}var te=class{constructor(t,e,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,i)}set(t,e,i){if(e===void 0&&i===void 0){let s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,i);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=Qe){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,he.colorSpaceToWorking(this,e),this}setRGB(t,e,i,s=he.workingColorSpace){return this.r=t,this.g=e,this.b=i,he.colorSpaceToWorking(this,s),this}setHSL(t,e,i,s=he.workingColorSpace){if(t=_h(t,1),e=oe(e,0,1),i=oe(i,0,1),e===0)this.r=this.g=this.b=i;else{let r=i<=.5?i*(1+e):i+e-i*e,o=2*i-r;this.r=Sc(o,r,t+1/3),this.g=Sc(o,r,t),this.b=Sc(o,r,t-1/3)}return he.colorSpaceToWorking(this,s),this}setStyle(t,e=Qe){function i(r){r!==void 0&&parseFloat(r)<1&&kt("Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let r,o=s[1],a=s[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:kt("Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){let r=s[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(o===6)return this.setHex(parseInt(r,16),e);kt("Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=Qe){let i=nf[t.toLowerCase()];return i!==void 0?this.setHex(i,e):kt("Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=yi(t.r),this.g=yi(t.g),this.b=yi(t.b),this}copyLinearToSRGB(t){return this.r=Hs(t.r),this.g=Hs(t.g),this.b=Hs(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=Qe){return he.workingToColorSpace(qe.copy(this),t),Math.round(oe(qe.r*255,0,255))*65536+Math.round(oe(qe.g*255,0,255))*256+Math.round(oe(qe.b*255,0,255))}getHexString(t=Qe){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=he.workingColorSpace){he.workingToColorSpace(qe.copy(this),e);let i=qe.r,s=qe.g,r=qe.b,o=Math.max(i,s,r),a=Math.min(i,s,r),c,l,u=(a+o)/2;if(a===o)c=0,l=0;else{let f=o-a;switch(l=u<=.5?f/(o+a):f/(2-o-a),o){case i:c=(s-r)/f+(s<r?6:0);break;case s:c=(r-i)/f+2;break;case r:c=(i-s)/f+4;break}c/=6}return t.h=c,t.s=l,t.l=u,t}getRGB(t,e=he.workingColorSpace){return he.workingToColorSpace(qe.copy(this),e),t.r=qe.r,t.g=qe.g,t.b=qe.b,t}getStyle(t=Qe){he.workingToColorSpace(qe.copy(this),t);let e=qe.r,i=qe.g,s=qe.b;return t!==Qe?`color(${t} ${e.toFixed(3)} ${i.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(i*255)},${Math.round(s*255)})`}offsetHSL(t,e,i){return this.getHSL(Di),this.setHSL(Di.h+t,Di.s+e,Di.l+i)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,i){return this.r=t.r+(e.r-t.r)*i,this.g=t.g+(e.g-t.g)*i,this.b=t.b+(e.b-t.b)*i,this}lerpHSL(t,e){this.getHSL(Di),t.getHSL(zo);let i=Ir(Di.h,zo.h,e),s=Ir(Di.s,zo.s,e),r=Ir(Di.l,zo.l,e);return this.setHSL(i,s,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){let e=this.r,i=this.g,s=this.b,r=t.elements;return this.r=r[0]*e+r[3]*i+r[6]*s,this.g=r[1]*e+r[4]*i+r[7]*s,this.b=r[2]*e+r[5]*i+r[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},qe=new te;te.NAMES=nf;var Br=class extends He{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new vi,this.environmentIntensity=1,this.environmentRotation=new vi,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){let e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),e.object.backgroundBlurriness=this.backgroundBlurriness,e.object.backgroundIntensity=this.backgroundIntensity,e.object.backgroundRotation=this.backgroundRotation.toArray(),e.object.environmentIntensity=this.environmentIntensity,e.object.environmentRotation=this.environmentRotation.toArray(),e}},On=new L,fi=new L,bc=new L,pi=new L,Is=new L,Ls=new L,nd=new L,Tc=new L,Ec=new L,wc=new L,Ac=new Ae,Cc=new Ae,Rc=new Ae,_i=class n{constructor(t=new L,e=new L,i=new L){this.a=t,this.b=e,this.c=i}static getNormal(t,e,i,s){s.subVectors(i,e),On.subVectors(t,e),s.cross(On);let r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(t,e,i,s,r){On.subVectors(s,e),fi.subVectors(i,e),bc.subVectors(t,e);let o=On.dot(On),a=On.dot(fi),c=On.dot(bc),l=fi.dot(fi),u=fi.dot(bc),f=o*l-a*a;if(f===0)return r.set(0,0,0),null;let h=1/f,d=(l*c-a*u)*h,m=(o*u-a*c)*h;return r.set(1-d-m,m,d)}static containsPoint(t,e,i,s){return this.getBarycoord(t,e,i,s,pi)===null?!1:pi.x>=0&&pi.y>=0&&pi.x+pi.y<=1}static getInterpolation(t,e,i,s,r,o,a,c){return this.getBarycoord(t,e,i,s,pi)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(r,pi.x),c.addScaledVector(o,pi.y),c.addScaledVector(a,pi.z),c)}static getInterpolatedAttribute(t,e,i,s,r,o){return Ac.setScalar(0),Cc.setScalar(0),Rc.setScalar(0),Ac.fromBufferAttribute(t,e),Cc.fromBufferAttribute(t,i),Rc.fromBufferAttribute(t,s),o.setScalar(0),o.addScaledVector(Ac,r.x),o.addScaledVector(Cc,r.y),o.addScaledVector(Rc,r.z),o}static isFrontFacing(t,e,i,s){return On.subVectors(i,e),fi.subVectors(t,e),On.cross(fi).dot(s)<0}set(t,e,i){return this.a.copy(t),this.b.copy(e),this.c.copy(i),this}setFromPointsAndIndices(t,e,i,s){return this.a.copy(t[e]),this.b.copy(t[i]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,i,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,i),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return On.subVectors(this.c,this.b),fi.subVectors(this.a,this.b),On.cross(fi).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return n.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return n.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,i,s,r){return n.getInterpolation(t,this.a,this.b,this.c,e,i,s,r)}containsPoint(t){return n.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return n.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){let i=this.a,s=this.b,r=this.c,o,a;Is.subVectors(s,i),Ls.subVectors(r,i),Tc.subVectors(t,i);let c=Is.dot(Tc),l=Ls.dot(Tc);if(c<=0&&l<=0)return e.copy(i);Ec.subVectors(t,s);let u=Is.dot(Ec),f=Ls.dot(Ec);if(u>=0&&f<=u)return e.copy(s);let h=c*f-u*l;if(h<=0&&c>=0&&u<=0)return o=c/(c-u),e.copy(i).addScaledVector(Is,o);wc.subVectors(t,r);let d=Is.dot(wc),m=Ls.dot(wc);if(m>=0&&d<=m)return e.copy(r);let x=d*l-c*m;if(x<=0&&l>=0&&m<=0)return a=l/(l-m),e.copy(i).addScaledVector(Ls,a);let g=u*m-d*f;if(g<=0&&f-u>=0&&d-m>=0)return nd.subVectors(r,s),a=(f-u)/(f-u+(d-m)),e.copy(s).addScaledVector(nd,a);let p=1/(g+x+h);return o=x*p,a=h*p,e.copy(i).addScaledVector(Is,o).addScaledVector(Ls,a)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}},Oi=class{constructor(t=new L(1/0,1/0,1/0),e=new L(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e+=3)this.expandByPoint(Bn.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,i=t.count;e<i;e++)this.expandByPoint(Bn.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){let i=Bn.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(i),this.max.copy(t).add(i),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);let i=t.geometry;if(i!==void 0){let r=i.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let o=0,a=r.count;o<a;o++)t.isMesh===!0?t.getVertexPosition(o,Bn):Bn.fromBufferAttribute(r,o),Bn.applyMatrix4(t.matrixWorld),this.expandByPoint(Bn);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),Vo.copy(t.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),Vo.copy(i.boundingBox)),Vo.applyMatrix4(t.matrixWorld),this.union(Vo)}let s=t.children;for(let r=0,o=s.length;r<o;r++)this.expandByObject(s[r],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,Bn),Bn.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,i;return t.normal.x>0?(e=t.normal.x*this.min.x,i=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,i=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,i+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,i+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,i+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,i+=t.normal.z*this.min.z),e<=-t.constant&&i>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(Ar),Ho.subVectors(this.max,Ar),Ds.subVectors(t.a,Ar),Ns.subVectors(t.b,Ar),Us.subVectors(t.c,Ar),Ni.subVectors(Ns,Ds),Ui.subVectors(Us,Ns),rs.subVectors(Ds,Us);let e=[0,-Ni.z,Ni.y,0,-Ui.z,Ui.y,0,-rs.z,rs.y,Ni.z,0,-Ni.x,Ui.z,0,-Ui.x,rs.z,0,-rs.x,-Ni.y,Ni.x,0,-Ui.y,Ui.x,0,-rs.y,rs.x,0];return!Pc(e,Ds,Ns,Us,Ho)||(e=[1,0,0,0,1,0,0,0,1],!Pc(e,Ds,Ns,Us,Ho))?!1:(Go.crossVectors(Ni,Ui),e=[Go.x,Go.y,Go.z],Pc(e,Ds,Ns,Us,Ho))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,Bn).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(Bn).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(mi[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),mi[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),mi[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),mi[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),mi[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),mi[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),mi[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),mi[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(mi),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(t){return this.min.fromArray(t.min),this.max.fromArray(t.max),this}},mi=[new L,new L,new L,new L,new L,new L,new L,new L],Bn=new L,Vo=new Oi,Ds=new L,Ns=new L,Us=new L,Ni=new L,Ui=new L,rs=new L,Ar=new L,Ho=new L,Go=new L,os=new L;function Pc(n,t,e,i,s){for(let r=0,o=n.length-3;r<=o;r+=3){os.fromArray(n,r);let a=s.x*Math.abs(os.x)+s.y*Math.abs(os.y)+s.z*Math.abs(os.z),c=t.dot(os),l=e.dot(os),u=i.dot(os);if(Math.max(-Math.max(c,l,u),Math.min(c,l,u))>a)return!1}return!0}var De=new L,Wo=new Gt,Jp=0,In=class extends zn{constructor(t,e,i=!1){if(super(),Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Jp++}),this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=i,this.usage=Kd,this.updateRanges=[],this.gpuType=Gn,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,i){t*=this.itemSize,i*=e.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[t+s]=e.array[i+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,i=this.count;e<i;e++)Wo.fromBufferAttribute(this,e),Wo.applyMatrix3(t),this.setXY(e,Wo.x,Wo.y);else if(this.itemSize===3)for(let e=0,i=this.count;e<i;e++)De.fromBufferAttribute(this,e),De.applyMatrix3(t),this.setXYZ(e,De.x,De.y,De.z);return this}applyMatrix4(t){for(let e=0,i=this.count;e<i;e++)De.fromBufferAttribute(this,e),De.applyMatrix4(t),this.setXYZ(e,De.x,De.y,De.z);return this}applyNormalMatrix(t){for(let e=0,i=this.count;e<i;e++)De.fromBufferAttribute(this,e),De.applyNormalMatrix(t),this.setXYZ(e,De.x,De.y,De.z);return this}transformDirection(t){for(let e=0,i=this.count;e<i;e++)De.fromBufferAttribute(this,e),De.transformDirection(t),this.setXYZ(e,De.x,De.y,De.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let i=this.array[t*this.itemSize+e];return this.normalized&&(i=zs(i,this.array)),i}setComponent(t,e,i){return this.normalized&&(i=je(i,this.array)),this.array[t*this.itemSize+e]=i,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=zs(e,this.array)),e}setX(t,e){return this.normalized&&(e=je(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=zs(e,this.array)),e}setY(t,e){return this.normalized&&(e=je(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=zs(e,this.array)),e}setZ(t,e){return this.normalized&&(e=je(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=zs(e,this.array)),e}setW(t,e){return this.normalized&&(e=je(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,i){return t*=this.itemSize,this.normalized&&(e=je(e,this.array),i=je(i,this.array)),this.array[t+0]=e,this.array[t+1]=i,this}setXYZ(t,e,i,s){return t*=this.itemSize,this.normalized&&(e=je(e,this.array),i=je(i,this.array),s=je(s,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=s,this}setXYZW(t,e,i,s,r){return t*=this.itemSize,this.normalized&&(e=je(e,this.array),i=je(i,this.array),s=je(s,this.array),r=je(r,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=s,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return t.name=this.name,t.usage=this.usage,t.gpuType=this.gpuType,t}dispose(){this.dispatchEvent({type:"dispose"})}};var kr=class extends In{constructor(t,e,i){super(new Uint16Array(t),e,i)}};var zr=class extends In{constructor(t,e,i){super(new Uint32Array(t),e,i)}};var be=class extends In{constructor(t,e,i){super(new Float32Array(t),e,i)}},$p=new Oi,Cr=new L,Ic=new L,hs=class{constructor(t=new L,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){let i=this.center;e!==void 0?i.copy(e):$p.setFromPoints(t).getCenter(i);let s=0;for(let r=0,o=t.length;r<o;r++)s=Math.max(s,i.distanceToSquared(t[r]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){let e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){let i=this.center.distanceToSquared(t);return e.copy(t),i>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;Cr.subVectors(t,this.center);let e=Cr.lengthSq();if(e>this.radius*this.radius){let i=Math.sqrt(e),s=(i-this.radius)*.5;this.center.addScaledVector(Cr,s/i),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(Ic.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(Cr.copy(t.center).add(Ic)),this.expandByPoint(Cr.copy(t.center).sub(Ic))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(t){return this.radius=t.radius,this.center.fromArray(t.center),this}},Kp=0,Pn=new we,Lc=new He,Fs=new L,yn=new Oi,Rr=new Oi,ze=new L,Ne=class n extends zn{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Kp++}),this.uuid=ar(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(Mp(t)?zr:kr)(t,1):this.index=t,this}setIndirect(t,e=0){return this.indirect=t,this.indirectOffset=e,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,i=0){this.groups.push({start:t,count:e,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){let e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);let i=this.attributes.normal;if(i!==void 0){let r=new Zt().getNormalMatrix(t);i.applyNormalMatrix(r),i.needsUpdate=!0}let s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(t){return Pn.makeRotationFromQuaternion(t),this.applyMatrix4(Pn),this}rotateX(t){return Pn.makeRotationX(t),this.applyMatrix4(Pn),this}rotateY(t){return Pn.makeRotationY(t),this.applyMatrix4(Pn),this}rotateZ(t){return Pn.makeRotationZ(t),this.applyMatrix4(Pn),this}translate(t,e,i){return Pn.makeTranslation(t,e,i),this.applyMatrix4(Pn),this}scale(t,e,i){return Pn.makeScale(t,e,i),this.applyMatrix4(Pn),this}lookAt(t){return Lc.lookAt(t),Lc.updateMatrix(),this.applyMatrix4(Lc.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Fs).negate(),this.translate(Fs.x,Fs.y,Fs.z),this}setFromPoints(t){let e=this.getAttribute("position");if(e===void 0){let i=[];for(let s=0,r=t.length;s<r;s++){let o=t[s];i.push(o.x,o.y,o.z||0)}this.setAttribute("position",new be(i,3))}else{let i=Math.min(t.length,e.count);for(let s=0;s<i;s++){let r=t[s];e.setXYZ(s,r.x,r.y,r.z||0)}t.length>e.count&&kt("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Oi);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){Wt("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new L(-1/0,-1/0,-1/0),new L(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let i=0,s=e.length;i<s;i++){let r=e[i];yn.setFromBufferAttribute(r),this.morphTargetsRelative?(ze.addVectors(this.boundingBox.min,yn.min),this.boundingBox.expandByPoint(ze),ze.addVectors(this.boundingBox.max,yn.max),this.boundingBox.expandByPoint(ze)):(this.boundingBox.expandByPoint(yn.min),this.boundingBox.expandByPoint(yn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&Wt('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new hs);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){Wt("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new L,1/0);return}if(t){let i=this.boundingSphere.center;if(yn.setFromBufferAttribute(t),e)for(let r=0,o=e.length;r<o;r++){let a=e[r];Rr.setFromBufferAttribute(a),this.morphTargetsRelative?(ze.addVectors(yn.min,Rr.min),yn.expandByPoint(ze),ze.addVectors(yn.max,Rr.max),yn.expandByPoint(ze)):(yn.expandByPoint(Rr.min),yn.expandByPoint(Rr.max))}yn.getCenter(i);let s=0;for(let r=0,o=t.count;r<o;r++)ze.fromBufferAttribute(t,r),s=Math.max(s,i.distanceToSquared(ze));if(e)for(let r=0,o=e.length;r<o;r++){let a=e[r],c=this.morphTargetsRelative;for(let l=0,u=a.count;l<u;l++)ze.fromBufferAttribute(a,l),c&&(Fs.fromBufferAttribute(t,l),ze.add(Fs)),s=Math.max(s,i.distanceToSquared(ze))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&Wt('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){Wt("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let i=e.position,s=e.normal,r=e.uv,o=this.getAttribute("tangent");(o===void 0||o.count!==i.count)&&(o=new In(new Float32Array(4*i.count),4),this.setAttribute("tangent",o));let a=[],c=[];for(let y=0;y<i.count;y++)a[y]=new L,c[y]=new L;let l=new L,u=new L,f=new L,h=new Gt,d=new Gt,m=new Gt,x=new L,g=new L;function p(y,w,P){l.fromBufferAttribute(i,y),u.fromBufferAttribute(i,w),f.fromBufferAttribute(i,P),h.fromBufferAttribute(r,y),d.fromBufferAttribute(r,w),m.fromBufferAttribute(r,P),u.sub(l),f.sub(l),d.sub(h),m.sub(h);let F=1/(d.x*m.y-m.x*d.y);isFinite(F)&&(x.copy(u).multiplyScalar(m.y).addScaledVector(f,-d.y).multiplyScalar(F),g.copy(f).multiplyScalar(d.x).addScaledVector(u,-m.x).multiplyScalar(F),a[y].add(x),a[w].add(x),a[P].add(x),c[y].add(g),c[w].add(g),c[P].add(g))}let S=this.groups;S.length===0&&(S=[{start:0,count:t.count}]);for(let y=0,w=S.length;y<w;++y){let P=S[y],F=P.start,B=P.count;for(let V=F,I=F+B;V<I;V+=3)p(t.getX(V+0),t.getX(V+1),t.getX(V+2))}let A=new L,M=new L,T=new L,b=new L;function C(y){T.fromBufferAttribute(s,y),b.copy(T);let w=a[y];A.copy(w),A.sub(T.multiplyScalar(T.dot(w))).normalize(),M.crossVectors(b,w);let F=M.dot(c[y])<0?-1:1;o.setXYZW(y,A.x,A.y,A.z,F)}for(let y=0,w=S.length;y<w;++y){let P=S[y],F=P.start,B=P.count;for(let V=F,I=F+B;V<I;V+=3)C(t.getX(V+0)),C(t.getX(V+1)),C(t.getX(V+2))}this._transformed=!0}computeVertexNormals(){let t=this.index,e=this.getAttribute("position");if(e!==void 0){let i=this.getAttribute("normal");if(i===void 0||i.count!==e.count)i=new In(new Float32Array(e.count*3),3),this.setAttribute("normal",i);else for(let h=0,d=i.count;h<d;h++)i.setXYZ(h,0,0,0);let s=new L,r=new L,o=new L,a=new L,c=new L,l=new L,u=new L,f=new L;if(t)for(let h=0,d=t.count;h<d;h+=3){let m=t.getX(h+0),x=t.getX(h+1),g=t.getX(h+2);s.fromBufferAttribute(e,m),r.fromBufferAttribute(e,x),o.fromBufferAttribute(e,g),u.subVectors(o,r),f.subVectors(s,r),u.cross(f),a.fromBufferAttribute(i,m),c.fromBufferAttribute(i,x),l.fromBufferAttribute(i,g),a.add(u),c.add(u),l.add(u),i.setXYZ(m,a.x,a.y,a.z),i.setXYZ(x,c.x,c.y,c.z),i.setXYZ(g,l.x,l.y,l.z)}else for(let h=0,d=e.count;h<d;h+=3)s.fromBufferAttribute(e,h+0),r.fromBufferAttribute(e,h+1),o.fromBufferAttribute(e,h+2),u.subVectors(o,r),f.subVectors(s,r),u.cross(f),i.setXYZ(h+0,u.x,u.y,u.z),i.setXYZ(h+1,u.x,u.y,u.z),i.setXYZ(h+2,u.x,u.y,u.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){let t=this.attributes.normal;for(let e=0,i=t.count;e<i;e++)ze.fromBufferAttribute(t,e),ze.normalize(),t.setXYZ(e,ze.x,ze.y,ze.z)}toNonIndexed(){function t(a,c){let l=a.array,u=a.itemSize,f=a.normalized,h=new l.constructor(c.length*u),d=0,m=0;for(let x=0,g=c.length;x<g;x++){a.isInterleavedBufferAttribute?d=c[x]*a.data.stride+a.offset:d=c[x]*u;for(let p=0;p<u;p++)h[m++]=l[d++]}return new In(h,u,f)}if(this.index===null)return kt("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let e=new n,i=this.index.array,s=this.attributes;for(let a in s){let c=s[a],l=t(c,i);e.setAttribute(a,l)}let r=this.morphAttributes;for(let a in r){let c=[],l=r[a];for(let u=0,f=l.length;u<f;u++){let h=l[u],d=t(h,i);c.push(d)}e.morphAttributes[a]=c}e.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let a=0,c=o.length;a<c;a++){let l=o[a];e.addGroup(l.start,l.count,l.materialIndex)}return e}toJSON(){let t={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,t.name=this.name,Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){let c=this.parameters;for(let l in c)c[l]!==void 0&&(t[l]=c[l]);return t}t.data={attributes:{}};let e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});let i=this.attributes;for(let c in i){let l=i[c];t.data.attributes[c]=l.toJSON(t.data)}let s={},r=!1;for(let c in this.morphAttributes){let l=this.morphAttributes[c],u=[];for(let f=0,h=l.length;f<h;f++){let d=l[f];u.push(d.toJSON(t.data))}u.length>0&&(s[c]=u,r=!0)}r&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);let o=this.groups;o.length>0&&(t.data.groups=JSON.parse(JSON.stringify(o)));let a=this.boundingSphere;return a!==null&&(t.data.boundingSphere=a.toJSON()),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let e={};this.name=t.name;let i=t.index;i!==null&&this.setIndex(i.clone());let s=t.attributes;for(let l in s){let u=s[l];this.setAttribute(l,u.clone(e))}let r=t.morphAttributes;for(let l in r){let u=[],f=r[l];for(let h=0,d=f.length;h<d;h++)u.push(f[h].clone(e));this.morphAttributes[l]=u}this.morphTargetsRelative=t.morphTargetsRelative;let o=t.groups;for(let l=0,u=o.length;l<u;l++){let f=o[l];this.addGroup(f.start,f.count,f.materialIndex)}let a=t.boundingBox;a!==null&&(this.boundingBox=a.clone());let c=t.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this._transformed=t._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}};var Dc=new L,jp=new L,Qp=new Zt,vn=class{constructor(t=new L(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,i,s){return this.normal.set(t,e,i),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,i){let s=Dc.subVectors(i,e).cross(jp.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){let t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e,i=!0){let s=t.delta(Dc),r=this.normal.dot(s);if(r===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;let o=-(t.start.dot(this.normal)+this.constant)/r;return i===!0&&(o<0||o>1)?null:e.copy(t.start).addScaledVector(s,o)}intersectsLine(t){let e=this.distanceToPoint(t.start),i=this.distanceToPoint(t.end);return e<0&&i>0||i<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){let i=e||Qp.getNormalMatrix(t),s=this.coplanarPoint(Dc).applyMatrix4(t),r=this.normal.applyMatrix3(i).normalize();return this.constant=-s.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(t){return this.normal.fromArray(t.normal),this.constant=t.constant,this}},tm=0,Mi=class extends zn{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:tm++}),this.uuid=ar(),this.name="",this.type="Material",this.blending=sr,this.side=qi,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=jc,this.blendDst=Qc,this.blendEquation=fs,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new te(0,0,0),this.blendAlpha=0,this.depthFunc=Gs,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Wd,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=ha,this.stencilZFail=ha,this.stencilZPass=ha,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(let e in t){let i=t[e];if(i===void 0){kt(`Material: parameter '${e}' has value of undefined.`);continue}let s=this[e];if(s===void 0){kt(`Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(i):s&&s.isVector2&&i&&i.isVector2||s&&s.isEuler&&i&&i.isEuler||s&&s.isVector3&&i&&i.isVector3?s.copy(i):this[e]=i}}toJSON(t){let e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});let i={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,i.blending=this.blending,i.side=this.side,i.shadowSide=this.shadowSide,i.vertexColors=this.vertexColors,i.opacity=this.opacity,i.transparent=this.transparent,i.blendSrc=this.blendSrc,i.blendDst=this.blendDst,i.blendEquation=this.blendEquation,i.blendSrcAlpha=this.blendSrcAlpha,i.blendDstAlpha=this.blendDstAlpha,i.blendEquationAlpha=this.blendEquationAlpha,i.blendColor=this.blendColor.getHex(),i.blendAlpha=this.blendAlpha,i.depthFunc=this.depthFunc,i.depthTest=this.depthTest,i.depthWrite=this.depthWrite,i.colorWrite=this.colorWrite,i.clipIntersection=this.clipIntersection,i.clipShadows=this.clipShadows,i.stencilWriteMask=this.stencilWriteMask,i.stencilFunc=this.stencilFunc,i.stencilRef=this.stencilRef,i.stencilFuncMask=this.stencilFuncMask,i.stencilFail=this.stencilFail,i.stencilZFail=this.stencilZFail,i.stencilZPass=this.stencilZPass,i.stencilWrite=this.stencilWrite,i.polygonOffset=this.polygonOffset,i.polygonOffsetFactor=this.polygonOffsetFactor,i.polygonOffsetUnits=this.polygonOffsetUnits,i.dithering=this.dithering,i.alphaTest=this.alphaTest,i.alphaHash=this.alphaHash,i.alphaToCoverage=this.alphaToCoverage,i.premultipliedAlpha=this.premultipliedAlpha,i.forceSinglePass=this.forceSinglePass,i.allowOverride=this.allowOverride,i.visible=this.visible,i.toneMapped=this.toneMapped,i.name=this.name,this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(i.sheenColorMap=this.sheenColorMap.toJSON(t).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(i.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(t).uuid),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(i.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(t).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(t).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(t).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(t).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(t).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(i.clippingPlanes=this.clippingPlanes.map(r=>r.toJSON())),this.rotation!==void 0&&(i.rotation=this.rotation),this.depthPacking!==void 0&&(i.depthPacking=this.depthPacking),this.linewidth!==void 0&&(i.linewidth=this.linewidth),this.linecap!==void 0&&(i.linecap=this.linecap),this.linejoin!==void 0&&(i.linejoin=this.linejoin),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.wireframe!==void 0&&(i.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(i.flatShading=this.flatShading),this.fog!==void 0&&(i.fog=this.fog),Object.keys(this.userData).length>0&&(i.userData=this.userData);function s(r){let o=[];for(let a in r){let c=r[a];delete c.metadata,o.push(c)}return o}if(e){let r=s(t.textures),o=s(t.images);r.length>0&&(i.textures=r),o.length>0&&(i.images=o)}return i}fromJSON(t,e){if(t.uuid!==void 0&&(this.uuid=t.uuid),t.name!==void 0&&(this.name=t.name),t.color!==void 0&&this.color!==void 0&&this.color.setHex(t.color),t.roughness!==void 0&&(this.roughness=t.roughness),t.metalness!==void 0&&(this.metalness=t.metalness),t.sheen!==void 0&&(this.sheen=t.sheen),t.sheenColor!==void 0&&(this.sheenColor=new te().setHex(t.sheenColor)),t.sheenRoughness!==void 0&&(this.sheenRoughness=t.sheenRoughness),t.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(t.emissive),t.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(t.specular),t.specularIntensity!==void 0&&(this.specularIntensity=t.specularIntensity),t.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(t.specularColor),t.shininess!==void 0&&(this.shininess=t.shininess),t.clearcoat!==void 0&&(this.clearcoat=t.clearcoat),t.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=t.clearcoatRoughness),t.dispersion!==void 0&&(this.dispersion=t.dispersion),t.retroreflectivity!==void 0&&(this.retroreflectivity=t.retroreflectivity),t.iridescence!==void 0&&(this.iridescence=t.iridescence),t.iridescenceIOR!==void 0&&(this.iridescenceIOR=t.iridescenceIOR),t.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=t.iridescenceThicknessRange),t.transmission!==void 0&&(this.transmission=t.transmission),t.thickness!==void 0&&(this.thickness=t.thickness),t.attenuationDistance!==void 0&&(this.attenuationDistance=t.attenuationDistance),t.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(t.attenuationColor),t.anisotropy!==void 0&&(this.anisotropy=t.anisotropy),t.anisotropyRotation!==void 0&&(this.anisotropyRotation=t.anisotropyRotation),t.fog!==void 0&&(this.fog=t.fog),t.flatShading!==void 0&&(this.flatShading=t.flatShading),t.blending!==void 0&&(this.blending=t.blending),t.combine!==void 0&&(this.combine=t.combine),t.side!==void 0&&(this.side=t.side),t.shadowSide!==void 0&&(this.shadowSide=t.shadowSide),t.opacity!==void 0&&(this.opacity=t.opacity),t.transparent!==void 0&&(this.transparent=t.transparent),t.alphaTest!==void 0&&(this.alphaTest=t.alphaTest),t.alphaHash!==void 0&&(this.alphaHash=t.alphaHash),t.depthFunc!==void 0&&(this.depthFunc=t.depthFunc),t.depthTest!==void 0&&(this.depthTest=t.depthTest),t.depthWrite!==void 0&&(this.depthWrite=t.depthWrite),t.colorWrite!==void 0&&(this.colorWrite=t.colorWrite),t.clippingPlanes!==void 0&&(this.clippingPlanes=t.clippingPlanes.map(i=>new vn().fromJSON(i))),t.clipIntersection!==void 0&&(this.clipIntersection=t.clipIntersection),t.clipShadows!==void 0&&(this.clipShadows=t.clipShadows),t.depthPacking!==void 0&&(this.depthPacking=t.depthPacking),t.blendSrc!==void 0&&(this.blendSrc=t.blendSrc),t.blendDst!==void 0&&(this.blendDst=t.blendDst),t.blendEquation!==void 0&&(this.blendEquation=t.blendEquation),t.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=t.blendSrcAlpha),t.blendDstAlpha!==void 0&&(this.blendDstAlpha=t.blendDstAlpha),t.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=t.blendEquationAlpha),t.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(t.blendColor),t.blendAlpha!==void 0&&(this.blendAlpha=t.blendAlpha),t.stencilWriteMask!==void 0&&(this.stencilWriteMask=t.stencilWriteMask),t.stencilFunc!==void 0&&(this.stencilFunc=t.stencilFunc),t.stencilRef!==void 0&&(this.stencilRef=t.stencilRef),t.stencilFuncMask!==void 0&&(this.stencilFuncMask=t.stencilFuncMask),t.stencilFail!==void 0&&(this.stencilFail=t.stencilFail),t.stencilZFail!==void 0&&(this.stencilZFail=t.stencilZFail),t.stencilZPass!==void 0&&(this.stencilZPass=t.stencilZPass),t.stencilWrite!==void 0&&(this.stencilWrite=t.stencilWrite),t.wireframe!==void 0&&(this.wireframe=t.wireframe),t.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=t.wireframeLinewidth),t.wireframeLinecap!==void 0&&(this.wireframeLinecap=t.wireframeLinecap),t.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=t.wireframeLinejoin),t.rotation!==void 0&&(this.rotation=t.rotation),t.linewidth!==void 0&&(this.linewidth=t.linewidth),t.linecap!==void 0&&(this.linecap=t.linecap),t.linejoin!==void 0&&(this.linejoin=t.linejoin),t.dashSize!==void 0&&(this.dashSize=t.dashSize),t.gapSize!==void 0&&(this.gapSize=t.gapSize),t.scale!==void 0&&(this.scale=t.scale),t.polygonOffset!==void 0&&(this.polygonOffset=t.polygonOffset),t.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=t.polygonOffsetFactor),t.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=t.polygonOffsetUnits),t.dithering!==void 0&&(this.dithering=t.dithering),t.alphaToCoverage!==void 0&&(this.alphaToCoverage=t.alphaToCoverage),t.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=t.premultipliedAlpha),t.forceSinglePass!==void 0&&(this.forceSinglePass=t.forceSinglePass),t.allowOverride!==void 0&&(this.allowOverride=t.allowOverride),t.visible!==void 0&&(this.visible=t.visible),t.toneMapped!==void 0&&(this.toneMapped=t.toneMapped),t.userData!==void 0&&(this.userData=t.userData),t.vertexColors!==void 0&&(typeof t.vertexColors=="number"?this.vertexColors=t.vertexColors>0:this.vertexColors=t.vertexColors),t.size!==void 0&&(this.size=t.size),t.sizeAttenuation!==void 0&&(this.sizeAttenuation=t.sizeAttenuation),t.map!==void 0&&(this.map=e[t.map]||null),t.matcap!==void 0&&(this.matcap=e[t.matcap]||null),t.alphaMap!==void 0&&(this.alphaMap=e[t.alphaMap]||null),t.bumpMap!==void 0&&(this.bumpMap=e[t.bumpMap]||null),t.bumpScale!==void 0&&(this.bumpScale=t.bumpScale),t.normalMap!==void 0&&(this.normalMap=e[t.normalMap]||null),t.normalMapType!==void 0&&(this.normalMapType=t.normalMapType),t.normalScale!==void 0){let i=t.normalScale;Array.isArray(i)===!1&&(i=[i,i]),this.normalScale=new Gt().fromArray(i)}return t.displacementMap!==void 0&&(this.displacementMap=e[t.displacementMap]||null),t.displacementScale!==void 0&&(this.displacementScale=t.displacementScale),t.displacementBias!==void 0&&(this.displacementBias=t.displacementBias),t.roughnessMap!==void 0&&(this.roughnessMap=e[t.roughnessMap]||null),t.metalnessMap!==void 0&&(this.metalnessMap=e[t.metalnessMap]||null),t.emissiveMap!==void 0&&(this.emissiveMap=e[t.emissiveMap]||null),t.emissiveIntensity!==void 0&&(this.emissiveIntensity=t.emissiveIntensity),t.specularMap!==void 0&&(this.specularMap=e[t.specularMap]||null),t.specularIntensityMap!==void 0&&(this.specularIntensityMap=e[t.specularIntensityMap]||null),t.specularColorMap!==void 0&&(this.specularColorMap=e[t.specularColorMap]||null),t.envMap!==void 0&&(this.envMap=e[t.envMap]||null),t.envMapRotation!==void 0&&this.envMapRotation.fromArray(t.envMapRotation),t.envMapIntensity!==void 0&&(this.envMapIntensity=t.envMapIntensity),t.reflectivity!==void 0&&(this.reflectivity=t.reflectivity),t.refractionRatio!==void 0&&(this.refractionRatio=t.refractionRatio),t.lightMap!==void 0&&(this.lightMap=e[t.lightMap]||null),t.lightMapIntensity!==void 0&&(this.lightMapIntensity=t.lightMapIntensity),t.aoMap!==void 0&&(this.aoMap=e[t.aoMap]||null),t.aoMapIntensity!==void 0&&(this.aoMapIntensity=t.aoMapIntensity),t.gradientMap!==void 0&&(this.gradientMap=e[t.gradientMap]||null),t.clearcoatMap!==void 0&&(this.clearcoatMap=e[t.clearcoatMap]||null),t.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=e[t.clearcoatRoughnessMap]||null),t.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=e[t.clearcoatNormalMap]||null),t.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new Gt().fromArray(t.clearcoatNormalScale)),t.iridescenceMap!==void 0&&(this.iridescenceMap=e[t.iridescenceMap]||null),t.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=e[t.iridescenceThicknessMap]||null),t.transmissionMap!==void 0&&(this.transmissionMap=e[t.transmissionMap]||null),t.thicknessMap!==void 0&&(this.thicknessMap=e[t.thicknessMap]||null),t.anisotropyMap!==void 0&&(this.anisotropyMap=e[t.anisotropyMap]||null),t.sheenColorMap!==void 0&&(this.sheenColorMap=e[t.sheenColorMap]||null),t.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=e[t.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;let e=t.clippingPlanes,i=null;if(e!==null){let s=e.length;i=new Array(s);for(let r=0;r!==s;++r)i[r]=e[r].clone()}return this.clippingPlanes=i,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.allowOverride=t.allowOverride,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}};var gi=new L,Nc=new L,Xo=new L,qo=new L,us=class{constructor(t=new L,e=new L(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,gi)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);let i=e.dot(this.direction);return i<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){let e=gi.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(gi.copy(this.origin).addScaledVector(this.direction,e),gi.distanceToSquared(t))}distanceSqToSegment(t,e,i,s){Nc.copy(t).add(e).multiplyScalar(.5),Xo.copy(e).sub(t).normalize(),qo.copy(this.origin).sub(Nc);let r=t.distanceTo(e)*.5,o=-this.direction.dot(Xo),a=qo.dot(this.direction),c=-qo.dot(Xo),l=qo.lengthSq(),u=Math.abs(1-o*o),f,h,d,m;if(u>0)if(f=o*c-a,h=o*a-c,m=r*u,f>=0)if(h>=-m)if(h<=m){let x=1/u;f*=x,h*=x,d=f*(f+o*h+2*a)+h*(o*f+h+2*c)+l}else h=r,f=Math.max(0,-(o*h+a)),d=-f*f+h*(h+2*c)+l;else h=-r,f=Math.max(0,-(o*h+a)),d=-f*f+h*(h+2*c)+l;else h<=-m?(f=Math.max(0,-(-o*r+a)),h=f>0?-r:Math.min(Math.max(-r,-c),r),d=-f*f+h*(h+2*c)+l):h<=m?(f=0,h=Math.min(Math.max(-r,-c),r),d=h*(h+2*c)+l):(f=Math.max(0,-(o*r+a)),h=f>0?r:Math.min(Math.max(-r,-c),r),d=-f*f+h*(h+2*c)+l);else h=o>0?-r:r,f=Math.max(0,-(o*h+a)),d=-f*f+h*(h+2*c)+l;return i&&i.copy(this.origin).addScaledVector(this.direction,f),s&&s.copy(Nc).addScaledVector(Xo,h),d}intersectSphere(t,e){if(t.radius<0)return null;gi.subVectors(t.center,this.origin);let i=gi.dot(this.direction),s=gi.dot(gi)-i*i,r=t.radius*t.radius;if(s>r)return null;let o=Math.sqrt(r-s),a=i-o,c=i+o;return c<0?null:a<0?this.at(c,e):this.at(a,e)}intersectsSphere(t){return t.radius<0?!1:this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){let e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;let i=-(this.origin.dot(t.normal)+t.constant)/e;return i>=0?i:null}intersectPlane(t,e){let i=this.distanceToPlane(t);return i===null?null:this.at(i,e)}intersectsPlane(t){let e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let i,s,r,o,a,c,l=1/this.direction.x,u=1/this.direction.y,f=1/this.direction.z,h=this.origin;return l>=0?(i=(t.min.x-h.x)*l,s=(t.max.x-h.x)*l):(i=(t.max.x-h.x)*l,s=(t.min.x-h.x)*l),u>=0?(r=(t.min.y-h.y)*u,o=(t.max.y-h.y)*u):(r=(t.max.y-h.y)*u,o=(t.min.y-h.y)*u),i>o||r>s||((r>i||isNaN(i))&&(i=r),(o<s||isNaN(s))&&(s=o),f>=0?(a=(t.min.z-h.z)*f,c=(t.max.z-h.z)*f):(a=(t.max.z-h.z)*f,c=(t.min.z-h.z)*f),i>c||a>s)||((a>i||i!==i)&&(i=a),(c<s||s!==s)&&(s=c),s<0)?null:this.at(i>=0?i:s,e)}intersectsBox(t){return this.intersectBox(t,gi)!==null}intersectTriangle(t,e,i,s,r){let o=this.origin,a=this.direction,c=a.x,l=a.y,u=a.z,f=t.x-o.x,h=t.y-o.y,d=t.z-o.z,m=e.x-o.x,x=e.y-o.y,g=e.z-o.z,p=i.x-o.x,S=i.y-o.y,A=i.z-o.z,M=Math.abs(c),T=Math.abs(l),b=Math.abs(u),C,y,w,P,F,B,V,I,k,W,J,et;if(M>=T&&M>=b?(w=c,B=f,k=m,et=p,c>=0?(C=l,y=u,P=h,F=d,V=x,I=g,W=S,J=A):(C=u,y=l,P=d,F=h,V=g,I=x,W=A,J=S)):T>=b?(w=l,B=h,k=x,et=S,l>=0?(C=u,y=c,P=d,F=f,V=g,I=m,W=A,J=p):(C=c,y=u,P=f,F=d,V=m,I=g,W=p,J=A)):(w=u,B=d,k=g,et=A,u>=0?(C=c,y=l,P=f,F=h,V=m,I=x,W=p,J=S):(C=l,y=c,P=h,F=f,V=x,I=m,W=S,J=p)),w===0)return null;let U=C/w,q=y/w,j=1/w,xt=P-U*B,Mt=F-q*B,le=V-U*k,Vt=I-q*k,St=W-U*et,Y=J-q*et,K=St*Vt-Y*le,it=xt*Y-Mt*St,wt=le*Mt-Vt*xt;if(s){if(K<0||it<0||wt<0)return null}else if((K<0||it<0||wt<0)&&(K>0||it>0||wt>0))return null;let ot=K+it+wt;if(ot===0)return null;let ut=j*(K*B+it*k+wt*et);return(ot>0?ut<0:ut>0)?null:this.at(ut/ot,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},Js=class extends Mi{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new te(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new vi,this.combine=th,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}},id=new we,as=new us,Yo=new hs,sd=new L,Zo=new L,Jo=new L,$o=new L,Uc=new L,Ko=new L,rd=new L,jo=new L,tn=class extends He{constructor(t=new Ne,e=new Js){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){let e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){let s=e[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(t,e){let i=this.geometry,s=i.attributes.position,r=i.morphAttributes.position,o=i.morphTargetsRelative;e.fromBufferAttribute(s,t);let a=this.morphTargetInfluences;if(r&&a){Ko.set(0,0,0);for(let c=0,l=r.length;c<l;c++){let u=a[c],f=r[c];u!==0&&(Uc.fromBufferAttribute(f,t),o?Ko.addScaledVector(Uc,u):Ko.addScaledVector(Uc.sub(e),u))}e.add(Ko)}return e}intersectsFrustum(t){return t.intersectsObject(this)}raycast(t,e){let i=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),Yo.copy(i.boundingSphere),Yo.applyMatrix4(r),as.copy(t.ray).recast(t.near),!(Yo.containsPoint(as.origin)===!1&&(as.intersectSphere(Yo,sd)===null||as.origin.distanceToSquared(sd)>(t.far-t.near)**2))&&(id.copy(r).invert(),as.copy(t.ray).applyMatrix4(id),!(i.boundingBox!==null&&as.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(t,e,as)))}_computeIntersections(t,e,i){let s,r=this.geometry,o=this.material,a=r.index,c=r.attributes.position,l=r.attributes.uv,u=r.attributes.uv1,f=r.attributes.normal,h=r.groups,d=r.drawRange;if(a!==null)if(Array.isArray(o))for(let m=0,x=h.length;m<x;m++){let g=h[m],p=o[g.materialIndex],S=Math.max(g.start,d.start),A=Math.min(a.count,Math.min(g.start+g.count,d.start+d.count));for(let M=S,T=A;M<T;M+=3){let b=a.getX(M),C=a.getX(M+1),y=a.getX(M+2);s=Qo(this,p,t,i,l,u,f,b,C,y),s&&(s.faceIndex=Math.floor(M/3),s.face.materialIndex=g.materialIndex,e.push(s))}}else{let m=Math.max(0,d.start),x=Math.min(a.count,d.start+d.count);for(let g=m,p=x;g<p;g+=3){let S=a.getX(g),A=a.getX(g+1),M=a.getX(g+2);s=Qo(this,o,t,i,l,u,f,S,A,M),s&&(s.faceIndex=Math.floor(g/3),e.push(s))}}else if(c!==void 0)if(Array.isArray(o))for(let m=0,x=h.length;m<x;m++){let g=h[m],p=o[g.materialIndex],S=Math.max(g.start,d.start),A=Math.min(c.count,Math.min(g.start+g.count,d.start+d.count));for(let M=S,T=A;M<T;M+=3){let b=M,C=M+1,y=M+2;s=Qo(this,p,t,i,l,u,f,b,C,y),s&&(s.faceIndex=Math.floor(M/3),s.face.materialIndex=g.materialIndex,e.push(s))}}else{let m=Math.max(0,d.start),x=Math.min(c.count,d.start+d.count);for(let g=m,p=x;g<p;g+=3){let S=g,A=g+1,M=g+2;s=Qo(this,o,t,i,l,u,f,S,A,M),s&&(s.faceIndex=Math.floor(g/3),e.push(s))}}}};function em(n,t,e,i,s,r,o,a){let c;if(t.side===sn?c=i.intersectTriangle(o,r,s,!0,a):c=i.intersectTriangle(s,r,o,t.side===qi,a),c===null)return null;jo.copy(a),jo.applyMatrix4(n.matrixWorld);let l=e.ray.origin.distanceTo(jo);return l<e.near||l>e.far?null:{distance:l,point:jo.clone(),object:n}}function Qo(n,t,e,i,s,r,o,a,c,l){n.getVertexPosition(a,Zo),n.getVertexPosition(c,Jo),n.getVertexPosition(l,$o);let u=em(n,t,e,i,Zo,Jo,$o,rd);if(u){let f=new L;_i.getBarycoord(rd,Zo,Jo,$o,f),s&&(u.uv=_i.getInterpolatedAttribute(s,a,c,l,f,new Gt)),r&&(u.uv1=_i.getInterpolatedAttribute(r,a,c,l,f,new Gt)),o&&(u.normal=_i.getInterpolatedAttribute(o,a,c,l,f,new L),u.normal.dot(i.direction)>0&&u.normal.multiplyScalar(-1));let h={a,b:c,c:l,normal:new L,materialIndex:0};_i.getNormal(Zo,Jo,$o,h.normal),u.face=h,u.barycoord=f}return u}var Ta=class extends cn{constructor(t=null,e=1,i=1,s,r,o,a,c,l=Ve,u=Ve,f,h){super(null,o,a,c,l,u,s,r,f,h),this.isDataTexture=!0,this.image={data:t,width:e,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var ls=new hs,nm=new Gt(.5,.5),ta=new L,$s=class{constructor(t=new vn,e=new vn,i=new vn,s=new vn,r=new vn,o=new vn){this.planes=[t,e,i,s,r,o]}set(t,e,i,s,r,o){let a=this.planes;return a[0].copy(t),a[1].copy(e),a[2].copy(i),a[3].copy(s),a[4].copy(r),a[5].copy(o),this}copy(t){let e=this.planes;for(let i=0;i<6;i++)e[i].copy(t.planes[i]);return this}setFromProjectionMatrix(t,e=kn,i=!1){let s=this.planes,r=t.elements,o=r[0],a=r[1],c=r[2],l=r[3],u=r[4],f=r[5],h=r[6],d=r[7],m=r[8],x=r[9],g=r[10],p=r[11],S=r[12],A=r[13],M=r[14],T=r[15];if(s[0].setComponents(l-o,d-u,p-m,T-S).normalize(),s[1].setComponents(l+o,d+u,p+m,T+S).normalize(),s[2].setComponents(l+a,d+f,p+x,T+A).normalize(),s[3].setComponents(l-a,d-f,p-x,T-A).normalize(),i)s[4].setComponents(c,h,g,M).normalize(),s[5].setComponents(l-c,d-h,p-g,T-M).normalize();else if(s[4].setComponents(l-c,d-h,p-g,T-M).normalize(),e===kn)s[5].setComponents(l+c,d+h,p+g,T+M).normalize();else if(e===Ws)s[5].setComponents(c,h,g,M).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),ls.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{let e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),ls.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(ls)}intersectsSprite(t){ls.center.set(0,0,0);let e=nm.distanceTo(t.center);return ls.radius=.7071067811865476+e,ls.applyMatrix4(t.matrixWorld),this.intersectsSphere(ls)}intersectsSphere(t){let e=this.planes,i=t.center,s=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(i)<s)return!1;return!0}intersectsBox(t){let e=this.planes;for(let i=0;i<6;i++){let s=e[i];if(ta.x=s.normal.x>0?t.max.x:t.min.x,ta.y=s.normal.y>0?t.max.y:t.min.y,ta.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(ta)<0)return!1}return!0}containsPoint(t){let e=this.planes;for(let i=0;i<6;i++)if(e[i].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};var un=class extends Mi{constructor(t){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new te(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}},Ea=new L,wa=new L,od=new we,Pr=new us,ea=new hs,Fc=new L,ad=new L,ds=class extends He{constructor(t=new Ne,e=new un){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){let t=this.geometry;if(t.index===null){let e=t.attributes.position,i=[0];for(let s=1,r=e.count;s<r;s++)Ea.fromBufferAttribute(e,s-1),wa.fromBufferAttribute(e,s),i[s]=i[s-1],i[s]+=Ea.distanceTo(wa);t.setAttribute("lineDistance",new be(i,1))}else kt("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}intersectsFrustum(t){return t.intersectsObject(this)}raycast(t,e){let i=this.geometry,s=this.matrixWorld,r=t.params.Line.threshold,o=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),ea.copy(i.boundingSphere),ea.applyMatrix4(s),ea.radius+=r,t.ray.intersectsSphere(ea)===!1)return;od.copy(s).invert(),Pr.copy(t.ray).applyMatrix4(od);let a=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=a*a,l=this.isLineSegments?2:1,u=i.index,h=i.attributes.position;if(u!==null){let d=Math.max(0,o.start),m=Math.min(u.count,o.start+o.count);for(let x=d,g=m-1;x<g;x+=l){let p=u.getX(x),S=u.getX(x+1),A=na(this,t,Pr,c,p,S,x);A&&e.push(A)}if(this.isLineLoop){let x=u.getX(m-1),g=u.getX(d),p=na(this,t,Pr,c,x,g,m-1);p&&e.push(p)}}else{let d=Math.max(0,o.start),m=Math.min(h.count,o.start+o.count);for(let x=d,g=m-1;x<g;x+=l){let p=na(this,t,Pr,c,x,x+1,x);p&&e.push(p)}if(this.isLineLoop){let x=na(this,t,Pr,c,m-1,d,m-1);x&&e.push(x)}}}updateMorphTargets(){let e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){let s=e[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}};function na(n,t,e,i,s,r,o){let a=n.geometry.attributes.position;if(Ea.fromBufferAttribute(a,s),wa.fromBufferAttribute(a,r),e.distanceSqToSegment(Ea,wa,Fc,ad)>i)return;Fc.applyMatrix4(n.matrixWorld);let l=t.ray.origin.distanceTo(Fc);if(!(l<t.near||l>t.far))return{distance:l,point:ad.clone().applyMatrix4(n.matrixWorld),index:o,face:null,faceIndex:null,barycoord:null,object:n}}var ld=new L,cd=new L,ii=class extends ds{constructor(t,e){super(t,e),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){let t=this.geometry;if(t.index===null){let e=t.attributes.position,i=[];for(let s=0,r=e.count;s<r;s+=2)ld.fromBufferAttribute(e,s),cd.fromBufferAttribute(e,s+1),i[s]=s===0?0:i[s-1],i[s+1]=i[s]+ld.distanceTo(cd);t.setAttribute("lineDistance",new be(i,1))}else kt("LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}};var Vr=class extends cn{constructor(t=[],e=Yi,i,s,r,o,a,c,l,u){super(t,e,i,s,r,o,a,c,l,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}};var Bi=class extends cn{constructor(t,e,i=Hn,s,r,o,a=Ve,c=Ve,l,u=ni,f=1){if(u!==ni&&u!==Ji)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");let h={width:t,height:e,depth:f};super(h,s,r,o,a,c,u,i,l),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.source=new Ys(Object.assign({},t.image)),this.compareFunction=t.compareFunction,this}toJSON(t){let e=super.toJSON(t);return e.compareFunction=this.compareFunction,e}},Aa=class extends Bi{constructor(t,e=Hn,i=Yi,s,r,o=Ve,a=Ve,c,l=ni){let u={width:t,height:t,depth:1},f=[u,u,u,u,u,u];super(t,t,e,i,s,r,o,a,c,l),this.image=f,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(t){this.image=t}},Hr=class extends cn{constructor(t=null){super(),this.sourceTexture=t,this.isExternalTexture=!0}copy(t){return super.copy(t),this.sourceTexture=t.sourceTexture,this}},Ks=class n extends Ne{constructor(t=1,e=1,i=1,s=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:i,widthSegments:s,heightSegments:r,depthSegments:o};let a=this;s=Math.floor(s),r=Math.floor(r),o=Math.floor(o);let c=[],l=[],u=[],f=[],h=0,d=0;m("z","y","x",-1,-1,i,e,t,o,r,0),m("z","y","x",1,-1,i,e,-t,o,r,1),m("x","z","y",1,1,t,i,e,s,o,2),m("x","z","y",1,-1,t,i,-e,s,o,3),m("x","y","z",1,-1,t,e,i,s,r,4),m("x","y","z",-1,-1,t,e,-i,s,r,5),this.setIndex(c),this.setAttribute("position",new be(l,3)),this.setAttribute("normal",new be(u,3)),this.setAttribute("uv",new be(f,2));function m(x,g,p,S,A,M,T,b,C,y,w){let P=M/C,F=T/y,B=M/2,V=T/2,I=b/2,k=C+1,W=y+1,J=0,et=0,U=new L;for(let q=0;q<W;q++){let j=q*F-V;for(let xt=0;xt<k;xt++){let Mt=xt*P-B;U[x]=Mt*S,U[g]=j*A,U[p]=I,l.push(U.x,U.y,U.z),U[x]=0,U[g]=0,U[p]=b>0?1:-1,u.push(U.x,U.y,U.z),f.push(xt/C),f.push(1-q/y),J+=1}}for(let q=0;q<y;q++)for(let j=0;j<C;j++){let xt=h+j+k*q,Mt=h+j+k*(q+1),le=h+(j+1)+k*(q+1),Vt=h+(j+1)+k*q;c.push(xt,Mt,Vt),c.push(Mt,le,Vt),et+=6}a.addGroup(d,et,w),d+=et,h+=J}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new n(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}};var js=class n extends Ne{constructor(t=1,e=1,i=1,s=32,r=1,o=!1,a=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:i,radialSegments:s,heightSegments:r,openEnded:o,thetaStart:a,thetaLength:c};let l=this;s=Math.floor(s),r=Math.floor(r);let u=[],f=[],h=[],d=[],m=0,x=[],g=i/2,p=0;S(),o===!1&&(t>0&&A(!0),e>0&&A(!1)),this.setIndex(u),this.setAttribute("position",new be(f,3)),this.setAttribute("normal",new be(h,3)),this.setAttribute("uv",new be(d,2));function S(){let M=new L,T=new L,b=0,C=(e-t)/i;for(let y=0;y<=r;y++){let w=[],P=y/r,F=P*(e-t)+t;for(let B=0;B<=s;B++){let V=B/s,I=V*c+a,k=Math.sin(I),W=Math.cos(I);T.x=F*k,T.y=-P*i+g,T.z=F*W,f.push(T.x,T.y,T.z),M.set(k,C,W).normalize(),h.push(M.x,M.y,M.z),d.push(V,1-P),w.push(m++)}x.push(w)}for(let y=0;y<s;y++)for(let w=0;w<r;w++){let P=x[w][y],F=x[w+1][y],B=x[w+1][y+1],V=x[w][y+1];(t>0||w!==0)&&(u.push(P,F,V),b+=3),(e>0||w!==r-1)&&(u.push(F,B,V),b+=3)}l.addGroup(p,b,0),p+=b}function A(M){let T=m,b=new Gt,C=new L,y=0,w=M===!0?t:e,P=M===!0?1:-1;for(let B=1;B<=s;B++)f.push(0,g*P,0),h.push(0,P,0),d.push(.5,.5),m++;let F=m;for(let B=0;B<=s;B++){let I=B/s*c+a,k=Math.cos(I),W=Math.sin(I);C.x=w*W,C.y=g*P,C.z=w*k,f.push(C.x,C.y,C.z),h.push(0,P,0),b.x=k*.5+.5,b.y=W*.5*P+.5,d.push(b.x,b.y),m++}for(let B=0;B<s;B++){let V=T+B,I=F+B;M===!0?u.push(I,I+1,V):u.push(I+1,I,V),y+=3}l.addGroup(p,y,M===!0?1:2),p+=y}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new n(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}},ki=class n extends js{constructor(t=1,e=1,i=32,s=1,r=!1,o=0,a=Math.PI*2){super(0,t,e,i,s,r,o,a),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:i,heightSegments:s,openEnded:r,thetaStart:o,thetaLength:a}}static fromJSON(t){return new n(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}};var ia=new L,sa=new L,Oc=new L,ra=new _i,Gr=class extends Ne{constructor(t=null,e=1){if(super(),this.type="EdgesGeometry",this.parameters={geometry:t,thresholdAngle:e},t!==null){let s=Math.pow(10,4),r=Math.cos(Vs*e),o=t.getIndex(),a=t.getAttribute("position"),c=o?o.count:a.count,l=[0,0,0],u=["a","b","c"],f=new Array(3),h={},d=[];for(let m=0;m<c;m+=3){o?(l[0]=o.getX(m),l[1]=o.getX(m+1),l[2]=o.getX(m+2)):(l[0]=m,l[1]=m+1,l[2]=m+2);let{a:x,b:g,c:p}=ra;if(x.fromBufferAttribute(a,l[0]),g.fromBufferAttribute(a,l[1]),p.fromBufferAttribute(a,l[2]),ra.getNormal(Oc),f[0]=`${Math.round(x.x*s)},${Math.round(x.y*s)},${Math.round(x.z*s)}`,f[1]=`${Math.round(g.x*s)},${Math.round(g.y*s)},${Math.round(g.z*s)}`,f[2]=`${Math.round(p.x*s)},${Math.round(p.y*s)},${Math.round(p.z*s)}`,!(f[0]===f[1]||f[1]===f[2]||f[2]===f[0]))for(let S=0;S<3;S++){let A=(S+1)%3,M=f[S],T=f[A],b=ra[u[S]],C=ra[u[A]],y=`${M}_${T}`,w=`${T}_${M}`;w in h&&h[w]?(Oc.dot(h[w].normal)<=r&&(d.push(b.x,b.y,b.z),d.push(C.x,C.y,C.z)),h[w]=null):y in h||(h[y]={index0:l[S],index1:l[A],normal:Oc.clone()})}}for(let m in h)if(h[m]){let{index0:x,index1:g}=h[m];ia.fromBufferAttribute(a,x),sa.fromBufferAttribute(a,g),d.push(ia.x,ia.y,ia.z),d.push(sa.x,sa.y,sa.z)}this.setAttribute("position",new be(d,3))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}};var en=class n extends Ne{constructor(t=1,e=1,i=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:i,heightSegments:s};let r=t/2,o=e/2,a=Math.floor(i),c=Math.floor(s),l=a+1,u=c+1,f=t/a,h=e/c,d=[],m=[],x=[],g=[];for(let p=0;p<u;p++){let S=p*h-o;for(let A=0;A<l;A++){let M=A*f-r;m.push(M,-S,0),x.push(0,0,1),g.push(A/a),g.push(1-p/c)}}for(let p=0;p<c;p++)for(let S=0;S<a;S++){let A=S+l*p,M=S+l*(p+1),T=S+1+l*(p+1),b=S+1+l*p;d.push(A,M,b),d.push(M,T,b)}this.setIndex(d),this.setAttribute("position",new be(m,3)),this.setAttribute("normal",new be(x,3)),this.setAttribute("uv",new be(g,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new n(t.width,t.height,t.widthSegments,t.heightSegments)}};var nn=class n extends Ne{constructor(t=1,e=32,i=16,s=0,r=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:i,phiStart:s,phiLength:r,thetaStart:o,thetaLength:a},e=Math.max(3,Math.floor(e)),i=Math.max(2,Math.floor(i));let c=Math.min(o+a,Math.PI),l=0,u=[],f=new L,h=new L,d=[],m=[],x=[],g=[];for(let p=0;p<=i;p++){let S=[],A=p/i,M=o+A*a,T=t*Math.cos(M),b=Math.sqrt(t*t-T*T),C=0;p===0&&o===0?C=.5/e:p===i&&c===Math.PI&&(C=-.5/e);for(let y=0;y<=e;y++){let w=y/e,P=s+w*r;f.x=-b*Math.cos(P),f.y=T,f.z=b*Math.sin(P),m.push(f.x,f.y,f.z),h.copy(f).normalize(),x.push(h.x,h.y,h.z),g.push(w+C,1-A),S.push(l++)}u.push(S)}for(let p=0;p<i;p++)for(let S=0;S<e;S++){let A=u[p][S+1],M=u[p][S],T=u[p+1][S],b=u[p+1][S+1];(p!==0||o>0)&&d.push(A,M,b),(p!==i-1||c<Math.PI)&&d.push(M,T,b)}this.setIndex(d),this.setAttribute("position",new be(m,3)),this.setAttribute("normal",new be(x,3)),this.setAttribute("uv",new be(g,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new n(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}};var Qs=class n extends Ne{constructor(t=1,e=.4,i=12,s=48,r=Math.PI*2,o=0,a=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:i,tubularSegments:s,arc:r,thetaStart:o,thetaLength:a},i=Math.floor(i),s=Math.floor(s);let c=[],l=[],u=[],f=[],h=new L,d=new L,m=new L;for(let x=0;x<=i;x++){let g=o+x/i*a;for(let p=0;p<=s;p++){let S=p/s*r;d.x=(t+e*Math.cos(g))*Math.cos(S),d.y=(t+e*Math.cos(g))*Math.sin(S),d.z=e*Math.sin(g),l.push(d.x,d.y,d.z),h.x=t*Math.cos(S),h.y=t*Math.sin(S),m.subVectors(d,h).normalize(),u.push(m.x,m.y,m.z),f.push(p/s),f.push(x/i)}}for(let x=1;x<=i;x++)for(let g=1;g<=s;g++){let p=(s+1)*x+g-1,S=(s+1)*(x-1)+g-1,A=(s+1)*(x-1)+g,M=(s+1)*x+g;c.push(p,S,M),c.push(S,A,M)}this.setIndex(c),this.setAttribute("position",new be(l,3)),this.setAttribute("normal",new be(u,3)),this.setAttribute("uv",new be(f,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new n(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc,t.thetaStart,t.thetaLength)}};var Si=class extends Ne{constructor(t=null){if(super(),this.type="WireframeGeometry",this.parameters={geometry:t},t!==null){let e=[],i=new Set,s=new L,r=new L;if(t.index!==null){let o=t.attributes.position,a=t.index,c=t.groups;c.length===0&&(c=[{start:0,count:a.count,materialIndex:0}]);for(let l=0,u=c.length;l<u;++l){let f=c[l],h=f.start,d=f.count;for(let m=h,x=h+d;m<x;m+=3)for(let g=0;g<3;g++){let p=a.getX(m+g),S=a.getX(m+(g+1)%3);s.fromBufferAttribute(o,p),r.fromBufferAttribute(o,S),hd(s,r,i)===!0&&(e.push(s.x,s.y,s.z),e.push(r.x,r.y,r.z))}}}else{let o=t.attributes.position;for(let a=0,c=o.count/3;a<c;a++)for(let l=0;l<3;l++){let u=3*a+l,f=3*a+(l+1)%3;s.fromBufferAttribute(o,u),r.fromBufferAttribute(o,f),hd(s,r,i)===!0&&(e.push(s.x,s.y,s.z),e.push(r.x,r.y,r.z))}}this.setAttribute("position",new be(e,3))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}};function hd(n,t,e){let i=`${n.x},${n.y},${n.z}-${t.x},${t.y},${t.z}`,s=`${t.x},${t.y},${t.z}-${n.x},${n.y},${n.z}`;return e.has(i)===!0||e.has(s)===!0?!1:(e.add(i),e.add(s),!0)}function ms(n){let t={};for(let e in n){t[e]={};for(let i in n[e]){let s=n[e][i];if(ud(s))s.isRenderTargetTexture?(kt("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][i]=null):t[e][i]=s.clone();else if(Array.isArray(s))if(ud(s[0])){let r=[];for(let o=0,a=s.length;o<a;o++)r[o]=s[o].clone();t[e][i]=r}else t[e][i]=s.slice();else t[e][i]=s}}return t}function Ze(n){let t={};for(let e=0;e<n.length;e++){let i=ms(n[e]);for(let s in i)t[s]=i[s]}return t}function ud(n){return n&&(n.isColor||n.isMatrix3||n.isMatrix4||n.isVector2||n.isVector3||n.isVector4||n.isTexture||n.isQuaternion)}function im(n){let t=[];for(let e=0;e<n.length;e++)t.push(n[e].clone());return t}function yh(n){let t=n.getRenderTarget();return t===null?n.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:he.workingColorSpace}var sf={clone:ms,merge:Ze},sm=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,rm=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,Sn=class extends Mi{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=sm,this.fragmentShader=rm,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=ms(t.uniforms),this.uniformsGroups=im(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this.defaultAttributeValues=Object.assign({},t.defaultAttributeValues),this.index0AttributeName=t.index0AttributeName,this.uniformsNeedUpdate=t.uniformsNeedUpdate,this}toJSON(t){let e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(let s in this.uniforms){let o=this.uniforms[s].value;o&&o.isTexture?e.uniforms[s]={type:"t",value:o.toJSON(t).uuid}:o&&o.isColor?e.uniforms[s]={type:"c",value:o.getHex()}:o&&o.isVector2?e.uniforms[s]={type:"v2",value:o.toArray()}:o&&o.isVector3?e.uniforms[s]={type:"v3",value:o.toArray()}:o&&o.isVector4?e.uniforms[s]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?e.uniforms[s]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?e.uniforms[s]={type:"m4",value:o.toArray()}:e.uniforms[s]={value:o}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;let i={};for(let s in this.extensions)this.extensions[s]===!0&&(i[s]=!0);return Object.keys(i).length>0&&(e.extensions=i),e}fromJSON(t,e){if(super.fromJSON(t,e),t.uniforms!==void 0)for(let i in t.uniforms){let s=t.uniforms[i];switch(this.uniforms[i]={},s.type){case"t":this.uniforms[i].value=e[s.value]||null;break;case"c":this.uniforms[i].value=new te().setHex(s.value);break;case"v2":this.uniforms[i].value=new Gt().fromArray(s.value);break;case"v3":this.uniforms[i].value=new L().fromArray(s.value);break;case"v4":this.uniforms[i].value=new Ae().fromArray(s.value);break;case"m3":this.uniforms[i].value=new Zt().fromArray(s.value);break;case"m4":this.uniforms[i].value=new we().fromArray(s.value);break;default:this.uniforms[i].value=s.value}}if(t.defines!==void 0&&(this.defines=t.defines),t.vertexShader!==void 0&&(this.vertexShader=t.vertexShader),t.fragmentShader!==void 0&&(this.fragmentShader=t.fragmentShader),t.glslVersion!==void 0&&(this.glslVersion=t.glslVersion),t.extensions!==void 0)for(let i in t.extensions)this.extensions[i]=t.extensions[i];return t.lights!==void 0&&(this.lights=t.lights),t.clipping!==void 0&&(this.clipping=t.clipping),this}},Ca=class extends Sn{constructor(t){super(t),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}},Ra=class extends Mi{constructor(t){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new te(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new te(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Il,this.normalScale=new Gt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new vi,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}},Wr=class extends Ra{constructor(t){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new Gt(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return oe(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(e){this.ior=(1+.4*e)/(1-.4*e)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new te(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new te(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new te(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._retroreflectivity=0,this._sheen=0,this._transmission=0,this.setValues(t)}get anisotropy(){return this._anisotropy}set anisotropy(t){this._anisotropy>0!=t>0&&this.version++,this._anisotropy=t}get clearcoat(){return this._clearcoat}set clearcoat(t){this._clearcoat>0!=t>0&&this.version++,this._clearcoat=t}get iridescence(){return this._iridescence}set iridescence(t){this._iridescence>0!=t>0&&this.version++,this._iridescence=t}get dispersion(){return this._dispersion}set dispersion(t){this._dispersion>0!=t>0&&this.version++,this._dispersion=t}get retroreflectivity(){return this._retroreflectivity}set retroreflectivity(t){this._retroreflectivity>0!=t>0&&this.version++,this._retroreflectivity=t}get sheen(){return this._sheen}set sheen(t){this._sheen>0!=t>0&&this.version++,this._sheen=t}get transmission(){return this._transmission}set transmission(t){this._transmission>0!=t>0&&this.version++,this._transmission=t}copy(t){return super.copy(t),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=t.anisotropy,this.anisotropyRotation=t.anisotropyRotation,this.anisotropyMap=t.anisotropyMap,this.clearcoat=t.clearcoat,this.clearcoatMap=t.clearcoatMap,this.clearcoatRoughness=t.clearcoatRoughness,this.clearcoatRoughnessMap=t.clearcoatRoughnessMap,this.clearcoatNormalMap=t.clearcoatNormalMap,this.clearcoatNormalScale.copy(t.clearcoatNormalScale),this.dispersion=t.dispersion,this.ior=t.ior,this.iridescence=t.iridescence,this.iridescenceMap=t.iridescenceMap,this.iridescenceIOR=t.iridescenceIOR,this.iridescenceThicknessRange=[...t.iridescenceThicknessRange],this.iridescenceThicknessMap=t.iridescenceThicknessMap,this.retroreflectivity=t.retroreflectivity,this.sheen=t.sheen,this.sheenColor.copy(t.sheenColor),this.sheenColorMap=t.sheenColorMap,this.sheenRoughness=t.sheenRoughness,this.sheenRoughnessMap=t.sheenRoughnessMap,this.transmission=t.transmission,this.transmissionMap=t.transmissionMap,this.thickness=t.thickness,this.thicknessMap=t.thicknessMap,this.attenuationDistance=t.attenuationDistance,this.attenuationColor.copy(t.attenuationColor),this.specularIntensity=t.specularIntensity,this.specularIntensityMap=t.specularIntensityMap,this.specularColor.copy(t.specularColor),this.specularColorMap=t.specularColorMap,this}};var Pa=class extends Mi{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Hd,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}},Ia=class extends Mi{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}};var Xr=class extends un{constructor(t){super(),this.isLineDashedMaterial=!0,this.type="LineDashedMaterial",this.scale=1,this.dashSize=3,this.gapSize=1,this.setValues(t)}copy(t){return super.copy(t),this.scale=t.scale,this.dashSize=t.dashSize,this.gapSize=t.gapSize,this}};function Os(n,t){return!n||n.constructor===t?n:typeof t.BYTES_PER_ELEMENT=="number"?new t(n):Array.prototype.slice.call(n)}function Bc(n){return n!==void 0&&n.inTangents!==void 0&&n.outTangents!==void 0}var zi=class{constructor(t,e,i,s){this.parameterPositions=t,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new e.constructor(i),this.sampleValues=e,this.valueSize=i,this.settings=null,this.DefaultSettings_={}}evaluate(t){let e=this.parameterPositions,i=this._cachedIndex,s=e[i],r=e[i-1];t:{e:{let o;n:{i:if(!(t<s)){for(let a=i+2;;){if(s===void 0){if(t<r)break i;return i=e.length,this._cachedIndex=i,this.copySampleValue_(i-1)}if(i===a)break;if(r=s,s=e[++i],t<s)break e}o=e.length;break n}if(!(t>=r)){let a=e[1];t<a&&(i=2,r=a);for(let c=i-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(i===c)break;if(s=r,r=e[--i-1],t>=r)break e}o=i,i=0;break n}break t}for(;i<o;){let a=i+o>>>1;t<e[a]?o=a:i=a+1}if(s=e[i],r=e[i-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return i=e.length,this._cachedIndex=i,this.copySampleValue_(i-1)}this._cachedIndex=i,this.intervalChanged_(i,r,s)}return this.interpolate_(i,r,t,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(t){let e=this.resultBuffer,i=this.sampleValues,s=this.valueSize,r=t*s;for(let o=0;o!==s;++o)e[o]=i[r+o];return e}interpolate_(){throw new Error("THREE.Interpolant: Call to abstract method.")}intervalChanged_(){}},La=class extends zi{constructor(t,e,i,s){super(t,e,i,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:Hc,endingEnd:Hc}}intervalChanged_(t,e,i){let s=this.parameterPositions,r=t-2,o=t+1,a=s[r],c=s[o];if(a===void 0)switch(this.getSettings_().endingStart){case Gc:r=t,a=2*e-i;break;case Wc:r=s.length-2,a=e+s[r]-s[r+1];break;default:r=t,a=i}if(c===void 0)switch(this.getSettings_().endingEnd){case Gc:o=t,c=2*i-e;break;case Wc:o=1,c=i+s[1]-s[0];break;default:o=t-1,c=e}let l=(i-e)*.5,u=this.valueSize;this._weightPrev=l/(e-a),this._weightNext=l/(c-i),this._offsetPrev=r*u,this._offsetNext=o*u}interpolate_(t,e,i,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=t*a,l=c-a,u=this._offsetPrev,f=this._offsetNext,h=this._weightPrev,d=this._weightNext,m=(i-e)/(s-e),x=m*m,g=x*m,p=-h*g+2*h*x-h*m,S=(1+h)*g+(-1.5-2*h)*x+(-.5+h)*m+1,A=(-1-d)*g+(1.5+d)*x+.5*m,M=d*g-d*x;for(let T=0;T!==a;++T)r[T]=p*o[u+T]+S*o[l+T]+A*o[c+T]+M*o[f+T];return r}},Da=class extends zi{constructor(t,e,i,s){super(t,e,i,s)}interpolate_(t,e,i,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=t*a,l=c-a,u=(i-e)/(s-e),f=1-u;for(let h=0;h!==a;++h)r[h]=o[l+h]*f+o[c+h]*u;return r}},Na=class extends zi{constructor(t,e,i,s){super(t,e,i,s)}interpolate_(t){return this.copySampleValue_(t-1)}},Ua=class extends zi{interpolate_(t,e,i,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=t*a,l=c-a,u=this.inTangents,f=this.outTangents;if(!u||!f){let m=(i-e)/(s-e),x=1-m;for(let g=0;g!==a;++g)r[g]=o[l+g]*x+o[c+g]*m;return r}let h=a*2,d=t-1;for(let m=0;m!==a;++m){let x=o[l+m],g=o[c+m],p=d*h+m*2,S=f[p],A=f[p+1],M=t*h+m*2,T=u[M],b=u[M+1],C=am(i,e,S,T,s);r[m]=rf(C,x,A,b,g)}return r}};function rf(n,t,e,i,s){let r=1-n;return r*r*r*t+3*r*r*n*e+3*r*n*n*i+n*n*n*s}function om(n,t,e,i,s){let r=1-n;return 3*r*r*(e-t)+6*r*n*(i-e)+3*n*n*(s-i)}function am(n,t,e,i,s){let r=(n-t)/(s-t);for(let o=0;o<8;o++){let a=rf(r,t,e,i,s)-n;if(Math.abs(a)<1e-10)break;let c=om(r,t,e,i,s);if(Math.abs(c)<1e-10)break;r=Math.max(0,Math.min(1,r-a/c))}return r}var bn=class{constructor(t,e,i,s){if(t===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(e===void 0||e.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+t);this.name=t,this.times=Os(e,this.TimeBufferType),this.values=Os(i,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(t){let e=t.constructor,i;if(e.toJSON!==this.toJSON)i=e.toJSON(t);else{i={name:t.name,times:Os(t.times,Array),values:Os(t.values,Array)};let s=t.getInterpolation();s!==t.DefaultInterpolation&&(i.interpolation=s),Bc(t.settings)&&(i.settings={inTangents:Os(t.settings.inTangents,Array),outTangents:Os(t.settings.outTangents,Array)})}return i.type=t.ValueTypeName,i}InterpolantFactoryMethodDiscrete(t){return new Na(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodLinear(t){return new Da(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodSmooth(t){return new La(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodBezier(t){let e=new Ua(this.times,this.values,this.getValueSize(),t);return this.settings&&(e.inTangents=this.settings.inTangents,e.outTangents=this.settings.outTangents),e}setInterpolation(t){let e;switch(t){case Lr:e=this.InterpolantFactoryMethodDiscrete;break;case va:e=this.InterpolantFactoryMethodLinear;break;case ca:e=this.InterpolantFactoryMethodSmooth;break;case Vc:e=this.InterpolantFactoryMethodBezier;break}if(e===void 0){let i="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(t!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(i);return kt("KeyframeTrack:",i),this}return this.createInterpolant=e,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Lr;case this.InterpolantFactoryMethodLinear:return va;case this.InterpolantFactoryMethodSmooth:return ca;case this.InterpolantFactoryMethodBezier:return Vc}}getValueSize(){return this.values.length/this.times.length}shift(t){if(t!==0){let e=this.times;for(let i=0,s=e.length;i!==s;++i)e[i]+=t}return this}scale(t){if(t!==1){let e=this.times;for(let i=0,s=e.length;i!==s;++i)e[i]*=t;Bc(this.settings)&&(dd(this.settings.inTangents,t),dd(this.settings.outTangents,t))}return this}trim(t,e){let i=this.times,s=i.length,r=0,o=s-1;for(;r!==s&&i[r]<t;)++r;for(;o!==-1&&i[o]>e;)--o;if(++o,r!==0||o!==s){r>=o&&(o=Math.max(o,1),r=o-1);let a=this.getValueSize();this.times=i.slice(r,o),this.values=this.values.slice(r*a,o*a)}return this}validate(){let t=!0,e=this.getValueSize();e-Math.floor(e)!==0&&(Wt("KeyframeTrack: Invalid value size in track.",this),t=!1);let i=this.times,s=this.values,r=i.length;r===0&&(Wt("KeyframeTrack: Track is empty.",this),t=!1);let o=null;for(let a=0;a!==r;a++){let c=i[a];if(typeof c=="number"&&isNaN(c)){Wt("KeyframeTrack: Time is not a valid number.",this,a,c),t=!1;break}if(o!==null&&o>c){Wt("KeyframeTrack: Out of order keys.",this,a,c,o),t=!1;break}o=c}if(s!==void 0&&Sp(s))for(let a=0,c=s.length;a!==c;++a){let l=s[a];if(isNaN(l)){Wt("KeyframeTrack: Value is not a valid number.",this,a,l),t=!1;break}}return t}optimize(){let t=this.times.slice(),e=this.values.slice(),i=this.getValueSize(),s=this.getInterpolation()===ca,r=t.length-1,o=1;for(let a=1;a<r;++a){let c=!1,l=t[a],u=t[a+1];if(l!==u&&(a!==1||l!==t[0]))if(s)c=!0;else{let f=a*i,h=f-i,d=f+i;for(let m=0;m!==i;++m){let x=e[f+m];if(x!==e[h+m]||x!==e[d+m]){c=!0;break}}}if(c){if(a!==o){t[o]=t[a];let f=a*i,h=o*i;for(let d=0;d!==i;++d)e[h+d]=e[f+d]}++o}}if(r>0){t[o]=t[r];for(let a=r*i,c=o*i,l=0;l!==i;++l)e[c+l]=e[a+l];++o}return o!==t.length?(this.times=t.slice(0,o),this.values=e.slice(0,o*i)):(this.times=t,this.values=e),this}clone(){let t=this.times.slice(),e=this.values.slice(),i=this.constructor,s=new i(this.name,t,e);return s.createInterpolant=this.createInterpolant,Bc(this.settings)&&(s.settings={inTangents:this.settings.inTangents.slice(),outTangents:this.settings.outTangents.slice()}),s}};function dd(n,t){for(let e=0,i=n.length;e!==i;e+=2)n[e]*=t}bn.prototype.ValueTypeName="";bn.prototype.TimeBufferType=Float32Array;bn.prototype.ValueBufferType=Float32Array;bn.prototype.DefaultInterpolation=va;var Vi=class extends bn{constructor(t,e,i){super(t,e,i)}};Vi.prototype.ValueTypeName="bool";Vi.prototype.ValueBufferType=Array;Vi.prototype.DefaultInterpolation=Lr;Vi.prototype.InterpolantFactoryMethodLinear=void 0;Vi.prototype.InterpolantFactoryMethodSmooth=void 0;var Fa=class extends bn{constructor(t,e,i,s){super(t,e,i,s)}};Fa.prototype.ValueTypeName="color";var Oa=class extends bn{constructor(t,e,i,s){super(t,e,i,s)}};Oa.prototype.ValueTypeName="number";var Ba=class extends zi{constructor(t,e,i,s){super(t,e,i,s)}interpolate_(t,e,i,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=(i-e)/(s-e),l=t*a;for(let u=l+a;l!==u;l+=4)Mn.slerpFlat(r,0,o,l-a,o,l,c);return r}},qr=class extends bn{constructor(t,e,i,s){super(t,e,i,s)}InterpolantFactoryMethodLinear(t){return new Ba(this.times,this.values,this.getValueSize(),t)}};qr.prototype.ValueTypeName="quaternion";qr.prototype.InterpolantFactoryMethodSmooth=void 0;var Hi=class extends bn{constructor(t,e,i){super(t,e,i)}};Hi.prototype.ValueTypeName="string";Hi.prototype.ValueBufferType=Array;Hi.prototype.DefaultInterpolation=Lr;Hi.prototype.InterpolantFactoryMethodLinear=void 0;Hi.prototype.InterpolantFactoryMethodSmooth=void 0;var ka=class extends bn{constructor(t,e,i,s){super(t,e,i,s)}};ka.prototype.ValueTypeName="vector";var za=class{constructor(t,e,i){let s=this,r=!1,o=0,a=0,c,l=[];this.onStart=void 0,this.onLoad=t,this.onProgress=e,this.onError=i,this._abortController=null,this.itemStart=function(u){a++,r===!1&&s.onStart!==void 0&&s.onStart(u,o,a),r=!0},this.itemEnd=function(u){o++,s.onProgress!==void 0&&s.onProgress(u,o,a),o===a&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(u){s.onError!==void 0&&s.onError(u)},this.resolveURL=function(u){return u=u.normalize("NFC"),c?c(u):u},this.setURLModifier=function(u){return c=u,this},this.addHandler=function(u,f){return l.push(u,f),this},this.removeHandler=function(u){let f=l.indexOf(u);return f!==-1&&l.splice(f,2),this},this.getHandler=function(u){for(let f=0,h=l.length;f<h;f+=2){let d=l[f],m=l[f+1];if(d.global&&(d.lastIndex=0),d.test(u))return m}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||(this._abortController=new AbortController),this._abortController}},of=new za,Va=class{constructor(t){this.manager=t!==void 0?t:of,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}load(){}loadAsync(t,e){let i=this;return new Promise(function(s,r){i.load(t,s,e,r)})}parse(){}setCrossOrigin(t){return this.crossOrigin=t,this}setWithCredentials(t){return this.withCredentials=t,this}setPath(t){return this.path=t,this}setResourcePath(t){return this.resourcePath=t,this}setRequestHeader(t){return this.requestHeader=t,this}abort(){return this}};Va.DEFAULT_MATERIAL_NAME="__DEFAULT";var Yr=class extends He{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new te(t),this.intensity=e}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){let e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,e}},Zr=class extends Yr{constructor(t,e,i){super(t,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(He.DEFAULT_UP),this.updateMatrix(),this.groundColor=new te(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}toJSON(t){let e=super.toJSON(t);return e.object.groundColor=this.groundColor.getHex(),e}},kc=new we,fd=new L,pd=new L,Ha=class{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Gt(512,512),this.mapType=dn,this.map=null,this.mapPass=null,this.matrix=new we,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new $s,this._frameExtents=new Gt(1,1),this._viewportCount=1,this._viewports=[new Ae(0,0,1,1)]}getViewportCount(){return this._viewportCount}getCamera(){return this.camera}getFrustum(){return this._frustum}updateMatrices(t){let e=this.camera;fd.setFromMatrixPosition(t.matrixWorld),e.position.copy(fd),pd.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(pd),e.updateMatrixWorld(),this._updateMatrix(e,this.matrix,this._frustum)}_updateMatrix(t,e,i,s){kc.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),i.setFromProjectionMatrix(kc,t.coordinateSystem,t.reversedDepth);let r=this._frameExtents,o=s?s.z/r.x:1,a=s?s.w/r.y:1,c=s?s.x/r.x:0,l=s?s.y/r.y:0;t.coordinateSystem===Ws||t.reversedDepth?e.set(.5*o,0,0,.5*o+c,0,.5*a,0,.5*a+l,0,0,1,0,0,0,0,1):e.set(.5*o,0,0,.5*o+c,0,.5*a,0,.5*a+l,0,0,.5,.5,0,0,0,1),e.multiply(kc)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.autoUpdate=t.autoUpdate,this.needsUpdate=t.needsUpdate,this.normalBias=t.normalBias,this.blurSamples=t.blurSamples,this.mapSize.copy(t.mapSize),this.biasNode=t.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){let t={};return t.intensity=this.intensity,t.bias=this.bias,t.normalBias=this.normalBias,t.radius=this.radius,t.blurSamples=this.blurSamples,t.mapSize=this.mapSize.toArray(),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}},oa=new L,aa=new Mn,ti=new L,Jr=class extends He{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new we,this.projectionMatrix=new we,this.projectionMatrixInverse=new we,this.coordinateSystem=kn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorld.decompose(oa,aa,ti),ti.x===1&&ti.y===1&&ti.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(oa,aa,ti.set(1,1,1)).invert()}updateWorldMatrix(t,e,i=!1){super.updateWorldMatrix(t,e,i),this.matrixWorld.decompose(oa,aa,ti),ti.x===1&&ti.y===1&&ti.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(oa,aa,ti.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}},Fi=new L,md=new Gt,gd=new Gt,Ye=class extends Jr{constructor(t=50,e=1,i=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=i,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){let e=.5*this.getFilmHeight()/t;this.fov=qs*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){let t=Math.tan(Vs*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return qs*2*Math.atan(Math.tan(Vs*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,i){Fi.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(Fi.x,Fi.y).multiplyScalar(-t/Fi.z),Fi.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(Fi.x,Fi.y).multiplyScalar(-t/Fi.z)}getViewSize(t,e){return this.getViewBounds(t,md,gd),e.subVectors(gd,md)}setViewOffset(t,e,i,s,r,o){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=this.near,e=t*Math.tan(Vs*.5*this.fov)/this.zoom,i=2*e,s=this.aspect*i,r=-.5*s,o=this.view;if(this.view!==null&&this.view.enabled){let c=o.fullWidth,l=o.fullHeight;r+=o.offsetX*s/c,e-=o.offsetY*i/l,s*=o.width/c,i*=o.height/l}let a=this.filmOffset;a!==0&&(r+=t*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,e,e-i,t,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}};var tr=class extends Jr{constructor(t=-1,e=1,i=1,s=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=i,this.bottom=s,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,i,s,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,s=(this.top+this.bottom)/2,r=i-t,o=i+t,a=s+e,c=s-e;if(this.view!==null&&this.view.enabled){let l=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=l*this.view.offsetX,o=r+l*this.view.width,a-=u*this.view.offsetY,c=a-u*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,c,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}},Xc=class extends Ha{constructor(){super(new tr(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},er=class extends Yr{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(He.DEFAULT_UP),this.updateMatrix(),this.target=new He,this.shadow=new Xc}dispose(){super.dispose(),this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}toJSON(t){let e=super.toJSON(t);return e.object.shadow=this.shadow.toJSON(),e.object.target=this.target.uuid,e}};var Bs=-90,ks=1,Ga=class extends He{constructor(t,e,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;let s=new Ye(Bs,ks,t,e);s.layers=this.layers,this.add(s);let r=new Ye(Bs,ks,t,e);r.layers=this.layers,this.add(r);let o=new Ye(Bs,ks,t,e);o.layers=this.layers,this.add(o);let a=new Ye(Bs,ks,t,e);a.layers=this.layers,this.add(a);let c=new Ye(Bs,ks,t,e);c.layers=this.layers,this.add(c);let l=new Ye(Bs,ks,t,e);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){let t=this.coordinateSystem,e=this.children.concat(),[i,s,r,o,a,c]=e;for(let l of e)this.remove(l);if(t===kn)i.up.set(0,1,0),i.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(t===Ws)i.up.set(0,-1,0),i.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(let l of e)this.add(l),l.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();let{renderTarget:i,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());let[r,o,a,c,l,u]=this.children,f=t.getRenderTarget(),h=t.getActiveCubeFace(),d=t.getActiveMipmapLevel(),m=t.xr.enabled;t.xr.enabled=!1;let x=i.texture.generateMipmaps;i.texture.generateMipmaps=!1;let g=!1;t.isWebGLRenderer===!0?g=t.state.buffers.depth.getReversed():g=t.reversedDepthBuffer,t.setRenderTarget(i,0,s),g&&t.autoClear===!1&&t.clearDepth(),t.render(e,r),t.setRenderTarget(i,1,s),g&&t.autoClear===!1&&t.clearDepth(),t.render(e,o),t.setRenderTarget(i,2,s),g&&t.autoClear===!1&&t.clearDepth(),t.render(e,a),t.setRenderTarget(i,3,s),g&&t.autoClear===!1&&t.clearDepth(),t.render(e,c),t.setRenderTarget(i,4,s),g&&t.autoClear===!1&&t.clearDepth(),t.render(e,l),i.texture.generateMipmaps=x,t.setRenderTarget(i,5,s),g&&t.autoClear===!1&&t.clearDepth(),t.render(e,u),t.setRenderTarget(f,h,d),t.xr.enabled=m,i.texture.needsPMREMUpdate=!0}},Wa=class extends Ye{constructor(t=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=t}};var vh="\\[\\]\\.:\\/",lm=new RegExp("["+vh+"]","g"),Mh="[^"+vh+"]",cm="[^"+vh.replace("\\.","")+"]",hm=/((?:WC+[\/:])*)/.source.replace("WC",Mh),um=/(WCOD+)?/.source.replace("WCOD",cm),dm=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",Mh),fm=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",Mh),pm=new RegExp("^"+hm+um+dm+fm+"$"),mm=["material","materials","bones","map"],qc=class{constructor(t,e,i){let s=i||Ee.parseTrackName(e);this._targetGroup=t,this._bindings=t.subscribe_(e,s)}getValue(t,e){this.bind();let i=this._targetGroup.nCachedObjects_,s=this._bindings[i];s!==void 0&&s.getValue(t,e)}setValue(t,e){let i=this._bindings;for(let s=this._targetGroup.nCachedObjects_,r=i.length;s!==r;++s)i[s].setValue(t,e)}bind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,i=t.length;e!==i;++e)t[e].bind()}unbind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,i=t.length;e!==i;++e)t[e].unbind()}},Ee=class n{constructor(t,e,i){this.path=e,this.parsedPath=i||n.parseTrackName(e),this.node=n.findNode(t,this.parsedPath.nodeName),this.rootNode=t,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(t,e,i){return t&&t.isAnimationObjectGroup?new n.Composite(t,e,i):new n(t,e,i)}static sanitizeNodeName(t){return t.replace(/\s/g,"_").replace(lm,"")}static parseTrackName(t){let e=pm.exec(t);if(e===null)throw new Error("THREE.PropertyBinding: Cannot parse trackName: "+t);let i={nodeName:e[2],objectName:e[3],objectIndex:e[4],propertyName:e[5],propertyIndex:e[6]},s=i.nodeName&&i.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){let r=i.nodeName.substring(s+1);mm.indexOf(r)!==-1&&(i.nodeName=i.nodeName.substring(0,s),i.objectName=r)}if(i.propertyName===null||i.propertyName.length===0)throw new Error("THREE.PropertyBinding: can not parse propertyName from trackName: "+t);return i}static findNode(t,e){if(e===void 0||e===""||e==="."||e===-1||e===t.name||e===t.uuid)return t;if(t.skeleton){let i=t.skeleton.getBoneByName(e);if(i!==void 0)return i}if(t.children){let i=function(r){for(let o=0;o<r.length;o++){let a=r[o];if(a.name===e||a.uuid===e)return a;let c=i(a.children);if(c)return c}return null},s=i(t.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(t,e){t[e]=this.targetObject[this.propertyName]}_getValue_array(t,e){let i=this.resolvedProperty;for(let s=0,r=i.length;s!==r;++s)t[e++]=i[s]}_getValue_arrayElement(t,e){t[e]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(t,e){this.resolvedProperty.toArray(t,e)}_setValue_direct(t,e){this.targetObject[this.propertyName]=t[e]}_setValue_direct_setNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(t,e){let i=this.resolvedProperty;for(let s=0,r=i.length;s!==r;++s)i[s]=t[e++]}_setValue_array_setNeedsUpdate(t,e){let i=this.resolvedProperty;for(let s=0,r=i.length;s!==r;++s)i[s]=t[e++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(t,e){let i=this.resolvedProperty;for(let s=0,r=i.length;s!==r;++s)i[s]=t[e++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(t,e){this.resolvedProperty[this.propertyIndex]=t[e]}_setValue_arrayElement_setNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(t,e){this.resolvedProperty.fromArray(t,e)}_setValue_fromArray_setNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(t,e){this.bind(),this.getValue(t,e)}_setValue_unbound(t,e){this.bind(),this.setValue(t,e)}bind(){let t=this.node,e=this.parsedPath,i=e.objectName,s=e.propertyName,r=e.propertyIndex;if(t||(t=n.findNode(this.rootNode,e.nodeName),this.node=t),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!t){kt("PropertyBinding: No target node found for track: "+this.path+".");return}if(i){let l=e.objectIndex;switch(i){case"materials":if(!t.material){Wt("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.materials){Wt("PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}t=t.material.materials;break;case"bones":if(!t.skeleton){Wt("PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}t=t.skeleton.bones;for(let u=0;u<t.length;u++)if(t[u].name===l){l=u;break}break;case"map":if("map"in t){t=t.map;break}if(!t.material){Wt("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.map){Wt("PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}t=t.material.map;break;default:if(t[i]===void 0){Wt("PropertyBinding: Can not bind to objectName of node undefined.",this);return}t=t[i]}if(l!==void 0){if(t[l]===void 0){Wt("PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,t);return}t=t[l]}}let o=t[s];if(o===void 0){let l=e.nodeName;Wt("PropertyBinding: Trying to update property for track: "+l+"."+s+" but it wasn't found.",t);return}let a=this.Versioning.None;this.targetObject=t,t.isMaterial===!0?a=this.Versioning.NeedsUpdate:t.isObject3D===!0&&(a=this.Versioning.MatrixWorldNeedsUpdate);let c=this.BindingType.Direct;if(r!==void 0){if(s==="morphTargetInfluences"){if(!t.geometry){Wt("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!t.geometry.morphAttributes){Wt("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}t.morphTargetDictionary[r]!==void 0&&(r=t.morphTargetDictionary[r])}c=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=r}else o.fromArray!==void 0&&o.toArray!==void 0?(c=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(c=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=s;this.getValue=this.GetterByBindingType[c],this.setValue=this.SetterByBindingTypeAndVersioning[c][a]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};Ee.Composite=qc;Ee.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};Ee.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};Ee.prototype.GetterByBindingType=[Ee.prototype._getValue_direct,Ee.prototype._getValue_array,Ee.prototype._getValue_arrayElement,Ee.prototype._getValue_toArray];Ee.prototype.SetterByBindingTypeAndVersioning=[[Ee.prototype._setValue_direct,Ee.prototype._setValue_direct_setNeedsUpdate,Ee.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[Ee.prototype._setValue_array,Ee.prototype._setValue_array_setNeedsUpdate,Ee.prototype._setValue_array_setMatrixWorldNeedsUpdate],[Ee.prototype._setValue_arrayElement,Ee.prototype._setValue_arrayElement_setNeedsUpdate,Ee.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[Ee.prototype._setValue_fromArray,Ee.prototype._setValue_fromArray_setNeedsUpdate,Ee.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var kM=new Float32Array(1);var nr=class{constructor(t=1,e=0,i=0){this.radius=t,this.phi=e,this.theta=i}set(t,e,i){return this.radius=t,this.phi=e,this.theta=i,this}copy(t){return this.radius=t.radius,this.phi=t.phi,this.theta=t.theta,this}makeSafe(){return this.phi=oe(this.phi,1e-6,Math.PI-1e-6),this}setFromVector3(t){return this.setFromCartesianCoords(t.x,t.y,t.z)}setFromCartesianCoords(t,e,i){return this.radius=Math.sqrt(t*t+e*e+i*i),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(t,i),this.phi=Math.acos(oe(e/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}};var Ah=class Ah{constructor(t,e,i,s){this.elements=[1,0,0,1],t!==void 0&&this.set(t,e,i,s)}identity(){return this.set(1,0,0,1),this}fromArray(t,e=0){for(let i=0;i<4;i++)this.elements[i]=t[i+e];return this}set(t,e,i,s){let r=this.elements;return r[0]=t,r[2]=e,r[1]=i,r[3]=s,this}};Ah.prototype.isMatrix2=!0;var Yc=Ah;var _d=new L,la,zc,Gi=class extends He{constructor(t=new L(0,0,1),e=new L(0,0,0),i=1,s=16776960,r=i*.2,o=r*.2){super(),this.type="ArrowHelper",la===void 0&&(la=new Ne,la.setAttribute("position",new be([0,0,0,0,1,0],3)),zc=new ki(.5,1,5,1),zc.translate(0,-.5,0)),this.position.copy(e),this.line=new ds(la,new un({color:s,toneMapped:!1})),this.line.matrixAutoUpdate=!1,this.add(this.line),this.cone=new tn(zc,new Js({color:s,toneMapped:!1})),this.cone.matrixAutoUpdate=!1,this.add(this.cone),this.setDirection(t),this.setLength(i,r,o)}setDirection(t){if(t.y>.99999)this.quaternion.set(0,0,0,1);else if(t.y<-.99999)this.quaternion.set(1,0,0,0);else{_d.set(t.z,0,-t.x).normalize();let e=Math.acos(t.y);this.quaternion.setFromAxisAngle(_d,e)}}setLength(t,e=t*.2,i=e*.2){this.line.scale.set(1,Math.max(1e-4,t-e),1),this.line.updateMatrix(),this.cone.scale.set(i,e,i),this.cone.position.y=t,this.cone.updateMatrix()}setColor(t){this.line.material.color.set(t),this.cone.material.color.set(t)}copy(t){return super.copy(t,!1),this.line.copy(t.line),this.cone.copy(t.cone),this}dispose(){super.dispose(),this.line.geometry.dispose(),this.line.material.dispose(),this.cone.geometry.dispose(),this.cone.material.dispose()}};var $r=class extends zn{constructor(t,e=null){super(),this.object=t,this.domElement=e,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(t){this.domElement!==null&&this.disconnect(),this.domElement=t}disconnect(){}dispose(){}update(){}};function Sh(n,t,e,i){let s=gm(i);switch(e){case dh:return n*t;case ph:return n*t/s.components*s.byteLength;case ja:return n*t/s.components*s.byteLength;case $i:return n*t*2/s.components*s.byteLength;case Qa:return n*t*2/s.components*s.byteLength;case fh:return n*t*3/s.components*s.byteLength;case Dn:return n*t*4/s.components*s.byteLength;case tl:return n*t*4/s.components*s.byteLength;case eo:case no:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*8;case io:case so:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case nl:case sl:return Math.max(n,16)*Math.max(t,8)/4;case el:case il:return Math.max(n,8)*Math.max(t,8)/2;case rl:case ol:case ll:case cl:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*8;case al:case ro:case hl:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case ul:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case dl:return Math.floor((n+4)/5)*Math.floor((t+3)/4)*16;case fl:return Math.floor((n+4)/5)*Math.floor((t+4)/5)*16;case pl:return Math.floor((n+5)/6)*Math.floor((t+4)/5)*16;case ml:return Math.floor((n+5)/6)*Math.floor((t+5)/6)*16;case gl:return Math.floor((n+7)/8)*Math.floor((t+4)/5)*16;case _l:return Math.floor((n+7)/8)*Math.floor((t+5)/6)*16;case xl:return Math.floor((n+7)/8)*Math.floor((t+7)/8)*16;case yl:return Math.floor((n+9)/10)*Math.floor((t+4)/5)*16;case vl:return Math.floor((n+9)/10)*Math.floor((t+5)/6)*16;case Ml:return Math.floor((n+9)/10)*Math.floor((t+7)/8)*16;case Sl:return Math.floor((n+9)/10)*Math.floor((t+9)/10)*16;case bl:return Math.floor((n+11)/12)*Math.floor((t+9)/10)*16;case Tl:return Math.floor((n+11)/12)*Math.floor((t+11)/12)*16;case El:case wl:case Al:return Math.ceil(n/4)*Math.ceil(t/4)*16;case Cl:case Rl:return Math.ceil(n/4)*Math.ceil(t/4)*8;case oo:case Pl:return Math.ceil(n/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function gm(n){switch(n){case dn:case lh:return{byteLength:1,components:1};case rr:case ch:case Wn:return{byteLength:2,components:1};case $a:case Ka:return{byteLength:2,components:4};case Hn:case Ja:case Gn:return{byteLength:4,components:1};case hh:case uh:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${n}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"186"}}));typeof window<"u"&&(window.__THREE__?kt("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="186");function Cf(){let n=null,t=!1,e=null,i=null;function s(r,o){i=n.requestAnimationFrame(s),e(r,o)}return{start:function(){t!==!0&&e!==null&&n!==null&&(i=n.requestAnimationFrame(s),t=!0)},stop:function(){n!==null&&n.cancelAnimationFrame(i),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){n=r}}}function xm(n){let t=new WeakMap;function e(a,c){let l=a.array,u=a.usage,f=l.byteLength,h=n.createBuffer();n.bindBuffer(c,h),n.bufferData(c,l,u),a.onUploadCallback();let d;if(l instanceof Float32Array)d=n.FLOAT;else if(typeof Float16Array<"u"&&l instanceof Float16Array)d=n.HALF_FLOAT;else if(l instanceof Uint16Array)a.isFloat16BufferAttribute?d=n.HALF_FLOAT:d=n.UNSIGNED_SHORT;else if(l instanceof Int16Array)d=n.SHORT;else if(l instanceof Uint32Array)d=n.UNSIGNED_INT;else if(l instanceof Int32Array)d=n.INT;else if(l instanceof Int8Array)d=n.BYTE;else if(l instanceof Uint8Array)d=n.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)d=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:h,type:d,bytesPerElement:l.BYTES_PER_ELEMENT,version:a.version,size:f}}function i(a,c,l){let u=c.array,f=c.updateRanges;if(n.bindBuffer(l,a),f.length===0)n.bufferSubData(l,0,u);else{f.sort((d,m)=>d.start-m.start);let h=0;for(let d=1;d<f.length;d++){let m=f[h],x=f[d];x.start<=m.start+m.count+1?m.count=Math.max(m.count,x.start+x.count-m.start):(++h,f[h]=x)}f.length=h+1;for(let d=0,m=f.length;d<m;d++){let x=f[d];n.bufferSubData(l,x.start*u.BYTES_PER_ELEMENT,u,x.start,x.count)}c.clearUpdateRanges()}c.onUploadCallback()}function s(a){return a.isInterleavedBufferAttribute&&(a=a.data),t.get(a)}function r(a){a.isInterleavedBufferAttribute&&(a=a.data);let c=t.get(a);c&&(n.deleteBuffer(c.buffer),t.delete(a))}function o(a,c){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){let u=t.get(a);(!u||u.version<a.version)&&t.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}let l=t.get(a);if(l===void 0)t.set(a,e(a,c));else if(l.version<a.version){if(l.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(l.buffer,a,c),l.version=a.version}}return{get:s,remove:r,update:o}}var ym=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,vm=`#ifdef USE_ALPHAHASH
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
#endif`,Mm=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Sm=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,bm=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Tm=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Em=`#ifdef USE_AOMAP
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
#endif`,wm=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Am=`#ifdef USE_BATCHING
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
#endif`,Cm=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Rm=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Pm=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Im=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,Lm=`#ifdef USE_IRIDESCENCE
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
#endif`,Dm=`#ifdef USE_BUMPMAP
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
#endif`,Nm=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,Um=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Fm=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Om=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Bm=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,km=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,zm=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,Vm=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
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
#endif`,Hm=`#define PI 3.141592653589793
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
} // validated`,Gm=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,Wm=`vec3 transformedNormal = objectNormal;
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
#endif`,Xm=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,qm=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Ym=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Zm=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Jm="gl_FragColor = linearToOutputTexel( gl_FragColor );",$m=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Km=`#ifdef USE_ENVMAP
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
#endif`,jm=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,Qm=`#ifdef USE_ENVMAP
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
#endif`,tg=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS

		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,eg=`#ifdef USE_ENVMAP
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
#endif`,ng=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,ig=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,sg=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,rg=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,og=`#ifdef USE_GRADIENTMAP
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
}`,ag=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,lg=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,cg=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,hg=`uniform bool receiveShadow;
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
#include <lightprobes_pars_fragment>`,ug=`#ifdef USE_ENVMAP
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
#endif`,dg=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,fg=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,pg=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,mg=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,gg=`PhysicalMaterial material;
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
#endif`,_g=`uniform sampler2D dfgLUT;
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
}`,xg=`
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
#endif`,yg=`#if defined( RE_IndirectDiffuse )
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
#endif`,vg=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Mg=`#ifdef USE_LIGHT_PROBES_GRID
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
#endif`,Sg=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,bg=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Tg=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Eg=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,wg=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Ag=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Cg=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,Rg=`#if defined( USE_POINTS_UV )
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
#endif`,Pg=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Ig=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Lg=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Dg=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Ng=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Ug=`#ifdef USE_MORPHTARGETS
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
#endif`,Fg=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Og=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,Bg=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,kg=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,zg=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Vg=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,Hg=`#ifdef USE_NORMALMAP
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
#endif`,Gg=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Wg=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Xg=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,qg=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Yg=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Zg=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,Jg=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,$g=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Kg=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,jg=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Qg=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,t0=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,e0=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,n0=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,i0=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,s0=`float getShadowMask() {
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
}`,r0=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,o0=`#ifdef USE_SKINNING
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
#endif`,a0=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,l0=`#ifdef USE_SKINNING
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
#endif`,c0=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,h0=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,u0=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,d0=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,f0=`#ifdef USE_TRANSMISSION
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
#endif`,p0=`#ifdef USE_TRANSMISSION
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
#endif`,m0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,g0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,_0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,x0=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,y0=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,v0=`uniform sampler2D t2D;
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
}`,M0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,S0=`#ifdef ENVMAP_TYPE_CUBE
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
}`,b0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,T0=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,E0=`#include <common>
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
}`,w0=`#if DEPTH_PACKING == 3200
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
}`,A0=`#define DISTANCE
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
}`,C0=`#define DISTANCE
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
}`,R0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,P0=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,I0=`uniform float scale;
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
}`,L0=`uniform vec3 diffuse;
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
}`,D0=`#include <common>
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
}`,N0=`uniform vec3 diffuse;
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
}`,U0=`#define LAMBERT
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
}`,F0=`#define LAMBERT
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
}`,O0=`#define MATCAP
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
}`,B0=`#define MATCAP
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
}`,k0=`#define NORMAL
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
}`,z0=`#define NORMAL
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
}`,V0=`#define PHONG
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
}`,H0=`#define PHONG
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
}`,G0=`#define STANDARD
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
}`,W0=`#define STANDARD
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
}`,X0=`#define TOON
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
}`,q0=`#define TOON
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
}`,Y0=`uniform float size;
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
}`,Z0=`uniform vec3 diffuse;
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
}`,J0=`#include <common>
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
}`,$0=`uniform vec3 color;
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
}`,K0=`uniform float rotation;
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
}`,j0=`uniform vec3 diffuse;
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
}`,ie={alphahash_fragment:ym,alphahash_pars_fragment:vm,alphamap_fragment:Mm,alphamap_pars_fragment:Sm,alphatest_fragment:bm,alphatest_pars_fragment:Tm,aomap_fragment:Em,aomap_pars_fragment:wm,batching_pars_vertex:Am,batching_vertex:Cm,begin_vertex:Rm,beginnormal_vertex:Pm,bsdfs:Im,iridescence_fragment:Lm,bumpmap_pars_fragment:Dm,clipping_planes_fragment:Nm,clipping_planes_pars_fragment:Um,clipping_planes_pars_vertex:Fm,clipping_planes_vertex:Om,color_fragment:Bm,color_pars_fragment:km,color_pars_vertex:zm,color_vertex:Vm,common:Hm,cube_uv_reflection_fragment:Gm,defaultnormal_vertex:Wm,displacementmap_pars_vertex:Xm,displacementmap_vertex:qm,emissivemap_fragment:Ym,emissivemap_pars_fragment:Zm,colorspace_fragment:Jm,colorspace_pars_fragment:$m,envmap_fragment:Km,envmap_common_pars_fragment:jm,envmap_pars_fragment:Qm,envmap_pars_vertex:tg,envmap_physical_pars_fragment:ug,envmap_vertex:eg,fog_vertex:ng,fog_pars_vertex:ig,fog_fragment:sg,fog_pars_fragment:rg,gradientmap_pars_fragment:og,lightmap_pars_fragment:ag,lights_lambert_fragment:lg,lights_lambert_pars_fragment:cg,lights_pars_begin:hg,lights_toon_fragment:dg,lights_toon_pars_fragment:fg,lights_phong_fragment:pg,lights_phong_pars_fragment:mg,lights_physical_fragment:gg,lights_physical_pars_fragment:_g,lights_fragment_begin:xg,lights_fragment_maps:yg,lights_fragment_end:vg,lightprobes_pars_fragment:Mg,logdepthbuf_fragment:Sg,logdepthbuf_pars_fragment:bg,logdepthbuf_pars_vertex:Tg,logdepthbuf_vertex:Eg,map_fragment:wg,map_pars_fragment:Ag,map_particle_fragment:Cg,map_particle_pars_fragment:Rg,metalnessmap_fragment:Pg,metalnessmap_pars_fragment:Ig,morphinstance_vertex:Lg,morphcolor_vertex:Dg,morphnormal_vertex:Ng,morphtarget_pars_vertex:Ug,morphtarget_vertex:Fg,normal_fragment_begin:Og,normal_fragment_maps:Bg,normal_pars_fragment:kg,normal_pars_vertex:zg,normal_vertex:Vg,normalmap_pars_fragment:Hg,clearcoat_normal_fragment_begin:Gg,clearcoat_normal_fragment_maps:Wg,clearcoat_pars_fragment:Xg,iridescence_pars_fragment:qg,opaque_fragment:Yg,packing:Zg,premultiplied_alpha_fragment:Jg,project_vertex:$g,dithering_fragment:Kg,dithering_pars_fragment:jg,roughnessmap_fragment:Qg,roughnessmap_pars_fragment:t0,shadowmap_pars_fragment:e0,shadowmap_pars_vertex:n0,shadowmap_vertex:i0,shadowmask_pars_fragment:s0,skinbase_vertex:r0,skinning_pars_vertex:o0,skinning_vertex:a0,skinnormal_vertex:l0,specularmap_fragment:c0,specularmap_pars_fragment:h0,tonemapping_fragment:u0,tonemapping_pars_fragment:d0,transmission_fragment:f0,transmission_pars_fragment:p0,uv_pars_fragment:m0,uv_pars_vertex:g0,uv_vertex:_0,worldpos_vertex:x0,background_vert:y0,background_frag:v0,backgroundCube_vert:M0,backgroundCube_frag:S0,cube_vert:b0,cube_frag:T0,depth_vert:E0,depth_frag:w0,distance_vert:A0,distance_frag:C0,equirect_vert:R0,equirect_frag:P0,linedashed_vert:I0,linedashed_frag:L0,meshbasic_vert:D0,meshbasic_frag:N0,meshlambert_vert:U0,meshlambert_frag:F0,meshmatcap_vert:O0,meshmatcap_frag:B0,meshnormal_vert:k0,meshnormal_frag:z0,meshphong_vert:V0,meshphong_frag:H0,meshphysical_vert:G0,meshphysical_frag:W0,meshtoon_vert:X0,meshtoon_frag:q0,points_vert:Y0,points_frag:Z0,shadow_vert:J0,shadow_frag:$0,sprite_vert:K0,sprite_frag:j0},ft={common:{diffuse:{value:new te(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Zt},alphaMap:{value:null},alphaMapTransform:{value:new Zt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Zt}},envmap:{envMap:{value:null},envMapRotation:{value:new Zt},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Zt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Zt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Zt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Zt},normalScale:{value:new Gt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Zt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Zt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Zt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Zt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new te(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new L},probesMax:{value:new L},probesResolution:{value:new L}},points:{diffuse:{value:new te(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Zt},alphaTest:{value:0},uvTransform:{value:new Zt}},sprite:{diffuse:{value:new te(16777215)},opacity:{value:1},center:{value:new Gt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Zt},alphaMap:{value:null},alphaMapTransform:{value:new Zt},alphaTest:{value:0}}},oi={basic:{uniforms:Ze([ft.common,ft.specularmap,ft.envmap,ft.aomap,ft.lightmap,ft.fog]),vertexShader:ie.meshbasic_vert,fragmentShader:ie.meshbasic_frag},lambert:{uniforms:Ze([ft.common,ft.specularmap,ft.envmap,ft.aomap,ft.lightmap,ft.emissivemap,ft.bumpmap,ft.normalmap,ft.displacementmap,ft.fog,ft.lights,{emissive:{value:new te(0)},envMapIntensity:{value:1}}]),vertexShader:ie.meshlambert_vert,fragmentShader:ie.meshlambert_frag},phong:{uniforms:Ze([ft.common,ft.specularmap,ft.envmap,ft.aomap,ft.lightmap,ft.emissivemap,ft.bumpmap,ft.normalmap,ft.displacementmap,ft.fog,ft.lights,{emissive:{value:new te(0)},specular:{value:new te(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:ie.meshphong_vert,fragmentShader:ie.meshphong_frag},standard:{uniforms:Ze([ft.common,ft.envmap,ft.aomap,ft.lightmap,ft.emissivemap,ft.bumpmap,ft.normalmap,ft.displacementmap,ft.roughnessmap,ft.metalnessmap,ft.fog,ft.lights,{emissive:{value:new te(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:ie.meshphysical_vert,fragmentShader:ie.meshphysical_frag},toon:{uniforms:Ze([ft.common,ft.aomap,ft.lightmap,ft.emissivemap,ft.bumpmap,ft.normalmap,ft.displacementmap,ft.gradientmap,ft.fog,ft.lights,{emissive:{value:new te(0)}}]),vertexShader:ie.meshtoon_vert,fragmentShader:ie.meshtoon_frag},matcap:{uniforms:Ze([ft.common,ft.bumpmap,ft.normalmap,ft.displacementmap,ft.fog,{matcap:{value:null}}]),vertexShader:ie.meshmatcap_vert,fragmentShader:ie.meshmatcap_frag},points:{uniforms:Ze([ft.points,ft.fog]),vertexShader:ie.points_vert,fragmentShader:ie.points_frag},dashed:{uniforms:Ze([ft.common,ft.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:ie.linedashed_vert,fragmentShader:ie.linedashed_frag},depth:{uniforms:Ze([ft.common,ft.displacementmap]),vertexShader:ie.depth_vert,fragmentShader:ie.depth_frag},normal:{uniforms:Ze([ft.common,ft.bumpmap,ft.normalmap,ft.displacementmap,{opacity:{value:1}}]),vertexShader:ie.meshnormal_vert,fragmentShader:ie.meshnormal_frag},sprite:{uniforms:Ze([ft.sprite,ft.fog]),vertexShader:ie.sprite_vert,fragmentShader:ie.sprite_frag},background:{uniforms:{uvTransform:{value:new Zt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:ie.background_vert,fragmentShader:ie.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Zt}},vertexShader:ie.backgroundCube_vert,fragmentShader:ie.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:ie.cube_vert,fragmentShader:ie.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:ie.equirect_vert,fragmentShader:ie.equirect_frag},distance:{uniforms:Ze([ft.common,ft.displacementmap,{referencePosition:{value:new L},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:ie.distance_vert,fragmentShader:ie.distance_frag},shadow:{uniforms:Ze([ft.lights,ft.fog,{color:{value:new te(0)},opacity:{value:1}}]),vertexShader:ie.shadow_vert,fragmentShader:ie.shadow_frag}};oi.physical={uniforms:Ze([oi.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Zt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Zt},clearcoatNormalScale:{value:new Gt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Zt},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Zt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Zt},sheen:{value:0},sheenColor:{value:new te(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Zt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Zt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Zt},transmissionSamplerSize:{value:new Gt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Zt},attenuationDistance:{value:0},attenuationColor:{value:new te(0)},specularColor:{value:new te(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Zt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Zt},anisotropyVector:{value:new Gt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Zt}}]),vertexShader:ie.meshphysical_vert,fragmentShader:ie.meshphysical_frag};var Nl={r:0,b:0,g:0},Q0=new we,Rf=new Zt;Rf.set(-1,0,0,0,1,0,0,0,1);function t_(n,t,e,i,s,r){let o=new te(0),a=s===!0?0:1,c,l,u=null,f=0,h=null;function d(S){let A=S.isScene===!0?S.background:null;if(A&&A.isTexture){let M=S.backgroundBlurriness>0;A=t.get(A,M)}return A}function m(S){let A=!1,M=d(S);M===null?g(o,a):M&&M.isColor&&(g(M,1),A=!0);let T=n.xr.getEnvironmentBlendMode();T==="additive"?e.buffers.color.setClear(0,0,0,1,r):T==="alpha-blend"&&e.buffers.color.setClear(0,0,0,0,r),(n.autoClear||A)&&(e.buffers.depth.setTest(!0),e.buffers.depth.setMask(!0),e.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function x(S,A){let M=d(A);M&&(M.isCubeTexture||M.mapping===Qr)?(l===void 0&&(l=new tn(new Ks(1,1,1),new Sn({name:"BackgroundCubeMaterial",uniforms:ms(oi.backgroundCube.uniforms),vertexShader:oi.backgroundCube.vertexShader,fragmentShader:oi.backgroundCube.fragmentShader,side:sn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),l.geometry.deleteAttribute("uv"),l.onBeforeRender=function(T,b,C){this.matrixWorld.copyPosition(C.matrixWorld)},Object.defineProperty(l.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(l)),l.material.uniforms.envMap.value=M,l.material.uniforms.backgroundBlurriness.value=A.backgroundBlurriness,l.material.uniforms.backgroundIntensity.value=A.backgroundIntensity,l.material.uniforms.backgroundRotation.value.setFromMatrix4(Q0.makeRotationFromEuler(A.backgroundRotation)).transpose(),M.isCubeTexture&&M.isRenderTargetTexture===!1&&l.material.uniforms.backgroundRotation.value.premultiply(Rf),l.material.toneMapped=he.getTransfer(M.colorSpace)!==ge,(u!==M||f!==M.version||h!==n.toneMapping)&&(l.material.needsUpdate=!0,u=M,f=M.version,h=n.toneMapping),l.layers.enableAll(),S.unshift(l,l.geometry,l.material,0,0,null)):M&&M.isTexture&&(c===void 0&&(c=new tn(new en(2,2),new Sn({name:"BackgroundMaterial",uniforms:ms(oi.background.uniforms),vertexShader:oi.background.vertexShader,fragmentShader:oi.background.fragmentShader,side:qi,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(c)),c.material.uniforms.t2D.value=M,c.material.uniforms.backgroundIntensity.value=A.backgroundIntensity,c.material.toneMapped=he.getTransfer(M.colorSpace)!==ge,M.matrixAutoUpdate===!0&&M.updateMatrix(),c.material.uniforms.uvTransform.value.copy(M.matrix),(u!==M||f!==M.version||h!==n.toneMapping)&&(c.material.needsUpdate=!0,u=M,f=M.version,h=n.toneMapping),c.layers.enableAll(),S.unshift(c,c.geometry,c.material,0,0,null))}function g(S,A){S.getRGB(Nl,yh(n)),e.buffers.color.setClear(Nl.r,Nl.g,Nl.b,A,r)}function p(){l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return o},setClearColor:function(S,A=1){o.set(S),a=A,g(o,a)},getClearAlpha:function(){return a},setClearAlpha:function(S){a=S,g(o,a)},render:m,addToRenderList:x,dispose:p}}function e_(n,t){let e=n.getParameter(n.MAX_VERTEX_ATTRIBS),i={},s=h(null),r=s,o=!1;function a(F,B,V,I,k){let W=!1,J=f(F,I,V,B);r!==J&&(r=J,l(r.object)),W=d(F,I,V,k),W&&m(F,I,V,k),k!==null&&t.update(k,n.ELEMENT_ARRAY_BUFFER),(W||o)&&(o=!1,M(F,B,V,I),k!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,t.get(k).buffer))}function c(){return n.createVertexArray()}function l(F){return n.bindVertexArray(F)}function u(F){return n.deleteVertexArray(F)}function f(F,B,V,I){let k=I.wireframe===!0,W=i[B.id];W===void 0&&(W={},i[B.id]=W);let J=F.isInstancedMesh===!0?F.id:0,et=W[J];et===void 0&&(et={},W[J]=et);let U=et[V.id];U===void 0&&(U={},et[V.id]=U);let q=U[k];return q===void 0&&(q=h(c()),U[k]=q),q}function h(F){let B=[],V=[],I=[];for(let k=0;k<e;k++)B[k]=0,V[k]=0,I[k]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:B,enabledAttributes:V,attributeDivisors:I,object:F,attributes:{},index:null}}function d(F,B,V,I){let k=r.attributes,W=B.attributes,J=0,et=V.getAttributes();for(let U in et)if(et[U].location>=0){let j=k[U],xt=W[U];if(xt===void 0&&(U==="instanceMatrix"&&F.instanceMatrix&&(xt=F.instanceMatrix),U==="instanceColor"&&F.instanceColor&&(xt=F.instanceColor)),j===void 0||j.attribute!==xt||xt&&j.data!==xt.data)return!0;J++}return r.attributesNum!==J||r.index!==I}function m(F,B,V,I){let k={},W=B.attributes,J=0,et=V.getAttributes();for(let U in et)if(et[U].location>=0){let j=W[U];j===void 0&&(U==="instanceMatrix"&&F.instanceMatrix&&(j=F.instanceMatrix),U==="instanceColor"&&F.instanceColor&&(j=F.instanceColor));let xt={};xt.attribute=j,j&&j.data&&(xt.data=j.data),k[U]=xt,J++}r.attributes=k,r.attributesNum=J,r.index=I}function x(){let F=r.newAttributes;for(let B=0,V=F.length;B<V;B++)F[B]=0}function g(F){p(F,0)}function p(F,B){let V=r.newAttributes,I=r.enabledAttributes,k=r.attributeDivisors;V[F]=1,I[F]===0&&(n.enableVertexAttribArray(F),I[F]=1),k[F]!==B&&(n.vertexAttribDivisor(F,B),k[F]=B)}function S(){let F=r.newAttributes,B=r.enabledAttributes;for(let V=0,I=B.length;V<I;V++)B[V]!==F[V]&&(n.disableVertexAttribArray(V),B[V]=0)}function A(F,B,V,I,k,W,J){J===!0?n.vertexAttribIPointer(F,B,V,k,W):n.vertexAttribPointer(F,B,V,I,k,W)}function M(F,B,V,I){x();let k=I.attributes,W=V.getAttributes(),J=B.defaultAttributeValues;for(let et in W){let U=W[et];if(U.location>=0){let q=k[et];if(q===void 0&&(et==="instanceMatrix"&&F.instanceMatrix&&(q=F.instanceMatrix),et==="instanceColor"&&F.instanceColor&&(q=F.instanceColor)),q!==void 0){let j=q.normalized,xt=q.itemSize,Mt=t.get(q);if(Mt===void 0)continue;let le=Mt.buffer,Vt=Mt.type,St=Mt.bytesPerElement,Y=Vt===n.INT||Vt===n.UNSIGNED_INT||q.gpuType===Ja;if(q.isInterleavedBufferAttribute){let K=q.data,it=K.stride,wt=q.offset;if(K.isInstancedInterleavedBuffer){for(let ot=0;ot<U.locationSize;ot++)p(U.location+ot,K.meshPerAttribute);F.isInstancedMesh!==!0&&I._maxInstanceCount===void 0&&(I._maxInstanceCount=K.meshPerAttribute*K.count)}else for(let ot=0;ot<U.locationSize;ot++)g(U.location+ot);n.bindBuffer(n.ARRAY_BUFFER,le);for(let ot=0;ot<U.locationSize;ot++)A(U.location+ot,xt/U.locationSize,Vt,j,it*St,(wt+xt/U.locationSize*ot)*St,Y)}else{if(q.isInstancedBufferAttribute){for(let K=0;K<U.locationSize;K++)p(U.location+K,q.meshPerAttribute);F.isInstancedMesh!==!0&&I._maxInstanceCount===void 0&&(I._maxInstanceCount=q.meshPerAttribute*q.count)}else for(let K=0;K<U.locationSize;K++)g(U.location+K);n.bindBuffer(n.ARRAY_BUFFER,le);for(let K=0;K<U.locationSize;K++)A(U.location+K,xt/U.locationSize,Vt,j,xt*St,xt/U.locationSize*K*St,Y)}}else if(J!==void 0){let j=J[et];if(j!==void 0)switch(j.length){case 2:n.vertexAttrib2fv(U.location,j);break;case 3:n.vertexAttrib3fv(U.location,j);break;case 4:n.vertexAttrib4fv(U.location,j);break;default:n.vertexAttrib1fv(U.location,j)}}}}S()}function T(){w();for(let F in i){let B=i[F];for(let V in B){let I=B[V];for(let k in I){let W=I[k];for(let J in W)u(W[J].object),delete W[J];delete I[k]}}delete i[F]}}function b(F){if(i[F.id]===void 0)return;let B=i[F.id];for(let V in B){let I=B[V];for(let k in I){let W=I[k];for(let J in W)u(W[J].object),delete W[J];delete I[k]}}delete i[F.id]}function C(F){for(let B in i){let V=i[B];for(let I in V){let k=V[I];if(k[F.id]===void 0)continue;let W=k[F.id];for(let J in W)u(W[J].object),delete W[J];delete k[F.id]}}}function y(F){for(let B in i){let V=i[B],I=F.isInstancedMesh===!0?F.id:0,k=V[I];if(k!==void 0){for(let W in k){let J=k[W];for(let et in J)u(J[et].object),delete J[et];delete k[W]}delete V[I],Object.keys(V).length===0&&delete i[B]}}}function w(){P(),o=!0,r!==s&&(r=s,l(r.object))}function P(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:a,reset:w,resetDefaultState:P,dispose:T,releaseStatesOfGeometry:b,releaseStatesOfObject:y,releaseStatesOfProgram:C,initAttributes:x,enableAttribute:g,disableUnusedAttributes:S}}function n_(n,t,e){let i;function s(c){i=c}function r(c,l){n.drawArrays(i,c,l),e.update(l,i,1)}function o(c,l,u){u!==0&&(n.drawArraysInstanced(i,c,l,u),e.update(l,i,u))}function a(c,l,u){if(u===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,c,0,l,0,u);let h=0;for(let d=0;d<u;d++)h+=l[d];e.update(h,i,1)}this.setMode=s,this.render=r,this.renderInstances=o,this.renderMultiDraw=a}function i_(n,t,e,i){let s;function r(){if(s!==void 0)return s;if(t.has("EXT_texture_filter_anisotropic")===!0){let C=t.get("EXT_texture_filter_anisotropic");s=n.getParameter(C.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function o(C){return!(C!==Dn&&i.convert(C)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(C){let y=C===Wn&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(C!==dn&&C!==Gn&&!y&&i.convert(C)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE))}function c(C){if(C==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";C="mediump"}return C==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=e.precision!==void 0?e.precision:"highp",u=c(l);u!==l&&(kt("WebGLRenderer:",l,"not supported, using",u,"instead."),l=u);let f=e.logarithmicDepthBuffer===!0,h=e.reversedDepthBuffer===!0&&t.has("EXT_clip_control");e.reversedDepthBuffer===!0&&h===!1&&kt("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");let d=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),m=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),x=n.getParameter(n.MAX_TEXTURE_SIZE),g=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),p=n.getParameter(n.MAX_VERTEX_ATTRIBS),S=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),A=n.getParameter(n.MAX_VARYING_VECTORS),M=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),T=n.getParameter(n.MAX_SAMPLES),b=n.getParameter(n.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:c,textureFormatReadable:o,textureTypeReadable:a,precision:l,logarithmicDepthBuffer:f,reversedDepthBuffer:h,maxTextures:d,maxVertexTextures:m,maxTextureSize:x,maxCubemapSize:g,maxAttributes:p,maxVertexUniforms:S,maxVaryings:A,maxFragmentUniforms:M,maxSamples:T,samples:b}}function s_(n){let t=this,e=null,i=0,s=!1,r=!1,o=new vn,a=new Zt,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(f,h){let d=f.length!==0||h||i!==0||s;return s=h,i=f.length,d},this.beginShadows=function(){r=!0,u(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(f,h){e=u(f,h,0)},this.setState=function(f,h,d){let m=f.clippingPlanes,x=f.clipIntersection,g=f.clipShadows,p=n.get(f);if(!s||m===null||m.length===0||r&&!g)r?u(null):l();else{let S=r?0:i,A=S*4,M=p.clippingState||null;c.value=M,M=u(m,h,A,d);for(let T=0;T!==A;++T)M[T]=e[T];p.clippingState=M,this.numIntersection=x?this.numPlanes:0,this.numPlanes+=S}};function l(){c.value!==e&&(c.value=e,c.needsUpdate=i>0),t.numPlanes=i,t.numIntersection=0}function u(f,h,d,m){let x=f!==null?f.length:0,g=null;if(x!==0){if(g=c.value,m!==!0||g===null){let p=d+x*4,S=h.matrixWorldInverse;a.getNormalMatrix(S),(g===null||g.length<p)&&(g=new Float32Array(p));for(let A=0,M=d;A!==x;++A,M+=4)o.copy(f[A]).applyMatrix4(S,a),o.normal.toArray(g,M),g[M+3]=o.constant}c.value=g,c.needsUpdate=!0}return t.numPlanes=x,t.numIntersection=0,g}}var cr=4,r_=6,o_=20,a_=256,ao=new tr,af=new te,Ch=null,Rh=0,Ph=0,Ih=!1,l_=new L,gs=new L,Fl=class{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(t,e=0,i=.1,s=100,r={}){let{size:o=256,position:a=l_}=r;Ch=this._renderer.getRenderTarget(),Rh=this._renderer.getActiveCubeFace(),Ph=this._renderer.getActiveMipmapLevel(),Ih=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(o);let c=this._allocateTargets();return c.depthBuffer=!0,this._sceneToCubeUV(t,i,s,c,a),e>0&&this._blur(c,0,0,e),this._applyPMREM(c),this._cleanup(c),c}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=hf(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=cf(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodMeshes.length;t++)this._lodMeshes[t].geometry.dispose()}_cleanup(t){this._renderer.setRenderTarget(Ch,Rh,Ph),this._renderer.xr.enabled=Ih,t.scissorTest=!1,lr(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===Yi||t.mapping===ps?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),Ch=this._renderer.getRenderTarget(),Rh=this._renderer.getActiveCubeFace(),Ph=this._renderer.getActiveMipmapLevel(),Ih=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let i=e||this._allocateTargets();return this._textureToCubeUV(t,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){let t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,i={magFilter:Ge,minFilter:Ge,generateMipmaps:!1,type:Wn,format:Dn,colorSpace:Dr,depthBuffer:!1},s=lf(t,e,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=lf(t,e,i);let{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods}=c_(r)),this._blurMaterial=u_(r,t,e),this._ggxMaterial=h_(r,t,e)}return s}_compileMaterial(t){let e=new tn(new Ne,t);this._renderer.compile(e,ao)}_sceneToCubeUV(t,e,i,s,r){let c=new Ye(90,1,e,i),l=[1,-1,1,1,1,1],u=[1,1,1,-1,-1,-1],f=this._renderer,h=f.autoClear,d=f.toneMapping;f.getClearColor(af),f.toneMapping=Vn,f.autoClear=!1,f.state.buffers.depth.getReversed()&&(f.setRenderTarget(s),f.clearDepth(),f.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new tn(new Ks,new Js({name:"PMREM.Background",side:sn,depthWrite:!1,depthTest:!1})));let x=this._backgroundBox,g=x.material,p=!1,S=t.background;S?S.isColor&&(g.color.copy(S),t.background=null,p=!0):(g.color.copy(af),p=!0);for(let A=0;A<6;A++){let M=A%3;M===0?(c.up.set(0,l[A],0),c.position.set(r.x,r.y,r.z),c.lookAt(r.x+u[A],r.y,r.z)):M===1?(c.up.set(0,0,l[A]),c.position.set(r.x,r.y,r.z),c.lookAt(r.x,r.y+u[A],r.z)):(c.up.set(0,l[A],0),c.position.set(r.x,r.y,r.z),c.lookAt(r.x,r.y,r.z+u[A]));let T=this._cubeSize;lr(s,M*T,A>2?T:0,T,T),f.setRenderTarget(s),p&&f.render(x,c),f.render(t,c)}f.toneMapping=d,f.autoClear=h,t.background=S}_textureToCubeUV(t,e){let i=this._renderer,s=t.mapping===Yi||t.mapping===ps;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=hf()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=cf());let r=s?this._cubemapMaterial:this._equirectMaterial,o=this._lodMeshes[0];o.material=r;let a=r.uniforms;a.envMap.value=t;let c=this._cubeSize;lr(e,0,0,3*c,2*c),i.setRenderTarget(e),i.render(o,ao)}_applyPMREM(t){let e=this._renderer,i=e.autoClear;e.autoClear=!1;let s=this._lodMeshes.length;for(let r=1;r<s;r++)this._applyGGXFilter(t,r-1,r);e.autoClear=i}_applyGGXFilter(t,e,i){let s=this._renderer,r=this._pingPongRenderTarget,o=this._ggxMaterial,a=this._lodMeshes[i];a.material=o;let c=o.uniforms,l=i/(this._lodMeshes.length-1),u=e/(this._lodMeshes.length-1),f=Math.sqrt(l*l-u*u),h=l*1.25,d=f*h,{_lodMax:m}=this,x=this._sizeLods[i],g=3*x*(i>m-cr?i-m+cr:0),p=4*(this._cubeSize-x);c.envMap.value=t.texture,c.roughness.value=d,c.mipInt.value=m-e,lr(r,g,p,3*x,2*x),s.setRenderTarget(r),s.render(a,ao),c.envMap.value=r.texture,c.roughness.value=0,c.mipInt.value=m-i,lr(t,g,p,3*x,2*x),s.setRenderTarget(t),s.render(a,ao)}_blur(t,e,i,s){let r=this._pingPongRenderTarget,o=Math.min(s,Math.PI)/Math.SQRT2;this._blurPass(t,r,e,i,o),this._blurPass(r,t,i,i,o)}_blurPass(t,e,i,s,r){let o=this._renderer,a=this._blurMaterial,c=this._lodMeshes[s];c.material=a;let l=a.uniforms;l.envMap.value=t.texture,l.sigma.value=r,l.mipInt.value=this._lodMax-i;let u=this._sizeLods[s],f=3*u*(s>this._lodMax-cr?s-this._lodMax+cr:0),h=4*(this._cubeSize-u);lr(e,f,h,3*u,2*u),o.setRenderTarget(e),o.render(c,ao)}};function c_(n){let t=[],e=[],i=n,s=n-cr+1+r_;for(let r=0;r<s;r++){let o=Math.pow(2,i);t.push(o);let a=1/(o-2),c=-a,l=1+a,u=[c,c,l,c,l,l,c,c,l,l,c,l],f=6,h=6,d=3,m=new Float32Array(d*h*f),x=new Float32Array(d*h*f);for(let p=0;p<f;p++){let S=p%3*2/3-1,A=p>2?0:-1,M=[S,A,0,S+2/3,A,0,S+2/3,A+1,0,S,A,0,S+2/3,A+1,0,S,A+1,0];m.set(M,d*h*p);for(let T=0;T<h;T++){let b=u[T*2]*2-1,C=u[T*2+1]*2-1;p===0?gs.set(1,C,b):p===1?gs.set(-b,1,-C):p===2?gs.set(-b,C,1):p===3?gs.set(-1,C,-b):p===4?gs.set(-b,-1,C):gs.set(b,C,-1),gs.toArray(x,(p*h+T)*d)}}let g=new Ne;g.setAttribute("position",new In(m,d)),g.setAttribute("outputDirection",new In(x,d)),e.push(new tn(g,null)),i>cr&&i--}return{lodMeshes:e,sizeLods:t}}function lf(n,t,e){let i=new hn(n,t,e);return i.texture.mapping=Qr,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function lr(n,t,e,i,s){n.viewport.set(t,e,i,s),n.scissor.set(t,e,i,s)}function h_(n,t,e){return new Sn({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:a_,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:kl(),fragmentShader:`

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
		`,blending:si,depthTest:!1,depthWrite:!1})}function u_(n,t,e){return new Sn({name:"SphericalGaussianBlur",defines:{SAMPLES:o_,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},sigma:{value:0},mipInt:{value:0}},vertexShader:kl(),fragmentShader:`

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
		`,blending:si,depthTest:!1,depthWrite:!1})}function cf(){return new Sn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:kl(),fragmentShader:`

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
		`,blending:si,depthTest:!1,depthWrite:!1})}function hf(){return new Sn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:kl(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:si,depthTest:!1,depthWrite:!1})}function kl(){return`

		precision mediump float;
		precision mediump int;

		attribute vec3 outputDirection;

		varying vec3 vOutputDirection;

		void main() {

			vOutputDirection = outputDirection;
			gl_Position = vec4( position, 1.0 );

		}
	`}var Ol=class extends hn{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;let i={width:t,height:t,depth:1},s=[i,i,i,i,i,i];this.texture=new Vr(s),this._setTextureOptions(e),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;let i={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new Ks(5,5,5),r=new Sn({name:"CubemapFromEquirect",uniforms:ms(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:sn,blending:si});r.uniforms.tEquirect.value=e;let o=new tn(s,r),a=e.minFilter;return e.minFilter===Zi&&(e.minFilter=Ge),new Ga(1,10,this).update(t,o),e.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(t,e=!0,i=!0,s=!0){let r=t.getRenderTarget();for(let o=0;o<6;o++)t.setRenderTarget(this,o),t.clear(e,i,s);t.setRenderTarget(r)}};function d_(n){let t=new WeakMap,e=new WeakMap,i=null;function s(h,d=!1){return h==null?null:d?o(h):r(h)}function r(h){if(h&&h.isTexture){let d=h.mapping;if(d===qa||d===Ya)if(t.has(h)){let m=t.get(h).texture;return a(m,h.mapping)}else{let m=h.image;if(m&&m.height>0){let x=new Ol(m.height);return x.fromEquirectangularTexture(n,h),t.set(h,x),h.addEventListener("dispose",l),a(x.texture,h.mapping)}else return null}}return h}function o(h){if(h&&h.isTexture){let d=h.mapping,m=d===qa||d===Ya,x=d===Yi||d===ps;if(m||x){let g=e.get(h),p=g!==void 0?g.texture.pmremVersion:0;if(h.isRenderTargetTexture&&h.pmremVersion!==p)return i===null&&(i=new Fl(n)),g=m?i.fromEquirectangular(h,g):i.fromCubemap(h,g),g.texture.pmremVersion=h.pmremVersion,e.set(h,g),g.texture;if(g!==void 0)return g.texture;{let S=h.image;return m&&S&&S.height>0||x&&S&&c(S)?(i===null&&(i=new Fl(n)),g=m?i.fromEquirectangular(h):i.fromCubemap(h),g.texture.pmremVersion=h.pmremVersion,e.set(h,g),h.addEventListener("dispose",u),g.texture):null}}}return h}function a(h,d){return d===qa?h.mapping=Yi:d===Ya&&(h.mapping=ps),h}function c(h){let d=0,m=6;for(let x=0;x<m;x++)h[x]!==void 0&&d++;return d===m}function l(h){let d=h.target;d.removeEventListener("dispose",l);let m=t.get(d);m!==void 0&&(t.delete(d),m.dispose())}function u(h){let d=h.target;d.removeEventListener("dispose",u);let m=e.get(d);m!==void 0&&(e.delete(d),m.dispose())}function f(){t=new WeakMap,e=new WeakMap,i!==null&&(i.dispose(),i=null)}return{get:s,dispose:f}}function f_(n){let t={};function e(i){if(t[i]!==void 0)return t[i];let s=n.getExtension(i);return t[i]=s,s}return{has:function(i){return e(i)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(i){let s=e(i);return s===null&&cs("WebGLRenderer: "+i+" extension not supported."),s}}}function p_(n,t,e,i){let s={},r=new WeakMap;function o(f){let h=f.target;h.index!==null&&t.remove(h.index);for(let m in h.attributes)t.remove(h.attributes[m]);h.removeEventListener("dispose",o),delete s[h.id];let d=r.get(h);d&&(t.remove(d),r.delete(h)),i.releaseStatesOfGeometry(h),h.isInstancedBufferGeometry===!0&&delete h._maxInstanceCount,e.memory.geometries--}function a(f,h){return s[h.id]===!0||(h.addEventListener("dispose",o),s[h.id]=!0,e.memory.geometries++),h}function c(f){let h=f.attributes;for(let d in h)t.update(h[d],n.ARRAY_BUFFER)}function l(f){let h=[],d=f.index,m=f.attributes.position,x=0;if(m===void 0)return;if(d!==null){let S=d.array;x=d.version;for(let A=0,M=S.length;A<M;A+=3){let T=S[A+0],b=S[A+1],C=S[A+2];h.push(T,b,b,C,C,T)}}else{let S=m.array;x=m.version;for(let A=0,M=S.length/3-1;A<M;A+=3){let T=A+0,b=A+1,C=A+2;h.push(T,b,b,C,C,T)}}let g=new(m.count>=65535?zr:kr)(h,1);g.version=x;let p=r.get(f);p&&t.remove(p),r.set(f,g)}function u(f){let h=r.get(f);if(h){let d=f.index;d!==null&&h.version<d.version&&l(f)}else l(f);return r.get(f)}return{get:a,update:c,getWireframeAttribute:u}}function m_(n,t,e){let i;function s(f){i=f}let r,o;function a(f){r=f.type,o=f.bytesPerElement}function c(f,h){n.drawElements(i,h,r,f*o),e.update(h,i,1)}function l(f,h,d){d!==0&&(n.drawElementsInstanced(i,h,r,f*o,d),e.update(h,i,d))}function u(f,h,d){if(d===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,h,0,r,f,0,d);let x=0;for(let g=0;g<d;g++)x+=h[g];e.update(x,i,1)}this.setMode=s,this.setIndex=a,this.render=c,this.renderInstances=l,this.renderMultiDraw=u}function g_(n){let t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function i(r,o,a){switch(e.calls++,o){case n.TRIANGLES:e.triangles+=a*(r/3);break;case n.LINES:e.lines+=a*(r/2);break;case n.LINE_STRIP:e.lines+=a*(r-1);break;case n.LINE_LOOP:e.lines+=a*r;break;case n.POINTS:e.points+=a*r;break;default:Wt("WebGLInfo: Unknown draw mode:",o);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:i}}function __(n,t,e){let i=new WeakMap,s=new Ae;function r(o,a,c){let l=o.morphTargetInfluences,u=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,f=u!==void 0?u.length:0,h=i.get(a);if(h===void 0||h.count!==f){let w=function(){C.dispose(),i.delete(a),a.removeEventListener("dispose",w)};h!==void 0&&h.texture.dispose();let d=a.morphAttributes.position!==void 0,m=a.morphAttributes.normal!==void 0,x=a.morphAttributes.color!==void 0,g=a.morphAttributes.position||[],p=a.morphAttributes.normal||[],S=a.morphAttributes.color||[],A=0;d===!0&&(A=1),m===!0&&(A=2),x===!0&&(A=3);let M=a.attributes.position.count*A,T=1;M>t.maxTextureSize&&(T=Math.ceil(M/t.maxTextureSize),M=t.maxTextureSize);let b=new Float32Array(M*T*4*f),C=new Fr(b,M,T,f);C.type=Gn,C.needsUpdate=!0;let y=A*4;for(let P=0;P<f;P++){let F=g[P],B=p[P],V=S[P],I=M*T*4*P;for(let k=0;k<F.count;k++){let W=k*y;d===!0&&(s.fromBufferAttribute(F,k),b[I+W+0]=s.x,b[I+W+1]=s.y,b[I+W+2]=s.z,b[I+W+3]=0),m===!0&&(s.fromBufferAttribute(B,k),b[I+W+4]=s.x,b[I+W+5]=s.y,b[I+W+6]=s.z,b[I+W+7]=0),x===!0&&(s.fromBufferAttribute(V,k),b[I+W+8]=s.x,b[I+W+9]=s.y,b[I+W+10]=s.z,b[I+W+11]=V.itemSize===4?s.w:1)}}h={count:f,texture:C,size:new Gt(M,T)},i.set(a,h),a.addEventListener("dispose",w)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)c.getUniforms().setValue(n,"morphTexture",o.morphTexture,e);else{let d=0;for(let x=0;x<l.length;x++)d+=l[x];let m=a.morphTargetsRelative?1:1-d;c.getUniforms().setValue(n,"morphTargetBaseInfluence",m),c.getUniforms().setValue(n,"morphTargetInfluences",l)}c.getUniforms().setValue(n,"morphTargetsTexture",h.texture,e),c.getUniforms().setValue(n,"morphTargetsTextureSize",h.size)}return{update:r}}function x_(n,t,e,i,s){let r=new WeakMap;function o(l){let u=s.render.frame,f=l.geometry,h=t.get(l,f);if(r.get(h)!==u&&(t.update(h),r.set(h,u)),l.isInstancedMesh&&(l.hasEventListener("dispose",c)===!1&&l.addEventListener("dispose",c),r.get(l)!==u&&(e.update(l.instanceMatrix,n.ARRAY_BUFFER),l.instanceColor!==null&&e.update(l.instanceColor,n.ARRAY_BUFFER),r.set(l,u))),l.isSkinnedMesh){let d=l.skeleton;r.get(d)!==u&&(d.update(),r.set(d,u))}return h}function a(){r=new WeakMap}function c(l){let u=l.target;u.removeEventListener("dispose",c),i.releaseStatesOfObject(u),e.remove(u.instanceMatrix),u.instanceColor!==null&&e.remove(u.instanceColor)}return{update:o,dispose:a}}var y_={[eh]:"LINEAR_TONE_MAPPING",[nh]:"REINHARD_TONE_MAPPING",[ih]:"CINEON_TONE_MAPPING",[jr]:"ACES_FILMIC_TONE_MAPPING",[rh]:"AGX_TONE_MAPPING",[oh]:"NEUTRAL_TONE_MAPPING",[sh]:"CUSTOM_TONE_MAPPING"};function v_(n,t,e,i,s,r){let o=new hn(t,e,{type:n,depthBuffer:s,stencilBuffer:r,samples:i?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1}),a=null,c=null,l=new Ne;l.setAttribute("position",new be([-1,3,0,-1,-1,0,3,-1,0],3)),l.setAttribute("uv",new be([0,2,0,0,2,0],2));let u=new Ca({uniforms:{tDiffuse:{value:null}},vertexShader:`
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
			}`,depthTest:!1,depthWrite:!1}),f=new tn(l,u),h=new tr(-1,1,1,-1,0,1),d=null,m=null,x=!1,g,p=null,S=[],A=!1;this.setSize=function(M,T){o.setSize(M,T),a!==null&&a.setSize(M,T),c!==null&&c.setSize(M,T);for(let b=0;b<S.length;b++){let C=S[b];C.setSize&&C.setSize(M,T)}},this.setEffects=function(M){S=M,A=S.length>0&&S[0].isRenderPass===!0;let T=o.width,b=o.height;S.length>0&&a===null&&(a=new hn(T,b,{type:Wn,depthBuffer:!1,stencilBuffer:!1}),c=new hn(T,b,{type:Wn,depthBuffer:!1,stencilBuffer:!1}));for(let C=0;C<S.length;C++){let y=S[C];y.setSize&&y.setSize(T,b)}},this.begin=function(M,T){if(x||M.toneMapping===Vn&&S.length===0)return!1;if(p=T,T!==null){let b=T.width,C=T.height;(o.width!==b||o.height!==C)&&this.setSize(b,C)}return A===!1&&M.setRenderTarget(o),g=M.toneMapping,M.toneMapping=Vn,!0},this.hasRenderPass=function(){return A},this.end=function(M,T){M.toneMapping=g,x=!0;let b=o,C=a;for(let y=0;y<S.length;y++){let w=S[y];w.enabled!==!1&&(w.render(M,C,b,T),w.needsSwap!==!1&&(b=C,C=C===a?c:a))}if(d!==M.outputColorSpace||m!==M.toneMapping){d=M.outputColorSpace,m=M.toneMapping,u.defines={},he.getTransfer(d)===ge&&(u.defines.SRGB_TRANSFER="");let y=y_[m];y&&(u.defines[y]=""),u.needsUpdate=!0}u.uniforms.tDiffuse.value=b.texture,M.setRenderTarget(p),M.render(f,h),p=null,x=!1},this.isCompositing=function(){return x},this.dispose=function(){o.dispose(),a!==null&&a.dispose(),c!==null&&c.dispose(),l.dispose(),u.dispose()}}var Pf=new cn,Nh=new Bi(1,1),If=new Fr,Lf=new ba,Df=new Vr,uf=[],df=[],ff=new Float32Array(16),pf=new Float32Array(9),mf=new Float32Array(4);function ur(n,t,e){let i=n[0];if(i<=0||i>0)return n;let s=t*e,r=uf[s];if(r===void 0&&(r=new Float32Array(s),uf[s]=r),t!==0){i.toArray(r,0);for(let o=1,a=0;o!==t;++o)a+=e,n[o].toArray(r,a)}return r}function Oe(n,t){if(n.length!==t.length)return!1;for(let e=0,i=n.length;e<i;e++)if(n[e]!==t[e])return!1;return!0}function Be(n,t){for(let e=0,i=t.length;e<i;e++)n[e]=t[e]}function zl(n,t){let e=df[t];e===void 0&&(e=new Int32Array(t),df[t]=e);for(let i=0;i!==t;++i)e[i]=n.allocateTextureUnit();return e}function M_(n,t){let e=this.cache;e[0]!==t&&(n.uniform1f(this.addr,t),e[0]=t)}function S_(n,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Oe(e,t))return;n.uniform2fv(this.addr,t),Be(e,t)}}function b_(n,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(n.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(Oe(e,t))return;n.uniform3fv(this.addr,t),Be(e,t)}}function T_(n,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Oe(e,t))return;n.uniform4fv(this.addr,t),Be(e,t)}}function E_(n,t){let e=this.cache,i=t.elements;if(i===void 0){if(Oe(e,t))return;n.uniformMatrix2fv(this.addr,!1,t),Be(e,t)}else{if(Oe(e,i))return;mf.set(i),n.uniformMatrix2fv(this.addr,!1,mf),Be(e,i)}}function w_(n,t){let e=this.cache,i=t.elements;if(i===void 0){if(Oe(e,t))return;n.uniformMatrix3fv(this.addr,!1,t),Be(e,t)}else{if(Oe(e,i))return;pf.set(i),n.uniformMatrix3fv(this.addr,!1,pf),Be(e,i)}}function A_(n,t){let e=this.cache,i=t.elements;if(i===void 0){if(Oe(e,t))return;n.uniformMatrix4fv(this.addr,!1,t),Be(e,t)}else{if(Oe(e,i))return;ff.set(i),n.uniformMatrix4fv(this.addr,!1,ff),Be(e,i)}}function C_(n,t){let e=this.cache;e[0]!==t&&(n.uniform1i(this.addr,t),e[0]=t)}function R_(n,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Oe(e,t))return;n.uniform2iv(this.addr,t),Be(e,t)}}function P_(n,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Oe(e,t))return;n.uniform3iv(this.addr,t),Be(e,t)}}function I_(n,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Oe(e,t))return;n.uniform4iv(this.addr,t),Be(e,t)}}function L_(n,t){let e=this.cache;e[0]!==t&&(n.uniform1ui(this.addr,t),e[0]=t)}function D_(n,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Oe(e,t))return;n.uniform2uiv(this.addr,t),Be(e,t)}}function N_(n,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Oe(e,t))return;n.uniform3uiv(this.addr,t),Be(e,t)}}function U_(n,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Oe(e,t))return;n.uniform4uiv(this.addr,t),Be(e,t)}}function F_(n,t,e){let i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s);let r;this.type===n.SAMPLER_2D_SHADOW?(Nh.compareFunction=e.isReversedDepthBuffer()?Dl:Ll,r=Nh):r=Pf,e.setTexture2D(t||r,s)}function O_(n,t,e){let i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),e.setTexture3D(t||Lf,s)}function B_(n,t,e){let i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),e.setTextureCube(t||Df,s)}function k_(n,t,e){let i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),e.setTexture2DArray(t||If,s)}function z_(n){switch(n){case 5126:return M_;case 35664:return S_;case 35665:return b_;case 35666:return T_;case 35674:return E_;case 35675:return w_;case 35676:return A_;case 5124:case 35670:return C_;case 35667:case 35671:return R_;case 35668:case 35672:return P_;case 35669:case 35673:return I_;case 5125:return L_;case 36294:return D_;case 36295:return N_;case 36296:return U_;case 35678:case 36198:case 36298:case 36306:case 35682:return F_;case 35679:case 36299:case 36307:return O_;case 35680:case 36300:case 36308:case 36293:return B_;case 36289:case 36303:case 36311:case 36292:return k_}}function V_(n,t){n.uniform1fv(this.addr,t)}function H_(n,t){let e=ur(t,this.size,2);n.uniform2fv(this.addr,e)}function G_(n,t){let e=ur(t,this.size,3);n.uniform3fv(this.addr,e)}function W_(n,t){let e=ur(t,this.size,4);n.uniform4fv(this.addr,e)}function X_(n,t){let e=ur(t,this.size,4);n.uniformMatrix2fv(this.addr,!1,e)}function q_(n,t){let e=ur(t,this.size,9);n.uniformMatrix3fv(this.addr,!1,e)}function Y_(n,t){let e=ur(t,this.size,16);n.uniformMatrix4fv(this.addr,!1,e)}function Z_(n,t){n.uniform1iv(this.addr,t)}function J_(n,t){n.uniform2iv(this.addr,t)}function $_(n,t){n.uniform3iv(this.addr,t)}function K_(n,t){n.uniform4iv(this.addr,t)}function j_(n,t){n.uniform1uiv(this.addr,t)}function Q_(n,t){n.uniform2uiv(this.addr,t)}function tx(n,t){n.uniform3uiv(this.addr,t)}function ex(n,t){n.uniform4uiv(this.addr,t)}function nx(n,t,e){let i=this.cache,s=t.length,r=zl(e,s);Oe(i,r)||(n.uniform1iv(this.addr,r),Be(i,r));let o;this.type===n.SAMPLER_2D_SHADOW?o=Nh:o=Pf;for(let a=0;a!==s;++a)e.setTexture2D(t[a]||o,r[a])}function ix(n,t,e){let i=this.cache,s=t.length,r=zl(e,s);Oe(i,r)||(n.uniform1iv(this.addr,r),Be(i,r));for(let o=0;o!==s;++o)e.setTexture3D(t[o]||Lf,r[o])}function sx(n,t,e){let i=this.cache,s=t.length,r=zl(e,s);Oe(i,r)||(n.uniform1iv(this.addr,r),Be(i,r));for(let o=0;o!==s;++o)e.setTextureCube(t[o]||Df,r[o])}function rx(n,t,e){let i=this.cache,s=t.length,r=zl(e,s);Oe(i,r)||(n.uniform1iv(this.addr,r),Be(i,r));for(let o=0;o!==s;++o)e.setTexture2DArray(t[o]||If,r[o])}function ox(n){switch(n){case 5126:return V_;case 35664:return H_;case 35665:return G_;case 35666:return W_;case 35674:return X_;case 35675:return q_;case 35676:return Y_;case 5124:case 35670:return Z_;case 35667:case 35671:return J_;case 35668:case 35672:return $_;case 35669:case 35673:return K_;case 5125:return j_;case 36294:return Q_;case 36295:return tx;case 36296:return ex;case 35678:case 36198:case 36298:case 36306:case 35682:return nx;case 35679:case 36299:case 36307:return ix;case 35680:case 36300:case 36308:case 36293:return sx;case 36289:case 36303:case 36311:case 36292:return rx}}var Uh=class{constructor(t,e,i){this.id=t,this.addr=i,this.cache=[],this.type=e.type,this.setValue=z_(e.type)}},Fh=class{constructor(t,e,i){this.id=t,this.addr=i,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=ox(e.type)}},Oh=class{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,i){let s=this.seq;for(let r=0,o=s.length;r!==o;++r){let a=s[r];a.setValue(t,e[a.id],i)}}},Lh=/(\w+)(\])?(\[|\.)?/g;function gf(n,t){n.seq.push(t),n.map[t.id]=t}function ax(n,t,e){let i=n.name,s=i.length;for(Lh.lastIndex=0;;){let r=Lh.exec(i),o=Lh.lastIndex,a=r[1],c=r[2]==="]",l=r[3];if(c&&(a=a|0),l===void 0||l==="["&&o+2===s){gf(e,l===void 0?new Uh(a,n,t):new Fh(a,n,t));break}else{let f=e.map[a];f===void 0&&(f=new Oh(a),gf(e,f)),e=f}}}var hr=class{constructor(t,e){this.seq=[],this.map={};let i=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let o=0;o<i;++o){let a=t.getActiveUniform(e,o),c=t.getUniformLocation(e,a.name);ax(a,c,this)}let s=[],r=[];for(let o of this.seq)o.type===t.SAMPLER_2D_SHADOW||o.type===t.SAMPLER_CUBE_SHADOW||o.type===t.SAMPLER_2D_ARRAY_SHADOW?s.push(o):r.push(o);s.length>0&&(this.seq=s.concat(r))}setValue(t,e,i,s){let r=this.map[e];r!==void 0&&r.setValue(t,i,s)}setOptional(t,e,i){let s=e[i];s!==void 0&&this.setValue(t,i,s)}static upload(t,e,i,s){for(let r=0,o=e.length;r!==o;++r){let a=e[r],c=i[a.id];c.needsUpdate!==!1&&a.setValue(t,c.value,s)}}static seqWithValue(t,e){let i=[];for(let s=0,r=t.length;s!==r;++s){let o=t[s];o.id in e&&i.push(o)}return i}};function _f(n,t,e){let i=n.createShader(t);return n.shaderSource(i,e),n.compileShader(i),i}var lx=37297,cx=0;function hx(n,t){let e=n.split(`
`),i=[],s=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let o=s;o<r;o++){let a=o+1;i.push(`${a===t?">":" "} ${a}: ${e[o]}`)}return i.join(`
`)}var xf=new Zt;function ux(n){he._getMatrix(xf,he.workingColorSpace,n);let t=`mat3( ${xf.elements.map(e=>e.toFixed(4))} )`;switch(he.getTransfer(n)){case Nr:return[t,"LinearTransferOETF"];case ge:return[t,"sRGBTransferOETF"];default:return kt("WebGLProgram: Unsupported color space: ",n),[t,"LinearTransferOETF"]}}function yf(n,t,e){let i=n.getShaderParameter(t,n.COMPILE_STATUS),r=(n.getShaderInfoLog(t)||"").trim();if(i&&r==="")return"";let o=/ERROR: 0:(\d+)/.exec(r);if(o){let a=parseInt(o[1]);return e.toUpperCase()+`

`+r+`

`+hx(n.getShaderSource(t),a)}else return r}function dx(n,t){let e=ux(t);return[`vec4 ${n}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}var fx={[eh]:"Linear",[nh]:"Reinhard",[ih]:"Cineon",[jr]:"ACESFilmic",[rh]:"AgX",[oh]:"Neutral",[sh]:"Custom"};function px(n,t){let e=fx[t];return e===void 0?(kt("WebGLProgram: Unsupported toneMapping:",t),"vec3 "+n+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+n+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}var Ul=new L;function mx(){he.getLuminanceCoefficients(Ul);let n=Ul.x.toFixed(4),t=Ul.y.toFixed(4),e=Ul.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${n}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function gx(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(co).join(`
`)}function _x(n){let t=[];for(let e in n){let i=n[e];i!==!1&&t.push("#define "+e+" "+i)}return t.join(`
`)}function xx(n,t){let e={},i=n.getProgramParameter(t,n.ACTIVE_ATTRIBUTES);for(let s=0;s<i;s++){let r=n.getActiveAttrib(t,s),o=r.name,a=1;r.type===n.FLOAT_MAT2&&(a=2),r.type===n.FLOAT_MAT3&&(a=3),r.type===n.FLOAT_MAT4&&(a=4),e[o]={type:r.type,location:n.getAttribLocation(t,o),locationSize:a}}return e}function co(n){return n!==""}function vf(n,t){let e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return n.replace(/NUM_SUN_LIGHTS/g,t.numSunLights).replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,t.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Mf(n,t){return n.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}var yx=/^[ \t]*#include +<([\w\d./]+)>/gm;function Bh(n){return n.replace(yx,Mx)}var vx=new Map;function Mx(n,t){let e=ie[t];if(e===void 0){let i=vx.get(t);if(i!==void 0)e=ie[i],kt('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,i);else throw new Error("THREE.WebGLProgram: Can not resolve #include <"+t+">")}return Bh(e)}var Sx=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Sf(n){return n.replace(Sx,bx)}function bx(n,t,e,i){let s="";for(let r=parseInt(t);r<parseInt(e);r++)s+=i.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function bf(n){let t=`precision ${n.precision} float;
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
#define LOW_PRECISION`),t}var Tx={[Kr]:"SHADOWMAP_TYPE_PCF",[ir]:"SHADOWMAP_TYPE_VSM"};function Ex(n){return Tx[n.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}var wx={[Yi]:"ENVMAP_TYPE_CUBE",[ps]:"ENVMAP_TYPE_CUBE",[Qr]:"ENVMAP_TYPE_CUBE_UV"};function Ax(n){return n.envMap===!1?"ENVMAP_TYPE_CUBE":wx[n.envMapMode]||"ENVMAP_TYPE_CUBE"}var Cx={[ps]:"ENVMAP_MODE_REFRACTION"};function Rx(n){return n.envMap===!1?"ENVMAP_MODE_REFLECTION":Cx[n.envMapMode]||"ENVMAP_MODE_REFLECTION"}var Px={[th]:"ENVMAP_BLENDING_MULTIPLY",[kd]:"ENVMAP_BLENDING_MIX",[zd]:"ENVMAP_BLENDING_ADD"};function Ix(n){return n.envMap===!1?"ENVMAP_BLENDING_NONE":Px[n.combine]||"ENVMAP_BLENDING_NONE"}function Lx(n){let t=n.envMapCubeUVHeight;if(t===null)return null;let e=Math.log2(t)-2,i=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),112)),texelHeight:i,maxMip:e}}function Dx(n,t,e,i){let s=n.getContext(),r=e.defines,o=e.vertexShader,a=e.fragmentShader,c=Ex(e),l=Ax(e),u=Rx(e),f=Ix(e),h=Lx(e),d=gx(e),m=_x(r),x=s.createProgram(),g,p,S=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(g=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m].filter(co).join(`
`),g.length>0&&(g+=`
`),p=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m].filter(co).join(`
`),p.length>0&&(p+=`
`)):(g=[bf(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+u:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexNormals?"#define HAS_NORMAL":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(co).join(`
`),p=[bf(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+l:"",e.envMap?"#define "+u:"",e.envMap?"#define "+f:"",h?"#define CUBEUV_TEXEL_WIDTH "+h.texelWidth:"",h?"#define CUBEUV_TEXEL_HEIGHT "+h.texelHeight:"",h?"#define CUBEUV_MAX_MIP "+h.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.retroreflection?"#define USE_RETROREFLECTION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor?"#define USE_COLOR":"",e.vertexAlphas||e.batchingColor?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.numLightProbeGrids>0?"#define USE_LIGHT_PROBES_GRID":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==Vn?"#define TONE_MAPPING":"",e.toneMapping!==Vn?ie.tonemapping_pars_fragment:"",e.toneMapping!==Vn?px("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",ie.colorspace_pars_fragment,dx("linearToOutputTexel",e.outputColorSpace),mx(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(co).join(`
`)),o=Bh(o),o=vf(o,e),o=Mf(o,e),a=Bh(a),a=vf(a,e),a=Mf(a,e),o=Sf(o),a=Sf(a),e.isRawShaderMaterial!==!0&&(S=`#version 300 es
`,g=[d,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+g,p=["#define varying in",e.glslVersion===mh?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===mh?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);let A=S+g+o,M=S+p+a,T=_f(s,s.VERTEX_SHADER,A),b=_f(s,s.FRAGMENT_SHADER,M);s.attachShader(x,T),s.attachShader(x,b),e.index0AttributeName!==void 0?s.bindAttribLocation(x,0,e.index0AttributeName):e.hasPositionAttribute===!0&&s.bindAttribLocation(x,0,"position"),s.linkProgram(x);function C(F){if(n.debug.checkShaderErrors){let B=s.getProgramInfoLog(x)||"",V=s.getShaderInfoLog(T)||"",I=s.getShaderInfoLog(b)||"",k=B.trim(),W=V.trim(),J=I.trim(),et=!0,U=!0;if(s.getProgramParameter(x,s.LINK_STATUS)===!1)if(et=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(s,x,T,b);else{let q=yf(s,T,"vertex"),j=yf(s,b,"fragment");Wt("WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(x,s.VALIDATE_STATUS)+`

Material Name: `+F.name+`
Material Type: `+F.type+`

Program Info Log: `+k+`
`+q+`
`+j)}else k!==""?kt("WebGLProgram: Program Info Log:",k):(W===""||J==="")&&(U=!1);U&&(F.diagnostics={runnable:et,programLog:k,vertexShader:{log:W,prefix:g},fragmentShader:{log:J,prefix:p}})}s.deleteShader(T),s.deleteShader(b),y=new hr(s,x),w=xx(s,x)}let y;this.getUniforms=function(){return y===void 0&&C(this),y};let w;this.getAttributes=function(){return w===void 0&&C(this),w};let P=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return P===!1&&(P=s.getProgramParameter(x,lx)),P},this.destroy=function(){i.releaseStatesOfProgram(this),s.deleteProgram(x),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=cx++,this.cacheKey=t,this.usedTimes=1,this.program=x,this.vertexShader=T,this.fragmentShader=b,this}var Nx=0,kh=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t,e,i){let s=this._getShaderCacheForMaterial(t);return s.has(e)===!1&&(s.add(e),e.usedTimes++),s.has(i)===!1&&(s.add(i),i.usedTimes++),this}remove(t){let e=this.materialCache.get(t);for(let i of e)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(t),this}getVertexShaderStage(t){return this._getShaderStage(t.vertexShader)}getFragmentShaderStage(t){return this._getShaderStage(t.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){let e=this.materialCache,i=e.get(t);return i===void 0&&(i=new Set,e.set(t,i)),i}_getShaderStage(t){let e=this.shaderCache,i=e.get(t);return i===void 0&&(i=new zh(t),e.set(t,i)),i}},zh=class{constructor(t){this.id=Nx++,this.code=t,this.usedTimes=0}};function Ux(n){return n===$i||n===ro||n===oo}function Fx(n,t,e,i,s,r){let o=new Or,a=new kh,c=new Set,l=[],u=new Map,f=i.logarithmicDepthBuffer,h=i.precision,d={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function m(y){return c.add(y),y===0?"uv":`uv${y}`}function x(y,w,P,F,B,V){let I=F.fog,k=B.geometry,W=y.isMeshStandardMaterial||y.isMeshLambertMaterial||y.isMeshPhongMaterial?F.environment:null,J=y.isMeshStandardMaterial||y.isMeshLambertMaterial&&!y.envMap||y.isMeshPhongMaterial&&!y.envMap,et=t.get(y.envMap||W,J),U=et&&et.mapping===Qr?et.image.height:null,q=d[y.type];y.precision!==null&&(h=i.getMaxPrecision(y.precision),h!==y.precision&&kt("WebGLProgram.getParameters:",y.precision,"not supported, using",h,"instead."));let j=k.morphAttributes.position||k.morphAttributes.normal||k.morphAttributes.color,xt=j!==void 0?j.length:0,Mt=0;k.morphAttributes.position!==void 0&&(Mt=1),k.morphAttributes.normal!==void 0&&(Mt=2),k.morphAttributes.color!==void 0&&(Mt=3);let le,Vt,St,Y;if(q){let Pt=oi[q];le=Pt.vertexShader,Vt=Pt.fragmentShader}else{le=y.vertexShader,Vt=y.fragmentShader;let Pt=a.getVertexShaderStage(y),qt=a.getFragmentShaderStage(y);a.update(y,Pt,qt),St=Pt.id,Y=qt.id}let K=n.getRenderTarget(),it=n.state.buffers.depth.getReversed(),wt=B.isInstancedMesh===!0,ot=B.isBatchedMesh===!0,ut=!!y.map,Ht=!!y.matcap,Nt=!!et,zt=!!y.aoMap,Ut=!!y.lightMap,Rt=!!y.bumpMap&&y.wireframe===!1,Jt=!!y.normalMap,se=!!y.displacementMap,_e=!!y.emissiveMap,Yt=!!y.metalnessMap,ee=!!y.roughnessMap,R=y.anisotropy>0,$t=y.clearcoat>0,At=y.dispersion>0,E=y.retroreflectivity>0,_=y.iridescence>0,O=y.sheen>0,z=y.transmission>0,Z=R&&!!y.anisotropyMap,st=$t&&!!y.clearcoatMap,rt=$t&&!!y.clearcoatNormalMap,$=$t&&!!y.clearcoatRoughnessMap,Q=_&&!!y.iridescenceMap,at=_&&!!y.iridescenceThicknessMap,Lt=O&&!!y.sheenColorMap,dt=O&&!!y.sheenRoughnessMap,ct=!!y.specularMap,Ct=!!y.specularColorMap,Bt=!!y.specularIntensityMap,Ft=z&&!!y.transmissionMap,N=z&&!!y.thicknessMap,ht=!!y.gradientMap,tt=!!y.alphaMap,lt=y.alphaTest>0,pt=!!y.alphaHash,nt=!!y.extensions,_t=Vn;y.toneMapped&&(K===null||K.isXRRenderTarget===!0)&&(_t=n.toneMapping);let bt={shaderID:q,shaderType:y.type,shaderName:y.name,vertexShader:le,fragmentShader:Vt,defines:y.defines,customVertexShaderID:St,customFragmentShaderID:Y,isRawShaderMaterial:y.isRawShaderMaterial===!0,glslVersion:y.glslVersion,precision:h,batching:ot,batchingColor:ot&&B._colorsTexture!==null,instancing:wt,instancingColor:wt&&B.instanceColor!==null,instancingMorph:wt&&B.morphTexture!==null,outputColorSpace:K===null?n.outputColorSpace:K.isXRRenderTarget===!0?K.texture.colorSpace:he.workingColorSpace,alphaToCoverage:!!y.alphaToCoverage,map:ut,matcap:Ht,envMap:Nt,envMapMode:Nt&&et.mapping,envMapCubeUVHeight:U,aoMap:zt,lightMap:Ut,bumpMap:Rt,normalMap:Jt,displacementMap:se,emissiveMap:_e,normalMapObjectSpace:Jt&&y.normalMapType===Gd,normalMapTangentSpace:Jt&&y.normalMapType===Il,packedNormalMap:Jt&&y.normalMapType===Il&&Ux(y.normalMap.format),metalnessMap:Yt,roughnessMap:ee,anisotropy:R,anisotropyMap:Z,clearcoat:$t,clearcoatMap:st,clearcoatNormalMap:rt,clearcoatRoughnessMap:$,dispersion:At,retroreflection:E,iridescence:_,iridescenceMap:Q,iridescenceThicknessMap:at,sheen:O,sheenColorMap:Lt,sheenRoughnessMap:dt,specularMap:ct,specularColorMap:Ct,specularIntensityMap:Bt,transmission:z,transmissionMap:Ft,thicknessMap:N,gradientMap:ht,opaque:y.transparent===!1&&y.blending===sr&&y.alphaToCoverage===!1,alphaMap:tt,alphaTest:lt,alphaHash:pt,combine:y.combine,mapUv:ut&&m(y.map.channel),aoMapUv:zt&&m(y.aoMap.channel),lightMapUv:Ut&&m(y.lightMap.channel),bumpMapUv:Rt&&m(y.bumpMap.channel),normalMapUv:Jt&&m(y.normalMap.channel),displacementMapUv:se&&m(y.displacementMap.channel),emissiveMapUv:_e&&m(y.emissiveMap.channel),metalnessMapUv:Yt&&m(y.metalnessMap.channel),roughnessMapUv:ee&&m(y.roughnessMap.channel),anisotropyMapUv:Z&&m(y.anisotropyMap.channel),clearcoatMapUv:st&&m(y.clearcoatMap.channel),clearcoatNormalMapUv:rt&&m(y.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:$&&m(y.clearcoatRoughnessMap.channel),iridescenceMapUv:Q&&m(y.iridescenceMap.channel),iridescenceThicknessMapUv:at&&m(y.iridescenceThicknessMap.channel),sheenColorMapUv:Lt&&m(y.sheenColorMap.channel),sheenRoughnessMapUv:dt&&m(y.sheenRoughnessMap.channel),specularMapUv:ct&&m(y.specularMap.channel),specularColorMapUv:Ct&&m(y.specularColorMap.channel),specularIntensityMapUv:Bt&&m(y.specularIntensityMap.channel),transmissionMapUv:Ft&&m(y.transmissionMap.channel),thicknessMapUv:N&&m(y.thicknessMap.channel),alphaMapUv:tt&&m(y.alphaMap.channel),vertexTangents:!!k.attributes.tangent&&(Jt||R),vertexNormals:!!k.attributes.normal,vertexColors:y.vertexColors,vertexAlphas:y.vertexColors===!0&&!!k.attributes.color&&k.attributes.color.itemSize===4,pointsUvs:B.isPoints===!0&&!!k.attributes.uv&&(ut||tt),fog:!!I,useFog:y.fog===!0,fogExp2:!!I&&I.isFogExp2,flatShading:y.wireframe===!1&&(y.flatShading===!0||k.attributes.normal===void 0&&Jt===!1&&(y.isMeshLambertMaterial||y.isMeshPhongMaterial||y.isMeshStandardMaterial||y.isMeshPhysicalMaterial)),sizeAttenuation:y.sizeAttenuation===!0,logarithmicDepthBuffer:f,reversedDepthBuffer:it,skinning:B.isSkinnedMesh===!0,hasPositionAttribute:k.attributes.position!==void 0,morphTargets:k.morphAttributes.position!==void 0,morphNormals:k.morphAttributes.normal!==void 0,morphColors:k.morphAttributes.color!==void 0,morphTargetsCount:xt,morphTextureStride:Mt,numSunLights:w.sun.length,numDirLights:w.directional.length,numPointLights:w.point.length,numSpotLights:w.spot.length,numSpotLightMaps:w.spotLightMap.length,numRectAreaLights:w.rectArea.length,numHemiLights:w.hemi.length,numSunLightShadows:w.sunShadowMap.length,numDirLightShadows:w.directionalShadowMap.length,numPointLightShadows:w.pointShadowMap.length,numSpotLightShadows:w.spotShadowMap.length,numSpotLightShadowsWithMaps:w.numSpotLightShadowsWithMaps,numLightProbes:w.numLightProbes,numLightProbeGrids:V.length,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:y.dithering,shadowMapEnabled:n.shadowMap.enabled&&P.length>0,shadowMapType:n.shadowMap.type,toneMapping:_t,decodeVideoTexture:ut&&y.map.isVideoTexture===!0&&he.getTransfer(y.map.colorSpace)===ge,decodeVideoTextureEmissive:_e&&y.emissiveMap.isVideoTexture===!0&&he.getTransfer(y.emissiveMap.colorSpace)===ge,premultipliedAlpha:y.premultipliedAlpha,doubleSided:y.side===Ln,flipSided:y.side===sn,useDepthPacking:y.depthPacking>=0,depthPacking:y.depthPacking||0,index0AttributeName:y.index0AttributeName,extensionClipCullDistance:nt&&y.extensions.clipCullDistance===!0&&e.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(nt&&y.extensions.multiDraw===!0||ot)&&e.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:e.has("KHR_parallel_shader_compile"),customProgramCacheKey:y.customProgramCacheKey()};return bt.vertexUv1s=c.has(1),bt.vertexUv2s=c.has(2),bt.vertexUv3s=c.has(3),c.clear(),bt}function g(y){let w=[];if(y.shaderID?w.push(y.shaderID):(w.push(y.customVertexShaderID),w.push(y.customFragmentShaderID)),y.defines!==void 0)for(let P in y.defines)w.push(P),w.push(y.defines[P]);return y.isRawShaderMaterial===!1&&(p(w,y),S(w,y),w.push(n.outputColorSpace)),w.push(y.customProgramCacheKey),w.join()}function p(y,w){y.push(w.precision),y.push(w.outputColorSpace),y.push(w.envMapMode),y.push(w.envMapCubeUVHeight),y.push(w.mapUv),y.push(w.alphaMapUv),y.push(w.lightMapUv),y.push(w.aoMapUv),y.push(w.bumpMapUv),y.push(w.normalMapUv),y.push(w.displacementMapUv),y.push(w.emissiveMapUv),y.push(w.metalnessMapUv),y.push(w.roughnessMapUv),y.push(w.anisotropyMapUv),y.push(w.clearcoatMapUv),y.push(w.clearcoatNormalMapUv),y.push(w.clearcoatRoughnessMapUv),y.push(w.iridescenceMapUv),y.push(w.iridescenceThicknessMapUv),y.push(w.sheenColorMapUv),y.push(w.sheenRoughnessMapUv),y.push(w.specularMapUv),y.push(w.specularColorMapUv),y.push(w.specularIntensityMapUv),y.push(w.transmissionMapUv),y.push(w.thicknessMapUv),y.push(w.combine),y.push(w.fogExp2),y.push(w.sizeAttenuation),y.push(w.morphTargetsCount),y.push(w.morphAttributeCount),y.push(w.numSunLights),y.push(w.numDirLights),y.push(w.numPointLights),y.push(w.numSpotLights),y.push(w.numSpotLightMaps),y.push(w.numHemiLights),y.push(w.numRectAreaLights),y.push(w.numSunLightShadows),y.push(w.numDirLightShadows),y.push(w.numPointLightShadows),y.push(w.numSpotLightShadows),y.push(w.numSpotLightShadowsWithMaps),y.push(w.numLightProbes),y.push(w.shadowMapType),y.push(w.toneMapping),y.push(w.numClippingPlanes),y.push(w.numClipIntersection),y.push(w.depthPacking)}function S(y,w){o.disableAll(),w.instancing&&o.enable(0),w.instancingColor&&o.enable(1),w.instancingMorph&&o.enable(2),w.matcap&&o.enable(3),w.envMap&&o.enable(4),w.normalMapObjectSpace&&o.enable(5),w.normalMapTangentSpace&&o.enable(6),w.clearcoat&&o.enable(7),w.iridescence&&o.enable(8),w.alphaTest&&o.enable(9),w.vertexColors&&o.enable(10),w.vertexAlphas&&o.enable(11),w.vertexUv1s&&o.enable(12),w.vertexUv2s&&o.enable(13),w.vertexUv3s&&o.enable(14),w.vertexTangents&&o.enable(15),w.anisotropy&&o.enable(16),w.alphaHash&&o.enable(17),w.batching&&o.enable(18),w.dispersion&&o.enable(19),w.retroreflection&&o.enable(24),w.batchingColor&&o.enable(20),w.gradientMap&&o.enable(21),w.packedNormalMap&&o.enable(22),w.vertexNormals&&o.enable(23),y.push(o.mask),o.disableAll(),w.fog&&o.enable(0),w.useFog&&o.enable(1),w.flatShading&&o.enable(2),w.logarithmicDepthBuffer&&o.enable(3),w.reversedDepthBuffer&&o.enable(4),w.skinning&&o.enable(5),w.morphTargets&&o.enable(6),w.morphNormals&&o.enable(7),w.morphColors&&o.enable(8),w.premultipliedAlpha&&o.enable(9),w.shadowMapEnabled&&o.enable(10),w.doubleSided&&o.enable(11),w.flipSided&&o.enable(12),w.useDepthPacking&&o.enable(13),w.dithering&&o.enable(14),w.transmission&&o.enable(15),w.sheen&&o.enable(16),w.opaque&&o.enable(17),w.pointsUvs&&o.enable(18),w.decodeVideoTexture&&o.enable(19),w.decodeVideoTextureEmissive&&o.enable(20),w.alphaToCoverage&&o.enable(21),w.numLightProbeGrids>0&&o.enable(22),w.hasPositionAttribute&&o.enable(23),y.push(o.mask)}function A(y){let w=d[y.type],P;if(w){let F=oi[w];P=sf.clone(F.uniforms)}else P=y.uniforms;return P}function M(y,w){let P=u.get(w);return P!==void 0?++P.usedTimes:(P=new Dx(n,w,y,s),l.push(P),u.set(w,P)),P}function T(y){if(--y.usedTimes===0){let w=l.indexOf(y);l[w]=l[l.length-1],l.pop(),u.delete(y.cacheKey),y.destroy()}}function b(y){a.remove(y)}function C(){a.dispose()}return{getParameters:x,getProgramCacheKey:g,getUniforms:A,acquireProgram:M,releaseProgram:T,releaseShaderCache:b,programs:l,dispose:C}}function Ox(){let n=new WeakMap;function t(o){return n.has(o)}function e(o){let a=n.get(o);return a===void 0&&(a={},n.set(o,a)),a}function i(o){n.delete(o)}function s(o,a,c){n.get(o)[a]=c}function r(){n=new WeakMap}return{has:t,get:e,remove:i,update:s,dispose:r}}function Bx(n,t){return n.groupOrder!==t.groupOrder?n.groupOrder-t.groupOrder:n.renderOrder!==t.renderOrder?n.renderOrder-t.renderOrder:n.material.id!==t.material.id?n.material.id-t.material.id:n.materialVariant!==t.materialVariant?n.materialVariant-t.materialVariant:n.z!==t.z?n.z-t.z:n.id-t.id}function Tf(n,t){return n.groupOrder!==t.groupOrder?n.groupOrder-t.groupOrder:n.renderOrder!==t.renderOrder?n.renderOrder-t.renderOrder:n.z!==t.z?t.z-n.z:n.id-t.id}function Ef(){let n=[],t=0,e=[],i=[],s=[];function r(){t=0,e.length=0,i.length=0,s.length=0}function o(h){let d=0;return h.isInstancedMesh&&(d+=2),h.isSkinnedMesh&&(d+=1),d}function a(h,d,m,x,g,p){let S=n[t];return S===void 0?(S={id:h.id,object:h,geometry:d,material:m,materialVariant:o(h),groupOrder:x,renderOrder:h.renderOrder,z:g,group:p},n[t]=S):(S.id=h.id,S.object=h,S.geometry=d,S.material=m,S.materialVariant=o(h),S.groupOrder=x,S.renderOrder=h.renderOrder,S.z=g,S.group=p),t++,S}function c(h,d,m,x,g,p,S){S.reversedDepth===!0&&(g=-g);let A=a(h,d,m,x,g,p);m.transmission>0?i.push(A):m.transparent===!0?s.push(A):e.push(A)}function l(h,d,m,x,g,p){let S=a(h,d,m,x,g,p);m.transmission>0?i.unshift(S):m.transparent===!0?s.unshift(S):e.unshift(S)}function u(h,d){e.length>1&&e.sort(h||Bx),i.length>1&&i.sort(d||Tf),s.length>1&&s.sort(d||Tf)}function f(){for(let h=t,d=n.length;h<d;h++){let m=n[h];if(m.id===null)break;m.id=null,m.object=null,m.geometry=null,m.material=null,m.group=null}}return{opaque:e,transmissive:i,transparent:s,init:r,push:c,unshift:l,finish:f,sort:u}}function kx(){let n=new WeakMap;function t(i,s){let r=n.get(i),o;return r===void 0?(o=new Ef,n.set(i,[o])):s>=r.length?(o=new Ef,r.push(o)):o=r[s],o}function e(){n=new WeakMap}return{get:t,dispose:e}}function zx(){let n={};return{get:function(t){if(n[t.id]!==void 0)return n[t.id];let e;switch(t.type){case"SunLight":case"DirectionalLight":e={direction:new L,color:new te};break;case"SpotLight":e={position:new L,direction:new L,color:new te,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new L,color:new te,distance:0,decay:0};break;case"HemisphereLight":e={direction:new L,skyColor:new te,groundColor:new te};break;case"RectAreaLight":e={color:new te,position:new L,halfWidth:new L,halfHeight:new L};break}return n[t.id]=e,e}}}function Vx(){let n={};return{get:function(t){if(n[t.id]!==void 0)return n[t.id];let e;switch(t.type){case"SunLight":case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Gt};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Gt};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Gt,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[t.id]=e,e}}}var Hx=0;function Gx(n,t){return(t.castShadow?2:0)-(n.castShadow?2:0)+(t.map?1:0)-(n.map?1:0)}function Wx(n){let t=new zx,e=Vx(),i={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)i.probe.push(new L);let s=new L,r=new we,o=new we;function a(l){let u=0,f=0,h=0;for(let B=0;B<9;B++)i.probe[B].set(0,0,0);let d=0,m=0,x=0,g=0,p=0,S=0,A=0,M=0,T=0,b=0,C=0,y=0,w=0,P=0;l.sort(Gx);for(let B=0,V=l.length;B<V;B++){let I=l[B],k=I.color,W=I.intensity,J=I.distance,et=null;if(I.shadow&&I.shadow.map&&(I.shadow.map.texture.format===$i?et=I.shadow.map.texture:et=I.shadow.map.depthTexture||I.shadow.map.texture),I.isAmbientLight)u+=k.r*W,f+=k.g*W,h+=k.b*W;else if(I.isLightProbe){for(let U=0;U<9;U++)i.probe[U].addScaledVector(I.sh.coefficients[U],W);P++}else if(I.isSunLight){let U=t.get(I);if(U.color.copy(I.color).multiplyScalar(I.intensity),I.castShadow){let q=I.shadow,j=e.get(I);j.shadowIntensity=q.intensity,j.shadowBias=q.bias,j.shadowNormalBias=q.normalBias,j.shadowRadius=q.radius,j.shadowMapSize.copy(q.mapSize).multiply(q.getFrameExtents()),i.sunShadow[m]=j,i.sunShadowMap[m]=et;let xt=q.getViewportCount();for(let Mt=0;Mt<xt;Mt++)i.sunShadowMatrix[x+Mt]=q.getMatrix(Mt),i.sunShadowCascade[x+Mt]=q._cascadeData[Mt];x+=xt,m++}i.sun[d]=U,d++}else if(I.isDirectionalLight){let U=t.get(I);if(U.color.copy(I.color).multiplyScalar(I.intensity),I.castShadow){let q=I.shadow,j=e.get(I);j.shadowIntensity=q.intensity,j.shadowBias=q.bias,j.shadowNormalBias=q.normalBias,j.shadowRadius=q.radius,j.shadowMapSize=q.mapSize,i.directionalShadow[g]=j,i.directionalShadowMap[g]=et,i.directionalShadowMatrix[g]=I.shadow.matrix,T++}i.directional[g]=U,g++}else if(I.isSpotLight){let U=t.get(I);U.position.setFromMatrixPosition(I.matrixWorld),U.color.copy(k).multiplyScalar(W),U.distance=J,U.coneCos=Math.cos(I.angle),U.penumbraCos=Math.cos(I.angle*(1-I.penumbra)),U.decay=I.decay,i.spot[S]=U;let q=I.shadow;if(I.map&&(i.spotLightMap[y]=I.map,y++,q.updateMatrices(I),I.castShadow&&w++),i.spotLightMatrix[S]=q.matrix,I.castShadow){let j=e.get(I);j.shadowIntensity=q.intensity,j.shadowBias=q.bias,j.shadowNormalBias=q.normalBias,j.shadowRadius=q.radius,j.shadowMapSize=q.mapSize,i.spotShadow[S]=j,i.spotShadowMap[S]=et,C++}S++}else if(I.isRectAreaLight){let U=t.get(I);U.color.copy(k).multiplyScalar(W),U.halfWidth.set(I.width*.5,0,0),U.halfHeight.set(0,I.height*.5,0),i.rectArea[A]=U,A++}else if(I.isPointLight){let U=t.get(I);if(U.color.copy(I.color).multiplyScalar(I.intensity),U.distance=I.distance,U.decay=I.decay,I.castShadow){let q=I.shadow,j=e.get(I);j.shadowIntensity=q.intensity,j.shadowBias=q.bias,j.shadowNormalBias=q.normalBias,j.shadowRadius=q.radius,j.shadowMapSize=q.mapSize,j.shadowCameraNear=q.camera.near,j.shadowCameraFar=q.camera.far,i.pointShadow[p]=j,i.pointShadowMap[p]=et,i.pointShadowMatrix[p]=I.shadow.matrix,b++}i.point[p]=U,p++}else if(I.isHemisphereLight){let U=t.get(I);U.skyColor.copy(I.color).multiplyScalar(W),U.groundColor.copy(I.groundColor).multiplyScalar(W),i.hemi[M]=U,M++}}A>0&&(n.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=ft.LTC_FLOAT_1,i.rectAreaLTC2=ft.LTC_FLOAT_2):(i.rectAreaLTC1=ft.LTC_HALF_1,i.rectAreaLTC2=ft.LTC_HALF_2)),i.ambient[0]=u,i.ambient[1]=f,i.ambient[2]=h;let F=i.hash;(F.sunLength!==d||F.directionalLength!==g||F.pointLength!==p||F.spotLength!==S||F.rectAreaLength!==A||F.hemiLength!==M||F.numSunShadows!==m||F.numDirectionalShadows!==T||F.numPointShadows!==b||F.numSpotShadows!==C||F.numSpotMaps!==y||F.numLightProbes!==P)&&(i.sun.length=d,i.directional.length=g,i.spot.length=S,i.rectArea.length=A,i.point.length=p,i.hemi.length=M,i.sunShadow.length=m,i.sunShadowMap.length=m,i.sunShadowMatrix.length=x,i.sunShadowCascade.length=x,i.directionalShadow.length=T,i.directionalShadowMap.length=T,i.directionalShadowMatrix.length=T,i.pointShadow.length=b,i.pointShadowMap.length=b,i.pointShadowMatrix.length=b,i.spotShadow.length=C,i.spotShadowMap.length=C,i.spotLightMatrix.length=C+y-w,i.spotLightMap.length=y,i.numSpotLightShadowsWithMaps=w,i.numLightProbes=P,F.sunLength=d,F.directionalLength=g,F.pointLength=p,F.spotLength=S,F.rectAreaLength=A,F.hemiLength=M,F.numSunShadows=m,F.numDirectionalShadows=T,F.numPointShadows=b,F.numSpotShadows=C,F.numSpotMaps=y,F.numLightProbes=P,i.version=Hx++)}function c(l,u){let f=0,h=0,d=0,m=0,x=0,g=0,p=u.matrixWorldInverse;for(let S=0,A=l.length;S<A;S++){let M=l[S];if(M.isSunLight){let T=i.sun[f];T.direction.setFromMatrixPosition(M.matrixWorld),T.direction.transformDirection(p),f++}else if(M.isDirectionalLight){let T=i.directional[h];T.direction.setFromMatrixPosition(M.matrixWorld),s.setFromMatrixPosition(M.target.matrixWorld),T.direction.sub(s),T.direction.transformDirection(p),h++}else if(M.isSpotLight){let T=i.spot[m];T.position.setFromMatrixPosition(M.matrixWorld),T.position.applyMatrix4(p),T.direction.setFromMatrixPosition(M.matrixWorld),s.setFromMatrixPosition(M.target.matrixWorld),T.direction.sub(s),T.direction.transformDirection(p),m++}else if(M.isRectAreaLight){let T=i.rectArea[x];T.position.setFromMatrixPosition(M.matrixWorld),T.position.applyMatrix4(p),o.identity(),r.copy(M.matrixWorld),r.premultiply(p),o.extractRotation(r),T.halfWidth.set(M.width*.5,0,0),T.halfHeight.set(0,M.height*.5,0),T.halfWidth.applyMatrix4(o),T.halfHeight.applyMatrix4(o),x++}else if(M.isPointLight){let T=i.point[d];T.position.setFromMatrixPosition(M.matrixWorld),T.position.applyMatrix4(p),d++}else if(M.isHemisphereLight){let T=i.hemi[g];T.direction.setFromMatrixPosition(M.matrixWorld),T.direction.transformDirection(p),g++}}}return{setup:a,setupView:c,state:i}}function wf(n){let t=new Wx(n),e=[],i=[],s=[];function r(h){f.camera=h,e.length=0,i.length=0,s.length=0}function o(h){e.push(h)}function a(h){i.push(h)}function c(h){s.push(h)}function l(){t.setup(e)}function u(h){t.setupView(e,h)}let f={lightsArray:e,shadowsArray:i,lightProbeGridArray:s,camera:null,lights:t,transmissionRenderTarget:{},textureUnits:0};return{init:r,state:f,setupLights:l,setupLightsView:u,pushLight:o,pushShadow:a,pushLightProbeGrid:c}}function Xx(n){let t=new WeakMap;function e(s,r=0){let o=t.get(s),a;return o===void 0?(a=new wf(n),t.set(s,[a])):r>=o.length?(a=new wf(n),o.push(a)):a=o[r],a}function i(){t=new WeakMap}return{get:e,dispose:i}}var qx=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Yx=`uniform sampler2D shadow_pass;
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
}`,Zx=[new L(1,0,0),new L(-1,0,0),new L(0,1,0),new L(0,-1,0),new L(0,0,1),new L(0,0,-1)],Jx=[new L(0,-1,0),new L(0,-1,0),new L(0,0,1),new L(0,0,-1),new L(0,-1,0),new L(0,-1,0)],Af=new we,lo=new L,Dh=new L;function $x(n,t,e){let i=new $s,s=new Gt,r=new Gt,o=new Ae,a=new Pa,c=new Ia,l={},u=e.maxTextureSize,f={[qi]:sn,[sn]:qi,[Ln]:Ln},h=new Sn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Gt},radius:{value:4}},vertexShader:qx,fragmentShader:Yx}),d=h.clone();d.defines.HORIZONTAL_PASS=1;let m=new Ne;m.setAttribute("position",new In(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let x=new tn(m,h),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Kr;let p=this.type;this.render=function(b,C,y){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||b.length===0)return;this.type===vd&&(kt("WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead."),this.type=Kr);let w=n.getRenderTarget(),P=n.getActiveCubeFace(),F=n.getActiveMipmapLevel(),B=n.state;B.setBlending(si),B.buffers.depth.getReversed()===!0?B.buffers.color.setClear(0,0,0,0):B.buffers.color.setClear(1,1,1,1),B.buffers.depth.setTest(!0),B.setScissorTest(!1);let V=p!==this.type;V&&C.traverse(function(I){I.material&&(Array.isArray(I.material)?I.material.forEach(k=>k.needsUpdate=!0):I.material.needsUpdate=!0)});for(let I=0,k=b.length;I<k;I++){let W=b[I],J=W.shadow;if(J===void 0){kt("WebGLShadowMap:",W,"has no shadow.");continue}if(J.autoUpdate===!1&&J.needsUpdate===!1)continue;s.copy(J.mapSize);let et=J.getFrameExtents();s.multiply(et),r.copy(J.mapSize),(s.x>u||s.y>u)&&(s.x>u&&(r.x=Math.floor(u/et.x),s.x=r.x*et.x,J.mapSize.x=r.x),s.y>u&&(r.y=Math.floor(u/et.y),s.y=r.y*et.y,J.mapSize.y=r.y));let U=n.state.buffers.depth.getReversed();if(J.camera._reversedDepth=U,J.map===null||V===!0){if(J.map!==null&&(J.map.depthTexture!==null&&(J.map.depthTexture.dispose(),J.map.depthTexture=null),J.map.dispose()),this.type===ir){if(W.isPointLight){kt("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}J.map=new hn(s.x,s.y,{format:$i,type:Wn,minFilter:Ge,magFilter:Ge,generateMipmaps:!1}),J.map.texture.name=W.name+".shadowMap",J.map.depthTexture=new Bi(s.x,s.y,Gn),J.map.depthTexture.name=W.name+".shadowMapDepth",J.map.depthTexture.format=ni,J.map.depthTexture.compareFunction=null,J.map.depthTexture.minFilter=Ve,J.map.depthTexture.magFilter=Ve}else W.isPointLight?(J.map=new Ol(s.x),J.map.depthTexture=new Aa(s.x,Hn)):(J.map=new hn(s.x,s.y),J.map.depthTexture=new Bi(s.x,s.y,Hn)),J.map.depthTexture.name=W.name+".shadowMap",J.map.depthTexture.format=ni,this.type===Kr?(J.map.depthTexture.compareFunction=U?Dl:Ll,J.map.depthTexture.minFilter=Ge,J.map.depthTexture.magFilter=Ge):(J.map.depthTexture.compareFunction=null,J.map.depthTexture.minFilter=Ve,J.map.depthTexture.magFilter=Ve);J.camera.updateProjectionMatrix()}J.map.isWebGLCubeRenderTarget!==!0&&(J.map.width!==s.x||J.map.height!==s.y)&&J.map.setSize(s.x,s.y);let q=J.map.isWebGLCubeRenderTarget?6:J.getViewportCount();W.isPointLight!==!0&&J.updateMatrices(W,y);for(let j=0;j<q;j++){let xt=J.getCamera(j);if(W.isPointLight){let Mt=J.camera,le=J.matrix,Vt=W.distance||Mt.far;Vt!==Mt.far&&(Mt.far=Vt,Mt.updateProjectionMatrix()),lo.setFromMatrixPosition(W.matrixWorld),Mt.position.copy(lo),Dh.copy(Mt.position),Dh.add(Zx[j]),Mt.up.copy(Jx[j]),Mt.lookAt(Dh),Mt.updateMatrixWorld(),le.makeTranslation(-lo.x,-lo.y,-lo.z),Af.multiplyMatrices(Mt.projectionMatrix,Mt.matrixWorldInverse),J._frustum.setFromProjectionMatrix(Af,Mt.coordinateSystem,Mt.reversedDepth)}if(J.map.isWebGLCubeRenderTarget)n.setRenderTarget(J.map,j),n.clear();else{j===0&&(n.setRenderTarget(J.map),n.clear());let Mt=J.getViewport(j);o.set(r.x*Mt.x,r.y*Mt.y,r.x*Mt.z,r.y*Mt.w),B.viewport(o)}i=J.getFrustum(j),M(C,y,xt,W,this.type)}J.isPointLightShadow!==!0&&this.type===ir&&S(J,y),J.needsUpdate=!1}p=this.type,g.needsUpdate=!1,n.setRenderTarget(w,P,F)};function S(b,C){let y=t.update(x);h.defines.VSM_SAMPLES!==b.blurSamples&&(h.defines.VSM_SAMPLES=b.blurSamples,d.defines.VSM_SAMPLES=b.blurSamples,h.needsUpdate=!0,d.needsUpdate=!0),b.mapPass===null?b.mapPass=new hn(s.x,s.y,{format:$i,type:Wn}):(b.mapPass.width!==b.map.width||b.mapPass.height!==b.map.height)&&b.mapPass.setSize(b.map.width,b.map.height),h.uniforms.shadow_pass.value=b.map.depthTexture,h.uniforms.resolution.value.set(b.map.width,b.map.height),h.uniforms.radius.value=b.radius,n.setRenderTarget(b.mapPass),n.clear(),n.renderBufferDirect(C,null,y,h,x,null),d.uniforms.shadow_pass.value=b.mapPass.texture,d.uniforms.resolution.value.set(b.map.width,b.map.height),d.uniforms.radius.value=b.radius,n.setRenderTarget(b.map),n.clear(),n.renderBufferDirect(C,null,y,d,x,null)}function A(b,C,y,w){let P=null,F=y.isPointLight===!0?b.customDistanceMaterial:b.customDepthMaterial;if(F!==void 0)P=F;else if(P=y.isPointLight===!0?c:a,n.localClippingEnabled&&C.clipShadows===!0&&Array.isArray(C.clippingPlanes)&&C.clippingPlanes.length!==0||C.displacementMap&&C.displacementScale!==0||C.alphaMap&&C.alphaTest>0||C.map&&C.alphaTest>0||C.alphaToCoverage===!0){let B=P.uuid,V=C.uuid,I=l[B];I===void 0&&(I={},l[B]=I);let k=I[V];k===void 0&&(k=P.clone(),I[V]=k,C.addEventListener("dispose",T)),P=k}if(P.visible=C.visible,P.wireframe=C.wireframe,w===ir?P.side=C.shadowSide!==null?C.shadowSide:C.side:P.side=C.shadowSide!==null?C.shadowSide:f[C.side],P.alphaMap=C.alphaMap,P.alphaTest=C.alphaToCoverage===!0?.5:C.alphaTest,P.map=C.map,P.clipShadows=C.clipShadows,P.clippingPlanes=C.clippingPlanes,P.clipIntersection=C.clipIntersection,P.displacementMap=C.displacementMap,P.displacementScale=C.displacementScale,P.displacementBias=C.displacementBias,P.wireframeLinewidth=C.wireframeLinewidth,P.linewidth=C.linewidth,y.isPointLight===!0&&P.isMeshDistanceMaterial===!0){let B=n.properties.get(P);B.light=y}return P}function M(b,C,y,w,P){if(b.visible===!1)return;if(b.layers.test(C.layers)&&(b.isMesh||b.isLine||b.isPoints)&&(b.castShadow||b.receiveShadow&&P===ir)&&(!b.frustumCulled||b.intersectsFrustum(i))){b.modelViewMatrix.multiplyMatrices(y.matrixWorldInverse,b.matrixWorld);let V=t.update(b),I=b.material;if(Array.isArray(I)){let k=V.groups;for(let W=0,J=k.length;W<J;W++){let et=k[W],U=I[et.materialIndex];if(U&&U.visible){let q=A(b,U,w,P);b.onBeforeShadow(n,b,C,y,V,q,et),n.renderBufferDirect(y,null,V,q,b,et),b.onAfterShadow(n,b,C,y,V,q,et)}}}else if(I.visible){let k=A(b,I,w,P);b.onBeforeShadow(n,b,C,y,V,k,null),n.renderBufferDirect(y,null,V,k,b,null),b.onAfterShadow(n,b,C,y,V,k,null)}}let B=b.children;for(let V=0,I=B.length;V<I;V++)M(B[V],C,y,w,P)}function T(b){b.target.removeEventListener("dispose",T);for(let y in l){let w=l[y],P=b.target.uuid;P in w&&(w[P].dispose(),delete w[P])}}}function Kx(n,t){function e(){let N=!1,ht=new Ae,tt=null,lt=new Ae(0,0,0,0);return{setMask:function(pt){tt!==pt&&!N&&(n.colorMask(pt,pt,pt,pt),tt=pt)},setLocked:function(pt){N=pt},setClear:function(pt,nt,_t,bt,Pt){Pt===!0&&(pt*=bt,nt*=bt,_t*=bt),ht.set(pt,nt,_t,bt),lt.equals(ht)===!1&&(n.clearColor(pt,nt,_t,bt),lt.copy(ht))},reset:function(){N=!1,tt=null,lt.set(-1,0,0,0)}}}function i(){let N=!1,ht=!1,tt=null,lt=null,pt=null;return{setReversed:function(nt){if(ht!==nt){let _t=t.get("EXT_clip_control");nt?_t.clipControlEXT(_t.LOWER_LEFT_EXT,_t.ZERO_TO_ONE_EXT):_t.clipControlEXT(_t.LOWER_LEFT_EXT,_t.NEGATIVE_ONE_TO_ONE_EXT),ht=nt;let bt=pt;pt=null,this.setClear(bt)}},getReversed:function(){return ht},setTest:function(nt){nt?K(n.DEPTH_TEST):it(n.DEPTH_TEST)},setMask:function(nt){tt!==nt&&!N&&(n.depthMask(nt),tt=nt)},setFunc:function(nt){if(ht&&(nt=ef[nt]),lt!==nt){switch(nt){case ua:n.depthFunc(n.NEVER);break;case da:n.depthFunc(n.ALWAYS);break;case fa:n.depthFunc(n.LESS);break;case Gs:n.depthFunc(n.LEQUAL);break;case pa:n.depthFunc(n.EQUAL);break;case ma:n.depthFunc(n.GEQUAL);break;case ga:n.depthFunc(n.GREATER);break;case _a:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}lt=nt}},setLocked:function(nt){N=nt},setClear:function(nt){pt!==nt&&(pt=nt,ht&&(nt=1-nt),n.clearDepth(nt))},reset:function(){N=!1,tt=null,lt=null,pt=null,ht=!1}}}function s(){let N=!1,ht=null,tt=null,lt=null,pt=null,nt=null,_t=null,bt=null,Pt=null;return{setTest:function(qt){N||(qt?K(n.STENCIL_TEST):it(n.STENCIL_TEST))},setMask:function(qt){ht!==qt&&!N&&(n.stencilMask(qt),ht=qt)},setFunc:function(qt,En,mn){(tt!==qt||lt!==En||pt!==mn)&&(n.stencilFunc(qt,En,mn),tt=qt,lt=En,pt=mn)},setOp:function(qt,En,mn){(nt!==qt||_t!==En||bt!==mn)&&(n.stencilOp(qt,En,mn),nt=qt,_t=En,bt=mn)},setLocked:function(qt){N=qt},setClear:function(qt){Pt!==qt&&(n.clearStencil(qt),Pt=qt)},reset:function(){N=!1,ht=null,tt=null,lt=null,pt=null,nt=null,_t=null,bt=null,Pt=null}}}let r=new e,o=new i,a=new s,c=new WeakMap,l=new WeakMap,u={},f={},h={},d=new WeakMap,m=[],x=null,g=!1,p=null,S=null,A=null,M=null,T=null,b=null,C=null,y=new te(0,0,0),w=0,P=!1,F=null,B=null,V=null,I=null,k=null,W=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS),J=!1,et=0,U=n.getParameter(n.VERSION);U.indexOf("WebGL")!==-1?(et=parseFloat(/^WebGL (\d)/.exec(U)[1]),J=et>=1):U.indexOf("OpenGL ES")!==-1&&(et=parseFloat(/^OpenGL ES (\d)/.exec(U)[1]),J=et>=2);let q=null,j={},xt=n.getParameter(n.SCISSOR_BOX),Mt=n.getParameter(n.VIEWPORT),le=new Ae().fromArray(xt),Vt=new Ae().fromArray(Mt);function St(N,ht,tt,lt){let pt=new Uint8Array(4),nt=n.createTexture();n.bindTexture(N,nt),n.texParameteri(N,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(N,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let _t=0;_t<tt;_t++)N===n.TEXTURE_3D||N===n.TEXTURE_2D_ARRAY?n.texImage3D(ht,0,n.RGBA,1,1,lt,0,n.RGBA,n.UNSIGNED_BYTE,pt):n.texImage2D(ht+_t,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,pt);return nt}let Y={};Y[n.TEXTURE_2D]=St(n.TEXTURE_2D,n.TEXTURE_2D,1),Y[n.TEXTURE_CUBE_MAP]=St(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),Y[n.TEXTURE_2D_ARRAY]=St(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),Y[n.TEXTURE_3D]=St(n.TEXTURE_3D,n.TEXTURE_3D,1,1),r.setClear(0,0,0,1),o.setClear(1),a.setClear(0),K(n.DEPTH_TEST),o.setFunc(Gs),Rt(!1),Jt(Zc),K(n.CULL_FACE),zt(si);function K(N){u[N]!==!0&&(n.enable(N),u[N]=!0)}function it(N){u[N]!==!1&&(n.disable(N),u[N]=!1)}function wt(N,ht){return h[N]!==ht?(n.bindFramebuffer(N,ht),h[N]=ht,N===n.DRAW_FRAMEBUFFER&&(h[n.FRAMEBUFFER]=ht),N===n.FRAMEBUFFER&&(h[n.DRAW_FRAMEBUFFER]=ht),!0):!1}function ot(N,ht){let tt=m,lt=!1;if(N){tt=d.get(ht),tt===void 0&&(tt=[],d.set(ht,tt));let pt=N.textures;if(tt.length!==pt.length||tt[0]!==n.COLOR_ATTACHMENT0){for(let nt=0,_t=pt.length;nt<_t;nt++)tt[nt]=n.COLOR_ATTACHMENT0+nt;tt.length=pt.length,lt=!0}}else tt[0]!==n.BACK&&(tt[0]=n.BACK,lt=!0);lt&&n.drawBuffers(tt)}function ut(N){return x!==N?(n.useProgram(N),x=N,!0):!1}let Ht={[fs]:n.FUNC_ADD,[Sd]:n.FUNC_SUBTRACT,[bd]:n.FUNC_REVERSE_SUBTRACT};Ht[Td]=n.MIN,Ht[Ed]=n.MAX;let Nt={[wd]:n.ZERO,[Ad]:n.ONE,[Cd]:n.SRC_COLOR,[jc]:n.SRC_ALPHA,[Nd]:n.SRC_ALPHA_SATURATE,[Ld]:n.DST_COLOR,[Pd]:n.DST_ALPHA,[Rd]:n.ONE_MINUS_SRC_COLOR,[Qc]:n.ONE_MINUS_SRC_ALPHA,[Dd]:n.ONE_MINUS_DST_COLOR,[Id]:n.ONE_MINUS_DST_ALPHA,[Ud]:n.CONSTANT_COLOR,[Fd]:n.ONE_MINUS_CONSTANT_COLOR,[Od]:n.CONSTANT_ALPHA,[Bd]:n.ONE_MINUS_CONSTANT_ALPHA};function zt(N,ht,tt,lt,pt,nt,_t,bt,Pt,qt){if(N===si){g===!0&&(it(n.BLEND),g=!1);return}if(g===!1&&(K(n.BLEND),g=!0),N!==Md){if(N!==p||qt!==P){if((S!==fs||T!==fs)&&(n.blendEquation(n.FUNC_ADD),S=fs,T=fs),qt)switch(N){case sr:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Jc:n.blendFunc(n.ONE,n.ONE);break;case $c:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case Kc:n.blendFuncSeparate(n.DST_COLOR,n.ONE_MINUS_SRC_ALPHA,n.ZERO,n.ONE);break;default:Wt("WebGLState: Invalid blending: ",N);break}else switch(N){case sr:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Jc:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE,n.ONE,n.ONE);break;case $c:Wt("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Kc:Wt("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:Wt("WebGLState: Invalid blending: ",N);break}A=null,M=null,b=null,C=null,y.set(0,0,0),w=0,p=N,P=qt}return}pt=pt||ht,nt=nt||tt,_t=_t||lt,(ht!==S||pt!==T)&&(n.blendEquationSeparate(Ht[ht],Ht[pt]),S=ht,T=pt),(tt!==A||lt!==M||nt!==b||_t!==C)&&(n.blendFuncSeparate(Nt[tt],Nt[lt],Nt[nt],Nt[_t]),A=tt,M=lt,b=nt,C=_t),(bt.equals(y)===!1||Pt!==w)&&(n.blendColor(bt.r,bt.g,bt.b,Pt),y.copy(bt),w=Pt),p=N,P=!1}function Ut(N,ht){N.side===Ln?it(n.CULL_FACE):K(n.CULL_FACE);let tt=N.side===sn;ht&&(tt=!tt),Rt(tt),N.blending===sr&&N.transparent===!1?zt(si):zt(N.blending,N.blendEquation,N.blendSrc,N.blendDst,N.blendEquationAlpha,N.blendSrcAlpha,N.blendDstAlpha,N.blendColor,N.blendAlpha,N.premultipliedAlpha),o.setFunc(N.depthFunc),o.setTest(N.depthTest),o.setMask(N.depthWrite),r.setMask(N.colorWrite);let lt=N.stencilWrite;a.setTest(lt),lt&&(a.setMask(N.stencilWriteMask),a.setFunc(N.stencilFunc,N.stencilRef,N.stencilFuncMask),a.setOp(N.stencilFail,N.stencilZFail,N.stencilZPass)),_e(N.polygonOffset,N.polygonOffsetFactor,N.polygonOffsetUnits),N.alphaToCoverage===!0?K(n.SAMPLE_ALPHA_TO_COVERAGE):it(n.SAMPLE_ALPHA_TO_COVERAGE)}function Rt(N){F!==N&&(N?n.frontFace(n.CW):n.frontFace(n.CCW),F=N)}function Jt(N){N!==xd?(K(n.CULL_FACE),N!==B&&(N===Zc?n.cullFace(n.BACK):N===yd?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):it(n.CULL_FACE),B=N}function se(N){N!==V&&(J&&n.lineWidth(N),V=N)}function _e(N,ht,tt){N?(K(n.POLYGON_OFFSET_FILL),(I!==ht||k!==tt)&&(I=ht,k=tt,o.getReversed()&&(ht=-ht),n.polygonOffset(ht,tt))):it(n.POLYGON_OFFSET_FILL)}function Yt(N){N?K(n.SCISSOR_TEST):it(n.SCISSOR_TEST)}function ee(N){N===void 0&&(N=n.TEXTURE0+W-1),q!==N&&(n.activeTexture(N),q=N)}function R(N,ht,tt){tt===void 0&&(q===null?tt=n.TEXTURE0+W-1:tt=q);let lt=j[tt];lt===void 0&&(lt={type:void 0,texture:void 0},j[tt]=lt),(lt.type!==N||lt.texture!==ht)&&(q!==tt&&(n.activeTexture(tt),q=tt),n.bindTexture(N,ht||Y[N]),lt.type=N,lt.texture=ht)}function $t(){let N=j[q];N!==void 0&&N.type!==void 0&&(n.bindTexture(N.type,null),N.type=void 0,N.texture=void 0)}function At(){try{n.compressedTexImage2D(...arguments)}catch(N){Wt("WebGLState:",N)}}function E(){try{n.compressedTexImage3D(...arguments)}catch(N){Wt("WebGLState:",N)}}function _(){try{n.texSubImage2D(...arguments)}catch(N){Wt("WebGLState:",N)}}function O(){try{n.texSubImage3D(...arguments)}catch(N){Wt("WebGLState:",N)}}function z(){try{n.compressedTexSubImage2D(...arguments)}catch(N){Wt("WebGLState:",N)}}function Z(){try{n.compressedTexSubImage3D(...arguments)}catch(N){Wt("WebGLState:",N)}}function st(){try{n.texStorage2D(...arguments)}catch(N){Wt("WebGLState:",N)}}function rt(){try{n.texStorage3D(...arguments)}catch(N){Wt("WebGLState:",N)}}function $(){try{n.texImage2D(...arguments)}catch(N){Wt("WebGLState:",N)}}function Q(){try{n.texImage3D(...arguments)}catch(N){Wt("WebGLState:",N)}}function at(N){return f[N]!==void 0?f[N]:n.getParameter(N)}function Lt(N,ht){f[N]!==ht&&(n.pixelStorei(N,ht),f[N]=ht)}function dt(N){le.equals(N)===!1&&(n.scissor(N.x,N.y,N.z,N.w),le.copy(N))}function ct(N){Vt.equals(N)===!1&&(n.viewport(N.x,N.y,N.z,N.w),Vt.copy(N))}function Ct(N,ht){let tt=l.get(ht);tt===void 0&&(tt=new WeakMap,l.set(ht,tt));let lt=tt.get(N);lt===void 0&&(lt=n.getUniformBlockIndex(ht,N.name),tt.set(N,lt))}function Bt(N,ht){let lt=l.get(ht).get(N);c.get(ht)!==lt&&(n.uniformBlockBinding(ht,lt,N.__bindingPointIndex),c.set(ht,lt))}function Ft(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),o.setReversed(!1),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),n.pixelStorei(n.PACK_ALIGNMENT,4),n.pixelStorei(n.UNPACK_ALIGNMENT,4),n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,!1),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,n.BROWSER_DEFAULT_WEBGL),n.pixelStorei(n.PACK_ROW_LENGTH,0),n.pixelStorei(n.PACK_SKIP_PIXELS,0),n.pixelStorei(n.PACK_SKIP_ROWS,0),n.pixelStorei(n.UNPACK_ROW_LENGTH,0),n.pixelStorei(n.UNPACK_IMAGE_HEIGHT,0),n.pixelStorei(n.UNPACK_SKIP_PIXELS,0),n.pixelStorei(n.UNPACK_SKIP_ROWS,0),n.pixelStorei(n.UNPACK_SKIP_IMAGES,0),u={},f={},q=null,j={},h={},d=new WeakMap,m=[],x=null,g=!1,p=null,S=null,A=null,M=null,T=null,b=null,C=null,y=new te(0,0,0),w=0,P=!1,F=null,B=null,V=null,I=null,k=null,le.set(0,0,n.canvas.width,n.canvas.height),Vt.set(0,0,n.canvas.width,n.canvas.height),r.reset(),o.reset(),a.reset()}return{buffers:{color:r,depth:o,stencil:a},enable:K,disable:it,bindFramebuffer:wt,drawBuffers:ot,useProgram:ut,setBlending:zt,setMaterial:Ut,setFlipSided:Rt,setCullFace:Jt,setLineWidth:se,setPolygonOffset:_e,setScissorTest:Yt,activeTexture:ee,bindTexture:R,unbindTexture:$t,compressedTexImage2D:At,compressedTexImage3D:E,texImage2D:$,texImage3D:Q,pixelStorei:Lt,getParameter:at,updateUBOMapping:Ct,uniformBlockBinding:Bt,texStorage2D:st,texStorage3D:rt,texSubImage2D:_,texSubImage3D:O,compressedTexSubImage2D:z,compressedTexSubImage3D:Z,scissor:dt,viewport:ct,reset:Ft}}function jx(n,t,e,i,s,r,o){let a=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new Gt,u=new WeakMap,f=new Set,h,d=new WeakMap,m=!1;try{m=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function x(E,_){return m?new OffscreenCanvas(E,_):Ur("canvas")}function g(E,_,O){let z=1,Z=At(E);if((Z.width>O||Z.height>O)&&(z=O/Math.max(Z.width,Z.height)),z<1)if(typeof HTMLImageElement<"u"&&E instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&E instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&E instanceof ImageBitmap||typeof VideoFrame<"u"&&E instanceof VideoFrame){let st=Math.floor(z*Z.width),rt=Math.floor(z*Z.height);h===void 0&&(h=x(st,rt));let $=_?x(st,rt):h;return $.width=st,$.height=rt,$.getContext("2d").drawImage(E,0,0,st,rt),kt("WebGLRenderer: Texture has been resized from ("+Z.width+"x"+Z.height+") to ("+st+"x"+rt+")."),$}else return"data"in E&&kt("WebGLRenderer: Image in DataTexture is too big ("+Z.width+"x"+Z.height+")."),E;return E}function p(E){return E.generateMipmaps}function S(E){n.generateMipmap(E)}function A(E){return E.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:E.isWebGL3DRenderTarget?n.TEXTURE_3D:E.isWebGLArrayRenderTarget||E.isCompressedArrayTexture?n.TEXTURE_2D_ARRAY:n.TEXTURE_2D}function M(E,_,O,z,Z,st=!1){if(E!==null){if(n[E]!==void 0)return n[E];kt("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+E+"'")}let rt;z&&(rt=t.get("EXT_texture_norm16"),rt||kt("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let $=_;if(_===n.RED&&(O===n.FLOAT&&($=n.R32F),O===n.HALF_FLOAT&&($=n.R16F),O===n.UNSIGNED_BYTE&&($=n.R8),O===n.UNSIGNED_SHORT&&rt&&($=rt.R16_EXT),O===n.SHORT&&rt&&($=rt.R16_SNORM_EXT)),_===n.RED_INTEGER&&(O===n.UNSIGNED_BYTE&&($=n.R8UI),O===n.UNSIGNED_SHORT&&($=n.R16UI),O===n.UNSIGNED_INT&&($=n.R32UI),O===n.BYTE&&($=n.R8I),O===n.SHORT&&($=n.R16I),O===n.INT&&($=n.R32I)),_===n.RG&&(O===n.FLOAT&&($=n.RG32F),O===n.HALF_FLOAT&&($=n.RG16F),O===n.UNSIGNED_BYTE&&($=n.RG8),O===n.UNSIGNED_SHORT&&rt&&($=rt.RG16_EXT),O===n.SHORT&&rt&&($=rt.RG16_SNORM_EXT)),_===n.RG_INTEGER&&(O===n.UNSIGNED_BYTE&&($=n.RG8UI),O===n.UNSIGNED_SHORT&&($=n.RG16UI),O===n.UNSIGNED_INT&&($=n.RG32UI),O===n.BYTE&&($=n.RG8I),O===n.SHORT&&($=n.RG16I),O===n.INT&&($=n.RG32I)),_===n.RGB_INTEGER&&(O===n.UNSIGNED_BYTE&&($=n.RGB8UI),O===n.UNSIGNED_SHORT&&($=n.RGB16UI),O===n.UNSIGNED_INT&&($=n.RGB32UI),O===n.BYTE&&($=n.RGB8I),O===n.SHORT&&($=n.RGB16I),O===n.INT&&($=n.RGB32I)),_===n.RGBA_INTEGER&&(O===n.UNSIGNED_BYTE&&($=n.RGBA8UI),O===n.UNSIGNED_SHORT&&($=n.RGBA16UI),O===n.UNSIGNED_INT&&($=n.RGBA32UI),O===n.BYTE&&($=n.RGBA8I),O===n.SHORT&&($=n.RGBA16I),O===n.INT&&($=n.RGBA32I)),_===n.RGB&&(O===n.UNSIGNED_SHORT&&rt&&($=rt.RGB16_EXT),O===n.SHORT&&rt&&($=rt.RGB16_SNORM_EXT),O===n.UNSIGNED_INT_5_9_9_9_REV&&($=n.RGB9_E5),O===n.UNSIGNED_INT_10F_11F_11F_REV&&($=n.R11F_G11F_B10F)),_===n.RGBA){let Q=st?Nr:he.getTransfer(Z);O===n.FLOAT&&($=n.RGBA32F),O===n.HALF_FLOAT&&($=n.RGBA16F),O===n.UNSIGNED_BYTE&&($=Q===ge?n.SRGB8_ALPHA8:n.RGBA8),O===n.UNSIGNED_SHORT&&rt&&($=rt.RGBA16_EXT),O===n.SHORT&&rt&&($=rt.RGBA16_SNORM_EXT),O===n.UNSIGNED_SHORT_4_4_4_4&&($=n.RGBA4),O===n.UNSIGNED_SHORT_5_5_5_1&&($=n.RGB5_A1)}return($===n.R16F||$===n.R32F||$===n.RG16F||$===n.RG32F||$===n.RGBA16F||$===n.RGBA32F)&&t.get("EXT_color_buffer_float"),$}function T(E,_){let O;return E?_===null||_===Hn||_===or?O=n.DEPTH24_STENCIL8:_===Gn?O=n.DEPTH32F_STENCIL8:_===rr&&(O=n.DEPTH24_STENCIL8,kt("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):_===null||_===Hn||_===or?O=n.DEPTH_COMPONENT24:_===Gn?O=n.DEPTH_COMPONENT32F:_===rr&&(O=n.DEPTH_COMPONENT16),O}function b(E,_){return p(E)===!0||E.isFramebufferTexture&&E.minFilter!==Ve&&E.minFilter!==Ge?Math.log2(Math.max(_.width,_.height))+1:E.mipmaps!==void 0&&E.mipmaps.length>0?E.mipmaps.length:E.isCompressedTexture&&Array.isArray(E.image)?_.mipmaps.length:1}function C(E){let _=E.target;_.removeEventListener("dispose",C),w(_),_.isVideoTexture&&u.delete(_),_.isHTMLTexture&&f.delete(_)}function y(E){let _=E.target;_.removeEventListener("dispose",y),F(_)}function w(E){let _=i.get(E);if(_.__webglInit===void 0)return;let O=E.source,z=d.get(O);if(z){let Z=z[_.__cacheKey];Z.usedTimes--,Z.usedTimes===0&&P(E),Object.keys(z).length===0&&d.delete(O)}i.remove(E)}function P(E){let _=i.get(E);n.deleteTexture(_.__webglTexture);let O=E.source,z=d.get(O);delete z[_.__cacheKey],o.memory.textures--}function F(E){let _=i.get(E);if(E.depthTexture&&(E.depthTexture.dispose(),i.remove(E.depthTexture)),E.isWebGLCubeRenderTarget)for(let z=0;z<6;z++){if(Array.isArray(_.__webglFramebuffer[z]))for(let Z=0;Z<_.__webglFramebuffer[z].length;Z++)n.deleteFramebuffer(_.__webglFramebuffer[z][Z]);else n.deleteFramebuffer(_.__webglFramebuffer[z]);_.__webglDepthbuffer&&n.deleteRenderbuffer(_.__webglDepthbuffer[z])}else{if(Array.isArray(_.__webglFramebuffer))for(let z=0;z<_.__webglFramebuffer.length;z++)n.deleteFramebuffer(_.__webglFramebuffer[z]);else n.deleteFramebuffer(_.__webglFramebuffer);if(_.__webglDepthbuffer&&n.deleteRenderbuffer(_.__webglDepthbuffer),_.__webglMultisampledFramebuffer&&n.deleteFramebuffer(_.__webglMultisampledFramebuffer),_.__webglColorRenderbuffer)for(let z=0;z<_.__webglColorRenderbuffer.length;z++)_.__webglColorRenderbuffer[z]&&n.deleteRenderbuffer(_.__webglColorRenderbuffer[z]);_.__webglDepthRenderbuffer&&n.deleteRenderbuffer(_.__webglDepthRenderbuffer)}let O=E.textures;for(let z=0,Z=O.length;z<Z;z++){let st=i.get(O[z]);st.__webglTexture&&(n.deleteTexture(st.__webglTexture),o.memory.textures--),i.remove(O[z])}i.remove(E)}let B=0;function V(){B=0}function I(){return B}function k(E){B=E}function W(){let E=B;return E>=s.maxTextures&&kt("WebGLTextures: Trying to use "+(E+1)+" texture units while this GPU supports only "+s.maxTextures),B+=1,E}function J(E){let _=[];return _.push(E.wrapS),_.push(E.wrapT),_.push(E.wrapR||0),_.push(E.magFilter),_.push(E.minFilter),_.push(E.anisotropy),_.push(E.internalFormat),_.push(E.format),_.push(E.type),_.push(E.generateMipmaps),_.push(E.premultiplyAlpha),_.push(E.flipY),_.push(E.unpackAlignment),_.push(E.colorSpace),_.join()}function et(E,_){let O=i.get(E);if(E.isVideoTexture&&R(E),E.isRenderTargetTexture===!1&&E.isExternalTexture!==!0&&E.version>0&&O.__version!==E.version){let z=E.image;if(z===null)kt("WebGLRenderer: Texture marked for update but no image data found.");else if(z.complete===!1)kt("WebGLRenderer: Texture marked for update but image is incomplete");else{it(O,E,_);return}}else E.isExternalTexture&&(O.__webglTexture=E.sourceTexture?E.sourceTexture:null);e.bindTexture(n.TEXTURE_2D,O.__webglTexture,n.TEXTURE0+_)}function U(E,_){let O=i.get(E);if(E.isRenderTargetTexture===!1&&E.version>0&&O.__version!==E.version){it(O,E,_);return}else E.isExternalTexture&&(O.__webglTexture=E.sourceTexture?E.sourceTexture:null);e.bindTexture(n.TEXTURE_2D_ARRAY,O.__webglTexture,n.TEXTURE0+_)}function q(E,_){let O=i.get(E);if(E.isRenderTargetTexture===!1&&E.version>0&&O.__version!==E.version){it(O,E,_);return}e.bindTexture(n.TEXTURE_3D,O.__webglTexture,n.TEXTURE0+_)}function j(E,_){let O=i.get(E);if(E.isCubeDepthTexture!==!0&&E.version>0&&O.__version!==E.version){wt(O,E,_);return}e.bindTexture(n.TEXTURE_CUBE_MAP,O.__webglTexture,n.TEXTURE0+_)}let xt={[xa]:n.REPEAT,[ei]:n.CLAMP_TO_EDGE,[ya]:n.MIRRORED_REPEAT},Mt={[Ve]:n.NEAREST,[Vd]:n.NEAREST_MIPMAP_NEAREST,[to]:n.NEAREST_MIPMAP_LINEAR,[Ge]:n.LINEAR,[Za]:n.LINEAR_MIPMAP_NEAREST,[Zi]:n.LINEAR_MIPMAP_LINEAR},le={[Xd]:n.NEVER,[$d]:n.ALWAYS,[qd]:n.LESS,[Ll]:n.LEQUAL,[Yd]:n.EQUAL,[Dl]:n.GEQUAL,[Zd]:n.GREATER,[Jd]:n.NOTEQUAL};function Vt(E,_){if(_.type===Gn&&t.has("OES_texture_float_linear")===!1&&(_.magFilter===Ge||_.magFilter===Za||_.magFilter===to||_.magFilter===Zi||_.minFilter===Ge||_.minFilter===Za||_.minFilter===to||_.minFilter===Zi)&&kt("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(E,n.TEXTURE_WRAP_S,xt[_.wrapS]),n.texParameteri(E,n.TEXTURE_WRAP_T,xt[_.wrapT]),(E===n.TEXTURE_3D||E===n.TEXTURE_2D_ARRAY)&&n.texParameteri(E,n.TEXTURE_WRAP_R,xt[_.wrapR]),n.texParameteri(E,n.TEXTURE_MAG_FILTER,Mt[_.magFilter]),n.texParameteri(E,n.TEXTURE_MIN_FILTER,Mt[_.minFilter]),_.compareFunction&&(n.texParameteri(E,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(E,n.TEXTURE_COMPARE_FUNC,le[_.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(_.magFilter===Ve||_.minFilter!==to&&_.minFilter!==Zi||_.type===Gn&&t.has("OES_texture_float_linear")===!1)return;if(_.anisotropy>1||i.get(_).__currentAnisotropy){let O=t.get("EXT_texture_filter_anisotropic");n.texParameterf(E,O.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(_.anisotropy,s.getMaxAnisotropy())),i.get(_).__currentAnisotropy=_.anisotropy}}}function St(E,_){let O=!1;E.__webglInit===void 0&&(E.__webglInit=!0,_.addEventListener("dispose",C));let z=_.source,Z=d.get(z);Z===void 0&&(Z={},d.set(z,Z));let st=J(_);if(st!==E.__cacheKey){Z[st]===void 0&&(Z[st]={texture:n.createTexture(),usedTimes:0},o.memory.textures++,O=!0),Z[st].usedTimes++;let rt=Z[E.__cacheKey];rt!==void 0&&(Z[E.__cacheKey].usedTimes--,rt.usedTimes===0&&P(_)),E.__cacheKey=st,E.__webglTexture=Z[st].texture}return O}function Y(E,_,O){return Math.floor(Math.floor(E/O)/_)}function K(E,_,O,z){let st=E.updateRanges;if(st.length===0)e.texSubImage2D(n.TEXTURE_2D,0,0,0,_.width,_.height,O,z,_.data);else{st.sort((Lt,dt)=>Lt.start-dt.start);let rt=0;for(let Lt=1;Lt<st.length;Lt++){let dt=st[rt],ct=st[Lt],Ct=dt.start+dt.count,Bt=Y(ct.start,_.width,4),Ft=Y(dt.start,_.width,4);ct.start<=Ct+1&&Bt===Ft&&Y(ct.start+ct.count-1,_.width,4)===Bt?dt.count=Math.max(dt.count,ct.start+ct.count-dt.start):(++rt,st[rt]=ct)}st.length=rt+1;let $=e.getParameter(n.UNPACK_ROW_LENGTH),Q=e.getParameter(n.UNPACK_SKIP_PIXELS),at=e.getParameter(n.UNPACK_SKIP_ROWS);e.pixelStorei(n.UNPACK_ROW_LENGTH,_.width);for(let Lt=0,dt=st.length;Lt<dt;Lt++){let ct=st[Lt],Ct=Math.floor(ct.start/4),Bt=Math.ceil(ct.count/4),Ft=Ct%_.width,N=Math.floor(Ct/_.width),ht=Bt,tt=1;e.pixelStorei(n.UNPACK_SKIP_PIXELS,Ft),e.pixelStorei(n.UNPACK_SKIP_ROWS,N),e.texSubImage2D(n.TEXTURE_2D,0,Ft,N,ht,tt,O,z,_.data)}E.clearUpdateRanges(),e.pixelStorei(n.UNPACK_ROW_LENGTH,$),e.pixelStorei(n.UNPACK_SKIP_PIXELS,Q),e.pixelStorei(n.UNPACK_SKIP_ROWS,at)}}function it(E,_,O){let z=n.TEXTURE_2D;(_.isDataArrayTexture||_.isCompressedArrayTexture)&&(z=n.TEXTURE_2D_ARRAY),_.isData3DTexture&&(z=n.TEXTURE_3D);let Z=St(E,_),st=_.source;e.bindTexture(z,E.__webglTexture,n.TEXTURE0+O);let rt=i.get(st);if(st.version!==rt.__version||Z===!0){if(e.activeTexture(n.TEXTURE0+O),(typeof ImageBitmap<"u"&&_.image instanceof ImageBitmap)===!1){let tt=he.getPrimaries(he.workingColorSpace),lt=_.colorSpace===bi?null:he.getPrimaries(_.colorSpace),pt=_.colorSpace===bi||tt===lt?n.NONE:n.BROWSER_DEFAULT_WEBGL;e.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,_.flipY),e.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,_.premultiplyAlpha),e.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,pt)}e.pixelStorei(n.UNPACK_ALIGNMENT,_.unpackAlignment);let Q=g(_.image,!1,s.maxTextureSize);Q=$t(_,Q);let at=r.convert(_.format,_.colorSpace),Lt=r.convert(_.type),dt=M(_.internalFormat,at,Lt,_.normalized,_.colorSpace,_.isVideoTexture);Vt(z,_);let ct,Ct=_.mipmaps,Bt=_.isVideoTexture!==!0,Ft=rt.__version===void 0||Z===!0,N=st.dataReady,ht=b(_,Q);if(_.isDepthTexture)dt=T(_.format===Ji,_.type),Ft&&(Bt?e.texStorage2D(n.TEXTURE_2D,1,dt,Q.width,Q.height):e.texImage2D(n.TEXTURE_2D,0,dt,Q.width,Q.height,0,at,Lt,null));else if(_.isDataTexture)if(Ct.length>0){Bt&&Ft&&e.texStorage2D(n.TEXTURE_2D,ht,dt,Ct[0].width,Ct[0].height);for(let tt=0,lt=Ct.length;tt<lt;tt++)ct=Ct[tt],Bt?N&&e.texSubImage2D(n.TEXTURE_2D,tt,0,0,ct.width,ct.height,at,Lt,ct.data):e.texImage2D(n.TEXTURE_2D,tt,dt,ct.width,ct.height,0,at,Lt,ct.data);_.generateMipmaps=!1}else Bt?(Ft&&e.texStorage2D(n.TEXTURE_2D,ht,dt,Q.width,Q.height),N&&K(_,Q,at,Lt)):e.texImage2D(n.TEXTURE_2D,0,dt,Q.width,Q.height,0,at,Lt,Q.data);else if(_.isCompressedTexture)if(_.isCompressedArrayTexture){Bt&&Ft&&e.texStorage3D(n.TEXTURE_2D_ARRAY,ht,dt,Ct[0].width,Ct[0].height,Q.depth);for(let tt=0,lt=Ct.length;tt<lt;tt++)if(ct=Ct[tt],_.format!==Dn)if(at!==null)if(Bt){if(N)if(_.layerUpdates.size>0){let pt=Sh(ct.width,ct.height,_.format,_.type);for(let nt of _.layerUpdates){let _t=ct.data.subarray(nt*pt/ct.data.BYTES_PER_ELEMENT,(nt+1)*pt/ct.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,tt,0,0,nt,ct.width,ct.height,1,at,_t)}}else e.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,tt,0,0,0,ct.width,ct.height,Q.depth,at,ct.data)}else e.compressedTexImage3D(n.TEXTURE_2D_ARRAY,tt,dt,ct.width,ct.height,Q.depth,0,ct.data,0,0);else kt("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Bt?N&&e.texSubImage3D(n.TEXTURE_2D_ARRAY,tt,0,0,0,ct.width,ct.height,Q.depth,at,Lt,ct.data):e.texImage3D(n.TEXTURE_2D_ARRAY,tt,dt,ct.width,ct.height,Q.depth,0,at,Lt,ct.data);_.layerUpdates.size>0&&_.clearLayerUpdates()}else{Bt&&Ft&&e.texStorage2D(n.TEXTURE_2D,ht,dt,Ct[0].width,Ct[0].height);for(let tt=0,lt=Ct.length;tt<lt;tt++)ct=Ct[tt],_.format!==Dn?at!==null?Bt?N&&e.compressedTexSubImage2D(n.TEXTURE_2D,tt,0,0,ct.width,ct.height,at,ct.data):e.compressedTexImage2D(n.TEXTURE_2D,tt,dt,ct.width,ct.height,0,ct.data):kt("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Bt?N&&e.texSubImage2D(n.TEXTURE_2D,tt,0,0,ct.width,ct.height,at,Lt,ct.data):e.texImage2D(n.TEXTURE_2D,tt,dt,ct.width,ct.height,0,at,Lt,ct.data)}else if(_.isDataArrayTexture)if(Bt){if(Ft&&e.texStorage3D(n.TEXTURE_2D_ARRAY,ht,dt,Q.width,Q.height,Q.depth),N)if(_.layerUpdates.size>0){let tt=Sh(Q.width,Q.height,_.format,_.type);for(let lt of _.layerUpdates){let pt=Q.data.subarray(lt*tt/Q.data.BYTES_PER_ELEMENT,(lt+1)*tt/Q.data.BYTES_PER_ELEMENT);e.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,lt,Q.width,Q.height,1,at,Lt,pt)}_.clearLayerUpdates()}else e.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,Q.width,Q.height,Q.depth,at,Lt,Q.data)}else e.texImage3D(n.TEXTURE_2D_ARRAY,0,dt,Q.width,Q.height,Q.depth,0,at,Lt,Q.data);else if(_.isData3DTexture)Bt?(Ft&&e.texStorage3D(n.TEXTURE_3D,ht,dt,Q.width,Q.height,Q.depth),N&&e.texSubImage3D(n.TEXTURE_3D,0,0,0,0,Q.width,Q.height,Q.depth,at,Lt,Q.data)):e.texImage3D(n.TEXTURE_3D,0,dt,Q.width,Q.height,Q.depth,0,at,Lt,Q.data);else if(_.isFramebufferTexture){if(Ft)if(Bt)e.texStorage2D(n.TEXTURE_2D,ht,dt,Q.width,Q.height);else{let tt=Q.width,lt=Q.height;for(let pt=0;pt<ht;pt++)e.texImage2D(n.TEXTURE_2D,pt,dt,tt,lt,0,at,Lt,null),tt>>=1,lt>>=1}}else if(_.isHTMLTexture){if("texElementImage2D"in n){let tt=n.canvas;if(tt.hasAttribute("layoutsubtree")||tt.setAttribute("layoutsubtree","true"),Q.parentNode!==tt){tt.appendChild(Q),f.add(_),tt.onpaint=lt=>{let pt=lt.changedElements;for(let nt of f)pt.includes(nt.image)&&(nt.needsUpdate=!0)},tt.requestPaint();return}if(n.texElementImage2D.length===3)n.texElementImage2D(n.TEXTURE_2D,n.RGBA8,Q);else{let pt=n.RGBA,nt=n.RGBA,_t=n.UNSIGNED_BYTE;n.texElementImage2D(n.TEXTURE_2D,0,pt,nt,_t,Q)}n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MIN_FILTER,n.LINEAR),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_S,n.CLAMP_TO_EDGE),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_T,n.CLAMP_TO_EDGE)}}else if(Ct.length>0){if(Bt&&Ft){let tt=At(Ct[0]);e.texStorage2D(n.TEXTURE_2D,ht,dt,tt.width,tt.height)}for(let tt=0,lt=Ct.length;tt<lt;tt++)ct=Ct[tt],Bt?N&&e.texSubImage2D(n.TEXTURE_2D,tt,0,0,at,Lt,ct):e.texImage2D(n.TEXTURE_2D,tt,dt,at,Lt,ct);_.generateMipmaps=!1}else if(Bt){if(Ft){let tt=At(Q);e.texStorage2D(n.TEXTURE_2D,ht,dt,tt.width,tt.height)}N&&e.texSubImage2D(n.TEXTURE_2D,0,0,0,at,Lt,Q)}else e.texImage2D(n.TEXTURE_2D,0,dt,at,Lt,Q);p(_)&&S(z),rt.__version=st.version,_.onUpdate&&_.onUpdate(_)}E.__version=_.version}function wt(E,_,O){if(_.image.length!==6)return;let z=St(E,_),Z=_.source;e.bindTexture(n.TEXTURE_CUBE_MAP,E.__webglTexture,n.TEXTURE0+O);let st=i.get(Z);if(Z.version!==st.__version||z===!0){e.activeTexture(n.TEXTURE0+O);let rt=he.getPrimaries(he.workingColorSpace),$=_.colorSpace===bi?null:he.getPrimaries(_.colorSpace),Q=_.colorSpace===bi||rt===$?n.NONE:n.BROWSER_DEFAULT_WEBGL;e.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,_.flipY),e.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,_.premultiplyAlpha),e.pixelStorei(n.UNPACK_ALIGNMENT,_.unpackAlignment),e.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,Q);let at=_.isCompressedTexture||_.image[0].isCompressedTexture,Lt=_.image[0]&&_.image[0].isDataTexture,dt=[];for(let nt=0;nt<6;nt++)!at&&!Lt?dt[nt]=g(_.image[nt],!0,s.maxCubemapSize):dt[nt]=Lt?_.image[nt].image:_.image[nt],dt[nt]=$t(_,dt[nt]);let ct=dt[0],Ct=r.convert(_.format,_.colorSpace),Bt=r.convert(_.type),Ft=M(_.internalFormat,Ct,Bt,_.normalized,_.colorSpace),N=_.isVideoTexture!==!0,ht=st.__version===void 0||z===!0,tt=Z.dataReady,lt=b(_,ct);Vt(n.TEXTURE_CUBE_MAP,_);let pt;if(at){N&&ht&&e.texStorage2D(n.TEXTURE_CUBE_MAP,lt,Ft,ct.width,ct.height);for(let nt=0;nt<6;nt++){pt=dt[nt].mipmaps;for(let _t=0;_t<pt.length;_t++){let bt=pt[_t];_.format!==Dn?Ct!==null?N?tt&&e.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+nt,_t,0,0,bt.width,bt.height,Ct,bt.data):e.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+nt,_t,Ft,bt.width,bt.height,0,bt.data):kt("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):N?tt&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+nt,_t,0,0,bt.width,bt.height,Ct,Bt,bt.data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+nt,_t,Ft,bt.width,bt.height,0,Ct,Bt,bt.data)}}}else{if(pt=_.mipmaps,N&&ht){pt.length>0&&lt++;let nt=At(dt[0]);e.texStorage2D(n.TEXTURE_CUBE_MAP,lt,Ft,nt.width,nt.height)}for(let nt=0;nt<6;nt++)if(Lt){N?tt&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+nt,0,0,0,dt[nt].width,dt[nt].height,Ct,Bt,dt[nt].data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+nt,0,Ft,dt[nt].width,dt[nt].height,0,Ct,Bt,dt[nt].data);for(let _t=0;_t<pt.length;_t++){let Pt=pt[_t].image[nt].image;N?tt&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+nt,_t+1,0,0,Pt.width,Pt.height,Ct,Bt,Pt.data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+nt,_t+1,Ft,Pt.width,Pt.height,0,Ct,Bt,Pt.data)}}else{N?tt&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+nt,0,0,0,Ct,Bt,dt[nt]):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+nt,0,Ft,Ct,Bt,dt[nt]);for(let _t=0;_t<pt.length;_t++){let bt=pt[_t];N?tt&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+nt,_t+1,0,0,Ct,Bt,bt.image[nt]):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+nt,_t+1,Ft,Ct,Bt,bt.image[nt])}}}p(_)&&S(n.TEXTURE_CUBE_MAP),st.__version=Z.version,_.onUpdate&&_.onUpdate(_)}E.__version=_.version}function ot(E,_,O,z,Z,st){let rt=r.convert(O.format,O.colorSpace),$=r.convert(O.type),Q=M(O.internalFormat,rt,$,O.normalized,O.colorSpace),at=i.get(_),Lt=i.get(O);if(Lt.__renderTarget=_,!at.__hasExternalTextures){let dt=Math.max(1,_.width>>st),ct=Math.max(1,_.height>>st);Z===n.TEXTURE_3D||Z===n.TEXTURE_2D_ARRAY?e.texImage3D(Z,st,Q,dt,ct,_.depth,0,rt,$,null):e.texImage2D(Z,st,Q,dt,ct,0,rt,$,null)}e.bindFramebuffer(n.FRAMEBUFFER,E),ee(_)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,z,Z,Lt.__webglTexture,0,Yt(_)):(Z===n.TEXTURE_2D||Z>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&Z<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,z,Z,Lt.__webglTexture,st),e.bindFramebuffer(n.FRAMEBUFFER,null)}function ut(E,_,O){if(n.bindRenderbuffer(n.RENDERBUFFER,E),_.depthBuffer){let z=_.depthTexture,Z=z&&z.isDepthTexture?z.type:null,st=T(_.stencilBuffer,Z),rt=_.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;ee(_)?a.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,Yt(_),st,_.width,_.height):O?n.renderbufferStorageMultisample(n.RENDERBUFFER,Yt(_),st,_.width,_.height):n.renderbufferStorage(n.RENDERBUFFER,st,_.width,_.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,rt,n.RENDERBUFFER,E)}else{let z=_.textures;for(let Z=0;Z<z.length;Z++){let st=z[Z],rt=r.convert(st.format,st.colorSpace),$=r.convert(st.type),Q=M(st.internalFormat,rt,$,st.normalized,st.colorSpace);ee(_)?a.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,Yt(_),Q,_.width,_.height):O?n.renderbufferStorageMultisample(n.RENDERBUFFER,Yt(_),Q,_.width,_.height):n.renderbufferStorage(n.RENDERBUFFER,Q,_.width,_.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function Ht(E,_,O){let z=_.isWebGLCubeRenderTarget===!0;if(e.bindFramebuffer(n.FRAMEBUFFER,E),!(_.depthTexture&&_.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");let Z=i.get(_.depthTexture);if(Z.__renderTarget=_,(!Z.__webglTexture||_.depthTexture.image.width!==_.width||_.depthTexture.image.height!==_.height)&&(_.depthTexture.image.width=_.width,_.depthTexture.image.height=_.height,_.depthTexture.needsUpdate=!0),z){if(Z.__webglInit===void 0&&(Z.__webglInit=!0,_.depthTexture.addEventListener("dispose",C)),Z.__webglTexture===void 0){Z.__webglTexture=n.createTexture(),e.bindTexture(n.TEXTURE_CUBE_MAP,Z.__webglTexture),Vt(n.TEXTURE_CUBE_MAP,_.depthTexture);let at=r.convert(_.depthTexture.format),Lt=r.convert(_.depthTexture.type),dt;_.depthTexture.format===ni?dt=n.DEPTH_COMPONENT24:_.depthTexture.format===Ji&&(dt=n.DEPTH24_STENCIL8);for(let ct=0;ct<6;ct++)n.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ct,0,dt,_.width,_.height,0,at,Lt,null)}}else et(_.depthTexture,0);let st=Z.__webglTexture,rt=Yt(_),$=z?n.TEXTURE_CUBE_MAP_POSITIVE_X+O:n.TEXTURE_2D,Q=_.depthTexture.format===Ji?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;if(_.depthTexture.format===ni)ee(_)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,Q,$,st,0,rt):n.framebufferTexture2D(n.FRAMEBUFFER,Q,$,st,0);else if(_.depthTexture.format===Ji)ee(_)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,Q,$,st,0,rt):n.framebufferTexture2D(n.FRAMEBUFFER,Q,$,st,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function Nt(E){let _=i.get(E),O=E.isWebGLCubeRenderTarget===!0;if(_.__boundDepthTexture!==E.depthTexture){let z=E.depthTexture;if(_.__depthDisposeCallback&&_.__depthDisposeCallback(),z){let Z=()=>{delete _.__boundDepthTexture,delete _.__depthDisposeCallback,z.removeEventListener("dispose",Z)};z.addEventListener("dispose",Z),_.__depthDisposeCallback=Z}_.__boundDepthTexture=z}if(E.depthTexture&&!_.__autoAllocateDepthBuffer)if(O)for(let z=0;z<6;z++)Ht(_.__webglFramebuffer[z],E,z);else{let z=E.texture.mipmaps;z&&z.length>0?Ht(_.__webglFramebuffer[0],E,0):Ht(_.__webglFramebuffer,E,0)}else if(O){_.__webglDepthbuffer=[];for(let z=0;z<6;z++)if(e.bindFramebuffer(n.FRAMEBUFFER,_.__webglFramebuffer[z]),_.__webglDepthbuffer[z]===void 0)_.__webglDepthbuffer[z]=n.createRenderbuffer(),ut(_.__webglDepthbuffer[z],E,!1);else{let Z=E.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,st=_.__webglDepthbuffer[z];n.bindRenderbuffer(n.RENDERBUFFER,st),n.framebufferRenderbuffer(n.FRAMEBUFFER,Z,n.RENDERBUFFER,st)}}else{let z=E.texture.mipmaps;if(z&&z.length>0?e.bindFramebuffer(n.FRAMEBUFFER,_.__webglFramebuffer[0]):e.bindFramebuffer(n.FRAMEBUFFER,_.__webglFramebuffer),_.__webglDepthbuffer===void 0)_.__webglDepthbuffer=n.createRenderbuffer(),ut(_.__webglDepthbuffer,E,!1);else{let Z=E.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,st=_.__webglDepthbuffer;n.bindRenderbuffer(n.RENDERBUFFER,st),n.framebufferRenderbuffer(n.FRAMEBUFFER,Z,n.RENDERBUFFER,st)}}e.bindFramebuffer(n.FRAMEBUFFER,null)}function zt(E,_,O){let z=i.get(E);_!==void 0&&ot(z.__webglFramebuffer,E,E.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),O!==void 0&&Nt(E)}function Ut(E){let _=E.texture,O=i.get(E),z=i.get(_);E.addEventListener("dispose",y);let Z=E.textures,st=E.isWebGLCubeRenderTarget===!0,rt=Z.length>1;if(rt||(z.__webglTexture===void 0&&(z.__webglTexture=n.createTexture()),z.__version=_.version,o.memory.textures++),st){O.__webglFramebuffer=[];for(let $=0;$<6;$++)if(_.mipmaps&&_.mipmaps.length>0){O.__webglFramebuffer[$]=[];for(let Q=0;Q<_.mipmaps.length;Q++)O.__webglFramebuffer[$][Q]=n.createFramebuffer()}else O.__webglFramebuffer[$]=n.createFramebuffer()}else{if(_.mipmaps&&_.mipmaps.length>0){O.__webglFramebuffer=[];for(let $=0;$<_.mipmaps.length;$++)O.__webglFramebuffer[$]=n.createFramebuffer()}else O.__webglFramebuffer=n.createFramebuffer();if(rt)for(let $=0,Q=Z.length;$<Q;$++){let at=i.get(Z[$]);at.__webglTexture===void 0&&(at.__webglTexture=n.createTexture(),o.memory.textures++)}if(E.samples>0&&ee(E)===!1){O.__webglMultisampledFramebuffer=n.createFramebuffer(),O.__webglColorRenderbuffer=[],e.bindFramebuffer(n.FRAMEBUFFER,O.__webglMultisampledFramebuffer);for(let $=0;$<Z.length;$++){let Q=Z[$];O.__webglColorRenderbuffer[$]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,O.__webglColorRenderbuffer[$]);let at=r.convert(Q.format,Q.colorSpace),Lt=r.convert(Q.type),dt=M(Q.internalFormat,at,Lt,Q.normalized,Q.colorSpace,E.isXRRenderTarget===!0),ct=Yt(E);n.renderbufferStorageMultisample(n.RENDERBUFFER,ct,dt,E.width,E.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+$,n.RENDERBUFFER,O.__webglColorRenderbuffer[$])}n.bindRenderbuffer(n.RENDERBUFFER,null),E.depthBuffer&&(O.__webglDepthRenderbuffer=n.createRenderbuffer(),ut(O.__webglDepthRenderbuffer,E,!0)),e.bindFramebuffer(n.FRAMEBUFFER,null)}}if(st){e.bindTexture(n.TEXTURE_CUBE_MAP,z.__webglTexture),Vt(n.TEXTURE_CUBE_MAP,_);for(let $=0;$<6;$++)if(_.mipmaps&&_.mipmaps.length>0)for(let Q=0;Q<_.mipmaps.length;Q++)ot(O.__webglFramebuffer[$][Q],E,_,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+$,Q);else ot(O.__webglFramebuffer[$],E,_,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+$,0);p(_)&&S(n.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(rt){for(let $=0,Q=Z.length;$<Q;$++){let at=Z[$],Lt=i.get(at),dt=n.TEXTURE_2D;(E.isWebGL3DRenderTarget||E.isWebGLArrayRenderTarget)&&(dt=E.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),e.bindTexture(dt,Lt.__webglTexture),Vt(dt,at),ot(O.__webglFramebuffer,E,at,n.COLOR_ATTACHMENT0+$,dt,0),p(at)&&S(dt)}e.unbindTexture()}else{let $=n.TEXTURE_2D;if((E.isWebGL3DRenderTarget||E.isWebGLArrayRenderTarget)&&($=E.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),e.bindTexture($,z.__webglTexture),Vt($,_),_.mipmaps&&_.mipmaps.length>0)for(let Q=0;Q<_.mipmaps.length;Q++)ot(O.__webglFramebuffer[Q],E,_,n.COLOR_ATTACHMENT0,$,Q);else ot(O.__webglFramebuffer,E,_,n.COLOR_ATTACHMENT0,$,0);p(_)&&S($),e.unbindTexture()}E.depthBuffer&&Nt(E)}function Rt(E){let _=E.textures;for(let O=0,z=_.length;O<z;O++){let Z=_[O];if(p(Z)){let st=A(E),rt=i.get(Z).__webglTexture;e.bindTexture(st,rt),S(st),e.unbindTexture()}}}let Jt=[],se=[];function _e(E){if(E.samples>0){if(ee(E)===!1){let _=E.textures,O=E.width,z=E.height,Z=n.COLOR_BUFFER_BIT,st=E.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,rt=i.get(E),$=_.length>1;if($)for(let at=0;at<_.length;at++)e.bindFramebuffer(n.FRAMEBUFFER,rt.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+at,n.RENDERBUFFER,null),e.bindFramebuffer(n.FRAMEBUFFER,rt.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+at,n.TEXTURE_2D,null,0);e.bindFramebuffer(n.READ_FRAMEBUFFER,rt.__webglMultisampledFramebuffer);let Q=E.texture.mipmaps;Q&&Q.length>0?e.bindFramebuffer(n.DRAW_FRAMEBUFFER,rt.__webglFramebuffer[0]):e.bindFramebuffer(n.DRAW_FRAMEBUFFER,rt.__webglFramebuffer);for(let at=0;at<_.length;at++){if(E.resolveDepthBuffer&&(E.depthBuffer&&(Z|=n.DEPTH_BUFFER_BIT),E.stencilBuffer&&E.resolveStencilBuffer&&(Z|=n.STENCIL_BUFFER_BIT)),$){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,rt.__webglColorRenderbuffer[at]);let Lt=i.get(_[at]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,Lt,0)}n.blitFramebuffer(0,0,O,z,0,0,O,z,Z,n.NEAREST),c===!0&&(Jt.length=0,se.length=0,Jt.push(n.COLOR_ATTACHMENT0+at),E.depthBuffer&&E.storeMultisampledDepthBuffer===!1&&(Jt.push(st),se.push(st),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,se)),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,Jt))}if(e.bindFramebuffer(n.READ_FRAMEBUFFER,null),e.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),$)for(let at=0;at<_.length;at++){e.bindFramebuffer(n.FRAMEBUFFER,rt.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+at,n.RENDERBUFFER,rt.__webglColorRenderbuffer[at]);let Lt=i.get(_[at]).__webglTexture;e.bindFramebuffer(n.FRAMEBUFFER,rt.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+at,n.TEXTURE_2D,Lt,0)}e.bindFramebuffer(n.DRAW_FRAMEBUFFER,rt.__webglMultisampledFramebuffer)}else if(E.depthBuffer&&E.storeMultisampledDepthBuffer===!1&&c){let _=E.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[_])}}}function Yt(E){return Math.min(s.maxSamples,E.samples)}function ee(E){let _=i.get(E);return E.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&_.__useRenderToTexture!==!1}function R(E){let _=o.render.frame;u.get(E)!==_&&(u.set(E,_),E.update())}function $t(E,_){let O=E.colorSpace,z=E.format,Z=E.type;return E.isCompressedTexture===!0||E.isVideoTexture===!0||O!==Dr&&O!==bi&&(he.getTransfer(O)===ge?(z!==Dn||Z!==dn)&&kt("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):Wt("WebGLTextures: Unsupported texture color space:",O)),_}function At(E){return typeof HTMLImageElement<"u"&&E instanceof HTMLImageElement?(l.width=E.naturalWidth||E.width,l.height=E.naturalHeight||E.height):typeof VideoFrame<"u"&&E instanceof VideoFrame?(l.width=E.displayWidth,l.height=E.displayHeight):(l.width=E.width,l.height=E.height),l}this.allocateTextureUnit=W,this.resetTextureUnits=V,this.getTextureUnits=I,this.setTextureUnits=k,this.setTexture2D=et,this.setTexture2DArray=U,this.setTexture3D=q,this.setTextureCube=j,this.rebindTextures=zt,this.setupRenderTarget=Ut,this.updateRenderTargetMipmap=Rt,this.updateMultisampleRenderTarget=_e,this.setupDepthRenderbuffer=Nt,this.setupFrameBufferTexture=ot,this.useMultisampledRTT=ee,this.isReversedDepthBuffer=function(){return e.buffers.depth.getReversed()}}function Qx(n,t){function e(i,s=bi){let r,o=he.getTransfer(s);if(i===dn)return n.UNSIGNED_BYTE;if(i===$a)return n.UNSIGNED_SHORT_4_4_4_4;if(i===Ka)return n.UNSIGNED_SHORT_5_5_5_1;if(i===hh)return n.UNSIGNED_INT_5_9_9_9_REV;if(i===uh)return n.UNSIGNED_INT_10F_11F_11F_REV;if(i===lh)return n.BYTE;if(i===ch)return n.SHORT;if(i===rr)return n.UNSIGNED_SHORT;if(i===Ja)return n.INT;if(i===Hn)return n.UNSIGNED_INT;if(i===Gn)return n.FLOAT;if(i===Wn)return n.HALF_FLOAT;if(i===dh)return n.ALPHA;if(i===fh)return n.RGB;if(i===Dn)return n.RGBA;if(i===ni)return n.DEPTH_COMPONENT;if(i===Ji)return n.DEPTH_STENCIL;if(i===ph)return n.RED;if(i===ja)return n.RED_INTEGER;if(i===$i)return n.RG;if(i===Qa)return n.RG_INTEGER;if(i===tl)return n.RGBA_INTEGER;if(i===eo||i===no||i===io||i===so)if(o===ge)if(r=t.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(i===eo)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===no)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===io)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===so)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=t.get("WEBGL_compressed_texture_s3tc"),r!==null){if(i===eo)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===no)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===io)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===so)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===el||i===nl||i===il||i===sl)if(r=t.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(i===el)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===nl)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===il)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===sl)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===rl||i===ol||i===al||i===ll||i===cl||i===ro||i===hl)if(r=t.get("WEBGL_compressed_texture_etc"),r!==null){if(i===rl||i===ol)return o===ge?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(i===al)return o===ge?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC;if(i===ll)return r.COMPRESSED_R11_EAC;if(i===cl)return r.COMPRESSED_SIGNED_R11_EAC;if(i===ro)return r.COMPRESSED_RG11_EAC;if(i===hl)return r.COMPRESSED_SIGNED_RG11_EAC}else return null;if(i===ul||i===dl||i===fl||i===pl||i===ml||i===gl||i===_l||i===xl||i===yl||i===vl||i===Ml||i===Sl||i===bl||i===Tl)if(r=t.get("WEBGL_compressed_texture_astc"),r!==null){if(i===ul)return o===ge?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===dl)return o===ge?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===fl)return o===ge?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===pl)return o===ge?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===ml)return o===ge?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===gl)return o===ge?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===_l)return o===ge?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===xl)return o===ge?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===yl)return o===ge?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===vl)return o===ge?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===Ml)return o===ge?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===Sl)return o===ge?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===bl)return o===ge?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===Tl)return o===ge?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===El||i===wl||i===Al)if(r=t.get("EXT_texture_compression_bptc"),r!==null){if(i===El)return o===ge?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===wl)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===Al)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===Cl||i===Rl||i===oo||i===Pl)if(r=t.get("EXT_texture_compression_rgtc"),r!==null){if(i===Cl)return r.COMPRESSED_RED_RGTC1_EXT;if(i===Rl)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===oo)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===Pl)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===or?n.UNSIGNED_INT_24_8:n[i]!==void 0?n[i]:null}return{convert:e}}var ty=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,ey=`
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

}`,Vh=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e){if(this.texture===null){let i=new Hr(t.texture);(t.depthNear!==e.depthNear||t.depthFar!==e.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=i}}getMesh(t){if(this.texture!==null&&this.mesh===null){let e=t.cameras[0].viewport,i=new Sn({vertexShader:ty,fragmentShader:ey,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new tn(new en(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},Hh=class extends zn{constructor(t,e){super();let i=this,s=null,r=1,o=null,a="local-floor",c=1,l=null,u=null,f=null,h=null,d=null,m=null,x=typeof XRWebGLBinding<"u",g=new Vh,p={},S=e.getContextAttributes(),A=null,M=null,T=[],b=[],C=new Gt,y=null,w=null,P=new Ye;P.viewport=new Ae;let F=new Ye;F.viewport=new Ae;let B=[P,F],V=new Wa,I=null,k=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Y){let K=T[Y];return K===void 0&&(K=new Zs,T[Y]=K),K.getTargetRaySpace()},this.getControllerGrip=function(Y){let K=T[Y];return K===void 0&&(K=new Zs,T[Y]=K),K.getGripSpace()},this.getHand=function(Y){let K=T[Y];return K===void 0&&(K=new Zs,T[Y]=K),K.getHandSpace()};function W(Y){let K=b.indexOf(Y.inputSource);if(K===-1)return;let it=T[K];it!==void 0&&(it.update(Y.inputSource,Y.frame,l||o),it.dispatchEvent({type:Y.type,data:Y.inputSource}))}function J(){s.removeEventListener("select",W),s.removeEventListener("selectstart",W),s.removeEventListener("selectend",W),s.removeEventListener("squeeze",W),s.removeEventListener("squeezestart",W),s.removeEventListener("squeezeend",W),s.removeEventListener("end",J),s.removeEventListener("inputsourceschange",et);for(let Y=0;Y<T.length;Y++){let K=b[Y];K!==null&&(b[Y]=null,T[Y].disconnect(K))}I=null,k=null,g.reset();for(let Y in p)delete p[Y];if(t.setRenderTarget(A),d=null,h=null,f=null,s=null,M=null,St.stop(),i.isPresenting=!1,t.setPixelRatio(y),t.setSize(C.width,C.height,!1),w!==null){let Y=w.camera;Y.fov=w.fov,Y.zoom=w.zoom,Y.updateProjectionMatrix(),w=null}i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Y){r=Y,i.isPresenting===!0&&kt("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Y){a=Y,i.isPresenting===!0&&kt("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||o},this.setReferenceSpace=function(Y){l=Y},this.getBaseLayer=function(){return h!==null?h:d},this.getBinding=function(){return f===null&&x&&(f=new XRWebGLBinding(s,e)),f},this.getFrame=function(){return m},this.getSession=function(){return s},this.setSession=async function(Y){if(s=Y,s!==null){if(A=t.getRenderTarget(),s.addEventListener("select",W),s.addEventListener("selectstart",W),s.addEventListener("selectend",W),s.addEventListener("squeeze",W),s.addEventListener("squeezestart",W),s.addEventListener("squeezeend",W),s.addEventListener("end",J),s.addEventListener("inputsourceschange",et),S.xrCompatible!==!0&&await e.makeXRCompatible(),y=t.getPixelRatio(),t.getSize(C),x&&"createProjectionLayer"in XRWebGLBinding.prototype){let it=null,wt=null,ot=null;S.depth&&(ot=S.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,it=S.stencil?Ji:ni,wt=S.stencil?or:Hn);let ut={colorFormat:e.RGBA8,depthFormat:ot,scaleFactor:r};f=this.getBinding(),h=f.createProjectionLayer(ut),s.updateRenderState({layers:[h]}),t.setPixelRatio(1),t.setSize(h.textureWidth,h.textureHeight,!1),M=new hn(h.textureWidth,h.textureHeight,{format:Dn,type:dn,depthTexture:new Bi(h.textureWidth,h.textureHeight,wt,void 0,void 0,void 0,void 0,void 0,void 0,it),stencilBuffer:S.stencil,colorSpace:t.outputColorSpace,samples:S.antialias?4:0,resolveDepthBuffer:h.ignoreDepthValues===!1,resolveStencilBuffer:h.ignoreDepthValues===!1,storeMultisampledDepthBuffer:h.ignoreDepthValues===!1,storeMultisampledStencilBuffer:h.ignoreDepthValues===!1})}else{let it={antialias:S.antialias,alpha:!0,depth:S.depth,stencil:S.stencil,framebufferScaleFactor:r};d=new XRWebGLLayer(s,e,it),s.updateRenderState({baseLayer:d}),t.setPixelRatio(1),t.setSize(d.framebufferWidth,d.framebufferHeight,!1),M=new hn(d.framebufferWidth,d.framebufferHeight,{format:Dn,type:dn,colorSpace:t.outputColorSpace,stencilBuffer:S.stencil,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1,storeMultisampledDepthBuffer:d.ignoreDepthValues===!1,storeMultisampledStencilBuffer:d.ignoreDepthValues===!1})}M.isXRRenderTarget=!0,this.setFoveation(c),l=null,o=await s.requestReferenceSpace(a),St.setContext(s),St.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return g.getDepthTexture()};function et(Y){for(let K=0;K<Y.removed.length;K++){let it=Y.removed[K],wt=b.indexOf(it);wt>=0&&(b[wt]=null,T[wt].disconnect(it))}for(let K=0;K<Y.added.length;K++){let it=Y.added[K],wt=b.indexOf(it);if(wt===-1){for(let ut=0;ut<T.length;ut++)if(ut>=b.length){b.push(it),wt=ut;break}else if(b[ut]===null){b[ut]=it,wt=ut;break}if(wt===-1)break}let ot=T[wt];ot&&ot.connect(it)}}let U=new L,q=new L;function j(Y,K,it){U.setFromMatrixPosition(K.matrixWorld),q.setFromMatrixPosition(it.matrixWorld);let wt=U.distanceTo(q),ot=K.projectionMatrix.elements,ut=it.projectionMatrix.elements,Ht=ot[14]/(ot[10]-1),Nt=ot[14]/(ot[10]+1),zt=(ot[9]+1)/ot[5],Ut=(ot[9]-1)/ot[5],Rt=(ot[8]-1)/ot[0],Jt=(ut[8]+1)/ut[0],se=Ht*Rt,_e=Ht*Jt,Yt=wt/(-Rt+Jt),ee=Yt*-Rt;if(K.matrixWorld.decompose(Y.position,Y.quaternion,Y.scale),Y.translateX(ee),Y.translateZ(Yt),Y.matrixWorld.compose(Y.position,Y.quaternion,Y.scale),Y.matrixWorldInverse.copy(Y.matrixWorld).invert(),ot[10]===-1)Y.projectionMatrix.copy(K.projectionMatrix),Y.projectionMatrixInverse.copy(K.projectionMatrixInverse);else{let R=Ht+Yt,$t=Nt+Yt,At=se-ee,E=_e+(wt-ee),_=zt*Nt/$t*R,O=Ut*Nt/$t*R;Y.projectionMatrix.makePerspective(At,E,_,O,R,$t),Y.projectionMatrixInverse.copy(Y.projectionMatrix).invert()}}function xt(Y,K){K===null?Y.matrixWorld.copy(Y.matrix):Y.matrixWorld.multiplyMatrices(K.matrixWorld,Y.matrix),Y.matrixWorldInverse.copy(Y.matrixWorld).invert()}this.updateCamera=function(Y){if(s===null)return;let K=Y.near,it=Y.far;g.texture!==null&&(g.depthNear>0&&(K=g.depthNear),g.depthFar>0&&(it=g.depthFar)),V.near=F.near=P.near=K,V.far=F.far=P.far=it,(I!==V.near||k!==V.far)&&(s.updateRenderState({depthNear:V.near,depthFar:V.far}),I=V.near,k=V.far),V.layers.mask=Y.layers.mask|6,P.layers.mask=V.layers.mask&-5,F.layers.mask=V.layers.mask&-3;let wt=Y.parent,ot=V.cameras;xt(V,wt);for(let ut=0;ut<ot.length;ut++)xt(ot[ut],wt);ot.length===2?j(V,P,F):V.projectionMatrix.copy(P.projectionMatrix),w===null&&Y.isPerspectiveCamera&&(w={camera:Y,fov:Y.fov,zoom:Y.zoom}),Mt(Y,V,wt)};function Mt(Y,K,it){it===null?Y.matrix.copy(K.matrixWorld):(Y.matrix.copy(it.matrixWorld),Y.matrix.invert(),Y.matrix.multiply(K.matrixWorld)),Y.matrix.decompose(Y.position,Y.quaternion,Y.scale),Y.updateMatrixWorld(!0),Y.projectionMatrix.copy(K.projectionMatrix),Y.projectionMatrixInverse.copy(K.projectionMatrixInverse),Y.isPerspectiveCamera&&(Y.fov=qs*2*Math.atan(1/Y.projectionMatrix.elements[5]),Y.zoom=1)}this.getCamera=function(){return V},this.getFoveation=function(){if(!(h===null&&d===null))return c},this.setFoveation=function(Y){c=Y,h!==null&&(h.fixedFoveation=Y),d!==null&&d.fixedFoveation!==void 0&&(d.fixedFoveation=Y)},this.hasDepthSensing=function(){return g.texture!==null},this.getDepthSensingMesh=function(){return g.getMesh(V)},this.getCameraTexture=function(Y){return p[Y]};let le=null;function Vt(Y,K){if(u=K.getViewerPose(l||o),m=K,u!==null){let it=u.views;d!==null&&(t.setRenderTargetFramebuffer(M,d.framebuffer),t.setRenderTarget(M));let wt=!1;it.length!==V.cameras.length&&(V.cameras.length=0,wt=!0);for(let Nt=0;Nt<it.length;Nt++){let zt=it[Nt],Ut=null;if(d!==null)Ut=d.getViewport(zt);else{let Jt=f.getViewSubImage(h,zt);Ut=Jt.viewport,Nt===0&&(t.setRenderTargetTextures(M,Jt.colorTexture,Jt.depthStencilTexture),t.setRenderTarget(M))}let Rt=B[Nt];Rt===void 0&&(Rt=new Ye,Rt.layers.enable(Nt),Rt.viewport=new Ae,B[Nt]=Rt),Rt.matrix.fromArray(zt.transform.matrix),Rt.matrix.decompose(Rt.position,Rt.quaternion,Rt.scale),Rt.projectionMatrix.fromArray(zt.projectionMatrix),Rt.projectionMatrixInverse.copy(Rt.projectionMatrix).invert(),Rt.viewport.set(Ut.x,Ut.y,Ut.width,Ut.height),Nt===0&&(V.matrix.copy(Rt.matrix),V.matrix.decompose(V.position,V.quaternion,V.scale)),wt===!0&&V.cameras.push(Rt)}let ot=s.enabledFeatures;if(ot&&ot.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&x){f=i.getBinding();let Nt=f.getDepthInformation(it[0]);Nt&&Nt.isValid&&Nt.texture&&g.init(Nt,s.renderState)}if(ot&&ot.includes("camera-access")&&x){t.state.unbindTexture(),f=i.getBinding();for(let Nt=0;Nt<it.length;Nt++){let zt=it[Nt].camera;if(zt){let Ut=p[zt];Ut||(Ut=new Hr,p[zt]=Ut);let Rt=f.getCameraImage(zt);Ut.sourceTexture=Rt}}}}for(let it=0;it<T.length;it++){let wt=b[it],ot=T[it];wt!==null&&ot!==void 0&&ot.update(wt,K,l||o)}le&&le(Y,K),K.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:K}),m=null}let St=new Cf;St.setAnimationLoop(Vt),this.setAnimationLoop=function(Y){le=Y},this.dispose=function(){}}},ny=new we,Nf=new Zt;Nf.set(-1,0,0,0,1,0,0,0,1);function iy(n,t){function e(g,p){g.matrixAutoUpdate===!0&&g.updateMatrix(),p.value.copy(g.matrix)}function i(g,p){p.color.getRGB(g.fogColor.value,yh(n)),p.isFog?(g.fogNear.value=p.near,g.fogFar.value=p.far):p.isFogExp2&&(g.fogDensity.value=p.density)}function s(g,p,S,A,M){p.isNodeMaterial?p.uniformsNeedUpdate=!1:p.isMeshBasicMaterial?r(g,p):p.isMeshLambertMaterial?(r(g,p),p.envMap&&(g.envMapIntensity.value=p.envMapIntensity)):p.isMeshToonMaterial?(r(g,p),f(g,p)):p.isMeshPhongMaterial?(r(g,p),u(g,p),p.envMap&&(g.envMapIntensity.value=p.envMapIntensity)):p.isMeshStandardMaterial?(r(g,p),h(g,p),p.isMeshPhysicalMaterial&&d(g,p,M)):p.isMeshMatcapMaterial?(r(g,p),m(g,p)):p.isMeshDepthMaterial?r(g,p):p.isMeshDistanceMaterial?(r(g,p),x(g,p)):p.isMeshNormalMaterial?r(g,p):p.isLineBasicMaterial?(o(g,p),p.isLineDashedMaterial&&a(g,p)):p.isPointsMaterial?c(g,p,S,A):p.isSpriteMaterial?l(g,p):p.isShadowMaterial?(g.color.value.copy(p.color),g.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function r(g,p){g.opacity.value=p.opacity,p.color&&g.diffuse.value.copy(p.color),p.emissive&&g.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(g.map.value=p.map,e(p.map,g.mapTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,e(p.alphaMap,g.alphaMapTransform)),p.bumpMap&&(g.bumpMap.value=p.bumpMap,e(p.bumpMap,g.bumpMapTransform),g.bumpScale.value=p.bumpScale,p.side===sn&&(g.bumpScale.value*=-1)),p.normalMap&&(g.normalMap.value=p.normalMap,e(p.normalMap,g.normalMapTransform),g.normalScale.value.copy(p.normalScale),p.side===sn&&g.normalScale.value.negate()),p.displacementMap&&(g.displacementMap.value=p.displacementMap,e(p.displacementMap,g.displacementMapTransform),g.displacementScale.value=p.displacementScale,g.displacementBias.value=p.displacementBias),p.emissiveMap&&(g.emissiveMap.value=p.emissiveMap,e(p.emissiveMap,g.emissiveMapTransform)),p.specularMap&&(g.specularMap.value=p.specularMap,e(p.specularMap,g.specularMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest);let S=t.get(p),A=S.envMap,M=S.envMapRotation;A&&(g.envMap.value=A,g.envMapRotation.value.setFromMatrix4(ny.makeRotationFromEuler(M)).transpose(),A.isCubeTexture&&A.isRenderTargetTexture===!1&&g.envMapRotation.value.premultiply(Nf),g.reflectivity.value=p.reflectivity,g.ior.value=p.ior,g.refractionRatio.value=p.refractionRatio),p.lightMap&&(g.lightMap.value=p.lightMap,g.lightMapIntensity.value=p.lightMapIntensity,e(p.lightMap,g.lightMapTransform)),p.aoMap&&(g.aoMap.value=p.aoMap,g.aoMapIntensity.value=p.aoMapIntensity,e(p.aoMap,g.aoMapTransform))}function o(g,p){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,p.map&&(g.map.value=p.map,e(p.map,g.mapTransform))}function a(g,p){g.dashSize.value=p.dashSize,g.totalSize.value=p.dashSize+p.gapSize,g.scale.value=p.scale}function c(g,p,S,A){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,g.size.value=p.size*S,g.scale.value=A*.5,p.map&&(g.map.value=p.map,e(p.map,g.uvTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,e(p.alphaMap,g.alphaMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest)}function l(g,p){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,g.rotation.value=p.rotation,p.map&&(g.map.value=p.map,e(p.map,g.mapTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,e(p.alphaMap,g.alphaMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest)}function u(g,p){g.specular.value.copy(p.specular),g.shininess.value=Math.max(p.shininess,1e-4)}function f(g,p){p.gradientMap&&(g.gradientMap.value=p.gradientMap)}function h(g,p){g.metalness.value=p.metalness,p.metalnessMap&&(g.metalnessMap.value=p.metalnessMap,e(p.metalnessMap,g.metalnessMapTransform)),g.roughness.value=p.roughness,p.roughnessMap&&(g.roughnessMap.value=p.roughnessMap,e(p.roughnessMap,g.roughnessMapTransform)),p.envMap&&(g.envMapIntensity.value=p.envMapIntensity)}function d(g,p,S){g.ior.value=p.ior,p.sheen>0&&(g.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),g.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(g.sheenColorMap.value=p.sheenColorMap,e(p.sheenColorMap,g.sheenColorMapTransform)),p.sheenRoughnessMap&&(g.sheenRoughnessMap.value=p.sheenRoughnessMap,e(p.sheenRoughnessMap,g.sheenRoughnessMapTransform))),p.clearcoat>0&&(g.clearcoat.value=p.clearcoat,g.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(g.clearcoatMap.value=p.clearcoatMap,e(p.clearcoatMap,g.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(g.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,e(p.clearcoatRoughnessMap,g.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(g.clearcoatNormalMap.value=p.clearcoatNormalMap,e(p.clearcoatNormalMap,g.clearcoatNormalMapTransform),g.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===sn&&g.clearcoatNormalScale.value.negate())),p.dispersion>0&&(g.dispersion.value=p.dispersion),p.retroreflectivity>0&&(g.retroreflectivity.value=p.retroreflectivity),p.iridescence>0&&(g.iridescence.value=p.iridescence,g.iridescenceIOR.value=p.iridescenceIOR,g.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],g.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(g.iridescenceMap.value=p.iridescenceMap,e(p.iridescenceMap,g.iridescenceMapTransform)),p.iridescenceThicknessMap&&(g.iridescenceThicknessMap.value=p.iridescenceThicknessMap,e(p.iridescenceThicknessMap,g.iridescenceThicknessMapTransform))),p.transmission>0&&(g.transmission.value=p.transmission,g.transmissionSamplerMap.value=S.texture,g.transmissionSamplerSize.value.set(S.width,S.height),p.transmissionMap&&(g.transmissionMap.value=p.transmissionMap,e(p.transmissionMap,g.transmissionMapTransform)),g.thickness.value=p.thickness,p.thicknessMap&&(g.thicknessMap.value=p.thicknessMap,e(p.thicknessMap,g.thicknessMapTransform)),g.attenuationDistance.value=p.attenuationDistance,g.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(g.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(g.anisotropyMap.value=p.anisotropyMap,e(p.anisotropyMap,g.anisotropyMapTransform))),g.specularIntensity.value=p.specularIntensity,g.specularColor.value.copy(p.specularColor),p.specularColorMap&&(g.specularColorMap.value=p.specularColorMap,e(p.specularColorMap,g.specularColorMapTransform)),p.specularIntensityMap&&(g.specularIntensityMap.value=p.specularIntensityMap,e(p.specularIntensityMap,g.specularIntensityMapTransform))}function m(g,p){p.matcap&&(g.matcap.value=p.matcap)}function x(g,p){let S=t.get(p).light;g.referencePosition.value.setFromMatrixPosition(S.matrixWorld),g.nearDistance.value=S.shadow.camera.near,g.farDistance.value=S.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:s}}function sy(n,t,e,i){let s={},r={},o=[],a=n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS);function c(M,T){let b=T.program;i.uniformBlockBinding(M,b)}function l(M,T){let b=s[M.id];b===void 0&&(g(M),b=u(M),s[M.id]=b,M.addEventListener("dispose",S));let C=T.program;i.updateUBOMapping(M,C);let y=t.render.frame;r[M.id]!==y&&(h(M),r[M.id]=y)}function u(M){let T=f();M.__bindingPointIndex=T;let b=n.createBuffer(),C=M.__size,y=M.usage;return n.bindBuffer(n.UNIFORM_BUFFER,b),n.bufferData(n.UNIFORM_BUFFER,C,y),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,T,b),b}function f(){for(let M=0;M<a;M++)if(o.indexOf(M)===-1)return o.push(M),M;return Wt("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function h(M){let T=s[M.id],b=M.uniforms,C=M.__cache;n.bindBuffer(n.UNIFORM_BUFFER,T);for(let y=0,w=b.length;y<w;y++){let P=b[y];if(Array.isArray(P))for(let F=0,B=P.length;F<B;F++)d(P[F],y,F,C);else d(P,y,0,C)}n.bindBuffer(n.UNIFORM_BUFFER,null)}function d(M,T,b,C){if(x(M,T,b,C)===!0){let y=M.__offset,w=M.value;if(Array.isArray(w)){let P=0;for(let F=0;F<w.length;F++){let B=w[F],V=p(B);m(B,M.__data,P),typeof B!="number"&&typeof B!="boolean"&&!B.isMatrix3&&!ArrayBuffer.isView(B)&&(P+=V.storage/Float32Array.BYTES_PER_ELEMENT)}}else m(w,M.__data,0);n.bufferSubData(n.UNIFORM_BUFFER,y,M.__data)}}function m(M,T,b){typeof M=="number"||typeof M=="boolean"?T[0]=M:M.isMatrix3?(T[0]=M.elements[0],T[1]=M.elements[1],T[2]=M.elements[2],T[3]=0,T[4]=M.elements[3],T[5]=M.elements[4],T[6]=M.elements[5],T[7]=0,T[8]=M.elements[6],T[9]=M.elements[7],T[10]=M.elements[8],T[11]=0):ArrayBuffer.isView(M)?T.set(new M.constructor(M.buffer,M.byteOffset,T.length)):M.toArray(T,b)}function x(M,T,b,C){let y=M.value,w=T+"_"+b;if(C[w]===void 0)return typeof y=="number"||typeof y=="boolean"?C[w]=y:ArrayBuffer.isView(y)?C[w]=y.slice():C[w]=y.clone(),!0;{let P=C[w];if(typeof y=="number"||typeof y=="boolean"){if(P!==y)return C[w]=y,!0}else{if(ArrayBuffer.isView(y))return!0;if(P.equals(y)===!1)return P.copy(y),!0}}return!1}function g(M){let T=M.uniforms,b=0,C=16;for(let w=0,P=T.length;w<P;w++){let F=Array.isArray(T[w])?T[w]:[T[w]];for(let B=0,V=F.length;B<V;B++){let I=F[B],k=Array.isArray(I.value)?I.value:[I.value];for(let W=0,J=k.length;W<J;W++){let et=k[W],U=p(et),q=b%C,j=q%U.boundary,xt=q+j;b+=j,xt!==0&&C-xt<U.storage&&(b+=C-xt),I.__data=new Float32Array(U.storage/Float32Array.BYTES_PER_ELEMENT),I.__offset=b,b+=U.storage}}}let y=b%C;return y>0&&(b+=C-y),M.__size=b,M.__cache={},this}function p(M){let T={boundary:0,storage:0};return typeof M=="number"||typeof M=="boolean"?(T.boundary=4,T.storage=4):M.isVector2?(T.boundary=8,T.storage=8):M.isVector3||M.isColor?(T.boundary=16,T.storage=12):M.isVector4?(T.boundary=16,T.storage=16):M.isMatrix3?(T.boundary=48,T.storage=48):M.isMatrix4?(T.boundary=64,T.storage=64):M.isTexture?kt("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(M)?(T.boundary=16,T.storage=M.byteLength):kt("WebGLRenderer: Unsupported uniform value type.",M),T}function S(M){let T=M.target;T.removeEventListener("dispose",S);let b=o.indexOf(T.__bindingPointIndex);o.splice(b,1),n.deleteBuffer(s[T.id]),delete s[T.id],delete r[T.id]}function A(){for(let M in s)n.deleteBuffer(s[M]);o=[],s={},r={}}return{bind:c,update:l,dispose:A}}var ry=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]),ri=null;function oy(){return ri===null&&(ri=new Ta(ry,16,16,$i,Wn),ri.name="DFG_LUT",ri.minFilter=Ge,ri.magFilter=Ge,ri.wrapS=ei,ri.wrapT=ei,ri.generateMipmaps=!1,ri.needsUpdate=!0),ri}var Bl=class{constructor(t={}){let{canvas:e=jd(),context:i=null,depth:s=!0,stencil:r=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:f=!1,reversedDepthBuffer:h=!1,outputBufferType:d=dn}=t;this.isWebGLRenderer=!0;let m;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");m=i.getContextAttributes().alpha}else m=o;let x=d,g=new Set([tl,Qa,ja]),p=new Set([dn,Hn,rr,or,$a,Ka]),S=new Uint32Array(4),A=new Int32Array(4),M=new L,T=null,b=null,C=[],y=[],w=null;this.domElement=e,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Vn,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let P=this,F=!1,B=null,V=null,I=null,k=null;this._outputColorSpace=Qe;let W=0,J=0,et=null,U=-1,q=null,j=new Ae,xt=new Ae,Mt=null,le=new te(0),Vt=0,St=e.width,Y=e.height,K=1,it=null,wt=null,ot=new Ae(0,0,St,Y),ut=new Ae(0,0,St,Y),Ht=!1,Nt=new $s,zt=!1,Ut=!1,Rt=new we,Jt=new L,se=new Ae,_e={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},Yt=!1;function ee(){return et===null?K:1}let R=i;function $t(v,D){return e.getContext(v,D)}let At,E,_,O,z,Z,st,rt,$,Q,at,Lt,dt,ct,Ct,Bt,Ft,N,ht,tt,lt,pt,nt;try{let v={alpha:!0,depth:s,stencil:r,antialias:a,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:u,failIfMajorPerformanceCaveat:f};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${"186"}`),e.addEventListener("webglcontextlost",Pt,!1),e.addEventListener("webglcontextrestored",qt,!1),e.addEventListener("webglcontextcreationerror",En,!1),R===null){let D="webgl2";if(R=$t(D,v),R===null)throw $t(D)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}_t()}catch(v){throw e.removeEventListener("webglcontextlost",Pt,!1),e.removeEventListener("webglcontextrestored",qt,!1),e.removeEventListener("webglcontextcreationerror",En,!1),Wt("WebGLRenderer: "+v.message),v}function _t(){At=new f_(R),At.init(),lt=new Qx(R,At),E=new i_(R,At,t,lt),_=new Kx(R,At),E.reversedDepthBuffer&&h&&_.buffers.depth.setReversed(!0),V=R.createFramebuffer(),I=R.createFramebuffer(),k=R.createFramebuffer(),O=new g_(R),z=new Ox,Z=new jx(R,At,_,z,E,lt,O),st=new d_(P),rt=new xm(R),pt=new e_(R,rt),$=new p_(R,rt,O,pt),Q=new x_(R,$,rt,pt,O),N=new __(R,E,Z),Ct=new s_(z),at=new Fx(P,st,At,E,pt,Ct),Lt=new iy(P,z),dt=new kx,ct=new Xx(At),Ft=new t_(P,st,_,Q,m,c),Bt=new $x(P,Q,E),nt=new sy(R,O,E,_),ht=new n_(R,At,O),tt=new m_(R,At,O),O.programs=at.programs,P.capabilities=E,P.extensions=At,P.properties=z,P.renderLists=dt,P.shadowMap=Bt,P.state=_,P.info=O}x!==dn&&(w=new v_(x,e.width,e.height,a,s,r));let bt=new Hh(P,R);this.xr=bt,this.getContext=function(){return R},this.getContextAttributes=function(){return R.getContextAttributes()},this.forceContextLoss=function(){let v=At.get("WEBGL_lose_context");v&&v.loseContext()},this.forceContextRestore=function(){let v=At.get("WEBGL_lose_context");v&&v.restoreContext()},this.getPixelRatio=function(){return K},this.setPixelRatio=function(v){v!==void 0&&(K=v,this.setSize(St,Y,!1))},this.getSize=function(v){return v.set(St,Y)},this.setSize=function(v,D,X=!0){if(bt.isPresenting){kt("WebGLRenderer: Can't change size while VR device is presenting.");return}St=v,Y=D,e.width=Math.floor(v*K),e.height=Math.floor(D*K),X===!0&&(e.style.width=v+"px",e.style.height=D+"px"),w!==null&&w.setSize(e.width,e.height),this.setViewport(0,0,v,D)},this.getDrawingBufferSize=function(v){return v.set(St*K,Y*K).floor()},this.setDrawingBufferSize=function(v,D,X){St=v,Y=D,K=X,e.width=Math.floor(v*X),e.height=Math.floor(D*X),this.setViewport(0,0,v,D)},this.setEffects=function(v){if(x===dn){Wt("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(v){for(let D=0;D<v.length;D++)if(v[D].isOutputPass===!0){kt("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}w.setEffects(v||[])},this.getCurrentViewport=function(v){return v.copy(j)},this.getViewport=function(v){return v.copy(ot)},this.setViewport=function(v,D,X,H){v.isVector4?ot.set(v.x,v.y,v.z,v.w):ot.set(v,D,X,H),_.viewport(j.copy(ot).multiplyScalar(K).round())},this.getScissor=function(v){return v.copy(ut)},this.setScissor=function(v,D,X,H){v.isVector4?ut.set(v.x,v.y,v.z,v.w):ut.set(v,D,X,H),_.scissor(xt.copy(ut).multiplyScalar(K).round())},this.getScissorTest=function(){return Ht},this.setScissorTest=function(v){_.setScissorTest(Ht=v)},this.setOpaqueSort=function(v){it=v},this.setTransparentSort=function(v){wt=v},this.getClearColor=function(v){return v.copy(Ft.getClearColor())},this.setClearColor=function(){Ft.setClearColor(...arguments)},this.getClearAlpha=function(){return Ft.getClearAlpha()},this.setClearAlpha=function(){Ft.setClearAlpha(...arguments)},this.clear=function(v=!0,D=!0,X=!0){let H=0;if(v){let G=!1;if(et!==null){let gt=et.texture.format;G=g.has(gt)}if(G){let gt=et.texture.type,vt=p.has(gt),mt=Ft.getClearColor(),Tt=Ft.getClearAlpha(),Dt=mt.r,ne=mt.g,ce=mt.b;vt?(S[0]=Dt,S[1]=ne,S[2]=ce,S[3]=Tt,R.clearBufferuiv(R.COLOR,0,S)):(A[0]=Dt,A[1]=ne,A[2]=ce,A[3]=Tt,R.clearBufferiv(R.COLOR,0,A))}else H|=R.COLOR_BUFFER_BIT}D&&(H|=R.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),X&&(H|=R.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),H!==0&&R.clear(H)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(v){v.setRenderer(this),B=v},this.dispose=function(){e.removeEventListener("webglcontextlost",Pt,!1),e.removeEventListener("webglcontextrestored",qt,!1),e.removeEventListener("webglcontextcreationerror",En,!1),Ft.dispose(),dt.dispose(),ct.dispose(),z.dispose(),st.dispose(),Q.dispose(),pt.dispose(),nt.dispose(),at.dispose(),bt.dispose(),bt.removeEventListener("sessionstart",$h),bt.removeEventListener("sessionend",Kh),Ki.stop()};function Pt(v){v.preventDefault(),gh("WebGLRenderer: Context Lost."),F=!0}function qt(){gh("WebGLRenderer: Context Restored."),F=!1;let v=O.autoReset,D=Bt.enabled,X=Bt.autoUpdate,H=Bt.needsUpdate,G=Bt.type;_t(),O.autoReset=v,Bt.enabled=D,Bt.autoUpdate=X,Bt.needsUpdate=H,Bt.type=G}function En(v){Wt("WebGLRenderer: A WebGL context could not be created. Reason: ",v.statusMessage)}function mn(v){let D=v.target;D.removeEventListener("dispose",mn),Qf(D)}function Qf(v){tp(v),z.remove(v)}function tp(v){let D=z.get(v).programs;D!==void 0&&(D.forEach(function(X){at.releaseProgram(X)}),v.isShaderMaterial&&at.releaseShaderCache(v))}this.renderBufferDirect=function(v,D,X,H,G,gt){D===null&&(D=_e);let vt=G.isMesh&&G.matrixWorld.determinantAffine()<0,mt=ip(v,D,X,H,G);_.setMaterial(H,vt);let Tt=X.index,Dt=1;if(H.wireframe===!0){if(Tt=$.getWireframeAttribute(X),Tt===void 0)return;Dt=2}let ne=X.drawRange,ce=X.attributes.position,Et=ne.start*Dt,pe=(ne.start+ne.count)*Dt;gt!==null&&(Et=Math.max(Et,gt.start*Dt),pe=Math.min(pe,(gt.start+gt.count)*Dt)),Tt!==null?(Et=Math.max(Et,0),pe=Math.min(pe,Tt.count)):ce!=null&&(Et=Math.max(Et,0),pe=Math.min(pe,ce.count));let Ie=pe-Et;if(Ie<0||Ie===1/0)return;pt.setup(G,H,mt,X,Tt);let Te,ve=ht;if(Tt!==null&&(Te=rt.get(Tt),ve=tt,ve.setIndex(Te)),G.isMesh)H.wireframe===!0?(_.setLineWidth(H.wireframeLinewidth*ee()),ve.setMode(R.LINES)):ve.setMode(R.TRIANGLES);else if(G.isLine){let We=H.linewidth;We===void 0&&(We=1),_.setLineWidth(We*ee()),G.isLineSegments?ve.setMode(R.LINES):G.isLineLoop?ve.setMode(R.LINE_LOOP):ve.setMode(R.LINE_STRIP)}else G.isPoints?ve.setMode(R.POINTS):G.isSprite&&ve.setMode(R.TRIANGLES);if(G.isBatchedMesh)if(At.get("WEBGL_multi_draw"))ve.renderMultiDraw(G._multiDrawStarts,G._multiDrawCounts,G._multiDrawCount);else{let We=G._multiDrawStarts,yt=G._multiDrawCounts,Je=G._multiDrawCount,ue=Tt?rt.get(Tt).bytesPerElement:1,wn=z.get(H).currentProgram.getUniforms();for(let Yn=0;Yn<Je;Yn++)wn.setValue(R,"_gl_DrawID",Yn),ve.render(We[Yn]/ue,yt[Yn])}else if(G.isInstancedMesh)ve.renderInstances(Et,Ie,G.count);else if(X.isInstancedBufferGeometry){let We=X._maxInstanceCount!==void 0?X._maxInstanceCount:1/0,yt=Math.min(X.instanceCount,We);ve.renderInstances(Et,Ie,yt)}else ve.render(Et,Ie)};function Jh(v,D,X,H){B!==null&&v.isNodeMaterial&&B.setObject(H,v),zt===!0&&Ct.setState(v,X,!1),v.transparent===!0&&v.side===Ln&&v.forceSinglePass===!1?(v.side=sn,v.needsUpdate=!0,po(v,D,H),v.side=qi,v.needsUpdate=!0,po(v,D,H),v.side=Ln):po(v,D,H)}this.compile=function(v,D,X=null){X===null&&(X=v),B!==null&&B.renderStart(v,D,X),b=ct.get(X),b.init(D),y.push(b),X.traverseVisible(function(G){G.isLight&&G.layers.test(D.layers)&&(b.pushLight(G),G.castShadow&&b.pushShadow(G))}),v!==X&&v.traverseVisible(function(G){G.isLight&&G.layers.test(D.layers)&&(b.pushLight(G),G.castShadow&&b.pushShadow(G))}),b.setupLights(),B!==null&&B.updateLights(b.state.lightsArray),Ut=this.localClippingEnabled,zt=Ct.init(this.clippingPlanes,Ut),zt===!0&&Ct.setGlobalState(this.clippingPlanes,D),B!==null&&Bt.render(b.state.shadowsArray,X,D);let H=new Set;return v.traverse(function(G){if(!(G.isMesh||G.isPoints||G.isLine||G.isSprite))return;let gt=G.material;if(gt)if(Array.isArray(gt))for(let vt=0;vt<gt.length;vt++){let mt=gt[vt];Jh(mt,X,D,G),H.add(mt)}else Jh(gt,X,D,G),H.add(gt)}),b=y.pop(),B!==null&&B.renderEnd(),H},this.compileAsync=function(v,D,X=null){let H=this.compile(v,D,X);return new Promise(G=>{function gt(){if(H.forEach(function(vt){let Tt=z.get(vt).currentProgram;(Tt===void 0||Tt.isReady())&&H.delete(vt)}),H.size===0){G(v);return}setTimeout(gt,10)}At.get("KHR_parallel_shader_compile")!==null?gt():setTimeout(gt,10)})};let ql=null;function ep(v){ql&&ql(v)}function $h(){Ki.stop()}function Kh(){Ki.start()}let Ki=new Cf;Ki.setAnimationLoop(ep),typeof self<"u"&&Ki.setContext(self),this.setAnimationLoop=function(v){ql=v,bt.setAnimationLoop(v),v===null?Ki.stop():Ki.start()},bt.addEventListener("sessionstart",$h),bt.addEventListener("sessionend",Kh),this.render=function(v,D){if(D!==void 0&&D.isCamera!==!0){Wt("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(F===!0)return;B!==null&&B.renderStart(v,D);let X=bt.enabled===!0&&bt.isPresenting===!0,H=w!==null&&(et===null||X)&&w.begin(P,et);if(v.matrixWorldAutoUpdate===!0&&v.updateMatrixWorld(),D.parent===null&&D.matrixWorldAutoUpdate===!0&&D.updateMatrixWorld(),bt.enabled===!0&&bt.isPresenting===!0&&(w===null||w.isCompositing()===!1)&&(bt.cameraAutoUpdate===!0&&bt.updateCamera(D),D=bt.getCamera()),v.isScene===!0&&v.onBeforeRender(P,v,D,et),b=ct.get(v,y.length),b.init(D),b.state.textureUnits=Z.getTextureUnits(),y.push(b),Rt.multiplyMatrices(D.projectionMatrix,D.matrixWorldInverse),Nt.setFromProjectionMatrix(Rt,kn,D.reversedDepth),Ut=this.localClippingEnabled,zt=Ct.init(this.clippingPlanes,Ut),T=dt.get(v,C.length),T.init(),C.push(T),bt.enabled===!0&&bt.isPresenting===!0){let vt=P.xr.getDepthSensingMesh();vt!==null&&Yl(vt,D,-1/0,P.sortObjects)}Yl(v,D,0,P.sortObjects),T.finish(),B!==null&&B.updateLights(b.state.lightsArray),P.sortObjects===!0&&T.sort(it,wt),Yt=bt.enabled===!1||bt.isPresenting===!1||bt.hasDepthSensing()===!1,Yt&&Ft.addToRenderList(T,v),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),zt===!0&&Ct.beginShadows();let G=b.state.shadowsArray;if(Bt.render(G,v,D),zt===!0&&Ct.endShadows(),(H&&w.hasRenderPass())===!1){let vt=T.opaque,mt=T.transmissive;if(b.setupLights(),D.isArrayCamera){let Tt=D.cameras;if(mt.length>0)for(let Dt=0,ne=Tt.length;Dt<ne;Dt++){let ce=Tt[Dt];Qh(vt,mt,v,ce)}Yt&&Ft.render(v);for(let Dt=0,ne=Tt.length;Dt<ne;Dt++){let ce=Tt[Dt];jh(T,v,ce,ce.viewport)}}else mt.length>0&&Qh(vt,mt,v,D),Yt&&Ft.render(v),jh(T,v,D)}et!==null&&J===0&&(Z.updateMultisampleRenderTarget(et),Z.updateRenderTargetMipmap(et)),H&&w.end(P),v.isScene===!0&&v.onAfterRender(P,v,D),pt.resetDefaultState(),U=-1,q=null,y.pop(),y.length>0?(b=y[y.length-1],Z.setTextureUnits(b.state.textureUnits),zt===!0&&Ct.setGlobalState(P.clippingPlanes,b.state.camera)):b=null,C.pop(),C.length>0?T=C[C.length-1]:T=null,B!==null&&B.renderEnd()};function Yl(v,D,X,H){if(v.visible===!1)return;if(v.layers.test(D.layers)){if(v.isGroup)X=v.renderOrder;else if(v.isLOD)v.autoUpdate===!0&&v.update(D);else if(v.isLightProbeGrid)b.pushLightProbeGrid(v);else if(v.isLight)b.pushLight(v),v.castShadow&&b.pushShadow(v);else if(v.isSprite){if(!v.frustumCulled||v.intersectsFrustum(Nt)){H&&se.setFromMatrixPosition(v.matrixWorld).applyMatrix4(Rt);let vt=Q.update(v),mt=v.material;mt.visible&&T.push(v,vt,mt,X,se.z,null,D)}}else if((v.isMesh||v.isLine||v.isPoints)&&(!v.frustumCulled||v.intersectsFrustum(Nt))){let vt=Q.update(v),mt=v.material;if(H&&(v.boundingSphere!==void 0?(v.boundingSphere===null&&v.computeBoundingSphere(),se.copy(v.boundingSphere.center)):(vt.boundingSphere===null&&vt.computeBoundingSphere(),se.copy(vt.boundingSphere.center)),se.applyMatrix4(v.matrixWorld).applyMatrix4(Rt)),Array.isArray(mt)){let Tt=vt.groups;for(let Dt=0,ne=Tt.length;Dt<ne;Dt++){let ce=Tt[Dt],Et=mt[ce.materialIndex];Et&&Et.visible&&T.push(v,vt,Et,X,se.z,ce,D)}}else mt.visible&&T.push(v,vt,mt,X,se.z,null,D)}}let gt=v.children;for(let vt=0,mt=gt.length;vt<mt;vt++)Yl(gt[vt],D,X,H)}function jh(v,D,X,H){let{opaque:G,transmissive:gt,transparent:vt}=v;b.setupLightsView(X),zt===!0&&Ct.setGlobalState(P.clippingPlanes,X),H&&_.viewport(j.copy(H)),G.length>0&&fo(G,D,X),gt.length>0&&fo(gt,D,X),vt.length>0&&fo(vt,D,X),_.buffers.depth.setTest(!0),_.buffers.depth.setMask(!0),_.buffers.color.setMask(!0),_.setPolygonOffset(!1)}function Qh(v,D,X,H){if((X.isScene===!0?X.overrideMaterial:null)!==null)return;if(b.state.transmissionRenderTarget[H.id]===void 0){let Et=At.has("EXT_color_buffer_half_float")||At.has("EXT_color_buffer_float");b.state.transmissionRenderTarget[H.id]=new hn(1,1,{generateMipmaps:!0,type:Et?Wn:dn,minFilter:Zi,samples:Math.max(4,E.samples),stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:he.workingColorSpace})}let gt=b.state.transmissionRenderTarget[H.id],vt=H.viewport||j;gt.setSize(vt.z*P.transmissionResolutionScale,vt.w*P.transmissionResolutionScale);let mt=P.getRenderTarget(),Tt=P.getActiveCubeFace(),Dt=P.getActiveMipmapLevel();P.setRenderTarget(gt),P.getClearColor(le),Vt=P.getClearAlpha(),Vt<1&&P.setClearColor(16777215,.5),P.clear(),Yt&&Ft.render(X);let ne=P.toneMapping;P.toneMapping=Vn;let ce=H.viewport;if(H.viewport!==void 0&&(H.viewport=void 0),b.setupLightsView(H),zt===!0&&Ct.setGlobalState(P.clippingPlanes,H),fo(v,X,H),Z.updateMultisampleRenderTarget(gt),Z.updateRenderTargetMipmap(gt),At.has("WEBGL_multisampled_render_to_texture")===!1){let Et=!1;for(let pe=0,Ie=D.length;pe<Ie;pe++){let Te=D[pe],{object:ve,geometry:We,material:yt,group:Je}=Te;if(yt.side===Ln&&ve.layers.test(H.layers)){let ue=yt.side;yt.side=sn,yt.needsUpdate=!0,tu(ve,X,H,We,yt,Je),yt.side=ue,yt.needsUpdate=!0,Et=!0}}Et===!0&&(Z.updateMultisampleRenderTarget(gt),Z.updateRenderTargetMipmap(gt))}P.setRenderTarget(mt,Tt,Dt),P.setClearColor(le,Vt),ce!==void 0&&(H.viewport=ce),P.toneMapping=ne}function fo(v,D,X){let H=D.isScene===!0?D.overrideMaterial:null;for(let G=0,gt=v.length;G<gt;G++){let vt=v[G],{object:mt,geometry:Tt,group:Dt}=vt,ne=vt.material;ne.allowOverride===!0&&H!==null&&(ne=H),mt.layers.test(X.layers)&&tu(mt,D,X,Tt,ne,Dt)}}function tu(v,D,X,H,G,gt){B!==null&&G.isNodeMaterial&&B.setObject(v,G),v.onBeforeRender(P,D,X,H,G,gt),v.modelViewMatrix.multiplyMatrices(X.matrixWorldInverse,v.matrixWorld),v.normalMatrix.getNormalMatrix(v.modelViewMatrix),G.onBeforeRender(P,D,X,H,v,gt),G.transparent===!0&&G.side===Ln&&G.forceSinglePass===!1?(G.side=sn,G.needsUpdate=!0,P.renderBufferDirect(X,D,H,G,v,gt),G.side=qi,G.needsUpdate=!0,P.renderBufferDirect(X,D,H,G,v,gt),G.side=Ln):P.renderBufferDirect(X,D,H,G,v,gt),v.onAfterRender(P,D,X,H,G,gt)}function po(v,D,X){D.isScene!==!0&&(D=_e);let H=z.get(v),G=b.state.lights,gt=b.state.shadowsArray,vt=G.state.version,mt=at.getParameters(v,G.state,gt,D,X,b.state.lightProbeGridArray),Tt=at.getProgramCacheKey(mt),Dt=H.programs;H.environment=v.isMeshStandardMaterial||v.isMeshLambertMaterial||v.isMeshPhongMaterial?D.environment:null,H.fog=D.fog;let ne=v.isMeshStandardMaterial||v.isMeshLambertMaterial&&!v.envMap||v.isMeshPhongMaterial&&!v.envMap;H.envMap=st.get(v.envMap||H.environment,ne),H.envMapRotation=H.environment!==null&&v.envMap===null?D.environmentRotation:v.envMapRotation,Dt===void 0&&(v.addEventListener("dispose",mn),Dt=new Map,H.programs=Dt);let ce=Dt.get(Tt);if(ce!==void 0){if(H.currentProgram===ce&&H.lightsStateVersion===vt)return nu(v,mt),ce}else mt.uniforms=at.getUniforms(v),B!==null&&v.isNodeMaterial&&B.build(v,X,mt),v.onBeforeCompile(mt,P),ce=at.acquireProgram(mt,Tt),Dt.set(Tt,ce),H.uniforms=mt.uniforms;let Et=H.uniforms;return(!v.isShaderMaterial&&!v.isRawShaderMaterial||v.clipping===!0)&&(Et.clippingPlanes=Ct.uniform),nu(v,mt),H.needsLights=rp(v),H.lightsStateVersion=vt,H.needsLights&&(Et.ambientLightColor.value=G.state.ambient,Et.lightProbe.value=G.state.probe,Et.sunLights.value=G.state.sun,Et.sunLightShadows.value=G.state.sunShadow,Et.directionalLights.value=G.state.directional,Et.directionalLightShadows.value=G.state.directionalShadow,Et.spotLights.value=G.state.spot,Et.spotLightShadows.value=G.state.spotShadow,Et.rectAreaLights.value=G.state.rectArea,Et.ltc_1.value=G.state.rectAreaLTC1,Et.ltc_2.value=G.state.rectAreaLTC2,Et.pointLights.value=G.state.point,Et.pointLightShadows.value=G.state.pointShadow,Et.hemisphereLights.value=G.state.hemi,Et.sunShadowMatrix.value=G.state.sunShadowMatrix,Et.sunShadowCascade.value=G.state.sunShadowCascade,Et.directionalShadowMatrix.value=G.state.directionalShadowMatrix,Et.spotLightMatrix.value=G.state.spotLightMatrix,Et.spotLightMap.value=G.state.spotLightMap,Et.pointShadowMatrix.value=G.state.pointShadowMatrix),H.lightProbeGrid=b.state.lightProbeGridArray.length>0,H.currentProgram=ce,H.uniformsList=null,ce}function eu(v){if(v.uniformsList===null){let D=v.currentProgram.getUniforms();v.uniformsList=hr.seqWithValue(D.seq,v.uniforms)}return v.uniformsList}function nu(v,D){let X=z.get(v);X.outputColorSpace=D.outputColorSpace,X.batching=D.batching,X.batchingColor=D.batchingColor,X.instancing=D.instancing,X.instancingColor=D.instancingColor,X.instancingMorph=D.instancingMorph,X.skinning=D.skinning,X.morphTargets=D.morphTargets,X.morphNormals=D.morphNormals,X.morphColors=D.morphColors,X.morphTargetsCount=D.morphTargetsCount,X.numClippingPlanes=D.numClippingPlanes,X.numIntersection=D.numClipIntersection,X.vertexAlphas=D.vertexAlphas,X.vertexTangents=D.vertexTangents,X.toneMapping=D.toneMapping}function np(v,D){if(v.length===0)return null;if(v.length===1)return v[0].texture!==null?v[0]:null;M.setFromMatrixPosition(D.matrixWorld);for(let X=0,H=v.length;X<H;X++){let G=v[X];if(G.texture!==null&&G.boundingBox.containsPoint(M))return G}return null}function ip(v,D,X,H,G){D.isScene!==!0&&(D=_e),Z.resetTextureUnits();let gt=D.fog,vt=H.isMeshStandardMaterial||H.isMeshLambertMaterial||H.isMeshPhongMaterial?D.environment:null,mt=et===null?P.outputColorSpace:et.isXRRenderTarget===!0?et.texture.colorSpace:he.workingColorSpace,Tt=H.isMeshStandardMaterial||H.isMeshLambertMaterial&&!H.envMap||H.isMeshPhongMaterial&&!H.envMap,Dt=st.get(H.envMap||vt,Tt),ne=H.vertexColors===!0&&!!X.attributes.color&&X.attributes.color.itemSize===4,ce=!!X.attributes.tangent&&(!!H.normalMap||H.anisotropy>0),Et=!!X.morphAttributes.position,pe=!!X.morphAttributes.normal,Ie=!!X.morphAttributes.color,Te=Vn;H.toneMapped&&(et===null||et.isXRRenderTarget===!0)&&(Te=P.toneMapping);let ve=X.morphAttributes.position||X.morphAttributes.normal||X.morphAttributes.color,We=ve!==void 0?ve.length:0,yt=z.get(H),Je=b.state.lights;if(zt===!0&&(Ut===!0||v!==q)){let Se=v===q&&H.id===U;Ct.setState(H,v,Se)}let ue=!1;H.version===yt.__version?(yt.needsLights&&yt.lightsStateVersion!==Je.state.version||yt.outputColorSpace!==mt||G.isBatchedMesh&&yt.batching===!1||!G.isBatchedMesh&&yt.batching===!0||G.isBatchedMesh&&yt.batchingColor===!0&&G._colorsTexture===null||G.isBatchedMesh&&yt.batchingColor===!1&&G._colorsTexture!==null||G.isInstancedMesh&&yt.instancing===!1||!G.isInstancedMesh&&yt.instancing===!0||G.isSkinnedMesh&&yt.skinning===!1||!G.isSkinnedMesh&&yt.skinning===!0||G.isInstancedMesh&&yt.instancingColor===!0&&G.instanceColor===null||G.isInstancedMesh&&yt.instancingColor===!1&&G.instanceColor!==null||G.isInstancedMesh&&yt.instancingMorph===!0&&G.morphTexture===null||G.isInstancedMesh&&yt.instancingMorph===!1&&G.morphTexture!==null||yt.envMap!==Dt||H.fog===!0&&yt.fog!==gt||yt.numClippingPlanes!==void 0&&(yt.numClippingPlanes!==Ct.numPlanes||yt.numIntersection!==Ct.numIntersection)||yt.vertexAlphas!==ne||yt.vertexTangents!==ce||yt.morphTargets!==Et||yt.morphNormals!==pe||yt.morphColors!==Ie||yt.toneMapping!==Te||yt.morphTargetsCount!==We||!!yt.lightProbeGrid!=b.state.lightProbeGridArray.length>0)&&(ue=!0):(ue=!0,yt.__version=H.version);let wn=yt.currentProgram;ue===!0&&(wn=po(H,D,G),B&&H.isNodeMaterial&&B.onUpdateProgram(H,wn,yt));let Yn=!1,Ei=!1,_s=!1,ye=wn.getUniforms(),Pe=yt.uniforms;if(_.useProgram(wn.program)&&(Yn=!0,Ei=!0,_s=!0),H.id!==U&&(U=H.id,Ei=!0),yt.needsLights){let Se=np(b.state.lightProbeGridArray,G);yt.lightProbeGrid!==Se&&(yt.lightProbeGrid=Se,Ei=!0)}if(Yn||q!==v){_.buffers.depth.getReversed()&&v.reversedDepth!==!0&&(v._reversedDepth=!0,v.updateProjectionMatrix()),ye.setValue(R,"projectionMatrix",v.projectionMatrix),ye.setValue(R,"viewMatrix",v.matrixWorldInverse);let Ai=ye.map.cameraPosition;Ai!==void 0&&Ai.setValue(R,Jt.setFromMatrixPosition(v.matrixWorld)),E.logarithmicDepthBuffer&&ye.setValue(R,"logDepthBufFC",2/(Math.log(v.far+1)/Math.LN2)),(H.isMeshPhongMaterial||H.isMeshToonMaterial||H.isMeshLambertMaterial||H.isMeshBasicMaterial||H.isMeshStandardMaterial||H.isShaderMaterial)&&ye.setValue(R,"isOrthographic",v.isOrthographicCamera===!0),q!==v&&(q=v,Ei=!0,_s=!0)}if(yt.needsLights&&(Je.state.sunShadowMap.length>0&&ye.setValue(R,"sunShadowMap",Je.state.sunShadowMap,Z),Je.state.directionalShadowMap.length>0&&ye.setValue(R,"directionalShadowMap",Je.state.directionalShadowMap,Z),Je.state.spotShadowMap.length>0&&ye.setValue(R,"spotShadowMap",Je.state.spotShadowMap,Z),Je.state.pointShadowMap.length>0&&ye.setValue(R,"pointShadowMap",Je.state.pointShadowMap,Z)),G.isSkinnedMesh){ye.setOptional(R,G,"bindMatrix"),ye.setOptional(R,G,"bindMatrixInverse");let Se=G.skeleton;Se&&(Se.boneTexture===null&&Se.computeBoneTexture(),ye.setValue(R,"boneTexture",Se.boneTexture,Z))}G.isBatchedMesh&&(ye.setOptional(R,G,"batchingTexture"),ye.setValue(R,"batchingTexture",G._matricesTexture,Z),ye.setOptional(R,G,"batchingIdTexture"),ye.setValue(R,"batchingIdTexture",G._indirectTexture,Z),ye.setOptional(R,G,"batchingColorTexture"),G._colorsTexture!==null&&ye.setValue(R,"batchingColorTexture",G._colorsTexture,Z));let wi=X.morphAttributes;if((wi.position!==void 0||wi.normal!==void 0||wi.color!==void 0)&&N.update(G,X,wn),(Ei||yt.receiveShadow!==G.receiveShadow)&&(yt.receiveShadow=G.receiveShadow,ye.setValue(R,"receiveShadow",G.receiveShadow)),(H.isMeshStandardMaterial||H.isMeshLambertMaterial||H.isMeshPhongMaterial)&&H.envMap===null&&D.environment!==null&&(Pe.envMapIntensity.value=D.environmentIntensity),Pe.dfgLUT!==void 0&&(Pe.dfgLUT.value=oy()),Ei){if(ye.setValue(R,"toneMappingExposure",P.toneMappingExposure),yt.needsLights&&sp(Pe,_s),gt&&H.fog===!0&&Lt.refreshFogUniforms(Pe,gt),Lt.refreshMaterialUniforms(Pe,H,K,Y,b.state.transmissionRenderTarget[v.id]),yt.needsLights&&yt.lightProbeGrid){let Se=yt.lightProbeGrid;Pe.probesSH.value=Se.texture,Pe.probesMin.value.copy(Se.boundingBox.min),Pe.probesMax.value.copy(Se.boundingBox.max),Pe.probesResolution.value.copy(Se.resolution)}hr.upload(R,eu(yt),Pe,Z)}if(H.isShaderMaterial&&H.uniformsNeedUpdate===!0&&(hr.upload(R,eu(yt),Pe,Z),H.uniformsNeedUpdate=!1),H.isSpriteMaterial&&ye.setValue(R,"center",G.center),ye.setValue(R,"modelViewMatrix",G.modelViewMatrix),ye.setValue(R,"normalMatrix",G.normalMatrix),ye.setValue(R,"modelMatrix",G.matrixWorld),H.uniformsGroups!==void 0){let Se=H.uniformsGroups;for(let Ai=0,xs=Se.length;Ai<xs;Ai++){let su=Se[Ai];nt.update(su,wn),nt.bind(su,wn)}}return wn}function sp(v,D){v.ambientLightColor.needsUpdate=D,v.lightProbe.needsUpdate=D,v.sunLights.needsUpdate=D,v.sunLightShadows.needsUpdate=D,v.directionalLights.needsUpdate=D,v.directionalLightShadows.needsUpdate=D,v.pointLights.needsUpdate=D,v.pointLightShadows.needsUpdate=D,v.spotLights.needsUpdate=D,v.spotLightShadows.needsUpdate=D,v.rectAreaLights.needsUpdate=D,v.hemisphereLights.needsUpdate=D}function rp(v){return v.isMeshLambertMaterial||v.isMeshToonMaterial||v.isMeshPhongMaterial||v.isMeshStandardMaterial||v.isShadowMaterial||v.isShaderMaterial&&v.lights===!0}this.getActiveCubeFace=function(){return W},this.getActiveMipmapLevel=function(){return J},this.getRenderTarget=function(){return et},this.setRenderTargetTextures=function(v,D,X){let H=z.get(v);H.__autoAllocateDepthBuffer=v.resolveDepthBuffer===!1,H.__autoAllocateDepthBuffer===!1&&(H.__useRenderToTexture=!1),z.get(v.texture).__webglTexture=D,z.get(v.depthTexture).__webglTexture=H.__autoAllocateDepthBuffer?void 0:X,H.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(v,D){let X=z.get(v);X.__webglFramebuffer=D,X.__useDefaultFramebuffer=D===void 0},this.setRenderTarget=function(v,D=0,X=0){et=v,W=D,J=X;let H=null,G=!1,gt=!1;if(v){let mt=z.get(v);if(mt.__useDefaultFramebuffer!==void 0){_.bindFramebuffer(R.FRAMEBUFFER,mt.__webglFramebuffer),j.copy(v.viewport),xt.copy(v.scissor),Mt=v.scissorTest,_.viewport(j),_.scissor(xt),_.setScissorTest(Mt),U=-1;return}else if(mt.__webglFramebuffer===void 0)Z.setupRenderTarget(v);else if(mt.__hasExternalTextures)Z.rebindTextures(v,z.get(v.texture).__webglTexture,z.get(v.depthTexture).__webglTexture);else if(v.depthBuffer){let ne=v.depthTexture;if(mt.__boundDepthTexture!==ne){if(ne!==null&&z.has(ne)&&(v.width!==ne.image.width||v.height!==ne.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");Z.setupDepthRenderbuffer(v)}}let Tt=v.texture;(Tt.isData3DTexture||Tt.isDataArrayTexture||Tt.isCompressedArrayTexture)&&(gt=!0);let Dt=z.get(v).__webglFramebuffer;v.isWebGLCubeRenderTarget?(Array.isArray(Dt[D])?H=Dt[D][X]:H=Dt[D],G=!0):v.samples>0&&Z.useMultisampledRTT(v)===!1?H=z.get(v).__webglMultisampledFramebuffer:Array.isArray(Dt)?H=Dt[X]:H=Dt,j.copy(v.viewport),xt.copy(v.scissor),Mt=v.scissorTest}else j.copy(ot).multiplyScalar(K).floor(),xt.copy(ut).multiplyScalar(K).floor(),Mt=Ht;if(X!==0&&(H=V),_.bindFramebuffer(R.FRAMEBUFFER,H)&&_.drawBuffers(v,H),_.viewport(j),_.scissor(xt),_.setScissorTest(Mt),G){let mt=z.get(v.texture);R.framebufferTexture2D(R.FRAMEBUFFER,R.COLOR_ATTACHMENT0,R.TEXTURE_CUBE_MAP_POSITIVE_X+D,mt.__webglTexture,X)}else if(gt){let mt=D;for(let Tt=0;Tt<v.textures.length;Tt++){let Dt=z.get(v.textures[Tt]);R.framebufferTextureLayer(R.FRAMEBUFFER,R.COLOR_ATTACHMENT0+Tt,Dt.__webglTexture,X,mt)}}else if(v!==null&&X!==0){let mt=z.get(v.texture);R.framebufferTexture2D(R.FRAMEBUFFER,R.COLOR_ATTACHMENT0,R.TEXTURE_2D,mt.__webglTexture,X)}U=-1};function iu(v){let D=z.get(v);return(D.__readFormat!==v.format||D.__readType!==v.type)&&(D.__readFormat=v.format,D.__readType=v.type,D.__formatReadable=E.textureFormatReadable(v.format),D.__typeReadable=E.textureTypeReadable(v.type)),D}this.readRenderTargetPixels=function(v,D,X,H,G,gt,vt,mt=0){if(!(v&&v.isWebGLRenderTarget)){Wt("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Tt=z.get(v).__webglFramebuffer;if(v.isWebGLCubeRenderTarget&&vt!==void 0&&(Tt=Tt[vt]),Tt){_.bindFramebuffer(R.FRAMEBUFFER,Tt);try{let Dt=v.textures[mt],ne=Dt.format,ce=Dt.type;v.textures.length>1&&R.readBuffer(R.COLOR_ATTACHMENT0+mt);let Et=iu(Dt);if(Et.__formatReadable===!1){Wt("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(Et.__typeReadable===!1){Wt("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}D>=0&&D<=v.width-H&&X>=0&&X<=v.height-G&&R.readPixels(D,X,H,G,lt.convert(ne),lt.convert(ce),gt)}finally{let Dt=et!==null?z.get(et).__webglFramebuffer:null;_.bindFramebuffer(R.FRAMEBUFFER,Dt)}}},this.readRenderTargetPixelsAsync=async function(v,D,X,H,G,gt,vt,mt=0){if(!(v&&v.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Tt=z.get(v).__webglFramebuffer;if(v.isWebGLCubeRenderTarget&&vt!==void 0&&(Tt=Tt[vt]),Tt)if(D>=0&&D<=v.width-H&&X>=0&&X<=v.height-G){_.bindFramebuffer(R.FRAMEBUFFER,Tt);let Dt=v.textures[mt],ne=Dt.format,ce=Dt.type;v.textures.length>1&&R.readBuffer(R.COLOR_ATTACHMENT0+mt);let Et=iu(Dt);if(Et.__formatReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(Et.__typeReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");let pe=R.createBuffer();R.bindBuffer(R.PIXEL_PACK_BUFFER,pe),R.bufferData(R.PIXEL_PACK_BUFFER,gt.byteLength,R.STREAM_READ),R.readPixels(D,X,H,G,lt.convert(ne),lt.convert(ce),0),R.bindBuffer(R.PIXEL_PACK_BUFFER,null);let Ie=et!==null?z.get(et).__webglFramebuffer:null;_.bindFramebuffer(R.FRAMEBUFFER,Ie);let Te=R.fenceSync(R.SYNC_GPU_COMMANDS_COMPLETE,0);return R.flush(),await tf(R,Te,4),R.bindBuffer(R.PIXEL_PACK_BUFFER,pe),R.getBufferSubData(R.PIXEL_PACK_BUFFER,0,gt),R.bindBuffer(R.PIXEL_PACK_BUFFER,null),R.deleteBuffer(pe),R.deleteSync(Te),gt}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(v,D=null,X=0){let H=Math.pow(2,-X),G=Math.floor(v.image.width*H),gt=Math.floor(v.image.height*H),vt=D!==null?D.x:0,mt=D!==null?D.y:0;Z.setTexture2D(v,0),R.copyTexSubImage2D(R.TEXTURE_2D,X,0,0,vt,mt,G,gt),_.unbindTexture()},this.copyTextureToTexture=function(v,D,X=null,H=null,G=0,gt=0){let vt,mt,Tt,Dt,ne,ce,Et,pe,Ie,Te=v.isCompressedTexture?v.mipmaps[gt]:v.image;if(X!==null)vt=X.max.x-X.min.x,mt=X.max.y-X.min.y,Tt=X.isBox3?X.max.z-X.min.z:1,Dt=X.min.x,ne=X.min.y,ce=X.isBox3?X.min.z:0;else{let Pe=Math.pow(2,-G);vt=Math.floor(Te.width*Pe),mt=Math.floor(Te.height*Pe),v.isDataArrayTexture?Tt=Te.depth:v.isData3DTexture?Tt=Math.floor(Te.depth*Pe):Tt=1,Dt=0,ne=0,ce=0}H!==null?(Et=H.x,pe=H.y,Ie=H.z):(Et=0,pe=0,Ie=0);let ve=lt.convert(D.format),We=lt.convert(D.type),yt;D.isData3DTexture?(Z.setTexture3D(D,0),yt=R.TEXTURE_3D):D.isDataArrayTexture||D.isCompressedArrayTexture?(Z.setTexture2DArray(D,0),yt=R.TEXTURE_2D_ARRAY):(Z.setTexture2D(D,0),yt=R.TEXTURE_2D),_.activeTexture(R.TEXTURE0),_.pixelStorei(R.UNPACK_FLIP_Y_WEBGL,D.flipY),_.pixelStorei(R.UNPACK_PREMULTIPLY_ALPHA_WEBGL,D.premultiplyAlpha),_.pixelStorei(R.UNPACK_ALIGNMENT,D.unpackAlignment);let Je=_.getParameter(R.UNPACK_ROW_LENGTH),ue=_.getParameter(R.UNPACK_IMAGE_HEIGHT),wn=_.getParameter(R.UNPACK_SKIP_PIXELS),Yn=_.getParameter(R.UNPACK_SKIP_ROWS),Ei=_.getParameter(R.UNPACK_SKIP_IMAGES);_.pixelStorei(R.UNPACK_ROW_LENGTH,Te.width),_.pixelStorei(R.UNPACK_IMAGE_HEIGHT,Te.height),_.pixelStorei(R.UNPACK_SKIP_PIXELS,Dt),_.pixelStorei(R.UNPACK_SKIP_ROWS,ne),_.pixelStorei(R.UNPACK_SKIP_IMAGES,ce);let _s=v.isDataArrayTexture||v.isData3DTexture,ye=D.isDataArrayTexture||D.isData3DTexture;if(v.isDepthTexture){let Pe=z.get(v),wi=z.get(D),Se=z.get(Pe.__renderTarget),Ai=z.get(wi.__renderTarget);_.bindFramebuffer(R.READ_FRAMEBUFFER,Se.__webglFramebuffer),_.bindFramebuffer(R.DRAW_FRAMEBUFFER,Ai.__webglFramebuffer);for(let xs=0;xs<Tt;xs++)_s&&(R.framebufferTextureLayer(R.READ_FRAMEBUFFER,R.COLOR_ATTACHMENT0,z.get(v).__webglTexture,G,ce+xs),R.framebufferTextureLayer(R.DRAW_FRAMEBUFFER,R.COLOR_ATTACHMENT0,z.get(D).__webglTexture,gt,Ie+xs)),R.blitFramebuffer(Dt,ne,vt,mt,Et,pe,vt,mt,R.DEPTH_BUFFER_BIT,R.NEAREST);_.bindFramebuffer(R.READ_FRAMEBUFFER,null),_.bindFramebuffer(R.DRAW_FRAMEBUFFER,null)}else if(G!==0||v.isRenderTargetTexture||z.has(v)){let Pe=z.get(v),wi=z.get(D);_.bindFramebuffer(R.READ_FRAMEBUFFER,I),_.bindFramebuffer(R.DRAW_FRAMEBUFFER,k);for(let Se=0;Se<Tt;Se++)_s?R.framebufferTextureLayer(R.READ_FRAMEBUFFER,R.COLOR_ATTACHMENT0,Pe.__webglTexture,G,ce+Se):R.framebufferTexture2D(R.READ_FRAMEBUFFER,R.COLOR_ATTACHMENT0,R.TEXTURE_2D,Pe.__webglTexture,G),ye?R.framebufferTextureLayer(R.DRAW_FRAMEBUFFER,R.COLOR_ATTACHMENT0,wi.__webglTexture,gt,Ie+Se):R.framebufferTexture2D(R.DRAW_FRAMEBUFFER,R.COLOR_ATTACHMENT0,R.TEXTURE_2D,wi.__webglTexture,gt),G!==0?R.blitFramebuffer(Dt,ne,vt,mt,Et,pe,vt,mt,R.COLOR_BUFFER_BIT,R.NEAREST):ye?R.copyTexSubImage3D(yt,gt,Et,pe,Ie+Se,Dt,ne,vt,mt):R.copyTexSubImage2D(yt,gt,Et,pe,Dt,ne,vt,mt);_.bindFramebuffer(R.READ_FRAMEBUFFER,null),_.bindFramebuffer(R.DRAW_FRAMEBUFFER,null)}else ye?v.isDataTexture||v.isData3DTexture?R.texSubImage3D(yt,gt,Et,pe,Ie,vt,mt,Tt,ve,We,Te.data):D.isCompressedArrayTexture?R.compressedTexSubImage3D(yt,gt,Et,pe,Ie,vt,mt,Tt,ve,Te.data):R.texSubImage3D(yt,gt,Et,pe,Ie,vt,mt,Tt,ve,We,Te):v.isDataTexture?R.texSubImage2D(R.TEXTURE_2D,gt,Et,pe,vt,mt,ve,We,Te.data):v.isCompressedTexture?R.compressedTexSubImage2D(R.TEXTURE_2D,gt,Et,pe,Te.width,Te.height,ve,Te.data):R.texSubImage2D(R.TEXTURE_2D,gt,Et,pe,vt,mt,ve,We,Te);_.pixelStorei(R.UNPACK_ROW_LENGTH,Je),_.pixelStorei(R.UNPACK_IMAGE_HEIGHT,ue),_.pixelStorei(R.UNPACK_SKIP_PIXELS,wn),_.pixelStorei(R.UNPACK_SKIP_ROWS,Yn),_.pixelStorei(R.UNPACK_SKIP_IMAGES,Ei),gt===0&&D.generateMipmaps&&R.generateMipmap(yt),_.unbindTexture()},this.initRenderTarget=function(v){z.get(v).__webglFramebuffer===void 0&&Z.setupRenderTarget(v)},this.initTexture=function(v){v.isCubeTexture?Z.setTextureCube(v,0):v.isData3DTexture?Z.setTexture3D(v,0):v.isDataArrayTexture||v.isCompressedArrayTexture?Z.setTexture2DArray(v,0):Z.setTexture2D(v,0),_.unbindTexture()},this.resetState=function(){W=0,J=0,et=null,_.reset(),pt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return kn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;let e=this.getContext();e.drawingBufferColorSpace=he._getDrawingBufferColorSpace(t),e.unpackColorSpace=he._getUnpackColorSpace()}};var Ff={type:"change"},Wh={type:"start"},Bf={type:"end"},Vl=new us,Of=new vn,ay=Math.cos(70*xh.DEG2RAD),ke=new L,fn=2*Math.PI,xe={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},Gh=1e-6,Hl=class extends $r{constructor(t,e=null){super(t,e),this.state=xe.NONE,this.target=new L,this.cursor=new L,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.keyRotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:Wi.ROTATE,MIDDLE:Wi.DOLLY,RIGHT:Wi.PAN},this.touches={ONE:Xi.ROTATE,TWO:Xi.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._cursorStyle="auto",this._domElementKeyEvents=null,this._lastPosition=new L,this._lastQuaternion=new Mn,this._lastTargetPosition=new L,this._quat=new Mn().setFromUnitVectors(t.up,new L(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new nr,this._sphericalDelta=new nr,this._scale=1,this._panOffset=new L,this._rotateStart=new Gt,this._rotateEnd=new Gt,this._rotateDelta=new Gt,this._panStart=new Gt,this._panEnd=new Gt,this._panDelta=new Gt,this._dollyStart=new Gt,this._dollyEnd=new Gt,this._dollyDelta=new Gt,this._dollyDirection=new L,this._mouse=new Gt,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=cy.bind(this),this._onPointerDown=ly.bind(this),this._onPointerUp=hy.bind(this),this._onContextMenu=_y.bind(this),this._onMouseWheel=fy.bind(this),this._onKeyDown=py.bind(this),this._onTouchStart=my.bind(this),this._onTouchMove=gy.bind(this),this._onMouseDown=uy.bind(this),this._onMouseMove=dy.bind(this),this._interceptControlDown=xy.bind(this),this._interceptControlUp=yy.bind(this),this.domElement!==null&&this.connect(this.domElement),this.update()}set cursorStyle(t){this._cursorStyle=t,t==="grab"?this.domElement.style.cursor="grab":this.domElement.style.cursor="auto"}get cursorStyle(){return this._cursorStyle}connect(t){super.connect(t),this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.state=xe.NONE,this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.ownerDocument.removeEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents();let t=this.domElement.getRootNode();t.removeEventListener("keydown",this._interceptControlDown,{capture:!0}),t.removeEventListener("keyup",this._interceptControlUp,{capture:!0}),this._controlActive=!1,this._pointers.length=0,this._pointerPositions={},this.domElement.style.touchAction="",this.domElement.style.cursor="auto"}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(t){t.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=t}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(Ff),this.update(),this.state=xe.NONE}pan(t,e){this._pan(t,e),this.update()}dollyIn(t){this._dollyIn(t),this.update()}dollyOut(t){this._dollyOut(t),this.update()}rotateLeft(t){this._rotateLeft(t),this.update()}rotateUp(t){this._rotateUp(t),this.update()}update(t=null){let e=this.object.position;ke.copy(e).sub(this.target),ke.applyQuaternion(this._quat),this._spherical.setFromVector3(ke),this.autoRotate&&this.state===xe.NONE&&this._rotateLeft(this._getAutoRotationAngle(t)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let i=this.minAzimuthAngle,s=this.maxAzimuthAngle;isFinite(i)&&isFinite(s)&&(i<-Math.PI?i+=fn:i>Math.PI&&(i-=fn),s<-Math.PI?s+=fn:s>Math.PI&&(s-=fn),i<=s?this._spherical.theta=Math.max(i,Math.min(s,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(i+s)/2?Math.max(i,this._spherical.theta):Math.min(s,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let r=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{let o=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),r=o!=this._spherical.radius}if(ke.setFromSpherical(this._spherical),ke.applyQuaternion(this._quatInverse),e.copy(this.target).add(ke),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let o=null;if(this.object.isPerspectiveCamera){let a=ke.length();o=this._clampDistance(a*this._scale);let c=a-o;this.object.position.addScaledVector(this._dollyDirection,c),this.object.updateMatrixWorld(),r=!!c}else if(this.object.isOrthographicCamera){let a=new L(this._mouse.x,this._mouse.y,0);a.unproject(this.object);let c=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),r=c!==this.object.zoom;let l=new L(this._mouse.x,this._mouse.y,0);l.unproject(this.object),this.object.position.sub(l).add(a),this.object.updateMatrixWorld(),o=ke.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;o!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(o).add(this.object.position):(Vl.origin.copy(this.object.position),Vl.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(Vl.direction))<ay?this.object.lookAt(this.target):(Of.setFromNormalAndCoplanarPoint(this.object.up,this.target),Vl.intersectPlane(Of,this.target))))}else if(this.object.isOrthographicCamera){let o=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),o!==this.object.zoom&&(this.object.updateProjectionMatrix(),r=!0)}return this._scale=1,this._performCursorZoom=!1,r||this._lastPosition.distanceToSquared(this.object.position)>Gh||8*(1-this._lastQuaternion.dot(this.object.quaternion))>Gh||this._lastTargetPosition.distanceToSquared(this.target)>Gh?(this.dispatchEvent(Ff),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(t){return t!==null?fn/60*this.autoRotateSpeed*t:fn/60/60*this.autoRotateSpeed}_getZoomScale(t){let e=Math.abs(t*.01);return Math.pow(.95,this.zoomSpeed*e)}_rotateLeft(t){this._sphericalDelta.theta-=t}_rotateUp(t){this._sphericalDelta.phi-=t}_panLeft(t,e){ke.setFromMatrixColumn(e,0),ke.multiplyScalar(-t),this._panOffset.add(ke)}_panUp(t,e){this.screenSpacePanning===!0?ke.setFromMatrixColumn(e,1):(ke.setFromMatrixColumn(e,0),ke.crossVectors(this.object.up,ke)),ke.multiplyScalar(t),this._panOffset.add(ke)}_pan(t,e){let i=this.domElement;if(this.object.isPerspectiveCamera){let s=this.object.position;ke.copy(s).sub(this.target);let r=ke.length();r*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*t*r/i.clientHeight,this.object.matrix),this._panUp(2*e*r/i.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(t*(this.object.right-this.object.left)/this.object.zoom/i.clientWidth,this.object.matrix),this._panUp(e*(this.object.top-this.object.bottom)/this.object.zoom/i.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(t){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=t:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(t){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=t:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(t,e){if(!this.zoomToCursor)return;this._performCursorZoom=!0;let i=this.domElement.getBoundingClientRect(),s=t-i.left,r=e-i.top,o=i.width,a=i.height;this._mouse.x=s/o*2-1,this._mouse.y=-(r/a)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(t){return Math.max(this.minDistance,Math.min(this.maxDistance,t))}_handleMouseDownRotate(t){this._rotateStart.set(t.clientX,t.clientY)}_handleMouseDownDolly(t){this._updateZoomParameters(t.clientX,t.clientX),this._dollyStart.set(t.clientX,t.clientY)}_handleMouseDownPan(t){this._panStart.set(t.clientX,t.clientY)}_handleMouseMoveRotate(t){this._rotateEnd.set(t.clientX,t.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);let e=this.domElement;this._rotateLeft(fn*this._rotateDelta.x/e.clientHeight),this._rotateUp(fn*this._rotateDelta.y/e.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(t){this._dollyEnd.set(t.clientX,t.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(t){this._panEnd.set(t.clientX,t.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(t){this._updateZoomParameters(t.clientX,t.clientY),t.deltaY<0?this._dollyIn(this._getZoomScale(t.deltaY)):t.deltaY>0&&this._dollyOut(this._getZoomScale(t.deltaY)),this.update()}_handleKeyDown(t){let e=!1;switch(t.code){case this.keys.UP:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateUp(fn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,this.keyPanSpeed),e=!0;break;case this.keys.BOTTOM:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateUp(-fn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,-this.keyPanSpeed),e=!0;break;case this.keys.LEFT:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateLeft(fn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(this.keyPanSpeed,0),e=!0;break;case this.keys.RIGHT:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateLeft(-fn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(-this.keyPanSpeed,0),e=!0;break}e&&(t.preventDefault(),this.update())}_handleTouchStartRotate(t){if(this._pointers.length===1)this._rotateStart.set(t.pageX,t.pageY);else{let e=this._getSecondPointerPosition(t),i=.5*(t.pageX+e.x),s=.5*(t.pageY+e.y);this._rotateStart.set(i,s)}}_handleTouchStartPan(t){if(this._pointers.length===1)this._panStart.set(t.pageX,t.pageY);else{let e=this._getSecondPointerPosition(t),i=.5*(t.pageX+e.x),s=.5*(t.pageY+e.y);this._panStart.set(i,s)}}_handleTouchStartDolly(t){let e=this._getSecondPointerPosition(t),i=t.pageX-e.x,s=t.pageY-e.y,r=Math.sqrt(i*i+s*s);this._dollyStart.set(0,r)}_handleTouchStartDollyPan(t){this.enableZoom&&this._handleTouchStartDolly(t),this.enablePan&&this._handleTouchStartPan(t)}_handleTouchStartDollyRotate(t){this.enableZoom&&this._handleTouchStartDolly(t),this.enableRotate&&this._handleTouchStartRotate(t)}_handleTouchMoveRotate(t){if(this._pointers.length==1)this._rotateEnd.set(t.pageX,t.pageY);else{let i=this._getSecondPointerPosition(t),s=.5*(t.pageX+i.x),r=.5*(t.pageY+i.y);this._rotateEnd.set(s,r)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);let e=this.domElement;this._rotateLeft(fn*this._rotateDelta.x/e.clientHeight),this._rotateUp(fn*this._rotateDelta.y/e.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(t){if(this._pointers.length===1)this._panEnd.set(t.pageX,t.pageY);else{let e=this._getSecondPointerPosition(t),i=.5*(t.pageX+e.x),s=.5*(t.pageY+e.y);this._panEnd.set(i,s)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(t){let e=this._getSecondPointerPosition(t),i=t.pageX-e.x,s=t.pageY-e.y,r=Math.sqrt(i*i+s*s);this._dollyEnd.set(0,r),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);let o=(t.pageX+e.x)*.5,a=(t.pageY+e.y)*.5;this._updateZoomParameters(o,a)}_handleTouchMoveDollyPan(t){this.enableZoom&&this._handleTouchMoveDolly(t),this.enablePan&&this._handleTouchMovePan(t)}_handleTouchMoveDollyRotate(t){this.enableZoom&&this._handleTouchMoveDolly(t),this.enableRotate&&this._handleTouchMoveRotate(t)}_addPointer(t){this._pointers.push(t.pointerId)}_removePointer(t){delete this._pointerPositions[t.pointerId];for(let e=0;e<this._pointers.length;e++)if(this._pointers[e]==t.pointerId){this._pointers.splice(e,1);return}}_isTrackingPointer(t){for(let e=0;e<this._pointers.length;e++)if(this._pointers[e]==t.pointerId)return!0;return!1}_trackPointer(t){let e=this._pointerPositions[t.pointerId];e===void 0&&(e=new Gt,this._pointerPositions[t.pointerId]=e),e.set(t.pageX,t.pageY)}_getSecondPointerPosition(t){let e=t.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[e]}_customWheelEvent(t){let e=t.deltaMode,i={clientX:t.clientX,clientY:t.clientY,deltaY:t.deltaY};switch(e){case 1:i.deltaY*=16;break;case 2:i.deltaY*=100;break}return t.ctrlKey&&!this._controlActive&&(i.deltaY*=10),i}};function ly(n){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(n.pointerId),this.domElement.ownerDocument.addEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(n)&&(this._addPointer(n),n.pointerType==="touch"?this._onTouchStart(n):this._onMouseDown(n),this._cursorStyle==="grab"&&(this.domElement.style.cursor="grabbing")))}function cy(n){this.enabled!==!1&&(n.pointerType==="touch"?this._onTouchMove(n):this._onMouseMove(n))}function hy(n){switch(this._removePointer(n),this._pointers.length){case 0:this.domElement.releasePointerCapture(n.pointerId),this.domElement.ownerDocument.removeEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(Bf),this.state=xe.NONE,this._cursorStyle==="grab"&&(this.domElement.style.cursor="grab");break;case 1:let t=this._pointers[0],e=this._pointerPositions[t];this._onTouchStart({pointerId:t,pageX:e.x,pageY:e.y});break}}function uy(n){let t;switch(n.button){case 0:t=this.mouseButtons.LEFT;break;case 1:t=this.mouseButtons.MIDDLE;break;case 2:t=this.mouseButtons.RIGHT;break;default:t=-1}switch(t){case Wi.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(n),this.state=xe.DOLLY;break;case Wi.ROTATE:if(n.ctrlKey||n.metaKey||n.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(n),this.state=xe.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(n),this.state=xe.ROTATE}break;case Wi.PAN:if(n.ctrlKey||n.metaKey||n.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(n),this.state=xe.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(n),this.state=xe.PAN}break;default:this.state=xe.NONE}this.state!==xe.NONE&&this.dispatchEvent(Wh)}function dy(n){switch(this.state){case xe.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(n);break;case xe.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(n);break;case xe.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(n);break}}function fy(n){this.enabled===!1||this.enableZoom===!1||this.state!==xe.NONE||(n.preventDefault(),this.dispatchEvent(Wh),this._handleMouseWheel(this._customWheelEvent(n)),this.dispatchEvent(Bf))}function py(n){this.enabled!==!1&&this._handleKeyDown(n)}function my(n){switch(this._trackPointer(n),this._pointers.length){case 1:switch(this.touches.ONE){case Xi.ROTATE:if(this.enableRotate===!1)return;this._handleTouchStartRotate(n),this.state=xe.TOUCH_ROTATE;break;case Xi.PAN:if(this.enablePan===!1)return;this._handleTouchStartPan(n),this.state=xe.TOUCH_PAN;break;default:this.state=xe.NONE}break;case 2:switch(this.touches.TWO){case Xi.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(n),this.state=xe.TOUCH_DOLLY_PAN;break;case Xi.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(n),this.state=xe.TOUCH_DOLLY_ROTATE;break;default:this.state=xe.NONE}break;default:this.state=xe.NONE}this.state!==xe.NONE&&this.dispatchEvent(Wh)}function gy(n){switch(this._trackPointer(n),this.state){case xe.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(n),this.update();break;case xe.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(n),this.update();break;case xe.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(n),this.update();break;case xe.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(n),this.update();break;default:this.state=xe.NONE}}function _y(n){this.enabled!==!1&&n.preventDefault()}function xy(n){n.key==="Control"&&(this._controlActive=!0,this.domElement.getRootNode().addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function yy(n){n.key==="Control"&&(this._controlActive=!1,this.domElement.getRootNode().removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}var Xh=n=>["space-points","ellipsoid","line-plane","point-projection"].includes(n);function kf(n){let t=n,e=t.kind,i=14806692,s=12900275,r=document.createElement("div");r.className="scene-live-label",t.host.append(r);let o=(a,c=.055)=>{let l=t.mesh(new nn(c,14,10),i,1);return l.position.set(...a),l};if(e==="space-points"){let a=[-1.5,-.9,-.8],c=[1.5,1.05,.9];o(a),o(c),t.line([a,c],i,1),t.line([a,[c[0],a[1],a[2]],[c[0],c[1],a[2]],c],s,.5,!0);let l=o(a,.09);for(let u=0;u<3;u++){let f=[...a];f[u]+=3.3,t.line([a,f],s,.2)}t.updates.push(u=>{let f=.5+.43*Math.sin(u*.38);l.position.set(...a.map((h,d)=>(1-f)*h+f*c[d])),r.textContent="AP : PB = "+f.toFixed(2)+" : "+(1-f).toFixed(2)})}else if(e==="ellipsoid"){let u=t.mesh(new nn(1,56,36),7445365,.28);u.scale.set(2,1.6,1.6);let f=new ii(new Si(new nn(1,24,16)),new un({color:s,transparent:!0,opacity:.15}));f.scale.copy(u.scale),t.group.add(f),o([-1.2,0,0]),o([1.2,0,0]);let h=o([2,0,0],.075),d=t.line([[-1.2,0,0],[2,0,0]],i,.9),m=t.line([[1.2,0,0],[2,0,0]],i,.9),x=t.line([[0,0,0],[0,0,0]],s,.7);t.updates.push(g=>{let p=g*.25+.5,S=g*.15+.5,A=[2*Math.cos(p),1.6*Math.sin(p)*Math.cos(S),1.6*Math.sin(p)*Math.sin(S)];h.position.set(...A),t.updateLine(d,[[-1.2,0,0],A]),t.updateLine(m,[[1.2,0,0],A]);let M=[];for(let T=0;T<=128;T++){let b=T/128*2*Math.PI;M.push([2*Math.cos(b),1.6*Math.sin(b)*Math.cos(S),1.6*Math.sin(b)*Math.sin(S)])}t.updateLine(x,M),r.textContent="\uB450 \uCD08\uC810\uC744 \uD3EC\uD568\uD558\uB294 \uB2E8\uBA74 \xB7 PF\u2081 + PF\u2082 = 4"})}else if(e==="line-plane"){let a=t.mesh(new en(4.2,3.1),9414526,.23);a.rotation.x=-Math.PI/2;let c=t.line([[-2,1,0],[2,-1,0]],i,1),l=o([0,1,0]);t.group.add(new Gi(new L(0,1,0),new L(0,0,0),1.5,s,.18,.08)),t.updates.push(u=>{let f=Math.floor(u/5)%3,h=f===2?0:1,d=f===0?-.7:0,m=[-2,h-2*d,-.5],x=[2,h+2*d,.5];t.updateLine(c,[m,x]),l.position.set(0,h,0),r.textContent=["\uAD50\uCC28 \xB7 v\xB7n \u2260 0","\uD3C9\uD589 \xB7 v\xB7n = 0, P\uB294 \uD3C9\uBA74 \uBC16","\uD3EC\uD568 \xB7 v\xB7n = 0, P\uB294 \uD3C9\uBA74 \uC704"][f]})}else if(e==="point-projection"){let a=t.mesh(new en(4.2,3.1),9414526,.23);a.rotation.x=-Math.PI/2;let c=[-.8,.9,.3],l=[.8,-.9,.3],u=o(c),f=o(l),h=o([0,0,0],.08),d=o([0,0,0],.08),m=[t.line([c,c],s,.6,!0),t.line([l,l],s,.6,!0)];t.line([c,l],s,.3),t.updates.push(x=>{let g=-Math.atan2(1.6,1.8)+.65*Math.sin(x*.25),p=new L(Math.sin(g),Math.cos(g),0);a.quaternion.setFromUnitVectors(new L(0,0,1),p),[c,l].forEach((S,A)=>{let M=new L(...S),T=M.clone().addScaledVector(p,-M.dot(p));(A?d:h).position.copy(T),t.updateLine(m[A],[S,T.toArray()])}),r.textContent="\uCC28\uBCA1\uD130\uAC00 \uAD00\uCC30 \uBC29\uD5A5\uACFC \uD3C9\uD589\uD558\uBA74 \uC815\uC0AC\uC601\uC774 \uACB9\uCE69\uB2C8\uB2E4"})}}function zf(n){let e={riemann:'<path d="M65 215 H295 M75 215 V70"/><path d="M80 215V206H120V179H160V134H200V71H240V215" opacity=".4"/><path d="M80 215 Q160 215 240 71" stroke-width="2"/>',"signed-area":'<path d="M60 138H300 M180 38V230" opacity=".3"/><path d="M80 205L280 71"/><path d="M80 205V138H180Z M180 138H280V71Z" fill="currentColor" fill-opacity=".13"/>',parabola:'<path d="M65 55 Q180 320 295 55"/><path d="M65 222H295" opacity=".5"/><circle cx="180" cy="141" r="4" fill="currentColor"/><path d="M180 141L255 156V222" stroke-dasharray="4 4"/>',rolle:'<path d="M55 80H305 M75 133H285 M100 185H260" opacity=".3"/>'+[55,115,180,235,305].map(i=>'<circle cx="'+i+'" cy="80" r="4"/>').join("")+[85,145,210,275].map(i=>'<circle cx="'+i+'" cy="133" r="4"/>').join("")+[115,180,245].map(i=>'<circle cx="'+i+'" cy="185" r="4"/>').join(""),ellipsoid:'<ellipse cx="180" cy="135" rx="123" ry="78"/><ellipse cx="180" cy="135" rx="123" ry="30" opacity=".5"/><ellipse cx="180" cy="135" rx="45" ry="78" opacity=".3"/><path d="M105 135L205 60L255 135"/><circle cx="105" cy="135" r="3"/><circle cx="255" cy="135" r="3"/>',rotation:'<path d="M55 176H305 M180 50V231" opacity=".3"/><path d="M75 230L285 57 M98 54L274 235" stroke-dasharray="4 4" opacity=".55"/><path d="M80 68Q180 300 280 68" stroke-width="2"/>',compound:'<path d="M60 218H305 M70 218V43" opacity=".3"/><path d="M90 65Q120 179 292 198" stroke-width="2"/><path d="M90 55Q120 173 292 195" stroke-dasharray="5 5" opacity=".6"/>',"tangent-conic":'<ellipse cx="180" cy="135" rx="104" ry="67"/><path d="M284 40V232"/><circle cx="284" cy="135" r="4" fill="currentColor"/>',restore:'<path d="M70 195C150 20 200 247 292 62 M70 218C150 43 200 270 292 85 M70 172C150 -3 200 224 292 39" opacity=".7"/>',"restore-quadratic":'<path d="M65 65Q180 280 295 65 M65 100Q180 315 295 100 M65 30Q180 245 295 30" opacity=".7"/>',model:'<path d="M65 215H300 M80 215V48" opacity=".3"/><path d="M85 210L285 60 M85 210Q250 195 285 60 M85 210C175 210 175 60 285 60" opacity=".7"/>',curvature:'<path d="M70 222C150 222 206 50 290 50" stroke-width="2"/><path d="M100 228L260 45" stroke-dasharray="5 5" opacity=".5"/><circle cx="180" cy="137" r="5"/>',ratio:'<path d="M62 200C128 -40 205 300 298 60"/><path d="M114 222H245 M114 215V229 M180 215V229 M245 215V229" opacity=".5"/><circle cx="114" cy="105" r="4"/><circle cx="180" cy="135" r="4"/><circle cx="245" cy="165" r="4"/>',chain:'<path d="M58 55Q133 300 208 55"/><path d="M165 220C220 220 240 55 299 55"/><circle cx="133" cy="178" r="4"/><circle cx="233" cy="135" r="4"/>',"tangent-count":'<path d="M63 213C123 -15 213 285 300 52"/><path d="M55 180L300 80 M68 230L285 36 M60 108L300 158" opacity=".5"/><circle cx="207" cy="118" r="5" fill="currentColor"/>',"mean-value":'<path d="M70 195Q180 225 285 63"/><path d="M70 195L285 63 M95 230L280 116" opacity=".6"/>',"space-points":'<path d="M78 196L180 155L280 72 M78 196H280V72 M180 155V44 M180 155L285 222" opacity=".65"/><circle cx="78" cy="196" r="5"/><circle cx="280" cy="72" r="5"/><circle cx="180" cy="155" r="5" fill="currentColor"/>',"line-plane":'<path d="M55 175L214 113L305 164L145 225Z" opacity=".4"/><path d="M91 70L268 208 M180 166V45"/><circle cx="180" cy="141" r="5"/>',"point-projection":'<path d="M60 191L214 132L302 181L146 240Z" opacity=".4"/><path d="M110 70L170 186 M205 55L215 167" stroke-dasharray="4 4"/><circle cx="110" cy="70" r="5"/><circle cx="205" cy="55" r="5"/><circle cx="170" cy="186" r="3"/><circle cx="215" cy="167" r="3"/>'}[n];return e?'<svg viewBox="0 0 360 270" aria-hidden="true" focusable="false"><g fill="none" stroke="currentColor" stroke-width="1.4">'+e+"</g></svg>":null}function Vf({kind:n,t,phase:e,c:i,path:s,dot:r,green:o,pale:a}){if(!["riemann","signed-area","parabola","rolle","restore","restore-quadratic","ratio","mean-value","chain","model","compound","tangent-conic","tangent-count","rotation","curvature"].includes(n))return!1;let l=(h,d=-200,m=122)=>{i.font="12px sans-serif",i.fillStyle=a,i.fillText(h,d,m)},u=(h,d=-2,m=2,x=85,g=35,p=o,S=2)=>{let A=[];for(let M=d;M<=m+1e-4;M+=(m-d)/150)A.push([M*x,35-h(M)*g]);s(A,p,S)},f=(h,d=a)=>{i.setLineDash([5,5]),s(h,d,1),i.setLineDash([])};if(n==="riemann"){let h=4+Math.floor(18*(.5+.5*Math.sin(t*.28))),d=300/h,m=35,x=-150;for(let p=0;p<h;p++){let S=(p/h)**2*185,A=((p+1)/h)**2*185;i.fillStyle=o+"15",i.fillRect(x+p*d,m-A,d,A),i.strokeStyle=a+"55",i.strokeRect(x+p*d,m-A,d,A),i.strokeStyle=o,i.strokeRect(x+p*d,m-S,d,S)}let g=[];for(let p=0;p<=120;p++){let S=p/120;g.push([x+300*S,m-185*S*S])}s(g),s([[x,m],[150,m]],a,1),l("n = "+h+"   L = "+((h-1)*(2*h-1)/(6*h*h)).toFixed(4)+"   R = "+((h+1)*(2*h+1)/(6*h*h)).toFixed(4),-190,104),l("f(x)=x\xB2 \xB7 [0,1] \xB7 \u222Bf = 1/3",-190,128)}else if(n==="signed-area"){let h=-2+4*(.5+.5*Math.sin(t*.25));for(let d=-2;d<h;d+=.025){let m=d*55;i.fillStyle=d<0?a+"2b":o+"44",i.fillRect(d*85,Math.min(35,35-m),2.5,Math.abs(m))}u(d=>d,-2,2,85,55),r(h*85,35-h*55,5),l("\u222B f = "+((h*h-4)/2).toFixed(2)+"   \u222B |f| = "+(h<0?(4-h*h)/2:2+h*h/2).toFixed(2)),l("f(x)=x \xB7 \uC2DC\uC791\uC810 \u22122",-200,144)}else if(n==="parabola"){let h=.6+.55*(.5+.5*Math.sin(t*.3)),d=1.5*Math.sin(t*.3+.7),m=d*d/(4*h),x=62,g=[0,35-h*x],p=[d*x,35-m*x],S=[d*x,35+h*x];u(A=>A*A/(4*h),-2.4,2.4,x,x),f([[-200,35+h*x],[200,35+h*x]]),s([g,p,S],a,1.2),r(...g,5),r(...p,5),l("F",g[0]+10,g[1]),l("d(P,F) = d(P,\uC900\uC120)",-200,-145)}else if(n==="rolle"){let h=[-2,-1,0,1,2],d=[-Math.sqrt((15+Math.sqrt(145))/10),-Math.sqrt((15-Math.sqrt(145))/10),Math.sqrt((15-Math.sqrt(145))/10),Math.sqrt((15+Math.sqrt(145))/10)];u(x=>x**5-5*x**3+4*x,-2.12,2.12,85,15),h.forEach(x=>r(x*85,35,4));let m=.45+.4*Math.sin(t*.3);for(let x=0;x<4;x++)s([[h[x]*85,77],[h[x+1]*85,77]],a+"60",1),r(d[x]*85,95,5,o+Math.round(m*255).toString(16).padStart(2,"0"));l("f\uC758 \uADFC 5\uAC1C \u2192 f\u2032\uC758 \uADFC 4\uAC1C",-185,132)}else if(n==="restore"||n==="restore-quadratic"){let h=n==="restore"?m=>m**3/3-m:m=>m*m;[-1.2,0,1.2].forEach((m,x)=>u(g=>h(g)+m,-1.8,1.8,86,32,x===1?o:a+"55",x===1?2:1));let d=.9*Math.sin(t*.3);u(m=>h(m)+d,-1.8,1.8,86,32,o+"b0",2),r(86,35-(h(1)+d)*32,5),l(n==="restore"?"\uAC19\uC740 \uB3C4\uD568\uC218 x\xB2\u22121, \uB2EC\uB77C\uC9C0\uB294 \uC801\uBD84\uC0C1\uC218 C":"\uAC19\uC740 \uB3C4\uD568\uC218 2x, \uB2EC\uB77C\uC9C0\uB294 \uC801\uBD84\uC0C1\uC218 C",-205,132)}else if(n==="ratio")u(h=>h**3-3*h,-1.85,1.85,85,28),[[-1,2],[0,0],[1,-2]].forEach(h=>r(h[0]*85,35-h[1]*28,5)),s([[-85,105],[0,105],[85,105]],a,1),[-85,0,85].forEach(h=>s([[h,100],[h,110]],a,1)),l("1",-46,126),l("1",39,126),l("\uBCC0\uACE1\uC810\uC744 \uAE30\uC900\uC73C\uB85C \uB098\uB208 \uC218\uD3C9 \uAC70\uB9AC",-180,-138);else if(n==="mean-value"){u(d=>d*d,-1.5,2.1,80,35),s([[-80,0],[160,-105]],a,1.5);let h=.5+.8*Math.sin(t*.27);s([[-120,35-(h*h+2*h*(-1.5-h))*35],[172,35-(h*h+2*h*(2.15-h))*35]],o,1.3),r(h*80,35-h*h*35,5),l("\uD3C9\uADE0 \uAE30\uC6B8\uAE30 1 = f\u2032(1/2)",-185,130),l("f(x)=x\xB2, \uAD6C\uAC04 [\u22121,2]",-185,151)}else if(n==="chain"){let h=Math.floor(t/6)%3,d=[m=>m*m,m=>m**3,m=>m**4][h];u(d,-1.5,1.5,90,32),r(0,35,5),l(["x\xB2 \xB7 \uB3C4\uD568\uC218 \uBD80\uD638 \u2212 \u2192 + \xB7 \uADF9\uC18C","x\xB3 \xB7 \uB3C4\uD568\uC218 \uBD80\uD638 + \u2192 + \xB7 \uADF9\uAC12 \uC544\uB2D8","x\u2074 \xB7 \uB450 \uC870\uAC74\uC774 \uACB9\uCCD0\uB3C4 \uBD80\uD638 \uD655\uC778"][h],-205,130),l("h\u2032(0)=0 \uB2E4\uC74C\uC5D0, \uC591\uCABD \uBD80\uD638\uB97C \uC77D\uC2B5\uB2C8\uB2E4.",-205,-140)}else if(n==="model")u(h=>1+.3*h,-2,2,80,55,a,1.4),u(h=>Math.exp(.5*h),-2,2,80,55,o,1.7),u(h=>2/(1+Math.exp(-h)),-2,2,80,55,a,1.4),l("\uC77C\uCC28 \xB7 \uC9C0\uC218 \xB7 \uB85C\uC9C0\uC2A4\uD2F1 \uD6C4\uBCF4 \uD568\uC218",-200,120),l("\uC804\uC2DC\uC6A9 \uD568\uC218 \uB3C4\uD574 \xB7 \uD559\uC0DD \uC2E4\uCE21 \uC790\uB8CC \uC544\uB2D8",-200,144);else if(n==="compound"){let h=S=>-180+(S-1)/14*360,d=S=>35-S*2.6,m=S=>Math.log(2)/Math.log(1+S/100),x=[],g=[];for(let S=1.5;S<=15;S+=.07)x.push([h(S),d(m(S))]),g.push([h(S),d(72/S)]);s(x),f(g);let p=3+9*(.5+.5*Math.sin(t*.24));r(h(p),d(m(p)),5),l("r="+p.toFixed(1)+"%  \uC815\uD655\uAC12 "+m(p).toFixed(2)+"\uB144  72/r "+(72/p).toFixed(2)+"\uB144",-205,118),l("\uC5F0 1\uD68C \uBCF5\uB9AC \xB7 \uC77C\uC815\uD55C \uC774\uC728\uC758 \uC218\uD559 \uBAA8\uD615",-205,142)}else if(n==="tangent-conic"){let m=t*.23,x=[];for(let S=0;S<=160;S++){let A=S/160*Math.PI*2;x.push([2*Math.cos(A)*80,35-1*Math.sin(A)*80])}s(x);let g=[2*Math.cos(m),1*Math.sin(m)],p=[-2*Math.sin(m),1*Math.cos(m)];s([[80*(g[0]-2*p[0]),35-80*(g[1]-2*p[1])],[80*(g[0]+2*p[0]),35-80*(g[1]+2*p[1])]],a,1.2),r(g[0]*80,35-g[1]*80,5),l("\uC218\uC9C1\uC778 \uACBD\uC6B0\uC5D0\uB3C4 \uC811\uC810\uACFC \uC911\uADFC\uC740 \uB0A8\uC2B5\uB2C8\uB2E4.",-205,145)}else if(n==="tangent-count"){let h=[-.12,0,.3,1,1.12][Math.floor(t/5)%5],d=g=>2*g**3-3*g*g+h,m=[],x=g=>{m.some(p=>Math.abs(p-g)<1e-5)||m.push(g)};for(let g of[0,1])Math.abs(d(g))<1e-8&&x(g);for(let[g,p]of[[-3,0],[0,1],[1,3]]){let S=g,A=p;if(!(d(S)*d(A)>=0)){for(let M=0;M<45;M++){let T=(S+A)/2;d(S)*d(T)<=0?A=T:S=T}x((S+A)/2)}}u(g=>g**3,-1.3,1.75,85,28),m.forEach(g=>{s([[-110,35-(3*g*g*(-110/85)-2*g**3)*28],[180,35-(3*g*g*(180/85)-2*g**3)*28]],a+"8f",1),r(g*85,35-g**3*28,4)}),r(85,35-h*28,6),l("P(1, "+h+") \xB7 \uC11C\uB85C \uB2E4\uB978 \uC811\uC120 "+m.length+"\uAC1C",-205,136)}else if(n==="rotation"){u(x=>x*x,-1.55,1.55,60,60);let h=.7*Math.sin(t*.22),d=Math.cos(h),m=Math.sin(h);s([[-200*d,35+200*m],[200*d,35-200*m]],o,1.2),s([[200*m,35+200*d],[-200*m,35-200*d]],a,1.2),r(60,-25,5),l("\uC810\uC740 \uADF8\uB300\uB85C \xB7 \uC88C\uD45C\uCD95\uC774 \uD68C\uC804\uD569\uB2C8\uB2E4.",-205,130),l("XY\uD56D\uC758 \uACC4\uC218 = \u2212a sin(2\u03B8)",-205,151)}else if(n==="curvature"){u(m=>m**3,-1.8,1.8,85,26);let h=1.4*Math.sin(t*.3),d=3*h*h;s([[-180,35-(h**3+d*(-180/85-h))*26],[180,35-(h**3+d*(180/85-h))*26]],a,1.1),r(h*85,35-h**3*26,5),l("f(x)=x\xB3 \xB7 f\u2032\u2032(x)=6x \xB7 "+(h<0?"\uAE30\uC6B8\uAE30\uAC00 \uC791\uC544\uC9D1\uB2C8\uB2E4":"\uAE30\uC6B8\uAE30\uAC00 \uCEE4\uC9D1\uB2C8\uB2E4"),-205,136)}return!0}var Tn=14806692,Xn=14082502,Hf=6391659,Gf=n=>Xh(n)||["hero","sphere-slice","sphere-vector","distance","slices","hypersphere","projection","vectors","planes","cone","surface"].includes(n);function ho(n,t=0){let e=zf(n);if(e)return e;let i=(a,c="")=>'<path d="'+a+'" fill="none" stroke="currentColor" stroke-width="1.3" '+c+"/>",s=(a,c,l,u,f="")=>'<line x1="'+a+'" y1="'+c+'" x2="'+l+'" y2="'+u+'" stroke="currentColor" stroke-width="1.1" '+f+"/>",r=(a,c,l,u="")=>'<circle cx="'+a+'" cy="'+c+'" r="'+l+'" fill="none" stroke="currentColor" stroke-width="1.1" '+u+"/>",o="";if(["sphere-slice","sphere-vector","slices","hypersphere","hero"].includes(n)){if(o+=r(180,136,83),o+='<ellipse cx="180" cy="136" rx="33" ry="83" fill="none" stroke="currentColor" opacity=".4"/>',o+='<ellipse cx="180" cy="136" rx="83" ry="27" fill="none" stroke="currentColor" opacity=".5"/>',o+='<ellipse cx="180" cy="113" rx="79" ry="24" fill="currentColor" opacity=".12"/>',o+='<ellipse cx="180" cy="113" rx="79" ry="24" fill="none" stroke="currentColor" stroke-width="2"/>',o+=s(180,136,180,113,'stroke-dasharray="3 4"'),o+=s(180,136,250,123),o+=r(180,136,3,'fill="currentColor"'),n==="slices")for(let a=80;a<205;a+=17){let c=Math.sqrt(Math.max(0,6889-(a-136)**2));o+='<ellipse cx="180" cy="'+a+'" rx="'+c+'" ry="'+c*.25+'" fill="none" stroke="currentColor" opacity=".45"/>'}n==="sphere-vector"&&(o+=s(110,190,237,76,'stroke-width="2"'))}else if(["distance","planes","projection"].includes(n))o+=i("M 63 167 L 214 108 L 302 158 L 151 223 Z",'fill="currentColor" fill-opacity=".06"'),o+=s(175,65,175,172,'stroke-dasharray="4 5"'),o+=s(175,65,260,180),o+=s(175,172,260,180,'opacity=".5"'),o+=i("M175 163 L184 165 L184 174",'opacity=".65"'),o+=r(175,65,4,'fill="currentColor"'),o+=r(175,172,3,'fill="currentColor"'),n==="projection"&&(o+=i("M105 71 L230 84 L247 143 L125 131 Z",'fill="currentColor" fill-opacity=".08"'));else if(n==="cone")o+=i("M105 211 L180 56 L255 211"),o+='<ellipse cx="180" cy="211" rx="75" ry="20" fill="none" stroke="currentColor" opacity=".6"/>',o+=i("M180 56 L129 159 M180 56 L231 159",'opacity=".25"'),o+='<ellipse cx="180" cy="159" rx="51" ry="16" transform="rotate(-18 180 159)" fill="currentColor" fill-opacity=".12" stroke="currentColor" stroke-width="2"/>';else if(n==="vectors")o+=s(85,198,282,198,'opacity=".22"'),o+=s(85,198,251,198,'stroke-width="2.5"'),o+=s(85,198,226,88,'stroke-width="2"'),o+=i("M235 191 L251 198 L235 205"),o+=i("M212 91 L226 88 L222 103"),o+=s(226,88,226,198,'stroke-dasharray="3 5" opacity=".5"'),o+=i("M133 198 Q133 180 121 171",'opacity=".6"');else if(n==="conics")o+='<ellipse cx="180" cy="137" rx="116" ry="70" transform="rotate(-14 180 137)" fill="none" stroke="currentColor" stroke-width="1.6"/>',o+=r(110,155,3,'fill="currentColor"'),o+=r(249,120,3,'fill="currentColor"'),o+=i("M110 155 L203 70 L249 120",'opacity=".4"');else if(n==="reflection")o+=i("M74 73 Q180 300 286 73",'stroke-width="2"'),o+=s(96,45,96,110,'opacity=".6"'),o+=s(96,110,180,157,'stroke-width="1.5"'),o+=s(245,45,245,139,'opacity=".6"'),o+=s(245,139,180,157,'stroke-width="1.5"'),o+=r(180,157,4,'fill="currentColor"'),o+=s(180,57,180,227,'stroke-dasharray="3 5" opacity=".2"');else if(n==="surface"){for(let a=-3;a<=3;a++){let c="";for(let l=-3;l<=3;l+=.25){let u=180+l*26+a*14,f=150+a*16-(l*l-a*a)*4;c+=(c?" L":"M")+u+" "+f}o+=i(c,'opacity=".45"')}o+=i("M78 179 Q180 83 282 179",'stroke-width="2"')}else o+=s(49,207,309,207,'opacity=".23"'),o+=s(132,43,132,235,'opacity=".23"'),n==="area"&&(o+=i("M78 207 C113 100 130 80 170 160 S240 258 284 68 L284 207 Z",'fill="currentColor" fill-opacity=".11"')),["tangents","derivative","area","antiderivative","asymptote"].includes(n)?o+=i("M61 214 C109 38 147 111 179 164 S251 252 298 54",'stroke-width="1.7"'):o+=i("M57 194 Q183 240 291 52",'stroke-width="1.7"'),n==="newton"?o+=i("M291 52 L219 207 L219 157 L180 207 L180 192 L167 207",'opacity=".65"'):n==="asymptote"?o+=s(71,222,291,61,'stroke-dasharray="4 5" opacity=".5"'):n==="join"?o+=i("M180 171 L296 104",'stroke-width="1.6"'):n==="zoom"?(o+=r(201,151,49,'opacity=".6"'),o+=s(235,187,270,224,'opacity=".6"'),o+=s(161,180,245,111,'stroke-dasharray="4 5" opacity=".5"')):o+=s(104,235,281,75,'opacity=".6"'),o+=r(206,151,4,'fill="currentColor"');return'<svg viewBox="0 0 360 270" aria-hidden="true" focusable="false">'+o+"</svg>"}var Gl=class{constructor(t,e,i={}){this.host=t,this.kind=e,this.options=i,this.enabled=i.motion!==!1,this.time=0,this.phase=0,this.visible=!0,this.destroyed=!1,this.raf=0;try{Gf(e)?(this.init3D(),this.applyPalette()):this.init2D()}catch(s){this.controls?.dispose(),this.renderer?.dispose(),this.renderer?.forceContextLoss(),this.renderer=null,this.scene=null,this.controls=null,t.replaceChildren(),Gf(e)?(t.innerHTML=ho(e),t.dataset.renderer="svg-fallback",this.staticFallback=!0,this.enabled=!1):(this.init2D(),t.dataset.renderer="canvas2d-fallback"),console.warn("\uC804\uC2DC \uB3C4\uD574\uB97C \uB300\uCCB4 \uD654\uBA74\uC73C\uB85C \uD45C\uC2DC\uD569\uB2C8\uB2E4.",s.message)}this.resizeObserver=new ResizeObserver(()=>{this.resize(),this.draw()}),this.resizeObserver.observe(t),this.visibility=new IntersectionObserver(s=>{this.visible=s[0].isIntersecting,this.visible&&this.enabled&&this.start()},{rootMargin:"150px"}),this.visibility.observe(t),this.resize(),this.draw(),this.enabled&&this.start()}init3D(){this.scene=new Br,this.camera=new Ye(34,1,.1,60),this.camera.position.set(5,3.5,6.5),this.camera.lookAt(0,0,0),this.renderer=new Bl({alpha:!0,antialias:!0,powerPreference:"low-power"}),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,window.innerWidth<700?1.25:1.6)),this.renderer.setClearColor(0,0),this.renderer.outputColorSpace=Qe,this.renderer.toneMapping=jr,this.renderer.toneMappingExposure=1.2,this.host.append(this.renderer.domElement),this.host.dataset.renderer="webgl",this.scene.add(new Zr(15330805,1779252,2.5));let t=new er(16777215,3.1);t.position.set(-3,6,4),this.scene.add(t);let e=new er(12110052,2);e.position.set(5,-2,-3),this.scene.add(e),this.group=new xi,this.scene.add(this.group),this.controls=new Hl(this.camera,this.renderer.domElement),this.controls.enablePan=!1,this.controls.enableZoom=!1,this.controls.enableDamping=!0,this.controls.dampingFactor=.065,this.controls.maxPolarAngle=Math.PI*.75,this.controls.minPolarAngle=.3,this.controls.addEventListener("change",()=>{this.raf||this.renderer.render(this.scene,this.camera)}),this.renderer.domElement.style.touchAction="pan-y",this.updates=[],["hero","sphere-slice","sphere-vector","slices","hypersphere"].includes(this.kind)?this.sphere():["distance","planes"].includes(this.kind)?this.distance():this.kind==="projection"?this.projection():this.kind==="vectors"?this.vectors():this.kind==="cone"?this.cone():this.kind==="surface"?this.surface():Xh(this.kind)&&kf(this)}applyPalette(){if(!Number.isFinite(this.options.hue))return;let t={};this.scene.traverse(e=>{for(let i of Array.isArray(e.material)?e.material:e.material?[e.material]:[])i.color&&(i.color.getHSL(t),t.s>.08&&i.color.setHSL(this.options.hue,Math.min(.62,Math.max(.28,t.s)),t.l))})}material(t=Hf,e=.75){return new Wr({color:t,roughness:.33,metalness:.12,transparent:e<1,opacity:e,side:Ln,depthWrite:e>=1,clearcoat:.7})}mesh(t,e=Hf,i=.75){let s=new tn(t,this.material(e,i));return this.group.add(s),s}line(t,e=Tn,i=.8,s=!1){let r=new Ne().setFromPoints(t.map(c=>new L(...c))),o=s?new Xr({color:e,transparent:!0,opacity:i,dashSize:.07,gapSize:.05}):new un({color:e,transparent:!0,opacity:i}),a=new ds(r,o);return s&&a.computeLineDistances(),this.group.add(a),a}updateLine(t,e){t.geometry.setFromPoints(e.map(i=>new L(...i))),t.material.isLineDashedMaterial&&t.computeLineDistances()}sphere(){let e=this.mesh(new nn(1.65,56,40),6129773,this.kind==="hero"?.38:.28),i=new ii(new Si(new nn(1.65,24,16)),new un({color:12768929,transparent:!0,opacity:.14}));this.group.add(i);let s=this.mesh(new en(4.5,3.4),11257477,.12);s.rotation.x=-Math.PI/2;let r=this.mesh(new Qs(1,.018,8,128),Tn,.95);r.rotation.x=Math.PI/2;let o=this.line([[0,0,0],[1.4,.5,0]],Tn,.7),a=this.line([[0,0,0],[0,.5,0]],Xn,.6,!0),c=this.mesh(new Qs(1.65,.006,4,120),Xn,.35);if(c.rotation.x=Math.PI/2,this.group.rotation.z=-.13,this.kind==="slices"){e.visible=!1,s.visible=!1,r.visible=!1,o.visible=!1,a.visible=!1;for(let u=-1.45;u<1.5;u+=.24){let f=Math.sqrt(2.7224999999999997-u*u),h=this.mesh(new js(f,f,.027,64),9613941,.23);h.position.y=u}}let l=this.mesh(new nn(.045,14,10),Tn,1);this.updates.push(u=>{let f=.72*Math.sin(u*.38+this.phase*.8),h=Math.sqrt(1.65*1.65-f*f);if(s.position.y=f,r.position.y=f,r.scale.set(h,h,1),this.updateLine(o,[[0,0,0],[h,f,0]]),this.updateLine(a,[[0,0,0],[0,f,0]]),l.position.set(h,f,0),i.rotation.y=u*.045,this.group.rotation.y=.15+Math.sin(u*.09)*.14,this.kind==="hypersphere"){let d=.85*Math.sin(u*.4),m=Math.sqrt(1-d*d);e.scale.setScalar(m),i.scale.setScalar(m),r.visible=!1,s.visible=!1,o.visible=!1,a.visible=!1,c.scale.setScalar(m),l.visible=!1}if(this.kind==="sphere-vector"){s.visible=!1,r.visible=!1,a.visible=!1;let d=u*.25,m=[1.65*Math.cos(d),1.65*Math.sin(d),0];this.updateLine(o,[[0,0,0],m]),l.position.set(...m)}})}distance(){let t=this.mesh(new en(4.1,3.3),9414526,.25);t.rotation.x=-Math.PI/2,t.position.y=-.75;let e=this.line([[-2.05,-.75,-1.65],[2.05,-.75,-1.65],[2.05,-.75,1.65],[-2.05,-.75,1.65],[-2.05,-.75,-1.65]],Xn,.35),i=[.2,1.55,.1],s=[.2,-.75,.1];this.line([i,s],Tn,.95,!0),this.mesh(new nn(.065,16,12),Tn,1).position.set(...i),this.mesh(new nn(.035,12,8),Xn,1).position.set(...s);let a=this.mesh(new nn(.05,12,8),13687998,1),c=this.line([i,[1,-.75,1]],Xn,.6),l=this.line([s,[1,-.75,1]],Xn,.4);this.line([[.2,-.56,.1],[.4,-.56,.1],[.4,-.75,.1]],Tn,.55),this.updates.push(u=>{let f=[.2+1.3*Math.cos(u*.4),-.75,.1+.9*Math.sin(u*.4)];a.position.set(...f),this.updateLine(c,[i,f]),this.updateLine(l,[s,f]),this.group.rotation.y=-.25+Math.sin(u*.1)*.12})}projection(){let t=this.mesh(new en(3.2,2.1),12111e3,.25);t.rotation.x=-Math.PI/2,t.position.y=-1;let e=this.mesh(new en(3.2,2.1),8824953,.5);e.position.y=.7;let i=new ii(new Gr(e.geometry),new un({color:Tn,transparent:!0,opacity:.85}));e.add(i);let s=Array.from({length:4},()=>this.line([[0,0,0],[0,-1,0]],Xn,.4,!0));this.updates.push(r=>{let o=.35+.7*(.5+.5*Math.sin(r*.35));e.rotation.x=-Math.PI/2+o,t.scale.y=Math.cos(o),[[-1.6,-1.05],[1.6,-1.05],[1.6,1.05],[-1.6,1.05]].forEach((c,l)=>{let u=[c[0],.7+c[1]*Math.sin(o),-c[1]*Math.cos(o)];this.updateLine(s[l],[u,[u[0],-1,u[2]]])}),this.group.rotation.y=-.15})}vectors(){let t=new L(-1.4,-.6,0);this.group.add(new Gi(new L(1,0,0),t,2.8,Xn,.23,.12));let e=new Gi(new L(.6,1,0).normalize(),t,2.5,Tn,.23,.12);this.group.add(e);let i=this.line([[0,1,0],[0,-.6,0]],Xn,.5,!0),s=this.line([[-1.4,-.6,0],[0,-.6,0]],Tn,.7);this.updates.push(r=>{let o=.3+2.5*(.5+.5*Math.sin(r*.35));e.setDirection(new L(Math.cos(o),Math.sin(o),0));let a=-1.4+2.5*Math.cos(o),c=-.6+2.5*Math.sin(o);this.updateLine(i,[[a,c,0],[a,-.6,0]]),this.updateLine(s,[[-1.4,-.6,0],[a,-.6,0]]),this.group.rotation.y=-.2})}cone(){let t=this.mesh(new ki(1.25,2.25,64,1,!0),7445365,.28);t.rotation.z=Math.PI,t.position.y=1.125;let e=this.mesh(new ki(1.25,2.25,64,1,!0),7445365,.22);e.position.y=-1.125;let i=new un({color:Xn,transparent:!0,opacity:.17});for(let a of[t,e]){let c=new ii(new Si(new ki(1.25,2.25,24,1,!0)),i);c.position.copy(a.position),c.rotation.copy(a.rotation),this.group.add(c)}let s=new Ne().setFromPoints([new L(-2,0,-2),new L(2,0,-2),new L(2,0,2),new L(-2,0,2)]);s.setIndex([0,1,2,0,2,3]),s.computeVertexNormals();let r=this.mesh(s,12899480,.12),o=[];for(let a=0;a<8;a++)o.push(this.line([[0,0,0],[0,0,0]],Tn,.96));this.camera.position.set(6.8,3.5,7.8),this.controls.update(),this.updates.push(a=>{let c=.18+1.05*(.5+.5*Math.sin(a*.23)),l=Math.tan(c),u=.32,f=r.geometry.attributes.position;for(let d=0;d<f.count;d++)f.setY(d,l*f.getX(d)+u);f.needsUpdate=!0,r.geometry.computeVertexNormals();let h=[];for(let d of[1,-1]){let m=[];for(let x=0;x<=250;x++){let g=x/250*Math.PI*2,p=1.25/2.25,S=1-d*p*l*Math.cos(g),A=d*p*u/S,M=A*Math.cos(g),T=A*Math.sin(g),b=l*M+u;A>=0&&A<2&&Math.abs(b)<2.23?m.push([M,b,T]):m.length&&(h.push(m),m=[])}m.length&&h.push(m)}o.forEach((d,m)=>{d.visible=!!h[m]&&h[m].length>1,d.visible&&this.updateLine(d,h[m])})})}surface(){let t=new en(3.8,3.8,40,40),e=t.attributes.position;for(let a=0;a<e.count;a++){let c=e.getX(a),l=e.getY(a);e.setXYZ(a,c,.22*(c*c-l*l),l)}t.computeVertexNormals(),this.mesh(t,7773814,.5);let i=new ii(new Si(t),new un({color:Xn,transparent:!0,opacity:.16}));this.group.add(i);let s=this.mesh(new en(4,2.8),12177041,.11),r=this.line([[0,0,0],[1,1,0]],Tn,1),o=this.mesh(new nn(.055,12,8),Tn,1);this.updates.push(a=>{let c=1.15*Math.sin(a*.3);s.position.z=c;let l=[];for(let f=-1.9;f<=1.91;f+=.04)l.push([f,.22*(f*f-c*c),c]);this.updateLine(r,l);let u=.8*Math.cos(a*.4);o.position.set(u,.22*(u*u-c*c),c),this.group.rotation.y=-.25})}init2D(){this.canvas=document.createElement("canvas"),this.host.append(this.canvas),this.ctx=this.canvas.getContext("2d"),this.host.dataset.renderer="canvas2d"}resize(){let t=this.host.getBoundingClientRect();if(this.width=Math.max(1,t.width),this.height=Math.max(1,t.height),this.renderer)this.renderer.setSize(this.width,this.height,!1),this.camera.aspect=this.width/this.height,this.camera.updateProjectionMatrix();else if(this.canvas){let e=Math.min(window.devicePixelRatio||1,2);this.canvas.width=this.width*e,this.canvas.height=this.height*e,this.ctx.setTransform(e,0,0,e,0,0)}}setPhase(t){this.phase=t,this.draw()}setMotion(t){this.enabled=t&&!this.staticFallback,this.controls&&(this.controls.enableDamping=t),this.enabled?this.start():(cancelAnimationFrame(this.raf),this.raf=0,this.draw())}start(){if(this.raf||this.destroyed)return;this.last=0;let t=e=>{if(this.destroyed||!this.enabled||!this.visible){this.raf=0;return}this.time+=this.last?Math.min((e-this.last)/1e3,.08):0,this.last=e,this.draw(),this.raf=requestAnimationFrame(t)};this.raf=requestAnimationFrame(t)}draw(){this.destroyed||(this.renderer?(this.updates.forEach(t=>t(this.time)),this.controls.update(),this.renderer.render(this.scene,this.camera)):this.ctx&&this.drawCanvas())}drawCanvas(){let t=this.ctx,e=this.width,i=this.height,s=Math.min(e/500,i/400),r=e*.49,o=i*.58,a=this.time,c=this.options.primary||"#ddec9d",l="#dce2ed";t.clearRect(0,0,e,i),t.save(),t.translate(r,o),t.scale(s,s),t.lineWidth=1,t.strokeStyle="#ccddbb17";for(let d=-210;d<=210;d+=35)t.beginPath(),t.moveTo(d,-180),t.lineTo(d,140),t.stroke();for(let d=-175;d<145;d+=35)t.beginPath(),t.moveTo(-220,d),t.lineTo(220,d),t.stroke();let u=(d,m=c,x=2)=>{t.beginPath(),d.forEach((g,p)=>p?t.lineTo(g[0],g[1]):t.moveTo(g[0],g[1])),t.strokeStyle=m,t.lineWidth=x,t.stroke()},f=(d,m,x=4,g=c)=>{t.beginPath(),t.arc(d,m,x,0,Math.PI*2),t.fillStyle=g,t.fill()};if(u([[-220,35],[220,35]],"#d0dfbf35",1),u([[0,-170],[0,130]],"#d0dfbf35",1),Vf({kind:this.kind,t:a,phase:this.phase,c:t,path:u,dot:f,green:c,pale:l})){t.restore();return}let h=d=>this.kind==="join"?d<.8?d*d:1.6*d-.64:this.kind==="derivative"||this.kind==="tangents"||this.kind==="area"?d*d*d-1.4*d:this.kind==="antiderivative"?-Math.cos(d)*1.2:this.kind==="asymptote"?Math.sqrt(1+d*d):this.kind==="newton"?d*d-1:d*d;if(this.kind==="conics"){let d=[];for(let g=0;g<=180;g++){let p=g/180*Math.PI*2;d.push([Math.cos(p)*155,Math.sin(p)*84-12])}u(d),f(-105,-12),f(105,-12);let m=a*.25,x=[Math.cos(m)*155,Math.sin(m)*84-12];u([[-105,-12],x,[105,-12]],"#d2e1b67f",1),f(...x,5)}else if(this.kind==="reflection"){let d=[];for(let p=-2.2;p<=2.21;p+=.03)d.push([p*70,80-p*p*34]);u(d);let m=[0,80-4900/136],x=(.4+1.35*(.5+.5*Math.sin(a*.4)))*70,g=80-(x/70)**2*34;u([[x,-150],[x,g],m],"#c8db9dab",1.4),f(...m,5),f(x,g,4),t.fillStyle=l,t.font="13px sans-serif",t.fillText("F",12,m[1]+4)}else{let d=[];for(let m=-1.8;m<2.4;m+=.025)d.push([m*86,-h(m)*28+35]);if(this.kind==="area"&&(t.beginPath(),t.moveTo(-1.6*86,85),d.filter(m=>m[0]>-1.6*86&&m[0]<1.6*86).forEach(m=>t.lineTo(...m)),t.lineTo(1.6*86,85),t.closePath(),t.fillStyle="#d9eba51a",t.fill()),u(d),this.kind==="asymptote")t.setLineDash([5,6]),u([[-210,35+5880/86],[210,35-5880/86]],"#ccdcac90",1.2),u([[-210,35-5880/86],[210,35+5880/86]],"#ccdcac70",1.2),t.setLineDash([]);else if(this.kind==="newton"){let m=1.9,x=S=>S*S-1,g=S=>2*S,p=[];for(let S=0;S<4;S++){let A=m-x(m)/g(m);p.push([m*86,35-x(m)*28],[A*86,35],[A*86,35-x(A)*28]),m=A}u(p,"#b7ce927f",1),f(m*86,35,4)}else{let m=this.kind==="tangents"?.5:this.kind==="join"?.8:.65,x=.12+1.12*(.5+.5*Math.cos(a*.5+this.phase)),g=h(m),p=h(m+x),S=(h(m+.001)-h(m-.001))/.002,A=(p-g)/x,M=[[-1.7*86,35-(g+S*(-1.7-m))*28],[2.3*86,35-(g+S*(2.3-m))*28]];t.setLineDash([5,6]),u(M,"#d2e1bd75",1),t.setLineDash([]),u([[-1.7*86,35-(g+A*(-1.7-m))*28],[2.3*86,35-(g+A*(2.3-m))*28]],"#c8dc9cb0",1.4),f(m*86,35-g*28,4),f((m+x)*86,35-p*28,5),t.beginPath(),t.arc((m+x)*86,35-p*28,12,0,Math.PI*2),t.strokeStyle="#dae9ad55",t.lineWidth=1,t.stroke()}}t.restore()}dispose(){this.destroyed=!0,cancelAnimationFrame(this.raf),this.resizeObserver?.disconnect(),this.visibility?.disconnect(),this.controls?.dispose(),this.scene&&this.scene.traverse(t=>{t.geometry?.dispose(),t.material&&(Array.isArray(t.material)?t.material.forEach(e=>e.dispose()):t.material.dispose())}),this.renderer?.dispose(),this.renderer?.forceContextLoss(),this.host.replaceChildren()}};var Nn={calculus:{label:"\uBBF8\uC801\uBD84\u2160",mark:"f\u2032",title:"\uBCC0\uD654\uB97C \uC77D\uB2E4.",description:"\uAC00\uAE4C\uC6CC\uC9C0\uB294 \uAC12, \uC21C\uAC04\uC758 \uAE30\uC6B8\uAE30, \uC313\uC774\uB294 \uC591\uC5D0\uC11C \uC9C8\uBB38\uC744 \uCC3E\uC2B5\uB2C8\uB2E4.",kind:"secant",color:"#bf4630",light:"#ffe3c6",hue:.055},geometry:{label:"\uAE30\uD558",mark:"\u2220",title:"\uACF5\uAC04\uC744 \uBCF4\uB2E4.",description:"\uAC70\uB9AC\uC640 \uBC29\uD5A5, \uD3C9\uBA74\uACFC \uC785\uCCB4 \uC0AC\uC774\uC5D0\uC11C \uBCF4\uC774\uC9C0 \uC54A\uB358 \uAD00\uACC4\uB97C \uBC1C\uACAC\uD569\uB2C8\uB2E4.",kind:"ellipsoid",color:"#4c5fd0",light:"#d5dcff",hue:.63},economics:{label:"\uACBD\uC81C\uC218\uD559",mark:"%",title:"\uC120\uD0DD\uC744 \uB530\uC9C0\uB2E4.",description:"\uC218\uC640 \uBAA8\uD615\uC73C\uB85C \uC77C\uC0C1\uC758 \uC120\uD0DD\uACFC \uADFC\uC0AC\uC758 \uC624\uCC28\uB97C \uC0B4\uD3B4\uBD05\uB2C8\uB2E4.",kind:"compound",color:"#12735d",light:"#c5efdf",hue:.43}},Ti=n=>n.id.slice(0,4);function qh(n,t="all",e="all"){return n.filter(i=>(t==="all"||i.subjectKey===t)&&(e==="all"||Ti(i)===e))}function Wf(n,t=7){return Math.min(t-1,Math.max(0,Number.isFinite(n)?Math.trunc(n):0))}function Xf(n,t){return Math.abs(n)>=70&&Math.abs(n)>Math.abs(t)*1.5?n<0?1:-1:0}function Yh(n){try{let t=new URL(n?.url);return t.protocol==="https:"&&!t.username&&!t.password?t.href:null}catch{return null}}function Wl(n,t=360){let e=String(n||"").trim();if(e.length<=t)return e;let i=e.lastIndexOf("\uB2E4.",t);return i<t*.55?i=t-1:i+=1,e.slice(0,i+1)+"\u2026"}function qf(n){let t=n.raw;return[{key:"question",label:"\uC9C8\uBB38",title:"\uBB34\uC5C7\uC774 \uAD81\uAE08\uD588\uC744\uAE4C.",intro:n.question,primary:t.hypothesis,fields:[["\uCC98\uC74C \uC138\uC6B4 \uC608\uC0C1",t.hypothesis]]},{key:"method",label:"\uBC29\uBC95",title:"\uC5B4\uB5BB\uAC8C \uC54C\uC544\uBCF4\uAE30\uB85C \uD588\uC744\uAE4C.",intro:"\uAC19\uAC8C \uB458 \uAC83\uACFC \uBC14\uAFC0 \uAC83. \uD559\uC0DD\uC774 \uC120\uD0DD\uD55C \uBC29\uBC95\uC744 \uC77D\uC2B5\uB2C8\uB2E4.",primary:t.plan||t.conditions,fields:[["\uD0D0\uAD6C \uACC4\uD68D",t.plan],["\uBC14\uAFC0 \uC870\uAC74\uACFC \uC790\uB8CC",t.conditions]]},{key:"process",label:"\uC218\uD589",title:"\uC5B4\uB5A4 \uC2DC\uB3C4\uB97C \uD588\uC744\uAE4C.",intro:"\uC544\uB798 \uB0B4\uC6A9\uC740 \uD559\uC0DD\uC774 \uC800\uC7A5\uD55C \uC218\uD589 \uAE30\uB85D\uC785\uB2C8\uB2E4.",primary:t.process,fields:[["\uC218\uD589 \uACFC\uC815",t.process]]},{key:"revision",label:"\uC218\uC815",title:"\uC0DD\uAC01\uC744 \uBC14\uAFBC \uC21C\uAC04.",intro:"\uB73B\uB300\uB85C \uB418\uC9C0 \uC54A\uC558\uB358 \uC7A5\uBA74\uACFC, \uADF8\uB2E4\uC74C\uC758 \uC120\uD0DD\uC744 \uC77D\uC2B5\uB2C8\uB2E4.",primary:t.revision,fields:[["\uC2E4\uD328\uC640 \uC218\uC815",t.revision]]},{key:"evidence",label:"\uADFC\uAC70",title:"\uBB34\uC5C7\uC744 \uADFC\uAC70\uB85C \uB0A8\uACBC\uC744\uAE4C.",intro:"\uACC4\uC0B0\uACFC \uAD00\uCC30, \uC2E4\uD589\uACFC \uD574\uC11D\uC744 \uD559\uC0DD\uC758 \uAE30\uB85D\uC5D0\uC11C \uD655\uC778\uD569\uB2C8\uB2E4.",primary:t.evidence,fields:[["\uACB0\uACFC\uC640 \uADFC\uAC70",t.evidence],["\uC218\uD559\uC801 \uD574\uC11D",t.interpretation]]},{key:"conclusion",label:"\uACB0\uB860",title:"\uC54C\uAC8C \uB41C \uAC83\uACFC, \uB0A8\uC740 \uAC83.",intro:"\uD558\uB098\uC758 \uACB0\uB860\uC774 \uB2E4\uC74C \uC9C8\uBB38\uC758 \uCD9C\uBC1C\uC810\uC774 \uB429\uB2C8\uB2E4.",primary:t.conclusion,fields:[["\uACB0\uB860",t.conclusion],["\uD55C\uACC4\uC640 \uC8FC\uC758\uD560 \uC810",t.limits],["\uC0C8\uB85C\uC6B4 \uC9C8\uBB38",t.next]]},{key:"artifact",label:"\uC791\uD488",title:"\uC774\uC81C, \uC791\uD488 \uC55E\uC73C\uB85C.",intro:"\uD559\uC0DD\uC774 \uB9CC\uB4E0 \uC6F9\uC571\uC744 \uC6D0\uB798 \uBAA8\uC2B5\uC73C\uB85C \uB9CC\uB0A9\uB2C8\uB2E4.",primary:"",fields:[]}]}var pn=document.getElementById("main"),Zf=matchMedia("(prefers-reduced-motion: reduce)"),It={data:null,subject:"all",student:"all",page:"",work:null,motion:!Zf.matches,scenes:[],observers:[],listeners:[],slide:0},ae=n=>document.getElementById(n),Me=n=>String(n??"").replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t]),Zh=n=>String(n||"").split(`
`).map(t=>"<span>"+Me(t)+"</span>").join(""),dr=n=>Nn[n.subjectKey]?.label||n.subject,vy=n=>[...new Set(n.map(dr))].join(" \xB7 "),My=n=>n.topicMismatch?"\uC8FC\uC81C \uC815\uB9AC \uC911":n.recordComplete||n.status==="\uCD5C\uC885 \uC81C\uCD9C"?"\uD0D0\uAD6C \uAE30\uB85D \uC644\uB8CC":"\uC791\uC131 \uC911",Sy=n=>String(n||"").split(/\n\s*\n/).filter(Boolean).map(t=>"<p>"+Me(t).replace(/\n/g,"<br>")+"</p>").join(""),by=(n,t=360)=>n?'<div class="source-label">\uD559\uC0DD \uAE30\uB85D \xB7 \uBC1C\uCDCC</div><div class="student-excerpt">'+Sy(Wl(n,t))+"</div>":'<p class="pending-text">\uC774 \uBD80\uBD84\uC740 \uC544\uC9C1 \uAE30\uB85D\uC744 \uAE30\uB2E4\uB9AC\uACE0 \uC788\uC2B5\uB2C8\uB2E4.</p>';function Ty(n){let t=n.filter(([,e])=>e);return t.length?'<details class="source-details"><summary>\uC6D0\uBB38 \uC804\uCCB4 \uD3BC\uCCD0\uBCF4\uAE30 <span aria-hidden="true">\uFF0B</span></summary>'+t.map(([e,i])=>'<section class="original-field"><h4>'+Me(e)+'</h4><div class="original-text">'+Me(i)+"</div></section>").join("")+"</details>":""}function qn(n,t,e,i){n.addEventListener(t,e,i),It.listeners.push(()=>n.removeEventListener(t,e,i))}function Jf(){It.listeners.forEach(n=>n()),It.listeners=[],It.scenes.forEach(n=>n.dispose()),It.scenes=[],It.observers.forEach(n=>n.disconnect()),It.observers=[],It.work=null}function $f(n,t,e="geometry"){if(!n)return null;try{let i=Nn[e]||Nn.geometry,s=new Gl(n,t,{motion:It.motion,primary:i.light,hue:i.hue});return It.scenes.push(s),s}catch{return n.innerHTML=ho(t),null}}function Kf(n){if(!It.motion)return;let t=new IntersectionObserver(e=>e.forEach(({target:i,isIntersecting:s})=>{if(s){try{Fo(i,{opacity:[.3,1],translateY:[16,0],duration:500,ease:"out(3)"})}catch{}t.unobserve(i)}}),{threshold:.08});n.querySelectorAll(".reveal").forEach(e=>t.observe(e)),It.observers.push(t)}function uo(){document.body.classList.toggle("reduced-motion",!It.motion);let n=ae("motionButton");n.setAttribute("aria-pressed",String(!It.motion)),n.lastElementChild.textContent=It.motion?"\uBAA8\uC158 \uC904\uC774\uAE30":"\uBAA8\uC158 \uCF1C\uAE30",It.scenes.forEach(t=>t.setMotion(It.motion))}ae("motionButton").addEventListener("click",()=>{It.motion=!It.motion,uo()});Zf.addEventListener("change",n=>{It.motion=!n.matches,uo()});document.querySelector(".skip-link").addEventListener("click",n=>{n.preventDefault(),pn.focus({preventScroll:!0}),pn.scrollIntoView({behavior:"auto"})});function Ey(){pn.querySelectorAll("[data-math]").forEach(n=>{try{window.katex.render(n.dataset.math,n,{throwOnError:!0,strict:"ignore",trust:!1,output:"htmlAndMathml"})}catch{n.textContent=n.dataset.math}}),window.katex&&pn.querySelectorAll(".student-excerpt,.chapter-intro,.chapter-quote,.closing-note,.next-question").forEach(n=>{let t=document.createTreeWalker(n,NodeFilter.SHOW_TEXT),e=[],i;for(;i=t.nextNode();)e.push(i);for(let s of e){let r=/\\\(([\s\S]+?)\\\)|\\\[([\s\S]+?)\\\]|\$\$([^$]+?)\$\$|\$([^$\n]+?)\$/g,o=s.textContent,a=document.createDocumentFragment(),c,l=0,u=!1;for(;c=r.exec(o);){a.append(document.createTextNode(o.slice(l,c.index)));let f=document.createElement("span");try{window.katex.render(c[1]||c[2]||c[3]||c[4],f,{throwOnError:!0,strict:"ignore",trust:!1,output:"htmlAndMathml"}),a.append(f)}catch{a.append(document.createTextNode(c[0]))}l=r.lastIndex,u=!0}u&&(a.append(document.createTextNode(o.slice(l))),s.replaceWith(a))}})}function jf(n){document.body.dataset.subject=n,document.querySelectorAll("[data-nav-subject]").forEach(t=>{t.dataset.navSubject===n?t.setAttribute("aria-current","page"):t.removeAttribute("aria-current")})}function wy(n,t){let e=Nn[n],i=t.filter(s=>s.subjectKey===n).length;return'<a class="subject-room reveal" data-subject="'+n+'" href="#/collection?subject='+n+'"><div class="room-art">'+ho(e.kind)+'<span class="room-mark" aria-hidden="true">'+e.mark+'</span></div><div class="room-copy"><div class="room-meta"><strong>'+e.label+"</strong><span>"+i+"\uAC1C\uC758 \uD0D0\uAD6C</span></div><h3>"+e.title+"</h3><p>"+e.description+'</p><span class="room-entry">\uC774 \uACFC\uBAA9 \uB458\uB7EC\uBCF4\uAE30 <b aria-hidden="true">\u2197</b></span></div></a>'}function Ay(n,t){return'<a class="work-card reveal" data-subject="'+n.subjectKey+'" href="#/work/'+n.id+'" aria-label="'+Me(n.name+" \xB7 "+dr(n)+" \xB7 "+n.title.replace(/\n/g," "))+'"><div class="card-art">'+ho(n.kind,t)+'<span class="card-number">'+String(t+1).padStart(2,"0")+'</span></div><div class="card-copy"><div class="card-meta"><span class="subject-mark">'+Nn[n.subjectKey].mark+"</span><span>"+dr(n)+" \xB7 "+Me(n.name)+"</span></div><h3>"+Zh(n.title)+"</h3><p>"+Me(n.caption)+'</p><div class="card-bottom"><span>'+Me(n.tags.slice(0,2).join(" \xB7 "))+'</span><b aria-hidden="true">\u2197</b></div></div></a>'}function Xl(){let n=It.data.works,t=qh(n,It.subject,It.student),e=qh(n,It.subject),i=[...new Map(e.map(s=>[Ti(s),s])).values()].sort((s,r)=>s.name.localeCompare(r.name,"ko"));ae("studentFilter").innerHTML='<option value="all">\uBAA8\uB4E0 \uD0D0\uAD6C\uC790</option>'+i.map(s=>'<option value="'+Ti(s)+'">'+Me(s.name)+"</option>").join(""),ae("studentFilter").value=It.student,ae("workGrid").innerHTML=t.length?t.map(s=>Ay(s,n.indexOf(s))).join(""):'<p class="no-results">\uC774 \uC870\uAC74\uC5D0 \uB9DE\uB294 \uD0D0\uAD6C\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4. \uB2E4\uB978 \uACFC\uBAA9\uC774\uB098 \uD0D0\uAD6C\uC790\uB97C \uC120\uD0DD\uD574 \uC8FC\uC138\uC694.</p>',ae("collectionTitle").textContent=It.subject==="all"?"\uC11C\uB85C \uB2E4\uB978 \uC9C8\uBB38\uC744 \uB9CC\uB098\uB2E4.":Nn[It.subject].label+"\uC758 \uC9C8\uBB38\uB4E4.",ae("resultCount").textContent=t.length+"\uAC1C\uC758 \uD0D0\uAD6C",document.querySelectorAll("[data-filter]").forEach(s=>s.setAttribute("aria-pressed",String(s.dataset.filter===It.subject))),jf(It.subject),Kf(ae("workGrid"))}function Cy(){Jf(),It.page="home",document.body.classList.remove("work-page"),document.title="\uC9C8\uBB38\uC774 \uB0A8\uAE34 \uADA4\uC801 \xB7 \uC218\uD559 \uD0D0\uAD6C\uC804";let n=It.data.works,t=[...new Map(n.map(e=>[Ti(e),e])).values()].sort((e,i)=>e.name.localeCompare(i.name,"ko"));if(pn.innerHTML='<section class="hero" aria-labelledby="exhibitionTitle"><div class="hero-copy"><p class="eyebrow">2026 \uC218\uD559 \uD0D0\uAD6C\uC804</p><h1 id="exhibitionTitle"><span>\uD558\uB098\uC758 \uC9C8\uBB38\uC774</span><span>\uC790\uAE30\uB9CC\uC758 <em>\uBAA8\uC591</em>\uC744</span><span>\uAC16\uAE30\uAE4C\uC9C0.</span></h1><p class="hero-intro">'+t.length+"\uBA85\uC774 \uB0A8\uAE34 "+n.length+'\uAC1C\uC758 \uD0D0\uAD6C.<br>\uC815\uB2F5\uC5D0 \uB2FF\uAE30 \uC804\uC758 \uACE0\uBBFC\uACFC,<br>\uC0DD\uAC01\uC744 \uBC14\uAFBC \uC21C\uAC04\uC744 \uD568\uAED8 \uC77D\uC2B5\uB2C8\uB2E4.</p><a class="primary-link" href="#/subjects">\uC5B4\uB5A4 \uC9C8\uBB38\uBD80\uD130 \uB9CC\uB098 \uBCFC\uAE4C\uC694 <span aria-hidden="true">\u2193</span></a><div class="hero-meta"><span><b>'+t.length+"</b> \uD0D0\uAD6C\uC790</span><span><b>"+n.length+'</b> \uD0D0\uAD6C \uAE30\uB85D</span><span>\uC138 \uAC1C\uC758 \uACFC\uBAA9</span></div></div><div class="hero-art"><div id="heroScene" class="scene-host" role="img" aria-label="\uD3C9\uBA74\uACFC \uAD6C\uAC00 \uB9CC\uB098\uBA70 \uB2E8\uBA74\uC774 \uB2EC\uB77C\uC9C0\uB294 \uC804\uC2DC \uD574\uC124 \uB3C4\uD574"></div><span class="art-caption">\uAC19\uC740 \uB300\uC0C1\uB3C4, \uC9C8\uBB38\uC5D0 \uB530\uB77C \uB2E4\uB974\uAC8C \uBCF4\uC785\uB2C8\uB2E4.</span><span class="hero-orbit" aria-hidden="true">\uC9C8\uBB38 \xB7 \uC2DC\uB3C4 \xB7 \uC218\uC815 \xB7 \uBC1C\uACAC</span></div></section><section class="section-shell subjects-section" id="subjects" aria-labelledby="subjectsTitle"><div class="section-heading"><div><p class="eyebrow">\uACFC\uBAA9\uC73C\uB85C \uB4E4\uC5B4\uAC00\uAE30</p><h2 id="subjectsTitle">\uC11C\uB85C \uB2E4\uB978 \uAD00\uC810,<br>\uC774\uC5B4\uC9C0\uB294 \uD638\uAE30\uC2EC.</h2></div><p>\uBBF8\uC801\uBD84\uC740 \uBCC0\uD654\uB85C, \uAE30\uD558\uB294 \uACF5\uAC04\uC73C\uB85C,<br>\uACBD\uC81C\uC218\uD559\uC740 \uC120\uD0DD\uACFC \uBAA8\uD615\uC73C\uB85C \uC9C8\uBB38\uD569\uB2C8\uB2E4.</p></div><div class="subject-rooms">'+Object.keys(Nn).map(e=>wy(e,n)).join("")+'</div></section><section class="section-shell collection" id="collection" aria-labelledby="collectionTitle"><div class="section-heading"><div><p class="eyebrow">\uD0D0\uAD6C \uAE30\uB85D \uBAA8\uC544 \uBCF4\uAE30</p><h2 id="collectionTitle">\uC11C\uB85C \uB2E4\uB978 \uC9C8\uBB38\uC744 \uB9CC\uB098\uB2E4.</h2></div><p>\uC791\uD488\uC744 \uACE0\uB974\uBA74 \uC9C8\uBB38\uBD80\uD130 \uACB0\uB860\uAE4C\uC9C0<br>\uC77C\uACF1 \uC7A5\uC73C\uB85C \uB118\uACA8 \uC77D\uC744 \uC218 \uC788\uC2B5\uB2C8\uB2E4.</p></div><div class="filter-bar"><div class="subject-tabs" role="group" aria-label="\uACFC\uBAA9 \uC120\uD0DD"><button type="button" data-filter="all" aria-pressed="true">\uC804\uCCB4 <span>'+n.length+"</span></button>"+Object.entries(Nn).map(([e,i])=>'<button type="button" data-filter="'+e+'" data-subject="'+e+'" aria-pressed="false"><span class="filter-mark" aria-hidden="true">'+i.mark+"</span>"+i.label+" <span>"+n.filter(s=>s.subjectKey===e).length+"</span></button>").join("")+'</div><label class="student-select" for="studentFilter"><span>\uD0D0\uAD6C\uC790</span><select id="studentFilter"></select></label></div><div class="collection-summary"><span id="resultCount" aria-live="polite"></span><p>\uD559\uC0DD\uC758 \uAE30\uB85D\uACFC \uC804\uC2DC \uD574\uC124\uC740 \uAD6C\uBD84\uD574 \uD45C\uC2DC\uD569\uB2C8\uB2E4.</p></div><div class="work-grid" id="workGrid"></div></section><section class="section-shell students-section" id="students" aria-labelledby="studentsTitle"><div class="section-heading"><div><p class="eyebrow">\uC9C8\uBB38\uC758 \uC8FC\uC778\uB4E4</p><h2 id="studentsTitle">\uD55C \uC0AC\uB78C\uC758 \uAD00\uC2EC\uC744<br>\uD568\uAED8 \uC77D\uC5B4 \uBCF4\uC138\uC694.</h2></div><p>\uC774\uB984\uC744 \uACE0\uB974\uBA74 \uADF8 \uD559\uC0DD\uC774 \uB0A8\uAE34<br>\uD0D0\uAD6C\uB4E4\uC744 \uD55C\uACF3\uC5D0\uC11C \uB9CC\uB0A0 \uC218 \uC788\uC2B5\uB2C8\uB2E4.</p></div><div class="student-list">'+t.map((e,i)=>'<a class="student-row" href="#/collection?student='+Ti(e)+'"><span class="student-number">'+String(i+1).padStart(2,"0")+"</span><span><strong>"+Me(e.name)+"</strong><small>"+Me(vy(n.filter(s=>Ti(s)===Ti(e))))+'</small></span><span class="student-arrow" aria-hidden="true">\u2197</span></a>').join("")+"</div></section>",$f(ae("heroScene"),"hero","geometry"),Xl(),uo(),Kf(pn),pn.querySelectorAll("[data-filter]").forEach(e=>qn(e,"click",()=>{It.subject=e.dataset.filter,It.student="all";let i="#/collection"+(It.subject==="all"?"":"?subject="+It.subject);location.hash===i?Xl():location.hash=i})),qn(ae("studentFilter"),"change",e=>{It.student=e.target.value,Xl()}),It.motion)try{pc({defaults:{duration:650,ease:"out(3)"}}).add(pn.querySelectorAll(".hero h1>span"),{opacity:[0,1],translateY:[20,0],delay:gc(85)},0).add(pn.querySelectorAll(".hero-intro,.hero-meta"),{opacity:[0,1],translateY:[10,0]},180)}catch{}}function Ry(n){let t=n.artifact.status,e=Yh(n.artifact),i,s,r;return t==="linked"&&e?(i="\uC9C8\uBB38\uC744 \uC9C1\uC811 \uC6C0\uC9C1\uC5EC \uBCF4\uC138\uC694.",s="\uD559\uC0DD\uC774 \uC81C\uCD9C\uD55C \uC6F9\uC571\uC785\uB2C8\uB2E4. \uC55E\uC5D0\uC11C \uC77D\uC740 \uC870\uAC74\uC744 \uBC14\uAFB8\uBA70 \uAE30\uB85D \uC18D \uC124\uBA85\uACFC \uD654\uBA74\uC758 \uACB0\uACFC\uB97C \uD568\uAED8 \uC0B4\uD3B4\uBCF4\uC138\uC694.",r='<a class="button-solid" href="'+Me(e)+'" target="_blank" rel="noopener noreferrer">\uD559\uC0DD \uC6F9\uC571 \uC5F4\uAE30 <span aria-hidden="true">\u2197</span></a><button class="button-line" id="embedButton" type="button">\uC804\uC2DC \uC548\uC5D0\uC11C \uCCB4\uD5D8\uD558\uAE30</button>'):t==="unavailable"?(i="\uC791\uD488\uC758 \uC0C8 \uC8FC\uC18C\uB97C \uAE30\uB2E4\uB9BD\uB2C8\uB2E4.",s="\uD604\uC7AC \uC81C\uCD9C \uC8FC\uC18C\uC5D0 \uC5F0\uACB0\uB418\uC9C0 \uC54A\uC544 \uB2E4\uC2DC \uD655\uC778\uD558\uACE0 \uC788\uC2B5\uB2C8\uB2E4. \uD0D0\uAD6C \uAE30\uB85D\uC740 \uBA3C\uC800 \uC804\uC2DC\uD558\uACE0, \uC0C8 \uC8FC\uC18C\uB098 \uC6D0\uBCF8 \uD30C\uC77C\uC744 \uBC1B\uC73C\uBA74 \uCCB4\uD5D8\uC744 \uC5F0\uACB0\uD569\uB2C8\uB2E4.",r='<span class="artifact-status">\uC791\uD488 \uC8FC\uC18C \uD655\uC778 \uC911</span>'):t==="awaiting-file"?(i="\uC791\uD488\uC758 \uC6D0\uBCF8\uC744 \uBAA8\uC73C\uACE0 \uC788\uC2B5\uB2C8\uB2E4.",s="\uD604\uC7AC \uC81C\uCD9C \uC8FC\uC18C\uB294 \uD559\uC0DD \uAE30\uAE30 \uC548\uC758 \uD30C\uC77C\uC744 \uAC00\uB9AC\uD0B5\uB2C8\uB2E4. HTML \uC6D0\uBCF8\uC744 \uC5F0\uACB0\uD558\uBA74 \uC774 \uC790\uB9AC\uC5D0\uC11C \uC791\uD488\uC744 \uCCB4\uD5D8\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4.",r='<span class="artifact-status">\uC6D0\uBCF8 \uD30C\uC77C \uC218\uD569 \uC911</span>'):(i="\uC774 \uC790\uB9AC\uC5D0\uC11C \uC791\uD488\uC744 \uB9CC\uB098\uAC8C \uB429\uB2C8\uB2E4.",s="\uD0D0\uAD6C \uAE30\uB85D\uC744 \uBA3C\uC800 \uC804\uC2DC\uD588\uC2B5\uB2C8\uB2E4. \uD559\uC0DD\uC774 \uB9CC\uB4E0 \uC6F9\uC571\uC774\uB098 \uC790\uB8CC\uAC00 \uC900\uBE44\uB418\uBA74 \uC774 \uC790\uB9AC\uC5D0 \uC5F0\uACB0\uD569\uB2C8\uB2E4.",r='<span class="artifact-status">\uC6F9\uC571 \uC900\uBE44 \uC911</span>'),'<div class="artifact-card"><span class="artifact-symbol" aria-hidden="true">\u2197</span><h3>'+i+"</h3><p>"+s+'</p><div class="artifact-actions">'+r+"</div></div>"+(n.recordNote?'<div class="closing-note"><strong>\uD568\uAED8 \uC77D\uC5B4 \uC8FC\uC138\uC694</strong><p>'+Me(n.recordNote)+"</p></div>":"")}function Py(n,t,e){let i=n.key==="artifact"?Ry(e):by(n.primary,n.key==="conclusion"?300:360);return n.key==="revision"&&n.primary&&(i='<div class="source-label">\uD559\uC0DD\uC774 \uB0A8\uAE34 \uC2DC\uB3C4\uC640 \uC218\uC815 \xB7 \uBC1C\uCDCC</div><blockquote class="chapter-quote">'+Me(Wl(n.primary,310))+"</blockquote>"),n.key==="evidence"&&e.recordNote&&(i+='<div class="closing-note"><strong>\uAE30\uB85D\uC744 \uC77D\uB294 \uAD00\uC810</strong><p>'+Me(e.recordNote)+"</p></div>"),n.key==="conclusion"&&(i+='<div class="closing-note"><strong>\uC804\uC2DC \uD574\uC124</strong><p>'+Me(e.readingNote)+"</p></div>"+(e.raw.next?'<div class="next-question"><strong>\uC774\uC5B4 \uAC00\uACE0 \uC2F6\uC740 \uC9C8\uBB38</strong><p>'+Me(Wl(e.raw.next,170))+"</p></div>":"")),'<article class="deck-slide" role="tabpanel" id="slide-'+t+'" aria-labelledby="chapter-tab-'+t+'" tabindex="-1" '+(t?"hidden":"")+'><div class="chapter-number">'+String(t+1).padStart(2,"0")+" <span>/ 07</span></div><h2>"+n.title+'</h2><p class="chapter-intro">'+Me(n.intro)+"</p>"+i+Ty(n.fields)+"</article>"}function Iy(n){Jf(),It.page="work",It.work=n,It.slide=-1,document.body.classList.add("work-page"),jf(n.subjectKey),document.title=n.title.replace(/\n/g," ")+" \xB7 "+n.name+" \xB7 \uC218\uD559 \uD0D0\uAD6C\uC804";let t=qf(n),e=It.data.works.filter(f=>f.subjectKey===n.subjectKey),i=e[(e.indexOf(n)+1)%e.length],s="#/collection?subject="+n.subjectKey,r=e.length>1?"#/work/"+i.id:"#/subjects",o=e.length>1?"\uAC19\uC740 \uACFC\uBAA9\uC758 \uB2E4\uC74C \uC9C8\uBB38 \xB7 "+i.name:"\uB2E4\uB978 \uACFC\uBAA9\uC758 \uC9C8\uBB38\uB3C4 \uB9CC\uB098 \uBCF4\uC138\uC694",a=e.length>1?i.title:"\uB2E4\uC74C \uD638\uAE30\uC2EC\uC744 \uCC3E\uC544\uBCFC\uAE4C\uC694.";pn.innerHTML='<header class="work-heading"><a class="back-link" href="'+s+'">\u2190 '+dr(n)+' \uD0D0\uAD6C\uB85C \uB3CC\uC544\uAC00\uAE30</a><div class="work-byline"><span class="subject-badge">'+Nn[n.subjectKey].mark+" "+dr(n)+"</span><strong>"+Me(n.name)+"</strong><span>"+My(n)+"</span></div><h1>"+Zh(n.title)+'</h1><p class="work-caption">'+Me(n.caption)+'</p><div class="work-tags">'+n.tags.map(f=>"<span>"+Me(f)+"</span>").join("")+'</div></header><section class="story-deck" id="storyDeck" aria-label="'+Me(n.name)+'\uC758 \uD0D0\uAD6C \uC77C\uACF1 \uC7A5"><div class="deck-tab-list" id="deckTabs" role="tablist" aria-label="\uD0D0\uAD6C \uACFC\uC815">'+t.map((f,h)=>'<button id="chapter-tab-'+h+'" role="tab" aria-controls="slide-'+h+'" aria-selected="'+(h===0)+'" tabindex="'+(h===0?"0":"-1")+'" data-slide="'+h+'"><b>'+String(h+1).padStart(2,"0")+"</b>"+f.label+"</button>").join("")+'</div><div class="deck-reader" id="deckReader"><div class="deck-copy">'+t.map((f,h)=>Py(f,h,n)).join("")+'</div><aside class="deck-figure" aria-label="\uC9C8\uBB38\uC744 \uC124\uBA85\uD558\uB294 \uC804\uC2DC \uB3C4\uD574"><div class="figure-surface"><div class="figure-label"><span>\uC9C8\uBB38\uC744 \uB530\uB77C\uAC00\uB294 \uB3C4\uD574</span><span aria-hidden="true">'+Nn[n.subjectKey].mark+'</span></div><div id="storyScene" class="scene-host" role="img" aria-label="'+Me(n.mathLabel)+'\uB97C \uBCF4\uC5EC \uC8FC\uB294 \uC804\uC2DC \uD574\uC124 \uB3C4\uD574"></div><div class="figure-credit">\uD559\uC0DD \uC791\uD488\uC740 \uB9C8\uC9C0\uB9C9 \uC7A5\uC5D0\uC11C \uB9CC\uB0A9\uB2C8\uB2E4.</div></div><div class="formula-wrap"><div data-math="'+Me(n.math)+'"></div><p>'+Me(n.mathLabel)+'</p></div></aside></div><section class="embedded-work" id="embeddedWork" aria-label="\uD559\uC0DD \uC6F9\uC571 \uC6D0\uBCF8" hidden><div class="embed-bar"><span>\uD559\uC0DD\uC774 \uB9CC\uB4E0 \uC6F9\uC571 \xB7 \uC6D0\uBCF8 \uD654\uBA74</span><button id="closeEmbed" type="button">\uCCB4\uD5D8 \uB2EB\uAE30 \u2191</button></div><div id="iframeMount"></div></section><div class="deck-controls"><button class="deck-previous" id="previousSlide" type="button"><span aria-hidden="true">\u2190</span> \uC774\uC804</button><div class="deck-position"><p id="slidePosition" aria-live="polite"></p><div class="deck-progress" aria-hidden="true"><span id="deckProgress"></span></div></div><button class="deck-next" id="nextSlide" type="button">\uB2E4\uC74C <span aria-hidden="true">\u2192</span></button></div><p class="deck-instruction">\uBC84\uD2BC\uC774\uB098 \u2190 \u2192 \uBC29\uD5A5\uD0A4\uB85C \uB118\uAE41\uB2C8\uB2E4. \uBAA8\uBC14\uC77C\uC5D0\uC11C\uB294 \uAE00 \uC601\uC5ED\uC744 \uC88C\uC6B0\uB85C \uBC00\uC5B4 \uBCF4\uC138\uC694.</p></section><section class="work-epilogue"><p>\uD559\uC0DD\uC774 \uC800\uC7A5\uD55C \uC6D0\uBB38\uC744 \uBC14\uD0D5\uC73C\uB85C \uAD6C\uC131\uD588\uC2B5\uB2C8\uB2E4.<br>\uC804\uC2DC \uB3C4\uD574\uB294 \uD559\uC0DD \uC791\uD488\uACFC \uAD6C\uBD84\uD55C \uD574\uC124\uC774\uBA70, \uC6F9\uC571 \uC900\uBE44 \uC0C1\uD0DC\uB294 \uB9C8\uC9C0\uB9C9 \uC7A5\uC5D0\uC11C \uD655\uC778\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4.</p><span>\uAE30\uB85D \uC218\uC815 \xB7 '+Me(n.updated)+'</span></section><a class="next-work" href="'+r+'"><div><span>'+Me(o)+"</span><h2>"+Zh(a)+'</h2></div><b aria-hidden="true">\u2197</b></a>';let c=$f(ae("storyScene"),n.kind,n.subjectKey);Ey(),uo();let l=(f,{focus:h=!1}={})=>{let d=Wf(f,t.length);if(d===It.slide)return;let m=It.slide;It.slide=d,pn.querySelectorAll(".deck-slide").forEach((p,S)=>{p.hidden=S!==d}),pn.querySelectorAll("[data-slide]").forEach((p,S)=>{p.setAttribute("aria-selected",String(S===d)),p.tabIndex=S===d?0:-1}),ae("previousSlide").disabled=d===0,ae("nextSlide").disabled=d===t.length-1,ae("slidePosition").textContent=String(d+1).padStart(2,"0")+" / 07 \xB7 "+t[d].label,ae("deckProgress").style.width=(d+1)/t.length*100+"%",c?.setPhase(Math.min(3,d)),ae("embeddedWork").hidden=d!==6||!ae("iframeMount").firstChild;let x=ae("chapter-tab-"+d),g=ae("deckTabs");if(g.scrollTo({left:x.offsetLeft-g.clientWidth/2+x.clientWidth/2,behavior:It.motion?"smooth":"auto"}),h&&x.focus({preventScroll:!0}),m>=0){let p=ae("slide-"+d);if(It.motion)try{Fo(p,{opacity:[.5,1],translateX:[d>m?24:-24,0],duration:350,ease:"out(3)"})}catch{}ae("storyDeck").getBoundingClientRect().top<70&&ae("storyDeck").scrollIntoView({block:"start",behavior:It.motion?"smooth":"auto"})}};pn.querySelectorAll("[data-slide]").forEach(f=>qn(f,"click",()=>l(Number(f.dataset.slide)))),qn(ae("previousSlide"),"click",()=>l(It.slide-1)),qn(ae("nextSlide"),"click",()=>l(It.slide+1)),qn(document,"keydown",f=>{if(f.altKey||f.ctrlKey||f.metaKey||f.target.closest?.("input,textarea,select,[contenteditable],iframe"))return;let h=f.key==="ArrowRight"?1:f.key==="ArrowLeft"?-1:0;h&&(f.preventDefault(),l(It.slide+h,{focus:!!f.target.closest?.('[role="tablist"]')}))});let u=null;qn(ae("deckReader"),"touchstart",f=>{let h=f.touches[0];u=h&&h.clientX>24&&h.clientX<innerWidth-24&&!f.target.closest("canvas,svg,.deck-figure,button,a,summary,details,input,iframe")?{x:h.clientX,y:h.clientY}:null},{passive:!0}),qn(ae("deckReader"),"touchend",f=>{if(!u)return;let h=f.changedTouches[0],d=Xf(h.clientX-u.x,h.clientY-u.y);u=null,d&&l(It.slide+d)},{passive:!0}),qn(ae("deckReader"),"touchcancel",()=>{u=null},{passive:!0}),ae("embedButton")&&qn(ae("embedButton"),"click",()=>{let f=ae("iframeMount");if(!f.firstChild){let h=document.createElement("iframe");h.title=n.name+"\uC758 "+dr(n)+" \uC6F9\uC571",h.setAttribute("sandbox","allow-scripts allow-same-origin allow-forms"),h.referrerPolicy="no-referrer",h.src=Yh(n.artifact),f.append(h)}ae("embeddedWork").hidden=!1,ae("embeddedWork").scrollIntoView({block:"start",behavior:It.motion?"smooth":"auto"})}),qn(ae("closeEmbed"),"click",()=>{ae("iframeMount").replaceChildren(),ae("embeddedWork").hidden=!0,ae("embedButton")?.focus()}),l(0)}function Yf(){let[n,t]=(location.hash.slice(1)||"/").split("?"),e=new URLSearchParams(t||"");if(n.startsWith("/work/")){let i=It.data.works.find(s=>s.id===n.slice(6));if(i){Iy(i),scrollTo({top:0,behavior:"auto"});return}}if(n==="/collection"){let i=e.get("subject");It.subject=Nn[i]?i:"all",It.student=e.get("student")||"all"}n==="/"&&(It.subject="all",It.student="all"),It.page!=="home"||n==="/"?Cy():Xl(),["/collection","/subjects","/students"].includes(n)?requestAnimationFrame(()=>ae(n.slice(1))?.scrollIntoView({block:"start",behavior:It.motion?"smooth":"auto"})):scrollTo({top:0,behavior:"auto"})}async function Ly(){uo();let n,t=["localhost","127.0.0.1","[::1]"].includes(location.hostname);try{let e=await fetch(t?"/api/exhibits":"data/exhibits.json",{cache:"no-store",credentials:"same-origin"});if(!e.ok)throw Error("\uC804\uC2DC \uC5F0\uACB0 \uC911");n=await e.json()}catch{try{n=await(await fetch("data/exhibits.json",{cache:"no-store"})).json()}catch{n={works:[]}}}if(!n.works?.length){pn.innerHTML='<section class="loading-surface"><p class="eyebrow">2026 \uC218\uD559 \uD0D0\uAD6C\uC804</p><h1>\uC9C8\uBB38\uC774 \uB0A8\uAE34 \uADA4\uC801.</h1><p>\uC804\uC2DC \uC790\uB8CC\uB97C \uC5F0\uACB0\uD558\uACE0 \uC788\uC2B5\uB2C8\uB2E4. \uC7A0\uC2DC \uD6C4 \uB2E4\uC2DC \uC5F4\uC5B4 \uC8FC\uC138\uC694.</p></section>';return}It.data=n,ae("previewLabel").textContent=n.privatePreview?"\uAD50\uC0AC\uC6A9 \uBBF8\uB9AC\uBCF4\uAE30 \xB7 "+n.asOf:"2026 \uC218\uD559 \uD0D0\uAD6C\uC804 \xB7 "+new Set(n.works.map(Ti)).size+"\uBA85\uC758 \uC9C8\uBB38",window.addEventListener("hashchange",Yf),Yf()}Ly();})();
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
