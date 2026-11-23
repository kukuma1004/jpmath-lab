import { BASE_HP } from '../config/constants';

/**
 * 장수마다 하나씩 있는 특기. 숫자는 TRAIT 표에서만 고친다.
 * steady: 움직이지 않고 쏘면 세게 / eagle: 긴 예상 궤적·직격 강화 / shove: 멀리 날려 보냄
 * blessing: 차례마다 회복 / ironclad: 안 밀리고 환경 피해 절반 / foxstep: 낙하 피해 감소
 */
export type TraitId = 'steady' | 'eagle' | 'shove' | 'blessing' | 'ironclad' | 'foxstep' | 'engineer' | 'antidote' | 'hardhat';

export const TRAIT = {
  steadyDamage: 1.15, // 화포장군: 움직이지 않고 쏘면 피해 배수
  steadyBlast: 1.06, // 폭발·구덩이 크기 배수
  eagleDirect: 1.25, // 신궁: 직접 맞혔을 때 더 붙는 배수
  eaglePreview: 2.6, // 신궁(사람): 예상 궤적 길이(초). 다른 장수는 1.1초
  shoveKnock: 1.9, // 도깨비: 밀어내는 힘 배수
  blessHeal: 25, // 무당: 차례가 시작될 때 회복량
  blessRange: 230, // 무당과 이만큼 가까운 같은 편도 함께 회복
  ironKnock: 0.3, // 거북선 장수: 밀려나는 힘 배수
  ironEnv: 0.5, // 떨어짐·깔림·낙석 피해 배수
  foxFall: 0.6,
  engineerRock: 1.25,
  poisonResistance: 0.4,
  hardhatEnv: 0.75,
};

/** 캐릭터 표. 능력치·무기 연결은 여기서만 고친다. */
export interface CharacterDef {
  id: string;
  name: string;
  role: string;
  blurb: string;
  hp: number;
  defense: number; // 받는 피해를 이 비율만큼 줄인다
  moveMul: number; // 한 턴 이동 거리 배수
  normal: string;
  special: string;
  trait: { id: TraitId; name: string; desc: string };
  stats: { power: number; range: number; accuracy: number; defense: number; mobility: number };
  palette: { main: string; sub: string; accent: string; skin: string; dark: string };
}

