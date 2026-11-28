import { CHARACTERS } from '../data/characters';
import { MAPS } from '../data/maps';
import type { OnlineClient } from './client';
import { FRIEND_MODES, type PublicRoom } from './protocol';
import { RANKS, rankBadge } from './rank';
import './online.css';

const mapNames = new Map(MAPS.map(map=>[map.id,map.name]));

export class OnlineLobby {
  private readonly root = document.createElement('section');
  private register = false;
  private busy = false;
  private message = '';
  private renderedRooms = '';

  constructor(container: HTMLElement, private readonly client: OnlineClient, close: () => void) {
    this.root.className='online-lobby';
    const title=client.groups?'온라인 대전':'온라인 1:1';
    this.root.setAttribute('aria-label',title);
    this.root.innerHTML=`
      <div class="online-panel">
        <header><h2>${title}</h2><button class="btn ghost" data-act="close">← 처음 화면</button></header>
        <p class="online-message" role="status"></p>
        <form class="online-auth">
          <label>아이디<input name="id" autocomplete="username" minlength="3" maxlength="20" required></label>
          <label>비밀번호<input name="password" type="password" autocomplete="current-password" minlength="8" maxlength="80" required></label>
          <label data-register hidden>닉네임<input name="nickname" autocomplete="nickname" minlength="2" maxlength="12"></label>
          <div class="online-actions"><button class="btn primary" type="submit">로그인</button><button class="btn" type="button" data-act="toggle">계정 만들기</button></div>
        </form>
        <div class="online-signed" hidden>
          <div class="online-profile"><div class="rank-profile"><strong data-profile></strong><span data-medal></span><small data-rank-score></small></div><button class="btn ghost" data-act="logout">로그아웃</button></div>
          <div class="online-options">
            <label>내 장수<select name="char">${CHARACTERS.map(c=>`<option value="${c.id}">${c.name}</option>`).join('')}</select></label>
            <section class="ranked-options">
              <h3>1:1 랭크전</h3>
              <p>랜덤 전장 · 1,000점부터 시작</p>
              <div class="online-actions"><button class="btn primary" data-act="queue">상대 찾기</button><button class="btn" data-act="rankings">누적 순위</button></div>
              <details class="rank-tiers"><summary>훈장 기준</summary><ul>${RANKS.map(tier=>`<li>${rankBadge(tier.min,true)} ${tier.min.toLocaleString('ko-KR')}점 이상</li>`).join('')}</ul></details>
            </section>
            <section>
              <h3>친선전</h3>
              <label${client.groups?'':' hidden'}>대전 방식<select name="mode">${Object.entries(FRIEND_MODES).map(([mode,details])=>`<option value="${mode}">${details.title}</option>`).join('')}</select></label>
              <div class="online-room-settings">
                <label>전장<select name="map"><option value="random">랜덤 전장</option>${MAPS.map(m=>`<option value="${m.id}">${m.name}</option>`).join('')}</select></label>
                <label>공개 범위<select name="visibility"><option value="public">공개방</option><option value="code">코드 전용</option></select></label>
              </div>
              <button class="btn jade" data-act="create">방 만들기</button>

            </section>
            <section class="online-room-list" aria-labelledby="open-room-title">
              <h3 id="open-room-title">공개방 목록</h3>
              <p class="online-room-empty">대기 중인 공개방이 없어요.</p>
              <ul class="online-room-rows" aria-label="대기 중인 공개방"></ul>
              <form class="online-join">
                <label>방 코드<input name="code" maxlength="6" minlength="6" autocomplete="off" autocapitalize="characters" required></label>
                <button class="btn" type="submit">방 참가</button>
              </form>
            </section>
          </div>
          <section class="online-wait" hidden>
            <p data-wait></p><p data-wait-map></p><p data-wait-players></p><strong data-code></strong>
            <div class="online-actions"><button class="btn jade" data-act="copy" hidden>코드 복사</button><button class="btn" data-act="leave">대기 취소</button></div>
          </section>
        </div>
      </div>
      <dialog class="online-board-dialog" aria-labelledby="online-board-title">
        <header><h3 id="online-board-title">랭크전 누적 순위</h3><button class="btn ghost" type="button" data-act="close-board">닫기</button></header>
        <p class="online-board-message" role="status"></p>
        <ol class="online-board" aria-label="온라인 대전 누적 순위"></ol>
      </dialog>`;
    container.append(this.root);
    this.select('.online-board-dialog').addEventListener('close',()=>{
      if(this.client.state&&this.root.isConnected)this.select('[data-act=rankings]').focus({preventScroll:true});
    });
    this.root.addEventListener('submit',event=>{
      event.preventDefault();
      const form=event.target as HTMLFormElement;
      const fields=new FormData(form);
      if(form.matches('.online-auth')){
        const body={id:String(fields.get('id')),password:String(fields.get('password')),nickname:String(fields.get('nickname')??'')};
        void this.run(async()=>{
          await this.client.auth(this.register,body);
          form.reset();
        });
      }else{
        void this.run(()=>this.client.lobby('join',{char:this.pick(),code:String(fields.get('code'))}));
      }
    });
    this.root.addEventListener('click',event=>{
      const button=(event.target as HTMLElement).closest<HTMLButtonElement>('[data-act]');
      const action=button?.dataset.act;
      if(action==='toggle'){
        this.register=!this.register;
        this.message='';
        const nickname=this.select<HTMLInputElement>('input[name=nickname]');
        nickname.required=this.register;
        this.select('[data-register]').hidden=!this.register;
        this.select<HTMLInputElement>('input[name=password]').autocomplete=this.register?'new-password':'current-password';
        this.select('.online-auth button[type=submit]').textContent=this.register?'가입하고 시작':'로그인';
        this.select('[data-act=toggle]').textContent=this.register?'로그인으로':'계정 만들기';
        this.render();
      }else if(action==='close'){
        void this.run(async()=>{await this.client.leave();close();});
      }else if(action==='create'){
        const map=this.select<HTMLSelectElement>('select[name=map]').value;
        const mode=this.select<HTMLSelectElement>('select[name=mode]').value;
        const listed=this.select<HTMLSelectElement>('select[name=visibility]').value==='public';
        void this.run(()=>this.client.lobby('create',{char:this.pick(),map,mode,listed}));
      }else if(action==='join-room'){
        void this.run(()=>this.client.lobby('join',{char:this.pick(),code:button!.dataset.roomCode,listedOnly:true}));
      }else if(action==='queue'){
        void this.run(()=>this.client.lobby('queue',{char:this.pick()}));
      }else if(action==='leave'){
        void this.run(()=>this.client.leave());
      }else if(action==='logout'){
        void this.run(async()=>{await this.client.leave();await this.client.logout();});
      }else if(action==='copy'){
        void this.run(async()=>{
          await navigator.clipboard.writeText(this.select('[data-code]').textContent!);
          this.message='방 코드를 복사했어요.';
        });
      }else if(action==='rankings'){
        void this.run(async()=>{
          const rows=await this.client.rankings();
          const board=this.select('.online-board');
          board.replaceChildren(...rows.map(row=>{
            const li=document.createElement('li');
            const name=document.createElement('strong');
            name.textContent=row.nickname;
            const medal=document.createElement('span');
            medal.innerHTML=rankBadge(row.rating,true);
            const stats=document.createElement('small');
            stats.textContent=`${row.rating.toLocaleString('ko-KR')}점 · ${row.wins}승 ${row.draws}무 ${row.losses}패`;
            li.append(name,medal,stats);
            return li;
          }));
          board.hidden=!rows.length;
          this.select('.online-board-message').textContent=rows.length?'':'첫 랭킹전 기록을 기다리고 있어요.';
          const dialog=this.select<HTMLDialogElement>('.online-board-dialog');
          if(this.root.isConnected&&this.client.state&&!dialog.open)dialog.showModal();
        });
      }else if(action==='close-board'){
        this.select<HTMLDialogElement>('.online-board-dialog').close();
      }
    });
    this.render();
  }

