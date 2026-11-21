/**
 * 무기 표. 숫자는 여기서만 고친다.
 * radius: 피해 반경, carve: 흙을 파는 반경, rockMul: 암석·성벽을 파는 비율(1이면 흙과 같음)
 */
export type ImpactBehavior = 'shell' | 'pierce' | 'bounce' | 'bounceBurst' | 'lightning' | 'split' | 'mega';
export type FirePattern = 'single' | 'triple' | 'salvo';

export interface WeaponDef {
  id: string;
  name: string;
  desc: string;
  behavior: ImpactBehavior;
  pattern: FirePattern;
  speedMul: number;
  gravityMul: number;
  windMul: number;
  radius: number;
  carve: number;
  rockMul: number;
  damage: number;
  directBonus: number;
  knockback: number;
  count?: number;
  spreadDeg?: number;
  salvoGap?: number;
  salvoPowerStep?: number;
  bounces?: number;
  restitution?: number;
  fuse?: number;
  pierceDepth?: number;
  childCount?: number;
  childSpread?: number;
  childDamage?: number;
  childRadius?: number;
  childCarve?: number;
  burstDamage?: number;
  burstRadius?: number;
  burstCarve?: number;
  strikes?: number;
  strikeDelay?: number;
  strikeGap?: number;
  strikeSpacing?: number;
  strikeDamage?: number;
  strikeRadius?: number;
  strikeCarve?: number;
  fragments?: number;
  fragDamage?: number;
  fragRadius?: number;
  fragCarve?: number;
  // 화면용
  look: 'ball' | 'arrow' | 'bomb' | 'paper' | 'iron' | 'fox' | 'goblinfire' | 'megabomb';
  color: number;
  glow: number;
  size: number;
}

