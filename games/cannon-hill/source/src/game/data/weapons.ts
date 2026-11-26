/**
 * 무기 표. 숫자는 여기서만 고친다.
 * radius: 피해 반경, carve: 흙을 파는 반경, rockMul: 암석·성벽을 파는 비율(1이면 흙과 같음)
 */
export type ImpactBehavior = 'shell' | 'pierce' | 'drill' | 'bounce' | 'bounceBurst' | 'lightning' | 'split' | 'mega';
export type FirePattern = 'single' | 'triple' | 'salvo';

export interface WeaponDef {
  id: string;
  name: string;
  desc: string;
  behavior: ImpactBehavior;
  pattern: FirePattern;
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
  loftSeekRange?: number;
  seekTurnRate?: number;
  drillDepth?: number;
  drillRadius?: number;
  drillSpeed?: number;
  drillExit?: { gap: number; damage: number; radius: number };
  shelfCut?: { maxThickness: number; radius: number; followThrough?: string };
  cloudRadius?: number;
  cloudDamage?: number;
  cloudTurns?: number;
  use: string;
  renderScale?: number;
  // 화면용
  look: 'ball' | 'arrow' | 'bomb' | 'paper' | 'iron' | 'fox' | 'goblinfire' | 'megabomb' | 'rocket' | 'poison' | 'drill';
  color: number;
  glow: number;
  size: number;
}

