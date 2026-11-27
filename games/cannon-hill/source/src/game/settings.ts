import { STORAGE_PREFIX, TURN_LIMIT_DEFAULT, TURN_TIME_DEFAULT } from './config/constants';
import type { Difficulty } from './combat/types';

export type Quality = 'low' | 'medium' | 'high';

export interface Settings {
  bgm: number;
  sfx: number;
  quality: Quality;
  shake: number; // 0, 0.5, 1, 1.5
  trajectory: boolean;
  aimHints: boolean;
  difficulty: Difficulty;
  turnTime: number;
  turnLimit: number;
  battleRules: 2;
  /** 장수 순서는 [1팀 첫째, 2팀 첫째, 1팀 둘째, 2팀 둘째]. 1:1은 앞의 둘만 쓴다 */
  lastChars: string[];
  lastMap: string;
  teamSize: 1 | 2 | 'ffa';
}

const DEFAULTS: Settings = {
  bgm: 0.45,
  sfx: 0.8,
  quality: 'medium',
  shake: 1,
  trajectory: true,
  aimHints: true,
  difficulty: 'easy',
  turnTime: TURN_TIME_DEFAULT,
  turnLimit: TURN_LIMIT_DEFAULT,
  battleRules: 2,
  lastChars: ['general', 'archer', 'mudang', 'gumiho'],
  lastMap: 'sanseong',
  teamSize: 1,
};

const KEY = STORAGE_PREFIX + 'settings.v1';

function guessQuality(): Quality {
  try {
    const mobile = matchMedia('(pointer: coarse)').matches;
    const cores = navigator.hardwareConcurrency || 4;
    if (mobile && cores <= 4) return 'low';
    if (mobile) return 'medium';
    return cores >= 8 ? 'high' : 'medium';
  } catch {
    return 'medium';
  }
}

export function loadSettings(): Settings {
  let saved: Partial<Settings> = {};
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) saved = JSON.parse(raw) as Partial<Settings>;
  } catch {
    saved = {};
  }
  const s: Settings = { ...DEFAULTS, quality: guessQuality(), ...saved };
  // 값 범위 지키기
  s.bgm = Math.min(1, Math.max(0, Number(s.bgm) || 0));
  s.sfx = Math.min(1, Math.max(0, Number(s.sfx) || 0));
  if (!['low', 'medium', 'high'].includes(s.quality)) s.quality = 'medium';
  if (!['easy', 'normal', 'hard'].includes(s.difficulty)) s.difficulty = 'normal';
  if (typeof s.aimHints !== 'boolean') s.aimHints = true;
  if (![20, 30, 45].includes(s.turnTime)) s.turnTime = TURN_TIME_DEFAULT;
  if (saved?.battleRules !== 2 || ![0, 20, 30, 40].includes(s.turnLimit)) s.turnLimit = TURN_LIMIT_DEFAULT;
  s.battleRules = 2;
  if (!Array.isArray(s.lastChars) || (s.lastChars.length !== 2 && s.lastChars.length !== 4)) s.lastChars = [...DEFAULTS.lastChars];
  if (s.lastChars.length === 2) s.lastChars = [...s.lastChars, ...DEFAULTS.lastChars.slice(2)];
  if (s.teamSize !== 1 && s.teamSize !== 2 && s.teamSize !== 'ffa') s.teamSize = 1;
  return s;
}

export function saveSettings(s: Settings): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    /* 저장할 수 없는 브라우저에서도 게임은 그대로 돈다 */
  }
}

export function particleScale(q: Quality): number {
  return q === 'low' ? 0.4 : q === 'high' ? 1.35 : 1;
}
