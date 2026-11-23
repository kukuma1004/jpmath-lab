'use strict';

const ForgeWardrobe = (() => {
  function mount({ getState, select, asset, fmt }) {
    const $ = id => document.getElementById(id);
    let preview = '0', filter = 'all', signature = '', busy = false;
    const node = (tag, className, text) => { const e=document.createElement(tag);e.className=className;if(text!==undefined)e.textContent=text;return e; };
    const scrollHint = () => { const e=$('wardrobe-gallery');$('wardrobe-scroll-hint').hidden=e.scrollHeight-e.clientHeight-e.scrollTop<12; };
    $('wardrobe-gallery').addEventListener('scroll',scrollHint,{passive:true});
    function render() {
      const state=getState(), current=Forge.appearanceAt(state.appearance,state.level);
      const discovered=Forge.forms.filter(form=>form.level<=state.bestLevel), form=Forge.appearanceAt(preview,state.level);
      const equipped=current.level===form.level, unlocked=form.level<=state.bestLevel;
      const src=asset('sword-'+form.level),image=$('wardrobe-preview-image');
      if(image.getAttribute('src')!==src)image.src=src;
      image.alt=form.name;
      $('wardrobe-preview-name').textContent=form.name;
      $('wardrobe-preview-detail').textContent=form.detail;
      $('wardrobe-preview-level').textContent='+'+fmt(form.level)+' 발견';
      $('wardrobe-equipped').textContent=state.appearance==='auto'?'강화 단계에 따라 자동 변경 중':current.name+' 외형 고정 중';
      $('wardrobe-count').textContent=discovered.length+' / '+Forge.forms.length+' 발견';
      $('wardrobe-equip').textContent=busy?'장착하는 중…':equipped&&state.appearance!=='auto'?'장착 중':'이 외형 장착';
      $('wardrobe-equip').disabled=busy||!unlocked||(equipped&&state.appearance!=='auto');
      $('wardrobe-auto').disabled=busy||state.appearance==='auto';
      $('wardrobe-auto').textContent=state.appearance==='auto'?'↻ 자동 변경 사용 중':'↻ 강화 단계에 맞춰 자동 변경';
      for(const button of document.querySelectorAll('[data-wardrobe-filter]')){
        const value=button.dataset.wardrobeFilter;
        button.setAttribute('aria-pressed',String(value===filter));
        button.textContent=value==='all'?'전체 '+Forge.forms.length:value==='unlocked'?'발견 '+discovered.length:'새 외형 '+Forge.forms.filter(f=>f.edition==='new').length;
      }
      const next=[discovered.length,state.appearance,current.level,preview,filter].join(':');
      if(signature===next)return;
      signature=next;
      const scroll=$('wardrobe-gallery').scrollTop;
      const forms=[current,...Forge.forms.filter(f=>f.level!==current.level&&f.edition==='new'),...Forge.forms.filter(f=>f.level!==current.level&&f.edition!=='new')]
        .filter(f=>filter==='all'||(filter==='unlocked'?f.level<=state.bestLevel:f.edition==='new'));
      $('sword-book').replaceChildren(...forms.map(f=>{
        const unlocked=f.level<=state.bestLevel, item=node('li','collection-item'+(unlocked?'':' undiscovered'));
        const button=node('button','weapon-card'),image=node('img','');
        button.type='button';button.dataset.formLevel=f.level.toString();button.disabled=!unlocked;
        button.setAttribute('aria-label',unlocked?f.name+' 외형 미리보기':'+'+fmt(f.level)+'에서 발견');
        button.setAttribute('aria-pressed',String(f.level===form.level));
        image.src=asset('sword-'+f.level);image.alt='';image.width=200;image.height=150;image.loading='lazy';
        button.append(node('span','book-level','+'+fmt(f.level)),image,node('strong','',unlocked?f.name:'미발견 외형'),node('small','',unlocked?'◇ 미리보기':'⌁ 이 단계에 도달하면 발견해요'));
        if(f.level===current.level)button.append(node('span','equipped-badge','장착 중'));
        else if(f.edition==='new')button.append(node('span','new-appearance-badge','NEW'));
        button.addEventListener('click',()=>{preview=f.level.toString();signature='';render();document.querySelector('[data-form-level="'+preview+'"]').focus({preventScroll:true});});
        item.append(button);return item;
      }));
      $('wardrobe-gallery').scrollTop=scroll;
      requestAnimationFrame(scrollHint);
    }
    async function equip(choice) {
      if(busy)return;
      busy=true;render();
      try {
        const changed=await select(choice);
        $('wardrobe-status').textContent=changed?(choice==='auto'?'강화 단계에 따라 외형이 바뀌어요.':Forge.appearanceAt(choice,getState().level).name+' 외형을 장착했어요.'):'이미 장착했거나 발견하지 못한 외형이에요.';
      } finally {busy=false;signature='';render();}
    }
    $('wardrobe-equip').addEventListener('click',()=>equip(preview));
    $('wardrobe-auto').addEventListener('click',()=>equip('auto'));
    for(const button of document.querySelectorAll('[data-wardrobe-filter]'))button.addEventListener('click',()=>{filter=button.dataset.wardrobeFilter;signature='';$('wardrobe-gallery').scrollTop=0;render();});
    return {render,open(){preview=Forge.appearanceAt(getState().appearance,getState().level).level.toString();filter='all';signature='';$('wardrobe-status').textContent='발견한 외형을 자유롭게 장착해 보세요. 강화 단계와 감정가는 그대로예요.';render();$('wardrobe-gallery').scrollTop=0;}};
  }
  return {mount};
})();
