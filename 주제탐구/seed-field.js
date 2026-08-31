/* 씨앗밭 — 2,000개 탐구 씨앗을 교과·출발점·탐구 방식으로 거르고 말로 찾는다.
   데이터는 seeds-catalog-2000.js 에 모인다. 이 파일은 한 번에 필요한 카드만 그린다.

   씨앗은 출처마다 가진 항목이 다르다. 마이닝 씨앗은 교육과정 관계와
   입구/천장 급을 갖고, 뱅크 씨앗은 상황·화면·Lab 을 갖는다.
   없는 항목은 그리지 않는다. 비어 있으면 문서에 없는 것이다. */
(function () {
  'use strict';

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  function mount(root) {
    var DB = window.JPSeeds;
    if (!root || !DB) return null;

    var seeds = DB.all();
    var meta = DB.catalogMeta || window.JPSeedCatalogMeta || {};
    // 아래에 학생들이 올린 탐구가 있다. 씨앗밭이 그것을 덮지 않게 열 개씩만 보인다.
    var PAGE_SIZE = 10;
    var state = { subject: 'all', stage: 'all', track: 'all', lens: 'all', q: '', limit: PAGE_SIZE, random: null };

    // 원본 카탈로그 순서를 지킨다. 엄선 108개가 먼저 나오고,
    // 확장 후보도 렌즈별로 순환해 같은 주제가 연달아 몰리지 않는다.
    var subjectOrder = Object.keys(DB.SUBJECT);
    seeds = seeds.slice();

    var subjects = subjectOrder
      .filter(function (k) { return seeds.some(function (s) { return s.subject === k; }); });
    // 학교급과 출발점은 씨앗마다 붙여 둔 값이다. 규칙은 scripts/seed-classify.mjs 에 있다.
    var stages = [
      { key: 'middle', label: '중등', title: '중학교 교육과정 개념만으로 손댈 수 있는 씨앗' },
      { key: 'high', label: '고등', title: '고등학교에서 처음 만나는 개념이 필요한 씨앗' }
    ];
    var tracks = [
      { key: 'internal', label: '교과 안', title: '정의·조건·증명·반례처럼 수학 안에서 출발하는 씨앗' },
      { key: 'connected', label: '실생활 연결', title: '현실의 장면에서 출발해 수학으로 들어가는 씨앗' }
    ];
    var lenses = meta.lenses || [];

    function chip(group, value, label, n, on, title) {
      return '<button type="button" class="sd-chip' + (on ? ' on' : '') + '"' +
             ' data-group="' + group + '" data-value="' + esc(value) + '"' +
             (title ? ' title="' + esc(title) + '"' : '') +
             ' aria-pressed="' + (on ? 'true' : 'false') + '">' +
             esc(label) + '<i>' + n + '</i></button>';
    }

    function count(pick, value) {
      return seeds.filter(function (s) { return pick(s) === value; }).length;
    }

    root.innerHTML =
      '<div class="sd-controls">' +
        '<div class="sd-row"><span class="sd-row-label">교과</span><div class="sd-chips">' +
          chip('subject', 'all', '전체', seeds.length, true) +
          subjects.map(function (k) {
            return chip('subject', k, DB.SUBJECT[k].label,
              count(function (s) { return s.subject; }, k), false);
          }).join('') +
        '</div></div>' +
        // 학교급과 출발은 각각 세 개뿐이라 한 줄에 나란히 둔다. 줄이 늘면
        // 씨앗밭이 그만큼 길어지고 아래 학생 탐구가 밀린다.
        '<div class="sd-row sd-row-pair">' +
          '<span class="sd-row-label">학교급</span><div class="sd-chips">' +
            chip('stage', 'all', '전체', seeds.length, true) +
            stages.map(function (item) {
              return chip('stage', item.key, item.label,
                count(function (s) { return s.stage; }, item.key), false, item.title);
            }).join('') +
          '</div>' +
          '<span class="sd-row-label sd-row-label-2">출발</span><div class="sd-chips">' +
            chip('track', 'all', '전체', seeds.length, true) +
            tracks.map(function (item) {
              return chip('track', item.key, item.label,
                count(function (s) { return s.track; }, item.key), false, item.title);
            }).join('') +
          '</div>' +
        '</div>' +
        '<div class="sd-row"><span class="sd-row-label">방식</span>' +
          '<select class="sd-search sd-lens" aria-label="탐구 방식으로 거르기">' +
            '<option value="all">전체 탐구 방식</option>' +
            lenses.map(function (lens) {
              var n = seeds.filter(function (s) { return s.lens === lens.id; }).length;
              return '<option value="' + esc(lens.id) + '">' + esc(lens.label) + ' (' + n + ')</option>';
            }).join('') +
          '</select>' +
        '</div>' +
        '<div class="sd-row"><span class="sd-row-label">찾기</span>' +
          '<input type="search" class="sd-search sd-query" placeholder="질문·개념·상황으로 찾기" ' +
            'aria-label="씨앗 찾기">' +
        '</div>' +
      '</div>' +
      '<div class="sd-result-head"><p class="sd-count" aria-live="polite"></p>' +
        '<button type="button" class="sd-random">무작위 10개 만나기</button></div>' +
      '<div class="sd-list"></div>' +
      '<button type="button" class="sd-more" hidden>10개 더 보기</button>' +
      '<p class="sd-note">총 <b>' + seeds.length.toLocaleString('ko-KR') + '개</b> 가운데 ' +
        '<code>엄선 씨앗</code> ' + (meta.curated || 108) + '개와 <code>확장 후보</code> ' +
        (meta.generated || Math.max(0, seeds.length - 108)).toLocaleString('ko-KR') + '개를 함께 싣는다. ' +
        '확장 후보는 <b>검증 전</b>이며 수학 검증과 선생님 검토를 지나야 수업 주제로 확정된다.</p>' +
      // 씨앗밭 아래에 학생들이 올린 탐구가 있다. 여기서 바로 갈 수 있게 한다.
      '<a class="sd-to-collection" href="#collectionTitle">우리 반이 지금 하고 있는 탐구 보러 가기 ↓</a>';

    var list = root.querySelector('.sd-list');
    var countEl = root.querySelector('.sd-count');
    var moreButton = root.querySelector('.sd-more');

    function tags(arr, cls) {
      return '<span class="sd-tags">' + arr.map(function (x) {
        return '<span class="' + cls + '">' + esc(x) + '</span>';
      }).join('') + '</span>';
    }

    function row(term, value) {
      return value ? '<dt>' + esc(term) + '</dt><dd>' + value + '</dd>' : '';
    }

    function badges(s) {
      var out = '<span class="sd-subject">' + esc(DB.SUBJECT[s.subject].label) + '</span>';
      if (s.relation) {
        out += '<span class="sd-rel" title="' + esc(DB.RELATION[s.relation].desc) + '">' +
               esc(DB.RELATION[s.relation].label) + '</span>';
      }
      if (s.ceiling) {
        out += '<span class="sd-level">' + esc(DB.LEVEL[s.entry].label) + ' → ' +
               esc(DB.LEVEL[s.ceiling].label) + '</span>';
      }
      if (s.category) out += '<span class="sd-cat">' + esc(s.category) + '</span>';
      if (s.format) out += '<span class="sd-cat">' + esc(s.format) + '</span>';
      if (s.lens && lenses.length) {
        var lens = lenses.find(function (item) { return item.id === s.lens; });
        if (lens) out += '<span class="sd-cat">' + esc(lens.label) + '</span>';
      }
      return out;
    }

    function card(s) {
      var head = s.question || s.title;
      var sub = s.question ? s.title : '';
      var lead = s.phenomenon || s.situation || '';
      var body =
        (lead ? '<p class="sd-phenom">' + esc(lead) + '</p>' : '') +
        '<dl class="sd-meta">' +
          row('화면', s.scene ? esc(s.scene) : '') +
          row('해보는 것', s.act || s.lab ? esc(s.act || s.lab) : '') +
          row('학생 예측', s.predict ? esc(s.predict) : '') +
          row('충돌', s.conflict ? esc(s.conflict) : '') +
          row('반전', s.twist ? esc(s.twist) : '') +
          row('발견 문장', s.discovery ? esc(s.discovery) : '') +
          row('흔한 착각', s.misstep ? esc(s.misstep) : '') +
          row('필요한 수학', s.math ? esc(s.math) : '') +
          row('수학 개념', s.concepts ? tags(s.concepts, 'sd-tag') : '') +
          row('분야', s.domain ? tags(s.domain, 'sd-tag sd-tag-domain') : '') +
          row('다음 질문', s.next ? esc(s.next) : '') +
          row('메모', s.notes && s.notes.length
            ? s.notes.map(function (n) { return esc(n); }).join('<br>') : '') +
          row('확인 필요', s.caution ? '<b class="sd-caution">' + esc(s.caution) + '</b>' : '') +
        '</dl>' +
        (window.JPDeepDiveUI ? window.JPDeepDiveUI.cardCta(s) : '') +
        '<div class="sd-foot">' +
          (s.asset
            ? '<a class="sd-go" href="' + esc(s.asset.href) + '">' +
                esc(s.asset.label) + ' →</a>'
            : '<span class="sd-nolab">아직 만들지 않았다</span>') +
          '<code class="sd-id" title="' + esc(DB.SOURCE[s.src] || '') + '">' +
            esc(s.id) + '</code>' +
        '</div>';

      return '<details class="sd-seed" style="--sd-accent:' + DB.SUBJECT[s.subject].color + '">' +
        '<summary>' +
          '<span class="sd-line">' + badges(s) + '</span>' +
          '<span class="sd-question">' + esc(head) + '</span>' +
          (sub ? '<span class="sd-title">' + esc(sub) + '</span>' : '') +
        '</summary>' +
        '<div class="sd-body">' + body + '</div>' +
      '</details>';
    }

    // 찾기는 씨앗의 글자 전부를 훑는다. 개념 이름으로도, 상황의 낱말로도 걸린다.
    function haystack(s) {
      if (s._hay) return s._hay;
      var parts = [s.id, s.title, s.question, s.phenomenon, s.situation, s.scene,
                   s.lab, s.act, s.math, s.next, s.discovery, s.conflict,
                   s.predict, s.twist, s.category, s.format];
      if (s.concepts) parts = parts.concat(s.concepts);
      if (s.domain) parts = parts.concat(s.domain);
      if (s.notes) parts = parts.concat(s.notes);
      s._hay = parts.filter(Boolean).join(' ').toLowerCase();
      return s._hay;
    }

    function matches(s) {
      if (state.subject !== 'all' && s.subject !== state.subject) return false;
      if (state.stage !== 'all' && s.stage !== state.stage) return false;
      if (state.track !== 'all' && s.track !== state.track) return false;
      if (state.lens !== 'all' && s.lens !== state.lens) return false;
      if (state.q && haystack(s).indexOf(state.q) < 0) return false;
      return true;
    }

    function render() {
      var matched = seeds.filter(matches);
      var shown = state.random
        ? matched.filter(function (s) { return state.random.indexOf(s.id) > -1; })
        : matched.slice(0, state.limit);
      countEl.textContent = matched.length
        ? '찾은 씨앗 ' + matched.length.toLocaleString('ko-KR') + '개 · 지금 ' + shown.length + '개 보기'
        : '조건에 맞는 씨앗이 없다. 거르개를 풀거나 다른 말로 찾아 보자.';
      list.innerHTML = shown.map(card).join('');
      moreButton.hidden = Boolean(state.random) || shown.length >= matched.length;
      if (!moreButton.hidden) {
        var rest = matched.length - shown.length;
        moreButton.textContent = Math.min(PAGE_SIZE, rest) + '개 더 보기 (남은 ' +
          rest.toLocaleString('ko-KR') + '개)';
      }
    }

    function resetView() {
      state.limit = PAGE_SIZE;
      state.random = null;
    }

    root.querySelectorAll('.sd-chip').forEach(function (b) {
      b.addEventListener('click', function () {
        var g = b.dataset.group;
        state[g] = b.dataset.value;
        resetView();
        root.querySelectorAll('.sd-chip[data-group="' + g + '"]').forEach(function (x) {
          var on = x === b;
          x.classList.toggle('on', on);
          x.setAttribute('aria-pressed', on ? 'true' : 'false');
        });
        render();
      });
    });

    root.querySelector('.sd-query').addEventListener('input', function (e) {
      state.q = e.target.value.trim().toLowerCase();
      resetView();
      render();
    });

    root.querySelector('.sd-lens').addEventListener('change', function (e) {
      state.lens = e.target.value;
      resetView();
      render();
    });

    root.querySelector('.sd-random').addEventListener('click', function () {
      var pool = seeds.filter(matches).slice();
      for (var i = pool.length - 1; i > 0; i -= 1) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = pool[i]; pool[i] = pool[j]; pool[j] = temp;
      }
      state.random = pool.slice(0, PAGE_SIZE).map(function (s) { return s.id; });
      render();
    });

    moreButton.addEventListener('click', function () {
      state.limit += PAGE_SIZE;
      render();
    });

    // 깊이 탐구가 새로 실리면 카드의 안내가 달라지므로 다시 그린다.
    document.addEventListener('jp-deep-dive-unlocked', function () { render(); });

    render();
    return { render: render, seeds: seeds };
  }

  window.JPSeedField = { mount: mount };

  document.addEventListener('DOMContentLoaded', function () {
    var el = document.querySelector('[data-seed-field]');
    if (el) mount(el);
  });
}());
