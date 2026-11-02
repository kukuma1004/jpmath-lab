export const SUBJECTS={
  calculus:{label:'미적분Ⅰ',mark:'f′',title:'변화를 읽다.',description:'가까워지는 값, 순간의 기울기, 쌓이는 양에서 질문을 찾습니다.',kind:'secant',color:'#bf4630',light:'#ffe3c6',hue:.055},
  geometry:{label:'기하',mark:'∠',title:'공간을 보다.',description:'거리와 방향, 평면과 입체 사이에서 보이지 않던 관계를 발견합니다.',kind:'ellipsoid',color:'#4c5fd0',light:'#d5dcff',hue:.63},
  economics:{label:'경제수학',mark:'%',title:'선택을 따지다.',description:'수와 모형으로 일상의 선택과 근사의 오차를 살펴봅니다.',kind:'compound',color:'#12735d',light:'#c5efdf',hue:.43}
};
export const ownerKey=w=>w.id.slice(0,4);
export function filterWorks(works,subject='all',student='all'){
  return works.filter(w=>(subject==='all'||w.subjectKey===subject)&&(student==='all'||ownerKey(w)===student));
}
export function chapterIndex(value,length=7){return Math.min(length-1,Math.max(0,Number.isFinite(value)?Math.trunc(value):0))}
export function swipeStep(dx,dy){return Math.abs(dx)>=70&&Math.abs(dx)>Math.abs(dy)*1.5?(dx<0?1:-1):0}
export function artifactURL(artifact){try{const u=new URL(artifact?.url);return u.protocol==='https:'&&!u.username&&!u.password?u.href:null}catch{return null}}
export function excerpt(value,max=360){const text=String(value||'').trim();if(text.length<=max)return text;let end=text.lastIndexOf('다.',max);if(end<max*.55)end=max-1;else end+=1;return text.slice(0,end+1)+'…'}
export function chaptersFor(w){
  const r=w.raw;
  return [
    {key:'question',label:'질문',title:'무엇이 궁금했을까.',intro:w.question,primary:r.hypothesis,fields:[['처음 세운 예상',r.hypothesis]]},
    {key:'method',label:'방법',title:'어떻게 알아보기로 했을까.',intro:'같게 둘 것과 바꿀 것. 학생이 선택한 방법을 읽습니다.',primary:r.plan||r.conditions,fields:[['탐구 계획',r.plan],['바꿀 조건과 자료',r.conditions]]},
    {key:'process',label:'수행',title:'어떤 시도를 했을까.',intro:'아래 내용은 학생이 저장한 수행 기록입니다.',primary:r.process,fields:[['수행 과정',r.process]]},
    {key:'revision',label:'수정',title:'생각을 바꾼 순간.',intro:'뜻대로 되지 않았던 장면과, 그다음의 선택을 읽습니다.',primary:r.revision,fields:[['실패와 수정',r.revision]]},
    {key:'evidence',label:'근거',title:'무엇을 근거로 남겼을까.',intro:'계산과 관찰, 실행과 해석을 학생의 기록에서 확인합니다.',primary:r.evidence,fields:[['결과와 근거',r.evidence],['수학적 해석',r.interpretation]]},
    {key:'conclusion',label:'결론',title:'알게 된 것과, 남은 것.',intro:'하나의 결론이 다음 질문의 출발점이 됩니다.',primary:r.conclusion,fields:[['결론',r.conclusion],['한계와 주의할 점',r.limits],['새로운 질문',r.next]]},
    {key:'artifact',label:'작품',title:'이제, 작품 앞으로.',intro:'학생이 만든 웹앱을 원래 모습으로 만납니다.',primary:'',fields:[]}
  ];
}
