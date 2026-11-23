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
  /** 날아가다 이 거리(px) 안에 상대가 들어오면 그쪽으로 휘어 든다 */
  seekRange?: number;
  seekAcc?: number;
  cloudRadius?: number;
  cloudDamage?: number;
  cloudTurns?: number;
  use: string;
  // 화면용
  look: 'ball' | 'arrow' | 'bomb' | 'paper' | 'iron' | 'fox' | 'goblinfire' | 'megabomb' | 'rocket' | 'poison';
  color: number;
  glow: number;
  size: number;
}

export const WEAPONS: Record<string, WeaponDef> = {
  hwapo: {
    id: 'hwapo', name: '대형 화포탄', use: '넓은 땅파기', desc: '피해보다 지형 파괴에 집중한 넓은 포탄. 발밑을 무너뜨릴 때 고르세요.',
    behavior: 'shell', pattern: 'single', speedMul: 1, gravityMul: 1, windMul: 1,
    radius: 78, carve: 82, rockMul: 0.62, damage: 146, directBonus: 1.1, knockback: 230,
    look: 'ball', color: 0x3a3330, glow: 0xff9a3c, size: 7,
  },
  jincheonroe: {
    id: 'jincheonroe', name: '집중 진천뢰', use: '좁고 강한 직격', desc: '좁은 곳에 화력을 모읍니다. 직격은 강하고, 빗나가면 피해와 땅파기가 작습니다.',
    behavior: 'mega', pattern: 'single', speedMul: 0.97, gravityMul: 1.05, windMul: 0.9,
    radius: 46, carve: 32, rockMul: 0.8, damage: 236, directBonus: 1.22, knockback: 290,
    fuse: 0.65, fragments: 4, fragDamage: 10, fragRadius: 17, fragCarve: 10,
    look: 'megabomb', color: 0x2a2624, glow: 0xffd166, size: 11,
  },
  arrow: {
    id: 'arrow', name: '관통 화살', use: '정밀 관통', desc: '빠르고 바람을 덜 탑니다. 흙을 뚫고 들어가 안에서 터집니다.',
    behavior: 'pierce', pattern: 'single', speedMul: 1.2, gravityMul: 0.78, windMul: 0.4,
    radius: 42, carve: 30, rockMul: 0.7, damage: 150, directBonus: 1.3, knockback: 160, pierceDepth: 84,
    look: 'arrow', color: 0xf3e9d2, glow: 0x9ad8ff, size: 6,
  },
  samyeonsi: {
    id: 'samyeonsi', name: '집중 삼연시', use: '세 발 집중', desc: '좁은 부채꼴로 세 발을 쏩니다. 여러 발을 함께 맞히면 강하고, 깊은 관통은 1번보다 짧습니다.',
    behavior: 'pierce', pattern: 'triple', speedMul: 1.2, gravityMul: 0.78, windMul: 0.4,
    radius: 38, carve: 24, rockMul: 0.7, damage: 92, directBonus: 1.2, knockback: 55, pierceDepth: 54,
    count: 3, spreadDeg: 1.25,
    look: 'arrow', color: 0xfff4c2, glow: 0x66e0ff, size: 6,
  },
  dokkaebiBomb: {
    id: 'dokkaebiBomb', name: '도깨비 폭탄', use: '강하게 밀기', desc: '땅에 두 번 튀고 나서 터집니다. 맞으면 바로 터집니다. 낭떠러지로 밀 때 좋습니다.',
    behavior: 'bounce', pattern: 'single', speedMul: 1, gravityMul: 1.05, windMul: 0.9,
    radius: 70, carve: 60, rockMul: 0.62, damage: 184, directBonus: 1.15, knockback: 260,
    bounces: 2, restitution: 0.42, fuse: 4.2,
    look: 'bomb', color: 0x3d2f5a, glow: 0x9cff6b, size: 8,
  },
  dokkaebiFire: {
    id: 'dokkaebiFire', name: '난타 도깨비불', use: '반복 타격', desc: '세 번 튀며 닿는 곳마다 때리고 마지막에 터집니다. 한 지역을 반복 공격하고 땅은 덜 팝니다.',
    behavior: 'bounceBurst', pattern: 'single', speedMul: 1, gravityMul: 1, windMul: 1.1,
    radius: 62, carve: 40, rockMul: 0.62, damage: 150, directBonus: 1.1, knockback: 150,
    bounces: 3, restitution: 0.5, fuse: 5,
    burstDamage: 75, burstRadius: 58, burstCarve: 16,
    look: 'goblinfire', color: 0x6dff9e, glow: 0x2ee6a6, size: 8,
  },
  bujeok: {
    id: 'bujeok', name: '유도 부적탄', use: '가까이서 유도', desc: '종이 부적이라 바람을 덜 타고, 상대 곁을 지나가면 그쪽으로 휘어 듭니다.',
    behavior: 'shell', pattern: 'single', speedMul: 0.98, gravityMul: 0.94, windMul: 0.6,
    radius: 52, carve: 48, rockMul: 0.7, damage: 138, directBonus: 1.15, knockback: 230,
    seekRange: 130, seekAcc: 1100,
    look: 'paper', color: 0xf7d354, glow: 0xff5a5a, size: 7,
  },
  nakroe: {
    id: 'nakroe', name: '삼중 낙뢰', use: '위에서 세 번', desc: '떨어진 자리 둘레로 벼락이 빠르게 세 번 내리칩니다. 위가 열린 상대와 여러 명이 모인 자리를 노리세요.',
    behavior: 'lightning', pattern: 'single', speedMul: 0.98, gravityMul: 0.94, windMul: 0.6,
    radius: 38, carve: 26, rockMul: 0.7, damage: 60, directBonus: 1.1, knockback: 65,
    strikes: 3, strikeDelay: 0.24, strikeGap: 0.16, strikeSpacing: 38, strikeDamage: 78, strikeRadius: 52, strikeCarve: 28,
    look: 'paper', color: 0xfff0a0, glow: 0x8fb8ff, size: 8,
  },
  iron: {
    id: 'iron', name: '철갑 포탄', use: '암석 파괴', desc: '무겁고 바람을 거의 타지 않습니다. 단단한 바위도 흙처럼 부숩니다.',
    behavior: 'shell', pattern: 'single', speedMul: 1.04, gravityMul: 1.12, windMul: 0.45,
    radius: 56, carve: 46, rockMul: 1.0, damage: 172, directBonus: 1.2, knockback: 300,
    look: 'iron', color: 0x59606b, glow: 0xffc36b, size: 7,
  },
  salvo: {
    id: 'salvo', name: '집중 연속 화포', use: '세 발 연속', desc: '힘을 조금씩 바꿔 세 발을 빠르게 쏩니다. 밀어내는 힘을 줄여 후속탄도 맞히기 쉽습니다.',
    behavior: 'shell', pattern: 'salvo', speedMul: 1.04, gravityMul: 1.12, windMul: 0.45,
    radius: 51, carve: 30, rockMul: 0.75, damage: 96, directBonus: 1.15, knockback: 65,
    count: 3, salvoGap: 0.16, salvoPowerStep: 0.65,
    look: 'iron', color: 0x6b7380, glow: 0xff8b3d, size: 7,
  },
  foxfire: {
    id: 'foxfire', name: '여우불', use: '한 발 집중', desc: '가볍게 떠서 날아갑니다. 바람을 많이 타니 바람을 읽고 쏘세요.',
    behavior: 'shell', pattern: 'single', speedMul: 0.96, gravityMul: 0.82, windMul: 1.7,
    radius: 53, carve: 44, rockMul: 0.62, damage: 156, directBonus: 1.15, knockback: 210,
    look: 'fox', color: 0x7fd8ff, glow: 0x4f8cff, size: 8,
  },
  foxSplit: {
    id: 'foxSplit', name: '분열 여우불', use: '다섯 갈래 폭격', desc: '꼭대기에서 다섯 갈래로 갈라집니다. 퍼지는 폭을 줄여 같은 지역을 겹쳐 때립니다.',
    behavior: 'split', pattern: 'single', speedMul: 0.96, gravityMul: 0.82, windMul: 1.4,
    radius: 48, carve: 40, rockMul: 0.62, damage: 110, directBonus: 1.1, knockback: 200,
    childCount: 5, childSpread: 42, childDamage: 62, childRadius: 43, childCarve: 26,
    look: 'fox', color: 0xc2a2ff, glow: 0xff7ad9, size: 9,
  },
  singijeon: {
    id: 'singijeon', name: '삼연 신기전', use: '세 발 집중', desc: '신기전 세 발을 거의 같은 궤도로 쏩니다. 한 곳에 모아 맞히면 강합니다.',
    behavior: 'shell', pattern: 'salvo', speedMul: 1.08, gravityMul: 0.96, windMul: 0.8,
    radius: 40, carve: 34, rockMul: 0.7, damage: 82, directBonus: 1.18, knockback: 45,
    count: 3, salvoGap: 0.1, salvoPowerStep: 0.3,
    look: 'rocket', color: 0xe59a51, glow: 0xffb357, size: 6,
  },
  hwachaStorm: {
    id: 'hwachaStorm', name: '구룡 화차', use: '아홉 발 범위 포격', desc: '아홉 발을 부채꼴로 펼칩니다. 한 발 피해는 작지만 넓은 비탈과 모인 상대를 훑습니다.',
    behavior: 'shell', pattern: 'triple', speedMul: 1.08, gravityMul: 0.96, windMul: 0.8,
    radius: 34, carve: 25, rockMul: 0.7, damage: 36, directBonus: 1.12, knockback: 20,
    count: 9, spreadDeg: 1.65,
    look: 'rocket', color: 0xffc46a, glow: 0xff794d, size: 5,
  },
  venomJar: {
    id: 'venomJar', name: '맹독 항아리', use: '묵직한 한 방', desc: '무거운 항아리가 깨지며 강하게 때립니다. 독구름 없이 즉시 피해를 주는 탄입니다.',
    behavior: 'shell', pattern: 'single', speedMul: 0.94, gravityMul: 1.1, windMul: 0.7,
    radius: 63, carve: 49, rockMul: 0.65, damage: 178, directBonus: 1.16, knockback: 180,
    look: 'poison', color: 0xa6e254, glow: 0x91d65b, size: 9,
  },
  poisonCloud: {
    id: 'poisonCloud', name: '자욱한 독무', use: '세 차례 자리 압박', desc: '작게 터진 뒤 독구름이 남습니다. 구름 속에서 자기 차례를 맞으면 48 피해. 장수별 세 차례까지 남고, 걸어 나오면 피합니다. 아군도 주의하세요.',
    behavior: 'shell', pattern: 'single', speedMul: 0.94, gravityMul: 1.1, windMul: 0.7,
    radius: 55, carve: 24, rockMul: 0.5, damage: 85, directBonus: 1.05, knockback: 35,
    cloudRadius: 130, cloudDamage: 48, cloudTurns: 3,
    look: 'poison', color: 0xd2fa79, glow: 0x9bdf64, size: 9,
  },
};

export function weapon(id: string): WeaponDef {
  const w = WEAPONS[id];
  if (!w) throw new Error(`알 수 없는 무기: ${id}`);
  return w;
}
