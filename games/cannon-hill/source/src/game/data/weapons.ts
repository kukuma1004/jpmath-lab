/**
 * 무기 표. 숫자는 여기서만 고친다.
 * radius: 피해 반경, carve: 흙을 파는 반경, rockMul: 암석·성벽을 파는 비율(1이면 흙과 같음)
 */
export type ImpactBehavior = 'shell' | 'pierce' | 'drill' | 'bounce' | 'bounceBurst' | 'lightning' | 'split' | 'mega';
export type FirePattern = 'single' | 'triple' | 'salvo' | 'echo';

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
  /** 비행 중 이 거리(px) 안의 적을 포착하고 최대 turnRate(rad/s)만큼 조향한다 */
  homing?: { range: number; turnRate: number };
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
  look: 'ball' | 'arrow' | 'bomb' | 'paper' | 'iron' | 'fox' | 'goblinfire' | 'megabomb' | 'rocket' | 'poison' | 'drill' | 'fan';
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
    radius: 28, carve: 22, rockMul: 0.8, damage: 278, directBonus: 1.59, knockback: 290,
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
    radius: 78, carve: 66, rockMul: 0.62, damage: 192, directBonus: 1.15, knockback: 260,
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
    id: 'bujeok', name: '추적 부적탄', use: '진행 방향 추적', desc: '진행 방향 가까이에 있는 적을 포착해 부드럽게 휩니다. 장애물에 닿으면 터지고, 원래 궤적으로 직격하면 치명타가 납니다.',
    behavior: 'shell', pattern: 'single',
    radius: 52, carve: 48, rockMul: 0.7, damage: 126, directBonus: 1.15, knockback: 230,
    homing: { range: 310, turnRate: 3.1 },
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
    radius: 59, carve: 48, rockMul: 1.0, damage: 181, directBonus: 1.24, knockback: 300,
    look: 'iron', color: 0x59606b, glow: 0xffc36b, size: 7,
  },
  salvo: {
    id: 'salvo', name: '집중 연속 화포', use: '세 발 연속', desc: '힘을 조금씩 바꿔 세 발을 빠르게 쏩니다. 밀어내는 힘을 줄여 후속탄도 맞히기 쉽습니다.',
    behavior: 'shell', pattern: 'salvo',
    radius: 55, carve: 30, rockMul: 0.75, damage: 96, directBonus: 1.16, knockback: 44,
    count: 3, salvoGap: 0.14, salvoPowerStep: 0.5,
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
    radius: 47, carve: 34, rockMul: 0.7, damage: 84, directBonus: 1.18, knockback: 45,
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
    id: 'poisonCloud', name: '자욱한 독무', use: '세 차례 자리 압박', desc: '독구름 속에서 차례가 오면 30 피해를 받습니다. 독이 겹치면 가장 강한 구름만 적용됩니다. 구름은 장수별 세 차례까지 남습니다.',
    behavior: 'shell', pattern: 'single',
    radius: 55, carve: 24, rockMul: 0.5, damage: 96, directBonus: 1.05, knockback: 35,
    cloudRadius: 150, cloudDamage: 30, cloudTurns: 3,
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
  fanBreeze: {
    id: 'fanBreeze', name: '부채바람', use: '넓은 한 발',
    desc: '부채에서 부른 바람 한 발이 넓게 터집니다. 지형은 얕게 깎습니다.',
    behavior: 'shell', pattern: 'single',
    damage: 169, directBonus: 1.13, radius: 73, carve: 42, rockMul: 0.54, knockback: 235,
    look: 'fan', color: 0x56bca7, glow: 0x99f0ca, size: 8,
  },
  offbeat: {
    id: 'offbeat', name: '엇장단탄', use: '두 번 튀며 타격',
    desc: '낮게 두 번 튀고, 튈 때마다 짧은 장단을 울려 주변에 피해를 줍니다.',
    behavior: 'bounceBurst', pattern: 'single',
    damage: 136, directBonus: 1.12, radius: 65, carve: 33, rockMul: 0.55, knockback: 130,
    bounces: 2, restitution: 0.32, fuse: 4.5,
    burstDamage: 64, burstRadius: 70, burstCarve: 17,
    look: 'fan', color: 0x79b7a2, glow: 0xd0eaa4, size: 8,
  },
  fanFestival: {
    id: 'fanFestival', name: '풍류 한마당', use: '세 번 울리는 큰 장단',
    desc: '세 번의 장단이 이어지며 착탄점 주변으로 넓게 퍼집니다. 가까이 모인 상대를 노리세요.',
    behavior: 'bounceBurst', pattern: 'single',
    damage: 201, directBonus: 1.14, radius: 91, carve: 41, rockMul: 0.58, knockback: 195,
    bounces: 3, restitution: 0.26, fuse: 5,
    burstDamage: 81, burstRadius: 82, burstCarve: 22,
    look: 'fan', color: 0xc7af60, glow: 0xffe3a3, size: 9, renderScale: 1.15,
  },
};