  destroy(): void { this.root.remove(); }

  private select<T extends HTMLElement = HTMLElement>(selector:string):T {
    return this.root.querySelector<T>(selector)!;
  }

  private pick(): string { return this.select<HTMLSelectElement>('select[name=char]').value; }

  private renderRooms(rooms: PublicRoom[]): void {
    const key=JSON.stringify(rooms);
    if(key===this.renderedRooms)return;
    this.renderedRooms=key;
    this.select('.online-room-empty').hidden=rooms.length>0;
    this.select('.online-room-rows').replaceChildren(...rooms.map(room=>{
      const li=document.createElement('li');
      const details=document.createElement('div');
      const name=document.createElement('strong');
      name.textContent=room.nickname;
      const map=document.createElement('small');
      map.textContent=[room.mode?FRIEND_MODES[room.mode].title:'',mapNames.get(room.map)??''].filter(Boolean).join(' · ');
      details.append(name,map);
      const join=document.createElement('button');
      join.type='button';
      join.className='btn jade';
      join.dataset.act='join-room';
      join.dataset.roomCode=room.code;
      join.setAttribute('aria-label',`${room.nickname} 방 입장`);
      join.textContent='입장';
      li.append(details,join);
      return li;
    }));
  }

  render(): void {
    const state=this.client.state;
    const waiting=!!(state?.queued || state?.room);
    const message=this.message||this.client.error||(this.client.authenticated && !state ? '계정을 불러오는 중이에요.' : '');
    const status=this.select('.online-message');
    if(status.textContent!==message)status.textContent=message;
    this.select('.online-auth').hidden=this.client.authenticated;
    this.select('.online-signed').hidden=!state;
    if(!state)this.select<HTMLDialogElement>('.online-board-dialog').close();
    if(state) {
      this.select('[data-profile]').textContent=state.profile.nickname;
      const medal=this.select('[data-medal]');
      const points=String(state.profile.rating);
      if(medal.dataset.points!==points) {
        medal.dataset.points=points;
        medal.innerHTML=rankBadge(state.profile.rating,true);
        this.select('[data-rank-score]').textContent=`${state.profile.rating.toLocaleString('ko-KR')}점`;
      }
    }
    this.select('.online-options').hidden=waiting;
    this.select('.online-wait').hidden=!waiting;
    const room=state?.room;
    const mode=room?.mode?FRIEND_MODES[room.mode]:null;
    this.select('[data-wait]').textContent=state?.queued?'랭킹전 상대를 기다리는 중':mode?
      `${mode.title} · ${room!.names.length}/${mode.seats}명` : room?.listed?'공개방에서 상대를 기다리는 중':'친구가 방 코드를 입력할 때까지 기다리는 중';
    this.select('[data-wait-map]').textContent=room?.kind==='friendly'?mapNames.get(room.map)??'':'';
    this.select('[data-wait-players]').textContent=room?.mode&&room.mode!=='duel'?room.names.join(' · '):'';
    this.select('[data-code]').textContent=state?.room?.kind==='friendly'?state.room.code:'';
    this.select('[data-act=copy]').hidden=!state?.room?.code || state.room.kind!=='friendly' || !navigator.clipboard;
    this.renderRooms(state?.rooms??[]);
    this.root.querySelectorAll<HTMLButtonElement>('button:not([data-act=close-board])').forEach(button=>{button.disabled=this.busy;});
  }

  private async run(action:()=>Promise<void>):Promise<void> {
    if(this.busy)return;
    this.busy=true;
    this.message='';
    this.render();
    try {await action();}
    catch(error){this.message=error instanceof Error?error.message:'처리하지 못했어요. 다시 시도해 주세요.';}
    finally{this.busy=false;this.render();}
  }
}
