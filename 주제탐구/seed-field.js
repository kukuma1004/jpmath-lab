/* 씨앗밭 — 탐구 씨앗을 교과로 거르고 말로 찾는다.
   데이터는 seeds.js 와 seeds-bank.js 에만 있다. 이 파일은 그리기만 한다.

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
    var state = { subject: 'all', q: '' };

    // 교과 차례로 줄 세운다. 급으로 줄 세우지 않는다 — 급은 학생 화면에 없다.
    var subjectOrder = Object.keys(DB.SUBJECT);
    seeds = seeds.slice().sort(function (a, b) {
      var d = subjectOrder.indexOf(a.subject) - subjectOrder.indexOf(b.subject);
      return d || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0);
    });

    var subjects = subjectOrder
      .filter(function (k) { return seeds.some(function (s) { return s.subject === k; }); });

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
        '<div class="sd-row"><span class="sd-row-label">찾기</span>' +
          '<input type="search" class="sd-search" placeholder="질문·개념·상황으로 찾기" ' +
            'aria-label="씨앗 찾기">' +
        '</div>' +
      '</div>' +
      '<p class="sd-count" aria-live="polite"></p>' +
      '<div class="sd-list"></div>' +
      '<p class="sd-note">씨앗 108개는 모두 <b>검증 전</b>이다. 수학·사실 검증과 선생님 검토를 지나야 확정된다. ' +
        '출처 · <code>주제 마이닝 1차</code> 12 · <code>아이디어 뱅크</code> 96</p>';

    var list = root.querySelector('.sd-list');
    var countEl = root.querySelector('.sd-count');

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
                esc(s.asset.label) + '에서 해보기 →</a>'
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
      if (state.q && haystack(s).indexOf(state.q) < 0) return false;
      return true;
    }

    function render() {
      var shown = seeds.filter(matches);
      countEl.textContent = shown.length
        ? '씨앗 ' + shown.length + '개'
        : '조건에 맞는 씨앗이 없다. 거르개를 풀거나 다른 말로 찾아 보자.';
      list.innerHTML = shown.map(card).join('');
    }

    root.querySelectorAll('.sd-chip').forEach(function (b) {
      b.addEventListener('click', function () {
        var g = b.dataset.group;
        state[g] = b.dataset.value;
        root.querySelectorAll('.sd-chip[data-group="' + g + '"]').forEach(function (x) {
          var on = x === b;
          x.classList.toggle('on', on);
          x.setAttribute('aria-pressed', on ? 'true' : 'false');
        });
        render();
      });
    });

    root.querySelector('.sd-search').addEventListener('input', function (e) {
      state.q = e.target.value.trim().toLowerCase();
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
