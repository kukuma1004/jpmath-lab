'use strict';

const Forge = (() => {
  const clientRevision = 2026112502;
  const rankingProtocol = 'forge-current-1';
  const legacySaveKey = 'jp-math-lab:mongle-forge:v1';
  const backupKey = legacySaveKey + ':before-infinite';
  const seasonId = 'season-20261120-1';
  const rankingBoard = seasonId + '-current-1';
  const rankingProfileKey = 'jp-math-lab:mongle-forge:ranking-profile:current-1';
  // Isolate the season from older tabs that still write the previous save format.
  const olderSaveKey = legacySaveKey + ':' + seasonId;
  const marketSaveKey = olderSaveKey + ':market-1';
  const rainbowSaveKey = olderSaveKey + ':rainbow-1';
  const riskSaveKey = olderSaveKey + ':risk-1';
  const storageSaveKey = olderSaveKey + ':storage-1';
  const magicSaveKey = olderSaveKey + ':magic-1';
  const previousSaveKey = olderSaveKey + ':credits-1';
  const wardrobeSaveKey = olderSaveKey + ':wardrobe-1';
  const legendsSaveKey = olderSaveKey + ':legends-1';
  const reserveSaveKey = olderSaveKey + ':reserve-1';
  const saveKey = olderSaveKey + ':trial-1';
  const duelRecordKey = 'mongle-forge-duel-manual-v1';
  const duelSpeedTarget = 30000;
  const duelTokenAward = 3;
  const creditIdPattern = /^[A-Za-z0-9][A-Za-z0-9_-]{0,79}$/;
  const startingShards = 10000n;
  const cooldown = 680;
  const offlineLimit = 8 * 60 * 60 * 1000;
  const recoveryBonus = 800;
  const enchantmentLimit = 3;
  const costs = [
    16, 32, 56, 88, 135, 190, 275, 390, 530, 710, 940, 1230,
    1550, 1950, 2450, 3100, 3800, 4600, 5600, 6800, 8300, 10200,
    12400, 15000, 18000, 21700, 26000, 31000, 37000, 44000, 52500, 62000,
  ];
  const chances = [
    10000, 10000, 10000, 9500, 9000, 8500, 8000, 7500, 7000, 6500,
    6000, 5600, 5200, 4900, 4600, 4300, 4000, 3800, 3600, 3400,
    3200, 3000, 2900, 2800, 2700, 2600, 2500, 2400, 2300, 2200, 2100, 2000,
  ];
  const forms = [
    { level: 0n, name: '연습용 나무검', effect: 'ember', color: '#f5d398', detail: '작은 나무검에서 시작되는 끝없는 도전' },
    { level: 2n, name: '클로버 잎새검', effect: 'leaf', color: '#a7edb7', detail: '새싹을 닮은 칼날과 부드러운 잎빛' },
    { level: 4n, name: '꽃비 초승검', effect: 'blossom', color: '#ffb8ce', detail: '휘어진 칼날에 꽃비가 내려앉아요' },
    { level: 6n, name: '서리수정 대검', effect: 'glacier', color: '#a4e6ff', detail: '묵직한 수정 칼날에 서리가 맺혀요' },
    { level: 9n, name: '달그림자 월검', effect: 'eclipse', color: '#d9baff', detail: '초승달 모양 칼날을 감싸는 달빛' },
    { level: 12n, name: '별꼬리 성검', effect: 'comet', color: '#ffe7a2', detail: '별 모양 손잡이에서 빛이 퍼져요' },
    { level: 14n, name: '혜성 쌍날검', effect: 'comet', color: '#ffd29d', detail: '두 갈래 칼날과 나란히 흐르는 혜성' },
    { level: 16n, name: '오로라 파도검', effect: 'aurora', color: '#a7f7da', detail: '물결 칼날 위에서 넘실거리는 오로라' },
    { level: 18n, name: '일식 고리검', effect: 'eclipse', color: '#ffcd98', detail: '칼날의 빈 고리에서 피어나는 일식' },
    { level: 20n, name: '은하 성운검', effect: 'galaxy', color: '#dfbfff', detail: '떠 있는 수정 조각 주위를 도는 별빛' },
    { level: 22n, name: '뇌운 갈퀴검', effect: 'lightning', color: '#fff2a5', detail: '세 갈래 갈퀴를 따라 뻗는 번개' },
    { level: 24n, name: '심해 닻검', effect: 'anchor', color: '#a2f4e6', detail: '깊은 바다의 닻을 닮은 푸른 칼날' },
    { level: 26n, name: '중력 렌즈검', effect: 'gravity', color: '#eabbff', detail: '텅 빈 렌즈 안으로 모여드는 빛' },
    { level: 28n, name: '빙하 성채검', effect: 'glacier', color: '#bcefff', detail: '작은 성채처럼 층층이 자란 얼음' },
    { level: 30n, name: '시계태엽검', effect: 'clockwork', color: '#ffddaa', detail: '황금 톱니와 두 칼날이 새기는 시간' },
    { level: 32n, name: '새벽 왕관검', effect: 'dawn', color: '#ffcfac', detail: '왕관 모양 깃날에서 열리는 새벽' },
    { level: 36n, name: '별문 열쇠검', effect: 'keylight', color: '#b8f4ff', detail: '별 모양 열쇠가 빛의 문을 열어요' },
    { level: 40n, name: '불사조 톱날검', effect: 'phoenix', color: '#ffb19a', detail: '깃털 톱날을 따라 타오르는 불새' },
    { level: 44n, name: '궤도 부채검', effect: 'fanblade', color: '#dbbfff', detail: '펼쳐진 다섯 칼날 사이로 흐르는 궤도' },
    { level: 48n, name: '무한 매듭검', effect: 'infinity', color: '#c6ffe4', detail: '두 번 휘감긴 칼날로 이어지는 무한' },
    { level: 56n, name: '룬서약 대검', effect: 'gravity', color: '#b6d7ec', detail: '북방의 서약을 품은 묵직한 룬 대검' },
    { level: 64n, name: '용월 언월도', effect: 'leaf', color: '#a0e4b0', detail: '용의 수염처럼 갈라진 초승달 언월도' },
    { level: 72n, name: '해신의 삼지창', effect: 'anchor', color: '#7fe8e5', detail: '파도의 세 갈래를 품은 해신의 창' },
    { level: 80n, name: '번개벼림 망치', effect: 'lightning', color: '#d2e8ff', detail: '각진 쇳덩이와 짧은 자루에 담긴 천둥' },
    { level: 90n, name: '여의 천금봉', effect: 'clockwork', color: '#f7ca6b', detail: '구름 금테와 붉은 옻칠로 완성한 신묘한 봉' },
    { level: 100n, name: '성약의 왕검', effect: 'dawn', color: '#ffdca1', detail: '날개 모양 황금 가드와 붉은 보석의 왕검' },
    { level: 120n, name: '흑조 쌍날검', effect: 'eclipse', color: '#b4bcf5', detail: '검은 백조의 날개처럼 양쪽으로 펼쳐진 날' },
    { level: 150n, name: '태양수레 차크람', effect: 'keylight', color: '#ffd482', detail: '텅 빈 중심을 둘러싼 여덟 개의 태양 칼날' },
    { level: 180n, name: '구름가름 대도', effect: 'comet', color: '#b8d9eb', detail: '구름을 가르는 거대한 직선 철판 칼날' },
    { level: 220n, name: '달그림자 쌍도', effect: 'aurora', color: '#c6bcff', detail: '서로 다른 곡률로 포개진 한 쌍의 월도' },
    { level: 270n, name: '운명가름 대낫', effect: 'galaxy', color: '#d6bcf5', detail: '긴 자루 끝을 가로지르는 운명의 검은 낫' },
    { level: 330n, name: '별을꿰는 신창', effect: 'phoenix', color: '#fff0b7', detail: '세 겹의 궤도 고리에 떠 있는 별빛 창끝' },
    { level: 52n, name: '별유리 에스토크', effect: 'comet', color: '#badbff', detail: '투명한 별유리 속에 세 개의 수정이 떠 있어요', edition: 'wardrobe' },
    { level: 60n, name: '황금 사자 플람베르주', effect: 'dawn', color: '#ffd182', detail: '물결치는 칼날과 황금 갈기 속에 새긴 용기', edition: 'wardrobe' },
    { level: 68n, name: '흑룡 이빨 대검', effect: 'gravity', color: '#c6b3ee', detail: '흑요석 칼등에 용의 송곳니가 돋아난 대검', edition: 'wardrobe' },
    { level: 76n, name: '벚꽃 초승도', effect: 'blossom', color: '#ffc5d8', detail: '한 줄기 달처럼 휜 날과 자개 벚꽃 장식', edition: 'wardrobe' },
    { level: 85n, name: '시계태엽 레이피어', effect: 'clockwork', color: '#f2d8a5', detail: '정교한 황동 바구니 가드와 바늘 같은 검날', edition: 'wardrobe' },
    { level: 95n, name: '진홍의 여왕대검', effect: 'phoenix', color: '#ffa7be', detail: '두 갈래 진홍빛 끝과 다섯 보석의 여왕관', edition: 'wardrobe' },
    { level: 110n, name: '서리왕의 장검', effect: 'glacier', color: '#b2eeff', detail: '투명한 빙하와 세 갈래 결정 가시의 장검', edition: 'wardrobe' },
    { level: 135n, name: '해무의 쌍곡도', effect: 'anchor', color: '#a3f0df', detail: '조개 가드와 두 개의 갈고리 날이 엇갈려요', edition: 'wardrobe' },
    { level: 165n, name: '월광 수정검', effect: 'eclipse', color: '#d7c0ff', detail: '빈 초승달 칼날 속에 떠 있는 보랏빛 수정', edition: 'wardrobe' },
    { level: 200n, name: '천뢰 쌍극검', effect: 'lightning', color: '#c3ddff', detail: '중앙 손잡이 양끝에서 뻗는 두 줄기의 번개날', edition: 'wardrobe' },
    { level: 245n, name: '심연 파도대검', effect: 'aurora', color: '#9ddcde', detail: '심해의 용처럼 길게 굽이치는 흑청색 검날', edition: 'wardrobe' },
    { level: 300n, name: '왕관 성채대검', effect: 'dawn', color: '#d9d9ff', detail: '세 겹의 성채 왕관과 푸른 유리창을 품은 대검', edition: 'wardrobe' },
    { level: 3n, name: "의천검", effect: "leaf", color: "#b3e7d7", detail: "구름 같은 옥빛 장식과 곧게 뻗은 청강의 명검", genre: "wuxia", edition: 'new' },
    { level: 7n, name: "도룡도", effect: "phoenix", color: "#dca58a", detail: "검은 철판의 넓은 외날과 붉은 용의 칼등", genre: "wuxia", edition: 'new' },
    { level: 11n, name: "현철중검", effect: "gravity", color: "#bcc6cc", detail: "꾸밈없이 두꺼운 현철로 벼린 무딘 대검", genre: "wuxia", edition: 'new' },
    { level: 17n, name: "어장검", effect: "anchor", color: "#d7dec5", detail: "짧은 물고기 배처럼 굽은 은빛 암살 비수", genre: "wuxia", edition: 'new' },
    { level: 23n, name: "청강검", effect: "comet", color: "#b5d4e8", detail: "푸른 강철의 중앙을 따라 새긴 용문과 은장식", genre: "wuxia", edition: 'new' },
    { level: 29n, name: "칠성검", effect: "galaxy", color: "#e8d5a5", detail: "일곱 개의 별을 검신에 박아 넣은 도문의 검", genre: "wuxia", edition: 'new' },
    { level: 38n, name: "간장 막야", effect: "infinity", color: "#d7c8cf", detail: "검은 산문과 흰 물결이 마주 보는 한 쌍의 검", genre: "wuxia", edition: 'new' },
    { level: 46n, name: "자미연검", effect: "aurora", color: "#d3b7ee", detail: "허리띠처럼 부드럽게 굽이치는 가느다란 연검", genre: "wuxia", edition: 'new' },
    { level: 54n, name: "엑스칼리버", effect: "dawn", color: "#f5d392", detail: "태양 문양의 황금 십자 가드로 완성한 왕의 성검", genre: "fantasy", edition: 'new' },
    { level: 62n, name: "그람", effect: "comet", color: "#e4ddbd", detail: "부러진 흔적을 금빛 선으로 잇고 다시 세운 왕검", genre: "fantasy", edition: 'new' },
    { level: 70n, name: "스팅", effect: "leaf", color: "#c1dfbd", detail: "넓은 잎새 모양 검신과 손에 맞는 작은 요정검", genre: "fantasy", edition: 'new' },
    { level: 78n, name: "서리한", effect: "glacier", color: "#add0ed", detail: "뿔 달린 해골 가드와 냉기를 품은 먹빛 룬검", genre: "fantasy", edition: 'new' },
    { level: 88n, name: "버스터 소드", effect: "gravity", color: "#c6c4bc", detail: "거대한 철판 두께와 단순한 가드로 드러나는 무게", genre: "fantasy", edition: 'new' },
    { level: 98n, name: "듀란달", effect: "eclipse", color: "#b7b8d1", detail: "검은 유리의 양날에 은빛 선을 두른 날카로운 성검", genre: "fantasy", edition: 'new' },
    { level: 115n, name: "아론다이트", effect: "glacier", color: "#a8efe5", detail: "물빛으로 투명한 넓은 검신 속에 흐르는 유리 결", genre: "fantasy", edition: 'new' },
    { level: 130n, name: "티르빙", effect: "phoenix", color: "#d7a1b2", detail: "붉은 눈과 뼈 같은 가드가 자라난 살아있는 마검", genre: "fantasy", edition: 'new' },
    { level: 145n, name: "검은 삼월", effect: "eclipse", color: "#c1bdad", detail: "달의 눈을 품은 작은 가드와 극도로 가느다란 검신", genre: "webtoon", edition: 'new' },
    { level: 160n, name: "초록 사월", effect: "leaf", color: "#b4e8c5", detail: "잎 모양 강철 마디가 길게 이어지는 변형 사복검", genre: "webtoon", edition: 'new' },
    { level: 175n, name: "붉은 탑의 시동검", effect: "phoenix", color: "#f1b2a2", detail: "세 개의 기동 고리와 붉은 결정 끝이 달린 탑의 검", genre: "webtoon", edition: 'new' },
    { level: 195n, name: "그림자 군주의 쌍검", effect: "gravity", color: "#c4afeb", detail: "서로 다른 길이의 검은 갈퀴날을 가진 그림자 쌍검", genre: "webtoon", edition: 'new' },
    { level: 215n, name: "귀환자의 봉인대검", effect: "keylight", color: "#d6cfbe", detail: "세 겹의 쇠사슬과 붉은 봉인핵으로 잠긴 대검", genre: "webtoon", edition: 'new' },
    { level: 240n, name: "별을 베는 단절검", effect: "comet", color: "#d4e0ed", detail: "끊어진 세 검신을 수정 연결핵으로 이어 붙인 검", genre: "webtoon", edition: 'new' },
    { level: 285n, name: "천마 혈월검", effect: "eclipse", color: "#e1a4b8", detail: "검붉은 초승달 검신과 핏빛 월석을 품은 천마검", genre: "webtoon", edition: 'new' },
    { level: 320n, name: "성좌의 심판검", effect: "dawn", color: "#f2deb0", detail: "하얀 십자 검신과 여섯 날개의 성좌 심판검", genre: "webtoon", edition: 'new' },
    { level: 33n, name: "화도일문자", effect: "comet", color: "#eee8d6", detail: "흰 손잡이와 칼집, 둥근 금빛 가드의 화도일문자", genre: "onepiece", edition: 'new' },
    { level: 58n, name: "3대 귀철", effect: "phoenix", color: "#e6b6a8", detail: "붉은 손잡이와 물결치는 칼날 무늬의 3대 귀철", genre: "onepiece", edition: 'new' },
    { level: 82n, name: "슈스이", effect: "eclipse", color: "#c4b8c7", detail: "검은 칼날과 커다란 흰 물결 무늬가 돋보이는 슈스이", genre: "onepiece", edition: 'new' },
    { level: 125n, name: "엔마", effect: "gravity", color: "#d2b5ee", detail: "보라색 손잡이와 세 갈래 꽃잎 가드의 엔마", genre: "onepiece", edition: 'new' },
    { level: 205n, name: "키코쿠", effect: "keylight", color: "#d9d4cb", detail: "흰 십자 무늬의 검은 칼집과 긴 손잡이의 키코쿠", genre: "onepiece", edition: 'new' },
    { level: 305n, name: "요루", effect: "dawn", color: "#e8d39b", detail: "거대한 황금 십자 가드와 넓게 휜 흑도의 요루", genre: "onepiece", edition: 'new' },
    // BLEACH collection start
    {level: 1n, "name": "참월", "effect": "gravity", "color": "#c5bbda", "detail": "쿠로사키 이치고 · 시해 · 초기 · 본편", "originalName": "斬月", "owner": "쿠로사키 이치고", "release": "시해", "variant": "초기", "continuity": "본편", "genre": "bleach", "edition": "new"},
    {level: 8n, "name": "참월", "effect": "gravity", "color": "#c5bbda", "detail": "쿠로사키 이치고 · 시해 · 풀브링 융합 · 본편", "originalName": "斬月", "owner": "쿠로사키 이치고", "release": "시해", "variant": "풀브링 융합", "continuity": "본편", "genre": "bleach", "edition": "new"},
    {level: 15n, "name": "참월", "effect": "eclipse", "color": "#c8b0ef", "detail": "쿠로사키 이치고 · 시해 · 진정한 쌍검 · 본편", "originalName": "斬月", "owner": "쿠로사키 이치고", "release": "시해", "variant": "진정한 쌍검", "continuity": "본편", "genre": "bleach", "edition": "new"},
    {level: 21n, "name": "수백설", "effect": "glacier", "color": "#ade9ff", "detail": "쿠치키 루키아 · 시해 · 백색 참백도 · 본편", "originalName": "袖白雪", "owner": "쿠치키 루키아", "release": "시해", "variant": "백색 참백도", "continuity": "본편", "genre": "bleach", "edition": "new"},
    {level: 31n, "name": "사미환", "effect": "phoenix", "color": "#f2b09c", "detail": "아바라이 렌지 · 시해 · 톱날 사복검 · 본편", "originalName": "蛇尾丸", "owner": "아바라이 렌지", "release": "시해", "variant": "톱날 사복검", "continuity": "본편", "genre": "bleach", "edition": "new"},
    {level: 35n, "name": "천본앵", "effect": "blossom", "color": "#ffc1d6", "detail": "쿠치키 뱌쿠야 · 시해 · 꽃잎 칼날 · 본편", "originalName": "千本桜", "owner": "쿠치키 뱌쿠야", "release": "시해", "variant": "꽃잎 칼날", "continuity": "본편", "genre": "bleach", "edition": "new"},
    {level: 41n, "name": "빙륜환", "effect": "glacier", "color": "#ade9ff", "detail": "히츠가야 토시로 · 시해 · 얼음 용 · 본편", "originalName": "氷輪丸", "owner": "히츠가야 토시로", "release": "시해", "variant": "얼음 용", "continuity": "본편", "genre": "bleach", "edition": "new"},
    {level: 43n, "name": "류인약화", "effect": "phoenix", "color": "#f2b09c", "detail": "야마모토 겐류사이 · 시해 · 화염 해방 · 본편", "originalName": "流刃若火", "owner": "야마모토 겐류사이", "release": "시해", "variant": "화염 해방", "continuity": "본편", "genre": "bleach", "edition": "new"},
    {level: 49n, "name": "홍희", "effect": "phoenix", "color": "#f2b09c", "detail": "우라하라 키스케 · 시해 · 붉은 매듭 · 본편", "originalName": "紅姫", "owner": "우라하라 키스케", "release": "시해", "variant": "붉은 매듭", "continuity": "본편", "genre": "bleach", "edition": "new"},
    {level: 51n, "name": "경화수월", "effect": "aurora", "color": "#c8dbe8", "detail": "아이젠 소스케 · 시해 · 완전최면 · 본편", "originalName": "鏡花水月", "owner": "아이젠 소스케", "release": "시해", "variant": "완전최면", "continuity": "본편", "genre": "bleach", "edition": "new"},
    {level: 57n, "name": "쌍어리", "effect": "anchor", "color": "#a9e7df", "detail": "우키타케 쥬시로 · 시해 · 한 쌍의 검 · 본편", "originalName": "双魚理", "owner": "우키타케 쥬시로", "release": "시해", "variant": "한 쌍의 검", "continuity": "본편", "genre": "bleach", "edition": "new"},
    {level: 61n, "name": "화천광골", "effect": "eclipse", "color": "#c8b0ef", "detail": "쿄라쿠 슌스이 · 시해 · 크고 작은 쌍도 · 본편", "originalName": "花天狂骨", "owner": "쿄라쿠 슌스이", "release": "시해", "variant": "크고 작은 쌍도", "continuity": "본편", "genre": "bleach", "edition": "new"},
    {level: 66n, "name": "육우삽", "effect": "leaf", "color": "#bce5be", "detail": "우노하나 레츠 · 시해 · 치유의 형상 · 본편", "originalName": "肉雫唼", "owner": "우노하나 레츠", "release": "시해", "variant": "치유의 형상", "continuity": "본편", "genre": "bleach", "edition": "new"},
    {level: 69n, "name": "작봉", "effect": "keylight", "color": "#f7dea4", "detail": "소이퐁 · 시해 · 손끝의 독침 · 본편", "originalName": "雀蜂", "owner": "소이퐁", "release": "시해", "variant": "손끝의 독침", "continuity": "본편", "genre": "bleach", "edition": "new"},
    {level: 73n, "name": "신창", "effect": "comet", "color": "#c9e0f7", "detail": "이치마루 긴 · 시해 · 신축의 검 · 본편", "originalName": "神鎗", "owner": "이치마루 긴", "release": "시해", "variant": "신축의 검", "continuity": "본편", "genre": "bleach", "edition": "new"},
    {level: 77n, "name": "천견", "effect": "gravity", "color": "#c5bbda", "detail": "코마무라 사진 · 시해 · 거인의 검 · 본편", "originalName": "天譴", "owner": "코마무라 사진", "release": "시해", "variant": "거인의 검", "continuity": "본편", "genre": "bleach", "edition": "new"},
    {level: 81n, "name": "청충", "effect": "infinity", "color": "#d2e6d7", "detail": "토센 카나메 · 시해 · 울리는 고리 · 본편", "originalName": "清虫", "owner": "토센 카나메", "release": "시해", "variant": "울리는 고리", "continuity": "본편", "genre": "bleach", "edition": "new"},
    {level: 86n, "name": "소쇄지장", "effect": "leaf", "color": "#bce5be", "detail": "쿠로츠치 마유리 · 시해 · 세 갈래 칼날 · 본편", "originalName": "疋殺地蔵", "owner": "쿠로츠치 마유리", "release": "시해", "variant": "세 갈래 칼날", "continuity": "본편", "genre": "bleach", "edition": "new"},
    {level: 89n, "name": "야쇄", "effect": "gravity", "color": "#c5bbda", "detail": "자라키 켄파치 · 시해 · 거대한 도끼날 · 본편", "originalName": "野晒", "owner": "자라키 켄파치", "release": "시해", "variant": "거대한 도끼날", "continuity": "본편", "genre": "bleach", "edition": "new"},
    {level: 93n, "name": "귀등환", "effect": "clockwork", "color": "#ecd095", "detail": "마다라메 잇카쿠 · 시해 · 삼절 장창 · 본편", "originalName": "鬼灯丸", "owner": "마다라메 잇카쿠", "release": "시해", "variant": "삼절 장창", "continuity": "본편", "genre": "bleach", "edition": "new"},
    {level: 96n, "name": "등공작", "effect": "fanblade", "color": "#dcc6ef", "detail": "아야세가와 유미치카 · 시해 · 불완전 해방 · 본편", "originalName": "藤孔雀", "owner": "아야세가와 유미치카", "release": "시해", "variant": "불완전 해방", "continuity": "본편", "genre": "bleach", "edition": "new"},
    {level: 101n, "name": "유리색공작", "effect": "leaf", "color": "#bce5be", "detail": "아야세가와 유미치카 · 시해 · 진정한 해방 · 본편", "originalName": "瑠璃色孔雀", "owner": "아야세가와 유미치카", "release": "시해", "variant": "진정한 해방", "continuity": "본편", "genre": "bleach", "edition": "new"},
    {level: 103n, "name": "차조", "effect": "gravity", "color": "#c5bbda", "detail": "키라 이즈루 · 시해 · ㄱ자 칼날 · 본편", "originalName": "侘助", "owner": "키라 이즈루", "release": "시해", "variant": "ㄱ자 칼날", "continuity": "본편", "genre": "bleach", "edition": "new"},
    {level: 106n, "name": "비매", "effect": "blossom", "color": "#ffc1d6", "detail": "히나모리 모모 · 시해 · 세 갈래 가지 · 본편", "originalName": "飛梅", "owner": "히나모리 모모", "release": "시해", "variant": "세 갈래 가지", "continuity": "본편", "genre": "bleach", "edition": "new"},
    {level: 108n, "name": "회묘", "effect": "aurora", "color": "#c8dbe8", "detail": "마츠모토 란기쿠 · 시해 · 재가 되는 칼날 · 본편", "originalName": "灰猫", "owner": "마츠모토 란기쿠", "release": "시해", "variant": "재가 되는 칼날", "continuity": "본편", "genre": "bleach", "edition": "new"},
    {level: 112n, "name": "동운", "effect": "glacier", "color": "#ade9ff", "detail": "코테츠 이사네 · 시해 · 세 갈래 서리검 · 본편", "originalName": "凍雲", "owner": "코테츠 이사네", "release": "시해", "variant": "세 갈래 서리검", "continuity": "본편", "genre": "bleach", "edition": "new"},
    {level: 114n, "name": "엄령환", "effect": "lightning", "color": "#c6dcff", "detail": "사사키베 쵸지로 · 시해 · 번개 레이피어 · 본편", "originalName": "厳霊丸", "owner": "사사키베 쵸지로", "release": "시해", "variant": "번개 레이피어", "continuity": "본편", "genre": "bleach", "edition": "new"},
    {level: 117n, "name": "단풍", "effect": "comet", "color": "#c9e0f7", "detail": "무구루마 켄세이 · 시해 · 전투 단검 · 본편", "originalName": "断風", "owner": "무구루마 켄세이", "release": "시해", "variant": "전투 단검", "continuity": "본편", "genre": "bleach", "edition": "new"},
    {level: 121n, "name": "금사라", "effect": "clockwork", "color": "#ecd095", "detail": "오오토리바시 로쥬로 · 시해 · 황금 채찍 · 본편", "originalName": "金沙羅", "owner": "오오토리바시 로쥬로", "release": "시해", "variant": "황금 채찍", "continuity": "본편", "genre": "bleach", "edition": "new"},
    {level: 123n, "name": "역무", "effect": "infinity", "color": "#d2e6d7", "detail": "히라코 신지 · 시해 · 뒤집힌 검 · 본편", "originalName": "逆撫", "owner": "히라코 신지", "release": "시해", "variant": "뒤집힌 검", "continuity": "본편", "genre": "bleach", "edition": "new"},
    {level: 127n, "name": "풍사", "effect": "eclipse", "color": "#c8b0ef", "detail": "히사기 슈헤이 · 시해 · 사슬 쌍낫 · 본편", "originalName": "風死", "owner": "히사기 슈헤이", "release": "시해", "variant": "사슬 쌍낫", "continuity": "본편", "genre": "bleach", "edition": "new"},
    {level: 129n, "name": "오형두", "effect": "gravity", "color": "#c5bbda", "detail": "오오마에다 마레치요 · 시해 · 가시 철퇴 · 본편", "originalName": "五形頭", "owner": "오오마에다 마레치요", "release": "시해", "variant": "가시 철퇴", "continuity": "본편", "genre": "bleach", "edition": "new"},
    {level: 133n, "name": "벽오", "effect": "fanblade", "color": "#dcc6ef", "detail": "잇칸자카 지로보 · 시해 · 비행 칼날 · 본편", "originalName": "劈烏", "owner": "잇칸자카 지로보", "release": "시해", "variant": "비행 칼날", "continuity": "본편", "genre": "bleach", "edition": "new"},
    {level: 136n, "name": "토점", "effect": "anchor", "color": "#a9e7df", "detail": "쿠루마다니 젠노스케 · 시해 · 풍화륜 · 본편", "originalName": "土鯰", "owner": "쿠루마다니 젠노스케", "release": "시해", "variant": "풍화륜", "continuity": "본편", "genre": "bleach", "edition": "new"},
    {level: 139n, "name": "춘진", "effect": "aurora", "color": "#c8dbe8", "detail": "토가쿠시 리쿠 · 시해 · 장병 대낫 · 본편", "originalName": "春塵", "owner": "토가쿠시 리쿠", "release": "시해", "variant": "장병 대낫", "continuity": "본편", "genre": "bleach", "edition": "new"},
    {level: 141n, "name": "자락", "effect": "keylight", "color": "#f7dea4", "detail": "슈타라 센쥬마루 · 특수 · 황금 바늘 · 본편", "originalName": "刺絡", "owner": "슈타라 센쥬마루", "release": "특수", "variant": "황금 바늘", "continuity": "본편", "genre": "bleach", "edition": "new"},
    {level: 144n, "name": "일문자", "effect": "eclipse", "color": "#c8b0ef", "detail": "효스베 이치베 · 시해 · 먹빛 붓날 · 본편", "originalName": "一文字", "owner": "효스베 이치베", "release": "시해", "variant": "먹빛 붓날", "continuity": "본편", "genre": "bleach", "edition": "new"},
    {level: 147n, "name": "초복", "effect": "comet", "color": "#c9e0f7", "detail": "니마이야 오에츠 · 특수 · 날을 거둘 수 없는 검 · 본편", "originalName": "鞘伏", "owner": "니마이야 오에츠", "release": "특수", "variant": "날을 거둘 수 없는 검", "continuity": "본편", "genre": "bleach", "edition": "new"},
    {level: 151n, "name": "신검팔경검", "effect": "dawn", "color": "#ffe5a7", "detail": "이세 나나오 · 시해 · 이세 가문의 신검 · 본편", "originalName": "神剣・八鏡剣", "owner": "이세 나나오", "release": "시해", "variant": "이세 가문의 신검", "continuity": "본편", "genre": "bleach", "edition": "new"},
    {level: 153n, "name": "염월", "effect": "phoenix", "color": "#f2b09c", "detail": "쿠로사키 잇신 · 봉인 · 해방 외형 미공개 · 본편", "originalName": "剡月", "owner": "쿠로사키 잇신", "release": "봉인", "variant": "해방 외형 미공개", "continuity": "본편", "genre": "bleach", "edition": "new"},
    {level: 155n, "name": "호환", "effect": "leaf", "color": "#bce5be", "detail": "야마다 하나타로 · 봉인 · 치유 게이지 · 본편", "originalName": "瓠丸", "owner": "야마다 하나타로", "release": "봉인", "variant": "치유 게이지", "continuity": "본편", "genre": "bleach", "edition": "new"},
    {level: 158n, "name": "주색호환", "effect": "phoenix", "color": "#f2b09c", "detail": "야마다 하나타로 · 시해 · 작은 메스 · 본편", "originalName": "朱色瓠丸", "owner": "야마다 하나타로", "release": "시해", "variant": "작은 메스", "continuity": "본편", "genre": "bleach", "edition": "new"},
    {level: 161n, "name": "철장청령", "effect": "comet", "color": "#c9e0f7", "detail": "야도마루 리사 · 시해 · 거대한 창 · 본편", "originalName": "鉄漿蜻蛉", "owner": "야도마루 리사", "release": "시해", "variant": "거대한 창", "continuity": "본편", "genre": "bleach", "edition": "new"},
    {level: 164n, "name": "화천광골", "effect": "eclipse", "color": "#c8b0ef", "detail": "쿄라쿠 슌스이 · 봉인 · 다이쇼 한 쌍 · 본편", "originalName": "花天狂骨", "owner": "쿄라쿠 슌스이", "release": "봉인", "variant": "다이쇼 한 쌍", "continuity": "본편", "genre": "bleach", "edition": "new"},
    {level: 167n, "name": "열화", "effect": "anchor", "color": "#a9e7df", "detail": "시바 카이엔 · 시해 · 물결 삼지창 · 본편", "originalName": "捩花", "owner": "시바 카이엔", "release": "시해", "variant": "물결 삼지창", "continuity": "본편", "genre": "bleach", "edition": "new"},
    {level: 170n, "name": "금비가", "effect": "dawn", "color": "#ffe5a7", "detail": "키린지 텐지로 · 시해 · 금빛 장병기 · 본편", "originalName": "金毘迦", "owner": "키린지 텐지로", "release": "시해", "variant": "금빛 장병기", "continuity": "본편", "genre": "bleach", "edition": "new"},
    {level: 172n, "name": "뇌화", "effect": "phoenix", "color": "#f2b09c", "detail": "아마가이 슈스케 · 시해 · 굽은 갈고리 · 애니 외전", "originalName": "雷火", "owner": "아마가이 슈스케", "release": "시해", "variant": "굽은 갈고리", "continuity": "애니 외전", "genre": "bleach", "edition": "new"},
    {level: 176n, "name": "열풍", "effect": "fanblade", "color": "#dcc6ef", "detail": "키부네 마코토 · 시해 · 양날 장병기 · 애니 외전", "originalName": "烈風", "owner": "키부네 마코토", "release": "시해", "variant": "양날 장병기", "continuity": "애니 외전", "genre": "bleach", "edition": "new"},
    {level: 178n, "name": "홍하", "effect": "aurora", "color": "#c8dbe8", "detail": "이치노세 마키 · 시해 · 빛의 칼날 · 애니 외전", "originalName": "虹霞", "owner": "이치노세 마키", "release": "시해", "variant": "빛의 칼날", "continuity": "애니 외전", "genre": "bleach", "edition": "new"},
    {level: 182n, "name": "촌정", "effect": "eclipse", "color": "#c8b0ef", "detail": "쿠치키 코우가 · 시해 · 참백도의 속삭임 · 애니 외전", "originalName": "村正", "owner": "쿠치키 코우가", "release": "시해", "variant": "참백도의 속삭임", "continuity": "애니 외전", "genre": "bleach", "edition": "new"},
    {level: 184n, "name": "퇴홍시우", "effect": "blossom", "color": "#ffc1d6", "detail": "쿠죠 노조미 · 시해 · 분홍빛 흡수검 · 애니 외전", "originalName": "退紅時雨", "owner": "쿠죠 노조미", "release": "시해", "variant": "분홍빛 흡수검", "continuity": "애니 외전", "genre": "bleach", "edition": "new"},
    {level: 187n, "name": "내공", "effect": "gravity", "color": "#c5bbda", "detail": "이나바 카게로자 · 시해 · 양끝의 검날 · 애니 외전", "originalName": "來空", "owner": "이나바 카게로자", "release": "시해", "variant": "양끝의 검날", "continuity": "애니 외전", "genre": "bleach", "edition": "new"},
    {level: 189n, "name": "묵월운", "effect": "eclipse", "color": "#c8b0ef", "detail": "유시마 오코 · 시해 · 고리 양날검 · 애니 외전", "originalName": "墨月暈", "owner": "유시마 오코", "release": "시해", "variant": "고리 양날검", "continuity": "애니 외전", "genre": "bleach", "edition": "new"},
    {level: 191n, "name": "홍지수", "effect": "blossom", "color": "#ffc1d6", "detail": "켄자키 류세이 · 시해 · 꽃피는 칼날 · 애니 외전", "originalName": "紅枝垂", "owner": "켄자키 류세이", "release": "시해", "variant": "꽃피는 칼날", "continuity": "애니 외전", "genre": "bleach", "edition": "new"},
    {level: 194n, "name": "대지환", "effect": "gravity", "color": "#c5bbda", "detail": "엔코가와 루자부로 · 시해 · 사슬 거대 주먹 · 애니 외전", "originalName": "大地丸", "owner": "엔코가와 루자부로", "release": "시해", "variant": "사슬 거대 주먹", "continuity": "애니 외전", "genre": "bleach", "edition": "new"},
    {level: 197n, "name": "붕산", "effect": "gravity", "color": "#c5bbda", "detail": "엔죠지 타츠후사 · 봉인 · 해방 외형 미공개 · 본편", "originalName": "崩山", "owner": "엔죠지 타츠후사", "release": "봉인", "variant": "해방 외형 미공개", "continuity": "본편", "genre": "bleach", "edition": "new"},
    {level: 201n, "name": "미륵환", "effect": "aurora", "color": "#c8dbe8", "detail": "센나 · 시해 · 고리 장봉 · 극장판", "originalName": "弥勒丸", "owner": "센나", "release": "시해", "variant": "고리 장봉", "continuity": "극장판", "genre": "bleach", "edition": "new"},
    {level: 203n, "name": "자전", "effect": "lightning", "color": "#c6dcff", "detail": "스즈나미 세이겐 · 시해 · 보랏빛 번개 · 게임 외전", "originalName": "紫電", "owner": "스즈나미 세이겐", "release": "시해", "variant": "보랏빛 번개", "continuity": "게임 외전", "genre": "bleach", "edition": "new"},
    {level: 207n, "name": "용조환", "effect": "comet", "color": "#c9e0f7", "detail": "쿠도 후지마루 · 시해 · 용의 칼날 · 게임 외전", "originalName": "竜条丸", "owner": "쿠도 후지마루", "release": "시해", "variant": "용의 칼날", "continuity": "게임 외전", "genre": "bleach", "edition": "new"},
    {level: 209n, "name": "호도환", "effect": "leaf", "color": "#bce5be", "detail": "쿠도 마츠리 · 시해 · 호랑이의 칼날 · 게임 외전", "originalName": "虎淘丸", "owner": "쿠도 마츠리", "release": "시해", "variant": "호랑이의 칼날", "continuity": "게임 외전", "genre": "bleach", "edition": "new"},
    {level: 212n, "name": "비원화", "effect": "blossom", "color": "#ffc1d6", "detail": "원래 사용자 미상 · 시해 · 붉은 꽃의 형상 · 게임 외전", "originalName": "緋願花", "owner": "원래 사용자 미상", "release": "시해", "variant": "붉은 꽃의 형상", "continuity": "게임 외전", "genre": "bleach", "edition": "new"},
    {level: 214n, "name": "염라경전", "effect": "aurora", "color": "#c8dbe8", "detail": "츠나야시로 토키나다 · 시해 · 거울의 전승검 · 소설 외전", "originalName": "艶羅鏡典", "owner": "츠나야시로 토키나다", "release": "시해", "variant": "거울의 전승검", "continuity": "소설 외전", "genre": "bleach", "edition": "new"},
    {level: 218n, "name": "구천경곡", "effect": "dawn", "color": "#ffe5a7", "detail": "츠나야시로 가문 · 특수 · 전승검의 옛 이름 · 소설 외전", "originalName": "九天鏡谷", "owner": "츠나야시로 가문", "release": "특수", "variant": "전승검의 옛 이름", "continuity": "소설 외전", "genre": "bleach", "edition": "new"},
    {level: 221n, "name": "이기사기파", "effect": "gravity", "color": "#c5bbda", "detail": "히코네 · 특수 · 봉인된 영검 · 소설 외전", "originalName": "已己巳己巴", "owner": "히코네", "release": "특수", "variant": "봉인된 영검", "continuity": "소설 외전", "genre": "bleach", "edition": "new"},
    {level: 224n, "name": "아악회랑", "effect": "gravity", "color": "#c5bbda", "detail": "쿠루야시키 켄파치 · 시해 · 이빨의 형상 · 소설 외전", "originalName": "餓樂廻廊", "owner": "쿠루야시키 켄파치", "release": "시해", "variant": "이빨의 형상", "continuity": "소설 외전", "genre": "bleach", "edition": "new"},
    {level: 226n, "name": "우로자류", "effect": "aurora", "color": "#c8dbe8", "detail": "아자시로 켄파치 · 만해 · 환경 융합 해석 · 소설 외전", "originalName": "雨露柘榴", "owner": "아자시로 켄파치", "release": "만해", "variant": "환경 융합 해석", "continuity": "소설 외전", "genre": "bleach", "edition": "new"},
    {level: 228n, "name": "천구환", "effect": "gravity", "color": "#c5bbda", "detail": "아이카와 러브 · 시해 · 가시 철퇴 · 본편", "originalName": "天狗丸", "owner": "아이카와 러브", "release": "시해", "variant": "가시 철퇴", "continuity": "본편", "genre": "bleach", "edition": "new"},
    {level: 231n, "name": "수절대사", "effect": "gravity", "color": "#c5bbda", "detail": "사루가키 히요리 · 시해 · 톱날 대도 · 본편", "originalName": "馘大蛇", "owner": "사루가키 히요리", "release": "시해", "variant": "톱날 대도", "continuity": "본편", "genre": "bleach", "edition": "new"},
    {level: 233n, "name": "쌍극", "effect": "phoenix", "color": "#f2b09c", "detail": "소울 소사이어티 · 특수 · 봉인된 처형창 · 본편", "originalName": "双殛", "owner": "소울 소사이어티", "release": "특수", "variant": "봉인된 처형창", "continuity": "본편", "genre": "bleach", "edition": "new"},
    {level: 236n, "name": "천쇄참월", "effect": "eclipse", "color": "#c8b0ef", "detail": "쿠로사키 이치고 · 만해 · 초기 · 본편", "originalName": "天鎖斬月", "owner": "쿠로사키 이치고", "release": "만해", "variant": "초기", "continuity": "본편", "genre": "bleach", "edition": "new"},
    {level: 238n, "name": "천쇄참월", "effect": "eclipse", "color": "#c8b0ef", "detail": "쿠로사키 이치고 · 만해 · 풀브링 융합 · 본편", "originalName": "天鎖斬月", "owner": "쿠로사키 이치고", "release": "만해", "variant": "풀브링 융합", "continuity": "본편", "genre": "bleach", "edition": "new"},
    {level: 242n, "name": "천쇄참월", "effect": "infinity", "color": "#d2e6d7", "detail": "쿠로사키 이치고 · 만해 · 진정한 만해 · 본편", "originalName": "天鎖斬月", "owner": "쿠로사키 이치고", "release": "만해", "variant": "진정한 만해", "continuity": "본편", "genre": "bleach", "edition": "new"},
    {level: 244n, "name": "천쇄참월", "effect": "eclipse", "color": "#c8b0ef", "detail": "쿠로사키 이치고 · 만해 · 단계 수련 융합 · 본편", "originalName": "天鎖斬月", "owner": "쿠로사키 이치고", "release": "만해", "variant": "단계 수련 융합", "continuity": "본편", "genre": "bleach", "edition": "new"},
    {level: 248n, "name": "백하벌", "effect": "glacier", "color": "#ade9ff", "detail": "쿠치키 루키아 · 만해 · 백설의 해방 · 본편", "originalName": "白霞罸", "owner": "쿠치키 루키아", "release": "만해", "variant": "백설의 해방", "continuity": "본편", "genre": "bleach", "edition": "new"},
    {level: 250n, "name": "비비왕사미환", "effect": "gravity", "color": "#c5bbda", "detail": "아바라이 렌지 · 만해 · 불완전한 이름 · 본편", "originalName": "狒狒王蛇尾丸", "owner": "아바라이 렌지", "release": "만해", "variant": "불완전한 이름", "continuity": "본편", "genre": "bleach", "edition": "new"},
    {level: 253n, "name": "쌍왕사미환", "effect": "phoenix", "color": "#f2b09c", "detail": "아바라이 렌지 · 만해 · 진정한 만해 · 본편", "originalName": "双王蛇尾丸", "owner": "아바라이 렌지", "release": "만해", "variant": "진정한 만해", "continuity": "본편", "genre": "bleach", "edition": "new"},
    {level: 255n, "name": "천본앵경엄", "effect": "blossom", "color": "#ffc1d6", "detail": "쿠치키 뱌쿠야 · 만해 · 칼날의 정원 · 본편", "originalName": "千本桜景厳", "owner": "쿠치키 뱌쿠야", "release": "만해", "variant": "칼날의 정원", "continuity": "본편", "genre": "bleach", "edition": "new"},
    {level: 258n, "name": "천본앵경엄", "effect": "dawn", "color": "#ffe5a7", "detail": "쿠치키 뱌쿠야 · 만해 · 종경 백제검 · 본편", "originalName": "千本桜景厳", "owner": "쿠치키 뱌쿠야", "release": "만해", "variant": "종경 백제검", "continuity": "본편", "genre": "bleach", "edition": "new"},
    {level: 260n, "name": "대홍련빙륜환", "effect": "glacier", "color": "#ade9ff", "detail": "히츠가야 토시로 · 만해 · 빙룡의 날개 · 본편", "originalName": "大紅蓮氷輪丸", "owner": "히츠가야 토시로", "release": "만해", "variant": "빙룡의 날개", "continuity": "본편", "genre": "bleach", "edition": "new"},
    {level: 262n, "name": "대홍련빙륜환", "effect": "glacier", "color": "#ade9ff", "detail": "히츠가야 토시로 · 만해 · 완성형 · 본편", "originalName": "大紅蓮氷輪丸", "owner": "히츠가야 토시로", "release": "만해", "variant": "완성형", "continuity": "본편", "genre": "bleach", "edition": "new"},
    {level: 265n, "name": "잔화태도", "effect": "phoenix", "color": "#f2b09c", "detail": "야마모토 겐류사이 · 만해 · 불꽃을 거둔 검 · 본편", "originalName": "残火の太刀", "owner": "야마모토 겐류사이", "release": "만해", "variant": "불꽃을 거둔 검", "continuity": "본편", "genre": "bleach", "edition": "new"},
    {level: 267n, "name": "관음개홍희개", "effect": "phoenix", "color": "#f2b09c", "detail": "우라하라 키스케 · 만해 · 재구성의 붉은 실 · 본편", "originalName": "観音開紅姫改メ", "owner": "우라하라 키스케", "release": "만해", "variant": "재구성의 붉은 실", "continuity": "본편", "genre": "bleach", "edition": "new"},
    {level: 271n, "name": "화천광골고송심중", "effect": "eclipse", "color": "#c8b0ef", "detail": "쿄라쿠 슌스이 · 만해 · 검은 실의 무대 · 본편", "originalName": "花天狂骨枯松心中", "owner": "쿄라쿠 슌스이", "release": "만해", "variant": "검은 실의 무대", "continuity": "본편", "genre": "bleach", "edition": "new"},
    {level: 273n, "name": "개진", "effect": "phoenix", "color": "#f2b09c", "detail": "우노하나 레츠 · 만해 · 진홍의 검 · 본편", "originalName": "皆尽", "owner": "우노하나 레츠", "release": "만해", "variant": "진홍의 검", "continuity": "본편", "genre": "bleach", "edition": "new"},
    {level: 276n, "name": "작봉뇌공편", "effect": "clockwork", "color": "#ecd095", "detail": "소이퐁 · 만해 · 황금 포신 · 본편", "originalName": "雀蜂雷公鞭", "owner": "소이퐁", "release": "만해", "variant": "황금 포신", "continuity": "본편", "genre": "bleach", "edition": "new"},
    {level: 278n, "name": "신살창", "effect": "comet", "color": "#c9e0f7", "detail": "이치마루 긴 · 만해 · 길게 뻗는 은날 · 본편", "originalName": "神殺鎗", "owner": "이치마루 긴", "release": "만해", "variant": "길게 뻗는 은날", "continuity": "본편", "genre": "bleach", "edition": "new"},
    {level: 281n, "name": "흑승천견명왕", "effect": "gravity", "color": "#c5bbda", "detail": "코마무라 사진 · 만해 · 갑주의 거인 · 본편", "originalName": "黒縄天譴明王", "owner": "코마무라 사진", "release": "만해", "variant": "갑주의 거인", "continuity": "본편", "genre": "bleach", "edition": "new"},
    {level: 283n, "name": "흑승천견명왕", "effect": "phoenix", "color": "#f2b09c", "detail": "코마무라 사진 · 만해 · 단개승의 · 본편", "originalName": "黒縄天譴明王", "owner": "코마무라 사진", "release": "만해", "variant": "단개승의", "continuity": "본편", "genre": "bleach", "edition": "new"},
    {level: 287n, "name": "청충종식염마실솔", "effect": "eclipse", "color": "#c8b0ef", "detail": "토센 카나메 · 만해 · 감각의 검은 구 · 본편", "originalName": "清虫終式・閻魔蟋蟀", "owner": "토센 카나메", "release": "만해", "variant": "감각의 검은 구", "continuity": "본편", "genre": "bleach", "edition": "new"},
    {level: 289n, "name": "금색소쇄지장", "effect": "leaf", "color": "#bce5be", "detail": "쿠로츠치 마유리 · 만해 · 황금 지장 · 본편", "originalName": "金色疋殺地蔵", "owner": "쿠로츠치 마유리", "release": "만해", "variant": "황금 지장", "continuity": "본편", "genre": "bleach", "edition": "new"},
    {level: 292n, "name": "금색소쇄지장", "effect": "gravity", "color": "#c5bbda", "detail": "쿠로츠치 마유리 · 만해 · 마태복인증체 · 본편", "originalName": "金色疋殺地蔵", "owner": "쿠로츠치 마유리", "release": "만해", "variant": "마태복인증체", "continuity": "본편", "genre": "bleach", "edition": "new"},
    {level: 294n, "name": "야쇄", "effect": "phoenix", "color": "#f2b09c", "detail": "자라키 켄파치 · 만해 · 이름 미공개 · 본편", "originalName": "野晒", "owner": "자라키 켄파치", "release": "만해", "variant": "이름 미공개", "continuity": "본편", "genre": "bleach", "edition": "new"},
    {level: 296n, "name": "용문귀등환", "effect": "phoenix", "color": "#f2b09c", "detail": "마다라메 잇카쿠 · 만해 · 세 개의 거대 날 · 본편", "originalName": "龍紋鬼灯丸", "owner": "마다라메 잇카쿠", "release": "만해", "variant": "세 개의 거대 날", "continuity": "본편", "genre": "bleach", "edition": "new"},
    {level: 299n, "name": "황황엄령이궁", "effect": "lightning", "color": "#c6dcff", "detail": "사사키베 쵸지로 · 만해 · 번개 기둥 · 본편", "originalName": "黄煌厳霊離宮", "owner": "사사키베 쵸지로", "release": "만해", "variant": "번개 기둥", "continuity": "본편", "genre": "bleach", "edition": "new"},
    {level: 302n, "name": "철권단풍", "effect": "clockwork", "color": "#ecd095", "detail": "무구루마 켄세이 · 만해 · 강철 쌍권 · 본편", "originalName": "鐵拳断風", "owner": "무구루마 켄세이", "release": "만해", "variant": "강철 쌍권", "continuity": "본편", "genre": "bleach", "edition": "new"},
    {level: 306n, "name": "금사라무답단", "effect": "clockwork", "color": "#ecd095", "detail": "오오토리바시 로쥬로 · 만해 · 황금 무희 · 본편", "originalName": "金沙羅舞踏団", "owner": "오오토리바시 로쥬로", "release": "만해", "variant": "황금 무희", "continuity": "본편", "genre": "bleach", "edition": "new"},
    {level: 308n, "name": "역양사팔보색", "effect": "dawn", "color": "#ffe5a7", "detail": "히라코 신지 · 만해 · 금빛 연꽃 · 본편", "originalName": "逆様邪八宝塞", "owner": "히라코 신지", "release": "만해", "variant": "금빛 연꽃", "continuity": "본편", "genre": "bleach", "edition": "new"},
    {level: 311n, "name": "풍사교승", "effect": "eclipse", "color": "#c8b0ef", "detail": "히사기 슈헤이 · 만해 · 생명을 잇는 사슬 · 소설 외전", "originalName": "風死絞縄", "owner": "히사기 슈헤이", "release": "만해", "variant": "생명을 잇는 사슬", "continuity": "소설 외전", "genre": "bleach", "edition": "new"},
    {level: 313n, "name": "백필일문자", "effect": "infinity", "color": "#d2e6d7", "detail": "효스베 이치베 · 진타 · 만해 이전의 이름 · 본편", "originalName": "しら筆一文字", "owner": "효스베 이치베", "release": "진타", "variant": "만해 이전의 이름", "continuity": "본편", "genre": "bleach", "edition": "new"},
    {level: 316n, "name": "사달가라해자락십", "effect": "keylight", "color": "#f7dea4", "detail": "슈타라 센쥬마루 · 만해 · 여섯 빛의 베틀 · 본편", "originalName": "娑闥迦羅骸刺絡辻", "owner": "슈타라 센쥬마루", "release": "만해", "variant": "여섯 빛의 베틀", "continuity": "본편", "genre": "bleach", "edition": "new"},
    {level: 318n, "name": "뇌화업염각", "effect": "phoenix", "color": "#f2b09c", "detail": "아마가이 슈스케 · 만해 · 불꽃 부채날 · 애니 외전", "originalName": "雷火・業炎殻", "owner": "아마가이 슈스케", "release": "만해", "variant": "불꽃 부채날", "continuity": "애니 외전", "genre": "bleach", "edition": "new"},
    {level: 322n, "name": "무구조주촌정", "effect": "eclipse", "color": "#c8b0ef", "detail": "쿠치키 코우가 · 만해 · 촌정의 현현 · 애니 외전", "originalName": "無鉤条誅村正", "owner": "쿠치키 코우가", "release": "만해", "variant": "촌정의 현현", "continuity": "애니 외전", "genre": "bleach", "edition": "new"},
    {level: 324n, "name": "호규용조환", "effect": "lightning", "color": "#c6dcff", "detail": "쿠도 후지마루 · 만해 · 용과 호랑이 · 게임 외전", "originalName": "虎糾竜条丸", "owner": "쿠도 후지마루", "release": "만해", "variant": "용과 호랑이", "continuity": "게임 외전", "genre": "bleach", "edition": "new"},
    {level: 327n, "name": "용규호도환", "effect": "leaf", "color": "#bce5be", "detail": "쿠도 마츠리 · 만해 · 쌍둥이의 해방 · 게임 외전", "originalName": "竜糾虎淘丸", "owner": "쿠도 마츠리", "release": "만해", "variant": "쌍둥이의 해방", "continuity": "게임 외전", "genre": "bleach", "edition": "new"},
    {level: 329n, "name": "대연옥비원화", "effect": "blossom", "color": "#ffc1d6", "detail": "원래 사용자 미상 · 만해 · 제1형태 · 게임 외전", "originalName": "大煉獄緋願花", "owner": "원래 사용자 미상", "release": "만해", "variant": "제1형태", "continuity": "게임 외전", "genre": "bleach", "edition": "new"},
    {level: 5n, "name": "삼보검수", "effect": "leaf", "color": "#bce5be", "detail": "쿠사지시 야치루 · 시해 · 두 검수의 현현 · 본편", "originalName": "三步剣獣", "owner": "쿠사지시 야치루", "release": "시해", "variant": "두 검수의 현현", "continuity": "본편", "genre": "bleach", "edition": "new"},
    {level: 10n, "name": "호락적", "effect": "gravity", "color": "#c5bbda", "detail": "고리 타케츠나 · 시해 · 구멍 난 면도날 · 본편", "originalName": "虎落笛", "owner": "고리 타케츠나", "release": "시해", "variant": "구멍 난 면도날", "continuity": "본편", "genre": "bleach", "edition": "new"},
    {level: 13n, "name": "편음", "effect": "eclipse", "color": "#c8b0ef", "detail": "카타쿠라 아스카 · 시해 · 두 갈래 칼날 · 본편", "originalName": "片陰", "owner": "카타쿠라 아스카", "release": "시해", "variant": "두 갈래 칼날", "continuity": "본편", "genre": "bleach", "edition": "new"},
    {level: 19n, "name": "대연옥비원화", "effect": "gravity", "color": "#c5bbda", "detail": "원래 사용자 미상 · 만해 · 제2형태 · 게임 외전", "originalName": "大煉獄緋願花", "owner": "원래 사용자 미상", "release": "만해", "variant": "제2형태", "continuity": "게임 외전", "genre": "bleach", "edition": "new"},
    {level: 25n, "name": "대연옥비원화", "effect": "phoenix", "color": "#f2b09c", "detail": "원래 사용자 미상 · 만해 · 제3형태 · 게임 외전", "originalName": "大煉獄緋願花", "owner": "원래 사용자 미상", "release": "만해", "variant": "제3형태", "continuity": "게임 외전", "genre": "bleach", "edition": "new"},
    // BLEACH collection end
  ].sort((a, b) => a.level < b.level ? -1 : 1);

  const enchantments = [
    { id: 'cinder', name: '잿불의 숨결', rank: '일반', mark: '♨', tenths: 12n, weight: 38 },
    { id: 'solar', name: '노을의 불꽃', rank: '희귀', mark: '☀', tenths: 14n, weight: 22 },
    { id: 'astral', name: '별빛의 축복', rank: '영웅', mark: '✦', tenths: 24n, weight: 12 },
    { id: 'verdant', name: '숲의 가호', rank: '희귀', mark: '❧', tenths: 21n, weight: 14 },
    { id: 'frost', name: '서리꽃 각인', rank: '희귀', mark: '❄', tenths: 16n, weight: 28 },
    { id: 'storm', name: '폭풍의 맹세', rank: '희귀', mark: 'ϟ', tenths: 19n, weight: 18 },
    { id: 'lunar', name: '월식의 계약', rank: '전설', mark: '☾', tenths: 32n, weight: 4 },
  ];

  const magics = [
    { id: 'fire', name: '화염', title: '불꽃의 서약', mark: '♨', color: '#ff9e3d', detail: '검날을 타고 오르는 불꽃과 흩날리는 불씨' },
    { id: 'ice', name: '빙결', title: '영원의 서리', mark: '❄', color: '#9ce9ff', detail: '서리꽃과 공중에 부서지는 투명한 얼음 결정' },
    { id: 'thunder', name: '전격', title: '뇌명의 심장', mark: 'ϟ', color: '#c6d8ff', detail: '칼날 사이를 가르는 번개와 떠 있는 전하 고리' },
    { id: 'void', name: '공허', title: '심연의 부름', mark: '◈', color: '#d2a8ff', detail: '빛을 삼키는 검은 궤도와 안으로 빨려드는 별가루' },
    { id: 'radiance', name: '성광', title: '여명의 축복', mark: '✧', color: '#fff0a6', detail: '검을 감싸는 날개빛과 겹겹이 펼쳐지는 성환' },
  ];

  function normalizeMagic(raw, level = 0n) {
    if (!raw || !magics.some(entry => entry.id === raw.id)) return null;
    const peak = natural(raw.peak);
    if (peak < 100n) return null;
    return { id: raw.id, peak: peak > level ? peak : level };
  }

  function magicAt(state) {
    const bound = state.broken ? null : normalizeMagic(state.magic, state.level);
    if (!bound) return null;
    const rank = 1n + (bound.peak - 100n) / 25n;
    return { ...magics.find(entry => entry.id === bound.id), peak: bound.peak, rank,
      tier: Number(rank > 5n ? 5n : rank), tenths: 17n + rank };
  }

  function rollEnchantment(random, excluded = []) {
    const available = enchantments.filter(entry => !excluded.includes(entry.id));
    let roll = random() * available.reduce((total, entry) => total + entry.weight, 0);
    for (const enchantment of available) {
      roll -= enchantment.weight;
      if (roll < 0) return enchantment.id;
    }
    return available.at(-1).id;
  }

  function appraisal(state) {
    const effects = state.broken ? [] : state.enchantments.map(id => enchantments.find(entry => entry.id === id));
    const numerator = effects.reduce((product, entry) => product * entry.tenths, 1n);
    const denominator = 10n ** BigInt(effects.length);
    const rawBase = state.broken ? 0n : 120n + 15n * state.level * (state.level + 1n) * (state.level + 2n);
    const levelTenths = 10n + state.level;
    const base = rawBase * levelTenths / 10n;
    const engravedValue = base * numerator / denominator;
    const magic = magicAt(state);
    const value = magic ? engravedValue * magic.tenths / 10n : engravedValue;
    return { enchantment: effects[0], effects, numerator, denominator, rawBase, levelTenths, base, engravedValue, magic, magicBonus: value - engravedValue, value };
  }

  function natural(value, fallback = 0n) {
    if (typeof value === 'bigint') return value >= 0n ? value : fallback;
    if (typeof value === 'number') return Number.isSafeInteger(value) && value >= 0 ? BigInt(value) : fallback;
    if (typeof value === 'string' && /^\d+$/.test(value)) return BigInt(value);
    return fallback;
  }

  function timestamp(value, now) {
    return Number.isFinite(value) && value >= 0 ? Math.min(value, now) : now;
  }

  function restore(raw, now = Date.now(), random = Math.random) {
    const old = raw && typeof raw === 'object' ? raw : {};
    const broken = old.version === 2 && old.broken === true;
    const level = natural(old.level);
    const priorBest = natural(old.bestLevel);
    const bestLevel = priorBest > level ? priorBest : level;
    const pity = {};
    if (old.version === 2 && old.pity && typeof old.pity === 'object') {
      for (const [key, amount] of Object.entries(old.pity)) {
        if (/^\d+$/.test(key) && Number.isSafeInteger(amount) && amount > 0) pity[BigInt(key).toString()] = Math.min(amount, 9000);
      }
    } else if (Array.isArray(old.forgeMissesByLevel)) {
      old.forgeMissesByLevel.forEach((misses, from) => {
        if (Number.isFinite(misses) && misses > 0) pity[String(from + 1)] = Math.min(9000, Math.floor(misses) * 1200);
      });
    } else if (Number.isFinite(old.forgeMisses) && old.forgeMisses > 0) {
      pity[(level + 1n).toString()] = Math.min(9000, Math.floor(old.forgeMisses) * 1200);
    }
    const history = Array.isArray(old.history) ? old.history.filter(entry =>
      entry && ['success', 'reset', 'shatter', 'reforge', 'enchant', 'enchant-fail', 'protected', 'protection', 'sell', 'reroll'].includes(entry.kind) &&
      /^\d+$/.test(String(entry.from)) && /^\d+$/.test(String(entry.target)) && Number.isFinite(entry.at) &&
      (!['protection', 'sell'].includes(entry.kind) || /^\d+$/.test(String(entry.amount))) &&
      (entry.kind !== 'reroll' || Number.isInteger(entry.slot) && entry.slot >= 1 && entry.slot <= enchantmentLimit &&
        enchantments.some(effect => effect.id === entry.enchantment) && enchantments.some(effect => effect.id === entry.replaced) &&
        entry.enchantment !== entry.replaced && /^\d+$/.test(String(entry.valueBefore)) && /^\d+$/.test(String(entry.valueAfter)))
    ).slice(0, 12).map(entry => ({
      kind: entry.kind, from: String(entry.from), target: String(entry.target), at: entry.at,
      ...(/^\d+$/.test(String(entry.spent)) ? { spent: String(entry.spent) } : {}),
      ...(['enchant', 'reroll'].includes(entry.kind) && enchantments.some(effect => effect.id === entry.enchantment) ? { enchantment: entry.enchantment } : {}),
      ...(entry.kind === 'reroll' ? { replaced: entry.replaced, slot: entry.slot, valueBefore: String(entry.valueBefore), valueAfter: String(entry.valueAfter) } : {}),
      ...(entry.kind === 'shatter' && Number.isInteger(entry.lostEffects) && entry.lostEffects >= 0 && entry.lostEffects <= enchantmentLimit ? { lostEffects: entry.lostEffects } : {}),
      ...(['protection', 'sell'].includes(entry.kind) && /^\d+$/.test(String(entry.amount)) ? { amount: String(entry.amount) } : {}),
      ...(entry.kind === 'protected' && /^\d+$/.test(String(entry.to)) ? { to: String(entry.to) } : {}),
      ...(entry.kind === 'protection' && entry.tokenUsed === true ? { tokenUsed: true } : {}),
      ...(magics.some(magic => magic.id === entry.magicAwakened) ? { magicAwakened: entry.magicAwakened } : {}),
    })) : [];
    const protections = {};
    if (old.protections && typeof old.protections === 'object') {
      for (const [target, owned] of Object.entries(old.protections)) {
        if (/^[1-9]\d*$/.test(target) && owned === true) protections[target] = true;
      }
    }
    const savedEffects = !broken && Array.isArray(old.enchantments) ? old.enchantments.filter(id =>
      enchantments.some(entry => entry.id === id)).slice(0, enchantmentLimit) : [];
    if (!broken && !savedEffects.length) savedEffects.push(enchantments.some(entry => entry.id === old.enchantment) ? old.enchantment :
      raw ? ['cinder', 'frost', 'storm', 'astral', 'lunar'][Number((level / 8n + 4n) % 5n)] : rollEnchantment(random));

    return {
      version: 2,
      season: seasonId,
      level,
      bestLevel,
      appearance: old.appearance === 'auto' || forms.some(form => form.level.toString() === old.appearance && form.level <= bestLevel) ? old.appearance : 'auto',
      enchantment: savedEffects[0] ?? null,
      enchantments: savedEffects,
      magic: broken ? null : normalizeMagic(old.magic, level),
      shards: natural(old.shards, startingShards),
      broken,
      sold: broken && old.sold === true,
      generation: natural(old.generation),
      duel: normalizeDuel(old.duel),
      protections,
      protectionUses: natural(old.protectionUses, BigInt(history.filter(entry => entry.kind === 'protected').length)),
      rankingBest: normalizeSnapshot(old.rankingBest),
      appliedGrant: typeof old.appliedGrant === 'string' && /^[A-Za-z0-9_-]{1,80}$/.test(old.appliedGrant) ? old.appliedGrant : null,
      creditReceipts: Object.fromEntries(Object.entries(old.creditReceipts && typeof old.creditReceipts === 'object' ? old.creditReceipts : {}).filter(([id, applied]) => creditIdPattern.test(id) && applied === true)),
      rankBonus: old.rankBonus && Number.isInteger(old.rankBonus.rank) && old.rankBonus.rank >= 1 && old.rankBonus.rank <= 10 &&
        Number.isFinite(old.rankBonus.since) && old.rankBonus.since >= 0 && old.rankBonus.since <= now &&
        Number.isFinite(old.rankBonus.until) && old.rankBonus.until >= old.rankBonus.since && old.rankBonus.until <= old.rankBonus.since + 60000 ? { ...old.rankBonus } : null,
      attempts: natural(old.attempts),
      shattered: natural(old.shattered),
      pity,
      history,
      paidAt: timestamp(old.paidAt, now),
      lastAt: old.version === 2 && Number.isFinite(old.lastAt) ? timestamp(old.lastAt, now) : 0,
      legacy: old.version === 2 && old.legacy && typeof old.legacy === 'object' ? old.legacy : {
        region: old.region ?? 0,
        cleared: Array.isArray(old.cleared) ? old.cleared : [],
        polish: old.polish ?? 0,
        echo: old.echo ?? 0,
        miner: old.miner ?? 0,
      },
    };
  }

  function serialize(state) {
    return JSON.stringify(state, (_, value) => typeof value === 'bigint' ? value.toString() : value);
  }

  function loadSeason(raw, now = Date.now(), random = Math.random) {
    return restore(raw?.season === seasonId ? raw : null, now, random);
  }

  function validDuelTime(ms) {
    return Number.isSafeInteger(ms) && ms > 0 && ms < 165000;
  }

  function normalizeDuel(raw) {
    if (!validDuelTime(raw?.bestMs)) return { bestMs: null, spentTokens: 0, flawless: false };
    return {
      bestMs: raw.bestMs,
      spentTokens: Number.isInteger(raw.spentTokens) ? Math.max(0, Math.min(duelTokenAward, raw.spentTokens)) : 0,
      flawless: raw.flawless === true,
    };
  }

  function duelRewards(state) {
    const { bestMs, spentTokens, flawless } = state.duel;
    return {
      bestMs,
      tokens: bestMs === null ? 0 : duelTokenAward - spentTokens,
      flawless,
      aura: bestMs !== null && bestMs <= duelSpeedTarget,
    };
  }

  function recordDuelVictory(state, { ms, damageTaken }) {
    if (!validDuelTime(ms)) return null;
    const before = duelRewards(state);
    const newBest = before.bestMs === null || ms < before.bestMs;
    if (newBest) state.duel.bestMs = ms;
    if (damageTaken === 0) state.duel.flawless = true;
    const rewards = duelRewards(state);
    return {
      newBest,
      ...rewards,
      earnedTokens: before.bestMs === null ? duelTokenAward : 0,
      newTitle: !before.flawless && rewards.flawless,
      newAura: !before.aura && rewards.aura,
    };
  }

  function rankingName(value, limit) {
    const name = typeof value === 'string' ? value.trim().normalize('NFC') : '';
    if (!name || name.length > limit || !/^[가-힣ㄱ-ㅎㅏ-ㅣA-Za-z0-9 _.\-]+$/.test(name)) {
      throw new Error('이름은 한글·영문·숫자·공백과 _ . -로 입력해 주세요.');
    }
    return name;
  }

  function rankingRecord(state, nickname, weaponName) {
    if (state.broken) throw new Error('검이 깨졌어요. 새 검을 만든 뒤 등록해 주세요.');
    const snapshot = weaponSnapshot(state);
    if (!snapshot) throw new Error('이 무기는 랭킹의 표시 범위를 넘었어요. 강화는 계속할 수 있어요.');
    return {
      nickname: rankingName(nickname, 12), weaponName: rankingName(weaponName, 16),
      rulesVersion: rankingProtocol,
      ...snapshot,
    };
  }

  function weaponSnapshot(state) {
    if (state.broken) return null;
    const value = appraisal(state).value.toString();
    if (value.length > 512 || state.level.toString().length > 128) return null;
    return { level: state.level.toString(), value: value.padStart(512, '0'),
      appearance: forms.some(form => form.level.toString() === state.appearance) ? state.appearance : 'auto',
      effect1: state.enchantments[0], effect2: state.enchantments[1] ?? 'none', effect3: state.enchantments[2] ?? 'none',
      magic: magicAt(state)?.id ?? 'none', magicPeak: magicAt(state)?.peak.toString() ?? '0',
      ...(typeof state.protectionUses === 'bigint' && state.protectionUses.toString().length <= 128 ? { protectionUses: state.protectionUses.toString() } : {}),
    };
  }

  function normalizeSnapshot(row) {
    if (!row || typeof row.level !== 'string' || !/^(0|[1-9][0-9]{0,127})$/.test(row.level) ||
        typeof row.value !== 'string' || !/^[0-9]{512}$/.test(row.value)) return null;
    const ids = [row.effect1, row.effect2, row.effect3];
    if (ids[0] === 'none' || (ids[1] === 'none' && ids[2] !== 'none')) return null;
    const effects = ids.filter(id => id !== 'none');
    if (effects.some(id => !enchantments.some(effect => effect.id === id))) return null;
    return weaponSnapshot({ level: BigInt(row.level), enchantments: effects, broken: false,
      appearance: row.appearance,
      magic: row.magic === 'none' || row.magic == null ? null : normalizeMagic({ id: row.magic, peak: row.magicPeak }, BigInt(row.level)),
      protectionUses: typeof row.protectionUses === 'string' && /^(0|[1-9][0-9]{0,127})$/.test(row.protectionUses) ? BigInt(row.protectionUses) : undefined });
  }

  function sameWeaponRecord(a, b) {
    return !!a && !!b && ['value', 'level', 'effect1', 'effect2', 'effect3'].every(key => a[key] === b[key]) &&
      (a.magic ?? 'none') === (b.magic ?? 'none') && (a.magicPeak ?? '0') === (b.magicPeak ?? '0');
  }

  function applyAdminGrant(state, grant) {
    const credited = applyCredits(state, grant?.credits);
    return applyWeaponGrant(state, grant) || credited;
  }

  function applyCredits(state, credits) {
    if (!credits || typeof credits !== 'object' || Array.isArray(credits)) return false;
    let applied = false;
    for (const [id, credit] of Object.entries(credits)) {
      if (!creditIdPattern.test(id) || state.creditReceipts[id] === true || !credit || credit.season !== seasonId ||
          typeof credit.amount !== 'string' || !/^[1-9][0-9]{0,17}$/.test(credit.amount) ||
          !Number.isFinite(credit.issuedAt) || credit.issuedAt < 0) continue;
      state.shards += BigInt(credit.amount);
      state.creditReceipts[id] = true;
      applied = true;
    }
    return applied;
  }

  function applyWeaponGrant(state, grant) {
    if (!grant || grant.season !== seasonId || typeof grant.id !== 'string' || !/^[A-Za-z0-9_-]{1,80}$/.test(grant.id) ||
        state.appliedGrant === grant.id || !Number.isFinite(grant.issuedAt) ||
        !Array.isArray(grant.effects) || grant.effects.length !== enchantmentLimit ||
        grant.effects.some(id => !enchantments.some(effect => effect.id === id))) return false;
    const source = normalizeSnapshot(grant.source);
    if (!source) return false;
    // An authenticated owner may receive a one-time correction of an existing record.
    // Never resurrect a destroyed weapon or grant its effects to a subsequently made sword.
    if (!state.broken && state.lastAt <= grant.issuedAt && state.level >= BigInt(source.level) &&
        ['effect1', 'effect2', 'effect3'].every((key, index) => source[key] === (state.enchantments[index] ?? 'none'))) {
      state.enchantments = [...grant.effects]; state.enchantment = grant.effects[0];
    }
    const corrected = weaponSnapshot({ level: BigInt(source.level), enchantments: grant.effects, broken: false,
      appearance: source.appearance,
      magic: source.magic === 'none' ? null : { id: source.magic, peak: source.magicPeak },
      protectionUses: source.protectionUses === undefined ? undefined : BigInt(source.protectionUses) });
    if (!state.rankingBest || corrected.value > state.rankingBest.value) state.rankingBest = corrected;
    rememberWeapon(state);
    state.appliedGrant = grant.id;
    return true;
  }

  function rememberWeapon(state) {
    const snapshot = weaponSnapshot(state);
    if (snapshot && (!state.rankingBest || snapshot.value > state.rankingBest.value)) state.rankingBest = snapshot;
    else if (sameWeaponRecord(snapshot, state.rankingBest) && snapshot.protectionUses !== undefined &&
        (state.rankingBest.protectionUses === undefined || BigInt(snapshot.protectionUses) >= BigInt(state.rankingBest.protectionUses))) state.rankingBest.protectionUses = snapshot.protectionUses;
  }

  function formAt(level) {
    const last = forms.at(-1).level;
    if (level <= last) {
      const index = forms.findLastIndex(form => level >= form.level);
      return { ...forms[index], index, awakening: 0n, next: forms[index + 1]?.level ?? last + 1n };
    }
    const step = (level - last - 1n) / 10n;
    const start = forms.findIndex(form => form.level >= 52n), count = BigInt(forms.length - start), index = start + Number(step % count);
    return { ...forms[index], index, awakening: step / count + 1n, next: last + 1n + (step + 1n) * 10n };
  }

  function appearanceAt(appearance, level) {
    return forms.find(form => form.level.toString() === appearance) ?? formAt(level);
  }

  function selectAppearance(state, appearance) {
    if (appearance !== 'auto' && !forms.some(form => form.level.toString() === appearance && form.level <= state.bestLevel)) return false;
    if (state.appearance === appearance) return false;
    state.appearance = appearance;
    if (state.rankingBest) state.rankingBest.appearance = appearance;
    return true;
  }

  function cost(target) {
    if (target <= 32n) return BigInt(costs[Number(target - 1n)]);
    return 62000n + 3n * (target ** 3n - 32n ** 3n);
  }

  function reforgeCost(state) {
    return 8n + (state.bestLevel + 1n) ** 2n;
  }

  function productionBase(state) {
    const level = state.bestLevel;
    const miner = natural(state.legacy.miner);
    const polish = natural(state.legacy.polish);
    const echo = natural(state.legacy.echo);
    return 12n + level ** 3n / 6n + miner * 4n + polish * 2n + echo * 2n;
  }

  function incomeBreakdown(state) {
    const rate = productionBase(state) / 20n;
    const previous = (rate < 2n ? 2n : rate) * 2n;
    return { base: 4n, record: (previous - 4n) * 2n, current: state.broken ? 0n : state.level ** 2n / 2n };
  }

  function baseIncome(state) {
    const parts = incomeBreakdown(state);
    return parts.base + parts.record + parts.current;
  }

  function passiveCapacity(state) {
    // Twelve hours at the highest recorded level, excluding temporary rank bonuses.
    // Current-level drops, destruction and sales must never shrink the reserve.
    const capacity = baseIncome({ ...state, level: state.bestLevel, broken: false }) * 43200n;
    return capacity < startingShards ? startingShards : capacity;
  }

  function discountInfo(now = Date.now()) {
    const shifted = now + 9 * 60 * 60 * 1000;
    const day = Math.floor(shifted / 86400000) * 86400000 - 9 * 60 * 60 * 1000;
    for (const [start, end] of [[7, 8], [12, 14], [21, 24]]) {
      if (now >= day + start * 3600000 && now < day + end * 3600000) return { active: true, until: day + end * 3600000, endHour: end };
    }
    return { active: false };
  }

  function priceQuote(originalCost, now) {
    const discount = discountInfo(now).active;
    return { originalCost, cost: discount ? (originalCost + 1n) / 2n : originalCost, discount };
  }

  function rankReward(rank) {
    return Number.isInteger(rank) && rank >= 1 && rank <= 10 ? 100n - BigInt(rank - 1) * 5n : 0n;
  }

  function income(state, now = Date.now()) {
    const bonus = state.rankBonus;
    return baseIncome(state) + (bonus && now >= bonus.since && now < bonus.until ? rankReward(bonus.rank) : 0n);
  }

  function setRankBonus(state, rank, now = Date.now()) {
    state.rankBonus = rankReward(rank) ? { rank, since: now, until: now + 60000 } : null;
  }

  function collectPassive(state, now = Date.now()) {
    if (now < state.paidAt) {
      state.paidAt = now;
      return 0n;
    }
    const room = passiveCapacity(state) - state.shards;
    if (room <= 0n) {
      state.paidAt = now;
      return 0n;
    }
    const elapsed = Math.min(offlineLimit, now - state.paidAt);
    const seconds = Math.floor(elapsed / 1000);
    const start = now - state.paidAt > offlineLimit ? now - offlineLimit : state.paidAt;
    const end = start + seconds * 1000;
    const bonus = state.rankBonus;
    const eligible = bonus ? Math.max(0, Math.min(end, bonus.until) - Math.max(start, bonus.since)) : 0;
    const earned = BigInt(seconds) * baseIncome(state) + BigInt(Math.floor(eligible / 1000)) * (bonus ? rankReward(bonus.rank) : 0n);
    const credited = earned > room ? room : earned;
    state.shards += credited;
    // Time spent full is discarded, including fractions, so spending cannot claim it later.
    state.paidAt = credited === room || now - state.paidAt > offlineLimit ? now : state.paidAt + seconds * 1000;
    return credited;
  }

  function preview(state, now = Date.now()) {
    if (state.broken) {
      const quote = priceQuote(reforgeCost(state), now);
      return { ...quote, token: state.generation + ':reforge:' + quote.cost, target: 0n, success: 0, reset: 0, shatter: 0, bonus: 0 };
    }
    const target = state.level + 1n;
    const base = target <= 32n ? chances[Number(target - 1n)] : Math.max(800, 2000 - Number(target - 32n > 48n ? 48n : target - 32n) * 25);
    const bonus = state.pity[target.toString()] ?? 0;
    const success = base === 10000 ? base : Math.min(9500, base + bonus);
    const failure = 10000 - success;
    const destructionShare = target < 6n ? 0 : Math.min(40, 10 + Number(target > 36n ? 36n : target) - 6);
    const shatter = Math.floor(failure * destructionShare / 100);
    const quote = priceQuote(cost(target), now);
    return { target, ...quote, token: state.generation + ':' + target + ':' + quote.cost + ':' + !!state.protections[target.toString()], success, reset: failure - shatter, shatter, bonus: success - base,
      protectionDrop: state.level >= 100n ? 1n : 0n };
  }

  function enchantPreview(state, now = Date.now()) {
    const slots = state.enchantments.length;
    const full = slots >= enchantmentLimit;
    const baseCost = 100n + 10n * (state.level + 1n) ** 2n;
    const quote = priceQuote(state.broken ? 0n : baseCost * BigInt(full ? 3 : slots === 1 ? 1 : 2), now);
    return {
      slots, full, reroll: full && !state.broken,
      token: state.generation + ':' + state.level + ':' + state.bestLevel + ':' + state.enchantments.join(',') + ':' + quote.cost,
      // Price the held weapon; a previous high record must not penalize a fresh sword.
      ...quote,
      success: state.broken ? 0 : full ? 10000 : slots === 1 ? 6000 : 3000,
    };
  }

  function enchant(state, now = Date.now(), random = Math.random, expectedToken) {
    const offer = enchantPreview(state, now);
    if (state.broken || offer.full || now - state.lastAt < cooldown || state.shards < offer.cost || expectedToken !== undefined && expectedToken !== offer.token) return null;
    rememberWeapon(state);
    const success = Math.floor(random() * 10000) < offer.success;
    const effect = success ? rollEnchantment(random) : null;
    if (effect) state.enchantments.push(effect);
    rememberWeapon(state);
    state.shards -= offer.cost;
    state.lastAt = now;
    const event = {
      kind: success ? 'enchant' : 'enchant-fail', from: state.level.toString(), target: state.level.toString(), at: now,
      spent: offer.cost.toString(),
      ...(effect ? { enchantment: effect } : {}),
    };
    state.history.unshift(event);
    state.history.length = Math.min(state.history.length, 12);
    return { ...event, spent: offer.cost };
  }

  function act(state, now = Date.now(), random = Math.random, expectedToken) {
    if (now - state.lastAt < cooldown) return null;
    const offer = preview(state, now);
    if (state.shards < offer.cost || expectedToken !== undefined && expectedToken !== offer.token) return null;
    rememberWeapon(state);
    const from = state.level;
    const effectCount = state.enchantments.length;
    let kind;
    if (state.broken) {
      kind = 'reforge';
      state.enchantment = rollEnchantment(random);
      state.enchantments = [state.enchantment];
      state.magic = null;
      state.broken = false;
      state.sold = false;
      state.generation += 1n;
      state.level = 0n;
    } else {
      const roll = Math.floor(random() * 10000);
      state.attempts += 1n;
      if (roll < offer.success) {
        kind = 'success';
        state.level = offer.target;
        if (state.level > state.bestLevel) state.bestLevel = state.level;
        delete state.pity[offer.target.toString()];
      } else {
        kind = state.protections[offer.target.toString()] ? 'protected' : roll < offer.success + offer.reset ? 'reset' : 'shatter';
        state.pity[offer.target.toString()] = Math.min(9000, (state.pity[offer.target.toString()] ?? 0) + recoveryBonus);
        if (kind === 'protected') {
          delete state.protections[offer.target.toString()]; state.protectionUses += 1n;
          state.level -= offer.protectionDrop;
        }
        else state.level = 0n;
        state.broken = kind === 'shatter';
        if (state.broken) {
          state.shattered += 1n;
          state.enchantments = [];
          state.enchantment = null;
          state.magic = null;
        }
      }
    }
    let magicAwakened;
    if (kind === 'success' && state.level >= 100n && !state.magic && random() < 1 / 4096) {
      const element = magics[Math.min(magics.length - 1, Math.floor(random() * magics.length))];
      state.magic = { id: element.id, peak: state.level };
      magicAwakened = element.id;
    }
    if (state.magic && state.level > state.magic.peak) state.magic.peak = state.level;
    state.shards -= offer.cost;
    state.lastAt = now;
    rememberWeapon(state);
    const event = { kind, from: from.toString(), target: offer.target.toString(), at: now, spent: offer.cost.toString(),
      ...(kind === 'protected' ? { to: state.level.toString() } : {}),
      ...(magicAwakened ? { magicAwakened } : {}),
      ...(kind === 'shatter' ? { lostEffects: effectCount } : {}),
    };
    state.history.unshift(event);
    state.history.length = Math.min(state.history.length, 12);
    return { ...event, spent: offer.cost };
  }

  function reroll(state, now = Date.now(), random = Math.random, expectedToken) {
    const offer = enchantPreview(state, now);
    if (!offer.reroll || now - state.lastAt < cooldown || state.shards < offer.cost ||
        expectedToken !== undefined && expectedToken !== offer.token) return null;
    rememberWeapon(state);
    const valueBefore = appraisal(state).value;
    const index = Math.min(enchantmentLimit - 1, Math.floor(random() * enchantmentLimit));
    const replaced = state.enchantments[index];
    const enchantment = rollEnchantment(random, [replaced]);
    state.enchantments[index] = enchantment;
    state.enchantment = state.enchantments[0];
    state.shards -= offer.cost;
    state.lastAt = now;
    rememberWeapon(state);
    const event = { kind: 'reroll', from: state.level.toString(), target: state.level.toString(), at: now,
      spent: offer.cost.toString(),
      slot: index + 1, replaced, enchantment, valueBefore: valueBefore.toString(), valueAfter: appraisal(state).value.toString() };
    state.history.unshift(event); state.history.length = Math.min(state.history.length, 12);
    return { ...event, spent: offer.cost };
  }

  function protectionOffer(state, now = Date.now()) {
    const offer = preview(state, now);
    const quote = priceQuote(offer.target ? 1000n + offer.target ** 2n * 100n + cost(offer.target) * 8n : 0n, now);
    const owned = state.protections[offer.target.toString()] === true;
    const eligible = !state.broken && offer.success < 10000;
    const exchange = eligible && !owned && offer.target >= 101n && offer.target <= 110n && duelRewards(state).tokens > 0;
    return { target: offer.target, ...quote, token: state.generation + ':' + offer.target + ':' + quote.cost, owned, eligible, exchange,
      exchangeToken: exchange ? state.generation + ':' + offer.target + ':guardian:' + state.duel.spentTokens : null };
  }

  function buyProtection(state, now = Date.now(), expectedToken, useGuardianToken = false) {
    const offer = protectionOffer(state, now);
    if (!offer.eligible || offer.owned || now - state.lastAt < cooldown) return null;
    const token = useGuardianToken ? offer.exchangeToken : offer.token;
    if (expectedToken !== undefined && expectedToken !== token) return null;
    if (useGuardianToken ? !offer.exchange : state.shards < offer.cost) return null;
    const paid = useGuardianToken ? 0n : offer.cost;
    state.protections[offer.target.toString()] = true;
    state.shards -= paid;
    if (useGuardianToken) state.duel.spentTokens++;
    state.lastAt = now;
    const event = { kind: 'protection', from: state.level.toString(), target: offer.target.toString(), at: now, amount: paid.toString(),
      ...(useGuardianToken && { tokenUsed: true }) };
    state.history.unshift(event); state.history.length = Math.min(state.history.length, 12);
    return event;
  }

  function saleOffer(state) {
    const value = appraisal(state).value;
    return { value, shards: value / 10n, token: state.generation + ':' + state.level + ':' + state.enchantments.join(',') };
  }

  function sell(state, now = Date.now(), token) {
    const offer = saleOffer(state);
    if (state.broken || token !== offer.token || now - state.lastAt < cooldown) return null;
    rememberWeapon(state);
    const event = { kind: 'sell', from: state.level.toString(), target: '0', at: now, amount: offer.shards.toString() };
    state.shards += offer.shards;
    state.broken = true; state.sold = true; state.level = 0n;
    state.enchantments = []; state.enchantment = null; state.lastAt = now;
    state.magic = null;
    state.history.unshift(event); state.history.length = Math.min(state.history.length, 12);
    return event;
  }

  return { clientRevision, rankingProtocol, rankingBoard, rankingProfileKey, saveKey, reserveSaveKey, duelRecordKey, duelRewards, recordDuelVictory, legendsSaveKey, wardrobeSaveKey, previousSaveKey, magicSaveKey, storageSaveKey, riskSaveKey, rainbowSaveKey, marketSaveKey, olderSaveKey, legacySaveKey, backupKey, seasonId, startingShards, cooldown, recoveryBonus, offlineLimit, enchantmentLimit, forms, enchantments, magics, magicAt, appraisal, restore, loadSeason, serialize, rankingName, rankingRecord, weaponSnapshot, sameWeaponRecord, applyAdminGrant, rememberWeapon, formAt, appearanceAt, selectAppearance, cost, incomeBreakdown, discountInfo, passiveCapacity, baseIncome, income, rankReward, setRankBonus, preview, protectionOffer, buyProtection, saleOffer, sell, enchantPreview, collectPassive, act, enchant, reroll };
})();

if (typeof module !== 'undefined') module.exports = Forge;
