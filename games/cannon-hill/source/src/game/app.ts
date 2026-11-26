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

function viewWidth(): number {
  const w = window.innerWidth || 1280, h = window.innerHeight || 720;
  return Math.round(Math.min(VIEW_W_MAX, Math.max(VIEW_W_MIN, (VIEW_H * w) / h)));
}

export class App {
  settings: Settings;
  ui: UI;
  game!: Phaser.Game;
  mode: Mode = 'ai';
  private target: TargetRange | null = null;
  last: { mode: Mode; chars: string[]; mapId: string; starterMatch: boolean } | null = null;

  constructor() {
    this.settings = loadSettings();
    audio.setVolumes(this.settings.bgm, this.settings.sfx);
    this.ui = new UI(document.getElementById('ui')!, this.settings, {
      startBattle: (mode, chars, mapId) => this.startBattle(mode, chars, mapId),
      quickBattle: () => this.startBattle('ai', ['general', 'archer'], 'quarry', true),
      targetRange: () => this.openTargetRange(),
      toTitle: () => this.toTitle(),
      rematch: () => this.rematch(),
      rechar: () => { this.toTitle(); this.ui.openChars(this.last?.mode ?? 'ai'); },
      resume: () => this.resume(),
      restart: () => this.rematch(),
      pause: () => this.pause(),
      weapon: (slot) => this.battleScene()?.selectWeapon(slot),
      flip: () => this.battleScene()?.flip(),
      camera: () => this.battleScene()?.cycleCamera(),
      recenter: () => this.battleScene()?.recenter(),
      settingsChanged: (s) => this.applySettings(s),
    });
  }

  private rematch(): void {
    if (!this.last) return;
    const {mode, chars, mapId, starterMatch} = this.last;
    this.startBattle(mode, chars, mapId, starterMatch);
  }

  boot(): void {
    this.game = new Phaser.Game({
      type: Phaser.AUTO,
      parent: 'game',
      backgroundColor: '#0d0a09',
      width: viewWidth(),
      height: VIEW_H,
      scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
      render: { antialias: true, pixelArt: false, roundPixels: false, powerPreference: 'high-performance' },
      fps: { target: 60, smoothStep: true },
      input: { activePointers: 3 },
      disableContextMenu: true,
      banner: false,
      scene: [BootScene, TitleScene, BattleScene],
      callbacks: { preBoot: (g) => g.registry.set('app', this) },
    });
    let rt = 0;
    window.addEventListener('resize', () => {
      window.clearTimeout(rt);
      rt = window.setTimeout(() => {
        const w = viewWidth();
        if (Math.abs(w - this.game.scale.width) > 2) this.game.scale.setGameSize(w, VIEW_H);
        else this.game.scale.refresh();
      }, 120);
    });
    document.addEventListener('visibilitychange', () => {
      audio.suspend(document.hidden);
      // 탭을 가리면 멈추기만 한다(이미 멈춰 있으면 그대로 둔다)
      if (document.hidden) this.pauseOnly();
    });
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
  startBattle(mode: Mode, chars: string[], mapId: string, starterMatch = false): void {
    this.mode = mode;
    this.ui.mode = mode;
    this.last = { mode, chars, mapId, starterMatch };
    if (!starterMatch) {
      const keep = [...this.settings.lastChars];
      chars.forEach((c, i) => (keep[i] = c));
      this.settings.lastChars = keep;
      this.settings.lastMap = mapId;
      saveSettings(this.settings);
    }
    const seed = (Math.random() * 2 ** 31) | 0;
    const perTeam = chars.length / 2;
    const cfg: BattleConfig = {
      mapId, seed, chars,
      // AI 대전: 1팀(짝수 자리)은 사람, 2팀은 AI. 둘이서: 모두 사람
      controllers: chars.map((_, i) => (mode === 'ai' && i % 2 === 1 ? 'ai' : 'human')),
      difficulty: starterMatch ? 'easy' : this.settings.difficulty,
      turnTime: starterMatch ? 45 : this.settings.turnTime,
      // 2:2는 장수 한 명이 쏘는 횟수가 1:1과 같도록 전체 턴을 늘린다
      turnLimit: starterMatch ? 0 : this.settings.turnLimit * perTeam,
      starterMatch,
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

  toTitle(): void {
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
    requestAnimationFrame(() => this.game.scale.refresh());
    window.setTimeout(() => this.game.scale.refresh(), 120);
  }

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