export const CHARACTERS: CharacterDef[] = [
  {
    id: 'general', name: '화포장군', role: '폭발형',
    blurb: '두정갑을 입은 늙은 장군. 어깨에 멘 총통 한 방이면 언덕 하나가 사라진다.',
    hp: BASE_HP, defense: 0.06, moveMul: 0.9, normal: 'hwapo', special: 'jincheonroe',
    trait: { id: 'steady', name: '자리 잡은 포격', desc: '이번 차례에 움직이지 않고 쏘면 피해가 15% 커지고 구덩이도 조금 더 크게 팝니다. 자리를 잡으면 장군 둘레가 금빛으로 빛납니다.' },
    stats: { power: 5, range: 5, accuracy: 2, defense: 3, mobility: 2 },
    palette: { main: '#b8322a', sub: '#2b3a67', accent: '#e8b64a', skin: '#e9b98f', dark: '#3a1712' },
  },
  {
    id: 'archer', name: '신궁', role: '정밀 저격형',
    blurb: '갓끈을 질끈 맨 활잡이. 깊이 파고드는 관통 화살로 엄폐 뒤를 꿰뚫는다.',
    hp: BASE_HP, defense: 0, moveMul: 1.2, normal: 'arrow', special: 'samyeonsi',
    trait: { id: 'eagle', name: '명궁의 눈', desc: '예상 궤적이 두 배 넘게 길게 보이고, 몸에 직접 꽂히면 피해가 25% 더 붙습니다.' },
    stats: { power: 3, range: 2, accuracy: 5, defense: 1, mobility: 5 },
    palette: { main: '#f2efe6', sub: '#3f7cac', accent: '#1d1d22', skin: '#efc49c', dark: '#20262e' },
  },
  {
    id: 'dokkaebi', name: '도깨비', role: '변칙 공격형',
    blurb: '방망이를 휘두르는 장난꾸러기. 통통 튀는 폭탄으로 언덕 너머를 노린다.',
    hp: BASE_HP, defense: 0.08, moveMul: 1.0, normal: 'dokkaebiBomb', special: 'dokkaebiFire',
    trait: { id: 'shove', name: '도깨비 힘', desc: '맞은 상대를 거의 두 배 멀리 날려 보냅니다. 낭떠러지 끝에 선 상대는 조심해야 합니다.' },
    stats: { power: 4, range: 3, accuracy: 3, defense: 3, mobility: 3 },
    palette: { main: '#4a6b3a', sub: '#c46a2b', accent: '#f4d35e', skin: '#6fa3c9', dark: '#1f2d3d' },
  },
  {
    id: 'mudang', name: '무당', role: '마법형',
    blurb: '높이 날린 부적이 내려오며 적을 뒤쫓습니다. 다른 탄으로는 하늘의 벼락을 부릅니다.',
    hp: BASE_HP, defense: 0.04, moveMul: 1.0, normal: 'bujeok', special: 'nakroe',
    trait: { id: 'blessing', name: '신령의 가호', desc: '자기 차례가 시작될 때 자신과 가까이 선 같은 편의 체력을 25씩 채웁니다. 1번 부적은 고각으로 쏘면 하강 중 멀리 있는 적을 추적합니다.' },
    stats: { power: 4, range: 4, accuracy: 4, defense: 2, mobility: 3 },
    palette: { main: '#c8323c', sub: '#2f5d9c', accent: '#f7d354', skin: '#f0c7a0', dark: '#2a1420' },
  },
  {
    id: 'turtle', name: '거북선 장수', role: '방어형',
    blurb: '작은 거북선을 끌고 다니는 수군 장수. 느리지만 쇠지붕이 웬만한 포탄을 받아낸다.',
    hp: BASE_HP, defense: 0.25, moveMul: 0.72, normal: 'iron', special: 'salvo',
    trait: { id: 'ironclad', name: '철갑 선체', desc: '폭발에 거의 밀려나지 않고, 떨어지거나 깔리거나 낙석에 맞는 피해가 절반입니다.' },
    stats: { power: 3, range: 3, accuracy: 4, defense: 5, mobility: 1 },
    palette: { main: '#7a4a2a', sub: '#2c4f6e', accent: '#d9a441', skin: '#e3b48c', dark: '#2b1d14' },
  },
  {
    id: 'gumiho', name: '구미호', role: '교란형',
    blurb: '아홉 꼬리를 펼친 여우. 바람을 타는 여우불이 하늘에서 갈라져 쏟아진다.',
    hp: BASE_HP, defense: 0, moveMul: 1.25, normal: 'foxfire', special: 'foxSplit',
    trait: { id: 'foxstep', name: '사뿐한 여우걸음', desc: '빠르게 자리를 옮기고 낙하 피해를 40% 덜 받습니다. 두 종류 여우불은 매 차례 자유롭게 고릅니다.' },
    stats: { power: 4, range: 4, accuracy: 3, defense: 1, mobility: 5 },
    palette: { main: '#f6eee8', sub: '#e48aa8', accent: '#7fd8ff', skin: '#f7d6c2', dark: '#3b2436' },
  },
  {
    id: 'hwacha', name: '화차장인', role: '다연발 포격형',
    blurb: '등에 신기전을 멘 발명가. 세 발을 모아 쏘거나 아홉 발로 비탈을 훑습니다.',
    hp: BASE_HP, defense: 0.02, moveMul: 0.95, normal: 'singijeon', special: 'hwachaStorm',
    trait: { id: 'engineer', name: '화약 배합', desc: '신기전은 암석과 성벽을 25% 더 잘 팝니다. 1번은 세 발 집중, 2번은 아홉 발 넓은 포격입니다.' },
    stats: { power: 5, range: 4, accuracy: 3, defense: 2, mobility: 3 },
    palette: { main: '#cb7635', sub: '#3d426d', accent: '#e9c268', skin: '#efc097', dark: '#3a2424' },
  },
  {
    id: 'alchemist', name: '독술사', role: '독구름 견제형',
    blurb: '독과 약을 함께 다루는 산속 도사. 항아리로 한 방, 독구름으로 자리를 빼앗습니다.',
    hp: BASE_HP, defense: 0.08, moveMul: 0.88, normal: 'venomJar', special: 'poisonCloud',
    trait: { id: 'antidote', name: '백독불침', desc: '독구름 피해를 60% 덜 받습니다. 독구름은 장수의 차례가 시작될 때 작용하며, 바깥으로 걸어 나오면 피할 수 있습니다.' },
    stats: { power: 3, range: 5, accuracy: 3, defense: 3, mobility: 2 },
    palette: { main: '#275f58', sub: '#6d3b79', accent: '#b4df52', skin: '#e6b18b', dark: '#1b3030' },
  },
  {
    id: 'driller', name: '굴착대장', role: '굴착 붕괴형',
    blurb: '굵은 나선 드릴로 바위를 파는 광산 대장. 긴 터널을 뚫거나 발밑 지반을 통째로 허뭅니다.',
    hp: BASE_HP, defense: 0.12, moveMul: 0.82, normal: 'drillBore', special: 'faultBreaker',
    trait: { id: 'hardhat', name: '튼튼한 안전모', desc: '낙하·깔림·낙석 피해를 25% 덜 받습니다. 두 드릴탄 모두 바위와 성벽을 깊이 뚫고, 기반암과 구조물 핵은 남깁니다.' },
    stats: { power: 3, range: 5, accuracy: 3, defense: 4, mobility: 2 },
    palette: { main: '#344c68', sub: '#79523a', accent: '#e3ba6a', skin: '#e2ad85', dark: '#202a35' },
  },
];

export function character(id: string): CharacterDef {
  const c = CHARACTERS.find((x) => x.id === id);
  if (!c) throw new Error(`알 수 없는 캐릭터: ${id}`);
  return c;
}
