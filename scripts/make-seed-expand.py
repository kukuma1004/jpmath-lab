# -*- coding: utf-8 -*-
"""주제탐구/seed-expand.js 를 만든다.

렌즈 정의는 생성기에서 글자 그대로 떼어 온다. 손으로 옮기면 언젠가
어긋나고, 어긋나면 브라우저가 만든 씨앗과 생성기가 검증한 씨앗이
달라진다. 생성기도 이 파일을 vm 으로 읽어 쓰므로 둘은 항상 같다.
"""
import io, re

GEN = 'scripts/build-seed-catalog.mjs'
CLS = 'scripts/seed-classify.mjs'
OUT = '주제탐구/seed-expand.js'

gen = io.open(GEN, encoding='utf-8').read().split('\n')
cls = io.open(CLS, encoding='utf-8').read()


def block(lines, start_pat, end_pat):
    s = next(i for i, l in enumerate(lines) if l.startswith(start_pat))
    e = next(i for i in range(s + 1, len(lines)) if lines[i].startswith(end_pat))
    return '\n'.join(lines[s:e])


has_batchim = block(gen, 'function hasBatchim', 'function josa')
josa = block(gen, 'function josa', 'const LENSES')
lenses = block(gen, 'const LENSES = [', 'const SUBJECT_LABEL')

# 분류 규칙의 세 목록만 떼어 온다
def arr(name):
    m = re.search(r'const %s = \[(.*?)\n\];' % name, cls, re.S)
    return 'var %s = [%s\n  ];' % (name, m.group(1))


high = arr('HIGH_ONLY')
mid = arr('MIDDLE_OK')
real = arr('REAL_WORLD')

