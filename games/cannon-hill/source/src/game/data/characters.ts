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
  stats: { power: number; range: number; accuracy: number; defense: number; mobility: number };
  palette: { main: string; sub: string; accent: string; skin: string; dark: string };
}

export const CHARACTERS: CharacterDef[] = [
  {
    id: 'general', name: '화포장군', role: '폭발형',
    blurb: '두정갑을 입은 늙은 장군. 어깨에 멘 총통 한 방이면 언덕 하나가 사라진다.',
    hp: 1000, defense: 0.06, moveMul: 0.9, normal: 'hwapo', special: 'jincheonroe',
    stats: { power: 5, range: 5, accuracy: 2, defense: 3, mobility: 2 },
    palette: { main: '#b8322a', sub: '#2b3a67', accent: '#e8b64a', skin: '#e9b98f', dark: '#3a1712' },
  },
  {
    id: 'archer', name: '신궁', role: '정밀 저격형',
    blurb: '갓끈을 질끈 맨 활잡이. 바람을 덜 타는 화살로 먼 곳을 꿰뚫는다.',
    hp: 1000, defense: 0, moveMul: 1.2, normal: 'arrow', special: 'samyeonsi',
    stats: { power: 3, range: 2, accuracy: 5, defense: 1, mobility: 5 },
    palette: { main: '#f2efe6', sub: '#3f7cac', accent: '#1d1d22', skin: '#efc49c', dark: '#20262e' },
  },
  {
    id: 'dokkaebi', name: '도깨비', role: '변칙 공격형',
    blurb: '방망이를 휘두르는 장난꾸러기. 통통 튀는 폭탄으로 언덕 너머를 노린다.',
    hp: 1000, defense: 0.08, moveMul: 1.0, normal: 'dokkaebiBomb', special: 'dokkaebiFire',
    stats: { power: 4, range: 3, accuracy: 3, defense: 3, mobility: 3 },
    palette: { main: '#4a6b3a', sub: '#c46a2b', accent: '#f4d35e', skin: '#6fa3c9', dark: '#1f2d3d' },
  },
  {
    id: 'mudang', name: '무당', role: '마법형',
    blurb: '방울과 부채를 든 큰무당. 부적이 떨어진 자리에 하늘의 벼락을 부른다.',
    hp: 1000, defense: 0.04, moveMul: 1.0, normal: 'bujeok', special: 'nakroe',
    stats: { power: 4, range: 4, accuracy: 4, defense: 2, mobility: 3 },
    palette: { main: '#c8323c', sub: '#2f5d9c', accent: '#f7d354', skin: '#f0c7a0', dark: '#2a1420' },
  },
  {
    id: 'turtle', name: '거북선 장수', role: '방어형',
    blurb: '작은 거북선을 끌고 다니는 수군 장수. 느리지만 쇠지붕이 웬만한 포탄을 받아낸다.',
    hp: 1000, defense: 0.22, moveMul: 0.72, normal: 'iron', special: 'salvo',
    stats: { power: 3, range: 3, accuracy: 4, defense: 5, mobility: 1 },
    palette: { main: '#7a4a2a', sub: '#2c4f6e', accent: '#d9a441', skin: '#e3b48c', dark: '#2b1d14' },
  },
  {
    id: 'gumiho', name: '구미호', role: '교란형',
    blurb: '아홉 꼬리를 펼친 여우. 바람을 타는 여우불이 하늘에서 갈라져 쏟아진다.',
    hp: 1000, defense: 0, moveMul: 1.25, normal: 'foxfire', special: 'foxSplit',
    stats: { power: 4, range: 4, accuracy: 3, defense: 1, mobility: 5 },
    palette: { main: '#f6eee8', sub: '#e48aa8', accent: '#7fd8ff', skin: '#f7d6c2', dark: '#3b2436' },
  },
];

export function character(id: string): CharacterDef {
  const c = CHARACTERS.find((x) => x.id === id);
  if (!c) throw new Error(`알 수 없는 캐릭터: ${id}`);
  return c;
}
