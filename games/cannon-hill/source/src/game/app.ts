import Phaser from 'phaser';
import { VIEW_H, VIEW_W_MAX, VIEW_W_MIN } from './config/constants';
import { CHARACTERS } from './data/characters';
import { MAPS, generateTerrain } from './data/maps';
import { makePortrait } from './art/characters';
import { bgSource, makeArtPortrait } from './art/artAssets';
import { TerrainPainter } from './render/terrainPainter';
import { loadSettings, saveSettings, type Settings } from './settings';
import { UI, type Mode } from './ui/ui';
import { audio } from './audio/audio';
import { BootScene } from './scenes/BootScene';
import { TitleScene } from './scenes/TitleScene';
import { BattleScene } from './scenes/BattleScene';
import type { BattleConfig } from './combat/types';
import { TargetRange } from './target/range';
import { OnlineClient, onlineEnabled } from './online/client';
import { OnlineLobby } from './online/lobby';

function viewWidth(): number {
  const w = window.innerWidth || 1280, h = window.innerHeight || 720;
  return Math.round(Math.min(VIEW_W_MAX, Math.max(VIEW_W_MIN, (VIEW_H * w) / h)));
}

const PORTRAIT_BATTLE = '(orientation: portrait) and (max-width: 820px)';

export class App {
  settings: Settings;
  ui: UI;
  game!: Phaser.Game;
  mode: Mode = 'ai';
  private target: TargetRange | null = null;
  private readonly online: OnlineClient | null = onlineEnabled ? new OnlineClient(() => this.onlineChanged()) : null;
  private lobby: OnlineLobby | null = null;
  private onlinePlaying = false;
  private leavingOnline = false;
  private field = document.querySelector<HTMLElement>('#game')!;
  private resizeFrame = 0;
  last: { mode: Mode; chars: string[]; mapId: string; starterMatch: boolean; freeForAll: boolean } | null = null;

  constructor() {
    this.settings = loadSettings();
    audio.setVolumes(this.settings.bgm, this.settings.sfx);
    this.ui = new UI(document.getElementById('ui')!, this.settings, {
      startBattle: (mode, chars, mapId, freeForAll) => this.startBattle(mode, chars, mapId, false, freeForAll),
      quickBattle: () => this.startBattle('ai', ['general', 'archer'], 'quarry', true),
      targetRange: () => this.openTargetRange(),
      online: this.online ? () => this.openOnline() : undefined,
      onlineGroups: this.online?.groups,
      toTitle: () => this.toTitle(),
      rematch: () => this.rematch(),
      rechar: () => { this.toTitle(); this.ui.openChars(this.last?.mode ?? 'ai'); },
      resume: () => this.resume(),
      restart: () => this.rematch(),
      pause: () => this.pause(),
      weapon: (slot) => this.battleScene()?.selectWeapon(slot),
      flip: () => this.battleScene()?.flip(),
      fire: () => this.battleScene()?.pressFire(),
      camera: () => this.battleScene()?.toggleOverview(),
      recenter: () => this.battleScene()?.recenter(),
      settingsChanged: (s) => this.applySettings(s),
    });
  }

  private rematch(): void {
    if (this.onlinePlaying) { this.leaveOnline(true); return; }
    if (!this.last) return;
    const {mode, chars, mapId, starterMatch, freeForAll} = this.last;
    this.startBattle(mode, chars, mapId, starterMatch, freeForAll);
  }