WEAPONS.waveShell = { ...WEAPONS.iron!, id: 'waveShell', name: '파도 포탄', use: '강한 밀어내기',
    desc: '물결 폭발로 상대를 크게 밀어냅니다.', damage: 161, radius: 72, carve: 51, rockMul: 0.66, knockback: 325, glow: 0x61ddff };
WEAPONS.skipWave = { ...WEAPONS.dokkaebiBomb!, id: 'skipWave', name: '되밀물탄', use: '낮게 두 번 튀기',
    desc: '지면을 낮게 두 번 튀고 터집니다. 언덕의 비탈과 발판 끝을 노리세요.', damage: 159, radius: 67, carve: 53, restitution: 0.25, knockback: 320, look: "iron", glow: 7129599 };
WEAPONS.frostBolt = { ...WEAPONS.arrow!, id: 'frostBolt', name: '서리 쇠화살', use: '정밀 직격',
    desc: '가느다란 쇠화살이 흙을 얕게 파고들며 직접 맞힐 때 강합니다.', damage: 138, carve: 24, radius: 37, pierceDepth: 36, glow: 9039871 };
WEAPONS.frostSplit = { ...WEAPONS.foxSplit!, id: 'frostSplit', name: '눈꽃탄', use: '세 갈래 낙하',
    desc: '포탄이 정점에서 세 갈래로 갈라져 높은 곳과 낮은 곳을 함께 노립니다.', look: "arrow", glow: 8840957, childCount: 3, childSpread: 34, childDamage: 75, childRadius: 41, childCarve: 19 };
WEAPONS.signalFlare = { ...WEAPONS.iron!, id: 'signalFlare', name: '봉화 화살', use: '가벼운 한 발',
    desc: '폭발 반경이 적당한 불꽃 화살 한 발을 날립니다.', look: "rocket", radius: 56, damage: 165, carve: 40, knockback: 140, rockMul: 0.74, glow: 16745020 };
WEAPONS.lanternSalvo = { ...WEAPONS.singijeon!, id: 'lanternSalvo', name: '연등탄', use: '세 발 연속',
    desc: '힘을 조금씩 달리한 불꽃탄 세 발이 짧은 간격으로 날아갑니다.', damage: 80, salvoPowerStep: 1.4, salvoGap: 0.13, glow: 16759654 };
WEAPONS.stoneChip = { ...WEAPONS.arrow!, id: 'stoneChip', name: '암편 포탄', use: '바위 관통',
    desc: '단단한 암편이 흙과 바위를 파고들어 터집니다.', look: 'iron', pierceDepth: 60, radius: 57, carve: 45, rockMul: 1, damage: 182, knockback: 200, glow: 0xc5dc97 };
WEAPONS.ledgeWedge = { ...WEAPONS.hwapo!, id: 'ledgeWedge', name: '쐐기 바위', use: '넓게 지형 깎기',
    desc: '폭발로 발밑과 엄폐물을 크게 깎습니다.', radius: 66, carve: 91, rockMul: 1, damage: 123, knockback: 120, glow: 15907702 };
WEAPONS.inkDart = { ...WEAPONS.arrow!, id: 'inkDart', name: '먹빛 침', use: '빠른 직격',
    desc: '작은 먹빛 침이 얕은 지형을 뚫고, 직접 꽂히면 강합니다.', glow: 12751854, pierceDepth: 34, radius: 34, carve: 18, damage: 161, directBonus: 1.36 };
WEAPONS.shadowPair = { ...WEAPONS.iron!, id: 'shadowPair', name: '그림자 협격', use: '본체와 그림자',
    desc: '본체와 뒤쪽 그림자가 함께 쏴 두 경로를 만듭니다. 그림자와 포탄은 지형에 막힙니다.',
    pattern: 'echo', look: 'arrow', count: 2, glow: 0xbc82f5, radius: 52, carve: 18, rockMul: 0.6, damage: 110, knockback: 45 };
WEAPONS.royalBarrage = { ...WEAPONS.hwapo!, id: 'royalBarrage', name: '천지 대포', use: '대형 폭발',
    desc: '거대한 포탄 한 발로 크게 폭발시켜 전장에 깊은 구덩이를 냅니다.', radius: 89, carve: 107, damage: 259, rockMul: 0.86, directBonus: 1.15, knockback: 290, look: "megabomb", glow: 16765298 };
WEAPONS.skyArrows = { ...WEAPONS.samyeonsi!, id: 'skyArrows', name: '달가름 삼시', use: '세 발 정밀 관통',
    desc: '촘촘하게 모인 세 화살이 한 자리를 꿰뚫습니다.', radius: 47, damage: 110, directBonus: 1.26, spreadDeg: 0.9, glow: 16772514 };
