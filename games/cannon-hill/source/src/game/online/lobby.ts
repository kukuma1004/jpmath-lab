import { CHARACTERS } from '../data/characters';
import { MAPS } from '../data/maps';
import type { OnlineClient } from './client';
import { FRIEND_MODES, matchLabel, type PublicRoom, type RankMode, type RoomPreview } from './protocol';
import { RANKS, rankBadge } from './rank';
import './online.css';

const mapNames = new Map(MAPS.map(map=>[map.id,map.name]));
const teams = ['청팀','홍팀'] as const;
type LobbyArt = {portraits:Record<string,{normal:string}>;mapThumbs:Record<string,string>};

export class OnlineLobby {
  private readonly root = document.createElement('section');
  private register = false;
  private busy = false;
  private message = '';
  private renderedRooms = '';
  private char = CHARACTERS[0]!.id;
  private map = 'random';
  private picker: 'char'|'map' = 'char';
  private invite: RoomPreview | null = null;

  constructor(container: HTMLElement, private readonly client: OnlineClient, private readonly art: LobbyArt, close: () => void) {
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
          <div class="online-profile"><div class="rank-profile"><strong data-profile></strong><span data-medal></span><small data-rank-score></small><small data-team-score></small></div><button class="btn ghost" data-act="logout">로그아웃</button></div>
          <div class="online-options">
            <button class="online-pick online-picked-char" type="button" data-act="pick-char" aria-label="내 장수 고르기"><img alt=""><span><small>내 장수</small><b></b><em></em></span><i aria-hidden="true">›</i></button>
            <div class="online-link-notice" data-link-notice hidden><strong></strong><button class="btn jade" type="button" data-act="inspect-link">초대방 확인</button></div>
            <section class="ranked-options">
              <h3>랭크전</h3>
              <p class="online-random"><strong>랜덤 전장</strong><small>경기 시작 때 공개</small></p>
              <div class="online-actions"><button class="btn primary" data-act="queue">1:1 상대 찾기</button><button class="btn" data-act="rankings">누적 순위</button></div>
              ${client.groups?`<div class="online-invite-actions"><button class="btn ghost" data-act="rank-room" data-mode="duel">1:1 초대방</button><button class="btn ghost" data-act="rank-room" data-mode="teams">2:2 초대방</button></div>`:''}
              <details class="rank-tiers"><summary>훈장 기준</summary><ul>${RANKS.map(tier=>`<li>${rankBadge(tier.min,true)} ${tier.min.toLocaleString('ko-KR')}점 이상</li>`).join('')}</ul></details>
            </section>
            <section class="friendly-options">
              <h3>친선전</h3>
              <label${client.groups?'':' hidden'}>대전 방식<select name="mode">${Object.entries(FRIEND_MODES).map(([mode,details])=>`<option value="${mode}">${details.title}</option>`).join('')}</select></label>
              <button class="online-pick online-picked-map" type="button" data-act="pick-map" aria-label="전장 고르기"><img alt=""><span><small>전장</small><b></b></span><i aria-hidden="true">›</i></button>
              <label>공개 범위<select name="visibility"><option value="public">공개방</option><option value="code">코드 전용</option></select></label>
              <button class="btn jade" data-act="create">친선방 만들기</button>
            </section>
            <section class="online-room-list" aria-labelledby="open-room-title">
              <h3 id="open-room-title">공개 친선방</h3>
              <p class="online-room-empty">대기 중인 공개방이 없어요.</p>
              <ul class="online-room-rows" aria-label="대기 중인 공개방"></ul>
              <form class="online-join">
                <label>방 코드<input name="code" maxlength="6" minlength="6" autocomplete="off" autocapitalize="characters" required></label>
                <button class="btn" type="submit">방 참가</button>
              </form>
            </section>
          </div>
          <section class="online-wait" hidden>
            <strong class="online-kind" data-wait-kind></strong><p data-wait></p><p data-wait-map></p><div class="online-teams" data-wait-players hidden></div><strong data-code></strong>
            <div class="online-actions"><button class="btn jade" data-act="copy-link" hidden>초대 링크 복사</button><button class="btn ghost" data-act="copy" hidden>코드 복사</button><button class="btn" data-act="leave">대기 취소</button></div>
          </section>
        </div>
      </div>
      <dialog class="online-board-dialog online-rank-board" aria-labelledby="online-board-title">
        <header><h3 id="online-board-title">랭크전 누적 순위</h3><button class="btn ghost" type="button" data-act="close-board">닫기</button></header>
        ${client.groups?'<div class="online-board-tabs"><button class="btn ghost" data-act="board-mode" data-mode="duel">1:1</button><button class="btn ghost" data-act="board-mode" data-mode="teams">2:2</button></div>':''}
        <p class="online-board-message" role="status"></p>
        <ol class="online-board" aria-label="온라인 대전 누적 순위"></ol>
      </dialog>
      <dialog class="online-board-dialog online-picker" aria-labelledby="online-picker-title">
        <header><h3 id="online-picker-title"></h3><button class="btn ghost" type="button" data-act="dismiss">닫기</button></header>
        <div class="online-picker-grid" data-options></div>
      </dialog>
      <dialog class="online-board-dialog online-join-dialog" aria-labelledby="online-join-title">
        <header><h3 id="online-join-title" class="online-kind"></h3><button class="btn ghost" type="button" data-act="dismiss">닫기</button></header>
        <p data-join-map></p><p data-join-note></p><p class="online-join-message" role="status"></p>
        <div data-join-seats></div>
      </dialog>`;
    container.append(this.root);
    const forwarded=new URLSearchParams(location.search).get('room')?.toUpperCase()??'';
    if(client.groups&&/^[23456789ABCDEFGHJKLMNPQRSTUVWXYZ]{6}$/.test(forwarded)){
      this.select<HTMLInputElement>('input[name=code]').value=forwarded;
      this.select('[data-link-notice] strong').textContent=`초대 코드 ${forwarded}`;
      this.select('[data-link-notice]').hidden=false;
    }
    this.select('.online-rank-board').addEventListener('close',()=>{
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
        const code=String(fields.get('code'));
        if(this.client.groups)this.inspectInvite(code);
        else void this.run(()=>this.client.lobby('join',{char:this.char,code}));
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
        const mode=this.select<HTMLSelectElement>('select[name=mode]').value;
        const listed=this.select<HTMLSelectElement>('select[name=visibility]').value==='public';
        void this.run(()=>this.client.lobby('create',{char:this.char,map:this.map,mode,listed}));
      }else if(action==='rank-room'){
        void this.run(()=>this.client.lobby('create',{char:this.char,ranked:true,mode:button!.dataset.mode}));
      }else if(action==='pick-char'||action==='pick-map'){
        this.showPicker(action==='pick-char'?'char':'map');
      }else if(action==='pick-option'){
        const value=button!.dataset.option!;
        if(this.picker==='char')this.char=value;
        else this.map=value;
        this.paintPicks();
        this.select<HTMLDialogElement>('.online-picker').close();
        this.select(`[data-act=pick-${this.picker}]`).focus();
      }else if(action==='dismiss'){
        button!.closest('dialog')!.close();
      }else if(action==='inspect-link'){
        this.inspectInvite(forwarded);
      }else if(action==='join-invite'&&this.invite){
        const {code,kind}=this.invite;
        const side=button!.dataset.side===undefined?undefined:Number(button!.dataset.side);
        void this.run(async()=>{
          await this.client.lobby('join',{char:this.char,code,expectedKind:kind,side});
          this.select<HTMLDialogElement>('.online-join-dialog').close();
          if(code===forwarded){
            const current=new URL(location.href);
            current.searchParams.delete('room');
            history.replaceState(history.state,'',current);
            this.select('[data-link-notice]').hidden=true;
          }
        });
      }else if(action==='join-room'){
        void this.run(()=>this.client.lobby('join',{char:this.char,code:button!.dataset.roomCode,listedOnly:true}));
      }else if(action==='queue'){
        void this.run(()=>this.client.lobby('queue',{char:this.char}));
      }else if(action==='leave'){
        void this.run(()=>this.client.leave());
      }else if(action==='logout'){
        void this.run(async()=>{await this.client.leave();await this.client.logout();});
      }else if(action==='copy'||action==='copy-link'){
        void this.run(async()=>{
          const code=this.select('[data-code]').textContent!;
          const link=new URL(location.pathname,location.origin);
          link.searchParams.set('room',code);
          await navigator.clipboard.writeText(action==='copy'?code:link.href);
          this.message=action==='copy'?'방 코드를 복사했어요.':'초대 링크를 복사했어요.';
        });
      }else if(action==='rankings'||action==='board-mode'){
        const mode:RankMode=button?.dataset.mode==='teams'?'teams':'duel';
        void this.run(async()=>{
          const rows=await this.client.rankings(mode);
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
          this.root.querySelectorAll<HTMLElement>('[data-act=board-mode]').forEach(tab=>tab.setAttribute('aria-pressed',String(tab.dataset.mode===mode)));
          this.select('.online-board-message').textContent=rows.length?'':'첫 랭킹전 기록을 기다리고 있어요.';
          const dialog=this.select<HTMLDialogElement>('.online-rank-board');
          if(this.root.isConnected&&this.client.state&&!dialog.open)dialog.showModal();
        });
      }else if(action==='close-board'){
        this.select<HTMLDialogElement>('.online-rank-board').close();
      }
    });
    this.paintPicks();
    this.render();
  }

  destroy(): void { this.root.remove(); }

  private select<T extends HTMLElement = HTMLElement>(selector:string):T {
    return this.root.querySelector<T>(selector)!;
  }

  private mapImage(id:string):string {
    if(id==='random')return this.art.mapThumbs.sanseong||'art/bg_sanseong.webp';
    return this.art.mapThumbs[id]||`art/bg_${id}.${id==='bridge'||id==='quarry'?'png':'webp'}`;
  }

  private paintPicks():void {
    const char=CHARACTERS.find(item=>item.id===this.char)!;
    const portrait=this.select<HTMLImageElement>('.online-picked-char img');
    if(this.art.portraits[char.id])portrait.src=this.art.portraits[char.id]!.normal;
    this.select('.online-picked-char b').textContent=char.name;
    this.select('.online-picked-char em').textContent=char.role;
    this.select<HTMLImageElement>('.online-picked-map img').src=this.mapImage(this.map);
    this.select('.online-picked-map b').textContent=mapNames.get(this.map)??'랜덤 전장';
  }

  private showPicker(kind:'char'|'map'):void {
    this.picker=kind;
    const selected=kind==='char'?this.char:this.map;
    const options=kind==='char'?CHARACTERS.map(c=>({id:c.id,name:c.name,sub:c.role,img:this.art.portraits[c.id]?.normal??''})):
      [{id:'random',name:'랜덤 전장',sub:'시작 때 공개',img:this.mapImage('random')},...MAPS.map(m=>({id:m.id,name:m.name,sub:m.features,img:this.mapImage(m.id)}))];
    this.select('#online-picker-title').textContent=kind==='char'?'내 장수 고르기':'친선전 전장 고르기';
    const body=this.select('[data-options]');
    body.dataset.picker=kind;
    body.innerHTML=options.map(option=>`<button class="online-option" data-act="pick-option" data-option="${option.id}" aria-pressed="${option.id===selected}"><img alt="" src="${option.img}"><b>${option.name}</b><small>${option.sub}</small></button>`).join('');
    this.select<HTMLDialogElement>('.online-picker').showModal();
  }

  private showInvite(room:RoomPreview):void {
    const title=this.select('#online-join-title');
    title.textContent=matchLabel(room.kind,room.mode);
    title.dataset.kind=room.kind;
    this.select('.online-join-message').textContent='';
    this.select('[data-join-map]').textContent=room.kind==='ranked'?'랜덤 전장 · 경기 시작 때 공개':mapNames.get(room.map)??'랜덤 전장';
    this.select('[data-join-note]').textContent=room.kind==='ranked'?'정상 종료 후 랭크 점수가 반영돼요.':'랭크 점수 변동 없이 진행해요.';
    const seats=this.select('[data-join-seats]');
    if(room.kind==='ranked'&&room.mode==='teams')seats.replaceChildren(...teams.map((team,side)=>{
      const members=room.seats.filter((_,i)=>i%2===side);
      const button=document.createElement('button');
      button.className='btn online-team-button';
      button.dataset.act='join-invite';
      button.dataset.side=String(side);
      button.textContent=`${team} 입장 · ${members.filter(Boolean).length}/2`;
      if(room.seat>=0?room.seat%2!==side:members.every(Boolean))button.dataset.full='true';
      const label=document.createElement('small');
      label.textContent=members.map(name=>name??'빈 자리').join(' · ');
      button.append(label);
      return button;
    }));
    else {
      seats.innerHTML='<button class="btn primary" type="button" data-act="join-invite">입장하기</button>';
    }
    const dialog=this.select<HTMLDialogElement>('.online-join-dialog');
    if(!dialog.open)dialog.showModal();
  }

  private inspectInvite(code:string):void {
    void this.run(async()=>{
      this.invite=await this.client.inspectRoom(code);
      this.showInvite(this.invite);
    });
  }

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
      map.textContent=[matchLabel('friendly',room.mode),mapNames.get(room.map)??''].filter(Boolean).join(' · ');
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
    if(!state)this.select<HTMLDialogElement>('.online-rank-board').close();
    if(state) {
      this.select('[data-profile]').textContent=state.profile.nickname;
      const medal=this.select('[data-medal]');
      const points=String(state.profile.rating);
      if(medal.dataset.points!==points) {
        medal.dataset.points=points;
        medal.innerHTML=rankBadge(state.profile.rating,true);
        this.select('[data-rank-score]').textContent=`1:1 ${state.profile.rating.toLocaleString('ko-KR')}점`;
      }
      this.select('[data-team-score]').textContent=state.teamProfile?`2:2 ${state.teamProfile.rating.toLocaleString('ko-KR')}점`:'';
    }
    this.select('.online-options').hidden=waiting;
    this.select('.online-wait').hidden=!waiting;
    const room=state?.room;
    const mode=room?.mode?FRIEND_MODES[room.mode]:null;
    const kind=this.select('[data-wait-kind]');
    kind.textContent=room?matchLabel(room.kind,room.mode):'';
    kind.dataset.kind=room?.kind??'';
    this.select('[data-wait]').textContent=state?.queued?'랭킹전 상대를 기다리는 중':room&&mode?
      `참가 ${room.names.length}/${mode.seats}명`:'친구가 방 코드를 입력할 때까지 기다리는 중';
    this.select('[data-wait-map]').textContent=room?.kind==='ranked'?'랜덤 전장 · 경기 시작 때 공개':mapNames.get(room?.map??'')??'';
    const players=this.select('[data-wait-players]');
    players.hidden=!(room?.mode==='teams'&&room.seats);
    if(!players.hidden)players.replaceChildren(...teams.map((team,side)=>{
      const panel=document.createElement('div');
      panel.dataset.side=String(side);
      const heading=document.createElement('b');
      heading.textContent=team;
      const members=document.createElement('span');
      members.textContent=room!.seats!.filter((_,i)=>i%2===side).map(name=>name??'빈 자리').join(' · ');
      panel.append(heading,members);
      return panel;
    }));
    const share=room&&(room.kind==='friendly'||room.rankInvite);
    this.select('[data-code]').textContent=share?room.code:'';
    this.select('[data-act=copy]').hidden=!share||!navigator.clipboard;
    this.select('[data-act=copy-link]').hidden=!share||!navigator.clipboard||!this.client.groups;
    const joinDialog=this.select<HTMLDialogElement>('.online-join-dialog');
    if(joinDialog.open)this.select('.online-join-message').textContent=this.message;
    this.renderRooms(state?.rooms??[]);
    this.root.querySelectorAll<HTMLButtonElement>('button:not([data-act=close-board],[data-act=dismiss])').forEach(button=>{button.disabled=this.busy||button.dataset.full==='true';});
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