export const WEAPONS: Record<string, WeaponDef> = {
  hwapo: {
    id: 'hwapo', name: '화포탄', desc: '묵직하게 날아가 넓게 터집니다. 흙을 크게 파냅니다.',
    behavior: 'shell', pattern: 'single', speedMul: 1, gravityMul: 1, windMul: 1,
    radius: 66, carve: 60, rockMul: 0.62, damage: 158, directBonus: 1.1, knockback: 250,
    look: 'ball', color: 0x3a3330, glow: 0xff9a3c, size: 7,
  },
  jincheonroe: {
    id: 'jincheonroe', name: '대폭발 진천뢰', desc: '땅에 박힌 뒤 심지가 타들어 가다 크게 터지고 쇳조각이 사방으로 튑니다.',
    behavior: 'mega', pattern: 'single', speedMul: 0.97, gravityMul: 1.05, windMul: 0.9,
    radius: 104, carve: 96, rockMul: 0.8, damage: 212, directBonus: 1.0, knockback: 430,
    fuse: 1.1, fragments: 6, fragDamage: 16, fragRadius: 24, fragCarve: 16,
    look: 'megabomb', color: 0x2a2624, glow: 0xffd166, size: 11,
  },
  arrow: {
    id: 'arrow', name: '관통 화살', desc: '빠르고 바람을 덜 탑니다. 흙을 뚫고 들어가 안에서 터집니다.',
    behavior: 'pierce', pattern: 'single', speedMul: 1.2, gravityMul: 0.78, windMul: 0.4,
    radius: 42, carve: 30, rockMul: 0.7, damage: 150, directBonus: 1.3, knockback: 160, pierceDepth: 84,
    look: 'arrow', color: 0xf3e9d2, glow: 0x9ad8ff, size: 6,
  },
  samyeonsi: {
    id: 'samyeonsi', name: '삼연시', desc: '화살 세 대를 부채꼴로 한꺼번에 쏩니다.',
    behavior: 'pierce', pattern: 'triple', speedMul: 1.2, gravityMul: 0.78, windMul: 0.4,
    radius: 36, carve: 26, rockMul: 0.7, damage: 100, directBonus: 1.3, knockback: 130, pierceDepth: 62,
    count: 3, spreadDeg: 3.2,
    look: 'arrow', color: 0xfff4c2, glow: 0x66e0ff, size: 6,
  },
  dokkaebiBomb: {
    id: 'dokkaebiBomb', name: '도깨비 폭탄', desc: '땅에 두 번 튀고 나서 터집니다. 맞으면 바로 터집니다.',
    behavior: 'bounce', pattern: 'single', speedMul: 1, gravityMul: 1.05, windMul: 0.9,
    radius: 70, carve: 60, rockMul: 0.62, damage: 184, directBonus: 1.15, knockback: 260,
    bounces: 2, restitution: 0.42, fuse: 4.2,
    look: 'bomb', color: 0x3d2f5a, glow: 0x9cff6b, size: 8,
  },
  dokkaebiFire: {
    id: 'dokkaebiFire', name: '튕기는 도깨비불', desc: '네 번 튀면서 닿는 곳마다 작게 터지고, 마지막에 한 번 더 크게 터집니다.',
    behavior: 'bounceBurst', pattern: 'single', speedMul: 1, gravityMul: 1, windMul: 1.1,
    radius: 58, carve: 48, rockMul: 0.62, damage: 110, directBonus: 1.1, knockback: 220,
    bounces: 4, restitution: 0.6, fuse: 6,
    burstDamage: 72, burstRadius: 44, burstCarve: 32,
    look: 'goblinfire', color: 0x6dff9e, glow: 0x2ee6a6, size: 8,
  },
  bujeok: {
    id: 'bujeok', name: '부적탄', desc: '종이 부적이라 바람을 덜 타고, 맞은 자리를 단단히 흔듭니다.',
    behavior: 'shell', pattern: 'single', speedMul: 0.98, gravityMul: 0.94, windMul: 0.6,
    radius: 52, carve: 48, rockMul: 0.7, damage: 138, directBonus: 1.15, knockback: 230,
    look: 'paper', color: 0xf7d354, glow: 0xff5a5a, size: 7,
  },
  nakroe: {
    id: 'nakroe', name: '낙뢰 부적', desc: '떨어진 자리 둘레로 벼락이 세 번 내리칩니다. 벼락은 하늘에서 수직으로 꽂힙니다.',
    behavior: 'lightning', pattern: 'single', speedMul: 0.98, gravityMul: 0.94, windMul: 0.6,
    radius: 36, carve: 30, rockMul: 0.7, damage: 64, directBonus: 1.1, knockback: 160,
    strikes: 3, strikeDelay: 0.45, strikeGap: 0.24, strikeSpacing: 62, strikeDamage: 70, strikeRadius: 36, strikeCarve: 30,
    look: 'paper', color: 0xfff0a0, glow: 0x8fb8ff, size: 8,
  },
  iron: {
    id: 'iron', name: '철갑 포탄', desc: '무겁고 바람을 거의 타지 않습니다. 단단한 바위도 흙처럼 부숩니다.',
    behavior: 'shell', pattern: 'single', speedMul: 1.04, gravityMul: 1.12, windMul: 0.45,
    radius: 50, carve: 42, rockMul: 1.0, damage: 156, directBonus: 1.2, knockback: 300,
    look: 'iron', color: 0x59606b, glow: 0xffc36b, size: 7,
  },
  salvo: {
    id: 'salvo', name: '연속 화포', desc: '포탄 세 발을 힘을 조금씩 바꿔 연달아 쏩니다.',
    behavior: 'shell', pattern: 'salvo', speedMul: 1.04, gravityMul: 1.12, windMul: 0.45,
    radius: 46, carve: 40, rockMul: 0.95, damage: 86, directBonus: 1.15, knockback: 220,
    count: 3, salvoGap: 0.32, salvoPowerStep: 3.2,
    look: 'iron', color: 0x6b7380, glow: 0xff8b3d, size: 7,
  },
  foxfire: {
    id: 'foxfire', name: '여우불', desc: '가볍게 떠서 날아갑니다. 바람을 많이 타니 바람을 읽고 쏘세요.',
    behavior: 'shell', pattern: 'single', speedMul: 0.96, gravityMul: 0.82, windMul: 1.7,
    radius: 48, carve: 42, rockMul: 0.62, damage: 142, directBonus: 1.15, knockback: 210,
    look: 'fox', color: 0x7fd8ff, glow: 0x4f8cff, size: 8,
  },
  foxSplit: {
    id: 'foxSplit', name: '분열 여우불', desc: '가장 높이 올라간 순간 다섯 갈래로 갈라져 넓게 떨어집니다.',
    behavior: 'split', pattern: 'single', speedMul: 0.96, gravityMul: 0.82, windMul: 1.4,
    radius: 48, carve: 40, rockMul: 0.62, damage: 110, directBonus: 1.1, knockback: 200,
    childCount: 5, childSpread: 72, childDamage: 56, childRadius: 38, childCarve: 32,
    look: 'fox', color: 0xc2a2ff, glow: 0xff7ad9, size: 9,
  },
};

export function weapon(id: string): WeaponDef {
  const w = WEAPONS[id];
  if (!w) throw new Error(`알 수 없는 무기: ${id}`);
  return w;
}