WEAPONS.goblinCarnival = { ...WEAPONS.dokkaebiFire!, id: 'goblinCarnival', name: '도깨비 난장', use: '연쇄 폭발',
    desc: '불덩이가 낮게 뛰면서 여러 번 터지고 끝에 크게 폭발합니다.', bounces: 3, restitution: 0.32, radius: 76, damage: 174, burstDamage: 88, burstRadius: 69, knockback: 220 };
WEAPONS.fiveThunders = { ...WEAPONS.nakroe!, id: 'fiveThunders', name: '오방 천둥', use: '집중 벼락 다섯 줄',
    desc: '착탄점에 벼락 다섯 줄을 차례로 집중시킵니다.', strikes: 5, strikeSpacing: 24, strikeDamage: 66, strikeRadius: 60, strikeGap: 0.13, strikeCarve: 32, damage: 70, glow: 12893439 };
WEAPONS.ironBroadside = { ...WEAPONS.salvo!, id: 'ironBroadside', name: '용두 제압', use: '중함포 네 발',
    desc: '흔들림을 줄인 중함포 네 발을 연이어 쏩니다.', count: 4, radius: 58, damage: 100, carve: 37, salvoGap: 0.13, salvoPowerStep: 0.6 };
WEAPONS.foxComet = { ...WEAPONS.foxSplit!, id: 'foxComet', name: '칠성 여우불', use: '일곱 갈래 낙하',
    desc: '하늘에서 여우불 일곱 갈래가 나뉘어 떨어집니다.', childCount: 7, childSpread: 40, childDamage: 85, childRadius: 51, glow: 15382527 };
WEAPONS.rocketTempest = { ...WEAPONS.hwachaStorm!, id: 'rocketTempest', name: '신기전 폭풍', use: '집중 부채꼴',
    desc: '신기전 열한 발이 부채꼴로 날아가 비탈을 훑습니다.', count: 11, spreadDeg: 1.42, radius: 44, damage: 48, glow: 16760174 };
WEAPONS.greenDeluge = { ...WEAPONS.poisonCloud!, id: 'greenDeluge', name: '청록 대독무', use: '넓은 독구름',
    desc: '착탄 피해와 함께 네 차례 동안 넓은 독구름을 남깁니다. 구름 속에서 차례가 오면 40 피해를 받습니다. 겹친 독 피해는 더해지지 않습니다.', damage: 150, cloudTurns: 4, cloudRadius: 178, cloudDamage: 40 };
WEAPONS.deepFault = { ...WEAPONS.drillBore!, id: 'deepFault', name: '대지 단층파', use: '긴 굴착·발판 붕괴',
    desc: '두꺼운 벽을 뚫고 출구에서 폭발합니다. 얇은 발판에는 넓은 붕괴가 이어집니다.',
    drillDepth: 350, drillRadius: 21, radius: 81, carve: 70, damage: 234,
    drillExit: { gap: 18, damage: 290, radius: 116 }, shelfCut: { maxThickness: 96, radius: 142, followThrough: 'faultBreaker' } };
WEAPONS.fullTide = { ...WEAPONS.waveShell!, id: 'fullTide', name: '만조 파도', use: '넓은 밀어내기',
    desc: '넓은 파도가 폭발해 가장자리의 상대를 멀리 밀어냅니다.', radius: 98, damage: 218, carve: 65, knockback: 455, glow: 6351871 };
WEAPONS.whiteSky = { ...WEAPONS.frostSplit!, id: 'whiteSky', name: '백야 빙우', use: '다섯 빙편 직하',
    desc: '하늘에서 다섯 빙편이 갈라져 가까운 범위에 꽂힙니다.', childCount: 5, childSpread: 30, childDamage: 93, childRadius: 48, glow: 12712191 };
WEAPONS.beaconRain = { ...WEAPONS.lanternSalvo!, id: 'beaconRain', name: '봉화 폭우', use: '다섯 발 연속',
    desc: '불꽃탄 다섯 발이 거리를 조금씩 달리해 연달아 떨어집니다.', count: 5, damage: 87, radius: 55, salvoPowerStep: 1.1, salvoGap: 0.11, glow: 16750676 };
WEAPONS.cliffBreak = { ...WEAPONS.ledgeWedge!, id: 'cliffBreak', name: '산허리 붕괴', use: '대형 분화구',
    desc: '대형 암석탄으로 맞은 지점의 지반을 넓게 무너뜨립니다.', radius: 86, carve: 124, damage: 216, knockback: 200, look: "megabomb", glow: 16766105 };
WEAPONS.inkAmbush = { ...WEAPONS.shadowPair!, id: 'inkAmbush', name: '삼영 매복', use: '세 위치 협공',
    desc: '본체와 양쪽의 그림자 둘이 동시에 침을 던져 여러 궤도를 만듭니다.', count: 3, damage: 143, radius: 65, glow: 0xd5a2ff };

export function weapon(id: string): WeaponDef {
  const w = WEAPONS[id];
  if (!w) throw new Error(`알 수 없는 무기: ${id}`);
  return w;
}
