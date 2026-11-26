const flank = (...times) => times.map(time => ({ time: Math.abs(time), side: Math.sign(time) }))

export const STAGES = [
  {
    name: '성문 전선', boss: '철문 수문장', plan: '측면 기습대를 피해 철문을 돌파하세요.',
    time: 38, hp: 710, flanks: flank(-15.8, 22.4, -30.7, 34.5),
  },
  {
    name: '빙벽 협곡', boss: '서리 창기사', plan: '보급 위치가 뒤집혀요. 창기사가 중앙을 내리치면 양옆으로 피하세요.',
    time: 42, hp: 855, flanks: flank(10.1, -16.8, 21.6, -26.9, 33),
    formation: 'scouts', flipAt: 5.6, attacks: ['center', 'aim'],
  },
  {
    name: '잿불 제련소', boss: '화로 대장장이', plan: '화로가 양쪽을 덮으면 가운데로 피하세요.',
    time: 46, hp: 1020, flanks: flank(-12.3, 16.5, -24.5, 30.1, -36, 40.5),
    formation: 'armor', attacks: ['outer', 'aim'],
  },
  {
    name: '침엽수 고개', boss: '숲길 추격장', plan: '정찰대가 양옆에서 파고들어요. 마지막 보급으로 대열을 다시 모으세요.',
    time: 44, hp: 1030, flanks: flank(-8.8, 11.5, -17.5, 24, 27, -35.5, 39.5),
    formation: 'scouts', pace: 1.05, attacks: ['left', 'right', 'aim'],
  },
  {
    name: '폭풍 방파제', boss: '파도 감시자', plan: '양쪽 보급을 번갈아 챙기세요. 파도가 양옆에 표시되면 가운데로 피하세요.',
    time: 46, hp: 1090, flanks: flank(9, -13.1, -18.1, 22.2, -29, 33, -39.8),
    formation: 'surge', pace: 1.08, attacks: ['outer', 'left', 'right'], openingAid: 8,
  },
  {
    name: '황혼 수로', boss: '수문 파수꾼', plan: '중반부터 보급이 자리를 바꿔요. 수문은 중앙과 양옆을 번갈아 공격해요.',
    time: 48, hp: 1150, flanks: flank(-10, 14.4, 20.6, -25.3, 30.2, -36, 41),
    formation: 'surge', pace: 1.10, flipAt: 14.1, attacks: ['center', 'outer', 'aim'],
  },
  {
    name: '붉은 채석장', boss: '채석장 파쇄자', plan: '갑옷병이 밀려와요. 무기 상자를 놓쳤다면 후반 보급을 노리세요.',
    time: 50, hp: 1230, flanks: flank(8.6, -12.8, 17, -22.5, 27, 31.8, -37.4, 44),
    formation: 'armor', pace: 1.12, attacks: ['left', 'center', 'right', 'aim'],
  },
  {
    name: '검은 성채', boss: '성채의 섭정', plan: '기습 때도 증원과 무기를 챙기세요. 보스의 바닥 경고를 보고 빈 길을 고르세요.',
    time: 54, hp: 1350, flanks: flank(-8.8, 12.2, -16.2, 20, 23.8, -28.5, 33.3, -37.7, 43.3, -47),
    formation: 'surge', pace: 1.14, flipAt: 23.1, attacks: ['outer', 'center', 'aim', 'left', 'right'],
  },
]

const progressKey = 'breakwater-campaign-cleared-v1'

export function loadCleared() {
  try {
    const saved = localStorage.getItem(progressKey)
    const count = Number(saved)
    return /^\d+$/.test(saved) && count <= STAGES.length ? count : 0
  } catch {
    return 0
  }
}

export function saveCleared(cleared) {
  try {
    const highest = Math.max(loadCleared(), cleared)
    localStorage.setItem(progressKey, String(highest))
    return highest
  } catch {
    return cleared
  }
}
