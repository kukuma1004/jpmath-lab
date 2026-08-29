(function(){
  'use strict';

  var tabs=Array.prototype.slice.call(document.querySelectorAll('.sample-tab'));
  var scenes=Array.prototype.slice.call(document.querySelectorAll('.sample-scene'));
  var motionTimer=null;
  var droneFrame=null;
  var droneProgress=12;
  var droneDirection=1;

  function byId(id){return document.getElementById(id)}
  function clamp(value,min,max){return Math.max(min,Math.min(max,value))}
  function signed(value,digits){var number=Number(value);return(number>=0?'+':'')+number.toFixed(digits)}

  function privateContext(){
    try {
      if(new URLSearchParams(location.search).get('overview')==='1'){
        sessionStorage.removeItem('jp-curator-sample-context-v1');
        return null;
      }
      var raw=sessionStorage.getItem('jp-curator-sample-context-v1');
      var context=raw?JSON.parse(raw):null;
      if(context&&context.createdAt&&Date.now()-context.createdAt>60*60*1000){
        sessionStorage.removeItem('jp-curator-sample-context-v1');
        return null;
      }
      return context;
    } catch(error){return null}
  }

  function applyPrivateContext(){
    var context=privateContext();
    if(!context||!context.scene)return;
    var scene=document.querySelector('[data-scene="'+context.scene+'"]');
    var tab=document.querySelector('.sample-tab[data-target="'+context.scene+'"]');
    if(!scene||!tab)return;
    if(context.studentName)tab.innerHTML='<span>'+tab.getAttribute('data-number')+'</span> '+context.studentName+' · '+tab.getAttribute('data-short');
    var kicker=scene.querySelector('.scene-kicker');
    if(kicker&&context.studentName)kicker.textContent=(context.subject||'수학')+' · '+context.studentName+' · 탐구 설계 시각화';
    var question=scene.querySelector('.scene-question');
    if(question&&context.question)question.textContent='“'+context.question+'”';
    var anchor=scene.querySelector('.answer-anchor span');
    if(anchor&&context.answerExcerpt)anchor.textContent=context.answerExcerpt;
  }

  function showScene(name){
    tabs.forEach(function(tab){var active=tab.getAttribute('data-target')===name;tab.classList.toggle('is-active',active);tab.setAttribute('aria-pressed',active?'true':'false')});
    scenes.forEach(function(scene){var active=scene.getAttribute('data-scene')===name;scene.hidden=!active;scene.classList.toggle('is-active',active)});
    if(name!=='integral')stopMotion();
    history.replaceState(null,'',location.pathname+'#'+name);
  }

  tabs.forEach(function(tab){tab.addEventListener('click',function(){showScene(tab.getAttribute('data-target'))})});

  var cutAngle=byId('cutAngle');
  function drawConic(){
    var b=Number(cutAngle.value);var a=35;var gap=b-a;var type=gap>2?'타원':gap<-2?'쌍곡선':'포물선';
    byId('cutAngleValue').textContent=b+'°';byId('angleGap').textContent=(gap>=0?'+':'')+gap+'°';byId('conicType').textContent=type;byId('conicRule').textContent=gap>2?'b > a':gap<-2?'b < a':'b ≈ a';
    byId('cutPlane').style.transform='rotate('+((b-40)*-0.9)+'deg)';
    var group=byId('conicShape');
    if(type==='타원')group.innerHTML='<ellipse cx="260" cy="130" rx="'+clamp(46+(70-b)*2,46,110)+'" ry="29"></ellipse>';
    else if(type==='포물선')group.innerHTML='<path d="M206 69Q330 130 206 191"></path>';
    else group.innerHTML='<path d="M220 60Q285 130 220 200M300 60Q235 130 300 200"></path>';
  }
  cutAngle.addEventListener('input',drawConic);drawConic();

  var motionTime=byId('motionTime');
  function motionValues(){
    var t=Number(motionTime.value)/10;var outbound=Math.min(t,4)*4;var returned=t>4?(t-4)*2.5:0;var displacement=outbound-returned;var distance=outbound+returned;var velocity=t<4?4:-2.5;var trackPosition=clamp(displacement/16*100,0,100);var progress=t/10*100;
    byId('motionTimeValue').textContent=t.toFixed(1)+'초';byId('currentVelocity').textContent=signed(velocity,1);byId('displacement').textContent=displacement.toFixed(1)+' m';byId('distance').textContent=distance.toFixed(1)+' m';
    byId('timeNeedle').setAttribute('x1',38+progress*4.5);byId('timeNeedle').setAttribute('x2',38+progress*4.5);byId('runnerDot').style.left=trackPosition+'%';byId('runnerDot').parentNode.style.setProperty('--runner-progress',trackPosition+'%');
  }
  function stopMotion(){if(motionTimer){clearInterval(motionTimer);motionTimer=null}var button=byId('motionToggle');if(button)button.textContent='▶ 움직이기'}
  function toggleMotion(){
    if(motionTimer){stopMotion();return}
    byId('motionToggle').textContent='Ⅱ 멈추기';
    motionTimer=setInterval(function(){var next=Number(motionTime.value)+1;if(next>100)next=0;motionTime.value=next;motionValues()},80);
  }
  motionTime.addEventListener('input',function(){stopMotion();motionValues()});byId('motionToggle').addEventListener('click',toggleMotion);motionValues();

  var normalComponent=byId('normalComponent');var pathSpeed=byId('pathSpeed');
  function drawVector(){
    var component=Number(normalComponent.value)/100;var absolute=Math.abs(component);var relation=absolute<.08?'평면과 평행':absolute>.92?'평면에 거의 수직':'평면과 비스듬히 만남';var rule=absolute<.08?'평행':absolute>.92?'수직 교차':'교차';var angle=-component*28;
    byId('normalComponentValue').textContent=component.toFixed(2);byId('directionVector').textContent='(1, '+component.toFixed(2)+', 0)';byId('dotProduct').textContent=component.toFixed(2);byId('vectorRelation').textContent=relation;byId('relationRule').textContent=rule;byId('flightPath').style.setProperty('--path-angle',angle+'deg');
  }
  function speedLabel(){var value=Number(pathSpeed.value);byId('pathSpeedValue').textContent=value<34?'천천히':value>67?'빠르게':'보통'}
  function animateDrone(){var speed=.08+Number(pathSpeed.value)/360;droneProgress+=speed*droneDirection;if(droneProgress>88||droneProgress<10)droneDirection*=-1;byId('droneMarker').style.left=droneProgress+'%';droneFrame=requestAnimationFrame(animateDrone)}
  normalComponent.addEventListener('input',drawVector);pathSpeed.addEventListener('input',speedLabel);drawVector();speedLabel();animateDrone();

  applyPrivateContext();
  var hash=location.hash.replace('#','');if(['conic','integral','vector'].indexOf(hash)>=0)showScene(hash);
  window.addEventListener('beforeunload',function(){stopMotion();if(droneFrame)cancelAnimationFrame(droneFrame)});
}());