export const WEAPONS: Record<string, WeaponDef> = {
  hwapo: {
    id: 'hwapo', name: '대형 화포탄', use: '넓은 땅파기', desc: '피해보다 지형 파괴에 집중한 넓은 포탄. 발밑을 무너뜨릴 때 고르세요.',
    behavior: 'shell', pattern: 'single',
    radius: 78, carve: 82, rockMul: 0.62, damage: 146, directBonus: 1.1, knockback: 230,
    look: 'ball', color: 0x3a3330, glow: 0xff9a3c, size: 7,
  },
  jincheonroe: {
    id: 'jincheonroe', name: '집중 진천뢰', use: '초고위력 직격', desc: '작고 좁은 탄에 화력을 몰았습니다. 몸에 직접 맞히면 막대한 피해를 주고, 조금 빗나가면 피해가 빠르게 줄어듭니다.',
    behavior: 'mega', pattern: 'single',
    radius: 28, carve: 22, rockMul: 0.8, damage: 310, directBonus: 1.65, knockback: 290,
    fuse: 0.22,
    look: 'megabomb', color: 0xb83335, glow: 0xffa17b, size: 6, renderScale: 0.65,
  },
  arrow: {
    id: 'arrow', name: '관통 화살', use: '정밀 관통', desc: '다른 탄과 같은 기본 궤도로 날아가며, 흙을 깊이 뚫고 들어가 안에서 터집니다.',
    behavior: 'pierce', pattern: 'single',
    radius: 42, carve: 30, rockMul: 0.7, damage: 150, directBonus: 1.3, knockback: 160, pierceDepth: 84,
    look: 'arrow', color: 0xf3e9d2, glow: 0x9ad8ff, size: 6,
  },
  samyeonsi: {
    id: 'samyeonsi', name: '집중 삼연시', use: '세 발 집중', desc: '좁은 부채꼴로 세 발을 쏩니다. 여러 발을 함께 맞히면 강하고, 깊은 관통은 1번보다 짧습니다.',
    behavior: 'pierce', pattern: 'triple',
    radius: 38, carve: 24, rockMul: 0.7, damage: 82, directBonus: 1.2, knockback: 55, pierceDepth: 54,
    count: 3, spreadDeg: 1.25,
    look: 'arrow', color: 0xfff4c2, glow: 0x66e0ff, size: 6,
  },
  dokkaebiBomb: {
    id: 'dokkaebiBomb', name: '도깨비 폭탄', use: '강하게 밀기', desc: '땅에 두 번 낮게 튀고 첫 착탄 부근에서 터집니다. 상대에게 맞으면 바로 터지고, 발판 밖으로 밀기 좋습니다.',
    behavior: 'bounce', pattern: 'single',
    radius: 70, carve: 60, rockMul: 0.62, damage: 192, directBonus: 1.15, knockback: 260,
    bounces: 2, restitution: 0.28, fuse: 4.2,
    look: 'bomb', color: 0x3d2f5a, glow: 0x9cff6b, size: 8,
  },
  dokkaebiFire: {
    id: 'dokkaebiFire', name: '난타 도깨비불', use: '반복 타격', desc: '세 번 튀며 닿는 곳마다 때리고 마지막에 터집니다. 한 지역을 반복 공격하고 땅은 덜 팝니다.',
    behavior: 'bounceBurst', pattern: 'single',
    radius: 62, carve: 40, rockMul: 0.62, damage: 150, directBonus: 1.1, knockback: 150,
    bounces: 3, restitution: 0.5, fuse: 5,
    burstDamage: 82, burstRadius: 65, burstCarve: 16,
    look: 'goblinfire', color: 0x6dff9e, glow: 0x2ee6a6, size: 8,
  },
  bujeok: {
    id: 'bujeok', name: '추적 부적탄', use: '고각 추적 고정', desc: '55~125°로 높이 쏘면 내려올 때 500px 안의 적을 포착해 계속 추적합니다. 낮게 쏘면 130px 안에서만 살짝 휘고, 땅과 장애물에 닿으면 막힙니다.',
    behavior: 'shell', pattern: 'single',
    radius: 52, carve: 48, rockMul: 0.7, damage: 126, directBonus: 1.15, knockback: 230,
    seekRange: 130, seekAcc: 1100, loftSeekRange: 500, seekTurnRate: 5.0,
    look: 'paper', color: 0xf7d354, glow: 0xff5a5a, size: 7,
  },
  nakroe: {
    id: 'nakroe', name: '삼중 낙뢰', use: '위에서 세 번', desc: '떨어진 자리 둘레로 벼락이 빠르게 세 번 내리칩니다. 위가 열린 상대와 여러 명이 모인 자리를 노리세요.',
    behavior: 'lightning', pattern: 'single',
    radius: 38, carve: 26, rockMul: 0.7, damage: 60, directBonus: 1.1, knockback: 65,
    strikes: 3, strikeDelay: 0.24, strikeGap: 0.16, strikeSpacing: 38, strikeDamage: 66, strikeRadius: 52, strikeCarve: 28,
    look: 'paper', color: 0xfff0a0, glow: 0x8fb8ff, size: 8,
  },
  iron: {
    id: 'iron', name: '철갑 포탄', use: '암석 파괴', desc: '다른 탄과 같은 기본 궤도로 날아가며, 단단한 바위와 성벽도 강하게 부숩니다.',
    behavior: 'shell', pattern: 'single',
    radius: 56, carve: 46, rockMul: 1.0, damage: 164, directBonus: 1.2, knockback: 300,
    look: 'iron', color: 0x59606b, glow: 0xffc36b, size: 7,
  },
  salvo: {
    id: 'salvo', name: '집중 연속 화포', use: '세 발 연속', desc: '힘을 조금씩 바꿔 세 발을 빠르게 쏩니다. 밀어내는 힘을 줄여 후속탄도 맞히기 쉽습니다.',
    behavior: 'shell', pattern: 'salvo',
    radius: 51, carve: 30, rockMul: 0.75, damage: 84, directBonus: 1.15, knockback: 65,
    count: 3, salvoGap: 0.16, salvoPowerStep: 0.65,
    look: 'iron', color: 0x6b7380, glow: 0xff8b3d, size: 7,
  },
  foxfire: {
    id: 'foxfire', name: '여우불', use: '한 발 집중', desc: '한 발에 피해를 모읍니다. 기본 궤도와 바람 영향은 다른 탄과 같고, 분열 없이 한 곳을 때립니다.',
    behavior: 'shell', pattern: 'single',
    radius: 62, carve: 44, rockMul: 0.62, damage: 166, directBonus: 1.15, knockback: 210,
    look: 'fox', color: 0x7fd8ff, glow: 0x4f8cff, size: 8,
  },
  foxSplit: {
    id: 'foxSplit', name: '분열 여우불', use: '다섯 갈래 폭격', desc: '꼭대기에서 다섯 갈래로 갈라집니다. 퍼지는 폭을 줄여 같은 지역을 겹쳐 때립니다.',
    behavior: 'split', pattern: 'single',
    radius: 48, carve: 40, rockMul: 0.62, damage: 110, directBonus: 1.1, knockback: 200,
    childCount: 5, childSpread: 42, childDamage: 70, childRadius: 45, childCarve: 26,
    look: 'fox', color: 0xc2a2ff, glow: 0xff7ad9, size: 9,
  },
  singijeon: {
    id: 'singijeon', name: '삼연 신기전', use: '세 발 집중', desc: '신기전 세 발을 거의 같은 궤도로 쏩니다. 한 곳에 모아 맞히면 강합니다.',
    behavior: 'shell', pattern: 'salvo',
    radius: 44, carve: 34, rockMul: 0.7, damage: 75, directBonus: 1.18, knockback: 45,
    count: 3, salvoGap: 0.1, salvoPowerStep: 0.7,
    look: 'rocket', color: 0xe59a51, glow: 0xffb357, size: 6,
  },
  hwachaStorm: {
    id: 'hwachaStorm', name: '구룡 화차', use: '아홉 발 범위 포격', desc: '아홉 발을 부채꼴로 펼칩니다. 한 발 피해는 작지만 넓은 비탈과 모인 상대를 훑습니다.',
    behavior: 'shell', pattern: 'triple',
    radius: 34, carve: 25, rockMul: 0.7, damage: 33, directBonus: 1.12, knockback: 20,
    count: 9, spreadDeg: 1.95,
    look: 'rocket', color: 0xffc46a, glow: 0xff794d, size: 5,
  },
  venomJar: {
    id: 'venomJar', name: '맹독 항아리', use: '묵직한 한 방', desc: '무거운 항아리가 깨지며 강하게 때립니다. 독구름 없이 즉시 피해를 주는 탄입니다.',
    behavior: 'shell', pattern: 'single',
    radius: 63, carve: 49, rockMul: 0.65, damage: 178, directBonus: 1.16, knockback: 180,
    look: 'poison', color: 0xa6e254, glow: 0x91d65b, size: 9,
  },
  poisonCloud: {
    id: 'poisonCloud', name: '자욱한 독무', use: '세 차례 자리 압박', desc: '작게 터진 뒤 독구름이 남습니다. 구름 속에서 자기 차례를 맞으면 48 피해. 장수별 세 차례까지 남고, 걸어 나오면 피합니다. 아군도 주의하세요.',
    behavior: 'shell', pattern: 'single',
    radius: 55, carve: 24, rockMul: 0.5, damage: 96, directBonus: 1.05, knockback: 35,
    cloudRadius: 150, cloudDamage: 48, cloudTurns: 3,
    look: 'poison', color: 0xd2fa79, glow: 0x9bdf64, size: 9,
  },
  drillBore: {
    id: 'drillBore', name: '관통 나선탄', use: '벽 관통·발판 절단', desc: '바위를 최대 280px 뚫어 벽 반대편에서 크게 터집니다. 아래가 빈 얇은 발판의 윗면에 맞으면 밑면까지 잘라냅니다. 기반암과 구조물 핵은 남습니다.',
    behavior: 'drill', pattern: 'single',
    radius: 64, carve: 50, rockMul: 1, damage: 178, directBonus: 1.2, knockback: 135,
    burstDamage: 80, burstRadius: 65, burstCarve: 44,
    drillDepth: 280, drillRadius: 14, drillSpeed: 420,
    drillExit: { gap: 18, damage: 235, radius: 102 },
    shelfCut: { maxThickness: 96, radius: 118, followThrough: 'faultBreaker' },
    look: 'drill', color: 0xd3e3e7, glow: 0xffc66d, size: 7,
  },
  ironScatter: {
    id: 'ironScatter', name: '철편 삼연탄', use: '세 갈래 명중', desc: '조준선과 그 양옆으로 철편 세 발을 동시에 쏩니다. 조준이 조금 빗나가도 옆탄이 닿고, 여러 발이 겹치면 피해가 더 큽니다. 지형을 조금만 깎습니다.',
    behavior: 'shell', pattern: 'triple',
    radius: 65, carve: 16, rockMul: 0.45, damage: 96, directBonus: 1.25, knockback: 42,
    count: 3, spreadDeg: 3.8,
    look: 'iron', color: 0x788f9e, glow: 0x6ee1ff, size: 6, renderScale: 0.86,
  },
  // 관통탄이 얇은 발판을 가른 직후 이어지는 넓은 굴착.
  faultBreaker: {
    id: 'faultBreaker', name: '지반 붕괴탄', use: '떠 있는 발판 절단', desc: '채석장처럼 아래가 빈 발판을 위에서 맞히면 밑면까지 가르고, 떨어져 나간 조각은 무너집니다. 두꺼운 지반에서는 원래대로 110px 파고듭니다. 기반암과 구조물 핵은 남습니다.',
    behavior: 'drill', pattern: 'single',
    radius: 76, carve: 94, rockMul: 1, damage: 112, directBonus: 1.1, knockback: 160,
    burstDamage: 44, burstRadius: 60, burstCarve: 62,
    drillDepth: 110, drillRadius: 27, drillSpeed: 350,
    shelfCut: { maxThickness: 96, radius: 118 },
    look: 'drill', color: 0xe2b56d, glow: 0xffa654, size: 9, renderScale: 1.25,
  },
};

export function weapon(id: string): WeaponDef {
  const w = WEAPONS[id];
  if (!w) throw new Error(`알 수 없는 무기: ${id}`);
  return w;
}
