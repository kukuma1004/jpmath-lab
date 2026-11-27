import { CHARACTERS } from '../data/characters';
import { MAPS } from '../data/maps';
import type { OnlineClient } from './client';
import './online.css';

export class OnlineLobby {
  private readonly root = document.createElement('section');
  private register = false;
  private busy = false;
  private message = '';

  constructor(container: HTMLElement, private readonly client: OnlineClient, close: () => void) {
    this.root.className='online-lobby';
    this.root.setAttribute('aria-label','온라인 1:1');
    this.root.innerHTML=`
      <div class="online-panel">
        <header><h2>온라인 1:1</h2><button class="btn ghost" data-act="close">← 처음 화면</button></header>
        <p class="online-message" role="status"></p>
        <form class="online-auth">
          <label>아이디<input name="id" autocomplete="username" minlength="3" maxlength="20" required></label>
          <label>비밀번호<input name="password" type="password" autocomplete="current-password" minlength="8" maxlength="80" required></label>
          <label data-register hidden>닉네임<input name="nickname" autocomplete="nickname" minlength="2" maxlength="12"></label>
          <div class="online-actions"><button class="btn primary" type="submit">로그인</button><button class="btn" type="button" data-act="toggle">계정 만들기</button></div>
        </form>
        <div class="online-signed" hidden>
          <div class="online-profile"><strong data-profile></strong><button class="btn ghost" data-act="logout">로그아웃</button></div>
          <div class="online-options">
            <label>내 장수<select name="char">${CHARACTERS.map(c=>`<option value="${c.id}">${c.name}</option>`).join('')}</select></label>
            <section>
              <h3>친선전</h3>
              <label>전장<select name="map">${MAPS.map(m=>`<option value="${m.id}">${m.name}</option>`).join('')}</select></label>
              <button class="btn jade" data-act="create">방 만들기</button>
              <form class="online-join">
                <label>방 코드<input name="code" maxlength="6" minlength="6" autocomplete="off" autocapitalize="characters" required></label>
                <button class="btn" type="submit">방 참가</button>
              </form>
            </section>
            <section class="ranked-options"${client.ranked?'':' hidden'}>
              <h3>공개 랭킹전</h3>
              <button class="btn primary" data-act="queue">상대 찾기</button>
              <button class="btn" data-act="rankings">누적 순위</button>
            </section>
          </div>
          <section class="online-wait" hidden>
            <p data-wait></p><strong data-code></strong>
            <div class="online-actions"><button class="btn jade" data-act="copy" hidden>코드 복사</button><button class="btn" data-act="leave">대기 취소</button></div>
          </section>
          <ol class="online-board" aria-label="온라인 대전 누적 순위" hidden></ol>
        </div>
      </div>`;
    container.append(this.root);
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
      const action=(event.target as HTMLElement).closest<HTMLButtonElement>('[data-act]')?.dataset.act;
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
        void this.run(()=>this.client.lobby('create',{char:this.pick(),map:this.select<HTMLSelectElement>('select[name=map]').value}));
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
            li.textContent=`${row.nickname} · ${row.rating}점 · ${row.wins}승 ${row.draws}무 ${row.losses}패`;
            return li;
          }));
          this.message=rows.length?'':'첫 랭킹전 기록을 기다리고 있어요.';
          board.hidden=!rows.length;
        });
      }
    });
    this.render();
  }

  destroy(): void { this.root.remove(); }

  private select<T extends HTMLElement = HTMLElement>(selector:string):T {
    return this.root.querySelector<T>(selector)!;
  }

  private pick(): string { return this.select<HTMLSelectElement>('select[name=char]').value; }

  render(): void {
    const state=this.client.state;
    const waiting=!!(state?.queued || state?.room);
    const message=this.message||this.client.error||(this.client.authenticated && !state ? '계정을 불러오는 중이에요.' : '');
    const status=this.select('.online-message');
    if(status.textContent!==message)status.textContent=message;
    this.select('.online-auth').hidden=this.client.authenticated;
    this.select('.online-signed').hidden=!state;
    if(!state)this.select('.online-board').hidden=true;
    if(state) this.select('[data-profile]').textContent=this.client.ranked
      ? `${state.profile.nickname} · ${state.profile.rating}점` : state.profile.nickname;
    this.select('.online-options').hidden=waiting;
    this.select('.online-wait').hidden=!waiting;
    this.select('[data-wait]').textContent=state?.queued?'랭킹전 상대를 기다리는 중':'친구가 방 코드를 입력할 때까지 기다리는 중';
    this.select('[data-code]').textContent=state?.room?.kind==='friendly'?state.room.code:'';
    this.select('[data-act=copy]').hidden=!state?.room?.code || state.room.kind!=='friendly' || !navigator.clipboard;
    this.root.querySelectorAll<HTMLButtonElement>('button').forEach(button=>{button.disabled=this.busy;});
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