  boot(): void {
    this.game = new Phaser.Game({
      type: Phaser.AUTO,
      parent: 'game',
      backgroundColor: '#0d0a09',
      width: viewWidth(),
      height: VIEW_H,
      scale: { mode: Phaser.Scale.FIT, expandParent: false },
      render: { antialias: true, pixelArt: false, roundPixels: false, powerPreference: 'high-performance' },
      fps: { target: 60, smoothStep: true },
      input: { activePointers: 3 },
      disableContextMenu: true,
      banner: false,
      scene: [BootScene, TitleScene, BattleScene],
      callbacks: { preBoot: (g) => g.registry.set('app', this) },
    });
    const stage = document.querySelector<HTMLElement>('.battle-window')!;
    const queueResize = () => {
      if (this.resizeFrame) return;
      this.resizeFrame = requestAnimationFrame(() => {
        this.resizeFrame = 0;
        let width = viewWidth();
        if (this.portraitBattle) {
          const viewportHeight = window.visualViewport?.height ?? window.innerHeight;
          document.body.style.setProperty('--visible-height', `${Math.floor(viewportHeight)}px`);
          document.body.style.setProperty('--field-top', `${stage.offsetTop}px`);
          document.body.style.setProperty('--field-height', `${stage.offsetHeight}px`);
          if (stage.offsetHeight > 0)
            width = Math.round(Math.min(VIEW_W_MAX, Math.max(360, (VIEW_H * this.field.clientWidth) / stage.offsetHeight)));
        }
        if (width !== this.game.scale.width) this.game.scale.setGameSize(width, VIEW_H);
        else this.game.scale.refresh();
      });
    };
    new ResizeObserver(queueResize).observe(stage);
    window.addEventListener('resize', queueResize);
    window.visualViewport?.addEventListener('resize', queueResize);
    this.resizeBattle = queueResize;
    document.addEventListener('visibilitychange', () => {
      audio.suspend(document.hidden);
      // 탭을 가리면 멈추기만 한다(이미 멈춰 있으면 그대로 둔다)
      if (document.hidden && !this.onlinePlaying) this.pauseOnly();
    });
  }

  get portraitBattle(): boolean {
    return document.body.classList.contains('in-battle') && matchMedia(PORTRAIT_BATTLE).matches;
  }

  battleScene(): BattleScene | null {
    const s = this.game?.scene.getScene('battle') as BattleScene | null;
    return s && this.game.scene.isActive('battle') ? s : null;
  }

  onBooted(): void {
    const tex = this.game.textures;
    for (const c of CHARACTERS) {
      const art = makeArtPortrait(tex, c.id, 256);
      if (art) {
        this.ui.portraits[c.id] = {
          normal: art,
          happy: art,
          hurt: art,
          flip: makeArtPortrait(tex, c.id, 256, { flip: true })!,
          bust: makeArtPortrait(tex, c.id, 128, { bust: true })!,
          bustFlip: makeArtPortrait(tex, c.id, 128, { bust: true, flip: true })!,
        };
        continue;
      }
      const normal = makePortrait(c.id, 192, 'normal');
      const flip = makePortrait(c.id, 192, 'normal', true);
      this.ui.portraits[c.id] = { normal, happy: makePortrait(c.id, 192, 'happy'), hurt: makePortrait(c.id, 192, 'hurt'), flip, bust: normal, bustFlip: flip };
    }
    this.ui.hideLoading();
    this.ui.showTitle();
    audio.playBgm('title');
    // 전장 미리보기는 화면이 뜬 뒤 하나씩 천천히
    let i = 0;
    const next = () => {
      const m = MAPS[i++];
      if (!m) return;
      const t = generateTerrain(m, 1);
      this.ui.mapThumbs[m.id] = new TerrainPainter(t, m, 1).thumbnail(360, 180, m.sky, bgSource(tex, m.id));
      window.setTimeout(next, 30);
    };
    window.setTimeout(next, 200);
  }

  private applySettings(s: Settings): void {
    saveSettings(s);
    audio.setVolumes(s.bgm, s.sfx);
    const bs = this.battleScene();
    if (bs) {
      bs.effects.shakeK = s.shake;
      bs.effects.quality = s.quality === 'low' ? 0.4 : s.quality === 'high' ? 1.35 : 1;
    }
  }

  /** chars는 장수 순서([1팀, 2팀] 또는 [1팀, 2팀, 1팀, 2팀]) */
  startBattle(mode: Mode, chars: string[], mapId: string, starterMatch = false, freeForAll = false): void {
    this.mode = mode;
    this.ui.mode = mode;
    this.last = { mode, chars, mapId, starterMatch, freeForAll };
    if (!starterMatch) {
      const keep = [...this.settings.lastChars];
      chars.forEach((c, i) => (keep[i] = c));
      this.settings.lastChars = keep;
      this.settings.lastMap = mapId;
      saveSettings(this.settings);
    }
    const seed = (Math.random() * 2 ** 31) | 0;
    const cfg: BattleConfig = {
      mapId, seed, chars,
      // AI 개인전에서는 1P만, AI 팀전에서는 1팀 장수만 사람이 조작한다.
      controllers: chars.map((_, i) => (mode === 'ai' && (freeForAll ? i > 0 : i % 2 === 1) ? 'ai' : 'human')),
      difficulty: starterMatch ? 'easy' : this.settings.difficulty,
      turnTime: starterMatch ? 45 : this.settings.turnTime,
      // 네 명이 싸우는 판정전은 한 장수가 쏘는 횟수를 맞추기 위해 턴 수를 두 배로 둔다.
      turnLimit: starterMatch ? 0 : this.settings.turnLimit * (chars.length / 2),
      starterMatch,
      freeForAll,
    };
    this.ui.hideResult();
    this.ui.show('pause', false);
    const sm = this.game.scene;
    if (sm.isActive('title')) sm.stop('title');
    if (sm.isActive('battle') || sm.isPaused('battle')) sm.stop('battle');
    sm.start('battle', { cfg, mode });
    this.setBattleLayout(true);
    audio.playBgm('battle');
  }