body = """/* 씨앗 확장기 — 200개 기본 주제와 10개 렌즈로 확장 씨앗을 만든다.

   확장 씨앗 1892개는 (기본 주제, 렌즈) 한 쌍에서 계산되는 값이다.
   그래서 본문을 파일에 담아 보내지 않고 여기서 만든다.
   담아 보내면 2.5 MB, 만들면 130 KB 다.

   이 파일은 scripts/make-seed-expand.py 가 생성기에서 떼어 만든다.
   직접 고치지 말고 scripts/build-seed-catalog.mjs 의 LENSES 를 고친 뒤
   다시 뽑는다. 생성기도 이 파일을 읽어 쓰므로 둘은 항상 같은 글자다. */
(function () {
  'use strict';

  %s
  }

  %s
  }

  %s
  ];

  /* ── 학교급과 출발점 ──────────────────────────────────────────
     규칙은 이 한 곳에 있다. 낱말을 고치면 씨앗의 분류가 바뀐다. */

  %s

  %s

  %s

  function hit(text, words) {
    for (var i = 0; i < words.length; i += 1) {
      if (text.indexOf(words[i]) > -1) return true;
    }
    return false;
  }

  function classifySeed(seed) {
    // 개념만으로는 모자란다. 뱅크 씨앗은 개념 칸에 제목이 들어 있는
    // 경우가 있어서 제목과 질문까지 함께 본다.
    var evidence = [
      (seed.concepts || []).join(' '), seed.title, seed.question, seed.baseTopic
    ].filter(Boolean).join(' ');
    var stage = hit(evidence, HIGH_ONLY)
      ? 'high'
      : (hit(evidence, MIDDLE_OK) ? 'middle' : 'high');

    var surface = [
      seed.title, seed.question, seed.baseTopic, seed.phenomenon, seed.situation,
      (seed.domain || []).join(' ')
    ].filter(Boolean).join(' ');
    var track = hit(surface, REAL_WORLD) ? 'connected' : 'internal';

    return { stage: stage, track: track };
  }

  /* ── 기본 주제와 씨앗 만들기 ───────────────────────────────── */

  // BASES 한 줄은 [과목, 주제, '개념,개념', 움직일 것] 이다.
  function toBase(row, index) {
    var num = String(index + 1);
    while (num.length < 3) num = '0' + num;
    return {
      code: num,
      subject: row[0],
      topic: row[1],
      concepts: row[2].split(',').map(function (x) { return x.trim(); }).filter(Boolean),
      knob: row[3],
      origin: ['econ', 'ai', 'culture'].indexOf(row[0]) > -1 ? 'connected' : 'internal'
    };
  }

  function buildSeed(base, lens) {
    var seed = {
      id: 'JP2K-' + base.subject.toUpperCase() + '-' + base.code + '-' + lens.id,
      src: 'seed2000',
      grade: 'B',
      subject: base.subject,
      title: lens.label + ' \\u00b7 ' + base.topic,
      question: lens.question(base),
      phenomenon: base.topic + '\\uc744 \\ud558\\ub098\\uc758 \\uc815\\ub2f5\\uc73c\\ub85c \\ub05d\\ub0b4\\uc9c0 \\uc54a\\uace0 \\u2018' + lens.label +
        '\\u2019\\uc758 \\uad00\\uc810\\uc5d0\\uc11c \\ub2e4\\uc2dc \\uc5ec\\ub294 \\uc218\\ud559 \\ub0b4\\ubd80\\ud615 \\ud0d0\\uad6c\\ub2e4.',
      concepts: base.concepts,
      domain: [base.origin === 'internal' ? '\\uc218\\ud559 \\ub0b4\\ubd80' : '\\ud604\\uc0c1 \\uc5f0\\uacb0', lens.label],
      relation: ['econ', 'ai', 'culture'].indexOf(base.subject) > -1 ? 'ADJACENT' : 'CORE',
      entry: 'highschool',
      ceiling: ['GENERALIZE', 'CONVERSE', 'COUNTER'].indexOf(lens.id) > -1
        ? 'undergraduate_intro'
        : 'highschool_advanced',
      status: 'candidate',
      act: lens.act(base),
      next: lens.next(base),
      origin: base.origin,
      lens: lens.id,
      baseTopic: base.topic,
      sourceNote: SOURCE_NOTE,
      asset: {
        label: '\\uc774 \\uc528\\uc557\\uc73c\\ub85c \\ud0d0\\uad6c \\uc2dc\\uc791',
        href: 'inquiry.html?seed=' + encodeURIComponent('JP2K-' + base.subject.toUpperCase() +
          '-' + base.code + '-' + lens.id)
      }
    };
    var cls = classifySeed(seed);
    seed.stage = cls.stage;
    seed.track = cls.track;
    return seed;
  }

  var SOURCE_NOTE = '2022 \\uac1c\\uc815 \\uad50\\uc721\\uacfc\\uc815, JP Math Lab ' +
    '\\uc544\\uc774\\ub514\\uc5b4\\ubc45\\ud06c, \\ub791\\ub370\\ubdf0 \\uc138\\ubbf8\\ub098\\uc758 ' +
    '\\uc8fc\\uc81c \\uc720\\ud615\\uc744 \\ucc38\\uace0\\ud574 \\uc0c8 \\uc9c8\\ubb38\\uc73c\\ub85c \\uc7ac\\uad6c\\uc131';

  var LENS_BY_ID = {};
  for (var li = 0; li < LENSES.length; li += 1) LENS_BY_ID[LENSES[li].id] = LENSES[li];

  // picks 는 [기본 주제 번호, 렌즈 id] 짝이다. 어느 쌍이 뽑혔는지는
  // 생성기가 정하고, 본문은 여기서 만든다.
  function expand(bases, picks) {
    var baseObjects = bases.map(toBase);
    var out = [];
    for (var i = 0; i < picks.length; i += 1) {
      var base = baseObjects[picks[i][0]];
      var lens = LENS_BY_ID[picks[i][1]];
      if (base && lens) out.push(buildSeed(base, lens));
    }
    return out;
  }

  window.JPSeedExpand = {
    LENSES: LENSES,
    toBase: toBase,
    buildSeed: buildSeed,
    classifySeed: classifySeed,
    expand: expand
  };
}());
""" % (
    '\n  '.join(has_batchim.rstrip().split('\n')[:-1]).replace('const ', 'var '),
    '\n  '.join(josa.rstrip().rstrip('\n').split('\n')[:-1]).replace('const ', 'var '),
    '\n  '.join(lenses.rstrip().rstrip('\n').split('\n')[:-1]).replace('const LENSES', 'var LENSES'),
    '\n  '.join(high.split('\n')),
    '\n  '.join(mid.split('\n')),
    '\n  '.join(real.split('\n')),
)

io.open(OUT, 'w', encoding='utf-8', newline='\n').write(body)
print('seed-expand.js 생성')
