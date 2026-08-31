# -*- coding: utf-8 -*-
"""아이디어 뱅크의 씨앗 96개를 주제탐구/seeds-bank.js 로 만든다.

문서에 적힌 것만 옮긴다. 없는 값은 넣지 않는다.
"""
import io, re, json

PATH = 'JP Math Lab × 2022 개정 교육과정 콘텐츠 아이디어 뱅크.md'
OUT = '주제탐구/seeds-bank.js'

CATEGORY_SUBJECT = {
    '극한·미분·적분': 'calc', '지수·로그·수열': 'algebra', '기하·벡터·공간': 'geo',
    '확률·통계': 'prob', '공통수학·논리·대수': 'common', '경제수학': 'econ',
    'AI·컴퓨터·이산수학': 'ai', '수학과 문화·시각': 'culture',
}

MATH_SUBJECT = [
    (('정적분', '미분', '극한', '도함수', '미분계수', '적분', '최적화', '순간변화율', '접선', '할선'), 'calc'),
    (('정사영', '공간벡터', '벡터', '내적', '포물선', '타원', '쌍곡선', '평면', '공간좌표', '이차곡선', '투영', '닮음'), 'geo'),
    (('확률', '조건부', '분포', '표본', '기댓값', '통계', '상관', '여사건', '편향'), 'prob'),
    (('복리', '현재가치', '이자', '손익', '탄력성', '할인', '기준량'), 'econ'),
    (('그래프이론', '최단경로', '경우의 수', '조합', '암호', '알고리즘', '과적합', '학습'), 'ai'),
    (('로그', '지수', '수열', '삼각함수'), 'algebra'),
    (('행렬', '복소수', '명제', '함수', '이차', '원의 방정식', '비례', '비율'), 'common'),
]

# 문서에 '필요한 수학'이 없거나 키워드가 안 걸리는 것만 손으로 정한다.
MOMENT_SUBJECT_FIX = {
    11: 'algebra',   # 종이 42번 접기 - 지수
    28: 'ai',        # 과적합 드로잉
    31: 'culture',   # 원근법 - S+ 63번과 같은 갈래
    # 아래 둘은 '필요한 수학'만 보면 기하·미적분으로 가지만,
    # 뱅크의 S+ 쪽은 같은 주제(AI와 벡터 55, 경사하강 56)를
    # AI·컴퓨터·이산수학으로 묶어 두었다. 문서 자신의 분류를 따른다.
    26: 'ai',        # AI의 단어 지도 = S+ 55 AI와 벡터
    27: 'ai',        # AI 산 내려가기 = S+ 56 경사하강
}


def unwrap(block):
    return re.sub(r'\s+', ' ', ' '.join(block)).strip()


def clean(s):
    s = s.replace('\\', ' ')
    s = re.sub(r'\*\*(.+?)\*\*', r'\1', s)
    s = re.sub(r'\s+', ' ', s)
    return s.strip().strip('"“”').strip()


def parse_splus(lines, start, end):
    out, cat, i = [], None, start
    while i < end:
        ln = lines[i]
        if ln.startswith('## '):
            cat = ln[3:].strip()
        elif ln.startswith('### '):
            m = re.match(r'### (\d+)\.\s*(.+)', ln)
            num, head = int(m.group(1)), m.group(2).strip()
            concept, lens = ([x.strip() for x in head.split('---', 1)] if '---' in head else (head, ''))
            j, bullets, cur = i + 1, [], None
            while j < end and not lines[j].startswith('#'):
                s = lines[j]
                if re.match(r'^-\s{2,}', s):
                    if cur:
                        bullets.append(unwrap(cur))
                    cur = [re.sub(r'^-\s+', '', s)]
                elif s.strip() and cur is not None:
                    cur.append(s.strip())
                j += 1
            if cur:
                bullets.append(unwrap(cur))
            seed = {'id': 'BANK-SPLUS-%02d' % num, 'src': 'splus', 'grade': 'S+',
                    'subject': CATEGORY_SUBJECT.get(cat, ''), 'category': cat,
                    'title': (concept + ' · ' + lens) if lens else concept,
                    'question': '', 'scene': '', 'lab': '', 'notes': []}
            for b in bullets:
                t = clean(b)
                if not t or t == 'S+':
                    continue
                if t.startswith('화면:'):
                    seed['scene'] = t[3:].strip()
                elif t.startswith('Lab:'):
                    seed['lab'] = t[4:].strip()
                elif not seed['question'] and b.strip().startswith('**'):
                    seed['question'] = t
                else:
                    seed['notes'].append(t)
            out.append(seed)
            i = j - 1
        i += 1
    return out