  private openTargetRange(): void {
    if (this.target) return;
    this.game.scene.stop('title');
    this.ui.only();
    const gunner = makeArtPortrait(this.game.textures, 'general', 192, { bodyOnly: true });
    this.target = new TargetRange(this.ui.root, gunner ?? this.ui.portraits.general?.normal ?? '', () => {
      this.toTitle();
      this.ui.root.querySelector<HTMLButtonElement>('.target-entry')?.focus();
    });
    audio.playBgm('battle');
  }

  private openOnline(): void {
    if (!this.online || this.lobby) return;
    this.ui.only();
    this.lobby = new OnlineLobby(this.ui.root,this.online,() => this.showTitleScreen());
    this.online.start();
  }

  private onlineChanged(): void {
    const client=this.online;
    this.lobby?.render();
    const room=client?.room;
    if (!client || !this.lobby || !room?.config || this.leavingOnline) return;
    this.lobby.destroy();
    this.lobby=null;
    this.onlinePlaying=true;
    document.body.classList.add('online-match');
    this.ui.mode='local';
    this.ui.hideResult();
    const sm=this.game.scene;
    sm.stop('title');
    sm.start('battle',{cfg:room.config,mode:'local',online:client});
    this.setBattleLayout(true);
    audio.playBgm('battle');
  }

  private leaveOnline(lobby: boolean): void {
    if (this.leavingOnline) return;
    this.leavingOnline=true;
    void this.online?.leave().catch(() => {
      // When the connection is already lost, the server handles the reconnect window.
    }).finally(() => {
      this.leavingOnline=false;
      this.showTitleScreen();
      if (lobby) this.openOnline();
    });
  }

  toTitle(): void {
    if (this.onlinePlaying) {
      if (this.online?.room && !this.online.room.done && !window.confirm('온라인 대전에서 나가면 기권패로 처리돼요. 나갈까요?')) return;
      this.leaveOnline(false);
      return;
    }
    this.showTitleScreen();
  }

  private showTitleScreen(): void {
    this.lobby?.destroy();
    this.lobby=null;
    this.online?.stop();
    this.onlinePlaying=false;
    document.body.classList.remove('online-match');
    this.target?.destroy();
    this.target = null;
    const sm = this.game.scene;
    if (sm.isActive('battle') || sm.isPaused('battle')) sm.stop('battle');
    if (!sm.isActive('title')) sm.start('title');
    this.setBattleLayout(false);
    this.ui.showTitle();
    audio.playBgm('title');
  }

  /** 세로 화면에서는 전투 중에만 게임 화면을 위로 붙인다 */
  private setBattleLayout(on: boolean): void {
    document.body.classList.toggle('in-battle', on);
    this.resizeBattle();
  }

  private resizeBattle = () => {};

  /** Esc·정지 단추: 멈춤과 계속을 오간다 */
  pause(): void {
    const bs = this.battleScene();
    if (!bs || this.ui.isOn('result')) return;
    if (bs.paused && this.ui.isOn('pause')) { this.resume(); return; }
    this.pauseOnly();
  }

  /** 멈추기만 한다(탭 가림 등) */
  pauseOnly(): void {
    const bs = this.battleScene();
    if (!bs || this.ui.isOn('result')) return;
    bs.paused = true;
    bs.cancelFire();
    this.ui.show('pause');
  }

  resume(): void {
    const bs = this.battleScene();
    this.ui.show('pause', false);
    this.ui.show('settings', false);
    this.ui.show('howto', false);
    if (bs) bs.paused = false;
  }
}