def parse_moments(lines, start, end):
    out, i = [], start
    while i < end:
        ln = lines[i]
        m = re.match(r'^## (\d+)\.\s*(.+)', ln)
        if m:
            num, title = int(m.group(1)), m.group(2).strip()
            j, body = i + 1, []
            while j < end and not lines[j].startswith('#'):
                body.append(lines[j])
                j += 1
            fields, loose, cur_key = {}, [], None
            for raw in body:
                s = raw.rstrip('\\').strip()
                if not s:
                    continue
                fm = re.match(r'^\*\*(.+?):\*\*\s*(.*)$', s)
                if fm:
                    cur_key = fm.group(1).strip()
                    fields[cur_key] = clean(fm.group(2))
                elif cur_key and not fields[cur_key].endswith(('.', '?', '!')):
                    # 앞 항목이 문장으로 끝나지 않았을 때만 이어 붙인다.
                    # 이미 끝난 문장 뒤의 줄은 다른 이야기이므로 따로 담는다.
                    fields[cur_key] = (fields[cur_key] + ' ' + clean(s)).strip()
                else:
                    loose.append(clean(s))
            math = fields.get('필요한 수학', '')
            subject = MOMENT_SUBJECT_FIX.get(num, '')
            if not subject:
                for keys, code in MATH_SUBJECT:
                    if any(k in math for k in keys):
                        subject = code
                        break
            seed = {'id': 'BANK-MOMENT-%02d' % num, 'src': 'moment',
                    'grade': fields.get('등급', 'S++'), 'subject': subject,
                    'title': title,
                    'question': fields.get('질문', ''),
                    'situation': fields.get('상황', '') or ' '.join(loose),
                    'math': math, 'predict': fields.get('학생 예측', ''),
                    'conflict': fields.get('충돌', ''),
                    'discovery': fields.get('발견 문장', ''),
                    'twist': fields.get('반전', ''),
                    'act': fields.get('조작', ''),
                    'format': fields.get('형식', ''),
                    'notes': ([v for k, v in fields.items() if k in ('핵심',) and v]
                              + (loose if fields.get('상황') else []))}
            out.append(seed)
            i = j - 1
        i += 1
    return out


def js_obj(d):
    keep = {k: v for k, v in d.items() if v not in ('', [], None)}
    return '  ' + json.dumps(keep, ensure_ascii=False)


def main():
    lines = io.open(PATH, encoding='utf-8').read().split('\n')
    idx = {}
    for n, ln in enumerate(lines):
        if ln.startswith('# S+ 후보'):
            idx['a'] = n
        elif ln.startswith('# 추가로 만들 가치가'):
            idx['b'] = n
        elif ln.startswith("# '수학이 필요한 순간'"):
            idx['c'] = n
        elif ln.startswith('# 영상과 Lab을 분리하지') and 'c' in idx and 'd' not in idx:
            idx['d'] = n

    splus = parse_splus(lines, idx['a'], idx['b'])
    moments = parse_moments(lines, idx['c'], idx['d'])
    seeds = moments + splus

    missing = [s['id'] for s in seeds if not s['subject']]
    assert not missing, '과목 미분류: %s' % missing
    assert len(splus) == 64 and len(moments) == 32, (len(splus), len(moments))

    header = '''/* 아이디어 뱅크에서 옮긴 탐구 씨앗 96개.
   출처: "JP Math Lab × 2022 개정 교육과정 콘텐츠 아이디어 뱅크.md"
     · 수학이 필요한 순간 32  (급 S++) — 학생이 수학을 발명할 수밖에 없는 상황
     · S+ 후보 핵심 주제 64   (급 S+)  — 다시 비틀어 만든 질문

   이 파일은 손으로 고치지 않는다. 뱅크 문서를 고치고 다시 뽑는다.
   문서에 없는 값은 넣지 않았다. 비어 있으면 문서에 없는 것이다.
   모두 검증 전이다. */
(function () {
  'use strict';

  window.JPSeedsBank = [
'''
    body = ',\n'.join(js_obj(s) for s in seeds)
    footer = '''
  ];
}());
'''
    io.open(OUT, 'w', encoding='utf-8', newline='\n').write(header + body + footer)

    from collections import Counter
    print('씨앗', len(seeds), '개 →', OUT)
    print('급 :', dict(Counter(s['grade'] for s in seeds)))
    print('과목:', dict(Counter(s['subject'] for s in seeds)))
    print('질문 있는 것:', sum(1 for s in seeds if s.get('question')))
    print('상황 있는 것:', sum(1 for s in seeds if s.get('situation')))
    print('화면 있는 것:', sum(1 for s in seeds if s.get('scene')))


main()
